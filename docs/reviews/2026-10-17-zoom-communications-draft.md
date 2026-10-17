# Zoom 0.24 documentation review

This update documents published Zoom 0.24.0 for readers who want cited context from explicitly
selected messages, mail and document folders while preparing a meeting. It changes seven native
guide/reference families in Russian and Spanish and the shared Meetings page in EN/RU/ES.

## Reviewed source and release

Portal base: `622b2916c60d167b0b90100eddc841fb2cfbcf20`. Source/tag: Zoom
`5a891e9ff71250963a278c83558a513ef00ff15d`, `v0.24.0`, actual registry
Core 0.332.0/Base 0.43.2, one Base identity. Release
[39078749960](https://github.com/WireCatLabs/zoom-cli/actions/runs/39078749960) passed source
validation and all four Linux/Windows Node 22.16/24.19 installed proofs. The npm tarball's
SHA-256 is `e5237af71260f3160a72126ea3293469a6123b219046dbcd9b94e38420be523a`.

Fourteen translations pass structure, literal code and executable-fence checks against the final
source. Every changed prose block was read before accepting its fingerprint. Reader prompts are
translated; literal commands, JSON, field names and incoming anchors are retained. Reviewed
contracts were captured from all five exact pinned npm packages with network disabled during
CLI discovery. Other tools' release pins are preserved.

Local checks: 20 focused localization/release/discovery cases, matching release notes/roadmap,
strict docs (1,384 references, zero gaps, zero invalid examples; 144 unchanged manual-syntax
examples), types and three localized Zoom browser navigation cases. Deployment still runs the full export, link, SEO and browser gates.

## Shared Meetings guide

The existing EN/RU/ES Meetings task pages explain explicit source grants,
separate cited statements, source coverage and read-only/index boundaries. Default/unselected
sources remain unqueried, and word matches do not confirm project membership or person identity.
No sidebar, page URL, incoming anchor, UI code or test budget changed.

## Page review before publication

| Page and locale | Reader task | Terms and opening | Behavior evidence | Links and exports | Result and reviewer |
| --- | --- | --- | --- | --- | --- |
| configuration, ru | Choose stored source accounts/folders | Profile and account remain distinct; whole-account scope explicit | Strict selected-profile grants, folder aliases, requested-only resolution and restart policy | Native command fence retained; source-selection anchor preserved | Prose read, Codex root; published source verified |
| configuration, es | Choose stored source accounts/folders | Same scope and account identity boundaries | Same config/binding tests; no automatic source selection | Same command fence and incoming anchor | Prose read, Codex root; published source verified |
| usage, ru | Add cited sources to a meeting brief | Ordinary-language request precedes terminal controls | Literal query, dates, limits, conflicts, index gaps and read-only operation match Core/host proofs | New prompt translated; executable fence retained; frozen window continuation explicit | Prose read, Codex root; published source verified |
| usage, es | Add cited sources to a meeting brief | Same task/result and source boundaries | Same sources and coverage; no inferred membership or accepted decision | Same code, continuation and config links | Prose read, Codex root; published source verified |
| mcp, ru | Let an agent use configured source IDs | Captured profile IDs and optional input explained | Input enum, raw validation, startup snapshot and source pin tests | JSON fence retained; time fields require zones | Prose read, Codex root; published source verified |
| mcp, es | Let an agent use configured source IDs | Optional fields differ from optional timezone | Same permission/validation/lifecycle evidence | Same JSON and source/continuation links | Prose read, Codex root; published source verified |
| roadmap, ru | Separate available context from future discovery | Selected sources available; unselected discovery remains planned | Current port versus reverse-project/calendar backlog | Existing anchors and Memo findings link retained | Full page read, Codex root |
| roadmap, es | Separate available context from future discovery | Same available/planned distinction | Same SDK/source boundaries | Same anchors and findings link | Full page read, Codex root |
| changelog, ru | Understand feature and compatibility | Read-only preparation and connector intent explained | Actual registry pair, source grants and publisher wait helper | New dated notes translated; earlier history untouched | New entries read, Codex root; tag/npm verified |
| changelog, es | Understand feature and compatibility | Same migration/read-only and operator boundaries | Same actual source and helper | Same code tokens/version literals; history retained | New entries read, Codex root; tag/npm verified |
| commands, ru | Discover the four communications flags | Descriptions explain query, scope and time | Generated Core 0.332 command tree | Literal source value label and defaults preserved | Generated delta read, Codex root |
| commands, es | Discover the four communications flags | Same roles and bounds | Same generated source | Same literal labels and defaults | Generated delta read, Codex root |
| security, ru | Choose the agent's readable data | Fixed-profile meeting reads distinguished from optional grants | Whole-account/folder authority, restart and read-only tests | Precise configuration link; existing revoke/MCP links retained | Full page read, Codex root |
| security, es | Choose the agent's readable data | Same explicit grants and AI-processing boundaries | Same capture/opener evidence | Same source and revocation links | Full page read, Codex root |
| Meetings, en | Prepare and review cross-source context | Existing task opening and evidence workflow retained | Optional explicit sources; conflicts are not accepted decisions | Existing address/anchors/commands; links to scope and continuation | Changed prose read, Codex root |
| Meetings, ru | Prepare and review cross-source context | Same distinctions; confirmed meeting/project link wording clarified | Same facts, source grants and review boundaries | Existing address/anchors/code and localized next actions | Changed prose read, Codex root |
| Meetings, es | Prepare and review cross-source context | Same actor, source and review vocabulary | Same evidence and incomplete-source behavior | Same address/anchors/code and next actions | Changed prose read, Codex root |

Spelling report: 46 flags across 17 files were inspected; they are technical identifiers, valid
inflected forms or retained historical text. New shared English prose uses plain “not searched”.
No spelling dictionary exception or validation gate was expanded. Prose review is separate from
contract, browser and production verification.

## Runtime and contract evidence

Zoom #160 adopts published Core 0.332.0/Base 0.43.2 and explicitly enables Core's CLI/MCP
communications capability. The translated 18 October release notes were read against that merged
source; the other twelve guide/reference deltas retain their reviewed behavior. All fourteen
translations pass structural checks against the full merged source. Fingerprints were accepted
after npm/tag/platform verification. The packed Node 22.16 and Node 24.19 public preparation proof
passes. The final registry tarball matches the validated release artifact and local proof byte
for byte. The independent registry-only replay reports candidate=false, with zero external I/O.
