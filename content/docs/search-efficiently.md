---
title: "Search efficiently"
description: "Choose the right search command, narrow before you search, page through results and keep the output small, with a table of common filters and the mistakes that cost a search."
---

You have a lot stored, and an agent pays for every result it reads. This page shows how to get the right records in the fewest steps: pick the command, narrow before you search, page through results and trim the output. After it, you can turn a vague question into one precise search and check what the search covered. It assumes the history you need is already downloaded: [Searching](./search.md#fetch-the-relevant-chat-history-first).

## Choose the command

Put the tool name and your profile name in front of each command, as in `tg personal search messages`.

| You want | Run | Notes |
| --- | --- | --- |
| Words in your Telegram or MAX messages | `search messages` in `tg` or `max` | Reads the local archive and, by default, the messenger's server |
| A phone, email, link or person's name written in messages | `search messages` with `phone:`, `email:`, `domain:` or `mentions:`, or `mentions list` | Found by rules, in any spelling |
| Everything about one person, in every messenger | `contacts timeline` | Needs the identities linked with `contacts link` |
| A discussion, when you remember the subject and not the words | `search conversations` | Needs `conversations build` and `conversations embed` once for the chat |
| A picture by what it shows | `search messages "dog on a beach"` | English only, and the picture setting must be on: [What gets indexed](./what-is-indexed.md#pictures) |
| Mail, notes, or you do not know where it was written | `memo search all`, `memo search mail`, `memo search notes` | The answer lists the sources it skipped and why |
| Messages of every messenger at once | `memo search messages` | Messages only |
| A decision or a promise | `memo facts list` | Each fact links to its evidence |
| A Drive document, by words or meaning | `drive search` | `--exact` for words only |
| A Drive file, by name, type, folder, person or tag | `drive catalog list` or `drive catalog search` | Metadata only, works offline |

## Narrow first, then search

A search that names a chat, a sender and a period reads fewer records and returns fewer wrong ones. Add filters in this order: chat, sender, date, kind, attachment, then the words.

| Filter | Finds | Example |
| --- | --- | --- |
| `chat:` | One chat, by name or id | `chat:"Book club"` |
| `from:` | One sender | `from:"Kai Sample"` |
| `date:` | A period, or everything after a day | `date:[2026-01-01 TO 2026-02-01}`, `date>=2026-10-01` |
| `kind:` | Private chats, groups, channels, bots | `kind:group` |
| `has:` | Messages with a file, photo, voice note, link or text | `has:file` |
| `filename:` | A file by its name | `filename:*.pdf` |
| `mime:` | A file by its type (Telegram only) | `mime:"application/pdf"` |
| `size:` | Files by size | `size>10MB` |
| `content:` | Words inside a file | `content:invoice` |
| `transcript:` | Words said in a voice note | `transcript:invoice` |
| `tag:` | Your own labels | `tag:work` |
| `phone:`, `email:`, `url:`, `domain:`, `mentions:` | A value found in the text | `phone:"+1 555 010 0100"`, `mentions:"person:7"` |

Field names are case sensitive, and an unknown field is an error, not an empty answer. The full list of fields is in the query language of [Telegram](./tg/query-language.md) and [MAX](./max/query-language.md). The last row is in the latest releases of `tg` and `max`.

```sh
tg personal search messages 'chat:"Book club" from:"Kai Sample" date>=2026-10-01 delivery' --limit 10
```

When the messenger's own server is asked too, only the words, one chat, one sender and the dates go to it. `has:`, `tag:`, negations and wildcards are applied locally. Details: [How search works](./search-architecture.mdx#server-search-beside-the-archive).

## The operators

| Write | Meaning |
| --- | --- |
| `invoice paid` | Both words, in any order (AND is the default) |
| `alpha OR beta` | Either word |
| `alpha NOT beta`, `alpha -beta` | The first word without the second |
| `+alpha` | The word must be there |
| `(alpha OR beta) gamma` | A group |
| `from:(alice OR bob)` | One field for several values |
| `date:[2026-01-01 TO 2026-02-01}` | A range: `[ ]` includes the end, `{ }` excludes it |
| `invo*` | Any ending |
| `text:/pass(port)?/` | A regular expression, matched against whole words |

Three rules prevent most surprises:

- A query that is only a negation selects nothing. Pair it with a positive condition: `has:photo NOT has:text`.
- An explicit `AND` binds tighter than `OR`. `alpha OR beta gamma` means `(alpha OR beta) AND gamma`.
- `and`, `or` and `not` in lower case are ordinary words. Typos such as `invoice~1` and boosts such as `invoice^2` are errors.

## Words, forms and meaning

A plain word finds its other forms: "invoice" finds "invoices". For the exact form only, use `exact:invoice`. For typos, use `--language legacy`. Words inside files and transcripts match the exact form only.

Use `search conversations` when you remember what a discussion was about and not which words were used. Ask in your own words, in any language the model reads. It always returns the nearest conversations, even when none of them answers, so open the messages before you rely on one. For an exact name, number or id, use a field search instead. More: [Topic search](./tg/topic-search.md).

## Page through the results

The answer says whether more results exist (`has_more`). That describes the page, not whether the messenger holds more. Repeat the same command with the same filters and ask for the next page. Which flag does it depends on the command:

| Command | Next page |
| --- | --- |
| `search messages` in `tg` and `max` | `--page <n>`, counting from 1 |
| `contacts timeline` | `--cursor <cursor>`, with the cursor from the answer's `page.next` |
| `mentions list`, `drive catalog list`, `drive catalog search` | `--page <n>` |
| `memo search notes`, `drive search` | `--offset <n>` |
| `memo search all`, `memo search mail`, `memo search messages` | `--limit` only, up to 100: narrow the query instead |

## Keep the output small

- `--limit <n>` caps the hits.
- `--brief` shows each found message as a reference, time, sender and excerpt. Scan with it, then open one hit.
- `--json=ref` keeps only the fields you name. `--jsonl` prints one result per line. `--full` returns whole texts.
- `--max-output-bytes` caps machine output at 4 MiB by default. A result over the cap fails visibly instead of being cut.
- `--context <n>` adds `n` neighbouring messages on each side of a hit. It is 0 when the output is not a terminal.

## Read the evidence, then widen

Open one hit with its neighbours, or follow its reply chain:

```sh
tg personal messages context "msg:telegram/1/77/42" --before-n 3 --after-n 3
tg personal messages context "msg:telegram/1/77/42" --thread
```

If an answer looks thin, read its `missing` entry. It names what was not searched and the step that fixes it, such as downloading a chat. Each hit says where it matched (`matched_in`: `text`, `transcript`, `filename` or `file`). To compare the count with what you expect, `stats messages show` (in the latest releases) counts matches by chat, sender, day or hour.

## Recipes

Replace the names with yours.

| Goal | Command |
| --- | --- |
| An agreement and its source | `tg personal search messages 'chat:"Book club" agreed date>=2026-10-01' --limit 5` |
| Everything about one person this month | `tg personal contacts timeline "Kai Sample" --since-time 2026-10-01` |
| Where a phone number appears | `tg personal search messages 'phone:"+1 555 010 0100"' --brief` |
| Files sent in a chat last week | `tg personal search messages 'chat:"Book club" has:file date>=2026-10-07' --brief` |
| What a Drive document says about a topic | `drive personal search 'budget' --exact --limit 5` |

For longer ones, see the recipes for [Telegram](./tg/recipes.md) and [MAX](./max/recipes.md).

## Common mistakes

| Mistake | What happens | Instead |
| --- | --- | --- |
| Searching before the history is downloaded | Few or no results | Download the chat first; read `missing` in the answer |
| Reading an empty answer as "never sent" | The archive may be incomplete | Check what the answer says it covered |
| Quoting a phrase to get the exact form | Quotes match any word form | `exact:"final invoice"` |
| `mime:application/pdf` without quotes | The `/` starts a regular expression | `mime:"application/pdf"`, or `filename:*.pdf` |
| `mime:` in MAX | MAX does not report file types | `filename:*.pdf` |
| `has:photo` to find what a picture shows | It only says a photo is attached | Picture search, in English |
| A message field in a Drive search | Drive has its own filters | `tag:` and `--exact`, or `catalog list` |
| `From:` instead of `from:` | An error | Field names are lower case |
| Asking a picture search in another language | The model knows English only | Have your agent translate first |

## Check the result

Open the source of the best hit and compare it with what you remembered. If a kind of content never turns up, check the one step it needs: [What gets indexed](./what-is-indexed.md#what-each-kind-needs). If a link between records is missing, see [How things are linked](./how-things-are-linked.md#if-a-link-is-missing).

Next: the query language of [Telegram](./tg/query-language.md) or [MAX](./max/query-language.md) lists every field, preset and date form.
