---
title: "Compared with other tools"
---

`attio` is a command line and an MCP server for the sales data of an Attio workspace: deals, people, companies, the
deal pipeline and workspace members. This page puts it next to the other tools that let an AI agent read and change
Attio, so you can see which one fits your job. The marks for `attio` come from its current release, its commands and its
source, checked on 19 November 2026. Its tests run against a fake Attio built from Attio's API description, and each
release also passes a check against a live workspace. The marks are checked again at each release. The marks for the
other tools come from their own documentation and source, linked in the table, checked on 19 November 2026. None of
them was signed in to or tested live, and a tool may do more than its pages say.

The tools:

- **attio**: this tool. Keeps a copy of your deals and the people and companies they name on your computer, and
  decides for each action what an agent may do. It signs in with an access token that a workspace admin makes.
  WireCat Desktop installs it and asks for the token.
- **[Attio MCP](https://docs.attio.com/mcp/overview)**: Attio's own MCP server, hosted by Attio, with 53 tools. You
  sign in with your Attio account, and it acts with your own permissions.
- **[attio-mcp](https://github.com/kesslerio/attio-mcp-server)**: the open-source MCP server for Attio with the most
  stars and downloads (68 stars, changed on 10 November 2026, npm `attio-mcp` 1.7.0 with 9,326 downloads in the month
  to 17 November 2026). It has 19 universal tools and more for lists, notes and members.
- **[Composio](https://composio.dev/toolkits/attio)**: Composio's hosted MCP server, with 105 tools for Attio.
- **[Zapier MCP](https://zapier.com/mcp/attio)**: Zapier's hosted MCP server with the Attio app. Each tool call
  uses two Zapier tasks.
- **[FroeMic/attio-cli](https://github.com/FroeMic/attio-cli)**: the open-source command line for Attio with the most
  stars (21 stars, changed on 5 February 2026). Its command is also named `attio`.

How the rivals were chosen: Attio's own server, the open-source MCP server and the open-source command line with the
most GitHub stars, and the two hosted services that list Attio with their tools. The next MCP server has 16 stars and
257 downloads a month, and the next command line has 18 stars. Pipedream also has an Attio MCP server, with 9
actions. It is left out to keep the table to five tools.

Attio's own MCP server needs no token: you sign in with your Attio account, and it sees what your user sees. An access
token is made by a workspace admin in Workspace settings → Developers. It reads, and with write scopes changes, the
whole workspace, whoever uses it. `attio`, attio-mcp and FroeMic/attio-cli sign in with such a token. attio-mcp can
also take an OAuth token through a Cloudflare Worker that you host.

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation · n/a cannot apply

## Features

| Task | attio | [Attio MCP](https://docs.attio.com/mcp/overview) | [attio-mcp](https://github.com/kesslerio/attio-mcp-server) | [Composio](https://composio.dev/toolkits/attio) | [Zapier MCP](https://zapier.com/mcp/attio) | [FroeMic/attio-cli](https://github.com/FroeMic/attio-cli) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Find and read** | | | | | | |
| List the open deals of a stage | ✅ | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L51) | [🟡](https://composio.dev/toolkits/attio) | [🟡](https://zapier.com/mcp/attio) | [✅](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L408-L431) |
| Find a person by name or e-mail | ✅ | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L49-L50) | [✅](https://composio.dev/toolkits/attio) | [✅](https://zapier.com/mcp/attio) | [🟡](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L924-L970) |
| Read the notes and tasks on a deal | 🟡 | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L52-L54) | [✅](https://composio.dev/toolkits/attio) | ➖ | [✅](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L630-L746) |
| Search the e-mails and call recordings that Attio holds | ❌ | [✅](https://docs.attio.com/mcp/overview) | ➖ | ➖ | ➖ | ➖ |
| Read deals without the internet | ✅ | [❌](https://docs.attio.com/mcp/overview) | [❌](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/src/api/client-config.ts#L79) | ➖ | ➖ | [❌](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/src/utils/config.ts#L6) |
| One search over deals and the messages and notes of your other tools | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Change the CRM** | | | | | | |
| Create and update people and companies | 🟡 | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L49-L50) | [✅](https://composio.dev/toolkits/attio) | [✅](https://zapier.com/mcp/attio) | [✅](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L408-L431) |
| Move a deal to another stage | 🟡 | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L51) | [✅](https://composio.dev/toolkits/attio) | [🟡](https://zapier.com/mcp/attio) | [🟡](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L408-L431) |
| Add a note or a task on a deal | 🟡 | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L52-L54) | [✅](https://composio.dev/toolkits/attio) | [✅](https://zapier.com/mcp/attio) | [✅](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L630-L746) |
| **Summaries and changes** | | | | | | |
| How many deals stand in each stage, and their total | ✅ | [✅](https://docs.attio.com/mcp/overview) | ➖ | ➖ | ➖ | ➖ |
| Share of deals won in a period | ✅ | [🟡](https://docs.attio.com/mcp/overview) | ➖ | ➖ | ➖ | ➖ |
| What changed in a day: new deals, stage moves, wins and losses | ✅ | ➖ | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/docs/universal-tools/api-reference.md#L526-L535) | ➖ | ➖ | ➖ |
| A short morning digest of what changed | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Agents and safety** | | | | | | |
| A switch in the tool that lets an agent read only | ✅ | ➖ | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/src/config/tool-mode.ts#L1-L28) | ➖ | [🟡](https://zapier.com/mcp) | [❌](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L140-L170) |
| Choose for each action: allow, ask or refuse | ✅ | [🟡](https://docs.attio.com/mcp/overview) | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L215) | ➖ | [🟡](https://zapier.com/mcp) | [❌](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L140-L170) |
| A write waits for your confirmation | 🟡 | [✅](https://docs.attio.com/mcp/overview) | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L215) | ➖ | ➖ | ➖ |
| See which permissions a command checks, without running it | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| The token is kept in the system keyring | ✅ | n/a | [❌](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L560-L586) | n/a | n/a | [❌](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L140-L170) |
| Sign in with your own Attio account, with no token from an admin | ❌ | [✅](https://docs.attio.com/mcp/overview) | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L446-L450) | [✅](https://composio.dev/toolkits/attio) | ➖ | [❌](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L96-L123) |
| An agent at a terminal works through commands, without MCP | ✅ | n/a | n/a | n/a | n/a | [✅](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md) |
| **Setup** | | | | | | |
| Several workspaces, each named in the command | ✅ | ➖ | ➖ | ➖ | ➖ | [🟡](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L162-L168) |
| Works from ChatGPT or Claude in the browser | 🟡 | [✅](https://docs.attio.com/mcp/overview) | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L446-L450) | [✅](https://composio.dev/toolkits/attio) | [✅](https://zapier.com/mcp) | ➖ |

| | attio | Attio MCP | attio-mcp | Composio | Zapier MCP | FroeMic/attio-cli |
|---|---|---|---|---|---|---|
| Install | npm, Node 22.16+ or 24+ | none: hosted by Attio | npm, Node 20+ | none: hosted | none: hosted | from source, Node 18+ |
| Licence | Apache-2.0 | closed service | Apache-2.0 | closed service | closed service | MIT |
| Price | free | no price on its page | free | 100,000 calls a month free, up to 20,000 of them through apps such as Attio, paid above that | [two Zapier tasks per call](https://docs.zapier.com/mcp/usage) | free |

Notes on the `attio` column:

- **Sign-in.** A workspace admin makes the access token in Workspace settings → Developers. With the three read
  scopes it reads the whole workspace. `attio` keeps it in the system keyring, or in a private file on a computer
  without one, and never prints it. Sign-in through Attio in the browser is on the [roadmap](./roadmap.md). See
  [installation](./installation.md).
- **Read-only.** `WCATTIO_READ_ONLY=1` refuses every write, whatever the settings say. `permissions.api` at
  `readonly` does the same for one profile. A token with read scopes only makes Attio itself refuse every write, and
  that works with any tool on this page that takes a token.
- **Allow, ask or refuse.** Each command and each API operation has its key, such as `deals.list` or
  `api.notes-create`, set to `allow`, `ask`, `readonly` or `deny` in [the permissions](./permissions.md).
  `mcp serve --permission` makes a key stricter for one server only. An agent cannot loosen a permission.
- **Writes over MCP.** The `attio_write` tool runs the writes of the `api` group. They are `allow` from the start, and
  deletes are `ask`. Over MCP nobody is at a terminal to answer, so `ask` lets the agent go ahead, and a token with
  write scopes lets it write and delete. This is why the confirmation row is partly. Set `permissions.api` to
  `readonly`, or turn on approval for `attio_write` in your agent's app. See [MCP](./mcp.md).
- **Changes to the CRM.** The deal, people and company commands only read. Creating a person, moving a deal, or adding
  a note or a task goes through an `api` operation, such as `api objects-records-update` or `api notes-create`, so
  these rows are partly. Commands to move and close deals and to work with notes and tasks are on the
  [roadmap](./roadmap.md).
- **Without the internet.** `sync` copies the deals and the people and companies they name, with the stages of the
  deal pipeline. `deals`, `pipelines`, `stages`, `changes`, `fields` and `search all` read this copy, with `--offline`
  too. `people`, `organizations` and `users` always ask Attio. Attio cannot list only what changed, so each sync reads
  every record.
- **One search.** `search all` finds deals beside the messages, notes and meetings that other WireCat tools on the same
  computer stored, without the internet.
- **Stages and win rate.** `pipelines show` gives each stage's number of deals and their sum per currency, never
  converted. With `--since-time` it adds the share won. Won is the stage Attio celebrates, and lost is a stage whose
  title starts with "Lost". Attio MCP builds counts and totals with its `run-basic-report` tool, so the agent works the
  share out from them.
- **What changed and the digest.** `changes list` shows what the syncs saw: deals created, moved, won, lost and given
  another owner. A change is seen only by a sync. `--format report` turns the window into a short morning digest.
- **The whole Attio API.** `api list` shows every operation of the Attio API, and each one is a command with its own
  help, for what has no command of its own yet.
- **ChatGPT or Claude in the browser.** `mcp serve --http` serves the tool behind a tunnel that you set up and keep
  running yourself, so this row is partly.
- **Speed and cost against a browser agent.** `attio` calls the Attio API, reads its own copy and opens no browser. No
  measurement of it against a browser agent is published, so this page makes no claim.

## When another tool fits better

- **Attio MCP**: you want Attio in Claude, ChatGPT or Cursor with nothing to install, you are not a workspace admin,
  or the agent should read notes, e-mails and call recordings and write with your confirmation.
- **Composio** or **Zapier MCP**: you want Attio beside many other apps in one hosted server.
- **attio-mcp**: the agent should create and update deals, notes and tasks through ready tools on your computer.
- **FroeMic/attio-cli**: a script should manage objects, attributes, lists and entries in a terminal, with no
  permission layer.

If `attio` fits, start with [installation](./installation.md). To use it with an agent, see [usage](./usage.md).
