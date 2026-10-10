---
title: "Changelog"
---

Notable changes to `@wirecat/max-cli` (`@leemour/max-cli` through 0.41.0), one section per version, newest first. Versions follow [Semantic Versioning](https://semver.org/lang/ru/); the command interface may still change before `1.0.0`.

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

- **The package is now `@wirecat/max-cli`, and the repository is `WireCatLabs/max-cli`.** Install with `npm install -g @wirecat/max-cli`; the `max` command stays the same. Uninstall `@leemour/max-cli` first: both packages provide `max`. There will be no new `@leemour/max-cli` versions.
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
- **Node 22.16 or later is required**, or Bun as before. If Linux Node uses an outdated system SQLite, `max` restarts using bundled SQLite from `@leemour/cli-messaging-sqlite` before reading or sending. Official Node builds and Bun need no change.
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

- **The shared message store moves to version 6** (cli-messaging 0.49.0). The first `max` run updates `messages.db`; after that, `tg` versions older than the one released that day refuse to open the file and ask you to update — `npm install -g @leemour/tg-cli@latest`. `max` commands are unchanged.
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

- **`max bot` uses the official Bot API.** `max bot auth set` verifies and stores its token separately in the keyring. Profiles go first: `max рабочий bot me`. `max bot me` shows the bot; `max bot api <операция>` calls any of 33 operations with parameter flags and JSON bodies, generated from the [official schema](https://github.com/WireCatLabs/max-cli/blob/v0.43.1/docs/dev/bot-api-coverage.md). IDs above 2^53 are strings; scripts must treat them accordingly.
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
  What to consider: if the command reference is not on `PATH`, `doctor` prints a command to fix it — for PowerShell on Windows and `export` on Linux and macOS. If `max` itself is not found, run `npx @leemour/max-cli doctor` ([troubleshooting.md](./troubleshooting.md#max-не-находится-после-установки)).
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
