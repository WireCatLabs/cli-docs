---
title: "Comandos pbx"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Todos los comandos, opciones y códigos de salida, generados a partir del propio programa. Para obtener la misma lista en
JSON, ejecuta `pbx commands --json`. Las descripciones conservan el idioma de la ayuda.

**La primera palabra es el perfil**, un nombre que eliges tú: `pbx personal config show`. `PBX_PROFILE`
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
| `--compact` | one line per item for an agent: reference first, text last, paging and next steps as # lines. |
| `--dry-run` | preview parsed arguments and permissions before running the action. |
| `--yes` | go ahead without the question an ask level puts before a write. |
| `--record` | keep this run even where the config says record false; record_input false leaves the typed words out. |
| `--no-record` | do not keep this run, even if it fails. |

## `pbx commands`

every command by section; --json prints its contract, one path per call

### `pbx commands info`

one command contract, or all schemas, error reasons and explicit overrides

```sh
pbx commands info [path]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | one command path; without one, export schemas, error reasons and explicit overrides. |

**Example:** `pbx commands info commands`

## `pbx session`

check this profile's Asterisk source and keep its password in the OS keyring

### `pbx session start`

check that this profile reaches its call records, set with config set: each password it needs (the database's, the SSH tunnel's, the SFTP server's, when no key file is set) is asked hidden, or read from stdin one per line, never taken as an argument, checked, and only then kept in the keyring, or in a private file; Master.csv on this computer needs none

**Changes something on this computer only.**

```sh
pbx session start [options]
```

| Option | What it does |
|---|---|
| `--credential-storage <storage>` | where the password is kept: keyring, which falls back to a private file by itself, or file. Default: `keyring`. |

**Example:** `pbx office session start`, `pbx office session start --credential-storage file`

### `pbx session status`

show which password this profile's source needs and where it comes from: PBX_TOKEN, the keyring or a file, never the password; --check reads the newest call records to prove it works

```sh
pbx session status [options]
```

| Option | What it does |
|---|---|
| `--check` | read the newest call records to prove the settings and the password work. |

**Example:** `pbx office session status`, `pbx office session status --check --json`

### `pbx session end`

forget this profile's password on this computer; the imported calls stay, and the server is not touched

**Changes something on this computer only.**

```sh
pbx session end
```

**Example:** `pbx personal session end`

### `pbx session list`

list the profiles on this computer and whether each has a password; picks none

```sh
pbx session list
```

**Example:** `pbx session list`, `pbx session list --json`

## `pbx meetings`

stored meetings and their records

### `pbx meetings list`

meetings, newest first: the service's and the stored ones, kept in the store

```sh
pbx meetings list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--backend <archive\|server\|both>` | where to read: the store (archive), the service (server), or both, kept in the store (default: both). |
| `--limit <n>` | meetings per page; the profile's defaults.limit when absent. |
| `--page <n>` | which page, starting at 1. |

**Returns:** meeting — ref, id, provider_id, provider, account, title, url, started_at, and 11 more; every field: pbx commands info meetings list

**Next usually:** `pbx meetings show <meeting>`, `pbx meetings transcript <meeting>`, `pbx meetings summary <meeting>`

**Example:** `pbx office meetings list --limit 50 --json`

### `pbx meetings show`

show a meeting, read again from the service with its people, transcript and documents

```sh
pbx meetings show <meeting> [options]
```

| Argument | | What it is |
|---|---|---|
| `meeting` | required | the stored meeting's number, its meeting: ref, or the service's id (provider_id). |

| Option | What it does |
|---|---|
| `--backend <archive\|server\|both>` | where to read: the store (archive), the service (server), or both, kept in the store (default: both). |

**Returns:** meeting details — ref, id, provider_id, provider, account, title, url, started_at, and 20 more; every field: pbx commands info meetings show

**Next usually:** `pbx meetings transcript <meeting>`, `pbx meetings summary <meeting>`, `pbx meetings export <meeting>`

**Example:** `pbx office meetings show 1 --json`

### `pbx meetings transcript`

show current meeting transcripts

```sh
pbx meetings transcript <meeting> [options]
```

| Argument | | What it is |
|---|---|---|
| `meeting` | required | stored meeting id. |

| Option | What it does |
|---|---|
| `--history` | include superseded transcript versions. |

**Returns:** meeting transcript — ref, meeting, source, language, superseded_at, created_at, lines, untrusted; every field: pbx commands info meetings transcript

**Example:** `pbx office meetings transcript 1 --json`

### `pbx meetings summary`

show stored meeting summaries

```sh
pbx meetings summary <meeting>
```

| Argument | | What it is |
|---|---|---|
| `meeting` | required | stored meeting id. |

**Returns:** meeting summary — id, meeting, source, title, overview, sections, next_steps, content, and 4 more; every field: pbx commands info meetings summary

**Next usually:** `pbx meetings show <meeting>`, `pbx meetings transcript <meeting>`, `pbx meetings export <meeting>`

**Example:** `pbx office meetings summary 1 --json`

### `pbx meetings export`

export a meeting as Markdown or one transcript as WebVTT

**Changes something on this computer only.**

```sh
pbx meetings export <meeting> [options]
```

| Argument | | What it is |
|---|---|---|
| `meeting` | required | stored meeting id. |

| Option | What it does |
|---|---|
| `--format <format>` | export format. One of: `markdown`, `vtt`. Default: `markdown`. |
| `--transcript-id <id>` | export a specific transcript version. |
| `--output <file>` | write content to a new file through the host's writer. |

**Returns:** meeting export — meeting_id, format, filename, content, untrusted, output; every field: pbx commands info meetings export

**Example:** `pbx office meetings export 1 --format markdown --json`

### `pbx meetings people`

find meeting participants by name or email

```sh
pbx meetings people <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | a name or an email address. |

| Option | What it does |
|---|---|
| `--limit <n>` | most matching observations per page, 1–1000 (default 50). |
| `--scan-limit <n>` | most participant observations to inspect, 1–10000 (default 1000). |
| `--max-read-bytes <bytes>` | most stored name and email bytes to read (default 1048576). |
| `--cursor <cursor>` | continue with the same name query and selected account. |

**Returns:** meeting participants — schema_version, kind, account_id, query, items, ambiguity, coverage, page; every field: pbx commands info meetings people

**Example:** `pbx office meetings people "Test Manager" --json`

### `pbx meetings sync`

bring the stored meetings up to date from the connected account, oldest first; a run that stops before its deadline keeps what it saved and the next one goes on from there

**Changes something on this computer only.**

```sh
pbx meetings sync [options]
```

| Option | What it does |
|---|---|
| `--since-time <time>` | fetch meetings starting at or after this ISO 8601 date or time, or 30m, 2h, 7d ago. |
| `--lookback-days <days>` | revisit recent occurrences for late transcripts (0–31). |
| `--rescan` | read the last 30 days again, not only what came after the last sync. |

**Returns:** meeting ingestion — meetings, participants, transcript_rows, summaries, warnings, timezone; every field: pbx commands info meetings sync

**Example:** `pbx office meetings sync --since-time 2026-08-01T00:00:00Z --json`

### `pbx meetings import`

import downloaded meeting transcripts

**Changes something on this computer only.**

```sh
pbx meetings import <folder>
```

| Argument | | What it is |
|---|---|---|
| `folder` | required | folder of transcripts downloaded from the provider. |

**Returns:** meeting ingestion — meetings, participants, transcript_rows, summaries, warnings, timezone; every field: pbx commands info meetings import

**Example:** `pbx office meetings import ./transcripts --json`

### `pbx meetings repair`

preview filling in what older builds left out of stored transcripts (their language); --yes stores it

**Changes something on this computer only.**

```sh
pbx meetings repair [options]
```

| Option | What it does |
|---|---|
| `--yes` | store the detected languages; otherwise only preview. |

**Returns:** meeting repair — account_id, applied, transcripts, languages; every field: pbx commands info meetings repair

**Example:** `pbx office meetings repair --json`

### `pbx meetings embed`

preview building the vectors search by meaning reads; --yes builds one batch, rerun for the next

**Changes something on this computer only.**

```sh
pbx meetings embed [options]
```

| Option | What it does |
|---|---|
| `--model <model>` | embedding model: a local one (default: the models command's default text model). |
| `--base-url <url>` | remote embedding service; the passages are sent there. OpenAI reads OPENAI_API_KEY. |
| `--dims <n>` | vector size the remote service returns, in dimensions. |
| `--limit <n>` | how many passages in one batch, 1 through 1000 (default 100). |
| `--max-rows <n>` | most transcript lines to read, 1 through 100000. |
| `--max-text-bytes <bytes>` | most transcript text to read, in bytes (default 4 MiB). |
| `--yes` | split transcripts and build their vectors; otherwise only preview. |

**Example:** `pbx office meetings embed --json`, `pbx office meetings embed --yes --json`

### `pbx meetings transcribe`

read each call's recording, never changing it, and recognize the speech with a local speech model; a profile with transcribe_engine openai sends the audio to that service instead, and the run says so first

**Changes something on this computer only.**

```sh
pbx meetings transcribe [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that pick the calls (default duration_ms>=5000) — the fields are below. |

| Option | What it does |
|---|---|
| `--replace` | transcribe calls that already have a transcript too, replacing it. |
| `--max-meetings <n>` | at most this many calls transcribed, newest first. Default: `20`. |
| `--model <model>` | local speech model, when the profile transcribes locally. Default: `gigaam-v3`. |

**Returns:** call transcription report — transcribed, audio_seconds, failed, without_recording, remaining, stopped; every field: pbx commands info meetings transcribe

**Example:** `pbx office meetings transcribe --max-meetings 20 --json`, `pbx office meetings transcribe duration_ms>=60000 --json`, `pbx office meetings transcribe id:12 --replace --json`

## `pbx events`

the owner's stored events

### `pbx events list`

list stored events

```sh
pbx events list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | event id, origin or time fields that narrow the list. |

**Returns:** event — id, event_series_id, title, description, location, starts_at, ends_at, timezone, and 13 more; every field: pbx commands info events list

**Example:** `pbx office events list --json`

## `pbx stats`

statistics

### `pbx stats calls`

numbers about the stored phone calls

#### `pbx stats calls show`

calls by direction and outcome, per employee, by hour and by day; missed incoming calls and whether the client was called back; short calls. What the phone system does not record is counted as unknown

```sh
pbx stats calls show [options]
```

| Option | What it does |
|---|---|
| `--since-time <time>` | calls starting at or after this date or time (ISO 8601, or 30d ago). |
| `--until-time <time>` | calls starting at or before this date or time; a date alone is that whole day. |
| `--timezone <zone>` | the IANA zone hours and days are read in (default: this computer's). |
| `--person-id <id>` | only calls this stored person took part in; a phone system that keeps no one who only rang misses those. |
| `--within <duration>` | how long after a missed call a callback counts (default 1d). |
| `--limit <n>` | most missed calls listed one by one, newest first (default 100); all are counted. |

**Returns:** call stats — time_zone, callback_within_ms, short_call_under_ms, calls, not_calls, known, employees, hours, and 10 more; every field: pbx commands info stats calls show

**Example:** `pbx office stats calls show --since-time 7d --json`

## `pbx search`

search the stored resources

### `pbx search meetings`

find words in stored meetings, and by meaning with --model

**Changes something on this computer only.**

```sh
pbx search meetings <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | words, OR, (groups), -word, "a phrase", "a b"\~N (within N lines), exact:word, from:"Name" (who said the line); date>=30d, project:, tag:, topic: choose meetings; a word also matches its other forms and spellings speech recognition garbled. |

| Option | What it does |
|---|---|
| `--meeting-id <id>` | only this stored meeting. |
| `--identity-id <id>` | meetings with this participant identity; does not say who spoke a hit. |
| `--person-id <id>` | meetings with a participant linked to this person. |
| `--event-id <id>` | only meetings linked to this stored event. |
| `--series-id <id>` | only meetings in this stored series. |
| `--project <project>` | meetings confirmed in this project, by name, key or alias. |
| `--tag <name>` | meetings with this tag, by name or alias. |
| `--topic-name <name>` | meetings with this topic, by name or alias. |
| `--since-time <time>` | meetings starting at or after this ISO 8601 date or time, or 30m, 2h, 7d ago. |
| `--until-time <time>` | meetings starting at or before this ISO 8601 date or time; a date alone covers that whole local day. |
| `--limit <n>` | how many hits, 1 through 1000; the profile's defaults.limit when absent. |
| `--cursor <cursor>` | continue from the previous page's page.next_cursor, with the same query and filters. |
| `--max-read-bytes <bytes>` | most stored bytes to read, 1 through 67108864 (default 4194304). |
| `--model <model>` | rank words and meaning together with this embedding model, building missing vectors first; local stays here. |
| `--base-url <url>` | remote embedding service for --model; the passages are sent there. |
| `--dims <n>` | vector size the remote service returns, in dimensions. |
| `--max-chunks <n>` | by meaning: most stored passages to compare (default 10000). |
| `--max-rows <n>` | by meaning: most transcript lines to read, 1 through 100000. |
| `--max-text-bytes <bytes>` | by meaning: most transcript text to read (default 4 MiB). |

**Returns:** meeting hit — ref, meeting, scope, id, excerpt, offset_ms, language, line, and 8 more; every field: pbx commands info search meetings

**Next usually:** `pbx meetings show <meeting>`, `pbx meetings transcript <meeting>`, `pbx meetings summary <meeting>`

**Example:** `pbx office search meetings refund --json`, `pbx office search meetings "a client unhappy with the delivery" --model embeddinggemma --json`

## `pbx tags`

your labels on stored meetings, kept in the local store and never sent

### `pbx tags add`

put tags on stored meetings: by id, or every meeting where a search finds its words

**Changes something on this computer only.**

```sh
pbx tags add <tag> [options]
```

| Argument | | What it is |
|---|---|---|
| `tag` | required | one or more tags: 1–32 letters a–z, digits and hyphens; upper case is lowered. |

| Option | What it does |
|---|---|
| `--meeting <id>` | a meeting, by its store id; repeat for more. |
| `--matching <query>` | every meeting where search meetings finds this query: words, phrases, OR, -word, from:, date>=30d. |

**Returns:** meeting tag change — tags, matched, changed; every field: pbx commands info tags add

**Example:** `pbx office tags add complaint --matching "refund OR complaint" --json`, `pbx office tags add vip --meeting 12 --json`

### `pbx tags remove`

take tags off stored meetings: by id, or every meeting where a search finds its words

**Changes something on this computer only.**

```sh
pbx tags remove <tag> [options]
```

| Argument | | What it is |
|---|---|---|
| `tag` | required | one or more tags: 1–32 letters a–z, digits and hyphens; upper case is lowered. |

| Option | What it does |
|---|---|
| `--meeting <id>` | a meeting, by its store id; repeat for more. |
| `--matching <query>` | every meeting where search meetings finds this query: words, phrases, OR, -word, from:, date>=30d. |

**Returns:** meeting tag change — tags, matched, changed; every field: pbx commands info tags remove

**Example:** `pbx office tags remove complaint --meeting 12 --json`

### `pbx tags list`

the stored meetings of this account that carry a tag, each with all its tags

```sh
pbx tags list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | meetings per page, 1–500 (default 100). Default: `100`. |
| `--page <n>` | page number. Default: `1`. |

**Returns:** meeting tagging — meeting, meeting_id, title, started_at, tags, untrusted; every field: pbx commands info tags list

**Example:** `pbx office tags list tag:complaint --json`

## `pbx models`

models that run on this machine

### `pbx models list`

speech and embedding models, their download status and the default of each kind

```sh
pbx models list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** model — id, kind, title, languages, size_bytes, downloaded, default, path, and 6 more; every field: pbx commands info models list

**Next usually:** `pbx models download <model>`, `pbx models set <model>`

**Example:** `pbx models list`, `pbx models list kind:audio`

### `pbx models download`

download and verify one speech or embedding model

**Changes something on this computer only.**

```sh
pbx models download <model> [options]
```

| Argument | | What it is |
|---|---|---|
| `model` | required | a model id from models list. |

| Option | What it does |
|---|---|
| `--offline` | refuse a download that needs the network. |
| `--accept-terms` | no longer needed; kept so older scripts still run. |

**Returns:** model — id, kind, title, languages, size_bytes, downloaded, default, path, and 6 more; every field: pbx commands info models download

**Next usually:** `pbx models set <model>`

**Example:** `pbx models download embeddinggemma`

### `pbx models set`

make a downloaded text model the one every embed and every search by meaning uses, in every WireCat CLI. Each model keeps its own vectors: the next syncs embed what the new one lacks, and switching back is instant

**Changes something on this computer only.**

```sh
pbx models set <model>
```

| Argument | | What it is |
|---|---|---|
| `model` | required | a downloaded text model id from models list. |

**Returns:** model chosen — id, kind, title, languages, size_bytes, downloaded, default, path, and 9 more; every field: pbx commands info models set

**Next usually:** `pbx models download <model>`

**Example:** `pbx models set e5-large`

### `pbx models add`

add an ONNX embedding model from Hugging Face, pinned and checked by sha256

**Changes something on this computer only.**

```sh
pbx models add <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the id to give it: a-z, 0-9, . _ -. |

| Option | What it does |
|---|---|
| `--payload <json>` | where the model is and how to run it, as JSON (below). |
| `--offline` | refuse a call that needs the network. |

**Returns:** model — id, kind, title, languages, size_bytes, downloaded, default, path, and 6 more; every field: pbx commands info models add

**Next usually:** `pbx models download <model>`, `pbx models set <model>`

**Example:** `pbx models add e5-base --payload '{"repository":"Xenova/multilingual-e5-base","onnx":"onnx/model_quantized.onnx","dims":768,"pooling":"mean","prefix":{"query":"query: ","passage":"passage: "}}'`

## `pbx doctor`

the state this installation is in, without connecting unless --online

```sh
pbx doctor [options]
```

| Option | What it does |
|---|---|
| `--online` | also connect once and read the account; sends nothing. |

**Example:** `pbx doctor`, `pbx doctor --json`

### `pbx doctor reports`

problem reports

#### `pbx doctor reports show`

what a problem report holds; writes nothing

```sh
pbx doctor reports show
```

**Example:** `pbx doctor reports show`

#### `pbx doctor reports create`

write a problem report to a file, and say where to send it

**Changes something on this computer only.**

```sh
pbx doctor reports create [options]
```

| Option | What it does |
|---|---|
| `--run <id>` | the run the report is about; the newest failed one if not given. |
| `--output <file>` | where to write it; a new file in this directory if not given. |

**Example:** `pbx doctor reports create --output ./problem-report.json`

## `pbx skill`

the instructions an agent is given for this tool

### `pbx skill show`

print SKILL.md — `pbx skill install` puts it where Claude Code, Codex, Gemini CLI and OpenClaw look for it, and where Hermes does on request; --for prints the copy already there

```sh
pbx skill show [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | print the copy installed for these agents instead of this version's. One of: `claude`, `agents`. |

**Example:** `pbx skill show`

### `pbx skill install`

write SKILL.md to \~/.claude/skills/asterisk-cli/ (Claude Code) and \~/.agents/skills/asterisk-cli/ (Codex, Gemini CLI, OpenClaw); --for hermes also has Hermes read \~/.agents/skills, which changes Hermes's own settings, so all leaves it out

**Changes something on this computer only.**

```sh
pbx skill install [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `hermes`, `all`. Default: `all`. |

**Example:** `pbx skill install --for agents`

### `pbx skill status`

for each place `pbx skill install` writes to, and for the copy Hermes reads: the path, the version installed there, and whether it is current, stale, missing or unversioned

```sh
pbx skill status
```

**Example:** `pbx skill status`, `pbx skill status --json`

## `pbx mcp`

serve this profile to an agent over MCP and set it up — `claude mcp add pbx -- pbx <profile> mcp serve`

### `pbx mcp serve`

serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add pbx -- pbx <profile> mcp serve`; `pbx mcp serve --profiles a,b` or `--profiles all` serves those profiles from one server and each tool asks which

**Changes something in the service.**

```sh
pbx mcp serve [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like meetings.sync=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |
| `--http` | serve over HTTP on 127.0.0.1 for ChatGPT and Claude in the browser, behind your tunnel; the profile's permissions decide. |
| `--port <port>` | the local port for --http (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |

**Example:** `pbx personal mcp serve`, `pbx mcp serve --profiles work,personal`, `pbx personal mcp serve --http --public-url https://laptop.example.ts.net`

### `pbx mcp revoke`

forget every login `mcp serve --http` gave a browser app, of this profile or of the server `--profiles` names; each app must log in again

**Changes something on this computer only.**

```sh
pbx mcp revoke [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `pbx personal mcp revoke`, `pbx mcp revoke --profiles all`

### `pbx mcp server`

start, stop and check `mcp serve --http` in the background; status shows the login code for a browser app

#### `pbx mcp server start`

start `mcp serve --http` apart from this shell and answer once it listens, with its login code

**Changes something on this computer only.**

```sh
pbx mcp server start [options]
```

| Option | What it does |
|---|---|
| `--port <port>` | the local port (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |
| `--permission <key=level>` | make a permission stricter for this server only; repeat for more keys. |
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `pbx personal mcp server start --public-url https://laptop.example.ts.net`

#### `pbx mcp server stop`

stop `mcp serve --http` — only one that `mcp server start` started

**Changes something on this computer only.**

```sh
pbx mcp server stop [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `pbx personal mcp server stop`

#### `pbx mcp server status`

whether `mcp serve --http` runs, on which port and address, the login code for a new browser app, and the apps logged in

```sh
pbx mcp server status [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `pbx personal mcp server status --json`

### `pbx mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
pbx mcp config [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like meetings.sync=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `pbx personal mcp config`, `pbx mcp config --profiles all`

### `pbx mcp add`

add this profile's local MCP server to Codex or Claude Code

**Changes something on this computer only.**

```sh
pbx mcp add <client> [options]
```

| Argument | | What it is |
|---|---|---|
| `client` | required | codex or claude-code. |

| Option | What it does |
|---|---|
| `--allow-writes` | acknowledge that this profile offers writing tools. |
| `--permission <key=level>` | make a permission stricter for this server only, like meetings.sync=deny; it never loosens the profile; repeat for more keys. |

**Example:** `pbx personal mcp add codex --allow-writes`

### `pbx mcp check`

check this profile's local MCP handshake and tool list

```sh
pbx mcp check [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like meetings.sync=deny; it never loosens the profile; repeat for more keys. |

**Example:** `pbx personal mcp check`

## `pbx upgrade`

upgrade pbx with the package manager that installed it; --check only looks

**Changes something on this computer only.**

```sh
pbx upgrade [options]
```

| Option | What it does |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |

**Example:** `pbx upgrade --check`

## `pbx config`

the settings in force, and where each one came from

### `pbx config show`

the profile, the profiles that exist, and each setting with where it came from

```sh
pbx config show
```

**Example:** `pbx personal config show`

### `pbx config set`

save a setting to the configuration file

**Changes something on this computer only.**

```sh
pbx config set <setting> <value> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, cdr_source, cdr_csv_path, cdr_csv_columns, db_host, db_port, db_name, db_user, db_table, db_tls, db_ssh_host, db_ssh_port, db_ssh_user, db_ssh_key_path, db_ssh_host_key, recordings_path, recordings_pattern, recordings_channels, files_from, sftp_host, sftp_port, sftp_user, sftp_key_path, sftp_host_key, cdr_timezone, phone_region, extension_pattern, transcribe_engine, transcribe_model, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities. |
| `value` | required | a number, true or false; for a group tg:work,max:Alice,email:me@x. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Example:** `pbx personal config set limit 20`

### `pbx config unset`

remove a setting from the configuration file

**Changes something on this computer only.**

```sh
pbx config unset <setting> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, cdr_source, cdr_csv_path, cdr_csv_columns, db_host, db_port, db_name, db_user, db_table, db_tls, db_ssh_host, db_ssh_port, db_ssh_user, db_ssh_key_path, db_ssh_host_key, recordings_path, recordings_pattern, recordings_channels, files_from, sftp_host, sftp_port, sftp_user, sftp_key_path, sftp_host_key, cdr_timezone, phone_region, extension_pattern, transcribe_engine, transcribe_model, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Example:** `pbx personal config unset limit`

### `pbx config migrate`

write each setting the file lacks at its default, keeping yours

**Changes something on this computer only.**

```sh
pbx config migrate
```

**Example:** `pbx config migrate`

### `pbx config repair`

fix broken JSON syntax in the settings file — comments, a missing or extra comma, unquoted keys, single quotes, missing closing brackets at the end — keeping every value, with a backup beside it; refuses anything with more than one reading and changes nothing then

**Changes something on this computer only.**

```sh
pbx config repair [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | say what it would fix, and change nothing. |

**Example:** `pbx config repair`, `pbx config repair --dry-run`

## `pbx runs`

recorded runs — what this tool did, and when

### `pbx runs list`

recorded runs, newest first

```sh
pbx runs list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |

**Returns:** run — run_id, command, started_at, status, cli_version, profile, completed_at, requests, and 23 more; every field: pbx commands info runs list

**Example:** `pbx personal runs list --limit 10`

### `pbx runs show`

one run: what it was, how it ended, and every event it logged

```sh
pbx runs show <run-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `pbx runs list`. |

| Option | What it does |
|---|---|
| `--problems` | only failed responses, warnings and crashes. |

**Returns:** run details — run_id, command, started_at, status, cli_version, directory, event_count, events, and 22 more; every field: pbx commands info runs show

**Example:** `pbx personal runs show run-101`

### `pbx runs path`

the directory holding one run

```sh
pbx runs path <run-id>
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `pbx runs list`. |

**Returns:** run location — path; every field: pbx commands info runs path

**Example:** `pbx personal runs path run-101`

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
| `15` | `conflict` |
| `130` | `cancelled` |
| `1` | anything else |
