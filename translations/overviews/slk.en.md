---
title: "Slack: start here"
description: "A Slack CLI and Slack MCP server: your AI agent reads and searches your Slack channels, DMs and threads as you, and sends only when you ask."
---

Catch up on Slack in one answer, without opening every channel. `slk` connects your own Slack account to the AI agent
you already use, such as Claude Code, Codex or Cursor. The agent sees the channels, direct messages and threads you
see in Slack, and nothing more.

Your agent tells you which DMs wait for your answer, what the team decided in a thread and where Anna shared the
contract. It answers with the messages it found, and it sends, edits or reacts only when you say so.

`slk` is a Slack CLI for your terminal and a Slack MCP server for apps such as Claude Desktop. It signs in with a small
Slack app that you make in your own workspace in about three minutes. The app is yours, so Slack lets it read history
at full speed. You need the right to install an app in the workspace,
or an admin who approves it.

**On this page:**

1. [What you get](#what-you-get)
2. [Things a newcomer would not guess](#things-a-newcomer-would-not-guess)
3. [How it looks](#how-it-looks)
4. [How it works](#how-it-works)
5. [Start in ten minutes](#start-in-ten-minutes)
6. [What it does not do yet](#what-it-does-not-do-yet)
7. [Find a guide for your task](#find-a-guide-for-your-task)

## What you get

- **Catch up in one answer.** `inbox` lists the unread DMs and group DMs, the channels you follow, and any other
  channel where someone mentioned you or wrote @here, @channel or @everyone.
- **Find what was said.** "Where did Anna share the contract?" gives the message and its channel. Search asks
  Slack's own search and the copy on your computer at once.
- **Whole threads.** Your agent reads a thread from its first message to the last reply, so a summary does not miss
  the decision at the end.
- **Reading leaves no trace.** Nothing is marked read, and nobody sees that you looked.
- **You decide what the agent may change.** Each profile allows, asks or refuses each kind of write, and a profile can
  be read-only. Over MCP nobody is there to answer, so a write set to ask goes ahead. Read more in
  [settings](./configuration.md#permissions).
- **The rest of Slack's API.** Every method of the Slack Web API is a command of its own in the `api` group, for what
  the everyday commands do not cover.

## Things a newcomer would not guess

- **You make the Slack app yourself.** Slack lets a program read messages only through an app installed in the
  workspace. An app that another company publishes outside the Slack Marketplace gets
  [one read of 15 messages a minute](https://docs.slack.dev/changelog/2025/05/29/rate-limit-changes-for-non-marketplace-apps).
  An app you make in your own workspace keeps the normal limits. A link fills in all of its settings, so you only
  click **Create**, **Install** and **Copy**.
- **`personal` is a name you choose** for one workspace, and the first word of every command. No command picks a
  workspace for you, not even the only one.
- **Channels are in the inbox only when you say so.** Slack gives a channel no unread count. So `inbox` reads every
  channel you name in `inbox_channels`, or all of them with `inbox_all_channels true`. Any other channel shows up
  only when a message after your last read mentions you or uses @here, @channel or @everyone. The inbox asks your
  chats for 15 seconds at most, and its `missing` field says which chats it did not reach and why.
- **Replies inside threads, user-group mentions and muted channels are not counted.** The inbox does not read
  thread replies or mentions of a group such as @design. Slack keeps your muted channels in your own settings, and
  an app's token cannot read them, so a muted channel you list in `inbox_channels` still counts.
- **Slack's search finds words, not mentions.** Slack's own search does not find a message by @Anna or by her user
  id, only by the words in it. To see new mentions of you, ask `inbox`.
- **Reads follow Slack's pace.** History and thread reads go at 50 a minute and other calls at 20 a minute, the limits
  of Slack's [rate limit tiers](https://docs.slack.dev/apis/web-api/rate-limits/). A first sync of a busy channel
  takes minutes.
- **The local copy holds what you sync.** `messages sync` saves a chat on your computer, with the new replies of
  threads up to 14 days old. A message deleted in Slack later stays in the copy, since Slack does not say it was
  deleted.

## How it looks

```text
You:    What did I miss in Slack this morning?
Agent:  (runs slk personal inbox 'date>8h': 2 DMs, 1 channel)
        · Anna Example asked in a DM whether the contract is signed, 09:12
        · #release: Bob Sample wrote @here, the deploy moves to Thursday
You:    Tell Anna: yes, I will send it today.
Agent:  Draft to Anna Example: "Yes, I will send it today." Send it?
You:    Yes.
```

## How it works

- **Your own token.** The app gives you a User OAuth Token, which starts with `xoxp-`. With it `slk` acts as you, so
  it sees only the conversations you are in. The token stays in your system keyring, or in a private file where there
  is no keyring. Read more in [security](./security.md).
- **Slack's search and a copy on your computer.** A search asks Slack and the local store together. The local store
  is one file on your computer that every WireCat tool shares, so `search all` also finds your notes and other messengers.
- **A profile for each workspace.** Every command that uses an account names its profile first:
  `slk work chats list`.
- **The same commands for you and your agent.** A terminal agent uses the commands through the tool's skill. An app
  that connects to MCP servers gets the same commands as tools.

## Start in ten minutes

Paste this into a chat with your agent:

```text prompt
Use slk CLI. Install it with npm install -g @wirecat/slack-cli, help me through slk personal setup, then show me what is unread in my Slack.
```

Or in a terminal:

```sh
npm install -g @wirecat/slack-cli
slk personal setup
slk personal inbox
```

`setup` shows the steps to make the app and asks for the token hidden. You need Node.js 22.16 or later.
[Install](./installation.md) has every step with Slack's button names.

## What it does not do yet

- The inbox leaves out replies inside threads, mentions of a user group and the muted mark of a channel.
- `chats list` shows no unread counts. Ask `inbox` for them.
- It signs in only with the token of your own Slack app, not through the browser.

## Find a guide for your task

| Task | Guide |
|---|---|
| Make the Slack app, install and sign in | [Install](./installation.md) |
| Learn how a command is built and connect an agent | [Use it](./usage.md) |
| Find a command or an option | [Commands](./commands.md) |
| Change a setting or a permission | [Settings](./configuration.md) |
| Fix an error | [When something goes wrong](./troubleshooting.md) |
| Learn what the tool keeps and sends | [Security](./security.md) |
| Compare it with other Slack tools | [Compared with other tools](./compare.md) |
