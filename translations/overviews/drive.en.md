---
title: "Google Drive: start here"
description: "Copy the Google Drive folders you choose to your computer, so your AI agent searches your Docs, Sheets and PDFs offline and quotes the source."
---

Your proposals, budgets and meeting notes live in Google Docs, Sheets and PDF files on Google Drive. The `drive`
command-line tool copies the text of the folders you choose to your computer, so your AI agent can search them and
use them as context, even without the internet.

An agent with access to your documents finds the passage where a decision was written down, quotes it, and gives
you the document's title and its Google link. It can also read a folder tree, list the files it could not read, and
change a Google file when you allow it.

`drive` keeps the copy in the local store, one file on your computer that every WireCat tool shares. Your chats, mail
and notes are there too, so [Memo](/en/docs/memo) can find a document together with the conversation about it. To
start, you need a Google account with access to the folders.

**On this page:**

1. [What you get](#what-you-get)
2. [Two words to know](#two-words-to-know)
3. [Connect and copy a folder](#connect-and-copy-a-folder)
4. [What the copy contains](#what-the-copy-contains)
5. [What it reads](#what-it-reads)
6. [Find a guide for your task](#find-a-guide-for-your-task)

## What you get

- **Search without the internet.** Find a passage by its words, or by meaning once the copy is indexed for it. Each
  result keeps its title and its original Google link.
- **Only the folders you choose.** Signing in copies nothing. You pick the folders, and the tool copies them with
  their subfolders.
- **Your own context beside the source.** Add tags, notes and memories to a document or a folder. They stay on your
  computer and survive renames and ordinary updates.
- **Live reading when you need it.** Browse a folder, or look at a file's permissions, comments and revisions on
  Google, without copying anything.
- **Changes only when you allow them.** Read access is the default. Creating and editing Docs, filling in Sheets,
  copying or moving files need a separate write grant.
- **Your agent connected.** Install the tool's skill for a terminal agent such as Claude Code, or serve the tool over
  MCP to an app that connects to MCP servers.

## Two words to know

A **profile** names one connected Google account, such as `personal` or `work`. Every account command names it.

The **local copy** is the text, the details and your own notes saved on the computer where `drive` runs. It is
separate from the files on Google. Search reads the local copy. A sync brings in newer edits.

## Connect and copy a folder

1. [Install `drive`](./installation.md) from npm.
2. Sign in. `personal` is the profile name the examples use; choose your own. A browser opens, and you approve read
   access to your Google Drive.

```sh
drive personal session start
```

Google may refuse the sign-in through WireCat's app or stop it with a warning. Then
[use your own Google app](./installation.md#google-shows-an-unverified-app-warning): it takes a few minutes and
costs nothing.

3. Choose a folder. Open it in Google Drive and copy its address from the browser. The address here is an example:
   use yours.

```sh
drive personal folders add https://drive.google.com/drive/folders/1a2B3c4D5e6F7g8H9i0JkLmNoPqRsTuVw
```

4. Copy the folder and search it.

```sh
drive personal sync
drive personal search 'budget' --exact
```

One sync reads up to 10,000 entries. `drive personal status` shows the work still pending: run the sync again until
none is left, and later to bring in what changed.

5. Connect your agent. A terminal agent gets the skill:

```sh
drive skill install
```

An app on your computer that connects to MCP servers runs `drive personal mcp serve`; the
[commands](./commands.md) show how to add it. ChatGPT, Codex or Claude in the browser connect as described in
[browser apps](./remote.md).

Or ask your agent once `drive` is installed and signed in:

```text prompt
Use drive CLI with profile personal. Import the Google folder I choose and its subfolders.
Find the budget decision, show its exact passage and original Google link, and list skipped files.
Do not change Google files.
```

## What the copy contains

| Saved information | What you can do without Google |
| --- | --- |
| Text from Docs (all tabs, tables and footnotes), Sheets and supported files | Search passages, read a source and prepare an answer with its evidence |
| Google ID, title, type, original link, parent folders and dates | Identify the source and see its details from the last sync |
| Owners and last editor that Google shows | See who worked on a document |
| Folders and their tree | Browse the folder tree, list a folder, tag a folder and add notes to it |
| Your tags, notes, links to people or projects, and memories | Keep context across repeated work |

Files whose content cannot be read stay in the copy by name and type. `catalog search` finds them by name, type and
owner. Permissions, comments, revision history and activity are read live from Google and are not kept.

## What it reads

The tool indexes Google Docs and Sheets, and uploaded Markdown and plain text, PDF with a text layer, Word `.docx`,
Excel `.xlsx`, CSV and TSV. Scanned PDFs, Slides, audio and shortcuts have no indexed text. Images are found by name,
or by what they show when you turn on [picture search](./search.md#search-images-by-what-they-show). In Docs, images,
headers, footers, comments and suggested edits are not indexed.

## Find a guide for your task

| Task | Guide |
|---|---|
| Install, sign in and import a first folder | [Install and connect](./installation.md) |
| Import, read and organize the local copy | [Use it](./usage.md) |
| Find a passage, a file or a picture | [Search](./search.md) |
| Give your agent a whole task | [Recipes](./recipes.md) |
| Edit a Doc or a Sheet | [Recipes](./recipes.md#create-a-native-doc-and-include-it-in-search) |
| Keep local Markdown files in step with Google | [Mirrors](./mirrors.md) |
| Find a command or an option | [Commands](./commands.md) |
| Change a setting or a permission | [Settings](./configuration.md) |
| Fix an error | [Troubleshooting](./troubleshooting.md) |
| Learn what the tool keeps and sends | [Security](./security.md) |
