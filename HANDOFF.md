# Handoff — WireCat docs site

## What this is

`cli-docs` is the documentation site for the owner's command line tools, served at
[wirecat.dev](https://wirecat.dev): **WireCat — AI Messaging with CLI tools for agents**. It is a
static [Fumadocs](https://fumadocs.dev) site (Next.js export) in English, Russian and Spanish. It
writes no tool's pages itself: `pnpm sync` copies each tool's `docs/` from its repository at its
newest release tag. Cloudflare Pages serves it; GitHub Actions builds and deploys it. How to run it:
[README.md](README.md).

## Where things are

- [docs/DESIGN.md](docs/DESIGN.md) — **start here**: the site map, what every page shows, the rules.
- [docs/STRUCTURE.md](docs/STRUCTURE.md) — the pages every tool has, and the checks that hold them.
- [docs/plans/2026-10-02-landing.md](docs/plans/2026-10-02-landing.md) — the next build: the landing
  page. Approved in outline; the owner was asked about the hero sentence and the logo.
- [docs/plans/2026-10-01-portal-v1.md](docs/plans/2026-10-01-portal-v1.md) — how the site was built
  and what the spike found; its "Where it stands" section is the status list.
- [tools.json](tools.json) — the tools: repository, npm package, the language of its pages, summary.
- The session journal (optional, the history of how this came about) is in max-cli's private
  `docs_ai/journal/`: `2026-10-01-docs-site.md` and `2026-10-02-docs-site.md`.

## What to read for each next task

### 1. The landing page — the next thing to build

1. [docs/plans/2026-10-02-landing.md](docs/plans/2026-10-02-landing.md) — what to build, in order,
   and how to check it.
2. [docs/DESIGN.md](docs/DESIGN.md), "The landing page" — the wireframe and where each section's
   content comes from.
3. `app/[lang]/(home)/page.tsx` — the current page you replace.
4. `lib/words.ts` — where every interface word lives, in three languages; add the new ones here.
5. `scripts/sync.ts`, function `sync` — where to write `content/docs/versions.json` (the tag it used).

### 2. max-cli 0.22.0 — the release (lives in max-cli, not here)

Until max releases, the site cannot build from tags (see "What will bite"). **State on 2026-10-02, ~01:40 Madrid:**
the 0.22.0 version and changelog are on max main (#315), and every live scenario passed. The owner ruled that a
`store fetch` bug (RISK-113) is fixed first: the fix is cli-messaging #386, which is not in 0.99.0. The order is:
max-cli #317 (max onto 0.99.0, session max-cli-1d), then the next cli-messaging release (session "Docs", after
01:18 UTC), then max's bump onto it, then the checks and the `store` live rows again, then the owner's signature
on `/home/leemour/Projects/AI/max-cli/docs_ai/releases/0.22.0.md`, then `bin/release` from max-cli's `main`.

After `bin/release` publishes, run `gh workflow run deploy.yml -R leemour/cli-docs` — the site then
builds from tags again.

### 3. Translations of the tools' pages

The owner's rule: a separate agent translates, after everything else is done. Read
[docs/DESIGN.md](docs/DESIGN.md), "Languages", then `lib/source.ts` (the i18n loader: a translated
page is `<page>.<lang>.md` beside the original). Translations belong in each tool's repository, so
`pnpm sync` must copy `docs/*.{lang}.md` too — that change is part of the task.

### 4. Later ideas

`IDEA-107` (compare page), `IDEA-108` (searchable reference), `IDEA-109` (sitemap, previews,
analytics, "Edit on GitHub" at the tag), lychee weekly, the release signal from each tool — each is
one paragraph in [docs/DESIGN.md](docs/DESIGN.md), "Later". None is planned yet; write a plan first.

## What will bite

- **The daily deploy fails until max releases.** It builds from release tags; max v0.21.0 predates
  `docs/meta.json`, and `scripts/sync.ts` refuses a tag that fails the structure check. A failed
  run publishes nothing, so the live site stays as it was. To publish what is on the tools' `main`:
  `gh workflow run deploy.yml -R leemour/cli-docs -f ref=main`.
- **Links between pages need `./`.** Fumadocs' `createRelativeLink` resolves `./usage.md` and leaves
  `usage.md` as a dead link; `sync.ts` writes the `./`. Test: `scripts/sync.test.ts`.
- **lychee reports every Russian anchor as missing.** It does not decode `%D0…` anchors. The site's
  own `pnpm check:links` does; trust it, not lychee, for links inside the site.
- **No middleware in a static export.** No server-side language detection or redirects: `/` picks the
  language in `public/language.js`, and a page that should redirect has to render a link and a
  `refresh` itself.
- **`llms.txt` and `llms-full.txt` are our own routes**, listing the default language only — the
  template's versions list every page three times, once per interface language.
- **Shiki rejects an unknown fence language** (`cron` in tg's recipes) and fails the build;
  `lib/source.ts` sets `fallbackLanguage: "text"`.
- **One copy of cli-core in each CLI.** max-cli and tg-cli force it with a pnpm override; two copies
  make the "changes something" marks vanish from the generated `commands.md` (RISK-97). Any cli-core
  or cli-messaging bump in a CLI: `pnpm generate`, then check that page has no diff.
- **Cloudflare has two accounts on this login.** The site is in **ModelRow leemour**
  (`95adf467c9937e5fdca37a0cb07fa70a`); the `cf` CLI asks which one unless `CLOUDFLARE_ACCOUNT_ID`
  is set. The deploy token can only deploy Pages: domains and redirect rules are changed in the
  dashboard or with the owner's `cf` login.
- **`www` redirect** is a zone redirect rule (`http_request_dynamic_redirect`, 301, path and query
  kept). The two proxied `www` A records must stay proxied for it to fire.

## Decisions you will make yourself

- The hero's promise sentence and the three highlights per tool, if the owner does not supply them.
  Write them in all three languages; keep them short and plain.
- The real `tg inbox --json` shape for the hero: take it from tg's docs (`docs/usage.md`, "For
  scripts and agents") or a test-profile run, every value replaced.

## Do not read or touch

- `content/docs/max/`, `content/docs/tg/`, `public/max/`, `public/tg/` — generated by `pnpm sync`,
  ignored by git. Fix a page in its tool's repository instead.
- `out/`, `.next/`, `.source/` — build output.
- The tools' pages themselves, from here: any change goes to max-cli or tg-cli in a pull request.
- The DNS of `wirecat.dev`, unless the owner asks.

## How to check it is done

```sh
pnpm install
pnpm lint && pnpm typecheck && pnpm test
pnpm sync --ref main && pnpm exec next build && pnpm check:links
pnpm exec serve out -l 4317    # then open http://localhost:4317 — stop it by its PID afterwards
```

Live: `https://wirecat.dev/en`, `/ru`, `/es`; `https://wirecat.dev/llms.txt`.
