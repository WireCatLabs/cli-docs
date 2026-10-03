# Telegram documentation: Russian review

Reviewed release: **tg-cli v0.22.0**, 3 October 2026. Durable translations: 16 pages under `translations/tg/`, excluding the root-owned overview. Also translated the English descriptions inside MAX v0.23.0's native Russian command reference into `translations/max/commands.ru.md`.

## Translation and preservation

All explanatory prose, headings, frontmatter titles, table descriptions and changelog entries are Russian. Fenced terminal examples, literal help output, sample conversations, inline commands/flags/JSON keys and link destinations remain unchanged. Source heading topology is preserved so the portal can add original anchor aliases. All 17 pages passed `translationProblems` from `scripts/localize.ts` against the released sources, including the complete command references.

Link labels use reader-facing names such as «Установка», «Безопасность», «Локальная база» instead of source filenames. Technical terms are explained in context; profiles are separate logins, the local store is a SQLite database, and MCP is an optional connection method rather than a prerequisite for an agent with a terminal.

## Reviewed limits retained

- Bot API does not provide Telegram chat history. Bot message list/show/search and moderation use messages sent or observed on this computer; `bot watch` does not recover history before it started. Updates expire after 24 hours.
- A person must start a Telegram bot before it can write to them. Group privacy mode and bot administrator rights affect visible events.
- Telegram bot messages/files have their documented limits; unknown send outcomes must be checked before retrying. Account sends support deduplication via send ids, but bot sends do not automatically retry.
- Unanswered questions are heuristic: question marks/replies and sequence of administrator answers. They are not semantic classification or guaranteed detection.
- Group checks run on request or an explicit schedule. No implied autonomous moderation or continuous monitoring.
- The SQLite store is unencrypted, shared by the messenger CLIs and persists after logout/uninstall. Session files provide account access; they must not be published.
- Permission settings are protection within the CLI, not a security boundary against an agent that can edit settings or its environment.
- Remote browser access setup remains explicitly untested end-to-end. Service availability/plan restrictions are copied as source facts, not reverified external recommendations.

## Source clarity issues

1. **Security read-state claim contradicts usage.** Released `security.md` says only `tg chats mark-read` marks read, while `usage.md` documents `tg messages list --mark-read`. The Russian safety paragraph acknowledges the explicit read-list option without altering command literals. Recommended upstream correction.
2. **Usage search description lags v0.22.** Released usage still implies every word must match, while archive/reference/changelog explain typo correction and fallback matching; messages search now accepts one- and two-letter queries. Russian usage distinguishes the three-character chat-name filter from message search and describes the fallback. Recommended upstream correction.
3. **Agent client categories were misleading.** Original guides group Cursor with “agents without a terminal”; Cursor can also run terminal commands. Russian prose frames MCP as an available connection choice, depending on terminal access, and keeps both documented routes.
4. **Advanced internals overwhelm first-time readers.** Keep detailed commands/archive/security as reference and link from the new structured overview. Lead with what the tool does, account versus bot, and a clear install/login/read path. Do not put permissions matrices, store migration or release history in the onboarding path.
5. **Fenced sample conversations remain English.** This follows exact-code preservation: these blocks contain runnable command lines and literal sample output. Reader explanations and headings are translated. A future upstream change could separate user-facing example dialogue from immutable shell/output blocks if fully localized examples are desired.

## Remaining improvement suggestions

- Prefer `tg skill install` in everyday onboarding; keep `tg skill show` and manual writing only as advanced/custom setup examples. The release includes the installer, while old recipe examples still write the skill file manually.
- Fix small outdated source prose once upstream docs can be changed, then resync and review translations rather than silently losing translations to hash mismatches.

## Durable post-validation corrections

`/scripts/docs-corrections.json` records eight reviewed correction groups with exact per-language `before`/`after` text. These apply only after translation preservation checks, so the original released examples remain comparable, while rendered/native pages receive the same factual fixes in English, Russian and Spanish. Each replacement was checked to match exactly once in its corresponding source/translation.

The corrections distinguish chat-name filters from v0.22 message search, use durations for unanswered questions, clarify terminal versus MCP access, name the explicit read-list mark-read option, and scope file-permission claims to the actual storage table. The inverted shell-send condition was replaced with an `if`/`else` that captures the original status before dispatch. It was verified using a stub command returning 0, 4 and 14; no Telegram request was made.

MAX v0.23's bot moderation example is corrected from `bot chats check` to `bot chats moderate` in all three languages, as documented by the released bot guide and changelog. The personal-account command `chats check` remains unchanged. Native Russian MAX group instructions also explain that Cursor can choose terminal or MCP access.

The source GDPR household-purpose claim was not independently verified in this technical review. No legal conclusion or replacement exemption was introduced; a future legal review should qualify it before presenting it as broad assurance. This review confirms only the documented local storage, export and sharing mechanisms.

Portal corrections now address the listed search/read-marking/consent/permissions/command-name issues where applicable. MAX scheduled-send wording was reconciled with v0.23 client.ts and send-guards.test.ts: checking happens at queuing, accounting uses the scheduled send hour. Remaining remote-access availability/setup is explicitly unverified.
