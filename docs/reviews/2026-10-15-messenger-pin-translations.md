# Messenger pin translation repair

Main PR236 advanced MAX to v0.53.0 and TG to v0.56.0 without refreshing changed translations
and roadmap review records. Deploy run 38667832364 then failed. This repair preserves those
pins and the picture-command code block; it changes only the released guide deltas and source
links needed to publish the reviewed releases. Drive's separate update is not included.
Base: 289672dd6a2764a781322ed906f96507a6405c6f. Reviewer: Codex.

Native comparisons: MAX v0.52.0...v0.53.0 changes bot/security certificate wording, the bot
upload exception row and changelog. TG v0.55.0...v0.56.0 changes only its changelog. Tag-derived
architecture/chart links also change in translation outputs despite unchanged native prose.
The corresponding native pages and changed locale passages were read before fingerprints
were accepted. Existing semantic terms and the distinction between a bot and an AI agent stay.

| Page / locale | Reader task | Source evidence | Review |
| --- | --- | --- | --- |
| MAX bot / EN | Understand certificate trust when connecting a bot | v0.53.0 src/bot/transport.ts: Node setDefaultCACertificates versus Bun request tls.ca | Reviewed; existing task opening/ending and anchors retained |
| MAX bot / ES | Understand certificate trust when connecting a bot | v0.53.0 src/bot/transport.ts: Node setDefaultCACertificates versus Bun request tls.ca | Reviewed; existing task opening/ending and anchors retained |
| MAX security / EN | Understand file boundaries and process versus system trust | Released bot-upload restriction, explicit CLI exception, no MCP bypass; native TLS scope | Reviewed; existing task opening/ending and anchors retained |
| MAX security / ES | Understand file boundaries and process versus system trust | Released bot-upload restriction, explicit CLI exception, no MCP bypass; native TLS scope | Reviewed; existing task opening/ending and anchors retained |
| MAX commands / EN | Find the bot upload file exception | Single new --allow-any-file row copied from the generated reference | Reviewed; existing task opening/ending and anchors retained |
| MAX commands / RU | Find the bot upload file exception | Single new --allow-any-file row copied from the generated reference | Reviewed; existing task opening/ending and anchors retained |
| MAX commands / ES | Find the bot upload file exception | Single new --allow-any-file row copied from the generated reference | Reviewed; existing task opening/ending and anchors retained |
| MAX changelog / EN | Read the new release behavior | Native 0.53.0 notes; literals and uncertain-outcome retry boundary retained | Reviewed; existing task opening/ending and anchors retained |
| MAX changelog / ES | Read the new release behavior | Native 0.53.0 notes; literals and uncertain-outcome retry boundary retained | Reviewed; existing task opening/ending and anchors retained |
| TG changelog / RU | Understand export-shape changes, config aliases and retry timing | Native 0.56.0 notes; exact error and code literals preserved | Reviewed; existing task opening/ending and anchors retained |
| TG changelog / ES | Understand export-shape changes, config aliases and retry timing | Native 0.56.0 notes; exact error and code literals preserved | Reviewed; existing task opening/ending and anchors retained |
| MAX usage / EN | Follow the versioned sample-chart link | Only generated raw-content tag link changes; reader workflow unchanged | Reviewed; existing task opening/ending and anchors retained |
| MAX usage / ES | Follow the versioned sample-chart link | Only generated raw-content tag link changes; reader workflow unchanged | Reviewed; existing task opening/ending and anchors retained |
| MAX CLI contract / EN | Read the matching release architecture | Only native relative-link conversion changes to v0.53.0 | Reviewed; existing task opening/ending and anchors retained |
| MAX CLI contract / ES | Read the matching release architecture | Only native relative-link conversion changes to v0.53.0 | Reviewed; existing task opening/ending and anchors retained |
| TG CLI contract / RU | Read the matching release architecture | Only native relative-link conversion changes to v0.56.0 | Reviewed; existing task opening/ending and anchors retained |
| TG CLI contract / ES | Read the matching release architecture | Only native relative-link conversion changes to v0.56.0 | Reviewed; existing task opening/ending and anchors retained |

The roadmap contents and hashes are unchanged and were read in full. None of the new release
items remains listed as planned: MAX still lists optional local copies, event actions, video
circles/cloud password and standalone installers; TG still lists multiple photos, chat notes
and its stated MAX-only gaps. Versioned review conclusions now record those unchanged plans.

The new MAX certificate wording was checked against tagged source: Node changes the process's
default CA list, Bun supplies ca per request, and neither changes the system store. No messenger
account, token, send, upload or other live action is used for this documentation repair.

Validation results are appended after source capture, locale checks, contracts, strict docs,
release-note validation and browser checks. Full export and wider browser coverage remain CI gates.

## Validation

Locale preservation checks passed for all 17 changed translation files. Eleven changed source
fingerprints were accepted only after reviewing the actual deltas; six link-only translations
kept their existing fingerprints. Localize and reviewed npm command capture passed. Strict
checks report 1,289 reference entries, zero gaps, zero invalid examples and 17 task mappings.
Release notes/roadmap checks and 16 targeted localization/release-note unit tests passed.
Lint passed with the same two pre-existing spread warnings in unrelated source files.

Six existing MAX bot/reference browser cases passed across EN/RU/ES, including mobile roles,
accessibility and Markdown parity. The ignored local config uses the same cases/assertions
with one worker and warms the Markdown route during server readiness, keeping cold dev-route
compilation outside request deadlines. No production code, browser assertions or deadlines
were changed. Full production export/browser checks remain in CI.
