---
title: "Roadmap"
---

This page lists what is planned for `asterisk` and not done yet. Read it before you build a workaround for a missing
feature: it may already be on the way. The order can change, and there are no dates. To suggest something, open an
[issue on GitHub](https://github.com/WireCatLabs/asterisk-cli/issues).

## What works today

`asterisk` reads the call records of an Asterisk PBX from `Master.csv`, or from a MySQL, MariaDB or PostgreSQL CDR
table in a read-only session. It reads the files from this computer, a mounted folder, or the PBX over SFTP with
a pinned server key. It keeps each call in the local WireCat store with its two people, links it to its
recording, and turns recordings into text on your computer. You and your agent list, read and export the calls with
no network, over the command line or MCP. See [connect your Asterisk](./asterisk.md).

## Later

- Find missed calls and calls in one direction with a filter on `meetings list`.
- Call stats: calls per extension and per hour, and the share of missed calls.
- Show the legs of a transferred call together, while each stays its own record.
- Read Asterisk's CEL log, where transfers and queues are exact.

## What it will not do

`asterisk` stays read-only against the PBX. It will not change the PBX settings, place or end calls, or delete a
recording.

What changed in each released version is in the [changelog](./changelog.md).
