---
title: "Notion: start here"
description: "Copy your Notion pages and databases to your computer, so your AI agent can search them offline and use them as context."
---

Your plans, meeting notes and project databases live in Notion, and an AI agent on your computer cannot read them
unless you paste them into the chat. The `notion` command-line tool copies the pages you choose to your computer, so
your agent can search them and use them as context, even without the internet.

You can ask your agent for the page where a decision was written down, the rows of a project database, or what a
spec says about a feature. The agent finds the page in the local copy and gives you its Notion link.

`notion` keeps the copy in the local store, one file on your computer that every WireCat tool shares. Your chats,
mail and meetings are there too, so [Memo](/en/docs/memo) can find a Notion page together with the conversation
about it. To start, you need a Notion
token: a key that lets the tool read your workspace.

**On this page:**

1. [What you get](#what-you-get)
2. [Get a Notion token](#get-a-notion-token)
3. [Connect and copy your pages](#connect-and-copy-your-pages)
4. [What it does not do yet](#what-it-does-not-do-yet)
5. [Find a guide for your task](#find-a-guide-for-your-task)

## What you get

- **Search without the internet.** Find a page by its words, in any of their forms, and by meaning once the copy is
  indexed for it.
- **Only the pages you choose.** With no choice made, the tool copies everything the token can see. You can narrow
  that to a few pages or databases, and everything under them.
- **Database rows as pages.** Each row of a database is copied like a page, with its Notion link.
- **Your own notes on a page.** Add tags, notes and facts to a page. They stay on your computer and never reach
  Notion.
- **Live reading when you need it.** Read one page from Notion as Markdown, or list the databases the token sees,
  without copying anything.
- **Your agent connected.** Install the tool's skill for a terminal agent such as Claude Code, or serve the tool over
  MCP to an app that connects to MCP servers.

The token stays in your system keyring, or in a private file where there is no keyring. `notion` connects only to
Notion's own API. Read more in [access and security](./security.md).

## Get a Notion token

A token decides what the tool can see. Notion offers two kinds:

- A [personal access token](https://developers.notion.com/guides/connections-and-tokens/personal-access-tokens)
  acts with your own rights and sees what you see.
- An internal connection's token sees only the pages you share with that connection in Notion. Choose it when you
  want to give the tool a few pages and nothing else.

## Connect and copy your pages

1. [Install `notion`](./installation.md) from npm.
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
- It has no ready commands to write to Notion yet. The raw `api` commands can create and change pages, and they are
  allowed by default. `WCNOTION_READ_ONLY=1` or the [`permissions` setting](./configuration.md#permissions) turns
  them off.
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
