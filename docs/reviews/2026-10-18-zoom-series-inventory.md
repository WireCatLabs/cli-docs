# Scheduled-series discovery review

Readers can discover possible series, choose one and use preparation to verify its next occurrence
and gather context. Inventory preserves old/undated hints and unknown calendar completeness. It
opens no meeting database and creates no associations. The usage page owns the task; MCP explains
the separate remote-read grant, management links verification, and the app guide names the scopes.

## Plan and reviewed source

Review the released command/SDK contracts, read every changed EN/RU/ES section, keep commands and
anchors exact, then run translation/contracts/content gates and production rendering/live checks.
Do not replace the portal pin with an unpublished local source or accept a stale fingerprint.

Reviewed Zoom `v0.26.0`, source `a087a544cf5c203c0250238e9990016c601ffda1`, with registry
Core0.336.0/Base0.44.2 and one Base runtime identity. Eight native pages and sixteen RU/ES
translations changed: usage, MCP, search, remote meetings, Zoom app, roadmap, commands and changelog.
The shared Meetings task page was also reviewed in EN/RU/ES: it links bounded series discovery
and project suggestions, preserving the stored/provider ID distinction. No navigation, terminology,
homepage or non-documentation coverage change was needed. Existing
URLs and anchors remain; the new usage section retains its English anchor in both translations.

| Claim | Owning source / evidence |
| --- | --- |
| One bounded provider page, unknown calendar/occurrence proof | Core `src/meetings/series-inventory.ts`; Zoom `src/series-inventory.ts` |
| Strict windows, fields, cursor scope and envelopes | Core `src/cli/meeting-series-inventory-read.ts`, `src/mcp/meeting-series-inventory.ts` |
| Explicit native grant; fixed profile and cold credentials | Zoom `src/meeting-inventory.ts`, `src/meeting-mcp-command.ts`, `src/meeting-inventory.test.ts` |
| No SQLite on inventory path | Native test spy and `scripts/installed-inventory.mjs` |
| Parent scan reference is search `meeting`, not cue `ref` | Existing Core candidate input and Zoom candidate tests |
| Scope and verification distinction | Zoom inventory/upcoming adapters and installed proofs |

## Reader and language review

The reader gets candidates before selecting a series. The guide keeps discovery hints separate
from occurrence verification and preserves absolute continuation windows. Management no longer
claims occurrence-specific reads are unavailable; it links the existing preparation command.
The app table describes candidate series rather than promising a list of verified future calls.
Preparation and inventory have separate MCP grants. Raw provider IDs differ from stored IDs.

Russian and Spanish prose retain those distinctions, all resource ceilings and the unchanged
executable fences. The project scan uses the correct parent reference. The roadmap lists discovery
as available while reviewed brief assembly and broader explicitly granted research remain planned.
No automatic summary, attendance inference, label merge or task acceptance is claimed.

## Validation boundaries

Release run `39096825236` passed530 tests/66 files and all six installed Linux/Windows/macOS
Node22.16/24.19 proofs, including inventory CLI/MCP, strict arguments, offline refusal and no store.
The command matrix has267 tested cases, one existing interactive exception and zero missing;
coverage98.37% lines/93.46% branches and command baseline26 are unchanged in policy.
The actual npm/validated/publish tarballs match SHA-256
`9c14d03a0d7e6a84aa7a5cd9e05a484f381451f521b0d91f8dccc9dfb1a30d2f`; the annotated tag peels to the
captured source. The independent registry-only replay passes with zero external I/O attempts.
These synthetic checks do not establish a real account's permissions or archive completeness.

Translation structure passes before fingerprint acceptance. Installed command contracts, strict
content/reference checks, lint, unit tests and typecheck run for the portal PR. Deployment still
requires full export/link/SEO/browser gates, followed by changed live HTML and Markdown checks.
