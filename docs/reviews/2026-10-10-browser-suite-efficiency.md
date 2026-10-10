# Browser suite efficiency — 10 October 2026

## Failure and evidence

Deployment 38069545550 attempt 1 passed 132 cases and timed out in the remaining
reader-guide case. That case visited four guides, ran four full-page axe scans,
followed four reference anchors and fetched four Markdown twins under one 60-second
budget. The last reported operation was a local Markdown request; this does not
establish that the request itself was slow. Playwright counts the test body and
fixture setup against the same budget. The old workflow did not upload its retained
failure trace, so exact CI phase attribution was unavailable.

Attempt 2 passed and published commit `17085eaaa7588385a255a9cc8f45adb29bae0051`.
The new Installation and Features copy was verified live in English, Russian and Spanish.

## Investigation

Profiled the reader-guide and About suites against one frozen production export of
that commit, Chromium/Playwright 1.63.0, Node 24.19.0 and two workers. The original
nine cases performed 42 full-page accessibility scans. About also loaded each
locale/theme/width page twice, once for assertions and again for its screenshot.

The trace-on baseline recorded 2,960 requests, all to localhost. Summed frame-evaluation
time was 76.38 seconds; summed fixture time was 6.95 seconds. These are overlapping
aggregate timings across two workers, not wall-clock contributions. The scans dominate
browser work; isolated fixture setup is not the main bottleneck. Existing analytics
tests explicitly proxy the production hostname to localhost and abort other hosts.
Dependency installation/release sync uses the network outside the browser test phase.

The first trace-on comparison was slower after splitting (73.58 → 167.11 seconds).
This was not treated as a speedup. A second paired comparison used the normal
failure-only trace setting, preserving the same export, two workers and all assertions.

| Normal run | Original | Restructured |
| --- | --- | --- |
| Cases | 9 | 42 |
| Full-page axe scans | 42 | 42 |
| Page navigations | 84 | 66 |
| Wall time | 82.47 s | 79.87 s |
| Longest individual case | 36.05 s | 9.11 s |
| Failed/skipped cases | 0 / 0 | 0 / 0 |

One local paired run does not establish a CI speedup. The meaningful result is a much
smaller unit of work per timeout, with approximately unchanged total work. Named phases
in the restructured normal run recorded 97.85 aggregate seconds of accessibility work
and 0.24 seconds of Markdown parity work. No accessibility rules, viewport/theme
combinations, assertions or guide routes were removed.

## Changes

- One reader guide per test and one About locale/theme/width combination per test.
  Browser processes and the server remain shared; page contexts stay isolated.
- Remove About's second navigation before its screenshot. Screenshots use test-scoped
  output paths instead of globally shared `/tmp` filenames.
- Name content/layout, accessibility, anchor and Markdown/screenshot phases.
  Bound the local Markdown HTTP request at ten seconds for a precise failure.
- Observe and reject external HTTP requests in these static-page tests. Observation
  does not install routes or disable the browser HTTP cache; query values and headers
  are not recorded. This is not a global claim about every browser test.
- Write JSON timing reports and retain failed screenshots/traces. CI and deployment
  upload those diagnostics plus generated About screenshots for seven days.
  Diagnostic upload does not bypass test failures or the publication gate.
- Include reader-guide tests in PR CI, rather than discovering their failures only
  during deployment. Correct the local development guide's stale eight-worker claim;
  current CI uses four workers on four CPUs.

Two PR CI jobs currently build the export separately. Sharing that build could reduce
runner work, but it was not changed here: the measured timeout is in browser execution,
not export setup, and the gating/dependency tradeoff needs its own measurement.

## Validation

Baseline and restructured runs both passed with trace-on and normal tracing.
All 42 restructured cases passed, including all EN/RU/ES guide routes and About's two
themes/three widths. The external-request assertions passed. A default-reporter check
verified a written JSON report with named phases. Repository lint, type checking,
workflow YAML parsing and whitespace checks passed. Full browser/deployment coverage
remains enforced; no retries or global timeout increase were introduced by this change.
