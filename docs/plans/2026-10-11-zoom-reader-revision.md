# Zoom documentation revision

A new reader must be able to install zm, reuse an existing Zoom app or create one, complete browser login and read a first meeting without guessing which settings or permissions are missing. This replaces the previous review, whose automated checks passed despite an incomplete onboarding path.

Bases: cli-docs 365a94c8ec99de129c7b8c39fe5a8a422859e0cb; zoom-cli c0b544d949bd293cc948d0b92a457da674935d09. Runtime stays the reviewed npm release; native prose is imported through immutable documentation-only refs. No account credentials or owner meeting data are needed.

## Standards and source evidence

Follow AUTHORING, TERMINOLOGY, STRUCTURE and REVIEWING. Compare Drive installation/sessions, Telegram installation and the shared agent connection guides. Source truth is the released command contract plus Zoom login/config/token/API code. Consult current official Zoom app creation, OAuth/public-client, testing, scope and transcript documentation. A development app does not imply public availability; document reuse without promising an unverified public WireCat installation. A configured client ID is required: the CLI has no bundled app ID.

## Page work

| Page | Revision and reader result | Checks |
| --- | --- | --- |
| Zoom overview | Choose API connection or file import; connect to one useful task | First actions and inbound links, every locale |
| Installation | Install, choose an existing app or create one, approve access, confirm completion, retrieve a first result; update/removal | Copyable supported commands, readiness checks, HTML/Markdown |
| Zoom app | Explain app vs Zoom account; existing/WireCat app reuse; manual creation and optional manifest; exact public-client settings and task-based scopes | Official Zoom sources, manifest contents, no invented distribution claim |
| Sessions | Browser consent through completion, stalled callback paste, actual scopes, profile vs OAuth account | Login implementation and cached status, synthetic auth tests |
| Usage | First useful reads and action boundaries before the full group reference | Released IDs/options/output rules |
| Archive | Task-first pull/import/backup instructions, naming/timezone examples, recovery and completion | Existing parser/archive tests and exact import limits |
| Search | Simple first search before indexing/paging; citations and cross-source context | Contracts, retained references, explicit coverage |
| Topic search | Explain semantic search and model prerequisites; preview/build/query result | Model factory and generation/query boundaries |
| MCP | Define skill/MCP, concrete client setup, first question and missing-data recovery | Released skill flags, protocol tools, configuration/export |
| Remote meetings | Find next meeting, read invitation, separate local/Zoom IDs, preview changes | Scope mapping and uncertainty rules |
| Commands | Improve generator-owned orientation; retain complete generated reference | Regenerate and generator drift check |
| Configuration | Explain selecting settings and defaults, app/environment/profile boundaries | Actual config and runtime environment readers |
| Troubleshooting | Symptom -> diagnostic -> repair -> success, especially approval without terminal completion | Auth and API error paths, cross-links |
| Security | Explain credential/data choices accurately, callback and AI processing boundaries | Token storage, native/local/remote model paths |
| Roadmap | Available workflows vs remaining dedicated automation, practical current paths | Reviewed roadmap fingerprint |
| Changelog | Read history with accurate scope; retain release entries | Source notes and translation structure |
| Shared Meetings | Natural-language requests, prerequisites at the point needed, evidence and join/review examples | Shared page links, all locales, no planned commands presented as available |

## Review and publication sequence

1. Read every native page and the comparison guides. Record actual missing steps and factual corrections, not a generic reviewed checkbox.
2. Rewrite native source and overview/shared content; preserve addresses and incoming anchors. Do not hand-edit generated command references.
3. Read every changed EN/RU/ES page in full. Translate instructions, headings and explanatory reference text while preserving executable literals and command fences. Accept fingerprints only after that review.
4. Native docs checks and generated-command check; source sync/localization; refreshed released contracts; strict docs validation; release-note/roadmap check; affected unit/type checks.
5. Browser checks for both app paths, visible instructions, app-setting checklist, callback recovery, first-result links, mobile/desktop and readable Markdown. Tests check reader outcomes, not just a page title or link presence.
6. A per-page/per-locale review records opening, first action, expected result, evidence and issues corrected. Hold unresolved factual claims; passing syntax and browser checks alone does not approve prose.
7. Merge source and portal PRs, await full deployment export/link/SEO/browser gates, then verify public installation, app, sessions and shared Meetings routes in every locale. Record results and live links.

## Initial findings

- Installation assumes creating an app and offers no visible existing-app path or browser completion diagnosis.
- The supplied manifest has redirect fields but no scopes; the guide incorrectly says it imports five scopes and public-client enablement.
- "One minute" conceals Marketplace setup prerequisites.
- Login approval alone is not completion; the callback must reach the same running terminal process or be pasted there before timeout.
- An app can have a generated secret; this CLI neither needs nor accepts it. "The app has no secret" misstates that distinction.
- Hosted transcript retention and cloud audio transcripts are different settings; permission/host availability is not a guarantee that attended meetings can be downloaded.
- API source and file source require explicit routing on repeat setup; profile labels do not switch authenticated Zoom users.

## Execution record

- Native revision merged through zoom-cli #52; follow-up template/configuration clarification and retained anchors merged through #53. The portal uses immutable compatible guideRefs, preserving its runtime pin.
- Every ordinary page revised; generated syntax and historical release entries preserved. A page/locale reader review is in [the review record](../reviews/2026-10-12-zoom-reader-revision.md).
- EN/RU/ES onboarding and shared Meetings requests reviewed. Marked natural-language prompt fences are now translatable; executable/ordinary text fences remain protected, with regression coverage.
- Native docs/generator, 298 unit tests, typecheck, translation structures, strict command checks and 18 targeted Zoom browser cases pass. Full publication gates and live checks follow the portal PR merge.
