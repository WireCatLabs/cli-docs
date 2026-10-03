# Search playground verification

- Shared parser browser bundle: 20,042 bytes before its provenance header; reproducible, source fingerprint and Apache/MIT notices checked. Base UI is imported through its autocomplete subpath.
- 47 unit/service tests pass, including direct comparison of matched ids and surrounding context with real SQLite search for Boolean precedence/negation, phrases, patterns, dates, author/chat, enum casing and attachment predicates.
- Seven Playwright checks pass: EN/RU/ES, typing/keyboard completion, mobile/reduced-motion/theme behavior, filter suggestions, clipboard contents and automated accessibility in both themes. Dark caption contrast was corrected after the accessibility check reported ratios below 4.5:1; no rule was disabled.
- Static Next export and `check:links` pass from the locally captured docs. The default `pnpm sync` fails in unchanged `scripts/docs-corrections.json`/`scripts/localize.ts`: old Telegram usage/security replacements no longer match release source text. No translation fingerprint was blindly updated and no release-sync check was bypassed.
- Active uncommitted scenario/docs changes in the original `cli-docs` checkout are untouched. The isolated feature branch can be rebased and integrated after that work lands.
- No real archive, account credentials, network messenger calls or AI summary service used. Summary assertions are conditional on their retrieved supporting sample messages.
