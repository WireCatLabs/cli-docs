---
title: "MAX: start here"
description: "Your agent reads your MAX chats, finds any message offline and turns voice notes into text. Bots work through the official Bot API."
---

You catch up on MAX in a minute instead of scrolling every chat. `max` connects your MAX account, or your bot, to the AI
agent you already use, such as Claude Code, Codex or Cursor. It keeps a copy of your chats on your computer, so the
agent searches the whole history, even offline.

Your agent tells you who is waiting for your answer, what you promised this week and what Alice said in a voice
message. It answers with the messages it found and drafts a reply for you to send. Setup takes about five minutes and
a QR code.

**On this page:**

1. [What you get](#what-you-get)
2. [Things a newcomer would not guess](#things-a-newcomer-would-not-guess)
3. [How it looks](#how-it-looks)
4. [Why max](#why-max)
5. [What it can do](#what-it-can-do)
6. [How it works](#how-it-works)
7. [Start in five minutes](#start-in-five-minutes)
8. [Limits](#limits)
9. [Find a guide for your task](#find-a-guide-for-your-task)

## What you get

- **Never miss a reply you owe.** One request lists who is waiting for your answer in every chat. Nothing is marked
  read.
- **Any message in seconds.** "When did we agree to meet Alice?" gets the date and the message, with no internet. You
  can also find a discussion by what it was about, without the exact words.
- **Voice messages as text.** Voice notes become text on your computer, and the text is searchable.
- **Promises kept.** "What did I promise this week, and what am I waiting for?" gets one answer across all chats.
- **Calm groups.** A check by your rules catches links, invitations to other chats and floods. By default it only
  marks them, and it deletes when you allow it. You see who joined and which questions nobody answered.
- **A bot in the same tool.** Connect a bot by its token and call any operation of MAX's official Bot API, next to
  ready commands for sending and moderation.

## Things a newcomer would not guess

- **Two kinds of connection.** Your personal account works like one more device, as on web.max.ru. A bot works by its
  token through the official Bot API. They are separate profiles.
- **`personal` is a name you choose** for one account, and the first word of every command. No command picks an
  account for you.
- **Reading marks nothing read**, and nothing is sent unless a command asks.
- **The copy fills as you read.** A chat you have not opened or downloaded is not in it, so an empty offline search
  does not prove a message was never sent.

## How it looks

```text
You:    What did I promise anyone in the last three days?
Agent:  (runs max personal review 'date>3d': 12 chats, 3 voice messages transcribed)
        I owe
        · Alice Example: send the invoice by Friday. Direct chat, 24.09
        Waiting on others
        · Bob Sample: the mock-up by 25.09. Not in "Design" yet
You:    Remind Bob about the mock-up.
Agent:  Draft: "Hi Bob, how is the mock-up going?" Send it?
You:    Yes.
```

## Why max

- **Things no other MAX tool on the [comparison](./compare.md) documents.** Unread messages in all chats with one
  request, the replies you owe, search by meaning and with no internet, voice to text on your computer, a scheduled
  morning digest.
- **Limits you set for an agent.** Read only, sends only to the chats you list, and at most 30 sends an hour by default.
  Sending can ask you first. None of the other tools on the comparison documents these limits.
- **No WireCat server.** `max` talks only to MAX, from your computer. Your login is kept in the system keyring.
- **Polite to MAX.** One request pace per profile, shared by every command and agent. When MAX says "too many
  requests", `max` stops instead of retrying.
- **Free and open source.** Apache 2.0, on macOS, Linux and Windows.

Another tool fits better when you need calls and video circles (the MAX app), or an official bot for an organisation
with nothing to install ([mcp-max-messenger](https://github.com/woyaxnini/mcp-max-messenger) on the Bot API).

## What it can do

- **Catch up:** unread messages across chats, a review of what is new, the questions nobody answered.
  [Everyday commands](./usage.md)
- **Find:** by person, chat, date, file, link and tag, by meaning, offline. [Search](./search.md)
- **Reply:** send, reply, forward, edit, pin, react, polls, files, scheduled messages. [Everyday commands](./usage.md)
- **Run a group:** a check by your rules, who joined, activity, a summary of the week. [Your groups](./groups.md)
- **Voice and files:** voice to text, text from saved files. [Voice messages](./audio-recognition.md),
  [Attachments](./attachments.md)
- **Bots:** messages, buttons and every Bot API operation. [Bots](./bot.md)
- **With your other sources:** link a person's MAX and Telegram accounts, and search your messages, mail and notes on
  this computer at once. [People](./people.md)

## How it works

- **A copy on your computer.** The messages `max` has seen sit in a local archive. Search, export and offline reading
  answer from it. [Message archive](./archive.md)
- **Login by QR code.** You scan a code in the MAX app, and `max` becomes one more device on your account. A bot signs
  in with its token.
- **Made for scripts and agents.** One operation per call, one JSON answer with `--json`, a skill for terminal agents
  and an MCP server for apps such as Claude Desktop. [MCP](./mcp.md)
- **What is stored and what goes over the network.** [Security](./security.md)

## Start in five minutes

Paste this into your agent:

```text prompt
Use max CLI. Install it with npm install -g @wirecat/max-cli, help me run max personal setup, then show me who is waiting for my answer.
```

Or in a terminal:

```sh
npm install -g @wirecat/max-cli
max personal setup     # QR login and the agent skill
max personal inbox     # unread in every chat, nothing marked read
```

You scan the QR code in the MAX app. You need Node.js 22.16 or later on 22.x, or 24 and later, or Bun.
[Installation](./installation.md)

## Limits

- For a personal account `max` uses MAX's internal API, the one the web version uses. MAX can change it without
  notice. MAX's user agreement does not allow automated programs without the company's consent, and an account can be
  restricted. [Security](./security.md) says how to lower that risk. Bots use the official Bot API, which this does
  not apply to.
- Calls and video circles stay in the MAX app.

## Find a guide for your task

| Task | Guide |
|---|---|
| Install, log in, add an account | [Installation](./installation.md), [Login and profiles](./sessions.md) |
| Read, search and send | [Everyday commands](./usage.md) |
| Connect a bot | [Bots](./bot.md) |
| Run a group | [Your groups](./groups.md) |
| A ready request for your agent | [Recipes](./recipes.md) |
| Decide what an agent may do | [Permissions](./permissions.md) |
| Connect an app over MCP | [MCP](./mcp.md) |
| An exact command | [Command reference](./commands.md) |
| Something does not work | [Troubleshooting](./troubleshooting.md) |
| How max differs from other MAX tools | [Comparison](./compare.md) |
