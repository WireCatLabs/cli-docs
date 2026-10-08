---
title: "Configuration"
description: "Save common settings instead of repeating options."
---

`tg` and `max` are configurable. You can save everyday settings, change a value for one command,
or choose a different profile. Permissions are explained separately in [Permissions](./permissions.md).

## The file

The tools create a starter `config.json` with common defaults when you first run a command that
loads settings. An existing file is preserved. Use these commands to see its path and current values:

```sh
tg config show
max config show
```

You can edit the file or use `config set` and `config unset`. Keep login credentials out of it;
use the login and model-provider setup commands instead.

| System | Telegram | MAX |
|---|---|---|
| Linux | `~/.config/tg-cli/config.json` | `~/.config/max-cli/config.json` |
| macOS | `~/Library/Application Support/tg-cli/config.json` | `~/Library/Application Support/max-cli/config.json` |
| Windows | `%APPDATA%\tg-cli\config.json` | `%APPDATA%\max-cli\config.json` |

Use `tg.cmd` and `max.cmd` in PowerShell. The commands above show the actual location if your
computer uses a custom directory.

## Three ways to set a value

- **File:** a value stays saved for later commands. `tg config set limit 50` saves a result limit.
- **Environment variable:** a terminal can select a profile or command time limit for its session.
  For example, `TG_PROFILE` or `MAX_PROFILE` chooses a profile. Not every setting has a variable.
- **Command option:** a flag such as `--limit 5` changes only this invocation.

## Which value wins?

A command option wins over an environment variable, then the selected profile's saved value,
then shared file defaults, then the built-in value. Only the supported ways of setting that
particular value take part. Each messenger's reference lists them.

## A small configuration

```json
{
  "defaults": { "limit": 20, "sendsPerHour": 30 },
  "profiles": { "work": { "limit": 50 } }
}
```

`tg work chats list` or `max work chats list` uses 50. Add `--limit 5` to get five for that command.
Removing the profile's value lets the shared default apply again.

## What can I configure?

Common settings include the number of results, colour, recording, send limits and model providers.
Read the [Telegram settings reference](./tg/configuration.md) or [MAX settings reference](./max/configuration.md)
for the available values and supported overrides. Use `config show` after a change to check the result.

## Profiles and bots

A profile keeps settings for one account or bot. Put its name before the command, such as
`tg work config show`. Add `bot` to work as a bot rather than your personal account.
[Profiles and bots](./profiles.md) explains choosing and switching them.
