---
title: "Roadmap"
description: "What WireCat builds next: the Desktop app, search and memory, new sources and verified sign-in."
---

WireCat brings your context together in one place. Messages, meetings, files, notes and tasks
usually live in separate apps, so an agent sees only one part of a discussion at a time. We
connect these sources and link them by people and topics, so your agent can answer with the
whole picture and show where each fact came from. How the data fits together is described in the
[data model](./data-model.mdx).

This page lists what we build next. A planned item is not an available feature, and the order
can change. There are no promised dates. What already works is in [features](./features.mdx).

**You can shape this roadmap.** Suggest a source or a feature, tell us what you need first, or discuss an item
in the [WireCat Discord](https://discord.gg/DebENqbRrJ). We read every request there and use them to decide
what comes next.

## Recently added

Newest first.

- **[Bitrix24](./b24/usage.md)**: deals, leads, contacts and companies from your portal. They are copied to your
  computer, and a search across all your sources finds them next to messages and notes.
- **[WireCat Desktop](./desktop/index.mdx) 0.5**: the Windows installer is signed. The app checks the shared store
  before it installs or updates a tool, and it can keep Telegram, MAX and WhatsApp running in the background.
- **[Email](./mail/usage.md) as its own tool**: Outlook and Microsoft 365 sign-in, a review of what is new and what
  you owe a reply, Gmail archives from Google Takeout, and undo for a single change.
- **WireCat Desktop 0.4**: an Analytics page, editing or forgetting what WireCat remembers on the Memory page,
  adding a bot, and sign-in steps that say what each tool can access.
- **Your own sign-in app**: Google Drive, Google Calendar and Zoom can sign in with an app you created yourself.
- **[Google Calendar](./gcal/usage.md)**: meeting reminders, following any calendar feed by its address, and one
  search over meetings, chats and notes.
- **Telegram, MAX and WhatsApp archives**: the background service starts at login and catches up on what arrived
  while it was off.
- **Zoom transcripts** record their language, and a search hit says who spoke and where.
- **Memo tasks**: comments, due dates and project tasks, and memories that belong to a project.
- **WireCat Desktop**: the app installs the tools, signs you in and connects them to your agents without a terminal.
- **OpenClaw and Hermes**: OpenClaw reads the skill each tool installs and finds the WireCat skills on ClawHub.
  Hermes installs them from this site's skill index. See [agents](./agents.mdx).

Earlier: [Zoom](./zm/meetings.md) meetings, [Google Drive](./drive/index.md) documents and [WhatsApp](./wa/index.md)
chats and bots. Everything that works today is in [features](./features.mdx).

## Next

### In WireCat Desktop

- **Clients**: a page for the people and companies you work with and your deals with them, with the chats, mail
  and meetings about each one.
- **Notes**: read and write your notes in the app and link them to people and messages.

### Search and memory

Search by meaning already works on your computer for messages, notes, mail and Drive documents, together with word
search. See [how search works](./search-architecture.mdx). Next it gets better at these.

- **Better answers to questions in your own words**: a reworded question puts the right note, document or message
  near the top more often. In our note tests that happens for 2 of 5 reworded questions today.
- **Meetings in every search**: Zoom meetings are searchable in Zoom already. A search across all your sources will
  show what was decided on a call next to the messages and mail about it.
- **One person across sources**: you link a person's accounts by hand today. People with the same email address in
  Telegram, mail and Zoom will become one person, and the app gets a People page. You can always undo a merge.
- **Links between things**: the tools already find names, phone numbers and documents in messages. Next they link
  each one to the person or company it belongs to, so your agent can go from a note to a person to their documents.
- **Topics found for you**: tags you add by hand work today. Suggested tags for notes, documents and messages will
  find a topic even where you did not tag it.
- **Automatic digests**: the morning digest in Memo already lists what is new. It becomes a short text in
  your language about your chats, mail and meetings, and it comes to you on the schedule you choose.
- **Memory that keeps up**: memories your agent proposes already wait for your review. Next a memory is marked when
  the source behind it changes, with an update for you to confirm.

### New sources

- **Google Meet**: meetings and their transcripts, linked to the people and chats around them, as Zoom is today.
- **Notion**: your pages and databases next to your notes and documents.

### Trust

- **Verified apps**: WireCat's sign-in apps for Google, Microsoft and Zoom pass each company's review. Google stops
  showing its warning screen, and Zoom no longer needs an app of your own.

### After that

- **More messengers and meetings**: Microsoft Teams and Slack, for both messages and meetings.
- **GitHub**: pull request descriptions, issues and projects.

## Later

- **Code in GitHub**: search by meaning over the code itself and, separately, over what each change was for.
- **Confluence.**
- **Task trackers**: Jira, Linear, Todoist and TickTick.

## Each tool's plans

- [Telegram roadmap](./tg/roadmap.md)
- [MAX roadmap](./max/roadmap.md)
- [Zoom roadmap](./zm/roadmap.md)
- [Google Drive roadmap](./drive/roadmap.md)
- [Google Calendar roadmap](./gcal/roadmap.md)
- [Mail roadmap](./mail/roadmap.md)
- [Bitrix24 roadmap](./b24/roadmap.md)
- [Memo roadmap](./memo/roadmap.md)
- [WhatsApp roadmap](./wa/roadmap.md)

To suggest a source or feature, open an issue in the tool’s GitHub repository.
