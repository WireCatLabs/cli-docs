# Telegram documentation review — Spanish

Reviewed against the released v0.22.0 upstream pages on 2026-10-03. All 16 non-overview pages translated, preserving command examples, literals, link destinations and heading hierarchy. Wording shortened at paragraph level without removing meaningful constraints. Translation is written directly by this Codex agent; no external translation/model services used.

## Important facts retained

- Personal-account commands and bot commands use separate identities and credentials.
- Node minimum corrected to 22.16 following latest release; no build/native compile at install time.
- Reads do not mark chats read unless explicitly requested; default profile permits writes, and only specified operations ask.
- Bot sending/read/watch/MCP are available in v0.22.0; removed the obsolete v0.21 “coming next” description. Bots cannot retrieve Telegram history: searches, contact views and moderation use locally received messages. Bot API limits, privacy mode, 24-hour update retention and webhook/watch incompatibility are explicit.
- Search, conversation vectors and evidence packets distinguish local operations from optionally remote model processing, including approval and token/cost caps.
- Local archives are not encrypted and are shared across accounts/tools; sessions grant account access.

## Upstream issues to consider

1. `usage.md` still says message search needs at least three characters and that every word must occur. v0.22 changelog/archive/command reference explicitly allow 1–2 letters, fuzzy corrections and relaxed fallback. The translation preserves released facts; the beginner overview should link to archive/search for current behaviour and upstream usage should be updated.
2. `usage.md` describes `--unanswered [hours]`, whereas v0.21+ commands require durations such as 4h or 1d. Examples are valid; textual argument naming should be corrected upstream.
3. `usage.md` retains the older `allow`-list wording in send guard while newer permissions provide per-command levels. Configuration and security give the accurate hierarchy.
4. The shell exit-code example in usage uses `if ! command; then case $?`, which loses the original nonzero code because `!` inverts it. Preserve code in translated release docs but correct upstream before recommending this recipe for scripts.
5. Bot command reference says moderation judges joins while bot guide explicitly says joins are not judged. Bot guide limitation should govern user-facing explanations; clarify generated command help upstream.
6. Bot command reference offers `contacts show --refresh`; the Telegram bot guide explains this is rejected because Telegram supplies no history. Keep this limitation prominent.
7. Remote connectors are explicitly untested end to end and service/plan availability may change. Review browser setup against current vendor docs before representing it as verified support.
8. Security prose says every file is owner-only, but its table lists config/service files as 0644 inside private folders, and changelog notes ordinary export/download permissions. Clarify privacy depends on private parent directories and creation method.
9. GDPR household-use wording is broad, especially the claim that sharing any export necessarily leaves personal use. Retained as source material; obtain precise legal wording upstream rather than treating this as legal guidance.

## Presentation

Spanish headings and human-readable navigation labels replace English prose/filenames. Exact English error text is intentionally retained in troubleshooting headings and explanations so users can match terminal output. Historical changelog statements remain attached to their original versions; they do not describe current defaults.

Portal erratum: replaced the broad GDPR assurance with factual export and AI-provider data flows, without asserting a legal exemption.

Portal corrections now address the listed search/read-marking/consent/permissions/command-name issues where applicable. MAX scheduled-send wording was reconciled with v0.23 client.ts and send-guards.test.ts: checking happens at queuing, accounting uses the scheduled send hour. Remaining remote-access availability/setup is explicitly unverified.
