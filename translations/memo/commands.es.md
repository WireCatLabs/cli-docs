---
title: "Todos los comandos"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Consulta aquí todos los comandos y opciones de Memo. Un comando que lee nombra sus cuentas con `--source`: una como `telegram:1` o `email:work`, todas las cuentas de un proveedor, un tipo o `group:<name>`. Un comando que escribe nombra la única cuenta con la que actúa con `--account telegram:1`. Memo nunca elige una cuenta por ti. Añade `--json` para obtener una respuesta que un script o un agente puedan leer. Consulta las [recetas](./recipes.md) para tareas completas y [usar Memo](./usage.md) para un día normal. Las descripciones de las operaciones conservan el idioma de la ayuda de la herramienta.

## Opciones generales

Estas opciones se aplican al propio comando `memo`.

| Option | What it does |
|---|---|
| `-V, --version` | output the version number. |
| `--debug` | on failure, show the full error record: cause and stack. |

## `memo context`

messages, mail and notes about a person, each with a link to its source

```sh
memo context <person> [options]
```

| Argument | | What it is |
|---|---|---|
| `person` | required | <messenger>:<name or id>, e.g. telegram:Ana or email:ana@example.com. |

| Option | What it does |
|---|---|
| `--limit <n>` | most messages and notes of each kind. Default: `20`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--source <accounts>` | the account to read, as provider:account; required when the store holds several of that messenger. |
| `--account <account>` | deprecated: --source <messenger>:<account>. |

**Returns:** messages, mail and notes about a person, each with a link to its source

**Example:** `memo context telegram:'Kai Sample'`, `memo context email:kai@example.com --limit 5 --json`

## `memo notes`

notes from your folders, and notes you write here

### `memo notes show`

one note: its text, tags, what it links and what links it

```sh
memo notes show <note> [options]
```

| Argument | | What it is |
|---|---|---|
| `note` | required | note:<id>, document:<id>, or a file in a configured folder. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more

**Example:** `memo notes show note:12`, `memo notes show ~/notes/People/Kai.md --json`

### `memo notes list`

notes, newest first

```sh
memo notes list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | most notes, at most 500. Default: `20`. |
| `--page <n>` | which page, from 1. Default: `1`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more

**Next usually:** `memo notes show <note>`

**Example:** `memo notes list 'about:"telegram:Kai Sample"'`, `memo notes list source:internal text:budget --json`, `memo notes list source:internal --limit 50`

### `memo notes add`

write a note of your own about messages, people, projects or other notes

This command changes the local store or your files.

```sh
memo notes add [text] [options]
```

| Argument | | What it is |
|---|---|---|
| `text` | optional | the note; or --text, or --text-file. |

| Option | What it does |
|---|---|
| `--text <text>` | the note. |
| `--text-file <path>` | read the note from a file; - reads stdin. |
| `--title <title>` | a title. |
| `--subject <ref>` | what it is about: <messenger>:<name or id>, msg:, chat:, person:, organization:, project:, task:, note:, document:, meeting:; repeat for more. |
| `--meeting <id>` | also about this meeting, by its store id, with --account. |
| `--account <account>` | the account of --meeting: the meeting account it acts as: provider:account, such as zoom:me@example.com. |
| `--provider <provider>` | deprecated: --account <provider>:<account>. |
| `--export [dir]` | also write it as a file — to this folder, or notes.export.dir. |
| `--format <format>` | the file's format: obsidian, markdown. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more

**Next usually:** `memo notes show <note>`

**Example:** `memo notes add 'Prefers calls in the morning' --subject telegram:'Kai Sample'`, `memo notes add --text-file draft.md --title 'Harbour kickoff' --subject project:2 --subject organization:1`

### `memo notes edit`

change a note you wrote here; a file's note is edited in its file

This command changes the local store or your files.

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
| `--text-file <path>` | read the new text from a file; - reads stdin. |
| `--export [dir]` | also rewrite its file — in this folder, or notes.export.dir. |
| `--format <format>` | the file's format: obsidian, markdown. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more

**Next usually:** `memo notes show <note>`

**Example:** `memo notes edit note:12 --revision 2 --text 'Prefers calls after ten'`

### `memo notes remove`

delete a note you wrote here; a file it was exported to stays

This command changes the local store or your files.

```sh
memo notes remove <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | note:<id> or its id. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** delete a note you wrote here; a file it was exported to stays

**Example:** `memo notes remove note:12`

### `memo notes export`

write the notes you wrote here as files, never overwriting one you edited

This command changes the local store or your files.

```sh
memo notes export [options]
```

| Option | What it does |
|---|---|
| `--output-dir <dir>` | the folder to write to (default: notes.export.dir). |
| `--format <format>` | the files' format: obsidian, markdown. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** write the notes you wrote here as files, never overwriting one you edited

**Example:** `memo notes export --output-dir ~/notes/memo --format obsidian`

## `memo folders`

folders of notes: the id links and the store use, and the path on this computer

### `memo folders add`

give a folder of notes an id, or show the one it has

This command changes the local store or your files.

```sh
memo folders add <path> [options]
```

| Argument | | What it is |
|---|---|---|
| `path` | required | the folder on this computer. |

| Option | What it does |
|---|---|
| `--format <format>` | how its notes are written: obsidian, markdown (default: obsidian). |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** give a folder of notes an id, or show the one it has

**Example:** `memo folders add ~/notes`

### `memo folders attach`

bind a folder id from another computer to the folder's path on this one

This command changes the local store or your files.

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
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** bind a folder id from another computer to the folder's path on this one

**Example:** `memo folders attach 1 ~/notes`

### `memo folders list`

folders of notes on this computer, and those the store knows from another

```sh
memo folders list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms; this list filters by none yet. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** folders of notes on this computer, and those the store knows from another

**Example:** `memo folders list --json`

## `memo messages`

stored emails; tg and max read messenger messages

### `memo messages show`

one stored email whole, with its attachments' text and nearby thread emails

```sh
memo messages show <message> [options]
```

| Argument | | What it is |
|---|---|---|
| `message` | required | the email's msg:email/… reference, as search answers give it. |

| Option | What it does |
|---|---|
| `--before-n <n>` | also this many earlier emails of its thread. Default: `0`. |
| `--after-n <n>` | also this many later emails of its thread. Default: `0`. |
| `--full` | whole attachment text, not the first 4000 characters of each. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** one stored email whole, with its attachments' text and nearby thread emails

**Example:** `memo messages show 'msg:email/me%40example.com/thread/42' --before-n 2 --after-n 2`

## `memo mail`

look at a mail account before importing it, and the owner's rules

### `memo mail inspect`

group an account's mail by sender and list, to decide what to keep or skip

```sh
memo mail inspect <account> [options]
```

| Argument | | What it is |
|---|---|---|
| `account` | required | the account's name in mail.accounts, or its address. |

| Option | What it does |
|---|---|
| `--since-time <time>` | only mail from this time, ISO 8601 or 30d ago (default: all mail). |
| `--limit <n>` | show this many of the largest groups. Default: `50`. |
| `--domain-age` | ask each shown sender domain's registry when it was registered (RDAP); tells each registry its domain. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** group an account's mail by sender and list, to decide what to keep or skip

**Example:** `memo mail inspect personal --limit 30`, `memo mail inspect work --since-time 365d --json`

### `memo mail status`

how far an account's import is: mail stored, recorded, and left to read

```sh
memo mail status <account> [options]
```

| Argument | | What it is |
|---|---|---|
| `account` | required | the account's name in mail.accounts, or its address. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** how far an account's import is: mail stored, recorded, and left to read

**Example:** `memo mail status personal`, `memo mail status personal --json`

### `memo mail trash`

move envelope mail to Gmail's Trash, decided again; dry run unless --yes

This command can send data to the configured AI provider.

```sh
memo mail trash <account> [options]
```

| Argument | | What it is |
|---|---|---|
| `account` | required | the account's name in mail.accounts, or its address. |

| Option | What it does |
|---|---|
| `--limit <n>` | most emails to move this run (default 5000; a first run moves at most 100). |
| `--since-time <time>` | only mail received from this time, ISO 8601 or 30d ago; older mail stays. |
| `--yes` | move the mail; without it, only say what would move. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** move envelope mail to Gmail's Trash, decided again; dry run unless --yes

**Example:** `memo mail trash personal`, `memo mail trash personal --yes --limit 100`

### `memo mail restore`

move a cleanup run's mail back from Gmail's Trash; dry run unless --yes

This command can send data to the configured AI provider.

```sh
memo mail restore <account> [options]
```

| Argument | | What it is |
|---|---|---|
| `account` | required | the account's name in mail.accounts, or its address. |

| Option | What it does |
|---|---|
| `--run <id>` | the run, as memo mail runs lists it. |
| `--yes` | move the mail back; without it, only say what would move. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** move a cleanup run's mail back from Gmail's Trash; dry run unless --yes

**Example:** `memo mail restore personal --run 2026-10-16T09-00-00-000Z-ab12 --yes`

### `memo mail runs`

an account's cleanup runs, how much moved, and until when restorable

```sh
memo mail runs <account> [options]
```

| Argument | | What it is |
|---|---|---|
| `account` | required | the account's name in mail.accounts, or its address. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** an account's cleanup runs, how much moved, and until when restorable

**Example:** `memo mail runs personal`, `memo mail runs personal --json`

### `memo mail rules`

the owner's decisions on which mail to keep, record, skip, tag or protect

#### `memo mail rules list`

one account's rules, protected ones first

```sh
memo mail rules list <account> [options]
```

| Argument | | What it is |
|---|---|---|
| `account` | required | the account's name in mail.accounts, or its address. |

| Option | What it does |
|---|---|
| `--filter <query>` | is:protected lists only the rules no cleanup may override. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** one account's rules, protected ones first

**Example:** `memo mail rules list personal --json`, `memo mail rules list personal --filter is:protected`

#### `memo mail rules add`

decide mail by sender, list, subject, age, size, label or kind; repeats replace

This command changes the local store or your files.

```sh
memo mail rules add <account> [options]
```

| Argument | | What it is |
|---|---|---|
| `account` | required | the account's name in mail.accounts, or its address. |

| Option | What it does |
|---|---|
| `--sender <address>` | one sender address. |
| `--domain <domain>` | a sender domain, and its subdomains. |
| `--list-id <id>` | a mailing list, by its List-Id. |
| `--filter <query>` | from:<address, domain or word>, to:<address>, subject:<word> (or a bare word), older:<n>d, larger:<size> (5MB, 300KB), has:attachment, label:<name> (label:"Two words"), is:unread, is:bulk, score:<n> (at least); all must hold. |
| `--kind <kind>` | a built-in kind of mail: social, newsletters, developer, shopping, alerts. |
| `--do <actions>` | one of skip (never read or store), envelope (store only sender, date, size and labels: counted, out of search, cleanable later), keep (store in full even when a skip or envelope rule matches) or protect (keep, and no cleanup may ever cut, archive or trash it); add tag:<name> to also tag the mail, e.g. envelope,tag:promo. |
| `--reason <text>` | why, for the owner later. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** decide mail by sender, list, subject, age, size, label or kind; repeats replace

**Example:** `memo mail rules add personal --domain news.example --do envelope,tag:newsletter --reason 'newsletters'`, `memo mail rules add personal --domain tax.gov.example --do protect`, `memo mail rules add personal --filter 'label:Promotions older:365d' --do envelope`

#### `memo mail rules remove`

drop the rule with exactly these conditions

This command changes the local store or your files.

```sh
memo mail rules remove <account> [options]
```

| Argument | | What it is |
|---|---|---|
| `account` | required | the account's name in mail.accounts, or its address. |

| Option | What it does |
|---|---|
| `--sender <address>` | one sender address. |
| `--domain <domain>` | a sender domain, and its subdomains. |
| `--list-id <id>` | a mailing list, by its List-Id. |
| `--filter <query>` | from:<address, domain or word>, to:<address>, subject:<word> (or a bare word), older:<n>d, larger:<size> (5MB, 300KB), has:attachment, label:<name> (label:"Two words"), is:unread, is:bulk, score:<n> (at least); all must hold. |
| `--kind <kind>` | a built-in kind of mail: social, newsletters, developer, shopping, alerts. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** drop the rule with exactly these conditions

**Example:** `memo mail rules remove personal --domain news.example`

#### `memo mail rules import-filters`

propose rules from a Takeout export's Gmail filters; --yes adds them

This command changes the local store or your files.

```sh
memo mail rules import-filters <account> <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `account` | required | the account's name in mail.accounts, or its address. |
| `file` | required | Takeout's Mail/User settings/Filters.json. |

| Option | What it does |
|---|---|
| `--yes` | add the proposed rules; without it, only show them. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** propose rules from a Takeout export's Gmail filters; --yes adds them

**Example:** `memo mail rules import-filters personal Filters.json`, `memo mail rules import-filters personal Filters.json --yes`

#### `memo mail rules apply`

cut stored mail an envelope rule matches to its envelope; dry run unless --yes

This command changes the local store or your files.

```sh
memo mail rules apply <account> [options]
```

| Argument | | What it is |
|---|---|---|
| `account` | required | the account's name in mail.accounts, or its address. |

| Option | What it does |
|---|---|
| `--since-time <time>` | only mail from this time, ISO 8601 or 30d ago (default: all mail). |
| `--yes` | change the store; without it, only say what would change. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** cut stored mail an envelope rule matches to its envelope; dry run unless --yes

**Example:** `memo mail rules apply personal`, `memo mail rules apply personal --yes --json`

#### `memo mail rules export`

print one account's rules as JSON, to review, keep or move elsewhere

```sh
memo mail rules export <account>
```

| Argument | | What it is |
|---|---|---|
| `account` | required | the account's name in mail.accounts, or its address. |

**Returns:** print one account's rules as JSON, to review, keep or move elsewhere

**Example:** `memo mail rules export personal`

#### `memo mail rules import`

add the rules of a file from memo mail rules export; same match replaces

This command changes the local store or your files.

```sh
memo mail rules import <account> <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `account` | required | the account's name in mail.accounts, or its address. |
| `file` | required | the file memo mail rules export wrote. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** add the rules of a file from memo mail rules export; same match replaces

**Example:** `memo mail rules import personal rules.json`

## `memo note`

name the note that is about a person, or show it

This command changes the local store or your files.

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

**Returns:** name the note that is about a person, or show it

**Example:** `memo note telegram:'Kai Sample' People/Kai.md`, `memo note telegram:'Kai Sample' --clear`

## `memo tags`

your labels on stored sources and folders or threads

### `memo tags add`

put labels on one source

This command changes the local store or your files.

```sh
memo tags add <tag> [options]
```

| Argument | | What it is |
|---|---|---|
| `tag` | required | one or more tags: 1–32 letters a–z, digits or hyphens; case is ignored. |

| Option | What it does |
|---|---|
| `--message <message>` | a stored email or message's full msg: locator. |
| `--note <reference>` | a note: note:<id>, a file in a notes folder: document:<id>; a bare id is a note. |
| `--chat <chat>` | a stored mail thread or chat's exact id; requires --account. |
| `--task <id>` | label a task. |
| `--contact <person>` | label a contact identity, with --account. |
| `--person <uid>` | label a unified person. |
| `--organization <organization>` | label an organization: its id or organization:<id>. |
| `--project <project>` | label a project: its key or project:<id>. |
| `--meeting <id>` | label a meeting by its store id, with --account. |
| `--folder <folder>` | label a notes folder by its id or path, or with --subfolder one subfolder: every note under it. |
| `--subfolder <path>` | the subfolder inside --folder. |
| `--account <account>` | the account of --chat, --contact or --meeting: the account it acts as: provider:account, such as telegram:1 or email:personal. |
| `--provider <provider>` | deprecated: --account <provider>:<account>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** put labels on one source

**Example:** `memo tags add follow-up --note note:12`, `memo tags add harbour --project HRB`

### `memo tags remove`

remove labels from one source

This command changes the local store or your files.

```sh
memo tags remove <tag> [options]
```

| Argument | | What it is |
|---|---|---|
| `tag` | required | one or more tags: 1–32 letters a–z, digits or hyphens; case is ignored. |

| Option | What it does |
|---|---|
| `--message <message>` | a stored email or message's full msg: locator. |
| `--note <reference>` | a note: note:<id>, a file in a notes folder: document:<id>; a bare id is a note. |
| `--chat <chat>` | a stored mail thread or chat's exact id; requires --account. |
| `--task <id>` | label a task. |
| `--contact <person>` | label a contact identity, with --account. |
| `--person <uid>` | label a unified person. |
| `--organization <organization>` | label an organization: its id or organization:<id>. |
| `--project <project>` | label a project: its key or project:<id>. |
| `--meeting <id>` | label a meeting by its store id, with --account. |
| `--folder <folder>` | label a notes folder by its id or path, or with --subfolder one subfolder: every note under it. |
| `--subfolder <path>` | the subfolder inside --folder. |
| `--account <account>` | the account of --chat, --contact or --meeting: the account it acts as: provider:account, such as telegram:1 or email:personal. |
| `--provider <provider>` | deprecated: --account <provider>:<account>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** remove labels from one source

**Example:** `memo tags remove follow-up --note note:12`

### `memo tags list`

list source labels, of every account or of the ones --source names

```sh
memo tags list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--source <accounts>` | only these accounts (default: every one): which accounts, separated by commas: provider:account (email:personal), a provider (email), a kind (mail, notes, documents) or group:<name>. |
| `--provider <provider>` | deprecated: --source <provider>. |
| `--account <account>` | deprecated: --source <provider>:<account>. |
| `--limit <n>` | most labels to show. Default: `100`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** list source labels, of every account or of the ones --source names

**Example:** `memo tags list tag:follow-up`, `memo tags list --source email:me@example.com --json`

## `memo tasks`

open work linked to stored messages, documents and emails

### `memo tasks unlink`

unlink reviewed project task relationships

This command changes the local store or your files.

```sh
memo tasks unlink <task> <other-task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task: task:<id> or its id. |
| `other-task` | required | the task it relates to: task:<id> or its id. |

| Option | What it does |
|---|---|
| `--kind <kind>` | blocked-by, follow-up-of, related-to, duplicate-of, discovered-from. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** unlink reviewed project task relationships

**Example:** `memo tasks unlink HRB-2 HRB-1 --kind blocked-by`

### `memo tasks relations`

a task's links to other tasks

```sh
memo tasks relations <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task: task:<id> or its id. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** a task's links to other tasks

**Example:** `memo tasks relations HRB-2 --json`

### `memo tasks status`

whether a task can start, and what it still waits for

```sh
memo tasks status <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task: task:<id> or its id. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** whether a task can start, and what it still waits for

**Example:** `memo tasks status HRB-2`

### `memo tasks add`

add a task from a message, note or document, or one of your own in a project

This command changes the local store or your files.

```sh
memo tasks add [source] [options]
```

| Argument | | What it is |
|---|---|---|
| `source` | optional | msg: source locator, note:<id> or document:<id>; leave out for a task in a project. |

| Option | What it does |
|---|---|
| `--account <account>` | the account it acts as: provider:account, such as telegram:1 or email:personal. |
| `--provider <provider>` | deprecated: --account <provider>:<account>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--title <title>` | one line saying what is to be done. |
| `--priority <n>` | 0 urgent … 4 low. |
| `--parent <id>` | the parent task, in the same project. |
| `--description <text>` | the detail, in Markdown. |
| `--type <type>` | question, request (default), mention or promise from a source; bug, feature or chore (default) in a project. |
| `--project <project>` | a task without a source: the project's key or project:<id>. |
| `--assignee <person...>` | who does it: a person's UID. |
| `--into <id>` | link the source to this task instead of opening one that may be the same job. |
| `--new` | open the task even when one like it is open or was closed in the last 14 days. |

**Returns:** add a task from a message, note or document, or one of your own in a project

**Example:** `memo tasks add 'msg:telegram/1/77/42' --account telegram:1 --type request`, `memo tasks add --project HRB --title 'Draft the budget' --type feature`

### `memo tasks list`

tasks of the --source accounts (default all) or of a project, open by default

```sh
memo tasks list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--source <accounts>` | which accounts, separated by commas: provider:account (email:personal), a provider (email), a kind (mail, notes, documents) or group:<name>. |
| `--provider <provider>` | deprecated: --source <provider>. |
| `--account <account>` | deprecated: --source <provider>:<account>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--limit <n>` | most tasks. Default: `100`. |

**Returns:** task — ref, id, title, kind, state, created_at, key, description, and 15 more

**Next usually:** `memo tasks relations <task>`, `memo tasks status <task>`, `memo tasks show <task>`

**Example:** `memo tasks list state:done --source telegram:1`, `memo tasks list project:HRB ready:true --json`

### `memo tasks close`

close a task as done or dismissed

This command changes the local store or your files.

```sh
memo tasks close <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the task's id. |

| Option | What it does |
|---|---|
| `--account <account>` | the account it acts as: provider:account, such as telegram:1 or email:personal. |
| `--provider <provider>` | deprecated: --account <provider>:<account>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--as <state>` | done or dismissed. Default: `done`. |
| `--reason <text>` | why it is closed. |

**Returns:** close a task as done or dismissed

**Example:** `memo tasks close 7 --account telegram:1 --as dismissed --reason 'answered by phone'`

### `memo tasks update`

change a task's title, priority, parent or description

This command changes the local store or your files.

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
| `--parent <id>` | the parent task, in the same project. |
| `--description <text>` | the detail, in Markdown. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** change a task's title, priority, parent or description

**Example:** `memo tasks update 7 --title 'Send the budget' --priority 1`

### `memo tasks assign`

name who works on a task

This command changes the local store or your files.

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
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** name who works on a task

**Example:** `memo tasks assign 7 person:3`

### `memo tasks agenda`

what needs a look today, from the local store and without message text: tasks overdue, due or to check, chats where you owe an answer, chats where you wait for one, open tasks someone else does

```sh
memo tasks agenda [query] [options]
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
| `--source <accounts>` | the account: telegram:<account>, email:<account>, notes:<id>, or group:<name> of one. |
| `--provider <provider>` | deprecated: --source <provider>. |
| `--account <account>` | deprecated: --source <provider>:<account>. |
| `--json` | print JSON. |

**Returns:** agenda — at, account, stored_at, stale, tasks, owed, waiting, unsynced, and 2 more

**Example:** `memo tasks agenda --source telegram:1`, `memo tasks agenda --source max:1 --waiting 3d --within 90d --json`

### `memo tasks plan`

set a task's title, description, due date, next check, category and assignee; nothing reaches the messenger

This command changes the local store or your files.

```sh
memo tasks plan <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

| Option | What it does |
|---|---|
| `--category <name>` | what it is about, from the list tasks categories prints: money, documents, meeting, …; a change is kept in the task's history. |
| `--title <title>` | one line: the action and its object — send Alex the API token. |
| `--description <text>` | the detail, in Markdown: who owes whom, done when, next step, keywords. |
| `--due <time>` | when it must be done: an ISO 8601 time or 2h, 3d from now; none clears it. |
| `--remind-time <time>` | when to look at it again: an ISO 8601 time or 2h, 3d from now; none clears it. |
| `--assignee <person...>` | who does it: sender (whoever sent the task's message) or person:<id>; none clears it. Leave it out when unsure: a task with no assignee is better than none. |
| `--account <account>` | the account it acts as: telegram:<account>, email:<account> or a notes folder, notes:<id>. |
| `--provider <provider>` | deprecated: --account <provider>:<account>. |
| `--json` | print JSON. |

**Returns:** set a task's title, description, due date, next check, category and assignee

**Example:** `memo tasks plan 1a2b3c4d --due 2d --title 'Send the revised budget' --account telegram:1`

### `memo tasks show`

one task: its plan and everything linked to it

```sh
memo tasks show <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

| Option | What it does |
|---|---|
| `--source <accounts>` | the account: telegram:<account>, email:<account>, notes:<id>, or group:<name> of one. |
| `--provider <provider>` | deprecated: --source <provider>. |
| `--account <account>` | deprecated: --source <provider>:<account>. |
| `--json` | print JSON. |

**Returns:** one task: its plan and everything linked to it

**Example:** `memo tasks show 1a2b3c4d --source telegram:1 --json`

### `memo tasks link`

link a task to messages, chats, people or URLs — or to another task: task:<id>

This command changes the local store or your files.

```sh
memo tasks link <task> [targets] [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |
| `targets` | optional | msg: locators, person:<id>, document:<id>, note:<id>, a URL; or task:<id>, which links two project tasks. |

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat it concerns, repeatable; a stored chat, by its id or title. |
| `--kind <kind>` | related-to (default), evidence — it shows the task is real — or created-from; for task:<id>, related-to, blocked-by, follow-up-of, duplicate-of or discovered-from. |
| `--account <account>` | the account it acts as: telegram:<account>, email:<account> or a notes folder, notes:<id>. |
| `--provider <provider>` | deprecated: --account <provider>:<account>. |
| `--json` | print JSON. |

**Returns:** link a task to messages, chats, people or URLs — or to another task: task:<id>

**Example:** `memo tasks link HRB-2 HRB-1 --kind blocked-by`

## `memo stats`

statistics about what the store holds

### `memo stats tasks`

task statistics

#### `memo stats tasks show`

per chat: how many tasks are open, the oldest open one, the median time to close

```sh
memo stats tasks show [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | only this chat; a stored chat, by its id or title. |
| `--type <type>` | only this type: question, request, mention or promise. |
| `--source <accounts>` | the account: telegram:<account>, email:<account>, notes:<id>, or group:<name> of one. |
| `--provider <provider>` | deprecated: --source <provider>. |
| `--account <account>` | deprecated: --source <provider>:<account>. |
| `--json` | print JSON. |

**Returns:** task stats — open, rows

**Example:** `memo stats tasks show --source telegram:1`, `memo stats tasks show --type question --source telegram:1 --json`

## `memo organizations`

companies, teams, families and communities of yours

### `memo organizations add`

add an organization of yours: a company, team, family or community

This command changes the local store or your files.

```sh
memo organizations add <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the organization's name. |

| Option | What it does |
|---|---|
| `--kind <kind>` | company, team, family, community. |
| `--scope <scope>` | personal, work. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** add an organization of yours: a company, team, family or community

**Example:** `memo organizations add 'Harbour Studio' --kind company --scope work`

### `memo organizations list`

your organizations

```sh
memo organizations list [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** your organizations

**Example:** `memo organizations list --json`

### `memo organizations context`

one organization by its id or organization:<id>: its relationships, the notes about or linking it, and its tags

```sh
memo organizations context <organization> [options]
```

| Argument | | What it is |
|---|---|---|
| `organization` | required | its id or organization:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** one organization: its relationships, notes and tags

**Example:** `memo organizations context organization:1`

## `memo projects`

projects of yours, each with a short key

### `memo projects meetings`

explicit account-scoped project membership

#### `memo projects meetings list`

meetings linked to a project in one account, or with confirmed:false proposed

```sh
memo projects meetings list <project> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | project reference, key or explicit alias. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--source <accounts>` | the meeting account: provider:account (zoom:me@example.com), or a provider that has one. |
| `--provider <provider>` | deprecated: --source <provider>. |
| `--account <account>` | deprecated: --source <provider>:<account>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--limit <n>` | meetings per page, at most 500. Default: `50`. |
| `--page <n>` | which page, from 1. |

**Returns:** meetings linked to a project in one account, or with confirmed:false proposed

**Example:** `memo projects meetings list HRB --source zoom:me@example.com`

#### `memo projects meetings link`

link a stored meeting to a project, or confirm a proposed link

This command changes the local store or your files.

```sh
memo projects meetings link <project> <meeting-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | project reference, key or explicit alias. |
| `meeting-id` | required | positive stored meeting id. |

| Option | What it does |
|---|---|
| `--account <account>` | the meeting account it acts as: provider:account, such as zoom:me@example.com. |
| `--provider <provider>` | deprecated: --account <provider>:<account>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--fingerprint <hash>` | required when confirming an existing proposal. |
| `--reason <text>` | why the reviewed meeting belongs to this project. |

**Returns:** link a stored meeting to a project, or confirm a proposed link

**Example:** `memo projects meetings link HRB 31 --account zoom:me@example.com`

### `memo projects add`

add a project of yours, with a short key its tasks use

This command changes the local store or your files.

```sh
memo projects add <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the project's name. |

| Option | What it does |
|---|---|
| `--key <key>` | 3–4 letters and digits; made from the name when left out. |
| `--type <type>` | work, client, personal, oss, other. |
| `--organization <organization>` | the organization it belongs to: its id or organization:<id>. |
| `--scope <scope>` | personal, work. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** add a project of yours, with a short key its tasks use

**Example:** `memo projects add 'Harbour' --key HRB --type client --organization 1`

### `memo projects list`

your projects

```sh
memo projects list [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** your projects

**Example:** `memo projects list`

### `memo projects context`

one project by its id, project:<id>, key, exact name or alias: its key documents first, then its relationships, notes, tags, pending findings and open tasks. Review proposals together; nothing is confirmed

```sh
memo projects context <project> [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | its id, project:<id>, key, exact name or alias. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** one project: key documents, pending findings and open tasks; start work here

**Example:** `memo projects context HRB`, `memo projects context project:2 --json`

### `memo projects evidence`

cited references about a project in stored messages, mail, meeting transcripts and imported notes folders. The project's name, its key, each of its aliases and each --alias, each --context-query and each --contact name is its own literal search, and their hits are joined. New mail and documents are indexed for search first, unless --no-catch-up. Reads only what the store holds; proposes and confirms nothing

```sh
memo projects evidence <project> [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | an existing project's id, key, exact name or alias, or a new project's name. |

| Option | What it does |
|---|---|
| `--source <accounts>` | where to look, or all: which accounts, separated by commas: provider:account (email:personal), a provider (email), a kind (mail, notes, documents) or group:<name>. |
| `--alias <name>` | another name of the project, searched on its own; repeat for more. |
| `--context-query <words>` | more words that all appear in one text; repeat for another search. |
| `--contact <person>` | a person's name; what only names them is context, not the project. |
| `--since-time <time>` | how far back: days (90d, at most 730d) or a start date (2026-09-01). Default: `60d`. |
| `--before-time <time>` | fixed exclusive end: ISO 8601 timestamp with UTC offset; days back count from it. |
| `--limit <n>` | new references at most, up to 500. Default: `100`. |
| `--max-pages <pages>` | store pages read at most this run, up to 512. |
| `--cursor <cursor>` | continue a stopped search from its checkpoint, with the same options. |
| `--before-n <n>` | messages before each message hit, shown as its context, at most 5. Default: `2`. |
| `--after-n <n>` | messages after each message hit, shown as its context, at most 5. Default: `2`. |
| `--no-catch-up` | read the search index as it is, without indexing new mail and documents first. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** find what the store holds about a project, by its names, more words and people

**Example:** `memo projects evidence SYH --source telegram:1,email:personal --contact 'Alice Example'`, `memo projects evidence SYH --source all --context-query 'crane tender' --since-time 180d --json`

### `memo projects actions`

cited key documents and findings an agent proposed for a project, with the evidence to decide them

#### `memo projects actions add`

stage an agent's cited facts and follow-ups about one project for review

This command changes the local store or your files.

```sh
memo projects actions add <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | JSON findings file, or - for stdin; at most 65536 UTF-8 bytes. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,status keeps only those fields. |

**Returns:** stage an agent's cited facts and follow-ups about one project for review

**Example:** `memo projects actions add findings.json`

#### `memo projects actions list`

a project's proposed key documents and findings, newest first, with source state, cited text and nearby messages or document paragraphs; key-document text is untracked because no fingerprint was saved

```sh
memo projects actions list <project> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | the project's id, project:<id>, key, exact name or alias. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,status keeps only those fields. |
| `--limit <n>` | findings batches per page, at most 50. Default: `10`. |
| `--page <n>` | which page, from 1; key documents come on the first. Default: `1`. |
| `--brief` | only references and source state, without excerpts or nearby text. |
| `--before-n <n>` | messages or document paragraphs before the citation, at most 5. Default: `2`. |
| `--after-n <n>` | messages or document paragraphs after the citation, at most 5. Default: `2`. |

**Returns:** a project's proposals with the evidence to decide them

**Example:** `memo projects actions list SYH`, `memo projects actions list SYH status:reviewed --brief --json`

#### `memo projects actions confirm`

confirm a suggested key document, or create the named findings of a batch and reject its other new ones; an agent decides for you only with --reason, unless agent_decisions is false

This command changes the local store or your files.

```sh
memo projects actions confirm <project> <id> [findings] [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | the project's id, project:<id>, key, exact name or alias. |
| `id` | required | key:<id> for a key document, or a findings batch number, as projects actions list gives them. |
| `findings` | optional | the finding IDs of a batch to create. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,status keeps only those fields. |
| `--as-owner` | record it as yours although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set). |
| `--fingerprint <hash>` | a findings batch's fingerprint, as projects actions list gives it. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |

**Returns:** confirm a proposal, yours or an agent's with --reason

**Example:** `memo projects actions confirm SYH 12 budget accountant --fingerprint 3f9a0c --reason 'both are stated plainly'`, `memo projects actions confirm SYH key:4`

#### `memo projects actions reject`

reject a suggested key document, or every new finding of a batch

This command changes the local store or your files.

```sh
memo projects actions reject <project> <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | the project's id, project:<id>, key, exact name or alias. |
| `id` | required | key:<id> for a key document, or a findings batch number, as projects actions list gives them. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,status keeps only those fields. |
| `--as-owner` | record it as yours although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set). |
| `--fingerprint <hash>` | a findings batch's fingerprint, as projects actions list gives it. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |

**Returns:** reject a proposal

**Example:** `memo projects actions reject SYH 12 --fingerprint 3f9a0c --reason 'not about this project'`

### `memo projects key-documents`

the notes, files and messages to read first about a project, each with why

#### `memo projects key-documents add`

mark a note:, document: or msg: reference as a key document of the project

This command changes the local store or your files.

```sh
memo projects key-documents add <project> <reference> [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | id, project:<id>, key, exact name or alias. |
| `reference` | required | note:, document: or msg: reference. |

| Option | What it does |
|---|---|
| `--reason <text>` | why it is key, in a few words. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--as-owner` | record it as yours although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set). |

**Returns:** mark a note:, document: or msg: reference as a key document of the project

**Example:** `memo projects key-documents add HRB note:12 --reason 'the brief'`

#### `memo projects key-documents remove`

unmark a key document; the note, file or message stays

This command changes the local store or your files.

```sh
memo projects key-documents remove <project> <reference> [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | id, project:<id>, key, exact name or alias. |
| `reference` | required | the key document's note:, document: or msg: reference. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** unmark a key document; the note, file or message stays

**Example:** `memo projects key-documents remove HRB note:12`

#### `memo projects key-documents list`

a project's key documents: why, who marked each and whether it is still there

```sh
memo projects key-documents list <project> [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | id, project:<id>, key, exact name or alias. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** a project's key documents: why, who marked each and whether it is still there

**Example:** `memo projects key-documents list HRB`

## `memo relationships`

relations between people, organizations and projects; never between identities

### `memo relationships add`

state that a person, organization or project belongs to or relates to another; an agent's waits for you to confirm it

This command changes the local store or your files.

```sh
memo relationships add <from> <to> [options]
```

| Argument | | What it is |
|---|---|---|
| `from` | required | the person:, organization: or project: that belongs or relates. |
| `to` | required | the person:, organization: or project: it belongs or relates to. |

| Option | What it does |
|---|---|
| `--as-owner` | record it as yours although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set). |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--kind <kind>` | member-of or related-to. Default: `member-of`. |
| `--role <role>` | the role it has there, in a few words, such as cto. |
| `--reason <text>` | why you think so, in a sentence. |

**Returns:** state that a person, organization or project belongs or relates to another

**Example:** `memo relationships add person:3 organization:1 --role cto`, `memo relationships add project:2 organization:1 --kind related-to --reason 'same client'`

### `memo relationships list`

relationships, all or those of one reference

```sh
memo relationships list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** relationship — id, from, to, kind, role, evidence, confirmed, provenance, and 2 more

**Example:** `memo relationships list about:"person:3"`

### `memo relationships remove`

remove a relationship

This command changes the local store or your files.

```sh
memo relationships remove <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the relationship's id, as relationships list gives it. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** remove a relationship

**Example:** `memo relationships remove 4`

### `memo relationships confirm`

confirm a suggested relationship

This command changes the local store or your files.

```sh
memo relationships confirm <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the relationship's id, as relationships list gives it. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** confirm a suggested relationship

**Example:** `memo relationships confirm 4`

### `memo relationships suggest`

suggest relationships between email contacts of one domain; you confirm each

```sh
memo relationships suggest [options]
```

| Option | What it does |
|---|---|
| `--source <accounts>` | the one account: provider:account (telegram:500, email:personal), or a provider or group:<name> that holds only one. |
| `--provider <provider>` | deprecated: --source <provider>. |
| `--account <account>` | deprecated: --source <provider>:<account>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--limit <n>` | most suggestions, at most 100. Default: `20`. |

**Returns:** suggest relationships between email contacts of one domain; you confirm each

**Example:** `memo relationships suggest --source email:me@example.com --limit 10`

## `memo reminders`

durable local reminders; poll hands one out and ack confirms it was shown

### `memo reminders add`

add a reminder for an open task

This command changes the local store or your files.

```sh
memo reminders add <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task's id. |

| Option | What it does |
|---|---|
| `--account <account>` | the account it acts as: provider:account, such as telegram:1 or email:personal. |
| `--provider <provider>` | deprecated: --account <provider>:<account>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--at-time <time>` | when to remind: an ISO 8601 time with its UTC offset. |
| `--timezone <zone>` | IANA timezone. Default: `UTC`. |

**Returns:** add a reminder for an open task

**Example:** `memo reminders add 7 --at-time 2026-10-20T09:00:00+02:00 --timezone Europe/Madrid --account telegram:1`

### `memo reminders list`

pending reminders of the accounts --source names (default all), soonest first

```sh
memo reminders list [options]
```

| Option | What it does |
|---|---|
| `--source <accounts>` | which accounts, separated by commas: provider:account (email:personal), a provider (email), a kind (mail, notes, documents) or group:<name>. |
| `--provider <provider>` | deprecated: --source <provider>. |
| `--account <account>` | deprecated: --source <provider>:<account>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** pending reminders of the accounts --source names (default all), soonest first

**Example:** `memo reminders list --source telegram:1`

### `memo reminders poll`

hand out due reminders, each with a receipt to acknowledge

This command changes the local store or your files.

```sh
memo reminders poll [options]
```

| Option | What it does |
|---|---|
| `--account <account>` | the account it acts as: provider:account, such as telegram:1 or email:personal. |
| `--provider <provider>` | deprecated: --account <provider>:<account>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--limit <n>` | most due reminders, at most 500. Default: `100`. |

**Returns:** hand out due reminders, each with a receipt to acknowledge

**Example:** `memo reminders poll --account telegram:1 --json`

### `memo reminders ack`

confirm that a handed-out reminder was shown

This command changes the local store or your files.

```sh
memo reminders ack <id> <receipt> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the reminder's id. |
| `receipt` | required | the receipt reminders poll handed out with it. |

| Option | What it does |
|---|---|
| `--account <account>` | the account it acts as: provider:account, such as telegram:1 or email:personal. |
| `--provider <provider>` | deprecated: --account <provider>:<account>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** confirm that a handed-out reminder was shown

**Example:** `memo reminders ack 3 3:1 --account telegram:1`

### `memo reminders cancel`

cancel a reminder

This command changes the local store or your files.

```sh
memo reminders cancel <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the reminder's id. |

| Option | What it does |
|---|---|
| `--account <account>` | the account it acts as: provider:account, such as telegram:1 or email:personal. |
| `--provider <provider>` | deprecated: --account <provider>:<account>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** cancel a reminder

**Example:** `memo reminders cancel 3 --account telegram:1`

### `memo reminders update`

move a reminder to another time

This command changes the local store or your files.

```sh
memo reminders update <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the reminder's id. |

| Option | What it does |
|---|---|
| `--account <account>` | the account it acts as: provider:account, such as telegram:1 or email:personal. |
| `--provider <provider>` | deprecated: --account <provider>:<account>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--at-time <time>` | the new time: an ISO 8601 time with its UTC offset. |
| `--revision <n>` | the reminder's current revision, as reminders list gives it. |

**Returns:** move a reminder to another time

**Example:** `memo reminders update 3 --revision 1 --at-time 2026-10-21T09:00:00+02:00 --account telegram:1`

## `memo vocabulary`

canonical projects, tags and topics with explicit aliases

### `memo vocabulary inspect`

preview two tags' assignments, aliases, automatic claims and links before consolidation; writes and merges nothing

```sh
memo vocabulary inspect <source> <survivor> [options]
```

| Argument | | What it is |
|---|---|---|
| `source` | required | the duplicate tag:<id> to inspect, from vocabulary list. |
| `survivor` | required | the canonical tag:<id> you would keep; nothing is merged. |

| Option | What it does |
|---|---|
| `--fingerprint <hash>` | the current fingerprint from unfiltered vocabulary list. |
| `--max-rows <n>` | dependency row budget, 1–20000 (default 5000). |
| `--max-read-bytes <bytes>` | dependency byte budget, 1–16777216 (default 1048576). |
| `--limit <n>` | samples per table, 1–100 (default 10); counts remain complete. |
| `--json` | print the standard JSON answer. |

**Returns:** inspect two tags before consolidation, without merging them

**Example:** `memo vocabulary inspect tag:1 tag:2 --fingerprint v1:all:all:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa --limit 5 --json`

### `memo vocabulary list`

list canonical IDs, aliases, usage counts and a preview fingerprint

```sh
memo vocabulary list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--max-entries <n>` | catalog input budget, not a page size. |
| `--max-read-bytes <bytes>` | catalog input byte budget. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** list canonical IDs, aliases, usage counts and a preview fingerprint

**Example:** `memo vocabulary list kind:tag`

### `memo vocabulary show`

the project, tag or topic an exact name or alias names; ambiguity is reported

```sh
memo vocabulary show <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the name or alias to look up, exactly. |

| Option | What it does |
|---|---|
| `--kind <kind>` | project, tag or topic. |
| `--scope <scope>` | personal or work projects. |
| `--max-entries <n>` | catalog input budget, not a page size. |
| `--max-read-bytes <bytes>` | catalog input byte budget. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** the project, tag or topic an exact name or alias names; ambiguity is reported

**Example:** `memo vocabulary show Harbour --kind project`

### `memo vocabulary check`

check a new name for an existing label or likely duplicates before vocabulary create, or without a name the whole vocabulary for likely synonyms. It merges and creates nothing

```sh
memo vocabulary check [name] [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | optional | a tag or topic you mean to create; without it, the whole vocabulary. |

| Option | What it does |
|---|---|
| `--kind <kind>` | project, tag or topic. |
| `--scope <scope>` | personal or work projects. |
| `--max-entries <n>` | catalog input budget, not a page size. |
| `--max-read-bytes <bytes>` | catalog input byte budget. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--min-similarity <n>` | without a name: minimum lexical similarity, 0.65–1. |
| `--max-comparisons <n>` | without a name: most name comparisons. |
| `--limit <n>` | without a name: most candidate pairs. |

**Returns:** check a new name for existing labels, or the vocabulary for likely synonyms

**Example:** `memo vocabulary check on-boarding --kind tag`, `memo vocabulary check --limit 20 --json`

### `memo vocabulary create`

owner: create a distinct tag or topic after vocabulary check <name>

This command changes the local store or your files.

```sh
memo vocabulary create <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the new tag or topic. |

| Option | What it does |
|---|---|
| `--kind <kind>` | tag or topic. |
| `--fingerprint <hash>` | the creation_fingerprint vocabulary check <name> gave. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** owner: create a distinct tag or topic after vocabulary check <name>

**Example:** `memo vocabulary create onboarding --kind tag --fingerprint 3f9a`

### `memo vocabulary aliases`

owner-reviewed aliases on stable canonical IDs

#### `memo vocabulary aliases add`

owner: add another name for a project, tag or topic

This command changes the local store or your files.

```sh
memo vocabulary aliases add <reference> <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `reference` | required | project:<id>, tag:<id> or topic:<id>, from vocabulary list. |
| `name` | required | the other name. |

| Option | What it does |
|---|---|
| `--fingerprint <hash>` | the current vocabulary preview fingerprint. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** owner: add another name for a project, tag or topic

**Example:** `memo vocabulary aliases add project:2 Harbor --fingerprint 3f9a`

#### `memo vocabulary aliases remove`

owner: remove another name from a project, tag or topic

This command changes the local store or your files.

```sh
memo vocabulary aliases remove <reference> <alias-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `reference` | required | project:<id>, tag:<id> or topic:<id>, from vocabulary list. |
| `alias-id` | required | the alias's id, from vocabulary list. |

| Option | What it does |
|---|---|
| `--fingerprint <hash>` | the current vocabulary preview fingerprint. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** owner: remove another name from a project, tag or topic

**Example:** `memo vocabulary aliases remove project:2 5 --fingerprint 3f9a`

## `memo memories`

what agents and you concluded, with evidence; you confirm an agent's

### `memo memories add`

write a memory; an agent's waits as proposed until you confirm it

This command changes the local store or your files.

```sh
memo memories add <text> [options]
```

| Argument | | What it is |
|---|---|---|
| `text` | required | what is true, in a sentence or two. |

| Option | What it does |
|---|---|
| `--as-owner` | record it as yours although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set). |
| `--kind <kind>` | summary, digest, preference. |
| `--scope <scope>` | personal or work. |
| `--evidence <ref...>` | what shows it: msg:, note:, meeting:, person: or another reference. |
| `--subject <ref>` | what it is about, as a reference. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 7 more

**Example:** `memo memories add 'Kai prefers Friday meetings' --kind preference --scope work --evidence note:12`

### `memo memories list`

memories, newest first

```sh
memo memories list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | most memories, up to 500. Default: `100`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 7 more

**Example:** `memo memories list status:proposed kind:preference`

### `memo memories show`

one memory with its evidence

```sh
memo memories show <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | memory:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 7 more

**Example:** `memo memories show memory:4`

### `memo memories confirm`

stand behind a memory: its evidence was checked now

This command changes the local store or your files.

```sh
memo memories confirm <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | memory:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 7 more

**Example:** `memo memories confirm memory:4`

### `memo memories stale`

mark a memory whose evidence no longer holds

This command changes the local store or your files.

```sh
memo memories stale <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | memory:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 7 more

**Example:** `memo memories stale memory:4`

## `memo mentions`

phones, e-mail, links, names and addresses in documents, notes and mail

### `memo mentions list`

the mentions in the texts --source names matching the query, newest text first

```sh
memo mentions list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | fields below; a bare word is a value. |

| Option | What it does |
|---|---|
| `--source <accounts>` | which texts, separated by commas: provider:account (email:personal), a provider (email), a kind (mail, notes, documents) or group:<name>. |
| `--limit <n>` | most mentions. Default: `100`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** the mentions in the texts --source names matching the query, newest text first

**Example:** `memo mentions list kind:phone --source notes`, `memo mentions list domain:example.com --source email:personal,email:work --json`, `memo mentions list kind:place --source mail`

### `memo mentions show`

one mention, the text around it, how many other places hold its value, and who it may be

```sh
memo mentions show <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the mention's id, from memo mentions list. |

| Option | What it does |
|---|---|
| `--source <accounts>` | the mailboxes a mail mention may be in: email:<account>, email or group:<name>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** one mention, the text around it, and who it may be

**Example:** `memo mentions show 12`, `memo mentions show 40 --source email:personal --json`

### `memo mentions confirm`

say what a mention is: a phone's owner everywhere it is written, the stored document, who a name means

This command changes the local store or your files.

```sh
memo mentions confirm <id> [person] [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the mention's id, from memo mentions list. |
| `person` | optional | person:<uid> or organization:<id> that owns the phone or address, or a name means. |

| Option | What it does |
|---|---|
| `--source <accounts>` | the mailboxes a mail mention may be in: email:<account>, email or group:<name>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--as-owner` | record it as yours although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set). |

**Returns:** say what a mention is, everywhere its value is written

**Example:** `memo mentions confirm 12 person:7`, `memo mentions confirm 40 --source email:personal`

### `memo mentions reject`

not a real mention: dismiss its value everywhere and on later imports; a name only where it is

This command changes the local store or your files.

```sh
memo mentions reject <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the mention's id, from memo mentions list. |

| Option | What it does |
|---|---|
| `--source <accounts>` | the mailboxes a mail mention may be in: email:<account>, email or group:<name>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--as-owner` | record it as yours although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set). |

**Returns:** dismiss a mention's value everywhere, and on later imports

**Example:** `memo mentions reject 12`, `memo mentions reject 40 --source email:personal`

## `memo facts`

what happened — said, asked, decided, promised — with evidence

### `memo facts add`

record a fact; an agent's waits as proposed until you confirm it

This command changes the local store or your files.

```sh
memo facts add <statement> [options]
```

| Argument | | What it is |
|---|---|---|
| `statement` | required | what happened, in one sentence. |

| Option | What it does |
|---|---|
| `--as-owner` | record it as yours although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set). |
| `--kind <kind>` | fact, statement, question, decision, promise. |
| `--evidence <ref...>` | what shows it: msg:, note:, meeting:, person: or another reference. |
| `--project <project>` | the project it belongs to: its key or project:<id>. |
| `--subject <ref>` | what it is about, as a reference. |
| `--occurred-time <time>` | when it happened, as the evidence shows, ISO 8601. |
| `--scope <scope>` | personal or work. |
| `--supersedes <ref>` | a decision only: the decision this one replaces. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** fact — ref, id, kind, text, status, project, subject, occurred_at, and 9 more

**Example:** `memo facts add 'We moved the launch to spring' --kind decision --evidence 'msg:telegram/1/77/42' --project HRB`

### `memo facts list`

facts, latest first

```sh
memo facts list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | most facts, up to 500. Default: `100`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** fact — ref, id, kind, text, status, project, subject, occurred_at, and 9 more

**Example:** `memo facts list kind:decision project:HRB`

### `memo facts show`

one fact with its evidence

```sh
memo facts show <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | fact:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** fact — ref, id, kind, text, status, project, subject, occurred_at, and 9 more

**Example:** `memo facts show fact:4`

### `memo facts confirm`

stand behind a fact an agent proposed; a decision it supersedes stops holding

This command changes the local store or your files.

```sh
memo facts confirm <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | fact:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** fact — ref, id, kind, text, status, project, subject, occurred_at, and 9 more

**Example:** `memo facts confirm fact:4`

### `memo facts reverse`

an accepted decision no longer holds, and nothing replaced it

This command changes the local store or your files.

```sh
memo facts reverse <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | fact:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** fact — ref, id, kind, text, status, project, subject, occurred_at, and 9 more

**Example:** `memo facts reverse fact:4`

## `memo meetings`

stored meeting evidence and reviewed findings

### `memo meetings actions`

cited meeting facts and project tasks waiting for owner review

#### `memo meetings actions add`

stage cited findings; facts and tasks wait for owner confirmation

This command changes the local store or your files.

```sh
memo meetings actions add <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | JSON proposal file, or - for stdin; at most 65536 UTF-8 bytes. |

| Option | What it does |
|---|---|
| `--account <account>` | the meeting account it acts as: provider:account, such as zoom:me@example.com. |
| `--provider <provider>` | deprecated: --account <provider>:<account>. |
| `--json` | print JSON; --json=id,status keeps only those fields. |

**Returns:** meeting findings — id, account, input, fingerprint, status, author, decided_by, decided_at, and 2 more

**Example:** `memo meetings actions add findings.json --account example:synthetic`

#### `memo meetings actions show`

one findings preview, prior decisions and its review receipt

```sh
memo meetings actions show <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | stored findings batch ID. |

| Option | What it does |
|---|---|
| `--source <accounts>` | the meeting account: provider:account (zoom:me@example.com), or a provider that has one. |
| `--provider <provider>` | deprecated: --source <provider>. |
| `--account <account>` | deprecated: --source <provider>:<account>. |
| `--json` | print JSON; --json=id,status keeps only those fields. |

**Returns:** meeting findings — id, account, input, fingerprint, status, author, decided_by, decided_at, and 2 more

**Example:** `memo meetings actions show 5 --source example:synthetic`

#### `memo meetings actions list`

findings batches in one meeting account, newest first

```sh
memo meetings actions list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--source <accounts>` | the meeting account: provider:account (zoom:me@example.com), or a provider that has one. |
| `--provider <provider>` | deprecated: --source <provider>. |
| `--account <account>` | deprecated: --source <provider>:<account>. |
| `--json` | print JSON; --json=id,status keeps only those fields. |
| `--limit <n>` | batches per page, at most 50. Default: `20`. |
| `--page <n>` | which page, from 1. Default: `1`. |

**Returns:** meeting findings — id, account, input, fingerprint, status, author, decided_by, decided_at, and 2 more

**Example:** `memo meetings actions list status:proposed --source example:synthetic`

#### `memo meetings actions confirm`

owner only: create selected findings and reject the other new candidates

This command changes the local store or your files.

```sh
memo meetings actions confirm <id> <ids> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | stored findings batch ID. |
| `ids` | required | candidate IDs to accept; other new candidates are rejected. |

| Option | What it does |
|---|---|
| `--account <account>` | the meeting account it acts as: provider:account, such as zoom:me@example.com. |
| `--provider <provider>` | deprecated: --account <provider>:<account>. |
| `--json` | print JSON; --json=id,status keeps only those fields. |
| `--fingerprint <hash>` | the exact fingerprint shown in the preview. |

**Returns:** meeting findings — id, account, input, fingerprint, status, author, decided_by, decided_at, and 2 more

**Example:** `memo meetings actions confirm 5 decision --fingerprint aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa --account example:synthetic`

#### `memo meetings actions reject`

owner only: reject every new candidate in this batch

This command changes the local store or your files.

```sh
memo meetings actions reject <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | stored findings batch ID. |

| Option | What it does |
|---|---|
| `--account <account>` | the meeting account it acts as: provider:account, such as zoom:me@example.com. |
| `--provider <provider>` | deprecated: --account <provider>:<account>. |
| `--json` | print JSON; --json=id,status keeps only those fields. |
| `--fingerprint <hash>` | the exact fingerprint shown in the preview. |

**Returns:** meeting findings — id, account, input, fingerprint, status, author, decided_by, decided_at, and 2 more

**Example:** `memo meetings actions reject 5 --fingerprint aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa --account example:synthetic`

### `memo meetings passage`

read a cited cue with bounded context before and after it

```sh
memo meetings passage <reference> [options]
```

| Argument | | What it is |
|---|---|---|
| `reference` | required | retained transcript cue reference from a search hit. |

| Option | What it does |
|---|---|
| `--before-n <n>` | preceding cues (default 3). |
| `--after-n <n>` | following cues (default 3); at most 999 surrounding cues in total. |
| `--bytes <bytes>` | cue JSON byte budget (default 65536); the anchor must fit. |
| `--max-read-bytes <bytes>` | stored text byte budget (default 4194304); boundary probes read metadata only. |
| `--expected-fingerprint <hash>` | reject a changed anchor using its previously read cue fingerprint. |
| `--format <format>` | compact text, Markdown or structured JSON. One of: `text`, `markdown`, `json`. Default: `text`. |
| `--source <accounts>` | the meeting account: provider:account (zoom:me@example.com), or a provider that has one. |
| `--provider <provider>` | deprecated: --source <provider>. |
| `--account <account>` | deprecated: --source <provider>:<account>. |
| `--json` | print the standard JSON answer. |

**Returns:** read a cited cue with bounded context before and after it

**Example:** `memo meetings passage meeting:1/1/1/0 --source example:synthetic --before-n 1 --after-n 1 --json`

### `memo meetings prepare`

prepare cited stored context for a series; does not verify its next meeting time

```sh
memo meetings prepare <series-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `series-id` | required | exact provider series ID. |

| Option | What it does |
|---|---|
| `--context-source <id=cursor>` | one stored app.profile or email.mailbox, optionally =cursor; repeat (tg.personal). Default: ``. |
| `--context-query <words>` | literal words to find within the selected communications. |
| `--context-since-time <time>` | communications window start as zoned ISO timestamp (default fourteen days before end). |
| `--context-before-time <time>` | exclusive communications end as zoned ISO timestamp (default preparation start). |
| `--project <project>` | include unconfirmed word evidence for one existing project name, key or alias. |
| `--since-time <time>` | window start as ISO timestamp with zone (default now). |
| `--before-time <time>` | exclusive window end as ISO timestamp (default seven days after start). |
| `--history-since-time <time>` | history start as ISO timestamp (default thirty days before start). |
| `--meetings <n>` | prior occurrences and separate related-meeting limit, 1–20 (default 5). |
| `--cues <n>` | cues per occurrence, 1–100 (default 10). |
| `--context-limit <n>` | entries per context category, 1–100 (default 20). |
| `--max-read-bytes <bytes>` | stored/normalized bytes per read, at most 4194304 (default 262144). |
| `--bytes <bytes>` | preparation item JSON bytes, 4096–4194304 (default 65536). |
| `--source <accounts>` | the meeting account: provider:account (zoom:me@example.com), or a provider that has one. |
| `--provider <provider>` | deprecated: --source <provider>. |
| `--account <account>` | deprecated: --source <provider>:<account>. |
| `--json` | print the standard JSON answer. |

**Returns:** meeting preparation — schema_version, kind, account_id, upcoming, series, history_window, meetings, related, and 6 more

**Example:** `memo meetings prepare example-series --source example:synthetic --json`, `memo meetings prepare example-series --source example:synthetic --context-source tg.personal --context-query Harbour --json`

## `memo actions`

what an agent proposes to do; confirming one makes it your task, nothing is sent

### `memo actions add`

propose an action, such as a reply or a ban, in the account that would act

This command changes the local store or your files.

```sh
memo actions add <kind> [options]
```

| Argument | | What it is |
|---|---|---|
| `kind` | required | a lower-case word: reply, send, ban, mute, pin, invite, create_task, …. |

| Option | What it does |
|---|---|
| `--as-owner` | record it as yours although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set). |
| `--reason <text>` | why it should be done. |
| `--account <account>` | the account that would act: provider:account, such as telegram:1. |
| `--provider <provider>` | deprecated: --account <provider>:<account>. |
| `--target <ref>` | what it acts on: msg:, chat:, contact:, person:, task:, …. |
| `--payload <json>` | what to do, as JSON, such as the reply's text. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** propose an action, such as a reply or a ban, in the account that would act

**Example:** `memo actions add reply --reason 'Kai asked twice' --account telegram:1 --target 'msg:telegram/1/77/42' --payload '{"text":"Friday works"}'`

### `memo actions list`

proposed actions, newest first

```sh
memo actions list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | most actions, up to 500. Default: `100`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** proposed actions, newest first

**Example:** `memo actions list status:proposed`

### `memo actions show`

one proposed action, with its payload

```sh
memo actions show <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the action's id, as actions list gives it. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** one proposed action, with its payload

**Example:** `memo actions show 5`

### `memo actions confirm`

confirm it: it becomes a task in the account that would act; nothing is sent

This command changes the local store or your files.

```sh
memo actions confirm <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the action's id, as actions list gives it. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** confirm it: it becomes a task in the account that would act; nothing is sent

**Example:** `memo actions confirm 5`

### `memo actions reject`

reject it; nothing is done

This command changes the local store or your files.

```sh
memo actions reject <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the action's id, as actions list gives it. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** reject it; nothing is done

**Example:** `memo actions reject 5`

## `memo agents`

what agents did through the MCP servers that share the store

### `memo agents log`

one row per tool call, newest first: agent, tool, tier, outcome and times, never its arguments

```sh
memo agents log [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | most rows, up to 500. Default: `100`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** one row per tool call, newest first: agent, tool, outcome and times

**Example:** `memo agents log agent:claude-code --limit 20`

## `memo mcp`

serve search, person context, memories, facts and actions over MCP on stdio

This command changes the local store or your files.

```sh
memo mcp
```

**Returns:** serve search, person context, memories, facts and actions over MCP on stdio

**Example:** `memo mcp`

## `memo search`

search stored messages, mail, notes and memories; search all when unsure where

### `memo search all`

messages, mail and notes ranked together; not people, memories, projects or decisions. A kind you know reads better with its own search, with all its fields

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
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--brief` | each message or email as reference, time, sender and excerpt only. |
| `--full` | each message or email with its whole text; --json keeps the excerpt, messages show the text. |
| `--only <resources>` | messages,mail,notes, separated by commas. |
| `--plain-order` | best first by the words alone, without moving mail from suspicious senders down. |
| `--project <project>` | rank the key documents of this project (id, project:<id>, key, exact name or alias) first; nothing is left out. |

**Returns:** hit — kind, ref, provider, account, title, timestamp, excerpt, url, and 4 more

**Example:** `memo search all 'budget harbour'`, `memo search all 'content:invoice' --only mail,notes --json`

### `memo search messages`

stored messenger messages only

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
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--brief` | each message or email as reference, time, sender and excerpt only. |
| `--full` | each message or email with its whole text; --json keeps the excerpt, messages show the text. |

**Returns:** message hit — ref, timestamp, sender_name, chat_title, excerpt, matched_in, score, found_in, and 3 more

**Next usually:** `memo messages show <message>`

**Example:** `memo search messages 'friday meeting has:voice'`

### `memo search mail`

imported emails only

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
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--brief` | each message or email as reference, time, sender and excerpt only. |
| `--full` | each message or email with its whole text; --json keeps the excerpt, messages show the text. |
| `--source <accounts>` | the mailboxes to search (default: every one): email:<account> (its name in mail.accounts or its address), email or group:<name>. |
| `--plain-order` | best first by the words alone, without moving mail from suspicious senders down. |
| `--account <account>` | deprecated: --source email:<account>. |

**Returns:** message hit — ref, timestamp, sender_name, chat_title, excerpt, matched_in, score, found_in, and 3 more

**Next usually:** `memo messages show <message>`

**Example:** `memo search mail 'mailbox:important budget' --source email:me@example.com`

### `memo search notes`

native notes by words and, with the local model, meaning

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
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--brief` | each message or email as reference, time, sender and excerpt only. |
| `--full` | each message or email with its whole text; --json keeps the excerpt, messages show the text. |
| `--filter <query>` | another query every note must match. |
| `--source <accounts>` | only these notes accounts, separated by commas: notes:internal for notes written in memo, notes:<folder id> as a hit shows it, notes or group:<name>. |
| `--page <n>` | which page, from 1. Default: `1`. |
| `--project <project>` | rank the key documents of this project (id, project:<id>, key, exact name or alias) first, labelled key; nothing is left out. |

**Returns:** note hit — ref, source, folder_id, path, title, updated_at, kind, provider, and 5 more

**Next usually:** `memo notes show <note>`

**Example:** `memo search notes budget notes:2`, `memo search notes kickoff --project HRB --json`

### `memo search memories`

memories holding every word, best first

```sh
memo search memories <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | the words to find; scope:personal or scope:work narrows them. |

| Option | What it does |
|---|---|
| `--limit <n>` | most memories, up to 500. Default: `20`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 7 more

**Example:** `memo search memories friday meetings scope:work`

### `memo search meetings`

find words in stored meetings, indexing new ones first

```sh
memo search meetings <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | words to find; each also matches its other word forms. |

| Option | What it does |
|---|---|
| `--project <project>` | meetings confirmed in this project, by name, key or alias. |
| `--since-time <time>` | meetings starting at or after this ISO 8601 date or time. |
| `--until-time <time>` | meetings starting at or before this ISO 8601 date or time. |
| `--limit <n>` | how many hits, 1 through 1000 (default 100). |
| `--cursor <cursor>` | continue from the previous page's page.next_cursor, with the same query and filters. |
| `--max-read-bytes <bytes>` | most stored bytes to read, 1 through 67108864 (default 4194304). |
| `--source <accounts>` | the meeting account: provider:account (zoom:me@example.com), or a provider that has one. |
| `--provider <provider>` | deprecated: --source <provider>. |
| `--account <account>` | deprecated: --source <provider>:<account>. |
| `--json` | print the standard JSON answer. |

**Returns:** meeting hit — ref, meeting, scope, id, excerpt, offset_ms, source

**Example:** `memo search meetings budget --source example:synthetic --project Harbour --since-time 2026-10-01 --limit 10 --json`

## `memo ask`

prepare cited evidence for your agent, or explicitly call a configured model

```sh
memo ask <question> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `question` | required | the question, in your own words. |
| `query` | optional | what to search for: words, phrases, Boolean operators and field queries; default the question. |

| Option | What it does |
|---|---|
| `--all` | look in every stored account and the notes. |
| `--source <accounts>` | look in these only: which accounts, separated by commas: provider:account (email:personal), a provider (email), a kind (mail, notes, documents) or group:<name>. |
| `--provider <provider>` | deprecated: --source <provider>. |
| `--account <account>` | deprecated: --source <provider>:<account>. |
| `--limit <n>` | most evidence items, at most 100. Default: `20`. |
| `--analyze` | call MEMO_MODELS_ANALYSIS_PROVIDER/MODEL instead of returning an evidence bundle. |
| `--allow-remote` | explicitly consent to sending this evidence to the configured model. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** prepare cited evidence for your agent, or explicitly call a configured model

**Example:** `memo ask 'what did Kai say about the budget?' --all`, `memo ask 'when is the launch?' --source telegram:1`

## `memo sync`

bring notes and mail up to date in the store, only what changed. Every configured folder and mail account unless narrowed; a notes option syncs notes only, a mail option mail only, unless both are given

This command changes the local store or your files.

```sh
memo sync [options]
```

| Option | What it does |
|---|---|
| `--only <resources>` | notes,mail, separated by commas. |
| `--folder <folder>` | notes: only this configured folder, by its id or path; repeat for more. |
| `--ignore <path>` | notes: leave this file or folder alone this run, a path or a glob; repeat for more. |
| `--source <accounts>` | mail: only these mailboxes: email:<account> (its name in mail.accounts or its address), email or group:<name>. |
| `--account <account>` | deprecated: --source email:<account>. |
| `--since-time <time>` | mail: read from this time, ISO 8601 or 30d ago (default: 30d). |
| `--limit <n>` | mail: most new emails to read per account this run (default: 200). |
| `--retry-attachments` | mail: reread stored emails' attachments after installing an extraction engine. |
| `--rescan` | mail: list every message again, not only mail an earlier run left; also checks deletions. |
| `--no-embed` | skip embedding notes and mail for search by meaning this run. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** bring notes and mail up to date in the store, only what changed

**Example:** `memo sync`, `memo sync --source email:work --since-time 2026-09-01`, `memo sync --only notes --folder ~/notes --no-embed`

## `memo auto`

run memo sync on a systemd user timer, set in the config

### `memo auto start`

sync every --every (default auto.every, else 5m), starting a minute from now

This command changes the local store or your files.

```sh
memo auto start [options]
```

| Option | What it does |
|---|---|
| `--every <duration>` | how often: 5m, 90s, 1h — a minute or more. |

**Returns:** sync every --every (default auto.every, else 5m), starting a minute from now

**Example:** `memo auto start --every 10m`

### `memo auto stop`

stop syncing on a timer and remove the timer

This command changes the local store or your files.

```sh
memo auto stop
```

**Returns:** stop syncing on a timer and remove the timer

**Example:** `memo auto stop`

### `memo auto status`

whether the timer is on, its interval, its next run and how the last one ended

```sh
memo auto status [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** whether the timer is on, its interval, its next run and how the last one ended

**Example:** `memo auto status --json`

## `memo doctor`

where memo keeps its files and what needs attention; connects to nothing

```sh
memo doctor [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** where memo keeps its files and what needs attention; connects to nothing

**Example:** `memo doctor`, `memo doctor --json`

## `memo upgrade`

upgrade memo with the package manager that installed it; --check only looks

This command changes the local store or your files.

```sh
memo upgrade [options]
```

| Option | What it does |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |
| `--json` | print JSON. |

**Returns:** upgrade memo with the package manager that installed it; --check only looks

**Example:** `memo upgrade --check`, `memo upgrade`

## `memo commands`

discover the command tree and options as shared registry data

```sh
memo commands [path] [options]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | one command, such as tags add. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** discover the command tree and options as shared registry data

**Example:** `memo commands --json`, `memo commands tags add --json`

## `memo skill`

the instructions an agent is given for this tool

### `memo skill show`

print SKILL.md — `memo skill install` puts it where Claude Code, Codex and Gemini CLI look for it

```sh
memo skill show
```

**Returns:** print SKILL.md — `memo skill install` puts it where Claude Code, Codex and Gemini CLI…

**Example:** `memo skill show`

### `memo skill install`

write SKILL.md to \~/.claude/skills/cli-memo/ (Claude Code) and \~/.agents/skills/cli-memo/ (Codex, Gemini CLI)

This command changes the local store or your files.

```sh
memo skill install [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `all`. Default: `all`. |

**Returns:** write SKILL.md to ~/.claude/skills/cli-memo/ (Claude Code) and ~/.agents/skills/cli-memo/…

**Example:** `memo skill install --for all`

## `memo guide`

scenarios: the commands for a common task, in order, and why each

```sh
memo guide [name] [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | optional | one scenario; without it, the list. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Returns:** scenarios: the commands for a common task, in order, and why each

**Example:** `memo guide`, `memo guide person-brief --json`

## Exit codes

Failures use the shared WireCat error contract.

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
