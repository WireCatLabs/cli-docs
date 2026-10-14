---
title: "История изменений"
---

Технические сведения о выпусках ниже сохранены на языке исходного проекта. Практические инструкции доступны в переведённых руководствах.

## 0.6.0 — 2026-10-14

- **An interrupted first folder walk resumes.** `sync` saves the walk as it goes (`walk.json` beside the sync
  state); the next run lists only the folders it had not reached, with the change token taken before the walk.
  `sync --rescan` starts the walk over.
- **Sync state is saved every 25 files or 2 seconds**, not after every file, so a large profile no longer rewrites
  its whole state per file. A cancelled or failed sync still saves what it finished; a killed one redoes at most
  one batch. The 10,000-entry limit stays: the plan still holds every entry in memory and in one state file.
- **Commands say what they touch (breaking).** `commands --json` (contract 3) replaces `mutates`, `local` and
  `operation_id` with `effects: {remote, local}` (`none`, `read` or `write`) and `api_operation`. `--dry-run` previews
  and `mcp --tools` show `effects` too. MCP tools that read only local data no longer claim to reach the network.
- **Errors say whether a retry is safe.** `retry: {safe}` is judged from the failed command's effects: a transient
  failure of `documents get` is safe to retry, the same failure of `files copy` is not.
- **`search` and `notes list` page with `--page` (breaking).** `--offset` is gone; a list's `page` says
  `mode: "page"` and gives `next_page` when there is more. Every answer carries `meta.complete`. `--jsonl` prints one
  `{"type":"item","data":…}` line per item, then a `{"type":"end",…}` line.
- **`--agent-json` is gone (breaking).** MCP answers always show control and direction characters visibly; `--json`
  keeps text as it is.
- `folders remove` no longer returns a `next` sentence; its help says the next sync drops the folder's documents.
- Adopt cli-core 0.275.0 and cli-base 0.28.2.

## 0.5.0 — 2026-10-14

- **JSON contract 2 (breaking).** Command answers use `item` or `items`/`page` plus `meta`, with snake_case keys. Search passages are under `item.hits`; sync/status results are under `item`. Discovery retains the shared `commands --json` format and advertises contract 2. Provider metadata, JSON Schemas and user dictionary keys retain their vocabulary. MCP returns the same envelope without an extra `result` wrapper.
- **Existing settings migrate safely.** Read configuration through cli-core's shared loader. Old camelCase settings, including AI model URLs and Drive controls, move to snake_case once, retaining file permissions, profile names, permission paths and model-purpose names. Conflicting aliases are refused without rewriting. Existing camelCase `config set` spellings remain accepted as aliases.
- **MCP arguments are validated and audited by Drive.** Bad types, missing fields and unknown arguments return field-specific `validation_error` replies instead of SDK text. Calls are logged through the shared store without argument/response bodies. A failed audit write cannot hide a completed operation's result.
- Adopt cli-core 0.268.0 and cli-base 0.27.2, preserve shared error reasons/details through `failureContext`, and update the search adapter to the shared snake_case result fields.

## 0.4.0 — 2026-10-14

- **Drive images found by what they show.** With `drive <profile> config set pictureSearch true`, sync downloads each
  image file (up to 25 MB, only where Google allows downloads), gives it a picture vector with the local model and
  keeps no copy of the file. Sync counts them in `pictures`. `search` adds a `pictures` list (`ref`, `score`, `title`,
  `source_url`) next to `hits`; queries must be in English. A missing model is reported once as `pictures_skipped` and
  does not fail the sync. Off by default. Runs on cli-core 0.265.0 and cli-base 0.27.1.

- **`drive sync` states its 10,000-entry cap, and its errors say what works.** The help, README and usage guide now
  say one sync reads at most 10,000 entries under the chosen folders and 10,000 changes. Past the change-feed cap the
  error no longer just says "retry with --rescan": it says a rescan works only while the folders hold at most 10,000
  entries. Past the folder cap it says to choose fewer or smaller folders.

- **Offline file and folder catalog.** Sync stores metadata and parent relationships in the shared database for every selected file/folder, including unreadable formats and pending content. `catalog import` backfills the saved checkpoint without Google; `catalog list`, `show`, `search` and `tree` browse it offline. Filter names, MIME types, observed owners/editors and local tags. Folder tags, notes and relationships reuse existing knowledge APIs; metadata refresh preserves indexed text and stable references.

- **One error handler, cli-base's.** A failure prints one error object on stderr,
  `{"error": {"code", "reason", "message", "param"?, "details"?}}`, or a `✗ message` line at a terminal. A crash
  that is not a known failure is `internal_error` with reason `command.crashed` and exit code 1, in place of
  `provider_error`; its own text is never printed. The new `--debug` flag adds the whole record, with the cause and
  the stack. Each failure drive raises names a registered `reason` (`policy.denied`, `sign-in.expired`,
  `document.not-imported`, …), and `details` keeps only the keys registered for it: they are now under
  `error.details`, not beside `code`. MCP tools return the same object as `structuredContent`.
- **drive's own JSON keys are snake_case.** `session list` `selected_folders`; `session end` `signed_out`,
  `cached_data`; `session start` `signed_in`; `status` `selected_folders`, `last_sync`, `remote_checked`;
  `documents list` and `documents show` file fields `modified_at`, `can_download`, `created_at`, `drive_id`,
  `last_modified_by`; `--dry-run` `dry_run` and `body_provided`; `api show` `request_schema`; `documents history`
  `file_id`; `memories search` `candidate_limit_reached`; `identities list` `google_id`; `memories extract`
  provenance `file_id`; `mcp --tools` `input_schema`; `commands --json` `global_options`, `inherited_options`,
  `exit_codes`, `operation_id` and `takes_value`, with its `contract` raised to 1. Google's own answers (`api`,
  `files`, `comments` and the rest) keep Google's names.
- **drive runs on `@wirecat/cli-base` 0.27.1 and `@wirecat/cli-core` 0.265.0**, the renamed `@wirecat/cli-messaging`.

- **Files drive cannot read are found by their name.** A scanned PDF, an image, a Slides deck, a file Google
  restricts for download or a file over the text limit is now saved with its name, type, size, owners and link, and
  no text, instead of being left out of the index. `search` matches the words in its name; the hit has `not_read` with
  the reason (`null` for a file drive read), so an agent opens `source_url` instead of quoting text that is not there.
  `drive sync` reports a `names_only` count beside `saved`, `documents show` shows `not_read`, and the `skipped` list
  still says why. Trashed or removed files leave the index as before, and the next sync replaces an entry with the
  full text once drive can read the file. Files skipped by an older version are saved by name when they change or on
  `sync --rescan`.

## 0.3.0 — 2026-10-13

- **The local search models live in the WireCat folder.** drive now runs on `@wirecat/cli-messaging` 0.258.0 and
  `@wirecat/cli-base` 0.24.0, which keep the shared models in `~/.local/share/WireCat/models/` (Windows:
  `%LOCALAPPDATA%\WireCat\Data\models\`). `WIRECAT_STATE_DIR` moves that folder and replaces
  `CLI_COMMON_CACHE_DIR`, which is no longer read. drive does not move models from `~/.cache/cli-common/models`
  itself; tg, max and memo do on their first start after their upgrade. drive's own database, `drive.db`, does not
  move.
- **`commands --json` names exit code 1 `internal_error`**, in place of `generic_failure`.
- **The write journal (`sends/<profile>.jsonl`) writes cli-base's log record**, naming drive and its version.
  Lines written before are still read.
- **Command names follow the shared WireCat standard; the old names are gone.** `links` is `relationships`,
  `people` is `identities`, `facts accept` is `facts confirm`, `models configure` is `models set`, `api methods` is
  `api list` and `schema` is `api show`; the `memos` alias of `notes` is removed. Paging flags are `--cursor`
  (was `--page-token`), `sync --limit` (was `--max`), and `files move --parent` / `--old-parent` (were `--to` /
  `--from`). Arguments have one name per thing: `<document>`, `<folder>`, `<note>`, `<memory>`, `<fact>`,
  `<person>`, `<comment-id>`. MCP tool names follow (`drive_relationships_list`, `drive_api_show`, …). Every
  command, argument and option has help text, and every command lists examples in `--help` and `commands --json`.
- **Sheets, PDFs and Office files are searchable.** `drive sync` exports native Google Sheets as `.xlsx` and reads
  every sheet, and reads uploaded PDF, Word `.docx`, Excel `.xlsx`, CSV and TSV files with the shared document
  readers. `documents show` lists each sheet as a heading; a row reads as `Row 2: Column: value`. A scanned PDF without a
  text layer, a Sheet over Google's 10 MB export cap and a file over 50 MB are skipped with that reason. Files
  that an older version skipped only for their type are read on the next sync. Adds `unpdf` and `mammoth`.
- **Longer files are imported, and the limit is a setting.** A file's text may now be up to 2 000 000
  characters (was 200 000), the most the document readers return; text that reaches the limit is skipped, never
  stored cut off. `drive <profile> config set maxTextChars <n>` lowers it for a profile or, with `--defaults`, for
  all. A file skipped for its length, including by 0.2.0, is read again on the next sync once the limit allows it.
- **`drive commands --json` prints the shared document shape.** The answer is `{ cli, version, contract,
  description, globalOptions, commands, exitCodes }`, the same as tg and max; `commands <path>` adds `scope` and
  `inheritedOptions` and puts the one command under `commands`. The old `items` field is gone.
- **Files the local store refused are retried after an upgrade.** When the shared store rejects a file's text, the
  skip says so and the file is read again on the first sync after drive is upgraded, without `--rescan`.

## 0.2.0 — 2026-10-12

- **Facts are their own thing, as in the shared store.** `drive facts add|list|show|accept` keep what happened —
  a fact, statement, question, decision or promise — on a document; yours is accepted at once. `memories
  extract --save` saves the facts it finds as proposed facts and the rest as memories. A memory's kind is
  summary, digest or preference (default summary): `--kind fact` is gone, and memories of kind fact saved by
  0.1.0 show under `facts list` after the shared store upgrades. `documents context` lists the facts too.
  Agents over MCP can list and read facts, not add or accept them.
- Built on the shared framework under its new name, `@wirecat/cli-base` 0.21.0, and `@wirecat/cli-messaging`
  0.253.0 (from 0.231.0); an install holds one framework copy.

## 0.1.0 — 2026-10-11

- Import selected Google folders recursively, including native Docs across tabs and uploaded Markdown/TXT.
- Keep searchable text, source identity, selected metadata, Markdown/JSON snapshots and resumable sync checkpoints locally.
- Search by words and local tags, optionally prepare local embeddings, and read imported sources without Google access.
- Attach local tags, notes, editor identities, person/project links and evidence-backed memories to documents.
- Preview optional AI memory extraction through the shared provider setup, validate supporting quotes and mark memories stale after source changes.
- Read and manage Drive files, folders and native Docs through the official clients, with 68 generated API methods and optional activity history.
- Require explicit account profiles, separate OAuth grants from command permissions, and provide structured output, offline/dry-run modes, completion and local MCP.
- Install compiled JavaScript through npm; use the shared WireCat validation, package acceptance and MAX release workflow conventions.
- Sign in with WireCat's included Google Desktop application, or select your own OAuth client with a file or environment settings; keep private user tokens in local credential storage.
