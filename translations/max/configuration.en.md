---
title: "Configuration"
---
No configuration is required. Without a file or environment variables, built-in defaults apply. A configuration file is useful when you want to stop repeating the same flag.

## Setting precedence

**Flag → environment variable → file → built-in default.** This precedence is shared across the entire program, so commands cannot interpret it differently.

Within the file, **the most specific entry wins**. For a personal-account command using `work`: `personal.profiles.work` → `profiles.work` → `personal.defaults` → `defaults`. For `max work bot …`, the same order applies with `bot` replacing `personal`. A profile-specific entry takes precedence over a section-wide entry.

```sh
max chats list --limit 5          # флаг: 5
MAX_PROFILE=personal max chats list   # переменная выбирает профиль
# "limit": 50 у профиля в файле — когда флага нет
# "limit": 30 в "defaults" — когда и у профиля нет
# 20 — когда нет ничего
```

Two explicit exceptions take precedence over this order:

- **`MAX_TOKEN` takes precedence over the keychain.** If set, it is used instead, as in CI.
- **`MAX_CONFIG_DIR`, `MAX_STATE_DIR` relocate `max` settings and login state**, including the keychain entry associated with a profile.

## Current effective settings

```sh
max config show            # профиль, какие профили есть, файл и каждая настройка
max work config show       # то же для профиля work
max config show --json     # то же одним объектом
```

Each setting shows its source: `flag`, `default` or `config file:` with its key, such as `config file: bot.profiles.test`. The profile source is `first word`, `MAX_PROFILE`, `MAX_PROFILE_LOCK`, `config file: defaultProfile` or `default`.

With `--json`, the response also includes `storeSettings`: shared archive settings (`searchStemmers.*`) and their origin, `store` or `default`.

`max test config show --bot` shows the settings used by `max test bot …`: bots have their own section and send limit. `configFound: false` means no file exists and built-in settings apply. If a `MAX_*_DIR` variable is set, the command reports it on stderr: these variables change the profile's keyring entry, so a session created without them appears missing.

Output contains no secrets: the configuration file has no fields in which to store them.

## Access permissions

`deny` forbids reading and writing; `readonly` permits reading; `ask` requires confirmation; `allow` performs the action without a question. In a terminal, `ask` prompts with “no” as the default answer. JSON mode has no prompt: use `--yes`, or `--allow-dangerous` for message deletion. MCP obtains confirmation through a client form. `--confirm-send` requires a form for every write. Through `mcp --http`, every write requires a form regardless of the permission level and confirmation flags.

A more specific key overrides its resource. This example allows reading messages and deleting them without confirmation, while forbidding other message writes:

```json
{ "profiles": { "work": { "permissions": { "messages": "readonly", "messages.delete": "allow" } } } }
```

This example does not restrict contacts, chats, reactions or other resources. Bot keys start with `bot`, such as `bot.messages.send`. `config show` reports effective permissions and their source. `config set` rejects an unknown command key with code 2, including inside a whole `permissions` object. `config unset` lets you remove an old unknown key. Reading an existing file with such a key prints a warning on stderr and continues.

Permissions from different sections of the file add up, but **the nearest section decides first, then the key length**. A key set on a profile overrides the same key and all keys under it in `personal.defaults` and `defaults`. Here, the `agent` profile does not delete messages: its `messages` overrides `messages.delete` from `defaults`.

```json
{
  "defaults": { "permissions": { "messages.delete": "allow" } },
  "profiles": { "agent": { "permissions": { "messages": "readonly" } } }
}
```

This works both ways: `messages: allow` on a profile also overrides `messages.delete: deny` from `defaults`, and then deletion asks again, as by default. Legacy `readOnly` and `allow` apply in the section where they are written.

Preview the changes before converting an older file:

```sh
max config migrate --dry-run
max config migrate
```

Migration preserves effective permissions, MAX settings and moderation checkpoints. Legacy rule levels `forbid/flag/confirm` become `deny/ask/ask`. `--dry-run` writes nothing. Once `permissions` exists, attempts to change `readOnly`, `allow` or `mcpTools` are refused with guidance for the replacement setting. `MAX_PROFILE_LOCK` forbids migrating the entire file; preview remains available.

## Configuration file

`~/.config/max-cli/config.json`, permissions `0644`. It is written by `max config set` below, or edited manually.

```json
{
  "defaultProfile": "personal",
  "defaults": { "keepRunsForDays": 14 },
  "profiles": {
    "personal": { "limit": 50, "timeoutMs": 20000, "color": true },
    "work": { "limit": 10 }
  },
  "personal": {
    "defaults": { "sendsPerHour": 30 }
  },
  "bot": {
    "defaults": { "permissions": { "bot": "readonly", "bot.messages.send": "allow" } },
    "profiles": { "shop": { "sendsPerHour": 200 } }
  }
}
```

- `defaults` — all profiles, both personal accounts and bots.
- `profiles.<имя>` — one profile, regardless of role.
- `personal.defaults`, `personal.profiles.<имя>` — personal-account commands only.
- `bot.defaults`, `bot.profiles.<имя>` — `max <имя> bot …` commands only.

| Field | Purpose | Overridden for one run by | Default |
|---|---|---|---|
| `defaultProfile` | Profile when none is named as the first word and `MAX_PROFILE` is unset | first word (`max work …`), `MAX_PROFILE` | `default` |
| `embeddingProvider` | Local model (`local`, the default) or `openai` | `--provider` | `local` |
| `embeddingModel` | Embedding model | `--model` | Service default |
| `embeddingBaseUrl` | Embedding API URL | `--base-url` | Service default |
| `embeddingDims` | Vector size, integer 1–65,536 | `--dims` | Model default |
| `analysisProvider` | Agent (`agent`), `openai` or `anthropic` | `build --provider` | `agent` |
| `analysisModel` | Analysis model | `build --model` | None; set explicitly for `--analyze` |
| `analysisBaseUrl` | Analysis API URL | `build --base-url` | Service default |
| `limit` | Records to display when `--limit` is absent | `--limit` | `20` |
| `timeoutMs` | Time to wait for **one request** | — (`--timeout` is different, see below) | Transport default |
| `color` | Terminal color; if absent, detect whether output is a terminal | —; without the field, `NO_COLOR` turns color off | Terminal detection |
| `senderColors` | Give each author a color in `max messages`; `вы` is always cyan. Requires `color`. Personal accounts only | — | `false` |
| `catchUpMarksRead` | `max inbox` and `max review` mark each shown chat as read — up to the last shown message. The other person sees the mark. Personal accounts only | `--mark-read`, `--no-mark-read` | `false` |
| `record` | Record every run as though `--record` were set | `--record`, `--no-record` | `false` |
| `permissions` | resource and command permission levels: `deny`, `readonly`, `ask`, `allow`; a more specific key takes precedence | —; `--yes` and `--allow-dangerous` only answer `ask`; they do not lift `deny` | almost everything `allow`; message deletion and ending other sessions `ask`; automatic replies `replies.send` `deny` |
| `serve` | Start `max serve` in the background when a command needs MAX and no server exists. Never starts with `MAX_TOKEN`. Personal accounts only | `--serve`, `--no-serve` | `true` |
| `keepRunsForDays` | Run-record retention in days | — | `30` |
| `readOnly`, `allow`, `mcpTools` | legacy settings read for compatibility; `config migrate` converts them to `permissions` | — | cannot be changed after migration |
| `sendsPerHour` | Hourly limit including messages, forwards, edits, pins with notifications, deleted messages and members added to groups; exceeding it refuses with code `8`. **Bots** use only the `bot` section; without it, bots have no limit | — | `30`; unlimited for bots |
| `readOtherBots` | Permit another bot's local data when requested with `--all-bots` or `--bots`: `false`, `true` for all bots, or a list of bot profiles. **Only in `bot`** | —; `--all-bots` and `--bots` request it, the field permits it | `false` |
| `updateCheck` | Check npm once a day for a newer version and report it in the terminal. **Only in `defaults`**, because the program version is shared by all profiles | —; turned off by `MAX_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER`, `CI` | `true` |
| `skillHint` | Once a day, tell an agent on stderr if the `max` skill is missing or outdated, and suggest `max skill install`. Agents are detected through `AI_AGENT` or `CLAUDECODE`. **Only in `defaults`** | — | `true` |
| `transcribeModel` | Speech model for `max messages transcribe`. **Only in `defaults`** | `--model` on `messages transcribe` and next to `--transcribe` | `gigaam-v3` |

⚠ **`timeoutMs` and `--timeout` are different.** `timeoutMs` is the wait for **one MAX response**. `--timeout` limits **the whole command**. A read involves connecting, INIT, LOGIN, resolving a chat name and the request itself, so its total time can be several times `timeoutMs`.

Their formats deliberately differ: `timeoutMs` is a number of milliseconds in the file; `--timeout` is a command-line duration with a unit (`30s`, `2m`, `500ms`). A unit is required: `--timeout 30` is rejected because confusing seconds with the nearby milliseconds field could cause a thirtyfold error either way.

There is no file setting for `--timeout`: a command budget belongs to a specific run, rather than a lasting preference.

**`--page` and `--all` deliberately have no file settings.** A saved page number is useful once, then disrupts later runs. The same applies to `--order` for `max contacts list`: `contactOrder` would duplicate the same option. `--limit` has a setting because how much to show is a lasting preference.

**Secrets cannot go in this file.** The schema has no token, phone-number or chat-ID field. A schema without a place for secrets is stronger than an instruction not to put them there.

## Changing settings without opening the file

```sh
max config set limit 50                 # профилю по умолчанию
max work config set record true         # профилю work
max config set keepRunsForDays 7 --defaults   # всем профилям сразу
max work config unset limit             # убрать; снова решает defaults или встроенное
max agent config set permissions.messages readonly  # чтение сообщений без записи
max shop config set --bot sendsPerHour 200    # только боту shop
max config set --personal --defaults limit 30 # всем личным аккаунтам
max config set defaultProfile work      # какой профиль без первого слова
```

Values are validated by the same schema used for reading, **before writing**: `max config set limit 0` is refused and leaves the file unchanged. `serve`, `senderColors`, `catchUpMarksRead` and `mcpTools` are not accepted with `--bot`: bots have no server, sender colors or unread messages, and legacy `mcpTools` belongs only to personal accounts.

`searchStemmers.cyrillic` (`russian` or `none`) and `searchStemmers.latin` (`spanish`, `english` or
`none`) are stored in the shared message archive, not the configuration file: they apply to every profile and both messengers. They therefore reject `--defaults`, `--personal` and `--bot`, and cannot be changed under `MAX_PROFILE_LOCK`. `config unset` restores the built-in value. After changing them, run `max store reindex` — see [Archive maintenance](./archive.md#обслуживание-архива).

## Typos are errors, not ignored settings

An unknown field is rejected by name with `configuration_error` (exit code `3`):

```json
{"error":{"code":"configuration_error","message":"/home/you/.config/max-cli/config.json is not a valid config:\n  profiles.default.limitt: unknown setting — the known ones are limit, timeoutMs, color, record, keepRunsForDays, readOnly, allow, permissions, sendsPerHour, senderColors, serve, mcpTools"}}
```

An incorrect type names the field and accepted value: `profiles.default.limit: has to be a
whole number, 1 or more, not "20"`.

This is intentional. Silently discarding an unknown field turns a typo into hours spent wondering why a setting has no effect.

A missing file is not an error: it means the program has not been configured.

## Inspecting the result

Settings have several layers, so the file alone may not tell you which one won. This command explains directly:

```sh
max config show
max config show --json
```

It prints the chosen profile **and its source**, the configuration path and whether it exists, available profiles and all effective settings with their individual sources.

⚠ **The profile list includes all profiles on this machine:** those named in configuration, logged in as personal accounts, or configured as bots. Each is identified as personal, bot or both.

⚠ **This is not a health check.** It reads files without opening the cache, accessing the keyring or contacting MAX. Checking whether a session is valid requires a login and belongs to another command.

## Environment variables

| Variable | Purpose |
|---|---|
| `MAX_PROFILE` | Profile for the shell session; equivalent to the first word |
| `MAX_PROFILE_LOCK` | Lock a process to one profile; another profile through the first word or `MAX_PROFILE`, and `config set --defaults`, are rejected. Effective only where an agent cannot change its environment, such as MCP-client settings or a wrapper script. An agent with shell access can unset it |
| `MAX_TIMEOUT` | Whole-command limit for the shell session; equivalent to `--timeout` |
| `MAX_TOKEN` | Token supplied directly, bypassing the keyring, for CI and one-off runs |
| `MAX_BOT_TOKEN` | Token for `max bot`, bypassing the keyring |
| `MAX_CONFIG_DIR` | Directory for `config.json` and, without a keyring, the token file |
| `MAX_STATE_DIR` | Directory for profile state and `runs/` |
| `MESSAGING_STORE` | Shared local store file for chats, messages and transcripts |
| `NO_COLOR` | Disable color, following the common convention |
| `MAX_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER` | Do not query npm for a newer version; `CI` has the same effect |

An empty string counts as unset: `MAX_PROFILE=` is equivalent to not setting `MAX_PROFILE`.

**Only profile and timeout have environment-variable equivalents.** These are process-wide choices. There will be no variable for `--json` or color: forgetting one in a shell would change output for commands that never requested it, making diagnosis harder than simply supplying a flag.

## Temporary separate configuration

Directory variables give you separate settings and login state, useful for experiments, a second account or tests. They do not change the shared message store used by `tg`: `MESSAGING_STORE` selects that separate file. Speech models remain shared.

```sh
export MAX_CONFIG_DIR=/tmp/max-try/config
export MAX_STATE_DIR=/tmp/max-try/state
export MESSAGING_STORE=/tmp/max-try/messages.db

max setup            # этот токен не виден обычной установке
max chats list
```

> ⚠ The reverse is also true: **the normal installation cannot see this session**. An hour was once lost to “no session” despite a valid token because variables remained set in one terminal window but not another.

## Next steps

- [Command reference](./commands.md) — all commands, options and exit codes.
- [Sessions and profiles](./sessions.md) — profiles and token storage.
- [Troubleshooting](./troubleshooting.md) — resolving problems.

`MAX_CACHE_DIR` now applies only to the old cache: `max doctor` looks there for a remaining file. For compatibility, this variable still changes the keychain entry. Use `MESSAGING_STORE` for the new shared store.

Embedding and analysis settings are independent and may differ by profile. `MAX_EMBEDDING_PROVIDER`, `MAX_EMBEDDING_MODEL`, `MAX_EMBEDDING_BASE_URL`, `MAX_EMBEDDING_DIMS`, `MAX_ANALYSIS_PROVIDER`, `MAX_ANALYSIS_MODEL` and `MAX_ANALYSIS_BASE_URL` override configuration; flags override settings. The URL must be HTTP/S with no embedded password, query or fragment. An external embedding service also receives questions from MCP search. Keys are set through `models text key set openai|anthropic` and are not written to `config.json`. An ordinary `build` does not run external analysis: explicit `--analyze` is required.
