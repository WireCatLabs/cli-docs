---
title: "Search query language"
---

Reference for queries in `max search messages`, `max stats messages show` and saved searches. See [message search](./search.md) for everyday examples.

The language is a strict profile of Apache Lucene's query syntax: words, phrases, AND/OR/NOT,
groups, fields, ranges, bounded wildcards and regular expressions. The
[full reference](https://github.com/leemour/cli-messaging/blob/v0.164.0/docs/search/query-language.md)
(in Russian) has the generated tables of fields, operators, presets and limits, and executable
examples; the
[technical specification](https://github.com/leemour/cli-messaging/blob/v0.164.0/docs/search/query-language-spec.md)
describes the grammar and the compiler.

Words and phrases without a field match word forms. `--exact` selects exact forms for words without a field; an explicit `text:` still matches word forms. The archive language settings affect matching.

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

`alpha OR beta gamma` means `(alpha OR beta) AND gamma`; `alpha OR beta AND gamma` means
`alpha OR (beta AND gamma)`. Use brackets for clarity. Lowercase `and`, `or`, `not` are plain words. A
query with only `NOT` finds nothing: give a positive condition, for example `kind:group NOT preset:secret`.
Fuzzy `~`, proximity, boosts and intervals are refused with an error, not ignored.

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

## In MCP

`max_read` (`command: "search messages"`) accepts a query as `text` or as a versioned syntax tree in `ast`, but not both. `language` selects `lucene` or `legacy`; `timezone` sets the calendar time zone. `chat` accepts an ID or saved title; `source`, `newest`, `context` and `limit` work like the command options. `record: false` prevents the call from being recorded in query history. The response has the same fields as `--json`. `max_read` (`command: "stats messages show"`) counts using the same queries.

## The older modes

```sh
max search messages 'from:alice after:7d invoice -draft' --language legacy --json
max search messages --regex 'invoice\s+\d+' --json
```

`--language legacy` keeps the earlier filters and its correction of typos. `--regex` is a separate
mode: a JavaScript regular expression, case-insensitive, over the full text, in an isolated worker with
time and size limits. `--regex` cannot be combined with `--language lucene`.

| Legacy | Strict |
|---|---|
| `after:2026-01-01` | `date:[2026-01-01 TO *]` |
| `before:2026-02-01` | `date:[* TO 2026-02-01}` |
| `after:7d` | `date:7d` |
| automatic prefix and typo correction | `квартир*` explicitly; typos only in `--language legacy` |

`--thread` follows the stored reply graph; in `messages context` it replaces chronological neighbours. Defaults are
8 hops, 50 messages, 65,536 bytes and one day around each hit. Change them with `--thread-hops`,
`--thread-messages`, `--thread-bytes`, `--thread-within`. Without a graph it falls back to chronological context;
stale links are marked and not traversed.

Searching for words in one specified chat queries both the archive and the MAX server by default; without a specified chat, it queries only the archive. `--backend archive` keeps the search local. `--sync-first` downloads new messages first, without marking anything as read: at most 5 chats, 500 messages and 30 seconds. Adjust these limits with `--max-chats`, `--max-messages` and `--sync-time`. An incomplete or failed update preserves local results and reports outdated coverage and the update outcome.

MCP uses `thread`, `thread_hops`, `thread_messages`, `thread_bytes`, `thread_within` and `sync_first`. `sync_first` is available only with `messages.sync-first: allow`. `max_read` with `command: "messages context"` and `arguments: { offline: true }` reads saved data.
