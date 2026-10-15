# Related meeting context documentation review

Reader task: someone preparing for a selected Zoom series can understand which other stored calls
are included, follow citations, recognize missing context and investigate it separately.

## Source and release boundary

- Draft base: cli-docs origin/main a0b905a. Existing Zoom release pin remains v0.14.0 until the
  separate standards and related-context releases are published. This draft is not deployed.
- Core PR1256 merged2e9734a1. Core v0.284.0 publication38664348770 succeeded from
  957131845632a6128e07e630376189f2188377c2. Canonical npm bytes equal the validated tarball;
  SHA256 `73ffcdcf1654855dce69e2721bebdb10d6a2290336e9d2d6b2b13fc78d38e86e`.
- Native standards PR98 and feature PR101 remain separate. The feature uses the shared service;
  no provider-specific SQL or preparation assembly was added.

## Page checks

| Home | Reader outcome and evidence to retain |
|---|---|
| Shared Meetings, EN/RU/ES | Selected series, related stored calls through actual links, citations and remaining nonmeeting/alias gaps; preserve route and anchors. |
| Usage, EN/RU/ES | Five exact and five related calls by default, anchor refs, shared-person/project flags, account/window limits, independent lookahead and output limits, exact-series budget priority. |
| MCP, EN/RU/ES | Existing opt-in tool, account selected by server, related evidence and coverage, no writes or offline remote preparation. |
| Configuration, EN/RU/ES | Canonical snake_case JSON, explicit owner key renaming, preserved values/permissions, no automatic startup folder move; command selector alias remains. |
| Archive and commands, EN/RU/ES | Canonical output-dir/pause flags and shared value names; executable examples and generated reference agree with the released command tree. |
| Roadmap and changelog, EN/RU/ES | Related calls delivered; nonmeeting context, discovery, aliases and reviewed intake remain future work. No automatic summaries, findings or tasks claimed. |
| Existing installation/app connection | Existing/new app table of contents, Client ID source, Public Client/PKCE and first-success checks retained. |

Related meetings require usable included exact-series history as anchors. Names, emails and words
do not establish associations. Proposed project links, other accounts, deleted and undated records
do not qualify. Stored links are current, not an assertion of historical or future attendance.
Metadata bounds do not bound SQL scan/sort cost. Preparation does not download missing transcripts,
refresh an index or call a model. Stored fact evidence is not revalidated.

## Publication checklist

- [ ] Verify immutable native release, matching registry/validated bytes and dependency identities.
- [ ] Pin that release, sync source pages and review every changed translation before accepting hashes.
- [ ] Refresh exact command contracts; strict examples/reference/task validation passes.
- [ ] Record roadmap fingerprint and review; localization and release-note gates pass.
- [ ] Build/export/link checks and relevant browser checks pass.
- [ ] Merge green PR, await deployment and verify EN/RU/ES live HTML and Markdown twins.

Runtime checks use isolated synthetic state. No owner database, login, keyring or live Zoom call is
required or used. Final release/deployment proof will replace the draft boundary above.
