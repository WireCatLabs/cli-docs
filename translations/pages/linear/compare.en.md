---
title: "Compared with other tools"
---

`linear` is a command line and an MCP server for Linear: issues, projects, teams, workflow states, labels and comments.
This page puts it next to the other tools that let an AI agent read and change Linear, so you can see which one fits
your job. The marks for `linear` come from its first release, its commands and its documentation, checked on
19 November 2026 against linear-cli 0.1.0, not against a live workspace. They are checked again at each release. The
marks for the other tools come from their own documentation and source, linked in the table, checked on 19 November
2026. Nothing was signed in to or tested live, and a tool may do more than its pages say.

The tools:

- **linear**: this tool. Keeps a copy of your Linear workspace on your computer, reaches every operation of Linear's
  API, and decides for each action what an agent may do. It signs in with a personal API key.
- **[Linear MCP](https://linear.app/docs/mcp)**: Linear's official MCP server, run by Linear at `mcp.linear.app`. You
  connect an AI app to it and sign in to Linear in the browser.
- **[schpet/linear-cli](https://github.com/schpet/linear-cli)**: the most starred open-source Linear command line (1,051
  stars, changed on 17 November 2026). Its command is also `linear`. It works next to git and jj: it starts an issue
  on a new branch and opens a pull request for it. Its marks follow its main branch, which is the coming 4.0 release.
- **[linearis](https://github.com/linearis-oss/linearis)**: a Linear command line made for AI agents, with JSON
  output only (267 stars, changed on 28 October 2026). It covers the operations of daily work, not the whole API.
- **[mcp-linear](https://github.com/tacticlaunch/mcp-linear)**: the most starred open-source Linear MCP server that is
  still kept up (151 stars, changed on 13 November 2026), with 240 tools, on npm as `@tacticlaunch/mcp-linear`.

Linear lets a program in through a
[personal API key](https://linear.app/docs/api-and-webhooks), made in the account's security settings. It acts with
that user's rights. A key can be limited to some permissions, such as Read only, and to some teams. Every tool on this
page takes such a key, and Linear MCP also signs in with OAuth. The earlier community server
[linear-mcp-server](https://github.com/jerhadf/linear-mcp-server/blob/5e2cb621c52762618eb015b4a8d6bf884021b29e/README.md?plain=1#L5)
(348 stars) is deprecated and points to Linear MCP, so it is not in the table. Linear's own SDK and GraphQL API are for
programmers who write their own code, so they are not in the table either.

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation · n/a cannot apply

## Features

| Task | linear | [Linear MCP](https://linear.app/docs/mcp) | [schpet/linear-cli](https://github.com/schpet/linear-cli) | [linearis](https://github.com/linearis-oss/linearis) | [mcp-linear](https://github.com/tacticlaunch/mcp-linear) |
|---|:-:|:-:|:-:|:-:|:-:|
| **Find and read** | | | | | |
| Read issues without the internet | ✅ | [❌](https://linear.app/docs/mcp) | [❌](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/crates/linear-cli/src/config/options.rs#L20) | [❌](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/src/client/graphql-client.ts#L7) | [❌](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/src/index.ts#L43-L46) |
| Find an issue by its words | ✅ | [✅](https://linear.app/docs/mcp) | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/README.md?plain=1#L157-L158) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L80-L82) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/TOOLS.md?plain=1#L129) |
| List issues by state or assignee | ✅ | ➖ | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/README.md?plain=1#L153-L159) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/src/commands/issues.ts#L693-L703) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/src/tools/definitions/issue-tools.ts#L276-L300) |
| List projects, teams, users, states and labels | ✅ | [🟡](https://linear.app/docs/mcp) | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/crates/linear-cli/src/cli/mod.rs#L130-L168) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L162-L170) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/TOOLS.md?plain=1#L47-L76) |
| **Change** | | | | | |
| Create and update an issue | 🟡 | [✅](https://linear.app/docs/mcp) | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/README.md?plain=1#L166-L173) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L84-L85) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/TOOLS.md?plain=1#L130-L131) |
| Comment on an issue | 🟡 | [✅](https://linear.app/docs/mcp) | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/README.md?plain=1#L177-L181) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L97-L108) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/TOOLS.md?plain=1#L132) |
| Every query and mutation of Linear's API | ✅ | [🟡](https://linear.app/docs/mcp) | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/crates/linear-cli/src/cli/mod.rs#L180-L184) | [🟡](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L146-L152) | [🟡](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/README.md?plain=1#L16-L30) |
| Make an issue your own task | ✅ | ➖ | ➖ | ➖ | ➖ |
| **Agents and safety** | | | | | |
| Let an agent read only | ✅ | [✅](https://linear.app/docs/mcp) | [🟡](https://linear.app/docs/api-and-webhooks) | [🟡](https://linear.app/docs/api-and-webhooks) | [🟡](https://linear.app/docs/api-and-webhooks) |
| Choose for each action: allow, ask or refuse | ✅ | ➖ | ➖ | ➖ | ➖ |
| A delete or archive needs a permission of its own | ✅ | ➖ | [🟡](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/crates/linear-cli/src/cli/mod.rs#L218-L222) | [❌](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L160) | [❌](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/TOOLS.md?plain=1#L170) |
| See what a write would send, without sending it | ✅ | ➖ | ➖ | ➖ | ➖ |
| The key is kept in the system keyring | ✅ | n/a | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/docs/authentication.md?plain=1#L13-L15) | [❌](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/src/common/encryption.ts#L11-L14) | [❌](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/README.md?plain=1#L152-L168) |
| An agent at a terminal works through commands, without MCP | ✅ | n/a | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/README.md?plain=1#L414-L419) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L223-L231) | n/a |
| **Setup** | | | | | |
| An MCP server | ✅ | [✅](https://linear.app/docs/mcp) | [❌](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/crates/linear-cli/src/cli/mod.rs#L129-L184) | [❌](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L233-L242) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/README.md?plain=1#L5-L7) |
| Works from ChatGPT or Claude in the browser | 🟡 | [✅](https://linear.app/docs/mcp) | n/a | n/a | [❌](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/src/mcp-server.ts#L127-L128) |
| Several workspaces, each named in the command | ✅ | [🟡](https://linear.app/docs/mcp) | [🟡](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/docs/authentication.md?plain=1#L3-L11) | [❌](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/src/common/auth.ts#L19-L41) | [🟡](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/README.md?plain=1#L86) |

| | linear | Linear MCP | schpet/linear-cli | linearis | mcp-linear |
|---|---|---|---|---|---|
| Install | npm, Node 22.16+ or 24+ | none: Linear runs it, you add its address to your AI app | Homebrew, npm, a binary or cargo | npm, Node 22+ | npm or `npx`, Node 20+ |
| Sign-in | personal API key | OAuth in the browser, or an API key in a header | personal API key | personal API key | personal API key, or the OAuth token of your own Linear OAuth app |
| Licence | Apache-2.0 | closed service | ISC | MIT | MIT |
| Price | free | not stated on its page | free | free | free |

Notes on the `linear` column:

- **Sign-in.** A personal API key acts with the rights of the Linear user who made it. `session start` reads it from
  stdin or a hidden prompt, never from an argument, and checks it with Linear before it keeps it. It is kept in the
  system keyring, or in a private file on a computer without one. See [installation](./installation.md).
- **Without the internet.** `sync` copies teams, users, workflow states, labels, projects, issues and comments into the
  WireCat local store. Archived ones are kept and marked. After the first run it reads only what changed, and once a
  day it finds what Linear deleted. `issues list`, `issues show` and `issues search` read this copy, with `--offline`
  too. The copy belongs to the user whose key signed in, since Linear shows each member other teams.
- **Writes.** The `issues` commands only read the copy. An issue is created, updated or commented on through the `api`
  group, such as `api issue-create` or `api comment-create`, with the input as JSON. So these rows are partly.
- **The api group.** `linear <profile> api` has one command for each query and mutation of Linear's GraphQL schema,
  each with its own flags and help. `api list` names them all.
- **Your task.** `issues assign ENG-12` makes the issue your WireCat task: a local task that points at the issue and
  copies none of its text. It changes nothing in Linear and does not assign the issue to anyone there.
- **Read-only.** `WCLINEAR_READ_ONLY=1` refuses every write, whatever the settings say. The `readonly` level does the
  same for one key, such as `api`.
- **Allow, ask or refuse.** Each command and each API operation has its key, set to `allow`, `ask`, `readonly` or
  `deny` per profile in [the settings](./configuration.md#permissions). A write asks for its own key, and a delete or
  archive also needs `linear.delete`. `mcp serve --permission` makes a key stricter for one server only.
- **Over MCP.** Nobody is there to answer `ask`, so `ask` lets the agent go ahead. Each write an agent made is kept in
  `runs list`. To stop writes, set `permissions.api` to `readonly`, or one operation to `deny`.
- **Dry run.** `--dry-run` shows what a write would send to Linear, and sends nothing.
- **Several workspaces.** Every command starts with a profile, a name you choose for one account. No profile is
  assumed, not even the only one. See [usage](./usage.md).
- **ChatGPT or Claude in the browser.** `mcp serve --http` serves the tool behind a tunnel that you set up and keep
  running yourself, so this row is partly.

## When another tool fits better

- **Linear MCP**: you want ChatGPT or Claude in the browser with nothing to run on your computer, or you prefer to sign
  in with OAuth and not make an API key.
- **schpet/linear-cli**: you work from git or jj, and want to start an issue on its branch and open its pull request
  from the terminal. It also attaches files to issues and comments.
- **linearis**: an agent should create or update many issues in one batch, or upload and download files, with a small
  command reference in its context.
- **mcp-linear**: an agent works only over MCP and should reach areas such as webhooks, customers, templates and
  project updates through tools with their own names.

If `linear` fits, start with [installation](./installation.md). To use it with an agent, see [usage](./usage.md).
