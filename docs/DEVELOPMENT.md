# Local documentation checks

Use `pnpm dev` for everyday copy edits. It compiles requested routes on demand;
you do not need to sync tool sources or export the whole site after each edit.

Run `pnpm test:browser` for the local smoke suite. It checks the home page,
navigation, the query playground, localized term explanations, installation tabs
and Markdown output. It excludes production redirect rules, full documentation
search indexing, repeated full-page accessibility scans, font matrices and analytics
checks. Those checks remain in the full CI suite.
Run an affected test file separately when changing behavior outside the smoke suite.

`pnpm test:browser:full` runs the complete browser suite when needed. For an
already-built export, use `PLAYWRIGHT_EXPORT=1 pnpm test:browser` (or the full
command). Without that environment variable, Playwright starts its own dev server.
The smoke config uses the same tests and assertions as the full suite.

CI and deployment invoke the full Playwright config directly. They run individual
tests in parallel with eight workers. Local runs use two workers to leave resources
for the dev server; `--workers` can override either setting. Eight workers share the
standard public GitHub runner's four CPUs, so review CI duration and failures before
increasing concurrency further.

Git hooks do not run browsers. Pre-commit checks staged code and secrets, and
pre-push runs type checking. `pnpm build` is a separate production check: it syncs
tool documentation and exports the entire site. Keep full export, link, SEO and
browser coverage in CI; use targeted local checks for routine edits.
