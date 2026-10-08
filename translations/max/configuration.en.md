---
title: "Configuration"
---

You can configure `max` by saving defaults, changing one run or choosing another profile. Assistant access is covered separately in [Permissions](./permissions.md).

## Configuration file

The first command that reads configuration creates `config.json` with standard defaults. An existing file is preserved. To see its path and current values:

```sh
max config show
```

Edit the file manually or with `config set` and `config unset`. Do not store sign-in credentials in it: use sign-in and model-provider configuration commands.

| System | MAX |
|---|---|
| Linux | `~/.config/max-cli/config.json` |
| macOS | `~/Library/Application Support/max-cli/config.json` |
| Windows | `%APPDATA%\max-cli\config.json` |

Use `max.cmd` in PowerShell. The commands above show the actual location if your computer uses another directory.

## Three ways to set a value

- **File:** the value persists for future commands. `max config set limit 50` saves the result limit.
- **Environment variable:** the terminal can choose a profile or timeout for its session. For example, `MAX_PROFILE` chooses the profile. Not every setting has an environment variable.
- **Command option:** a flag such as `--limit 5` changes only that run.

## Which value takes precedence?

First the command option, then the environment variable, the selected profile value in the file, shared `defaults`, and the built-in value. Only methods supported by that setting apply; the messenger reference lists them.

## Short example

```json
{
  "defaults": { "limit": 20, "sendsPerHour": 30 },
  "profiles": { "work": { "limit": 50 } }
}
```

`max work chats list` uses 50. Add `--limit 5` to get five results for one command. Removing the profile value restores the shared value.

## What can you configure?

Result counts, color, run logging, send limits and model providers. The [configuration reference](./configuration-reference.md) lists values and override methods. After making changes, check them with `config show`. Providers, keys and OCR model selection are covered in the [external models guide](./external-models.md).

## Profiles and bots

A profile stores settings for an account or bot. Put its name before the command, for example `max work config show`. For a bot, add `bot` after the name. See [Profiles and bots](./profiles.md).

<a id="права-доступа" />

Permissions are covered separately in [Permissions](./permissions.md).
