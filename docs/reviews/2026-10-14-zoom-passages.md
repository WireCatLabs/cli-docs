# Zoom transcript passages: release review in progress

Reviewer: Codex root. Native candidate: `WireCatLabs/zoom-cli` PR 65, commit
`a966a54`. This is preparation for a future Zoom release, not a reviewed release update.
The portal still pins Zoom 0.7.3. Do not merge this preparation until the checks below are complete.

The reader path is installation → app permissions → saved meeting search → a cited window around
a result → optional Memo notes and follow-ups. The window reads retained local transcript lines;
it neither queries Zoom nor extracts decisions automatically. Existing URLs and English anchors
remain unchanged in all locales.

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

## Page review

These rows record candidate-source review. Published-source and exported-page verification remain
pending for every row. Code/example parity against the candidate native guides passes for all
non-generated guide translations. A fingerprint has not been accepted for an unreleased source.

| Page and locales | Reader task and review | Evidence | Remaining |
| --- | --- | --- | --- |
| `installation`, ru/es | Read in full: choose an existing or new app, finish callback, import a first meeting | Native installation and session guides; `login.ts`, `tokens.ts`, config commands | Released contract and exports |
| `zoom-app`, ru/es | Read in full: Public Client ID, redirect, manual scopes, file alternative | Native app guide and scope-free starter manifest | Released source, links and exports |
| `sessions`, ru/es | Read in full: cached versus remote status, callback, data profile versus OAuth account | Native sessions guide; account and keyring boundaries | Released contract and exports |
| `usage`, ru/es | Read in full: choose local versus remote work; current command names | Native usage and command tree | Released command reference and exports |
| `search`, ru/es | Read in full: people/project filters, canonical refs, bounded context, Memo boundaries | Shared passage service tests; Zoom CLI/MCP SQLite tests; native search guide | Released contract and exports |
| `topic-search`, ru/es | Read in full: local/remote processing, automatic CLI generation, read-only MCP | Native semantic guide and semantic search adapter | Released contract and exports |
| `mcp`, ru/es | Read in full: installation, seven defaults, opt-in tools, fixed account/model | Native MCP guide and seven-name contract fixture | Released contract and exports |
| `remote-meetings`, ru/es | Read in full: list/details, manual permissions, preview and uncertain outcome | Native remote guide and starter manifest | Released contract and exports |
| `configuration`, ru/es | Read in full: public configuration versus keyring and data profiles | Native config guide; unchanged public config keys | Released contract and exports |
| `archive`, ru/es | Read in full: sync/import renames, source coverage, archive search and local speech limits | Native archive guide; synthetic archive/import tests | Released contract and exports |
| `troubleshooting`, ru/es | Read in full: callback recovery, permissions, missing text, current command names | Native recovery guide and synthetic login tests | Released contract and exports |
| `security`, ru/es | Read in full: automatic search versus preview/apply, explicit remote transcript processing, MCP read-only limits | Native security guide, search command and semantic adapter | Released contract and exports |
| `roadmap`, ru/es | Read in full; dedicated intake and preparation remain planned | Native roadmap and core issues 1000/1005 | Released source and exports |
| `commands`, ru/es | Generated from native command reference with translated surrounding headings | Shared generator and native command tree | Regenerate from final release, inspect diff, release contract |
| `changelog`, ru/es | Prior published history preserved | Native immutable changelog | 0.8 history added in English following the existing convention; final release entry still pending |

## Completion checks

- Wait for the published shared-core version with the cli-base 0.27 peer; adopt it in Zoom and
  complete Zoom PR 65, release validation and publication.
- Pin only the actual new Zoom release in `tools.json`; capture its native sources. Preserve
  other tools' reviewed pins and history.
- Finish the changed release notes, generated command translations, remaining full reads and
  source fingerprints against that captured release.
- Refresh reviewed command contracts; run localization, release-note review, strict documentation
  checks, scoped lint, build/export and affected HTML/Markdown route checks.
- Record actual results and remaining limitations here before marking the documentation ready.

Native candidate verification already completed: 408 tests pass, including real synthetic SQLite
CLI/MCP passage reads, account isolation, historical references, cancellation and byte budgets.
Native `docs:check` passes after the corrections above. Those results do not certify a publication
or the portal's final exported pages.
