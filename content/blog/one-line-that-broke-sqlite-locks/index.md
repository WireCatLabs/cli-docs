---
title: One line dropped every SQLite lock, and a 6 GB database broke
description: WAL mode, busy_timeout, no crashes and no disk errors, and still "database disk image is malformed". The cause was one writeFileSync before every open. How I found it through /proc/locks, reproduced it on an empty file, and why the recovery said nothing was lost.
date: 2026-11-09
tags: [cli]
cover: ./cover.jpg
coverAlt: "An open brass padlock with a smoked glass body, cracked and shifted glass sheets inside, a sewing pin barely touching its side, next to an empty jar and a second jar crumbling into dust"
author: viacheslav-ptsarev
draft: false
---

So my database broke. The shared WireCat store is one SQLite file that several CLIs write at once (Telegram, mail, memo and so on), and mine is 6 GB. WAL mode, `busy_timeout` of 5 seconds, the same SQLite build in every CLI, no crashes and no disk errors in the journal, and still at some point the mail sync failed with "database disk image is malformed", and everything else followed.

What broke it was one line that was only supposed to make sure the file exists:

```js
writeFileSync(file, "", { flag: "a", mode: 0o600 })
```

It ran before every writable open of the store. Appending zero bytes to a file sounds as harmless as it gets, but on Linux it was enough to drop every SQLite lock of a process that already had the store open. I found it through `/proc/locks` and reproduced it on an empty file the same evening. And later the recovery said 2 times out of 3 that nothing was lost, when something was.

## How it got noticed

The first mail sync failed at about 17:10 UTC, and from then on the memo timer failed on every run, more than 60 times by the evening. Message search failed on every query. Nobody heard about it, because a failed timer writes one line to stderr, and you only see it on the next manual run. `memo doctor` meanwhile said the store was fine, it didn't run `quick_check` or look at the search indexes.

An agent that was checking search in the evening ran into `fts5: corruption`. I ran `quick_check` on a copy and got 687 lines of problems in about 36 tables, not only in indexes but in the source tables too. There were pages that two tables point to at once, indexes with the wrong number of entries, pages nobody uses. That doesn't look like a bad sector, more like two processes writing the file without seeing each other.

I stopped the timers and went to see who was holding the file. The most suspicious were two long-lived `wa serve` processes (the WhatsApp CLI server) that had been running since the night. Here's what `/proc/locks` had for them (the process and inode numbers here are made up):

```text
POSIX  ADVISORY  READ  4101 103:05:7777 128 128
POSIX  ADVISORY  READ  4102 103:05:7777 128 128
```

That's a lock on one byte in the `-shm` file, which SQLite uses to tell that a process is still alive (the dead-man lock). And on the database file itself they held no lock at all. A normal WAL connection holds a shared lock on a service area of the database file for its whole life, bytes around 1073741826, far past the data, and that's how other processes see someone is using the database. I checked that later on a clean file. These 2 processes had no such lock.

And `/proc/<pid>/fd` for both showed `wirecat.db-wal (deleted)` and `wirecat.db-shm (deleted)`. So the WAL had been deleted on disk, and these processes kept writing into it, the last time around 21:20, 4 hours after the first error. Plus each of them had the store open twice, and that second open is exactly what broke everything.

## One line and POSIX locks

On Unix SQLite keeps its locks with POSIX advisory locks (`fcntl`). They have a nasty property - `close()` of any descriptor of a file drops every POSIX lock the process holds on that file, not only the ones taken through that descriptor. And the process has no way to find out its locks are gone. The SQLite docs have a section about it in [How To Corrupt An SQLite Database File](https://www.sqlite.org/howtocorrupt.html#_posix_advisory_locks_canceled_by_a_separate_thread_doing_close_). The library itself works around this, the problem appears only when something in the same process opens the database file behind SQLite's back.

And `writeFileSync(file, "", { flag: "a" })` does exactly that, it opens the file, appends zero bytes and closes it. On its own it breaks nothing. But `wa serve` opened the store twice, the main connection and a separate one for the agent's action log. The second open ran this line, and the first connection was silently left without locks.

Then the chain goes like this:

1. Some other process closes its last connection. It can't see any locks from `wa serve`, so it thinks it's the last one, checkpoints and deletes `-wal` and `-shm`.
2. `wa serve` keeps writing into its WAL, which is already deleted. For it nothing has changed.
3. The other processes meanwhile create a new WAL and write into the real file.
4. When `wa serve` has gathered enough pages, it runs its own checkpoint and writes old pages over a file the others have long since changed.

That's how you get pages that belong to two tables. And that's most likely why everything looked fine for hours - the store doesn't break when the locks are lost, it breaks when the stale WAL is checkpointed, which takes about 1000 pages of writes or an explicit checkpoint.

I reproduced it the same evening, without cli-core, on synthetic tables. Shortened, it looks like this (full file: [T1-minimal.mjs](https://github.com/WireCatLabs/cli-testing/blob/main/performance/store/integrity/T1-minimal.mjs)):

```js
const db = new DatabaseSync(path)                       // the long-lived process
db.exec("PRAGMA journal_mode=WAL; CREATE TABLE a(...); CREATE TABLE b(...); INSERT INTO a ...")
writeFileSync(path, "", { flag: "a" })                  // the line: no more locks on the database
execFileSync("sqlite3", [path, "INSERT INTO b ..."])    // someone else's close deletes -wal and -shm
db.exec("INSERT INTO a ...")                            // writing into a deleted WAL
other("3000 inserts into b")                            // another process grows the real file
for (let i = 0; i < 1500; i++) db.exec("INSERT INTO a ...")
db.exec("PRAGMA wal_checkpoint(TRUNCATE)")              // old pages over the live file
```

In the first probe, before the `writeFileSync`, `/proc/locks` shows the process with both the lock on the database and the byte in `-shm`, after it only the byte is left. After `sqlite3` closes, there's no `-wal` or `-shm` on disk, and the first process's WAL descriptor is marked `(deleted)`. When it checkpoints, a new connection gets the same "database disk image is malformed" as the mail sync, and `quick_check` says `Tree 3 page 3 cell 0: invalid page number 2904`.

The fix is basically one line too: [cli-core #2578](https://github.com/WireCatLabs/cli-core/pull/2578). If the file is missing, it's created with the `wx` flag, and if it exists, only write access is checked with `accessSync`, which opens no descriptor. It came out in cli-core 0.599.0, and tg, max, wa, memo and mail moved to it or the next version the same day. The fix comes with a test that opens the store, takes `BEGIN IMMEDIATE`, counts its own process's lines in `/proc/locks`, opens the store a second time and checks the count is the same. It fails on the old code. After that processes started moving to one connection, so even if this regresses there is no second open.

## Who deleted the WAL

I thought any process that closes last could delete the WAL. In the notes I kept while digging into it I even wrote that `node:sqlite` deletes it too after an explicit `wal_checkpoint(TRUNCATE)`. And in the incident report I crossed "different SQLite builds" off the suspects: every CLI runs on Node 24.19.0 with SQLite 3.53.3, and the system `sqlite3` 3.46.1 is only used in the weekly backup.

Then I built a harness in cli-testing to break the store on purpose, on synthetic data. Like almost all the code here, agents wrote and ran it, and I set the tasks and decided what to do with the results. The first runs on the old cli-core just didn't break. I found one reason fast - my test `serve` wrote and checkpointed often, and SQLite skips the checkpoint on close (and the deletion with it) if someone wrote to the file since the closing process last read it. The real `wa serve` wrote rarely. But even with that, without `sqlite3` in the scenario the store stayed intact.

So I checked each "closer" on its own ([closers.mjs](https://github.com/WireCatLabs/cli-testing/blob/main/performance/store/integrity/closers.mjs)). One process keeps the store open, a second one opens it, does one thing and closes. I ran each variant 2 times, once with the first process having lost its locks and once with its locks kept.

| Who closes | First lost its locks | First kept its locks |
| --- | --- | --- |
| Node (SQLite 3.53.3): plain open/close, SELECT, INSERT, INSERT then checkpoint PASSIVE or TRUNCATE | WAL kept | WAL kept |
| Bun (SQLite 3.53.0): INSERT | WAL kept | WAL kept |
| `sqlite3` shell 3.46.1: SELECT or INSERT | WAL and shm deleted | WAL kept |

So on my machine only the old shell deleted the WAL, even on a plain SELECT, and only next to a process that had already lost its locks. My own note about Node didn't hold up on the harness. Which means the bug needs a second actor with an older SQLite, and that's probably why it stayed hidden so long, in my runs the CLIs' Node processes never deleted each other's WAL.

Why 3.53 doesn't do it and 3.46.1 does, I never figured out. The same SQLite page says that starting with 3.51.0 there are extra defenses against these locks dropped by `close()`, for WAL and several processes. Looks like the explanation, but I didn't check it in the code. It's also an inference, not a fact, that the shell or another program with an older SQLite opened my store that day. Nothing recorded which program opened the file. I also only know roughly when the WAL was deleted.

On the harness, scenario T1 (a long-lived `serve` opens the store a second time, 3 short writers and `sqlite3` next to it, 60 seconds) broke the store in 3 of 3 runs on cli-core 0.593.0, the first writer error after 5-8 seconds. On cli-core 0.608.0 the same scenario passed 3 of 3, with `serve` opening the store a second time 17-18 times per run and nothing happening.

## The recovery said nothing was lost

I restored the store with `store recover run`, which an agent built at my request right after the incident. It copies every readable row with the `sqlite3` shell's `.recover`, fills the search and vector indexes again, checks the copy and swaps the file. The file came out intact. At least 31 emails were missing from it, they were found by their ids, and they were still on the mail server.

Then I ran the same recovery on stores the harness had broken and compared against the writers' ledgers, where every committed batch is recorded.

| Broken store | Recovery time | Report said lost | Messages committed in the run / missing after |
| --- | ---: | --- | --- |
| 1 | 4.0 s | nothing | 970 / 50 |
| 2 | 4.0 s | 97 messages | 1,490 / 250 |
| 3 | 4.7 s | nothing | 910 / 50 |

Every time the recovered file passed `quick_check`, `integrity_check` and all 25 FTS5 checks, and committed messages were still missing from it, and 2 times out of 3 the report said nothing was lost. The recovery counted rows before and after its own copy, and the rows the stale checkpoint had overwritten earlier were no longer in the damaged file, there was nothing to count.

Then I ran the harness 3 more times, now with writers that write like the real tg, mail and memo, and recovered those 3 stores too. In 1 run of 3 every check passed on the store as it was, so nobody would even have run a recovery, and 80 committed messages were still gone. Those are the rows `serve` wrote into the WAL someone else's close had deleted, they never reached the database file. Over the 6 recoveries in all (3 from the table and these 3), 50 to 300 committed messages were lost each time (and in one run 40 notes too), and no report named them in full: 5 times it reported no loss at all, once 97 of 250.

The report doesn't lie like that anymore ([cli-core #2759](https://github.com/WireCatLabs/cli-core/pull/2759), out in 0.618.0). Before the copy it compares each index of the damaged file with its table. A stale page overwrites the table but the indexes stay old, and the difference shows how many rows disappeared. That's a lower bound, so the report says "at least N gone" or "how many were lost is unknown", and never "nothing lost". And the bound is well below the truth, on the second store it says "at least 200" where 241 are gone.

Along the way it started putting back rows that `.recover` puts into a separate table for rows with no owner. On the second store that table held 9 messages. But it doesn't bring back what was lost, the same store is still missing 241 of 250. Those can only come back from the source. So after a recovery the chats and mail folders are marked as not fetched from a day before the last deep check that passed, and the next ordinary sync fetches them again. On the harness I checked that on 3 other stores and only for messages, and the sync fetched them all. Mail I only checked with a test, and I didn't try it on a real messenger. Whatever was lost before that day, plus notes and anything that only lived in the store, doesn't come back this way.

By the way, the first version of that count used `EXCEPT`, and SQLite 3.53 counted 144 lost rows on a damaged index where 50 were lost. It walked the index's order, and a damaged index has no order. The 3.46 shell gave 50 on the same query. We rewrote it with `GROUP BY`.

## If you have Node and SQLite in one process

Don't open the database file with anything other than SQLite while the process has a connection. Not only `writeFileSync`, but `readFileSync`, `copyFileSync`, a hash of the file and so on, any of them drops the locks on close. `statSync`, `existsSync` and `accessSync` open no descriptor, those are fine. For a copy of a live database there's `backup()` in `node:sqlite` or `store backup`, and I'd run the `sqlite3` shell's `.backup` on a copy, not on the live file, because an old shell next to a process without locks is what deletes the WAL.

Plus one connection per process. Even if someone brings such a line back, there's no second open. So far I've checked that only on memo, and any other `fs` open of the file still drops the locks.

Also a failed sync shouldn't keep quietly trying to write into a broken store. Mine did that for about 5 hours, from the first error until I stopped the timers. Now on the first "malformed" a damage marker appears next to the store, and until it's recovered nobody opens it for writing. A server that already holds a connection isn't stopped by it, the marker only blocks new opens. And `doctor --deep` checks the whole file and remembers the last time the store was intact.

When I tried to work out what was lost, it turned out that successful mail and memo syncs leave no records at all, and the "last clean write" had to be pieced together from timer finish times. Now a committed write to the store leaves an event in the run record (table, kind of change, row count, no content). On writes shaped like the real CLIs it costs 0-3%, and in the worst case, where each transaction inserts one row and nothing else, from 8% at 2,000 transactions to 18% at 200.

And I wouldn't take a recovery report at its word, even my own. After any damage, check against the source (the mail server, the messenger, a backup).

The harness now tests a lot more than this one bug:

- 50 `kill -9`s in the middle of a transaction, 50 in the middle of a checkpoint, killed migrations and so on. The current cli-core survived all of it.
- The only things that broke it were other programs touching the store's files themselves, like a deleted `-shm`, a swapped `-wal` or a sync client putting an old copy back over the live file.
- So I wouldn't keep the store in a synced folder.
- If SQLite rolled a transaction back itself because of an I/O error, our own `ROLLBACK` failed with "cannot rollback - no transaction is active", and that error went out instead of the real one. That was fixed in #2759 too.

## What I didn't measure

- A real power cut. The harness kills processes, and the page cache survives that. An honest test needs `dm-flakey`, which needs root.
- A really full disk. Instead there's a per-process file size limit, and SQLite reports it as an I/O error.
- Long runs. Scenarios ran 1 to 2.5 minutes, most of them once per version. What passed once could have broken on a second run.
- My 6 GB store, or any store over about 130 MB. The harness store is small on purpose, so an automatic checkpoint happens every few seconds.
- Bun as the writers' main runtime.
- Long email bodies in my store. Their continuation pages could have been overwritten, and I didn't check whether they got cut.
- Why SQLite 3.53 doesn't delete the WAL where 3.46.1 does.

All scripts and results are in [cli-testing](https://github.com/WireCatLabs/cli-testing/blob/main/performance/store/integrity/README.md), with a list of [what can happen again](https://github.com/WireCatLabs/cli-testing/blob/main/performance/store/integrity/README.md#what-can-happen-again). It's all synthetic, `T1-minimal.mjs` and `closers.mjs` run without cli-core, you only need the `sqlite3` shell. If you get something different on another SQLite version, write to me. I want to know who else deletes the WAL under a process without locks.
