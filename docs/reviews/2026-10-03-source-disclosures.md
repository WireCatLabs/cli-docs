# Source disclosures and docs footer — 3 October 2026

Applied the available Impeccable refinement/motion guidance while preserving the reviewed site identity. The launcher was unavailable, so PRODUCT.md and docs/DESIGN.md supplied the project context.

- Replaced evidence anchors with native details/summary rows: sender, message ID, chat, messenger and date. Right-pointing SVG chevrons turn down when open. No hash navigation or document scroll.
- Opened messages are brought into view only inside the chat pane. Reading stops replay from auto-scrolling past the quote, and disables conflicting smooth scrolling. Native Enter/Space support and reduced-motion feedback remain.
- Removed generic “demo message” captions. Added correct sender names, including the voice-note author. Illustrative data remains described as such in contributor documentation.
- Replaced artificial repeated-advertising text and invalid domains with natural promotional messages in Russian, English and Spanish. Quotes match the earlier displayed message results.
- Documentation/GitHub/npm tool-card links now have stationary color/underline/icon hover feedback and open in a new tab with noopener/noreferrer.
- Docs use the landing’s shared SiteFooter, including configured contacts, navigation, locale-preserving language selection and working theme control. The footer sits outside the documentation grid so the sticky sidebar cannot cover it; theme styles are included explicitly.

Validation: lint, 35 tests, types, production build, internal links and diff whitespace pass. Browser verification covers TG/MAX in three locales, repeated disclosure clicks, keyboard use, unchanged URL/window scroll, stable reading during animated replay, link hover/new-tab behavior, docs footer/theme controls and four widths from 320 to 1440px. No overflow or JavaScript errors. Work remains local; no remote CI/deployment performed.

Follow-up: collapsed sources were reduced to small single-line rows; the setup link was removed from request bubbles and copying moved to their bottom-right corner. Corrected the Russian footer label to CLI + skill. Verified compact row height, disclosure stability, clipboard and alignment on mobile/desktop for all three locales and both messengers.
