# Public-page coverage and browser efficiency

Reviewer: Codex root, 16 October 2026. Implementation base: `c7a8cc8`.

The owner asked to reduce repeated browser work while retaining homepage coverage and checking
every non-documentation page for shared layout/component consistency. This changes tests and
maintainer guidance; public content, application code, dependencies and workflow gates stay intact.

## Coverage decisions

| Risk | Coverage after this change |
| --- | --- |
| Homepage interaction, responsive layout, themes, accessibility and every shared link's hover/focus styling | Existing homepage suites retained. The combined multi-page styling cases keep every homepage assertion and keep representative link styling checks on every other public page. |
| About's own content, keyboard controls, screenshots and accessibility | Existing 18-case locale/theme/viewport matrix unchanged. |
| A public page diverges from the shared shell | Every public route, all three locales, desktop/mobile: header/footer navigation parity, unique landmarks, branding, legal links, language/theme controls, menu dismissal/focus, installation/copy-command consistency, representative link styling, alignment, overflow and browser errors. |
| A newly added route escapes coverage | Route cases derive from app page files. Private folders and docs routes are excluded; dynamic/unlocalized routes require explicit fixtures and fail discovery. |
| Localized reader-guide controls/content have an accessibility regression | All 24 guide variants still scan their complete `main`, including the native reference body with the existing rule tags and zero-violation assertion. |
| Shared shell and generated reference-table accessibility | Existing full-page site-quality matrix unchanged. |
| Guide rendering, direct reference anchors, commands and Markdown exports | Existing per-guide checks retained. |
| Incorrect translation meaning or instructions | Existing released-command/content contracts and semantic prose review remain required; browser phrase presence does not prove meaning. |

Reader-guide scans retain all unique page content, including report widgets, onboarding controls
and the complete native reference body. Shared navigation/footer coverage stays in the existing
full-page matrix. No accessibility rules are disabled or violations suppressed to obtain a pass.

## Plan and validation

1. Inspect actual production reports and test sources; identify repeated work rather than target a
   smaller test count. The previous run's three heaviest files consumed 55.4% of summed case time.
2. Preserve homepage/About coverage and add independent public-route/viewport cases.
3. Move repeated styling assertions to their shared component coverage; scan each unique guide.
4. Compare the original and changed tests on the same immutable export with the same workers.
5. Check formatting, test-structure policy, types, relevant unit tests and unchanged timeout headroom.
6. Review the final diff and require green PR checks; retain full production browser gates.

The benchmark uses the site artifact from deployment `38827285878`, source
`5125677b1b6565d7b650a95874cd49161383abdc`, served locally with two workers. Original test files are
copied to an ignored benchmark directory so implementation edits cannot affect the baseline run.
The two targeted test files match the implementation base; the export is held fixed for comparison.
Local timings are not a prediction of GitHub runner speed.

## Measured result and checks

| Workload | Passing cases | Wall time, two workers |
| --- | --- | --- |
| Original navigation and reader-guide cases | 32 | 136.3 seconds |
| Revised cases plus all public-page shell checks | 68 | 92.4 seconds |

The final workload is 32.2% faster while adding 36 independent page/locale/viewport cases. It retains
all guide/native-reference content in the accessibility scans and representative hover/keyboard-focus
checks on each other public page. An earlier component-only experiment was faster but is not the
final scope or result. This is not a claim that the whole deployment is 32% faster.
[Normalized timings, source hashes and fault-control evidence](2026-10-16-browser-coverage-efficiency.json)
record the comparison without local filesystem paths.

- All 68 final cases passed with no skips, unexpected failures or retries.
- All 67 unchanged site-quality, homepage and About cases passed. Their source files are unchanged.
- The paired runs and preserved-page run pass the existing 20% timing-headroom guard. No deadlines
  or thresholds were increased.
- An isolated export copy hid About's desktop navigation with CSS. The new visible-menu assertion
  failed as expected; the original export stayed unchanged.
- Typecheck, 306 unit tests and Markdown lint pass. Final lint and PR/full-production checks follow.

Exploratory runs found two test-selector issues: legal links were also counted inside the language
menu, and a representative Features link was inside a closed connection panel. Scoping to the legal
link group and visible shared-link components matches the intended checks. A route-discovery typing
issue and the initial baseline server-directory configuration were also corrected. Failed exploratory
runs are excluded from timing evidence. No runtime account, store, keyring or model data is used.
