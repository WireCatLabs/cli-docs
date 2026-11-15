---
title: "История изменений"
---

Основные изменения `@wirecat/cli-memo` по версиям, от новых к старым. Используется
[семантическое версионирование](https://semver.org/); до `1.0.0` минорный выпуск может менять
интерфейс.

Точные технические записи новых выпусков сохранены на английском; инструкции по использованию переведены в соответствующих руководствах.

## 0.135.0 — 14.11.2026

### Changed — may break callers

- **`memo search meetings` without `--limit` shows 20 hits, not 100** (cli-core 0.663.0). The page now comes from
  the shared default limit, as other lists do. Pass `--limit` for a longer page.
- **Meeting time flags take one grammar** (cli-core 0.663.0). `memo meetings prepare` and `memo search meetings`
  take an ISO date or time with or without seconds and zone, a date alone, `today`, or `30m`, `2h`, `7d` ago; a time
  without a zone reads the computer's zone. A `memo tasks update --due` or `--remind-time` date alone is that day.

## 0.134.0 — 14.11.2026

### Changed — may break callers

- **Dates in list queries read the computer's zone, and a due date alone is the end of that day** (cli-core
  0.661.0). `today` and a bare date in `memo tasks list` and the other list queries started in UTC, and now start
  at local midnight, as search and the digest do. `memo tasks update --due 2026-11-20` sets the end of the 20th, so
  the task is not overdue all that day.
- **`memo folders add` picks a new folder's format when `--format` is not given.** A folder with Obsidian's own
  `.obsidian` folder in it or above it is `obsidian`, any other folder `markdown`; before, every folder was
  `obsidian`, so a `#word` in plain Markdown became a tag. The `--json` answer names where the format came from
  (`format_from`: `detected`, `option` or `saved`). `--format` still wins, and a folder memo already knows keeps
  its format. A bare path written before folder ids counts as never chosen, so it is detected too.
  See [Add a folder](./notes.md#add-a-folder).
- **`memo folders add` refuses a folder inside or around one memo already reads.** Each file under both would be
  two notes. The `validation_error` names both folders, with reason `folder.overlap`; `memo doctor` reports such a
  pair in an existing config. See [Add a folder](./notes.md#add-a-folder).
- **A `readonly` level no longer stops a sync** (cli-core 0.662.0, was 0.661.0). A command that only fetches from a
  service into the local store runs at `readonly`; `deny` still refuses it. Commands that write the owner's files or
  call another service stay blocked by `readonly`.
- **`memo models ai check` counts as reaching another service** (cli-core 0.662.0), so `readonly` stops its paid
  request to the model provider.

### Fixed

- **`memo documents show` says more text follows after emoji** (cli-core 0.661.0). `has_more` compared a length in
  UTF-16 units with one in code points, so a part holding emoji could report no more text before the end, and
  WireCat Desktop's "Show more" disappeared early. `text_offset`, `text_length`, `--cursor` and `--max-chars` all
  count Unicode code points.
- **Changing a folder's format reads its notes again.** After `memo folders add --format` or `memo folders update
  --format` with another format, the next `memo sync --only notes` parses every note of that folder again, even
  unchanged ones, so tags and links read in the old format are replaced. See
  [Markdown or Obsidian](./notes.md#markdown-or-obsidian).

## 0.133.0 — 14.11.2026

### Added

- **`memo documents list`, `show` and `tree`: every document of every account.** Drive files, notes folders,
  sources added by hand and imports in one paged list with a total, newest change first, each with its source,
  folder, kind, size, link and whether its text is stored; narrowed by source, kind, folder, edit time, tag, person
  and words of its text. `tree` gives each account's folder tree with counts.
  See [usage](./usage.md#every-document).
- **`memo meetings list` and `show`: meetings, calls and calendar events as one row per real meeting.** A calendar
  event and its Zoom meeting are one row; each row names its sources, participants with their person refs, join
  links, recording, transcript and summary flags, linked documents and findings waiting for you. A window is read by
  overlap (`started_at:`, by days or by instants with their offset), latest first or oldest first (`--order start`).
  `show` adds the transcript lines with their times. See [usage](./usage.md#meetings-and-calls-in-one-list).

## 0.132.0 — 13.11.2026

### Added

- **`memo import` brings a folder of documents, transcripts and recordings, or a records file, into memo's search.**
  Text, Markdown, PDF and Word files, `.vtt` and `.srt` transcripts and, with `--transcribe`, recordings heard by the
  local speech model each become a document of the account you name, `--account import:<name>` or
  `phone:<exchange>`, keyed by its path in the folder: the same folder twice changes nothing, an edited file updates
  its own document, a recording is heard once, and a file gone from the folder is kept. A `.json` or `.jsonl` file
  goes to the records import. Links are not followed, nothing leaves the computer, and `--dry-run` writes nothing
  ([Import files and records](./import.md)).
- **`memo sources add` keeps meeting transcripts.** A `.vtt` (WebVTT) or `.srt` (SubRip) file exported from a video
  call is kept as searchable text, one `Name: text` line per turn without the timings; before, it was refused as
  `source.unsupported`. WireCat Desktop's "Add to memory" takes them too
  ([Sources you add by hand](./sources.md#add-a-source)).
- **An agent over MCP may run a schedule you made.** `schedule list`, `agents list`, `run` and `exec` are offered, as
  in every WireCat CLI. Making, removing, pausing or resuming a schedule needs `mcp.authority`, which defaults to
  `deny`. See [MCP](./mcp.md).
- **`memo context` lists the recorded calls and meetings a person took part in, in `meetings`**, beside `events`:
  each with its `meeting:` ref, account, title, start, length and whether it has a transcript. `meetings show` of the
  CLI that owns the account opens one. From cli-core 0.650.0, which also links a call to the CRM contact with the same
  phone.

### Changed — may break callers

- **`memo projects meetings link --fingerprint` with a stale fingerprint answers `conflict`, not
  `configuration_error`** (reason `meeting-project.stale`). From cli-core 0.651.0. A script that checks the code
  checks `conflict`, lists the proposals again and links with the new fingerprint.
- **memo needs `@wirecat/cli-core` 0.649.0**, which adds the `document` record type and the import-only provider
  `import`, and lets search read the documents of import-only accounts.
- **`memo stats tasks show` has no `--chat` any more: name the chat in the query, `-- chat:7`.** From cli-core
  0.648.0, as in tg and MAX. A chat with no account named is still refused.
- **Built on cli-core 0.656.0** (was 0.651.0). See the
  [cli-core changelog](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).
- **A model address WireCat refuses now answers the reason `model.address-refused`, not `ai.address-refused`.** From
  cli-core 0.650.0, in `memo models ai set`, `memo answers create --analyze` and every other call to a model. A
  script that checks the old name checks the new one.

### Fixed

- **`memo review show --compact` prints the proposal as one line**, as `review` lists it: id, kind, title, score,
  who proposed it and the day. It printed the same `key: value` lines as without `--compact`.
- **`memo review confirm` and `reject --compact` print one line per decision and one per refusal**, under
  `# decided: N` and `# refused: N`. They printed only the counts.
- **`memo projects meetings link --fingerprint` keeps your `--reason` when you confirm an agent's proposed link.** The
  agent's reason stayed. From cli-core 0.651.0.
- **`memo notes add --export` writes the note's first `--subject` as a link in the file too**, as it does every later
  one. The file named only the others. `notes edit --export` and `notes export` still leave it out: the store does not
  return a note's first subject yet.
- **The sync health of the digest no longer credits a schedule with no profile to one named `default`.** A tg, MAX or
  WhatsApp sync timer that names no profile, in its arguments or its environment, now counts for no account, so a
  profile called `default` is never picked for you.
- **A release with new commands or a breaking change gets a new minor version.** `bin/release` raised only the patch
  number, so 0.131.86 and 0.131.87 shipped new commands as patches.
- **`memo mcp --help` no longer speaks of "this profile".** Memo has no profiles; it serves memo's commands.
- **`memo sync` finishes when the shared WireCat config starts with a byte-order mark.** A
  `~/.config/WireCat/config.json` saved by a Windows editor made the meaning-search step fail with "not valid JSON",
  so the sync ended incomplete. A config that cannot be read at all also no longer counts as the "read only" setup
  answer (cli-core 0.656.0).
- **`memo store recover run --json` prints JSON.** It printed the text report: `store recover` has a `--json` of its
  own, and it took the flag. A script or WireCat Desktop reading the answer now gets the JSON object.

### Security

- **`sources suggest` reaches only the hosts of the readers.** Its Ollama and API readers go through the host check:
  OpenAI's and Anthropic's APIs, this computer, and the addresses you set for Ollama and for the shared AI model. A
  local model may take up to 15 minutes on one source.

## 0.131.87 — 12.11.2026

### Added

- **`memo people resolve <id> organization` makes both "people" on a match a company's mailboxes.** For a match such
  as two contacts named after a company at its domain: every address on the match goes to one organization (the one
  named, else one with an address or the domain, else `--name`, else a new one named after the people's shared name
  or the domain; free mail needs `--name` or the organization). People who are only those addresses leave the people
  list as the company's; people with other identities keep them. The match closes; `--json` gives `organization`,
  `mailboxes`, `people` and `closed`. See [people](./people.md).
- **The `proposals` skill topic says how an agent sorts the owner's matches.** "Sorting the owner's matches for him":
  gather evidence, sort each match into one person, different people, one company or unsure, and hand the owner at
  most three commands to run.

## 0.131.86 — 12.11.2026

### Added

- **`memo actions edit <id> <finding> --fingerprint <hash> --set field=value`** changes a finding still waiting in a findings batch before you confirm it: its text and the fields its kind allows; `field=null` empties an optional one. Only the owner runs it; it answers the batch with its new fingerprint.
- **`memo groups rename <group> <name>` and `memo groups delete <group>`.** Rename keeps the members; delete removes the group and its memberships only. Both refuse a built-in, missing or taken name and answer with the groups. A later run in the old name is refused with the groups there are.
- **`memo people resolve <id> company --mailbox <address>`** marks an address as the company's on a match by name, not only on a shared mailbox. The answer names the `mailbox`.
- **`memo tasks list 'related:"deal:7"'`** (also `lead:` and `organization:`) lists the tasks of a deal, a lead or a client company: those `deals context` and `organizations context` count.
- **The digest reads Google Drive, Google Calendar and the CRM.** `review agenda` gains the parts `calendar` (events added, moved or cancelled, and those starting within a day), `drive` (documents edited) and `crm` (deals and leads the CRM changed, with the stage they moved to). A digest's sources take `drive`, `calendar` and `crm`.
- **Your coding agent can read a picture you add.** With `memo models picture-reading set request --agent claude`
  (or `--agent codex`, with an optional `--model`), `memo sources add <picture>` gives the picture to that agent and
  keeps the text it read, with the extractor `agent:claude` or `agent:codex/<model>`; this comes before the AI model.
  The default is `never`; only you turn it on. The picture goes to the agent's provider unless it runs a local model.
  The same setting lets `images read` in the messenger CLIs read a chat picture (cli-core).

### Changed — may break callers

- **On cli-core 0.643.0 and cli-base 0.97.0.** Agents in a scheduled run see other people's text marked as untrusted, and under the read-only lock an output file goes only into the run's own folder (`read-only.output-outside`). Lists and searches come back in one shape.
- **`memo digest add|edit --agent` takes the agents a schedule may start** (cli-core 0.643.0): claude, gemini and opencode, and codex with `--allow-dangerous`, your consent that it may run any program inside its sandbox. The others are refused (`agent.unrestricted`, with `restricted_reason`). A new digest with no `--agent` takes the one agent installed; with none or several it is refused (`digest.agent-unchosen`) and the error lists the choices. Before, it took claude. `--max-cost` and `--max-cost-per-day` for an agent that reports no cost are refused (`agent.cost-unknown`).
- **Your digests are saved again once, by themselves.** cli-core 0.643.0 runs a schedule only from the agent it keeps, never from the saved command, so a digest saved before stops. At your first memo command after the update, memo saves each old claude digest again when its command is exactly the one memo made. Any other one, and every codex one, waits: `memo digest list` shows `needs` with the command to run. Never in an agent's run or under the read-only lock.
- **`memo actions confirm <id> <findings...>` leaves the findings not named waiting.** Before, it rejected them. With no names it creates every finding still waiting; `reject` rejects only what waits.
- **`memo_tools_search` ranks by the words it matches** (cli-core). A task phrase in an agent's words finds its command; the help's examples count. See [the measurement](https://github.com/WireCatLabs/cli-testing/tree/main/performance/agents/tools-search).

### Fixed

- **Contacts** (cli-core): one name in private chats on two messengers is proposed as one person; a person in a two-way private chat is no longer `automated`; a person on one of your own accounts no longer takes that profile's label as their name; a person's phone, address and username come from the identity that wrote the most; `hr@` scores below `info@`, and the same company in the CRM counts as a trace.
- **A picture the AI model answers nothing to says so.** `memo sources add` gives `image.reason: "ai.empty-answer"`
  and a hint to choose a vision model, instead of `ai.failed`; with cli-core's fix, moondream on Ollama reads pictures.

## 0.131.85 — 12.11.2026

### Added

- **`memo models local-only set on|off` and `show`.** One switch that keeps every model call on this computer, in
  every WireCat tool, and a list of each feature with where its data goes. Off until you turn it on; only you turn it
  off (cli-core's local only).
- **The Ollama reader takes another address on this computer.** `memo sources readers set ollama --model <model>
  --base-url http://127.0.0.1:<port>` keeps it as `sources.base_url`; an address on another computer is refused
  (`reader.address-refused`).
- **`memo answers create --analyze` uses the AI model chosen with `memo models ai set`** when
  `MEMO_MODELS_ANALYSIS_PROVIDER` and `MEMO_MODELS_ANALYSIS_MODEL` are not set, with the key kept for its address.
- **A digest can run codex, with a model.** `memo digest add|edit --agent claude|codex --model <model>`; an edit that
  changes the agent drops the old agent's model unless `--model` names one. `memo digest list` and `show` give
  `harness` and `model`.

### Changed — may break callers

- **Plain http to another computer is refused for every model call**, and voice messages are heard by the downloaded
  model first (cli-core 0.642.0).

## 0.131.84 — 11.11.2026

### Added

- **Search takes part of a name.** On cli-core 0.640.0, `from:`, `to:`, `cc:`, `bcc:` and `chat:` take `*` and `?`:
  `from:Ярослав*` or `from:*Мила*` matches every person whose name, @username or alias fits, and a name that fits
  nobody lists the nearest ones. `subject:`, `content:` and `transcript:` take a word's start (`subject:отчет*`), and
  `mailbox:`, `label:` and `tag:` take patterns anywhere.
- **`memo people links resolve <who> test` hides a person as test data.** They leave every list, search and count, on
  every computer that reads the store; `memo people list kind:test` lists them, and `resolve <who> keep` brings one
  back as a real contact. Sure test data, a seed id or an address at a reserved domain such as `example.com` or
  `.test`, is hidden without asking.
- **`memo people show` lists every phone and address of an account** as `phones` and `emails`, as a CRM contact holds
  several.

### Fixed

- **Check the links no longer doubts a short form of a name or a name that repeats its mailbox.** Ярик and Ярослав,
  Bob and Robert, or a Drive account named after its own address no longer make a "shared address" doubt.
- **`memo search people` leaves out people hidden as test data.**

## 0.131.83 — 11.11.2026

### Changed — may break callers

- **A task found in a message takes the fields of a project task.** `memo tasks update` gives it `--priority`,
  `--agent`, `--status todo` or `in_progress`, another message kind with `--type`, and `--project` moves it into a
  project under that project's key, keeping its source message ([tasks](./tasks.md#moving-a-task-to-another-project)).
- **`memo tasks list` with any board field lists found tasks too.** `assignee:`, `priority:`, words and the other
  fields, `--sort` and `--cursor` no longer need `project:`: they list every task, project and found, and each item
  carries its `assignments`. `project:*` still lists project tasks only. `memo tasks counts` counts found tasks too.

### Fixed

- **`memo actions confirm` decides a meeting findings batch by the findings it names.** As for mail findings, the
  named finding IDs are accepted and the rest rejected, with `--fingerprint` checked when given; it used to refuse and
  point to `meetings actions confirm`.

## 0.131.82 — 11.11.2026

### Added

- **`memo people resolve <id> company --all` closes every match on the same mailbox in one answer.** The answer's
  `closed` lists every match it closed; without `--all` it is only the match named, as before
  ([people.md](./people.md)).
- **`memo people links resolve <who> keep` says a person `people links check` doubts is right as they are.** The
  identities in doubt stop being listed until one of them moves to another person; an identity that joins later is
  checked again, and an agent's split of the kept ones is refused. Only the owner runs it; WireCat Desktop passes
  `--from-app`. `--json` answers `{ "person": "person:<uid>", "kept": ["<provider>:<id>", …] }`.
- **`memo people show --json` gives `display_name`**, the name `people list` shows for the person: their own, else the
  first readable account name, a username, phone or address.

### Changed — may break callers

- **`memo people unlink` names the person the identities leave, with `--from person:<uid>` or `--from person:me`.**
  It is required, and an identity that sits on someone else is refused with `identity.held-elsewhere`; the message
  names who holds it and nothing changes. Before, a script that meant to take a colleague's mailbox off your card
  took it off the colleague. A run without `--from` is refused with `person.from-required`. The `fix` of
  `memo people links check` ends in the `--from` it needs.

### Fixed

- **`memo people links check` no longer lists a person you linked by hand under mixed names.** The identities the
  person held when you linked another to them count as seen by you; one that joins later is still checked.
- **Mail triage proposes a new contact only when the email's text gives a better name than the sender line.** A name copied from the sender line is metadata, so it no longer waits for your review ([mail.md](./mail.md)).

## 0.131.81 — 10.11.2026

### Added

- **`memo groups update <source> --scope personal|work` sets an account's scope**, which decides whether work views
  and meeting preparation read it; what search copied of the old scope moves with it. `--chat <chat>` pins one chat
  of the account instead, and `--scope account` takes the chat's own scope off. Only the owner runs it: a read-only
  lock refuses it and an agent over MCP does not see it. `groups list` shows each account's `scope`
  ([usage](./usage.md#groups-of-accounts)).
- **`memo people resolve <id> company [organization]` says a match's shared mailbox is a company's.** The address goes to the
  organization you name, else to the one that has the address or its company domain, else to a company of `--name`,
  else to a new company named after the domain. The two people are not joined and are not suggested again on that
  address. Only the owner answers it, as with `people confirm` and `people reject`
  ([people.md](./people.md)).

- **`memo people review --json` shows `shared` and `mailbox` on a match.** `shared` is `role` for an address such as
  `info@` and `line` for a company's address; `mailbox` is that address. Both are `null` on other matches.

### Changed — may break callers

- **`memo people review` lists the highest score first.** Matches with no score and splits follow, newest first, as
  before.

## 0.131.80 — 10.11.2026

### Added

- **`relationships list --json` says what a document at either end is**: `from_document` / `to_document` with its
  title, its folder path (`Clients/Acme/Contract`), the link that opens it (Drive's web link), when it last changed and
  its type, so a review of a document's relationship needs no second lookup. `path` and `url` are `null` when the
  source keeps no catalog entry for the document. Each row also says in `role_list` which role list its role comes
  from (`null` where the role is free text).
- **`relationships roles list` shows the `contract` and `related` lists**, and each built-in role's `labels` in
  English, Russian and Spanish. `related` is offered for what a person or an organization is to another: `colleague`,
  `adviser`, `investor`, `mentor`, `family`, `friend`; `relationships roles add related <role>` adds your own. Any
  other word is still kept, marked `custom` (cli-core 0.634.0).
- **`memo stats projects show` says how busy each project is, for all projects in one call**: the chats linked to it
  or its child projects, how many are muted, messages and yours in the period (`--since-time 30d` by default, or
  `all`), the newest message and the three busiest chats, busiest project first. A muted chat's messages are not
  counted. `--limit`, `--page` and `--json`. It is a light read for a dashboard; `memo projects status <project>`
  still says where one project stands.

## 0.131.79 — 10.11.2026

### Added

- **`memo people links check` lists people that may be wrong**, you first: your own person holding an identity under
  another name (a partner's mailbox, a spouse's messenger), test data, an identity joined by an address a person of
  another name has, and one person with different names and nothing in common. Each says why, the evidence, and the
  `unlink` or `unmerge` that would fix it. `--limit`, `--page` and `--json`. See [People](./people.md#people-that-look-wrong).
- **An agent's `memo people unlink` and `memo people unmerge` propose instead of being refused.** They need
  `--reason` and wait in `memo people review` (and `memo review`) as a split; only you carry one out. MCP now offers
  both commands to agents, as proposals.
- **`memo people confirm` and `memo people reject`** answer matches and splits by id or range, or `all` that
  `people review` lists; `all` shows what it would do until `--yes`. Only you; MCP does not offer them.
- `memo people review` lists splits beside matches, each row with its `kind`, and takes `--kind link|split|all`. A
  split row names one `person`, never a `persons` pair.

### Fixed

- **`memo people show person:me` shows you**, instead of saying nobody matches.
- **`memo people show` prints how, by whom and when each merge was made**, as its JSON already said.
- **`memo stats tasks show` counts every stored account when you name none.** It used to stop with "give --source"
  and a list of accounts. The answer now names the accounts it read in `accounts`, and each chat row keeps its own
  account. `--source` narrows it to one account, and `--chat` still asks for `--source`, since a chat belongs to one
  account.
- **On `@wirecat/cli-core` 0.633.0.** Search takes `muted:true` and `muted:false`, for the chats you muted.

## 0.131.78 — 10.11.2026

### Added

- **`people list` rows carry `username_source`**, the messenger the username belongs to, and each identity of
  `people show` its `phone` and `email`.

### Fixed

- **The owner's partner, a spouse's account and a company's phone no longer end up on the owner's person.** cli-core
  no longer merges anyone into you by a rule: an account you connect under another person's name waits in
  `people review` with the signal `account`, and a shared phone or address with you is not offered at all. A shared
  address such as `info@`, a company's phone and a bot's number join and propose no one. Undoing such a merge with `people unmerge` gives you your own name back.
- **Telegram and WhatsApp contacts are `person` again.** Whoever wrote to you one to one, or in a group of at most 10,
  has a tie. A CRM contact counts only through a deal or lead of yours; the rest of a CRM is `stranger`.
- **Names are found in either script.** `people list name:Светлана` finds Svetlana, and `people check` puts a
  transliterated name first as the same name.
- **`sources suggest --provider=ai-model` names what is missing.** With no AI model chosen it answers the reason
  `reader.ai-not-set`, and with no key `reader.no-key` (an `authentication_error`), where both answered
  `config.invalid`.

## 0.131.77 — 10.11.2026

### Added

- **`memo sources add` reads an image with your AI model.** After `memo models ai set <provider> --model <m>
  --allow-remote`, a PNG, JPEG or WebP image up to 4 MB is sent to that model, and its text (or a short description when it
  has little text) is kept and searchable. The answer's `image` says `read_by`, or why the image is kept by its name
  only: `ai.not-set`, `ai.images-not-allowed`, `ai.key-missing`, `ai.owner-only` (an agent added it),
  `ai.setting-invalid`, `image.unsupported` or `ai.failed`. The image leaves
  this computer, except with Ollama. `memo models ai show|set|unset|remove|revoke|check` come from cli-core.

- **`memo sources readers set ai-model` reads sources with the same AI model and key.** One key and one model now
  serve images and facts: the reader uses what `memo models ai set` chose, and `leaves_computer` follows it (false for
  Ollama on this computer), and `model` names the one it read with. It takes no `--model`. WireCat Desktop offers it
  in «Чтение фактов» in place of its own key form.

### Fixed

- **`memo sources readers` works on a computer with no system keyring.** The reader keys fell back to nothing; they
  now use the 0600 file that `memo models keys set` writes there.
- cli-core 0.628.0.
- **`memo commands --serve` answers two requests of one command at once each with its own options.** Every request
  shared one program, and commander keeps parsed options on the command, so `people list kind:person --limit 1` and
  `people list kind:organization --limit 2` sent together both answered organizations, two per page. WireCat Desktop's
  People tabs showed pairs of equal counts. Each request now builds its own program.

## 0.131.76 — 10.11.2026

### Added

- **`memories list`, `facts list`, `actions list` and `agents list` take `--page`.** They stopped at 500 rows, so
  WireCat Desktop's Memory page could not show more of a kind. `--limit 500 --page 2` gives the next 500 in the same
  order, newest first, each row once, and `page.next_page` says when there is one, as `relationships list` does. A
  page at the 500 cap now says `has_more: false` when nothing follows, where it used to say `true`.

- **cli-core 0.627.0: `memo models ai` and a command server that answers 8 requests at once.** `models ai
  show|set|off|forget|check` picks the one AI model every WireCat tool uses. `memo commands --serve` now says
  `"concurrent":8` and answers several requests from WireCat Desktop together, each with its own output and exit
  code.
- **`records import` and `records check` take a CSV sheet of one type** (`--type invoice`): `;` or `,`, a byte-order
  mark, `10 000,50` and `09.11.2026` as Excel writes them in Russian or Spanish. Each refusal names the sheet's line
  and column. **`records templates show <type>`** writes the header row to fill (`--locale ru` puts `;` between cells)
  or an example envelope (`--format json`); **`records templates list`** lists the types and their columns. WireCat Desktop's Storage import uses both.
- **`memo sources preview <url>`: a web page as `sources add` would read it, with nothing kept.** It answers the
  title, site, description, the first lines of the text and its size, and refuses what `sources add` refuses. WireCat
  Desktop shows it in "Add to memory" before you save ([Sources you add by hand](./sources.md#look-at-a-page-before-adding-it)).

### Changed — may break callers

- **memo is built on cli-core 0.625.0** (was 0.624.0): records templates and CSV sheets, and a `stranger` kind in
  `people list` for a named person with no tie.

### Fixed

- **A failed `sync`, `doctor`, `digest run` or `digest backfill` under `commands --serve` keeps its exit code to
  itself.** The server answers several requests at once, and these four wrote the one process exit code, so the code
  went to whichever request ended next. They now set it for their own request.

## 0.131.75 — 09.11.2026

### Added

- **Digests by name: `memo digest list|add|edit|run|pause|resume|remove`.** Each digest has a title, its times
  (`--at 08:30 --at 18:00`, or `--at 'mon,fri 09:00'` on those days), the sources it reads (`--source telegram,mail`;
  `all` reads everything), its routes (`--deliver-to telegram-bot:<profile>/<chat>`, `email:<profile>/<address>`;
  `none` sends nowhere), its brief (`--text`) and its cost caps; `--paused` makes it off its timer. A daily digest reads a day, a weekly one the week, and
  one that runs more than once a day reads since its previous time. `digest run` builds one now: along its routes,
  only along the ones `--deliver-to` names, or with `--no-notify` nowhere. `digest list --json` gives each digest's
  last and next run. The morning digest is listed first, and its schedule, brief and templates stay where they were.
  Only the owner changes or runs a digest; each run is a paid model call.
- `digest brief show|edit|reset`, `digest backfill` and `templates` take a digest's name (`report/<name>`); a
  digest without its own template uses the morning digest's.
- `review agenda --source <sources>` reads only the sources given; a digest's run reads the digest's own sources
  without it.
- **`memo people check <name...>`**: people whose names start like the typed words, in any order, the same name
  first (`same_name`), so a form can show likely duplicates before adding a person.

### Changed — may break callers

- **`memo people list` lists one kind of person at a time**, people by default, the ones who write to you most first.
  `kind:` is `person`, `organization`, `automated`, `unsorted` or `all`. A person is you, someone you added by hand or
  assigned a task, or a named person with a tie to you: a one-to-one chat, a group of at most 10, mail you wrote, a
  meeting, a CRM or your address book. Bots, newsletters and notifications are `automated`; companies (an
  organization's account, `info@`, ООО, LLC, Airlines…) are `organization`; the rest, such as authors seen only in big
  groups and accounts with no name, is `unsorted`. The answer's `next` step `people.kinds` says how many each other
  kind holds. Each person now has `display_name` (no wrapping quotes; «Без имени» or a name with no letter shows the
  username, phone or email; `name` stays as stored), `kind`, `kind_signals`, `contact`, `phone`, `email`, `username`,
  `messages_from`, `last_contact` and `ties`. The list pages (`--page`) with an exact total, sorts by
  `--sort interactions|recent|name|tasks` and searches by `name:<text>` (3 characters at least). Run
  `<messenger> <profile> contacts sync` once per messenger account: until then nobody has the address-book tie.
- **`memo search people`** lists people with a tie first; each hit has `ties`, empty for someone with none.

## 0.131.74 — 09.11.2026

### Added

- **`memo search all --harder`: a hosted model reorders the first 30 results.** The model reads the question with the
  results and puts the ones that answer it first. It is off until you allow it with
  `memo models search-consents set <provider> --yes` (Anthropic, OpenAI or an OpenAI-compatible service such as
  OpenRouter), and then only a search with `--harder` sends anything: the question and the first 30 results (date,
  title, up to 400 characters each) go to that provider. A missing key, a wait of more than 5 seconds or any error
  keeps the usual order and says why. On synthetic data it raised recall in the first ten from 0.79 to 0.88 (reworded
  questions) and from 0.32 to 0.39 (LifeBench sample) over Memo's own search. With `--json`, `meta.ranking` gives the same as data: whether the
  model's order was used, why not, the provider, model, endpoint, results sent, cost, tokens and time. See
  [Search harder](./search.md#search-harder).

### Changed — may break callers

- **memo is built on cli-core 0.623.0** (was 0.620.0). Desktop's pages can keep one memo process running
  (`commands --serve`) instead of starting memo for every call; `relationships list include:ended` answers in a
  fraction of a second on a store with a busy person, not minutes; the store file's `-wal` is capped at 64 MiB.
- **A Drive document's owner and last editor show once in `memo context`, under its files.** Google's own record
  of who owns a document is a fact the source reports, not a suggestion waiting for review, so it would also have
  appeared among the relationships.

### Security

- `search all` run by an agent from a shell leaves out the deals and leads memo's saved permissions deny (`deals`,
  `deals.list`, `leads`, `leads.list`), as an MCP client's search and `deals context` already did, and its `issues`
  say which key. Before, such a run still showed the titles of denied deals. The owner at a terminal still finds
  everything.

## 0.131.73 — 09.11.2026

### Added

- **`memo search all` finds meetings, from every meeting account, personal and work.** It reads each account's
  search index and ranks meeting passages with messages, mail, notes, events, CRM and business data, at most 3 per
  meeting. A transcript hit's `next` step is `memo meetings passage <cue_ref> --source <provider>:<account>`.
  `missing` names an account whose index is not built yet, and `next` gives
  `memo search meetings <query> --source <provider>:<account>`, which builds it. `missing` also names a meeting account
  that could not be read. `--source zoom:work,notes` reads only the accounts it names; `--only` takes `meetings` too.
  In a group, meetings come from the group's meeting accounts only. Unless the permissions let `search.meetings` and
  `meetings.passage` go ahead (`allow` or `readonly`), meetings are left out and `missing` says so; `ask` leaves them
  out too.

### Changed — may break callers

- **`memo digest backfill` takes `--since-time <date> --until-time <date>`, no longer `--from` and `--to`.** Across
  WireCat CLIs `--to` names a recipient (a chat or an address), so the date range now uses the pair memo's other
  commands already read. WireCat Desktop's Digests screen sends the new flags, and the old ones to an older memo.

## 0.131.72 — 09.11.2026

### Added

- **`memo sources suggest <ref>` has the reader you chose propose facts from a source.** Each fact comes with the
  exact words it rests on, checked against the stored text; a fact whose quote is not there is dropped, and one
  already stored from the source is named as `duplicate_of`. The rest wait as one findings batch citing the source,
  staged by `memo-reader`, that only you confirm (`memo actions confirm`), even with `agent_decisions` on. The same
  text read again by the same reader answers `reused: true` without asking it; `--rescan` asks again.
- **`memo sources readers list` and `memo sources readers set <reader> [--model]`.** The readers are Claude Code and
  Codex (your own sign-in, tools off, an empty folder), Ollama on this computer, and the OpenAI and Anthropic APIs
  with the key `memo models keys set` keeps. The list says for each whether it is ready, whether the text leaves this
  computer and whether it could read files; only you choose one, kept as `sources.reader` and `sources.model`, and
  memo never picks one. Over MCP, `sources suggest`, `sources readers set` and `models keys` are not offered.
- **`memo people show`, `review`, `scan`, `link`, `unlink` and `unmerge`: who is who across sources.** `show` gives a
  person's identities by source, the accounts that saw each with their scope, the merges and the open matches, naming
  the people as they are now; each match says its `signal`, the `identity` and `with` it names, and whether confirming
  `joins` the two people or moves one identity. `scan`, and every `memo sync` (`--only people`), joins people on the
  same email address in any scope when no third person has it and it is not a role address (`info@`, `support@` …),
  and on a phone number exactly two people have when one has it in Telegram, MAX or WhatsApp. A role address only
  proposes a match, and a no-reply address neither joins nor proposes anyone. A pair the owner rejected is never
  joined, but new evidence about it proposes it again; the rejected evidence never does. Other shared numbers and
  addresses, and a meeting guest's typed address, wait in `review`, which says `has_more` when `--limit` cuts it.
  `link` links for the owner; an agent's link waits for the owner as an `identity_link` match and needs `--reason`.
  `unlink` (one identity, or several to one new person, each by its exact id: a name is refused with
  `identity.not-found`) and `unmerge` are the owner's alone: an agent is refused (`identity.owner-only`), MCP does not
  offer them, and WireCat Desktop passes `--from-app`. `memo review kind:identity_link` lists the matches. They are
  owner-only, so an agent's `review confirm` is refused. `memo skill show proposals` is the agent's guide.

## 0.131.71 — 09.11.2026

### Added

- **Base stages: `memo stages show|create|rename|move|remove|list|set|confirm`.** The owner's own stages
  of deals and of leads, the columns of a board across every pipeline and CRM, and every other stage mapped onto
  them, suggested by memo and confirmed by the owner. Each command takes `--json`. In a group they count and list only
  the group's pipelines and the owner's own. Editing the base set and `confirm` are the owner's own
  (`stage.owner-only`). An agent's `stages set` stays a suggestion. `deals move` and `leads move` take a base stage's
  `stage:<id>`: the owner's deal moves to the one stage of its pipeline mapped there. Several give
  `stage.choice-required` with `candidates`, none gives `stage.unmapped`, and a CRM's copy gives `stage.crm-copy`
  with its `writes_with`. Rows of `deals list` and `leads list` gain `base_stage`, `null` until confirmed. Needs the
  cli-core release with base stages (store version 60).
- **`writes_with` on CRM rows of `deals list`, `leads list` and `pipelines list`**: the CLI that changes the row on
  its CRM (`tool`), the row's `account`, and the `profile`, named only when exactly one profile of that CLI is on the
  account; otherwise `null`, with `profiles` and `why`. In a group, a profile on an account outside it is never named.
  The owner's own rows have `null`. WireCat Desktop's Clients board reads it to move a card's stage through b24.
- **`memo relationships roles list [list:<list>] | add <list> <role> [--label] | remove <list> <role>`**: the roles a
  relationship may take, built in and your own (cli-core's role lists). Only you change them; one still held is kept.
- **`memo search people` finds a person you added by name only.**
- **`memo relationships add --kind reports-to|customer-of|partner-of`, `--position` (the job title), `--start-date`,
  `--end-date`**, and `relationships update --position --start-date`. `memo relationships end <id> --end-date <date>` says
  a relationship ended; it stays, as `ended`.
- **`memo organizations context <ref>` is the organization's whole picture** (cli-core's `organizationContext`): its
  people by role, customers, suppliers and partners, projects, open deals and leads, invoices, payments and orders as
  stored, how much its people wrote, open tasks, categories and `coverage`, then its notes and tags.
- **`memo deals context <ref>` and `memo leads context <ref>`, `--brief` for an agent** (cli-core's `dealContext`):
  stages, client, people with roles and standing, owner, project, money reached by project or client, its people's
  messages, mail and meetings in its lifetime marked `proposed`, open tasks and `coverage`.
- **`memo deals update <ref> --project <key>`** (and `leads update`) sets the project a deal belongs to, a CRM's copy
  too; an empty value clears it.
- **`memo organizations list category:client`**, and `supplier`, `partner`, `employer`: read from relationships.
- **`memo relationships list` filters `kind:`, `role:`, `standing:`, `from:`, `to:`, `at:<day>`, `include:ended`**
  and pages with `--limit` and `--page`, the pending proposals with them (cli-core's `listRelations`). `about:` gives
  each row its `direction` (`outgoing` or `incoming`) and an incoming one its `inverse` (`manages` for `reports-to`). Every row shows its `standing` and the account that reported it; a role
  saved before the role lists is kept and marked `custom`.
- **`memo search all --only crm`** searches deals and leads alone; `search all` names them in its help.
- **Account groups: `memo <group> …`, `MEMO_GROUP` and `MEMO_GROUP_LOCK` (WC-ACCT-13).** Memo reads every account
  by default (`all`, also `memo all …`); a group is an opt-in list you save. A first word that is no command is a
  group: `memo work search all "renewal"` reads only its accounts. Without `--source` a read takes the group; a given
  one is narrowed to it, and an outside `--account` is refused. A command that reads one kind, such as `search mail`,
  takes the group's accounts of that kind. A word that is neither a command nor a group names the groups. What you
  made yourself (notes, projects, tasks, invoices, memories, facts) shows in every group. `MEMO_GROUP_LOCK=work` pins
  the process, `memo mcp serve` included, and fails closed: only the commands that keep to a group run, and a
  reference or a bare id of account data outside it, another group, `all` and every group change are
  `permission_error`. Under the lock, evidence, sources, proposals and actions of an outside account are left out
  and counted, never shown or decided, and a context counts the accounts it kept out instead of naming them.
  `pipelines list` and `pipelines show` keep to the group too: in a group, a name means the group's pipeline of that
  name. Needs cli-core with the group lock (cli-core#2632).
- **`memo groups list | add <group> <source> | remove <group> <source> | move <source> <from> <to>`.** The
  list shows each account with its profiles in every app, why it is in, `also_in`, the duplicates and the
  profile-name suggestions. `memo groups add work <provider>:<account>` is the command a CRM sync's `group_hint`
  names.
- **`memo models keys set|remove <provider>`**: the key write-time enrichment sends, read from stdin or a hidden
  prompt (never an argument) into memo's keyring entry `embeddings:<provider>`. `--json` answers
  `{ provider, stored: true, source: "keyring" | "file" }` and `{ provider, removed, from }`; the key is never printed.
- **`reason_id` beside `reason` in `item.enrichment`** of `memo sync --json`: `enrichment.no-key`, `key-rejected`,
  `unreachable`, `rate-limited`, `bad-replies`, `cancelled` or `error`, so a window can word it itself.

### Changed — may break callers

- **`memo context person:<id>` reads every account that saw the person** (cli-core's `canonicalPersonContext`): two
  accounts no longer ask for `--source`, and a CRM-only or name-only person answers too. Every context has
  `business` (organizations, reporting lines, deals, projects and categories, each relationship with its `standing`);
  `person:` answers carry `coverage`. `relationships` now holds a CRM's `reported` links beside yours, each with its
  `standing`, where before it held confirmed links only.
- **`memo relationships list` gives each row's `status` as its standing**: `confirmed`, `reported`, `proposed` or
  `ended`. A CRM's link said `proposed` before, though no proposal waited for it. `projects context` gives each
  relationship its `standing` too.
- **`memo organizations context` answers cli-core's organization context**: `people`, `customers` and the other
  sections replace `relationships`; `notes` and `tags` stay.
- **A role is one from the registry's lists** (cli-core#2629): `--role cto` is refused with the list.
  memo's own examples and tests now use list roles.
- **EmbeddingGemma is memo's default search model** (cli-core 0.619.0). With no `memo models set`, sync embeds and
  search by meaning use it; a machine that has e5-small and not EmbeddingGemma keeps e5-small. `memo models download
  embeddinggemma` asks for no terms: the download writes the Gemma notice beside the model, and `THIRD_PARTY_NOTICES`
  names it. A timer run embeds fewer chunks with it, so it still ends in time.
- **`item.enrichment` is the only enrichment report of `memo sync --json`**: `notes_embedded.enrichment` and
  `mail_embedded.enrichment`, which repeated its parts, are gone.
- **A sync that sent records and got none back enriched says `failed`**, with its reason, not `done`. Notes failed
  beside mail enriched reads `stopped`.

### Fixed

- **`memo search all` leaves deals and leads out when memo's permissions deny them**. It showed their
  titles under `search all`; now it names what it left out.
- **`memo projects status` help no longer promises "confirmed" deals**: a deal has no confirmation.

## 0.131.70 — 09.11.2026

### Added

- **`memo digest brief show | edit | reset`: your own instructions on what the morning digest collects.** Write
  which projects, people and topics matter, what to skip and how many items you want; `memo skill show
  morning-digest` then ends with a section "The owner's brief" holding your text, and says the brief adds to the
  skill and wins where it contradicts one of its rules. The run itself does not change: it stays read only, with
  memo as its only tool and the schedule's cost cap. `edit` opens `$EDITOR`, or takes `--file <file>` (`-` reads
  stdin); `--undo` puts back the body your last change replaced, and `reset` removes the brief, which `edit --undo`
  brings back. At most 4000 characters, because every morning run reads it (`brief.too-long`). Only you change it:
  an agent is refused (`brief.owner-only`), and so is any change under `MEMO_READ_ONLY`. `show --json` answers
  `{ body, chars, limit, updated_at, updated_by, history }`. It is kept in the shared store beside the digest's
  templates. Without a brief, the skill reads as before.

## 0.131.69 — 09.11.2026

### Added

- **An engagement level on a person's membership of a project.** `memo relationships add` and
  `memo relationships update <id>` take `--engagement none|low|medium|high`: how much you deal with that person
  yourself, not how active they are. Without one it is unknown; `--engagement ''` clears it. It is shown in
  `relationships list`, `review show` of a change, `projects context` and every relationship answer
  (`engagement`). `projects context` and `relationships list` put people in the order high, medium, unknown, low,
  none. A low member stays a member, so `projects evidence` still reads what they write.
- **A role note beside the role.** `--role-note <text>` on `relationships add` and `relationships update` keeps what
  the role means here in your words (`role_note`), while `--role` stays one of its list.
- cli-core 0.618.0.

## 0.131.68 — 09.11.2026

### Added

- **The scheduled mail triage files a sender as envelopes itself.** A `memo schedule agent` run may now run `mail`
  too, under `MAIL_READ_ONLY`: it reads mail and adds `mail <profile> rules add --sender|--list-id … --do envelope`
  for a sender it is sure only sends newsletters, promotions or notices, at most 5 per run, and lists the others for
  you. mail refuses it any other rule and any other change; this needs a mail release that has the narrowed
  `rules add`, and until then the triage only lists the rules. A schedule saved by an older memo allows only `memo`;
  add it again to replace it.
- **`memo digest backfill --from <date> --to <date> [--yes] [--json]`: the morning digests of past days.** For each
  day without a digest, the morning-digest schedule's agent runs as its timer does (the same skill, harness flags and
  per-run cap), reading the agenda as of that day's run time, and the run is kept as that day's in the schedule's
  `runs/`, with `"backfill": true` in its `.report.json`, for WireCat Desktop's digests screen. It is never sent to
  Telegram or mail, and the last run, `latest.md` and `latest.txt` stay as they were. Without `--yes` it prints the
  days it would build, the days skipped and the estimate (the days times the last run's cost): `--json` answers
  `{ days, skipped, estimate_usd }`; with `--yes` also `built` (`date`, `at`, `exit_code`, `cost_usd`), `left` and
  `cost_usd`. Each run counts in today's spend, and no day starts once it reaches the schedule's daily cap or a day
  fails; the days it leaves are in `left`. Only the owner runs it: an agent is refused (`backfill.owner-only`), and
  so is `MEMO_READ_ONLY`; WireCat Desktop passes `--from-app`.
- **`review agenda --before-time <time>`** builds the agenda as of a past ISO time or date: `--since-time` counts back
  from it, items dated later are left out, and the tasks "new since" start at the digest report before it. The store
  keeps only what holds now, so a chat or thread answered since reads as answered.
- **The morning-digest skill puts `person:<id>` and `project:<key>` refs on items** where memo printed them, after the
  ref of where the item happened, so Desktop and the digest's links open the person or the project; and for a past
  day's run (`backfill:` in its input) it reads the agenda with the window given and writes from the agenda alone.
- cli-core 0.618.0.
- **A pull request adds its changelog entries as a fragment, `changes/<branch>.md`.** Open pull requests no longer
  conflict under `## Unreleased`. `pnpm docs:check` checks each fragment, and `bin/release` collects them into the
  version's section. An entry under `## Unreleased` still works during the move.

## 0.131.67 — 09.11.2026

### Added

- **`memo templates`: the owner's own templates of the morning digest, per channel and language.**
  `memo templates list [query...] | show | edit | preview | reset <key> --channel telegram|email|text
  [--locale ru|en]`, from cli-core's `templates` group, kept in the shared store; `templates list channel:telegram
  source:stored` narrows the list by `key`, `channel`, `language` and `source`. `edit` opens `$EDITOR` or takes
  `--file <file>`, and checks the template against a synthetic report and the last real digest before it saves
  anything; `edit --undo` puts back the body the last change replaced, and `reset` returns to the shipped template.
  `edit` and `reset` are the owner's alone: `MEMO_READ_ONLY` and an agent's run are refused. `memo commands` lists
  the group under Automate. The digest's task line gains "без срока: N · открыть" for open tasks with no due date.
- cli-core 0.616.0.
- **`memo sources add <path|url|->` keeps one file, web page or pasted text as a document of its own**, searchable
  and citable like a folder document, with `--title`, `--subject` (repeatable), `--keep-copy` and `--max-chars`. A
  file is read by cli-core's readers, a link once from this computer as a public page (no cookies, no private
  addresses, 50 MiB, 30 s, 5 redirects), and `-` reads stdin. Only the text is kept unless `--keep-copy` copies the
  file into memo's data folder. Adding the same source again changes only its subjects; content already in a folder
  or Drive is answered as `duplicate_of`. The answer says what was read and kept, and whether it is searchable by
  meaning; refusals keep cli-core's `source.*` reasons with what to do next. An agent's subjects wait unconfirmed.
- **`memo sources show`, `memo sources mentions` and `memo sources remove`.** Show gives a source's text (bounded by
  `--bytes`), what it is (kind, address, type, size), its subjects and the facts, memories and findings batches citing it; mentions lists the known people
  and organizations named in it; remove (yours only) deletes the source and its kept copy and names what cites it.
- **Folder import reads web pages saved as `.html` and `.htm`.** A watched folder that holds them imports them on
  the next `memo sync`.
- **Over MCP, `sources add` takes text only**, so an agent cannot make memo read a file or open an address;
  `sources remove` is not offered.
- **Memories and facts follow their sources.** When a cited source changes, goes, is replaced or is contradicted,
  memo opens a source review (`memory_source_review`) and marks the record; its status never changes on its own.
  - `memo memories check [--limit N]` looks again, and `memo sync` does it as its last step, "memories follow
    sources"; a failure there is reported as `source_check_failed` and never fails the sync. `check --json` answers
    `checked`, `baselined`, `raised`, `refreshed`, `closed` and `changed_refs`, the changed sources no findings
    batch reads yet, for an agent to read again with `projects actions add`. A run names a change once; with
    `--since-time` it also lists what earlier runs, such as the timer's sync, found changed since then.
  - `memo memories challenge` and `memo facts challenge <ref> --evidence … --reason … [--suggest …]` say a record no
    longer holds. An agent may run them; they only open or add to the owner's review.
  - `--quote <ref>=<words>` on `memories add` and `facts add` keeps the words a record rests on, so an edit that
    keeps them raises nothing. A quote the source does not say is refused (`evidence.quote-not-found`), and one that
    names no `--evidence` reference too (`evidence.quote-unmatched`).
  - `memo review` lists `kind:memory_source_review`. `review show` gives each source as cited and as it is now, the
    challenges and suggestions, and the command for each answer. `review confirm` says it still holds, `review
    reject` dismisses it; both are the owner's alone, and `--from-app` counts as the owner. Correct with `memories
    add --supersedes`, withdraw with `memories invalidate` or `facts reverse`.
  - `memories list/show` and `facts list/show` carry `source_review`: the open review's `id` and `cause`, or `null`.
  - `memo review agenda` has a `sources` section: the source reviews raised since `--since-time`, and the sources
    found changed since then that no review or findings batch names. A review that only grew in place is not listed
    again.
- **An agent may propose a correction of a memory.** `memo memories add --supersedes memory:<id>` from an agent, or
  `memories add` with `supersedes` through the MCP server, no longer fails with "only the owner corrects a memory". The
  correction waits as proposed, and the memory it corrects stays as it is until you confirm the correction; rejecting
  or removing it leaves that memory. Yours still applies at once (cli-core 0.616.0).

## 0.131.66 — 08.11.2026

### Added

- **`memo records import` and `records check` take `--region <country>` for a vCard file** (`ru`, `gb`, in any
  case): a phone number written without `+` is read in that country, so the contact matches the person the number
  already names instead of becoming a second one. An envelope names its region in `options.phone_region` instead.

### Changed — may break callers

- **`memo subscriptions add` and `subscriptions update` take `--period <count-unit>` (`1-month`, `1-year`) instead of
  `--every`**, which shipped in 0.131.64. `--every` in every WireCat tool is a timer's `<duration>`, such as `5m`, and
  one flag with two kinds of value failed the shared audit. `--every` on subscriptions is now an unknown option, with
  no alias: rename it in scripts and agents' prompts. The JSON answer's `interval` is unchanged.

## 0.131.65 — 08.11.2026

### Fixed

- **`review agenda` no longer names a synced account as having no sync schedule.** An account stored or synced
  within a day gets no `health` line at all; a tool's schedule counts for the profile it runs as, by its
  `<PREFIX>_PROFILE` or its first argument (`tg second messages sync`); a running `serve` counts for its profile's
  account; and an account that no profile of its tool holds gets no line, since memo cannot tell what syncs it. A
  `no-schedule` account with nothing new in 30 days is stale since its last stored message, not for 0 hours.

### Added

- **`review agenda`'s `tasks` counts `undated`**: every open task with no due date, however old, in `--json` and
  `--compact`; the morning-digest report copies it as `tasks.undated`.

## 0.131.64 — 08.11.2026

### Fixed

- **`relationships add --role` help no longer suggests `cto`.** A person's role in an organization or a project
  comes from that relationship's list, so the help, the example and `docs/people.md` now name valid roles
  (employee, contributor).
- **`memo records link custom:quote:Q-7` reads the type `custom:quote`.** A record key was split at its first colon,
  so a custom type was read as `custom`.
- **`memo records import` streams JSONL** from a file or stdin a record at a time instead of reading the whole file
  first, and its text receipt names the review kinds of what it proposed, the records left unmatched, the values kept
  as data only, and when a list stopped at 1000 entries. Every refusal is also printed on stderr as it happens, one
  line each, including those past the receipt's 1000.
- **`memo records import --json` gives a valid answer for an empty file, a JSON array or a refusal with no place in
  the file**: its issue names `/`, the envelope's root, where it named an empty pointer the answer schema refuses.
- **A missing or unreadable records file is `not_found` (`records.file-missing`) or `validation_error`
  (`records.file-unreadable`)**, not a system error.

### Added

- **`memo show` and each business `show` list where an entry came from** (`sources`): the source records mapped to
  it and the records whose relations name it, such as a quote `quoted-for` a deal. This covers products, contracts,
  subscriptions, wallets, transactions, invoices, payments, orders, deals, leads and pipelines. The title of one an
  import or a CRM made is the source's words, so `memo show` marks it `untrusted`. An MCP client denied
  `records.show` gets no `sources`, as `records show` would refuse it.
- **`memo show` opens invoices, payments, orders, deals, leads, pipelines, products, contracts, subscriptions, wallets
  and transactions** with memo's own `show`: its `open` names `memo invoices show invoice:4` and the like, where it
  said nothing opens them.
- **Products, contracts, subscriptions, wallets and transactions.** `memo products` (list, show, add, update) keeps
  the goods and services you sell or buy with their prices, written directly by anyone. `memo contracts` (list, show,
  add, update) keeps their dates, renewal and notice, and `show` gives the last day to give notice; one with an amount
  from an agent waits for your review. `memo subscriptions` (list, show, add, update, cancel, and `prices add`) keeps
  who supplies and who pays, how often (`--every 1-month`) and every price it had; a new price is a row of its own and
  an agent's is a proposal of its own. `memo wallets` (list, show, add, update) keeps bank accounts, cards and cash in
  one currency each; `show` computes the balance from the opening balance and the confirmed, booked transactions, with
  what is pending beside it, and only you set the opening balance. `memo transactions` (list, show, add, update, and
  `splits add`/`remove`) keeps what a statement shows moving, the payment it settles and its categories. Every list
  filters with query words, and every write from an agent that feeds money totals waits as a proposal; `memo review`
  lists and decides `contract`, `subscription`, `subscription_price` and `transaction`. Over MCP, `wallets update`
  is refused by default, as it carries the opening balance; `wallets show` gives an imported wallet's opening balance
  as its source sent it (`source_says`) until you set one. A contract's parties come later, with cli-core's
  relationships: `contracts add` takes no `--organization`, `--person` or `--role` yet.
- **`memo orders lines` and `memo invoices lines` (add, remove).** An order or an invoice is made of lines, each a
  quantity at a price given as `--amount`, and its total is their sum; `--product` copies the product's name and price,
  so a later price change leaves the line as it is, and `--amount` overrides its price. `orders show` and
  `invoices show` list the lines in their text.
- **`memo payments add --refund-of <payment>`** records a refund: a payment going the other way, never more than the
  payment it gives back for.
- **`memo records show`, `records delete` and `records match`.** `show` prints one record as its source said it;
  `delete` marks it deleted as an import's delete does, keeping the entry made from it flagged for you; `match` links
  every waiting person, organization and project of a source to the one entry its identifiers name, or makes one.
  `records list` takes `unmatched:`, `entity:` (the records mapped to one of your entries), `batch:` and `deleted:`,
  and `records show` lists the records that name the record (`incoming`).
- **`memo records import` and `records check` take a vCard address book** (`.vcf`, `BEGIN:VCARD`) as a phone's
  contacts, under `--account phone:<device>`; what the converter kept without matching is printed as a notice.
- **`memo events list` lists the calendar events of every account in the store, phone calls included.** A call
  imported with `memo records import` showed only in `search all`; it is now listed with no query, beside the
  calendars gcal stored. Without `starts_at` the list covers the last 30 days and the next 7, latest first, and names
  each account it read. `account:`, `calendar:`, `event_type:` and `starts_at` narrow it. `memo events show event:42`
  opens one, and `memo show event:42` now names it. Over MCP, `events.list` set to `deny` also leaves events out of
  `search all`, and `events.show` refuses `memo show` of an event.

### Changed — may break callers

- **`memo records check` is a write for MCP** (asked by default): a dry run holds the store's write lock and grows
  the write-ahead log for its length, so `MEMO_READ_ONLY` refuses it too.
- **A person, organization or project a records file names is matched or made on import** (cli-core's records
  envelope): one exact e-mail, phone or other identifier links it, none makes it, two or more leave it waiting for
  `memo records link`. A record that waited for `records link` before is matched or made on its next import, so its
  invoice or payment becomes a proposal at once. Run `memo records check` on a file before its next import to see it.

## 0.131.63 — 08.11.2026

### Added

- **`memo show` opens invoices, payments, orders, deals, leads and pipelines** with memo's own `show`: its `open`
  names `memo invoices show invoice:4` and the like, where it said nothing opens them.

### Security

- **`memo show` over MCP refuses a reference whose own command the server denies.** A server whose permissions denied
  `invoices` (or `invoices.show`) refused `invoices show`, yet `memo show invoice:4` gave the agent the invoice's
  number, amount and counterparty, and the same for an order, a lead and a pipeline. It is now a `permission_error`
  naming the key, for every kind memo opens, whether the key is passed with `--permission` or saved in the config file.
- **`search all` over MCP no longer shows deals or leads an agent may not list.** A server denying `deals.list` or
  `leads.list` refused those lists but still showed deal and lead titles in `search all`; those hits are now left out,
  with a `permission_error` issue for source `crm`. `crm.list` leaves the whole CRM lane out. `--only crm` and
  `--only business` name those lanes, and are refused when the lane may not be read.

## 0.131.62 — 08.11.2026

### Added

- **`memo review agenda` says what it read and which accounts need a sync.** `scope` gives the window, each source
  with its number of accounts, and how many chats, personal mail threads, tasks and meetings it read; `tasks` counts
  the overdue, today, tomorrow and new tasks and gives `new_since`; `health` names each account whose sync needs a
  look: `sync-failed` (its scheduled sync fails: since when and the failure's reason id), `no-schedule` (no schedule
  and no running `serve` syncs it) or `quiet` (it syncs, but nothing new for longer than three of its usual gaps,
  and at least three days). Each account is named by its name, username or address, never its id. `--compact` prints
  the three as JSON lines that the morning-digest skill copies into the report.

### Changed — may break callers

- **The agenda's `tasks` section is the open tasks created since the last morning-digest run** (a day back when it
  never ran; the start of the failures while it fails) **and those overdue, due today or due tomorrow**, by the local
  day, project tasks included. Each says which of these it is, who asked, who does it and its due date. Tasks only to
  check, and the "open tasks without a date left out" note, are gone.
- **`owed` lists people only.** Dialogs the messenger marks as a bot, and Telegram's service notifications, are left
  out.
- **`coverage[].stale` is gone**, and the `coverage:` line no longer prints STALE: when the store last saved
  something says nothing about the sync. `health` says it instead.
- The morning-digest skill copies `scope`, `tasks` and `health` from the agenda into the report, writes one `task`
  item per agenda task with its `task:` reference, and lists only people as owed replies.

### Security

- **`search all` over MCP no longer shows business data an agent may not list.** A server whose permissions deny
  `invoices.list`, `payments.list` or `orders.list` (or their group) refused those lists but still showed their
  titles in `search all`; those hits are now left out, with a `permission_error` issue for source `business`. The new
  key `business.list` leaves the whole business lane out, and `--permission` and the config file accept it. A page
  of `--limit` hits reads on past the hidden ones, up to five more pages, so it is not cut short by them.

## 0.131.61 — 08.11.2026

### Added

- cli-core 0.612.0.
- **Write-time enrichment, off by default** (cli-core's `models consents`): `memo models consents show`,
  `set <openai|anthropic> --model <m>` (a preview until `--yes`) and `revoke`. With it on, `memo sync` sends the notes,
  documents and mail not yet enriched to the chosen provider, up to 600 of each a run, before it embeds.
- **`memo sync` reports what enrichment sent**, notes and mail together, so a failure is not silent:
  `enrichment: {status, provider, model, sent, enriched, failed, left, input_tokens, output_tokens, cost_usd,
  reason}` in `--json`, and a line in the text. It is there even when the embedding model is missing. Absent while
  enrichment is off.
- memo reads the provider key from its keyring entry (`cli-memo` / `embeddings:<provider>`, then `cli-memo` /
  `<provider>`) after `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`, so a desktop started from the launcher finds it.

## 0.131.60 — 08.11.2026

### Fixed

- **An exact word that only word search finds stays on the page of `search all`.** After the first hit of each
  source, hits were ordered by the search model's score, and a hit only words found had none, so it sorted behind
  every hit the model found. It now takes the score of the hit above it in its own source (cli-core 0.611.0).

## 0.131.59 — 08.11.2026

### Added

- **A project's group senders can be decided together.** A person `relationships scan` proposes because they write
  in a project's group now says which group and how much ("wrote 40 messages in «Sales» (25 people)"), and the
  proposal's evidence leads with the group. When a scan proposes two or more senders of one group, its answer lists
  the group under `groups`, with the command to review them: `memo review list via:<chat>` lists the proposals whose
  evidence holds that reference, and its `next` step confirms them all in one `memo review confirm`. A pending
  proposal takes the new reason on the next scan (cli-core 0.610.0's `chat-senders@3`).
- **`search all` also finds invoices, payments, orders, contracts, subscriptions, products and wallets** by the words
  of their numbers and names, as the `business` source (cli-core 0.610.0). Like deals, it reads title words only, so
  a query with `?`, `-` or `*` leaves it out with the reason.

## 0.131.58 — 08.11.2026

### Changed — may break callers

- **The morning digest answers with one `wirecat.report/1` JSON document** instead of text: sections and typed
  items (reply, question, task, fact, risk, money, decision, meeting) with who, topic and what to do, and a list of
  stale sources. WireCat renders it per channel with the owner's headings, emoji and layout (cli-core's report
  renderer, 0.609.0), so the agent no longer writes any of them.

## 0.131.57 — 08.11.2026

### Fixed

- **memo embeds and searches with the model chosen by `memo models set`.** A downloaded EmbeddingGemma or
  e5-large was never used: memo embedded and searched with e5-small whatever was chosen, and `embedding_model` was
  not a memo setting. The next `memo sync` runs give your notes and mail vectors from the new model a part at a time;
  the old model's vectors are kept, so going back is instant.
- **The missing-model message names the model that is missing** and the exact download, with `--accept-terms` for a
  model that needs it; it always named e5-small.
- **A sync with a slower model embeds fewer chunks a run**, so a timer run still ends within its five minutes.
- `memo doctor` reports the search model in use, not always e5-small.

## 0.131.56 — 08.11.2026

### Fixed

- **A question with a time in it finds what its words hold again, with no search model downloaded.** "When is the
  steering committee meeting? Answer as HH:MM" and `steering committee 10:30` found nothing: the time made the
  question look like syntax, so every word had to be in one record. When nothing holds every word of a short search,
  `search all` now names the word no record holds (cli-core 0.609.0).
- **`search all` gives the page to the best hits of every source.** Mail and notes took turns, five each, however
  weak one source's hits were, and mail asked the search model a different question than notes did. A hit only words
  found keeps its place among its source's hits (cli-core 0.609.0).

### Added

- **`memo models set` and `memo models add`** come with cli-core 0.609.0; memo itself still embeds and searches with
  e5-small until it follows the chosen model.

## 0.131.55 — 08.11.2026

### Fixed

- **Over MCP, `notes add` and `notes edit` no longer read `--text-file` or write `--export`.** `-` read the MCP
  server's own stdin, a path read any file of the computer memo runs on into a note an agent could read back (a
  remote client's included), and `--export` wrote a file into any folder the agent named. Both options are left out
  of the MCP catalogue, and a run over MCP refuses them with `permission_error` before the note is saved; an agent
  gives the note as `text`.

## 0.131.54 — 08.11.2026

### Fixed

- **The scheduled mail triage no longer acknowledges mail its input left out.** The input was cut at 60,000
  characters mid-text while the cursor printed with it covered the whole batch, so the mark could move past emails
  the agent never saw. memo now builds the input under that cap, leaves whole emails out in store order, and gives
  each mailbox the cursor and findings key of the last email shown; the next run starts at the first one left out.
  When even the first email, or a group of held emails that share one cursor, does not fit, their texts are
  shortened to fit (`text_cut: true`, with a hint to read them whole), in any mailbox; past the first mailbox not
  below 300 characters, else the mailbox waits unacknowledged for the next run (cli-core 0.606.0's
  `email.cursor`).

## 0.131.53 — 08.11.2026

### Fixed

- **The morning digest is written in the owner's language, without references, commands or Gaps and Coverage
  sections.** The `morning-digest` skill now asks for plain text in the sections and line shapes of the digest
  format; the agent keeps what the agenda missed out of the report. One line says a source has not synced for over
  24 hours.
- **cli-core 0.606.0: the mail triage agent no longer repeats the same batch all day.** A batch of held emails only
  reused the findings key of the run that set the mark, so staging was refused (`mail-findings.key-used`), the mark
  never moved and every scheduled run paid for the same emails again. It now takes a key of its own. Each email in
  `review --holder` also carries the cursor that ends the batch at it.

## 0.131.52 — 08.11.2026

### Fixed

- **`memo sync` names a damaged store instead of a bug.** "database disk image is malformed" or "file is not a
  database" from the shared store was `internal_error (command.crashed)`, "the command failed; this is a bug", in the
  sync's summary and the scheduled sync's failure banner. It is now `configuration_error (store.damaged)`: the store
  file is damaged, and `memo store recover` says what is lost and how to recover it (cli-core 0.605.0).
- **A `memo sync` source that finds the store damaged stops later writes.** Its failure leaves the damage mark beside
  the store, as a failed command already does, so the next sync and every other tool's write refuse with
  `store.damaged` until `memo store recover` (cli-core 0.605.0). `memo doctor --deep` records memo's version in the
  store's health mark.

## 0.131.51 — 07.11.2026

### Fixed

- **WireCat Desktop can decide as you.** Desktop runs memo with no terminal, so memo refused every confirm, reject and
  forget from its Memory page with `decision.decider-unknown`. Every command that decides or writes as you now takes
  `--from-app`, which Desktop passes: the run is recorded as yours with no question. It is the app's word that you
  acted there, not a security check; it is not offered over MCP.
- **cli-base 0.82.0.** Its shared flag vocabulary knows `--from-app` and `--status`, so memo's command lint takes
  them from there: the three `--status` overrides on `tasks add`, `update` and `move` are gone, and the override
  budget is 13, down from 16.

## 0.131.50 — 07.11.2026

### Fixed

- **A note is dated by its file, not by the moment memo imported it.** `search all`'s `timestamp`, `search notes`'
  `updated_at`, `date:` and the order of notes about a person read the note's front matter `date` (a bare day is
  midnight where you are), else the file's modification time. An agent asked when "9 days from today" falls counted
  from the import day. The next `memo sync` dates the notes already stored, without reading or embedding them again
  (cli-core 0.604.0, `dateFileNotes`).

## 0.131.49 — 07.11.2026

### Added

- **`memo folders remove <id|path>`** stops reading a notes folder on this computer; its notes stay in the store.
  With `--allow-delete --yes` it also deletes the folder's notes and their text from the store; without `--yes` it
  says how many it would delete (`confirmation_required`). The files are never touched.
- **`memo sync --json` writes progress lines to stderr** while it reads a notes folder:
  `{"event":"progress","step":"notes","done","total","unit":"files","label":<folder id>}`, counts only, at most two a
  second, so an app can draw a bar.
- **`memo search all --json` says why it skipped a source.** Each entry of `meta.issues` carries `reason`, a dotted
  id such as `query.unknown-value` for `kind:nonsense`, as cli-core's `search all` does (cli-core 0.604.0).

### Changed — may break callers

- **A `?` that ends a word in a search is a question mark, not a wildcard.** `memo search all 'ready?'` and
  `'что с бюджетом?'` find "ready" and "бюджет"; before, `?` asked for one more character, so the word itself was
  missed. A `?` inside a word (`inv?ice`) is still one character (cli-core 0.604.0).

### Fixed

- **Any memo command, a read too, no longer starts or enables the sync timer.** After each command memo points the
  timer at the memo that just ran, and it rewrote the whole unit with the caller's PATH, then ran
  `systemctl --user enable --now`. A program with another PATH, like the WireCat app reading a status, so started a
  timer the owner had stopped by hand. Now memo changes only the program line, when the install moved, and reloads
  systemd without starting anything.

- **A search for text with a colon or another special character finds what holds it** (#674). `memo search all
  'meeting at 10:30'`, `'Answer as HH:MM'` and `'a:b'` read the word before the colon as a field, every source refused
  the query, and the answer was empty. `search all`, `search messages`, `search mail`, `search notes`,
  `search memories` and `meetings search` now read such a word as text, and the same for a URL, an unbalanced
  quote or bracket, `^`, `~`, `[]`, `{}` and `<>`. A lone emoji beside other words no longer empties the answer. Field
  queries (`content:invoice`, `from:`) and Boolean operators keep their meaning (cli-core 0.602.0).

- **cli-core 0.604.0.** In `search all`, a question's hit that both the words and the meaning found keeps the better
  of its two ranks (#2620).

## 0.131.48 — 07.11.2026

### Fixed

- **cli-core 0.602.0.** A search with a colon, a URL or other syntax characters in plain text is read as words
  (#2607), a recovery refuses while another runs and clears invalid JSON values (#2619), and `foldName` folds ё into е.

### Changed — may break callers

- **`memo schedule agent` and `memo schedule command` take `--deliver-to <route>`, no longer `--to <route>`**
  (cli-core 0.600.0, cli-base 0.80.8). `--to` names who a message is for in every CLI, so the route flag got its own
  name. `memo schedule list` names the routes `deliver_to`. A schedule saved with `--to` goes on delivering. memo's
  command lint now takes `--notify-on`, `--deliver-to`, `--max-cost-per-day`, the deal, lead and pipeline groups and
  `store recover` from the shared vocabulary: four overrides and four baseline entries are gone, and the override
  budget is 16, down from 20.

## 0.131.47 — 07.11.2026

### Added

- **`memo store recover`** says whether the shared store is damaged, what that means and what to run;
  **`memo store recover run`** rebuilds a damaged store from every row it can read and keeps the damaged file beside
  it. **`memo doctor --deep`** reads every page of the store; without it doctor checks the header and schema, and a
  damaged store is a problem with its fix (cli-core 0.599.0).

### Fixed

- **Opening the shared store twice in one memo process no longer drops the first connection's locks** (cli-core
  0.599.0). Another process could then delete the write-ahead log under a writer still using it, which can damage
  the store.

## 0.131.46 — 07.11.2026

### Changed — may break callers

- **The scheduled mail-triage agent starts with its skill and each mailbox's review on its stdin** (cli-core 0.597.0
  `agentInput`). It no longer spends model turns on `memo skill show` and `memo mail review`; on the real store a dry
  run took 5 turns and 0.04 USD instead of 11 turns and 0.08 USD. The skill tells it to stage a mailbox in one
  `memo mail findings add` call and what a `duplicates` answer means. Recreate the schedule with the prompt
  `Follow the input above.`; `memo skill show mail-triage` works as before.

## 0.131.45 — 06.11.2026

### Added

- **`memo schedule agent` and `memo schedule command` take `--notify-on always|failures|never` and `--to <route>`**
  (cli-core 0.592.0). `--notify-on` says when a run shows a desktop notice; `--to` also sends the result, when
  `--notify-on` says so, to `telegram-bot:<profile>/<chat>` or `email:<profile>/<address>`; repeat it for more.
- **`memo mail findings add` (and `--dry-run`) leaves out duplicates and stages the rest.** A finding whose order,
  invoice, payment, task or fact is stored, already waits in a proposed batch or came earlier in the same batch is not
  staged. The answer lists it in `duplicates` with `duplicate_of` (the reference that holds it, such as `order:7` or
  `<batch>/<finding>`) and reason `findings.duplicate`. Same means: order by shop and number or `source_url`; invoice
  by counterparty and number; payment by amount, currency, date and party; task by `external_id` or `source_url`; fact
  by its text and subject. A batch of only duplicates stages nothing (`staged: false`). A rejected record holds
  nothing.

### Fixed

- **`memo search messages` finds a short reply by a question about it.** A question typed as a sentence now searches
  as `memo search all` does: records holding some of its words, and a direct reply by the message it answers, so
  "let us leave it until summer" is found by "when will the price sync be done?". Plain words still must all be in
  the message. `search all` finds mail by meaning through the vector index (cli-core 0.593.0): 3.9 s instead of
  9.5 s warm, and far less on a cold disk, on a large mailbox.
- **`memo search all` names a source it skipped** instead of printing `undefined not searched`.

### Changed — may break callers

- **memo runs on cli-core 0.593.0.** `deal`, `lead` and `pipeline` answers use cli-core's shared entities, so
  `--json=<field>` is checked against them. `memo review agenda` asks cli-core which senders you have written to
  instead of reading the store with its own SQL.
- **`memo review agenda` lists owed mail only from senders you know.** A known sender is linked to a person with
  other identities, or an address you have written to before (any mailbox). Owed mail from other senders, mostly
  automated, is one line: how many, with a `next:` command that lists them. Owed messenger chats are unchanged. JSON
  `owed` gains `unknown: { count, next[] }` when any were counted, and its `total` counts the listed items only.

## 0.131.44 — 06.11.2026

### Changed — may break callers

- **memo runs on cli-core 0.590.0: `projects status` calls a money request found by words `asked`, not `open`.** The
  `amounts` signal (version 3) gives `state: "asked"` and `next` says `money asked`. A word match cannot tell a real
  request from a price you quoted, and "open" read as a debt.
- **An agent's `memo organizations add` and `memo organizations rename` write at once**, as the owner's do and as deals
  do. They no longer leave an `organization_add` or `organization_rename` proposal in `memo review`; only memo's
  `permissions` settings limit them. `--reason` and `--as-owner` are gone from both commands. Proposals already in a
  store stay listed and decidable in `memo review`.

### Fixed

- **`memo context person:<id> --source <account>` no longer rejects the account it suggests** when the person has
  several identities on that one account (the owner with two Telegram ids). The waiting proposals' `next` and text
  name `project:<key>`, not `project:project:<id>`.

### Added

- **`memo context` and `memo projects context` break the waiting proposals down by kind.** `proposals` (person) and
  `review.waiting` (project) carry `kinds` next to `count`, and the person's answer names `next`: `review list`.
- **`memo review agenda`: the morning digest in one read, no model call.** In a fixed order it lists everything new
  in what you tagged `watch` (chats, mail threads, people, projects, a meeting's series: `memo tags add watch …`),
  replies you owe in messengers and personal mail over the last 7 days, new personal mail, meetings that ended,
  tasks due or overdue, projects that moved and proposals waiting. Each item has its reference, who, when, one line
  of text and why; a section cut by `--limit` or `--max-output-bytes` counts what it left out and names the command
  that reads it. `coverage` says how fresh each account is. `--compact` is the agent's form.
- **The `morning-digest` skill** (`memo skill show morning-digest`) reads the agenda, follows only what it points at
  and reports as gaps what it found that the agenda missed. It is not scheduled for you.

## 0.131.43 — 06.11.2026

### Added

- **`memo search all` also finds deals and leads (cli-core 0.589.0)**, yours and every CRM account's copies, by the
  words of their title; `meta.accounts` names `crm:internal` among the accounts read.

### Changed — may break callers

- **`memo projects status` states money only from the books (cli-core 0.589.0).** `money` sums what confirmed open
  invoices still owe and never an amount found by words in messages, so a project with no confirmed invoices answers
  `money: []`. When the project or a child has a confirmed invoice or payment, `amounts` is left out: its word match
  also found your own quotes, product prices and deposits and called them open. Billed, paid and owed stay in
  `finance`. A project with no books still lists `amounts`, marked `basis: pattern`.

## 0.131.42 — 06.11.2026

### Added

- **`memo deals`, `memo leads` and `memo pipelines`: sales pipelines and what is in them (cli-core 0.588.0, store
  version 52).** `memo deals add <title> <stage> [amount] [currency]` and `memo leads add <title> [stage]` record one
  with `--organization`, `--person` and `--role` (owner, contact, decision-maker), `--due` and `--project`; `list`,
  `show`, `move <ref> <stage>` and `close <ref> won|lost [--reason]` follow. Memo starts with one lead pipeline,
  `Leads` (new, contacted, qualified, won, lost). `memo pipelines add <name> <stage...> [--kind lead]` makes one
  (stages named won or lost end a deal), `memo pipelines list` lists them, and `memo pipelines show <pipeline>` gives
  per stage the open rows, how many reached it and the conversion to the next, with won, lost and the win rate. A
  pipeline is named by `pipeline:<id>` or by a name only one has. An agent writes all of this as you do, at once; the
  `permissions` keys limit it over MCP. `memo projects status` lists up to five open deals of the project (`deals`).

## 0.131.41 — 06.11.2026

### Added

- **`memo invoices list number:<number>`** lists the invoice with that printed number, as `memo orders list
  number:` does for orders. Before, `number:` was refused as an unknown field.

### Changed — may break callers

- **Every mail finding needs `reason`, a fact, a memory and a new contact too.** The mail-triage skill said invoices
  and orders take none while the check refused them without one. `memo mail findings add --help` now lists each
  kind's fields from the check itself, and a missing one is refused by name (`finding.missing-field`).

### Fixed

- **A mail task with a due date stages.** The skill and `--help` show the form the check takes,
  `"due_at":"2026-11-09T09:00:00Z","due_evidence":["<ref>"]`, and each refusal names what is wrong.
- **`memo messages reset` to where the mark already is counts as a reset.** It says "mark unchanged … counted as a
  reset" and gives `resets`, and the next mail-triage run gets a new findings key instead of being refused.
- **`memo mail review --holder` gives no findings step when there is no new mail.**
- **`memo review status --json` has a real output schema.** `memo commands info review status` described a generic
  list; it now describes the answer: `item.mail[]` (account, threads, owed, waiting, the agents' marks),
  `item.proposed` and `item.waiting` (count, kinds, complete), `item.quiet`.
- **`memo schedule list` gives an agent schedule's cost caps, and its schema lists what it prints.** `max_cost_usd`
  (one run's cap, null when none) and `max_cost_per_day_usd` (the daily cap in force) join `spent_today_usd`, which
  the strict output schema refused before; the text says `today $0.84 of $5.00`.

## 0.131.40 — 06.11.2026

### Changed — may break callers

- **`memo projects status` has room under its size limits again (cli-core 0.583.0).** On the E7 fixture JSON
  goes from 3,998 to 3,644 bytes (limit 4,096) and `--compact` from 1,511 to 1,363 (limit 1,536). `item.window` is
  gone (read `meta.window`); a listed item leaves out `chat` when its `ref` is a message of that chat, `basis` when
  it is `store`, and a promise's `data.source`; `who.name` and a chat's `role` are left out instead of `null`. The
  `next_command` gaps are one `missing` entry, their reasons joined by `; `. Compact prints the days and zone once
  above the first section. The text form is unchanged.
- **Every mail finding needs `reason` (cli-core 0.583.0).** A `new_contact`, a `fact` or a `memory` without one is
  refused (`finding.missing-field`); the mail-triage skill says so. `memo mail review --holder` gives no
  `mail-findings.add` step when it gives no emails.
- **A `--compact` list in time order says each day once (cli-core 0.583.0).** When its days hold three rows on
  average, a `# YYYY-MM-DD` line opens each day and its rows print only `HH:MM`.

## 0.131.39 — 05.11.2026

### Added

- **`memo organizations rename <organization> <name>` renames an organization.** Run by you it renames at once. An
  agent's rename is a proposal (`status: proposed`): the organization keeps its name until you confirm it in
  `memo review`; `--reason` says why (cli-core 0.582.0).

### Fixed

- **`memo organizations list name:*acme*` works.** The help listed `name`, but the list failed on it. It ignores
  case in any script, and `*` stands for any text (cli-core 0.582.0).

## 0.131.38 — 05.11.2026

### Fixed

- **A scheduled mail-triage agent reads the whole skill again.** 0.131.37 grew `memo skill show mail-triage` to
  16.7 KB, and Claude Code saved that output to a file the scheduled agent may not read, so a run stopped at the
  first lines. The skill is back under 14.7 KB, and a test keeps it there.

## 0.131.37 — 05.11.2026

### Added

- **`memo mail findings add --key <key>`** stages the batch under the key `memo mail review --holder` gave in its
  `mail-findings.add` step; the JSON may leave `key` out, and a different one there is refused
  (`findings.key-mismatch`). The review now hands on that step before the acknowledge step.

### Fixed

- **A mail-triage run after `memo messages reset` stages its findings.** The key of a mark moved back ends in
  `-r<n>` (cli-core 0.581.0), so the run no longer reaches the key of a batch staged before the reset and still
  waiting (`mail-findings.key-used`), and its mark moves on.
- **The mail-triage skill gives the key, the fields and the list terms.** It passes `--key` from the review's step
  instead of building the key from the cursor, lists the fields each finding kind takes (`title` is a task's alone),
  and looks up invoices with `field:value` terms, such as `memo invoices list number:FACT-2026-00012`.

## 0.131.36 — 05.11.2026

### Added

- **`memo mail findings add --dry-run` checks a batch and stages nothing.** It makes every check staging makes,
  invoices, payments and orders tried and rolled back, and answers `valid` with `problems`: each refused finding's
  id, kind and message, and the batch's own (`mail-findings.key-used`). It runs under `MEMO_READ_ONLY`. The
  mail-triage skill builds the whole batch, checks it, fixes every problem and then stages it once.
- **Mail findings name a party the store does not hold yet.** An invoice takes `counterparty_name`, a payment
  `payer_name` and `payee_name`, an order `customer_name`, each with an optional `<party>_email` from the cited mail;
  your accept finds the organization or makes one (cli-core 0.580.0).

### Fixed

- **An unknown finding field is named**, with its finding's id and kind and the fields that kind takes.
- **An order is not proposed twice**: one already waiting in a proposed batch is refused (`order.proposed`), and the
  skill sends an `order_update` only when the stored order's status changed.
- **The mail-triage skill no longer shows a `|` inside a command** and says that each Bash call is one memo command
  with nothing before or after it, which is all `Bash(memo:*)` allows.

## 0.131.35 — 05.11.2026

### Added

- **`memo organizations show organization:<id>` prints one organization.** `organizations context` still adds its
  relationships, notes and tags. Together with `organizations list [query]` the owner finds the id that `memo records
  link <external> organization:<id>` needs without reading the store.

### Changed — may break callers

- **An agent's `memo organizations add` is a proposal, not an organization.** It answers the proposal (`status:
  proposed`) and the organization exists once you confirm it in `memo review`; `--reason` says why. Run by the
  owner it still writes directly, and `--as-owner` follows the same rule as the other writes (cli-core 0.579.0).

### Fixed

- **The lint baseline no longer lists `invoices`, `orders`, `payments`, `records` and `payments allocate`:** cli-base
  0.78.0 has the words.

## 0.131.34 — 05.11.2026

### Changed — may break callers

- **`memo projects status --json` fits in 4 KB again, and `--compact` in 1.5 KB (cli-core 0.578.0).** The
  `last_message`, `reply_next` and `coverage` lists are gone: each chat row carries `last`, `next`, `waiting_since`,
  `addressed`, `overdue` and, for a chat held in part, `held` and `sync_command`. Others' questions in a group with no
  role, and others' word-found promises in a group, are counted on the row as `unlisted` instead of listed. Items no
  longer carry a `title`; `finance` is left out when empty. "Your move since" counts from their first unanswered
  message. The text form is unchanged.

## 0.131.33 — 05.11.2026

### Added

- **A task keeps its id in an outside service and the page it is about.** `memo tasks add --external-id
  avito:4512345678 --source-url https://www.avito.ru/…`; `tasks show`, `tasks list` and `tasks add` answer
  `external_id` and `source_url`. The id is `<service>:<id>`, so ids of two services never collide; the page is an
  http or https address only (`task.external-id`, `task.source-url`). Mail findings take both on a `task` and
  `source_url` on an `order` (the order's page at the shop), and `memo review confirm` keeps them. Needs cli-core's
  store version 51.
- **`memo messages reset` moves the mail agent's mark back, for the owner only.** `--holder mail-triage --last 8` or
  `--since-time 2026-11-04T00:00:00Z`, with `--source email:<account>`; `--dry-run` only counts. The answer says how
  many emails the agent reads whole again, how many bulk ones come again as excerpts and how many are skipped again.
  An agent, a scheduled run and `MEMO_READ_ONLY` are refused, and MCP lists it as unavailable (`messages.reset` is
  `deny`, like the other owner operations).
- **The `mail-triage` skill turns marketplace messages into tasks.** An email saying a person wrote to the owner or
  asks him to call back (Avito, Cian, Yandex Go, auto.ru, hh.ru) is always a task "Reply on <platform> to <name>",
  one per counterpart per day, with `source_url` set to the conversation or listing link and `external_id` to the
  platform's id when the email shows one. Pure listing alerts and ads stay dropped. A new hard rule: copy every
  `msg:` ref whole, never shortened.

### Fixed

- **`memo mail findings add <path>` with no such file answers `not_found` (`findings.file-missing`)**, not
  `command.crashed`; `meetings actions add` and `projects actions add` too. A path that is a folder is a
  `validation_error`.
- **The mail page names the example profile `personal`, not `ya`**, as the mail CLI's own docs do. No behaviour
  changes.

## 0.131.32 — 05.11.2026

### Fixed

- **The scheduled mail-triage agent can stage its findings again.** Claude Code refused its
  `memo mail findings add - … <<'JSON'` call in `dontAsk` mode once the JSON held real mail text. `mail findings add`,
  `meetings actions add` and `projects actions add` now also take the findings JSON itself as the argument: one
  that starts with `{` is the JSON, `-` is stdin and anything else a file, as before; the 65536-byte limit is the same.
  The `mail-triage` skill passes the JSON as one single-quoted argument and writes an apostrophe inside it as ’.

## 0.131.31 — 05.11.2026

### Added

- **The mail-triage agent sees orders, invoices and site lead forms that carry an unsubscribe link.**
  `memo mail review --holder` left out every email sent to many; now only surely-newsletters stay out, counted under
  `missing`, and the rest comes after the other mail as its subject and first lines (`email.excerpt_only`). The
  agent reads one whole with `memo messages show <ref> --trimmed` when it looks like an order, an invoice or a
  request; the `mail-triage` skill says how. The config file gets the settings, with their defaults:
  `mail_bulk_excerpts`, `mail_bulk_excerpts_per_read`, `mail_bulk_excerpt_chars`, `mail_bulk_newsletter_score`,
  `mail_bulk_newsletter_words`, `mail_bulk_newsletter_senders`, `mail_bulk_order_words`. The `--on-new-mail`
  schedule counts these excerpts as waiting mail.

## 0.131.30 — 05.11.2026

### Added

- **`memo orders list|show|add`.** An order says for whom (you, or `--person`/`--organization`) and why
  (`--kind personal|business|client|other`), the shop, its number (`--title`), amount and currency, and its status
  (`placed`, `shipped`, `delivered`, `cancelled`, `returned`; a later mail moves it on). Yours is confirmed at once;
  an agent's waits in `memo review` (`kind:order`). `orders list number:<n> supplier:<shop>` finds one shop's order.
- **Mail findings carry invoices, payments and orders.** `memo mail findings add` takes the kinds `invoice`,
  `payment`, `order` and `order_update` (a later mail's status for a stored order). Accepting one records it as yours,
  citing the mail.

### Fixed

- **The mail-triage agent keeps invoices, receipts, orders, deliveries and account or certificate data.** Its skill
  turns them into findings (certificate and account data as facts) and drops only ads, news and pure social
  notifications. It runs one memo command per call.

## 0.131.29 — 05.11.2026

### Changed — may break callers

- **memo runs on cli-core 0.573.0.**

### Added

- **`memo payments unlink <payment> <invoice>` takes back what a payment settles of an invoice**, so a payment split
  wrongly across invoices is set right: unlink, then `payments allocate` the right amounts. You correct a confirmed
  payment's split too; an agent's run is refused there, and an agent unlinks only a still-proposed payment it proposed.

## 0.131.28 — 05.11.2026

### Changed — may break callers

- **memo runs on cli-core 0.572.0.** `memo commands --json` gives every command its permission `level` and key under
  a named profile, not only the denied ones.
- **The skill an agent reads every session is 3 KB, not 22 KB.** It opens with how to answer a question (`memo search
  all '<key words>' --limit 10 --compact`, search again in other words, cite each reference) and the rules every
  agent keeps. The rest is unchanged and printed on request: `memo skill show search`, `projects`, `meetings`,
  `mail`, `proposals`, `money`, `mcp` or `vocabulary`. On the 50-question benchmark this was most of what an agent
  paid for using memo.

### Added

- **`memo facts revoke <ref>`** takes back your approval of a fact an agent proposed, of any kind: it waits as
  proposed again, for `memo review` or `facts confirm`. Only you can run it, as with `facts reverse`; an agent is
  refused. It refuses a fact that is not accepted, a fact you wrote yourself (correct it with `facts add --supersedes`
  or remove it), and an accepted correction, because the fact it replaced cannot be put back as it was. The fact keeps
  a note of the approval it took back. `--json` prints the fact.

## 0.131.27 — 05.11.2026

### Fixed

- **memo runs on cli-core 0.571.0: an imported payment split across invoices settles each by its own amount.**
  `memo records import` reads an optional `amount` on a `settles` relation, refuses amounts that add up to more than
  the payment (`record.over-payment`), and no longer lets one import cover an invoice twice. A changed import updates
  the split of a payment the owner has not decided yet.

## 0.131.26 — 05.11.2026

### Changed — may break callers

- **memo runs on cli-core 0.569.0.**
- **The mail-triage schedule waits for a batch of mail and stops for the day at a cost cap.** `memo schedule agent
  --on-new-mail` starts the agent once 10 emails wait or the oldest has waited 30 minutes, and no run starts for the
  rest of the day once the day's runs cost 5 US dollars. Change them per schedule with `--mail-wait`, `--mail-batch`
  and `--max-cost-per-day`, or for every schedule with `schedule_mail_wait`, `schedule_mail_batch` and
  `schedule_max_cost_per_day` in the config file; `memo config migrate` writes them. `memo schedule list` shows the
  day's spend and why a run was skipped.
- **An agent schedule runs on Sonnet and starts lean.** `memo schedule agent` takes `--model <model>`; without it a
  claude schedule runs on `sonnet` and a codex one on codex's own default. A new claude schedule starts without your
  MCP servers, skills, settings and CLAUDE.md. `schedule_model_claude`, `schedule_model_codex` and
  `schedule_lean_start` in the config file change that for every new schedule; `memo config show` lists them.
- **`memo messages acknowledge` moves only the mark of the holder a scheduled run was started for.** An agent's run,
  or one under `MEMO_READ_ONLY`, without `--on-new-mail` is refused; you move any. A cursor past the newest stored
  email is refused.

### Fixed

- **`memo actions confirm` and `reject` honour `--fingerprint` for a mail findings batch.** Confirm ignored it, and
  reject refused it as not a findings batch. A fingerprint other than the batch's is refused as stale.
- **`memo mail review`, `messages acknowledge` and `mail findings` name a missing or ambiguous mailbox** the way every
  other one-account option does.

### Security

- **The mail-triage agent reads each email's own text in the thread and the sender's earlier mail too.** `memo
  messages show --trimmed` and `memo context --trimmed` leave out quoted earlier mail and the signature, as `memo mail
  review --holder` does; the skill passes `--trimmed`. Fingerprints still cover the stored email, and the owner's
  reads (`messages show`, `context`, `review show`) keep the whole text. `--trimmed` is refused with `--full`.
- **The mail-triage skill puts no sender text into a shell line unchecked.** A name or address goes in single quotes,
  and only when it holds letters, digits, spaces and `. _ + - @`; new senders are looked up only for emails kept by
  triage with `new_sender: true`, not for every sender seen once.

## 0.131.25 — 05.11.2026

### Changed — may break callers

- **A write on a task that changed since you read it fails with `conflict`, exit 15.** It was
  `configuration_error`, exit 3. The reason is still `task.stale`, with the task's current `revision` in `details`.
- **memo runs on cli-base 0.77.1 and cli-core 0.567.0.** A failure can now be `conflict` (exit 15): a write refused
  because what it would change moved on since you read it; read it again and decide on the new copy. The MCP tools'
  error codes list it.
- **memo no longer imports mail: the [mail](https://github.com/WireCatLabs/mail-cli) CLI does.** For each mailbox
  memo used to import, run `mail <profile> session start --address <address>`, then `mail <profile> sync`; the mail
  already in the store stays and is still found, and the sync goes on from it. `memo doctor` names the addresses your
  config listed. The Himalaya import, `bin/mail-password` and the Google Takeout (`mode: "mbox"`) import are gone;
  a Takeout file is `mail <profile> messages import <file.mbox>`.
- **`memo mail add`, `memo mail check` and `memo mail inspect` moved to the mail CLI**: `mail <profile> session
  start`, `mail <profile> account check` and `mail <profile> account inspect`. The old paths change nothing and name
  the new command (`mail.moved-to-mail-cli`). Sender scoring with domain ages now runs in `mail <profile> sync`.
- **`memo sync` and its timer read notes only, and embed the mail already stored for search by meaning.** Its mail
  options `--source`, `--since-time`, `--limit`, `--retry-attachments` and `--rescan` are gone; `--only mail` now
  only embeds stored mail. Its answer has `mailEmbedded` in place of `mail`.
- **The config's `mail` section is retired.** An old config with `mail.accounts`, `"import": false` or the mail
  limits still loads and nothing reads it; `memo doctor` reports it and `memo config unset mail` removes it, and
  `memo sync` says so on stderr until then. `config migrate` no longer writes the mail limits.
- **`--source email:<name>` takes the mailbox's address only**, since names lived in `mail.accounts`. `memo doctor`
  no longer reports mail accounts or Himalaya; the error reasons `mail.throttled` and `mail.invalid-imap` are gone.

## 0.131.24 — 05.11.2026

### Changed — may break callers

- **`memo search all` finds records for a question typed as a sentence** (cli-core 0.564.0). A question in plain
  language, without `--exact`, finds messages, mail, notes and events that hold some of its words, where before every
  word had to be in one record and a question found nothing. Mail is searched by meaning too once its threads have
  vectors, and hits from different sources at the same rank are ordered by how close their meaning is to the
  question. Plain words, query syntax and `--exact` are searched strictly, as before.

### Added

- **`memo stats tasks show` counts by chat, meeting or project over a period** (cli-core 0.564.0). It takes a query
  (`created>=30d`), `--by chat|meeting|project` and `--timezone`, and answers what is open now, what was opened and
  closed in the period, the median time to close and the mean age of the open tasks.

### Security

- **`memo mail review --holder` gives each email's own text**, without quoted earlier mail or the signature
  (cli-core 0.564.0), so an agent reading the queue does not read earlier mail as if it were new.

## 0.131.23 — 05.11.2026

### Added

- **`memo config show` lists every setting with its value, its default and whether the file sets it, and `memo config
  migrate` writes the missing ones into the file at their defaults.** You then find and edit every setting in
  `config.json`, `"agent_decisions": false` included, without the docs. Your values, their order and keys memo does
  not know stay. Every write memo already makes to the file (`folders add`, `mail add`, `jobs start`, mail rules) adds
  the missing settings too; a plain read never rewrites the file.

### Fixed

- **`memo mail review` names memo's own commands in its next steps**: `memo messages acknowledge … --source
  email:<account>`, so an agent runs the step as given. It offers no whole-thread read, which memo does not mount.

### Changed — may break callers

- **Only you decide meeting and mail findings, on every path, whatever `agent_decisions` and `permissions` say**
  (cli-core 0.563.0). An agent's `meetings actions confirm` or `reject`, `review confirm` or `actions confirm` of a
  batch is refused with `proposal.owner-only`, its own batch included.
- **`memo tasks update <task> --project <key>` moves the task's subtasks with it** instead of refusing; each takes a
  new key there and the old keys still find them (cli-core 0.563.0). A subtask still moves alone only with
  `--parent none`.

## 0.131.22 — 03.11.2026

### Added

- **`memo relationships scan <project|all> --source <accounts|all>`** lists the chats, mail threads and people that
  look like a project's, scored from the store by cli-core's link scorers (the name and aliases in chat titles and
  messages, confirmed members' groups, dialogs and threads, who writes in its confirmed chats). It writes nothing;
  `--yes` writes them as proposals by the rule bot `memo-scan`, which only you decide in `memo review`. A pair you
  rejected is never proposed again. `meta.accounts` names the accounts read.
- **`memo projects context` and `memo projects evidence` name the scan as a next step** while the project has fewer
  than two confirmed chats.

### Changed — may break callers

- **`memo relationships scan` writes nothing without `--yes`**, and `--source` is required (`all` reads every
  account). With no project it still proposes people who share a company mail domain, now as proposals in
  `memo review` instead of unconfirmed relationships, and the answer is `{ written, scans }`, not a list.

## 0.131.21 — 03.11.2026

### Added

- **`wcat memo` runs memo, and `wcat --help` lists it.** The package installs `wcat-memo` beside `memo`, and
  `wcat-memo --wcat-describe` prints the tool's name, version and description for `wcat`. `memo` keeps working.
- **An agent can read new mail and propose what it asks of you.** `memo schedule agent mail-triage claude 'Run memo
  skill show mail-triage and follow it.' --every 5m --on-new-mail mail-triage --max-cost 1` starts the agent only
  when a sync stored mail past its mark. It stages cited tasks, closes and updates of open tasks, facts, memories,
  links and new contacts for `memo review`; it never sends, changes mail or decides. `memo skill show mail-triage`
  is its prompt.
- **`memo mail review`**: cli-core's mail review over one mailbox (`--source email:<account>`): new threads,
  `--unanswered`, `--waiting`, and `--holder <name>` for what is stored past that holder's mark.
- **`memo messages acknowledge --holder <name> --cursor <cursor>`** moves a holder's mark after it processed what
  review gave.
- **`memo mail findings add|show|list`**: stage one mailbox's cited findings; only the owner confirms them in
  `memo review`. `add` and `messages acknowledge` are the only writes `MEMO_READ_ONLY` allows.
- **`memo messages show` gives an email's `fingerprint`**, the one a finding cites it by.

### Changed — may break callers

- **Agents no longer decide for you by default.** An agent's confirm or reject of a fact, a memory, an action, a link
  or a project proposal is now refused with `proposals.agent-decisions-off` unless your config says
  `"agent_decisions": true`; before, a missing key let an agent decide with `--reason`. To restore the old behaviour,
  add `"agent_decisions": true` to memo's `config.json`. Meeting findings keep their
  own permissions.

### Fixed

- **`memo actions confirm` on a mail findings batch** goes through the owner-only review: an agent's confirm is
  refused instead of turning the batch into a task.
- **Built on cli-core 0.560.0** (the propose tier, mail findings, the new-mail gate; agents no longer decide for the
  owner by default).

## 0.131.20 — 02.11.2026

### Added

- **`memo records list --account <provider>:<account>`** lists a source's records; `waiting:true` shows those whose
  invoice or payment waits for a party, `flagged:true` those changed at the source after their entry was made.
- **`memo records link <type>:<external_id> <ref> --account <provider>:<account>`** says which of your entries a
  source's record is (`organization:client` is `organization:3`). Never by name. Only you link; an agent is refused,
  and MCP does not offer it. The invoices and payments that waited for it become proposals in `memo review`.
- **`memo records import` and `check` take `--account <provider>:<account>`** too, as `list` and `link` do; the
  account alone still works.

## 0.131.19 — 02.11.2026

### Added

- **`memo records import <file|-> --account <account> [--dry-run]`** brings a source's records into the store from a
  v1 records envelope, as JSON or JSONL (a header line, then a record per line), and prints the receipt: created,
  updated, unchanged, deleted, refused, the proposals made, what waits for a mapping, and each error with its JSON
  pointer and code. The same file twice changes nothing and a lower revision is refused. An invoice or a payment
  becomes a proposal for `memo review`: an import never writes confirmed money.
- **`memo records check`** gives the same receipt and writes nothing. It is a read, so MCP offers it without the
  owner's permission; `records import` is a write and needs it.

### Fixed

- **Built on cli-core 0.559.0** (store version 47: source records and the import envelope).

## 0.131.18 — 02.11.2026

### Added

- **`memo review` shows everything that waits for you in one list**: besides facts, memories, links, key documents,
  project findings and actions, it now lists meeting findings, task close suggestions (`close:<task key>`) and the
  coming mail findings, grouped by the project or account they came from, newest first, each batch with its
  findings under it. Each row says `source` and `owner_only`. `memo review confirm 17080/f1` accepts those findings
  of the batch and rejects the rest; `memo review confirm close:Q-15` closes the task as suggested, `reject`
  clears the suggestion.
- **`memo review status`**: since yesterday (`--since-time`), per mail account the threads with new mail, the
  threads you owe an answer and wait for, and how far each agent's processing mark has read; then what was proposed
  and what waits, by kind. With nothing to say it says so. No model call.
- **`memo review show`** marks every evidence item `untrusted`, and for an email gives the `sender`: its address,
  score and signals, and whether the address is `known` (its person has another identity).
- **`memo schedule command|agent|list|run|remove`** runs a memo command or an agent on a timer (cli-core's shared
  schedule): `memo schedule command digest --at 08:30 -- review status`. An agent is allowed only `memo`, under
  `MEMO_READ_ONLY`. Not offered over MCP.
- **`memo context <person>` and `memo projects context <project>` count the proposals waiting** about them.
- **`invoices list|show|add` and `payments list|show|add|allocate`** manage money as typed rows (cli-core's finance
  tables). Amounts are decimal strings and totals stay per currency, never converted. Your own `add` is confirmed at
  once; an agent's, or one with nobody at the terminal, waits as a proposal. `payments allocate <payment> <invoice>
  <amount>` settles part of an invoice and is refused beyond the payment or the invoice.
- **`memo review` lists and decides invoice and payment proposals** (`kind:invoice,payment`); only you confirm money.
- **`projects status` adds `finance`**: billed, paid and owed per direction and currency from the project's confirmed
  invoices and payments, with their refs, beside the amounts found in chats.
- **`invoices add` and `payments add` take `--evidence`**, up to 8 references the row was read from.

### Changed — may break callers

- Meeting findings, task close suggestions and mail findings are the owner's to decide: `memo review confirm` and
  `reject` refuse an agent on them, with or without `--reason`. Mail findings cannot be decided by this build yet
  (`proposal.kind-unsupported`); they are listed so nothing turns them into tasks by mistake.

### Fixed

- **Built on cli-core 0.558.0** (store version 46). Money is no longer a fact: `facts add --kind payment` is gone, and
  a confirmed payment finding writes a `payment:` row (paid), an `invoice:` (expected; it needs a `person:` or
  `organization:` counterparty) or voids the invoice it supersedes (cancelled). A payment finding's `supersedes`
  names an `invoice:`, and `paid_at` dates a paid one. `projects status` lists payments and open invoices with
  status `confirmed` (was `accepted`); a proposed invoice does not count as owed. 0.556.0 added per-reader
  processing marks for mail (`mail review --holder`); memo shows them in `review status`.

## 0.131.17 — 02.11.2026

### Fixed

- **`tasks agenda --source email:<address>` lists mail threads you owe an answer and wait for one.** `owed`,
  `waiting` and `stale` were empty for mail; now a thread is owed when its newest email came to you in To or Cc and
  you have not answered, waiting when you wrote last (cli-core 0.555.0). Scheduled runs keep their own `--new` points.

## 0.131.16 — 02.11.2026

### Added

- **`relationships update <id> --role --purpose`** sets a relationship's role, or what a chat is for in a project.
  Yours applies at once; an agent's waits for you in `memo review`. `projects evidence` names this command when one
  chat with no purpose fills most of a run.
- **`projects evidence --purpose` and `projects status --purpose`** read the linked chats of the purposes asked:
  `work`, `sales`, `support`, `other`, or `all`. A chat left out is one `missing` row with its message count and the
  command that reads it. **`projects evidence --include-proposed`** also reads chats and members proposed for the
  project, after the confirmed ones, each marked `proposed`.
- **`--reason` on every decide command**: `facts confirm`, `reject`, `reverse` and `remove`, `memories confirm`,
  `invalidate` and `remove`, `relationships confirm` and `remove`, `actions reject` for any action. An agent
  decides only with one. `--as-owner` on these and on `projects key-documents remove` and `meetings actions`.
- **`memo review`**: every pending proposal across projects in one list (relationships, key documents, facts,
  memories, findings batches, actions), each with a readable title, who proposed it, the reason, score, signals and
  evidence. Filters `project:`, `kind:`, `by:` (`agent`, `rule` or a bot), `status:`; `--compact` prints one line each.
- **`memo review show <id>`**, **`review confirm <ids>`** and **`review reject <ids> --reason`**: ids and ranges such
  as `17070-17079,fact:500-502,17080/f1`. Each id is decided on its own; a refusal is listed, the others stay
  decided, and the exit code is not 0. Over MCP they are owner permissions `review.confirm` and `review.reject`.
- **`relationships list confirmed:false`** lists the relationships waiting for you, as `review kind:relationship`
  does; `confirmed:true` lists links only. Every row has `from_title` and `to_title`, and the text shows the purpose.
- **`projects status <project>`: where a project stands, from the store.** It reads every chat linked to the
  project and its child projects, in every account those links name (`meta.accounts`), and says per chat who wrote
  last, whose move it is, open questions, promises, and amounts with their direction. `--context-query`,
  `--since-time`, `--before-time`, `--compact`, `--sync-profile`. Cited refs carry a title. `next` names at most two
  chats to read, with the tg or max command, and never picks a profile for you. Over MCP too.
- **A `project-state` guide scenario** (`memo guide project-state`): context, status, read the chats it names with
  `--compact`, stage what you confirmed. The skill says the same.
- **`memo show <ref...>`** tells what 1 to 100 references name, in the order given: title, kind, where it is,
  state and the command that opens it (`open.argv`, `open.line`). It never picks a profile: with none or several
  signed in, the command keeps `<profile>` and `open.profiles` lists the choices. Also an MCP tool.
- **`--compact`** prints one line per item, reference first and text last, with paging, missing data and next steps
  as `#` lines. memo declares rows for search hits, notes, facts, memories, people, organizations, projects,
  relationships, tasks, messages and `projects evidence`. Refused with `--json` or `--brief`; MCP stays JSON.

### Changed — may break callers

- **`projects evidence` and `projects status` read only `work` chats unless `--purpose` asks for more.** A linked
  chat with no purpose counts as `work`; one linked for `sales`, `support` or `other` is counted, not read.
- **Built on `@wirecat/cli-core` 0.553.0 and `@wirecat/cli-base` 0.75.0.** Store version 44 moves an agent's or a
  rule's unconfirmed link into a proposal on first open; `relationships list` no longer shows those.
- **An agent's `relationships add` answers a `relationship` proposal**, not an unconfirmed relationship.
- **A run with no agent named and no terminal is not the owner**: its writes are proposals of the bot
  `unattended`, and its decisions refuse with `confirmation_required` (`decision.decider-unknown`, exit 7).
- **`--as-owner` in an agent's terminal asks y/N at the terminal**; without one, or under `--json`, it refuses
  with `confirmation_required` (`decision.owner-unconfirmed`, exit 7). Over MCP it is refused.
- **`projects.agent-decisions-off` is now cli-core's `proposals.agent-decisions-off`**, and covers every decision.
- **Words after `--` stay text** in `notes add`, `notes edit`, `facts add`, `memories add`, `tasks comments add`,
  `people add`, `organizations add`, `projects add` and `answers create`.
- **An agent's `projects key-documents add` writes a `key_document` proposal**, decided in `memo review`; its `id` is
  the proposal's. `projects actions list` and `projects context` list these, and `projects actions confirm` takes
  the proposal number as well as `key:<id>`.
- **Old decide commands go through the review's check**: `facts confirm` and `reject`, `memories confirm` and
  `invalidate` on a proposed memory, `relationships confirm` and `remove` on a suggestion, `actions confirm` and
  `reject`, `projects actions confirm` and `reject`. A decided proposal now refuses with `proposal.wrong-state`.
- **A bare number is refused where several kinds fit**: `notes show|edit|remove`, `projects key-documents
  add|remove`, `tasks add <source>` and `show` answer `"1473" is a bare number; did you mean note:1473?`
  (`ref.bare-number`), naming only references that exist. A file named `1473` is read as `./1473`.
- **`notes add`, `notes edit` and `notes remove` print the note's reference** (`note:12`), not its bare id.
- **Text without `--json` is drawn by cli-core's generic row** where a command has no view of its own: `·` between
  columns, `# more: raise --limit` for more.
- **The sync command memo prints and runs puts no `--` before a chat id**: a negative group id needs none.

### Security

- **An agent can no longer decide its own proposal through memo.** Every confirm, reject and remove
  path, CLI and MCP, passes the real decider to cli-core, which refuses an agent's own bot's proposal
  (`proposal.own`), a rule's or an unconfirmed link's (`proposal.owner-only`), one without `--reason`
  (`proposal.reason-required`), and every agent decision when `agent_decisions` is `false`. Before, an agent over
  MCP could confirm a fact, memory, relationship or action it had proposed itself.
- **A missing agent variable no longer proves the owner.** The owner decides only at a terminal (stdin and stdout),
  or with `--as-owner` after a y/N answer there; a saved meetings permission lets an MCP agent decide as itself.

## 0.131.15 — 02.11.2026

### Added

- **`messages show` gives each email a `ref`**, as it does each messenger message and as search hits do, so a
  caller can match the emails of a thread to the hit it opened.

## 0.131.14 — 01.11.2026

### Added

- **Actions carry the parts of their line**, so a reader can write it in its own language: `verb` (the kind, or
  `create` for a findings batch), `target_name` (a project, person, task or the chat of a message, by name),
  `chat_name` (for a message or chat target), `text` (the whole reply or title, never cut) and, for a findings
  batch, `counts: { facts, tasks }`. `summary` now names the target instead of printing its reference.
- **`tasks list parent:<key>`** lists a task's subtasks; `parent:none` and `parent:any`.

### Fixed

- **A findings batch can be confirmed after another batch of the same project was decided**; only a change in its
  own cited sources refuses it.

### Changed — may break callers

- **`tasks update <key> --project <key>` refuses a subtask** (`task.is-subtask`, details `parent`) unless
  `--parent none` detaches it in the same command. It used to drop the parent without saying so.

## 0.131.13 — 01.11.2026

### Fixed

- **Built on cli-core 0.535.0.** Message search hits now list `attachments.name` among their untrusted fields. The
  security page says memo never changes a mailbox.

## 0.131.12 — 01.11.2026

### Removed

- **Mail rules, Gmail cleanup and restore moved to the `mail` CLI; memo no longer changes a mailbox.** The old
  commands stay, hidden from help, `memo commands` and MCP, only to answer `validation_error` with reason
  `mail.moved-to-mail-cli`, the new command in the message and in `details.alternative`. They change nothing.
  `<profile>` is the `mail` profile that holds the address; `mail session status` lists them.

  | Old | Run instead |
  |---|---|
  | `memo mail delete <account>` | `mail <profile> messages delete --rules` (a preview; `--yes` moves the mail) |
  | `memo mail restore <account> --run <id>` | `mail <profile> messages restore --run <id>`; memo's run ids work there |
  | `memo mail runs list <account>` | `mail doctor` (the runs that stopped part way or whose Gmail Trash empties soon); every run is a file `<id>.jsonl` in memo's state folder under `mail-trash/<profile>/` |
  | `memo mail rules list\|add\|remove\|apply\|export\|import <account> …` | `mail <profile> rules <same verb> …`, same options, no account |

  The MCP tools for these commands go with them. `memo sync` still reads each account's rules from the store, and
  `memo mail inspect` stays.
- **`memo doctor` no longer reports Gmail cleanup** (`mail.cleanup` in `--json`: store backup, Takeout, cleanup runs
  and their restore deadlines); cleanup is the `mail` CLI's now.

## 0.131.11 — 01.11.2026

### Added

- **`tasks update <id> --project <key>`** moves a project task to another project. It takes the next key there
  and the answer gives the new `key`, `id` and `ref`; the old key still finds the task.
  A subtask leaves its parent; a task with subtasks is refused (`task.has-subtasks`).
- **`tasks update <id> --type bug|feature|chore`** changes a project task's kind.
- **Tasks say who added them**: `created_by` (`{ type, id, name, owner }`) on `tasks add`, `list`, `show` and every
  task answer. A task added over MCP or from an agent's terminal is the agent's, also when it comes from a message
  or note; memo recorded the owner there.
- **Task comments**: `tasks comments add <id> <text...>` comments in the owner's or the agent's name, over MCP too;
  `tasks comments list <id>` lists `ref`, `text`, `author` and `at`, oldest first.
- **`due:tomorrow`** in task queries, and in any other time field.

## 0.131.10 — 01.11.2026

### Fixed

- **Built on cli-base 0.71.0**, which cli-core 0.529.0 needs (its peer range is `>=0.71.0 <0.72.0`).

## 0.131.9 — 01.11.2026

### Added

- **`people add <name...>`** adds a person by name, to assign a task to before any message names them.
  `people list` lists everyone memo knows, the owner first, then by how many tasks name them, with `--limit`
  (default 500); it listed only the owner and people with a task role.
- **`tasks add --due <time> --status <state> --agent <name>`** sets them on a project task in one write.
  `tasks update --description none` clears the description. `--priority` takes a score from `0.0` to `1.0` with its
  decimal point; a bare `0` … `4` keeps the old scale.
- **`when:` in the tasks query**: `when:overdue`, `when:today`, `when:upcoming` (the 7 days after today),
  `when:later`, `when:none`. `tasks counts` counts them in `due` and counts `agent`, and each `project` count carries
  `ref`; list items carry `project_key` and `project_name`, so the list and the counts name a project alike.
- **Findings about anyone**: a fact finding in `projects actions add` may name a `subject` (`person:`,
  `organization:`, `task:` or `project:`) and no project, and cite a `note:`; a task finding still names its project.
  `notes show` gives the `fingerprint` to cite a note with. `actions show` and `list` carry `subject` and
  `subject_name` for a findings batch.
- **`actions confirm <id> [findings...] --fingerprint <hash>`** and **`actions reject <id> --fingerprint <hash>`**
  decide a findings batch by its id, with no project. Confirm with no finding IDs creates every finding. An agent
  decides for the owner only with `--reason`, as in `projects actions`. Facts the owner keeps are accepted at once.

### Fixed

- **`tasks list overdue:true` no longer matches a task due later today**: it is open work due before today.
- **`tasks history` gives due dates as ISO**, as `tasks list` does, not epoch milliseconds.

## 0.131.8 — 01.11.2026

### Fixed

- **Mail ids and threads come from cli-core's `mailIds`, the function mail uses**, so memo and mail give one email one
  id on every server. Ids already stored do not change; a reply whose In-Reply-To holds a name before the `<id>` now
  joins its parent's thread, as in mail.
- **memo says when it leaves stored mail rules out**: a rule with a condition this memo does not know is named on
  stderr with what it does not know, instead of being dropped silently.
- **Rules are written by cli-core's `ruleInput`**, the one mail writes them with; memo's copy is gone.
- On cli-core 0.526.0, the version mail pins too.

## 0.131.7 — 01.11.2026

### Added

- **A memory can belong to a project**: `memories add --project <key>`, `memories list project:<key>`, and
  `memories update <ref> --project <key>` (`none` takes it out). Memories carry `project` and `project_name`; facts
  carry `project_name` beside `project`.
- **`actions list` and `actions show` say what each action would do**, in `summary` ("Create 1 fact and 1 task in
  Synthetic Port", "Reply Synthetic Port: Friday works"), and name its project in `project` and `project_name`.
- **A findings batch in `actions list` and `actions show` carries its `fingerprint`**, which `projects actions
  confirm` and `reject` need, and each cited source read back in `sources` (`kind`, `title`, `sender`, `at`, an
  `excerpt` of at most 280 characters, `tool`, `missing`). `actions list --brief` leaves the sources out.

### Fixed

- **A findings batch rejected as a whole reads as `rejected`** in `actions list` and `actions show`, not `approved`,
  and `actions list status:rejected` finds it.

## 0.131.6 — 01.11.2026

### Fixed

- **memo opens a store moved to schema 43** by mail 0.4.0 and other CLIs on cli-core 0.520.0; 0.131.5 refused it and
  asked for an upgrade. `memo search mail` and `messages show` now run on the same code as mail's own search, with the
  same answers.

## 0.131.5 — 01.11.2026

### Added

- **`"import": false` on a `mail.accounts` entry hands its import to the `mail` CLI.** `memo sync` and the timer skip
  the account, `memo sync --source email:<name>` says the import is handed to `mail` (`meta.handed_to_mail` in
  `--json`), and `memo mail inspect`, `rules`, `delete` and `restore` keep working on it. Memo still repairs HTML
  text, scores senders and embeds the mail in the store for it; only the Himalaya header backfill stops.

## 0.131.4 — 01.11.2026

### Changed — may break callers

- **A task's `revision` goes up only for a change a person could overwrite** (cli-core 0.516.0, store version 42):
  title, description, state, priority, assignees, agent, due date, project, parent or tags. An agent's claim, its
  renewal and release, and `--remind-time` leave it as it is, so a board no longer says "changed elsewhere" while an
  agent works.
- **`tasks move <id> --before|--after <other>` beside a task in another column moves it into that column.** A
  `--status` that names another column than the neighbour's is refused with reason `task.column`
  (`HRB-2 is in in_progress, not todo: pick a task in the todo column`).

### Fixed

- **`tasks update --priority none` clears the priority** instead of failing with "a priority score is 0 to 1".

## 0.131.3 — 01.11.2026

### Added

- **`projects evidence --sync-profile <tool>=<profile>`** names the messenger profile `--sync-first` syncs as when
  several are signed in to a chat's account (`--sync-profile max=default`; repeat for another tool). The profile must
  be signed in to that chat's account, or the chat is not synced and the answer says why.
- **`projects evidence --json` carries each linked chat's `sync_command`**: the exact `tg`, `max` or `wa` line that
  syncs a chat held in part back to `--since-time`, or `null` when it needs no sync or no profile can be chosen here;
  then a `missing` entry with field `sync_command` says why.

### Fixed

- **`projects evidence` exits 0 on a partial answer.** A chat held in part made it exit 1 with nothing on stderr;
  `meta.complete: false`, `missing` and `next` now say what is missing, as in the searches.
- **`projects evidence --sync-first` says when several profiles are signed in to a chat's account**, and names them,
  instead of "no profile is signed in".
- **`--sync-first` no longer passes the messenger CLI's JSON progress lines through**; its sentence for the same
  progress is kept.

### Removed

- **`memo mail status` is removed.** It counted only the Himalaya import, while `mail <profile> status` counts the
  mailboxes the `mail` CLI syncs, so two status commands gave two different numbers. Use `mail <profile> status`
  for a mailbox synced by `mail`; the Himalaya import has no status command until a better one, covering both,
  comes later. The MCP tool `mail status` goes with it.

## 0.131.2 — 01.11.2026

### Added

- **У задач проекта пять состояний: `open`, `todo`, `in_progress`, `done`, `dismissed`** (страница Tasks в WireCat Desktop, cli-core 0.513.0). `tasks update --status` переводит задачу проекта в любое из них, в том числе обратно из `done` или `dismissed`, и каждый переход сохраняется в истории задачи. `todo` и `in_progress` считаются открытой работой для готовности, захватов и списка по умолчанию.
- **`tasks list` с `project:` принимает полный запрос**: `project:*` для всех проектов, проект по имени или псевдониму, `assignee:`, `priority:` (метки, `none`, диапазоны), `agent:`, `due:` и `closed:` с диапазонами, `overdue:`, OR внутри поля, NOT и обычные слова по заголовку и описанию. `--sort` и `--desc` задают порядок, `--cursor` читает дальше 500, а `page.total` показывает, сколько задач подошло. Каждая задача содержит `assignments`, `ready`, `blocked_by`, `agent`, `priority_label` и `revision`.
- **`tasks counts [query]`** считает подходящие задачи проекта по проектам, исполнителям, приоритетам и состояниям, каждый раз без собственных условий запроса по этому полю, — для списка выбора.
- **`tasks move <id> --before|--after <id> [--status s]`** ставит задачу проекта рядом с другой в её колонке доски, задавая ей приоритет между ними; ответ сообщает, изменилась ли её метка и какие задачи пришлось раздвинуть, чтобы освободить место.
- **`tasks history <id>`** показывает, кто, что и когда менял в задаче; **`tasks assign --clear`** снимает человека с задачи; **`tasks update --agent`** называет агента, который над ней работает, отдельно от исполнителей; **`people list`** перечисляет вас и всех, кого называют задачи, — для выбора исполнителя.
- **`--revision`** у `tasks update`, `close`, `assign` и `move` отклоняет запись, сделанную по устаревшей копии: `configuration_error`, причина `task.stale`, код выхода 3.

### Changed — may break callers

- **Приоритет задачи — метка над числом от 0 до 1, чем выше, тем раньше.** `--priority` принимает `low`, `medium`, `high`, `critical` или `none` и по-прежнему читает 0 (срочно) … 4 (низкий) как critical, high, medium, low, low. `--json` отдаёт `priority` числом (0.875 вместо прежнего 0) и `priority_label`. Списки упорядочены по нему, сначала самые высокие.
- **Простой `tasks list` читает `state:` как открытую работу**: без `state:` он показывает `open`, `todo` и `in_progress`. Явный `state:open` теперь означает только новые задачи.

### Fixed

- **`tasks update --parent none`** делает подзадачу задачей верхнего уровня; раньше он падал с «no task none».
- **`tasks add`, `close` и `assign` записывают агента**, в чьём терминале запущен memo, как это делал `update`; раньше они всегда записывали владельца.
- **Список проекта сообщает `has_more` на 500 задачах**; раньше он говорил, что больше нет.
- **README называет `tasks links`**, а не `relations`.

## 0.131.1 — 01.11.2026

### Fixed

- **Документация говорит, что почту приносит CLI `mail`, а импорт из Himalaya будет удалён в одной из следующих версий.** `mail <profile> session start` и `mail <profile> sync` наполняют общее хранилище; memo ищет и показывает эту почту. Импорт из Himalaya и `memo mail inspect`, `rules`, `delete`, `restore` и `status` по-прежнему работают без изменений. Менялись только документация и текст справки: `memo mail status` теперь сообщает, что считает лишь импорт из Himalaya, и отсылает к `mail <profile> status`. Документация также говорит, что у почты, синхронизированной через `mail`, нет текста вложений, что `memo mail delete` переносит почту Gmail в Корзину, и пишет `memo mail delete`, `memo mail restore` и `memo mail inspect` полностью.

## 0.131.0 — 31.10.2026

### Fixed

- **Дозаполнение заголовков и исправление HTML-текста больше не блокируют другие CLI в хранилище.** Оба сохраняли по одному письму за транзакцию. Теперь они сохраняют по 50 за транзакцию через `MailStore.saveThreads` из cli-core (cli-core 0.506.0, уже используется с 0.509.0), делают паузу 100 мс между порциями и хранят прогресс в той же транзакции: дозаполнение сохраняет курсор с каждой порцией, а исправление отмечает себя выполненным вместе с последней. Запуск, который упал, продолжается после последней сохранённой порции.

## 0.130.0 — 31.10.2026

### Changed — may break callers

- **cli-core 0.509.0** (вместо 0.507.0) приносит два изменения ниже; 0.508.0 изменил только команды календаря, которых у memo нет.
- **`agents list` называет агента, сделавшего вызов MCP, а не `memo-mcp`.** Вызов через `memo mcp serve` записывается в журнал, а добавленные им факт, воспоминание или действие подписываются именем, которое клиент дал себе сам (MCP `clientInfo.name`, например `claude-code`), иначе кодирующим агентом, запустившим сервер, иначе `memo-mcp`. Фильтр по `agent:memo-mcp` больше не находит новые вызовы. Имя — это заявление самого клиента: оно показывается, но ему не доверяют.
- **`facts add --supersedes` исправляет факт любого вида**, а не только принятое решение. Старый факт должен быть предложенным или принятым; он становится `superseded`, когда новый принят, а факт владельца принят сразу (предложенный раньше оставался предложенным). `--supersedes` агента для факта, принятого владельцем, отклоняется (код выхода 5); для предложенного он, как и раньше, ждёт подтверждения владельца.

## 0.129.0 — 31.10.2026

### Added

- **`memo doctor --online` сообщает, опубликована ли более новая версия memo.** В ответе появляется `online` в форме, как у других doctor WireCat: `ok`, `duration_ms` и `version: { current, latest, newer }` (`latest` равно `null`, когда npm недоступен, и это не приводит к ошибке команды). Без `--online` doctor memo по-прежнему ни с чем не соединяется. Нужны cli-core 0.507.0 и cli-base 0.68.1.

## 0.128.0 — 31.10.2026

### Changed — may break callers

- **cli-core 0.506.0: `search messages --discover` ищет и по смыслу, когда запрос содержит `-`, `NOT`, `OR`, группы, фразы или `exact:`**, где раньше выполнялся только строгий поиск; каждый результат по-прежнему соответствует всему запросу.

### Added

- **`projects evidence --sync-first` синхронизирует связанные чаты проекта перед чтением.** По умолчанию выключено и недоступно через MCP. Для каждого связанного чата, которого в хранилище нет до `--since-time`, memo запускает CLI мессенджера этого чата как `<tg|max|wa> <profile> messages sync --since-time <start> -- <chat>`, по одному чату за раз, в пределах `--sync-time` (всего 3 минуты). Профиль — тот, что вошёл в аккаунт чата, по собственной записи мессенджера; ни одного или несколько — это отказ для этого чата со списком, а не догадка. memo запускает `wcat-<tool>`, когда он называет себя этим инструментом, или короткое имя, только если это пакет WireCat. Stderr дочернего процесса передаётся дальше как ход выполнения. Чат, который прервало время или чья синхронизация не удалась (сессию держит другой запуск, MAX нужен `serve`), остаётся частичным с указанием причины, а его `missing` и `next` сохраняются.
- **Текст называет команду, которая синхронизирует частично загруженный связанный чат**, с её CLI и профилем: `tg work messages sync 9 --since-time 2026-09-01`.
- **`projects evidence` приходит из cli-core** (`gatherStoredProject`, общий с tg и max). Команда объявлена как fetch из-за `--sync-first`. Нужен cli-core 0.504.0.

### Fixed

- **Номер забытого воспоминания или факта больше не выдаётся новому** (cli-core 0.506.0). После `memories remove` или `facts remove` самой новой записи следующая получала её номер, поэтому `memory:N` или `fact:N`, прочитанные до удаления, называли другую запись.
- **`memo doctor`, `memo mcp` и `memo mcp serve` используют краткие описания, общие для всех CLI WireCat.** `memo doctor --help` теперь начинается с «the state this installation is in, without connecting unless --online» (memo по-прежнему ни с чем не соединяется, и `--online` у него нет), `memo mcp` — с «serve this profile's commands to an AI agent, and set that up», а `memo mcp serve` — с «serve this profile's commands to an AI agent». Изменился только текст справки.

## 0.127.0 — 31.10.2026

### Added

- **Исправление, отклонение и удаление воспоминаний и фактов.** `memories add --supersedes memory:<id>` исправляет воспоминание: старое остаётся как `superseded` (только ваше; воспоминание агента отклоняется с `permission_error`). `facts reject fact:<id>` отклоняет предложенный факт (новый статус `rejected`). `memories remove` и `facts remove` стирают запись, её связи с источниками и запись в поиске и отвечают `{ ref, removed: true, links }`; резервная копия хранилища, сделанная раньше, её сохраняет. Ни одна из трёх команд не предлагается через MCP.
- **`subject_name` и `subject_is_owner`** в `memories list`, `memories show`, `facts list` и `facts show`: как называется субъект, без второго запроса.
- **`memories show --sources` и `facts show --sources`** читают каждое свидетельство за один вызов: `ref`, `kind`, `title`, `sender`, `at`, `excerpt`, `tool` и `missing` для источника, удалённого позже.

## 0.126.0 — 31.10.2026

### Added

- **`search notes`, `search messages` и `search mail` сообщают, сколько всего совпадений.** `--json` добавляет `page.total: { value, relation }` в форме `hits.total` из Elasticsearch: `eq` — точное число, `gte` — нижняя граница (подсчёт останавливается на 10 000). Текстовый вывод добавляет `showing 1–20 of 144` под результатами. Заметки считаются и найденные словами, и найденные по смыслу, все страницы вместе (cli-core 0.501.0).

### Fixed

- **Поиск по смыслу внутри фильтра находит заметки самого фильтра.** Для фильтра не более чем из 2 000 заметок по смыслу ранжируется каждая из них, а не 50 ближайших во всём хранилище, урезанные до фильтра (cli-core 0.501.0). memo требует cli-base 0.67.0.

### Changed — may break callers

- **`projects evidence` сообщает, что хранилище держит по каждому связанному чату, а `search messages` и `search all` сохраняют в ответах разрыв покрытия** (cli-core 0.498.0). Каждая строка `linked_chats` получает `title`, `completeness` и `held`; чат, до которого запуск не дошёл, имеет `state: "pending"` без `items` и `capped`, тогда как раньше было `in-scope` с `items: 0`. `completeness` ответа — `partial`, `unknown` или `complete`, а `meta.complete` истинно, только когда запланированные чтения завершены и каждый связанный чат хранится полностью; `complete` сохраняет прежний смысл, «запланированные чтения завершены». Чат, хранимый частично, даёт `missing` (`field: "history"`) и строку в тексте с его именем и командой синхронизации; код выхода остаётся 0. У memo нет `messages sync`, поэтому `next` (шаг cli-core `messages.sync`) из ответов memo убран: чат синхронизирует CLI мессенджера. `search messages` и `search all` отвечали `meta.complete:
true` без `missing` для частично хранимого чата, потому что построители ответов memo отбрасывали то, что вернул cli-core; теперь они передают и то и другое.

- **0.125.0 также принёс ответы cli-core о покрытии, которые меняют вывод JSON** (cli-core 0.493.0, в том выпуске не указан). `memo search all --json` отвечает `meta.complete: false` с `missing` и `next`, когда найденный чат хранится лишь частично или не загружался, тогда как раньше было `true`; код выхода остаётся 0. Строки `memo tasks agenda --json` получают `completeness` и `held`, а в ответе могут быть `meta.complete: false`, `missing` и `next`. Вызывающий, который читал `meta.complete` как «ни один источник не отказал», должен читать причину в `missing`.

## 0.125.0 — 31.10.2026

### Fixed

- **`search notes` и `search all` сохраняют поля запроса для заметок, найденных по смыслу.** `date:today` или `tag:work` без `--exact` возвращали около 20 заметок, не подходящих ни под то, ни под другое; теперь каждое поле и каждое исключённое слово выполняются для каждого результата, а запрос из одних полей перечисляет подходящие заметки, сначала новые. Для документа Google Drive `date:` читает время его последней правки на Drive, показанное в результате как `updated_at`, тогда как раньше читалось время последнего импорта (cli-core 0.496.0, с cli-base 0.65.5).

## 0.124.0 — 31.10.2026

### Changed — may break callers

- **Поиск по заметкам, документам, аннотациям и заметкам о контактах находит часть слова в любом регистре.** Кириллическое слово со смешанным регистром больше не пропускается, а заголовок ищется вместе с текстом. Поиск из одного-двух символов отклоняется с «search needs at least three characters», как и поиск по сообщениям. Хранилище переходит на версию 40 при первом открытии этой версией; ранее сохранённые заметки получают поисковый индекс порциями, пока работает `search notes` или `store migrate`. Более старый memo или другой CLI WireCat нужно обновить в тот же день, иначе он перестанет индексировать новые заметки. Этот memo использует cli-core 0.491.0, который также доводит поиск большой почтовой папки за несколько синхронизаций с ограниченным бюджетом.

## 0.123.0 — 30.10.2026

### Fixed

- **`memo sync` больше не падает с «database is locked», пока другой инструмент пишет в общее хранилище.** Хранилище ждёт блокировку записи, пробуя каждую миллисекунду, поэтому инструмент, пишущий без пауз (`mail sync`), не может держать её все 5 секунд ожидания.
- **Имена сравниваются без учёта регистра в любом алфавите, а не только в латинице.** `memo projects list 'name:*ТАРТ*'` теперь находит «Тартус». То же верно для названий чатов, имён контактов, тем писем и названий ящиков и меток, в `tags list name:` и в поиске почты по `mailbox:` и `label:`. Хранилище переходит на версию 38 при первом открытии этой версией и заполняет копии в нижнем регистре, по которым сравнивает. Более старый memo или другой CLI WireCat по-прежнему читает хранилище и предупреждает, что нужно обновиться.

### Added

- **Результаты `search all`, `search messages` и `search mail` содержат `sender_is_me`**, истинное, когда сообщение отправили вы.

### Changed — may break callers

- **`--help` перечисляет `gcal` в разделе «Works with».** Скрипт или тест, фиксирующий первый экран, получает эту строку. Установите gcal через `@wirecat/gcal-cli`.

## 0.122.0 — 29.10.2026

### Changed — may break callers

- **Навык агента опубликован в ClawHub как `wirecat-memo`.** Установите его командой `openclaw skills install @wirecat/wirecat-memo`. Запись `cli-memo` больше не обновляется. `memo skill install` по-прежнему пишет `skills/cli-memo/`.

### Added

- **`person:me` называет вас** в `context`, `relationships add`, субъектах `notes`, `tasks assign`, `mentions confirm` и `projects gather --contact`. Это человек, которого хранилище отмечает владельцем; если никто не отмечен, ошибка говорит, как его отметить (`tg <profile> contacts link <your id> me`).
- **`memo context person:<id>` читает человека, ссылку на которого вы уже держите.** Раньше он запрашивал аккаунт мессенджера. Человек читается из единственного аккаунта, который его видел; если таких несколько, команда перечисляет их и просит `--source provider:account`.

### Fixed

- **`memo messages show <email>` больше не печатает версии тела AMP и HTML** (около 4 000 символов разметки) после простого текста. `--full` возвращает их.
- **Навык отправлял агентов к `memo commands search <word>`, что похоже на поиск по ключевому слову и отвечает `not_found`.** `memo commands` принимает путь команды (`memo commands search notes --json`); теперь навык говорит об этом, а тест проверяет, что каждая строка с командой `memo` в нём называет существующую команду.

## 0.121.0 — 29.10.2026

### Changed — may break callers

- **cli-core 0.473.0.** `memo projects list` не показывает входящие задачи, которые есть у каждого аккаунта мессенджера (проект с именем вида `telegram:100`, ключом `IN` и восемью символами); `memo projects list kind:inbox` перечисляет только их, а `name:` принимает подстановки `*`.

## 0.120.0 — 27.10.2026

### Changed — may break callers

- **cli-core 0.469.0 и cli-base 0.65.0.** cli-core 0.469 принимает только cli-base 0.65, поэтому обе версии меняются вместе. cli-base 0.65 знает глаголы `serve` и `revoke`, так что записи о них в базовой линии lint исчезли, а его `cli-dev bundle` находит сервер, запущенный с флагом перед `mcp serve`. Начиная с cli-core 0.468 сервер MCP предлагает команду, которая только загружает данные в хранилище, через свой инструмент чтения.
- **Почтовая синхронизация, правила и оценка работают на cli-core 0.472.0.** Движок перенесён в `@wirecat/cli-core/mail`; memo сохраняет свои источники Himalaya и mbox, проверку возраста домена и эмбеддинг. Аккаунт, идентификаторы, состояние синхронизации и ответы прежние. `mail.source-failed` теперь объявляет cli-core, а у `mcp serve` есть параметр `--profiles` из cli-core 0.470 только в общем контракте, по которому он проверяется, но не в memo.
- **`skill show`, `skill status` и `skill install` отвечают на `--json` в конверте для одного объекта** ([WC-OUT-4](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/output.md#wc-out-4--answer-every-json-request-with-one-envelope-a-list-or-one-thing)), `{ item, meta }`, как любая другая команда memo и собственный `skill` cli-core; раньше они печатали голый объект. Вызывающий читает прежние поля в `item`, например `item.targets` у `skill status`.

### Fixed

- **`memo` запускается примерно вдвое быстрее: пакет работает из бандла.** Команда загружала около тысячи файлов модулей, прежде чем что-то сделать; теперь она загружает несколько десятков, содержащих тот же код, собранных `cli-dev bundle` из cli-base. Тёплый `memo search all --help` ускорился с 420 до 186 мс, `memo --version` — с 39 до 18 мс. Вывод не изменился. Работающий `memo mcp serve` загружает весь свой код вскоре после старта, поэтому обновление `memo` на месте его не ломает. Пакет стал больше: 3,1 МБ для загрузки вместо 0,4 МБ.
- **`memo mcp --json` отклоняет флаг с JSON `validation_error` (код выхода 2)**, как `memo notes --json` и `memo mail --json`; раньше он печатал справку группы и ничего в JSON. `mcp revoke` и `mcp server
start|stop|status` теперь сами принимают `--json`, поэтому он ставится после команды: `memo mcp revoke --json`, а не `memo mcp --json revoke`.

## 0.119.0 — 27.10.2026

### Changed — may break callers

- **cli-core 0.467.0 и cli-base 0.64.0.** cli-core принимает только cli-base 0.64, поэтому обе версии меняются вместе.
- **Каждый результат поиска отмечает текст, написанный другим человеком (cli-core 0.464.0).** Результаты сообщений и почты в `search all` содержат `untrusted: ["title", "excerpt", "sender_name"]`, результаты документов — `["title", "excerpt"]`, как и результаты событий; `search messages` и `search mail` отмечают отправителя, название чата и текст. Заметка остаётся неотмеченной: она ваша. Вызывающий, который сверяет результаты со старой строгой копией их формы, отклонит новое поле.
- **Теперь сохраняется каждый запуск, в том числе успешные (cli-core record-every-run).** Раньше сохранялись только неудачные запуски, если не было `--record` или `record: true`. Успешный запуск хранится 7 дней (`keep_successful_runs_for_days`), неудачный — 30 (`keep_runs_for_days`), а папка запусков остаётся в пределах `runs_size_limit_mb` (200 МБ; сначала уходят самые старые успешные). **Приватность:** сохранённый запуск содержит команду как набрана (секреты и номера телефонов скрыты), поэтому успешный `memo search` или `notes add` теперь оставляет свои слова в локальном файле с правами 0600 на 7 дней. `record_input: "failed"` сохраняет их только в неудачном запуске, `record_input: false` скрывает везде; `record: false` теперь сохраняет неудачные запуски (раньше — ничего); `--no-record` не сохраняет ничего. `memo mcp serve` сохраняет успешный запуск только при `--record`.
- **Запуск сообщает, кто его запросил (cli-core).** В `run.json` появляются `via` (`cli`, `mcp-stdio`, `mcp-http`, `desktop`), `mcp` (идентификаторы инструмента, запроса и соединения) и `agent.client` (имя и версия ИИ-приложения). По HTTP агент — это сессия MCP браузерного приложения, а не тот агент, что запустил `mcp serve --http`. Читатель, который сверяет запуск со старой копией его формы, отклонит новые поля.

### Added

- **`memo upgrade` перезапускает HTTP-сервер MCP и называет сессии MCP по stdio, остающиеся на старой версии** (cli-core). После установки он перезапускает каждый `memo mcp serve --http`, запущенный через `memo mcp server start`, с тем же портом, адресом и ограничениями `--permission`, и перечисляет процессы `memo mcp serve` по stdio этой установки как `stale_sessions`, которые нужно перезапустить из вашего ИИ-приложения. Работает со следующего обновления.
- **Чтение почты, которое himalaya повторяет, — это две строки запроса в запуске**: вторая имеет `attempt: 2` и 15 с ожидания, а аккаунт с ограничением скорости называется `mail.throttled`, но не тем, что напечатал himalaya. Строки RDAP содержат `method`, путь с доменом как `:id` и `transport: "http"`; отказ называет `errorCode` реестра (`rdap.429`), прочитанный из тела ошибки не более 4 КБ, но не его заголовок и не описание.
- **`record_input: "failed"`, `keep_successful_runs_for_days` и `runs_size_limit_mb`** в `config.json`.

## 0.118.0 — 27.10.2026

### Added

- **Результат события в `search all` называет текст приглашения в `untrusted`** (`["title", "excerpt"]`), на cli-core 0.460.0. Через MCP агент видит его отмеченным в самом ответе, а не только в инструкциях сервера.
- **`memo search all` находит события Google Calendar**, сохранённые gcal, из всех календарей, ранжируя вместе с сообщениями, почтой и заметками (cli-core 0.459.0). У результата `kind: "event"` и ссылка `event:<id>`, которую открывает `gcal <profile> events show`. `--only` принимает `events`; `meta.accounts` и строка `searched:` называют каждый прочитанный календарь. Когда события искали только по словам, ответ говорит почему, как для заметок и сообщений.
- **`memo context` перечисляет события календаря человека** в `events`: `upcoming` и `recent`, по одному вхождению на серию, без отменённых, из каждого календаря, куда приглашена любая связанная с ним личность; `events.accounts` называет прочитанные календари. Текстовый ответ показывает их под «Upcoming events» и «Recent events».
- **Текст события отмечен как слова других людей.** `memo context --json` содержит `untrusted`, поля события, которые написал отправитель приглашения (`events.upcoming.title`, `events.upcoming.location` и то же под `recent`), как отмечают их календарные инструменты cli-core. Инструкции MCP memo говорят, что заголовок, описание и место события — это данные, но не инструкции.

### Changed — may break callers

- **`memo context --json` называет отсутствующий календарь в `not_read`** (`source: "events"`, "no calendar in the store — gcal <profile> sync"), поэтому ответ, у которого `not_read` был пустым, теперь содержит эту запись, пока gcal не синхронизируется.
- **`@wirecat/cli-core` 0.451.0 → 0.463.0.** Общее хранилище переходит на версию 35 (вхождение называет свою серию в столбце); сборки, говорящие на версии 34, всё равно его открывают.
- **Сервер MCP — это `memo mcp serve`; одиночный `memo mcp` только показывает свои команды** (cli-core 0.463.0). `--http`, `--port`, `--public-url` и `--permission` переехали в `mcp serve`, а `memo mcp --revoke` теперь `memo mcp revoke`. Псевдонима нет: приложение, в настройках MCP которого запускается `memo mcp`, получит справку и код выхода 2, поэтому измените его `args` на `["mcp", "serve"]`; Claude Code настраивается командой `claude mcp add memo -- memo mcp serve`. `memo mcp server start` запускает `mcp serve --http` и по-прежнему передаёт `--permission`.

### Fixed

- **`memo sync` останавливается по Ctrl-C и SIGTERM**, тогда как раньше игнорировал SIGTERM и доходил до конца. Он останавливается на следующей пачке писем, почтовом аккаунте или папке заметок, сохраняет точку возобновления, завершает работающий himalaya, снимает блокировку импорта и завершается с `cancelled` (код выхода 130). **`memo sync --timeout <duration>`** останавливает его так же по сроку, с `timeout` (код выхода 9); без него у синхронизации нет ограничения по времени, как и раньше.
- **Навык агента memo снова публикуется в ClawHub как `cli-memo`.** ClawHub хранит имена навыков по издателям, поэтому `wirecat/cli-memo` — собственное имя memo, и навык каждого инструмента WireCat теперь использует своё простое имя. Следующий выпуск опубликует его как `cli-memo` 1.0.1. `memo skill install` по-прежнему пишет `skills/cli-memo/`.

## 0.117.0 — 27.10.2026

### Added

- **Навык велит агенту никогда не просить пароль от почты или пароль приложения в чате**: владелец добавляет почтовый аккаунт сам, в Himalaya, а затем через `memo mail add`.

## 0.116.0 — 27.10.2026

### Fixed

- **`memo search all` и поиск по смыслу в заметках и файлах отвечают за доли секунды (cli-core 0.451.0).** Ранжирование документов и заметок по смыслу теперь использует векторный индекс вместо чтения каждого фрагмента в хранилище: на одном архиве с 600 000 фрагментов, в основном почты, запрос занимал 7–18 с, теперь около 0,05 с, с теми же результатами. Если индекс не готов, он по-прежнему читает каждый фрагмент.
- **Поиск по смыслу работает на нативном ONNX Runtime и в Windows.** После `memo models download e5-small` модель использует нативную библиотеку в Windows x64 и arm64, как уже в Linux и macOS: в 2–3 раза быстрее WebAssembly. Загрузка берёт `onnxruntime.dll` из npm-пакета `onnxruntime-node` (113,5 МБ, один раз, проверяется по sha256).

## 0.115.0 — 27.10.2026

### Added

- **`memo mcp --http --public-url` принимает путь (cli-core 0.450.0)**, `https://<name>.ts.net/memo`, поэтому memo делит один адрес туннеля с другими инструментами, у каждого свой путь. Вход и адрес коннектора (`…/memo/mcp`) содержат путь; туннель также направляет `/.well-known/oauth-authorization-server/memo` и `/.well-known/oauth-protected-resource/memo` на сервер. WireCat Desktop настраивает это через Tailscale Funnel.

### Fixed

- **Навык агента memo публикуется в ClawHub как `wirecat-memo`.** В ClawHub есть непубличный `cli-memo` 1.0.0, и он отклоняет каждый новый 1.0.0 под этим именем, поэтому ни один выпуск не мог опубликовать навык. `memo skill install` по-прежнему пишет `skills/cli-memo/`.

## 0.114.0 — 27.10.2026

### Fixed

- **`memo mail add` и `memo mail check` принимают аккаунт Himalaya без `email`.** Himalaya работает и без него, поэтому у многих аккаунтов адрес указан только как логин. Теперь memo берёт адрес из логина IMAP, затем из логина SMTP, если это адрес электронной почты. Когда его нет ни там, ни там, ошибка называет файл конфигурации Himalaya и строку, которую нужно добавить: `email = "you@example.com"` в `[accounts.<name>]`.

- **Каждая команда тратит меньше времени на подготовку (cli-base 0.62.0, cli-core 0.449.0).** Проверка общих команд теперь описывает каждую команду один раз, а не заново для каждой группы над ней. Это было около 60% подготовки каждой команды; в tg тёплый `run(["--version"])` ускорился с 49 до 29 мс. Она ловит те же изменения, что и раньше.

## 0.113.0 — 26.10.2026

### Fixed

- **Поиск по смыслу и полоса смысла `memo search all` работают в 2–3 раза быстрее в Linux и на Mac с Apple silicon (cli-core 0.448.0)** после следующего `memo models download`: текстовые модели тогда работают на нативном ONNX Runtime, а на WebAssembly — там, где он не установлен.

## 0.112.0 — 26.10.2026

### Security

- **Запись запуска скрывает секрет по его виду, а не только по имени параметра (cli-core 0.446.0).** Токен известного формата (GitHub, OpenAI, Anthropic, Slack, AWS, Google, Stripe, npm, Telegram, JWT, закрытый ключ), учётные данные `Bearer`, значение после `password=`, `pin 1234` или другого имени секрета и случайно выглядящая строка заменяются на `[redacted]` внутри слова, а слова вокруг остаются: `memo search notes "Kai password=tulip42"` сохраняет `Kai password=[redacted]`. Конфигурация, которая не загружается, теперь скрывает каждое набранное значение, как `record_input: false`.

## 0.111.0 — 26.10.2026

### Added

- **`memo mcp server start|stop|status` запускает HTTP-сервер MCP в фоне (cli-core 0.445.0).** `start` принимает `--public-url`, `--port` (по умолчанию 8767) и `--permission` и отвечает, когда сервер начал слушать; `status --json` показывает порт, адрес коннектора, текущий код входа с временем истечения и вошедшие приложения, каждое под именем, которое оно себе дало; `stop` завершает только сервер, запущенный `start`. `memo mcp --http` теперь держит блокировку рядом с файлом токена, поэтому второй сервер отклоняется, а его код входа обновляется по истечении. Этим пользуется WireCat Desktop.

### Changed — may break callers

- **Запуск хранит команду как набрана (cli-core 0.440.0).** `memo runs show` и `run.json` теперь содержат `argv`, слова после `memo`, чтобы владелец мог прочитать, что запускалось: поиск, имя, название заметки. Секрет по-прежнему `[redacted]` (параметр с именем токена, пароля или ключа API, пароль в URL, длинная непрозрачная строка), как и номер телефона. Новый ключ `record_input` в `config.json` со значением `false` записывает каждое значение, которое может быть содержимым, как `[redacted]`. Справка `--record` теперь говорит об этом; раньше она гласила «ids and timings, never note or mail content».

## 0.110.0 — 26.10.2026

### Added

- **`memo skill install --for hermes` даёт навык Hermes Agent, а `memo skill status` сообщает, что читает Hermes (cli-base 0.59.0).** Команда добавляет `~/.agents/skills` в `skills.external_dirs` Hermes через `hermes config set`, сохраняя уже перечисленные папки, или копирует файл в домашнюю папку Hermes, если это не удалось. Если Hermes не установлен, она завершается с `not_found` и ничего не пишет. Просто `memo skill install` и `--for all` по-прежнему пишут только копии для Claude Code и `~/.agents/skills`. `skill status --json` получает `hermes` рядом с `targets`.
- **Запуск, начатый OpenClaw или Hermes Agent, называет этого агента (cli-core 0.437.0).** `runs show` отдаёт `agent` как `openclaw` для команды, которую выполнил агент OpenClaw, с `from_chat: true`, когда её начало сообщение чата; запуск Hermes содержит свою сессию, поэтому захват задачи из Hermes удерживается по сессии.
- **Навык `cli-memo` сообщает OpenClaw и ClawHub, что ему нужен `memo`, и как его установить** (`metadata.openclaw`: `requires.bins` и npm-пакет `@wirecat/cli-memo`). Если `memo` нет в PATH, OpenClaw отмечает навык неготовым и предлагает установить пакет. Claude Code и Codex этот блок игнорируют.

## 0.109.0 — 26.10.2026

### Added

- **`memo search all` теперь находит и сообщения по смыслу, когда это возможно** (cli-core 0.435.0). Он ищет 100 сообщений, ближайших по смыслу (e5-small по собственному вектору каждого сообщения, все читаемые аккаунты), и объединяет их с результатами по словам в один список сообщений до слияния с почтой и заметками; `found_by` каждого элемента говорит, каким поиском он найден. Без модели или векторов сообщения читаются по словам, как раньше, и ответ говорит об этом: примечание `Messages by words only: …` в терминале и запись `found_by` в `missing` при `--json` и MCP с названием `memo models download e5-small` или `conversations rebuild` мессенджера. `--exact` и запрос с NOT или с фильтром под OR или в группе остаются только по словам. Поиск никогда не загружает модель и не отправляет текст куда-либо.

### Changed — may break callers

- **cli-core 0.435.0 переводит общее хранилище на версию 34**, где хранится индекс для поиска по смыслу (sqlite-vec, поставляется в `@wirecat/cli-core-sqlite` 1.1.0). После того как memo или любой CLI WireCat на cli-core 0.434.0 и новее откроет хранилище, memo 0.108 и старше отказываются с ним работать и просят обновиться, поэтому обновляйте все CLI WireCat вместе.

## 0.108.0 — 25.10.2026

### Fixed

- Почта разбирается с postal-mime 4.1.4, где исправлено чтение некоторых повреждённых писем: блок заголовков заканчивается на первой строке, которая не является ни полем, ни его продолжением, вложенное письмо в base64 или quoted-printable остаётся вложением, а учитываются только настоящие метки кодировки UTF-16. При повторном импорте такого письма может сохраниться немного другой текст.
- **`memo --version` без других аргументов отвечает до загрузки программы**: около 50 файлов модулей вместо 1 050 (`cli/start` из cli-core). `--version` вместе с чем-то ещё в строке проходит через программу, как раньше.

## 0.107.0 — 25.10.2026

### Security

- **`memo doctor` сообщает о файлах и папках, которые могут читать другие пользователи, и о команде `chmod`, которая исправляет каждый случай.** `files` в `memo doctor --json` имеет вид `{ checked, ok, problems }`, каждая проблема — `{ path, mode, want }`, как у doctor каждого инструмента WireCat: файлу настроек и хранилищу с его файлами `-wal` и `-shm` нужен `0600`; папке настроек, папке журнала запусков и папке хранилища (если хранилище не задано через `MESSAGING_STORE`) — `0700`. С `--json` исправление выводится в stderr как `to make it private: chmod 600 '<path>'`; текстовый вывод перечисляет его вместе с остальными проблемами. На диске ничего не меняется, и эти проблемы не влияют на код выхода, как и проблемы настроек. Windows не проверяется: `files` равно `{ checked: false, reason }`.
- **Каждое изменение, которое memo сохраняет в `config.json`, оставляет файл доступным только владельцу (`0600`)** (cli-base 0.57.0). Файл, который могли читать другие пользователи, как его оставлял `config set` в старых версиях, становится закрытым при следующем сохранении.

## 0.106.0 — 25.10.2026

### Changed — may break callers

- **Записи запусков теперь ведёт cli-core 0.430.0** (`recordRuns`) вместо собственной копии memo. Запуски сохраняются как раньше — каждая неудачная команда, включая ошибку использования до любой команды, удачная — при `--record` или `record: true`, ничего — при `--no-record`, — а вызовы Himalaya и RDAP записываются как раньше. В `runs list` и `runs show` у запуска теперь нет поля `profile` вместо `""`, поскольку у memo нет профилей.

## 0.105.0 — 25.10.2026

### Added

- **Неудачный запуск сообщает, что пошло не так** (cli-core 0.425.0): `memo runs list` и `memo runs show` получают `error` с классом, кодом, причиной, замаскированным сообщением и коротким стеком.
- `memo store info` описывает общее хранилище: где оно находится, его схему по сравнению с той, которую читает memo (`schema.reason`, и `schema.upgrade` — до какой схемы его переведёт следующий запуск memo), и какие инструменты им пользовались. Он открывает хранилище только для чтения, поэтому WireCat Desktop может понять, может ли memo прочитать хранилище.
- **`memo skill status` сообщает для каждого агента, совпадает ли установленный у него SKILL.md с этой версией**, а `memo skill show --for claude|agents` печатает установленную там копию (cli-base 0.56). `memo skill show`, `skill install` и `skill status` принимают `--json`, как в tg: у memo нет глобального `--json`, поэтому у каждой команды навыка он свой.

### Fixed

- **Инструменты MCP описывают собственные команды memo, а не команды мессенджера.** `memo_tools_search` предлагает «list», «show», «change a setting» вместо «unread», «send message», «chat members»; `memo_write` говорит «creates, edits, deletes» вместо «sends, edits, deletes, joins»; пример команды у `memo_read` и `memo_write` — `notes list`, а не `messages list`, которой в memo нет; а текст ответа — «names, titles, what people wrote» (cli-core 0.426.0).
- **Справка больше не пишет «Availability: available for this profile»**, поскольку у memo нет профилей; команда, которую нельзя выполнить, по-прежнему объясняет почему. `memo --help` сообщает, что zm и drive «searchable with your other WireCat data».
- MCP больше не предлагает группу команд, которая только печатает свою справку, например `models`; её команды по-прежнему предлагаются по одной.
- Шаги руководств person-brief и decision-trail для tg, max, zm и drive называют профиль, как того требуют эти команды: `tg personal contacts context Kai`.

## 0.104.0 — 25.10.2026

### Added

- **`memo doctor --json` перечисляет каждую проблему в файле настроек как `config.issues`** в форме, общей для doctor каждого инструмента WireCat: `{ kind, file, key?, line?, column?, what, fix? }`, где `kind` — одно из `invalid_json`, `unknown_setting`, `unknown_permission`, `missing_setting` или `invalid_value`. `what` говорит, каким должно быть значение, и никогда не цитирует сохранённое значение; `fix` — это `memo config unset <key>`, который работает как написано, и его нет для некорректного JSON, где `line` и `column` указывают, где остановился разбор. Doctor по-прежнему отвечает на сломанный файл, проверяет остальное по той части файла, которая ещё загружается, и одни только проблемы настроек оставляют его код выхода равным 0. Текстовый вывод перечисляет их вместе с остальными проблемами.
- **`memo config unset <key>` удаляет одну настройку по пути через точку** (`mail.accounts.0.colour`, `permissions.notes.edit`), даже ту, которую memo не знает, и даже в файле с другими проблемами, поэтому каждое исправление, которое печатает doctor, работает. Через MCP команда не предлагается: там она могла бы удалить сохранённое разрешение, которое применяет сервер.
- **memo ведёт журнал запусков, как tg, max и wa.** Неудачная команда сохраняется как запуск: её слова (никогда не аргументы), как она закончилась, код ошибки и каждый вызов Himalaya (`himalaya.envelope.list`, статус выхода, длительность) и запрос RDAP (`rdap.domain`, HTTP-статус), которые она сделала, — никогда заметку, адрес, тему, папку или домен. Их читают `memo runs list [query] --limit --page --json`, `memo runs show <run-id> --json` и `memo runs path <run-id>`; страница Logs в WireCat Desktop читает `memo runs list … --json`. `--record` сохраняет удачный запуск, `--no-record` не сохраняет ни одного; ключи `record` и `keep_runs_for_days` (по умолчанию 30) в файле настроек задают и то и другое для всех команд. Вызов инструмента агентом сохраняется как `mcp <command>`.

### Changed — may break callers

- **`config.exists` в `memo doctor --json` теперь называется `config.found`**, рядом с новым `config.issues`.
- **Файл настроек с проблемами отклоняется с первой проблемой, её исправлением и числом остальных, которые перечисляет `memo doctor`**: "<file>: setting default_profile is not a setting of memo — remove it with \`memo config unset default_profile\` (and 2 more problems — \`memo doctor\` lists them all)". Раньше отказ называл только первый ключ и фиксированную причину.
- **Старые имена команд больше не распознаются как ключи разрешений.** Сохранённое разрешение или ключ `--permission` от удалённого пути команды (`auto.start`, `mail.trash`, `note` и остальные) получает тот же ответ, что и любой ключ, который не называет команду: `memo mcp` отказывается запускаться и называет `memo config unset`, который удаляет сохранённый ключ, или `--permission <key> names no command`, без указания замены. Любой другой неизвестный ключ разрешения отклоняется так же; раньше он игнорировался.
- **`memo sync --account` удалён.** Называйте почтовые ящики через `--source email:<account>`.
- **Используется cli-core 0.423.0.** С ним `--source obsidian:<id>` и `--source local:<id>` называют одну папку заметок; раньше они не находили аккаунт.

### Fixed

- **Справка memo описывает собственные команды memo.** Первый экран указывает на `answers create "…" --all` (команды `ask` нет). Инструкции сервера MCP открывают письмо через `messages show`, а не через `mail show`, которого в memo нет. `search messages` и `search mail` описывают `--brief` и `--full` для сообщения или письма, а `--full` поясняет, что JSON всё равно даёт фрагмент. Примеры встреч называют настоящий аккаунт встреч (`zoom:me@example.com`). Примеры `mail delete`, `mail restore` и `mail rules apply` — пробные запуски, а `upgrade` показывает только `--check`. memo сообщает cli-core, что он не мессенджер (`AppIdentity.messenger: false`). `minCompatible` хранилища не меняется.

### Removed

- **`search all` и `search notes` больше не принимают `--brief` и `--full`.** Оба флага принимались и затем игнорировались. Вызов с одним из них теперь завершается ошибкой неизвестного параметра.
- Якоря для удалённых имён команд в `docs/commands.md` и таблица удалённых имён инструментов MCP в `docs/mcp.md`.

## 0.103.0 — 25.10.2026

### Changed — may break callers

- **memo работает с общим хранилищем из cli-core 0.420.0, которое переводит хранилище через версии 30–33.** Папки заметок теперь — аккаунты провайдера `obsidian` или `local`: `--account obsidian:<id>` и `local:<id>` называют одну из них, и `folder:<id>` по-прежнему тоже. Документы Google Drive хранятся в аккаунте `google-drive` инструмента drive, а не в замещающей папке; `memo folders list` по-прежнему помечает его «kept by drive», `memo folders update` по-прежнему его отклоняет, `search all` называет его среди прочитанных аккаунтов, а `notes:<id>` называет его источником. `vocabulary inspect` теперь отвечает `coverage.apply_supported: true`, значением cli-core: cli-core умеет применить предпросмотр, а в memo нет команды, которая это делает. Когда этот memo перевёл хранилище, более старый memo и любой CLI на более старом cli-core отказываются с ним работать и предлагают обновиться.

## 0.102.0 — 25.10.2026

Изменился только номер версии по сравнению с 0.101.0.

## 0.101.0 — 25.10.2026

### Added

- **`memo projects evidence` по умолчанию читает подтверждённых участников проекта.** Для каждого человека, подтверждённого как участник проекта (`memo relationships add person:<id> project:<id>`), теперь читается то, что написали его сохранённые идентичности, как при `--contact person:<id>`, без явного указания; раньше участник, который ни разу не написал название проекта, отсутствовал в результате и в `people`. Предложенные участники не читаются, а человек, переданный ещё и через `--contact`, читается один раз. Псевдонимы участников не ищутся. Всего запускается не больше 16 линий, поэтому участники, которые не поместились, перечисляются как непрочитанные (`member`, `member-limit`) в фиксированном порядке и никогда не отбрасываются молча. MCP `project_evidence` возвращает то же.

## 0.100.0 — 25.10.2026

### Added

- **`memo projects evidence` сообщает, кто участвует.** В результате есть `people`: кто написал сообщения и письма запуска, человек за человеком по вашим сохранённым контактам, с числом элементов от каждого. Связанные аккаунты человека в нескольких мессенджерах и почте считаются как один; ваши собственные сообщения не учитываются; не больше 20 человек, `people_omitted` считает остальных. Имена в тексте никогда не используются для догадок. Текстовый вывод добавляет одну строку «people who wrote these». MCP `project_evidence` возвращает то же. Используется cli-core 0.418.0, в котором есть и исправление из 0.417.0: `--discover` считает «?» в конце вопроса знаком препинания.

## 0.99.0 — 25.10.2026

### Added

- Каждый раз, когда memo открывает общее хранилище для записи, он сообщает cli-core своё имя и версию. Когда другой CLI WireCat (tg, max) обновляет хранилище так, что старые CLI больше не могут с ним работать, он теперь может назвать memo и предложить выполнить `memo upgrade` вместо общей строки.

## 0.98.0 — 25.10.2026

### Fixed

- **`memo projects evidence --cursor` вычитывает активный связанный чат на полной скорости, когда остальные чаты закончены.** Доля чата в элементах запуска теперь учитывает только связанные чаты, в которых ещё есть что читать, поэтому в проекте с десятью связанными чатами последнему активному нужно около 10 запусков вместо примерно 45. Используются cli-core 0.416.0 и cli-base 0.53.0.

## 0.97.0 — 25.10.2026

### Added

- `memo mcp --http --public-url <https-origin>` предоставляет те же три инструмента MCP через аутентифицированный HTTP-транспорт cli-core, по умолчанию на локальном порту 8767. Общий вход по коду доступа OAuth, хеширование токенов и `--revoke` работают с теми же разрешениями на каждый вызов и более строгими ограничениями сервера, что и stdio. `--port` выбирает другой локальный порт; параметры только для HTTP без `--http` отклоняются. Руководство по удалённому подключению описывает туннели, вход приложения и отзыв доступа.

### Fixed

- Создание заметки через MCP передаёт текст один раз через сгенерированный исполнитель Core, а не сразу как позиционный аргумент и как `--text`. Общее исправление действует для stdio и HTTP.

## 0.96.0 — 25.10.2026

### Changed — may break callers

- `mail rules list <account> protected:true` заменяет `--filter is:protected`. У удалённого параметра нет псевдонима.

### Added

- Списки организаций, проектов, напоминаний, ключевых документов, почтовых правил и запусков очистки объявляют запросы, выведенные из схемы, и отбирают записи в собственных читателях до ограничений списка.
- **`memo search people <name>` находит человека во всех аккаунтах.** Поиск идёт по имени, логину или вашему
  псевдониму без учёта регистра и диакритических знаков, в том числе кириллицей, и даёт `person:<id>`, который принимает
  `memo projects evidence --contact`, с каждой идентичностью. `--source` сужает набор аккаунтов; ответ называет
  прочитанные.
- **`memo projects evidence` читает за один запуск только долю каждого связанного чата.** Один активный чат больше не
  заполняет весь запуск: каждый связанный чат даёт не больше своей доли лимита элементов (50 для одного чата при лимите по
  умолчанию 100, по 20 от четырёх чатов), вывод называет ограниченные чаты, а `--cursor` читает остальное. Записи JSON
  `linked_chats` получают `items` и `capped`. Нужен cli-core 0.413.0.

## 0.94.0 — 24.10.2026

### Changed — may break callers

- **Общие контракты команд требуют явных переопределений в исходном коде.** Обзор команд показывает схемы, объявленные причины и точные различия «до» и «после». Сохранённые метки тем встреч используют `--topic-name` в CLI и `topic_name` в продолжениях MCP.

### Added

- **`memo context` показывает файлы человека в Google Drive.** Файлы, которыми он владеет или которые последним изменял, видны в разделе «Files, as Google reports» со ссылкой Google и временем изменения от Google. Связи, которые угадала программа, по-прежнему ждут вашей проверки.
- **`models list` и проверенные загрузки используют каталог Core.** Выбор модели — встроенный запрос, а `models download --offline` отказывает до любой работы с сетью. Обновления задач проекта сохраняют поля приоритета и родителя; задачи из источников сохраняют явную обработку аккаунта и исполнителей.

### Security

- **Разрешение зависимостей исключает уязвимые версии Zod, Vite и postal-mime.** Проверки выпуска отклоняют серьёзные уязвимости рабочих зависимостей в зафиксированных и свежих разрешениях пакетов.

## 0.93.0 — 24.10.2026

### Changed — may break callers

- **MCP uses cli-core's discovery/read/write tools.** Reconnect saved clients, find commands with
  `memo_tools_search`, and run CLI paths with `memo_read` or `memo_write`. Individual tool names are removed.
  Command input and execution come from the CLI, including snake_case options, permission rechecks and
  read locks. Discovery retains denied commands with their current availability and reason. Search inputs use `query`; `facts add` uses `statement`. The MCP guide maps saved calls to
  their replacements. Cited meeting/project proposals keep their inline JSON `input`; annotation checks
  take the existing snapshot and bindings file paths used by the CLI.
- **Account selection uses only canonical flags.** Reads use `--source`; account-scoped writes use explicit
  `--account provider:account`. Retired `--provider` and read-side `--account` flags are refused before the command runs.

- **Commands use the shared vocabulary without aliases.** Rename saved calls and permission keys:

  | Previous command | Current command |
  |---|---|
  | `agents log` | `agents list` |
  | `auto start/stop/status` | `jobs start/stop/status` |
  | `ask` | `answers create` |
  | `note <identity> [path]`, `note --clear` | `notes links show/add/clear` |
  | `folders attach` | `folders update` |
  | `mail trash` | `mail delete` |
  | `mail runs` | `mail runs list` |
  | `mail rules import-filters` | `mail rules import --format gmail` |
  | `memories stale` | `memories invalidate` |
  | `relationships suggest` | `relationships scan` |
  | `reminders poll`, `reminders ack` | `reminders claim`, `reminders acknowledge` |
  | `tasks relations` | `tasks links` |

  Moved permission keys stop with `configuration_error` naming the replacement, so saved denials cannot
  silently stop applying. Note links have separate read and write commands with standard JSON answers.
  Meeting searches select tags/topics with native `tag:` and `topic:` query terms; the old `--tag` and
  `--topic` flags are removed. Memo rules imports keep their existing default format and behavior.
- **Agent facts require cited evidence through both CLI and MCP.** The owner may still record an uncited
  fact; proposed agent facts cannot bypass the evidence requirement by using the command runner.

### Added

- **`projects annotations show` reads selected annotations without creating a file**, through the same
  snapshot service as export. It remains available under the read lock.

### Fixed

- **Supported commands remain discoverable with current availability and a reason**, including under the
  read lock. Calls enforce the current permissions. CLI help and discovery also show the read lock.
  Uses published cli-core 0.410.0 and cli-base 0.50.4.

## 0.92.0 — 24.10.2026

### Changed — may break callers

- **Commands use cli-core 0.406.0's canonical names, with no aliases.** `tasks plan` is now part of
  `tasks update`: one command sets the title and description of any task, `--due` and `--remind-time`, priority
  and parent for a project task, and category and assignee for a task from a source, which names its `--account`.
  `tasks update` is refused under `MEMO_READ_ONLY`, so a read-only agent no longer sets due dates or categories.
  `models text download` is `models download`. The MCP tools follow: `tasks_plan` and `models_text_download` are
  gone. Shared commands use cli-core's new names, and a saved permission key with an old path, such as
  `tasks.plan`, stops with `configuration_error` naming its replacement.

## 0.91.0 — 24.10.2026

### Added

- **The agent skill asks for two or three searches in other words before reporting no answer**, covering
  paraphrases and language changes without a separate query-expansion model.

- **Meeting search exposes every shared selector**, including meeting/person/identity/event/series ids,
  tags and topics. The guide explains Memo's explicit stored-account scope and why calendar verification
  and zm's extra semantic-search flags differ.

- **`memo mail add <account> <address>` checks the explicit Himalaya account and matching configured email**
  before saving it. `mail check <account>` repeats the local checks; neither command chooses a default account
  or opens the mailbox. Use `--kind imap` and repeated `--folder` for other IMAP providers.

- **`memo models text download <model>` downloads and checks the shared search model**, through cli-core's
  downloader. Sync, search and setup instructions now point to `memo models text download e5-small`.

- **MCP exposes the command tree, including writes**, with generated command names alongside all 37 existing
  tools. Open cited notes with `notes_show`, stored messages and emails with `messages_show`, and tags with `tags_list`.
  Source-folder and mail-rule changes need `mcp.authority` (denied by default). Meeting findings decisions
  and selected annotation restore each need their own explicit permission. `agent_decisions` still applies.
- **Saved dotted `permissions` and `mcp --permission key=level` limit tools.** Server overrides can only tighten
  saved levels; locks and permissions are checked before every call. `MEMO_READ_ONLY` removes writing tools.

### Fixed

- **The shared mail-import hint names `--only mail`**, included with cli-core 0.404.0.
- **cli-base is pinned at 0.50.3**, matching cli-core's required vocabulary. MCP server/client are pinned at 2.3.0.
- **Install instructions name npm 11.17's `allowScripts` warning and npm 12's blocked scripts**, explain the
  package-specific approval command, and keep `memo skill install --for all` explicit.
- **The introduction describes file writes accurately:** `notes edit` can change a source note, `notes export`
  writes files, and explicit Gmail Trash and restore commands need `--yes`.

## 0.90.0 — 24.10.2026

### Added

- **The first command at a terminal asks three questions once for every WireCat tool** (cli-core 0.404.0): which
  languages you write and speak, which other WireCat tools to install, and whether commands and agents may only read.
  Answered in any tool, they hold in all of them; "read only" stops every `memo` change, as `MEMO_READ_ONLY` does.
  `tg setup`, `max setup` or `wa setup` asks again. Agents, `--json`, `--no-input`, `CI` and `MEMO_READ_ONLY` are
  never asked.

### Fixed

- **The introduction shows the current notes-search output and names all six WireCat tools.** The example
  uses fictional notes and explains the diagnostic when the local meaning model is missing.

## 0.89.0 — 22.10.2026

### Added

- **`sync`, `mail inspect`, `mail trash`, `mail rules apply` and `projects evidence` name the zone they read a
  date in and give the window in UTC.** In `--json` (and over MCP for `project_evidence`), `meta.timezone` appears
  when `--since-time` was a date without a zone, and `meta.window.since` is the start it used.
  `projects evidence` also gives `meta.window.until`, its exclusive end.

### Fixed

- **An mbox email whose only date is a `Date:` header without a zone is refused**, instead of being read in this
  computer's zone without a word. A `From ` line date without a zone is still UTC, as the mbox format defines it.

## 0.88.0 — 22.10.2026

### Added

- **`search meetings --json` names the zone it read a date in and gives the window in UTC.** `meta.timezone` appears
  when `--since-time` or `--until-time` had no zone, and `meta.window` holds the `since`/`until` bounds it used. The
  MCP tool `search_meetings` gives only `meta.window`, since its times always carry a zone. cli-core 0.384.0 and
  cli-base 0.49.0.

### Fixed

- **A store the pre-rename `cli-messaging` wrote is refused again, and left untouched** (cli-core 0.385.0). Since
  cli-core 0.382.0 such a file was opened and failed with `internal_error`; it now fails with `configuration_error`.

## 0.87.0 — 21.10.2026

### Changed — may break callers

- **A date you type covers your whole local day, and a time without a zone is read in your computer's zone.**
  `mail inspect`, `mail trash`, `mail rules apply` and `sync` `--since-time`, and `projects gather --since-time`, read
  `2026-09-01` as midnight UTC and `2026-09-01T10:00` in whatever zone the process ran in. They now start at local
  midnight of the computer's zone (cli-core 0.379.0, cli-base `WC-TIME-3`/`WC-TIME-5`). What to watch for: a window
  given as a date alone now starts a few hours earlier or later than before, by your offset from UTC.
- **`reminders add --timezone` defaults to the computer's zone, not UTC.** The reminder's time is unchanged; only the
  zone kept with it is.
- **A mail rule's `decided_at` without a zone is read in the computer's zone** when rules are imported; a date alone
  was UTC midnight.
- **cli-core 0.379.0 and cli-base 0.48.0**; the shared CI runs the tests in `Asia/Vladivostok`.

## 0.86.0 — 21.10.2026

### Fixed

- **`memo projects evidence --contact person:<id>` found nothing for a person with a messenger display name.** It
  searched the stored name as words, and a name such as «Степа Stefan Grachev AVITO M A» is spelled out in no
  message. It now reads every message and mail the person's stored identities wrote in `--source`, labelled
  `sender` (`[sent by contact]` in text), and searches only the aliases you gave them; a person with neither is
  refused. A literal `--contact "<name>"` is searched as before.

## 0.85.0 — 21.10.2026

### Fixed

- **`memo projects evidence` no longer fails on a project with a confirmed meeting link.** Reading linked chats
  parsed every confirmed member-of link as a reference and stopped at `meeting:…` with `input.invalid`; it now skips
  links that are not chats. Broken in 0.84.0.

## 0.84.0 — 20.10.2026

### Added

- **`memo projects evidence` reads the project's linked chats** (MCP `project_evidence` too, on by default). Every
  message of a chat confirmed as the project's is read, at most 16 chats, oldest link first, when `--source` holds
  the chat's account. Those items have `context: "linked-chat"` (text output `[linked chat]`): they name nothing.
  A suggested link is not read. A linked chat outside `--source`, or past the 16th, is listed in `unread_sources`
  with `kind: "linked-chat"` and `reason` `out-of-scope` or `linked-chat-limit`. The result also carries
  `linked_chats` with each chat's state.
- **`memo relationships add chat:<provider>/<account>/<chat> project:<id>`** makes a chat a project's
  (`member-of` only). The reference names the chat's account, so no account is chosen for you. An agent's link
  waits for the owner's `memo relationships confirm`.

### Changed — may break callers

- Needs `@wirecat/cli-core` 0.377.0. A project evidence lane's `query` is `null` for a linked chat; its `chat`
  holds the chat reference.

### Fixed

- **A document hit's `around` is centred on the first paragraph that names a searched word**, in document order,
  not on the paragraph the first lane found. A document item also carries `moreMatches`: how many later paragraphs
  name a searched word too (`@wirecat/cli-core` 0.377.0).
- **`projects evidence` help no longer says "literal search".** Each name, alias, `--context-query` and
  `--contact` is a search where every word must appear in one text, in any order, as whole words; it is not a
  phrase search.

## 0.83.0 — 20.10.2026

### Added

- `memo projects evidence --contact person:<id>` (MCP `project_evidence` `contact`) searches the person's stored name and
  keeps the `person:<id>` reference on the lane; an unknown id is refused with `not_found` instead of searched as text,
  and a person with no stored name is refused with `validation_error` rather than searched under an identity's name.
- **`projects annotations export|check|restore`** retains selected project aliases, facts and generic
  links, with explicit external bindings and historical state. Export writes a new private file from
  read-only source access; preview checks an existing explicit target; owner-only restore requires its
  exact fingerprint and refuses populated/conflicting targets. Notes, meeting memberships, tasks,
  memories, labels and findings remain omitted, so this selected format is not a full project backup.
- **`project_annotations_snapshot` and `project_annotations_preview` MCP tools** read the same bounded
  selected graph and destination conflicts. Restore is not exposed through MCP. Calls keep the normal
  audit record, and schema, file reading, reference policy and transactions come from shared Core.

### Fixed

- MCP connection instructions distinguish direct proposed records, configurable project decisions and
  owner-only meeting findings and annotation restoration.
- Guides consistently distinguish proposed memories and direct facts from project proposals that an
  agent can decide with a recorded reason, and explain the owner decision setting and meeting boundary.
- **`sync --retry-attachments` help no longer says to install an extraction engine.** The PDF and Word
  readers ship with memo; the option is for attachments an older memo or a broken install left unread.

## 0.82.0 — 20.10.2026

### Fixed

- The MCP guide describes project-decision permissions and the accepted facts and numbered tasks that
  confirming a proposal can create, alongside the owner-only review of meeting findings.
- Key-document suggestions report `state: "untracked"` because no source fingerprint was saved with
  the suggestion. They no longer incorrectly report unchanged text; reread the document before deciding.
- **Project proposal review includes document paragraphs**, using the shared Core passage helper around
  the finding's words. `projects actions list`, its MCP counterpart and key-document review now show this
  context; `--brief` or zero before/after counts still omit it. The guides also explain oversized evidence
  and accepting unchanged findings from a partly stale batch.

## 0.81.0 — 20.10.2026

### Fixed

- **The `person-brief` and `decision-trail` scenario titles start with a capital**, like every other scenario:
  "One person across every tool", "What did we decide about X, across every source". tg, max, zm and drive list
  them under "Works with" from the same text in cli-core 0.370.0, and memo's tests hold its files to it.

## 0.80.0 — 20.10.2026

### Fixed

- **`memo projects evidence` reads a large document once**, not once per search that matches it: a 95 KB document
  matched by five searches charged about 476 KB of the read budget. Needs `@wirecat/cli-core` 0.369.0.

## 0.79.0 — 20.10.2026

### Added

- **`memo projects evidence` gives a document hit the paragraphs around it** and lists a document too large to
  read under `oversized` (text: "too large to read here"), with its reference to open by `memo notes show`.

### Fixed

- **`memo projects evidence` no longer stalls on large documents.** A large document no longer leaves its search
  read-limited, with every `--cursor` continuation retrying the same page and charging the read budget again. Needs `@wirecat/cli-core` 0.367.0.
- **`memo projects actions confirm` accepts the findings whose own cited text is unchanged**, even when another
  finding in the batch cites a changed text; before, the whole batch had to be staged again.
- Guides describe incomplete search results and local record/file export effects without promising
  complete retrieval or unchanged files.
- Guides explain gathering project evidence, reviewing proposed facts and follow-ups, and the
  `agent_decisions` setting, with the separate review path for meeting transcript findings.

## 0.78.0 — 19.10.2026

### Fixed

- **A proposed findings batch whose cited text changed can be rejected** with `memo projects actions reject`; before,
  it could be neither confirmed nor rejected and stayed in the list. Needs `@wirecat/cli-core` 0.365.0.

### Added

- **`memo projects actions` — an agent's proposals for a project, with the evidence to decide them.** `add` stages
  cited facts and follow-ups (references and fingerprints from `projects evidence`; a changed text refuses as
  stale). `list` pages through suggested key documents and findings batches, each cited text shown with whether it
  changed, the text and the messages around it (`--brief` drops them, `--before-n`/`--after-n`). `confirm` creates
  the named findings or confirms a key document, `reject` turns them down. An agent in your terminal, or over MCP
  (`project_actions_*`), decides for you only with `--reason`, kept with the decision; set `agent_decisions: false`
  in the config to keep every decision yours. `projects key-documents list` items carry their `id`. Needs
  `@wirecat/cli-core` 0.363.0.

## 0.77.0 — 19.10.2026

### Added

- **Repeat a project-evidence time window** with `--before-time` (MCP `before_time`), an ISO timestamp with a UTC
  offset used as the exclusive end. Days back are counted from that instant; explicit start dates also
  keep that end. Text output prints the exact cutoff. Reusing a cutoff does not freeze archive contents,
  registered aliases or account scope.

### Fixed

- **Project evidence documentation** distinguishes local search-index catch-up from creating facts,
  tasks or project links; it no longer claims that every evidence call writes nothing.

## 0.76.0 — 19.10.2026

### Added

- **Project evidence includes stored meeting transcripts** when `--source` selects a meeting account,
  its recorded profile or `all`. CLI and MCP return cited transcript cue references dated by the meeting
  start. Superseded/deleted transcripts stay out; missing or pending indexes remain visible. This reads
  existing indexed text and does not fetch recordings or confirm project membership.
- **Shared SDK update:** pins Core 0.358.0 for transcript context reads, retaining Base 0.47.1.
  The store schema and compatibility boundary are unchanged. Intervening messenger chat-membership
  contract changes require no Memo adapter changes; shared consumer compatibility remains checked.

### Fixed

- **A failed timer run no longer keeps its error text in `last.json`** (privacy). That text can name a folder, a
  sender or a subject, and it reached the file, the "scheduled sync failing" line and `memo auto status`. They now
  keep the error code, its reason id and the kind of source (`notes: configuration_error (folder.unbound)`); the
  full message stays on stderr and in the timer's journal, which `memo auto status` names (`log`).
- **A failing source in `memo sync --json` names its reason id** (`failed[].reason_id`, additive), the fixed id
  that `last.json` and `memo auto status` now show beside the error code, as a run that stopped already did.

## 0.75.0 — 19.10.2026

### Added

- **`memo projects evidence` names the other projects, tags and topics its texts mention** (`mentions`, and an
  "also names" line in the text): words found in the excerpts and their context, each cited, never membership. A
  mail hit now shows the emails before and after it in its thread as context.

## 0.74.0 — 19.10.2026

### Added

- **`memo projects evidence` indexes new mail and imported documents for search before it reads**, so a store
  just synced no longer misses them; `--no-catch-up` (MCP `catch_up: false`) reads the index as it is. The
  project's key is searched too, and `--alias` (MCP `alias`) adds more names. The text output says when the index
  could not be brought up to date. `--since-time` also takes a start date (`2026-09-01`); a continued run keeps its end. Each message hit shows the messages next to it in its
  chat as context (`--before-n`, `--after-n`, default 2, MCP `before_n`/`after_n`), never as more hits.

## 0.73.0 — 19.10.2026

### Changed — may break callers

- **`npm install -g` installs the agent skill only when asked.** It wrote the skill into `~/.claude/skills` and
  `~/.agents/skills` by default, and npm hides a lifecycle script's output, so nobody was told. Now
  `MEMO_INSTALL_AGENT=all` (or an agent's name) installs it at install time; otherwise run
  `memo skill install --for all`.
- **`memo commands` without `--json` prints the commands as text, by section** (Read, Write, Organise, Automate,
  Set up), one line each with `(writes)` on a command that changes something, instead of the JSON document. A
  path lists one group: `memo commands mail rules`. `memo commands --json` is unchanged, contract 4.
- **A bare `memo`, or a group without its command (`memo tags`), exits 2 instead of 1**, as the other WireCat tools
  do: it prints the first screen or the group's help, and a missing command is a usage mistake.
- **Adopt Core 0.348.0 and Base 0.47.0**, which move together: a next step in `--json` output may carry `line`, the
  whole command to type. Core 0.348.0 changes no store schema from the 0.347.0 tg and max pin. An SDK consumer that
  pins Core or Base beside memo moves with them.

### Added

- **`memo projects evidence <project> --source <accounts|all>` and MCP `project_evidence`: cited references about a
  project** from stored messages, mail and imported notes folders. An existing project brings its name and aliases;
  each name, `--context-query` and `--contact` is its own literal search, and the hits are joined, each with the
  searches that found it. `--since-time` takes days back (default `60d`). An item found only through a person's
  name is marked `person-only`. A source that failed or has no reader yet (your own notes, meetings) is listed,
  never read as empty, and so is one whose new text still waits for the search index. `--limit` and `--max-pages`
  bound a run, and `--cursor` continues a stopped one with the same window. Nothing is written.

### Fixed

- **`--help` works on the 13 commands that take a query**: `notes list`, `folders list`, `tags list`, `tasks list`,
  `tasks agenda`, `projects meetings list`, `relationships list`, `vocabulary list`, `memories list`, `facts list`,
  `meetings actions list`, `actions list` and `agents log` exited 2 on `--help` as an unknown option (Core 0.347.0). A test now runs `--help`
  on every command.
- **A search that skips meaning for a missing model names the tools that download it** (tg, max or wa), from Core
  itself; memo no longer rewrites a `tg models text download` hint it was handed.
- **`memo commands | head` no longer crashes** with an unhandled `EPIPE` when the reader stops early; memo ignores
  the closed pipe, as the tools built on Core do.

## 0.72.0 — 18.10.2026

### Changed — may break callers

- **`memo --help` and a bare `memo` show a short first screen instead of every command**: what memo is for, eight
  things it does, the other WireCat tools, and where to go next (`memo commands`, `memo guide`, `memo help options`,
  `memo skill show`). A script that read a command or an option from the root help reads `memo --help-all`, which
  prints the old help, or `memo help options`.
- **A command's `--help` ends with Returns, Next usually and Example** in place of its Examples block, worked out
  from the command's definition. `docs/commands.md` shows the same lines.
- **A list command refuses an unknown `--option` before it reads anything**, with commander's message
  (`unknown option '--project'`). `memo tasks list --project HRB` used to answer with a pointer to `project:HRB`.

### Added

- **`memo guide [name]`: scenarios, the commands for a common task in order and why each**, with `--json` for agents.
  `person-brief` gathers one person across tg, MAX, mail, notes, meetings and Drive before a call;
  `decision-trail` finds what was decided about a topic across every source; `start-the-day`, `prepare-meeting` and
  `set-up` stay within memo. Every memo step is checked against the command tree in CI.

### Security

- **`MEMO_READ_ONLY=1` refuses every change with `permission_error` (exit 5)** before the command runs: writes to
  the store and your files, mail trash and restore, the timer, the skill files, `upgrade` and `ask --allow-remote`.
  Reads and `memo sync` still run, and so do `tasks plan` and `tasks link`, which cli-core marks as safe for a
  scheduled agent. `memo mcp` leaves its writing tools out under the lock.

## 0.71.0 — 18.10.2026

### Added

- MCP tools `meeting_actions_add`, `meeting_actions_show` and `meeting_actions_list` stage and inspect
  cited meeting follow-ups for owner review. Exact retries reuse their batch; no confirmation tool is exposed.
- `memo projects context` and MCP `project_context` bring pending key documents, relationships, facts and
  meeting findings together, alongside open numbered tasks. Bounded previews report continuation and source scope.

## 0.70.0 — 18.10.2026

### Changed — may break callers

- **`memo sync --ignore` leaves a file or folder alone for that run.** Notes already imported from it stay in Memo;
  before, the run removed them and the next run imported them again. `notes.ignore` in the config still removes them.

### Fixed

- Project context, key-document commands and search key-document ordering accept an exact project name or alias,
  as meeting searches do. Ambiguous names list candidates; numeric IDs, `project:<id>` and keys still work.
- **`memo sync` reports the files it could not read on every run, also in the text report.** Each folder line counts
  them (`1 not read`) and a line names each file and why, such as a file over 50 MiB or an `.xls`. Before, only the
  first run's `--json` listed them, and the count of notes included them.
- **A notes folder that is gone is a normal error**, `not_found` with the way to fix it, not "this is a bug (ENOENT)".
  `memo doctor` names the same fix in place of a bare `memo folders`.
- `memo notes show` names a link that leads nowhere by its text, in place of an empty entry after a comma.
- The hint for search by meaning gives a command that works without installing tg:
  `npx -y @wirecat/tg-cli local models text download e5-small`.
- The docs: `.doc` files are read and need nothing extra (PDF and Word readers come with Memo); install leads with
  `memo skill install --for all` and explains npm 12's "install scripts blocked"; Himalaya 2.x and its config file;
  the cache folder and `MEMO_AUTO`; plain `memo tasks list` leaves out project tasks; tg and max commands show a
  profile; the README example is real output.

## 0.69.0 — 18.10.2026

### Added

- Prepare a cited packet of stored series history with `memo meetings prepare` or the MCP tool `meeting_prepare`.
  It includes linked people and projects, accepted facts, owner notes and source tasks. You can explicitly add
  a stored messenger profile or mailbox and a literal word query. Memo reports missing history, bounded output
  and continuation cursors; it does not contact a provider or verify the next meeting time.

### Changed — may break callers

- **Commands with no text view of their own print plain lines in place of JSON when `--json` is not given:** one line
  per record for a list (`organizations list`, `projects list`, `reminders list`, `tasks list`…) and `field: value`
  lines for one record (`projects add`, `tasks add`…). A script that read that JSON gets the same data, in the shared
  envelope, with `--json`.

### Fixed

- **A failed mail login no longer holds `memo sync` for a minute.** A read that fails is tried again after 15 s, and
  a refused login or keyring was too, twice per account; with two accounts that took 60 s. It now fails at once.
  A missing himalaya says it is not installed or not on PATH, not `failed (ENOENT): no error text`.
- The README and the installation page give the sizes: the search model is about 135 MB and the install about
  250 MB. The Windows steps say Windows is not tested yet.

## 0.68.0 — 18.10.2026

### Fixed

- **Tasks and reminders work in a store that holds only notes.** A notes folder is an account: `--account` and
  `--source` take it as `notes:<number>` (the `folder_id` search gives) or as the `folder:<id>` Memo's own errors
  show, and `--source notes` names your folder when you have one. Every spelling was refused before, so a task
  could not be made from a note and a reminder needed a mail account. `memo tasks add document:<id>` takes the
  file's folder as its account without `--account`.
- `memo tasks list` and `memo reminders list` without `--source` read every stored account and name them in
  `meta.accounts`, as a search does; they refused before. `memo tasks agenda` still reads one account; the README
  said it covered every account.
- A reminder for a task in a project is refused with the reason: such a task belongs to no account. The message
  said the task was not open. A read given `--account provider:account` is told to use `--source` with that value.

## 0.67.0 — 18.10.2026

### Fixed

- **A store with notes only gets a plain answer from `tasks` and `reminders`.** `tasks list`, `tasks agenda`,
  `reminders list` and `reminders poll` offered a `folder:<id>` value that then failed, and `notes:1` failed with
  "the account is not in the local store". They now list only the accounts that can hold tasks, and with none say
  that a task from a message, email or note, and a reminder, need a tg, max or mail account, and that a project's
  tasks need none.
- `memo search notes` labels a note found by its title as a plain hit, not "(by meaning)".
- `memo tasks list --project SYNT` says to write `memo tasks list project:SYNT`; it failed with a bare syntax error.
- `memo tasks add --project` with an unknown project names `memo projects add`; it pointed to a `vocabulary
  resolve` command that does not exist.
- The README names `vocabulary show` and `vocabulary check`, and the MCP tool `vocabulary_check`; it named
  `resolve` and `preflight`, which do not exist. It links memo's own pages on wirecat.dev, says that search by
  meaning needs tg-cli or max-cli to download the model, and that macOS and Windows are not tested yet.

### Added

- `search meetings` and `meetings passage`, with MCP `search_meetings` and `meeting_passage`, read
  archived meeting evidence through shared Core readers. Explicit source selection, project/label
  aliases, dates and scoped cursors keep searches bounded; MCP also has label, participant, event and
  series selectors. Passages
  include fingerprints for reviewed findings; unknown speakers and archive coverage stay explicit.
  `search all` continues to combine messages, mail and notes.

## 0.66.0 — 18.10.2026

### Added

- `vocabulary inspect <source> <survivor>` and MCP `vocabulary_inspect` preview two explicit tag IDs
  before consolidation. They report assignments, overlaps, aliases, automatic claims and links,
  with bounded samples and a fingerprint of the inspected state. A current unfiltered vocabulary
  fingerprint is required. They merge nothing; coverage names the four inspected dependency tables.

### Fixed

- The README, the MCP page and `memo mcp --help` say what an MCP app can read: your stored messages, mail and notes,
  and a person's context. They said search and context were not served over MCP. Only `memories_add`, `facts_add`
  and `actions_add` write, and what they add waits for you.
- The security page says mail sync looks up sender domain ages by itself, at most once a day, and that Memo asks npm
  once a day for a newer version. It said only `memo mail inspect --domain-age` asked domain registries.

## 0.65.2 — 18.10.2026

### Changed — may break scripts

- **memo's MCP tools name accounts as the CLI does.** `actions_add` takes `account` as `provider:account`
  (`telegram:1`) in place of `provider` and a bare `account`; `search_mail` takes `source` (`email:work`, several
  separated by commas) in place of `account`; `person_context` takes `source` (`telegram:1`) in place of `account`.
  An old argument is refused, as any argument a tool does not take.

## 0.65.1 — 18.10.2026

### Documentation

- The command reference lists `--plain-order` on `memo search mail` and `memo search all`; 0.65.0 shipped it
  without, as the reference had not been generated again.
- The command reference's opening says reads take `--source` and writes take `--account provider:account`; it
  still named `--provider` and `--account`.

## 0.65.0 — 18.10.2026

### Fixed

- **A sync step that fails unexpectedly says why.** The timer's log showed only "the command failed; this is a bug";
  it now adds the error's first line, such as `TypeError: fetch failed`, so a dropped network can be told from a
  real fault. `--debug` still shows the whole message.
- **`memo search mail` fills a page past mail it moves down.** It reads 20 more results than asked, so mail from
  senders with signs of fraud gives its place to the next best result instead of only moving to the end.

## 0.64.0 — 18.10.2026

### Changed — may change search results

- **Mail from senders with signs of fraud comes after the rest of the page** in `memo search mail` and
  `memo search all`: a sender whose fraud signals add up to 3 or more, such as a brand name from another domain or a
  domain under 180 days old. Your own are never moved: a domain you wrote to anyone at, your mailbox's domain, a
  sender a protect rule keeps. `--plain-order` keeps the plain order, to find such mail. The sync log says how many
  senders are ranked lower.

### Changed

- **A read names its accounts with `--source`**, as `memo mentions` and `memo search mail` already do:
  `provider:account` (`telegram:1`, `email:personal`), a provider, a kind or `group:<name>`. `memo tasks list`,
  `memo reminders list`, `memo tags list` and `memo ask` read every account named and say which in
  `meta.accounts`. A read bound to one account (`tasks agenda|show`, `stats tasks show`, `relationships suggest`,
  `context`, `meetings actions list|show`, `projects meetings list`) takes a `--source` that names exactly one.
  `memo sync --source email:work,email:personal` names mailboxes.
- **A write names the one account it acts as with `--account provider:account`**: `memo tasks add|close|plan|link`,
  `memo reminders add|poll|ack|cancel|update`, `memo tags add|remove`, `memo notes add --meeting`,
  `memo actions add`, `memo meetings actions add|confirm|reject`, `memo projects meetings link`. A bare
  `--account 1` without `--provider` is refused. No account, or one that names several, is an error listing the
  choices.

### Deprecated

- `--provider` with a bare `--account` keeps working for one release and prints the new spelling on stderr:
  `--source telegram:1` on a read, `--account telegram:1` on a write. Giving both spellings is an error.
  `memo context --account 1` is `--source telegram:1`; `memo sync --account work` is `--source email:work`.

### Changed — may break scripts

- The `search all` step that lists a hit's tasks carries `args.source` (`telegram:1`) instead of `args.provider`
  and `args.account`; `meetings actions list` and `projects meetings list` name `source` in their page args too.
- `memo ask` takes `--source notes` where it took `--provider notes`.

## 0.63.0 — 17.10.2026

### Changed — may change scores and rules

- **A new domain counts most, and a failed DMARC check only beside another sign of fraud.** `young_domain` adds 5
  (was 3); `dmarc_fail` counts only with `brand_spoof`, `young_domain` or `disposable_domain`, since alone it
  more often marks a real sender's broken setup or a forwarded mail; `reply_to_elsewhere` adds 1 (was 2), as many
  companies answer from a help-desk domain. A `score:` rule can match other senders than before. Every sender is
  scored again on the next sync.
- **Each sync's sender scoring looks up the domain ages it lacks**, for senders you never wrote to and heard from in
  the last two years, so `young_domain` works without running `memo mail inspect --domain-age`. Each lookup tells
  that domain's registry its name.

### Fixed

- **A domain registered again after an email came no longer makes that email's sender young.** The registry gives
  the newest registration, so an old sender whose domain lapsed and was taken by someone else looked new.

## 0.62.0 — 17.10.2026

### Changed

- **cli-core 0.323.0.** An address keeps its city in its value, so the same street in two cities is two places; a
  word of a contact's name counts alone only as a first name or a surname, so a contact named like a company no
  longer turns ordinary words into names; the owner's own accounts belong to the owner. After the upgrade,
  `tg <profile> mentions rebuild person-name place` reads the old texts again.
- memo reads `--source` lists and mention queries through cli-core instead of its own copies.

## 0.61.0 — 17.10.2026

The same code as 0.60.0, published again under a new number. Nothing changed for callers.

## 0.60.0 — 17.10.2026

### Fixed

- **The sync timer no longer stops when a sync takes longer than its interval.** The interval counted from when a
  sync started, so a 6-minute sync on a 5-minute timer left no next run. It now counts from when a sync ends.
  The first sync after updating rewrites the timer.
- **`memo tasks show HRB-12` shows a project's task without `--provider` and `--account`** (cli-core 0.320.0),
  with its evidence links — a task made from reviewed meeting findings, for example. A task of a messenger account
  still needs its account; a bare number is never taken for a project task.
- **memo's MCP tools refuse an argument they do not take**, as every other CLI's tools do: all 22 answer
  `validation_error` (reason `input.invalid`, `param` naming the argument) instead of dropping it, so a misspelled
  filter no longer runs unfiltered. Their advertised input schemas now say `additionalProperties: false`.
- **`memo mcp` is listed as `lifetime: "persistent"`** in `memo commands --json`, like `tg mcp` and `max mcp`: it
  serves until stdin closes. No other command's entry changes.

### Documentation

- **How to read a sender score** in the mail guide: which signals point at a forged sender and which bills share
  with newsletters, and why a platform passing on other names is not a spoof.

### Changed — may break scripts

- **cli-core 0.320.0, the version tg and max pin.** `tasks plan --assignee` names who does a task. Tasks open
  only for questions asked of the owner: every unanswered one in a one-to-one chat, in a group only a reply to the
  owner or a mention.
- **`memo mentions` names what it reads with `--source`, as every WireCat tool does.** `memo mentions list kind:phone
  --source email:personal,email:work`; `--source mail` reads every mailbox and the answer lists them in
  `meta.accounts`; `notes`, `documents` and `group:<name>` work too. The kind argument (`email`, `note`, `document`)
  and `--account` are gone: `memo mentions list email --account personal` is now `--source email:personal`.
  `show`, `confirm` and `reject` take `--source email:<account>` for a mail mention.

### Deprecated

- **`memo search mail --account <account>` is now `--source email:<account>`**, which also takes several mailboxes
  and groups. `--account` still works in this version and prints the new spelling.

## 0.59.0 — 17.10.2026

### Added

- **Mail stored before memo kept Reply-To and Gmail's SPF, DKIM and DMARC verdicts gets them.** Each sync reads
  the header lines of up to 2,000 such emails from Gmail, newest first, until none is left; the text is not read
  again. The sender score then sees these signals on all mail, not only on mail stored since memo began keeping them.

## 0.58.0 — 17.10.2026

### Added

- `memo meetings actions` stages cited meeting facts and project tasks for owner review. Confirmation creates selected records atomically, keeps review receipts and prevents exact retries from duplicating accepted work. Missing dates and assignees stay unknown; stale evidence is refused.
- **Every sender gets its spam score in the store, and search shows it.** Each sync scores the account's senders
  from the stored mail, at most once a day, as `memo mail inspect` scores a group; a hit from a scored sender
  carries `sender_score` (score and signals) in `--json`. Results are not reordered by it. cli-core 0.311.0 (store version 19).
- **`memo mentions list|show|confirm|reject`: phones, e-mail addresses, links, documents, names and street addresses in
  documents, notes and mail.** `memo mentions list note kind:phone`; mail is read only from the accounts named by
  `--account` (repeatable), never every mailbox by default. `show` names the senders of received mail that may own a
  phone or an address (`candidates`), offered and never linked.

## 0.57.0 — 17.10.2026

### Fixed

- **The sender score counts a failed DMARC check only on mail from 2022 on.** Before that, senders often published a
  policy their own mail did not meet yet, so an early failure is no sign of fraud.
- **A broken config file is reported in one line** (cli-core 0.304.0, 0.307.0): the first bad key, a fixed reason
  and a count of the rest, never a value — `config.json: updateCheck is an unknown setting; rename it to
  update_check (and 1 more problem)`. An old camelCase key is named with its new name first.
- **`memo mail status` finishes on a large mailbox** (cli-core 0.307.0): the per-folder count read every email
  again for each one, minutes on a few hundred thousand emails; now seconds.

### Changed — may break scripts

- **The daily "a newer memo exists" line now comes from cli-core, shared with tg and max, and is quieter.** It
  needs stdout to be a terminal as well as stderr: `memo … | less` no longer shows it. Any quiet option written
  with `=` silences it (`--help=…`, `--quiet=…`), not only `--json=…`. `MEMO_AUTO` with any value silences it, not
  only `1`. `--json`, `--jsonl` and `--quiet` silence it anywhere in the command, also after `--`. `--jsonl` is new
  among them.
- cli-core 0.307.0.

## 0.56.0 — 17.10.2026

### Fixed

- **The sender score in `memo mail inspect` no longer flags LinkedIn, Coursera, Quora or Dropbox Sign as brand
  spoofs, nor senders whose DMARC failed only because they signed for another domain.** "Google via LinkedIn" from
  LinkedIn's own domain is LinkedIn passing a page on; Coursera and Quora name courses and spaces after companies;
  hellosign, dropboxmail, onedrive and microsoftadvertising are the brands' own domains. A DMARC failure counts only
  without a valid DKIM signature, and not for a sender that passes DMARC on other mail.

### Documentation

- Distinguish read-only imports from explicit Gmail cleanup and restore throughout the guides and README.

## 0.55.0 — 17.10.2026

### Fixed

- **Import, `memo mail inspect` and `memo mail rules apply` find Gmail's All Mail by its role**, as cleanup already
  did: Gmail names it in the account's language (`[Gmail]/Todos` in Spanish), so an account not in English failed
  with a missing folder. A `folders` list in the config still wins.

## 0.54.0 — 16.10.2026

### Changed — may break scripts

- **`memo search notes` takes the note's source in the query: `'budget source:internal'`, not `--type internal`.**
  `source:file` keeps the notes from folders. `--type` is gone, with no alias. The field is named `source:` as in
  `memo notes list` and the note's `source` in `--json`. It works under OR and NOT and in `--filter` too. The
  `--source notes:<folder id>` option still chooses which folders are read. 0.53.0 on npm still has `--type`: it was
  published before this change.
- cli-core 0.303.0.

### Fixed

- **`bin/release` restarts itself once when the release brings a newer `bin/release`**: folding the changelog and
  raising the version both fast-forward `main`, and the shell went on reading the old script from the byte it had
  reached, so the rest of the run was a mix of old and new text. It now starts the new script over with the same
  arguments; a second change during that run stops it with `run it again`. The restart also works when
  `bin/release` was started from another folder by a relative path. Only the repository's own release is affected;
  the published package does not change.

## 0.53.0 — 16.10.2026

### Changed — may break scripts

- **`memo search notes` takes the note type in the query: `'budget type:internal'`, not `--type internal`.**
  `type:file` keeps the notes from folders. `--type` is gone, with no alias. The field works under OR and NOT and
  in `--filter` too.
- cli-core 0.302.0.

### Fixed

- **`memo mail restore` counts the mail it brings back in the store again.** It left the mail marked deleted, so the
  next `memo mail trash` could not see it and picked other mail, and a new protect rule did not apply to it. Restore
  now also counts again a run's mail found back in All Mail, so a run restored by an older memo or by hand in Gmail
  is set right by running restore once more.
- cli-core 0.301.0.

## 0.52.1 — 16.10.2026

### Changed

- **memo starts about a fifth faster after its first run.** It keeps Node's compiled code in a cache, in the
  system's temporary folder (`NODE_COMPILE_CACHE` moves it): `memo --help` went from about 0.70 to 0.54 seconds.
- cli-core 0.299.0.

## 0.52.0 — 16.10.2026

### Added

- **`memo mail trash --since-time <time>` leaves older mail in Gmail, whatever its rule says.** For keeping old
  years while newer junk is cleaned up; such mail is counted as kept `before_since`, and JSON adds `since`.

## 0.51.0 — 16.10.2026

### Fixed

- **`memo mail trash` and `restore` find Gmail's Trash by its role, not its English name.** Gmail names folders in
  the account's language, so in UK English Trash is `[Gmail]/Bin`; every move to `[Gmail]/Trash` failed and nothing
  moved. memo now asks Gmail which folders are All Mail and Trash (RFC 6154 `\All`, `\Trash`).
- **A missing folder is reported as missing, not as Gmail throttling.** Gmail adds `[THROTTLED]` to answers that
  fail for other reasons (`NO [NONEXISTENT] Unknown Mailbox … [THROTTLED]`), so memo said "try again in an hour"
  for a folder that does not exist.

## 0.50.0 — 16.10.2026

### Fixed

- **`memo mail trash` decides from the store and asks Gmail only about the emails it moves.** It re-read every
  header in All Mail first (about 260k emails), which took minutes and twice ran the account into Gmail's IMAP
  throttle before one email moved. Rules and replied-to senders now come from the store (cli-core
  `mail.emailFacts`); the picked emails' labels and stars are read again just before the move, and a batch is
  checked with one `UID SEARCH` instead of one lookup per email.
- **`memo mail restore` brings back a batch Gmail moved without confirming it.** It restored only batches whose
  move was answered OK; a move Gmail made but answered with a throttle could not be undone by memo.

## 0.49.0 — 16.10.2026

### Added

- **`memo messages show` gives each attachment's extracted text**, next to the name the email lists, so a bill's
  amount reads in one call. Each text is cut at the first 4,000 characters; `--full` gives the whole of it. JSON
  adds `text`, `text_chars` and `text_cut` to each attachment, or `extraction` (why there is no text: a scan
  `needs-agent`, `unsupported`, …).

### Fixed

- **`memo search mail` with `mailbox:` or `NOT mailbox:bulk` answers in under a second**: on a 257k-email store
  `London NOT mailbox:bulk` took 67 s and failed with `query.too-large` (cli-core 0.295.0).
- **An email address works unquoted**: `from:alice@example.com`, `to:` and `cc:` failed with
  `query.unsupported-operator`; cli-base 0.40.0 reads `user@host.tld` as one word.

## 0.48.0 — 16.10.2026

### Added

- **`memo mail trash <account>` moves envelope mail to Gmail's Trash**, after deciding each email again with today's
  rules and labels. It keeps mail a protected or keep rule matches, mail from senders you replied to, starred,
  important, sent and labelled mail, and mail under 30 days old. A preview unless `--yes`; a first run moves at most
  100, later runs 5,000; `--yes` needs a store backup under 8 days old (`backups/last.json` beside the store). Every
  moved email's labels go to a restore log first. **`memo mail restore <account> --run <id>`** moves a run back
  within Gmail's 30 days, and **`memo mail runs <account>`** lists runs. `memo doctor` shows the backup, whether a
  Takeout mbox is imported, and runs that stopped or are close to their 30 days.

### Fixed

- **Release scripts report observed lock holders separately from stale release labels.** Shared
  diagnostics no longer attribute a live lock to a previous run; wait for the holders to finish, then
  retry.

## 0.47.0 — 16.10.2026

### Added

- **`memo search mail` finds a letter by its whole link and by a part of a link**, also a tracking link that mail
  keeps only as its site: `url:"https://news.example.com/click?id=1"`, `link:"/click?id=1"`. Quote both: `?`, `/`
  and `=` mean something else in a query. cli-core 0.294.0.

## 0.46.0 — 16.10.2026

### Changed

- **`memo mail probe` is now `memo mail inspect`.** Same command and output; `inspect` is the shared word for
  looking at a source before taking anything from it, as `tg chats inspect` looks at a link before joining.
- **`memo search notes` names folders with `--source`, as `tg search notes` does.** `--source notes:<folder id>`
  (the id a hit shows), `notes:internal` for notes written in Memo, comma-separated for more. `--folder` is gone,
  and a folder path is no longer accepted: use its id from `memo folders list`. An entry naming no notes account
  is reported on stderr and the rest is still searched.
- **`memo search memories` narrows by scope in the query: `memo search memories friday scope:work`.** `--scope` is
  gone. The query is words and at most one `scope:`, joined by AND; `OR`, `NOT` and other fields are refused
  rather than filtered after the search. The MCP `search memories` tool lost its `scope` argument the same way.

### Fixed

- **A failed mail listing says why.** himalaya 2.2 prints its error on stdout, so memo reported "no error text"; the
  failed line now carries himalaya's `Error:` report, and a `[THROTTLED]` in it is `mail.throttled`.
- **A read that fails once is tried again** after 15 s (`MEMO_HIMALAYA_RETRY_MS`); IMAP commands that write are never
  repeated.

## 0.45.0 — 16.10.2026

### Исправлено

- **The `memo auto` timer follows only a global install of memo.** A memo run from another tool's own
  `node_modules` (a docs build, a test tool) used to point the timer at that folder, and once the folder was
  deleted every timer run failed with `MODULE_NOT_FOUND`. A checkout and `npx` were already ignored.

## 0.44.0 — 15.10.2026

### Исправлено

- **`memo sync --retry-attachments` reads again only the emails it has to.** It finds the stored emails whose
  attachment a missing reader left unread (`engine-missing`), looks them up by Gmail id and reads those, up to
  `--limit`. Before, it listed the whole window and re-read its newest `--limit` emails, so older unread
  attachments were never reached. `--json` reports `retried: {emails, extracted, still_failed, missing}`. Mail
  read from an mbox file or plain IMAP has no Gmail id, so the flag refuses there.
- cli-core 0.293.0 and cli-base 0.35.0.

## 0.43.0 — 15.10.2026

### Изменено

- **`--json=<field>` is checked on memo's own lists too.** `tags list`, `vocabulary list`, `actions list`,
  `agents log`, `projects meetings list` and `folders list` refuse a field their rows lack
  (`output.unknown-field`, with the fields they have) instead of printing empty rows; known fields project as
  before.
- cli-core 0.292.0.

## 0.42.0 — 15.10.2026

### Документация

- Correct the Takeout resume guidance: completed, unchanged snapshots are skipped; incomplete imports scan again. Replace the retired `tasks.id` search projection example with supported compact hit fields.

### Добавлено

- **Mail rules match more than the sender.** `memo mail rules add|remove --filter <query>` takes `subject:<word>`
  (or bare words), `older:<n>d`, `larger:<size>`, `has:attachment`, `label:<name>`, `is:unread`, `is:bulk` and
  `score:<n>`; `--kind social|newsletters|developer|shopping|alerts` matches a built-in kind of mail. Every
  condition given must hold. `memo mail probe` ends with how much mail each kind would match.
- **`--do protect`** keeps mail whole and out of every cleanup, whatever else matches; `memo mail rules list
  --filter is:protected` lists those rules, and protected rules list first as `PROTECTED`. `rules apply` reports
  `protected_kept`.
- **`--do <action>,tag:<name>`** tags the mail a rule matches; a sync tags what it stores, `rules apply` tags what
  is stored (`tagged`).
- **`memo mail rules import-filters <account> <Filters.json>`** proposes rules from a Takeout export's Gmail
  filters; `--yes` adds them. It reads Takeout's `{"filter": [{query, labelsToAdd, labelsToRemove}]}`: each
  `from:` or `to:` term becomes its own rule, and words become subject words.
- **`--filter` takes `from:<address|domain|word>` and `to:<address>`**: `from:sample` matches a sender whose
  address or display name contains the word.
- **Two more spam signals in the sender score:** `never_opened` (+2, you opened none of a sender's mail) and
  `dkim_not_passed` (+2, Gmail's DKIM check did not pass on most of it)
  ([cli-testing](https://github.com/WireCatLabs/cli-testing/tree/main/performance/mail/spam-scoring)).

### Изменено — может затронуть скрипты

- `memo mail rules add --do` takes a comma list: one of `skip`, `envelope`, `keep`, `protect`, plus any
  `tag:<name>`. A rules file may hold the new conditions; `rules remove` drops the rule with exactly the
  conditions given.
- **Mail sent to many is marked**: import puts mail with a List-Id, List-Unsubscribe or `Precedence: bulk`
  header in the mailbox `memo:bulk` (accounts with rules), so `memo search mail '… NOT mailbox:bulk'`
  leaves newsletters out. Search keeps them by default: bills and bookings carry the same headers.

### Исправлено

- **A rule's tag never fails the mail sync.** A Gmail label the store refused as too similar to an existing label
  stopped the whole account's sync ("similar labels exist"). memo now puts the mail under the label the store
  points to and rewrites the rule to it (`tags_reused`), or skips a tag with nothing to reuse (`tags_skipped`,
  also shown by `memo mail rules list`). `memo mail rules import-filters` maps Gmail labels to existing memo labels
  before proposing, and lists the mapping. Labels stored with capitals or a slash need cli-core's matching fix.

- **An HTML page sent as the text part is read as text.** Some senders (airline itineraries among them) put HTML
  in text/plain, and memo stored the markup. The next `memo sync` converts mail already stored, once per account.
- HTML comments no longer leave their text and a stray `-->` in an email's text.
- `memo search mail --account` takes the account's name, as the rules and `memo mail status` do, or its address.

## 0.41.0 — 15.10.2026

### Изменено — может затронуть скрипты

- **cli-core 0.288.0 and cli-base 0.33.0**, with no old names kept. Shared commands take the new names:
  `tasks agenda --due` → `--due-within`; `tasks agenda --tag`, `--category` and `--claimed` are gone — write the
  query fields `tag:`, `category:` and `claimed:` instead.
- `memo tasks add --attach <task>` → `--into <id>`, the name cli-core's `tasks add` and `tasks merge` use.
- `memo tags add|remove --chat` shows its value as `<chat>`, as every other `--chat` does; it still takes the
  chat's exact id.

## 0.40.0 — 15.10.2026

### Изменено — может затронуть скрипты

- **cli-core 0.287.0 and cli-base 0.32.0**, with no old names kept. Shared commands take the new option names:
  `tasks plan --check` → `--remind-time`; `tasks agenda --within` takes a `<duration>`. Every `--json` answer is an
  envelope (`item`, or `items` and `page`).
- **memo's own option names follow cli-base 0.32.0's vocabulary**: `mail rules add|remove --from` → `--sender`;
  `mail rules add --skip|--envelope|--keep` → one `--do <actions>` (`skip`, `envelope` or `keep`; more than one is
  refused); `tags add|remove --path` → `--subfolder`; `facts add --occurred` → `--occurred-time`.
- The MCP tool `facts_add` takes `occurred_time` instead of `occurredAt`.

## 0.39.0 — 15.10.2026

### Изменено — может затронуть скрипты

- `memo tasks list` answers each task as cli-core's `task` entity, as tg and max do: `kind`, `state`, `key`,
  `title`, `source_message`, `chat`, `account`, `due_at`, `created_at`, `updated_at` and the rest. A task no longer
  carries its message or note preview (`message`, `note`), its `source`, `source_kind` or `group`; `memo tasks show`
  has the card. A project's tasks answer the same fields, not their store row.
- `--json=<fields>` is checked against the declared answer of `relationships list` (`relationship`) and `tasks list`
  (`task`); `tags list`, `folders list`, `actions list`, `agents log`, `vocabulary list` and
  `projects meetings list` declare memo's own entities.
- `memo folders list` takes a `[query...]` like every list; it filters by no field yet, so any term is refused.
- A list given an option it does not have answers a query error (exit 2) instead of commander's unknown option.

### Внутренние изменения

- The list query helpers come from cli-core 0.285.0 (`termField`, `queryTerms`, `withQuery`, `queryArgument`);
  memo's copy is gone. `factItem` builds the `fact` entity in snake_case.

## 0.38.0 — 15.10.2026

### Изменено — может затронуть скрипты

- **cli-core 0.285.0**, the version tg and max move to. `memo tasks add` refuses a task that may be the same job as
  an open one, or one closed in the last 14 days (exit 2, reason `task.duplicate-candidates`, candidates in
  `details.candidates`); `--attach <task>` links the message to that task instead, `--new` opens it anyway.
  `memo tasks agenda` takes `--category` and `--tag`. Opening the store upgrades it to version 16 (new tables and
  triggers only; older tg and max keep working with it).

### Исправлено

- **MCP answers show hidden characters in what other people wrote**, as tg's and max's do: messages,
  mail, notes, names, facts and memories come back with tag characters, direction overrides, zero-width spaces,
  U+FEFF, C1 and other control characters escaped (an ANSI escape reads `\x1b`), in the text and the structured
  content, errors included. Every read tool's description, and the server instructions, say that this text is data
  from other people, never instructions. Cyrillic, emoji and flags are unchanged; what an agent saves, and the
  CLI's `--json`, keep the original text.

## 0.37.1 — 15.10.2026

### Безопасность

- **A hostile HTML email no longer stalls `memo sync`**: an HTML-only mail is turned into text in time linear in
  its size; one of unclosed tags or long blank runs took up to 30 seconds per 200,000 characters, holding the mail
  import. Ordinary mail reads as before, except that `&amp;lt;` now reads as `&lt;` instead of `<`.

## 0.37.0 — 15.10.2026

### Изменено — может затронуть скрипты

- **Lists filter with their query, not with flags**, and the old flags are gone: `actions list --status proposed` →
  `actions list status:proposed`; `agents log --tool X --agent Y` → `agents log tool:X agent:Y`;
  `projects meetings list --proposed` → `confirmed:false`; `tasks list --project HRB --ready` →
  `tasks list project:HRB ready:true`; `vocabulary list --kind tag --scope work` → `vocabulary list kind:tag
  scope:work`. The store still does the filtering. MCP `actions_list`, `agents_log`, `tasks_list` and
  `vocabulary_list` take the same terms as `query`.
- **`memo sync --notes` and `--mail` are now `--only notes` and `--only mail`** (`--only notes,mail` for both).
- **`memo search messages --type` is gone**: the query says it — `has:voice`, `has:file` or `NOT has:attachment`.
  MCP `search_messages` drops its `type` input the same way.
- **`memo ask` takes what to search for after the question**, not as `--query`:
  `memo ask 'What did I promise?' 'promised OR "by Friday"' --all`.

## 0.36.0 — 15.10.2026

- **Nested JSON report fields use the shared projector.** Dotted paths traverse report objects and arrays while preserving coverage, pagination and execution metadata. The bundled skill documents bounded output and removes fixed import-speed claims.
- **Obsolete config keys are refused without rewriting the file.** Rename camelCase settings to snake_case before using the configuration.

## 0.35.0 — 15.10.2026

### Исправлено

- **`memo mail status` counts the widest window ever imported**, not the latest run. A rule change, a new
  UIDVALIDITY or `--rescan` starts the resume point over, and the timer's 30-day run then made status say
  "complete" while most of a mailbox was still unread. The widest window and the last run are now shown apart;
  `--json` gains `folders[].since` and `folders[].last`.

## 0.34.0 — 15.10.2026

### Изменено — может затронуть скрипты

- **Option names follow the shared vocabulary of cli-base 0.31.1**, with no old names kept:
  `notes add --about` → `--subject`; `notes add|edit --file` → `--text-file`; `notes export --to` → `--output-dir`;
  `ask --model` → `--analyze`; `mail probe --limit-groups` → `--limit`; `vocabulary create`, `vocabulary aliases
  add|remove` and `projects meetings link --expected` → `--fingerprint`; `projects meetings link --provenance` →
  `--reason`.
- **The config file is read only in snake_case**: a camelCase setting such as `mail.maxBodyChars` or a rule's
  `decidedAt` is refused, and old folders are no longer moved at start (cli-core 0.283.0).
- `@wirecat/cli-base` 0.31.1, `@wirecat/cli-core` 0.283.0.

## 0.33.0 — 15.10.2026

### Изменено — может затронуть скрипты

- **`facts list` and `memories list` take a query, not filter flags**: `memo facts list kind:decision
  status:proposed project:HRB`, `memo memories list scope:work subject:"person:42"`. The store filters by the
  terms, joined by AND; `--type`, `--status`, `--kind`, `--scope`, `--project` and `--subject` are unknown options
  there now. MCP `facts_list` and `memories_list` take one `query` string instead of those arguments.
- **Facts and memories answer cli-core's `fact` and `memory` entities**: a fact's `type`, `statement` and `source`
  are `kind`, `text` and `origin`; a memory's `body` is `text`. `facts add` takes `--kind` instead of `--type`,
  and MCP `facts_add` takes `kind` and `text` instead of `type` and `statement`. `--json=<field>` on facts and
  memories refuses a field the entity lacks.
- **`tags list` and `relationships list` take a query**: `memo tags list tag:follow-up type:note`, `memo
  relationships list 'about:"project:1"'` instead of `--tag`, `--type` and `--reference`. `--provider` and
  `--account` stay on `tags list`: they pick the accounts, they do not filter rows.
- **`tasks list` and `notes list` take a query**: `memo tasks list state:done`, `memo tasks list kind:bug --project
  HRB`, `memo notes list source:internal text:budget`, `memo notes list 'about:"telegram:Kai Sample"'` instead of
  `--state`, `--about`, `--source` and `--search`. `about:` stands alone: the notes it finds through links are no
  longer narrowed further. `--project` and `--ready` stay on `tasks list`: they pick which tasks are read. A next
  page of `notes list` carries the query.
- **`notes show`, `notes add` and `notes edit` answer cli-core's `note` entity**: `labels` and `provenance` are
  gone from `notes show` (`tags` keeps the tag names); each of `links` is `{to, target_text, kind, anchor}` and each
  of `backlinks` is `{from, target_text, kind, anchor}`. `--json=<field>` refuses a field a note lacks.
- **`search all` answers cli-core's `hit` items**: `key` is gone (key documents still come first with
  `--project`), and a result's open `tasks` moved into `next`: a `tasks list source:"<ref>"` step for the account
  holding them. The `missing: tasks` entry is gone.
- **`search` over several accounts no longer runs as the first one**: it runs as memo and reads exactly the
  accounts selected. An account error lists the accounts to choose from.
- **cli-core 0.281.0**: a note whose title matches the query ranks first in `search notes` and `search all`, and
  lists `title` in `found_by`.
- **`memo tasks link` is cli-core's, the one tg and max have:** a `task:<id>` target links two project tasks as
  before (`--kind blocked-by`, `follow-up-of` or `related-to`, now `related-to` when not given); a message, chat,
  person or URL target links a messenger account's task to it, with `--provider` and `--account`. The old form
  keeps working: `memo tasks link HRB-2 HRB-1 --kind blocked-by` (a bare id with `blocked-by` or `follow-up-of` is a
  task; with `related-to`, when that task exists — otherwise it is refused with "write task:<id>"). `--json`
  answers `{ item: { relations } }`, the task's relations after the link, where it printed `{ relation, changed }`.
  `tasks unlink` and `tasks relations` are unchanged.

### Добавлено

- **`tasks list source:"<ref>"`** keeps an account's tasks from one message, note or document.

### Добавлено

- **`memo tasks agenda`, `tasks plan`, `tasks show` and `memo stats tasks show`**, the same commands tg and max
  have: cli-core's builders, mounted with `--provider --account`, so memo's agenda reads any messenger account the
  store holds. Without them a command fails and lists the accounts.

## 0.32.0 — 15.10.2026

### Изменено

- **Mail rules live in the store**, beside the mail they decide, instead of `config.json`. `memo mail rules list`
  counts every rule's emails in one query (it took minutes with hundreds of rules), and each envelope email
  remembers the rule that recorded it. The first command that reads rules moves them from the config, checks
  they all arrived, then drops them from it; the old config stays as `config.json.<time>.before-rules-in-store`
  (mode 600) and stderr says so once. A keep rule whose reason says "never remove" becomes protected.

### Добавлено

- **`memo mail rules export <account>`** prints the rules as JSON; **`memo mail rules import <account> <file>`**
  adds them, replacing a rule with the same match.

### Изменено — может затронуть скрипты

- **Every `--json` answer, and every MCP answer, is the standard envelope.** One thing comes in `item`, a list in
  `items` with `page` (`mode`, `limit`, `has_more`, and `next_page` where the command takes `--page`), and each
  answer carries `meta` with its `run_id`. Before, most commands printed the bare record. `commands --json` reports
  contract 4.
- **`--offset` is now `--page`** in `notes list`, `search notes` and `projects meetings list`; MCP `search_notes`
  takes `page`. A list that only grows with `--limit` says `has_more` and names no next page.
- **`search notes`** lists its notes in `items`, not `hits`; why meaning was not searched is in `missing`. Its
  `linked` summary is no longer in JSON or MCP (the text view keeps it): ask `memo context <person>` instead.
- **`search all`** carries the open tasks that point at a hit on that hit, as `tasks`; the accounts read are
  `meta.accounts`, and a resource it could not read is a `meta.issues` entry.
- **`folders list`** puts the folders known only from another computer in the same list, with `path: null`;
  **`tags list`** puts labels on notes, people, projects and folders in the same list as source labels, one row
  per label with its `origin`, instead of a separate `knowledge` list.
- **`search all`, `search messages`, `search mail` and `search notes` answer cli-core's entities**, as tg and max
  do: `search all` items are `hit`s (`excerpt`, `sender_name`, `sender_ref`, no `text` or `from`), `search messages`
  and `search mail` items are the `message.hit` view (`ref`, not `locator`; no whole `text` — `messages show` has
  it). `--json=<field>` refuses a field the entity lacks, and a bare `--json` at a terminal asks which fields.
- **`search notes --tag` is gone**: `tag:work` goes in the query or in `--filter`; MCP `search_notes` takes
  `filter` instead of `tag`.
- **`notes add` and `notes edit`** answer the note itself as `item`, so `--json=id` works; with `--export` the
  file written is the note's `export_path`.
- **Search by meaning, when its model is missing,** says tg or max downloads it, not a `tg` command as memo's
  own.
- **`mail rules remove`** answers the rules left as `rules`; `relationships suggest` answers a list and no
  longer names its scope; `reminders list` and `reminders poll` answer lists.

## 0.31.0 — 14.10.2026

### Добавлено

- **`memo doctor`** says where memo keeps its files and what needs attention, and connects to nothing: the settings
  file, the store and its schema, the notes folders and their ids, the mail accounts and Himalaya's version, the
  search model, the timer (including a program it runs that is gone, and its failing streak) and the agent skill's
  version. Each problem names the command that fixes it; the exit code is 1 while one is left. `--json` answers
  `{item, meta}`.
- **`memo upgrade`** updates memo with the package manager that installed it; `--check` only looks. Once a day memo
  asks npm for a newer version and says so in one stderr line, only to a person at a terminal — never with
  `--json`, in a pipe or on a timer run. `"update_check": false` or `MEMO_NO_UPDATE_CHECK=1` turns it off.
- **`memo mail probe` scores each sender group** for spam, scams and robots, with the signals behind it: Gmail's
  DMARC verdict, a brand in the display name sent from another domain, Reply-To on another domain, a
  throwaway-mail domain, bulk mail never replied to, Gmail's Spam, and replies from the owner (−5).
  `--domain-age` adds the sender domain's age from its registry (RDAP), asked once per domain and kept.
- **Gmail's SPF, DKIM and DMARC verdicts and Reply-To are kept** on new mail: in the headers of mail stored in
  full, and in the metadata of envelopes. Listing reads two more header fields, about 1 KB an email instead of
  300 bytes.

### Изменено

- **Config settings are named in snake_case:** `mail.max_body_chars`, `mail.max_attachment_chars`, and `list_id`
  and `decided_at` in `mail.accounts[].rules[]`, which `memo mail rules` writes and prints that way. The camelCase
  names older versions wrote are still read, and the file is saved in snake_case; both spellings with different
  values are an error. Renaming inside `rules` needs the cli-core release carrying PR #1224.

### Исправлено

- **A himalaya that exits before reading its input no longer crashes memo** with an unhandled `write EPIPE`; the
  failure is reported with how himalaya ended, as for any other himalaya error.
- **The timer follows the memo you run.** After a Node.js switch and an install under the new version, the next
  memo command points the `memo auto` unit at it, so removing the old Node.js no longer breaks the timer silently.
  A checkout or `npx` never moves it.
- **The timer keeps the places memo was started with.** `memo auto start` records `MEMO_CONFIG_DIR`,
  `MEMO_STATE_DIR`, `MEMO_CACHE_DIR`, `MESSAGING_STORE` and `WIRECAT_STATE_DIR` in `auto.places` and passes them to
  every timer run, which used the default places before.
- **A failed Himalaya call says why.** The message names the exit code or signal and Himalaya's last line, instead
  of repeating the command; `exit_code`, `signal` and the last five stderr lines, with passwords and tokens cut,
  are in the error's details. Gmail's `[THROTTLED]` is its own reason, `mail.throttled` (`rate_limited`), with the
  advice to wait an hour or more.

## 0.30.0 — 14.10.2026

### Добавлено

- **A mail sync goes on where the last one stopped, without listing the mailbox again.** Each run keeps, in the
  store, the mailbox's UIDVALIDITY and the UIDs whose outcome is final (stored, recorded or skipped by a rule), so a
  rerun reads metadata only for mail not done: a large mailbox is no longer listed whole on every run. A whole listing — the only kind that marks deleted mail and refreshes labels and read state — still runs
  at least daily, whenever the rules change, when UIDVALIDITY changes, and with the new `memo sync --rescan`. A
  window under 5,000 emails, like the timer's 30 days, is listed whole every run. An mbox file read to the end is
  not read again until its size or time changes. `memo sync --json` adds `pass` (`full` or `resumed`) to each
  account.
- **`memo mail status <account>`** says how far an account's import is, from the store: stored in full, recorded
  as envelopes, and done of the mail in the widest window searched, as cli-core's progress line;
  `--json` answers the shared progress shape.
- **Mail stored in full keeps List-Id, List-Unsubscribe and Precedence** in its headers (`list-id`,
  `list-unsubscribe`, `precedence`), so a rule can later be matched from the store.

- **`--json=id,title` keeps only those fields** of an answer's item or items, read the way tg and max read it
  (cli-core 0.277.0's `liftJson` and `checkJson`). Adopts cli-core 0.277.0 and cli-base 0.28.2.

## 0.29.0 — 14.10.2026

### Добавлено

- **A failing timer run is said on every command.** While the last `memo auto` run failed, every memo command
  writes one line to stderr — `memo: scheduled sync failing since 2026-10-14 00:58 (12 runs): notes … has no
  folder id — memo auto status` — until a timer run passes. `memo auto status` shows `failing` (`since`, `runs`,
  `reason`). Runs are kept in `<state>/auto/last.json` with cli-core's `recordRun`; the timer run itself and a sync
  started by hand do not print or count.
- **Mail stored in full keeps its size at the source** (RFC822.SIZE), as envelopes already did.

### Изменено

- **On cli-core 0.274.0 and cli-base 0.28.1.** Every answer's `meta` has
  `complete`; `memo sync` answers `complete: false` with `issues` (`{ code, source }`) when a source failed, and
  each entry of its `failed` list carries `code`. Errors carry `retry: { safe, after_ms? }`.
- **Every command declares its effects** in `commands --json`, now contract 3: what it reads or writes on the mail
  server or a model, and on this machine. A failed read is marked safe to retry (`memo sync` while another sync
  runs, for one); before, nothing was, because a command with no effects counts as a write.

## 0.28.0 — 14.10.2026

### Добавлено

- **`memo mail rules apply <account>`** cuts mail stored in full that an envelope rule matches down to its
  envelope: text, attachments and search entries go, sender, date, size, labels and the subject in metadata stay.
  A dry run by default that says per rule how many emails and how much text it would cut; `--yes` cuts them.
  Matching reads the headers from the mailbox, as `memo sync` does. Mail only a skip rule matches stays as
  stored. It takes the sync lock and refuses with `sync.running` while a sync runs.

## 0.27.0 — 14.10.2026

### Изменено

- **Every JSON key memo prints is snake_case**, on the CLI and in MCP: `has_more`, `next_offset`, `key_documents`,
  `your_notes`, `not_read`, `from_them`, `proposed_by`, `creation_fingerprint`, `already_stored`,
  `deletions_skipped`, and the rest. A note's front matter, an email's headers and metadata keep their own keys.
  `memo commands --json` says contract 2.
- **`memo sync --json` prints the shared envelope:** `{"item": {"notes", "mail", "failed", …}, "meta": {"run_id",
  "duration_ms", "accounts"?}}`. What was the whole answer is now `item`.
- **Notes search uses cli-core's names:** a hit's line is `excerpt`, and `found_by`, `has_more`, `next_offset`,
  `meaning_skipped`, `links[].target_text`.
- **More registered reasons:** `folder.unbound` (with `path`), `folder.not-found`, `note.not-imported`,
  `mail.account-unknown` (with `account`), `mail.rule-not-found`, `mail.source-failed`, `mail.invalid-imap`,
  `project.not-found`, `person.not-found`, `identity.no-messenger`, `auto.systemctl-failed`.
- A missing embedding model is recognised by its reason, `model.not-downloaded`, not by its text.
- Moves to `@wirecat/cli-core` 0.268.0 and `@wirecat/cli-base` 0.27.2.

## 0.26.0 — 14.10.2026

### Изменено

- **Errors are one object, the same on the CLI and in MCP:** `{"error": {"code", "reason", "message", "param"?,
  "details"?}}`. The CLI prints it as one JSON line on stderr in machine mode and `✗ message` at a terminal; MCP
  returns it as `structuredContent` with `isError`. A failure that is not memo's own is `internal_error` /
  `command.crashed` and its text is hidden. A bad option is `validation_error` with Commander's words, exit 2.
- **New global `--debug`** prints the whole error record after the object: the thrown text, cause and stack.
- **memo registers its own reasons** in `APP.errors`: `sync.running` (with `pid`) for a sync refused by the lock.
- A source that fails during `memo sync` shows its registered message; a crash's text shows only with `--debug`.

### Добавлено

- **`memo mail rules add --envelope`** records matching mail without its text: sender, date, size, labels and
  the Gmail id, with the subject in metadata and out of search. `memo mail rules list` shows how many emails
  each envelope rule recorded and their size. A keep wins over an envelope, an envelope over a skip; removing
  an envelope rule or changing it to keep reads those emails in full on the next sync. `memo sync --json`
  reports `envelopes` beside `skipped`.

### Исправлено

- **The `memo auto` timer no longer fails when a sync is still running.** A timer run that finds the lock held
  exits 0 and writes `memo sync skipped: …` to stderr (`skipped` in `--json`). A sync started by hand still
  refuses with `rate_limited` / `sync.running`.
- **The missing-model hint names the CLIs that download it** — memo has no `models` command: `tg or max
  downloads it: tg models text download e5-small`. MCP `search_notes` no longer suggests `memo models …`.

## 0.25.0 — 14.10.2026

### Добавлено

- **`memo mail probe <account>`** groups an account's mail by sender and List-Id from headers only (about 300
  bytes an email): emails, size, unread and bulk shares, years, whether the owner ever wrote to the sender,
  and a `skip` suggestion for large, bulk, never-answered groups. `--json` for agents.
- **`memo mail rules list|add|remove <account>`** keep the owner's skip/keep decisions by sender, domain or
  List-Id in `mail.accounts[].rules`; a keep wins over a skip. `memo sync` never reads or stores an email a
  skip rule matches and reports it as `skipped`; mail stored before stays.
- **Google Takeout mbox accounts** (`"mode": "mbox", "path": "…"`, with the Gmail address) import old mail by
  Gmail's message and thread ids, so it joins the IMAP account's mail. The file is read in one streaming
  pass; it only adds mail, never marks any deleted, and syncs only when named with `--account`.

### Исправлено

- **`memo sync` imports a mailbox of more than ~120,000 emails.** A long `--since-time` window failed with
  "Maximum call stack size exceeded" before saving anything.
- **`memo sync --mail` reads mail about ten times faster.** Emails are fetched raw, up to 50 (or 20 MB) per
  IMAP call instead of one himalaya call each, and parsed in-process with `postal-mime`. An email that cannot
  be read or parsed is listed under `unreadable` and tried again next run instead of failing the account.
- **Listing a mailbox of several hundred thousand emails no longer reads one huge answer.** All Mail is listed
  10,000 emails per himalaya call.
- **A whole-mailbox `memo sync` no longer loads every stored email's text.** The deletion check and the "already
  stored" check read only Message-IDs and mailboxes, in one query each, instead of every body and one lookup per
  listed email.
- **A mail marked deleted by mistake is saved again when IMAP lists it again.** It used to count as already
  stored and stayed without its text. An mbox archive still leaves mail that IMAP proved deleted alone.

### Изменено

- **Depends on `@wirecat/cli-core` 0.265.0 and `@wirecat/cli-base` 0.27.1.** `@wirecat/cli-core` is the new name
  of `@wirecat/cli-messaging`; opening the store with it runs store migrations up to version 7. `memo commands
  <path> --json` says `inherited_options` instead of `inheritedOptions`, and its `contract` is 1.
- **`attachments[].part` and an attachment's `providerRef.part` count the email's attachments from 0** instead
  of being himalaya's MIME part index. Attachments stored earlier keep theirs.
- **Mail bodies are read from the raw message.** Text matches the old reader once whitespace is collapsed; blank
  lines, spaces at line ends and joined flowed lines may differ. HTML parts that the old reader filed as attachments are now the body, and attachments the old reader
  named `attachment-N` keep their real file names.
- **`memo sync --help` and the agent skill say how long a large first mail import takes**, and that Gmail caps
  IMAP downloads per day.

## 0.24.0 — 13.10.2026

### Добавлено

- **An agent skill, as tg has.** `memo skill show` prints it and `memo skill install --for claude|agents|all`
  writes it where Claude Code, Codex and Gemini CLI look; a global npm install does that too, unless
  `MEMO_INSTALL_AGENT=none`. It starts with the traps agents fell into: choosing an account, `content:` and
  answer keys, starting project work with `memo projects context`, `--as-owner`, accepting their own proposals,
  writing message text to files, old versions and zsh word splitting.

- **Key documents of a project.** `memo projects key-documents add <project> <note:|document:|msg:> --reason
  <text>` marks what to read first about one project; `remove` and `list` go with it. `memo projects context`
  starts with them — title, path, why, who marked it — and keeps a mark whose source is gone as
  `available: false`. `memo search all` and `search notes` with `--project <project>` put the project's key
  documents first, labelled `key`, and leave nothing out. An agent's mark waits unconfirmed and names the agent.

- **Every command shows one to three examples** at the end of its `--help` and in `memo commands --json`
  (`examples`). A test runs each through memo's own parser, so an example never names a command, option or value
  memo does not take.

### Изменено — может затронуть скрипты

- **The local store and the search models move to one WireCat folder** (cli-messaging 0.258.0):
  `~/.local/share/WireCat/` on Linux and macOS, `%LOCALAPPDATA%\WireCat\Data\` on Windows. The first start of
  memo, tg or max after the update moves `wirecat.db` and the models there, once; the old folders stay.
  `WIRECAT_STATE_DIR` moves the whole folder and replaces `CLI_COMMON_CACHE_DIR`.
- **An MCP tool failure that is not a memo error is `internal_error`**, the shared name; it was `generic_failure`.
- **`memo notes about` is gone; `memo notes list --about <subject>` returns what it did.** The list now holds the
  notes about the subject and the notes linking it, a note about it, or a name two people share, each with `via`
  (`about`, `link`, `through`, `name`), the headings it links under (`anchors`) and, for `name`, the name as written
  (`linkText`). It still pages and combines with `--source` and `--search`. A person's
  notes include those about any of their messenger identities.

- `memo context` tells you to run `messages sync <chat>` for chats not read in full; the hint said `store fetch <chat>`, which cli-messaging 0.256.0 renamed. Text read from a CSV attachment or note now comes as rows (`name: Bravo; value: 200`), not raw comma separated lines.
- **`memo commands --json` prints cli-base's commands document**, the shape tg and max print: `cli`, `version`,
  `contract`, `description`, `globalOptions`, `commands`, `exitCodes`. `items` is gone; `memo commands <path> --json`
  puts the one command under `commands` with `scope` and `inheritedOptions`.
- `memo import` is now `memo sync` (owner, 2026-10-12; WireCat glossary in cli-messaging). `memo import` stops working. `memo auto start` writes `memo sync` into the unit; a timer installed before runs `memo import` and fails until `memo auto start` is run.
- **A write from an agent's terminal is the agent's.** `memo facts add`, `memories add`, `relationships add`
  and `actions add` run with `AI_AGENT` or `CLAUDECODE` set record the agent as author (`claude-code`, the
  name before the version in `AI_AGENT`), as the MCP server does: the fact or memory waits as `proposed`, the
  relationship unconfirmed with `provenance: agent:<name>`. They were recorded as the owner's and accepted.
  `--as-owner` keeps a write yours inside an agent's terminal.

- **One meaning per flag (WireCat command standard).** A flag that takes several values is given once per value:
  `memo notes add --about a --about b`, `sync` and `search notes` `--folder a --folder b`.
  `reminders add` and `update` take `--at-time` instead of `--at`. `relationships add` takes `--reason <text>`
  instead of `--evidence`, which in `facts` and `memories` names references. `--project` takes a key or
  `project:<id>` in `facts add`, `facts list` and `tags add|remove`, as it does in `tasks`; `tags --folder` takes a
  folder's path as well as its id; `projects add --organization` takes a bare id as well as `organization:<id>`.

- **One way to bring notes and mail in: `memo sync` (WireCat command standard, no two commands overlap).**
  `memo notes import` and `memo mail <account> import` are gone. `memo sync --notes` and `--mail` take one side;
  `--folder` and `--ignore` narrow the notes, `--account <name>`, `--since-time <time>` (a date, ISO 8601 or
  `30d` ago), `--limit <n>` and `--retry-attachments` narrow the mail. Without `--account` it reads every account
  and names each. `memo mail <account> show <reference>` is `memo messages show <reference>`.
- **Verbs from the shared list.** `facts accept` and `actions approve` are `confirm`; `actions propose` is
  `actions add`; `tasks readiness` is `tasks status`; `tasks ready` is `tasks list --ready --project <project>`;
  `auto on` / `off` are `auto start` / `stop`; `reminders schedule` / `snooze` are `reminders add` / `update`;
  `vocabulary resolve` is `vocabulary show`; `vocabulary preflight <name>` and `vocabulary audit` are one
  `vocabulary check [name]`; `memories search` is `search memories`. The old names stop working.
- **MCP tools follow their commands:** `actions_add`, `search_memories`, `tasks_relations`, `tasks_status`,
  `tasks_list` (with `ready`), `vocabulary_check` (with or without `name`) and `vocabulary_show` replace
  `actions_propose`, `memories_search`, `task_relations`, `task_readiness`, `tasks_ready`, `vocabulary_audit`,
  `vocabulary_preflight` and `vocabulary_resolve`.

### Исправлено

- **Mail hints name `memo sync --mail`.** `memo search mail` and its MCP tool named `memo mail <account> import`,
  which is gone.
- **`memo sync` keeps `mail.maxBodyChars` and `mail.maxAttachmentChars`.** Only `memo mail <account> import`
  read them; the timer stored mail with the defaults.
- **Every argument and option of memo is described in its help**, and every summary is lower case, at most 80
  characters.
- **A command path given as one argument is refused with the words to type.** `memo "projects add" --help` — what
  a zsh loop over `"$c"` passes — printed the root help; it now says `"projects add" was given as one argument;
  run: memo projects add`.
- **Search help says where file text and references are.** `search messages`, `search mail` and `search all` say
  `content:`, `transcript:` and `filename:` narrow a search to the text of files, voice transcripts or file names, and each search's `--help` and MCP
  tool names the list (`items` or `hits`) and the reference (`locator` or `ref`) of its `--json` answer. The usage and
  troubleshooting guides say the same, and to compare `memo --version` with npm before reporting a bug.
- **The search guide names `content:` for messages.** It narrows a search to the text of files, in
  `memo search messages` and `memo search all` as in tg; the guide listed it for mail only.
- **`memo projects context` and `memo organizations context` refuse what the store does not hold** with
  `not_found` instead of an empty answer, and `organizations context` takes `organization:<id>` as well as
  its id.
- **`memo folders attach` refuses drive-cli's `google-drive:` folder**, and `memo folders list` marks it "kept by
  drive" (`keptBy: "drive"` in JSON) instead of offering to attach it. Bound to a disk folder, the next import
  would have deleted the Drive documents missing from it.
- **`memo search all` no longer runs as the first stored account.** It searched every account before too, but
  picked one as its own; now it runs as memo's notes and its answer names every account it read, as `accounts`
  (`{ resource, provider, account }`) in JSON and a `searched:` line on stderr. `memo search messages` and
  `memo search mail` stop picking one as well.

## 0.23.0 — 12.10.2026

### Исправлено

- **An MCP answer over 4 MiB is refused with `invalid_response`**, as cli-messaging's tools refuse one, instead of
  reaching the agent whole.
- **Memory, fact, action and agent-log lists say whether there are more** (`hasMore`, CLI and MCP), as the other
  lists do; asked for the whole 500, a full answer says it may have more. `tasks list` (of an account), `tasks
  ready` and `tasks_ready` give each task its `task:` reference.
- **Terminal answers name things by the references memo's commands take.** `notes list` and `context` printed a
  bare note id that `notes show` refuses; they print `note:`/`document:` references. `notes show` printed only the
  text; it starts with the reference, path or title, update time and tags, and ends with what it links and what
  links it. `context` names the person as `person:<id>` and each message by its `msg:` locator, and tasks as
  `task:<id>`. `tags list` names a chat as `chat:…`, a contact as `<messenger>:<id>` and every other label's
  target as `<type>:<id>`, not as JSON. `context --json` gives each of your notes its `ref`.

## 0.22.0 — 12.10.2026

### Изменено

- **Built on `@wirecat/cli-base` 0.21.0, the framework's new name, and the shared library 0.254.0.** Nothing
  changes in memo's commands; `memo search` answers carry `nextOffset` where the shared search gives it, and
  `memo context person:<id>` takes the `person:` references search answers give.

### Добавлено

- **`memo mail <account> show <reference>` opens one stored email whole**, by the `msg:email/…` reference search
  answers give: time, sender, To, Cc, labels, subject and the whole body; `--before-n`/`--after-n` add the emails
  of its thread either side, `--json` the same as data. The reference must be of the named account.
- **The MCP server searches every source.** `search_all`, `search_messages`, `search_mail`, `search_notes` and
  `person_context` read the same store as `memo search` and `memo context`. memo is where an agent searches across
  messengers, mail and notes; tg and max will search only their own messages
  ([which tool owns which command](https://github.com/WireCatLabs/cli-messaging/blob/main/docs/dev/TOOL-BOUNDARIES.md)).

### Исправлено

- **`memo ask` gives coverage as counts per account, and its 64 KiB limit covers the whole answer.** Each
  messenger account had one row per chat, up to 500, which could fill most of an answer; now `chats` counts `checked`, `complete`, `partial`, `neverFetched`, `behind` and `withGaps`, and `more`
  says the 500-chat check was cut short. The size check measured the evidence only; it now measures what is printed.

## 0.21.0 — 11.10.2026

### Исправлено

- Подсказка после поиска без модели для поиска по смыслу называет команду, которая её скачивает,
  `tg models text download e5-small`; раньше она называла несуществующую команду `memo models`.
- `memo projects context` находит проект по ключу (`HRB`) или по `project:<id>`, а не только по id;
  с ключом ответ был пустым.

### Изменено — может сломать скрипты

- **`memo search mail` и `memo search messages` показывают каждый результат как ссылку на источник, затем
  кто и когда, затем отрывок.** Для письма вторая строка называет To, Cc и его ярлыки Gmail, а третья — тему;
  весь текст возвращается с `--full`. `--json` даёт каждому письму `email` (from, to, cc, bcc и reply-to с их
  ссылками `person:`, ярлыки, цепочку, прочитано и помечено) и `excerpt` вместо всего `text`; `--brief`
  оставляет только ссылку, заголовок, время, отправителя, отрывок и оценку. Поиск по почте больше не
  возвращает `coverage`. Основано на общей библиотеке 0.251.0.

### Исправлено

- **Импорт почты больше не записывает адреса Cc в To.** В почте, импортированной раньше, они остаются в
  обоих полях; поиск показывает их только в Cc.

## 0.20.0 — 11.10.2026

### Что нового

- Руководства в `docs/` следуют структуре страниц инструментов wirecat.dev: обзор, ежедневная работа, как
  устроен memo, рецепты, решение проблем, память и сгенерированный справочник команд (`pnpm generate`).
  Они написаны для читателей, которые не каждый день работают в терминале.
- `memo commands [path] --json` выводит дерево команд и их параметры, как в tg, max и drive, чтобы
  документация и агенты могли проверить команду до запуска.
- У каждой команды есть описание в `--help`, включая организации, проекты, связи, напоминания и список
  задач.

## 0.19.0 — 11.10.2026

### Что нового

- `memo mcp` подсказывает подключённому агенту, когда сохранять: то, что произошло, — это факт (`facts_add`),
  вывод — это память (`memories_add`), то, что нужно сделать, — `actions_propose`, каждое с доказательством,
  и только то, что пригодится позже. `memo search …` и `memo notes show` заканчивают свой `--help` той же
  подсказкой для `memo facts add` и `memo memories add`.

### Изменено

- **Поиск по смыслу в почте находит письмо, в котором есть ответ.** Почта снова делится на части по
  отдельным письмам; повторно процитированный текст, приветствия и подписи по-прежнему отбрасываются. Раньше
  одна часть охватывала несколько писем цепочки, и результат указывал на самое новое из них. Первый запуск
  индексации после обновления один раз заново делит сохранённую почту и заново создаёт для неё векторы.
  Основано на общей библиотеке 0.249.0.

### Исправлено

- Подготовка выпуска останавливается, если другая сессия продвигает main, пока идут её PR с версией или
  локальные проверки. Перед повтором просмотрите новый main; устаревшая подготовка не может слить лишний
  заголовок версии или запустить непроверенный исходный код.

## 0.18.0 — 11.10.2026

### Исправлено

- В исходной истории изменений остался один заголовок 0.17.0: подготовка выпуска шла одновременно со слиянием
  его функций. Команды словаря и закреплённая версия общего хранилища те же, что в 0.17.0.

## 0.17.0 — 11.10.2026

### Что нового

- **Создание меток с проверкой владельцем:** `memo vocabulary create` требует текущий отпечаток создания из
  предварительной проверки. Похожие метки ищутся в общем хранилище, включая неявную разметку тегами;
  устаревшие подтверждения отклоняются. Точные псевдонимы по-прежнему ведут к своей основной метке.
  `vocabulary audit` находит существующие лексические синонимы с явными пределами работы и вывода и сообщает о
  неполной проверке; он никогда не принимает и не объединяет их.

- **Поиск почты фильтрует по прочитанным и помеченным звёздочкой письмам и понимает `label:`.** `memo search mail`
  принимает `is:unread`, `is:read`, `is:starred` и `label:` (то же, что `mailbox:`), а также `date:>=2026-01-01`
  наряду с `date>=2026-01-01`. Работает на общей библиотеке 0.246.0.

## 0.16.0 — 11.10.2026

### Что нового

- **Встречи проекта и зависимости задач.** `projects meetings list|link` требует точного провайдера и аккаунта
  встреч и принимает основной ключ проекта или явный псевдоним. `tasks link|unlink` управляет проверенными
  связями «заблокирована / продолжение / связана с»; `relations`, `readiness` и `ready` показывают общий граф
  задач. Поиск готовых задач ничего не берёт в работу. MCP-инструменты `task_relations`, `task_readiness` и
  `tasks_ready` только читают. Работает на фактически опубликованной общей библиотеке 0.242.0; новые ключи
  проектов содержат 3–4 символа, существующие ключи остаются действительными.

- **Просмотр основного словаря и проверенные псевдонимы.** `vocabulary list|resolve|preflight` показывает
  постоянные ID проектов, тегов и тем, явные псевдонимы и вероятные лексические дубликаты меток. Команда
  владельца `vocabulary aliases add|remove` требует текущий отпечаток предпросмотра. MCP-инструменты только для
  чтения `vocabulary_list`, `vocabulary_resolve` и `vocabulary_preflight` позволяют агенту повторно использовать
  каталог; принимать или менять псевдонимы они не могут. `facts_add` может привязать предложенный факт к
  основному проекту.

## 0.15.0 — 11.10.2026

### Изменено — может сломать скрипты

- **`memo mail <account> import` заменяет `memo mail import --account <name>`; старой формы больше нет.**
  `<account>` — имя в `mail.accounts`, и оно обязательно, даже если настроен один аккаунт: memo больше не берёт
  первый. Отсутствующее или неизвестное имя — ошибка со списком настроенных. Импорт почты теперь берёт ту же
  блокировку, что `memo import` и таймер, поэтому они никогда не работают одновременно. `memo import`
  по-прежнему импортирует все аккаунты.
- **`bin/mail-password <account>` требует аккаунт**; без него скрипт печатает подсказку по использованию и
  настроенные имена, а не подставляет `gmail`.

### Что нового

- **`memo search mail --account <address>`** ищет в одном почтовом аккаунте; без него — во всех. Адрес, которого
  нет в хранилище, даёт `not_found` со списком тех, что есть.

## 0.14.1 — 11.10.2026

### Исправлено

- **npm снова ставит пакеты рядом друг с другом.** Работает на `@wirecat/cli-messaging` 0.241.0, чей
  `@wirecat/cli-meetings` 0.4.2 принимает cli-core 0.20.0. С 0.240.0 npm клал cli-messaging во вложенную папку
  со второй копией cli-core.

## 0.14.0 — 11.10.2026

### Изменено — может сломать скрипты

- **На macOS memo хранит файлы там же, где на Linux**: `~/.config/cli-memo`, `~/.local/share/cli-memo` и
  `~/.cache/cli-memo` вместо `~/Library/…`. Первый запуск переносит туда старые папки вместе с общим хранилищем.
  Если работает `serve` мессенджера или MCP-сервер, memo печатает одно предупреждение, в этом запуске продолжает
  использовать старые папки и пробует снова в следующий раз. Linux и Windows не изменились. Работает на
  `@wirecat/cli-messaging` 0.240.0.

## 0.13.0 — 11.10.2026

### Что нового

- **`mail.maxBodyChars` и `mail.maxAttachmentChars`** в настройках задают, сколько `memo mail import` сохраняет
  от текста письма (по умолчанию 1 000 000 символов) и от текста одного вложения (по умолчанию 200 000).
- **`memo facts add|list|show|accept|reverse`: что произошло, с доказательствами.** Факт — это факт, утверждение,
  вопрос, решение или обещание. Ваш принимается сразу; факт агента ждёт со статусом предложенного. Решение с
  `--supersedes` после принятия завершает то, которое заменяет; `reverse` завершает принятое решение. `memo mcp`
  предлагает `facts_add`, `facts_list` и `facts_show`.
- **Собственные задачи в проекте.** `memo tasks add --project <key> --title <title> --type bug|feature|chore`
  создаёт задачу без источника. `--priority`, `--parent`, `--description` и `--assignee` работают с любой задачей;
  `memo tasks update <id>` меняет их, `memo tasks list --project <key>` показывает задачи проекта, а
  `memo tasks close` закрывает задачу.

### Изменено — может сломать скрипты

- **memo работает на `@wirecat/cli-messaging` 0.238.0**, версия хранилища 2: обновление хранилища переносит
  записи памяти вида «факт» в факты и копирует назначения задач; старые сборки memo по-прежнему его открывают.
- **Почта ищется по смыслу по цепочкам**, без повторно процитированного текста: первый `memo mail import` после
  обновления заново нарезает каждую цепочку и снова создаёт векторы для почты. Поиск по словам не изменился.
- **Вида записи памяти `fact` больше нет**: что произошло, теперь факт (`memo facts`). Хранилище перенесло
  существующие записи памяти вида «факт» в факты вместе с доказательствами и ссылками.
- **`memo tasks assign` принимает `--role` (исполнитель, рецензент или наблюдатель) и не принимает
  `--provider`/`--account`.** Команда записывает исполнителей задачи, которых читает `memo context`, а не связь
  `assigned-to`.

## 0.12.0 — 11.10.2026

### Что нового

- **`memo notes add --meeting <id> --provider <provider> --account <account>` пишет заметку о встрече.**
  Команда принимает id встречи в хранилище, как `memo tags add --meeting`, и добавляет тот же предмет
  `meeting:<account id>/<meeting id>` рядом с любым `--about`. Встреча, которой нет в аккаунте, даёт
  `not_found`.

### Изменено — может сломать скрипты

- **memo работает на `@wirecat/cli-messaging` 0.235.0.**
- **Отметки «прочитано» и «со звёздочкой» остаются актуальными.** `memo mail import` обновляет их у ранее
  сохранённой почты так, как их сейчас показывает почтовый ящик, не читая письма заново.
- **Обычные IMAP-аккаунты получают флаги.** Их письма записывают «прочитано» и «помечено», а помеченное письмо
  получает ярлык `Starred`, как письмо Gmail со звёздочкой, поэтому `search mail mailbox:starred` находит оба.
- **Длинные письма сохраняются целиком.** Раньше текст обрезался на 20 000 символов; теперь он хранится до
  1 000 000, а хранилище нарезает его на части для поиска.

## 0.11.0 — 11.10.2026

### Изменено — может сломать скрипты

- **memo работает на `@wirecat/cli-messaging` 0.233.0.** Вложения импортированного письма теперь тоже ищутся по
  смыслу: после импорта их текст нарезается на части и превращается в векторы, а `search conversations` в tg и max
  отвечает на совпадение во вложении его письмом.

## 0.10.0 — 11.10.2026

### Что нового

- **Ярлыки и звёздочки Gmail попадают в хранилище.** `memo mail import` читает ярлыки (`X-GM-LABELS`) и флаги
  каждого письма: каждый ярлык, включая «Входящие», «Важное» и «Отправленные», становится почтовым ящиком-ярлыком
  с простым именем, письмо со звёздочкой дополнительно получает `Starred`, а у новой почты записываются
  «прочитано» и «со звёздочкой». `search mail mailbox:important` находит их. Ярлыки заменяются при каждом запуске,
  потому что Gmail отдаёт список целиком; для папок сохраняется правило по каждому просмотру, и только папки
  решают, была ли удалена пропавшая почта. Если импорт не может прочитать строку ярлыков, ярлыки этого письма
  остаются прежними.

## 0.9.0 — 11.10.2026

### Что нового

- **Встрече можно поставить тег и написать о ней.** `memo tags add|remove --meeting <id>` с `--provider` и
  `--account` ставит метку на сохранённую встречу, `memo tags list --type meeting` показывает их, а `memo notes add --about
  meeting:<account id>/<meeting id>` пишет заметку о встрече.
- **`memo memories`** — `add`, `list`, `show`, `search`, `confirm` и `stale` для выводов, которые сделали вы и
  агенты, у каждого — доказательства и область `personal` или `work`. Ваши подтверждаются сразу; записи агента ждут
  со статусом предложенных.
- **`memo actions`** — `propose`, `list`, `show`, `approve` и `reject`. Одобрение превращает действие в задачу
  в том аккаунте, который выполнил бы действие; ничего не отправляется.
- **`memo agents log`** — что агенты сделали через MCP-серверы, по инструментам и агентам, без аргументов.
- **`memo mcp`** — MCP-сервер на stdio с `memories_add|list|show|search`, `actions_propose|list|show` и
  `agents_log`. Автор того, что записывает агент, — `memo-mcp`, и запись ждёт вас; каждый вызов записывается в
  журнал.

### Изменено — может сломать скрипты

- **memo работает на `@wirecat/cli-messaging` 0.232.0.** `search mail` принимает `to:`, `cc:`, `bcc:` (человек, как
  в `from:`), `subject:` (только слова темы) и `mailbox:` (папка или ярлык Gmail).
- **Справка `search` и `search all` говорит, что не читает `search all`**: людей, память, проекты,
  организации и решения, — и отправляет известный вид к его собственному поиску.
## 0.8.0 — 11.10.2026

### Изменено — может сломать скрипты

- **Почта попадает в почтовые таблицы хранилища.** `memo mail import` сохраняет каждое письмо через
  `store.mail` из cli-messaging (0.231.0): цепочки, письма, To/CC/BCC, папки как почтовые ящики и текст вложений
  при его письме. Id остаются прежними, поэтому ссылка `msg:email/…`, тег или заметка, созданные раньше, по-прежнему
  находят своё письмо. Почта, сохранённая прежними импортами как сообщения, остаётся доступной для поиска и
  сохраняет старое правило удаления; она заново читается в почтовые таблицы, когда её охватывает окно импорта.
  Пока существуют оба варианта, `deleted` считает сохранённые строки: письмо, удалённое в источнике, считает своё
  письмо, своё старое сообщение и любую старую запись вложения. Вложение больше не отдельная запись: отчёт об
  импорте больше не содержит `attachments[].locatorId`, а заметка к записи вложения остаётся на этой старой записи.
- **Теги, задачи и контекст человека читают почтовые таблицы.** `tags list` сохраняет тег на письме, `tasks add`
  принимает источник письма `msg:email/…`, а задачи и контекст человека включают его почту.
- **Векторы для почты строятся из почтовых таблиц.** После сохранения `memo mail import` создаёт векторы для
  частей новой почты (`embedMail` из cli-messaging), поэтому `search conversations` в tg и max по-прежнему находит
  почту по смыслу. `--no-embed` и отсутствие модели работают как раньше.

## 0.7.1 — 11.10.2026

### Исправлено

- Поиск почты, наборы доказательств и контекст человека читают также письма, сохранённые в отдельных почтовых
  таблицах. Прежние импорты почты по-прежнему поддерживаются; в результатах поиска каждая ссылка на письмо
  показывается один раз.

## 0.7.0 — 11.10.2026

### Изменено

- **memo работает на `@wirecat/cli-messaging` 0.226.0.** Хранилище чистит свои растущие журналы при открытии, не
  чаще раза в день: вызовы инструментов агентов старше 90 дней удаляются, а обработанное обновление бота старше
  30 дней теряет своё содержимое. Сначала обновите tg-cli и max-cli: все три инструмента используют общее
  хранилище.
- **`organizations add --kind`, `projects add --type` и `--scope` берут допустимые значения из хранилища**
  и отклоняют любое другое значение до открытия хранилища, называя допустимые.

### Исправлено

- **`memo --version` печатает версию пакета.** Начиная с 0.5.0 она печатала 0.4.0: номер хранился в файле, который
  выпуск не обновлял. Теперь тест падает, если этот файл и `package.json` расходятся.
- Ссылки на пакеты, документация и тестовые данные везде используют пространство имён WireCat.

### Безопасность

- **Старый `messages.db` удаляется**, когда хранилище открывается по пути по умолчанию: это незашифрованный файл,
  который использовался до `wirecat.db`, вместе с его `-wal` и `-shm`. Одна строка в stderr называет его. Он
  сохраняется, если задан `MESSAGING_STORE`, и пока другой процесс держит его открытым.

## 0.6.1 — 11.10.2026

### Fixed

- Package references, documentation and fixtures use the WireCat namespace throughout.
- The printed Memo version matches the published package version.

### Changed

- **memo runs on `@wirecat/cli-messaging` 0.221.0.** The store prunes its growing logs on open, at most once a
  day: agent tool calls older than 90 days are deleted, and a handled bot update older than 30 days loses its
  payload. Upgrade tg-cli and max-cli first, as all three share the store.
- **`organizations add --kind`, `projects add --type` and `--scope` take their allowed values from the store**
  and refuse any other value before the store is opened, naming the allowed ones.

### Fixed

- **`memo --version` prints the package's version.** It printed 0.4.0 since 0.5.0: the number lived in a file the
  release did not update. A test now fails when that file and `package.json` disagree.

## 0.6.0 — 10.10.2026

### Изменено — может сломать вызывающий код

- **memo работает на `@wirecat/cli-messaging` 0.218.0 и `@wirecat/cli-core` 0.19.3**, хранилище — в `wirecat.db`.
  Старый `messages.db` остаётся как есть и не читается: импортируйте заметки и почту заново и выполните
  `memo folders add <path>` для каждой папки, потому что id папки из старого хранилища нет в новом.
- **`memo entities` заменён на `memo organizations` и `memo projects`** (`add`, `list`, `context`),
  потому что хранилище теперь хранит их отдельно; `tags --entity` теперь `--organization` или `--project`, а ссылки
  `entity:` не находятся. Организация — это компания, команда, семья или сообщество; у проекта есть ключ.
- **Файл в папке заметок — это `document:<id>`, заметка, написанная в memo, — `note:<id>`.** `notes show`,
  `tags --note`, `tasks add` и `--about` принимают оба; голый id относится к написанной заметке. Доказательства
  в поиске и ссылки называют заметку-файл через `document:`.

### Безопасность

- Быстрые проверки секретов остаются в PR; проверки безопасности исходного кода, рабочих зависимостей и
  workflow выполняются перед публикацией. Автоматические проверки Socket отключены.

## 0.5.1 — 10.10.2026

### Изменено

- **Проект теперь распространяется по лицензии Apache License 2.0.** Условия — в `LICENSE`.

## 0.5.0 — 10.10.2026

### Изменено — может сломать вызывающий код

- **Пакет называется `@wirecat/cli-memo`, а его репозиторий принадлежит WireCatLabs.** Используйте этот пакет
  для установки и обновлений.

## 0.4.0 — 09.10.2026

### Изменено — может сломать скрипты

- Общее хранилище больше не держит копии для старых версий (версия хранилища 28, cli-messaging 0.212.0).
  Заметки, связи и сущности, записанные до переработки заметок, один раз копируются в новые таблицы во время
  обновления. После него старый tg, max или memo отказывается открывать хранилище с сообщением "upgrade this
  tool" — обновляйте все три вместе.

## 0.3.0 — 09.10.2026

### Изменено — может сломать скрипты

- Команды поиска теперь находятся под `search all|messages|mail|notes` и используют общие сервисы и
  ранжирование. `search all` возвращает типизированные совпадения по источникам и отдельный список `tasks` со
  связанной открытой работой. Старые пути `memo search <query>` и `memo notes search` удалены без псевдонимов.
  Используйте `search notes --type` вместо `notes search --source`; `--all` и `--note-text` больше не нужны.

- Закреплена общая SDK 0.211.0 вместе с Telegram/MAX. Источники задач из старых скопированных заметок переходят
  на собственные ID заметок без изменения ID задач, области аккаунта и закрытых статусов. Перед открытием общего
  хранилища владельца обновите согласованные инструменты вместе.

### Исправлено

- `search all` находит сообщения в хранилище, которое ещё не записало аккаунт, от имени которого он работает, и
  обращается к серверу мессенджера так же, как `search messages`. `search mail` без импортированной почты
  возвращает пустой результат с пояснением. Заметки, найденные по смыслу, должны быть так же похожи на запрос, как
  уже должны быть чаты, поэтому редкое слово больше не возвращает все заметки.

### Что нового

- `tasks add note:<id> --provider <provider> --account <account>` создаёт задачи из собственных заметок —
  файловых или внутренних. Списки показывают текущий предпросмотр заметки; удалённые заметки оставляют задачи
  нетронутыми. Подтверждённые связи «заметка о человеке» и явные назначения входят в контекст человека.
  Общий поиск включает задачи, заметка которых совпадает. Повторное создание использует существующую задачу
  того же вида, в том числе закрытую.

## 0.2.1 — 08.10.2026

- Закреплена cli-messaging 0.205.0 для соответствия согласованному выпуску Telegram/MAX. Собственные заметки,
  ссылки и ссылки на источники сохраняют ту же схему и поведение.

## 0.2.0 — 08.10.2026

Заметки — отдельные записи в общем хранилище (cli-messaging 0.202.0, версии хранилища 25–27), а не сообщения
провайдера `notes`.

- `memo folders add|attach|list`: папка заметок получает id из хранилища, а настройки каждого компьютера
  привязывают её к пути и формату на этом компьютере (`obsidian` или `markdown`). `list` показывает папки,
  которые хранилище знает с другого компьютера. Папка, импортированная до версии хранилища 25, переносит свой
  путь в настройки при первом запуске. Импорт отказывается работать с папкой без id, а не придумывает его.
- Импорт записывает заметки, их ссылки и теги из файлов. Ссылка на заметку, которая есть в папке один раз,
  сохраняется по id заметки; имя, которого нет ни у одной заметки, остаётся как написано и указывает на человека,
  как только появится человек с таким именем, псевдонимом или именем пользователя. Перемещённый файл сохраняет
  свой id, ссылки и теги. Тег, добавленный вами, остаётся, когда файл перестаёт его указывать. То, что компьютер
  в последний раз видел о
  каждом файле, хранится в папке состояния memo, и открывается только изменённый файл — в том числе чтобы найти
  `memo-id`, который отмечает файл, экспортированный memo, и исключает его из импорта.
- `memo notes add|edit|remove|list|show|export` для заметок, написанных здесь, о сообщениях, чатах, контактах,
  людях, сущностях, задачах и других заметках; `--export [dir]` и `notes.export` записывают их как файлы, которые
  содержат `memo-id` и после правки никогда не перезаписываются.
- `memo notes about`, `memo context` и `memo note` читают сохранённые ссылки: заметки о человеке, заметки со
  ссылкой на него, заметки со ссылкой на заметку о нём. Полное имя, найденное в обычном тексте заметки, больше не
  показывается как догадка. Старый `people-notes.json` один раз переносится в хранилище как ссылки `about`.
- `memo notes search` работает на общем индексе заметок: слова и основы слов, язык запросов сообщений,
  `--exact`, `--source`, `--folder` по пути или id, а также поиск по смыслу, когда скачана e5-small: `memo
  import` и `memo notes import` создают векторы для заметок (`--no-embed`, `notes.embed: false`). Каждое
  совпадение говорит, чем оно найдено (`foundBy`), и называет человека, на которого ссылается найденная заметка.
  `memo search --all` охватывает заметки; `--note-text` также возвращает текст написанных заметок.
- Сущности и связи принадлежат владельцу: `entities` и `relationships add|list|remove|confirm`
  больше не принимают `--provider`/`--account`. `memo tags add --note <id>` ставит метку на заметку; `--person`,
  `--entity` и `--task` не требуют аккаунта. `--folder <id> [--path <subfolder>]` ставит метку на все заметки в
  папке или подпапке и заменяет `--chat` с `--provider notes`. `tags list` говорит, пришёл ли тег заметки из её
  файла.
- Заметки читаются в определённом формате: `obsidian` добавляет встроенные `#tags` и читает ссылки
  `[label](path.md)` помимо `[[wiki links]]`;
  `markdown` читает обычные ссылки Markdown. В обоих распознаются ссылки на `person:`, `msg:`, `note:`,
  `entity:`, `task:`, `chat:` и `contact:`.

- Открытые задачи и явные назначения задач из документов в контексте человека; tasks add/list/close
  используют общий сервис задач. Если подходит несколько аккаунтов, нужно выбрать один явно.
- Загрузка CSV/TSV, PDF, DOCX, XLSX, ODT/ODS, PPTX и EPUB через общее извлечение текста с сообщениями о
  необязательных движках и неподдерживаемых форматах, пределами для файла и текста, хешами содержимого и
  происхождением по страницам, строкам и ячейкам.
- Настраиваемый охват папок Gmail/IMAP, постоянные идентификаторы по Message-ID, вложения как источники текста и
  ограниченная индексация почты с возобновлением. Неполный список папки никогда не считается доказательством
  удаления; при изменённом наборе папок удаление пропускается.
- Метки основных людей, задач и сущностей, связи с организациями, семьёй и проектами, заданные вручную, общий
  поиск по выбранным источникам, а также наборы доказательств со ссылками и предложения модели с явным согласием
  на удалённую обработку.
- Постоянные локальные напоминания о задачах с квитанциями аренды, подтверждением получения, проверкой устаревших
  правок, откладыванием и отменой, а также автоматической отменой при закрытии задачи. Ничего не отправляется
  наружу, и системы-источники не изменяются.

- `memo tags add|remove|list`: локальные метки на импортированных заметках, письмах, сообщениях и папках или
  цепочках, которые адресуются по ID заметок и папок, ссылкам на сообщения или точной тройке
  провайдер/аккаунт/чат. Метки не зависят от регистра, общие с tg/MAX и не меняют исходные файлы и почтовые ящики;
  удалённые источники скрываются из списка.
- `memo notes search --tag <tag>` фильтрует результаты поиска по словам и по смыслу по общим правилам тегов,
  включая метки на папке заметки.

## 0.1.2 — 07.10.2026

- cli-messaging 0.166.0, как в итоговых закреплённых версиях выпусков tg и max, включая защищённую подготовку
  чатов во время поиска и загрузки истории.

## 0.1.1 — 07.10.2026

- cli-messaging 0.164.0, как в исходном коде tg и max: контекст человека теперь находит личные диалоги без
  записанных участников, возвращая последнее сообщение в каждую сторону и личные сообщения в существующих
  хранилищах Telegram.

- Процесс выпуска может выполнить пробный запуск для версии, которая уже есть в npm, чтобы проверять сборку
  пакета между выпусками. Публикация по-прежнему отказывается выпускать существующую версию.

## 0.1.0 — 06.10.2026

- Команда `memo` с `--version` и `--help`.
- `memo notes about <name>` (раньше `memo notes <name>`): заметки о человеке, заметки со ссылкой на него и слабые
  упоминания по простому имени из папок Markdown, заданных через `--folder` или `notes.folders` в настройках.
- `memo mail import`: вся почта (All Mail) аккаунта Gmail в общее хранилище сообщений через Himalaya, только
  чтение; id цепочек и писем Gmail, возобновление с `--max`, а удаление в источнике стирает сохранённый текст.
- `memo note`: заметка о человеке, по одной на каждого человека общего хранилища. Связывание личностей — это
  `tg|max contacts link`, а не команда memo.
- `memo notes import`: заметки Markdown и текстовые заметки в общее хранилище как провайдер `notes`; правки
  сохраняются как версии, удалённые заметки теряют текст. `memo notes search <text>`: заметки по словам, с людьми,
  на которых они ссылаются, и известными людьми, чьё полное имя в них упоминается (догадка).
- `notes.ignore` в настройках и `--ignore`: файлы, папки или маски, которые никогда не читаются и не сохраняются.
- `memo import`: заметки и почта за один запуск, по изменениям: для заметок в хранилище ведётся список размеров,
  времени изменения и хешей содержимого, поэтому неизменённые файлы не читаются, а одинаковые не сохраняются.
  Блокировка не даёт запустить два импорта одновременно; сбой одного источника не останавливает остальные.
- `memo auto on [--every 5m] | off | status`: пользовательский таймер systemd для `memo import`. Источником
  служит `auto: { enabled, every }` в настройках; таймер подхватывает ручную правку при следующем запуске.
- `memo context <messenger>:<person>`: один ответ о человеке — контекст человека из cli-messaging по всем
  связанным личностям (включая почту), заметка о нём и заметки, где он назван, с указанием того, что не было
  прочитано и почему. Требует cli-messaging 0.150.0, которую закрепляют tg и max.
- Заметки превращаются в векторы для поиска по смыслу: `memo import` и `memo notes import` обрабатывают каждую
  изменённую папку и создают векторы для новых частей локальной моделью e5-small, не больше 600 за запуск,
  продолжая в следующем; `--no-embed` и `notes.embed: false` отключают это. `memo notes search` ранжирует
  одновременно по смыслу и по словам (`by` у каждого совпадения) и переходит на поиск по словам, если модели нет.
- cli-messaging 0.153.0, как закрепляют tg и max: длинная заметка или письмо превращается в векторы
  перекрывающимися частями, целиком.
