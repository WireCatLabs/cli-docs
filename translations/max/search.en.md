---
title: "Message search"
---

`max messages search` finds messages in the local archive: the copy of your chats that `max` keeps on this computer. By default it does not connect to MAX and marks nothing read. A message `max` has not downloaded cannot be found, so download the history first: `max store fetch <чат>` ([archive](./archive.md)).

This page covers everyday searches. Three more pages go further:

- [Topic search](./topic-search.md) — find a discussion by what it was about, when you do not remember
  its words.
- [Query language](./query-language.md) — every field, operator, limit and the JSON answer.
- [How search works](https://wirecat.dev/ru/docs/search-architecture) — the technical page: the word
  index, the conversation graph, vectors and how results are ranked.

Put the query in single quotes, so the shell leaves its quotes and brackets alone. The names below are
examples; use your own chats and people.

## Words and phrases

```sh
max messages search счёт
max messages search '"счёт оплачен"'             # точная фраза
max messages search 'кафе OR библиотека'
max messages search '(кафе OR библиотека) NOT шумно'
max messages search 'квартир*'                   # все слова, которые начинаются на «квартир»
```

Words next to each other must all appear in the message. A word finds that same word in any case, with or without accents; `ё` and `е` are treated alike. Another form of a word is a different word: `квартира` does not find «квартиру»; the prefix `квартир*` finds both. Nothing is guessed: no typo correction or similar words.

## People and chats

```sh
max messages search 'from:"Алиса Тестова" счёт'
max messages search 'from:("Алиса Тестова" OR "Борис Тестов") библиотека'
max messages search 'from:me date:7d'            # что вы писали за неделю
max messages search 'chat:"Книжный клуб" библиотека'
max messages search библиотека --chat "Книжный клуб"   # то же, опцией
max messages search 'паспорт kind:private'       # только личные переписки
```

`kind:` accepts `private` (private chats), `group`, `channel`, `saved` (Saved Messages) and `bot`.

## Dates

```sh
max messages search 'date:today'
max messages search 'библиотека date:yesterday'
max messages search 'счёт date:7d'               # от 7 дней назад до сейчас; также 30m, 2h
max messages search 'счёт date:[2026-01-01 TO 2026-02-01}' --timezone Europe/Madrid
```

`today`, `yesterday` and calendar dates are days in your computer's time zone; `--timezone` picks
another. In a range, `[` and `]` include that day, `{` and `}` exclude it.

## Files and links

```sh
max messages search 'has:file'
max messages search 'filename:*.pdf'
max messages search 'filename:*договор*'         # часть имени
max messages search 'size>10MB'
max messages search 'size:[1KB TO 300KB]'
max messages search 'has:photo chat:"Книжный клуб"'
max messages search 'has:link AND "github.com"'  # ссылка на сайт
```

A file is found by name and size even when the message has no text. `filename:` compares the whole name, ignoring case, accents and `ё`. Sizes use KB, MB and GB of 1,024. MAX does not report the file type, so search by extension: `filename:*.pdf`, rather than `mime:`. `has:` also accepts `attachment`, `video`, `audio`, `voice`, `sticker`, `contact`, `location` and `poll`. A link counts whether it appears in the text or only in a link card.

## Passwords, codes and cards

```sh
max messages search 'preset:secret kind:saved'   # что-то похожее на пароль или токен в Избранном
max messages search 'preset:card'
```

A preset finds messages that *look like* a password, a login code, an API key, a card or IBAN number, a
passport, a phone, an email or a link. It checks the shape only: it does not prove that a password
works or a card is real. The full list is in the [query language](./query-language.md#preset).

## Tags

```sh
max tags add work --chat "Книжный клуб"
max tags add work --contact "Борис Тестов"
max tags list --tag work --type chat
max messages search 'tag:work счёт'
max messages search 'счёт NOT tag:work'
max tags remove work --chat "Книжный клуб"
```

A tag is your own label on a chat, a person or one message (`--message <id> --chat <чат>`). It stays in the local archive and is never sent to MAX. `tag:work` finds messages tagged `work`, messages in a chat with that tag and messages from a person with that tag. A tag is 1–32 characters: Latin letters a–z, digits and hyphens.

## Saved searches and history

```sh
max searches create meetings 'библиотека OR кафе' --chat "Книжный клуб"
max messages search --saved meetings
max messages search --saved meetings 'date:today'   # слова добавляются через AND
max messages stats --saved meetings --by day
max searches list
max searches history --limit 10
max messages search --saved 42                   # строка истории, по её номеру
```

`searches create` saves a query with its options and runs nothing; an existing name needs `--replace`.
Options you type with `--saved` replace the saved ones. The saved text is read again on every run, so
`date:7d` always means the last 7 days. `searches show` prints one, `searches delete` removes one.

Every successful search and count goes into the history: the query and options, never the messages found. The latest 1,000 runs are kept. `--no-record` excludes one run; in MCP, use `record: false`. `searches clear` clears the history, leaving saved searches intact. This history is separate from `max runs`.

Saved searches and history live in the archive shared by `max` and `tg`: both see the same entries, and `delete` or `clear` in one changes them in the other. Tags remain with their own account.

## Counting: `messages stats`

```sh
max messages stats счёт                          # сколько в каждом чате
max messages stats 'date:7d' --by sender
max messages stats 'from:me' --by day --timezone Europe/Madrid
max messages stats --by hour                     # все сохранённые сообщения
```

`messages stats` counts the messages `messages search` would find with the same query, each one once.
`--by chat` (the default) and `--by sender` put the largest first; `--by day` and `--by hour` go in
order. When some chats are not stored in full, the numbers are a lower bound, and stderr says how
many chats that is.

## When nothing is found

An empty answer means “not in the archive you searched”, not “never sent”. `max store status` shows what is stored; `max store fetch` adds history. With `--json`, the answer reports which chats were searched and how complete they are, even without matches. If `max` asks for `max store migrate`, the word index is still being built; searches without words (`has:file`, `date:today`) already work.

To search every account in the store, add `--source all`. `--newest` orders by time instead of by
relevance, and `--context 2` shows two messages around each one found.

## For scripts and agents

`--json` returns one object with the messages and what was searched; `--jsonl` streams the messages
only. In MCP, `max_messages_search` and `max_messages_stats` take the same queries, and `max_tags_*` and
`max_searches_*` manage tags and saved searches. The answer's fields,
the older `--language legacy` mode and `--regex` are in the [query language](./query-language.md).

Search reads the local archive by default. `--sync-first` explicitly fetches new messages before searching and
marks nothing read: at most 5 chats, 500 messages and 30 seconds. Change these bounds with `--max-chats`,
`--max-messages`, `--sync-time`. Failed or incomplete refresh retains local results with stale coverage and refresh
details.

`content:договор` searches words in the retained text of an attachment. Extraction supports plain-text files, DOCX and PDFs with text layers. Your agent reads photos and scans and saves their text through `attachments text set`. For multiple attachments, specify `--attachment`, numbered from 1.

```sh
max attachments extract --chat "Книжный клуб" --download --output-dir ./files
max messages search 'content:договор'
max attachments list --chat "Книжный клуб" --needs-text
max attachments text set "Книжный клуб" 204 --text-file ./scan.txt
```

`--download` requires `--output-dir`; without them extraction reads retained files. `list` exposes retained paths and text status, not text contents.

`--thread` follows the stored reply graph; in `messages context` it replaces chronological neighbours. Defaults are
8 hops, 50 messages, 65,536 bytes and one day around each hit. Change them with `--thread-hops`,
`--thread-messages`, `--thread-bytes`, `--thread-within`. Without a graph it falls back to chronological context;
stale links are marked and not traversed.

PDF extraction needs the optional package `unpdf`; DOCX needs `mammoth`, installed alongside `max`. For a global npm installation: `npm install -g unpdf mammoth`. If a package is missing, the command reports it; an agent can supply the text instead.