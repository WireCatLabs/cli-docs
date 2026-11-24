---
title: "Compared with other tools"
---

Pick a tool for your Yandex Disk by the job you want done: find a document by what it says, let an AI agent change a
note, a spreadsheet or a Word document and leave the rest of it as it was, keep a folder the same on your computer and
on the Disk, or back up whole folders. This page lists those jobs and shows which tool does each one. Marks for `ydisk`
come from version 0.7.0, and marks for the other tools come from their own documentation and source. The rows for an
edit that is refused when the file changed, for getting back what an edit replaced and for reading the text of files
were checked on 24 November 2026. The other `ydisk` marks and the rows for editing files and for files changed on both sides were checked on 23 November 2026, the rows for the
whole Disk, a mounted folder and many changes at once on 21 November 2026, the other folder sync rows on 19 November
2026, and the rest on 17 November 2026. A tool may do more than its pages say, and those cells are ➖.

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
  Disk live. The Disk itself checks an edit to a file at the moment of the write.
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
| **Edit a file on the Disk** | | | | | |
| An agent edits a file, and the edit is refused when someone changed the file since the agent read it | ✅⁶ | ❌ | ➖ | ➖ | ❌⁷ |
| Change cells of an Excel workbook or paragraphs of a Word document without losing its formatting | 🟡⁸ | ❌ | ❌ | ❌ | ❌ |
| Put back what an edit replaced, from the tool itself | ✅⁹ | ❌ | 🟡¹⁰ | ➖ | ❌ |
| **Your Disk on your computer** | | | | | |
| Keep a copy of the files themselves on your computer | ✅¹¹ | ❌ | ✅ | ✅ | 🟡¹² |
| Open Disk files in your file manager without downloading them first (a mount) | 🟡¹³ | ❌ | ✅¹⁴ | ❌ | ❌ |
| Sync a folder both ways: a change on either side reaches the other | ✅ | ❌ | 🟡¹⁵ | ✅ | ❌ |
| Sync the whole Disk, leaving out the folders you choose | ✅¹⁶ | ❌ | 🟡¹⁷ | ✅ | ❌ |
| Delete a file on the other side only when it surely was deleted, otherwise delete nothing | ✅ | n/a | 🟡¹⁸ | ➖ | n/a |
| Stop before many deletions or overwrites at once, until you allow them | ✅¹⁹ | n/a | 🟡²⁰ | ➖ | n/a |
| Keep deleted and replaced files, and bring them back | ✅ | n/a | 🟡²¹ | ➖ | n/a |
| Merge edits made on both sides of a text file, so both land | ✅²² | n/a | ❌²³ | ➖ | n/a |
| Resolve a conflict with a diff: see both versions and the lines that clash, then pick one or write the final text | ✅²⁴ | n/a | 🟡²³ | ➖ | n/a |
| **Agents and safety** | | | | | |
| An AI app works with your Disk through MCP | ✅ | ✅ | ❌ | ❌ | ✅ |
| An agent with a terminal runs it, with JSON output and a skill | ✅ | n/a | 🟡²⁵ | ❌ | n/a |
| An agent reads only, until you allow changes | 🟡²⁶ | ➖ | ➖ | n/a | ➖ |
| Allow or refuse deletes and public links separately | ✅ | 🟡²⁷ | ➖ | n/a | ➖ |
| Let an agent sync a folder but not delete or replace files | ✅²⁸ | n/a | ➖ | n/a | n/a |
| See what a change would do before it is made | ✅ | ➖ | ✅ | ➖ | ➖ |
| Use it from Claude or ChatGPT in the browser | ✅ | ➖ | ❌ | ❌ | ❌ |
| **Setup** | | | | | |
| Works with a free Yandex account | ✅ | ❌ | ✅ | ✅ | ✅ |
| Sign in without registering your own Yandex app | ❌ | ✅ | ✅²⁹ | ✅ | ❌ |

¹ Both keep the files themselves in a folder on your computer, so your system's own search finds them. Neither has a
search of its own.

² It gives the agent a download link, and the agent then has to read the file itself.

³ It downloads the file or folder when asked, and the agent then has to read the file itself.

⁴ It syncs a folder: you move files in that folder and the client sends the change.

⁵ A delete goes to the trash, but there is no command to bring a file back.

⁶ An edit passes the `sha256` the agent read. A file changed since the read is refused with nothing changed, and the
agent reads it again. For a file without a public link, the Disk itself checks this at the moment of the write. The new
content goes to a hidden file next to it, the old file is moved to the trash only at the `md5` that was read
(otherwise [the Disk answers 409](https://yandex.ru/dev/disk-api/doc/ru/reference/delete)), and the hidden file gets its name. The file then has a new id on the Disk,
so the Disk's own version history of it starts over. The old copy is in the Disk's trash, where files, as
[Yandex's help](https://yandex.ru/support/yandex-360/customers/disk/web/ru/actions-files/spec-folders/trash) says, still take up space on the Disk and are deleted after 30 days. Tags and notes follow the
new file. A file with a public link is overwritten in place, so its link keeps working. It is checked just before the
write, so a change in the moment between that check and the write is not caught. What the edit replaced is still kept
on your computer.

⁷ `upload` with `overwrite` replaces a file and compares only its size. Nothing checks that the file is unchanged
since it was read.

⁸ `files sheets update` writes cells and keeps the formatting, the formulas and the other sheets. It replaces a
formula only with `--replace`. `files documents update` replaces, inserts or deletes paragraphs and keeps their style.
It refuses a paragraph with a tracked change, a field, an image, a comment, a link or a footnote, and says why. A
replaced paragraph takes the formatting of its first run, so a bold or italic word inside it becomes plain.

⁹ What an edit replaced is kept on your computer: `files history` lists it, and `files restore` puts it back. The
Disk itself also keeps a file's history in its web version, for 14 days, or 90 days with Yandex 360
([Yandex's help](https://yandex.ru/support/disk/version-control.html)). After an edit to a file without a public link,
that history starts over, and the earlier version stays in the Disk's trash for 30 days (see note 6).

¹⁰ `--backup-dir` keeps a file that `copy`, `sync` or `move` would overwrite or delete, and there is no command to
bring it back.

¹¹ For the folders you [mirror](./mirrors.md), both ways. For the other chosen folders, `ydisk` keeps only the text of
files for search: PDF, Word, Excel, PowerPoint, OpenDocument, RTF, HTML, EPUB, CSV and text files. Scanned PDFs
and JPEG, PNG or WebP pictures are read by OCR: by default with the `tesseract` program on your computer, in Russian
and English, and nothing is sent anywhere. The `read_scans` setting can send the pages to Anthropic or OpenAI instead,
which charge per page, or turn OCR off. One file is read up to 20 pages, and one sync reads at most 100.

¹² It downloads a file or a folder when asked, but it does not keep the copy in sync.

¹³ `files serve` shows a Disk folder, or the whole Disk, through the system's own WebDAV client: GNOME Files, Finder
or `net use`. It is read-only on purpose: a writable folder would go around the trash, the versions and the stop on
mass changes that a [mirror](./mirrors.md) has. Changes go through `files` commands or a mirror. See
[open the Disk as a folder](./mount.md).

¹⁴ `rclone mount` reads and writes. It needs FUSE: macFUSE or FUSE-T on macOS and WinFsp on Windows. Its page says
many programs need `--vfs-cache-mode writes` to save files there.

¹⁵ `rclone sync` is one-way. `rclone bisync` syncs both ways, and its page calls it "an advanced command, so use with
care". Each run is started by you or a scheduler, and the first run needs `--resync`.

¹⁶ A mirror of `/` with `--ignore` for the paths you leave out, up to 100,000 files. A Disk too big to list in one
run is listed over several, each run going on where the last one stopped.

¹⁷ rclone works on the whole Disk (`yandex:`) and leaves paths out with filter flags such as `--exclude`. Both ways
only through `rclone bisync`, which its page calls "an advanced command".

¹⁸ `rclone bisync` refuses a run when either folder is empty, and stops without changes when more than 50% of the files
would be deleted (`--max-delete`). Its docs do not describe a check that each deletion was made on purpose.

¹⁹ A sync stops before it deletes more than 10 files or replaces more than 50 existing files, however big the
mirror. Only you can allow more, with `--allow-deletions`, `--allow-replacements` or `--replace`, never an agent over
MCP. Each replaced file is kept as a version first.

²⁰ `rclone bisync` aborts without changes when more than 50% of the files would be deleted (`--max-delete`).
`rclone sync` limits deletes only when you set `--max-delete`, and then stops the operation in progress. Its pages
describe no stop before many overwrites.

²¹ A file changed on both sides is kept twice, renamed `.conflict1` and `.conflict2`. A deleted or replaced file is
kept only when you set `--backup-dir1` and `--backup-dir2`, and there is no command to bring it back. On Yandex Disk,
rclone's deletes go to the trash unless `--yandex-hard-delete` is set.

²² A `.md`, `.txt`, `.csv` or `.tsv` file up to 1 MB is merged line by line, as Git merges. Edits on the same or
neighbouring lines stay a conflict. The three versions of every merge and its result are kept for good. See
[a file changed on both sides](./mirrors.md#a-file-changed-on-both-sides).

²³ `rclone bisync` keeps or picks a whole file: by default both copies stay, renamed `.conflict1` and `.conflict2`,
and `--conflict-resolve` can take the newer, older, larger or smaller one instead. Its page describes no merge of the
contents and no command that shows the difference, so you compare the two copies yourself.

²⁴ `mirrors conflicts show` gives the three versions and each stretch of lines in conflict, with Git's conflict
markers. `mirrors conflicts resolve` writes your choice (`--keep local`, `disk` or `both`) or your final file to both
sides at once, and refuses with nothing written when either side changed since.

²⁵ `rclone lsjson` and other commands answer in JSON, but there is no skill for agents.

²⁶ The MCP server offers every command that changes the Disk, and a permission set to `ask` runs without asking over MCP. For a read-only agent, set `YDISK_READ_ONLY=1` or set the permissions to `deny`. `mcp add` asks for `--allow-writes` before it connects an agent.

²⁷ By default the agent asks you before each change, including deletes and public links.

²⁸ Set `files.delete` to `deny` for the agent. Its syncs then send and bring down new files, and list each replace or
deletion they skipped. Over MCP a permission at `ask` lets the change through, and an agent cannot pass
`--allow-deletions`, `--allow-replacements`, `--replace` or `--repin`.

²⁹ rclone signs in through its own Yandex app unless you give it your own `client_id` ([rclone's Yandex page](https://rclone.org/yandex/)). In October 2026 users reported errors that went away with their own
app ([issue 10067](https://github.com/rclone/rclone/issues/10067)).

<a id="where-another-tool-fits-better"></a>

## Where another tool fits better

- **The Disk mounted as a drive that programs can also save to**: rclone `mount`. `ydisk` mounts read-only on
  purpose, so a program or a mistaken `rm -rf` cannot delete files on the Disk through the folder.
- **A one-way backup of whole folders, photos and videos included**: rclone `sync` or `copy`.
- **Reworking a document's layout, images, comments or tracked changes**: an office app, on a file in Yandex Disk for
  Linux's synced folder, or the Disk's web editor. `ydisk` changes cells and the text of paragraphs, and refuses a
  paragraph it cannot change without loss.
- **A whole Disk of more than 100,000 files on your computer, kept in sync by a background service**: Yandex Disk for
  Linux. A `ydisk` mirror holds up to 100,000 files, not counting the ones you leave out, and syncs when you run it or
  while `mirrors watch` runs. In return it keeps the versions it replaces and stops before many deletions or
  overwrites at once.
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

`ydisk` marks were checked on version 0.5.0 with an empty home folder and no sign-in: `ydisk commands`,
each command's `--help`, and `--dry-run` on each change to read the permission it checks. For the editing rows, the
`--help` of `files update`, `files sheets update`, `files documents update`, `files history` and `files restore`
says what each one writes, keeps and refuses. For the rows on files changed on both sides, `mirrors sync --help` says
a text file changed in different places is merged, and `mirrors conflicts resolve --help` gives `--keep` and
`--file`. The merge rules come from [mirrors](./mirrors.md#a-file-changed-on-both-sides). Search by meaning needs a
text model downloaded once, and the browser connection needs your own tunnel. For the folder sync rows,
`mirrors sync --dry-run` names the permissions a sync checks: `files.upload` for each file it sends and `files.delete`
for each file it replaces or moves to a trash. Without a sign-in the MCP server offers only a few tools, so what an
agent may run over MCP was read in the source of
[mirrors.ts](https://github.com/WireCatLabs/ydisk-cli/blob/v0.3.0/src/commands/mirrors.ts): adding, removing and
`versions` are not offered, and `--allow-deletions`, `--replace` and `--repin` are for the owner only. The same
`--help` shows `mirrors add --ignore` and `files serve`. `files serve` runs until it is stopped, as `mirrors watch`
does, so it is not offered over MCP
([mount.ts](https://github.com/WireCatLabs/ydisk-cli/blob/v0.4.0/src/commands/mount.ts)). The limits of 10 deletions,
50 replacements and 100,000 files come from the 0.4.0 changelog and the help, and the 1 MB merge limit from the 0.5.0
changelog.

The rows for an edit the Disk itself refuses and for getting back what it replaced were checked on version 0.7.0. The
deletion of the old file passes the `md5` that was read to the Disk
([writes.ts](https://github.com/WireCatLabs/ydisk-cli/blob/75cccfb/src/yandex/writes.ts#L31)), and the order of the replace, the new id and the exception for files with a
public link are in
[mirrors.md](https://github.com/WireCatLabs/ydisk-cli/blob/75cccfb/docs/mirrors.md#how-a-file-on-the-disk-is-replaced).
The list of files that are read comes from
[usage.md](https://github.com/WireCatLabs/ydisk-cli/blob/75cccfb/docs/usage.md#what-the-copy-holds).

Other tools' marks come from their own pages. A search that finds nothing in those pages gives ➖, never ❌, except
where a tool's list of commands or tools is complete.

- **Yandex Disk MCP** ([Disk server](https://yandex.ru/dev/yandex-360/mcp/ru/disk),
  [who can use it](https://yandex.ru/dev/yandex-360/mcp/ru/)). Its full tool list: `disk.search_items` finds files
  "by name, content, type and date". `disk.get_download_url` gives a link, and no tool reads a file's text.
  `disk.delete_item` moves to the trash and `disk.list_trash_items` lists it, with no restore. `disk.create_public_link`
  and `disk.update_public_item_permissions` for links. Access: "personal accounts with an active paid Yandex 360
  subscription". The agent asks before a change "by default". `disk.create_file` uploads a new file, and no tool
  changes the content of a file already there or lists its versions. The page shows set-up for Codex and Claude Code, not
  for browser apps, so that row is ➖. It runs on Yandex's servers, so nothing is searched offline.
- **rclone** ([Yandex page](https://rclone.org/yandex/), [commands](https://rclone.org/commands/),
  [bisync](https://rclone.org/bisync/), [mount](https://rclone.org/commands/rclone_mount/),
  [filtering](https://rclone.org/filtering/), [flags](https://rclone.org/docs/)). No command searches inside files. It has `copy`, `move`, `sync` and `mount`.
  `rclone link` makes a public link. `delete` goes to the trash unless `--yandex-hard-delete`, and `cleanup` empties
  it, with no restore. `--dry-run` on every change. No MCP command. The sign-in uses rclone's own client unless you set
  `client_id`. `bisync` is "an advanced command, so use with care". It refuses a run when either folder is empty, aborts above
  `--max-delete` (50% by default) "without making any changes", renames both copies of a conflict or picks one with
  `--conflict-resolve` (`newer`, `older`, `larger`, `smaller`, `path1`, `path2`), and keeps deleted
  files only with `--backup-dir1` and `--backup-dir2`. No command edits a file's content, and no flag refuses an
  overwrite unless the file still has a hash you give. `--backup-dir` keeps what `copy`, `sync` or `move` overwrites. Neither page mentions file versions. `mount` lists
  `--read-only` as an option, so it writes by default. `--max-delete` for other commands: "not to delete more than N
  files", then "stop the operation in progress".
- **Yandex Disk for Linux** ([console commands](https://yandex.ru/support/disk-desktop-linux/cli-commands.html)).
  Its full command list: `start`, `stop`, `status`, `sync`, `publish`, `unpublish`, `token` and set-up options. No
  search, move, delete or trash command, and changes are made in the synced folder. `start` and `sync` sync «все
  папки, кроме указанных в списке исключений» (all folders except those in `exclude-dirs`). Two-way sync is the default: `--read-only` is the
  option that stops changes on the Disk's side. There is no mount command, and no file limit or stop before many
  deletions is described. Its pages say nothing about deleted files, a trash or file versions,
  so those rows are ➖.
- **yandex-disk-mcp** ([README](https://github.com/gorokhovdenis/yandex-disk-mcp/blob/main/README.md)). Its full
  tool list: info, list, metadata, compare, create folder, upload, download, delete, copy, move, last uploaded. No
  search and no public link tool. `yandex_disk_delete` moves to the trash unless `permanently`, with no restore.
  `yandex_disk_upload` overwrites only with `overwrite`, decided by size alone, and no tool edits a file's content or
  lists versions.
  Runs over stdio with the token in its settings.

The Yandex Disk MCP and yandex-disk-mcp have no sync tool in their full tool lists (checked 19 November 2026), so the
folder sync rows that build on a sync are n/a for them. yandex-disk-mcp's `yandex_disk_compare` only reports how a
local and a Disk folder differ.
