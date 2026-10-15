# Owner notes in meeting preparation: documentation review

Reader task: someone preparing for a selected series can recognize owner-written notes, keep their
references and revision numbers, distinguish them from accepted facts, and investigate omitted sources.

## Source boundary

- Documentation base: origin/main `00568d0`, preserving the newer Telegram0.60/Memo0.41 reviews
  and task category example. The original draft began at `ba70b2b`; no other tool pin is changed.
- Current Zoom pin is verified **v0.20.1**, source `bc91018482ddfa0a136aa94c49cfe2aa2b46f431`,
  [release38798750377](https://github.com/WireCatLabs/zoom-cli/actions/runs/38798750377).
  Registry bytes equal the validated artifact, SHA256
  `ae54b7877663d582124ecbf92e906920d1d2e9fd7dbd6cea51f724dfa54d86b2`; SRI and tag/source match.
  All456 native tests and all four Linux/Windows Node22.16/24.19 installed-platform proofs pass,
  including notes/revision, projection, post-escaping MCP budget and one Base identity.
- Runtime is published Core0.290.0/Base0.33.0. Core source
  `a9b2202c0233218813a5d9256e04e76a9e482849`, release38794095014, SHA256
  `36899b6660dfd29c1c5b900bd0a6697170663b7e86f4e46300527ef5b300071d`.
  Registry/tar/SRI/tag match;4554 tests plus four intentional skips,95.09% lines, security,
  compatibility, SQLite restart, Bun and TG/MAX parity passed. No new migration or heavy dependency.
- The separate standards release0.19 published and was verified before notes0.20 merged. This
  portal update includes its `--source` rename and legacy-store preservation correction, the0.20
  notes feature and0.20.1 byte fix. These are source-owned facts, not portal-only runtime claims.
- Global CLI and both managed agent skills are0.20.1, checked without owner config/store/keyring/models.
  The current docs draft is not deployed; the checked-in review is the premerge snapshot.

## Reader review inventory

The changed capability paragraphs, retained openings/endings, links and task boundaries were inspected
against owning native code and the preceding reviewed guides. Final immutable sync and translation review passed; browser scope and timing findings are recorded below. Generated English command content is source-owned; its changed literal
row is copied from native generation rather than invented by the portal.

| Page and locale | Reader task | Behavior checked | Final released source / exports | Reviewer |
|---|---|---|---|---|
| Zoom usage, en | Prepare for an upcoming selected series | Owner notes are separate from accepted facts; references/revisions/coverage remain visible. | Native/translation/contract matched; browser scope below | Codex |
| Zoom usage, ru | Prepare for an upcoming selected series | Owner notes are separate from accepted facts; references/revisions/coverage remain visible. | Native/translation/contract matched; browser scope below | Codex |
| Zoom usage, es | Prepare for an upcoming selected series | Owner notes are separate from accepted facts; references/revisions/coverage remain visible. | Native/translation/contract matched; browser scope below | Codex |
| Zoom mcp, en | Give an agent bounded preparation tools | Account remains server-selected; notes use the registered answer and post-escaping item/cue byte bounds. | Native/translation/contract matched; browser scope below | Codex |
| Zoom mcp, ru | Give an agent bounded preparation tools | Account remains server-selected; notes use the registered answer and post-escaping item/cue byte bounds. | Native/translation/contract matched; browser scope below | Codex |
| Zoom mcp, es | Give an agent bounded preparation tools | Account remains server-selected; notes use the registered answer and post-escaping item/cue byte bounds. | Native/translation/contract matched; browser scope below | Codex |
| Zoom roadmap, en | Choose supported work and identify what remains | Owner notes are delivered; imported documents, mail, messages, alias candidates and reviewed intake remain future work. | Native/translation/contract matched; browser scope below | Codex |
| Zoom roadmap, ru | Choose supported work and identify what remains | Owner notes are delivered; imported documents, mail, messages, alias candidates and reviewed intake remain future work. | Native/translation/contract matched; browser scope below | Codex |
| Zoom roadmap, es | Choose supported work and identify what remains | Owner notes are delivered; imported documents, mail, messages, alias candidates and reviewed intake remain future work. | Native/translation/contract matched; browser scope below | Codex |
| Zoom archive, en | Understand local meeting storage | Core 0.286+ preserves legacy messages.db and SQLite sidecars; retention is a separate action. | Native/translation/contract matched; browser scope below | Codex |
| Zoom archive, ru | Understand local meeting storage | Core 0.286+ preserves legacy messages.db and SQLite sidecars; retention is a separate action. | Native/translation/contract matched; browser scope below | Codex |
| Zoom archive, es | Understand local meeting storage | Core 0.286+ preserves legacy messages.db and SQLite sidecars; retention is a separate action. | Native/translation/contract matched; browser scope below | Codex |
| Zoom search, en | Link a participant to a known person | --source names explicit additional numeric store accounts; links require an explicit person. | Native/translation/contract matched; browser scope below | Codex |
| Zoom search, ru | Link a participant to a known person | --source names explicit additional numeric store accounts; links require an explicit person. | Native/translation/contract matched; browser scope below | Codex |
| Zoom search, es | Link a participant to a known person | --source names explicit additional numeric store accounts; links require an explicit person. | Native/translation/contract matched; browser scope below | Codex |
| Zoom commands, en | Look up exact command syntax | Generated native source row for `--source <accounts>` is copied into the maintained translations. | Native/translation/contract matched; browser scope below | Codex |
| Zoom commands, ru | Look up exact command syntax | Generated native source row for `--source <accounts>` is copied into the maintained translations. | Native/translation/contract matched; browser scope below | Codex |
| Zoom commands, es | Look up exact command syntax | Generated native source row for `--source <accounts>` is copied into the maintained translations. | Native/translation/contract matched; browser scope below | Codex |
| Zoom changelog, en | Understand the release and required script update | Separate0.19 standards,0.20 notes and0.20.1 MCP budget entries; old --target-accounts has no alias. | Native/translation/contract matched; browser scope below | Codex |
| Zoom changelog, ru | Understand the release and required script update | Separate0.19 standards,0.20 notes and0.20.1 MCP budget entries; old --target-accounts has no alias. | Native/translation/contract matched; browser scope below | Codex |
| Zoom changelog, es | Understand the release and required script update | Separate0.19 standards,0.20 notes and0.20.1 MCP budget entries; old --target-accounts has no alias. | Native/translation/contract matched; browser scope below | Codex |
| Shared Meetings, en | Prepare from linked saved context | Separate notes from accepted facts; retain note refs/revisions and investigate unqueried documents/communications. | Native/translation/contract matched; browser scope below | Codex |
| Shared Meetings, ru | Prepare from linked saved context | Separate notes from accepted facts; retain note refs/revisions and investigate unqueried documents/communications. | Native/translation/contract matched; browser scope below | Codex |
| Shared Meetings, es | Prepare from linked saved context | Separate notes from accepted facts; retain note refs/revisions and investigate unqueried documents/communications. | Native/translation/contract matched; browser scope below | Codex |

## Findings corrected

- Native usage/MCP/roadmap and skill previously described all person/project notes as unqueried.
  The new bounded owner-note selection is explicit; imported/file notes, mail and messages remain gaps.
- Existing accepted facts and owner notes now stay separate in prose, matching distinct result sections.
  Notes retain `notes.coverage.has_more`, `notes.coverage.output_limited` and
  `source_evidence: not-revalidated`; selecting references retains those limits.
- Archive translations still promised automatic deletion of legacy messages.db files. Native0.19
  corrected that stale claim; both translations now describe preservation and separate retention.
- Search and command translations carried --target-accounts. They now use the source-owned
  `--source <accounts>` syntax and preserve its explicit numeric-account meaning.
- The roadmap retains broader series discovery, imported documents/communications/aliases,
  reviewed findings intake and shared native archive storage as planned work.

The published0.20 regression grew a37,982-byte item to81,982 bytes under a64KiB bound. The
actual installed0.20.1 package returns4,852 bytes for the same synthetic MCP request while preserving
the raw CLI note. Core owns the shared trimming policy; original source text and citations stay intact.

The initial36-case development run passed functionally but two cases exceeded the80% timing
headroom guard (26.606s and24.123s against30s). A retained two-case trace located13.9/14.2s in
first-request Markdown compilation. The existing server readiness probe warmed only HTML. A bounded
shared Markdown readiness check now runs before development tests, skips static export runs and
retains every test assertion, deadline and timing threshold. The final rerun is pending.

The discovery capture now explicitly sets WIRECAT_STATE_DIR in both source-build and subprocess
environments, alongside temporary HOME/store paths. Final contracts were recaptured after that change.

## Gates

- [x] Native456 tests, TypeScript, docs and command lint passed.
- [x] All four release-installed SDK proofs passed notes/revision/projection, framing budgets and resource/scoping assertions.
- [x] All14 final translated structures match; reviewed source fingerprints are accepted.
- [x] Verify the immutable Zoom0.20.1 release, tarball/SRI/tag and four installed-platform proofs.
- [x] Capture final native sources, review translations in full and accept their matching fingerprints.
- [x] Refresh exact command contracts; run strict localization, quality and release-note checks.
- [x] Run the affected Zoom browser suite against HTML and Markdown:36 passed.
- [ ] Merge after all checks pass; verify the successful production deployment and live routes.

No owner account, store, keyring, models or live Zoom data was used. Strict quality reported1319
reference entries, zero reference gaps/invalid examples and17 task mappings. Its144 corpus-wide
syntax illustrations/manual cases are not claimed executed or fully audited; CI does not establish
whole-corpus editorial compliance. The existing dev Sidebar React key warning remains; no frontend
layout code changed. Final deployment and live proof will also be recorded in the private delivery.
