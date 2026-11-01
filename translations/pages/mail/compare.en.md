---
title: "Compared with other tools"
---

`mail` is a command line and an MCP server that copies your mailbox over IMAP into the shared WireCat store on your
computer, searches it, and organises the mailbox on the server. This page puts it next to the other mail command lines
and MCP servers, so you can see which one fits your job. The marks for `mail` come from its documentation and source on
`main`, checked on 1 November 2026 (commit `bdcfa9e`, the code after release 0.5.0 that the next release carries). The
marks for the other tools come from their own READMEs and documentation, checked on 28 October 2026. Nothing was logged
in to or tested against a real mailbox, and a tool may do more than its pages say.

The tools:

- **mail**: this tool. Copies a mailbox over IMAP into the shared store, searches and reads it, and organises the
  mailbox on the server (flags, moves, Trash, folders, drafts). It does not send mail yet.
  [memo](../memo/mail.md) searches the same mail together with your chats and notes.
- **[Himalaya](https://github.com/pimalaya/himalaya)**: a Rust command line for mail over IMAP, SMTP, JMAP, Gmail,
  Microsoft Graph, Maildir and mbox (v2.2.1, 2 October 2026).
- **[mu](https://github.com/djcb/mu)**: indexes a Maildir into a search database, with a fast search command line
  (v1.14.4, 14 October 2026).
- **[gog](https://github.com/openclaw/gogcli)**: one command line for Gmail, Calendar, Drive and more, built for
  agents, with an MCP server (v0.47.1, 27 October 2026).
- **[Google Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp)**: an MCP server for 12 Google
  services, 15 of its tools for Gmail (v2.2.1, 27 October 2026).
- **[Microsoft 365 MCP](https://github.com/Softeria/ms-365-mcp-server)**: an MCP server for Microsoft Graph, with
  Outlook mail among 300 or more tools (v0.176.0, 28 October 2026).

[NeoMutt](https://github.com/neomutt/neomutt) is not in the table: it is a mail program for a person at a terminal,
and its pages say little about agents. It is named below.

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation · n/a does not apply

## Features

| Task | mail | [Himalaya](https://github.com/pimalaya/himalaya#usage) | [mu](https://github.com/djcb/mu#readme) | [gog](https://github.com/openclaw/gogcli#readme) | [Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [Microsoft 365 MCP](https://github.com/Softeria/ms-365-mcp-server#readme) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Read and search** | | | | | | |
| Search by sender, date and words in one query | ✅ | [✅](https://github.com/pimalaya/himalaya#usage) | [✅](https://github.com/djcb/mu/blob/master/man/mu-query.7.org) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | ➖ |
| Search the mail server for mail not copied yet | ✅¹ | [✅](https://github.com/pimalaya/himalaya#usage) | [❌](https://github.com/djcb/mu#readme) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | ➖ |
| Read a whole conversation at once | ✅ | ➖ | [✅](https://github.com/djcb/mu/blob/master/man/mu-find.1.org) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | ➖ |
| Read and search with no internet | ✅ | [🟡](https://github.com/pimalaya/himalaya#features) | [✅](https://github.com/djcb/mu#readme) | ➖ | ➖ | ➖ |
| Find a message with an attachment and save the file | 🟡² | [✅](https://github.com/pimalaya/himalaya#usage) | [✅](https://github.com/djcb/mu/blob/master/man/mu-extract.1.org) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| **Keep a copy** | | | | | | |
| Keep mail in one store with chats, meetings and notes, and search them together | ✅³ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Organise** | | | | | | |
| Move, archive, flag or delete a message | ✅⁴ | [✅](https://github.com/pimalaya/himalaya#usage) | [✅](https://github.com/djcb/mu/blob/master/man/mu-move.1.org) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| Undo a change the tool made | ✅⁴ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Create, rename and delete folders | ✅ | [✅](https://github.com/pimalaya/himalaya#usage) | ➖ | ➖ | ➖ | ➖ |
| Tag or label messages | 🟡⁵ | [🟡](https://github.com/pimalaya/himalaya#usage) | [✅](https://github.com/djcb/mu/blob/master/man/mu-labels.1.org) | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://workspacemcp.com/gmail) | ➖ |
| Sort new mail with rules you can export and review | ✅ | [🟡](https://github.com/pimalaya/himalaya#features) | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| **Reply and send** | | | | | | |
| Keep a draft without sending it | ✅⁶ | [✅](https://github.com/pimalaya/himalaya#usage) | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| Send, reply or forward | ❌⁷ | [✅](https://github.com/pimalaya/himalaya#features) | [🟡](https://github.com/djcb/mu#readme) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| **Mailboxes and providers** | | | | | | |
| Any IMAP mailbox that offers app passwords (Yandex, iCloud, Fastmail, your own server) | ✅ | [✅](https://github.com/pimalaya/himalaya#features) | [❌](https://github.com/djcb/mu#readme) | [❌](https://github.com/openclaw/gogcli#readme) | [❌](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [❌](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Gmail with its labels | 🟡⁸ | [✅](https://github.com/pimalaya/himalaya#configuration) | [🟡](https://github.com/djcb/mu#readme) | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | n/a |
| Outlook and Microsoft 365 | ❌⁹ | [🟡](https://github.com/pimalaya/himalaya#configuration) | ➖ | n/a | n/a | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Use JMAP or Microsoft Graph instead of IMAP | ❌⁹ | [✅](https://github.com/pimalaya/himalaya#features) | ➖ | n/a | n/a | n/a |
| **Agents and safety** | | | | | | |
| An agent can read mail but not send or change it | ✅¹⁰ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/safety-profiles.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Allow or deny single commands for an agent | ✅ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Show what a deletion or a big change would touch, and ask before it runs | ✅¹¹ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | ➖ | ➖ |
| Tell the agent that mail text is data, not instructions | ✅ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | ➖ | ➖ |
| MCP server | ✅ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/mcp.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| **Setup** | | | | | | |
| Start from just an address, with no cloud app to register first | ✅ | [✅](https://github.com/pimalaya/himalaya#features) | ➖ | [❌](https://github.com/openclaw/gogcli#readme) | [❌](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Sign in with OAuth | ❌⁹ | [❌](https://github.com/pimalaya/himalaya#faq) | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |

| | mail | Himalaya | mu | gog | Workspace MCP | Microsoft 365 MCP |
|---|---|---|---|---|---|---|
| Install | npm, Node 22.16 or later | [brew, cargo or a release file](https://github.com/pimalaya/himalaya#installation) | [distro package or meson build](https://github.com/djcb/mu#readme) | [brew or go install](https://github.com/openclaw/gogcli#readme) | [uvx](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [npx](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Licence | Apache-2.0 | Apache-2.0 | GPL-3.0 | MIT | MIT | MIT |

¹ `search messages` asks the mail server too (`--backend archive|server|both`, default `both`). Gmail is searched in
All Mail with Gmail's own syntax. Other servers are searched with IMAP `SEARCH` in INBOX, Sent and Archive, or the
profile's folders. What the server finds is stored, and each hit says where it was found. `--offline` keeps to the
store.

² `mail` finds mail by the text inside attachments and shows the first 4,000 characters of each. It does not download
the file. Downloading attachments comes with sending and is not available yet.

³ The store is shared with the other WireCat tools. `mail` searches its own mailbox; [memo](../memo/mail.md) searches
every mailbox together with chats and notes.

⁴ Flags, moves, copies and folders change the mailbox on the server. A deletion moves mail to Trash and never expunges
it. `messages restore --run <id>` undoes a run, last step first, as long as the provider has not emptied Trash;
`mail doctor` warns when that is close on Gmail. A deletion, a change chosen by a query, and a change of more than 20
messages are shown as a preview first and run only with `--yes`.

⁵ `mail` tags stored mail and conversations with your own tags. They stay in the local store and never reach the
server. Flags and keywords on the server are changed with `messages update --flag`, and Gmail labels with
`messages move` and `copy`.

⁶ Drafts are saved in the mailbox's own Drafts folder, so you can check and send one from any mail app. There are no
templates.

⁷ Sending, reply, forward and downloading attachments are in progress and not available yet. See the
[roadmap](./roadmap.md).

⁸ `mail` signs in to Gmail with an app password and reads All Mail. A Google Workspace domain that turns app
passwords off cannot be used.

⁹ OAuth sign-in is on the [roadmap](./roadmap.md). Microsoft accepts only OAuth for IMAP, so Outlook and Microsoft 365
mailboxes cannot be added yet. `mail` reads IMAP only: no JMAP, no Microsoft Graph, no Sieve filters on the server, no
PGP.

¹⁰ Over MCP, `mail` changes the mailbox only when the server is started with `--allow-writes`, and then only within the
profile's permissions. `MAIL_READ_ONLY=1` refuses every change.

¹¹ A deletion, deleting a folder that holds mail, and a change of many messages ask by default, and `deny` forbids
them. Without `--yes` they answer with a preview and the command to repeat. Over MCP there is no one to answer an
`ask`, so `ask` lets the command run; `deny` still refuses. `--dry-run` previews any command.

Notes on the Himalaya column: its marks come from its README, and from the read only `--help` of v2.2.1. Nothing was
run against a mailbox. Its pages name no read only mode, no command allowlist and no MCP server. Its mbox and Maildir
support is a backend; its pages name no command that exports a mailbox to them.

Notes on the `mail` column:

- **Changes.** Each change run keeps, in a private file, what it needs to undo itself: the folder, UID, flags, Gmail
  labels and Message-ID of each message, never a subject or a body. Each attempt goes into the send journal.
- **Export.** `messages export` writes the original messages that match a query to mbox files or a Maildir tree, for
  backup or for mu and notmuch.
- **Permissions.** Each profile sets `allow`, `ask`, `readonly` or `deny` per command. `--permission` on `mcp serve`
  can only make a profile stricter. See [settings](./configuration.md#permissions).
- **Speed and cost against a browser agent.** `mail` reads the mail server over IMAP and opens no browser. No
  measurement of it against a browser agent is published, so this page makes no claim.

## When another tool fits better

- **Himalaya**: you want to send, reply or forward mail from the terminal today, download attachments, or use a
  provider that is not IMAP, such as JMAP or Microsoft Graph.
- **gog**: you use Gmail only and want an agent that can read, draft and send, with a switch that stops sending, and
  commands compiled in so the agent cannot widen them.
- **Microsoft 365 MCP**: your mailbox is Outlook or Microsoft 365 and an agent must use it today. `mail` has no OAuth
  yet.
- **mu**: you already keep a Maildir and want a fast search over it with attachments and threads.

If `mail` fits, start with [installation](./installation.md). To connect an agent, see [use it](./usage.md).
