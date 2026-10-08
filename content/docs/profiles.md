---
title: "Profiles and bots"
description: "Keep accounts, bot logins and their settings separate."
---

Use profiles when you have multiple accounts, a bot or different access settings for your assistants. A profile gives an account or bot a name and its own settings. This page shows how to choose the right one and distinguish a bot command from a personal-account command.

## Choose a profile

Put the profile before the command:

```sh
tg work config show
max work config show
```

Without a name, the tools use the default profile. A setting under `profiles.work` applies to
that profile; values under `defaults` apply when it has no value of its own.
Profiles are not separate operating-system users: an assistant with unrestricted file access
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
For login, use the [Telegram](./tg/sessions.md) or [MAX](./max/sessions.md) guide.
