---
title: "Roadmap"
---

This page lists what is planned for `notion` and not done yet. Read it before you build a workaround for a missing
feature: it may already be on the way. The order can change, and there are no dates. To suggest something, open an
[issue on GitHub](https://github.com/WireCatLabs/notion-cli/issues).

## What works today

`notion` signs in with your own Notion token and reads one page live as Markdown. It copies the pages and databases
you choose, with the pages under them and the database rows, into the local store on your computer. You and your agent
search that copy by words and by meaning with no network, read and export its pages, and add your own tags and notes,
over the command line or MCP. See [start here](./index.md).

## Next

- Find database rows by a property, such as `status:Done`. Today search finds a row by its text only.
- Write pages with ready commands: `documents create`, `update`, `delete` and `restore`. Today only the raw `api`
  commands write.

## Later

- Keep a folder of Markdown files on your computer in step with a Notion page tree, both ways.
- Comments and files as ready commands. Today `api list-comments` and `api retrieve-comment` read comments.
- Sign in through the browser, with your own Notion connection, instead of pasting a token.

What changed in each released version is in the [changelog](./changelog.md).
