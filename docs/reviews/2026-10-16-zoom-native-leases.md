# Zoom native archive ownership review

Reviewer: Codex root, 16 October 2026. Base: `1433067` after preserving the incoming
Zoom batch and Memo release review in PR260. This is a focused release delta, not a
new audit of historical changelogs or the whole documentation corpus.

Readers recovering an interrupted archive get a concrete next step: inspect the
destination and lock records, then verify completed files before retrying. The
roadmap distinguishes delivered shared writer ownership from the remaining native
partial-file and publication adapters. Russian and Spanish changelog entries for
the two newest releases are translated; generated command descriptions retain the
native help language.

## Source and behavior

The verified release is Zoom v0.21.1, source
`c7889a38bc415ee3b8f30dca12e7baa206d01870`, with Core 0.294.0 and Base 0.35.0.
Registry bytes match the validated CI tarball, its SRI matches npm, and the annotated
tag peels to that exact source. SHA-256:
`6c09213e464cd8fe9c6d17538fb1f33cf26cd67e3ab2f037b86e8b05a07dc377`.
All four Linux/Windows Node22.16/24.19 installed proofs pass the six writer checks,
batch/preparation checks and single-Base identity checks. Only then were the pin and
six reviewed source fingerprints updated. The release run is [38825698733](https://github.com/WireCatLabs/zoom-cli/actions/runs/38825698733).

Core owns native writer acquisition, inspection, dead-local recovery and owned
release. Zoom retains its marker layout, transport, partial-file and publication
policies. Existing commands and public SDK exports remain compatible. A missing
ownership marker before confirmation refuses the archive before downloading;
cleanup may fail after files have already been saved. This does not claim continuous
kernel locking, distributed locking, or automatic repair of recording files.

Evidence: native archive/roadmap/changelog changes in Zoom PR120, the checked-commit
release guard in PR121, Core PR1329, actual two-process native lease tests, the Zoom
pre-download regression and the required installed-platform writer-lease probe.
No owner meeting data, account, keyring or speech model is used for these checks.

## Page review

Every row covers the changed prose in context, including its opening and ending.
Unchanged batch search/reference translations come from PR260; this PR adds
HTML/Markdown regression coverage for that released workflow without replacing them.

| Page and locale | Reader task | Terms and opening | Behavior evidence | Links and exports | Result and owner |
| --- | --- | --- | --- | --- | --- |
| archive, en | Recover an interrupted recording archive. | Existing task opening and search handoff retained; ownership failure has a next step. | Native archive flow and regression above. | Existing recovery anchor and checksum commands retained; HTML/Markdown browser checks passed. | Prose reviewed, Codex root. |
| archive, ru | Recover an interrupted recording archive. | Loss of ownership and cleanup after saved files retain the English boundaries. | Same released behavior; no promise of automatic file repair. | Literal commands retained; HTML/Markdown browser checks passed. | Prose reviewed, Codex root. |
| archive, es | Recover an interrupted recording archive. | Ownership and failed cleanup remain distinct from failed transfer. | Same released behavior; inspect and verify before retrying. | Literal commands retained; HTML/Markdown browser checks passed. | Prose reviewed, Codex root. |
| roadmap, en | Decide which meeting workflows are available. | Existing preparation/search opening and ending retained. | Shared leases delivered; partial/publication layouts remain provider-owned. | Existing preparation and source links retained. | Prose reviewed, Codex root. |
| roadmap, ru | Decide which meeting workflows are available. | Shared capability does not imply another production connector. | Same delivered/planned boundary. | Original links retained. | Prose reviewed, Codex root. |
| roadmap, es | Decide which meeting workflows are available. | Shared capability does not imply another production connector. | Same delivered/planned boundary. | Original links retained. | Prose reviewed, Codex root. |
| changelog, en | Identify the batch feature and archive/release fixes. | Exact native release notes; historical entries outside scope. | Versioned source and release proof pending. | Literal version/command references retained. | Delta reviewed, Codex root. |
| changelog, ru | Understand the two newest releases. | Translated the recent entries; existing historical-English notice remains accurate. | Same request budgets, owned release and checked-source boundaries. | Exact literals and heading structure match the captured release. | Delta reviewed, Codex root. |
| changelog, es | Understand the two newest releases. | Translated the recent entries; existing historical-English notice remains accurate. | Same request budgets, owned release and checked-source boundaries. | Exact literals and heading structure match the captured release. | Delta reviewed, Codex root. |

## Validation

- Final pinned-source sync/localization and six translation structures/fingerprints match.
- Exact offline contracts, release-note review, strict documentation checks, typecheck,
  lint and all306 unit tests pass. Lint retains three existing warnings.
- Strict quality:1329 reference entries, zero reference gaps/invalid examples,17 task
  mappings and144 syntax/manual cases. Those manual cases are not claimed executed
  or fully audited.
- All42 Zoom browser cases pass, including the six new HTML/Markdown checks; no skips,
  flaky results or unexpected failures. Every case retains20% timeout headroom;
  deadlines and thresholds are unchanged. The existing Sidebar React-key warning
  remains outside this change.
- The initial pre-sync unit failures were missing generated files; final capture and
  rerun passed. The roadmap review hash uses the checker's normalized, trimmed source.
- Incoming Drive0.13 pin preservation and its combined checks follow this initial
  Zoom-only validation. Remaining merge gates are the PR checks; production deployment
  and live localized routes are verified after merge, not claimed complete here.
