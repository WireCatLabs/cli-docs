# Zoom 0.9.0 guides and meeting passages: release review

Reviewer: Codex root, 14 October 2026. Runtime source: published Zoom v0.9.0, with
cli-core 0.264.0 and cli-base 0.27.1. Only the Zoom reviewed pin changes.

Documentation-only Zoom PR68 restores three incoming anchors. The zoom-app, search and
topic-search guides use immutable source commit 0208fd42ba0c9f91fad6b015f9e5613bd1286190
through reviewed guideRefs. Its only guide changes are the three anchor elements; these pages
remain compatible with the published runtime. The actual released sources or these three
reviewed sources were reproduced through toPage and compared byte for byte with all 16 captured
Markdown sources before accepting locale fingerprints.

The reader path is setup → stored search → cited context → optional Memo notes and follow-ups.
Passage reads retained local lines. It neither contacts Zoom nor extracts/accepts decisions on its
own. Upcoming preparation remains agent work; a recurring series start is not a verified occurrence.

## Findings corrected in the native source

| Finding | Correction and evidence |
| --- | --- |
| Package README retained old login, automatic manifest scopes, no-secret and portal-launch claims | Correct setup to match the app guide, scope-free manifest, actual command tree and existing portal. Explain automatic indexing and store/archive coverage. |
| Evidence instructions used the retired `--after` CLI option | Use `--cursor`; current Commander registration and generated command reference agree. MCP's separate `after` argument is unchanged. |
| Semantic continuation used `nextCursor` | Use `next_cursor`, matching the Zoom-owned output conversion. |
| Semantic guide implied CLI search never builds stored vectors | Distinguish CLI build-before-search from MCP read-only ranking; `meeting-search-commands.ts`, `meeting-semantic.ts` and `mcp-server.ts`. |
| MCP guide counted the pre-consolidation tool set | Seven default tools, checked against the reviewed `contracts/mcp-tools.json` names and `buildServer`; context adds four optional tools. |
| Security guide claimed search indexing always needed approval | Describe automatic word indexing and semantic generation on CLI search, including explicitly selected remote transcript delivery; `meeting-search-commands.ts` and semantic adapter. |
| Remote-meeting guide implied the starter manifest included a scope | Listing needs the manually added scope; `docs/zoom-app.json` contains no scopes. |

## Page and locale review

Each row records source/prose review, including the opening, ending, terminology, examples and
material scope boundaries. Generated command rows record a generated-diff/contract review.
Link/HTML/Markdown export verification is recorded separately below; a locale structure gate alone
does not establish prose correctness.

| Page and locale | Reader task | Behavior evidence | Terms/opening and source review | Links and exports | Reviewer |
| --- | --- | --- | --- | --- | --- |
| index, en | Choose hosted data, VTT import or existing stored meetings | Native index and maintained locale overviews; available-data boundaries | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| index, ru | Choose hosted data, VTT import or existing stored meetings | Native index and maintained locale overviews; available-data boundaries | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| index, es | Choose hosted data, VTT import or existing stored meetings | Native index and maintained locale overviews; available-data boundaries | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| installation, en | Install, choose an existing/new app and finish the first login | Published command contract; config/login/keyring code and tests | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| installation, ru | Install, choose an existing/new app and finish the first login | Published command contract; config/login/keyring code and tests | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| installation, es | Install, choose an existing/new app and finish the first login | Published command contract; config/login/keyring code and tests | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| zoom-app, en | Create or reuse a user-managed public-client app; add manual scopes | Native app guide, starter manifest and required-scope errors | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| zoom-app, ru | Create or reuse a user-managed public-client app; add manual scopes | Native app guide, starter manifest and required-scope errors | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| zoom-app, es | Create or reuse a user-managed public-client app; add manual scopes | Native app guide, starter manifest and required-scope errors | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| sessions, en | Complete the callback; distinguish OAuth credentials and data profiles | Login/token/config tests; native session guide | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| sessions, ru | Complete the callback; distinguish OAuth credentials and data profiles | Login/token/config tests; native session guide | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| sessions, es | Complete the callback; distinguish OAuth credentials and data profiles | Login/token/config tests; native session guide | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| usage, en | Choose local reads, API operations and explicit writes | Published command tree and command reference | Reviewed | Export/link checks pass | Codex root |
| usage, ru | Choose local reads, API operations and explicit writes | Published command tree and command reference | Reviewed | Export/link checks pass | Codex root |
| usage, es | Choose local reads, API operations and explicit writes | Published command tree and command reference | Reviewed | Export/link checks pass | Codex root |
| archive, en | Retrieve/import text; verify/resume recordings and understand local speech limits | Native archive guide; synthetic archive/import/transcription tests; final file-limit change | Reviewed | Export/link checks pass | Codex root |
| archive, ru | Retrieve/import text; verify/resume recordings and understand local speech limits | Native archive guide; synthetic archive/import/transcription tests; final file-limit change | Reviewed | Export/link checks pass | Codex root |
| archive, es | Retrieve/import text; verify/resume recordings and understand local speech limits | Native archive guide; synthetic archive/import/transcription tests; final file-limit change | Reviewed | Export/link checks pass | Codex root |
| search, en | Resolve filters, read cited surrounding lines and hand off to Memo | Shared context tests; Zoom SQLite CLI/MCP tests; published command contract | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| search, ru | Resolve filters, read cited surrounding lines and hand off to Memo | Shared context tests; Zoom SQLite CLI/MCP tests; published command contract | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| search, es | Resolve filters, read cited surrounding lines and hand off to Memo | Shared context tests; Zoom SQLite CLI/MCP tests; published command contract | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| topic-search, en | Choose processing location; distinguish CLI generation from read-only MCP | Semantic adapter buildMissing loop; native semantic guide | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| topic-search, ru | Choose processing location; distinguish CLI generation from read-only MCP | Semantic adapter buildMissing loop; native semantic guide | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| topic-search, es | Choose processing location; distinguish CLI generation from read-only MCP | Semantic adapter buildMissing loop; native semantic guide | Reviewed | Export/link checks and affected browser coverage pass | Codex root |
| mcp, en | Install agent instructions or seven read-only defaults plus optional tools | Published default MCP contract; opt-in context tests; fixed account/model code | Reviewed | Export/link checks pass | Codex root |
| mcp, ru | Install agent instructions or seven read-only defaults plus optional tools | Published default MCP contract; opt-in context tests; fixed account/model code | Reviewed | Export/link checks pass | Codex root |
| mcp, es | Install agent instructions or seven read-only defaults plus optional tools | Published default MCP contract; opt-in context tests; fixed account/model code | Reviewed | Export/link checks pass | Codex root |
| remote-meetings, en | Inspect schedule/invitation and preview a remote change | Provider management adapter and tests; scopes and uncertain-outcome behavior | Reviewed | Export/link checks pass | Codex root |
| remote-meetings, ru | Inspect schedule/invitation and preview a remote change | Provider management adapter and tests; scopes and uncertain-outcome behavior | Reviewed | Export/link checks pass | Codex root |
| remote-meetings, es | Inspect schedule/invitation and preview a remote change | Provider management adapter and tests; scopes and uncertain-outcome behavior | Reviewed | Export/link checks pass | Codex root |
| commands, en | Find exact supported commands/options | Generated source diff and actual published offline discovery contract | Generated reference and changed syntax reviewed | Export/link checks pass | Codex root |
| commands, ru | Find exact supported commands/options | Generated source diff and actual published offline discovery contract | Generated reference and changed syntax reviewed | Export/link checks pass | Codex root |
| commands, es | Find exact supported commands/options | Generated source diff and actual published offline discovery contract | Generated reference and changed syntax reviewed | Export/link checks pass | Codex root |
| configuration, en | Find public config; keep credentials and data/profile paths distinct | Native config guide and config/token/store tests | Reviewed | Export/link checks pass | Codex root |
| configuration, ru | Find public config; keep credentials and data/profile paths distinct | Native config guide and config/token/store tests | Reviewed | Export/link checks pass | Codex root |
| configuration, es | Find public config; keep credentials and data/profile paths distinct | Native config guide and config/token/store tests | Reviewed | Export/link checks pass | Codex root |
| troubleshooting, en | Recover callback/scope/data/archive failures and verify recovery | Native recovery guide and corresponding synthetic tests | Reviewed | Export/link checks pass | Codex root |
| troubleshooting, ru | Recover callback/scope/data/archive failures and verify recovery | Native recovery guide and corresponding synthetic tests | Reviewed | Export/link checks pass | Codex root |
| troubleshooting, es | Recover callback/scope/data/archive failures and verify recovery | Native recovery guide and corresponding synthetic tests | Reviewed | Export/link checks pass | Codex root |
| security, en | Understand automatic indexing, remote text delivery and read-only MCP | Search/semantic adapters, token storage and native security guide | Reviewed | Export/link checks pass | Codex root |
| security, ru | Understand automatic indexing, remote text delivery and read-only MCP | Search/semantic adapters, token storage and native security guide | Reviewed | Export/link checks pass | Codex root |
| security, es | Understand automatic indexing, remote text delivery and read-only MCP | Search/semantic adapters, token storage and native security guide | Reviewed | Export/link checks pass | Codex root |
| changelog, en | Review 0.8/0.9 changes without rewriting published history | Actual released changelog; translated 0.9 notes and preserved earlier English history | Reviewed | Export/link checks pass | Codex root |
| changelog, ru | Review 0.8/0.9 changes without rewriting published history | Actual released changelog; translated 0.9 notes and preserved earlier English history | Reviewed | Export/link checks pass | Codex root |
| changelog, es | Review 0.8/0.9 changes without rewriting published history | Actual released changelog; translated 0.9 notes and preserved earlier English history | Reviewed | Export/link checks pass | Codex root |
| roadmap, en | Distinguish shipped source retrieval from dedicated intake/preparation plans | Native roadmap; Core issues 1000/1005; reviewed roadmap fingerprint | Reviewed | Export/link checks pass | Codex root |
| roadmap, ru | Distinguish shipped source retrieval from dedicated intake/preparation plans | Native roadmap; Core issues 1000/1005; reviewed roadmap fingerprint | Reviewed | Export/link checks pass | Codex root |
| roadmap, es | Distinguish shipped source retrieval from dedicated intake/preparation plans | Native roadmap; Core issues 1000/1005; reviewed roadmap fingerprint | Reviewed | Export/link checks pass | Codex root |
| Shared Meetings, en | Combine meeting sources, projects and people; prepare and retain findings | Published search/passage commands; native roadmap and meeting-management boundaries | Read in full; renamed search and cited passage examples; unverified recurrence stated | Existing zoom address; HTML/mobile/Markdown checks pass | Codex root |
| Shared Meetings, ru | Combine meeting sources, projects and people; prepare and retain findings | Published search/passage commands; native roadmap and meeting-management boundaries | Read in full; renamed search and cited passage examples; unverified recurrence stated | Existing zoom address; HTML/mobile/Markdown checks pass | Codex root |
| Shared Meetings, es | Combine meeting sources, projects and people; prepare and retain findings | Published search/passage commands; native roadmap and meeting-management boundaries | Read in full; renamed search and cited passage examples; unverified recurrence stated | Existing zoom address; HTML/mobile/Markdown checks pass | Codex root |

## Verification

- Zoom feature validation: 408 tests, 98.24% lines, typecheck, lint, native docs, external CLI/MCP
  contracts, retained-state upgrade contracts, no-leak checks and Bun pass. The later file-limit
  change also passes its 35 affected source tests and typecheck.
- Actual release 38496684440 succeeded; the same tarball passed Linux and Windows installation
  checks on Node22/24 before npm publication. The published CLI is installed locally.
- All 16 captured sources match their reviewed Git source. Thirty RU/ES source fingerprints
  accepted after prose review and matching heading structure, executable fences, inline literals
  and links. Overviews retain their maintained locale sources.
- Actual npm 0.9.0 discovery contract captured with network and keyring access blocked.
- Full sync, strict docs checks and release-note/roadmap checks pass: 1224 command-reference
  entries, zero reference gaps, zero invalid examples and no missing task destinations/families.
  Zoom has no unmapped families. Six Zoom syntax illustrations are config paths/completion
  placeholders, reviewed as notation. Other tools retain their reviewed pins and report scope.
- Full production export completed within the existing retry/time limits. All 24 affected EN/RU/ES
  browser cases pass, including mobile layouts, source Markdown, current commands, app setup and
  the three retained anchors. All cases retain 20% timeout headroom.
- All 300 unit tests, typecheck, source lint, search-bundle validation, export links/SEO and asset
  budgets pass. The project-scoped worktree exclusion fixes zero-file lint runs: 383 files checked.

## Delivery

Local release review is complete. Recheck incoming main changes before merging. CI/deployment
retain their full checks. After deployment, verify the public source search, setup, shared Meetings
and Markdown routes. No private account data is included here.
