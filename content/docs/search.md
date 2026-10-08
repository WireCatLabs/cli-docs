---
title: "Search"
description: "Find a message, a decision or a whole discussion."
---

You can look for a remembered word, a phrase, a person or a discussion whose exact wording
you no longer remember. Start with the messages already saved on your computer.


Start by asking your agent:

```text prompt
Find where we agreed the renovation deadline in the group and my chat with the contractor. Show the final agreement, check later replies and cite the messages. If history is missing, tell me what needs fetching. Don't send anything.
```

You should get the agreed date and the messages behind it. If the date was only proposed or later changed, the answer should make that clear. You do not need to know the search syntax.


## Find a word or phrase

<details>
<summary>Optional: commands for the terminal</summary>

```sh
tg messages search invoice
max messages search invoice
```

</details>

For an exact phrase, keep the quotes inside the query:

<details>
<summary>Optional: commands for the terminal</summary>

```sh
tg messages search 'exact:"final invoice"'
max messages search 'exact:"final invoice"'
```

</details>

Results link back to messages. Ask your assistant to show nearby messages before interpreting
an agreement: one line may miss a correction or a later answer.

## Narrow the conversation

<details>
<summary>Optional: commands for the terminal</summary>

```sh
tg messages search invoice --chat "Project"
max messages search invoice --chat "Project"
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
