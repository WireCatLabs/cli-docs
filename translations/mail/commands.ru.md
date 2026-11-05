---
title: "Команды mail"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Все команды, параметры и коды выхода, созданные из самой программы. Тот же список в JSON выводит
`mail commands --json`.

**Первое слово — профиль**, имя, которое вы выбираете сами: `mail personal config show`. `MAIL_PROFILE`
задаёт профиль для всего сеанса оболочки. Профиль никогда не подставляется сам: команда, которой нужен аккаунт, без
профиля останавливается и показывает профили на этом компьютере. Описания команд и параметров ниже остаются на
языке встроенной справки.

## Параметры всех команд

| Option | What it does |
|---|---|
| `-V, --version` | output the version number. |
| `-v, --verbose` | more detail in what is shown: -v ids, -vv everything we know. Default: `0`. |
| `--json` | machine-readable output: one JSON value on stdout; --json=id,text keeps only those fields. |
| `--jsonl` | machine-readable output: one JSON object per line, for streaming and jq. |
| `--quiet` | diagnostics off; a failure is still said. |
| `--trace` | the connection's own log lines on stderr — never content. |
| `--debug` | on a failure, its whole record — cause and stack — in place of the short line. |
| `--timeout <duration>` | give up on the whole command after this — 30s, 2m, 500ms. |
| `--offline` | answer from what was recorded and never connect; fails if nothing was. |
| `--no-input` | never prompt or open interactive login; piped input remains available. |
| `--max-input-bytes <bytes>` | maximum buffered input bytes (default: 16777216). |
| `--max-output-bytes <bytes>` | maximum machine output bytes (default: 4194304; 0 disables). |
| `--brief` | found items as reference, title, time, author and excerpt only. |
| `--full` | found items with their whole text and every provider field. |
| `--compact` | one line per item for an agent: reference first, text last, paging and next steps as # lines. |
| `--dry-run` | preview parsed arguments and permissions before running the action. |
| `--yes` | go ahead without the question an ask level puts before a write. |
| `--record` | keep this run even where the config says record false; record_input false leaves the typed words out. |
| `--no-record` | do not keep this run, even if it fails. |

## `mail commands`

every command by section; --json prints its contract, one path per call

### `mail commands info`

one command contract, or all schemas, error reasons and explicit overrides

```sh
mail commands info [path]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | one command path; without one, export schemas, error reasons and explicit overrides. |

**Returns:** one command contract, or all schemas, error reasons and explicit overrides

**Example:** `mail commands info commands`

## `mail session`

keep this profile's app password in the OS keyring

### `mail session start`

sign this profile in. A new profile needs its mailbox: --address, or it is asked at a terminal; the server is found (built-in providers, the MX record, ISPDB, the domain's autoconfig; all providers: https://github.com/WireCatLabs/mail-cli/blob/main/docs/providers.md); for a domain the built-in table does not know, the domain, never the address, goes to the DNS resolver, autoconfig.thunderbird.net and autoconfig.<domain>, and --provider or --host skips those lookups; the steps to prepare the mailbox are shown, the app password is asked (hidden) or read from MAIL_PASSWORD, checked against the server, and only then the profile and the keyring entry are saved. Outlook.com and Microsoft 365 sign in with OAuth instead, and Gmail with your own Google app (--client-file): the browser opens the provider's page, and the token is checked against the server before it is kept. An existing profile only asks for the password, or signs in, again. Without a terminal nothing is asked: a missing --address or password is a validation error

**Changes something on this computer only.**

```sh
mail session start [options]
```

| Option | What it does |
|---|---|
| `--address <email>` | the full mail address of a new profile, also the login for most providers. |
| `--provider <provider>` | skip discovery and use a built-in provider: Yandex, Gmail, iCloud, Mail.ru, Fastmail, Microsoft 365, Outlook. |
| `--host <host>` | skip discovery and use this IMAP host. |
| `--port <port>` | IMAP port (default 993). |
| `--security <mode>` | tls or starttls (default tls). |
| `--login <login>` | the login name, when it is not the full address. |
| `--folder <folder>` | sync only this folder; repeat it for more. Default: ``. |
| `--no-browser` | OAuth: print the sign-in link instead of opening the browser. |
| `--client-file <file>` | Gmail over OAuth: your own Google Desktop app client JSON (chmod 600). |
| `--credential-storage <storage>` | where the password is kept: keyring (the default, which falls back to a private file by itself when no keyring works), or file, not recommended. Default: `keyring`. |

**Returns:** sign in; a new profile is created first

**Example:** `mail personal session start --address me@example.com`, `mail work session start --address me@outlook.com`, `mail gm session start --address me@gmail.com --client-file ~/client.json`

### `mail session status`

show where this profile's app password comes from, or what its OAuth sign-in allows and until when; no password or token is ever printed

```sh
mail session status [options]
```

| Option | What it does |
|---|---|
| `--check` | log in to the server to prove the password or sign-in still works. |

**Returns:** mail session status — profile, state, auth, password_from, address, verified, oauth; every field: mail commands info session status

**Example:** `mail personal session status`, `mail personal session status --check --json`

### `mail session end`

forget this profile's app password or OAuth sign-in on this computer; synced mail stays

**Changes something on this computer only.**

```sh
mail session end [options]
```

| Option | What it does |
|---|---|
| `--revoke` | Gmail over OAuth: also ask Google to revoke the sign-in, which ends every sign-in of that Google project. |

**Returns:** forget this profile's password or sign-in; synced mail stays

**Example:** `mail personal session end`

### `mail session list`

list the profiles on this computer, each with its address and where its app password comes from; picks none and asks no server

```sh
mail session list
```

**Returns:** mail profile — profile, address, auth, password_from; every field: mail commands info session list

**Example:** `mail session list`, `mail session list --json`

## `mail account`

the mailbox behind this profile

### `mail account check`

log in to the server and list what it supports (IDLE, CONDSTORE, MOVE, Gmail extensions)

```sh
mail account check
```

**Returns:** mail account check — profile, host, port, security, password_from, login, capabilities, features, and 1 more; every field: mail commands info account check

**Example:** `mail personal account check`, `mail personal account check --json`

### `mail account inspect`

read the headers of the mailbox's mail, store nothing, and group it by mailing list or sender, the largest group first; each group's suggest is skip when a group has at least 20 emails, at least 80% of them list or bulk mail (List-Id, List-Unsubscribe or Precedence: bulk) and the owner never sent mail to its sender. Its score adds: in Gmail's Spam +4, Gmail's DMARC check failed +3 (only beside another sign of fraud), a brand in the display name sent from another domain +3, the domain under 180 days old when the mail came +5 (only with looked-up ages), Reply-To on another domain +1, none of its mail ever opened +2, Gmail's DKIM check not passed +2, a throwaway-mail domain +2, bulk mail never replied to +1, replied to by the owner -5. The owner decides; rules add adds a rule

```sh
mail account inspect [options]
```

| Option | What it does |
|---|---|
| `--since-time <time>` | only mail received since this date or time; a date alone starts at local midnight (default: all mail). |
| `--limit <n>` | show this many of the largest groups. Default: `50`. |
| `--folder <folder>` | a folder to read; repeat it for more (default: the profile's folders, else INBOX and Sent; All Mail on Gmail). Default: ``. |
| `--domain-age` | ask each shown sender domain's registry when it was registered (RDAP); tells each registry its domain. |

**Returns:** mail account inspect — address, folders, emails, bytes, sent, without_headers, groups, items, and 3 more; every field: mail commands info account inspect

**Example:** `mail gm account inspect`, `mail gm account inspect --since-time 2025-01-01 --limit 20 --domain-age`

## `mail folders`

the folders of this profile's mailbox

### `mail folders list`

the folders of the mailbox with their role (inbox, sent, trash, ...) and message counts

```sh
mail folders list
```

**Returns:** mail folder — path, name, role, messages, unseen; every field: mail commands info folders list

**Example:** `mail personal folders list`, `mail personal folders list --json`

### `mail folders create`

make a folder on the server; on Gmail it is a label

**Changes something in the service.**

```sh
mail folders create <folder>
```

| Argument | | What it is |
|---|---|---|
| `folder` | required | the folder's path; the server's separator (usually / or .) makes a subfolder. |

**Returns:** mail folder change — action, folder, to, messages, applied, hint; every field: mail commands info folders create

**Example:** `mail personal folders create Receipts`, `mail personal folders create Work/2026`

### `mail folders rename`

rename a folder of your own on the server; the inbox and the special folders keep their names

**Changes something in the service.**

```sh
mail folders rename <folder> <name>
```

| Argument | | What it is |
|---|---|---|
| `folder` | required | the folder, by path or name. |
| `name` | required | its new path. |

**Returns:** mail folder change — action, folder, to, messages, applied, hint; every field: mail commands info folders rename

**Example:** `mail personal folders rename Receipts Invoices`

### `mail folders delete`

delete a folder of your own; it must be empty (move or delete its mail first), unless --allow-dangerous, which loses that mail for good; a preview without --yes

**Changes something in the service.**

```sh
mail folders delete <folder> [options]
```

| Argument | | What it is |
|---|---|---|
| `folder` | required | the folder, by path or name. |

| Option | What it does |
|---|---|
| `--yes` | delete it; without it, only a preview. |
| `--dry-run` | only preview, even with --yes. |
| `--allow-dangerous` | delete a folder that still holds mail: that mail is gone for good, no restore. |

**Returns:** mail folder change — action, folder, to, messages, applied, hint; every field: mail commands info folders delete

**Example:** `mail personal folders delete Old --yes`

## `mail sync`

read mail from the server into the shared store; mail already stored is skipped

**Changes something on this computer only.**

```sh
mail sync [options]
```

| Option | What it does |
|---|---|
| `--since-time <time>` | only mail received since this date or time; a date alone starts at local midnight, a time without a zone is local (default: 30 days). |
| `--limit <n>` | save at most this many new emails in this run, newest first. |
| `--max-pages <pages>` | at most this many requests to the mail server in this run; as many as fit the deadline if not given. |
| `--folder <folder>` | a folder to read; repeat it for more (default: the profile's folders, else INBOX and Sent; All Mail on Gmail). Default: ``. |
| `--attachments` | read attachments into the search index this run, whatever the profile's read_attachments. |
| `--no-attachments` | read no attachment this run; each is stored with its name and size, without text. |
| `--max-attachment-mb <mb>` | the largest attachment to read this run, in MB (default: the profile's max_attachment_mb, else 10). |
| `--rescan` | list the whole window again; also moves stored replies into their thread where the server has no thread ids. |

**Returns:** mail sync — address, since, timezone, folders, state, requests, listed, saved, and 14 more; every field: mail commands info sync

**Example:** `mail personal sync`, `mail personal sync --since-time 2026-10-01 --limit 200`, `mail personal sync --folder INBOX`

## `mail rules`

the owner's decisions on which mail to keep, record, skip, tag or protect

### `mail rules list`

this mailbox's rules, protected ones first

```sh
mail rules list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** mail rule — match, action, decided_at, id, tags, reason, protected, source; every field: mail commands info rules list

**Example:** `mail personal rules list`, `mail personal rules list protected:true --json`

### `mail rules add`

decide mail by sender, list, subject, age, size, label or kind; repeats replace

**Changes something on this computer only.**

```sh
mail rules add [options]
```

| Option | What it does |
|---|---|
| `--sender <address>` | one sender address. |
| `--domain <domain>` | a sender domain, and its subdomains. |
| `--list-id <id>` | a mailing list, by its List-Id. |
| `--filter <query>` | from:<address, domain or word>, to:<address>, subject:<word> (or a bare word), older:<n>d, larger:<size> (5MB, 300KB), has:attachment, label:<name> (label:"Two words"), is:unread, is:bulk, score:<n> (at least); all must hold. |
| `--kind <kind>` | a built-in kind of mail. One of: `social`, `newsletters`, `developer`, `shopping`, `alerts`. |
| `--do <actions>` | one of skip (never read or store), envelope (store only sender, date, size and labels: counted, out of search, cleanable later), keep (store in full even when a skip or envelope rule matches) or protect (keep, and no cleanup may ever cut, archive or trash it); add tag:<name> to also tag the mail, e.g. envelope,tag:promo. |
| `--reason <text>` | why, for the owner later. |

**Returns:** mail rule — match, action, decided_at, id, tags, reason, protected, source; every field: mail commands info rules add

**Example:** `mail personal rules add --domain shop.example --do envelope,tag:promo`, `mail personal rules add --sender boss@example.com --do protect --reason "never lose these"`, `mail personal rules add --filter "older:365d larger:5MB" --do envelope`

### `mail rules remove`

drop the rule with exactly these conditions

**Changes something on this computer only.**

```sh
mail rules remove [options]
```

| Option | What it does |
|---|---|
| `--sender <address>` | one sender address. |
| `--domain <domain>` | a sender domain, and its subdomains. |
| `--list-id <id>` | a mailing list, by its List-Id. |
| `--filter <query>` | from:<address, domain or word>, to:<address>, subject:<word> (or a bare word), older:<n>d, larger:<size> (5MB, 300KB), has:attachment, label:<name> (label:"Two words"), is:unread, is:bulk, score:<n> (at least); all must hold. |
| `--kind <kind>` | a built-in kind of mail. One of: `social`, `newsletters`, `developer`, `shopping`, `alerts`. |

**Returns:** drop the rule with exactly these conditions

**Example:** `mail personal rules remove --domain shop.example`, `mail personal rules remove --filter "older:365d larger:5MB"`

### `mail rules apply`

cut stored mail an envelope rule matches to its envelope; dry run unless --yes

**Changes something on this computer only.**

```sh
mail rules apply [options]
```

| Option | What it does |
|---|---|
| `--since-time <time>` | only mail from this time, ISO 8601 or 30d ago (default: all mail). |
| `--dry-run` | only say what would change, even with --yes; the read-only lock lets this through. |

**Returns:** cut stored mail an envelope rule matches to its envelope; dry run unless --yes

**Example:** `mail personal rules apply`, `mail personal rules apply --since-time 2026-01-01 --yes`

### `mail rules export`

print this mailbox's rules as JSON, to review, keep or move elsewhere

```sh
mail rules export
```

**Returns:** print this mailbox's rules as JSON, to review, keep or move elsewhere

**Example:** `mail personal rules export`

### `mail rules import`

import saved rules, or preview Gmail filters with --format gmail; same match replaces

**Changes something on this computer only.**

```sh
mail rules import <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | a rules JSON file from rules export, or Takeout Filters.json with --format gmail. |

| Option | What it does |
|---|---|
| `--format <format>` | the file's format: mail (memo's export is the same file) or gmail. One of: `mail`, `memo`, `gmail`. Default: `mail`. |

**Returns:** import saved rules, or preview Gmail filters

**Example:** `mail personal rules import rules.json`, `mail personal rules import Filters.json --format gmail`, `mail personal rules import Filters.json --format gmail --yes`

## `mail status`

how many messages of the synced window are read and how many are left, per folder, and how far each holder of a processing mark got and what it skipped; it asks no server, so it answers while a sync runs

```sh
mail status
```

**Returns:** mail sync status — job, profile, done, total, remaining, state, updated_at, cursor_age_ms, and 2 more; every field: mail commands info status

**Example:** `mail personal status`, `mail personal status --json`

## `mail search`

find stored emails

### `mail search messages`

search this profile's mail in the local store and, by default, on the mail server for mail sync has not read yet (--backend); the server's finds are stored, then one strict query decides; best match first

```sh
mail search messages <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | strict Lucene query: words, "phrases", AND/OR/NOT, field:value and date ranges. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many, at most 100. |
| `--page <n>` | which page, starting at 1. |
| `--newest` | newest first instead of best first. |
| `--exact` | bare words and quotes match their exact form only, as exact:word does. |
| `--plain-order` | best first by the words alone, without moving mail from suspicious senders down. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--backend <archive\|server\|both>` | where to search: the local archive, the mail server (default: both), or both. |
| `--server-time <duration>` | stop waiting for the server after this long (default: 5s, 20s on Yandex). |

**Returns:** message hit — ref, timestamp, sender_name, sender_is_me, chat_title, excerpt, matched_in, score, and 9 more; every field: mail commands info search messages

**Next usually:** `mail attachments list <message>`, `mail messages show <message>`, `mail messages forward <message> [text]`

**Example:** `mail personal search messages invoice`, `mail personal search messages 'from:ann@example.com has:attachment date>30d'`, `mail personal search messages 'list:github.com is:unread' --newest`

## `mail review`

every stored email, yours too, in threads that changed since a point — for reviewing who owes what. It reads what sync stored, so it asks the mail server nothing

```sh
mail review [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | where the last review ended: date>2h; 3 days ago if no date. |

| Option | What it does |
|---|---|
| `--unanswered [duration]` | only threads whose newest email came to you, in To or Cc, with no answer for this long — 4h, 1d; 24h if not given. |
| `--waiting [duration]` | only threads where you wrote last and nobody answered for this long — 3d; 7d if not given. |
| `--holder <name>` | read for this holder — an agent or a pipeline — what is stored past its processing mark, by store order; bulk, envelopes, drafts, suspicious senders and partial mail left out; each text without quoted earlier mail or the signature; `messages acknowledge` moves the mark. |
| `--new` | what changed since the last `review --new` of this mailbox, a point per thread — for scheduled runs. |

**Returns:** message summary — ref, chat_id, timestamp, sender_name, sender_is_me, outgoing, text, attachments, and 4 more; every field: mail commands info review

**Next usually:** `mail attachments list <message>`, `mail messages show <message>`, `mail messages forward <message> [text]`

**Example:** `mail personal review "date>2h"`, `mail personal review --new`, `mail personal review --unanswered 1d`

## `mail messages`

read the emails sync stored

### `mail messages show`

one stored email: its people, folders, whole text and the first 4000 characters of each attachment's text; --full gives all of it and the HTML body. The store keeps text, not the original message source

**Changes something on this computer only.**

```sh
mail messages show <message> [options]
```

| Argument | | What it is |
|---|---|---|
| `message` | required | the msg:email/… reference a search gives. |

| Option | What it does |
|---|---|
| `--before-n <n>` | also this many earlier emails of its thread. Default: `0`. |
| `--after-n <n>` | also this many later emails of its thread. Default: `0`. |

**Returns:** one stored email whole, with the text of its attachments

**Example:** `mail personal messages show 'msg:email/me%40example.com/thread-1/%3Cid%40example.com%3E'`, `mail personal messages show 'msg:email/me%40example.com/thread-1/%3Cid%40example.com%3E' --before-n 2`

### `mail messages acknowledge`

record that a holder — an agent or a pipeline — processed the mail `review --holder` gave it, with the cursor that review gave; the mark only moves forward, and mail still partial waits for the next review

**Changes something on this computer only.**

```sh
mail messages acknowledge [options]
```

| Option | What it does |
|---|---|
| `--holder <name>` | whose mark: lower-case letters, digits and dashes, such as mail-triage. |
| `--cursor <cursor>` | the cursor `review --holder` gave. |

**Returns:** mail mark — holder, through_id, through_received_at, held, read, skipped, updated_at; every field: mail commands info messages acknowledge

**Example:** `mail personal messages acknowledge --holder mail-triage --cursor 9123.1762090000000`

### `mail messages export`

copy the original messages of stored mail that match a query into mbox files (one per folder) or a Maildir++ tree, for backup or for mu and notmuch. The store keeps text, not the original source, so each message is read from the server again; the destination folder is private (mode 700, files 600)

**Changes something on this computer only.**

```sh
mail messages export [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | which stored mail: the same query as `search messages`; all of it if left out. |

| Option | What it does |
|---|---|
| `--format <format>` | mbox files or a Maildir++ tree. One of: `mbox`, `maildir`. Default: `mbox`. |
| `--output <file>` | the folder to write the export into (not one file); made private if it does not exist. |
| `--folder <folder>` | only mail filed in this folder; repeat it for more (default: the folders sync reads). Default: ``. |
| `--limit <n>` | write at most this many messages in this run, newest first. |
| `--max-pages <pages>` | at most this many requests to the mail server in this run; as many as fit the deadline if not given. |
| `--resume` | go on with the export already in the folder, skipping what it holds. |
| `--replace` | write into a folder that has something in it, over files of the same name. |

**Returns:** mail export — address, format, destination, folders, state, matched, exported, already_exported, and 5 more; every field: mail commands info messages export

**Example:** `mail personal messages export 'from:ann@example.com' --output ~/mail-backup`, `mail personal messages export --folder INBOX --format maildir --output ~/Maildir`, `mail personal messages export 'date>30d' --limit 500 --output ~/mail-backup --resume`

### `mail messages import`

add the mail of a Gmail mbox file from Google Takeout to this Gmail profile's stored mail; Takeout keeps Gmail's own ids, so an email both the file and sync bring is stored once. Only adds: mail missing from the file is never marked deleted, Spam and Trash are left out, and the owner's rules skip what they skip. An unchanged file read to the end is not read again

**Changes something on this computer only.**

```sh
mail messages import <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | the .mbox file Google Takeout wrote. |

| Option | What it does |
|---|---|
| `--since-time <time>` | only mail received since this date or time; a date alone starts at local midnight (default: the whole file). |
| `--limit <n>` | save at most this many new emails in this run, newest first. |

**Returns:** mail import — address, file, since, listed, saved, already_stored, skipped, envelopes, and 4 more; every field: mail commands info messages import

**Example:** `mail gm messages import ~/Takeout/Mail/All\ mail\ Including\ Spam\ and\ Trash.mbox`, `mail gm messages import archive.mbox --since-time 2015-01-01 --limit 5000`

### `mail messages mark-read`

mark messages read; on the server first, then in the store, so search shows it at once

**Changes something in the service.**

```sh
mail messages mark-read [message] [options]
```

| Argument | | What it is |
|---|---|---|
| `message` | optional | msg:email/… references, as search messages shows them. |

| Option | What it does |
|---|---|
| `--filter <query>` | the stored mail this query finds, instead of references (search messages syntax). |
| `--limit <n>` | with --filter, at most this many, newest first (default 500, at most 5000). |
| `--yes` | make the change; a deletion or a change of many is only a preview without it. |
| `--dry-run` | only preview what would change, even with --yes. |

**Returns:** mail change — action, applied, run, selected, located, changed, missing, already_deleted, and 6 more; every field: mail commands info messages mark-read

**Example:** `mail personal messages mark-read msg:email/me%40example.com/t1/m1`, `mail personal messages mark-read --filter 'from:shop@example.com is:unread' --yes`

### `mail messages mark-unread`

mark messages unread; on the server first, then in the store, so search shows it at once

**Changes something in the service.**

```sh
mail messages mark-unread [message] [options]
```

| Argument | | What it is |
|---|---|---|
| `message` | optional | msg:email/… references, as search messages shows them. |

| Option | What it does |
|---|---|
| `--filter <query>` | the stored mail this query finds, instead of references (search messages syntax). |
| `--limit <n>` | with --filter, at most this many, newest first (default 500, at most 5000). |
| `--yes` | make the change; a deletion or a change of many is only a preview without it. |
| `--dry-run` | only preview what would change, even with --yes. |

**Returns:** mail change — action, applied, run, selected, located, changed, missing, already_deleted, and 6 more; every field: mail commands info messages mark-unread

**Example:** `mail personal messages mark-unread msg:email/me%40example.com/t1/m1`, `mail personal messages mark-unread --filter 'from:shop@example.com is:unread' --yes`

### `mail messages star`

star messages (the \Flagged flag); on the server first, then in the store, so search shows it at once

**Changes something in the service.**

```sh
mail messages star [message] [options]
```

| Argument | | What it is |
|---|---|---|
| `message` | optional | msg:email/… references, as search messages shows them. |

| Option | What it does |
|---|---|
| `--filter <query>` | the stored mail this query finds, instead of references (search messages syntax). |
| `--limit <n>` | with --filter, at most this many, newest first (default 500, at most 5000). |
| `--yes` | make the change; a deletion or a change of many is only a preview without it. |
| `--dry-run` | only preview what would change, even with --yes. |

**Returns:** mail change — action, applied, run, selected, located, changed, missing, already_deleted, and 6 more; every field: mail commands info messages star

**Example:** `mail personal messages star msg:email/me%40example.com/t1/m1`, `mail personal messages star --filter 'from:shop@example.com is:unread' --yes`

### `mail messages unstar`

take the star away; on the server first, then in the store, so search shows it at once

**Changes something in the service.**

```sh
mail messages unstar [message] [options]
```

| Argument | | What it is |
|---|---|---|
| `message` | optional | msg:email/… references, as search messages shows them. |

| Option | What it does |
|---|---|
| `--filter <query>` | the stored mail this query finds, instead of references (search messages syntax). |
| `--limit <n>` | with --filter, at most this many, newest first (default 500, at most 5000). |
| `--yes` | make the change; a deletion or a change of many is only a preview without it. |
| `--dry-run` | only preview what would change, even with --yes. |

**Returns:** mail change — action, applied, run, selected, located, changed, missing, already_deleted, and 6 more; every field: mail commands info messages unstar

**Example:** `mail personal messages unstar msg:email/me%40example.com/t1/m1`, `mail personal messages unstar --filter 'from:shop@example.com is:unread' --yes`

### `mail messages update`

set and unset flags (read, flagged, answered, draft) and keywords ($Forwarded, $Junk, words of your own); --replace makes --flag each message's whole set

**Changes something in the service.**

```sh
mail messages update [message] [options]
```

| Argument | | What it is |
|---|---|---|
| `message` | optional | msg:email/… references, as search messages shows them. |

| Option | What it does |
|---|---|
| `--filter <query>` | the stored mail this query finds, instead of references (search messages syntax). |
| `--limit <n>` | with --filter, at most this many, newest first (default 500, at most 5000). |
| `--yes` | make the change; a deletion or a change of many is only a preview without it. |
| `--dry-run` | only preview what would change, even with --yes. |
| `--flag <flag>` | a flag or keyword to set; repeat it for more. Default: ``. |
| `--unflag <flag>` | a flag or keyword to take away; repeat it for more. Default: ``. |
| `--replace` | --flag is the whole set: every other flag and keyword is taken away. |

**Returns:** mail change — action, applied, run, selected, located, changed, missing, already_deleted, and 6 more; every field: mail commands info messages update

**Example:** `mail personal messages update msg:email/me%40example.com/t1/m1 --flag answered --unflag '$Junk'`, `mail personal messages update msg:email/me%40example.com/t1/m1 --flag read --flag flagged --replace`

### `mail messages move`

move messages to a folder, by path, name or role (archive, junk, inbox); on Gmail, a label change that takes Inbox away

**Changes something in the service.**

```sh
mail messages move [message] [options]
```

| Argument | | What it is |
|---|---|---|
| `message` | optional | msg:email/… references, as search messages shows them. |

| Option | What it does |
|---|---|
| `--filter <query>` | the stored mail this query finds, instead of references (search messages syntax). |
| `--limit <n>` | with --filter, at most this many, newest first (default 500, at most 5000). |
| `--yes` | make the change; a deletion or a change of many is only a preview without it. |
| `--dry-run` | only preview what would change, even with --yes. |
| `--folder <folder>` | the folder: its path, its name, or a role (archive, junk, inbox). |

**Returns:** mail change — action, applied, run, selected, located, changed, missing, already_deleted, and 6 more; every field: mail commands info messages move

**Example:** `mail personal messages move msg:email/me%40example.com/t1/m1 --folder Archive`, `mail personal messages move --filter 'list:github.com date<2026-01-01' --folder Lists --yes`

### `mail messages copy`

copy messages to a folder, by path, name or role; on Gmail, a label added

**Changes something in the service.**

```sh
mail messages copy [message] [options]
```

| Argument | | What it is |
|---|---|---|
| `message` | optional | msg:email/… references, as search messages shows them. |

| Option | What it does |
|---|---|
| `--filter <query>` | the stored mail this query finds, instead of references (search messages syntax). |
| `--limit <n>` | with --filter, at most this many, newest first (default 500, at most 5000). |
| `--yes` | make the change; a deletion or a change of many is only a preview without it. |
| `--dry-run` | only preview what would change, even with --yes. |
| `--folder <folder>` | the folder: its path, its name, or a role (archive, junk, inbox). |

**Returns:** mail change — action, applied, run, selected, located, changed, missing, already_deleted, and 6 more; every field: mail commands info messages copy

**Example:** `mail personal messages copy msg:email/me%40example.com/t1/m1 --folder Archive`, `mail personal messages copy --filter 'list:github.com date<2026-01-01' --folder Lists --yes`

### `mail messages delete`

move messages to Trash, where the provider keeps them for a while (Gmail: 30 days) and messages restore brings them back; a preview unless --yes

**Changes something in the service.**

```sh
mail messages delete [message] [options]
```

| Argument | | What it is |
|---|---|---|
| `message` | optional | msg:email/… references, as search messages shows them. |

| Option | What it does |
|---|---|
| `--filter <query>` | the stored mail this query finds, instead of references (search messages syntax). |
| `--limit <n>` | with --filter, at most this many, newest first (default 5000, at most 5000). |
| `--yes` | make the change; a deletion or a change of many is only a preview without it. |
| `--dry-run` | only preview what would change, even with --yes. |
| `--rules` | the envelope mail the owner's rules let go, each decided again (`memo mail delete` did this before). |
| `--since-time <time>` | with --rules, only mail received from this time; older mail stays. |

**Returns:** mail change — action, applied, run, selected, located, changed, missing, already_deleted, and 6 more; every field: mail commands info messages delete

**Example:** `mail personal messages delete msg:email/me%40example.com/t1/m1 --yes`, `mail personal messages delete --filter 'from:shop@example.com date<2025-01-01'`, `mail personal messages delete --rules --yes`

### `mail messages restore`

undo a change run, last step first, for the messages still where it left them: Trash back to where they were, moves back, copies removed, flags as they were; a preview unless --yes

**Changes something in the service.**

```sh
mail messages restore [options]
```

| Option | What it does |
|---|---|
| `--run <id>` | the run id a change answered with (runs list shows recent runs). |
| `--yes` | make the change; without it, only say what would come back. |
| `--dry-run` | only preview, even with --yes. |

**Returns:** mail restore — run, applied, restore_run, command, logged, restorable, missing, restored, and 2 more; every field: mail commands info messages restore

**Example:** `mail personal messages restore --run 20261101T101500Z-messages-delete-1a2b3c`, `mail personal messages restore --run 20261101T101500Z-messages-delete-1a2b3c --yes`

### `mail messages send`

send an email from this profile's address over its SMTP server, with the same app password; without [text] the text is read from stdin. Mail to anyone but you asks first (permissions.messages.send.others). Sent gets a copy where the provider does not file one itself

**Changes something in the service.**

```sh
mail messages send [text] [options]
```

| Argument | | What it is |
|---|---|---|
| `text` | optional | the text of the message; read from stdin when left out. |

| Option | What it does |
|---|---|
| `--to <address>` | who it goes to: an address, or several split by commas; repeat it for more (a reply: instead of its sender). Default: ``. |
| `--cc <address>` | a copy to this address; repeat it for more. Default: ``. |
| `--bcc <address>` | a hidden copy to this address; repeat it for more. Default: ``. |
| `--file <file>` | attach this file, as named, never a pattern; repeat it for more. Default: ``. |
| `--allow-any-file` | attach a file even from credential folders or this CLI's own folders. |
| `--operation-id <id>` | repeat a send whose outcome was unknown; Sent is checked first, so it goes once. |
| `--yes` | answer the question before sending to anyone but you. |
| `--dry-run` | build the message and show what would go; send nothing. |
| `--subject <text>` | the subject; a reply takes the original's with Re:. |
| `--reply-to <message>` | answer this msg:email/… reference: In-Reply-To, References, Re: and the quote. |
| `--reply-all` | with --reply-to, also to everyone the original went to, except you. |

**Returns:** mail send — sent, operation_id, message_id, from, to, cc, bcc, subject, and 9 more; every field: mail commands info messages send

**Example:** `mail personal messages send --to ann@example.com --subject "Lunch" "See you at noon."`, `mail personal messages send --reply-to 'msg:email/me%40example.com/thread-1/1001' "Thanks, done."`, `mail personal messages send --to ann@example.com --subject Report --file ./report.pdf "The report."`

### `mail messages forward`

forward a stored email to other people: the original goes as an attached message with its own attachments, Fwd: before its subject. Mail to anyone but you asks first (permissions.messages.send.others)

**Changes something in the service.**

```sh
mail messages forward <message> [text] [options]
```

| Argument | | What it is |
|---|---|---|
| `message` | required | the msg:email/… reference search messages shows. |
| `text` | optional | a few words above the forwarded message. |

| Option | What it does |
|---|---|
| `--to <address>` | who it goes to: an address, or several split by commas; repeat it for more (a reply: instead of its sender). Default: ``. |
| `--cc <address>` | a copy to this address; repeat it for more. Default: ``. |
| `--bcc <address>` | a hidden copy to this address; repeat it for more. Default: ``. |
| `--file <file>` | attach this file, as named, never a pattern; repeat it for more. Default: ``. |
| `--allow-any-file` | attach a file even from credential folders or this CLI's own folders. |
| `--operation-id <id>` | repeat a send whose outcome was unknown; Sent is checked first, so it goes once. |
| `--yes` | answer the question before sending to anyone but you. |
| `--dry-run` | build the message and show what would go; send nothing. |
| `--subject <text>` | the subject instead of the original's with Fwd:. |

**Returns:** mail send — sent, operation_id, message_id, from, to, cc, bcc, subject, and 9 more; every field: mail commands info messages forward

**Example:** `mail personal messages forward 'msg:email/me%40example.com/thread-1/1001' --to bob@example.com`, `mail personal messages forward 'msg:email/me%40example.com/thread-1/1001' --to bob@example.com "FYI"`

## `mail conversations`

the threads of the stored mail: an email and its replies

### `mail conversations list`

this profile's email threads, the newest activity first: subject, how many emails, when

```sh
mail conversations list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many, at most 100. |
| `--page <n>` | which page, starting at 1. |

**Returns:** mail thread — ref, subject, emails_count, last_email_at, untrusted; every field: mail commands info conversations list

**Example:** `mail personal conversations list`, `mail personal conversations list subject:invoice emails_count>1`

### `mail conversations show`

every stored email of one thread, oldest first, each with the text of its attachments

```sh
mail conversations show <conversation>
```

| Argument | | What it is |
|---|---|---|
| `conversation` | required | a chat:email/… thread from conversations list, or a msg:email/… email in it. |

**Returns:** one email thread, every email oldest first

**Example:** `mail personal conversations show 'chat:email/me%40example.com/thread-1'`, `mail personal conversations show 'msg:email/me%40example.com/thread-1/%3Cid%40example.com%3E'`

## `mail attachments`

### `mail attachments list`

the attachments of one stored email, numbered as attachments download takes them; reads the message from the server

```sh
mail attachments list <message>
```

| Argument | | What it is |
|---|---|---|
| `message` | required | the msg:email/… reference search messages shows. |

**Returns:** mail attachment — number, name, mime, bytes; every field: mail commands info attachments list

**Example:** `mail personal attachments list 'msg:email/me%40example.com/thread-1/1001'`

### `mail attachments download`

save the attachments of one stored email into a folder, readable only by you; the bytes come from the server and never go into the store. An existing file is left alone unless --replace

**Changes something on this computer only.**

```sh
mail attachments download <message> [number] [options]
```

| Argument | | What it is |
|---|---|---|
| `message` | required | the msg:email/… reference search messages shows. |
| `number` | optional | only these attachments, by their number in attachments list (default: all). |

| Option | What it does |
|---|---|
| `--output-dir <dir>` | the folder to save into, made if missing. |
| `--replace` | overwrite a file of the same name in the folder. |

**Returns:** mail attachments saved — folder, files; every field: mail commands info attachments download

**Example:** `mail personal attachments download 'msg:email/me%40example.com/thread-1/1001' --output-dir ./invoices`, `mail personal attachments download 'msg:email/me%40example.com/thread-1/1001' 2 --output-dir ./invoices`

## `mail stats`

counts over the mail sync stored

### `mail stats messages`

counts of stored emails

#### `mail stats messages show`

how much of this profile's stored mail matches the query, received and sent, per calendar day, week (from Monday) or sender; by sender counts received mail only. Counts only, from the store; records no search

```sh
mail stats messages show [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | the same query as `search messages`; every stored email if left out. |

| Option | What it does |
|---|---|
| `--by <group>` | what to count by. One of: `day`, `week`, `sender`. Default: `day`. |
| `--timezone <zone>` | the IANA timezone where days and weeks start. |
| `--limit <n>` | how many rows: the latest days or weeks, or the busiest senders. Default: `30`. |

**Returns:** mail counts — by, received, sent, rows; every field: mail commands info stats messages show

**Example:** `mail personal stats messages show --by day --timezone Europe/Madrid -- 'date>=30d'`, `mail personal stats messages show --by sender --limit 10`

#### `mail stats messages top`

group this profile's stored mail by sender, mailing list (List-Id) or sender domain, the biggest group first; unread and size help decide what to unsubscribe from or clean up

```sh
mail stats messages top [options]
```

| Option | What it does |
|---|---|
| `--by <group>` | what to group by. One of: `sender`, `list`, `domain`. Default: `sender`. |
| `--limit <n>` | how many groups, at most 200. Default: `20`. |

**Returns:** mail group — group, emails, unread, bytes, last_email_at, untrusted; every field: mail commands info stats messages top

**Example:** `mail personal stats messages top`, `mail personal stats messages top --by list --limit 10`

## `mail drafts`

drafts in the mailbox's Drafts folder: an agent writes them, the owner checks and sends them

### `mail drafts list`

the drafts in the mailbox's Drafts folder, newest first, read from the server

```sh
mail drafts list [options]
```

| Option | What it does |
|---|---|
| `--limit <n>` | at most this many (default 50, at most 500). |

**Returns:** mail draft — id, uid, subject, from, to, cc, bcc, date, and 3 more; every field: mail commands info drafts list

**Example:** `mail personal drafts list`, `mail personal drafts list --limit 5 --json`

### `mail drafts create`

save a new message in the Drafts folder; nothing is sent, and the owner sends it from any mail app. --reply-to answers a stored message in its thread

**Changes something in the service.**

```sh
mail drafts create [text] [options]
```

| Argument | | What it is |
|---|---|---|
| `text` | optional | the text; - reads it from stdin. |

| Option | What it does |
|---|---|
| `--to <address>` | who it goes to: an address, or several split by commas; repeat it for more. Default: ``. |
| `--cc <address>` | a copy to; repeat it for more. Default: ``. |
| `--bcc <address>` | a blind copy to; repeat it for more. Default: ``. |
| `--subject <text>` | the subject line. |
| `--dry-run` | build the draft and show it; store nothing. |
| `--reply-to <message>` | answer this stored message: its sender, its subject with Re:, in its thread. |
| `--reply-all` | with --reply-to, also everyone it went to, but you. |

**Returns:** mail draft change — action, applied, id, folder, uid, replaced_uid, old_version_in, subject, and 3 more; every field: mail commands info drafts create

**Example:** `mail personal drafts create --to anna@example.com --subject 'Monday' 'Shall we meet at ten?'`, `mail personal drafts create --reply-to msg:email/me%40example.com/t1/m1 --reply-all 'Thanks, agreed.'`

### `mail drafts update`

replace a draft with a new version under the same id: each given field replaces the old one (a --to list replaces the whole To), the rest, the thread and the attachments stay; the old version goes to Trash

**Changes something in the service.**

```sh
mail drafts update <draft> [text] [options]
```

| Argument | | What it is |
|---|---|---|
| `draft` | required | the draft's id, as drafts list shows it. |
| `text` | optional | the new text; - reads it from stdin. |

| Option | What it does |
|---|---|
| `--to <address>` | who it goes to: an address, or several split by commas; repeat it for more. Default: ``. |
| `--cc <address>` | a copy to; repeat it for more. Default: ``. |
| `--bcc <address>` | a blind copy to; repeat it for more. Default: ``. |
| `--subject <text>` | the subject line. |
| `--dry-run` | build the draft and show it; store nothing. |

**Returns:** mail draft change — action, applied, id, folder, uid, replaced_uid, old_version_in, subject, and 3 more; every field: mail commands info drafts update

**Example:** `mail personal drafts update 5b0e1c2a@example.com 'New text, the rest kept'`, `mail personal drafts update 5b0e1c2a@example.com --to anna@example.com --to boris@example.com`

### `mail drafts delete`

delete a draft from the Drafts folder for good, with no restore; the owner adds --allow-dangerous to do it, without it a preview

**Changes something in the service.**

```sh
mail drafts delete <draft> [options]
```

| Argument | | What it is |
|---|---|---|
| `draft` | required | the draft's id, as drafts list shows it. |

| Option | What it does |
|---|---|
| `--allow-dangerous` | delete it for good, no restore; without it, only a preview. |
| `--dry-run` | only preview, even with --allow-dangerous. |

**Returns:** mail draft change — action, applied, id, folder, uid, replaced_uid, old_version_in, subject, and 3 more; every field: mail commands info drafts delete

**Example:** `mail personal drafts delete 5b0e1c2a@example.com --allow-dangerous`

### `mail drafts send`

send a draft as it is saved, over SMTP, as messages send does: mail to anyone but you asks first (permissions.messages.send.others); once it went, the draft leaves the Drafts folder

**Changes something in the service.**

```sh
mail drafts send <draft> [options]
```

| Argument | | What it is |
|---|---|---|
| `draft` | required | the draft's id, as drafts list shows it. |

| Option | What it does |
|---|---|
| `--operation-id <id>` | repeat a send whose outcome was unknown; Sent is checked first, so it goes once. |
| `--yes` | answer the question before sending to anyone but you. |
| `--dry-run` | show what would go; send nothing. |

**Returns:** mail send — sent, operation_id, message_id, from, to, cc, bcc, subject, and 9 more; every field: mail commands info drafts send

**Example:** `mail personal drafts send 5b0e1c2a@example.com`

## `mail tags`

your own tags on stored mail, kept in the local store and shared with memo; never sent to the server

### `mail tags add`

put your own tags on one stored email or conversation; they stay in the local store, never on the server

**Changes something on this computer only.**

```sh
mail tags add <tag> [options]
```

| Argument | | What it is |
|---|---|---|
| `tag` | required | one or more tags: 1–32 letters a–z, digits and hyphens; upper case is lowered. |

| Option | What it does |
|---|---|
| `--message <message>` | the email: its msg:email/… reference, as search messages shows it. |
| `--chat <chat>` | the conversation: its chat:email/… reference, as conversations list shows it. |

**Returns:** mail tag change — target, unchanged, added, removed; every field: mail commands info tags add

**Example:** `mail personal tags add invoices --message msg:email/me%40example.com/t1/m1`

### `mail tags remove`

take your own tags off one stored email or conversation

**Changes something on this computer only.**

```sh
mail tags remove <tag> [options]
```

| Argument | | What it is |
|---|---|---|
| `tag` | required | one or more tags: 1–32 letters a–z, digits and hyphens; upper case is lowered. |

| Option | What it does |
|---|---|
| `--message <message>` | the email: its msg:email/… reference, as search messages shows it. |
| `--chat <chat>` | the conversation: its chat:email/… reference, as conversations list shows it. |

**Returns:** mail tag change — target, unchanged, added, removed; every field: mail commands info tags remove

**Example:** `mail personal tags remove invoices --message msg:email/me%40example.com/t1/m1`

### `mail tags list`

the emails and conversations of this mailbox you tagged; search messages tag:<tag> finds them too

```sh
mail tags list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | at most this many (default 100, at most 1000). |

**Returns:** mail tag — tag, type, target, name, created_at; every field: mail commands info tags list

**Example:** `mail personal tags list`, `mail personal tags list tag:invoices`

## `mail doctor`

the state this installation is in, without connecting unless --online

```sh
mail doctor [options]
```

| Option | What it does |
|---|---|
| `--online` | also connect once and read the account; sends nothing. |

**Returns:** the state this installation is in, without connecting unless --online

**Example:** `mail doctor`, `mail doctor --json`

## `mail skill`

the instructions an agent is given for this tool

### `mail skill show`

print SKILL.md — `mail skill install` puts it where Claude Code, Codex, Gemini CLI and OpenClaw look for it, and where Hermes does on request; --for prints the copy already there

```sh
mail skill show [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | print the copy installed for these agents instead of this version's. One of: `claude`, `agents`. |

**Returns:** print the tool's instructions for AI agents

**Example:** `mail skill show`

### `mail skill install`

write SKILL.md to \~/.claude/skills/mail-cli/ (Claude Code) and \~/.agents/skills/mail-cli/ (Codex, Gemini CLI, OpenClaw); --for hermes also has Hermes read \~/.agents/skills, which changes Hermes's own settings, so all leaves it out

**Changes something on this computer only.**

```sh
mail skill install [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `hermes`, `all`. Default: `all`. |

**Returns:** install the tool's instructions for AI agents

**Example:** `mail skill install --for agents`

### `mail skill status`

for each place `mail skill install` writes to, and for the copy Hermes reads: the path, the version installed there, and whether it is current, stale, missing or unversioned

```sh
mail skill status
```

**Returns:** whether the installed instructions for AI agents match this version

**Example:** `mail skill status`, `mail skill status --json`

## `mail mcp`

serve this profile to an agent over MCP and set it up — `claude mcp add mail -- mail <profile> mcp serve`

### `mail mcp serve`

serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add mail -- mail <profile> mcp serve`; `mail mcp serve --profiles a,b` or `--profiles all` serves those profiles from one server and each tool asks which

**Changes something in the service.**

```sh
mail mcp serve [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like sync=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |
| `--http` | serve over HTTP on 127.0.0.1 for ChatGPT and Claude in the browser, behind your tunnel; the profile's permissions decide. |
| `--port <port>` | the local port for --http (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |

**Returns:** serve this profile's commands to an AI agent

**Example:** `mail personal mcp serve`, `mail mcp serve --profiles work,personal`, `mail personal mcp serve --http --public-url https://laptop.example.ts.net`

### `mail mcp revoke`

forget every login `mcp serve --http` gave a browser app, of this profile or of the server `--profiles` names; each app must log in again

**Changes something on this computer only.**

```sh
mail mcp revoke [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Returns:** forget every login given to a browser app

**Example:** `mail personal mcp revoke`, `mail mcp revoke --profiles all`

### `mail mcp server`

start, stop and check `mcp serve --http` in the background; status shows the login code for a browser app

#### `mail mcp server start`

start `mcp serve --http` apart from this shell and answer once it listens, with its login code

**Changes something on this computer only.**

```sh
mail mcp server start [options]
```

| Option | What it does |
|---|---|
| `--port <port>` | the local port (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |
| `--permission <key=level>` | make a permission stricter for this server only; repeat for more keys. |
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Returns:** start the HTTP MCP server in the background

**Example:** `mail personal mcp server start --public-url https://laptop.example.ts.net`

#### `mail mcp server stop`

stop `mcp serve --http` — only one that `mcp server start` started

**Changes something on this computer only.**

```sh
mail mcp server stop [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Returns:** stop the background HTTP MCP server

**Example:** `mail personal mcp server stop`

#### `mail mcp server status`

whether `mcp serve --http` runs, on which port and address, the login code for a new browser app, and the apps logged in

```sh
mail mcp server status [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Returns:** whether the HTTP MCP server runs, its login code and the apps logged in

**Example:** `mail personal mcp server status --json`

### `mail mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
mail mcp config [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like sync=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Returns:** print the local MCP configuration of this profile, or of those --profiles names

**Example:** `mail personal mcp config`, `mail mcp config --profiles all`

### `mail mcp add`

add this profile's local MCP server to Codex or Claude Code

**Changes something on this computer only.**

```sh
mail mcp add <client> [options]
```

| Argument | | What it is |
|---|---|---|
| `client` | required | codex or claude-code. |

| Option | What it does |
|---|---|
| `--allow-writes` | acknowledge that this profile offers writing tools. |
| `--permission <key=level>` | make a permission stricter for this server only, like sync=deny; it never loosens the profile; repeat for more keys. |

**Returns:** add this profile's local MCP server to Codex or Claude Code

**Example:** `mail personal mcp add codex --allow-writes`

### `mail mcp check`

check this profile's local MCP handshake and tool list

```sh
mail mcp check [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like sync=deny; it never loosens the profile; repeat for more keys. |

**Returns:** check this profile's local MCP handshake and tool list

**Example:** `mail personal mcp check`

## `mail upgrade`

upgrade mail with the package manager that installed it; --check only looks

**Changes something on this computer only.**

```sh
mail upgrade [options]
```

| Option | What it does |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |

**Returns:** upgrade mail with the package manager that installed it; --check only looks

**Example:** `mail upgrade --check`

## `mail config`

the settings in force, and where each one came from

### `mail config show`

the profile, the profiles that exist, and each setting with where it came from

```sh
mail config show
```

**Returns:** the profile, the profiles that exist, and each setting with where it came from

**Example:** `mail personal config show`

### `mail config set`

save a setting to the configuration file

**Changes something on this computer only.**

```sh
mail config set <setting> <value> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, runs_size_limit_mb, permissions, sends_per_hour, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, address, login, imap_host, imap_port, imap_security, smtp_host, smtp_port, smtp_security, auth, google_client_id, microsoft_client_id, folders, read_attachments, max_attachment_mb, update_check, skill_hint, schedule_max_cost_per_day, schedule_model_claude, schedule_model_codex, schedule_lean_start, search_stemmers.cyrillic, search_stemmers.latin. |
| `value` | required | a number, true or false; for a group tg:work,max:Alice,email:me@x. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Returns:** save a setting to the configuration file

**Example:** `mail personal config set limit 20`

### `mail config unset`

remove a setting from the configuration file

**Changes something on this computer only.**

```sh
mail config unset <setting> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, runs_size_limit_mb, permissions, sends_per_hour, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, address, login, imap_host, imap_port, imap_security, smtp_host, smtp_port, smtp_security, auth, google_client_id, microsoft_client_id, folders, read_attachments, max_attachment_mb, update_check, skill_hint, schedule_max_cost_per_day, schedule_model_claude, schedule_model_codex, schedule_lean_start, search_stemmers.cyrillic, search_stemmers.latin. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Returns:** remove a setting from the configuration file

**Example:** `mail personal config unset limit`

### `mail config migrate`

write each setting the file lacks at its default, keeping yours

**Changes something on this computer only.**

```sh
mail config migrate
```

**Returns:** write each setting the file lacks at its default, keeping yours

**Example:** `mail config migrate`

### `mail config repair`

fix broken JSON syntax in the settings file — comments, a missing or extra comma, unquoted keys, single quotes, missing closing brackets at the end — keeping every value, with a backup beside it; refuses anything with more than one reading and changes nothing then

**Changes something on this computer only.**

```sh
mail config repair [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | say what it would fix, and change nothing. |

**Returns:** fix the settings file's JSON syntax, keeping every value

**Example:** `mail config repair`, `mail config repair --dry-run`

## `mail runs`

recorded runs — what this tool did, and when

### `mail runs list`

recorded runs, newest first

```sh
mail runs list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. Default: `20`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** run — run_id, command, started_at, status, cli_version, profile, completed_at, requests, and 23 more; every field: mail commands info runs list

**Example:** `mail personal runs list --limit 10`

### `mail runs show`

one run: what it was, how it ended, and every event it logged

```sh
mail runs show <run-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `mail runs list`. |

| Option | What it does |
|---|---|
| `--problems` | only failed responses, warnings and crashes. |

**Returns:** run details — run_id, command, started_at, status, cli_version, directory, event_count, events, and 22 more; every field: mail commands info runs show

**Example:** `mail personal runs show run-101`

### `mail runs path`

the directory holding one run

```sh
mail runs path <run-id>
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `mail runs list`. |

**Returns:** run location — path; every field: mail commands info runs path

**Example:** `mail personal runs path run-101`

## `mail schedule`

run a mail command or an agent later or on a timer (systemd, launchd, Task Scheduler); an agent cannot send

### `mail schedule command`

run mail <args…> on a timer — reads save what they read, so this is how a chat's history fills the store

**Changes something on this computer only.**

```sh
mail schedule command <name> <args> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | lowercase letters, digits and dashes. |
| `args` | required | the mail command after its name, e.g. -- messages list <chat> --limit 50. |

| Option | What it does |
|---|---|
| `--every <duration>` | repeat: 30m, 2h, 1d. |
| `--at <HH:MM>` | every day at this local time. |
| `--at-time <time>` | one run: 30m, 2d from now, or an ISO time; the schedule removes itself after it. |

**Returns:** run mail <args…> on a timer — reads save what they read, so this is how a…

**Example:** `mail personal schedule command health --every 1h -- doctor`, `mail personal schedule command morning-check --at 08:00 -- doctor`

### `mail schedule agent`

start an agent (claude or codex) with a prompt on a timer; it runs with MAIL_READ_ONLY=1, so it reads and drafts and cannot send — its answer is kept and you are notified

**Changes something on this computer only.**

```sh
mail schedule agent <name> <harness> <prompt> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | lowercase letters, digits and dashes. |
| `harness` | required | the agent to start. One of: `claude`, `codex`. |
| `prompt` | required | what to do, e.g. "summarize what came in during the last day: mail personal search messages 'date>1d' --newest --limit 20". |

| Option | What it does |
|---|---|
| `--model <model>` | the model it runs on: an alias such as sonnet, or a model id; "" for the harness's default (default sonnet for claude, codex's own for codex, or the config file's). |
| `--max-cost <usd>` | claude only: stop a run that costs more than this, in US dollars. |
| `--max-cost-per-day <usd>` | claude only: start no run for the rest of the day once its runs cost this much, in US dollars; 0 for no cap (default 5, or the config file's). |
| `--every <duration>` | repeat: 30m, 2h, 1d. |
| `--at <HH:MM>` | every day at this local time. |
| `--at-time <time>` | one run: 30m, 2d from now, or an ISO time; the schedule removes itself after it. |

**Returns:** start an agent (claude or codex) with a prompt on a timer; it runs with…

**Example:** `mail personal schedule agent review claude "review what came in overnight and draft replies" --at 08:30`, `mail personal schedule agent triage codex "list what needs an answer today" --every 2h --max-cost 1`, `mail personal schedule agent weekly claude "review the week's open threads" --at 09:00 --model opus`

### `mail schedule list`

the schedules, when they run and how their last run went

```sh
mail schedule list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** scheduled job — name, kind, when, last; every field: mail commands info schedule list

**Example:** `mail personal schedule list`, `mail personal schedule list kind:agent`

### `mail schedule run`

run a schedule now, as its timer would, and wait for it

**Changes something in the service.**

```sh
mail schedule run <name>
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

**Returns:** run a schedule now, as its timer would, and wait for it

**Example:** `mail personal schedule run health`

### `mail schedule remove`

stop a schedule and remove its timer; its past output stays

**Changes something on this computer only.**

```sh
mail schedule remove <name>
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

**Returns:** stop a schedule and remove its timer; its past output stays

**Example:** `mail personal schedule remove health`

### `mail schedule exec`

what a timer runs, given the schedule's file; to run one by hand, use run

**Changes something in the service.**

```sh
mail schedule exec <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | the schedule's schedule.json in the state folder, as the timer passes it. |

**Returns:** what a timer runs, given the schedule's file; to run one by hand, use run

**Example:** `mail personal schedule exec ~/.local/share/mail-cli/schedules/health/schedule.json`

## Exit codes

Branch on the code, not on the text: the text can change, the code does not.

| Code | When |
|---|---|
| `0` | it worked |
| `2` | `validation_error` |
| `3` | `configuration_error` |
| `4` | `authentication_error` |
| `5` | `permission_error` |
| `6` | `not_found` |
| `7` | `confirmation_required` |
| `8` | `rate_limited` |
| `9` | `timeout` |
| `10` | `network_error` |
| `11` | `provider_error` |
| `12` | `provider_unavailable` |
| `13` | `invalid_response` |
| `14` | `outcome_unknown` |
| `15` | `conflict` |
| `130` | `cancelled` |
| `1` | anything else |
