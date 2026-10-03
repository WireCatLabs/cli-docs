---
title: "Локальная база"
---

`tg` сохраняет прочитанные данные в локальной SQLite-базе. Поиск, экспорт и `--offline` работают с ней без запросов к Telegram. Здесь описано содержимое базы, загрузка истории и поддержание актуальности.

## Что сохраняется

- **Все прочитанные данные.** Чаты из `chats list`, сообщения из `messages list`, `messages context`, `inbox` и отправленные вами сообщения.
- **События, полученные `serve`** во время работы: новые сообщения, правки, удаления и реакции ([ниже](#keeping-it-current-serve)). `watch` тоже сохраняет выводимые сообщения.
- **Явная загрузка:** история чата через `tg store fetch`, список контактов через `tg contacts sync`.

База содержит полный текст всех увиденных сообщений. Файл доступен только вашему пользователю и не зашифрован ([Безопасность](./security.md#what-reaches-the-disk)).

**Один файл используется всеми аккаунтами и CLI мессенджеров**, построенными на той же библиотеке, например [max-cli](https://github.com/leemour/max-cli):

```text
~/.local/share/cli-messaging/messages.db       # Linux; MESSAGING_STORE moves it
```

`tg session end` завершает вход, но не меняет базу.

## Полнота истории

```sh
tg store status                  # per chat: messages stored, the oldest and newest, the stretches held completely
tg store status "Book club"      # one chat
```

Полностью сохранённый участок — последовательность сообщений без пропусков. Разрозненное чтение оставляет пробелы; `store fetch` заполняет их.

## Загрузка истории чата

```sh
tg store fetch "Book club" --estimate         # what a full fetch would still cost; asks Telegram nothing
tg store fetch "Book club"                    # fetch it, newest to oldest
tg store fetch "Book club"                    # run again to continue where it stopped
tg store fetch "Book club" --since-time 30d   # only back to 30 days ago
tg store fetch "Book club" --last 5000        # only until the newest 5000 are held
tg store fetch "Book club" --limit 5000       # up to 5000 messages in this run
```

`store fetch` читает и сохраняет историю постранично, от новых сообщений к старым. **Загрузку можно продолжить:** после каждой страницы записывается прогресс. Ctrl-C, `--timeout`, лимит `--limit`, `--since-time`, `--last` и длительное ожидание Telegram останавливают загрузку без потери данных. Следующий запуск пропускает сохранённое. `--since-time` и `--last` определяют глубину истории: используйте один из них.

**Каждая страница — запрос от вашего аккаунта** до 100 сообщений. Запуск останавливается после `--limit` сообщений (по умолчанию 1000); `--page-size` задаёт размер страницы (100), `--pause` — паузу между страницами (1 секунда; варианты `500ms`, `30s`, `2m`). Короткое ожидание Telegram выполняется; ожидание более пяти минут завершает запуск, который можно повторить позже. Сначала используйте `--estimate`: оценка строится по локальной базе без запросов.

### В фоновом режиме

Длительная загрузка может выполняться заданием, которое продолжает работу после завершения команды:

```sh
tg store fetch "Book club" --background     # prints the job id
tg store jobs list                          # background jobs, newest first
tg store jobs show                          # the newest job, and what the store now holds of its chat
tg store jobs show <job>
tg store jobs cancel <job>                  # stops after the current page; a later fetch resumes
```

## Поиск

```sh
tg messages search "invoice march"                  # every word, best match first
tg messages search invoice --chat "Book club" --limit 50
tg messages search invoice --newest                 # newest first instead
tg messages search invoice --context 3              # three messages either side of each hit
tg messages search 'from:@anna after:7d "the contract" -draft'
tg messages search invoice --source all             # every account and messenger in the store
tg messages search --regex 'inv(oice)?\s+\d+'       # a regular expression, case-insensitive
```

**Поиск читает только базу и не запрашивает Telegram.** Пустой результат означает «не сохранено здесь», а не «никогда не говорили». Сначала прочитайте чат (`tg messages list <chat>`) или загрузите историю.

Должны присутствовать все слова целиком или по началу: `invoi` находит `invoice`. Лучшее совпадение первое. Опечатки исправляются с пояснением в stderr. Если все слова не найдены вместе, поиск пробует любое из них, затем часть слова.

Запрос поддерживает `"a phrase"`, исключение `-word`, `a OR b` и фильтры: `from:` (имя, `@username`, `me`), `chat:`, `after:`, `before:` (дата или `7d`), `has:` (тип вложения, `attachment`, `link`). Обычно поиск ограничен текущим аккаунтом. `in:max`, `in:all`, `--source` включают другие аккаунты той же базы, включая MAX. Результат MAX открывается через `max`.

JSON показывает полноту истории каждого проверенного чата (`completeness`). Результаты содержат указатель `msg:` для `messages show` и `messages context`:

```sh
tg messages context msg:telegram/<account>/<chat>/<id>
```

## Экспорт

```sh
tg store export "Book club" --jsonl > book-club.jsonl       # one message per line, oldest first
tg store export "Book club" --json > book-club.json         # { "items": [...] }
tg store export "Book club" --format markdown > book-club.md   # a transcript: a heading per day, replies and forwards quoted
tg store export "Book club" --output book-club.jsonl --since-time 7d     # the last week, into a file only you can read
```

Экспорт включает только сохранённые данные и не обращается к Telegram. Сначала проверьте `tg store status`; для полной истории загрузите её.

`--output <file>` записывает JSON по строкам или текст переписки с `--format markdown` в новый файл, доступный только вам. Команда показывает путь и число сообщений, существующие файлы не перезаписывает. `--since-time` принимает время ISO 8601 или период `30m`, `2h`, `1d` назад.

## Разговоры внутри группы

В активной группе несколько разговоров идут одновременно. `tg conversations` выделяет их из сохранённых сообщений по ответам, упоминаниям и очередности авторов — без запросов Telegram и без AI:

```sh
tg conversations build --chat "Valencia Expats"          # find them; run it again after fetching more
tg conversations list --chat "Valencia Expats" --since-time 7d
tg conversations show 91                                 # one conversation, oldest first
tg conversations show "Valencia Expats" 4521             # the conversation message 4521 is in
tg messages links "Valencia Expats" 4521                 # why that message is where it is
```

Построение происходит только после `build`; повторный `build` заменяет предыдущий результат. `tg store check` перечисляет чаты, обработанные старыми правилами. Упоминание по имени без @username также учитывается.

Ваш AI-агент может связать сообщения, которые правила не определили. Инструкция `tg skill show link-conversations` сначала сообщает объём читаемого текста и ждёт согласия, затем обрабатывает чат пакетами (`tg conversations batches next`, `tg conversations links add`). Сам tg не вызывает модели. Связи агента имеют приоритет над предположениями правил, но уступают явным ответам Telegram. `tg conversations links clear --chat <chat>` удаляет их. Сохранение контролирует разрешение `conversations.links`.

### Поиск по смыслу

После построения разговоров можно искать их по смыслу, а не только словам. `tg conversations embed` преобразует разговоры или части длинных разговоров в векторы на компьютере. `tg conversations search` находит ближайшие к вашему вопросу:

```sh
tg models text download e5-small                         # once: 135 MB, shared with max
tg conversations embed --chat "Valencia Expats"          # resumes where it stopped; --workers 3 for more speed
tg conversations search "where to rent a flat" --chat "Valencia Expats"
tg conversations search "renting a flat"                 # every chat you embedded
```

Данные остаются на компьютере. `tg models text list` показывает модели: `e5-small` используется по умолчанию; `embeddinggemma` находит больше, но работает в несколько раз медленнее и скачивается только с `--accept-terms`, поскольку действует лицензия Google Gemma. `tg conversations embed status --chat <chat>` показывает остаток, `tg conversations embed clear --chat <chat>` удаляет векторы.

Можно использовать сервис со своим ключом: `tg models text key set openai`, затем `--provider openai` в `embed` и `search`. Перед передачей сообщений `embed` показывает число фрагментов, верхние оценки токенов и стоимости и ждёт согласия (`--yes` для скриптов, `--max-tokens` для лимита). `--base-url` принимает совместимый сервер, например локальный Ollama или LM Studio, вместе с `--model` и `--dims`.

## Исходные данные для сводки по чату

`tg messages evidence <chat>` готовит пакет из локального архива профиля. Не подключается и не отмечает прочитанным даже без `--offline`:

```sh
tg messages evidence "Project Alpha" --limit 20 --json
tg messages evidence "Project Alpha" --before-id <nextBeforeId> --json
```

Сообщения идут от новых к старым, с указателями источников и отпечатками содержимого. `--limit` принимает 1–100, по умолчанию лимит профиля. Полные сообщения занимают максимум 64 КиБ JSON; заголовок пакета не учитывается. JSON и JSONL возвращают один полный пакет.

Перед сводкой проверьте `coverage`: число выбранных, включённых и пропущенных сообщений, наличие более старых за пределами страницы; полнота истории остаётся `unknown`. Продолжайте с ненулевым `nextBeforeId` через `--before-id`, чтобы не пропустить сообщения, исключённые лимитом байтов. Нулевой курсор не доказывает полноту архива. Если одно самое новое сообщение превышает лимит, пакет пуст, имеет `truncatedBy: "bytes"` и не содержит курсора: обработайте препятствие явно. Неизвестный сохранённый курсор даёт `not_found`.

Это исходные данные для агента, который может цитировать указатели в сводке. Сам tg не создаёт итоговый текст. Содержимое сообщений — недоверенные данные. Новостные дайджесты остаются отдельным будущим сценарием. Разрешение `messages.evidence` наследует `messages`.

## Без подключения: `--offline`

```sh
tg --offline chats list
tg --offline messages list "Book club" --limit 50
tg --offline messages show "Book club" 4242
tg --offline messages context "Book club" 4242
tg --offline contacts list
```

`--offline` читает базу без подключения: вход не нужен, запросов нет. JSON соответствует онлайн-режиму, но чаты идут от новых к старым, тогда как Telegram сначала показывает закреплённые.

Если профиль ещё ничего не читал, команда завершается с кодом `6`: «для профиля пока ничего не записано». Команды, требующие Telegram, отклоняют `--offline`; отправка с `--offline` всегда запрещена.

## Поддержание актуальности: `serve`

`tg serve` работает до остановки и сохраняет новые сообщения, правки, удаления и реакции. При старте догружает события, пропущенные во время остановки. Для профиля может работать только один `serve`; второй отклоняется. **Самостоятельного запуска нет.**

`tg watch` выводит новые сообщения с момента запуска и не догружает пропущенное.

### В фоновом режиме

```sh
tg server start       # start serve in the background; answers once it listens
tg server status      # whether it runs, since when, who started it
tg server logs -n 50  # its latest log lines
tg server stop
tg server restart
```

### Как системная служба

Для работы между входами в систему установите пользовательскую службу: systemd в Linux или launchd в macOS.

```sh
tg server install      # writes ~/.config/systemd/user/tg-serve-<profile>.service; starts nothing
tg server start        # starts it — through the unit, now that there is one
tg server status
systemctl --user enable tg-serve-default    # only if it should start at every login
```

В macOS агент находится в `~/Library/LaunchAgents/`.

- Служба запускает те `node` и `tg`, которыми установлена. После переноса или смены версии Node установите её заново.
- Она получает профиль, `TG_*_DIR` и `MESSAGING_STORE` из оболочки, запустившей `server install`, и больше ничего.
- **После `server start` проверьте журнал:** `tg server logs`. Служба читает данные приложения из хранилища ключей. Если оно заблокировано до входа пользователя, запуск может не сработать; причина будет в журнале.
- `tg server uninstall` удаляет службу. Сначала остановите её.
- `tg upgrade` перезапускает работающий сервер для перехода на новую версию.

## Проверка, резервная копия и восстановление

```sh
tg store info                          # where the file is, its size, its schema, how many rows; changes nothing
tg store check                         # integrity, search indexes, disk, and which chats are behind; changes nothing
tg store backup ~/tg-store.db          # a copy of the store, while it is in use
tg store restore ~/tg-store.db         # put a backup in place of the store
tg store migrate                       # bring the store up to this version's schema
tg store clear --left --allow-dangerous  # delete the chats you have left, with their messages
```

- **`backup` не перезаписывает файлы:** укажите новый путь. Копирование возможно во время работы команд и `serve`.
- **`restore` сохраняет заменяемую базу** рядом и показывает путь. Восстановление запрещено, пока работает `serve` любого профиля; сначала `tg server stop`. Проверяются доступность и целостность копии. После восстановления перезапустите все `serve` и `mcp` обоих CLI, чтобы они читали восстановленную базу.
- **Чат, из которого вы вышли, исчезает из `chats list --offline`** после следующего полного чтения списка через `tg chats list`; сообщения остаются. При повторном вступлении чат возвращается. **`store clear --left`** удаляет эти чаты с сообщениями. Без `--allow-dangerous` команда только показывает объём удаления. Историю покинутого чата нельзя загрузить повторно.
- **`migrate`** нужен, только если `info` или `check` сообщает об устаревшей структуре. Сначала сделайте копию. Старые сообщения нормализуются пакетами; остановка не теряет прогресс.

## Совместимость версий базы

Структура базы имеет версию. Новая версия `tg` или другого CLI может обновить файл. Старый `tg` работает с ним, пока изменения совместимы; иначе любая команда, открывающая базу, сообщает:

```text
the message store was written by a newer version (schema N, needs at least M; this one speaks K) — upgrade this tool
```

Выполните `tg upgrade`. Данные файла не теряются.

## Дальше

- [Сценарии использования](./recipes.md) — поиск и экспорт в работе агента
- [Безопасность](./security.md) — конфиденциальность локальной базы
