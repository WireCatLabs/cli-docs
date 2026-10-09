# Implemented editorial decisions

The owner approved all eight proposals and permitted related adjustments. This pass merges
main `e30a07a` and uses Telegram v0.38.0 / MAX v0.37.0. Runtime contracts were recaptured from
those packages in isolated state with network access blocked during command discovery.

## Result

| Decision | Concrete result |
| --- | --- |
| Search architecture | Rewritten explanation covers archive scope, strict queries, stems, legacy typo discovery, native-server candidates, conversation graphs, vectors, freshness and source checking. Implementation links point to shipped cli-messaging 0.196.0/0.197.0. All existing headings and three diagrams remain. Old measurements are visibly historical. |
| MAX remote setup | The exact test-status paragraph is moved after the instructions, under a short evidence label. No test scope is silently expanded. |
| Daily usage | Telegram/MAX pages start with four tasks, copyable requests, expected outcomes and relevant guides. Complete native syntax is below a disclosure. Existing anchors and TOC links automatically reveal it. |
| Account checks | Verdict-like titles become account signals and limits in both messengers and all locales. Old localized and source-language anchors remain available. |
| Incomplete reports | Both report pages contain a concrete three-message example and the next action when later history is missing. It is checked against both released service implementations. Reports are titled as conversation reports rather than a comparison of people. |
| Mobile use | Browser setup is followed by ordinary use in mobile ChatGPT/Claude with the same account and connected tool. This is the owner’s expected product path; no claim of a live mobile test is added. |
| Always-on server | A Linux user-service template covers actual paths from MCP configuration, account/state consistency, lingering, background Funnel, keyring access, restart checks, shutdown and diagnostics. The unit was verified statically; no host service was installed or started. |
| Security | Reader checks for sources, history, unknown values and completed actions precede the expandable technical evaluation report. Evidence and historical claims remain intact. |

## Ownership and source evidence

The portal owns task-oriented presentation in `lib/reader-guides.ts` and
`components/reader-guide.tsx`; HTML and Markdown share the same requests and results. Native
references remain generated from the reviewed releases and are included in full in Markdown.
Explicit contextual errata in `scripts/docs-corrections.json` move the review status and update
account-signal headings without changing commands or release facts. Source-repository checkouts
and unrelated worktrees are unchanged.

The example creates a fresh SQLite database containing three synthetic messages. It invokes
`adminStatisticsService` through released cli-messaging 0.196.0 and 0.197.0, with a fixed clock
and a synthetic account. The actual observations are: two questions, one observed answer, one
question without an observed answer; graph relationships are complete while archive coverage is
unknown. `pnpm docs:report-fixture` repeats the check after `pnpm docs:contracts`. The evidence is
in ignored `.docs-tooling/reports/approved-proposals/report-fixture.json`. No live account,
network adapter, model or messenger action is used.

Server instructions were checked against Tailscale's Funnel CLI documentation and systemd's
service/lingering references. The example unit was checked with `systemd-analyze verify`, using
a real executable only for static path validation. Account login and remote reboot remain user
steps, not activities performed by this documentation task.

## Validation

- 227 unit tests passed; lint, type checks, Markdown lint and localization passed.
- 43 browser checks passed, including all task-guide locales/providers, reference disclosure,
  old-anchor navigation, Markdown completeness, diagrams, mobile layout and accessibility.
- Build exported 542 routes; internal link and SEO checks passed.
- Contract checks found 899 reference entries, no reference gaps and no invalid examples.
  The 111 shorthand/glob examples remain explicitly queued for manual review.
- Matching changelog entries and versioned roadmap reviews passed for both current pins.
- Six Russian revised pages were inspected at 390px with no horizontal overflow. Screenshots
  are ignored evidence under `.docs-tooling/reports/approved-proposals/`.

Local preview remains on port 3000. No publication or live messenger action was performed.
