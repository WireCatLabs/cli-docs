---
title: What a background service needs to survive a laptop reboot
description: My laptop rebooted at night, and every background piece of a local-first CLI failed in its own way. What I had to fix so the service and the schedules on a desktop survive a reboot and a locked keyring.
date: 2026-11-02
tags: [cli, telegram]
cover: ./cover.jpg
coverAlt: "A laptop on a dark table at night with its screen off, surrounded by small brass clockwork machines that have stopped, a closed padlock in front and a thin glass tube broken in two between them"
author: viacheslav-ptsarev
draft: false
---

Overnight into November 2 my laptop rebooted, and by morning nothing in the background was running. I don't know why it rebooted. The tg and max services didn't come up, the nightly full syncs failed, and a sync started by hand in the morning died right after the command that started it. Everything failed differently, and the sync code itself was never the problem.

Background work in WireCat is 2 things. `serve` holds the connection to the messenger and writes new messages into the local archive, it's a systemd user service (a LaunchAgent on a Mac). And schedules, for example a full sync once a day at night, which is a systemd timer. Looks simple, but that night 4 different places broke, and each one gets its own section below.

That night I was asleep and an AI agent was finishing the desktop app. Around 06:30 it noticed the services were down and started them by hand, the full syncs too. From there agents ran the commands and wrote the fixes, and I steered them and decided what to fix and how.

## The service nobody enabled

`tg personal server install` wrote the unit file to `~/.config/systemd/user/` and stopped there. For a person it printed a hint on how to start the service now and how to enable it at login (`systemctl --user enable ...`). But often it's an AI agent or the desktop app that installs the service, not a person, and they read JSON, which has no such hint. So the unit sat on disk and `systemctl --user is-enabled` said disabled.

It's not systemd's fault, it does exactly what the docs say: [`enable`](https://www.freedesktop.org/software/systemd/man/latest/systemctl.html#enable%20UNIT%E2%80%A6) creates the symlinks from the `[Install]` section and starts nothing. And without the symlink the service doesn't start after a reboot.

And we'd seen this before. In October the same thing turned up in the WhatsApp CLI, I enabled its unit by hand back then, and the notes said "cli-core should enable it on install", and nobody got to it before this reboot.

Now `server install` writes the file, runs `daemon-reload` and `enable`, and still starts nothing. On a Mac it's the same through `launchctl enable`, and the plist no longer has `Disabled`. `server uninstall` disables the unit first and then removes the file. And `server status` reports `starts_at_login`, so both a person and the desktop app can see in advance whether the service comes back after a reboot. The tests cover this, I haven't checked it with a real reboot yet.

I deliberately don't enable a unit from a working copy (a build from a branch with its own config and data folders), it's only written to disk. Agents run builds like that all the time, and I really don't want some branch to start at every login and read my keyring.

## The timer got there before me

The full sync schedule is a timer with `OnCalendar=` and [`Persistent=true`](https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html#Persistent=). The docs say Persistent triggers the service right away if it would have run at least once while the timer was inactive. For a laptop that's off or asleep at night that's pretty much what you want.

User timers live in the user's own manager, though, and I have linger enabled. According to the [loginctl docs](https://www.freedesktop.org/software/systemd/man/latest/loginctl.html#enable-linger%20USER%E2%80%A6) the user manager then starts at boot and stays around after logout. It looks like that's what happened that night, and the timers dutifully caught up on the missed run while the keyring was still locked. And the keyring that holds the Telegram sign-in only opens when I log in.

tg couldn't read the keys and exited with `auth.failed`, code 4. The error text itself said the keyring was probably out of reach. But anything that looks at the code and not the text sees a sign-in error, meaning sign in again. The sign-in hadn't gone anywhere, the keyring was just still locked. Signing in again doesn't fix it, and the run for that day is lost anyway.

max failed for another reason: "name a profile", although the schedule file has `MAX_PROFILE=default`. That turned out to be a bug in `schedule exec`. cli-core fixed it the evening before, and the new max with that fix came out the same morning, before we even sat down to look. I had the previous version.

For the keyring I split it into 2 cases. If the profile has never signed in on this machine, it's a real sign-in error, code 4. But when a profile that has signed in before can't read its keys in the background (serve or a timer run), it returns `provider_unavailable`, code 12, with the reason `credentials.unreachable`. A command typed by hand still talks about signing in, because a person is right there and can unlock the keyring.

And `schedule exec` (that's what the timer calls), when it gets that reason, waits and tries again. The first pause is a minute. Each next pause is twice as long, up to 15 minutes. It waits 12 hours at most. So the night's run waits until I log in in the morning, and if that hasn't happened in 12 hours, it fails as it is.

You get one notification, and only if it never worked. Not one per try. Only daily and one-off schedules wait. The ones that repeat at an interval don't, they'll have their next run anyway. And `schedule run` by hand fails at once too, waiting 12 hours behind a person's back would be weird.

Plus timers that are already installed only need a CLI update. The retry lives in the code the timer calls, and the unit file doesn't change.

## Exit 4, which systemd was told never to restart

tg's serve unit file has this:

```ini
Restart=on-failure
RestartSec=30
RestartPreventExitStatus=4
```

[`Restart=on-failure`](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html#Restart=) restarts the service on any non-zero exit code, and [`RestartPreventExitStatus=`](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html#RestartPreventExitStatus=) prevents the restart for the listed codes, whatever `Restart=` says. 4 is on that list because with a revoked or missing sign-in the service fails the same way on every retry, so restarting it makes no sense. With max the reason is even more serious - a service that restarts on a refused sign-in would sign in again every 30 seconds, and MAX would count each of those attempts against the account. That's why max has not only 4 on the list, but also rate limit (8) and provider error (11).

And max exited with 4 on a locked keyring too. So even if the unit had been enabled, serve would have started at boot, failed to read the token, exited with 4, and systemd, as it was told, would never touch it again until the next reboot, which would end the same way. tg already returned 12 in this case, max didn't. That's why the agent started both services by hand in the morning but didn't turn on autostart: before login the keyring is locked, and the service would fail.

I moved max to 12 with the reason `credentials.unreachable` as well, 12 isn't on the list, and systemd brings serve back every 30 seconds until I log in and the keyring opens. max serve's own reconnect loop also no longer treats this as a refused sign-in. This only works on Linux for now. On a Mac a LaunchAgent that has a list of no-restart codes doesn't restart at all, so there exit 12 won't bring serve back.

There was a simpler option: hook the unit to `graphical-session.target`, so it starts with the graphical session, when the keyring is already open. Then the service would never start where systemd has no session targets, or on a machine people only reach over ssh. So the unit stayed in `default.target`, and the locked keyring is handled by the exit code. A restart every 30 seconds until login seems like a fair price to me for a service that starts on any Linux, even without a graphical session.

## 30 seconds and a closed pipe

In the morning the agent started a full sync by hand: `tg personal schedule run full-sync`. The command waited 30 seconds, returned `timeout` (code 9) and quit. And the sync it had started died right after with `write EPIPE`. That same night, before the reboot, a sync started from the desktop app had died the same way: after 18 minutes the app closed the pipe on its side, and the sync failed on its next write.

EPIPE is what you get when a process writes to a pipe and nobody is reading it anymore. The handler in cli-core stopped any command on EPIPE with exit 0. For `tg ... | head` that's right, head has read its 10 lines, closed the pipe, and there's no point going on. A sync runs for a couple of hours and writes into the archive, though, its output is just a log, and dropping the work because the output closed is wrong.

Now a sync (it decides by itself when to stop) and `schedule run`/`schedule exec` (they wait for work they started) keep going after EPIPE, their output just doesn't go anywhere. How the run ended is still in the run record. Other commands exit with 0, as `| head` expects. And `watch` also quits, without a reader it has nothing to do.

And the 30 seconds in `schedule run` had already been fixed, that fix came out in a new tg the same morning. I had the previous one. So 2 of that night's failures were already fixed by morning, just not on my machine.

Then the agent ran `tg personal messages sync --all` directly, with the output going to a file, and it went all the way (except 11 unavailable chats). It also closed a gap in the Telegram archive: since October 28 it had been getting 6 to 107 messages a day instead of 7-10 thousand.

## What I do differently now

For a local-first CLI on a desktop that has a service and schedules, this is what I do now:

- enable the service on install instead of printing a hint, because often it's not a person who installs it
- treat a locked keyring at boot as a temporary error with its own code
- keep only the codes where a retry really can't help in `RestartPreventExitStatus=`
- wait for the login with pauses and tell the person once if it never worked
- don't drop long work when the output closes

And update, yes. Both new versions with the fixes came out that same morning, less than an hour before we sat down to look, so I just hadn't had time to update.

All of this came out on Nov 2: cli-core 0.552.0, max 0.97.0 and tg 0.114.0. Details in the PRs: [cli-core #2401](https://github.com/WireCatLabs/cli-core/pull/2401) (enabling the unit, retry on a locked keyring, EPIPE), [tg-cli #812](https://github.com/WireCatLabs/tg-cli/pull/812) and [max-cli #901](https://github.com/WireCatLabs/max-cli/pull/901) (exit 12 instead of 4).

What I haven't checked yet:

- A reboot with the new versions. The tests cover enabling the unit, retries with pauses and EPIPE, but neither `server install` nor a timer was run on my live units.
- Mac. I checked the parsing of `launchctl print-disabled` against the output in the docs, not on a real Mac.
- How many restarts serve racks up before login and how that looks in the systemd journal.

If you run the tg or max service, update and run `tg <profile> server install` (or the same for max) once more. A unit from an older version won't enable itself. Then `server status`, and `starts_at_login` should be true.
