---
title: "Profiles and bots"
description: "Keep accounts, bot logins and their settings separate."
---

A profile gives an account or bot a name and its own settings. Use it when you have more than
one account, want separate assistant permissions, or work with a bot.

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
from the messenger, not from your personal account. [Bots](./bot-api.md) explains setup and examples.

## Settings and access

[Configuration](./configuration.md) explains saved values, environment variables and flags.
[Permissions](./permissions.md) controls what each profile may do.
For login, use the [Telegram](./tg/sessions.md) or [MAX](./max/sessions.md) guide.
