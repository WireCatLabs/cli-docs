---
title: "WireCat Desktop 0.2: see what your agent remembers"
description: The desktop app now has Search, Memory, Tasks and Guides pages, so you can look at what your tools stored and what your agents saved without opening a terminal.
date: 2026-11-01
tags: [ai-agents, release-notes]
author: viacheslav-ptsarev
draft: false
---

When I started WireCat it was only command-line tools. That works well if you live in a terminal, and it works
well for agents. But a lot of people I showed it to got stuck at `npm install -g` and never saw the good part.

So a few days ago I put out a small desktop app. It installs the WireCat tools, signs you in, and connects them to
the agent you already use: Claude Code, Codex, Cursor, Gemini CLI, OpenCode, Hermes or OpenClaw. You don't need
Node.js to start it. If the tools need Node.js and you don't have it, the app sets up its own copy in your user
folder.

Version 0.1 stopped there. You set everything up, saw green lights, and then had to go back to the terminal or ask
your agent to find out what was actually inside. Today's 0.2.0 fixes that.

## What's new

**Search.** Pick a tool and an account and search what it stored: messages, meetings, notes, documents, mail. It
runs the tool's own search, so you get the same results your agent gets.

**Memory.** This is the one I wanted most. When an agent works with Memo, it saves what it learned about you and the
people around you, and it suggests things to do. Until now you could only review that in a terminal. Now there's a
page for it, grouped by person or project. You can confirm what's right and forget what's wrong. When you confirm a
suggested action, it becomes a task. Nothing gets sent anywhere.

**Tasks.** Your Memo projects and their tasks, as a table or as a board with five columns. You can drag tasks
between columns, change them in place, and see who changed what, you or an agent.

**Guides.** After setup the obvious question is "ok, what do I ask now?" The Guides page has ready requests you can
paste into your agent. Each one uses a few tools together, like planning your day or your week from what
your chats, mail and calendar already hold.

There are smaller things too. A bell shows news from WireCat, mostly security updates, and it checks only once an
hour. A Privacy panel under the ? menu says plainly what stays on your computer and what leaves it. And buttons
that can't work yet now tell you what's missing instead of just doing nothing.

## Still local

Same rule as the tools. Your data stays on your computer. The app has no account and no server of its own for your
data, and it never asks for administrator rights. Updates are signed and the app checks the signature before it
installs one.

## Get it

Download it from [wirecat.dev/download](/en/download) for macOS, Windows or Linux. If you already have 0.1, the app
will offer the update itself.

It's early, and some pages still have rough edges. Adding to memory by hand is the next thing I'm working on. If
something breaks or feels wrong, tell me on [Discord](https://discord.gg/DebENqbRrJ) or open an issue on
[GitHub](https://github.com/WireCatLabs/wirecat-desktop/issues). I read all of it.
