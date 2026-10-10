---
title: "Profiles and bots"
---

A **profile** names one `max` login on this computer: a personal MAX account or a bot, with its own session and settings. Without a name, `max` uses the `default` profile, so you do not need to think about profiles when using one account.

Use this page when you need a second account, want your AI agent to have fewer permissions than you, or want to run a bot. You will learn to select a profile for a command, give it its own settings and switch to a bot.

## What profiles let you do

| Goal | How |
| --- | --- |
| Use two MAX accounts on one computer | Log in once for each profile: `max work session start qr` |
| Give an agent fewer permissions than you | A profile with its own [permissions](./permissions.md) |
| Keep the agent in this profile | `MAX_PROFILE_LOCK` ([session profiles](./sessions.md#профили)) |
| Run a MAX bot alongside your account | A bot profile: `max support bot api get-my-info` |
| See all profiles on this computer | `max account list` |

## Choose a profile

Put the profile name before the command:

```sh
max work config show
```

`max account list` shows every profile on this computer and its account; `max work session end` logs the `work` profile out of MAX.

An entry in `profiles.work` in the configuration file applies to that profile; `defaults` supplies values that the profile does not override. See [session profiles](./sessions.md#профили) for profile-name rules and how `max` selects a profile.

A profile is not a separate operating-system user: an agent with full file access can reach other data on this computer too.

## Switch to a bot

Put `bot` after the profile name:

```sh
max support bot api get-my-info --json
```

These commands require a connected bot profile. MAX determines its account and permissions, separately from your personal account. [MAX bots](./bot.md) explains connection and examples.

## Settings and access

- [Configuration](./configuration.md) explains the file, environment variables and options.
- [Permissions](./permissions.md) controls each profile's actions.
- [Login, sessions and profiles](./sessions.md) explains how to log in to a profile.
