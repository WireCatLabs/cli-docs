# Telegram/MAX scenario compatibility — 2026-10-03

Read-only audit of released TG v0.22.0 and MAX v0.23.0 references in `content/upstream/{tg,max}`. No account reads, sends, live authentication or CLI execution. Rules below come from generated command references; narrative discrepancies are explicitly identified.

## Scenario order and proven command adapters

Use this order: context, cross-chat recommendations/course search, group moderation, inbox, commitments, scheduling, files, bot. A prefix-only replacement is insufficient.

| Scenario | Telegram example | MAX example | Adapter / prerequisite |
|---|---|---|---|
| Context around a message | `tg messages context "Project Alpha" 4242 --before-n 3 --after-n 3` | `max messages context "Project Alpha" 100000000000000001 --before-n 3 --after-n 3` | Same command/options; replace example IDs. Agent interprets the returned context. |
| Recommendations or course search across chats | `tg messages search "course" --source all --context 3 --json` | `max messages search "course" --source all --context 3 --json` | Both read the same saved store, including saved accounts of both messengers. They do not search the internet or automatically download every chat. |
| Group moderation preview | `tg chats moderate "Hiking" --dry-run` | `max chats check "Hiking" --dry-run` | Personal-account verb differs. Rules must exist for the intended actions; neither command autonomously monitors continuously. |
| Inbox | `tg inbox --new --json` | `max inbox --new --json` | Same syntax. No read receipts; first run covers 24 hours. `--all` includes muted/archive chats. |
| Commitments | `tg review --since-time 7d --transcribe --json` | `max review --since-time 7d --transcribe --json` | Same syntax. Agents identify promises/decisions; CLI returns evidence. Download a local speech model when local transcription is needed. |
| Scheduling | `tg messages send "Project Alpha" "Reminder" --at-time 2h` | `max messages send "Project Alpha" "Reminder" --at-time 2h` | Personal account only in these examples; messenger server schedules even with computer off. Do not add MAX `--silent`. |
| Files from a message | `tg messages download "Project Alpha" 4242 --output-dir ./downloads` | `max messages download "Project Alpha" 100000000000000001 --output ./downloads` | Output option differs. MAX needs a message ID; do not carry Telegram's whole-chat `--all` download syntax to MAX. |
| Bot replies | `tg support bot messages list "Support" --limit 20` then `tg support bot messages send "Support" "Reply" --reply-to 4242` | `max support bot messages list "Support" --limit 20` then `max support bot messages send "Support" "Reply" --reply-to mid.0000019a7f3c21de` | Existing bot profile goes before `bot`; preserve each messenger's message-ID format. Agent drafts/personalizes before the send. |

The names/IDs above are illustrative, not claims that these chats or profiles exist. Real execution must resolve the actual account, chat and message first.

## Moderation and deletion rules

- Personal TG: `chats moderate`; historical window uses `--since-time <time>`.
- Personal MAX: `chats check`; historical window uses `--since <id-or-time>`, **not** `--since-time`. MAX `review`/`inbox` still use `--since-time`.
- Bot TG and MAX: `bot chats moderate`; window uses `--since-time`. MAX groups overview still mentions obsolete bot `chats check`; use generated commands and current bot guide instead.
- Both support `--dry-run`, which judges/plans without executing moderation actions. Do not describe this as “no files or cursor state can change”; the documented guarantee is no moderation action.
- Both cap a run at 10 actions by default (`--max-actions`), and normal profile safeguards/hourly limits still apply.
- Telegram group consent: `deny`, `readonly`, `ask`, `allow`. `--allow-dangerous` accepts `ask` actions.
- MAX personal group consent: `forbid`, `flag`, `confirm`, `allow`. `--allow-dangerous` permits `flag` actions; `confirm` normally prompts. MAX bot moderation now uses shared semantics; its `flag` behaves like confirmation.
- Link/invite/forward/flood/blocked-person rules are supported. Profanity, conflict and nuanced question detection can be **agent analysis of messages**, not an invented built-in profanity rule or automatic semantic moderation feature.
- Group admin permission is required for deleting others' messages or removing members. Telegram does not expose account ages; do not port MAX `newAccount` analysis to TG. MAX personal removal is not a ban and people may rejoin through an invite.
- Direct deletion uses `messages delete <chat> <ids...> --for-everyone`. Without that flag the intended default is owner-only; Telegram supergroups/channels only allow deletion for everyone. Both limit each call to 10 messages and charge deleted messages against the send limit.
- Telegram deletion prompts; `--allow-dangerous` skips confirmation. MAX generated shared help also describes prompt-skipping, but MAX usage still claims the flag is mandatory and no prompt is shown. For a reviewed, explicitly approved deletion demonstration include the flag on both platforms; avoid promising identical default confirmation behavior until that upstream discrepancy is resolved.
- The safe scenario sequence is preview → show affected message/rule/actions → explicit user approval → execute only approved actions. Never demonstrate “send/read request automatically authorizes deleting spam”.

## Voice, shared storage and scheduling

- TG `messages transcribe <chat> <id>` first uses Telegram where available (Premium or weekly trial) and otherwise a local downloaded model. `--local` forces local processing; `--model` implies local. MAX has no `--local` option and always transcribes locally. Both support `--model <id>`.
- Explicit local prerequisite on either platform: `models audio download <model>`; missing models are not silently downloaded. Russian speech can use `gigaam-v3`; `parakeet-v3` supports 25 languages. Do not make “all audio never leaves the machine” claims for default TG server transcription.
- Both `messages search ... --source all` searches saved accounts/messengers in the common `messages.db`. Individual account profiles remain separate. Search results carry messenger-specific locators; open a MAX result with MAX and a TG result with TG rather than changing the embedded source ID.
- Shared DB benefits proven by references: one local searchable corpus, offline access to saved messages, common message/response interfaces, saved transcripts, cross-chat/cross-account search, and locally built conversation structure. It is not a complete archive unless history was read/fetched. Do not claim automatic full backfill, merged authentication, cloud sharing or that cross-bot bot search bypasses `readOtherBots`.
- Recommendation/personalization copy must say the **agent** compares messages and provided preferences/history. No built-in recommendation engine, customer segmentation or personalization-template flag is documented.
- Personal scheduled sends use `--at-time`, a local ISO time or `30m`/`2h`/`1d`, rounded down to minutes, at least one minute and at most one year ahead. App-only cancellation/editing in these releases. Scheduled retries are not automatic; inspect `messages scheduled` after unknown outcome.
- TG documents send-hour limit accounting; MAX usage says queue-time safeguards, while MAX security/MCP describes send-hour accounting. Avoid asserting a single implementation policy in marketing copy.
- Bot `messages send` has **no** `--at-time` in either reference. Scheduled bot notifications require an external scheduler/agent, not prefix adaptation of personal sends.

## Bot setup and reach

- Both support `bot list`, optionally `--check`, and full `bot messages list/send` in these releases. Earlier claims that TG bot sending is unavailable are outdated.
- Use `tg bot list`/`max bot list` for discovery, then select an existing profile (`support`, for example). Personal account login does not create a bot token. Tokens are configured through `<profile> bot auth set` with hidden input.
- Bot chat lists contain chats seen on this computer, not an authoritative complete inventory. Telegram bots cannot start a conversation with someone who never started the bot; group privacy mode may limit visible history. Never promise arbitrary outreach.
- MAX bot creation requires a verified organization, individual entrepreneur or registered self-employed account and moderation. Group access must first be enabled in business.max.ru; group-reading permission is required.
- Bot tokens/profiles are separate from personal accounts. Bot IDs and reply IDs differ: TG numeric message IDs within chat, MAX `mid...`. Both can address a person as `user:<id>`.
- Broadcasts mean the agent or an external script sends to selected permitted groups/channels, subject to rights/recipient safeguards and limits. Neither reference provides a bulk broadcast command. Telegram bot messages allow 4,096 characters; MAX 4,000.
- Personalized bot replies are drafted by the agent using supplied customer information or observed conversations. Do not claim the CLI fetches a CRM, identifies unknown customers or sends campaign batches automatically.

## Evidence

- `content/upstream/tg/commands.md`: personal moderation ~506, search ~705, transcription ~805, bot sends ~2138, bot reads ~2165.
- `content/upstream/max/commands.md`: personal moderation ~507, search ~689, transcription ~771, inbox/review ~1524, bot moderate ~2177, bot sends ~2203.
- `content/upstream/{tg,max}/archive.md`: explicit `messages search ... --source all` examples and local-only search guarantees.
- `content/upstream/{tg,max}/usage.md`: voice models, scheduling, deletion and attachment behavior.
- `content/upstream/{tg,max}/bot.md` and `groups.md`: bot creation/access prerequisites, seen-chat limitations, permissions and rule consent.
