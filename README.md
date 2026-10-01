# cli-docs

The documentation site for the owner's command line tools — today
[max](https://github.com/leemour/max-cli) and [tg](https://github.com/leemour/tg-cli). Built with
[Fumadocs](https://fumadocs.dev) as a static site, in English, Russian and Spanish, and readable by
agents: `/llms.txt`, `/llms-full.txt` and a Markdown copy of every page.

**The pages are not written here.** Each tool keeps its own in its repository's `docs/`, laid out by
[STRUCTURE.md](docs/STRUCTURE.md); `pnpm sync` copies them at the tool's newest release tag.

## Running it

```sh
pnpm install
pnpm sync --ref main     # the tools' pages; without --ref, their newest release tags
pnpm dev                 # http://localhost:3000
```

`pnpm build` is `pnpm sync` (release tags) and `next build`, into `out/`. Then:

```sh
pnpm lint && pnpm typecheck && pnpm test
pnpm check:links         # every link inside out/ leads to a page and, with an anchor, a heading
```

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
Cloudflare Pages (project `cli-docs`) on a push to `main`, daily, and on a tool's release signal.
It needs the secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`; without them it builds and
says it did not deploy.

## Licence

MIT.
