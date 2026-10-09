---
title: "Searching"
description: "Find a message, person, chat or file using words, word forms, typos or meaning."
---

This page helps you find messages, agreements, people, chats and documents in Telegram or MAX. You will learn what you can search, how to choose a search method and how to check the source messages, even when you remember only part of a phrase or its subject.

**What you can search:**

- **Messages and discussions** — by text, sender, date, subject and nearby messages.
- **Contacts and people** — by name, username or ID, then recall what you discussed.
- **Chats, groups and channels** — by title among your account's chats.
- **Files** — by filename, extension and contents, once the document's text has been extracted and saved.
- **Links and attachments** — for example, messages with a link, PDF or voice note; voice transcripts become searchable once their text is saved.

Content search supports text files, Word and PDFs with text layers. Scans and photos need text
recognition first; ask your agent to do that. Details: [Telegram files](./tg/search.md#for-scripts-and-agents)
and [MAX](./max/search.md). See [People](./people.md) for finding a person.

For word forms, typo handling and meaning-based search, see [How search works](./search-architecture.mdx).

## Fetch the relevant chat history first

Before searching older messages, download the conversations for the period you need. Logging
in does not download all history; ordinary search reads messages already saved on your computer.
If that conversation is missing, an empty result does not mean the message was never sent.

Ask your agent to fetch the selected chats or run your messenger's command. Replace `Project`
with the chat title; this example downloads the past month, up to 1,000 messages per run:

```sh
tg store fetch "Project" --since-time 30d --limit 1000
```

```sh
max store fetch "Project" --since-time 30d --limit 1000
```

If the limit is reached, that month's history may still be incomplete. Instructions for fetching,
resuming and checking history: [Telegram](./tg/archive.md#fetch-a-chats-history) and
[MAX](./max/archive.md#downloading-history).

## Search everything at once

When you do not know where something was written — a chat, an email or your own notes — search
all of them together:

```sh
tg search all invoice
max search all invoice
```

Each result says whether it is a message, an email or a note. The sections below search one kind.

## Find a word or phrase

Start by asking your agent:

```text prompt
Use tg CLI. Find where we agreed the renovation deadline in the group and my chat with the contractor. Show the final agreement, check later replies and cite the messages. If history is missing, tell me what needs fetching. Don't send anything.
```

You should get the agreed date and the messages behind it. If the date was only proposed or later changed, the answer should make that clear. You do not need to know the search syntax.

<details>
<summary>Optional: commands for the terminal</summary>

```sh
tg search messages invoice
max search messages invoice
```

</details>

For an exact phrase, keep the quotes inside the query:

<details>
<summary>Optional: commands for the terminal</summary>

```sh
tg search messages 'exact:"final invoice"'
max search messages 'exact:"final invoice"'
```

</details>

Results link back to messages. Ask your assistant to show nearby messages before interpreting
an agreement: one line may miss a correction or a later answer.

## When you don't remember the exact wording

Message search offers several approaches:

- **A word or exact phrase:** when you remember the wording. Use `exact:` for literal matching.
- **Part of a word:** `flat*` finds words starting with that part, such as “flat” and “flats”.
- **Word forms and shared stems:** “invoice” can find “invoices” with English stemming configured. Results depend on the language and configured index.
- **Typos:** ask your agent to allow approximate spelling. Search can correct unknown words using the saved conversation’s vocabulary; the agent chooses the appropriate mode.
- **Meaning:** when you remember the subject, such as “the renovation deadline we agreed”, rather than the words. This needs a prepared discussion index.

Word forms, exact matching, indexes and meaning-based search: **[How search works](./search-architecture.mdx)**.
Detailed syntax and modes: [Telegram](./tg/query-language.md#the-older-modes) and
[MAX](./max/query-language.md#the-older-modes). These modes describe message search;
chat-title and person-name lookup can behave differently.

## Narrow the conversation

<details>
<summary>Optional: commands for the terminal</summary>

```sh
tg search messages invoice --chat "Project"
max search messages invoice --chat "Project"
```

</details>

You can also filter by person, date or attachments. The [Telegram](./tg/search.md) and
[MAX](./max/search.md) guides give examples you can adapt.

## Which search should I choose?

- **You remember words:** search messages. It is the quickest starting point.
- **You remember the subject:** use topic search to find related discussions by meaning.
- **You already found a message:** ask for its context or conversation to understand the exchange.
- **You need a count:** use statistics instead of reading every result.

[Telegram topic search](./tg/topic-search.md) · [MAX topic search](./max/topic-search.md)

## If a result is missing

The tools cannot find messages they have not saved. Fetch the chat's history first, then search
again. A word search is different from a search by meaning; try both when you remember only
roughly how something was said. Check dates, chat scope and whether history is complete.

## Try without installing

Use the [search playground](./search-playground.mdx) or [meeting demo](./meeting-brief.mdx)
with built-in messages. They do not read your account.

## More precise queries and technical details

Learn filters and operators in the [Telegram query guide](./tg/query-language.md) or
[MAX query guide](./max/query-language.md). [How search works](./search-architecture.mdx)
explains indexing, conversations and ranking after the practical guides.
