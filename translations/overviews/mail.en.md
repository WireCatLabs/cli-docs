---
title: "Mail: start here"
description: "Connect your mailbox to an agent: search it offline, see what needs an answer, tidy it with undo, and draft or send replies."
---

This page explains what `mail` is, what you get from it, which mailboxes it works with and where to start.

**On this page**

- [What mail is](#what-mail-is)
- [What you get](#what-you-get)
- [Supported providers](#supported-providers)
- [Features](#features)
- [Start here](#start-here)
- [Find the guide for your task](#find-the-guide-for-your-task)

## What mail is

`mail` is a command-line tool that keeps a copy of your mailbox on your computer. Your AI agent, or you, can then
search and work with that copy, even without an internet connection. It is part of WireCat, the set of tools that give
your agent access to your messages. It runs on Windows, macOS and Linux.

## What you get

- **Mail your agent can use.** Ask for the invoice from last spring, the thread where a price was agreed, or what a
  PDF attachment says. The agent searches the local copy and shows the email it found.
- **A short list of what needs you.** Ask which threads have new mail, which emails you owe an answer to, and which
  are waiting for someone else.
- **Fewer newsletters and alerts.** You choose which senders, mailing lists or kinds of mail to skip or keep as a
  short record only, and you can look at a mailbox by sender before you copy it.
- **A tidier mailbox, with an undo.** Moves, flags and deletion go to the mail server first. Deleted mail goes to
  Trash, and every change can be undone.
- **Drafts and replies you approve.** Your agent can save a draft in your own Drafts folder. Mail to anyone but you
  asks you first; an agent over MCP may send mail only to you unless you allow more.
- **One place for all your messages.** The same store holds your Telegram, MAX and WhatsApp history, so
  [Memo](/en/docs/memo/mail) can search mail together with your chats and notes.

Your app password stays in your computer's keyring. `mail` reads mail only from your provider's IMAP server and sends
it only through your provider's SMTP server, both encrypted. See [access and safety](/en/docs/mail/security).

## Supported providers

`mail` reads mail over IMAP and sends it over SMTP. Both are standard mail protocols that most providers offer.

| Provider | How you sign in | Guide |
|---|---|---|
| Gmail | An app password (default), or OAuth, with WireCat's Google app or your own | [Prepare the mailbox](/en/docs/mail/providers), [Gmail with your own Google app](/en/docs/mail/oauth-google) |
| Outlook.com, Hotmail, Microsoft 365 | OAuth only: you sign in to Microsoft in your browser | [Connect Outlook](/en/docs/mail/outlook), [Register a Microsoft app](/en/docs/mail/oauth-microsoft) |
| iCloud, Fastmail | An app password | [Prepare the mailbox](/en/docs/mail/providers) |
| Any other IMAP server | An app password, if the provider offers one; `mail` finds the server from your address, or you pass the host and port | [Any other provider](/en/docs/mail/providers) |
| Yandex | An app password | [Prepare the mailbox](/en/docs/mail/providers) |

An app password is a password made for one program only, which you can revoke. Each provider needs IMAP switched on
and, for most, an app password first: the steps for each one are in [Prepare the mailbox](/en/docs/mail/providers).
Gmail OAuth uses WireCat's Google app unless you name your own. Making a shared Google app public for mail is complex, so Google may refuse the sign-in; if it does, use your own Google app or an app password.

A Gmail profile can also add a Google Takeout archive (an `.mbox` file) to its stored mail; see [look before you sync, and bring in an archive](/en/docs/mail/usage#look-before-you-sync-and-bring-in-an-archive).

## Features

- Read your mailbox offline and keep it current on a timer. [Connect a mailbox](/en/docs/mail/usage#connect-a-mailbox)
- Search by words, sender, date, size and the text inside attachments. [Search your mail](/en/docs/mail/usage#search-your-mail)
- See what is new, which emails you owe an answer and which wait for a reply. [Review](/en/docs/mail/usage#review-what-is-new-what-you-owe-what-waits)
- Look at a mailbox by sender before you copy it, and bring in a Google Takeout archive. [Look before you sync](/en/docs/mail/usage#look-before-you-sync-and-bring-in-an-archive)
- Set rules to skip a sender or list, keep only its envelope, or protect it from cleanup. [Organise the mailbox](/en/docs/mail/usage#organise-the-mailbox)
- Tidy the mailbox on the server, with a preview before big changes and an undo. [Organise the mailbox](/en/docs/mail/usage#organise-the-mailbox)
- Save drafts, then send, reply and forward, with attachments. [Send, reply and forward](/en/docs/mail/usage#send-reply-and-forward)
- Add your own tags, export mail and count it by day, week or sender. [Your own tags](/en/docs/mail/usage#your-own-tags)
- Let a scheduled agent triage new mail and propose tasks and facts for you to confirm, with Memo. [Mail in Memo](/en/docs/memo/mail)

## Start here

### Connect through your agent

Follow [the guide for your agent](/en/docs/agents), then open the [Mail installation guide](/en/docs/mail/installation).
Your agent installs the tool; you make the app password or approve the Microsoft sign-in.

### Start in a terminal

1. [Install `mail`](/en/docs/mail/installation) from npm.
2. [Prepare the mailbox](/en/docs/mail/providers): turn on IMAP and make an app password. For Outlook or Microsoft 365,
   [connect Outlook](/en/docs/mail/outlook) instead.
3. Create a profile, check the login, read your mail and search it. `personal` is a profile name you choose for one mailbox.

```sh
mail personal session start --address me@example.com
mail personal account check
mail personal sync
mail personal search messages invoice
```

`session start` finds the mail server, asks for the app password and keeps it in the OS keyring. `sync` reads the last 30 days
by default; add `--since-time 2026-01-01` to go further back.

4. Optional: install the tool's instructions for your agent.

```sh
mail skill install
```

## Find the guide for your task

| Task | Guide |
|---|---|
| Connect a mailbox and read mail | [Everyday use](/en/docs/mail/usage) |
| Prepare Gmail, iCloud, Fastmail, Yandex or another server | [Prepare the mailbox](/en/docs/mail/providers) |
| Connect Outlook.com or Microsoft 365 | [Connect Outlook](/en/docs/mail/outlook) |
| Use Gmail without an app password | [Gmail with your own Google app](/en/docs/mail/oauth-google) |
| Search mail with your agent, link senders to people and spot scams | [Email with Memo](/en/docs/mail/email) |
| Have an agent triage new mail | [Mail in Memo](/en/docs/memo/mail) |
| Look up a command or option | [Command reference](/en/docs/mail/commands) |
| Change a setting or a permission | [Settings](/en/docs/mail/configuration) |
| Fix an error | [Troubleshooting](/en/docs/mail/troubleshooting) |
| See what `mail` stores, sends and never sends | [Access and safety](/en/docs/mail/security), [privacy](/en/privacy) |
| Compare `mail` with other mail tools | [Comparison](/en/docs/mail/compare) |
| See what is planned | [Roadmap](/en/docs/mail/roadmap) |

`mail` follows the same standards as the other WireCat tools, with one shared store and one query language: see the
[WireCat CLI standards](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/README.md).
