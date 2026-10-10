---
title: "Search"
---

<a id="для-скриптов-и-агентов" />
<a id="подготовка-файлов-и-архива" />

Search helps you recover a message, agreement, file or old code without scrolling through chats. This page explains searching data saved on this computer—messenger messages and mail/notes imported by [memo](https://github.com/leemour/cli-memo)—and searching the MAX server.

After reading it, you will be able to find messages by words, people, chats, dates, files and links, save the search and run it again, count matches and distinguish between a real “not found” and a gap in the saved history. The search does not mark anything as read.

Terms used below:

- **Local archive** — the database saving messages read or downloaded by `max` ([local archive](./archive.md)). Most searches read only this database.
- **Query** — words and conditions such as `from:` and `date:`. Your AI agent can construct it; see the [query-language reference](./query-language.md).
- **Coverage** (`coverage`) — which saved chats/messages were searchable and which chats were never downloaded or are out of date.

## What you can do

The entire search is in one command group, `max search`. If you don't know where it was written, start with `search all`.

| Task | Command |
|---|---|
| Search immediately in messages, mail and notes | `max search all '<запрос>'` |
| Search only messenger messages, in one chat - and on the MAX server | `max search messages '<запрос>'` |
| Search only mail that was imported by memo | `max search mail '<запрос>'` |
| Search notes from memo or folder | `max search notes '<запрос>'` |
| Find a discussion by what it was about | `max search conversations '<вопрос>'` ([search by topic](./topic-search.md)) |
| Count matches by chats, people, days or hours | `max stats messages show '<запрос>'` |
| Save search and run it again | `max searches create`, `max search messages --saved <имя>` |

```sh
max search all 'договор аренды'                 # сообщения, почта и заметки, лучшее первым
```

```sh
max search all 'договор' --only messages,notes  # без почты
```

```sh
max search messages 'договор' --chat Друзья     # только сообщения мессенджеров, без почты
```

```sh
max search mail 'счёт'                          # только почта, которую привёл memo mail import
```

```sh
max search notes 'бюджет' --type internal       # только заметки, написанные в memo
```

```sh
max search conversations 'переезд на дачу'      # разговоры, близкие по смыслу
```

`search all` labels each match as a message (`msg:…`) or note (`note:…`). `search messages` excludes mail; `search mail` excludes messenger messages. Only `search all` combines them. `--type` selects text, voice or files (`text|voice|file`) for messages, or memo/folder notes for `search notes` (`internal|file`). If a field such as `chat:` or `from:` does not apply to mail or notes, `search all` skips that kind and reports it.

Mail and notes are archived via memo: `memo mail import` and `memo import`. Without them, `search all` only looks for messages.

The rest of this page covers `max search messages`. Searches within one chat can also query the MAX server ([below](#поиск-на-сервере-max---backend)).

## Try a focused search

Start with a phrase and one chat. This example searches saved history without asking the messenger.

**Your request:**

> Find the message saying “счёт оплачен” in Книжный клуб. Show the match and any gaps in the history.

**Command:**

```sh
max search messages '"счёт оплачен"' --chat "Книжный клуб" --backend archive --json
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
max store fetch --all --background     # последние 90 дней каждого чата, в фоне
```

```sh
max store jobs show                    # сколько уже скачано
```

By default, a run downloads at most 1,200 messages per chat; repeat to continue. Use `--since-time 365d` for older history or `max store fetch Друзья` for one chat ([download history](./archive.md#скачать-историю)). `max serve` then keeps the archive current.

Every search reports what it searched. If the archive could contain more history or no results were found, one line in the terminal shows how many messages and chats were searched, how many chats have never been downloaded or are out of date, and the command to fix that:

```text
searched 12,430 messages in 37 chats — 5 never fetched; `max store fetch --all --background` fetches them
```

With `--json` the same in `coverage`: `messages`, `chats`, up to ten chats in `attention` and `next`. If nothing is found and `next` is specified, run this command (or ask the agent) before deciding there is no message.

Put the query in single quotes, so the shell leaves its quotes and brackets alone. The names below are
examples; use your own chats and people.

## Words and phrases

```sh
max search messages счёт
```

```sh
max search messages '"счёт оплачен"'             # слова подряд
```

```sh
max search messages 'кафе OR библиотека'
```

```sh
max search messages '(кафе OR библиотека) NOT шумно'
```

```sh
max search messages 'квартир*'                   # все слова, которые начинаются на «квартир»
```

All adjacent query words must appear in the message. Search matches word forms: `квартира` finds «квартиру». Quotes preserve word order but also allow other forms. For an exact form, use `exact:квартира` or add `--exact` for words without an explicit field. An explicit `text:` still matches word forms. Case, stress marks, `ё` and `е` are treated alike. Typos are not corrected automatically. Word forms depend on the archive language settings.

## People and chats

```sh
max search messages 'from:"Алиса Тестова" счёт'
```

```sh
max search messages 'from:("Алиса Тестова" OR "Борис Тестов") библиотека'
```

```sh
max search messages 'from:me date:7d'            # что вы писали за неделю
```

```sh
max search messages 'chat:"Книжный клуб" библиотека'
```

```sh
max search messages библиотека --chat "Книжный клуб"   # то же, опцией
```

```sh
max search messages 'паспорт kind:private'       # только личные переписки
```

`kind:` accepts `private` (Personal), `group`, `channel`, `saved` (Favorites) and `bot`. Search in all archive accounts - `--source all`.

## Dates

```sh
max search messages 'date:today'
```

```sh
max search messages 'библиотека date:yesterday'
```

```sh
max search messages 'счёт date:7d'               # от 7 дней назад до сейчас; также 30m, 2h
```

```sh
max search messages 'счёт date:[2026-01-01 TO 2026-02-01}' --timezone Europe/Madrid
```

`today`, `yesterday` and calendar dates are days in your computer's time zone; `--timezone` picks
another. In a range, `[` and `]` include that day, `{` and `}` exclude it.

## Files and links

```sh
max search messages 'has:file'
```

```sh
max search messages 'filename:*.pdf'
```

```sh
max search messages 'filename:*договор*'         # часть имени
```

```sh
max search messages 'size>10MB'
```

```sh
max search messages 'size:[1KB TO 300KB]'
```

```sh
max search messages 'has:photo chat:"Книжный клуб"'
```

```sh
max search messages 'has:link AND "github.com"'  # ссылка на сайт
```

A file is found by name and size even when the message has no text. `filename:` compares the whole name, ignoring case, accents and `ё`. Sizes use KB, MB and GB of 1,024. MAX does not report the file type, so search by extension: `filename:*.pdf`, rather than `mime:`. `has:` also accepts `attachment`, `video`, `audio`, `voice`, `sticker`, `contact`, `location` and `poll`. A link counts whether it appears in the text or only in a link card.

## Text inside files

`content:` searches for text inside attachments: PDF, Word document, scan. First, the text needs to be extracted into the archive - this is done by `max` or your agent. More information about the files - [attachments](./attachments.md).

```sh
max attachments extract --chat "Книжный клуб" --download --output-dir ./files
```

```sh
max search messages 'content:договор'
```

```sh
max attachments list --chat "Книжный клуб" --needs-text
```

```sh
max attachments text set "Книжный клуб" 204 --text-file ./scan.txt
```

The `attachments extract` reads plain text files, DOCX and PDF with a text layer on this computer. `--download` requires `--output-dir`; without them, extraction reads already downloaded files. If there are several attachments in the message, indicate one through `--attachment`, starting with 1.

Local extraction also reads UTF-16 with BOM, confidently detected legacy encodings, ODT, ODS, XLSX, PPTX and EPUB, without AI or additional packages. It preserves sheet/slide/chapter order and saved cell values but does not calculate formulas or read images. Your agent should check ambiguous encoding and convert it when needed. Original files stay unchanged. ODT, ODS, XLSX, PPTX and EPUB are limited to 1,000 archive parts, 50 MiB unpacked and 10 MiB per XML/HTML text part. Corrupt or incomplete reads are not indexed as complete. Failed reads can be retried; agent text and previous successful text are protected.

For PDF you need the optional package `unpdf`, for DOCX - `mammoth`, installed in the same place as `max`. For a global npm install: `npm install -g unpdf mammoth`. If the package is not present, command reports this; the text can be recorded by an agent.

**Photos and scans** lack a text layer. Your agent normally uses its own OCR or vision tools, then saves text with `attachments text set`. `attachments list --needs-text` returns local paths, message links and attachment numbers, but no text. Verify by searching `content:`. A remote agent needs the actual file: a server path does not transfer it. [Attachments show](./attachments.md) can transfer saved bytes in chunks with hash verification; transfer does not recognise or index text. Save the result with `attachments text set`.

**Bulk scan recognition** can use an AI provider you explicitly select. Configure a vision-capable provider/model in `models.ocr` and save the key through `models text key set`. Replace `your-vision-model` with the desired model id.

```sh
max config set models.ocr.provider openai
```

```sh
max config set models.ocr.model your-vision-model
```

```sh
max models text key set openai
```

```sh
max attachments extract --chat "Книжный клуб" --ocr --concurrency 4 --limit 100 --json
```

`--ocr` sends images to the chosen service; otherwise no AI call occurs. Parallelism is 1–8, default 4; file limit is 1–500, default 100. Continue with the returned `cursor`. PDF scans require optional `unpdf` and `@napi-rs/canvas`, with at most 20 pages per document. Text-layer pages stay local. File hashes and the selected model allow reuse. Agent text and prior indexed text survive errors or cancellation. Check `failed` and each file status; provider rate limits stop further calls in that run. `--offline` cannot combine with `--ocr`.

**Files already saved.** `max attachments extract --chat <чат> --from-dir ./files` reads one folder without subfolders. It requires one uniquely matching source file or a complete set with downloader filenames. Do not combine `--from-dir` with `--download` or `--output-dir`. `max messages download <чат> <id> --extract` reads only files downloaded in this run; `--all --extract` does this for the entire run. Hashes detect changed files; agent text stays protected. Bounded MCP extraction returns a continuation `cursor` and file information, not text.

## Passwords, codes and cards

```sh
max search messages 'preset:secret kind:saved'   # что-то похожее на пароль или токен в Избранном
```

```sh
max search messages 'preset:card'
```

A preset finds messages that *look like* a password, a login code, an API key, a card or IBAN number, a
passport, a phone, an email or a link. It checks the shape only: it does not prove that a password
works or a card is real. The full list is in the [query language](./query-language.md#preset).

## Tags

```sh
max tags add work --chat "Книжный клуб"
```

```sh
max tags add work --contact "Борис Тестов"
```

```sh
max tags list --tag work --type chat
```

```sh
max search messages 'tag:work счёт'
```

```sh
max search messages 'счёт NOT tag:work'
```

```sh
max tags remove work --chat "Книжный клуб"
```

A tag is your own label on a chat, a person or one message (`--message <id> --chat <чат>`). It stays in the local archive and is never sent to MAX. `tag:work` finds messages tagged `work`, messages in a chat with that tag and messages from a person with that tag. A tag is 1–32 characters: Latin letters a–z, digits and hyphens.

Group and channel tags can be generated automatically from their title, username and description, without reading messages or using a model:

```sh
max metadata refresh --chat "Книжный клуб"   # прочитать описание чата из MAX (сам чат не меняется)
```

```sh
max metadata refresh --only-missing          # все сохранённые группы и каналы, у которых описание ещё не читалось
```

```sh
max tags auto --dry-run                      # что получилось бы, без записи
```

```sh
max tags auto                                # записать автоматические метки
```

```sh
max tags list --source auto                  # только автоматические
```

Automatic tagging leaves your tags intact: rerunning it removes only outdated automatic tags. If you manually add a tag that was already added automatically, it becomes your own tag.

## Saved searches and history

```sh
max searches create meetings 'библиотека OR кафе' --chat "Книжный клуб"
```

```sh
max search messages --saved meetings
```

```sh
max search messages --saved meetings 'date:today'   # слова добавляются через AND
```

```sh
max stats messages show --saved meetings --by day
```

```sh
max searches list
```

```sh
max searches history --limit 10
```

```sh
max search messages --saved 42                   # строка истории, по её номеру
```

`searches create` saves a query with its options and runs nothing; an existing name needs `--replace`.
Options you type with `--saved` replace the saved ones. The saved text is read again on every run, so
`date:7d` always means the last 7 days. `searches show` prints one, `searches delete` removes one.

Every successful search and count goes into the history: the query and options, never the messages found. The latest 1,000 runs are kept. `--no-record` excludes one run; in MCP, use `record: false`. `searches clear` clears the history, leaving saved searches intact. This history is separate from `max runs`.

Saved searches and history live in the archive shared by `max` and `tg`: both see the same entries, and `delete` or `clear` in one changes them in the other. Tags remain with their own account.

## Count messages: `stats messages show`

```sh
max stats messages show счёт                          # сколько в каждом чате
```

```sh
max stats messages show 'date:7d' --by sender
```

```sh
max stats messages show 'from:me' --by day --timezone Europe/Madrid
```

```sh
max stats messages show --by hour                     # все сохранённые сообщения
```

`stats messages show` counts each message that `search messages` would find with the same query once. `--by chat` (the default) and `--by sender` sort the highest counts first; `--by day` and `--by hour` use chronological order. If some chats are only partly saved, the counts are lower bounds, and stderr reports how many chats are incomplete.

## Search the MAX server: `--backend`

The MAX server searches only one chat. When a query specifies one chat (`--chat` or `chat:`) and contains words, `max` queries both the server and the archive by default (`--backend both`). Without a specified chat, it does not query the server; results come from the archive.

```sh
max search messages 'счёт' --chat "Книжный клуб"                    # архив и сервер MAX
```

```sh
max search messages 'счёт' --chat "Книжный клуб" --backend server   # только то, что нашёл сервер
```

```sh
max search messages 'счёт' --backend archive                        # только архив
```

The server also matches word prefixes, but not other word forms: `книгу` will not find «книга». `max` therefore treats its results as candidates: it saves them in the archive and checks them against your query using the archive rules. `exact:`, `-слово`, quotes and result ordering work as they do without the server, and messages are not duplicated. `max` waits at most 5 seconds for the server (`--server-time`, up to 60 seconds) and marks nothing as read.

With `--json`, each message has a `source` (`archive`, `server` or `both`), and the `server` block reports what the server returned. When searching both sources, an unavailable server or a read-only profile still allows archive results. An explicit `--backend server` fails if the profile does not allow server search. The required permission is `messages.server-search`.

## First download new: `--sync-first`

```sh
max search messages 'счёт' --chat "Книжный клуб" --sync-first
```

`--sync-first` first downloads new messages without marking anything as read: no more than 5 chats, 500 messages and 30 seconds. The limits change `--max-chats`, `--max-messages`, `--sync-time`. If the download failed or ended early, you still get the result from the archive - with a mark about outdated coverage and information about the download.

## Messages around the find

`--newest` orders by time rather than proximity, and `--context 2` shows two messages before and after each one found (default 2 in terminal and 0 in other modes).

`--thread` replaces chronological neighbours with saved reply chains around each match, including replies to it. It also applies to `messages context`. Default limits are 8 hops, 50 messages, 65,536 bytes and one day either side, adjustable through `--thread-hops`, `--thread-messages`, `--thread-bytes` and `--thread-within`. Without links, chronological context is used. Stale links are flagged and not followed. `messages context` with `--offline` reads saved data only.

## Result in JSON

A terminal shows a message feed. `--json` returns one object with messages and search scope; `--jsonl` emits only messages, one per line. See [response fields](./query-language.md#ответ).

## When nothing is found

An empty answer means “not in the archive you searched”, not “never sent”. `max store status` shows what is stored; `max store fetch` adds history. With `--json`, the answer reports which chats were searched and how complete they are, even without matches. If `max` asks for `max store migrate`, the word index is still being built; searches without words (`has:file`, `date:today`) already work.

**Gaps in history.** `max store gaps plan <чат>` locally identifies gaps between saved ranges. Missing message ids and quiet periods alone do not prove missing history; archive edges remain `unknown`. Review the plan, then `max store gaps repair <чат> --fingerprint <хеш>` downloads gaps. Defaults: 5 gaps, 500 messages, 30 seconds; adjust through `--max-gaps`, `--limit`, `--repair-time`, `--page-size` and `--pause`. A repeated run checks remaining gaps and never deletes a message just because MAX omitted it. Ambiguous same-time pages remain incomplete. `--background` starts a job managed through `store jobs show`, `store jobs list` and `store jobs cancel`. Repair requires `store.gaps.repair` and read permission; planning never connects. MCP discovers commands through `max_tools_search`, reads plans/jobs through `max_read`, and repairs through `max_write`.

**Prepare topic search while downloading.** `max store fetch <чат> --catch-up` builds discussions and local vectors for only that chat after download ([topic search](./topic-search.md)). It is off by default; `searchCatchUp: true` enables it and `--no-catch-up` disables it for one run. Limits: `--catch-up-chunks 500 --catch-up-messages 10000 --catch-up-time 30s`. It neither downloads recognition files automatically nor calls a remote service. `prepared` reports preparation separately; downloaded history survives regardless.

## Next steps

- [Topic search](./topic-search.md) — find a discussion by what it was about, when you do not remember
  its words.
- [Query language](./query-language.md) — every field, operator, limit and the JSON answer.
- [How search works](https://wirecat.dev/ru/docs/search-architecture) — the technical page: the word
  index, the conversation graph, vectors and how results are ranked.
