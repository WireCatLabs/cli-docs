---
title: "История изменений"
---

Notable changes to `@wirecat/whatsapp-cli`. One section per version, newest first; versions follow
[semantic versioning](https://semver.org), so before `1.0.0` the command interface may still change.

## 0.10.0 — 25.10.2026

### Changed — may break callers

- **Each command is checked under its own permission key (cli-core 0.421.0).** `chats unmute` is checked only as `chats.unmute`, so a level saved on `chats.mute` no longer applies to it. `messages sync` is checked as `messages.sync`; a level on `messages` still applies. A saved permission key that no command checks now stops every command, bot ones included, with the `config unset` that removes it.
- **`doctor --json` reports the config file's problems as `config.issues` (cli-core 0.423.0).** `config.error` is gone. Each issue has a `kind` (`invalid_json`, `unknown_setting`, `unknown_permission`, `missing_setting` or `invalid_value`), the `file`, the `profile` and `key` where they apply, `line` and `column` for invalid JSON, a sentence that says what the value has to be (never the value), and `fix`, the `config unset` command that removes it. `doctor` lists every problem in the file, still exits 0, and still answers when the JSON is broken. A profile lock, a flag or an environment variable the settings refuse is reported in `settings.error`.
- **`default_profile`, `analysis_provider`, `analysis_model` and `analysis_base_url` are unknown settings, and `WA_ANALYSIS_PROVIDER`, `WA_ANALYSIS_MODEL` and `WA_ANALYSIS_BASE_URL` are not read.** A file that has one is refused like any unknown setting, with the `config unset` that removes it. Analysis is set with `models.analysis.provider`, `models.analysis.model` and `models.analysis.base_url` (`WA_MODELS_ANALYSIS_*`); `--model` and `--base-url` of `conversations links rebuild` override those.
- **A command refused for a problem in the config file names the first problem and the command that removes it**, and says how many more `doctor` lists. `config show`, `set` and `unset` run on such a file, and `config unset` removes a setting no schema knows. An unknown permission key in any section of the file is refused, not only in the sections the command reads.
- **`config set` saves `config.json` readable by you only (`0600`) (cli-core 0.428.0, cli-base 0.57.0).** It used to rewrite the file as `0644`. Anything that reads the config as another user — a system-wide service, a container under another uid — can no longer read it after the next save; run it as the owner, or give it its own config.
- **A run record names how it was started and why it failed (cli-core 0.425.0).** `run.json`, `runs list`, `runs show` and `search runs` gain `cli_command` (the whole command, `wa messages list`), `argv` with every value that may be content written `[redacted]`, `agent` (the coding agent and its session, where it gives one) and, for a failed run, `error`. A run with no profile named leaves `profile` out instead of recording `default` (cli-core 0.424.0).
- **The first screen says zm and drive are "searchable with your other WireCat data"** (cli-core 0.426.0).

### Added

- **`wa skill status` and `wa skill show --for claude|agents`** (cli-base 0.56.0, through cli-core 0.427.0). `skill status` says, for Claude Code and for `~/.agents`, whether the installed SKILL.md matches this version; `skill show --for` prints the copy installed there.
- **`wa store tables list` lists every table of the local archive** with its kind and rows; `--full` adds each table's size (cli-core 0.427.0). `store info` also says which tools opened the store, its journal mode, pages, migrations and last backup, and counts by provider, chat kind, account, year and attachment kind.

### Fixed

- **A crash in the middle of a command is reported like any other failure.** It used to print Node's stack trace; now it prints the `internal_error` failure (`command.crashed`) — one line at a terminal, the JSON error object otherwise — and still exits 1. A stack trace tells a script nothing it can act on, and can carry text that should not reach the screen. A script that read the stack trace on stderr reads the error object instead.

### Security

- **`doctor` reports a `config.json` or config folder that other users can read, with the `chmod` that fixes it (cli-core 0.428.0).** `files.problems` lists the config file (wants `0600`) and its folder (wants `0700`), also when `WA_CONFIG_DIR` names the folder, and stderr prints `to make it private: chmod 600 '<path>'`. `files` is in the answer also with no profile named and when the settings are refused. Nothing is changed on disk; Windows is not checked.

## 0.9.0 — 25.10.2026

### Added

- `wa --help` names `wa account list`, which lists your profiles and their logged-in accounts.

### Changed — may break callers

- **The shared store moves to version 33 (cli-core 0.420.0).** Once this version opens the store, a CLI on an older cli-core refuses it and asks to be upgraded, so upgrade every WireCat CLI that shares the store together.

## 0.8.0 — 24.10.2026

### Added

- The owner-run `bin/live-oneshot-drop` can send its two test messages automatically with
  `--sender-profile`, using two explicitly confirmed accounts owned by the same person.

- **Session and setup receipts declare their actual provider schemas.** The complete contract audit checks them alongside shared entities.

- Preview a group or channel invite with `chats inspect` without joining it.
- `account sessions list` shows linked device ids and marks this device. Names and last-active times are unavailable.
- `chats folders list` and `show` read custom WhatsApp Lists and their chats from synced label state.
- Incoming community announcement comments are decrypted into their post's stored thread; `messages comments`
  reads the comments this device has received. Channels have no comments, and comment sending stays unavailable.

### Changed — may break callers

- The one-shot regression checks the receiver's store before restarting `serve`; delivery only after restart
  is inconclusive. Lost messages and inconclusive checks now return nonzero.

- **Template lists use a query instead of a name flag.** Replace `bot templates list --name hello_world` with
  `bot templates list name:hello_world`. Meta applies the name predicate before paging; unsupported query fields
  are refused before a request. The retired flag has no compatibility alias.

- **Shared CLI contracts require explicit provider overrides.** Discovery includes the inherited definitions, schemas, reasons and exact deliberate differences. Contact activity filters with `scope:` and `at:`, and diagnostic run searches with `started_at:`. Unknown roster and webhook type lists are omitted instead of `null`.

### Fixed

- Permission-denied commands stay discoverable in CLI and MCP with current availability and reasons. Calls still enforce permissions; a listed command grants no execution access.
- The owner-run one-shot regression can pause and restore a persistent systemd user service, including one
  that selects its profile through its environment instead of a command argument.

- Full settings sync recovers stars and deletions as history updates, instead of presenting them as new live events.
- The installation guide explains how to allow the optional agent-skill hook with npm's scoped `--allow-scripts` flag.

## 0.7.0 — 24.10.2026

### Added

- The first command at a terminal asks once for your languages, other WireCat tools to install, and whether
  commands and agents may only read. Pipes, agents and noninteractive runs skip the questions.
- Preview a group or channel invite with `chats inspect` without joining it.
- `account sessions list` shows linked device ids and marks this device. Names and last-active times are unavailable.
- `chats folders list` and `show` read custom WhatsApp Lists and their chats from synced label state.
- Incoming community announcement comments are decrypted into their post's stored thread; `messages comments`
  reads the comments this device has received. Channels have no comments, and comment sending stays unavailable.

### Changed — may break callers

- **Live JSON output uses item and end records.** `watch --jsonl` wraps each message or event in
  `{ "type": "item", "data": … }`, uses snake_case fields and finishes with a `type: "end"` record.
  Update scripts that consumed bare messages or events.
- **Diagnostic search is `search runs`.** Replace `runs search` and its filter flags with query terms such as
  `status:failed`, `error_code:timeout`, `operation:messages.download` and `profile:work`.
- **Duplicate-task lists require `tasks duplicates list`.** The bare group shows help.
- **MCP exposes more writes through permission keys.** Commands that change future permissions or automation
  require `mcp.authority: allow`; raw Cloud API calls require `bot.api: allow`. Both default to `deny` over MCP.
  Store maintenance and other writes follow their command permissions.
- **Shared commands use canonical names without compatibility aliases.** Use `contacts info|events|aliases`,
  `chats links`, `metadata show|sync`, `tasks update`, `commands info`, `mcp add|check` and
  `doctor reports show|create`. Models use `models list`, `models download` and `models keys`.

### Fixed

- Commands to end other sessions or remove contacts are hidden from help, discovery and MCP because a linked
  WhatsApp device cannot perform them.
- **The agent skill describes explicit read receipts correctly.** Reading changes no read state;
  `chats mark-read` clears the unread mark and sends the receipt. The top help points to linking examples
  without promising Windows instructions that setup help does not contain.
- Full settings sync recovers stars and deletions as history updates, instead of presenting them as new live events.
- The installation guide explains how to allow the optional agent-skill hook with npm's scoped `--allow-scripts` flag.

## 0.6.0 — 24.10.2026

### Added

- **`wa <profile> bot`: a WhatsApp Business number on Meta's Cloud API.** A bot profile keeps an access token in the
  system keychain (`bot auth set`) and the number's ids as settings (`config set --bot phone_number_id …`). `bot me`
  names the number; `bot api <operation>` runs any of 63 Cloud API operations generated from Meta's OpenAPI file, and
  asks before the ones that cannot be undone, such as `register-phone-number`. It never links a device or starts the
  engine. What to watch for: never register a number whose WhatsApp you use on a phone — that deletes its account.
- **A bot sends text, replies, files and templates.** `bot messages send` writes to a phone number in digits or to
  `user:<id>`; a file goes up once and is sent by its media id. `bot templates list` and `bot templates send <chat>
  <name> [language]` cover the approved messages, the only kind WhatsApp delivers more than 24 hours after a person
  wrote. `bot media download <id> --output <file>` saves a received file. WhatsApp has no silent message, edit or
  delete for a bot, so those are refused.
- **A bot receives messages by webhook: `bot watch --public-url <tunnel address>`.** Meta never lets a client poll,
  so `wa` listens on `127.0.0.1:8766` behind your tunnel, answers Meta's subscription check with the verify token,
  refuses any delivery not signed with your app secret, and acknowledges a delivery only once it is in the local
  store. Keep both with `bot auth set --secret app-secret` and `--secret verify-token`. `bot webhooks set <url>`
  points this number's webhook at the address. Delivery receipts arrive too. With the store holding a person's last
  message, a free-form send more than 24 hours later is refused before it leaves.
- **`bot mcp` serves the bot's commands to an agent**, as tg and max do, and [docs/bot.md](./bot.md) walks through
  Meta's test-number setup, the tunnel and each command.
- **Verified media backups.** `attachments download <dir>` archives available files across chats with size and
  SHA-256 manifests; `attachments check <dir>` verifies them offline. `attachments jobs` manages opt-in Linux
  daily timers. Completed copies survive interrupted runs and message-store deletion; interrupted files restart.
  `attachments move <dir> <archive-dir> --before-time <time>` moves older images into another verified archive,
  retaining relocation records so checks follow the copies and later downloads do not duplicate them.
- Saved voice-note transcripts match word forms and spellings that speech recognition may have garbled.
  `text:` searches written text only; `exact:` disables expansion for that word.
- **cli-core 0.394.0.** Store and statistics commands gain examples, and `contacts prepare` gives a cited brief before a conversation.
- **Upgrades are checked against saved state from version 0.2.0.** Offline validation uses a synthetic
  profile to check that configuration, stored messages and the device database location survive an upgrade.
- **Pull requests cannot grow the command-lint baseline.** New violations must be fixed or carry a dated,
  reasoned override, so adding a feature cannot silently weaken the existing checks.

### Changed — may break callers

- **Shared flags use one meaning.** Analysis uses `--analysis-provider`, vectors `--embedding-provider`, consent removal `--consent-provider`, tag ownership `--claim` and stored-answer removal `--answer-model`. Contact notes read `--text-file`; group message lifetime is `--disappear-after`. Catch-up views use query terms such as `inbox kind:group`. Old CLI flags remain hidden aliases for one compatibility release and cannot be combined with their replacements; saved MCP requests must use canonical arguments.
- MCP message deletion takes `message`, chat export takes `chat`, and duplicate-task operations take `task`
  and, for a pair, `other_task`. Update saved MCP requests using `messages`, `chats` or `dup`.
  CLI positional arguments keep their order.
- Command discovery (`commands` and `commands schema`) rejects `--jsonl`; use `--json` for its single document.
- **Read commands no longer send read receipts.** `messages list`, `inbox` and `review` drop `--mark-read` and
  `--no-mark-read`; remove `catch_up_marks_read` from configuration and use `chats mark-read` explicitly.
- **Misspelled permission keys now stop the command.** Correct or unset keys such as `messages.sedn` before running.
- **A mistyped profile lists the real profiles.** An unlinked profile's login hint now points to `setup`.
- **Setup returns suggested commands in `item.commands` and login details in `item.session`.** Update scripts
  that read `item.next` or `item.device`; `next` is reserved for structured continuation steps.

### Fixed

- cli-core 0.399.0 supplies the shared flag migration, additional help examples, offline review and the updated MCP server dependency. The command-lint baseline drops from 52 entries to 38; guides, skill and the generated reference use the released flags.
- Message-search commands no longer list or delete saved meeting searches.
- Command corrections preserve the chosen profile; help shows concise descriptions and concrete examples.
- **More useful command discovery.** cli-core 0.396.0 adds shared examples, concise skill summaries and profile-preserving corrections for joined command paths; cli-base 0.50.2 recognizes the approved messenger vocabulary and flag roles. Command discovery uses `--json` and refuses `--jsonl`.
- **Input errors name the selected command's flags.** WhatsApp adapters report domain fields for unsupported invite-link filtering, conflicting name fields and privacy refusals; cli-core formats those fields at the CLI boundary.
- **CI scans the checked history.** An unrelated fetched branch no longer fails a clean pull request's secret check; findings in the checked commit or any ancestor still block it.
- **A ban's end is shown in the local time zone and names that zone.** Stored timestamps remain UTC.
- **Unexpected engine failures use the provider error code.** Known validation and messenger errors keep their codes.
- **Agents are no longer offered channel comments, which WhatsApp cannot read** (cli-core 0.393.0). A direct call
  fails before connecting. Commands also show more concrete examples in their help.

### Security

- **The engine uses the patched Go certificate verification library.** Release and monthly checks now
  audit reachable Go vulnerabilities, and dependency updates cover the engine's Go module.
- **Local releases run engine tests, the coverage floor and security checks before publishing.** The npm token
  is supplied only to publishing, and publishing skips lifecycle scripts because validation already built the package.

## 0.4.0 — 22.10.2026

### Changed — may break callers

- **A call with no `outcome` may have ended.** Before, a call message with no `outcome` in `provider_metadata` was
  always still ringing. Now a call that ends for a reason `wa` does not know is kept as "Voice call" with no
  `outcome`, so it does not pass as missed or answered. A script that reads a missing `outcome` as "ringing" should
  read the text as well: a ringing call's text starts with "Incoming".

### Fixed

- **A call answered or declined on your phone is stored as answered or declined, not missed.** While `serve` or
  `watch` runs, WhatsApp tells a linked device only that the call was taken or turned down on another device, and
  `wa` read every such end as missed. Now a call you answer on the phone is "Voice call" with `outcome: answered`,
  one you decline is "Declined voice call", and one that rang out or that the caller hung up before you answered is
  "Missed voice call", as the phone shows it. An answered call taken on the phone has no `duration`: this device does
  not hear when it ends, and `wa` no longer stores `0` for it. A call that rang while `serve` was not running, and
  whose end the reconnect does not bring, is stored as missed instead of staying "Incoming voice call".

## 0.3.0 — 22.10.2026

### Added

- **Date filters say how they read the date** (cli-core 0.384.0). The JSON answer of a command with a date filter,
  such as `contacts context`, `contacts timeline`, `messages sync`, `chats moderate` and `store export`, gives
  `meta.window` with the `since` and `until` it used, in UTC, and `meta.timezone` when a date you typed had no zone
  and was read in the local one.
- **cli-core 0.382.0.** The first run opens the local store as version 28, which adds columns and removes
  nothing.
- **Your messages show whether they were delivered and read.** In a one-to-one chat, a message you sent carries
  `delivery`: `delivered` once it reached the other person's phone, `read` once they opened it. It comes from
  WhatsApp's receipts, which `serve`, `watch` and any other command keep, and from the history push. It only moves
  forward. A group's messages have none. `watch --events` prints each receipt. Needs cli-core 0.382.0 (store version
  27). The engine speaks protocol 44.
- **A chat's mute, archive and unread mark from the phone are kept** (cli-core 0.382.0). While `serve` or `watch`
  runs, and from the history push, the local store saves whether a chat is archived, muted and until when, and
  marked unread. So `inbox` and `review` over the store leave out muted and archived chats, and `inbox` lists a chat
  you marked unread. A chat read on the phone loses its unread mark, and the store now counts each new message from
  someone else after that read, so `inbox` shows a chat again once a new message arrives. `chats show` shows
  `muted_until` and `marked_unread`. What to watch for: a read on the phone resets the chat's last-message time to the
  newest message the phone read. Engine wire change: `mutedUntil` and `markedUnread` on a chat. Engine protocol 45.
- **Calls to you are kept as messages, so `inbox` and `review` show who called.** While `serve` or `watch` runs, a
  call becomes a message in the caller's chat: "Incoming voice call" as it rings, then "Missed voice call", "Declined
  voice call" or "Voice call" when it ends. It carries `"action": "call"` in `provider_metadata`, as tg marks its calls,
  so chat stats do not count it as something said. A group call is kept as it rings. `wa` never answers or declines a
  call. The engine speaks protocol 42.

### Fixed

- **A store the pre-rename `cli-messaging` wrote is refused again, and left untouched** (cli-core 0.385.0). Since
  cli-core 0.382.0 such a file was opened and failed with `internal_error`; it now fails with `configuration_error`.
- **`chats list` shows the groups you are in.** WhatsApp has no chat list, so the store knew only the groups a
  history push or a message had named, and `chats list kind:group` could come back empty. Every connection now saves
  the groups you are in, with their names and member counts; run `serve` (or any command that connects) once for
  them to appear.
- **A chat is found by a name copied with its emoji, by part of its name and whatever the case.** "Семья❤️" copied
  from WhatsApp carries an invisible mark after the heart, and was refused as "no chat by that name or id" while
  "Семья❤" worked. Names now match without that mark, ignoring case, and by part of the name, as `wa` already finds
  a person (cli-core 0.381.0). A name that matches several chats is refused as before; the refusal now reads "N chats
  match that name". What to watch for: a part of a name that used to be refused may now name a chat, when exactly
  one chat matches it.
- **Reactions that other people send are stored** (cli-core 0.381.0). `serve` and `watch` keep each
  person's newest reaction, live and from the history push, and `watch --events` passes each one on as a
  `person_reaction` event. A message then shows its reaction counts and your own reaction, from the phone, in
  `reactions`. A reaction taken back is dropped, and an older history push no longer undoes a newer change. What to
  watch for: a reaction you send with `reactions add` still goes to WhatsApp only, not to the store. Engine wire
  change: a `reaction` event and a history push's `reactions`. Engine protocol 43.
- **`stats chats retention` and `chats stats show` read `--since-time`/`--until-time` in their `--timezone`**, and a
  date alone in retention's `--until-time` covers that whole local day (cli-core 0.380.0). `stats charts`, `contacts
  timeline` and the MCP `stats` tool name the zone in `meta.timezone` and give the UTC window in `meta.window`.
- **A chat you read on the phone stops counting as unread.** While `serve` or `watch` runs, reading a chat on the
  phone sets its unread count in the local store to 0, so `inbox` no longer shows it. Before, the count stayed until
  the next history push. What to watch for: new messages do not raise a stored count, here or in any other chat, so
  until the next history push `inbox` finds them only with `--new`. Archiving, muting, pinning, marking a chat unread,
  deleting or clearing a chat on the phone are not saved yet, so `inbox` still lists an archived or muted chat.
  `watch --events` prints none of these changes, as in `tg`.
- **The ban error says its end time is in UTC.** "the ban ends 2026-10-21T14:03:00.000Z" now ends in "UTC", so it is
  not read as local time. `standing.until` is unchanged.

### Changed — may break callers

- **A typed date or time is read in your zone, and a date alone covers your whole local day** (cli-core 0.379.0).
  `--since-time 2026-10-01` used to start at UTC midnight; it now starts at local midnight, and `--until-time` with a
  date alone ends at the end of that local day. A time without an offset, such as `chats mute --until
  2026-10-09T09:00`, is read in the command's `--timezone` where it has one, else in the computer's zone. A value
  with `Z` or an offset means what it says, as before. What to watch for: a script that passed a date alone and
  expected the UTC day now gets the local one; pass `2026-10-01T00:00:00Z` to keep the old window. Stored and printed times stay
  UTC.

## 0.2.0 — 21.10.2026

### Changed — may break callers

- **`--qr-file` is gone: without a terminal, `session start` and `setup` print the QR code as text** for an agent to
  paste into the chat, instead of a PNG the person opens in an image viewer. The text is plain half blocks, no
  colours, about 73 columns wide. Each code is followed by a note telling an agent to paste it, and with `--json` it is
  also one stderr line, `{"event":"qr","qr":{"text","expires_at","scan"}}`. A QR link no longer needs a terminal; a
  pairing-code link (`phone`) still does, and without one says that it asks questions. A script that passed
  `--qr-file` now fails with an unknown option. In a terminal the code is drawn as before, as in tg and max.
- **A one-to-one chat typed by its phone number is addressed by its LID**, the id WhatsApp files that chat under,
  when WhatsApp has already given it. WhatsApp answers a send by the number with the LID, so a later
  `messages delete`, `messages star`, `reactions add` or `polls vote` by the number could miss the message: the
  deleted text stayed searchable, the star was lost, and the vote made a second chat. Every command that names a chat now looks the
  number up in the LIDs this device knows; nothing is asked of WhatsApp and nothing is recorded. A number with no
  known LID, a group, a LID or a channel is used as typed. An `--offline` command reads the store by the id as typed,
  and finds a chat that moved from that number to its LID once the store recorded the move (see Added).
  Engine wire change: a `canonicalChat` request. Engine protocol 38. Two things the owner may notice:
  - A recipient list entry added by the phone number stops matching once that number has a LID, and a send to it
    is refused with exit 7. The refusal names the id to allow: run `recipients add` with it, or with the number
    again, which now saves the LID. An entry added by the number moves to the LID by itself at the next `serve` or
    `watch` start, when this device already knows the number's LID, whether or not the store holds a chat under it
    (cli-core 0.356.0). The number is not asked of WhatsApp and is not recorded. Engine wire change: `recipients` on
    the `storedChats` request. Engine protocol 40.
  - A chat the store already holds under the phone number, such as one wa 0.1.0 saved, moves to its LID on the spot
    (cli-core 0.356.0): the first command that names it by the number, a send, `delete`, `star` or reaction
    included, moves the stored chat, its messages and its recipient-list entry to the LID, then acts on the LID
    chat. An `--offline` command moves nothing; it finds such a chat by the number once the store recorded the move.
- **`wa --help` and a bare `wa` show a short first screen** instead of every command and option: what `wa` is for,
  the usage line, the other WireCat tools it works with, and where to start. `wa --help-all` prints the old help and `wa help options` the
  options of every command. Each command's own `--help` now ends with what it returns, the commands that usually
  come next, and an example. A bare `wa commands` prints a text list by section, also when piped; a script that read
  its JSON must pass `--json` (cli-core 0.344.0).
- **`chats mark-read` takes a mark-unread off, and needs WhatsApp's settings keys for it.** It sent a read receipt
  only, which leaves a chat marked unread on the phone, and in your own chat it sent nothing at all. It now first
  marks the chat read on your devices, up to `--until-id` or the newest message the store holds, then sends the
  receipt as before. The same goes for `--mark-read` on `messages list`, `inbox` and `review`, one more write per
  chat. Right after linking, before WhatsApp has sent the settings keys, these now fail with
  `settings.keys-missing` (safe to retry) and send no receipt, where they used to send it; keep `serve` running a few
  minutes and run them again. Engine protocol 34.
- **The MCP server's `wa_read` and `wa_write` take each command's own arguments, in snake_case.** `search messages`
  takes `query` (not `text`) and no `ast`; `polls create` takes `question`; `wa_tools_search` shows each command's
  fields. The agent is offered every command the profile's permissions allow, including some it was not offered
  before; marking read, `--as-owner` and `--allow-any-file` stay off MCP. An agent's runs are named `mcp <command>`
  in run history and the send journal. `conversations rebuild` replaces the agent-only `conversations_refresh`.
- **A global `npm install` no longer writes the agent skill into `~/.claude/skills` and `~/.agents/skills` on its
  own.** npm hides what an install script prints, so the files appeared without a word. `wa personal setup` still
  offers the skill, and `wa skill install` installs it; set `WA_INSTALL_AGENT` (`all`, `claude`, `codex`, `cursor` or
  `gemini`) to have the install do it as before. The Windows installer is unchanged: it says what it installs.
- **`session start phone` and `setup --method phone` refuse a number without `+` and the country code** (exit 2,
  `input.invalid`). WhatsApp reads the first digits of the number as the country code, so a number typed the way it
  is dialled at home asked for a pairing code on someone else's account. Nothing reaches WhatsApp until the number
  starts with `+`.
- **`messages delete` without `--for-everyone` deletes the message for you only, where it used to be refused** (exit
  2). `wa` asks WhatsApp to take the messages from this account's devices, to leave them with the
  others in the chat, and to keep the photos and files the phone saved from them. Each message must be in the local
  store, since WhatsApp names it by its sender and the time it was sent; one the store lacks is exit 6 and nothing is
  deleted. A device without WhatsApp's settings keys yet answers `settings.keys-missing`, as `chats mute` does. An
  agent's `messages delete` over MCP, which was refused too, now does the same, for the owner only; deleting for
  everyone stays the owner's `--for-everyone`. A deletion asks first by default, and over MCP that level lets the
  agent's call through, so at the default an agent can now delete the owner's copy. To keep agents from it, set
  `permissions.messages.delete` to `readonly` or `deny`: the MCP server then does not offer the command, and an
  agent's call is refused with `permission_error` (`access.denied`), as the owner's own `messages delete` at those
  levels is, with exit 5. A delete
  of several messages that fails partway, with or without `--for-everyone`, now names the ones already deleted and
  is not marked safe to retry: delete only the rest. A message you delete for yourself on the phone leaves the
  local store the same way while `serve` or `watch` runs. Checked live on the phone for your own message in your
  own chat; a message in a group or in a one-to-one chat with someone else, and a delete made on the phone, are not
  checked yet.
- **`messages download` asks your phone for a file WhatsApp no longer keeps**, as WhatsApp's apps do, instead of
  answering `not_found` (exit 6) at once. It waits up to 20 seconds for the phone to upload it again and fetches the
  new copy. A phone that does not answer ends the download with `timeout` (exit 9); exit 6 now means the phone no
  longer has the file either. A script that read exit 6 as "expired" must also expect exit 9, and give a slow phone a
  longer `--timeout`. A new copy that then fails to download is `provider_error` (exit 11, `media.retry-failed`),
  whatever the first failure's code was; when the phone answered an error but still gave a path, it is the phone's
  answer instead (see Fixed). The store keeps the new copy's address, so a later download or forward
  uses it and does not ask the phone again (see Fixed).
  **Known limitation: a file WhatsApp no longer keeps does not download yet.** On the phones tried, the phone answers
  that it uploaded the file again, but it encrypts the new copy with a new key that it does not send to linked
  devices, so `wa` cannot read it. The download then ends with `media.retry-failed` ("the phone uploaded this file
  again, but the new copy did not download") and saves nothing, rather than a broken file. A file WhatsApp still
  keeps downloads as before. For an old file, open it on the phone, or ask the sender to send it again.
- **`messages forward` sends a stored place or contact card, where it used to refuse it.** The store now keeps a
  place's coordinates, name and address, and a contact card itself, next to a file's keys, where no answer shows
  them. A place or card stored before this, a live location and several cards in one message are still refused.
- **A person's chat moves to their LID when WhatsApp gives them one.** WhatsApp names a one-to-one chat by the
  person's phone number until it gives them a LID, its private id for a person. `serve` and `watch` now move the
  stored chat and its messages to the LID, so `messages list` and `search` show one chat, and no chat is left under
  the phone-number id (`…@s.whatsapp.net`). A script that saved that id must take the new one from `chats list`. The
  move is repeated at each start for 30 days, so one that came while only a one-shot command ran still lands. A
  send typed to the old id stores a chat under it again, which a later repeat of the move merges. The merged chat
  keeps the stricter privacy of its two forms: hidden from search if either was, personal if they disagree, and a
  scope pinned on either stays pinned (cli-core 0.353.0). A chat stored under a phone number by wa 0.1.0 moves too:
  `serve` and `watch` hand the stored chat ids to the engine as they start, and one whose LID WhatsApp already gave
  moves at once (cli-core 0.350.0, `storedChats`). If that fails, `wa` says so once on stderr (`stored_chats_failed`
  in the run record) and goes on. Engine wire change: a `storedChats` request. Engine protocol 37.
- **`serve` asks WhatsApp for the LID of a chat still in phone form**, so that chat moves too. It asks a minute after
  history stops coming or `serve` or `watch` starts, for chats the account already has only: five people per
  request, one request every 10 seconds, at most 20 people per run, and each person at most once a week. The owner's
  own `lookup` keeps its own pace. If WhatsApp asks to slow down, the lookups stop for a week and the next write is
  refused with `account.rate-limited`, which holds the profile's writes for 15 minutes, also when `serve` restarts
  meanwhile. Not yet run against WhatsApp.
- **A command cut off by a dropped or ended connection no longer answers `network_error`** (exit 10), which invited
  a retry and a double send. A send, edit, reaction, group change or other write whose request left before the
  network dropped, and could not be sent again, now answers `outcome_unknown`: exit 14, `retry.safe: false`, also
  when WhatsApp handed the login to another connection meanwhile, since the write may have gone through. Check the
  chat before you send again. Otherwise, a command relayed through `serve` while another process took the login over
  now answers `device.replaced`, and after a ban or a logout `account.banned` or `device.logged-out`. A script that
  retried on `network_error` must not retry these.
- **`chats rules set` refuses a `newAccount` rule** with `validation_error` (exit 2) and saves nothing: WhatsApp does
  not say when an account was made, so the rule was saved and could never match. A script that sets one must drop it.
- **A send that waits on another `wa` process exits 9, not 1** (cli-core 0.338.0): when another process on the
  profile is sending or clearing the pace for longer than the 5 s wait, a send or `flood clear` answers `timeout`,
  since nothing was sent and a retry is safe. A change to the recipient list held elsewhere for 5 s is
  refused with exit 9 and the list stays as it was; two changes at once no longer undo each other.
- **`wa upgrade --offline` exits 2** instead of asking npm anyway.
- **`WA_READ_ONLY` refuses more, always with exit 5 and "this process is read-only (WA_READ_ONLY)"** (cli-core
  0.328.0 to 0.337.0). An agent that did any of these under the lock must do it in a process without
  it. Newly refused:
  - `session start`, `session end` and `setup`, before they act ("it cannot log in or out"); `session start` and
    `setup` on a profile linked before used to go ahead;
  - the message store: `store reset`, `restore`, `clear`, `migrate`, `repair`, `decrypt` and `copies delete`
    (`--dry-run` still previews);
  - what the owner saved: `searches create|delete|clear`, `contacts alias set|rm`, `contacts notes
    add|edit|remove` and `tags remove`;
  - other local writes: `tags add`, `tags auto`, `mentions confirm|reject`, `contacts link|unlink`, `attachments text
    set`, `chats tracking add|remove`, `conversations links add|clear`, `conversations consents revoke` and `tasks
    reject`; `tasks close` only suggests the close;
  - and their MCP tools.

  `messages delete` under the lock exits 5, not 7 ("asks before it acts"). `wa upgrade --check` now runs under the
  lock; `wa upgrade` without it is still refused.
- **`conversations embed` and `conversations build` count as writes to an outside service, and `search
  conversations` as a read from one** (cli-core 0.334.0, 0.336.0): a failed run is not marked safe to
  retry, and under `WA_READ_ONLY` each refuses before it sends chat text or the query to a remote provider; a local
  model still works. They always run in the calling process, never through `serve`. Their help now says "Changes
  something in WhatsApp", which here means the outside provider.
- **A ban or rate limit holds every write, for as long as it lasts** (cli-core 0.334.0): while WhatsApp has the
  account banned or rate-limited, a reaction, `chats mark-read` and a group title change are refused with exit `5`
  too, not only sends and edits. Reads still work; `inbox` and `review` with `--mark-read` still show what they read
  and warn that nothing was marked read. A temporary ban WhatsApp dates holds writes until its end, the error says
  when, and `standing.until` is that time. A ban with no end has `standing.state` `banned`, not `frozen`, and
  `until: null` in `doctor --json`, `flood clear --json` and `server status --json`, where it held for a year
  before; `wa <profile> flood clear` or a `doctor --online` that connects lifts it.
- **`serve` banned by WhatsApp is not restarted by its unit** (exit 5 joins exit 4 in the unit's no-restart list):
  a restart 30 s later connected again during the ban. `wa <profile> server status` says it stopped and will not
  restart; start it again with `wa <profile> server start` once the ban ends.
- **An older client's `session end` relayed into `serve` is refused** with `permission_error`, exit
  `5`, `sent: false`, naming `server stop`; it was `provider_unavailable`, exit `12`, `device.in-use`. `serve`'s
  connection and the keys stay as they were.
- **Ctrl+C or `--timeout` during the history wait after linking ends the wait, not the command**: `session start`
  keeps what arrived, counts it and exits 0. It exited 130 or 9, though the device was linked. `setup` goes on to
  its account, chat and agent steps, which get a deadline of their own (cli-core 0.334.0); a
  Ctrl+C after the wait ends setup (130). With `--timeout`, the link and the wait share that one deadline, and the
  steps after it get that long again.
- **`chats list` and `chats show` answer from the local store and never connect** (cli-core 0.328.0), so they run
  here while `serve` runs. `recipients add` runs through `serve` instead of being refused with exit 12.
- **A link without a terminal waits 5 minutes by default, not 30 seconds** (cli-core 0.328.0), so an agent's
  `session start` is not cut off before the code is scanned. `--timeout` still decides when given.
- **A command path given as one argument fails** (cli-core 0.328.0): `wa 'chats list'` printed the root help and
  exited 0; it now fails with `validation_error`.
- **`wa mcp` offers only what `wa` has** (cli-core 0.328.0, 0.335.0): `chats link create`, which failed, is gone,
  and a command that refuses `--offline` no longer has an `offline` input; an agent that passes one gets
  `validation_error`. `metadata get` and `metadata refresh`, which failed too, now work (see Added).
- **`chats events` answers from the local store** (cli-core 0.336.0): it no longer refuses with exit `2`, never
  connects, and works with `--offline`. What it lists, and how `stats chats show` counts members from it, is under
  Added.
- **A chat or person named by name is found in the local store first** (cli-core 0.337.0): part of the name is
  enough, and a name several stored chats match is refused with "… matches N chats", as `chats show` refuses it; a
  caller that matched the old "N chats share that name" must match the new text. Only a name the store does not hold
  is asked of WhatsApp's chat list, so a one-shot command now finds a stored group by its name. `watch` titles a
  chat from the store and follows its renames; a chat the store has never held has no title in `watch`.
- **A live edit or deletion of a channel post is no longer passed on**: `watch` and `serve` used to hand it on under
  an id the store does not file the post by. A channel's posts are now read with `messages sync <channel>`.

### Security

- **The engine log (`WA_ENGINE_LOG`) no longer keeps media download links.** When a download failed on the network,
  whatsmeow wrote the whole link into the log: the file's path on WhatsApp's servers, its hash and the signed
  `oh`/`oe` values, which together fetch the file for anyone who has them; a failed delete of history-sync media wrote
  the media `auth` token the same way. Every link now becomes `[url]`, a server path `[path]`, and those values `…`,
  before the line is written.
- **A message sent to a phone number is saved in the chat WhatsApp answered, with that chat's privacy kept**
  (cli-core 0.356.0). `wa` answers a send to a person who has a LID with their LID chat, but the message was saved
  under the number that was typed, in a second chat. Now `messages send`, `polls create` and `messages forward` save
  it in the answered chat. A chat made for it takes the typed chat's search visibility and scope; a chat that exists
  already keeps the stricter of the two, so a chat hidden from search does not come back into search under its other
  id. `wa <profile> sends list` names the answered chat beside the typed one when they differ.
- **A failed background `messages sync` no longer writes a chat title or a name into its job file** (cli-core
  0.355.0). The file keeps the error's code and points at `wa store jobs show <id>`, which prints the path of the
  job's log. The full message stays in that log, which only you can read (mode `0600`).
- **A chat hidden from search no longer turns up in a search that does not name it** (cli-core 0.353.0). The
  messages by and about a person in `contacts context`, the pictures lane of `search messages`, and the meaning half
  of `search conversations` and `conversations related` left it in, and the search answers listed it as not yet
  embedded. A sender-only lookup no longer counts its messages. `wa` has no command that hides a chat from search,
  so only a store edited by hand was affected.
- **`WA_READ_ONLY` refuses a write to WhatsApp before anything connects.** `messages send`, `edit`, `delete`,
  `reactions add` and the other commands that change something on WhatsApp used to connect and find the chat first;
  now they exit 5 at once, and a broken login no longer turns the refusal into a network failure. A permission level
  of `readonly` or `deny` on the command does the same (cli-core 0.343.0).

### Fixed

- **An album wa sends shows on the phone as one album.** It showed as two messages, a photo and a video. Messages
  wa sends now carry a message secret and a reporting token (all but reactions and poll votes), as WhatsApp Web,
  Baileys and mautrix-whatsapp send them, and each file of an album points at the album by the chat id WhatsApp
  delivered it to (the LID when the chat was typed by its phone number). Checked on a phone.
- **Photos and videos wa sends show on the phone.** They never did, as an album or a forward either, while wa's own
  linked devices received them: the message lacked the file's URL. Photos, videos, voice notes, documents and
  stickers now carry it, as WhatsApp's own apps and mautrix-whatsapp send them. Checked on a phone. A message now
  also carries the time its file's key was made, as Baileys sends it, and a document with a caption goes in the
  wrapper WhatsApp's apps use. A file stored before this fix, or one the phone uploaded again, gets a URL built from
  its path when it is forwarded. The URL is kept with the file's keys in the store and is never printed. Engine wire
  change: `url` and `mediaKeyTimestamp` in a file's ref. Engine protocol 41.
- **A chat id works in a query without quotes.** `chat:100000000000002@lid` and `chat:120363000000000001@g.us`
  failed with `query.unsupported-operator`, because the `@` was read as an operator; only the quoted form worked.
  Both forms work now (cli-core 0.375.0, cli-base 0.47.3).
- **`session end` unlinks the device on WhatsApp's side, which it never did before.** Since the first release the
  engine sent the logout without connecting, so every `session end` stopped with "the connection to WhatsApp broke
  before it confirmed the change; it may have gone through — check first", sent nothing and kept the keys. If you
  deleted a profile's keys by hand after that, the device is still linked: remove it on the phone, in WhatsApp →
  Linked devices. `session end` now connects first, then logs out. When WhatsApp refuses the device on connect (logged
  out, or removed on the phone), the keys here are deleted, the command exits 0 and says "WhatsApp had already dropped
  this device". A network failure before the logout is sent keeps the keys; a connection cut after it was sent still
  answers "may have gone through". No engine wire change.
- **A group the owner left is found by its name or any id when a command reads its kept history** (cli-core
  0.368.0): `store export` (also `--output-dir` with named chats), `store status`, `messages context --thread`,
  `messages evidence`, a search's `--chat` and `chat:`, `metadata get`, `chats members`, `chats events`,
  `chats documents`, stats, tags, tasks, conversations, embeddings, pictures and attachments, as `chats show` and
  `messages list` already did. Before, these refused a left group by every name and id. `chats tracking add` and
  `store gaps plan` still refuse it.
- **More of `serve`'s warnings carry a code in its log**, so a script can match the code instead of the sentence: a
  flood wait (`flood_wait`) or a long pace wait (`pace_wait`), both with `counts.seconds`, a held account
  (`account_frozen`, `account_limited`, `account_banned`), a wait that could not be remembered
  (`wait_not_remembered`), a send missing from the send journal (`send_not_journaled`), a recipient list that could
  not be re-keyed or read, and the reply audience and template warnings. The log record holds no sentence, chat id or
  name; the sentence at a terminal is unchanged (cli-core 0.364.0).
- **The first `serve` after an upgrade hands its chat re-keys to the store together**, up to 500 at a time, instead
  of one at a time. On an account with thousands of chats stored by phone number, that start announces a re-key for
  each, and every one was saved as a batch of its own. A re-key that arrives alone waits at most 0.1 s. The store
  saves them in short passes with a pause after each, so another `wa` command run during that start no longer waits
  seconds for it; re-keys left when `serve` stops are one warning, and the next `serve` applies them (cli-core 0.359.0).
- **A group you left, were removed from, or that was deleted is marked left in the store**, so
  `wa <profile> store clear --left` finds it; until now it found nothing. The mark comes from WhatsApp's group
  notice while `serve` or `watch` runs, and from a `wa <profile> chats leave` that succeeds; a `chats join` that gets
  in takes it off (cli-core 0.356.0), and so does WhatsApp's notice that someone added you back (cli-core 0.357.0);
  a group you had archived stays archived. A group left while nothing was connected is not marked. A group marked
  left drops out of `chats list`; `chats show` shows it and says you left it, and its messages stay in the store and
  in search until you clear it.
  Engine wire change: `membershipState` on a pushed chat, `"left"` (protocol 39) and `"member"` (protocol 40).
- **`setup`'s link step is headed "Link this device"** and no longer asks you to scan a QR code before one is
  drawn. The line under the code says where to scan; a narrow terminal shows only the hint to widen it.
- **A terminal too narrow for the QR code no longer asks you to scan it** (cli-core 0.350.0). `session start` and
  `setup` said where to scan in WhatsApp before the code; when the code did not fit, only the hint to widen the
  terminal followed. Now the scan line comes after the drawn code, and a narrow terminal shows only the hint.
- **A one-shot command now saves the history WhatsApp pushes to it.** WhatsApp sends a history push to a linked
  device once. A command such as `messages send` with no `serve` running received it and dropped it. It is now saved
  to the store like the messages queued for it, and the command waits up to 3 seconds at exit for a push still
  downloading (cli-core 0.348.0, `listenHistory`). `session end` ends this quietly; when the phone logs the device out
  mid-command, `wa` says on stderr that history batches arriving were not saved.
- **A group taken out of its WhatsApp community no longer names it in the store.** `wa` saves WhatsApp's notice that
  a group left its community, or that the community was deleted, and clears the group's `parent_chat_id`; its title,
  unread count, member count and last activity stay. Each followed channel's push at connect, and any chat whose
  source does not say, no longer erases a stored unread count and last activity either (cli-core 0.348.0). Engine
  wire change: `unread` and `lastMessageAt` may be absent, and `name` and `participants` too, on that notice. Engine
  protocol 36.
- **A group added to a WhatsApp community names it in the store at once.** `wa` saves WhatsApp's notice that a group
  joined a community and sets the group's `parent_chat_id`, keeping its title, counts and last activity. Before, the
  parent showed only after a live read of that one group.
- **`session start` no longer gives up right after the phone confirms the link.** WhatsApp restarts the connection
  once pairing is done, and wa took the start of that restart for a failure: it said "linked, but could not reconnect
  to WhatsApp in time" and exited 10, the device linked but the history never received, while the phone's linking
  screen hung waiting for it. wa now waits for the new connection, up to a minute, and then receives the history as
  before. Both the QR code and the pairing code went this way. If that new connection fails, wa connects once more
  itself a few seconds later, within the same minute, instead of waiting the minute out. Every other command's wait
  for its connection uses the same loop now, so it no longer spins while the old connection is being closed. When the
  phone has pushed nothing after 20 seconds, `session start` says once that it is still waiting, so the pause does not
  look like a hang.
- **A pushed community no longer loses its mark.** The store replaced a chat's `provider_metadata` whole on every
  push, so a later push that did not say a group was a community took `community: true` off it. A key a push leaves
  out now keeps its stored value, and so does a group's `parent_chat_id` (cli-core 0.346.0). Engine protocol
  35.
- **`inbox` and `review` check `--json=<fields>` against the message summary's fields**, and refuse a name it does
  not have instead of printing empty items. `--brief` and `--full` no longer mention mail (cli-core 0.345.0).
- **`session start` and `setup` link a new profile.** They failed before showing a code with "cannot open the lock
  beside the device store": nothing made the profile's own folder before the engine opened its lock there. The engine
  now makes it, mode 700, before it takes the lock.
- **One pushed event that `wa` cannot handle no longer stops the ones after it.** `serve` and `watch` handle what
  WhatsApp pushes one event at a time, in order. A history push or a live message whose handling failed used to stop
  the queue, so no later history reached the local store until `wa` restarted. Now that event is skipped, a warning
  on stderr names its kind and error code (never its content), the next event goes on, and when `wa` stops listening it
  says how many were skipped if there was more than one. A failure that means the engine or the connection is gone
  still ends the listening, as before.
- **A message that arrives while no `serve` runs is no longer lost.** WhatsApp keeps messages for a linked device
  while it is offline and hands each one over once, to the next connection. When that connection was a one-shot
  command (`messages send`, `doctor --online`, an MCP session), `wa` received the messages and saved none of them. Now
  every connection saves what arrives, and the command waits for those saves before it exits (cli-core 0.343.0). A
  history push that arrives during such a command is saved too (above).
- **A file your phone uploaded again stays downloadable, once its new copy downloaded.** On the phones tried so far
  it does not (see the known limitation under `messages download`). `wa` keeps the new copy's address in the store,
  so a later `messages download` of it no longer asks the phone again, and `messages forward` sends a file that opens
  instead of the expired one. The same holds for `attachments extract --download`, `messages transcribe --local` and the
  picture index (`images embed`).
- **A history push after linking again keeps that address.** The phone pushes each file with the address it had
  before, and the store used to save it over the new one, so the next download asked the phone again. A message the
  store does not hold yet still takes the pushed address.
- **A download your phone could not give back says why, in its `reason`**, not only in its words. A file
  WhatsApp no longer keeps fails, per file in `batch.failures`, with `media.not-on-phone` (the phone has it no more),
  `media.phone-cannot-decrypt` (the phone could not read the request), `media.phone-failed` or
  `media.phone-answer-unreadable` (the phone answered an error), `media.phone-timeout` (no answer in 20 s),
  `media.retry-failed` (the new copy did not download) or `engine.stopped`; branch on those, never on the message.
  A download the phone's new upload served writes one line, `media.reuploaded`, to the engine's log when
  `WA_ENGINE_LOG` is set: the download's answer has no field for it.
- **A new copy that did not download says why.** The failure's message ends with the cause in fixed words: the HTTP
  status WhatsApp answered, a checksum or key that did not match, a file too short, a network error or the time
  running out, and whether the phone gave the expired path back. With `WA_ENGINE_LOG` set, a `media.refetch-failed`
  line adds the first download's cause and the phone's result. A phone that answered an error but still gave a path is tried as before; when that path
  does not download either, the reason is the phone's answer (`media.phone-failed`, `media.not-on-phone` or
  `media.phone-cannot-decrypt`), not `media.retry-failed`, which now means the phone said it uploaded the file.
- **A new copy that no longer matches the message's checksums is checked against the message's key before it is
  refused.** If the phone encrypted the old file again under the same key, `wa` accepts the copy when its MAC
  matches that key, which proves it was encrypted by someone holding the key, and stores the new checksums with the
  new address; a copy whose MAC does not match is still refused with `media.retry-failed` ("the file did not match
  its key"). On the phones tried so far, every new copy was encrypted under a different key and was refused this way
  (see the known limitation under `messages download`).
- **Node 22 no longer prints `ExperimentalWarning: SQLite is an experimental feature`** on every command that opens
  the store. Other warnings still print.
- **`wa mcp --help` and the root help suggest `claude mcp add wa -- wa <profile> mcp`**, where they suggested a
  command without a profile that always failed.
- **The commands page labels `conversations embed`, `conversations build`, `search conversations` and the model
  downloads as sending text to, or reading from, an outside service**, not as changes in WhatsApp.
- **A chat muted for good on the phone is stored as muted**, so `inbox` leaves it out. The history the phone sends
  marks such a mute with an end no clock can read (WhatsApp writes -1 into an unsigned field), and `wa` took that for
  a mute that had already ended. Any end past the year 9999 now reads as muted with no end, as whatsmeow reads it in
  app state. How the phone writes it in history is not yet checked live.
- **A lock another process holds no longer stalls `serve`** (cli-core 0.340.0): the send journal, the request pace
  and `recipients add` used to wait for it by blocking, so every relayed command and the connection's keep-alives
  stopped for up to 5 seconds. They now wait without blocking; the `timeout` (exit 9) is unchanged.
- **`setup` without a terminal no longer waits 5 minutes on a dead connection after the history push** (cli-core
  0.340.0): the steps after it get the usual 30 seconds. At a terminal they stay unbounded.
- **The MCP `messages list` tool no longer offers `topic:`** (cli-core 0.340.0): WhatsApp has no forum topics, and a
  `topic:` term is refused as an unknown field, as on the command line.
- **`chats admins add` has a summary that fits in 80 characters** (cli-core 0.340.0): "make a member an admin, with
  every right"; `--help` still names the seven rights.
- **A late answer from the phone no longer ends the next `messages sync` page early**: each request for older messages
  goes under its own id, and an answer that names an earlier request is saved like any history the phone sends instead
  of being taken for the current page. An empty late answer used to read as the chat's start. This holds if the phone
  names the request by that id, which is not yet checked live; otherwise answers are matched by their chat, as before.
- **A page the phone sends in pieces is filled**: when the phone sends fewer messages than asked, `wa` asks again from
  the oldest one it sent, one second apart, at most three asks and 25 seconds per page; what arrived before a
  timeout is kept.
- **A rate limit or a ban that ends `watch` or `serve`'s feed holds the next command's writes** as a one-shot
  command meeting it would.
- **`images embed` runs inside `serve` when `serve` holds the connection** (cli-core 0.337.0): it
  downloads pictures through WhatsApp, so it is a read from WhatsApp, and its MCP tool has no `offline` input.
- **Model downloads no longer go through a running `serve`** (cli-core 0.336.0): `models text download`, `models
  audio download` and `images models download` fetch from a model host, so they run in the calling process.
- **`wa chats list --json | head` ends quietly** (cli-core 0.328.0): through a running `serve` the client kept
  writing into the closed pipe and printed a stack trace; it now exits 0.
- **The phone-number and agent prompts of `session start` and `setup` go to the run's own stderr**, so a test or an
  embedding program that captures the run sees them.
- **`polls vote` and `polls voters` no longer mention anonymous polls** in their help and their agent tools
  (cli-core 0.328.0): WhatsApp has none.
- **`--json=item.<field>` keeps that field** (cli-base 0.44.0): `--json=item.profile` printed `item: {}`.
- **A query with a `/` that opens a regular expression and never closes it says to quote the value** (cli-base
  0.44.0): `text/plain` now hints `"text/plain"`. The error code and reason are unchanged.

### Added

- **`messages list <old id> --offline` finds the chat that id moved to**, and so does every other command that
  names a chat by the phone-number id it had before WhatsApp gave the person a LID. The store now keeps each chat's
  history: its id, title, membership, scope, search visibility and parent, one row per change. A read by an old id
  follows it within the account, also for a chat the account left when the command reads its kept history (cli-core
  0.368.0). Only a move the store
  recorded is followed: one `serve` or `watch` makes from now on, or one they repeat. The engine repeats the moves of
  the last 30 days at each start, so those are recorded at the first `serve` or `watch` start after the upgrade. An
  older move, and a number that was never a stored chat, still read as typed. The store moves to version 25 the
  first time this version opens it. That cannot be undone, so take a copy first (`wa <profile> store backup <file>`).
  `wa` 0.1.0 and older tg and max builds still open the upgraded store and write to it.
- **`wa <profile> store clear --left` lists the chats it would delete**, by id, title and message count, when it
  refuses without `--allow-dangerous`, and after deleting lists what it deleted; `--dry-run` lists them all and
  deletes nothing (cli-core 0.353.0).
- **`wa <profile> chats events <group>` lists who joined, left, was added, removed, promoted or demoted, and each new
  title**, from the local store, without connecting. `wa` keeps the group service messages the phone pushes with the
  history and, under `wa serve` and `wa watch`, each change as it happens; a change seen both ways is kept once.
  `wa watch --events` prints them as `chat_event` lines, and `stats chats show` counts the joins and leaves in
  `members`, where it used to leave them out. Changes from before the link that the phone did not push are not
  there. Engine protocol 33.
- **`wa <profile> messages send <chat> --sticker-file <file.webp>`** sends a `.webp` as a WhatsApp sticker, alone,
  with no text; agents send `sticker_file` through `wa_write` (`command: "messages send"`). It is a message like any
  other: the profile's permissions, the send journal and `--operation-id` apply, and so does the file guard
  (`--allow-any-file` for a file in `wa`'s own folders). A file that is not a WebP, or is larger than 500 KiB, is
  refused before connecting. A sticker to a channel is refused for now.
- **`wa <profile> chats update <group> --remove-photo`** takes a group's photo away; agents send `remove_photo`
  through `wa_write` (`command: "chats update"`). The members see it. It goes through the profile's permissions
  under `chats.update`, as `--photo` does, and is refused beside `--photo` before connecting. The photo goes first: if a
  title, description or setting given with it then fails, the error says the photo was removed.
- **`chats update --photo` and `account update --photo` say they take a `.jpg` or `.jpeg` file**, and refuse a file
  named otherwise, as they already refused one whose first bytes are not a JPEG's, before connecting. The engine still
  checks the photo is a square of 190 to 720 pixels a side.
- **`wa <profile> conversations rebuild`** builds, then embeds on this machine, the chats that changed and the group
  chats never built, or only `--chat`, bounded by `--max-chats` and `--max-chunks`. It sends nothing anywhere.
- **`setup` and `session start` warn about bans before they show the QR code or the pairing code.** The warning
  says that `wa` is an unofficial client, that WhatsApp may ban an account for using one or for bulk or unsolicited
  messages, what `wa` does to keep the risk low, and what not to do. It goes to stderr once per link, in every
  output mode and with `--quiet` too, since it belongs to the code the person is about to scan; stdout and the JSON
  answer are unchanged. In machine mode, a link that fails after this point now has the warning on stderr before the
  error JSON, so read the error from the last line. A device that is linked already, and every later command, prints
  nothing new. The README, the installation and linking pages and the agent skill carry the same warning. The MCP
  page has its own: by default an agent may send up to 30 messages an hour without asking, and how to lower that.
- **`wa <profile> chats mute` and `chats unmute`**: stop a chat's notifications for good or `--until` a time (`2h`,
  `7d`, `2026-09-25T09:00`), and hear it again; agents run both through `wa_write`. It is the account's own
  setting, which WhatsApp syncs to the other devices; nobody in the chat is told (not yet checked live on the phone).
  It is a write and goes through the profile's permissions, under `chats.mute` and `chats.unmute`; a setting for
  `chats.mute` alone still covers both. A device linked minutes ago may not have WhatsApp's settings keys yet: the
  command then answers exit 12 with reason `settings.keys-missing` and says to keep `serve` running a few minutes. A
  channel is muted on the phone.
- **`wa <profile> chats archive` and `unarchive`, `chats pin` and `unpin`, and `chats mark-unread`**: move a chat
  into WhatsApp's archive and back, keep it at the top of the chat list, or mark it unread, on the account's
  devices; nobody in the chat is told. Agents run them too, through `wa_write` (`command: "chats archive"` and the
  rest). `chats pin` pins the chat, not a message (`messages pin` does that). Archiving a chat also
  unpins it. Archive, unarchive and mark-unread name the chat's newest stored message, as `chats delete` does, and
  refuse a chat the store holds nothing of (exit 6); pin needs no message. WhatsApp's apps keep three pinned chats;
  `wa` does not count them. A mark-unread sends no receipt; `chats mark-read` takes the mark off (see Changed).
  Channels are refused. Each answers `settings.keys-missing` as `chats mute` does, and has its own
  permission key (`chats.archive`, `chats.unarchive`, `chats.pin`, `chats.unpin`, `chats.mark-unread`), allowed by
  default. Not yet checked live on the phone.
- **`wa <profile> chats delete` and `chats clear`**: delete a chat, or every message in it, from this account's
  devices; the others in it keep theirs. WhatsApp deletes up to a message it is told of, so `wa` names the chat's
  newest message in the local store, the owner's own or not, and refuses a chat the store holds nothing of (exit 6)
  rather than guess. A message that arrived after the store last heard should stay. `chats clear` deletes starred
  messages too; neither asks WhatsApp to delete the photos and files the phone saved from the chat. Both ask first
  at the default permission level (`chats.delete`, `chats.clear`; `--allow-dangerous` skips the question), are not
  offered over MCP, and answer `settings.keys-missing` as `chats mute` does. The local store keeps the chat's
  messages. Not yet checked live on the phone.
- **`wa <profile> messages star` and `messages unstar`**: star one message so it is easy to find again, or take the
  star off. It is the account's own mark, which WhatsApp syncs to the other devices; nobody in the chat is told. The
  message must be in the local store, since WhatsApp names it by its sender; one the store lacks is exit 6 and
  nothing is sent. A channel's post is starred on the phone. It goes through the profile's permissions
  (`messages.star`, `messages.unstar`), an agent can do it over MCP, and it answers `settings.keys-missing` as `chats
  mute` does. The local store keeps a star set with `wa`, so `messages list <chat> starred:true` and `search
  messages is:starred` find it. While `serve` or `watch` runs, a star set or taken off on the phone reaches the
  store too, and `watch --events --jsonl` prints it as `{ "event": "star", "chatId", "chatTitle", "messageId",
  "starred" }`; the messages the phone pushes after linking keep their stars. The store moves to version 24
  for this the first time this version opens it; `wa` 0.1.0 still opens it. Not yet checked live on the phone.
- **`wa <profile> messages pin` and `messages unpin`**: a message in the local store is pinned for the whole chat; a
  message the store lacks is `not_found`. WhatsApp tells the chat's members about every pin, so each one notifies and
  counts toward the hourly limit; `messages pin` takes no `--notify`, and an agent's `wa_write` call no `notify`.
  `--expire-time 24h`, `7d` or `30d` (MCP `expire_time`) says how long it lasts; without it the pin lasts 7 days, as
  the help says; any other length is `validation_error`, over MCP before it connects.
- **`wa <profile> account privacy show` and `account privacy set`**: who sees last seen (`--last-seen`), the
  profile photo (`--profile-photo`) and the about text (`--about-text`), whether online and last seen are hidden
  (`--hide-online`), whether read receipts go (`--read-receipts`; off also hides others' receipts from the owner, as
  on the phone), who may add the account to groups (`--chat-invites`) and whose calls ring (`--calls`). `show` asks
  WhatsApp each time, and reports a setting kept on the phone as "my contacts except…" as `contacts_except`, which
  `set` refuses; for groups that value is left out. `set` changes only the settings named and answers them all; it
  is a write under `permissions.account.privacy.set`. WhatsApp has no setting for who finds the account by its
  number or who sees the number, so `--find-by-phone` and `--phone-number` are not offered. Refused before anything
  is sent: `--chat-invites nobody` (WhatsApp is reported to refuse it), `--calls nobody`, and `--hide-online` with
  `--last-seen`, which both set last seen. `--calls contacts` sends the value meant as the phone's "silence unknown
  callers" (not yet checked on a real account). `--hide-online off` shows last seen to contacts. `set` sends one
  request per setting: if WhatsApp fails one, those sent before it stay changed, and the error says so; a change cut
  by a dropped connection answers `outcome_unknown` (exit 14), since it may have gone through.
- **`wa <profile> account update` sets the owner's WhatsApp name, about line and profile photo**: `--first-name` sets
  the name people see, with `--last-name` joined to it after a space (WhatsApp keeps one name, so a last name alone is
  refused), and `--description` the "about" line. The name is a setting WhatsApp syncs to the other devices; others
  probably see it only once the phone next comes online, since a device tells WhatsApp its name when it says it is
  online and `wa` never does (not checked live). `--photo` sets the profile photo (not checked live): `wa` takes
  a square JPEG of 190 to 720 pixels a side, as for a group's photo, checked before anything changes. The answer is
  the account with the new name. A device without WhatsApp's settings keys yet answers `settings.keys-missing`, as
  `chats mute` does; the name goes first, then the about, then the photo, and a step WhatsApp refuses after another
  changed says which did. The permission key is `account.update`.
- **`wa <profile> chats update <group> --photo <file>` sets the group's photo.** WhatsApp takes only a square JPEG
  of 190 to 720 pixels a side, and `wa` does not convert one: anything else is refused with `validation_error`
  before WhatsApp is asked, a PNG or WebP by its bytes whatever its name. The photo is set before the title,
  description or settings given with it, so a refused photo leaves the group unchanged, and a `--title` over 25
  characters is refused before the photo is set. If the rest of the change then fails, the error begins "the photo
  was set", keeping its code. It runs under the same permission and hourly limit as the rest of `chats update`.
  `--remove-photo` takes it away (above).
- **A group says which WhatsApp community it is in.** A group linked to a community answers with `parent_chat_id`,
  the community's id; the community itself is a group with `provider_metadata.community: true`. They come with the
  group as WhatsApp gives it: the answers of `chats update`, `chats create` and `chats join`. `wa` also reads them
  from the history the phone pushes, so the local store keeps them and `chats list` and `chats show` show them, and
  follows WhatsApp's notices that a group joined or left a community (see Fixed). Listing a community's groups, and
  linking or unlinking one, are not built.
- **A photo and a video in one send go as an album** (`messages send --photo … --file clip.mp4`): one message that
  announces the album, then each file tied to it. The text is the photo's caption and the answer is the photo's
  message, under the send id. A repeat with the same `--operation-id` after an unknown outcome sends the same message
  ids, which WhatsApp takes as the same messages, as it does for a single send. A document beside a photo is still
  refused. Checked on a phone: it shows as one album.
- **A sent photo carries its preview**: the chat shows a small blurred picture before the download. Not yet for a
  video or a WEBP photo.
- **`wa <profile> metadata get` and `metadata refresh`** read a group's title and description into the store for
  `tags auto`; the group is not changed, and agents get both. A channel in the list answers with an error of its
  own.
- **`tasks agenda` lists what others owe you** (cli-core 0.328.0): `assigned` in JSON and an "assigned — others owe
  you" section hold the open tasks someone else does, oldest first, each with its `assignees`.
- **`wa commands --json` has two new keys** (cli-base 0.44.0): `runnable: true` on a group that runs on its own, and
  `offline: false` on a command that cannot answer offline. A reader that rejects unknown keys must accept them.
- **`wa` follows and reads WhatsApp channels**, the one-way chats whose ids end in `@newsletter`: `chats join
  https://whatsapp.com/channel/<code>` follows one and `chats leave <channel>` unfollows it, both through the
  profile's permissions, and the channel's admins see that you followed. The channels you follow reach `chats list`
  as `kind: "channel"` when `serve` or `watch` connects. `messages sync <channel>` reads its posts into the local
  store from WhatsApp's servers, not from your phone: newest first, 50 at a time. Each post keeps its message id, and
  WhatsApp's number for it is in `provider_metadata.serverId`. Every post's sender is the channel, so a post you
  made shows `outgoing: false`. See [channels](./usage.md#channels).
- **`wa` posts to a WhatsApp channel you run**: `messages send <channel> <text>` asks WhatsApp for your role in the
  channel first and refuses anyone but its owner and admins with `permission_error` (exit 5) before anything is sent.
  The channel's followers see the post at once. Not a reply; a poll, a vote, a forward, an edit or a deletion in a
  channel is refused before anything is sent. A refused post still passes the profile's send permissions first, so
  under `ask` it asks before it is refused. Not yet checked live.
- **`wa` posts a photo, a video, a voice note or a file to a WhatsApp channel you run**: `messages send <channel>
  --photo/--file/--voice <path>`, the text as the caption. The role is asked first, as for a text post, so a channel
  you only follow is refused (exit 5) before anything is uploaded. A channel's files are not encrypted: `wa` uploads
  them as WhatsApp's apps do for channels, and the post carries no file key. One file per post; an album to a channel
  is refused (exit 2). A forward of a channel's file into a chat is refused too (exit 2,
  `media.channel-file-forward`), since it would arrive as a file that does not open. Not yet checked live: that needs
  a channel you own or administer.

## 0.1.0 — 17.10.2026

### Changed — may break callers

- **The engine dying during a write answers `outcome_unknown`** (WC-LIFE-9): exit 14, `retry.safe: false`, the
  `operation_id` kept, reason `engine.stopped-mid-write`. It answered `provider_unavailable` (exit 12), which
  invited a retry and a double send. A read cut the same way still answers `provider_unavailable`.
- **Device and account states carry a `reason`** (WC-OUT-15), so an agent branches on it instead of the message:
  `device.in-use` (another `wa` process holds the login: stop it, or run the command through `serve`),
  `engine.stopped`, `client.outdated` (update `wa`) and `device.replaced`, all `provider_unavailable`;
  `device.logged-out` (`authentication_error`); `account.banned` (`permission_error`); `account.rate-limited`
  (`rate_limited`). After WhatsApp ends the connection for one of these, later requests in the same process answer
  with it instead of connecting again. Engine protocol 10.
- **WhatsApp's rate limit and a ban hold the profile's sends** (WC-PERM-18). After WhatsApp asks the account to slow
  down, sends, edits and the other writes counted toward the send limit are refused for 15 minutes and reads go on;
  after a ban, until `wa <profile> doctor --online` connects again. Reactions and read receipts are not held.
  `doctor --online` reports a ban as `standing.state: "frozen"` (it said `banned`, which held nothing).
  `wa <profile> flood clear` lifts either hold. Both lengths are a default the owner may change.
- **`commands --json` marks more commands `mcp: false`** (cli-core 0.326.0, WC-MCP-2): `store`, `server`, `config`,
  `mcp`, `models`, `images models`, `skill`, `runs`, `doctor report`, `upgrade`, `complete`, `commands schema`,
  `account sessions end`, and the commands that change a later run's authority (`recipients`, `chats rules`). The
  MCP tool list `wa mcp` serves is unchanged.
- **In a group tagged `watch-tasks`, any member's direct reply closes a question** (cli-core 0.325.0), with the
  resolution "answered in the group". Before, only your answer closed it; a later message that does not reply to the
  question still closes nothing.
- **A device linked before answers without counts** (WC-OUT-13). `session start --json` leaves out `received`, and
  `setup --json` leaves out `history`, when the profile was already linked: nothing was pushed, so nothing was
  counted. They used to say 0, which read as "the phone pushed nothing".
- **Refusals that need a terminal say so in `reason`** (WC-OUT-15). `session start` and `setup` without a terminal,
  and `session start phone` without one, answer `reason: "input.required"`; `--qr-file` with the phone method names
  `param: "--qr-file"`.
- **No automatic replies** (cli-core 0.324.0). `wa` no longer has `replies`, and `serve` never answers by reply
  rules, even with `permissions.replies.send` at `allow`: WhatsApp bans accounts that answer like a bot, and `wa`
  sends nothing the owner did not ask for. A rules file left in the config folder is ignored.
- **Options WhatsApp has no counterpart for are no longer offered** (cli-core 0.324.0): `--silent` and `--send-as` on
  `messages send`, `messages forward` and `polls create`, `--at-time` on `messages send`, `--anonymous` on
  `polls create`, and the commands `chats send-as` and `messages scheduled`. They were refused before; now they are
  unknown, still with exit 2, and the MCP tools no longer take `silent`, `send_as`, `at_time` or `anonymous`.
- **Commands WhatsApp lacks refuse before connecting** (cli-core 0.324.0): `account update`, `account sessions list`
  and `end`, `chats events`, `chats inspect`, `chats folders *`, `contacts add`, `remove`, `rename` and `import`,
  `messages pin` and `unpin` refuse with exit 2 before connecting to WhatsApp.
- **`watch --events` no longer prints the votes of the phone's history push** (cli-core 0.322.0). They were
  printed as new votes; they are old ones, and the store now saves them with the push, together with their poll and
  dated when each person voted, so an older one never replaces a newer live vote. A script that read history votes
  from `watch` reads `polls voters` instead. Engine protocol 9.
- **An agent never deletes for everyone** (cli-core 0.321.0). Every WhatsApp delete `wa` makes is for everyone, so
  `messages delete` through MCP is refused with `permission_error`, before `wa` connects, whatever the profile's
  level; the owner still has `wa <profile> messages delete --for-everyone`.
- **`mcp --permission <key=level>` only narrows** (cli-core 0.321.0). An override that would give the server more
  than the profile — `readonly` to `allow`, a `deny` to anything — stops it at startup with `validation_error` naming
  the key. To let an agent do more, set the level in the profile. The browser setup no longer starts the server with
  `--permission messages.send=allow`.
- **Tasks open only where something is asked of you** (cli-core 0.318.0). In a one-to-one chat every question you did
  not answer opens one, as before; in a group only a question in reply to your message and a mention of you; in a
  channel or the chat with yourself nothing.
- **`tasks apply` is now `tasks scan`** (cli-core 0.320.0); MCP `tasks_scan`, permission key `tasks.scan`.
- **No setting picks a profile any more** (cli-core 0.319.0). A command names its profile with the first word or
  `WA_PROFILE`. A config file that still has `default_profile` stops a command that names no profile, with the profile
  to type and `wa config unset default_profile`; `wa config set default_profile` is refused. A profile called `default`
  is an ordinary name: `wa default mcp config` names its server `wa-default`, not `wa`.
- **`polls close` and `polls create --revote` are gone** (cli-core 0.317.0): a WhatsApp poll never closes and every
  vote can change. A script that closed a poll or asked for revoting drops that call.
- **`chats admins add` takes no `--can`**: a WhatsApp admin has every right, so it gives them all. A script that
  passed `--can` drops it.

### Security

- **`WA_ENGINE_LOG` no longer writes phone numbers** (WC-SECR-1): every user id (phone, device and hidden-id forms)
  and any other long run of digits is masked before a line reaches the file.
- **A release from GitHub Actions publishes the engine packages validation built and tested** (WC-REL-12): it checks
  each against the SHA-256 that validation recorded, and builds nothing again. This first release was published from
  the maintainer's machine, which builds them itself.
- **`WA_READ_ONLY` also stops linking and unlinking the device**: `session start` and `setup` refuse to link a new
  device, and `session end` refuses to log out, with `permission_error`.
- **An interrupted or timed-out login closes the engine and removes its QR image**, instead of leaving both behind.
- **The account name shown after linking is printed as plain text**, never as terminal control codes.
- **Media keys stay inside the client**: internal attachment references stay out of live-event, JSON and MCP output
  (cli-core 0.315.0).
- **Invite links must name WhatsApp's exact invite host**; unrelated URL prefixes are refused before connecting.
- **WhatsApp state is safe from the other messengers' uploads** (cli-core 0.314.0), and a running server's read-only
  lock holds when a command is relayed to it.
- **The Go engine builds with Go 1.26.9 and `golang.org/x/net` 0.60.0**, clearing the affected runtime and
  networking advisory paths while retaining the current Go release branch.

### Fixed

- **`session end` no longer runs through a running `serve`**: it logged out `serve`'s own connection and then
  deleted the device keys under it. It now refuses with `provider_unavailable`, reason `device.in-use` (exit 12),
  and says to stop `serve` first (`wa <profile> server stop`, or Ctrl+C).
- **The command reference no longer says `defaultProfile` in the config file picks a profile** (WC-ACCT-1): no
  setting does; the first word or `WA_PROFILE` names it.
- **Refusals name the whole command to run next**: `wa <profile> chats list`, `wa <profile> serve` and
  `wa <profile> session start`, where they said only `chats list`, `serve` or `session start`.
- **No `messages sync` advice `wa` cannot follow** (cli-core 0.322.0): where a command points at the store's gaps it
  names `messages sync <chat>` for one chat, never `--all`.
- **`wa upgrade`'s "held back" hint names the package and keeps pnpm's release-age exemption** (cli-core 0.320.0).
- **An agent's `chats members list` and `chats send-as` follow their own permission keys**, `chats.members.list` and
  `chats.send-as`, so a deny on those keys reaches the MCP agent too (cli-core 0.321.0).
- **A reply names the quoted message's sender and carries its text** when the local store holds that message, so
  phones show the quote instead of "unavailable"; a reply to one the store lacks still goes, with the message's id
  alone.
- **An edit keeps the message's own time**: one that `serve` or `watch` hears keeps the message's time, reply and
  reactions in the local store; before, it took the edit's time as the message's.
- **Tests on Windows check file access rules** instead of Unix mode bits. Group administration tests verify
  stranger refusals and unsupported changes before writes.
- **The search and query language pages said the file fields find nothing**; `has:file`, `filename:`, `mime:` and
  `content:` work on every message stored since `wa` handled files. The README and the docs start page no longer list
  files and group administration as coming next.
- **Release and monthly source checks include the Go engine**, using its module toolchain. Local tests resolve the
  shared TypeScript config directly so they run in isolated worktrees.

### Added

- **`wa <profile> flood clear`** (cli-core's, as in tg and max): forgets the waits WhatsApp asked for and lifts the
  hold on writes. The refusal during a hold already named it; `wa` did not have it.
- **`session`, `session start`, `session end` and `setup` carry `mcp: false`** in `commands --json` (WC-CMD-21):
  linking waits for a person and unlinking removes the owner's device, so neither will be offered to an agent once
  MCP tools are built from commands. `setup` and `upgrade` list examples there too (WC-CMD-24).
- **The engine packages are GPL-3.0-only**: `@wirecat/whatsapp-engine-*` and the `engine/` folder they are built
  from, because the engine links `go.mau.fi/libsignal` (GNU General Public License 3.0). Each package carries the
  GPL text as `LICENSE` and a README that points at the commit it was built from. `@wirecat/whatsapp-cli`
  stays Apache-2.0: it runs the engine as a separate program over stdin and stdout, and its package never carries
  the engine.
- **Each engine package carries `THIRD_PARTY_NOTICES`**: the licence of every Go module the engine links and of Go
  itself, with where each module's source is. whatsmeow and `go.mau.fi/util` are under the Mozilla Public License
  2.0 and `go.mau.fi/libsignal` under the GNU General Public License 3.0, all unmodified.
- **Tasks have assignees** (cli-core 0.320.0): `tasks add` and `tasks plan` take `--assignee sender` (whoever sent
  the message) or `--assignee person:<id>`; `none` clears it. `tasks list "assignee:any state:open"` is what others
  owe you.
- **`wa <profile> tags add --chat <group> watch-tasks`** records every question in that group as a task, whoever it
  is for.
- **Poll votes are counted**: `serve` and `watch` keep each person's newest vote, from the phone's history push and
  as votes arrive (`watch --events` prints them), so `polls show` counts the answers and says which you chose, and
  the new `polls voters` lists who voted for what. A poll made with `polls create` is kept in the local store, so it
  can be shown and voted on. Engine protocol 8; cli-core 0.317.0.
- **Commands while `serve` runs**: a send, an edit, a reaction, `watch`, `wa <profile> mcp` and every other command
  that connects run inside a running `serve`, on its one connection, instead of being refused. Permissions and the
  send guard still apply; a write at `ask` needs `--yes`. On Windows they do not go through `serve`.
- **The foundation**: the shared cli-core commands over a WhatsApp adapter that reads from the local store, an
  engine contract, and the same linters, checks and CI as tg-cli and max-cli.
- **Older history from the phone**: `wa <profile> messages sync <chat>` asks the phone for the 50 messages of a chat
  before the oldest one the local store holds, page after page, and waits up to 30 seconds for each answer (engine
  protocol 5; cli-core 0.316.0). `--all` is refused: WhatsApp has no chat list to walk.
- **More group settings**: `chats update --only-admins-send`, `--only-admins-edit-info` and `--disappear-time`
  (24h, 7d or 90d, the times WhatsApp offers; `off` keeps messages). A group's answer shows them in `settings`
  instead of `provider_metadata`. Engine protocol 7.
- **The WhatsApp engine**: `wa` connects through a Go program built on whatsmeow, started for each command that
  connects and stopped when it ends. One command at a time may connect a profile; a second is told which one holds it.
- **Installs with its engine**: `npm install --global @wirecat/whatsapp-cli` also installs the engine for your system,
  a small package of its own, for Linux, macOS and Windows on x64 and arm64. `WA_ENGINE` still runs another one. A
  global install also installs the agent skill and, on Windows, puts `wa` on the user's PATH, as tg does.
- **`wa <profile> session start [qr|phone]`** links the profile by QR code or pairing code and keeps the history the
  phone sends right after linking. **`session end`** unlinks the device and deletes its keys.
- **Changing messages**: `messages edit` (your own, within WhatsApp's 20 minutes), `messages delete --for-everyone`
  (your own, or another's in a group you administer), `reactions add` and `reactions remove`, and `chats mark-read`
  and `--mark-read`, which send a read receipt only when asked. Each needs the message in the local store, which
  `serve` keeps filled; WhatsApp addresses a message by its sender. Deleting for you alone is not built yet.
- **Files**: photos, videos, voice notes, audio, documents and stickers arrive as attachments, with places and contact
  cards named; `messages send --file`, `--photo` and `--voice` send one file with its caption; `messages download`
  saves a stored message's file; `messages transcribe --local` reads a voice note with a model on this machine
  (`wa models`); `messages forward` sends a stored message again, marked forwarded, file included; `wa images` searches
  pictures by what they show. The engine protocol is now 3.
- **Groups and people**: `chats create`, `join`, `leave`, `update` (name, description, admin-only adds, join
  approval), `chats link show|reset`, `chats members add|remove`, `chats admins add|remove`, `chats requests
  list|accept|decline`, `contacts profile`, `contacts block|unblock`, `contacts lookup` and `contacts sync` (the
  phone's address book), and `doctor --online` now connects to check the account. Group changes go through the send
  guard like a send; adding people is refused for anyone not in the address book or written to before, since
  WhatsApp bans accounts that add strangers. A number lookup is one per call, one every 10 seconds per profile.
  Engine protocol 4.
- **Formatting and polls**: `messages send --md` and `messages edit --md` write Markdown as WhatsApp's own marks
  (bold, italic, strike, code, quotes; a link becomes its label and address; underline and spoilers become plain
  text). `polls create` (one answer or `--multiple`), `polls show` and `polls vote` (`--retract` too) work on polls
  in the local store. Engine protocol 6.
- **`wa <profile> setup`** is the guided first run, as in tg: it checks this computer, links the device or reuses it,
  reads the account and five chats from the local store, and installs the agent skill (`--agent`). Agents use
  `--qr-file`.
- **`wa upgrade`** installs the newest version with the package manager that installed `wa` and restarts running
  servers; a daily line on stderr says when a newer version exists.
- **`wa doctor`** reports whether the engine program is found, whether the device keys exist with private file
  modes, and who last held the device's lock and whether that process still runs.
- **Documentation like tg's**: pages on linking and profiles, the local store, search and its query language,
  groups, people, MCP and the browser, permissions, limits, the CLI contract, diagnostics and recipes, each limited
  to what WhatsApp can do today. The agent skill (`wa skill show`) is rebuilt on tg's: setup without a terminal,
  the traps, the exit codes, and what one connection per device means for an agent.
- **A page on file attachments** ([docs/attachments.md](./attachments.md)): sending one file per message, what the
  local store keeps, downloading, forwarding, voice notes as text with a model on this machine, and reading the text
  of files for `content:` search. The README gains tg's sections on linking and profiles, groups you run, limits
  and the list of pages.
