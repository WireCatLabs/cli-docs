---
title: "Mail: start here"
description: "Your agent searches your mail offline, tells you which emails you owe an answer and drafts replies you approve. Moves and deletions can be undone."
---

You find the invoice from last spring, or the thread where a price was agreed, by asking. `mail` keeps a copy of your
mailbox on your computer, so the AI agent you already use, such as Claude Code or Codex, searches it there, even
without the internet. It works with Gmail, Outlook, iCloud, Fastmail, Yandex and any other mail server that offers
IMAP.

Your agent tells you which emails you owe an answer, what a PDF attachment says, and files this week's newsletters for
you. Moves and deletions can be undone, and mail to anyone but you waits for your yes.

**On this page:**

1. [What you get](#what-you-get)
2. [Things a newcomer would not guess](#things-a-newcomer-would-not-guess)
3. [How it looks](#how-it-looks)
4. [Why mail](#why-mail)
5. [What it can do](#what-it-can-do)
6. [How it works](#how-it-works)
7. [Start](#start)
8. [Limits](#limits)
9. [Find the guide for your task](#find-the-guide-for-your-task)

## What you get

- **Mail your agent can use.** Ask for an email by what it said, who sent it or what is in its attachment. The agent
  shows the email it found.
- **A short list of what needs you.** Which threads have new mail, which emails you owe an answer, which wait for
  someone else.
- **Fewer newsletters and alerts.** Choose which senders, lists or kinds of mail to skip or keep only as a short
  record. Look at a mailbox by sender before you copy it.
- **A tidier mailbox, with undo.** Moves, flags and deletion happen on the mail server. Deleted mail goes to Trash,
  and a move or a deletion can be undone while Trash still holds it.
- **Drafts and replies you approve.** Your agent saves a draft in your own Drafts folder, so it shows in every mail
  app. Mail to anyone but you asks you first.
- **Mail beside your chats.** The same store holds your Telegram, MAX and WhatsApp history, so
  [Memo](/en/docs/memo/mail) searches mail together with your chats and notes.

## Things a newcomer would not guess

- **Most providers want an app password.** It is a password made for one program, which you can revoke. Outlook and
  Microsoft 365 use a browser sign-in instead. [Prepare the mailbox](./providers.md)
- **The first sync reads the last 30 days.** Set `sync_since` (such as `1y`) to go further back, or bring in a Google Takeout file.
- **`personal` is a name you choose** for one mailbox. No command picks a mailbox for you.
- **Text in an email is someone else's.** Your agent treats it as data, never as an instruction.

## How it looks

```text
You:    Which emails from this week do I still owe an answer?
Agent:  (runs mail personal review --unanswered 1d, then mail personal messages show on each)
        · Ann Example asked on Tuesday whether the invoice can move to December.
        · Bob Sample sent the contract on Wednesday and asked for comments by Friday.
You:    Draft a reply to Ann: yes, December is fine.
Agent:  Saved a draft in your Drafts folder, in Ann's thread. Nothing is sent.
```

## Why mail

- **One store with your chats.** Of the mail tools on the [comparison](./compare.md) (Himalaya, mu, gog, Google
  Workspace MCP, Microsoft 365 MCP), none documents keeping mail in one store with chats, meetings and notes and
  searching them together.
- **Undo for what it changed.** No other tool on the comparison documents an undo for what it changed on the server.
- **An agent over MCP mails only you** until you allow more. At a terminal, a deletion or a change of many emails
  asks you first. Over MCP nobody can answer, so it runs: set `permissions.messages.delete deny` (or `readonly`) before
  you connect an agent.
- **Your password stays in the system keyring.** `mail` talks only to your provider's mail servers, over encrypted
  connections.
- **Free and open source.** Apache 2.0.

Another tool fits better when your organisation turns IMAP off (Microsoft 365 MCP), or you use Gmail only and want
Calendar and Drive in the same tool ([gog](https://github.com/openclaw/gogcli)).

## What it can do

- **Read and search:** offline, by words, sender, date, size and attachment text. [Search your mail](./usage.md#search-your-mail)
- **Review:** what is new, what you owe, what waits. [Review](./usage.md#review-what-is-new-what-you-owe-what-waits)
- **Organise:** rules for what to keep, flags, folders, Trash, with an undo. [Organise the mailbox](./usage.md#organise-the-mailbox)
- **Write:** drafts, send, reply and forward with attachments. [Send, reply and forward](./usage.md#send-reply-and-forward)
- **Keep:** export to mbox or Maildir, count mail by day or sender, add your own tags. [Your own tags](./usage.md#your-own-tags)
- **Hand triage to an agent:** with Memo, a scheduled agent proposes tasks and facts for you to confirm.
  [Mail in Memo](/en/docs/memo/mail)

| Provider | How you sign in | Guide |
|---|---|---|
| Gmail | An app password, or a Google sign-in | [Prepare the mailbox](./providers.md) |
| Outlook.com, Hotmail, Microsoft 365 | A Microsoft sign-in in your browser | [Connect Outlook](./outlook.md) |
| iCloud, Fastmail, Yandex | An app password | [Prepare the mailbox](./providers.md) |
| Any other IMAP server | An app password, if the provider has one | [Prepare the mailbox](./providers.md) |

## How it works

- **A copy on your computer.** `sync` reads your mail into the local store that the other WireCat tools share. Search
  and reading answer from it. A timer keeps it current. [Everyday use](./usage.md)
- **Changes happen on the server.** A move or a deletion changes your real mailbox, so every mail app sees it. Each
  change keeps what it needs to undo itself.
- **Made for scripts and agents.** One operation per call, one JSON answer with `--json`, a skill for terminal agents
  and an MCP server.
- **What is stored and what is sent.** [Access and safety](./security.md)

## Start

Paste this into your agent:

```text prompt
Use mail CLI. Install it with npm install -g @wirecat/mail-cli, help me prepare my mailbox, sign in with mail personal session start, sync the last 30 days and show which emails I owe an answer.
```

Or in a terminal. Turn on IMAP and make an app password first ([steps per provider](./providers.md)):

```sh
npm install -g @wirecat/mail-cli
mail personal session start          # asks for the address, finds the server, asks for the app password
mail personal sync                   # the last 30 days
mail personal search messages invoice
mail skill install                   # optional: instructions for your agent
```

You need Node.js 22.16 or later on 22.x, or 24 and later. [Installation](./installation.md)

## Limits

- `mail` reads mail over IMAP. A mailbox reached only through JMAP or Microsoft Graph needs another tool.
- A deleted draft does not come back, and Gmail empties Trash after 30 days, so an undo works only until then.

## Find the guide for your task

| Task | Guide |
|---|---|
| Connect a mailbox and read mail | [Everyday use](./usage.md) |
| Prepare Gmail, iCloud, Fastmail, Yandex or another server | [Prepare the mailbox](./providers.md) |
| Connect Outlook or Microsoft 365 | [Connect Outlook](./outlook.md) |
| Search mail with your chats, spot scams | [Email with Memo](./email.md) |
| An exact command | [Command reference](./commands.md) |
| Change a setting or a permission | [Settings](./configuration.md) |
| Something does not work | [Troubleshooting](./troubleshooting.md) |
| What mail stores and sends | [Access and safety](./security.md) |
| How mail differs from other mail tools | [Comparison](./compare.md) |
