---
title: "Roadmap"
---

This page lists what `linear` does today and what it does not do yet. Read it before you build a workaround for a
missing feature. There are no dates. To ask for something, open an
[issue on GitHub](https://github.com/WireCatLabs/linear-cli/issues).

## What works today

`linear` signs in with your Linear personal API key and copies your issues, projects and comments, with their teams,
states and labels, into the local store on your computer. You and your agent list issues by team, state, assignee or
label, open one with its comments and find issues by their words, with no network. `issues assign` turns an issue into
your own task. Every query and mutation of the Linear API is a command in the `api` group, within the permissions you
set, over the command line or MCP. See [start here](./index.md).

## Not there yet

- WireCat's shared search does not read Linear issues. Today `issues search` finds them on their own.
- Sign-in through the browser. Today you sign in with a personal API key.
- Short commands to create, update or comment on an issue. Today these go through the `api` group.

What changed in each released version is in the [changelog](./changelog.md).
