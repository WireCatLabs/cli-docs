---
title: "Zoom: start here"
description: "Know what you agreed before the next call. Your agent searches your Zoom transcripts on your computer and quotes the exact passage."
---

You know the context before the call, and remember the commitments after it. `zm` keeps your Zoom meetings, transcripts
and Zoom's AI summaries on your computer, and gives them to the AI agent you already use, such as Claude Code or
Codex.

Before a call your agent tells you what you agreed with Bob last time and what you owe him. After it, the agent finds
what you promised. Each answer points to the exact lines of the transcript, so you can open them and check.

**On this page:**

1. [What you get](#what-you-get)
2. [Things a newcomer would not guess](#things-a-newcomer-would-not-guess)
3. [How it looks](#how-it-looks)
4. [Why zm](#why-zm)
5. [What it can do](#what-it-can-do)
6. [How it works](#how-it-works)
7. [Start](#start)
8. [Limits](#limits)
9. [Find a guide for your task](#find-a-guide-for-your-task)

## What you get

- **Prepared for every call.** Your next meeting with someone, and what you discussed with them last time, in one
  answer.
- **Promises you can find.** The agent points to the line where you promised something, and previews the follow-up
  task it would make from it.
- **Every answer with its source.** A reference opens the exact passage, and it still works after a transcript is
  corrected.
- **Search in your words.** Find a meeting by a word in its other forms, in English, Russian or Spanish, or by what it
  was about.
- **The whole archive kept.** Download the video, audio, transcripts and chat of your cloud recordings to your own
  disk, each file checked.
- **Meetings beside your chats.** One search covers your meetings, messages, mail and notes from the other WireCat
  tools.

## Things a newcomer would not guess

- **Zoom asks for an app first.** Every `zm` user uses a Zoom app from the Zoom App Marketplace: one you made, or one
  your team made for you. `zm` needs its Public Client ID, not a secret. [Your Zoom app](./zoom-app.md)
- **No app is needed for files.** Downloaded transcript files import without an app or a sign-in.
- **Zoom gives transcripts of meetings you hosted.** For a meeting you only attended, download the transcript from
  Zoom and import it.
- **`zm` makes no summary of its own.** It reads Zoom's summary, and your agent writes one from the transcript.

## How it looks

```text
You:    I have a call with Bob Sample at three. What did we agree last time, and what do I owe him?
Agent:  (runs zm personal meetings people "Bob Sample", then zm personal search meetings "quote")
        You last spoke on 2 October in "Pricing review". You promised Bob a revised quote by Friday
        (meeting:1/42/57/118). He asked whether the annual plan includes onboarding (meeting:1/42/57/131).
You:    Move today's call to four.
Agent:  (runs zm personal meetings update 85012345678 --start-time 2026-10-09T16:00:00+02:00 --dry-run)
        "Pricing review" moves from 15:00 to 16:00 today. Change it in Zoom?
You:    Yes.
```

## Why zm

- **What other Zoom tools on the [comparison](./compare.md) do not document:** word forms in three languages, a
  reference to the exact lines that survives a corrected transcript, saved searches, the meetings with a person by name
  or email, and a preview before a meeting is changed.
- **Your meetings stay on your computer.** Saved transcripts can be read and searched offline, without signing in.
- **Your own Zoom app, your own rules.** Tokens live in your system keyring. Each profile allows or denies single
  commands, and a change to Zoom asks first at the terminal.
- **Free and open source.** Apache 2.0.

Another tool fits better when you want an AI app to ask Zoom about meetings, Team Chat and Zoom Docs with nothing to
install (Zoom's own MCP server), or you administer users and webinars
([rvben's zoom-cli](https://github.com/rvben/zoom-cli)).

## What it can do

- **Bring meetings in:** sync hosted meetings from Zoom, or import transcript files. [Archive](./archive.md)
- **Read and search:** transcripts, summaries, passages with their context, the meetings with one person.
  [Search](./search.md)
- **Follow up:** cite a passage and preview a follow-up task. [Usage](./usage.md)
- **Keep recordings:** download, verify and resume, on a daily schedule on Linux. [Archive](./archive.md)
- **Transcribe a recording** on your computer with a speech model you download. [Usage](./usage.md)
- **Change a meeting in Zoom:** create, move or cancel it, and preview the change before you make it.
  [Manage meetings](./meeting-management.md)

## How it works

- **A copy on your computer.** Meetings, transcripts and summaries sit in the local store that the other WireCat tools
  share. Reading and search answer from it. [Archive](./archive.md)
- **Sign-in in your browser.** You approve your Zoom app once in the browser. The token stays in the system keyring.
- **Sync on your terms.** `meetings sync` fetches new meetings, and the next run goes on where the last one stopped.
- **What is stored and what goes over the network.** [Security](./security.md)

## Start

Paste this into your agent:

```text prompt
Use zm CLI. Install it with npm install -g @wirecat/zoom-cli, help me connect my Zoom app, sync my meetings from the last week, and tell me what I promised in them.
```

Or in a terminal, install it first:

```sh
npm install -g @wirecat/zoom-cli
```

Then set your app's Public Client ID and sign in, as [First run](./installation.md#first-run) shows. After that:

```sh
zm personal meetings sync --lookback-days 7    # the last week's meetings
zm personal meetings list                      # what is stored now
```

You need Node.js 22.16 or later on 22.x, or 24 and later. [Install and connect](./installation.md)

## Limits

- Zoom only for now. Google Meet calls are kept by the [Google Calendar tool](/en/docs/google-meet).
- A company Zoom account may need an admin to approve your app.
- The daily archive job installs on Linux only.

## Find a guide for your task

| Task | Guide |
|---|---|
| Install and connect | [Install and connect](./installation.md), [Your Zoom app](./zoom-app.md) |
| Search and read meetings | [Search](./search.md) |
| Keep recordings and transcripts | [Archive](./archive.md) |
| Change a meeting in Zoom | [Manage meetings](./meeting-management.md) |
| Connect an agent over MCP | [MCP](./mcp.md) |
| Meetings with projects and people | [Meetings](./meetings.md) |
| An exact command | [Commands](./commands.md) |
| Something does not work | [Troubleshooting](./troubleshooting.md) |
| How zm differs from other Zoom tools | [Comparison](./compare.md) |
