---
title: "Troubleshooting"
---

Find your symptom below. Each case explains what you see and what to do.

If it is not listed, start with `--trace`: it shows whether requests reached MAX and how MAX responded, without exposing content ([Diagnostics](./diagnostics.md)).

## By exit code

| Code | Name | Usual meaning |
|---|---|---|
| `1` | `generic_failure` | Misspelled command or a failure inside `max` |
| `2` | `validation_error` | Invalid value or option combination; a name matches several chats |
| `3` | `configuration_error` | Invalid `config.json`, or local storage was upgraded by a newer version |
| `4` | `authentication_error` | Not logged in, session ended, or keyring inaccessible |
| `5` | `permission_error` | Read-only profile or action absent from `allow` |
| `6` | `not_found` | Chat, message or person absent; local storage may be empty |
| `7` | `confirmation_required` | Chat absent from recipients, or confirmation required without someone to answer |
| `8` | `rate_limited` | Profile's hourly limit, or MAX requested a wait |
| `9` | `timeout` | MAX did not respond in time, or `--timeout` stopped the command |
| `10` | `network_error` | MAX is unreachable from here |
| `11` | `provider_error` | MAX rejected the request |
| `12` | `provider_unavailable` | Failure on MAX's side |
| `13` | `invalid_response` | Response `max` could not parse |
| `14` | `outcome_unknown` | Disconnection after sending, or a bot write received gateway status 502, 503 or 504; it may have succeeded |
| `130` | `cancelled` | Ctrl-C or declining confirmation |

## Start with `max doctor`

```sh
max doctor
```

In `--json`, `store` shows the shared store path, schema, chat count and message count. The check neither creates nor upgrades storage. `legacyCache` only reports whether an old cache file exists; if so, `doctor` gives its path for manual deletion.

It reports prerequisites **without connecting to MAX**, unless `--online` is set: token presence and source; keyring entry and directory overrides; login count and latest login; every local profile, personal, bot or both; shared store schema and counts of saved chats and messages; run directory; and the MAX web-client version being emulated, with the date it was checked. If that date is over 60 days old, it warns that MAX may stop accepting the old version; updating `max` may help.

It **answers even when everything else is broken**. A profile without a session appears as a result, not an error; exit code remains `0`.

Tokens are never printed, only their presence and source.

For a bot profile, `max <имя> doctor` reports its token source, count of seen chats and profile file locations: state, cache, runs, bot files, send log and shared message store.

It also shows the runtime (Node or Bun and its path), installation package manager, which `max` a new terminal will find, whether keyring and SQLite modules load, and whether a speech model is downloaded. If the command directory is absent from `PATH`, `max doctor` prints exact fixes: PowerShell commands on Windows or an `export` line on Linux and macOS.

### Online health check

```sh
max doctor --online
```

It performs one login, reads one chat from the list, then launches MCP as a client would and requests its tool list. It sends nothing and marks nothing read. Login counts toward MAX's login limits, so errors are not retried. A failed stage returns a non-`0` code.

If the profile has a bot token, `--online` also checks its owner through the Bot API and prints the bot's name and ID. Without a personal token, no personal-account login occurs.

## `max` not found after installation

Installation succeeded, but the terminal cannot find `max`. Diagnose without that command:

```sh
npx @leemour/max-cli doctor
```

`max on PATH` reports whether it was found; the note below explains the fix.

**Windows.** npm puts commands in `%APPDATA%\npm`. If absent from `PATH`, `max doctor` prints two PowerShell lines: one fixes the current window, the other future windows. Check manually:

```powershell
npm prefix -g
$env:Path -split ';'
```

The first command shows the directory; the second shows current `PATH`. If the directory is listed but `max` remains missing, reopen the terminal. A window opened before installing Node does not see the updated `PATH`.

**PowerShell says “running scripts is disabled on this system”.** npm creates `max.ps1` and `npx.ps1`; PowerShell normally restricts scripts. Use `max.cmd` and `npx.cmd`, which are unaffected (`npx.cmd @leemour/max-cli doctor`), or permit scripts for your user account:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**Linux and macOS.** npm's command directory is `$(npm prefix -g)/bin`. `max doctor` prints `export PATH=…`; add it to `~/.zshrc` or `~/.bashrc`.

**Another `max` is earlier on `PATH`.** `max doctor` shows its path. Use the full path to this tool, or move its directory earlier.

## “no session for profile "default"”

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

## “profile "shop" is a bot”

```json
{"error":{"code":"authentication_error","message":"profile \"shop\" is a bot — its commands are `max shop bot …`; `max shop session start` would add a personal account to it"}}
```

A personal-account command was run on a bot profile. Bot commands begin with `bot`:

```sh
max shop bot chats list
max shop bot messages list -100
```

`max shop session start` is unnecessary unless you also want a personal account under that name. `max shop doctor` shows what the profile contains.

## “no token found for profile "default", although it has logged in on this machine”

Code `4`: this profile has logged in here, but the token cannot be read. Usually the password store is unreachable because the command runs from cron, SSH or another environment without `XDG_RUNTIME_DIR`. **Do not log in again:** this adds another device without fixing the next run's environment. `max doctor` reports token visibility; see [Scheduled commands](./recipes.md) for cron setup.

## “MAX refused this profile's last login for too many attempts”

Code `8`: MAX rejected excessive login attempts. `max` remembers the rejection and does not log in until the stated time, including commands, `max session start` and the background server. Consecutive refusals increase the wait: 1 minute, 5 minutes, 30 minutes, 1 hour, 6 hours, then 1 day. Successful login resets it.

**Wait.** An early login is another attempt counted by MAX; repeated attempts can prolong restrictions. Reduce scheduled login frequency. `max doctor` shows the pause expiry.

The background server (`max serve`, `max server start`) stops after any authentication rejection rather than retrying. It still reconnects after network failures.

## The command works, but uses the wrong profile

The first word is a profile unless it is a command. A misspelled command can therefore become a profile name:

```text
"chat" is not a command, so it was read as a profile name — and no command followed it.
```

The command is `chats`, plural. `max --help` lists all commands.

## “is not a valid config”

```json
{"error":{"code":"configuration_error","message":"…/config.json is not a valid config:\n  profiles.default.limitt: unknown setting — the known ones are limit, timeoutMs, color, record, keepRunsForDays, readOnly, allow, sendsPerHour, senderColors, serve, mcpTools"}}
```

Code `3`: configuration contains a field outside the schema, usually a typo. The error gives its path. Unknown fields are rejected rather than silently ignored. See [Configuration](./configuration.md).

## “--limit takes a whole number from 1 upwards, not "abc"”

Code `2`. The same applies to `--page`. Without validation, a nonnumeric value could silently produce an empty list.

## “--all and --page ask for different things; use one or the other”

Code `2`: both options were supplied. The command refuses rather than choosing one and returning misleading output.

## “--before-time takes an ISO 8601 time or 30m, 2h, 1d ago”

Code `2`: `--before-time` or `--after-time` could not parse its value. Use ISO 8601 or a relative time:

```sh
max messages list 0 --before-time 2026-09-20T01:00:00Z
max messages list 0 --before-time 2h
```

For a message ID, use `--before-id`: the time is encoded in the ID, without needing a previous chat read.

## “--at-time takes a time like 2026-09-25T09:00 or a delay like 30m, 2h, 1d”

Code `2`: `--at-time` accepts local time or a delay in minutes, hours or days, not seconds. The minimum is one minute from now; the maximum is one year.

## “--timeout takes a duration with a unit — 30s, 2m or 500ms”

Code `2`: `--timeout` and `MAX_TIMEOUT` accept `ms`, `s` or `m`. Hours are unsupported; use `120m` for two hours.

## A command hangs

The connection exists but no response arrives. After the timeout, it returns code `9`, `timeout`.

```sh
max chats list --trace
```

A `→` line without its matching `←` means the request left without a response: the network or MAX is responsible.

There are two separate limits:

```sh
max chats list --timeout 30s     # на команду целиком, включая вход
```

`timeoutMs` in [Configuration](./configuration.md) limits **one response**. A command makes several requests, so total time can be a multiple of it. `--timeout` limits the whole run, returning code `9` and closing the connection.

If there are no trace lines and the command still does not return, report a defect with `--trace` output. A command that prints a response but fails to exit is also a defect.

## “matches N chats”

```text
"Иван" matches 2 chats — name one by its id:
  123  Иван Петров
  456  Иван и друзья
```

Code `2`: the name fragment matched multiple chats. The command refuses to guess because a wrong send cannot be undone. Give a more specific name or use an ID from the list.

## “no chat matches”

Code `6`: no matching chat. Names come from login data; a direct chat uses the other person's name. If the contact is unknown, it may have no title, so use its ID from `max chats list`.

## “profile … has sent N messages in the hour …”

Code `8`: the profile's hourly `sendsPerHour` limit was reached; default 30. The error shows when sending is possible again. Raise it only if intended: `max config set sendsPerHour <n>`.

## “chat … is not on the recipient list of profile …”

Code `7`: the enabled recipient list excludes this chat. If appropriate, add it yourself with `max <профиль> recipients add <чат>`. An agent must stop and ask you ([Security](./security.md)).

## `outcome_unknown` after sending

Code `14`: **the message may have been sent**. The request left but no response arrived, so neither success nor failure is confirmed.

Retry **only with the same `--send-id`** shown in the error; MAX deduplicates it:

```sh
max messages send 0 "текст" --send-id 1789784741828
```

Never retry without `--send-id`: that creates a second message.

`max bot` has no `--send-id`. Check the chat before retrying.

## “MAX answered with something we did not expect”

A stderr warning while the command **still works**. The response differs from the specification because the unofficial protocol can change without notice.

If fields become empty afterward, this may explain why. Report the full warning line: it includes the field path and expected type without content.

## Empty chat list

First check whether you are reading only local storage:

```sh
max chats list --trace     # видны ли запросы к MAX
max contacts sync         # заново получить полный список контактов
```

If the first run listed chats but the next consecutive run is empty, that is a bug; report it. Subsequent logins may return only changed contacts; the remaining contacts come from the shared local store.

## Ctrl-C

Code `130`: the command stops and closes its connection. During a send, the message may already have gone through. Check the chat (`max messages list <чат> --limit 3`) before retrying.

Declining a change confirmation also returns this code, without performing the action.

## “the message store was written by a newer version …”

Code `3`: another CLI, such as `tg`, or a newer `max`, upgraded the shared store beyond this version's support. Run `max upgrade`. No stored data is lost.

## “nothing recorded for profile … yet — run the command once without --offline”

Code `6`: `--offline` and `messages search` only read local data, and this profile has not saved any yet. Run an online command first, such as `max chats list`.

## `messages search` finds nothing

Search only reads data saved on this machine; it never queries MAX. An empty result means “not stored”, not “never said”. Read the chat (`max messages list <чат>`) or fetch history with `max store fetch <чат>`, then search again ([Local storage](./archive.md)).

## “max serve is already running for profile …”

Code `2`: only one `serve` per profile. `max server status` shows the process and start time; `max server stop` stops one started through `server start` or a service.

## Background server will not start

Check `max server logs`. A service often cannot access the keyring because it started before unlocking or lacks `XDG_RUNTIME_DIR`. If Node or `max` moved, run `max server install` again: the service uses the original installation paths ([Local storage and server](./archive.md)).

## `npx @leemour/max-cli` installs the wrong version

`npx` caches packages. An explicit version bypasses that cache:

```sh
npx @leemour/max-cli@latest --version
```

## Reporting a problem

```sh
max doctor report          # что попадёт в отчёт и чего в нём не будет
max doctor report create   # записать отчёт в файл и показать, как его отправить
```

`create` writes `max-report-<время>.json` in the current directory with permissions `0600`. It includes version, runtime and system, doctor information, the latest failed run and the last 20 write actions. It excludes message text, chat titles, names, phone numbers and tokens. Chat and message IDs are replaced with labels, consistent within one report but different in the next. Failed runs are saved automatically, even without `--record` ([Diagnostics](./diagnostics.md)). Use `--run <id>` for another run; find IDs with `max runs list`.

The command prints a link to a new [GitHub issue](https://github.com/leemour/max-cli/issues) with a prepared title and body. A GitHub account is required. Drag the report file into the issue body, describe your action and the result, then click “Submit new issue”.

Issues and attachments are public.

⚠ Never attach `~/.cache/max-cli/` or `~/.local/share/cli-messaging/`: they contain message text.

## Remembered rate limit

If a messenger specifies a wait time, `max` remembers it for the operation and chat. A retry before it expires immediately refuses with code `8`, without contacting the messenger. MAX does not yet report such a time, so nothing is remembered and sends are not held for a personal MAX account. A login pause protects against frequent logins; `max doctor` shows its duration.

Remembered waits and send holds appear in `max server status` (`flood`). `max flood
clear` forgets them without changing anything in MAX. Run it only when MAX is no longer limiting the account. MCP has no such command: an agent must not clear a limit to retry.
