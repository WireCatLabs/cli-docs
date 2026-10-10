---
title: "Searching"
description: "Find a message, person, chat or file using words, word forms, typos or meaning."
---

Find messages, agreements, people, chats and documents across your chats. Learn what you can search, how to choose a search method and how to check the source messages, even when you remember only part of a phrase or its subject.

**What you can search:**

- **Messages and discussions** — by text, sender, date, subject and nearby messages.
- **Contacts and people** — by name, username or ID, then recall what you discussed.
- **Chats, groups and channels** — by title among your account's chats.
- **Files** — by filename, extension and contents, once the document's text has been extracted and saved.
- **Links and attachments** — for example, messages with a link, PDF or voice note; voice transcripts become searchable once their text is saved.

Content search supports text files, Word and PDFs with text layers. Scans and photos need text
recognition first; ask your agent to do that. Details: [Telegram files](./tg/search.md#text-inside-files)
and [MAX](./max/search.md#текст-внутри-файлов). See [People](./people.md) for finding a person.

For word forms, typo handling and meaning-based search, see [How search works](./search-architecture.mdx).

## Fetch the relevant chat history first

Before searching older messages, download the conversations for the period you need. Logging
in does not download all history. Word search can also query the messenger’s server by default: `tg` asks Telegram for word candidates, and `max` asks MAX when you name one chat. `--backend archive` keeps word searches local. Topic search, counts and MAX searches without one named chat use saved messages. File filters are evaluated against the local archive, even when a word search also retrieves server candidates. If that conversation is missing, an empty result does not mean the
message was never sent.

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
[MAX](./max/archive.md#скачать-историю).

## Search everything at once

When you do not know where something was written — a chat, an email or your own notes — search
all of them together:

```sh
tg search all invoice
max search all invoice
```

Each result says whether it is a message, an email or a note. The sections below search one kind.

## Find a word or phrase

Start by asking your agent. For MAX, write “max CLI” instead of “tg CLI”:

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

Results link back to messages. Ask your agent to show nearby messages before interpreting
an agreement: one line may miss a correction or a later answer.

## When you don't remember the exact wording

Message search offers several approaches:

- **A word or exact phrase:** when you remember the wording. Use `exact:` for literal matching.
- **Part of a word:** `flat*` finds words starting with that part, such as “flat” and “flats”.
- **Word forms and shared stems:** “invoice” can find “invoices”. Which forms match depends on the archive's language settings.
- **Typos:** the default search does not correct typos. Ask your agent to allow misspellings: it can select `--language legacy` for typo-tolerant discovery, or search by the start of the word.
- **Meaning:** when you remember the subject, such as “the renovation deadline we agreed”, rather than the words. This needs a prepared discussion index.

Word forms, exact matching, indexes and meaning-based search: **[How search works](./search-architecture.mdx)**.
Detailed syntax: [Telegram](./tg/query-language.md) and [MAX](./max/query-language.md). The `--language legacy` option is listed in the command references for [Telegram](./tg/commands.md#tg-search-messages) and [MAX](./max/commands.md#max-search-messages). These modes describe message search;
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

By default, word search can also ask Telegram’s server, or MAX’s server when you name one chat. Topic search,
counts and filters such as files or links need saved history: fetch the missing period, then
search again. A word search is different from a search by meaning; try both when you remember
only roughly how something was said. Check dates, chat scope and whether history is complete.

## Try without installing

Use the [search playground](./search-playground.mdx) or [meeting demo](./meeting-brief.mdx)
with built-in messages. They do not read your account.

## More precise queries and technical details

Learn filters and operators in the [Telegram query guide](./tg/query-language.md) or
[MAX query guide](./max/query-language.md). [How search works](./search-architecture.mdx)
explains indexing, conversations and ranking after the practical guides.
