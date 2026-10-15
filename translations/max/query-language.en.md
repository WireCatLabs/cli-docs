---
title: "Search query language"
---

<a id="упоминания" />
<a id="в-mcp" />
<a id="прежние-режимы" />

When using `max` through an AI agent, describe what you want in ordinary words and let the agent form the search query. Use this reference when typing searches yourself or looking up exact operators, every field, presets, date rules and limits.

This is help for the queries `max personal search messages`, `max personal search all`, `max personal stats messages show`, saved searches and `--filter` [search by topic](./topic-search.md). Examples for every day - in [message search](./search.md).

Terms used below:

- **Query** — what you search for, such as `счёт from:me date:7d`.
- **Field** — a name followed by a colon, targeting a message property: `from:` for sender or `date:` for date. Unqualified words search message text.
- **Operator** — a word or symbol combining conditions: `AND`, `OR`, `NOT`.
- **Word forms** — variations of one word, such as “apartment” and “apartments”.

This language implements a strict subset of Apache Lucene syntax: words, phrases, AND/OR/NOT, groups, fields, ranges, limited patterns and regular expressions. Unsupported syntax causes an error rather than being silently skipped. The [full reference](https://github.com/WireCatLabs/cli-core/blob/v0.212.0/docs/search/query-language.md) contains generated field/operator/preset/limit tables and verified examples; the [technical specification](https://github.com/WireCatLabs/cli-core/blob/v0.212.0/docs/search/query-language-spec.md) describes grammar and compilation.

`max` does not search mail: that is `memo search mail`.

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
| comparison | `size>10MB`, `date>=7d`, `date:>=7d` | an open range; the form with a colon means the same |
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
| `phone` | a phone number found in the text, however it is written | `phone:"+34 600 000 000"` |
| `email` | an email address found in the text | `email:"ana@example.com"` |
| `url` | a link found in the text, without tracking parameters | `url:"https://example.com/a"` |
| `domain` | the site of a link or address found in the text | `domain:example.com` |
| `mentions` | the person, organization or document that a found mention is linked to | `mentions:"person:12"` |

Field names are case-sensitive. An unknown field, value or combination is an error, never an empty
answer and never plain text. A name that the archive does not know is not looked up on MAX.

`kind:bot` selects a chat with a bot; `in:bots` selects the archives of `max sales bot`. `topic:` requires exactly one chat in `chat:`: topic numbers repeat across chats. `filename`, `mime` and `size` match a message if at least one of its files matches. MAX does not report file types, so `mime:` finds nothing here: search by extension.

## Mentions

`max` finds phone numbers, email addresses, links, documents and names of people in the saved messages. These fields
find the messages that contain them. `max mentions list` shows the findings themselves.

```sh
max personal search messages 'phone:"+34 600 000 000"'
max personal search messages 'email:"ana@example.com" OR domain:example.com'
max personal search messages 'mentions:"person:12"'
```

Put a value with `+` or `@` in quotes: both signs are operators. A phone number is found however it is written:
`+34 600 000 000` and `600000000` are one phone number, and a number without `+` is read by the countries in the
`phone_countries` setting. `domain:` treats `docs.example.com` as the site `example.com`. In `mentions:`, write a
reference to a person, organization or document; the field finds the messages whose mentions you linked to it with
`max mentions confirm`.

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

## The answer

`--json` returns `{ items, page, next, missing, meta }`, even when nothing matched. `--jsonl` streams the
messages only.

- `missing` — what the search did not see and why: a `coverage` entry if some chats are not fetched or are
  behind, `text` while the word index is still being built, `pictures` if the image model is not downloaded.
- `next` — the commands that fix this (`messages.sync`, `store.migrate`, `models.download-image`), and
  `page.next` — the next page with the same query.
- `meta.accounts` — which accounts were searched.
- `page.has_more` is about the page, not about whether MAX holds more.

An error carries the position of the problem in the query and a hint.

## Via MCP

Through the `max` MCP server, `max_read` (`command: "search messages"`) accepts either `text` or a versioned syntax tree in `ast`, not both. `timezone` sets the calendar zone. `chat:` goes in the query itself; `source`, `newest`, `context` and `limit` match command options; `saved` runs a saved search. `thread`, `thread_hops`, `thread_messages`, `thread_bytes`, `thread_within` and `sync_first` match `--thread…` and `--sync-first`; `sync_first` requires `messages.sync-first: allow`. The response is the same object as `--json`. `max_read` (`command: "stats messages show"`) counts the same queries. `record: false` disables request-history recording.

## Next steps

- [Message search](./search.md) - search for every day, saved searches and counting.
- [Search by topic](./topic-search.md) - find a discussion by meaning when you don’t remember the words.
