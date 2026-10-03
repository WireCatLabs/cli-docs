# cli-docs

The documentation site for the owner's command line tools, at [wirecat.dev](https://wirecat.dev) — today
[max](https://github.com/leemour/max-cli) and [tg](https://github.com/leemour/tg-cli). Built with
[Fumadocs](https://fumadocs.dev) as a static site, in English, Russian and Spanish, and readable by
agents: `/llms.txt`, `/llms-full.txt` and a Markdown copy of every page.

How the site is laid out: [docs/DESIGN.md](docs/DESIGN.md). Picking up the work:
[HANDOFF.md](HANDOFF.md).

Each tool keeps its reference pages in its repository's `docs/`, laid out by
[STRUCTURE.md](docs/STRUCTURE.md); `pnpm sync` copies them at the tool's newest release tag.
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
pnpm sync                # newest released tools, with reviewed translations
pnpm dev                 # http://localhost:3000
```

`pnpm build` is `pnpm sync` (release tags) and `next build`, into `out/`. Then:

```sh
pnpm lint && pnpm typecheck && pnpm test
pnpm check:links         # every link inside out/ leads to a page and, with an anchor, a heading
```

## Landing page

The home page preserves the reviewed `design/landing/g-home*.html` design in all three languages.
Run `node scripts/export-landing.mjs` after editing those prototypes or
`design/landing/scenario-variants.js`; it exports trusted static markup, the eight selected
demo sessions and scoped CSS into `lib/landing/`. The complete scenario bank is preserved in
`docs/LANDING_SCENARIOS.md`, and marketing copy in `docs/MARKETING.md`. Production omits the design
switches and experimental feature variants. Agent setup links lead to the shared documentation.
`components/landing.tsx` adds demo, replay and copy interactions and cleans them up on navigation.
Fonts, including the selected Fira Sans Extra Condensed for Russian, are served locally from `public/fonts/`, with their
OFL licences. Browser icons are wired in the shared metadata; run
`node scripts/export-favicons.mjs` (ImageMagick required) to regenerate them from `app/icon.svg`.
Site name, URL, repository and public contacts are configured in [site.config.json](site.config.json).
The footer and About page use the same contacts in all languages. Edit the config and rebuild the site;
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
