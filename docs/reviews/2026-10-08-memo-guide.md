# Memo guide review — 8 October 2026

Reader task: a visitor following Email and notes from About can install Memo, import notes
and email, and gather source-backed context about a person.

Base: cli-docs main `e30a07a1c970c649028851d44aae39a7ef819b0b`.
The existing About layout and repository links are preserved. New portal guide:
`/{lang}/docs/memo`, in English, Russian and Spanish, with an explicit sidebar Mail icon.
Both About documentation links now open this guide. Funding copy adopts the owner's
AI workflows, assistants and bots on LangGraph wording in all three languages.

## Sources

Memo `v0.2.0` resolves to `451bc8eafa57e402402531d8bbdde7fbae6d946a`.
The exact `@leemour/cli-memo@0.2.0` npm package was retrieved with lifecycle scripts disabled.
Its README's unpublished-status sentence is stale; npm availability and package version
were verified separately. No unreleased behavior is described.

| Guide section | Owning source at Memo v0.2.0 |
| --- | --- |
| Install and version | `package.json`, `src/program.ts` |
| Folder registration and import | `src/notes/folders-command.ts`, `src/notes/command.ts`, `README.md` |
| Person-note association and context | `src/people/command.ts`, `src/context/command.ts`, `README.md` |
| Mail accounts and bounded import | `src/config.ts`, `src/mail/command.ts`, `README.md` |
| Search and own notes | `src/search/command.ts`, `src/notes/command.ts` |

Platform configuration locations and overrides were checked in packaged
`@leemour/cli-core@0.17.2` (`dist/paths.js`) and its `env-paths` implementation.
This is a portal entry guide, not a new generated messenger reference; `tools.json`
remains the reviewed Telegram/MAX sync inventory.

## Validation

- Lint, typecheck, 213 unit tests, release-pinned sync and production export passed.
- Link and SEO checks passed against the final export.
- Existing localization validator reports no command, literal, heading or link differences.
- Exact npm release: isolated fictional note folder registration, import, repeated import,
  word search with source references and unchanged source file passed. All documented
  subcommands' help was checked. No live mail or messenger account was used.
- Browser: About-to-guide navigation, sidebar entry, no horizontal overflow and axe passed
  for en/ru/es, 1440/390px, light/dark. All three Markdown twins and llms index were verified.
- Screenshots and fixture results remain under `/tmp/wirecat-memo-*`.

Current main does not expose the uncommitted shared checkout's `docs:contracts` or
`docs:check` commands. The release-package fixture and documented-command source review
supplement the available repository checks. Mail configuration/import was reviewed in
source and command help, not tested against a live mailbox.

## Reader-focused revision

The owner requested a clearer statement of the page's purpose and reader gain, and no
public version mentions. The guide now opens with the pre-meeting situation and what the
reader learns: connect selected notes/email, ask for a person brief and check its sources.
The first action is a natural-language agent request; expected results and missing-data
interpretation precede manual installation and configuration detail. Notes-only use is
explicit, and the terminal/local-history prerequisite is stated before the request.

The same sequence and outcomes were reviewed in English, Russian and Spanish. Tool/runtime
version prose, the pinned installation example, exact-version output and version-labelled
source link were removed from the public guide. Reviewed source versions remain in this
maintainer record. Existing section anchors remain available.

### Why the standards did not prevent the problem

- Main already had the reader-task and outcome rule in `docs/AUTHORING.md`. The original
  opening described the product's function, but the first action was a version-pinned
  installation; the useful agent request appeared after setup detail. The editorial
  review did not apply the standard to the whole reading path.
- Main CI validates lint, tests, sync, typecheck, build, links, SEO and browser behavior.
  Those checks do not assess whether the reader understands what they will gain or
  encounters a useful first request early. Technical success was treated as approval
  of the prose.
- The fuller authoring workflow, index/tooling docs, skill source and docs-quality/contract
  scripts are present as uncommitted work in the owner's shared checkout. Current main
  contains the shorter authoring guide, but not that full workflow. Its proposed quality
  checker covers command references/examples and task destinations, not prose usefulness.
- The shipped standard required reviewed runtime facts but did not explicitly prohibit
  public release banners and pinned install examples. The distinction between internal
  evidence and reader-facing instructions needed to be stated.

The authoring guide now explicitly keeps release evidence in maintainer records and
requires a recorded review of reader situation, outcome, first action, observable success,
missing data and localized reading path. This is a manual editorial gate; it does not
pretend that a keyword or heading check can certify useful prose.

Revision validation: lint, production build (including TypeScript), localization, links and
SEO passed. Browser checks passed for all locales, desktop/mobile and light/dark: the agent
request precedes installation detail, no public version text remains, About navigation and
sidebar still work, and Markdown twins and axe checks pass. Commands and runtime behavior
were unchanged apart from unversioned installation and using help to check availability;
the earlier isolated source/behavior verification remains applicable.

## First-reader follow-up — 9 October 2026

The guide now states its purpose and lists what the reader will be able to do before setup.
Installation follows the shared Telegram/MAX pattern: a copyable agent request, optional manual
instructions and remembered OS tabs. The prompt uses only Memo's supported help/installation
commands; it does not borrow messenger setup, doctor or skill commands.

The first useful task is searching a folder, so mail and messenger accounts are optional.
The prose defines folders, recursive subfolder reading and Obsidian vaults, and explains that
Obsidian stores ordinary Markdown files. Separate examples select Markdown and Obsidian formats.
A file-format table distinguishes text, spreadsheets, office/ebook formats and optional PDF/DOCX
readers. It explains scanned-PDF text recognition and unsupported legacy DOC/XLS files.

The existing DocTerm component supplies local-agent, CLI, runtime/install and terminal explanations,
plus new vault/Markdown terms. Core meanings also remain in the page prose. Shared CLI/Node/npm
explanations now cover Memo as well as messenger tools. Locale routes and prior section anchors
remain stable. Memo sources use MDX for the existing components; raw Markdown export keeps all
OS branches, copyable requests and expanded tooltip definitions.

Source recheck: npm currently publishes Memo 0.2.1, tag commit
`1018122866ebaf3cb908c77f6c9cd182a9865f05`, with cli-messaging 0.205.0.
The tag comparison changes dependency/version alignment, not Memo's file importer or command
implementations. File discovery is verified in `src/notes/files.ts`; supported extraction limits
and missing-reader/scan behavior are covered by `src/notes/documents.test.ts` and the README.
No release versions are added to the public guide.

An isolated fixture, rerun with the current published package, registered ordinary Markdown and
Obsidian folders, imported TXT/Markdown/CSV content, found nested files, excluded `.obsidian`,
returned source references and preserved originals. Documentation component/localization tests:
31 passed. Localization compared executable examples, inline literals, structure and destinations;
natural-language prompt fences were reviewed separately and their text preserved in copy controls.
Production build/TypeScript, lint, links and SEO passed. Browser checks cover en/ru/es × 1440/390 ×
light/dark: purpose/gain, prompt clipboard contents, keyboard tooltip open/close/focus return,
Windows tab, file formats, Markdown parity, overflow and axe. Mobile English capture was visually
reviewed; no claim of independent human usability testing is made.

## Separate notes and email guides — 9 October 2026

The owner requested separate task homes and fuller linking, notes and tagging coverage.
`/{lang}/docs/memo` remains the installation/notes home, titled Notes and files.
`/{lang}/docs/email` covers mail and links to Memo installation in notes; it does not duplicate
npm instructions. Both pages state their reader situation, purpose and gains. Both are in
the sidebar with distinct NotebookPen/Mail icons, and link contextually to each other and people.
Previous notes/install/person-context/add-email URLs and anchors remain usable; add-email is
now a short bridge to the email guide. Common aliases support the same install/notes/tag links
in every locale. All three languages retain no public release-version text.

Notes distinguishes imported files from notes created in Memo, and covers subjects (person,
message and other stored records), multiple subjects, read/edit/remove with revision checks,
export metadata and source labels. Tag examples include notes, messages, contact identities,
linked people and subfolders. Contact selection through an account is distinguished from a
linked person's UID. The UID location was verified as `messages.person.uid` in Memo context;
`contacts profile` is not advertised as exposing that identifier.

Email covers named Himalaya accounts versus mailbox-address search scope, multiple account
configuration, bounded imports, linking a correspondent's email identity, scoped search, tags
on mail messages/threads and notes attached to an email. Account linking records person identity;
it is distinct from authenticating accounts or combining mailboxes. Existing People guidance
now links to both guides and correctly distinguishes a selected profile from linked context.

Runtime source: Memo 0.2.1 / cli-messaging 0.205.0, using the published package and
`src/notes/command.ts`, `src/tags/command.ts`, `src/mail/command.ts`, `src/context/command.ts`.
Account selection is checked in `dist/store/scope.js`; labels in the shared knowledge store.
The pinned Telegram/MAX guides use cli-messaging 0.196.0/0.197.0 respectively; published `dist/services/people.js`,
`dist/services/person-profile.js` and command discovery verify the identity/profile references.
Current Memo main was inspected separately; ongoing refactoring is not treated as released
behavior. Public text consistently says notes and does not claim that Memo note IDs and
messenger contact-note IDs are interchangeable.

An isolated fixture seeded fictional Telegram/mail identities and messages. Verified manual
identity linking, notes on people/messages, multiple subjects, stale-revision rejection, tags
on notes/messages/contacts/people/mail threads/subfolders, mail account isolation, scoped mail
search, context, export and removal. No live account was used.

Validation: 31 documentation tests, build/TypeScript, lint, links and SEO. Both guides were
browser-checked in en/ru/es × desktop/mobile × light/dark for gains, copied prompts, new workflow
coverage, sidebar, install/people anchors, overflow and axe. Every command/prompt fence is
compared byte-for-byte with the authored source in both Markdown twins. Locale checks retain
executable examples, inline literals and destinations, treating prompt prose separately.
People's newly introduced examples/literals match in every language; existing localized chat
names in older examples are preserved rather than being relabelled as new regressions.
