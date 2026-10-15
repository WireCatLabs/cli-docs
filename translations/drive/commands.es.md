---
title: "Comandos Drive"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Consulta todos los comandos y opciones. Las operaciones de cuenta requieren perfil explícito: `drive personal documents show DOC_ID` o `drive --profile personal documents show DOC_ID`. Ayuda, descubrimiento, métodos API, esquemas y completado no seleccionan cuenta. Consulta [recetas](./recipes.md) e [importación y almacenamiento](./usage.md). Las descripciones conservan el idioma de la ayuda.

## Opciones globales

Las opciones se aplican al perfil seleccionado y a esta ejecución.

| Option | What it does |
|---|---|
| `-V, --version` | output the version number. |
| `--profile <name>` | explicit Google account profile (alternative to the first word). |
| `--json` | print machine-readable JSON; --json=id,title keeps only those fields. |
| `--jsonl` | print machine-readable JSON lines. |
| `--quiet` | suppress optional diagnostics. |
| `--debug` | on failure, show the full error record: cause and stack. |
| `--timeout <duration>` | whole-command deadline, e.g. 30s. |
| `--max-output-bytes <bytes>` | largest result to print, in bytes; 0 for no limit. Default: `4194304`. |
| `--read-only` | refuse local and remote mutations. |
| `--offline` | answer only operations that use local cached data. |
| `--dry-run` | validate command/policy and preview without acting. |
| `--yes` | answer a policy confirmation; cannot override deny or readonly. |
| `--allow-dangerous` | answer a permanent-deletion confirmation. |
| `--permission <key=level>` | temporary policy override; repeat to add keys. |

## `drive session`

sign in to Google and manage local profiles

### `drive session start`

sign in to Google in the browser; read-only unless you pass --write

This command can change Google data or send data to the configured model.

```sh
drive <profile> session start [options]
```

| Option | What it does |
|---|---|
| `--client-file <file>` | path to your own Desktop OAuth client JSON, used instead of WireCat's. |
| `--credential-storage <storage>` | where the sign-in is kept: keyring, or file for a private file. Default: `keyring`. |
| `--no-browser` | print the sign-in URL instead of opening a browser. |
| `--write` | also ask for permission to change Drive files and Docs. |
| `--activity` | also ask for permission to read Drive Activity history. |
| `--apps` | also ask for permission to see installed Drive apps. |

### `drive session list`

list the configured profiles; credentials are never printed

```sh
drive <profile> session list
```

### `drive session end`

sign this profile out; imported documents stay

This command changes local state.

```sh
drive <profile> session end
```

## `drive folders`

choose the Google Drive folders that sync imports

### `drive folders add`

import a folder and everything under it on the next sync

This command changes local state.

```sh
drive <profile> folders add <folder>
```

| Argument | | What it is |
|---|---|---|
| `folder` | required | folder id or Google Drive URL. |

### `drive folders list`

list the folder ids sync imports

```sh
drive <profile> folders list
```

### `drive folders remove`

stop importing a folder; the next sync drops its documents

This command changes local state.

```sh
drive <profile> folders remove <folder>
```

| Argument | | What it is |
|---|---|---|
| `folder` | required | folder id or Google Drive URL. |

## `drive sync`

import what changed in the chosen folders, and finish an unfinished sync; one sync reads at most 10000 entries under the chosen folders, and as many changes

This command changes local state.

```sh
drive <profile> sync [options]
```

| Option | What it does |
|---|---|
| `--limit <n>` | how many documents to read from Google in this run. Default: `200`. |
| `--rescan` | read every chosen folder again instead of only what changed. |
| `--embed` | also index pending text for meaning search, with a model already downloaded. |

## `drive status`

show the last sync, imported documents and pending work

```sh
drive <profile> status
```

## `drive documents`

read imported documents and Google Docs

### `drive documents list`

list imported documents with their Google URLs

```sh
drive <profile> documents list [options]
```

| Option | What it does |
|---|---|
| `--tag <tag>` | only documents with this tag. |
| `--person <uid>` | only documents linked to this person, by uid or person:<uid>. |

### `drive documents show`

show an imported document's text, tabs and metadata

```sh
drive <profile> documents show <document>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | document id or Google Docs URL. |

### `drive documents export`

write an imported document to a new Markdown file

This command changes local state.

```sh
drive <profile> documents export <document> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | document id or Google Docs URL. |

| Option | What it does |
|---|---|
| `--output <file>` | path of the Markdown file to write; an existing file is refused. |

### `drive documents context`

show a document with its tags, relationships, notes, memories and editors

```sh
drive <profile> documents context <document>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |

### `drive documents get`

read a document live from Google Docs, as JSON with every tab

```sh
drive <profile> documents get <document>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | document id or Google Docs URL. |

### `drive documents create`

create an empty Google Doc

This command can change Google data or send data to the configured model.

```sh
drive <profile> documents create [options]
```

| Option | What it does |
|---|---|
| `--title <title>` | title of the new document. |

### `drive documents update`

change a Google Doc with a Docs batchUpdate request

This command can change Google data or send data to the configured model.

```sh
drive <profile> documents update <document> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | document id or Google Docs URL. |

| Option | What it does |
|---|---|
| `--body <json>` | Docs batchUpdate body: requests and an optional writeControl. |

### `drive documents history`

list the revisions Google kept, or who did what with --activity

```sh
drive <profile> documents history <document> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | document id or Google Docs URL. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many items one page holds. Default: `100`. |
| `--cursor <cursor>` | continue from page.next_cursor of the previous answer. |
| `--activity` | list activity events instead of revisions; needs session start --activity. |

## `drive search`

search imported documents by words, and by meaning when indexed

```sh
drive <profile> search <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | words to look for. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many results to return. Default: `20`. |
| `--page <n>` | which page to return. Default: `1`. |
| `--exact` | match the words exactly: no word forms, no meaning. |

## `drive catalog`

browse stored Drive files and folders offline

### `drive catalog import`

put cached file and folder metadata into the shared database

This command changes local state.

```sh
drive <profile> catalog import
```

### `drive catalog show`

show stored metadata and the stable file or folder reference

```sh
drive <profile> catalog show <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | Google file or folder id, or its Drive URL. |

### `drive catalog list`

list cached files and folders using metadata queries

```sh
drive <profile> catalog list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | metadata query: kind, mime, name, parent, person, tag; AND, OR, NOT. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many entries to return (at most 1000). Default: `50`. |
| `--page <n>` | which page to return. Default: `1`. |

### `drive catalog search`

search cached names, descriptions, types and observed people

```sh
drive <profile> catalog search <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | metadata query: kind, mime, name, parent, person, tag; AND, OR, NOT. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many entries to return (at most 1000). Default: `50`. |
| `--page <n>` | which page to return. Default: `1`. |

### `drive catalog tree`

show the cached hierarchy below a folder or all selected roots

```sh
drive <profile> catalog tree [folder] [options]
```

| Argument | | What it is |
|---|---|---|
| `folder` | optional | Google folder id or URL; defaults to the explicitly selected profile's roots. |

| Option | What it does |
|---|---|
| `--depth <n>` | maximum descendant depth, from 0 to 50. Default: `5`. |

### `drive catalog tags`

add owner tags to cached files or folders

#### `drive catalog tags list`

list local tags on a cached file or folder

```sh
drive <profile> catalog tags list <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | Google file or folder id, or its Drive URL. |

#### `drive catalog tags add`

add local tags on a cached file or folder

This command changes local state.

```sh
drive <profile> catalog tags add <file> <tags>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | Google file or folder id, or its Drive URL. |
| `tags` | required | local tag names. |

#### `drive catalog tags remove`

remove local tags on a cached file or folder

This command changes local state.

```sh
drive <profile> catalog tags remove <file> <tags>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | Google file or folder id, or its Drive URL. |
| `tags` | required | local tag names. |

## `drive tags`

label imported documents; labels survive a sync

### `drive tags list`

list a document's tags

```sh
drive <profile> tags list <document>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |

### `drive tags add`

tag a document

This command changes local state.

```sh
drive <profile> tags add <document> <tags>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `tags` | required | one or more tags. |

### `drive tags remove`

untag a document

This command changes local state.

```sh
drive <profile> tags remove <document> <tags>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `tags` | required | one or more tags. |

## `drive relationships`

connect a document to people, projects, notes and other references

### `drive relationships list`

list a document's relationships

```sh
drive <profile> relationships list <document>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |

### `drive relationships add`

connect a document to another reference

This command changes local state.

```sh
drive <profile> relationships add <document> <reference> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `reference` | required | what it connects to, such as person:<uid>, project:<id> or note:<id>. |

| Option | What it does |
|---|---|
| `--kind <kind>` | how the two relate. One of: `links-to`, `about`, `evidence`, `created-from`, `related-to`, `assigned-to`. Default: `related-to`. |
| `--role <role>` | the part the reference plays, in a word or two. |
| `--reason <text>` | why the two are connected. |

### `drive relationships remove`

remove one of a document's relationships

This command changes local state.

```sh
drive <profile> relationships remove <document> <relationship-id>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `relationship-id` | required | id, as relationships list prints it. |

## `drive notes`

write notes about an imported document

### `drive notes add`

write a note about a document

This command changes local state.

```sh
drive <profile> notes add <document> <text> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `text` | required | the note's text. |

| Option | What it does |
|---|---|
| `--title <title>` | a title for the note. |

### `drive notes list`

list a document's notes

```sh
drive <profile> notes list <document> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `query` | optional | words a note must contain. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many notes to return. Default: `50`. |
| `--page <n>` | which page to return. Default: `1`. |

### `drive notes show`

show one note

```sh
drive <profile> notes show <document> <note>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `note` | required | note:<id> reference, as notes list prints it. |

### `drive notes edit`

replace a note's text

This command changes local state.

```sh
drive <profile> notes edit <document> <note> <text> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `note` | required | note:<id> reference, as notes list prints it. |
| `text` | required | the note's new text. |

| Option | What it does |
|---|---|
| `--revision <n>` | revision from notes show; a newer note is not overwritten. |

### `drive notes remove`

delete one note

This command changes local state.

```sh
drive <profile> notes remove <document> <note>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `note` | required | note:<id> reference, as notes list prints it. |

## `drive memories`

keep what was learned from a document, with evidence; an agent's stay proposed

### `drive memories add`

record a memory about a document

This command changes local state.

```sh
drive <profile> memories add <document> <text> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `text` | required | what to remember. |

| Option | What it does |
|---|---|
| `--scope <scope>` | whose memory it is: personal or work. One of: `personal`, `work`. |
| `--kind <kind>` | what kind of memory it is. One of: `summary`, `digest`, `preference`. Default: `summary`. |
| `--supersedes <ref>` | a memory:<id> about the same document that this one replaces. |

### `drive memories list`

list a document's memories

```sh
drive <profile> memories list <document> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |

| Option | What it does |
|---|---|
| `--scope <scope>` | only personal or only work memories. One of: `personal`, `work`. |
| `--kind <kind>` | only memories of this kind. One of: `summary`, `digest`, `preference`. |
| `--limit <n>` | how many memories to return. Default: `50`. |

### `drive memories show`

show one memory

```sh
drive <profile> memories show <document> <memory>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `memory` | required | memory:<id> reference, as memories list prints it. |

### `drive memories confirm`

confirm a proposed memory as true

This command changes local state.

```sh
drive <profile> memories confirm <document> <memory>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `memory` | required | memory:<id> reference, as memories list prints it. |

### `drive memories stale`

mark a memory as out of date

This command changes local state.

```sh
drive <profile> memories stale <document> <memory>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `memory` | required | memory:<id> reference, as memories list prints it. |

### `drive memories search`

search a document's memories by words

```sh
drive <profile> memories search <document> <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `query` | required | words to look for. |

| Option | What it does |
|---|---|
| `--scope <scope>` | search personal or work memories. One of: `personal`, `work`. |

### `drive memories extract`

send a document's text to the model and show the memories it proposes

This command can change Google data or send data to the configured model.

```sh
drive <profile> memories extract <document> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |

| Option | What it does |
|---|---|
| `--scope <scope>` | whose memories they become: personal or work. One of: `personal`, `work`. |
| `--tab <id>` | send only this tab of the document. |
| `--save` | save the proposals, each with its quote and the document's version. |

## `drive facts`

what happened, as a document shows it; an agent's stay proposed until confirmed

### `drive facts add`

record a fact a document shows

This command changes local state.

```sh
drive <profile> facts add <document> <statement> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `statement` | required | the fact, in one sentence. |

| Option | What it does |
|---|---|
| `--type <type>` | what kind of fact it is. One of: `fact`, `statement`, `question`, `decision`, `promise`. Default: `fact`. |
| `--scope <scope>` | whose fact it is: personal or work. One of: `personal`, `work`. |

### `drive facts list`

list a document's facts

```sh
drive <profile> facts list <document> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |

| Option | What it does |
|---|---|
| `--type <type>` | only facts of this kind. One of: `fact`, `statement`, `question`, `decision`, `promise`. |
| `--status <status>` | only facts in this state. One of: `proposed`, `accepted`, `superseded`, `reversed`. |
| `--limit <n>` | how many facts to return. Default: `50`. |

### `drive facts show`

show one fact

```sh
drive <profile> facts show <document> <fact>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `fact` | required | fact:<id> reference, as facts list prints it. |

### `drive facts confirm`

confirm a proposed fact as true

This command changes local state.

```sh
drive <profile> facts confirm <document> <fact>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `fact` | required | fact:<id> reference, as facts list prints it. |

## `drive identities`

the Google accounts seen on a document, and the people they belong to

### `drive identities list`

list the owners and last editor Google shows for a document

```sh
drive <profile> identities list <document>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |

### `drive identities link`

record that a Google account belongs to a known person

This command changes local state.

```sh
drive <profile> identities link <document> <google-id> <person>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Google file or folder id or URL in the local catalog. |
| `google-id` | required | Google account id, as identities list prints it. |
| `person` | required | person:<uid> reference of someone already known. |

## `drive api`

discover and call the official Drive, Docs and Activity API methods

### `drive api list`

list the Google API methods drive can call

```sh
drive api list [options]
```

| Option | What it does |
|---|---|
| `--service <name>` | only the methods of this service: drive, docs or driveactivity. |

### `drive api show`

show one method's request schema and contract, without calling Google

```sh
drive api show <method>
```

| Argument | | What it is |
|---|---|---|
| `method` | required | Google method name, as api list prints it. |

### `drive api call`

call one Google API method by name with JSON parameters

This command can change Google data or send data to the configured model.

```sh
drive <profile> api call <method> [options]
```

| Argument | | What it is |
|---|---|---|
| `method` | required | Google method name, as api list prints it. |

| Option | What it does |
|---|---|
| `--params <json>` | query and path parameters as a JSON object. Default: `[object Object]`. |
| `--body <json>` | request body as a JSON object. |
| `--allow-writes` | allow a method that changes Google data. |
| `--allow-delete` | allow a method that deletes for good or empties the trash. |

### `drive api docs-documents-batch-update`

Applies one or more updates to the document. Each request is validated before being applied. If any request is not valid, then the entire request will fail and nothing will be applied. Some requests have replies to give you some information about how they are applied. Other requests do not need to return information; these each return an empty reply. The order of replies matches that of the requests. For example, suppose you call batchUpdate with four updates, and only the third one returns information. The response would have two empty replies, the reply to the third request, and another empty reply, in that order. Because other users may be editing the document, the document might not exactly reflect your changes: your changes may be altered with respect to collaborator changes. If there are no collaborators, the document should reflect your changes. In any case, the updates in your request are guaranteed to be applied together atomically. — write (POST v1/documents/{documentId}:batchUpdate)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api docs-documents-batch-update [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--alt <value>` | Data format for response. |
| `--callback <value>` | JSONP. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--document-id <value>` | The ID of the document to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api docs-documents-create`

Creates a blank document using the title given in the request. Other fields in the request, including any provided content, are ignored. Returns the created document. — write (POST v1/documents)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api docs-documents-create [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--alt <value>` | Data format for response. |
| `--callback <value>` | JSONP. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api docs-documents-get`

Gets the latest version of the specified document. — read (GET v1/documents/{documentId})

```sh
drive <profile> api docs-documents-get [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--alt <value>` | Data format for response. |
| `--callback <value>` | JSONP. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--document-id <value>` | The ID of the document to retrieve. |
| `--comments-view-mode <value>` | The comments view mode to apply to the document. This allows viewing the document with comments omitted or included. If one is not specified, COMMENTS_VIEW_MODE_OMITTED is used. If you set comments_view_mode to any value, you must also set include_tabs_content to `true` or use a field mask that references the Document.tabs field (or any subfield). If you set comments_view_mode to COMMENTS_VIEW_MODE_INCLUDED, you must also explicitly set suggestions_view_mode to SUGGESTIONS_INLINE. If you set comments_view_mode to COMMENTS_VIEW_MODE_INCLUDED or COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS, you may not set suggestions_view_mode to PREVIEW_WITHOUT_SUGGESTIONS or PREVIEW_SUGGESTIONS_ACCEPTED. |
| `--include-tabs-content <value>` | Whether to populate the `Document.tabs` field instead of the text content fields like `body` and `documentStyle` on `Document`. - When `true`: Document content populates in the `Document.tabs` field instead of the text content fields in `Document`. - When `false`: The content of the document's first tab populates the content fields in `Document` excluding `Document.tabs`. If a document has only one tab, then that tab is used to populate the document content. `Document.tabs` will be empty. If you use a field mask that references the `Document.tabs` field (or any subfield), the API implicitly treats the request as if you set `include_tabs_content` to `true`. |
| `--suggestions-view-mode <value>` | The suggestions view mode to apply to the document. This allows viewing the document with all suggestions inline, accepted or rejected. If one is not specified, DEFAULT_FOR_CURRENT_ACCESS is used. |

### `drive api drive-about-get`

Gets information about the user, the user's Drive, and system capabilities. For more information, see [Return user info](https://developers.google.com/workspace/drive/api/guides/user-info). Required: The `fields` parameter must be set. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter). — read (GET about)

```sh
drive <profile> api drive-about-get [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |

### `drive api drive-accessproposals-get`

Retrieves an access proposal by ID. For more information, see [Manage pending access proposals](https://developers.google.com/workspace/drive/api/guides/pending-access). — read (GET files/{fileId}/accessproposals/{proposalId})

```sh
drive <profile> api drive-accessproposals-get [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--proposal-id <value>` | Required. The ID of the access proposal to resolve. |
| `--file-id <value>` | Required. The ID of the item the request is on. |

### `drive api drive-accessproposals-list`

List the access proposals on a file. For more information, see [Manage pending access proposals](https://developers.google.com/workspace/drive/api/guides/pending-access). Note: Only approvers are able to list access proposals on a file. If the user isn't an approver, a 403 error is returned. — read (GET files/{fileId}/accessproposals)

```sh
drive <profile> api drive-accessproposals-list [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--page-token <value>` | Optional. The continuation token on the list of access requests. |
| `--file-id <value>` | Required. The ID of the item the request is on. |
| `--page-size <value>` | Optional. The number of results per page. |

### `drive api drive-accessproposals-resolve`

Approves or denies an access proposal. For more information, see [Manage pending access proposals](https://developers.google.com/workspace/drive/api/guides/pending-access). — write (POST files/{fileId}/accessproposals/{proposalId}:resolve)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-accessproposals-resolve [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--file-id <value>` | Required. The ID of the item the request is on. |
| `--proposal-id <value>` | Required. The ID of the access proposal to resolve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-approvals-approve`

Approves an approval. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). This is used to update the ReviewerResponse of the requesting user with a Response of `APPROVED`. If this is the last required reviewer response, this also completes the approval and sets the approval Status to `APPROVED`. — write (POST files/{fileId}/approvals/{approvalId}:approve)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-approvals-approve [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--file-id <value>` | Required. The ID of the file that the approval is on. |
| `--approval-id <value>` | Required. The ID of the approval to approve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-approvals-cancel`

Cancels an approval. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). Updates the approval Status to `CANCELLED`. This can be called by any user with the `writer` permission on the file while the approval Status is `IN_PROGRESS`. — write (POST files/{fileId}/approvals/{approvalId}:cancel)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-approvals-cancel [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--file-id <value>` | Required. The ID of the file that the approval is on. |
| `--approval-id <value>` | Required. The ID of the approval to cancel. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-approvals-comment`

Comments on an approval. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). This sends a notification to both the initiator and the reviewers. Additionally, a message is also added to the approval activity log. — write (POST files/{fileId}/approvals/{approvalId}:comment)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-approvals-comment [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--file-id <value>` | Required. The ID of the file that the approval is on. |
| `--approval-id <value>` | Required. The ID of the approval to comment on. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-approvals-decline`

Declines an approval. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). This is used to update the ReviewerResponse of the requesting user with a Response of `DECLINED`. This also completes the approval and sets the approval Status to `DECLINED`. — write (POST files/{fileId}/approvals/{approvalId}:decline)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-approvals-decline [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--file-id <value>` | Required. The ID of the file that the approval is on. |
| `--approval-id <value>` | Required. The ID of the approval to decline. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-approvals-get`

Gets an approval by ID. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). — read (GET files/{fileId}/approvals/{approvalId})

```sh
drive <profile> api drive-approvals-get [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--file-id <value>` | Required. The ID of the file that the approval is on. |
| `--approval-id <value>` | Required. The ID of the approval. |

### `drive api drive-approvals-list`

Lists the approvals on a file. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). By default, this method returns a minimal response that may not include the items array. To retrieve approval details, you must explicitly specify the fields you want using the `fields` query parameter. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter). — read (GET files/{fileId}/approvals)

```sh
drive <profile> api drive-approvals-list [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--file-id <value>` | Required. The ID of the file that the approval is on. |
| `--page-size <value>` | The maximum number of approvals to return. When not set, at most 100 approvals are returned. |
| `--page-token <value>` | The token for continuing a previous list request on the next page. This should be set to the value of `nextPageToken` from a previous response. |

### `drive api drive-approvals-reassign`

Reassigns the reviewers on an approval. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). Adds or replaces reviewers in the ReviewerResponse of the approval. This can be called by any user with the `writer` permission on the file while the approval Status is `IN_PROGRESS` and the Response for the reviewer being reassigned is `NO_RESPONSE`. A user with the `reader` permission can only reassign an approval that's assigned to themselves. Removing a reviewer isn't allowed. — write (POST files/{fileId}/approvals/{approvalId}:reassign)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-approvals-reassign [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--approval-id <value>` | Required. The ID of the approval to reassign. |
| `--file-id <value>` | Required. The ID of the file that the approval is on. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-approvals-start`

Starts an approval on a file. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). — write (POST files/{fileId}/approvals:start)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-approvals-start [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--file-id <value>` | Required. The ID of the file that the approval is created on. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-apps-get`

Gets a specific app. For more information, see [Return user info](https://developers.google.com/workspace/drive/api/guides/user-info). — read (GET apps/{appId})

```sh
drive <profile> api drive-apps-get [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--app-id <value>` | The ID of the app. |

### `drive api drive-apps-list`

Lists a user's installed apps. For more information, see [Return user info](https://developers.google.com/workspace/drive/api/guides/user-info). — read (GET apps)

```sh
drive <profile> api drive-apps-list [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--language-code <value>` | A language or locale code, as defined by BCP 47, with some extensions from Unicode's LDML format (http://www.unicode.org/reports/tr35/). |
| `--app-filter-extensions <value>` | A comma-separated list of file extensions to limit returned results. All results within the given app query scope which can open any of the given file extensions are included in the response. If `appFilterMimeTypes` are provided as well, the result is a union of the two resulting app lists. |
| `--app-filter-mime-types <value>` | A comma-separated list of file extensions to limit returned results. All results within the given app query scope which can open any of the given MIME types will be included in the response. If `appFilterExtensions` are provided as well, the result is a union of the two resulting app lists. |

### `drive api drive-changes-get-start-page-token`

Gets the starting pageToken for listing future changes. For more information, see [Retrieve changes](https://developers.google.com/workspace/drive/api/guides/manage-changes). — read (GET changes/startPageToken)

```sh
drive <profile> api drive-changes-get-start-page-token [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--supports-team-drives <value>` | Deprecated: Use `supportsAllDrives` instead. |
| `--drive-id <value>` | The ID of the shared drive for which the starting pageToken for listing future changes from that shared drive will be returned. |
| `--supports-all-drives <value>` | Whether the requesting application supports both My Drives and shared drives. |
| `--team-drive-id <value>` | Deprecated: Use `driveId` instead. |

### `drive api drive-changes-list`

Lists the changes for a user or shared drive. For more information, see [Retrieve changes](https://developers.google.com/workspace/drive/api/guides/manage-changes). — read (GET changes)

```sh
drive <profile> api drive-changes-list [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--supports-all-drives <value>` | Whether the requesting application supports both My Drives and shared drives. |
| `--drive-id <value>` | The shared drive from which changes will be returned. If specified the change IDs will be reflective of the shared drive; use the combined drive ID and change ID as an identifier. |
| `--restrict-to-my-drive <value>` | Whether to restrict the results to changes inside the My Drive hierarchy. This omits changes to files such as those in the Application Data folder or shared files which have not been added to My Drive. |
| `--include-items-from-all-drives <value>` | Whether both My Drive and shared drive items should be included in results. |
| `--include-corpus-removals <value>` | Whether changes should include the file resource if the file is still accessible by the user at the time of the request, even when a file was removed from the list of changes and there will be no further change entries for this file. |
| `--include-team-drive-items <value>` | Deprecated: Use `includeItemsFromAllDrives` instead. |
| `--include-permissions-for-view <value>` | Specifies which additional view's permissions to include in the response. Only 'published' is supported. |
| `--supports-team-drives <value>` | Deprecated: Use `supportsAllDrives` instead. |
| `--page-token <value>` | The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response or to the response from the getStartPageToken method. |
| `--page-size <value>` | The maximum number of changes to return. The service may return fewer than this value. If unspecified, at most 100 changes will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000. |
| `--include-removed <value>` | Whether to include changes indicating that items have been removed from the list of changes, for example by deletion or loss of access. |
| `--include-labels <value>` | A comma-separated list of IDs of labels to include in the `labelInfo` part of the response. |
| `--team-drive-id <value>` | Deprecated: Use `driveId` instead. |
| `--spaces <value>` | A comma-separated list of spaces to query within the corpora. Supported values are 'drive' and 'appDataFolder'. |

### `drive api drive-changes-watch`

Subscribes to changes for a user. For more information, see [Notifications for resource changes](https://developers.google.com/workspace/drive/api/guides/push). — write (POST changes/watch)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-changes-watch [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--supports-team-drives <value>` | Deprecated: Use `supportsAllDrives` instead. |
| `--spaces <value>` | A comma-separated list of spaces to query within the corpora. Supported values are 'drive' and 'appDataFolder'. |
| `--include-items-from-all-drives <value>` | Whether both My Drive and shared drive items should be included in results. |
| `--page-size <value>` | The maximum number of changes to return. The service may return fewer than this value. If unspecified, at most 100 changes will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000. |
| `--supports-all-drives <value>` | Whether the requesting application supports both My Drives and shared drives. |
| `--include-labels <value>` | A comma-separated list of IDs of labels to include in the `labelInfo` part of the response. |
| `--restrict-to-my-drive <value>` | Whether to restrict the results to changes inside the My Drive hierarchy. This omits changes to files such as those in the Application Data folder or shared files which have not been added to My Drive. |
| `--team-drive-id <value>` | Deprecated: Use `driveId` instead. |
| `--include-corpus-removals <value>` | Whether changes should include the file resource if the file is still accessible by the user at the time of the request, even when a file was removed from the list of changes and there will be no further change entries for this file. |
| `--include-team-drive-items <value>` | Deprecated: Use `includeItemsFromAllDrives` instead. |
| `--include-removed <value>` | Whether to include changes indicating that items have been removed from the list of changes, for example by deletion or loss of access. |
| `--drive-id <value>` | The shared drive from which changes will be returned. If specified the change IDs will be reflective of the shared drive; use the combined drive ID and change ID as an identifier. |
| `--include-permissions-for-view <value>` | Specifies which additional view's permissions to include in the response. Only 'published' is supported. |
| `--page-token <value>` | The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response or to the response from the getStartPageToken method. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-channels-stop`

Stops watching resources through this channel. For more information, see [Notifications for resource changes](https://developers.google.com/workspace/drive/api/guides/push). — write (POST channels/stop)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-channels-stop [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-comments-create`

Creates a comment on a file. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). Required: The `fields` parameter must be set. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter). — write (POST files/{fileId}/comments)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-comments-create [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--file-id <value>` | The ID of the file. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-comments-delete`

Deletes a comment. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). — destructive (DELETE files/{fileId}/comments/{commentId})

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-comments-delete [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--comment-id <value>` | The ID of the comment. |
| `--file-id <value>` | The ID of the file. |

### `drive api drive-comments-get`

Gets a comment by ID. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). Required: The `fields` parameter must be set. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter). — read (GET files/{fileId}/comments/{commentId})

```sh
drive <profile> api drive-comments-get [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--file-id <value>` | The ID of the file. |
| `--include-deleted <value>` | Whether to return deleted comments. Deleted comments will not include their original content. |
| `--comment-id <value>` | The ID of the comment. |

### `drive api drive-comments-list`

Lists a file's comments. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). Required: The `fields` parameter must be set. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter). — read (GET files/{fileId}/comments)

```sh
drive <profile> api drive-comments-list [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--include-deleted <value>` | Whether to include deleted comments. Deleted comments will not include their original content. |
| `--page-size <value>` | The maximum number of comments to return. The service may return fewer than this value. If unspecified, at most 20 comments will be returned. The maximum value is 100; values above 100 will be coerced to 100. |
| `--page-token <value>` | The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response. |
| `--file-id <value>` | The ID of the file. |
| `--start-modified-time <value>` | The minimum value of 'modifiedTime' for the result comments (RFC 3339 date-time). |

### `drive api drive-comments-update`

Updates a comment with patch semantics. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). Required: The `fields` parameter must be set. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter). — write (PATCH files/{fileId}/comments/{commentId})

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-comments-update [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--comment-id <value>` | The ID of the comment. |
| `--file-id <value>` | The ID of the file. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-drives-create`

Creates a shared drive. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives). — write (POST drives)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-drives-create [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--request-id <value>` | Required. An ID, such as a random UUID, which uniquely identifies this user's request for idempotent creation of a shared drive. A repeated request by the same user and with the same request ID will avoid creating duplicates by attempting to create the same shared drive. If the shared drive already exists a 409 error will be returned. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-drives-delete`

Permanently deletes a shared drive for which the user is an `organizer`. The shared drive cannot contain any untrashed items. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives). — destructive (DELETE drives/{driveId})

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-drives-delete [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--drive-id <value>` | The ID of the shared drive. |
| `--use-domain-admin-access <value>` | Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the shared drive belongs. |
| `--allow-item-deletion <value>` | Whether any items inside the shared drive should also be deleted. This option is only supported when `useDomainAdminAccess` is also set to `true`. |

### `drive api drive-drives-get`

Gets a shared drive's metadata by ID. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives). — read (GET drives/{driveId})

```sh
drive <profile> api drive-drives-get [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--drive-id <value>` | The ID of the shared drive. |
| `--use-domain-admin-access <value>` | Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the shared drive belongs. |

### `drive api drive-drives-hide`

Hides a shared drive from the default view. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives). — write (POST drives/{driveId}/hide)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-drives-hide [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--drive-id <value>` | The ID of the shared drive. |

### `drive api drive-drives-list`

Lists the user's shared drives. This method accepts the `q` parameter, which is a search query combining one or more search terms. For more information, see the [Search for shared drives](https://developers.google.com/workspace/drive/api/guides/search-shareddrives) guide. — read (GET drives)

```sh
drive <profile> api drive-drives-list [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--q <value>` | Query string for searching shared drives. |
| `--page-token <value>` | Page token for shared drives. |
| `--page-size <value>` | The maximum number of shared drives to return. The service may return fewer than this value. If unspecified, at most 10 shared drives will be returned. The maximum value is 100; values above 100 will be coerced to 100. |
| `--use-domain-admin-access <value>` | Issue the request as a domain administrator; if set to true, then all shared drives of the domain in which the requester is an administrator are returned. |

### `drive api drive-drives-unhide`

Restores a shared drive to the default view. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives). — write (POST drives/{driveId}/unhide)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-drives-unhide [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--drive-id <value>` | The ID of the shared drive. |

### `drive api drive-drives-update`

Updates the metadata for a shared drive. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives). — write (PATCH drives/{driveId})

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-drives-update [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--use-domain-admin-access <value>` | Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the shared drive belongs. |
| `--drive-id <value>` | The ID of the shared drive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-files-copy`

Creates a copy of a file and applies any requested updates with patch semantics. For more information, see [Create and manage files](https://developers.google.com/workspace/drive/api/guides/create-file). — write (POST files/{fileId}/copy)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-files-copy [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--file-id <value>` | The ID of the file. |
| `--ignore-default-visibility <value>` | Whether to ignore the domain's default visibility settings for the created file. Domain administrators can choose to make all uploaded files visible to the domain by default; this parameter bypasses that behavior for the request. Permissions are still inherited from parent folders. |
| `--keep-revision-forever <value>` | Whether to set the `keepForever` field in the new head revision. This is only applicable to files with binary content in Google Drive. Only 200 revisions for the file can be kept forever. If the limit is reached, try deleting pinned revisions. |
| `--supports-all-drives <value>` | Whether the requesting application supports both My Drives and shared drives. |
| `--copy-comments <value>` | Whether to copy the open (unresolved) comments associated with the file. |
| `--enforce-single-parent <value>` | Deprecated: Copying files into multiple folders is no longer supported. Use shortcuts instead. |
| `--ocr-language <value>` | A language hint for OCR processing during image import (ISO 639-1 code). |
| `--include-labels <value>` | A comma-separated list of IDs of labels to include in the `labelInfo` part of the response. |
| `--include-permissions-for-view <value>` | Specifies which additional view's permissions to include in the response. Only `published` is supported. |
| `--supports-team-drives <value>` | Deprecated: Use `supportsAllDrives` instead. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-files-create`

Creates a file. For more information, see [Create and manage files](https://developers.google.com/workspace/drive/api/guides/create-file). This method supports an */upload* URI and accepts uploaded media with the following characteristics: - *Maximum file size:* 5,120 GB - *Accepted Media MIME types:* `*/*` (Specify a valid MIME type, rather than the literal `*/*` value. The literal `*/*` is only used to indicate that any valid MIME type can be uploaded. For more information, see [Google Workspace and Google Drive supported MIME types](https://developers.google.com/workspace/drive/api/guides/mime-types).) For more information on uploading files, see [Upload file data](https://developers.google.com/workspace/drive/api/guides/manage-uploads). Apps creating shortcuts with the `create` method must specify the MIME type `application/vnd.google-apps.shortcut`. Apps should specify a file extension in the `name` property when inserting files with the API. For example, an operation to insert a JPEG file should specify something like `"name": "cat.jpg"` in the metadata. Subsequent `GET` requests include the read-only `fileExtension` property populated with the extension originally specified in the `name` property. When a Google Drive user requests to download a file, or when the file is downloaded through the sync client, Drive builds a full filename (with extension) based on the name. In cases where the extension is missing, Drive attempts to determine the extension based on the file's MIME type. — write (POST files)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-files-create [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--supports-all-drives <value>` | Whether the requesting application supports both My Drives and shared drives. |
| `--enforce-single-parent <value>` | Deprecated: Creating files in multiple folders is no longer supported. |
| `--include-labels <value>` | A comma-separated list of IDs of labels to include in the `labelInfo` part of the response. |
| `--ignore-default-visibility <value>` | Whether to ignore the domain's default visibility settings for the created file. Domain administrators can choose to make all uploaded files visible to the domain by default; this parameter bypasses that behavior for the request. Permissions are still inherited from parent folders. |
| `--ocr-language <value>` | A language hint for OCR processing during image import (ISO 639-1 code). |
| `--include-permissions-for-view <value>` | Specifies which additional view's permissions to include in the response. Only `published` is supported. |
| `--supports-team-drives <value>` | Deprecated: Use `supportsAllDrives` instead. |
| `--use-content-as-indexable-text <value>` | Whether to use the uploaded content as indexable text. |
| `--keep-revision-forever <value>` | Whether to set the `keepForever` field in the new head revision. This is only applicable to files with binary content in Google Drive. Only 200 revisions for the file can be kept forever. If the limit is reached, try deleting pinned revisions. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-files-delete`

Permanently deletes a file owned by the user without moving it to the trash. For more information, see [Trash or delete files and folders](https://developers.google.com/workspace/drive/api/guides/delete). If the file belongs to a shared drive, the user must be an `organizer` on the parent folder. If the target is a folder, all descendants owned by the user are also deleted. — destructive (DELETE files/{fileId})

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-files-delete [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--supports-all-drives <value>` | Whether the requesting application supports both My Drives and shared drives. |
| `--supports-team-drives <value>` | Deprecated: Use `supportsAllDrives` instead. |
| `--file-id <value>` | The ID of the file. |
| `--enforce-single-parent <value>` | Deprecated: If an item isn't in a shared drive and its last parent is deleted but the item itself isn't, the item will be placed under its owner's root. |

### `drive api drive-files-download`

Downloads the content of a file. For more information, see [Download and export files](https://developers.google.com/workspace/drive/api/guides/manage-downloads). Operations are valid for 24 hours from the time of creation. — read (POST files/{fileId}/download)

```sh
drive <profile> api drive-files-download [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--file-id <value>` | Required. The ID of the file to download. |
| `--mime-type <value>` | Optional. The MIME type the file should be downloaded as. This field can only be set when downloading Google Workspace documents. For a list of supported MIME types, see [Export MIME types for Google Workspace documents](https://developers.google.com/workspace/drive/api/guides/ref-export-formats). If not set, a Google Workspace document is downloaded with a default MIME type. The default MIME type might change in the future. |
| `--revision-id <value>` | Optional. The revision ID of the file to download. This field can only be set when downloading blob files, Google Docs, and Google Sheets. Returns `INVALID_ARGUMENT` if downloading a specific revision on the file is unsupported. |

### `drive api drive-files-empty-trash`

Permanently deletes all of the user's trashed files. For more information, see [Trash or delete files and folders](https://developers.google.com/workspace/drive/api/guides/delete). — destructive (DELETE files/trash)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-files-empty-trash [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--enforce-single-parent <value>` | Deprecated: If an item isn't in a shared drive and its last parent is deleted but the item itself isn't, the item will be placed under its owner's root. |
| `--drive-id <value>` | If set, empties the trash of the provided shared drive. |

### `drive api drive-files-export`

Exports a Google Workspace document to the requested MIME type and returns exported byte content. For more information, see [Download and export files](https://developers.google.com/workspace/drive/api/guides/manage-downloads). Note that the exported content is limited to 10 MB. — read (GET files/{fileId}/export)

```sh
drive <profile> api drive-files-export [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--mime-type <value>` | Required. The MIME type of the format requested for this export. For a list of supported MIME types, see [Export MIME types for Google Workspace documents](https://developers.google.com/workspace/drive/api/guides/ref-export-formats). |
| `--file-id <value>` | The ID of the file. |

### `drive api drive-files-generate-cse-token`

Generates a CSE token which can be used to create or update CSE files. — read (GET files/generateCseToken)

```sh
drive <profile> api drive-files-generate-cse-token [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--parent <value>` | The ID of the expected parent of the file. Used when generating a JWT for a new CSE file. If specified, the parent will be fetched, and if the parent is a shared drive item, the shared drive's policy will be used to determine the KACLS that should be used. It is invalid to specify both file_id and parent in a single request. |
| `--file-id <value>` | The ID of the file for which the JWT should be generated. If not provided, an id will be generated. |

### `drive api drive-files-generate-ids`

Generates a set of file IDs which can be provided in create or copy requests. For more information, see [Create and manage files](https://developers.google.com/workspace/drive/api/guides/create-file). — read (GET files/generateIds)

```sh
drive <profile> api drive-files-generate-ids [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--space <value>` | The space in which the IDs can be used to create files. Supported values are `drive` and `appDataFolder`. (Default: `drive`.) For more information, see [File organization](https://developers.google.com/workspace/drive/api/guides/about-files#file-organization). |
| `--type <value>` | The type of items which the IDs can be used for. Supported values are `files` and `shortcuts`. Note that `shortcuts` are only supported in the `drive` `space`. (Default: `files`.) For more information, see [File organization](https://developers.google.com/workspace/drive/api/guides/about-files#file-organization). |
| `--count <value>` | The number of IDs to return. |

### `drive api drive-files-get`

Gets a file's metadata or content by ID. For more information, see [Search for files and folders](https://developers.google.com/workspace/drive/api/guides/search-files). If you provide the URL parameter `alt=media`, then the response includes the file contents in the response body. Downloading content with `alt=media` only works if the file is stored in Drive. To download Google Docs, Sheets, and Slides use [`files.export`](https://developers.google.com/workspace/drive/api/reference/rest/v3/files/export) instead. For more information, see [Download and export files](https://developers.google.com/workspace/drive/api/guides/manage-downloads). — read (GET files/{fileId})

```sh
drive <profile> api drive-files-get [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--supports-all-drives <value>` | Whether the requesting application supports both My Drives and shared drives. |
| `--acknowledge-abuse <value>` | Whether the user is acknowledging the risk of downloading known malware or other abusive files. This is only applicable when the `alt` parameter is set to `media` and the user is the owner of the file or an organizer of the shared drive in which the file resides. |
| `--include-labels <value>` | A comma-separated list of IDs of labels to include in the `labelInfo` part of the response. |
| `--include-permissions-for-view <value>` | Specifies which additional view's permissions to include in the response. Only `published` is supported. |
| `--file-id <value>` | The ID of the file. |
| `--supports-team-drives <value>` | Deprecated: Use `supportsAllDrives` instead. |

### `drive api drive-files-list`

Lists the user's files. For more information, see [Search for files and folders](https://developers.google.com/workspace/drive/api/guides/search-files). This method accepts the `q` parameter, which is a search query combining one or more search terms. This method returns *all* files by default, including trashed files. If you don't want trashed files to appear in the list, use the `trashed=false` query parameter to remove trashed files from the results. — read (GET files)

```sh
drive <profile> api drive-files-list [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--corpus <value>` | Deprecated: The source of files to list. Use `corpora` instead. |
| `--include-permissions-for-view <value>` | Specifies which additional view's permissions to include in the response. Only `published` is supported. |
| `--supports-team-drives <value>` | Deprecated: Use `supportsAllDrives` instead. |
| `--corpora <value>` | Specifies a collection of items (files or documents) to which the query applies. Supported items include: * `user` * `domain` * `drive` * `allDrives` Prefer `user` or `drive` to `allDrives` for efficiency. By default, corpora is set to `user`. However, this can change depending on the filter set through the `q` parameter. For more information, see [File organization](https://developers.google.com/workspace/drive/api/guides/about-files#file-organization). |
| `--supports-all-drives <value>` | Whether the requesting application supports both My Drives and shared drives. |
| `--page-size <value>` | The maximum number of files to return. The service may return fewer than this value. If unspecified, at most 100 files will be returned for shared drives, and the entire list of files for non-shared drives. The maximum value is 1000; values above 1000 will be coerced to 1000. |
| `--spaces <value>` | A comma-separated list of spaces to query within the corpora. Supported values are `drive` and `appDataFolder`. For more information, see [File organization](https://developers.google.com/workspace/drive/api/guides/about-files#file-organization). |
| `--team-drive-id <value>` | Deprecated: Use `driveId` instead. |
| `--order-by <value>` | A comma-separated list of sort keys. Valid keys are: * `createdTime`: When the file was created. Avoid using this key for queries on large item collections as it might result in timeouts or other issues. For time-related sorting on large item collections, use `modifiedTime desc` instead. * `folder`: The folder ID. This field is sorted using alphabetical ordering. * `modifiedByMeTime`: The last time the file was modified by the user. * `modifiedTime`: The last time the file was modified by anyone. * `name`: The name of the file. This field is sorted using alphabetical ordering, so 1, 12, 2, 22. * `name_natural`: The name of the file. This field is sorted using natural sort ordering, so 1, 2, 12, 22. * `quotaBytesUsed`: The number of storage quota bytes used by the file. * `recency`: The most recent timestamp from the file's date-time fields. * `sharedWithMeTime`: When the file was shared with the user, if applicable. * `starred`: Whether the user has starred the file. * `viewedByMeTime`: The last time the file was viewed by the user. Each key sorts ascending by default, but can be reversed with the `desc` modifier. Example usage: `?orderBy=folder,modifiedTime desc,name`. |
| `--page-token <value>` | The token for continuing a previous list request on the next page. This should be set to the value of `nextPageToken` from the previous response. |
| `--include-team-drive-items <value>` | Deprecated: Use `includeItemsFromAllDrives` instead. |
| `--include-labels <value>` | A comma-separated list of IDs of labels to include in the `labelInfo` part of the response. |
| `--include-items-from-all-drives <value>` | Whether both My Drive and shared drive items should be included in results. |
| `--q <value>` | A query for filtering the file results. For supported syntax, see [Search for files and folders](https://developers.google.com/workspace/drive/api/guides/search-files). |
| `--drive-id <value>` | ID of the shared drive to search. |

### `drive api drive-files-list-labels`

Lists the labels on a file. For more information, see [List labels on a file](https://developers.google.com/workspace/drive/api/guides/list-labels). — read (GET files/{fileId}/listLabels)

```sh
drive <profile> api drive-files-list-labels [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--max-results <value>` | The maximum number of labels to return per page. When not set, defaults to 100. |
| `--page-token <value>` | The token for continuing a previous list request on the next page. This should be set to the value of `nextPageToken` from the previous response. |
| `--file-id <value>` | The ID for the file. |

### `drive api drive-files-modify-labels`

Modifies the set of labels applied to a file. For more information, see [Set a label field on a file](https://developers.google.com/workspace/drive/api/guides/set-label). Returns a list of the labels that were added or modified. — write (POST files/{fileId}/modifyLabels)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-files-modify-labels [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--file-id <value>` | The ID of the file to which the labels belong. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-files-update`

Updates a file's metadata, content, or both. When calling this method, only populate fields in the request that you want to modify. When updating fields, some fields might be changed automatically, such as `modifiedDate`. This method supports patch semantics. This method supports an */upload* URI and accepts uploaded media with the following characteristics: - *Maximum file size:* 5,120 GB - *Accepted Media MIME types:* `*/*` (Specify a valid MIME type, rather than the literal `*/*` value. The literal `*/*` is only used to indicate that any valid MIME type can be uploaded. For more information, see [Google Workspace and Google Drive supported MIME types](https://developers.google.com/workspace/drive/api/guides/mime-types).) For more information on uploading files, see [Upload file data](https://developers.google.com/workspace/drive/api/guides/manage-uploads). — write (PATCH files/{fileId})

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-files-update [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--ocr-language <value>` | A language hint for OCR processing during image import (ISO 639-1 code). |
| `--supports-team-drives <value>` | Deprecated: Use `supportsAllDrives` instead. |
| `--enforce-single-parent <value>` | Deprecated: Adding files to multiple folders is no longer supported. Use shortcuts instead. |
| `--add-parents <value>` | A comma-separated list of parent IDs to add. |
| `--supports-all-drives <value>` | Whether the requesting application supports both My Drives and shared drives. |
| `--keep-revision-forever <value>` | Whether to set the `keepForever` field in the new head revision. This is only applicable to files with binary content in Google Drive. Only 200 revisions for the file can be kept forever. If the limit is reached, try deleting pinned revisions. |
| `--file-id <value>` | The ID of the file. |
| `--include-labels <value>` | A comma-separated list of IDs of labels to include in the `labelInfo` part of the response. |
| `--include-permissions-for-view <value>` | Specifies which additional view's permissions to include in the response. Only `published` is supported. |
| `--remove-parents <value>` | A comma-separated list of parent IDs to remove. |
| `--use-content-as-indexable-text <value>` | Whether to use the uploaded content as indexable text. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-files-watch`

Subscribes to changes to a file. For more information, see [Notifications for resource changes](https://developers.google.com/workspace/drive/api/guides/push). — write (POST files/{fileId}/watch)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-files-watch [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--file-id <value>` | The ID of the file. |
| `--include-labels <value>` | A comma-separated list of IDs of labels to include in the `labelInfo` part of the response. |
| `--supports-team-drives <value>` | Deprecated: Use `supportsAllDrives` instead. |
| `--include-permissions-for-view <value>` | Specifies which additional view's permissions to include in the response. Only `published` is supported. |
| `--supports-all-drives <value>` | Whether the requesting application supports both My Drives and shared drives. |
| `--acknowledge-abuse <value>` | Whether the user is acknowledging the risk of downloading known malware or other abusive files. This is only applicable when the `alt` parameter is set to `media` and the user is the owner of the file or an organizer of the shared drive in which the file resides. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-operations-get`

Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service. — read (GET operations/{name})

```sh
drive <profile> api drive-operations-get [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--name <value>` | The name of the operation resource. |

### `drive api drive-permissions-create`

Creates a permission for a file or shared drive. For more information, see [Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing). **Warning:** Concurrent permission modifications (such as update or delete) on the same file, folder, or shared drive aren't supported across any users or clients; only the last update is applied. — write (POST files/{fileId}/permissions)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-permissions-create [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--enforce-expansive-access <value>` | Deprecated: All requests use the expansive access rules. |
| `--supports-all-drives <value>` | Whether the requesting application supports both My Drives and shared drives. |
| `--send-notification-email <value>` | Whether to send a notification email when sharing to users or groups. This defaults to `true` for users and groups, and is not allowed for other requests. It must not be disabled for ownership transfers. |
| `--use-domain-admin-access <value>` | Issue the request as a domain administrator. If set to `true`, and if the following additional conditions are met, the requester is granted access: 1. The file ID parameter refers to a shared drive. 2. The requester is an administrator of the domain to which the shared drive belongs. For more information, see [Manage shared drives as domain administrators](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives#manage-administrators). |
| `--transfer-ownership <value>` | Whether to transfer ownership to the specified user and downgrade the current owner to a writer. This parameter is required as an acknowledgement of the side effect. For more information, see [Transfer file ownership](https://developers.google.com/workspace/drive/api/guides/transfer-file). |
| `--file-id <value>` | The ID of the file or shared drive. |
| `--supports-team-drives <value>` | Deprecated: Use `supportsAllDrives` instead. |
| `--email-message <value>` | A plain text custom message to include in the notification email. |
| `--enforce-single-parent <value>` | Deprecated: See `moveToNewOwnersRoot` for details. |
| `--move-to-new-owners-root <value>` | This parameter only takes effect if the item isn't in a shared drive and the request is attempting to transfer the ownership of the item. If set to `true`, the item is moved to the new owner's My Drive root folder and all prior parents removed. If set to `false`, parents aren't changed. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-permissions-delete`

Deletes a permission. For more information, see [Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing). **Warning:** Concurrent permission modifications (such as update or delete) on the same file, folder, or shared drive aren't supported across any users or clients; only the last update is applied. — destructive (DELETE files/{fileId}/permissions/{permissionId})

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-permissions-delete [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--use-domain-admin-access <value>` | Issue the request as a domain administrator. If set to `true`, and if the following additional conditions are met, the requester is granted access: 1. The file ID parameter refers to a shared drive. 2. The requester is an administrator of the domain to which the shared drive belongs. For more information, see [Manage shared drives as domain administrators](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives#manage-administrators). |
| `--supports-all-drives <value>` | Whether the requesting application supports both My Drives and shared drives. |
| `--permission-id <value>` | The ID of the permission. |
| `--enforce-expansive-access <value>` | Deprecated: All requests use the expansive access rules. |
| `--supports-team-drives <value>` | Deprecated: Use `supportsAllDrives` instead. |
| `--file-id <value>` | The ID of the file or shared drive. |

### `drive api drive-permissions-get`

Gets a permission by ID. For more information, see [Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing). — read (GET files/{fileId}/permissions/{permissionId})

```sh
drive <profile> api drive-permissions-get [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--permission-id <value>` | The ID of the permission. |
| `--supports-team-drives <value>` | Deprecated: Use `supportsAllDrives` instead. |
| `--use-domain-admin-access <value>` | Issue the request as a domain administrator. If set to `true`, and if the following additional conditions are met, the requester is granted access: 1. The file ID parameter refers to a shared drive. 2. The requester is an administrator of the domain to which the shared drive belongs. For more information, see [Manage shared drives as domain administrators](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives#manage-administrators). |
| `--supports-all-drives <value>` | Whether the requesting application supports both My Drives and shared drives. |
| `--file-id <value>` | The ID of the file. |

### `drive api drive-permissions-list`

Lists a file's or shared drive's permissions. For more information, see [Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing). — read (GET files/{fileId}/permissions)

```sh
drive <profile> api drive-permissions-list [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--use-domain-admin-access <value>` | Issue the request as a domain administrator. If set to `true`, and if the following additional conditions are met, the requester is granted access: 1. The file ID parameter refers to a shared drive. 2. The requester is an administrator of the domain to which the shared drive belongs. For more information, see [Manage shared drives as domain administrators](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives#manage-administrators). |
| `--page-token <value>` | The token for continuing a previous list request on the next page. This should be set to the value of `nextPageToken` from the previous response. |
| `--file-id <value>` | The ID of the file or shared drive. |
| `--supports-team-drives <value>` | Deprecated: Use `supportsAllDrives` instead. |
| `--supports-all-drives <value>` | Whether the requesting application supports both My Drives and shared drives. |
| `--page-size <value>` | The maximum number of permissions to return. The service may return fewer than this value. If unspecified, at most 100 permissions will be returned for shared drives, and the entire list of permissions for non-shared drives. The maximum value is 100; values above 100 will be coerced to 100. |
| `--include-permissions-for-view <value>` | Specifies which additional view's permissions to include in the response. Only `published` is supported. |

### `drive api drive-permissions-update`

Updates a permission with patch semantics. For more information, see [Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing). **Warning:** Concurrent permission modifications (such as update or delete) on the same file, folder, or shared drive aren't supported across any users or clients; only the last update is applied. — write (PATCH files/{fileId}/permissions/{permissionId})

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-permissions-update [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--use-domain-admin-access <value>` | Issue the request as a domain administrator. If set to `true`, and if the following additional conditions are met, the requester is granted access: 1. The file ID parameter refers to a shared drive. 2. The requester is an administrator of the domain to which the shared drive belongs. For more information, see [Manage shared drives as domain administrators](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives#manage-administrators). |
| `--transfer-ownership <value>` | Whether to transfer ownership to the specified user and downgrade the current owner to a writer. This parameter is required as an acknowledgement of the side effect. For more information, see [Transfer file ownership](https://developers.google.com//workspace/drive/api/guides/transfer-file). |
| `--enforce-expansive-access <value>` | Deprecated: All requests use the expansive access rules. |
| `--supports-all-drives <value>` | Whether the requesting application supports both My Drives and shared drives. |
| `--supports-team-drives <value>` | Deprecated: Use `supportsAllDrives` instead. |
| `--file-id <value>` | The ID of the file or shared drive. |
| `--remove-expiration <value>` | Whether to remove the expiration date. |
| `--permission-id <value>` | The ID of the permission. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-replies-create`

Creates a reply to a comment. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). — write (POST files/{fileId}/comments/{commentId}/replies)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-replies-create [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--comment-id <value>` | The ID of the comment. |
| `--file-id <value>` | The ID of the file. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-replies-delete`

Deletes a reply. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). — destructive (DELETE files/{fileId}/comments/{commentId}/replies/{replyId})

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-replies-delete [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--comment-id <value>` | The ID of the comment. |
| `--reply-id <value>` | The ID of the reply. |
| `--file-id <value>` | The ID of the file. |

### `drive api drive-replies-get`

Gets a reply by ID. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). — read (GET files/{fileId}/comments/{commentId}/replies/{replyId})

```sh
drive <profile> api drive-replies-get [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--include-deleted <value>` | Whether to return deleted replies. Deleted replies don't include their original content. |
| `--file-id <value>` | The ID of the file. |
| `--comment-id <value>` | The ID of the comment. |
| `--reply-id <value>` | The ID of the reply. |

### `drive api drive-replies-list`

Lists a comment's replies. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). — read (GET files/{fileId}/comments/{commentId}/replies)

```sh
drive <profile> api drive-replies-list [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--page-size <value>` | The maximum number of replies to return. The service may return fewer than this value. If unspecified, at most 20 replies will be returned. The maximum value is 100; values above 100 will be coerced to 100. |
| `--file-id <value>` | The ID of the file. |
| `--comment-id <value>` | The ID of the comment. |
| `--page-token <value>` | The token for continuing a previous list request on the next page. This should be set to the value of `nextPageToken` from the previous response. |
| `--include-deleted <value>` | Whether to include deleted replies. Deleted replies don't include their original content. |

### `drive api drive-replies-update`

Updates a reply with patch semantics. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). — write (PATCH files/{fileId}/comments/{commentId}/replies/{replyId})

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-replies-update [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--comment-id <value>` | The ID of the comment. |
| `--file-id <value>` | The ID of the file. |
| `--reply-id <value>` | The ID of the reply. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-revisions-delete`

Permanently deletes a file version. You can only delete revisions for files with binary content in Google Drive, like images or videos. Revisions for other files, like Google Docs or Sheets, and the last remaining file version can't be deleted. For more information, see [Manage file revisions](https://developers.google.com/drive/api/guides/manage-revisions). — destructive (DELETE files/{fileId}/revisions/{revisionId})

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-revisions-delete [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--file-id <value>` | The ID of the file. |
| `--revision-id <value>` | The ID of the revision. |

### `drive api drive-revisions-get`

Gets a revision's metadata or content by ID. For more information, see [Manage file revisions](https://developers.google.com/workspace/drive/api/guides/manage-revisions). — read (GET files/{fileId}/revisions/{revisionId})

```sh
drive <profile> api drive-revisions-get [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--revision-id <value>` | The ID of the revision. |
| `--file-id <value>` | The ID of the file. |
| `--acknowledge-abuse <value>` | Whether the user is acknowledging the risk of downloading known malware or other abusive files. This is only applicable when the `alt` parameter is set to `media` and the user is the owner of the file or an organizer of the shared drive in which the file resides. |

### `drive api drive-revisions-list`

Lists a file's revisions. For more information, see [Manage file revisions](https://developers.google.com/workspace/drive/api/guides/manage-revisions). **Important:** The list of revisions returned by this method might be incomplete for files with a large revision history, including frequently edited Google Docs, Sheets, and Slides. Older revisions might be omitted from the response, meaning the first revision returned may not be the oldest existing revision. The revision history visible in the Workspace editor user interface might be more complete than the list returned by the API. — read (GET files/{fileId}/revisions)

```sh
drive <profile> api drive-revisions-list [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--page-size <value>` | The maximum number of revisions to return. The service may return fewer than this value. If unspecified, at most 200 revisions will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000. |
| `--file-id <value>` | The ID of the file. |
| `--page-token <value>` | The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response. |

### `drive api drive-revisions-update`

Updates a revision with patch semantics. For more information, see [Manage file revisions](https://developers.google.com/workspace/drive/api/guides/manage-revisions). — write (PATCH files/{fileId}/revisions/{revisionId})

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-revisions-update [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--file-id <value>` | The ID of the file. |
| `--revision-id <value>` | The ID of the revision. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-teamdrives-create`

Deprecated: Use `drives.create` instead. — write (POST teamdrives)

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-teamdrives-create [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--request-id <value>` | Required. An ID, such as a random UUID, which uniquely identifies this user's request for idempotent creation of a Team Drive. A repeated request by the same user and with the same request ID will avoid creating duplicates by attempting to create the same Team Drive. If the Team Drive already exists a 409 error will be returned. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api drive-teamdrives-delete`

Deprecated: Use `drives.delete` instead. — destructive (DELETE teamdrives/{teamDriveId})

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-teamdrives-delete [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--team-drive-id <value>` | The ID of the Team Drive. |

### `drive api drive-teamdrives-get`

Deprecated: Use `drives.get` instead. — read (GET teamdrives/{teamDriveId})

```sh
drive <profile> api drive-teamdrives-get [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--team-drive-id <value>` | The ID of the Team Drive. |
| `--use-domain-admin-access <value>` | Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the Team Drive belongs. |

### `drive api drive-teamdrives-list`

Deprecated: Use `drives.list` instead. — read (GET teamdrives)

```sh
drive <profile> api drive-teamdrives-list [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--q <value>` | Query string for searching Team Drives. |
| `--page-size <value>` | Maximum number of Team Drives to return. |
| `--use-domain-admin-access <value>` | Issue the request as a domain administrator; if set to true, then all Team Drives of the domain in which the requester is an administrator are returned. |
| `--page-token <value>` | Page token for Team Drives. |

### `drive api drive-teamdrives-update`

Deprecated: Use `drives.update` instead. — write (PATCH teamdrives/{teamDriveId})

This command can change Google data or send data to the configured model.

```sh
drive <profile> api drive-teamdrives-update [options]
```

| Option | What it does |
|---|---|
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--$.xgafv <value>` | V1 error format. |
| `--callback <value>` | JSONP. |
| `--alt <value>` | Data format for response. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--use-domain-admin-access <value>` | Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the Team Drive belongs. |
| `--team-drive-id <value>` | The ID of the Team Drive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `drive api driveactivity-activity-query`

Query past activity in Google Drive. — read (POST v2/activity:query)

```sh
drive <profile> api driveactivity-activity-query [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for response. |
| `--callback <value>` | JSONP. |
| `--$.xgafv <value>` | V1 error format. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

## `drive files`

read and change files in Google Drive; nothing is imported

### `drive files list`

list files in Google Drive, one page at a time

```sh
drive <profile> files list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | Google Drive query the files match; trashed = false when omitted. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many items one page holds. Default: `100`. |
| `--cursor <cursor>` | continue from page.next_cursor of the previous answer. |
| `--parent <id>` | only the files directly inside this folder id. |

### `drive files get`

show one file's Google Drive metadata

```sh
drive <profile> files get <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | file id or Google Drive URL. |

### `drive files copy`

copy a file in Google Drive

This command can change Google data or send data to the configured model.

```sh
drive <profile> files copy <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | file id or Google Drive URL. |

| Option | What it does |
|---|---|
| `--name <name>` | name of the copy; Google's default when omitted. |
| `--parent <id>` | folder id to put the copy in. |

### `drive files move`

move a file to another Google Drive folder

This command can change Google data or send data to the configured model.

```sh
drive <profile> files move <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | file id or Google Drive URL. |

| Option | What it does |
|---|---|
| `--parent <id>` | folder id to move the file into. |
| `--old-parent <id>` | folder id to take the file out of. |

### `drive files update`

change a file's Google Drive metadata

This command can change Google data or send data to the configured model.

```sh
drive <profile> files update <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | file id or Google Drive URL. |

| Option | What it does |
|---|---|
| `--body <json>` | the metadata fields to change, as a JSON object. |

### `drive files trash`

move a file to the Google Drive trash

This command can change Google data or send data to the configured model.

```sh
drive <profile> files trash <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | file id or Google Drive URL. |

### `drive files restore`

take a file out of the trash

This command can change Google data or send data to the configured model.

```sh
drive <profile> files restore <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | file id or Google Drive URL. |

### `drive files mkdir`

create an empty folder in Google Drive

This command can change Google data or send data to the configured model.

```sh
drive <profile> files mkdir <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | folder name. |

| Option | What it does |
|---|---|
| `--parent <id>` | folder id to create it in; My Drive when omitted. |

## `drive comments`

read the comments of a file in Google Drive

### `drive comments list`

list a file's comments

```sh
drive <profile> comments list <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | file id or Google Drive URL. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many items one page holds. Default: `100`. |
| `--cursor <cursor>` | continue from page.next_cursor of the previous answer. |

### `drive comments get`

show one comment of a file

```sh
drive <profile> comments get <file> <comment-id>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | file id or Google Drive URL. |
| `comment-id` | required | comment id, as comments list prints it. |

## `drive permissions`

read the permissions of a file in Google Drive

### `drive permissions list`

list a file's permissions

```sh
drive <profile> permissions list <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | file id or Google Drive URL. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many items one page holds. Default: `100`. |
| `--cursor <cursor>` | continue from page.next_cursor of the previous answer. |

### `drive permissions get`

show one permission of a file

```sh
drive <profile> permissions get <file> <permission-id>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | file id or Google Drive URL. |
| `permission-id` | required | permission id, as permissions list prints it. |

## `drive revisions`

read the revisions of a file in Google Drive

### `drive revisions list`

list a file's revisions

```sh
drive <profile> revisions list <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | file id or Google Drive URL. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many items one page holds. Default: `100`. |
| `--cursor <cursor>` | continue from page.next_cursor of the previous answer. |

### `drive revisions get`

show one revision of a file

```sh
drive <profile> revisions get <file> <revision-id>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | file id or Google Drive URL. |
| `revision-id` | required | revision id, as revisions list prints it. |

## `drive shared-drives`

list the shared drives this account can open

```sh
drive <profile> shared-drives [options]
```

| Option | What it does |
|---|---|
| `--limit <n>` | how many items one page holds. Default: `100`. |
| `--cursor <cursor>` | continue from page.next_cursor of the previous answer. |

## `drive config`

read and change settings; credentials are kept apart

### `drive config show`

show the defaults and every profile's settings

```sh
drive <profile> config show
```

### `drive config set`

set one setting of this profile, or of the defaults

This command changes local state.

```sh
drive <profile> config set <key> <json-value> [options]
```

| Argument | | What it is |
|---|---|---|
| `key` | required | read_only, max_text_chars, picture_search, shared AI settings, permissions.<key> or models.<purpose>.<field>. |
| `json-value` | required | the new value, as JSON. |

| Option | What it does |
|---|---|
| `--defaults` | change the defaults instead of this profile. |

## `drive complete`

print a shell completion script, or complete words

```sh
drive complete [words]
```

| Argument | | What it is |
|---|---|---|
| `words` | optional | a shell name, or after -- the words typed so far. |

## `drive models`

choose the model that proposes memories; keys stay out of config

### `drive models set`

set the provider and model for one use

This command changes local state.

```sh
drive <profile> models set [options]
```

| Option | What it does |
|---|---|
| `--purpose <purpose>` | what the model is used for. Default: `memories`. |
| `--provider <provider>` | who runs the model, or off to use none. One of: `openai`, `anthropic`, `off`. |
| `--model <model>` | model id at the provider. |
| `--base-url <url>` | HTTP or HTTPS address of the model API, without credentials in it. |

## `drive mcp`

serve drive's commands to an agent over MCP on stdio

```sh
drive <profile> mcp [options]
```

| Option | What it does |
|---|---|
| `--tools` | list the tools offered instead of starting the server. |

## `drive commands`

print the command tree and its options as data

```sh
drive commands [path]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | only this command or group, as words. |

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
