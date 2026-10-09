---
title: "Configuration"
---

<a id="файл" />
<a id="короткий-пример" />

Use this page when you repeatedly type the same option or want `max` to behave differently for one account. You will learn where the settings file lives, which basic settings to change, how to change one value and how to check the effective value. No file is needed to start: every setting has a built-in default.

Terms used below:

- **Configuration file** (`config.json`) — the text file storing your saved choices.
- **Profile** — named settings for one MAX account or bot, such as `work`. Put its name before the command: `max work chats list`. See [profiles and bots](./profiles.md).
- **Option** (flag) — a word added to a command, such as `--limit 5`. It affects only that run.
- **Environment variable** — a named value passed to `max` by a terminal or agent process, such as `MAX_PROFILE=work`.
- **Default** — the value `max` uses when you specify no other value.

## What you can configure

These settings are changed most often. The [configuration reference](./configuration-reference.md#файл) gives each setting's exact type and all override methods.

| Setting | Purpose | Built-in default |
| --- | --- | --- |
| `limit` | Rows displayed without `--limit` | `20` |
| `sendsPerHour` | Messages a profile may send per hour; stops sending loops | `30`; bots have no limit until set in `bot` |
| `requestsPerMinute` | Request rate after an initial short burst; `0` disables pacing ([limits and waits](./limits.md)) | `20` |
| `permissions` | Read, ask before changes or act without asking ([permissions](./permissions.md)) | All allowed except deletion and some other irreversible changes ask first; auto-reply sending is disabled |
| `record` | Save each run for later inspection ([diagnostics](./diagnostics.md)) | `false` |
| `keepRunsForDays` | Days to retain run records | `30` |
| `color` | Table colours | Based on terminal |
| `senderColors` | Different colour for each message author | `false` |
| `timeoutMs` | Milliseconds to wait for **one** MAX response; use `--timeout` for the whole command | Transport-dependent |
| `catchUpMarksRead` | `inbox` and `review` mark displayed chats read; the other person can see this | `false` |
| `serve` | Start background `max serve` when a command needs MAX ([one shared login](./limits.md#один-вход-на-всё)) | `true` |
| `transcribeModel` | Speech-recognition model for voice messages | `gigaam-v3` |
| `updateCheck` | Report new `max` versions once a day | `true` |
| `defaultProfile` | Profile used when none is named | `default` |

There is no place for secrets in this file: no token, phone number or chat id. Tokens use the system keyring or, if unavailable, a file only you can read ([token storage](./security.md#где-живёт-токен)).

## Example configuration file

The first command reading settings creates an initial file. Here it is with one profile added:

```json
{
  "defaults": { "limit": 20, "keepRunsForDays": 30, "sendsPerHour": 30, "updateCheck": true, "skillHint": true },
  "profiles": {
    "work": { "limit": 50 }
  }
}
```

- `defaults` applies to all profiles.
- `profiles.work` applies only to `work` and overrides `defaults`.

Thus `max work chats list` shows 50 rows, while `max chats list` shows 20. Add `--limit 5` for five rows in one command. Remove the profile's `limit` to use `defaults` again.

<details> <summary>Full example with all sections</summary>

```json
{
  "defaultProfile": "personal",
  "defaults": {
    "limit": 20,
    "keepRunsForDays": 14,
    "sendsPerHour": 30,
    "requestsPerMinute": 20,
    "updateCheck": true,
    "skillHint": true,
    "transcribeModel": "gigaam-v3"
  },
  "profiles": {
    "personal": {
      "limit": 50,
      "color": true,
      "senderColors": true,
      "record": true
    },
    "work": {
      "permissions": { "messages": "readonly", "messages.send": "allow" },
      "sendsPerHour": 10,
      "serve": false
    }
  },
  "personal": {
    "defaults": { "catchUpMarksRead": false, "searchCatchUp": true }
  },
  "bot": {
    "defaults": { "permissions": { "bot": "readonly", "bot.messages.send": "allow" } },
    "profiles": {
      "shop": { "sendsPerHour": 200, "readOtherBots": false }
    }
  }
}
```

What each part does:

- `defaultProfile`: `max chats list` without a profile name uses `personal`.
- `defaults`: every profile receives these values unless it overrides them. `updateCheck`, `skillHint` and `transcribeModel` are allowed only here because the program and speech-recognition downloads are shared by all profiles.
- `profiles.personal`: more rows, colours and recording every run, only for `personal`.
- `profiles.work`: reading and sending messages are allowed; other message changes are denied. At most 10 sends per hour. No background server starts: each command connects to MAX itself.
- `personal.defaults`: applies only to personal-account commands, never `max … bot`. Here `store fetch` also prepares downloaded chats for search.
- `bot.defaults`: applies only to bot commands (`max shop bot …`). Bots can read and send, and do nothing else.
- `bot.profiles.shop`: `shop` can send 200 messages per hour and cannot read other bots' saved data on this computer. `readOtherBots` is allowed only in `bot`; `serve`, `senderColors` and `catchUpMarksRead` are not accepted there.

</details>

## File location

| System | Path |
|---|---|
| Linux | `~/.config/max-cli/config.json` |
| macOS | `~/Library/Preferences/max-cli/config.json` |
| Windows | `%APPDATA%\max-cli\Config\config.json` |

`max config show` prints this computer's actual path and each effective setting. In PowerShell, use `max.cmd` instead of `max`. An existing file is never replaced with the initial file.

## Three ways to set a value

- **File:** the value persists for future commands. `max config set limit 50` saves it.
- **Environment variable:** applies to one terminal or agent process. For example, `MAX_PROFILE` selects a profile and `MAX_TIMEOUT` limits command duration. Not every setting has a variable.
- **Option:** `--limit 5` affects only one command.

## Which value takes precedence?

Options override environment variables, followed by the profile's file value, file `defaults`, then built-in defaults. Each setting supports only certain methods; the [configuration reference](./configuration-reference.md#какое-значение-побеждает) lists them.

## Change a value

Edit the file with any text editor or let `max` do it. `config set` validates before writing, so it never saves a file the next command would reject.

```sh
max config set limit 50                 # профилю, с которым вы работаете
max work config set limit 50            # профилю work
max config set sendsPerHour 10 --defaults   # всем профилям
max config unset limit                  # вернуть значение по умолчанию
max config show                         # проверить, что действует и откуда взялось каждое значение
```

A misspelled setting is an error rather than a silent default: every command stops and names the invalid key ([file typos](./configuration-reference.md#опечатка--это-ошибка-а-не-умолчание)).

## Profiles and bots

A profile stores settings for one account or bot. Put its name before the command, such as `max work config show`. To act as a bot, add `bot` after the name. [Profiles and bots](./profiles.md) explains creating profiles and switching between them.

<a id="права-доступа" />

## Next steps

- [Permissions](./permissions.md): choose what a profile and its agent may do.
- [Configuration reference](./configuration-reference.md): every setting, type, allowed scope and environment variable.
- [External models](./external-models.md): providers, keys and AI configuration for reading image text (OCR).
