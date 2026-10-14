# Drive contract-3 release review

Review Drive v0.6.0 from npm and release commit `11008772bde9bc46910a5b8afcd8173fb4be271f`:
Core 0.275.0, framework 0.28.2. Release workflow 38619750507 passed. Independent installed-package
acceptance in cli-testing PR53 passed 35 CLI invocations and three real stdio MCP validation/audit
calls with synthetic data and blocked HTTP/browser/keyring access. The updated runner also passed
the prior npm 0.5.0 package. No live Google account or provider writes were used.

The release source's import guide retained contract 2. Drive PR40 corrects that guide and stale
developer alignment/testing statements. The portal uses immutable documentation-only source
`a163251c45855355efda866726aaa7cea2d3d2f9` for usage while pinning runtime and other guides to
v0.6.0. The override describes only released capabilities; it does not import future runtime work.

| Pages / locales | Reader result and change | Evidence and review |
| --- | --- | --- |
| Usage / EN, RU, ES | Interpret contract-3 effects, completeness, page/JSONL output and removed flags; understand resumed initial walks and batched recovery | Installed strict envelope validation, command metadata, distinct catalog/note pages, JSONL end record, removed/unknown-flag refusal; release sync tests/changelog; whole affected source/locale passages read |
| Search / EN, RU, ES | Select a result page with --page, keeping imported scope unchanged | Compiled search page check; executable examples identical across locales; old --offset example removed |
| Configuration / EN, RU, ES | Choose JSON/JSONL while understanding MCP control-character display | Released global options and MCP adapter; --agent-json removed from invocation table |
| Commands / EN, RU, ES | Discover current flags and argument syntax | Generated native reference and fresh pinned npm command contracts; translated openings retained, technical operation descriptions remain source-language |
| Changelog / EN, RU, ES | Read contract changes and first-walk recovery boundary | Released v0.6.0 changelog; existing source-language technical-history notices retained |
| Installation / EN, RU, ES | Follow the existing three-stage npm/agent, consent and import journey | Unchanged reviewed guide and incoming anchors; no app setup or additional consent introduced by this release |

The guide still distinguishes live reads, imported content, cached reads and optional exports.
Profiles, Google grants, snapshot retention, provider dictionary keys and the 10,000-entry cap
retain their existing boundaries. A completed command/page does not certify complete Drive coverage.
The technical output details retain exact literals, including error.retry.safe and api_operation.

Native Markdown checks passed before PR40 merged, with all three PR checks passing. Portal
publication requires fresh registry contracts, reviewed translation fingerprints/structure, strict
docs and release-note checks, lint/types, unit tests and affected Drive browser checks. Full
production export, links, SEO and browser shards remain deployment gates. Drive has no roadmap
page, so no roadmap fingerprint is invented.
