---
title: "MAX: start here"
description: "Connect your personal MAX account or a bot to your agent."
---

`max` is a command-line tool that lets your AI agent read MAX, find messages and help you reply. You can also use it directly
from a terminal. It runs on Windows, macOS and Linux.

You are in the **MAX** documentation. Use the messenger switch at the top to open Telegram.

**On this page**

- [Choose what to connect](#choose-what-to-connect)
- [Start with your personal account](#start-with-your-personal-account)
- [Try it after connecting](#try-it-after-connecting)
- [Find the guide for your task](#find-the-guide-for-your-task)

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
After installing, run guided setup for QR login and agent skills:

```sh
max setup
```

```sh
max chats list --limit 5
```

Setup checks your account and up to five chats. Running it again reuses your session; it does not download full history or start the background service.

See [login and profiles](/en/docs/max/sessions) for other login methods and additional accounts.

## Try it after connecting

Ask your agent to catch up on unread messages, find a message, recall agreements or prepare a
reply. Reading **does not mark messages as read**. Sending, deleting and other changes require
separate commands; you can restrict the agent's access.

Word search asks both the local archive and the messenger by default (`--backend both`); use `--backend archive` for local-only results. Strict Lucene is the default query language; `--language legacy` restores the previous matching and typo correction. Prepare saved history before archive-only search, counting or rankings, and check coverage before treating an empty result as proof that a message is absent. MAX server search needs one chat. Counts, rankings and queries unsupported by the server use saved history. [Search guide](/en/docs/max/search).

## Find the guide for your task

| Task | Guide |
|---|---|
| Read, search and send messages in your own name | [Everyday commands](/en/docs/max/usage) |
| Log in, log out or add another account | [Login and profiles](/en/docs/max/sessions) |
| Connect a bot, send messages and add buttons | [Bots](/en/docs/max/bot) |
| Follow unanswered questions and moderate a group | [Your groups](/en/docs/max/groups) |
| Search syntax, dates and filters | [Message search](/en/docs/max/search) |
| Search local history and export conversations | [Message archive](/en/docs/max/archive) |
| Find a ready request for your agent | [Usage recipes](/en/docs/max/recipes) |
| Fix an error | [Troubleshooting](/en/docs/max/troubleshooting) |
| Look up an exact command or option | [Command reference](/en/docs/max/commands) |
| Manage contacts, aliases and private notes | [People](/en/docs/max/people) |
| Compare activity and inspect ranking evidence | [Rankings](/en/docs/max/rankings) |
| Send, download and read files | [Attachments](/en/docs/max/attachments) |
| Transcribe voice messages locally | [Voice transcription](/en/docs/max/audio-recognition) |
| Configure optional model APIs | [External models](/en/docs/max/external-models) |
| Restrict reads, writes and confirmations | [Permissions](/en/docs/max/permissions) |
| Choose a personal or bot profile | [Profiles and bots](/en/docs/max/profiles) |
| Look up setting types and precedence | [Configuration reference](/en/docs/max/configuration-reference) |

Message search uses strict Lucene by default; `--language legacy` keeps the previous filters and typo correction.

The left sidebar lists shared guides and both messengers. The right sidebar lists sections of the current page. Start
with installation; use the detailed reference when you have a specific task.
