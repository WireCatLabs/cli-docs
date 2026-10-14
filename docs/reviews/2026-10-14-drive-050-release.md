# Drive JSON contract and settings release review

Reviewed release: Drive `v0.5.0`, runtime/source commit `41740ae152e118915bd335cccb7d84c8b4cfe9cf`, cli-core `0.268.0`, cli-base `0.27.2`. GitHub release workflow `38574754361` passed, including full validation, and npm's exact version plus registry-installed discovery were verified. Retired Drive guide overrides because the released native guides include them. Other tools' pins/overrides are preserved.

| Native page / locales | Reader task and change | Evidence | Review |
| --- | --- | --- | --- |
| Configuration / EN, RU, ES | Use snake_case settings; understand automatic legacy-file migration without renaming profile/permission/purpose identifiers | Shared loadSnakeCaseConfig, config migration test (mode and one rewrite), conflict refusal | Whole affected guide read; terms, commands and links preserved |
| Usage / EN, RU, ES | Read the new machine response envelope and retain provider/user dictionaries | Standard envelope schemas, output tests and previous-store upgrade contracts | New paragraph translated; import/storage action boundaries unchanged |
| Search / EN, RU, ES | Read meaning_skipped and use picture_search | Shared search result adapter, empty/indexed search regression | Source/locale changes checked against released behavior |
| Commands / EN, RU, ES | Exact settings argument syntax | Registry-derived reference, fresh isolated discovery contract | Generated operation descriptions remain source-language technical reference |
| Changelog / EN, RU, ES | See the breaking contract and compatibility behavior | Merged Drive PR35; 165 tests; 90.21% lines; Node/Bun installed package smoke | Source-language technical history retained with the existing locale notice |
| Installation / EN, RU, ES | Same reviewed three-stage path and optional custom client | Included unchanged from prior source override in this release | Prior first-run review remains applicable |

The release changes JSON consumers: single/rich results live under item; simple lists expose items/page; meta names the invocation and duration. Discovery is the shared contract-2 document. MCP validates inside Drive and returns the same answer without an extra result wrapper. Native app controls also moved to snake_case so config show agrees with the file; old config-set spellings remain aliases. OAuth consent, profiles, indexed data and remote-write grants are unchanged.

Checks: native release full validation; fresh registry command contracts; source/translation structure and fingerprints; strict documentation and release-note checks; targeted browser, smoke, lint and types before publication. Drive has no roadmap page, so no roadmap fingerprint is required. Full export/link/browser checks run in deployment CI.
