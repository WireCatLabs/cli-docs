---
title: "Roadmap"
---

This page lists what `slk` does today and what it does not do yet. Read it before you build a workaround for a
missing feature. There are no dates. To ask for something, open an
[issue on GitHub](https://github.com/WireCatLabs/slack-cli/issues).

## What works today

`slk` signs in with the User OAuth Token of a Slack app you make in your own workspace, and reads Slack as you. You
and your agent list your channels, DMs and group DMs, read a whole thread, see what is unread with `inbox`, and find
messages with Slack's own search and the copy you save on your computer. It sends, edits, reacts and uploads files
when you ask, within the permissions you set. Every method of the Slack Web API is a command in the `api` group, over
the command line or MCP. See [start here](./index.md).

## Not there yet

- Replies inside threads and mentions of a user group in `inbox`. Today the inbox reads the newest messages of each
  chat, not the replies under them.
- Unread counts in `chats list`. Today `inbox` gives them.
- Sign-in through the browser. Today you sign in with the token of your own Slack app.
- Slack huddles and their notes.

What changed in each released version is in the [changelog](./changelog.md).
