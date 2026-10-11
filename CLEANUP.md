- public/search-architecture.svg — replaced by HTML diagrams (ArchitectureDiagram searchPaths/strictSearch/conversationSearch); no page references it any more — 2026-10-04
- lib/landing/{en,ru,es}.json, design/landing/g-home*.html, scripts/export-landing.mjs — no rendered page uses them any more (homepage is built from lib/editorial); only docs-quality reads the JSON. Check, then remove with that check — 2026-10-11

## Old `design/landing-variants` checkout — 2026-10-11

The main checkout held 167 uncommitted changes on an outdated branch. An audit found nothing
missing from main except the first-tasks diagram, now published. A full backup (tracked-change
patch, 315 untracked files, the 4 stashes as patches, 112 MB of design review screenshots, the
design critique and the old session journal) is in the git-ignored `archive-2026-10-11/` of the
main checkout, with the audit report. Two raw screenshots with a login code and session details
were deleted, not archived. The checkout is on `main`; three merged worktrees were removed.

## Retained

- `/home/leemour/Projects/AI/max-cli-private-wt-llm-wiki-20261009` — cli-private PR #270; check whether
  it is merged before removing the worktree.
- The nested `cli-docs/` folder in the main checkout: an empty repository with a linked worktree under
  `~/.superset/worktrees/`. Left untouched.
- Worktrees kept on 2026-10-11 cleanup: `cli-docs-wt-homepage-interactions` (local commits after PR #101),
  `cli-docs-wt-search-reader-refresh` (a process is running in it), `cli-docs-wt-schematic-previews` (uncommitted
  change, no PR), the emdash worktree, `cli-testing/.worktrees/security-gates-cli-docs` (PR #121 closed, not
  merged), `/tmp/cli-search-docs-clean-check`.
- Main checkout stash `stale analytics keys, superseded by #159` — old uncommitted PostHog key change; drop it.

## Removed — 2026-10-11

- 18 worktrees whose PR was merged at the same commit and had no local changes (drive, agent-docs, html-report,
  latest-versions, posthog, remove-meeting-brief and older ones). Their branches are kept.
