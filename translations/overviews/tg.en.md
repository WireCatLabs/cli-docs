---
title: "Telegram: start here"
description: "Connect your Telegram account to an agent, or use it from a terminal."
---

`tg` lets your AI agent read Telegram, find messages and help you reply. It works with **your
personal account** and its chats. You can also use it yourself with terminal commands.
It runs on Windows, macOS and Linux.

You are in the **Telegram** documentation. Use the messenger switch at the top to open MAX.

**On this page**

- [Choose how to start](#choose-how-to-start)
- [Try it after connecting](#try-it-after-connecting)
- [Find the guide for your task](#find-the-guide-for-your-task)

## Choose how to start

### Connect through your agent

If you use Codex, Claude Code, Cursor, Gemini CLI or Hermes, open the
[agent installation guide](/en/docs/installation#tg). Copy the short request: your agent will
install the tool, help you log in and check the connection. You scan the QR code and confirm the login.

Then follow [the guide for your agent](/en/docs/agents). Apps that use an MCP server have a
[separate MCP guide](/en/docs/mcp).

### Start in a terminal

Open [the installation guide](/en/docs/installation#tg) and choose the terminal instructions.
After installing, run guided setup: it helps with app registration and login, checks your account and five chats, and installs agent skills. It reuses an existing session; downloading history remains a separate choice.

```sh
tg setup
```

```sh
tg chats list --limit 5
```

First, the command asks for your phone number and a code sent in Telegram to obtain `api_id` and `api_hash` from [my.telegram.org](https://my.telegram.org/apps). Then it displays the QR code for account login. Open Telegram on your phone → Settings → Devices → Link Desktop Device and scan it. Wait for **Logged in as …** before listing chats. [Complete login steps](/en/docs/tg/sessions).

> **What is a Telegram application and why is it needed?**
>
> This is a registration record for the program connecting to Telegram, here the `tg` CLI. You fill in a form, without writing or downloading another application. Telegram issues `api_id` and `api_hash` to identify the program; QR or code confirmation then grants access to your account. The command can register or retrieve these credentials for you. [Explanation and browser fallback](/en/docs/tg/sessions#the-app-from-mytelegramorg).

## Try it after connecting

- **Catch up on unread messages.** Ask which chats are waiting for your reply.
- **Recall agreements.** Ask what you promised this week and what you are waiting for from others.
- **Find a message.** Ask for a conversation, date, link or file.
- **Get help replying.** Give your agent context and ask it to draft or send a message.

Reading **does not mark messages as read**. Sending, deleting and other changes require separate
commands. You can restrict the agent's access: see [access and safety](/en/docs/tg/security).

Word search asks both the local archive and the messenger by default (`--backend both`); use `--backend archive` for local-only results. Strict Lucene is the default query language; `--language legacy` restores the previous matching and typo correction. Prepare saved history before archive-only search, counting or rankings, and check coverage before treating an empty result as proof that a message is absent. See [search](/en/docs/tg/search).

## Find the guide for your task

| Task | Guide |
|---|---|
| Read, search and send messages | [Everyday commands](/en/docs/tg/usage) |
| Log in, log out or add another account | [Login and profiles](/en/docs/tg/sessions) |
| Search local history and export conversations | [Message archive](/en/docs/tg/archive) |
| Write a precise search query, filters or dates | [Message search](/en/docs/tg/search) |
| Follow questions and membership in a group | [Your groups](/en/docs/tg/groups) |
| Find a ready request for your agent | [Usage recipes](/en/docs/tg/recipes) |
| Check what Telegram bots currently support | [Bots: available capabilities](/en/docs/tg/bot) |
| Fix an error | [Troubleshooting](/en/docs/tg/troubleshooting) |
| Look up an exact command or option | [Command reference](/en/docs/tg/commands) |
| Manage contacts, aliases and private notes | [People](/en/docs/tg/people) |
| Compare activity and inspect ranking evidence | [Rankings](/en/docs/tg/rankings) |
| Send, download and read files | [File commands](/en/docs/tg/usage) |
| Transcribe voice messages locally | [Voice commands](/en/docs/tg/usage) |
| Configure optional model APIs | [Model settings](/en/docs/tg/configuration-reference) |
| Restrict reads, writes and confirmations | [Permissions](/en/docs/tg/permissions) |
| Choose a personal or bot profile | [Profiles and bots](/en/docs/tg/profiles) |
| Look up setting types and precedence | [Configuration reference](/en/docs/tg/configuration-reference) |

The left sidebar keeps Getting started and expandable Telegram/MAX guides available. The right sidebar lists sections of the current
page. Use the command reference when you need an exact option; installation and everyday tasks are enough to get started.
