---
title: "Changelog"
---
Notable changes to `@leemour/max-cli`, one section per version, newest first. Versions follow [Semantic Versioning](https://semver.org/lang/ru/); the command interface may still change before `1.0.0`.

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

- **`messages list`, `inbox` and `review` with `--transcribe` download recordings through the reading connection.** Previously a second MAX login was opened. Download finishes before the connection closes; local recognition starts after it closes. Without explicit `--mark-read`, nothing is marked read.
- **`review --unanswered` considers stored and newly recognized voice-question transcripts.** Previously, an empty-text question was discarded before transcription. MCP has the same fix. Original message text is unchanged; unrecognized recordings leave the review incomplete.

- **`max chats show` explains differing member counts accurately.** The list may exclude your account or be incomplete. The command reports both counts without claiming a download failure. JSON and the original member list remain intact.

- **The `poll.already.voted` refusal explains how to change a vote.** If the poll allows this, first run `polls vote <chat> <message> --retract` in the same profile, then select the new answer.

- **`max messages download --timeout` also closes the attachment's HTTP stream.** Previously it could continue after the command timed out until a separate idle timeout. Adapter close now cancels its streams and removes the incomplete file.

## 0.25.0 — 03.10.2026

### New

- `bot api` uses the same command builder and input validation as Telegram. Generators remain in cli-core; parameters, native responses and effective MAX permissions are preserved. The shared `--store-token <profile>` option is for operations returning credentials; other operations reject it.

### Changed — may break scripts

- **`max models audio list --json` adds `directory`:** the shared model directory used by MAX and Telegram. Model commands, directory selection and download verification are now shared; existing files, model order and `transcribeModel` remain. Models do not need another download. JSONL still returns one model per line.

- **`--md` uses MAX's own formatter** for send/edit and captions: nested styles, `__жирный__`, `++подчёркнутый++`, links and code. Bots support emphasis, headings and quotes through safe HTML; the personal protocol explicitly refuses unverified types. Telegram has different syntax. Unknown wire types are no longer silently sent.

## 0.24.0 — 03.10.2026

### New

- **`max setup` guides the first run for a personal account:** it checks local directories, offers QR login, checks the account and up to five chats, and connects the selected agent skill. Repeating setup reuses an existing session. History is downloaded separately; setup does not start the background service. Help, installation and agent instructions explain next steps and Windows execution without PATH. `max skill show` is available before login.

### Changed — may break scripts

- **`max chats check` is replaced by `max chats moderate`:** shared rules and moderation with Telegram. `--since-time` accepts a timestamp or `30m`/`2h`/`1d`, replacing the previous message-ID `--since`; JSON is now `{ chatId, rows }`. Each run reads up to 1,000 messages. Rule levels are `deny|readonly|ask|allow`; old `forbid` and `flag|confirm` values are read as `deny` and `ask`. The saved check position moves from the session into the existing rules file, so the first run continues from that position. CLI and personal-account MCP share the position; MCP tool names and flags remain unchanged. Joining by link is named `join` in `chats events`.

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
- **`max <бот> bot chats check` becomes `max <бот> bot chats moderate`**, shared with `tg`. `--since` becomes `--since-time`, still accepting `2h`, `1d`. JSON changes from a list to `{ chatId, rows }`; MCP tool is `max_bot_chats_moderate`. Rules and check positions remain in the same files. Consent `flag` now behaves like `confirm`: ask, or proceed with `--allow-dangerous`.
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
- **`max messages search --regex`** searches saved text with a regular expression. **`messages show|context msg:…`** accepts a search locator without a separate message ID.
- **`max polls show <чат> <сообщение>`** reads a poll, answer IDs and vote counts without changing anything.
- **`max polls create --send-id`** safely retries poll creation after a missing response without creating a second poll.
- **`max messages send --photo <путь>`** sends `.jpg .png .webp` as a photo, like tg. `send` also exposes `--no-preview`, but rejects it because MAX does not support it.
- **`max skill install`** installs a versioned agent skill into `~/.claude/skills/max-cli/` for Claude Code and `~/.agents/skills/max-cli/` for Codex and Gemini CLI. Use `--for claude` or `--for agents` for one destination. `max skill show` is unchanged.
- **Agents automatically learn about the skill.** With `AI_AGENT` or `CLAUDECODE` set, a missing or outdated skill produces a once-daily stderr hint for `max skill install`, without affecting stdout. Disable with `max config set skillHint false --defaults`.
- **`max mcp` and `max bot mcp` expose `max://skill`** and mention it in agent instructions.
- **`max messages delete` returns `operationId`**, also found in `max sends list`. MCP `max_messages_delete` does too. Options are unchanged.
- **Every send-log record includes `operationId`**, grouping records for one send, edit, deletion or chat change. For a message send, it equals `sendId`.
- **Installation is about 16 MB smaller:** the database layer is bundled instead of installed separately. `max` commands are unchanged.

### Changed — may break scripts

- **`max messages search` matches words, best results first.** Use `--newest` for the former newest-first order. Queries support `"фраза"`, `-слово`, `OR`, `from:`, `chat:`, `after:`/`before:` and `has:`. Typos are corrected with a stderr notice. `--context <n>` shows neighboring messages. JSON adds `match` and `score`.
- **`max bot updates watch` becomes `max bot watch`**, matching tg and personal `max watch`. Without `--events`, only new messages appear; with it, each line identifies its event (`{ "event": "message" | "edit" | "delete" | "callback" | "joined" | … }`) instead of exposing raw MAX events. `--timeout` ends normally with code `0`. Read-only bot profiles may watch updates. Resume positions are unchanged.
- **`bot webhooks list` returns `{ url, types }`**, not MAX-specific fields. `bot callbacks answer --text` no longer reads stdin through `-`. `bot commands`, `bot callbacks` and `bot webhooks` are shared with tg. `webhooks set --secret-stdin` prompts only after permission checks.
- **Node 22.16 or later is required**, or Bun as before. If Linux Node uses an outdated system SQLite, `max` restarts using bundled SQLite from `@leemour/cli-messaging-sqlite` before reading or sending. Official Node builds and Bun need no change.
- **`max store` is shared between tg and max.** `store fetch` writes to shared storage and pages MAX as before: 30 messages, 5–10-second pauses, up to 40 pages per run. This gives both messengers one store and consistent `messages`, `conversations` and `store` reads. The old cache is not migrated; refetch history. Also:
  - `store fetch --estimate` is rejected for MAX because message IDs cannot count missing records.
  - `store fetch|export --since` becomes `--since-time`, accepting time only, not message IDs.
  - `store fetch --max-pages <n>` becomes `--limit <сообщений>`, default 1,200 or forty 30-message pages. Page size uses `--page-size`.
  - `store export --format md` becomes `--format markdown`; `jsonl` is unchanged. Missing ranges are reported by `store status` rather than export stderr. Existing files are never overwritten.
  - `store fetch` no longer prints a ready-made export command.
  - If two messages share a millisecond and a page boundary separates them, `store fetch` can rarely miss the earlier one.
- **`max messages list|show|context|search` are shared with tg.** `--offline` and `search` read the shared store, providing the same options and responses. At this release, `max mcp` message and chat readers still use the old max cache, so MCP and terminal offline results may differ. The new store fills after an online run; old max data and transcripts are not migrated. Also:
  - Voice attachments use `"kind": "voice"`, not `"audio"`; `inbox` and `review` still use `"audio"` in this release.
  - `messages list --before` and `--after` split into `--before-id`, `--before-time`, `--after-id`, `--after-time`; `messages context` uses `--before-n`, `--after-n`. Old options produce unknown-option errors.
  - `messages list --before-id` excludes its anchor. Offline, it requires a locally stored message ID.
  - `messages list --transcribe --json` omits `transcribeProblem`; stderr explains failures. Offline, `unheard` is empty. Audio uses a separate connection, causing a second MAX login with `--no-serve`.
  - Speech models are found in `~/.cache/cli-common/models/audio`, shared with tg. Redownload or move models from `~/.cache/max-cli/models/audio`.
  - `messages search` matches words and prefixes (`квартир` finds “квартира”), rather than arbitrary three-letter substrings. `--chat` accepts a stored chat title.
- **`max chats list|show` and `max contacts list|show` are shared with tg.** Offline reads use shared storage with identical options and responses. It fills after the first online run; the old cache is not migrated, so initial offline reads return `not_found`. Also:
  - `chats list --search|--kind|--unread` checks the 200 newest chats online and reports older chats on stderr; offline it checks all stored chats.
  - `chats show --offline` omits `description`, `access`, `settings`, available only from MAX.
  - Invalid `--kind` values now report `--kind is one of dialog, group, channel, saved`.
  - `cache clear` also clears this account from shared storage; `contacts sync` fetches everything into it.
- **`max messages send|edit|forward` are shared with tg.** JSON `send` returns `{sendId, operationId, message}`, plus `scheduledFor` with `--at-time`; `forward` also returns `{sendId, operationId, message}`; `edit` returns `{operationId, message}`, instead of an unwrapped message. MCP `max_messages_send`, `max_messages_edit`, `max_messages_forward` match. `max_messages_edit` drops `markdown`; `max_messages_forward` drops `send_id`. Read the message under `message` rather than at the root. `send` supports one `--file` and one `--photo`, not repeated files. An unknown scheduled-send outcome suggests `messages scheduled` without naming the chat.
- **`max polls` is shared with tg.** `polls vote|close --json` returns `{operationId, poll}`, with `poll` shaped as `{chatId, messageId, question, answers: [{id, text, voters, chosen}], closed, multiple,
  anonymous, voters}`. `polls create` returns `{sendId, operationId, message}`. MCP `max_polls_vote`, `max_polls_close`, `max_polls_create` match. `max_polls_create` replaces `revote` with `silent`.
- **Reactions, pins and read receipts share tg's JSON format**, including `operationId`:
  - `reactions add|remove`: `{operationId, chatId, messageId, reaction}`, your reaction or `null`; message counts remain available through `messages list`.
  - `messages pin|unpin`: `{operationId, chatId, messageId, pinned}`, with `pinned` as `true` or `false`.
  - `chats mark-read`: `{operationId, chatId, until}`, with `null` meaning through the latest message.

  MCP `max_reactions_add`, `max_reactions_remove`, `max_messages_pin`, `max_messages_unpin`, `max_chats_mark_read` match.
- **`max messages unpin <чат> <сообщение>`** now requires a message ID, like tg and pin. MAX has one pin and removes it regardless of the supplied ID. MCP `max_messages_unpin` also requires `message`. Calls to `messages unpin <чат>` must add any message ID from that chat.
- **`max serve --detach` and `max serve --stop` are removed**, replaced by `max server start` and `max server stop`. `serve` handles foreground work; `max server` controls background work. Update scripts and manually written services.
- **`max server status --json` matches tg:** `byHand` becomes `by` (`hand`, `command`, `server`, `unit`), with added `log`, `unit`, `stale` for a crashed server's marker. `max server start`, `stop`, `restart` return `{ started, by, pid, startedAt, log }` and `{ stopped, by, pid }`; `socket` is removed.
- **`max messages send --at` becomes `--at-time`**, consistent across time-taking commands. Scripts using `--at` receive unknown-option errors. MCP `max_messages_send` parameter `at` remains unchanged.
- **`--markdown` is removed in favor of `--md`** for sending, `messages edit` and all formatting reads. Update scripts using the old name.
- **`max sends list --json` renames `cid` to `sendId`, a string instead of a number**, matching `outcome_unknown` and `--send-id`. Older records are displayed in the new format too.
- **Run events (`--trace`, `--record`, `max runs show`) use the shared tg/max format.** Send IDs are `send`, not `cid`; MAX error keys are `providerError`, not `maxError`, in events, `run.json` and error `details`.
- **`max bot` returns `outcome_unknown` (code `14`) for write responses 502, 503 or 504**, previously `provider_unavailable` (code `12`). Gateway responses do not prove whether MAX executed the request; it may have succeeded. Scripts retrying code `12` could duplicate writes. For code `14`, check the result first. Reads still retry and return `provider_unavailable`.
- **Bot commands use shared tg names; old names are removed.** `max bot messages get <сообщение>` → `messages show <чат> <сообщение>`; `messages edit|delete` also take chat first. `bot chats get` → `chats show`; `bot chats pin|unpin` → `messages pin|unpin <чат> <сообщение>`. `--format markdown|html` becomes `--md` or `--html`. `--type` is removed: use `--photo`, `--voice`, or `--as-file` for video documents. `chats action` accepts `typing`, `photo`, `video`, `voice`, `file`. Sends and edits return `{ operationId, message }`. Deletion asks for approval; `--allow-dangerous` supplies it. MCP names are `max_bot_chats_show`, `max_bot_messages_show`, `max_bot_messages_pin`, `max_bot_messages_unpin`.
- **`max bot members` and `max bot admins` become `max bot chats members` and `max bot chats admins`**, matching tg. `admins add` replaces `--permissions` with `--can`, accepting `max chats admins add` words (`read`, `members`, `admins`, `info`, `pin`, `link`, `edit`, `delete`), and `--alias` with `--title`. Calls/statistics permissions are unavailable. `admins list` returns `{ id, name, username, role,
  rights, title }`. MCP: `max_bot_chats_members_list|add|remove`, `max_bot_chats_admins_list`.
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

Commands follow one naming rule: resource, then action. Old names return “unknown command” or “unknown option”, code `1`, without performing anything.

- **`max backup messages` → `max store fetch`.** Download starts immediately; `--estimate` only calculates (previously downloading required `--run`). Each run still handles up to `--max-pages` pages, default 40, with the same pauses. `--pause` requires a duration (`5s`, `500ms`); unitless numbers refuse. `--since` and `--last` are optional: repeated runs otherwise reach the beginning, resuming where they stopped.
- **`max export messages` → `max store export`.**
- **`--cid` → `--send-id`** for `messages send` and `messages forward`. `outcome_unknown` uses `sendId`; MCP `max_messages_send` and `max_messages_forward` rename `cid` to `send_id`.
- **`max chats read` → `max chats mark-read`**; MCP `max_chats_read` → `max_chats_mark_read`.
- **`max chats settings` is removed.** `max chats show` displays `settings`, `description`, `access`; `max chats link show` still displays invites. Change settings with `max chats update <чат> --all-can-pin on|off` and other flags.
- **`max update` → `max upgrade`**, including update hints.
- **`max recipients off` → `max recipients clear`**, response `off` → `cleared`; **`max bot recipients off` → `max bot recipients clear`**.
- **`max account sessions end-others` → `max account sessions end --others`**; omitting `--others` refuses.

### New

- **`max complete` appears in `max --help`**, making Tab setup discoverable.
- **[Browser access guide](./remote.md): ChatGPT or Claude** through a password-authenticated proxy and public Tailscale address without a domain. Based on documentation, not tested end to end.

## 0.20.0 — 30.09.2026

### Changed — may break scripts

- **Shared storage upgrades to schema 6** (cli-messaging 0.49.0). The first `max` run upgrades `messages.db`. Older tg versions then refuse the file; install the same-day or newer release with `npm install -g @leemour/tg-cli@latest`. MAX commands are unchanged.
- **`--all-bots` requires permission to read other bots.** Configure `readOtherBots` in `bot` with `max <имя> config set --bot readOtherBots true`, or a profile list. Otherwise the command refuses with code `5` and an enabling command.
- **Ambiguous person candidates are sorted by name**, unnamed people first, instead of cache order. Error wording is unchanged.

### New

- **`--bots news,support`** for `bot messages search`, `bot people show`, `bot messages between` reads only those profiles if permitted by `readOtherBots`. `bot messages search` also supports `--all-bots`.
- **`bot mcp` exposes `all_bots` and `bots`** for these three tools only when cross-bot reads are allowed.
- **People are isolated per bot.** A person seen by one bot is unavailable to another without `--all-bots` or `--bots`.
- **Bot text search matches three-letter substrings inside words** (`вартир` finds “квартиру”), like personal search in this release.

## 0.19.0 — 28.09.2026

### Changed — may break scripts

- **Closing polls through `max mcp` requires `edit`**, rather than `reaction`. Closing edits the poll message, and `max polls close` already required `edit`; agent and human permissions now agree. With restricted `allow`, add `edit` to expose `max_polls_close`. Unrestricted profiles are unchanged. See [MCP guide](./mcp.md).

### Fixed

- **`max mcp --confirm-send` starts when only `mcpTools` enables writes.** Previously it required an `--allow-*` flag, potentially leaving contacts, groups and profile changes without confirmation. Without `--confirm-send`, behavior is unchanged; add it to approve each change.
- **`max <бот> bot messages search --limit N` reports further matches.** Previously `hasMore: false` was always returned and `limit` came from configuration instead of `N`, causing scripts and agents to stop early. Now `hasMore: true` is returned when matches exceed `N`.

## 0.18.1 — 28.09.2026

### Fixed

- **`max contacts rename` appears immediately** in `contacts show` and direct-chat titles. Previously names remained stale until background `max serve` logged in again because it ignored the returned contact. If still stale, the first 0.18.1 command replaces the old server.

## 0.18.0 — 28.09.2026

### New

- **Account-changing tools in `max mcp`:** add, remove, rename and block contacts; close your poll; join, leave and create groups; appoint and remove admins; change profile name and description. Previously MCP only read and sent messages. Only the owner enables them through `mcpTools`, for example `max config set mcpTools contacts,polls`; agents cannot self-enable through flags. Every action passes `readOnly`, `allow` and logging. See [MCP guide](./mcp.md).
- **Bot file uploads appear in `--trace` and run records.** `bot messages send --file` and `bot uploads put` show two lines with file type, size, HTTP status and duration. Upload URLs and filenames are never displayed or logged.

### Fixed

- **`max contacts rename` actually changes names.** MAX previously returned success without changing anything when `lastName` was omitted. It is now always sent, `null` when absent, matching the web client. Repeat `contacts rename` attempts made through 0.17.x.

## 0.17.1 — 28.09.2026

### Fixed

- **Invalid `--limit`, `--last`, `--max-pages` errors repeat your input** for `messages list`, `inbox`, `backup`, `sends list` and bots. `--limit abc` previously reported `NaN`; 0.17.0 fixed only paginated lists.
- **`runs list` and `sends list` truncated by `--limit` report `hasMore: true`** and the requested limit rather than a misleading `hasMore: false`, preventing scripts from stopping early.
- **Renamed contacts use your chosen name**, matching the MAX app, instead of the person's own name after `contacts
  rename` or an app rename.

## 0.17.0 — 28.09.2026

### Changed — may break scripts

- **Every JSON list becomes `{items, page, limit, hasMore}` rather than an array.** Applies to `account sessions list`, `chats members list`, `chats folders list`, `messages scheduled`, `messages download`, `messages context`, `models audio list`, `recipients list`, `sends list`, `runs list`, `chats check`, `chats events` and all bot lists. Previously there were three shapes, including `{events, more}`. Read `.items`. Unpaginated lists use page 1 and returned count as limit. `bot members list` and `bot admins list` also return `marker`; `user_id` becomes a string. `bot messages get` returns the message rather than a one-element array. `--jsonl` and human tables are unchanged. MCP matches; `page`, `limit` and `hasMore` are part of the shared list wrapper.

### New

- **`max doctor` and `max config show` include bots** in all local profiles, marked personal, bot or both. `doctor` shows bot token source, seen-chat count and paths; `doctor --online` identifies the bot through the API. Bot profiles now receive appropriate `max <имя> bot …` hints rather than `session start`.
- **MCP `max_status` and `max_bot_status`** report the server profile, token presence and enabled writes. Neither writes; `max_status` never logs into MAX.
- **Tab completion understands bots**, suggesting their seen chats and all profile names, including bot profiles.
- **Bot commands support diagnostics like personal commands.** `max <имя> bot … --trace` prints each request's operation, chat/message, HTTP status and duration. `--record` saves runs; failures save automatically. Read with `max runs list`, `max runs show`. File uploads (`--file`) were not recorded until 0.18.0.
- **Separate `personal` and `bot` settings**, each with `defaults` and `profiles`. `max config set --personal|--bot` writes sections; `max config show --bot` shows bot values and source keys such as `config file: bot.profiles.test`. More specific values win: section profile, profile, section defaults, global `defaults`. Old files retain behavior. See [Configuration](./configuration.md).
- **Optional bot hourly limits:** `max <имя> config set --bot sendsPerHour 200`. Bots remain unlimited by default.
- **`max config set defaultProfile <имя>`** chooses the implicit profile, previously always `default`.
- **Profile photos, custom contact names and blocking.** `max account update --photo <файл>` changes your photo; `max contacts rename <кто> <имя> [фамилия]` sets a name visible only to you; `max contacts block <кто>` and `unblock` work even outside contacts. Safeguards match `account update` and `contacts add`. Renaming did not actually work in this version; fixed in 0.18.0.
- **Channels:** `max chats create <название> --channel` creates a private channel. Invite with `max chats link show`; direct addition may be rejected by MAX.
- **Admin read and invite-link rights:** `max chats admins add <чат> <кто> --can read,link`. A bot without `read` cannot read group messages.
- **Relative times** for `--since`, `--before`, `--after`: `30m`, `2h`, `1d`, as in `max review --since 1d`, replacing the former exact-time requirement.

### Fixed

- **Your chat changes appear immediately.** After `max chats update`, `chats settings`, `chats link
  reset`, `chats show` and `chats list` previously showed old titles for minutes because MAX does not echo changes and `max serve` ignored the returned chat. It now applies it as it already did sent messages.
- **`max export messages` no longer warns about missing history before 1970-01-01 after a complete `backup`.**
- **Invalid `--limit` and `--page` errors show the original input**, not `NaN`.
- **Reset invite links in `chats inspect` and `chats join` return not found** (`not_found`, code 6) instead of an opaque MAX opcode rejection. Update scripts expecting another code.
- **`max config show` and `max doctor` omit phantom `<имя>.moderation` profiles**, previously confused with moderation-rule files.
- **Unknown subcommands name the unknown word, not the profile.** `max work bot auth status` now identifies `status`, not `work` as a profile-parsing issue.
- **`max config show` displays `transcribeModel`**, previously omitted.

### Removed

- **Join requests: `max chats requests list|accept|decline`, `requests`, `consent.accept`, `consent.decline`.** MAX has public or invite-only groups without approval, so the commands promised nonexistent functionality. Old rule files remain readable; the next write removes obsolete fields. Calls to `chats requests` return unknown-command errors.

## 0.16.0 — 27.09.2026

### New

- **Bot people and conversations:** `max <имя> bot people show <кто>` shows where someone posted and their direct chat; `bot messages search --from <кто>` finds posts by people; `bot messages between <кто> <кто>` finds chats where everyone posted. All data comes from this computer's seen messages; `--all-bots` reads all bot copies.
- **Bot group checks:** `max <имя> bot chats check <чат>` applies `bot chats rules show|set|unset` to messages and members, using joins saved by `bot updates watch`. Removed people cannot return through invites unless `--no-ban` is used; Bot API cannot undo the ban. Account ages are unavailable, so those rules do not run.
- **Polls:** `max messages list` displays questions, IDs in `[скобках]`, votes and your ✓. `max polls vote <чат> <сообщение> <вариант>…` votes, `--retract` withdraws, `max polls close` closes your poll, `max polls create` creates one. MCP `max_polls_vote`, `max_polls_create` require `--allow-send`. Invalid closed polls, excess choices or disallowed revotes refuse locally. web.max.ru does not display polls; creation warns about it.
- **`max <имя> bot mcp`** connects an agent to a bot, read-only by default in this release. Writes require `--allow-send`, `--allow-delete`, `--allow-moderate`, with `--confirm-send` for forms. Commands enforce recipients and logs; rule actions needing confirmation share one form. See [Bot MCP](./bot.md#бот-для-агента-mcp).

### Changed — may break scripts

- **`max bot api get-updates` uses `--poll-timeout`** for its API `timeout`. Previously `--timeout` was consumed as the whole-command budget and never reached MAX. Update long-poll scripts.

### Fixed

- **Automatically started `max serve` is replaced on the first newer-version command**, rather than rejecting new operations, such as voting, until `max server stop`.
- **A different build with the same version also replaces its server.** A manually started server rejects unfamiliar operations with a `max server stop` hint.
- **`max bot api get-updates --limit …` works**, rather than interpreting the API limit as a CLI configuration setting.

## 0.15.0 — 27.09.2026

### New

- **`max chats check <чат>`** checks messages and joins since the last run against `max chats rules`, then reports, deletes messages or removes members as allowed. Default is report-only; `--dry-run` only plans, at most 10 actions per check. Deletion/removal uses normal safeguards. Join-request actions were only planned here, then removed in 0.17.0 because MAX has none. See [Groups](./groups.md).
- **Agent moderation:** `max mcp --allow-moderate` exposes `max_chats_check`; `max_chats_events`, `max_chats_members`, `max_chats_rules` are always available read-only. Without the flag, checks are absent. Required approvals use one form.
- **Roles and invites:** `max chats members list` labels `owner`, `admin`, `member`; `max chats link show <чат>` shows invites.
- **Personal-account video and voice:** `max messages send <чат> --file ролик.mp4` sends in-chat video (`.mp4 .mov .webm .mkv`); `max messages send <чат> --voice
  заметка.ogg` sends voice with waveform and duration. Use `--as-file` for the old video-document behavior. Voice requires Ogg Opus; other formats receive an `ffmpeg` conversion hint. See [Personal account guide](./usage.md).
- **Inline voice transcripts:** `max messages list <чат> --transcribe` and `max inbox
  --transcribe` transcribe locally, shown with 🎤 or JSON `transcript`. MCP `transcribe: true` works in `max_messages_list`, `max_inbox`. Existing transcripts show without a flag; new ones require a downloaded model.
- **More bot commands:** `max <имя> bot messages send --file <путь>` attaches images, video, audio or files; `bot uploads put` uploads only. `bot members list|add|remove`, `bot admins list|add|remove` manage membership; `bot comments list|get|send|edit|delete` handles channel comments; `bot callbacks answer` handles buttons; `bot commands
  list|set|clear` manages menus; `bot webhooks list|set|delete` manages webhooks. See [Bots](./bot.md). `webhooks set` rejects another configured address because MAX delivers to both instead of replacing one.
- **Bot local storage:** read, sent and received messages are saved. `max <имя> bot messages list <чат> --offline` and `messages get --offline` read without a network; `bot messages search <текст>` searches. Deletions performed by the bot or observed through `updates watch` remove local messages. Storage contains message text.
- **`max <имя> bot updates watch`** prints events until Ctrl-C and saves messages, resuming on the next run. It does not work with a webhook and consumes updates unavailable to other readers; use only when no other reader needs the bot.
- **Bot people:** `max <имя> bot people show <кто>` reports chats and latest direct messages; `--refresh` refetches from MAX. `bot messages
  search --from <кто>` searches one author; `bot messages between <кто> <кто> …` finds shared conversations. `--all-bots` searches all copies; people accept ID, `@username` or name fragment.

### Changed — may break scripts

- **`max bot messages list` is oldest first**, matching personal lists, instead of newest first. Bot-sent messages are marked own messages. Scripts reading the first row as newest must change.

### Fixed

- **`max review --transcribe` closes MAX before recognition:** audio downloads first, then connection closure, then the model.
- **`max bot api edit-my-commands`, `subscribe`, `unsubscribe`, `get-upload-url` work**, rather than failing with “an account change without a known action”.
- **Bot sends to positive IDs without `user:` suggest `user:<номер>`**, since the destination is probably a person.
- **[Bot examples](./bot.md) omit fabricated chat IDs** and explain how to get real ones.

## 0.14.0 — 27.09.2026

### New

- **`max bot` uses the official Bot API.** `max bot auth set` verifies and stores its token separately in the keyring. Profiles go first: `max рабочий bot me`. `max bot me` shows the bot; `max bot api <операция>` calls any of 33 operations with parameter flags and JSON bodies, generated from the [official schema](https://github.com/leemour/max-cli/blob/v0.27.0/docs/dev/bot-api-coverage.md). IDs above 2^53 are strings; scripts must treat them accordingly.
- **Convenient bot commands:** `max <имя> bot messages send <чат> <текст>` accepts chat IDs, `user:<номер>` or a known title; `edit`, `delete`, `list`, `get` are available. `max <имя> bot chats list` lists seen chats; `chats get|pin|unpin|leave|action` manages them. `max bot list` lists profiles with bot tokens. MAX has no bot-chat listing, so the CLI remembers seen chats itself.
- **Bot recipients and logs:** `max <имя> bot recipients add|list|remove|off`, `max <имя> bot sends list`. Every write, including `bot api`, checks recipients. No hourly bot limit existed until 0.17.0. See [Bots](./bot.md).
- **Group moderation data:** `max review --unanswered [часы]` finds questions unanswered by you or admins; `max review --chat <чат>` reviews one chat. `max chats events <чат>` shows joins, departures, additions and removals. `max chats members list
  <чат>` returns all group/channel members with registration and last-seen times. `max chats
  rules show|set|unset <чат>` manages rules in one local file like configuration.

### Fixed

- **MAX disconnections report the close code and reason.**

## 0.13.0 — 26.09.2026

### New

- **`max review` gathers commitments:** all messages, including yours, in chats active since the prior review, or 3 days without `--since`. `--transcribe` processes audio; the response gives the next review boundary. Incomplete data is explicitly marked; do not treat it as complete ([Review guide](./usage.md#обзор-кто-кому-что-должен)).
- **MCP `max_review` and `/review`** organize what you owe, await and need to clarify, checking work groups before declaring overdue items and drafting reminders. Reminders require approval ([MCP prompts](./mcp.md#команды-и-чаты-по-)).
- **`max mcp config` prints configuration for Claude Desktop, Cursor and other clients**, with absolute paths for Windows and applications missing terminal `PATH` ([Connection guide](./mcp.md#подключение)).
- **`max doctor` checks installation:** runtime, installation path, visibility in a new terminal, keyring/SQLite loading and downloaded speech models. Missing `PATH` entries receive PowerShell or `export` fixes. If `max` itself is absent, use `npx @leemour/max-cli doctor` ([Troubleshooting](./troubleshooting.md#max-не-находится-после-установки)).
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
- **`max serve` requests folders, banners, calls, stickers and reactions like web.max.ru**, and subsequent logins request only changes since the previous timestamp. This reduces differences from the web client. All requests read only; responses are neither shown nor saved. One-off commands omit them ([Network behavior](./security.md#что-уходит-в-сеть)).
- **The server skips malformed incoming MAX messages**, warns once and continues, instead of potentially stopping.

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

- **Tokens from `MAX_TOKEN` stay there.** Rotated tokens are not saved to keyring/files; stderr reports this. `max doctor` identifies `credentials.json` when using file storage.
- **`max session start` masks phone numbers**, like `max account show`. Ctrl-C at the token prompt returns `130`.
- **The server never hands out tokens** to clients requesting login data; they check the keyring themselves.
- **Network limits:** decompressed MAX frames are capped at 32 MiB. Connections and downloads have timeouts. `max messages download` requires HTTPS, rejects local-machine/network URLs even after redirects, and caps files at 4 GiB and transcription audio at 32 MiB. Message links are untrusted.
- **Local storage permissions:** database, `-wal`, `-shm` files use `0600`; directories `0700`. Existing permissions are corrected on opening. Reports replace chat/message IDs with labels.
- **Untrusted text uses one line with visible controls** in feeds, tables, candidates, Markdown and `messages download` paths. Filenames lose control and text-direction characters; only `http` and `https` become Markdown links.
- **Completion inserts only IDs**, displaying names beside them because titles and `@имя` come from other people and must not become shell code.
- **`max cache clear` without a profile respects the default and `MAX_PROFILE`.**
- **Release hardening:** exact dependency versions, clean builds before packaging, no test helpers, and a dedicated publish step that does not install or execute dependencies.

## 0.10.0 — 25.09.2026

### New

- **`max doctor report` and `max doctor report create`** explain report contents or create a content-free file with next steps. This release used email; 0.11.0 moved to GitHub ([Reporting problems](./troubleshooting.md#как-сообщить-о-проблеме)).
- **`max backup messages <чат> --since <дата> | --last <n>`** downloads earlier history. Without `--run`, it only estimates. With it, it pages backwards 30 messages at a time, up to 40 pages with pauses, resuming later ([History download](./archive.md#скачать-историю)).
- **`max doctor` shows the emulated web-client version**, warning if checked over 60 days ago because MAX may reject old clients ([Troubleshooting](./troubleshooting.md)).
- **`max server start|stop|status|restart`** manages the background server separately, like `max session`. `status` shows running state, start time, version and MAX connection, suggesting `restart` when outdated. `max serve --detach` and `--stop` still work here ([Server guide](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch)).
- **History requests use the web client's five fields**, and login requests 15 chats like web.max.ru, fetching the rest separately. Previously it used an extra field and requested 40 chats. This reduces detectable differences; chat results are unchanged, and channel testing confirmed reads still send no read receipts.
- **Device descriptions use this computer's timezone, language and OS**, instead of every installation claiming Chrome on Linux in Madrid.
- **`max serve` sends one hidden-tab-style service event** 20 seconds after login: chat list shown, with account ID and time, no content or titles. One-off commands do not send it ([Network behavior](./security.md#что-уходит-в-сеть)).
- **Folder titles longer than 20 characters are rejected locally**, instead of sending a request MAX would reject.

### Changed — may break scripts

- **Excessive-login rejections no longer trigger more attempts.** Code `8` pauses a profile for 1 minute, 5 minutes, 30 minutes, 1 hour, 6 hours, then 1 day. The background server stops on any login rejection, previously retrying indefinitely each minute. Scripts receive code `8` until the stated time; wait ([Troubleshooting](./troubleshooting.md)).

### Fixed

- **An inaccessible keyring is distinguished from missing login.** Previously logged-in profiles with unreadable tokens, such as under cron, receive keyring guidance rather than another login hint, avoiding unnecessary new devices ([Recipes](./recipes.md)).
- **Failed runs save without `--record`**, including MAX key (`login.token`), warning codes, crash location, runtime version and OS, never text. Background logs use timestamped JSON lines ([Diagnostics](./diagnostics.md)).
- **`max chats read --until` marks only through its message**, rather than using current time and marking newer messages read. `messages list --mark-read` is fixed too; others may previously have seen receipts for unread messages.

## 0.9.0 — 25.09.2026

### New

- **MAX traffic matches the web client's address, binary frames, compression and updated device/browser versions**, replacing the old text-frame format. This is harder to distinguish and supports binary audio/video-note fields. Commands/output are unchanged; voice sending follows in later releases. Login still fetches full chat lists here, creating extra traffic.
- **Automatically started `max serve` restarts after updating `max`.** Manually started servers remain old until `max serve --stop` and a restart.

## 0.8.0 — 25.09.2026

### New

- **`max messages transcribe <чат> <id>`** recognizes voice locally without uploading it. `max models audio list` shows language support; `max models audio download <id>` downloads and checksum-verifies. MCP: `max_messages_transcribe` ([Voice transcription](./usage.md#голосовые-в-текст)). Download is explicit and one-time; saved transcripts avoid both network and model on repeats.
- **One MAX connection per profile**, shared by commands, `max mcp`, `max watch` through `max serve`, reducing logins and possible session termination. `max session start` stops, logs in and restarts it ([Server guide](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch)).
- **`max serve --detach` starts in the background and returns once connected; `max serve
  --stop` stops it.** Manual servers stop only with Ctrl-C or `--stop`; `max
  session end` leaves them running.
- **`allow` profile permissions:** `max work config set allow send,reaction` permits sends/reactions only. Twelve names range from `send` to `sessions`. Without a list all remain allowed. Rejections return `5` before connecting, with a permission-setting command. MCP hides forbidden tools ([Permissions](./usage.md#что-профилю-можно)).
- **`max messages send … --at <время>`** schedules on MAX's server, even with the computer off. Accepts `2026-09-25T09:00` locally or `30m`, `2h`, `1d`. `max messages scheduled <чат>` lists the queue; MCP uses `at` in `max_messages_send` and `max_messages_scheduled`. Cancellation is app-only ([Scheduled sends](./usage.md#отправить-позже)).
- **`max chats read <чат>` and `max messages list … --mark-read`** send explicit visible read receipts. MCP needs `max mcp --allow-mark-read`; normal reads remain invisible ([Reading](./usage.md#чтение)).
- **`max export messages <чат> --format jsonl|md`** exports local JSONL or Markdown with `--since`, `--output`, without querying MAX. Missing ranges are reported on stderr; output files are owner-only ([Export](./archive.md#выгрузить-в-файл)).
- **`max messages delete <чат> <id…> --allow-dangerous`** deletes up to 10 messages, locally by default or for everyone with `--for-everyone`. MCP `max mcp --allow-delete` deletes only for you. Permission is mandatory; each deletion counts toward `sendsPerHour` ([Deletion](./usage.md#удаление)).

### Fixed

- **Upgrades preserve read history through schema migration**, instead of clearing it on schema changes. This release changes the schema and preserves messages; chats/people are refreshed on login.
- **After server login rejection, commands wait 10 minutes before starting another server**, rather than repeatedly triggering rejected logins. `max session
  start` clears the wait.
- **`max watch` sees messages sent by `max` itself**, previously missing because MAX does not echo to the sending connection.
- **Concurrent commands preserve local login data.** Previously two of three runs reported “the local record did not take this login”, losing chats, members and sync state. Writes now wait their turn.

### Security

- **Error text cannot control the terminal.** Controls display as `\x1b`, extending 0.7.0's protections because errors may quote user input or MAX responses.

## 0.7.0 — 24.09.2026

### New

- **`max reactions remove <чат> <id>`** removes your reaction.
- **Groups and channels under `max chats`:** inspect invites, join, leave, create, add/remove members/admins, rename, change settings and reset invites. Join requests appeared here but were removed in 0.17.0 because MAX has none. Changes are visible and pass send safeguards ([Group guide](./usage.md#группы-и-каналы)).
- **`max update` uses the installation package manager**; `--check` only checks. Terminal users receive daily version hints, never agents/scripts. Disable with `updateCheck: false` in `defaults` ([Updates](./installation.md#обновление-и-удаление)).
- **Tab completion for zsh, bash, fish and PowerShell:** `source <(max complete zsh)`, offering commands, flags, values and local chats/people without connecting ([Completion](./installation.md#автодополнение)).
- **`max mcp` exposes the same profile to MCP clients**, including Claude Desktop and Cursor ([MCP guide](./mcp.md)). Read-only unless `--allow-send`; sends use the same checks as `max messages send`.
- **`max mcp --allow-send --confirm-send`** shows destination title/ID and text before each send. Nothing goes without approval; clients without forms fail ([Confirmation](./mcp.md#подтверждение-формой-от-самого-сервера)).
- **`max messages send … --file <путь>`** sends photos/files; several photos use one message in this release.

### Security

- **Untrusted content cannot control terminals.** Messages, names, titles, filenames or reactions containing controls previously could erase and overwrite output. They now display as `\x1b` in feeds, tables, errors and completion. JSON remains unchanged, already escaping them.

## 0.6.0 — 24.09.2026

### New

- **`max commands --json`** describes all commands, arguments, flags and exit codes in one response, with `mutates: true` for MAX changes. Agents avoid per-command `--help`; it works without login and with broken configuration.
- **`max messages send … --reply-to <id>`** replies to a message.
- **`max messages send … --markdown` (or `--md`)** formats `**жирный**`, `_курсив_`, `~~зачёркнутый~~` and `` `код` ``. Without a flag, text stays literal.
- **`max reactions add <чат> <id> <эмодзи>`** sets a reaction, replacing yours.
- **`messages list`, `show`, `context` display reactions**, such as `👍 3  🔥 1  (you: 🔥)`, or JSON `reactions`. One extra read request per page; offline reactions are `null` because not stored.
- **Send logs and optional recipients:** `max sends list` logs attempts without content; `max recipients add|remove|list|off` restricts chats, rejecting code `7`. `readOnly` rejects `5`. See [Security](./security.md) for scope and limitations.
- **`max session start qr | qr-chrome | sms | token`** logs in without copying browser tokens. `qr` renders in the terminal, or browser if narrow; `qr-chrome` and `sms` open web.max.ru in separate Chrome, Chromium, Edge or Brave windows. Without a method, import manually or by pipe as before.

### Changed — may break scripts

- **Default hourly sends are limited to 30 (`sendsPerHour`).** `max messages send` returns `8` beyond that, previously unlimited. Scripts intentionally sending more must raise the setting.

## 0.5.0 — 24.09.2026

### New

- **`max messages download <чат> <id> [--output <каталог>]`** saves photos, files, video and audio without overwriting existing files.
- **`max config set <настройка> <значение>` and `max config unset <настройка>`** edit configuration, with `--defaults` for all profiles. Global `defaults` apply where a profile has no override.
- **`max chats list --unread`** filters unread chats.
- **`max messages list <чат> --after <id|время>`** reads forwards after a message or time, with a `--after <id самого нового>` continuation hint.
- **`max chats show <чат>`** shows a chat/members; **`max contacts show <человек>`** accepts ID, @username or name fragment and shows shared chats. Ambiguity lists candidates instead of guessing.
- New read operations in this release neither send nor mark read.

### Fixed

- **`--offline` works.** Previously commands ignored it: reads contacted MAX, and `max --offline messages send` **sent messages**. Now reads use storage while sends/downloads refuse. `--offline messages send` on 0.4.0 or earlier did go through.
- **Configuration errors explain unknown fields, valid names and accepted values**, replacing validation-library errors.
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

- **List `--query` becomes `--search`**, introduced in 0.3.0 but omitted from its original notes. Update scripts to avoid errors.

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

- **`-v` is output detail; version becomes `max -V`.** **`--trace`** replaces former `--verbose` request tracing. Scripts using `max -v` for the version must use `-V`; update tracing calls accordingly.
- **List `--query` becomes `--search`**, originally omitted from these notes.
- **Local cache upgrades to schema 4 and rebuilds on first run.** Read history is not preserved in this release; read it again.

### Fixed

- **Ambiguous chat names return candidates with IDs**, including JSON `candidates`.
- **Cache warnings name the schema and next steps**, rather than `Error`.
- **`messages list` continuation hints use `--before <id>`**, not nonexistent `--page`.

## 0.2.0 — 22.09.2026

### New

- **`max messages send --silent`** requests sends without notifications. Its actual effect was not observed in this release because doing so required messaging a real person.
- **First login exchanges the token:** MAX returns a session token, replacing the imported browser token in the keyring once.

### Fixed

- **`max session start` checks before saving**, preventing typos from replacing valid tokens.
- **Profiles stay tied to their account.** A different account's token is rejected with an explanation rather than running commands as someone else.
- **Unknown-send-outcome hints name a real command**, not nonexistent `max send`.
- **Login messages are retained**, previously discarded due to an incorrectly described response shape.

## 0.1.0 — 21.09.2026

The first shareable version.

### New

- **Seven commands against real MAX:** `session start|end`, `account show`, `chats list`, `contacts list`, `messages list`, `messages send`.
- **Profile first:** `max personal chats list`; accounts have separate tokens, state and local copies. `MAX_PROFILE` selects the same profile.
- **Tokens live in the OS keyring**, not files or arguments. Phone login is not yet available; `max session start` imports an official-client token.
- **Machine output:** `--json` emits exactly one JSON value on stdout, also automatic without terminal stdout. Errors go to stderr with stdout empty. Branch on exit codes in the [Command reference](./commands.md), sourced from `docs/commands.md`.
- **Content-free diagnostics:** `--verbose` displays request events; `--record` saves them for 30 days; `max runs list|show|path` reads records. Nothing is saved by default in this release.
- **Local storage:** read data is saved; `--offline` answers without connecting; `max cache clear` clears it.
- **Configuration in `~/.config/max-cli/config.json`**, precedence flag → environment → file → default. Unknown fields produce named errors, never silently ignored defaults.
- **Two runtimes:** Node 22+ and Bun 1.3+, both running the built command in CI.
- **Reading never marks read.** History and read receipts are separate protocol operations; the latter is never sent in this release, verified by tests.
- **Sending reports uncertainty honestly:** missing responses return `outcome_unknown`, code `14`, rather than success or failure. Retry only with the same `--cid` to avoid duplicates.
- **Personal-account MAX protocol is unofficial and reverse-engineered**, separate from Bot API. Unannounced changes produce stderr warnings instead of silent failure.
- **Not yet supported:** phone login, attachments, reactions, edits, groups, stories or calls; text only. Personal-account mass mailings are not planned.
