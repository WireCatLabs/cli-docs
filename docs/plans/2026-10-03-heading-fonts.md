# Heading font comparison

The owner requested matching search/section typography and about 20 bold, expressive, non-cartoonish fonts to rotate through the existing comparison concept. The prototype has previous/next font controls, excluded from the exported landing. Restore this as a React comparison panel enabled by `?fonts=1`, with a direct picker, previous/next, reset and shareable `font=<id>` selection. Keep ordinary landing visits on the reviewed face.

Unify landing heading family, weight and width through locale-specific CSS variables owned by the exporter. Include the search heading in that system. Body text and documentation typography keep their normal faces. A selected face updates hero, section and card headings together.

The 20-family shortlist is in `lib/landing/heading-fonts.json`: condensed editorial faces, heavy grotesks and geometric sans faces, including Anybody as the baseline. Google Fonts' current metadata, CSS and OFL licenses provide source/coverage evidence; source URLs, hashes and licenses live in `public/fonts/heading-lab/`. Assets are self-hosted and loaded only when selected. Russian options without Cyrillic are disabled rather than displaying a fallback as the chosen face. Narrow/normal/wide widths remain explicit per candidate.

Verify real loading and computed family/weight/stretch for all 20 faces, consistent search/hero/section headings, body stability, next/previous wrap, reset, URL retention/reload, Russian coverage, mobile overflow and panel accessibility. Run existing search checks, lint/typecheck/unit tests, static export and link checks. Search playground PR #18 has merged. Keep this font-comparison follow-up in a draft PR; font selection is for review and no production deployment of this follow-up is authorized.
