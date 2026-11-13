---
title: "Compared with other tools"
---

`pbx` is a command line and an MCP server that copies the calls of an Asterisk PBX to your computer, turns their
recordings into text there and gives them to your AI agent to read. This page puts it next to the other tools people
use to read, transcribe and search the calls of an Asterisk or FreePBX system, so you can see which one fits your job.
The marks for `pbx` come from its source code, checked on 13 November 2026. The marks for the other tools come
from their own READMEs and documentation, checked on 13 November 2026. Nothing was connected to a live PBX for this
page, and a tool may do more than its pages say.

The tools:

- **pbx**: this tool. Reads the call records and recordings of any Asterisk PBX, transcribes on your computer,
  and gives the calls to an agent. It only reads: it never changes the PBX.
- **[FreePBX's own tools](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe)**: the CDR Reports page in the FreePBX admin, the CDR GraphQL API, and Scribe, a paid
  FreePBX module from Sangoma that transcribes and summarises recordings.
- **[Frogman](https://github.com/mwtcmi/frogman)**: a FreePBX module with an MCP server, an HTTP API and a command line,
  257 tools that read and change the PBX (34 stars, updated 11 September 2026).
- **[asterisk-ai-call-notes](https://github.com/taka-1128/asterisk-ai-call-notes)**: a Python worker that transcribes
  each new recording and writes a short summary, a next step and a tag for it (updated 18 September 2026).

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation

## Features

| Task | pbx | [FreePBX](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | [Frogman](https://github.com/mwtcmi/frogman) | [ai-call-notes](https://github.com/taka-1128/asterisk-ai-call-notes) |
|---|:-:|:-:|:-:|:-:|
| **Find calls** | | | | |
| List the calls of a date range | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26083384/PBX+GUI+-+CDR+Module+GraphQL+APIs) | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L155) | [❌](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L20) |
| Find every call with one phone number | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26542152/PBX+GUI+-+CDR+Reports+Module) | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L187) | [❌](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L20) |
| See call statistics: busiest extensions, peak hours, failed calls | ❌ | ➖ | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L438) | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L103) |
| See the same caller in calls, chats, mail and the CRM | ✅ | ➖ | ➖ | ➖ |
| **Recordings and transcripts** | | | | |
| Find the recording of a call | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26083384/PBX+GUI+-+CDR+Module+GraphQL+APIs) | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L187) | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L73) |
| Play a recording from a link | ❌ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L187) | ➖ |
| Turn recorded calls into text | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [✅](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L6) |
| Recordings never leave your own computers | ✅ | [❌](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L75) |
| Transcribe the recordings you already have, in one run | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L39) |
| A short summary of each call | ❌ | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [✅](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L6) |
| Search what was said | 🟡 | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L10) |
| Mark the calls that mention words you choose | ❌ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L8) |
| Save a transcript as a file | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L20) |
| **Agents and safety** | | | | |
| An AI app reads the calls over MCP | ✅ | ➖ | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L549) | ➖ |
| An agent with a terminal runs it, with JSON output and a skill | ✅ | ➖ | [🟡](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L465) | ➖ |
| The agent can read calls but never change the PBX | ✅ | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26050564/PBX+GUI+-+API+Access+Tokens) | [🟡](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L113) | ➖ |
| Allow or deny single commands for an agent | ✅ | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26050564/PBX+GUI+-+API+Access+Tokens) | [🟡](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L412) | ➖ |
| Text from a call reaches the agent as data, never as instructions | ✅ | ➖ | ➖ | ➖ |
| A record of what the agent ran | 🟡 | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26050564/PBX+GUI+-+API+Access+Tokens) | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L114) | ➖ |
| The agent needs no root login on the PBX | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26050564/PBX+GUI+-+API+Access+Tokens) | [🟡](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L562) | ➖ |
| **Setup** | | | | |
| Works with Asterisk without FreePBX | ✅ | [❌](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26542152/PBX+GUI+-+CDR+Reports+Module) | [❌](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L13) | [✅](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L3) |
| Nothing to install on the PBX | ✅ | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | [❌](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L22) | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L77) |

| | pbx | FreePBX | Frogman | ai-call-notes |
|---|---|---|---|---|
| Install | npm, Node 22.16 or later | built into FreePBX, Scribe from Module Admin | a FreePBX module | clone it, then Python |
| Licence | Apache-2.0 | Scribe needs a paid licence | AGPL-3.0 | MIT |
| Speech to text | a model on your computer | Deepgram, Sangoma's partner | Scribe's, for voicemail only | faster-whisper on your server, or OpenAI |

Notes on the marks:

- **Search what was said.** `pbx` has no search command of its own. The calls are in the WireCat store, so
  `memo` and the search of the other WireCat tools find them next to your chats and mail. FreePBX searches
  transcripts by the tags you set up. ai-call-notes writes the text into a SQLite table and leaves the search to you.
- **Summaries.** `pbx` makes no summary of its own. Your agent reads the transcript and writes one. Scribe
  makes summaries in English only. ai-call-notes sends the transcript text to Anthropic or OpenAI for its summary.
- **Recordings stay with you.** `pbx` recognises speech on your computer. Scribe sends recordings to Deepgram.
  ai-call-notes keeps audio on your server with faster-whisper, and sends the text to a cloud model.
- **Transcribe what you already have.** Scribe Rewind transcribes past recordings you select. ai-call-notes takes
  one file at a time with its file option, or watches the folder.
- **The agent can only read.** `pbx` opens the CDR database in a read-only session and the files for reading,
  and has no command that writes to the PBX. A FreePBX access token is limited to the parts its application is
  given. Frogman gives each user a permission level, and asks for a confirmation before a change.
- **Single commands.** `pbx` sets each command to allow, ask, read only or deny, per profile. Over MCP no one
  is there to answer, so ask lets the command run. See [settings](./configuration.md#permissions).
- **A record of what ran.** `pbx` keeps failed runs, and a sync or a transcription when you ask it to. Frogman
  keeps an audit log of every tool call. FreePBX shows when each token was last used and from where.
- **Root login.** Frogman's MCP setup connects over SSH as root to the PBX. `pbx` runs on your computer and
  needs a read-only database user, a folder mounted read-only, or an SFTP user that may only read.
- **Install on the PBX.** `pbx` needs nothing on the PBX. CDR Reports comes with FreePBX, and Scribe is a module
  you install there. ai-call-notes runs where it can read the recordings folder, often the PBX itself.
- **Call statistics.** ai-call-notes counts the drop rate, hangup causes by hour and the disposition mix only
  for VICIdial, inside its health check report.
- **Recordings with a link.** `pbx` links each call to its recording file by its path. It does not stream it.

## When another tool fits better

- **FreePBX with Scribe**: you run FreePBX, want summaries, sentiment and tags in the user portal and the phone app,
  and sending recordings to a cloud service is fine.
- **Frogman**: you want an agent to change the PBX, such as extensions, ring groups, routes or live calls, and not
  only read its calls. It also shows call statistics today.
- **asterisk-ai-call-notes**: an outbound call centre wants a summary, a next step and a callback time written next
  to each call as soon as it ends.

If `pbx` fits, start with [installation](./installation.md), then [connect your Asterisk](./asterisk.md).
