---
title: "MAX: start here"
description: "Connect your personal MAX account or a bot to your agent."
---

`max` lets your AI agent read MAX, find messages and help you reply. You can also use it directly
from a terminal. It runs on Windows, macOS and Linux.

You are in the **MAX** documentation. Use the messenger switch at the top to open Telegram.

## Choose what to connect

- **Personal account:** your chats, history and contacts, as on another device. Start with
  [installation and login](/en/docs/installation#max).
- **Bot:** messages and actions in the bot's name, using its token. Open
  [the bot guide](/en/docs/max/bot).

These are separate connections. Bots use the official MAX Bot API; personal accounts use an
internal API that may change without notice. See [security](/en/docs/max/security) for limitations
and how credentials are stored.

## Start with your personal account

### Connect through your agent

Open [the agent installation guide](/en/docs/installation#max) and copy the short request.
Your agent will install the tool, help you log in and check the connection. You scan the QR code.

Then follow [the guide for your agent](/en/docs/agents): Codex, Claude Code, Cursor, Gemini CLI
or Hermes. Apps that use MCP have a [separate MCP guide](/en/docs/mcp).

### Start in a terminal

Open [the installation guide](/en/docs/installation#max) and choose the terminal instructions.
After installing, log in by QR code and list a few chats:

```sh
max session start qr
```

```sh
max chats list --limit 5
```

See [login and profiles](/en/docs/max/sessions) for other login methods and additional accounts.

## Try it after connecting

Ask your agent to catch up on unread messages, find a message, recall agreements or prepare a
reply. Reading **does not mark messages as read**. Sending, deleting and other changes require
separate commands; you can restrict the agent's access.

## Find the guide for your task

| Task | Guide |
|---|---|
| Read, search and send messages in your own name | [Everyday commands](/en/docs/max/usage) |
| Log in, log out or add another account | [Login and profiles](/en/docs/max/sessions) |
| Connect a bot, send messages and add buttons | [Bots](/en/docs/max/bot) |
| Follow unanswered questions and moderate a group | [Your groups](/en/docs/max/groups) |
| Search local history and export conversations | [Message archive](/en/docs/max/archive) |
| Find a ready request for your agent | [Usage recipes](/en/docs/max/recipes) |
| Fix an error | [Troubleshooting](/en/docs/max/troubleshooting) |
| Look up an exact command or option | [Command reference](/en/docs/max/commands) |

The left sidebar lists MAX pages. The right sidebar lists sections of the current page. Start
with installation; use the detailed reference when you have a specific task.
