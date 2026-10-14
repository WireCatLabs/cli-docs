# Zoom preparation release review

Reviewer: Codex root. Reader task: prepare for an upcoming selected series, recognize missing
context, and continue to cross-source investigation without silently saving findings.

## Plan and evidence

1. Keep the portal pinned to 0.13 until 0.14 is published and its tag/tarball can be verified.
2. Native feature PR89 merged 587fe8a; Core 0.280 and Base 0.30 vocabulary are published.
   The runtime stays Base 0.28.2; the newer Base alias is development-only.
3. Native full validation 38644001619 passed 451 cases, statement coverage 97.24%, contracts,
   upgrades, no-leak and four installed Linux/Windows Node22/24 jobs. The final release repeats
   validation on main in 38644930952. Publication is still pending while this review is drafted.
4. Review source-owned guides and corresponding RU/ES text, regenerate command references,
   preserve URLs/anchors and exact executable literals. Capture final immutable source and all
   five reviewed command contracts before the strict publication checks.
5. Check the frozen export, affected HTML/Markdown reader paths and timing budgets, then PR CI,
   deployment and live routes. Do not increase timeouts or publish a preview as released behavior.

The native SDK keeps source/account/byte bounds and closes before output. Upcoming proof is not
complete calendar coverage or predicted attendance. Missing transcript import, fact acceptance,
summary generation and task creation remain separate explicit actions. Shared Meetings describes
agent-led wider investigation; the native preparation command marks person/project/alias context
beyond its selected-series sources unqueried.

## Reader and locale review

| Page | Locale | Reader path and material claims checked |
| --- | --- | --- |
| usage | en | Prepare a selected series; provider ID versus stored ID, seven/thirty-day windows, citations, bounded reads and explicitly unqueried broader context. |
| usage | ru | Prepare a selected series; provider ID versus stored ID, seven/thirty-day windows, citations, bounded reads and explicitly unqueried broader context. |
| usage | es | Prepare a selected series; provider ID versus stored ID, seven/thirty-day windows, citations, bounded reads and explicitly unqueried broader context. |
| mcp | en | Opt-in meeting_prepare, server-fixed account, strict snake_case arguments, remote-read permission and offline refusal. |
| mcp | ru | Opt-in meeting_prepare, server-fixed account, strict snake_case arguments, remote-read permission and offline refusal. |
| mcp | es | Opt-in meeting_prepare, server-fixed account, strict snake_case arguments, remote-read permission and offline refusal. |
| zoom-app | en | Existing/new app choices stay intact; preparation uses optional meeting:read:meeting; public client setting is snake_case. |
| zoom-app | ru | Existing/new app choices stay intact; preparation uses optional meeting:read:meeting; public client setting is snake_case. |
| zoom-app | es | Existing/new app choices stay intact; preparation uses optional meeting:read:meeting; public client setting is snake_case. |
| installation | en | Install current package, choose/reuse an app and configure zoom.client_id; no downloaded credentials file or client secret is implied. |
| installation | ru | Install current package, choose/reuse an app and configure zoom.client_id; no downloaded credentials file or client secret is implied. |
| installation | es | Install current package, choose/reuse an app and configure zoom.client_id; no downloaded credentials file or client secret is implied. |
| sessions | en | Browser approval/callback recovery retained; canonical zoom.client_id spelling and keyring-only session storage. |
| sessions | ru | Browser approval/callback recovery retained; canonical zoom.client_id spelling and keyring-only session storage. |
| sessions | es | Browser approval/callback recovery retained; canonical zoom.client_id spelling and keyring-only session storage. |
| configuration | en | Canonical snake_case setting/file names, accepted legacy spellings and separate local profile versus authenticated account. |
| configuration | ru | Canonical snake_case setting/file names, accepted legacy spellings and separate local profile versus authenticated account. |
| configuration | es | Canonical snake_case setting/file names, accepted legacy spellings and separate local profile versus authenticated account. |
| archive | en | Selected profile required for downloads/sync; verified-file cache, dead local lock takeover, separate archive search and transcript-only asset/byte controls. |
| archive | ru | Selected profile required for downloads/sync; verified-file cache, dead local lock takeover, separate archive search and transcript-only asset/byte controls. |
| archive | es | Selected profile required for downloads/sync; verified-file cache, dead local lock takeover, separate archive search and transcript-only asset/byte controls. |
| search | en | Separate search recordings shape; participant/project filters, citations and existing project-name discovery remain distinct. |
| search | ru | Separate search recordings shape; participant/project filters, citations and existing project-name discovery remain distinct. |
| search | es | Separate search recordings shape; participant/project filters, citations and existing project-name discovery remain distinct. |
| commands | en | Regenerated native command tree, exact flags/arguments, optional preparation and separate recording search; localized reference framing preserved. |
| commands | ru | Regenerated native command tree, exact flags/arguments, optional preparation and separate recording search; localized reference framing preserved. |
| commands | es | Regenerated native command tree, exact flags/arguments, optional preparation and separate recording search; localized reference framing preserved. |
| changelog | en | Preparation plus inherited JSON projection, config/search/SDK breaking changes and archive fixes, dated 15 October; older history retained. |
| changelog | ru | Preparation plus inherited JSON projection, config/search/SDK breaking changes and archive fixes, dated 15 October; older history retained. |
| changelog | es | Preparation plus inherited JSON projection, config/search/SDK breaking changes and archive fixes, dated 15 October; older history retained. |
| roadmap | en | Selected-series preparation is delivered; broader person/project/alias enrichment and reviewed intake remain planned. |
| roadmap | ru | Selected-series preparation is delivered; broader person/project/alias enrichment and reviewed intake remain planned. |
| roadmap | es | Selected-series preparation is delivered; broader person/project/alias enrichment and reviewed intake remain planned. |
| zoom | en | Shared Meetings keeps its address, combines sources through the agent and links the narrower selected-series command without promising wider automatic context. |
| zoom | ru | Shared Meetings keeps its address, combines sources through the agent and links the narrower selected-series command without promising wider automatic context. |
| zoom | es | Shared Meetings keeps its address, combines sources through the agent and links the narrower selected-series command without promising wider automatic context. |

Corrections made during review: removed the stale claim that archive search takes only full JSON;
retained the new search-recordings hit shape and projection. Restricted asset selectors/large-file
controls to transcript reads. Stated the profile requirement for recording writes. Changed Spanish
archive “integrity” to whether all history is present, preserving the completeness/integrity distinction.
Updated inherited camelCase examples to the supported canonical setting spelling while explaining
legacy reads in configuration. Kept automatic intake and broader preparation in the roadmap.

## Checks and remaining gates

All 22 changed localized guide structures pass, preserving code fences, inline literals, links and
heading structure. Preview fingerprints were accepted after prose/source review; final fingerprints
must match the published release. Browser regressions now check preparation anchors, scope links,
example, proof fields, limits and Markdown in EN/RU/ES, plus canonical install settings.

The first local development-server browser run timed out during initial route compilation at the
existing 60-second startup budget; no page tests ran. Budgets and assertions were retained. A frozen
preview export is being built for the next browser attempt. Exact release contracts, strict docs,
release/roadmap record, final export/browser checks, PR/deploy and live verification remain pending.
