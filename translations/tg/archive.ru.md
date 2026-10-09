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
tg store fetch --all                          # every chat, most recently active first: the last 90 days
tg store fetch --all --since-time 365d        # every chat, back to a year ago
```

`store fetch` читает и сохраняет историю постранично, от новых сообщений к старым. **Загрузку можно продолжить:** после каждой страницы записывается прогресс. Ctrl-C, `--timeout`, лимит `--limit`, `--since-time`, `--last` и длительное ожидание Telegram останавливают загрузку без потери данных. Следующий запуск пропускает сохранённое. `--since-time` и `--last` определяют глубину истории: используйте один из них.

**Каждая страница — запрос от вашего аккаунта** до 100 сообщений. Запуск останавливается после `--limit` сообщений (по умолчанию 1000); `--page-size` задаёт размер страницы (100), `--pause` — паузу между страницами (1 секунда; варианты `500ms`, `30s`, `2m`). Короткое ожидание Telegram выполняется; ожидание более пяти минут завершает запуск, который можно повторить позже. Сначала используйте `--estimate`: оценка строится по локальной базе без запросов.

### В фоновом режиме

Длительная загрузка может выполняться заданием, которое продолжает работу после завершения команды:

```sh
tg store fetch "Book club" --background     # prints the job id
tg store jobs list                          # background jobs, newest first
tg store jobs list --state failed           # only failed ones: running, done, failed, cancelled or died
tg store jobs show                          # the newest job, and what the store now holds of its chat
tg store jobs show <job>
tg store jobs cancel <job>                  # stops after the current page; a later fetch resumes
tg store jobs retry <job>                   # a failed or died job again, as a new job with the same options
tg store jobs retry --failed                # every chat whose newest job failed or died
tg store jobs clear                         # forget finished jobs and their logs; a running job stays
```

## Поиск

`tg messages search` находит сохранённые сообщения по словам, автору, чату, дате, файлам, ссылкам и вашим собственным меткам; по умолчанию он не обращается к Telegram. `--sync-first` явно загружает новые сообщения перед поиском. Подробности, включая сохранённые поиски и подсчёты, — в руководстве [Поиск сообщений](./search.md). Пустой ответ означает «нет в этом архиве»: сначала загрузите чат.

## Экспорт

```sh
tg store export "Book club" --jsonl > book-club.jsonl       # one message per line, oldest first
tg store export "Book club" --json > book-club.json         # { "items": [...] }
tg store export "Book club" --format markdown > book-club.md   # a transcript: a heading per day, replies and forwards quoted
tg store export "Book club" --output book-club.jsonl --since-time 7d     # the last week, into a file only you can read
```

Экспорт включает только сохранённые данные и не обращается к Telegram. Сначала проверьте `tg store status`; для полной истории загрузите её.

`--output <file>` записывает JSON по строкам или текст переписки с `--format markdown` в новый файл, доступный только вам. Команда показывает путь и число сообщений, существующие файлы не перезаписывает. `--since-time` принимает время ISO 8601 или период `30m`, `2h`, `1d` назад.

### В каталог, и только изменения

```sh
tg store export "Book club" "Work" --to ~/tg-export   # a JSON-lines file per chat, and manifest.json
tg store export --kind group --to ~/tg-groups          # every stored group
tg store export --all --to ~/tg-all                    # every stored chat of this account
```

Повторный запуск в тот же каталог добавляет только изменения с прошлого раза: новые сообщения, правки (в том числе старых сообщений) и удаления. Удалённое сообщение записывается без текста, как `{ "id", "chatId", "deleted": true }`. Каталог с другими файлами или экспортированный из другого аккаунта отклоняется. Изменение одних только реакций изменением не считается.

### С паролем

`--encrypt` в `store export` (с `--output` или `--to`) и в `store backup` сжимает файл и шифрует его паролем — других программ не нужно. `tg store decrypt <file> --output <new file>` расшифровывает файл; `tg store restore` запрашивает пароль зашифрованной копии.

- **Пароль нигде не хранится** — ни в настройках, ни в хранилище ключей, ни в записях. Если вы его потеряете, файл открыть нельзя.
- Вводите пароль сами в скрытом запросе, который спрашивает его дважды. Агент, которому вы его дали, передаёт пароль через stdin, а не аргументом: аргументы видны другим программам на компьютере.

  ```sh
  printf '%s' 'password' | tg store backup ~/tg.sealed --encrypt
  ```

- В зашифрованный каталог за один запуск пишется один файл. Его `manifest.json` не содержит названий чатов, а запуск с другим паролем отклоняется.

## Разговоры внутри группы

В активной группе несколько разговоров идут одновременно. `tg conversations` распутывает их по сохранённым сообщениям и находит по теме, на этом компьютере: [Поиск по темам](./topic-search.md).

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
- **После `server start` проверьте журнал:** `tg server logs`. Служба читает данные приложения из хранилища ключей. Если оно заблокировано до входа пользователя, запуск не сработает; systemd повторяет попытку каждые 30 секунд, причина будет в журнале.
- **Уже отозванный вход не даёт службе запуститься.** `serve` проверяет его до сообщения о готовности и завершается с кодом 4; после этого установленная служба остаётся остановленной. Войдите через `tg session start`, затем выполните `tg server start`. Вход, отозванный во время работы службы, тоже завершает её с кодом 4 — примерно в течение 15 минут. Если данные приложения недоступны, а сохранённая сессия есть, serve завершается с кодом 12, и systemd повторяет запуск. В macOS агент не перезапускается ни после какой ошибки, поскольку launchd не умеет исключить один код завершения; запустите его снова через `tg server start`. Чтобы обновить старую службу, снова выполните `tg server install`.
- `tg server uninstall` удаляет службу. Сначала остановите её.
- `tg upgrade` перезапускает работающий сервер для перехода на новую версию.

## Проверка, резервная копия и восстановление

```sh
tg store info                          # where the file is, its size, its schema, how many rows; changes nothing
tg store check                         # integrity, search indexes, disk, and which chats are behind; changes nothing
tg store backup ~/tg-store.db          # a copy of the store, while it is in use; --encrypt for a password
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

## Восстановление и обслуживание индексов

`tg store migrate` достраивает индексы, `tg store reindex` перестраивает их. `store info` и `store check` показывают готовность слов и основ. Строгий поиск учитывает формы слов; `exact:` и `--exact` выбирают точные формы. `tg config set searchStemmers.cyrillic russian` и `searchStemmers.latin english,spanish` задают языки общего архива: для латиницы доступны `english`, `spanish` или оба сразу (по умолчанию), а `none` отключает основы. После собственной настройки выполните `store reindex`. Когда обновление меняет значение по умолчанию, основы перестраиваются автоматически. До готовности поиск использует точные формы и сообщает об этом. `tg serve` достраивает индекс в фоне, `store migrate` — сразу. Настройка общая для обоих мессенджеров и всех профилей; процесс с закреплённым профилем менять её не может.

`tg store repair --dry-run --json` показывает структурное восстановление и откатывает его. `store repair` применяет его без удаления данных: несовпадающие таблицы сохраняются как копии, а оставшиеся в них строки и столбцы перечисляются в ответе. Проверьте сохранённые копии, прежде чем удалять их через `store copies delete <exact name>`; `store repair` называет их в ответе. Перед восстановлением остановите процессы, использующие базу.

## Правила ответов только для тестировщиков

`tg replies test [rule] --since-time 7d --json` моделирует, что получили бы сохранённые сообщения; ничего не отправляет. Правила хранятся в файле ответов профиля. `replies status`, `pause` и `resume` показывают их состояние и управляют ими. Настоящие ответы общего `serve` требуют и явного разрешения `replies.send:allow`, и заданного списка `testers`. По умолчанию отправка запрещена; если список testers отсутствует или пуст, никто не получает ответа. Правки, сообщения до запуска и сообщения, на которые уже ответили, пропускаются. `ask` не может отправлять из службы, работающей без присмотра.

Создайте выключенное правило с `tg replies add away`, измените его через `replies edit away --template`, затем
используйте `replies on away` или `off away`. Включённым правилам ответа нужен непустой шаблон. Редактирование меняет
только указанные поля; списки заменяются значениями через запятую, пустая строка очищает список. Параметры
включают `--do reply,task`, `--kinds`, `--chats`, `--not-chats`, `--words`, `--question` /
`--no-question`, `--mentions-me` / `--no-mentions-me`, `--people`, `--not-people`, `--contacts-only` /
`--no-contacts-only`, `--as-reply` / `--no-as-reply`, `--per-chat`, `--per-person` и поля времени
`--outside`, `--days`, `--timezone` (`--no-hours` очищает их). Первое задание времени требует
всех трёх полей. Недопустимые изменения сохраняют файл, другие правила, тестировщиков и историю ответов.

`tg replies audience` показывает аудиторию профиля; `--reply all|listed`, `--allow-people`,
`--allow-chats`, `--deny-people` и `--deny-chats` заменяют указанные поля. Запрет имеет приоритет; listed с
пустым списком разрешений не отвечает никому. Тестировщики дополнительно ограничивают ответы поверх аудитории. Локальная
задача правила может открыться даже там, где ответ запрещён.

Шаблоны используют переменные Liquid `sender.firstName`, `sender.name`, `chat.title`, `chat.kind` и
`now` в часовом поясе рабочего интервала правила (без него — UTC), с фильтрами вроде `default` и
`date`. Неизвестные переменные и фильтры отклоняются; файловые теги и доступ к прототипам запрещены, а
время обработки, выделение памяти и длина вывода ограничены. Входящее сообщение никогда не является переменной.
Только блок ai может вызывать модель; его содержимое — инструкция, а сообщение передаётся отдельно как данные:

```liquid
Thanks, {{ sender.firstName | default: "there" }}.
{% ai %}Briefly acknowledge this; I will answer tomorrow.{% else %}I will answer tomorrow.{% endai %}
```

Вывод модели заменяет только свой блок и не разбирается повторно. При отсутствии конфигурации или согласия,
ошибках вызова и отклонённом выводе используется ветка else; без неё ответ пропускается. Текст вне
блока остаётся текстом владельца с обычными подстановками. Старые заполнители и файлы may-reword
сохраняют заполненный буквальный запасной ответ с предупреждениями; новым файлам поле model не нужно.

Выберите `models.replies.provider`, `.model` и необязательно `.baseUrl`; `models.default` служит
запасным вариантом, а `provider off` отключает назначение. Прежние настройки анализа остаются поддерживаемыми.
`config set` / `unset` принимают поля с точечной записью; `config show` сообщает источник каждого. Ключи остаются в
`models text key set`; пользовательские адреса API используют ключ своего хоста и порта, а не ключ публичного провайдера.

`tg replies consents show|grant|revoke` управляет согласием на модель отдельно от разрешения отправлять.
Grant явно разрешает передачу входящих данных настроенному провайдеру для всего профиля,
кроме собственных идентификаторов чатов, исключённых через `replies consents deny`; `allow` снимает исключение без
предоставления согласия. Исключения сохраняются после grant/revoke. Другому адресу API нужно новое согласие.
Изменения согласия, конфигурации, паузы, правил и аудитории во время вызова модели проверяются перед отправкой.

`tg replies test` показывает инструкции и запасной ответ без вызовов модели. `tg replies test --ai` явно
отправляет сохранённые данные сообщений модели, на которую дано согласие, но не отправляет ответ в мессенджер и не меняет
историю ответов; его нельзя сочетать с `--offline`.
