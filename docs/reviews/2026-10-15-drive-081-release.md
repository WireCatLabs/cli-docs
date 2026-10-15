# Drive vocabulary and installation-graph release review

Initial portal base: a0b905a; rebased onto 289672d, preserving the separately reviewed
TG 0.56.0/MAX 0.53.0 pins and shared lint changes. Final base: ae18313 after
the separately reviewed translation repair (#239). Reviewer: Codex. Runtime source reviewed: Drive 0.8.1 at
420fcb902e9913b454527bbd77c715138044df0d; Core 0.283.0, Base 0.31.1.
Release run 38667138731 passed; npm 0.8.1 and the authoritative v0.8.1 source capture are verified.
Other tool pins and guide overrides are unchanged.

Drive 0.8.0 introduced breaking option vocabulary and cursor/list envelopes. The portal still
reviewed 0.7.0, so installation through current npm led to obsolete export examples. 0.8.1
also aligns the actual npm dependency graph; source tests alone missed two Base instances.
Source comparisons, 41 synthetic CLI/three MCP checks, Node/Bun tarball smoke, 181 native
unit tests, config-upgrade checks and copied-cache validation support the reviewed behavior.
Real-data observations remain in cli-testing's aggregate report and cli-private evidence;
no real account/document names or bodies belong in user guides.

Compare MAX's current installation/usage structure: install with an agent OR npm, connect an
explicit profile through browser consent, then select/import a folder and check coverage.
The shared WireCat app is the primary path; a custom Desktop OAuth client stays optional.
That existing installation path is unchanged. Structured output detail remains after ordinary
import/read/organize/export tasks. Search introduces the practical title-order consequence
before naming found_by. No source build is introduced.

| Page / locale | Reader task | Orientation and terms | Behavior evidence | Links/exports and review |
| --- | --- | --- | --- | --- |
| Usage / EN | Import, inspect cached sources and export only needed files | Outcome-first opening and practical handoff retained | --output; provider lists expose page.next_cursor; local lists retain next_page | Reviewed; existing paths/anchors preserved |
| Usage / RU | Import, inspect cached sources and export only needed files | Outcome-first opening and practical handoff retained | --output; provider lists expose page.next_cursor; local lists retain next_page | Reviewed; existing paths/anchors preserved |
| Usage / ES | Import, inspect cached sources and export only needed files | Outcome-first opening and practical handoff retained | --output; provider lists expose page.next_cursor; local lists retain next_page | Reviewed; existing paths/anchors preserved |
| Recipes / EN | Complete source-backed work and pass Markdown to another tool | Outcome-first opening and practical handoff retained | Export flag, cursor guidance and native document_id correction | Reviewed; existing paths/anchors preserved |
| Recipes / RU | Complete source-backed work and pass Markdown to another tool | Outcome-first opening and practical handoff retained | Export flag, cursor guidance and native document_id correction | Reviewed; existing paths/anchors preserved |
| Recipes / ES | Complete source-backed work and pass Markdown to another tool | Outcome-first opening and practical handoff retained | Export flag, cursor guidance and native document_id correction | Reviewed; existing paths/anchors preserved |
| Search / EN | Find title matches and understand word versus meaning search | Outcome-first opening and practical handoff retained | Plain-word title ranking and found_by title; field/Boolean queries retain text ordering | Reviewed; existing paths/anchors preserved |
| Search / RU | Find title matches and understand word versus meaning search | Outcome-first opening and practical handoff retained | Plain-word title ranking and found_by title; field/Boolean queries retain text ordering | Reviewed; existing paths/anchors preserved |
| Search / ES | Find title matches and understand word versus meaning search | Outcome-first opening and practical handoff retained | Plain-word title ranking and found_by title; field/Boolean queries retain text ordering | Reviewed; existing paths/anchors preserved |
| Commands / EN | Look up the exact current argument/option vocabulary | Outcome-first opening and practical handoff retained | Generated source reference copied; translated introduction and established headings retained | Reviewed; existing paths/anchors preserved |
| Commands / RU | Look up the exact current argument/option vocabulary | Outcome-first opening and practical handoff retained | Generated source reference copied; translated introduction and established headings retained | Reviewed; existing paths/anchors preserved |
| Commands / ES | Look up the exact current argument/option vocabulary | Outcome-first opening and practical handoff retained | Generated source reference copied; translated introduction and established headings retained | Reviewed; existing paths/anchors preserved |
| Changelog / EN | Read technical release changes | Outcome-first opening and practical handoff retained | Released source-language history retained with localized orientation | Reviewed; existing paths/anchors preserved |
| Changelog / RU | Read technical release changes | Outcome-first opening and practical handoff retained | Released source-language history retained with localized orientation | Reviewed; existing paths/anchors preserved |
| Changelog / ES | Read technical release changes | Outcome-first opening and practical handoff retained | Released source-language history retained with localized orientation | Reviewed; existing paths/anchors preserved |

The native create-document recipe now names `document_id`: `program.ts` routes the result
through `output.ts` snakeKeys. Google request-body keys remain unchanged. Nested projection
uses Base's shared envelope projector; descriptions explain payload-relative paths and that
field selection reduces output rather than scanned work. No generated command reference is
edited by hand.

No roadmap page exists for Drive, so no roadmap hash/review record is invented. The existing
source scope, disk retention, local/Google effects, optional extraction and unsupported-format
boundaries remain. No new OAuth, OCR, AI extraction or remote-write guarantee is inferred
from the bounded saved-session validation.

Publication evidence is appended after authoritative source capture, translation review,
contracts/strict docs checks, targeted tests and browser checks, then CI/deployment verification.

## Validation

Authoritative tag capture and localization passed; all ten changed locale fingerprints were
reviewed, and the release's later changelog-only additions were recaptured/reviewed separately.
The generated command reference retains native technical descriptions and established localized
introductions/headings. Source comparison also used MAX's usage, recipes, search, commands and
changelog structure: reader task first, explicit profile/scope and action boundaries, complete
reference separately. Drive retains its provider-specific folder and text-reader behavior.

Fresh installed-package contracts passed. Strict portal checks report 1,289 reference entries,
zero reference gaps, zero invalid examples and 17 task mappings. The 141 global manual-review
entries are separate from validated examples; all 30 Drive entries were checked and are paths,
OAuth scope URLs, npx shorthand or profile ellipses, not broken executable examples. No task
family was added by this release. Lint, TypeScript, release notes and 34 targeted unit tests pass.

Local Drive browser checks: 23 of 24 passed on first run. English installation timed out on the
cold development Markdown route; its isolated rerun passed in 7.4 seconds without changing
assertions or deadlines. Standard browser smoke passed all seven cases. The final changelog
recapture has separate EN/RU/ES browser checks. Full production export, link/SEO checks and
browser shards remain mandatory in CI; dev-server evidence is not substituted for those gates.

Final authoritative changelog browser checks passed in EN/RU/ES (three cases). Candidate and
released usage/search/recipes/commands fingerprints matched; only the final changelog required
a second capture. The Drive command families have no unmapped entries.
