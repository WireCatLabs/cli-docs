---
title: "Search"
description: "Find a message, a decision or a whole discussion."
---

You can look for a remembered word, a phrase, a person or a discussion whose exact wording
you no longer remember. Start with the messages already saved on your computer.

## Search everything at once

When you do not know where something was written — a chat, an email or your own notes — search
all of them together:

```sh
tg search all invoice
max search all invoice
```

Each result says whether it is a message, an email or a note. The sections below search one kind.

## Find a word or phrase

```sh
tg search messages invoice
max search messages invoice
```

For an exact phrase, keep the quotes inside the query:

```sh
tg search messages 'exact:"final invoice"'
max search messages 'exact:"final invoice"'
```

Results link back to messages. Ask your assistant to show nearby messages before interpreting
an agreement: one line may miss a correction or a later answer.

## Narrow the conversation

```sh
tg search messages invoice --chat "Project"
max search messages invoice --chat "Project"
```

You can also filter by person, date or attachments. The [Telegram](./tg/search.md) and
[MAX](./max/search.md) guides give examples you can adapt.

## Which search should I choose?

- **You remember words:** search messages. It is the quickest starting point.
- **You remember the subject:** use topic search to find related discussions by meaning.
- **You already found a message:** ask for its context or conversation to understand the exchange.
- **You need a count:** use statistics instead of reading every result.

[Telegram topic search](./tg/topic-search.md) · [MAX topic search](./max/topic-search.md)

## If a result is missing

Word search also asks Telegram's server, or MAX's server when you name a chat. Archive-only
and topic search need saved history: fetch the missing period, then search again. Try word and
topic search when you remember the phrasing roughly; check dates, scope and coverage.

## Try without installing

Use the [search playground](./search-playground.mdx) or [meeting demo](./meeting-brief.mdx)
with built-in messages. They do not read your account.

## More precise queries and technical details

Learn filters and operators in the [Telegram query guide](./tg/query-language.md) or
[MAX query guide](./max/query-language.md). [How search works](./search-architecture.mdx)
explains indexing, conversations and ranking after the practical guides.
