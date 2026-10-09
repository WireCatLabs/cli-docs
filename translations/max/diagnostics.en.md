---
title: "Diagnostics: what a command did"
---

Each request produces an event, with two destinations available. `--trace` displays events without storing them; `--record` stores them without displaying them. By default, nothing is displayed, and only failed runs are saved (see “Failed runs are always saved”).

## Displaying events

```sh
max chats list --trace
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

All of this goes **to stderr**, so it works alongside `--json`:

```sh
max chats list --json --trace > chats.json    # данные в файл, диагностика на экран
```

In a terminal, output looks like the lines above. In a pipe, it is one JSON object per line, following the same rule as data output:

```sh
max chats list --json --trace 2>&1 >/dev/null | jq -c 'select(.event == "response")'
```

`--trace` overrides `--quiet`: an explicitly supplied flag always takes effect.

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

## Saving events

```sh
max chats list --record
max runs list                 # что делалось, новое сверху
max runs show <id>            # один запуск: чем кончился и куда ходил
max runs path <id>            # каталог, для jq и grep
```

A run directory:

```text
~/.local/share/max-cli/runs/2026-09-19/20260919T234428Z-chats-list-9df39e/
  run.json       что это было, когда, какой профиль, сколько длилось, чем кончилось
  events.jsonl   по объекту JSON на запрос, без единого управляющего символа
```

The directory has permissions `0700`; both files have `0600`. `run.json` is written **twice**: when the run starts, with status `running`, and at the end with the result. A directory containing events but no metadata would otherwise become a permanent special case for `max runs list`.

The outcome is saved **on every exit path**, including a command that fails before connecting:

```json
{ "runId": "…", "command": "chats list", "profile": "default", "status": "failed",
  "requests": 0, "errorCode": "authentication_error", "durationMs": 12 }
```

## What is never recorded

This is the central guarantee of diagnostics.

| Recorded | Never recorded |
|---|---|
| Operation, opcode, request number | Chat title |
| Chat ID, send ID (`send`), message ID | Person's name |
| Bytes sent and received | Message text |
| Response duration in milliseconds | Phone number |
| Counts of chats, contacts and messages returned | Token |
| Error code and a short MAX error key such as `login.token` | Error text returned by MAX |
| Warning code, such as `reactions_unread` | Warning text |
| On a crash: error type and code locations | Crash error text |
| Version, runtime (`node` or `bun`), operating system | Home-directory path |

**Not even truncated or hashed.** Events are built from explicitly named fields, not by filtering a copy of the request, so an unexpected field cannot enter the log. `session.login` contains a `token` field, but no logging code reads it.

IDs are deliberately included. A chat ID is an opaque number, useless without its associated session, and needed to diagnose an issue concerning a particular conversation.

MAX error text is excluded for the same reason: a server rejection can quote what we sent, including message content. Only a key containing lowercase Latin letters, digits, dots and hyphens, such as `proto.payload`, is recorded. Other values are omitted.

## Using the records

```sh
# сколько времени ушло на вход в последних запусках
for id in $(max runs list --json | jq -r '.items[].runId'); do
  jq -r 'select(.operation=="session.login" and .event=="response") | "\(.durationMs)ms"' \
    "$(max runs path "$id" --json | jq -r .path)/events.jsonl"
done

# какие запуски закончились плохо
max runs list --json | jq '.items[] | select(.status=="failed") | {runId, command, errorCode}'
```

`max runs show` displays the same information while hiding service fields repeated by Pino on every line; otherwise the table would reach beyond the screen before displaying durations. Use `max runs path` to access the full file, including service fields.

## Retention

**30 days.** Old data is removed only when a new record is written: a tool that writes nothing has no reason to access this directory. Change retention through `keepRunsForDays` in [Configuration](./configuration.md).

Whole days are removed by directory name, without opening files to decide what to delete.

## Failed runs are always saved

A command that ends with an error is saved even without `--record`, with `"keptBecauseFailed": true` in `run.json`. This applies to every command and error: wrong options, unknown commands, preflight checks and commands that do not contact MAX (`models`, `server`, `watch`, `upgrade`). The record contains only command words, such as `messages list`, without subsequent arguments. A successful run without `--record` leaves no diagnostic record; search queries are stored separately. This provides something to attach to a problem report. Search history contains query parameters, not the matching messages. `--no-record` or `"record": false` in settings disables this too.

## Recording every run

```json
{ "profiles": { "default": { "record": true } } }
```

Every run is then recorded, and `--no-record` disables recording for one invocation. The default is the reverse: successful runs are not recorded unless requested; failed runs are always saved without text so they can accompany an error report. Successful search parameters are stored separately from diagnostic runs; `--no-record` or `"record": false` disables both kinds of recording.

## Next steps

- [Security](./security.md) — everything stored on disk.
- [Troubleshooting](./troubleshooting.md) — using diagnostics when something fails.

## Reference for scripts

`max commands --json` lists commands, global options and exit codes without connecting to an account. Use `max commands search messages --json` for one command or `max commands messages --json` for a group; both retain global options and exit codes. Words after `commands` specify one path; inspect different groups in separate calls. `cli` is the tool name, `version` is the installed package version, and `contract` is the shared JSON contract version (`0`). It changes when response fields change incompatibly; updating a package does not itself change `contract`. Scripts can read individual fields instead of comparing the entire JSON to a saved string.

Search and counts save queries separately from runs; see query history and --no-record in [search](./search.md).
