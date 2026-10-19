# Memo project-evidence release review

## Source and scope

The previous reviewed runtime was Memo v0.73.0. The new runtime is v0.76.0, from captured stock
release source `6ca60b8f8ab975f3ead3807853be57fcf7cdf4ed`, after feature PR #335 and version PR #336.
Stock release [39212499480](https://github.com/WireCatLabs/cli-memo/actions/runs/39212499480) succeeded;
the annotated v0.76.0 tag peels to that source. The release owner verified registry tarball equality
with the validated package, SHA-256 `76d8a1cd54b8535471d9f4ccbabb3c2af60c40649c1a4f19d2fafbcd7924461d`,
and reported actual CLI/stdio MCP artifact checks passing before this runtime pin was changed.

Translation preparation first used an in-memory draft capture without changing `tools.json`.
After artifact confirmation, the normal `checkToolRelease`/`prepareUpdates` workflow was invoked
with only the Memo update selected. It captured the published v0.76.0 source and advanced only
Memo's pin; every other pin and the three immutable Drive guide overrides were asserted unchanged.

The source delta changes six authored guides, the generated command reference and changelog.
All sixteen RU/ES overlays were updated. The unchanged authored page openings, endings and surrounding
tasks were read; the technical reference review covers its changed project-evidence section and
the newly inserted release entries, rather than claiming a new audit of every historical command.

| Page / en, ru, es | Reviewed change |
| --- | --- |
| archive | Timer failures expose fixed codes, reason IDs and source kinds; full messages remain in the journal |
| configuration | Read-only mode permits task planning/proposed links but refuses task-to-task linking and reminder polling |
| mail | PDF/Word readers are bundled; retry applies to earlier missing-reader failures, not every unread attachment |
| mcp | Project evidence includes aliases/key, index catch-up, neighbouring context, mentions and stored transcript cues |
| search | A meeting/project recipe explains explicit scope, cue references, meeting-start dates and pending-index recovery |
| security | Read-only exceptions are precise; no identity or approval boundary is broadened |
| commands | Released argument descriptions and new evidence options remain exact technical English |
| changelog | Preserve the existing policy of exact English technical release entries with localized introductory prose |

No new page, sidebar or roadmap exists in this release delta. Memo has no native roadmap page, so no
roadmap fingerprint or artificial review entry is added. The substantive changelog entries are reviewed
through the existing release-note gate. Configuration/mail portal corrections still match in all
three languages and remain necessary; no correction is retired solely to pass a check.

## Reader and evidence boundaries

Meeting evidence searches stored indexed transcript cues. It does not fetch recordings, infer attendees,
create project membership or save facts/tasks. Source modification time for imported documents differs
from meeting-start time for transcripts. Each returned reference retains its source basis. Missing or
pending indexes and incomplete archives cannot establish absence.

Mail/document index catch-up differs from meeting indexing. The recipe tells readers to use the existing
meeting search/index workflow when that index is pending. Mentions are cited names, not relationships.
Literal name/alias lanes and person-only context do not establish relevance or identity on their own.

New agent prompts are translated; command fences, inline literals, URLs and heading depth remain exact.
English heading aliases survive localization. Russian uses «вы» in reader instructions; Spanish uses
«tú». Translation acceptance follows reading and successful structural comparison, not automatic hashes.

## Source wording discrepancy

Native `docs/mcp.md` ends the project-evidence paragraph with “It writes nothing” after explicitly
describing local index catch-up. That shorthand is ambiguous: no project links, facts or tasks are
created, but local search indexes and the existing MCP audit log can change. A reviewed portal
correction in EN/RU/ES says that it creates no facts, tasks or project links and that catch-up can
update local search indexes. It preserves the immutable runtime/source pins. The native docs-only
follow-up [Memo PR #337](https://github.com/WireCatLabs/cli-memo/pull/337), source `e345016`, uses the
same English replacement so the correction can be retired when a later release includes it.
No runtime or confirmation boundary is weakened.

## Compatibility gate

The separate Drive guide review preserves the failing exact Drive 0.18.0 / Memo 0.73.0 case.
The unchanged synthetic scenario now passes all ten checks on registry Drive 0.18.0 / Core 0.348.0
and Memo 0.76.0 / Core 0.358.0. The local result is `/var/tmp/dm-release-context-result.json`;
the isolated install and lock are `/var/tmp/dm-release-install-gBs4Oa/packages`. It covers actual
Drive ingestion and Memo CLI/stdio MCP retrieval, provenance/date scope, identity stability,
unchanged sync, changed/removed content and strict unknown-argument handling. The old failure
was resolved by the reviewed Memo release, not by changing the scenario or warming its index manually.

The compatibility hold is cleared for this reviewed pair. Publication still follows the site's normal
PR/CI and deployment checks; no merge or deployment was performed during this preparation.

## Validation

Exact published contracts, source sync/localization and all sixteen translation structure/fingerprint
checks pass. All configuration/mail corrections still match. Strict documentation quality reports
1,406 references, zero gaps, zero invalid examples, 144 examples requiring manual review and 19 tasks.
The release-note gate passes; Memo has no roadmap to retire. All 319 unit tests in 38 files pass,
alongside typechecking and search-language freshness. Twenty-one existing localized Memo/Drive
browser cases pass. A temporary browser check also verifies the new Memo search anchor, its exact
command and Markdown twin, plus MCP meeting-start/catch-up text in all three languages. After the
prose-only MCP correction, targeted matching/sync/documentation checks were repeated instead of
rerunning the unrelated full suites. Full production export remains a later deployment check.

No live mailbox, Google or Zoom account, owner store, credential or source body is used for this review.
