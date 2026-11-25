---
title: "Команды ydisk"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Найдите любую команду ydisk, ее параметры и ответ и будьте уверены, что они совпадают с вашей версией: эта
страница создается из самой программы.

ИИ-агент читает тот же список в JSON через `ydisk commands --json` и выбирает там команду и ее параметры. Каждый код
выхода означает один вид сбоя, так что скрипт или агент понимает, что пошло не так. Описания команд и параметров
остаются на языке встроенной справки.

**Первым словом идет профиль**, имя, которое вы выбираете сами: `ydisk personal config show`. `YDISK_PROFILE`
задает профиль для всего сеанса оболочки. Профиль никогда не подставляется сам: команда, которой нужен аккаунт, без
профиля останавливается и показывает профили на этом компьютере.

## Параметры всех команд

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

## `ydisk commands`

every command by section; --json prints its contract, one path per call

### `ydisk commands info`

one command contract, or all schemas, error reasons and explicit overrides

```sh
ydisk commands info [path]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | one command path; without one, export schemas, error reasons and explicit overrides. |

**Example:** `ydisk commands info commands`

## `ydisk session`

keep this profile's Yandex Disk token in the OS keyring

### `ydisk session start`

sign this profile in: the Yandex Disk API token is asked hidden or read from stdin, never taken as an argument, checked against the service, and only then kept in the keyring, or in a private file

**Changes something on this computer only.**

```sh
ydisk session start [options]
```

| Option | What it does |
|---|---|
| `--credential-storage <storage>` | where the token is kept: keyring, which falls back to a private file by itself when no keyring works; file skips the keyring, so keep it for a computer that has none. Default: `keyring`. |

**Example:** `ydisk personal session start`

### `ydisk session status`

show where this profile's token comes from: YDISK_TOKEN, the keyring or a file, never the token; --check asks Yandex Disk whose token it is

```sh
ydisk session status [options]
```

| Option | What it does |
|---|---|
| `--check` | ask Yandex Disk whether the token still works, and whose it is. |

**Example:** `ydisk personal session status`, `ydisk personal session status --check --json`

### `ydisk session end`

forget this profile's token on this computer; the token itself stays valid in Yandex Disk until you remove the app in Yandex ID's Data access: https://id.yandex.ru/personal/data-access

**Changes something on this computer only.**

```sh
ydisk session end
```

**Example:** `ydisk personal session end`

### `ydisk session list`

list the profiles on this computer and whether each has a token; picks none

```sh
ydisk session list
```

**Example:** `ydisk session list`, `ydisk session list --json`

## `ydisk account`

this profile on this computer

### `ydisk account remove`

sign the profile out, then forget it on this computer: its settings, its saved sign-in and its files; --keep-data leaves its messages in the store, where search still finds them, --delete-data deletes them; asks first, or --yes

**Changes something on this computer only.**

```sh
ydisk account remove [options]
```

| Option | What it does |
|---|---|
| `--keep-data` | leave what the store holds of this account, still searchable. |
| `--delete-data` | delete what the store and the tool's own files hold of this account. |
| `--dry-run` | list what it would remove and keep, and change nothing. |

**Returns:** account removal — profile, data, dry_run, account, revoked, config_file, removed, kept; every field: ydisk commands info account remove

**Example:** `ydisk personal account remove --keep-data --dry-run`, `ydisk personal account remove --delete-data --yes`

## `ydisk folders`

choose the Disk folders sync copies

### `ydisk folders add`

import a folder and everything under it on the next sync

**Changes something on this computer only.**

```sh
ydisk folders add <folder>
```

| Argument | | What it is |
|---|---|---|
| `folder` | required | Disk path to add, like /Documents; its id to remove. |

**Example:** `ydisk personal folders add /Documents`

### `ydisk folders list`

list the folder ids sync imports

```sh
ydisk folders list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** selected folder — id, name, path; every field: ydisk commands info folders list

**Example:** `ydisk personal folders list`

### `ydisk folders browse`

list Disk folders one level at a time, live, to choose one for folders add; has_children says whether a folder holds a folder, or is null when the level has more than 20 folders and it is not looked up

```sh
ydisk folders browse [options]
```

| Option | What it does |
|---|---|
| `--folder <folder>` | the Disk folder to list inside, by its path; the top of the Disk without it. |
| `--cursor <cursor>` | go on from where the last page stopped; page.next_cursor gives it, with the same --folder. |

**Next usually:** `ydisk folders add <folder>`

**Example:** `ydisk personal folders browse`, `ydisk personal folders browse --folder /Work --json`

### `ydisk folders remove`

stop importing a folder; the next sync drops its documents

**Changes something on this computer only.**

```sh
ydisk folders remove <folder>
```

| Argument | | What it is |
|---|---|---|
| `folder` | required | Disk path to add, like /Documents; its id to remove. |

**Example:** `ydisk personal folders remove FOLDER_ID`

## `ydisk sync`

import what changed in the chosen folders, and finish an unfinished sync; one sync walks about 10000 entries under the chosen folders, saves where it stopped, and the next sync goes on from there

**Changes something on this computer only.**

```sh
ydisk sync [options]
```

| Option | What it does |
|---|---|
| `--limit <n>` | how many files to read from Yandex Disk in this run. Default: `200`. |
| `--rescan` | read every chosen folder again instead of only what changed; each --rescan starts the walk over, so run it once and continue with a plain sync. |
| `--embed` | also index pending text for meaning search, with a model already downloaded. |

**Example:** `ydisk personal sync`, `ydisk personal sync --rescan --limit 500`

## `ydisk status`

show the last sync, imported documents and pending work

```sh
ydisk status
```

**Example:** `ydisk personal status`

## `ydisk documents`

read the Yandex Disk files synced to this computer

### `ydisk documents list`

list the synced files with their Disk paths

```sh
ydisk documents list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many documents to return. Default: `50`. |
| `--page <n>` | which page to return. Default: `1`. |

**Next usually:** `ydisk documents show <document>`, `ydisk documents history <document>`, `ydisk documents context <document>`

**Example:** `ydisk personal documents list`, `ydisk personal documents list tag:budget`, `ydisk personal documents list person:PERSON_UID --limit 10`

### `ydisk documents show`

show an imported document's text, tabs and metadata

```sh
ydisk documents show <document>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | file id (resource_id) or a search hit's document: ref. |

**Example:** `ydisk personal documents show DOC_ID`, `ydisk personal documents show document:42 --offline`

### `ydisk documents export`

write an imported document to a new Markdown file

**Changes something on this computer only.**

```sh
ydisk documents export <document> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | file id (resource_id) or a search hit's document: ref. |

| Option | What it does |
|---|---|
| `--output <file>` | path of the Markdown file to write; an existing file is refused. |

**Example:** `ydisk personal documents export DOC_ID --output notes.md`

### `ydisk documents history`

list the versions of a document kept in the local copy, or show one with --revision

```sh
ydisk documents history <document> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | file id (resource_id) or a search hit's document: ref. |

| Option | What it does |
|---|---|
| `--revision <n>` | show the text of this version. |

**Example:** `ydisk personal documents history DOC_ID`, `ydisk personal documents history DOC_ID --revision 3`

### `ydisk documents context`

show a document with its tags, relationships, notes, memories and editors

```sh
ydisk documents context <document>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |

**Example:** `ydisk personal documents context DOC_ID`

## `ydisk changes`

list the documents the sync added, changed, removed or brought back, newest first

```sh
ydisk changes [options]
```

| Option | What it does |
|---|---|
| `--since <time>` | from this time: an ISO 8601 time, today, yesterday, or 30m, 2h, 1d ago. Default: `1d`. |
| `--until <time>` | up to this time, in the same forms. |
| `--event <events>` | only these, comma separated: added, changed, restored, deleted, unavailable, unsynced. |
| `--limit <n>` | how many changes to return. Default: `50`. |
| `--page <n>` | which page to return. Default: `1`. |

**Example:** `ydisk personal changes`, `ydisk personal changes --since 7d --event deleted,unavailable`

## `ydisk search`

search imported documents by words, and by meaning when indexed

```sh
ydisk search <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | words to look for, and fields such as tag: and date: that every hit must match. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many results to return. Default: `20`. |
| `--page <n>` | which page to return. Default: `1`. |
| `--exact` | match the words exactly: no word forms, no meaning. |

**Example:** `ydisk personal search budget`, `ydisk personal search "quarterly plan" --exact --limit 5`

## `ydisk catalog`

browse stored Yandex Disk files and folders offline

### `ydisk catalog import`

put cached file and folder metadata into the shared database

**Changes something on this computer only.**

```sh
ydisk catalog import
```

**Example:** `ydisk personal catalog import --offline`

### `ydisk catalog show`

show stored metadata and the stable file or folder reference

```sh
ydisk catalog show <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | Yandex Disk file or folder id, or its URL. |

**Next usually:** `ydisk documents show <document>`, `ydisk documents history <document>`, `ydisk documents context <document>`

**Example:** `ydisk personal catalog show FILE_ID --offline`

### `ydisk catalog list`

list cached files and folders using metadata queries

```sh
ydisk catalog list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | metadata query: kind, mime, name, parent, person, tag; AND, OR, NOT. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many entries to return (at most 1000). Default: `50`. |
| `--page <n>` | which page to return. Default: `1`. |

**Next usually:** `ydisk documents show <document>`, `ydisk documents history <document>`, `ydisk documents context <document>`

**Example:** `ydisk personal catalog list "parent:FOLDER_ID AND kind:file" --offline`

### `ydisk catalog search`

search cached names, descriptions, types and observed people

```sh
ydisk catalog search <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | metadata query: kind, mime, name, parent, person, tag; AND, OR, NOT. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many entries to return (at most 1000). Default: `50`. |
| `--page <n>` | which page to return. Default: `1`. |

**Next usually:** `ydisk documents show <document>`, `ydisk documents history <document>`, `ydisk documents context <document>`

**Example:** `ydisk personal catalog search "budget AND person:Rin*" --offline`

### `ydisk catalog tree`

show the cached hierarchy below a folder or all selected roots

```sh
ydisk catalog tree [folder] [options]
```

| Argument | | What it is |
|---|---|---|
| `folder` | optional | Yandex Disk folder id or URL; defaults to the explicitly selected profile's roots. |

| Option | What it does |
|---|---|
| `--depth <n>` | maximum descendant depth, from 0 to 50. Default: `5`. |

**Example:** `ydisk personal catalog tree --offline`, `ydisk personal catalog tree FOLDER_ID --depth 3 --offline`

### `ydisk catalog tags`

add owner tags to cached files or folders

#### `ydisk catalog tags list`

list local tags on a cached file or folder

```sh
ydisk catalog tags list <file> [query]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | Yandex Disk file or folder id, or its URL. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** document tag — tag; every field: ydisk commands info catalog tags list

**Example:** `ydisk personal catalog tags list FOLDER_ID --offline`

#### `ydisk catalog tags add`

add local tags on a cached file or folder

**Changes something on this computer only.**

```sh
ydisk catalog tags add <file> <tags>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | Yandex Disk file or folder id, or its URL. |
| `tags` | required | local tag names. |

**Example:** `ydisk personal catalog tags add FOLDER_ID project --offline`

#### `ydisk catalog tags remove`

remove local tags on a cached file or folder

**Changes something on this computer only.**

```sh
ydisk catalog tags remove <file> <tags>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | Yandex Disk file or folder id, or its URL. |
| `tags` | required | local tag names. |

**Example:** `ydisk personal catalog tags remove FOLDER_ID project --offline`

## `ydisk tags`

label imported documents; labels survive a sync

### `ydisk tags list`

list a document's tags

```sh
ydisk tags list <document> [query]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** document tag — tag; every field: ydisk commands info tags list

**Example:** `ydisk personal tags list DOC_ID`

### `ydisk tags add`

tag a document

**Changes something on this computer only.**

```sh
ydisk tags add <document> <tags>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `tags` | required | one or more tags. |

**Example:** `ydisk personal tags add DOC_ID budget q3`

### `ydisk tags remove`

untag a document

**Changes something on this computer only.**

```sh
ydisk tags remove <document> <tags>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `tags` | required | one or more tags. |

**Example:** `ydisk personal tags remove DOC_ID budget q3`

## `ydisk relationships`

connect a document to people, projects, notes and other references

### `ydisk relationships list`

list a document's relationships

```sh
ydisk relationships list <document> [query]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** document relationship — id, from, to, kind, role, confirmed, origin; every field: ydisk commands info relationships list

**Example:** `ydisk personal relationships list DOC_ID`

### `ydisk relationships add`

connect a document to another reference

**Changes something on this computer only.**

```sh
ydisk relationships add <document> <reference> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `reference` | required | what it connects to, such as person:<uid>, project:<id> or note:<id>. |

| Option | What it does |
|---|---|
| `--kind <kind>` | how the two relate. One of: `links-to`, `about`, `evidence`, `created-from`, `related-to`, `assigned-to`. Default: `related-to`. |
| `--role <role>` | the part the reference plays, in a word or two. |
| `--reason <text>` | why the two are connected. |

**Example:** `ydisk personal relationships add DOC_ID project:PROJECT_ID --kind about`, `ydisk personal relationships add DOC_ID person:PERSON_UID --kind assigned-to --role reviewer`

### `ydisk relationships remove`

remove one of a document's relationships

**Changes something on this computer only.**

```sh
ydisk relationships remove <document> <relationship-id>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `relationship-id` | required | id, as relationships list prints it. |

**Example:** `ydisk personal relationships remove DOC_ID LINK_ID`

## `ydisk notes`

write notes about an imported document

### `ydisk notes add`

write a note about a document

**Changes something on this computer only.**

```sh
ydisk notes add <document> <text> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `text` | required | the note's text. |

| Option | What it does |
|---|---|
| `--title <title>` | a title for the note. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more; every field: ydisk commands info notes add

**Next usually:** `ydisk notes show <document> <note>`, `ydisk notes edit <document> <note> <text>`, `ydisk notes remove <document> <note>`

**Example:** `ydisk personal notes add DOC_ID "Check the numbers" --title Review`

### `ydisk notes list`

list a document's notes

```sh
ydisk notes list <document> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many notes to return. Default: `50`. |
| `--page <n>` | which page to return. Default: `1`. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more; every field: ydisk commands info notes list

**Next usually:** `ydisk notes show <document> <note>`, `ydisk notes edit <document> <note> <text>`, `ydisk notes remove <document> <note>`

**Example:** `ydisk personal notes list DOC_ID`, `ydisk personal notes list DOC_ID text:review --limit 10`

### `ydisk notes show`

show one note

```sh
ydisk notes show <document> <note>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `note` | required | note:<id> reference, as notes list prints it. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more; every field: ydisk commands info notes show

**Next usually:** `ydisk notes edit <document> <note> <text>`, `ydisk notes remove <document> <note>`

**Example:** `ydisk personal notes show DOC_ID note:NOTE_ID`

### `ydisk notes edit`

replace a note's text

**Changes something on this computer only.**

```sh
ydisk notes edit <document> <note> <text> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `note` | required | note:<id> reference, as notes list prints it. |
| `text` | required | the note's new text. |

| Option | What it does |
|---|---|
| `--revision <n>` | revision from notes show; a newer note is not overwritten. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more; every field: ydisk commands info notes edit

**Next usually:** `ydisk notes show <document> <note>`, `ydisk notes remove <document> <note>`

**Example:** `ydisk personal notes edit DOC_ID note:NOTE_ID "Numbers checked" --revision 2`

### `ydisk notes remove`

delete one note

**Changes something on this computer only.**

```sh
ydisk notes remove <document> <note>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `note` | required | note:<id> reference, as notes list prints it. |

**Example:** `ydisk personal notes remove DOC_ID note:NOTE_ID`

## `ydisk memories`

keep what was learned from a document, with evidence; an agent's stay proposed

### `ydisk memories add`

record a memory about a document

**Changes something on this computer only.**

```sh
ydisk memories add <document> <text> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `text` | required | what to remember. |

| Option | What it does |
|---|---|
| `--scope <scope>` | whose memory it is: personal or work. One of: `personal`, `work`. |
| `--kind <kind>` | what kind of memory it is. One of: `summary`, `digest`, `preference`. Default: `summary`. |
| `--supersedes <ref>` | a memory:<id> about the same document that this one replaces. |

**Example:** `ydisk personal memories add DOC_ID "The team prefers async reviews" --scope work --kind preference`

### `ydisk memories list`

list a document's memories

```sh
ydisk memories list <document> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many memories to return. Default: `50`. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 13 more; every field: ydisk commands info memories list

**Example:** `ydisk personal memories list DOC_ID scope:work`, `ydisk personal memories list DOC_ID kind:preference status:confirmed`

### `ydisk memories show`

show one memory

```sh
ydisk memories show <document> <memory>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `memory` | required | memory:<id> reference, as memories list prints it. |

**Example:** `ydisk personal memories show DOC_ID memory:MEMORY_ID`

### `ydisk memories confirm`

confirm a proposed memory as true

**Changes something on this computer only.**

```sh
ydisk memories confirm <document> <memory>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `memory` | required | memory:<id> reference, as memories list prints it. |

**Example:** `ydisk personal memories confirm DOC_ID memory:MEMORY_ID`

### `ydisk memories stale`

mark a memory as out of date

**Changes something on this computer only.**

```sh
ydisk memories stale <document> <memory>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `memory` | required | memory:<id> reference, as memories list prints it. |

**Example:** `ydisk personal memories stale DOC_ID memory:MEMORY_ID`

### `ydisk memories search`

search a document's memories by words

```sh
ydisk memories search <document> <query>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `query` | required | words to look for, and scope:personal or scope:work — the fields are below. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 13 more; every field: ydisk commands info memories search

**Example:** `ydisk personal memories search DOC_ID reviews scope:work`, `ydisk personal memories search DOC_ID "async reviews"`

### `ydisk memories extract`

send a document's text to the model and show the memories it proposes

**Changes something in the service.**

```sh
ydisk memories extract <document> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |

| Option | What it does |
|---|---|
| `--scope <scope>` | whose memories they become: personal or work. One of: `personal`, `work`. |
| `--tab <id>` | send only this tab of the document. |
| `--yes` | save the proposals, each with its quote and the document's version. |

**Example:** `ydisk personal memories extract DOC_ID --scope work`, `ydisk personal memories extract DOC_ID --scope work --yes`

## `ydisk facts`

what happened, as a document shows it; an agent's stay proposed until confirmed

### `ydisk facts add`

record a fact a document shows

**Changes something on this computer only.**

```sh
ydisk facts add <document> <statement> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `statement` | required | the fact, in one sentence. |

| Option | What it does |
|---|---|
| `--type <type>` | what kind of fact it is. One of: `fact`, `statement`, `question`, `decision`, `promise`. Default: `fact`. |
| `--scope <scope>` | whose fact it is: personal or work. One of: `personal`, `work`. |
| `--supersedes <ref>` | a decision only: the decision this one replaces. |
| `--occurred-time <time>` | when it happened, as the evidence shows, ISO 8601; a time without a zone is read in this computer's zone, a date alone as its midnight. |

**Example:** `ydisk personal facts add DOC_ID "Budget approved" --type decision --scope work`

### `ydisk facts list`

list a document's facts

```sh
ydisk facts list <document> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many facts to return. Default: `50`. |

**Returns:** fact — ref, id, kind, text, status, project, subject, occurred_at, and 14 more; every field: ydisk commands info facts list

**Example:** `ydisk personal facts list DOC_ID status:proposed`, `ydisk personal facts list DOC_ID kind:decision`

### `ydisk facts show`

show one fact

```sh
ydisk facts show <document> <fact>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `fact` | required | fact:<id> reference, as facts list prints it. |

**Example:** `ydisk personal facts show DOC_ID fact:FACT_ID`

### `ydisk facts confirm`

confirm a proposed fact; a decision it supersedes stops holding

**Changes something on this computer only.**

```sh
ydisk facts confirm <document> <fact>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `fact` | required | fact:<id> reference, as facts list prints it. |

**Example:** `ydisk personal facts confirm DOC_ID fact:FACT_ID`

### `ydisk facts reverse`

an accepted decision no longer holds, and nothing replaced it

**Changes something on this computer only.**

```sh
ydisk facts reverse <document> <fact>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `fact` | required | fact:<id> reference, as facts list prints it. |

**Example:** `ydisk personal facts reverse DOC_ID fact:FACT_ID`

## `ydisk identities`

the Yandex Disk accounts seen on a document, and the people they belong to

### `ydisk identities list`

list the people Yandex Disk shows for a document

```sh
ydisk identities list <document> [query]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** document identity — remote_id, provider, role, person; every field: ydisk commands info identities list

**Example:** `ydisk personal identities list DOC_ID`

### `ydisk identities link`

record that a Yandex Disk account belongs to a known person

**Changes something on this computer only.**

```sh
ydisk identities link <document> <disk-id> <person>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Yandex Disk file or folder id or URL in the local catalog, or a document:<n> ref. |
| `disk-id` | required | Yandex Disk account id, as identities list prints it. |
| `person` | required | person:<uid> reference of someone already known. |

**Example:** `ydisk personal identities link DOC_ID DISK_ID person:PERSON_UID`

## `ydisk files`

the files on Yandex Disk, live: list, read, download, upload, change, serve

### `ydisk files list`

list what a Disk folder holds, live, a page at a time

```sh
ydisk files list [options]
```

| Option | What it does |
|---|---|
| `--folder <folder>` | the Disk folder to list, by its path; the top of the Disk without it. |
| `--cursor <cursor>` | go on from where the last page stopped; page.next_cursor gives it, with the same --folder. |

**Next usually:** `ydisk files show <path>`, `ydisk files download <path>`

**Example:** `ydisk personal files list`, `ydisk personal files list --folder /Documents --json`

### `ydisk files show`

show one file or folder on the Disk, live

```sh
ydisk files show <path>
```

| Argument | | What it is |
|---|---|---|
| `path` | required | Disk path, like /Documents/plan.pdf or disk:/Documents/plan.pdf. |

**Next usually:** `ydisk files download <path>`

**Example:** `ydisk personal files show /plan.pdf`

### `ydisk files download`

read a Disk file's text (PDF, docx, xlsx, CSV, TSV, text, Markdown), or with --output save the file itself; the token never goes to the download host. A text longer than 200,000 characters is cut there with truncated: true: never write a cut text back over the file, it would lose the rest

**Changes something on this computer only.**

```sh
ydisk files download <path> [options]
```

| Argument | | What it is |
|---|---|---|
| `path` | required | Disk path, like /Documents/plan.pdf or disk:/Documents/plan.pdf. |

| Option | What it does |
|---|---|
| `--output <file>` | save the file here instead of answering its text. |
| `--replace` | replace an existing output file. |

**Example:** `ydisk personal files download /notes.md --json`, `ydisk personal files download /plan.pdf --output ./plan.pdf`

### `ydisk files upload`

put a local file on the Disk; --replace replaces one already there and asks as files.delete does. Credential files, browser profiles and the WireCat folders are refused

**Changes something in the service.**

```sh
ydisk files upload <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | local file to upload. |

| Option | What it does |
|---|---|
| `--folder <folder>` | the Disk folder to put it in, by its path; the top of the Disk without it. |
| `--name <name>` | its name on the Disk; the local name without it. |
| `--replace` | replace a file already at that path. |
| `--allow-any-file` | send a file from a place that is otherwise refused. |

**Example:** `ydisk personal files upload ./plan.pdf --folder /Documents`

### `ydisk files copy`

copy a file or folder on the Disk into --folder, under --name or its own; --replace replaces what is there and asks as files.delete does

**Changes something in the service.**

```sh
ydisk files copy <path> [options]
```

| Argument | | What it is |
|---|---|---|
| `path` | required | Disk path, like /Documents/plan.pdf or disk:/Documents/plan.pdf. |

| Option | What it does |
|---|---|
| `--folder <folder>` | the Disk folder it goes into, by its path. |
| `--name <name>` | its name there; its own without it. |
| `--replace` | replace what is already there. |

**Example:** `ydisk personal files copy /plan.pdf --folder /Archive`

### `ydisk files move`

move a file or folder on the Disk into --folder, under --name or its own; --replace replaces what is there and asks as files.delete does

**Changes something in the service.**

```sh
ydisk files move <path> [options]
```

| Argument | | What it is |
|---|---|---|
| `path` | required | Disk path, like /Documents/plan.pdf or disk:/Documents/plan.pdf. |

| Option | What it does |
|---|---|
| `--folder <folder>` | the Disk folder it goes into, by its path. |
| `--name <name>` | its name there; its own without it. |
| `--replace` | replace what is already there. |

**Example:** `ydisk personal files move /plan.pdf --folder /Archive`

### `ydisk files create`

create a folder on the Disk at this path

**Changes something in the service.**

```sh
ydisk files create <path>
```

| Argument | | What it is |
|---|---|---|
| `path` | required | Disk path, like /Documents/plan.pdf or disk:/Documents/plan.pdf. |

**Example:** `ydisk personal files create /Documents/Reports`

### `ydisk files delete`

move a file or folder to the Disk's trash; files restore brings it back

**Changes something in the service.**

```sh
ydisk files delete <path>
```

| Argument | | What it is |
|---|---|---|
| `path` | required | Disk path, like /Documents/plan.pdf or disk:/Documents/plan.pdf. |

**Example:** `ydisk personal files delete /Documents/old.pdf`

### `ydisk files publish`

open a file or folder to anyone with its public link; asks as files.share does

**Changes something in the service.**

```sh
ydisk files publish <path>
```

| Argument | | What it is |
|---|---|---|
| `path` | required | Disk path, like /Documents/plan.pdf or disk:/Documents/plan.pdf. |

**Example:** `ydisk personal files publish /Documents/plan.pdf`

### `ydisk files unpublish`

close a file's or folder's public link; asks as files.share does

**Changes something in the service.**

```sh
ydisk files unpublish <path>
```

| Argument | | What it is |
|---|---|---|
| `path` | required | Disk path, like /Documents/plan.pdf or disk:/Documents/plan.pdf. |

**Example:** `ydisk personal files unpublish /Documents/plan.pdf`

### `ydisk files serve`

show a Disk folder, or the whole Disk, as a read-only folder on this computer: it serves the folder over WebDAV on 127.0.0.1 behind a random address, which the system's own client mounts; nothing can be written, renamed or deleted through it. Runs until Ctrl-C or --timeout

```sh
ydisk files serve [path] [options]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | the Disk folder to show, like /Documents; the whole Disk without it. |

| Option | What it does |
|---|---|
| `--port <port>` | the local port to serve on; a free one without it. |

**Example:** `ydisk personal files serve`, `ydisk personal files serve /Documents --port 8090`

### `ydisk files sheets`

the cells of an Excel workbook (.xlsx) on Yandex Disk, read and changed in place

#### `ydisk files sheets show`

show a workbook's stored cells, each with its value, type, formula and format, and the file's sha256 to pass as --expected-fingerprint to sheets update. Formulas show the value Excel saved last

```sh
ydisk files sheets show <path> [range]
```

| Argument | | What it is |
|---|---|---|
| `path` | required | the .xlsx file on Yandex Disk. |
| `range` | optional | the cells to show: Sheet1!A1:C10, a sheet's name, or A1:C10 on every sheet; all without it. |

**Example:** `ydisk personal files sheets show /budget.xlsx "Sheet1!A1:C10"`, `ydisk personal files sheets show /budget.xlsx`

#### `ydisk files sheets update`

write values into a workbook's cells in place: the rest of the file, its formatting and its other sheets stay as they are. It needs --expected-fingerprint from sheets show and asks as files.delete does; what it replaced is kept on this computer (see history). A text is written as text, even one that starts with =. A formula cell is refused unless --replace

**Changes something in the service.**

```sh
ydisk files sheets update <path> <range> [options]
```

| Argument | | What it is |
|---|---|---|
| `path` | required | the .xlsx file on Yandex Disk. |
| `range` | required | where the values go: Sheet1!B2:C3, or its first cell Sheet1!B2; the sheet may be left out when there is one. |

| Option | What it does |
|---|---|
| `--values <json>` | the cell values as JSON rows; null empties a cell. |
| `--expected-fingerprint <hash>` | the sha256 sheets show gave for the file. |
| `--replace` | replace a formula with the value instead of refusing it. |

**Example:** `ydisk personal files sheets update /budget.xlsx "Sheet1!B2:C2" --values '[[120, "paid"]]' --expected-fingerprint 9f86d081…`

#### `ydisk files sheets create`

create a new .xlsx on Yandex Disk from rows from A1: one sheet, or several given as [{name, rows, header?}]. Numbers and booleans are typed, a text stays text, even one that starts with =. A formula is only {"formula": "SUM(B2:B3)"}, computed when the file opens; {"value": "Total", "bold": true} is a bold cell and header: true makes a sheet's first row bold. A file already there is refused: change it with sheets update

**Changes something in the service.**

```sh
ydisk files sheets create <path> [options]
```

| Argument | | What it is |
|---|---|---|
| `path` | required | the new .xlsx file on Yandex Disk. |

| Option | What it does |
|---|---|
| `--values <json>` | the rows as JSON, or [{"name", "rows", "header"?}] for several sheets; a cell is a text, number, boolean, null (empty), {"formula": "…", "bold"?} or {"value": …, "bold"?}. |
| `--name <name>` | the sheet's name when --values is rows; Sheet1 without it. |

**Example:** `ydisk personal files sheets create /budget.xlsx --values '[["Item", "Cost"], ["Rent", 950]]' --name Budget`, `ydisk personal files sheets create /budget.xlsx --values '[{"name": "Budget", "header": true, "rows": [["Item", "Cost"], ["Rent", 950], ["Food", 300], [{"value": "Total", "bold": true}, {"formula": "SUM(B2:B3)"}]]}]'`

### `ydisk files documents`

the paragraphs of a Word document (.docx) on Yandex Disk, read and changed in place

#### `ydisk files documents show`

show a Word document's paragraphs by index, with their style, whether each can be edited and why not, and the file's sha256 to pass as --expected-fingerprint to documents update

```sh
ydisk files documents show <path>
```

| Argument | | What it is |
|---|---|---|
| `path` | required | the .docx file on Yandex Disk. |

**Example:** `ydisk personal files documents show /report.docx`

#### `ydisk files documents update`

replace, insert or delete a Word document's paragraphs in place; the rest of the file stays as it is. Indexes are the ones documents show gave. It needs --expected-fingerprint from documents show and asks as files.delete does; what it replaced is kept on this computer (see history). A paragraph that is not editable is refused with its reason, and a replaced one with mixed formatting takes its first run's

**Changes something in the service.**

```sh
ydisk files documents update <path> [options]
```

| Argument | | What it is |
|---|---|---|
| `path` | required | the .docx file on Yandex Disk. |

| Option | What it does |
|---|---|
| `--payload <json>` | the edits as JSON: {index, text}, {insert_after, text, style_from?} or {delete}. |
| `--expected-fingerprint <hash>` | the sha256 documents show gave for the file. |

**Example:** `ydisk personal files documents update /report.docx --payload '[{"index": 2, "text": "Revenue grew 12%."}]' --expected-fingerprint 9f86d081…`

#### `ydisk files documents create`

create a new .docx on Yandex Disk with these paragraphs, each in a style: Title, Heading1, Heading2, Heading3, Normal, ListBullet (Normal without one; ListBullet is a bullet list), and tables. A paragraph is bold or italic as a whole, or made of runs that each are; a table is rows of cell texts, its first row bold with header: true. A file already there is refused: change it with documents update

**Changes something in the service.**

```sh
ydisk files documents create <path> [options]
```

| Argument | | What it is |
|---|---|---|
| `path` | required | the new .docx file on Yandex Disk. |

| Option | What it does |
|---|---|
| `--payload <json>` | the body as JSON, in order: [{text, style?, bold?, italic?}, {runs: [{text, bold?, italic?}], style?}, {table: [[cell, …], …], header?}]. |

**Example:** `ydisk personal files documents create /report.docx --payload '[{"text": "Report", "style": "Title"}, {"text": "Revenue grew 12%."}]'`, `ydisk personal files documents create /report.docx --payload '[{"runs": [{"text": "Revenue "}, {"text": "grew 12%", "bold": true}]}, {"table": [["Item", "Cost"], ["Rent", "950"]], "header": true}]'`

### `ydisk files history`

list what the writes and syncs of this profile replaced in a file, newest last. Each entry's version is the sha256 of the content it replaced, kept on this computer while available is true; files restore puts it back

```sh
ydisk files history <path>
```

| Argument | | What it is |
|---|---|---|
| `path` | required | the file on Yandex Disk. |

**Example:** `ydisk personal files history /budget.xlsx`

### `ydisk files restore`

with no version, bring a file or folder back from Yandex Disk's trash. With one, put back a version history lists: it is written as files update writes, so a file there needs --expected-fingerprint, asks as files.delete does, and is kept first

**Changes something in the service.**

```sh
ydisk files restore <path> [version] [options]
```

| Argument | | What it is |
|---|---|---|
| `path` | required | the file on Yandex Disk, or its path in the trash. |
| `version` | optional | the version's sha256, from history. |

| Option | What it does |
|---|---|
| `--expected-fingerprint <hash>` | the sha256 the file has now; required when it exists. |

**Example:** `ydisk personal files restore /budget.xlsx 2c26b46b… --expected-fingerprint 9f86d081…`

### `ydisk files update`

replace a Yandex Disk file's text, or create a text file. A file already there is replaced only with --expected-fingerprint, the sha256 read from it; it asks as files.delete does. The file is checked just before the write, and what it replaced is kept on this computer. Write back only a whole plain-text file: a text cut with truncated: true would replace the whole file, and a .pdf, .docx or .xlsx is refused

**Changes something in the service.**

```sh
ydisk files update <path> [options]
```

| Argument | | What it is |
|---|---|---|
| `path` | required | the file on Yandex Disk. |

| Option | What it does |
|---|---|
| `--text <text>` | the file's new text; without it, the text is read from stdin. |
| `--expected-fingerprint <hash>` | the sha256 the file had when it was read; required when it exists. |

**Example:** `ydisk personal files update /notes.md --text "# Notes"`, `ydisk personal files update /notes.md --text "# Notes" --expected-fingerprint 9f86d081…`

## `ydisk mirrors`

keep local folders and Yandex Disk folders the same, both ways, file by file

### `ydisk mirrors add`

mirror a local folder and a Disk folder both ways: checks the Disk folder and saves the pair; nothing is copied until mirrors sync. / mirrors the whole Disk into a folder of its own

**Changes something on this computer only.**

```sh
ydisk mirrors add <folder> <path> [options]
```

| Argument | | What it is |
|---|---|---|
| `folder` | required | the Disk folder, by its path, like /Notes, or / for the whole Disk. |
| `path` | required | the local folder. |

| Option | What it does |
|---|---|
| `--ignore <path>` | leave this path out on both sides, a path or a glob; repeat it for more: a name at any depth (node_modules, *.iso) or a path from the mirror's root (/Photos). |

**Example:** `ydisk personal mirrors add /Notes ./notes`, `ydisk personal mirrors add / ~/YandexDisk --ignore Photos --ignore "*.iso"`

### `ydisk mirrors list`

list this profile's mirrors

```sh
ydisk mirrors list
```

**Example:** `ydisk personal mirrors list --json`

### `ydisk mirrors status`

show which local files the next sync would send or delete on Yandex Disk; the Disk is not asked

```sh
ydisk mirrors status [id]
```

| Argument | | What it is |
|---|---|---|
| `id` | optional | mirror id from mirrors list; every mirror of the profile when omitted. |

**Example:** `ydisk personal mirrors status --json`

### `ydisk mirrors preview`

list the Disk and show what mirrors sync would do: each upload, download, merge, rename, trash and conflict; nothing is changed on either side

```sh
ydisk mirrors preview [id] [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | optional | mirror id from mirrors list; every mirror of the profile when omitted. |

| Option | What it does |
|---|---|
| `--keep <side>` | settle each conflict: keep the local file, the Disk's, or both. One of: `local`, `disk`, `both`. |

**Example:** `ydisk personal mirrors preview --json`, `ydisk personal mirrors preview 1a2b3c4d --keep disk`

### `ydisk mirrors sync`

sync mirrors both ways once: a change on one side is copied to the other, a deletion goes to the other side's trash, a text file changed on both sides in different places is merged, and any other file changed on both sides is reported for mirrors conflicts or --keep; mirrors preview shows the plan first. A run stops before its deadline, keeps what it did, and the next sync goes on from there

**Changes something in the service.**

```sh
ydisk mirrors sync [id] [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | optional | mirror id from mirrors list; every mirror of the profile when omitted. |

| Option | What it does |
|---|---|
| `--keep <side>` | settle each conflict: keep the local file, the Disk's, or both. One of: `local`, `disk`, `both`. |
| `--allow-deletions <count>` | let this run delete up to this many files when the guard stops it. |
| `--allow-replacements <count>` | let this run overwrite up to this many existing files when the guard stops it; each is kept as a version first. |
| `--replace` | let this run overwrite any number of existing files when the guard stops it; each is kept as a version first. |
| `--repin` | the Disk or local folder was replaced and the new one is right: record it and sync. |

**Example:** `ydisk personal mirrors sync`, `ydisk personal mirrors sync 1a2b3c4d --keep disk`

### `ydisk mirrors watch`

keep syncing both ways until Ctrl-C or --timeout: on each local save, and when the Disk's revision moves; a file changed on both sides that cannot be merged is reported for mirrors conflicts

**Changes something in the service.**

```sh
ydisk mirrors watch [id] [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | optional | mirror id from mirrors list; every mirror of the profile when omitted. |

| Option | What it does |
|---|---|
| `--every <duration>` | how often to ask Yandex Disk whether anything changed. Default: `60s`. |

**Example:** `ydisk personal mirrors watch`, `ydisk personal mirrors watch 1a2b3c4d --every 2m --jsonl`

### `ydisk mirrors update`

add paths to what a mirror ignores, as mirrors list shows it. --clear empties the list first, so --clear with --ignore keeps only the paths given: that is how one path stops being ignored. An ignored path is left alone on both sides and never deleted, now or later; one no longer ignored is synced as a new folder, copying one-sided files and reporting different ones as conflicts, deleting nothing

**Changes something on this computer only.**

```sh
ydisk mirrors update <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | mirror id from mirrors list. |

| Option | What it does |
|---|---|
| `--ignore <path>` | leave this path out on both sides, a path or a glob; repeat it for more: a name at any depth (node_modules, *.iso) or a path from the mirror's root (/Photos). |
| `--clear` | empty the list before adding any --ignore paths; alone, sync every path again. |

**Example:** `ydisk personal mirrors update 1a2b3c4d --ignore Photos --ignore "*.iso"`, `ydisk personal mirrors update 1a2b3c4d --clear --ignore Photos`

### `ydisk mirrors remove`

stop mirroring a folder: nothing on Yandex Disk or in the local folder is changed; its kept versions stay

**Changes something on this computer only.**

```sh
ydisk mirrors remove <id>
```

| Argument | | What it is |
|---|---|---|
| `id` | required | mirror id from mirrors list. |

**Example:** `ydisk personal mirrors remove 1a2b3c4d`

### `ydisk mirrors versions`

the versions of a mirrored file that syncs replaced or deleted, kept on this computer

#### `ydisk mirrors versions list`

list what syncs did to a mirrored file, oldest first, and which versions are still kept

```sh
ydisk mirrors versions list <id> <path>
```

| Argument | | What it is |
|---|---|---|
| `id` | required | mirror id from mirrors list. |
| `path` | required | the file's path inside the mirror, like notes/plan.md. |

**Example:** `ydisk personal mirrors versions list 1a2b3c4d notes/plan.md --json`

#### `ydisk mirrors versions restore`

put a kept version back into the local folder; the file there now is kept first, and the next mirrors sync sends the restored one to the Disk

**Changes something on this computer only.**

```sh
ydisk mirrors versions restore <id> <path> <sha256>
```

| Argument | | What it is |
|---|---|---|
| `id` | required | mirror id from mirrors list. |
| `path` | required | the file's path inside the mirror, like notes/plan.md. |
| `sha256` | required | the version's hash, old or new in mirrors versions list. |

**Example:** `ydisk personal mirrors versions restore 1a2b3c4d notes/plan.md 9f86d081…`

### `ydisk mirrors conflicts`

files changed on both sides that a sync could not merge: list them, show the three versions and the lines that conflict, and resolve each by keeping a side or giving the final file

#### `ydisk mirrors conflicts list`

list the conflicts each mirror's last sync left, with why and when it found them

```sh
ydisk mirrors conflicts list [id]
```

| Argument | | What it is |
|---|---|---|
| `id` | optional | mirror id from mirrors list; every mirror of the profile when omitted. |

**Example:** `ydisk personal mirrors conflicts list --json`

#### `ydisk mirrors conflicts show`

show a conflict's three versions (the last sync's, the local and the remote) and each changed stretch of the line merge; merged is the whole file with conflict markers, a start for resolve --file

```sh
ydisk mirrors conflicts show <id> <path>
```

| Argument | | What it is |
|---|---|---|
| `id` | required | mirror id from mirrors list. |
| `path` | required | the file's path inside the mirror, like notes/plan.md. |

**Example:** `ydisk personal mirrors conflicts show 1a2b3c4d notes/plan.md --json`

#### `ydisk mirrors conflicts resolve`

settle a conflict on both sides at once: keep the local file, the disk's, or both (the disk's beside the local one), or give the final file. Refused with nothing written when either side changed since the conflict was found; every replaced version is kept

**Changes something in the service.**

```sh
ydisk mirrors conflicts resolve <id> <path> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | mirror id from mirrors list. |
| `path` | required | the file's path inside the mirror, like notes/plan.md. |

| Option | What it does |
|---|---|
| `--keep <side>` | keep the local file, the disk's, or both. One of: `local`, `disk`, `both`. |
| `--file <file>` | the final content, written to both sides. |

**Example:** `ydisk personal mirrors conflicts resolve 1a2b3c4d notes/plan.md --keep disk`, `ydisk personal mirrors conflicts resolve 1a2b3c4d notes/plan.md --file ~/plan-final.md`

## `ydisk store`

the shared local store every WireCat tool reads

### `ydisk store info`

the store file: where it is, its size, its schema against the one this tool speaks, which tools used it and how many rows it holds, by provider, chat kind, account, year (UTC) and attachment kind, over every account; changes nothing

```sh
ydisk store info
```

**Returns:** store info — path, exists, schema, opens, error, bytes, journal_mode, pages, and 12 more; every field: ydisk commands info store info

**Example:** `ydisk personal store info --json`

## `ydisk api`

the raw Yandex Disk API, one command per operation of its OpenAPI document

### `ydisk api list`

list every Yandex Disk API operation this CLI offers, without calling Yandex Disk

```sh
ydisk api list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Example:** `ydisk personal api list`, `ydisk personal api list effect:destructive --json=command,path`

### `ydisk api show`

show one operation's parameters and request schema, without calling Yandex Disk

```sh
ydisk api show <operation>
```

| Argument | | What it is |
|---|---|---|
| `operation` | required | the operation as api list prints it (quoted), its old name, or its operation id. |

**Example:** `ydisk personal api show "disk-get" --json`

### `ydisk api disk-get`

Получить метаинформацию о диске пользователя — read (GET /v1/disk)

```sh
ydisk api disk-get [options]
```

| Option | What it does |
|---|---|
| `--extra-fields <value>` | Дополнительные поля, которые нужно вернуть. |
| `--fields <value>` | Список возвращаемых атрибутов. |

**Example:** `ydisk personal api disk-get`

### `ydisk api resources-list`

Получить метаинформацию о файле или каталоге — read (GET /v1/disk/resources)

```sh
ydisk api resources-list [options]
```

| Option | What it does |
|---|---|
| `--path <value>` | Путь к ресурсу. |
| `--fields <value>` | Список возвращаемых атрибутов. |
| `--limit <value>` | Количество выводимых вложенных ресурсов. |
| `--offset <value>` | Смещение от начала списка вложенных ресурсов. |
| `--preview-crop <value>` | Разрешить обрезку превью. |
| `--preview-size <value>` | Размер превью. |
| `--sort <value>` | Поле для сортировки вложенных ресурсов. |
| `--all` | read every page, as the API pages it. |

**Example:** `ydisk personal api resources-list --path <value>`

### `ydisk api resources-create`

Создать каталог — write (PUT /v1/disk/resources)

**Changes something in the service.**

```sh
ydisk api resources-create [options]
```

| Option | What it does |
|---|---|
| `--path <value>` | Путь к создаваемой папке. |
| `--fields <value>` | Список возвращаемых атрибутов. |

**Example:** `ydisk personal api resources-create --path <value>`

### `ydisk api resources-update`

Обновить пользовательские данные ресурса — write (PATCH /v1/disk/resources)

**Changes something in the service.**

```sh
ydisk api resources-update [options]
```

| Option | What it does |
|---|---|
| `--path <value>` | Путь к обновляемому ресурсу. |
| `--fields <value>` | Список возвращаемых атрибутов. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `ydisk personal api resources-update --path <value>`

### `ydisk api resources-delete`

Удалить файл или папку — destructive (DELETE /v1/disk/resources)

**Changes something in the service.**

```sh
ydisk api resources-delete [options]
```

| Option | What it does |
|---|---|
| `--path <value>` | Путь к файлу или папке. |
| `--fields <value>` | Список возвращаемых атрибутов. |
| `--force-async <value>` | Выполнить асинхронно. |
| `--md5 <value>` | md5 удаляемого файла. |
| `--permanently <value>` | Удалить ресурс не помещая в Корзину. |

**Example:** `ydisk personal api resources-delete --path <value>`

### `ydisk api resources-copy`

Создать копию файла или папки — write (POST /v1/disk/resources/copy)

**Changes something in the service.**

```sh
ydisk api resources-copy [options]
```

| Option | What it does |
|---|---|
| `--from <value>` | Путь к копируемому ресурсу. |
| `--path <value>` | Путь к создаваемому ресурсу. |
| `--fields <value>` | Список возвращаемых атрибутов. |
| `--force-async <value>` | Выполнить асинхронно. |
| `--overwrite <value>` | Перезаписать существующий ресурс. |

**Example:** `ydisk personal api resources-copy --from <value> --path <value>`

### `ydisk api resources-files-list`

Получить список файлов упорядоченный по имени — read (GET /v1/disk/resources/files)

```sh
ydisk api resources-files-list [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Список возвращаемых атрибутов. |
| `--limit <value>` | Количество последних загруженных файлов в ответе. |
| `--media-type <value>` | Фильтр по медиа типу. Несколько типов перечисляются через запятую. |
| `--offset <value>` | Смещение от начала списка вложенных ресурсов. |
| `--preview-crop <value>` | Разрешить обрезку превью. |
| `--preview-size <value>` | Размер превью. |
| `--sort <value>` | Поле для сортировки ресурсов. |
| `--all` | read every page, as the API pages it. |

**Example:** `ydisk personal api resources-files-list`

### `ydisk api resources-last-uploaded-list`

Получить список файлов упорядоченный по дате загрузки — read (GET /v1/disk/resources/last-uploaded)

```sh
ydisk api resources-last-uploaded-list [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Список возвращаемых атрибутов. |
| `--limit <value>` | Количество последних загруженных файлов в ответе. |
| `--media-type <value>` | Фильтр по медиа типу. Несколько типов перечисляются через запятую. |
| `--preview-crop <value>` | Разрешить обрезку превью. |
| `--preview-size <value>` | Размер превью. |

**Example:** `ydisk personal api resources-last-uploaded-list`

### `ydisk api resources-move`

Переместить файл или папку — write (POST /v1/disk/resources/move)

**Changes something in the service.**

```sh
ydisk api resources-move [options]
```

| Option | What it does |
|---|---|
| `--from <value>` | Путь к перемещаемому ресурсу. |
| `--path <value>` | Путь к создаваемому ресурсу. |
| `--fields <value>` | Список возвращаемых атрибутов. |
| `--force-async <value>` | Выполнить асинхронно. |
| `--overwrite <value>` | Перезаписать существующий ресурс. |

**Example:** `ydisk personal api resources-move --from <value> --path <value>`

### `ydisk api resources-public-list`

Получить список опубликованных ресурсов — read (GET /v1/disk/resources/public)

```sh
ydisk api resources-public-list [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Список возвращаемых атрибутов. |
| `--limit <value>` | Количество выводимых ресурсов. |
| `--offset <value>` | Смещение от начала списка ресурсов. |
| `--preview-crop <value>` | Разрешить обрезку превью. |
| `--preview-size <value>` | Размер превью. |
| `--type <value>` | Фильтр по типам ресурсов. |
| `--all` | read every page, as the API pages it. |

**Example:** `ydisk personal api resources-public-list`

### `ydisk api resources-publish`

Опубликовать ресурс — write (PUT /v1/disk/resources/publish)

**Changes something in the service.**

```sh
ydisk api resources-publish [options]
```

| Option | What it does |
|---|---|
| `--path <value>` | Путь к публикуемому ресурсу. |
| `--allow-address-access <value>` | Возможность клиента обрабатывать ответы от адресного доступа. |
| `--fields <value>` | Список возвращаемых атрибутов. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `ydisk personal api resources-publish --path <value>`

### `ydisk api resources-unpublish`

Отменить публикацию ресурса — write (PUT /v1/disk/resources/unpublish)

**Changes something in the service.**

```sh
ydisk api resources-unpublish [options]
```

| Option | What it does |
|---|---|
| `--path <value>` | Путь к ресурсу. |
| `--fields <value>` | Список возвращаемых атрибутов. |

**Example:** `ydisk personal api resources-unpublish --path <value>`

### `ydisk api resources-upload-url`

Загрузить файл в Диск по URL — write (POST /v1/disk/resources/upload)

**Changes something in the service.**

```sh
ydisk api resources-upload-url [options]
```

| Option | What it does |
|---|---|
| `--path <value>` | Путь, куда будет помещен ресурс. |
| `--url <value>` | URL внешнего ресурса, который следует загрузить. |
| `--disable-redirects <value>` | Запретить делать редиректы. |
| `--fields <value>` | Список возвращаемых атрибутов. |

**Example:** `ydisk personal api resources-upload-url --path <value> --url <value>`

### `ydisk api public-resources-get`

Получить метаинформацию о публичном файле или каталоге — read (GET /v1/disk/public/resources)

```sh
ydisk api public-resources-get [options]
```

| Option | What it does |
|---|---|
| `--public-key <value>` | Ключ или публичный URL ресурса. |
| `--fields <value>` | Список возвращаемых атрибутов. |
| `--limit <value>` | Количество выводимых вложенных ресурсов. |
| `--offset <value>` | Смещение от начала списка вложенных ресурсов. |
| `--path <value>` | Путь к ресурсу в публичной папке. |
| `--preview-crop <value>` | Разрешить обрезку превью. |
| `--preview-size <value>` | Размер превью. |
| `--sort <value>` | Поле для сортировки вложенных ресурсов. |
| `--all` | read every page, as the API pages it. |

**Example:** `ydisk personal api public-resources-get --public-key <value>`

### `ydisk api public-settings-update`

Обновить настройки публичных ссылок — write (PATCH /v1/disk/public/resources/public-settings)

**Changes something in the service.**

```sh
ydisk api public-settings-update [options]
```

| Option | What it does |
|---|---|
| `--path <value>` | Путь к ресурсу. |
| `--fields <value>` | Список возвращаемых атрибутов. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `ydisk personal api public-settings-update --path <value>`

### `ydisk api public-resources-save-to-disk`

Сохранить публичный ресурс в папку Загрузки — write (POST /v1/disk/public/resources/save-to-disk)

**Changes something in the service.**

```sh
ydisk api public-resources-save-to-disk [options]
```

| Option | What it does |
|---|---|
| `--public-key <value>` | Ключ или публичный URL ресурса. |
| `--fields <value>` | Список возвращаемых атрибутов. |
| `--force-async <value>` | Выполнить асинхронно. |
| `--name <value>` | Имя, под которым ресурс будет сохранен в папке. |
| `--path <value>` | Путь к копируемому ресурсу в публичной папке. |
| `--save-path <value>` | Путь к папке, в которую будет сохранен ресурс. По умолчанию «Загрузки». |

**Example:** `ydisk personal api public-resources-save-to-disk --public-key <value>`

### `ydisk api trash-resources-list`

Получить содержимое Корзины — read (GET /v1/disk/trash/resources)

```sh
ydisk api trash-resources-list [options]
```

| Option | What it does |
|---|---|
| `--path <value>` | Путь к ресурсу в Корзине. |
| `--apply-photoslice-filter <value>` | Требуется ли отдавать только фотосрез. |
| `--fields <value>` | Список возвращаемых атрибутов. |
| `--limit <value>` | Количество выводимых вложенных ресурсов. |
| `--offset <value>` | Смещение от начала списка вложенных ресурсов. |
| `--preview-crop <value>` | Разрешить обрезку превью. |
| `--preview-size <value>` | Размер превью. |
| `--sort <value>` | Поле для сортировки вложенных ресурсов. |
| `--all` | read every page, as the API pages it. |

**Example:** `ydisk personal api trash-resources-list --path <value>`

### `ydisk api trash-resources-delete`

Очистить Корзину — destructive (DELETE /v1/disk/trash/resources)

**Changes something in the service.**

```sh
ydisk api trash-resources-delete [options]
```

| Option | What it does |
|---|---|
| `--apply-photoslice-filter <value>` | Требуется ли удалять только файлы фотосреза. |
| `--fields <value>` | Список возвращаемых атрибутов. |
| `--force-async <value>` | Выполнить асинхронно. |
| `--path <value>` | Путь к ресурсу в Корзине. |

**Example:** `ydisk personal api trash-resources-delete`

### `ydisk api trash-resources-restore`

Восстановить ресурс из Корзины — write (PUT /v1/disk/trash/resources/restore)

**Changes something in the service.**

```sh
ydisk api trash-resources-restore [options]
```

| Option | What it does |
|---|---|
| `--path <value>` | Путь к ресурсу в Корзине. |
| `--fields <value>` | Список возвращаемых атрибутов. |
| `--force-async <value>` | Выполнить асинхронно. |
| `--name <value>` | Имя, под которым будет восстановлен ресурс. |
| `--overwrite <value>` | Перезаписать существующий ресурс восстанавливаемым. |

**Example:** `ydisk personal api trash-resources-restore --path <value>`

### `ydisk api operations-get`

Получить статус асинхронной операции — read (GET /v1/disk/operations/{operation_id})

```sh
ydisk api operations-get [options]
```

| Option | What it does |
|---|---|
| `--operation-id <value>` | Идентификатор операции. |
| `--fields <value>` | Список возвращаемых атрибутов. |

**Example:** `ydisk personal api operations-get --operation-id <value>`

## `ydisk doctor`

the state this installation is in, without connecting unless --online

```sh
ydisk doctor [options]
```

| Option | What it does |
|---|---|
| `--online` | also connect once and read the account; sends nothing. |

**Example:** `ydisk doctor`, `ydisk doctor --json`

### `ydisk doctor reports`

problem reports

#### `ydisk doctor reports show`

what a problem report holds; writes nothing

```sh
ydisk doctor reports show
```

**Example:** `ydisk doctor reports show`

#### `ydisk doctor reports create`

write a problem report to a file, and say where to send it

**Changes something on this computer only.**

```sh
ydisk doctor reports create [options]
```

| Option | What it does |
|---|---|
| `--run <id>` | the run the report is about; the newest failed one if not given. |
| `--output <file>` | where to write it; a new file in this directory if not given. |

**Example:** `ydisk doctor reports create --output ./problem-report.json`

## `ydisk skill`

the instructions an agent is given for this tool

### `ydisk skill show`

print SKILL.md — `ydisk skill install` puts it where Claude Code, Codex, Gemini CLI and OpenClaw look for it, and where Hermes does on request; --for prints the copy already there

```sh
ydisk skill show [name] [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | optional | a part of this skill, or a skill shipped for a task: api-disk, api-disk-trash-resources, api-disk-resources, api-disk-public-resources, api-disk-operations-operation-id, api. |

| Option | What it does |
|---|---|
| `--for <agents>` | print the copy installed for these agents instead of this version's. One of: `claude`, `agents`. |

**Example:** `ydisk skill show`

### `ydisk skill install`

write SKILL.md to \~/.claude/skills/yandex-disk-cli/ (Claude Code) and \~/.agents/skills/yandex-disk-cli/ (Codex, Gemini CLI, OpenClaw); --for hermes also has Hermes read \~/.agents/skills, which changes Hermes's own settings, so all leaves it out

**Changes something on this computer only.**

```sh
ydisk skill install [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `hermes`, `all`. Default: `all`. |

**Example:** `ydisk skill install --for agents`

### `ydisk skill status`

for each place `ydisk skill install` writes to, and for the copy Hermes reads: the path, the version installed there, and whether it is current, stale, missing or unversioned

```sh
ydisk skill status
```

**Example:** `ydisk skill status`, `ydisk skill status --json`

## `ydisk mcp`

serve this profile to an agent over MCP and set it up — `claude mcp add ydisk -- ydisk <profile> mcp serve`

### `ydisk mcp serve`

serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add ydisk -- ydisk <profile> mcp serve`; `ydisk mcp serve --profiles a,b` or `--profiles all` serves those profiles from one server and each tool asks which

**Changes something in the service.**

```sh
ydisk mcp serve [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like files.delete=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |
| `--http` | serve over HTTP on 127.0.0.1 for ChatGPT and Claude in the browser, behind your tunnel; the profile's permissions decide. |
| `--port <port>` | the local port for --http (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |

**Example:** `ydisk personal mcp serve`, `ydisk mcp serve --profiles work,personal`, `ydisk personal mcp serve --http --public-url https://laptop.example.ts.net`

### `ydisk mcp revoke`

forget every login `mcp serve --http` gave a browser app, of this profile or of the server `--profiles` names; each app must log in again

**Changes something on this computer only.**

```sh
ydisk mcp revoke [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `ydisk personal mcp revoke`, `ydisk mcp revoke --profiles all`

### `ydisk mcp server`

start, stop and check `mcp serve --http` in the background; status shows the login code for a browser app

#### `ydisk mcp server start`

start `mcp serve --http` apart from this shell and answer once it listens, with its login code

**Changes something on this computer only.**

```sh
ydisk mcp server start [options]
```

| Option | What it does |
|---|---|
| `--port <port>` | the local port (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |
| `--permission <key=level>` | make a permission stricter for this server only; repeat for more keys. |
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `ydisk personal mcp server start --public-url https://laptop.example.ts.net`

#### `ydisk mcp server stop`

stop `mcp serve --http` — only one that `mcp server start` started

**Changes something on this computer only.**

```sh
ydisk mcp server stop [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `ydisk personal mcp server stop`

#### `ydisk mcp server status`

whether `mcp serve --http` runs, on which port and address, the login code for a new browser app, and the apps logged in

```sh
ydisk mcp server status [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `ydisk personal mcp server status --json`

### `ydisk mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
ydisk mcp config [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like files.delete=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `ydisk personal mcp config`, `ydisk mcp config --profiles all`

### `ydisk mcp add`

add this profile's local MCP server to Codex or Claude Code

**Changes something on this computer only.**

```sh
ydisk mcp add <client> [options]
```

| Argument | | What it is |
|---|---|---|
| `client` | required | codex or claude-code. |

| Option | What it does |
|---|---|
| `--allow-writes` | acknowledge that this profile offers writing tools. |
| `--permission <key=level>` | make a permission stricter for this server only, like files.delete=deny; it never loosens the profile; repeat for more keys. |

**Example:** `ydisk personal mcp add codex --allow-writes`

### `ydisk mcp check`

check this profile's local MCP handshake and tool list

```sh
ydisk mcp check [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like files.delete=deny; it never loosens the profile; repeat for more keys. |

**Example:** `ydisk personal mcp check`

## `ydisk upgrade`

upgrade ydisk with the package manager that installed it; --check only looks

**Changes something on this computer only.**

```sh
ydisk upgrade [options]
```

| Option | What it does |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |

**Example:** `ydisk upgrade --check`

## `ydisk config`

the settings in force, and where each one came from

### `ydisk config show`

the profile, the profiles that exist, and each setting with where it came from

```sh
ydisk config show
```

**Example:** `ydisk personal config show`

### `ydisk config set`

save a setting to the configuration file

**Changes something on this computer only.**

```sh
ydisk config set <setting> <value> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, keep_versions_for_days, read_scans, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities, crm.<provider>:<account>.files.max_files, crm.<provider>:<account>.files.max_file_mb, crm.<provider>:<account>.files.max_run_mb, crm.<provider>:<account>.files.run_minutes, crm.<provider>:<account>.files.days, crm.<provider>:<account>.files.max_total_mb. |
| `value` | required | a number, true or false; for a group tg:work,max:Alice,email:me@x. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Example:** `ydisk personal config set limit 20`

### `ydisk config unset`

remove a setting from the configuration file

**Changes something on this computer only.**

```sh
ydisk config unset <setting> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, keep_versions_for_days, read_scans, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities, crm.<provider>:<account>.files.max_files, crm.<provider>:<account>.files.max_file_mb, crm.<provider>:<account>.files.max_run_mb, crm.<provider>:<account>.files.run_minutes, crm.<provider>:<account>.files.days, crm.<provider>:<account>.files.max_total_mb. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Example:** `ydisk personal config unset limit`

### `ydisk config migrate`

write each setting the file lacks at its default, keeping yours

**Changes something on this computer only.**

```sh
ydisk config migrate
```

**Example:** `ydisk config migrate`

### `ydisk config repair`

fix broken JSON syntax in the settings file — comments, a missing or extra comma, unquoted keys, single quotes, missing closing brackets at the end — keeping every value, with a backup beside it; refuses anything with more than one reading and changes nothing then

**Changes something on this computer only.**

```sh
ydisk config repair [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | say what it would fix, and change nothing. |

**Example:** `ydisk config repair`, `ydisk config repair --dry-run`

## `ydisk runs`

recorded runs — what this tool did, and when

### `ydisk runs list`

recorded runs, newest first

```sh
ydisk runs list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |

**Returns:** run — run_id, command, started_at, status, cli_version, profile, completed_at, requests, and 23 more; every field: ydisk commands info runs list

**Example:** `ydisk personal runs list --limit 10`

### `ydisk runs show`

one run: what it was, how it ended, and every event it logged

```sh
ydisk runs show <run-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `ydisk runs list`. |

| Option | What it does |
|---|---|
| `--problems` | only failed responses, warnings and crashes. |

**Returns:** run details — run_id, command, started_at, status, cli_version, directory, event_count, events, and 22 more; every field: ydisk commands info runs show

**Example:** `ydisk personal runs show run-101`

### `ydisk runs path`

the directory holding one run

```sh
ydisk runs path <run-id>
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `ydisk runs list`. |

**Returns:** run location — path; every field: ydisk commands info runs path

**Example:** `ydisk personal runs path run-101`

## Коды выхода

Ориентируйтесь на код, а не на текст: текст может измениться, код нет.

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
