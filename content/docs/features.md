---
title: "Features"
description: "What the Telegram and MAX CLIs can do: your whole account, groups, a searchable archive, voice to text, every Bot API method, and limits you set for your agent."
---

Each tool works with one messenger: `tg` with Telegram, `max` with MAX. They cover the same ground;
the tables show where they differ. ✓ means it is there, — means that messenger's tool does not have
it. For the exact commands, see [Telegram commands](./tg/commands.md) or
[MAX commands](./max/commands.md).

## Messages

| What you can do | Telegram | MAX |
|---|---|---|
| Read chats and message history | ✓ | ✓ |
| Send text and files, reply to a message | ✓ | ✓ |
| Edit, delete, forward and pin messages | ✓ | ✓ |
| Schedule a message — it goes out even when your computer is off | ✓ | ✓ |
| Download photos, documents and other attachments | ✓ | ✓ |
| React to messages | ✓ | ✓ |
| Create polls, vote, close your own | ✓ | ✓ |
| Turn voice messages into text on your own computer | ✓ | ✓ |
| Get a link to a message | ✓ | ✓ |
| Mark chats as read — only when you ask | ✓ | ✓ |

Guides: [Telegram usage](./tg/usage.md) · [MAX usage](./max/usage.md)

## Chats, contacts and account

| What you can do | Telegram | MAX |
|---|---|---|
| List and search chats, filter by kind (people, groups, channels) | ✓ | ✓ |
| Create, change and delete chat folders | ✓ | ✓ |
| Contacts: find, add, rename, block, import | ✓ | ✓ |
| Update your profile | ✓ | ✓ |
| See every device logged in to your account, end one | ✓ | ✓ |
| Several accounts, one *profile* each | ✓ | ✓ |

Guides: [Telegram login and profiles](./tg/sessions.md) · [MAX sessions and profiles](./max/sessions.md)

## Groups and channels

| What you can do | Telegram | MAX |
|---|---|---|
| Create a group or a channel | ✓ | ✓ |
| Check where an invite link leads without joining | ✓ | ✓ |
| Join and leave; show or reset the invite link | ✓ | ✓ |
| Add and remove members; make admins and set their rights | ✓ | ✓ |
| See who joined, left or was removed | ✓ | ✓ |
| Find questions nobody in the group answered | ✓ | ✓ |
| Change the title, description and settings | ✓ | ✓ |
| Forum topics: list, search, create, post into a topic | ✓ | — |
| Moderation rules: links, invites, forwards, flooding, blocked people | ✓ | ✓ |
| A rule for new accounts (younger than N days) | — | ✓ |

Moderation runs when you, your agent or your schedule starts it; nothing watches a group by itself.
Guides: [Telegram groups](./tg/groups.md) · [MAX groups](./max/groups.md)

## History, search and staying on top

| What you can do | Telegram | MAX |
|---|---|---|
| Keep a local archive of the chats you choose | ✓ | ✓ |
| Search it offline by words, sender, date and chat, with typo-tolerant matching | ✓ | ✓ |
| Separate the threads of a busy group by replies and mentions | ✓ | ✓ |
| Export a chat as Markdown or JSON lines; back up the whole archive | ✓ | ✓ |
| Inbox: unread messages from every chat in one list | ✓ | ✓ |
| Review: who is waiting for your answer, and what you are waiting for | ✓ | ✓ |
| Watch new messages as they arrive | ✓ | ✓ |
| Keep the archive current in the background | ✓ | ✓ |

Guides: [Telegram archive](./tg/archive.md) · [Telegram search](./tg/search.md) ·
[MAX archive](./max/archive.md) · [MAX search](./max/search.md)

## Bots

A bot works with its own token, separate from your personal account.

| What you can do | Telegram | MAX |
|---|---|---|
| Every method of the official Bot API | ✓ all 185 | ✓ all 33 |
| Send, edit, delete and pin messages; search the bot's messages | ✓ | ✓ |
| Answer button presses; set the bot's command menu | ✓ | ✓ |
| Manage webhooks | ✓ | ✓ |
| Manage group admins; remove members | ✓ | ✓ |
| List and add group members | — | ✓ |
| Moderate a group by the same rules as your account | ✓ | ✓ |
| Comments under channel posts | — | ✓ |
| Give the bot to an agent over MCP | ✓ | ✓ |

Guides: [Full Bot API](./bot-api.md) · [Telegram bots](./tg/bot.md) · [MAX bots](./max/bot.md)

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
- **A profile lock** that keeps an agent on one account.

[What the login allows and how to limit it](./installation.mdx) ·
[Telegram security](./tg/security.md) · [MAX security](./max/security.md)

## Not there yet

- **Telegram:** several photos in one message. [Roadmap](./tg/roadmap.md)
- **MAX:** video notes, and setting or removing the cloud password. Deleting whole chats is not
  planned. [Roadmap](./max/roadmap.md)
