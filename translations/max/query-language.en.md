---
title: "Search query language"
---

<a id="в-mcp" />
<a id="прежние-режимы" />

When using `max` through an AI agent, describe what you want in ordinary words and let the agent form the search query. Use this reference when typing searches yourself or looking up exact operators, every field, presets, date rules and limits.

This is help for the queries `max search messages`, `max search all`, `max stats messages show`, saved searches and `--filter` [search by topic](./topic-search.md). Examples for every day - in [message search](./search.md).

Terms used below:

- **Query** — what you search for, such as `счёт from:me date:7d`.
- **Field** — a name followed by a colon, targeting a message property: `from:` for sender or `date:` for date. Unqualified words search message text.
- **Operator** — a word or symbol combining conditions: `AND`, `OR`, `NOT`.
- **Word forms** — variations of one word, such as “apartment” and “apartments”.

This language implements a strict subset of Apache Lucene syntax: words, phrases, AND/OR/NOT, groups, fields, ranges, limited patterns and regular expressions. Unsupported syntax causes an error rather than being silently skipped. The [full reference](https://github.com/leemour/cli-messaging/blob/v0.212.0/docs/search/query-language.md) contains generated field/operator/preset/limit tables and verified examples; the [technical specification](https://github.com/leemour/cli-messaging/blob/v0.212.0/docs/search/query-language-spec.md) describes grammar and compilation.

## What the language can do

| Need | Write |
|---|---|
| messages with all these words, in any form | `счёт оплачен` |
| these words in a row, in this order | `"счёт оплачен"` |
| one word or another, without a third | `(кафе OR библиотека) NOT шумно` |
| only this form of the word | `exact:квартира`, or `--exact` for all words without a field |
| words that start with something | `квартир*` |
| sender, chat, chat type | `from:me`, `chat:"Книжный клуб"`, `kind:private` |
| period | `date:7d`, `date:[2026-01-01 TO 2026-02-01}` |
| files by name or size | `filename:*.pdf`, `size>10MB` |
| text similar to password, card or phone | `preset:secret`, `preset:card` |
| your own tags | `tag:work` |
| template | `text:/pass(port)?/` |

Unqualified words and phrases match word forms. `--exact` selects exact forms for unqualified words; explicit `text:` still matches forms. Archive language settings determine which forms match ([word forms](./archive.md#обслуживание-архива)).

## Operators

| Operator | Example | Meaning |
|---|---|---|
| words | `счёт оплачен` | both words |
| phrase | `"счёт оплачен"` | the words in this order |
| `AND`, `&&` | `alpha AND beta` | both |
| `OR`, `\|\|` | `alpha OR beta` | either |
| `NOT`, `!`, `-` | `alpha NOT beta` | the first without the second |
| `+` | `+alpha OR beta` | alpha required, beta optional |
| group | `(alpha OR beta) gamma` | brackets set the order |
| field group | `from:(alice OR bob)` | the field applies to each value |
| range | `date:[2026-01-01 TO 2026-02-01}` | `[ ]` include, `{ }` exclude, `*` open |
| comparison | `size>10MB`, `date>=7d` | an open range |
| wildcard | `квартир*`, `т?кст` | `*` any characters, `?` one |
| regex | `text:/pass(port)?/` | a bounded Lucene regular expression |

`alpha OR beta gamma` means `(alpha OR beta) AND gamma`; `alpha OR beta AND gamma` means `alpha OR (beta AND gamma)`. Use parentheses for clarity. Lowercase `and`, `or`, `not` are ordinary words. A lone `NOT` query finds nothing; add a positive condition such as `kind:group NOT preset:secret`. Fuzzy search `~`, word proximity, boosts and intervals produce errors rather than being skipped. Typos are not corrected; use a pattern such as `квартир*` for different endings.

## Fields

| Field | Finds | Example |
|---|---|---|
| `text` | message words (the default field) | `text:счёт` |
| `exact` | Exact word or phrase form | `exact:квартира`, `exact:"счёт оплачен"` |
| `body` | the whole original text, case-sensitive | `body:/.*счёт.*/` |
| `from` | sender by name, @username or id; `me` means you | `from:"Алиса Тестова"` |
| `chat` | chat by title, @username or id | `chat:"Книжный клуб"` |
| `date` | when sent | `date:today`, `date:7d`, `date:[2026-01-01 TO 2026-02-01}` |
| `kind` | chat kind: `private`, `group`, `channel`, `saved`, `bot`, `service`, `unknown` | `kind:private` |
| `has` | `attachment`, `link`, `file`, `photo`, `image`, `video`, `audio`, `voice`, `sticker`, `contact`, `location`, `poll` | `has:file` |
| `topic` | one discussion thread; needs one chat | `chat:"Книжный клуб" AND topic:42` |
| `in` | which accounts: provider or `bots` | `in:bots` |
| `preset` | text resembling a secret or contact | `preset:secret` |
| `content` | retained attachment text | `content:договор` |
| `filename` | whole attachment filename | `filename:*.pdf` |
| `mime` | attachment type; MAX does not report it | `mime:image` |
| `size` | attachment size in bytes or 1,024-based KB/MB/GB | `size>10MB` |
| `tag` | your local tag on the message, its chat or sender | `tag:work` |

Field names are case-sensitive. An unknown field, value or combination is an error, never an empty
answer and never plain text. A name that the archive does not know is not looked up on MAX.

`kind:bot` selects a chat with a bot; `in:bots` selects the archives of `max bot`. `topic:` requires exactly one chat in `chat:` or `--chat`: topic numbers repeat across chats. `filename`, `mime` and `size` match a message if at least one of its files matches. MAX does not report file types, so `mime:` finds nothing here: search by extension.

## Presets

Preset finds text based on its type. With it you can find a password, code or card number that someone sent.

| Preset | A candidate is |
|---|---|
| `password` | a password label followed by a value |
| `code` | a verification-code label and 4–8 digits |
| `api-key` | an API-key label and a value |
| `secret` | a password, secret, token or API-key label and a value |
| `card` | 13–19 digits with optional spaces or hyphens |
| `bank` | an IBAN-shaped value |
| `passport` | a labelled passport value or a Russian 4+6 digit shape |
| `phone` | a plus-prefixed international phone shape |
| `email` | an email-address shape |
| `telegram-link` | a t.me or telegram.me link |
| `url` | an HTTP(S) link |
| `contact` | a contact attachment, or an email or phone |
| `location` | a location attachment or a geo: link |

A preset reports a candidate by its shape. It does not verify a password, a card or a document, and
it can match something harmless. Do not delete or forward messages automatically on its word.

## Dates

`--timezone` takes an IANA zone such as `Europe/Madrid`; without it, the computer's zone is used and
returned in the answer. A date without a time is a whole calendar day. An inclusive upper day includes
that whole day, an exclusive one excludes it; a day when clocks change can last 23 or 25 hours.

`date:today` and `date:yesterday` are calendar days. `date:7d` means from 7 days ago until now (also
`30m`, `2h`); `date>=7d` and `date:[30d TO 7d}` work in comparisons and ranges, counted from the
moment the query runs. An exact time is quoted, with seconds and an offset:
`date>="2026-01-01T10:00:00+02:00"`.

## Words, wildcards and regular expressions

Before indexing and searching, text is converted to lower case and loses accents; `ё` becomes `е`, and `й` becomes `и`. Some different words therefore match: `мой` also finds «мои». Regex and wildcards on `text:` are normalized the same way.

`text:/счёт/` matches the whole word «счёт», but not «счётом». `body:/счёт/` matches only a message whose entire text is «счёт», case-sensitive; to find it anywhere, use `body:/.*счёт.*/`, and for the start of a sentence, `body:/.*[Сс]чёт.*/`. This is Lucene regular-expression syntax, without lookaround, backreferences, anchors or JavaScript flags.

On a large archive a short prefix such as `к*` can expand to more than 10,000 words and is refused;
lengthen it. Long
queries, deep nesting, large patterns and slow scans are refused with `query_limit`, not cut short:
narrow the chat, the dates or the pattern.

### JavaScript Regular Expression: `--regex`

```sh
max search messages --regex 'invoice\s+\d+' --json
```

`--regex` - separate mode. The words after command are a single JavaScript regular expression, not a query in that language. It is case-insensitive, checked against the full text of each stored message, and executed in an isolated process with time and size limits. A saved search stores its `--regex`; You cannot add `--regex` when running with `--saved`.

## The answer

`--json` returns `{ items, page, limit, hasMore, corrections, completeness, wordsReady, query, coverage }`,
even when nothing matched. `--jsonl` streams the items only.

- `query` — the language version, the time zone and the order used.
- `coverage` — which accounts and chats were searched. `lastSyncedAt` is the oldest time a chat in scope
  was fetched by `store fetch`, `null` if any chat never was. `inventoryComplete` means every account in
  scope has once listed all its chats; it does not promise a complete history.
- `completeness` — per chat: whether its stored history reaches the start and has gaps.
- `wordsReady` — whether the word index is complete. When it is `false`, a query with words fails with
  `index_not_ready` and the command that finishes it, `max store migrate`; a query without words runs.
- `hasMore` is about the page, not about whether MAX holds more.

An error carries the position of the problem in the query and a hint.

## Via MCP

Through the `max` MCP server, `max_read` (`command: "search messages"`) accepts either `text` or a versioned syntax tree in `ast`, not both. `timezone` sets the calendar zone. `chat` accepts an id or saved name; `source`, `newest`, `context` and `limit` match command options; `saved` runs a saved search. `thread`, `thread_hops`, `thread_messages`, `thread_bytes`, `thread_within` and `sync_first` match `--thread…` and `--sync-first`; `sync_first` requires `messages.sync-first: allow`. Results use the same fields as `--json`. `max_read` (`command: "stats messages show"`) counts the same queries. `record: false` disables request-history recording.

## Next steps

- [Message search](./search.md) - search for every day, saved searches and counting.
- [Search by topic](./topic-search.md) - find a discussion by meaning when you don’t remember the words.
