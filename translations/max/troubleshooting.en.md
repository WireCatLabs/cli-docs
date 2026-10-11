---
title: "Troubleshooting"
---

<a id="проверка-со-входом-в-max" />

Use this page when `max` reports an error or behaves unexpectedly. Find the displayed message or exit code to understand the cause and recovery steps. Most problems need one command.

Terms used below:

- **Return code** - the number with which the command ends: `0` means the command completed; for batch reads check completeness, any other number indicates the type of failure. It is read by scripts and AI agents; The table below leads from each code to section.
- **`max doctor`** checks installation without connecting to MAX. Launch it first.
- **`--trace`** shows each request to MAX as it runs, without message text ([diagnostics](./diagnostics.md)).

In the output of `--json`, an error that ends the command is one line in stderr, `{"error":{"code":"…","message":"…"}}`, and the return code says the same as `code`. All codes are also in the [exit-code reference](./commands.md#коды-возврата).

## By exit code

| Code | Name | Usual meaning | Help |
|---|---|---|---|
| `1` | `generic_failure` | typo in the command name or failure in `max` itself | [wrong profile](#команда-отвечает-но-профиль-не-тот), [report](#как-сообщить-о-проблеме) |
| `2` | `validation_error` | a value or combination of options that `max` does not accept; name matches multiple chats | [values](#--limit-takes-a-whole-number-from-1-upwards-not-abc), [multiple chats](#matches-n-chats) |
| `3` | `configuration_error` | error in `config.json`, or a newer version recorded the local copy | [settings](#is-not-a-valid-config), [local copy](#the-message-store-was-written-by-a-newer-version-) |
| `4` | `authentication_error` | no login, session ended, or keyring is unavailable | [no session](#no-session-for-profile-default), [token not readable](#no-token-found-for-profile-default-although-it-has-logged-in-on-this-machine) |
| `5` | `permission_error` | `permissions` profile banned | [not allowed](#profile--does-not-let--write-или-profile--denies-) |
| `6` | `not_found` | there is no such chat, message or person; the local copy is still empty | [no chat](#no-chat-matches), [nothing saved](#nothing-recorded-for-profile--yet--run-the-command-once-without---offline) |
| `7` | `confirmation_required` | the chat is not in the list of recipients, or the action is waiting for confirmation, and there is no one to answer | [list of recipients](#chat--is-not-on-the-recipient-list-of-profile-), [asks](#-asks-before-it-acts) |
| `8` | `rate_limited` | profile limit per hour, or MAX asks to wait | [hour limit](#profile--has-sent-n-messages-in-the-hour-), [too many inputs](#max-refused-this-profiles-last-login-for-too-many-attempts) |
| `9` | `timeout` | MAX did not respond in time, or `--timeout` stopped command | [command hanging](#команда-висит) |
| `10` | `network_error` | MAX not available from here | [command hanging](#команда-висит) |
| `11` | `provider_error` | MAX refused the request | [report](#как-сообщить-о-проблеме) |
| `12` | `provider_unavailable` | failure on the MAX side | [report](#как-сообщить-о-проблеме) |
| `13` | `invalid_response` | response that `max` could not read | [unexpected answer](#max-answered-with-something-we-did-not-expect) |
| `14` | `outcome_unknown` | the connection was lost after sending, or the `max bot` gateway responded with 502, 503 or 504 to the change: the message could have been sent | [outcome unknown](#outcome_unknown-после-отправки) |
| `130` | `cancelled` | pressed Ctrl-C or answered “no” to a question | [Ctrl-C](#ctrl-c) |

## Start with `max doctor`

```sh
max doctor
```

`max doctor` connects nowhere. It reports runtime/version, settings, token presence and keyring entry (including `MAX_*_DIR` relocation), shared storage, run directory and any login pause. It works even when other commands fail. A profile without a session is a reported condition, not an error; exit code remains `0`. It never prints a token, only presence and source.

```sh
max doctor --online
```

`--online` also logs into MAX once, reads one chat and starts the MCP server. Doesn't send anything and doesn't mark anything as read. login counts towards the MAX limit on logins, so if there is an error it is not repeated ([as shown by `max doctor`](./diagnostics.md#проверить-установку-max-doctor)).

## Installation

### `max` is not found after installation

Installation succeeded, but the terminal cannot find `max`. Diagnose without that command:

```sh
npx @wirecat/max-cli doctor
```

`max on PATH` reports whether it was found; the note below explains the fix.

**Windows.** npm puts commands in `%APPDATA%\npm`. If absent from `PATH`, `max doctor` prints two PowerShell lines: one fixes the current window, the other future windows. Check manually:

```powershell
npm prefix -g
$env:Path -split ';'
```

The first command shows the directory; the second shows current `PATH`. If the directory is listed but `max` remains missing, reopen the terminal. A window opened before installing Node does not see the updated `PATH`.

**PowerShell says “running scripts is disabled on this system”.** npm creates `max.ps1` and `npx.ps1`; PowerShell normally restricts scripts. Use `max.cmd` and `npx.cmd`, which are unaffected (`npx.cmd @wirecat/max-cli doctor`), or permit scripts for your user account:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**Linux and macOS.** npm's command directory is `$(npm prefix -g)/bin`. `max doctor` prints `export PATH=…`; add it to `~/.zshrc` or `~/.bashrc`.

**On `PATH` there is another `max`.** If previously in `PATH` there is someone else’s program with the same name, `max doctor` will name its path. Call ours using the full path or put its directory earlier.

<a id="npx-leemourmax-cli-installs-the-wrong-version" />

### `npx @wirecat/max-cli` installs the wrong version

`npx` caches packages. An explicit version bypasses that cache:

```sh
npx @wirecat/max-cli@latest --version
```

## Login and profiles

### "no session for profile "default""

```json
{"error":{"code":"authentication_error","message":"no session for profile \"default\" — run `max setup` in a local terminal; agents: read `max skill show`"}}
```

Code `4`: no token for this profile. You may not have logged in, may have logged into **another profile**, or may have used different directory variables.

```sh
max setup                  # первый запуск
max personal chats list    # или назвать профиль, в который входили
```

Resume an interrupted first run with `max setup`. An expired token requires an explicit fresh login: `max session start qr`. Your agent reads `max skill show` before login.

⚠ A common cause when a token definitely exists is `MAX_CONFIG_DIR` set in one terminal but not another. Directory overrides also change keyring entries, so a session saved with them is invisible without them. Check `env | grep MAX_`.

### "profile "shop" is a bot"

```json
{"error":{"code":"authentication_error","message":"profile \"shop\" is a bot — its commands are `max shop bot …`; `max shop session start` would add a personal account to it"}}
```

A personal-account command was run on a bot profile. Bot commands begin with `bot`:

```sh
max shop bot chats list
max shop bot messages list -100
```

`max shop session start` is unnecessary unless you also want a personal account under that name. `max shop doctor` shows what the profile contains.

### "no token found for profile "default", although it has logged in on this machine"

Return code `4`. The profile on this computer has already been logged in, but the token is not readable. Almost always this is a password storage that `max` cannot reach: the command is launched from cron, via ssh, or from another environment without `XDG_RUNTIME_DIR`. **Do not log in again** - this will add another device to your account, and the next time from the same environment the token will not be read again. `max doctor` will show whether it sees the token; how to set up cron - in the section [run according to schedule](./recipes.md#как-запускать-по-расписанию).

### “MAX refused this profile's last login for too many attempts”

Code `8`: MAX rejected excessive login attempts. `max` remembers the rejection and does not log in until the stated time, including commands, `max session start` and the background server. Consecutive refusals increase the wait: 1 minute, 5 minutes, 30 minutes, 1 hour, 6 hours, then 1 day. Successful login resets it.

**Wait.** An early login is another attempt counted by MAX; repeated attempts can prolong restrictions. Reduce scheduled login frequency. `max doctor` shows the pause expiry.

How the request rate, waits and parallel commands work - in [constraints and expectations](./limits.md).

The background server (`max serve`, `max server start`) stops after any authentication rejection rather than retrying. It still reconnects after network failures.

### Command responds, but the profile is wrong

The first word is a profile unless it is a command. A misspelled command can therefore become a profile name:

```text
"chat" is not a command, so it was read as a profile name — and no command followed it.
```

The command is `chats`, plural. `max --help` lists all commands.

## Settings and option values

### "is not a valid config"

```json
{"error":{"code":"configuration_error","message":"…/config.json is not a valid config:\n  profiles.default.limitt: unknown setting — the known ones are limit, timeoutMs, color, record, keepRunsForDays, readOnly, allow, sendsPerHour, senderColors, serve, mcpTools"}}
```

Code `3`. In a settings file, a field that is not in the schema is almost always a typo, and the message states its path. Rejected on purpose: a silently ignored field is worth half a day of bewilderment. All fields are in the [configuration reference](./configuration-reference.md).

### "--limit takes a whole number from 1 upwards, not "abc""

Code `2`. The same applies to `--page`. Without validation, a nonnumeric value could silently produce an empty list.

### "--before-time takes an ISO 8601 time or 30m, 2h, 1d ago"

Code `2`: `--before-time` or `--after-time` could not parse its value. Use ISO 8601 or a relative time:

```sh
max messages list 0 --before-time 2026-09-20T01:00:00Z
max messages list 0 --before-time 2h
```

For a message ID, use `--before-id`: the time is encoded in the ID, without needing a previous chat read.

### "--at-time takes a time like 2026-09-25T09:00 or a delay like 30m, 2h, 1d"

Code `2`: `--at-time` accepts local time or a delay in minutes, hours or days, not seconds. The minimum is one minute from now; the maximum is one year.

### "--timeout takes a duration with a unit — 30s, 2m or 500ms"

Code `2`: `--timeout` and `MAX_TIMEOUT` accept `ms`, `s` or `m`. Hours are unsupported; use `120m` for two hours.

### “--all and --page ask for different things; use one or the other"

Code `2`: both options were supplied. The command refuses rather than choosing one and returning misleading output.

## Chat search

### "matches N chats"

```text
"Иван" matches 2 chats — name one by its id:
  123  Иван Петров
  456  Иван и друзья
```

Code `2`: the name fragment matched multiple chats. The command refuses to guess because a wrong send cannot be undone. Give a more specific name or use an ID from the list.

### "no chat matches"

Code `6`: no matching chat. Names come from login data; a direct chat uses the other person's name. If the contact is unknown, it may have no title, so use its ID from `max chats list`.

## Limits and rights

### "profile... has sent N messages in the hour..."

Code `8`: the profile's hourly `sendsPerHour` limit was reached; default 30. The error shows when sending is possible again. Raise it only if intended: `max config set sendsPerHour <n>`.

### "chat... is not on the recipient list of profile..."

Code `7`: the recipient list excludes this chat. If you want to permit it, add it yourself: `max <профиль> recipients add <чат>`. The agent must stop and ask ([send protections](./security.md#защита-от-отправки-не-туда)).

### “profile … does not let … write” or “profile … denies …”

Code `5`, before contacting MAX. Profile `permissions` blocked the action: `deny` blocks reading too; `readonly` blocks changes. The error identifies the key, its source and the command to allow it ([permissions](./configuration-reference.md#права-доступа)). The agent must ask you rather than change the setting itself.

### “…asks before it acts”

Code `7`. The command level is `ask`, but there is no one to answer: there is no terminal, or the command was launched from `--json` or `--jsonl`. The error names a flag that answers "yes": `--allow-dangerous` for deletion, `--yes` for any other change. Add it only if you really wanted it. The agent should stop and ask you.

### Saved limit

If the messenger specifies a wait time, `max` remembers it for the operation and chat. A retry before it expires immediately returns code `8` without contacting the messenger. MAX does not currently specify such times, so no hold is recorded for a personal MAX account and sends are not held. A sign-in cooldown in `max` protects against frequent sign-ins; `max doctor` shows its duration.

Remembered waits and send holds appear in `max server status` (`flood`). `max flood
clear` forgets them without changing anything in MAX. Run it only when MAX is no longer limiting the account. MCP has no such command: an agent must not clear a limit to retry.

## MAX and network

### “MAX answered with something we did not expect”

A stderr warning while the command **still works**. The response differs from the specification because the unofficial protocol can change without notice.

If fields become empty afterward, this may explain why. Report the full warning line: it includes the field path and expected type without content.

### Command hangs

The connection exists but no response arrives. After the timeout, it returns code `9`, `timeout`.

```sh
max chats list --trace
```

A `→` without its matching `←` means a request left without a response: investigate the network or MAX ([reading traces](./diagnostics.md#показать---trace)).

There are two separate limits:

```sh
max chats list --timeout 30s     # на команду целиком, включая вход
```

`timeoutMs` in [Configuration](./configuration.md) limits **one response**. A command makes several requests, so total time can be a multiple of it. `--timeout` limits the whole run, returning code `9` and closing the connection.

If there are no trace lines and the command still does not return, report a defect with `--trace` output. A command that prints a response but fails to exit is also a defect.

## After sending

### `outcome_unknown` after sending

Code `14`: **the message may have been sent**. The request left but no response arrived, so neither success nor failure is confirmed.

Retry **only with the same `--send-id`** shown in the error; MAX deduplicates it:

```sh
max messages send 0 "текст" --send-id 1789784741828
```

Never retry without `--send-id`: that creates a second message.

`max bot` has no `--send-id`. Check the chat before retrying.

### Ctrl-C

Code `130`: the command stops and closes its connection. During a send, the message may already have gone through. Check the chat (`max messages list <чат> --limit 3`) before retrying.

Declining a change confirmation also returns this code, without performing the action.

## Local copy and search

### “the message store was written by a newer version …”

Code `3`: another CLI, such as `tg`, or a newer `max`, upgraded the shared store beyond this version's support. Run `max upgrade`. No stored data is lost.

### “nothing recorded for profile … yet — run the command once without --offline”

Code `6`. `--offline` uses only the local copy, and this profile has not yet retrieved anything into it. First run a command with a connection, for example `max chats list`.

### `search messages` doesn't find anything

Search all chats reads the local archive; searching for words in one named chat also asks the MAX server. An empty response does not prove that there is no message. Check `coverage.next` in the answer `--json`: run the prompted command or ask for permission, then search again. `max store fetch --all --background` starts downloading all chats; `max store fetch <чат>` - one ([download history](./archive.md#скачать-историю), [prepare archive for search](./search.md#сначала-подготовьте-архив)).

### Empty chat list

First check whether you are reading only local storage:

```sh
max chats list --trace     # видны ли запросы к MAX
max contacts sync         # заново получить полный список контактов
```

If the first run listed chats but the next consecutive run is empty, that is a bug; report it. Subsequent logins may return only changed contacts; the remaining contacts come from the shared local store.

## Background server

### "max serve is already running for profile ..."

Code `2`: only one `serve` per profile. `max server status` shows the process and start time; `max server stop` stops one started through `server start` or a service.

### The server does not start in the background

The reason will be shown by `max server logs`. The usual reason for the service is the keyring: the service starts before the keyring is open, or without `XDG_RUNTIME_DIR`. If you transferred Node or `max`, run `max server install` again: the service starts the paths with which it was installed ([background server](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch)).

## Reporting a problem

```sh
max doctor report          # что попадёт в отчёт и чего в нём не будет
max doctor report create   # записать отчёт в файл и показать, как его отправить
```

`create` writes `max-report-<время>.json` in the current directory with permissions `0600`. It contains version, runtime/system, doctor results, the latest failed run and the latest 20 write actions. It excludes message text, chat/person names, phone numbers and tokens. Chat/message ids become consistent labels within the report but different labels in another report. Failed runs save automatically without `--record` ([failed runs](./diagnostics.md#неудачный-запуск-сохраняется-всегда)). Select another run with `--run <id>`; `max runs list` shows ids.

The command then prints a link for opening a new issue at [github.com/WireCatLabs/max-cli/issues](https://github.com/WireCatLabs/max-cli/issues), with the title and draft text already filled in. You need a GitHub account. Drag the report file into the text field, describe what you did and what happened, then click “Submit new issue”.

GitHub issues and attached files are public.

⚠ Never attach `~/.cache/max-cli/` or `~/.local/share/cli-messaging/`: they contain message text.

## Partial results and recovery actions

CLI and MCP errors include `actions`: what to check, which setting to change, how long to wait
or which item to skip. `retryable` never authorizes automatic write replay: for `outcome_unknown`,
verify whether the action happened first. API limits cannot be increased through local settings;
reduce or split the input instead.

An HTTP 429 while downloading an attachment stops new files in the batch; `Retry-After` becomes the wait action when supplied. HTTP 413 is a provider limit; raising a local budget cannot change it.

A failed independent file or history page returns partial results with exit code `0`,
`complete: false` and `batch` or `issue`. Completed downloads and earlier history pages remain
saved. If a provider wait is too long to finish, single-chat `store fetch` includes `issue.retryAfterMs`
and a `resume` boundary; multi-chat fetch exposes per-chat issues and downloads use checkpoints; do not repeat requests before the wait ends. Partial background jobs have
state `partial` and can be retried with `max store jobs retry`. Check completeness as well as the exit code.
