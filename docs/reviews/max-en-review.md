# MAX documentation: English translation review

Reviewed the full released MAX v0.23.0 documentation. Durable English translations cover all 16 non-overview pages; overview belongs to the portal's shared entry-page work.

## Translation checks

- Every heading's depth and position preserved, permitting stable original-anchor aliases.
- Fenced examples preserved byte-for-byte, including Russian names, comments and sample conversations. They intentionally remain upstream examples rather than executable examples rewritten during translation.
- Distinct inline-code values and all link destinations preserved. Link labels use readable topic names.
- Every release section and its safety/compatibility information retained. Earlier releases describe their historical behavior, including old option names and old bot MCP defaults; current guides use v0.23.0 behavior.
- Current MCP bot access differs materially from personal MCP: bot profile permissions control writes, legacy allow flags only warn, deletion asks by default. Translations explicitly retain this distinction.

## Content issues identified

1. Upstream groups/recipes describe Cursor as lacking a terminal. Cursor can support terminal access. English wording now presents MCP as a connection option without claiming the product lacks a terminal.
2. Installation is a detailed terminal reference, so it retains Node/Bun requirements and source-build instructions. Shared portal onboarding should remain the simple platform-first, agent-or-terminal entry point rather than pointing new visitors directly at this technical page.
3. Upstream remote access includes time-sensitive plan/region availability and states that the complete proxy/tunnel setup has not been tested. Translation preserves that status and the source's availability claims; these deserve periodic review against the linked vendors' documentation.
4. Personal account polling and browser emulation have account-risk limitations. The security guide retains the upstream terms-of-service warning and source legal references; the personal/household explanation is attributed to the source documentation rather than presented as a new legal determination.
5. Security's original blanket statement that every file is 0600 conflicts with the same page's 0644 configuration-file row. English specifies sensitive files while retaining the explicit table permissions.
6. Security's cache-deletion discussion can confuse shared messages.db with obsolete profile cache. English makes their separate locations explicit without claiming session logout clears either store.
7. Changelog historical restrictions, including statements about the old cache and old MCP write flags, should remain clearly historical. Current entry pages should not use release notes as onboarding.
8. Recipes currently demonstrate Codex danger-full-access for local scheduled commands; the permission limitations remain documented. A future dedicated scheduling guide could offer a narrower OS user/wrapper setup without altering executable release examples during translation.

## Spanish continuation and latest-release consistency

Also completed Spanish translations for bot, groups, archive, configuration, troubleshooting, remote, recipes and diagnostics against v0.23.0, preserving the same structures and executable examples. Parser-based structural checks pass for all eight.

The v0.23.0 groups page still contains the inline example `max <бот> bot chats check`, despite the bot guide and changelog renaming bot checks to `chats moderate`. This upstream literal is retained to preserve executable/reference invariants; the main current bot guide uses the new command. It should be corrected upstream and resynced.

The usage section describes scheduled-send limits as checked during queue insertion, while the security/MCP sections describe accounting in the actual send hour. Both upstream facts remain in translation; reconcile the implementation documentation upstream before presenting a single simplified explanation.

Portal corrections now address the listed search/read-marking/consent/permissions/command-name issues where applicable. MAX scheduled-send wording was reconciled with v0.23 client.ts and send-guards.test.ts: checking happens at queuing, accounting uses the scheduled send hour. Remaining remote-access availability/setup is explicitly unverified.
