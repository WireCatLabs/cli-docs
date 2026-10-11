---
title: "Todos los comandos"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Consulta aquí todos los comandos y opciones de Memo. Los comandos que trabajan en una cuenta de un servicio de mensajería o de correo usan `--provider` y `--account`; Memo nunca elige una cuenta por ti. Añade `--json` para obtener una respuesta que un script o un agente puedan leer. Consulta las [recetas](./recipes.md) para tareas completas y [usar Memo](./usage.md) para un día normal. Las descripciones de las operaciones conservan el idioma de la ayuda de la herramienta.

## Opciones globales

Estas opciones funcionan con el propio comando `memo`.

| Option | What it does |
|---|---|
| `-V, --version` | output the version number. |

## `memo context`

What the store holds about a person — messages, mail and notes — with a link to each source

```sh
memo context <person> [options]
```

| Argument | | What it is |
|---|---|---|
| `person` | required | <messenger>:<name or id>, e.g. telegram:Ana or email:ana@example.com. |

| Option | What it does |
|---|---|
| `--limit <n>` | most messages and notes of each kind. Default: `20`. |
| `--json` | print JSON. |
| `--account <id>` | required when several accounts of the requested provider are stored. |

## `memo notes`

Notes: files from your folders, and notes you write here about messages, people and projects

### `memo notes import`

Bring the folders' notes, their links and tags into the shared store — only what changed

```sh
memo notes import [options]
```

| Option | What it does |
|---|---|
| `--folder <path-or-id...>` | only these configured folders. |
| `--ignore <path...>` | files or folders inside them to skip, added to notes.ignore — a path or a glob. |
| `--no-embed` | skip embedding the notes for search by meaning this run. |
| `--json` | print JSON. |

### `memo notes about`

Notes about a person, project or note, and the notes that link them — through links, never a name in plain text

```sh
memo notes about <subject> [options]
```

| Argument | | What it is |
|---|---|---|
| `subject` | required | <messenger>:<name or id>, person:<uid>, organization:<id>, project:<id>, note:<id> or document:<id>. |

| Option | What it does |
|---|---|
| `--limit <n>` | most notes of each kind. Default: `20`. |
| `--json` | print JSON. |

### `memo notes show`

One note: its text, tags, what it links and what links it

```sh
memo notes show <note> [options]
```

| Argument | | What it is |
|---|---|---|
| `note` | required | note:<id>, document:<id>, or a file in a configured folder. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

### `memo notes list`

Notes, newest first

```sh
memo notes list [options]
```

| Option | What it does |
|---|---|
| `--about <subject>` | only notes about this: <messenger>:<name or id> or a typed reference. |
| `--source <source>` | file or internal. |
| `--search <text>` | only notes holding this text, as written. |
| `--offset <n>` | skip this many. Default: `0`. |
| `--limit <n>` | most notes, at most 500. Default: `20`. |
| `--json` | print JSON. |

### `memo notes add`

Write a note of your own about messages, people, projects or other notes

```sh
memo notes add [text] [options]
```

| Argument | | What it is |
|---|---|---|
| `text` | optional | the note; or --text, or --file. |

| Option | What it does |
|---|---|
| `--text <text>` | the note. |
| `--file <path>` | read the note from a file; - reads stdin. |
| `--title <title>` | a title. |
| `--about <subject...>` | what it is about: <messenger>:<name or id>, msg:, chat:, person:, organization:, project:, task:, note:, document:, meeting:. |
| `--meeting <id>` | also about this meeting, by its store id, with --provider and --account. |
| `--provider <provider>` | the meeting's provider. |
| `--account <account>` | the meeting's account. |
| `--export [dir]` | also write it as a file — to this folder, or notes.export.dir. |
| `--format <format>` | the file's format: obsidian, markdown. |
| `--json` | print JSON. |

### `memo notes edit`

Change a note you wrote here; a file's note is edited in its file

```sh
memo notes edit <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | note:<id> or its id. |

| Option | What it does |
|---|---|
| `--revision <n>` | its current revision, so an edit made meanwhile is not lost. |
| `--text <text>` | the new text. |
| `--file <path>` | read the new text from a file; - reads stdin. |
| `--export [dir]` | also rewrite its file — in this folder, or notes.export.dir. |
| `--format <format>` | the file's format: obsidian, markdown. |
| `--json` | print JSON. |

### `memo notes remove`

Delete a note you wrote here; a file it was exported to stays

```sh
memo notes remove <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | note:<id> or its id. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

### `memo notes export`

Write the notes you wrote here as files, never overwriting one you edited

```sh
memo notes export [options]
```

| Option | What it does |
|---|---|
| `--to <dir>` | the folder to write to (default: notes.export.dir). |
| `--format <format>` | the files' format: obsidian, markdown. |
| `--json` | print JSON. |

## `memo folders`

Folders of notes: an id that links and the store use, and where the folder is on this computer

### `memo folders add`

Give a folder of notes an id, or show the one it has

```sh
memo folders add <path> [options]
```

| Argument | | What it is |
|---|---|---|
| `path` | required | the folder on this computer. |

| Option | What it does |
|---|---|
| `--format <format>` | how its notes are written: obsidian, markdown (default: obsidian). |
| `--json` | print JSON. |

### `memo folders attach`

Bind a folder id from another computer to the folder's path on this one

```sh
memo folders attach <id> <path> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the folder's id, as memo folders add printed it. |
| `path` | required | the same folder on this computer. |

| Option | What it does |
|---|---|
| `--format <format>` | how its notes are written: obsidian, markdown. |
| `--json` | print JSON. |

### `memo folders list`

The folders of notes: those on this computer, and those the store has from another

```sh
memo folders list [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON. |

## `memo mail`

Read one mail account through Himalaya into the shared message store

```sh
memo mail [account] [action] [options]
```

| Argument | | What it is |
|---|---|---|
| `account` | optional | the account's name in mail.accounts of the config, also its name in Himalaya. |
| `action` | optional | import: read the account's mail, and drop the text of mail deleted at the source. |

| Option | What it does |
|---|---|
| `--since <date>` | first day to read, YYYY-MM-DD (default: 30 days ago). |
| `--max <n>` | most new messages to read in this run. Default: `200`. |
| `--json` | print JSON. |
| `--no-embed` | skip semantic embedding; local words remain searchable. |
| `--retry-attachments` | reread bounded stored messages after installing an extraction engine. |

## `memo note`

Name the note that is about a person, or show it

```sh
memo note <identity> [path] [options]
```

| Argument | | What it is |
|---|---|---|
| `identity` | required | <messenger>:<name or id> of any identity of the person. |
| `path` | optional | the note about them, a file in a configured folder. |

| Option | What it does |
|---|---|
| `--clear` | forget which file note is about them. |

## `memo tags`

Your labels on stored sources and folders or threads

### `memo tags add`

Put labels on one source

```sh
memo tags add <tag> [options]
```

| Argument | | What it is |
|---|---|---|
| `tag` | required | one or more tags: 1–32 letters a–z, digits or hyphens; case is ignored. |

| Option | What it does |
|---|---|
| `--message <locator>` | a stored email or message's full msg: locator. |
| `--note <reference>` | a note: note:<id>, a file in a notes folder: document:<id>; a bare id is a note. |
| `--chat <id>` | a stored mail thread or chat's exact id; requires --provider and --account. |
| `--provider <provider>` | the chat's provider, such as email. |
| `--account <account>` | the chat's account, such as a mailbox address. |
| `--task <id>` | label a task. |
| `--contact <id>` | label a contact identity, with provider/account. |
| `--person <uid>` | label a unified person. |
| `--organization <id>` | label an organization. |
| `--project <id>` | label a project. |
| `--meeting <id>` | label a meeting by its store id, with --provider and --account. |
| `--folder <id>` | label a notes folder, or with --path one subfolder: every note under it. |
| `--path <subfolder>` | the subfolder inside --folder. |
| `--json` | print JSON. |

### `memo tags remove`

Remove labels from one source

```sh
memo tags remove <tag> [options]
```

| Argument | | What it is |
|---|---|---|
| `tag` | required | one or more tags: 1–32 letters a–z, digits or hyphens; case is ignored. |

| Option | What it does |
|---|---|
| `--message <locator>` | a stored email or message's full msg: locator. |
| `--note <reference>` | a note: note:<id>, a file in a notes folder: document:<id>; a bare id is a note. |
| `--chat <id>` | a stored mail thread or chat's exact id; requires --provider and --account. |
| `--provider <provider>` | the chat's provider, such as email. |
| `--account <account>` | the chat's account, such as a mailbox address. |
| `--task <id>` | label a task. |
| `--contact <id>` | label a contact identity, with provider/account. |
| `--person <uid>` | label a unified person. |
| `--organization <id>` | label an organization. |
| `--project <id>` | label a project. |
| `--meeting <id>` | label a meeting by its store id, with --provider and --account. |
| `--folder <id>` | label a notes folder, or with --path one subfolder: every note under it. |
| `--path <subfolder>` | the subfolder inside --folder. |
| `--json` | print JSON. |

### `memo tags list`

List source labels, optionally in one provider or account

```sh
memo tags list [options]
```

| Option | What it does |
|---|---|
| `--provider <provider>` | only this provider. |
| `--account <account>` | only this account; requires --provider. |
| `--tag <tag>` | only this tag. |
| `--type <type>` | chat, message, contact, note, document, person, organization, project, task, meeting, folder. |
| `--limit <n>` | most labels to show. Default: `100`. |
| `--json` | print JSON. |

## `memo tasks`

Open work linked to stored messages, documents and emails

### `memo tasks link`

link reviewed project task relationships

```sh
memo tasks link <task> <other-task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required |  |
| `other-task` | required |  |

| Option | What it does |
|---|---|
| `--kind <kind>` | blocked-by, follow-up-of, related-to. |
| `--json` | print JSON. |

### `memo tasks unlink`

unlink reviewed project task relationships

```sh
memo tasks unlink <task> <other-task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required |  |
| `other-task` | required |  |

| Option | What it does |
|---|---|
| `--kind <kind>` | blocked-by, follow-up-of, related-to. |
| `--json` | print JSON. |

### `memo tasks relations`

A task's links to other tasks

```sh
memo tasks relations <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required |  |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

### `memo tasks readiness`

Whether a task can start, and what it still waits for

```sh
memo tasks readiness <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required |  |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

### `memo tasks ready`

Discover project work with completed prerequisites; this does not claim a task

```sh
memo tasks ready [options]
```

| Option | What it does |
|---|---|
| `--project <project>` | canonical project reference, key or explicit alias. |
| `--limit <n>` | tasks per page. |
| `--json` | print JSON. |

### `memo tasks add`

Add a task: from a message, note or document, or with --project and --title a task of your own

```sh
memo tasks add [source] [options]
```

| Argument | | What it is |
|---|---|---|
| `source` | optional | msg: source locator, note:<id> or document:<id>; leave out for a task in a project. |

| Option | What it does |
|---|---|
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON. |
| `--title <title>` | one line saying what is to be done. |
| `--priority <n>` | 0 urgent … 4 low. |
| `--parent <task>` | the parent task, in the same project. |
| `--description <text>` | the detail, in Markdown. |
| `--type <type>` | question, request (default), mention or promise from a source; bug, feature or chore (default) in a project. |
| `--project <project>` | a task without a source: the project's key or project:<id>. |
| `--assignee <person...>` | who does it: a person's UID. |

### `memo tasks list`

Tasks of one account or one project, open by default

```sh
memo tasks list [options]
```

| Option | What it does |
|---|---|
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON. |
| `--state <state>` | open, done or dismissed. Default: `open`. |
| `--project <project>` | a project's tasks, by its key or project:<id>, instead of an account's. |
| `--limit <n>` | most tasks. Default: `100`. |

### `memo tasks close`

Close a task as done or dismissed

```sh
memo tasks close <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required |  |

| Option | What it does |
|---|---|
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON. |
| `--as <state>` | done or dismissed. Default: `done`. |
| `--reason <text>` | why it is closed. |

### `memo tasks update`

Change a task's title, priority, parent or description

```sh
memo tasks update <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the task's id or key. |

| Option | What it does |
|---|---|
| `--title <title>` | one line saying what is to be done. |
| `--priority <n>` | 0 urgent … 4 low. |
| `--parent <task>` | the parent task, in the same project. |
| `--description <text>` | the detail, in Markdown. |
| `--json` | print JSON. |

### `memo tasks assign`

Name who works on a task

```sh
memo tasks assign <id> <person> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the task's id or key. |
| `person` | required | explicit canonical person UID. |

| Option | What it does |
|---|---|
| `--role <role>` | assignee, reviewer, watcher. Default: `assignee`. |
| `--json` | print JSON. |

## `memo organizations`

Companies, teams, families and communities of yours

### `memo organizations add`

Add an organization of yours: a company, team, family or community

```sh
memo organizations add <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required |  |

| Option | What it does |
|---|---|
| `--kind <kind>` | company, team, family, community. |
| `--scope <scope>` | personal, work. |
| `--json` | print JSON. |

### `memo organizations list`

Your organizations

```sh
memo organizations list [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON. |

### `memo organizations context`

One organization: its relationships, the notes about or linking it, and its tags

```sh
memo organizations context <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required |  |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

## `memo projects`

Projects of yours, each with a short key

### `memo projects meetings`

Explicit account-scoped project membership

#### `memo projects meetings list`

Meetings linked to a project in one account, or proposed links

```sh
memo projects meetings list <project> [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | project reference, key or explicit alias. |

| Option | What it does |
|---|---|
| `--provider <provider>` | meeting provider. |
| `--account <account>` | exact stored meeting account. |
| `--json` | print JSON. |
| `--proposed` | show proposed memberships instead of confirmed ones. |
| `--limit <n>` | meetings per page. |
| `--offset <n>` | rows to skip. |

#### `memo projects meetings link`

Link a stored meeting to a project, or confirm a proposed link

```sh
memo projects meetings link <project> <meeting-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required |  |
| `meeting-id` | required | positive stored meeting id. |

| Option | What it does |
|---|---|
| `--provider <provider>` | meeting provider. |
| `--account <account>` | exact stored meeting account. |
| `--json` | print JSON. |
| `--expected <fingerprint>` | required when confirming an existing proposal. |
| `--provenance <text>` | why the reviewed meeting belongs to this project. |

### `memo projects add`

Add a project of yours, with a short key its tasks use

```sh
memo projects add <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required |  |

| Option | What it does |
|---|---|
| `--key <key>` | 3–4 letters and digits; made from the name when left out. |
| `--type <type>` | work, client, personal, oss, other. |
| `--organization <reference>` | organization:<id> it belongs to. |
| `--scope <scope>` | personal, work. |
| `--json` | print JSON. |

### `memo projects list`

Your projects

```sh
memo projects list [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON. |

### `memo projects context`

One project by its id: its relationships, the notes about or linking it, and its tags

```sh
memo projects context <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required |  |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

## `memo relationships`

Explicit relations between people, organizations and projects; this never links identities

### `memo relationships add`

State that a person, organization or project belongs to or relates to another

```sh
memo relationships add <from> <to> [options]
```

| Argument | | What it is |
|---|---|---|
| `from` | required |  |
| `to` | required |  |

| Option | What it does |
|---|---|
| `--json` | print JSON. |
| `--kind <kind>` | member-of or related-to. Default: `member-of`. |
| `--role <role>` |  |
| `--evidence <text>` |  |

### `memo relationships list`

Relationships, all or those of one reference

```sh
memo relationships list [options]
```

| Option | What it does |
|---|---|
| `--reference <reference>` |  |
| `--json` | print JSON. |

### `memo relationships remove`

Remove a relationship

```sh
memo relationships remove <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required |  |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

### `memo relationships confirm`

Accept a suggested relationship

```sh
memo relationships confirm <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required |  |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

### `memo relationships suggest`

Store weak shared-domain suggestions for direct email contacts; confirmation is explicit

```sh
memo relationships suggest [options]
```

| Option | What it does |
|---|---|
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON. |
| `--limit <n>` | most suggestions, at most 100. Default: `20`. |

## `memo reminders`

Durable local reminders; poll leases a delivery and ack confirms it

### `memo reminders schedule`

Schedule a reminder for an open task

```sh
memo reminders schedule <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required |  |

| Option | What it does |
|---|---|
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON. |
| `--at <timestamp>` | ISO timestamp with UTC offset. |
| `--timezone <zone>` | IANA timezone. Default: `UTC`. |

### `memo reminders list`

Pending reminders of one account

```sh
memo reminders list [options]
```

| Option | What it does |
|---|---|
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON. |

### `memo reminders poll`

Hand out due reminders, each with a receipt to acknowledge

```sh
memo reminders poll [options]
```

| Option | What it does |
|---|---|
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON. |
| `--limit <n>` | most due reminders, at most 500. Default: `100`. |

### `memo reminders ack`

Confirm that a handed-out reminder was shown

```sh
memo reminders ack <id> <receipt> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required |  |
| `receipt` | required |  |

| Option | What it does |
|---|---|
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON. |

### `memo reminders cancel`

Cancel a reminder

```sh
memo reminders cancel <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required |  |

| Option | What it does |
|---|---|
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON. |

### `memo reminders snooze`

Move a reminder to a later time

```sh
memo reminders snooze <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required |  |

| Option | What it does |
|---|---|
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON. |
| `--at <timestamp>` |  |
| `--revision <n>` | current revision. |

## `memo vocabulary`

Canonical projects, tags and topics with explicit aliases

### `memo vocabulary list`

List canonical IDs, aliases, usage counts and a preview fingerprint

```sh
memo vocabulary list [options]
```

| Option | What it does |
|---|---|
| `--kind <kind>` | project, tag or topic. |
| `--scope <scope>` | personal or work projects. |
| `--max-entries <n>` | catalog input budget, not a page size. |
| `--max-read-bytes <n>` | catalog input byte budget. |
| `--json` | print JSON. |

### `memo vocabulary resolve`

Resolve an exact name or alias; ambiguity is reported

```sh
memo vocabulary resolve <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required |  |

| Option | What it does |
|---|---|
| `--kind <kind>` | project, tag or topic. |
| `--scope <scope>` | personal or work projects. |
| `--max-entries <n>` | catalog input budget, not a page size. |
| `--max-read-bytes <n>` | catalog input byte budget. |
| `--json` | print JSON. |

### `memo vocabulary audit`

Discover likely synonyms without accepting or merging them

```sh
memo vocabulary audit [options]
```

| Option | What it does |
|---|---|
| `--kind <kind>` | project, tag or topic. |
| `--scope <scope>` | personal or work projects. |
| `--max-entries <n>` | catalog input budget, not a page size. |
| `--max-read-bytes <n>` | catalog input byte budget. |
| `--json` | print JSON. |
| `--min-similarity <n>` | minimum lexical similarity, 0.65–1. |
| `--max-comparisons <n>` | bound name comparisons. |
| `--limit <n>` | maximum candidate pairs. |

### `memo vocabulary preflight`

Review an existing label or likely lexical duplicates before creation

```sh
memo vocabulary preflight <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required |  |

| Option | What it does |
|---|---|
| `--kind <kind>` | tag or topic. |
| `--json` | print JSON. |

### `memo vocabulary create`

Owner: create a distinct tag or topic after reviewing its preflight

```sh
memo vocabulary create <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required |  |

| Option | What it does |
|---|---|
| `--kind <kind>` | tag or topic. |
| `--expected <fingerprint>` | the current preflight creationFingerprint. |
| `--json` | print JSON. |

### `memo vocabulary aliases`

Owner-reviewed aliases on stable canonical IDs

#### `memo vocabulary aliases add`

Owner: add another name for a project, tag or topic

```sh
memo vocabulary aliases add <reference> <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `reference` | required |  |
| `name` | required |  |

| Option | What it does |
|---|---|
| `--expected <fingerprint>` | the current vocabulary preview fingerprint. |
| `--json` | print JSON. |

#### `memo vocabulary aliases remove`

Owner: remove another name from a project, tag or topic

```sh
memo vocabulary aliases remove <reference> <alias-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `reference` | required |  |
| `alias-id` | required |  |

| Option | What it does |
|---|---|
| `--expected <fingerprint>` | the current vocabulary preview fingerprint. |
| `--json` | print JSON. |

## `memo memories`

What agents and you concluded, each with its evidence: agents propose, you confirm

### `memo memories add`

Write a memory of your own; it is confirmed at once

```sh
memo memories add <text> [options]
```

| Argument | | What it is |
|---|---|---|
| `text` | required | what is true, in a sentence or two. |

| Option | What it does |
|---|---|
| `--kind <kind>` | summary, digest, preference. |
| `--scope <scope>` | personal or work. |
| `--evidence <ref...>` | what shows it: msg:, note:, meeting:, person: or another reference. |
| `--subject <ref>` | what it is about, as a reference. |
| `--json` | print JSON. |

### `memo memories list`

Memories, newest first

```sh
memo memories list [options]
```

| Option | What it does |
|---|---|
| `--status <status>` | proposed, confirmed, stale, superseded. |
| `--kind <kind>` | summary, digest, preference. |
| `--scope <scope>` | personal or work. |
| `--subject <ref>` | only memories about this reference. |
| `--limit <n>` | most memories, up to 500. Default: `100`. |
| `--json` | print JSON. |

### `memo memories show`

One memory with its evidence

```sh
memo memories show <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | memory:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

### `memo memories search`

Memories holding every word, best first

```sh
memo memories search <words> [options]
```

| Argument | | What it is |
|---|---|---|
| `words` | required | the words to find. |

| Option | What it does |
|---|---|
| `--scope <scope>` | personal or work. |
| `--limit <n>` | most memories, up to 500. Default: `20`. |
| `--json` | print JSON. |

### `memo memories confirm`

Stand behind a memory: its evidence was checked now

```sh
memo memories confirm <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | memory:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

### `memo memories stale`

Mark a memory whose evidence no longer holds

```sh
memo memories stale <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | memory:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

## `memo facts`

What happened — said, asked, decided, promised — with its evidence: agents propose, you accept

### `memo facts add`

Record a fact of your own; it is accepted at once

```sh
memo facts add <statement> [options]
```

| Argument | | What it is |
|---|---|---|
| `statement` | required | what happened, in one sentence. |

| Option | What it does |
|---|---|
| `--type <type>` | fact, statement, question, decision, promise. |
| `--evidence <ref...>` | what shows it: msg:, note:, meeting:, person: or another reference. |
| `--project <ref>` | the project it belongs to, project:<id>. |
| `--subject <ref>` | what it is about, as a reference. |
| `--occurred <iso>` | when it happened, as the evidence shows. |
| `--scope <scope>` | personal or work. |
| `--supersedes <ref>` | a decision only: the decision this one replaces. |
| `--json` | print JSON. |

### `memo facts list`

Facts, latest first

```sh
memo facts list [options]
```

| Option | What it does |
|---|---|
| `--type <type>` | fact, statement, question, decision, promise. |
| `--status <status>` | proposed, accepted, superseded, reversed. |
| `--project <ref>` | only this project's, project:<id>. |
| `--subject <ref>` | only facts about this reference. |
| `--limit <n>` | most facts, up to 500. Default: `100`. |
| `--json` | print JSON. |

### `memo facts show`

One fact with its evidence

```sh
memo facts show <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | fact:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

### `memo facts accept`

Stand behind a fact an agent proposed; a decision it supersedes stops holding

```sh
memo facts accept <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | fact:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

### `memo facts reverse`

An accepted decision no longer holds, and nothing replaced it

```sh
memo facts reverse <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | fact:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

## `memo actions`

What an agent proposes to do; approving one makes it your task, nothing is sent

### `memo actions propose`

Propose an action, such as a reply or a ban, in the account that would act

```sh
memo actions propose <kind> [options]
```

| Argument | | What it is |
|---|---|---|
| `kind` | required | a lower-case word: reply, send, ban, mute, pin, invite, create_task, …. |

| Option | What it does |
|---|---|
| `--reason <text>` | why it should be done. |
| `--provider <provider>` | the provider of the account that would act. |
| `--account <account>` | the account that would act, when the provider has several. |
| `--target <ref>` | what it acts on: msg:, chat:, contact:, person:, task:, …. |
| `--payload <json>` | what to do, as JSON, such as the reply's text. |
| `--json` | print JSON. |

### `memo actions list`

Proposed actions, newest first

```sh
memo actions list [options]
```

| Option | What it does |
|---|---|
| `--status <status>` | proposed, approved, rejected, executed, failed. |
| `--limit <n>` | most actions, up to 500. Default: `100`. |
| `--json` | print JSON. |

### `memo actions show`

One proposed action, with its payload

```sh
memo actions show <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required |  |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

### `memo actions approve`

Approve it: it becomes a task in the account that would act; nothing is sent

```sh
memo actions approve <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required |  |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

### `memo actions reject`

Reject it; nothing is done

```sh
memo actions reject <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required |  |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

## `memo agents`

What agents did through the MCP servers that share the store

### `memo agents log`

One row per tool call, newest first: agent, tool, tier, outcome and times, never its arguments

```sh
memo agents log [options]
```

| Option | What it does |
|---|---|
| `--tool <name>` | only this tool. |
| `--agent <name>` | only this agent, such as tg-mcp or memo-mcp. |
| `--limit <n>` | most rows, up to 500. Default: `100`. |
| `--json` | print JSON. |

## `memo mcp`

Serve memories, proposed actions and the agent log to an agent over MCP, on stdin and stdout

```sh
memo mcp
```

## `memo search`

Search stored messages, mail and notes: one kind when you know it, search all when you do not

### `memo search all`

Messages, mail and notes ranked together; not people, memories, projects or decisions. A kind you know reads better with its own search, with all its fields

```sh
memo search all <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | words, phrases, Boolean operators and field queries. |

| Option | What it does |
|---|---|
| `--limit <n>` | most results, at most 100. Default: `20`. |
| `--exact` | words as written; skip meaning search. |
| `--timezone <zone>` | IANA timezone for calendar date boundaries. |
| `--json` | print JSON. |
| `--only <resources>` | messages,mail,notes, separated by commas. |

### `memo search messages`

Stored messenger messages only

```sh
memo search messages <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | words, phrases, Boolean operators and field queries. |

| Option | What it does |
|---|---|
| `--limit <n>` | most results, at most 100. Default: `20`. |
| `--exact` | words as written; skip meaning search. |
| `--timezone <zone>` | IANA timezone for calendar date boundaries. |
| `--json` | print JSON. |
| `--type <type>` | text, voice or file. |

### `memo search mail`

Imported emails only

```sh
memo search mail <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | words, phrases, Boolean operators and field queries. |

| Option | What it does |
|---|---|
| `--limit <n>` | most results, at most 100. Default: `20`. |
| `--exact` | words as written; skip meaning search. |
| `--timezone <zone>` | IANA timezone for calendar date boundaries. |
| `--json` | print JSON. |
| `--account <address>` | only this mail account, by its address (default: every mail account). |

### `memo search notes`

Native notes by words and, with the local model, meaning

```sh
memo search notes <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | words, phrases, Boolean operators and field queries. |

| Option | What it does |
|---|---|
| `--limit <n>` | most results, at most 100. Default: `20`. |
| `--exact` | words as written; skip meaning search. |
| `--timezone <zone>` | IANA timezone for calendar date boundaries. |
| `--json` | print JSON. |
| `--type <type>` | file or internal. |
| `--tag <tag>` | only notes with this tag. |
| `--filter <query>` | another query every note must match. |
| `--folder <path-or-id...>` | only these folders. |
| `--offset <n>` | continue from nextOffset. Default: `0`. |

## `memo ask`

Prepare cited evidence for your agent, or explicitly call a configured model

```sh
memo ask <question> [options]
```

| Argument | | What it is |
|---|---|---|
| `question` | required |  |

| Option | What it does |
|---|---|
| `--query <query>` | structured retrieval query; defaults to the question. |
| `--all` |  |
| `--provider <provider>` |  |
| `--account <account>` |  |
| `--limit <n>` | most evidence items, at most 100. Default: `20`. |
| `--model` | call MEMO_MODELS_ANALYSIS_PROVIDER/MODEL instead of returning an evidence bundle. |
| `--allow-remote` | explicitly consent to sending this evidence to the configured model. |
| `--json` |  |

## `memo import`

Bring notes and mail up to date in the shared store — only what changed; the timer runs this

```sh
memo import [options]
```

| Option | What it does |
|---|---|
| `--notes` | notes only. |
| `--mail` | mail only. |
| `--no-embed` | skip embedding notes and mail for search by meaning this run. |
| `--json` | print JSON. |

## `memo auto`

Run memo import on a timer (systemd user timer); on/off and the interval live in the config

### `memo auto on`

Import every --every (default: auto.every in the config, else 5m), starting a minute from now

```sh
memo auto on [options]
```

| Option | What it does |
|---|---|
| `--every <interval>` | how often: 5m, 90s, 1h — a minute or more. |

### `memo auto off`

Stop importing on a timer and remove the timer

```sh
memo auto off
```

### `memo auto status`

Whether the timer is on, its interval, when it runs next and how the last run ended

```sh
memo auto status [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON. |

## `memo commands`

Discover the command tree and options as shared registry data

```sh
memo commands [path] [options]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | one command, such as tags add. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

## Códigos de salida

Los errores siguen el contrato de errores compartido de WireCat.

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
