---
title: "Diagnostics: what a command did"
---

<a id="показать" />
<a id="сохранить" />
<a id="что-можно-с-этим-делать" />
<a id="справочник-для-скриптов" />

Use this page when a command fails, hangs or takes too long and you want to know why. You will learn to inspect requests as they happen, save a run record, check installation and submit a problem report without message text.

Terms used below:

- **Run** — one invocation of `max`, from startup to exit.
- **Run record** — a directory describing one run: command, outcome and one line per MAX request. It never contains message text, people's names or chat names.
- **`max personal doctor`** checks installation: version, login, settings and local archive.
- **Problem report** — a JSON file combining `max personal doctor` results and a failed run, for a GitHub issue.

## What you can do

| Task | Command | Saved data |
| --- | --- | --- |
| Inspect requests as they happen | `max … --trace` | Nothing; stderr output only |
| Save one run | `max … --record` | Run record |
| Find a failed run later | `max personal runs list` | Failed runs are saved automatically |
| Save every run | `max personal config set record true` | Every run's record |
| Check installation | `max personal doctor`, `max personal doctor --online` | Nothing |
| Prepare a problem report | `max personal doctor reports create` | One file you choose to submit |

## Show: `--trace`

```sh
max personal chats list --trace
```

```text
→ session.init      op 6   seq 1  432 B
← session.init      op 6   seq 1  89ms  335 B  38 reg-country-code
→ session.login     op 19  seq 2  871 B
← session.login     op 19  seq 2  202ms  48.0 kB  25 chats  6 contacts
→ contacts.info     op 32  seq 3  154 B  3 contacts
← contacts.info     op 32  seq 3  91ms  6.5 kB  10 contacts
```

`→` is a request, `←` a response and `•` a response that did not go over the network. Each line then shows the operation, protocol opcode, request sequence number, named IDs, duration, frame size and counts of returned items.

Everything goes **to stderr**, keeping `--json` output intact:

```sh
max personal chats list --json --trace > chats.json    # данные в файл, диагностика на экран
```

A terminal displays the lines above. A pipe receives one JSON object per line, as with data:

```sh
max personal chats list --json --trace 2>&1 >/dev/null | jq -c 'select(.event == "response")'
```

`--trace` overrides `--quiet`: a flag you explicitly add always applies.

### Bot commands

For `max <имя> bot …`, each HTTP request to the Bot API gets a line with its operation, IDs from the URL (chat, message, person, comment), HTTP status, duration and response size.

```sh
max shop bot messages list -100 --trace
```

```text
→ getMyInfo        
← getMyInfo        200  143ms  211 B
→ getMessages      chat -100
← getMessages      200  chat -100  187ms  6.2 kB
```

A failure shows the error code and MAX's key, such as `404  not_found  not.found`, but never the response text. File uploads (`--file`, `uploads put`) have a separate pair of lines such as `upload.image`, `upload.video`, and so on, showing size, HTTP status and duration. Neither upload URLs nor filenames appear: the URL itself grants access.

## Save: `--record`

```sh
max personal chats list --record
max personal runs list                 # что делалось, новое сверху
max personal runs show <id>            # один запуск: чем кончился и куда ходил
max personal runs path <id>            # каталог, для jq и grep
```

A run directory:

```text
~/.local/share/max-cli/runs/2026-09-19/20260919T234428Z-chats-list-9df39e/
  run.json       что это было, когда, какой профиль, сколько длилось, чем кончилось
  events.jsonl   по объекту JSON на запрос, без единого управляющего символа
```

The directory has permissions `0700`; both files use `0600`. `run.json` is written **twice**: at startup with status `running`, then with the outcome. An events directory therefore always has a run description.

The outcome is saved **on every exit path**, including a command that fails before connecting:

```json
{ "run_id": "…", "command": "chats list", "profile": "personal", "status": "failed",
  "requests": 0, "error_code": "authentication_error", "duration_ms": 12 }
```

## Failed runs are always saved

A failed command saves its run even without `--record`, marking `"kept_because_failed": true` in `run.json`. This applies to any command and error: an invalid flag, unknown command, preflight failure or commands that do not contact MAX (`models`, `server`, `watch`, `upgrade`). Records contain only the command path, such as `messages list`, without subsequent arguments.

Fully successful runs without `--record` leave no record; partial runs are retained by default, while a failed run provides evidence for a problem report. `--no-record` or configuration `"record": false` disables even this automatic failure record.

Successful search and statistics requests keep separate history containing query parameters, not returned messages. See [saved searches and history](./search.md#сохранённые-поиски-и-история) for controls.

## Recording every run

```sh
max personal config set record true          # этот профиль
max personal chats list --no-record          # но не этот запуск
```

The same in the settings file:

```json
{ "profiles": { "personal": { "record": true } } }
```

This records every run. Fully successful runs are otherwise not recorded unless requested: a directory tracking whom you read and when would create an unwanted personal diary. `--no-record` or `"record": false` disables run records and search history.

## Retention

Records last **30 days**, or `keep_runs_for_days` in [configuration](./configuration.md). Old records are removed only when a new record is written. Entire days are removed by directory name, without opening their contents to decide.

## What is never recorded

| Recorded | Never recorded |
|---|---|
| operation, opcode, request number | chat name |
| chat ID, send number (`send`), message ID | person's name |
| how many bytes went and came | message text |
| how many milliseconds did the response take | phone number |
| how many chats, contacts, messages were returned | token |
| error code and short error key MAX of the form `login.token` | error text received from MAX |
| warning - code, for example `reactions_unread` | warning text |
| when it crashes - the type of error and lines of code where it happened | crash error text |
| version, environment (`node` or `bun`), system | home directory path |

**Not even truncated or hashed.** Events are built from explicitly named fields, not by filtering a copy of the request, so an unexpected field cannot enter the log. `session.login` contains a `token` field, but no logging code reads it.

Identifiers are recorded. A chat id is a number that is unusable without its associated session. It makes diagnostics useful because a real complaint concerns a specific chat.

MAX error text is excluded because a server error can quote submitted data, including a message. Only a key with lowercase Latin letters, digits, dots and hyphens, such as `proto.payload`, is recorded. Any other response text is omitted.

The same applies to reports assembled from runs.

## Check installation: `max personal doctor`

```sh
max personal doctor              # никуда не подключается
max personal doctor --online     # ещё и входит в MAX один раз; ничего не отправляет
```

Without `--online`, it reports **without connecting to MAX** the information commands depend on:

- Whether a token exists, its source, keyring entry and any environment-variable relocation. It never prints the token, only presence and source.
- Login count and last login; every local profile: personal account, bot or both.
- Shared storage: JSON `item.store` includes path, schema and saved chat/message counts. The check neither creates nor updates storage.
- Run-record directory.
- The MAX web-client version `max` presents and when it was inspected. After 60 days, `max personal doctor` warns that MAX might stop accepting it; updating `max` can help.
- Runtime (Node or Bun and location), package manager, which `max` a new terminal finds, whether keyring and SQLite load, and whether speech-recognition files are downloaded. If the command reference is missing from `PATH`, it prints exact commands to add it: PowerShell on Windows, an `export` line on Linux/macOS.
- Any login pause imposed after MAX rejects excessive logins.

For a bot profile, `max <имя> doctor` reports the bot token's source, observed chat count and profile file locations: state, cache, run records, bot files, send journal and shared message storage.

**`--online`** performs one login, reads one listed chat, then launches MCP as a client would and requests its tool list. It sends nothing and marks nothing read. Login counts toward MAX's login limit and is not retried after failure. A failed component returns a non-`0` exit code. With a bot token, it also asks the Bot API whose token it is and prints the bot name and id. Without a personal token, it skips personal-account login.

## Problem Report

```sh
max personal doctor reports create              # о последнем неудачном запуске
max personal doctor reports create --run <id>   # об этом запуске
```

If configuration cannot be read, first run `max doctor --json` to see the settings error. Creating a report file requires a write-permission check, so fix the invalid setting first.

The command writes a JSON file containing `max personal doctor` results and the run, then prints a link to a new [GitHub issue](https://github.com/WireCatLabs/max-cli/issues). Read the file before submitting. It has no message text; chat and message ids are replaced with labels. See [reporting a problem](./troubleshooting.md#как-сообщить-о-проблеме) for its remaining contents.

If there is no failed run, run the failing command again to save its error automatically.

## What to do with the recordings

Records are JSON, so `jq` can inspect them. `max personal runs list --json` returns `{ items, page: { limit, has_more } }`; `items` contains `run.json` records, newest first:

```sh
# какие запуски закончились плохо
max personal runs list --json | jq '.items[] | select(.status=="failed") | {run_id, command, error_code}'

# сколько времени ушло на вход в последних запусках
for id in $(max personal runs list --json | jq -r '.items[].run_id'); do
  jq -r 'select(.operation=="session.login" and .event=="response") | "\(.duration_ms)ms"' \
    "$(max personal runs path "$id" --json | jq -r .item.path)/events.jsonl"
done
```

`max personal runs show` displays the same events as a table without repeated bookkeeping fields, keeping durations on screen. The full file, including those fields, is in the directory printed by `max personal runs path`.

## Next steps

- [Errors and recovery](./troubleshooting.md)
- [What is saved on disk](./security.md)

## Search errors and partial runs

```sh
max personal search runs error_code:rate_limited --json
max personal search runs status:partial 'started_at>=2026-10-01' --json
```

`search runs` matches literal diagnostic text in metadata and safe events. Put `status:`, `error_code:`, `operation:`, `profile:` and `started_at:` comparisons or ranges in the query. `--limit` and `--page` choose the page. Each page allows up to 100 runs and
each run returns at most 100 matched events, with `events_truncated` for additional events.
A failed batch item or history page creates `status: "partial"` with failed IDs, stages and
codes; message contents and provider error payloads are not copied into that record. Partial
records are kept by default unless recording was explicitly disabled. Search does not record itself.

MCP `max_read` with `command: "search runs"` accepts these `arguments`: `query` (including conditions and time bounds), `limit` and `page`. It reads only the active profile's diagnostic runs, does not connect to MAX and does not open
raw background-job logs. The original partial result names the failed items and their error codes; diagnostic records
keep only safe identifiers and codes.
