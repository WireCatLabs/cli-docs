---
title: "История изменений"
---

Технические сведения о выпусках ниже сохранены на языке исходного проекта. Практические инструкции доступны в переведённых руководствах.

## 0.33.0 — 25.10.2026

### Changed — may break callers

- `search --json` hits carry the Google link as `url` and say `kind: "document"`, the same fields and values as `memo search notes` and `search all` for the same document. `source_url` is removed, with no alias, from hits and from `pictures`; a folder hit is told apart by `not_read: "folder metadata only"` instead of `kind: "folder"`. `tabs`, `content` and `not_read` stay.

### Added

- When the Google sign-in has expired, the error's `next` says it is the owner's step: run `drive <profile> session start` on the computer running drive. An agent over MCP can't sign in, so it now knows to stop and ask instead of retrying.

## 0.32.0 — 25.10.2026

### Changed — may break callers

- Drive documents live in the store's Google Drive account (`google-drive` / your Google principal) instead of a notes folder named `google-drive:<principal>`, and the `drive` profile names that account. This needs cli-core 0.420.0, which carries store versions 30 to 33: it moves existing documents on first open, keeping every `document:<id>` reference, and an older CLI then refuses the store until upgraded. Opening the store records drive's version, so an upgrade can name the CLIs it locks out.

### Fixed

- Two drive processes using the same profile, such as `mirrors watch` and `drive mcp`, refresh its Google sign-in one at a time and share the result, instead of each refreshing on its own. Your saved sign-in stays as it is: nobody signs in again, and older drive versions still read it. `DRV-29`

## 0.31.0 — 25.10.2026

### Changed — may break callers

- `files list` uses the shared field query language, such as `name:"Example plan"` and `modified_time>=2026-01-01`, instead of Google query syntax. Timestamp values require an offset; `--timezone` controls date bounds. File-list fields use snake_case. Raw Google queries remain available through `api`.
- Tag lists return `items` containing `{ "tag": "budget" }` rows. Removed spellings have no aliases.

### Added

- Lists declare schema-derived native queries for configured folders, mirrors, profiles, document tags, notes, relationships, contributors and remote files. Provider lists without predicates advertise their fields and reject filters before requests.
- A file's owner or editor is the same person as your mail contact with that exact email address, so `memo context` joins their files and mail. A name alone never joins anyone, and a person you unlink stays unlinked.

## 0.30.0 — 25.10.2026

### Removed

- `mirrors sync --public-url` and `mirrors watch --public-url`, added in 0.29.0: Google Docs did not download images through a Tailscale Funnel or an ngrok tunnel, so local images stayed as text anyway. Local images stay as Markdown text in the Doc, as `docs/mirrors.md` explains. `DRV-11`

## 0.29.0 — 24.10.2026

### Added

- `drive <profile> mirrors sync --public-url <https origin>` (and `mirrors watch`) inserts local PNG, JPEG and GIF images into mirrored Docs: drive serves each one through your tunnel at a random address that lives only while Google copies it, so nothing in Drive is shared. Without the option, local images stay as Markdown text, as before. `DRV-11`
- **Shared contracts, model catalogues and complete contract evidence come from Core.** Source and transport differences are explicit; a later silent edit fails before execution. Model lists accept native `kind:`, `id:` and `downloaded:` terms.

### Fixed

- Correct the read-only agent scenario to keep denied commands discoverable.

- Document remote MCP as available, retire its duplicate backlog entry, and update browser connection guidance.

### Changed — may break callers

- **File download and export destinations use `--output <file>`.** Replace `--out` in scripts. Document-note lists use `text:review` or a quoted `text:` phrase; list rows, reads and writes declare the shared note schema.

## 0.28.1 — 24.10.2026

### Added

- `drive <profile> mcp --http --public-url <https origin>` serves the MCP tools to ChatGPT and Claude on the web and phone, behind your tunnel and a one-time access code; saved permissions and `--permission` apply to every call. `--revoke` logs every browser app out. Guide: `docs/remote.md`.

### Fixed

- Permission-denied commands stay discoverable in CLI help and MCP with current availability, reasons and required permission keys. Execution still refuses denied calls and missing write grants.
- Correct shared alignment guidance for discovery contract 4, foreground watches and current command-lint debt.

## 0.28.0 — 24.10.2026

### Changed — may break callers

- **`models download <model>` replaces `models text download`** (cli-core 0.405.0 → 0.406.0). The old spelling is
  refused, with no alias; the hint cli-core prints for a missing search model already names `models download`.
  `images models download` keeps its name. Shared command paths and flags now accept only their canonical
  spelling, and a saved permission key with a renamed path stops with `configuration_error` naming its replacement.

## 0.27.0 — 24.10.2026

### Added

- **`mirrors watch` keeps mirrored folders in sync while it runs**, until Ctrl-C or `--timeout`, both a normal end. A
  saved file is synced a couple of seconds after the last save, and only if it differs from the last sync; Google's
  change feed is read every minute (`--every`) and only the mirrors whose files it names are synced. Every mirror is
  also compared every 5 minutes and synced every 30, for changes no event reported. A part changed on both sides is
  reported and left for `mirrors sync --keep`. With `--jsonl`, one line per sync and an end line; it is not an MCP
  tool, and `DRIVE_READ_ONLY` refuses it.

- **A mirroring guide** covers setup, both directions, conflicts, choosing a side and deletion limits.
  The documentation check now enforces standard changelog headings for new releases.

- **`files download FILE_ID --out PATH` and `files export DOC_ID --format pdf|docx|xlsx|csv --out PATH`** save
  Google content locally. Existing outputs require `--overwrite`; results report byte counts. The existing
  `documents export --output PATH` still writes imported Markdown offline.

- **`comments reply`, `comments resolve` and `comments reopen`** change Google comment threads through the
  same method permissions and Google write grant as generated commands.

- **MCP offers profile listings, settings reads, agent instructions, guides and imported Markdown export.**
  Exports use a filename within the profile cache export folder. `config set` and `models set` require the
  owner to allow `mcp.authority`; agents cannot alter their own authority settings.

### Changed — may break callers

- **Status output omits document names.** `status` reports skipped IDs and reasons without file metadata;
  `mirrors status` reports counts for `create`, `update` and `orphans`, without filenames or the local root.
  `documents show` and `mirrors list` still provide explicitly requested details. The discovery contract is 4.

- **The retired `read_only` setting is refused**, including its old camelCase spelling. Remove it from config;
  use command permissions, `--read-only` or `DRIVE_READ_ONLY`. A terminal now asks before a write at level `ask`.

- **Google write results include `operation_id`**, matching the write journal for both friendly and generated commands.
  Read-only file commands appear under Read in command discovery, and mirrors under Automate.

- **MCP argument names use snake_case**, such as `file_id` instead of `file-id`; CLI flags keep their spelling.
  Command declarations control the MCP surface. Model downloads and skill installation are discoverable,
  with skill installation requiring the owner’s authority permission.

### Security

- **Development tooling uses patched fast-uri and markdown-it.** Overrides resolve fast-uri 3.1.9 and
  markdown-it 15.0.3, body-parser 2.4.0 and ip-address 10.7.4; production dependencies and the historical upgrade fixture stay unchanged.

## 0.26.0 — 24.10.2026

### Added

- **The first command at a terminal asks three questions once for every WireCat tool** (cli-core 0.404.0): which
  languages you write and speak, which other WireCat tools to install, and whether commands and agents may only read.
  Answered in any tool, they hold in all of them; "read only" makes every `drive` profile read-only. `tg setup`,
  `max setup` or `wa setup` asks again. Agents, `--json`, `--no-input`, `CI` and `DRIVE_READ_ONLY` are never asked.

## 0.25.0 — 24.10.2026

### Added

- **`drive doctor`**: the state of this installation (version, Node, whether the settings file reads, the profiles
  here, the OAuth client, the store path, read-only and profile locks) without a profile, a login, the keyring or the
  database. A settings file that does not read is a field in the answer, not a failure.
- **`drive upgrade`** installs a newer drive with the package manager that installed it; `--check` only looks. It is
  refused under `DRIVE_READ_ONLY` unless it only checks, and is not offered as an MCP tool.

### Changed — may break callers

- **`doctor` and `upgrade` are commands, so they can no longer be profile names.** `drive doctor` used to be read as
  a profile called "doctor". A profile already named `doctor` or `upgrade` is reached only through `DRIVE_PROFILE`.

### Security

- **`pnpm audit --prod` is clean.** The MCP server library is 2.3.0 (advisories on 2.0–2.2) and its `zod` 4.6.7
  (memory exhaustion on oversized input before 4.6.6).

## 0.24.0 — 23.10.2026

### Added

- **[Compared with other tools](./compare.md)**: drive next to gog, Workspace MCP and rclone, with where each
  fits better, and when Google Docs' own Markdown editing is enough.
- **[Roadmap](./roadmap.md)**: what is planned for drive and is not in it yet.

### Changed — may break callers

- **The profile is only the first word, or `DRIVE_PROFILE`; `--profile` is gone.** `drive --profile work …` now fails
  with a pointer to `drive work …`. `DRIVE_PROFILE` names the profile when the command line does not.
- **A profile that does not exist is `validation_error` (exit 2) with the profiles here** (`profile.unknown`,
  `details.profiles`), not `authentication_error` (exit 4) with a hint to sign in under the misspelled name.

### Fixed

- **A partial `sync` or `mirrors sync` says so in its answer.** `meta.complete` is `false` with one `issues` entry per
  failed source, where it used to say `true` before the command failed.
- **`DRIVE_READ_ONLY` refuses `config set`.** A setting changes what later runs may do; it was the one local write the
  lock let through.
- **Output piped into a reader that stops early ends quietly.** `drive commands --json | head` exits 0 instead of
  printing a stack trace.
- **`DRIVE_PROFILE_LOCK` pins the process.** A first word or `DRIVE_PROFILE` naming another profile is refused with
  `permission_error`; with no profile named, the locked one is used. Before, the variable was ignored.
- **`session list` and `config show` run without a profile**, as they read every profile. A missing profile's error
  names a leftover `default_profile` instead of ignoring it silently.

### Security

- **`--permission` can no longer loosen a profile's settings.** A level looser than the profile's, its defaults or a
  built-in default (such as `ask` before a deletion) is refused with `validation_error`; before, `--permission
  api=allow` lifted a `deny`, also for the MCP server it started. A flag still tightens. A permission in the config
  or on the command line that names no drive command is refused, not ignored, so a misspelling cannot silently
  allow more.

## 0.23.0 — 22.10.2026

### Added

- **`mirrors sync` works both ways.** Edits and ticks made in Google come back into the local files: a Markdown
  file changes only on the lines of changed paragraphs, so its own markers, spacing and code languages stay; a CSV
  or TSV file takes Google's cells and keeps how it spelled unchanged values (`1.50` stays `1.50`). The same
  paragraph or cells changed on both sides is a conflict: that file is left alone, the rest sync, and the report
  shows each side's text, when the file changed and Google's last revision time and editor. `--keep local`,
  `--keep google` or `--keep both` settles it. Every mirrored file is now read from Google on each sync. XLSX files
  do not take changes back; a Google edit to one stays a conflict until `--keep local`.

### Changed

- **`--replace` keeps Google's edits that do not collide.** It now means `--keep local` plus creating deleted
  files again, so only conflicting parts are overwritten, and Google's other edits come back into the file. A Doc
  with pending suggestions is refused whatever side is kept: suggested text would read as accepted.

## 0.22.0 — 22.10.2026

### Changed

- **cli-core 0.383.0 → 0.384.0, with no change to drive's commands**: the new `meta.timezone` and `meta.window`
  in JSON answers cover messenger commands with date filters (`search conversations`, `inbox` and others), and
  drive has none of them. `files list` already names its zone in `meta.timezone` since 0.20.0.

### Fixed

- **A store the pre-rename `cli-messaging` wrote is refused again, and left untouched** (cli-core 0.385.0). Since
  cli-core 0.382.0 such a file was opened and failed with `internal_error`; it now fails with `configuration_error`.

## 0.21.0 — 22.10.2026

### Added

- **`mirrors`: keep local folders mirrored into native Google Docs and Sheets.** `mirrors add <path> --parent
  <folder>` saves a mirror; `mirrors sync` writes changed files: Markdown becomes a Google Doc with native headings,
  bulleted, numbered and checklist items, tables, code, quotes, links and images; CSV, TSV and XLSX become a
  Google Sheet with typed cells, one tab per worksheet. An update edits in place: a Doc changes only the
  paragraphs that changed, so comments on the rest stay, and a Sheet rewrites only the mirrored range, so other
  tabs, columns and formatting stay. A change made in Google since the last sync stops that file unless
  `--replace`; a checklist tick may change on either side. `- [x]` items are written struck through, since Google
  lets no app tick a box. Nothing is ever deleted in Google. `mirrors status` shows what the next sync would do
  without asking Google; `mirrors list` and `mirrors remove` change local settings only. Needs the write grant
  (`session start --grant write`). DOCX files are not mirrored yet (cli-core 0.379.0 → 0.383.0, cli-base
  0.48.0 → 0.49.0).

## 0.20.0 — 21.10.2026

### Changed — may break callers

- **`files list` reads a query time without a zone in this computer's zone**: Google reads
  `modifiedTime > '2026-09-01T09:00:00'` as UTC, so drive now converts such a time (and a date alone, as the whole
  local day) to UTC before it sends the query, and names the zone in `meta.timezone`. `api call drive.files.list`
  and `api drive-files-list` do the same for `q`. A time that names its zone is sent as typed. What to watch for: a
  script that typed UTC times without a zone gets other files on a computer outside UTC; add `Z` to keep UTC.

### Fixed
- **Text output shows times in this computer's zone and says which**: a stored UTC time such as `modified_time`
  prints as local wall-clock time, followed by a `times in <zone>` line. JSON, JSONL and MCP output stay UTC.
- **`facts add --occurred-time` help says how a time without a zone is read**: in this computer's zone, and a date
  alone as its local midnight (cli-core 0.370.0 → 0.379.0, cli-base 0.47.0 → 0.48.0).

## 0.19.0 — 20.10.2026

### Added

- **The shared store moves to version 25 when first opened** (cli-core 0.366.0): it adds a history of chat
  changes for the messengers that share it. Nothing is sent.

### Fixed

- **`drive guide` lists memo's `decision-trail` under "Works with"**, the memo scenario whose steps run
  `drive search`, next to `person-brief`, whose title is now capitalised as in memo and the other tools. Both titles
  come from cli-core (0.348.0 → 0.370.0), whose scenario check also catches shell characters left outside
  quotes in a step.

- **Project context with Memo**: the guides now explain selected-folder sync, the shared-store source,
  source dates and coverage limits, and why a connected-app read alone does not import a document.

- **`--json` help names a real field**: it said `--json=id,title`, which is refused; Drive results use `name`, so it
  now says `--json=id,name`.

## 0.18.0 — 19.10.2026

### Added

- **`drive guide [name]`: scenarios**, the commands for a common task in order — `set-up`, `find-decision`,
  `brief-document`, `agent-access` — and memo's `person-brief` under "Works with". `--json` gives the same as data.
- **`drive skill show` and `drive skill install`**: the agent skill, which says when to pick drive and points at
  `guide` and `commands`. Neither needs a profile.
- **`drive models text download <model>` and `drive images models download <model>`** download the search and
  picture models into the folder every WireCat CLI shares, checked against their sha256. No profile or sign-in is
  needed; `--offline` refuses them.
- **`drive help options`** prints the options for every command and `drive help <command>` one command's help;
  neither needs a profile.

### Changed — may break callers

- **`drive commands` without `--json` prints a text list by section, even when piped**: every command on one line,
  its usage and description, `(writes)` when it changes something, under Read, Write, Organise, Automate or Set up.
  It printed the whole JSON tree. A script that parsed a bare `drive commands` must pass `--json`, which prints the
  same document as before.
- **`drive mcp` serves three tools in place of one per command (161 before)**: `drive_tools_search` finds a command
  and shows its arguments, `drive_read` and `drive_write` run it as `{ command, arguments }` — the model tg and max
  use. Commands, arguments, permissions and the audit record are unchanged; `drive_write` is not offered when the
  profile allows no writes. `mcp --tools` lists commands by `command` instead of tool `name`.
- **`drive --help` and a bare `drive` show a short first screen** instead of every command and option: what drive
  is for, eight things it does, the other WireCat tools, and where to go next. The full help moved to `--help-all`,
  the options for every command to `drive help options`. A leaf command's `--help` ends with Returns, Next usually
  and Example, and its old "Examples:" block is gone.
- **A list query refuses a word that starts with `--`** as an unknown option, with a suggestion
  (`documents list --tag budget` → "unknown option '--tag' (Did you mean --page?)"), instead of reading it as query
  text. It comes with cli-core 0.345.0.

### Fixed

- `--help` on a list that takes a query (`documents list`, `memories list`, `facts list`, `api list`) prints the
  help again; since cli-core 0.343.0 it was refused as an unknown option (exit 2). Every leaf command's `--help` is
  now checked in the tests.
- The profile may follow a global option that takes a value: `drive --timeout 30s personal status` reads `personal`
  as the profile, not `30s`.
- A search that finds nothing before anything is imported says so in `not_imported`: no folder is selected, or no
  sync has run yet. An empty answer read as "no such document".
- `session start` checks that the keyring can be used before it shows the Google sign-in, so a computer without one
  fails at once instead of after consent.
- `drive complete --help` prints the help instead of "choose a supported shell".
- The advice for a missing search or picture model names drive's own download (`drive models text download
  e5-small`, `drive images models download clip-b32`) instead of tg's, which needed a profile and a second tool.
- `drive mcp` no longer offers tools the Google sign-in cannot run: changing Google files needs `--grant write`,
  Drive Activity needs `activity`, Drive apps need `apps`. They used to be listed and fail when called. `memories
  extract`, which sends a document to the model and changes no Google file, stays offered without `--grant write`.
- README, search and configuration pages download the text and picture models with drive itself; the
  `npx @wirecat/tg-cli` workaround is gone. The configuration page lists `DRIVE_READ_ONLY`.

### Security

- **`DRIVE_READ_ONLY=1` locks the process as `--read-only` does**: every command that changes local
  or Google data is refused with exit 5 before anything is touched, and the MCP server offers no write.
  Any value but empty or `0` turns it on.

## 0.17.3 — 18.10.2026

### Fixed

- A mistyped command, a missing argument or a missing required option now says which one it is, with Commander's
  suggestion where it has one, instead of "invalid command arguments".
- `drive --version` no longer prints a blank line after the version.
- A command for a profile that is not signed in fails before the shared database is created.

### Documentation

- The README names a working command for listing profiles (`drive personal session list`), and the contributor
  sections moved to `docs/dev/`.

## 0.17.2 — 18.10.2026

### Changed

- Uses `@wirecat/cli-core` 0.342.0 with matching `@wirecat/cli-base` 0.45.0.

### Fixed

- Sign-in error hints name a command that runs: `drive <profile> session start`, or the profile itself when drive
  knows it. They said `drive session start`, which fails without a profile.

### Documentation

- The README and the installation guide explain Google's "unverified app" warning: Google's review of the Drive
  permissions is not finished, how to continue or use your own Google application, and that Google limits an
  unverified application to 100 new users in total.

## 0.17.1 — 2026-10-18

### Fixed

- Sync links document URLs introduced by edits to previously stored messages, including text edits
  saved by older messaging SDKs. Unchanged documents do not need another download; repeated sync
  keeps one link per message. The messenger must have saved the edit locally first.
- The first sync with the new linker repairs earlier missed message links, even if an older sync
  already advanced its checkpoint. The local pass is retried on failure and does not redownload
  unchanged document content.

## 0.17.0 — 2026-10-17

### Added

- `store check SOURCE_DB` previews copying this profile's document context to the selected shared
  database; `store import SOURCE_DB --fingerprint HASH` applies it and rewrites cached references.
  Tags and aliases, notes/revisions, memories, decisions, editor identities and links are retained.
  Copies use Core's bounded, read-only-source transfer and durable receipts; unresolved references
  refuse, interrupted unchanged copies can be retried, and the original file is never removed.
- `status` shows the selected database and checkpoint database so store-recovery steps can name the
  right source and destination without opening either database.

## 0.16.0 — 2026-10-17

### Added

- Native Sheets structure commands create/rename tabs, insert bounded rows/columns and format
  at most 10,000 cells. Formatting masks only supplied leaf properties and preserves cell values.
  Equivalent raw/generated batch requests check the same profile permission keys.

- Live Sheets commands inspect tabs, read ranges or formulas, update finite ranges, append rows
  and clear values. Writes require the explicit Drive write grant and reuse profile policy guards.
  Values default to literals; formula parsing is opt-in. Enable Sheets API for these commands.
- Generated commands now cover the committed Sheets v4 Discovery contract, including batch
  operations and spreadsheet structure. POST-based lookup methods retain read-only effects;
  some of those Google endpoints require the broader Drive grant even when they only read.

### Changed

- Uses exact `@wirecat/cli-base` 0.40.3 with the existing compatible Core pin. All Sheets naming
  exceptions are removed; the command lint baseline does not grow.

- Uses `@wirecat/cli-core` 0.307.0.

- **Over MCP, a write whose permission level is `ask` now goes ahead** instead of failing with
  `confirmation_required`, as in tg and max: no one is at a terminal to answer, and MCP shows no approval
  forms. This includes deletions, whose built-in level is `ask`. The read-only lock, `deny` and the send journal still
  apply. If you relied on `ask` to keep an agent from writing, set that permission to `deny` or `readonly`.

### Fixed

- A disabled Google API reports `google-api.disabled` with an application-setup remedy instead
  of a generic permissions error. No provider messages, activation links or project identifiers
  are included; troubleshooting separates API enablement from account grants and file access.

- `commands --json` now lists `mcp` as a persistent command that writes to Google and on this machine
  (`effects: { remote: "write", local: "write" }`, `lifetime: "persistent"`), instead of a local read: the
  server it starts runs drive's writing commands. No other command changes.

## 0.15.1 — 2026-10-17

### Fixed

- Documentation lint uses patched TOML and math-rendering dependencies; runtime dependency pins are unchanged.
- Import recovery messages now include the required profile and use the `max_text_chars` setting name.
  The overview clarifies Sheets import versus editing and optional image search.
- Google listings and MCP argument construction append values without spreading unbounded arrays into calls.

- **`bin/release` restarts itself once when the release brings a newer `bin/release`**: folding the changelog
  fast-forwards `main`, and the shell went on reading the old script from the byte it had reached, so the rest of the
  run was a mix of old and new text. It now starts the new script over; a second change during that run stops it
  with `run it again`. Only the repository's own release is affected; the published package does not change.
- **A broken config file now says which key is wrong.** Instead of only "drive configuration is invalid",
  drive names the first bad key and why: `profiles.work.principal is missing`, `colour is not a known setting`,
  `profiles.work.read_only has the wrong type or is out of range`. An old camelCase key set beside its new
  snake_case name says which one to keep. The message never shows a value from the file.

## 0.15.0 — 2026-10-16

### Changed

- Documents now use the shared WireCat database. `MESSAGING_STORE` replaces `DRIVE_STORE`. Existing document references rebuild offline from snapshots; legacy annotations stop the switch rather than being stranded.

### Added

- Shared search uses cli-core 0.301.0 with cli-base 0.40.0: imported documents keep their Google URL, Google edit time and recorded Drive profile.
- Sync connects imported documents to stored messages containing their Google links, including later messages about unchanged documents. Interrupted linking retries before its watermark advances.

## 0.14.1 — 2026-10-16

### Changed

- **drive starts about a fifth faster after its first run.** It keeps Node's compiled code in a cache, in the
  system's temporary folder (`NODE_COMPILE_CACHE` moves it): `drive --help` went from about 0.54 to 0.43 seconds.
- Uses `@wirecat/cli-core` 0.299.0.

## 0.14.0 — 2026-10-16

### Changed

- Document tree planning, resumable sync, ingestion, scoped knowledge and evidence-backed memory
  extraction use Core’s provider-neutral document module. Drive retains Google adapters, settings,
  account locks and snapshot/checkpoint I/O. Existing account data and file formats are unchanged.
  Uses `@wirecat/cli-core` 0.295.0 with matching `@wirecat/cli-base` 0.40.0.

### Fixed

- Preserve saved/oversized picture markers when reading a sync checkpoint, so unchanged images
  are not downloaded again on the next incremental sync.

- **Release scripts report observed lock holders separately from stale release labels.** Shared
  diagnostics no longer attribute a live lock to a previous run; wait for the holders to finish, then
  retry.

- Recipes now explain the existing resumable `files upload` command instead of claiming that
  arbitrary local file uploads are unsupported. Uploads preserve the original file format.

## 0.13.0 — 2026-10-16

### Added

- Track changing decisions with `facts add --supersedes fact:ID` and `facts reverse`.
  Replacements supersede the earlier decision on acceptance; reversals keep its history.
  Both require the same imported document and account, use shared Core fact transitions,
  and respect offline, read-only and dry-run controls. `facts add --occurred-time` records
  the evidence’s event time.

## 0.12.2 — 2026-10-16

### Fixed

- AI memory extraction explicitly allows supporting source quotes in the shared model gateway.
  Its mandatory exact-evidence request no longer conflicts with the gateway’s ordinary no-copy
  instruction. Preview, proposal review and exact-quote validation retain their existing behavior.
  Uses `@wirecat/cli-core` 0.294.0 with matching `@wirecat/cli-base` 0.35.0.

## 0.12.1 — 2026-10-15

### Changed

- `catalog show`, `catalog list`, `catalog search` and `documents list` declare the rows they answer
  (`document.drive_catalog`, `drive_document`) in `commands --json`, and `--json=<field>` is checked against those
  declarations through cli-core's `entityFields` rather than by command name. A field the rows lack is still
  refused with `output.unknown-field`.
- drive runs on `@wirecat/cli-core` 0.292.0.

## 0.12.0 — 2026-10-15

### Added

- `files upload <path> [--parent ID] [--name NAME]` uploads a local file of any size with Google's resumable
  upload, in 8 MiB chunks. An interrupted upload continues from the byte Google holds on the next run; the session
  waits in the profile's state folder (`uploads/`, mode 600) for up to a week. The answer carries the file id, size
  and MD5, and drive refuses the upload when Google's MD5 differs from the local file's. It is a write: profile
  policy, `--dry-run` and `--read-only` apply.

## 0.11.2 — 2026-10-15

### Fixed

- `memories search <document>` finds the document's memories however many other documents match. The store now
  searches only that document's memories; before, drive took the best 200 matches across every memory and kept
  the document's own, so one whose matches ranked lower answered nothing. `meta.truncated` now means the document
  itself has 200 matches or more.

### Changed

- drive runs on `@wirecat/cli-core` 0.289.0.

## 0.11.1 — 2026-10-15

### Fixed

- `documents list --json=reference,tabs` selects the fields the list answers again. 0.11.0 refused them, because
  the list's query named the shared `document` entity, whose fields drive's list does not use.

## 0.11.0 — 2026-10-15

### Changed — may break callers

- **`documents list` takes a query the store applies, not `--tag` and `--person`.** The shared store narrows the
  imported documents; drive no longer checks each one after reading.
  - `documents list --tag budget` → `documents list tag:budget`; the tag is an owner tag, by name or alias.
  - `documents list --person person:PERSON_UID` → `documents list person:PERSON_UID`.
  - The list is paged: `--limit` (default 50) and `--page`. Documents come in import order, also without a query.
  - The MCP tool takes `query`, `limit` and `page` instead of `tag` and `person`.
- Built on `@wirecat/cli-base` 0.33.0 and `@wirecat/cli-core` 0.288.0.

## 0.10.0 — 2026-10-15

### Changed — may break callers

- **Lists take a query, not filter flags.** The store or the method table applies it; nothing is filtered after
  reading. The old flags are refused.
  - `facts list DOC_ID --type decision --status proposed` → `facts list DOC_ID kind:decision status:proposed`
  - `memories list DOC_ID --scope work --kind preference` → `memories list DOC_ID scope:work kind:preference`;
    `status:` is new.
  - `memories search DOC_ID budget --scope work` → `memories search DOC_ID budget scope:work`. The scope is now
    optional: without it both personal and work memories are searched.
  - `api list --service docs` → `api list service:docs`.
  - The MCP tools take the same terms as one `query` string; `catalog list` and `catalog search` too, which took
    a list of words.
- Facts and memories answer with the shared `fact` and `memory` fields, in every command that returns them and
  in `documents context`: a fact's `type` is `kind`, its `statement` is `text`, its `source` is `origin`; a
  memory's `body` is `text`. `--json=kind,text` selects them.

## 0.9.0 — 2026-10-15

### Changed

- **Breaking:** `session start --write`, `--activity` and `--apps` are one `--grant <scopes>`, comma-separated:
  `drive personal session start --grant write,activity`. An unknown scope is refused before the browser opens.
- **Breaking:** `memories extract --save` is `--yes`, on the CLI and as the MCP tool's `yes` argument. Without it
  the command only proposes. `--yes` also answers the profile policy's confirmation, as it does for every command.
- Built on `@wirecat/cli-base` 0.32.0 and `@wirecat/cli-core` 0.287.0; a clean install still holds one cli-base.

### Fixed

- A document whose name has Cyrillic or other non-Latin capitals comes first for a search by its name, and
  `title:` finds it in any case (cli-core 0.285.0).

## 0.8.1 — 2026-10-15

- Maintainers can set `WIRECAT_RELEASE_WAIT_SECONDS` when using `bin/release` to wait for the
  existing machine-wide lock; the default remains immediate refusal when busy.

- The create-document recipe names the CLI response field `document_id`; Google request bodies
  keep their provider field names.

- **Nested JSON selection uses the shared projector.** Dotted paths traverse arrays and report objects; coverage, pagination and execution metadata stay available.
- Fresh npm installs preserve generated API operation names and remote effects. Aligns Base 0.31.1
  with Core 0.283.0, avoiding separate framework instances; installed Node/Bun smoke checks both
  generated reads and writes before publication. Legacy camelCase settings still migrate once,
  retaining their file mode and refusing conflicting aliases.
- A clean install holds one copy of `@wirecat/cli-base` (0.8.0 installed two: 0.31.0 for drive, 0.28.2 for
  cli-core); the installed-package smoke check now fails when `npm ls @wirecat/cli-base` lists more than one.
- Security: the MCP client used by the MCP tests is `@modelcontextprotocol/client` 2.3.1; below 2.2.0 it could send
  OAuth credentials to an authorization server chosen by the MCP server.

- **Search puts a file whose title matches the query first.** A plain-words query ranks a title equal to the query,
  then a title containing it as a phrase, then a title holding all its words, ahead of text matches; a field, `OR`,
  `NOT`, wildcard or regular expression query keeps its order. A hit's `found_by` may now say `title`.

## 0.8.0 — 2026-10-15

- **Flag names follow the shared vocabulary of cli-base 0.31.0 (breaking, no aliases).** `documents export
  --out` is now `--output`; `api call --allow-write` is now `--allow-writes`; `relationships add --evidence` is now
  `--reason`. `files list` takes its Google Drive query as words after the command instead of `--query`. Value names
  in help read `--max-output-bytes <bytes>`, `--parent <id>`, `--old-parent <id>`, `--person <uid>` and
  `--supersedes <ref>`; `documents list --person` accepts a bare uid as well as `person:<uid>`.
- A missing text or picture model now says that tg or max downloads it, with both commands, instead of naming only
  `tg`: drive has no download command of its own.
- Uses `@wirecat/cli-base` 0.31.0 and `@wirecat/cli-core` 0.281.0.

- `status` names the supported Google Sheets and uploaded PDF, Word, Excel, CSV and TSV readers,
  alongside Docs and Markdown/TXT, while retaining the native-export fidelity limitation.

- The MCP contract snapshot reflects the positional `notes list` query, so full validation checks
  the current tool arguments instead of the removed `--search` option.

- Maintainer OAuth guidance reflects the released shared app, keeps user-owned clients optional,
  and links the isolated Google acceptance workflow instead of duplicating source-build instructions.

- **`notes list` takes its search as words after the document (breaking).** `drive personal notes list DOC_ID
  review` replaces `--search review`, which now fails as an unknown option; the answer's `page.args` names it
  `query`.
- A store that fails to migrate no longer advises `tg store reset`: drive keeps its own store and has no such command.

- **Cursor lists page.** `files list`, `comments list`, `permissions list`, `revisions list`, `shared-drives` and
  `documents history` answer a list of Google's rows with `page.mode: "cursor"`, `page.next_cursor` set from
  Google's `nextPageToken`, and a `page.next` step; before, the whole Google response came back as one item and the
  token was never reported. An unfinished Google search is named in `missing`.
- Every command builds its answer with cli-core's `itemOf`/`listOf` instead of drive guessing the shape, and prints
  through `renderAnswer`. `memories search` is a list (hitting its 200-candidate cap sets `meta.truncated`).
  `documents history` drops its `file_id`, `source` and `coverage` wrapper. `catalog list`, `catalog search` and
  `notes list` add a `page.next` step when more remain. In a terminal, a command prints its item or items, not the
  whole envelope, and a next-page hint goes to stderr.

## 0.7.0 — 2026-10-14

- Command effects distinguish Google-only reads from cached reads. Handwritten Google reads now
  agree with generated methods (`remote: read`, `local: none`); account-free discovery/completion
  declares no data access. Sync, cached reads and local writes retain their effects and guards.
- JSON selection uses the catalog view's own fields, including `name` and `parents`, and checks
  returned provider fields before printing. Writes without declared output fields refuse selection
  before acting. The shared SDK owns parsing and validation; provider adapters declare their view.
- **`--json=id,title` keeps only those fields** of the answer's item or items, in JSON and JSONL, as tg and max do.
  A field the answer does not have is refused with the fields it has. Adopts cli-core 0.278.0.
- Clarify contract-3 output, page/JSONL metadata and interrupted-sync recovery in the import
  guide; refresh developer alignment and testing notes to distinguish current pins, previous-store
  fixtures and published-package acceptance.

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
