# Zoom standard-output review — 14 October 2026

Reviewer: Codex root. Reader task: read stored meeting evidence through the released CLI/MCP,
retain citations and continuation, and consume the full item/list answer without losing coverage.

Portal basec0660b47592dd54c7e77f84d9e4a0096e89e77ed. Native standards PR74 merged at
06a46dd971c0e21cce95a70ed3bb3518b8ddce5e after every required PR check passed. Release candidate
0.11.0 pins registry Core0.268.0 / Base0.27.2. This excludes the separate project-evidence command.
Native doc correction PR75 uses immutableb5ce2c3c2272c5d37ae17a4c13d10d2058877569 for search/MCP;
it locates report cursors under item and removes the inherited word-hit selection claim.

## Plan and release gates

1. Verify registry tarball, integrity, tag/source and matching GitHub release. Keep the portal's
   reviewed0.10 pins until actual0.11 publication; drafts do not establish released behavior.
2. Read all affected English/Russian/Spanish pages. Update usage, search, MCP and changelog;
   preserve onboarding and source/agent choices. Check unchanged pages against the command/ABI diff.
3. Import released sources and the two immutable guide corrections. Remove older index/install/app
   overrides once the released tag includes those improvements. Accept only reviewed fingerprints.
4. Refresh exact released command contracts; check localization, strict syntax, links, types/lint
   and focused browser/Markdown cases. Full export/link/SEO/browser checks remain in deployment CI.
5. Verify public HTML/Markdown after successful deployment. Keep source facts and publication
   status distinct; never claim this session's unreleased project-evidence feature is installed.

## Behavior evidence

-415 synthetic native tests pass,98.14% line coverage, floors met. All13 previous-version upgrade
 cases, no-leak, docs/types/lint/Bun/contracts pass. Baseline106 unchanged,0 new/0 overrides.
- Exact packed candidate passed installed Linux/Node24 with external access blocked. Release
 workflow38566153612 also passed all four Linux/Windows Node22/24 installed-platform jobs.
- `commands --json` is the shared contract-2 discovery document. Successful finite reads and JSONL
 packets carry item/list envelopes and metadata. Detailed reports retain coverage/cursors in item.
- Meeting word hits use ref/meeting/excerpt/offset_ms and standard next/page. Details count current
 transcripts; transcript --history retains original revisions. Field projection preserves metadata.
- MCP rejects unknown/invalid fields before a store opens, names the field and validates strict
 success/error output schemas. The SDK and handler are both covered by real-client tests.

## Page inventory

| Page/locales | Reader path and review |
|---|---|
| usage EN/RU/ES | Explain item/list/meta, report-specific content, current/history and complete JSONL |
| search EN/RU/ES | Cite word hits; preserve scope/continuation; locate report coverage and aliases accurately |
| mcp EN/RU/ES | Same full packet in text/structured output, strict inputs, fixed account, discovery without I/O |
| changelog EN/RU/ES | Exact0.11 changes; preserve earlier version history |
| index/installation/zoom-app/sessions EN/RU/ES | Retain onboarding reviewed in2026-10-14-onboarding.md; contents list deployed38563329510 and live links verified |
| remaining native guides and command reference EN/RU/ES | Unchanged tasks carried forward from the earlier full review and rechecked against the ABI; only the generated cursor description changes |

Zoom0.11.0 is published and installed. Release38566153612 succeeded; the downloadable registry
tarball matches the exact validated artifact and integrity. Tag v0.11.0 resolves to06a46dd;
the matching GitHub release is published. Fresh-state installed discovery says contract2 and
doctor returns the standard envelope. No owner database/keyring/model was opened.

All16 captured sources are reviewed against the immutable release and two guide overrides.
The five changed source pages (usage/search/MCP/changelog/generated commands) have ten reviewed
translation fingerprints; the remaining20 remain current. Generated reference changed only the
word cursor description from nextCursor to page.cursor. Unchanged archive/topic/config/session
security/setup tasks retain the reviewed behavior and onboarding source from the earlier inventory.
The roadmap is reviewed for0.11: all three dedicated future workflows remain planned.

Exact command capture succeeded for all five pinned packages with runtime network disabled.
Strict docs:1263 references,0 gaps/invalid examples;126 unchanged illustrations remain manual.
All300 unit tests, lint, types, release-note/roadmap and translation checks pass. All12 affected
EN/RU/ES browser/Markdown/contents-link cases pass, with20% timeout headroom. Full export/link/SEO
and broad browser deployment gates plus live-route checks remain pending.
