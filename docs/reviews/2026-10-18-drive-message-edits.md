# Drive saved-message edit review

Readers can find an imported document from a URL added by an edit to an older saved message.
The existing recipe for finding a document and its conversation owns this explanation. It states
the important prerequisite: the messenger tool must first save the edit locally. The workflow
uses normal sync; no extra command, Google grant or navigation page is introduced.

## Reviewed source and behavior

Drive#117 merges the host behavior; #118 prepares the patch release at
388b9efa0e4cea4322385c2d9e2c5f569bc0f68b. Exact dependencies are Core 0.331.0 / Base 0.43.2.
Core#1496 adds local revision time to link candidates using its existing index. Drive records a
successful linker version only after both passes finish; earlier checkpoints get one historical
local pass and failed attempts retry. Unchanged document content is not downloaded again.
The query introduces no migration; the adopted SDK uses its existing current store schema.

Independent [public package checks](https://github.com/WireCatLabs/cli-testing/tree/main/performance/documents/edited-message-links)
reproduce missing links in registry Drive 0.17.0, then check the packed fix with public Core 0.307.0
message writes. Five fresh groups/five syncs and six old-checkpoint groups/six syncs pass; each
reads content once. Provider/account identity, duplicate detection, current text after URL removal,
deleted messages and re-added URLs are checked. No owner data or Google/messenger connection is used.
Final registry proof is separate from those packed results. Native validation passes 312 tests,
91.01% lines, ten CLI/MCP contracts, five older-store upgrades and Node/Bun installed acceptance.

## Reader and translation review

| Page / locales | Reader result | Boundaries, terminology and links | Review |
| --- | --- | --- | --- |
| recipes / EN, RU, ES | Find a document and a saved conversation that gained its URL through an edit | Existing task/result opening and agent request retained; messenger saves the edit first; no history fetch/read mark; hidden formatted links remain excluded | Read changed paragraph with the unchanged request, executable example and ending; both translations retain the same prerequisite and scope |
| changelog / EN, RU, ES | Recognize the repaired behavior and automatic historical pass | Distinguish saved-message linking from remote event delivery; keep the native technical block under existing localized disclosures | Matching release block and all history retained |

Other native guides, generated commands, installation choices, profiles, OAuth and API coverage
are unchanged. No new icon, sidebar entry or task mapping is needed. Source edits stay in Drive;
portal translations only change the corresponding explanation and technical release block. The
Core primitive remains shared rather than copied into a messenger or Google adapter.

## Validation and publication

Drive release workflow [39076294318](https://github.com/WireCatLabs/drive-cli/actions/runs/39076294318)
succeeded and npm/tag confirm the reviewed source. Exact registry command capture records Core
0.331.0 / Base 0.43.2. Fresh npm acceptance repeats both the five-group fresh and six-group upgrade
checks; the upgrade fixture requires the old checkpoint to be strictly past the missed edit. Each
run reads content once, and the installed command reports 0.17.1.

The actual released tag is synced, four changed RU/ES translation structures pass and fingerprints
are accepted after prose review. Portal validation passes 309 unit tests and seven browser smoke
cases. Strict command checks cover 1,379 references with zero gaps/invalid examples; 144 syntax
illustrations remain manual-review items. Lint, typecheck, search-bundle and release-note checks
pass. All three targeted localized recipe browser cases pass. PR/deployment and live results are
recorded in the linked acceptance report after publication. Full export and browser coverage run in deployment. Source provenance is the
deployed commit and its reviewed configuration; public pages do not render the GitHub release ref.
Independent live checks verify the changed recipe and changelog HTML/Markdown in all locales.
