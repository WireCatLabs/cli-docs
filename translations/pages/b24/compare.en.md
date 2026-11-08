---
title: "Compared with other tools"
---

`b24` is a command line and an MCP server for the sales data of a Bitrix24 portal: deals, leads, contacts,
companies, pipelines, products and employees. This page puts it next to the other tools that let an AI agent read
and change a Bitrix24 CRM, so you can see which one fits your job. The marks for `b24` come from its release 0.7.0,
its commands and its source, checked on 8 November 2026; they are checked again at each release. The marks for the
other tools come from their own documentation, listings and source, checked on 7 November 2026, and for CSV export
on 8 November 2026. Nothing was signed in to or tested live, and a tool may do more than its pages say.

The tools:

- **b24**: this tool. Keeps a copy of deals, leads and pipelines on your computer, and decides for each action what
  an agent may do. It signs in with an incoming webhook of the portal.
- **[Vibecode MCP](https://vibecode.bitrix24.com/docs-content-en/mcp.md)**: Bitrix24's own MCP server, on its
  Vibecode API, with 53 tools across the whole platform (npm `@bitrix24/mcp-vibecode-api`, release 3.4.1 on
  6 November 2026).
- **[Zapier MCP](https://zapier.com/mcp/bitrix24-crm-new)**: Zapier's hosted MCP server with the Bitrix24 CRM app.
  Each tool call uses two Zapier tasks.
- **[MCP Bridge](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/)**: a hosted MCP
  connector from the Bitrix24 Market, made by a partner company (604 installs on 7 November 2026).
- **[bitrix24-mcp-server](https://github.com/gunnit/bitrix24-mcp-server)**: the most starred open-source MCP server
  that covers the whole CRM (35 stars, last change July 2025).

`b24`, Vibecode MCP and bitrix24-mcp-server call the portal's REST API, which a cloud portal has only on a paid
plan ([Bitrix24's page](https://apidocs.bitrix24.com/first-steps/access-to-rest-api.html)).
The Zapier app also works with paid plans only ([its listing](https://www.bitrix24.pl/apps/app/integrations24.zapierbitrix24crm/)).

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation · n/a cannot apply

## Features

| Task | b24 | [Vibecode MCP](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [Zapier MCP](https://zapier.com/mcp/bitrix24-crm-new) | [MCP Bridge](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [bitrix24-mcp-server](https://github.com/gunnit/bitrix24-mcp-server) |
|---|:-:|:-:|:-:|:-:|:-:|
| **Find and read** | | | | | |
| List the open deals of a stage or a pipeline | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [🟡](https://zapier.com/mcp/bitrix24-crm-new) | [✅](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [✅](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L470-L500) |
| See a pipeline's funnel: how many deals reached each stage | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | ➖ | ➖ | ➖ |
| Read deals and leads without the internet | ✅ | ➖ | ➖ | ➖ | ➖ |
| Find a deal or a lead by a word in its title | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [🟡](https://zapier.com/mcp/bitrix24-crm-new) | ➖ | ➖ |
| One search over deals and the messages and notes of your other tools | ✅ | ➖ | ➖ | ➖ | ➖ |
| See the portal's own fields, with their labels and options | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [🟡](https://www.bitrix24.pl/apps/app/integrations24.zapierbitrix24crm/) | ➖ | ➖ |
| Read products and employees | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | ➖ | ➖ | [🟡](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L805) |
| Export deals, leads, contacts or companies to a CSV file for a spreadsheet | ✅ | ➖ | ➖ | ➖ | ➖ |
| **Change the CRM** | | | | | |
| Create and update a deal or a lead | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [✅](https://zapier.com/apps/bitrix24-crm-new/integrations) | [🟡](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [✅](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L79-L147) |
| Create and update contacts and companies | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [✅](https://zapier.com/apps/bitrix24-crm-new/integrations) | [🟡](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [✅](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L6-L78) |
| Move a deal to a stage by the stage's name | ✅ | [🟡](https://unpkg.com/@bitrix24/mcp-vibecode-api@3.4.1/dist/tools/entities.js) | ➖ | ➖ | [🟡](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L142) |
| Close a deal as won or lost in one step | ✅ | [🟡](https://unpkg.com/@bitrix24/mcp-vibecode-api@3.4.1/dist/tools/entities.js) | ➖ | ➖ | [🟡](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L142) |
| Delete a deal or a lead | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | ➖ | [🟡](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [❌](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts) |
| Set a custom field by its label | ✅ | ➖ | ➖ | ➖ | ➖ |
| Call any other Bitrix24 method | ✅ | [🟡](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | ➖ | ➖ | ➖ |
| **Agents and safety** | | | | | |
| Make the agent read-only | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/keys-auth/access-mode.md) | [🟡](https://zapier.com/mcp) | ➖ | ➖ |
| Choose for each action: allow, ask first, or refuse | ✅ | [🟡](https://vibecode.bitrix24.com/docs-content-en/keys-auth.md) | [🟡](https://zapier.com/mcp) | ➖ | ➖ |
| A delete asks first | 🟡 | [🟡](https://unpkg.com/@bitrix24/mcp-vibecode-api@3.4.1/dist/tools/entities.js) | ➖ | ➖ | n/a |
| Methods that message people or start workflows are refused until you allow them | ✅ | [🟡](https://vibecode.bitrix24.com/docs-content-en/keys-auth.md) | ➖ | ➖ | ➖ |
| Giving a record to another employee is refused until you allow it | ✅ | ➖ | ➖ | ➖ | ➖ |
| See what a write would do, without making it | ✅ | ➖ | ➖ | ➖ | ➖ |
| A write is never sent twice after a lost answer | ✅ | ➖ | ➖ | ➖ | ➖ |
| The webhook or key is kept in the system keyring | ✅ | ➖ | n/a | n/a | ➖ |
| **Setup** | | | | | |
| Several portals, each named in the command | ✅ | [🟡](https://vibecode.bitrix24.com/docs-content-en/keys-auth.md) | ➖ | ➖ | ➖ |
| Works from ChatGPT or Claude in the browser | 🟡 | [🟡](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [✅](https://zapier.com/mcp) | [✅](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [🟡](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/server.js#L91) |

| | b24 | Vibecode MCP | Zapier MCP | MCP Bridge | bitrix24-mcp-server |
|---|---|---|---|---|---|
| Install | npm, Node 22.16+ or 24+ | npm, Node 18+ | none: hosted | from the Bitrix24 Market | from source |
| Licence | Apache-2.0 | MIT | closed service | closed service | MIT in `package.json`, no licence file |
| Price | free, on a paid Bitrix24 plan | free, on a paid Bitrix24 plan | two Zapier tasks per call, on a paid Bitrix24 plan | free, with paid extras | free, on a paid Bitrix24 plan |

Notes on the `b24` column:

- **Read-only.** `B24_READ_ONLY=1` refuses every write, whatever the settings say. The `readonly` level does the
  same for one key. Without either, a new profile lets an agent create, update, move and close deals and leads.
- **Allow, ask or refuse.** Each command has its permission key, such as `deals.delete` or `leads.move`, set to
  `allow`, `ask`, `readonly` or `deny` in [the settings](./configuration.md#permissions). `mcp serve --permission`
  makes a key stricter for one server only. An agent over MCP cannot change these settings.
- **A delete asks first** at a terminal. Over MCP nobody is there to answer, so `ask` lets the agent go ahead. To
  stop an agent from deleting, set `deals.delete` and `leads.delete` to `deny`. So this row is partly.
- **Messages and workflows.** `api call` refuses the methods that message people, publish, start workflows or create
  tasks, until you allow them. A stage change can still start the portal's own robots, which may write to your
  clients: set `deals.move` and `leads.move` to `ask` or `deny` if your portal has such robots. See
  [security](./security.md).
- **Another employee.** Bitrix24 tells an employee when a record is given to them, so `--owner` with someone else is
  refused until you set `crm.assign-others` to `allow`.
- **Without the internet.** `sync` copies pipelines, deals, leads, contacts and companies into the local store, and
  `deals`, `leads`, `pipelines` and `stages` read it, with `--offline` too. `people`, `organizations`, `products` and
  `users` always ask the portal.
- **One search.** `search all` finds deals and leads by the words of their title, beside the messages, notes and
  events that other WireCat tools on the same computer stored, without the internet. Under `deals.list: deny` it
  leaves deals out, and under `leads.list: deny` leads, and names what it left out.
- **CSV.** `deals`, `leads`, `people` and `organizations list --format csv` print one page as a table for a spreadsheet,
  each custom field headed by its label; `--json=a,b` picks the columns. It is for you at a terminal: no MCP tool offers
  it, and an agent reads the JSON answer.
- **Custom fields by label.** Deals, leads, contacts and companies take a custom field by its label or code, and a
  list field's option by its label. Deals and leads read the labels that the last `sync` stored.
- **A write is sent once.** A write that got no answer is not sent again: it ends as `outcome_unknown` with its
  `operation_id`. Check the portal before you write it again: Bitrix24 makes a repeated write a second time.
- **Only one call.** `api call` is kept for you at a terminal; no MCP tool offers it.
- **ChatGPT or Claude in the browser.** `mcp serve --http` serves the tool behind an HTTPS tunnel that you set up and
  keep running yourself, so this row is partly. See [usage](./usage.md#agents).
- **Speed and cost against a browser agent.** `b24` calls the portal's REST API and reads its own copy; it opens no
  browser. No measurement of it against a browser agent is published, so this page makes no claim.

## When another tool fits better

- **Zapier MCP**: you want Bitrix24 in ChatGPT or Claude in the browser, with nothing to run on your computer.
- **MCP Bridge**: your team wants one connector installed from the Bitrix24 Market, for the CRM and for tasks.
- **Vibecode MCP**: you need more of Bitrix24 than sales data, such as tasks, chats and workflows, from Bitrix24's own
  server.

If `b24` fits, start with [installation](./installation.md). To use it with an agent, see [usage](./usage.md).
