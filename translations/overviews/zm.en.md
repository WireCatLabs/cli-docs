---
title: "Zoom"
description: "Keep transcripts, recordings and meeting context available to your AI agent."
---

Zoom meetings can become searchable context for your agent: recover a decision, check a promise
or prepare for the next call with references to the original passages. The tool runs on your
computer as `zm` and stores the meeting information locally.

## What you can do

- Read available hosted meetings, participant sessions, transcripts and Zoom summaries.
- Import downloaded transcript files and keep corrected versions with their history.
- Archive available audio, video and transcript assets, verify them and resume supported downloads.
- Search passages by words or configured search by meaning, then combine them with notes and project context.
- Read upcoming meetings and invitations; preview simple meeting changes before applying them.

API access uses your own Zoom app and the permissions you grant. Transcripts must be available
for your account; meetings you attended can be imported from downloaded files.

## Start with your data

[Install the tool](./installation.md), [create your Zoom app](./zoom-app.md), then
[log in and select a local profile](./sessions.md). You can also start with transcript files:
[importing and archiving meetings](./archive.md) explains their naming and time-zone requirements.

Give a terminal agent the tool's [skill](./mcp.md), or connect its read-only MCP server to your
AI app. MCP is the connection that lets an app call the tool; discovery alone does not import meetings.

## Choose your next task

- [Search and read meeting evidence](./search.md).
- [Keep cloud recordings and transcripts](./archive.md).
- [Find upcoming Zoom meetings](./remote-meetings.md).
- [Connect meetings to projects, people and other sources](../zoom.mdx).

For exact controls, use [the command reference](./commands.md). If a source is missing or access
fails, follow [troubleshooting](./troubleshooting.md).
