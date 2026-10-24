# Comparison prose publication correction

Main deployment [40114853530](https://github.com/WireCatLabs/cli-docs/actions/runs/40114853530)
failed the existing `docs:versions` check after comparison-page PR 362. Current reader guides
exclude release-number prose; immutable evidence URLs and release-history pages may retain it.

Remove the offending inline version annotations while retaining capability marks, checked dates,
source links and limitations. Drive's source version is retained in an immutable tag link.
The incoming pages named Drive 0.27.0, MAX 0.72.0, WhatsApp 0.7.0, Zoom 0.40.0 and Zoom competitor
CLI 0.2.9 as review context. This formatting correction does not rerun or certify those comparisons.
The Drive runtime documentation remains pinned to the published 0.28.0 command contract.

Strict example validation also found four gog command labels that looked like WireCat Drive commands,
and a Memo model-download spelling unavailable in the pinned release. Qualify gog command labels
with their executable, and use `memo models text download` from the captured Memo 0.91.0 contract.
