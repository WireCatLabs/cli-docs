---
title: "Bots and Bot API"
description: "Connect a bot, choose a chat and use it for replies, reports or group tasks."
---

A bot has its own name, account and chats. Use it to publish reports, answer requests or help
manage a group. Commands without `bot` still use your personal account.

## Connect a bot

Create a Telegram bot through [BotFather](https://t.me/BotFather), or follow the
[MAX bot setup](https://business.max.ru/self). Then save its token at a hidden prompt:

```sh
tg support bot auth set
max support bot auth set
```

`support` is a name you choose for the bot profile. Connect only the messenger you use.
Do not put the token in a command, screenshot or chat. Check which bot is connected:

```sh
tg support bot me
max support bot me
```

## Choose a chat

Add the bot to your group or channel, or start a conversation with it from your personal account.
A bot can work only with the chats and messages the messenger lets it access. It does not gain
access to your personal chat history. Telegram users must start the bot before it can message them.

The bot learns chat identifiers from received updates or a chat you explicitly inspect.
See the [Telegram bot guide](./tg/bot.md) or [MAX bot guide](./max/bot.md) to find the right chat.
Use its saved title in later commands where available.

## Send a reply or a report

```sh
tg support bot messages send "Team" "The report is ready"
max support bot messages send "Team" "The report is ready"
```

Replace the chat and text with what you intend to send. This is a real message from the bot.
You can also send files, reply to a message and manage chats when the bot has the required rights.
Do not give administrator rights for actions that do not need them.

## Automate carefully

An assistant can draft replies, prepare reports or use the bot in a workflow. Give it the
[permissions](./permissions.md) it needs and decide which recipients it may contact.
For important messages, ask to review the text first. Webhooks and update polling feed other
applications; changing them can interrupt an existing integration.

MCP offers tools for common bot tasks. An assistant with terminal access can also use the CLI.
[Connecting an assistant](./mcp.md) explains these choices.

## A method missing from the convenient commands?

The native Bot API interface exposes the methods defined by each messenger. Start with help:

```sh
tg support bot api --help
max support bot api --help
tg support bot api get-me --json
max support bot api get-my-info --json
```

Choose a method, then use its `--help` for fields and examples. Telegram and MAX use different
method names and inputs. Native JSON input and detailed response formats are for integrations;
read the messenger's bot guide before using them.

[Telegram official API](https://core.telegram.org/bots/api) · [MAX official API](https://dev.max.ru/docs-api)
