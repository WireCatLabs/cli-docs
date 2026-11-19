---
title: "Compared with other tools"
---

Pick a tool for your Yandex Disk by the job you want done: find a document by what it says, keep a folder the same on
your computer and on the Disk, back up whole folders, or let an AI agent work with your files. This page lists those
jobs and shows which tool does each one. Marks for `ydisk` come from version 0.3.0, and marks for the other tools come
from their own documentation and source. The `ydisk` marks and the folder sync rows were checked on 19 November 2026,
the rest on 17 November 2026. A tool may do more than its pages say, and those cells are ➖.

**On this page:**

1. [What each tool does](#what-each-tool-does)
2. [Where another tool fits better](#where-another-tool-fits-better)
3. [Compared with an agent driving the Disk web page](#compared-with-a-browser-agent)
4. [Install and licence](#install-and-licence)
5. [How each mark was checked](#how-each-mark-was-checked)

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation · n/a does not apply

The tools:

- **ydisk**: this tool. A command line and an MCP server that copy the text of the Disk folders you choose to your
  computer for search, keep chosen folders the same on your computer and on the Disk, and work with the files on the
  Disk live.
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
and Wiki that is read-only by default and whose README says a passing CI run is not evidence of a completed live check, which is opt-in.

Other small Yandex Disk MCP servers exist, such as [Patr56/yadisk-mcp](https://github.com/Patr56/yadisk-mcp) and
[Antiloop-git/yandex-disk-mcp](https://github.com/Antiloop-git/yandex-disk-mcp). The command line
[ydcmd](https://github.com/abbat/ydcmd) lists, uploads and syncs files, and an
[open issue](https://github.com/abbat/ydcmd/issues/59) reports that it stopped working. The official MCP Registry
listed no Yandex Disk server on 17 November 2026.

<a id="what-each-tool-does"></a>

## What each tool does

| Job | ydisk | Yandex Disk MCP | rclone | Yandex Disk for Linux | yandex-disk-mcp |
|---|:-:|:-:|:-:|:-:|:-:|
| **Find a document** | | | | | |
| Find a document by words inside it | ✅ | ✅ | ❌ | ❌ | ❌ |
| Find a document by meaning, not only by its words | ✅ | ➖ | ❌ | ❌ | ❌ |
| Search your documents with no internet | ✅ | ❌ | 🟡¹ | 🟡¹ | ❌ |
| Find a document together with your chats, mail and notes from other services | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Read a file** | | | | | |
| An agent reads the text of a PDF, Word or Excel file | ✅ | 🟡² | ❌ | ❌ | 🟡³ |
| **Work with files on the Disk** | | | | | |
| Upload, copy and move files | ✅ | ✅ | ✅ | 🟡⁴ | ✅ |
| Delete to the trash and bring a file back | ✅ | 🟡⁵ | 🟡⁵ | ➖ | 🟡⁵ |
| Make and close a public link | ✅ | ✅ | ✅ | ✅ | ❌ |
| Keep your own tags and notes on documents | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Keep a folder in step with the Disk** | | | | | |
| Keep a copy of the files themselves on your computer | ✅⁶ | ❌ | ✅ | ✅ | 🟡⁷ |
| Sync a folder both ways: a change on either side reaches the other | ✅ | ❌ | 🟡⁸ | ✅ | ❌ |
| Delete a file on the other side only when it surely was deleted, otherwise delete nothing | ✅ | n/a | 🟡⁹ | ➖ | n/a |
| Keep deleted and replaced files, and bring them back | ✅ | n/a | 🟡¹⁰ | ➖ | n/a |
| **Agents and safety** | | | | | |
| An AI app works with your Disk through MCP | ✅ | ✅ | ❌ | ❌ | ✅ |
| An agent with a terminal runs it, with JSON output and a skill | ✅ | n/a | 🟡¹¹ | ❌ | n/a |
| An agent reads only, until you allow changes | 🟡¹² | ➖ | ➖ | n/a | ➖ |
| Allow or refuse deletes and public links separately | ✅ | 🟡¹³ | ➖ | n/a | ➖ |
| Let an agent sync a folder but not delete or replace files | ✅¹⁴ | n/a | ➖ | n/a | n/a |
| See what a change would do before it is made | ✅ | ➖ | ✅ | ➖ | ➖ |
| Use it from Claude or ChatGPT in the browser | ✅ | ➖ | ❌ | ❌ | ❌ |
| **Setup** | | | | | |
| Works with a free Yandex account | ✅ | ❌ | ✅ | ✅ | ✅ |
| Sign in without registering your own Yandex app | ❌ | ✅ | ✅¹⁵ | ✅ | ❌ |

¹ Both keep the files themselves in a folder on your computer, so your system's own search finds them. Neither has a
search of its own.

² It gives the agent a download link, and the agent then has to read the file itself.

³ It downloads the file or folder when asked, and the agent then has to read the file itself.

⁴ It syncs a folder: you move files in that folder and the client sends the change.

⁵ A delete goes to the trash, but there is no command to bring a file back.

⁶ For the folders you [mirror](./mirrors.md), both ways. For the other chosen folders, `ydisk` keeps only the text of
PDF, Word, Excel, CSV and text files, for search.

⁷ It downloads a file or a folder when asked, but it does not keep the copy in sync.

⁸ `rclone sync` is one-way. `rclone bisync` syncs both ways, and its page calls it "an advanced command, so use with
care". Each run is started by you or a scheduler, and the first run needs `--resync`.

⁹ `rclone bisync` refuses a run when either folder is empty, and stops without changes when more than 50% of the files
would be deleted (`--max-delete`). Its docs do not describe a check that each deletion was made on purpose.

¹⁰ A file changed on both sides is kept twice, renamed `.conflict1` and `.conflict2`. A deleted or replaced file is
kept only when you set `--backup-dir1` and `--backup-dir2`, and there is no command to bring it back. On Yandex Disk,
rclone's deletes go to the trash unless `--yandex-hard-delete` is set.

¹¹ `rclone lsjson` and other commands answer in JSON, but there is no skill for agents.

¹² The MCP server offers every command that changes the Disk, and a permission set to `ask` runs without asking over MCP. For a read-only agent, set `YDISK_READ_ONLY=1` or set the permissions to `deny`. `mcp add` asks for `--allow-writes` before it connects an agent.

¹³ By default the agent asks you before each change, including deletes and public links.

¹⁴ Set `files.delete` to `deny` for the agent. Its syncs then send and bring down new files, and list each replace or
deletion they skipped. Over MCP a permission at `ask` lets the change through, and an agent cannot pass
`--allow-deletions` or `--repin`.

¹⁵ rclone signs in through its own Yandex app unless you give it your own `client_id` ([rclone's Yandex page](https://rclone.org/yandex/)). In October 2026 users reported errors that went away with their own
app ([issue 10067](https://github.com/rclone/rclone/issues/10067)).

<a id="where-another-tool-fits-better"></a>

## Where another tool fits better

- **A one-way backup of whole folders, photos and videos included, or the Disk mounted as a drive**: rclone or Yandex
  Disk for Linux. rclone has `mount`, and `ydisk` does not. Yandex Disk for Linux syncs the whole Disk to one folder on
  your computer, except the folders you exclude. `ydisk` mirrors only the folders you choose, both ways, and keeps the
  versions it replaces.
- **No install and no app to register, and you already pay for Yandex 360**: Yandex Disk MCP. Your AI app connects
  to Yandex's server with a ready sign-in link.
- **Uploading videos or folders of many gigabytes from an agent**: yandex-disk-mcp. It runs long uploads in the
  background, resumes them and checks each file's MD5.
- **Your own Python program**: the yadisk library, a client for the Disk REST API ([README](https://github.com/ivknv/yadisk)).

<a id="compared-with-a-browser-agent"></a>

## Compared with an agent driving the Disk web page

A browser agent opens disk.yandex.ru and clicks. `ydisk` and the other tools here call Yandex's API. This page makes
no claim about which is faster, cheaper or more reliable, because there is no published measurement.

<a id="install-and-licence"></a>

## Install and licence

| | ydisk | Yandex Disk MCP | rclone | Yandex Disk for Linux | yandex-disk-mcp |
|---|---|---|---|---|---|
| Install | npm, Node 22.16 or a later 22.x, or Node 24 or later | nothing: your AI app connects to Yandex's server | one binary, most package managers | deb and rpm packages | npm |
| Platforms | macOS, Linux, Windows | any MCP app with HTTP | macOS, Linux, Windows and more | Linux | where Node.js runs |
| Licence | Apache-2.0 | Yandex service, paid Yandex 360 subscription | MIT | not stated on its page | MIT |
| Sign-in | a token from your own Yandex app, kept in the system keyring | a token from Yandex's ready link | rclone's own app in the browser, or yours | a code entered in the browser | a token from your own Yandex app, in the MCP settings |

If `ydisk` fits, start with [installation](./installation.md).

<a id="how-each-mark-was-checked"></a>

## How each mark was checked

`ydisk` marks were checked on the published 0.3.0 package with an empty home folder and no sign-in: `ydisk commands`,
each command's `--help`, and `--dry-run` on each change to read the permission it checks. Search by meaning needs a
text model downloaded once, and the browser connection needs your own tunnel. For the folder sync rows,
`mirrors sync --dry-run` names the permissions a sync checks: `files.upload` for each file it sends and `files.delete`
for each file it replaces or moves to a trash. Without a sign-in the MCP server offers only a few tools, so what an
agent may run over MCP was read in the source of
[mirrors.ts](https://github.com/WireCatLabs/ydisk-cli/blob/v0.3.0/src/commands/mirrors.ts): adding, removing and
`versions` are not offered, and `--allow-deletions` and `--repin` are for the owner only.

Other tools' marks come from their own pages. A search that finds nothing in those pages gives ➖, never ❌, except
where a tool's list of commands or tools is complete.

- **Yandex Disk MCP** ([Disk server](https://yandex.ru/dev/yandex-360/mcp/ru/disk),
  [who can use it](https://yandex.ru/dev/yandex-360/mcp/ru/)). Its full tool list: `disk.search_items` finds files
  "by name, content, type and date". `disk.get_download_url` gives a link, and no tool reads a file's text.
  `disk.delete_item` moves to the trash and `disk.list_trash_items` lists it, with no restore. `disk.create_public_link`
  and `disk.update_public_item_permissions` for links. Access: "personal accounts with an active paid Yandex 360
  subscription". The agent asks before a change "by default". The page shows set-up for Codex and Claude Code, not
  for browser apps, so that row is ➖. It runs on Yandex's servers, so nothing is searched offline.
- **rclone** ([Yandex page](https://rclone.org/yandex/), [commands](https://rclone.org/commands/),
  [bisync](https://rclone.org/bisync/)). No command searches inside files. It has `copy`, `move`, `sync` and `mount`.
  `rclone link` makes a public link. `delete` goes to the trash unless `--yandex-hard-delete`, and `cleanup` empties
  it, with no restore. `--dry-run` on every change. No MCP command. The sign-in uses rclone's own client unless you set
  `client_id`. `bisync` is "an advanced command, so use with care". It refuses a run when either folder is empty, aborts above
  `--max-delete` (50% by default) "without making any changes", renames both copies of a conflict, and keeps deleted
  files only with `--backup-dir1` and `--backup-dir2`. Neither page mentions file versions.
- **Yandex Disk for Linux** ([console commands](https://yandex.ru/support/disk-desktop-linux/cli-commands.html)).
  Its full command list: `start`, `stop`, `status`, `sync`, `publish`, `unpublish`, `token` and set-up options. No
  search, move, delete or trash command, and changes are made in the synced folder. `start` and `sync` sync «все
  папки, кроме указанных в списке исключений» (all folders except those in `exclude-dirs`). Two-way sync is the default: `--read-only` is the
  option that stops changes on the Disk's side. Its pages say nothing about deleted files, a trash or file versions,
  so those rows are ➖.
- **yandex-disk-mcp** ([README](https://github.com/gorokhovdenis/yandex-disk-mcp/blob/main/README.md)). Its full
  tool list: info, list, metadata, compare, create folder, upload, download, delete, copy, move, last uploaded. No
  search and no public link tool. `yandex_disk_delete` moves to the trash unless `permanently`, with no restore.
  Runs over stdio with the token in its settings.

The Yandex Disk MCP and yandex-disk-mcp have no sync tool in their full tool lists (checked 19 November 2026), so the
folder sync rows that build on a sync are n/a for them. yandex-disk-mcp's `yandex_disk_compare` only reports how a
local and a Disk folder differ.
