# cli-docs

The documentation site for the owner's command line tools, at [wirecat.dev](https://wirecat.dev) — today
[max](https://github.com/leemour/max-cli) and [tg](https://github.com/leemour/tg-cli). Built with
[Fumadocs](https://fumadocs.dev) as a static site, in English, Russian and Spanish, and readable by
agents: `/llms.txt`, `/llms-full.txt` and a Markdown copy of every page.

How the site is laid out: [docs/DESIGN.md](docs/DESIGN.md). Picking up the work:
[HANDOFF.md](HANDOFF.md).

Each tool keeps its reference pages in its repository's `docs/`, laid out by
[STRUCTURE.md](docs/STRUCTURE.md); `pnpm sync` copies them at the reviewed release tag in `tools.json` (`docsRef`).
Shared installation, agent and MCP guides live here in `content/docs/`, in all three languages.
Tool translations and the concise entry pages live in `translations/`. They are installed after
release sync; `content/upstream/` holds the untouched release pages locally. `pnpm docs:localize`
checks per-locale source fingerprints, heading structure, executable examples, literals and link destinations.
Changed upstream text requires a translation review before a successful build. Original heading
anchors remain available alongside translated headings, and Markdown copies keep their language.
Reviewed release errata are applied after validation from `scripts/docs-corrections.json`; exact
matches prevent silently applying an old correction to a new source. Findings are in `docs/reviews/`.

## Running it

```sh
pnpm install
pnpm sync                # reviewed released tools, with source-matched translations
pnpm dev                 # http://localhost:3000
```

`pnpm build` is `pnpm sync` (release tags) and `next build`, into `out/`. Then:

```sh
pnpm lint && pnpm typecheck && pnpm test
pnpm check:links         # HTML/Markdown targets, anchors, duplicate IDs and unexpanded components
pnpm check:seo           # metadata, hreflang, JSON-LD, social images, sitemap and robots
PLAYWRIGHT_EXPORT=1 pnpm exec playwright test tests/site-quality.spec.ts
```

## Landing page

The home page preserves the reviewed `design/landing/g-home*.html` design in all three languages.
Run `node scripts/export-landing.mjs` after editing those prototypes or
`design/landing/scenario-variants.js`; it exports trusted static markup, the eight selected
demo sessions and scoped CSS into `lib/landing/`. The complete scenario bank is preserved in
`docs/LANDING_SCENARIOS.md`, and marketing copy in `docs/MARKETING.md`. Production omits the design
switches and experimental feature variants. Agent setup links lead to the shared documentation.
`components/landing.tsx` adds demo, replay and copy interactions and cleans them up on navigation.
The shared home layout renders `SiteHeader` and `SiteFooter` for both the landing and About;
the exporter removes the prototype header and footer from the page body. Header navigation,
theme switching and language selection therefore use the same components on both pages.
Fonts, including the selected Unbounded face for Latin and Cyrillic headings, are served locally from `public/fonts/`, with their
OFL licences. Browser icons are wired in the shared metadata; run
`node scripts/export-favicons.mjs` (ImageMagick required) to regenerate them from `app/icon.svg`.
Site name, URL, repository and public contacts are configured in [site.config.json](site.config.json).
The footer uses public email/Telegram contacts; About uses `contacts.maintainerTelegram` for personal enquiries. These values are shared across languages. Edit the config and rebuild the site;
contact changes do not require regenerating the landing snapshots.
About is a separate localized `/{lang}/about` page; its content is in `lib/about.ts`. The export removes the old inline About section and links to this page.
After the demo, sections are benefits, an editable time estimate, Telegram/MAX, reasons, and a concise daily timeline.

## Adding a tool

1. Lay out its `docs/` by [STRUCTURE.md](docs/STRUCTURE.md), with `docs/meta.json`, and have its
   `pnpm docs:check` run `cli-dev docs-check --pages`.
2. Release it, so a tag carries those pages.
3. Add it to [tools.json](tools.json): name, repository, npm package, the language its pages are
   written in, and a one-line summary in English, Russian and Spanish.
4. In its release workflow, after publishing, send the signal that rebuilds this site:
   `gh api repos/leemour/cli-docs/dispatches -f event_type=docs` with a token allowed to do that.

## Deploying

[deploy.yml](.github/workflows/deploy.yml) builds from the release tags and publishes `out/` to
Cloudflare Pages (project `cli-docs`, served at wirecat.dev) on a push to `main`, daily, and on a
tool's release signal; a failed run publishes nothing. It needs the secrets `CLOUDFLARE_API_TOKEN`
(permission: Cloudflare Pages — Edit) and `CLOUDFLARE_ACCOUNT_ID`; without them it builds and says
it did not deploy. Run it by hand with `ref: main` to publish what the tools are about to release.

## Licence

MIT.

The landing time estimate lives in `components/time-savings.tsx` and `lib/time-savings.ts`. Its timing assumptions are editable, and it shows when manual work would be quicker. Daily/monthly figures are scenario estimates, not product benchmarks.

The scenario top bar switches Telegram/MAX while retaining the current stable scenario ID. Prompts are copyable and link to the matching installation guide. Source links expand illustrated message excerpts with chat/date labels. Shared-store search keeps each result’s original provider and locator; MAX moderation/download syntax is adapted explicitly rather than only renaming the executable.

Documentation presentation is shared in `lib/remark-doc-usability.ts`: inline command mentions link
only to commands present in the current reference, existing links and executable fences stay intact,
and source-build sections on tool installation pages are collapsed. `components/docs-disclosures.tsx`
opens those sections for incoming anchors and TOC links. OS path tables retain all original Markdown
cells and add `components/platform-paths.tsx` for an automatic OS choice and manual comparison.
User-facing release copy adjustments live in `scripts/docs-corrections.json`; they apply after strict
translation validation, so sync preserves both the changes and the untouched upstream references.

Search vocabulary lives in `lib/search-intents.json`: reviewed task descriptions and error wording
are indexed on the matching existing pages in English, Russian and Spanish. `{tool}` becomes the
page's messenger command. Search prioritizes the current messenger unless the query names another;
this adds no model calls or embedding service. Add phrases here and rebuild to cover another task.

## Updating reviewed tool versions

`tools.json` pins each translated tool’s reviewed `docsRef`. Update that tag only after reviewing
every affected locale, its source fingerprint and any portal errata. Tool pages display the reviewed
version and link GitHub views to that tag. This makes daily/release-triggered deploys reproducible
when a newer CLI is released before its translations are reviewed. `--ref` remains an explicit
preview override; unreviewed source changes still fail the translation gate.

Telegram’s generated Bot API method appendix retains the pinned English schema descriptions.
Russian and Spanish pages label that section explicitly and mark it `lang="en"`; the bot guide,
installation steps and surrounding reference remain localized. This is recorded in the reviewed
portal corrections after source-preservation validation.

Current reviewed releases: **tg v0.39.1** and **max v0.38.1**, in English, Russian and Spanish.
The [October 8 guide review](docs/reviews/2026-10-08-reviewed-tool-guides.md) records the source boundary, translation review and retained errata.

### Keeping published documentation current

`tools.json` pins reviewed GitHub releases. The **Documentation release check** workflow checks GitHub stable releases and npm every day, on demand, and whenever the pins change. It maintains one tracking issue with source comparisons, changed public pages and a translation/errata checklist. When both tools are current, it closes its own tracking issue. The report is also available in the workflow summary. It needs only the repository's built-in token; no translation-service key is required.

Run the same check locally:

```sh
pnpm docs:updates
```

Prepare an update in an isolated checkout:

```sh
pnpm docs:updates --prepare
```

Preparation verifies that GitHub and npm agree, captures the new upstream pages, and advances the proposed `docsRef` values. It leaves translations, correction rules and review fingerprints unchanged. Reports are written to ignored `.docs-updates/report.md` and `.docs-updates/updates.json`. Review changed pages, translate new or changed prose, and check command examples and errata before marking fingerprints reviewed. Unchanged content keeps its existing fingerprint.

To capture one released tool without replacing the localized site pages:

```sh
pnpm sync --tool tg --capture-only
```

The remaining review gates are `pnpm docs:localize`, lint, tests, `pnpm search:check`, type checking, build, link checks and browser checks. CI rejects missing, stale or structurally changed translations. The scheduled workflow reports updates; it does not merge or deploy unreviewed documentation.

### Analytics and agent-readable documentation

Production-only GA4 and Yandex Metrika IDs live in `site.config.json`. Tracking loads after
hydration on the configured production hostname; browser checks use intercepted provider scripts
and requests. Local previews do not load the JavaScript tags.

Markdown twins resolve documentation links to their own Markdown URLs and expand the shared
installation component into instructions and agent prompts. `pnpm check:links` validates HTML
and Markdown targets and keeps code blocks intact. Deployment runs lint, tests, reviewed-release
sync, type checking, build, link/SEO checks and production browser checks before publication.

Localized search and social metadata are assembled in `lib/seo.ts`; reviewed descriptions live in
`lib/seo-copy.json`. Sitemap and robots routes export from the same public documentation source.
Social cards are generated locally at `/og/{en,ru,es}.png`. JSON-LD describes pages, breadcrumbs and
released source facts. Adding an undocumented tool reference without reviewed description copy
fails the build. Production builds also reject a missing or local public origin.

Documentation uses the same licensed Inter font, stored under `public/fonts/docs-inter/` with its
source hashes and licence. Docs routes preload their Latin/Cyrillic subsets through the shared layout;
landing routes use the existing selected heading/body fonts.

The browser quality suite checks representative landing, installation and long-reference pages
in every language at desktop/mobile widths, plus deferred search, keyboard dismissal and native
agent resources. `PLAYWRIGHT_EXPORT=1` serves `out/` with real 404s; the default browser configuration
continues to support development checks. Private full-site audit tools, credentials instructions
and detailed evidence live in the owner's separate `max-cli/docs_ai` repository.

### Inline documentation explanations

Use `<DocTerm term="local-agent" lang="ru" label="локального агента" />` in authored MDX to add
an inline information button. The popover supports hover, click, keyboard and touch, with Escape
and a close button. Definitions and localized guide destinations live in `lib/doc-terms.ts`.
Markdown twins expand the same definitions into readable text; code examples remain intact.
Use `<NodeSetupPrompt lang="ru" />` for the copied prerequisite-installation request; its
localized text lives in `lib/words.ts` and is also expanded into Markdown twins. Node.js and npm
explanations use the same term dictionary. The getting-started page introduces the outcome and
account connection before explaining CLI, skill and MCP. Documentation links use color, hover
and keyboard focus without underlines.
Installation prompts are short and platform-neutral. Windows environment recovery stays in each
cli's installation reference, rather than in the copied prompt.

`public/telegram-app-login.png` is an unmodified screenshot of the public
[my.telegram.org/apps login page](https://my.telegram.org/apps), captured on 2026-10-04 in a fresh
unauthenticated browser. No phone number, login code, API credentials or account QR was entered.
Its localized captions are reviewed portal corrections for the Telegram sessions page.

Documentation authoring: [rules](docs/AUTHORING.md), [task index](docs/README.md) and
[tooling](docs/TOOLING.md). The [implementation plan](docs/plans/2026-10-07-documentation-system.md)
records the source baseline and validation.
