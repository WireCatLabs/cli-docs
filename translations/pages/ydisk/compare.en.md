---
title: "Compared with other tools"
---

Pick a tool for your Yandex Disk by the job you want done: find a document by what it says, back up whole folders,
or let an AI agent work with your files. This page lists those jobs and shows which tool does each one. Marks for
`ydisk` come from version 0.1.0, and marks for the other tools come from their own documentation and source. Everything
was checked on 17 November 2026. A tool may do more than its pages say, and those cells are ➖.

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation · n/a does not apply

The tools:

- **ydisk**: this tool. A command line and an MCP server that copy the text of the Disk folders you choose to your
  computer for search, and work with the files on the Disk live.
- **[Yandex Disk MCP](https://yandex.ru/dev/yandex-360/mcp/ru/disk)**: Yandex's own MCP server, run by Yandex. Your
  AI app connects to it over the internet. It is a preview, for accounts with a paid Yandex 360 subscription.
- **[rclone](https://rclone.org/yandex/)**: a command line that copies, syncs and mounts files between your computer
  and Yandex Disk or many other storage services.
- **[Yandex Disk for Linux](https://yandex.ru/support/disk-desktop-linux/cli-commands.html)**: Yandex's official
  console client. It keeps a folder on your computer in sync with the Disk.
- **[yandex-disk-mcp](https://github.com/gorokhovdenis/yandex-disk-mcp)**: an open-source MCP server you run on your
  computer with your own token, built for large uploads and downloads.

Not in the table: the [yadisk](https://github.com/ivknv/yadisk) Python library, for people who write their own
scripts, and [yandex-workspace-mcp](https://github.com/denis-samatov/yandex-workspace-mcp), a new MCP server for Disk
and Wiki that is read-only by default and whose README says it has not been checked against a live account yet.

Other small Yandex Disk MCP servers exist, such as [Patr56/yadisk-mcp](https://github.com/Patr56/yadisk-mcp) and
[Antiloop-git/yandex-disk-mcp](https://github.com/Antiloop-git/yandex-disk-mcp). The command line
[ydcmd](https://github.com/abbat/ydcmd) lists, uploads and syncs files, and an
[open issue](https://github.com/abbat/ydcmd/issues/59) reports that it stopped working. The official MCP Registry
listed no Yandex Disk server on 17 November 2026.

## What each tool does

| Job | ydisk | Yandex Disk MCP | rclone | Yandex Disk for Linux | yandex-disk-mcp |
|---|:-:|:-:|:-:|:-:|:-:|
| **Find a document** | | | | | |
| Find a document by words inside it | ✅ | ✅ | ❌ | ❌ | ❌ |
| Find a document by meaning, not only by its words | ✅ | ➖ | ❌ | ❌ | ❌ |
| Search your documents with no internet | ✅ | ❌ | 🟡¹ | 🟡¹ | ❌ |
| Find a document together with your chats, mail and notes from other services | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Read a file** | | | | | |
| An agent reads the text of a PDF, Word or Excel file | ✅ | 🟡² | ❌ | ❌ | 🟡² |
| **Work with files on the Disk** | | | | | |
| Upload, copy and move files | ✅ | ✅ | ✅ | 🟡³ | ✅ |
| Delete to the trash and bring a file back | ✅ | 🟡⁴ | 🟡⁴ | ➖ | 🟡⁴ |
| Make and close a public link | ✅ | ✅ | ✅ | ✅ | ❌ |
| Keep a copy of the files themselves on your computer | 🟡⁵ | ❌ | ✅ | ✅ | 🟡⁶ |
| Keep your own tags and notes on documents | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Agents and safety** | | | | | |
| An AI app works with your Disk through MCP | ✅ | ✅ | ❌ | ❌ | ✅ |
| An agent with a terminal runs it, with JSON output and a skill | ✅ | n/a | 🟡⁷ | ❌ | n/a |
| An agent reads only, until you allow changes | ✅ | ➖ | ➖ | n/a | ➖ |
| Allow or refuse deletes and public links separately | ✅ | 🟡⁸ | ➖ | n/a | ➖ |
| See what a change would do before it is made | ✅ | ➖ | ✅ | ➖ | ➖ |
| Use it from Claude or ChatGPT in the browser | ✅ | ➖ | ❌ | ❌ | ❌ |
| **Setup** | | | | | |
| Works with a free Yandex account | ✅ | ❌ | ✅ | ✅ | ✅ |
| Sign in without registering your own Yandex app | ❌ | ✅ | ✅⁹ | ✅ | ❌ |

¹ Both keep the files themselves in a folder on your computer, so your system's own search finds them. Neither has a
search of its own.

² It gives the agent a download link or saves the file, and the agent then has to read the file itself.

³ It syncs a folder: you move files in that folder and the client sends the change.

⁴ A delete goes to the trash, but there is no command to bring a file back.

⁵ `ydisk` keeps the text of PDF, Word, Excel, CSV and text files, not the files. `files download --output` saves one
file.

⁶ It downloads a file or a folder when asked, but it does not keep the copy in sync.

⁷ `rclone lsjson` and other commands answer in JSON, but there is no skill for agents.

⁸ By default the agent asks you before each change, including deletes and public links.

⁹ rclone signs in through its own Yandex app. In October 2026 users reported errors that went away with their own
app ([issue 10067](https://github.com/rclone/rclone/issues/10067)).

## Where another tool fits better

- **Backing up or mirroring whole folders, photos and videos included**: rclone or Yandex Disk for Linux. They copy
  the files themselves and keep them in sync. `ydisk` keeps text for search.
- **No install and no app to register, and you already pay for Yandex 360**: Yandex Disk MCP. Your AI app connects
  to Yandex's server with a ready sign-in link.
- **Uploading videos or folders of many gigabytes from an agent**: yandex-disk-mcp. It runs long uploads in the
  background, resumes them and checks each file's MD5.
- **Your own Python program**: the yadisk library, which covers the whole Disk API.

## Compared with an agent driving the Disk web page

A browser agent opens disk.yandex.ru and clicks. `ydisk` and the other tools here call Yandex's API. This page makes
no claim about which is faster, cheaper or more reliable, because there is no published measurement.

## Install and licence

| | ydisk | Yandex Disk MCP | rclone | Yandex Disk for Linux | yandex-disk-mcp |
|---|---|---|---|---|---|
| Install | npm, Node 22.16 or a later 22.x, or Node 24 or later | nothing: your AI app connects to Yandex's server | one binary, most package managers | deb and rpm packages | npm |
| Platforms | macOS, Linux, Windows | any MCP app with HTTP | macOS, Linux, Windows and more | Linux | where Node.js runs |
| Licence | Apache-2.0 | Yandex service, paid Yandex 360 subscription | MIT | Yandex licence | MIT |
| Sign-in | a token from your own Yandex app, kept in the system keyring | a token from Yandex's ready link | rclone's own app in the browser, or yours | a code entered in the browser | a token from your own Yandex app, in the MCP settings |

If `ydisk` fits, start with [installation](./installation.md).

## How each mark was checked

`ydisk` marks were checked on the published 0.1.0 package with an empty home folder and no sign-in: `ydisk commands`,
each command's `--help`, and `--dry-run` on each change to read the permission it checks. Search by meaning needs a
text model downloaded once, and the browser connection needs your own tunnel.

Other tools' marks come from their own pages. A search that finds nothing in those pages gives ➖, never ❌, except
where a tool's list of commands or tools is complete.

- **Yandex Disk MCP** ([Disk server](https://yandex.ru/dev/yandex-360/mcp/ru/disk),
  [who can use it](https://yandex.ru/dev/yandex-360/mcp/ru/)). Its full tool list: `disk.search_items` finds files
  "by name, content, type and date". `disk.get_download_url` gives a link, and no tool reads a file's text.
  `disk.delete_item` moves to the trash and `disk.list_trash_items` lists it, with no restore. `disk.create_public_link`
  and `disk.update_public_item_permissions` for links. Access: "personal accounts with an active paid Yandex 360
  subscription". The agent asks before a change "by default". The page shows set-up for Codex and Claude Code, not
  for browser apps, so that row is ➖. It runs on Yandex's servers, so nothing is searched offline.
- **rclone** ([Yandex page](https://rclone.org/yandex/), [commands](https://rclone.org/commands/)). No command
  searches inside files. It has `copy`, `move`, `sync` and `mount`. `rclone link` makes a public link. `delete` goes to the
  trash unless `--yandex-hard-delete`, and `cleanup` empties it, with no restore. `--dry-run` on every change. No MCP
  command. The sign-in uses rclone's own client unless you set `client_id`.
- **Yandex Disk for Linux** ([console commands](https://yandex.ru/support/disk-desktop-linux/cli-commands.html)).
  Its full command list: `start`, `stop`, `status`, `sync`, `publish`, `unpublish`, `token` and set-up options. No
  search, move, delete or trash command, and changes are made in the synced folder.
- **yandex-disk-mcp** ([README](https://github.com/gorokhovdenis/yandex-disk-mcp/blob/main/README.md)). Its full
  tool list: info, list, metadata, compare, create folder, upload, download, delete, copy, move, last uploaded. No
  search and no public link tool. `yandex_disk_delete` moves to the trash unless `permanently`, with no restore.
  Runs over stdio with the token in its settings.
