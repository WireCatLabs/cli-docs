# WhatsApp launch documentation review

Reviewer: Codex. Owner approved WhatsApp launch inclusion on 2026-10-24, requiring the same
reader structure as Telegram and review before publication. Reviewed against AUTHORING,
STRUCTURE, TERMINOLOGY and REVIEWING, using Telegram overview/installation/task navigation as
the design reference. Source: @wirecat/whatsapp-cli 0.6.0, tag v0.6.0, commit
`b3fe6162f8d678d65c9efcd188eeb8ccd39f89ab`. No runtime release is part of this change.

The overview and installation are portal-owned; other pages follow the immutable native release,
with source-attributed corrections. The installation flow is install → phone link → agent → check.
WhatsApp uses linked devices and a separate Cloud API business bot; Telegram's developer-app and
BotFather setup do not apply. No new terminology is introduced. Technical API descriptions,
identifiers and changelog entries retain the native English where exact reference text is useful;
reader introductions and guides are localized. RU/ES drafts were checked against the source and
revised; structural parity and source fingerprints were accepted after that review.

## Page inventory

Every row includes a full prose/source review, opening and ending, material claims, literal examples,
links and Markdown counterpart. Native references describe the released contract; they do not
establish that a live provider action succeeded. EN uses the native source plus portal corrections.
RU/ES preserve the same boundaries. Result owner for every row: Codex.

| Page and locale | Reader task | Terms and opening | Behavior evidence | Links and exports | Result and owner |
| --- | --- | --- | --- | --- | --- |
| wa/index, en | Choose account access or a separate business bot | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/index, ru | Choose account access or a separate business bot | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/index, es | Choose account access or a separate business bot | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/installation, en | Install, choose an account/profile, link a phone and connect an agent | Task/result and consistent terms checked | Pinned package engines/help; isolated Linux install and doctor | Preserved anchors, export links checked | Reviewed, Codex |
| wa/installation, ru | Install, choose an account/profile, link a phone and connect an agent | Task/result and consistent terms checked | Pinned package engines/help; isolated Linux install and doctor | Preserved anchors, export links checked | Reviewed, Codex |
| wa/installation, es | Install, choose an account/profile, link a phone and connect an agent | Task/result and consistent terms checked | Pinned package engines/help; isolated Linux install and doctor | Preserved anchors, export links checked | Reviewed, Codex |
| wa/usage, en | Read, search and act on messages with explicit permissions | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/usage, ru | Read, search and act on messages with explicit permissions | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/usage, es | Read, search and act on messages with explicit permissions | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/sessions, en | Link, inspect or revoke a device session | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/sessions, ru | Link, inspect or revoke a device session | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/sessions, es | Link, inspect or revoke a device session | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/archive, en | Fetch and inspect available local history | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/archive, ru | Fetch and inspect available local history | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/archive, es | Fetch and inspect available local history | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/search, en | Find messages and inspect context | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/search, ru | Find messages and inspect context | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/search, es | Find messages and inspect context | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/attachments, en | Download, retry and inspect archived attachments | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/attachments, ru | Download, retry and inspect archived attachments | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/attachments, es | Download, retry and inspect archived attachments | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/query-language, en | Build scoped queries | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/query-language, ru | Build scoped queries | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/query-language, es | Build scoped queries | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/groups, en | Inspect and administer supported groups | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/groups, ru | Inspect and administer supported groups | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/groups, es | Inspect and administer supported groups | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/people, en | Find people and distinguish contacts | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/people, ru | Find people and distinguish contacts | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/people, es | Find people and distinguish contacts | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/mcp, en | Connect an agent and understand terminal-only commands | Task/result and consistent terms checked | Released mcp:false metadata; 121 exclusions collapsed to 48 parent paths | Preserved anchors, export links checked | Reviewed, Codex |
| wa/mcp, ru | Connect an agent and understand terminal-only commands | Task/result and consistent terms checked | Released mcp:false metadata; 121 exclusions collapsed to 48 parent paths | Preserved anchors, export links checked | Reviewed, Codex |
| wa/mcp, es | Connect an agent and understand terminal-only commands | Task/result and consistent terms checked | Released mcp:false metadata; 121 exclusions collapsed to 48 parent paths | Preserved anchors, export links checked | Reviewed, Codex |
| wa/remote, en | Connect a remote agent with authentication and revocation | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/remote, ru | Connect a remote agent with authentication and revocation | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/remote, es | Connect a remote agent with authentication and revocation | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/bot, en | Configure a separate WhatsApp Cloud API business bot | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/bot, ru | Configure a separate WhatsApp Cloud API business bot | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/bot, es | Configure a separate WhatsApp Cloud API business bot | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/recipes, en | Follow task examples | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/recipes, ru | Follow task examples | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/recipes, es | Follow task examples | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/commands, en | Look up exact released syntax and output | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/commands, ru | Look up exact released syntax and output | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/commands, es | Look up exact released syntax and output | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/configuration, en | Find relevant settings | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/configuration, ru | Find relevant settings | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/configuration, es | Find relevant settings | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/permissions, en | Control allowed actions | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/permissions, ru | Control allowed actions | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/permissions, es | Control allowed actions | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/profiles, en | Separate account and bot settings | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/profiles, ru | Separate account and bot settings | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/profiles, es | Separate account and bot settings | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/configuration-reference, en | Look up exact configuration keys | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/configuration-reference, ru | Look up exact configuration keys | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/configuration-reference, es | Look up exact configuration keys | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/cli-contract, en | Understand CLI and machine-readable contracts | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/cli-contract, ru | Understand CLI and machine-readable contracts | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/cli-contract, es | Understand CLI and machine-readable contracts | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/limits, en | Understand supported and unsupported operations | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/limits, ru | Understand supported and unsupported operations | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/limits, es | Understand supported and unsupported operations | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/diagnostics, en | Diagnose local configuration and engine problems | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/diagnostics, ru | Diagnose local configuration and engine problems | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/diagnostics, es | Diagnose local configuration and engine problems | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/troubleshooting, en | Recover from setup and engine failures | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/troubleshooting, ru | Recover from setup and engine failures | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/troubleshooting, es | Recover from setup and engine failures | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/security, en | Understand account access and local data boundaries | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/security, ru | Understand account access and local data boundaries | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/security, es | Understand account access and local data boundaries | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/changelog, en | Inspect release history | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/changelog, ru | Inspect release history | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/changelog, es | Inspect release history | Task/result and consistent terms checked | Released command metadata and native guide | Preserved anchors, export links checked | Reviewed, Codex |
| wa/roadmap, en | Distinguish released capabilities from future plans | Task/result and consistent terms checked | Released bot/attachment commands; source discrepancies corrected | Preserved anchors, export links checked | Reviewed, Codex |
| wa/roadmap, ru | Distinguish released capabilities from future plans | Task/result and consistent terms checked | Released bot/attachment commands; source discrepancies corrected | Preserved anchors, export links checked | Reviewed, Codex |
| wa/roadmap, es | Distinguish released capabilities from future plans | Task/result and consistent terms checked | Released bot/attachment commands; source discrepancies corrected | Preserved anchors, export links checked | Reviewed, Codex |

## Shared paths and corrections

Reviewed EN/RU/ES landing connection menus, hero/provider/footer copy, global installation and
roadmap, overview cards, sidebar, header switcher, command groups, metadata, and agent-readable
Markdown. Landing setup uses the real package `@wirecat/whatsapp-cli`; it asks the owner which
account/profile to use. The mobile switcher preserves a shared guide and fits at 390px. A browser
round-trip found WhatsApp missing from the global metadata inventory; adding it in all locales
restores both the sidebar and Telegram → WhatsApp installation navigation.

| Source location | Finding and rule | Correction and evidence |
| --- | --- | --- |
| installation/overview and lib/words.ts | Setup must follow the same reader flow without picking an account | Portal-owned Telegram-style sequence, chosen profile, real package; native setup/help and three isolated doctor checks |
| usage and sessions | Preserve consequential timing and validation boundaries | Own-message edit window is 15 minutes per [WhatsApp Help](https://faq.whatsapp.com/6614640168569481/); preserve native photo validation and remove speculative provider claims |
| mcp | Do not promise every terminal command is exposed | List terminal-only families from the released mcp:false metadata; retain write permissions and remove unmeasured token comparison |
| remote | Authentication, denial and revocation must retain their meanings | Explicit HTTPS endpoint/sign-in; correct translated deny and revoke; link current provider requirements instead of an unchecked compatibility matrix |
| roadmap | Future/current distinctions must match released behavior | Move shipped Cloud API bot and attachment capabilities to current; retain future work |
| search | Cross-tool examples must use actual pinned commands | Memo examples use `memo sync --only mail` and `memo sync --only notes` |
| attachments | A retry attempt is not guaranteed recovery | Explain expired/unavailable media and supported retry action |
| usage, MCP, groups, diagnostics, sessions | Reader guides must describe tasks rather than internal validation history | Remove test-provenance prose; keep prerequisites and runtime boundaries in the guide, validation limits here |
| RU/ES guides and references | Matching fingerprints alone do not prove a translation | Repair fences, links, table paragraph boundaries, free-form text, device keys, tool calls, product names, denied writes and revoked access |
| installation troubleshooting link | A next step must resolve to an actual anchor | Preserve source headings and legacy anchors; use #the-whatsapp-engine-is-not-installed |

Native discrepancies remain owned by whatsapp-cli; the site corrections record their immutable
source and reason in scripts/docs-corrections.json. No live account or signed release report was
created. The existing production hold and private comparison material are untouched.

## Validation

All six reviewed release contracts captured. Sync, localization/fingerprints, lint, typecheck,
strict documentation checks, release-note validation, search bundle check, production export,
asset limits, links and SEO pass. Strict quality: 1884 reference entries, zero reference gaps,
zero invalid examples; 174 examples require manual classification/review and are not runtime proofs.
The synthetic report fixture passes for all six pinned releases. The Linux packed install matrix
in cli-testing PR204 passes all 18 rows (six tools × npm/pnpm/Bun); an additional WhatsApp doctor
check passes for each of the three managers without an account. macOS, Windows and Node 22 legs
are configured in the reusable suite but were not run locally.

Final browser and unit counts are recorded below after the final navigation export. Browser review
covers EN/RU/ES, desktop/mobile, actual provider selection and cross-tool navigation, whole-page
accessibility, Markdown, legacy anchors and the unchanged 3000-element command-reference limit.
Desktop/mobile screenshots were inspected. CI results and deployment/public verification are
linked from the PR; successful checks do not certify unexecuted live account operations.
