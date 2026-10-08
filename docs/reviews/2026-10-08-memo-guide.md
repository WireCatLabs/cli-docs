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
