---
title: "Compared with other tools"
---

`amo` is a command line and an MCP server for the sales data of an amoCRM or Kommo account: deals, contacts,
companies, pipelines, tasks and users. This page puts it next to the other tools that let an AI agent read and change
amoCRM, so you can see which one fits your job. The marks for `amo` come from its first release, its commands
and its source, checked on 16 November 2026 against a test account built from the Kommo OpenAPI reference, not
against a live account. They are checked again at each release. The marks for the other tools come from their own
documentation and source, linked in the table, checked on 16 November 2026. Nothing was signed in to or tested live,
and a tool may do more than its pages say.

The tools:

- **amo**: this tool. Keeps a copy of your deals and their clients on your computer, and decides for each action what
  an agent may do. It signs in with a long-lived token of a private integration, or through your own integration in
  the browser.
- **[Kommo-MCP](https://github.com/Miguelgbastos/Kommo-MCP)**: the most starred open-source MCP server for Kommo
  (16 stars, changed on 16 November 2026), with 23 tools.
- **[amocrm-kommo-mcp](https://github.com/penmadebykisss/amocrm-kommo-mcp)**: an MCP server for amoCRM and Kommo with
  reports for a sales manager: the funnel, stalled deals and a ranking of managers. A paid hosted version exists.
- **[amocrm-mcp](https://github.com/theYahia/WWmcp/tree/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm)**:
  an MCP server on npm (`@theyahia/amocrm-mcp` 2.0.2), with 19 tools. A survey of MCP servers for Russian services on
  [sostav.ru](https://www.sostav.ru/blogs/289407/104725) names it.
- **[Composio](https://composio.dev/toolkits/kommo)**: Composio's hosted MCP server, with 53 tools for Kommo.
- **[amocrm-cli](https://github.com/polza-ai/amocrm-cli)**: another command line for amoCRM and Kommo, for people and
  agents (npm `@polza-ai/amocrm-cli` 0.1.0, 27 June 2026).

amoCRM and Kommo have no MCP server of their own for CRM data. Their
[AI API](https://developers.kommo.com/reference/ai-api-methods) feeds their own AI assistant and gives no deals to an
agent. A long-lived token is made by the account's administrator in a private integration, and it acts with that
administrator's rights ([Kommo](https://developers.kommo.com/docs/long-lived-token)). Every tool on this page except Composio
signs in this way or through OAuth.

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation · n/a cannot apply

## Features

| Task | amo | [Kommo-MCP](https://github.com/Miguelgbastos/Kommo-MCP) | [amocrm-kommo-mcp](https://github.com/penmadebykisss/amocrm-kommo-mcp) | [amocrm-mcp](https://github.com/theYahia/WWmcp/tree/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm) | [Composio](https://composio.dev/toolkits/kommo) | [amocrm-cli](https://github.com/polza-ai/amocrm-cli) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Find and read** | | | | | | |
| List the open deals of a stage or a pipeline | ✅ | [✅](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L22-L50) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L79-L106) | [✅](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/tools/leads.ts#L9-L13) | [🟡](https://composio.dev/toolkits/kommo) | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/leads.ts#L46-L62) |
| Find a contact by name, phone or e-mail | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L154-L162) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L195-L200) | [✅](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/tools/contacts.ts#L6) | ➖ | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/contacts.ts#L39) |
| List open and overdue tasks | ✅ | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L174-L182) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L224-L228) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/tools/tasks.ts#L13) | [🟡](https://composio.dev/toolkits/kommo) | [🟡](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/tasks.ts#L27-L28) |
| Read deals without the internet | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/kommo-api.ts) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/api.js#L59-L67) | [❌](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/client.ts#L155) | ➖ | [❌](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/client/http.ts#L11) |
| One search over deals and the messages and notes of your other tools | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Change the CRM** | | | | | | |
| Create and update contacts and companies | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L154-L173) | [🟡](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L135-L160) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L93-L122) | [✅](https://composio.dev/toolkits/kommo) | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/contacts.ts#L95-L131) |
| Move a deal to a stage by the stage's name | ✅ | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L105-L117) | [🟡](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L169-L178) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L64-L73) | ➖ | [🟡](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/leads.ts#L162) |
| Close a deal as lost, with its loss reason, in one step | ✅ | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L87-L117) | [🟡](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L169-L178) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L64-L73) | ➖ | [🟡](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/leads.ts#L162) |
| Set a task or add a note on a deal | 🟡 | [✅](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L184-L257) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L209-L290) | [✅](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L144-L194) | [🟡](https://composio.dev/toolkits/kommo) | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/tasks.ts#L80-L120) |
| **Summaries and changes** | | | | | | |
| Funnel: how many deals reached each stage | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/kommo-api.ts#L687-L800) | [🟡](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L310-L318) | ➖ | ➖ | ➖ |
| Share of deals won in a period | ✅ | [✅](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/kommo-api.ts#L687-L760) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L332) | ➖ | ➖ | ➖ |
| Open deals unchanged for more than N days | ✅ | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L22-L50) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L341) | ➖ | ➖ | ➖ |
| What changed in a day: new deals, stage moves, wins and losses | ✅ | ➖ | ➖ | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L206) | [🟡](https://composio.dev/toolkits/kommo) | [🟡](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/README.md) |
| A scheduled morning CRM summary to Telegram or e-mail | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Agents and safety** | | | | | | |
| Let an agent read only | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/server.ts#L22-L23) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L26-L27) | ➖ | ➖ | ➖ |
| Choose for each action: allow, ask or refuse | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/server.ts#L22-L23) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L26-L27) | ➖ | ➖ | ➖ |
| A write waits for your confirmation | 🟡 | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/server.ts#L84-L95) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L17-L27) | ➖ | ➖ | ➖ |
| Actions that message clients or start a Salesbot are refused until you allow them | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L286-L315) | n/a | n/a | n/a | n/a |
| See what a write would do without making it | ✅ | ➖ | ➖ | ➖ | ➖ | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/leads.ts#L120-L140) |
| A write is not sent twice when its answer is lost | ✅ | [✅](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/kommo-api.ts#L397-L411) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/api.js#L79-L82) | ➖ | ➖ | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/client/http.ts#L20-L22) |
| The token is kept in the system keyring | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/stdio.ts#L10-L23) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/api.js#L22) | [❌](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/client.ts#L12-L18) | n/a | [❌](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/config/config.ts#L76) |
| An agent at a terminal works through commands, without MCP | ✅ | n/a | n/a | n/a | n/a | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/README.md) |
| **Setup** | | | | | | |
| Several accounts, each named in the command | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/stdio.ts#L10-L23) | [🟡](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/http.js#L5-L18) | [❌](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/client.ts#L12-L18) | [✅](https://composio.dev/toolkits/kommo) | [🟡](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/config/config.ts#L76-L79) |
| Works from ChatGPT or Claude in the browser | 🟡 | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/http-streamable.ts#L111-L113) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/README.md) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L10) | [✅](https://composio.dev/toolkits/kommo) | ➖ |
| Works with both amoCRM.ru and Kommo | ✅ | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/README.md) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/api.js#L22-L30) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/client.ts#L155) | [🟡](https://composio.dev/toolkits/kommo) | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/config/config.ts#L77) |

| | amo | Kommo-MCP | amocrm-kommo-mcp | amocrm-mcp | Composio | amocrm-cli |
|---|---|---|---|---|---|---|
| Install | npm, Node 22.16+ or 24+ | from source, Node 22.13+ | `npx` from GitHub, Node 18+ | npm | none: hosted | npm |
| Licence | Apache-2.0 | MIT | MIT | MIT | closed service | MIT |
| Price | free | free | free, the hosted version by subscription | free | 100,000 calls a month free, paid above that | free |

Notes on the `amo` column:

- **Sign-in.** A long-lived token of a private integration acts with the rights of the administrator who made it.
  Signing in through your own integration in the browser acts as the user who signs in, and `amo` renews the tokens by
  itself. Either is kept in the system keyring, or in a private file on a computer without one. See
  [usage](./usage.md#sign-in).
- **Read-only.** `AMO_READ_ONLY=1` refuses every write, whatever the settings say. The `readonly` level does the same
  for one key. Without either, a new profile lets an agent create, update, move and close deals, and create and update
  contacts and companies.
- **Allow, ask or refuse.** Each command and each API operation has its key, such as `deals.update` or
  `api.leads.patch`, set to `allow`, `ask`, `readonly` or `deny` in [the settings](./permissions.md).
  `mcp serve --permission` makes a key stricter for one server only. An agent over MCP cannot change these settings.
- **Confirmation.** `ask` asks at a terminal. Over MCP nobody is there to answer, so `ask` lets the agent go ahead,
  and this row is partly. To stop an agent from writing, set the key to `deny` or `readonly`.
- **Messages and Salesbots.** Conversations, chats, Salesbots, webhooks, widgets and switching users on or off are
  refused, reads too, until you allow them. So are writes of tasks, roles and lead sources. Giving a deal, a task or a
  contact to another user is refused until you set `crm.assign-others` to `allow`.
- **Tasks and notes.** There is no command of its own for them. A task or a note is written only through `api call`
  at a terminal, after you allow its key, so this row is partly. No MCP tool offers `api call`. The tasks, comments
  and calls on your deals from the last 90 days are read with `activities list`, once you turn on the `activities`
  setting.
- **Without the internet.** `sync` copies the pipelines and the deals assigned to you and to the colleagues you choose,
  with their contacts and companies. `deals`, `pipelines`, `stages`, `activities` and `changes` read this copy, with
  `--offline` too. `people`, `organizations` and `users` always ask amoCRM. No sync copies the whole CRM.
- **One search.** `search all` finds deals beside the messages, notes and meetings that other WireCat tools on the same
  computer stored, without the internet.
- **A contact by phone or e-mail.** `people list` passes your words to amoCRM's own search. A user who is not the
  administrator and signed in through their own integration sees the phones and e-mails of their own clients only, and
  at most 100 other contacts a day.
- **Funnel.** `pipelines show` counts how many deals reached each stage and went on, from the stage history that `sync`
  reads from amoCRM's events, and the share won in a period. It has no breakdown by manager.
- **What changed and the summary.** `changes list` shows new deals, stage moves, wins, losses, new owners, and tasks
  added and done. `schedule command … changes list --format report --deliver-to` sends a morning summary to Telegram or
  e-mail through the WireCat tools `tg` or `mail`. Phones and e-mails in it are masked, and no note text goes in.
- **A write is sent once.** A write that got no answer is not sent again. It ends as `outcome_unknown` with its
  `operation_id`. Check amoCRM before you write it again, since amoCRM has no key that would drop a repeat.
- **ChatGPT or Claude in the browser.** `mcp serve --http` serves the tool behind a tunnel that you set up and keep
  running yourself, so this row is partly.
- **Speed and cost against a browser agent.** `amo` calls the amoCRM API, reads its own copy and opens no browser. No
  measurement of it against a browser agent is published, so this page makes no claim.

## When another tool fits better

- **Composio**: you want Kommo in ChatGPT or Claude in the browser, with nothing to run on your computer.
- **amocrm-kommo-mcp**: a sales manager wants one report with a ranking of managers, the average deal and the length of
  the sales cycle, or a hosted version with nothing to install.
- **amocrm-mcp** or **amocrm-cli**: the agent should set tasks and write notes by itself, with no separate permission.

If `amo` fits, start with [installation](./installation.md). To use it with an agent, see [usage](./usage.md).
