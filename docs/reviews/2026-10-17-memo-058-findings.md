# Memo meeting findings and sender scores

Reviewer: Codex root, 17 October 2026. Portal base `f8853bd`.

Readers can ask an agent to stage cited meeting decisions and follow-up tasks, inspect the preview and personally confirm selected candidates together. Mail results also expose stored sender scores without changing result order.

## Sources and scope

- Memo 0.58.0 publisher captures `41bfbfb8112ca9ba9a0439c21718e40c89e7fb77`, including reviewed findings PR 259 and sender scores PR 260. Runtime dependencies: Core 0.311.0 / Base 0.40.1. Publication succeeded at run 38990444328; the annotated tag peels to that captured source. Exact npm discovery was captured with lifecycle scripts disabled, isolated paths and network/keyring sockets blocked. Installed dependencies and source skill were checked against the released package.
- Core findings PRs 1398/1407: `src/meetings/findings.ts`, `src/store/sqlite/meeting-findings.ts`, shared JSON decoder and entity schema. Native synthetic tests cover transactional rollback, exact retries, prior rejection, account/project/source staleness, historical receipts and generic-approval refusal. Strict timestamp/assignee validation rejects coercion and ambiguous dates.
- Memo `src/findings/command.ts` and its two synthetic integration tests: explicit account, agent-attributed staging, owner-terminal review, status query, pagination and dotted JSON projection. All 437 tests, typecheck/build, command lint (25 existing baseline, zero new), generated reference, Markdown and source-skill validation passed after the mail-score rebase.
- Memo sender-score implementation and tests: `src/mail/sender-scores.ts`, `src/mail/score.ts`, `src/run/import.ts`; stored mail is scored at most daily, without remote domain-age queries or changed search ordering. Signal-table wording was checked against the actual DMARC/DKIM and brand exception predicates.
- The four prose-only overrides from Memo PR 251 now exist in native released-source history and are retired. Import/explicit-cleanup distinctions and old security anchors remain.
- Zoom remains independently reviewed at 0.23.0. Its exact cue references/fingerprints are used as sources; no project or person link is inferred from a name match. Dedicated findings intake is available through Memo, without claiming a new MCP producer/review tool or automatic background extraction.

This is the release delta from reviewed Memo 0.55.0, preserving the prior review for unchanged destinations. Technical generated command bodies and changelog entries retain the established English-body convention across locales. There is no Memo public roadmap to update. Exact duplicate prevention does not imply semantic matching against manual records; unknown dates/assignees stay absent and pending source changes require a new preview.

## Review inventory

| Page and locale | Reader task | Terms and opening | Behavior evidence | Links and exports | Result and owner |
| --- | --- | --- | --- | --- | --- |
| memo/index, en | Choose sources and distinguish imports from cleanup | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/index, ru | Choose sources and distinguish imports from cleanup | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/index, es | Choose sources and distinguish imports from cleanup | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/how-it-works, en | Understand local copies and explicit mailbox changes | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/how-it-works, ru | Understand local copies and explicit mailbox changes | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/how-it-works, es | Understand local copies and explicit mailbox changes | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/security, en | Understand account access and owner review | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/security, ru | Understand account access and owner review | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/security, es | Understand account access and owner review | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/mail, en | Inspect sender signals and read stored sender scores | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/mail, ru | Inspect sender signals and read stored sender scores | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/mail, es | Inspect sender signals and read stored sender scores | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/memories, en | Review cited meeting facts and project tasks | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/memories, ru | Review cited meeting facts and project tasks | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/memories, es | Review cited meeting facts and project tasks | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/commands, en | Find exact released batch syntax | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/commands, ru | Find exact released batch syntax | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/commands, es | Find exact released batch syntax | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/changelog, en | Read the release delta | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/changelog, ru | Read the release delta | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| memo/changelog, es | Read the release delta | Changed prose and unchanged opening/ending reviewed. | Fixed release/source and synthetic tests below. | Existing URLs, commands and anchors preserved; HTML and Markdown exports checked. | Reviewed, Codex root. |
| zoom, en | Keep useful findings after a meeting | Existing reader path retained; owner review explained. | Memo batch contract plus reviewed Zoom 0.23 evidence. | Contextual memories link; HTML and Markdown exports checked. | Reviewed, Codex root. |
| zoom, ru | Keep useful findings after a meeting | Existing reader path retained; owner review explained. | Memo batch contract plus reviewed Zoom 0.23 evidence. | Contextual memories link; HTML and Markdown exports checked. | Reviewed, Codex root. |
| zoom, es | Keep useful findings after a meeting | Existing reader path retained; owner review explained. | Memo batch contract plus reviewed Zoom 0.23 evidence. | Contextual memories link; HTML and Markdown exports checked. | Reviewed, Codex root. |

## Validation

- Both complete translated memories and mail guides match the normalized native source's heading structure, command fences and links; prose was reviewed separately.
- New Memo meetings family maps to the existing memories/review task home. No sidebar page or route is added.
- Exact released contracts captured for all pinned tools. Memo 0.58.0 uses Core 0.311.0/Base 0.40.1; no live account/config was consulted by discovery.
- Full sync/localization passed; all changed source fingerprints were accepted only after structural and prose review. Four obsolete guide overrides are removed.
- Strict checks: 1,343 command references, zero gaps and zero invalid examples. The 144 manual-review examples are an existing, separate category. Release-note/roadmap gate passed.
- Lint passed with three existing warnings; all 309 unit tests passed.
- Production build, links and SEO passed. All seven export browser smoke tests passed with at least 20% timeout headroom; all 48 affected HTML/Markdown exports passed content checks.
- PR CI and deployment/public verification remain required before claiming portal delivery.
- No live account, mailbox, model or owner store was used for these tests or documentation checks.
