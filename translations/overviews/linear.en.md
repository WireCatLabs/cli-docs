---
title: "Linear: start here"
description: "A Linear CLI and Linear MCP server: copy your issues and projects to your computer, so your AI agent reads them offline and works with the whole Linear API."
---

Let your AI agent read your Linear issues, projects and comments without pasting them into the chat. The `linear`
command-line tool copies your workspace to your computer, so the agent answers from that copy, even without the
internet. When you allow it, the same tool creates and changes issues through the Linear API.

You can ask your agent which issues of a team are still in progress, what was said in the comments of ENG-12, or
which issues nobody has taken. The agent finds them in the local copy and names each issue by its key. An open issue
assigned to you becomes a [task](/en/docs/tasks) in the local store, next to the tasks from your chats.

`linear` is both a Linear CLI for your terminal and a Linear MCP server for apps such as Claude Desktop,
and for ChatGPT through a tunnel you run.
You need a Linear personal API key, which you make once in Linear's settings.

**On this page:**

1. [What you get](#what-you-get)
2. [How it works](#how-it-works)
3. [Make a personal API key](#make-a-personal-api-key)
4. [Connect and copy your workspace](#connect-and-copy-your-workspace)
5. [What it does not do yet](#what-it-does-not-do-yet)
6. [Find a guide for your task](#find-a-guide-for-your-task)

## What you get

- **Issues without the internet.** List issues by team, project, sprint, state, assignee or label, open one with its
  comments, and find issues, projects and comments by their words, or by meaning after `sync --embed`. Sprints are what Linear calls cycles.
- **Your issues become your tasks.** After each sync, every open issue assigned to you is a task, titled with its key
  and title. The task closes when the issue is done, canceled or goes to someone else. `issues assign ENG-12` makes
  any other issue your task too. Nothing is written back to Linear.
- **Issues from the chat.** Create an issue, move it to another state, change its assignee or add a comment, with
  `issues create`, `issues update` and `issues comments create`.
- **Everything else Linear offers.** Archive an issue, link two issues or add an attachment through the `api` group.
  `api list` names every operation.
- **Linear documents too.** The same sync copies the documents of the projects you choose, so your agent reads them
  next to the issues.
- **You decide what the agent may change.** Each profile allows, asks or refuses each kind of write. A delete or an
  archive needs a permission of its own, `WCLINEAR_READ_ONLY=1` refuses every write, and `--dry-run` shows what a
  write would send without sending it. Over MCP nobody is there to answer, so a write set to ask goes ahead.
  Set `permissions.api` to `readonly` to stop that. Read more in [settings](./configuration.md#permissions).
- **Your agent connected.** Install the tool's skill for a terminal agent such as Claude Code or Codex, or serve the
  tool over MCP to an app that connects to MCP servers.

The key stays in your system keyring, or in a private file where there is no keyring. You give it to the tool hidden or
on stdin, never as an argument, so it does not end up in your shell history. Read more in [security](./security.md).

## How it works

- **A copy on your computer.** `linear` keeps your issues, projects, sprints and comments, with their teams, states
  and labels, in the local store, one file on your computer that every WireCat tool shares. Lists and search read this
  copy, not Linear.
- **The copy is yours.** Linear shows each member a different set of teams, so the copy holds what your own key can
  see, and nothing of another person's private teams.
- **A sync brings in changes.** The first sync copies everything. After that it reads only what changed, and once a
  day it notices what was deleted in Linear. An issue you move to Linear's trash leaves the copy at that daily check,
  and comes back if you restore it. Archived issues stay in the copy, marked. A sync with nothing new says so.
- **A profile for each account.** A profile is a name you choose for one Linear account, such as `work`. Every command
  that uses an account names it first: `linear work issues show ENG-12`.
- **The whole API as commands.** Each of the 493 queries and mutations of the Linear API is a command of its own in the
  `api` group, with its own options and help. Your agent uses the same commands, at a terminal or over MCP.

## Make a personal API key

In Linear, open [Settings → Account → Security & access](https://linear.app/settings/account/security) and create a
personal API key. Linear lets you give the key full access or only some permissions, such as Read, and limit it to
some teams. A key that can only read is enough to copy and read your workspace. To create or change issues through the
tool, give it Write too. If you do not see the option, an admin of your workspace has turned off API keys for members.
Linear describes the options on its [API and webhooks page](https://linear.app/docs/api-and-webhooks).

## Connect and copy your workspace

1. [Install `linear`](./installation.md) with WireCat Desktop or from npm. In Desktop you sign in with the key in its
   window. The commands here do the same in a terminal.
2. Sign in. `work` is a profile, a name you choose for one Linear account. The tool asks for the key hidden and checks
   it with Linear before it keeps it.

```sh
linear work session start
```

3. Copy your workspace, then look at the issues that are in progress.

```sh
linear work sync
linear work issues list type:started
linear work issues show ENG-12
linear work issues search invoice currency
```

`issues search` finds the issues that have every word, in any order. Words in quotes are matched as one phrase.
Run `sync` again later to bring in what changed.

4. Connect your agent. A terminal agent gets the skill:

```sh
linear skill install
```

An app that connects to MCP servers gets the server, as described in [use it](./usage.md#agents).

## What it does not do yet

- It signs in only with a personal API key, not through the browser.

## Find a guide for your task

| Task | Guide |
|---|---|
| Install or update the tool | [Install](./installation.md) |
| Learn how a command is built and connect an agent | [Use it](./usage.md) |
| Find a command or an option | [Commands](./commands.md) |
| Change a setting or a permission | [Settings](./configuration.md) |
| Fix an error | [When something goes wrong](./troubleshooting.md) |
| Learn what the tool keeps and sends | [Security](./security.md) |
| Compare it with other Linear tools | [Compared with other tools](./compare.md) |
