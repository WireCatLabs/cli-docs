---
title: "Comandos de slk"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Busca cualquier comando de slk, sus opciones y sus códigos de salida, con la seguridad de que coinciden con
tu versión: esta página se genera a partir del propio programa. Para la misma lista en JSON, ejecuta
`slk commands --json`. Las descripciones conservan el idioma de la ayuda.

**La primera palabra es el perfil**, un nombre que eliges tú: `slk personal config show`. `SLACK_PROFILE`
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
| `--trace` | the connection's own log lines on stderr — never message content. |
| `--debug` | on a failure, its whole record — cause and stack — in place of the short line. |
| `--timeout <duration>` | give up on the whole command after this — 30s, 2m, 500ms. |
| `--offline` | answer from what was recorded and never connect; fails if nothing was. |
| `--no-input` | never prompt or open interactive login; piped input remains available. |
| `--max-input-bytes <bytes>` | maximum buffered input bytes (default: 16777216). |
| `--max-output-bytes <bytes>` | maximum machine output bytes (default: 4194304; 0 disables). |
| `--brief` | found messages as reference, title, time, sender and excerpt only. |
| `--full` | found messages with their whole text and every provider field. |
| `--compact` | one line per item for an agent: reference first, text last, paging and next steps as # lines. |
| `--dry-run` | preview parsed arguments and permissions before running the action. |
| `--yes` | go ahead without the question an ask level puts before a write. |
| `--record` | keep this run even where the config says record false; record_input false leaves the typed words out. |
| `--no-record` | do not keep this run, even if it fails. |

## `slk commands`

every command by section; --json prints its contract, one path per call

### `slk commands info`

one command contract, or all schemas, error reasons and explicit overrides

```sh
slk commands info [path]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | one command path; without one, export schemas, error reasons and explicit overrides. |

**Example:** `slk commands info messages list`

## `slk session`

keep this profile's Slack User OAuth Token (xoxp-…) in the OS keyring

### `slk session start`

sign this profile in: the Slack User OAuth Token (xoxp-…) is asked hidden or read from stdin, never taken as an argument, checked with Slack, and only then kept in the keyring, or in a private file. Paste the User OAuth Token (xoxp-…) of your own Slack app, made from docs/slack-app-manifest.json; a bot token is refused

**Changes something on this computer only.**

```sh
slk session start [options]
```

| Option | What it does |
|---|---|
| `--credential-storage <storage>` | where the token is kept: keyring, which falls back to a private file by itself, or file. Default: `keyring`. |

**Example:** `slk personal session start`, `slk personal session start --credential-storage file`

### `slk session status`

show where this profile's token comes from: SLACK_TOKEN, the keyring or a file, never the token; --check asks Slack whose token it is

```sh
slk session status [options]
```

| Option | What it does |
|---|---|
| `--check` | ask Slack whether the token still works, and whose it is. |

**Example:** `slk personal session status`, `slk personal session status --check --json`

### `slk session end`

forget this profile's token on this computer; the token itself stays valid in Slack. The app stays installed in the workspace; remove it there to revoke the token

**Changes something on this computer only.**

```sh
slk session end
```

**Example:** `slk personal session end`

### `slk session list`

list the profiles on this computer and whether each has a token; picks none

```sh
slk session list
```

**Example:** `slk session list`, `slk session list --json`

## `slk setup`

connect this profile to slk: the same questions WireCat Desktop shows, asked in the terminal, checked, and saved only when the check succeeds; show, apply and run are the same flow for programs

### `slk setup show`

print the connection flow as a WireCat setup document: steps, texts in every language, and each setting's own JSON Schema; with a profile it adds the profile's current values, a secret only as { set: true }

```sh
slk setup show
```

**Example:** `slk personal setup show --json`, `slk office setup show --json`

### `slk setup apply`

read the answers as one JSON object on stdin (input id → value), keep only those on the path they lead to, check each with its setting's own schema, then run the CLI's check and save the settings and secrets; --dry-run only checks and saves nothing

**Changes something on this computer only.**

```sh
slk setup apply [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | check the answers, and save nothing. |

**Example:** `slk office setup apply --dry-run --json`, `slk office setup apply --json`

### `slk setup run`

run one run step of the flow: apply checks the answers, runs the CLI's check and saves; the sign-in events go to stderr as JSON lines and the result to stdout; with --answer-stdin the answers are stdin's first line

**Changes something on this computer only.**

```sh
slk setup run <action> [options]
```

| Argument | | What it is |
|---|---|---|
| `action` | required | the step's action: apply. |

| Option | What it does |
|---|---|
| `--answer-stdin` | with --json and no terminal: print each question as a `needs` line on stderr and read its answer, one line, from stdin. |

**Example:** `slk office setup run apply --json --answer-stdin`

## `slk account`

the logged-in account

### `slk account list`

every account profile on this computer, and the account each is logged in as; a name that is only a bot is left out (`bot list` has it), one that is a bot too says `bot: true`; asks the messenger nothing

```sh
slk account list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** account profile — profile, current, account, name, signed_in, bot; every field: slk commands info account list

**Example:** `slk personal account list`

### `slk account show`

who this profile is logged in as, with the phone number

```sh
slk account show [options]
```

| Option | What it does |
|---|---|
| `--hide-phone` | leave the phone number out. |

**Returns:** account — provider, id, name, username, phone, scope; every field: slk commands info account show

**Example:** `slk personal account show`

### `slk account update`

change the name, the description or the photo everyone sees on your profile

**Changes something in the service.**

```sh
slk account update [options]
```

| Option | What it does |
|---|---|
| `--first-name <name>` | your first name. |
| `--last-name <name>` | your last name. |
| `--description <text>` | about you. |
| `--photo <file>` | a new profile photo — an image file. |
| `--hide-phone` | leave the phone number out of the answer. |

**Returns:** account change — operation_id, account; every field: slk commands info account update

**Example:** `slk personal account update --first-name Alex`

### `slk account remove`

sign the profile out, then forget it on this computer: its settings, its saved sign-in and its files; --keep-data leaves its messages in the store, where search still finds them, --delete-data deletes them; asks first, or --yes

**Changes something in the service.**

```sh
slk account remove [options]
```

| Option | What it does |
|---|---|
| `--keep-data` | leave what the store holds of this account, still searchable. |
| `--delete-data` | delete what the store and the tool's own files hold of this account. |
| `--dry-run` | list what it would remove and keep, and change nothing. |

**Returns:** account removal — profile, data, dry_run, account, revoked, config_file, removed, kept; every field: slk commands info account remove

**Example:** `slk personal account remove --keep-data --dry-run`, `slk personal account remove --delete-data --yes`

## `slk chats`

the account's chats

### `slk chats list`

chats, newest first, archived ones included; the query is answered from the local store, so online, where the messenger filters nothing, it needs --offline

```sh
slk chats list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

**Returns:** chat — ref, id, title, kind, unread_count, last_message_at, participants_count, provider, and 14 more; every field: slk commands info chats list

**Next usually:** `slk chats events <chat> [query]`, `slk chats show <chat>`, `slk chats documents list <chat> [query]`

**Example:** `slk personal chats list --limit 10`

### `slk chats events`

who joined, left, was added or removed, and by whom — from the chat's service messages; the last 7 days unless the query names time

```sh
slk chats events <chat> [query]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** chat event — chat_id, time, type, people, message_id, by, title, before; every field: slk commands info chats events

**Example:** `slk personal chats events "Book club"`

### `slk chats show`

one chat: its kind, unread count, last message time and who is in it

```sh
slk chats show <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

**Returns:** chat — ref, id, title, kind, unread_count, last_message_at, participants_count, provider, and 14 more; every field: slk commands info chats show

**Next usually:** `slk chats events <chat> [query]`, `slk chats documents list <chat> [query]`, `slk chats members list <chat> [query]`

**Example:** `slk personal chats show "Book club"`

### `slk chats documents`

the Google Docs and Drive documents linked in a chat's stored messages

#### `slk chats documents list`

every document link in the chat, newest first, and whether the store has it

```sh
slk chats documents list <chat> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |

**Returns:** document link — ref, url, document_id, title, in_store, sent_at, sender; every field: slk commands info chats documents list

**Example:** `slk personal chats documents list "Project room" --limit 10`

### `slk chats members`

who is in a group

#### `slk chats members list`

everyone in a group, a page at a time, with their role and when they were last seen

```sh
slk chats members list <chat> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `query` | optional | field:value terms; this list filters by none yet. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

**Returns:** member — id, name, username, role, last_seen_at, registered_at, joined_at, invited_by, and 7 more; every field: slk commands info chats members list

**Next usually:** `slk contacts show <person>`, `slk contacts context <person>`, `slk contacts prepare <person>`

**Example:** `slk personal chats members list "Book club"`

#### `slk chats members check`

members that look like bots, each with its reasons — read from the member list and the local store; never one request per person, and it removes nobody

```sh
slk chats members check <chat> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--max-pages <pages>` | at most this many pages of 200 members, a pause between them (default: 10). |
| `--deep <n>` | also check the top n in full — profile, photos and everything they wrote — one person a second; the public ban lists cover Telegram only, so nothing is sent. |

**Returns:** member — id, name, username, role, last_seen_at, registered_at, joined_at, invited_by, and 7 more; every field: slk commands info chats members check

**Next usually:** `slk contacts show <person>`, `slk contacts context <person>`, `slk contacts prepare <person>`

**Example:** `slk personal chats members check "Book club"`

#### `slk chats members history`

who joined, who left and whose profile changed, oldest first — what chats members fetch recorded in the local store; never asks the messenger

```sh
slk chats members history <chat> [query]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** chat event — chat_id, time, type, people, message_id, by, title, before; every field: slk commands info chats members history

**Example:** `slk personal chats members history "Book club"`

#### `slk chats members fetch`

read a group's whole member list into the local store's member history: who joined, who left, daily counts and profile changes; someone is recorded as gone only when every member was read

**Changes something on this computer only.**

```sh
slk chats members fetch <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

| Option | What it does |
|---|---|
| `--track` | also fetch it daily while serve runs; chats tracking lists and edits those chats. |
| `--max-pages <pages>` | at most this many pages of 200 members, a pause between them (default: 10). |

**Returns:** chat members fetch — chat_id, joined, gone, changed, read, participants, complete, more, and 1 more; every field: slk commands info chats members fetch

**Example:** `slk personal chats members fetch "Book club"`

#### `slk chats members add`

add people; they are told

**Changes something in the service.**

```sh
slk chats members add <chat> <person>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `person` | required | an id, or part of a name. |

**Returns:** chat members change — operation_id, chat_id, added, not_added, removed; every field: slk commands info chats members add

**Example:** `slk personal chats members add "Book club" "Alex Example"`

#### `slk chats members remove`

remove people; their messages stay

**Changes something in the service.**

```sh
slk chats members remove <chat> <person>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `person` | required | an id, or part of a name. |

**Returns:** chat members change — operation_id, chat_id, added, not_added, removed; every field: slk commands info chats members remove

**Example:** `slk personal chats members remove "Book club" "Alex Example"`

### `slk chats mark-read`

mark a chat read; the other side sees that you read it

**Changes something in the service.**

```sh
slk chats mark-read <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

| Option | What it does |
|---|---|
| `--until-id <id>` | only up to this message id; the newest by default. |
| `--topic <id>` | mark only this forum topic read. |

**Returns:** chat read — operation_id, chat_id, until, thread_id; every field: slk commands info chats mark-read

**Example:** `slk personal chats mark-read "Book club" --until-id 101`

### `slk chats tracking`

the chats whose member lists serve fetches daily into the local store — chats members fetch --track adds one

#### `slk chats tracking list`

every tracked chat: since when, and its last member count

```sh
slk chats tracking list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** tracked chat — chat_id, title, tracked_at, last_count; every field: slk commands info chats tracking list

**Example:** `slk personal chats tracking list`

#### `slk chats tracking show`

one chat: whether it is tracked, and its member count per day for the last 30 days

```sh
slk chats tracking show <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

**Returns:** tracked chat history — chat_id, tracked_at, counts; every field: slk commands info chats tracking show

**Example:** `slk personal chats tracking show "Book club"`

#### `slk chats tracking add`

fetch this chat's member list daily while serve runs, from its next run

**Changes something on this computer only.**

```sh
slk chats tracking add <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

**Returns:** chat tracking — chat_id, tracked; every field: slk commands info chats tracking add

**Example:** `slk personal chats tracking add "Book club"`

#### `slk chats tracking remove`

stop fetching it daily; the history already kept stays

**Changes something on this computer only.**

```sh
slk chats tracking remove <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

**Returns:** chat tracking — chat_id, tracked; every field: slk commands info chats tracking remove

**Example:** `slk personal chats tracking remove "Book club"`

### `slk chats create`

create a group or a channel; the people added are told

**Changes something in the service.**

```sh
slk chats create <title> [person] [options]
```

| Argument | | What it is |
|---|---|---|
| `title` | required | the group's name. |
| `person` | optional | people to add: an id, or part of a name. |

| Option | What it does |
|---|---|
| `--channel` | a private channel instead of a group; people join it by its link. |

**Returns:** chat group change — operation_id, chat, requested; every field: slk commands info chats create

**Example:** `slk personal chats create "Book club" "Alex Example"`

### `slk chats join`

join a group or channel by its link; the others in it see that you joined

**Changes something in the service.**

```sh
slk chats join <link>
```

| Argument | | What it is |
|---|---|---|
| `link` | required | an invite link, or a public one. |

**Returns:** chat group change — operation_id, chat, requested; every field: slk commands info chats join

**Example:** `slk personal chats join '#general'`

### `slk chats leave`

leave a group or channel; the others in it see that you left

**Changes something in the service.**

```sh
slk chats leave <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

**Returns:** chat removal — operation_id, chat_id; every field: slk commands info chats leave

**Example:** `slk personal chats leave "Book club"`

### `slk chats update`

rename a group or channel, change its description, or turn one of its settings on or off

**Changes something in the service.**

```sh
slk chats update <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

| Option | What it does |
|---|---|
| `--title <title>` | the new name. |
| `--description <text>` | the new description. |
| `--all-can-pin <on\|off>` | every member may pin messages. |
| `--only-admins-add <on\|off>` | only admins may add members. |
| `--only-admins-call <on\|off>` | only admins may start a call. |
| `--only-owner-edits-info <on\|off>` | only the owner may change the name and photo. |
| `--members-see-link <on\|off>` | members may see the invite link. |

**Returns:** chat group change — operation_id, chat, requested; every field: slk commands info chats update

**Example:** `slk personal chats update "Book club" --title "Reading group"`

### `slk chats rules`

what `chats moderate` judges a group by, kept in a file of this profile

#### `slk chats rules show`

the group's rules; the defaults, marked not saved, if it has none yet

```sh
slk chats rules show <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

**Returns:** chat rules — chat_id, title, file, saved, rules; every field: slk commands info chats rules show

**Example:** `slk personal chats rules show "Book club"`

#### `slk chats rules set`

change one rule; the group's first change writes every rule with its default

**Changes something on this computer only.**

```sh
slk chats rules set <chat> <key> <value>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `key` | required | one of: trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove. |
| `value` | required | the new value; a list is comma-separated. |

**Returns:** chat rules — chat_id, title, file, saved, rules; every field: slk commands info chats rules set

**Example:** `slk personal chats rules set "Book club" links report`

#### `slk chats rules unset`

put one rule back to its default

**Changes something on this computer only.**

```sh
slk chats rules unset <chat> <key>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `key` | required | one of: trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove. |

**Returns:** chat rules — chat_id, title, file, saved, rules; every field: slk commands info chats rules unset

**Example:** `slk personal chats rules unset "Book club" links`

### `slk chats moderate`

judge a group's new messages and members by its rules, and act as they allow

**Changes something in the service.**

```sh
slk chats moderate <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

| Option | What it does |
|---|---|
| `--since-time <time>` | judge what came after this ISO 8601 time, or 2h / 1d ago; the saved point stays. |
| `--dry-run` | judge and plan; do nothing. |
| `--allow-dangerous` | yes to every action whose level in the group's rules is ask. |
| `--max-actions <n>` | at most this many actions in one run; 10 if not given. |

**Returns:** chat moderation — chat_id, rows; every field: slk commands info chats moderate

**Example:** `slk personal chats moderate "Book club" --dry-run`

## `slk contacts`

people this account has a one-to-one chat with

### `slk contacts list`

people you have a one-to-one chat with; name: matches the name, your local alias or the @username, notes: your private notes about them

```sh
slk contacts list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |
| `--order <recent\|name>` | newest conversation first, or alphabetical. Default: `recent`. |

**Returns:** contact — ref, id, name, username, description, last_messaged_at, alias, display_name, and 15 more; every field: slk commands info contacts list

**Next usually:** `slk contacts show <person>`, `slk contacts context <person>`, `slk contacts prepare <person>`

**Example:** `slk personal contacts list --limit 10`

### `slk contacts show`

one person: what the messenger says about them — handles, flags, last seen, phone, when they registered — your alias, the chats you share, how many of their messages the store holds in each, and the earlier names and usernames the store saw them with; --offline answers from the store alone

```sh
slk contacts show <person> [options]
```

| Argument | | What it is |
|---|---|---|
| `person` | required | their id, @username, or part of their name. |

| Option | What it does |
|---|---|
| `--with-notes` | include your private notes, subject to contacts.notes.list permission. |
| `--hide-phone` | leave the phone number out. |

**Returns:** contact — ref, id, name, username, description, last_messaged_at, alias, display_name, and 15 more; every field: slk commands info contacts show

**Next usually:** `slk contacts context <person>`, `slk contacts prepare <person>`, `slk contacts events <person> [query]`

**Example:** `slk personal contacts show "Alex Example"`

### `slk contacts context`

what the store holds about one person, in every messenger linked to them, read only in accounts of this account's scope (personal or work): shared chats, the last messages each way, their recent messages, where others mentioned them — never connects

```sh
slk contacts context <person> [options]
```

| Argument | | What it is |
|---|---|---|
| `person` | required | their id, @username, or part of their name. |

| Option | What it does |
|---|---|
| `--limit <n>` | at most this many messages in each list; 10 if not given. |
| `--since-time <time>` | nothing older than this ISO 8601 time, or 2h / 1d ago. |
| `--chat <chat>` | a chat, by id or name; repeat it for more — then their newest messages in each, 20 unless --limit, short unless -v. |
| `--sync-first` | with --chat, read their newest messages in each from the messenger first. |

**Returns:** contact context — person, accounts, shared, last, recent, mentions, limits, complete, and 4 more; every field: slk commands info contacts context

**Example:** `slk personal contacts context "Alex Example" --limit 10`

### `slk contacts prepare`

before you talk to someone: what contacts context gives, plus the one-to-one chats where they wrote last, open tasks, accepted facts, your notes and their recent meetings, each with its reference; never connects

```sh
slk contacts prepare <person> [options]
```

| Argument | | What it is |
|---|---|---|
| `person` | required | their id, @username, or part of their name. |

| Option | What it does |
|---|---|
| `--limit <n>` | at most this many messages, and items in each section; 10 if not given. |
| `--since-time <time>` | no message or meeting older than this ISO 8601 time, or 2h / 1d ago. |

**Returns:** contact preparation — person, accounts, shared, last, recent, mentions, limits, complete, and 4 more; every field: slk commands info contacts prepare

**Example:** `slk personal contacts prepare Ana`

### `slk contacts events`

everything one person took part in, in every messenger linked to them — messages they wrote or were mentioned in, chats, mail, meetings, tasks — newest first, from the store; only in this account's scope, personal or work, and scope: of the other one is refused; never connects

```sh
slk contacts events <person> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `person` | required | their id, @username, or part of their name. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | at most this many; 50 if not given. |
| `--cursor <cursor>` | go on from where the last page stopped; page.next gives it, with the same filters. |

**Returns:** contact activity — at, subject, subject_id, role, scope, provider, account, chat_id, and 2 more; every field: slk commands info contacts events

**Example:** `slk personal contacts events "Alex Example" --limit 10`

### `slk contacts check`

whether one person looks like a bot, a fake or a spammer: their profile and what they wrote in the store — a hint, never a verdict; the public ban lists cover Telegram only, so nothing is sent

```sh
slk contacts check <person> [options]
```

| Argument | | What it is |
|---|---|---|
| `person` | required | their id, @username, or part of their name. |

| Option | What it does |
|---|---|
| `--no-registries` | do not ask the public ban lists; nothing about them leaves this machine. |

**Returns:** contact check — person, score, reasons, registries, unknown, checked_at; every field: slk commands info contacts check

**Example:** `slk personal contacts check "Alex Example"`

### `slk contacts link`

record that two people in the store are one person — the same name is never enough

**Changes something on this computer only.**

```sh
slk contacts link <person> <other> [options]
```

| Argument | | What it is |
|---|---|---|
| `person` | required | their id, @username, or part of their name. |
| `other` | required | the same in another messenger of the store, as <messenger>:<person> — max:Ana; me: it is you, as zoom:<id> me. |

| Option | What it does |
|---|---|
| `--reason <text>` | why they are one person; an agent's link is a proposal and needs it. |

**Returns:** linked person — uid, name, identities, display_name, proposal; every field: slk commands info contacts link

**Example:** `slk personal contacts link "Alex Example" zoom:101`

### `slk contacts unlink`

undo contacts link for one identity: it is a person of its own again

**Changes something on this computer only.**

```sh
slk contacts unlink <person> [options]
```

| Argument | | What it is |
|---|---|---|
| `person` | required | their id, @username, or part of their name; <messenger>:<person> for another messenger. |

| Option | What it does |
|---|---|
| `--from <person>` | the person it leaves, person:<uid> or person:me; refused when it sits on another. |

**Returns:** linked person — uid, name, identities, display_name, proposal; every field: slk commands info contacts unlink

**Example:** `slk personal contacts unlink "Alex Example" --from person:me`

### `slk contacts lookup`

who has this phone number — asks for it, or reads it from stdin; never an argument

```sh
slk contacts lookup
```

**Returns:** contact lookup — id, name, username; every field: slk commands info contacts lookup

**Example:** `slk personal contacts lookup`

### `slk contacts sync`

take the whole contact list from the messenger into the local store

**Changes something on this computer only.**

```sh
slk contacts sync
```

**Returns:** contact sync — added, changed, known; every field: slk commands info contacts sync

**Example:** `slk personal contacts sync`

### `slk contacts aliases`

a private local display name in the selected account

#### `slk contacts aliases set`

your own name for a person in this account; kept on this machine, never sent

**Changes something on this computer only.**

```sh
slk contacts aliases set <person> <alias>
```

| Argument | | What it is |
|---|---|---|
| `person` | required | the person's id, reference or known name. |
| `alias` | required | the private name to use for this person. |

**Returns:** contact alias — person_id, alias; every field: slk commands info contacts aliases set

**Example:** `slk personal contacts aliases set "Alex Example" "Reading partner"`

#### `slk contacts aliases remove`

drop your local name for a person; their own name shows again

**Changes something on this computer only.**

```sh
slk contacts aliases remove <person>
```

| Argument | | What it is |
|---|---|---|
| `person` | required | the person's id, reference or known name. |

**Returns:** contact alias — person_id, alias; every field: slk commands info contacts aliases remove

**Example:** `slk personal contacts aliases remove "Alex Example"`

### `slk contacts notes`

your private notes on a stored contact, the same in every account that sees them

#### `slk contacts notes list`

every private note you keep on a person, oldest first

```sh
slk contacts notes list <person> [query]
```

| Argument | | What it is |
|---|---|---|
| `person` | required | the person's id, reference or known name. |
| `query` | optional | field:value terms; this list filters by none yet. |

**Returns:** contact note — id, contact, text, revision, created_at, updated_at; every field: slk commands info contacts notes list

**Example:** `slk personal contacts notes list "Alex Example"`

#### `slk contacts notes show`

one private note on a person, with its revision for edit

```sh
slk contacts notes show <person> <id>
```

| Argument | | What it is |
|---|---|---|
| `person` | required | the person's id, reference or known name. |
| `id` | required | the note id from contacts notes list. |

**Returns:** contact note — id, contact, text, revision, created_at, updated_at; every field: slk commands info contacts notes show

**Example:** `slk personal contacts notes show "Alex Example" 1`

#### `slk contacts notes add`

add a private note on a person from stdin or --text-file; never sent

**Changes something on this computer only.**

```sh
slk contacts notes add <person> [options]
```

| Argument | | What it is |
|---|---|---|
| `person` | required | the person's id, reference or known name. |

| Option | What it does |
|---|---|
| `--text-file <path>` | read note text from a file; omitted or - reads stdin. |

**Returns:** contact note — id, contact, text, revision, created_at, updated_at; every field: slk commands info contacts notes add

**Example:** `slk personal contacts notes add "Alex Example" --text-file ./note.txt`

#### `slk contacts notes edit`

replace a note's text; --revision must match the one you read

**Changes something on this computer only.**

```sh
slk contacts notes edit <person> <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `person` | required | the person's id, reference or known name. |
| `id` | required | the note id from contacts notes list. |

| Option | What it does |
|---|---|
| `--text-file <path>` | read note text from a file; omitted or - reads stdin. |
| `--revision <n>` | the revision you read before editing. |

**Returns:** contact note — id, contact, text, revision, created_at, updated_at; every field: slk commands info contacts notes edit

**Example:** `slk personal contacts notes edit "Alex Example" 1 --revision 1 --text-file ./note.txt`

#### `slk contacts notes remove`

delete one private note on a person

**Changes something on this computer only.**

```sh
slk contacts notes remove <person> <id>
```

| Argument | | What it is |
|---|---|---|
| `person` | required | the person's id, reference or known name. |
| `id` | required | the note id from contacts notes list. |

**Returns:** contact note removal — id, person_id, removed; every field: slk commands info contacts notes remove

**Example:** `slk personal contacts notes remove "Alex Example" 1`

## `slk messages`

read and send messages

### `slk messages evidence`

general chat context, newest first, with references, coverage and fingerprints for verification

```sh
slk messages evidence <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

| Option | What it does |
|---|---|
| `--limit <n>` | how many, 1–100. |
| `--cursor <cursor>` | go on from where page.next says the last packet stopped. |

**Returns:** evidence packet — schema_version, id, kind, source, fingerprint, limits, content_bytes, coverage, and 1 more; every field: slk commands info messages evidence

**Example:** `slk personal messages evidence "Book club" --limit 10`

### `slk messages list`

a chat's messages, oldest to newest

```sh
slk messages list <chat> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `query` | optional | where to start or which window, and which topic: id<42, date>=2026-10-01 date<2026-10-20, topic:12. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many. |
| `--cursor <cursor>` | go on from where the last page stopped; page.next gives it. |
| `--transcribe` | turn voice messages not heard yet into text — by the messenger where it can, else by a model on this machine; can take minutes. |
| `--model <model>` | which downloaded speech model hears them, with --transcribe; `models list` shows them. |

**Returns:** message — ref, id, chat_id, sender_id, sender_name, sender_is_me, timestamp, edited_at, and 31 more; every field: slk commands info messages list

**Next usually:** `slk messages transcribe <chat> <message>`, `slk messages links <chat> <message>`, `slk conversations related <chat> <message>`

**Example:** `slk personal messages list "Book club" --limit 20`

### `slk messages send`

send a text message; without [text], the text is read from stdin

**Changes something in the service.**

```sh
slk messages send <chat> [text] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `text` | optional | the message. |

| Option | What it does |
|---|---|
| `--topic <id>` | send to this forum topic. |
| `--reply-to <message>` | answer this message, by its id in the same chat. |
| `--operation-id <id>` | repeat a send whose outcome was unknown, without risking a second copy. |
| `--no-preview` | no preview card for a link in the text. |
| `--md` | read this messenger's Markdown; see its formatting guide for supported syntax. |
| `--file <file>` | attach a file; the text becomes its caption; repeat it for an album. Default: ``. |
| `--photo <file>` | attach a .jpg, .png or .webp as a photo; the text becomes its caption; repeat it for an album. Default: ``. |
| `--as-file` | send each --file as a file to download, a video included. |
| `--voice <file>` | send an Ogg Opus file as a voice message, alone, with no text. |
| `--allow-any-file` | send a file even from credential folders or this CLI's own folders. |
| `--also-to-channel` | with --reply-to or --topic: show the reply in the channel too, as Slack's "Also send to #channel". |

**Returns:** message write — operation_id, message, messages, scheduled_for; every field: slk commands info messages send

**Example:** `slk personal messages send "Book club" "The meeting starts at 10."`

### `slk messages show`

one message, by its chat and id or by its msg: locator

```sh
slk messages show <chat> [message]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…); or a msg: locator, with no message id after it. |
| `message` | optional | the message id. |

**Returns:** message — ref, id, chat_id, sender_id, sender_name, sender_is_me, timestamp, edited_at, and 31 more; every field: slk commands info messages show

**Next usually:** `slk messages transcribe <chat> <message>`, `slk messages links <chat> <message>`, `slk conversations related <chat> <message>`

**Example:** `slk personal messages show "Book club" 101`

### `slk messages context`

a message and what came either side of it, oldest first

```sh
slk messages context <chat> [message] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…); or a msg: locator, with no message id after it. |
| `message` | optional | the message id. |

| Option | What it does |
|---|---|
| `--thread` | the stored reply chain and replies instead of time neighbours; falls back when no graph exists. |
| `--thread-hops <n>` | at most this many links from the hit (default: 8). |
| `--thread-messages <n>` | at most this many messages in each thread context (default: 50). |
| `--thread-bytes <n>` | at most this many bytes of whole messages and links in each context (default: 65536). |
| `--thread-within <duration>` | messages within this long either side of the hit (default: 1d). |
| `--before-n <n>` | how many before it. Default: `5`. |
| `--after-n <n>` | how many after it. Default: `5`. |

**Returns:** message context — ref, id, chat_id, sender_id, sender_name, sender_is_me, timestamp, edited_at, and 42 more; every field: slk commands info messages context

**Example:** `slk personal messages context "Book club" 101 --before-n 3 --after-n 3`

### `slk messages download`

save a message's photos, files, videos and voice notes to a folder — or a whole chat's with --all; with --offline, copy the ones this computer already holds, one by --attachment

**Changes something on this computer only.**

```sh
slk messages download <chat> [message] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…); or a msg: locator, with no message id after it. |
| `message` | optional | the message id; left out with --all or a locator. |

| Option | What it does |
|---|---|
| `--output-dir <dir>` | where to save them; created if missing. Default: `.`. |
| `--attachment <n>` | which file of the message, from 1; needed when it has more than one. |
| `--all` | every file of the chat, newest first; run it again to continue where it stopped. |
| `--pause <duration>` | with --all, a pause between pages, to stay under the provider's limits. Default: `1s`. |
| `--extract` | read text layers from the files this download maps into the local content index. |

**Returns:** message download — files, extraction, complete, batch, chat, saved, existing, stopped; every field: slk commands info messages download

**Example:** `slk personal messages download "Book club" 101 --output-dir ./downloads`, `slk personal messages download msg:slack/me/500/101 --attachment 1 --offline`

### `slk messages transcribe`

a voice message as text — by Slack where it can, else by a model on this machine

```sh
slk messages transcribe <chat> <message> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `message` | required | the id of a voice message. |

| Option | What it does |
|---|---|
| `--local` | use the model on this machine, never the messenger. |
| `--model <model>` | which downloaded model; implies --local (`models list`). |

**Returns:** message transcript — message_id, text, pending, via, model; every field: slk commands info messages transcribe

**Example:** `slk personal messages transcribe "Book club" 101`

### `slk messages edit`

change the text of your own message; the other side may have read it already

**Changes something in the service.**

```sh
slk messages edit <chat> <message> [text] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `message` | required | the id of your own message. |
| `text` | optional | the new text; without it, read from stdin. |

| Option | What it does |
|---|---|
| `--md` | read this messenger's Markdown; see its formatting guide for supported syntax. |

**Returns:** message write — operation_id, message, messages, scheduled_for; every field: slk commands info messages edit

**Example:** `slk personal messages edit "Book club" 101 "The meeting starts at 11."`

### `slk messages delete`

delete messages for you only; with --for-everyone, for everyone in the chat

**Changes something in the service.**

```sh
slk messages delete <chat> <message> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `message` | required | the message ids, by spaces or commas, at most 10. |

| Option | What it does |
|---|---|
| `--for-everyone` | delete for everyone in the chat, not only for you — they cannot get it back. |
| `--allow-dangerous` | go ahead without the question an ask level puts before a deletion. |

**Returns:** message deletion — operation_id, chat_id, deleted, for_everyone; every field: slk commands info messages delete

**Example:** `slk personal messages delete "Book club" 101`

### `slk messages pin`

pin a message in a chat, quietly unless --notify

**Changes something in the service.**

```sh
slk messages pin <chat> <message> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `message` | required | the message id. |

| Option | What it does |
|---|---|
| `--notify` | tell the chat's members about the pin. |

**Returns:** message pin — operation_id, chat_id, message_id, pinned; every field: slk commands info messages pin

**Example:** `slk personal messages pin <chat> <message>`, `slk personal messages pin <chat> <message> --notify`

### `slk messages unpin`

unpin a message in a chat

**Changes something in the service.**

```sh
slk messages unpin <chat> <message>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `message` | required | the message id. |

**Returns:** message pin — operation_id, chat_id, message_id, pinned; every field: slk commands info messages unpin

**Example:** `slk personal messages unpin <chat> <message>`

### `slk messages link`

a message permalink when supported, and its account-scoped locator

```sh
slk messages link <chat> [message]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…); or a msg: locator, with no message id after it. |
| `message` | optional | the message id. |

**Returns:** message link — ref, url, access, reason, files; every field: slk commands info messages link

**Next usually:** `slk messages transcribe <chat> <message>`, `slk messages links <chat> <message>`, `slk conversations related <chat> <message>`

**Example:** `slk personal messages link "Book club" 101`

### `slk messages links`

why a message is in its conversation: each link it has, and the chain of answers back to the start

```sh
slk messages links <chat> <message>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `message` | required | the message id. |

**Returns:** message links — chat, message, links, chain; every field: slk commands info messages links

**Example:** `slk personal messages links "Book club" 101`

### `slk messages sync`

bring a chat's history in the local store up to date, newest first; run it again to continue; --all syncs every chat; with --json, stderr carries progress lines: {"event":"progress","step":"sync","chats","chats_done","fetched"}, counts only

**Changes something on this computer only.**

```sh
slk messages sync [chat] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | optional | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

| Option | What it does |
|---|---|
| `--all` | every chat, most recently active first — what search needs; the last 90d unless --since-time or --last; muted chats only with --with-muted or history_muted true. |
| `--limit <n>` | at most this many messages in this run, per chat with --all; 2000 if not given. |
| `--page-size <n>` | how many messages one request asks for; 200 if not given. |
| `--pause <duration>` | pause between pages, to stay under the provider's limits. Default: `1s`. |
| `--since-time <time>` | stop once it reaches messages older than this: ISO 8601, or 2h / 1d ago. |
| `--last <n>` | stop once the newest n messages are held. |
| `--catch-up` | prepare local search after this run; overrides search_catch_up. |
| `--no-catch-up` | skip local preparation after this run. |
| `--catch-up-chunks <n>` | at most this many local vector chunks. |
| `--catch-up-messages <n>` | skip a graph rebuild larger than this many messages. |
| `--catch-up-time <duration>` | local preparation time budget, 30s by default. |
| `--full-history` | read and keep this chat's history in full from now on, past the history limits (history_* settings). |
| `--with-muted` | with --all: also read the chats the owner muted, as history_muted true does. |
| `--background` | run as a job that outlives this command; `store jobs show` follows it. |
| `--dry-run` | only estimate how many messages, requests and minutes a full fetch would still take — from the store, no request. |

**Returns:** message sync — chat, held, ranges, missing, requests, runs, seconds, fetched, and 17 more; every field: slk commands info messages sync

**Example:** `slk personal messages sync "Book club" --last 100`

## `slk reactions`

react to messages

### `slk reactions add`

put your reaction on a message; it replaces the one you had

**Changes something in the service.**

```sh
slk reactions add <chat> <message> <emoji>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `message` | required | the message id. |
| `emoji` | required | one emoji, for example 👍. |

**Returns:** reaction change — operation_id, chat_id, message_id, reaction; every field: slk commands info reactions add

**Example:** `slk personal reactions add "Book club" 101 👍`

### `slk reactions remove`

take your reaction off a message

**Changes something in the service.**

```sh
slk reactions remove <chat> <message>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `message` | required | the message id. |

**Returns:** reaction change — operation_id, chat_id, message_id, reaction; every field: slk commands info reactions remove

**Example:** `slk personal reactions remove "Book club" 101`

## `slk models`

models that run on this machine

### `slk models keys`

API keys for embedding and analysis providers

#### `slk models keys set`

store a key, typed at a hidden prompt or piped on stdin — never as an argument

**Changes something on this computer only.**

```sh
slk models keys set <provider>
```

| Argument | | What it is |
|---|---|---|
| `provider` | required | openai, anthropic, or the host of a --base-url server that wants a key. |

**Returns:** model key stored — provider, stored; every field: slk commands info models keys set

**Example:** `slk personal models keys set openai`

#### `slk models keys remove`

forget a stored key

**Changes something on this computer only.**

```sh
slk models keys remove <provider>
```

| Argument | | What it is |
|---|---|---|
| `provider` | required | openai, anthropic, or a server's host. |

**Returns:** model key removed — provider, removed; every field: slk commands info models keys remove

**Example:** `slk personal models keys remove openai`

### `slk models chats`

whether chat text may go to a model off this computer: allowed, ask or denied

#### `slk models chats show`

whether chat text may go to a model outside this computer, and since when

```sh
slk models chats show
```

**Returns:** chat sending — mode, meaning, since, changed; every field: slk commands info models chats show

**Example:** `slk personal models chats show`

#### `slk models chats set`

allowed: no yes needed; ask: --yes needed, an agent may pass it; denied: refused even with --yes. Only you make it less strict

**Changes something on this computer only.**

```sh
slk models chats set <mode> [options]
```

| Argument | | What it is |
|---|---|---|
| `mode` | required | allowed, ask or denied. |

| Option | What it does |
|---|---|
| `--from-app` | you did this in WireCat Desktop. |

**Returns:** chat sending — mode, meaning, since, changed; every field: slk commands info models chats set

**Example:** `slk personal models chats set allowed`, `slk personal models chats set ask`, `slk personal models chats set denied`

### `slk models list`

speech, embedding and reranker models: downloaded or not, each kind's default

```sh
slk models list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** model — id, kind, title, languages, size_bytes, downloaded, default, path, and 6 more; every field: slk commands info models list

**Next usually:** `slk models download <model>`, `slk models set <model>`

**Example:** `slk personal models list`, `slk personal models list kind:audio`

### `slk models download`

download and verify one speech, embedding or reranker model: tens to hundreds of MB, each size in models list

**Reads from an outside service.**

```sh
slk models download <model> [options]
```

| Argument | | What it is |
|---|---|---|
| `model` | required | a model id from models list. |

| Option | What it does |
|---|---|
| `--accept-terms` | no longer needed; kept so older scripts still run. |

**Returns:** model — id, kind, title, languages, size_bytes, downloaded, default, path, and 6 more; every field: slk commands info models download

**Next usually:** `slk models set <model>`

**Example:** `slk personal models download embeddinggemma`, `slk personal models download mmarco`

### `slk models set`

make a downloaded text model the one every embed and every search by meaning uses, in every WireCat CLI. Each model keeps its own vectors: the next syncs embed what the new one lacks, and switching back is instant

**Changes something on this computer only.**

```sh
slk models set <model>
```

| Argument | | What it is |
|---|---|---|
| `model` | required | a downloaded text model id from models list. |

**Returns:** model chosen — id, kind, title, languages, size_bytes, downloaded, default, path, and 9 more; every field: slk commands info models set

**Next usually:** `slk models download <model>`

**Example:** `slk personal models set e5-large`

### `slk models add`

add an ONNX embedding model from Hugging Face, pinned and checked by sha256

**Reads from an outside service.**

```sh
slk models add <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the id to give it: a-z, 0-9, . _ -. |

| Option | What it does |
|---|---|
| `--payload <json>` | where the model is and how to run it, as JSON (below). |

**Returns:** model — id, kind, title, languages, size_bytes, downloaded, default, path, and 6 more; every field: slk commands info models add

**Next usually:** `slk models download <model>`, `slk models set <model>`

**Example:** `slk personal models add e5-base --payload '{"repository":"Xenova/multilingual-e5-base","onnx":"onnx/model_quantized.onnx","dims":768,"pooling":"mean","prefix":{"query":"query: ","passage":"passage: "}}'`

## `slk inbox`

other people's unread messages in every chat; --new for what arrived since the last check

```sh
slk inbox [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | from when: date>2h, date>2026-10-01; the saved point stays put. |

| Option | What it does |
|---|---|
| `--new` | what arrived since the last check, each message once — for scheduled runs. |
| `--limit <n>` | at most this many per chat, the newest. |
| `--all` | muted and archived chats too — left out unless they mention you or reply to you. |
| `--transcribe` | turn voice messages not heard yet into text — by the messenger where it can, else by a model on this machine; can take minutes. |
| `--model <model>` | which downloaded speech model hears them, with --transcribe; `models list` shows them. |

**Returns:** message summary — ref, chat_id, timestamp, sender_name, sender_is_me, outgoing, text, attachments, and 4 more; every field: slk commands info inbox

**Next usually:** `slk messages transcribe <chat> <message>`, `slk messages links <chat> <message>`, `slk conversations related <chat> <message>`

**Example:** `slk personal inbox --limit 10`

## `slk review`

every message, yours too, in chats that changed since a point — for reviewing who owes what

```sh
slk review [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | where the last review ended and which chat: date>2h, chat:"Book club"; 3 days ago if no date. |

| Option | What it does |
|---|---|
| `--unanswered [duration]` | only questions to you or a group's admins that nobody answered, asked at least this long ago — 4h, 1d; 24h if not given. |
| `--all` | muted and archived chats too — left out unless they mention you or reply to you. |
| `--transcribe` | turn voice messages not heard yet into text — by the messenger where it can, else by a model on this machine; can take minutes. |
| `--model <model>` | which downloaded speech model hears them, with --transcribe; `models list` shows them. |
| `--new` | what changed since the last `review --new`, a point per chat — for scheduled runs. |

**Returns:** message summary — ref, chat_id, timestamp, sender_name, sender_is_me, outgoing, text, attachments, and 4 more; every field: slk commands info review

**Next usually:** `slk messages transcribe <chat> <message>`, `slk messages links <chat> <message>`, `slk conversations related <chat> <message>`

**Example:** `slk personal review "date>2h"`

## `slk store`

the local store of messages

### `slk store status`

per chat: messages stored, the oldest and newest, and the stretches held completely

```sh
slk store status [chat]
```

| Argument | | What it is |
|---|---|---|
| `chat` | optional | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

**Returns:** store chat status — chat_id, title, kind, messages, oldest_at, newest_at, last_stored_at, held; every field: slk commands info store status

**Example:** `slk personal store status "Book club"`

### `slk store chats`

the account's chats as the store holds them

#### `slk store chats status`

over this account's searchable chats of every kind, channels included: fetched (back to the first message, up to date, no gaps), partial, never (no fetch recorded and no message held), and the oldest message held; reads the store only

```sh
slk store chats status
```

**Returns:** chat coverage — chats, fetched, partial, never, oldest_message_at; every field: slk commands info store chats status

**Example:** `slk personal store chats status`

### `slk store gaps`

inspect recorded interior coverage gaps and explicitly fetch them

#### `slk store gaps show`

local coverage plan; missing message ids alone do not imply missing history

```sh
slk store gaps show <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

**Returns:** store gap plan — version, scope, account, chat, ordering, held, gaps, unknown, and 2 more; every field: slk commands info store gaps show

**Example:** `slk personal store gaps show "Book club"`

#### `slk store gaps repair`

fetch bounded interior gaps and recheck coverage; never delete unseen messages

**Changes something on this computer only.**

```sh
slk store gaps repair <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

| Option | What it does |
|---|---|
| `--limit <n>` | total messages in this repair, 500 by default. |
| `--max-gaps <n>` | at most this many gaps, 5 by default. |
| `--repair-time <duration>` | time budget for the repair, 30s by default. Default: `30s`. |
| `--page-size <n>` | messages per provider page. |
| `--pause <duration>` | provider pause between pages. Default: `1s`. |
| `--fingerprint <hash>` | refuse if this previously inspected coverage plan changed. |
| `--catch-up` | prepare local search after repair; overrides search_catch_up. |
| `--no-catch-up` | skip local search preparation after repair. |
| `--catch-up-chunks <n>` | maximum local chunks prepared. |
| `--catch-up-messages <n>` | maximum stored messages read for preparation. |
| `--catch-up-time <duration>` | preparation time within the repair's remaining budget. |
| `--background` | repair as an existing store job; inspect store jobs show. |

**Returns:** store gap repair — job, pid, chat, log, version, scope, before, after, and 6 more; every field: slk commands info store gaps repair

**Example:** `slk personal store gaps repair "Book club" --limit 100`

### `slk store jobs`

background sync jobs

#### `slk store jobs list`

background sync jobs, newest first

```sh
slk store jobs list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

**Returns:** job — id, chat, state, pid, started_at, fetched, finished_at, message_limit, and 5 more; every field: slk commands info store jobs list

**Example:** `slk personal store jobs list`

#### `slk store jobs show`

one background job — the newest when none is named — and what the store now holds of its chat

```sh
slk store jobs show [job]
```

| Argument | | What it is |
|---|---|---|
| `job` | optional | the job id `messages sync --background` printed. |

**Returns:** store job details — chat, state, pid, started_at, fetched, job, profile, progress, and 11 more; every field: slk commands info store jobs show

**Example:** `slk personal store jobs show`

#### `slk store jobs cancel`

stop a running background job after its current page; a later sync resumes where it stopped

**Changes something on this computer only.**

```sh
slk store jobs cancel <job>
```

| Argument | | What it is |
|---|---|---|
| `job` | required | the job id. |

**Returns:** store job cancel — job, cancelled; every field: slk commands info store jobs cancel

**Example:** `slk personal store jobs cancel job-101`

#### `slk store jobs retry`

start a partial, failed or died job again, as a new job; the sync resumes where the store stopped

**Changes something on this computer only.**

```sh
slk store jobs retry [job] [options]
```

| Argument | | What it is |
|---|---|---|
| `job` | optional | the job id. |

| Option | What it does |
|---|---|
| `--failed` | every chat whose newest job partial, failed or died. |

**Returns:** store job retry — job, pid, chat, log, retried, error; every field: slk commands info store jobs retry

**Example:** `slk personal store jobs retry --failed`

#### `slk store jobs clear`

forget finished jobs and remove their logs; a running job is kept

**Changes something on this computer only.**

```sh
slk store jobs clear
```

**Returns:** store job clear — cleared; every field: slk commands info store jobs clear

**Example:** `slk personal store jobs clear`

### `slk store export`

a chat's stored messages, oldest first: --jsonl one message per line, --json the list envelope of messages; never asks the messenger

**Changes something on this computer only.**

```sh
slk store export [chat] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | optional | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…); several with --output-dir. |

| Option | What it does |
|---|---|
| `--format <format>` | jsonl: one message per line, the default with --output; markdown: a transcript with a heading per day, replies and forwards quoted. |
| `--since-time <time>` | only from this ISO 8601 time, or 30m / 2h / 1d ago, on. |
| `--output <file>` | write JSON lines, or the transcript, to this new file, readable only by you. |
| `--output-dir <dir>` | write into this folder, a file per chat and a manifest; run again on it for only what changed since. |
| `--include <kinds>` | with --output-dir: every stored chat of these kinds, comma-separated: dialog, group, channel, saved. |
| `--all` | with --output-dir: every stored chat of this account. |
| `--encrypt` | compress and encrypt with a password, typed at a hidden prompt or piped on stdin; it is never kept — lose it and the file cannot be opened. |

**Returns:** store export — ref, id, chat_id, sender_id, sender_name, sender_is_me, timestamp, edited_at, and 36 more; every field: slk commands info store export

**Example:** `slk personal store export "Book club" --output ./messages.jsonl`

### `slk store clear`

delete from the store the chats this account has left, with their messages

**Changes something on this computer only.**

```sh
slk store clear [options]
```

| Option | What it does |
|---|---|
| `--left` | the chats this account has left — the only thing this clears. |
| `--allow-dangerous` | yes, delete — it cannot be undone, and a chat you left cannot be fetched again. |
| `--dry-run` | list the chats it would delete, and delete nothing. |

**Returns:** store clear — cleared, chats, messages, left, dry_run; every field: slk commands info store clear

**Example:** `slk personal store clear --left --dry-run`

### `slk store import`

load a JSON file marked "synthetic": true (account, people, chats, members, messages) into this profile's account in the local store, as a sync would save them; the same file twice adds nothing and a changed message is updated in place. Refuses the owner's real store. Without --yes, says what it would load and changes nothing

**Changes something on this computer only.**

```sh
slk store import <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | the JSON file to load. |

**Returns:** store import — store, profile, account, imported, file, added; every field: slk commands info store import

**Example:** `slk personal store import ./synthetic-chats.json --yes`

### `slk store info`

the store file: where it is, its size, its schema against the one this tool speaks, which tools used it and how many rows it holds, by provider, chat kind, account, year (UTC) and attachment kind, over every account; changes nothing

```sh
slk store info
```

**Returns:** store info — path, exists, schema, opens, error, bytes, journal_mode, pages, and 12 more; every field: slk commands info store info

**Example:** `slk personal store info`

### `slk store check`

whether the store is healthy — integrity, search indexes, disk, and which chats are behind

```sh
slk store check
```

**Returns:** store check — path, exists, ok, opens, error, checks, schema, integrity, and 11 more; every field: slk commands info store check

**Example:** `slk personal store check`

### `slk store migrate`

bring the store up to this build's schema, then normalize, index and stem the messages and notes stored before it

**Changes something on this computer only.**

```sh
slk store migrate
```

**Returns:** store migration — path, exists, from, to, normalized, indexed, terms, stemmed, and 1 more; every field: slk commands info store migrate

**Example:** `slk personal store migrate`

### `slk store rebuild`

rebuild the word index, its typo vocabulary, the stems, the files' word index, the notes' indexes and who took part in what, from what is stored, and drop the vectors no stored text uses; loses nothing

**Changes something on this computer only.**

```sh
slk store rebuild
```

**Returns:** store reindex — path, exists, normalized, indexed, terms, stemmed, notes_indexed, file_texts, and 2 more; every field: slk commands info store rebuild

**Example:** `slk personal store rebuild`

### `slk store backup`

copy the store into a new file, while it is in use; never overwrites a file

**Changes something on this computer only.**

```sh
slk store backup <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | the new file. |

| Option | What it does |
|---|---|
| `--encrypt` | compress and encrypt with a password, typed at a hidden prompt or piped on stdin; it is never kept — lose it and the file cannot be opened. |

**Returns:** store backup — path, from, bytes, schema, rows, encrypted; every field: slk commands info store backup

**Example:** `slk personal store backup ./backup.db`

### `slk store restore`

put a backup in place of the store; the store it replaces is kept beside it, never deleted. Given a rollback copy (backups/<store>-rollback-schema-<version>-<time>.db, kept for a day before an upgrade older tools cannot open), put its tables back in the store and return it to that version instead

**Changes something on this computer only.**

```sh
slk store restore <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | a file `store backup` wrote, or a rollback copy; one written with --encrypt asks for its password. |

**Returns:** store restore — path, restored_from, kept_at, schema, rolled_back, was, tables, rebuilt, and 1 more; every field: slk commands info store restore

**Example:** `slk personal store restore ./backup.db`

### `slk store decrypt`

open a file written with --encrypt into a new file; asks for its password

**Changes something on this computer only.**

```sh
slk store decrypt <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | a file `store backup --encrypt` or `store export --encrypt` wrote. |

| Option | What it does |
|---|---|
| `--output <file>` | the new file, readable only by you. |

**Returns:** store decrypt — path, from, bytes; every field: slk commands info store decrypt

**Example:** `slk personal store decrypt ./backup.enc --output ./restored.db`

### `slk store repair`

bring every table to this build's shape, deleting nothing: a table of the wrong shape is kept as a copy beside a new one

**Changes something on this computer only.**

```sh
slk store repair [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | say what it would do, and change nothing. |

**Returns:** store repair — path, exists, dry_run, repaired, indexes_created, triggers_created, mismatches, foreign_key_violations, and 1 more; every field: slk commands info store repair

**Example:** `slk personal store repair --dry-run`

### `slk store reset`

back the store up beside itself, then delete it and start an empty one at this build's schema; asks first, or --yes

**Changes something on this computer only.**

```sh
slk store reset [options]
```

| Option | What it does |
|---|---|
| `--no-backup` | delete the store without backing it up first. |
| `--dry-run` | list every table it would empty, with its rows, and delete nothing. |

**Returns:** store reset — path, exists, reset, dry_run, files, bytes, schema, tables, and 4 more; every field: slk commands info store reset

**Example:** `slk personal store reset`

### `slk store copies`

the tables `store repair` kept as copies

#### `slk store copies delete`

delete one copy `store repair` kept, named exactly; refuses any other table

**Changes something on this computer only.**

```sh
slk store copies delete <name>
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the copy's name, as `store repair` printed it. |

**Returns:** store copy removal — path, deleted; every field: slk commands info store copies delete

**Example:** `slk personal store copies delete messages_copy_1`

### `slk store tables`

the tables of the local store

#### `slk store tables list`

every table of the local archive: its kind (data, search index, part of a search index, internal) and its rows, a search index's rows not counted; --full adds each table's size on disk, which reads the whole file (about ten seconds for 3 GB); changes nothing

```sh
slk store tables list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** store table — name, kind, rows, bytes; every field: slk commands info store tables list

**Example:** `slk personal store tables list`, `slk personal store tables list kind:data`, `slk personal store tables list --full --json`

### `slk store recover`

check every page and search index of the store, say what is damaged, what it means and the commands that recover it; changes nothing

#### `slk store recover run`

copy every readable row into a new file with the sqlite3 program, rebuild the search indexes, mentions and vector index, check it, and put it in place of the store; the damaged file is kept beside it. Refuses while a WireCat timer or process has the store

**Changes something on this computer only.**

```sh
slk store recover run
```

**Example:** `slk personal store recover run`

## `slk conversations`

the conversations inside a chat, found in the stored messages by replies, mentions and who wrote next

### `slk conversations list`

a chat's conversations, the newest first: when, how many messages, how many people

```sh
slk conversations list <chat> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many. |

**Returns:** conversation — id, chat, first_message, started_at, ended_at, messages_count, senders_count, built_at, and 1 more; every field: slk commands info conversations list

**Example:** `slk personal conversations list "Book club"`

### `slk conversations show`

one conversation's messages, oldest first — by its id, or the one a message is in

```sh
slk conversations show <conversation> [message]
```

| Argument | | What it is |
|---|---|---|
| `conversation` | required | a conversation id from `conversations list`; or a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…), with a message. |
| `message` | optional | a message id in that chat: show the conversation it is in. |

**Returns:** conversation details — id, chat, first_message, started_at, ended_at, messages_count, senders_count, built_at, and 40 more; every field: slk commands info conversations show

**Example:** `slk personal conversations show "Book club" 101`

### `slk conversations related`

the conversations nearest in meaning to the one a message is in, in every built chat, best first — from the vectors `conversations embed` stored; runs no model

```sh
slk conversations related <chat> <message> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `message` | required | a message id in that chat. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many. |
| `--model <model>` | local: a model id from `models list` (default: embeddinggemma); remote: the provider's model. |
| `--embedding-provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |

**Returns:** conversation hit — summary, chunk, score, by, stale, source, locator, matched_in, and 3 more; every field: slk commands info conversations related

**Example:** `slk personal conversations related "Book club" 101`

### `slk conversations status`

how fresh each built chat's conversations and vectors are: messages the build has not seen, chunks with a current, stale or missing vector

```sh
slk conversations status [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | only this chat: a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--model <model>` | local: a model id from `models list` (default: embeddinggemma); remote: the provider's model. |
| `--embedding-provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |

**Returns:** conversation readiness — chat, model, state, graph, pending, vectors; every field: slk commands info conversations status

**Example:** `slk personal conversations status`

### `slk conversations batches`

windows of a chat for your own AI agent to link: which earlier message each one answers

#### `slk conversations batches status`

how many messages still wait for an answer, in how many batches, and how much text

```sh
slk conversations batches status [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--size <n>` | messages to answer per batch, 10–200; 50 by default. |

**Returns:** conversation batch status — chat, messages, characters, batches, tokens_estimate; every field: slk commands info conversations batches status

**Example:** `slk personal conversations batches status --chat "Book club"`

#### `slk conversations batches show`

the next window to answer, with the messages before it; message text goes to stdout only

```sh
slk conversations batches show [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--size <n>` | messages to answer per batch, 10–200; 50 by default. |

**Returns:** conversation batch — batch, chat, messages, remaining; every field: slk commands info conversations batches show

**Example:** `slk personal conversations batches show --chat "Book club"`

### `slk conversations links`

message links and the conversations derived from them

#### `slk conversations links rebuild`

find a chat's conversations in what the store holds, replacing the last build; without --chat, every chat that changed since its build and every group never built; never asks the messenger

**Sends text to an outside service.**

```sh
slk conversations links rebuild [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--analyze` | link batches using the configured analysis provider; requires --chat. A model outside this computer follows the `models chats` setting: under ask, a yes is remembered for this chat and provider. |
| `--yes` | send this chat's text to the analysis model outside this computer, when `models chats` is ask. |
| `--analysis-provider <provider>` | analysis: agent, openai or anthropic. |
| `--model <model>` | analysis model; overrides models.analysis.model. |
| `--base-url <url>` | analysis API endpoint; overrides models.analysis.base_url. |
| `--size <n>` | analysis answer messages per batch, 10–200; default 50. |
| `--max-tokens <n>` | analysis input/output reservation cap per run; default 100000. |
| `--max-chats <n>` | at most this many chats in one run; 20 if not given. |

**Returns:** conversation build — chat, messages, links, conversations, built_at, rules_version, model, model_available, and 10 more; every field: slk commands info conversations links rebuild

**Example:** `slk personal conversations links rebuild --chat "Book club"`

#### `slk conversations links add`

store your agent's answer to a batch, read as JSON from stdin: { "model", "answers": [{ "message", "parent", "confidence" }] }; all or nothing

**Changes something on this computer only.**

```sh
slk conversations links add [options]
```

| Option | What it does |
|---|---|
| `--batch <id>` | the batch id `conversations batches show` printed. |

**Returns:** conversation change — chat, stored, cleared; every field: slk commands info conversations links add

**Example:** `slk personal conversations links add --batch "$batch"`

#### `slk conversations links clear`

drop your agent's answers for a chat, or only one model's; messages are never touched

**Changes something on this computer only.**

```sh
slk conversations links clear [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--answer-model <model>` | only the stored answers this model gave. |

**Returns:** conversation change — chat, stored, cleared; every field: slk commands info conversations links clear

**Example:** `slk personal conversations links clear --chat "Book club"`

### `slk conversations embeddings`

stored conversation vectors

#### `slk conversations embeddings status`

how many chunks of a chat have a vector of the model, how many are left, and what is left costs

```sh
slk conversations embeddings status [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--model <model>` | local: a model id from `models list` (default: embeddinggemma); remote: the provider's model. |
| `--embedding-provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |

**Returns:** conversation embedding status — chat, model, chunks, embedded, left, estimate_seconds, tokens_at_most, price_at_most; every field: slk commands info conversations embeddings status

**Example:** `slk personal conversations embeddings status --chat "Book club"`

#### `slk conversations embeddings clear`

drop a chat's conversation and message vectors, or only one model's; messages and conversations are never touched

**Changes something on this computer only.**

```sh
slk conversations embeddings clear [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--model <model>` | local: a model id from `models list` (default: embeddinggemma); remote: the provider's model. |
| `--embedding-provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |

**Returns:** conversation change — chat, stored, cleared; every field: slk commands info conversations embeddings clear

**Example:** `slk personal conversations embeddings clear --chat "Book club"`

### `slk conversations rebuild`

build, then embed with the model on this machine, the chats that changed since their build and the group chats never built — or only --chat; with the default model, also each message on its own, which `search messages --discover` reads; bounded per run, so run it again for the rest; never asks the messenger, downloads no model and sends no text anywhere

**Changes something on this computer only.**

```sh
slk conversations rebuild [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--max-chats <n>` | at most this many chats in one run; 20 if not given. |
| `--max-chunks <n>` | at most this many chunks embedded in one run; 2000 if not given. |

**Returns:** conversation preparation — model, model_available, built, embedded, left, messages; every field: slk commands info conversations rebuild

**Example:** `slk personal conversations rebuild --max-chats 5`

### `slk conversations consents`

remembered analysis permissions for this account's chats and provider endpoints

#### `slk conversations consents list`

which chats and provider endpoints you allowed to analyse, and when

```sh
slk conversations consents list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** analysis consent — chat, provider, at; every field: slk commands info conversations consents list

**Example:** `slk personal conversations consents list`

#### `slk conversations consents remove`

forget analysis permissions so the next analysis asks again

**Changes something on this computer only.**

```sh
slk conversations consents remove [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | revoke only this chat's consents; defaults to every chat. |
| `--consent-provider <identity>` | exact provider identity from consents list; defaults to every provider. |

**Returns:** analysis consent revocation — revoked; every field: slk commands info conversations consents remove

**Example:** `slk personal conversations consents remove --chat "Book club"`

### `slk conversations embed`

compute a vector for each chunk of a chat's conversations for search by meaning — on this machine, or with --embedding-provider through a service and your key; resumes where it stopped; without --chat, every built chat with chunks left, on this machine only

**Sends text to an outside service.**

```sh
slk conversations embed [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--model <model>` | local: a model id from `models list` (default: embeddinggemma); remote: the provider's model. |
| `--embedding-provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |
| `--threads <n>` | local: threads in all (default: min(8, cores)). |
| `--concurrency <n>` | remote: requests at once (default: 4). |
| `--max-tokens <n>` | remote: stop before a run that could send more tokens than this. |
| `--yes` | remote: send the chunks to the model outside this computer, when `models chats` is ask. |
| `--max-chats <n>` | at most this many chats in one run; 20 if not given. |
| `--max-chunks <n>` | at most this many chunks embedded in one run; 2000 if not given, and no limit with --chat. |

**Returns:** conversation embedding — chat, model, embedded, skipped, model_available, built, left, messages; every field: slk commands info conversations embed

**Example:** `slk personal conversations embed --chat "Book club"`

## `slk attachments`

the files of stored messages: their text in the local store, where search finds it

### `slk attachments extract`

read the text of downloaded files — text, PDF/DOCX text layers, ODT/ODS/XLSX/PPTX/EPUB — into the local store, where search finds them

**Changes something on this computer only.**

```sh
slk attachments extract [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | only this chat's files; a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--from-dir <dir>` | match files in this nonrecursive directory; needs --chat. |
| `--cursor <cursor>` | continue from the cursor returned by a bounded extraction. |
| `--download` | first save the files no download saved yet, from the messenger, into --output-dir. |
| `--output-dir <dir>` | with --download, where to save them; created if missing. |
| `--limit <n>` | read at most this many files; run it again to continue. |
| `--ocr` | explicitly call models.ocr for bulk image and scanned-PDF text extraction. |
| `--concurrency <n>` | remote: requests at once (default: 4). |

**Returns:** attachment extraction — extracted, failed, needs_agent, complete, unchanged, not_downloaded, unsupported, engines_missing, and 15 more; every field: slk commands info attachments extract

**Example:** `slk personal attachments extract --chat "Book club" --limit 10`

### `slk attachments list`

files of stored messages, newest first: where each was saved and whether its text is held — never the text

```sh
slk attachments list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

**Returns:** attachment — kind, message, position, url, name, title, mime, size, and 8 more; every field: slk commands info attachments list

**Example:** `slk personal attachments list --limit 10`

### `slk attachments show`

read a bounded chunk of one retained attachment; JSON includes base64 bytes

```sh
slk attachments show <chat> [message] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…); or a msg: locator alone. |
| `message` | optional | the message id. |

| Option | What it does |
|---|---|
| `--attachment <n>` | file position from 1; required for several files. |
| `--page <n>` | render one PDF page as PNG, from 1; optional unpdf/canvas, no OCR. |
| `--offset-bytes <n>` | byte offset from 0. |
| `--chunk-bytes <n>` | bytes to return, 1–1048576 (default524288). |
| `--expected-fingerprint <hash>` | require the whole file SHA-256 from the preceding chunk. |

**Returns:** attachment bytes — ref, attachment, name, mime_type, total_bytes, sha256, offset_bytes, read_bytes, and 4 more; every field: slk commands info attachments show

**Example:** `slk personal attachments show "Book club" 101 --attachment 1`

### `slk attachments update`

keep the text an agent read from a file — a scan, a photo — so search finds it; nothing is sent

**Changes something on this computer only.**

```sh
slk attachments update <chat> [message] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…); or a msg: locator, with no message id after it. |
| `message` | optional | the message id. |

| Option | What it does |
|---|---|
| `--attachment <n>` | which file of the message, from 1; needed when it has more than one. |
| `--text-file <path>` | read the text from this file; - or none reads stdin. |

**Returns:** attachment text change — ref, attachment, origin, chars, replaced, extractor, text; every field: slk commands info attachments update

**Example:** `slk personal attachments update "Book club" 101 --text-file ./transcript.txt`

### `slk attachments download`

archive media from selected chats; verify and keep existing copies

**Changes something on this computer only.**

```sh
slk attachments download <dir> [options]
```

| Argument | | What it is |
|---|---|---|
| `dir` | required | archive directory; created if missing. |

| Option | What it does |
|---|---|
| `--chat <chat>` | only this chat; repeat for more; a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). Default: ``. |
| `--since-time <time>` | include messages from this time: ISO 8601, a date, today, yesterday, or 2h, 7d ago. |
| `--pause <duration>` | pause between history pages. Default: `1s`. |

**Returns:** media archive — directory, chats, saved, existing, complete; every field: slk commands info attachments download

**Example:** `slk personal attachments download ./media-archive`

### `slk attachments check`

rehash all archived files without connecting to the messenger

```sh
slk attachments check <dir>
```

| Argument | | What it is |
|---|---|---|
| `dir` | required | archive directory. |

**Returns:** media archive check — valid, checked, files; every field: slk commands info attachments check

**Example:** `slk personal attachments check ./media-archive`

### `slk attachments jobs`

daily media archive timers for this profile

#### `slk attachments jobs install`

install a Linux daily archive timer for this directory; starts nothing

**Changes something on this computer only.**

```sh
slk attachments jobs install <dir> [options]
```

| Argument | | What it is |
|---|---|---|
| `dir` | required | archive directory, used with the same profile as install. |

| Option | What it does |
|---|---|
| `--at <HH:mm>` | daily start time. Default: `03:00`. |
| `--timezone <zone>` | IANA time zone of the daily start time. Default: `UTC`. |
| `--chat <chat>` | only this chat; repeat for more; a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). Default: ``. |
| `--since-time <time>` | include messages from this time: ISO 8601, a date, today, yesterday, or 2h, 7d ago; fixed when installed. |

**Returns:** media archive timer — name, installed, service_path, timer_path, active, action; every field: slk commands info attachments jobs install

**Example:** `slk personal attachments jobs install ./media-archive`

#### `slk attachments jobs start`

enable the installed archive timer at login and start its daily schedule

**Changes something on this computer only.**

```sh
slk attachments jobs start <dir>
```

| Argument | | What it is |
|---|---|---|
| `dir` | required | archive directory, used with the same profile as install. |

**Returns:** media archive timer — name, installed, service_path, timer_path, active, action; every field: slk commands info attachments jobs start

**Example:** `slk personal attachments jobs start ./media-archive`

#### `slk attachments jobs stop`

disable the archive timer; a download already running finishes

**Changes something on this computer only.**

```sh
slk attachments jobs stop <dir>
```

| Argument | | What it is |
|---|---|---|
| `dir` | required | archive directory, used with the same profile as install. |

**Returns:** media archive timer — name, installed, service_path, timer_path, active, action; every field: slk commands info attachments jobs stop

**Example:** `slk personal attachments jobs stop ./media-archive`

#### `slk attachments jobs status`

show whether this directory's archive timer is installed and active

```sh
slk attachments jobs status <dir>
```

| Argument | | What it is |
|---|---|---|
| `dir` | required | archive directory, used with the same profile as install. |

**Returns:** media archive timer — name, installed, service_path, timer_path, active, action; every field: slk commands info attachments jobs status

**Example:** `slk personal attachments jobs status ./media-archive`

#### `slk attachments jobs uninstall`

remove this directory's stopped archive timer; keep archived files

**Changes something on this computer only.**

```sh
slk attachments jobs uninstall <dir>
```

| Argument | | What it is |
|---|---|---|
| `dir` | required | archive directory, used with the same profile as install. |

**Returns:** media archive timer — name, installed, service_path, timer_path, active, action; every field: slk commands info attachments jobs uninstall

**Example:** `slk personal attachments jobs uninstall ./media-archive`

### `slk attachments move`

move older images into another verified archive; remember their new locations

**Changes something on this computer only.**

```sh
slk attachments move <dir> <archive-dir> [options]
```

| Argument | | What it is |
|---|---|---|
| `dir` | required | source media archive directory. |
| `archive-dir` | required | destination archive directory; created if needed. |

| Option | What it does |
|---|---|
| `--before-time <time>` | move images whose message date is before this time: ISO 8601, a date (its start), today, or 7d ago. |
| `--dry-run` | show counts and bytes without moving files or creating the destination. |

**Returns:** media archive move — directory, archive_directory, before_time, selected, selected_bytes, moved, moved_bytes, already_archived, and 3 more; every field: slk commands info attachments move

**Example:** `slk personal attachments move ./media-archive ./older-images --before-time 2026-10-01T00:00:00Z --dry-run`

## `slk tags`

your own labels on chats, people, messages and tasks, kept in the local store and never sent; tag: in a search finds them

### `slk tags rebuild`

derive local group/channel tags from cached metadata using keyword rules

**Changes something on this computer only.**

```sh
slk tags rebuild [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a stored group/channel; repeat to select several. Default: ``. |
| `--limit <n>` | process at most 1–500 chats; the configured limit if not given. |
| `--sync-first` | read current descriptions from the messenger before classifying. |
| `--dry-run` | preview cached classification without changing the store. |

**Returns:** automatic tags — items, has_more, dry_run; every field: slk commands info tags rebuild

**Example:** `slk personal tags rebuild --chat "Book club" --dry-run`

### `slk tags add`

put tags on one chat, person, message or task

**Changes something on this computer only.**

```sh
slk tags add <tag> [options]
```

| Argument | | What it is |
|---|---|---|
| `tag` | required | one or more tags: 1–32 letters a–z, digits and hyphens; upper case is lowered. |

| Option | What it does |
|---|---|
| `--chat <chat>` | the chat to tag, or the chat of --message; a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--contact <person>` | the person to tag: their id, @username or name, as the local store knows them. |
| `--message <message>` | the message to tag: its id in --chat, or a msg: locator alone. |
| `--task <id>` | the task to tag: its id or key, as tasks list shows it. |

**Returns:** tag change — target, unchanged, added, removed; every field: slk commands info tags add

**Example:** `slk personal tags add reading --chat "Book club"`

### `slk tags remove`

take tags off one chat, person, message or task

**Changes something on this computer only.**

```sh
slk tags remove <tag> [options]
```

| Argument | | What it is |
|---|---|---|
| `tag` | required | one or more tags: 1–32 letters a–z, digits and hyphens; upper case is lowered. |

| Option | What it does |
|---|---|
| `--chat <chat>` | the chat to untag, or the chat of --message; a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--contact <person>` | the person to untag: their id, @username or name, as the local store knows them. |
| `--message <message>` | the message to untag: its id in --chat, or a msg: locator alone. |
| `--task <id>` | the task to untag: its id or key, as tasks list shows it. |
| `--claim <claim>` | remove only this ownership claim: manual or auto. |

**Returns:** tag change — target, unchanged, added, removed; every field: slk commands info tags remove

**Example:** `slk personal tags remove reading --chat "Book club"`

### `slk tags list`

what is tagged: this account's chats, messages and tasks, and the people of its messenger

```sh
slk tags list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** tagging — tag, type, target, name, sources, created_at; every field: slk commands info tags list

**Example:** `slk personal tags list`, `slk personal tags list tag:reading`

## `slk mentions`

phones, e-mail, links, documents, names and addresses in stored messages

### `slk mentions list`

this account's mentions matching the query, newest first; --new for those found since the last review

```sh
slk mentions list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | fields below; a bare word is a value, so a phone typed with 8 finds it written with +7. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--new` | undecided mentions found since the last --new run that showed them all; the first run shows every one. |

**Returns:** mention — id, kind, value, domain, confidence, status, field, author, and 5 more; every field: slk commands info mentions list

**Example:** `slk personal mentions list kind:phone`, `slk personal mentions list domain:google.com`, `slk personal mentions list --new`

### `slk mentions domains`

the sites this account's links point to, most linked first, with chats and first and last time

```sh
slk mentions domains [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | narrows the links counted: the fields below; dismissed links are never counted. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |

**Returns:** mention domain — domain, links, chats, first_at, last_at; every field: slk commands info mentions domains

**Example:** `slk personal mentions domains`, `slk personal mentions domains status:found`

### `slk mentions places`

confirmed addresses, in every account, most mentioned first; `mentions confirm <id>` adds one

```sh
slk mentions places [options]
```

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |

**Returns:** place — id, address, mentions; every field: slk commands info mentions places

**Example:** `slk personal mentions places`

### `slk mentions show`

one mention, the text around it, and how many other places hold its value

```sh
slk mentions show <id>
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the mention's id, from mentions list. |

**Returns:** mention details — id, kind, value, domain, confidence, status, field, author, and 9 more; every field: slk commands info mentions show

**Example:** `slk personal mentions show 12`

### `slk mentions confirm`

say what a mention is: a phone's owner everywhere it is written, the stored document, who a name means, an address as a place

**Changes something on this computer only.**

```sh
slk mentions confirm <id> [person] [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the mention's id, from mentions list. |
| `person` | optional | person:<uid> or organization:<id> that owns the phone or the e-mail address; person:<uid> a name means; a document or a street address needs none. |

| Option | What it does |
|---|---|
| `--all-in-chat` | a name: also every undecided place of the same name in its chat. |
| `--as-owner` | record it as yours although an agent's terminal runs the tool (AI_AGENT or CLAUDECODE set). |

**Returns:** mention decision — kind, value, status, target, mentions, proposal; every field: slk commands info mentions confirm

**Example:** `slk personal mentions confirm 12 person:7`, `slk personal mentions confirm 15`, `slk personal mentions confirm 31 person:7 --all-in-chat`

### `slk mentions reject`

not a real mention: dismiss its value everywhere and on later syncs; a name only where it is

**Changes something on this computer only.**

```sh
slk mentions reject <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the mention's id, from mentions list. |

| Option | What it does |
|---|---|
| `--all-in-chat` | a name: also every undecided place of the same name in its chat. |
| `--as-owner` | record it as yours although an agent's terminal runs the tool (AI_AGENT or CLAUDECODE set). |

**Returns:** mention decision — kind, value, status, target, mentions, proposal; every field: slk commands info mentions reject

**Example:** `slk personal mentions reject 12`

### `slk mentions rebuild`

find the mentions of every stored message again; decisions are kept

**Changes something on this computer only.**

```sh
slk mentions rebuild [kind]
```

| Argument | | What it is |
|---|---|---|
| `kind` | optional | only this kind: person-name after people were added or renamed. One of: `phone`, `email`, `url`, `document`, `person-name`, `place`. |

**Returns:** mention rebuild — messages, attachments, documents, notes, emails, mentions; every field: slk commands info mentions rebuild

**Example:** `slk personal mentions rebuild`, `slk personal mentions rebuild person-name`

## `slk metadata`

cached group/channel descriptions for local automatic tags

### `slk metadata show`

a stored chat's cached description, as automatic tags read it

```sh
slk metadata show [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a stored chat. |

**Returns:** chat metadata — chat_id, metadata; every field: slk commands info metadata show

**Example:** `slk personal metadata show --chat 7`

### `slk metadata sync`

fetch group and channel descriptions again and cache them

**Changes something on this computer only.**

```sh
slk metadata sync [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | stored group/channel; repeat for several. Default: ``. |
| `--only-missing` | only chats with no metadata yet; without --chat, every stored group/channel. |
| `--limit <n>` | process at most 1–500 chats; the configured limit if not given. |

**Returns:** chat metadata refresh — chats, has_more; every field: slk commands info metadata sync

**Example:** `slk personal metadata sync --chat 7 --chat 8`, `slk personal metadata sync --only-missing --limit 20`

## `slk stats`

statistics about messages, chats and their authors

### `slk stats messages`

message statistics from the local store

#### `slk stats messages show`

how many stored messages match, by chat, sender, day or hour — the local store only; optionally fetches new messages with --sync-first

```sh
slk stats messages show [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | a strict Lucene query, as for search messages; none counts every stored message; with --saved, more words AND-ed to it. |

| Option | What it does |
|---|---|
| `--sync-first` | first fetch new messages within the chat, time and message bounds. |
| `--max-chats <n>` | refresh at most this many chats (default: 5). |
| `--sync-time <duration>` | stop fetching after this long (default: 30s). |
| `--max-messages <n>` | fetch at most this many messages total (default: 500). |
| `--by <group>` | count by chat, sender, day or hour (default: chat). |
| `--chat <chat>` | only this chat — the same as chat: in the query; a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--source <accounts>` | every account of this messenger held in the store; personal, bots or all — the same as in: in the query. |
| `--limit <n>` | how many rows. |
| `--timezone <zone>` | the IANA timezone for calendar days and hours. |
| `--exact` | bare words and quotes match their exact form only, as exact:word does; text: still matches every form. |
| `--saved <name\|id>` | count what a saved search or an earlier run matches; options typed here replace its own. |

**Returns:** message counts — by, total, rows; every field: slk commands info stats messages show

**Example:** `slk personal stats messages show --chat "Book club" --by day`

#### `slk stats messages counters`

per-counter observations and bounded remote refresh

#### `slk stats messages counters show`

show saved counter values and their observation freshness

```sh
slk stats messages counters show [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | strict Lucene query over stored messages. |

| Option | What it does |
|---|---|
| `--chat <chat>` | only this chat; a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--source <accounts>` | held accounts of this messenger; refresh uses the active account. |
| `--exact` | bare words match exact forms. |
| `--timezone <zone>` | IANA timezone for query dates. |
| `--selection <json>` | pinned counter-targets selection from counters show; conflicts with query and scope. |
| `--counters <names>` | distinct views,reactions,comments fields; all three by default. |
| `--limit <n>` | messages, 1–100; the configured limit if not given. |
| `--max-age <duration>` | maximum fresh observation age; 24h by default. |

**Returns:** counters — cutoff, max_age_ms, selection, rows; every field: slk commands info stats messages counters show

**Example:** `slk personal stats messages counters show --chat "Book club" --limit 10`

#### `slk stats messages counters sync`

read authoritative counters for bounded messages and update their local observations

**Changes something on this computer only.**

```sh
slk stats messages counters sync [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | strict Lucene query over stored messages. |

| Option | What it does |
|---|---|
| `--chat <chat>` | only this chat; a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--source <accounts>` | held accounts of this messenger; refresh uses the active account. |
| `--exact` | bare words match exact forms. |
| `--timezone <zone>` | IANA timezone for query dates. |
| `--selection <json>` | pinned counter-targets selection from counters show; conflicts with query and scope. |
| `--counters <names>` | distinct views,reactions,comments fields; all three by default. |
| `--limit <n>` | messages, 1–100; the configured limit if not given. |
| `--max-messages <n>` | maximum messages to refresh, 1–100. |
| `--sync-time <duration>` | remote refresh budget; 30s by default, maximum 5m. |
| `--dry-run` | preview exact stored targets and counter capabilities without connecting. |

**Returns:** counter refresh — dry_run, targets, counters, supported, unsupported, max_messages, time_ms, results, and 2 more; every field: slk commands info stats messages counters sync

**Example:** `slk personal stats messages counters sync --chat "Book club" --dry-run`

#### `slk stats messages unanswered`

oldest detected questions without an observed qualifying explicit reply

```sh
slk stats messages unanswered [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | a strict Lucene query; none selects every stored message. |

| Option | What it does |
|---|---|
| `--source <accounts>` | every held account of this messenger; personal, bots or all. |
| `--saved <name\|id>` | run a saved report of this kind; typed report options replace stored options. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--limit <n>` | report rows, 1–100; the configured limit if not given. |
| `--answerer <person>` | stored name, alias, @username, ID or person:provider/account/id; ambiguous names require a choice; repeat for more. |

**Returns:** admin report — report, cutoff, total, summary, quality, rows; every field: slk commands info stats messages unanswered

**Example:** `slk personal stats messages unanswered chat:"Project room"`

#### `slk stats messages discussion`

viewed posts with little recorded discussion

```sh
slk stats messages discussion [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | a strict Lucene query; none selects every stored message. |

| Option | What it does |
|---|---|
| `--source <accounts>` | every held account of this messenger; personal, bots or all. |
| `--saved <name\|id>` | run a saved report of this kind; typed report options replace stored options. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--limit <n>` | report rows, 1–100; the configured limit if not given. |

**Returns:** admin report — report, cutoff, total, summary, quality, rows; every field: slk commands info stats messages discussion

**Example:** `slk personal stats messages discussion chat:"Book club"`

#### `slk stats messages responses`

how long the owner took to answer (--who me), or the other side took to answer the owner (--who others), in one-to-one chats — the local store only. Several messages in a row followed by one answer count as one reply, timed from the first unanswered message; the day of a row is the day of the reply

```sh
slk stats messages responses [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | date:, chat:, kind: and muted: terms, AND-ed — date>=30d, date:[60d TO 30d], muted:false; none reads all time. |

| Option | What it does |
|---|---|
| `--who <side>` | whose replies: the owner's or the other side's. One of: `me`, `others`. |
| `--by <group>` | one row per calendar day of the reply, or none. One of: `day`, `total`. |
| `--timezone <zone>` | the IANA timezone for calendar days and date: bounds. |
| `--source <accounts>` | every account of this messenger held in the store; personal, bots or all. |

**Returns:** response times — who, replies, median_ms, p90_ms, mean_ms, buckets, rows; every field: slk commands info stats messages responses

**Example:** `slk personal stats messages responses --who me --by day --timezone Europe/Madrid -- date>=30d`

#### `slk stats messages waiting`

how many chats wait on the owner — the local store only: a one-to-one chat whose newest message is a question, or a group whose newest message mentions the owner or replies to them. Muted or archived one-to-one chats are left out, as inbox leaves them out; date: bounds the newest message's time

```sh
slk stats messages waiting [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | date:, chat:, kind: and muted: terms, AND-ed — date>=30d, date:[60d TO 30d], muted:false; none reads all time. |

| Option | What it does |
|---|---|
| `--timezone <zone>` | the IANA timezone for date: bounds. |
| `--source <accounts>` | every account of this messenger held in the store; personal, bots or all. |

**Returns:** waiting chats — chats, messages, oldest_at, by_kind; every field: slk commands info stats messages waiting

**Example:** `slk personal stats messages waiting kind:private`

#### `slk stats messages top`

rank stored messages by a measure or explainable score; counters are snapshots with per-field observation freshness

```sh
slk stats messages top [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | a strict Lucene query; none selects every stored message. |

| Option | What it does |
|---|---|
| `--sync-first` | first fetch new messages within the chat, time and message bounds. |
| `--max-chats <n>` | refresh at most this many chats (default: 5). |
| `--sync-time <duration>` | stop fetching after this long (default: 30s). |
| `--max-messages <n>` | fetch at most this many messages total (default: 500). |
| `--measure <name>` | the ranking metric; not with score or weights. One of: `views`, `reactions`, `forwards`, `comments`, `replies`, `thread-size`. |
| `--score <preset>` | helpful/active for authors; engaging for either target. One of: `helpful`, `active`, `engaging`. |
| `--weights <json>` | the complete component weights; replaces preset weights. |
| `--source <accounts>` | every held account of this messenger; personal, bots or all. |
| `--timezone <zone>` | the IANA timezone for dates and active days. |
| `--limit <n>` | ranked rows, 1–100. |
| `--saved <name\|id>` | run a saved query or ranking run; typed options replace stored options. |

**Returns:** ranking — target, measure, order, preset, weights, min_messages, message_kind, total, and 7 more; every field: slk commands info stats messages top

**Example:** `slk personal stats messages top chat:"Book club" --limit 10`

#### `slk stats messages evidence`

bounded messages, answer pairs or retention members from an exact drilldown selection

```sh
slk stats messages evidence <message> [options]
```

| Argument | | What it is |
|---|---|---|
| `message` | required | the canonical message locator, or retention cohort reference, from drilldown. |

| Option | What it does |
|---|---|
| `--selection <json>` | the resolved ranking selection returned in drilldown. |
| `--component <name>` | the exposed ranking component. |
| `--limit <n>` | evidence rows, 1–100; the configured limit if not given. |
| `--cursor <cursor>` | continue the same component and stored-evidence fingerprint. |

**Returns:** evidence — message, contribution, related, counters, person_ref, joined_at, cohort, checkpoints, and 2 more; every field: slk commands info stats messages evidence

**Example:** `slk personal stats messages evidence "$message" --selection "$selection" --component reactions`

### `slk stats contacts`

statistics about human authors

#### `slk stats contacts responses`

counts and median/p90 latency for selected human answering identities

```sh
slk stats contacts responses [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | a strict Lucene query; none selects every stored message. |

| Option | What it does |
|---|---|
| `--source <accounts>` | every held account of this messenger; personal, bots or all. |
| `--saved <name\|id>` | run a saved report of this kind; typed report options replace stored options. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--limit <n>` | report rows, 1–100; the configured limit if not given. |
| `--answerer <person>` | stored name, alias, @username, ID or person:provider/account/id; ambiguous names require a choice; repeat for more. |

**Returns:** admin report — report, cutoff, total, summary, quality, rows; every field: slk commands info stats contacts responses

**Example:** `slk personal stats contacts responses chat:"Project room"`

#### `slk stats contacts top`

rank the human authors of stored messages by a measure or explainable score; counters are snapshots with per-field observation freshness

```sh
slk stats contacts top [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | a strict Lucene query; none selects every stored message. |

| Option | What it does |
|---|---|
| `--sync-first` | first fetch new messages within the chat, time and message bounds. |
| `--max-chats <n>` | refresh at most this many chats (default: 5). |
| `--sync-time <duration>` | stop fetching after this long (default: 30s). |
| `--max-messages <n>` | fetch at most this many messages total (default: 500). |
| `--measure <name>` | the ranking metric; not with score or weights. One of: `messages`, `words`, `reactions`, `replies`, `answers`, `answer-time`, `threads`, `active-days`. |
| `--score <preset>` | helpful/active for authors; engaging for either target. One of: `helpful`, `active`, `engaging`. |
| `--weights <json>` | the complete component weights; replaces preset weights. |
| `--source <accounts>` | every held account of this messenger; personal, bots or all. |
| `--timezone <zone>` | the IANA timezone for dates and active days. |
| `--limit <n>` | ranked rows, 1–100. |
| `--saved <name\|id>` | run a saved query or ranking run; typed options replace stored options. |

**Returns:** ranking — target, measure, order, preset, weights, min_messages, message_kind, total, and 7 more; every field: slk commands info stats contacts top

**Example:** `slk personal stats contacts top chat:"Book club" --limit 10`

#### `slk stats contacts evidence`

bounded messages, answer pairs or retention members from an exact drilldown selection

```sh
slk stats contacts evidence <person> [options]
```

| Argument | | What it is |
|---|---|---|
| `person` | required | the exact native person id from the ranking row. |

| Option | What it does |
|---|---|
| `--selection <json>` | the resolved ranking selection returned in drilldown. |
| `--component <name>` | the exposed ranking component. |
| `--limit <n>` | evidence rows, 1–100; the configured limit if not given. |
| `--cursor <cursor>` | continue the same component and stored-evidence fingerprint. |

**Returns:** evidence — message, contribution, related, counters, person_ref, joined_at, cohort, checkpoints, and 2 more; every field: slk commands info stats contacts evidence

**Example:** `slk personal stats contacts evidence 101 --selection "$selection" --component messages`

### `slk stats chats`

statistics about one chat

#### `slk stats chats show`

a group's or channel's numbers for a period: messages, active members, replies, reactions, questions answered, joins and leaves — counted from the local store; joins and leaves are asked of the messenger

```sh
slk stats chats show <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

| Option | What it does |
|---|---|
| `--since-time <time>` | ISO 8601, or 2h / 1d ago; 7 days ago if not given. |
| `--by <group>` | also one row per calendar day or week (weeks start on Monday). |
| `--timezone <zone>` | the IANA timezone for calendar days. |

**Returns:** chat stats — chat, since, until, complete, completeness, messages, senders, replies, and 10 more; every field: slk commands info stats chats show

**Example:** `slk personal stats chats show "Book club"`

#### `slk stats chats newcomers`

known-join members and their help within a join window

```sh
slk stats chats newcomers <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

| Option | What it does |
|---|---|
| `--since-time <time>` | from this ISO 8601 time, or 2h / 1d ago; 30d ago if not given. |
| `--until-time <time>` | through this ISO 8601 time, or 2h / 1d ago. |
| `--within <duration>` | the help window after a known newcomer join. |
| `--saved <name\|id>` | run a saved report of this kind; typed report options replace stored options. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--limit <n>` | report rows, 1–100; the configured limit if not given. |
| `--answerer <person>` | stored name, alias, @username, ID or person:provider/account/id; ambiguous names require a choice; repeat for more. |

**Returns:** admin report — report, cutoff, total, summary, quality, rows; every field: slk commands info stats chats newcomers

**Example:** `slk personal stats chats newcomers "Book club"`

#### `slk stats chats retention`

joining cohorts and observed checkpoint membership from saved roster observations

```sh
slk stats chats retention <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

| Option | What it does |
|---|---|
| `--since-time <time>` | joining period starts at ISO 8601 or a relative time; last 90 days by default. |
| `--until-time <time>` | joining period ends at this time; now by default. |
| `--checkpoints <durations>` | up to 10 increasing joining ages, comma separated; 1d,7d,30d by default. |
| `--within <duration>` | activity and early departure window after joining; 7d by default. |
| `--by <group>` | group joining dates by calendar day or Monday week. One of: `day`, `week`. |
| `--timezone <zone>` | IANA timezone for joining cohorts. |
| `--limit <n>` | cohorts and member evidence, 1–100. |

**Returns:** retention — chat_ref, cutoff, since, until, checkpoints_ms, within_ms, by, timezone, and 5 more; every field: slk commands info stats chats retention

**Example:** `slk personal stats chats retention "Book club"`

### `slk stats tasks`

task statistics

#### `slk stats tasks show`

tasks per chat, meeting or project: open now, and opened and closed in the period (created: in the query), with the median time to close and the mean age of the open ones

```sh
slk stats tasks show [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--by <group>` | chat (default) or meeting: this account's tasks; project: the owner's project tasks, every project. |
| `--type <type>` | only this type: question, request, mention or promise. |
| `--timezone <zone>` | the IANA timezone for calendar days in the period, such as created>=today. |

**Returns:** task — ref, id, title, kind, state, created_at, key, description, and 26 more; every field: slk commands info stats tasks show

**Next usually:** `slk tasks show <task>`, `slk tasks related <task>`, `slk tasks update <task>`

**Example:** `slk personal stats tasks show -- chat:"Project room"`

### `slk stats charts`

a chart's data from a chat's statistics, and optionally a dark SVG or PNG image

**Changes something on this computer only.**

```sh
slk stats charts <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

| Option | What it does |
|---|---|
| `--chart-kind <messages\|active\|membership>` | what to draw: messages, active authors, or joins and leaves. Default: `messages`. |
| `--by <group>` | one point per calendar day or week (weeks start on Monday). Default: `day`. |
| `--since-time <time>` | ISO 8601, or 2h / 1d ago; 7 days ago if not given. |
| `--timezone <zone>` | the IANA timezone for calendar days. |
| `--output <file>` | write a dark image to a new .svg or .png file. |

**Returns:** chart — version, kind, title, x, series, unit, timezone, partial, and 2 more; every field: slk commands info stats charts

**Example:** `slk personal stats charts "Book club" --output ./activity.svg`

## `slk tasks`

what waits on you — unanswered questions, mentions, requests, promises — kept in the local store; review and serve add them

### `slk tasks list`

tasks, oldest first, with their message or note source

```sh
slk tasks list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many. |

**Returns:** task — ref, id, title, kind, state, created_at, key, description, and 26 more; every field: slk commands info tasks list

**Next usually:** `slk tasks show <task>`, `slk tasks related <task>`, `slk tasks update <task>`

**Example:** `slk personal tasks list --limit 10`

### `slk tasks add`

add a task for a stored message or note — a promise, a request

**Changes something on this computer only.**

```sh
slk tasks add <message> [options]
```

| Argument | | What it is |
|---|---|---|
| `message` | required | a message locator, msg:<provider>/<account>/<chat>/<message>, or note:<id>. |

| Option | What it does |
|---|---|
| `--type <type>` | the task's type: question, request, mention or promise. |
| `--category <name>` | what it is about, from the list tasks categories prints: money, documents, meeting, …. |
| `--into <id>` | when tasks add listed tasks that may be the same job: link the message to this one instead of opening a task. |
| `--new` | when tasks add listed tasks that may be the same job: open the task anyway. |
| `--open-new` | open a task from a message the chat's task point already passed (a read again with tasks review --since-time); without it such a read only updates and closes tasks. |
| `--title <title>` | one line: the action and its object — send Alex the API token. |
| `--description <text>` | the detail, in Markdown: who owes whom, done when, next step, keywords. |
| `--due <time>` | when it must be done: an ISO 8601 time, a date (its end), today, or 2h, 3d from now; none clears it. |
| `--remind-time <time>` | when to look at it again: an ISO 8601 time, a date (its start), today, or 2h, 3d from now; none clears it. |
| `--assignee <person...>` | who does it: sender (whoever sent the task's message) or person:<id>; none clears it. Leave it out when unsure: a task with no assignee is better than none. |

**Returns:** task created — id, source, source_kind, account, group, kind, state, origin, and 16 more; every field: slk commands info tasks add

**Example:** `slk personal tasks add note:101 --type promise --category documents --title "Review draft"`

### `slk tasks update`

update a task's text, schedule, category, assignees, priority or parent; nothing reaches the messenger

**Changes something on this computer only.**

```sh
slk tasks update <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

| Option | What it does |
|---|---|
| `--category <name>` | what it is about, from the list tasks categories prints: money, documents, meeting, …; a change is kept in the task's history. |
| `--priority <n>` | low, medium, high, critical or none; 0 (urgent) … 4 (low) still read as before. |
| `--parent <id>` | parent task in the same project; none clears it. |
| `--title <title>` | one line: the action and its object — send Alex the API token. |
| `--description <text>` | the detail, in Markdown: who owes whom, done when, next step, keywords. |
| `--due <time>` | when it must be done: an ISO 8601 time, a date (its end), today, or 2h, 3d from now; none clears it. |
| `--remind-time <time>` | when to look at it again: an ISO 8601 time, a date (its start), today, or 2h, 3d from now; none clears it. |
| `--assignee <person...>` | who does it: sender (whoever sent the task's message) or person:<id>; none clears it. Leave it out when unsure: a task with no assignee is better than none. |

**Returns:** task card — id, ref, key, project, project_key, project_name, created_by, title, and 26 more; every field: slk commands info tasks update

**Example:** `slk personal tasks update DOC-12 --title "Review draft"`

### `slk tasks link`

link a task to messages, chats, people or URLs — or to another task: task:<id>

**Changes something on this computer only.**

```sh
slk tasks link <task> [targets] [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |
| `targets` | optional | msg: locators, person:<id>, document:<id>, note:<id>, a URL; or task:<id>, which links two project tasks. |

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat it concerns, repeatable; a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--kind <kind>` | related-to (default), evidence — it shows the task is real — or created-from; for task:<id>, related-to, blocked-by, follow-up-of, duplicate-of or discovered-from. |

**Returns:** task links — id, ref, key, project, project_key, project_name, created_by, title, and 28 more; every field: slk commands info tasks link

**Example:** `slk personal tasks link DOC-12 https://example.com/draft`

### `slk tasks show`

one task: its plan and everything linked to it

```sh
slk tasks show <task>
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

**Returns:** task card — id, ref, key, project, project_key, project_name, created_by, title, and 26 more; every field: slk commands info tasks show

**Example:** `slk personal tasks show DOC-12`

### `slk tasks related`

tasks that may be the same job as this one, best first, each with a band — likely, maybe, different — and the reasons; merges nothing

```sh
slk tasks related <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many, at most 40 (default 10). |

**Returns:** task similar — ref, key, title, status, created_at, found_by, score, band, and 3 more; every field: slk commands info tasks related

**Example:** `slk personal tasks related PR-12`

### `slk tasks duplicates`

pairs of tasks that may be one job

#### `slk tasks duplicates list`

pairs of tasks a rule opened that may be one job, newest first, with score and reasons: merge, reject or defer each; decision:unsure lists the ones deferred to the owner

```sh
slk tasks duplicates list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many. |

**Returns:** task pair — task, source, other, score, band, levels, reasons, decision, and 2 more; every field: slk commands info tasks duplicates list

**Example:** `slk personal tasks duplicates list --limit 10`, `slk personal tasks duplicates list decision:unsure`

#### `slk tasks duplicates reject`

two tasks are not the same job: the pair leaves the list and is never offered again

**Changes something on this computer only.**

```sh
slk tasks duplicates reject <task> <other-task>
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task listed as the duplicate, by its id or key. |
| `other-task` | required | the task it was paired with. |

**Returns:** task pair — task, source, other, score, band, levels, reasons, decision, and 2 more; every field: slk commands info tasks duplicates reject

**Example:** `slk personal tasks duplicates reject PR-14 PR-12`

#### `slk tasks duplicates defer`

the fields and the text cannot tell: leave the pair to the owner, who lists it with decision:unsure

**Changes something on this computer only.**

```sh
slk tasks duplicates defer <task> <other-task>
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task listed as the duplicate, by its id or key. |
| `other-task` | required | the task it was paired with. |

**Returns:** task pair — task, source, other, score, band, levels, reasons, decision, and 2 more; every field: slk commands info tasks duplicates defer

**Example:** `slk personal tasks duplicates defer PR-14 PR-12`

### `slk tasks merge`

one job seen twice: link every message of the duplicate to the task and close the duplicate dismissed, duplicate-of the task; nothing is deleted, and tasks unmerge undoes it

**Changes something on this computer only.**

```sh
slk tasks merge <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the duplicate, by its id or key; it must be open. |

| Option | What it does |
|---|---|
| `--into <id>` | the task that stays, by its id or key. |

**Returns:** task merge — pair, linked, review, task; every field: slk commands info tasks merge

**Example:** `slk personal tasks merge PR-14 --into PR-12`

### `slk tasks unmerge`

undo a merge: reopen the task and remove its duplicate-of relation; messages the merge linked stay linked

**Changes something on this computer only.**

```sh
slk tasks unmerge <task>
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the merged task, by its id or key. |

**Returns:** task unmerge — pair, task; every field: slk commands info tasks unmerge

**Example:** `slk personal tasks unmerge PR-14`

### `slk tasks agenda`

what needs a look today, from the local store and without message text: tasks overdue, due or to check, chats where you owe an answer, chats where you wait for one, open tasks someone else does

```sh
slk tasks agenda [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--due-within <duration>` | list tasks due within this: 30m, 2h, 1d (default 1d). |
| `--unanswered <duration>` | list chats where someone else wrote last this long ago (default 1d). |
| `--waiting <duration>` | list chats where you wrote last this long ago (default 7d). |
| `--within <duration>` | leave out chats silent longer than this: they ended (default 30d). |
| `--holder <name>` | who you are for claims: a session id or a chat id; default WIRECAT_HOLDER, else Claude Code's session, else the agent's name. |

**Returns:** agenda — at, account, stored_at, stale, tasks, owed, waiting, unsynced, and 2 more; every field: slk commands info tasks agenda

**Example:** `slk personal tasks agenda`

### `slk tasks categories`

the categories a task takes, with what each means and the words a rule picks it by

```sh
slk tasks categories
```

**Returns:** task categories — categories, unlisted, file; every field: slk commands info tasks categories

**Example:** `slk personal tasks categories`

### `slk tasks scan`

the task rules over a chat's newest stored messages: in a one-to-one chat a question you did not answer, in a group only a question in reply to you and a mention of you, open a task, and your answer closes one; a channel opens none — for a chat the first sync left alone (config task_first_pass_per_chat). Lists what would open and changes nothing unless --yes; with --yes the duplicate check runs as on a sync. Reads only the local store

**Changes something on this computer only.**

```sh
slk tasks scan <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

| Option | What it does |
|---|---|
| `--last <n>` | read the newest n stored messages of each chat (default 50, at most 1000). |
| `--yes` | open and close the tasks it lists; otherwise only list them. |

**Returns:** task scan — chat, messages, added, closed, review, tasks, held, held_chats; every field: slk commands info tasks scan

**Example:** `slk personal tasks scan <chat>`, `slk personal tasks scan <chat> --last 300 --yes`

### `slk tasks status`

every chat that can hold your tasks — not a channel or Saved Messages — with the point its messages were read for tasks through, who read them, how many stored messages wait after it, and how many arrived late inside the stretch already read (history fetched afterwards). Its own point: reading a chat, marking it read, inbox --new and review --new never move it; tasks acknowledge does. Reads only the local store

```sh
slk tasks status [options]
```

| Option | What it does |
|---|---|
| `--limit <n>` | how many chats. |

**Returns:** task analysis — chat, title, kind, newest_at, mark, waiting, late, untrusted; every field: slk commands info tasks status

**Example:** `slk personal tasks status`

### `slk tasks review`

the stored messages after the chat's task point, oldest first, and the chat's open tasks, so one read can open new tasks and update or close the old ones. A chat never read starts 14 days back. Moves nothing: when done, tasks acknowledge <chat> <through> records it. Reads only the local store; messages sync or backfill fetch what it lacks

```sh
slk tasks review <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

| Option | What it does |
|---|---|
| `--limit <n>` | how many messages (default 100, 1000 with --since-time; at most 1000). |
| `--since-time <time>` | read again from this ISO 8601 time, or 30d ago, whatever the point says; what the point already passed only updates and closes tasks, unless tasks add is given --open-new. |

**Returns:** task review — chat, from, mark, late, has_more, through, messages, open_tasks, and 1 more; every field: slk commands info tasks review

**Example:** `slk personal tasks review <chat>`, `slk personal tasks review <chat> --since-time 30d`

### `slk tasks acknowledge`

moves the chat's task point to this message once its tasks are opened, updated or closed; it never moves back. With --since-time, the read started there: a read again from the start of the stretch clears what arrived late inside it

**Changes something on this computer only.**

```sh
slk tasks acknowledge <chat> <message> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `message` | required | the id of the last message read, as tasks review shows it. |

| Option | What it does |
|---|---|
| `--since-time <time>` | where the read started, when tasks review was given --since-time. |

**Returns:** task analysis mark — chat, from, through, through_id, by, checked_at, checked_through, at, and 1 more; every field: slk commands info tasks acknowledge

**Example:** `slk personal tasks acknowledge <chat> <message>`

### `slk tasks claim`

take an open task so no other agent works it at once; the claim lapses by itself

**Changes something on this computer only.**

```sh
slk tasks claim <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

| Option | What it does |
|---|---|
| `--lease <duration>` | how long the claim lasts: 30m, 2h (default 30m); claiming again extends it. |
| `--holder <name>` | who you are for claims: a session id or a chat id; default WIRECAT_HOLDER, else Claude Code's session, else the agent's name. |

**Returns:** task card — id, ref, key, project, project_key, project_name, created_by, title, and 26 more; every field: slk commands info tasks claim

**Example:** `slk personal tasks claim PR-12 --lease 2h`

### `slk tasks release`

give back a task you claimed, before the claim lapses; the owner may release any

**Changes something on this computer only.**

```sh
slk tasks release <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

| Option | What it does |
|---|---|
| `--holder <name>` | who you are for claims: a session id or a chat id; default WIRECAT_HOLDER, else Claude Code's session, else the agent's name. |

**Returns:** task card — id, ref, key, project, project_key, project_name, created_by, title, and 26 more; every field: slk commands info tasks release

**Example:** `slk personal tasks release PR-12`

### `slk tasks close`

close a task: done, or dismissed when it needs no answer. An agent (AI_AGENT or CLAUDECODE set) states its --certainty; below config task_agent_close_min, or with task_agent_close off, the task stays open and the close waits on the owner, who confirms it with tasks close or refuses it with tasks reject. A closed task stays closed, unless tasks unmerge reopens a merged one

**Changes something on this computer only.**

```sh
slk tasks close <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

| Option | What it does |
|---|---|
| `--as <state>` | how it is closed: done, or dismissed — it needs no answer; the owner may leave it out to confirm an agent's close. |
| `--reason <text>` | why, kept with the task — no-reply-needed, for example. |
| `--certainty <n>` | an agent's: how sure it is, 0 to 1, that the task needs nothing more. |
| `--as-owner` | close it as yours although an agent's terminal runs the tool (AI_AGENT or CLAUDECODE set). |

**Returns:** task closed — id, source, source_kind, account, group, kind, state, origin, and 13 more; every field: slk commands info tasks close

**Example:** `slk personal tasks close Q-15 --as done --certainty 0.9 --reason answered-in-chat`, `slk personal tasks close Q-15`

### `slk tasks reject`

refuse the close an agent suggested: the task stays open and leaves close:suggested; the agent may close it again

**Changes something on this computer only.**

```sh
slk tasks reject <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

| Option | What it does |
|---|---|
| `--as-owner` | refuse it as yours although an agent's terminal runs the tool (AI_AGENT or CLAUDECODE set). |

**Returns:** task card — id, ref, key, project, project_key, project_name, created_by, title, and 26 more; every field: slk commands info tasks reject

**Example:** `slk personal tasks reject Q-15`

## `slk search`

find things by text: one resource when you know it (messages, notes), or search all across messages and notes; for mail, the separate memo CLI: memo search mail

### `slk search all`

search messenger messages and notes in the local store, and by default the messenger's server for messages too (notes and events are local only; --backend archive or --offline keeps it to the local store), calendar events when the store holds a calendar, and meeting transcripts, chat and summaries when it holds a meeting account — best match first; not mail (the separate memo CLI searches it: memo search mail), tasks, people, memories or projects. Use it when you do not know where something was written; search messages or notes reads one kind with all its fields

```sh
slk search all <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | strict Lucene query: words, "phrases", AND/OR/NOT, field groups and date ranges. |

| Option | What it does |
|---|---|
| `--only <resources>` | only these resources, separated by commas: messages, notes, events, meetings. |
| `--source <accounts>` | only these accounts, separated by commas: provider:account as a hit shows it, a provider, a kind or group:<name>; each resource reads the ones of its kind. |
| `--limit <n>` | how many. |
| `--page <n>` | which page, starting at 1. |
| `--exact` | bare words and quotes match their exact form only, as exact:word does. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--backend <archive\|server\|both>` | where to search: the local archive, the messenger's server (default: both; message discovery uses archive only), or both. |
| `--server-time <duration>` | stop waiting for the server after this long (default: 5s). |

**Returns:** hit — kind, ref, provider, account, title, timestamp, excerpt, url, and 19 more; every field: slk commands info search all

**Example:** `slk personal search all draft`

### `slk search messages`

search messenger messages in the local store and on the messenger's server (--backend); optionally fetches new messages with --sync-first; --discover searches the archive only

```sh
slk search messages [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | strict Lucene query: words, "phrases", AND/OR/NOT, field groups and date ranges; with --saved, more words AND-ed to it. |

| Option | What it does |
|---|---|
| `--sync-first` | first fetch new messages within the chat, time and message bounds. |
| `--max-chats <n>` | refresh at most this many chats (default: 5). |
| `--sync-time <duration>` | stop fetching after this long (default: 30s). |
| `--max-messages <n>` | fetch at most this many messages total (default: 500). |
| `--thread` | the stored reply chain and replies instead of time neighbours; falls back when no graph exists. |
| `--thread-hops <n>` | at most this many links from the hit (default: 8). |
| `--thread-messages <n>` | at most this many messages in each thread context (default: 50). |
| `--thread-bytes <n>` | at most this many bytes of whole messages and links in each context (default: 65536). |
| `--thread-within <duration>` | messages within this long either side of the hit (default: 1d). |
| `--backend <archive\|server\|both>` | where to search: the local archive, the messenger's server (default: both; message discovery uses archive only), or both. |
| `--server-time <duration>` | stop waiting for the server after this long (default: 5s). |
| `--source <accounts>` | every account of this messenger held in the store; personal, bots or all — the same as in: in the query; or a list: group:work,telegram:Alice. |
| `--limit <n>` | how many. |
| `--page <n>` | which page, starting at 1. |
| `--newest` | newest first instead of best first. |
| `--exact` | bare words and quotes match their exact form only, as exact:word does; text: still matches every form. |
| `--context <n>` | messages before and after each hit; 2 in the terminal, 0 otherwise. |
| `--discover` | find partial word matches, eligible replies and, once messages have vectors, messages close in meaning in the local archive; results are evidence, not confirmed answers. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--saved <name\|id>` | run a saved search or an earlier run; options typed here replace its own. |

**Returns:** message hit — ref, timestamp, sender_name, sender_is_me, chat_title, excerpt, matched_in, score, and 9 more; every field: slk commands info search messages

**Next usually:** `slk messages transcribe <chat> <message>`, `slk messages links <chat> <message>`, `slk conversations related <chat> <message>`

**Example:** `slk personal search messages draft --limit 10`

### `slk search notes`

search the notes — written in memo, or imported from a notes folder — by words and, with the local text model, by meaning; each hit says which found it and what it links to

```sh
slk search notes <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | strict Lucene query: words, "phrases", AND/OR/NOT, tag:, source:internal (written in memo) or source:file (from a notes folder) and date ranges. |

| Option | What it does |
|---|---|
| `--source <accounts>` | only these notes accounts, separated by commas: notes:internal for notes written in memo, notes:<folder id> as a hit shows it, notes, documents or group:<name>. |
| `--filter <query>` | a query every hit must also match, found by words or by meaning. |
| `--limit <n>` | how many. |
| `--page <n>` | which page, starting at 1. |
| `--exact` | words as written only; meaning is not searched. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |

**Returns:** note hit — ref, source, folder_id, path, title, updated_at, kind, provider, and 6 more; every field: slk commands info search notes

**Example:** `slk personal search notes draft --limit 10`

### `slk search conversations`

the conversations nearest to a query in meaning and in words, best first, in one chat or every one — meaning after `conversations embed`; runs on this machine

**Reads from an outside service.**

```sh
slk search conversations <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | what to look for, in your own words, in any language the model reads. |

| Option | What it does |
|---|---|
| `--model <model>` | local: a model id from `models list` (default: embeddinggemma); remote: the provider's model. |
| `--embedding-provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |
| `--max-chats <n>` | at most this many chats; 5 with --sync-first, 20 with --catch-up if not given. |
| `--max-chunks <n>` | at most this many chunks embedded in one run; 2000 if not given. |
| `--sync-first` | first fetch new messages within the chat, time and message bounds. |
| `--sync-time <duration>` | stop fetching after this long (default: 30s). |
| `--max-messages <n>` | fetch at most this many messages total (default: 500). |
| `--like <text>` | a made-up reply that would answer the query, one sentence: searched by meaning too, which finds an answer worded unlike the question. |
| `--chat <chat>` | only this chat: a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--since-time <time>` | only those still going at this ISO 8601 time, or 30m / 2h / 1d ago, or later. |
| `--filter <query>` | strict Lucene filter: any message in a conversation must match; does not change the meaning query. |
| `--source <accounts>` | accounts to search: personal, bots, all, a provider, or a list like group:work,telegram:Alice,email:me@example.com; defaults to the active account. |
| `--timezone <zone>` | IANA timezone for filter dates; system timezone by default. |
| `--limit <n>` | how many. |
| `--catch-up` | first build and embed, on this machine, the chats in scope that changed or were never built — within --max-chats and --max-chunks. |

**Returns:** conversation hit — summary, chunk, score, by, stale, source, locator, matched_in, and 3 more; every field: slk commands info search conversations

**Example:** `slk personal search conversations "Reviewing the project draft"`

### `slk search runs`

search recorded diagnostic metadata and events; literal words and field:value terms joined by AND; no message contents

```sh
slk search runs [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | matches per page, at most 100. |
| `--page <n>` | result page. |

**Returns:** run hit — run_id, command, started_at, status, cli_version, events, events_truncated, profile, and 21 more; every field: slk commands info search runs

**Example:** `slk personal search runs timeout status:failed --limit 10`

## `slk searches`

saved searches and the history of search messages and stats messages show, kept in the local store; --saved runs one

### `slk searches create`

save a search under a name without running it; search messages --saved <name> runs it

**Changes something on this computer only.**

```sh
slk searches create <name> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | up to 64 letters a–z, digits and hyphens, not only digits. |
| `query` | optional | the query, as for search messages; none matches every stored message. |

| Option | What it does |
|---|---|
| `--chat <chat>` | only this chat — the same as chat: in the query; a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |
| `--source <accounts>` | every account of this messenger held in the store; personal, bots or all — the same as in: in the query; or a list: group:work,telegram:Alice,email:me@example.com. |
| `--limit <n>` | how many. |
| `--newest` | newest first instead of best first. |
| `--exact` | bare words and quotes match their exact form only, as exact:word does; text: still matches every form. |
| `--context <n>` | messages before and after each hit. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--by <group>` | count by chat, sender, day or hour for stats messages show --saved. |
| `--selection <json>` | save the resolved parent ranking query and options from a drilldown. |
| `--replace` | overwrite a saved search of the same name. |

**Returns:** saved search — id, name, command, params, language, version, fields_version, created_at, and 2 more; every field: slk commands info searches create

**Example:** `slk personal searches create project-drafts draft --chat "Project room"`

### `slk searches show`

one saved search or earlier run: its query, options and how often it ran

```sh
slk searches show <name|id>
```

| Argument | | What it is |
|---|---|---|
| `name\|id` | required | a saved search's name, or the id of any row of searches history. |

**Returns:** saved search — id, name, command, params, language, version, fields_version, created_at, and 2 more; every field: slk commands info searches show

**Example:** `slk personal searches show project-drafts`

### `slk searches list`

the saved searches, by name

```sh
slk searches list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms; this list filters by none yet. |

**Returns:** saved search — id, name, command, params, language, version, fields_version, created_at, and 2 more; every field: slk commands info searches list

**Example:** `slk personal searches list`

### `slk searches history`

the searches and counts that ran, newest first — saved ones included; never their results

```sh
slk searches history [options]
```

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

**Returns:** saved search — id, name, command, params, language, version, fields_version, created_at, and 2 more; every field: slk commands info searches history

**Example:** `slk personal searches history --limit 10`

### `slk searches delete`

delete a saved search, or one run from the history

**Changes something on this computer only.**

```sh
slk searches delete <name|id>
```

| Argument | | What it is |
|---|---|---|
| `name\|id` | required | a saved search's name, or the id of any row of searches history. |

**Returns:** saved search — id, name, command, params, language, version, fields_version, created_at, and 2 more; every field: slk commands info searches delete

**Example:** `slk personal searches delete project-drafts`

### `slk searches clear`

empty the history; saved searches stay

**Changes something on this computer only.**

```sh
slk searches clear
```

**Returns:** search history clear — cleared; every field: slk commands info searches clear

**Example:** `slk personal searches clear`

## `slk flood`

the waits Slack asked this profile to keep, and a hold on its writes

### `slk flood clear`

forget them, lift the hold and the profile's pace, once Slack no longer limits the account; changes nothing there

**Changes something on this computer only.**

```sh
slk flood clear
```

**Example:** `slk personal flood clear`

## `slk recipients`

the chats this profile may send to, when the list is on

### `slk recipients list`

the chats on the list; empty and off until the first add

```sh
slk recipients list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** recipient — id, title, added_at, partner_id; every field: slk commands info recipients list

**Example:** `slk personal recipients list`

### `slk recipients add`

allow sending to this chat; the first add turns the list on

**Changes something on this computer only.**

```sh
slk recipients add <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: #channel name, a person's name for a DM, or its Slack id (C…, D…, G…). |

**Returns:** recipient change added — id, title, added; every field: slk commands info recipients add

**Example:** `slk personal recipients add "Book club"`

### `slk recipients remove`

stop allowing this chat; the list stays on

**Changes something on this computer only.**

```sh
slk recipients remove <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | chat id, or the title as the list shows it. |

**Returns:** recipient change removed — id, title, removed; every field: slk commands info recipients remove

**Example:** `slk personal recipients remove "Book club"`

### `slk recipients clear`

delete the list, which turns it off: this profile may send to any chat again

**Changes something on this computer only.**

```sh
slk recipients clear
```

**Returns:** recipient change off — off, was_on; every field: slk commands info recipients clear

**Example:** `slk personal recipients clear`

## `slk sends`

every attempt to send from this profile — never the text

### `slk sends list`

attempts to send, newest first: sent, refused, failed, or not known

```sh
slk sends list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

**Returns:** send attempt — at, profile, chat_id, outcome, kind, action, people, message_id, and 16 more; every field: slk commands info sends list

**Example:** `slk personal sends list --limit 10`

## `slk api`

the raw Slack API, one command per operation of its OpenAPI document

### `slk api list`

list every Slack API operation this CLI offers, without calling Slack

```sh
slk api list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Example:** `slk personal api list`, `slk personal api list effect:destructive --json=command,path`

### `slk api show`

show one operation's parameters and request schema, without calling Slack

```sh
slk api show <operation>
```

| Argument | | What it is |
|---|---|---|
| `operation` | required | the operation as api list prints it (quoted), its old name, or its operation id. |

**Example:** `slk personal api show "admin apps-approve" --json`

### `slk api admin`

the admin operations

#### `slk api admin apps-approve`

admin_apps_approve — write (POST /admin.apps.approve)

**Changes something in the service.**

```sh
slk api admin apps-approve [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin apps-approve`

#### `slk api admin apps-approved-list`

admin_apps_approved_list — read (GET /admin.apps.approved.list)

```sh
slk api admin apps-approved-list [options]
```

| Option | What it does |
|---|---|
| `--limit <value>` | The maximum number of items to return. Must be between 1 - 1000 both inclusive. |
| `--cursor <value>` | Set `cursor` to `next_cursor` returned by the previous call to list items in the next page. |
| `--team-id <value>` | team_id. |
| `--enterprise-id <value>` | enterprise_id. |

**Example:** `slk personal api admin apps-approved-list`

#### `slk api admin apps-requests-list`

admin_apps_requests_list — read (GET /admin.apps.requests.list)

```sh
slk api admin apps-requests-list [options]
```

| Option | What it does |
|---|---|
| `--limit <value>` | The maximum number of items to return. Must be between 1 - 1000 both inclusive. |
| `--cursor <value>` | Set `cursor` to `next_cursor` returned by the previous call to list items in the next page. |
| `--team-id <value>` | team_id. |

**Example:** `slk personal api admin apps-requests-list`

#### `slk api admin apps-restrict`

admin_apps_restrict — write (POST /admin.apps.restrict)

**Changes something in the service.**

```sh
slk api admin apps-restrict [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin apps-restrict`

#### `slk api admin apps-restricted-list`

admin_apps_restricted_list — read (GET /admin.apps.restricted.list)

```sh
slk api admin apps-restricted-list [options]
```

| Option | What it does |
|---|---|
| `--limit <value>` | The maximum number of items to return. Must be between 1 - 1000 both inclusive. |
| `--cursor <value>` | Set `cursor` to `next_cursor` returned by the previous call to list items in the next page. |
| `--team-id <value>` | team_id. |
| `--enterprise-id <value>` | enterprise_id. |

**Example:** `slk personal api admin apps-restricted-list`

#### `slk api admin conversations-archive`

admin_conversations_archive — destructive (POST /admin.conversations.archive)

**Changes something in the service.**

```sh
slk api admin conversations-archive [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin conversations-archive`

#### `slk api admin conversations-convert-to-private`

admin_conversations_convertToPrivate — write (POST /admin.conversations.convertToPrivate)

**Changes something in the service.**

```sh
slk api admin conversations-convert-to-private [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin conversations-convert-to-private`

#### `slk api admin conversations-create`

admin_conversations_create — write (POST /admin.conversations.create)

**Changes something in the service.**

```sh
slk api admin conversations-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin conversations-create`

#### `slk api admin conversations-delete`

admin_conversations_delete — destructive (POST /admin.conversations.delete)

**Changes something in the service.**

```sh
slk api admin conversations-delete [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin conversations-delete`

#### `slk api admin conversations-disconnect-shared`

admin_conversations_disconnectShared — write (POST /admin.conversations.disconnectShared)

**Changes something in the service.**

```sh
slk api admin conversations-disconnect-shared [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin conversations-disconnect-shared`

#### `slk api admin conversations-ekm-list-original-connected-channel-info`

admin_conversations_ekm_listOriginalConnectedChannelInfo — read (GET /admin.conversations.ekm.listOriginalConnectedChannelInfo)

```sh
slk api admin conversations-ekm-list-original-connected-channel-info [options]
```

| Option | What it does |
|---|---|
| `--channel-ids <value>` | A comma-separated list of channels to filter to. |
| `--team-ids <value>` | A comma-separated list of the workspaces to which the channels you would like returned belong. |
| `--limit <value>` | The maximum number of items to return. Must be between 1 - 1000 both inclusive. |
| `--cursor <value>` | Set `cursor` to `next_cursor` returned by the previous call to list items in the next page. |

**Example:** `slk personal api admin conversations-ekm-list-original-connected-channel-info`

#### `slk api admin conversations-get-conversation-prefs`

admin_conversations_getConversationPrefs — read (GET /admin.conversations.getConversationPrefs)

```sh
slk api admin conversations-get-conversation-prefs [options]
```

| Option | What it does |
|---|---|
| `--channel-id <value>` | The channel to get preferences for. |

**Example:** `slk personal api admin conversations-get-conversation-prefs --channel-id <value>`

#### `slk api admin conversations-get-teams`

admin_conversations_getTeams — read (GET /admin.conversations.getTeams)

```sh
slk api admin conversations-get-teams [options]
```

| Option | What it does |
|---|---|
| `--channel-id <value>` | The channel to determine connected workspaces within the organization for. |
| `--cursor <value>` | Set `cursor` to `next_cursor` returned by the previous call to list items in the next page. |
| `--limit <value>` | The maximum number of items to return. Must be between 1 - 1000 both inclusive. |
| `--all` | read every page, as the API pages it. |

**Example:** `slk personal api admin conversations-get-teams --channel-id <value>`

#### `slk api admin conversations-invite`

admin_conversations_invite — write (POST /admin.conversations.invite)

**Changes something in the service.**

```sh
slk api admin conversations-invite [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin conversations-invite`

#### `slk api admin conversations-rename`

admin_conversations_rename — write (POST /admin.conversations.rename)

**Changes something in the service.**

```sh
slk api admin conversations-rename [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin conversations-rename`

#### `slk api admin conversations-restrict-access-list-groups`

admin_conversations_restrictAccess_listGroups — read (GET /admin.conversations.restrictAccess.listGroups)

```sh
slk api admin conversations-restrict-access-list-groups [options]
```

| Option | What it does |
|---|---|
| `--channel-id <value>` | channel_id. |
| `--team-id <value>` | The workspace where the channel exists. This argument is required for channels only tied to one workspace, and optional for channels that are shared across an organization. |

**Example:** `slk personal api admin conversations-restrict-access-list-groups --channel-id <value>`

#### `slk api admin conversations-search`

admin_conversations_search — read (GET /admin.conversations.search)

```sh
slk api admin conversations-search [options]
```

| Option | What it does |
|---|---|
| `--team-ids <value>` | Comma separated string of team IDs, signifying the workspaces to search through. |
| `--query <value>` | Name of the the channel to query by. |
| `--limit <value>` | Maximum number of items to be returned. Must be between 1 - 20 both inclusive. Default is 10. |
| `--cursor <value>` | Set `cursor` to `next_cursor` returned by the previous call to list items in the next page. |
| `--search-channel-types <value>` | The type of channel to include or exclude in the search. For example `private` will search private channels, while `private_exclude` will exclude them. For a full list of types, check the Types section. |
| `--sort <value>` | Possible values are `relevant` (search ranking based on what we think is closest), `name` (alphabetical), `member_count` (number of users in the channel), and `created` (date channel was created). You can optionally pair this with the `sort_dir` arg to change how it is sorted. |
| `--sort-dir <value>` | Sort direction. Possible values are `asc` for ascending order like (1, 2, 3) or (a, b, c), and `desc` for descending order like (3, 2, 1) or (c, b, a). |
| `--all` | read every page, as the API pages it. |

**Example:** `slk personal api admin conversations-search`

#### `slk api admin conversations-set-conversation-prefs`

admin_conversations_setConversationPrefs — write (POST /admin.conversations.setConversationPrefs)

**Changes something in the service.**

```sh
slk api admin conversations-set-conversation-prefs [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin conversations-set-conversation-prefs`

#### `slk api admin conversations-set-teams`

admin_conversations_setTeams — write (POST /admin.conversations.setTeams)

**Changes something in the service.**

```sh
slk api admin conversations-set-teams [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin conversations-set-teams`

#### `slk api admin conversations-unarchive`

admin_conversations_unarchive — write (POST /admin.conversations.unarchive)

**Changes something in the service.**

```sh
slk api admin conversations-unarchive [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin conversations-unarchive`

#### `slk api admin emoji-list`

admin_emoji_list — read (GET /admin.emoji.list)

```sh
slk api admin emoji-list [options]
```

| Option | What it does |
|---|---|
| `--cursor <value>` | Set `cursor` to `next_cursor` returned by the previous call to list items in the next page. |
| `--limit <value>` | The maximum number of items to return. Must be between 1 - 1000 both inclusive. |

**Example:** `slk personal api admin emoji-list`

#### `slk api admin invite-requests-approve`

admin_inviteRequests_approve — write (POST /admin.inviteRequests.approve)

**Changes something in the service.**

```sh
slk api admin invite-requests-approve [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin invite-requests-approve`

#### `slk api admin invite-requests-approved-list`

admin_inviteRequests_approved_list — read (GET /admin.inviteRequests.approved.list)

```sh
slk api admin invite-requests-approved-list [options]
```

| Option | What it does |
|---|---|
| `--team-id <value>` | ID for the workspace where the invite requests were made. |
| `--cursor <value>` | Value of the `next_cursor` field sent as part of the previous API response. |
| `--limit <value>` | The number of results that will be returned by the API on each invocation. Must be between 1 - 1000, both inclusive. |

**Example:** `slk personal api admin invite-requests-approved-list`

#### `slk api admin invite-requests-denied-list`

admin_inviteRequests_denied_list — read (GET /admin.inviteRequests.denied.list)

```sh
slk api admin invite-requests-denied-list [options]
```

| Option | What it does |
|---|---|
| `--team-id <value>` | ID for the workspace where the invite requests were made. |
| `--cursor <value>` | Value of the `next_cursor` field sent as part of the previous api response. |
| `--limit <value>` | The number of results that will be returned by the API on each invocation. Must be between 1 - 1000 both inclusive. |

**Example:** `slk personal api admin invite-requests-denied-list`

#### `slk api admin invite-requests-deny`

admin_inviteRequests_deny — write (POST /admin.inviteRequests.deny)

**Changes something in the service.**

```sh
slk api admin invite-requests-deny [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin invite-requests-deny`

#### `slk api admin invite-requests-list`

admin_inviteRequests_list — read (GET /admin.inviteRequests.list)

```sh
slk api admin invite-requests-list [options]
```

| Option | What it does |
|---|---|
| `--team-id <value>` | ID for the workspace where the invite requests were made. |
| `--cursor <value>` | Value of the `next_cursor` field sent as part of the previous API response. |
| `--limit <value>` | The number of results that will be returned by the API on each invocation. Must be between 1 - 1000, both inclusive. |

**Example:** `slk personal api admin invite-requests-list`

#### `slk api admin teams-admins-list`

admin_teams_admins_list — read (GET /admin.teams.admins.list)

```sh
slk api admin teams-admins-list [options]
```

| Option | What it does |
|---|---|
| `--limit <value>` | The maximum number of items to return. |
| `--cursor <value>` | Set `cursor` to `next_cursor` returned by the previous call to list items in the next page. |
| `--team-id <value>` | team_id. |

**Example:** `slk personal api admin teams-admins-list --team-id <value>`

#### `slk api admin teams-create`

admin_teams_create — write (POST /admin.teams.create)

**Changes something in the service.**

```sh
slk api admin teams-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin teams-create`

#### `slk api admin teams-list`

admin_teams_list — read (GET /admin.teams.list)

```sh
slk api admin teams-list [options]
```

| Option | What it does |
|---|---|
| `--limit <value>` | The maximum number of items to return. Must be between 1 - 100 both inclusive. |
| `--cursor <value>` | Set `cursor` to `next_cursor` returned by the previous call to list items in the next page. |

**Example:** `slk personal api admin teams-list`

#### `slk api admin teams-owners-list`

admin_teams_owners_list — read (GET /admin.teams.owners.list)

```sh
slk api admin teams-owners-list [options]
```

| Option | What it does |
|---|---|
| `--team-id <value>` | team_id. |
| `--limit <value>` | The maximum number of items to return. Must be between 1 - 1000 both inclusive. |
| `--cursor <value>` | Set `cursor` to `next_cursor` returned by the previous call to list items in the next page. |

**Example:** `slk personal api admin teams-owners-list --team-id <value>`

#### `slk api admin teams-settings-info`

admin_teams_settings_info — read (GET /admin.teams.settings.info)

```sh
slk api admin teams-settings-info [options]
```

| Option | What it does |
|---|---|
| `--team-id <value>` | team_id. |

**Example:** `slk personal api admin teams-settings-info --team-id <value>`

#### `slk api admin teams-settings-set-description`

admin_teams_settings_setDescription — write (POST /admin.teams.settings.setDescription)

**Changes something in the service.**

```sh
slk api admin teams-settings-set-description [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin teams-settings-set-description`

#### `slk api admin teams-settings-set-discoverability`

admin_teams_settings_setDiscoverability — write (POST /admin.teams.settings.setDiscoverability)

**Changes something in the service.**

```sh
slk api admin teams-settings-set-discoverability [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin teams-settings-set-discoverability`

#### `slk api admin teams-settings-set-name`

admin_teams_settings_setName — write (POST /admin.teams.settings.setName)

**Changes something in the service.**

```sh
slk api admin teams-settings-set-name [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin teams-settings-set-name`

#### `slk api admin usergroups-add-channels`

admin_usergroups_addChannels — write (POST /admin.usergroups.addChannels)

**Changes something in the service.**

```sh
slk api admin usergroups-add-channels [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin usergroups-add-channels`

#### `slk api admin usergroups-add-teams`

admin_usergroups_addTeams — write (POST /admin.usergroups.addTeams)

**Changes something in the service.**

```sh
slk api admin usergroups-add-teams [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin usergroups-add-teams`

#### `slk api admin usergroups-list-channels`

admin_usergroups_listChannels — read (GET /admin.usergroups.listChannels)

```sh
slk api admin usergroups-list-channels [options]
```

| Option | What it does |
|---|---|
| `--usergroup-id <value>` | ID of the IDP group to list default channels for. |
| `--team-id <value>` | ID of the the workspace. |
| `--include-num-members <value>` | Flag to include or exclude the count of members per channel. |

**Example:** `slk personal api admin usergroups-list-channels --usergroup-id <value>`

#### `slk api admin usergroups-remove-channels`

admin_usergroups_removeChannels — destructive (POST /admin.usergroups.removeChannels)

**Changes something in the service.**

```sh
slk api admin usergroups-remove-channels [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin usergroups-remove-channels`

#### `slk api admin users-assign`

admin_users_assign — write (POST /admin.users.assign)

**Changes something in the service.**

```sh
slk api admin users-assign [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin users-assign`

#### `slk api admin users-invite`

admin_users_invite — write (POST /admin.users.invite)

**Changes something in the service.**

```sh
slk api admin users-invite [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin users-invite`

#### `slk api admin users-list`

admin_users_list — read (GET /admin.users.list)

```sh
slk api admin users-list [options]
```

| Option | What it does |
|---|---|
| `--team-id <value>` | The ID (`T1234`) of the workspace. |
| `--cursor <value>` | Set `cursor` to `next_cursor` returned by the previous call to list items in the next page. |
| `--limit <value>` | Limit for how many users to be retrieved per page. |

**Example:** `slk personal api admin users-list --team-id <value>`

#### `slk api admin users-remove`

admin_users_remove — destructive (POST /admin.users.remove)

**Changes something in the service.**

```sh
slk api admin users-remove [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin users-remove`

#### `slk api admin users-session-invalidate`

admin_users_session_invalidate — destructive (POST /admin.users.session.invalidate)

**Changes something in the service.**

```sh
slk api admin users-session-invalidate [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin users-session-invalidate`

#### `slk api admin users-session-reset`

admin_users_session_reset — destructive (POST /admin.users.session.reset)

**Changes something in the service.**

```sh
slk api admin users-session-reset [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin users-session-reset`

#### `slk api admin users-set-admin`

admin_users_setAdmin — write (POST /admin.users.setAdmin)

**Changes something in the service.**

```sh
slk api admin users-set-admin [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin users-set-admin`

#### `slk api admin users-set-expiration`

admin_users_setExpiration — write (POST /admin.users.setExpiration)

**Changes something in the service.**

```sh
slk api admin users-set-expiration [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin users-set-expiration`

#### `slk api admin users-set-owner`

admin_users_setOwner — write (POST /admin.users.setOwner)

**Changes something in the service.**

```sh
slk api admin users-set-owner [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin users-set-owner`

#### `slk api admin users-set-regular`

admin_users_setRegular — write (POST /admin.users.setRegular)

**Changes something in the service.**

```sh
slk api admin users-set-regular [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api admin users-set-regular`

### `slk api api-test`

api_test — read (GET /api.test)

```sh
slk api api-test [options]
```

| Option | What it does |
|---|---|
| `--error <value>` | Error response to return. |
| `--foo <value>` | example property to return. |

**Example:** `slk personal api api-test`

### `slk api apps`

the apps operations

#### `slk api apps event-authorizations-list`

apps_event_authorizations_list — read (GET /apps.event.authorizations.list)

```sh
slk api apps event-authorizations-list [options]
```

| Option | What it does |
|---|---|
| `--event-context <value>` | event_context. |
| `--cursor <value>` | cursor. |
| `--limit <value>` | limit. |

**Example:** `slk personal api apps event-authorizations-list --event-context <value>`

#### `slk api apps permissions-info`

apps_permissions_info — read (GET /apps.permissions.info)

```sh
slk api apps permissions-info
```

**Example:** `slk personal api apps permissions-info`

#### `slk api apps permissions-request`

apps_permissions_request — write (GET /apps.permissions.request)

**Changes something in the service.**

```sh
slk api apps permissions-request [options]
```

| Option | What it does |
|---|---|
| `--scopes <value>` | A comma separated list of scopes to request for. |
| `--trigger-id <value>` | Token used to trigger the permissions API. |

**Example:** `slk personal api apps permissions-request --scopes <value> --trigger-id <value>`

#### `slk api apps permissions-resources-list`

apps_permissions_resources_list — read (GET /apps.permissions.resources.list)

```sh
slk api apps permissions-resources-list [options]
```

| Option | What it does |
|---|---|
| `--cursor <value>` | Paginate through collections of data by setting the `cursor` parameter to a `next_cursor` attribute returned by a previous request's `response_metadata`. Default value fetches the first "page" of the collection. See [pagination](https://api.slack.com/docs/pagination) for more detail. |
| `--limit <value>` | The maximum number of items to return. |
| `--all` | read every page, as the API pages it. |

**Example:** `slk personal api apps permissions-resources-list`

#### `slk api apps permissions-scopes-list`

apps_permissions_scopes_list — read (GET /apps.permissions.scopes.list)

```sh
slk api apps permissions-scopes-list
```

**Example:** `slk personal api apps permissions-scopes-list`

#### `slk api apps permissions-users-list`

apps_permissions_users_list — read (GET /apps.permissions.users.list)

```sh
slk api apps permissions-users-list [options]
```

| Option | What it does |
|---|---|
| `--cursor <value>` | Paginate through collections of data by setting the `cursor` parameter to a `next_cursor` attribute returned by a previous request's `response_metadata`. Default value fetches the first "page" of the collection. See [pagination](https://api.slack.com/docs/pagination) for more detail. |
| `--limit <value>` | The maximum number of items to return. |

**Example:** `slk personal api apps permissions-users-list`

#### `slk api apps permissions-users-request`

apps_permissions_users_request — write (GET /apps.permissions.users.request)

**Changes something in the service.**

```sh
slk api apps permissions-users-request [options]
```

| Option | What it does |
|---|---|
| `--scopes <value>` | A comma separated list of user scopes to request for. |
| `--trigger-id <value>` | Token used to trigger the request. |
| `--user <value>` | The user this scope is being requested for. |

**Example:** `slk personal api apps permissions-users-request --scopes <value> --trigger-id <value> --user <value>`

#### `slk api apps uninstall`

apps_uninstall — destructive (GET /apps.uninstall)

**Changes something in the service.**

```sh
slk api apps uninstall [options]
```

| Option | What it does |
|---|---|
| `--client-id <value>` | Issued when you created your application. |
| `--client-secret <value>` | Issued when you created your application. |

**Example:** `slk personal api apps uninstall`

### `slk api auth`

the auth operations

#### `slk api auth revoke`

auth_revoke — destructive (GET /auth.revoke)

**Changes something in the service.**

```sh
slk api auth revoke [options]
```

| Option | What it does |
|---|---|
| `--test <value>` | Setting this parameter to `1` triggers a _testing mode_ where the specified token will not actually be revoked. |

**Example:** `slk personal api auth revoke`

#### `slk api auth test`

auth_test — read (GET /auth.test)

```sh
slk api auth test
```

**Example:** `slk personal api auth test`

### `slk api bots-info`

bots_info — read (GET /bots.info)

```sh
slk api bots-info [options]
```

| Option | What it does |
|---|---|
| `--bot <value>` | Bot user to get info on. |

**Example:** `slk personal api bots-info`

### `slk api calls`

the calls operations

#### `slk api calls add`

calls_add — write (POST /calls.add)

**Changes something in the service.**

```sh
slk api calls add [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api calls add`

#### `slk api calls end`

calls_end — write (POST /calls.end)

**Changes something in the service.**

```sh
slk api calls end [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api calls end`

#### `slk api calls info`

calls_info — read (GET /calls.info)

```sh
slk api calls info [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | `id` of the Call returned by the [`calls.add`](https://api.slack.com/methods/calls.add) method. |

**Example:** `slk personal api calls info --id <value>`

#### `slk api calls participants-add`

calls_participants_add — write (POST /calls.participants.add)

**Changes something in the service.**

```sh
slk api calls participants-add [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api calls participants-add`

#### `slk api calls participants-remove`

calls_participants_remove — destructive (POST /calls.participants.remove)

**Changes something in the service.**

```sh
slk api calls participants-remove [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api calls participants-remove`

#### `slk api calls update`

calls_update — write (POST /calls.update)

**Changes something in the service.**

```sh
slk api calls update [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api calls update`

### `slk api chat`

the chat operations

#### `slk api chat delete`

chat_delete — destructive (POST /chat.delete)

**Changes something in the service.**

```sh
slk api chat delete [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api chat delete`

#### `slk api chat delete-scheduled-message`

chat_deleteScheduledMessage — destructive (POST /chat.deleteScheduledMessage)

**Changes something in the service.**

```sh
slk api chat delete-scheduled-message [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api chat delete-scheduled-message`

#### `slk api chat get-permalink`

chat_getPermalink — read (GET /chat.getPermalink)

```sh
slk api chat get-permalink [options]
```

| Option | What it does |
|---|---|
| `--channel <value>` | The ID of the conversation or channel containing the message. |
| `--message-ts <value>` | A message's `ts` value, uniquely identifying it within a channel. |

**Example:** `slk personal api chat get-permalink --channel <value> --message-ts <value>`

#### `slk api chat me-message`

chat_meMessage — write (POST /chat.meMessage)

**Changes something in the service.**

```sh
slk api chat me-message [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api chat me-message`

#### `slk api chat post-ephemeral`

chat_postEphemeral — write (POST /chat.postEphemeral)

**Changes something in the service.**

```sh
slk api chat post-ephemeral [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api chat post-ephemeral`

#### `slk api chat post-message`

chat_postMessage — write (POST /chat.postMessage)

**Changes something in the service.**

```sh
slk api chat post-message [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api chat post-message`

#### `slk api chat schedule-message`

chat_scheduleMessage — write (POST /chat.scheduleMessage)

**Changes something in the service.**

```sh
slk api chat schedule-message [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api chat schedule-message`

#### `slk api chat scheduled-messages-list`

chat_scheduledMessages_list — read (GET /chat.scheduledMessages.list)

```sh
slk api chat scheduled-messages-list [options]
```

| Option | What it does |
|---|---|
| `--channel <value>` | The channel of the scheduled messages. |
| `--latest <value>` | A UNIX timestamp of the latest value in the time range. |
| `--oldest <value>` | A UNIX timestamp of the oldest value in the time range. |
| `--limit <value>` | Maximum number of original entries to return. |
| `--cursor <value>` | For pagination purposes, this is the `cursor` value returned from a previous call to `chat.scheduledmessages.list` indicating where you want to start this call from. |
| `--all` | read every page, as the API pages it. |

**Example:** `slk personal api chat scheduled-messages-list`

#### `slk api chat unfurl`

chat_unfurl — write (POST /chat.unfurl)

**Changes something in the service.**

```sh
slk api chat unfurl [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api chat unfurl`

#### `slk api chat update`

chat_update — write (POST /chat.update)

**Changes something in the service.**

```sh
slk api chat update [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api chat update`

### `slk api conversations`

the conversations operations

#### `slk api conversations archive`

conversations_archive — destructive (POST /conversations.archive)

**Changes something in the service.**

```sh
slk api conversations archive [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api conversations archive`

#### `slk api conversations close`

conversations_close — write (POST /conversations.close)

**Changes something in the service.**

```sh
slk api conversations close [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api conversations close`

#### `slk api conversations create`

conversations_create — write (POST /conversations.create)

**Changes something in the service.**

```sh
slk api conversations create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api conversations create`

#### `slk api conversations history`

conversations_history — read (GET /conversations.history)

```sh
slk api conversations history [options]
```

| Option | What it does |
|---|---|
| `--channel <value>` | Conversation ID to fetch history for. |
| `--latest <value>` | End of time range of messages to include in results. |
| `--oldest <value>` | Start of time range of messages to include in results. |
| `--inclusive <value>` | Include messages with latest or oldest timestamp in results only when either timestamp is specified. |
| `--limit <value>` | The maximum number of items to return. Fewer than the requested number of items may be returned, even if the end of the users list hasn't been reached. |
| `--cursor <value>` | Paginate through collections of data by setting the `cursor` parameter to a `next_cursor` attribute returned by a previous request's `response_metadata`. Default value fetches the first "page" of the collection. See [pagination](https://api.slack.com/docs/pagination) for more detail. |
| `--all` | read every page, as the API pages it. |

**Example:** `slk personal api conversations history --channel <value>`

#### `slk api conversations info`

conversations_info — read (GET /conversations.info)

```sh
slk api conversations info [options]
```

| Option | What it does |
|---|---|
| `--channel <value>` | Conversation ID to learn more about. |
| `--include-locale <value>` | Set this to `true` to receive the locale for this conversation. Defaults to `false`. |
| `--include-num-members <value>` | Set to `true` to include the member count for the specified conversation. Defaults to `false`. |

**Example:** `slk personal api conversations info --channel <value>`

#### `slk api conversations invite`

conversations_invite — write (POST /conversations.invite)

**Changes something in the service.**

```sh
slk api conversations invite [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api conversations invite`

#### `slk api conversations join`

conversations_join — write (POST /conversations.join)

**Changes something in the service.**

```sh
slk api conversations join [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api conversations join`

#### `slk api conversations kick`

conversations_kick — destructive (POST /conversations.kick)

**Changes something in the service.**

```sh
slk api conversations kick [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api conversations kick`

#### `slk api conversations leave`

conversations_leave — destructive (POST /conversations.leave)

**Changes something in the service.**

```sh
slk api conversations leave [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api conversations leave`

#### `slk api conversations list`

conversations_list — read (GET /conversations.list)

```sh
slk api conversations list [options]
```

| Option | What it does |
|---|---|
| `--exclude-archived <value>` | Set to `true` to exclude archived channels from the list. |
| `--types <value>` | Mix and match channel types by providing a comma-separated list of any combination of `public_channel`, `private_channel`, `mpim`, `im`. |
| `--limit <value>` | The maximum number of items to return. Fewer than the requested number of items may be returned, even if the end of the list hasn't been reached. Must be an integer no larger than 1000. |
| `--cursor <value>` | Paginate through collections of data by setting the `cursor` parameter to a `next_cursor` attribute returned by a previous request's `response_metadata`. Default value fetches the first "page" of the collection. See [pagination](https://api.slack.com/docs/pagination) for more detail. |
| `--all` | read every page, as the API pages it. |

**Example:** `slk personal api conversations list`

#### `slk api conversations mark`

conversations_mark — write (POST /conversations.mark)

**Changes something in the service.**

```sh
slk api conversations mark [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api conversations mark`

#### `slk api conversations members`

conversations_members — read (GET /conversations.members)

```sh
slk api conversations members [options]
```

| Option | What it does |
|---|---|
| `--channel <value>` | ID of the conversation to retrieve members for. |
| `--limit <value>` | The maximum number of items to return. Fewer than the requested number of items may be returned, even if the end of the users list hasn't been reached. |
| `--cursor <value>` | Paginate through collections of data by setting the `cursor` parameter to a `next_cursor` attribute returned by a previous request's `response_metadata`. Default value fetches the first "page" of the collection. See [pagination](https://api.slack.com/docs/pagination) for more detail. |
| `--all` | read every page, as the API pages it. |

**Example:** `slk personal api conversations members --channel <value>`

#### `slk api conversations open`

conversations_open — write (POST /conversations.open)

**Changes something in the service.**

```sh
slk api conversations open [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api conversations open`

#### `slk api conversations rename`

conversations_rename — write (POST /conversations.rename)

**Changes something in the service.**

```sh
slk api conversations rename [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api conversations rename`

#### `slk api conversations replies`

conversations_replies — read (GET /conversations.replies)

```sh
slk api conversations replies [options]
```

| Option | What it does |
|---|---|
| `--channel <value>` | Conversation ID to fetch thread from. |
| `--ts <value>` | Unique identifier of a thread's parent message. `ts` must be the timestamp of an existing message with 0 or more replies. If there are no replies then just the single message referenced by `ts` will return - it is just an ordinary, unthreaded message. |
| `--latest <value>` | End of time range of messages to include in results. |
| `--oldest <value>` | Start of time range of messages to include in results. |
| `--inclusive <value>` | Include messages with latest or oldest timestamp in results only when either timestamp is specified. |
| `--limit <value>` | The maximum number of items to return. Fewer than the requested number of items may be returned, even if the end of the users list hasn't been reached. |
| `--cursor <value>` | Paginate through collections of data by setting the `cursor` parameter to a `next_cursor` attribute returned by a previous request's `response_metadata`. Default value fetches the first "page" of the collection. See [pagination](https://api.slack.com/docs/pagination) for more detail. |
| `--all` | read every page, as the API pages it. |

**Example:** `slk personal api conversations replies --channel <value> --ts <value>`

#### `slk api conversations set-purpose`

conversations_setPurpose — write (POST /conversations.setPurpose)

**Changes something in the service.**

```sh
slk api conversations set-purpose [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api conversations set-purpose`

#### `slk api conversations set-topic`

conversations_setTopic — write (POST /conversations.setTopic)

**Changes something in the service.**

```sh
slk api conversations set-topic [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api conversations set-topic`

#### `slk api conversations unarchive`

conversations_unarchive — write (POST /conversations.unarchive)

**Changes something in the service.**

```sh
slk api conversations unarchive [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api conversations unarchive`

### `slk api dialog-open`

dialog_open — write (GET /dialog.open)

**Changes something in the service.**

```sh
slk api dialog-open [options]
```

| Option | What it does |
|---|---|
| `--dialog <value>` | The dialog definition. This must be a JSON-encoded string. |
| `--trigger-id <value>` | Exchange a trigger to post to the user. |

**Example:** `slk personal api dialog-open --dialog <value> --trigger-id <value>`

### `slk api dnd`

the dnd operations

#### `slk api dnd end-dnd`

dnd_endDnd — write (POST /dnd.endDnd)

**Changes something in the service.**

```sh
slk api dnd end-dnd
```

**Example:** `slk personal api dnd end-dnd`

#### `slk api dnd end-snooze`

dnd_endSnooze — write (POST /dnd.endSnooze)

**Changes something in the service.**

```sh
slk api dnd end-snooze
```

**Example:** `slk personal api dnd end-snooze`

#### `slk api dnd info`

dnd_info — read (GET /dnd.info)

```sh
slk api dnd info [options]
```

| Option | What it does |
|---|---|
| `--user <value>` | User to fetch status for (defaults to current user). |

**Example:** `slk personal api dnd info`

#### `slk api dnd team-info`

dnd_teamInfo — read (GET /dnd.teamInfo)

```sh
slk api dnd team-info [options]
```

| Option | What it does |
|---|---|
| `--users <value>` | Comma-separated list of users to fetch Do Not Disturb status for. |

**Example:** `slk personal api dnd team-info`

### `slk api emoji-list`

emoji_list — read (GET /emoji.list)

```sh
slk api emoji-list
```

**Example:** `slk personal api emoji-list`

### `slk api files`

the files operations

#### `slk api files comments-delete`

files_comments_delete — destructive (POST /files.comments.delete)

**Changes something in the service.**

```sh
slk api files comments-delete [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api files comments-delete`

#### `slk api files delete`

files_delete — destructive (POST /files.delete)

**Changes something in the service.**

```sh
slk api files delete [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api files delete`

#### `slk api files info`

files_info — read (GET /files.info)

```sh
slk api files info [options]
```

| Option | What it does |
|---|---|
| `--file <value>` | Specify a file by providing its ID. |
| `--count <value>` | count. |
| `--page <value>` | page. |
| `--limit <value>` | The maximum number of items to return. Fewer than the requested number of items may be returned, even if the end of the list hasn't been reached. |
| `--cursor <value>` | Parameter for pagination. File comments are paginated for a single file. Set `cursor` equal to the `next_cursor` attribute returned by the previous request's `response_metadata`. This parameter is optional, but pagination is mandatory: the default value simply fetches the first "page" of the collection of comments. See [pagination](https://api.slack.com/docs/pagination) for more details. |
| `--all` | read every page, as the API pages it. |

**Example:** `slk personal api files info`

#### `slk api files list`

files_list — read (GET /files.list)

```sh
slk api files list [options]
```

| Option | What it does |
|---|---|
| `--user <value>` | Filter files created by a single user. |
| `--channel <value>` | Filter files appearing in a specific channel, indicated by its ID. |
| `--ts-from <value>` | Filter files created after this timestamp (inclusive). |
| `--ts-to <value>` | Filter files created before this timestamp (inclusive). |
| `--types <value>` | Filter files by type (see below). You can pass multiple values in the types argument, like `types=spaces,snippets`.The default value is `all`, which does not filter the list. |
| `--count <value>` | count. |
| `--page <value>` | page. |
| `--show-files-hidden-by-limit <value>` | Show truncated file info for files hidden due to being too old, and the team who owns the file being over the file limit. |
| `--all` | read every page, as the API pages it. |

**Example:** `slk personal api files list`

#### `slk api files remote-info`

files_remote_info — read (GET /files.remote.info)

```sh
slk api files remote-info [options]
```

| Option | What it does |
|---|---|
| `--file <value>` | Specify a file by providing its ID. |
| `--external-id <value>` | Creator defined GUID for the file. |

**Example:** `slk personal api files remote-info`

#### `slk api files remote-list`

files_remote_list — read (GET /files.remote.list)

```sh
slk api files remote-list [options]
```

| Option | What it does |
|---|---|
| `--channel <value>` | Filter files appearing in a specific channel, indicated by its ID. |
| `--ts-from <value>` | Filter files created after this timestamp (inclusive). |
| `--ts-to <value>` | Filter files created before this timestamp (inclusive). |
| `--limit <value>` | The maximum number of items to return. |
| `--cursor <value>` | Paginate through collections of data by setting the `cursor` parameter to a `next_cursor` attribute returned by a previous request's `response_metadata`. Default value fetches the first "page" of the collection. See [pagination](https://api.slack.com/docs/pagination) for more detail. |

**Example:** `slk personal api files remote-list`

#### `slk api files remote-share`

files_remote_share — write (GET /files.remote.share)

**Changes something in the service.**

```sh
slk api files remote-share [options]
```

| Option | What it does |
|---|---|
| `--file <value>` | Specify a file registered with Slack by providing its ID. Either this field or `external_id` or both are required. |
| `--external-id <value>` | The globally unique identifier (GUID) for the file, as set by the app registering the file with Slack.  Either this field or `file` or both are required. |
| `--channels <value>` | Comma-separated list of channel IDs where the file will be shared. |

**Example:** `slk personal api files remote-share`

#### `slk api files revoke-public-url`

files_revokePublicURL — destructive (POST /files.revokePublicURL)

**Changes something in the service.**

```sh
slk api files revoke-public-url [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api files revoke-public-url`

#### `slk api files shared-public-url`

files_sharedPublicURL — write (POST /files.sharedPublicURL)

**Changes something in the service.**

```sh
slk api files shared-public-url [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api files shared-public-url`

### `slk api migration-exchange`

migration_exchange — read (GET /migration.exchange)

```sh
slk api migration-exchange [options]
```

| Option | What it does |
|---|---|
| `--users <value>` | A comma-separated list of user ids, up to 400 per request. |
| `--team-id <value>` | Specify team_id starts with `T` in case of Org Token. |
| `--to-old <value>` | Specify `true` to convert `W` global user IDs to workspace-specific `U` IDs. Defaults to `false`. |

**Example:** `slk personal api migration-exchange --users <value>`

### `slk api pins`

the pins operations

#### `slk api pins add`

pins_add — write (POST /pins.add)

**Changes something in the service.**

```sh
slk api pins add [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api pins add`

#### `slk api pins list`

pins_list — read (GET /pins.list)

```sh
slk api pins list [options]
```

| Option | What it does |
|---|---|
| `--channel <value>` | Channel to get pinned items for. |

**Example:** `slk personal api pins list --channel <value>`

#### `slk api pins remove`

pins_remove — destructive (POST /pins.remove)

**Changes something in the service.**

```sh
slk api pins remove [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api pins remove`

### `slk api reactions`

the reactions operations

#### `slk api reactions add`

reactions_add — write (POST /reactions.add)

**Changes something in the service.**

```sh
slk api reactions add [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api reactions add`

#### `slk api reactions get`

reactions_get — read (GET /reactions.get)

```sh
slk api reactions get [options]
```

| Option | What it does |
|---|---|
| `--channel <value>` | Channel where the message to get reactions for was posted. |
| `--file <value>` | File to get reactions for. |
| `--file-comment <value>` | File comment to get reactions for. |
| `--full <value>` | If true always return the complete reaction list. |
| `--timestamp <value>` | Timestamp of the message to get reactions for. |

**Example:** `slk personal api reactions get`

#### `slk api reactions list`

reactions_list — read (GET /reactions.list)

```sh
slk api reactions list [options]
```

| Option | What it does |
|---|---|
| `--user <value>` | Show reactions made by this user. Defaults to the authed user. |
| `--full <value>` | If true always return the complete reaction list. |
| `--count <value>` | count. |
| `--page <value>` | page. |
| `--cursor <value>` | Parameter for pagination. Set `cursor` equal to the `next_cursor` attribute returned by the previous request's `response_metadata`. This parameter is optional, but pagination is mandatory: the default value simply fetches the first "page" of the collection. See [pagination](https://api.slack.com/docs/pagination) for more details. |
| `--limit <value>` | The maximum number of items to return. Fewer than the requested number of items may be returned, even if the end of the list hasn't been reached. |
| `--all` | read every page, as the API pages it. |

**Example:** `slk personal api reactions list`

#### `slk api reactions remove`

reactions_remove — destructive (POST /reactions.remove)

**Changes something in the service.**

```sh
slk api reactions remove [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api reactions remove`

### `slk api reminders`

the reminders operations

#### `slk api reminders add`

reminders_add — write (POST /reminders.add)

**Changes something in the service.**

```sh
slk api reminders add [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api reminders add`

#### `slk api reminders complete`

reminders_complete — write (POST /reminders.complete)

**Changes something in the service.**

```sh
slk api reminders complete [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api reminders complete`

#### `slk api reminders delete`

reminders_delete — destructive (POST /reminders.delete)

**Changes something in the service.**

```sh
slk api reminders delete [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api reminders delete`

#### `slk api reminders info`

reminders_info — read (GET /reminders.info)

```sh
slk api reminders info [options]
```

| Option | What it does |
|---|---|
| `--reminder <value>` | The ID of the reminder. |

**Example:** `slk personal api reminders info`

#### `slk api reminders list`

reminders_list — read (GET /reminders.list)

```sh
slk api reminders list
```

**Example:** `slk personal api reminders list`

### `slk api search-messages`

search_messages — read (GET /search.messages)

```sh
slk api search-messages [options]
```

| Option | What it does |
|---|---|
| `--count <value>` | Pass the number of results you want per "page". Maximum of `100`. |
| `--highlight <value>` | Pass a value of `true` to enable query highlight markers (see below). |
| `--page <value>` | page. |
| `--query <value>` | Search query. |
| `--sort <value>` | Return matches sorted by either `score` or `timestamp`. |
| `--sort-dir <value>` | Change sort direction to ascending (`asc`) or descending (`desc`). |

**Example:** `slk personal api search-messages --query <value>`

### `slk api stars`

the stars operations

#### `slk api stars add`

stars_add — write (POST /stars.add)

**Changes something in the service.**

```sh
slk api stars add [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api stars add`

#### `slk api stars list`

stars_list — read (GET /stars.list)

```sh
slk api stars list [options]
```

| Option | What it does |
|---|---|
| `--count <value>` | count. |
| `--page <value>` | page. |
| `--cursor <value>` | Parameter for pagination. Set `cursor` equal to the `next_cursor` attribute returned by the previous request's `response_metadata`. This parameter is optional, but pagination is mandatory: the default value simply fetches the first "page" of the collection. See [pagination](https://api.slack.com/docs/pagination) for more details. |
| `--limit <value>` | The maximum number of items to return. Fewer than the requested number of items may be returned, even if the end of the list hasn't been reached. |
| `--all` | read every page, as the API pages it. |

**Example:** `slk personal api stars list`

#### `slk api stars remove`

stars_remove — destructive (POST /stars.remove)

**Changes something in the service.**

```sh
slk api stars remove [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api stars remove`

### `slk api team`

the team operations

#### `slk api team access-logs`

team_accessLogs — read (GET /team.accessLogs)

```sh
slk api team access-logs [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | End of time range of logs to include in results (inclusive). |
| `--count <value>` | count. |
| `--page <value>` | page. |

**Example:** `slk personal api team access-logs`

#### `slk api team billable-info`

team_billableInfo — read (GET /team.billableInfo)

```sh
slk api team billable-info [options]
```

| Option | What it does |
|---|---|
| `--user <value>` | A user to retrieve the billable information for. Defaults to all users. |

**Example:** `slk personal api team billable-info`

#### `slk api team info`

team_info — read (GET /team.info)

```sh
slk api team info [options]
```

| Option | What it does |
|---|---|
| `--team <value>` | Team to get info on, if omitted, will return information about the current team. Will only return team that the authenticated token is allowed to see through external shared channels. |

**Example:** `slk personal api team info`

#### `slk api team integration-logs`

team_integrationLogs — read (GET /team.integrationLogs)

```sh
slk api team integration-logs [options]
```

| Option | What it does |
|---|---|
| `--app-id <value>` | Filter logs to this Slack app. Defaults to all logs. |
| `--change-type <value>` | Filter logs with this change type. Defaults to all logs. |
| `--count <value>` | count. |
| `--page <value>` | page. |
| `--service-id <value>` | Filter logs to this service. Defaults to all logs. |
| `--user <value>` | Filter logs generated by this user’s actions. Defaults to all logs. |

**Example:** `slk personal api team integration-logs`

#### `slk api team profile-get`

team_profile_get — read (GET /team.profile.get)

```sh
slk api team profile-get [options]
```

| Option | What it does |
|---|---|
| `--visibility <value>` | Filter by visibility. |

**Example:** `slk personal api team profile-get`

### `slk api usergroups`

the usergroups operations

#### `slk api usergroups create`

usergroups_create — write (POST /usergroups.create)

**Changes something in the service.**

```sh
slk api usergroups create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api usergroups create`

#### `slk api usergroups disable`

usergroups_disable — destructive (POST /usergroups.disable)

**Changes something in the service.**

```sh
slk api usergroups disable [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api usergroups disable`

#### `slk api usergroups enable`

usergroups_enable — write (POST /usergroups.enable)

**Changes something in the service.**

```sh
slk api usergroups enable [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api usergroups enable`

#### `slk api usergroups list`

usergroups_list — read (GET /usergroups.list)

```sh
slk api usergroups list [options]
```

| Option | What it does |
|---|---|
| `--include-users <value>` | Include the list of users for each User Group. |
| `--include-count <value>` | Include the number of users in each User Group. |
| `--include-disabled <value>` | Include disabled User Groups. |

**Example:** `slk personal api usergroups list`

#### `slk api usergroups update`

usergroups_update — write (POST /usergroups.update)

**Changes something in the service.**

```sh
slk api usergroups update [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api usergroups update`

#### `slk api usergroups users-list`

usergroups_users_list — read (GET /usergroups.users.list)

```sh
slk api usergroups users-list [options]
```

| Option | What it does |
|---|---|
| `--include-disabled <value>` | Allow results that involve disabled User Groups. |
| `--usergroup <value>` | The encoded ID of the User Group to update. |

**Example:** `slk personal api usergroups users-list --usergroup <value>`

#### `slk api usergroups users-update`

usergroups_users_update — write (POST /usergroups.users.update)

**Changes something in the service.**

```sh
slk api usergroups users-update [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api usergroups users-update`

### `slk api users`

the users operations

#### `slk api users conversations`

users_conversations — read (GET /users.conversations)

```sh
slk api users conversations [options]
```

| Option | What it does |
|---|---|
| `--user <value>` | Browse conversations by a specific user ID's membership. Non-public channels are restricted to those where the calling user shares membership. |
| `--types <value>` | Mix and match channel types by providing a comma-separated list of any combination of `public_channel`, `private_channel`, `mpim`, `im`. |
| `--exclude-archived <value>` | Set to `true` to exclude archived channels from the list. |
| `--limit <value>` | The maximum number of items to return. Fewer than the requested number of items may be returned, even if the end of the list hasn't been reached. Must be an integer no larger than 1000. |
| `--cursor <value>` | Paginate through collections of data by setting the `cursor` parameter to a `next_cursor` attribute returned by a previous request's `response_metadata`. Default value fetches the first "page" of the collection. See [pagination](https://api.slack.com/docs/pagination) for more detail. |
| `--all` | read every page, as the API pages it. |

**Example:** `slk personal api users conversations`

#### `slk api users get-presence`

users_getPresence — read (GET /users.getPresence)

```sh
slk api users get-presence [options]
```

| Option | What it does |
|---|---|
| `--user <value>` | User to get presence info on. Defaults to the authed user. |

**Example:** `slk personal api users get-presence`

#### `slk api users identity`

users_identity — read (GET /users.identity)

```sh
slk api users identity
```

**Example:** `slk personal api users identity`

#### `slk api users info`

users_info — read (GET /users.info)

```sh
slk api users info [options]
```

| Option | What it does |
|---|---|
| `--include-locale <value>` | Set this to `true` to receive the locale for this user. Defaults to `false`. |
| `--user <value>` | User to get info on. |

**Example:** `slk personal api users info`

#### `slk api users list`

users_list — read (GET /users.list)

```sh
slk api users list [options]
```

| Option | What it does |
|---|---|
| `--limit <value>` | The maximum number of items to return. Fewer than the requested number of items may be returned, even if the end of the users list hasn't been reached. Providing no `limit` value will result in Slack attempting to deliver you the entire result set. If the collection is too large you may experience `limit_required` or HTTP 500 errors. |
| `--cursor <value>` | Paginate through collections of data by setting the `cursor` parameter to a `next_cursor` attribute returned by a previous request's `response_metadata`. Default value fetches the first "page" of the collection. See [pagination](https://api.slack.com/docs/pagination) for more detail. |
| `--include-locale <value>` | Set this to `true` to receive the locale for users. Defaults to `false`. |
| `--all` | read every page, as the API pages it. |

**Example:** `slk personal api users list`

#### `slk api users lookup-by-email`

users_lookupByEmail — read (GET /users.lookupByEmail)

```sh
slk api users lookup-by-email [options]
```

| Option | What it does |
|---|---|
| `--email <value>` | An email address belonging to a user in the workspace. |

**Example:** `slk personal api users lookup-by-email --email <value>`

#### `slk api users profile-get`

users_profile_get — read (GET /users.profile.get)

```sh
slk api users profile-get [options]
```

| Option | What it does |
|---|---|
| `--include-labels <value>` | Include labels for each ID in custom profile fields. |
| `--user <value>` | User to retrieve profile info for. |

**Example:** `slk personal api users profile-get`

#### `slk api users profile-set`

users_profile_set — write (POST /users.profile.set)

**Changes something in the service.**

```sh
slk api users profile-set [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api users profile-set`

#### `slk api users set-active`

users_setActive — write (POST /users.setActive)

**Changes something in the service.**

```sh
slk api users set-active
```

**Example:** `slk personal api users set-active`

#### `slk api users set-presence`

users_setPresence — write (POST /users.setPresence)

**Changes something in the service.**

```sh
slk api users set-presence [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `slk personal api users set-presence`

### `slk api views`

the views operations

#### `slk api views open`

views_open — write (GET /views.open)

**Changes something in the service.**

```sh
slk api views open [options]
```

| Option | What it does |
|---|---|
| `--trigger-id <value>` | Exchange a trigger to post to the user. |
| `--view <value>` | A [view payload](https://api.slack.com/reference/surfaces/views). This must be a JSON-encoded string. |

**Example:** `slk personal api views open --trigger-id <value> --view <value>`

#### `slk api views publish`

views_publish — write (GET /views.publish)

**Changes something in the service.**

```sh
slk api views publish [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | `id` of the user you want publish a view to. |
| `--view <value>` | A [view payload](https://api.slack.com/reference/surfaces/views). This must be a JSON-encoded string. |
| `--hash <value>` | A string that represents view state to protect against possible race conditions. |

**Example:** `slk personal api views publish --user-id <value> --view <value>`

#### `slk api views push`

views_push — write (GET /views.push)

**Changes something in the service.**

```sh
slk api views push [options]
```

| Option | What it does |
|---|---|
| `--trigger-id <value>` | Exchange a trigger to post to the user. |
| `--view <value>` | A [view payload](https://api.slack.com/reference/surfaces/views). This must be a JSON-encoded string. |

**Example:** `slk personal api views push --trigger-id <value> --view <value>`

#### `slk api views update`

views_update — write (GET /views.update)

**Changes something in the service.**

```sh
slk api views update [options]
```

| Option | What it does |
|---|---|
| `--view-id <value>` | A unique identifier of the view to be updated. Either `view_id` or `external_id` is required. |
| `--external-id <value>` | A unique identifier of the view set by the developer. Must be unique for all views on a team. Max length of 255 characters. Either `view_id` or `external_id` is required. |
| `--view <value>` | A [view object](https://api.slack.com/reference/surfaces/views). This must be a JSON-encoded string. |
| `--hash <value>` | A string that represents view state to protect against possible race conditions. |

**Example:** `slk personal api views update`

### `slk api workflows`

the workflows operations

#### `slk api workflows step-completed`

workflows_stepCompleted — write (GET /workflows.stepCompleted)

**Changes something in the service.**

```sh
slk api workflows step-completed [options]
```

| Option | What it does |
|---|---|
| `--workflow-step-execute-id <value>` | Context identifier that maps to the correct workflow step execution. |
| `--outputs <value>` | Key-value object of outputs from your step. Keys of this object reflect the configured `key` properties of your [`outputs`](https://api.slack.com/reference/workflows/workflow_step#output) array from your `workflow_step` object. |

**Example:** `slk personal api workflows step-completed --workflow-step-execute-id <value>`

#### `slk api workflows step-failed`

workflows_stepFailed — write (GET /workflows.stepFailed)

**Changes something in the service.**

```sh
slk api workflows step-failed [options]
```

| Option | What it does |
|---|---|
| `--workflow-step-execute-id <value>` | Context identifier that maps to the correct workflow step execution. |
| `--error <value>` | A JSON-based object with a `message` property that should contain a human readable error message. |

**Example:** `slk personal api workflows step-failed --workflow-step-execute-id <value> --error <value>`

#### `slk api workflows update-step`

workflows_updateStep — write (GET /workflows.updateStep)

**Changes something in the service.**

```sh
slk api workflows update-step [options]
```

| Option | What it does |
|---|---|
| `--workflow-step-edit-id <value>` | A context identifier provided with `view_submission` payloads used to call back to `workflows.updateStep`. |
| `--inputs <value>` | A JSON key-value map of inputs required from a user during configuration. This is the data your app expects to receive when the workflow step starts. **Please note**: the embedded variable format is set and replaced by the workflow system. You cannot create custom variables that will be replaced at runtime. [Read more about variables in workflow steps here](https://api.slack.com/workflows/steps#variables). |
| `--outputs <value>` | An JSON array of output objects used during step execution. This is the data your app agrees to provide when your workflow step was executed. |
| `--step-name <value>` | An optional field that can be used to override the step name that is shown in the Workflow Builder. |
| `--step-image-url <value>` | An optional field that can be used to override app image that is shown in the Workflow Builder. |

**Example:** `slk personal api workflows update-step --workflow-step-edit-id <value>`

## `slk doctor`

the state this installation is in, without connecting unless --online

```sh
slk doctor [options]
```

| Option | What it does |
|---|---|
| `--online` | also connect once and read the account; sends nothing. |

**Example:** `slk personal doctor`

### `slk doctor reports`

problem reports

#### `slk doctor reports show`

what a problem report holds; writes nothing

```sh
slk doctor reports show
```

**Example:** `slk personal doctor reports show`

#### `slk doctor reports create`

write a problem report to a file, and say where to send it

**Changes something on this computer only.**

```sh
slk doctor reports create [options]
```

| Option | What it does |
|---|---|
| `--run <id>` | the run the report is about; the newest failed one if not given. |
| `--output <file>` | where to write it; a new file in this directory if not given. |

**Example:** `slk personal doctor reports create --output ./problem-report.json`

## `slk complete`

shell completion: `slk complete zsh` prints the script to source

```sh
slk complete [words]
```

| Argument | | What it is |
|---|---|---|
| `words` | optional | zsh for the shell script, or command words to complete. |

**Example:** `slk complete zsh`

## `slk skill`

the instructions an agent is given for this tool

### `slk skill show`

print SKILL.md — `slk skill install` puts it where Claude Code, Codex, Gemini CLI and OpenClaw look for it, and where Hermes does on request; --for prints the copy already there

```sh
slk skill show [name] [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | optional | a part of this skill, or a skill shipped for a task: api-workflows, api-views, api-users, api-usergroups, api-team, api-stars, api-search, api-reminders, api-reactions, api-pins, api-migration, api-files, api-emoji, api-dnd, api-dialog, api-conversations, api-chat, api-calls, api-bots, api-auth, api-apps, api-api, api-admin, api, follow-ups, link-conversations. |

| Option | What it does |
|---|---|
| `--for <agents>` | print the copy installed for these agents instead of this version's. One of: `claude`, `agents`. |

**Example:** `slk skill show`, `slk skill show follow-ups`

### `slk skill install`

write SKILL.md to \~/.claude/skills/slack-cli/ (Claude Code) and \~/.agents/skills/slack-cli/ (Codex, Gemini CLI, OpenClaw); --for hermes also has Hermes read \~/.agents/skills, which changes Hermes's own settings, so all leaves it out

**Changes something on this computer only.**

```sh
slk skill install [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `hermes`, `all`. Default: `all`. |

**Example:** `slk skill install --for agents`

### `slk skill status`

for each place `slk skill install` writes to, and for the copy Hermes reads: the path, the version installed there, and whether it is current, stale, missing or unversioned

```sh
slk skill status
```

**Example:** `slk skill status`, `slk skill status --json`

## `slk mcp`

serve this profile to an agent over MCP and set it up — `claude mcp add slk -- slk <profile> mcp serve`

### `slk mcp serve`

serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add slk -- slk <profile> mcp serve`; `slk mcp serve --profiles a,b` or `--profiles all` serves those profiles from one server and each tool asks which

**Changes something in the service.**

```sh
slk mcp serve [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like messages.list=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |
| `--http` | serve over HTTP on 127.0.0.1 for ChatGPT and Claude in the browser, behind your tunnel; the profile's permissions decide. |
| `--port <port>` | the local port for --http (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |

**Example:** `slk personal mcp serve`, `slk mcp serve --profiles work,personal`, `slk personal mcp serve --http --public-url https://laptop.example.ts.net`

### `slk mcp revoke`

forget every login `mcp serve --http` gave a browser app, of this profile or of the server `--profiles` names; each app must log in again

**Changes something on this computer only.**

```sh
slk mcp revoke [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `slk personal mcp revoke`, `slk mcp revoke --profiles all`

### `slk mcp server`

start, stop and check `mcp serve --http` in the background; status shows the login code for a browser app

#### `slk mcp server start`

start `mcp serve --http` apart from this shell and answer once it listens, with its login code

**Changes something on this computer only.**

```sh
slk mcp server start [options]
```

| Option | What it does |
|---|---|
| `--port <port>` | the local port (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |
| `--permission <key=level>` | make a permission stricter for this server only; repeat for more keys. |
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `slk personal mcp server start --public-url https://laptop.example.ts.net`

#### `slk mcp server stop`

stop `mcp serve --http` — only one that `mcp server start` started

**Changes something on this computer only.**

```sh
slk mcp server stop [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `slk personal mcp server stop`

#### `slk mcp server status`

whether `mcp serve --http` runs, on which port and address, the login code for a new browser app, and the apps logged in

```sh
slk mcp server status [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `slk personal mcp server status --json`

### `slk mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
slk mcp config [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like messages.list=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `slk personal mcp config`, `slk mcp config --profiles all`

### `slk mcp add`

add this profile's local MCP server to Codex or Claude Code

**Changes something on this computer only.**

```sh
slk mcp add <client> [options]
```

| Argument | | What it is |
|---|---|---|
| `client` | required | codex or claude-code. |

| Option | What it does |
|---|---|
| `--allow-writes` | acknowledge that this profile offers writing tools. |
| `--permission <key=level>` | make a permission stricter for this server only, like messages.list=deny; it never loosens the profile; repeat for more keys. |

**Example:** `slk personal mcp add codex --allow-writes`

### `slk mcp check`

check this profile's local MCP handshake and tool list

```sh
slk mcp check [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like messages.list=deny; it never loosens the profile; repeat for more keys. |

**Example:** `slk personal mcp check`

## `slk upgrade`

upgrade slk with the package manager that installed it; --check only looks

**Changes something on this computer only.**

```sh
slk upgrade [options]
```

| Option | What it does |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |

**Example:** `slk upgrade --check`

## `slk config`

the settings in force, and where each one came from

### `slk config show`

the profile, the profiles that exist, and each setting with where it came from

```sh
slk config show [options]
```

| Option | What it does |
|---|---|
| `--bot` | the settings a bot command on this profile gets, rather than the personal account's. |

**Example:** `slk personal config show`

### `slk config set`

save a setting to the configuration file

**Changes something on this computer only.**

```sh
slk config set <setting> <value> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, sender_colors, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, sends_per_hour, requests_per_minute, transcribe_with, speech_model, search_catch_up, history_dialog_days, history_group_days, history_group_members_max, history_muted, picture_search, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, thread_window_days, inbox_channels, inbox_all_channels, read_other_bots, update_check, skill_hint, thread_window_days, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, phone_countries, task_categories.<name>, task_agent_close, task_agent_close_min, task_first_pass_per_chat, account_groups.<name>, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities, crm.<provider>:<account>.files.max_files, crm.<provider>:<account>.files.max_file_mb, crm.<provider>:<account>.files.max_run_mb, crm.<provider>:<account>.files.run_minutes, crm.<provider>:<account>.files.days, crm.<provider>:<account>.files.max_total_mb. |
| `value` | required | a number, true or false; for a group tg:work,max:Alice,email:me@x. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |
| `--personal` | only for personal accounts — the personal section of the file. |
| `--bot` | only for bots — the bot section of the file. |

**Example:** `slk personal config set limit 20`

### `slk config unset`

remove a setting from the configuration file

**Changes something on this computer only.**

```sh
slk config unset <setting> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, sender_colors, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, sends_per_hour, requests_per_minute, transcribe_with, speech_model, search_catch_up, history_dialog_days, history_group_days, history_group_members_max, history_muted, picture_search, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, thread_window_days, inbox_channels, inbox_all_channels, read_other_bots, update_check, skill_hint, thread_window_days, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, phone_countries, task_categories.<name>, task_agent_close, task_agent_close_min, task_first_pass_per_chat, account_groups.<name>, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities, crm.<provider>:<account>.files.max_files, crm.<provider>:<account>.files.max_file_mb, crm.<provider>:<account>.files.max_run_mb, crm.<provider>:<account>.files.run_minutes, crm.<provider>:<account>.files.days, crm.<provider>:<account>.files.max_total_mb. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |
| `--personal` | only for personal accounts — the personal section of the file. |
| `--bot` | only for bots — the bot section of the file. |

**Example:** `slk personal config unset limit`

### `slk config migrate`

write each setting the file lacks at its default, keeping yours

**Changes something on this computer only.**

```sh
slk config migrate
```

**Example:** `slk config migrate`

### `slk config repair`

fix broken JSON syntax in the settings file — comments, a missing or extra comma, unquoted keys, single quotes, missing closing brackets at the end — keeping every value, with a backup beside it; refuses anything with more than one reading and changes nothing then

**Changes something on this computer only.**

```sh
slk config repair [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | say what it would fix, and change nothing. |

**Example:** `slk config repair`, `slk config repair --dry-run`

## `slk runs`

recorded runs — what this tool did, and when

### `slk runs list`

recorded runs, newest first

```sh
slk runs list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |

**Returns:** run — run_id, command, started_at, status, cli_version, profile, completed_at, requests, and 23 more; every field: slk commands info runs list

**Example:** `slk personal runs list --limit 10`

### `slk runs show`

one run: what it was, how it ended, and every event it logged

```sh
slk runs show <run-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `slk runs list`. |

| Option | What it does |
|---|---|
| `--problems` | only failed responses, warnings and crashes. |

**Returns:** run details — run_id, command, started_at, status, cli_version, directory, event_count, events, and 22 more; every field: slk commands info runs show

**Example:** `slk personal runs show run-101`

### `slk runs path`

the directory holding one run

```sh
slk runs path <run-id>
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `slk runs list`. |

**Returns:** run location — path; every field: slk commands info runs path

**Example:** `slk personal runs path run-101`

## Códigos de salida

Decide según el código, no según el texto: el texto puede cambiar, el código no.

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
