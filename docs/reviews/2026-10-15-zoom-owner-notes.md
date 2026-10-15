# Owner notes in meeting preparation: documentation review

Reader task: someone preparing for a selected series can recognize owner-written notes, keep their
references and revision numbers, distinguish them from accepted facts, and investigate omitted sources.

## Source boundary

- Draft base: cli-docs origin/main `ba70b2b5c392ca6209c076dfc6956afd1f5b5298`. Existing installation,
  Zoom app creation/connection, sidebar, table of contents, routes and incoming anchors are preserved.
- Core 0.289.0 published from `4eac4e4c8d7014282735ec5f8d13cab9a74ca65f`, release38762362557.
  Registry bytes equal the validated artifact, SHA256
  `fa891b9a994be0ea6007dcb52995d3c71d8afc113f5383f8035e4dd5ce6e7090`; SRI and tag/source match.
  Release validation passed4551 tests, four intentional skips, coverage, security, SQLite/old-Node,
  Bun and TG/MAX parity. The separate UTF-8 probe test correction is test-only after that immutable source.
- Zoom0.19.0 published from `efb097fefe23cf307107bf971af5d7fcb77be49a`, release38764078786.
  Registry bytes equal the validated artifact, SHA256
  `a47a330e38f7aafdd1c65432b886add2b215081dc53fec1c066e397e2ac16358`; four installed platforms and
  one Base identity pass. This is the separate Base0.33/Core0.288 standards release.
- The Zoom notes feature is merged in PR112 with actual published Core0.289/Base0.33 pins. It passed
  455 native tests, types, docs and command lint (26 baseline, zero new/overridden). Its release-only
  PR113 merged as348b452de6ae9ecfa2b9cb699c6304e1741a894f and release38783292555 succeeded.
  Zoom0.20.0 registry bytes equal the validated artifact, SHA256
  `d5e7ddbf6281ecfbbb6b4cdb7e4c9adb4f10f09da51f9cab77c234f84e91e0f2`; SRI/tag/source match.
  All four installed platforms pass owner-note/revision and projection proofs with one Base identity.
- This draft does not advance tools.json or accept source fingerprints until the matching release
  is verified. It is not deployed. Candidate structure checks cover commands, links, headings and code;
  they do not certify prose, a published package or reader task success.

## Reader review inventory

The changed capability paragraphs, retained openings/endings, links and task boundaries were inspected
against owning native code and the preceding reviewed guides. Final immutable sync and browser/export
verification remain required. Generated English command content is source-owned; its changed literal
row is copied from native generation rather than invented by the portal.

| Page and locale | Reader task | Behavior checked | Final released source / exports | Reviewer |
|---|---|---|---|---|
| Zoom usage, en | Prepare for an upcoming selected series | Owner notes are separate from accepted facts; references/revisions/coverage remain visible. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom usage, ru | Prepare for an upcoming selected series | Owner notes are separate from accepted facts; references/revisions/coverage remain visible. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom usage, es | Prepare for an upcoming selected series | Owner notes are separate from accepted facts; references/revisions/coverage remain visible. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom mcp, en | Give an agent bounded preparation tools | Account remains server-selected; notes use the same registered answer and source limits. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom mcp, ru | Give an agent bounded preparation tools | Account remains server-selected; notes use the same registered answer and source limits. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom mcp, es | Give an agent bounded preparation tools | Account remains server-selected; notes use the same registered answer and source limits. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom roadmap, en | Choose supported work and identify what remains | Owner notes are delivered; imported documents, mail, messages, alias candidates and reviewed intake remain future work. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom roadmap, ru | Choose supported work and identify what remains | Owner notes are delivered; imported documents, mail, messages, alias candidates and reviewed intake remain future work. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom roadmap, es | Choose supported work and identify what remains | Owner notes are delivered; imported documents, mail, messages, alias candidates and reviewed intake remain future work. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom archive, en | Understand local meeting storage | Core 0.286+ preserves legacy messages.db and SQLite sidecars; retention is a separate action. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom archive, ru | Understand local meeting storage | Core 0.286+ preserves legacy messages.db and SQLite sidecars; retention is a separate action. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom archive, es | Understand local meeting storage | Core 0.286+ preserves legacy messages.db and SQLite sidecars; retention is a separate action. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom search, en | Link a participant to a known person | --source names explicit additional numeric store accounts; links require an explicit person. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom search, ru | Link a participant to a known person | --source names explicit additional numeric store accounts; links require an explicit person. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom search, es | Link a participant to a known person | --source names explicit additional numeric store accounts; links require an explicit person. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom commands, en | Look up exact command syntax | Generated native source row for --source <accounts> is copied into the maintained translations. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom commands, ru | Look up exact command syntax | Generated native source row for --source <accounts> is copied into the maintained translations. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom commands, es | Look up exact command syntax | Generated native source row for --source <accounts> is copied into the maintained translations. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom changelog, en | Understand the release and required script update | Separate 0.19 standards and 0.20 notes entries; old --target-accounts has no alias. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom changelog, ru | Understand the release and required script update | Separate 0.19 standards and 0.20 notes entries; old --target-accounts has no alias. | Pending final release sync and HTML/Markdown checks | Codex |
| Zoom changelog, es | Understand the release and required script update | Separate 0.19 standards and 0.20 notes entries; old --target-accounts has no alias. | Pending final release sync and HTML/Markdown checks | Codex |
| Shared Meetings, en | Prepare from linked saved context | Separate notes from accepted facts; retain note refs/revisions and investigate unqueried documents/communications. | Pending final release and HTML/Markdown checks | Codex |
| Shared Meetings, ru | Prepare from linked saved context | Separate notes from accepted facts; retain note refs/revisions and investigate unqueried documents/communications. | Pending final release and HTML/Markdown checks | Codex |
| Shared Meetings, es | Prepare from linked saved context | Separate notes from accepted facts; retain note refs/revisions and investigate unqueried documents/communications. | Pending final release and HTML/Markdown checks | Codex |

## Findings corrected

- Native usage/MCP/roadmap and skill previously described all person/project notes as unqueried.
  The new bounded owner-note selection is explicit; imported/file notes, mail and messages remain gaps.
- Existing accepted facts and owner notes now stay separate in prose, matching distinct result sections.
  Notes retain `notes.coverage.has_more`, `notes.coverage.output_limited` and
  `source_evidence: not-revalidated`; selecting references retains those limits.
- Archive translations still promised automatic deletion of legacy messages.db files. Native0.19
  corrected that stale claim; both translations now describe preservation and separate retention.
- Search and command translations carried --target-accounts. They now use the source-owned
  --source <accounts> syntax and preserve its explicit numeric-account meaning.
- The roadmap retains broader series discovery, imported documents/communications/aliases,
  reviewed findings intake and shared native archive storage as planned work.

## Gates

- [x] Native feature455 tests, TypeScript, docs and command lint passed.
- [x] Candidate installed SDK helper passed notes/revision/projection and resource/scoping assertions.
- [x] All14 changed candidate translation structures pass; reviewed fingerprints are not advanced yet.
- [x] Verify the immutable Zoom0.20 release, tarball/SRI/tag and four installed-platform proofs.
- [ ] Capture final native sources, review translations in full and accept their matching fingerprints.
- [ ] Refresh exact command contracts; run strict localization, quality and release-note checks.
- [ ] Run the affected Zoom browser suite against HTML and Markdown.
- [ ] Merge after all checks pass; verify the successful production deployment and live routes.

No owner account, store, keyring, models or live Zoom data is needed for these checks. Syntax/manual
review counts from quality reports will be recorded separately; CI does not establish whole-corpus
editorial compliance. Final deployment and live proof will also be recorded in the private delivery.
