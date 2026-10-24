# Drive 0.28.0 release documentation review

Readers can download a file, export a Google document, connect a local mirror, resolve a conflict and
configure an MCP agent using the published command contract in English, Russian and Spanish.
Reviewer: Codex. The runtime pin is `v0.28.0`, with exact cli-core 0.406.0.

## Sources and behavior

- [Published release](https://github.com/WireCatLabs/drive-cli/releases/tag/v0.28.0) and
  [successful release validation](https://github.com/WireCatLabs/drive-cli/actions/runs/40102720586).
- [Guide corrections](https://github.com/WireCatLabs/drive-cli/commit/95e35b4af8e6a280f9769feeff95899c6c0fb4b1)
  are included in the native 0.28.0 tag. No guide overrides are needed.
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
| changelog | See released compatibility changes | Added native 0.26/0.27/0.28 release sections under existing localized technical framing. |

Search and scenarios use the canonical `models download` spelling from 0.28.0; the old spelling has no alias.
Unchanged index and installation retain their previously reviewed translations.
No release claims were inferred from translated headings or fingerprint agreement alone.

## Checks and publication boundary

The initial 0.27 update passed full [CI export, browser and Windows validation](https://github.com/WireCatLabs/cli-docs/actions/runs/40107661263).
Local browser startup timed out before assertions; the successful CI run supplies rendered verification.
The 0.28 update recaptures exact released contracts and reruns strict documentation, translation,
release-note, lint, type and editorial checks, followed by full CI before merge.

The historical MAX 0.38.1 namespace hold in `docs/release-hold.json` is resolved. It was not enforced by
publication code; [current main already deployed successfully](https://github.com/WireCatLabs/cli-docs/actions/runs/40109267730).
Current reviewed MAX/TG releases have the required namespace. Normal contract, translation and CI
gates apply to this release. Drive 0.28.0 is already published; merging this review deploys the portal.
