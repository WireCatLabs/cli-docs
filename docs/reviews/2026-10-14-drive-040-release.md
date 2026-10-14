# Drive release documentation review

Readers can install the released CLI, import selected sources, browse their saved folder tree,
find metadata without Google, and keep folder tags, memos and links beside those sources.
This update uses Drive v0.4.0 (8fc6842), with registry Core 0.265.0 and base 0.27.1.
Configuration/search prose uses reviewed immutable guide commit
29791bd2bdb0dc46f3dc8244c5ccec17b4261b16; the runtime stays v0.4.0.

## Source and reader findings

- Old guides said PDF/Sheets/Office files and folder trees were unavailable. Updated them from
  native released guides and the published command contract; catalog metadata and indexed text
  remain distinct. Pending/unreadable sources do not acquire invented passages.
- Folder tags apply to the folder; references reuse shared documents. Ordinary content removal
  differs from catalog retirement. Snapshots are retained; image vectors can discard image bytes.
- Updated old links/people/schema command names and paging flags. Task mappings now use
  catalog, relationships, identities and facts; schemas are under api.
- Replaced an image-setup instruction requiring an unpublished TG command pairing with an
  agent request using the public installed SDK. Verified the SDK's model command API lists
  clip-b32 in isolated state without account access or model downloads. Real model installation
  and inference were not measured by that check.
- Followed MAX's corresponding task-page pattern: outcome before syntax, optional agent request,
  observable result, then technical reference. Drive account commands retain explicit profiles.
- Native command descriptions and technical release notes retain source English on RU/ES
  reference pages, with a clear notice. Task guides are translated. This is a deliberate reference
  language boundary, not a claim of translated technical descriptions.

## Page and locale review

| Page and locale | Reader task | Review result |
| --- | --- | --- |
| index, en | Choose a first Drive task; cached tree and metadata | Reviewed; task and action boundaries preserved |
| index, ru | Choose a first Drive task; cached tree and metadata | Reviewed; task and action boundaries preserved |
| index, es | Choose a first Drive task; cached tree and metadata | Reviewed; task and action boundaries preserved |
| installation, en | npm installation, shared OAuth and custom-client fallback | Reviewed; task and action boundaries preserved |
| installation, ru | npm installation, shared OAuth and custom-client fallback | Reviewed; task and action boundaries preserved |
| installation, es | npm installation, shared OAuth and custom-client fallback | Reviewed; task and action boundaries preserved |
| usage, en | Import, browse metadata/tree, annotate folders and manage snapshots | Reviewed; task and action boundaries preserved |
| usage, ru | Import, browse metadata/tree, annotate folders and manage snapshots | Reviewed; task and action boundaries preserved |
| usage, es | Import, browse metadata/tree, annotate folders and manage snapshots | Reviewed; task and action boundaries preserved |
| recipes, en | Offline brief, metadata, folder memo/tag and source links | Reviewed; task and action boundaries preserved |
| recipes, ru | Offline brief, metadata, folder memo/tag and source links | Reviewed; task and action boundaries preserved |
| recipes, es | Offline brief, metadata, folder memo/tag and source links | Reviewed; task and action boundaries preserved |
| search, en | Text, names-only results and optional local image retrieval | Reviewed; task and action boundaries preserved |
| search, ru | Text, names-only results and optional local image retrieval | Reviewed; task and action boundaries preserved |
| search, es | Text, names-only results and optional local image retrieval | Reviewed; task and action boundaries preserved |
| configuration, en | Saved settings, environment, command flags and model setup | Reviewed; task and action boundaries preserved |
| configuration, ru | Saved settings, environment, command flags and model setup | Reviewed; task and action boundaries preserved |
| configuration, es | Saved settings, environment, command flags and model setup | Reviewed; task and action boundaries preserved |
| troubleshooting, en | Recover connection/import/read failures | Reviewed; task and action boundaries preserved |
| troubleshooting, ru | Recover connection/import/read failures | Reviewed; task and action boundaries preserved |
| troubleshooting, es | Recover connection/import/read failures | Reviewed; task and action boundaries preserved |
| security, en | Local copies, OAuth grants, optional AI and explicit writes | Reviewed; task and action boundaries preserved |
| security, ru | Local copies, OAuth grants, optional AI and explicit writes | Reviewed; task and action boundaries preserved |
| security, es | Local copies, OAuth grants, optional AI and explicit writes | Reviewed; task and action boundaries preserved |
| commands, en | Generated exact syntax and permissions | Reviewed; task and action boundaries preserved |
| commands, ru | Generated exact syntax and permissions | Source technical descriptions retained with language notice |
| commands, es | Generated exact syntax and permissions | Source technical descriptions retained with language notice |
| changelog, en | Current release facts and historical changes | Reviewed; task and action boundaries preserved |
| changelog, ru | Current release facts and historical changes | Source technical descriptions retained with language notice |
| changelog, es | Current release facts and historical changes | Source technical descriptions retained with language notice |

## Evidence

Drive release workflow 38498940380 passed full validation. Combined candidate: 158 unit tests,
89.76% line coverage, eight CLI/MCP contracts, five previous-store upgrades, leak checks and
Node/Bun installed-package smoke. The separate cli-testing catalog runner passed 19 operations
against an actual npm-installed Drive 0.4.0 with synthetic profiles and guarded network/keyring.
No owner account or database was opened.

Portal contracts were recaptured from exact npm releases with network disabled during discovery.
Strict reference/example/task validation has zero gaps, invalid examples or missing task families;
126 syntax illustrations elsewhere remain manual-review entries, not validated invocations.
300 unit tests and seven browser smoke cases passed. Targeted Drive route/Markdown checks are
recorded in the PR once complete; full export, links, SEO and browser suites remain CI gates.
