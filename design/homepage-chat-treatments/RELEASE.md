# Selected editorial release

Owner selected `/landing-editorial` and authorized production release in English, Russian and Spanish on 2026-10-09.
Release branch `feat/editorial-homepage-20261009`, based on latest production `10842bf`.
Existing development work in the older `design/landing-variants` checkout is preserved and excluded from this release.

Production sequence and identity match `EDITORIAL-SELECTION.md` and `DESIGN.md`:
Memory hero → open Personal/Bots/Admin lists → outcomes on full-width paper → tool inventory → nine reasons → trust → estimate → setup → footer.
Complete conversations, checked tools, sources and two follow-ups remain. Localized feature and examples pages use the reviewed three-role feature layout and sidebar scenario library.
Only necessary release adaptations: locale menu, current owned links, isolated scoped CSS, Next theme/navigation, listener cleanup, local parser and installation analytics.
No new design exploration or commercial claims. Fixtures stay fictional; English code/results are annotated where retained. Estimates remain editable and qualified.

Source: `release-source.json`, `release-locales.json`; generator `scripts/export-editorial.mjs`; public snapshots `lib/editorial/{en,ru,es}.json` and `editorial.css`.
Client interactions: `components/landing/editorial.tsx`. Public routes: `/`, `/ru`, `/es`, `/{lang}/features`, `/{lang}/examples`.
Full search remains `/{lang}/docs/search-playground`. About and docs retain their existing layouts.

Private material stays in `design/`, absent from the export and sitemap. Full historical inventories in `DESIGN-LINKS.md` and `design-registry.json`; restore all five collections with `pnpm design:serve`.
Current indexes: http://127.0.0.1:4329/studio, http://127.0.0.1:4329/block-library, http://127.0.0.1:4329/all-designs.

Release captures: `.impeccable/review/release/{en,ru,es}-{home,features,examples}-{desktop,mobile}.png`, plus `{en,ru,es}-home-dark.png`.
21 captures: 1440/390 widths, no overflow, JS errors or axe violations. Interactive checks cover scenarios, two follow-ups, query recovery, calculation, feature disclosures and example/provider selection.
Detector `/tmp/wirecat-release-detector.json`: imported cascade includes non-rendered legacy Anybody/bounce/sidebar rules. Rendered selected typography, surfaces and controls remain the approved world.
