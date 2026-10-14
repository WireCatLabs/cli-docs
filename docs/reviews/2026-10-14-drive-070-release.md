# Drive field-selection release review

Reviewed runtime: Drive v0.7.0, source/tag commit dbaf2176e48d69f6b9cef74d47f5ad8dffe8972f,
Core 0.278.0 and framework 0.28.2. Release workflow 38634638678 passed. The exact npm version
and tag were verified; a fresh npm installation passed 41 synthetic CLI invocations and three
real stdio MCP validation/audit calls using blocked HTTP/browser/keyring access. No live Google
account or provider writes were tested.

The native selector validated catalog fields against the generic document shape. Core PR1221
adds an optional provider-field resolver without changing existing callers; Drive PR44 declares
its catalog view and validates read-result fields before printing. Undeclared write selection
is refused before execution. Prior-store upgrades and installed Node/Bun package smoke passed;
174 native tests passed with 90.8% line coverage. Command lint remains 67 inherited findings,
zero new/overridden, with unchanged budget. cli-testing PR59 owns reproduction and results.

| Page / locales | Reader result | Source and review |
| --- | --- | --- |
| Usage / EN, RU, ES | Complete the import/read/organize/export workflow before optional machine-output details; select catalog fields and understand JSON/JSONL, terminal behavior and write refusal | Released provider resolver/actual-output validation, CLI projection cases and native atomic/write-preflight tests; moved protocol prose to the final structured-output section; translated new guidance and preserved all existing executable fences |
| Commands / EN, RU, ES | Discover JSON field selection in the exact generated option descriptions | Released registry and native generator; localized introductions retained, source-language technical reference updated |
| Changelog / EN, RU, ES | Read the released field-selection and effects changes | Released changelog; existing source-language technical-history notices retained |
| Configuration / EN, RU, ES | Discover field selection among invocation options, separate from saved settings/environment | Released configuration table adds --json=id,title; translated only its description |
| Installation, search and recipes / EN, RU, ES | Keep existing setup and cached-data workflows | No behavior claims or executable examples changed; prior reviews remain applicable |

Compared MAX's usage orientation and generated-reference structure: Drive keeps outcomes and
ordinary tasks first, optional output detail later, with the command reference as the technical
handoff. Provider-specific login instructions remain in Drive's installation guide. The new
structured-output section defines JSON/JSONL's purpose before fields/envelopes and explains
interactive terminals versus agent/pipe usage. Completeness concerns the returned answer, not
proof that all Google sources have been imported. Provider/user dictionary keys retain their
vocabulary and catalog fields are distinct from generic document fields.

Retire Drive's usage override: its correction is included in the released tag. Preserve all
other tools' pins and overrides. Review the eight changed translation fingerprints only after
source/locale structure and prose comparison. Publication requires authoritative tag sync,
fresh registry contracts, strict docs/release-note checks, lint/types, unit tests, browser smoke
and affected Drive cases. Full production export, links, SEO and browser shards run in CI.
Drive has no roadmap page, so no roadmap fingerprint is invented.
