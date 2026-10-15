# Accepted knowledge in meeting preparation: documentation review

Reader task: someone preparing for a selected meeting series can distinguish accepted facts about
linked people/projects from transcript evidence, follow fact references and recognize unqueried sources.

## Source boundary

- Draft base: cli-docs origin/main `49afe97`. Existing Zoom installation, app creation/connection,
  sidebar, table of contents, routes and anchors are preserved.
- Core feature PR1279, release PR1280 and coverage fix PR1285 are merged. The final shared source is
  `0732424371c9273def9019b0011f0d6fc53fe9c1`. The first release attempt was cancelled before publication
  when field-selection validation exposed missing optional metadata; the final reader uses standard
  `knowledge.coverage`, without a provider-specific projector or a breaking Base bump.
- Zoom0.18.0 published from `275af69b8e216009d778a7b362fc224723549d76`, release38718827524.
  Registry bytes equal the validated artifact, SHA256
  `0cc3216fab27a80b47e6751960ea0b6096ef0178cf221b2fe891af9454c9fa88`; SRI and tag/source match.
  All four installed Linux/Windows Node22/24 proofs pass accepted-knowledge/projection checks and
  one Base identity. Runtime is Core0.286.0/Base0.31.1; no preview dependency is committed.
  The local installation and both managed agent skill copies are0.18.0. This docs draft is not deployed.

## Reader and contract checks

| Page | What the reader must understand |
|---|---|
| Shared Meetings, EN/RU/ES | Accepted facts can be included outside the meeting; preserve fact refs and investigate notes/mail/messages separately. |
| Usage, EN/RU/ES | Current explicit links, confirmed global projects, accepted live facts only; at most twenty facts or a smaller context limit; independent coverage, meeting-byte priority, no automatic findings or tasks. |
| MCP, EN/RU/ES | Existing opt-in/account-bound tool, fact refs and evidence/source limitations; no new arguments or writes. |
| Roadmap, EN/RU/ES | Accepted global facts are available; broader notes/communications, alias candidates, calendar discovery, reviewed intake and archive extraction remain future work. |
| Changelog, EN/RU/ES | Include the intervening0.17.1 MCP escaping/test-cleanup release and0.18.0 accepted-knowledge behavior without modifying published notes. |
| Existing setup/app pages | Existing/new-app choices, public Client ID/PKCE and first-success checks still work. |

Facts are owner-global knowledge reached through current explicit meeting associations. No matching
names, words or proposed project links establish those associations. Fact evidence is not revalidated;
mail, messages, notes and alias candidates remain unqueried. Facts recorded exactly at preparation
start qualify; later updates do not. This is current accepted knowledge, not an historical snapshot.
Row/UTF-8 hydration limits do not bound database scan/sort work. The command reads rather than saves
findings, summarizes or creates tasks. Old custom SDK hosts can omit the optional capability.

## Publication checks

- [x] Verify native source/tag, registry/validated bytes and four installed platform proofs.
- [x] Pin the immutable release, sync source pages and review all eight changed translations.
- [x] Refresh command contracts; validate references, examples, task destinations and localization.
- [x] Record the reviewed roadmap fingerprint.
- [x] Run affected reader/browser checks, including HTML/Markdown field/coverage checks.
- [ ] Merge only a green PR, verify deployment and check the live localized pages.

Native validation passed454 tests, coverage, contracts, previous-version upgrade cases, security and
all installed platforms. Command lint retains27 existing baseline violations, zero new/overridden.
Local documentation validation passed36 Zoom browser cases, strict localization/release notes,
command contracts and Markdown checks. The quality report has1289 reference entries, zero gaps,
zero invalid examples and17 task mappings; its141 corpus-wide illustrations still require manual
review and are not claimed executed. The dev server emits an existing Sidebar React key warning;
the reader assertions pass. Full export, types, unit tests and broad browser checks remain CI gates.
This is a pre-merge review; final deployment/live proof is recorded in the delivery handoff.
