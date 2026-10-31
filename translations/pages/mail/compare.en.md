---
title: "Compared with other tools"
---

`mail` is a command line and an MCP server that copies your mailbox over IMAP into the shared WireCat store on your
computer. This page puts it next to the other mail command lines and MCP servers, so you can see which one fits your
job. The marks for `mail` come from its documentation and source, checked on 1 November 2026 against its first release
(0.1.0). The marks for the other tools come from their own READMEs and documentation, checked on 28 October 2026.
Nothing was logged in to or tested against a real mailbox, and a tool may do more than its pages say.

The tools:

- **mail**: this tool. Copies a mailbox over IMAP into the shared store and never changes the mailbox. It does not
  send mail. You search and read the stored mail with [memo](../memo/mail.md).
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
| See new or unread mail | 🟡¹ | [✅](https://github.com/pimalaya/himalaya#usage) | [✅](https://github.com/djcb/mu/blob/master/man/mu-query.7.org) | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| Search by sender, date and words in one query | 🟡¹ | [✅](https://github.com/pimalaya/himalaya#usage) | [✅](https://github.com/djcb/mu/blob/master/man/mu-query.7.org) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | ➖ |
| Read and search with no internet | 🟡¹ | [🟡](https://github.com/pimalaya/himalaya#features) | [✅](https://github.com/djcb/mu#readme) | ➖ | ➖ | ➖ |
| Find a message with an attachment and save the file | ❌ | [✅](https://github.com/pimalaya/himalaya#usage) | [✅](https://github.com/djcb/mu/blob/master/man/mu-extract.1.org) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| **Keep a copy** | | | | | | |
| Copy a big mailbox in parts and carry on after a stop | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Keep mail in one store with chats, meetings and notes, and search them together | ✅² | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Organise and send** | | | | | | |
| Move, archive, flag or delete a message | ❌ | [✅](https://github.com/pimalaya/himalaya#usage) | [✅](https://github.com/djcb/mu/blob/master/man/mu-move.1.org) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| Send, reply or forward | ❌ | [✅](https://github.com/pimalaya/himalaya#features) | [🟡](https://github.com/djcb/mu#readme) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| Keep a draft without sending it | ❌ | [✅](https://github.com/pimalaya/himalaya#usage) | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| **Mailboxes and providers** | | | | | | |
| Use several mailboxes in one tool | ✅ | [✅](https://github.com/pimalaya/himalaya#features) | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | [🟡](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#multi-account-support) |
| Any IMAP mailbox that offers app passwords (Yandex, iCloud, Fastmail, your own server) | ✅ | [✅](https://github.com/pimalaya/himalaya#features) | [❌](https://github.com/djcb/mu#readme) | [❌](https://github.com/openclaw/gogcli#readme) | [❌](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [❌](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Gmail | 🟡³ | [✅](https://github.com/pimalaya/himalaya#configuration) | [🟡](https://github.com/djcb/mu#readme) | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | n/a |
| Outlook and Microsoft 365 | ❌⁴ | [🟡](https://github.com/pimalaya/himalaya#configuration) | ➖ | n/a | n/a | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| **Agents and safety** | | | | | | |
| An agent can read mail but not send or change it | ✅⁵ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/safety-profiles.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Allow or deny single commands for an agent | ✅ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Preview what a command would do before it runs | 🟡⁶ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | ➖ | ➖ |
| Tell the agent that mail text is data, not instructions | ✅ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | ➖ | ➖ |
| MCP server | ✅ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/mcp.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Mailbox password kept only in the system keyring | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Setup** | | | | | | |
| Start from just an address, with no cloud app to register first | ✅ | [✅](https://github.com/pimalaya/himalaya#features) | ➖ | [❌](https://github.com/openclaw/gogcli#readme) | [❌](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Sign in with OAuth | ❌⁴ | [❌](https://github.com/pimalaya/himalaya#faq) | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| MCP over HTTP, for Claude or ChatGPT in the browser | ✅ | ➖ | ➖ | ➖ | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |

| | mail | Himalaya | mu | gog | Workspace MCP | Microsoft 365 MCP |
|---|---|---|---|---|---|---|
| Install | npm, Node 22.16 or later | [brew, cargo or a release file](https://github.com/pimalaya/himalaya#installation) | [distro package or meson build](https://github.com/djcb/mu#readme) | [brew or go install](https://github.com/openclaw/gogcli#readme) | [uvx](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [npx](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Licence | Apache-2.0 | Apache-2.0 | GPL-3.0 | MIT | MIT | MIT |

¹ `mail` has no list, show or search command. It fills the store, and [memo](../memo/mail.md) lists, searches and
reads what is in it, with no internet.

² The store is shared with the other WireCat tools. The search across all of it is done by memo.

³ `mail` signs in to Gmail with an app password. It does not use Gmail's labels, and a Google Workspace domain that
turns app passwords off cannot be used.

⁴ OAuth sign-in is the next item on the [roadmap](./roadmap.md). Microsoft accepts only OAuth for IMAP, so Outlook and
Microsoft 365 mailboxes cannot be added yet.

⁵ `mail` has no command that sends, moves, flags or deletes mail. `MAIL_READ_ONLY=1` also refuses every write to the
local store.

⁶ `--dry-run` shows the parsed arguments and the permissions of a command before it runs. It does not list the mail a
command would change.

Notes on the Himalaya column: its marks come from its README, and from the read only `--help` of v2.2.1. Nothing was
run against a mailbox. Its pages name no read only mode, no command allowlist and no MCP server.

Notes on the `mail` column:

- **Read only.** `mail` cannot change or send mail, so an agent that uses it cannot either. Sending is not planned in
  the [roadmap](./roadmap.md).
- **Attachments.** `mail` stores text and headers. It does not store attachment bytes.
- **Permissions.** Each profile sets `allow`, `ask`, `readonly` or `deny` per command. Over MCP no one can answer an
  `ask`, so the command runs. `--permission` on `mcp serve` can only make a profile stricter. See
  [settings](./configuration.md#permissions).
- **Speed and cost against a browser agent.** `mail` reads the mail server over IMAP and opens no browser. No
  measurement of it against a browser agent is published, so this page makes no claim.

## When another tool fits better

- **Himalaya**: you want to send, reply, move or delete mail from the terminal, or you use a provider that is not
  IMAP, such as JMAP or Microsoft Graph.
- **gog**: you use Gmail only and want an agent that can read and draft, with a switch that stops sending, and
  commands compiled in so the agent cannot widen them.
- **Microsoft 365 MCP**: your mailbox is Outlook or Microsoft 365 and an agent must use it today. `mail` has no OAuth
  yet.
- **NeoMutt**: you read and write mail yourself all day. `mail` is not a mail client.
- **mu**: you already keep a Maildir and want a fast search over it with attachments and threads.

If `mail` fits, start with [installation](./installation.md). To connect an agent, see [use it](./usage.md).
