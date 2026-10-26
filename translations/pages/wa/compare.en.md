---
title: "Compared with other tools"
---

Several open tools connect a personal WhatsApp account to a terminal or an AI agent, and Meta has an official API for
business numbers. This page puts `wa` next to five of them, by the jobs people do: catch up, reply, send files, find
things, look after groups, and hand the account to an agent. Use it to pick the tool that fits your job.

Every mark was checked on 24 October 2026. Our marks come from the `main` branch of `wa` and from
running a build of it; some commands were not tried on a real account, and [using wa](./usage.md#not-in-wa-yet) lists
what `wa` does not do. A mark for another tool comes from its own documentation or source, linked
[below the table](#where-the-marks-come-from). A tool may do more than its documentation says.

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation · n/a does not apply

The tools:

- **wa**: this tool. A command line and an MCP server for your own WhatsApp account, with a searchable local copy of
  your chats.
- **[wacli](https://github.com/openclaw/wacli)**: a command line with a local copy of your chats, search and
  background sync. It has no MCP server.
- **[whatsapp-mcp](https://github.com/verygoodplugins/whatsapp-mcp)**: a WhatsApp MCP server with a local copy of
  your chats, maintained by Very Good Plugins. It is forked from
  [lharries/whatsapp-mcp](https://github.com/lharries/whatsapp-mcp). Its last change was on 20 October 2026.
- **[mudslide](https://github.com/robvanderleek/mudslide)**: a command line that sends messages from scripts. Its
  README says it is for sending only.
- **[WhatsApp Channel](https://github.com/Rich627/whatsapp-claude-plugin)**: a plugin for Claude Code that lets the
  agent answer chats from your account. It also runs as a plain MCP server.
- **[WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/overview)**: Meta's official API.
  It works with business phone numbers, not with a personal account.

## What each tool does

| Task | wa | wacli | whatsapp-mcp (fork) | mudslide | WhatsApp Channel | Cloud API |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| | **Catch up** | | | | | |
| See other people's unread messages without telling anyone you read them | ✅ | 🟡¹ | ✅³⁰ | ❌ | 🟡² | ➖ |
| List the chats where someone waits for your answer | ✅ | ➖ | ➖ | ❌ | ✅ | ➖ |
| | **Reply and send** | | | | | |
| Reply to one particular message | ✅ | ✅ | ✅ | ➖ | ✅ | ➖ |
| Edit or delete a message you sent | ✅ | ✅ | ➖ | ➖ | 🟡³ | ➖ |
| | **Files and media** | | | | | |
| Send a photo, a file or a voice note | ✅ | ✅ | ✅ | 🟡⁴ | ✅ | ✅ |
| Send a photo and a video as one album | 🟡⁵ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Save a photo or file someone sent you | ✅ | ✅ | ✅ | ❌ | 🟡⁶ | ➖ |
| Turn a voice note into text on your computer | ✅ | ➖ | ✅³¹ | ❌ | ✅⁷ | ➖ |
| | **Find** | | | | | |
| Find a chat or a person by name | ✅ | ✅ | ✅ | 🟡⁸ | 🟡⁸ | ➖ |
| Find a message by words, person or date, with no internet | ✅ | ✅ | ✅ | ❌ | ➖ | ❌⁹ |
| Find a file someone sent, in any chat, including the text inside it | ✅¹⁰ | 🟡¹¹ | ➖ | ❌ | ➖ | ➖ |
| | **Groups and people** | | | | | |
| Add or remove members, make admins, handle invite links and join requests | ✅ | ✅ | ➖ | 🟡¹² | ➖ | ➖ |
| See who is active in a group and which questions nobody answered | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Keep notes and tags on a person or a chat | ✅ | 🟡¹³ | ➖ | ➖ | ➖ | ➖ |
| | **Agents and safety** | | | | | |
| Every command of the tool is reachable through MCP | ✅ | ❌¹⁴ | 🟡¹⁵ | ❌ | 🟡¹⁵ | 🟡¹⁶ |
| An agent reads but cannot write until you allow each kind of action | ✅ | 🟡¹⁷ | ➖ | ➖ | ➖ | ➖ |
| Limit sends to a list of chats you chose | ✅ | ➖ | ➖ | ➖ | ✅¹⁸ | ➖ |
| Stop sending after a number of messages in an hour | ✅ | 🟡¹⁹ | ➖ | ➖ | ➖ | ➖ |
| Keep a record of every send and never repeat one that may have arrived | ✅ | 🟡²⁰ | ➖ | ➖ | 🟡²¹ | ➖ |
| Reading shows you as offline and sends no read receipt | ✅ | 🟡²² | 🟡³² | ➖ | 🟡²³ | n/a |
| Hold every send when WhatsApp tells the account to slow down | ✅ | ➖ | ➖ | ➖ | ➖ | n/a |
| Work with several accounts and never pick one for you | ✅ | 🟡²⁴ | ➖ | ➖ | 🟡²⁵ | ✅²⁶ |
| | **Setup** | | | | | |
| Link by scanning a QR code in the phone's Linked devices | ✅ | ✅ | ✅ | ✅ | ✅ | n/a |
| MCP over stdio, and over HTTP for ChatGPT or Claude in the browser | ✅ | ❌¹⁴ | ✅³³ | ❌ | 🟡²⁷ | 🟡¹⁶ |
| Install with one command, on macOS, Linux and Windows | ✅ | ✅ | ❌²⁸ | ✅ | 🟡²⁹ | n/a |

¹ `chats list --unread` lists them. Marking a chat read is a separate command.
² `catch_up` counts waiting messages per chat. `mark_read` is a separate tool.
³ It can edit a message. It has no delete tool.
⁴ Photos and files, and `--type` makes audio and video play in the chat. The README does not say it sends a voice note.
⁵ A photo and a video go as one album. More than that is not built yet.
⁶ The tool keeps only the last 500 messages in memory (`WHATSAPP_MAX_STORE`), so an older file can fail to download.
⁷ With a model on your computer, or Groq or OpenAI if you set a key.
⁸ It lists groups, not every chat. WhatsApp Channel lists only the groups you allowed.
⁹ The API sends messages to your server as they arrive. It does not give you a stored history to search.
¹⁰ Run `attachments extract` first; then search finds the text in PDF, Word, spreadsheet and other files.
¹¹ `messages search --has-media --type document` finds messages with a file. It does not read inside the file.
¹² It adds and removes members. It does not list admin, link or join request commands.
¹³ It has aliases and tags for contacts. It has no notes.
¹⁴ Its documentation says it has no MCP server and shows how to wrap its commands in your own.
¹⁵ whatsapp-mcp has 17 tools and WhatsApp Channel about a dozen: reading, sending, files. They cover less than the full command set.
¹⁶ Meta's WhatsApp Business Tools MCP server is hosted by Meta. It sets up accounts, manages templates and
webhooks, and sends messages.
¹⁷ `--read-only` blocks all writes at once. It cannot allow one kind and refuse another.
¹⁸ `reply` refuses a chat that is not on the allowlist.
¹⁹ `--send-spacing` spaces the sends apart. It has no hourly cap.
²⁰ It retries once after a reconnect in some failures. Its message journal lists changes, not sends.
²¹ It keeps the id and time of its own sends for 24 hours, so a message WhatsApp delivers again is not sent twice.
²² `--presence-mode quiet` for `sync`.
²³ Read receipts are off unless you set `WHATSAPP_READ_RECEIPTS=1`. Other presence behaviour is not described.
²⁴ Named accounts. If `default_account` is set, commands use it when you name none.
²⁵ Separate state folders for separate numbers, one number per server.
²⁶ Each request names the business phone number it uses.
²⁷ stdio only.
²⁸ It needs Go, Python and `uv`, and on Windows MSYS2 with CGO enabled.
²⁹ Needs Bun and Claude Code's plugin commands.
³⁰ `list_chats` returns an `unread` flag per chat, and the README says reading or searching messages never sends a
read receipt; `mark_messages_read` is a separate tool.
³¹ `transcribe_audio` runs whisper.cpp on your computer, or sends the audio to an endpoint you set.
³² Reading and searching never send read receipts. The README does not say whether you show as offline.
³³ stdio by default, and `http` or `sse` with `WHATSAPP_MCP_TRANSPORT`. The README does not name ChatGPT or browser clients.

## Setup, licence and price

| | Install | Licence | Price |
|---|---|---|---|
| wa | `npm install -g @wirecat/whatsapp-cli` | Apache-2.0 (the CLI); GPL-3.0-only (the engine) | free |
| wacli | `brew install openclaw/tap/wacli`, or a release archive | MIT | free |
| whatsapp-mcp | clone, then run the Go bridge and the Python server | MIT | free |
| mudslide | `npm install -g mudslide`, or `npx mudslide` | ISC | free |
| WhatsApp Channel | `claude plugin install` | Apache-2.0 | free |
| Cloud API | Meta developer account and a business number | official terms | Meta charges per message; see its [pricing page](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing) |

All the tools except the Cloud API link to your account as WhatsApp Web does. WhatsApp's terms forbid unofficial
clients and may ban an account that uses one. Read [limits](./limits.md) before you let an agent send.

## Where another tool fits better

- **A business that answers customers**: the Cloud API. It is official, takes a business number and has no ban risk
  for the number. `wa` works with your personal account.
- **Saving a contact in your phone's address book**: wacli. It has `contacts save`. WhatsApp keeps address-book edits
  on the phone, so `wa` reads the synced address book and does not change it.
- **Older messages**: wacli. `history backfill` asks the phone for older messages of a chat. `wa messages sync` does
  the same, 50 at a time, and `wa` is newer, so it has had less time on real accounts than wacli.
- **A script that only sends**: mudslide. It is small and sends with one command, and you set it up in a minute.
- **A Claude Code session that wakes on each incoming message**: WhatsApp Channel. That is what it is built for.
  `wa` never answers on its own.

## Compared with an agent driving WhatsApp Web

A browser agent opens WhatsApp Web and clicks. It needs a browser that stays logged in, reads the screen, and has no
way to limit what it sends. `wa` and the other tools here talk to WhatsApp as a linked device without a browser and
return data, not screens. We have not measured speed or cost against a browser agent, so this page makes no claim
about either.

## Where the marks come from

Checked on 24 October 2026.

- **wa**: the `main` branch of [whatsapp-cli](https://github.com/WireCatLabs/whatsapp-cli), its
  command list (`wa commands --json`), the default `sends_per_hour` of 30 shown by `wa config show`, and the
  [MCP](./mcp.md), [permissions](./permissions.md), [limits](./limits.md) and [search](./search.md) pages.
- **wacli**: [README](https://github.com/openclaw/wacli/blob/main/README.md),
  [send](https://github.com/openclaw/wacli/blob/main/docs/send.md),
  [messages](https://github.com/openclaw/wacli/blob/main/docs/messages.md),
  [chats](https://github.com/openclaw/wacli/blob/main/docs/chats.md),
  [groups](https://github.com/openclaw/wacli/blob/main/docs/groups.md),
  [contacts](https://github.com/openclaw/wacli/blob/main/docs/contacts.md),
  [history](https://github.com/openclaw/wacli/blob/main/docs/history.md),
  [sync](https://github.com/openclaw/wacli/blob/main/docs/sync.md),
  [accounts](https://github.com/openclaw/wacli/blob/main/docs/accounts.md) and
  [integrations](https://github.com/openclaw/wacli/blob/main/docs/integrations.md).
- **whatsapp-mcp** (verygoodplugins fork, commit 2ccf384): [README](https://github.com/verygoodplugins/whatsapp-mcp/blob/2ccf384/README.md) and the tool list in
  [main.py](https://github.com/verygoodplugins/whatsapp-mcp/blob/2ccf384/whatsapp-mcp-server/main.py).
- **mudslide**: [README](https://github.com/robvanderleek/mudslide/blob/main/README.md), including its FAQ "How can I
  read messages?".
- **WhatsApp Channel**: [README](https://github.com/Rich627/whatsapp-claude-plugin/blob/main/README.md),
  [USAGE](https://github.com/Rich627/whatsapp-claude-plugin/blob/main/USAGE.md) and the allowlist check in
  [server.ts](https://github.com/Rich627/whatsapp-claude-plugin/blob/main/server.ts) (`assertAllowedChat`).
- **Cloud API**: [overview](https://developers.facebook.com/docs/whatsapp/cloud-api/overview) and Meta's
  [MCP page](https://developers.facebook.com/documentation/mcp).

If a mark here is wrong, tell us in an
[issue](https://github.com/WireCatLabs/whatsapp-cli/issues).
