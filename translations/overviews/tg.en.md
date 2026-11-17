---
title: "Telegram: start here"
description: "Your agent reads your Telegram, tells you who is waiting for an answer and finds any message offline. Nothing is marked read or sent unless you ask."
---

You see who is waiting for you without scrolling through chats. `tg` connects your own Telegram account to the AI agent
you already use, such as Claude Code, Codex or Cursor. It keeps a copy of your chats on your computer, so your agent
can search years of history, even offline.

Your agent tells you which chats need an answer, what you promised this week and where Alice sent the lease PDF. It
answers with the messages it found, and it drafts a reply you can send or change. Setup takes about five minutes.

**On this page:**

1. [What you get](#what-you-get)
2. [Things a newcomer would not guess](#things-a-newcomer-would-not-guess)
3. [How it looks](#how-it-looks)
4. [Why tg](#why-tg)
5. [What it can do](#what-it-can-do)
6. [How it works](#how-it-works)
7. [Start in five minutes](#start-in-five-minutes)
8. [Limits](#limits)
9. [Find a guide for your task](#find-a-guide-for-your-task)

## What you get

- **Never miss a reply you owe.** One request lists who is waiting for your answer, in every chat. Nobody sees that
  you looked.
- **Any message in seconds.** "When did we agree on the venue with Alice?" gives you the date and the message itself,
  with no internet. Search finds a word in its other forms, and a whole discussion by what it was about.
- **Promises kept.** "What did I promise this week, and what am I waiting for?" gets one answer across all your chats.
- **Voice messages as text.** Voice notes become text on your computer, with no Telegram Premium. Text in files and
  scans is searchable too.
- **Calm groups.** Links, floods and unwanted people are handled by your rules. You see the questions nobody
  answered, who joined and who left.
- **Replies while you are away.** Auto-replies by your own rules, and you can keep them to the people you choose.
- **A bot in the same tool.** Run any bot through the official Bot API, all 185 methods, next to ready commands for
  sending and replies.

## Things a newcomer would not guess

- **`personal` is a name you choose.** It names one Telegram account, and it is the first word of every command. Add
  `work` later for a second account. No command picks an account for you.
- **Reading marks nothing read.** Only `tg personal chats mark-read` tells the other side you looked.
- **Nothing is sent unless a command asks.** Sending, editing and deleting are separate commands, and you can make a
  profile read-only.
- **The copy fills as you read.** A chat you have not opened or downloaded yet is not in the copy, so an empty offline
  search does not prove a message was never sent. `tg` knows which stretches of each chat it holds in full and says so.

## How it looks

```text
You:    What did I promise anyone in the last three days?
Agent:  (runs tg personal review 'date>3d': 12 chats)
        I owe
        · Alice Example: the invoice by Friday. "Alice Example", 24.09
        Waiting on others
        · Bob Sample: the mock-up by 25.09. Not in "Design" yet
You:    Remind Bob about the mock-up.
Agent:  Draft: "Hi Bob, how is the mock-up going?" Send it?
You:    Yes.
```

## Why tg

- **No WireCat server.** `tg` talks only to Telegram, from your computer. There is no account with us.
- **Signs in like Telegram's desktop app.** It uses Telegram's official API through your own app registration, and
  becomes one more device on your account.
- **Search the other tools do not document.** Of the five open Telegram tools on the [comparison](./compare.md), none
  documents finding a message by its meaning, searching inside the files you received, or showing what you owe people
  and what they owe you. `tg` does all of it.
- **Limits you set for an agent.** Read only, writes only to the chats you list, and at most 30 sends an hour by
  default. A send can ask you first at the terminal.
- **The login stays in your system keyring.** No other tool on the comparison keeps it there.
- **Free and open source.** Apache 2.0, on macOS, Linux and Windows.

Another tool fits better when you mostly move files in bulk ([tdl](https://github.com/iyear/tdl)), or want the widest
set of ready actions in Claude Desktop with no local copy ([telegram-mcp](https://github.com/chigwell/telegram-mcp)).

## What it can do

- **Catch up:** other people's unread messages in every chat, a review of what changed since last time, the questions
  nobody answered. [Everyday commands](./usage.md)
- **Find:** search by person, chat, date, file, link and tag, by meaning, and on Telegram's server at the same time.
  [Search](./search.md)
- **Reply:** send, reply, forward, edit, pin, react, polls, files and voice. Schedule a message for later.
  [Everyday commands](./usage.md)
- **Run a group:** members, join requests, topics, moderation rules, a summary of the week. [Your groups](./groups.md)
- **Keep the history:** download a chat's full history once, export it to Markdown or JSONL.
  [Message archive](./archive.md)
- **One person across messengers:** link a person's Telegram and MAX accounts, and search your messages, mail and
  notes on this computer at once. [People](./people.md)
- **Agents everywhere:** a skill for terminal agents, an MCP server with ready prompts for Claude Desktop and Cursor,
  and a secure link for ChatGPT and Claude in the browser. [Agents](/en/docs/agents)

## How it works

- **A copy on your computer.** Messages `tg` has read or downloaded sit in a local archive. Search, export and offline
  reading answer from it, and a search can ask Telegram's server too. [Message archive](./archive.md)
- **Login by QR code.** You register a Telegram app once, then scan a code in Telegram. `tg` becomes one more device
  on your account.
- **Made for scripts and agents.** One operation per call and one JSON answer with `--json`.
  [MCP](./mcp.md)
- **What is stored and what goes over the network.** [Security](./security.md)

## Start in five minutes

Paste this into your agent:

```text prompt
Use tg CLI. Install it with npm install -g @wirecat/tg-cli, help me run tg personal setup, then show me who is waiting for my answer.
```

Or in a terminal:

```sh
npm install -g @wirecat/tg-cli
tg personal setup     # register your Telegram app, log in by QR code, install the agent skill
tg personal inbox     # other people's unread messages, in every chat
```

You need Node.js 22.19 or later on 22.x, or 24 and later, or Bun. `setup` opens
[my.telegram.org](https://my.telegram.org/apps) for you: Telegram asks every program that connects to an account to
register, and `tg` fills the form. [Installation](./installation.md)

## Limits

- Search by meaning needs a model you download once (219 MB, shared with `max`). Search by words works without it.
- Call history, privacy settings and stickers are not in `tg` yet. [Roadmap](./roadmap.md)

## Find a guide for your task

| Task | Guide |
|---|---|
| Install, log in, add another account | [Installation](./installation.md), [Login and profiles](./sessions.md) |
| Read, search and send messages | [Everyday commands](./usage.md) |
| Write a precise search | [Message search](./search.md) |
| Run a group | [Your groups](./groups.md) |
| A ready request for your agent | [Recipes](./recipes.md) |
| Decide what an agent may do | [Permissions](./permissions.md) |
| A bot | [Bots](./bot.md) |
| An exact command or option | [Command reference](./commands.md) |
| Something does not work | [Troubleshooting](./troubleshooting.md) |
| How tg differs from other Telegram tools | [Comparison](./compare.md) |
