# User-task documentation refresh — 8 October 2026

## Review scope and base

The working branch is `fix/docs-tooling-main-20261008`. The existing onboarding/tooling work
was checkpointed at `b23c3e6`, and current main `f5ad67f` was incorporated in merge `60773a1`.
The merge retains main's About, search-architecture and archive-planning changes, plus both its
About browser check and this branch's documentation check. Original and other worktrees are
preserved. Port 3000 serves this branch; port 3001 remains the earlier meeting draft.

The shared Search guide is adapted from `6b0ad25` in
`docs/reviewed-guide-update-2026-10-08` / the final-guides work: it now starts with a normal-language
request, states the expected result and keeps terminal examples expandable. The earlier meeting
page from PR #64 is superseded here by the homepage-backed Demo. Unrelated guides, styling and
About variants from that work were not imported wholesale. The separate `cli-docs-guides`
worktree is reviewing MAX v0.34.0 / TG v0.35.0 pins; this branch retains the reviewed versions below.

## Reader-facing changes

- Demo has a video-camera sidebar icon and three scenarios: meeting context, inbox and
  recommendations. Each reuses the homepage's messages, commands, responses and source evidence
  in EN/RU/ES for Telegram and MAX. Prepared messages wait for Send; commands animate before
  the answer. Switching scenario or messenger starts a fresh conversation. Markdown includes
  all three scenarios for both messengers.
- First tasks is shortened to ordinary requests, expected results and useful follow-ups.
  Search and drafting no longer require reading command sequences, chat IDs or JSON. Sending
  remains a separate request after reviewing a draft. Existing incoming anchors are retained.
- Search provides a specific request, result checks, incomplete-history recovery, optional
  terminal syntax and links to the existing query/topic references. Its sidebar entry and
  inbound link from First tasks make the guide reachable.
- People starts with the reader's situation and a request to the agent, then distinguishes
  the two reviewed releases. Unsupported Telegram profile/check/scoped-context examples and
  claims of identical commands are removed.
- Browser-app startup commands use only supported HTTP options. The permission section describes
  the reviewed releases' mandatory server confirmation for HTTP writes and separates drafts
  from sending. Existing platform tabs and connection instructions remain available.

## Release evidence

Current pins: Telegram v0.28.0 and MAX v0.29.0. Exact isolated npm contracts are recorded in
`.docs-tooling/contracts/tg.json` and `max.json`; no account state or live messenger action is used.

- TG contacts: `show` and `context --since-time/--limit` are available; `profile`, `check`,
  and `context --chat` are absent. Evidence: the command contract and the released
  `@wirecat/cli-messaging/dist/cli/messenger/contacts-command.js` /
  `dist/mcp/tools/contacts.js`.
- MAX contacts: `profile`, `check` and scoped context are available in its contract.
- Both HTTP servers force confirmation with `OVER_HTTP = { confirmSend: true, yes: false,
  allowDangerous: false }` in the pinned `dist/mcp/server.js`. Their contracts have no
  `--http-confirmation` / process `--permission` options used by the previous guide.
- The Demo's 87 rendered command occurrences were checked against these contracts. Strict
  validation now includes those source fixtures automatically, using the same scenario-ID list
  as the component. Source results are illustrative, not live CLI captures.

## Verification

- Refreshed contracts: 748 reference entries, zero gaps, zero invalid examples. Strict checks pass.
- 105 generic/glob examples still need manual review; this report does not count them as validated.
- Localization, Markdown lint, code lint, TypeScript, search-bundle checks and 217 unit tests pass.
- Production export builds 362 routes; HTML/Markdown links and SEO checks pass.
- All 54 CI browser checks pass, including EN/RU/ES scenario switching, the video icon, mobile
  layout, accessibility, Markdown exports, browser setup, existing onboarding and About.

Review-ready local changes are not a deployment. Live messenger/browser-provider end-to-end
checks and the newer release-pin review are separate work.
