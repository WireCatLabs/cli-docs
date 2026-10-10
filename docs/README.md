# Documentation index and ownership

The active page-by-page content plan is [reader documentation refresh](plans/2026-10-08-reader-documentation-refresh.md).

Start with [authoring rules](AUTHORING.md), the [approved terminology](TERMINOLOGY.md) and
the [PR and release review workflow](REVIEWING.md) before writing or reviewing a page. The
[documentation system plan](plans/2026-10-07-documentation-system.md) records the manual baseline,
implementation order and validation gaps. [STRUCTURE.md](STRUCTURE.md) defines tool page files
and sidebar rules; [DESIGN.md](DESIGN.md) covers presentation.

[TOOLING.md](TOOLING.md) explains source packs, strict command/reference coverage, spelling,
Mermaid diagrams and the isolated CodeWiki comparison. Task mappings live in `tasks.json`.

This is the maintainer index, not another public user guide. It identifies existing homes for
reader questions so authors can improve them instead of creating overlapping pages.

## Reader path

Start here → install and connect → first useful task → the next task or relevant help.
Readers can enter through search at any point; every page must orient them independently.
Keep references and technical explanations reachable without placing them ahead of first use.

## Shared pages

Paths below are relative to `content/docs/`; each has English, Russian and Spanish variants.
These pages and shared interface/Markdown behavior belong to this repository.

| Reader question | Current home | Page job | Next editorial action |
| --- | --- | --- | --- |
| What is WireCat and where do I start? | `index.mdx` | Orientation | Check claims and scope against both reviewed releases |
| How do I install and connect my account? | `installation.mdx` | Tutorial | Keep the first-success path above optional recovery/detail |
| Why does my agent not see the tool? | `agents.mdx` | Setup/recovery | Preserve the “usually already connected” distinction |
| What should I ask first? | `first-tasks.md` | Tutorial/task hub | Pilot catch-up, older-history search and draft workflows here |
| What do my accounts know about a person? | `people.md` | Task guide | Review source and data boundaries |
| Can I see what the agent does? | `meeting-brief.mdx` | Interactive demo | Reuse reviewed meeting, inbox and search scenarios with sources |
| How do I find a message or agreement? | `search.md` | Task guide | Lead with an agent request; keep terminal syntax optional |
| How do I connect a browser AI app? | `browser-apps.mdx` | Connection guide | Preserve current web setup instructions |
| How do I ask for a useful result? | `prompting.mdx` | Task guidance | Cross-link to worked examples instead of duplicating dialogues |
| How do I review a reply in my messaging app or use an auto-reply template? | `drafts-and-templates.mdx` | Task guide and explanation | Keep template facts in step with the tools' auto-reply guides |
| Can it do my task in Telegram or MAX? | `features.mdx` | Capability orientation | Verify differences; link task homes, not only command lists |
| Which connection does my AI app need? | `mcp.mdx` | Explanation/setup | Explain the decision before client configuration |
| How do I discover a bot method? | `bot-api.mdx` | Reference orientation | Link messenger-specific bot prerequisites and use cases |
| What can read or change my data? | `security.mdx` | Explanation | Lead with user decisions, then verified detail |
| Can I try search without connecting? | `search-playground.mdx` | Interactive explanation | Keep sample behavior and limitations accurate |
| How do the tools work internally? | `architecture.mdx` | Technical explanation | Trial beautiful-mermaid on one existing diagram |
| How do search and conversation processing work? | `search-architecture.mdx` | Technical explanation | Reconcile playground description; keep source/release boundary |
| How do I check questions and activity in my group? | `group-admins.md` | Task guide | Start with a request and sources; inspect coverage before changes |
| How do I save or override settings? | `configuration.mdx` | Configuration guide | Explain when settings matter and how to verify the effective value |
| What may the agent change? | `permissions.mdx` | Access guide | Distinguish terminal confirmation, MCP permissions and app approval |
| Which account or bot will run the task? | `profiles.md` | Account selection | Explain named profiles before configuration syntax |

## Messenger pages

Each row applies to `tg` and `max` where supported. Public addresses remain
`/{lang}/docs/{tool}/{page}`. The owning source is `docs/{page}.md` in `tg-cli` or `max-cli`,
except changelog, which comes from the root `CHANGELOG.md`. Translations live here under
`translations/{tool}/`; concise tool entry pages live under `translations/overviews/`.

| Reader question | Page | Job |
| --- | --- | --- |
| Where should I start with this messenger? | `index` | Messenger entry point |
| What are the install/update options? | `installation` | Tool installation details |
| How do I log in, switch accounts or log out? | `sessions` | Account/session guide |
| How do I read, send and work with my account? | `usage` | Daily-use guide and task sections |
| What history exists locally and how do I get more? | `archive` | Storage, coverage, fetch/export guide |
| How do I search messages? | `search` | Search guide and language-reference entry |
| How do I run a bot? | `bot` | Bot setup and operations |
| How do I manage a group? | `groups` | Group tasks and capabilities |
| How do I connect this messenger through MCP? | `mcp` | Tool-specific MCP contracts/settings |
| How do I connect an AI app to another computer? | `remote` | Remote connection guide |
| How do I repeat or schedule a whole task? | `recipes` | Automation/task recipes |
| What is the exact command or option? | `commands` | Generated command reference |
| How do I inspect or change a setting? | `configuration` | Settings guide/reference |
| What did a failed command do? | `diagnostics` | Diagnostic evidence guide |
| How do I recover from this error? | `troubleshooting` | Symptom-based recovery |
| What is specific to this messenger's data/access? | `security` | Messenger-specific security |
| What changed in a release? | `changelog` | Release reference |
| What is planned? | `roadmap` | Planned work, distinct from supported behavior |

The exact inventory is resolved from the reviewed releases and `meta.json`, not this table.
Required page and sidebar validation already exist in cli-core and sync. New page types must
retain one owning source and corresponding locale/Markdown behavior.

## Manual task coverage baseline

“Present” means a task has a current home, not that every step has been executed or certified.
This baseline comes from local page inspection on 7 October 2026, before generator runs.

| User task | Current homes | Coverage judgment | Planned improvement |
| --- | --- | --- | --- |
| Connect an account and get a first answer | Installation, agents, first tasks | Present | Reader task and first-success checks |
| Catch up and see who needs an answer | First tasks, usage, recipes | Present across several pages | Clarify hub versus walkthrough versus automation |
| Find a decision in older messages | First tasks, archive, search | Present | Check data coverage/recovery before grammar detail |
| Prepare for a meeting | First tasks, prompting | Present | Keep one worked example; link shorter prompt guidance |
| Draft and send replies | First tasks, prompting, usage, configuration | Present | Check draft/approval/send result and permission boundaries |
| Voice notes, files, export, reminders | Prompting, usage, archive, recipes | Present as sections | Rank by task usefulness; split only if navigation needs it |
| Bot/group management | Bot API, tool bot/groups pages | Present | Keep bot and personal-account prerequisites explicit |
| Fix setup, missing history or command errors | Installation, troubleshooting, diagnostics | Present | Review incoming task links and recovery success checks |

Command-reference completeness, valid examples and useful task coverage are separate measures.
A command can have exact reference coverage without needing its own tutorial. The next phase
will compare the release command trees to references and authored examples, then map important
command families to these task homes. Do not infer coverage percentages from prose mentions.

## Before adding a page

Identify the distinct user question, existing closest home, evidence, source owner, inbound link,
expected result and next destination. If these do not justify a standalone page, improve the
existing section. Record a gap as “needs a clearer example/link/explanation” when that is the
actual problem; “no separate page” is not itself a gap.
