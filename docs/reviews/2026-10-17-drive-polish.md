# Drive public-release polish

Runtime pin remains v0.15.0, with Core 0.301.0 / Base 0.40.0. The documentation-only overview,
configuration and usage overrides use Drive source e5b5bfb33334bf0039683a4cbc7015052eca1e9e.
No new Sheets editing command or unshipped runtime behavior is documented.

## Reader review

| Page / locales read | Reader task | Findings and correction | Evidence |
| --- | --- | --- | --- |
| index / en, ru, es | Decide whether Drive handles the user's files | Explicit Sheets read/search boundary; TSV included; images distinguished from optional picture search | Native Google source exports Sheets as XLSX; usage/search guides and Google SDK tests |
| configuration / en, ru, es | Change and verify settings | Move the explanation of defaults/profile precedence directly below its three-command example | config commands and one-time migration executable check |
| usage / en, ru, es | Import and inspect cached content | Include explicit profile in the sync counter explanation | Executable profile.required check; unchanged released sync contract |
| installation / en | Install and connect through shared app or custom client | Reviewed existing three steps, separate installation alternatives and return path after custom app setup; no edit needed | Existing Drive browser installation checks across all locales |

Read the changed native guides and translated pages, including their unchanged openings and endings.
Preserved routes, incoming anchors, executable fences and runtime pins. Reviewed Sheets limitation,
optional image behavior, local storage and remote-write boundaries. Generated references stay untouched.
Translation fingerprints accepted after prose review and structural checks, not used as a prose substitute.

## Validation

Source contracts refreshed against the exact reviewed npm releases. Focused Drive executable evidence
is in [cli-testing](https://github.com/WireCatLabs/cli-testing/tree/main/performance/documents/drive-release-polish).
Local strict docs passed: 1,333 reference entries, zero gaps and zero invalid examples; 306 unit tests passed.
Drive browser results will be recorded in the PR once complete.
Full export and broader browser coverage remain CI deployment gates. No Google access or owner data used.
