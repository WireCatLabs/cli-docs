# Reader refresh and command-reference load

## Source and visible work

Work is based on merged main `6726feb` (local merge `713cf3a`), with reviewed Telegram v0.35.0
and MAX v0.34.0 guides. This incorporates the other guide review instead of maintaining the old
v0.28/v0.29 snapshot. Security already has the requested simple title on that main; it is retained.

The active content plan is [reader documentation refresh](../plans/2026-10-08-reader-documentation-refresh.md).
It names pages, reader questions, concrete changes and acceptance criteria. The authoring standard
now explicitly captures the owner's requirements: explain the feature, benefit and result before
instructions; define CLI/login/practice data; put capabilities before method lists; assess changes
on pages as well as through source and release checks.

Visible edits in EN/RU/ES:

- Bots / Bot API starts with what it is, the bot's separate account, five capability groups and
  what the reader will learn. Connecting/verifying the bot and an ordinary agent request precede
  native-method discovery. The 185/33 method counts match current release contracts.
- Search playground explains why to use the practice data, its 36 messages/six chats, and three
  concrete actions before the widget. Its description adds a useful outcome.
- Telegram entry describes tg as a command-line tool. Installation explains account/agent benefit,
  the successful chat-list check and why phone-confirmed login grants device access.
- Native login/usage/archive/search/bot/group/security/recipe/recovery/changelog/roadmap guides have
  task-specific localized orientation before release-owned reference text. The same orientation
  is included in their Markdown copies. These are revised openings, not claims that every native
  reference paragraph has been rewritten.
- People now describes the newly reviewed contact capabilities rather than retaining the former
  v0.28 limitations. Browser setup is aligned with main's current-release instructions and keeps
  the owner's shorter ChatGPT/Claude title.

## Command reference

The HTML entry `/docs/{tool}/commands` chooses personal, bot or group/channel administration.
The three separate references are derived after localization from the complete release-owned
`commands.md`; descriptions and executable syntax are not manually forked. Common global options
and exit codes are included in each part. A test proves each named command occurs once across
parts. Existing command hashes route to the correct part, and the full reference stays in Markdown.
Native collapsed lookup at the entry also links every named command directly to its part.

Local Chromium observations on the production export:

| Tool | Previous full entry DOM nodes | New entry DOM nodes | Previous HTML | New HTML | Observed open time, previous → new |
| --- | --- | --- | --- | --- | --- |
| Telegram | 25,716 | 2,316 | 3,825,114 bytes | 423,980 bytes | 1,223 → 347 ms |
| MAX | 15,572 | 1,834 | 2,317,013 bytes | 344,782 bytes | 546 → 189 ms |

These are single local observations, not field-performance claims. The old export used the earlier
reviewed versions; the new entry includes the larger current-release command set. The main measured
change is removal of all rich command tables/code blocks from the entry. It renders zero code blocks.
Full personal and bot references are still longer documents; this change partitions them rather
than claiming every reference is tiny.

## Release maintenance

Current changelog/roadmap copies come from reviewed v0.35/v0.34 source. `pnpm docs:release-notes`
checks the newest release entry, substantive notes, and a per-version roadmap review with its source
fingerprint. A changed version or roadmap requires a fresh review, including a conclusion when
plans stay unchanged. This runs after sync in CI and production documentation deployment; daily
update reports also require reviewing both files. Explicit nonrelease preview builds retain their
preview path. This is a documentation-publication gate, not a replacement for CLI package-publish
checks in the owning repositories.

## Verification

223 unit tests pass, including partition coverage, legacy-anchor classification, shorthand
validation and release-note stale-review cases. Build exports 536 routes; code lint, TypeScript,
localization, Markdown lint, HTML/Markdown links and SEO pass. Strict current-release validation
covers all 856 reference entries with zero gaps/invalid examples. The 105 generic constructs remain
a manual-review queue.

Browser results: all 46 affected checks pass, including the three reference accessibility checks after preserving heading hierarchy.
Old demo assertions were updated to the approved homepage-backed scenario. Partition heading
levels preserve the original nested command hierarchy, rather than flattening it and skipping levels.

No real messenger task was executed and no deployment was performed. The other worktrees are
preserved. Remaining full editorial passes are listed in the content plan.
