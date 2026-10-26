---
title: "Zoom — start here"
description: "Keep transcripts, recordings and meeting context available to your AI agent."
---

Keep meeting passages available to your AI agent so it can recover decisions, check promises and prepare for a call with sources. The Zoom command-line tool runs on your computer as `zm`; it reads available hosted data or imports transcript files.

## Choose your starting point

| Your situation | Next step |
|---|---|
| First time connecting Zoom | [Install with your agent or by hand](./installation.md) |
| You already created an app | [Find its Public Client ID](./zoom-app.md#use-an-app-you-already-created), then [finish login](./installation.md#first-run) |
| You have downloaded VTT files | [Import them without an app or login](./installation.md#import-without-a-zoom-app) |
| Meetings are already saved | [Find a passage](./search.md); no reinstall is needed |

## What you can do

- Read available hosted meetings, participant sessions, transcripts and Zoom summaries.
- Import downloaded transcript files and keep corrected versions with their history.
- Archive available audio, video and transcript assets, verify them and resume supported downloads.
- Search passages by words or configured search by meaning, then combine them with notes and project context.
- Read upcoming meetings and invitations; preview simple meeting changes before applying them.

API access uses the configured Zoom app and the permissions you grant. Transcripts must be available
for your account; meetings you attended can be imported from downloaded files.

## Connect your data

Start with [install and connect](./installation.md). Its steps cover using an app you already created, a custom app your team authorizes, or creating your own. You need its Public Client ID and browser consent, not a credentials file. For files only, [import VTT transcripts](./archive.md#downloaded-transcripts) without a Zoom app.

After storing a first meeting, [connect your agent](./mcp.md) through a terminal skill or MCP tools whose reads and writes are controlled by profile permissions. The connection does not retrieve data by itself.

## Choose your next task

- [Search and read meeting evidence](./search.md).
- [Keep cloud recordings and transcripts](./archive.md).
- [Find upcoming Zoom meetings](./remote-meetings.md).
- [Connect meetings to projects, people and other sources](../zoom.mdx).

For exact controls, use [the command reference](./commands.md). If a source is missing or access
fails, follow [troubleshooting](./troubleshooting.md).
