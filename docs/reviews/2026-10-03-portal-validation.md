# Portal validation — 3 October 2026

Source releases: **tg-cli v0.22.0**, **max-cli v0.23.0**. Full tool documentation is available in EN,
RU and ES: 65 durable translation overlays, six portal-owned overviews, and the original native guides.
Full command references and changelogs are retained. Literal terminal outputs/examples remain as
published, apart from individually reviewed errata applied after translation checks.

## Passed locally

- `pnpm lint`: 70 files, no errors.
- `pnpm test`: 18 tests, four suites. Covers navigation, release selection/link conversion,
  heading aliases, nested/indented code parsing, command/literal/link preservation, actual fallback
  language, exact-match corrections and independent per-locale freshness.
- `pnpm typecheck`: passed.
- `pnpm build`: sync from the two release tags and a complete production export, 241 static routes.
- `pnpm check:links`: all internal pages and fragments valid.
- `git diff --check`: passed.
- Browser checks at **http://localhost:4317**: six localized overviews and Markdown guides;
  messenger/start selection; language changes retaining the current guide; Russian search opening
  the translated session guide; original incoming fragment anchors; three docs viewport widths;
  no JavaScript errors.
- Landing checks: section order and four daily times in three locales at six widths (320–1440);
  stationary button hover/press, clipboard actions, keyboard/reduced-motion behavior; real font
  rendering (Fira Sans Extra Condensed 900/100% RU, Anybody EN/ES, Inter docs); no horizontal overflow.

The local server serves the refreshed production `out/` on port 4317.

## Publication and limits

Changes are local and uncommitted. Remote CI was not run and production was not deployed. Publishing
requires committing the reviewed site changes and passing remote CI before the site deployment; no
new CLI release is needed to publish translations of these already released tool versions.

Account login, live sends, moderation and remote chat-product connectors were not exercised. Shell
error-code corrections were verified with stubs, and disputed MAX flags/cache/MCP behavior with code
and tests at v0.23.0. Remote connector availability/setup remains explicitly unverified in the guides.
Future changed source pages must be reviewed for each locale before the sync/build gate passes.
