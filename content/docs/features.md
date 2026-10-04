---
title: "Features"
description: "What the Telegram and MAX CLIs can do: your whole account, a searchable archive, voice to text, every Bot API method, and limits you set for your agent."
---

Both tools cover the same ground, so everything below works in Telegram (`tg`) and MAX (`max`)
unless it says otherwise. For the exact commands, see [Telegram commands](./tg/commands.md) or
[MAX commands](./max/commands.md).

## Your account, from the terminal

What you do in the app, your agent can do through the CLI.

- **Messages** — read, send, reply, edit, delete, forward, pin. Send files, schedule a message for
  later (it goes out even when your computer is off), download attachments.
- **Chats and groups** — list and search chats, create groups, join and leave, manage members and
  admins, invite links and chat folders. Mark chats as read only when you ask.
- **Group moderation** — set rules for a group, for example "delete messages with links", and
  apply them with one command.
- **Contacts** — find, add, rename, block, import.
- **Polls and reactions** — vote, create and close polls, react to messages.
- **Forum topics** — list, search and create topics in forum groups (Telegram).
- **Account** — update your profile, see every device logged in to the account.

Guides: [Telegram usage](./tg/usage.md) · [Telegram groups](./tg/groups.md) ·
[MAX usage](./max/usage.md) · [MAX groups](./max/groups.md)

## Find anything in your history

- **A local archive.** The CLI saves the chats you choose on your computer. Searching it is fast,
  works offline and does not touch your account.
- **Search** by words, sender, date and chat, including forgiving matching for typos.
- **Conversations.** In a busy group, the CLI separates the threads by replies and mentions, so
  the agent can follow one discussion.
- **Export and backup** — a chat as a readable Markdown transcript or as JSON lines, or a backup
  of the whole archive.

Guides: [Telegram archive](./tg/archive.md) · [Telegram search](./tg/search.md) ·
[MAX archive](./max/archive.md) · [MAX search](./max/search.md)

## Stay on top of your messages

- **Inbox** — unread messages from every chat in one list.
- **Review** — who is waiting for your answer, and what you are waiting for from others.
- **Live watch** — new messages as they arrive.
- **Background service** — keeps the archive up to date while your computer is on.

## Voice messages to text

Turn a voice message into text with a speech model that runs on your own computer, so the audio
never leaves it. Telegram can also use its own transcription.
[Voice messages](./tg/usage.md#voice-messages).

## Bots: the full Bot API

Run your bots from the same tool: **every method of the official Bot API** — all 185 for Telegram
and all 33 for MAX — plus short commands for everyday bot tasks. A bot works with its own token,
separate from your personal account. [Full Bot API](./bot-api.md) · [Telegram bots](./tg/bot.md) ·
[MAX bots](./max/bot.md)

## Built for agents

- **A skill** teaches Claude Code, Codex, Cursor, Gemini CLI and Hermes the commands.
  [Connect your agent](./agents.md)
- **An MCP server** for Claude Desktop and other clients. It is read-only unless you allow writes.
  [MCP](./mcp.md)
- **Predictable output** — every command can return one JSON value, and each kind of failure has
  its own exit code, so scripts and agents can react to it.
- **Self-description** — `tg commands --json` lists every command and option, so an agent can look
  up what it needs instead of guessing.

## Limits you set

- **Permissions per profile** — read-only, ask before a change, or allow.
- **A recipient list** — the chats this profile may send to.
- **An hourly limit** on sends, 30 by default.
- **A send journal** — every send attempt, without the message text.
- **Several accounts** — one *profile* per account, and a lock that keeps an agent on one profile.

[What the login allows and how to limit it](./installation.mdx) ·
[Telegram security](./tg/security.md) · [MAX security](./max/security.md)

## Not there yet

- **Telegram:** several photos in one message, and sending into a forum topic.
  [Roadmap](./tg/roadmap.md)
- **MAX:** video notes, and setting or removing the cloud password. Deleting whole chats is not
  planned. [Roadmap](./max/roadmap.md)
