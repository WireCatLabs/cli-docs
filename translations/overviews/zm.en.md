---
title: "Zoom"
description: "Keep transcripts, recordings and meeting context available to your AI agent."
---

Keep meeting passages available to your AI agent so it can recover decisions, check promises and prepare for a call with sources. The Zoom command-line tool runs on your computer as `zm`; it reads available hosted data or imports transcript files.

## What you can do

- Read available hosted meetings, participant sessions, transcripts and Zoom summaries.
- Import downloaded transcript files and keep corrected versions with their history.
- Archive available audio, video and transcript assets, verify them and resume supported downloads.
- Search passages by words or configured search by meaning, then combine them with notes and project context.
- Read upcoming meetings and invitations; preview simple meeting changes before applying them.

API access uses the configured Zoom app and the permissions you grant. Transcripts must be available
for your account; meetings you attended can be imported from downloaded files.

## Connect your data

Start with [install and connect](./installation.md). Its steps cover using an app you already created, a WireCat/team app available to your Zoom user, or creating your own. You need its Public Client ID and browser consent, not a credentials file. For files only, [import VTT transcripts](./archive.md#downloaded-transcripts) without a Zoom app.

After storing a first meeting, [connect your agent](./mcp.md) through a terminal skill or read-only MCP tools. The connection does not retrieve data by itself.

## Choose your next task

- [Search and read meeting evidence](./search.md).
- [Keep cloud recordings and transcripts](./archive.md).
- [Find upcoming Zoom meetings](./remote-meetings.md).
- [Connect meetings to projects, people and other sources](../zoom.mdx).

For exact controls, use [the command reference](./commands.md). If a source is missing or access
fails, follow [troubleshooting](./troubleshooting.md).
