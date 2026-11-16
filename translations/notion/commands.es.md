---
title: "Comandos"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Todos los comandos, opciones y códigos de salida, generados a partir del propio programa. Para obtener la misma lista en
JSON, ejecuta `notion commands --json`. Las descripciones conservan el idioma de la ayuda.

**La primera palabra es el perfil**, un nombre que eliges tú: `notion personal config show`. `WCNOTION_PROFILE`
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

## `notion commands`

every command by section; --json prints its contract, one path per call

### `notion commands info`

one command contract, or all schemas, error reasons and explicit overrides

```sh
notion commands info [path]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | one command path; without one, export schemas, error reasons and explicit overrides. |

**Example:** `notion commands info commands`

## `notion session`

keep this profile's Notion token in the OS keyring

### `notion session start`

sign this profile in: a Notion personal access token, which acts with your own rights, or an internal connection's token, which sees only the pages shared with that connection. It is asked hidden or read from stdin, never taken as an argument, checked with Notion, and only then kept in the keyring, or in a private file

**Changes something on this computer only.**

```sh
notion session start [options]
```

| Option | What it does |
|---|---|
| `--credential-storage <storage>` | where the token is kept: keyring, which falls back to a private file by itself, or file. Default: `keyring`. |

**Example:** `notion personal session start`, `notion personal session start --credential-storage file`

### `notion session status`

show where this profile's token comes from: WCNOTION_TOKEN, the keyring or a file, never the token; --check asks Notion whose token it is

```sh
notion session status [options]
```

| Option | What it does |
|---|---|
| `--check` | ask Notion whether the token still works, and whose it is. |

**Example:** `notion personal session status`, `notion personal session status --check --json`

### `notion session end`

forget this profile's token on this computer; the token itself stays valid in Notion. Only this tool's own entry goes: Notion's own CLI keeps its tokens under the same keyring name, and they stay

**Changes something on this computer only.**

```sh
notion session end
```

**Example:** `notion personal session end`

### `notion session list`

list the profiles on this computer and whether each has a token; picks none

```sh
notion session list
```

**Example:** `notion session list`, `notion session list --json`

## `notion folders`

choose the Notion pages and databases sync copies; none chosen copies everything the token sees

### `notion folders add`

import a folder and everything under it on the next sync

**Changes something on this computer only.**

```sh
notion folders add <folder>
```

| Argument | | What it is |
|---|---|---|
| `folder` | required | page or database id, or its Notion link. |

**Example:** `notion personal folders add FOLDER_ID`

### `notion folders list`

list the folder ids sync imports

```sh
notion folders list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** selected folder — id; every field: notion commands info folders list

**Example:** `notion personal folders list`

### `notion folders browse`

list Notion pages and databases one level at a time, live, to choose one for folders add

```sh
notion folders browse [options]
```

| Option | What it does |
|---|---|
| `--parent <id>` | page id or Notion link to list inside; the top of the workspace without it. |

**Returns:** notion folder — id, name, kind, url, chosen; every field: notion commands info folders browse

**Example:** `notion personal folders browse`, `notion personal folders browse --parent PAGE_ID --json`

### `notion folders remove`

stop importing a folder; the next sync drops its documents

**Changes something on this computer only.**

```sh
notion folders remove <folder>
```

| Argument | | What it is |
|---|---|---|
| `folder` | required | page or database id, or its Notion link. |

**Example:** `notion personal folders remove FOLDER_ID`

## `notion sync`

import what changed in the chosen folders, and finish an unfinished sync; one sync walks about 10000 entries under the chosen folders, saves where it stopped, and the next sync goes on from there

**Changes something on this computer only.**

```sh
notion sync [options]
```

| Option | What it does |
|---|---|
| `--limit <n>` | how many pages to read from Notion in this run. Default: `200`. |
| `--rescan` | read every chosen folder again instead of only what changed; each --rescan starts the walk over, so run it once and continue with a plain sync. |
| `--embed` | also index pending text for meaning search, with a model already downloaded. |

**Example:** `notion personal sync`, `notion personal sync --rescan --limit 500`

## `notion status`

show the last sync, imported documents and pending work

```sh
notion status
```

**Example:** `notion personal status`

## `notion documents`

read Notion pages, live or from the local copy

### `notion documents list`

list the synced pages and database rows with their Notion links

```sh
notion documents list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many documents to return. Default: `50`. |
| `--page <n>` | which page to return. Default: `1`. |

**Next usually:** `notion documents show <document>`, `notion documents context <document>`, `notion tags list <document> [query]`

**Example:** `notion personal documents list`, `notion personal documents list tag:budget`, `notion personal documents list person:PERSON_UID --limit 10`

### `notion documents show`

show an imported document's text, tabs and metadata

```sh
notion documents show <document>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page id, Notion link, or a search hit's document: ref. |

**Example:** `notion personal documents show DOC_ID`, `notion personal documents show document:42 --offline`

### `notion documents export`

write an imported document to a new Markdown file

**Changes something on this computer only.**

```sh
notion documents export <document> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page id, Notion link, or a search hit's document: ref. |

| Option | What it does |
|---|---|
| `--output <file>` | path of the Markdown file to write; an existing file is refused. |

**Example:** `notion personal documents export DOC_ID --output notes.md`

### `notion documents context`

show a document with its tags, relationships, notes, memories and editors

```sh
notion documents context <document>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |

**Example:** `notion personal documents context DOC_ID`

### `notion documents get`

read one page live from Notion as Notion-flavoured Markdown. A page too long for one answer is read in parts; a part the token may not see is listed in missing_block_ids, and a page that is not whole answers meta.complete false and exits non-zero. Signed file links lose their signature, so the output never carries a link that opens the file

```sh
notion documents get <page>
```

| Argument | | What it is |
|---|---|---|
| `page` | required | the page's id or its Notion link. |

**Returns:** document markdown — id, markdown, truncated, missing_block_ids, signed_links_removed; every field: notion commands info documents get

**Example:** `notion personal documents get https://www.notion.so/Roadmap-0123456789abcdef0123456789abcdef`, `notion personal documents get 0123456789abcdef0123456789abcdef --json`

### `notion documents add`

read one page live and keep its text among the sources added by hand, where memo and search all find it; adding it again keeps its new text as the next revision

**Changes something on this computer only.**

```sh
notion documents add <page> [options]
```

| Argument | | What it is |
|---|---|---|
| `page` | required | the page's id or its Notion link. |

| Option | What it does |
|---|---|
| `--title <title>` | the title to keep it under; the page's own when omitted. |
| `--subject <ref>` | a person, organization, project, task or meeting it is about; repeat to add more. |

**Example:** `notion personal documents add https://www.notion.so/Roadmap-0123456789abcdef0123456789abcdef`, `notion personal documents add PAGE_ID --subject person:PERSON_UID`

## `notion search`

search imported documents by words, and by meaning when indexed

```sh
notion search <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | words to look for, and fields such as tag: and date: that every hit must match. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many results to return. Default: `20`. |
| `--page <n>` | which page to return. Default: `1`. |
| `--exact` | match the words exactly: no word forms, no meaning. |

**Example:** `notion personal search budget`, `notion personal search "quarterly plan" --exact --limit 5`

## `notion catalog`

browse the synced pages and databases offline

### `notion catalog import`

put cached file and folder metadata into the shared database

**Changes something on this computer only.**

```sh
notion catalog import
```

**Example:** `notion personal catalog import --offline`

### `notion catalog show`

show stored metadata and the stable file or folder reference

```sh
notion catalog show <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | page or database id, or its Notion link. |

**Next usually:** `notion documents show <document>`, `notion documents context <document>`, `notion tags list <document> [query]`

**Example:** `notion personal catalog show FILE_ID --offline`

### `notion catalog list`

list cached files and folders using metadata queries

```sh
notion catalog list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | metadata query: kind, mime, name, parent, person, tag; AND, OR, NOT. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many entries to return (at most 1000). Default: `50`. |
| `--page <n>` | which page to return. Default: `1`. |

**Next usually:** `notion documents show <document>`, `notion documents context <document>`, `notion tags list <document> [query]`

**Example:** `notion personal catalog list "parent:FOLDER_ID AND kind:file" --offline`

### `notion catalog search`

search cached names, descriptions, types and observed people

```sh
notion catalog search <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | metadata query: kind, mime, name, parent, person, tag; AND, OR, NOT. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many entries to return (at most 1000). Default: `50`. |
| `--page <n>` | which page to return. Default: `1`. |

**Next usually:** `notion documents show <document>`, `notion documents context <document>`, `notion tags list <document> [query]`

**Example:** `notion personal catalog search "budget AND person:Rin*" --offline`

### `notion catalog tree`

show the cached hierarchy below a folder or all selected roots

```sh
notion catalog tree [folder] [options]
```

| Argument | | What it is |
|---|---|---|
| `folder` | optional | page or database id or link; defaults to the chosen folders, or the whole workspace. |

| Option | What it does |
|---|---|
| `--depth <n>` | maximum descendant depth, from 0 to 50. Default: `5`. |

**Example:** `notion personal catalog tree --offline`, `notion personal catalog tree FOLDER_ID --depth 3 --offline`

### `notion catalog tags`

add owner tags to cached files or folders

#### `notion catalog tags list`

list local tags on a cached file or folder

```sh
notion catalog tags list <file> [query]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | page or database id, or its Notion link. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** document tag — tag; every field: notion commands info catalog tags list

**Example:** `notion personal catalog tags list FOLDER_ID --offline`

#### `notion catalog tags add`

add local tags on a cached file or folder

**Changes something on this computer only.**

```sh
notion catalog tags add <file> <tags>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | page or database id, or its Notion link. |
| `tags` | required | local tag names. |

**Example:** `notion personal catalog tags add FOLDER_ID project --offline`

#### `notion catalog tags remove`

remove local tags on a cached file or folder

**Changes something on this computer only.**

```sh
notion catalog tags remove <file> <tags>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | page or database id, or its Notion link. |
| `tags` | required | local tag names. |

**Example:** `notion personal catalog tags remove FOLDER_ID project --offline`

## `notion tags`

label imported documents; labels survive a sync

### `notion tags list`

list a document's tags

```sh
notion tags list <document> [query]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** document tag — tag; every field: notion commands info tags list

**Example:** `notion personal tags list DOC_ID`

### `notion tags add`

tag a document

**Changes something on this computer only.**

```sh
notion tags add <document> <tags>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `tags` | required | one or more tags. |

**Example:** `notion personal tags add DOC_ID budget q3`

### `notion tags remove`

untag a document

**Changes something on this computer only.**

```sh
notion tags remove <document> <tags>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `tags` | required | one or more tags. |

**Example:** `notion personal tags remove DOC_ID budget q3`

## `notion relationships`

connect a document to people, projects, notes and other references

### `notion relationships list`

list a document's relationships

```sh
notion relationships list <document> [query]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** document relationship — id, from, to, kind, role, confirmed, origin; every field: notion commands info relationships list

**Example:** `notion personal relationships list DOC_ID`

### `notion relationships add`

connect a document to another reference

**Changes something on this computer only.**

```sh
notion relationships add <document> <reference> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `reference` | required | what it connects to, such as person:<uid>, project:<id> or note:<id>. |

| Option | What it does |
|---|---|
| `--kind <kind>` | how the two relate. One of: `links-to`, `about`, `evidence`, `created-from`, `related-to`, `assigned-to`. Default: `related-to`. |
| `--role <role>` | the part the reference plays, in a word or two. |
| `--reason <text>` | why the two are connected. |

**Example:** `notion personal relationships add DOC_ID project:PROJECT_ID --kind about`, `notion personal relationships add DOC_ID person:PERSON_UID --kind assigned-to --role reviewer`

### `notion relationships remove`

remove one of a document's relationships

**Changes something on this computer only.**

```sh
notion relationships remove <document> <relationship-id>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `relationship-id` | required | id, as relationships list prints it. |

**Example:** `notion personal relationships remove DOC_ID LINK_ID`

## `notion notes`

write notes about an imported document

### `notion notes add`

write a note about a document

**Changes something on this computer only.**

```sh
notion notes add <document> <text> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `text` | required | the note's text. |

| Option | What it does |
|---|---|
| `--title <title>` | a title for the note. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more; every field: notion commands info notes add

**Next usually:** `notion notes show <document> <note>`, `notion notes edit <document> <note> <text>`, `notion notes remove <document> <note>`

**Example:** `notion personal notes add DOC_ID "Check the numbers" --title Review`

### `notion notes list`

list a document's notes

```sh
notion notes list <document> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many notes to return. Default: `50`. |
| `--page <n>` | which page to return. Default: `1`. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more; every field: notion commands info notes list

**Next usually:** `notion notes show <document> <note>`, `notion notes edit <document> <note> <text>`, `notion notes remove <document> <note>`

**Example:** `notion personal notes list DOC_ID`, `notion personal notes list DOC_ID text:review --limit 10`

### `notion notes show`

show one note

```sh
notion notes show <document> <note>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `note` | required | note:<id> reference, as notes list prints it. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more; every field: notion commands info notes show

**Next usually:** `notion notes edit <document> <note> <text>`, `notion notes remove <document> <note>`

**Example:** `notion personal notes show DOC_ID note:NOTE_ID`

### `notion notes edit`

replace a note's text

**Changes something on this computer only.**

```sh
notion notes edit <document> <note> <text> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `note` | required | note:<id> reference, as notes list prints it. |
| `text` | required | the note's new text. |

| Option | What it does |
|---|---|
| `--revision <n>` | revision from notes show; a newer note is not overwritten. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more; every field: notion commands info notes edit

**Next usually:** `notion notes show <document> <note>`, `notion notes remove <document> <note>`

**Example:** `notion personal notes edit DOC_ID note:NOTE_ID "Numbers checked" --revision 2`

### `notion notes remove`

delete one note

**Changes something on this computer only.**

```sh
notion notes remove <document> <note>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `note` | required | note:<id> reference, as notes list prints it. |

**Example:** `notion personal notes remove DOC_ID note:NOTE_ID`

## `notion memories`

keep what was learned from a document, with evidence; an agent's stay proposed

### `notion memories add`

record a memory about a document

**Changes something on this computer only.**

```sh
notion memories add <document> <text> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `text` | required | what to remember. |

| Option | What it does |
|---|---|
| `--scope <scope>` | whose memory it is: personal or work. One of: `personal`, `work`. |
| `--kind <kind>` | what kind of memory it is. One of: `summary`, `digest`, `preference`. Default: `summary`. |
| `--supersedes <ref>` | a memory:<id> about the same document that this one replaces. |

**Example:** `notion personal memories add DOC_ID "The team prefers async reviews" --scope work --kind preference`

### `notion memories list`

list a document's memories

```sh
notion memories list <document> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many memories to return. Default: `50`. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 13 more; every field: notion commands info memories list

**Example:** `notion personal memories list DOC_ID scope:work`, `notion personal memories list DOC_ID kind:preference status:confirmed`

### `notion memories show`

show one memory

```sh
notion memories show <document> <memory>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `memory` | required | memory:<id> reference, as memories list prints it. |

**Example:** `notion personal memories show DOC_ID memory:MEMORY_ID`

### `notion memories confirm`

confirm a proposed memory as true

**Changes something on this computer only.**

```sh
notion memories confirm <document> <memory>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `memory` | required | memory:<id> reference, as memories list prints it. |

**Example:** `notion personal memories confirm DOC_ID memory:MEMORY_ID`

### `notion memories stale`

mark a memory as out of date

**Changes something on this computer only.**

```sh
notion memories stale <document> <memory>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `memory` | required | memory:<id> reference, as memories list prints it. |

**Example:** `notion personal memories stale DOC_ID memory:MEMORY_ID`

### `notion memories search`

search a document's memories by words

```sh
notion memories search <document> <query>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `query` | required | words to look for, and scope:personal or scope:work — the fields are below. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 13 more; every field: notion commands info memories search

**Example:** `notion personal memories search DOC_ID reviews scope:work`, `notion personal memories search DOC_ID "async reviews"`

### `notion memories extract`

send a document's text to the model and show the memories it proposes

**Changes something in the service.**

```sh
notion memories extract <document> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |

| Option | What it does |
|---|---|
| `--scope <scope>` | whose memories they become: personal or work. One of: `personal`, `work`. |
| `--tab <id>` | send only this tab of the document. |
| `--yes` | save the proposals, each with its quote and the document's version. |

**Example:** `notion personal memories extract DOC_ID --scope work`, `notion personal memories extract DOC_ID --scope work --yes`

## `notion facts`

what happened, as a document shows it; an agent's stay proposed until confirmed

### `notion facts add`

record a fact a document shows

**Changes something on this computer only.**

```sh
notion facts add <document> <statement> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `statement` | required | the fact, in one sentence. |

| Option | What it does |
|---|---|
| `--type <type>` | what kind of fact it is. One of: `fact`, `statement`, `question`, `decision`, `promise`. Default: `fact`. |
| `--scope <scope>` | whose fact it is: personal or work. One of: `personal`, `work`. |
| `--supersedes <ref>` | a decision only: the decision this one replaces. |
| `--occurred-time <time>` | when it happened, as the evidence shows, ISO 8601; a time without a zone is read in this computer's zone, a date alone as its midnight. |

**Example:** `notion personal facts add DOC_ID "Budget approved" --type decision --scope work`

### `notion facts list`

list a document's facts

```sh
notion facts list <document> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many facts to return. Default: `50`. |

**Returns:** fact — ref, id, kind, text, status, project, subject, occurred_at, and 14 more; every field: notion commands info facts list

**Example:** `notion personal facts list DOC_ID status:proposed`, `notion personal facts list DOC_ID kind:decision`

### `notion facts show`

show one fact

```sh
notion facts show <document> <fact>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `fact` | required | fact:<id> reference, as facts list prints it. |

**Example:** `notion personal facts show DOC_ID fact:FACT_ID`

### `notion facts confirm`

confirm a proposed fact; a decision it supersedes stops holding

**Changes something on this computer only.**

```sh
notion facts confirm <document> <fact>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `fact` | required | fact:<id> reference, as facts list prints it. |

**Example:** `notion personal facts confirm DOC_ID fact:FACT_ID`

### `notion facts reverse`

an accepted decision no longer holds, and nothing replaced it

**Changes something on this computer only.**

```sh
notion facts reverse <document> <fact>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `fact` | required | fact:<id> reference, as facts list prints it. |

**Example:** `notion personal facts reverse DOC_ID fact:FACT_ID`

## `notion identities`

the Notion accounts seen on a document, and the people they belong to

### `notion identities list`

list the creator and last editor Notion shows for a page

```sh
notion identities list <document> [query]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** document identity — remote_id, provider, role, person; every field: notion commands info identities list

**Example:** `notion personal identities list DOC_ID`

### `notion identities link`

record that a Notion account belongs to a known person

**Changes something on this computer only.**

```sh
notion identities link <document> <notion-id> <person>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | page or database id or Notion link in the local copy, or a document:<n> ref. |
| `notion-id` | required | Notion account id, as identities list prints it. |
| `person` | required | person:<uid> reference of someone already known. |

**Example:** `notion personal identities link DOC_ID NOTION_ID person:PERSON_UID`

## `notion databases`

read Notion databases and their data sources

### `notion databases list`

list the databases this token can see, live from Notion's search: one row for each data source, with the database it belongs to. Notion's search can lag behind a new database by a few minutes

```sh
notion databases list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | at most this many, up to 100; 50 if not given. |
| `--cursor <cursor>` | go on from where the last page stopped; page.next gives it. |

**Returns:** database — id, data_source_id, title, last_edited_time; every field: notion commands info databases list

**Example:** `notion personal databases list`, `notion personal databases list title:Roadmap --json=id,data_source_id,title`

### `notion databases show`

show one database live from Notion: its title, where it sits, and each of its data sources with its id and its properties, with the options of each select and status; a query of the database names a data source id

```sh
notion databases show <database>
```

| Argument | | What it is |
|---|---|---|
| `database` | required | the database's id or its Notion link. |

**Returns:** database — id, title, description, url, parent, is_inline, in_trash, created_time, and 2 more; every field: notion commands info databases show

**Example:** `notion personal databases show 0123456789abcdef0123456789abcdef`, `notion personal databases show https://www.notion.so/0123456789abcdef0123456789abcdef --json`

## `notion api`

the raw Notion API, one command per operation of its OpenAPI document

### `notion api list`

list every Notion API operation this CLI offers, without calling Notion

```sh
notion api list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Example:** `notion personal api list`, `notion personal api list effect:destructive --json=command,path`

### `notion api show`

show one operation's parameters and request schema, without calling Notion

```sh
notion api show <operation>
```

| Argument | | What it is |
|---|---|---|
| `operation` | required | the operation, as api list prints it. |

**Example:** `notion personal api show retrieve-a-page --json`

### `notion api get-self`

Retrieve your token's bot user — read (GET /v1/users/me)

```sh
notion api get-self
```

**Example:** `notion personal api get-self`

### `notion api get-user`

Retrieve a user — read (GET /v1/users/{user_id})

```sh
notion api get-user [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | user_id. |

**Example:** `notion personal api get-user --user-id <value>`

### `notion api get-users`

List all users — read (GET /v1/users)

```sh
notion api get-users [options]
```

| Option | What it does |
|---|---|
| `--start-cursor <value>` | start_cursor. |
| `--page-size <value>` | page_size. |

**Example:** `notion personal api get-users`

### `notion api post-page`

Create a page — write (POST /v1/pages)

**Changes something in the service.**

```sh
notion api post-page [options]
```

| Option | What it does |
|---|---|
| `--filter-properties <value>` | filter_properties. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api post-page`

### `notion api retrieve-a-page`

Retrieve a page — read (GET /v1/pages/{page_id})

```sh
notion api retrieve-a-page [options]
```

| Option | What it does |
|---|---|
| `--page-id <value>` | page_id. |
| `--filter-properties <value>` | filter_properties. |

**Example:** `notion personal api retrieve-a-page --page-id <value>`

### `notion api patch-page`

Update page — write (PATCH /v1/pages/{page_id})

**Changes something in the service.**

```sh
notion api patch-page [options]
```

| Option | What it does |
|---|---|
| `--page-id <value>` | page_id. |
| `--filter-properties <value>` | filter_properties. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api patch-page --page-id <value>`

### `notion api move-page`

Move a page — write (POST /v1/pages/{page_id}/move)

**Changes something in the service.**

```sh
notion api move-page [options]
```

| Option | What it does |
|---|---|
| `--page-id <value>` | page_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api move-page --page-id <value>`

### `notion api retrieve-a-page-property`

Retrieve a page property item — read (GET /v1/pages/{page_id}/properties/{property_id})

```sh
notion api retrieve-a-page-property [options]
```

| Option | What it does |
|---|---|
| `--page-id <value>` | page_id. |
| `--property-id <value>` | property_id. |
| `--start-cursor <value>` | start_cursor. |
| `--page-size <value>` | page_size. |

**Example:** `notion personal api retrieve-a-page-property --page-id <value> --property-id <value>`

### `notion api retrieve-page-markdown`

Retrieve a page as markdown — read (GET /v1/pages/{page_id}/markdown)

```sh
notion api retrieve-page-markdown [options]
```

| Option | What it does |
|---|---|
| `--page-id <value>` | page_id. |
| `--include-transcript <value>` | include_transcript. |
| `--markdown-version <value>` | markdown_version. |

**Example:** `notion personal api retrieve-page-markdown --page-id <value>`

### `notion api update-page-markdown`

Update a page's content as markdown — write (PATCH /v1/pages/{page_id}/markdown)

**Changes something in the service.**

```sh
notion api update-page-markdown [options]
```

| Option | What it does |
|---|---|
| `--page-id <value>` | page_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api update-page-markdown --page-id <value>`

### `notion api retrieve-async-task`

Retrieve an async task — read (GET /v1/async_tasks/{task_id})

```sh
notion api retrieve-async-task [options]
```

| Option | What it does |
|---|---|
| `--task-id <value>` | task_id. |

**Example:** `notion personal api retrieve-async-task --task-id <value>`

### `notion api retrieve-a-block`

Retrieve a block — read (GET /v1/blocks/{block_id})

```sh
notion api retrieve-a-block [options]
```

| Option | What it does |
|---|---|
| `--block-id <value>` | block_id. |

**Example:** `notion personal api retrieve-a-block --block-id <value>`

### `notion api update-a-block`

Update a block — write (PATCH /v1/blocks/{block_id})

**Changes something in the service.**

```sh
notion api update-a-block [options]
```

| Option | What it does |
|---|---|
| `--block-id <value>` | block_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api update-a-block --block-id <value>`

### `notion api delete-a-block`

Delete a block — destructive (DELETE /v1/blocks/{block_id})

**Changes something in the service.**

```sh
notion api delete-a-block [options]
```

| Option | What it does |
|---|---|
| `--block-id <value>` | block_id. |

**Example:** `notion personal api delete-a-block --block-id <value>`

### `notion api get-block-children`

Retrieve block children — read (GET /v1/blocks/{block_id}/children)

```sh
notion api get-block-children [options]
```

| Option | What it does |
|---|---|
| `--block-id <value>` | block_id. |
| `--start-cursor <value>` | start_cursor. |
| `--page-size <value>` | page_size. |

**Example:** `notion personal api get-block-children --block-id <value>`

### `notion api patch-block-children`

Append block children — write (PATCH /v1/blocks/{block_id}/children)

**Changes something in the service.**

```sh
notion api patch-block-children [options]
```

| Option | What it does |
|---|---|
| `--block-id <value>` | block_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api patch-block-children --block-id <value>`

### `notion api retrieve-a-data-source`

Retrieve a data source — read (GET /v1/data_sources/{data_source_id})

```sh
notion api retrieve-a-data-source [options]
```

| Option | What it does |
|---|---|
| `--data-source-id <value>` | data_source_id. |

**Example:** `notion personal api retrieve-a-data-source --data-source-id <value>`

### `notion api update-a-data-source`

Update a data source — write (PATCH /v1/data_sources/{data_source_id})

**Changes something in the service.**

```sh
notion api update-a-data-source [options]
```

| Option | What it does |
|---|---|
| `--data-source-id <value>` | data_source_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api update-a-data-source --data-source-id <value>`

### `notion api post-database-query`

Query a data source — read (POST /v1/data_sources/{data_source_id}/query)

```sh
notion api post-database-query [options]
```

| Option | What it does |
|---|---|
| `--data-source-id <value>` | data_source_id. |
| `--filter-properties <value>` | filter_properties. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api post-database-query --data-source-id <value>`

### `notion api create-a-database`

Create a data source — write (POST /v1/data_sources)

**Changes something in the service.**

```sh
notion api create-a-database [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api create-a-database`

### `notion api list-data-source-templates`

List templates in a data source — read (GET /v1/data_sources/{data_source_id}/templates)

```sh
notion api list-data-source-templates [options]
```

| Option | What it does |
|---|---|
| `--data-source-id <value>` | data_source_id. |
| `--name <value>` | name. |
| `--start-cursor <value>` | start_cursor. |
| `--page-size <value>` | page_size. |

**Example:** `notion personal api list-data-source-templates --data-source-id <value>`

### `notion api retrieve-database`

Retrieve a database — read (GET /v1/databases/{database_id})

```sh
notion api retrieve-database [options]
```

| Option | What it does |
|---|---|
| `--database-id <value>` | database_id. |

**Example:** `notion personal api retrieve-database --database-id <value>`

### `notion api update-database`

Update a database — write (PATCH /v1/databases/{database_id})

**Changes something in the service.**

```sh
notion api update-database [options]
```

| Option | What it does |
|---|---|
| `--database-id <value>` | database_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api update-database --database-id <value>`

### `notion api create-database`

Create a database — write (POST /v1/databases)

**Changes something in the service.**

```sh
notion api create-database [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api create-database`

### `notion api post-search`

Search by title — read (POST /v1/search)

```sh
notion api post-search [options]
```

| Option | What it does |
|---|---|
| `--filter-properties <value>` | filter_properties. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api post-search`

### `notion api list-comments`

List comments — read (GET /v1/comments)

```sh
notion api list-comments [options]
```

| Option | What it does |
|---|---|
| `--block-id <value>` | block_id. |
| `--start-cursor <value>` | start_cursor. |
| `--page-size <value>` | page_size. |

**Example:** `notion personal api list-comments --block-id <value>`

### `notion api create-a-comment`

Create a comment — write (POST /v1/comments)

**Changes something in the service.**

```sh
notion api create-a-comment [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api create-a-comment`

### `notion api retrieve-comment`

Retrieve a comment — read (GET /v1/comments/{comment_id})

```sh
notion api retrieve-comment [options]
```

| Option | What it does |
|---|---|
| `--comment-id <value>` | comment_id. |

**Example:** `notion personal api retrieve-comment --comment-id <value>`

### `notion api update-a-comment`

Update a comment — write (PATCH /v1/comments/{comment_id})

**Changes something in the service.**

```sh
notion api update-a-comment [options]
```

| Option | What it does |
|---|---|
| `--comment-id <value>` | comment_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api update-a-comment --comment-id <value>`

### `notion api delete-a-comment`

Delete a comment — destructive (DELETE /v1/comments/{comment_id})

**Changes something in the service.**

```sh
notion api delete-a-comment [options]
```

| Option | What it does |
|---|---|
| `--comment-id <value>` | comment_id. |

**Example:** `notion personal api delete-a-comment --comment-id <value>`

### `notion api list-file-uploads`

List file uploads — read (GET /v1/file_uploads)

```sh
notion api list-file-uploads [options]
```

| Option | What it does |
|---|---|
| `--status <value>` | status. |
| `--start-cursor <value>` | start_cursor. |
| `--page-size <value>` | page_size. |

**Example:** `notion personal api list-file-uploads`

### `notion api create-file`

Create a file upload — write (POST /v1/file_uploads)

**Changes something in the service.**

```sh
notion api create-file [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api create-file`

### `notion api complete-file-upload`

Complete a multi-part file upload — write (POST /v1/file_uploads/{file_upload_id}/complete)

**Changes something in the service.**

```sh
notion api complete-file-upload [options]
```

| Option | What it does |
|---|---|
| `--file-upload-id <value>` | file_upload_id. |

**Example:** `notion personal api complete-file-upload --file-upload-id <value>`

### `notion api retrieve-file-upload`

Retrieve a file upload — read (GET /v1/file_uploads/{file_upload_id})

```sh
notion api retrieve-file-upload [options]
```

| Option | What it does |
|---|---|
| `--file-upload-id <value>` | file_upload_id. |

**Example:** `notion personal api retrieve-file-upload --file-upload-id <value>`

### `notion api list-custom-emojis`

List custom emojis — read (GET /v1/custom_emojis)

```sh
notion api list-custom-emojis [options]
```

| Option | What it does |
|---|---|
| `--start-cursor <value>` | start_cursor. |
| `--page-size <value>` | page_size. |
| `--name <value>` | name. |

**Example:** `notion personal api list-custom-emojis`

### `notion api list-views`

List views — read (GET /v1/views)

```sh
notion api list-views [options]
```

| Option | What it does |
|---|---|
| `--database-id <value>` | database_id. |
| `--data-source-id <value>` | data_source_id. |
| `--start-cursor <value>` | start_cursor. |
| `--page-size <value>` | page_size. |

**Example:** `notion personal api list-views`

### `notion api create-view`

Create a view — write (POST /v1/views)

**Changes something in the service.**

```sh
notion api create-view [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api create-view`

### `notion api retrieve-a-view`

Retrieve a view — read (GET /v1/views/{view_id})

```sh
notion api retrieve-a-view [options]
```

| Option | What it does |
|---|---|
| `--view-id <value>` | view_id. |

**Example:** `notion personal api retrieve-a-view --view-id <value>`

### `notion api update-a-view`

Update a view — write (PATCH /v1/views/{view_id})

**Changes something in the service.**

```sh
notion api update-a-view [options]
```

| Option | What it does |
|---|---|
| `--view-id <value>` | view_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api update-a-view --view-id <value>`

### `notion api delete-view`

Delete a view — destructive (DELETE /v1/views/{view_id})

**Changes something in the service.**

```sh
notion api delete-view [options]
```

| Option | What it does |
|---|---|
| `--view-id <value>` | view_id. |

**Example:** `notion personal api delete-view --view-id <value>`

### `notion api create-view-query`

Create a view query — read (POST /v1/views/{view_id}/queries)

```sh
notion api create-view-query [options]
```

| Option | What it does |
|---|---|
| `--view-id <value>` | view_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api create-view-query --view-id <value>`

### `notion api get-view-query-results`

Get view query results — read (GET /v1/views/{view_id}/queries/{query_id})

```sh
notion api get-view-query-results [options]
```

| Option | What it does |
|---|---|
| `--view-id <value>` | view_id. |
| `--query-id <value>` | query_id. |
| `--start-cursor <value>` | start_cursor. |
| `--page-size <value>` | page_size. |

**Example:** `notion personal api get-view-query-results --view-id <value> --query-id <value>`

### `notion api delete-view-query`

Delete a view query — destructive (DELETE /v1/views/{view_id}/queries/{query_id})

**Changes something in the service.**

```sh
notion api delete-view-query [options]
```

| Option | What it does |
|---|---|
| `--view-id <value>` | view_id. |
| `--query-id <value>` | query_id. |

**Example:** `notion personal api delete-view-query --view-id <value> --query-id <value>`

### `notion api create-meeting-note`

Create a meeting note — write (POST /v1/blocks/meeting_notes)

**Changes something in the service.**

```sh
notion api create-meeting-note [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api create-meeting-note`

### `notion api query-meeting-notes`

Query meeting notes — read (POST /v1/blocks/meeting_notes/query)

```sh
notion api query-meeting-notes [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api query-meeting-notes`

### `notion api query-agents`

Query agents — read (POST /v1/agents/query)

```sh
notion api query-agents [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api query-agents`

### `notion api get-agent`

Get agent — read (GET /v1/agents/{agent_id})

```sh
notion api get-agent [options]
```

| Option | What it does |
|---|---|
| `--agent-id <value>` | agent_id. |
| `--verbose <value>` | verbose. |

**Example:** `notion personal api get-agent --agent-id <value>`

### `notion api update-agent`

Update agent — write (PATCH /v1/agents/{agent_id})

**Changes something in the service.**

```sh
notion api update-agent [options]
```

| Option | What it does |
|---|---|
| `--agent-id <value>` | agent_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api update-agent --agent-id <value>`

### `notion api delete-agent`

Delete agent — destructive (DELETE /v1/agents/{agent_id})

**Changes something in the service.**

```sh
notion api delete-agent [options]
```

| Option | What it does |
|---|---|
| `--agent-id <value>` | agent_id. |

**Example:** `notion personal api delete-agent --agent-id <value>`

### `notion api get-agent-insights`

Get agent insights — read (GET /v1/agents/{agent_id}/insights)

```sh
notion api get-agent-insights [options]
```

| Option | What it does |
|---|---|
| `--agent-id <value>` | agent_id. |
| `--start-time <value>` | start_time. |
| `--end-time <value>` | end_time. |

**Example:** `notion personal api get-agent-insights --agent-id <value>`

### `notion api update-agent-status`

Update agent status — write (PATCH /v1/agents/{agent_id}/status)

**Changes something in the service.**

```sh
notion api update-agent-status [options]
```

| Option | What it does |
|---|---|
| `--agent-id <value>` | agent_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api update-agent-status --agent-id <value>`

### `notion api update-agent-credit-limit`

Update agent credit limit — write (PATCH /v1/agents/{agent_id}/credit_limit)

**Changes something in the service.**

```sh
notion api update-agent-credit-limit [options]
```

| Option | What it does |
|---|---|
| `--agent-id <value>` | agent_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api update-agent-credit-limit --agent-id <value>`

### `notion api agent-batch`

Apply many agent operations — write (POST /v1/agents/batch)

**Changes something in the service.**

```sh
notion api agent-batch [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api agent-batch`

### `notion api list-skills-plugins`

List skills plugins — read (GET /v1/ai/plugins)

```sh
notion api list-skills-plugins [options]
```

| Option | What it does |
|---|---|
| `--page-size <value>` | page_size. |
| `--start-cursor <value>` | start_cursor. |

**Example:** `notion personal api list-skills-plugins`

### `notion api get-plugin-directory`

Get a plugin directory — read (GET /v1/ai/plugins/{id})

```sh
notion api get-plugin-directory [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |

**Example:** `notion personal api get-plugin-directory --id <value>`

### `notion api get-skill-directory`

Get a skill directory — read (GET /v1/ai/skills/{id})

```sh
notion api get-skill-directory [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |

**Example:** `notion personal api get-skill-directory --id <value>`

### `notion api update-session`

Update a session — write (POST /v1/sessions)

**Changes something in the service.**

```sh
notion api update-session [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api update-session`

### `notion api retrieve-session`

Retrieve a session — read (GET /v1/sessions/{session_id})

```sh
notion api retrieve-session [options]
```

| Option | What it does |
|---|---|
| `--session-id <value>` | session_id. |

**Example:** `notion personal api retrieve-session --session-id <value>`

### `notion api query-sessions`

Query sessions — read (POST /v1/sessions/query)

```sh
notion api query-sessions [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api query-sessions`

### `notion api query-session-events`

Query session events — read (POST /v1/sessions/{session_id}/events/query)

```sh
notion api query-session-events [options]
```

| Option | What it does |
|---|---|
| `--session-id <value>` | session_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api query-session-events --session-id <value>`

### `notion api cancel-session`

Cancel a session — write (POST /v1/sessions/{session_id}/cancel)

**Changes something in the service.**

```sh
notion api cancel-session [options]
```

| Option | What it does |
|---|---|
| `--session-id <value>` | session_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `notion personal api cancel-session --session-id <value>`

## `notion doctor`

the state this installation is in, without connecting unless --online

```sh
notion doctor [options]
```

| Option | What it does |
|---|---|
| `--online` | also connect once and read the account; sends nothing. |

**Example:** `notion doctor`, `notion doctor --json`

### `notion doctor reports`

problem reports

#### `notion doctor reports show`

what a problem report holds; writes nothing

```sh
notion doctor reports show
```

**Example:** `notion doctor reports show`

#### `notion doctor reports create`

write a problem report to a file, and say where to send it

**Changes something on this computer only.**

```sh
notion doctor reports create [options]
```

| Option | What it does |
|---|---|
| `--run <id>` | the run the report is about; the newest failed one if not given. |
| `--output <file>` | where to write it; a new file in this directory if not given. |

**Example:** `notion doctor reports create --output ./problem-report.json`

## `notion skill`

the instructions an agent is given for this tool

### `notion skill show`

print SKILL.md — `notion skill install` puts it where Claude Code, Codex, Gemini CLI and OpenClaw look for it, and where Hermes does on request; --for prints the copy already there

```sh
notion skill show [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | print the copy installed for these agents instead of this version's. One of: `claude`, `agents`. |

**Example:** `notion skill show`

### `notion skill install`

write SKILL.md to \~/.claude/skills/notion-cli/ (Claude Code) and \~/.agents/skills/notion-cli/ (Codex, Gemini CLI, OpenClaw); --for hermes also has Hermes read \~/.agents/skills, which changes Hermes's own settings, so all leaves it out

**Changes something on this computer only.**

```sh
notion skill install [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `hermes`, `all`. Default: `all`. |

**Example:** `notion skill install --for agents`

### `notion skill status`

for each place `notion skill install` writes to, and for the copy Hermes reads: the path, the version installed there, and whether it is current, stale, missing or unversioned

```sh
notion skill status
```

**Example:** `notion skill status`, `notion skill status --json`

## `notion mcp`

serve this profile to an agent over MCP and set it up — `claude mcp add notion -- notion <profile> mcp serve`

### `notion mcp serve`

serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add notion -- notion <profile> mcp serve`; `notion mcp serve --profiles a,b` or `--profiles all` serves those profiles from one server and each tool asks which

**Changes something in the service.**

```sh
notion mcp serve [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like documents.get=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |
| `--http` | serve over HTTP on 127.0.0.1 for ChatGPT and Claude in the browser, behind your tunnel; the profile's permissions decide. |
| `--port <port>` | the local port for --http (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |

**Example:** `notion personal mcp serve`, `notion mcp serve --profiles work,personal`, `notion personal mcp serve --http --public-url https://laptop.example.ts.net`

### `notion mcp revoke`

forget every login `mcp serve --http` gave a browser app, of this profile or of the server `--profiles` names; each app must log in again

**Changes something on this computer only.**

```sh
notion mcp revoke [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `notion personal mcp revoke`, `notion mcp revoke --profiles all`

### `notion mcp server`

start, stop and check `mcp serve --http` in the background; status shows the login code for a browser app

#### `notion mcp server start`

start `mcp serve --http` apart from this shell and answer once it listens, with its login code

**Changes something on this computer only.**

```sh
notion mcp server start [options]
```

| Option | What it does |
|---|---|
| `--port <port>` | the local port (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |
| `--permission <key=level>` | make a permission stricter for this server only; repeat for more keys. |
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `notion personal mcp server start --public-url https://laptop.example.ts.net`

#### `notion mcp server stop`

stop `mcp serve --http` — only one that `mcp server start` started

**Changes something on this computer only.**

```sh
notion mcp server stop [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `notion personal mcp server stop`

#### `notion mcp server status`

whether `mcp serve --http` runs, on which port and address, the login code for a new browser app, and the apps logged in

```sh
notion mcp server status [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `notion personal mcp server status --json`

### `notion mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
notion mcp config [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like documents.get=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `notion personal mcp config`, `notion mcp config --profiles all`

### `notion mcp add`

add this profile's local MCP server to Codex or Claude Code

**Changes something on this computer only.**

```sh
notion mcp add <client> [options]
```

| Argument | | What it is |
|---|---|---|
| `client` | required | codex or claude-code. |

| Option | What it does |
|---|---|
| `--allow-writes` | acknowledge that this profile offers writing tools. |
| `--permission <key=level>` | make a permission stricter for this server only, like documents.get=deny; it never loosens the profile; repeat for more keys. |

**Example:** `notion personal mcp add codex --allow-writes`

### `notion mcp check`

check this profile's local MCP handshake and tool list

```sh
notion mcp check [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like documents.get=deny; it never loosens the profile; repeat for more keys. |

**Example:** `notion personal mcp check`

## `notion upgrade`

upgrade notion with the package manager that installed it; --check only looks

**Changes something on this computer only.**

```sh
notion upgrade [options]
```

| Option | What it does |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |

**Example:** `notion upgrade --check`

## `notion config`

the settings in force, and where each one came from

### `notion config show`

the profile, the profiles that exist, and each setting with where it came from

```sh
notion config show
```

**Example:** `notion personal config show`

### `notion config set`

save a setting to the configuration file

**Changes something on this computer only.**

```sh
notion config set <setting> <value> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities. |
| `value` | required | a number, true or false; for a group tg:work,max:Alice,email:me@x. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Example:** `notion personal config set limit 20`

### `notion config unset`

remove a setting from the configuration file

**Changes something on this computer only.**

```sh
notion config unset <setting> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Example:** `notion personal config unset limit`

### `notion config migrate`

write each setting the file lacks at its default, keeping yours

**Changes something on this computer only.**

```sh
notion config migrate
```

**Example:** `notion config migrate`

### `notion config repair`

fix broken JSON syntax in the settings file — comments, a missing or extra comma, unquoted keys, single quotes, missing closing brackets at the end — keeping every value, with a backup beside it; refuses anything with more than one reading and changes nothing then

**Changes something on this computer only.**

```sh
notion config repair [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | say what it would fix, and change nothing. |

**Example:** `notion config repair`, `notion config repair --dry-run`

## `notion runs`

recorded runs — what this tool did, and when

### `notion runs list`

recorded runs, newest first

```sh
notion runs list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |

**Returns:** run — run_id, command, started_at, status, cli_version, profile, completed_at, requests, and 23 more; every field: notion commands info runs list

**Example:** `notion personal runs list --limit 10`

### `notion runs show`

one run: what it was, how it ended, and every event it logged

```sh
notion runs show <run-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `notion runs list`. |

| Option | What it does |
|---|---|
| `--problems` | only failed responses, warnings and crashes. |

**Returns:** run details — run_id, command, started_at, status, cli_version, directory, event_count, events, and 22 more; every field: notion commands info runs show

**Example:** `notion personal runs show run-101`

### `notion runs path`

the directory holding one run

```sh
notion runs path <run-id>
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `notion runs list`. |

**Returns:** run location — path; every field: notion commands info runs path

**Example:** `notion personal runs path run-101`

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
