# Zoom communications translation draft

This branch prepares RU/ES documentation for the unreleased host feature in Zoom PR156. It must
not merge or change a public release pin until the matching package is published and reviewed.

## Source and completed preparation

Base: portal main `41f941a7947d6e1d4b58b42cff93147f1ea41dd2`. Source capture uses Zoom
`3f39f6a16827310bbf11b9e997457b964e042045` with the documented full-SHA `--capture-only` workflow.
The reviewed runtime remains Zoom0.23.2. No `tools.json`, reviewed contract or translation
fingerprint has changed. Generated/public output is not committed.

Fourteen draft translations cover configuration, usage, MCP, roadmap, changelog, commands and security in
Russian and Spanish. All fourteen pass structural/inline-code/executable-fence checks against the
captured source. Fingerprints intentionally remain stale. Ordinary-language agent requests are
translated; literal commands, JSON examples, field names and existing incoming anchors remain.

## Required completion after publication

1. Finish the separate registry Core/Base adoption and feature delivery in Zoom. Capture the actual
   final released source, not this candidate snapshot.
2. The generated source flag label is now `<id=cursor>` in both translations, matching published
   Core 0.326.0. Recheck it against the final release contract.
3. The dated0.24.0 changelog includes Added, compatibility and actual registry dependency notes in
   both translations. Publication/tag verification is still required before accepting fingerprints.
4. Read every changed prose block in both locales again. Check explicit whole-account/folder scope,
   profile-local grants, requested-only metadata resolution, restart after revocation, literal-query
   and time bounds, incomplete indexes, citations, projection and frozen-window continuation.
5. Refresh exact npm contracts, record roadmap review and accept translation fingerprints only
   after that review. Then sync and run strict docs, relevant release/localization tests, types,
   applicable browser/export checks and full required CI. Preserve existing layout/home coverage.

No live account test, AI interpretation evaluation, final-release review or feature availability is
claimed by these draft checks. The release pin and already-published docs stay on their reviewed pair.

## Shared Meetings guide

The existing EN/RU/ES Meetings task pages now have draft prose describing explicit source grants,
separate cited statements, source coverage and read-only/index boundaries. Default/unselected
sources remain unqueried, and word matches do not confirm project membership or person identity.
No sidebar, page URL, incoming anchor, UI code or test budget changed.

## Page review before publication

| Page and locale | Reader task | Terms and opening | Behavior evidence | Links and exports | Result and reviewer |
| --- | --- | --- | --- | --- | --- |
| configuration, ru | Choose stored source accounts/folders | Profile and account remain distinct; whole-account scope explicit | Strict selected-profile grants, folder aliases, requested-only resolution and restart policy | Native command fence retained; source-selection anchor preserved | Prose read, Codex root; final release check pending |
| configuration, es | Choose stored source accounts/folders | Same scope and account identity boundaries | Same config/binding tests; no automatic source selection | Same command fence and incoming anchor | Prose read, Codex root; final release check pending |
| usage, ru | Add cited sources to a meeting brief | Ordinary-language request precedes terminal controls | Literal query, dates, limits, conflicts, index gaps and read-only operation match Core/host proofs | New prompt translated; executable fence retained; frozen window continuation explicit | Prose read, Codex root; final release check pending |
| usage, es | Add cited sources to a meeting brief | Same task/result and source boundaries | Same sources and coverage; no inferred membership or accepted decision | Same code, continuation and config links | Prose read, Codex root; final release check pending |
| mcp, ru | Let an agent use configured source IDs | Captured profile IDs and optional input explained | Input enum, raw validation, startup snapshot and source pin tests | JSON fence retained; time fields require zones | Prose read, Codex root; final release check pending |
| mcp, es | Let an agent use configured source IDs | Optional fields differ from optional timezone | Same permission/validation/lifecycle evidence | Same JSON and source/continuation links | Prose read, Codex root; final release check pending |
| roadmap, ru | Separate available context from future discovery | Selected sources available; unselected discovery remains planned | Current port versus reverse-project/calendar backlog | Existing anchors and Memo findings link retained | Full page read, Codex root |
| roadmap, es | Separate available context from future discovery | Same available/planned distinction | Same SDK/source boundaries | Same anchors and findings link | Full page read, Codex root |
| changelog, ru | Understand feature and compatibility | Read-only preparation and connector intent explained | Actual registry pair, source grants and publisher wait helper | New dated notes translated; earlier history untouched | New entries read, Codex root; tag pending |
| changelog, es | Understand feature and compatibility | Same migration/read-only and operator boundaries | Same actual source and helper | Same code tokens/version literals; history retained | New entries read, Codex root; tag pending |
| commands, ru | Discover the four communications flags | Descriptions explain query, scope and time | Generated Core 0.326 command tree | Literal source value label and defaults preserved | Generated delta read, Codex root |
| commands, es | Discover the four communications flags | Same roles and bounds | Same generated source | Same literal labels and defaults | Generated delta read, Codex root |
| security, ru | Choose the agent's readable data | Fixed-profile meeting reads distinguished from optional grants | Whole-account/folder authority, restart and read-only tests | Precise configuration link; existing revoke/MCP links retained | Full page read, Codex root |
| security, es | Choose the agent's readable data | Same explicit grants and AI-processing boundaries | Same capture/opener evidence | Same source and revocation links | Full page read, Codex root |
| Meetings, en | Prepare and review cross-source context | Existing task opening and evidence workflow retained | Optional explicit sources; conflicts are not accepted decisions | Existing address/anchors/commands; links to scope and continuation | Changed prose read, Codex root |
| Meetings, ru | Prepare and review cross-source context | Same distinctions; confirmed meeting/project link wording clarified | Same facts, source grants and review boundaries | Existing address/anchors/code and localized next actions | Changed prose read, Codex root |
| Meetings, es | Prepare and review cross-source context | Same actor, source and review vocabulary | Same evidence and incomplete-source behavior | Same address/anchors/code and next actions | Changed prose read, Codex root |

Spelling report: 46 flags across 17 files were inspected; they are technical identifiers, valid
inflected forms or retained historical text. New shared English prose uses plain “not searched”.
No spelling dictionary exception or validation gate was expanded. The report does not substitute
for final published contracts, runtime pins, browser/export checks or production verification.
