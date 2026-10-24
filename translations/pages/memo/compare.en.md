---
title: "Compared with other tools"
---

Several open tools give an AI agent a memory. Most of them are memory engines: you push data into them, and a
model works out what to remember. `memo` works the other way. It reads your own notes, mail and messenger
archives into one local store, and your agent searches that store and keeps what you confirm. This page puts
`memo` next to five of these tools so you can pick the one that fits your job. It says what each tool does. It does
not say which finds better answers, because nobody has measured that here.

The marks come from each project's own documentation and source, checked on 24 October 2026; a tool may do more
than its documentation says. Each mark for another tool links to the page it comes from. The marks for `memo` were
checked against version 0.90.0.

The tools:

- **memo** — this tool: a command line and an MCP server over a local store of your notes, mail and messages.
- **[Hindsight][hs]** — an agent memory server: an agent saves text and asks questions, and a model pulls out facts.
- **[mem0][m0]** — a memory layer for apps: a library, a self-hosted server and a hosted platform.
- **[Graphiti][gr]** — a framework that builds a knowledge graph of facts that change over time. Zep is its paid cloud.
- **[Cognee][cg]** — a memory platform that turns documents and conversations into a knowledge graph.
- **[basic-memory][bm]** — Markdown notes that an agent reads and writes over MCP.

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation

## Features

| Feature | memo | Hindsight | mem0 | Graphiti | Cognee | basic-memory |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Find what you already have** | | | | | | |
| Reads your Telegram, MAX and WhatsApp chats itself | ✅ | ❌ [↗][hs-core] | ❌ [↗][m0] | ❌ [↗][gr] | ➖ | ❌ [↗][bm] |
| Reads a folder of notes | ✅ | ✅ [↗][hs-int] | ➖ | ❌ [↗][gr] | 🟡 [↗][cg] | ✅ [↗][bm] |
| Reads meeting transcripts | ✅ | ➖ | ➖ | ❌ [↗][gr] | ➖ | ❌ [↗][bm] |
| Reads Google Drive documents | 🟡 | ➖ | ➖ | ❌ [↗][gr] | ✅ [↗][cg-news] | ❌ [↗][bm] |
| Every hit names its source | ✅ | ✅ [↗][hs-core] | ➖ | 🟡 [↗][gr-mcp] | ➖ | ✅ [↗][bm] |
| **Mail** | | | | | | |
| Sync Gmail and IMAP into a local copy | ✅ | ❌ [↗][hs-core] | ❌ [↗][m0] | ❌ [↗][gr] | ✅ [↗][cg-news] | ❌ [↗][bm] |
| Search mail offline, together with chats and notes | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Choose what to import by sender, kind of mail or your Gmail filters | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Find likely spam or fraud senders | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Move chosen mail to Gmail's Trash and restore it | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Import years of old mail from a Google Takeout file | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Know a person or a project** | | | | | | |
| People, organizations and projects with links between them | ✅ | ✅ [↗][hs-core] | 🟡 [↗][m0-price] | ✅ [↗][gr] | ✅ [↗][cg] | ✅ [↗][bm] |
| Tasks, agenda and reminders built in | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Remember** | | | | | | |
| An agent saves a fact or memory over MCP | ✅ | ✅ [↗][hs-mcp] | ✅ [↗][m0-mcp] | ✅ [↗][gr-mcp] | ✅ [↗][cg-mcp] | ✅ [↗][bm] |
| Facts and memories are found in conversations and text without anyone saving them | ❌ | ✅ [↗][hs-core] | ✅ [↗][m0] | ✅ [↗][gr] | ✅ [↗][cg] | 🟡 [↗][bm] |
| A fact that changed is replaced and the old one kept with its dates | 🟡 | 🟡 [↗][hs-core] | 🟡 [↗][m0] | ✅ [↗][gr] | ➖ | ➖ |
| **Agents and safety** | | | | | | |
| An agent can read but not write unless you allow it | ✅ | ➖ | ➖ | ➖ | ➖ | 🟡 [↗][bm] |
| Permission set per command: deny, read only, ask or allow | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| What an agent saves waits until you confirm it | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| A log of every agent call | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| An agent edits notes, tasks and tags over MCP | ✅ | ➖ | ➖ | ➖ | ➖ | ✅ [↗][bm] |
| Skill or plugin for coding agents | ✅ | ✅ [↗][hs] | ✅ [↗][m0] | ➖ | ✅ [↗][cg] | ✅ [↗][bm] |
| **Setup** | | | | | | |
| Installs without Docker or a database server | ✅ | 🟡 [↗][hs] | ✅ [↗][m0] | ❌ [↗][gr-db] | ✅ [↗][cg] | ✅ [↗][bm] |
| Works with no LLM key | ✅ | ❌ [↗][hs-core] | ➖ | ❌ [↗][gr-env] | ✅ [↗][cg-news] | ✅ [↗][bm] |
| MCP over stdio, started by your agent app | ✅ | ❌ [↗][hs-mcp] | 🟡 [↗][m0-mcp] | ➖ | ➖ | ✅ [↗][bm] |
| MCP over HTTP, for a server or a remote agent | ❌ | ✅ [↗][hs-mcp] | ✅ [↗][m0-mcp] | ➖ | ➖ | ✅ [↗][bm] |
| Hosted cloud, so the same memory is there from any device | ❌ | ✅ [↗][hs-price] | ✅ [↗][m0] | 🟡 [↗][gr] | ✅ [↗][cg] | ✅ [↗][bm] |
| A visual interface | ❌ | ✅ [↗][hs] | ✅ [↗][m0] | ❌ [↗][gr] | ✅ [↗][cg] | 🟡 [↗][bm] |
| Libraries for building your own app | ❌ | ✅ [↗][hs] | ✅ [↗][m0] | ✅ [↗][gr] | ✅ [↗][cg] | ➖ |
| Publishes a memory benchmark score | ❌ | ✅ [↗][hs-bench] | ✅ [↗][m0] | ➖ | ✅ [↗][cg] | ➖ |

Notes on `memo`:

- **Sources.** Telegram, MAX, WhatsApp, Zoom meetings and Google Drive reach the store through the sister tools
  `tg`, `max`, `wa`, `zm` and `drive`. `memo` reads that store. It imports notes folders and mail itself; mail
  goes through [Himalaya](https://github.com/pimalaya/himalaya), and [mail](./mail.md) is covered below. `search all` covers messages, mail and notes;
  meetings have their own `search meetings`.
- **Search.** All six tools search by words and by meaning. This page does not rank them. In `memo`, search by
  meaning uses a local model that `memo models text download` fetches; without it, word search still works.
- **No LLM key.** Sync and search never call a model. `ask --analyze` calls a model you configure, and only if you ask.
- **MCP.** `memo mcp` runs on stdio only. There is no HTTP mode yet. It offers 124 tools made from the commands,
  writes included, except `mcp`, `upgrade`, `skill install`, `auto start` and `auto stop`. `memo` never sends a
  message or mail.
- **Safety.** Permissions in the configuration set each command to `deny`, `readonly`, `ask` or `allow`.
  `MEMO_READ_ONLY=1` removes the writing tools. Memories, facts and actions an agent adds are saved as proposed
  until you confirm them. Decisions on project proposals are the exception: an agent may make them, with a
  recorded reason, until you set `agent_decisions` to `false`.
- **Knowledge.** `memo` stores messages and the facts and links you or your agent record, each with the message,
  note or meeting that shows it. It does not find facts in text by itself. A fact takes the date it happened, and a
  decision can be marked as replacing an earlier one. Nothing ends a fact by itself when the world changes.
- **Platforms.** Tested on Linux only; macOS and Windows are not tested yet.
- **Benchmark.** No memory benchmark result for `memo` is published. The scores the other tools publish come from
  their own tests on their own data and are not comparable with each other.

## memo mail compared with email tools

Mail is a tool of its own in `memo`. The memory tools above do not do this job, so this table puts `memo` next to
tools people use for mail. `memo` reads mail through Himalaya, so Himalaya is the layer under it, not only a rival.
The marks come from each project's documentation, checked on 24 October 2026.

- **[Himalaya][hm]** — a mail command line for IMAP, SMTP, JMAP, Gmail and others. `memo` calls it to read mail.
- **[gog][gg]** — one command line for Google services; its `gmail` commands read, send and manage Gmail.
- **[Google Workspace MCP][ws]** — a maintained MCP server for Google services, with Gmail tools. The best known
  Gmail MCP server is archived, so it is not compared.
- **[notmuch][nm]** — fast search and tags over mail you already hold in a local folder.

| Feature | memo | Himalaya | gog (Gmail) | Google Workspace MCP | notmuch |
|---|:-:|:-:|:-:|:-:|:-:|
| Read Gmail | ✅ | ✅ [↗][hm-gmail] | ✅ [↗][gg-mail] | ✅ [↗][ws] | ❌ [↗][nm] |
| Read other IMAP mail, such as Fastmail | ✅ | ✅ [↗][hm-gmail] | ❌ [↗][gg] | ❌ [↗][ws] | ❌ [↗][nm] |
| Keep a local copy and search it with no internet | ✅ | 🟡 [↗][hm] | ➖ | ➖ | ✅ [↗][nm] |
| Search mail together with chats and notes | ✅ | ➖ | ➖ | ➖ | ➖ |
| Read the text inside attachments such as PDFs | ✅ | ➖ | ➖ | ➖ | ➖ |
| Find likely spam or fraud senders | ✅ | ➖ | ➖ | ➖ | ➖ |
| Create Gmail filters | ❌ | ❌ [↗][hm] | ✅ [↗][gg-mail] | ✅ [↗][ws] | ➖ |
| Label or archive mail in Gmail | ❌ | ➖ | ✅ [↗][gg-mail] | ✅ [↗][ws] | ➖ |
| Write and send mail | ❌ | ✅ [↗][hm] | ✅ [↗][gg-mail] | ✅ [↗][ws] | ❌ [↗][nm] |
| Read a Google Takeout mbox file | ✅ | 🟡 [↗][hm] | ➖ | ➖ | 🟡 [↗][nm] |
| MCP server | ✅ | ➖ | ✅ [↗][gg-mcp] | ✅ [↗][ws] | ➖ |
| An agent can read mail but not change it | ✅ | ➖ | ✅ [↗][gg] | ✅ [↗][ws] | ➖ |

Notes on `memo`:

- **Himalaya.** `memo` needs it installed and set up first. It reads mailboxes through it and changes nothing there,
  except `memo mail trash` and `memo mail restore`, which move mail to and from Gmail's Trash only with `--yes`.
- **Filters.** `memo` does not create filters in Gmail. It reads a Gmail filter export and turns each filter into
  a rule for what to import.
- **Sending.** `memo` never sends mail. It has no code for it.
- **Himalaya marks.** The partial marks mean: a Maildir folder can be read and listed, but Himalaya builds no search
  index; mbox is a supported format, but Takeout is not named. Himalaya also manages server-side Sieve filters,
  which are not Gmail filters.
- **notmuch marks.** It reads mail you already hold as Maildir, so it needs a sync tool such as `offlineimap`
  beside it, and it converts an mbox file to Maildir first.

### Where another tool fits better

- **You want an agent to write, reply to or send mail.** Himalaya, gog and the Google Workspace MCP send mail;
  `memo` only reads it.
- **You manage Gmail itself: labels, archive, filters.** gog and the Google Workspace MCP change Gmail's own
  settings; `memo` only trashes and restores mail.
- **You live in a mail client and want fast tag-based search with no other tools.** notmuch is built for that,
  and a text editor or terminal client sits on top of it.

## Install and licence

| | memo | [Hindsight][hs] | [mem0][m0] | [Graphiti][gr] | [Cognee][cg] | [basic-memory][bm] |
|---|---|---|---|---|---|---|
| Install | npm, pnpm, Bun | Docker, pip or embedded | library, self-hosted server, hosted platform, CLI | needs Neo4j or FalkorDB | pip | uv |
| Licence | Apache-2.0 | MIT | Apache-2.0 | Apache-2.0 | Apache-2.0 | AGPL-3.0 |
| Price | free | self-host free; [Cloud pay per use][hs-price] | [free Hobby plan, paid plans][m0-price] | bring your own database; Zep is paid | Cognee Cloud is optional | Cloud from $15 a month |

## When another tool fits better

- **You want memory to build itself from conversations.** Hindsight, mem0, Graphiti and Cognee use a model to pull
  facts and entities out of what you feed them. `memo` keeps only what you or your agent record and you confirm.
- **You need facts that change over time, handled for you.** Graphiti marks an old fact as no longer true when new
  information arrives, and keeps both. `memo` records dates and replaced decisions, but you or your agent mark them.
- **You are building a product for other people, or need a hosted service.** Hindsight, mem0 and Cognee have
  libraries, a cloud, a dashboard and MCP over HTTP; mem0, Hindsight and Cognee publish benchmark scores. `memo` is a
  tool for one person's computer, with a terminal and stdio MCP.
- **You live in Markdown notes and want sync and a mobile app.** basic-memory's cloud syncs notes between devices.
  `memo` has one store per computer and no interface of its own.

If `memo` fits, start with [installation](./installation.md); to connect an agent without a terminal,
see [the MCP server](./mcp.md).

[hs]: https://github.com/vectorize-io/hindsight
[hs-core]: https://github.com/vectorize-io/hindsight#core-concepts
[hs-mcp]: https://hindsight.vectorize.io/developer/mcp-server
[hs-int]: https://hindsight.vectorize.io/sdks/integrations/obsidian
[hs-bench]: https://benchmarks.hindsight.vectorize.io/
[hs-price]: https://vectorize.io/pricing
[m0]: https://github.com/mem0ai/mem0
[m0-mcp]: https://docs.mem0.ai/platform/mem0-mcp
[m0-price]: https://mem0.ai/pricing
[gr]: https://github.com/getzep/graphiti
[gr-db]: https://github.com/getzep/graphiti#requirements
[gr-env]: https://github.com/getzep/graphiti#optional-environment-variables
[gr-mcp]: https://github.com/getzep/graphiti/tree/main/mcp_server
[cg]: https://github.com/topoteretes/cognee
[cg-news]: https://github.com/topoteretes/cognee#latest-news
[cg-mcp]: https://docs.cognee.ai/cognee-mcp/mcp-overview
[bm]: https://github.com/basicmachines-co/basic-memory
[hm]: https://github.com/pimalaya/himalaya
[hm-gmail]: https://github.com/pimalaya/himalaya#gmail
[gg]: https://github.com/openclaw/gogcli
[gg-mail]: https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md
[gg-mcp]: https://github.com/openclaw/gogcli/blob/main/docs/mcp.md
[ws]: https://github.com/taylorwilsdon/google_workspace_mcp
[nm]: https://notmuchmail.org/
