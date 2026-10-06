---
title: "Поиск сообщений"
---

`tg messages search` ищет сообщения в локальном архиве — копии ваших чатов, которую tg хранит на этом
компьютере. По умолчанию он не подключается к Telegram и ничего не отмечает прочитанным. Сообщение, которое tg не загрузил, найти
нельзя, поэтому сначала загрузите историю: `tg store fetch <chat>` ([Локальная база](./archive.md)).

Здесь описан повседневный поиск. Ещё три страницы идут дальше:

- [Поиск по теме](./topic-search.md) — найти обсуждение по тому, о чём оно было, если вы не помните
  слов.
- [Язык запросов](./query-language.md) — все поля, операторы, лимиты и JSON-ответ.
- [Как устроен поиск](https://wirecat.dev/en/docs/search-architecture) — техническая страница: словарный
  индекс, граф разговоров, векторы и ранжирование результатов.

Заключайте запрос в одинарные кавычки, чтобы оболочка не трогала его кавычки и скобки. Имена ниже —
примеры; подставляйте свои чаты и людей.

## Слова и фразы

```sh
tg messages search invoice
tg messages search '"invoice paid"'              # the exact phrase
tg messages search 'cafe OR library'
tg messages search '(cafe OR library) NOT loud'
tg messages search 'invoic*'                     # every word that starts with "invoic"
```

Все слова, стоящие рядом, должны быть в сообщении. Слово находит это слово в любом регистре, с
диакритическими знаками или без них. Другая форма слова — это другое слово: `flat` не находит `flats`; префикс
вроде `flat*` находит оба. Ничего не угадывается: ни исправления опечаток, ни похожих слов.

## Люди и чаты

```sh
tg messages search 'from:"Alice Synthetic" invoice'
tg messages search 'from:("Alice Synthetic" OR "Bob Synthetic") library'
tg messages search 'from:me date:7d'             # what you wrote this week
tg messages search 'chat:"Book club" library'
tg messages search library --chat "Book club"    # the same, as an option
tg messages search 'passport kind:private'       # one-to-one chats only
```

`kind:` принимает `private`, `group`, `channel`, `saved` («Избранное») и `bot`. `topic:` ограничивает поиск одной
темой форума в группе; для него нужна эта группа в `chat:` или `--chat`.

## Даты

```sh
tg messages search 'date:today'
tg messages search 'library date:yesterday'
tg messages search 'invoice date:7d'             # from 7 days ago until now; also 30m, 2h
tg messages search 'invoice date:[2026-01-01 TO 2026-02-01}' --timezone Europe/Madrid
```

`today`, `yesterday` и календарные даты — это дни в часовом поясе вашего компьютера; `--timezone` выбирает
другой. В диапазоне `[` и `]` включают этот день, `{` и `}` — исключают.

## Файлы и ссылки

```sh
tg messages search 'has:file'
tg messages search 'filename:*.pdf'
tg messages search 'filename:*contract*'         # part of the name
tg messages search 'size>10MB'
tg messages search 'mime:image'                  # any picture sent as a file
tg messages search 'mime:"application/pdf"'      # quote a full type
tg messages search 'has:photo chat:"Book club"'
tg messages search 'has:link AND "github.com"'   # a link to a site
```

Файл находится по имени, размеру и типу, даже если в сообщении нет текста. `filename:` сравнивает
имя целиком, без учёта регистра и диакритических знаков. Размеры — в KB, MB и GB по 1024. `has:` также принимает `attachment`,
`video`, `audio`, `voice`, `sticker`, `contact`, `location` и `poll`. Ссылка учитывается, если она есть в
тексте или только в карточке предпросмотра.

## Пароли, коды и карты

```sh
tg messages search 'preset:secret kind:saved'    # something that looks like a password or token
tg messages search 'preset:card'
```

Пресет находит сообщения, которые *похожи* на пароль, код входа, ключ API, номер карты или IBAN,
паспорт, телефон, адрес почты или ссылку. Проверяется только вид: пресет не доказывает, что пароль
работает или карта настоящая. Полный список — в [языке запросов](./query-language.md#presets).

## Метки

```sh
tg tags add work --chat "Book club"
tg tags add work --contact "Bob Synthetic"
tg tags list --tag work --type chat
tg messages search 'tag:work invoice'
tg messages search 'invoice NOT tag:work'
tg tags remove work --chat "Book club"
```

Метка — ваша собственная пометка на чате, человеке или одном сообщении (`--message <id> --chat <chat>`). Она хранится
только в локальном архиве и никогда не отправляется в Telegram. `tag:work` находит сообщения с меткой `work`,
сообщения в чате с меткой `work` и сообщения от человека с меткой `work`. Метка — от 1 до 32 символов: буквы a–z,
цифры и дефисы.

## Сохранённые поиски и история

```sh
tg searches create meetings 'library OR cafe' --chat "Book club"
tg messages search --saved meetings
tg messages search --saved meetings 'date:today'  # extra words are added with AND
tg messages stats --saved meetings --by day
tg searches list
tg searches history --limit 10
tg messages search --saved 42                    # a row of the history, by its number
```

`searches create` сохраняет запрос с его параметрами и ничего не запускает; для существующего имени нужен `--replace`.
Параметры, указанные вместе с `--saved`, заменяют сохранённые. Сохранённый текст читается заново при каждом запуске, поэтому
`date:7d` всегда означает последние 7 дней. `searches show` выводит один поиск, `searches delete` удаляет его.

Каждый успешный поиск и подсчёт записывается в историю: запрос и его параметры, но никогда не найденные
сообщения. Хранятся 1000 последних запусков. `--no-record` исключает из истории один запуск; в MCP
`tg mcp --no-record` или `record` со значением `false` исключает вызовы сервера; `searches clear` очищает историю и оставляет сохранённые поиски. Эта
история отделена от записей запусков `tg runs`.

Сохранённые поиски и история хранятся в базе, общей для tg и max: оба видят одни и те же записи, и
`delete` или `clear` в одном меняет другой. Метки остаются при своём аккаунте.

## Подсчёт: `messages stats`

```sh
tg messages stats invoice                        # how many in each chat
tg messages stats 'date:7d' --by sender
tg messages stats 'from:me' --by day --timezone Europe/Madrid
tg messages stats --by hour                      # every stored message
```

`messages stats` считает сообщения, которые `messages search` нашёл бы по тому же запросу, каждое по одному разу.
`--by chat` (по умолчанию) и `--by sender` ставят наибольшие значения первыми; `--by day` и `--by hour` идут
по порядку. Если некоторые чаты сохранены не полностью, числа — нижняя граница, а stderr сообщает, сколько
таких чатов.

## Если ничего не найдено

Пустой ответ означает «нет в архиве, где вы искали», а не «никогда не отправлялось». Проверьте сохранённое через
`tg store status` и загрузите больше через `tg store fetch`. С `--json` ответ сообщает, в каких чатах
искали и насколько они полны, даже если совпадений нет. Если tg просит выполнить `tg store migrate`, словарный
индекс ещё строится; поиск без слов (`has:file`, `date:today`) уже работает.

Чтобы искать по всем аккаунтам в базе, добавьте `--source all`. `--newest` сортирует по времени, а не по
релевантности, а `--context 2` показывает по два сообщения вокруг каждого найденного.

## Для скриптов и агентов

`--json` возвращает один объект с сообщениями и сведениями о том, где искали; `--jsonl` выдаёт потоком только
сообщения. В MCP `tg_messages_search` и `tg_messages_stats` принимают те же запросы, а `tg_tags_*` и
`tg_searches_*` управляют метками и сохранёнными поисками. Поля ответа,
прежний режим `--language legacy` и `--regex` описаны в [языке запросов](./query-language.md).

По умолчанию поиск читает локальный архив. `--sync-first` явно загружает новые сообщения перед поиском и
ничего не отмечает прочитанным: не больше 5 чатов, 500 сообщений и 30 секунд. Эти границы меняют `--max-chats`,
`--max-messages`, `--sync-time`. При неудачном или неполном обновлении остаются локальные результаты с устаревшим охватом и
сведениями об обновлении.

`content:invoice` ищет в проиндексированном тексте, извлечённом из вложений или переданном агентом. Извлечение поддерживает
обычный текст, Word и PDF с текстовым слоем; для сканов и фотографий текст должен передать агент. Если вложений несколько,
выберите одно через `--attachment`, начиная с 1.

```sh
tg attachments extract --chat "Book club" --download --output-dir ./files
tg messages search 'content:invoice'
tg attachments list --chat "Book club" --needs-text
tg attachments text set "Book club" 204 --text-file ./scan.txt
```

`--download` требует `--output-dir`; без них извлечение читает сохранённые файлы. `list` показывает пути сохранённых файлов и состояние текста, но не сам текст.

`--thread` следует по сохранённому графу ответов; в `messages context` он заменяет соседние по времени сообщения. По умолчанию —
8 переходов, 50 сообщений, 65 536 байт и один день вокруг каждого совпадения. Это меняют `--thread-hops`,
`--thread-messages`, `--thread-bytes`, `--thread-within`. Без графа используется контекст по времени;
устаревшие связи отмечаются и не обходятся.

Для извлечения из PDF нужен необязательный `unpdf`, для Word — необязательный `mammoth`, установленные там же, где `tg`. При глобальной установке через npm:
`npm install -g unpdf mammoth`. Об отсутствующих модулях сообщается; вместо них текст может передать агент.
