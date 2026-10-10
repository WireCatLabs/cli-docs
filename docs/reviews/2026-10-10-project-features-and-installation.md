# Project features and shared installation — 10 October 2026

Reader tasks: understand what WireCat enables with the agent the reader already uses;
choose where the tools run and follow the right tool's installation guide.
Base: cli-docs `734ac9eb28bb11324cc311fcf4fa58fea9b87bbf`.

## Scope and decisions

Read the owner's product handbook for positioning, keeping current capabilities separate
from its hypotheses and integration roadmap. Features now explains the project: sources
for agents, messages and source-backed search, linked people, notes/files/email, bots,
group administration and access control. Detailed per-messenger operation tables were
removed from the common page because the native usage, search/archive, bot/group and
command guides already cover those operations. Links keep these details discoverable.
No future meeting connector, calendar service or hosted-sync feature is presented as ready.

Installation is the common setup explanation and tool-guide hub. Memo, Telegram and MAX
installation links appear near the top. It distinguishes runtime installation, source
connection, agent access, data preparation and verification; explains local computer,
server and remote access; and covers PATH, sessions, permissions and background processes.
Exact messenger installation/login steps remain in their native guides, and Memo installation
remains in the maintained notes/files guide. Existing URLs and prior section anchors survive.
The general request is copyable; Node setup retains its established request and anchor.

## Source evidence

| Changed subject | Evidence checked | Reader boundary |
| --- | --- | --- |
| Messenger tasks and detailed capability destinations | tg v0.42.0 `docs/usage.md`, `docs/bot.md`, `docs/security.md`; max v0.41.0 `docs/usage.md`, `docs/bot.md`; pinned generated guide inventory | Messenger operations stay in native task/reference guides |
| Local storage, connection and background work | Same native usage/security guides; common permissions, security, browser-apps and archive guides | Account access, local history and a running process are separate |
| Memo notes, files, mail and combined context | Memo v0.2.1 `README.md`, `src/program.ts`; the existing Memo review's verified package fixtures and notes/mail source map | Memo reads downloaded history; selected folders/mail require imports; no Memo MCP claim |
| Personal-message drafts | `content/docs/drafts-and-templates.mdx`, reviewed with the pinned release corpus | Agent reply text must be copied to the messaging app; neither personal-account CLI saves app drafts |
| People and source evidence | Existing People, Memo and search guides and their reviewed source records | Explicit identity links; names alone do not merge; incomplete history remains incomplete |

New prose uses AI agent/agent consistently, with generic messenger language for shared
behavior. Tool names identify actual guides and supported differences. Release pins and
captured runtime contracts were not changed. Local Memo main has newer package naming;
it was not substituted for the reviewed Memo source used by the existing public guides.

## Validation

All six Installation/Features pages were read and checked for task orientation, shared
terminology, factual boundaries and relevant onward links. Reviewed browser tests now
check the intended project overview and tool-guide hub rather than removed command-table
counts or messenger tabs. Existing copy/clipboard, Node help, session screenshot and
Markdown tests remain exercised.

- Release-pinned sync and localization: passed, complete/source-matched translations.
- Refreshed tg/max command contracts; strict docs checks: no reference gaps or invalid examples.
  The report still lists 126 illustrations needing manual review across the existing corpus;
  no new executable messenger examples were added by this change.
- 255 unit tests and repository lint: passed.
- 18 affected browser tests: passed, including EN/RU/ES, 1440/390 px, axe, deep-link navigation,
  actual clipboard text, term hints and Markdown exports.
- Type checking runs in the pre-push gate; full export/link/SEO/browser validation runs in CI
  and deployment before publication. No live messenger actions were used.
