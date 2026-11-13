---
title: "Roadmap"
---

This page lists what is planned for `asterisk` and not done yet. Read it before you build a workaround for a missing
feature: it may already be on the way. The order can change, and there are no dates. To suggest something, open an
[issue on GitHub](https://github.com/WireCatLabs/asterisk-cli/issues).

## What works today

`asterisk` reads the call records of an Asterisk PBX from `Master.csv`, or from a MySQL, MariaDB or PostgreSQL CDR
table in a read-only session. It keeps each call in the local WireCat store with its two people, links it to its
recording, and turns recordings into text on your computer. You and your agent list, read and export the calls with
no network, over the command line or MCP. See [connect your Asterisk](./asterisk.md).

## Next

- **Read the PBX over SFTP.** `asterisk` reads `Master.csv` and the recordings straight from the PBX over SFTP, with a
  read-only user, so you no longer copy the files or mount the folders yourself.

## What it will not do

`asterisk` stays read-only against the PBX. It will not change the PBX settings, place or end calls, or delete a
recording.

What changed in each released version is in the [changelog](./changelog.md).
