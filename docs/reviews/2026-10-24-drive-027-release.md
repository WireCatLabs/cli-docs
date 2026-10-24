# Drive 0.27.0 release documentation review

Readers can download a file, export a Google document, connect a local mirror, resolve a conflict and
configure an MCP agent using the published command contract in English, Russian and Spanish.
Reviewer: Codex. The runtime pin is `v0.27.0`, with exact cli-core 0.405.0.

## Sources and behavior

- [Published release](https://github.com/WireCatLabs/drive-cli/releases/tag/v0.27.0) and
  [successful release validation](https://github.com/WireCatLabs/drive-cli/actions/runs/40102720586).
- [Immutable guide corrections](https://github.com/WireCatLabs/drive-cli/commit/95e35b4af8e6a280f9769feeff95899c6c0fb4b1)
  correct roadmap, usage contract number and the watcher comparison. Only these three pages use
  `guideRefs`; their runtime claims are available in 0.27.0.
- [Runtime and live evidence](https://github.com/WireCatLabs/cli-testing/tree/main/performance/documents/drive-command-contracts):
  synthetic policy, overwrite and binary transport tests; isolated package acceptance; approved live
  download/PDF/DOCX checks. Live observations certify byte output, not layout fidelity.
- `docs:contracts` captured the exact npm command tree with network/keyring sockets blocked.
  The generated technical reference and changelog retain English technical descriptions under their
  existing localized framing. No generated command facts were edited.

## Reader paths reviewed

Each row covers EN/RU/ES. Existing executable examples, original anchors and destinations are
preserved; new code blocks and literals match the captured source. Changed prose, opening/ending
context, source capability boundaries and translated terminology were reviewed.

| Page | Reader result | Behavior and terminology review |
| --- | --- | --- |
| mirrors | Connect folders and choose a conflict side | Mirror defined as a local/Google pairing; Markdown/CSV/TSV return path, XLSX limitation, suggestions, deletion and replace boundaries preserved. New sidebar icon and useful description in each locale. |
| usage | Download/export without importing | Explicit profile, local file write, overwrite flag, bounds and unsupported Vids; existing offline Markdown export remains distinct. Discovery contract is 4. |
| configuration | Set supported limits | Removed read_only/readOnly settings rejected; replacements are command permissions and process flags; examples use real current settings. |
| recipes | Start MCP and choose permissions | Plain MCP startup, optional read-only, snake_case inputs, saved mcp.authority and fixed profile export folder. Agent cannot grant itself authority. |
| compare | Choose an integration | Claude's separate Workspace editors described with official source; rclone sign-in partial; native export supported; watch partial because automatic startup service is still planned. |
| security | Find shared and Drive-specific protections | Added shared security link with locale-aware rendering; retained Google OAuth versus local command permission distinction. |
| roadmap | Distinguish shipped work from plans | Mirroring guide, download/export and comments moved to current capabilities. Watch while running is shipped; automatic startup service remains planned. |
| commands | Find exact flags and effects | Refreshed generated additions, including watch and comment actions; original CLI flags and examples retained. |
| changelog | See released compatibility changes | Added native 0.26/0.27 release sections under existing localized technical framing. |

Unchanged index, installation, search and scenarios retain their previously reviewed translations.
No release claims were inferred from translated headings or fingerprint agreement alone.

## Checks and publication boundary

Passed locally: lint (three existing warnings), search bundle freshness, all five exact released CLI
contract captures, strict documentation checks (zero reference gaps and invalid examples), release-note
and roadmap validation, targeted release/editorial tests and typecheck. Translation validation passes
for all eighteen changed RU/ES pages. Browser smoke and the Drive reader suite were attempted locally. The default Turbopack readiness
check timed out before any case ran; a diagnostic Webpack server also timed out on the Markdown
readiness request. No browser assertions have passed locally. Full CI export/browser validation
is requested on the draft branch; the PR records this limit rather than claiming rendered verification.

`docs/release-hold.json` is an existing production-deployment hold for a broader MAX/TG release review.
This change does not lift it. The CLI package is already published; the documentation update remains
reviewable without claiming that the public portal has deployed it.
