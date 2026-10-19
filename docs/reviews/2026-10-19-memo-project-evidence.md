# Memo project-evidence release review

## Source and scope

The previous reviewed runtime is Memo v0.73.0. Translation preparation uses the captured stock
release source `6ca60b8f8ab975f3ead3807853be57fcf7cdf4ed`, after feature PR #335 and version PR #336.
The runtime pin remains unchanged until registry/tag availability and artifact verification are
confirmed separately. A temporary in-memory source capture does not change `tools.json` or approve
the release for publication.

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

## Publication gate

The separate Drive guide review records the failing exact Drive 0.18.0 / Memo 0.73.0 synthetic case.
Before publication, use the normal filtered release-preparation API, refresh contracts from the exact
published Memo artifact, rerun the unchanged synthetic scenario with Drive 0.18.0 and that Memo release,
and rerun localization/documentation checks. No source pin or capability promise is changed to bypass
the failed old-runtime check.

No live mailbox, Google or Zoom account, owner store, credential or source body is used for this review.
