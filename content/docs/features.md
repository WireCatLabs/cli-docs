---
title: "Features"
description: "What the Telegram and MAX CLIs can do: your whole account, groups, a searchable archive, voice to text, every Bot API method, and limits you set for your agent."
---

Each tool works with one messenger: `tg` with Telegram, `max` with MAX. Everything below works in
both, unless a row says otherwise. The commands start with `tg` or `max`; full syntax is in
[Telegram commands](./tg/commands.md) and [MAX commands](./max/commands.md).

## Messages

| What you can do | Commands |
|---|---|
| Read chats and message history | `messages list`, `messages show` |
| Send text and files, reply to a message | `messages send` |
| Edit, delete, forward and pin messages | `messages edit`, `delete`, `forward`, `pin` |
| Schedule a message — it goes out even when your computer is off | `messages send --at-time` |
| Download photos, documents and other attachments | `messages download` |
| React to messages | `reactions` |
| Create polls, vote, close your own | `polls` |
| Turn voice messages into text on your own computer | `messages transcribe` |
| Get a link to a message | `messages link` |
| Mark chats as read — only when you ask | `chats mark-read` |

Guides: [Telegram usage](./tg/usage.md) · [MAX usage](./max/usage.md)

## Chats, contacts and account

| What you can do | Commands |
|---|---|
| List and search chats, filter by kind (people, groups, channels) | `chats list` |
| Create, change and delete chat folders | `chats folders` |
| Contacts: find, add, rename, block, import | `contacts` |
| Who someone is, what they wrote, whether the account looks like a bot | `contacts profile`, `context`, `check` |
| Auto-replies by your rules, to test accounts only | `replies` |
| Update your profile; see every device logged in, end one | `account` |
| Several accounts, one *profile* each | `tg work …`, `max work …` |

Guides: [People](./people.md) · [Telegram login and profiles](./tg/sessions.md) · [MAX sessions and profiles](./max/sessions.md)

## Groups and channels

| What you can do | Commands |
|---|---|
| Create a group or a channel | `chats create` |
| Check where an invite link leads without joining | `chats inspect` |
| Join and leave; show or reset the invite link | `chats join`, `leave`, `link` |
| Add and remove members; make admins and set their rights | `chats members`, `chats admins` |
| See who joined, left or was removed | `chats events` |
| Find questions nobody in the group answered | `review --unanswered` |
| Change the title, description and settings | `chats update` |
| Moderation rules: links, invites, forwards, flooding, blocked people | `chats rules`, `chats moderate` |
| Forum topics: list, search, create, post into a topic — *Telegram* | `topics` |
| A moderation rule for new accounts — *MAX* | `chats rules` |

Moderation runs when you, your agent or your schedule starts it; nothing watches a group by itself.
Guides: [Telegram groups](./tg/groups.md) · [MAX groups](./max/groups.md)

## History, search and staying on top

| What you can do | Commands |
|---|---|
| Keep a local archive of the chats you choose | `store fetch` |
| Search it offline by words, sender, date and chat, with typo-tolerant matching | `search messages` |
| Separate the threads of a busy group by replies and mentions | `conversations` |
| Export a chat as Markdown or JSON lines; back up the whole archive | `store export`, `store backup` |
| Unread messages from every chat in one list | `inbox` |
| Who is waiting for your answer, and what you are waiting for | `review` |
| Watch new messages as they arrive | `watch` |
| Keep the archive current in the background | `server` |

Guides: [Telegram archive](./tg/archive.md) · [Telegram search](./tg/search.md) ·
[MAX archive](./max/archive.md) · [MAX search](./max/search.md)

## Bots

A bot works with its own token, separate from your personal account.

| What you can do | Commands |
|---|---|
| Every method of the official Bot API — all 185 for Telegram, all 33 for MAX | `bot api` |
| Send, edit, delete and pin messages; search the bot's messages | `bot messages` |
| Answer button presses; set the bot's command menu; manage webhooks | `bot callbacks`, `bot commands`, `bot webhooks` |
| Manage group admins and members | `bot chats admins`, `bot chats members` |
| Moderate a group by the same rules as your account | `bot chats moderate` |
| Give the bot to an agent over MCP | `bot mcp config` |
| Comments under channel posts — *MAX* | `bot comments` |

Guides: [Full Bot API](./bot-api.md) · [Telegram bots](./tg/bot.md) · [MAX bots](./max/bot.md)

## Built for agents

- **A skill** teaches Claude Code, Codex, Cursor, Gemini CLI and Hermes the commands.
  [Connect your agent](./agents.md)
- **An MCP server** for Claude Desktop and other clients. It follows the profile’s permissions; choose a read-only profile or ask before writes.
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

- **Telegram:** several photos in one message, drafts, mute and notification settings, archiving
  chats, pressing buttons in other bots' messages, secret chats, calls and stories.
  [Roadmap](./tg/roadmap.md)
- **MAX:** video notes, drafts, sending your location, setting or removing the cloud password,
  stories and calls. [Roadmap](./max/roadmap.md)
