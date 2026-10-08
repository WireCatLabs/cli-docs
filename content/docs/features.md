---
title: "Features"
description: "Choose a useful task: catch up on chats, find agreements, collect files or draft replies."
---

Use your assistant to catch up on chats, find an agreement, collect documents or prepare a reply. This page helps you choose a task and see what a useful result looks like. `tg` and `max` are command-line tools that give the assistant access to Telegram and MAX respectively.

Choose where to start:

- **Catch up or draft a reply:** [First tasks](./first-tasks.md).
- **Find an older message or words inside a document:** [Search](./search.md).
- **Collect files or summarise voice messages:** [Requests for files and voice](./prompting.md#files-and-voice).
- **Manage a community:** [Group administration](./group-admins.md).
- **Work through a bot:** [Bots and Bot API](./bot-api.md).

If your account is already connected, copy a request below into your agent. Otherwise, start with [installation and login](./installation.mdx). To see a worked conversation before connecting, open the [demo](./meeting-brief.mdx).

## Messages

Summarise a conversation or prepare a reply you can review before sending.

```text prompt
Read my conversation with Anna from today. What needs my answer? Draft a short reply without sending it.
```

Expect a draft and the messages it is based on. If the recipient is ambiguous, clarify the chat before sending.

<details>
<summary>Commands and additional capabilities</summary>

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

</details>

Guides: [Telegram usage](./tg/usage.md) · [MAX usage](./max/usage.md)

## Chats, contacts and account

Find a person and recover the context of your previous conversations.

```text prompt
Find the designer we discussed last month. Show who recommended them and what we have already agreed.
```

Expect a clearly identified contact and supporting messages. Use separate profiles for work and personal accounts; [choosing an account](./profiles.md) explains how.

<details>
<summary>Commands and additional capabilities</summary>

| What you can do | Commands |
|---|---|
| List and search chats, filter by kind (people, groups, channels) | `chats list` |
| Create, change and delete chat folders | `chats folders` |
| Contacts: find, add, rename, block, import | `contacts` |
| Who someone is, what they wrote, whether the account looks like a bot | `contacts profile`, `context`, `check` |
| Auto-replies by your rules, to test accounts only | `replies` |
| Update your profile; see every device logged in, end one | `account` |
| Several accounts, one *profile* each | `tg work …`, `max work …` |

</details>

Guides: [People](./people.md) · [Telegram login and profiles](./tg/sessions.md) · [MAX sessions and profiles](./max/sessions.md)

## Groups and channels

Review a group before changing its members, settings or moderation rules.

```text prompt
In my project group, list questions awaiting an administrator’s reply. Show sources; do not change anything.
```

Expect a list to review. Group changes require the relevant account rights. Moderation runs when started by you, your agent or a scheduled task.

<details>
<summary>Commands and additional capabilities</summary>

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

</details>

Moderation runs when you, your agent or your schedule starts it; nothing watches a group by itself.
Guides: [Telegram groups](./tg/groups.md) · [MAX groups](./max/groups.md)

## History, search and staying on top

Find an older agreement or collect the important unread messages.

```text prompt
Find what we agreed about the project deadline last month. Show the agreement and any later changes.
```

Expect the answer, sources and the period checked. Search uses saved history; if the period is missing, [download the relevant chats first](./search.md).

<details>
<summary>Commands and additional capabilities</summary>

| What you can do | Commands |
|---|---|
| Keep a local archive of the chats you choose | `store fetch` |
| Search it offline by words, sender, date and chat, with typo-tolerant matching | `messages search` |
| Separate the threads of a busy group by replies and mentions | `conversations` |
| Export a chat as Markdown or JSON lines; back up the whole archive | `store export`, `store backup` |
| Unread messages from every chat in one list | `inbox` |
| Who is waiting for your answer, and what you are waiting for | `review` |
| Watch new messages as they arrive | `watch` |
| Keep the archive current in the background | `server` |

</details>

Guides: [Telegram archive](./tg/archive.md) · [Telegram search](./tg/search.md) ·
[MAX archive](./max/archive.md) · [MAX search](./max/search.md)

## Bots

Use a bot for customer messages, button responses or group tasks. It has its own identity and access.

```text prompt
Check the bot’s available messages and draft answers to unanswered questions. Show each draft to me before sending.
```

Expect drafts based on messages available to that bot. Your personal account’s history is separate. Start with [bot setup and capabilities](./bot-api.md).

A bot works with its own token, separate from your personal account.

<details>
<summary>Commands and additional capabilities</summary>

| What you can do | Commands |
|---|---|
| Every method of the official Bot API — all 185 for Telegram, all 33 for MAX | `bot api` |
| Send, edit, delete and pin messages; search the bot's messages | `bot messages` |
| Answer button presses; set the bot's command menu; manage webhooks | `bot callbacks`, `bot commands`, `bot webhooks` |
| Manage group admins and members | `bot chats admins`, `bot chats members` |
| Moderate a group by the same rules as your account | `bot chats moderate` |
| Give the bot to an agent over MCP | `bot mcp config` |
| Comments under channel posts — *MAX* | `bot comments` |

</details>

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

Current unsupported features and planned work are listed in the roadmaps for [Telegram](./tg/roadmap.md) and [MAX](./max/roadmap.md). A roadmap item is not an available capability.

## Choose your next task

Try [a first task](./first-tasks.md) and check that the agent shows sources and a usable result. To repeat a useful workflow, see [recurring tasks](./prompting.md#recurring-tasks). Exact syntax is in the command references for [Telegram](./tg/commands.md) and [MAX](./max/commands.md).
