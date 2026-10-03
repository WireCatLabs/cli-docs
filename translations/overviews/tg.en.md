---
title: "Telegram: start here"
description: "Connect your Telegram account to an agent, or use it from a terminal."
---

`tg` lets your AI agent read Telegram, find messages and help you reply. It works with **your
personal account** and its chats. You can also use it yourself with terminal commands.
It runs on Windows, macOS and Linux.

You are in the **Telegram** documentation. Use the messenger switch at the top to open MAX.

## Choose how to start

### Connect through your agent

If you use Codex, Claude Code, Cursor, Gemini CLI or Hermes, open the
[agent installation guide](/en/docs/installation#tg). Copy the short request: your agent will
install the tool, help you log in and check the connection. You scan the QR code and confirm the login.

Then follow [the guide for your agent](/en/docs/agents). Apps that use an MCP server have a
[separate MCP guide](/en/docs/mcp).

### Start in a terminal

Open [the installation guide](/en/docs/installation#tg) and choose the terminal instructions.
After installing, log in and list a few chats:

```sh
tg session start --app auto
```

```sh
tg chats list --limit 5
```

The first login needs a Telegram app from my.telegram.org. The command helps register it, then
shows a QR code. See [login and profiles](/en/docs/tg/sessions) for details and phone login.

## Try it after connecting

- **Catch up on unread messages.** Ask which chats are waiting for your reply.
- **Recall agreements.** Ask what you promised this week and what you are waiting for from others.
- **Find a message.** Ask for a conversation, date, link or file.
- **Get help replying.** Give your agent context and ask it to draft or send a message.

Reading **does not mark messages as read**. Sending, deleting and other changes require separate
commands. You can restrict the agent's access: see [access and safety](/en/docs/tg/security).

## Find the guide for your task

| Task | Guide |
|---|---|
| Read, search and send messages | [Everyday commands](/en/docs/tg/usage) |
| Log in, log out or add another account | [Login and profiles](/en/docs/tg/sessions) |
| Search local history and export conversations | [Message archive](/en/docs/tg/archive) |
| Follow questions and membership in a group | [Your groups](/en/docs/tg/groups) |
| Find a ready request for your agent | [Usage recipes](/en/docs/tg/recipes) |
| Check what Telegram bots currently support | [Bots: available capabilities](/en/docs/tg/bot) |
| Fix an error | [Troubleshooting](/en/docs/tg/troubleshooting) |
| Look up an exact command or option | [Command reference](/en/docs/tg/commands) |

The left sidebar lists the pages in this section. The right sidebar lists sections of the current
page. Use the command reference when you need an exact option; installation and everyday tasks are enough to get started.
