---
title: "Compared with other tools"
---

`slk` is a command line and an MCP server for Slack: channels, DMs, group DMs, threads, people and files. This page puts
it next to the other tools that let an AI agent read Slack, so you can see which one fits your job. The marks for `slk`
come from its commands and documentation, checked on 24 November 2026. The inbox, search and pace were also checked live
on a test workspace. They are checked again at each release. The marks for the other tools come from their own
documentation and source, linked in the table, checked on 24 November 2026. None of them was signed in to or tested
live, and a tool may do more than its pages say.

The tools:

- **slk**: this tool. Reads Slack as you, with Slack's own search and a copy on your computer, and decides for each
  action what an agent may do. It signs in with the token of a Slack app you make in your own workspace.
- **[Slack MCP server](https://docs.slack.dev/ai/slack-mcp-server/)**: Slack's official MCP server, run by Slack at
  `mcp.slack.com`. An AI app connects to it through OAuth, and workspace admins can approve and manage the apps that
  connect. Slack's [own
  plugin](https://github.com/slackapi/slack-skills-plugin/blob/a6db580e584b44d723dda4f6c6657aa0d04bf4c1/README.md?plain=1#L106-L109)
  connects Claude Code and Cursor to it.
- **[korotovsky/slack-mcp-server](https://github.com/korotovsky/slack-mcp-server)**: the most starred open-source
  Slack MCP server (1,901 stars, changed on 16 July 2026). It signs in with a user token, a bot token, or a token and
  cookie copied from a browser where you are signed in to Slack.
- **[slackdump](https://github.com/rusq/slackdump)**: an archiver that saves a workspace's messages, files and users to
  your computer (2,877 stars, changed on 24 November 2026). Its MCP server reads that archive and never writes.

Slack lets a program read messages only through an app installed in the workspace, or through the token of a browser
session. Since May 2025 an app that another company publishes outside the Slack Marketplace reads a channel's history at
[one request of 15 messages a
minute](https://docs.slack.dev/changelog/2025/05/29/rate-limit-changes-for-non-marketplace-apps). An app a customer
builds for its own workspace keeps the normal limits. That is why `slk` asks you to make your own app. Slack's [old
reference MCP server](https://github.com/modelcontextprotocol/servers-archived) was archived in May 2025, so it is not
in the table. Slack's own command line, [`slack`](https://docs.slack.dev/tools/slack-cli/), builds and deploys Slack
apps and does not read your messages, so it is not in the table either. That is why this tool is called `slk`.

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation · n/a cannot apply

## Features

| Task | slk | [Slack MCP server](https://docs.slack.dev/ai/slack-mcp-server/) | [korotovsky/slack-mcp-server](https://github.com/korotovsky/slack-mcp-server) | [slackdump](https://github.com/rusq/slackdump) |
|---|:-:|:-:|:-:|:-:|
| **Find and read** | | | | |
| Read channels and DMs | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L34-L40) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/README.md?plain=1#L3-L4) |
| Read a whole thread | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L42-L49) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/README.md?plain=1#L186-L199) |
| Search with Slack's own search | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L62-L78) | [🟡](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/archive/assets/search.md?plain=1#L8-L20) |
| Read and search without the internet | 🟡 | ❌ | [❌](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L296-L310) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/mcp/assets/mcp.md?plain=1#L7-L18) |
| What is unread, in one answer | 🟡 | ➖ | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L189-L199) | ➖ |
| Download files | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L294) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/README.md?plain=1#L3-L4) |
| Keeps to Slack's rate limits by itself | ✅ | n/a | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/pkg/limiter/limits.go#L20-L26) | [✅](https://github.com/rusq/slackdump/blob/567416ddad141b06e4a4e3bbb94dec979006be65/internal/network/limits.go#L41-L80) |
| **Write** | | | | |
| Send a message as you | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L51-L54) | [❌](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/mcp/assets/mcp.md?plain=1#L7) |
| Edit, delete and react | ✅ | [🟡](https://docs.slack.dev/ai/slack-mcp-server/) | [🟡](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L88-L101) | [❌](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/mcp/assets/mcp.md?plain=1#L7) |
| Every method of Slack's Web API | ✅ | ➖ | ➖ | n/a |
| **Agents and safety** | | | | |
| Let an agent read only | ✅ | ➖ | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L290) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/mcp/assets/mcp.md?plain=1#L7) |
| Choose for each action: allow, ask or refuse | ✅ | ➖ | [🟡](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/docs/03-configuration-and-usage.md?plain=1#L286-L294) | n/a |
| See what a write would send, without sending it | ✅ | ➖ | ➖ | n/a |
| The token is kept in the system keyring | ✅ | n/a | [❌](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L277-L302) | [❌](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/internal/cache/auth.go#L181-L186) |
| An agent at a terminal works through commands, without MCP | ✅ | n/a | n/a | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/README.md?plain=1#L56-L70) |
| **Setup** | | | | |
| An MCP server | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L22) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/mcp/assets/mcp.md?plain=1#L7-L18) |
| Works from ChatGPT or Claude in the browser | 🟡 | [✅](https://slack.com/help/articles/48855576908307-Guide-to-MCP-in-Slack) | [🟡](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L282-L283) | ➖ |
| Several workspaces, each named in the command | ✅ | ➖ | ➖ | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/internal/cache/manager.go#L43-L47) |

| | slk | Slack MCP server | korotovsky/slack-mcp-server | slackdump |
|---|---|---|---|---|
| Install | npm, Node 22.16+ or 24+ | none: Slack runs it, you connect an AI app your workspace allows | npx, Docker or a Claude Desktop extension | Homebrew or a binary |
| Sign-in | the User OAuth Token of your own Slack app | OAuth, through an app from the Slack Marketplace or one made inside the workspace | a user or bot token, or a browser token and cookie | a browser sign-in or a token |
| Licence | Apache-2.0 | closed service | MIT | AGPL-3.0 |
| Price | free | not stated on its page | free | free |

Notes on the `slk` column:

- **Sign-in.** The User OAuth Token (`xoxp-`) acts with the rights of the person who installed the app, so `slk` sees
  only the conversations that person is in. `session start` reads it hidden or from stdin, never from an argument, and
  checks it with Slack before it keeps it. A bot token is refused. See [installation](./installation.md).
- **Without the internet.** `messages sync` saves a chat's history in the WireCat local store, with new replies of
  threads up to 14 days old, and `search messages --backend archive` reads only that copy. Only the chats you synced
  are there, so this row is partly.
- **Unread.** `inbox` covers every DM and group DM, the channels you name in `inbox_channels`, and other channels only
  where a message after your last read mentions you or says @here, @channel or @everyone. It asks your chats for 15
  seconds at most, and `missing` says what it did not reach and why. Replies inside threads and user-group mentions are
  not read, and a muted channel still counts, since an app's token cannot read your Slack settings. So this row is
  partly.
- **Slack's search.** `search.messages`, the search Slack gives apps, finds a message by its words, not by @name or a
  user id. To find new mentions, ask `inbox`.
- **Pace.** History and thread reads go at 50 a minute and other calls at 20 a minute, as Slack's [rate limit
  tiers](https://docs.slack.dev/apis/web-api/rate-limits/).
- **The api group.** `slk <profile> api` has one command for each method of the Slack Web API, each with its own flags
  and help. `slk api list` names them all.
- **Allow, ask or refuse.** Each command and each API method has its key, set to `allow`, `ask`, `readonly` or `deny`
  per profile in [the settings](./configuration.md#permissions). `SLACK_READ_ONLY=1` refuses every write.
- **Over MCP.** Nobody is there to answer `ask`, so `ask` lets the agent go ahead. Each write an agent made is kept in
  `runs list`. To stop writes, set `permissions.api` to `readonly`, or one method to `deny`.
- **Dry run.** `--dry-run` shows what a write would send to Slack, and sends nothing.
- **Several workspaces.** Every command starts with a profile, a name you choose for one workspace. No profile is
  assumed, not even the only one. See [usage](./usage.md).
- **ChatGPT or Claude in the browser.** `mcp serve --http` serves the tool behind a tunnel that you set up and keep
  running yourself, so this row is partly.

Notes on the other columns:

- **Slack MCP server.** Slack lets only apps from its Marketplace and apps made inside the workspace use it, and
  workspace admins can approve and manage them. Its page names tools to send and schedule messages, add reactions, and
  make and edit canvases and lists, but none to edit or delete a message. Each tool has its own rate limit.
- **korotovsky/slack-mcp-server.** Sending, reactions and file downloads are off until you turn each on, for all
  channels or a list of them. The tools that create and change user groups [are on by
  default](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/docs/03-configuration-and-usage.md?plain=1#L294).
  There is no setting that asks before a write. Unread works best with the browser token.
- **slackdump.** Its `search` command asks Slack's search from the command line, while its MCP server reads only the
  saved archive. It saves workspaces without an app or admin rights, and its README warns that an Enterprise
  workspace may alert its admins.

## When another tool fits better

- **Slack MCP server**: you want ChatGPT, Claude or Cursor with nothing to run on your computer, your workspace allows
  the AI app you use, or you work with canvases and lists.
- **korotovsky/slack-mcp-server**: you may not install an app in the workspace and are fine with the token of your
  browser session, or you want an unread list across every channel.
- **slackdump**: you want a full archive of a workspace on your computer, to keep or to read offline, and your agent
  only reads it.

If `slk` fits, start with [installation](./installation.md). To use it with an agent, see [usage](./usage.md).
