# Onboarding review — 14 October 2026

Reviewer: Codex root. Reader task: choose a source, install its tool with an agent or manually,
connect only the intended account, and recognize a first result with sources.

## Baseline and plan

Portal base: `e68225f099668653267acfc20364d923eaa0a367`. Native Zoom documentation base:
`0d81700bf3182c5facff5d1872e8a80ce3b6c21b`; reviewed runtime stays at Zoom `v0.10.0`,
Core `0.267.0`, Base `0.27.2`. Compare MAX installation at the portal's reviewed `v0.49.0`,
not unrelated unreleased behavior. Follow AUTHORING, TERMINOLOGY, REVIEWING and STRUCTURE.

1. Read the existing shared entry/installation pages and Zoom entry/installation/app/session
   guides against MAX's agent-first tutorial. Verify app-specific settings against the released
   source and official Zoom docs.
2. Rewrite the shared entry and installation around choosing a source, agent-assisted setup,
   manual alternatives, observable success and relevant recovery. Put Start here in the entry's
   actual title so the sidebar shows it.
3. Improve native Zoom onboarding: agent request, prerequisites, explicit existing/new app paths,
   public client ID, callback completion, Windows launchers and a first cited transcript result.
   Keep app creation in its existing guide and preserve incoming anchors.
4. Merge native documentation before importing immutable documentation-only overrides. Keep
   runtime pins unchanged. Review every translated page in full before accepting fingerprints.
5. Refresh isolated released command contracts and run sync, strict docs, release-note, unit,
   type, lint and affected browser/Markdown/mobile checks. Full export/link/SEO gates remain in CI.
6. Verify public routes and sidebar titles after deployment; record results separately from
   editorial review. Do not present unreleased project-evidence commands as usable.

## Findings

| Page | Problem | Correction and evidence |
|---|---|---|
| Shared entry, EN/RU/ES | Messenger-only opening, QR/five-minute promise, detached Drive footnote; Zoom/Memo absent from choosing a source | Source-first entry with five tools and relevant first tasks; current tools.json and reviewed native guides |
| Shared installation, EN/RU/ES | Drive incorrectly called source-installed; reference-heavy setup explanation precedes an achievable result | Current Drive npm installation and agent-assisted setup, distinct account/data/agent checks |
| Zoom installation | Manual-only opening and runtime/package details; no initial installation request; Windows launcher recovery missing | MAX tutorial pattern adapted to Zoom's actual OAuth/keyring/file-import paths |
| Sidebar entry | Getting started title does not carry the requested Start here label | Localized frontmatter titles; URL stays unchanged |

## Review coverage

Twelve changed pages and six unchanged app/session prerequisites are covered below. A matching
translation hash alone is not approval. Native documentation and portal publication use separate
PRs; no tool release is needed. The final branch also preserves the independently merged Drive
installation clarification from portal `1a57b36` (PR203).

## Editorial review result

Read all changed EN/RU/ES prose and compared the instructions with the reviewed commands.
The native app and sessions pages retain the previously reviewed source and translations from
`2026-10-14-zoom-participants.md`; their credential, scope, callback and recovery links were
rechecked here. Official Zoom OAuth documentation confirms the public-client/PKCE distinction;
no real account login was performed. MAX's reviewed agent-first tutorial supplied the structure,
not Zoom-specific behavior.

The shared page now gives five source choices and a first evidence check. Drive's npm install
replaces the incorrect source-build claim. A custom Google application's JSON and Zoom's public
client ID are distinguished. Shared setup requests remain five lines, under 550 characters, and
retain copy/clipboard checks. The root keeps four useful term explanations; the removed fifth was
an agent-product-list hint, no longer needed in the source-first introduction. Existing keyboard,
touch, Escape and link assertions remain. The browser review caught a missing local-agent hint;
it was restored rather than removing its accessibility checks.

Browser assertions now check the actual Start here navigation item, not the separate Documentation
section header. They open and close the mobile menu. The previous landing MAX selection mismatch
did not recur in the clean final run; the existing assertions remain unchanged. Existing dev-only
Sidebar key warnings remain outside this prose change.

| Page and scope | English | Russian | Spanish |
|---|---|---|---|
| Shared Start here | Reviewed; source choices and title | Reviewed; terms and links | Reviewed; terms and links |
| Shared installation | Reviewed; first-result flow | Reviewed; five-line request | Reviewed; five-line request |
| Zoom overview | Reviewed; starting-point table | Reviewed; same decisions | Reviewed; same decisions |
| Zoom installation | Reviewed native source | Fully translated/reviewed | Fully translated/reviewed |
| Zoom app guide | Unchanged reviewed source; links checked | Prior review carried forward; links checked | Prior review carried forward; links checked |
| Zoom sessions | Unchanged reviewed source; recovery checked | Prior review carried forward; recovery checked | Prior review carried forward; recovery checked |

## Validation results

- Native Zoom docs PR72 merged at `bcb6b44e412081a785e12d4e7b4fe72543919bde`; its source commit
  `9e8a73db83e0879a0e032ce0a4aaca3178441f19` is pinned only for index/installation guide imports.
  Native docs/link/changelog/Markdown checks pass. Published package pins are unchanged.
- Sync uses immutable guide overrides; both rewritten installation translations pass structure
  checks and were accepted only after prose review. Their executable fences match the source.
- All five exact released CLI contracts refreshed with network/keyring guards; strict audit:
  1,263 reference entries, zero reference gaps, zero invalid examples. The existing 126 syntax
  illustrations still require manual review; no new unsupported Zoom syntax is added.
- 300 unit tests, types, lint, version-guide checks and release-note/roadmap checks pass.
- Final affected browser suite: 69 passed, including EN/RU/ES, 390/1440 px, accessibility,
  keyboard/touch, clipboard, sidebar labels, source-choice links, app setup and Markdown.
  Every case retains the required 20% timeout headroom. No timeout or assertion was weakened.
- The final shared/sidebar flow uses existing URLs and explicit aliases for former heading links.
  Full export/link/SEO/broader browser gates and post-deployment route checks remain pending.

The first production export (38554176396) completed, then link validation stopped deployment:
the shared entry's final search link used `search.mdx`, while its actual source is `search.md`.
All three authored links are corrected. Every relative destination in the six rewritten shared
pages was checked against its source file, and the responsive browser cases now follow that
final Search link. No checker, timeout or deployment condition is weakened. This failed run
published no changed site content; validation and deployment must finish on the correction.

Correction validation: all 18 affected responsive onboarding cases pass, including actual Search
navigation in EN/RU/ES at desktop and mobile widths; the timing-headroom gate and strict released
command audit pass. Every authored relative destination in the six changed shared pages exists.

The corrected export/link/SEO gates passed in 38556197989. Its full browser matrix then caught
the shared entry requests losing their compact presentation. Restore compact markup on all
three authored requests in every locale; update the corpus check from five older messenger-only
examples to the three current message/meeting/file examples. Keep clipboard, Markdown equality,
security navigation, mobile overflow and accessibility assertions. Publication remains gated on
the new complete run; no production site change was published by this failed browser run.

Compact multiline requests now wrap inside their copy row rather than creating an inaccessible
horizontal scroll area. The Markdown check parses exported code blocks, including quoted fences,
and compares the complete request text with the clipboard source. The security/accessibility
checks remain intact; no prose or command text is dropped to fit the layout.

Final compact-layout validation:21 responsive/clipboard/security/Markdown cases pass, all with
20% timeout headroom. Repository lint, full type checks and browser-test structure policy pass.
The compact controls remain keyboard accessible and request text remains complete.

## App setup contents follow-up

Portal base814e2a4; native basebcb6b44. Owner requested a contents list at the start of
Connect a Zoom app. Native PR73 adds exactly two links below the introduction: Use an app you
already created, then Create your own app. Imported from immutable078cd372b836398d210b2b6ab37772aa85d6ad7e;
reviewed runtime remains Zoom0.10.0. Both existing English anchors remain the targets in each locale.

Read the native English page and both complete RU/ES translations; the two additions preserve
app choices, Public Client ID, permissions, callback and first-sync guidance. No settings or
command behavior changes. Browser coverage now follows both contents links in all three locales.
