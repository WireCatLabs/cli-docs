---
title: "Все команды"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Здесь собраны все команды и параметры Memo. Описания отдельных операций сохранены на языке справки инструмента. Команды, которые работают с одним аккаунтом мессенджера или почты, принимают `--provider` и `--account`: Memo никогда не выбирает аккаунт за вас. Добавьте `--json`, чтобы получить ответ, который может прочитать скрипт или агент. Готовые задачи целиком описаны в [рецептах](./recipes.md), а обычный день — на странице [работа с Memo](./usage.md).

## Общие параметры

Эти параметры работают с самой командой `memo`.

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
| `--account <account>` | the stored account to read; required when the store holds several of that messenger. |

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
| `--meeting <id>` | also about this meeting, by its store id, with --provider and --account. |
| `--provider <provider>` | the meeting's provider. |
| `--account <account>` | the meeting's account. |
| `--export [dir]` | also write it as a file — to this folder, or notes.export.dir. |
| `--format <format>` | the file's format: obsidian, markdown. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

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

## `memo messages`

stored emails; tg and max read messenger messages

### `memo messages show`

one stored email, whole, and the emails of its thread around it

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
| `--json` | print JSON; --json=id,title keeps only those fields. |

## `memo mail`

look at a mail account before importing it, and the owner's rules

### `memo mail probe`

group an account's mail by sender and list, to decide what to keep or skip

```sh
memo mail probe <account> [options]
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

#### `memo mail rules export`

print one account's rules as JSON, to review, keep or move elsewhere

```sh
memo mail rules export <account>
```

| Argument | | What it is |
|---|---|---|
| `account` | required | the account's name in mail.accounts, or its address. |

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
| `--chat <chat>` | a stored mail thread or chat's exact id; requires --provider and --account. |
| `--provider <provider>` | the chat's provider, such as email. |
| `--account <account>` | the chat's account, such as a mailbox address. |
| `--task <id>` | label a task. |
| `--contact <person>` | label a contact identity, with provider/account. |
| `--person <uid>` | label a unified person. |
| `--organization <organization>` | label an organization: its id or organization:<id>. |
| `--project <project>` | label a project: its key or project:<id>. |
| `--meeting <id>` | label a meeting by its store id, with --provider and --account. |
| `--folder <folder>` | label a notes folder by its id or path, or with --subfolder one subfolder: every note under it. |
| `--subfolder <path>` | the subfolder inside --folder. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

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
| `--chat <chat>` | a stored mail thread or chat's exact id; requires --provider and --account. |
| `--provider <provider>` | the chat's provider, such as email. |
| `--account <account>` | the chat's account, such as a mailbox address. |
| `--task <id>` | label a task. |
| `--contact <person>` | label a contact identity, with provider/account. |
| `--person <uid>` | label a unified person. |
| `--organization <organization>` | label an organization: its id or organization:<id>. |
| `--project <project>` | label a project: its key or project:<id>. |
| `--meeting <id>` | label a meeting by its store id, with --provider and --account. |
| `--folder <folder>` | label a notes folder by its id or path, or with --subfolder one subfolder: every note under it. |
| `--subfolder <path>` | the subfolder inside --folder. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

### `memo tags list`

list source labels, optionally in one provider or account

```sh
memo tags list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--provider <provider>` | only this provider. |
| `--account <account>` | only this account; requires --provider. |
| `--limit <n>` | most labels to show. Default: `100`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

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
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
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

### `memo tasks list`

tasks of one account or one project, open by default

```sh
memo tasks list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--limit <n>` | most tasks. Default: `100`. |

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
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--as <state>` | done or dismissed. Default: `done`. |
| `--reason <text>` | why it is closed. |

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

### `memo tasks agenda`

what needs a look today, from the local store and without message text: tasks overdue, due or to check, chats where you owe an answer, chats where you wait for one

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
| `--provider <provider>` | the messenger account's provider: telegram, max. |
| `--account <account>` | the messenger account, as the store holds it. |
| `--json` | print JSON. |

### `memo tasks plan`

set a task's title, description, due date, next check and category; nothing reaches the messenger

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
| `--provider <provider>` | the messenger account's provider: telegram, max. |
| `--account <account>` | the messenger account, as the store holds it. |
| `--json` | print JSON. |

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
| `--provider <provider>` | the messenger account's provider: telegram, max. |
| `--account <account>` | the messenger account, as the store holds it. |
| `--json` | print JSON. |

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
| `--provider <provider>` | the messenger account's provider: telegram, max. |
| `--account <account>` | the messenger account, as the store holds it. |
| `--json` | print JSON. |

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
| `--provider <provider>` | the messenger account's provider: telegram, max. |
| `--account <account>` | the messenger account, as the store holds it. |
| `--json` | print JSON. |

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

### `memo organizations list`

your organizations

```sh
memo organizations list [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

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
| `--provider <provider>` | meeting provider. |
| `--account <account>` | exact stored meeting account. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--limit <n>` | meetings per page, at most 500. Default: `50`. |
| `--page <n>` | which page, from 1. |

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
| `--provider <provider>` | meeting provider. |
| `--account <account>` | exact stored meeting account. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--fingerprint <hash>` | required when confirming an existing proposal. |
| `--reason <text>` | why the reviewed meeting belongs to this project. |

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

### `memo projects list`

your projects

```sh
memo projects list [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

### `memo projects context`

one project by its id, key or project:<id>: its key documents first, then its relationships, the notes about or linking it, and its tags. Start work on a project here

```sh
memo projects context <project> [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | its id, key or project:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

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
| `project` | required | id, key or project:<id>. |
| `reference` | required | note:, document: or msg: reference. |

| Option | What it does |
|---|---|
| `--reason <text>` | why it is key, in a few words. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--as-owner` | record it as yours although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set). |

#### `memo projects key-documents remove`

unmark a key document; the note, file or message stays

This command changes the local store or your files.

```sh
memo projects key-documents remove <project> <reference> [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | id, key or project:<id>. |
| `reference` | required | the key document's note:, document: or msg: reference. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

#### `memo projects key-documents list`

a project's key documents: why, who marked each and whether it is still there

```sh
memo projects key-documents list <project> [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | id, key or project:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

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

### `memo relationships suggest`

suggest relationships between email contacts of one domain; you confirm each

```sh
memo relationships suggest [options]
```

| Option | What it does |
|---|---|
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--limit <n>` | most suggestions, at most 100. Default: `20`. |

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
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--at-time <time>` | when to remind: an ISO 8601 time with its UTC offset. |
| `--timezone <zone>` | IANA timezone. Default: `UTC`. |

### `memo reminders list`

pending reminders of one account

```sh
memo reminders list [options]
```

| Option | What it does |
|---|---|
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

### `memo reminders poll`

hand out due reminders, each with a receipt to acknowledge

This command changes the local store or your files.

```sh
memo reminders poll [options]
```

| Option | What it does |
|---|---|
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--limit <n>` | most due reminders, at most 500. Default: `100`. |

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
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

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
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

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
| `--provider <provider>` | source provider. |
| `--account <account>` | exact stored account. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--at-time <time>` | the new time: an ISO 8601 time with its UTC offset. |
| `--revision <n>` | the reminder's current revision, as reminders list gives it. |

## `memo vocabulary`

canonical projects, tags and topics with explicit aliases

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
| `--provider <provider>` | the provider of the account that would act. |
| `--account <account>` | the account that would act, when the provider has several. |
| `--target <ref>` | what it acts on: msg:, chat:, contact:, person:, task:, …. |
| `--payload <json>` | what to do, as JSON, such as the reply's text. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

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

## `memo mcp`

serve memories, proposed actions and the agent log over MCP on stdin and stdout

This command changes the local store or your files.

```sh
memo mcp
```

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
| `--project <project>` | rank the key documents of this project (id, key or project:<id>) first; nothing is left out. |

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
| `--account <account>` | only this mail account, by its name in mail.accounts or its address (default: every mail account). |

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
| `--type <type>` | file or internal. |
| `--filter <query>` | another query every note must match. |
| `--folder <folder>` | only this folder, by its id or path; repeat for more. |
| `--page <n>` | which page, from 1. Default: `1`. |
| `--project <project>` | rank the key documents of this project (id, key or project:<id>) first, labelled key; nothing is left out. |

### `memo search memories`

memories holding every word, best first

```sh
memo search memories <words> [options]
```

| Argument | | What it is |
|---|---|---|
| `words` | required | the words to find. |

| Option | What it does |
|---|---|
| `--scope <scope>` | personal or work. |
| `--limit <n>` | most memories, up to 500. Default: `20`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

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
| `--provider <provider>` | look in this provider's accounts only, such as telegram or email. |
| `--account <account>` | look in this stored account only, with --provider. |
| `--limit <n>` | most evidence items, at most 100. Default: `20`. |
| `--analyze` | call MEMO_MODELS_ANALYSIS_PROVIDER/MODEL instead of returning an evidence bundle. |
| `--allow-remote` | explicitly consent to sending this evidence to the configured model. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

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
| `--ignore <path>` | notes: also skip this file or folder, a path or a glob; repeat for more. |
| `--account <account>` | mail: only this account, by its name in mail.accounts or its address; repeat for more. |
| `--since-time <time>` | mail: read from this time, ISO 8601 or 30d ago (default: 30d). |
| `--limit <n>` | mail: most new emails to read per account this run (default: 200). |
| `--retry-attachments` | mail: reread stored emails' attachments after installing an extraction engine. |
| `--rescan` | mail: list every message again, not only mail an earlier run left; also checks deletions. |
| `--no-embed` | skip embedding notes and mail for search by meaning this run. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

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

### `memo auto stop`

stop syncing on a timer and remove the timer

This command changes the local store or your files.

```sh
memo auto stop
```

### `memo auto status`

whether the timer is on, its interval, its next run and how the last one ended

```sh
memo auto status [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

## `memo doctor`

where memo keeps its files and what needs attention; connects to nothing

```sh
memo doctor [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

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

## `memo skill`

the instructions an agent is given for this tool

### `memo skill show`

print SKILL.md — `memo skill install` puts it where Claude Code, Codex and Gemini CLI look for it

```sh
memo skill show
```

### `memo skill install`

write SKILL.md to \~/.claude/skills/cli-memo/ (Claude Code) and \~/.agents/skills/cli-memo/ (Codex, Gemini CLI)

This command changes the local store or your files.

```sh
memo skill install [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `all`. Default: `all`. |

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
