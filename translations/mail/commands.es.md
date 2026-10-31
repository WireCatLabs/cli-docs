---
title: "Comandos de mail"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Todos los comandos, opciones y códigos de salida, generados a partir del propio programa. Para obtener la misma lista en
JSON, ejecuta `mail commands --json`. Las descripciones conservan el idioma de la ayuda.

**La primera palabra es el perfil**, un nombre que eliges tú: `mail personal config show`. `MAIL_PROFILE`
hace lo mismo para toda una sesión de la terminal. Nunca se da un perfil por supuesto: un comando que usa una cuenta
se detiene si no lo tiene y muestra los perfiles de este ordenador.

## Opciones para todos los comandos

| Option | What it does |
|---|---|
| `-V, --version` | output the version number. |
| `-v, --verbose` | more detail in what is shown: -v ids, -vv everything we know. Default: `0`. |
| `--json` | machine-readable output: one JSON value on stdout; --json=id,text keeps only those fields. |
| `--jsonl` | machine-readable output: one JSON object per line, for streaming and jq. |
| `--quiet` | diagnostics off; a failure is still said. |
| `--trace` | the connection's own log lines on stderr — never content. |
| `--debug` | on a failure, its whole record — cause and stack — in place of the short line. |
| `--timeout <duration>` | give up on the whole command after this — 30s, 2m, 500ms. |
| `--offline` | answer from what was recorded and never connect; fails if nothing was. |
| `--no-input` | never prompt or open interactive login; piped input remains available. |
| `--max-input-bytes <bytes>` | maximum buffered input bytes (default: 16777216). |
| `--max-output-bytes <bytes>` | maximum machine output bytes (default: 4194304; 0 disables). |
| `--brief` | found items as reference, title, time, author and excerpt only. |
| `--full` | found items with their whole text and every provider field. |
| `--dry-run` | preview parsed arguments and permissions before running the action. |
| `--yes` | go ahead without the question an ask level puts before a write. |
| `--record` | keep this run even where the config says record false; record_input false leaves the typed words out. |
| `--no-record` | do not keep this run, even if it fails. |

## `mail commands`

every command by section; --json prints its contract, one path per call

### `mail commands info`

one command contract, or all schemas, error reasons and explicit overrides

```sh
mail commands info [path]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | one command path; without one, export schemas, error reasons and explicit overrides. |

**Returns:** one command contract, or all schemas, error reasons and explicit overrides

**Example:** `mail commands info commands`

## `mail session`

keep this profile's app password in the OS keyring

### `mail session start`

sign this profile in. A new profile needs its mailbox: --address, or it is asked at a terminal; the server is found (built-in providers, the MX record, ISPDB, the domain's autoconfig; all providers: https://github.com/WireCatLabs/mail-cli/blob/main/docs/providers.md), the steps to prepare the mailbox are shown, the app password is asked (hidden) or read from MAIL_PASSWORD, checked against the server, and only then the profile and the keyring entry are saved. An existing profile only asks for the password again. Without a terminal nothing is asked: a missing --address or password is a validation error

**Changes something on this computer only.**

```sh
mail session start [options]
```

| Option | What it does |
|---|---|
| `--address <email>` | the full mail address of a new profile, also the login for most providers. |
| `--provider <provider>` | skip discovery and use a built-in provider: Yandex, Gmail, iCloud, Mail.ru, Fastmail, Outlook. |
| `--host <host>` | skip discovery and use this IMAP host. |
| `--port <port>` | IMAP port (default 993). |
| `--security <mode>` | tls or starttls (default tls). |
| `--login <login>` | the login name, when it is not the full address. |
| `--folder <folder>` | sync only this folder; repeat it for more. |

**Returns:** sign in; a new profile is created first

**Example:** `mail ya session start --address me@example.com`, `mail ya session start`, `mail me session start --address me@example.com --host imap.example.com --security tls`

### `mail session status`

show where this profile's app password comes from; the password is never printed

```sh
mail session status [options]
```

| Option | What it does |
|---|---|
| `--check` | log in to the server to prove the password still works. |

**Returns:** show where this profile's app password comes from; the password is never printed

**Example:** `mail ya session status`, `mail ya session status --check --json`

### `mail session end`

forget this profile's app password on this computer; synced mail stays

**Changes something on this computer only.**

```sh
mail session end
```

**Returns:** forget this profile's app password on this computer; synced mail stays

**Example:** `mail ya session end`

## `mail account`

the mailbox behind this profile

### `mail account check`

log in to the server and list what it supports (IDLE, CONDSTORE, MOVE, Gmail extensions)

```sh
mail account check
```

**Returns:** log in and list what the server supports

**Example:** `mail ya account check`, `mail ya account check --json`

## `mail folders`

the folders of this profile's mailbox

### `mail folders list`

the folders of the mailbox with their role (inbox, sent, trash, ...) and message counts

```sh
mail folders list
```

**Returns:** the folders with their role and message counts

**Example:** `mail ya folders list`, `mail ya folders list --json`

## `mail sync`

read mail from the server into the shared store; mail already stored is skipped

**Changes something on this computer only.**

```sh
mail sync [options]
```

| Option | What it does |
|---|---|
| `--since-time <time>` | only mail received since this ISO date or timestamp (default: 30 days). |
| `--limit <n>` | save at most this many new emails in this run, newest first. |
| `--max-pages <pages>` | at most this many requests to the mail server in this run; as many as fit the deadline if not given. |
| `--folder <folder>` | a folder to read; repeat it for more (default: the profile's folders, else INBOX and Sent). |
| `--rescan` | list every message in the window again, not only those an earlier run left. |

**Returns:** read mail from the server into the shared store; mail already stored is skipped

**Example:** `mail ya sync`, `mail ya sync --since-time 2026-10-01T00:00:00Z --limit 200`, `mail ya sync --folder INBOX`

## `mail status`

how many messages of the synced window are read and how many are left, per folder; it asks no server, so it answers while a sync runs

```sh
mail status
```

**Returns:** how far the sync is, from what the runs saved

**Example:** `mail ya status`, `mail ya status --json`

## `mail doctor`

check this installation: version, paths, config, profiles, store; no keyring or network

```sh
mail doctor
```

**Returns:** check this installation: version, paths, config, profiles, store; no keyring…

**Example:** `mail doctor`, `mail doctor --json`

## `mail skill`

the instructions an agent is given for this tool

### `mail skill show`

print SKILL.md — `mail skill install` puts it where Claude Code, Codex, Gemini CLI and OpenClaw look for it, and where Hermes does on request; --for prints the copy already there

```sh
mail skill show [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | print the copy installed for these agents instead of this version's. One of: `claude`, `agents`. |

**Returns:** print the tool's instructions for AI agents

**Example:** `mail skill show`

### `mail skill install`

write SKILL.md to \~/.claude/skills/mail-cli/ (Claude Code) and \~/.agents/skills/mail-cli/ (Codex, Gemini CLI, OpenClaw); --for hermes also has Hermes read \~/.agents/skills, which changes Hermes's own settings, so all leaves it out

**Changes something on this computer only.**

```sh
mail skill install [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `hermes`, `all`. Default: `all`. |

**Returns:** install the tool's instructions for AI agents

**Example:** `mail skill install --for agents`

### `mail skill status`

for each place `mail skill install` writes to, and for the copy Hermes reads: the path, the version installed there, and whether it is current, stale, missing or unversioned

```sh
mail skill status
```

**Returns:** whether the installed instructions for AI agents match this version

**Example:** `mail skill status`, `mail skill status --json`

## `mail mcp`

serve this profile to an agent over MCP and set it up — `claude mcp add mail -- mail <profile> mcp serve`

### `mail mcp serve`

serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add mail -- mail <profile> mcp serve`; `mail mcp serve --profiles a,b` or `--profiles all` serves those profiles from one server and each tool asks which

**Changes something in the service.**

```sh
mail mcp serve [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like sync=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |
| `--http` | serve over HTTP on 127.0.0.1 for ChatGPT and Claude in the browser, behind your tunnel; the profile's permissions decide. |
| `--port <port>` | the local port for --http (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |

**Returns:** serve this profile's commands to an AI agent

**Example:** `mail personal mcp serve`, `mail mcp serve --profiles work,personal`, `mail personal mcp serve --http --public-url https://laptop.example.ts.net`

### `mail mcp revoke`

forget every login `mcp serve --http` gave a browser app, of this profile or of the server `--profiles` names; each app must log in again

**Changes something on this computer only.**

```sh
mail mcp revoke [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Returns:** forget every login given to a browser app

**Example:** `mail personal mcp revoke`, `mail mcp revoke --profiles all`

### `mail mcp server`

start, stop and check `mcp serve --http` in the background; status shows the login code for a browser app

#### `mail mcp server start`

start `mcp serve --http` apart from this shell and answer once it listens, with its login code

**Changes something on this computer only.**

```sh
mail mcp server start [options]
```

| Option | What it does |
|---|---|
| `--port <port>` | the local port (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |
| `--permission <key=level>` | make a permission stricter for this server only; repeat for more keys. |
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Returns:** start the HTTP MCP server in the background

**Example:** `mail personal mcp server start --public-url https://laptop.example.ts.net`

#### `mail mcp server stop`

stop `mcp serve --http` — only one that `mcp server start` started

**Changes something on this computer only.**

```sh
mail mcp server stop [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Returns:** stop the background HTTP MCP server

**Example:** `mail personal mcp server stop`

#### `mail mcp server status`

whether `mcp serve --http` runs, on which port and address, the login code for a new browser app, and the apps logged in

```sh
mail mcp server status [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Returns:** whether the HTTP MCP server runs, its login code and the apps logged in

**Example:** `mail personal mcp server status --json`

### `mail mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
mail mcp config [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like sync=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Returns:** print the local MCP configuration of this profile, or of those --profiles names

**Example:** `mail personal mcp config`, `mail mcp config --profiles all`

### `mail mcp add`

add this profile's local MCP server to Codex or Claude Code

**Changes something on this computer only.**

```sh
mail mcp add <client> [options]
```

| Argument | | What it is |
|---|---|---|
| `client` | required | codex or claude-code. |

| Option | What it does |
|---|---|
| `--allow-writes` | acknowledge that this profile offers writing tools. |
| `--permission <key=level>` | make a permission stricter for this server only, like sync=deny; it never loosens the profile; repeat for more keys. |

**Returns:** add this profile's local MCP server to Codex or Claude Code

**Example:** `mail personal mcp add codex --allow-writes`

### `mail mcp check`

check this profile's local MCP handshake and tool list

```sh
mail mcp check [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like sync=deny; it never loosens the profile; repeat for more keys. |

**Returns:** check this profile's local MCP handshake and tool list

**Example:** `mail personal mcp check`

## `mail upgrade`

upgrade mail with the package manager that installed it; --check only looks

**Changes something on this computer only.**

```sh
mail upgrade [options]
```

| Option | What it does |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |

**Returns:** upgrade mail with the package manager that installed it; --check only looks

**Example:** `mail upgrade --check`

## `mail config`

the settings in force, and where each one came from

### `mail config show`

the profile, the profiles that exist, and each setting with where it came from

```sh
mail config show [options]
```

| Option | What it does |
|---|---|
| `--bot` | the settings a bot command on this profile gets, rather than the personal account's. |

**Returns:** the profile, the profiles that exist, and each setting with where it came from

**Example:** `mail personal config show`

### `mail config set`

save a setting to the configuration file

**Changes something on this computer only.**

```sh
mail config set <setting> <value> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, speech_model, picture_search, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, address, login, imap_host, imap_port, imap_security, folders, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin. |
| `value` | required | a number, true or false; for a group tg:work,max:Alice,email:me@x. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |
| `--personal` | only for personal accounts — the personal section of the file. |
| `--bot` | only for bots — the bot section of the file. |

**Returns:** save a setting to the configuration file

**Example:** `mail personal config set limit 20`

### `mail config unset`

remove a setting from the configuration file

**Changes something on this computer only.**

```sh
mail config unset <setting> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, speech_model, picture_search, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, address, login, imap_host, imap_port, imap_security, folders, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |
| `--personal` | only for personal accounts — the personal section of the file. |
| `--bot` | only for bots — the bot section of the file. |

**Returns:** remove a setting from the configuration file

**Example:** `mail personal config unset limit`

## `mail runs`

recorded runs — what this tool did, and when

### `mail runs list`

recorded runs, newest first

```sh
mail runs list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. Default: `20`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** run — run_id, command, started_at, status, cli_version, profile, completed_at, requests, and 23 more; every field: mail commands info runs list

**Example:** `mail personal runs list --limit 10`

### `mail runs show`

one run: what it was, how it ended, and every event it logged

```sh
mail runs show <run-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `mail runs list`. |

| Option | What it does |
|---|---|
| `--problems` | only failed responses, warnings and crashes. |

**Returns:** run details — run_id, command, started_at, status, cli_version, directory, event_count, events, and 22 more; every field: mail commands info runs show

**Example:** `mail personal runs show run-101`

### `mail runs path`

the directory holding one run

```sh
mail runs path <run-id>
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `mail runs list`. |

**Returns:** run location — path; every field: mail commands info runs path

**Example:** `mail personal runs path run-101`

## Exit codes

Branch on the code, not on the text: the text can change, the code does not.

| Code | When |
|---|---|
| `0` | it worked |
| `2` | `validation_error` |
| `3` | `configuration_error` |
| `4` | `authentication_error` |
| `5` | `permission_error` |
| `6` | `not_found` |
| `7` | `confirmation_required` |
| `8` | `rate_limited` |
| `9` | `timeout` |
| `10` | `network_error` |
| `11` | `provider_error` |
| `12` | `provider_unavailable` |
| `13` | `invalid_response` |
| `14` | `outcome_unknown` |
| `130` | `cancelled` |
| `1` | anything else |
