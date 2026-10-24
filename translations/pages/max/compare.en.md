---
title: "Compared with other tools"
---

There are other open tools for MAX. This page puts `max` next to five of them and compares them by task: what you can
do. The table shows which tool fits your work. The marks for `max` were checked against its code.
The marks for the other tools come from the documentation and source code of their projects, on 24 October 2026. A
tool may do more than its documentation says.

The tools:

- **max**: this tool. A command line and an MCP server for your MAX account and your bots.
- **[PyMax](https://github.com/MaxApiTeam/PyMax)**: a Python library for a personal account.
- **[tsmax](https://github.com/sibstark/tsmax)** (`@bruch/max-client`): a TypeScript library for Bun, personal account.
- **[max-mcp](https://github.com/renosaza/max-mcp)**: an MCP server built on PyMax, personal account, 8 tools.
- **[mcp-max-messenger](https://github.com/woyaxnini/mcp-max-messenger)**: an MCP server on the official Bot API,
  21 tools.
- **[Bot API MAX](https://dev.max.ru/docs-api)** and its SDKs: the only official programmatic access. It works as a
  bot, not as your account.

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation

A personal account works through MAX's unofficial protocol. `max bot`, mcp-max-messenger and the official SDKs use the
official Bot API.

## What you can do

The table covers **max**, [PyMax](https://github.com/MaxApiTeam/PyMax), [tsmax](https://github.com/sibstark/tsmax),
[max-mcp](https://github.com/renosaza/max-mcp),
[mcp-max-messenger](https://github.com/woyaxnini/mcp-max-messenger) and [Bot API](https://dev.max.ru/docs-api).

| Task | max | PyMax | tsmax | max-mcp | mcp-max-messenger | Bot API |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Catch up** | | | | | | |
| See unread messages in all chats with one request, without marking them read | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| See whom you have not answered and which promises are open | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Reply and send** | | | | | | |
| Reply to, edit, delete or forward a message | ✅ | ✅ | ✅ | 🟡 | 🟡 | ✅ |
| Send a photo or a file | ✅ | ✅ | ✅ | ✅ | 🟡 | ✅ |
| Send several photos in one message | ✅ | ✅ | ✅ | ❌ | ➖ | ➖ |
| **Find** | | | | | | |
| Find a message in one chat or in all of them, on the MAX server | ✅ | ➖ | ❌ | 🟡 | ❌ | ❌ |
| Find a message by meaning, not by words | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Search a local copy with no internet | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Find a file someone sent by name, type or the text inside it (PDF, document, scan) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Files and voice** | | | | | | |
| Turn a voice message into text on your computer | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Export a chat to JSONL or Markdown, make an encrypted copy | ✅ | ❌ | ❌ | 🟡 | ❌ | ❌ |
| **Groups and channels** | | | | | | |
| Create a group, add people, make admins | ✅ | ✅ | 🟡 | ❌ | 🟡 | 🟡 |
| See join requests, accept or decline them | ✅ | ✅ | ✅ | ❌ | ➖ | ➖ |
| A group or channel digest for a period: messages, active people, newcomers, people who left | ✅ | ❌ | ❌ | 🟡 | ❌ | ➖ |
| Comments under channel posts | 🟡 | ➖ | ❌ | ❌ | ❌ | ✅ |
| **Bot and automation** | | | | | | |
| Write as your bot from the same tool | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| A scheduled morning digest and auto-replies | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Agents and safety** | | | | | | |
| An agent reads and writes in MAX through MCP | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| An agent with a terminal works without MCP: a skill explains the commands | ✅ | ❌ | ❌ | 🟡 | ❌ | ❌ |
| Restrict an agent to reading | ✅ | ➖ | ➖ | ❌ | ❌ | ➖ |
| Configurable approval before sending | ✅ | ➖ | ➖ | ❌ | ❌ | ➖ |
| Allow sending only to a list of chats | ✅ | ➖ | ➖ | ❌ | ❌ | ➖ |
| Limit the number of sends per hour | ✅ | ➖ | ➖ | ❌ | ❌ | ➖ |
| Retry a supported send with the same operation ID | ✅ | ➖ | ➖ | ❌ | ❌ | ➖ |
| The token is kept in the system keyring, not in a file (without a keyring, `max` writes a file with mode 0600) | ✅ | ❌ | ❌ | 🟡 | 🟡 | ➖ |

**Reply and send.** In `max`, repeat `--photo` for an album. Several `--file` options go out as separate messages, and
a video or a file cannot be mixed with other attachments. max-mcp cannot edit or delete messages. mcp-max-messenger
cannot forward, and sends files by link.

**Find.** max-mcp search is simple: it matches a substring, and every call reads the history of one chat. PyMax names
server-side search in its list of operation codes, but its documentation does not describe it. `max` can also search
pictures by what they show, with a model on your computer. You turn that on separately.

**Files and voice.** max-mcp exports channels only, up to 1000 posts per call.

**Groups and channels.** mcp-max-messenger and Bot API see only the groups where the bot is a member. tsmax cannot make
admins. The digest in `max` is computed from the local copy, and `max` asks MAX who joined and who left. max-mcp has
reactions and channel post statistics, but no group digest. `max` handles comments under posts only as a bot; a
personal account has no such comments.

**Agents and safety.** PyMax, tsmax and Bot API get ➖ where the program's author would have to write the protection:
they are libraries and have no ready settings.
The `max` MCP server gives an agent three tools: find a command, read and write. They expose released commands as profile permissions allow, including writes. Profile permissions apply to MCP too. The bot has a separate server. Login and logout and commands that
run without stopping (`watch`, `serve`), and commands with which an agent could lift its own limits (the allowed chat
list, permissions, auto-replies, schedules) are not offered in MCP; `permissions.mcp.authority` opens some of them, and
it is `deny` by default. Raw bot operations separately need `permissions.bot.api: allow` or `ask`. See the
[MCP guide](./mcp.md) for more. Profile permissions and the agent application's approval settings determine when sending is allowed; MCP itself has no confirmation form. Configure these before connecting an agent. The default limit is 30 sends per hour per profile, and the error says when you can send again. max-mcp
has one limit: a list of allowed folders for files. max-mcp keeps its token in a file with mode 0600, and
mcp-max-messenger reads it from the `MAX_TOKEN` environment variable. PyMax and tsmax keep the token in the
`session.db` session file.

## Setup and licence

| | max | PyMax | tsmax | max-mcp | mcp-max-messenger | Bot API |
|---|---|---|---|---|---|---|
| Install | npm, pnpm, Bun | Python library | library, Bun only | git, `uv` and a login script | `npx` | SDK |
| MCP | stdio and HTTP, for agents in a browser | no | no | stdio | stdio and HTTP | no |
| Licence | Apache-2.0 | MIT | MIT | MIT | MIT with Commons Clause | free, only for verified organisations, sole traders and self-employed people |

`max` needs Node 22.16+ or 24+, or Bun 1.3+. There is no installer without Node yet. A browser agent that drives
`web.max.ru` works through the interface and a login in the browser. `max` talks to MAX directly from the command
line, and needs a browser only for login by QR code or SMS.

## When another tool fits better

- **The MAX app** ([web.max.ru](https://web.max.ru), desktop, phone): you need calls, video circles, typing
  indicators and no setup. The app is official, and MAX's rules do not object to it.
- **PyMax or tsmax**: you are writing your own program and need a file together with photos and videos in one message
  (tsmax) or video circles (PyMax).
- **Bot API and mcp-max-messenger**: you are building an official bot for an organisation, or you need an MCP server
  for a bot only, started with one `npx` command. This is the only official path, and it does not break MAX's rules.
  Comments under channel posts are available there too.

## Where the marks come from

The marks for the other tools come from these files, with versions pinned:
[PyMax](https://github.com/MaxApiTeam/PyMax/blob/53103f0/README.md),
[its chats](https://github.com/MaxApiTeam/PyMax/blob/53103f0/src/pymax/api/chats/service.py) and
[messages](https://github.com/MaxApiTeam/PyMax/blob/53103f0/src/pymax/api/messages/service.py),
[tsmax](https://github.com/sibstark/tsmax/blob/fa3652f/README.md) and
[its API](https://github.com/sibstark/tsmax/tree/fa3652f/src/api),
[max-mcp](https://github.com/renosaza/max-mcp/blob/26eaf70/README.md) and
[its tools](https://github.com/renosaza/max-mcp/blob/26eaf70/docs/TOOLS.md),
[mcp-max-messenger](https://github.com/woyaxnini/mcp-max-messenger/blob/4a3233a/README.md) and
[its licence](https://github.com/woyaxnini/mcp-max-messenger/blob/4a3233a/LICENSE),
[Bot API](https://dev.max.ru/docs-api). For `max`, every mark was checked against its code: all commands are listed in
[commands.md](./commands.md).

If `max` suits you, start with [installation](./installation.md). To connect an agent without a terminal, see the
[MCP server](./mcp.md).
