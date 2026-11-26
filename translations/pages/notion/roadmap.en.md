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
over the command line or MCP. You also write pages with `documents create`, `documents update`, `documents delete`
and `documents restore`, read and answer comments with `comments list`, `comments create` and `comments reply`, and add
a file to a page with `files upload`. `mirrors` keeps a folder of Markdown files and the pages under one Notion
page the same, both ways. See [start here](./index.md).

## Next

- Find database rows by a property, such as `status:Done`. Today search finds a row by its text only.

## Later

- Sign in through the browser, with your own Notion connection, instead of pasting a token.

What changed in each released version is in the [changelog](./changelog.md).
