---
title: "Profiles and bots"
description: "Keep accounts, bot logins and their settings separate."
---

Use profiles when you have multiple accounts, a bot or different access settings for your agents. A profile is a named configuration for one account or bot connection on this computer, with its own login and permissions. This page shows how to choose the right one and distinguish a bot command from a personal-account command.

## Choose a profile

Put the profile before the command:

```sh
tg work config show
drive personal sync
```

Name the profile in every command and agent request: `tg work …`, or `TG_PROFILE=work` for a whole
session (`tg` reads `TG_PROFILE` and `max` reads `MAX_PROFILE`; `zm` uses the `account.profile` setting; `memo` and `drive` read no profile variable, so name the profile in the command). No profile is ever picked for you. A command
that needs one and names none stops with an error that lists the profiles on this computer. A setting under `profiles.work` applies to that
profile; `defaults` supplies values it has not set.
Profiles are not separate operating-system users: an agent with unrestricted file access
can still reach other data on that computer.

## Switch to a bot

Use `bot` after the profile name:

```sh
tg support bot api get-me --json
max support bot api get-my-info --json
```

These commands require an already connected bot profile. The bot's account and rights come
from the messenger, not from your personal account. [Bots](./bot-api.mdx) explains setup and examples.

## Settings and access

[Configuration](./configuration.mdx) explains saved values, environment variables and flags.
[Permissions](./permissions.mdx) controls what each profile may do.
For login, use the [Telegram](./tg/sessions.md) or [MAX](./max/sessions.md) guide, or [connect Google Drive](./drive/installation.md).
