# Handoff — WireCat docs site

## What this is

`cli-docs` is the documentation site for the owner's command line tools, served at
[wirecat.dev](https://wirecat.dev): **WireCat — AI Messaging with CLI tools for agents**. It is a
static [Fumadocs](https://fumadocs.dev) site (Next.js export) in English, Russian and Spanish. It
writes no tool's pages itself: `pnpm sync` copies each tool's `docs/` from its repository at its
reviewed `docsRef` tag in `tools.json`. Cloudflare Pages serves it; GitHub Actions builds and deploys it. How to run it:
  [README.md](README.md).

The portal now also owns shared getting-started, installation, agent and MCP guides in
`content/docs/`, in English, Russian and Spanish. Tool reference pages remain generated.

## Where things are

- [docs/DESIGN.md](docs/DESIGN.md) — **start here**: the site map, what every page shows, the rules.
- [docs/STRUCTURE.md](docs/STRUCTURE.md) — the pages every tool has, and the checks that hold them.
- [docs/plans/2026-10-02-docs-onboarding.md](docs/plans/2026-10-02-docs-onboarding.md) — the shared
  installation and five-agent guides, MCP explanation, top messenger/language controls, and checks.
- [docs/plans/2026-10-02-landing.md](docs/plans/2026-10-02-landing.md) — the earlier landing outline.
  The implemented design follows the owner’s screenshot and `design/landing/g-home*.html`.
- [docs/plans/2026-10-02-onboarding.md](docs/plans/2026-10-02-onboarding.md) — separate MAX/Telegram
  install controls implemented; Windows package installation CI added; findings and next CLI PRs
  for setup, PATH and Telegram credentials. The reviewed landing design is now implemented locally.
- [docs/plans/2026-10-01-portal-v1.md](docs/plans/2026-10-01-portal-v1.md) — how the site was built
  and what the spike found; its "Where it stands" section is the status list.
- [tools.json](tools.json) — the tools: repository, npm package, the language of its pages, summary.
- The session journal (optional, the history of how this came about) is in max-cli's private
  `docs_ai/journal/`: `2026-10-01-docs-site.md` and `2026-10-02-docs-site.md`.

## What to read for each next task

### 1. The landing page — implemented from the reviewed prototype

The owner explicitly requested the `design/landing/g-home*.html` design, including the patterned
background, large typography, demo and all sections. `app/[lang]/(home)/page.tsx` now renders
`lib/landing/{en,ru,es}.json` with `components/landing.tsx`. Regenerate those snapshots and scoped
CSS with `node scripts/export-landing.mjs` after a prototype change. Fonts and licences are in
`public/fonts/`; no external font request is needed. Agent installation commands belong in docs:
the export replaces the prototype's skill setup and closing command with documentation links.
Production removes the design controls and uses feature variant 6. Home uses its own header;
docs retain the separate Fumadocs layout. About now lives at `/{lang}/about` (`lib/about.ts`),
with custom chatbot/integration details and the owner-supplied `hello@wirecat.dev` contact.
Russian display headings use Fira Sans Extra Condensed, as selected in commit b41b263; the export preserves each prototype’s data-ff choice. Documentation uses the quieter animated SVG
logo and highlights Getting started in the header and sidebar on all shared guides.

### 2. Release sources

Verified release boundary, 2026-10-08: default `pnpm sync` uses **max v0.35.0** and **tg v0.36.0**,
the reviewed pins in `tools.json`. The full tool guides and start pages are reviewed in EN/RU/ES;
source fingerprints and portal errata move with these tags. The shared search architecture page
uses the same release boundary. Use the pinned refs for checks; `--ref main` is only a preview.
The completed translation scope and validation are recorded in
[the final reader-release review](docs/reviews/2026-10-08-final-reader-guides.md) and
[the archive-preparation record](docs/plans/2026-10-08-archive-preparation.md).

### 3. Translations of the tools' pages

The full tool guides are available in English, Russian and Spanish. Changed prose is reviewed
against the released source before publication; translation drafts alone do not approve a fingerprint. Durable files live in `translations/{tool}/{slug}.{lang}.md`, with concise start pages
in `translations/overviews/`. `pnpm sync` captures untouched release pages in ignored
`content/upstream/`, then validates and installs translations. Source fingerprints in
`translations/sources.json` are specific to each translated locale; a release change requires
reviewing each affected translation before updating its fingerprint. Original heading anchors,
command examples, inline literals and link destinations are checked automatically. Reviewed source
errata are applied after validation from `scripts/docs-corrections.json` and fail if their exact
text no longer matches. Review findings are in `docs/reviews/`.

### 4. Later ideas

`IDEA-107` (compare page), `IDEA-108` (searchable reference), `IDEA-109` (sitemap, previews,
analytics, "Edit on GitHub" at the tag), lychee weekly, the release signal from each tool — each is
one paragraph in [docs/DESIGN.md](docs/DESIGN.md), "Later". None is planned yet; write a plan first.

## What will bite

- **Every release tag needs `docs/meta.json`.** `scripts/sync.ts` refuses a tag that fails the
  structure check. A failed deploy publishes nothing; default sync now works for both tools.
- **Links between pages need `./`.** Fumadocs' `createRelativeLink` resolves `./usage.md` and leaves
  `usage.md` as a dead link; `sync.ts` writes the `./`. Test: `scripts/sync.test.ts`.
- **lychee reports every Russian anchor as missing.** It does not decode `%D0…` anchors. The site's
  own `pnpm check:links` does; trust it, not lychee, for links inside the site.
- **No middleware in a static export.** The root `/` serves the complete English landing with stable metadata. Locale homes are `/ru` and `/es`; `/en` permanently redirects to `/` through Pages `_redirects`, with a static fallback. English subpages retain `/en/`.
- **`llms.txt` and `llms-full.txt` are our own routes**, listing the default language only — the
  template's versions list every page three times, once per interface language.
- **Shiki rejects an unknown fence language** (`cron` in tg's recipes) and fails the build;
  `lib/source.ts` sets `fallbackLanguage: "text"`.
- **Interactive docs need `.mdx`.** A JSX component in `.md` is discarded by the Markdown
  compiler. Shared installation uses `installation*.mdx`; link to it with `./installation.mdx`.
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

Live: `https://wirecat.dev/`, `/ru`, `/es`; `https://wirecat.dev/llms.txt`.
