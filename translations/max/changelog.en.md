---
title: "Changelog"
---

Notable changes to `@wirecat/max-cli`, one section per version, newest first. Versions follow [Semantic Versioning](https://semver.org/lang/ru/); the command interface may still change before `1.0.0`.

## 0.72.0 — 24.10.2026

### Added

- **After login, `max serve` makes more of the requests made by web.max.ru:** direct-chat contacts' profile cards and online status, plus stories for the chat list, missing folder chats and the next chat-list page after first login. This reduces differences from the web client; MAX can still distinguish the tool. These are read requests whose responses are not displayed. Push notifications remain unsubscribed ([network requests](./security.md#что-уходит-в-сеть)).

- **The first ordinary terminal run of `max` asks three shared questions:** search languages, installing other WireCat tools and whether changes are permitted. Choosing read-only limits all profiles, including MCP, even with a more specific `allow`. Agents, pipelines, JSON mode and CI are not prompted. Change answers through `max setup`.

### Changed — may break scripts

- **Shared commands use canonical names; old names are removed** (cli-core 0.406.0): `contacts profile` → `contacts info`, `contacts timeline` → `contacts events`, `contacts alias` → `contacts aliases`, `chats link` → `chats links`, `metadata refresh` → `metadata sync`, `store reindex` → `store rebuild`, `commands schema` → `commands info`, `stats messages counters refresh` → `stats messages counters sync`, `models text key` → `models keys`, `models audio list` → `models list kind:audio`, `doctor report` → `doctor reports show`. Old commands refuse to run and name the replacement; hidden option aliases are also removed. Update scripts, schedules and saved MCP calls. An old permission path such as `permissions.metadata.refresh` now stops execution with `configuration_error` and names the replacement.
- **`max <profile> watch --json` emits `{ "type": "item", "data": … }` records and a final `{ "type": "end" }`** (cli-core 0.400.0). Messages and events use snake_case fields and canonical message values with references. Normal stops and timeouts produce a complete `end`; source failure produces an incomplete one and an error code. Update readers of the previous raw lines.
- **Run search is `max <profile> search runs` (`search runs`), replacing `runs search`.** Put `status:`, `error_code:`, `operation:` and `profile:` in the query: `search runs status:failed error_code:timeout`. There is no alias; migrate saved MCP requests.
- **Statistics select rows with query terms.** Replace `--chat` and `--exact` with `chat:` and `exact:`; rankings use `message_kind:` and `min_messages:`, discussions use `min_views:` and `max_replies:`, unanswered questions use `older_than:`. Update CLI and MCP calls; `--source` and `--timezone` remain options.
- **Commands that change what future runs may do require `permissions.mcp.authority: allow` or `ask` in MCP**, default `deny`: `config set|unset`, `recipients add|remove|clear`, `replies …`, `schedule command|agent|remove`, `skill install`, `flood clear`, model keys and similar operations. The agent cannot change this key through `config set`. See [what MCP does not offer](./mcp.md#чего-нет-в-mcp).

- **Archive maintenance, server control, model downloads and report creation are available through MCP.** They have individual permission keys such as `store.backup`, `server.start`, `models.download`, `doctor.reports.create`, default `ask`. Check permissions when an agent should only read: MCP permits a requested write at `ask` without a confirmation form.
- **Raw `bot api` requires explicit `permissions.bot.api: allow` or `ask` for an agent.** The default is `deny`; broader `bot: allow` does not enable it. The agent cannot change `mcp` or `bot.api` in settings or replace the whole `permissions` object; other individual keys may be changed when `mcp.authority` permits it. In max these calls retain permission and recipient checks and journal writes.
- **Read similar-task pairs through `tasks duplicates list [query...]`.** The `tasks duplicates` group no longer lists them. Migrate saved CLI and MCP calls to explicit `list`.
- **`events list` returns ISO 8601 dates and string identifiers.** `starts_at`, `ends_at`, `deleted_at`, `created_at`, `updated_at` are no longer millisecond numbers; `id` and `event_series_id` are no longer numbers. Update JSON readers relying on the old types.

- **`doctor reports create` checks permissions before writing a file.** Invalid configuration returns code 3 because write permission cannot be checked. Read the reason through `doctor` and fix the setting first. With valid configuration, safe report creation is also available under `MAX_READ_ONLY`.

### Fixed

- **`attachments download` skips service events and inline keyboards.** These attachments contain no file; previously a chat containing them stopped copying with code 13. Verify existing copies through `attachments check`; downloading again preserves them.

## 0.71.0 — 23.10.2026

### Added

- **Voice transcripts match word forms and speech-recognition distortions** (cli-core 0.396.0). `max <profile> search messages риелтор` finds both «риелтору» and «реелтора» in transcripts. A result found only through distortion has `match: "corrected"` and `corrections`. Numbers, phrases, `exact:` and written message text are not expanded. Text an agent saves for a voice message is also a transcript. The store migrates to version 29 on first run.
- **More commands are available through MCP within profile permissions** (cli-core 0.398.0): `config show`, `doctor report`, `runs list|show|path`, `store status|info|check|export|reindex`, `store jobs cancel|retry|clear`, `attachments move`, `attachments jobs status`, `commands schema`, `guide`, `skill show`, model lists, `replies status|test|consents show`, `schedule list`, `server status|logs`; for bots, `list`, `chats leave`, `chats admins add|remove`, `commands set|clear`, `webhooks list|set|delete`. See [what MCP does not offer](./mcp.md#чего-нет-в-mcp) for exclusions and reasons. These are the names used in this historical release.
- **`max <profile> review --offline` answers from the local archive** instead of refusing (cli-core 0.398.0). It shows only synchronized material and warns about missing data (`missing` in JSON).
- **Verified file copies.** `attachments download <dir>` saves available files across chats with size and SHA-256; `attachments check <dir>` checks copies offline. `attachments jobs` controls explicitly enabled daily Linux copies. Finished copies survive interruptions and message-history clearing. `attachments move <dir> <archive-dir> --before-time <time>` moves older images to another verified archive and records their new location for checking and avoiding repeat downloads.

- Saved voice-transcript search matches word forms and spellings distorted by speech recognition. `text:` searches written text only; `exact:` disables expansion for that word.

### Fixed

- **Examples in `--help` can be pasted and run:** `Example:` includes the `personal` profile (`max personal review "date>2h"`) instead of failing with “name a profile” (cli-core 0.398.0).
- Saved meeting searches are no longer displayed or removed by message-search commands.
- Command correction hints retain the chosen profile; help shows short descriptions and examples.

### Changed — may break scripts

- In MCP arguments, message deletion accepts `message`, chat export accepts `chat`, and task-duplicate operations accept `task` and, for a pair, `other_task`. Update saved requests using `messages`, `chats` or `dup`. CLI positional order is unchanged.
- Reference commands `commands` and `commands schema` reject `--jsonl`: use `--json` for one document.

## 0.70.0 — 23.10.2026

### Added

- **`contacts prepare <person>` prepares a conversation briefing** from saved messages, tasks, facts and notes, with source links. It is shared with tg and wa and does not connect to MAX (cli-core 0.394.0).
- **Command help includes invocation examples** from cli-core 0.394.0.

### Changed — may break scripts

- **Reading no longer marks chats read.** `messages list` no longer accepts `--mark-read`; `inbox` and `review` no longer accept `--mark-read` or `--no-mark-read`; `catch_up_marks_read` is no longer valid. Send a receipt explicitly with `chats mark-read`.
- **Unknown nested permission keys are rejected** as configuration errors before connecting. Correct the misspelled key instead of relying on the former warning.

## 0.69.0 — 22.10.2026

### Added

- **Date-filtered JSON responses identify the timezone used to interpret the date and the UTC window** (cli-core 0.385.0): `meta.timezone` names the zone when absent from the input; `meta.window` gives UTC `since` and `until` boundaries. Applies to `stats chats show`, `stats chats retention`, `stats messages unanswered`, `stats messages discussion`, `stats contacts responses`, `stats chats newcomers`, `contacts context`, `search conversations`, `runs search`, `messages sync`, `store export`, `replies test`, and to `inbox`, `review`, `chats events`, `chats members history` with `time:` or `date:` query terms. This makes the selected window visible. Fields are new and optional; existing fields stay unchanged. `search conversations` now interprets a date without a time in `--timezone` when supplied.
- **Chat JSON includes `muted_until`** (UTC end of muting) **and `marked_unread`** (chat marked unread), from cli-core 0.382.0.

### Changed — may break scripts

- **Archive-based `inbox` and `review` omit muted and archived chats** (cli-core 0.382.0). The archive now stores these flags from MAX, bringing its results into line with MAX. Use `chats list` to find these chats if a script previously expected them in inbox results.
- **An unwritable store returns `permission_error`, exit code 5, reason `store.not-writable`** (cli-core 0.381.0), replacing `internal_error` with “this is a bug”. Update scripts handling the former exit code.

### Fixed

- **Names copied with emoji find the chat or person** (cli-core 0.381.0). A copied emoji can contain an invisible selector absent from a typed one; «Семья❤️» previously failed to find «Семья❤».

## 0.68.0 — 22.10.2026

### Changed — may break scripts

- **Dates or times without a zone in `--since-time`, `--until-time`, `--at-time` and `chats mute --until` use the computer's timezone; a date alone means local midnight** (cli-core 0.379.0, cli-base 0.48.0). Previously `2026-09-01` meant UTC midnight. An explicit zone (`…Z`, `+02:00`) still wins; a command's `--timezone` takes precedence over the computer zone. An upper date-only boundary includes the whole local day. This matches the owner's calendar day. Scripts expecting UTC must specify it, for example `2026-09-01T00:00:00Z`; JSON times remain UTC with `Z`.
- **`stats chats retention` and `chats stats show` interpret `--since-time` and `--until-time` in `--timezone`**; retention's date-only upper bound includes the whole local day (cli-core 0.380.0). `stats charts`, `contacts timeline` and MCP `stats` identify the zone in `meta.timezone` and the UTC window in `meta.window`.

### Fixed

- **`max watch` displays message times in the computer's zone**, announcing it as `times in <пояс>` before the first message. Previously the zone was unnamed. `--jsonl` lines are unchanged in this release.
- **`max doctor` and login refusals after frequent attempts display times as `2026-10-21 16:03 Europe/Madrid`**, replacing the easily misread UTC form `2026-10-21T14:03:00.000Z`. `max doctor --json` retains UTC.

## 0.67.0 — 21.10.2026

### Fixed

- **A locked or unavailable Linux keyring warns and falls back to a credentials file** (cli-base 0.47.5). The keyring is read only through Secret Service. Previously a failure could silently save credentials in kernel memory, which disappears at logout or reboot.

## 0.66.0 — 20.10.2026

### New

- **The store keeps a chat's history (store version 25, cli-core 0.366.0).** A change to a chat's id, title,
  membership or visibility is written to `chat_revisions` with the old and new value; a read by the old id of a chat
  that got a new one finds it. The store moves to version 25 when first opened; nothing is sent.

### Fixed

- **A chat you left is found by any of its ids** (cli-core 0.368.0): `store export`, `store status`, `messages
  thread`, `--chat` and `chat:` in search, tags, tasks and the other reads of its saved history. `chats track` and
  `store gaps plan` refuse a left chat: "you left chat <id>".
- **`max guide catch-up` and the first screen of `max --help` quote the filter: `max review 'date>1d' --unanswered 4h`.**
  Without quotes the shell read `>` as a redirect: it created a file named `1d`, and `review` ran without the filter.
  On cli-core 0.370.0 the scenario check in the tests catches such characters outside quotes.
- **"Works with" spells memo's scenario title the same way as memo and the other tools:** "One person across every
  tool", capitalised.

## 0.65.0 — 19.10.2026

### New

- **`store clear --left` names the chats it deletes** (cli-core 0.353.0–0.362.0). The refusal without
  `--allow-dangerous` lists the first 20 by id, title and message count; the new `--dry-run` shows them all in
  `left` and deletes nothing; the answer after deletion carries `left` too.

### Changed — may break scripts

- **Without a terminal, `session start qr` and `setup` print the QR code as text, and `--qr-file` is gone.** The owner
  logged in through a PNG that the agent opened in an image viewer — a separate window that is easy to lose. Now the
  code goes to stderr as plain text (`█▀▄` characters, no colour, readable on a dark theme), and the agent pastes it
  into the chat as a code block. With `--json` the code is also a `{"event":"qr","qr":{"text","expires_at","scan"}}`
  line on stderr. In a terminal the code is drawn as before. A script with `--qr-file` now gets an unknown-option
  error. How an agent logs in: [sessions.md](./sessions.md#вход-через-агента).

### Fixed

- **A chat the owner returned to no longer stays marked "left"** (cli-core 0.352.0). An incomplete chat list and a
  login remove that mark from the chats they name; "archived" and other states stay. Before, such a chat could
  disappear from `max chats list`, and `store clear --left` deleted it with its messages. A full list still marks as
  "left" the chats missing from it.

## 0.64.0 — 19.10.2026

### New

- **`session start qr --qr-file <png>` and `setup --qr-file <png>`**, as in tg and wa: the QR code is written to a PNG
  for the agent, without a terminal. The file is created with mode `0600` from the start and removed after login. QR
  login now goes through `loginQr` from cli-core 0.347.0, one for all three CLIs.
- **The next step in `--json` output and in an error carries `line` — the whole command with the profile**
  (cli-core 0.348.0): `"line": "max personal mcp config"` beside `"command": "mcp config"`. A copied bare `command`
  failed with "name a profile". `command` is unchanged; MCP answers have no `line`.

### Changed — may break scripts

- **A narrow terminal no longer opens the QR code in a browser.** The code is not drawn, and `max` says to widen the
  window or pass `--qr-file`. Why: QR login is now shared by tg, max and wa, and a browser that opens by itself could
  not be moved into cli-core for all three. MAX issues one code per run, so there is nothing to wait for in a narrow
  window: stop the command and run it again wider or with `--qr-file`.
- Without a terminal, `session start qr` and `setup` answer the same as tg and wa: "shows a QR code to scan — run it in a
  terminal, or pass --qr-file <png>".

### Fixed

- **The login step in `setup` is called "Link this device"** and no longer asks to scan a QR code before it is
  drawn. The line under the code itself says where to scan; in a narrow terminal, only the hint to widen it.
- **A narrow terminal no longer asks to scan a QR code that is not there** (cli-core 0.350.0). `session start qr` and
  `setup` wrote "scan this code with the MAX app on your phone" before the code; if the code did not fit, only the
  hint to widen the window or pass `--qr-file` followed. Now the line "scan in the MAX app on your phone" comes after
  the drawn code or the `--qr-file` note, and a narrow terminal shows only the hint.
- **Hints in errors and notes name the profile**: "the store is behind this build — `max personal store
  migrate`" instead of `max store migrate`, which failed with "name a profile" when copied. The same for the hint
  to download the speech model: `max personal models audio download gigaam-v3`.

## 0.63.0 — 19.10.2026

### New

- **`max --help` and `max` with no command show a short first screen** (cli-core 0.345.0): what max can do, the other
  WireCat tools and where to go next — `max commands`, `max guide`, `max help options`, `max skill show`. It no
  longer prints the full command list and all the global options.
- **`max guide` — scenarios: which commands to run, in order, for a common task.** Four scenarios: `catch-up`
  (go through what has piled up), `find-what-was-said` (find what someone wrote), `agent-on-a-timer` (a scheduled
  agent that cannot send) and `post-as-a-bot` (write as a bot). `max guide <имя>` prints the steps, `--json` the
  same as data. The `memo guide person-brief` scenario is shown under "Works with".
- **`max help options`** prints the options of every command, **`max --help-all`** the former full help.
- **`max commands` without `--json` prints the commands by section** (Read, Write, Organise, Automate, Set up), one
  line per command; `max commands <путь>` narrows it.
- **Each command's help ends with Returns, Next usually and Example lines**, and the same lines are in the
  [command reference](./commands.md).

### Changed — may break scripts

- **`npm install -g` no longer installs the agent skill by itself.** It silently wrote to `~/.claude/skills` and
  `~/.agents/skills`, and npm hides the install script's output. Now the skill is installed by `max <профиль> setup`
  or `max skill install --for all`; `MAX_INSTALL_AGENT=all` (or an agent name) at install time installs it right
  away, as before. The Windows installer passes `all` itself and behaves as before.
- **`max --help` no longer lists the commands and global options.** A script that looked for them there needs
  `max --help-all` or `max help options`.
- **`max commands` without `--json` prints text, even into a pipe.** It used to print the whole JSON document
  (hundreds of kilobytes); a script that parsed it needs to add `--json`.
- **A typo in an option of a list that takes a query is an unknown-option error** (`unknown option '--limt' (Did you mean
  --limit?)`), not a query word. A negation such as `-kind:channel` is still part of the query.

### Fixed

- **`inbox` and `review` declare their output** (cli-core 0.345.0): `max commands schema inbox` gives the fields of
  the message summary, and `--json=<поля>` with a name it does not have refuses with the list of fields instead of
  returning empty records.
- **`--brief` and `--full` no longer mention mail** in max's help.
- **A typo in a profile name no longer creates a profile.** `max typoprofile chats list` refused but left a
  `profiles/typoprofile.json` file, and then the "name a profile" error and `max complete` offered `typoprofile` as
  a profile on this computer. Now the file appears only at login; `session end` for such a name does not create it
  either. Files left by earlier typos can be deleted from `~/.local/share/max-cli/profiles/`.
- **`max <профиль> doctor` without a token suggests `max <профиль> setup`**, like the README and the "no session"
  error, not `session start`.

### Security

- **The write ban takes effect before connecting to MAX** (cli-core). Under `MAX_READ_ONLY=1` or with the `readonly`
  or `deny` level, `messages send`, `messages edit`, `messages delete --for-everyone`, `reactions add` and other
  writes first connected to MAX and only then were refused; with a broken login they exited with code `10`. Now it
  is code `5` with no connection, as the [security page](./security.md) promises. The refusal stays in `sends list`
  as a short line: the command key and the kind, and the chat only if its id was given.
- **`--dry-run` under `MAX_READ_ONLY` no longer answers "allowed"** for a write that a real run would refuse.
- **`max mcp` under `MAX_READ_ONLY` does not offer writes to MAX**, and calling such a command through `max_write`
  gets the ban's refusal, not "no such command".

## 0.62.0 — 18.10.2026

### New

- **Over `max mcp` an agent gets every command the profile's levels allow** (cli-core 0.341.0). The server used to
  offer 141 hand-written tools; now the tools are built from the commands themselves, and the agent has 181
  commands, among them `messages sync`, `contacts sync`, `chats members fetch`, `chats tracking add/remove`,
  `contacts link/unlink`, `mentions confirm/reject/rebuild`, `conversations embed`, `images embed`, `tasks reject`,
  `contacts import`, `account privacy set` and `chats app`. What the agent may not do is decided by the profile's
  levels: set the area to `readonly` or `deny`. The full list is pinned in `contracts/mcp-catalogue.json`.
- **`conversations rebuild`** builds again the conversations of chats that changed and computes their vectors with the
  model on this computer; it does not ask MAX, downloads no model and sends no text anywhere. It replaces the agent
  tool `conversations_refresh`.

### Changed — may break scripts

- **`max mcp` tool arguments are named as the command options**, in snake_case: `chat`, `limit`, `query`,
  `sync_first` and so on. An agent that remembered the old names needs to ask `max_tools_search` again.
- **An agent's `search messages` no longer takes the structured `ast` query**, only the query text, as on the
  command line.
- **An agent cannot mark read or act on the owner's behalf**: `--mark-read` on `messages list`, `inbox` and
  `review`, `--as-owner` and `messages send --allow-any-file` are not offered to the agent, and the `catch_up_marks_read` setting does not
  apply to its runs. Its `--new` checkpoints are separate from yours.

### Fixed

- **`max mcp` answers every call received before stdin closed**, instead of exiting and dropping one still
  running. `max bot mcp` does not do this yet.
- **`max tasks --help` no longer promises that `serve` opens tasks.** The help said "review and serve add
  them". Now it says that tasks are opened by `review`, `inbox` and `messages sync`, and `serve` opens only requests
  from auto-reply rules.
  Why: `serve` in MAX does not check questions and mentions as they arrive. Anyone who kept `serve` running and waited
  for tasks saw an empty list until the next `review` or `messages sync`.
  What to consider: the behaviour has not changed. An empty `tasks list` now says the same (cli-core 0.341.0).
- **`max mcp --help` suggests `claude mcp add max -- max <profile> mcp`** (cli-core 0.341.0). The old hint without
  a profile always failed with "name a profile", and the agent got a server that did not work.
- **On Node 22, commands that open the store no longer print `ExperimentalWarning: SQLite is an
  experimental feature`** (cli-core 0.341.0). Agents took these two lines in stderr for an error. Other warnings are
  printed as before.
- **`tags remove` by a tag alias removes it the same way `tags add` sets it** (cli-core 0.341.0).
- **Startup is a little faster** (cli-base 0.45.0): the vocabulary and rule tables are no longer parsed on every
  start, only when the server for the agent starts.

### Security

- **`attachments extract --output-dir` refuses key folders, `max`'s own folders and the store folder**
  (cli-core 0.341.0), as the agent tool already did.

## 0.61.0 — 18.10.2026

### New

- **`tasks agenda` shows what others owe you** (cli-core 0.328.0): open tasks that someone else is doing, in a
  separate section and as `assigned` in `--json`, oldest first.
- **An agent can mute and unmute a chat** (cli-core 0.338.0): `chats mute` and `chats unmute` are now among the
  `max mcp` tools. Each is checked against its own key (`chats.mute`, `chats.unmute`); nobody in the chat is told.
- **Examples in the help** for `account privacy show`, `account privacy set`, `chats mute`, `chats unmute`,
  `messages pin`, `messages unpin`, `metadata get` and `metadata refresh` (cli-core 0.336.0, 0.339.0).

### Changed — may break scripts

- **`bot messages send --reply-to` accepts only a MAX message id, `mid.…`**, and so does an agent with `reply_to`.
  Any other value is refused before sending (exit code 2). It used to go to MAX as it was.
- **`bot messages show`, `edit`, `delete`, `pin` and `unpin` also accept only `mid.…`**, and so does an agent. Any
  other value is refused before the first request (exit code 2). Before, `delete` with several ids deleted messages up
  to the first wrong one and only failed on it (`not_found`).
- **A command without a terminal that waits for a person gets 5 minutes, not 30 seconds** (cli-core 0.328.0), for
  example an agent's `session start`. `--timeout` and `MAX_TIMEOUT` still decide when set.
- **A command path given as one argument is an error** (cli-core 0.328.0): `max 'chats list' --help` used to print
  the general help with exit code 0; now it answers `validation_error` and shows how to write it correctly.
- **An agent no longer sees `offline` on `bot me`, `bot comments list`, `bot comments get` and `bot chats members list`.**
  These commands always ask MAX and refused `offline`; now the argument is not in the tool description (cli-core 0.335.0).
- **`conversations build` and `conversations embed` are marked as changing something outside this computer** (cli-core
  0.334.0, 0.336.0): with `--analyze` and `--provider` they send conversation text to an external service, and `search
  conversations` with a remote model sends the query there. Under `MAX_READ_ONLY` all three refuse before sending;
  a model on this computer or on a local server works as before. They do not run through `max serve`. In `docs/commands.md` this mark now
  reads "outside this computer: in MAX or in an external service", not "in MAX".
- **Under `MAX_READ_ONLY`, `session start`, `session end` and `setup` refuse before they start** (exit code 5, "it cannot
  log in or out"), not from inside the command.
- **Under `MAX_READ_ONLY`, local writes that delete or overwrite what you saved are refused**
  (cli-core 0.336.0, 0.337.0): `searches create`, `searches delete`, `searches clear`, `contacts alias set`,
  `contacts alias rm`, `contacts notes add`, `contacts notes edit`, `contacts notes remove`, `contacts link`,
  `contacts unlink`, `tags add`, `tags auto`, `tags remove`, `mentions confirm`, `mentions reject`,
  `attachments text set`, `chats tracking add`, `chats tracking remove`, `conversations links add`,
  `conversations links clear`, `conversations consents revoke`, `tasks reject` and their agent tools exit with code 5,
  `permission_error`. What the store rebuilds itself still works (`images embed`, `mentions rebuild`,
  `conversations embed clear`, `store jobs …`), as do sync, `serve` and task bookkeeping (`tasks add`, `scan`, `close`
  and others). Under the lock, `tasks close` only proposes closing the task, and `--as-owner` is refused.
- **While MAX restricts the account, no write goes out** (cli-core 0.334.0): a reaction, reading a chat, a quiet
  pin, changing a title or profile are refused too (`permission_error`); reading works. A ban with no end holds
  writes until you run `flood clear` or `doctor --online` finds the account well; in `--json` such a ban has
  `until: null`.
- **A send that did not get a file lock held by another process exits with code 9 (`timeout`), not 1**
  (cli-core 0.338.0): nothing was sent, so it is safe to retry. The same for `flood clear`.
- **`upgrade --offline` exits with code 2** (cli-core 0.338.0): `upgrade` asks npm, so with `--offline`
  (and with `--check`) it now refuses instead of going to the network against the flag.
- **The agent tool `messages list` no longer offers `topic:`** (cli-core 0.340.0): MAX has no topics, and such a
  condition is refused, as it already was on the command line.

### Fixed

- **A store that failed to open is closed** (cli-core 0.332.0): on Windows the folder with such a file can be deleted.
- **`doctor report create` works under `MAX_READ_ONLY` again.** cli-core 0.337.0 forbids under this lock any
  local write not marked as safe; the report only adds a new file, and now it is marked.
- **Another process's file lock no longer stops `max serve`** (cli-core 0.340.0): serve used to wait for it up to 5
  seconds, and all commands through it and the keep-alive with MAX stalled for that time.
- **Two changes to the recipient list at once no longer undo each other** (cli-core 0.338.0):
  `recipients add`, `remove` and `clear` read and write the list under one lock.
- **`store gaps repair --background` runs its job** instead of failing at once (cli-core 0.339.0).
- **Hints from `server status`, `server …` and store maintenance name the profile**: `max <profile> session
  start`, not `max session start` (cli-core 0.339.0).
- **`upgrade --check` works under `MAX_READ_ONLY`** (cli-core 0.338.0): it only asks npm about a new version.
- **Model downloads do not go through `max serve`** (cli-core 0.336.0): `models … download` and `images models download`
  download from the model server, not from MAX.
- **With serve running, `images embed` reads images through its connection**, as other reads do (cli-core
  0.337.0).
- **A restriction or ban that stopped `watch` or `serve` is remembered** (cli-core 0.334.0):
  the next command waits, as after the same error in an ordinary command.

### Security

- **`session end` no longer logs out of the account that `max serve` uses.** If serve was started manually or by a
  service, `session end` used to log out of the same MAX session serve runs on and delete its token. Now
  the command refuses (exit code 2) and asks you to run `max <profile> server stop` first. A serve started by another command
  it still stops itself. `session start`, `session end` and `setup` never run through serve
  (cli-core 0.333.0, `logsInOrOut`).
- **`chats.unmute: readonly` now stops `chats unmute`** (cli-core 0.336.0). Before, unmuting was
  checked against the `chats.mute` key, and its own key had no effect. A setting that has only `chats.mute`
  works as before until `chats.unmute` is set.

## 0.60.0 — 17.10.2026

### Added

- **`stats messages top --measure reactions` shows reactions by emoji** (cli-core 0.324.0): next to the total —
  `👍 4 · 😂 3` (up to five emoji, then `+N`), and in `--json` each row has `reactions: [{reaction, count}]`.
- **`max <profile> contacts link <person> me`** (cli-core 0.323.0): mark a contact as you, for an account of yours
  that the store does not recognise by itself, such as `zoom:<id>`.

### Changed — may break scripts

- **`max bot mcp` tools are now built from the `max bot` commands themselves** (cli-core 0.325.0) and run through
  them. Arguments are named as the command's: `messages send` and `messages edit` take `md` / `html` instead of
  `format`, `messages delete` a list `messages`, `search messages` `query`, `chats members remove` `person`.
  New: `chats rules show`, `offline` on commands that read MAX, and the arguments `page`, `newest`, `notify`,
  `no_block`, `sync_first`. A write at level `ask` is allowed for the agent: there is nobody to answer the question.
- **Not offered to the agent**: `session`, `setup`, `config`, `doctor report`, `bot uploads`, and
  `--allow-dangerous` on `bot comments delete` and on `bot api`. Only the owner still runs them.

### Fixed

- **Mentions find fewer false names** (cli-core 0.323.0). A word from a contact's name counts on its own only as
  a first or last name; a contact named like a company ("Smart Agents") is found only by the whole name, and the
  polite «Ваш», «Вам», «Вас» never count. A saint's name in a place name ("Saint Michael's Bridge") and a city after
  «в»/«во» («во Владимире») are not names either.
- **Your accounts are you** (cli-core 0.323.0): an account's own identity is linked to you on the next sync, and your
  name in your messages no longer belongs to another person.
- **An address keeps its city** (cli-core 0.323.0): one street in two cities is two places; an address without a
  city still finds its place on that street.
- **In a group tagged `watch-tasks`, any member's reply closes a question** (cli-core 0.325.0). A direct reply to the
  question (a reply with a quote) from anyone other than the asker closes the task marked "answered in the group".
  Before, only your reply closed it, and questions others had already answered stayed open. A message that does not
  reply to the question closes nothing. In one-to-one chats and untagged groups only your reply still counts.

After updating, re-read old messages once: `max <profile> mentions rebuild person-name place`.

### Security

- **`MAX_READ_ONLY` now refuses login and logout, writes as the bot and store changes**: `session start`,
  `session end` and `setup` refuse with `permission_error` before connecting. So do `bot api` (every operation that
  changes something, and `get-updates`), `bot comments send|edit|delete`, `bot chats members add`,
  `bot uploads put`, and `store reset`, `restore`, `clear`, `migrate`, `repair`, `copies delete` and `decrypt`.
  Before, `session end` under this guard logged out of MAX and forgot the session, and these bot commands sent a
  request to MAX. `store repair --dry-run` under the guard still shows what would be repaired.
- **A Bot API write that max does not know how to journal is refused** with `configuration_error` instead of going
  to MAX past the recipient list and the send journal. So an operation that a future Bot API schema update adds
  cannot slip past the checks. Only `get-updates` passes without a journal: it sends nothing to anyone.

## 0.59.0 — 17.10.2026

### Added

- **A task has an assignee** (cli-core 0.320.0): `tasks add --assignee`, `tasks plan --assignee` and the
  `assignee:` filter in `tasks list` — a task can also be something someone owes you. A group tagged `watch-tasks`
  gets a task for every unanswered question, whoever it was asked of.

### Changed — may break scripts

- **No default profile is chosen any more** (cli-core 0.319.0). The `default_profile` setting is not read:
  if it is still in the settings file, a command without a profile name stops and suggests what to type.
  Name the profile as the first word — `max <профиль> …` — or set `MAX_PROFILE`, and remove the old setting:
  `max config unset default_profile`. `max config set default_profile` now refuses.
- **A profile named `default` is an ordinary name.** `max default mcp config` names the MCP server `max-default`,
  not `max`; an entry written earlier works until `mcp setup` rewrites it under the new name.
- **`tasks apply` is now `tasks scan`** (cli-core 0.320.0). The MCP tool is `tasks_scan`, the permission key
  `tasks.scan`. It works the same: it shows which tasks a chat's history would open and creates them only with `--yes`.
- **An agent can no longer delete a message for everyone** (cli-core 0.321.0). The MCP tool `messages delete` does
  not accept `for_everyone`: the argument is rejected as unknown. The owner still deletes for everyone with
  `max <профиль> messages delete --for-everyone`.
- **`mcp --permission` only tightens permissions** (cli-core 0.321.0). An override that would loosen the profile's
  level, such as `messages.send=allow` for a profile with `readonly`, is refused at server startup, naming the key.
  To allow more, change the profile's permissions; `--permission messages.send=deny` and other narrowings work
  as before.

### Fixed

- **Denying an agent `chats members list` now takes effect** (cli-core 0.321.0). Over MCP the command took its level
  from the `chats.members` key, and a denial on `chats.members.list` did not reach it.
- **`tasks show HRB-12` shows a project task** (cli-core 0.320.0). Before, a task of a project rather than an
  account was reported as not found.
- **Tasks open only where something was asked of you** (cli-core 0.317.0). In a one-to-one chat, as before, every
  unanswered question; in a group only a reply to your message and a mention of you; in a channel and Saved
  messages nothing. Before, any unanswered question in any chat became your task.
- **Editing a message does not erase what the edit lacks** (cli-core 0.317.0): the send time, reactions and service
  fields of the stored message stay as they were.
- **`max bot mcp` tools respect the server's environment.** Before, a call bypassed the variables the server was
  started with: for example, with `MAX_READ_ONLY=1` the bot still sent a message. Now a call over MCP behaves the
  same as the same command in a terminal.

## 0.58.0 — 17.10.2026

### Security

- **Internal attachment data stays out of output**, including the bot event stream (cli-core 0.315.0). Media keys and the token stay inside the client.

- **WhatsApp state files cannot be sent as attachments** (cli-core 0.314.0). The guard checks default directories, environment overrides and symbolic links; ordinary neighboring files remain allowed.

### Added

- **Names and addresses can be reviewed as mentions** (cli-core 0.311.0). `mentions rebuild person-name` and `mentions rebuild place` find them in stored text; `mentions places` lists confirmed addresses.
- **`tasks apply <chat...>` lists tasks from selected stored history.** `--yes` creates them with duplicate checks.

### Changed — may break scripts

- **The first sync opens no tasks from old messages by default** (cli-core 0.311.0). `task_first_pass_per_chat` enables their creation; `tasks apply` lets you review selected chats separately. Later syncs continue processing new messages.

### Fixed

- **`max doctor report create` writes a report even when settings are invalid.** Previously it stopped with `configuration_error`, leaving no report to share. The report now records the settings error instead of a profile check, naming the invalid setting without its value, and includes the last failed run.

## 0.57.0 — 17.10.2026

### Added

- **Drive documents appear in shared local search** (cli-core 0.301.0), with their Google URL and modification time. `--source drive:<профиль>` selects an imported profile. `chats documents list <чат>` lists documents shared in stored messages without requesting MAX.

- **The MCP server loads only when max runs as MCP** (cli-core 0.300.0): other commands load about a tenth fewer files at startup.
- **A task card shows tasks pointing back to it** (cli-core 0.304.0): `tasks show` prints `task:<id> follow-up-of this task`, while `--json` and MCP return `linked_from`. Previously only the new task showed the relation, not the closed task.
- **max starts about a quarter faster after its first run.** Compiled Node code is cached in the system temporary directory, configurable with `NODE_COMPILE_CACHE`: `max --help` takes about 0.42 seconds instead of 0.56.

### Changed — may break scripts

- **Settings errors fit on one line without repeating the value** (cli-core 0.304.0): the first invalid field, reason and number of further errors, such as `config.json: profiles.default.limitt is an unknown setting (and 2 more
  problems)`. An old field (`clientId`) suggests its new name (`rename it to client_id`, cli-core 0.307.0). Previously errors listed every problem and accepted field and quoted the value, which could accidentally contain a token.
- **`search notes` selects notes with `source:internal` or `source:file` in its query** (cli-core 0.303.0). The `--type` flag and the `type` field of MCP `search_notes` are removed. The name matches the note's `source` field. `--source notes:<папка>` still selects which accounts to read.
- **The daily update hint stays silent for `--timeout=5`, `--help=…` and other arguments separated by `=`**, as it does for `--timeout 5`. The check now comes from shared cli-core.
- **Commands unsupported by MAX are hidden** (cli-core 0.299.0). `messages send`, `chats mark-read` and `polls create` have no `--topic`, because MAX has no forum topics. `messages list` rejects `topic:`; `chats requests
  accept` and `decline` have no `--all` or `--link`, so a person is always required. Previously these options were shown but refused.
- **`max doctor` responds even when settings are invalid.** Previously it returned `configuration_error` and exit 3; it now returns `config: {error: …}`, naming the invalid setting, and exits 0. `doctor` is used precisely when settings are broken. Scripts that checked its exit code for invalid settings must inspect `config.error` instead.

## 0.56.0 — 16.10.2026

### Added

- **`tasks reject` refuses an agent's suggested task close, and `tasks list close:suggested` finds those tasks** (cli-core 0.295.0). `tasks agenda` shows the reason `close-suggested`; the owner confirms with `tasks close <задача>`, without needing `--as`. Shared-store settings `task_agent_close` (`on` by default) and `task_agent_close_min` (0.8) control agent closes; `config show` displays them.
- **A new task about one closed in the last 14 days becomes its follow-up** (cli-core 0.295.0): `review` and `tasks add` link it to the closed task with `follow-up-of`. The closed task stays closed and does not enter `tasks duplicates`; `tasks show` displays the link.
- **59 default task categories instead of 7, with up to 80 in the list** (cli-core 0.295.0 and 0.296.0): `bills`, `health`, `travel`, `fitness`, `subscriptions` and more. `tasks categories` prints each meaning and its English, Russian and Spanish rule words. A store whose list was saved with `config set task_categories.*` keeps its own; `config unset task_categories` selects the new defaults.
- **Categories removed from the list remain visible** (cli-core 0.296.0): `tasks categories` names them and counts their open/total tasks (`unlisted` in JSON); `tasks agenda` names categories still carried by open tasks (`unlisted_categories`).
- **Spanish task support** (cli-core 0.296.0): an `es:` trigger matches other forms of a word (`pagues` — `pagar`) for Spanish messages, and duplicate checks understand dates such as `mañana`, `el viernes`, `15 de noviembre`.
- **Duplicate checks run again after linking a message** (cli-core 0.295.0): after `tasks link <задача> msg:…`, `tasks add --into` and `tasks merge`, similar tasks appear in `tasks duplicates`; the response's `review` field counts them. The link remains, and nothing merges automatically.
- **`commands --json` states a command's lifetime** (cli-base 0.38.0): `serve` and `watch` have `lifetime` — `persistent`, while `setup` and `session start` are `interactive`. Previously the program inferred them from their names.

### Changed — may break callers

- **An agent closes a task only with `--certainty <0..1>`, and an uncertain close waits for the owner** (cli-core 0.295.0). `AI_AGENT` or `CLAUDECODE` identifies an agent; `--as-owner` closes as the owner. An agent can be wrong, and closed tasks disappear from the owner's agenda. An agent's `tasks close` without `--certainty` refuses with `task.certainty-required`; MCP `tasks_close` requires the new `certainty` argument. Below `task_agent_close_min` (0.8 by default), or with `task_agent_close off`, the answer has `state: open` and `close_suggestion`, and the task stays open.
- **`tasks add` no longer refuses when only closed tasks match** (cli-core 0.295.0): it opens a new task with `follow-up-of` (`follow_up_of` in the answer). Exit code 2 still applies when an open task matches. A script expecting code 2 for a closed match now receives a new task.
- **Rules choose narrower categories: electricity bills become `bills` instead of `money`, and a doctor becomes `health` instead of `personal`** (cli-core 0.295.0 and 0.296.0). The original seven categories keep their names/meaning; stored tasks do not change. A filter such as `tasks agenda category:personal` catches fewer new tasks. Some words move to narrower categories: `gym` to `fitness`, `restaurant` to `food`, `переезд` to `moving`.
- **Duplicate checks read the task's underlying messages** (cli-core 0.295.0): the source and five most recently linked messages. A rule-created task without its own text is compared by message words, so `tasks add` can refuse with code 2 where it previously opened a task.
- **`max mcp` and `max <бот> bot mcp` now use the shared MCP server, like `tg`.** Tools remain `max_read`, `max_tools_search` and `max_write`. `chats check` in `max_write` is replaced by `chats moderate`; the `chats rules` alias is gone, leaving `chats rules show`. `max bot mcp` no longer accepts `--allow-send`, `--allow-delete`, `--allow-moderate`, `--confirm-send` or `--allow-dangerous`. MAX and TG share the same tested behavior. These old `bot mcp` flags previously enabled nothing; now they prevent startup with exit code 2 and “unknown option”. Remove them from application settings; `max <бот> bot mcp config` prints the replacement. Agents using `chats check` or `chats rules` need the new names. `max mcp config` no longer includes `--yes`: MCP writes at `ask` already run without a question. Voice over MCP is downloaded, then transcribed on this computer, as in `tg`. `chats moderate` reads its checkpoint only from the rules file; very old session checkpoints are no longer migrated.
- **`setup --json` puts next commands in the envelope's `next`, not `item.next`.** The `item.next` object with `instructions`, `chats`, `history` and `skill` becomes two top-level read steps: `skill show` and `chats list --limit 5`. All commands put next steps in one place for agents. Scripts reading `item.next` must read `next`. History download and skill installation remain in human output only.
- **`chats media` returns messages with the same shape as chat history.** Voice is now `voice`, rather than `audio`, as in `messages list`. MAX file/video IDs are inside the attachment's `provider_ref` (`provider_ref.file_id`, `provider_ref.video_id`), not at its top level. Previously `chats media` returned MAX-specific attachments. Scripts that expected `audio` must look for `voice` and read `file_id`/`video_id` inside `provider_ref`; `--type audio` still selects voice.
- **`max watch` renders messages through the same code as `messages list`.** Polls show the question, answers and vote counts. JSON and `--jsonl` stay unchanged. Human output may look slightly different from 0.55.0; scripts should use `--jsonl`.

### Fixed

- **`doctor report create` also labels reply-target message IDs and write-attempt IDs.** Labels correlate records within one report and change for the next report.

### Security

- **Every write is checked in one shared guard, through the terminal, `max serve` and MCP.** Sends, edits, deletions, reactions, mark-read, forwarding, moderation and chat/contact/account changes share permission levels, `MAX_READ_ONLY`, recipient lists and the send journal. Writes visible to others (messages, forwards, edits, deletions, new groups and adding people) also share the hourly limit. `deny` and `readonly` refuse writes. At `ask`, the terminal asks or waits for `--yes` (`--allow-dangerous` for deletion); `--json` without a flag refuses. MCP writes at `ask` run as before, governed by profile permissions, including server `--permission` overrides. `MAX_READ_ONLY=1` refuses any write, including MCP. Previously MCP checks used a separate MAX path; now that path is shared with `tg`. Terminal commands keep their behavior. To prevent an agent deleting or sending without you, set the action to `deny` or `readonly`, rather than `ask`: these tools are not offered to the agent.

## 0.55.0 — 15.10.2026

### Changed — may break scripts

- **Flags of shared commands follow the shared vocabulary; the old names are no longer accepted** (cli-core 0.288.0):
  `--budget` → `--max-pages`; `messages sync --estimate` → `--dry-run` (max still rejects it: MAX message ids do not
  tell how many are missing); `contacts context --refresh`, `bot contacts show --refresh` and
  `tags auto --refresh-metadata` → `--sync-first`; `search conversations --refresh` → `--catch-up`;
  `attachments show --if-sha256` → `--expected-fingerprint`; in `replies edit`, `--chats`, `--not-chats`, `--people`,
  `--not-people` → `--allow-chats`, `--deny-chats`, `--allow-people`, `--deny-people` (the rules file does not change);
  `schedule --once` → `--at-time`; `bot chats moderate --no-ban` → `--no-block`; `chats mark-read --until` →
  `--until-id`; `tasks add|plan --check` → `--remind-time`; `tasks add --attach` → `--into`; `tasks claim --for` →
  `--lease`; `tasks agenda --due` → `--due-within`; `server logs --lines` → `--limit` (`-n` stays); in `chats start`,
  `--payload` → `--start`, as in `chats app`; `store export --to/--kind` → `--output-dir/--include`.
  Why: in max, tg and the other WireCat CLIs one word means one thing, and an agent does not have to remember a flag
  name for each program.
  What to check: an old name ends the command with exit code 2 ("unknown option") before connecting to MAX — check
  scripts and schedules (`schedule list`). In MCP the argument is the new flag name in snake_case, for example
  `max_pages`, `until_id`, `expected_fingerprint`, `output_dir`, `allow_chats`, `at_time`. In `search conversations`, do
  not change `--refresh` to `--sync-first`: that flag already existed and first reads new messages from MAX, while the
  former search preparation is now `--catch-up`.
- **`tasks similar` is now `tasks related`, and `tasks duplicates unsure` is `tasks duplicates defer`**, without the old names.
  Why: the same shared vocabulary.
  What to check: in MCP, find the commands `tasks related` and `tasks duplicates defer` through `max_tools_search`. The
  permission key is `tasks.duplicates.defer`. The old key `tasks.duplicates.unsure` in the settings file now only
  warns in stderr and has no effect, so the command gets the `tasks` level: remove it with `config unset` and give
  the same level to the key `tasks.duplicates.defer`. In the database the decision is still called `unsure`.
- **`tasks agenda` and `tasks duplicates` filter with query fields, not flags**: `tasks agenda --tag <имя>` →
  `tag:<имя>`, `--category <имя>` → `category:<имя>`, `--claimed` → `claimed:any` (also `none`, `mine`, `others`; by
  default, as before, unclaimed and your own); `tasks duplicates --unsure` → `decision:unsure` (by default
  `decision:review`).
  Why: the database filters the list, as with the other lists, not the program after reading.
  What to check: an OR or NOT that mixes task fields with `chat_kind:` is rejected (`query.unsupported-placement`).
  In MCP these commands take `query` instead of `tag`, `category`, `claimed` and `unsure`.
- **Every `--json` answer is an envelope: `item` for one thing, or `items` + `page` for a list, and `meta`.** Now the
  ones that returned a bare object answer this way too: the `--dry-run --json` preview (under `item`, snake_case keys:
  `business_rules`, `action_invoked`, `write_reserved`, `messenger_contacted`, `configuration_read`),
  `mentions confirm|reject` and `images embed --json`, `max_tools_search` in MCP (`{items, more}` →
  `{items, page, meta}`) and the MCP resource `max://chat/<id>` (the chat and messages under `item`), as well as `bot me`, `bot api …` (the Bot API answer is inside `item` unchanged, an empty answer is
  `null`), `contacts sync`, `contacts lookup` (`displayName` → `display_name`, `lastMessagedAt` → `last_messaged_at`),
  `doctor report`, `doctor report create` (`sendTo` → `send_to`) and `setup` (`chats.hasMore` → `chats.has_more`).
  Why: an agent parses any answer the same way.
  What to check: read fields from `.item`; instead of `more`, use `page.has_more`.
- **A damaged local copy of the messages is an error, not an empty copy** (cli-core 0.286.0). Before, a command that
  connects to MAX silently went on without it. The copy is skipped only if it does not exist, if the account is not
  recorded yet, or if another process (`serve`) holds it for more than 5 seconds.
  Why: an answer without the copy looked complete, although it lacked what was saved.
  What to check: such an error is a reason for `max <профиль> store repair --dry-run`.

### Fixed

- **The next-step hint includes the profile** (cli-core 0.286.0): after `max personal …` the `→ …` line also
  starts with `max personal`, and pasted as is it works instead of asking to choose a profile.

### Removed

- **Opening the database no longer deletes the old `messages.db` file** and no longer says so in stderr (cli-core 0.286.0).
  If the file is left over from old versions, delete it yourself.

## 0.54.0 — 15.10.2026

### What's new

- **Tasks can be claimed, tagged and sorted into categories**: `tasks claim <задача> [--for 30m]`,
  `tasks release`, `tasks categories`, `tags add|remove --task`, `tasks agenda --claimed` (cli-core 0.282.0).
- **Tasks that may be the same work** (cli-core 0.285.0): `tasks similar <задача>` scores similar
  tasks; `tasks duplicates [--unsure]` shows pairs found by rules, `tasks merge <задача> --into <другая>`
  merges them, `tasks unmerge` undoes a merge, `tasks duplicates reject|unsure` decides a pair. `tasks agenda`
  accepts `--category` and `--tag`, and `config set task_categories.<имя>` changes the list of categories for the whole store.
- **Mentions** (cli-core 0.285.0): `mentions domains` shows the sites that links point to;
  `mentions list --new` shows what was found since the last look; `mentions confirm|reject <id> --all-in-chat` decides a name in
  the whole chat. `config set phone_countries es,ru` reads numbers written without `+`.
- **Database version 16**: the mention rules read the text of notes and of saved documents, and one `mentions rebuild`
  reads those saved earlier; `mentions list` still shows only mentions in messages. The update
  adds only triggers, so an earlier version of max can still open the database.

### Changed — may break scripts

- **Settings are named only in snake_case** (cli-core 0.283.0): `config set` and `config unset` no longer understand
  camelCase, and a camelCase key in the settings file counts as unknown. The shared store settings are now
  `search_stemmers.cyrillic`, `search_stemmers.latin` and `account_groups.<имя>`.
- **`tasks add` requires `--category <имя>`** from the list shown by `tasks categories` (`money`, `documents`, `meeting` and others);
  if nothing fits, use `--category other`.
- **`MAX_READ_ONLY` now also forbids writing in max**: before, this variable did not reach the write check.
- **`tasks add` refuses if the task may be the same work** as one that is open or was closed in the last 14 days
  (cli-core 0.285.0): exit 2, reason `task.duplicate-candidates`, candidates in `details.candidates`. Repeat with
  `--attach <задача>` to attach the message to it, or with `--new` to open a new one; through MCP, `tasks add`
  behaves the same.
- **`phone:` and `value:` also find a stored number that ends with the national digits of the one typed** (8 or more;
  cli-core 0.285.0), so a number stored before `phone_countries` is found in any form. A Russian city
  number written in groups, `(812) 000-00-01`, is now stored as `+78120000001`, not as bare digits.
- **`max search mail` is gone: memo searches mail** (owner's decision of 14.10.2026, cli-core 0.285.0,
  cli-core#1121). MCP has no `search_mail`. `max search all` searches messages and notes (and meetings, if `--source`
  names them), but never mail; `--only mail` is rejected. Instead of "unknown command", `max search mail …` answers with
  a hint: ``mail is memo's: install @wirecat/cli-memo, then `memo search mail …` ``. Tasks, contact notes,
  tags, `search notes` and `search all` stay in `max`.

### Fixed

- A title with capital Cyrillic letters is found by a lowercase query (cli-core 0.285.0).
- **Harmful HTML in an attachment no longer hangs reading** (cli-core 0.285.0): a page made of unclosed tags or
  comments is read in time linear in its size.

### Security

- **`messages send --file`, sending from MCP, and profile or group photos do not take files from places with credentials**
  (cli-core 0.283.0) — the same list as `bot uploads put` since 0.53.0: SSH and cloud keys, `.netrc`,
  `.git-credentials`, gh, docker and kube settings, Claude and Codex credentials, keyrings, browser profiles,
  password stores and WireCat app folders; on macOS and Windows without case. Before, they refused
  only `.ssh`, `.gnupg`, `.aws`, `.env` and similar, and max folders. If you need exactly such a file, use `--allow-any-file`.
- **The list of places a file is not sent from is now one for all WireCat apps**: max takes it from
  cli-core and no longer keeps its own copy. If the file does not exist yet, links in the folders above it are also resolved.
- **Under `MAX_READ_ONLY`, you cannot change what would allow writing later** (cli-core 0.281.0): `schedule
  command|agent|remove`, `config set|unset`, `recipients add|remove|clear`, `flood clear`, `server
  install|uninstall`, `mcp setup`, `skill install`, `upgrade`, model keys and `bot auth` answer
  `permission_error`. A scheduled agent runs with this variable and could earlier schedule a send for later;
  now it cannot, and a schedule saved under it also runs read-only. Reading, sync,
  tasks and notes work as before.

### Removed

- **Compatibility code.** `max mcp` and `mcp config|setup|doctor` no longer accept `--allow-send`, `--confirm-send`,
  `--allow-mark-read`, `--allow-delete`, `--allow-moderate`, `--allow-dangerous` and `--http-confirmation`; set access with
  `permissions`. `messages download --output` is removed; `--output-dir` remains. The command `config migrate` is
  gone. The settings `read_only`, `allow` and `mcp_tools` are removed: a file with them is not read; set
  `permissions.<ресурс> readonly` instead. `doctor` does not look for the old cache file (`legacy_cache`), and `inbox` no longer carries over
  the old `lastCheckAt` mark.
- **Moving folders at startup** (from `~/Library` and into the WireCat folder): it is already done.
- **The old search language**: `search messages` and `searches create` no longer have `--language` and `--regex`. Save
  again any saved search written in the old language.
- **`conversations embed --workers`.**

## 0.53.0 — 15.10.2026

### What's new

- **`config set` and `config unset` accept camelCase setting names** (cli-core 0.279.0): `max <профиль> config set
  senderColors false` writes `sender_colors`, and `max <профиль> config set readOtherBots true --bot` writes
  `read_other_bots`. Command paths after `permissions.` keep their spelling.

### Fixed

- **`max bot uploads put` and uploads through the code API refuse files from credential, keyring and browser-profile
  folders**, as other uploads do; names are compared without case on macOS and Windows.
- **A send MAX refused for rate limiting can be repeated**: when `messages send`, `messages forward` or
  `polls create` receives a rate-limit refusal, the error's `retry.safe` is `true`: the message was not sent.
  If the limit arrives during a retry after a lost response, it remains `outcome_unknown` and `retry.safe: false`.

## 0.52.0 — 14.10.2026

### What's new

- **Sync continues where it stopped**: `store jobs show` shows `progress`, and `messages sync --all`
  no longer trips over a chat that is already busy (cli-core 0.276.0).
- **`max watch` no longer crashes with a stack trace if an event handler throws**: the subscription ends with that error,
  and the connection to the server stays.
- **Files and videos are streamed from disk while they upload** (cli-core 0.272.0). `max messages send --file`,
  `--photo`, profile and group photos and `max bot` no longer read the whole file into memory before sending, and the
  refusal for files of 2 GiB or more is gone. A voice message is still read whole — its length and waveform are computed from it — up to 256 MiB.
- **Picture search: `max <профиль> images embed` and `max <профиль> images models download|list`.** Turn it on with
  `max <профиль> config set picture_search true` (off by default); the `clip-b32` model is downloaded once
  (about 155 MB), and `images embed` computes a vector for each picture in the local store. Message search by words then
  returns `pictures` next to the matches. Why: to find a picture by what it shows.
  What to consider: picture queries are English only; the agent translates them itself. More in
  [search](./search.md#картинки-поиск-по-тому-что-на-них-изображено).

### Changed — may break scripts

- **`max store export --format jsonl` writes the same records to files and folders as to the screen**: snake_case, `chat_id`;
  a deletion line is `{ "id", "chat_id", "deleted": true }` (cli-core 0.276.0). What to consider: the new build does not
  append to a folder exported earlier; export to a new folder.
- **`max watch --jsonl` writes messages in the same shape as `messages list`**: snake_case, with `ref` (`chat_id`,
  `chat_title`, `sender_name`). `--events` lines are snake_case too: `chat_id`, `message_id`, `user_id`, `up_to_time`,
  `unread_count`. A person sees the same as before. What to consider: scripts that read `chatId` take `chat_id`.
- **A voice message without text goes into `missing`** in `review`, `inbox`, `messages list` and MCP, so the agent sees
  that it still needs a transcript (cli-core 0.275.0).
- **A next step to a command that changes only this computer does not run on its own** (cli-core 0.273.0):
  the `server restart` and `store reindex` steps carry `safe_to_auto_execute: false`.
- **`mentions rebuild` takes the kind as an argument**: `max <профиль> mentions rebuild person-name`, not `--kind`
  (cli-core 0.272.0).
- **`max doctor --json`, `session start` and `session end` answer with a snake_case envelope**: `{item, meta}`, keys
  `legacy_cache`, `keyring.moved_by_environment`, `session.state_file`, `revoked_on_server`. A person still
  sees lines of text. What to consider: scripts that read these answers take the fields from `item`, in snake_case.
- **`max bot chats members list --cursor` instead of `--marker`**, with no alias; the bot's MCP tool takes `cursor` too.
  The answer names the next step in `page.next`. max's own commands (`recipients`, `config`, `mcp`, `messages transcribe`,
  `bot comments`, `bot uploads`) answer the same way as the shared ones: an end line for `--jsonl` and hints on stderr.

## 0.51.0 — 14.10.2026

### What's new

- **Each `max watch` has its own queue.** A slow watcher no longer holds up the others; the buffer is 64 MiB per
  watcher and 256 MiB in total, `max serve --max-subscriber-buffer-bytes` and `--max-subscriber-total-buffer-bytes`
  change them, `0` removes the limit.
- **`max mentions`: phones, e-mail, links and Google documents from stored messages** (cli-core 0.264.0,
  database version 7). `mentions list kind:phone`, `mentions list domain:google.com`; a word without a field is a value in
  any record, `89001234567` finds `+79001234567`. `mentions show <id>` shows the text around it. Messages stored
  earlier are read by a single `max <профиль> mentions rebuild`; new ones are read as they are written.
- **`max mentions confirm|reject`, mentions in files and voice messages, search by `phone:`, `email:`, `url:`, `domain:`**
  (cli-core 0.269.0, database version 11). `mentions confirm <id> [person:<uid>|organization:<id>]` records whose
  phone or address it is (organizations too), `mentions reject <id>` dismisses the value for good; the author of the
  record is the agent or the owner (`--as-owner`). Text from files and voice transcripts also yields mentions (field
  `file_text` or `transcript`); ones stored earlier are read by a single `mentions rebuild`. Message search finds them
  by `phone:"8 900
  000-00-01"`, `domain:docs.google.com`, `email:"ana@example.com"`. Older builds read the database as before.

### Changed — may break scripts

- **Built on `@wirecat/cli-core` 0.269.0: `contacts timeline` pages like the other lists.** A list cut by
  `--limit` answers `page.has_more: true`, `page.cursor` and a `page.next` step (`--cursor` continues with the same
  `--scope`, `--since-time` and `--until-time`); it used to be `has_more: false` and `meta.truncated`. `meta.truncated`
  stays for changes still waiting in the queue. The "cut at --limit" note on stderr is gone. What to update: scripts
  that read `meta.truncated` from `contacts timeline` read `page.has_more`.
- **Error keys are snake_case for `max bot` too, and for a send with no answer.** The MAX refusal code for a bot is now
  `error.details.max_code` (it was `maxCode`); `outcome_unknown` on a message send returns `send_id` (it was `sendId`).
- **On `@wirecat/cli-core` 0.270.0 and `@wirecat/cli-base` 0.27.2.**
- **`--json=<поля>` replaces `--fields` and `--agent-json`; they are gone.** `--json=id,text` keeps these fields of
  each item. JSON in the CLI keeps text as it is; MCP answers still show invisible characters.
- **`tags list`, `tasks list` and `conversations list` take a query instead of filter flags.**
  `tags list tag:work type:chat`, `tags list sources:auto`; `tasks list state:open kind:promise chat:<id>`;
  `conversations list <чат> started_at>=7d`. These lists no longer have `--tag`, `--type`, `--source`, `--state`,
  `--chat`, `--before-time` and `--since-time`. The items are shared entities: a tag names what it is on as `target`,
  a conversation returns `messages_count`, `started_at`, `first_message`.

### Fixed

- **`max serve` no longer loses the login if it was closed just as MAX answered.** The profile state and the refreshed
  token are saved before the check for closing: MAX has already counted this login, and the next run does not log in again.
- **A full shared `max watch` buffer disconnects whoever holds the most**, not whoever is written to next.
  The refusal reaches `watch` with code `invalid_response` and reason `output.too-large`, not `provider_error`.
- **The record of a failed run again keeps the MAX refusal code** (`providerError`, for example `proto.payload`). Since
  cli-core 0.263.0 it is read from `error.details.provider_error`, but max wrote `providerError`, and the code was lost;
  the "already voted" poll check and the retry after `not.found` now look at the new key too.
- **`MaxClient` calls a file of 2 GiB or more what it is, not "it cannot be read".** A file by path in
  `send({ files })` and a group or profile photo are checked for size first: Node does not read a file of 2 GiB or
  more, and the error now says so.
- **`max <бот> bot chats members add` takes at most 100 people at a time.** The MAX Bot API accepts up to 100 ids in
  one request; a longer list is now refused before the request, with a request to split it across several runs.

## 0.50.0 — 14.10.2026

### Changed — may break scripts

- **Built on `@wirecat/cli-core` 0.262.0 (the new name of `@wirecat/cli-messaging`, follows its 0.261.0; the parity
  command is `cli-core-parity`) and `@wirecat/cli-base` 0.26.0.** Keys in machine output are snake_case: in
  `error.details` — `operation_id`, `send_id`, `retry_after_ms`; in `commands --json` — `global_options`,
  `inherited_options`, `exit_codes`, `takes_value` and `contract: 1`. The query tree in the MCP argument `ast` writes
  `lower_inclusive`, `upper_inclusive` and `must_not`.
- **HTML files are read as main text** (cli-core 0.262.0): menus, footers and banners are dropped; headings, lists,
  tables and links stay. Text already stored for HTML attachments is read again on the next `attachments extract`
  and changes. `title:`, `site:`, `lang:`, `author:` and `keyword:` search notes and files.

### Fixed

- **`max config set defaultProfile <имя>` and `config unset defaultProfile` work without naming a profile.** Before,
  the command first required a profile and failed if there were several (cli-core 0.262.0).

## 0.49.0 — 13.10.2026

### What's new

- **Built on `@wirecat/cli-messaging` 0.259.0 and `@wirecat/cli-base` 0.24.0.** The `store fetch` command is now
  called `messages sync` (same arguments, options and JSON); the old name is hidden and deprecated.
- **`--debug`:** on a failure, the full record — cause and stack — follows the error: in a terminal after the `✗`
  line, otherwise as a second JSON line.
- **`runs list` and `runs search` read a per-day index** and answer in milliseconds even across thousands of runs.

### Changed — may break scripts

- **The shared message archive and speech models move once to the WireCat folder**, `~/.local/share/WireCat/`
  (Windows: `%LOCALAPPDATA%\WireCat\Data\`), on the first run — from `~/.local/share/cli-messaging/` and
  `~/.cache/cli-common/models/`. The move overwrites nothing: if both places hold different copies, `max`
  stops with exit code `3` and names both files. `WIRECAT_STATE_DIR` replaces `CLI_COMMON_CACHE_DIR` and
  moves the whole folder. Update `tg` and `memo` together with `max`: an older CLI will create a new copy in the old place.
  [Where the files are](./installation.md).
- **One error object:** `{"error":{"code","reason","message","details"}}`. What used to sit directly in `error` —
  `candidates`, `sendId`, `operationId`, `permission` — is now in `error.details`. `reason` is a dotted identifier
  (`output_limit` → `output.too-large`, `input_limit` → `input.too-large`); `retryable` is present only if the
  failure itself set it, and `actions` only on failed items of a partial result. Code `1` is called
  `internal_error` (it was `generic_failure`), and its message no longer carries the failure's own text — `--debug`
  shows it. Keys that are not in the shared cli-messaging list are dropped from `details`: `providerError` stays
  only in the message text, and the IDs of messages that `messages delete` did not delete are also listed in the message.
- **`runs show` shows only what went wrong** (failed responses, warnings, a crash) and adds
  `eventCount`; all events with `-v`, as before.
- **`max` no longer picks a profile by itself.** If no profile is named by the first word, by `MAX_PROFILE`
  or by the `defaultProfile` setting, a command that needs an account exits with code `2` and lists the
  profiles on this computer — even when there is only one. It used to work silently with the `default` profile.
  The first login is named too: `max personal setup` (any name instead of `personal`); on a computer without
  profiles the error suggests exactly this command. Without a profile, `--help`,
  `--version`, `commands`, `skill show`, `account list` and `config show` still work. Hints in errors now
  always name the profile (`max default setup`, not `max setup`), and `max mcp config` always passes it to the server.
  Why: which account writes and reads is the owner's decision, made explicitly — otherwise an agent or a script could
  act from the wrong account.
  What to do: for everyone who used the unnamed `default` profile, `max chats list` and scripts without a profile
  stop working. The error names the profiles; use one of three: `max default chats list`,
  `export MAX_PROFILE=default` in your shell profile, or `max config set defaultProfile default`. MCP entries
  made with `max mcp config` — recreate them with the same command. [Profiles](./profiles.md).

## 0.48.0 — 12.10.2026

### What's new

- **`--brief` and `--full` on any command.** `--brief` keeps a found message's reference, chat, time,
  author, excerpt and score; `--full` returns everything.
- **`max search all` names the author of each hit** and how it was found (by words or by meaning).

- **`max schedule`: a command or an agent on a schedule** — through systemd (Linux), launchd (macOS) or
  Task Scheduler (Windows). `max schedule command <имя> --every 2h -- messages list <чат>` runs a
  max command; reading saves what was read to the store. `max schedule agent <имя> claude "<задание>" --at 08:30`
  starts an agent (claude or codex), at most once an hour. The agent runs with `MAX_READ_ONLY=1` and cannot
  send anything; its answer is in `latest.md` next to the schedule, and a desktop notification says when it is ready.
  `--once 2h` is a single run; after it the schedule removes itself. `max schedule list`, `run`, `remove`.
- **`max server install` suggests how to turn on the daily review of commitments**, and turns nothing on by itself.
- **`MAX_READ_ONLY=1` forbids the process from sending anything**, overriding the configuration file and `--permission`.

### Changed — may break scripts

- **`max search messages` returns an excerpt, not the whole text.** Each hit has `excerpt` instead of `text`:
  about 240 characters around the first query word; the whole text with `--full` or `max messages show <ссылка>`.
  Empty `editedAt`, `replyTo`, `forwardedFrom` and `reactions` are no longer printed in machine output.
  A script that read `text` from search results reads `excerpt` or adds `--full`.


## 0.47.0 — 11.10.2026

### What's new

- **Tasks get a plan, links and an agenda** (shared store 0.247.0, version 4). `max tasks add` takes
  `--title`, `--description`, `--due` and `--check`; `max tasks plan <задача>` changes them later, `none` clears
  a date. The check date is when the agent should look at the task again; it is not a reminder: the owner gets
  nothing. `max tasks link` attaches messages, chats, people, documents and links to a task;
  `max tasks show` shows the plan with its links. `max tasks agenda`, without message text, lists
  overdue and upcoming tasks, chats where the owner owes an answer (`owed`), where the owner waits for an answer
  (`waiting`), and chats whose last message is not saved yet (`unsynced`). `max skill show follow-ups` is
  a daily review for the agent: drafts only, it sends nothing.
- **Search understands comparisons with a colon.** `date:>=2026-01-01` (and `:>`, `:<`, `:<=`) is the same as
  `date>=2026-01-01`; previously this gave `invalid_syntax`. A rejected `after:` or `before:` now
  suggests the replacement: for `after:2026-09-01` the answer is to use `date>=2026-09-01`.

### Changed — may break scripts

- Shared store 0.247.0: meeting context records facts with the `fact.add` action; `memory.add` no longer
  accepts the `fact` kind.
- Shared store 0.246.0 checks new tags before creating them. A similar name needs the owner's
  review; you can use the existing tag or its explicit alias. Existing
  records are kept; automatic name and alias matches are merged into one tag.

## 0.46.0 — 11.10.2026

### Changed — may break scripts

- **On macOS, max keeps its files where it does on Linux**: `~/.config/max-cli`, `~/.local/share/max-cli` and
  `~/.cache/max-cli` instead of `~/Library/…`. The first run moves the old folders there, together with the shared store and
  speech models, and points the log of the installed `max server` agent to the new folder. While `max serve` or the
  MCP server is running, max prints one warning, works with the old folders this time and tries again on the next
  run. Nothing changes on Linux and Windows.
- **max runs on `@wirecat/cli-messaging` 0.242.0**: existing project and task keys are kept; new
  projects get short keys, and the shared store supports verifiable task dependencies.
- **max runs on `@wirecat/cli-messaging` 0.238.0; the archive is version 2.** On first open the archive is upgraded:
  memory records of the `fact` kind become facts (what happened, kept apart from conclusions), and "assigned" links
  are copied into task assignments. Earlier max builds open the upgraded archive as before.
- **Mail for search by meaning is split into chunks per thread, not per message.** Quotes, greetings and
  signatures are left out of the chunks. On the first indexing the old chunks are deleted and all mail is embedded again —
  once, and it takes time. The mail text itself and search by words do not change.

### What's new

- `--source` in `search messages`, `search mail` and `search conversations` accepts a list of accounts and groups:
  `--source group:work,max:default,email:me@work.example`. A group is saved with
  `max config set accountGroups.<имя> <список>` and is visible to every app that works with the archive.
- `max search conversations` finds mailbox mail by words too, not only by meaning.

## 0.45.5 — 11.10.2026

### Changed — may break scripts

- **Joining a chat and importing contacts count toward `sendsPerHour`.** Joining counts as one action, importing —
  one per number; `max contacts import` sends numbers 10 per request. If the limit stopped an import halfway,
  the error says how many numbers went through, and importing again is safe.

### What's new

- `max search all --backend archive|server|both` and `--server-time` — as in `search messages`; this applies only to
  messages, mail and notes are searched locally. The default is `both`.
- `max search mail --account <адрес>` searches the mail of one mailbox; without it, all of them.
- Mail is searched by recipients, folder and subject (`to:`, `cc:`, `bcc:`, `mailbox:`, `subject:`), and mail attachments by meaning.

### Security

- **Search no longer returns another account's messages.** `search messages --backend server` with `--source all` or
  `in:all` could show someone else's message with the same chat and message IDs; searching a chat without an account is now rejected.
  From `@wirecat/cli-messaging` 0.233.0.

## 0.45.4 — 11.10.2026

### What's new

- **`max search messages` without a chat also asks the MAX server**, like the search bar on web.max.ru: one request
  across all chats, one best match from each chat. What it finds is saved in the archive and checked against your
  query. With `--chat`, the server searches one chat, as before. `--backend archive` keeps the archive only;
  with `--json`, such searches now have a `server` block.

### Changed — may break scripts

- **`max search messages` with words and no chat now connects to MAX** (it used to answer from the archive only) and
  can wait for the server for up to 5 seconds. The same applies to search through MCP. To search only the archive, as
  before, add `--backend archive` (in MCP, `backend: "archive"`).

### Fixed

- Runs on `@wirecat/cli-messaging` 0.231.0, which brings cli-meetings 0.3.0 and the SQLite and ONNX 1.0.1 packages with a
  license file; nothing changes for `max`.

## 0.45.3 — 11.10.2026

### Changed — may break scripts

- Archive search with `--discover` handles questions such as “Can contractors connect to the project?”:
  the question mark no longer turns into a search pattern. Strict search and filters work as before.
- Mail search and a linked person's conversations also read the separate mail storage, alongside
  the earlier import. Mail supports sender and thread filters. In search results, an email with the same reference
  is shown once.

## 0.45.2 — 11.10.2026

### Changed — may break scripts

- **A history fetch whose very first page fails with no hope of a retry exits with an error again**
  (exit code `2`), as before 0.45.1. A wait that MAX asks for, and a failure after several pages, still
  give a partial result with `complete: false` and code `0`.

### Fixed

- **`max store fetch --background` no longer stops after 30 seconds.** The background task received the
  30-second limit shared by commands and stopped after about a hundred messages. Now it runs to the end; an explicit
  `--timeout` still limits it.
- **`max store fetch --all` waits out a short pause** that the chat list asks for (up to 5 minutes, as message
  pages already did), instead of ending at once with `rate_limited`.

### Security

- **The old `messages.db` is deleted** when the store is opened at its default path (since 0.45.1): the unencrypted file
  used before `wirecat.db`, with its `-wal` and `-shm`. One line on stderr names it. The file stays when
  `MESSAGING_STORE` is set, and while another process keeps it open.

## 0.45.1 — 11.10.2026

### Fixed

- Package references, documentation and examples use the WireCat namespace.
- HTTP attachment downloads distinguish 429 from an ordinary network failure: they stop new files and expose the `Retry-After` wait when supplied. A 413 response suggests reducing input, rather than raising a local budget.

### Changed — may break scripts

- Independent file or history-page failures retain successful work and return `complete: false`, `batch` or `issue` with exit code `0`. Scripts must check completeness; partial download JSONL adds `batch_summary`. Errors include recovery `actions`. Resuming downloads retries failed checkpoint IDs.
- Batches stop new requests after ten attempts when failures exceed 50%; `MESSAGING_BATCH_MAX_ERROR_PERCENT` adjusts the percentage, with 100 disabling that percentage stop. Throttling and authentication failures stop earlier; writes with unknown outcomes are never automatically replayed.

### What's new

- Set extraction and retained-file transfer size through `MESSAGING_ATTACHMENT_MAX_MIB` (default 50). PDF previews now allow 4000 pixels per side and 8 MiB per page; `MESSAGING_PDF_PREVIEW_MAX_PIXELS` and `MESSAGING_PDF_PREVIEW_MAX_MIB` adjust those budgets. Larger values need more memory; external OCR and decompression budgets remain separate.
- `max runs search`, also the `runs search` command in MCP `max_read`, searches safe diagnostic records by text, status, error code and time without connecting to MAX.

## 0.45.0 — 11.10.2026

### Changed — may break scripts

- **The store prunes its growing logs on open**, at most once a day: agent tool calls older than 90 days are
  deleted, and a handled bot update older than 30 days keeps its row but loses its payload. Upgrade tg-cli and
  cli-memo at the same time, as they share the store.

### What's new

- `max store reset` for a store this build cannot migrate: it backs the store up beside itself, deletes it and
  starts an empty one. It asks first; `--yes` skips the question and `--no-backup` skips the copy.
- `max search all --meetings [provider:account]` also searches one meeting account's transcripts, chat and
  summaries; `--max-meetings <n|all>` sets how many meetings it looks through (100 by default).

### Security

- **The old `messages.db` is deleted** when the store opens at its default path: the unencrypted file used
  before `wirecat.db`, with its `-wal` and `-shm`. One line on stderr names it. It is kept when
  `MESSAGING_STORE` is set, and while another process still has it open. From `@wirecat/cli-messaging` 0.222.0.

## 0.44.0 — 10.10.2026

### Changed — may break scripts

- **The local store is a new file, `wirecat.db`, and starts empty.** It sits beside the old
  `messages.db`, which `max` leaves as it is: not read, not converted, not deleted. Run
  `max store fetch --all` to bring messages back from MAX. What exists only on this computer —
  for example notes, aliases, tags, tasks and transcriptions — stays in `messages.db`. The login
  stays. Upgrade tg-cli at the same time, or the two see different archives.

### What's new

- `max contacts timeline <человек>`, also over MCP as the `contacts timeline` command of `max_read`:
  everything one person took part in, in every messenger linked to them, newest first, from the local
  store. `--scope personal|work`, `--since-time`, `--until-time` and `--limit` narrow it.

## 0.43.1 — 10.10.2026

### Fixed

- Attachment downloads use ordinary HTTP(S) and the configured transport without separate DNS validation or local-address restrictions. This preserves compatibility with VPNs, proxies and private networks; support for any particular proxy depends on the transport.
- Local PDF text extraction and page previews no longer require splitting documents after 20 pages; the separate 30-second extraction timer is removed. Overall command cancellation and size limits remain.
- Local transcription of complete mono or stereo Ogg Opus recordings no longer refuses audio after 10 minutes. Longer recordings require more memory and time.
- Attachments in ordinary hidden working folders are available again. Known credential files, CLI folders and the message store remain protected.
- Markdown export preserves message formatting; MCP preserves original Unicode on writes while showing controls visibly in responses. Configured model gateways allow ordinary redirects.
- Upgrade and MCP setup on Windows accept ordinary relative PATH entries and nonstandard command-processor environments. The message store keeps its existing schema.
- The guide clarifies that search with `--discover` reads only the local archive. Ordinary search in one chat can also query the MAX server; discovery does not.

## 0.43.0 — 10.10.2026

### What's new

- Message search with `--discover` or MCP `discover: true` finds partial word matches and eligible direct replies in the local archive without model downloads. Strict search remains the default; missing terms help agents check the evidence.

### Changed — may break scripts

- The project is now licensed under Apache 2.0. See `LICENSE` for the terms.

## 0.42.0 — 10.10.2026

### Changed — may break scripts

- **The package is `@wirecat/max-cli` and its repository belongs to WireCatLabs.** Use this package for installations and updates.
- **Deletion verifies the outcome by reading from the server.** If MAX still returns a message or verification fails, the command reports `outcome_unknown` instead of `deleted`. Read the message before retrying; acknowledging the request does not prove deletion.
- **Local transcription accepts complete mono or stereo Ogg Opus recordings up to 10 minutes.** Split longer recordings. PDF text extraction supports at most 20 pages and 30 seconds; split larger PDFs.
- **MCP makes hidden Unicode controls visible** in text results and write arguments, including converted formatting. Regional flags remain intact; ordinary CLI JSON preserves the original strings.

### Fixed

- **Attachment downloads through MCP exit without hanging.** Local text extraction no longer blocks the connection needed to download a file.
- **`messages delete` accepts comma-separated IDs** as well as separate arguments.
- **MCP guides describe profile permissions and approval in the agent app.** The server shows no approval forms; obsolete unused form code was removed.

### Security

- **Directory extraction and retained-file transfer check file locations.** Hidden files and folders, CLI-owned folders and the message store are refused, including symlink targets. MCP downloads also refuse those places; use a normal downloads folder.
- **DOCX applies the office archive limits.** Part count, expanded size and text-part size are checked before reading.

## 0.41.0 — 09.10.2026

### Changed — may break scripts

- **Everyone selected by the rules receives auto-responses until you limit the audience; there is no longer a separate list for `testers`.** `max replies audience --reply listed --allow-people <id>` leaves only selected people, `--deny-people` and `--deny-chats` exclude some. Nothing is sent unless `permissions.replies.send` is `allow`, and the new rule is disabled until you enable it. Previously, the answer only went to those who were both in `testers` and in the audience; the two lists were confused. The file, where there is still `testers`, responds to exactly the same people: they become allowed (if the audience was already `listed`, only those whom it also allowed). Allowed chats in such a file are removed, otherwise any participant in these chats would receive a response; prohibitions remain. Without `testers`, the file will be overwritten the next time you edit via `max replies`.
- **`max replies status --json` no longer has the `testers` field**; who can be answered is shown by counters `audience`. In `max replies test` and `serve`, a sender outside the audience is skipped with the reason “not on the allow list” instead of “not a test account”.

### Fixed

- **`max mcp config` transfers `MESSAGING_STORE` and `XDG_RUNTIME_DIR`** to the client configuration, as `tg` does. A client running a server with a stripped-down environment on Linux did not reach the keychain and answered “no session,” but with its own `MESSAGING_STORE` it looked in a different local archive. Run `max mcp config` again and replace the entry in the client settings.

## 0.40.0 — 09.10.2026

### Changed — may break scripts

- **The message store deletes the copies it kept for older versions** (schema version 28, cli-messaging 0.212.0). Notes, contact notes, relationships, and entities recorded before the transition to the new notes are transferred one time to the new tables during the update. After it, the old max, tg and memo refuse to open the archive with the message “upgrade this tool” - update all three together.

## 0.39.0 — 09.10.2026

### New

- **`max attachments show --page 1` returns a page of a retained PDF as PNG.** A remote agent can read every page with its own vision and save the text for search. Requires the optional `unpdf` and `@napi-rs/canvas`; it does not start an OCR API or write to the index by itself. If the MCP client shows only resource metadata, request `format: base64` and display the PNG with the agent's own tools.

- **`max search all "<слова>"` searches everything stored on this machine at once**: MAX and Telegram messages, mail imported by memo, and notes. Each result states its kind: message, email or note. `--only notes` (or `messages`, `mail`) narrows the search.
- **`max search mail` and `max search notes`** search one kind. Notes are found by words and, if a local text model is downloaded, by meaning; `--type internal` (written in memo) or `file` (from the notes folder).
- **`max search messages --type voice`** (or `text`, `file`) finds only messages of that kind.

### Changed — may break scripts

- **Statistics `--answerer` accepts stored names, aliases and @usernames.** Resolution is local to the accounts of the selected history; ambiguous names return candidates. An unknown name now fails instead of producing a report for a fabricated ID with zero answers. Use `person:provider/account/id` to explicitly select an unknown string ID. Responses add `identityKnown`; an ID without observations gets `false` and `status: unknown`. Zero observed answers do not prove inactivity ([statistics](./rankings.md)).

- **Every search moved under `max search`.** The old commands are gone:

  | Before | Now |
  |---|---|
  | `max messages search` | `max search messages` |
  | `max messages search --source email` | `max search mail` |
  | `max conversations search` | `max search conversations` |
  | `max bot messages search` | `max bot search messages` |

  For agents the tools moved the same way: `search messages`, `search conversations` and the new `search all`, which is the place to start.
- **`max search messages` no longer returns mail.** A saved search with `in:email` now asks for `max search mail`.
- **Permissions with the old paths** (`messages.search`, `conversations.search`) stop `max search` until `max config migrate` renames them, keeping their levels.

### Fixed

- **Join-request help names MAX limitations explicitly.** It no longer offers `--all` or `--link` as available operations and no longer promises chronological order; the refusal checks remain.

## 0.38.1 — 08.10.2026

### New

- **`max chats requests list|accept|decline` lists and processes channel join requests.** `--search` filters by name. MAX provides no request time: `requestedAt` is `null`. `--link` and bulk `--all` are unsupported and rejected before the request.

### Fixed

- The shared library is updated to 0.205.0 so MAX, Telegram and Memo use the same archive version. Note schema and links are unchanged.

## 0.38.0 — 08.10.2026

### New

- **`max store jobs list --state <состояние>`** shows jobs matching `running`, `done`, `failed`, `cancelled` or `died`.

### Changed — may break scripts

- **Latin words use English and Spanish stems together.** Previously, only Spanish, so the English forms of words (“budgets” → “budget”) were found worse. What to consider: after an update, the stem index is built anew on its own. A small archive - immediately upon opening, a large one - little by little: `max serve` completes it in the background, `max store migrate` - immediately. While the index is not ready, the search looks for exact forms of words and writes about this to stderr, and in JSON `query.stemming.applied` is equal to `false`. The index of the stems of the Latin text is approximately twice as large. If you specified `searchStemmers.latin` yourself, your setting remains and is still applied by `max store reindex`. Update also `tg`: the old version, opening the rebuilt archive, responds to a stem search with “update the program” ([archive](./archive.md#обслуживание-архива)).

- **Person notes (`max contacts notes`) appear in every profile that sees the person.** Before they appeared only in the originating profile. Owner notes are stored separately from messages alongside `memo` notes. Notes from multiple MAX profiles now appear together; aliases (`contacts alias`) remain account-specific.

### Fixed

- **`max chats join` no longer reports a join request as joining.** If a channel approves who joins, the command only sends a request and now answers `requested: true` instead of the channel card; while `max serve` is running, such a channel does not appear in the chat list until the request is accepted ([groups](./groups.md)).

## 0.37.0 — 08.10.2026

### New

- **Bot buttons:** `messages list` and `messages show` display numbered buttons beneath a bot's message: `[1 Да] [2 Нет]`. `max messages press <чат> <сообщение> <кнопка>` selects by number or exact text; the bot sees who pressed. Only ordinary callback buttons are pressed. Phone and location sharing buttons are never pressed; other kinds explain the next step. Buttons appear in messages read from MAX and are absent from the local copy ([usage](./usage.md)).
- **Start a bot:** `max chats start <бот> [--payload]` acts like its Start button. It accepts `https://max.ru/<бот>?start=…`, including a bot you have never messaged; its chat appears in the list. Links to people are refused. Starting is a message from you and passes send checks.
- **Bot mini apps:** `max chats app <бот> [--start]` prints a signed-in app address. Keep it private; `max` does not store it.
- **`max account list`** lists local profiles and their accounts without contacting MAX.
- **`max bot messages list`** also displays keyboards in the bot's own messages.
- **`max watch --events`** displays read receipts and chat changes (shipped in 0.36.0 but omitted there): `read` can be your own other device; `chat` reflects title, membership or departure changes. Marking unread is not a read event.

### Changed — may break scripts

- **`contacts profile`: `bot` appeared in `flags`** - `true` for the bot, `false` for the person. Previously, `flags` was always empty.

- **`watch --events`: the line `chat` comes only when something has actually changed in the chat** - name, description, participants, status, photo or owner. Previously, when `max serve` was running, it could arrive for every send.

### Fixed

- A lost reply after starting a bot or pressing its button returns unknown outcome (`outcome_unknown`, exit 14), rather than a safely retryable failure. No automatic retry occurs; check the bot's reply before repeating. The journal retains the unknown outcome.
- Viewing a group by link through `max serve` no longer adds a group you have not joined to your chat list (fixed in 0.36.0 but omitted there).
- Bare `max` and command groups such as `max chats` display help at a terminal rather than `✗ (outputHelp)`. Scripts and `--json` get an error pointing to `max --help`.

## 0.36.0 — 08.10.2026

### New

- **Files for remote agents:** `attachments show` transfers retained bytes in bounded chunks with SHA256. MCP returns complete images or binary resources, with JSON/base64 fallback. Transfer calls no model and changes no index; the agent reads the file and saves its text ([attachments](./attachments.md)).
- **The shared library update** also adds folder reads with chat names, `metadata refresh --only-missing`, background-job retry/cleanup, observed retention cohorts and counters with explicit freshness; unknown values remain distinct from zero.

### Changed — may break scripts

- **`max contacts profile` fills `seen`** with the last presence time or `online` when MAX supplies presence. A field that was previously empty can now contain a value ([people](./people.md)).
- Ranking and evidence JSON includes counter observations and freshness; evidence also supports retention-cohort selections. Check each counter's fields and selection kind before interpreting the result; unknown values or incomplete archives do not mean zero.

## 0.35.0 — 08.10.2026

### New

- **`max chats delete` and `max chats clear` remove the chat or its messages only for this account.**
  Other participants keep them. Without `--allow-dangerous`, the command asks; without a terminal it refuses.
- **Local attachment text reading:** ODT, ODS, XLSX, PPTX, EPUB, BOM-marked UTF-16 and confidently
  detected legacy encodings. No model call; formulas are not evaluated and images remain for the agent.
  No extra packages for these formats; PDF/DOCX retain optional engines ([attachments](./attachments.md)).
- **Stored administrator reports:** unanswered questions, selected people's response latency, known-join
  newcomer help and viewed channel posts with little discussion. Selections/evidence show source messages;
  missing history stays unknown, so a missing observed answer does not prove nobody answered ([rankings](./rankings.md)).
- **Stickers: `max stickers list` and `max messages send --sticker <id>`.** List added sets, or use
  `--set <id>` for their sticker ids. Send one sticker without text/files.
- **`max chats mute` and `max chats unmute`** change only your notifications, indefinitely or with `--until 8h`.
- **`max account privacy set`** changes `--find-by-phone`, `--phone-number`, `--calls`,
  `--chat-invites` (everyone, contacts, nobody) and `--hide-online on|off`; other settings stay.
  MAX only permits everyone/contacts for finding by phone; `nobody` is refused.
- **`max chats media`** reads photos, video, files, audio and links from MAX, with `--type` and
  `--before-id` ([usage](./usage.md#медиа-чата)).
- **`max calls list`** shows incoming/outgoing/missed calls and duration, newest first.
- **`max account privacy show`** shows who may find, see the number, call or add the account and
  whether online status is hidden; it uses the login response without another request.

## 0.34.0 — 08.10.2026

### New

- **`max chats update --photo` sets the photo of a group or channel** ([groups](./groups.md)).
- **`max chats folders order` changes the folder order.** The mandatory “All chats” folder comes first, followed by the named folders, then the remaining folders in their previous order ([usage](./usage.md)).
- **Your own names and notes about people: `max contacts alias` and `max contacts notes`.** They stay on this computer and are not sent to MAX; `contacts show --with-notes` displays them and `contacts list --search-notes` searches them ([usage](./usage.md#свои-имена-и-заметки-о-людях)).
- **Automatic group and channel tags: `max metadata refresh` and `max tags auto`** — based on names and descriptions, without reading messages; your tags remain untouched ([search](./search.md#метки)).
- **`max store fetch --all` downloads all chats** — the last 90 days of each; `--background` runs it in the background. Search reports how many messages and chats it checked and how many chats have not been downloaded or are behind; `coverage.next` in JSON gives the agent the command to run before concluding that a message is absent.
- **Reply and discussion metrics use saved MAX reply links.** Incomplete data leaves a link unknown instead of assuming one.
- The [rankings guide](./rankings.md) explains metrics, scores, coverage, saved selections and evidence.
- New guides explain [attachments](./attachments.md), [speech recognition](./audio-recognition.md) and [external model setup](./external-models.md).

### Changed — may break scripts

- **`max session end` logs out of MAX rather than just forgetting the token here** — like `tg session end`. `revokedOnServer` is now `true`. If the token was copied from a web.max.ru tab, that tab is logged out too ([sessions](./sessions.md)).

- **`max messages search` in one chat also searches the MAX server.** With `--chat` or `chat:` and words, it searches both archive and server by default (`--backend both`), finding messages not yet downloaded. Server results are checked against the same query; each message has a `source`. `--backend archive` searches only the archive; `--server-time` sets how long to wait for the server (5 seconds). Without a chat, only the archive is searched ([search](./search.md)).
  What to consider: searching one chat can now connect to MAX; `--backend archive` keeps it local.

### Fixed

- **Ready-made MCP requests use the available `max_read` and `max_write`**, replacing the old names of individual tools. Their searches check `coverage.next` before concluding that a message is absent.

- **Saved selections retain exclusive date boundaries when rerun**, excluding messages exactly on a boundary. Unsupported folder operations are no longer offered to the agent through MCP.

- **`max serve --timeout` shuts down the server.** When time runs out, the connection, unfinished login and background tasks end; the process exits with the timeout code.

## 0.33.0 — 07.10.2026

### New

- **`max stats messages top` and `max stats contacts top` rank saved messages and their authors**, and each entry’s `evidence` shows which messages account for its ranking. All calculations use the local copy; nothing is sent to MAX. `searches create --selection` saves such a ranking as a search.

### Changed — may break scripts

- **Each profile now shares one request rate to MAX across all `max` processes.** Previously, simultaneous commands, background `store fetch`, `mcp` and `serve` each paused independently, collectively contacting MAX more often. They now share one allowance: 10 requests in a burst, then 20 per minute.
  Why: MAX blocks accounts for excessive requests, and parallel tasks multiplied them.
  What to consider: bulk downloads running in parallel take longer; a command that would wait more than 5 minutes for its turn exits immediately with code `8`. Change the rate with `requestsPerMinute` or `MAX_REQUESTS_PER_MINUTE`; `0` disables it. See [limits.md](./limits.md) for limits.
- **`max messages send` no longer has the `--comment-to` option.** It appeared in 0.32.0 with shared Telegram code, but in MAX it only failed with code 2.
  What to consider: a script passing `--comment-to` still gets code 2, now with an unknown-option message.

## 0.32.0 — 07.10.2026

### New

- **Photos and scans in attachments can be processed in batches using a selected model.** By default, the agent still reads them itself and saves text with `attachments text set`. Batch processing uses `attachments extract --ocr` with the model from `models.ocr` and `--concurrency`; recognized text enters the existing `content:` search.
  What to consider: `--ocr` sends files to the selected model provider, so it must be enabled explicitly. The cache accounts for both file and model; an API failure does not overwrite the agent’s text or the existing index.

### Changed — may break scripts

- **`max contacts profile` shows a person’s previous names in the new `aliases` field.** Previously, the local copy kept only the current name: a new name from a message or contact sync overwrote the old one.
  Why: someone who changed their name is easier to recognize by a previous name.
  What to consider: the `--json` response now includes `aliases`, a list of `{ name, firstSeenAt, lastSeenAt, source }` ordered from oldest to newest. `source: messages` means a name from saved messages; it is approximate. The list stays empty until the copy has observed a name change. `from:` searches only the current name. [People](./people.md).
- **`max messages send` gained `--comment-to`, but it does not work in MAX: the command fails with code 2 and sends nothing.** The option is shared with Telegram, where it posts a comment under a channel post.
  What to consider: MAX does not support comments under channel posts; do not use this option in scripts.

## 0.31.0 — 07.10.2026

### New

- **Search preparation and archive repair.** Text extraction through MCP, `attachments extract --from-dir` and `messages download --extract`; hash checks for changed files. `store fetch --catch-up` prepares the graph and installed local vectors within set limits; it is off by default. `store gaps plan/repair` and MCP show recorded interior gaps and explicitly download them using limits and jobs. Unknown edges and ambiguous pages do not count as a complete archive.

- **Member lists of tracked groups are updated daily while MAX server runs.** `chats members fetch --track` is available; tracking does not extend the server’s idle timeout.

- **`max setup` is easier to read.** Each step has a heading such as `[1/4] This computer`, with an indented account of what happened below it; questions and the QR code appear under their step, with blank lines around the code. The result is an aligned table whose first row gives the command to start with. `--json` output and its keys are unchanged; `--quiet` still hides the steps.

- **Auto-reply templates use Liquid and separate `ai` blocks.** `models.replies` selects the provider; `replies consents` grants consent for a profile and endpoint, with exclusions for individual chats. Ordinary `replies test` does not call a model; `--ai` explicitly passes saved data. Old templates retain fallback text with a warning. Sending remains restricted by `testers` and `replies.send`; see the [guide](./replies.md).
- **`max serve` opens tasks from auto-reply rules.** View them with `max tasks list` or the MCP prompt `open-tasks`; creating a task sends nothing.
- **Browser connections are documented for Windows, macOS and Linux.** The guide distinguishes Tailscale from the server, provides PowerShell commands and explains temporary send permissions, connecting Codex web, running two messengers and stopping individual tunnels. [Connection](./remote.md).

- **Settings, permissions and profiles have separate explanations.** Guides start with everyday tasks, file locations and examples; the full reference remains available.

### Changed — may break scripts

- SDK 0.161.0 contract: headless mode, input/output and time limits, command schemas, field selection, previews and rules for retrying writes. Statistics use `stats <ресурс> <вид>` without the old aliases.
- MCP uses three tools for search, read and write instead of a separate tool for each command; there are no server confirmation forms. Profile permissions and separate moderation rules remain in effect.
- Settings are split into a short guide and a full reference; a user-facing CLI contract page and an agent skill check in CI have been added.

- **Statistics now use `stats messages show`, `stats chats show` and `stats tasks show`.** The old paths `messages stats`, `chats stats`, `tasks stats` are removed; update commands and exact permissions to `stats.messages.show`, `stats.chats.show`, `stats.tasks.show`. MCP tools are now named `max_stats_messages_show`, `max_stats_chats_show`, `max_stats_tasks_show`.
- **Syntax errors return code 2 and a structured JSON error.** Scripts expecting the previous code 1 or plain text must update their error handling.

- **The first settings load creates config.json.** An existing file is not overwritten; environment variables and command options are not saved into it. config show can now create the file, and ordinary values show the defaults file as their source.
- **Word and phrase searches find word forms.** Queries in scripts may return more messages. For the previous exact matching, use exact: or --exact; an explicit text: still searches word forms. The archive’s language settings determine matching.

### Fixed

- **Search preparation respects the ban on writing links.** `conversations.links: readonly` or `deny` stops catch-up after downloading and during gap repair before connecting or starting a job. Explicit `--no-catch-up` still permits ordinary history reads under profile rules.

- Person context finds direct conversations without recorded membership when the conversation ID matches the person ID; recent messages in both directions are available again.
- MCP documentation uses current command paths and permissions without the removed confirmation forms.

- When a write is interrupted, the original `outcome_unknown`, `operationId` and retry details returned by the command are preserved: the shared library is updated to 0.161.0.

- **A command timeout during a Bot API write preserves an unknown outcome.** The operation may have completed; check its state before retrying.

- **MAX MCP does not offer unsupported forum tools.** Command search no longer offers editing and reordering Telegram topics.

## 0.30.0 — 06.10.2026

### New

- **`max stats charts --output activity.png` saves a dark-theme PNG chart.** SVG remains available; images are written only to new files. MCP `max_stats_charts` with `format: "png"` returns an image together with JSON, without connecting to MAX or writing files. Without `format`, MCP still returns JSON.
- **Auto-reply rules can be edited with `max replies add|edit|on|off` and `audience`.** A new rule is off until explicitly enabled; changes are saved only locally, without sending messages. Auto-replies remain restricted to test accounts; the `testers` list is still set in the file. [Auto-replies](./replies.md).
- **`max tasks` shows what is waiting for your reply.** `max review` maintains a task in the local copy for an unanswered question or a message mentioning you, and closes it when you reply; these tasks are now visible. `max tasks list` shows them with a message link; `max tasks add <сообщение> --type promise` adds what rules miss; `max tasks close <задача> --as done|dismissed` closes a task permanently; `max tasks stats` counts them by chat. MCP `max_tasks_list`, `max_tasks_add`, `max_tasks_close`, `max_tasks_stats` give the agent the same capabilities. Everything stays on this machine; nothing goes to MAX. Writes require `tasks.add` and `tasks.close` permissions.
  What to consider: MCP has four more tools; `max serve` does not yet open tasks in MAX. [What is waiting for your reply](./groups.md#что-ждёт-вашего-ответа).
- **Semantic search covers long messages in full.** Before embedding, messages longer than about 1200 characters are split into overlapping chunks, so semantic search reads the whole message rather than just its beginning. Previously built chats are considered stale: rebuild them with `conversations build` or `search --refresh` (cli-messaging 0.153.0; the store moves to version 21, which older builds can still write).
- **MCP performs permitted writes from web clients without server forms.** `--http-confirmation permissions` follows permission levels: `allow` requires no server form, while `ask` requires one. By default, a form remains mandatory for every write. Repeated `--permission ключ=уровень` overrides permissions only while the server runs, without changing settings. App confirmation is separate and is not checked by the server.
  What to consider: in this mode, the browser agent performs anything the profile permits at `allow`, including sending messages, without a form; check permissions before enabling it. [Connection](./remote.md).

### Fixed

- **MCP member-tracking tool descriptions account for manual collection in MAX.** They no longer promise daily list reads through `serve` or offer the unavailable `fetch --track`. The group list and saved snapshots are still read from the local store.

## 0.29.0 — 06.10.2026

### New

- **`max chats tracking list|show|add|remove` manages the groups tracked for member changes.** Inspect saved member-count snapshots, add a group without fetching immediately, or remove it while keeping its history. Use `max chats members fetch` to record members. MAX `serve` does not yet fetch members daily: repeat collection manually or on your own schedule.
- **Person profiles.** `max contacts profile <человек>` shows what MAX reports about a person: name, link, description, account creation time (`registered`, as reported by MAX), and whether they have their own photo. For each shared chat it shows their stored message count, first and last message. When MAX supplies a phone number, only its last four digits appear; `--show-phone` reveals it in full. One additional MAX request beyond `contacts show`. MCP: `max_contacts_profile`.
- **Rule-based replies, only to test accounts.** `max serve` answers incoming messages using rules in `<профиль>.replies.json`, only for people listed in `testers` and only with `permissions.replies.send allow`. Commands: `max replies test`, `pause`, `resume`, `status`. See [docs/replies.md](./replies.md).
- `max contacts context <человек> --chat <чат>` (repeatable) returns their recent messages in each chat, with time and text for an agent to summarise. `-v` adds ids and links; `--limit` applies per chat; `--refresh` first reads the chat's latest page from MAX.
- Uses cli-messaging 0.152.0.
- **`max contacts check <человек>` checks whether a person looks like a bot.** It scores the profile and stored messages (no messages, a link as the first message, identical text in several chats), with a source for each reason. Public spammer lists cover Telegram only, so they are not queried for MAX. `max chats members audit
  --deep <n>` checks the first n members in the same way, one per second.

- **`max chats members fetch` retains member snapshots; `history` shows changes.** History is available offline with `--since-time`. `--budget` bounds a snapshot; departures are recorded only after a complete read. Daily tracking awaits support from MAX's background service. [Working with members](./groups.md#снимки-участников).

- **`max stats charts` plots chat statistics.** The command returns a neutral JSON description; `--output` saves a dark SVG of messages, active authors, joins and departures by day or week. Missing dates remain gaps and incomplete data is labelled. Existing files are not overwritten. MCP `max_stats_charts` returns the description from the local store; PNG will come separately. The new library adds about 61.6 MiB of unpacked files before deduplication and loads into the process only when an image is requested. [Usage](./usage.md#графики-статистики).

- **Channel-post reactions are also retained by `max store fetch`.** MAX includes reaction counts with channel history; `max` now retains them, so `max chats stats` can rank channel posts by reactions without another request.

- **`max chats stats <чат>` reports group or channel activity over a period.** Messages, active authors, replies, reactions, top posts, questions and response times, joins and departures. It calculates from the local store and asks MAX for joins and departures. With incomplete stored history, figures are lower bounds and the command suggests a `store fetch` to fill the gaps.

- **Search reads file text.** `attachments extract` retains TXT, DOCX and PDF text layers; `content:` searches it. DOCX/PDF require optional `mammoth`/`unpdf`; an agent reads photos and scans and saves the result with `attachments text set`. By default it reads only downloaded files; `--download --output-dir` explicitly downloads them first.
- **Refresh before searching and follow reply chains.** `--sync-first` bounds fetching to five chats, 500 messages and 30 seconds; incomplete refresh does not hide local results. `--thread` adds a bounded reply graph with link provenance; without a graph it uses chronological context.
- **Conversation search accepts strict filters and explicit account scope.** `--filter` limits conversations before ranking; at least one message must match the entire filter. `--source` explicitly widens scope. An agent can link messages entirely over MCP: the `link-conversations` instructions, batches, storing links and rebuilding the graph.
- **Configure embedding and analysis models independently per profile.** Local vectors and your own agent remain the defaults. An external service receives text only when explicitly selected; `build --analyze --chat` asks for consent and remembers it for the account, chat and service until revoked.

- **Local tags: `max tags add`, `remove` and `list`.** Tag a chat (`--chat`), person (`--contact`) or message (`--message`); `tag:<метка>` finds tagged messages. Tags stay in the local archive and never go to MAX. A tag is 1–32 Latin letters, digits or hyphens. The same actions are available to agents over MCP. See [Message search](./search.md).
- **Saved searches: `max searches` and `--saved`.** `max searches create <имя> [запрос]` saves a query with its options; `max messages search --saved <имя>` and `max messages stats --saved <имя>` run it. Words added to `--saved` narrow the query; command-line options replace saved ones. `searches list`, `show`, `history`, `delete` and `clear` inspect and clean saved searches and history. The query for `messages search` is now optional when `--saved` is given.
- **`max contacts context <человек>` shows what the archive knows about a person.** Shared chats, the latest messages in both directions, recent messages and mentions. It reads the archive and marks nothing read. `max contacts link` records that a MAX and a Telegram account belong to the same person, so `context` includes both; `max contacts unlink` reverses it. Since `context` returns message text, `permissions.messages: deny` also blocks it.
- **`max store repair` repairs archive structure without deleting data.** It keeps a table with a different shape as a copy alongside the replacement and names it in the result. `--dry-run` previews changes without applying them. `max store copies delete <имя>` deletes one retained copy. See [Archive](./archive.md).
- **Search can use word stems when enabled.** `max config set searchStemmers.cyrillic russian` and `searchStemmers.latin spanish` (or `english`) configure the whole archive, all profiles and both messengers. Run `max store reindex` afterwards.
- **`max flood clear` forgets remembered waits and lifts send holds.** They appear in `max server status`, in the new `flood` field. MAX does not yet report a wait duration, so this is empty for a personal MAX account. The login cooldown shown by `max doctor` still protects against frequent logins. There is deliberately no MCP tool: an agent must not lift a restriction.
- **Three search guides.** [Message search](./search.md) covers everyday searches by words, people, dates, files, links and tags; [topic search](./topic-search.md) covers conversations, vectors and text sent to external models; [query language](./query-language.md) is the reference.

### Changed — may break scripts

- **Semantic search with local e5-small discards weak matches before combining them with word matches.** Cosine similarity must exceed 0.80; word matches remain. Results may be shorter, and a result found by both methods may become a word-only match.
- **The archive gains attachment-text and analysis-consent tables.** This is a local migration on first opening; old messages are retained. Back up a large archive before updating.

- **The archive now retains every successful `messages search` and `messages stats` query, from both CLI and MCP.** It stores the query and options, never result messages, keeping the latest 1,000 runs. This powers `searches history` and `--saved`. If queries must not stay on disk, use `--no-record` or `max config set record false`; `max searches clear` empties history and keeps saved searches.
- **The archive migrates to a new schema on first use.** It gains tables for tags, saved searches and word stems; `max store migrate` finishes the stem index for existing messages. On large archives, `store migrate` and `store reindex` take longer. The store is shared with `tg`; older `max` and `tg` versions can still open it.
- **`max inbox`, `inbox --new`, `review` and `chats list --unread` (including `--search` and `--kind`) inspect all chats MAX returned at login, instead of the newest 200.** Previously unread chats lower in the list were silently skipped. Each run still processes at most 20 chats, naming the rest in `skipped N chats`. `partial: true` now means only that MAX did not return every chat at login.
- **`max chats list` reports `hasMore: true` on the last nonempty page when MAX returned an incomplete chat list.** Previously the list appeared complete. Scripts paging until `hasMore: false` stop on the empty page.
- **`max messages list` and `max store fetch` no longer treat a short page as the start of a chat.** MAX does not report whether older messages exist, and a page can be shorter than `--limit` even in the middle of a conversation. After a short page, `max` now requests one older message: if it exists, `hasMore: true`; if not, this is the start of the chat. What to consider: this adds one MAX request per short page, and `hasMore` is more often `true`.
- **`max config set` and `config unset` accept `searchStemmers.cyrillic` and `searchStemmers.latin`; `config show --json` exposes them in the new `storeSettings` field.** These settings live in the archive rather than the settings file, so `--defaults`, `--personal` and `--bot` are refused; they cannot be changed under `MAX_PROFILE_LOCK`.

### Fixed

- Errors in reply-rule files no longer print fragments of those files in the service log.

- **`max mcp --http`: Claude and ChatGPT can now finish signing in.** The login page made the browser submit its form with no origin, and `max` replied “Origin not allowed”. Login now works (cli-messaging 0.152.0).

- **A message locator from another account no longer opens a same-numbered message in the current account.** `messages show/context` refuses it; MCP accepts `offline: true` for ordinary local context.

- **Strict `text:/…/` regex search matches words the same way as word search.** Previously `text:/Квартир.*/` and `text:/счёт/` missed stored words because of case and the letter ё. `body:` remains case-sensitive.
- **Strict-search errors explain what to do.** `~` suggests `--language legacy` and `слово*`; a short prefix such as `к*` names the 10,000-word limit and asks for a longer prefix; `index_not_ready` reports index progress and the exact `max store migrate` command.
- **MCP does not retain query history when recording is disabled.** Previously `record: false` disabled history only in the CLI.
## 0.28.0 — 04.10.2026

### New

- MCP `max_chats_stats` counts group or channel activity from the local archive; joins and departures are not requested. `max chats members audit` shows signs of suspicious members without removing anyone.
- MCP `max_inbox` and `max_review` accept `kinds` and `new`, with per-chat points kept separately from the CLI.

- **`max messages stats` counts messages from the local archive by chat, sender, day or hour.** The query uses strict Lucene; without one, all saved messages of the current account are counted. No network is used; `--source max` explicitly includes other profiles. In an incomplete archive, the result stays a lower bound; check `coverage` and `completeness`.
- **`max mcp --http --public-url https://<имя>.ts.net` opens `max` to ChatGPT and Claude in the browser.** MCP tools are served on `127.0.0.1` behind your own tunnel, with their own login: the app needs a one-time code that `max` prints in the terminal. Every change first asks through a form in the app. The login lasts 30 days; `max mcp --revoke` ends all logins. [docs/remote.md](./remote.md) replaces the setup with a third-party proxy.

- Personal MCP uses the same set of schemas as Telegram: devices, contact lookup by phone number, folders, members, invite links, group settings, polls, local evidence and conversations. Telegram topics are not supported in MAX. The old names of the group check and rules are kept.
- A confirmed scheduled send uses the time from the form, even if the answer arrived later.

### Changed — may break scripts

- `coverage.inventoryComplete` now reflects receiving a full chat list, and `lastSyncedAt` the oldest fetch in coverage; `completeness` entries contain `fetchedAt`. An existing archive gets this information after the next full chat list and history fetch. `/catch-up` accepts `kind` and `mode` instead of `since`.
- `config set permissions` rejects unknown commands with code 2, including typos inside a whole object. `config unset` lets you remove them; reading an existing file prints a warning and continues.

- MCP arguments now use shared names: `at_time`, `md`, `since_time`, `before_n`, `after_n`, `unanswered`; `send_id` is now a string. Unknown arguments are rejected before anything runs. Update your calls using the schema from `tools/list`. For `max_inbox` and `max_review`, `all: true` includes muted and archived chats; without it, only mentions of the owner remain.

### Fixed

- Search and statistics show the actual coverage of the local archive and the time of the last fetch. `wordsReady` no longer promises a ready word index for searches that use only filters or regex. `store fetch` ignores the start-of-history mark if older messages turn up in the archive.
- `server status` reports the exit code of a normal service shutdown and the reason it stopped, without starting it again.

## 0.27.0 — 04.10.2026

### New

- **Global npm installation sets up Windows PATH and the agent skill.** Existing PATH entries are preserved and `max` becomes available in new terminals. An already-running agent must refresh its environment. The skill installs before login; `MAX_INSTALL_AGENT=none` disables it. Local installation and npx do not change the user's environment.

- **`max commands messages search --json` describes one command; `max commands messages --json` describes a group.** Agents no longer need to read the entire tree before every task. Global options and exit codes remain included. Words after `commands` specify one path; inspect other groups in separate calls. Without a path, the command still returns the entire tree.

- **`max messages link` and MCP `max_messages_link` return a message locator from the local archive.** The target is validated under the current account; another account's locator is refused. Personal MAX has no verified permalink format yet: `url` is `null` and the response includes the reason. `--offline` does not connect to MAX. See [messages](./usage.md).

### Changed — may break scripts

- **CLI and MCP use `permissions` with levels `deny`, `readonly`, `ask` and `allow`.** Commands and agents share the same permissions. Most MCP writes are now available by default; deleting messages and ending other sessions require confirmation unless explicit `allow` applies. For example, `messages: readonly` with `messages.delete: allow` permits reading and deletion without a question while forbidding other message writes; other resources remain unrestricted. Check agent permissions before updating and set `readonly` or `deny` on the resources you want to restrict. `--confirm-send` requires a form before every write; JSON-mode `ask` requires an explicit flag.

- **`config migrate` converts legacy access settings and moderation-rule levels.** `--dry-run` previews changes without writing. Migration preserves effective permissions, MAX settings and saved group-check positions. Once `permissions` exists, `readOnly`, `allow` and `mcpTools` cannot be changed. Legacy MCP flags `--allow-send`, `--allow-mark-read`, `--allow-delete` and `--allow-moderate` are accepted with a warning but grant no permissions. The recipient list and hourly limit still apply. See [configuration](./configuration.md) and [MCP](./mcp.md).

### Fixed

- **Concurrent local-archive initialization waits for a brief SQLite startup lock.** Previously, journal configuration could encounter a busy database before the wait timeout was enabled and fail immediately. A long lock still produces an error. This change does not start downloading history.

## 0.26.0 — 03.10.2026

### New

- **`max skill show link-conversations` prints the shared conversation-linking skill.** It works without a session; without a name, it still prints the main MAX skill.

- **`max messages evidence` returns a bounded packet from the local archive**, with a locator, completeness information and continuation through `--before-id`. It does not connect to MAX.

### Changed — may break scripts

- **Downloaded photos get their extension from the HTTP MIME type**, such as `.webp` for WebP, rather than JPEG based on the attachment type. Original file names remain intact; no extra preliminary requests are made.

- **`max account show` uses the shared account format with Telegram.** JSON adds `username: null`; existing MAX fields, phone masking and `--show-phone` remain unchanged.

- **`max sends list` respects the configured `limit`, as Telegram does.** Previously it always selected 20 attempts without a flag. JSON `limit` reports the selected limit; `items`, `page` and `hasMore` remain. `--limit` overrides the setting.

- **`max messages download` supports `--all`, `--output-dir` and `--pause`, as Telegram does.** The directory is created automatically; repeating a full-chat download continues saved progress. `--output` remains a compatible directory name. Single-message JSON now contains `{items}` without artificial `page`, `limit` and `hasMore`; scripts should read `items`. Voice files now have `kind` = `voice`, as in Telegram, instead of `audio`. Downloads stream with the existing address and size checks; voice files retain the 32 MiB limit.

### Security

- **`max contacts lookup` does not echo a phone number mistakenly passed as an argument.** It refuses before prompting or connecting; enter the number at the prompt or through stdin.

### Fixed

- **`messages list`, `inbox` and `review` with `--transcribe` download the recording through the reading connection.** Previously, a second login to MAX was opened. The recording is downloaded before the connection closes, and local recognition starts after it closes. Nothing is marked as read without an explicit `--mark-read`.
- **`review --unanswered` takes into account saved and new transcripts of voice questions.** Previously, a question with empty text was dropped before transcription. The same fix applies in MCP; the original message text does not change, and unrecognized recordings leave the review incomplete.

- **`max chats show` explains differing member counts accurately.** The list may exclude your account or be incomplete. The command reports both counts without claiming a download failure. JSON and the original member list remain intact.

- **The `poll.already.voted` refusal explains how to change a vote.** If the poll allows this, first run `polls vote <chat> <message> --retract` in the same profile, then select the new answer.

- **`max messages download --timeout` also closes the attachment's HTTP stream.** Previously it could continue after the command timed out until a separate idle timeout. Adapter close now cancels its streams and removes the incomplete file.

## 0.25.0 — 03.10.2026

### New

- `bot api` uses the same command builder and input validation as Telegram. Generators remain in cli-core; parameters, native responses and effective MAX permissions are preserved. The shared `--store-token <profile>` option is for operations returning credentials; other operations reject it.

### Fixed

- **`messages list`, `inbox` and `review` with `--transcribe` download the recording through the reading connection.** Previously, a second login to MAX was opened. The recording is downloaded before the connection closes, and local recognition starts after it closes. Nothing is marked as read without an explicit `--mark-read`.
- **`review --unanswered` takes into account saved and new transcripts of voice questions.** Previously, a question with empty text was dropped before transcription. The same fix applies in MCP; the original message text does not change, and unrecognized recordings leave the review incomplete.

### Changed — may break scripts

- **`max models audio list --json` adds `directory`:** the shared model directory used by MAX and Telegram. Model commands, directory selection and download verification are now shared; existing files, model order and `transcribeModel` remain. Models do not need another download. JSONL still returns one model per line.

- **`--md` uses MAX's own formatter** for send/edit and captions: nested styles, `__жирный__`, `++подчёркнутый++`, links and code. Bots support emphasis, headings and quotes through safe HTML; the personal protocol explicitly refuses unverified types. Telegram has different syntax. Unknown wire types are no longer silently sent.

## 0.24.0 — 03.10.2026

### New

- **`max setup` guides the first run for a personal account:** it checks local directories, offers QR login, checks the account and up to five chats, and connects the selected agent skill. Repeating setup reuses an existing session. History is downloaded separately; setup does not start the background service. Help, installation and agent instructions explain next steps and Windows execution without PATH. `max skill show` is available before login.

### Changed — may break scripts

- **`max chats check` is replaced by `max chats moderate`:** shared rules and moderation with Telegram. `--since-time` accepts a time or `30m`/`2h`/`1d`, replacing the former `--since` with a message number; JSON is now `{ chatId, rows }`. Each run reads up to 1000 messages. Rule levels are `deny|readonly|ask|allow`; old `forbid` and `flag|confirm` are read as `deny` and `ask`. The saved check position moves from the session to the existing rules file, so the first run resumes there. CLI and personal MCP use the same position; MCP tool names and flags are preserved. In `chats events`, joining via a link is called `join`.

- **`max upgrade --json` always includes `restarted`.** In MAX this is an empty array: the server restart policy is unchanged. Version checks and no-update results use the same response shape as installation; previous fields remain. Scripts that validate the exact set of keys must account for the additional field.

- **Local search uses a strict Lucene profile:** parentheses, fields, date ranges and `--timezone`, limited wildcards and regex. Prefix matching is explicit, as `слово*`; the previous typo-correcting search remains available with `--language legacy`. JSON reports coverage even without matches. The guide and skill explain migration; JavaScript `--regex` runs in a separate worker with size and time limits.

- **`max commands --json` returns the JSON contract version in `contract`.** Value `0` matches Telegram CLI; previous reference fields remain. Scripts that compare the entire JSON against a saved string must account for the new field; reading individual fields requires no changes.

- **Group reads use shared options and formats.** `chats events` accepts `--since-time` instead of `--since` and `--type` instead of `--event`; the boundary is a time, rather than a message ID. Creation events are now `create` instead of `new`. `chats members list` shows a page with `--limit`, `--page` and `--all`; add `--all` for the previous scope. JSON no longer contains `chatId` or `rolesKnown`, but roles, registration dates and last-seen times remain in rows. `chats inspect` returns `id`, `kind`, `title`, `username`, `participantsCount`, `description` and `member` instead of a record with access, link and settings. `member` and `username` are `null` when MAX does not report them. These are shared MAX and Telegram reads; update scripts and filters. Warnings about incomplete member lists and unknown roles remain; no read marks messages as read. See [groups](./usage.md#группы-и-каналы).

- **Group-management commands return shared JSON with `operationId`.** `chats create`, `join`, `update` and `link reset` put the record in `chat`; `leave` returns `chatId`. `members add` now has `added` and `notAdded`, while `members remove` has `removed`; `admins` commands return `personId`, and adding an admin also returns `rights`. This is the shared MAX and Telegram operation format; scripts must update result parsing. `link show` keeps its previous format. Titles and settings still change through two requests: if the title or description changed but the settings request did not complete, the command reports `outcome_unknown` and records a partial result in the journal. Read `chats show` before retrying. See [group management](./usage.md#группы-и-каналы).

- **`max account update` and `max account sessions end` return the shared format with `operationId`.** Profile changes return `{operationId, account}` with `id`, `name`, `username`, `phone`; ending sessions returns `{operationId, sessions}` instead of an array. This is the shared MAX and Telegram operation format; scripts must read data from `account` or `sessions`. A profile description is no longer returned after a change: use `account show`. Phone numbers remain masked; `sessions end` still requires `--others --yes`. Profile photos now accept JPG, JPEG, PNG and WebP; convert GIF to one of these formats. See [profile and sessions](./usage.md#контакты-профиль-папки).

- **`max chats folders create|update|delete` returns `operationId` alongside the result.** Creating and updating return `{operationId, folder}`; deleting returns `{operationId, folderId}`, instead of the folder record itself. This is the shared MAX and Telegram operation format; scripts must read the record from `folder` and use `folderId` after deletion. `update` without `--title`, `--add` or `--remove` now refuses rather than rewriting the same folder. Listing folders keeps its previous format. See [folders](./usage.md#контакты-профиль-папки).

- **`max contacts add|remove|block|unblock|rename|import` returns the shared format with `operationId`.** Adding and renaming return `{operationId, person}`; deleting and blocking return `{operationId, personId}`; importing returns `{operationId, sent, recognised}`. `recognised` now contains person records (`id`, `name`, `username`) returned by MAX, instead of phone numbers; if no records are returned, the list is empty. `sent` counts file rows, including duplicate numbers. This is the shared MAX and Telegram operation format; scripts must update response parsing. A phone number rejected by MAX no longer reports the file row; malformed rows still report their number. See [contacts](./usage.md#контакты-профиль-папки).

- **`max cache clear` is removed.** All reads and name resolution use the shared local store; `max store clear --left --allow-dangerous` removes data for departed chats. There is no command to erase the entire shared store. The old file is neither migrated nor opened; `max doctor` shows its path, and history can be fetched again with `max store fetch`.

### Fixed

- **`max conversations embed status` estimates e5-small time more accurately.** It uses the measured 31 chunks/s rather than 15; on the measured laptop, the previous estimate was twice as long. Actual time depends on the computer and text length. Three worker threads delivered a measured 1.04–1.1× speedup at substantial memory cost; thread allocation is unchanged.

- **`max_messages_search` through MCP retains archive coverage metadata and uses the same search parameters as CLI.** Available parameters include `language`, `timezone`, versioned `ast`, chat names, and `source`, `newest`, `context` filters. The default profile accepts single-character queries. Previously, some parameters were absent and responses lost `query`, `coverage` and `completeness`; empty results did not explain local-store coverage. Previous response fields and the tool name remain unchanged.

- **`max runs list --limit` suggests increasing the limit when some records are not shown.** The hint no longer suggests an unsupported `--page` option. Reading the list or an individual record does not create another run; the JSON list still contains `hasMore`.

- **`chats show` displays a saved group even if it is absent from the latest login delta.** Previously, the read could fail with “chat not found”. Unknown settings and links now stay empty; reading changes nothing in the group.

- **`max messages transcribe` finds a saved transcript by chat name when the model has not been downloaded.** Previously, it looked for text using the entered name instead of the chat ID and suggested downloading the model again. The full name or an unambiguous fragment now returns saved text without downloading the recording or recognizing it again. See [voice messages](./usage.md).

- On Windows, the generator uses Node instead of directly launching `.cmd`; documentation checks recognize Windows paths. Unix-permission tests do not require them on Windows, where ACLs control access.

- **`max bot` errors before an action starts follow the bot profile’s recording settings, even with `--timeout` before the command.** Previously, a global option before `bot` could cause personal-account settings to apply. When bot-profile recording is disabled, a command-parsing error no longer creates a record against that setting.

## 0.23.0 — 03.10.2026

### New

- **`max serve` and chat-management commands save names and chats in shared local storage.** The old profile cache is no longer opened. A complete chat list marks departed chats; an empty response preserves the previous list.

- **Contact commands and shared read commands save data in shared local storage.** Name resolution and `contacts sync` no longer require the old profile cache; synchronization still returns counts only. Deleting the old file does not reset the sync position. Run `max contacts sync` to fetch the complete list again.

- **`max mcp` releases its search model after 10 minutes without searches.** Agent `conversations_search` no longer holds about 1 GB throughout the session. The next search reloads the model in about a second (cli-messaging 0.110.0).
- **Chat and person completion uses the selected account's shared store.** The old cache is unnecessary. Tab still never connects to MAX; bot commands suggest chats from their local list.
- **`max mcp setup codex|claude-code` and `max mcp doctor`** add local MCP to the selected client and check startup and available tools. Installation requires `--allow-writes` if the profile offers writes; this approval changes no permissions and does not verify MAX login.
- **`max <бот> bot store fetch <чат>`** downloads history to the bot's local store, newest first, with resumable runs. `--last`, `--since-time`, `--limit`, `--page-size`, `--pause` work like `max store fetch`.
- **`--yes` for any command** approves a write prompt required by consent level `ask`; `max account sessions end --others --yes` works as before.

### Changed — may break scripts

- **`messages send --topic` and `polls create --topic` clearly reject MAX destinations.** This shared option addresses Telegram forum topics, unsupported by MAX. No message or poll is sent; ordinary calls without `--topic` are unchanged.

- **`max doctor --json` reports the shared store in `store` and the old file in `legacyCache`.** It no longer opens the old cache or checks its schema. Scripts reading `cache` must switch to `store`. Delete old files manually and fetch history with `max store fetch`.
- **MCP reads the shared message store.** Search, contacts, chat resources and transcripts use `messages.db` under the profile account. The old cache is no longer opened. Reading history saves searchable messages. Voice attachments have `kind: "voice"`. Tool names and parameters are unchanged.
- **`inbox` and `review` use shared command and message formats.** Replace `--since` with `--since-time`. `review --unanswered` accepts durations (`4h`, `1d`), not a number of hours. JSON voice attachments use `kind: "voice"` instead of `"audio"`. `--all` includes muted and archived chats. The first inbox run migrates the previous `inbox --new` position. Review pages backwards and returns at most 300 messages per chat, marking incomplete results. Update script commands and JSON checks.
- **Personal-account transcripts are saved in shared storage.** `messages transcribe`, `inbox`, `review` and MCP use the same account-scoped text as `messages list`. Old profile-cache transcripts are not migrated; an explicit `--transcribe` request recreates them using a downloaded model.
- **`max <бот> bot people show` becomes `max <бот> bot contacts show`**, with MCP tool `max_bot_contacts_show`. Together with `bot messages search|between`, these commands are shared with `tg`; options and responses are unchanged.
- **`max <бот> bot chats check` is now `max <бот> bot chats moderate`** — sharing the name and command with `tg`. `--since` is now `--since-time` (still accepting `2h`, `1d`); the `--json` response is `{ chatId, rows }` instead of a list; the MCP tool is `max_bot_chats_moderate`. Rules and the previous check position remain in the same files. Consent level `flag` now means the same as `confirm`: ask you, or act with `--allow-dangerous`.
- **`max <бот> bot mcp` grants access according to bot profile settings, rather than flags.** Without flags, agents can write unless `readOnly: true` or `allow` restricts them. Deletion uses a confirmation form; `--allow-dangerous` removes it. `--allow-send`, `--allow-delete` and `--allow-moderate` are accepted with warnings but grant nothing. Set `readOnly: true` to retain read-only access. The server is now shared with `tg`.
- **`max bot messages search` matches words, best matches first**, instead of substrings newest first; use `--newest` for the old order. All words are required. `"фраза"`, `-слово`, `а OR б` and filters `from:`, `chat:`, `after:`, `before:`, `has:` are supported; typos are corrected with a stderr notice. Words need not be quoted; `--from` remains repeatable. Bot search does not support `in:`; it searches its own copy and copies permitted by `readOtherBots`.

### Fixed

- **Bot write rejections suggest a valid configuration command with `--bot`.** Read-only failures suggest disabling `readOnly`; missing `allow` permissions suggest adding the action while retaining existing permissions. Previously the hint named nonexistent `bot config`.

## 0.22.0 — 02.10.2026

Most personal-account commands are now shared with tg: identical options and `--json` responses, and one shared store. Many names changed; see “Changed — may break scripts”. The previous max cache is not migrated. After upgrading, run commands without `--offline` and download history again with `max store fetch`.

### New

- **`max conversations search "<запрос>"`** finds semantically related conversations in one or all chats. Download `max models text download e5-small` once (135 MB, shared with `tg`), then use `max conversations embed --chat <чат>` to calculate vectors locally. `embed status` reports remaining work; `embed clear` deletes vectors. With `--provider openai` and your key (`max models text key set
  openai`), an external service computes vectors; `embed` first reports token count and cost and asks for approval.
- **Direct-chat `chats list --json` includes `providerMetadata.partnerId`**, identifying the other person. Shared commands use it because MAX chat IDs and participant IDs differ.
- **`max messages search` can search other accounts in shared storage:** query `in:max`, `in:personal`, `in:bots`, `in:all` or use `--source`. Otherwise it searches the current account as before.
- **`max conversations build|list|show` and `max messages links`** find group conversations locally from replies, mentions and message order without querying MAX. **`conversations
  batches status|next` and `conversations links add|clear`** provide agent batches and accept its responses.
- **`max server logs`, `max server install`, `max server uninstall`**, matching tg. `install` writes a systemd (Linux) or launchd (macOS) service without starting it; `max server start` and `stop` then use the service. Authentication rejection does not restart the service, avoiding repeated logins. `max server start --idle` and `restart --idle` remain supported.
- **`max store status`** reports per-chat message counts and complete downloaded ranges. **`store fetch --background`** and **`store jobs list|show|cancel`** manage background downloads. **`store info|check|migrate|backup|restore|reindex`** maintain the shared store. **`store clear --left
  --allow-dangerous`** deletes departed chats and messages.
- **`max bot auth`, `max bot list`, `max bot chats list`, `max bot recipients` and `max bot sends list` are shared with tg** through cli-messaging, with identical responses and hints. Tokens, recipients and logs retain their locations.
- **`max cache clear --left`** deletes only departed chats and their messages from the profile cache.
- **`max messages search --regex`** — one regular expression across all saved text. **`messages show|context msg:…`** — a message from a `search` link, without a separate ID.
- **`max polls show <чат> <сообщение>`** reads a poll, answer IDs and vote counts without changing anything.
- **`max polls create --send-id`** safely retries poll creation after a missing response without creating a second poll.
- **`max messages send --photo <путь>`** — send `.jpg .png .webp` as a photo, as in tg. `--no-preview` is also available on `send`, but MAX does not support it and the command refuses.
- **`max skill install`** installs the agent skill with one command: in `~/.claude/skills/max-cli/` for Claude Code and in `~/.agents/skills/max-cli/` for Codex and Gemini CLI, with the `max` version number. `--for claude` or `--for agents` installs into just one directory. `max skill show` prints the same content as before.
- **The agent learns about the skill automatically.** If `AI_AGENT` or `CLAUDECODE` is set and the skill is missing or older than `max`, one line about `max skill install` appears in stderr once a day. Nothing is added to stdout. Disable it with `max config set skillHint false --defaults`.
- **`max mcp` and `max bot mcp` expose `max://skill`** and mention it in agent instructions.
- **`max messages delete` returns `operationId`**, also found in `max sends list`. MCP `max_messages_delete` does too. Options are unchanged.
- **Every send-log record includes `operationId`**, grouping records for one send, edit, deletion or chat change. For a message send, it equals `sendId`.
- **Installation is about 16 MB smaller:** the database layer is bundled instead of installed separately. `max` commands are unchanged.

### Changed — may break scripts

- **`max messages search` matches words, best results first.** Use `--newest` for the former newest-first order. Queries support `"фраза"`, `-слово`, `OR`, `from:`, `chat:`, `after:`/`before:` and `has:`. Typos are corrected with a stderr notice. `--context <n>` shows neighboring messages. JSON adds `match` and `score`.
- **`max bot updates watch` is now `max bot watch`**, like in tg and the personal `max watch`. Without `--events`, only new messages are printed; with `--events`, all events are printed, and each line names its event (`{ "event": "message" | "edit" | "delete" | "callback" | "joined" | … }`) instead of a raw MAX event. `--timeout` ends it normally with code `0`. `watch` is now allowed for read-only bot profiles: receiving events is reading. The resume marker is unchanged.
- **`bot webhooks list` returns `{ url, types }`**, not MAX-specific fields. `bot callbacks answer --text` no longer reads stdin through `-`. `bot commands`, `bot callbacks` and `bot webhooks` are shared with tg. `webhooks set --secret-stdin` prompts only after permission checks.
- **Node 22.16 or later is required**, or Bun as before. If Linux Node uses an outdated system SQLite, `max` restarts using bundled SQLite from `@wirecat/cli-messaging-sqlite` before reading or sending. Official Node builds and Bun need no change.
- **`max store` is shared between tg and max.** `store fetch` writes to shared storage and pages MAX as before: 30 messages, 5–10-second pauses, up to 40 pages per run. This gives both messengers one store and consistent `messages`, `conversations` and `store` reads. The old cache is not migrated; refetch history. Also:
  - `store fetch --estimate` is rejected for MAX because message IDs cannot count missing records.
  - `store fetch|export --since` becomes `--since-time`, accepting time only, not message IDs.
  - `store fetch --max-pages <n>` becomes `--limit <сообщений>`, default 1,200 or forty 30-message pages. Page size uses `--page-size`.
  - `store export --format md` becomes `--format markdown`; `jsonl` is unchanged. Missing ranges are reported by `store status` rather than export stderr. Existing files are never overwritten.
  - `store fetch` no longer prints a ready-made export command.
  - If two messages share a millisecond and a page boundary separates them, `store fetch` can rarely miss the earlier one.
- **`max messages list|show|context|search` are shared tg and max commands.** `--offline` and `search` read from the shared local copy, the same one used by tg.
  Why: the same options and responses as tg, and one copy for reading.
  What to consider: message and chat reading tools in `max mcp` still read the old max copy, so an agent using MCP and a terminal command with `--offline` may give different answers. The copy starts filling on the first run without `--offline` after updating; the old max copy is not migrated into it, including transcripts of voice messages heard before updating. Also:
  - Voice attachments use `"kind": "voice"`, not `"audio"`; `inbox` and `review` still use `"audio"` in this release.
  - `messages list --before` and `--after` split into `--before-id`, `--before-time`, `--after-id`, `--after-time`; `messages context` uses `--before-n`, `--after-n`. Old options produce unknown-option errors.
  - `messages list --before-id` excludes that message itself; with `--offline`, only `--before-id` works, and only with a message ID from the local copy;
  - `messages list --transcribe --json` no longer returns `transcribeProblem`: the reason appears in stderr; with `--offline`, `unheard` is empty. Voice messages are downloaded through a separate connection — with `--no-serve`, this is a second MAX login;
  - `max` looks for speech models in `~/.cache/cli-common/models/audio`, the same directory as tg; a model downloaded into `~/.cache/max-cli/models/audio` must be downloaded again or moved;
  - `messages search` matches words and prefixes (`квартир` finds “квартира”), rather than arbitrary three-letter substrings. `--chat` accepts a stored chat title.
- **`max chats list|show` and `max contacts list|show` are shared tg and max commands.** Their `--offline` reads from the shared local copy, the same one used by tg.
  Why: the same options and responses as tg.
  What to consider: the copy starts filling on the first run without `--offline` after updating; the old max copy is not migrated into it, and until then `--offline` returns `not_found`. Also:
  - `chats list --search|--kind|--unread` without `--offline` searches the 200 most recent chats and writes to stderr if older chats existed; with `--offline`, it searches all saved chats;
  - `chats show --offline` omits `description`, `access`, `settings`, available only from MAX.
  - Invalid `--kind` values now report `--kind is one of dialog, group, channel, saved`.
  - `cache clear` also clears this account from shared storage; `contacts sync` fetches everything into it.
- **`max messages send|edit|forward` are shared tg and max commands.** `--json` responses: `send` returns `{sendId, operationId, message}` (with `scheduledFor` when using `--at-time`); `forward` also returns `{sendId, operationId, message}`; `edit` returns `{operationId, message}`, instead of an unwrapped message. MCP tools `max_messages_send`, `max_messages_edit` and `max_messages_forward` return the same shapes; `max_messages_edit` no longer has `markdown`, and `max_messages_forward` no longer has `send_id`.
  Why: the same options and responses as tg, with an action ID matching the send log.
  What to consider: scripts reading the message from the response root must now read `message`. `send` no longer accepts several `--file` attachments for one message: one attachment from `--file` and one from `--photo`. If a send with `--at-time` gets no response, the error recommends `messages scheduled` without naming a chat.
- **`max polls` is shared with tg.** `polls vote|close --json` returns `{operationId, poll}`, with `poll` shaped as `{chatId, messageId, question, answers: [{id, text, voters, chosen}], closed, multiple,
  anonymous, voters}`. `polls create` returns `{sendId, operationId, message}`. MCP `max_polls_vote`, `max_polls_close`, `max_polls_create` match. `max_polls_create` replaces `revote` with `silent`.
- **`--json` responses for reactions, pinning and marking read are shared with tg**, and each includes `operationId`, the ID of that action as in the send log:
  - `reactions add|remove`: `{operationId, chatId, messageId, reaction}`, your reaction or `null`; message counts remain available through `messages list`.
  - `messages pin|unpin`: `{operationId, chatId, messageId, pinned}`, with `pinned` as `true` or `false`.
  - `chats mark-read`: `{operationId, chatId, until}`, with `null` meaning through the latest message.

  MCP `max_reactions_add`, `max_reactions_remove`, `max_messages_pin`, `max_messages_unpin`, `max_chats_mark_read` match.
- **`max messages unpin <чат> <сообщение>`** now requires a message number, like `pin` and tg. MAX has one pinned message per chat; that message is unpinned regardless of the number supplied. MCP tool `max_messages_unpin` also requires `message`.
  What to consider: `messages unpin <чат>` without a number fails — add any message number from that chat.
- **`max serve --detach` and `max serve --stop` are removed**, replaced by `max server start` and `max server stop`. `serve` handles foreground work; `max server` controls background work. Update scripts and manually written services.
- **`max server status --json` returns the same fields as tg**: `byHand` becomes `by` (`hand` means manually started, `command` means started by a command, `server` means `max server start`, `unit` means a service); added fields are `log`, `unit` and `stale` (the server crashed and left a marker). `max server start`, `stop` and `restart` respond as in tg: `{ started, by, pid, startedAt, log }` and `{ stopped, by, pid }`; `socket` is removed.
- **`max messages send --at` is now `--at-time`**, as in every tg and max command whose option accepts a time. Scripts using `--at` get an “unknown option” error — replace it with `--at-time`. MCP parameter `at` in `max_messages_send` is unchanged.
- **`--markdown` is removed; use `--md`** in `messages send`, `messages edit` and everywhere markup is read. This name is used in all tg and max commands; scripts with `--markdown` get an “unknown option” error — replace it with `--md`.
- **`max sends list --json` renames `cid` to `sendId`, a string instead of a number**, matching `outcome_unknown` and `--send-id`. Older records are displayed in the new format too.
- **Run records (`--trace`, `--record`, `max runs show`) use a shared tg and max format.** An event’s send ID is called `send`, not `cid`; the MAX failure field is `providerError`, not `maxError`, in events, `run.json` and the `details` of a `--json` error.
- **`max bot` returns `outcome_unknown` (code `14`) for write responses 502, 503 or 504**, previously `provider_unavailable` (code `12`). Gateway responses do not prove whether MAX executed the request; it may have succeeded. Scripts retrying code `12` could duplicate writes. For code `14`, check the result first. Reads still retry and return `provider_unavailable`.
- **Bot commands use shared tg names; old names are removed.** `max bot messages get <сообщение>` → `messages show <чат> <сообщение>`; `messages edit|delete` also take chat first. `bot chats get` → `chats show`; `bot chats pin|unpin` → `messages pin|unpin <чат> <сообщение>`. `--format markdown|html` becomes `--md` or `--html`. `--type` is removed: use `--photo`, `--voice`, or `--as-file` for video documents. `chats action` accepts `typing`, `photo`, `video`, `voice`, `file`. Sends and edits return `{ operationId, message }`. Deletion asks for approval; `--allow-dangerous` supplies it. MCP names are `max_bot_chats_show`, `max_bot_messages_show`, `max_bot_messages_pin`, `max_bot_messages_unpin`.
- **`max bot members` and `max bot admins` are now `max bot chats members` and `max bot chats admins`**, as in tg. `admins add` takes `--can` with the values from `max chats admins add` (`read`, `members`, `admins`, `info`, `pin`, `link`, `edit`, `delete`) instead of `--permissions`, and `--title` instead of `--alias`. `--can` has no “calls” or “statistics” rights. `admins list` returns `{ id, name, username, role,
  rights, title }`. MCP tools: `max_bot_chats_members_list|add|remove`, `max_bot_chats_admins_list`.
- **Local-only changes are now classified as writes.** `config set`, `unset`, `chats rules set`, `unset`, `recipients add`, `remove`, `clear`, and bot `auth set`, `remove`, `chats rules set`, `unset`, `recipients add`, `remove`, `clear` write configuration, rules, recipient lists or keyring entries, never MAX. The [Command reference](./commands.md) labels them “Changes data only on this computer”; `max commands` shows them in `writes`. Read-only filters using `max commands --json` now exclude them.

### Fixed

- **Time-based `max store fetch` no longer skips a boundary message** and stops if MAX repeatedly returns the same page.
- **`max messages list --before-time` excludes messages at the exact millisecond boundary:** before means strictly earlier.
- **`max messages list --after-id` (0.21.0: `--after <id>`) reports a next page when present**, instead of always claiming none for forward reads.
- **`max messages send --voice` works through `max serve`.** Previously its waveform was lost, causing MAX `proto.payload`, code `11`. It already worked with `--no-serve`.
- **`max chats list` and `max chats show` remove departed chats** on the next login returning a complete MAX chat list. Previously they remained with stale member counts. Messages remain until `max cache clear --left`. `max serve` detects departure only on its next full login.
- **`max serve` no longer confuses responses after prolonged use.** Two-byte request numbers wrap after 65,536 requests; pending numbers are now skipped to avoid assigning another request's response.

## 0.21.0 — 30.09.2026

### Changed — may break scripts

Commands follow one naming rule: subject first, then action. Old names no longer work — `max` returns “unknown command” or “unknown option” with code `1` and does nothing.

- **`max backup messages` → `max store fetch`.** Download starts immediately; `--estimate` only calculates (previously downloading required `--run`). Each run still handles up to `--max-pages` pages, default 40, with the same pauses. `--pause` requires a duration (`5s`, `500ms`); unitless numbers refuse. `--since` and `--last` are optional: repeated runs otherwise reach the beginning, resuming where they stopped.
- **`max export messages` → `max store export`.**
- **`--cid` → `--send-id`** for `messages send` and `messages forward`. `outcome_unknown` uses `sendId`; MCP `max_messages_send` and `max_messages_forward` rename `cid` to `send_id`.
- **`max chats read` → `max chats mark-read`**; MCP `max_chats_read` → `max_chats_mark_read`.
- **`max chats settings` is removed.** `max chats show` displays `settings`, `description`, `access`; `max chats link show` still displays invites. Change settings with `max chats update <чат> --all-can-pin on|off` and other flags.
- **`max update` → `max upgrade`**, and the new-version notice now names `max upgrade`.
- **`max recipients off` → `max recipients clear`**, response `off` → `cleared`; **`max bot recipients off` → `max bot recipients clear`**.
- **`max account sessions end-others` → `max account sessions end --others`**; omitting `--others` refuses.

### New

- **`max complete` appears in `max --help`**, making Tab setup discoverable.
- **[Browser access guide](./remote.md): ChatGPT or Claude** through a password-authenticated proxy and public Tailscale address without a domain. Based on documentation, not tested end to end.

## 0.20.0 — 30.09.2026

### Changed — may break scripts

- **The shared message store moves to version 6** (cli-messaging 0.49.0). The first `max` run updates `messages.db`; after that, `tg` versions older than the one released that day refuse to open the file and ask you to update — `npm install -g @wirecat/tg-cli@latest`. `max` commands are unchanged.
- **`--all-bots` requires permission to read other bots.** Configure `readOtherBots` in `bot` with `max <имя> config set --bot readOtherBots true`, or a profile list. Otherwise the command refuses with code `5` and an enabling command.
- **When a name matches several people, candidates are sorted by name**, with unnamed people first; previously they followed cache order. The error text is unchanged.

### New

- **`--bots news,support`** for `bot messages search`, `bot people show`, `bot messages between` reads only those profiles if permitted by `readOtherBots`. `bot messages search` also supports `--all-bots`.
- **`bot mcp` exposes `all_bots` and `bots`** for these three tools only when cross-bot reads are allowed.
- **People are isolated per bot.** A person seen by one bot is unavailable to another without `--all-bots` or `--bots`.
- **Bot text search matches three-letter substrings inside words** (`вартир` finds “квартиру”), like personal search in this release.

## 0.19.0 — 28.09.2026

### Changed — may break scripts

- **An agent using `max mcp` closes a poll only if the profile permits `edit`.** Previously, `reaction` was enough.
  Why: closing edits the poll message, and `max polls close` always required `edit` — the agent and a person had different permissions for the same action.
  What to consider: if the profile’s `allow` includes `reaction` but not `edit`, the agent no longer sees `max_polls_close`; add `edit` to let it close polls. If `allow` is unset, nothing changes. See [docs/mcp.md](./mcp.md).

### Fixed

- **`max mcp --confirm-send` starts when account changes are enabled only through `mcpTools`.** Previously, the flag also required one of `--allow-*`, or the server would not start.
  Why it matters: a server with only `mcpTools` therefore ran without a confirmation form — the agent could add and remove contacts, create groups and change the profile without asking you.
  What to consider: without `--confirm-send`, behavior is unchanged. Add the flag to the server startup command to see a form before every change.
- **`max <бот> bot messages search --limit N` reports when more matches exist.** Previously, responses always had `hasMore: false`, and `limit` came from settings rather than your `N`.
  What to consider: a script or agent relying on `hasMore` to continue searching stopped on the first page and missed matches. It now receives `hasMore: true` when there are more than `N` matches.

## 0.18.1 — 28.09.2026

### Fixed

- **`max contacts rename` appears immediately** in `contacts show` and direct-chat titles. Previously names remained stale until background `max serve` logged in again because it ignored the returned contact. If still stale, the first 0.18.1 command replaces the old server.

## 0.18.0 — 28.09.2026

### New

- **Account-changing tools in `max mcp`:** add, remove, rename and block contacts; close your poll; join, leave and create groups; appoint and remove admins; change profile name and description. Previously MCP only read and sent messages. Only the owner enables them through `mcpTools`, for example `max config set mcpTools contacts,polls`; agents cannot self-enable through flags. Every action passes `readOnly`, `allow` and logging. See [MCP guide](./mcp.md).
- **Bot file uploads appear in `--trace` and run records.** `bot messages send --file` and `bot uploads put` show two lines with file type, size, HTTP status and duration. Upload URLs and filenames are never displayed or logged.

### Fixed

- **`max contacts rename` now renames contacts.** Previously, MAX reported success but the name remained unchanged.
  Why: without `lastName`, MAX silently changes nothing. `lastName` is now always sent (`null` if no surname), as in the web client.
  What to consider: names “changed” through 0.17.x were not actually changed — rename them again.

## 0.17.1 — 28.09.2026

### Fixed

- **Invalid `--limit`, `--last`, `--max-pages` errors repeat your input** for `messages list`, `inbox`, `backup`, `sends list` and bots. `--limit abc` previously reported `NaN`; 0.17.0 fixed only paginated lists.
- **`runs list` and `sends list` truncated by `--limit` report `hasMore: true`.** Previously, responses had `hasMore: false`, and `limit` differed from the number requested.
  What to consider: scripts using `hasMore` to decide whether to keep reading previously stopped on the first page.
- **A contact you renamed appears under the name you chose**, as in the MAX app. Previously, `max` showed the person’s own name even if you renamed them with `contacts
  rename` or in the app.

## 0.17.0 — 28.09.2026

### Changed — may break scripts

- **Every list in `--json` is an object `{items, page, limit, hasMore}`, rather than an array.** This now applies to `account sessions list`, `chats members list`, `chats folders list`, `messages scheduled`, `messages download`, `messages context`, `models audio list`, `recipients list`, `sends list`, `runs list`, `chats check`, `chats events` and all bot lists. Previously, some returned arrays, and `chats events` returned `{events, more}`.
  Why: lists came in three different shapes, so scripts and agents had to remember each command’s shape.
  What to consider: scripts that read an array must now read `.items`. For a list without pages, `page` is 1 and `limit` is the number of returned rows. `bot members list` and `bot admins list` also include `marker`, and their `user_id` is now a string. `bot messages get` returns the message itself, rather than a one-item array. `--jsonl` and human-readable tables are unchanged. MCP follows the same format.

### New

- **`max doctor` and `max config show` recognize bots.** The profile list includes all profiles on this computer, marked as personal account, bot or both. Bot profiles were previously missing. `doctor` shows the bot token’s source (without the token itself), how many chats the bot has seen and where profile files are; `doctor --online` asks Bot API who owns the token.
  What to consider: for bot profiles, `doctor` and personal commands no longer suggest `session start`; they name the appropriate `max <имя> bot …` command.
- **MCP `max_status` and `max_bot_status`** report the server profile, token presence and enabled writes. Neither writes; `max_status` never logs into MAX.
- **Tab completion recognizes bots.** For bot commands, it suggests chats the bot has seen rather than personal account chats; for the first word, it suggests all profiles, including bot profiles.
- **Bot commands support diagnostics like personal commands.** `max <имя> bot … --trace` prints each request's operation, chat/message, HTTP status and duration. `--record` saves runs; failures save automatically. Read with `max runs list`, `max runs show`. File uploads (`--file`) were not recorded until 0.18.0.
- **Separate `personal` and `bot` settings**, each with `defaults` and `profiles`. `max config set --personal|--bot` writes sections; `max config show --bot` shows bot values and source keys such as `config file: bot.profiles.test`. More specific values win: section profile, profile, section defaults, global `defaults`. Old files retain behavior. See [Configuration](./configuration.md).
- **Optional bot hourly limits:** `max <имя> config set --bot sendsPerHour 200`. Bots remain unlimited by default.
- **`max config set defaultProfile <имя>`** chooses the implicit profile, previously always `default`.
- **Profile photos, your own name for a contact, and blocking.** `max account update --photo <файл>` sets a new profile photo. `max contacts rename <кто> <имя> [фамилия]` gives a person a name only you see. `max contacts block <кто>` and `unblock` block and unblock people, even those not in your contacts.
  What to consider: all use the same checks as `account update` and `contacts add`. In this version, `contacts rename` did not actually change names — fixed in 0.18.0.
- **Channels:** `max chats create <название> --channel` creates a private channel. Invite with `max chats link show`; direct addition may be rejected by MAX.
- **Admin read and invite-link rights:** `max chats admins add <чат> <кто> --can read,link`. A bot without `read` cannot read group messages.
- **Relative times** for `--since`, `--before`, `--after`: `30m`, `2h`, `1d`, as in `max review --since 1d`, replacing the former exact-time requirement.

### Fixed

- **Your chat changes appear immediately.** After `max chats update`, `chats settings`, `chats link
  reset`, `chats show` and `chats list` previously showed old titles for minutes because MAX does not echo changes and `max serve` ignored the returned chat. It now applies it as it already did sent messages.
- **`max export messages` no longer warns about missing history before 1970-01-01 after a complete `backup`.**
- **Errors in `--limit` and `--page` repeat what you typed.** Previously, an error for `--limit abc` referred to the input as `NaN`.
- **Reset invite links in `chats inspect` and `chats join` return not found** (`not_found`, code 6) instead of an opaque MAX opcode rejection. Update scripts expecting another code.
- **`max config show` and `max doctor` omit phantom `<имя>.moderation` profiles**, previously confused with moderation-rule files.
- **Subcommand errors name the unknown word rather than the profile.** Previously, `max work bot auth status` said `work` was read as a profile name, although the unknown word was `status`.
- **`max config show` displays `transcribeModel`**, previously omitted.

### Removed

- **Join requests: `max chats requests list|accept|decline`, `requests`, `consent.accept`, `consent.decline`.** MAX has public or invite-only groups without approval, so the commands promised nonexistent functionality. Old rule files remain readable; the next write removes obsolete fields. Calls to `chats requests` return unknown-command errors.

## 0.16.0 — 27.09.2026

### New

- **Bot people and conversations:** `max <имя> bot people show <кто>` shows where someone posted and their direct chat; `bot messages search --from <кто>` finds posts by people; `bot messages between <кто> <кто>` finds chats where everyone posted. All data comes from this computer's seen messages; `--all-bots` reads all bot copies.
- **Bot group checks:** `max <имя> bot chats check <чат>` applies `bot chats rules show|set|unset` to messages and members, using joins saved by `bot updates watch`. Removed people cannot return through invites unless `--no-ban` is used; Bot API cannot undo the ban. Account ages are unavailable, so those rules do not run.
- **Polls.** `max messages list` shows a poll as text: question, options with IDs in `[скобках]`, votes and ✓ beside your choice. `max polls vote <чат> <сообщение> <вариант>…` votes, `--retract` retracts a vote, `max polls close` closes your own poll, and `max polls create` creates one. MCP has `max_polls_vote` and `max_polls_create`, only with `--allow-send`.
  What to consider: `max` rejects anything the web client would reject — closed polls, too many options, or a second vote without permission to revote — without sending anything. web.max.ru does not display polls, and `polls create` reminds you of this.
- **`max <имя> bot mcp`** connects an agent to a bot, read-only by default in this release. Writes require `--allow-send`, `--allow-delete`, `--allow-moderate`, with `--confirm-send` for forms. Commands enforce recipients and logs; rule actions needing confirmation share one form. See [Bot MCP](./bot.md#бот-для-агента-mcp).

### Changed — may break scripts

- **The `timeout` parameter of `max bot api get-updates` now uses `--poll-timeout`.** Previously, the operation’s `--timeout` never reached MAX: `--timeout` is the command’s overall deadline.
  What to consider: scripts passing `--timeout` for long polling must switch to `--poll-timeout`.

### Fixed

- **Automatically started `max serve` is replaced on the first newer-version command**, rather than rejecting new operations, such as voting, until `max server stop`.
- **A different build with the same version also replaces its server.** A manually started server rejects unfamiliar operations with a `max server stop` hint.
- **`max bot api get-updates --limit …` works.** Previously, the operation’s `--limit` was mistaken for a `max` setting and the command refused.

## 0.15.0 — 27.09.2026

### New

- **`max chats check <чат>`** checks messages and joins since the last run against `max chats rules`, then reports, deletes messages or removes members as allowed. Default is report-only; `--dry-run` only plans, at most 10 actions per check. Deletion/removal uses normal safeguards. Join-request actions were only planned here, then removed in 0.17.0 because MAX has none. See [Groups](./groups.md).
- **Agent moderation:** `max mcp --allow-moderate` exposes `max_chats_check`; `max_chats_events`, `max_chats_members`, `max_chats_rules` are always available read-only. Without the flag, checks are absent. Required approvals use one form.
- **Roles and invites:** `max chats members list` labels `owner`, `admin`, `member`; `max chats link show <чат>` shows invites.
- **Personal-account video and voice:** `max messages send <чат> --file ролик.mp4` sends in-chat video (`.mp4 .mov .webm .mkv`); `max messages send <чат> --voice
  заметка.ogg` sends voice with waveform and duration. Use `--as-file` for the old video-document behavior. Voice requires Ogg Opus; other formats receive an `ffmpeg` conversion hint. See [Personal account guide](./usage.md).
- **Voice messages appear as text directly in the list.** `max messages list <чат> --transcribe` and `max inbox
  --transcribe` transcribe the displayed voice messages on this computer; text appears under the message with a 🎤 icon, and in `--json` under `transcript`. MCP uses `transcribe: true` in `max_messages_list` and `max_inbox`.
  What to consider: previously transcribed messages show text even without the flag. Transcription requires a downloaded model.
- **More bot commands:** `max <имя> bot messages send --file <путь>` attaches images, video, audio or files; `bot uploads put` uploads only. `bot members list|add|remove`, `bot admins list|add|remove` manage membership; `bot comments list|get|send|edit|delete` handles channel comments; `bot callbacks answer` handles buttons; `bot commands
  list|set|clear` manages menus; `bot webhooks list|set|delete` manages webhooks. See [Bots](./bot.md). `webhooks set` rejects another configured address because MAX delivers to both instead of replacing one.
- **Bot local storage:** read, sent and received messages are saved. `max <имя> bot messages list <чат> --offline` and `messages get --offline` read without a network; `bot messages search <текст>` searches. Deletions performed by the bot or observed through `updates watch` remove local messages. Storage contains message text.
- **`max <имя> bot updates watch`** prints events until Ctrl-C and saves messages, resuming on the next run. It does not work with a webhook and consumes updates unavailable to other readers; use only when no other reader needs the bot.
- **Bot people:** `max <имя> bot people show <кто>` reports chats and latest direct messages; `--refresh` refetches from MAX. `bot messages
  search --from <кто>` searches one author; `bot messages between <кто> <кто> …` finds shared conversations. `--all-bots` searches all copies; people accept ID, `@username` or name fragment.

### Changed — may break scripts

- **`max bot messages list` prints older messages first**, like `max messages list`. Previously, new messages came first. Messages sent by the bot are now marked as its own.
  What to consider: scripts taking the first row as the newest message now get the oldest.

### Fixed

- **`max review --transcribe` closes MAX before recognition:** audio downloads first, then connection closure, then the model.
- **`max bot api edit-my-commands`, `subscribe`, `unsubscribe`, `get-upload-url` work**, rather than failing with “an account change without a known action”.
- **Bot sends to positive IDs without `user:` suggest `user:<номер>`**, since the destination is probably a person.
- **[Bot examples](./bot.md) omit fabricated chat IDs** and explain how to get real ones.

## 0.14.0 — 27.09.2026

### New

- **`max bot` uses the official Bot API.** `max bot auth set` verifies and stores its token separately in the keyring. Profiles go first: `max рабочий bot me`. `max bot me` shows the bot; `max bot api <операция>` calls any of 33 operations with parameter flags and JSON bodies, generated from the [official schema](https://github.com/WireCatLabs/max-cli/blob/v0.72.0/docs/dev/bot-api-coverage.md). IDs above 2^53 are strings; scripts must treat them accordingly.
- **Convenient bot commands.** `max <имя> bot messages send <чат> <текст>` sends to a chat by number, to a person as `user:<номер>`, or by the title of a chat the bot has seen; `edit`, `delete`, `list` and `get` are also available. `max <имя> bot chats list` shows chats the bot has seen, alongside `chats get|pin|unpin|leave|action`. `max bot list` shows every name with a bot token.
  Why “has seen”: MAX has no bot chat list, so `max` remembers chats itself.
- **Bot recipients and logs:** `max <имя> bot recipients add|list|remove|off`, `max <имя> bot sends list`. Every write, including `bot api`, checks recipients. No hourly bot limit existed until 0.17.0. See [Bots](./bot.md).
- **Group moderation: what is happening.** `max review --unanswered [часы]` shows group questions neither you nor admins have answered yet; `max review --chat <чат>` reviews one chat. `max chats events <чат>` shows who joined, left, was added or removed. `max chats members list
  <чат>` lists all group or channel members, with registration date and last seen. `max chats
  rules show|set|unset <чат>` manages group moderation rules in one file, like `config set`.

### Fixed

- **MAX disconnections report the close code and reason.**

## 0.13.0 — 26.09.2026

### New

- **`max review` gathers commitments:** all messages, including yours, in chats active since the prior review, or 3 days without `--since`. `--transcribe` processes audio; the response gives the next review boundary. Incomplete data is explicitly marked; do not treat it as complete ([Review guide](./usage.md#обзор-кто-кому-что-должен)).
- **MCP `max_review` and `/review`** organize what you owe, await and need to clarify, checking work groups before declaring overdue items and drafting reminders. Reminders require approval ([MCP prompts](./mcp.md#команды-и-чаты-по-)).
- **`max mcp config` prints configuration for Claude Desktop, Cursor and other clients**, with absolute paths for Windows and applications missing terminal `PATH` ([Connection guide](./mcp.md#подключение)).
- **`max doctor` checks the installation:** what runs `max`, where it is installed, whether a new terminal will find it, whether the keyring and SQLite load, and whether a speech model is downloaded.
  What to consider: if the command reference is not on `PATH`, `doctor` prints a command to fix it — for PowerShell on Windows and `export` on Linux and macOS. If `max` itself is not found, run `npx @wirecat/max-cli doctor` ([troubleshooting.md](./troubleshooting.md#max-не-находится-после-установки)).
- **`max doctor --online` checks MAX connectivity:** one login, one chat and MCP startup, without sending.
- **`max models audio download` checks the model after download.** Missing-model errors explain its language and alternative models with sizes.

### Changed — may break scripts

- **MCP `max_messages_attachment` becomes `max_messages_photo`.** Regrant client permission under the new name if previously saved.
- **Profiles cannot be named `review`**, now a command; rename existing profiles with that name.

### Security

- **Windows reports hide every spelling of the home path**, where some usernames previously remained visible.

## 0.12.0 — 26.09.2026

### New

- **More MCP tools:** `max_inbox` for updates in one call, replies and formatting, reactions, and photos visible directly to agents ([Tools](./mcp.md#инструменты)).
- **Claude Code `/catch-up`, `/reply`, `/find` and chats through `@`** ([MCP prompts](./mcp.md#команды-и-чаты-по-)).

### Fixed

- **`max serve` works on Windows**, using a named pipe instead of a file.
- **Long socket paths on macOS and Linux produce clear errors**, instead of `EINVAL`; long profile names or `MAX_STATE_DIR` can cause this.

## 0.11.0 — 26.09.2026

### New

- **`max watch --events` includes edits, deletions and reactions**, with an `event` field. Without the flag, output is unchanged ([Live updates](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch)).
- **Problem reports go to GitHub rather than email.** `max doctor report create` prints a prepared issue link; attach its report file. Issues and attachments are public ([Reporting problems](./troubleshooting.md#как-сообщить-о-проблеме)).
- **Every failed command gets a run record**, including invalid flags, preflight checks and non-network commands (`models`, `server`, `watch`), previously only failures reaching MAX. Only command words are recorded, not arguments or message text ([Diagnostics](./diagnostics.md)).
- **`max backup messages --run` explains storage and export.** Messages are in local storage; `max export messages` creates a file. Its ready-made command appears at the end and in `export`.
- **Background `max serve` enforces read-only, actions, recipients and hourly limits and logs sends.** `config set` takes effect without restart. It does not start with `MAX_TOKEN`.
- **After login, `max serve` requests the same data as a web.max.ru tab:** folders, banners, call history, sticker sets and reactions. **It also logs in again the same way:** it sends MAX the previous login time and asks only for changed chats, rather than the whole list.
  Why: the less `max` differs from the web client, the fewer reasons MAX has to notice it.
  What to consider: all of this is read-only; responses are neither displayed nor saved. One-off commands do not do this ([security.md](./security.md#что-уходит-в-сеть)).
- **The background server survives a malformed incoming MAX message:** it skips the message, writes one line about it and keeps running. Previously, such a message could stop the server.

### Changed — may break scripts

- **Stronger agent safeguards:**
  - `max mcp --confirm-send` confirms every write, including edits, forwards, pins, read receipts and deletion. Approval works once for 5 minutes.
  - `sendsPerHour` includes edits, notified pins and each added person. Scheduled messages count in their send hour. Simultaneous sends can no longer both pass the last available slot.
  - Group creation and additions with a recipient list require every person's direct chat on that list.
  - `chats members add` hides older history unless `--history`; `--hide-history` is removed.
  - `MAX_PROFILE_LOCK` fixes the profile.
  - `--file` protects hidden files/directories and `max` directories unless `--allow-any-file`.

  Hourly limits may be reached sooner. Remove `--hide-history` from scripts; intentional hidden-file sends need `--allow-any-file`.

### Fixed

- **`max watch` no longer labels edits or deletions as new messages**, despite MAX returning them in message-shaped events.
- **Exact titles no longer silently win** over other partial matches. Both candidates are shown for ID selection, preventing irreversible wrong sends.

### Security

- **A token from `MAX_TOKEN` stays only there.** If MAX issues a new session token, `max` writes it neither to the keyring nor to a file, and reports this in stderr. `max doctor` names `credentials.json` if that file stores the token instead of the keyring.
- **`max session start` masks phone numbers**, like `max account show`. Ctrl-C at the token prompt returns `130`.
- **The background server does not give the token** to commands asking it for login information: they do not need it and consult the keyring instead.
- **Network limits:** decompressed MAX frames are capped at 32 MiB. Connections and downloads have timeouts. `max messages download` requires HTTPS, rejects local-machine/network URLs even after redirects, and caps files at 4 GiB and transcription audio at 32 MiB. Message links are untrusted.
- **Local storage permissions:** database, `-wal`, `-shm` files use `0600`; directories `0700`. Existing permissions are corrected on opening. Reports replace chat/message IDs with labels.
- **Untrusted text uses one line with visible controls** in feeds, tables, candidates, Markdown and `messages download` paths. Filenames lose control and text-direction characters; only `http` and `https` become Markdown links.
- **Completion inserts only IDs**, displaying names beside them because titles and `@имя` come from other people and must not become shell code.
- **`max cache clear` without a profile respects the default and `MAX_PROFILE`.**
- **Releases are stricter.** Dependency versions are pinned exactly; the package is built from scratch before each packaging step, without test helpers; publishing is done in a separate step that neither installs nor runs dependencies.

## 0.10.0 — 25.09.2026

### New

- **`max doctor report` and `max doctor report create`** explain report contents or create a content-free file with next steps. This release used email; 0.11.0 moved to GitHub ([Reporting problems](./troubleshooting.md#как-сообщить-о-проблеме)).
- **`max backup messages <чат> --since <дата> | --last <n>` downloads more chat history into the local copy.**
  What to consider: without `--run`, the command only shows an estimate and sends nothing. With `--run`, it pages backwards through 30 messages at a time with pauses, up to 40 pages per run, and resumes from the same position on the next run ([usage.md](./archive.md#скачать-историю)).
- **`max doctor` shows which MAX web-client version `max` identifies as**, and warns if that version was read more than 60 days ago.
  Why: MAX may stop accepting an old client version ([troubleshooting.md](./troubleshooting.md)).
- **`max server start|stop|status|restart` manages the background server as a separate component**, like `max session`. `status` shows whether the server runs, since when, its version and whether it is connected to MAX; it suggests `restart` when the server’s version is older than `max`. `max serve --detach` and `--stop` still work ([usage.md](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch)).
- **History reads send the same five fields as the web client**, and login requests 15 chats from MAX, like a web.max.ru tab, then retrieves the rest in one request. Previously, `max` added a field the web client does not send and requested 40 chats at a time.
  Why: the less `max` differs from the web client, the fewer reasons MAX has to notice it.
  What to consider: the chat list is unchanged. Checked on a channel with unread messages: reading still marks nothing as read.
- **The device description comes from your computer:** time zone, system language and operating system are specific to each installation, as in a browser. Previously, every `max` installation identified as the same Chrome on Linux in the Madrid time zone.
- **`max serve` sends one hidden-tab-style service event** 20 seconds after login: chat list shown, with account ID and time, no content or titles. One-off commands do not send it ([Network behavior](./security.md#что-уходит-в-сеть)).
- **`max` rejects overly long folder titles itself** — no more than 20 characters, the limit MAX accepts. Previously, the request went to MAX and came back rejected.

### Changed — may break scripts

- **Excessive-login rejections no longer trigger more attempts.** Code `8` pauses a profile for 1 minute, 5 minutes, 30 minutes, 1 hour, 6 hours, then 1 day. The background server stops on any login rejection, previously retrying indefinitely each minute. Scripts receive code `8` until the stated time; wait ([Troubleshooting](./troubleshooting.md)).

### Fixed

- **An unavailable keyring is no longer mistaken for being logged out.** If a profile has logged in on this computer but its token is not visible — for example, from cron — `max` and `max doctor` say the keyring is probably the cause. Previously they suggested logging in again.
  Why it matters: a new login in this case adds an unnecessary new device to the account ([recipes.md](./recipes.md)).
- **Failed runs save without `--record`**, including MAX key (`login.token`), warning codes, crash location, runtime version and OS, never text. Background logs use timestamped JSON lines ([Diagnostics](./diagnostics.md)).
- **`max chats read --until` marks only through its message**, rather than using current time and marking newer messages read. `messages list --mark-read` is fixed too; others may previously have seen receipts for unread messages.

## 0.9.0 — 25.09.2026

### New

- **`max` talks to MAX like the web client:** the same address, binary frames and compression as web.max.ru, and the same device description with updated app and browser versions. Previously, `max` sent text frames in an old format.
  Why: the old format made `max` easiest to distinguish from the web client. Also, voice and round video messages need a byte field the old format could not send.
  What to consider: commands and output are unchanged. Sending voice messages is planned for later versions. For now, MAX sends the entire chat list at each login rather than only changes: this works but adds traffic.
- **Automatically started `max serve` restarts after updating `max`.** Manually started servers remain old until `max serve --stop` and a restart.

## 0.8.0 — 25.09.2026

### New

- **`max messages transcribe <чат> <id>`** recognizes voice locally without uploading it. `max models audio list` shows language support; `max models audio download <id>` downloads and checksum-verifies. MCP: `max_messages_transcribe` ([Voice transcription](./usage.md#голосовые-в-текст)). Download is explicit and one-time; saved transcripts avoid both network and model on repeats.
- **One MAX connection per profile**, shared by commands, `max mcp`, `max watch` through `max serve`, reducing logins and possible session termination. `max session start` stops, logs in and restarts it ([Server guide](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch)).
- **`max serve --detach` starts in the background and returns once connected; `max serve
  --stop` stops it.** Manual servers stop only with Ctrl-C or `--stop`; `max
  session end` leaves them running.
- **The `allow` setting defines what a profile can do.** `max work config set allow send,reaction` lets the profile only send messages and react. There are twelve names, from `send` to `sessions`.
  What to consider: without a list, everything is allowed, as before. Forbidden actions fail with code `5` before connecting, and the error names a command to permit them. In `max mcp`, the agent does not see tools the profile does not permit ([usage.md](./usage.md#что-профилю-можно)).
- **`max messages send … --at <время>`** schedules on MAX's server, even with the computer off. Accepts `2026-09-25T09:00` locally or `30m`, `2h`, `1d`. `max messages scheduled <чат>` lists the queue; MCP uses `at` in `max_messages_send` and `max_messages_scheduled`. Cancellation is app-only ([Scheduled sends](./usage.md#отправить-позже)).
- **`max chats read <чат>` and `max messages list … --mark-read`** send explicit visible read receipts. MCP needs `max mcp --allow-mark-read`; normal reads remain invisible ([Reading](./usage.md#чтение)).
- **`max export messages <чат> --format jsonl|md` exports a conversation from the local copy** to JSONL or Markdown, with `--since` and `--output`. It does not contact MAX.
  What to consider: the command reports missing local data in stderr. The file from `--output` is accessible only to you ([usage.md](./archive.md#выгрузить-в-файл)).
- **`max messages delete <чат> <id…> --allow-dangerous` deletes messages**, up to 10 at a time. By default, only for you; with `--for-everyone`, for everyone in the chat. MCP uses `max mcp --allow-delete`, only “for me”.
  What to consider: without `--allow-dangerous`, the command refuses. Each deleted message counts towards `sendsPerHour` ([usage.md](./usage.md#удаление)).

### Fixed

- **Updating `max` no longer erases history you have read.** Previously, every new version changing the local-copy structure discarded all saved messages. Messages now migrate into the new copy.
  What to consider: this release itself changes the copy’s structure, and history is retained. Chats and people are fetched again on the next login, as before.
- **After server login rejection, commands wait 10 minutes before starting another server**, rather than repeatedly triggering rejected logins. `max session
  start` clears the wait.
- **`max watch` sees messages sent by `max` itself**, previously missing because MAX does not echo to the sending connection.
- **Simultaneous `max` commands no longer lose login data in the local copy.** Previously, two out of three simultaneous commands reported “the local record did not take this login” and failed to save chats, members and the sync marker. The second now waits for the first to finish writing.

### Security

- **Error text cannot control the terminal.** Controls display as `\x1b`, extending 0.7.0's protections because errors may quote user input or MAX responses.

## 0.7.0 — 24.09.2026

### New

- **`max reactions remove <чат> <id>` removes your reaction.**
- **Groups and channels under `max chats`:** view the link, join, leave, create a group, add and remove people, assign and remove an admin, rename, change settings, re-release the link. There were also applications for membership here - they were removed in 0.17.0, because they are not in MAX. What to consider: all this is seen by other people, and each action goes through the same checks as sending ([groups and channels](./usage.md#группы-и-каналы)).
- **`max update` updates `max` with the same package manager it was supplied with;** `--check` only tells if there is a newer version. What to consider: once a day a person sees a line in the terminal about a new version; agent and script - never. Turns off `updateCheck: false` to `defaults` ([update](./installation.md#обновление)).
- **Addition for Tab in zsh, bash, fish and PowerShell:** `source <(max complete zsh)`. Offers commands, flags, their meanings, as well as chats and people from a local copy - without connecting to MAX ([help for `max complete`](./commands.md#max-complete)).
- **`max mcp` - the same profile for agents via MCP**, for clients without a terminal (Claude Desktop, Cursor). Connection - [MCP server](./mcp.md). Things to consider: the server only reads until it is started with `--allow-send`; the shipment undergoes the same checks as `max messages send`.
- **`max mcp --allow-send --confirm-send` shows the form before each submission:** to which chat (name and id) and what. What to consider: nothing goes away without your “yes”; a client that cannot display forms receives an error ([what can an agent do](./mcp.md#что-может-агент)).
- **`max messages send … --file <путь>` sends photos and files;** several photos are sent in one message.

### Security

- **Other people’s text no longer controls the terminal.** A message, sender name, chat title, filename or reaction containing control characters could erase a line and print over existing `max` output. These characters are now displayed as `\x1b` in feeds, tables, errors and Tab suggestions.
  What to consider: JSON is unchanged — it already escaped them.

## 0.6.0 — 24.09.2026

### New

- **`max commands --json`** describes all commands, arguments, flags and exit codes in one response, with `mutates: true` for MAX changes. Agents avoid per-command `--help`; it works without login and with broken configuration.
- **`max messages send … --reply-to <id>`** replies to a message.
- **`max messages send … --markdown` (or `--md`)** formats `**жирный**`, `_курсив_`, `~~зачёркнутый~~` and `` `код` ``. Without a flag, text stays literal.
- **`max reactions add <чат> <id> <эмодзи>`** sets a reaction, replacing yours.
- **Reactions are visible while reading:** `messages list`, `show` and `context` print `👍 3  🔥 1  (you: 🔥)` under a message; JSON has a `reactions` field.
  What to consider: this adds one read-only request per page. With `--offline`, reactions are absent (`null`) because they are not stored.
- **Send logs and optional recipients:** `max sends list` logs attempts without content; `max recipients add|remove|list|off` restricts chats, rejecting code `7`. `readOnly` rejects `5`. See [Security](./security.md) for scope and limitations.
- **`max session start qr | qr-chrome | sms | token`** logs in without copying browser tokens. `qr` renders in the terminal, or browser if narrow; `qr-chrome` and `sms` open web.max.ru in separate Chrome, Chromium, Edge or Brave windows. Without a method, import manually or by pipe as before.

### Changed — may break scripts

- **Sending has an hourly limit: 30 messages by default (`sendsPerHour`).** Above this limit, `max messages send` fails with code `8`. Previously there was no limit.
  What to consider: scripts sending more must raise `sendsPerHour` in settings.

## 0.5.0 — 24.09.2026

### New

- **`max messages download <чат> <id> [--output <каталог>]`** saves photos, files, video and audio without overwriting existing files.
- **`max config set <настройка> <значение>` and `max config unset <настройка>`** edit configuration, with `--defaults` for all profiles. Global `defaults` apply where a profile has no override.
- **`max chats list --unread`** filters unread chats.
- **`max messages list <чат> --after <id|время>`** reads forwards after a message or time, with a `--after <id самого нового>` continuation hint.
- **`max chats show <чат>`** shows a chat/members; **`max contacts show <человек>`** accepts ID, @username or name fragment and shows shared chats. Ambiguity lists candidates instead of guessing.
- New read operations in this release neither send nor mark read.

### Fixed

- **`--offline` works.** Previously, no command received the flag: reads still contacted MAX, and `max --offline messages send` **sent a message**. Reads now use saved data, while sending and downloading refuse with `--offline`.
  What to consider: if you ran `--offline messages send` on 0.4.0 or earlier, the message was sent.
- **Settings-file errors are explained plainly:** which setting is unknown, which settings exist and what values are accepted. Previously, they were validation-library messages.
- **Run-log failures (`--record`) no longer crash commands.** A stderr warning, even with `--quiet`, leaves the normal result and exit code intact.

### Security

- **GitHub Actions publishes with npm provenance**, allowing verification that the package was built from this repository.

## 0.4.0 — 23.09.2026

### New

- **`max messages show <чат> <id>`** reads one message; **`max messages context <чат> <id>`** uses `--before`, `--after` for context, marking `◀` or JSON `"anchor": true`. Missing messages return not found instead of neighbors.
- **`max skill show`** prints installed agent instructions: `max skill show > ~/.claude/skills/max-cli/SKILL.md`.
- **`max config show`** reports effective profile and source, configuration path/existence, all profiles including state-only ones, and every setting's flag/environment/file/default source. `MAX_CONFIG_DIR` and related overrides warn about alternate keyring entries.
- **Piped text:** `echo "текст" | max messages send <чат>` reads stdin when no text argument is supplied, avoiding `ps`/history exposure and supporting newlines.
- **`--timeout <срок>`** limits the whole connection/login/request sequence, not a single response.
- **`max doctor`** reports token source without its value, login count/time, logged-in profiles, supported/cache schemas and keyring entry without contacting MAX. It works during failures; missing sessions are data, not errors.

### Changed — may break scripts

- **The `--query` flag for lists is renamed to `--search`.** This change was already included in 0.3.0 but was missing from its release notes.
  What to consider: scripts using `--query` get an error — replace it with `--search`.

### Fixed

- **`messages list --before <id>`** derives time from the ID without requiring an earlier read.
- **Group members use names instead of IDs**, fetched once and saved, including reply/forward authors; previously only contacts had names.
- **Releases finish tagging after publication**, fixing two failures by bypassing npm cache and waiting up to three minutes.

## 0.3.0 — 22.09.2026

### New

- **Conversation feeds:** day separators, `время  автор` and aligned, terminal-width text. `вы` means your messages, unnamed authors use IDs. `↳` and `↪` show replies/forwards received in full and saved locally.
- **`-v`, `-vv`** add message, sender, chat IDs and attachment URLs, then all known fields.
- **`--jsonl`** provides one JSON object per line for streaming and `jq`.
- **Attachment links:** `📎 photo`, `📎 photo ×3 1 2 3`, `📎 файл.pdf · 24 MB`; JSON includes `url`, `width`, `height`, `title`. Photo URLs open without login, so recipients can access them.
- **`senderColors: true`** gives each author a color; off by default.

### Changed — may break scripts

- **`-v` now means output verbosity; the version is `max -V`.** **`--trace`** enables request lines in stderr — this was previously `--verbose`.
  What to consider: scripts using `max -v` for the version or `--verbose` for tracing must switch to `-V` and `--trace`.
- **List `--query` becomes `--search`**, originally omitted from these notes.
- **The local copy moves to schema 4 and is rebuilt on first run.**
  What to consider: history read in this version is not retained — you must read it again.

### Fixed

- **Ambiguous chat names return candidates with IDs**, including JSON `candidates`.
- **Cache warnings name the schema and next steps**, rather than `Error`.
- **`messages list` continuation hints use `--before <id>`**, not nonexistent `--page`.

## 0.2.0 — 22.09.2026

### New

- **`max messages send --silent`** requests sends without notifications. Its actual effect was not observed in this release because doing so required messaging a real person.
- **The token is exchanged on first login.** MAX responds to login with its own token, and `max` stores it in the keyring instead of the one pasted from the browser. This happens once.

### Fixed

- **`max session start` checks before saving**, preventing typos from replacing valid tokens.
- **Profiles stay tied to their account.** A different account's token is rejected with an explanation rather than running commands as someone else.
- **Unknown-send-outcome hints name a real command**, not nonexistent `max send`.
- **Login messages are retained**, previously discarded due to an incorrectly described response shape.

## 0.1.0 — 21.09.2026

The first shareable version.

### New

- **Seven commands against real MAX:** `session start|end`, `account show`, `chats list`, `contacts list`, `messages list`, `messages send`.
- **Profile - first word:** `max personal chats list`. Several accounts live nearby, each with its own token, its own state and its own local copy. `MAX_PROFILE` sets the same.
- **The token is stored in the operating system keychain**, and not in a file or in the command argument. What to consider: you don’t have your own login by phone number yet - `max session start` takes a token from the official client.
- **Machine mode:** `--json` puts exactly one JSON value and nothing else on stdout; the same thing turns on itself when stdout is not a terminal. The error goes to stderr, stdout remains empty. You can branch by exit code - table in [command reference](./commands.md).
- **Diagnostics without content:** `--verbose` shows a line per request, `--record` puts them in the run directory for 30 days, `max runs list|show|path` reads them back. By default, nothing is written.
- **Local copy:** what you read is saved nearby; `--offline` answers from it without connecting, and `max cache clear` forgets it.
- **Settings in `~/.config/max-cli/config.json`**, with the order “flag → environment variable → file → built-in value”. A typo in a field name is an error with the field name, not a silent omission.
- **Two runtimes:** Node 22+ and Bun 1.3+; the assembled command is executed under both in CI.
- **Reading does not mark anything as read.** “Get history” and “mark as read” are different protocol operations; the second is never sent, and this is checked by the test.
- **Sending does not lie about the outcome.** If the response did not arrive - `outcome_unknown` (code `14`), and not “error” and not “sent”. What to consider: you can repeat such a sending only with the same `--cid`, otherwise the message may be sent twice.
- **The MAX protocol is unofficial and reverse engineered:** it is not a Bot API. Things to consider: It may change without notice; then command will say this in one line to stderr, rather than crash silently.
- **Not yet able to:** log in using a phone number, work with attachments, reactions, edits, groups, stories and calls - text only. There will be no mass mailing: this is a tool for a personal account.
