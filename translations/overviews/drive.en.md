---
title: "Google Drive: start here"
description: "Copy the Google folders you choose to your computer, so your AI agent finds a passage with its Google link, even offline."
---

Your plans, specs and budgets live in Google Docs and Sheets, and an AI agent on your computer cannot read them unless
you paste them into the chat. The `drive` command-line tool copies the Google folders you choose to your computer.
Your agent then finds the passage where a decision was written down, with the document's title and its Google link,
even without the internet.

This page explains what you get, how the copy works and how to connect your first folder. When you also allow
changes, the same tool can create and edit Docs, copy and move files and manage folders for you.

**On this page:**

1. [How it works](#how-it-works)
2. [What you can do](#what-you-can-do)
3. [Choose the way you want to work](#choose-the-way-you-want-to-work)
4. [What the local copy contains](#what-the-local-copy-contains)
5. [Ask for your first result](#ask-for-your-first-result)
6. [Supported content and connections](#supported-content-and-connections)

## How it works

- **A copy on your computer.** `drive` reads the folders you choose and saves their text, titles and links in the
  local store, one database file on your computer that every WireCat tool shares. Search reads this copy, not Google.
  Your Google files do not change.
- **Only the folders you choose.** Browsing Google shows you everything your account can open, but only the folders
  you add are copied. Each sync brings in what changed since the last one.
- **A profile for each account.** A profile is a name you choose for one connected Google account, such as `personal`
  or `work`. Every command that uses an account names it first: `drive personal search budget`.
- **Reading by default, writing when you allow it.** Sign-in asks Google for read access. Changing Google files needs
  an extra write grant, and the profile's permissions decide which changes may run.
- **Your agent uses the same commands.** A terminal agent such as Claude Code runs `drive` for you, and an app that
  connects to MCP servers gets the same commands over MCP.

Because the copy is in the shared store, [Memo](/en/docs/memo) can find a document together with the chat or the
email about it.

## What you can do

- Find a decision across imported documents and return its passage, title and original Google link.
- Find imported documents alongside saved messages and notes through Memo, Telegram and MAX.
- Read cached text and file metadata, navigate folder trees and find unreadable files without opening Drive.
- Keep selected folders current through repeatable sync, including documents in subfolders.
- Add local tags, notes and source-backed memories that survive renames and ordinary updates.
- Connect documents to observed Google editors and existing people, projects or other sources.
- Inspect live file metadata, permissions, comments, revisions and optional activity history.
- Create and edit native Docs, copy or move files, and manage folders when you explicitly grant write access.
- Keep local Markdown or table files in step with a Google Doc or Sheet that colleagues edit, with a
  [mirror](./mirrors.md).

## Choose the way you want to work

| Your task | What Drive does | Start here |
| --- | --- | --- |
| Explore a folder or inspect a file | Reads Google directly. Browsing alone does not add documents to search | [Browse and import](./usage.md#choose-the-right-operation) |
| Give an agent a project to remember | Imports supported documents into the local store | [Import a folder](./usage.md#import-a-folder-and-check-coverage) |
| Find evidence while offline | Searches the imported copy and reads cached content and metadata | [Search documents](./search.md) |
| Keep useful context beside sources | Adds local tags, notes, links and reviewed memories | [Task recipes](./recipes.md) |
| Change a Google file | Uses Google's API with a write grant and the command's permission | [Create and edit a Doc](./recipes.md#create-a-native-doc-and-include-it-in-search) |

## What the local copy contains

Importing keeps more than a folder of downloads. The text of each document goes into SQLite, the database file of the
local store, split into passages for search. Optional embeddings help find related wording by meaning.

| Saved information | What you can do without Google |
| --- | --- |
| Text from native Doc tabs, tables and footnotes, and from uploaded Markdown and text files | Search passages, read a source and prepare an answer with its evidence |
| Google ID, title, type, original link, parent folders, timestamps and version when available | Identify the source and inspect the metadata from the last sync |
| Owners and last editor that Google shows | See who worked on a document and the people they are linked to |
| Local tags, notes, person and project links and memories | Organize and recall context across repeated work |
| Google folders and their parents | Browse a cached tree, list children, tag folders and attach notes |
| Selected folders, checkpoints and pending work | Keep sync scoped and resume an interrupted import |

The catalog keeps every file and folder in the selected scope, including formats whose text cannot be read.
`catalog search` finds names, descriptions, types and owners or editors. `search` finds indexed text and local labels.
A result's `content` says whether it has only metadata, indexed text or a reason the text could not be read.

This is a copy from the last sync. Permission lists, comments, revision history and activity are read live from
Google and are not saved. See [offline folder browsing](./usage.md#browse-and-organize-the-local-catalog).

## Ask for your first result

After [installing and connecting](./installation.md), give your agent a small project folder:

```text prompt
Use drive CLI with profile personal. Import the Google folder I choose and its subfolders.
Find the budget decision, show its exact passage and original Google link, and list skipped files.
Keep the local index. Do not create extra exports or change Google files.
```

The answer should name its sources and report unfinished or skipped work. Search then works from the local copy. Run
sync again when you want newer edits. To run it yourself:

```sh
drive personal folders add FOLDER_ID
drive personal sync --json
drive personal --offline search 'budget' --exact --json
```

Replace `FOLDER_ID` and the profile name. Run sync again while it reports pending work.

## Supported content and connections

Local indexing reads native Google Docs and Sheets, and uploaded Markdown and plain text, PDF with a text layer, Word
`.docx`, Excel `.xlsx`, CSV and TSV. Sheets are imported for reading and search. Live
[Sheets commands](./recipes.md#read-and-change-spreadsheet-cells) read ranges, update values and formulas, append rows
and clear selected cells. They also
[organize tabs and format selected ranges](./recipes.md#organize-tabs-and-format-selected-cells).

Scanned PDFs, Slides, audio and shortcuts have no indexed text. Images are found by name, or by what they show when you
turn on [picture search](./search.md#search-images-by-what-they-show). For a native Doc, the body, tables and
footnotes across tabs are indexed. Images, headers, footers, comments and suggested edits are not.

Sign-in opens Google's consent screen in your browser, and you approve access to your own account. You do not need a
Google Cloud project: WireCat's Google app is ready to use, and your own Desktop OAuth client is an option. Folder
selection limits what is copied, while Google's read access covers the whole account's Drive.

Start with [installation and Google connection](./installation.md), then follow
[import and offline reading](./usage.md) or a [complete task recipe](./recipes.md).
