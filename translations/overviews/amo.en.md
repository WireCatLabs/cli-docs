---
title: "amoCRM and Kommo: start here"
description: "Copy your own amoCRM or Kommo deals and their clients to your computer, so your AI agent can read them offline and change the CRM within your rules."
---

Keep your amoCRM or Kommo deals within reach of your AI agent. Your deals, their contacts and companies, and the
history of their stages are copied to your computer, so the agent can read them even without the internet. amoCRM and
Kommo have no MCP server of their own for CRM data, so without a tool like this an agent sees your deals only when
you paste them into the chat.

You can ask your agent which deals are stuck in a stage, what moved in the CRM yesterday, or how a pipeline converts
from stage to stage. The agent can also move a deal to its next stage, close it as lost with a reason, or add a
contact, as far as the permissions you set allow.

`amo` is a WireCat command-line tool for amoCRM (amocrm.ru) and Kommo (kommo.com). It keeps the copy in the local
store, one file on your computer that every WireCat tool shares, so a search finds a deal beside your chats, mail and
meetings. To start, an administrator of the account makes one private integration in amoCRM or Kommo.

**On this page:**

1. [What you get](#what-you-get)
2. [Connect and copy your deals](#connect-and-copy-your-deals)
3. [What stays live and what it does not do](#what-stays-live-and-what-it-does-not-do)
4. [Find a guide for your task](#find-a-guide-for-your-task)

## What you get

- **Your deals without the internet.** `sync` copies the deals assigned to you, the pipelines and their stage
  history, and only the contacts and companies on those deals. Deals, pipelines and stages then read from this copy.
  An administrator can add colleagues whose deals are copied too.
- **What changed since yesterday.** See new deals, stage moves, wins and losses, deals given to another owner, and
  tasks added and done. A morning digest can arrive as a desktop notice, or in Telegram or by e-mail through the
  WireCat tools `tg` and `mail`.
- **Tasks and calls on your deals.** Once you turn on the `activities` setting, `sync` also copies the tasks,
  comments and calls on your deals from the last 90 days. A call keeps only its direction, never the phone number or
  the recording.
- **A funnel for each pipeline.** See how many deals stand in each stage, how many reached it and went on, and the
  share won in a period.
- **Changes that follow your rules.** Each action has its own permission: allow, ask, read only or deny. Actions
  that message clients, start a Salesbot or add users are denied until you allow them. A write can be previewed with
  `--dry-run`, and `AMO_READ_ONLY=1` refuses every write.
- **Your agent connected.** Install the tool's skill for a terminal agent such as Claude Code, or serve the tool over
  MCP to an app that connects to MCP servers.

The token stays in your system keyring, or in a private file where there is no keyring, and never appears in output
or logs. `amo` connects only to your own account. Read more in [security](./security.md).

## Connect and copy your deals

1. [Install `amo`](./installation.md#install) from npm.
2. Make the private integration in amoCRM or Kommo, as [create the integration](./installation.md#create-the-integration)
   shows. An account administrator does this once.
3. Sign in with the integration's long-lived token, a key that lets the tool act with the rights of the administrator
   who made it. `work` is a profile: a name you choose for one account. The tool asks for the token hidden.

```sh
amo work session start --host https://example.amocrm.ru
```

To have each person act with their own rights instead, sign in through the integration in the browser, as
[sign in through the integration](./installation.md#sign-in-through-the-integration) shows.

4. Copy your deals and look at the open ones.

```sh
amo work sync
amo work deals list status:open
```

Run `sync` again to bring the copy up to date, or let a timer do it:

```sh
amo work schedule command crm --every 1h -- sync
```

5. Connect your agent. A terminal agent gets the skill:

```sh
amo skill install
```

An MCP app gets the server, as described in [use it](./usage.md#agents).

## What stays live and what it does not do

- **Other clients are read live.** A contact or company that is on none of your deals is never copied. `people` and
  `organizations` find it in amoCRM while you are online.
- **Someone who is not the administrator sees less.** Signed in with their own rights, they read their own deals from
  the copy, and see the phones and e-mails of another user's client at most 100 times a day.
- **No ready commands for tasks and notes.** They are written only through the raw `api call` command at a terminal,
  after you allow their permission. No MCP tool offers `api call`.
- **No deleting deals.** The amoCRM API cannot delete a deal.
- **A slower sync without the API filter add-on.** Without amoCRM's paid add-on, `sync` reads each contact or company
  one request at a time.

## Find a guide for your task

| Task | Guide |
|---|---|
| Install the tool and sign in | [Install and connect](./installation.md) |
| Learn how a command is built and connect an agent | [Use it](./usage.md) |
| Find a command or an option | [Commands](./commands.md) |
| Change a setting or a permission | [Settings](./configuration.md) |
| Fix an error | [When something goes wrong](./troubleshooting.md) |
| Learn what the tool keeps and sends | [Security](./security.md) |
| Compare it with other amoCRM tools | [Compared with other tools](./compare.md) |
