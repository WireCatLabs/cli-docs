---
title: "WhatsApp: start here"
description: "Your agent reads your WhatsApp chats, tells you who waits for an answer and searches everything on your computer. It sends only when you ask."
---

You know who is waiting for you on WhatsApp without opening every chat. `wa` links your own WhatsApp account to the AI
agent you already use, such as Claude Code, Codex or Cursor, the way WhatsApp Web links a computer. Everything it
receives is kept on your computer, so your agent searches it there.

Your agent tells you what came in since this morning, which questions in a group nobody answered and when you agreed on
the venue with Alice. It answers with the messages it found, and it sends a reply only when you say yes. Setup takes
about five minutes and a QR code.

**On this page:**

1. [What you get](#what-you-get)
2. [Things a newcomer would not guess](#things-a-newcomer-would-not-guess)
3. [How it looks](#how-it-looks)
4. [Why wa](#why-wa)
5. [What it can do](#what-it-can-do)
6. [How it works](#how-it-works)
7. [Start in five minutes](#start-in-five-minutes)
8. [Limits](#limits)
9. [Find a guide for your task](#find-a-guide-for-your-task)

## What you get

- **Catch up in one answer.** Other people's unread messages and the chats where someone waits for you. Nothing is
  marked read.
- **Find anything you were sent.** "When did we agree on the venue with Alice?" gives the date and the message, from
  the copy on your computer.
- **Promises kept.** A review of the chats that changed shows who owes what, your own messages included.
- **Groups under control.** Who is active, who joined and who left, and the questions nobody answered.
- **Voice notes as text.** WhatsApp has no speech recognition of its own. `wa` runs a model on your computer, and the
  recording does not leave it.
- **A business number too.** When you have one, `wa` also speaks for it through Meta's official Cloud API.

## Things a newcomer would not guess

- **History starts at linking.** `wa` keeps what your phone sends right after linking and everything that arrives
  later. Older messages of a chat can be asked of your phone, 50 at a time.
- **`personal` is a name you choose** for one account, and the first word of every command. No command picks an
  account for you, not even the only one.
- **Keep it running to keep receiving.** On macOS and Linux, `wa personal server install` and then
  `wa personal server start` keep the link open, so new messages land in the copy while you work.
- **Nothing is sent unless a command asks**, and you can make a profile read-only.

## How it looks

```text
You:    Who is waiting for my answer since yesterday?
Agent:  (runs wa personal review 'date>1d' --unanswered: 3 chats)
        · Alice Example asked about Saturday's table, 18:40 yesterday
        · "Book club": Bob Sample asked who brings the next book
You:    Tell Alice: yes, 8 pm.
Agent:  Draft to Alice Example: "Yes, 8 pm." Send it?
You:    Yes.
```

## Why wa

- **Your own account, not a bot.** `wa` sees your chats, groups and contacts and speaks as you.
- **Searches stay on your computer.** Every search answers from the local copy and never connects to WhatsApp.
- **Safer sending.** At most 30 messages an hour by default, sends only to the chats you allow, and every send is held
  when WhatsApp tells the account to slow down. No other tool on the [comparison](./compare.md) documents that hold.
- **Made for agents.** One operation per call, the same JSON every time, a skill for terminal agents and an MCP server
  with six ready prompts for apps such as Claude Desktop and Cursor.
- **Free and open source.** Apache 2.0, on macOS, Linux and Windows.

Another tool fits better for a business that answers customers (the official Cloud API alone), or a script that only
sends ([mudslide](https://github.com/robvanderleek/mudslide)).

## What it can do

- **Read:** chats, one message with its neighbours, unread, everything since the last review, new messages as they
  arrive. [Using wa](./usage.md)
- **Find:** search messages on your computer, export a chat to Markdown. [Search](./search.md),
  [The local store](./archive.md)
- **Write:** replies, files, photos, voice notes, polls, reactions, edits within 15 minutes, and delete for everyone
  yourself. [Using wa](./usage.md)
- **Files:** save what you were sent and read the text inside it. [File attachments](./attachments.md)
- **Groups:** members, events, activity, unanswered questions. [Groups](./groups.md)
- **Privacy settings:** who sees your last seen, photo and about line, read receipts.
  [Privacy](./usage.md#privacy)
- **A business number:** messages and incoming events through the Cloud API. [Bot](./bot.md)

## How it works

- **A linked device.** You scan a QR code in WhatsApp, and `wa` becomes one of your linked devices, like WhatsApp Web.
- **A copy on your computer.** Every message your phone pushed and `wa` received sits in a local store. Search and
  export read only this. [The local store](./archive.md)
- **Your limits in one place.** The command line and the MCP server share each profile's permissions.
  [Permissions](./permissions.md)
- **What is stored and what goes over the network.** [Security](./security.md)

## Start in five minutes

Paste this into your agent:

```text prompt
Use wa CLI. Install it with npm install -g @wirecat/whatsapp-cli, help me run wa personal setup and link my phone, then show me who is waiting for my answer.
```

Or in a terminal:

```sh
npm install -g @wirecat/whatsapp-cli
wa personal setup     # link by QR code, check five chats, install the agent skill
wa personal inbox     # other people's unread messages, nothing marked read
```

You scan the code in WhatsApp, under Linked devices. You need Node.js 22.16 or later. [Installation](./installation.md)

## Limits

- `wa` is an unofficial client, and WhatsApp may ban an account that sends in bulk or writes to strangers. The default
  limits are there to prevent that. [Limits](./limits.md)
- Planned features are on the [roadmap](./roadmap.md).
- One message carries at most a photo and a video as an album.

## Find a guide for your task

| Task | Guide |
|---|---|
| Install and link your phone | [Installation](./installation.md) |
| Read, search and send | [Using wa](./usage.md) |
| Files and voice notes | [File attachments](./attachments.md) |
| Groups | [Groups](./groups.md) |
| Decide what an agent may do | [Permissions](./permissions.md) |
| Connect an app that uses MCP | [The MCP server](./mcp.md) |
| A business number | [Bot](./bot.md) |
| An exact command | [Command reference](./commands.md) |
| Something does not work | [Troubleshooting](./troubleshooting.md) |
| How wa differs from other WhatsApp tools | [Comparison](./compare.md) |
