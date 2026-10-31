---
title: "Compared with other tools"
---

`gcal` is a command line and an MCP server for the Google Calendar of your own account. This page puts it next to the
other command lines, MCP servers and assistant connectors that read a Google Calendar, so you can see which one fits
your job. The marks for `gcal` come from its release 0.3.0, its commands and its source, checked on 31 October 2026; they are
checked again at each release. The marks for the other tools come from their own
READMEs, documentation and source, checked on 27 October 2026. Nothing was signed in to or tested live, and a tool may
do more than its pages say.

The tools:

- **gcal**: this tool. Keeps a copy of the calendars you choose on your computer, searches it without the internet,
  and joins attendees to the people you know from your other WireCat tools. It signs in read-only; after you allow
  writing, it also adds, changes, moves and deletes events and answers invitations.
- **[gcalcli](https://github.com/insanum/gcalcli)**: the classic Google Calendar command line, in Python: agenda,
  week and month views, search, add and edit (3,778 stars, last release 4 October 2024).
- **[gog](https://github.com/openclaw/gogcli)**: a Go command line for all of Google Workspace, built for agents, with
  30 calendar commands (8,535 stars, release 23 October 2026).
- **[Google Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp)**: a Python MCP server for 12
  Google services, 7 of its tools for Calendar (3,417 stars, release 23 October 2026).
- **[google-calendar-mcp](https://github.com/nspady/google-calendar-mcp)**: the most starred MCP server for Google
  Calendar alone, 13 tools (1,206 stars, release 28 September 2026).
- **[Claude's Google Calendar connector](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)**:
  built into Claude; nothing to install.

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation · n/a cannot apply

## Features

| Task | gcal | [gcalcli](https://github.com/insanum/gcalcli) | [gog](https://github.com/openclaw/gogcli) | [Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp) | [google-calendar-mcp](https://github.com/nspady/google-calendar-mcp) | [Claude](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **See your day and week** | | | | | | |
| Today's or this week's meetings in one command | ✅ | [✅](https://github.com/insanum/gcalcli/blob/main/gcalcli/argparsers.py) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-calendar-events.md) | [🟡](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/gcalendar/calendar_tools.py) | [🟡](https://github.com/nspady/google-calendar-mcp/blob/main/src/tools/registry.ts) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| Type dates in words, such as "tomorrow 3pm" or "next friday" | 🟡 | [✅](https://github.com/insanum/gcalcli/blob/main/gcalcli/utils.py) | [🟡](https://github.com/openclaw/gogcli/blob/main/docs/dates.md) | [❌](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/gcalendar/calendar_tools.py) | n/a | n/a |
| Meetings from all your calendars and accounts in one list | 🟡 | [🟡](https://github.com/insanum/gcalcli#readme) | [🟡](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-calendar-events.md) | ➖ | [✅](https://github.com/nspady/google-calendar-mcp#readme) | ➖ |
| See what changed since a date: new, moved and cancelled meetings | ✅ | [✅](https://github.com/insanum/gcalcli/blob/main/gcalcli/argparsers.py) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands.generated.md) | ➖ | ➖ | ➖ |
| Find meetings that overlap | ✅ | [✅](https://github.com/insanum/gcalcli/blob/main/gcalcli/argparsers.py) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands.generated.md) | ➖ | [✅](https://github.com/nspady/google-calendar-mcp#readme) | ➖ |
| **Find a meeting** | | | | | | |
| Find a meeting by what it was about, not by its exact words | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Search your meetings without the internet | ✅ | [❌](https://github.com/insanum/gcalcli/blob/main/gcalcli/gcal.py) | [❌](https://github.com/openclaw/gogcli/blob/main/docs/paths.md) | ❌ | ❌ | ❌ |
| One search over meetings, chats, mail and notes | 🟡 | ➖ | ➖ | ➖ | ➖ | ➖ |
| **People** | | | | | | |
| Know that an attendee is the person you write to in Telegram, WhatsApp or mail | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Prepare for the next meeting: who comes, what you last discussed, linked documents | 🟡 | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/agent-skills.md) | ➖ | ➖ | ➖ |
| Check when people are free | ✅ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands.generated.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/core/tool_tiers.yaml) | [✅](https://github.com/nspady/google-calendar-mcp/blob/main/src/tools/registry.ts) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| **Change the calendar** | | | | | | |
| Add a meeting | ✅ | [✅](https://github.com/insanum/gcalcli/blob/main/gcalcli/argparsers.py) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands.generated.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/core/tool_tiers.yaml) | [✅](https://github.com/nspady/google-calendar-mcp/blob/main/src/tools/registry.ts) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| Accept or decline an invitation | ✅ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands.generated.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/gcalendar/calendar_tools.py) | [✅](https://github.com/nspady/google-calendar-mcp/blob/main/src/tools/registry.ts) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| **Agents and safety** | | | | | | |
| MCP server | ✅ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/mcp.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/nspady/google-calendar-mcp#readme) | n/a |
| Every calendar command of the tool is also an MCP tool | ✅ | n/a | [❌](https://github.com/openclaw/gogcli/blob/main/docs/mcp.md) | [🟡](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/core/tool_tiers.yaml) | [✅](https://github.com/nspady/google-calendar-mcp/blob/main/src/tools/registry.ts) | n/a |
| An agent cannot change your calendar unless you allow it | ✅ | n/a | [✅](https://github.com/openclaw/gogcli/blob/main/docs/mcp.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [🟡](https://github.com/nspady/google-calendar-mcp#readme) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| You name the account each time; the tool never picks one for you | ✅ | ➖ | [❌](https://github.com/openclaw/gogcli#readme) | ➖ | [❌](https://github.com/nspady/google-calendar-mcp#readme) | n/a |
| Text from an invitation is marked for the agent as not to be obeyed | ✅ | n/a | [✅](https://github.com/openclaw/gogcli#readme) | ➖ | ➖ | ➖ |
| Instructions for agents that use a terminal | ✅ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/agent-skills.md) | ➖ | ➖ | n/a |
| **Setup** | | | | | | |
| Start without creating your own Google Cloud project | ❌ | [❌](https://github.com/insanum/gcalcli#initial-setup) | [❌](https://github.com/openclaw/gogcli#readme) | [❌](https://github.com/taylorwilsdon/google_workspace_mcp#quick-start) | [❌](https://github.com/nspady/google-calendar-mcp#google-cloud-setup) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| Works from claude.ai on the web and the phone | 🟡 | ❌ | ❌ | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [🟡](https://github.com/nspady/google-calendar-mcp#readme) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |

| | gcal | gcalcli | gog | Workspace MCP | google-calendar-mcp | Claude |
|---|---|---|---|---|---|---|
| Install | npm, Node 22.16+ or 24+ | apt, brew or pip | brew or `go install` | `uvx workspace-mcp` | `npx @cocal/google-calendar-mcp` | none: built into Claude |
| Licence | Apache-2.0 | MIT | MIT | MIT | MIT | closed service |

Notes on the `gcal` column:

- **Read only until you allow more.** `gcal session start` asks Google for read-only access. With `--grant write` it
  also adds, changes, moves and deletes events and answers invitations (`events create`, `update`, `move`, `delete`,
  `respond`). On a repeating event a change or delete covers one occurrence, the whole series, or this and all
  following occurrences (`--following`). `events move --to-calendar` moves an event, with its id, to another calendar
  of the same account. `--grant sharing` adds who can see a calendar.
- **What changed and what clashes.** `events list changed:<date>` lists the meetings first saved, moved or cancelled
  since that date, with each moved one's old time. It reads the copy on your computer, so it sees what the syncs
  brought in. `events list overlapping` lists the meetings that clash with another one you attend.
- **Your own Google app.** Today every user of `gcal` makes a Google Cloud project and an OAuth client, and gives
  `gcal` the client file at sign-in. See [installation](./installation.md).
- **Dates in words.** `events list` takes `today`, `week`, and `from:` and `to:` with a date. It does not read
  "next friday".
- **Prepare for a meeting.** `events show` gives the attendees, each joined to the person you know elsewhere, and
  the meeting's Drive files. What you last discussed with them is in `memo`, not in `gcal`.
- **All calendars.** One list covers the calendars you chose to sync in one profile. Each Google account is its own
  profile, and a list reads one profile.
- **Find by meaning.** It needs a model that you download once. Without one, search matches words and their other
  forms.
- **One search over everything.** Meetings go into the store that the other WireCat tools share. `search all` in the
  other WireCat tools, such as `tg`, reads them beside chats, mail and notes. `gcal search` itself finds meetings
  only.
- **When people are free.** `calendars busy` asks Google when your calendars and other people are taken, and with
  `--duration-minutes` gives the free stretches they share within working hours.
- **An agent cannot change your calendar unless you allow it.** Without `--grant write` the sign-in itself is the
  limit. After it, adding, changing, moving and answering go ahead without a question; a delete asks first at a
  terminal. Over MCP no one is there to ask, so an agent also deletes events, and with `--grant sharing` shares the
  calendar, without a question. Mailing attendees and deleting a whole series stay refused until you allow them. To
  be asked, or to stop writes, set the profile's permissions to `ask`, `deny` or `readonly` (for example
  `permissions.events.create ask` or `permissions.api.calendar.acl deny`), or start the server with
  `mcp serve --permission` to make one key stricter for that server.
- **Text from invitations.** Anyone can send you an invitation, so its title, notes and place are someone else's
  words. Each answer with events lists these fields under `untrusted`, and the MCP server and the agent instructions
  tell the agent they are data, not instructions. The text itself is not changed.
- **Passcodes.** Passcodes, PINs and passwords are removed from every answer, the raw `gcal api` commands included:
  a link loses its query string, and a line of the notes that names a passcode is dropped.
- **Every command an MCP tool.** Through three MCP tools, `gcal_tools_search`, `gcal_read` and `gcal_write`. Two
  commands are kept for you at a terminal: `api call`, and emptying a calendar (`calendars.clear`).
- **claude.ai on the web.** `mcp serve --http` serves the tool to Claude and ChatGPT in the browser, behind a tunnel
  you set up yourself, such as Tailscale Funnel.
- **Speed and cost against a browser agent.** `gcal` calls Google's API and reads its own copy; it opens no
  browser. No measurement of it against a browser agent is published, so this page makes no claim.

## When another tool fits better

- **gog**: you work across all of Google Workspace from one command line, not only the calendar.
- **Claude's connector**: you want help with your calendar in Claude on the web or the phone, with nothing to install
  and no Google Cloud project.
- **Google Workspace MCP**: you need one MCP server for a whole team on Google Workspace, reached over HTTP.
- **gcalcli**: you want a calendar grid in the terminal, or to add an event from one line of text such as
  "lunch with Ana tomorrow 1pm".

If `gcal` fits, start with [installation](./installation.md). To use it with an agent, see [usage](./usage.md).
