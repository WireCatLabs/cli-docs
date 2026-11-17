---
title: "Compared with other tools"
---

Keep your Notion pages on your computer and let your AI agent find them by meaning, with no internet, next to your
chats and mail. Notion's own tools for agents work online, inside Notion, and keep no copy on your computer. `notion`
keeps that copy, and your agent can also comment on a page or add a file to it. You can turn each of these off.

Your agent can tell you who wrote a page and show that person's messages and mail beside it. It finds a page even when
your words are not in it. You'll see what `notion` and four other tools give side by side, so you can pick the one
that fits your job.

`notion` copies the pages you choose into the local store that every WireCat tool shares, and `memo` searches that
store and shows what you have on a person. The one thing you need is a Notion token: a personal access token or a
connection's token. The tools compared:

- **notion**: this tool. It copies your pages and databases to your computer, searches them offline and gives them to
  an agent in the terminal or over MCP. What comes next is on its [roadmap](./roadmap.md).
- **[Notion MCP](https://developers.notion.com/guides/mcp/get-started-with-mcp)**: Notion's own MCP server, hosted by
  Notion, which your AI app signs in to.
- **[ntn](https://developers.notion.com/cli/get-started/overview)**: Notion's own command line, for pages as Markdown
  and for Notion Workers.
- **[notion-mcp-server](https://github.com/makenotion/notion-mcp-server)**: Notion's open source MCP server, which you
  run yourself with a token. Its README says it is
  [no longer actively maintained](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L6-L7).
- **[notion-exporter](https://github.com/yannbolliger/notion-exporter)**: a command line that downloads a page or a
  database as Markdown or CSV files through the export of Notion's web app (193 stars, updated 23 October 2026).

The marks for `notion` come from its code, checked on 17 November 2026. The marks for the other tools come from their
own documentation and source, checked on 16 November 2026, and on 17 November 2026 for comments, files and people. A
tool may do more than its pages say.

**On this page:**

1. [Features](#features)
2. [Notes on the marks](#notes-on-the-marks)
3. [When another tool fits better](#when-another-tool-fits-better)

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation · n/a does not apply

## Features

| Task | notion | [Notion MCP](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [ntn](https://developers.notion.com/cli/reference/commands) | [notion-mcp-server](https://github.com/makenotion/notion-mcp-server) | [notion-exporter](https://github.com/yannbolliger/notion-exporter) |
|---|:-:|:-:|:-:|:-:|:-:|
| **Find a page** | | | | | |
| Find a page by words inside it | ✅ | [✅](https://developers.notion.com/guides/mcp/tools-search-reference) | [❌](https://developers.notion.com/reference/post-search) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L22) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Find a page by meaning, not only by exact words | ✅ | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L11) | [❌](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L22) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Search your pages with no internet | ✅ | [❌](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L39) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Find a page together with your chats, mail and files from other services | ✅ | [🟡](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L23) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| See the pages a person wrote or last edited, next to that person's chats and mail | ✅ | [🟡](https://developers.notion.com/guides/mcp/tools-search-reference) | [❌](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L23) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Find database rows by a property value, such as Status is Done | 🟡 | [✅](https://developers.notion.com/guides/mcp/tools-databases-reference) | [✅](https://developers.notion.com/cli/reference/commands) | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L59) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| **Keep a copy and export** | | | | | |
| Keep a copy of chosen pages and databases on your computer, updated by each sync | ✅ | ➖ | [❌](https://developers.notion.com/cli/reference/commands) | ➖ | [🟡](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L76) |
| Export a page and the pages under it as Markdown files | 🟡 | ➖ | [🟡](https://developers.notion.com/cli/reference/commands) | ➖ | [✅](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L76) |
| **Write** | | | | | |
| Create a page or change its text from Markdown | ✅ | [✅](https://developers.notion.com/guides/mcp/tools-pages-reference) | [✅](https://developers.notion.com/cli/reference/commands) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L24) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Read a page's comments and reply to them | ✅ | [✅](https://developers.notion.com/guides/mcp/tools-comments-reference) | [🟡](https://developers.notion.com/cli/reference/commands) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/scripts/notion-openapi.json?plain=1#L1512-L1565) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Add a file from your computer to a page | ✅ | [🟡](https://developers.notion.com/guides/mcp/tools-files-reference) | [🟡](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/scripts/notion-openapi.json) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| **Agents and safety** | | | | | |
| An AI app works with your pages over MCP | ✅ | [✅](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L333) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Use it from Claude or ChatGPT on the web | ✅ | [✅](https://www.notion.com/help/notion-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L345) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| An agent with a terminal runs it, with JSON output and a skill | ✅ | n/a | [🟡](https://developers.notion.com/cli/reference/commands) | n/a | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| An agent can be limited to reading | ✅ | [🟡](https://www.notion.com/help/notion-mcp) | ➖ | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L112) | [✅](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/README.md?plain=1#L3-L6) |
| Allow or deny single commands for an agent | ✅ | ➖ | ➖ | ➖ | n/a |
| Preview a change before it is made | ✅ | [🟡](https://developers.notion.com/guides/mcp/tools-faqs) | ➖ | ➖ | n/a |
| Text from a page reaches the agent as data, never as instructions | 🟡 | ➖ | ➖ | ➖ | ➖ |
| **Setup** | | | | | |
| Works with an agent that has no browser | ✅ | [🟡](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [✅](https://developers.notion.com/cli/get-started/authentication) | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L138) | [🟡](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/README.md?plain=1#L78-L92) |
| Relies only on what Notion documents and supports | ✅ | [✅](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [✅](https://developers.notion.com/cli/get-started/overview) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L6-L7) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/README.md?plain=1#L119-L125) |

| | notion | Notion MCP | ntn | notion-mcp-server | notion-exporter |
|---|---|---|---|---|---|
| Install | npm, Node 22.16 or a later 22.x, or Node 24 or later | nothing: your AI app connects to Notion's server | install script, WinGet or npm | npx or Docker | npm |
| Licence | Apache-2.0 | a Notion service, on every plan | [MIT](https://www.npmjs.com/package/ntn) | MIT | MIT |
| Sign in | a personal access token or a connection's token, kept in the keyring | OAuth in the browser, or an MCP token on Business and Enterprise | in the browser, or a personal access token | a connection's token | the `token_v2` and `file_token` cookies of your browser |

## Notes on the marks

- **Find a page by words.** `notion search` searches the copy on your computer, in the text of each page and row.
  Notion's API search, which `ntn api v1/search` and notion-mcp-server call, finds pages by their title. Notion MCP
  runs Notion's own workspace search. Databases and the workspace itself are not search results in `notion`, only
  pages and rows.
- **By meaning.** `notion sync --embed` indexes the text with a model already downloaded to your computer, and then
  `notion search` finds a page by its meaning too. Notion MCP searches by meaning on Notion's side.
- **With your chats and mail.** The copy is in the local store every WireCat tool shares, so `memo search` and
  `memo search all` find a page next to your messages, mail and files from the other WireCat tools. Each hit names
  `notion` and the profile it came from. Notion MCP searches connected services such as Slack and Google Drive on the
  Business and Enterprise plans with Notion AI.
- **A person's pages.** Each sync saves a page's creator and last editor as people in the local store, with the names
  and email addresses Notion gives. An email address joins them with the same person from your mail, chats or other
  tools, so `memo context` lists the Notion pages under that person's files. Notion gives the email addresses only
  when the connection may read user information including email addresses. Without them, the authors are joined with
  no one, and `notion sync` and `notion doctor` say so. A relationship your agent adds to a page waits until you
  confirm it. Notion MCP finds the pages a user created in Notion, but does not join that user with anyone from your
  other services.
- **Database rows by property.** `notion` keeps each row's properties in the copy as lines such as `Status: Done`,
  so `notion search` finds them as words, not as a field. A filter on a property works today only through the raw
  API command `notion <profile> api post-database-query`, with a JSON body. A ready search by property, such as
  `status:Done`, is planned. On Notion MCP a query by property shares a limited allowance per workspace below the
  Business plan with Notion AI.
- **A copy on your computer.** `notion sync` copies the chosen pages, the pages under them, databases and their rows,
  and each next sync takes only what changed. notion-exporter downloads a page tree once (`-r <folder>`) and keeps no
  record of what changed.
- **Export.** `notion documents export` writes one page from the copy to a Markdown file. `ntn pages get` prints one
  page as Markdown. notion-exporter writes the whole page tree, and a database as a CSV file. No tool here keeps a
  folder of Markdown files in step with Notion both ways. `notion` plans one.
- **Write.** `notion documents create` makes a page under another page from Markdown, and `notion documents update`
  replaces a page's text. Each write has its own permission and `--dry-run`. An update that would delete a child page
  or database is refused unless you allow it. notion-mcp-server writes through tools made from Notion's API, and an
  agent writes the JSON body itself.
- **Comments.** `notion comments list` reads a page's open comments live, as Notion's API gives no resolved ones.
  `notion comments create` starts a discussion and `notion comments reply` answers in one. Notion MCP reads resolved
  discussions too. ntn has no comment command, so a script calls Notion's comment API through `ntn api`.
  notion-mcp-server reads open comments and adds new ones through tools made from Notion's API, but cannot reply
  in a discussion.
- **Files.** `notion files upload` adds a file from your computer to the end of a page as an image, video, audio, PDF
  or file block, and sends a file over 20 MB in parts. Notion MCP gives the AI app an address to upload to, and the app
  sends the file itself, in one part of up to 20 MiB. `ntn files create` uploads a file to Notion, and its command
  reference shows no command that adds the file to a page. notion-mcp-server has no tool for uploads.
- **Limited to reading.** The `permissions` setting gives a command the level `readonly` or `deny`, and
  `WCNOTION_READ_ONLY=1` refuses every write. By default the MCP server offers the writes too, and over MCP an `ask`
  level lets a command run. See [settings](./configuration.md#permissions). notion-mcp-server reads only with a
  token that has only the "Read content" capability. On Notion MCP, turning off editing in MCP clients and blocking AI
  apps that are not approved are both admin controls of MCP Governance, on the Enterprise plan only.
- **Preview.** `--dry-run` shows what a command would do and sends nothing. Notion MCP can propose a page edit that
  someone reviews before it applies, on the Business and Enterprise plans.
- **Text as data.** The `notion` MCP server tells the agent that page text, titles and property names come from
  other people and are data, never instructions. The text itself is not marked inside each answer.
- **No browser.** Notion MCP takes a token without a browser only when a workspace owner on the Business or
  Enterprise plan creates one. notion-exporter needs two cookies copied by hand from a browser where you are signed in.
- **What Notion supports.** notion-exporter uses the export of Notion's web app, an internal API that its README
  says "may break anytime". notion-mcp-server calls the public API, but Notion no longer maintains it.

## When another tool fits better

- **Notion MCP**: you want Claude or ChatGPT to search, write and organise your workspace with nothing to install,
  and your pages do not need to be on your computer.
- **ntn**: you build Notion Workers, or you want Notion's own command line with sign-in in the browser.
- **notion-exporter**: you want a page tree or a database as Markdown and CSV files once, such as for a static site
  or a backup.

If `notion` fits, start with [installation](./installation.md).
