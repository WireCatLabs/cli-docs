# Local documentation checks

Use `pnpm dev` for everyday copy edits. It compiles requested routes on demand;
you do not need to sync tool sources or export the whole site after each edit.

Run `pnpm test:browser` for the local smoke suite. It checks the home page,
navigation, the query playground, localized term explanations, installation guide navigation
and Markdown output. It excludes production redirect rules, full documentation
search indexing, repeated full-page accessibility scans, font matrices and analytics
checks. Those checks remain in the full CI suite.
Run an affected test file separately when changing behavior outside the smoke suite.

`pnpm test:browser:full` runs the complete browser suite when needed. For an
already-built export, use `PLAYWRIGHT_EXPORT=1 pnpm test:browser` (or the full
command). Without that environment variable, Playwright starts its own dev server.
The smoke config uses the same tests and assertions as the full suite.

CI and deployment invoke the full Playwright config directly. They run individual
tests in parallel with four workers. Local runs use two workers to leave resources
for the dev server; `--workers` can override either setting. Four workers share the
standard public GitHub runner's four CPUs. Each worker reuses its browser and the suite
shares one server; each test keeps an isolated page/context so state cannot leak between cases.

Git hooks do not run browsers. Pre-commit checks staged code and secrets, and
pre-push runs type checking. `pnpm build` is a separate production check: it syncs
tool documentation and exports the entire site. Keep full export, link, SEO and
browser coverage in CI; use targeted local checks for routine edits.

Browser runs write test durations to `playwright-report/results.json`. Reader-guide and
About cases also name their rendering, accessibility and Markdown/screenshot phases.
CI and deployment retain that report, failed traces/screenshots and generated About
screenshots as `playwright-<job>-<attempt>` artifacts for seven days. Artifact upload is
diagnostic only; a failed test still prevents publication.

Keep independent guide routes and viewport/theme cases as separate tests. Do not place
several full-page accessibility scans under one timeout. Shared browser/server setup is
already reused; sharing mutable page state can hide ordering bugs. Static reader-guide
and About tests observe requests and reject external HTTP dependencies without enabling
request interception or disabling the browser cache.

To profile against one frozen export, use:

```sh
PLAYWRIGHT_EXPORT=1 pnpm exec playwright test tests/reader-guides.spec.ts tests/about-project.spec.ts --trace=on
```

Inspect the named phase durations in the JSON report and requests in the trace. A timeout
reported during an API request can mean earlier phases consumed the whole test budget;
it does not by itself prove the request or an external service was slow.


## Browser regression guards

`pnpm lint` also runs `pnpm check:browser-tests`. It parses browser test source and
rejects direct `analyze()` calls inside a test's runtime loops or multiple scan calls
in one callback. Outer loops that generate independent tests are allowed. Do not move
repeated scans into a helper to sidestep this rule; keep a distinct test for each page,
theme or viewport. The source check covers direct invocation patterns, not arbitrary
JavaScript execution; review and timing checks cover what static analysis cannot prove.

After each successful browser suite, CI/deployment runs `pnpm check:browser-timings`
against its JSON report. Passing cases must use less than 80% of their declared timeout;
deadlines must be positive and no greater than 180 seconds. Empty/malformed reports,
unexpected failures and flaky retries fail the guard. The headroom rule passed against
the previous complete CI report before adoption. When it flags a case, inspect phase
and trace timings and split or reduce its work; increasing deadlines is not the remedy.
All browser failures and timing-budget failures still prevent publication.

The published documentation is at `https://wirecat.dev/en/docs`, with `/ru/docs` and
`/es/docs` for translations. For local previews, use `pnpm dev` and open
`http://localhost:3000/en/docs`. For the exact production export, run `pnpm build`,
then `pnpm start`; use the local address printed by the server. A branch's local preview
includes its unpublished edits; the public site includes only successful deployments.
