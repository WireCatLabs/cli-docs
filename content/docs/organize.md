---
title: "Organize your sources"
description: "Choose tags, notes, memories and project links for information you want to find and reuse."
---

Keep a project decision connected to the document, message and person that explain it. This guide
helps you choose what to save and what to link, without copying every source into a new note.
The records you connect must be in the same deliberately chosen local store.

## Choose the right record

| Use this | When you want to | Example |
| --- | --- | --- |
| Source document or message | Keep the original evidence and its location. | A Google budget document and the message approving it. |
| Folder | Choose a collection of source files to import. | A local notes folder or a selected Google Drive folder. |
| Tag | Give several sources a simple label. | `budget` or `follow-up`. A label is not a project or access permission. |
| Note | Write your own context about a source or person. | “Ask Rin to explain the changed totals.” |
| Memory | Keep a reusable summary, fact or preference with supporting evidence. | A proposed budget decision, reviewed before confirmation. |
| Person | Connect identities you know belong to the same human. | A Google editor and a messenger identity; matching names alone are not enough. |
| Project | Connect existing work and its evidence under one project record. | The launch project linked to its budget document. |
| Task | Track an action rather than merely label a source. See [Tasks](./tasks.md). | Confirm the revised budget, with a link to the document. |

Tags and notes are local organization; they do not edit a Google file, send a message or change
mailbox labels. Projects and tasks are stored work records, not commands supplied by every connector.
Drive can link existing records; it does not create a project or turn every tagged item into a task.

## Try one project decision

```text prompt
Use drive CLI with profile personal to find the budget decision in my imported project documents.
Use tg CLI to find the message discussing it in the history already on this computer.
Show the source links first. Tag the document budget and save a note about the open question.
If the project and person already exist in the same store, show them before adding links.
Do not merge people based only on names or create a task without asking me what the action is.
```

For MAX history, replace “Use tg CLI” with “Use max CLI”. Your agent can read from separate tools
and produce an answer, but **a database link needs both records in the same store**. Drive uses the same
shared database by default (`~/.local/share/WireCat/wirecat.db` on Linux). [Drive settings](./drive/configuration.md) explain
how to change it; sharing does not combine account logins or grant remote access.

Check the source IDs and people in the result. A link describes a relationship; it does not copy
the target's full content into the document. When you need a reusable fact, keep its source and
review the proposed memory. A document changing can make an earlier memory stale.

## Folders and navigation

Memo registers local folders and their subfolders; it can tag an imported subfolder by its path.
Drive selects Google roots recursively and retains folder ancestry for sync. Its current shared
database collection is account-level: it does not expose a navigable Google folder tree or let
you treat every remote folder as a local project record. Use `drive personal folders list` to inspect selected
roots and `drive personal files list --parent FOLDER_ID` to inspect live contents, replacing the placeholder.

A messenger chat folder groups chats. It is a different kind of collection from a source-file
folder. Neither a tag nor a project should silently change the source's folder membership.

## Put each action in its tool

- [Notes and files](./memo/tags.md): import local folders, label sources and write notes
  about stored people or messages.
- [People](./people.md): check context and explicitly connect known identities.
- [Google Drive recipes](./drive/recipes.md): tag documents, link existing records and review memories.
- [Data model](./data-model.mdx#organizations-and-projects): technical project/task relationships.

Start with one source, one useful label and one note. Open its context again to verify the records
and links before applying the same organization to a whole collection.
