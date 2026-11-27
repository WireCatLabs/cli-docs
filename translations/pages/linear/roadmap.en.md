---
title: "Roadmap"
---

See what `linear` already does for you and what it does not do yet, before you build a workaround for a missing
feature. There are no dates. To ask for something, open an
[issue on GitHub](https://github.com/WireCatLabs/linear-cli/issues).

## What works today

`linear` signs in with your Linear personal API key and copies your issues, projects, sprints (what Linear calls
cycles) and comments, with their teams, states and labels, into the local store on your computer. The same sync copies
the documents of the projects you choose. You and your agent list issues by team, sprint, state, assignee or label,
open one with its comments and find issues by their words, or by meaning after `sync --embed`, with no network. Open issues assigned to you become your
tasks. `issues create`, `issues update` and `issues comments create` change issues in Linear, and every other query
and mutation of the Linear API is a command in the `api` group, within the permissions you set, over the command line
or MCP. See [start here](./index.md).

## Not there yet

- Sign-in through the browser. Today you sign in with a personal API key.

What changed in each released version is in the [changelog](./changelog.md).
