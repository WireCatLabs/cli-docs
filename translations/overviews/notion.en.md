---
title: "Notion: start here"
description: "Copy your Notion pages and databases to your computer, so your AI agent can search them offline and use them as context."
---

Ask your AI agent about anything you wrote in Notion and get the answer with a link to the page. Plans, meeting
notes and project databases stay in Notion, where an agent on your computer cannot read them unless you paste them
into the chat. The `notion` command-line tool copies the pages you choose to your computer, so your agent searches
them and uses them as context, even without the internet.

Your agent tells you on which page a decision was written down, which rows a project database holds, or what a spec
says about a feature, and gives you the page's Notion link. When you allow it, the agent also writes pages and
comments in Notion.

You install `notion` with [WireCat Desktop](/en/docs/desktop) or from npm. It needs one Notion token, a key that
decides which pages the tool can see. [Get a Notion token](#get-a-notion-token) explains the two kinds.

**On this page:**

1. [What you get](#what-you-get)
2. [How it works](#how-it-works)
3. [Get a Notion token](#get-a-notion-token)
4. [Connect and copy your pages](#connect-and-copy-your-pages)
5. [What it does not do yet](#what-it-does-not-do-yet)
6. [Find a guide for your task](#find-a-guide-for-your-task)

## What you get

- **Search without the internet.** Find a page by its words, in any of their forms, and by meaning once the copy is
  indexed for it.
- **Only the pages you choose.** With no choice made, the tool copies everything the token can see. You can narrow
  that to a few pages or databases, and everything under them.
- **Database rows as pages.** Each row of a database is copied like a page, with its Notion link.
- **Your own notes on a page.** Add tags, notes and facts to a page. They stay on your computer and never reach
  Notion.
- **Writing to Notion.** Create, change and restore pages, add comments and upload files. Deleting a page
  asks first in a terminal, and runs without asking over MCP. `WCNOTION_READ_ONLY=1` or the [`permissions` setting](./configuration.md#permissions) turns writing off.
- **Live reading when you need it.** Read one page from Notion as Markdown, or list the databases the token sees,
  without copying anything.
- **Your agent connected.** Install the tool's skill for a terminal agent such as Claude Code, or serve the tool over
  MCP to an app that connects to MCP servers.

The token stays in your system keyring, or in a private file where there is no keyring. `notion` connects only to
Notion's own API. Read more in [access and security](./security.md).

## How it works

- **A copy on your computer.** `notion` keeps the pages in the local store, one file on your computer that every
  WireCat tool shares. Search reads this copy, not Notion. Your chats, mail and meetings are there too, so
  [Memo](/en/docs/memo) can find a Notion page together with the conversation about it.
- **A token instead of a password.** A Notion token is a key that lets the tool read your workspace. It decides what
  the tool can see, so you can give it the whole workspace or only a few pages.
- **A profile for each workspace.** A profile is a name you choose for one Notion account, such as `personal`. Every
  command that uses an account names it first: `notion personal search "quarterly plan"`.
- **A sync brings in changes.** The copy is as fresh as the last sync. Run it again to bring in what changed in
  Notion.
- **Your agent uses the same commands.** A terminal agent runs `notion` for you, and an app that connects to MCP
  servers gets the same commands over MCP.

## Get a Notion token

A token decides what the tool can see. Notion offers two kinds:

- A [personal access token](https://developers.notion.com/guides/connections-and-tokens/personal-access-tokens)
  acts with your own rights and sees what you see.
- An internal connection's token sees only the pages you share with that connection in Notion. Choose it when you
  want to give the tool a few pages and nothing else.

[Make a Notion token](./installation.md#make-a-notion-token) has the steps in Notion for each kind.

## Connect and copy your pages

1. [Install `notion`](./installation.md) with WireCat Desktop or from npm. In Desktop you sign in and choose the pages
   in its window. The commands here do the same in a terminal.
2. Sign in. `personal` is a profile: a name you choose for one Notion account. The tool asks for the token hidden.

```sh
notion personal session start
```

3. Choose what to copy, or skip this step to copy everything the token sees. `folders browse` lists the top of the
   workspace, one level at a time.

```sh
notion personal folders browse
notion personal folders add https://www.notion.so/Team-plans-1a2b3c4d5e6f47a8b9c0d1e2f3a4b5c6
```

4. Copy the pages and search them.

```sh
notion personal sync
notion personal search "quarterly plan"
```

One sync walks up to about 10,000 entries and saves where it stopped. Run it again to go on, and later to bring in
what changed. `notion personal status` shows how far it got.

5. Connect your agent. A terminal agent gets the skill:

```sh
notion skill install
```

An MCP app gets the server, as described in [use it](./usage.md#agents).

## What it does not do yet

- It does not search database rows by their properties, such as status or owner. Search finds rows by their text.
- It does not keep a folder of Markdown files in step with a Notion page tree.

## Find a guide for your task

| Task | Guide |
|---|---|
| Install or update the tool | [Install](./installation.md) |
| Learn how a command is built and connect an agent | [Use it](./usage.md) |
| Find a command or an option | [Commands](./commands.md) |
| Change a setting or a permission | [Settings](./configuration.md) |
| Fix an error | [When something goes wrong](./troubleshooting.md) |
| Learn what the tool keeps and sends | [Access and security](./security.md) |
| Compare it with other Notion tools | [Compared with other tools](./compare.md) |
