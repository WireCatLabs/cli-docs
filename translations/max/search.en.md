---
title: "Message search"
---

`max messages search` searches the local archive, the copy of your chats that `max` keeps on this computer. Searching one chat also queries the MAX server ([below](#поиск-на-сервере-max---backend)). It does not mark anything as read.

## Prepare your archive first

Good search requires downloaded chats. The MAX server searches only one specified chat. Everything else uses only the archive: searching all chats, counting with `stats`, topic search, `has:`, `filename:`, regex, presets, tags and word forms. Start by downloading all chats:

```sh
max store fetch --all --background     # последние 90 дней каждого чата, в фоне
max store jobs show                    # сколько уже скачано
```

Use `--since-time 365d` to go further back, or `max store fetch Друзья` for one chat ([archive](./archive.md)). Each run downloads at most 1200 messages per chat by default; repeat the command to continue. After that, `max serve` keeps the archive up to date.

Every search reports what it searched. If the archive could contain more history or no results were found, one line in the terminal shows how many messages and chats were searched, how many chats have never been downloaded or are out of date, and the command to fix that:

```text
searched 12,430 messages in 37 chats — 5 never fetched; `max store fetch --all --background` fetches them
```

With `--json`, the same information appears in `coverage`: `messages`, `chats`, up to ten chats in `attention`, and `next`. If an agent finds nothing while `next` is set, it should run that command (or ask you) before saying the message does not exist.

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
max messages search '"счёт оплачен"'             # слова подряд
max messages search 'кафе OR библиотека'
max messages search '(кафе OR библиотека) NOT шумно'
max messages search 'квартир*'                   # все слова, которые начинаются на «квартир»
```

All adjacent query words must appear in the message. Search matches word forms: `квартира` finds «квартиру». Quotes preserve word order but also allow other forms. For an exact form, use `exact:квартира` or add `--exact` for words without an explicit field. An explicit `text:` still matches word forms. Case, stress marks, `ё` and `е` are treated alike. Typos are not corrected automatically. Word forms depend on the archive language settings.

## Search the MAX server: `--backend`

```sh
max messages search 'счёт' --chat "Книжный клуб"                    # архив и сервер MAX
max messages search 'счёт' --chat "Книжный клуб" --backend server   # только то, что нашёл сервер
max messages search 'счёт' --backend archive                        # только архив
```

The MAX server searches only one chat. When a query specifies one chat (`--chat` or `chat:`) and contains words, `max` queries both the server and the archive by default (`--backend both`). Without a specified chat, it does not query the server; results come from the archive.

The server also matches word prefixes, but not other word forms: `книгу` will not find «книга». `max` therefore treats its results as candidates: it saves them in the archive and checks them against your query using the archive rules. `exact:`, `-слово`, quotes and result ordering work as they do without the server, and messages are not duplicated. `max` waits at most 5 seconds for the server (`--server-time`, up to 60 seconds) and marks nothing as read.

With `--json`, each message has a `source` (`archive`, `server` or `both`), and the `server` block reports what the server returned. When searching both sources, an unavailable server or a read-only profile still allows archive results. An explicit `--backend server` fails if the profile does not allow server search. The required permission is `messages.server-search`.

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

Group and channel tags can be generated automatically from their title, username and description, without reading messages or using a model:

```sh
max metadata refresh --chat "Книжный клуб"   # прочитать описание чата из MAX (сам чат не меняется)
max tags auto --dry-run                      # что получилось бы, без записи
max tags auto                                # записать автоматические метки
max tags list --source auto                  # только автоматические
```

Automatic tagging leaves your tags intact: rerunning it removes only outdated automatic tags. If you manually add a tag that was already added automatically, it becomes your own tag.

## Saved searches and history

```sh
max searches create meetings 'библиотека OR кафе' --chat "Книжный клуб"
max messages search --saved meetings
max messages search --saved meetings 'date:today'   # слова добавляются через AND
max stats messages show --saved meetings --by day
max searches list
max searches history --limit 10
max messages search --saved 42                   # строка истории, по её номеру
```

`searches create` saves a query with its options and runs nothing; an existing name needs `--replace`.
Options you type with `--saved` replace the saved ones. The saved text is read again on every run, so
`date:7d` always means the last 7 days. `searches show` prints one, `searches delete` removes one.

Every successful search and count goes into the history: the query and options, never the messages found. The latest 1,000 runs are kept. `--no-record` excludes one run; in MCP, use `record: false`. `searches clear` clears the history, leaving saved searches intact. This history is separate from `max runs`.

Saved searches and history live in the archive shared by `max` and `tg`: both see the same entries, and `delete` or `clear` in one changes them in the other. Tags remain with their own account.

## Count messages: `stats messages show`

```sh
max stats messages show счёт                          # сколько в каждом чате
max stats messages show 'date:7d' --by sender
max stats messages show 'from:me' --by day --timezone Europe/Madrid
max stats messages show --by hour                     # все сохранённые сообщения
```

`stats messages show` counts each message that `messages search` would find with the same query once. `--by chat` (the default) and `--by sender` sort the highest counts first; `--by day` and `--by hour` use chronological order. If some chats are only partly saved, the counts are lower bounds, and stderr reports how many chats are incomplete.

## When nothing is found

An empty answer means “not in the archive you searched”, not “never sent”. `max store status` shows what is stored; `max store fetch` adds history. With `--json`, the answer reports which chats were searched and how complete they are, even without matches. If `max` asks for `max store migrate`, the word index is still being built; searches without words (`has:file`, `date:today`) already work.

To search every account in the store, add `--source all`. `--newest` orders by time instead of by
relevance, and `--context 2` shows two messages around each one found.

## Scripts and agents

`--json` returns one object containing messages and search coverage; `--jsonl` returns only messages, one per line. In MCP, `max_read` (`command: "messages search"`) and `max_read` (`command: "stats messages show"`) accept the same queries. The `tags` and `searches` commands, through `max_read`/`max_write`, manage tags and saved searches. See the [query language](./query-language.md) for response fields, the older `--language legacy` mode and `--regex`.

Searching for words in one specified chat queries both the archive and the MAX server by default; without a specified chat, it queries only the archive. `--backend archive` keeps the search local. `--sync-first` downloads new messages first, without marking anything as read: at most 5 chats, 500 messages and 30 seconds. Adjust these limits with `--max-chats`, `--max-messages` and `--sync-time`. An incomplete or failed update preserves local results and reports outdated coverage and the update outcome.

`content:договор` searches words in the retained text of an attachment. Extraction supports plain-text files, DOCX and PDFs with text layers. Your agent reads photos and scans and saves their text through `attachments text set`. For multiple attachments, specify `--attachment`, numbered from 1.

By default, the agent reads photos and scans with its own OCR or vision tools, then writes the text to this index. `attachments list --needs-text` returns the saved path, message locator and attachment number. Verify the entry with a `content:` search. If the agent runs remotely, a path on the MCP server does not give it the file: it needs access to the file to read it.

```sh
max attachments extract --chat "Книжный клуб" --download --output-dir ./files
max messages search 'content:договор'
max attachments list --chat "Книжный клуб" --needs-text
max attachments text set "Книжный клуб" 204 --text-file ./scan.txt
```

`--download` requires `--output-dir`; without them extraction reads retained files. `list` exposes retained paths and text status, not text contents.

For bulk processing, you can explicitly choose an API through the shared model gateway. Set the provider and an available vision model in `models.ocr`; store the key with the usual `models text key set` command. In the example, replace `your-vision-model` with your model name.

```sh
max config set models.ocr.provider openai
max config set models.ocr.model your-vision-model
max models text key set openai
max attachments extract --chat "Книжный клуб" --ocr --concurrency 4 --limit 100 --json
```

`--ocr` sends images to the selected API; without it, no model is called. Concurrency can be set to 1–8 requests, with a default of 4. The file limit is 1–500, with a default of 100; `cursor` continues a bounded scan. Scanned PDFs require the optional `unpdf` and `@napi-rs/canvas` packages; at most 20 pages per document are processed. Pages with a text layer are processed locally. Repeated runs use the file hash and selected model. Agent-written text and the previous index are preserved if OCR fails or is cancelled. Check `failed` and individual file statuses; once a provider limit is reached, this run stops making new API requests. `--offline` cannot be combined with `--ocr`.

`--thread` follows the stored reply graph; in `messages context` it replaces chronological neighbours. Defaults are
8 hops, 50 messages, 65,536 bytes and one day around each hit. Change them with `--thread-hops`,
`--thread-messages`, `--thread-bytes`, `--thread-within`. Without a graph it falls back to chronological context;
stale links are marked and not traversed.

PDF extraction needs the optional package `unpdf`; DOCX needs `mammoth`, installed alongside `max`. For a global npm installation: `npm install -g unpdf mammoth`. If a package is missing, the command reports it; an agent can supply the text instead.
## Prepare files and the archive

`max attachments extract --chat <чат> --from-dir ./files` reads files from the specified folder without traversing other folders. It requires an unambiguous match to the original file or a complete set of files named by the downloader. Do not combine `--from-dir` with `--download` or `--output-dir`. `max messages download <чат> <id> --extract` immediately extracts text only from the files it downloaded; `--all --extract` does the same for every file downloaded in that run. Through `max_write`, `attachments extract` returns processing results without file text; use `cursor` to continue a bounded scan. Changed file bytes are detected by hash, and agent-written text is preserved.

After downloading, `max store fetch <чат> --catch-up` prepares the graph and local vectors for that chat only. Preparation is disabled by default; the profile setting `searchCatchUp: true` enables it, and `--no-catch-up` disables it for one run. Limits: `--catch-up-chunks 500 --catch-up-messages 10000 --catch-up-time 30s`. The model is not downloaded automatically, and no remote provider is called. The `prepared` field separately reports whether preparation finished: downloaded history is preserved even when preparation is incomplete.

`max store gaps plan <чат>` shows gaps between recorded coverage ranges locally. Missing message numbers and quiet periods alone do not mean history is missing. Unknown archive boundaries remain in `unknown`. After reviewing the plan, `max store gaps repair <чат> --fingerprint <хеш>` explicitly downloads internal gaps. Defaults are at most 5 gaps, 500 messages and 30 seconds; adjust them with `--max-gaps`, `--limit`, `--repair-time`, `--page-size` and `--pause`. Rerunning checks remaining gaps without deleting messages merely because they are absent from the response. Ambiguous pages whose messages share a timestamp remain incomplete. `--background` starts a job that you can inspect or cancel with `store jobs show`, `store jobs list` and `store jobs cancel`. In MCP, find these commands with `max_tools_search`, then run the plan and read jobs through `max_read`, and perform repairs through `max_write`. Repair requires the `store.gaps.repair` permission and permission to read messages; planning does not connect to the server.
