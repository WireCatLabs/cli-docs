---
title: "Все команды"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Найдите здесь любую команду Memo и её параметры. Для выбора аккаунтов чтение использует `--source`: один аккаунт, например `telegram:1` или `email:work`, все аккаунты провайдера, тип источника или `group:<name>`. Для записи от имени аккаунта используется `--account telegram:1`. Memo не выбирает аккаунт за вас. Добавьте `--json`, чтобы получить ответ для скрипта или агента. Полные задачи описаны в [рецептах](./recipes.md), обычный день в разделе [использование Memo](./usage.md), а файлы и записи из других источников в разделе [импорт](./import.md).

## Global options

These options work with the `memo` command itself.

| Option | What it does |
|---|---|
| `-V, --version` | output the version number. |
| `--debug` | on failure, show the full error record: cause and stack. |
| `--record` | keep this run even where the config says record false; record_input false leaves the typed words out. |
| `--no-record` | do not keep this run, even if it fails. |
| `--compact` | one line per item for an agent: reference first, text last, paging and next steps as # lines. |

## `memo context`

messages, mail, notes and events about a person, each with a link to its source, and `business`: their organizations, reporting lines, deals and projects, each relationship with its standing (`reported` is a CRM's word only). person:<id> reads every account; `coverage` names what was read and what was not. `proposals` counts what waits for you about them, by kind (`complete: false` means at least), and `next` names the command that lists them

```sh
memo context <person> [options]
```

| Argument | | What it is |
|---|---|---|
| `person` | required | <messenger>:<name or id>, e.g. telegram:Ana or email:ana@example.com, person:<id>, or person:me for you. |

| Option | What it does |
|---|---|
| `--limit <n>` | most messages, notes and events of each kind. Default: `20`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--source <accounts>` | the accounts to read: every one when left out, or the group's in a group run; for <messenger>:<name>, the one account of that messenger. |
| `--trimmed` | each email's own text, without quoted earlier mail or the signature — for an agent's reads. |

**Example:** `memo context telegram:'Kai Sample'`, `memo context person:7 --json`, `memo context email:kai@example.com --limit 5 --json`

## `memo show`

what any reference names, and the command that opens it

```sh
memo show <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | 1 to 100 references any WireCat CLI printed: chat:, msg:, note:, document:, person:, task:…. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo show chat:max/500/-1001 document:413`, `memo show note:12 msg:telegram/1/77/42 --json`, `memo show contract:2 invoice:4 --json`

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

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more; every field: memo commands info notes show

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

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more; every field: memo commands info notes list

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
| `--export [dir]` | also write it as a file — to this folder, or notes.export.dir. |
| `--format <format>` | the file's format: obsidian, markdown. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more; every field: memo commands info notes add

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
| `id` | required | note:<id>. |

| Option | What it does |
|---|---|
| `--revision <n>` | its current revision, so an edit made meanwhile is not lost. |
| `--text <text>` | the new text. |
| `--text-file <path>` | read the new text from a file; - reads stdin. |
| `--export [dir]` | also rewrite its file — in this folder, or notes.export.dir. |
| `--format <format>` | the file's format: obsidian, markdown. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more; every field: memo commands info notes edit

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
| `id` | required | note:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

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

**Example:** `memo notes export --output-dir ~/notes/memo --format obsidian`

### `memo notes links`

imported note files linked to the person behind an identity

#### `memo notes links show`

show the note files about a person

```sh
memo notes links show <identity> [options]
```

| Argument | | What it is |
|---|---|---|
| `identity` | required | <messenger>:<name or id> of an identity of the person. |

| Option | What it does |
|---|---|
| `--json` | print the standard JSON answer. |

**Example:** `memo notes links show telegram:101 --json`

#### `memo notes links add`

link an imported note file to a person

This command changes the local store or your files.

```sh
memo notes links add <identity> <path> [options]
```

| Argument | | What it is |
|---|---|---|
| `identity` | required | <messenger>:<name or id> of an identity of the person. |
| `path` | required | the imported note file in a configured folder. |

| Option | What it does |
|---|---|
| `--json` | print the standard JSON answer. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |

**Example:** `memo notes links add telegram:101 ~/notes/People/Kai.md`

#### `memo notes links clear`

remove the owner's note-file links for a person

This command changes the local store or your files.

```sh
memo notes links clear <identity> [options]
```

| Argument | | What it is |
|---|---|---|
| `identity` | required | <messenger>:<name or id> of an identity of the person. |

| Option | What it does |
|---|---|
| `--json` | print the standard JSON answer. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |

**Example:** `memo notes links clear telegram:101`

## `memo sources`

sources you add by hand: pasted text, a file or a web page, kept as searchable documents

### `memo sources add`

keep a file, a web page or pasted text as a document of its own; only its text is kept unless --keep-copy

This command changes the local store or your files.

```sh
memo sources add <source> [options]
```

| Argument | | What it is |
|---|---|---|
| `source` | required | a file's path, an http(s) address, or - to read the text from stdin. |

| Option | What it does |
|---|---|
| `--reason <text>` | why, in a few words; required when an agent decides for you. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--title <title>` | a title; otherwise the page's or file's own, or the text's first line. |
| `--subject <ref>` | who or what it is about: person:, organization:, project:, task:, meeting:, or <messenger>:<name or id>; repeat for more. |
| `--keep-copy` | also keep a copy of the file in memo's data folder, so it opens after the file is gone. |
| `--max-chars <n>` | most characters of text to keep, up to 2000000 (default 200000). |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo sources add ~/Downloads/runner-notes.pdf --subject project:3 --keep-copy`, `memo sources add https://example.org/release-notes --title 'Release notes' --json`, `memo sources add - --title 'Call with Kai' --subject person:12`

### `memo sources preview`

read a web page as sources add would, with the same refusals, and say what would be kept; nothing is saved

```sh
memo sources preview <url> [options]
```

| Argument | | What it is |
|---|---|---|
| `url` | required | an http(s) address. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=title,excerpt keeps only those fields. |

**Example:** `memo sources preview https://example.org/release-notes`, `memo sources preview https://example.org/release-notes --json=title,excerpt`

### `memo sources show`

one source: its text, what is kept, what it is about, and the facts, memories and batches citing it

```sh
memo sources show <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | document:<id>, as sources add answered. |

| Option | What it does |
|---|---|
| `--bytes <bytes>` | most UTF-8 bytes of its text, up to 1048576 (default 16384). |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo sources show document:42`, `memo sources show document:42 --bytes 65536 --json`

### `memo sources mentions`

people and organizations memo knows whose names appear in a source's text; nothing leaves

```sh
memo sources mentions <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | document:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo sources mentions document:42 --json`

### `memo sources remove`

remove a source you added, and its copy if one was kept; the next source check reviews what cites it

This command changes the local store or your files.

```sh
memo sources remove <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | document:<id> of a source you added. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo sources remove document:42`

### `memo sources suggest`

send a source's text to the reader you chose and stage the facts it finds, each with a quote checked against the text, as one batch only you confirm

This command changes the local store or your files.

```sh
memo sources suggest <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | document:<id> of the source, as sources add answered. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--provider <provider>` | read with this reader once: ai-model, claude-code, codex, ollama, openai, anthropic; only you name one. |
| `--model <model>` | the reader's model this once; only you may name one. |
| `--subject <ref>` | who or what every fact is about: person:, organization:, project: or task:. |
| `--rescan` | read it again although this reader already read this text. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo sources suggest document:42`, `memo sources suggest document:42 --subject person:12 --json`, `memo sources suggest document:42 --provider ollama --model llama3.2 --rescan`

### `memo sources readers`

the readers that can propose facts from a source: installed, signed in, and which one you chose

#### `memo sources readers list`

each reader: installed, signed in, its model, whether the text leaves this computer, and your pick

```sh
memo sources readers list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo sources readers list`, `memo sources readers list available:true --json`

#### `memo sources readers set`

choose the reader sources suggest sends a source's text to, and its model; only you choose

This command changes the local store or your files.

```sh
memo sources readers set <reader> [options]
```

| Argument | | What it is |
|---|---|---|
| `reader` | required | ai-model, claude-code, codex, ollama, openai, anthropic. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--model <model>` | its model; Ollama and the API readers need one, Claude Code and Codex use their own. |
| `--base-url <url>` | Ollama only: its address on this computer, when not http://127.0.0.1:11434. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo sources readers set claude-code`, `memo sources readers set ollama --model llama3.2`, `memo sources readers set ollama --model llama3.2 --base-url http://127.0.0.1:11500`

## `memo documents`

every document the store holds, of every account: Drive, notes folders, added sources, imports

### `memo documents list`

documents of every account, newest change first, with their source, folder and kind

```sh
memo documents list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | documents per page, 1–500. Default: `50`. |
| `--page <n>` | which page, from 1. Default: `1`. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo documents list budget kind:pdf`, `memo documents list source:google-drive:me@example.com folder:Contracts --page 2 --json`

### `memo documents tree`

the accounts holding documents, each with its folders and how many documents each holds

```sh
memo documents tree [options]
```

| Option | What it does |
|---|---|
| `--source <accounts>` | only this provider:account, or every account of a provider; repeat for more. |
| `--depth <n>` | folder levels to list, 0–20. Default: `3`. |
| `--json` | print JSON; --json=source,count keeps only those fields. |

**Example:** `memo documents tree --depth 2 --json`

### `memo documents show`

one document: a part of its text, its tags, the people it names and its meetings

```sh
memo documents show <document> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | document:<id>, from documents list. |

| Option | What it does |
|---|---|
| `--cursor <cursor>` | the character its text starts at: where the last read ended. Default: `0`. |
| `--max-chars <n>` | characters of text at most, 1–200000. Default: `20000`. |
| `--json` | print JSON; --json=ref,text keeps only those fields. |

**Example:** `memo documents show document:12 --cursor 20000 --max-chars 20000 --json`

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
| `--format <format>` | how its notes are written: obsidian, markdown (default for a new folder: obsidian in an Obsidian vault, one with a .obsidian folder in it or above it, markdown otherwise). |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo folders add ~/notes`

### `memo folders update`

bind a folder id from another computer to the folder's path on this one

This command changes the local store or your files.

```sh
memo folders update <id> <path> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the folder's id, as memo folders add printed it. |
| `path` | required | the same folder on this computer. |

| Option | What it does |
|---|---|
| `--format <format>` | how its notes are written: obsidian, markdown. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo folders update 1 ~/notes`

### `memo folders remove`

stop reading a notes folder here; its notes stay unless --allow-delete

This command changes the local store or your files.

```sh
memo folders remove <folder> [options]
```

| Argument | | What it is |
|---|---|---|
| `folder` | required | the folder's id or its path, as memo folders list prints them. |

| Option | What it does |
|---|---|
| `--allow-delete` | also delete the folder's notes from the store, their text included. |
| `--yes` | confirm --allow-delete. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo folders remove 1`, `memo folders remove 1 --allow-delete --yes`

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

**Example:** `memo folders list --json`

## `memo messages`

stored messenger messages and emails

### `memo messages show`

one stored message or email whole, with optional stored neighbours

```sh
memo messages show <message> [options]
```

| Argument | | What it is |
|---|---|---|
| `message` | required | the msg:provider/account/chat/message reference a search gives. |

| Option | What it does |
|---|---|
| `--before-n <n>` | also this many earlier emails of its thread. Default: `0`. |
| `--after-n <n>` | also this many later emails of its thread. Default: `0`. |
| `--full` | whole attachment text, not the first 4000 characters of each, and the HTML and AMP versions of the body. |
| `--trimmed` | each email's own text, without quoted earlier mail or the signature — for an agent's reads. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo messages show 'msg:email/me%40example.com/thread/42' --before-n 2 --after-n 2`

### `memo messages acknowledge`

record that a holder — an agent or a pipeline — processed the mail `review --holder` gave it, with the cursor that review gave; the mark only moves forward, and mail still partial waits for the next review

This command changes the local store or your files.

```sh
memo messages acknowledge [options]
```

| Option | What it does |
|---|---|
| `--holder <name>` | whose mark: lower-case letters, digits and dashes, such as mail-triage. |
| `--cursor <cursor>` | the cursor `review --holder` gave. |
| `--source <accounts>` | the one mailbox: email:<address>, email or group:<name>; may be left out when the store holds one mailbox. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** mail mark — holder, through_id, through_received_at, held, read, skipped, updated_at; every field: memo commands info messages acknowledge

**Example:** `memo messages acknowledge --holder mail-triage --cursor 9123.1762090000000 --source email:work`, `memo messages acknowledge --holder mail-triage --cursor 9123.1762090000000 --source email:me@example.com --json`, `memo messages acknowledge --holder backfill --cursor 870.1762090000000 --source email:personal`

### `memo messages reset`

the owner moves a holder's mark back past the mail received since --since-time, or past the last --last emails it was given; its next reviews give that mail again. The answer says how many emails it reads again. Every reset counts, even one that leaves the mark where it is, so the holder's next findings key is new. An agent cannot: a holder only moves its own mark forward, with `messages acknowledge`

This command changes the local store or your files.

```sh
memo messages reset [options]
```

| Option | What it does |
|---|---|
| `--holder <name>` | whose mark: lower-case letters, digits and dashes, such as mail-triage. |
| `--since-time <time>` | read again what was received since this ISO 8601 time, or 2d ago. |
| `--last <n>` | read again the last n emails the holder was given. |
| `--dry-run` | count what would be read again, and move nothing. |
| `--source <accounts>` | the one mailbox: email:<address>, email or group:<name>; may be left out when the store holds one mailbox. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** mail mark reset — mark, from_id, again, bulk, skipped, resets, dry_run; every field: memo commands info messages reset

**Example:** `memo messages reset --holder mail-triage --last 8 --dry-run --source email:me@example.com`, `memo messages reset --holder mail-triage --since-time 2026-11-04T00:00:00Z --source email:work --json`

## `memo mail`

mail the mail CLI stored: review new mail for an agent, stage what it found

### `memo mail findings`

cited tasks, task updates, facts, memories, links, contacts, invoices, payments and orders an agent read in new mail

#### `memo mail findings add`

stage one mailbox's findings for the owner; nothing is created until the owner confirms

This command changes the local store or your files.

```sh
memo mail findings add <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | the findings JSON itself (starts with {), a JSON file, or - for stdin; at most 65536 UTF-8 bytes. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,status keeps only those fields. |
| `--source <accounts>` | the one mailbox: email:<address>, email or group:<name>; may be left out when the store holds one mailbox. |
| `--key <key>` | the findings key `mail review --holder` gave in its mail-findings.add step. |
| `--dry-run` | check the batch as staging would, invoices, payments and orders tried and rolled back, and stage nothing; answers valid and every finding's problem at once. |

**Returns:** mail findings — id, account, input, fingerprint, status, author, decided_by, decided_at, and 2 more; every field: memo commands info mail findings add

**Example:** `memo mail findings add findings.json --source email:work`, `memo mail findings add findings.json --source email:work --key mail-triage:9123 --dry-run --json`, `memo mail findings add '{"schema_version":1,"key":"mail-triage:9123","extractor":"mail-triage/1","findings":[…]}' --source email:me@example.com --json`

#### `memo mail findings show`

one findings batch: its findings with their evidence, earlier decisions and the review receipt

```sh
memo mail findings show <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the batch id `mail findings add` or `list` gave. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,status keeps only those fields. |

**Returns:** mail findings — id, account, input, fingerprint, status, author, decided_by, decided_at, and 2 more; every field: memo commands info mail findings show

**Example:** `memo mail findings show 41`, `memo mail findings show 41 --json`, `memo mail findings show 41 --json=id,input.findings`

#### `memo mail findings list`

mail findings batches, newest first; status:proposed is what waits for the owner

```sh
memo mail findings list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,status keeps only those fields. |
| `--source <accounts>` | only this mailbox's batches: email:<address>. |
| `--limit <n>` | batches per page, at most 50. Default: `20`. |
| `--page <n>` | which page, from 1. Default: `1`. |

**Returns:** mail findings — id, account, input, fingerprint, status, author, decided_by, decided_at, and 2 more; every field: memo commands info mail findings list

**Example:** `memo mail findings list status:proposed`, `memo mail findings list --source email:work --json`, `memo mail findings list status:reviewed --limit 50 --page 2`

### `memo mail review`

every stored email, yours too, in threads that changed since a point — for reviewing who owes what. It reads what sync stored, so it asks the mail server nothing

```sh
memo mail review [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | where the last review ended: date>2h; 3 days ago if no date. |

| Option | What it does |
|---|---|
| `--unanswered [duration]` | only threads whose newest email came to you, in To or Cc, with no answer for this long — 4h, 1d; 24h if not given. |
| `--waiting [duration]` | only threads where you wrote last and nobody answered for this long — 3d; 7d if not given. |
| `--holder <name>` | read for this holder — an agent or a pipeline — what is stored past its processing mark, by store order; newsletters, envelopes, drafts, suspicious senders and partial mail left out; other bulk mail after the rest, as its subject and first lines (excerpt_only); each text without quoted earlier mail or the signature; `messages acknowledge` moves the mark. |
| `--new` | what changed since the last `review --new` of this mailbox, a point per thread — for scheduled runs. |
| `--source <accounts>` | the one mailbox: email:<address>, email or group:<name>; may be left out when the store holds one mailbox. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** message summary — ref, chat_id, timestamp, sender_name, sender_is_me, outgoing, text, attachments, and 4 more; every field: memo commands info mail review

**Next usually:** `memo messages show <message>`

**Example:** `memo mail review --holder mail-triage --source email:work --json`, `memo mail review --unanswered 1d --source email:personal`, `memo mail review 'date>2h' --source email:me@example.com`

## `memo people`

the people memo knows: who is who across sources, and whom to assign tasks to

### `memo people add`

add a person by name, before any message names them

This command changes the local store or your files.

```sh
memo people add <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | what to call them. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo people add Lena Example`

### `memo people list`

people of one kind: person (the default: the owner, people added by hand or assigned a task, and named people with a tie to you, such as a one-to-one chat, a group of at most 10, mail you wrote, a meeting, a CRM deal of yours or your address book), organization, automated (bots, newsletters, notifications), stranger (no tie), unsorted (no name), test (what a test run left, hidden from every other list) or all, which leaves test out. The owner first, then by the messages and mail they sent

```sh
memo people list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--sort <field>` | interactions, recent, name, tasks (default interactions). Default: `interactions`. |
| `--limit <n>` | most people on a page, up to 5000. Default: `500`. |
| `--page <n>` | which page, from 1. Default: `1`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo people list --json`, `memo people list kind:organization --sort name --page 2`

### `memo people check`

people whose names start like these words, the same name first: check before adding a person

```sh
memo people check <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the name being typed. |

| Option | What it does |
|---|---|
| `--limit <n>` | most people, up to 50. Default: `8`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo people check ivan petrov --json`

### `memo people show`

one person: their identities by source with the accounts that saw each, merges and open matches

```sh
memo people show <who> [options]
```

| Argument | | What it is |
|---|---|---|
| `who` | required | person:<uid>, or <messenger>:<name or id> of an identity of the person. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo people show person:12`, `memo people show telegram:Lena --json`

### `memo people review`

what waits for the owner about who is who: matches (people that may be one) and splits (identities an agent says are not this person), highest score first, then newest; people confirm or people reject answers them, and people resolve company answers a match on a shared mailbox

```sh
memo people review [options]
```

| Option | What it does |
|---|---|
| `--kind <kind>` | all, link, split (default all). Default: `all`. |
| `--limit <n>` | most proposals, up to 500. Default: `50`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo people review`, `memo people review --kind split --json`

### `memo people confirm`

confirm matches (the people become one) and splits (the identities leave their person) by id or range as people review lists them, or `all` of what it lists with the same --kind and --limit; each is decided on its own, so a refusal leaves the others decided. `all` shows what it would do until --yes

This command changes the local store or your files.

```sh
memo people confirm <ids> [options]
```

| Argument | | What it is |
|---|---|---|
| `ids` | required | ids or ranges as people review lists them (17080 17082-17085), or all. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--kind <kind>` | with all: all, link, split (default all). Default: `all`. |
| `--limit <n>` | with all: as many as people review lists, up to 500. Default: `50`. |
| `--yes` | with all: do it, not only show what would be done. |
| `--reason <text>` | why, in a few words. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo people confirm 17080 17082-17085`, `memo people confirm all --kind split --yes`

### `memo people reject`

turn down matches and splits by id or range, or `all` of what people review lists; a turned-down match comes back only on new evidence, a turned-down split not while its identities stay on that person. `all` shows what it would do until --yes

This command changes the local store or your files.

```sh
memo people reject <ids> [options]
```

| Argument | | What it is |
|---|---|---|
| `ids` | required | ids or ranges as people review lists them (17080 17082-17085), or all. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--kind <kind>` | with all: all, link, split (default all). Default: `all`. |
| `--limit <n>` | with all: as many as people review lists, up to 500. Default: `50`. |
| `--yes` | with all: do it, not only show what would be done. |
| `--reason <text>` | why they are turned down, in a few words. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo people reject 17081 --reason 'two people'`, `memo people reject all --kind link --reason 'not one'`

### `memo people resolve`

answers a match with company: the address goes to the organization you name, else to the one that has the address or its company domain, else to one named --name, else to a new company named after the domain. The two people are not joined and are not proposed again on that address. A match on a shared mailbox (people review shows shared and mailbox) names its address; on any other match, by name say, --mailbox names which of the two people's addresses it is. organization answers a match whose two people are the company's mailboxes: every address on it goes to one organization, chosen the same way, else named after the people's shared name; people who are only those addresses become the company's, people with other identities keep them and stay people

This command changes the local store or your files.

```sh
memo people resolve <id> <answer> [organization] [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the match's id as people review lists it. |
| `answer` | required | company: the mailbox is a company's, not either person's; organization: both are the company's mailboxes. |
| `organization` | optional | organization:<id> to give the addresses to. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--name <name>` | the company's name, when no organization is named. |
| `--mailbox <address>` | with company, on a match not about a shared mailbox: the company's address. |
| `--all` | every match waiting on the same addresses, in this one answer; without it, only this match. |
| `--reason <text>` | why, in a few words. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo people resolve 17092 company`, `memo people resolve 17093 company organization:12 --json`, `memo people resolve 17094 organization --name "Shop Ltd"`

### `memo people links`

who is who: the links that make identities one person

#### `memo people links check`

people that may be wrong, you first: your person holding an identity under another name, what may be test data (sure test data is hidden without asking: people list kind:test), an identity joined by an address a person of another name has, one person with different names and nothing in common. Each says why and gives the unlink or unmerge that fixes it; an agent adds --reason and it waits for you in people review. What you linked by hand, what the person held when you did, what you kept with people links resolve <who> keep, or kept together by turning a split down, is left out

```sh
memo people links check [options]
```

| Option | What it does |
|---|---|
| `--limit <n>` | most people on a page, up to 200. Default: `20`. |
| `--page <n>` | which page, from 1. Default: `1`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo people links check`, `memo people links check --page 2 --json`

#### `memo people links resolve`

answers a doubt with keep: the person's links are right, so links check stops listing the identities in doubt until one of them moves to another person; an identity that joins later is checked again, and an agent's split of the kept ones is refused. Keep also says what looked like test data is a real contact, and brings back a person memo hid as test data (people list kind:test lists them). test: the person is test data, hidden from every list until you keep them

This command changes the local store or your files.

```sh
memo people links resolve <who> <answer> [options]
```

| Argument | | What it is |
|---|---|---|
| `who` | required | person:<uid> as people links check lists it, person:me, or an identity of the person. |
| `answer` | required | keep: the person is right as they are; test: the person is test data. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo people links resolve person:42 keep`, `memo people links resolve person:42 keep --from-app --json`, `memo people links resolve person:42 test`

### `memo people scan`

match people across sources now: the same address or a phone two people share joins them, the rest waits in people review; memo sync runs it too

This command changes the local store or your files.

```sh
memo people scan [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo people scan`

### `memo people link`

say two identities are one person: yours links them, an agent's waits for you as a match

This command changes the local store or your files.

```sh
memo people link <identity> <other> [options]
```

| Argument | | What it is |
|---|---|---|
| `identity` | required | <messenger>:<name or id>. |
| `other` | required | <messenger>:<name or id> of the person it joins. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo people link max:Lena telegram:Lena`, `memo people link max:Lena telegram:Lena --reason 'same phone in her signature'`

### `memo people unlink`

take identities off their person: one gets a person of its own again, several move together to one new person, and no automatic match joins them back; yours applies at once, an agent's waits for you in people review

This command changes the local store or your files.

```sh
memo people unlink <identities> [options]
```

| Argument | | What it is |
|---|---|---|
| `identities` | required | the identities that leave, each <messenger>:<id> exactly, all of one person. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |
| `--from <person>` | the person they leave, person:<uid> or person:me; refused when they sit on another. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo people unlink telegram:12345 --from person:me`, `memo people unlink email:lena@example.com max:6789 --from person:42 --reason 'her husband's mailbox'`

### `memo people unmerge`

give the identities a merge brought back to the person they came from; yours applies at once, an agent's waits for you in people review

This command changes the local store or your files.

```sh
memo people unmerge <merge> [options]
```

| Argument | | What it is |
|---|---|---|
| `merge` | required | merge:<to>-<from>, as people show lists it. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo people unmerge merge:12-34`, `memo people unmerge merge:12-34 --reason 'a shared mailbox'`

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
| `--json` | print JSON; --json=id,title keeps only those fields. |

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
| `--json` | print JSON; --json=id,title keeps only those fields. |

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
| `--limit <n>` | most labels to show. Default: `100`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

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

**Example:** `memo tasks unlink HRB-2 HRB-1 --kind blocked-by`

### `memo tasks links`

a task's links to other tasks

```sh
memo tasks links <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task: task:<id> or its id. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo tasks links HRB-2 --json`

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
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--title <title>` | one line saying what is to be done. |
| `--priority <n>` | low, medium, high, critical; 0 (urgent) … 4 (low) still read as before. |
| `--parent <id>` | the parent task, in the same project. |
| `--description <text>` | the detail, in Markdown. |
| `--type <type>` | question, request (default), mention or promise from a source; bug, feature or chore (default) in a project. |
| `--project <project>` | a task without a source: the project's key or project:<id>. |
| `--assignee <person...>` | who does it: a person's UID. |
| `--due <time>` | a project task: when it must be done, an ISO 8601 time or 2h, 3d from now. |
| `--status <state>` | a project task: its state from the start, open, todo, in_progress, done, dismissed. |
| `--agent <agent>` | a project task: the agent working on it, apart from its assignees. |
| `--external-id <service:id>` | its id in an outside service, such as avito:4512345678 for an Avito chat. |
| `--source-url <url>` | the http or https page it is about, such as the Avito ad or conversation. |
| `--into <id>` | link the source to this task instead of opening one that may be the same job. |
| `--new` | open the task even when one like it is open or was closed in the last 14 days. |

**Example:** `memo tasks add 'msg:telegram/1/77/42' --account telegram:1 --type request`, `memo tasks add --project HRB --title 'Draft the budget' --type feature`, `memo tasks add --project INBOX --title 'Reply on Avito to Ivan' --external-id avito:4512345678 --source-url https://www.avito.ru/4512345678`

### `memo tasks list`

tasks of the --source accounts, open by default; a board field lists every task

```sh
memo tasks list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--source <accounts>` | which accounts, separated by commas: provider:account (email:personal), a provider (email), a kind (mail, notes, documents) or group:<name>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--limit <n>` | most tasks, at most 500 for a project's. Default: `100`. |
| `--sort <field>` | every task: priority, due, created, updated, key, state (default priority). |
| `--desc` | the --sort order reversed. |
| `--cursor <cursor>` | the next page of every task, from page.next_cursor, with the same query and order. |

**Returns:** task — ref, id, title, kind, state, created_at, key, description, and 26 more; every field: memo commands info tasks list

**Next usually:** `memo tasks links <task>`, `memo tasks status <task>`, `memo tasks show <task>`

**Example:** `memo tasks list state:done --source telegram:1`, `memo tasks list project:HRB ready:true --json`, `memo tasks list project:* priority:[high TO critical] "invoice" --sort due --json`

### `memo tasks counts`

how many tasks match, found ones too, by project, assignee, priority and state

```sh
memo tasks counts [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** task — ref, id, title, kind, state, created_at, key, description, and 26 more; every field: memo commands info tasks counts

**Next usually:** `memo tasks links <task>`, `memo tasks status <task>`, `memo tasks show <task>`

**Example:** `memo tasks counts project:* --json`

### `memo tasks comments`

what people and agents wrote on a task

#### `memo tasks comments add`

comment on a task, in your name or the agent's that runs memo

This command changes the local store or your files.

```sh
memo tasks comments add <id> <text> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the task's id or key. |
| `text` | required | what to say, in Markdown. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo tasks comments add HRB-1 Booked the hall for Friday`

#### `memo tasks comments list`

a task's comments, oldest first, with who wrote each and when

```sh
memo tasks comments list <id> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the task's id or key. |
| `query` | optional | field:value terms; this list filters by none yet. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo tasks comments list HRB-1 --json`

### `memo tasks history`

who changed a task, what and when, oldest first

```sh
memo tasks history <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the task's id or key. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo tasks history HRB-1 --json`

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
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--as <state>` | done or dismissed. Default: `done`. |
| `--reason <text>` | why it is closed. |
| `--revision <n>` | refuse the write unless the task is still at this revision (conflict, task.stale, exit 15). |

**Example:** `memo tasks close 7 --account telegram:1 --as dismissed --reason 'answered by phone'`

### `memo tasks assign`

name who works on a task, or with --clear take them off it

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
| `--clear` | take the person off the task in that role, instead of adding them. |
| `--revision <n>` | refuse the write unless the task is still at this revision (conflict, task.stale, exit 15). |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo tasks assign 7 person:3`, `memo tasks assign HRB-1 person:3 --clear --revision 4`

### `memo tasks move`

put a project task before or after another in its board column: it takes a priority between them, and the answer says when its label changed; beside a task in another column it moves into that column

This command changes the local store or your files.

```sh
memo tasks move <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the task's id or key. |

| Option | What it does |
|---|---|
| `--status <state>` | move it to this column too: open, todo, in_progress, done, dismissed; with --before or --after it must be that task's column. |
| `--before <id>` | the task it goes just above. |
| `--after <id>` | the task it goes just below. |
| `--revision <n>` | refuse the write unless the task is still at this revision (conflict, task.stale, exit 15). |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo tasks move HRB-3 --status in_progress --before HRB-1 --revision 4`

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
| `--json` | print JSON. |

**Returns:** agenda — at, account, stored_at, stale, tasks, owed, waiting, unsynced, and 2 more; every field: memo commands info tasks agenda

**Example:** `memo tasks agenda --source telegram:1`, `memo tasks agenda --source max:1 --waiting 3d --within 90d --json`

### `memo tasks update`

update stored tasks: source edits name --account; a found task takes priority, status, agent and --project

This command changes the local store or your files.

```sh
memo tasks update <task> [options]
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
| `--description <text>` | the detail, in Markdown; none clears it. |
| `--due <time>` | when it must be done: an ISO 8601 time, a date (its end), today, or 2h, 3d from now; none clears it. |
| `--remind-time <time>` | when to look at it again: an ISO 8601 time, a date (its start), today, or 2h, 3d from now; none clears it. |
| `--assignee <person...>` | who does it: sender (whoever sent the task's message) or person:<id>; none clears it. Leave it out when unsure: a task with no assignee is better than none. |
| `--account <account>` | the account it acts as: telegram:<account>, email:<account>, notes:<id>. |
| `--json` | print JSON. |
| `--agent <agent>` | the agent working on the task, apart from its assignees; none clears it. |
| `--project <project>` | move the task, a found one too, to a project, by key or project:<id>; it and its subtasks take new keys there, and the old keys still find them. A subtask moves alone only with --parent none. |
| `--type <type>` | bug, feature, chore in a project; a found task keeps a message kind until it moves into one. |
| `--revision <n>` | refuse the write unless the task is still at this revision (conflict, task.stale, exit 15). |
| `--status <state>` | the task's state: open, todo, in_progress, done, dismissed; a closed one reopens. |

**Returns:** task card — id, ref, key, project, project_key, project_name, created_by, title, and 26 more; every field: memo commands info tasks update

**Example:** `memo tasks update HRB-1 --title 'Send the budget' --priority high --account telegram:1`, `memo tasks update 1a2b3c4d --due 2d --title 'Send the revised budget' --account telegram:1`

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
| `--json` | print JSON. |

**Returns:** task card — id, ref, key, project, project_key, project_name, created_by, title, and 26 more; every field: memo commands info tasks show

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
| `--account <account>` | the account it acts as: telegram:<account>, email:<account>, notes:<id>. |
| `--json` | print JSON. |

**Returns:** task links — id, ref, key, project, project_key, project_name, created_by, title, and 28 more; every field: memo commands info tasks link

**Example:** `memo tasks link HRB-2 HRB-1 --kind blocked-by`

### `memo tasks claim`

take an open task so no other agent works it at once; the claim lapses by itself

This command changes the local store or your files.

```sh
memo tasks claim <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

| Option | What it does |
|---|---|
| `--lease <duration>` | how long the claim lasts: 30m, 2h (default 30m); claiming again extends it. |
| `--holder <name>` | who you are for claims: a session id or a chat id; default WIRECAT_HOLDER, else Claude Code's session, else the agent's name. |
| `--account <account>` | the account it acts as: telegram:<account>, email:<account>, notes:<id>. |
| `--json` | print JSON. |

**Returns:** task card — id, ref, key, project, project_key, project_name, created_by, title, and 26 more; every field: memo commands info tasks claim

**Example:** `memo tasks claim HRB-1 --lease 2h --account telegram:1`

### `memo tasks release`

give back a task you claimed, before the claim lapses; the owner may release any

This command changes the local store or your files.

```sh
memo tasks release <task> [options]
```

| Argument | | What it is |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

| Option | What it does |
|---|---|
| `--holder <name>` | who you are for claims: a session id or a chat id; default WIRECAT_HOLDER, else Claude Code's session, else the agent's name. |
| `--account <account>` | the account it acts as: telegram:<account>, email:<account>, notes:<id>. |
| `--json` | print JSON. |

**Returns:** task card — id, ref, key, project, project_key, project_name, created_by, title, and 26 more; every field: memo commands info tasks release

**Example:** `memo tasks release HRB-1 --account telegram:1`

## `memo stats`

statistics about what the store holds

### `memo stats tasks`

task statistics

#### `memo stats tasks show`

tasks per chat, meeting or project: open now, and opened and closed in the period (created: in the query), with the median time to close and the mean age of the open ones

```sh
memo stats tasks show [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--by <group>` | chat (default) or meeting: this account's tasks; project: the owner's project tasks, every project. |
| `--type <type>` | only this type: question, request, mention or promise. |
| `--timezone <zone>` | the IANA timezone for calendar days in the period, such as created>=today. |
| `--source <accounts>` | the account: telegram:<account>, email:<account>, notes:<id>, or group:<name> of one. |
| `--json` | print JSON. |

**Returns:** task — ref, id, title, kind, state, created_at, key, description, and 26 more; every field: memo commands info stats tasks show

**Next usually:** `memo tasks links <task>`, `memo tasks status <task>`, `memo tasks show <task>`

**Example:** `memo stats tasks show --source telegram:1`, `memo stats tasks show --type question --source telegram:1 --json`

### `memo stats projects`

project statistics

#### `memo stats projects show`

for each of your projects, the chats linked to it or its child projects (every confirmed link, any purpose, no chat limit, unlike projects status): how many, how many are muted, messages and yours in the period by when they were sent, the newest message and the three busiest chats; a muted chat's messages are not counted. Busiest first. One read for all projects; projects status <project> says where one stands

```sh
memo stats projects show [options]
```

| Option | What it does |
|---|---|
| `--since-time <time>` | how far back: days (30d, at most 730d), a start date (2026-09-01) or all. Default: `30d`. |
| `--limit <n>` | most projects on a page, up to 200. Default: `20`. |
| `--page <n>` | which page, from 1. Default: `1`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo stats projects show`, `memo stats projects show --since-time 7d --json`

## `memo organizations`

companies, teams, families and communities of yours

### `memo organizations add`

add an organization of yours: a company, team, family or community; it is written at once, whoever runs it

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

**Example:** `memo organizations add 'Harbour Studio' --kind company --scope work`, `memo organizations add 'Harbour Family' --kind family`

### `memo organizations rename`

rename an organization of yours; it is written at once, whoever runs it

This command changes the local store or your files.

```sh
memo organizations rename <organization> <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `organization` | required | its id or organization:<id>. |
| `name` | required | the new name. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo organizations rename organization:1 'Harbour Studio Ltd'`, `memo organizations rename 1 'Harbour Studio Ltd' --json`

### `memo organizations show`

one organization by its id or organization:<id>, without its relationships, notes and tags

```sh
memo organizations show <organization> [options]
```

| Argument | | What it is |
|---|---|---|
| `organization` | required | its id or organization:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo organizations show organization:1`

### `memo organizations list`

your organizations; category:client, supplier, partner or employer keeps those its relationships make so

```sh
memo organizations list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** organization — id, ref, kind, name, scope, created_at; every field: memo commands info organizations list

**Example:** `memo organizations list name:*harbour*`, `memo organizations list category:client`, `memo organizations list --json`

### `memo organizations context`

one organization by its id or organization:<id>: its people by role, customers, suppliers and partners, projects, open deals and leads, invoices, payments and orders, how much its people wrote, open tasks and categories, each relationship with its standing; then the notes about it and its tags. `coverage` names what was not read

```sh
memo organizations context <organization> [options]
```

| Argument | | What it is |
|---|---|---|
| `organization` | required | its id or organization:<id>. |

| Option | What it does |
|---|---|
| `--limit <n>` | most items in each section. Default: `20`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo organizations context organization:1`, `memo organizations context 1 --json`

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
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--limit <n>` | meetings per page, at most 500. Default: `50`. |
| `--page <n>` | which page, from 1. |

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
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--fingerprint <hash>` | required when confirming an existing proposal. |
| `--reason <text>` | why the reviewed meeting belongs to this project. |

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

**Example:** `memo projects add 'Harbour' --key HRB --type client --organization 1`

### `memo projects list`

your projects

```sh
memo projects list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** project — id, ref, key, name, kind, type, organization_id, scope, and 1 more; every field: memo commands info projects list

**Example:** `memo projects list`

### `memo projects context`

one project by its id, project:<id>, key, exact name or alias: its key documents first, then its relationships, notes, tags, pending findings and open tasks. Review proposals together; nothing is confirmed. `review.waiting` counts what waits for you, by kind, and `next` names the command that lists them

```sh
memo projects context <project> [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | its id, project:<id>, key, exact name or alias. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo projects context HRB`, `memo projects context project:2 --json`

### `memo projects evidence`

cited references about a project in stored messages, mail, meeting transcripts and imported notes folders. The project's name, its key, each of its aliases and each --alias, each --context-query and each --contact name is its own search: every word of it must appear in one text, in any order, as whole words; their hits are joined. Every message of a chat confirmed as the project's (memo relationships add chat:<provider>/<account>/<chat> project:<id>) is read too, when --source holds its account, and so is everything a confirmed person member of the project wrote (as --contact person:<id>, without aliases). New mail and documents are indexed for search first, unless --no-catch-up. Reads what the store holds; with --sync-first it first syncs the linked chats the store lacks for the window by running their messenger CLI (tg, max, wa) with the profile signed in to each chat's account, or the one --sync-profile names when several are; proposes and confirms nothing. A partial answer exits 0 with meta.complete false

This command changes the local store or your files.

```sh
memo projects evidence <project> [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | an existing project's id, key, exact name or alias, or a new project's name. |

| Option | What it does |
|---|---|
| `--source <accounts>` | where to look, or all: which accounts, separated by commas: provider:account (email:personal), a provider (email), a kind (mail, notes, documents) or group:<name>. |
| `--alias <name>` | another name of the project, searched on its own; repeat for more. Default: ``. |
| `--context-query <words>` | more words that all appear in one text; repeat for another search. Default: ``. |
| `--contact <person>` | a name to search, or person:<id> to read what that person's stored identities wrote and search the aliases you gave them; what only names them or comes from them is context, not the project. Default: ``. |
| `--since-time <time>` | how far back: days (90d, at most 730d) or a start date (2026-09-01). Default: `60d`. |
| `--before-time <time>` | fixed exclusive end: ISO 8601 timestamp with UTC offset; days back count from it. |
| `--limit <n>` | new references at most, up to 500. Default: `100`. |
| `--max-pages <pages>` | store pages read at most this run, up to 512. |
| `--cursor <cursor>` | continue a stopped search from its checkpoint, with the same options. |
| `--before-n <n>` | messages before each message hit, shown as its context, at most 5. Default: `2`. |
| `--after-n <n>` | messages after each message hit, shown as its context, at most 5. Default: `2`. |
| `--no-catch-up` | read the search index as it is, without indexing new mail and documents first. |
| `--sync-first` | first sync the linked chats the store does not hold back to --since-time, through their messenger CLI; off by default. |
| `--sync-time <duration>` | time for all of --sync-first's syncs together. Default: `3m`. |
| `--sync-profile <tool=profile>` | the messenger profile to sync as when several are signed in to a chat's account, such as max=default; repeat for another tool. It must be signed in to that account. |
| `--purpose <purpose>` | the linked chats' purposes to read, comma-separated: work, sales, support, other, or all; default work. |
| `--include-proposed` | also read chats and members proposed for the project, after the confirmed ones. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo projects evidence SYH --source telegram:1,email:personal --contact 'Alice Example'`, `memo projects evidence SYH --source all --context-query 'crane tender' --since-time 180d --json`

### `memo projects status`

where a project stands, from the stored messages of every chat confirmed as the project's or its child projects', in every account those links name (meta.accounts lists them): the last message, who replies next, open questions both ways, promises, amounts found by words with their direction (only when the project has no confirmed invoice or payment), payments recorded, billed, paid and owed per currency from confirmed invoices and payments (finance), up to five open deals (deals), how long each --context-query has been quiet on their side, and how much of each chat is held. Amounts, directions and promises found by words are marked pattern: read the cited message before trusting one. Others' questions in a group with no role, and others' word-found promises in a group, are counted on the chat's row as unlisted, not listed. next names at most two chats to read, with the messenger command that reads them. No model call; nothing leaves this machine

```sh
memo projects status <project> [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | an existing project's id, project:<id>, key, exact name or alias. |

| Option | What it does |
|---|---|
| `--since-time <time>` | how far back: days (60d, at most 730d) or a start date (2026-09-01). Default: `60d`. |
| `--before-time <time>` | fixed exclusive end: ISO 8601 timestamp with UTC offset; days back count from it. |
| `--context-query <words>` | words that all appear in one text; reports their last mention per side. Repeat for another. Default: ``. |
| `--sync-profile <tool=profile>` | the messenger profile the next steps name when several are signed in to a chat's account, such as max=default; repeat for another tool. |
| `--purpose <purpose>` | the linked chats' purposes to read, comma-separated: work, sales, support, other, or all; default work. |
| `--compact` | one line per signal, chat and next step, for an agent. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** project status — project, key, name, signals, money, chats, purposes, out_of_scope, and 7 more; every field: memo commands info projects status

**Example:** `memo projects status HRB --context-query 1C`, `memo projects status HRB --compact`

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
| `file` | required | the findings JSON itself (starts with {), a JSON file, or - for stdin; at most 65536 UTF-8 bytes. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,status keeps only those fields. |

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

**Returns:** project action — kind, id, status, reason, provenance, evidence, fingerprint, author, and 5 more; every field: memo commands info projects actions list

**Example:** `memo projects actions list SYH`, `memo projects actions list SYH status:reviewed --brief --json`

#### `memo projects actions confirm`

confirm a suggested key document, or create the named findings of a batch and reject its other new ones; an agent decides for you only when agent_decisions is true, and with --reason

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
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--fingerprint <hash>` | a findings batch's fingerprint, as projects actions list gives it. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |

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
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--fingerprint <hash>` | a findings batch's fingerprint, as projects actions list gives it. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |

**Example:** `memo projects actions reject SYH 12 --fingerprint 3f9a0c --reason 'not about this project'`

### `memo projects annotations`

selected project aliases, facts and generic links; not a full backup

#### `memo projects annotations show`

read selected project annotations without creating a file; not a full backup

```sh
memo projects annotations show <project> [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | the project's id, key, exact name or alias. |

| Option | What it does |
|---|---|
| `--max-read-bytes <bytes>` | source input byte budget, at most 4194304. |
| `--json` | print the standard JSON answer. |

**Example:** `memo projects annotations show HRB --max-read-bytes 1048576 --json`

#### `memo projects annotations export`

write selected annotations to a new private file, omitting source bodies

This command changes the local store or your files.

```sh
memo projects annotations export <project> [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | the project's id, key, exact name or alias. |

| Option | What it does |
|---|---|
| `--output <file>` | new snapshot file; parent folder must exist and existing paths are refused. |
| `--max-read-bytes <bytes>` | source input byte budget, at most 4194304. |
| `--json` | print JSON; --json=project,counts keeps only those fields. |

**Example:** `memo projects annotations export HRB --output harbour-annotations.json --json`

#### `memo projects annotations check`

check bindings and conflicts in an existing target without restoring

```sh
memo projects annotations check <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | version2 snapshot JSON file, at most 4194304 UTF-8 bytes. |

| Option | What it does |
|---|---|
| `--target-store <file>` | explicit existing destination store; never created by preview. |
| `--project <project>` | explicit destination project:<id>; its key and name must match the snapshot. |
| `--bindings <file>` | JSON object mapping every external source reference and the project to explicit target references. |
| `--max-read-bytes <bytes>` | destination input byte budget, at most 4194304. |
| `--json` | print JSON; --json=ready,fingerprint keeps only those fields. |

**Example:** `memo projects annotations check harbour-annotations.json --target-store ./trial/wirecat.db --project project:2 --bindings bindings.json --json`

#### `memo projects annotations restore`

owner: restore selected annotations with the exact successful check fingerprint

This command changes the local store or your files.

```sh
memo projects annotations restore <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | version2 snapshot JSON file, at most 4194304 UTF-8 bytes. |

| Option | What it does |
|---|---|
| `--target-store <file>` | explicit existing destination store; never created by preview. |
| `--project <project>` | explicit destination project:<id>; its key and name must match the snapshot. |
| `--bindings <file>` | JSON object mapping every external source reference and the project to explicit target references. |
| `--max-read-bytes <bytes>` | destination input byte budget, at most 4194304. |
| `--json` | print JSON; --json=project,counts keeps only those fields. |
| `--fingerprint <hash>` | exact fingerprint returned by the successful target preview. |

**Example:** `memo projects annotations restore harbour-annotations.json --target-store ./trial/wirecat.db --project project:2 --bindings bindings.json --fingerprint aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa --json`

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
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |

**Example:** `memo projects key-documents add HRB note:12 --reason 'the brief'`

#### `memo projects key-documents remove`

unmark a key document; the note, file or message stays. Only you remove one

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
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |

**Example:** `memo projects key-documents remove HRB note:12`

#### `memo projects key-documents list`

a project's key documents: why, who marked each and whether it is still there

```sh
memo projects key-documents list <project> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | required | id, project:<id>, key, exact name or alias. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** memo key document — id, ref, title, path, reason, available, confirmed, origin, and 2 more; every field: memo commands info projects key-documents list

**Example:** `memo projects key-documents list HRB`

## `memo relationships`

relations between people, organizations and projects; never between identities

### `memo relationships add`

state that a person, organization or project belongs to, reports to, is a customer or partner of, or relates to another, or that a chat is a project's (member-of only); an agent's waits for you to confirm it

This command changes the local store or your files.

```sh
memo relationships add <from> <to> [options]
```

| Argument | | What it is |
|---|---|---|
| `from` | required | the person:, organization: or project: that belongs or relates, or chat:<provider>/<account>/<chat> of a project. |
| `to` | required | the person:, organization: or project: it belongs or relates to. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--kind <kind>` | member-of, reports-to, customer-of, partner-of, related-to. Default: `member-of`. |
| `--role <role>` | its role: in an organization employee, contractor, founder, owner, manager, adviser, contact; in a project owner, manager, contributor, client-contact, approver; on a deal or lead owner, contact, decision-maker, influencer. A job title is not a role. |
| `--role-note <text>` | what the role means here, in your words, beside a role from its list. |
| `--engagement <level>` | a person on a project: how much you deal with them yourself, not how active they are: none, low, medium or high. |
| `--position <title>` | the job title, such as 'Procurement manager'; kept apart from the role. |
| `--start-date <date>` | the first day it held, such as 2026-01-01. |
| `--end-date <date>` | the last day it held, included; it ends at the start of the day after. |
| `--reason <text>` | why you think so, in a sentence. |

**Example:** `memo relationships add person:3 organization:1 --role employee --position CTO --start-date 2026-01-01`, `memo relationships add person:3 person:5 --kind reports-to`, `memo relationships add organization:1 organization:2 --kind customer-of --reason 'signed in October'`

### `memo relationships list`

relationships (who works where, who reports to whom, who is on a deal), all or those of one reference, with titles; confirmed:false lists the proposals waiting for you, as memo review kind:relationship does

```sh
memo relationships list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | most relationships, up to 500. Default: `100`. |
| `--page <n>` | which page, from 1. Default: `1`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** relationship — id, from, to, kind, role, purpose, evidence, confirmed, and 9 more; every field: memo commands info relationships list

**Example:** `memo relationships list about:"person:3"`, `memo relationships list kind:reports-to to:"person:5"`, `memo relationships list standing:reported include:ended --limit 50`

### `memo relationships update`

set what a relationship is: its role and a note beside it, how much you deal with a person on a project, or what a chat is for in a project (work, sales, support, other); an agent's change waits for you in memo review

This command changes the local store or your files.

```sh
memo relationships update <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the relationship's id, as relationships list gives it. |

| Option | What it does |
|---|---|
| `--role <role>` | its role: in an organization employee, contractor, founder, owner, manager, adviser, contact; in a project owner, manager, contributor, client-contact, approver; on a deal or lead owner, contact, decision-maker, influencer. A job title is not a role; an empty value clears it. |
| `--role-note <text>` | what the role means here, in your words; an empty value clears it. |
| `--engagement <level>` | a person on a project: how much you deal with them yourself, not how active they are: none, low, medium or high; an empty value clears it. |
| `--position <title>` | the job title; an empty value clears it. |
| `--start-date <date>` | the first day it held, such as 2026-01-01. |
| `--purpose <purpose>` | what the chat is for in the project: work, sales, support or other. |
| `--reason <text>` | why, in a sentence. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |

**Example:** `memo relationships update 12 --purpose sales`, `memo relationships update 12 --engagement low`, `memo relationships update 12 --role approver --role-note 'signs the acts'`

### `memo relationships remove`

remove a relationship; removing a suggested one rejects it

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
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |

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
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |

**Example:** `memo relationships confirm 4`

### `memo relationships end`

say that a relationship no longer holds, from a day on; it stays, as ended, and relationships list include:ended shows it. An agent's waits for you in memo review

This command changes the local store or your files.

```sh
memo relationships end <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the relationship's id, as relationships list gives it. |

| Option | What it does |
|---|---|
| `--end-date <date>` | the last day it held, included; it ends at the start of the day after. Today when left out. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |

**Example:** `memo relationships end 4 --end-date 2026-09-30`

### `memo relationships roles`

the roles a relationship may take: built in and your own

#### `memo relationships roles list`

the roles of every list, or of one with list:<name>; each built in (with labels in English, Russian and Spanish) or yours

```sh
memo relationships roles list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo relationships roles list`, `memo relationships roles list list:deal --json`

#### `memo relationships roles add`

add a role of your own to a list; relationships may then take it. Only you change the lists

This command changes the local store or your files.

```sh
memo relationships roles add <list> <role> [options]
```

| Argument | | What it is |
|---|---|---|
| `list` | required | organization (roles in an organization), project, deal (a deal's or a lead's), contract (a party's) or related (what a person or an organization is to another). |
| `role` | required | the role's id: lowercase letters, digits and -, such as board-member. |

| Option | What it does |
|---|---|
| `--label <label>` | how it reads, such as 'Board member'. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |

**Example:** `memo relationships roles add organization board-member --label 'Board member'`

#### `memo relationships roles remove`

remove a role of your own; a built-in one stays, and one a relationship still holds is refused

This command changes the local store or your files.

```sh
memo relationships roles remove <list> <role> [options]
```

| Argument | | What it is |
|---|---|---|
| `list` | required | organization (roles in an organization), project, deal (a deal's or a lead's), contract (a party's) or related (what a person or an organization is to another). |
| `role` | required | the role's id. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |

**Example:** `memo relationships roles remove organization board-member`

### `memo relationships scan`

chats, mail threads and people that look like a project's, scored from the store: its name and aliases in titles and messages, the chats and threads of its members in every messenger, spreading from what it finds. With no project, people who share a company mail domain. Lists them and writes nothing; --yes writes them as proposals by memo-scan for you to decide in memo review. Never confirms, and never proposes again what you rejected

This command changes the local store or your files.

```sh
memo relationships scan [project] [options]
```

| Argument | | What it is |
|---|---|---|
| `project` | optional | a project's id, key, exact name or alias, or all; left out, people by mail domain. |

| Option | What it does |
|---|---|
| `--source <accounts>` | where to look, or all: which accounts, separated by commas: provider:account (email:personal), a provider (email), a kind (mail, notes, documents) or group:<name>. |
| `--since-time <time>` | how far back messages count: days (90d, at most 730d) or a date. Default: `90d`. |
| `--limit <n>` | new proposals per project at most, up to 50. Default: `20`. |
| `--yes` | write the proposals; without it nothing is written. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo relationships scan HRB --source all`, `memo relationships scan HRB --source telegram:1,email:personal --yes`, `memo relationships scan --source email:me@example.com`

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
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--at-time <time>` | when to remind: an ISO 8601 time with its UTC offset. |
| `--timezone <zone>` | IANA timezone; the computer's when not given. |

**Example:** `memo reminders add 7 --at-time 2026-10-20T09:00:00+02:00 --timezone Europe/Madrid --account telegram:1`

### `memo reminders list`

pending reminders of the accounts --source names (default all), soonest first

```sh
memo reminders list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--source <accounts>` | which accounts, separated by commas: provider:account (email:personal), a provider (email), a kind (mail, notes, documents) or group:<name>. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** reminder — id, task, due_at, timezone, state, revision, receipt; every field: memo commands info reminders list

**Example:** `memo reminders list --source telegram:1`

### `memo reminders claim`

hand out due reminders, each with a receipt to acknowledge

This command changes the local store or your files.

```sh
memo reminders claim [options]
```

| Option | What it does |
|---|---|
| `--account <account>` | the account it acts as: provider:account, such as telegram:1 or email:personal. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--limit <n>` | most due reminders, at most 500. Default: `100`. |

**Example:** `memo reminders claim --account telegram:1 --json`

### `memo reminders acknowledge`

confirm that a handed-out reminder was shown

This command changes the local store or your files.

```sh
memo reminders acknowledge <id> <receipt> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the reminder's id. |
| `receipt` | required | the receipt reminders claim handed out with it. |

| Option | What it does |
|---|---|
| `--account <account>` | the account it acts as: provider:account, such as telegram:1 or email:personal. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo reminders acknowledge 3 3:1 --account telegram:1`

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
| `--json` | print JSON; --json=id,title keeps only those fields. |

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
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--at-time <time>` | the new time: an ISO 8601 time with its UTC offset. |
| `--revision <n>` | the reminder's current revision, as reminders list gives it. |

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
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--quote <ref=words...>` | the words an --evidence reference says that this rests on, as <ref>=<words>, one per reference. A later check raises nothing while the source still says them. |
| `--kind <kind>` | summary, digest, preference. |
| `--scope <scope>` | personal or work. |
| `--evidence <ref...>` | what shows it: msg:, note:, meeting:, person: or another reference. |
| `--subject <ref>` | what it is about, as a reference. |
| `--project <project>` | the project it belongs to: its key or project:<id>. |
| `--supersedes <ref>` | the memory this one corrects, superseded once this one is confirmed; an agent's waits until you confirm it. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 13 more; every field: memo commands info memories add

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
| `--limit <n>` | most memories on a page, up to 500. Default: `100`. |
| `--page <n>` | which page, from 1. Default: `1`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 13 more; every field: memo commands info memories list

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
| `--sources` | read each piece of evidence back: who, when, a short excerpt, and whether it is gone. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 13 more; every field: memo commands info memories show

**Example:** `memo memories show memory:4 --sources`

### `memo memories update`

move a memory to another project, or to none

This command changes the local store or your files.

```sh
memo memories update <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | memory:<id>. |

| Option | What it does |
|---|---|
| `--project <project>` | the project's key or project:<id>; none takes it out of its project. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 13 more; every field: memo commands info memories update

**Example:** `memo memories update memory:4 --project SYH`, `memo memories update memory:4 --project none`

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
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 13 more; every field: memo commands info memories confirm

**Example:** `memo memories confirm memory:4`

### `memo memories invalidate`

mark a memory whose evidence no longer holds

This command changes the local store or your files.

```sh
memo memories invalidate <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | memory:<id>. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 13 more; every field: memo commands info memories invalidate

**Example:** `memo memories invalidate memory:4`

### `memo memories remove`

forget a memory: erase its text, its links to sources and its search entry

This command changes the local store or your files.

```sh
memo memories remove <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | memory:<id>. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |

**Example:** `memo memories remove memory:4`

### `memo memories check`

compare what memories and facts cite with the sources now, least recently checked first: a changed source that still says the quoted words is signed again; one that changed, went or was replaced raises a memory_source_review for you to decide. Status never changes here. changed_refs lists changed sources no findings batch reads yet, for an agent to read again with projects actions add; a run names a change once, so --since-time also lists those an earlier run, such as memo sync's, already found. memo sync runs it too

This command changes the local store or your files.

```sh
memo memories check [options]
```

| Option | What it does |
|---|---|
| `--limit <n>` | most evidence links this run, up to 10000. Default: `500`. |
| `--since-time <time>` | changed_refs also lists sources earlier runs found changed since then: 12h, 7d or a date (2026-11-01). |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** source check — checked, baselined, raised, refreshed, closed, changed_refs; every field: memo commands info memories check

**Example:** `memo memories check`, `memo memories check --limit 2000 --json`

### `memo memories challenge`

say a memory is contradicted, citing what shows it: this opens its memory_source_review, or adds to the open one, and changes nothing else. Only you decide it (memo review show <id>). An agent may run it

This command changes the local store or your files.

```sh
memo memories challenge <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | memory:<id>. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--evidence <ref...>` | what contradicts it: msg:, note:, meeting:, fact: or another reference. |
| `--reason <text>` | why it no longer holds, in a sentence. |
| `--suggest <text>` | what the memory should say instead, for you to take or leave. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo memories challenge memory:4 --evidence note:15 --reason 'the later note moves delivery to the 30th'`, `memo memories challenge memory:4 --evidence note:15 --reason 'moved' --suggest 'Delivery is on the 30th' --json`

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
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |

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
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |

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
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--quote <ref=words...>` | the words an --evidence reference says that this rests on, as <ref>=<words>, one per reference. A later check raises nothing while the source still says them. |
| `--kind <kind>` | fact, statement, question, decision, promise. |
| `--evidence <ref...>` | what shows it: msg:, note:, meeting:, person: or another reference. |
| `--project <project>` | the project it belongs to: its key or project:<id>. |
| `--subject <ref>` | what it is about, as a reference. |
| `--occurred-time <time>` | when it happened, as the evidence shows, ISO 8601. |
| `--scope <scope>` | personal or work. |
| `--supersedes <ref>` | the proposed or accepted fact this one corrects; it stays, marked superseded once this one is accepted. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** fact — ref, id, kind, text, status, project, subject, occurred_at, and 14 more; every field: memo commands info facts add

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
| `--limit <n>` | most facts on a page, up to 500. Default: `100`. |
| `--page <n>` | which page, from 1. Default: `1`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** fact — ref, id, kind, text, status, project, subject, occurred_at, and 14 more; every field: memo commands info facts list

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
| `--sources` | read each piece of evidence back: who, when, a short excerpt, and whether it is gone. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** fact — ref, id, kind, text, status, project, subject, occurred_at, and 14 more; every field: memo commands info facts show

**Example:** `memo facts show fact:4 --sources`

### `memo facts confirm`

stand behind a fact an agent proposed; a fact it supersedes stops holding. memo review confirm decides many

This command changes the local store or your files.

```sh
memo facts confirm <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | fact:<id>. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |

**Returns:** fact — ref, id, kind, text, status, project, subject, occurred_at, and 14 more; every field: memo commands info facts confirm

**Example:** `memo facts confirm fact:4`

### `memo facts revoke`

take back your approval of an agent's fact; it waits as proposed again. Not for a correction or your own fact

This command changes the local store or your files.

```sh
memo facts revoke <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | fact:<id>. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |

**Returns:** fact — ref, id, kind, text, status, project, subject, occurred_at, and 14 more; every field: memo commands info facts revoke

**Example:** `memo facts revoke fact:4`

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
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |

**Returns:** fact — ref, id, kind, text, status, project, subject, occurred_at, and 14 more; every field: memo commands info facts reverse

**Example:** `memo facts reverse fact:4`

### `memo facts reject`

turn down a fact an agent proposed; it stays, marked rejected

This command changes the local store or your files.

```sh
memo facts reject <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | fact:<id>. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |

**Returns:** fact — ref, id, kind, text, status, project, subject, occurred_at, and 14 more; every field: memo commands info facts reject

**Example:** `memo facts reject fact:4`

### `memo facts remove`

forget a fact: erase its text, its links to sources and its tags

This command changes the local store or your files.

```sh
memo facts remove <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | fact:<id>. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |

**Example:** `memo facts remove fact:4`

### `memo facts challenge`

say a fact is contradicted, citing what shows it: this opens its memory_source_review, or adds to the open one, and changes nothing else. Only you decide it (memo review show <id>). An agent may run it

This command changes the local store or your files.

```sh
memo facts challenge <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | fact:<id>. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--evidence <ref...>` | what contradicts it: msg:, note:, meeting:, fact: or another reference. |
| `--reason <text>` | why it no longer holds, in a sentence. |
| `--suggest <text>` | what the fact should say instead, for you to take or leave. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo facts challenge fact:4 --evidence 'msg:telegram/1/77/50' --reason 'reversed in chat'`

## `memo invoices`

invoices you issued or received, with their lines and what paid them; amounts per currency

### `memo invoices list`

invoices, newest first; review:proposed lists what waits for you

```sh
memo invoices list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |
| `--limit <n>` | most invoices, up to 500. Default: `100`. |

**Example:** `memo invoices list project:HRB open:true`, `memo invoices list review:proposed --json`

### `memo invoices show`

one invoice with its lines and the payments allocated to it

```sh
memo invoices show <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | invoice:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo invoices show invoice:4`

### `memo invoices add`

record an invoice of one line, and add more with invoices lines add; yours is confirmed at once; an agent's waits as proposed for you in memo review

This command changes the local store or your files.

```sh
memo invoices add <amount> <currency> <description> [options]
```

| Argument | | What it is |
|---|---|---|
| `amount` | required | a decimal, such as 50000.00. |
| `currency` | required | ISO 4217, such as RUB. |
| `description` | required | what it bills, in a few words. |

| Option | What it does |
|---|---|
| `--person <uid>` | the person billed or billing: person:<id>. |
| `--organization <organization>` | the organization billed or billing: organization:<id>. |
| `--kind <kind>` | receivable (you bill them) or payable (they bill you). |
| `--title <title>` | the invoice's number, as printed on it. |
| `--occurred-time <time>` | the day it was issued, such as 2026-11-01. |
| `--due <time>` | the day it is due, such as 2026-11-15. |
| `--project <project>` | the project it belongs to: its key or project:<id>. |
| `--reason <text>` | why an agent proposes it, for the owner who decides. |
| `--evidence <ref...>` | what shows it, up to 8: msg:, note:, document: or another reference. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo invoices add 50000.00 RUB Bed rental, November --kind receivable --organization organization:3 --project HRB`, `memo invoices add 1200.50 EUR Hosting --kind payable --person person:7 --title 2026-118 --due 2026-11-15`

### `memo invoices lines`

the lines of an invoice, each a quantity at a price; its total is their sum. you change any invoice's lines; an agent only those of an invoice it proposed that is still proposed

#### `memo invoices lines add`

add a line at the end of an invoice that is not void; the total never falls below what confirmed payments settled: quantity × price, and the total becomes the sum of the lines. With --product its name and price are copied, so a later price change leaves the line as it is, and --amount sets another price; without --product, --amount is needed. you change any invoice's lines; an agent only those of an invoice it proposed that is still proposed

This command changes the local store or your files.

```sh
memo invoices lines add <invoice> <quantity> [description] [options]
```

| Argument | | What it is |
|---|---|---|
| `invoice` | required | invoice:<id>. |
| `quantity` | required | how many, a decimal such as 12 or 1.5. |
| `description` | optional | what the line is, in a few words; the product's name when left out. |

| Option | What it does |
|---|---|
| `--product <product>` | the product or service it is: its name and price are copied onto the line. |
| `--amount <decimal>` | the price of one, such as 10000.00; the product's when left out with --product. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo invoices lines add invoice:4 1 --product product:4`, `memo invoices lines add invoice:4 2 Delivery --amount 1500.00`

#### `memo invoices lines remove`

take a line off an invoice; the others keep their positions, and the last line stays. you change any invoice's lines; an agent only those of an invoice it proposed that is still proposed

This command changes the local store or your files.

```sh
memo invoices lines remove <invoice> <position> [options]
```

| Argument | | What it is |
|---|---|---|
| `invoice` | required | invoice:<id>. |
| `position` | required | the line's position, from 1, as invoices show lists it. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo invoices lines remove invoice:4 2`

## `memo payments`

money paid to you or by you, and the invoices each payment settles; amounts per currency

### `memo payments list`

payments, newest first; review:proposed lists what waits for you

```sh
memo payments list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |
| `--limit <n>` | most payments, up to 500. Default: `100`. |

**Example:** `memo payments list project:HRB direction:in`, `memo payments list review:proposed --json`

### `memo payments show`

one payment with the invoices it is allocated to

```sh
memo payments show <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | payment:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo payments show payment:9`

### `memo payments add`

record a payment, or with --refund-of a refund of one; yours is confirmed at once; an agent's waits as proposed for you in memo review. payments allocate matches it to an invoice

This command changes the local store or your files.

```sh
memo payments add <amount> <currency> [options]
```

| Argument | | What it is |
|---|---|---|
| `amount` | required | a decimal, such as 50000.00. |
| `currency` | required | ISO 4217, such as RUB. |

| Option | What it does |
|---|---|
| `--person <uid>` | the person who paid or was paid: person:<id>. |
| `--organization <organization>` | the organization who paid or was paid: organization:<id>. |
| `--kind <kind>` | in (paid to you) or out (paid by you). |
| `--title <title>` | the payment's reference, such as the bank's purpose line. |
| `--occurred-time <time>` | the day it was paid, such as 2026-11-01; today when left out. |
| `--refund-of <payment>` | the payment this one gives money back for, going the other way: payment:<id>. |
| `--project <project>` | the project it belongs to: its key or project:<id>. |
| `--reason <text>` | why an agent proposes it, for the owner who decides. |
| `--evidence <ref...>` | what shows it, up to 8: msg:, note:, document: or another reference. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo payments add 25000.00 RUB --kind in --organization organization:3 --occurred-time 2026-11-01 --project HRB`, `memo payments add 5000.00 RUB --kind out --organization organization:3 --refund-of payment:9`

### `memo payments allocate`

settle part of an invoice with part of a payment, in their one currency, never beyond either; an agent allocates only a payment it proposed

This command changes the local store or your files.

```sh
memo payments allocate <payment> <invoice> <amount> [options]
```

| Argument | | What it is |
|---|---|---|
| `payment` | required | payment:<id>. |
| `invoice` | required | invoice:<id>. |
| `amount` | required | a decimal, such as 25000.00. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo payments allocate payment:9 invoice:4 25000.00`

### `memo payments unlink`

take back what a payment settles of an invoice, to allocate it again; you set right a confirmed payment's wrong split, and an agent unlinks only a still-proposed payment it proposed

This command changes the local store or your files.

```sh
memo payments unlink <payment> <invoice> [options]
```

| Argument | | What it is |
|---|---|---|
| `payment` | required | payment:<id>. |
| `invoice` | required | invoice:<id>. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo payments unlink payment:9 invoice:4`

## `memo orders`

orders you placed or took, for whom, from which shop, and how far delivery got

### `memo orders list`

orders, newest first; review:proposed is what waits for you

```sh
memo orders list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |
| `--limit <n>` | most orders, up to 500. Default: `100`. |

**Example:** `memo orders list status:shipped`, `memo orders list number:A-1042 'supplier:"Shop One"' --json`

### `memo orders show`

one order with its customer, shop, amount, status and the mail it was read from

```sh
memo orders show <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | order:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo orders show order:3`

### `memo orders add`

record a placed order; yours is confirmed at once, an agent's waits as proposed for you in memo review

This command changes the local store or your files.

```sh
memo orders add <shop> [amount] [currency] [options]
```

| Argument | | What it is |
|---|---|---|
| `shop` | required | the shop or supplier, as its mail names it. |
| `amount` | optional | the order's amount, a decimal such as 2499.00. |
| `currency` | optional | ISO 4217, such as RUB; given with the amount. |

| Option | What it does |
|---|---|
| `--kind <kind>` | why it was ordered: personal, business, client, other. |
| `--person <uid>` | whom it is for, when not you: person:<id>. |
| `--organization <organization>` | whom it is for, when not you: organization:<id>. |
| `--title <title>` | the shop's order number. |
| `--occurred-time <time>` | the day it was ordered, such as 2026-11-01. |
| `--project <project>` | the project it belongs to: its key or project:<id>. |
| `--reason <text>` | why an agent proposes it, for the owner who decides. |
| `--evidence <ref...>` | what shows it, up to 8: msg:, note:, document: or another reference. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo orders add 'Shop One' 2499.00 RUB --kind personal --title A-1042`, `memo orders add 'Office Supply' --kind client --organization organization:3`

### `memo orders lines`

the lines of an order, each a quantity at a price; its total is their sum. you change any order's lines; an agent only those of an order it proposed that is still proposed

#### `memo orders lines add`

add a line at the end of an order that has a currency (orders add with an amount): quantity × price, and the total becomes the sum of the lines. With --product its name and price are copied, so a later price change leaves the line as it is, and --amount sets another price; without --product, --amount is needed. you change any order's lines; an agent only those of an order it proposed that is still proposed

This command changes the local store or your files.

```sh
memo orders lines add <order> <quantity> [description] [options]
```

| Argument | | What it is |
|---|---|---|
| `order` | required | order:<id>. |
| `quantity` | required | how many, a decimal such as 12 or 1.5. |
| `description` | optional | what the line is, in a few words; the product's name when left out. |

| Option | What it does |
|---|---|
| `--product <product>` | the product or service it is: its name and price are copied onto the line. |
| `--amount <decimal>` | the price of one, such as 10000.00; the product's when left out with --product. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo orders lines add order:3 12 --product product:4`, `memo orders lines add order:3 1 Rental, first week --product product:4 --amount 2000.00`, `memo orders lines add order:3 2 Helmet --amount 2500.00`

#### `memo orders lines remove`

take a line off an order; the others keep their positions, and the last line stays. you change any order's lines; an agent only those of an order it proposed that is still proposed

This command changes the local store or your files.

```sh
memo orders lines remove <order> <position> [options]
```

| Argument | | What it is |
|---|---|---|
| `order` | required | order:<id>. |
| `position` | required | the line's position, from 1, as orders show lists it. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo orders lines remove order:3 2`

## `memo pipelines`

sales pipelines: the stages a deal or a lead goes through, in order, and how many get through each

### `memo pipelines list`

every pipeline with its stages in order and how many open deals or leads stand in each

```sh
memo pipelines list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** pipeline — id, ref, name, kind, account, external_id, stages, created_at, and 3 more; every field: memo commands info pipelines list

**Example:** `memo pipelines list`, `memo pipelines list kind:lead --json`

### `memo pipelines show`

one pipeline's funnel: per stage the open deals or leads in it, how many reached it, and the share that went on to the next stage; then won, lost and the win rate

```sh
memo pipelines show <pipeline> [options]
```

| Argument | | What it is |
|---|---|---|
| `pipeline` | required | pipeline:<id>, or a name only one pipeline has. |

| Option | What it does |
|---|---|
| `--since-time <time>` | count only deals or leads made since this day, such as 2026-09-01. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** pipeline — id, ref, name, kind, account, external_id, stages, created_at, and 3 more; every field: memo commands info pipelines show

**Example:** `memo pipelines show pipeline:2`, `memo pipelines show Sales --since-time 2026-09-01`

### `memo pipelines add`

make a pipeline with its stages in order; a stage named won or lost (any letter case) ends a deal or lead as that

This command changes the local store or your files.

```sh
memo pipelines add <name> <stage> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the pipeline's name, such as Sales. |
| `stage` | required | its stages in order, such as Call Quote Contract won lost. |

| Option | What it does |
|---|---|
| `--kind <kind>` | what it holds: deal or lead; deal by default. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo pipelines add Sales Call Quote Contract won lost`, `memo pipelines add Inbound new called --kind lead`

## `memo deals`

deals you hope to win: the client, the expected amount, the stage and whether it was won or lost

### `memo deals list`

deals, newest first; status:open is what is still in play

```sh
memo deals list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |
| `--limit <n>` | most deals, up to 500. Default: `100`. |

**Returns:** deal — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 29 more; every field: memo commands info deals list

**Example:** `memo deals list status:open project:HRB`, `memo deals list stage:Quote --json`

### `memo deals show`

one deal with its pipeline, stage, status, amount, the people on it and what it was read from

```sh
memo deals show <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | deal:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** deal — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 29 more; every field: memo commands info deals show

**Example:** `memo deals show deal:5`

### `memo deals context`

one deal whole: its stages, client, people with their roles and standing, owner, project, invoices and payments as stored, its people's messages, mail and meetings in its lifetime (`proposed`: they share people, nothing links them), open tasks and `coverage`. A stage named Won is not a payment

```sh
memo deals context <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | deal:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |
| `--brief` | the compact form for a model's context: names, roles, totals and counts. |
| `--limit <n>` | most items in each section. Default: `20`. |

**Returns:** deal context — deal, stages, organization, participants, owner, project, money, window, and 3 more; every field: memo commands info deals context

**Example:** `memo deals context deal:5`, `memo deals context deal:5 --brief --json`

### `memo deals update`

set the project a deal belongs to; a CRM's copy takes it too, and the next sync keeps it. An empty value clears it

This command changes the local store or your files.

```sh
memo deals update <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | deal:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |
| `--project <project>` | the project: its key or project:<id>. |

**Returns:** deal — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 29 more; every field: memo commands info deals update

**Example:** `memo deals update deal:5 --project HRB`

### `memo deals add`

record a deal in a stage; it is written at once, whoever runs it

This command changes the local store or your files.

```sh
memo deals add <title> <stage> [amount] [currency] [options]
```

| Argument | | What it is |
|---|---|---|
| `title` | required | what you hope to sell, such as 'Site for the clinic'. |
| `stage` | required | the stage it is in; Sales/Quote or pipeline:3/Quote names the pipeline when two have that stage. |
| `amount` | optional | the expected amount, a decimal such as 500000.00. |
| `currency` | optional | ISO 4217, such as RUB; given with the amount. |

| Option | What it does |
|---|---|
| `--organization <organization>` | the client: organization:<id>. |
| `--person <uid>` | a person on the deal: person:<id>; repeat for another, up to 20. |
| `--role <role>` | what those people are on it: owner, contact, decision-maker, influencer; contact by default. |
| `--due <time>` | the day you expect it to close, such as 2026-12-01. |
| `--project <project>` | the project it belongs to: its key or project:<id>. |
| `--reason <text>` | why an agent records it, kept with it. |
| `--evidence <ref...>` | what shows it, up to 8: msg:, note:, document: or another reference. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** deal — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 29 more; every field: memo commands info deals add

**Example:** `memo deals add 'Site for the clinic' Call 500000.00 RUB --organization organization:3 --project HRB`, `memo deals add 'Support contract' Sales/Quote --person person:7 --role decision-maker --due 2026-12-01`

### `memo deals move`

move a deal to another stage of its pipeline; a won or lost stage closes it, an open one reopens it

This command changes the local store or your files.

```sh
memo deals move <ref> <stage> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | deal:<id>. |
| `stage` | required | a stage of the deal's pipeline by its name or stage:<id>; or a base stage's stage:<id>, which moves it to the one stage of its pipeline mapped there, and refuses several (with the candidates) or none. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** deal — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 29 more; every field: memo commands info deals move

**Example:** `memo deals move deal:5 Quote`, `memo deals move deal:5 stage:5`

### `memo deals close`

close a deal as won or lost; it moves to its pipeline's won or lost stage when there is one

This command changes the local store or your files.

```sh
memo deals close <ref> <outcome> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | deal:<id>. |
| `outcome` | required | won or lost. |

| Option | What it does |
|---|---|
| `--occurred-time <time>` | the day it closed, such as 2026-11-20; today when left out. |
| `--reason <text>` | why it was won or lost, kept with it. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** deal — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 29 more; every field: memo commands info deals close

**Example:** `memo deals close deal:5 won`, `memo deals close deal:6 lost --reason 'chose a cheaper studio'`

## `memo leads`

leads: first contacts in a lead pipeline, before they are deals

### `memo leads list`

leads, newest first; status:open is what is still in play

```sh
memo leads list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |
| `--limit <n>` | most leads, up to 500. Default: `100`. |

**Returns:** lead — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 29 more; every field: memo commands info leads list

**Example:** `memo leads list status:open`

### `memo leads show`

one lead with its pipeline, stage, status, amount, the people on it and what it was read from

```sh
memo leads show <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | lead:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** lead — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 29 more; every field: memo commands info leads show

**Example:** `memo leads show lead:3`

### `memo leads context`

one lead whole: its stages, client, people with their roles and standing, owner, project, invoices and payments as stored, its people's messages, mail and meetings in its lifetime (`proposed`: they share people, nothing links them), open tasks and `coverage`. A stage named Won is not a payment

```sh
memo leads context <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | lead:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |
| `--brief` | the compact form for a model's context: names, roles, totals and counts. |
| `--limit <n>` | most items in each section. Default: `20`. |

**Returns:** deal context — deal, stages, organization, participants, owner, project, money, window, and 3 more; every field: memo commands info leads context

**Example:** `memo leads context lead:3 --brief`

### `memo leads update`

set the project a lead belongs to; a CRM's copy takes it too, and the next sync keeps it. An empty value clears it

This command changes the local store or your files.

```sh
memo leads update <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | lead:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |
| `--project <project>` | the project: its key or project:<id>. |

**Returns:** lead — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 29 more; every field: memo commands info leads update

**Example:** `memo leads update lead:3 --project HRB`

### `memo leads add`

record a lead in a stage; it is written at once, whoever runs it

This command changes the local store or your files.

```sh
memo leads add <title> [stage] [amount] [currency] [options]
```

| Argument | | What it is |
|---|---|---|
| `title` | required | who or what came in, such as 'Call from the site'. |
| `stage` | optional | the stage it is in; the first stage of the only lead pipeline when left out. |
| `amount` | optional | the expected amount, a decimal such as 500000.00. |
| `currency` | optional | ISO 4217, such as RUB; given with the amount. |

| Option | What it does |
|---|---|
| `--organization <organization>` | the client: organization:<id>. |
| `--person <uid>` | a person on the lead: person:<id>; repeat for another, up to 20. |
| `--role <role>` | what those people are on it: owner, contact, decision-maker, influencer; contact by default. |
| `--due <time>` | the day you expect it to close, such as 2026-12-01. |
| `--project <project>` | the project it belongs to: its key or project:<id>. |
| `--reason <text>` | why an agent records it, kept with it. |
| `--evidence <ref...>` | what shows it, up to 8: msg:, note:, document: or another reference. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** lead — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 29 more; every field: memo commands info leads add

**Example:** `memo leads add 'Call from the site'`, `memo leads add 'Clinic in Kazan' contacted --person person:9`

### `memo leads move`

move a lead to another stage of its pipeline; a won or lost stage closes it, an open one reopens it

This command changes the local store or your files.

```sh
memo leads move <ref> <stage> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | lead:<id>. |
| `stage` | required | a stage of the lead's pipeline by its name or stage:<id>; or a base stage's stage:<id>, which moves it to the one stage of its pipeline mapped there, and refuses several (with the candidates) or none. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** lead — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 29 more; every field: memo commands info leads move

**Example:** `memo leads move lead:3 qualified`, `memo leads move lead:3 stage:5`

### `memo leads close`

close a lead as won or lost; it moves to its pipeline's won or lost stage when there is one

This command changes the local store or your files.

```sh
memo leads close <ref> <outcome> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | lead:<id>. |
| `outcome` | required | won or lost. |

| Option | What it does |
|---|---|
| `--occurred-time <time>` | the day it closed, such as 2026-11-20; today when left out. |
| `--reason <text>` | why it was won or lost, kept with it. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** lead — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 29 more; every field: memo commands info leads close

**Example:** `memo leads close lead:3 lost --reason 'no budget'`

## `memo stages`

the owner's base stages of deals and of leads, the columns of a board across every pipeline and CRM, and how each other pipeline's stage maps onto them

### `memo stages show`

the base set in order, with the open rows and mapped stages each column holds, and what is unsorted (unmapped or only suggested); the first use takes the owner's only own pipeline of the kind, or makes the default set in the owner's language; a read-only store shows that set without making it

```sh
memo stages show <kind> [options]
```

| Argument | | What it is |
|---|---|---|
| `kind` | required | deal or lead: which base set. One of: `deal`, `lead`. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** base stage set — kind, pipeline, stages, unsorted; every field: memo commands info stages show

**Example:** `memo stages show deal`, `memo stages show lead --json`

### `memo stages create`

add a stage to the base set: an open one goes before the first won or lost stage, a won or lost one last; move puts it elsewhere

This command changes the local store or your files.

```sh
memo stages create <kind> <name> [outcome] [options]
```

| Argument | | What it is |
|---|---|---|
| `kind` | required | deal or lead: which base set. One of: `deal`, `lead`. |
| `name` | required | the stage's name, once in its set. |
| `outcome` | optional | open, won or lost; open by default. One of: `open`, `won`, `lost`. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** base stage set — kind, pipeline, stages, unsorted; every field: memo commands info stages create

**Example:** `memo stages create deal Demo`, `memo stages create lead Spam lost`

### `memo stages rename`

rename a base stage; what maps to it stays mapped

This command changes the local store or your files.

```sh
memo stages rename <kind> <stage> <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `kind` | required | deal or lead: which base set. One of: `deal`, `lead`. |
| `stage` | required | the base stage, by its stage:<id> or its name. |
| `name` | required | its new name. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** base stage set — kind, pipeline, stages, unsorted; every field: memo commands info stages rename

**Example:** `memo stages rename deal Proposal 'Quote sent'`

### `memo stages move`

put a base stage at another place in its set; unconfirmed suggestions follow the new order

This command changes the local store or your files.

```sh
memo stages move <kind> <stage> <position> [options]
```

| Argument | | What it is |
|---|---|---|
| `kind` | required | deal or lead: which base set. One of: `deal`, `lead`. |
| `stage` | required | the base stage, by its stage:<id> or its name. |
| `position` | required | its new place, from 1. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** base stage set — kind, pipeline, stages, unsorted; every field: memo commands info stages move

**Example:** `memo stages move deal Negotiation 2`

### `memo stages remove`

take a stage out of the base set: refused for the last of its outcome and for one the owner's own rows stood in; what was mapped to it waits for a new confirm

This command changes the local store or your files.

```sh
memo stages remove <kind> <stage> [options]
```

| Argument | | What it is |
|---|---|---|
| `kind` | required | deal or lead: which base set. One of: `deal`, `lead`. |
| `stage` | required | the base stage, by its stage:<id> or its name. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** base stage set — kind, pipeline, stages, unsorted; every field: memo commands info stages remove

**Example:** `memo stages remove deal Negotiation`

### `memo stages list`

every stage outside the base sets in scope, a CRM's or an own pipeline's, with the base stage it maps to, and whether the owner confirmed that or it is the store's suggestion

```sh
memo stages list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** stage mapping — ref, name, position, outcome, external_id, kind, pipeline, pipeline_name, and 5 more; every field: memo commands info stages list

**Example:** `memo stages list confirmed:false`, `memo stages list kind:deal pipeline:pipeline:3 --json`

### `memo stages set`

map one stage of a CRM or own pipeline onto a base stage of its kind, confirmed, so a later sync keeps it; an agent's run records it as a suggestion the owner confirms

This command changes the local store or your files.

```sh
memo stages set <stage> <base-stage> [options]
```

| Argument | | What it is |
|---|---|---|
| `stage` | required | the stage, by its stage:<id> as stages list shows it. |
| `base-stage` | required | the base stage, by its stage:<id> or its name. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** stage mapping — ref, name, position, outcome, external_id, kind, pipeline, pipeline_name, and 5 more; every field: memo commands info stages set

**Example:** `memo stages set stage:41 Proposal`

### `memo stages confirm`

confirm every suggestion of one pipeline, or of all of them in scope, as it stands

This command changes the local store or your files.

```sh
memo stages confirm [options]
```

| Option | What it does |
|---|---|
| `--pipeline <pipeline>` | pipeline:<id>, or a name only one pipeline has. |
| `--all` | every pipeline in scope. |
| `--kind <kind>` | with --all: only deal or only lead stages. One of: `deal`, `lead`. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** stage mapping confirm — confirmed; every field: memo commands info stages confirm

**Example:** `memo stages confirm --pipeline pipeline:3`, `memo stages confirm --all`

### `memo stages suggest`

send every unconfirmed stage that has more than one base stage of its outcome to go to, with the base stages, to the AI model chosen with `memo models ai set`, and record its answers as suggestions the owner confirms with `memo stages confirm --all`. --dry-run sends nothing and prints the same task as JSON for an agent; --text-file records the agent's answer instead of asking the model

This command changes the local store or your files.

```sh
memo stages suggest [options]
```

| Option | What it does |
|---|---|
| `--kind <kind>` | only deal or only lead stages. One of: `deal`, `lead`. |
| `--dry-run` | print the task for an agent: the stages, the base stages to choose from, the answer's shape. |
| `--text-file <path>` | record an agent's answer, {"map": [{"stage": "stage:<id>", "base": "stage:<id>"}]}, from this file; - reads stdin. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** stage suggestion — by, suggested, left, skipped, task, answer, submit, base_stages, and 2 more; every field: memo commands info stages suggest

**Example:** `memo stages suggest`, `memo stages suggest --kind deal --dry-run --json`, `memo stages suggest --text-file answer.json`

## `memo products`

goods and services you sell or buy, with their prices; a line that names one copies its price, so a later price change leaves the line as it was

### `memo products list`

products and services, by name; archived:true lists those no longer sold

```sh
memo products list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |
| `--limit <n>` | most products, up to 500. Default: `100`. |

**Example:** `memo products list kind:service`, `memo products list archived:true --json`

### `memo products show`

one product or service with its price, unit, supplier and stock code

```sh
memo products show <product> [options]
```

| Argument | | What it is |
|---|---|---|
| `product` | required | product:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo products show product:4`

### `memo products add`

add a product or service you sell or buy; anyone adds one directly, as a price feeds no total

This command changes the local store or your files.

```sh
memo products add <name> [amount] [currency] [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | its name, as an invoice or order line prints it. |
| `amount` | optional | the price of one unit, a decimal such as 10000.00. |
| `currency` | optional | ISO 4217, such as RUB; given with the amount. |

| Option | What it does |
|---|---|
| `--kind <kind>` | product or service; product when left out. |
| `--unit <text>` | what one of it is counted in, such as hour or month. |
| `--sku <code>` | the stock code the seller gives it. |
| `--supplier <party>` | who supplies it, when not you: person:<uid> or organization:<id>. |
| `--description <text>` | what it is, in a sentence. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo products add 'Bike rental, month' 10000.00 RUB --kind service --unit month`, `memo products add 'Helmet' 2500.00 RUB --sku H-12 --supplier organization:3`

### `memo products update`

change a product's price, name, unit or description, or archive it; lines already written keep theirs

This command changes the local store or your files.

```sh
memo products update <product> [options]
```

| Argument | | What it is |
|---|---|---|
| `product` | required | product:<id>. |

| Option | What it does |
|---|---|
| `--amount <decimal>` | the new price of one unit, such as 12000.00; give --currency with it. |
| `--currency <code>` | an ISO 4217 code, such as RUB. |
| `--title <title>` | its new name. |
| `--unit <text>` | what one of it is counted in, such as hour or month. |
| `--description <text>` | what it is, in a sentence. |
| `--archived <on\|off>` | on: no longer sold, and lines and subscriptions keep pointing at it; off: sold again. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo products update product:4 --amount 12000.00 --currency RUB`, `memo products update product:4 --archived on`

## `memo contracts`

contracts you work under: their kind, dates, renewal, notice and what they are worth

### `memo contracts list`

contracts, newest first; expires:2026-12-31 lists those that end by then

```sh
memo contracts list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |
| `--limit <n>` | most contracts, up to 500. Default: `100`. |

**Example:** `memo contracts list status:active`, `memo contracts list expires:2026-12-31 --json`

### `memo contracts show`

one contract with its dates, renewal and the last day to give notice

```sh
memo contracts show <contract> [options]
```

| Argument | | What it is |
|---|---|---|
| `contract` | required | contract:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo contracts show contract:2`

### `memo contracts add`

record a contract; one with no amount is written as it is, by anyone; with an amount yours is confirmed at once and an agent's waits as proposed for you in memo review

This command changes the local store or your files.

```sh
memo contracts add <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | what it is called, such as 'Rental agreement'. |

| Option | What it does |
|---|---|
| `--kind <kind>` | what it is: sale, purchase, service, lease, employment, nda, license, other. |
| `--status <state>` | draft, active, ended, terminated; active when left out. |
| `--start-date <date>` | the first day it is in force, YYYY-MM-DD. |
| `--end-date <date>` | the last day it is in force, YYYY-MM-DD; left out, it runs until ended. |
| `--auto-renew <on\|off>` | it renews by itself at its end, or it does not. |
| `--notice-days <days>` | how many days before its end a party must say it will not go on. |
| `--amount <decimal>` | what it is worth, such as 120000.00, in --currency; with it, an agent's waits for you. |
| `--currency <code>` | an ISO 4217 code, such as RUB. |
| `--project <project>` | the project it belongs to: its key or project:<id>. |
| `--reason <text>` | why an agent proposes it, for the owner who decides. |
| `--evidence <ref...>` | what shows it, up to 8: msg:, note:, document: or another reference. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo contracts add 'Rental agreement' --kind service --start-date 2026-11-01 --end-date 2027-10-31 --auto-renew on --notice-days 30 --amount 120000.00 --currency RUB`, `memo contracts add 'NDA with the studio' --kind nda --project HRB`

### `memo contracts update`

change a contract's dates, status, terms or worth; you change any, an agent only one it proposed that is still proposed, and a confirmed contract's worth only you

This command changes the local store or your files.

```sh
memo contracts update <contract> [options]
```

| Argument | | What it is |
|---|---|---|
| `contract` | required | contract:<id>. |

| Option | What it does |
|---|---|
| `--kind <kind>` | what it is: sale, purchase, service, lease, employment, nda, license, other. |
| `--status <state>` | draft, active, ended, terminated; active when left out. |
| `--start-date <date>` | the first day it is in force, YYYY-MM-DD. |
| `--end-date <date>` | the last day it is in force, YYYY-MM-DD; left out, it runs until ended. |
| `--auto-renew <on\|off>` | it renews by itself at its end, or it does not. |
| `--notice-days <days>` | how many days before its end a party must say it will not go on. |
| `--amount <decimal>` | what it is worth, such as 120000.00, in --currency; with it, an agent's waits for you. |
| `--currency <code>` | an ISO 4217 code, such as RUB. |
| `--title <title>` | its new name. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo contracts update contract:2 --status terminated`, `memo contracts update contract:2 --end-date 2027-12-31`

## `memo subscriptions`

subscriptions you bill or pay: who supplies it, who pays, how often, and every price it had; a price is never changed, a new one is added

### `memo subscriptions list`

subscriptions, newest first; renews:2026-12-01 lists those that renew by then

```sh
memo subscriptions list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |
| `--limit <n>` | most subscriptions, up to 500. Default: `100`. |

**Example:** `memo subscriptions list status:active direction:payable`, `memo subscriptions list renews:2026-12-01 --json`

### `memo subscriptions show`

one subscription with its parties, dates, current price and every price it had

```sh
memo subscriptions show <subscription> [options]
```

| Argument | | What it is |
|---|---|---|
| `subscription` | required | subscription:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo subscriptions show subscription:5`

### `memo subscriptions add`

record a subscription and its first price; yours is confirmed at once; an agent's waits as proposed for you in memo review

This command changes the local store or your files.

```sh
memo subscriptions add <name> <amount> <currency> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | what it is, such as Hosting. |
| `amount` | required | its price for one period, a decimal such as 990.00. |
| `currency` | required | ISO 4217, such as RUB. |

| Option | What it does |
|---|---|
| `--status <state>` | trial, active, paused, cancelled, ended; trial needs --trial-end-date. |
| `--supplier <party>` | who supplies it: person:<uid> or organization:<id>; you, when you bill it. |
| `--customer <party>` | who receives it and pays for it: person:<uid> or organization:<id>; you, when you pay. |
| `--product <product>` | the product or service it is for: product:<id>. |
| `--contract <contract>` | the contract it runs under: contract:<id>. |
| `--period <count-unit>` | how often it is charged: a count and a unit, such as 1-month or 1-year. |
| `--start-date <date>` | the first day it runs, YYYY-MM-DD. |
| `--trial-end-date <date>` | the day its free trial ends, YYYY-MM-DD. |
| `--kind <kind>` | receivable (you bill it) or payable (you pay it). |
| `--project <project>` | the project it belongs to: its key or project:<id>. |
| `--reason <text>` | why an agent proposes it, for the owner who decides. |
| `--evidence <ref...>` | what shows it, up to 8: msg:, note:, document: or another reference. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo subscriptions add Hosting 990.00 RUB --kind payable --supplier organization:3 --period 1-month --start-date 2026-11-01`, `memo subscriptions add 'Bike rental' 10000.00 RUB --kind receivable --customer organization:3 --period 1-month --trial-end-date 2026-11-14 --status trial`

### `memo subscriptions update`

change a subscription's status, schedule, dates or parties; pause it with --status paused. You change any, an agent only one it proposed that is still proposed. A new price is subscriptions prices add

This command changes the local store or your files.

```sh
memo subscriptions update <subscription> [options]
```

| Argument | | What it is |
|---|---|---|
| `subscription` | required | subscription:<id>. |

| Option | What it does |
|---|---|
| `--status <state>` | trial, active, paused, cancelled, ended; trial needs --trial-end-date. |
| `--supplier <party>` | who supplies it: person:<uid> or organization:<id>; you, when you bill it. |
| `--customer <party>` | who receives it and pays for it: person:<uid> or organization:<id>; you, when you pay. |
| `--product <product>` | the product or service it is for: product:<id>. |
| `--contract <contract>` | the contract it runs under: contract:<id>. |
| `--period <count-unit>` | how often it is charged: a count and a unit, such as 1-month or 1-year. |
| `--start-date <date>` | the first day it runs, YYYY-MM-DD. |
| `--trial-end-date <date>` | the day its free trial ends, YYYY-MM-DD. |
| `--title <title>` | its new name. |
| `--end-date <date>` | the last day it runs, YYYY-MM-DD. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo subscriptions update subscription:5 --status paused`, `memo subscriptions update subscription:5 --period 1-year`

### `memo subscriptions cancel`

mark a subscription cancelled on a day; it stays, with its prices

This command changes the local store or your files.

```sh
memo subscriptions cancel <subscription> [options]
```

| Argument | | What it is |
|---|---|---|
| `subscription` | required | subscription:<id>. |

| Option | What it does |
|---|---|
| `--occurred-time <time>` | the day it was cancelled, such as 2026-11-01; today when left out. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo subscriptions cancel subscription:5 --occurred-time 2026-11-30`

### `memo subscriptions prices`

the prices a subscription had, each from a day on; one is never changed, a new one is added

#### `memo subscriptions prices add`

add a price from a day on; the earlier ones stay as they were. yours is confirmed at once; an agent's waits as proposed for you in memo review, and the subscription stays as it is

This command changes the local store or your files.

```sh
memo subscriptions prices add <subscription> <amount> <currency> [options]
```

| Argument | | What it is |
|---|---|---|
| `subscription` | required | subscription:<id>. |
| `amount` | required | the price for one period, a decimal such as 1190.00. |
| `currency` | required | ISO 4217, such as RUB. |

| Option | What it does |
|---|---|
| `--start-date <date>` | the first day the price holds, YYYY-MM-DD; the subscription's start when left out. |
| `--reason <text>` | why an agent proposes it, for the owner who decides. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo subscriptions prices add subscription:5 1190.00 RUB --start-date 2027-01-01`

## `memo wallets`

bank accounts, cards and cash you keep money in, one currency each; a balance is the opening balance plus confirmed, booked transactions, computed each time

### `memo wallets list`

wallets with their balances today; kind:card lists the cards

```sh
memo wallets list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |
| `--limit <n>` | most wallets, up to 500. Default: `100`. |

**Example:** `memo wallets list`, `memo wallets list kind:card --json`

### `memo wallets show`

one wallet with its balance, and beside it what is pending or proposed and not counted yet; for an imported wallet whose opening balance you have not set, source_says gives the one its source sent

```sh
memo wallets show <wallet> [options]
```

| Argument | | What it is |
|---|---|---|
| `wallet` | required | wallet:<id>. |

| Option | What it does |
|---|---|
| `--until-time <time>` | the balance up to and including this day, such as 2026-10-31; today when left out. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo wallets show wallet:2`, `memo wallets show wallet:2 --until-time 2026-10-31`

### `memo wallets add`

add a wallet in one currency; anyone adds one directly, and only you set its opening balance, with wallets update

This command changes the local store or your files.

```sh
memo wallets add <name> <currency> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | what you call it, such as 'Main card'. |
| `currency` | required | ISO 4217, such as RUB; a bank account in two currencies is two wallets. |

| Option | What it does |
|---|---|
| `--kind <kind>` | bank, card, cash, wallet, other; bank when left out. |
| `--institution <text>` | the bank or other company that holds it, by name. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo wallets add 'Main card' RUB --kind card --institution 'Bank One'`

### `memo wallets update`

rename a wallet, or set the opening balance its balance counts from; the opening balance is yours alone, an agent is refused

This command changes the local store or your files.

```sh
memo wallets update <wallet> [options]
```

| Argument | | What it is |
|---|---|---|
| `wallet` | required | wallet:<id>. |

| Option | What it does |
|---|---|
| `--title <title>` | its new name. |
| `--institution <text>` | the bank or other company that holds it, by name. |
| `--opening-balance <decimal>` | what it held on --opening-date, such as 1500.50; only you set it. |
| `--opening-date <date>` | the day of the opening balance, YYYY-MM-DD. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo wallets update wallet:2 --opening-balance 15000.00 --opening-date 2026-01-01`

## `memo transactions`

money a wallet's statement shows moving in or out, the payment it settles, and the categories it is split into

### `memo transactions list`

transactions, newest first; uncategorized:true lists those not fully split into categories

```sh
memo transactions list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |
| `--limit <n>` | most transactions, up to 500. Default: `100`. |

**Example:** `memo transactions list 'wallet:"wallet:2"' status:pending`, `memo transactions list uncategorized:true --json`

### `memo transactions show`

one transaction with its wallet, payment, splits and what is not categorized

```sh
memo transactions show <transaction> [options]
```

| Argument | | What it is |
|---|---|---|
| `transaction` | required | transaction:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo transactions show transaction:12`

### `memo transactions add`

record what a wallet's statement shows moved, in the wallet's currency; yours is confirmed at once; an agent's waits as proposed for you in memo review

This command changes the local store or your files.

```sh
memo transactions add <wallet> <amount> [options]
```

| Argument | | What it is |
|---|---|---|
| `wallet` | required | wallet:<id>. |
| `amount` | required | a decimal above 0, such as 500.00. |

| Option | What it does |
|---|---|
| `--kind <kind>` | in (money came in) or out (money went out). |
| `--occurred-time <time>` | the day the statement shows, such as 2026-11-01; today when left out. |
| `--description <text>` | what the statement says, as it says it. |
| `--status <state>` | pending or booked; only a booked one counts in a balance; booked when left out. |
| `--payment <payment>` | the payment it settles, same amount, currency and direction: payment:<id>. |
| `--project <project>` | the project it belongs to: its key or project:<id>. |
| `--reason <text>` | why an agent proposes it, for the owner who decides. |
| `--evidence <ref...>` | what shows it, up to 8: msg:, note:, document: or another reference. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo transactions add wallet:2 500.00 --kind out --occurred-time 2026-11-14 --description 'Coffee shop'`, `memo transactions add wallet:2 10000.00 --kind in --payment payment:9`

### `memo transactions update`

book a pending transaction, link it to the payment it settles, or fix its text; you change any, an agent only one it proposed that is still proposed

This command changes the local store or your files.

```sh
memo transactions update <transaction> [options]
```

| Argument | | What it is |
|---|---|---|
| `transaction` | required | transaction:<id>. |

| Option | What it does |
|---|---|
| `--status <state>` | pending or booked; only a booked one counts in a balance. |
| `--payment <payment>` | the payment it settles, same amount, currency and direction: payment:<id>. |
| `--description <text>` | what the statement says, as it says it. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo transactions update transaction:12 --status booked`, `memo transactions update transaction:12 --payment payment:9`

### `memo transactions splits`

the categories a transaction's amount is split into; together never more than the amount, the rest is uncategorized

#### `memo transactions splits add`

put part of a transaction's amount under a category; you split any transaction; an agent only one it proposed that is still proposed

This command changes the local store or your files.

```sh
memo transactions splits add <transaction> <amount> <category> [options]
```

| Argument | | What it is |
|---|---|---|
| `transaction` | required | transaction:<id>. |
| `amount` | required | a decimal above 0, such as 120.00. |
| `category` | required | the category, in a word or a few, such as Rent. |

| Option | What it does |
|---|---|
| `--project <project>` | the project this part belongs to: its key or project:<id>. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo transactions splits add transaction:12 300.00 Rent --project HRB`

#### `memo transactions splits remove`

take a split off a transaction; its amount is uncategorized again. you split any transaction; an agent only one it proposed that is still proposed

This command changes the local store or your files.

```sh
memo transactions splits remove <transaction> <position> [options]
```

| Argument | | What it is |
|---|---|---|
| `transaction` | required | transaction:<id>. |
| `position` | required | the split's position, from 1, as transactions show lists it. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo transactions splits remove transaction:12 1`

## `memo records`

what a source said, kept per account; what it says about money waits for your review

### `memo records import`

bring a source's records into the store, once: the same file twice changes nothing, a lower revision is refused, and anything that feeds money totals becomes a proposal for you, never confirmed money. Each refusal is also printed on stderr as it happens, one line each, past the receipt's 1000

This command changes the local store or your files.

```sh
memo records import <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | a records envelope as JSON, JSONL (a header line, then a record per line, read as it streams), a CSV sheet of one --type, or a vCard address book (.vcf, into phone:<device>); - for stdin. |

| Option | What it does |
|---|---|
| `--dry-run` | check and plan the import; write nothing. a dry run holds the store's write lock and grows the write-ahead log for its length. |
| `--type <type>` | the one type a CSV sheet holds: invoice, payment, person, organization, project, order, product, contract, subscription, wallet, transaction, deal, lead, document, pipeline. |
| `--account <account>` | the source the envelope is for: <provider>:<account> (sheet:rentals) or its source.account alone; phone:<device> for a vCard file. |
| `--region <country>` | a vCard file's country for phone numbers without +, such as ru or gb; without it they are kept, not matched. |
| `--json` | print JSON; --json=created,errors keeps only those fields. |

**Example:** `memo records import payments.jsonl --account rentals --dry-run`, `memo records import envelope.json --account rentals --json`, `memo records import contacts.vcf --account phone:pixel --region gb`

### `memo records check`

what records import would do with the file, as its receipt, writing nothing; a dry run holds the store's write lock and grows the write-ahead log for its length

This command changes the local store or your files.

```sh
memo records check <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | a records envelope as JSON, JSONL (a header line, then a record per line, read as it streams), a CSV sheet of one --type, or a vCard address book (.vcf, into phone:<device>); - for stdin. |

| Option | What it does |
|---|---|
| `--type <type>` | the one type a CSV sheet holds: invoice, payment, person, organization, project, order, product, contract, subscription, wallet, transaction, deal, lead, document, pipeline. |
| `--account <account>` | the source the envelope is for: <provider>:<account> (sheet:rentals) or its source.account alone; phone:<device> for a vCard file. |
| `--region <country>` | a vCard file's country for phone numbers without +, such as ru or gb; without it they are kept, not matched. |
| `--json` | print JSON; --json=created,errors keeps only those fields. |

**Example:** `memo records check - --account rentals`, `memo records check invoices.csv --type invoice --account sheet:rentals`

### `memo records templates`

files to fill for records import: a CSV header row or a JSON envelope, one type each

#### `memo records templates list`

the types a sheet can hold, and their columns: whether each is required, its shape and its values

```sh
memo records templates list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=types keeps only those fields. |

**Example:** `memo records templates list --json`, `memo records templates list type:invoice`

#### `memo records templates show`

the file to fill for one type: the CSV header row (with a byte-order mark, so Excel reads it as UTF-8) or a JSON envelope of one example record

```sh
memo records templates show <type> [options]
```

| Argument | | What it is |
|---|---|---|
| `type` | required | one of invoice, payment, person, organization, project, order, product, contract, subscription, wallet, transaction, deal, lead, document, pipeline. |

| Option | What it does |
|---|---|
| `--format <format>` | csv or json. Default: `csv`. |
| `--locale <code>` | the language of the Excel that opens it: en takes , and ru or es take ;. Default: `en`. |
| `--account <account>` | the source a JSON template names: <provider>:<account>, such as sheet:rentals. |
| `--json` | print JSON; --json=text keeps only those fields. |

**Example:** `memo records templates show invoice --locale ru`, `memo records templates show invoice --format json --account sheet:rentals`

### `memo records list`

a source's records, newest first; waiting:true lists those that wait for a record they name, unmatched:true the people, organizations and projects whose identifiers fit more than one of yours, entity: those mapped to one of your entries

```sh
memo records list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--account <account>` | the source, <provider>:<account> as the envelope's source names it, such as sheet:rentals. |
| `--limit <n>` | most records, up to 500. Default: `100`. |
| `--json` | print JSON; --json=type,external_id,entity keeps only those fields. |

**Example:** `memo records list waiting:true --account sheet:rentals`, `memo records list type:organization --account sheet:rentals --json`, `memo records list 'entity:"organization:3"' deleted:false --account sheet:rentals`

### `memo records link`

say which of your entries a source's record is (organization:client is organization:3); never done by name. Records that waited for it become proposals in memo review. Only you link; an agent is refused

This command changes the local store or your files.

```sh
memo records link <record> <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `record` | required | <type>:<external_id> as the source names it, such as organization:client or custom:quote:Q-7. |
| `ref` | required | your entry of the same type: person:<id>, organization:<id> or project:<id>. |

| Option | What it does |
|---|---|
| `--account <account>` | the source, <provider>:<account> as the envelope's source names it, such as sheet:rentals. |
| `--json` | print JSON; --json=type,external_id,entity keeps only those fields. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |

**Example:** `memo records link organization:client organization:3 --account sheet:rentals`

### `memo records show`

one record as its source said it: its fields, the records it names, the records that name it (incoming, the first 100) and the entry made from it

```sh
memo records show <record> [options]
```

| Argument | | What it is |
|---|---|---|
| `record` | required | <type>:<external_id> as the source names it, such as organization:client or custom:quote:Q-7. |

| Option | What it does |
|---|---|
| `--account <account>` | the source, <provider>:<account> as the envelope's source names it, such as sheet:rentals. |
| `--json` | print JSON; --json=fields,relations,incoming,entity keeps only those fields. |

**Example:** `memo records show custom:quote:Q-7 --account example-erp:demo`, `memo records show organization:client --account sheet:rentals --json`

### `memo records delete`

say a source no longer has a record, as an import's delete does: the record is kept as deleted, and the entry made from it stays, flagged for you to reject or keep

This command changes the local store or your files.

```sh
memo records delete <record> [options]
```

| Argument | | What it is |
|---|---|---|
| `record` | required | <type>:<external_id> as the source names it, such as organization:client or custom:quote:Q-7. |

| Option | What it does |
|---|---|
| `--account <account>` | the source, <provider>:<account> as the envelope's source names it, such as sheet:rentals. |
| `--json` | print JSON; --json=deleted,flagged,errors keeps only those fields. |

**Example:** `memo records delete payment:sheet-12 --account sheet:rentals`

### `memo records match`

link every waiting person, organization and project of a source to the one entry its e-mail, phone or other identifier names, or make one, as an import does; never by name. Two or more fits wait for records link

This command changes the local store or your files.

```sh
memo records match [options]
```

| Option | What it does |
|---|---|
| `--account <account>` | the source, <provider>:<account> as the envelope's source names it, such as sheet:rentals. |
| `--json` | print JSON; --json=linked,created,unmatched keeps only those fields. |

**Example:** `memo records match --account sheet:rentals`

## `memo import`

bring a folder of text, Markdown, PDF and Word files, .vtt or .srt transcripts and, with --transcribe, recordings, one such file, or a records file (JSON or JSONL) into the store, under the account you name. Each file is a document keyed by its path in the folder: the same folder twice changes nothing, an edited file updates its document, and a file gone from the folder is kept. Links are not followed and nothing leaves this computer; the text is kept as data, never run

This command changes the local store or your files.

```sh
memo import <path> [options]
```

| Argument | | What it is |
|---|---|---|
| `path` | required | a folder, a .txt, .md, .pdf, .docx, .vtt, .srt or audio file, or a records file (.json, .jsonl; - for stdin). |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--account <account>` | the source the files belong to: import:<name> (import:handbook), or phone:<exchange> for call transcripts; never chosen for you. |
| `--transcribe` | hear recordings (.wav, .mp3, .m4a, .ogg, .opus, .flac) with the local speech model; a recording heard before and unchanged is not heard again. Without it recordings are skipped. |
| `--dry-run` | read every file and plan the import; write nothing. Holds the store's write lock meanwhile. |
| `--json` | print JSON; --json=created,skipped keeps only those fields. |

**Example:** `memo import ~/Documents/handbook --account import:handbook --dry-run`, `memo import ./recordings --account phone:office-pbx --transcribe --json`, `memo import crm-notes.jsonl --account import:crm-notes`

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
| `file` | required | the findings JSON itself (starts with {), a JSON file, or - for stdin; at most 65536 UTF-8 bytes. |

| Option | What it does |
|---|---|
| `--account <account>` | the meeting account it acts as: provider:account, such as zoom:me@example.com. |
| `--json` | print JSON; --json=id,status keeps only those fields. |

**Returns:** meeting findings — id, account, input, fingerprint, status, author, decided_by, decided_at, and 2 more; every field: memo commands info meetings actions add

**Example:** `memo meetings actions add findings.json --account zoom:me@example.com`

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
| `--json` | print JSON; --json=id,status keeps only those fields. |

**Returns:** meeting findings — id, account, input, fingerprint, status, author, decided_by, decided_at, and 2 more; every field: memo commands info meetings actions show

**Example:** `memo meetings actions show 5 --source zoom:me@example.com`

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
| `--json` | print JSON; --json=id,status keeps only those fields. |
| `--limit <n>` | batches per page, at most 50. Default: `20`. |
| `--page <n>` | which page, from 1. Default: `1`. |

**Returns:** meeting findings — id, account, input, fingerprint, status, author, decided_by, decided_at, and 2 more; every field: memo commands info meetings actions list

**Example:** `memo meetings actions list status:proposed --source zoom:me@example.com`

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
| `--json` | print JSON; --json=id,status keeps only those fields. |
| `--fingerprint <hash>` | the exact fingerprint shown in the preview. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |

**Returns:** meeting findings — id, account, input, fingerprint, status, author, decided_by, decided_at, and 2 more; every field: memo commands info meetings actions confirm

**Example:** `memo meetings actions confirm 5 decision --fingerprint aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa --account zoom:me@example.com`

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
| `--json` | print JSON; --json=id,status keeps only those fields. |
| `--fingerprint <hash>` | the exact fingerprint shown in the preview. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |

**Returns:** meeting findings — id, account, input, fingerprint, status, author, decided_by, decided_at, and 2 more; every field: memo commands info meetings actions reject

**Example:** `memo meetings actions reject 5 --fingerprint aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa --account zoom:me@example.com`

### `memo meetings list`

meetings, calls and calendar events of every account as one row per real meeting, latest start first

```sh
memo meetings list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | rows per page, 1–1000; a month for a calendar fits in 1000. Default: `50`. |
| `--page <n>` | which page, from 1. Default: `1`. |
| `--order <recent\|start>` | recent: latest start first; start: oldest first, for a calendar window. Default: `recent`. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Example:** `memo meetings list kind:call has_transcript:true`, `memo meetings list 'started_at:[2026-11-01T00:00:00+01:00 TO 2026-12-01T00:00:00+01:00}' --order start --json`

### `memo meetings show`

one meeting row: its people, transcript lines with times, summaries, findings, calendar text and documents

```sh
memo meetings show <meeting> [options]
```

| Argument | | What it is |
|---|---|---|
| `meeting` | required | event:<id> or meeting:<account>/<id>, from meetings list. |

| Option | What it does |
|---|---|
| `--cursor <cursor>` | the transcript line to start at: where the last read ended. Default: `0`. |
| `--limit <n>` | transcript lines at most, 1–2000. Default: `200`. |
| `--json` | print JSON; --json=ref,transcript keeps only those fields. |

**Example:** `memo meetings show event:42 --limit 500 --json`, `memo meetings show meeting:3/7`

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
| `--json` | print the standard JSON answer. |

**Returns:** meeting passage — schema_version, kind, source, target_ref, target_fingerprint, fingerprint, revision, limits, and 3 more; every field: memo commands info meetings passage

**Example:** `memo meetings passage meeting:1/1/1/0 --source zoom:me@example.com --before-n 1 --after-n 1 --json`

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
| `--context-since-time <time>` | communications window start, an ISO date or time or 7d ago (default fourteen days before end). |
| `--context-before-time <time>` | exclusive communications end, an ISO date or time (default preparation start). |
| `--project <project>` | include unconfirmed word evidence for one existing project name, key or alias. |
| `--since-time <time>` | window start, an ISO date or time, local without a zone (default now). |
| `--before-time <time>` | exclusive window end, an ISO date or time; a date alone covers that day (default seven days after start). |
| `--history-since-time <time>` | history start, an ISO date or time or 30d ago (default thirty days before start). |
| `--meetings <n>` | prior occurrences and separate related-meeting limit, 1–20 (default 5). |
| `--cues <n>` | cues per occurrence, 1–100 (default 10). |
| `--context-limit <n>` | entries per context category, 1–100 (default 20). |
| `--max-read-bytes <bytes>` | stored/normalized bytes per read, at most 4194304 (default 262144). |
| `--bytes <bytes>` | preparation item JSON bytes, 4096–4194304 (default 65536). |
| `--source <accounts>` | the meeting account: provider:account (zoom:me@example.com), or a provider that has one. |
| `--json` | print the standard JSON answer. |

**Returns:** meeting preparation — schema_version, kind, account_id, upcoming, series, history_window, meetings, related, and 6 more; every field: memo commands info meetings prepare

**Example:** `memo meetings prepare example-series --source zoom:me@example.com --json`, `memo meetings prepare example-series --source zoom:me@example.com --context-source tg.personal --context-query Harbour --json`

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
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--reason <text>` | why it should be done. |
| `--account <account>` | the account that would act: provider:account, such as telegram:1. |
| `--target <ref>` | what it acts on: msg:, chat:, contact:, person:, task:, …. |
| `--payload <json>` | what to do, as JSON, such as the reply's text. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

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
| `--limit <n>` | most actions on a page, up to 500. Default: `100`. |
| `--page <n>` | which page, from 1. Default: `1`. |
| `--brief` | without each findings batch's cited sources. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo actions list status:proposed`

### `memo actions show`

one proposed action; a findings batch with its fingerprint and sources

```sh
memo actions show <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the action's id, as actions list gives it. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo actions show 5`

### `memo actions confirm`

confirm it: it becomes a task in the account that would act, nothing is sent; for a findings batch, create the named findings and leave the others waiting, or create every waiting one when none is named

This command changes the local store or your files.

```sh
memo actions confirm <id> [findings] [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the action's id, as actions list gives it. |
| `findings` | optional | a findings batch: the finding IDs to create; the others keep waiting. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--fingerprint <hash>` | a findings batch: the fingerprint actions show gives. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo actions confirm 5`

### `memo actions edit`

change one finding still waiting in a findings batch: its text and the fields its kind allows (a fact's statement, type and subject; a task's title, type, reason, commitment, dueAt and assignee; a mail finding's reason and its kind's fields). Its evidence never changes, nor a meeting finding's project. Answers the batch with its new fingerprint

This command changes the local store or your files.

```sh
memo actions edit <id> <finding> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the findings batch's id, as actions list gives it. |
| `finding` | required | the finding's id in the batch. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--fingerprint <hash>` | the fingerprint actions show gives. |
| `--set <field=value...>` | a field and its new value: JSON for a list, null empties it. Default: ``. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo actions edit 5 f2 --fingerprint 3f9a --set title="Send the signed contract" dueAt=null`

### `memo actions reject`

reject it; nothing is done. For a findings batch, every finding still waiting

This command changes the local store or your files.

```sh
memo actions reject <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the action's id, as actions list gives it. |

| Option | What it does |
|---|---|
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--fingerprint <hash>` | a findings batch: the fingerprint actions show gives. |
| `--reason <text>` | why, in a few words; required when an agent decides for you. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo actions reject 5`

## `memo review`

every proposal waiting for your decision, across projects: links, key documents, facts, invoices, payments and more

### `memo review list`

what waits for the owner's decision, newest first, with titles, who proposed it, why and the evidence

```sh
memo review list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--limit <n>` | proposals per page, at most 50. Default: `20`. |
| `--page <n>` | which page, from 1. Default: `1`. |
| `--compact` | one line per proposal. |

**Returns:** memo proposal — id, kind, status, title, project, project_title, source, owner_only, and 11 more; every field: memo commands info review list

**Example:** `memo review list project:HRB`, `memo review list kind:relationship,fact by:agent`, `memo review list via:chat:max/1/-100`

### `memo review show`

one proposal with its titles, signals and the text around each piece of evidence; a memory_source_review also shows each source as it was cited and as it is now, and the command for each decision

```sh
memo review show <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the proposal's id, as review lists it: 17070, fact:512, memory:88, link:17, payment:4, close:Q-15. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--brief` | only references and their titles, without excerpts or nearby text. |
| `--before-n <n>` | messages or document paragraphs before the evidence, at most 5. Default: `2`. |
| `--after-n <n>` | messages or document paragraphs after the evidence, at most 5. Default: `2`. |
| `--compact` | one line, as review prints it. |

**Example:** `memo review show 17079`, `memo review show 17080 --brief --json`

### `memo review confirm`

confirm proposals by id or range (17070-17079,fact:500-502,17080/f1); each is decided on its own, so a refusal leaves the others decided. An agent decides only with --reason, never its own or a scan's

This command changes the local store or your files.

```sh
memo review confirm <ids> [options]
```

| Argument | | What it is |
|---|---|---|
| `ids` | required | ids or ranges as review lists them; 17080/f1 accepts that finding and rejects the batch's others. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--reason <text>` | why, in a few words; required when an agent decides. |
| `--compact` | one line per decision. |

**Example:** `memo review confirm 17078-17081`, `memo review confirm 17080/f1,17080/f3`, `memo review confirm close:Q-15`

### `memo review reject`

turn proposals down by id or range, with why; each is decided on its own

This command changes the local store or your files.

```sh
memo review reject <ids> [options]
```

| Argument | | What it is |
|---|---|---|
| `ids` | required | ids or ranges as review lists them; a batch is turned down whole. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--as-owner` | act as you although an agent's terminal runs memo (AI_AGENT or CLAUDECODE set); asks y/N at the terminal. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--reason <text>` | why it is turned down, in a few words. |
| `--compact` | one line per decision. |

**Example:** `memo review reject 17081 --reason "not this project"`, `memo review reject close:Q-15 --reason 'still open'`

### `memo review agenda`

the morning digest, from the store alone with no model call: everything new in what you tagged watch (chats, mail threads, people, projects, a meeting's series), replies you owe to people in messengers and personal mail (not bots or service chats), new personal mail, meetings that ended, calendar events added, moved or cancelled and those starting within a day, Drive documents edited, CRM deals and leads the CRM changed (with a stage they moved to), tasks, projects that moved, memories and facts whose sources changed (source reviews raised since), proposals waiting. Tasks are the open ones created since the last morning-digest run (a day back when none ran) and those overdue, due today or due tomorrow, each with who asked and who does it. Replies owed reach back 7 days; owed mail lists only senders you know (linked to a person with other identities, or written to before), and mail from new senders is one count with the command that lists it. Each item has its reference, who, when, one line of text and why it is there; a section cut by --limit or --max-output-bytes says how many it left out and the command that reads them. `scope` says what was read (the window, sources, counts), `tasks` counts each task group and, as `undated`, every open task with no due date, and `health` names each account whose sync failed, that nothing syncs, or that is quiet for longer than usual, so an unsynced account does not read as a quiet day; an account stored or synced within a day is never named

```sh
memo review agenda [options]
```

| Option | What it does |
|---|---|
| `--since-time <time>` | how far back: hours or days (12h, 7d) or a start date (2026-11-01). Default: `1d`. |
| `--before-time <time>` | build it as of this past ISO time or date, for a past day's digest: --since-time counts back from it, and what came later is left out; a chat or thread answered since reads as answered. |
| `--source <accounts>` | only these, comma-separated or repeated: telegram, max, whatsapp, mail, meetings, tasks, drive, calendar, crm; watched items, projects and proposals stay. A digest's run reads the digest's own sources without it. |
| `--limit <n>` | items per section before the size budget. Default: `25`. |
| `--max-output-bytes <bytes>` | the text answer's size budget in bytes; 40000 with --compact, else 80000. |
| `--compact` | one line per item, shorter excerpts, the smaller budget: for an agent. |
| `--json` | print JSON. |

**Example:** `memo review agenda --compact`, `memo review agenda --since-time 3d --json`

### `memo review status`

the owner's daily look, with no model call: per mail account the threads with new mail, what you owe and wait for, and how far each agent's processing mark has read; then what was proposed and what waits

```sh
memo review status [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |
| `--since-time <time>` | how far back: hours or days (12h, 7d) or a start date (2026-11-01). Default: `1d`. |

**Returns:** review status — since, at, mail, proposed, waiting, quiet; every field: memo commands info review status

**Example:** `memo review status`, `memo review status --since-time 7d --json`

## `memo agents`

what agents did through the MCP servers that share the store

### `memo agents list`

one row per tool call, newest first: agent, tool, tier, outcome and times, never its arguments

```sh
memo agents list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | most rows on a page, up to 500. Default: `100`. |
| `--page <n>` | which page, from 1. Default: `1`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo agents list agent:claude-code --limit 20`

## `memo mcp`

serve memo commands over MCP on stdio or authenticated HTTP, limited by saved permissions — `claude mcp add memo -- memo mcp serve`

### `memo mcp serve`

serve memo commands over MCP on stdio or authenticated HTTP, limited by saved permissions

This command changes the local store or your files.

```sh
memo mcp serve [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | tighten one saved permission for this server; repeat for more keys. |
| `--http` | serve on 127.0.0.1 behind an HTTPS tunnel with an owner access-code login. |
| `--port <port>` | local HTTP port (default 8767); requires --http. |
| `--public-url <url>` | tunnel's HTTPS address without /mcp, or a path of it such as https://<name>.ts.net/memo; requires --http. |

**Example:** `memo mcp serve`, `memo mcp serve --http --public-url https://laptop.example.ts.net`

### `memo mcp revoke`

forget every login `memo mcp serve --http` gave a browser app; each app must log in again

This command changes the local store or your files.

```sh
memo mcp revoke [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo mcp revoke --json`

### `memo mcp server`

start, stop and check `mcp serve --http` in the background; status shows the login code for a browser app

#### `memo mcp server start`

start `mcp serve --http` apart from this shell and answer once it listens, with its login code

This command changes the local store or your files.

```sh
memo mcp server start [options]
```

| Option | What it does |
|---|---|
| `--port <port>` | the local port (default 8767). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |
| `--permission <key=level>` | make a permission stricter for this server only; repeat for more keys. |
| `--json` | print JSON. |

**Example:** `memo mcp server start --public-url https://laptop.example.ts.net`

#### `memo mcp server stop`

stop `mcp serve --http` — only one that `mcp server start` started

This command changes the local store or your files.

```sh
memo mcp server stop [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo mcp server stop`

#### `memo mcp server status`

whether `mcp serve --http` runs, on which port and address, the login code for a new browser app, and the apps logged in

```sh
memo mcp server status [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo mcp server status --json`

## `memo models`

models that run on this machine

### `memo models list`

speech and embedding models, their download status and the default of each kind

```sh
memo models list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Returns:** model — id, kind, title, languages, size_bytes, downloaded, default, path, and 6 more; every field: memo commands info models list

**Next usually:** `memo models download <model>`, `memo models set <model>`

**Example:** `memo models list kind:text --json`

### `memo models download`

download and verify one speech or embedding model

This command changes the local store or your files.

```sh
memo models download <model> [options]
```

| Argument | | What it is |
|---|---|---|
| `model` | required | a model id from models list. |

| Option | What it does |
|---|---|
| `--offline` | refuse a download that needs the network. |
| `--accept-terms` | no longer needed; kept so older scripts still run. |
| `--json` | print JSON. |

**Returns:** model — id, kind, title, languages, size_bytes, downloaded, default, path, and 6 more; every field: memo commands info models download

**Next usually:** `memo models set <model>`

**Example:** `memo models download embeddinggemma`, `memo models download e5-small`

### `memo models set`

make a downloaded text model the one every embed and every search by meaning uses, in every WireCat CLI. Each model keeps its own vectors: the next syncs embed what the new one lacks, and switching back is instant

This command changes the local store or your files.

```sh
memo models set <model> [options]
```

| Argument | | What it is |
|---|---|---|
| `model` | required | a downloaded text model id from models list. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Returns:** model chosen — id, kind, title, languages, size_bytes, downloaded, default, path, and 9 more; every field: memo commands info models set

**Next usually:** `memo models download <model>`

**Example:** `memo models set e5-large`

### `memo models add`

add an ONNX embedding model from Hugging Face, pinned and checked by sha256

This command changes the local store or your files.

```sh
memo models add <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the id to give it: a-z, 0-9, . _ -. |

| Option | What it does |
|---|---|
| `--payload <json>` | where the model is and how to run it, as JSON (below). |
| `--offline` | refuse a call that needs the network. |
| `--json` | print JSON. |

**Returns:** model — id, kind, title, languages, size_bytes, downloaded, default, path, and 6 more; every field: memo commands info models add

**Next usually:** `memo models download <model>`, `memo models set <model>`

**Example:** `memo models add e5-base --payload '{"repository":"Xenova/multilingual-e5-base","onnx":"onnx/model_quantized.onnx","dims":768,"pooling":"mean","prefix":{"query":"query: ","passage":"passage: "}}'`

### `memo models consents`

consent to send stored notes, documents and mail to a hosted model that rewrites them for search; off by default

#### `memo models consents show`

whether enrichment is on, with which provider and model, how many records it covers and the cost

```sh
memo models consents show [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo models consents show --json`

#### `memo models consents set`

turn enrichment on for one provider and model; without --yes, say what would be sent and change nothing

This command changes the local store or your files.

```sh
memo models consents set <provider> [options]
```

| Argument | | What it is |
|---|---|---|
| `provider` | required | the provider that receives the records: openai or anthropic. |

| Option | What it does |
|---|---|
| `--model <model>` | the provider's model name, such as gpt-4o-mini or claude-haiku-5-5. |
| `--base-url <url>` | the address of an OpenAI-compatible model API, or the Anthropic API root. |
| `--yes` | agree that the records go to this provider, and turn enrichment on. |
| `--json` | print JSON. |

**Example:** `memo models consents set openai --model gpt-4o-mini`, `memo models consents set openai --model gpt-4o-mini --yes`

#### `memo models consents revoke`

turn enrichment off and delete what the model wrote; search reads only the records' own text again

This command changes the local store or your files.

```sh
memo models consents revoke [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo models consents revoke`

### `memo models search-consents`

consent that search all --harder sends the question and its first hits to a hosted model; off by default

#### `memo models search-consents show`

whether search all --harder may call the model, which one, and whether its key is found

```sh
memo models search-consents show [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo models search-consents show --json`

#### `memo models search-consents set`

allow search all --harder to call the model; without --yes, say what it sends and change nothing

This command changes the local store or your files.

```sh
memo models search-consents set <provider> [options]
```

| Argument | | What it is |
|---|---|---|
| `provider` | required | the provider that receives the question and hits: openai or anthropic. |

| Option | What it does |
|---|---|
| `--model <model>` | the provider's model; claude-haiku-5-5 or gpt-4o-mini if left out. |
| `--base-url <url>` | the address of an OpenAI-compatible model API (OpenRouter…); needs --model. |
| `--timeout <duration>` | how long a --harder search waits for the model, 1s to 10m (30s, 2m); 5 s for a hosted model, 60 s for one on this computer until one is set; kept until set again. |
| `--yes` | agree that a --harder search sends its question and hits, and allow it. |
| `--json` | print JSON. |

**Example:** `memo models search-consents set anthropic`, `memo models search-consents set anthropic --yes`

#### `memo models search-consents revoke`

stop search all --harder from calling the model; it gives the plain order again

This command changes the local store or your files.

```sh
memo models search-consents revoke [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo models search-consents revoke`

### `memo models keys`

the API key write-time enrichment and search all --harder send with each request

#### `memo models keys set`

store a key, typed at a hidden prompt or piped on stdin — never as an argument

This command changes the local store or your files.

```sh
memo models keys set <provider> [options]
```

| Argument | | What it is |
|---|---|---|
| `provider` | required | openai, anthropic, or the host of a --base-url server that wants a key. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Returns:** model key stored — provider, stored; every field: memo commands info models keys set

**Example:** `memo models keys set openai`, `memo models keys set anthropic`

#### `memo models keys remove`

forget the stored key; a key in the environment stays

This command changes the local store or your files.

```sh
memo models keys remove <provider> [options]
```

| Argument | | What it is |
|---|---|---|
| `provider` | required | openai, anthropic, or a server's host. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Returns:** model key removed — provider, removed; every field: memo commands info models keys remove

**Example:** `memo models keys remove openai`

### `memo models ai`

the AI model WireCat may use instead of your agent: provider, model and its key

#### `memo models ai show`

the chosen model, whether a key is stored for its address, and whether images may go to it

```sh
memo models ai show [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo models ai show`

#### `memo models ai set`

choose the model: anthropic, openai (or any service that works like it, with --base-url) or ollama (beta)

This command changes the local store or your files.

```sh
memo models ai set <provider> [options]
```

| Argument | | What it is |
|---|---|---|
| `provider` | required | anthropic, openai, ollama. |

| Option | What it does |
|---|---|
| `--model <model>` | the model's name as the provider writes it. |
| `--base-url <url>` | the service's address; https, or http only on this computer. |
| `--secret-stdin` | read the API key from stdin, or ask for it; kept for this address only. |
| `--allow-remote` | let images you add to memory go to this model to be read; they leave this computer. Without it, a set takes back an earlier yes. |
| `--from-app` | you did this in WireCat Desktop. |
| `--json` | print JSON. |

**Example:** `memo models ai set anthropic --model claude-haiku-4-5 --secret-stdin --allow-remote`, `memo models ai set openai --model openai/gpt-4o-mini --base-url https://openrouter.ai/api/v1 --secret-stdin`, `memo models ai set ollama --model llama3.2-vision`

#### `memo models ai unset`

stop using a model; its key stays until models ai remove

This command changes the local store or your files.

```sh
memo models ai unset [options]
```

| Option | What it does |
|---|---|
| `--from-app` | you did this in WireCat Desktop. |
| `--json` | print JSON. |

**Example:** `memo models ai unset`

#### `memo models ai remove`

remove the key stored for an address

This command changes the local store or your files.

```sh
memo models ai remove [origin] [options]
```

| Argument | | What it is |
|---|---|---|
| `origin` | optional | the address, for example https://openrouter.ai; the chosen model's when absent. |

| Option | What it does |
|---|---|
| `--from-app` | you did this in WireCat Desktop. |
| `--json` | print JSON. |

**Example:** `memo models ai remove https://api.anthropic.com`

#### `memo models ai revoke`

stop sending images to the AI model; the model itself stays chosen

This command changes the local store or your files.

```sh
memo models ai revoke [options]
```

| Option | What it does |
|---|---|
| `--from-app` | you did this in WireCat Desktop. |
| `--json` | print JSON. |

**Example:** `memo models ai revoke`

#### `memo models ai check`

send one short request (billed by the provider, usually under a cent) and say what is wrong

**Reads from an outside service.**

```sh
memo models ai check [options]
```

| Option | What it does |
|---|---|
| `--from-app` | you did this in WireCat Desktop. |
| `--json` | print JSON. |

**Example:** `memo models ai check`

### `memo models local-only`

keep every model call on this computer: refuse any address that is not, in every WireCat tool

#### `memo models local-only show`

whether local only is on, and for each feature whether its data stays on this computer

```sh
memo models local-only show [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo models local-only show`

#### `memo models local-only set`

turn local only on or off; only you turn it off

This command changes the local store or your files.

```sh
memo models local-only set <state> [options]
```

| Argument | | What it is |
|---|---|---|
| `state` | required | on or off. |

| Option | What it does |
|---|---|
| `--from-app` | you did this in WireCat Desktop. |
| `--json` | print JSON. |

**Example:** `memo models local-only set on`, `memo models local-only set off`

### `memo models picture-reading`

let your coding agent read the text of a picture you choose: never (the default) or on request

#### `memo models picture-reading show`

whether `images read` may give a picture to your coding agent, which one and with which model

```sh
memo models picture-reading show [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo models picture-reading show`

#### `memo models picture-reading set`

never, or on request with `images read`; only you turn it on

This command changes the local store or your files.

```sh
memo models picture-reading set <mode> [options]
```

| Argument | | What it is |
|---|---|---|
| `mode` | required | never or request. |

| Option | What it does |
|---|---|
| `--agent <agent>` | the coding agent that reads: claude or codex. One of: `claude`, `codex`. |
| `--model <model>` | the agent's model; its own default if not given. |
| `--from-app` | you did this in WireCat Desktop. |
| `--json` | print JSON. |

**Example:** `memo models picture-reading set request --agent claude`, `memo models picture-reading set request --agent codex --model gpt-5`, `memo models picture-reading set never`

## `memo templates`

the templates of the digest and the other messages sent to you, per channel and language; edit, preview, reset

### `memo templates list`

every template key, channel and language, and whether yours or the shipped one applies

```sh
memo templates list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Returns:** template — key, channel, language, about, renders, source, updated_at, updated_by; every field: memo commands info templates list

**Example:** `memo templates list`, `memo templates list channel:telegram source:stored --json`

### `memo templates show`

the template that applies, yours or the shipped one, and the bodies your changes replaced

```sh
memo templates show <key> [options]
```

| Argument | | What it is |
|---|---|---|
| `key` | required | the template, such as report/morning-digest. |

| Option | What it does |
|---|---|
| `--channel <channel>` | telegram (Bot API HTML), email (HTML with inline styles) or text. One of: `telegram`, `email`, `text`. |
| `--locale <code>` | the template's language, ISO 639-1; the owner's first language if not given. |
| `--json` | print JSON. |

**Example:** `memo templates show report/morning-digest --channel telegram`, `memo templates show report/weekly-gaps --channel email --locale en --json`

### `memo templates edit`

change a template in $EDITOR or from --file; it is checked first, and a failed check saves nothing and says why

This command changes the local store or your files.

```sh
memo templates edit <key> [options]
```

| Argument | | What it is |
|---|---|---|
| `key` | required | the template, such as report/morning-digest. |

| Option | What it does |
|---|---|
| `--channel <channel>` | telegram (Bot API HTML), email (HTML with inline styles) or text. One of: `telegram`, `email`, `text`. |
| `--locale <code>` | the template's language, ISO 639-1; the owner's first language if not given. |
| `--file <file>` | take the new template from this file instead of opening an editor; - reads stdin. |
| `--undo` | put back the body your last change replaced; twice is back where you were. |
| `--json` | print JSON. |

**Example:** `memo templates edit report/morning-digest --channel telegram`, `memo templates edit report/morning-digest --channel text --file digest.text.liquid`, `memo templates edit report/morning-digest --channel telegram --undo`

### `memo templates preview`

what would be sent on that channel, from the last real report or a synthetic one when there is none; saves nothing

```sh
memo templates preview <key> [options]
```

| Argument | | What it is |
|---|---|---|
| `key` | required | the template, such as report/morning-digest. |

| Option | What it does |
|---|---|
| `--channel <channel>` | telegram (Bot API HTML), email (HTML with inline styles) or text. One of: `telegram`, `email`, `text`. |
| `--locale <code>` | the template's language, ISO 639-1; the owner's first language if not given. |
| `--file <file>` | preview this draft instead of the template that applies; - reads stdin. |
| `--json` | print JSON. |

**Example:** `memo templates preview report/morning-digest --channel telegram`, `memo templates preview report/morning-digest --channel email --locale en --file draft.liquid`

### `memo templates reset`

go back to the shipped template; yours is kept in the history, and edit --undo brings it back

This command changes the local store or your files.

```sh
memo templates reset <key> [options]
```

| Argument | | What it is |
|---|---|---|
| `key` | required | the template, such as report/morning-digest. |

| Option | What it does |
|---|---|
| `--channel <channel>` | telegram (Bot API HTML), email (HTML with inline styles) or text. One of: `telegram`, `email`, `text`. |
| `--locale <code>` | the template's language, ISO 639-1; the owner's first language if not given. |
| `--json` | print JSON. |

**Example:** `memo templates reset report/morning-digest --channel telegram`

## `memo search`

search messages, mail, notes, memories and people; search all when unsure where

### `memo search all`

messages, mail, notes, calendar events, deals, leads, business data and meeting passages from every meeting account, ranked together; not people, memories, projects or decisions. A kind you know reads better with its own search, with all its fields

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
| `--only <resources>` | messages,mail,notes,events,crm,business,meetings, separated by commas. |
| `--source <accounts>` | only these accounts, separated by commas: provider:account as a hit shows it, a provider, a kind or group:<name>; each resource reads the ones of its kind, and one it names none of is left out. |
| `--plain-order` | best first by the words alone, without moving mail from suspicious senders down. |
| `--harder` | a hosted model reorders the first 30 hits; sends the question and those hits to the provider you chose with memo models search-consents set <provider> --yes, only after that. |
| `--project <project>` | rank the key documents of this project (id, project:<id>, key, exact name or alias) first; nothing is left out. |

**Returns:** hit — kind, ref, provider, account, title, timestamp, excerpt, url, and 18 more; every field: memo commands info search all

**Example:** `memo search all 'budget harbour'`, `memo search all 'Rental agreement' --only business`, `memo search all 'release date' --source zoom:work,notes --json`

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
| `--brief` | each message as reference, time, sender and excerpt only. |
| `--full` | each message with its whole text; --json still gives the excerpt. |

**Returns:** message hit — ref, timestamp, sender_name, sender_is_me, chat_title, excerpt, matched_in, score, and 9 more; every field: memo commands info search messages

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
| `--brief` | each email as reference, time, sender and excerpt only. |
| `--full` | each email with its whole text; --json still gives the excerpt. |
| `--source <accounts>` | the mailboxes to search (default: every one): email:<address>, email or group:<name>. |
| `--plain-order` | best first by the words alone, without moving mail from suspicious senders down. |

**Returns:** message hit — ref, timestamp, sender_name, sender_is_me, chat_title, excerpt, matched_in, score, and 9 more; every field: memo commands info search mail

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
| `--filter <query>` | another query every note must match. |
| `--source <accounts>` | only these notes accounts, separated by commas: notes:internal for notes written in memo, notes:<folder id> as a hit shows it, notes or group:<name>. |
| `--page <n>` | which page, from 1. Default: `1`. |
| `--project <project>` | rank the key documents of this project (id, project:<id>, key, exact name or alias) first, labelled key; nothing is left out. |

**Returns:** note hit — ref, source, folder_id, path, title, updated_at, kind, provider, and 6 more; every field: memo commands info search notes

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

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 13 more; every field: memo commands info search memories

**Example:** `memo search memories friday meetings scope:work`

### `memo search people`

people whose name, username or alias holds every word, in every account unless --source narrows it; each with its person:<id> for --contact and its identities

```sh
memo search people <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | parts of the name, username or alias; case and accents do not matter. |

| Option | What it does |
|---|---|
| `--source <accounts>` | which accounts, separated by commas: provider:account (email:personal), a provider (email), a kind (mail, notes, documents) or group:<name>. |
| `--limit <n>` | most people, at most 100. Default: `20`. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** person — ref, name, identities; every field: memo commands info search people

**Next usually:** `memo context <person>`, `memo tasks assign <id> <person>`, `memo mentions confirm <id> [person]`

**Example:** `memo search people ana`, `memo search people Ana Example --source telegram --json`

### `memo search meetings`

find words in stored meetings, indexing new ones first

```sh
memo search meetings <query> [options]
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
| `--topic-name <name>` | meetings with this topic, by name or alias. |
| `--since-time <time>` | meetings starting at or after this ISO 8601 date or time, or 30m, 2h, 7d ago. |
| `--until-time <time>` | meetings starting at or before this ISO 8601 date or time; a date alone covers that whole local day. |
| `--limit <n>` | how many hits, 1 through 1000; the profile's defaults.limit when absent. |
| `--cursor <cursor>` | continue from the previous page's page.next_cursor, with the same query and filters. |
| `--max-read-bytes <bytes>` | most stored bytes to read, 1 through 67108864 (default 4194304). |
| `--source <accounts>` | the meeting account: provider:account (zoom:me@example.com), or a provider that has one. |
| `--json` | print the standard JSON answer. |

**Returns:** meeting hit — ref, meeting, scope, id, excerpt, offset_ms, language, line, and 5 more; every field: memo commands info search meetings

**Next usually:** `memo meetings show <meeting>`

**Example:** `memo search meetings budget --source zoom:me@example.com --project Harbour --since-time 2026-10-01 --limit 10 --json`

## `memo events`

calendar events of every account in the store, phone calls included

### `memo events list`

events of every calendar account in the store, latest start first: calendars and imported phone calls

```sh
memo events list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | events at most, 1–1000. Default: `100`. |
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** event — id, event_series_id, title, description, location, starts_at, ends_at, timezone, and 13 more; every field: memo commands info events list

**Example:** `memo events list event_type:call`, `memo events list account:phone:pixel 'starts_at:[2026-11-02 TO 2026-11-07}' --json`

### `memo events show`

one event: its time, the accounts and calendars that hold it, and its attendees

```sh
memo events show <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | event:<id>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=ref,title keeps only those fields. |

**Returns:** event — id, event_series_id, title, description, location, starts_at, ends_at, timezone, and 13 more; every field: memo commands info events show

**Example:** `memo events show event:42`

## `memo answers`

cited evidence and optional model answers

### `memo answers create`

prepare cited evidence for your agent, or explicitly call a configured model

```sh
memo answers create <question> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `question` | required | the question, in your own words. |
| `query` | optional | what to search for: words, phrases, Boolean operators and field queries; default the question. |

| Option | What it does |
|---|---|
| `--all` | look in every stored account and the notes. |
| `--source <accounts>` | look in these only: which accounts, separated by commas: provider:account (email:personal), a provider (email), a kind (mail, notes, documents) or group:<name>. |
| `--limit <n>` | most evidence items, at most 100. Default: `20`. |
| `--analyze` | call the AI model (memo models ai set, or MEMO_MODELS_ANALYSIS_*) instead of returning evidence. |
| `--allow-remote` | explicitly consent to sending this evidence to the configured model. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo answers create 'what did Kai say about the budget?' --all`, `memo answers create 'when is the launch?' --source telegram:1`

## `memo sync`

bring notes up to date in the store, only what changed, embed the mail already stored for search by meaning, and match people across sources (memo people scan); the mail CLI syncs the mail itself (mail <profile> sync). Every configured folder unless narrowed

This command changes the local store or your files.

```sh
memo sync [options]
```

| Option | What it does |
|---|---|
| `--only <resources>` | notes,mail,people, separated by commas; mail embeds stored mail only, people links who is who. |
| `--folder <folder>` | notes: only this configured folder, by its id or path; repeat for more. |
| `--ignore <path>` | notes: leave this file or folder alone this run, a path or a glob; repeat for more. |
| `--no-embed` | skip embedding notes and mail for search by meaning this run. |
| `--timeout <duration>` | stop after this long, e.g. 10m; progress so far is kept (default: no limit). |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo sync`, `memo sync --only mail`, `memo sync --only notes --folder ~/notes --no-embed`

## `memo store`

the shared local store every WireCat tool reads

### `memo store info`

the store file: where it is, its size, its schema against the one memo speaks, which tools used it and how many rows it holds; changes nothing

```sh
memo store info [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Returns:** store info — path, exists, schema, opens, error, bytes, journal_mode, pages, and 12 more; every field: memo commands info store info

**Example:** `memo store info`, `memo store info --json`

### `memo store recover`

check every page and search index of the store, say what is damaged, what it means and the commands that recover it; changes nothing

```sh
memo store recover [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo store recover`

#### `memo store recover run`

copy every readable row into a new file with the sqlite3 program, rebuild the search indexes, mentions and vector index, check it, and put it in place of the store; the damaged file is kept beside it. Refuses while a WireCat timer or process has the store

This command changes the local store or your files.

```sh
memo store recover run [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo store recover run`

## `memo groups`

account groups: memo <group> … reads only the group's accounts

### `memo groups list`

every saved group, then all, with its accounts, each with its profiles in every app and the other groups that hold it too; duplicates and profile-name suggestions last

```sh
memo groups list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms; this list filters by none yet. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo groups list`, `memo groups list --json`

### `memo groups add`

put an account in a group, which is made when it does not exist; it may stay in others too

This command changes the local store or your files.

```sh
memo groups add <group> <source> [options]
```

| Argument | | What it is |
|---|---|---|
| `group` | required | the group: letters, digits, - and _, not a memo command word. |
| `source` | required | one account, as --source names it: telegram:102, tg:work, email:me@work.example, bitrix24:<portal>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo groups add work bitrix24:acme`, `memo groups add personal telegram:102`

### `memo groups remove`

take an account out of a group; the account and its data stay, and `all` still reads it

This command changes the local store or your files.

```sh
memo groups remove <group> <source> [options]
```

| Argument | | What it is |
|---|---|---|
| `group` | required | the group. |
| `source` | required | one account, as --source names it: telegram:102, tg:work, email:me@work.example, bitrix24:<portal>. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo groups remove work telegram:102`

### `memo groups move`

move an account from one group to another in one write; the other group is made when it is new

This command changes the local store or your files.

```sh
memo groups move <source> <from> <to> [options]
```

| Argument | | What it is |
|---|---|---|
| `source` | required | one account, as --source names it: telegram:102, tg:work, email:me@work.example, bitrix24:<portal>. |
| `from` | required | the group it leaves. |
| `to` | required | the group it joins. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo groups move telegram:102 personal work`

### `memo groups rename`

give a group another name, with its members; a run, lock or agent that still names the old one is refused with the groups there are

This command changes the local store or your files.

```sh
memo groups rename <group> <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `group` | required | the group. |
| `name` | required | its new name: letters, digits, - and _, not a memo command word. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo groups rename work office`

### `memo groups delete`

delete a group and its memberships; its accounts and their data stay, in their other groups and in `all`

This command changes the local store or your files.

```sh
memo groups delete <group> [options]
```

| Argument | | What it is |
|---|---|---|
| `group` | required | the group. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo groups delete clients`

### `memo groups update`

set an account's scope, personal or work, which decides whether work views and meeting preparation read it; with --chat, pin one chat of it to a scope, or let it follow its account again

This command changes the local store or your files.

```sh
memo groups update <source> [options]
```

| Argument | | What it is |
|---|---|---|
| `source` | required | one account, as --source names it: telegram:102, tg:work, email:me@work.example, bitrix24:<portal>. |

| Option | What it does |
|---|---|
| `--scope <scope>` | personal or work; with --chat also account, which takes the chat's own off. |
| `--chat <chat>` | one chat of the account, by its id there. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo groups update bitrix24:acme --scope work`, `memo groups update telegram:102 --chat 7 --scope account`

## `memo jobs`

run memo sync on a systemd user timer, set in the config

### `memo jobs start`

sync every --every (default auto.every, else 5m), starting a minute from now

This command changes the local store or your files.

```sh
memo jobs start [options]
```

| Option | What it does |
|---|---|
| `--every <duration>` | how often: 5m, 90s, 1h — a minute or more. |

**Example:** `memo jobs start --every 10m`

### `memo jobs stop`

stop syncing on a timer and remove the timer

This command changes the local store or your files.

```sh
memo jobs stop
```

**Example:** `memo jobs stop`

### `memo jobs status`

whether the timer is on, its interval, its next run and how the last one ended

```sh
memo jobs status [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo jobs status --json`

## `memo config`

memo's settings file

### `memo config show`

every setting, its value, its default and whether the file sets it

```sh
memo config show [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo config show`, `memo config show --json`

### `memo config migrate`

write each setting the file lacks at its default, keeping yours

This command changes the local store or your files.

```sh
memo config migrate [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo config migrate`

### `memo config unset`

remove one setting from the config file, even one memo does not know

This command changes the local store or your files.

```sh
memo config unset <key> [options]
```

| Argument | | What it is |
|---|---|---|
| `key` | required | the setting's dotted path, as memo doctor names it, e.g. permissions.notes.edit. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo config unset permissions.notes.edit`

## `memo doctor`

the state this installation is in, without connecting unless --online

```sh
memo doctor [options]
```

| Option | What it does |
|---|---|
| `--online` | also connect once and read the account; sends nothing. |
| `--deep` | also read every page of the store and check every search index (about 30 s for 6 GB); without it, only the file header and schema. |
| `--json` | print JSON; --json=id,title keeps only those fields. |

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

**Example:** `memo upgrade --check`

## `memo schedule`

run a memo command or an agent later or on a timer (systemd, launchd, Task Scheduler); an agent cannot send

### `memo schedule command`

run memo <args…> on a timer — reads save what they read, so this is how a chat's history fills the store

This command changes the local store or your files.

```sh
memo schedule command <name> <args> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | lowercase letters, digits and dashes. |
| `args` | required | the memo command after its name, e.g. -- messages list <chat> --limit 50. |

| Option | What it does |
|---|---|
| `--every <duration>` | repeat: 30m, 2h, 1d. |
| `--at <HH:MM>` | every day at this local time; 'mon 09:00' once a week, 'mon,fri 09:00' on several days (mon, tue, wed, thu, fri, sat, sun); repeat it for more times. |
| `--at-time <time>` | one run: 30m, 2d from now, or an ISO time; the schedule removes itself after it. |
| `--notify-on <when>` | desktop notice after a run (default failures for an agent that repeats with --every, else always). One of: `always`, `failures`, `never`. |
| `--deliver-to <route>` | also send the result, when --notify-on says so, by the owner's own tg or mail: telegram-bot:<profile>/<chat id or user:id>, or email:<profile>/<address>; repeat it for more. |
| `--json` | print JSON. |

**Example:** `memo schedule command digest --at 08:30 -- review status`, `memo schedule command mail-sync --every 1h -- sync --only mail`

### `memo schedule agent`

start an agent (claude, codex, gemini, cursor, opencode, openclaw, hermes, grok, kimi) with a prompt on a timer; it runs with MEMO_READ_ONLY=1 and MAIL_READ_ONLY=1, so it reads and drafts and cannot send, and its own limits hold it to these CLIs' commands; an agent with no such limit is refused (`schedule agents list` says which) — its answer is kept and you are notified

This command changes the local store or your files.

```sh
memo schedule agent <name> <harness> <prompt> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | lowercase letters, digits and dashes. |
| `harness` | required | the agent to start. One of: `claude`, `codex`, `gemini`, `cursor`, `opencode`, `openclaw`, `hermes`, `grok`, `kimi`. |
| `prompt` | required | what to do, e.g. "summarize what came in during the last day: memo personal search messages 'date>1d' --newest --limit 20". |

| Option | What it does |
|---|---|
| `--model <model>` | the model it runs on: an alias such as sonnet, or a model id; "" for the agent's own default (default sonnet for claude, the agent's own for the others, or the config file's). |
| `--max-cost <usd>` | claude only: stop a run that costs more than this, in US dollars. |
| `--allow-dangerous` | start an agent its own limits cannot hold to these CLIs' commands, where `schedule agents list` says allowed_with_ack: it may then run any program inside its sandbox. |
| `--max-cost-per-day <usd>` | claude only, as the others report no cost: start no run for the rest of the day once its runs cost this much, in US dollars; 0 for no cap (default 5, or the config file's). |
| `--every <duration>` | repeat: 30m, 2h, 1d. |
| `--at <HH:MM>` | every day at this local time; 'mon 09:00' once a week, 'mon,fri 09:00' on several days (mon, tue, wed, thu, fri, sat, sun); repeat it for more times. |
| `--at-time <time>` | one run: 30m, 2d from now, or an ISO time; the schedule removes itself after it. |
| `--notify-on <when>` | desktop notice after a run (default failures for an agent that repeats with --every, else always). One of: `always`, `failures`, `never`. |
| `--deliver-to <route>` | also send the result, when --notify-on says so, by the owner's own tg or mail: telegram-bot:<profile>/<chat id or user:id>, or email:<profile>/<address>; repeat it for more. |
| `--on-new-mail <holder>` | run only when mail is stored past this holder's mark — after a sync brought new mail; may check every 5m. |
| `--mail-wait <duration>` | with --on-new-mail: start once the oldest waiting email has waited this long (default 30m, or the config file's). |
| `--mail-batch <n>` | with --on-new-mail: or once this many emails wait (default 10, or the config file's). |
| `--json` | print JSON. |

**Example:** `memo schedule agent triage claude 'read memo review status and list what needs me today' --at 08:45 --max-cost 1`, `memo schedule agent mail-triage claude 'Run memo skill show mail-triage and follow it.' --every 5m --on-new-mail mail-triage --mail-wait 1h --mail-batch 20 --max-cost 1 --max-cost-per-day 5`, `memo schedule agent weekly claude 'read memo review status and sum up the week' --at 09:00 --model opus`

### `memo schedule list`

the schedules, when they run and how their last run went

```sh
memo schedule list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Returns:** scheduled job — name, kind, when, last, paused, notify, deliver_to, harness, and 4 more; every field: memo commands info schedule list

**Example:** `memo schedule list`, `memo schedule list kind:agent --json`

### `memo schedule agents`

the coding agents an agent schedule may start

```sh
memo schedule agents [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON. |

#### `memo schedule agents list`

the agents a schedule may start, and which are on PATH here

```sh
memo schedule agents list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms; this list filters by none yet. |

**Returns:** schedule harness — id, name, programs, reports_cost, restricted, restricted_reason, allowed_with_ack, installed, and 1 more; every field: memo commands info schedule agents list

**Example:** `memo schedule agents list`, `memo schedule agents list --json`

### `memo schedule run`

run a schedule now, as its timer would, and wait for it; a paused one runs too

This command changes the local store or your files.

```sh
memo schedule run <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

| Option | What it does |
|---|---|
| `--no-notify` | keep the result here: send it along none of its routes. |
| `--deliver-to <route>` | send it along only this one of its own routes; repeat it for more. |
| `--json` | print JSON. |

**Example:** `memo schedule run digest`

### `memo schedule remove`

stop a schedule and remove its timer; its past output stays

This command changes the local store or your files.

```sh
memo schedule remove <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo schedule remove digest`

### `memo schedule pause`

take a schedule off its timer and keep it; run runs it, resume puts it back

This command changes the local store or your files.

```sh
memo schedule pause <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo schedule pause digest`

### `memo schedule resume`

put a paused schedule back on its timer

This command changes the local store or your files.

```sh
memo schedule resume <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo schedule resume digest`

### `memo schedule exec`

what a timer runs, given the schedule's file; to run one by hand, use run

This command changes the local store or your files.

```sh
memo schedule exec <file> [seal] [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | the schedule's schedule.json in the state folder, as the timer passes it. |
| `seal` | optional | the file's SHA-256 as it was saved, which the timer passes; a file that differs does not run. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo schedule exec ~/.local/state/cli-memo/schedules/digest/schedule.json`

## `memo digest`

your digests: each a name, its times, what it reads, where it is sent and your brief; run one now, pause it, and build past days

### `memo digest brief`

your own instructions on what the morning digest collects: projects, people, topics, what to skip, how many items. The morning-digest skill ends with them, and where they contradict its rules they win; the run stays read only, with memo as its only tool and the schedule's cost cap. At most 4000 characters

#### `memo digest brief show`

```sh
memo digest brief show [digest] [options]
```

| Argument | | What it is |
|---|---|---|
| `digest` | optional | the digest's name, as `memo digest list` shows it; morning-digest when left out. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo digest brief show`, `memo digest brief show --json`

#### `memo digest brief edit`

write the brief in $EDITOR, or from --file; at most 4000 characters. The body it replaces is kept, and --undo puts it back. Only you change it, never an agent or a read-only run

This command changes the local store or your files.

```sh
memo digest brief edit [digest] [options]
```

| Argument | | What it is |
|---|---|---|
| `digest` | optional | the digest's name, as `memo digest list` shows it; morning-digest when left out. |

| Option | What it does |
|---|---|
| `--file <file>` | take the brief from this file instead of opening an editor; - reads stdin. |
| `--undo` | put back the body your last change replaced. |
| `--json` | print JSON. |

**Example:** `memo digest brief edit`, `memo digest brief edit --file brief.md`, `memo digest brief edit --undo`

#### `memo digest brief reset`

remove the brief, so the digest follows its skill alone; edit --undo brings it back

This command changes the local store or your files.

```sh
memo digest brief reset [digest] [options]
```

| Argument | | What it is |
|---|---|---|
| `digest` | optional | the digest's name, as `memo digest list` shows it; morning-digest when left out. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo digest brief reset`

### `memo digest list`

```sh
memo digest list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo digest list`, `memo digest list name:weekly --json`

### `memo digest add`

make a digest: an agent that runs memo's morning-digest skill at the given times, reading from its previous time (a weekly one reads the week) and only the sources given, and sends what it writes along the routes given. It runs read only. Each run is a paid model call; only you make one

This command changes the local store or your files.

```sh
memo digest add <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | lowercase letters, digits and dashes. |

| Option | What it does |
|---|---|
| `--paused` | make it without putting it on its timer; `memo digest resume` does. |
| `--title <title>` | the name the digest is shown under. |
| `--at <HH:MM>` | when it runs: HH:MM every day, or 'mon,fri 09:00' on those days; repeat it for more times, as 08:30 and 18:00. |
| `--source <accounts>` | what it reads, comma-separated or repeated: telegram, max, whatsapp, mail, meetings, tasks, drive, calendar, crm; all (the default) reads everything. |
| `--deliver-to <route>` | where each run is sent: telegram-bot:<profile>/<chat> or email:<profile>/<address>; repeat it for more, none for nowhere. |
| `--text <text>` | your brief: what to collect, what to skip, how much; at most 4000 characters. |
| `--agent <agent>` | the agent that writes it; a new digest takes the one agent installed, and asks when there are more. A local model needs an agent set up to run one. One of: `claude`, `codex`, `gemini`, `cursor`, `opencode`, `openclaw`, `hermes`, `grok`, `kimi`. |
| `--model <model>` | the model the agent runs on: an alias such as sonnet or a model id; "" for the agent's own default. |
| `--allow-dangerous` | let an agent whose own limits cannot hold it to memo's commands write it, where `memo schedule agents list` says allowed_with_ack (codex): it may then run any program inside its sandbox. Only you give this. |
| `--max-cost <usd>` | stop a run that costs more than this, in US dollars; only for an agent that reports its cost. |
| `--max-cost-per-day <usd>` | start no run for the rest of the day once its runs cost this much, in US dollars; 0 for no cap. |
| `--json` | print JSON. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |

**Example:** `memo digest add evening --title 'Evening digest' --at 18:00 --deliver-to telegram-bot:personal/user:42`, `memo digest add weekly --title 'The week' --at 'mon 09:00' --source telegram,mail,tasks`

### `memo digest edit`

change a digest: each option given replaces what it set before (--at all its times, --source all its sources, --deliver-to all its routes), and the rest stays as it was. --source all reads everything again, --deliver-to none sends nowhere. A paused digest stays paused. Only you change one

This command changes the local store or your files.

```sh
memo digest edit <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the digest's name, as `memo digest list` shows it. |

| Option | What it does |
|---|---|
| `--title <title>` | the name the digest is shown under. |
| `--at <HH:MM>` | when it runs: HH:MM every day, or 'mon,fri 09:00' on those days; repeat it for more times, as 08:30 and 18:00. |
| `--source <accounts>` | what it reads, comma-separated or repeated: telegram, max, whatsapp, mail, meetings, tasks, drive, calendar, crm; all (the default) reads everything. |
| `--deliver-to <route>` | where each run is sent: telegram-bot:<profile>/<chat> or email:<profile>/<address>; repeat it for more, none for nowhere. |
| `--text <text>` | your brief: what to collect, what to skip, how much; at most 4000 characters. |
| `--agent <agent>` | the agent that writes it; a new digest takes the one agent installed, and asks when there are more. A local model needs an agent set up to run one. One of: `claude`, `codex`, `gemini`, `cursor`, `opencode`, `openclaw`, `hermes`, `grok`, `kimi`. |
| `--model <model>` | the model the agent runs on: an alias such as sonnet or a model id; "" for the agent's own default. |
| `--allow-dangerous` | let an agent whose own limits cannot hold it to memo's commands write it, where `memo schedule agents list` says allowed_with_ack (codex): it may then run any program inside its sandbox. Only you give this. |
| `--max-cost <usd>` | stop a run that costs more than this, in US dollars; only for an agent that reports its cost. |
| `--max-cost-per-day <usd>` | start no run for the rest of the day once its runs cost this much, in US dollars; 0 for no cap. |
| `--json` | print JSON. |
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |

**Example:** `memo digest edit evening --at 08:30 --at 18:00`, `memo digest edit weekly --source all --deliver-to none`

### `memo digest run`

build a digest now, as its timer would, paused or not, and keep the run with its others; it is sent along its routes, only along those --deliver-to names (each one of its own), or with --no-notify nowhere. A paid model call: the day's cost cap holds, and only you run it

This command changes the local store or your files.

```sh
memo digest run <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the digest's name, as `memo digest list` shows it. |

| Option | What it does |
|---|---|
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--no-notify` | keep it here: send it nowhere. |
| `--deliver-to <route>` | send it only along this one of the digest's routes; repeat it for more. |
| `--json` | print JSON. |

**Example:** `memo digest run evening`, `memo digest run weekly --no-notify --json`

### `memo digest pause`

This command changes the local store or your files.

```sh
memo digest pause <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the digest's name, as `memo digest list` shows it. |

| Option | What it does |
|---|---|
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON. |

**Example:** `memo digest pause weekly`

### `memo digest resume`

This command changes the local store or your files.

```sh
memo digest resume <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the digest's name, as `memo digest list` shows it. |

| Option | What it does |
|---|---|
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON. |

**Example:** `memo digest resume weekly`

### `memo digest remove`

This command changes the local store or your files.

```sh
memo digest remove <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the digest's name, as `memo digest list` shows it. |

| Option | What it does |
|---|---|
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--json` | print JSON. |

**Example:** `memo digest remove weekly`

### `memo digest backfill`

build each past run a digest would have had: its schedule's agent runs as its timer does (the same skill, flags and cost caps), reading the agenda as of that run's time and from the digest's previous time, and the result is kept as that run, marked backfill, for WireCat Desktop's digests screen. It is never sent to Telegram or mail. A run that already has a digest is skipped. Without --yes it only prints what it would build and the estimate: the runs times the last run's cost. Each run is a paid model call: it stops once today's runs cost the schedule's daily cap or a run fails, and only you run it, never an agent. The store keeps what holds now, so a chat answered since reads as answered

This command changes the local store or your files.

```sh
memo digest backfill [digest] [options]
```

| Argument | | What it is |
|---|---|---|
| `digest` | optional | the digest's name, as `memo digest list` shows it; morning-digest when left out. |

| Option | What it does |
|---|---|
| `--from-app` | you did this in WireCat Desktop: record it as yours, with no terminal question. |
| `--since-time <time>` | the first day, YYYY-MM-DD. |
| `--until-time <time>` | the last day, YYYY-MM-DD; not a day whose run time is still ahead. |
| `--yes` | build them; without it, only the estimate is printed. |
| `--json` | print JSON. |

**Example:** `memo digest backfill --since-time 2026-11-01 --until-time 2026-11-07`, `memo digest backfill --since-time 2026-11-01 --until-time 2026-11-07 --yes --json`

## `memo commands`

every command by section; --json prints its contract, one path per call

```sh
memo commands [path] [options]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | one command, such as tags add. |

| Option | What it does |
|---|---|
| `--json` | print JSON; --json=id,title keeps only those fields. |

**Example:** `memo commands`

### `memo commands info`

one command contract, or all schemas, error reasons and explicit overrides

```sh
memo commands info [path] [options]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | one command path; without one, schemas, error reasons and explicit overrides. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo commands info --json`

## `memo skill`

the instructions an agent is given for this tool

### `memo skill show`

print SKILL.md — `memo skill install` puts it where Claude Code, Codex, Gemini CLI and OpenClaw look for it, and where Hermes does on request; --for prints the copy already there; morning-digest ends with your brief from `memo digest brief` when you wrote one

```sh
memo skill show [name] [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | optional | one of the skills shipped for a task: search, projects, meetings, mail, proposals, money, mcp, vocabulary, mail-triage, morning-digest. |

| Option | What it does |
|---|---|
| `--for <agents>` | print the copy installed for these agents instead of this version's. One of: `claude`, `agents`. |
| `--json` | print JSON. |

**Example:** `memo skill show`

### `memo skill install`

write SKILL.md to \~/.claude/skills/cli-memo/ (Claude Code) and \~/.agents/skills/cli-memo/ (Codex, Gemini CLI, OpenClaw); --for hermes also has Hermes read \~/.agents/skills, which changes Hermes's own settings, so all leaves it out

This command changes the local store or your files.

```sh
memo skill install [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `hermes`, `all`. Default: `all`. |
| `--json` | print JSON. |

**Example:** `memo skill install --for all`

### `memo skill status`

for each place `memo skill install` writes to, and for the copy Hermes reads: the path, the version installed there, and whether it is current, stale, missing or unversioned

```sh
memo skill status [options]
```

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Example:** `memo skill status`, `memo skill status --json`

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

**Example:** `memo guide`, `memo guide person-brief --json`

## `memo runs`

recorded runs — what this tool did, and when

### `memo runs list`

recorded runs, newest first

```sh
memo runs list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--json` | print JSON. |

**Returns:** run — run_id, command, started_at, status, cli_version, profile, completed_at, requests, and 23 more; every field: memo commands info runs list

**Example:** `memo runs list status:failed --limit 10`, `memo runs list --page 2 --json`

### `memo runs show`

one run: what it was, how it ended, and every event it logged

```sh
memo runs show <run-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `memo runs list`. |

| Option | What it does |
|---|---|
| `--problems` | only failed responses, warnings and crashes. |
| `--json` | print JSON. |

**Returns:** run details — run_id, command, started_at, status, cli_version, directory, event_count, events, and 22 more; every field: memo commands info runs show

**Example:** `memo runs show 20261025T090000Z-mail-sync-a81f2c --json`

### `memo runs path`

the directory holding one run

```sh
memo runs path <run-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `memo runs list`. |

| Option | What it does |
|---|---|
| `--json` | print JSON. |

**Returns:** run location — path; every field: memo commands info runs path

**Example:** `memo runs path 20261025T090000Z-mail-sync-a81f2c`

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
| `15` | `conflict` |
| `130` | `cancelled` |
| `1` | anything else |
