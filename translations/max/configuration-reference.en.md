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
max personal chats list --limit 5          # флаг: 5
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

Each setting shows its source: `flag`, `default` or `config file:` with its key, such as `config file: bot.profiles.test`. The profile source is `first word`, `MAX_PROFILE`, `MAX_PROFILE_LOCK` or `none named`: no profile was named, and `profile` is then `null`.

With `--json`, the response also includes `store_settings`: shared archive settings (`search_stemmers.*`, `task_agent_close*`) and their origin, `store` or `default`.

`--bot` shows the settings as `max <имя> bot …` will receive them: the bot has its own section and its own sending limit. If the file does not exist, loading settings first creates one with the usual default values. The existing file is not overwritten. If one of the `MAX_*_DIR` variables is set, command will say this in stderr: with them, the profile has a different entry in the keyring, and login made without them looks like “no session”.

⚠ **The profile list includes all profiles on this machine:** those named in configuration, logged in as personal accounts, or configured as bots. Each is identified as personal, bot or both.

⚠ **This is not a health check.** The command reads files: does not open the cache, does not touch the keyring and does not contact MAX. `max personal doctor` checks whether the session is alive ([first step in case of problems](./troubleshooting.md)).

Output contains no secrets: the configuration file has no fields in which to store them.

## Configuration file

`~/.config/max-cli/config.json` on Linux; Paths on other systems are in the [Settings Guide](./configuration.md#где-лежит-файл). The first command reading the settings creates it from `limit`, `keep_runs_for_days`, `sends_per_hour`, `update_check` and `skill_hint` into `defaults`. The file is created with the rights `0600`, and `max personal config set` writes it with the rights `0644`: there are no secrets in it.

Setting names are written in snake_case: `sends_per_hour`, `keep_runs_for_days`, `models.<назначение>.base_url`. A file with the old names (`sendsPerHour`, `keepRunsForDays`, `baseUrl`) is renamed by the first read, once, and only if the result passes validation. Profile names, paths in `permissions` and model purposes do not change. One setting under both names with different values is an error.

```json
{
  "defaults": { "keep_runs_for_days": 14 },
  "profiles": {
    "personal": { "limit": 50, "timeout_ms": 20000, "color": true },
    "work": { "limit": 10 }
  },
  "personal": {
    "defaults": { "sends_per_hour": 30 }
  },
  "bot": {
    "defaults": { "permissions": { "bot": "readonly", "bot.messages.send": "allow" } },
    "profiles": { "shop": { "sends_per_hour": 200 } }
  }
}
```

- `defaults` — all profiles, both personal accounts and bots.
- `profiles.<имя>` — one profile, regardless of role.
- `personal.defaults`, `personal.profiles.<имя>` — personal-account commands only.
- `bot.defaults`, `bot.profiles.<имя>` — `max <имя> bot …` commands only.

| Field | Purpose | Override for one run | Default |
| --- | --- | --- | --- |
| `limit` | Rows shown without `--limit` | `--limit` | `20` |
| `timeout_ms` | Milliseconds to wait for **one request** | None (`--timeout` is different; see below) | Transport-dependent |
| `color` | Terminal colours; otherwise based on terminal detection | None; without the field, `NO_COLOR` disables colour | Terminal-dependent |
| `sender_colors` | Separate author colours in `max personal messages`; `вы` is always blue. Requires `color`. Personal accounts only | None | `false` |
| `search_catch_up` | After `messages sync` or gap repair, prepare this chat's graph and installed local vectors within limits; no automatic downloads or remote calls. Personal accounts only | `--catch-up`, `--no-catch-up` | `false` |
| `record` | Save every run as with `--record` ([diagnostics](./diagnostics.md)) | `--record`, `--no-record` | `false` |
| `keep_runs_for_days` | Run-record retention in days | None | `30` |
| `permissions` | `deny`, `readonly`, `ask`, `allow` by resource/command; more specific keys win ([below](#права-доступа)) | None; `--yes` and `--allow-dangerous` answer `ask`, never override `deny` | `allow` except deletion, ending other sessions and some irreversible actions use `ask`; auto-reply `replies.send` uses `deny` |
| `sends_per_hour` | Hourly sends including forwards, edits, notifying pins, deletions, member additions and accepted join requests; excess returns code `8`. Bot limits must be set in `bot` ([send protection](./security.md#защита-от-отправки-не-туда)) | None | `30`; no default bot limit |
| `requests_per_minute` | Shared profile request rate after the initial 10-request burst; `0` disables pacing ([limits](./limits.md)) | `MAX_REQUESTS_PER_MINUTE` | `20` |
| `serve` | Start `max personal serve` when needed and absent. Disabled with `MAX_TOKEN`. Personal accounts only | `--serve`, `--no-serve` | `true` |
| `transcribe_model` | Speech recognition for `max personal messages transcribe`; **only in `defaults`** | `--model` with `messages transcribe` or `--transcribe` | `gigaam-v3` |
| `read_other_bots` | Permit requested `--all-bots`/`--bots` reads: `false`, `true` for all, or bot-profile names. **Only in `bot`** ([bots](./bot.md)) | None; flags request access, the setting allows it | `false` |
| `update_check` | Check npm and show update notices once daily. **Only in `defaults`**: version is shared across profiles | Disabled by `MAX_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER`, `CI` | `true` |
| `skill_hint` | Daily stderr notice for a missing/outdated `max` skill with `max skill install` guidance. Detects agents through `AI_AGENT` or `CLAUDECODE`. **Only in `defaults`** | None | `true` |
| `allow` | Legacy setting, read for compatibility; use `permissions` instead | None | Cannot be changed when `permissions` is set |
| `embedding_provider` | Local recognition (`local`) or `openai` | `--provider` | `local` |
| `embedding_model` | Embedding model id | `--model` | Provider-dependent |
| `embedding_base_url` | Vector API URL | `--base-url` | Provider-dependent |
| `embedding_dims` | Vector size, integer 1–65,536 | `--dims` | Model-dependent |
| `analysis_provider` | `agent`, `openai` or `anthropic` | `build --provider` | `agent` |
| `analysis_model` | Analysis model id | `build --model` | Unset; explicitly required for `--analyze` |
| `analysis_base_url` | Analysis API URL | `build --base-url` | Provider-dependent |
| `models` | External AI configuration by purpose ([below](#модели-по-назначению)) | `MAX_MODELS_*` variables | Unset |
| `search_stemmers.cyrillic`, `search_stemmers.latin` | Word-stem languages for the shared archive ([below](#языки-поиска)) | None | `russian`, `english,spanish` |
| `task_first_pass_per_chat` | How many tasks the rules may open in each chat from history on an account's first sync; a whole number from 0 to 1000. Later only new messages are read, and `tasks scan <чат>` builds tasks from history when you ask. Shared across the archive | — | `0` |
| `task_agent_close`, `task_agent_close_min` | Whether an agent closes a task and the confidence from `--certainty`; below the threshold it stays open with a suggested close ([tasks](./groups.md#что-ждёт-вашего-ответа)). Shared across the archive | — | `on`, `0.8` |

⚠ **`timeout_ms` and `--timeout` are different things, and it’s expensive to confuse them.** `timeout_ms` is how long to wait **one answer** from MAX. `--timeout` - how much is allocated to **command entirely**. One read is a connection, INIT, LOGIN, parsing the chat name and the request itself, so the operating time is a multiple of `timeout_ms` and is never equal to it.

Their formats deliberately differ: `timeout_ms` is a number of milliseconds in the file; `--timeout` is a command-line duration with a unit (`30s`, `2m`, `500ms`). A unit is required: `--timeout 30` is rejected because confusing seconds with the nearby milliseconds field could cause a thirtyfold error either way.

There is no file setting for `--timeout`: a command budget belongs to a specific run, rather than a lasting preference.

**`--page` and `--all` deliberately have no file settings.** A saved page number is useful once, then disrupts later runs. The same applies to `--order` for `max personal contacts list`: `contactOrder` would duplicate the same option. `--limit` has a setting because how much to show is a lasting preference.

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

**The key is the command path**: `messages`, `messages.delete`, `messages.send`, `reactions`, `chats.members`, `contacts`, `account.sessions.end`. It starts with a resource - `messages`, `reactions`, `polls`, `topics`, `chats`, `contacts`, `account`, `bot`, `conversations`, `tags`, `mentions`, `search`, `searches`, `tasks`, `replies`, `attachments`, `stats`, `store` or `metadata`. `calls` and `stickers` are read-only and have no permission key: `config set` answers with code 2. The bot's keys start with `bot`, for example `bot.messages.send`. `config set` rejects the unknown command key, including inside the entire `permissions` object, with code 2. `config unset` allows you to delete the old unknown key. Reading an existing file with such a key warns in stderr and continues to work.

**A more specific key overrides its resource.** The example allows reading and deleting messages without confirmation, while denying other message writes. It does not restrict contacts, chats, reactions or other resources. `config show` displays effective permissions and their sources.

Permissions from file sections combine, but **the nearest section takes precedence before key specificity**. A profile key overrides that key and all its descendants in `personal.defaults`, `bot.defaults` and `defaults`. Here `agent` cannot delete: its `messages` overrides inherited `messages.delete` from `defaults`.

```json
{
  "defaults": { "permissions": { "messages.delete": "allow" } },
  "profiles": { "agent": { "permissions": { "messages": "readonly" } } }
}
```

This works both ways: `messages: allow` on a profile also overrides `messages.delete: deny` from `defaults`, and then deletion asks again, as by default. Legacy `allow` applies in the section where it is written.

**By default, everything is allowed except for a few changes that are difficult to undo.** Asking: `messages.delete`, `bot.messages.delete`, `chats.delete`, `chats.clear`, `topics.enable`, `topics.delete`, and `account.sessions.end`. Automatic replies are not sent until you allow: `replies.send` - `deny`.

```sh
max personal config set permissions.messages.delete allow     # удалять без вопроса
max personal config set permissions.messages.send ask         # спрашивать перед каждой отправкой
max personal config unset permissions.messages.delete         # вернуть значение по умолчанию
```

### Question before change

At level `ask` a question appears in the terminal with the default answer being “no”. The flag gives the answer for you: `--allow-dangerous` - for irreversible deletion (of messages, chat, its history or topic), `--yes` - for any other change. In JSON mode there is no question: one of these flags is needed.

### Via MCP

MCP has no confirmation forms: `ask` permits the requested write; `deny` and `readonly` still block it. `--permission ключ=уровень` temporarily tightens permissions for this process but never loosens them. In the CLI, `ask` still needs an answer or explicit confirmation flag. See [MCP](./mcp.md).

`mcp.authority` controls changes to settings, rules, recipients and other conditions for future runs; its default is `deny`. The owner must choose `allow` or `ask` to offer these commands to an agent. Raw bot operations separately require explicit `bot.api: allow` or `ask`; a broader `bot: allow` does not enable them. The agent cannot change these keys or replace the entire `permissions` object; other individual keys can be changed when `mcp.authority` permits it.

Archive maintenance, server control, model downloads and report creation have their own keys, for example `store.backup`, `server.start`, `models.audio.download`, `doctor.report.create`. Their default level is `ask`.

Choosing read-only access at first run limits every profile of every WireCat tool, including MCP. A more specific profile `allow` cannot relax that limit. Change the answer through `max setup` in the terminal.

### Old `allow` setting

The list in `allow` (`send`, `forward`, `reaction`, `edit`, `pin`, `read`, `delete`, `groups`, `contacts`, `profile`, `folders`, `sessions`) is read as `allow` for these actions and `readonly` for the rest; deletion still asks. The key in `permissions` of the same section is more important. When the file has `permissions`, `config set allow` is refused and names the new setting.

## Changing settings without opening the file

```sh
max personal config set limit 50        # профилю personal
max work config set record true         # профилю work
max config set keep_runs_for_days 7 --defaults   # всем профилям сразу
max work config unset limit             # убрать; снова решает defaults или встроенное
max agent config set permissions.messages readonly  # чтение сообщений без записи
max shop config set --bot sends_per_hour 200    # только боту shop
max config set --personal --defaults limit 30 # всем личным аккаунтам
max config unset default_profile         # убрать старую настройку: профиль больше не подразумевается
```

Values are checked with the same schema used for reading, **before writing**: `max personal config set limit 0` is refused and the file stays unchanged. `serve`, `sender_colors` and `search_catch_up` are not accepted with `--bot`: bots have no server, sender colors or unread state.

### Search languages

`search_stemmers.cyrillic` (`russian` or `none`) and `search_stemmers.latin` (`english`, `spanish`, both separated by commas - this is the default - or `none`) are stored not in the settings file, but in the general message archive: they are the same for all profiles and for both messengers. Therefore, `--defaults`, `--personal` and `--bot` are not accepted with them, and they cannot be changed under `MAX_PROFILE_LOCK`. `config unset` returns the built-in value. After the change, perform `max personal store rebuild` - see [archive maintenance](./archive.md#обслуживание-архива).

## Typos are errors, not ignored settings

An unknown field is rejected by name with `configuration_error` (exit code `3`):

```json
{"error":{"code":"configuration_error","reason":"config.invalid","message":"/home/you/.config/max-cli/config.json: profiles.default.limitt is an unknown setting","retry":{"safe":false}}}
```

An incorrect type names the field without repeating its value, which could contain a token: `profiles.default.limit has the wrong type`. If several fields are invalid, the error names the first and counts the rest: `(and 2 more problems)`.

This is intentional. Silently discarding an unknown field turns a typo into hours spent wondering why a setting has no effect.

A missing file is not an error: it means the program has not been configured.

## Environment variables

| Variable | What does |
|---|---|
| `MAX_PROFILE` | profile for the entire shell session; same as the first word |
| `MAX_PROFILE_LOCK` | locks the process on one profile: another profile - with the first word or through `MAX_PROFILE` - and `config set --defaults` are rejected. It is kept only where the agent cannot change the environment itself: in the settings of the MCP client or in the wrapper script. An agent with shell access will remove the variable itself |
| `MAX_TIMEOUT` | restriction on the entire command, for the entire shell session; same as `--timeout` |
| `MAX_REQUESTS_PER_MINUTE` | same as `requests_per_minute`, and stronger than file |
| `MAX_TOKEN` | token directly, bypassing the keyring - for CI and one-time run |
| `MAX_BOT_TOKEN` | bot token for `max sales bot`, bypassing the keyring |
| `MAX_CONFIG_DIR` | where are `config.json` and, in the absence of a keyring, a file with a token |
| `MAX_STATE_DIR` | where are the status of the profiles and the catalog `runs/` |
| `MAX_CACHE_DIR` | only the old cache: `max personal doctor` looks for the remaining file there. For compatibility, it still changes the entry in the keyring; for a shared copy use `MESSAGING_STORE` |
| `MESSAGING_STORE` | file for shared local copy of chats, messages and transcripts |
| `WIRECAT_STATE_DIR` | the WireCat folder shared by all CLIs: the local archive and speech models |
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

max personal setup            # этот токен не виден обычной установке
max personal chats list
```

> ⚠ **The regular installation cannot see this isolated session.** A token saved with directory variables in one terminal is invisible in another without those variables, resulting in “no session”.

## Key types and scopes

The "profile" area includes `defaults`, `profiles.<имя>`, `personal.defaults`, `personal.profiles.<имя>`, `bot.defaults`, and `bot.profiles.<имя>` unless a string narrows it down. Unknown keys and values of the wrong type are rejected. The default values are shown [above](#файл).

| Key | Valid type or value | Scope |
|---|---|---|
| `default_profile` | not read: a command without a profile name stops — `max config unset default_profile` | file root |
| `limit`, `timeout_ms`, `keep_runs_for_days`, `sends_per_hour` | integer ≥ 1 | profile |
| `requests_per_minute` | integer ≥ 0 | profile |
| `color`, `record` | boolean | profile |
| `sender_colors`, `search_catch_up`, `serve` | boolean | personal account |
| `permissions` | object of command paths and levels `deny`, `readonly`, `ask`, `allow` | profile |
| `allow` | array of allowed actions; old format | profile |
| `read_other_bots` | boolean or array of profile names | only `bot` |
| `update_check`, `skill_hint` | boolean | only `defaults` |
| `transcribe_model` | string id from `max personal models list kind:audio` | only `defaults` |
| `embedding_provider` | `local` or `openai` | profile |
| `embedding_model`, `analysis_model` | non-empty string, no more than 200 characters | profile |
| `embedding_base_url`, `analysis_base_url` | HTTP(S) URL without credentials, query and fragment | profile |
| `embedding_dims` | integer 1–65 536 | profile |
| `analysis_provider` | `agent`, `openai`, `anthropic` | profile |
| `models` | model assignment object; fields are described below | profile |
| `search_stemmers.cyrillic` | `russian`, `none` | general archive, via `config set` |
| `search_stemmers.latin` | `english`, `spanish`, both separated by commas, `none` | general archive, via `config set` |
| `task_agent_close` | `on`, `off` | shared archive, through `config set` |
| `task_agent_close_min` | a number from 0 to 1 | shared archive, through `config set` |
| `task_first_pass_per_chat` | a whole number from 0 to 1000 | shared archive, through `config set` |

### Models by task

`models.<назначение>` contains only `provider`, `model` and `base_url`. Task names use lowercase Latin letters, digits and hyphens, starting with a letter. `default` defines shared values; `analysis` and `replies` override them field by field. Other valid names can be saved in advance; this does not enable an unimplemented use case. With no provider or with `off`, external calls are disabled.

| Key | Allowed value | Default |
|---|---|---|
| `models.<назначение>.provider` | `off`, `openai`, `anthropic` | Unset; no external call |
| `models.<назначение>.model` | Nonempty string, at most 200 characters | Unset; an enabled provider requires an explicit ID |
| `models.<назначение>.base_url` | HTTP(S) URL without credentials, query or fragment | Provider endpoint |

For each field, precedence is `MAX_MODELS_<НАЗНАЧЕНИЕ>_PROVIDER`, `_MODEL` or `_BASE_URL`, then the most specific file entry for the task, then explicit legacy `analysis*` fields for `analysis`, then `models.default` variables and entries. Hyphens in a task name become `_` in its environment variable. Provider tokens are not part of this object.

Vector and analysis settings are independent and may vary across profiles. The address is HTTP/S without a built-in password, query and fragment. The external vector service also receives the question from the MCP search. Keys are specified via `models keys set openai|anthropic` and are not written to `config.json`. The usual `build` does not run external analysis: an explicit `--analyze` is needed. Providers and examples are in [external models manual](./external-models.md).

### Model configuration variables

Seven old fields support `MAX_EMBEDDING_PROVIDER`, `MAX_EMBEDDING_MODEL`, `MAX_EMBEDDING_BASE_URL`, `MAX_EMBEDDING_DIMS`, `MAX_ANALYSIS_PROVIDER`, `MAX_ANALYSIS_MODEL`, `MAX_ANALYSIS_BASE_URL`. They act before file values; command parameters are stronger than them. `MAX_MODELS_DEFAULT_PROVIDER`, `MAX_MODELS_DEFAULT_MODEL`, `MAX_MODELS_DEFAULT_BASE_URL` set the general fields of the new format; Instead of `DEFAULT`, you can specify a destination, for example `ANALYSIS`. An empty variable does not override the setting. `configuration_error` returns an incorrect value.

## Next steps

- [Security](./security.md): what `permissions`, list of recipients and `sends_per_hour` protect
- [Profiles and login](./sessions.md): how profiles are structured and where the token is located
- [All commands](./commands.md): each command and option and complete return code table
- [Problem solving](./troubleshooting.md): what to do when it doesn’t work
