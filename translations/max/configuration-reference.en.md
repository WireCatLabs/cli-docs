---
title: "Configuration reference"
---

<a id="порядок-в-котором-решается-настройка" />
<a id="посмотреть-что-получилось" />

Use this reference to look up setting names, types, defaults, scopes, environment variables and precedence. For ordinary changes and file examples, start with [configuration](./configuration.md). The [CLI contract](./cli-contract.md) covers command behaviour, output and exit codes.

Terms used below:

- **Section** — part of the configuration file. `defaults` applies to all profiles; `profiles.<имя>` to one profile; `personal.*` only to personal-account commands; `bot.*` only to bot commands.
- **Scope** — the sections accepting a setting. Using it elsewhere is an error.
- **Source** — the origin of the effective value: option, environment variable, file section or built-in default.

The file has no secret fields: it cannot hold a token, phone number or chat id.

A short example file and a complete one, with all sections and an explanation of each part, can be found in the [Settings Guide](./configuration.md#пример-файла-настроек).

## Which value wins

**Option → environment variable → file → built-in default.** Shared resolution code applies this order throughout the program; individual commands cannot change it.

Within the file, **the most specific entry wins**. For a personal-account command using `work`: `personal.profiles.work` → `profiles.work` → `personal.defaults` → `defaults`. For `max work bot …`, the same order applies with `bot` replacing `personal`. A profile-specific entry takes precedence over a section-wide entry.

```sh
max chats list --limit 5          # флаг: 5
MAX_PROFILE=personal max chats list   # переменная выбирает профиль
# "limit": 50 у профиля в файле — когда флага нет
# "limit": 30 в "defaults" — когда и у профиля нет
# 20 — когда нет ничего
```

Not every setting has every method. [Settings table](#файл) tells you what they are.

Two exceptions are higher than this order:

- **`MAX_TOKEN` takes precedence over the keyring.** If set, it is used instead, as in CI.
- **`MAX_CONFIG_DIR`, `MAX_STATE_DIR` relocate `max` settings and login state**, including the keyring entry associated with a profile.

## Current effective settings

```sh
max config show            # профиль, какие профили есть, файл и каждая настройка
max work config show       # то же для профиля work
max shop config show --bot # то же для команд бота shop
max config show --json     # то же одним объектом
```

The command prints the selected profile **and where it came from**, the path to the settings file and whether it exists, the profiles and effective values of all settings with the source of each.

Each setting shows its source: `flag`, `default` or `config file:` with its key, such as `config file: bot.profiles.test`. The profile source is `first word`, `MAX_PROFILE`, `MAX_PROFILE_LOCK`, `config file: defaultProfile` or `default`.

With `--json`, the response also includes `storeSettings`: shared archive settings (`searchStemmers.*`) and their origin, `store` or `default`.

`--bot` shows the settings as `max <имя> bot …` will receive them: the bot has its own section and its own sending limit. If the file does not exist, loading settings first creates one with the usual default values. The existing file is not overwritten. If one of the `MAX_*_DIR` variables is set, command will say this in stderr: with them, the profile has a different entry in the keyring, and login made without them looks like “no session”.

⚠ **The profile list includes all profiles on this machine:** those named in configuration, logged in as personal accounts, or configured as bots. Each is identified as personal, bot or both.

⚠ **This is not a health check.** The command reads files: does not open the cache, does not touch the keyring and does not contact MAX. `max doctor` checks whether the session is alive ([first step in case of problems](./troubleshooting.md)).

Output contains no secrets: the configuration file has no fields in which to store them.

## Configuration file

`~/.config/max-cli/config.json` on Linux; Paths on other systems are in the [Settings Guide](./configuration.md#где-лежит-файл). The first command reading the settings creates it from `limit`, `keepRunsForDays`, `sendsPerHour`, `updateCheck` and `skillHint` into `defaults`. The file is created with the rights `0600`, and `max config set` writes it with the rights `0644`: there are no secrets in it.

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

| Field | Purpose | Override for one run | Default |
| --- | --- | --- | --- |
| `defaultProfile` | Profile when no first-word profile or `MAX_PROFILE` is supplied | First word (`max work …`), `MAX_PROFILE` | `default` |
| `limit` | Rows shown without `--limit` | `--limit` | `20` |
| `timeoutMs` | Milliseconds to wait for **one request** | None (`--timeout` is different; see below) | Transport-dependent |
| `color` | Terminal colours; otherwise based on terminal detection | None; without the field, `NO_COLOR` disables colour | Terminal-dependent |
| `senderColors` | Separate author colours in `max messages`; `вы` is always blue. Requires `color`. Personal accounts only | None | `false` |
| `catchUpMarksRead` | `max inbox`/`max review` mark displayed chats read through the last shown message. Other people see the receipt. Personal accounts only | `--mark-read`, `--no-mark-read` | `false` |
| `searchCatchUp` | After `store fetch` or gap repair, prepare this chat's graph and installed local vectors within limits; no automatic downloads or remote calls. Personal accounts only | `--catch-up`, `--no-catch-up` | `false` |
| `record` | Save every run as with `--record` ([diagnostics](./diagnostics.md)) | `--record`, `--no-record` | `false` |
| `keepRunsForDays` | Run-record retention in days | None | `30` |
| `permissions` | `deny`, `readonly`, `ask`, `allow` by resource/command; more specific keys win ([below](#права-доступа)) | None; `--yes` and `--allow-dangerous` answer `ask`, never override `deny` | `allow` except deletion, ending other sessions and some irreversible actions use `ask`; auto-reply `replies.send` uses `deny` |
| `sendsPerHour` | Hourly sends including forwards, edits, notifying pins, deletions, member additions and accepted join requests; excess returns code `8`. Bot limits must be set in `bot` ([send protection](./security.md#защита-от-отправки-не-туда)) | None | `30`; no default bot limit |
| `requestsPerMinute` | Shared profile request rate after the initial 10-request burst; `0` disables pacing ([limits](./limits.md)) | `MAX_REQUESTS_PER_MINUTE` | `20` |
| `serve` | Start `max serve` when needed and absent. Disabled with `MAX_TOKEN`. Personal accounts only | `--serve`, `--no-serve` | `true` |
| `transcribeModel` | Speech recognition for `max messages transcribe`; **only in `defaults`** | `--model` with `messages transcribe` or `--transcribe` | `gigaam-v3` |
| `readOtherBots` | Permit requested `--all-bots`/`--bots` reads: `false`, `true` for all, or bot-profile names. **Only in `bot`** ([bots](./bot.md)) | None; flags request access, the setting allows it | `false` |
| `updateCheck` | Check npm and show update notices once daily. **Only in `defaults`**: version is shared across profiles | Disabled by `MAX_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER`, `CI` | `true` |
| `skillHint` | Daily stderr notice for a missing/outdated `max` skill with `max skill install` guidance. Detects agents through `AI_AGENT` or `CLAUDECODE`. **Only in `defaults`** | None | `true` |
| `readOnly`, `allow`, `mcpTools` | Legacy compatibility settings; `config migrate` converts to `permissions` | None | Cannot be changed after migration |
| `embeddingProvider` | Local recognition (`local`) or `openai` | `--provider` | `local` |
| `embeddingModel` | Embedding model id | `--model` | Provider-dependent |
| `embeddingBaseUrl` | Vector API URL | `--base-url` | Provider-dependent |
| `embeddingDims` | Vector size, integer 1–65,536 | `--dims` | Model-dependent |
| `analysisProvider` | `agent`, `openai` or `anthropic` | `build --provider` | `agent` |
| `analysisModel` | Analysis model id | `build --model` | Unset; explicitly required for `--analyze` |
| `analysisBaseUrl` | Analysis API URL | `build --base-url` | Provider-dependent |
| `models` | External AI configuration by purpose ([below](#модели-по-назначению)) | `MAX_MODELS_*` variables | Unset |
| `searchStemmers.cyrillic`, `searchStemmers.latin` | Word-stem languages for the shared archive ([below](#языки-поиска)) | None | `russian`, `english,spanish` |

⚠ **`timeoutMs` and `--timeout` are different things, and it’s expensive to confuse them.** `timeoutMs` is how long to wait **one answer** from MAX. `--timeout` - how much is allocated to **command entirely**. One read is a connection, INIT, LOGIN, parsing the chat name and the request itself, so the operating time is a multiple of `timeoutMs` and is never equal to it.

Their formats deliberately differ: `timeoutMs` is a number of milliseconds in the file; `--timeout` is a command-line duration with a unit (`30s`, `2m`, `500ms`). A unit is required: `--timeout 30` is rejected because confusing seconds with the nearby milliseconds field could cause a thirtyfold error either way.

There is no file setting for `--timeout`: a command budget belongs to a specific run, rather than a lasting preference.

**`--page` and `--all` deliberately have no file settings.** A saved page number is useful once, then disrupts later runs. The same applies to `--order` for `max contacts list`: `contactOrder` would duplicate the same option. `--limit` has a setting because how much to show is a lasting preference.

## Access permissions

`permissions` is an object: each key is a command path, each value is a level.

```json
{ "profiles": { "work": { "permissions": { "messages": "readonly", "messages.delete": "allow" } } } }
```

| Level | What's going on |
|---|---|
| `deny` | nothing, not even reading: failure with code `5` before connection |
| `readonly` | reading works; change - failure with code `5` |
| `ask` | question in the terminal, the default answer is “no” ([below](#вопрос-перед-изменением)) |
| `allow` | action is performed without question |

**The key is the command path**: `messages`, `messages.delete`, `messages.send`, `reactions`, `chats.members`, `contacts`, `account.sessions.end`. It starts with a resource - `messages`, `reactions`, `polls`, `topics`, `chats`, `contacts`, `account`, `bot`, `conversations`, `tags`, `search`, `searches`, `tasks`, `replies`, `attachments`, `stats`, `store` or `metadata`. The bot's keys start with `bot`, for example `bot.messages.send`. `config set` rejects the unknown command key, including inside the entire `permissions` object, with code 2. `config unset` allows you to delete the old unknown key. Reading an existing file with such a key warns in stderr and continues to work.

**A more specific key overrides its resource.** The example allows reading and deleting messages without confirmation, while denying other message writes. It does not restrict contacts, chats, reactions or other resources. `config show` displays effective permissions and their sources.

Permissions from file sections combine, but **the nearest section takes precedence before key specificity**. A profile key overrides that key and all its descendants in `personal.defaults`, `bot.defaults` and `defaults`. Here `agent` cannot delete: its `messages` overrides inherited `messages.delete` from `defaults`.

```json
{
  "defaults": { "permissions": { "messages.delete": "allow" } },
  "profiles": { "agent": { "permissions": { "messages": "readonly" } } }
}
```

This works both ways: `messages: allow` on a profile also overrides `messages.delete: deny` from `defaults`, and then deletion asks again, as by default. Legacy `readOnly` and `allow` apply in the section where they are written.

**By default, everything is allowed except for a few changes that are difficult to undo.** Asking: `messages.delete`, `bot.messages.delete`, `chats.delete`, `chats.clear`, `topics.enable`, `topics.delete`, and `account.sessions.end`. Automatic replies are not sent until you allow: `replies.send` - `deny`.

```sh
max config set permissions.messages.delete allow     # удалять без вопроса
max config set permissions.messages.send ask         # спрашивать перед каждой отправкой
max config unset permissions.messages.delete         # вернуть значение по умолчанию
```

### Question before change

At level `ask` a question appears in the terminal with the default answer being “no”. The flag gives the answer for you: `--allow-dangerous` - for irreversible deletion (of messages, chat, its history or topic), `--yes` - for any other change. In JSON mode there is no question: one of these flags is needed.

### Via MCP

MCP has no confirmation forms: `ask` permits the requested write; `deny` and `readonly` still block it. `--permission ключ=уровень` overrides permissions only for this process. Legacy confirmation flags no longer control access. In the CLI, `ask` still needs an answer or explicit confirmation flag. See [MCP](./mcp.md).

### Old settings that still work

`readOnly: true` is read as `readonly` for each resource. List in `allow` (`send`, `forward`, `reaction`, `edit`, `pin`, `read`, `delete`, `groups`, `contacts`, `profile`, `folders`, `sessions`) reads `allow` for these actions and `readonly` for the rest; it still asks for deletion. The key in `permissions` of the same partition is more important than both. `mcpTools` is read, but access no longer changes.

### Translation of old settings

Preview the changes before converting an older file:

```sh
max config migrate --dry-run
max config migrate
```

Migration preserves effective permissions, MAX settings and moderation checkpoints. Legacy rule levels `forbid/flag/confirm` become `deny/ask/ask`. `--dry-run` writes nothing. Once `permissions` exists, attempts to change `readOnly`, `allow` or `mcpTools` are refused with guidance for the replacement setting. `MAX_PROFILE_LOCK` forbids migrating the entire file; preview remains available.

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

Values are checked with the same schema used for reading, **before writing**: `max config set limit 0` is refused and the file stays unchanged. `serve`, `senderColors`, `catchUpMarksRead`, `searchCatchUp` and `mcpTools` are not accepted with `--bot`: bots have no server, sender colors or unread state, and legacy `mcpTools` applies only to personal accounts.

### Search languages

`searchStemmers.cyrillic` (`russian` or `none`) and `searchStemmers.latin` (`english`, `spanish`, both separated by commas - this is the default - or `none`) are stored not in the settings file, but in the general message archive: they are the same for all profiles and for both messengers. Therefore, `--defaults`, `--personal` and `--bot` are not accepted with them, and they cannot be changed under `MAX_PROFILE_LOCK`. `config unset` returns the built-in value. After the change, perform `max store reindex` - see [archive maintenance](./archive.md#обслуживание-архива).

## Typos are errors, not ignored settings

An unknown field is rejected by name with `configuration_error` (exit code `3`):

```json
{"error":{"code":"configuration_error","message":"/home/you/.config/max-cli/config.json is not a valid config:\n  profiles.default.limitt: unknown setting — the known ones are limit, timeoutMs, color, record, keepRunsForDays, readOnly, allow, permissions, sendsPerHour, senderColors, serve, mcpTools"}}
```

An incorrect type names the field and accepted value: `profiles.default.limit: has to be a
whole number, 1 or more, not "20"`.

This is intentional. Silently discarding an unknown field turns a typo into hours spent wondering why a setting has no effect.

A missing file is not an error: it means the program has not been configured.

## Environment variables

| Variable | What does |
|---|---|
| `MAX_PROFILE` | profile for the entire shell session; same as the first word |
| `MAX_PROFILE_LOCK` | locks the process on one profile: another profile - with the first word or through `MAX_PROFILE` - and `config set --defaults` are rejected. It is kept only where the agent cannot change the environment itself: in the settings of the MCP client or in the wrapper script. An agent with shell access will remove the variable itself |
| `MAX_TIMEOUT` | restriction on the entire command, for the entire shell session; same as `--timeout` |
| `MAX_REQUESTS_PER_MINUTE` | same as `requestsPerMinute`, and stronger than file |
| `MAX_TOKEN` | token directly, bypassing the keyring - for CI and one-time run |
| `MAX_BOT_TOKEN` | bot token for `max bot`, bypassing the keyring |
| `MAX_CONFIG_DIR` | where are `config.json` and, in the absence of a keyring, a file with a token |
| `MAX_STATE_DIR` | where are the status of the profiles and the catalog `runs/` |
| `MAX_CACHE_DIR` | only the old cache: `max doctor` looks for the remaining file there. For compatibility, it still changes the entry in the keyring; for a shared copy use `MESSAGING_STORE` |
| `MESSAGING_STORE` | file for shared local copy of chats, messages and transcripts |
| `NO_COLOR` | turns off the color, as in any other program |
| `MAX_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER` | don't ask npm about a new version; `CI` works the same way |
| `MAX_EMBEDDING_*`, `MAX_ANALYSIS_*`, `MAX_MODELS_*` | model settings ([below](#переменные-для-настроек-моделей)) |

An empty string counts as unset: `MAX_PROFILE=` is equivalent to not setting `MAX_PROFILE`.

**There is no variable for `--json` or for color, and this is intentional.** Forgotten in the shell, it would change the output of a command that did not ask for it - and finding this later is more difficult than typing a flag.

## Temporary separate configuration

Directory variables give you separate settings and login state, useful for experiments, a second account or tests. They do not change the shared message store used by `tg`: `MESSAGING_STORE` selects that separate file. Speech models remain shared.

```sh
export MAX_CONFIG_DIR=/tmp/max-try/config
export MAX_STATE_DIR=/tmp/max-try/state
export MESSAGING_STORE=/tmp/max-try/wirecat.db

max setup            # этот токен не виден обычной установке
max chats list
```

> ⚠ **The regular installation cannot see this isolated session.** A token saved with directory variables in one terminal is invisible in another without those variables, resulting in “no session”.

## Key types and scopes

The "profile" area includes `defaults`, `profiles.<имя>`, `personal.defaults`, `personal.profiles.<имя>`, `bot.defaults`, and `bot.profiles.<имя>` unless a string narrows it down. Unknown keys and values of the wrong type are rejected. The default values are shown [above](#файл).

| Key | Valid type or value | Scope |
|---|---|---|
| `defaultProfile` | string containing a profile name | file root |
| `limit`, `timeoutMs`, `keepRunsForDays`, `sendsPerHour` | integer ≥ 1 | profile |
| `requestsPerMinute` | integer ≥ 0 | profile |
| `color`, `record`, `readOnly` | boolean | profile |
| `senderColors`, `catchUpMarksRead`, `searchCatchUp`, `serve` | boolean | personal account |
| `permissions` | object of command paths and levels `deny`, `readonly`, `ask`, `allow` | profile |
| `allow` | array of allowed actions; old format | profile |
| `mcpTools` | array `contacts`, `polls`, `groups`, `profile`; old format | personal account |
| `readOtherBots` | boolean or array of profile names | only `bot` |
| `updateCheck`, `skillHint` | boolean | only `defaults` |
| `transcribeModel` | string id from `max models audio list` | only `defaults` |
| `embeddingProvider` | `local` or `openai` | profile |
| `embeddingModel`, `analysisModel` | non-empty string, no more than 200 characters | profile |
| `embeddingBaseUrl`, `analysisBaseUrl` | HTTP(S) URL without credentials, query and fragment | profile |
| `embeddingDims` | integer 1–65 536 | profile |
| `analysisProvider` | `agent`, `openai`, `anthropic` | profile |
| `models` | model assignment object; fields are described below | profile |
| `searchStemmers.cyrillic` | `russian`, `none` | general archive, via `config set` |
| `searchStemmers.latin` | `english`, `spanish`, both separated by commas, `none` | general archive, via `config set` |

### Models by task

`models.<назначение>` contains only `provider`, `model` and `baseUrl`. Task names use lowercase Latin letters, digits and hyphens, starting with a letter. `default` defines shared values; `analysis` and `replies` override them field by field. Other valid names can be saved in advance; this does not enable an unimplemented use case. With no provider or with `off`, external calls are disabled.

| Key | Allowed value | Default |
|---|---|---|
| `models.<назначение>.provider` | `off`, `openai`, `anthropic` | Unset; no external call |
| `models.<назначение>.model` | Nonempty string, at most 200 characters | Unset; an enabled provider requires an explicit ID |
| `models.<назначение>.baseUrl` | HTTP(S) URL without credentials, query or fragment | Provider endpoint |

For each field, precedence is `MAX_MODELS_<НАЗНАЧЕНИЕ>_PROVIDER`, `_MODEL` or `_BASE_URL`, then the most specific file entry for the task, then explicit legacy `analysis*` fields for `analysis`, then `models.default` variables and entries. Hyphens in a task name become `_` in its environment variable. Provider tokens are not part of this object.

Vector and analysis settings are independent and may vary across profiles. The address is HTTP/S without a built-in password, query and fragment. The external vector service also receives the question from the MCP search. Keys are specified via `models text key set openai|anthropic` and are not written to `config.json`. The usual `build` does not run external analysis: an explicit `--analyze` is needed. Providers and examples are in [external models manual](./external-models.md).

### Model configuration variables

Seven old fields support `MAX_EMBEDDING_PROVIDER`, `MAX_EMBEDDING_MODEL`, `MAX_EMBEDDING_BASE_URL`, `MAX_EMBEDDING_DIMS`, `MAX_ANALYSIS_PROVIDER`, `MAX_ANALYSIS_MODEL`, `MAX_ANALYSIS_BASE_URL`. They act before file values; command parameters are stronger than them. `MAX_MODELS_DEFAULT_PROVIDER`, `MAX_MODELS_DEFAULT_MODEL`, `MAX_MODELS_DEFAULT_BASE_URL` set the general fields of the new format; Instead of `DEFAULT`, you can specify a destination, for example `ANALYSIS`. An empty variable does not override the setting. `configuration_error` returns an incorrect value.

## Next steps

- [Security](./security.md): what `permissions`, list of recipients and `sendsPerHour` protect
- [Profiles and login](./sessions.md): how profiles are structured and where the token is located
- [All commands](./commands.md): each command and option and complete return code table
- [Problem solving](./troubleshooting.md): what to do when it doesn’t work
