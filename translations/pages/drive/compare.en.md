---
title: "Compared with other tools"
---

Pick a tool by the job you want done. This page lists the jobs people give a Google Drive tool and shows which
tool does each one. Checked on 24 October 2026, against `drive` and each project's own documentation. A
tool may do more than its documentation says; those cells are ➖.

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation · n/a does not apply

The tools:

- **drive**: this tool. A command line and an MCP server for the Google Docs, Sheets and files in folders you
  choose, kept as a local copy you can search, tag and annotate.
- **[gog](https://github.com/openclaw/gogcli)**: a command line for all of Google Workspace, with many Docs and
  Sheets editing commands and an MCP server.
- **[Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp)**: an MCP server for twelve Google
  services. You run it on your computer, or host it for a team.
- **[rclone](https://github.com/rclone/rclone)**: copies and syncs files between your computer and Google Drive and
  many other storage services.
- **[Claude's Google Drive connector](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)**:
  built into Claude on the web and desktop, with separate connectors for editing Docs, Sheets and Slides.

[gdrive](https://github.com/glotlabs/gdrive) is not in the table. Its README says "only the most basic
functionality is implemented".

## What each tool does

| # | Job | drive | gog | Workspace MCP | rclone | Claude |
|---|---|:-:|:-:|:-:|:-:|:-:|
| | **Find a document by what it says** | | | | | |
| 1 | Find a document by words inside it | ✅ | ✅ | ✅ | ➖ | ✅ |
| 2 | Find by meaning, not only exact words, and an image by what it shows | ✅ | ➖ | ➖ | ➖ | ➖ |
| 3 | Search your documents with no internet | ✅ | ➖ | ➖ | ➖ | ➖ |
| | **Read a document as text** | | | | | |
| 4 | Read a Google Doc or Sheet as text | ✅ | ✅ | ✅ | 🟡 | ✅ |
| 5 | Read a PDF, Word or Excel file as text | ✅ | ➖ | 🟡 | ➖ | ✅ |
| | **See who changed what** | | | | | |
| 6 | See recent activity on a document: who did what, and when | ✅¹ | ✅ | ➖ | ➖ | 🟡 |
| | **Keep a local copy in sync** | | | | | |
| 7 | Keep a local copy of chosen folders up to date | 🟡² | ➖ | ➖ | ✅ | ➖ |
| 8 | Keep local Markdown and CSV files in step with Docs and Sheets, both ways, and show a conflict part by part | ✅ | 🟡 | ➖ | 🟡 | ➖ |
| 9 | Pick up changes as they happen | 🟡³ | 🟡 | ➖ | ➖ | ➖ |
| | **Download, export, upload** | | | | | |
| 10 | Download a file | ✅ | ✅ | ✅ | ✅ | ➖ |
| 11 | Export a Doc or Sheet to PDF, Word, Excel or CSV | ✅ | ✅ | 🟡 | ✅ | ➖ |
| 12 | Turn Markdown into a formatted Google Doc | ✅ | ✅ | ✅ | ➖ | ➖ |
| | **Tag and note documents** | | | | | |
| 13 | Tag documents with your own tags | ✅ | 🟡 | ➖ | 🟡 | ➖ |
| 14 | Keep notes and quoted facts beside a document | ✅ | ➖ | ➖ | ➖ | ➖ |
| 15 | Find the chat where a document was shared | ✅⁴ | ➖ | ➖ | ➖ | ➖ |
| | **Agents and safety** | | | | | |
| 16 | MCP server for an agent | ✅ | ✅ | ✅ | ❌ | n/a |
| 17 | An agent reads only, until you allow changes | ✅ | ✅ | 🟡 | 🟡 | 🟡 |
| 18 | Allow or deny commands one by one | ✅ | ✅ | ✅ | ➖ | 🟡 |
| 19 | Preview a change before it is made | ✅ | ✅ | ➖ | ✅ | ➖ |
| 20 | Fetched text is marked as data, not instructions, for the agent | 🟡 | ✅ | ➖ | ➖ | ➖ |
| 21 | Your documents stay on your computer | ✅ | ✅ | 🟡 | ✅ | ❌ |
| | **Setup** | | | | | |
| 22 | Sign in without creating your own Google Cloud project | 🟡⁵ | ❌ | ❌ | 🟡 | ✅ |
| 23 | Use it from Claude or ChatGPT on the web and phone | ❌ | ❌ | ✅ | ❌ | ✅ |

¹ Needs the optional activity grant at sign in. It shows what Google's activity log returns, not a complete edit
history.

² `drive` keeps text snapshots of Docs, Sheets, PDF and Word files. The original files stay in Google; rclone copies
the files themselves.

³ `mirrors watch` keeps mirrored folders in sync while the command runs. It is not a background service.

⁴ Needs a messenger tool from the same family (Telegram or MAX) with the message already stored on your computer.

⁵ See the next section.

## Sign in is limited for now

Google has not finished reviewing WireCat's Google application. Until it does, Google shows an "unverified app"
screen when you sign in with it, and lets at most 100 new users in. When that limit is reached, new users cannot sign
in with WireCat's application. You can sign in with your own Google application instead, which has its own limits.
Steps and the links to Google's pages are in [installation](./installation.md#google-shows-an-unverified-app-warning).

## Where another tool fits better

- **Editing Docs and Sheets in detail**: gog or Workspace MCP. Tables, headers, styles, charts and conditional formats
  have ready commands there. `drive` covers Markdown, cells and basic sheet formatting, and other edits go through
  raw API calls.
- **Backing up or moving big folders and files that are not Docs**: rclone. It copies the files themselves, keeps
  them in sync both ways and works with many storage services. `drive` keeps text and does not copy originals.
- **Claude or ChatGPT on the web or phone, with nothing to install**: Claude's connector, or Workspace MCP run as a
  hosted server. `drive` runs on your computer.
- **Gmail and Calendar in the same tool**: gog or Workspace MCP. `drive` works with Drive, Docs and Sheets only.

## Compared with an agent driving the Drive web page

A browser agent opens Drive in a browser and clicks. `drive` and the other tools here call Google's API. This page
makes no claim about which is faster, cheaper or more reliable, because there is no published measurement.

## Install and licence

| | drive | gog | Workspace MCP | rclone | Claude |
|---|---|---|---|---|---|
| Install | npm (Node 22.16+ on 22.x, or Node 24+) | Homebrew, Go, Docker, binaries | uv, Docker, Helm | one binary, most package managers | nothing to install |
| Licence | Apache-2.0 | MIT | MIT | MIT | service |

If `drive` fits, start with [installation](./installation.md). To connect an agent, see
[the MCP server](./recipes.md#use-a-local-mcp-client).

## How each mark was checked

`drive` marks were checked on the [reviewed source](https://github.com/WireCatLabs/drive-cli/tree/v0.27.0): by running a build with an empty home folder (`drive commands --json`
and `drive <profile> mcp --tools --json`, which list the commands and the 105 that MCP offers to a signed out
profile) and by the [usage guide](./usage.md), [search guide](./search.md), [mirroring guide](https://github.com/WireCatLabs/drive-cli/blob/main/docs/mirrors.md),
[configuration](./configuration.md) and [security](./security.md) pages. Where a mark is a limit (🟡 or ❌), the section
above says what the limit is.

Other tools' marks come from their own pages. A search that finds nothing in those pages gives ➖, never ❌, except
where a command list is complete.

- **gog**
  ([README](https://github.com/openclaw/gogcli/blob/main/README.md),
  [MCP guide](https://github.com/openclaw/gogcli/blob/main/docs/mcp.md)).
  Rows 1, 10: [`gog drive search`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-search.md)
  ("Full-text search across Drive") and
  [`gog drive download`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-download.md).
  Row 4: [`gog docs cat`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-docs-cat.md) and the MCP tools
  `docs_get` and `sheets_read_range`. Row 6:
  [`gog drive activity query`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-activity-query.md).
  Row 7: the only `gog drive sync` subcommand is
  [`push`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-sync-push.md), so rows 7 and 8 are no
  pull and one way. Row 9:
  [`gog drive changes watch`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-changes-watch.md)
  sets up a webhook and does not sync files. Row 11:
  [`gog docs export`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-docs-export.md). Row 12: MCP
  `docs_write` "optionally as Markdown". Row 13:
  [`gog drive labels`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-labels.md) are Google Drive
  labels, not tags kept on your computer. Rows 16 to 19: README ("`gog mcp` ... is read-only by default", `--readonly`,
  exact command allowlists, dry-run plans, untrusted-content wrapping). Row 22: README, "download its JSON file",
  which means your own OAuth client. Row 23: the MCP guide describes a "typed stdio MCP server".
- **Workspace MCP**
  ([README](https://github.com/taylorwilsdon/google_workspace_mcp),
  [Drive tools](https://workspacemcp.com/google-drive),
  [Docs tools](https://workspacemcp.com/google-docs),
  [Sheets tools](https://workspacemcp.com/google-sheets)).
  Row 1: `search_drive_files` "speaks the full Drive query syntax". Row 4: `get_doc_as_markdown`,
  `read_sheet_values`. Row 5: `get_drive_file_content` reads "uploaded Office files"; PDF is not named, so 🟡.
  Row 10: `get_drive_file_download_url`. Row 11: `export_doc_to_pdf`; the download tool takes an `export_format`
  that is not listed, so 🟡. Row 12: `import_to_google_doc` (Markdown, DOCX, CSV and more). Rows 16 to 18: README
  (`--read-only`, `--permissions`, `--tools`, `--disabled-tools`, "run locally over stdio"). Row 21: README, local
  or hosted. Row 22: README, "You'll need an OAuth client from Google Cloud Console". Row 23: README, "Claude
  Desktop, web & mobile ... run the server in HTTP mode" and a ChatGPT guide. The tool lists have no revision,
  activity or label tool, so rows 6 and 13 are ➖.
- **rclone**
  ([Google Drive page](https://rclone.org/drive/), [bisync](https://rclone.org/bisync/),
  [command list](https://rclone.org/commands/)).
  Row 4: Docs download as a file in the `--drive-export-formats` you pick (includes `md`), so 🟡. Rows 7, 10, 11:
  [`sync`](https://rclone.org/commands/rclone_sync/), `copy` and `--drive-export-formats`. Row 8: `bisync`, with a
  section on Google Docs and an example using `--drive-skip-gdocs`, so 🟡. Row 13: `--drive-metadata-labels`
  reads and writes Google Drive labels, so 🟡. Row 16: the command list has no MCP command. Row 17:
  `--drive-scope drive.readonly`, a read only sign in, so 🟡. Row 19: `--dry-run`. Row 22: the page says the shared
  client "is being retired and will stop working during 2026".
- **Claude**
  ([Use Google Workspace connectors](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)).
  Row 1: "Search and retrieve Google Docs". Rows 4, 5: "Read Sheets, Slides, PDFs, images, and MS Office files".
  Row 6: "list recent changes to your Drive" is a change list, not who changed a document, so 🟡. Rows 17, 18: "By
  default, Claude asks for your approval before each of these actions", and owners of Team and Enterprise plans
  decide whether members can skip the approval, so 🟡. Row 21: the connector reads your files inside Claude, so ❌.
  Row 22, 23: built in, on the web and desktop. The page does not describe downloading a file to your computer or
  exporting to PDF, so rows 10 and 11 are ➖.
