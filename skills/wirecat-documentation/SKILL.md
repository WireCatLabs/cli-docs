---
name: wirecat-documentation
description: Write, review or maintain WireCat Telegram/MAX documentation using reader tasks, reviewed release contracts and shared documentation checks. Use for WireCat documentation work, not live messenger tasks.
---

Find the `cli-docs` checkout; when working in tg-cli/max-cli it is normally a sibling directory.
Read `docs/AUTHORING.md` and `docs/README.md` there before drafting. They own the audience,
page openings, expected results, endings, cross-links and current task homes. Documentation
serves nontechnical readers first; retain exact reference material for developers and agents.

Before implementation, fetch current main and verify the checkout base. Use a clean worktree
from current main unless the user explicitly chose another base; preserve existing work. Report
the actual base commit and distinguish your changes from already-shipped content.

Read `docs/TOOLING.md` when gathering source or validating changes. `tools.json` identifies
reviewed releases. Distinguish those releases from installed tools, local main and inspected
architecture snapshots. Tool facts belong in their repositories; the portal's messenger folders
are generated sync outputs. Preserve uncommitted work and incoming URLs/anchors.

Use targeted searches for narrow questions. For broad review/handoff, run `pnpm docs:pack`
from cli-docs with the repository, release ref and topic you need. This stages an allowlisted
snapshot before Repomix reads files; check its manifest and verify claims against original
source. Do not run unrestricted packers on repositories containing private account artifacts.

CodeWiki is an optional research workflow for a requested generation/comparison task. Its
bounded trial uses the existing Codex login and separate source/output directories. Generated
pages are draft evidence, not public docs or proof of implemented behavior. Record missing
dependencies and inferred claims. Never publish or overwrite maintained pages automatically.

For public edits, improve the existing home of a user task before adding pages. Use fictional
examples and released commands. Run localization and `pnpm docs:check` with refreshed
`pnpm docs:contracts`; examine the report's reference gaps, invalid examples, unsupported syntax
and unmapped task families separately. These checks do not prove prose facts or task success.
Use isolated fixtures for behavioral checks; this workflow does not authorize live sending.

For Mermaid, keep editable fenced source, localized labels, a caption and a prose equivalent.
Run relevant build/export/browser checks so graphics do not disappear from Markdown twins.
Follow the existing reviewed-release workflow for translations and publication.
