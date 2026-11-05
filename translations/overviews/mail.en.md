---
title: "Mail: start here"
description: "Connect your mailbox to an agent: search it offline, see what needs an answer, tidy it with undo, and draft or send replies."
---

`mail` is a command-line tool that copies your mailbox into a local store on your computer. Your AI agent can then
search your email, read threads and attachments, and tell you what needs an answer, even without an internet connection.
It can also tidy the mailbox on the server and write replies for you to check. You can use it yourself with terminal
commands too. It runs on Windows, macOS and Linux.

**On this page**

- [What you get](#what-you-get)
- [Supported providers](#supported-providers)
- [What you can do](#what-you-can-do)
- [Start here](#start-here)
- [Find the guide for your task](#find-the-guide-for-your-task)

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
| Yandex | An app password | [Prepare the mailbox](/en/docs/mail/providers) |
| iCloud, Mail.ru, Fastmail | An app password | [Prepare the mailbox](/en/docs/mail/providers) |
| Any other IMAP server | An app password, if the provider offers one; `mail` finds the server from your address, or you pass the host and port | [Any other provider](/en/docs/mail/providers) |

An app password is a password made for one program only, which you can revoke. Each provider needs IMAP switched on
and, for most, an app password first: the steps for each one are in [Prepare the mailbox](/en/docs/mail/providers).
Gmail OAuth uses WireCat's Google app unless you name your own. Google has not reviewed WireCat's app for mail yet; if Google refuses the sign-in, use your own.

A Gmail profile can also add a Google Takeout archive (an `.mbox` file) to its stored mail; see [look before you sync, and bring in an archive](/en/docs/mail/usage#look-before-you-sync-and-bring-in-an-archive).

## What you can do

- **Read the mailbox offline.** `sync` copies new mail into the local store, newest first, and skips what it already
  has. A big mailbox is read in parts: run it again until `status` shows it is done. It keeps text and headers, and the
  text of attachments up to 10 MB each (a setting changes that), not the files themselves.
  [Connect a mailbox](/en/docs/mail/usage#connect-a-mailbox)
- **Keep it current by itself.** Put `sync` on a timer, for example every five minutes; `schedule list` shows how
  each run went. [Connect a mailbox](/en/docs/mail/usage#connect-a-mailbox)
- **Search.** Words, sender, mailing list, subject, date, size, attachments and the text inside them, with the query
  language every WireCat tool uses. Search also asks the mail server for mail not synced yet. `--backend archive`
  keeps it to the local store. [Search your mail](/en/docs/mail/usage#search-your-mail)
- **Review.** See what is new since you last looked, which emails you owe an answer, and which wait for a reply.
  [Review](/en/docs/mail/usage#review-what-is-new-what-you-owe-what-waits)
- **Look before you sync**. `account inspect` groups the mailbox by sender and list, with size, how much is unread
  and a spam or scam score, and stores nothing. [Look before you sync](/en/docs/mail/usage#look-before-you-sync-and-bring-in-an-archive)
- **Rules.** Skip a sender or list, keep only its envelope (sender, date and size), keep it in full, or protect it
  from any cleanup. [Organise the mailbox](/en/docs/mail/usage#organise-the-mailbox)
- **Organise on the server.** Mark read, star, move, copy, and create or rename folders. Gmail folders are labels.
  [Organise the mailbox](/en/docs/mail/usage#organise-the-mailbox)
- **Clean up and undo.** A deletion, or a change of more than 20 messages, is a preview until you confirm. Deleted
  mail goes to Trash and `messages restore` puts back what a run changed.
  [Organise the mailbox](/en/docs/mail/usage#organise-the-mailbox)
- **Attachments.** Their text is searchable; `attachments list` and `attachments download` save the files.
  [Send, reply and forward](/en/docs/mail/usage#send-reply-and-forward)
- **Drafts, send, reply and forward.** [Drafts](/en/docs/mail/usage#drafts) ·
  [Send, reply and forward](/en/docs/mail/usage#send-reply-and-forward)
- **Tags, export and counts.** Your own tags stay on your computer. `messages export` writes mbox or Maildir files;
  `stats` counts mail by day, week or sender and ranks senders, lists and domains. [Your own tags](/en/docs/mail/usage#your-own-tags) · [Export mail](/en/docs/mail/usage#export-mail)
- **Let an agent triage new mail.** With [Memo](/en/docs/memo/mail), a scheduled `mail-triage` agent reads new mail and
  proposes tasks, facts and updates for you to confirm. It proposes only: it never sends mail or changes your mailbox.

## Start here

### Connect through your agent

Follow [the guide for your agent](/en/docs/agents), then open the [Mail installation guide](/en/docs/mail/installation).
Your agent installs the tool; you make the app password or approve the Microsoft sign-in.

### Start in a terminal

1. [Install `mail`](/en/docs/mail/installation) from npm.
2. [Prepare the mailbox](/en/docs/mail/providers): turn on IMAP and make an app password. For Outlook or Microsoft 365,
   [connect Outlook](/en/docs/mail/outlook) instead.
3. Create a profile, check the login, read your mail and search it. `ya` is a profile name you choose for one mailbox.

```sh
mail ya session start --address me@example.com
mail ya account check
mail ya sync
mail ya search messages invoice
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
| Prepare Gmail, Yandex, iCloud, Mail.ru, Fastmail or another server | [Prepare the mailbox](/en/docs/mail/providers) |
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
