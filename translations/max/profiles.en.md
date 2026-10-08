---
title: "Profiles and bots"
---

A profile gives an account or bot a name and its own settings. Use profiles for multiple accounts, different assistant permissions or a bot.

## Choose a profile

Put the profile name before the command:

```sh
max work config show
```

Without a name, the default profile is used. Settings in `profiles.work` apply to that profile; `defaults` applies when the profile has no value of its own. A profile is not a separate OS user: giving an assistant full file access may also give it access to other data.

## Switch to a bot

Put `bot` after the profile name:

```sh
max support bot api get-my-info --json
```

These commands require a bot profile that is already connected. The messenger determines the bot account and permissions, independently of your personal account. [Bots](./bot.md) explains setup and provides examples.

## Settings and access

[Configuration](./configuration.md) explains the file, environment variables and flags. [Permissions](./permissions.md) defines what each profile can do. To sign in, follow the [sign-in guide](./sessions.md).
