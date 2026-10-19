---
title: "Search"
---

<a id="для-скриптов-и-агентов" />
<a id="подготовка-файлов-и-архива" />

Search helps you recover a message, agreement, file or old code without scrolling through chats. This page explains searching data saved on this computer—messenger messages and notes—and searching the MAX server. Mail is searched by [memo](https://github.com/WireCatLabs/cli-memo): `memo search mail`.

After reading it, you will be able to find messages by words, people, chats, dates, files and links, save the search and run it again, count matches and distinguish between a real “not found” and a gap in the saved history. The search does not mark anything as read.

Terms used below:

- **Local archive** — the database saving messages read or downloaded by `max` ([local archive](./archive.md)). Most searches read only this database.
- **Query** — words and conditions such as `from:` and `date:`. Your AI agent can construct it; see the [query-language reference](./query-language.md).
- **Coverage** (`coverage`) — which saved chats/messages were searchable and which chats were never downloaded or are out of date.

## When you remember the question rather than the exact words

Ask your AI agent to find messages answering a question and show the evidence. For example: “Find the daily export time for project Mayak in its chat and check whether the schedule changed.” The agent can find partial word matches and direct replies, then read the messages. This needs downloaded history; no model download is required.

For command-line control:

```sh
max personal search messages 'Во сколько ежедневная выгрузка проекта Маяк? chat:990' --discover --json
```

This searches the local archive only. Chat, sender and date filters stay in force. In MCP, pass `discover: true` to the message-search tool. `items[].discovery.missing_terms` lists missing words, and `parent` links a reply to its matching parent. A high score is not answer confidence: a question, proposal or old decision can rank first. Read the evidence and check [archive coverage](./archive.md) before concluding that a fact is absent.

Without `--discover`, strict search remains the default. Boolean syntax, quoted phrases, wildcards, AST, `--exact` and `--newest` keep strict semantics. Discovery cannot combine with `--backend server`. Meaning-based conversation search stays a separate [topic-search option](./topic-search.md).

## What you can do

The entire search is in one command group, `max personal search`. If you don't know where it was written, start with `search all`.

| Task | Command |
|---|---|
| Search immediately in messages and notes | `max personal search all '<запрос>'` |
| Search messenger messages; without `--discover`, also on the MAX server in one chat | `max personal search messages '<запрос>'` |
| Search mail | `memo search mail '<запрос>'` — `max` has no such command |
| Search notes from memo or folder | `max personal search notes '<запрос>'` |
| Find a discussion by what it was about | `max personal search conversations '<вопрос>'` ([search by topic](./topic-search.md)) |
| Count matches by chats, people, days or hours | `max personal stats messages show '<запрос>'` |
| Save search and run it again | `max personal searches create`, `max personal search messages --saved <имя>` |

```sh
max personal search all 'договор аренды'                 # сообщения и заметки, лучшее первым
```

```sh
max personal search messages 'договор chat:Друзья'     # только сообщения мессенджеров
```

```sh
memo search mail 'счёт'                                  # почта — это memo; max search mail подскажет его
```

```sh
max personal search notes 'бюджет source:internal'       # только заметки, написанные в memo
```

```sh
max personal search conversations 'переезд на дачу'      # разговоры, близкие по смыслу
```

`search all` labels each match as a message (`msg:…`) or note (`note:…`). `max` does not search mail: neither `search messages` nor `search all` does; `max personal search mail` answers with a hint, “mail is memo's: install @wirecat/cli-memo, then `memo search mail …`”. In `search messages`, `NOT has:attachment`, `has:voice` and `has:file` in the query keep only text, voice messages or files; `source:internal` and `source:file` in the `search notes` query select memo or folder notes. When a field does not apply, for example `chat:`/`from:` for notes, `search all` skips that source and explains why.

Notes are archived via memo: `memo import`. Without them, `search all` only looks for messages.

The rest of this page covers `max personal search messages`. Without `--discover`, searches within one chat can also query the MAX server ([below](#поиск-на-сервере-max---backend)).

## Try a focused search

Start with a phrase and one chat. This example searches saved history without asking the messenger.

**Your request:**

> Find the message saying “счёт оплачен” in Книжный клуб. Show the match and any gaps in the history.

**Command:**

```sh
max personal search messages '"счёт оплачен" chat:"Книжный клуб"' --backend archive --json
```

**Example agent answer:**

> **One matching message in saved history.**
>
> | Person | Message |
> | --- | --- |
> | Алиса Тестова | Счёт оплачен вчера. |
>
> History is incomplete: other matches may be missing. I can open this message and its surrounding conversation.

An empty result is not proof that the message never existed. Check the reported history gaps before broadening the search. The examples on this page are fictional.

## Prepare your archive first

Good search requires downloaded chats. The MAX server searches only one specified chat. Everything else uses only the archive: searching all chats, counting with `stats`, topic search, `has:`, `filename:`, regex, presets, tags and word forms. Start by downloading all chats:

```sh
max personal messages sync --all --background     # последние 90 дней каждого чата, в фоне
```

```sh
max personal store jobs show                    # сколько уже скачано
```

By default, a run downloads at most 1,200 messages per chat; repeat to continue. Use `--since-time 365d` for older history or `max personal messages sync Друзья` for one chat ([download history](./archive.md#скачать-историю)). `max personal serve` then keeps the archive current.

Every search reports what it searched. If the archive could contain more history or no results were found, one line in the terminal shows how many messages and chats were searched, how many chats have never been downloaded or are out of date, and the command to fix that:

```text
searched 12,430 messages in 37 chats — 5 never fetched; `max personal messages sync --all --background` fetches them
```

With `--json` the same is a `coverage` entry in `missing` and a `messages.sync` step in `next`. If nothing is found and `next` is specified, run this command (or ask the agent) before deciding there is no message.

Put the query in single quotes, so the shell leaves its quotes and brackets alone. The names below are
examples; use your own chats and people.

## Words and phrases

```sh
max personal search messages счёт
```

```sh
max personal search messages '"счёт оплачен"'             # слова подряд
```

```sh
max personal search messages 'кафе OR библиотека'
```

```sh
max personal search messages '(кафе OR библиотека) NOT шумно'
```

```sh
max personal search messages 'квартир*'                   # все слова, которые начинаются на «квартир»
```

All adjacent query words must appear in the message. Search matches word forms: `квартира` finds «квартиру». Quotes preserve word order but also allow other forms. For an exact form, use `exact:квартира` or add `--exact` for words without an explicit field. An explicit `text:` still matches word forms. Case, stress marks, `ё` and `е` are treated alike. Typos are not corrected automatically. Word forms depend on the archive language settings.

## People and chats

```sh
max personal search messages 'from:"Алиса Тестова" счёт'
```

```sh
max personal search messages 'from:("Алиса Тестова" OR "Борис Тестов") библиотека'
```

```sh
max personal search messages 'from:me date:7d'            # что вы писали за неделю
```

```sh
max personal search messages 'chat:"Книжный клуб" библиотека'
```

```sh
max personal search messages 'паспорт kind:private'       # только личные переписки
```

`kind:` accepts `private` (Personal), `group`, `channel`, `saved` (Favorites) and `bot`. Search in all archive accounts - `--source all`.

## Dates

```sh
max personal search messages 'date:today'
```

```sh
max personal search messages 'библиотека date:yesterday'
```

```sh
max personal search messages 'счёт date:7d'               # от 7 дней назад до сейчас; также 30m, 2h
```

```sh
max personal search messages 'счёт date:[2026-01-01 TO 2026-02-01}' --timezone Europe/Madrid
```

`today`, `yesterday` and calendar dates are days in your computer's time zone; `--timezone` picks
another. In a range, `[` and `]` include that day, `{` and `}` exclude it.

## Files and links

```sh
max personal search messages 'has:file'
```

```sh
max personal search messages 'filename:*.pdf'
```

```sh
max personal search messages 'filename:*договор*'         # часть имени
```

```sh
max personal search messages 'size>10MB'
```

```sh
max personal search messages 'size:[1KB TO 300KB]'
```

```sh
max personal search messages 'has:photo chat:"Книжный клуб"'
```

```sh
max personal search messages 'has:link AND "github.com"'  # ссылка на сайт
```

A file is found by name and size even when the message has no text. `filename:` compares the whole name, ignoring case, accents and `ё`. Sizes use KB, MB and GB of 1,024. MAX does not report the file type, so search by extension: `filename:*.pdf`, rather than `mime:`. `has:` also accepts `attachment`, `video`, `audio`, `voice`, `sticker`, `contact`, `location` and `poll`. A link counts whether it appears in the text or only in a link card. A phone number, an email address, the site of a link or a confirmed person from the text are found by the fields `phone:`, `email:`, `url:`, `domain:` and `mentions:`; see [Mentions](./query-language.md#упоминания).

## Text inside files

`content:` searches for text inside attachments: PDF, Word document, scan. First, the text needs to be extracted into the archive - this is done by `max` or your agent. More information about the files - [attachments](./attachments.md).

```sh
max personal attachments extract --chat "Книжный клуб" --download --output-dir ./files
```

```sh
max personal search messages 'content:договор'
```

```sh
max personal attachments list 'chat:"Книжный клуб" is:needs_text'
```

```sh
max personal attachments text set "Книжный клуб" 204 --text-file ./scan.txt
```

The `attachments extract` reads plain text files, DOCX and PDF with a text layer on this computer. `--download` requires `--output-dir`; without them, extraction reads already downloaded files. If there are several attachments in the message, indicate one through `--attachment`, starting with 1.

Local extraction also reads UTF-16 with BOM, confidently detected legacy encodings, ODT, ODS, XLSX, PPTX and EPUB, without AI or additional packages. It preserves sheet/slide/chapter order and saved cell values but does not calculate formulas or read images. Your agent should check ambiguous encoding and convert it when needed. Original files stay unchanged. DOCX, ODT, ODS, XLSX, PPTX and EPUB are limited to 1,000 archive parts, 50 MiB unpacked and 10 MiB per XML/HTML text part. Corrupt or incomplete reads are not indexed as complete. Failed reads can be retried; agent text and previous successful text are protected.

For PDF you need the optional package `unpdf`, for DOCX - `mammoth`, installed in the same place as `max`. For a global npm install: `npm install -g unpdf mammoth`. If the package is not present, command reports this; the text can be recorded by an agent.

**Photos and scans** lack a text layer. Your agent normally uses its own OCR or vision tools, then saves text with `attachments text set`. `attachments list is:needs_text` returns local paths, message links and attachment numbers, but no text. Verify by searching `content:`. A remote agent needs the actual file: a server path does not transfer it. [Attachments show](./attachments.md) can transfer saved bytes in chunks with hash verification; transfer does not recognise or index text. Save the result with `attachments text set`.

**Bulk scan recognition** can use an AI provider you explicitly select. Configure a vision-capable provider/model in `models.ocr` and save the key through `models text key set`. Replace `your-vision-model` with the desired model id.

```sh
max personal config set models.ocr.provider openai
```

```sh
max personal config set models.ocr.model your-vision-model
```

```sh
max personal models text key set openai
```

```sh
max personal attachments extract --chat "Книжный клуб" --ocr --concurrency 4 --limit 100 --json
```

`--ocr` sends images to the chosen service; otherwise no AI call occurs. Parallelism is 1–8, default 4; file limit is 1–500, default 100. Continue with the returned `cursor`. PDF scans require optional `unpdf` and `@napi-rs/canvas`, with at most 20 pages per document. Text-layer pages stay local. File hashes and the selected model allow reuse. Agent text and prior indexed text survive errors or cancellation. Check `failed` and each file status; provider rate limits stop further calls in that run. `--offline` cannot combine with `--ocr`.

**Files already saved.** `max personal attachments extract --chat <чат> --from-dir ./files` reads one folder without subfolders. It requires one uniquely matching source file or a complete set with downloader filenames. Do not combine `--from-dir` with `--download` or `--output-dir`. `max personal messages download <чат> <id> --extract` reads only files downloaded in this run; `--all --extract` does this for the entire run. Hashes detect changed files; agent text stays protected. Bounded MCP extraction returns a continuation `cursor` and file information, not text.

`--from-dir` refuses known credential files and folders, the CLI’s own folders and the message store; ordinary hidden working folders are allowed. MCP extraction downloads require `output_dir` outside protected locations. PDF text extraction has no separate page-count limit or 30-second timer; command cancellation and file-size and text-size limits still apply.

## Passwords, codes and cards

```sh
max personal search messages 'preset:secret kind:saved'   # что-то похожее на пароль или токен в Избранном
```

```sh
max personal search messages 'preset:card'
```

A preset finds messages that *look like* a password, a login code, an API key, a card or IBAN number, a
passport, a phone, an email or a link. It checks the shape only: it does not prove that a password
works or a card is real. The full list is in the [query language](./query-language.md#preset).

## Tags

```sh
max personal tags add work --chat "Книжный клуб"
```

```sh
max personal tags add work --contact "Борис Тестов"
```

```sh
max personal tags list tag:work type:chat
```

```sh
max personal search messages 'tag:work счёт'
```

```sh
max personal search messages 'счёт NOT tag:work'
```

```sh
max personal tags remove work --chat "Книжный клуб"
```

A tag is your own label on a chat, a person or one message (`--message <id> --chat <чат>`). It stays in the local archive and is never sent to MAX. `tag:work` finds messages tagged `work`, messages in a chat with that tag and messages from a person with that tag. A tag is 1–32 characters: Latin letters a–z, digits and hyphens.

Group and channel tags can be generated automatically from their title, username and description, without reading messages or using a model:

```sh
max personal metadata refresh --chat "Книжный клуб"   # прочитать описание чата из MAX (сам чат не меняется)
```

```sh
max personal metadata refresh --only-missing          # все сохранённые группы и каналы, у которых описание ещё не читалось
```

```sh
max personal tags auto --dry-run                      # что получилось бы, без записи
```

```sh
max personal tags auto                                # записать автоматические метки
```

```sh
max personal tags list sources:auto                  # только автоматические
```

Automatic tagging leaves your tags intact: rerunning it removes only outdated automatic tags. If you manually add a tag that was already added automatically, it becomes your own tag.

`max personal tags auto` processes up to 50 chats per run; `--limit` raises the cap to 500, and `--chat` selects chats (repeatable). `--dry-run` uses the saved descriptions. To read fresh ones before tagging, add `--sync-first` without `--dry-run`. `max personal metadata get --chat <чат>` shows the saved description.

## Saved searches and history

```sh
max personal searches create meetings 'библиотека OR кафе' --chat "Книжный клуб"
```

```sh
max personal search messages --saved meetings
```

```sh
max personal search messages --saved meetings 'date:today'   # слова добавляются через AND
```

```sh
max personal stats messages show --saved meetings --by day
```

```sh
max personal searches list
```

```sh
max personal searches history --limit 10
```

```sh
max personal search messages --saved 42                   # строка истории, по её номеру
```

`searches create` saves a query with its options and runs nothing; an existing name needs `--replace`.
Options you type with `--saved` replace the saved ones. The saved text is read again on every run, so
`date:7d` always means the last 7 days. `searches show` prints one, `searches delete` removes one.

Every successful search and count goes into the history: the query and options, never the messages found. The latest 1,000 runs are kept. `--no-record` excludes one run; in MCP, use `record: false`. `searches clear` clears the history, leaving saved searches intact. This history is separate from `max personal runs`.

Saved searches and history live in the archive shared by `max` and `tg`: both see the same entries, and `delete` or `clear` in one changes them in the other. Tags remain with their own account.

## Count messages: `stats messages show`

```sh
max personal stats messages show счёт                          # сколько в каждом чате
```

```sh
max personal stats messages show 'date:7d' --by sender
```

```sh
max personal stats messages show 'from:me' --by day --timezone Europe/Madrid
```

```sh
max personal stats messages show --by hour                     # все сохранённые сообщения
```

`stats messages show` counts each message that `search messages` would find with the same query once. `--by chat` (the default) and `--by sender` sort the highest counts first; `--by day` and `--by hour` use chronological order. If some chats are only partly saved, the counts are lower bounds, and stderr reports how many chats are incomplete.

## Search the MAX server: `--backend`

When a query contains words and `--discover` is not set, `max` queries both the server and the archive by default (`--backend both`). `--discover` always reads the archive only, including with `--backend both`.

With a chat (`chat:` in the query), the server searches that chat. Without a chat, the server searches all chats the way the search bar on web.max.ru does: in one request, returning one message from each chat — the best match. The archive finds the other matches in those chats if it has them. Chat titles and public channels are not included in the answer.

```sh
max personal search messages 'счёт chat:"Книжный клуб"'                    # архив и сервер MAX, один чат
```

```sh
max personal search messages 'счёт'                                          # архив и сервер MAX, все чаты
```

```sh
max personal search messages 'счёт chat:"Книжный клуб"' --backend server   # только то, что нашёл сервер
```

```sh
max personal search messages 'счёт' --backend archive                        # только архив
```

The server also matches word prefixes, but not other word forms: `книгу` will not find «книга». `max` therefore treats its results as candidates: it saves them in the archive and checks them against your query using the archive rules. `exact:`, `-слово`, quotes and result ordering work as they do without the server, and messages are not duplicated. `max` waits at most 5 seconds for the server (`--server-time`, up to 60 seconds) and marks nothing as read.

With `--json`, each message has `found_in` (`archive`, `server` or `both`). When searching both sources, an unavailable server or a read-only profile still allows archive results. An explicit `--backend server` fails if the profile does not allow server search. The required permission is `messages.server-search`.

## First download new: `--sync-first`

```sh
max personal search messages 'счёт chat:"Книжный клуб"' --sync-first
```

`--sync-first` first downloads new messages without marking anything as read: no more than 5 chats, 500 messages and 30 seconds. The limits change `--max-chats`, `--max-messages`, `--sync-time`. If the download failed or ended early, you still get the result from the archive - with a mark about outdated coverage and information about the download.

## Messages around the find

`--newest` orders by time rather than proximity, and `--context 2` shows two messages before and after each one found (default 2 in terminal and 0 in other modes).

`--thread` replaces chronological neighbours with saved reply chains around each match, including replies to it. It also applies to `messages context`. Default limits are 8 hops, 50 messages, 65,536 bytes and one day either side, adjustable through `--thread-hops`, `--thread-messages`, `--thread-bytes` and `--thread-within`. Without links, chronological context is used. Stale links are flagged and not followed. `messages context` with `--offline` reads saved data only.

## Result in JSON

A terminal shows a message feed. `--json` returns one object with messages and search scope; `--jsonl` emits only messages, one per line. See [response fields](./query-language.md#ответ).

## When nothing is found

An empty answer means “not in the archive you searched”, not “never sent”. `max personal store status` shows what is stored; `max personal messages sync` adds history. With `--json`, the answer reports which chats were searched and how complete they are, even without matches. If `max` asks for `max personal store migrate`, the word index is still being built; searches without words (`has:file`, `date:today`) already work.

**Gaps in history.** `max personal store gaps plan <чат>` locally identifies gaps between saved ranges. Missing message ids and quiet periods alone do not prove missing history; archive edges remain `unknown`. Review the plan, then `max personal store gaps repair <чат> --fingerprint <хеш>` downloads gaps. Defaults: 5 gaps, 500 messages, 30 seconds; adjust through `--max-gaps`, `--limit`, `--repair-time`, `--page-size` and `--pause`. A repeated run checks remaining gaps and never deletes a message just because MAX omitted it. Ambiguous same-time pages remain incomplete. `--background` starts a job managed through `store jobs show`, `store jobs list` and `store jobs cancel`. Repair requires `store.gaps.repair` and read permission; planning never connects. MCP discovers commands through `max_tools_search`, reads plans/jobs through `max_read`, and repairs through `max_write`.

**Prepare topic search while downloading.** `max personal messages sync <чат> --catch-up` builds discussions and local vectors for only that chat after download ([topic search](./topic-search.md)). It is off by default; `search_catch_up: true` enables it and `--no-catch-up` disables it for one run. Limits: `--catch-up-chunks 500 --catch-up-messages 10000 --catch-up-time 30s`. It neither downloads recognition files automatically nor calls a remote service. `prepared` reports preparation separately; downloaded history survives regardless.

## Next steps

- [Topic search](./topic-search.md) — find a discussion by what it was about, when you do not remember
  its words.
- [Query language](./query-language.md) — every field, operator, limit and the JSON answer.
- [How search works](https://wirecat.dev/ru/docs/search-architecture) — the technical page: the word
  index, the conversation graph, vectors and how results are ranked.

## Pictures: search by what they show

Picture search is off until you turn it on. It works separately for each profile, on this computer: `max` downloads
each picture through MAX one at a time, turns it into a vector of 512 numbers and deletes it. The archive keeps only
the vector and the file checksum.

```sh
max personal config set picture_search true
max personal images models download clip-b32
max personal images embed
```

`images models download clip-b32` downloads the model once (about 155 MB). `images embed` processes pictures that do
not have a vector yet and continues from where it stopped. `--chat <чат>` and `--limit <n>` limit the amount. Nothing
is marked as read.

After this, a word search returns a `pictures` list next to the results: messages whose picture is closest to the query
(`ref`, `score`). It is not mixed into the text ranking. The picture query must be in **English**: the text part of the
model knows no other language, so the agent translates the query first. Without `picture_search` there is no `pictures`
list. If the setting is on but the model is missing, `pictures_skipped` says so.
