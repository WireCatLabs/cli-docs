---
title: "Compared with other tools"
---

<a id="login-profiles-and-the-background-service" />

The marks reflect the reviewed released command catalogue and the linked project documentation read on 24 October 2026. Album sending is released. Sources for other tools are pinned [below the tables](#where-the-marks-come-from); a tool may do more than its documentation says. These are documentation/source comparisons, not comparative runtime measurements.

<a id="sending" />

<a id="groups-and-folders" />

<a id="your-own-notes-on-chats-and-people" />

Several open tools connect a personal Telegram account to a terminal or an AI agent. This page puts `tg` next to
five of them, row by row, by the jobs people do: catch up, reply, find, organise, look after a group, and hand the
account to an agent. Use it to pick the tool that fits your job.

Every mark was checked on 24 October 2026. Our marks come from the `main` branch of `tg` and from running it; the
albums row is on `main` and ships in the next release. A mark for another tool comes from its own documentation or
source, linked [below the table](#where-the-marks-come-from). A tool may do more than its documentation says.

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation

The tools:

- **tg** — this tool: a command line and an MCP server for your account, with a searchable local copy of your chats.
- **[tgcli](https://github.com/dapi/tgcli)** — a command line with background sync, a local archive and an MCP
  server (the actively developed fork of [kfastov/tgcli](https://github.com/kfastov/tgcli)).
- **[tlgr](https://github.com/tlgrcli/tlgr)** — a command line and a background service, with an agent skill.
- **[telegram-mcp](https://github.com/chigwell/telegram-mcp)** — a Python MCP server for Claude Desktop, Cursor and other MCP clients.
- **[mcp-telegram](https://github.com/mcp-telegram/mcp-telegram)** — an MCP server started with `npx`.
- **[tdl](https://github.com/iyear/tdl)** — a fast downloader and uploader for files and media.

<a id="features" />

<a id="функции" />

<a id="características" />

## What each tool does

| Task | tg | tgcli | tlgr | telegram-mcp | mcp-telegram | tdl |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Catch up** | | | | | | |
| See unread chats without telling anyone you read them | ✅ | ❌ | ✅ | 🟡 | 🟡 | ❌ |
| See what you owe people, and what they owe you | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Read a voice message as text | ✅ | ➖ | ✅ | ✅ | ✅ | ➖ |
| **Reply and send** | | | | | | |
| Send a message or a reply, now or at a set time | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit, delete, forward and pin messages | ✅ | ❌ | ✅ | ✅ | ✅ | 🟡 |
| Send photos, files and voice messages | ✅ | 🟡 | ✅ | ✅ | ✅ | 🟡 |
| Send several photos as one album | ✅ | ❌ | ✅ | ✅ | ✅ | ➖ |
| Save a draft that shows in your Telegram app | ✅ | ❌ | ✅ | ✅ | ✅ | ➖ |
| **Find** | | | | | | |
| Search messages on Telegram's server | ✅ | 🟡 | 🟡 | ✅ | ✅ | ❌ |
| Search your saved messages with no internet | ✅ | ✅ | ➖ | ❌ | ➖ | ➖ |
| Find a message by what it means, not only its words | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Find a file or photo someone sent, in any chat | ✅ | ➖ | ✅ | ➖ | ➖ | ➖ |
| Search inside the files you received, and by what a picture shows | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Download all the files of a chat, and carry on after a stop | 🟡 | 🟡 | ✅ | 🟡 | 🟡 | ✅ |
| **Organise** | | | | | | |
| Archive, pin, mute or mark a chat unread | ✅ | ➖ | ✅ | 🟡 | ✅ | ➖ |
| Keep chats in folders | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Group overview** | | | | | | |
| Create a group, manage admins, members, topics and join requests | ✅ | 🟡 | ✅ | ✅ | ✅ | 🟡 |
| See who joined, who left and who added them | ✅ | ➖ | ➖ | ➖ | 🟡 | 🟡 |
| See a group's numbers: messages, active members, questions answered | ✅ | 🟡 | 🟡 | ➖ | 🟡 | ➖ |
| **Bot** | | | | | | |
| Run your own bot through the Bot API | ✅ | ❌ | ✅ | 🟡 | ❌ | ❌ |
| Press a bot's buttons | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Agents and safety** | | | | | | |
| Works with an agent that has a terminal, with a skill that teaches it | ✅ | ✅ | ✅ | 🟡 | ➖ | ➖ |
| MCP tools for reading and writing | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Configure an agent for read-only access | ✅ | ➖ | 🟡 | ✅ | ➖ | ➖ |
| Configure a CLI send-confirmation permission | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Limit sends to a list of chats, and to a number an hour | ✅ | ➖ | 🟡 | 🟡 | 🟡 | 🟡 |
| Reuse an operation ID for unscheduled send retries | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Hide permission changes from MCP by default | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| The login is kept in the system keyring | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Require an explicit account for each action | ✅ | ❌ | 🟡 | ➖ | ➖ | ❌ |

What an agent may do without asking, how a wrong send is stopped, and what you can see afterwards.

Notes on these rows:

- **Read but not send.** tg lets a profile be read-only for the terminal and for MCP. telegram-mcp can expose only its
  reading tools. tlgr can allow only the commands you list.
- **Send approval.** Set `messages.send: ask` to request terminal confirmation. Over MCP, the client controls approval and can allow a call without asking again; use deny or read-only permissions to block writes. `reply` and `review` present drafts for review. Explicit account selection is required by tg; tgcli supports profiles with a default, while tlgr can require a selected account through its strict-account setting.
- **Limits.** tg has a list of chats it may send to and 30 sends an hour by default. telegram-mcp limits the chats,
  mcp-telegram limits its request rate, tdl has a delay between requests, tlgr limits the commands.
- **Retry identity.** Reuse the same operation ID for an unscheduled send retry. Inspect the send journal and Telegram when an outcome is unknown; scheduled sends must be checked rather than blindly repeated. tlgr documents a distinct exit code for unknown outcomes.
- **Loosen its own limits.** Over MCP, tg lists commands that change what a later run may do (settings,
  recipient lists, schedules), marks them unavailable and names the permission to set from a terminal.

<a id="install-and-licence" />

<a id="установка-и-лицензия" />

<a id="instalar-y-licenciar" />

## Setup

| | tg | tgcli | tlgr | telegram-mcp | mcp-telegram | tdl |
|---|---|---|---|---|---|---|
| Install | npm, pnpm, Bun | npm | pipx | git and uv, Docker, Claude Desktop extension | npx, binaries | one binary, Homebrew, Scoop, AUR, Nix, Docker |
| Licence and price | Apache-2.0, free | MIT, free | MIT, free | Apache-2.0, free | MIT, free | AGPL-3.0, free |
| MCP | stdio, and HTTP with its own login for browser and phone apps | HTTP | none | stdio | stdio | none |

**Compared with a browser agent.** An agent that drives the Telegram web app clicks through a page meant for people.
`tg` and the other tools here call Telegram's own interface, so the agent gets the same answer a script would, in a
fixed shape, and a command either succeeds or says why not. This page does not claim that either way is faster: there
is no published measurement.

<a id="when-another-tool-fits-better" />

<a id="когда-другой-инструмент-подходит-лучше" />

<a id="cuando-otra-herramienta-encaja-mejor" />

## Where another tool fits better

- **tdl** — you mostly move files: bulk downloads, uploads and forwarding at full speed, from one binary that most
  package managers can install.
- **tlgr** — you want parallel downloads that resume, from a command line, and you do not need a local copy to
  search.
- **telegram-mcp** — you want the widest set of agent actions in Claude Desktop, installed in one step, with a large
  community behind it.
- **mcp-telegram** — you want a large MCP tool set started with one `npx` command, without Python.
- **tgcli** — you want the MCP server inside the sync service, or keep notes on chats.

## Where the marks come from

Pinned to the commit read on 24 October 2026.

- **tgcli** ([`4f7fbc5`](https://github.com/dapi/tgcli/tree/4f7fbc5)): the
  [README](https://github.com/dapi/tgcli/blob/4f7fbc5/README.md), the
  [commands](https://github.com/dapi/tgcli/blob/4f7fbc5/docs/cli.md), the
  [agent skill](https://github.com/dapi/tgcli/blob/4f7fbc5/SKILL.md) (which sends edits and deletes elsewhere and
  drafts through Saved Messages) and the [MCP server](https://github.com/dapi/tgcli/blob/4f7fbc5/mcp-server.js).
- **tlgr** ([`9b441f2`](https://github.com/tlgrcli/tlgr/tree/9b441f2)): the
  [README](https://github.com/tlgrcli/tlgr/blob/9b441f2/README.md) lists `catchup`, `--no-read`, `draft`, albums,
  folders, `chat stats get`, `media search`, `--enable-commands` and the exit codes.
- **telegram-mcp** ([`686d587`](https://github.com/chigwell/telegram-mcp/tree/686d587)): the
  [README](https://github.com/chigwell/telegram-mcp/blob/686d587/README.md) lists drafts, folders, albums,
  `TELEGRAM_EXPOSED_TOOLS=read-only` and `TELEGRAM_ALLOWED_CHAT_IDS`.
- **mcp-telegram** ([`a11e9a9`](https://github.com/mcp-telegram/mcp-telegram/tree/a11e9a9)): the
  [README](https://github.com/mcp-telegram/mcp-telegram/blob/a11e9a9/README.md) lists drafts, folders, albums, the
  admin log and the
  [group statistics](https://github.com/mcp-telegram/mcp-telegram/blob/a11e9a9/src/tools/chats.ts); the
  [rate limiter](https://github.com/mcp-telegram/mcp-telegram/blob/a11e9a9/src/rate-limiter.ts) is its only send limit.
- **tdl** ([`70c561c`](https://github.com/iyear/tdl/tree/70c561c)): the
  [README](https://github.com/iyear/tdl/blob/70c561c/README.md), the
  [download guide](https://github.com/iyear/tdl/blob/70c561c/docs/content/en/guide/download.md) and the
  [forward guide](https://github.com/iyear/tdl/blob/70c561c/docs/content/en/guide/forward.md), which keeps albums
  together but does not say how an upload is grouped.
- **tg**: [searching](./search.md), [file attachments](./attachments.md), [groups you run](./groups.md),
  [permissions](./permissions.md), [security](./security.md) and [the MCP server](./mcp.md).

If `tg` fits, start with [installation](./installation.md); to connect an agent without a terminal, see
[the MCP server](./mcp.md).
