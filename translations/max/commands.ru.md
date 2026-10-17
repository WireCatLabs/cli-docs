---
title: "Команды"
---

<!-- Сгенерировано из дерева команд скриптом scripts/commands.ts. Не редактировать; `pnpm generate`. -->


Справочник: каждая команда, каждая опция, каждый код возврата. Страница **собирается из самой
программы**, поэтому описать версию, которой не существует, она не может.

`chats send-as` и `--send-as` пока недоступны для MAX: команда откажет до отправки.

Как устроена строка:

```sh
max [профиль] [опции] <команда> <действие> [аргументы]
```

**Первое слово — профиль**, если оно не совпадает с именем команды: `max personal chats list`
читает чаты профиля `personal`. То же самое говорит переменная `MAX_PROFILE` на весь сеанс
оболочки.
**Профиль никогда не подразумевается**: если его не назвать, команда, которой нужен аккаунт,
останавливается и перечисляет профили этого компьютера — даже если профиль один. Первый вход тоже
с именем: `max personal setup`. Без профиля работают только команды, которым аккаунт не нужен:
`--help`, `--version`, `commands`, `skill show`, `account list`, `config show`.

⚠ Описания команд и опций ниже — ровно те, что печатает `max --help`, то есть по-английски. Это
не недоработка перевода: текст живёт в программе, и второй его копии здесь быть не должно.

## Общие опции

Действуют на любую команду.

| Опция | Что делает |
|---|---|
| `-V, --version` | output the version number. |
| `-v, --verbose` | more detail in what is shown: -v ids, -vv everything we know. По умолчанию: `0`. |
| `--json` | machine-readable output: one JSON value on stdout; --json=id,text keeps only those fields. |
| `--jsonl` | machine-readable output: one JSON object per line, for streaming and jq. |
| `--quiet` | diagnostics off. |
| `--trace` | one line per request on stderr: ids and timings, never message content. |
| `--debug` | при сбое — полная запись (причина и стек) вместо короткой строки. |
| `--timeout <duration>` | give up on the whole command after this — 30s, 2m, 500ms. |
| `--offline` | answer from what was recorded and never connect; fails if nothing was. |
| `--no-input` | не запрашивать ввод и не открывать интерактивный вход; ввод через канал остаётся доступным. |
| `--max-input-bytes <bytes>` | максимальный размер буферизованного ввода в байтах (по умолчанию: 16777216). |
| `--max-output-bytes <bytes>` | максимальный размер машинного вывода в байтах (по умолчанию: 4194304; 0 отключает ограничение). |
| `--brief` | найденные сообщения и письма — только ссылка, название, время, отправитель и отрывок. |
| `--full` | найденные сообщения и письма целиком, со всеми полями провайдера. |
| `--dry-run` | предварительно показать разобранные аргументы и разрешения перед выполнением действия. |
| `--yes` | go ahead without the question an ask level puts before a write. |
| `--record` | keep this run under `max runs` — ids and timings, never message content. |
| `--no-record` | do not keep it, whatever the configuration says. |
| `--serve` | start `max serve` in the background if it is not running (the default). |
| `--no-serve` | do not start it; log in on this command's own connection unless one is running. |

## `max session`

the stored MAX session for this profile

### `max session start`

log this profile in to MAX

**Меняет что-то в MAX.**

```sh
max session start [method]
```

| Аргумент | | Что это |
|---|---|---|
| `method` | необязательный | token (pasted or piped), qr, qr-chrome or sms. Одно из: `token`, `qr`, `qr-chrome`, `sms`. По умолчанию: `token`. |

### `max session end`

выйти из этого профиля на стороне MAX и удалить сохранённую здесь сессию

**Меняет что-то в MAX.**

```sh
max session end
```

## `max setup`

set up your personal MAX account and connect your agent

**Меняет что-то в MAX.**

```sh
max setup [options]
```

| Опция | Что делает |
|---|---|
| `--agent <agent>` | install the skill for this agent; asks at a terminal, otherwise none. Одно из: `none`, `codex`, `cursor`, `claude`, `gemini`, `all`. |
| `--method <method>` | how to log in when there is no session. Одно из: `token`, `qr`, `qr-chrome`, `sms`. По умолчанию: `qr`. |

## `max account`

the logged-in account

### `max account list`

все профили на этом компьютере и аккаунт каждого; не обращается к мессенджеру

```sh
max account list
```

### `max account show`

who this profile is logged in as; the phone number shows its last four digits

```sh
max account show [options]
```

| Опция | Что делает |
|---|---|
| `--show-phone` | показать номер телефона целиком. |

### `max account update`

change the name, the description or the photo everyone sees on your profile

**Меняет что-то в MAX.**

```sh
max account update [options]
```

| Опция | Что делает |
|---|---|
| `--first-name <name>` | your first name. |
| `--last-name <name>` | your last name. |
| `--description <text>` | about you. |
| `--photo <file>` | a new profile photo — an image file. |

### `max account sessions`

where else this account is logged in — not `max session`, which is this tool's own login

#### `max account sessions list`

every device and app logged in to this account; nothing is ended

```sh
max account sessions list [query]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | условия поле:значение; этот список пока ни по одному полю не фильтрует. |

#### `max account sessions end`

log out every other device, your phone included; this one stays

**Меняет что-то в MAX.**

```sh
max account sessions end [options]
```

| Опция | Что делает |
|---|---|
| `--others` | every session but this one. |

### `max account privacy`

кто может найти аккаунт, позвонить или добавить его

#### `max account privacy show`

настройки приватности аккаунта; чтение ничего не меняет

```sh
max account privacy show
```

#### `max account privacy set`

изменить, кто может найти аккаунт, позвонить или добавить его; остальные настройки сохраняются

**Меняет что-то в MAX.**

```sh
max account privacy set [options]
```

| Опция | Что делает |
|---|---|
| `--find-by-phone <who>` | кто находит аккаунт по номеру: everyone, contacts или nobody; MAX принимает everyone и contacts. |
| `--phone-number <who>` | кто видит номер: everyone, contacts или nobody. |
| `--calls <who>` | кто может звонить: everyone, contacts или nobody. |
| `--chat-invites <who>` | кто добавляет аккаунт в группы и каналы: everyone, contacts или nobody. |
| `--hide-online <on\|off>` | скрыть статус онлайн и время последнего входа. |

## `max calls`

звонки аккаунта

### `max calls list`

исходящие и входящие звонки, новые сверху; чтение ничего не меняет

```sh
max calls list [options]
```

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько показать. |

## `max stickers`

стикеры, добавленные аккаунтом

### `max stickers list`

наборы стикеров; с --set — стикеры одного набора; чтение ничего не меняет

```sh
max stickers list [options]
```

| Опция | Что делает |
|---|---|
| `--set <id>` | стикеры этого набора. |

## `max chats`

the chats this account is in

### `max chats list`

чаты, новые первыми, включая архивные; запрос выполняется по локальному хранилищу, поэтому в онлайне, где мессенджер ничего не фильтрует, нужен --offline

```sh
max chats list [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | условия поле:значение, сужающие список; поля перечислены ниже. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько показать. |
| `--page <n>` | какая страница, начиная с 1. |
| `--all` | все строки, без страниц. |

### `max chats show`

one chat: its kind, unread count, last message time and who is in it

```sh
max chats show <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

### `max chats documents`

документы Google Docs и Drive из ссылок в сохранённых сообщениях чата

#### `max chats documents list`

все ссылки на документы в чате, новые первыми, и есть ли документ в хранилище

```sh
max chats documents list <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько показать. |
| `--page <n>` | какая страница, начиная с 1. |

### `max chats events`

кто вошёл, вышел, был добавлен или удалён и кем — по служебным сообщениям чата; за последние 7 дней, если запрос не задаёт время

```sh
max chats events <chat> [query]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `query` | необязательный | условия поле:значение, сужающие список; поля перечислены ниже. |

### `max chats inspect`

what an invite or public link leads to, without joining it

```sh
max chats inspect <link>
```

| Аргумент | | Что это |
|---|---|---|
| `link` | обязательный | an invite link or a public one. |

### `max chats join`

join a group or channel by its link; the others in it see that you joined

**Меняет что-то в MAX.**

```sh
max chats join <link>
```

| Аргумент | | Что это |
|---|---|---|
| `link` | обязательный | an invite link, or a public one. |

### `max chats mark-read`

mark a chat read; the other side sees that you read it

**Меняет что-то в MAX.**

```sh
max chats mark-read <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

| Опция | Что делает |
|---|---|
| `--until-id <id>` | only up to this message id; the newest by default. |

### `max chats leave`

leave a group or channel; the others in it see that you left

**Меняет что-то в MAX.**

```sh
max chats leave <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

### `max chats create`

create a group or a channel; the people added are told

**Меняет что-то в MAX.**

```sh
max chats create <title> [person] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `title` | обязательный | the group's name. |
| `person` | необязательный | people to add: an id, or part of a name. |

| Опция | Что делает |
|---|---|
| `--channel` | a private channel instead of a group; people join it by its link. |

### `max chats members`

who is in a group

#### `max chats members list`

everyone in a group, a page at a time, with their role and when they were last seen

```sh
max chats members list <chat> [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `query` | необязательный | условия поле:значение; этот список пока ни по одному полю не фильтрует. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько показать. |
| `--page <n>` | какая страница, начиная с 1. |
| `--all` | все строки, без страниц. |

#### `max chats members audit`

members that look like bots, each with its reasons — read from the member list and the local store; never one request per person, and it removes nobody

```sh
max chats members audit <chat> [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `query` | необязательный | условия поле:значение, сужающие список; поля перечислены ниже. |

| Опция | Что делает |
|---|---|
| `--max-pages <pages>` | at most this many pages of 200 members, a pause between them (default: 10). |
| `--deep <n>` | также полностью проверить первых n человек — профиль, фотографии и все их сообщения — по одному человеку в секунду; публичные списки блокировок относятся только к Telegram, поэтому ничего не отправляется. |

#### `max chats members history`

who joined, who left and whose profile changed, oldest first — what chats members fetch recorded in the local store; never asks the messenger

```sh
max chats members history <chat> [query]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `query` | необязательный | условия поле:значение, сужающие список; поля перечислены ниже. |

#### `max chats members fetch`

read a group's whole member list into the local store's member history: who joined, who left, daily counts and profile changes; someone is recorded as gone only when every member was read

**Меняет что-то только на этом компьютере.**

```sh
max chats members fetch <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

| Опция | Что делает |
|---|---|
| `--track` | также загружать его ежедневно, пока работает serve; chats tracking показывает и изменяет список таких чатов. |
| `--max-pages <pages>` | at most this many pages of 200 members, a pause between them (default: 10). |

#### `max chats members add`

add people; they are told

**Меняет что-то в MAX.**

```sh
max chats members add <chat> <person> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `person` | обязательный | ID или часть имени. |

| Опция | Что делает |
|---|---|
| `--history` | the people added also see the messages from before they came. |

#### `max chats members remove`

remove people; their messages stay

**Меняет что-то в MAX.**

```sh
max chats members remove <chat> <person>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `person` | обязательный | ID или часть имени. |

### `max chats tracking`

чаты, списки участников которых serve ежедневно загружает в локальное хранилище — chats members fetch --track добавляет чат

#### `max chats tracking list`

every tracked chat: since when, and its last member count

```sh
max chats tracking list
```

#### `max chats tracking show`

one chat: whether it is tracked, and its member count per day for the last 30 days

```sh
max chats tracking show <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

#### `max chats tracking add`

ежедневно загружать список участников этого чата, пока работает serve, начиная со следующего запуска

**Меняет что-то только на этом компьютере.**

```sh
max chats tracking add <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

#### `max chats tracking remove`

прекратить ежедневную загрузку; уже сохранённая история остаётся

**Меняет что-то только на этом компьютере.**

```sh
max chats tracking remove <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

### `max chats admins`

give or take back a member's admin rights

#### `max chats admins add`

make a member an admin with these rights

**Меняет что-то в MAX.**

```sh
max chats admins add <chat> <person> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `person` | обязательный | ID или часть имени. |

| Опция | Что делает |
|---|---|
| `--can <rights>` | what they may do, comma-separated: read, members, admins, info, pin, link, post, edit, delete. |

#### `max chats admins remove`

take an admin's rights back; they stay a member

**Меняет что-то в MAX.**

```sh
max chats admins remove <chat> <person>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `person` | обязательный | ID или часть имени. |

### `max chats update`

rename a group or channel, change its description, or turn one of its settings on or off

**Меняет что-то в MAX.**

```sh
max chats update <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

| Опция | Что делает |
|---|---|
| `--title <title>` | the new name. |
| `--description <text>` | the new description. |
| `--photo <file>` | новое фото — файл изображения. |
| `--all-can-pin <on\|off>` | every member may pin messages. |
| `--only-admins-add <on\|off>` | only admins may add members. |
| `--only-admins-call <on\|off>` | only admins may start a call. |
| `--only-owner-edits-info <on\|off>` | only the owner may change the name and photo. |
| `--members-see-link <on\|off>` | members may see the invite link. |

### `max chats link`

a group's invite link

#### `max chats link show`

the invite link, if you may see it

```sh
max chats link show <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

#### `max chats link reset`

replace the invite link; the old one stops working

**Меняет что-то в MAX.**

```sh
max chats link reset <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

### `max chats requests`

заявки на вступление в канал MAX, где нужно одобрение

#### `max chats requests list`

ожидающие заявки на вступление в канал MAX, где нужно одобрение; только для администраторов; requestedAt равен null

```sh
max chats requests list <chat> [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `query` | необязательный | условия поле:значение, сужающие список; поля перечислены ниже. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько показать. |
| `--page <n>` | какая страница, начиная с 1. |

#### `max chats requests accept`

принять заявку; вступление видно группе

**Меняет что-то в MAX.**

```sh
max chats requests accept <chat> <person>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `person` | обязательный | кто подал заявку: ID из `chats requests list`. |

#### `max chats requests decline`

отклонить заявку

**Меняет что-то в MAX.**

```sh
max chats requests decline <chat> <person>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `person` | обязательный | кто подал заявку: ID из `chats requests list`. |

### `max chats folders`

your chat folders

#### `max chats folders list`

your chat folders, in the order the app shows them

```sh
max chats folders list [query]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | условия поле:значение; этот список пока ни по одному полю не фильтрует. |

#### `max chats folders show`

одна папка с названиями её чатов

```sh
max chats folders show <folder>
```

| Аргумент | | Что это |
|---|---|---|
| `folder` | обязательный | ID папки или её точное название. |

#### `max chats folders create`

create a chat folder

**Меняет что-то в MAX.**

```sh
max chats folders create <title> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `title` | обязательный | the folder's name; the app may refuse a long one. |

| Опция | Что делает |
|---|---|
| `--chat <chat>` | a chat to put in it, by id or name; repeat it for more. |

#### `max chats folders update`

rename a folder, or change which chats are in it

**Меняет что-то в MAX.**

```sh
max chats folders update <folder> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `folder` | обязательный | ID папки или её точное название. |

| Опция | Что делает |
|---|---|
| `--title <title>` | a new name. |
| `--add <chat>` | put a chat in it; repeat it for more. |
| `--remove <chat>` | убрать чат из папки, исключённых и закреплённых; для нескольких повторить. |

#### `max chats folders delete`

delete a folder; the chats in it stay

**Меняет что-то в MAX.**

```sh
max chats folders delete <folder>
```

| Аргумент | | Что это |
|---|---|---|
| `folder` | обязательный | ID папки или её точное название. |

#### `max chats folders order`

расположить папки в этом порядке; неуказанные папки сохранят свой порядок после них

**Меняет что-то в MAX.**

```sh
max chats folders order <folders>
```

| Аргумент | | Что это |
|---|---|---|
| `folders` | обязательный | ID папок или их точные названия, в нужном порядке. |

### `max chats rules`

what `chats moderate` judges a group by, kept in a file of this profile

#### `max chats rules show`

the group's rules; the defaults, marked not saved, if it has none yet

```sh
max chats rules show <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

#### `max chats rules set`

change one rule; the group's first change writes every rule with its default

**Меняет что-то только на этом компьютере.**

```sh
max chats rules set <chat> <key> <value>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `key` | обязательный | one of: trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove. |
| `value` | обязательный | the new value; a list is comma-separated. |

#### `max chats rules unset`

put one rule back to its default

**Меняет что-то только на этом компьютере.**

```sh
max chats rules unset <chat> <key>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `key` | обязательный | one of: trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove. |

### `max chats moderate`

judge a group's new messages and members by its rules, and act as they allow

**Меняет что-то в MAX.**

```sh
max chats moderate <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

| Опция | Что делает |
|---|---|
| `--since-time <time>` | judge what came after this ISO 8601 time, or 2h / 1d ago; the saved point stays. |
| `--dry-run` | оценить и составить план; ничего не делать. |
| `--allow-dangerous` | yes to every action whose level in the group's rules is ask. |
| `--max-actions <n>` | не больше стольких действий за один запуск; если не указано — 10. |

### `max chats media`

фото, видео, файлы, аудио и ссылки чата с сервера; чтение ничего не отмечает

```sh
max chats media <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

| Опция | Что делает |
|---|---|
| `--type <names>` | только эти типы через запятую: photo, video, file, audio, link. |
| `--limit <n>` | сколько показать. |
| `--cursor <cursor>` | продолжить с места, где, по page.next, остановилась прошлая страница. |

### `max chats mute`

выключить уведомления чата насовсем или до указанного времени; участники не узнают

**Меняет что-то в MAX.**

```sh
max chats mute <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

| Опция | Что делает |
|---|---|
| `--until <time>` | только до указанного времени: 2026-09-25T09:00 (местное), или через 30m, 2h, 7d. |

### `max chats unmute`

снова включить уведомления чата

**Меняет что-то в MAX.**

```sh
max chats unmute <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

### `max chats delete`

удалить чат у этого аккаунта; у остальных чат и сообщения остаются

**Меняет что-то в MAX.**

```sh
max chats delete <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

| Опция | Что делает |
|---|---|
| `--allow-dangerous` | удалить без вопроса, который задаёт уровень ask. |

### `max chats clear`

удалить все сообщения чата у этого аккаунта; у остальных сообщения остаются

**Меняет что-то в MAX.**

```sh
max chats clear <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

| Опция | Что делает |
|---|---|
| `--allow-dangerous` | удалить без вопроса, который задаёт уровень ask. |

### `max chats start`

запустить бота, как кнопка «Начать»; бот видит запуск

**Меняет что-то в MAX.**

```sh
max chats start <bot> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `bot` | обязательный | чат с ботом — ID или имя — либо ссылка на бота, даже ещё не открытого. |

| Опция | Что делает |
|---|---|
| `--start <param>` | параметр запуска, который читает бот; если не задан — собственный ?start= ссылки. |

### `max chats app`

адрес мини-приложения бота со входом от вашего имени; не передавайте его

**Меняет что-то в MAX.**

```sh
max chats app <bot> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `bot` | обязательный | чат с ботом: ID или имя. |

| Опция | Что делает |
|---|---|
| `--start <param>` | параметр запуска, который читает приложение. |

## `max contacts`

people you have a one-to-one chat with

### `max contacts list`

люди, с которыми у вас есть личный чат; name: ищет по имени, локальному псевдониму или @username, notes: — по вашим личным заметкам о них

```sh
max contacts list [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | условия поле:значение, сужающие список; поля перечислены ниже. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько показать. |
| `--page <n>` | какая страница, начиная с 1. |
| `--all` | все строки, без страниц. |
| `--order <recent\|name>` | newest conversation first, or alphabetical. По умолчанию: `recent`. |

### `max contacts show`

one person and the chats you share with them

```sh
max contacts show <person> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный | ID, @username или часть имени. |

| Опция | Что делает |
|---|---|
| `--with-notes` | включить ваши личные заметки при наличии разрешения contacts.notes.list. |

### `max contacts profile`

всё, что мессенджер сообщает о человеке: имена пользователей, флаги, последний визит, дата регистрации; число его сообщений в хранилище для каждого вашего общего чата, первое и последнее сообщение, а также прежние имена и имена пользователей, зафиксированные хранилищем

```sh
max contacts profile <person> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный | ID, @username или часть имени. |

| Опция | Что делает |
|---|---|
| `--show-phone` | показать номер телефона целиком. |

### `max contacts alias`

личное локальное отображаемое имя в выбранном аккаунте

#### `max contacts alias set`



**Меняет что-то только на этом компьютере.**

```sh
max contacts alias set <person> <alias>
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный |  |
| `alias` | обязательный |  |

#### `max contacts alias rm`



**Меняет что-то только на этом компьютере.**

```sh
max contacts alias rm <person>
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный |  |

### `max contacts notes`

ваши личные заметки о сохранённом контакте, общие для всех аккаунтов, где он виден

#### `max contacts notes list`



```sh
max contacts notes list <person> [query]
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный |  |
| `query` | необязательный | условия поле:значение; этот список пока ни по одному полю не фильтрует. |

#### `max contacts notes show`



```sh
max contacts notes show <person> <id>
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный |  |
| `id` | обязательный |  |

#### `max contacts notes add`



**Меняет что-то только на этом компьютере.**

```sh
max contacts notes add <person> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный |  |

| Опция | Что делает |
|---|---|
| `--file <path>` | читать текст заметки из файла; без параметра или с - читать stdin. |

#### `max contacts notes edit`



**Меняет что-то только на этом компьютере.**

```sh
max contacts notes edit <person> <id> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный |  |
| `id` | обязательный |  |

| Опция | Что делает |
|---|---|
| `--file <path>` | читать текст заметки из файла; без параметра или с - читать stdin. |
| `--revision <n>` | номер ревизии, которую вы прочитали перед редактированием. |

#### `max contacts notes remove`



**Меняет что-то только на этом компьютере.**

```sh
max contacts notes remove <person> <id>
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный |  |
| `id` | обязательный |  |

### `max contacts sync`

forget where the last sync left off and take the whole list again

**Меняет что-то только на этом компьютере.**

```sh
max contacts sync
```

### `max contacts lookup`

who MAX has under a phone number — asks for it, or reads it from stdin

```sh
max contacts lookup
```

### `max contacts add`

add a person to your contacts — `contacts list` still shows only people you have a dialog with

**Меняет что-то в MAX.**

```sh
max contacts add <person>
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный | ID человека (его находит `contacts lookup`) или часть известного имени. |

### `max contacts remove`

remove a person from your contacts; the chat stays, a name you gave them may not

**Меняет что-то в MAX.**

```sh
max contacts remove <person>
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный | ID человека (его находит `contacts lookup`) или часть известного имени. |

### `max contacts block`

stop a person from writing to you — they need not be a contact

**Меняет что-то в MAX.**

```sh
max contacts block <person>
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный | ID человека (его находит `contacts lookup`) или часть известного имени. |

### `max contacts unblock`

let a blocked person write to you again

**Меняет что-то в MAX.**

```sh
max contacts unblock <person>
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный | ID человека (его находит `contacts lookup`) или часть известного имени. |

### `max contacts rename`

переименовать контакт в адресной книге мессенджера; для личного локального имени используйте contacts alias

**Меняет что-то в MAX.**

```sh
max contacts rename <person> <first-name> [last-name]
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный | ID человека (его находит `contacts lookup`) или часть известного имени. |
| `first-name` | обязательный | the name you want to see for them. |
| `last-name` | необязательный |  |

### `max contacts import`

upload phone numbers and add the people the messenger has under them

**Меняет что-то в MAX.**

```sh
max contacts import <file>
```

| Аргумент | | Что это |
|---|---|---|
| `file` | обязательный | one person per line: number, then a comma, a tab or a semicolon, then the name. |

### `max contacts context`

what the store holds about one person, in every messenger linked to them: shared chats, the last messages each way, their recent messages, where others mentioned them — never connects

```sh
max contacts context <person> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный | ID, @username или часть имени. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | at most this many messages in each list; 10 if not given. |
| `--since-time <time>` | nothing older than this ISO 8601 time, or 2h / 1d ago. |
| `--chat <chat>` | a chat, by id or name; repeat it for more — then their newest messages in each, 20 unless --limit, short unless -v. |
| `--sync-first` | with --chat, read their newest messages in each from the messenger first. |

### `max contacts timeline`

everything one person took part in, in every messenger linked to them — messages they wrote or were mentioned in, chats, mail, meetings, tasks — newest first, from the store; never connects

```sh
max contacts timeline <person> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный | ID, @username или часть имени. |

| Опция | Что делает |
|---|---|
| `--scope <scope>` | only what belongs to personal or to work accounts: personal or work. |
| `--since-time <time>` | nothing older than this ISO 8601 time, or 2h / 1d ago. |
| `--until-time <time>` | through this ISO 8601 time, or 2h / 1d ago. |
| `--limit <n>` | at most this many; 50 if not given. |
| `--cursor <cursor>` | продолжить с места, где остановилась прошлая страница; его даёт page.next, с теми же фильтрами. |

### `max contacts check`

проверить, похож ли человек на бота, владельца поддельного аккаунта или спамера, по его профилю и сообщениям в хранилище — это подсказка, а не вердикт; публичные списки блокировок относятся только к Telegram, поэтому ничего не отправляется

```sh
max contacts check <person> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный | ID, @username или часть имени. |

| Опция | Что делает |
|---|---|
| `--no-registries` | do not ask the public ban lists; nothing about them leaves this machine. |

### `max contacts link`

record that two people in the store are one person — the same name is never enough

**Меняет что-то только на этом компьютере.**

```sh
max contacts link <person> <other>
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный | ID, @username или часть имени. |
| `other` | обязательный | the same in another messenger of the store, as <messenger>:<person> — max:Ana; me: it is you, as zoom:<id> me. |

### `max contacts unlink`

undo contacts link for one identity: it is a person of its own again

**Меняет что-то только на этом компьютере.**

```sh
max contacts unlink <person>
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный | their id, @username, or part of their name; <messenger>:<person> for another messenger. |

## `max messages`

read and send messages in a chat

### `max messages list`

a chat's messages, oldest to newest

```sh
max messages list <chat> [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `query` | необязательный | откуда начать: id<42, date>2026-10-01. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько результатов. |
| `--cursor <cursor>` | продолжить с места, где остановилась прошлая страница; его даёт page.next. |
| `--transcribe` | turn voice messages not heard yet into text — by the messenger where it can, else by a model on this machine; can take minutes. |
| `--model <id>` | which downloaded speech model hears them, with --transcribe; `models audio list` shows them. |
| `--mark-read` | also mark the chat read up to the newest message shown; the other person sees it. |

### `max messages show`

one message, by its chat and id or by its msg: locator

```sh
max messages show <chat> [message]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия; или локатор msg: без ID сообщения в конце. |
| `message` | необязательный | ID сообщения. |

### `max messages context`

a message and what came either side of it, oldest first

```sh
max messages context <chat> [message] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия; или локатор msg: без ID сообщения в конце. |
| `message` | необязательный | ID сообщения. |

| Опция | Что делает |
|---|---|
| `--thread` | сохранённая цепочка ответов вместо соседних по времени сообщений; без графа — прежнее поведение. |
| `--thread-hops <n>` | не больше стольких связей от совпадения (по умолчанию: 8). |
| `--thread-messages <n>` | не больше стольких сообщений в контексте каждой ветки (по умолчанию: 50). |
| `--thread-bytes <n>` | не больше стольких байт целых сообщений и связей в каждом контексте (по умолчанию: 65536). |
| `--thread-within <duration>` | сообщения в пределах этого времени до и после совпадения (по умолчанию: 1d). |
| `--before-n <n>` | how many before it. По умолчанию: `5`. |
| `--after-n <n>` | how many after it. По умолчанию: `5`. |

### `max messages links`

why a message is in its conversation: each link it has, and the chain of answers back to the start

```sh
max messages links <chat> <message>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `message` | обязательный | ID сообщения. |

### `max messages link`

a message permalink when supported, and its account-scoped locator

```sh
max messages link <chat> [message]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия; или локатор msg: без ID сообщения в конце. |
| `message` | необязательный | ID сообщения. |

### `max messages download`

save a message's photos, files, videos and voice notes to a folder — or a whole chat's with --all

**Меняет что-то только на этом компьютере.**

```sh
max messages download <chat> [message] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `message` | необязательный | the message id; left out with --all. |

| Опция | Что делает |
|---|---|
| `--output-dir <dir>` | where to save them; created if missing. По умолчанию: `.`. |
| `--all` | every file of the chat, newest first; run it again to continue where it stopped. |
| `--pause <duration>` | with --all, a pause between pages, to stay under the provider's limits. По умолчанию: `5s`. |
| `--extract` | прочитать текстовые слои файлов, которые эта загрузка сопоставляет с локальным индексом содержимого. |

### `max messages evidence`

a bounded evidence packet from stored messages, newest first

```sh
max messages evidence <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | how many, 1–100. |
| `--cursor <cursor>` | продолжить с места, где, по page.next, остановился прошлый пакет. |

### `max messages sync`

дописать историю чата в локальное хранилище, от новых к старым; повторный запуск продолжает; --all синхронизирует все чаты

**Меняет что-то только на этом компьютере.**

```sh
max messages sync [chat] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | необязательный | чат: его ID или часть названия. |

| Опция | Что делает |
|---|---|
| `--all` | каждый чат, сначала недавно активные — это нужно для поиска; последние 90d, если не заданы --since-time или --last. |
| `--limit <n>` | не более этого числа сообщений за запуск; с --all лимит действует для каждого чата; по умолчанию 1200. |
| `--page-size <n>` | how many messages one request asks for; 30 if not given. |
| `--pause <duration>` | the least pause between pages, to stay under the provider's limits; each is up to twice that. По умолчанию: `5s`. |
| `--since-time <time>` | stop once it reaches messages older than this: ISO 8601, or 2h / 1d ago. |
| `--last <n>` | stop once the newest n messages are held. |
| `--catch-up` | подготовить локальный поиск после этого запуска; важнее настройки search_catch_up. |
| `--no-catch-up` | не готовить локальный поиск после этого запуска. |
| `--catch-up-chunks <n>` | не более указанного числа локальных векторных фрагментов. |
| `--catch-up-messages <n>` | пропустить перестроение графа, если число сообщений превышает это значение. |
| `--catch-up-time <duration>` | лимит времени локальной подготовки, по умолчанию 30s. |
| `--background` | run as a job that outlives this command; `store jobs show` follows it. |
| `--dry-run` | only estimate how many messages, requests and minutes a full fetch would still take — from the store, no request. |

### `max messages transcribe`

turn a voice message into text, on this machine — the recording goes nowhere

```sh
max messages transcribe <chat> <message> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата или часть названия. |
| `message` | обязательный | id of a voice message. |

| Опция | Что делает |
|---|---|
| `--model <id>` | which downloaded speech model to use; `max models audio list` shows them. |

### `max messages send`

send a text message; without [text], the text is read from stdin

**Меняет что-то в MAX.**

```sh
max messages send <chat> [text] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `text` | необязательный | сообщение. |

| Опция | Что делает |
|---|---|
| `--reply-to <message>` | answer this message, by its id in the same chat. |
| `--send-as <id>` | публиковать от имени одной из сущностей в списке `chats send-as`; обязательно, если чат по умолчанию публикует от другого имени. |
| `--operation-id <id>` | повторить отправку с неизвестным исходом, не рискуя второй копией. |
| `--silent` | доставить без уведомления. |
| `--no-preview` | no preview card for a link in the text. |
| `--md` | читать текст как Markdown этого мессенджера; поддерживаемый синтаксис — в его руководстве по форматированию. |
| `--file <file>` | attach a file; the text becomes its caption. |
| `--photo <file>` | attach a .jpg, .png or .webp as a photo; the text becomes its caption. |
| `--as-file` | send the --file as a file to download, a video included. |
| `--voice <file>` | send an Ogg Opus file as a voice message, alone, with no text. |
| `--allow-any-file` | отправить файл даже из папки с учётными данными или собственной папки CLI. |
| `--at-time <time>` | let the messenger send it later, even with this machine off: 2026-09-25T09:00 (local time), or 30m, 2h, 1d from now. |
| `--sticker <id>` | отправить только этот стикер; его id показывает `stickers list`. |

### `max messages scheduled`

messages waiting to be sent later in a chat, soonest first; cancel one in the app

```sh
max messages scheduled <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

### `max messages edit`

change the text of your own message; the other side may have read it already

**Меняет что-то в MAX.**

```sh
max messages edit <chat> <message> [text] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `message` | обязательный | the id of your own message. |
| `text` | необязательный | the new text; without it, read from stdin. |

| Опция | Что делает |
|---|---|
| `--md` | читать текст как Markdown этого мессенджера; поддерживаемый синтаксис — в его руководстве по форматированию. |

### `max messages delete`

delete messages for you only; with --for-everyone, for everyone in the chat

**Меняет что-то в MAX.**

```sh
max messages delete <chat> <messages> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `messages` | обязательный | ID сообщений через пробелы или запятые, не больше 10. |

| Опция | Что делает |
|---|---|
| `--for-everyone` | delete for everyone in the chat, not only for you — they cannot get it back. |
| `--allow-dangerous` | удалить без вопроса, который задаёт уровень ask. |

### `max messages forward`

forward one message to another chat

**Меняет что-то в MAX.**

```sh
max messages forward <chat> <message> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | the chat the message is in: a chat: its id, or part of its title. |
| `message` | обязательный | ID сообщения. |

| Опция | Что делает |
|---|---|
| `--to <chat>` | where it goes: a chat: its id, or part of its title. |
| `--silent` | deliver it without a notification. |
| `--send-as <id>` | публиковать от имени одной из сущностей в списке `chats send-as` для чата --to; обязательно, если чат по умолчанию публикует от другого имени. |
| `--operation-id <id>` | повторить пересылку с неизвестным исходом, не рискуя второй копией. |

### `max messages pin`

pin a message in a chat, quietly unless --notify

**Меняет что-то в MAX.**

```sh
max messages pin <chat> <message> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `message` | обязательный | ID сообщения. |

| Опция | Что делает |
|---|---|
| `--notify` | tell the chat's members about the pin. |

### `max messages unpin`

unpin a message in a chat

**Меняет что-то в MAX.**

```sh
max messages unpin <chat> <message>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `message` | обязательный | ID сообщения. |

### `max messages press`

нажать кнопку бота под сообщением; бот видит нажатие

**Меняет что-то в MAX.**

```sh
max messages press <chat> <message> <button>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `message` | обязательный | ID сообщения с кнопками. |
| `button` | обязательный | её номер, как его печатает `messages show`, или её точный текст. |

## `max store`

the local store of messages

### `max store status`

per chat: messages stored, the oldest and newest, and the stretches held completely

```sh
max store status [chat]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | необязательный | чат: его ID или часть названия. |

### `max store gaps`

проверить записанные внутренние пробелы охвата и явно загрузить данные для них

#### `max store gaps plan`

локальный план охвата; отсутствие идентификаторов сообщений само по себе не означает нехватку истории

```sh
max store gaps plan <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

#### `max store gaps repair`

загрузить данные внутренних пробелов с ограничениями и перепроверить охват; никогда не удалять сообщения, которые не встретились при загрузке

**Меняет что-то только на этом компьютере.**

```sh
max store gaps repair <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | общее число сообщений при этом устранении пробелов, по умолчанию 500. |
| `--max-gaps <n>` | не более указанного числа пробелов, по умолчанию 5. |
| `--repair-time <duration>` | время, отведённое на восстановление, по умолчанию 30s. По умолчанию: `30s`. |
| `--page-size <n>` | число сообщений на страницу провайдера. |
| `--pause <duration>` | пауза между страницами провайдера. По умолчанию: `5s`. |
| `--fingerprint <hash>` | отказать, если этот ранее проверенный план охвата изменился. |
| `--catch-up` | подготовить локальный поиск после устранения пробелов; переопределяет search_catch_up. |
| `--no-catch-up` | пропустить подготовку локального поиска после устранения пробелов. |
| `--catch-up-chunks <n>` | максимальное число подготавливаемых локальных фрагментов. |
| `--catch-up-messages <n>` | максимальное число сохранённых сообщений, читаемых для подготовки. |
| `--catch-up-time <duration>` | время подготовки в пределах оставшегося лимита устранения пробелов. |
| `--background` | устранять пробелы через существующий механизм заданий хранилища; проверять через store jobs show. |

### `max store jobs`

фоновые задания синхронизации

#### `max store jobs list`

фоновые задания синхронизации, новые сверху

```sh
max store jobs list [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | условия поле:значение, сужающие список; поля перечислены ниже. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько показать. |
| `--page <n>` | какая страница, начиная с 1. |
| `--all` | все строки, без страниц. |

#### `max store jobs show`

one background job — the newest when none is named — and what the store now holds of its chat

```sh
max store jobs show [job]
```

| Аргумент | | Что это |
|---|---|---|
| `job` | необязательный | ID задания, который напечатала `messages sync --background`. |

#### `max store jobs cancel`

остановить идущее фоновое задание после текущей страницы; следующая синхронизация продолжит с того же места

**Меняет что-то только на этом компьютере.**

```sh
max store jobs cancel <job>
```

| Аргумент | | Что это |
|---|---|---|
| `job` | обязательный | the job id. |

#### `max store jobs retry`

запустить частичное, неудавшееся или умершее задание заново, новым заданием; синхронизация продолжится с того места, где остановилось хранилище

**Меняет что-то только на этом компьютере.**

```sh
max store jobs retry [job] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `job` | необязательный | ID задания. |

| Опция | Что делает |
|---|---|
| `--failed` | каждый чат, чьё последнее задание осталось частичным, завершилось ошибкой или умерло. |

#### `max store jobs clear`

забыть завершённые задания и удалить их логи; работающее задание остаётся

**Меняет что-то только на этом компьютере.**

```sh
max store jobs clear
```

### `max store export`

сохранённые сообщения чата, от старых к новым: --jsonl — по сообщению на строку, --json — список сообщений в общей обёртке; к мессенджеру не обращается

**Меняет что-то только на этом компьютере.**

```sh
max store export [chats] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chats` | необязательный | a chat: its id, or part of its title; several with --output-dir. |

| Опция | Что делает |
|---|---|
| `--format <format>` | jsonl: одно сообщение на строку, по умолчанию с --output; markdown: стенограмма с заголовком на каждый день, ответы и пересылки цитируются. |
| `--since-time <time>` | only from this ISO 8601 time, or 30m / 2h / 1d ago, on. |
| `--output <file>` | write JSON lines, or the transcript, to this new file, readable only by you. |
| `--output-dir <dir>` | write into this folder, a file per chat and a manifest; run again on it for only what changed since. |
| `--include <kinds>` | with --output-dir: every stored chat of these kinds, comma-separated: dialog, group, channel, saved. |
| `--all` | with --output-dir: every stored chat of this account. |
| `--encrypt` | compress and encrypt with a password, typed at a hidden prompt or piped on stdin; it is never kept — lose it and the file cannot be opened. |

### `max store clear`

delete from the store the chats this account has left, with their messages

**Меняет что-то только на этом компьютере.**

```sh
max store clear [options]
```

| Опция | Что делает |
|---|---|
| `--left` | the chats this account has left — the only thing this clears. |
| `--allow-dangerous` | yes, delete — it cannot be undone, and a chat you left cannot be fetched again. |

### `max store info`

the store file: where it is, its size, its schema and how many rows it holds; changes nothing

```sh
max store info
```

### `max store check`

whether the store is healthy — integrity, search indexes, disk, and which chats are behind

```sh
max store check
```

### `max store migrate`

обновить схему архива, нормализовать сообщения и заметки, построить индексы слов и основ

**Меняет что-то только на этом компьютере.**

```sh
max store migrate
```

### `max store reindex`

перестроить индексы слов, опечаток, основ, файлов и заметок без удаления данных

**Меняет что-то только на этом компьютере.**

```sh
max store reindex
```

### `max store backup`

copy the store into a new file, while it is in use; never overwrites a file

**Меняет что-то только на этом компьютере.**

```sh
max store backup <file> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `file` | обязательный | the new file. |

| Опция | Что делает |
|---|---|
| `--encrypt` | compress and encrypt with a password, typed at a hidden prompt or piped on stdin; it is never kept — lose it and the file cannot be opened. |

### `max store restore`

put a backup in place of the store; the store it replaces is kept beside it, never deleted

**Меняет что-то только на этом компьютере.**

```sh
max store restore <file>
```

| Аргумент | | Что это |
|---|---|---|
| `file` | обязательный | a file `store backup` wrote; one written with --encrypt asks for its password. |

### `max store decrypt`

open a file written with --encrypt into a new file; asks for its password

**Меняет что-то только на этом компьютере.**

```sh
max store decrypt <file> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `file` | обязательный | a file `store backup --encrypt` or `store export --encrypt` wrote. |

| Опция | Что делает |
|---|---|
| `--output <file>` | the new file, readable only by you. |

### `max store repair`

bring every table to this build's shape, deleting nothing: a table of the wrong shape is kept as a copy beside a new one

**Меняет что-то только на этом компьютере.**

```sh
max store repair [options]
```

| Опция | Что делает |
|---|---|
| `--dry-run` | say what it would do, and change nothing. |

### `max store reset`

back the store up beside itself, then delete it and start an empty one at this build's schema; asks first, or --yes

**Меняет что-то только на этом компьютере.**

```sh
max store reset [options]
```

| Опция | Что делает |
|---|---|
| `--no-backup` | delete the store without backing it up first. |

### `max store copies`

the tables `store repair` kept as copies

#### `max store copies delete`

delete one copy `store repair` kept, named exactly; refuses any other table

**Меняет что-то только на этом компьютере.**

```sh
max store copies delete <name>
```

| Аргумент | | Что это |
|---|---|---|
| `name` | обязательный | the copy's name, as `store repair` printed it. |

## `max stats`

Статистика сообщений, чатов и их авторов

### `max stats messages`

Статистика сообщений из локального хранилища

#### `max stats messages show`

how many stored messages match, by chat, sender, day or hour — the local store only; optionally fetches new messages with --sync-first

```sh
max stats messages show [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | строгий запрос Lucene, как для search messages; без него учитываются все сохранённые сообщения; с --saved слова добавляются к нему через AND. |

| Опция | Что делает |
|---|---|
| `--sync-first` | сначала скачать новые сообщения в пределах чата, времени и числа сообщений. |
| `--max-chats <n>` | обновить не больше стольких чатов (по умолчанию: 5). |
| `--sync-time <duration>` | прекратить скачивание через это время (по умолчанию: 30s). |
| `--max-messages <n>` | скачать не больше стольких сообщений всего (по умолчанию: 500). |
| `--by <chat\|sender\|day\|hour>` | what to count by (default: chat). |
| `--chat <chat>` | только этот чат — то же, что chat: в запросе; чат: его ID или часть названия. |
| `--source <accounts>` | каждый аккаунт этого мессенджера в хранилище; personal, bots или all — то же, что in: в запросе. |
| `--limit <n>` | how many rows. |
| `--timezone <zone>` | the IANA timezone for calendar days and hours. |
| `--exact` | слова без поля и фразы в кавычках совпадают только в точной форме, как exact:word; text: по-прежнему учитывает все словоформы. |
| `--saved <name\|id>` | count what a saved search or an earlier run matches; options typed here replace its own. |

#### `max stats messages counters`

наблюдения по каждому счётчику и ограниченное удалённое обновление

#### `max stats messages counters show`

показать сохранённые значения счётчиков и свежесть наблюдений

```sh
max stats messages counters show [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | строгий запрос Lucene по сохранённым сообщениям. |

| Опция | Что делает |
|---|---|
| `--chat <chat>` | только этот чат; укажите его ID или часть названия. |
| `--source <accounts>` | сохранённые аккаунты этого мессенджера; обновление идёт через активный аккаунт. |
| `--exact` | слова без поля совпадают только в точной форме. |
| `--timezone <zone>` | часовой пояс IANA для дат в запросе. |
| `--selection <json>` | закреплённый выбор целей счётчиков из counters show; несовместим с запросом и областью. |
| `--counters <names>` | отдельные поля views,reactions,comments; по умолчанию все три. |
| `--limit <n>` | сообщений, 1–100; по умолчанию 20. |
| `--max-age <duration>` | наибольший возраст свежего наблюдения; по умолчанию 24h. |

#### `max stats messages counters refresh`

прочитать достоверные счётчики ограниченного числа сообщений и обновить локальные наблюдения

**Меняет что-то только на этом компьютере.**

```sh
max stats messages counters refresh [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | строгий запрос Lucene по сохранённым сообщениям. |

| Опция | Что делает |
|---|---|
| `--chat <chat>` | только этот чат; укажите его ID или часть названия. |
| `--source <accounts>` | сохранённые аккаунты этого мессенджера; обновление идёт через активный аккаунт. |
| `--exact` | слова без поля совпадают только в точной форме. |
| `--timezone <zone>` | часовой пояс IANA для дат в запросе. |
| `--selection <json>` | закреплённый выбор целей счётчиков из counters show; несовместим с запросом и областью. |
| `--counters <names>` | отдельные поля views,reactions,comments; по умолчанию все три. |
| `--limit <n>` | сообщений, 1–100; по умолчанию 20. |
| `--max-messages <n>` | наибольшее число сообщений для обновления, 1–100. |
| `--sync-time <duration>` | время на удалённое обновление; по умолчанию 30s, не больше 5m. |
| `--dry-run` | показать точные сохранённые цели и возможности счётчиков без подключения. |

#### `max stats messages unanswered`

самые старые найденные вопросы без наблюдаемого подходящего прямого ответа

```sh
max stats messages unanswered [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | строгий запрос Lucene; без него выбираются все сохранённые сообщения. |

| Опция | Что делает |
|---|---|
| `--chat <chat>` | только этот чат; укажите его ID или часть названия. |
| `--source <accounts>` | каждый сохранённый аккаунт этого мессенджера; personal, bots или all. |
| `--exact` | слова без поля совпадают в точной форме, а не по основе слова. |
| `--saved <name\|id>` | запустить сохранённый отчёт этого вида; указанные опции заменяют сохранённые. |
| `--timezone <zone>` | часовой пояс IANA для границ календарных дат. |
| `--limit <n>` | строк отчёта, 1–100; по умолчанию 20. |
| `--answerer <person>` | сохранённое имя, псевдоним, @username, ID или person:provider/account/id; при неоднозначном имени нужно выбрать; для нескольких повторить. |
| `--older-than <duration>` | минимальный возраст вопроса без наблюдаемого подходящего ответа. |

#### `max stats messages discussion`

просмотренные посты с малым сохранённым обсуждением

```sh
max stats messages discussion [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | строгий запрос Lucene; без него выбираются все сохранённые сообщения. |

| Опция | Что делает |
|---|---|
| `--chat <chat>` | только этот чат; укажите его ID или часть названия. |
| `--source <accounts>` | каждый сохранённый аккаунт этого мессенджера; personal, bots или all. |
| `--exact` | слова без поля совпадают в точной форме, а не по основе слова. |
| `--saved <name\|id>` | запустить сохранённый отчёт этого вида; указанные опции заменяют сохранённые. |
| `--timezone <zone>` | часовой пояс IANA для границ календарных дат. |
| `--limit <n>` | строк отчёта, 1–100; по умолчанию 20. |
| `--min-views <n>` | минимум известных накопленных просмотров. |
| `--max-replies <n>` | максимум наблюдаемых ответов в обсуждении. |

#### `max stats messages top`

ранжировать сохранённые сообщения по метрике или объяснимой оценке; у каждого счётчика показана свежесть наблюдения

```sh
max stats messages top [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | строгий запрос Lucene; без него выбираются все сохранённые сообщения. |

| Опция | Что делает |
|---|---|
| `--sync-first` | сначала скачать новые сообщения в пределах чата, времени и числа сообщений. |
| `--max-chats <n>` | обновить не больше стольких чатов (по умолчанию: 5). |
| `--sync-time <duration>` | прекратить скачивание через это время (по умолчанию: 30s). |
| `--max-messages <n>` | скачать не больше стольких сообщений всего (по умолчанию: 500). |
| `--measure <name>` | метрика ранжирования; не сочетается с score или weights. Одно из: `views`, `reactions`, `forwards`, `comments`, `replies`, `thread-size`. |
| `--score <preset>` | helpful/active для авторов; engaging для обоих типов объектов. Одно из: `helpful`, `active`, `engaging`. |
| `--weights <json>` | полный набор весов компонентов; заменяет веса предустановки. |
| `--message-kind <kind>` | перед ранжированием выбрать все сообщения, посты или комментарии с подтверждённым типом. Одно из: `all`, `posts`, `comments`. |
| `--chat <chat>` | только этот чат; укажите его ID или часть названия. |
| `--source <accounts>` | каждый сохранённый аккаунт этого мессенджера; personal, bots или all. |
| `--timezone <zone>` | часовой пояс IANA для дат и активных дней. |
| `--exact` | слова без поля совпадают в точной форме, а не по основе слова. |
| `--limit <n>` | строки рейтинга, 1–100. |
| `--saved <name\|id>` | выполнить сохранённый запрос или запуск ранжирования; явно введённые параметры заменяют сохранённые. |

#### `max stats messages evidence`

ограниченная страница сообщений, пар ответов или участников когорты из точной выборки drilldown

```sh
max stats messages evidence <message> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `message` | обязательный | канонический адрес сообщения или ссылка когорты удержания из drilldown. |

| Опция | Что делает |
|---|---|
| `--selection <json>` | полностью определённая выборка рейтинга, возвращённая в drilldown. |
| `--component <name>` | доступный компонент рейтинга. |
| `--limit <n>` | строки подтверждающих данных, 1–100; 20, если не указано. |
| `--cursor <cursor>` | продолжить для того же компонента и отпечатка сохранённых подтверждающих данных. |

### `max stats contacts`

Статистика о человеческих авторах

#### `max stats contacts responses`

число ответов и медиана/p90 времени ответа выбранных людей

```sh
max stats contacts responses [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | строгий запрос Lucene; без него выбираются все сохранённые сообщения. |

| Опция | Что делает |
|---|---|
| `--chat <chat>` | только этот чат; укажите его ID или часть названия. |
| `--source <accounts>` | каждый сохранённый аккаунт этого мессенджера; personal, bots или all. |
| `--exact` | слова без поля совпадают в точной форме, а не по основе слова. |
| `--saved <name\|id>` | запустить сохранённый отчёт этого вида; указанные опции заменяют сохранённые. |
| `--timezone <zone>` | часовой пояс IANA для границ календарных дат. |
| `--limit <n>` | строк отчёта, 1–100; по умолчанию 20. |
| `--answerer <person>` | сохранённое имя, псевдоним, @username, ID или person:provider/account/id; при неоднозначном имени нужно выбрать; для нескольких повторить. |

#### `max stats contacts top`

ранжировать авторов сохранённых сообщений по метрике или объяснимой оценке; у каждого счётчика показана свежесть наблюдения

```sh
max stats contacts top [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | строгий запрос Lucene; без него выбираются все сохранённые сообщения. |

| Опция | Что делает |
|---|---|
| `--sync-first` | сначала скачать новые сообщения в пределах чата, времени и числа сообщений. |
| `--max-chats <n>` | обновить не больше стольких чатов (по умолчанию: 5). |
| `--sync-time <duration>` | прекратить скачивание через это время (по умолчанию: 30s). |
| `--max-messages <n>` | скачать не больше стольких сообщений всего (по умолчанию: 500). |
| `--measure <name>` | метрика ранжирования; не сочетается с score или weights. Одно из: `messages`, `words`, `reactions`, `replies`, `answers`, `answer-time`, `threads`, `active-days`. |
| `--score <preset>` | helpful/active для авторов; engaging для обоих типов объектов. Одно из: `helpful`, `active`, `engaging`. |
| `--weights <json>` | полный набор весов компонентов; заменяет веса предустановки. |
| `--message-kind <kind>` | перед ранжированием выбрать все сообщения, посты или комментарии с подтверждённым типом. Одно из: `all`, `posts`, `comments`. |
| `--chat <chat>` | только этот чат; укажите его ID или часть названия. |
| `--source <accounts>` | каждый сохранённый аккаунт этого мессенджера; personal, bots или all. |
| `--timezone <zone>` | часовой пояс IANA для дат и активных дней. |
| `--exact` | слова без поля совпадают в точной форме, а не по основе слова. |
| `--limit <n>` | строки рейтинга, 1–100. |
| `--saved <name\|id>` | выполнить сохранённый запрос или запуск ранжирования; явно введённые параметры заменяют сохранённые. |
| `--min-messages <n>` | минимальное число выбранных сообщений на автора; 1 либо 5 для engaging. |

#### `max stats contacts evidence`

ограниченная страница сообщений, пар ответов или участников когорты из точной выборки drilldown

```sh
max stats contacts evidence <person> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `person` | обязательный | точный ID человека в мессенджере из строки рейтинга. |

| Опция | Что делает |
|---|---|
| `--selection <json>` | полностью определённая выборка рейтинга, возвращённая в drilldown. |
| `--component <name>` | доступный компонент рейтинга. |
| `--limit <n>` | строки подтверждающих данных, 1–100; 20, если не указано. |
| `--cursor <cursor>` | продолжить для того же компонента и отпечатка сохранённых подтверждающих данных. |

### `max stats chats`

Статистика одного чата

#### `max stats chats show`

a group's or channel's numbers for a period: messages, active members, replies, reactions, questions answered, joins and leaves — counted from the local store; joins and leaves are asked of the messenger

```sh
max stats chats show <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

| Опция | Что делает |
|---|---|
| `--since-time <time>` | ISO 8601 или 2h / 1d назад; если не указано — 7 дней назад. |
| `--by <day\|week>` | also one row per calendar day or week (weeks start on Monday). |
| `--timezone <zone>` | часовой пояс IANA для календарных дней. |

#### `max stats chats newcomers`

участники с известным вступлением и помощь в окне после вступления

```sh
max stats chats newcomers <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

| Опция | Что делает |
|---|---|
| `--since-time <time>` | с этого времени ISO 8601 или 2h / 1d назад; по умолчанию 30d назад. |
| `--until-time <time>` | до этого времени ISO 8601 или 2h / 1d назад включительно. |
| `--within <duration>` | окно помощи после известного вступления новичка. |
| `--saved <name\|id>` | запустить сохранённый отчёт этого вида; указанные опции заменяют сохранённые. |
| `--timezone <zone>` | часовой пояс IANA для границ календарных дат. |
| `--limit <n>` | строк отчёта, 1–100; по умолчанию 20. |
| `--answerer <person>` | сохранённое имя, псевдоним, @username, ID или person:provider/account/id; при неоднозначном имени нужно выбрать; для нескольких повторить. |

#### `max stats chats retention`

когорты вступления и наблюдаемое участие в контрольные даты по сохранённым спискам состава

```sh
max stats chats retention <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

| Опция | Что делает |
|---|---|
| `--since-time <time>` | период вступления начинается со времени ISO 8601 или относительного; по умолчанию последние 90 дней. |
| `--until-time <time>` | период вступления заканчивается в это время; по умолчанию сейчас. |
| `--checkpoints <durations>` | до 10 возрастающих сроков с момента вступления через запятую; по умолчанию 1d,7d,30d. |
| `--within <duration>` | окно активности и раннего ухода после вступления; по умолчанию 7d. |
| `--by <day\|week>` | группировать даты вступления по календарным дням или неделям с понедельника. Одно из: `day`, `week`. |
| `--timezone <zone>` | часовой пояс IANA для когорт вступления. |
| `--limit <n>` | когорты и данные по участникам, 1–100. |

### `max stats tasks`

Статистика задач

#### `max stats tasks show`

для каждого чата: число открытых задач, самая старая открытая задача, медианное время до закрытия

```sh
max stats tasks show [options]
```

| Опция | Что делает |
|---|---|
| `--chat <chat>` | только этот чат; укажите его ID или часть названия. |
| `--type <type>` | только этот тип: question, request, mention или promise. |

### `max stats charts`

данные графика из статистики чата и, по желанию, изображение SVG или PNG с тёмным оформлением

**Меняет что-то только на этом компьютере.**

```sh
max stats charts <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

| Опция | Что делает |
|---|---|
| `--chart-kind <messages\|active\|membership>` | what to draw: messages, active authors, or joins and leaves. По умолчанию: `messages`. |
| `--by <day\|week>` | one point per calendar day or week (weeks start on Monday). По умолчанию: `day`. |
| `--since-time <time>` | ISO 8601 или 2h / 1d назад; если не указано — 7 дней назад. |
| `--timezone <zone>` | часовой пояс IANA для календарных дней. |
| `--output <file>` | записать изображение с тёмным оформлением в новый файл .svg или .png. |

## `max tasks`

то, что требует вашего внимания — вопросы без ответа, упоминания, просьбы, обещания — в локальном хранилище; review и serve добавляют их

### `max tasks list`

задачи, сначала самые старые, с их источником — сообщением или заметкой

```sh
max tasks list [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | условия поле:значение, сужающие список; поля перечислены ниже. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько результатов. |

### `max tasks add`

добавить задачу для сохранённого сообщения или заметки — обещания или просьбы

**Меняет что-то только на этом компьютере.**

```sh
max tasks add <message> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `message` | обязательный | идентификатор сообщения msg:<provider>/<account>/<chat>/<message> или note:<id>. |

| Опция | Что делает |
|---|---|
| `--type <type>` | тип задачи: question, request, mention или promise. |
| `--category <name>` | о чём задача, из списка, который выводит tasks categories: money, documents, meeting, …. |
| `--into <id>` | если tasks add показал задачи, которые могут быть той же работой: привязать сообщение к этой задаче, а не открывать новую. |
| `--new` | если tasks add показал задачи, которые могут быть той же работой: всё равно открыть задачу. |
| `--title <title>` | одна строка: действие и его объект — send Alex the API token. |
| `--description <text>` | подробности в Markdown: кто кому должен, когда считать выполненной, следующий шаг, ключевые слова. |
| `--due <time>` | когда она должна быть выполнена: время ISO 8601 или 2h, 3d от текущего момента; none очищает. |
| `--remind-time <time>` | когда посмотреть на неё снова: время ISO 8601 или 2h, 3d от текущего момента; none очищает. |
| `--assignee <person...>` | кто выполняет: sender (тот, кто отправил сообщение задачи) или person:<id>; none очищает. Если не уверены, не указывайте: задача без исполнителя лучше, чем никакой. |

### `max tasks plan`

задать название, описание, срок, следующую проверку, категорию и исполнителя задачи; в мессенджер ничего не уходит

**Меняет что-то только на этом компьютере.**

```sh
max tasks plan <task> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `task` | обязательный | ID или ключ задачи, как его показывает tasks list. |

| Опция | Что делает |
|---|---|
| `--category <name>` | о чём задача, из списка, который выводит tasks categories: money, documents, meeting, …; изменение сохраняется в истории задачи. |
| `--title <title>` | одна строка: действие и его объект — send Alex the API token. |
| `--description <text>` | подробности в Markdown: кто кому должен, когда считать выполненной, следующий шаг, ключевые слова. |
| `--due <time>` | когда она должна быть выполнена: время ISO 8601 или 2h, 3d от текущего момента; none очищает. |
| `--remind-time <time>` | когда посмотреть на неё снова: время ISO 8601 или 2h, 3d от текущего момента; none очищает. |
| `--assignee <person...>` | кто выполняет: sender (тот, кто отправил сообщение задачи) или person:<id>; none очищает. Если не уверены, не указывайте: задача без исполнителя лучше, чем никакой. |

### `max tasks link`

привязать к задаче сообщения, чаты, людей или ссылки — или другую задачу: task:<id>

**Меняет что-то только на этом компьютере.**

```sh
max tasks link <task> [targets] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `task` | обязательный | ID или ключ задачи, как его показывает tasks list. |
| `targets` | необязательный | локаторы msg:, person:<id>, document:<id>, note:<id>, URL; или task:<id>, который связывает две задачи проекта. |

| Опция | Что делает |
|---|---|
| `--chat <chat>` | чат, к которому она относится, можно повторять; чат: его ID или часть названия. |
| `--kind <kind>` | related-to (по умолчанию), evidence — показывает, что задача настоящая — или created-from; для task:<id> — related-to, blocked-by, follow-up-of, duplicate-of или discovered-from. |

### `max tasks show`

одна задача: её план и всё, что к ней привязано

```sh
max tasks show <task>
```

| Аргумент | | Что это |
|---|---|---|
| `task` | обязательный | ID или ключ задачи, как его показывает tasks list. |

### `max tasks related`

задачи, которые могут быть той же работой, что и эта, лучшие первыми, каждая с уровнем — likely, maybe, different — и причинами; ничего не объединяет

```sh
max tasks related <task> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `task` | обязательный | id или ключ задачи, как показывает tasks list. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько, не больше 40 (по умолчанию 10). |

### `max tasks duplicates`

пары задач, открытых правилом, которые могут быть одной работой, новые первыми, с оценкой и причинами: объединить, отклонить или отложить каждую; decision:unsure показывает пары, отложенные для владельца

```sh
max tasks duplicates [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | условия поле:значение, сужающие список; поля перечислены ниже. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько. |

#### `max tasks duplicates reject`

две задачи — не одна работа: пара уходит из списка и больше не предлагается

**Меняет что-то только на этом компьютере.**

```sh
max tasks duplicates reject <dup> <task>
```

| Аргумент | | Что это |
|---|---|---|
| `dup` | обязательный | задача, показанная как дубликат, по её id или ключу. |
| `task` | обязательный | задача, с которой её сопоставили. |

#### `max tasks duplicates defer`

поля и текст не дают ответа: оставить пару владельцу, который покажет её через decision:unsure

**Меняет что-то только на этом компьютере.**

```sh
max tasks duplicates defer <dup> <task>
```

| Аргумент | | Что это |
|---|---|---|
| `dup` | обязательный | задача, показанная как дубликат, по её id или ключу. |
| `task` | обязательный | задача, с которой её сопоставили. |

### `max tasks merge`

одна работа, замеченная дважды: привязать все сообщения дубликата к задаче и закрыть дубликат как dismissed, duplicate-of этой задачи; ничего не удаляется, а tasks unmerge отменяет объединение

**Меняет что-то только на этом компьютере.**

```sh
max tasks merge <dup> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `dup` | обязательный | дубликат, по его id или ключу; он должен быть открыт. |

| Опция | Что делает |
|---|---|
| `--into <id>` | задача, которая остаётся, по её id или ключу. |

### `max tasks unmerge`

отменить объединение: открыть задачу заново и убрать её связь duplicate-of; сообщения, привязанные при объединении, остаются привязанными

**Меняет что-то только на этом компьютере.**

```sh
max tasks unmerge <dup>
```

| Аргумент | | Что это |
|---|---|---|
| `dup` | обязательный | объединённая задача, по её id или ключу. |

### `max tasks agenda`

что нужно посмотреть сегодня — из локального хранилища и без текста сообщений: просроченные, близкие и требующие проверки задачи, чаты, где ждут вашего ответа, и чаты, где ответа ждёте вы

```sh
max tasks agenda [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | условия поле:значение, сужающие список; поля перечислены ниже. |

| Опция | Что делает |
|---|---|
| `--due-within <duration>` | показать задачи со сроком в пределах этого: 30m, 2h, 1d (по умолчанию 1d). |
| `--unanswered <duration>` | показать чаты, где последним написал кто-то другой не меньше этого времени назад (по умолчанию 1d). |
| `--waiting <duration>` | показать чаты, где последним написали вы не меньше этого времени назад (по умолчанию 7d). |
| `--within <duration>` | не показывать чаты, молчащие дольше этого: разговор закончился (по умолчанию 30d). |
| `--holder <name>` | кто вы для захватов: id сессии или id чата; по умолчанию WIRECAT_HOLDER, иначе сессия Claude Code, иначе имя агента. |

### `max tasks categories`

категории задачи: что означает каждая и по каким словам её выбирает правило

```sh
max tasks categories
```

### `max tasks scan`

правила задач для последних сохранённых сообщений чата: в личном чате вопрос, на который вы не ответили, а в группе только вопрос в ответ вам и упоминание вас открывают задачу, ваш ответ закрывает её; канал задач не открывает — для чата, который первый sync не обработал (настройка task_first_pass_per_chat). Показывает, что откроется, и ничего не меняет без --yes; с --yes проверяет дубликаты как при sync. Читает только локальное хранилище

**Меняет что-то только на этом компьютере.**

```sh
max tasks scan <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |

| Опция | Что делает |
|---|---|
| `--last <n>` | прочитать последние n сохранённых сообщений каждого чата (по умолчанию 50, не больше 1000). |

### `max tasks claim`

занять открытую задачу, чтобы другой агент не работал над ней одновременно; захват истекает сам

**Меняет что-то только на этом компьютере.**

```sh
max tasks claim <task> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `task` | обязательный | id или ключ задачи, как показывает tasks list. |

| Опция | Что делает |
|---|---|
| `--lease <duration>` | как долго действует захват: 30m, 2h (по умолчанию 30m); повторный захват продлевает его. |
| `--holder <name>` | кто вы для захватов: id сессии или id чата; по умолчанию WIRECAT_HOLDER, иначе сессия Claude Code, иначе имя агента. |

### `max tasks release`

вернуть задачу, которую вы заняли, до окончания захвата; владелец может освободить любую

**Меняет что-то только на этом компьютере.**

```sh
max tasks release <task> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `task` | обязательный | id или ключ задачи, как показывает tasks list. |

| Опция | Что делает |
|---|---|
| `--holder <name>` | кто вы для захватов: id сессии или id чата; по умолчанию WIRECAT_HOLDER, иначе сессия Claude Code, иначе имя агента. |

### `max tasks close`

закрыть задачу: done либо dismissed, если ответ не нужен. Агент (заданы AI_AGENT или CLAUDECODE) указывает --certainty; ниже task_agent_close_min либо при task_agent_close off задача остаётся открытой и ждёт владельца: tasks close подтверждает закрытие, tasks reject отклоняет. Закрытая задача остаётся закрытой, если только tasks unmerge не откроет объединённую заново

**Меняет что-то только на этом компьютере.**

```sh
max tasks close <task> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `task` | обязательный | id или ключ задачи из вывода tasks list. |

| Опция | Что делает |
|---|---|
| `--as <state>` | как закрыть: done либо dismissed — ответ не требуется; владелец может не указывать состояние, подтверждая закрытие агента. |
| `--reason <text>` | причина, сохраняемая с задачей — например, no-reply-needed. |
| `--certainty <n>` | уверенность агента от 0 до 1, что задача больше ничего не требует. |
| `--as-owner` | закрыть как владелец, хотя команда запущена из терминала агента (заданы AI_AGENT или CLAUDECODE). |

### `max tasks reject`

отклонить предложенное агентом закрытие: задача остаётся открытой и уходит из close:suggested; агент может снова предложить закрыть её

**Меняет что-то только на этом компьютере.**

```sh
max tasks reject <task> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `task` | обязательный | id или ключ задачи из вывода tasks list. |

| Опция | Что делает |
|---|---|
| `--as-owner` | отклонить как владелец, хотя команда запущена из терминала агента (заданы AI_AGENT или CLAUDECODE). |

## `max conversations`

the conversations inside a chat, found in the stored messages by replies, mentions and who wrote next

### `max conversations build`

find a chat's conversations in what the store holds, replacing the last build; without --chat, every chat that changed since its build and every group never built; never asks the messenger

**Меняет что-то только на этом компьютере.**

```sh
max conversations build [options]
```

| Опция | Что делает |
|---|---|
| `--chat <chat>` | чат: его ID или часть названия. |
| `--analyze` | link batches using the configured analysis provider; requires --chat and remembers consent for this chat/provider. |
| `--provider <provider>` | analysis: agent, openai or anthropic. |
| `--model <model>` | analysis model; overrides analysis_model. |
| `--base-url <url>` | analysis API endpoint; overrides analysis_base_url. |
| `--size <n>` | analysis answer messages per batch, 10–200; default 50. |
| `--max-tokens <n>` | analysis input/output reservation cap per run; default 100000. |
| `--max-chats <n>` | не больше стольких чатов за один запуск; если не указано — 20. |

### `max conversations list`

a chat's conversations, the newest first: when, how many messages, how many people

```sh
max conversations list <chat> [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `query` | необязательный | условия поле:значение, сужающие список; поля перечислены ниже. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько результатов. |

### `max conversations show`

one conversation's messages, oldest first — by its id, or the one a message is in

```sh
max conversations show <conversation> [message]
```

| Аргумент | | Что это |
|---|---|---|
| `conversation` | обязательный | a conversation id from `conversations list`; or a chat: its id, or part of its title, with a message. |
| `message` | необязательный | a message id in that chat: show the conversation it is in. |

### `max conversations related`

the conversations nearest in meaning to the one a message is in, in every built chat, best first — from the vectors `conversations embed` stored; runs no model

```sh
max conversations related <chat> <message> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `message` | обязательный | a message id in that chat. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько результатов. |
| `--model <model>` | локально: ID модели из `models text list` (по умолчанию: e5-small); удалённо: модель провайдера. |
| `--provider <provider>` | провайдер векторов: local или openai; опции важнее настроек профиля. |
| `--base-url <url>` | сервер с /v1/embeddings как у OpenAI: Gemini, Jina или Ollama и LM Studio на этом компьютере. |
| `--dims <n>` | удалённо: размер вектора — нужен с --base-url; укорачивает вектор модели OpenAI. |

### `max conversations status`

how fresh each built chat's conversations and vectors are: messages the build has not seen, chunks with a current, stale or missing vector

```sh
max conversations status [options]
```

| Опция | Что делает |
|---|---|
| `--chat <chat>` | только этот чат: его ID или часть названия. |
| `--model <model>` | локально: ID модели из `models text list` (по умолчанию: e5-small); удалённо: модель провайдера. |
| `--provider <provider>` | провайдер векторов: local или openai; опции важнее настроек профиля. |
| `--base-url <url>` | сервер с /v1/embeddings как у OpenAI: Gemini, Jina или Ollama и LM Studio на этом компьютере. |
| `--dims <n>` | удалённо: размер вектора — нужен с --base-url; укорачивает вектор модели OpenAI. |

### `max conversations batches`

windows of a chat for your own AI agent to link: which earlier message each one answers

#### `max conversations batches status`

how many messages still wait for an answer, in how many batches, and how much text

```sh
max conversations batches status [options]
```

| Опция | Что делает |
|---|---|
| `--chat <chat>` | чат: его ID или часть названия. |
| `--size <n>` | messages to answer per batch, 10–200; 50 by default. |

#### `max conversations batches next`

the next window to answer, with the messages before it; message text goes to stdout only

```sh
max conversations batches next [options]
```

| Опция | Что делает |
|---|---|
| `--chat <chat>` | чат: его ID или часть названия. |
| `--size <n>` | messages to answer per batch, 10–200; 50 by default. |

### `max conversations links`

your agent's answers: which earlier message each message of a batch answers

#### `max conversations links add`

store your agent's answer to a batch, read as JSON from stdin: { "model", "answers": [{ "message", "parent", "confidence" }] }; all or nothing

**Меняет что-то только на этом компьютере.**

```sh
max conversations links add [options]
```

| Опция | Что делает |
|---|---|
| `--batch <id>` | the batch id `conversations batches next` printed. |

#### `max conversations links clear`

drop your agent's answers for a chat, or only one model's; messages are never touched

**Меняет что-то только на этом компьютере.**

```sh
max conversations links clear [options]
```

| Опция | Что делает |
|---|---|
| `--chat <chat>` | чат: его ID или часть названия. |
| `--model <model>` | only the answers this model gave. |

### `max conversations consents`

remembered analysis permissions for this account's chats and provider endpoints

#### `max conversations consents list`



```sh
max conversations consents list
```

#### `max conversations consents revoke`



**Меняет что-то только на этом компьютере.**

```sh
max conversations consents revoke [options]
```

| Опция | Что делает |
|---|---|
| `--chat <chat>` | revoke only this chat's consents; defaults to every chat. |
| `--provider <identity>` | exact provider identity from consents list; defaults to every provider. |

### `max conversations embed`

compute a vector for each chunk of a chat's conversations for search by meaning — on this machine, or with --provider through a service and your key; resumes where it stopped; without --chat, every built chat with chunks left, on this machine only

**Меняет что-то только на этом компьютере.**

```sh
max conversations embed [options]
```

| Опция | Что делает |
|---|---|
| `--chat <chat>` | чат: его ID или часть названия. |
| `--model <model>` | локально: ID модели из `models text list` (по умолчанию: e5-small); удалённо: модель провайдера. |
| `--provider <provider>` | провайдер векторов: local или openai; опции важнее настроек профиля. |
| `--base-url <url>` | сервер с /v1/embeddings как у OpenAI: Gemini, Jina или Ollama и LM Studio на этом компьютере. |
| `--dims <n>` | удалённо: размер вектора — нужен с --base-url; укорачивает вектор модели OpenAI. |
| `--threads <n>` | local: threads in all (default: min(8, cores)). |
| `--concurrency <n>` | удалённо: запросов одновременно (по умолчанию: 4). |
| `--max-tokens <n>` | remote: stop before a run that could send more tokens than this. |
| `--max-chats <n>` | не больше стольких чатов за один запуск; если не указано — 20. |
| `--max-chunks <n>` | at most this many chunks embedded in one run; 2000 if not given, and no limit with --chat. |

#### `max conversations embed status`

how many chunks of a chat have a vector of the model, how many are left, and what is left costs

```sh
max conversations embed status [options]
```

| Опция | Что делает |
|---|---|
| `--chat <chat>` | чат: его ID или часть названия. |
| `--model <model>` | локально: ID модели из `models text list` (по умолчанию: e5-small); удалённо: модель провайдера. |
| `--provider <provider>` | провайдер векторов: local или openai; опции важнее настроек профиля. |
| `--base-url <url>` | сервер с /v1/embeddings как у OpenAI: Gemini, Jina или Ollama и LM Studio на этом компьютере. |
| `--dims <n>` | удалённо: размер вектора — нужен с --base-url; укорачивает вектор модели OpenAI. |

#### `max conversations embed clear`

drop a chat's vectors, or only one model's; messages and conversations are never touched

**Меняет что-то только на этом компьютере.**

```sh
max conversations embed clear [options]
```

| Опция | Что делает |
|---|---|
| `--chat <chat>` | чат: его ID или часть названия. |
| `--model <model>` | локально: ID модели из `models text list` (по умолчанию: e5-small); удалённо: модель провайдера. |
| `--provider <provider>` | провайдер векторов: local или openai; опции важнее настроек профиля. |
| `--base-url <url>` | сервер с /v1/embeddings как у OpenAI: Gemini, Jina или Ollama и LM Studio на этом компьютере. |
| `--dims <n>` | удалённо: размер вектора — нужен с --base-url; укорачивает вектор модели OpenAI. |

## `max attachments`

файлы сохранённых сообщений: их текст в локальном хранилище, где его находит поиск

### `max attachments extract`

прочитать текст скачанных файлов — текст, текстовые слои PDF/DOCX, ODT/ODS/XLSX/PPTX/EPUB — в локальное хранилище, где их находит поиск

**Меняет что-то только на этом компьютере.**

```sh
max attachments extract [options]
```

| Опция | Что делает |
|---|---|
| `--chat <chat>` | only this chat's files; a chat: its id, or part of its title. |
| `--from-dir <dir>` | сопоставить файлы в этом каталоге без обхода подкаталогов; требуется --chat. |
| `--cursor <cursor>` | продолжить с курсора, возвращённого извлечением с ограничениями. |
| `--download` | first save the files no download saved yet, from the messenger, into --output-dir. |
| `--output-dir <dir>` | with --download, where to save them; created if missing. |
| `--limit <n>` | read at most this many files; run it again to continue. |
| `--ocr` | явно вызвать models.ocr для массового извлечения текста из изображений и сканированных PDF. |
| `--concurrency <n>` | удалённо: запросов одновременно (по умолчанию: 4). |

### `max attachments list`

файлы сохранённых сообщений, новые первыми: где сохранён каждый и есть ли его текст — но не сам текст

```sh
max attachments list [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | условия поле:значение, сужающие список; поля перечислены ниже. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько показать. |
| `--page <n>` | какая страница, начиная с 1. |
| `--all` | все строки, без страниц. |

### `max attachments show`

прочитать ограниченную порцию сохранённого вложения; JSON содержит байты в base64

```sh
max attachments show <chat> [message] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: ID или часть названия; или только адрес msg:. |
| `message` | необязательный | ID сообщения. |

| Опция | Что делает |
|---|---|
| `--attachment <n>` | номер файла, начиная с 1; обязателен, если файлов несколько. |
| `--page <n>` | отрисовать одну страницу PDF в PNG, начиная с 1; необязательные unpdf/canvas, без OCR. |
| `--offset-bytes <n>` | смещение в байтах от 0. |
| `--chunk-bytes <n>` | сколько байт вернуть, 1–1048576 (по умолчанию 524288). |
| `--expected-fingerprint <hash>` | требовать SHA-256 всего файла из предыдущего фрагмента. |

### `max attachments text`

the text of one file, as an agent read it

#### `max attachments text set`

сохранить текст, который агент прочитал из файла — скана, фотографии, — чтобы его находил поиск; ничего не отправляется

**Меняет что-то только на этом компьютере.**

```sh
max attachments text set <chat> [message] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия; или локатор msg: без ID сообщения в конце. |
| `message` | необязательный | ID сообщения. |

| Опция | Что делает |
|---|---|
| `--attachment <n>` | which file of the message, from 1; needed when it has more than one. |
| `--text-file <path>` | read the text from this file; - or none reads stdin. |

## `max tags`

ваши собственные теги на чатах, людях, сообщениях и задачах; хранятся в локальном хранилище и никуда не отправляются; tag: в поиске их находит

### `max tags auto`

назначить локальные теги группам и каналам по кешированным метаданным с помощью правил ключевых слов

**Меняет что-то только на этом компьютере.**

```sh
max tags auto [options]
```

| Опция | Что делает |
|---|---|
| `--chat <chat>` | сохранённая группа или канал; повторите параметр для нескольких. По умолчанию: ``. |
| `--limit <number>` | обработать не более указанного числа чатов (1–500). По умолчанию: `50`. |
| `--sync-first` | прочитать текущие описания из мессенджера перед классификацией. |
| `--dry-run` | предварительно показать классификацию по кешу без изменения хранилища. |

### `max tags add`

поставить теги на один чат, человека, сообщение или задачу

**Меняет что-то только на этом компьютере.**

```sh
max tags add <tag> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `tag` | обязательный | one or more tags: 1–32 letters a–z, digits and hyphens; upper case is lowered. |

| Опция | Что делает |
|---|---|
| `--chat <chat>` | the chat to tag, or the chat of --message; a chat: its id, or part of its title. |
| `--contact <person>` | the person to tag: their id, @username or name, as the local store knows them. |
| `--message <message>` | the message to tag: its id in --chat, or a msg: locator alone. |
| `--task <id>` | задача, которую нужно пометить: её id или ключ, как показывает tasks list. |

### `max tags remove`

снять теги с одного чата, человека, сообщения или задачи

**Меняет что-то только на этом компьютере.**

```sh
max tags remove <tag> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `tag` | обязательный | one or more tags: 1–32 letters a–z, digits and hyphens; upper case is lowered. |

| Опция | Что делает |
|---|---|
| `--chat <chat>` | the chat to untag, or the chat of --message; a chat: its id, or part of its title. |
| `--contact <person>` | the person to untag: their id, @username or name, as the local store knows them. |
| `--message <message>` | the message to untag: its id in --chat, or a msg: locator alone. |
| `--task <id>` | задача, с которой снимают теги: её id или ключ, как показывает tasks list. |
| `--source <manual\|auto>` | удалить только отметку о принадлежности к этому источнику. |

### `max tags list`

что помечено тегами: чаты, сообщения и задачи этого аккаунта и люди его мессенджера

```sh
max tags list [query]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | условия поле:значение, сужающие список; поля перечислены ниже. |

## `max mentions`

телефоны, e-mail, ссылки, документы, имена и адреса в сохранённых сообщениях

### `max mentions list`

упоминания этого аккаунта, подходящие под запрос, новые первыми; --new — те, что найдены после последней проверки

```sh
max mentions list [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | поля ниже; слово без поля — это значение, поэтому телефон, набранный с 8, найдётся и записанный с +7. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько показать. |
| `--page <n>` | какая страница, начиная с 1. |
| `--new` | нерешённые упоминания, найденные после последнего запуска --new, который показал их все; первый запуск показывает все. |

### `max mentions domains`

сайты, на которые ведут ссылки этого аккаунта, самые частые первыми, с чатами, временем первой и последней ссылки

```sh
max mentions domains [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | сужает считаемые ссылки: поля перечислены ниже; отклонённые ссылки не считаются. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько показать. |
| `--page <n>` | какая страница, начиная с 1. |

### `max mentions places`

подтверждённые адреса во всех аккаунтах, часто упоминаемые первыми; `mentions confirm <id>` добавляет адрес

```sh
max mentions places [options]
```

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько показать. |
| `--page <n>` | какая страница, начиная с 1. |

### `max mentions show`

одно упоминание, текст вокруг него и сколько ещё мест содержат то же значение

```sh
max mentions show <id>
```

| Аргумент | | Что это |
|---|---|---|
| `id` | обязательный | ID упоминания из mentions list. |

### `max mentions confirm`

указать, что означает упоминание: владелец телефона везде, где он встречается, сохранённый документ, кому соответствует имя или адрес как место

**Меняет что-то только на этом компьютере.**

```sh
max mentions confirm <id> [person] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `id` | обязательный | ID упоминания из mentions list. |
| `person` | необязательный | person:<uid> или organization:<id> — владелец телефона или e-mail; person:<uid> — кому соответствует имя; документу и почтовому адресу не нужен. |

| Опция | Что делает |
|---|---|
| `--all-in-chat` | имя: также каждое нерешённое место с тем же именем в его чате. |
| `--as-owner` | записать решение как ваше, хотя программу запускает терминал агента (задана AI_AGENT или CLAUDECODE). |

### `max mentions reject`

не настоящее упоминание: отклонить его значение везде и при следующих синхронизациях; имя — только там, где оно стоит

**Меняет что-то только на этом компьютере.**

```sh
max mentions reject <id> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `id` | обязательный | ID упоминания из mentions list. |

| Опция | Что делает |
|---|---|
| `--all-in-chat` | имя: также каждое нерешённое место с тем же именем в его чате. |
| `--as-owner` | записать решение как ваше, хотя программу запускает терминал агента (задана AI_AGENT или CLAUDECODE). |

### `max mentions rebuild`

заново найти упоминания во всех сохранённых сообщениях; принятые решения сохраняются

**Меняет что-то только на этом компьютере.**

```sh
max mentions rebuild [kind]
```

| Аргумент | | Что это |
|---|---|---|
| `kind` | необязательный | только этот вид: person-name — после того как люди добавлены или переименованы. Одно из: `phone`, `email`, `url`, `document`, `person-name`, `place`. |

## `max images`

искать картинки по тому, что на них изображено, моделью на этом компьютере

### `max images embed`

посчитать вектор для каждой картинки, которую знает хранилище и для которой вектора ещё нет, — она скачивается через мессенджер, хранится только вектор; нужны `picture_search` в профиле и `images models download clip-b32`; продолжает с места остановки

**Меняет что-то только на этом компьютере.**

```sh
max images embed [options]
```

| Опция | Что делает |
|---|---|
| `--chat <chat>` | только этот чат; чат: его ID или часть названия. |
| `--limit <n>` | не больше стольких картинок за один запуск; если не указано — 100. |

### `max images models`

модели, которые читают картинки, для `images embed` и поиска по картинкам

#### `max images models list`

модели для картинок: какие скачаны и какая используется по умолчанию

```sh
max images models list [query]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | условия поле:значение; этот список пока ни по одному полю не фильтрует. |

#### `max images models download`

скачать модель для картинок один раз, со сверкой sha256, которую ожидает эта версия

**Меняет что-то только на этом компьютере.**

```sh
max images models download <model>
```

| Аргумент | | Что это |
|---|---|---|
| `model` | обязательный | ID модели из `images models list`. |

## `max metadata`

кешированные описания групп и каналов для локальных автоматических тегов

### `max metadata get`



```sh
max metadata get [options]
```

| Опция | Что делает |
|---|---|
| `--chat <chat>` | сохранённый чат. |

### `max metadata refresh`



**Меняет что-то только на этом компьютере.**

```sh
max metadata refresh [options]
```

| Опция | Что делает |
|---|---|
| `--chat <chat>` | сохранённая группа или канал; повторите параметр для нескольких. По умолчанию: ``. |
| `--only-missing` | только чаты без метаданных; без --chat — все сохранённые группы и каналы. |
| `--limit <number>` | обработать не более указанного числа чатов (1–500). По умолчанию: `50`. |

## `max search`

искать по тексту: один ресурс, если вы его знаете (messages, notes), либо search all по сообщениям и заметкам; почту ищет memo search mail

### `max search all`

искать сообщения мессенджера и заметки в локальном хранилище, сообщения — и на сервере мессенджера (--backend; заметки только локально), и расшифровки аккаунта встреч, если --source его называет, — лучшие совпадения первыми; не почту (memo search mail), не задачи, людей, записи памяти или проекты. Используйте, когда не знаете, где что-то написано; search messages или notes читает один вид со всеми его полями

```sh
max search all <query> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | обязательный | строгий запрос Lucene: слова, "фразы", AND/OR/NOT, группы полей и диапазоны дат. |

| Опция | Что делает |
|---|---|
| `--only <resources>` | только эти ресурсы через запятую: messages, notes; meetings, если --source называет аккаунт встреч. |
| `--source <accounts>` | только эти аккаунты через запятую: provider:account, как его показывает найденное, провайдер, вид или group:<name>; каждый ресурс читает аккаунты своего вида, а встречи — только если аккаунт встреч назван. |
| `--max-meetings <n>` | сколько встреч аккаунта встреч просмотреть, начиная с новых, или all — все (по умолчанию 100). |
| `--limit <n>` | сколько результатов. |
| `--page <n>` | какая страница, начиная с 1. |
| `--exact` | слова без поля и фразы в кавычках совпадают только в точной форме, как exact:word. |
| `--timezone <zone>` | часовой пояс IANA для границ календарных дат. |
| `--backend <archive\|server\|both>` | где искать: локальный архив, сервер мессенджера или оба (по умолчанию: both). Discovery читает только архив. |
| `--server-time <duration>` | прекратить ожидание ответа сервера через это время (по умолчанию: 5s). |

### `max search messages`

поиск сообщений мессенджера в локальном хранилище и на сервере мессенджера (--backend); по желанию загружает новые сообщения с --sync-first; --discover ищет только в архиве

```sh
max search messages [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | строгий запрос Lucene: слова, "фразы", AND/OR/NOT, группы полей и диапазоны дат; с --saved — ещё слова, присоединённые к нему через AND. |

| Опция | Что делает |
|---|---|
| `--sync-first` | сначала скачать новые сообщения в пределах чата, времени и числа сообщений. |
| `--max-chats <n>` | обновить не больше стольких чатов (по умолчанию: 5). |
| `--sync-time <duration>` | прекратить скачивание через это время (по умолчанию: 30s). |
| `--max-messages <n>` | скачать не больше стольких сообщений всего (по умолчанию: 500). |
| `--thread` | сохранённая цепочка ответов вместо соседних по времени сообщений; без графа — прежнее поведение. |
| `--thread-hops <n>` | не больше стольких связей от совпадения (по умолчанию: 8). |
| `--thread-messages <n>` | не больше стольких сообщений в контексте каждой ветки (по умолчанию: 50). |
| `--thread-bytes <n>` | не больше стольких байт целых сообщений и связей в каждом контексте (по умолчанию: 65536). |
| `--thread-within <duration>` | сообщения в пределах этого времени до и после совпадения (по умолчанию: 1d). |
| `--backend <archive\|server\|both>` | где искать: локальный архив, сервер мессенджера или оба (по умолчанию: both). Discovery читает только архив. |
| `--server-time <duration>` | прекратить ожидание ответа сервера через это время (по умолчанию: 5s). |
| `--source <accounts>` | каждый аккаунт этого мессенджера в хранилище; personal, bots или all — то же, что in: в запросе; или список: group:work,telegram:Alice. |
| `--limit <n>` | сколько результатов. |
| `--page <n>` | какая страница, начиная с 1. |
| `--newest` | сначала новые, а не лучшие совпадения. |
| `--exact` | слова без поля и фразы в кавычках совпадают только в точной форме, как exact:word; text: по-прежнему учитывает все словоформы. |
| `--context <n>` | messages before and after each hit; 2 in the terminal, 0 otherwise. |
| `--discover` | частичные совпадения слов и подходящие прямые ответы в локальном архиве; это свидетельства, а не подтверждённые ответы. |
| `--timezone <zone>` | часовой пояс IANA для границ календарных дат. |
| `--saved <name\|id>` | run a saved search or an earlier run; options typed here replace its own. |

### `max search notes`

поиск по заметкам — написанным в memo или импортированным из папки с заметками — по словам и, с локальной текстовой моделью, по смыслу; у каждого совпадения указано, что его нашло и на что оно ссылается

```sh
max search notes <query> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | обязательный | строгий запрос Lucene: слова, "фразы", AND/OR/NOT, tag:, source:internal (написаны в memo), source:file (из папки заметок) и диапазоны дат. |

| Опция | Что делает |
|---|---|
| `--source <accounts>` | только эти аккаунты заметок через запятую: notes:internal для заметок, написанных в memo, notes:<folder id>, как его показывает найденное, notes, documents или group:<name>. |
| `--filter <query>` | запрос, которому должно также соответствовать каждое совпадение; на поиск по смыслу он не влияет. |
| `--limit <n>` | сколько результатов. |
| `--page <n>` | какая страница, начиная с 1. |
| `--exact` | только слова в написанной форме; по смыслу не ищется. |
| `--timezone <zone>` | часовой пояс IANA для границ календарных дат. |

### `max search conversations`

the conversations nearest to a query in meaning and in words, best first, in one chat or every one — meaning after `conversations embed`; runs on this machine

```sh
max search conversations <query> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | обязательный | what to look for, in your own words, in any language the model reads. |

| Опция | Что делает |
|---|---|
| `--model <model>` | локально: ID модели из `models text list` (по умолчанию: e5-small); удалённо: модель провайдера. |
| `--provider <provider>` | провайдер векторов: local или openai; опции важнее настроек профиля. |
| `--base-url <url>` | сервер с /v1/embeddings как у OpenAI: Gemini, Jina или Ollama и LM Studio на этом компьютере. |
| `--dims <n>` | удалённо: размер вектора — нужен с --base-url; укорачивает вектор модели OpenAI. |
| `--max-chats <n>` | at most this many chats; 5 with --sync-first, 20 with --catch-up if not given. |
| `--max-chunks <n>` | at most this many chunks embedded in one run; 2000 if not given. |
| `--sync-first` | сначала скачать новые сообщения в пределах чата, времени и числа сообщений. |
| `--sync-time <duration>` | прекратить скачивание через это время (по умолчанию: 30s). |
| `--max-messages <n>` | скачать не больше стольких сообщений всего (по умолчанию: 500). |
| `--chat <chat>` | только этот чат: его ID или часть названия. |
| `--since-time <time>` | only those still going at this ISO 8601 time, or 30m / 2h / 1d ago, or later. |
| `--filter <query>` | strict Lucene filter: any message in a conversation must match; does not change the meaning query. |
| `--source <accounts>` | аккаунты для поиска: personal, bots, all, провайдер или список вроде group:work,telegram:Alice,email:me@example.com; по умолчанию активный аккаунт. |
| `--timezone <zone>` | IANA timezone for filter dates; system timezone by default. |
| `--limit <n>` | сколько результатов. |
| `--catch-up` | first build and embed, on this machine, the chats in scope that changed or were never built — within --max-chats and --max-chunks. |

## `max searches`

сохранённые поиски и история search messages и stats messages show в локальном хранилище; --saved выполняет один

### `max searches create`

сохранить поиск под именем, не выполняя его; search messages --saved <name> выполняет его

**Меняет что-то только на этом компьютере.**

```sh
max searches create <name> [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `name` | обязательный | up to 64 letters a–z, digits and hyphens, not only digits. |
| `query` | необязательный | запрос, как для search messages; без него подходят все сохранённые сообщения. |

| Опция | Что делает |
|---|---|
| `--chat <chat>` | только этот чат — то же, что chat: в запросе; чат: его ID или часть названия. |
| `--source <accounts>` | каждый аккаунт этого мессенджера в хранилище; personal, bots или all — то же, что in: в запросе; или список: group:work,telegram:Alice,email:me@example.com. |
| `--limit <n>` | сколько результатов. |
| `--newest` | сначала новые, а не лучшие совпадения. |
| `--exact` | слова без поля и фразы в кавычках совпадают только в точной форме, как exact:word; text: по-прежнему учитывает все словоформы. |
| `--context <n>` | messages before and after each hit. |
| `--timezone <zone>` | часовой пояс IANA для границ календарных дат. |
| `--by <chat\|sender\|day\|hour>` | по чему группирует подсчёт stats messages show --saved. |
| `--selection <json>` | сохранить полностью определённый исходный запрос рейтинга и параметры из детализации. |
| `--replace` | overwrite a saved search of the same name. |

### `max searches show`

one saved search or earlier run: its query, options and how often it ran

```sh
max searches show <name|id>
```

| Аргумент | | Что это |
|---|---|---|
| `name\|id` | обязательный | имя сохранённого поиска или ID любой строки истории searches. |

### `max searches list`

the saved searches, by name

```sh
max searches list [query]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | условия поле:значение; этот список пока ни по одному полю не фильтрует. |

### `max searches history`

the searches and counts that ran, newest first — saved ones included; never their results

```sh
max searches history [options]
```

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько показать. |
| `--page <n>` | какая страница, начиная с 1. |
| `--all` | все строки, без страниц. |

### `max searches delete`

delete a saved search, or one run from the history

**Меняет что-то только на этом компьютере.**

```sh
max searches delete <name|id>
```

| Аргумент | | Что это |
|---|---|---|
| `name\|id` | обязательный | имя сохранённого поиска или ID любой строки истории searches. |

### `max searches clear`

empty the history; saved searches stay

**Меняет что-то только на этом компьютере.**

```sh
max searches clear
```

## `max flood`

the waits MAX asked this profile to keep, and a hold on its writes

### `max flood clear`

забыть их, снять приостановку и ограничение темпа профиля, когда MAX больше не ограничивает аккаунт; на стороне MAX ничего не меняется

**Меняет что-то только на этом компьютере.**

```sh
max flood clear
```

## `max models`

models that run on this machine

### `max models audio`

speech models for transcribing voice messages

#### `max models audio list`

the speech models, most suitable first, which are downloaded, and which one is the default

```sh
max models audio list [query]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | условия поле:значение; этот список пока ни по одному полю не фильтрует. |

#### `max models audio download`

download a speech model once, checked against the sha256 this version expects

**Меняет что-то только на этом компьютере.**

```sh
max models audio download <model>
```

| Аргумент | | Что это |
|---|---|---|
| `model` | обязательный | a model id from `models audio list`. |

### `max models text`

embedding models for searching conversations by meaning

#### `max models text list`

the embedding models, most suitable first, which are downloaded, and which one is the default

```sh
max models text list [query]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | условия поле:значение; этот список пока ни по одному полю не фильтрует. |

#### `max models text download`

download an embedding model once, checked against the sha256 this version expects

**Меняет что-то только на этом компьютере.**

```sh
max models text download <model> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `model` | обязательный | a model id from `models text list`. |

| Опция | Что делает |
|---|---|
| `--accept-terms` | accept the model's licence terms, for a model that has its own. |

#### `max models text key`

API keys for embedding and analysis providers

#### `max models text key set`

store a key, typed at a hidden prompt or piped on stdin — never as an argument

**Меняет что-то только на этом компьютере.**

```sh
max models text key set <provider>
```

| Аргумент | | Что это |
|---|---|---|
| `provider` | обязательный | openai, anthropic, or the host of a --base-url server that wants a key. |

#### `max models text key remove`

forget a stored key

**Меняет что-то только на этом компьютере.**

```sh
max models text key remove <provider>
```

| Аргумент | | Что это |
|---|---|---|
| `provider` | обязательный | openai, anthropic, or a server's host. |

## `max polls`

read a poll, vote in it, close your own, create one

### `max polls show`

a poll and its answer ids, as the message carries it now

```sh
max polls show <chat> <message>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `message` | обязательный | ID сообщения с опросом. |

### `max polls vote`

vote in a poll, or take your vote back; the others see it unless the poll is anonymous

**Меняет что-то в MAX.**

```sh
max polls vote <chat> <message> [answers] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `message` | обязательный | ID сообщения с опросом. |
| `answers` | необязательный | answer ids, as `polls show` prints them. |

| Опция | Что делает |
|---|---|
| `--retract` | take your vote back. |

### `max polls close`

close your own poll; nobody can vote after that, and it cannot be reopened

**Меняет что-то в MAX.**

```sh
max polls close <chat> <message>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `message` | обязательный | the id of your own message that carries the poll. |

### `max polls create`

send a poll to a chat, as a message of its own; public unless --anonymous

**Меняет что-то в MAX.**

```sh
max polls create <chat> <question> <answers> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `question` | обязательный | the question. |
| `answers` | обязательный | two answers or more. |

| Опция | Что делает |
|---|---|
| `--multiple` | people may pick several answers. |
| `--anonymous` | nobody sees who voted for what. |
| `--revote` | people may change their vote. |
| `--silent` | send without a notification. |
| `--send-as <id>` | публиковать от имени одной из сущностей в списке `chats send-as`; обязательно, если чат по умолчанию публикует от другого имени. |
| `--operation-id <id>` | повторить создание с неизвестным исходом, не рискуя вторым опросом. |

## `max reactions`

react to messages

### `max reactions add`

put your reaction on a message; it replaces the one you had

**Меняет что-то в MAX.**

```sh
max reactions add <chat> <message> <emoji>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `message` | обязательный | ID сообщения. |
| `emoji` | обязательный | one emoji, for example 👍. |

### `max reactions remove`

take your reaction off a message

**Меняет что-то в MAX.**

```sh
max reactions remove <chat> <message>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | чат: его ID или часть названия. |
| `message` | обязательный | ID сообщения. |

## `max recipients`

the chats this profile may send to, when the list is on

### `max recipients list`

the chats on the list; empty and off until the first add

```sh
max recipients list
```

### `max recipients add`

allow sending to this chat; the first add turns the list on

**Меняет что-то только на этом компьютере.**

```sh
max recipients add <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата или часть названия. |

### `max recipients remove`

stop allowing this chat; the list stays on

**Меняет что-то только на этом компьютере.**

```sh
max recipients remove <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | chat id, or the title as the list shows it. |

### `max recipients clear`

empty the list and turn it off: this profile may send to any chat again

**Меняет что-то только на этом компьютере.**

```sh
max recipients clear
```

## `max sends`

every attempt to send from this profile — never the text

### `max sends list`

attempts to send, newest first: sent, refused, failed, or not known

```sh
max sends list [options]
```

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько показать. |
| `--page <n>` | какая страница, начиная с 1. |
| `--all` | все строки, без страниц. |

## `max inbox`

other people's unread messages in every chat; --new for what arrived since the last check

```sh
max inbox [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | с какого момента: date>2h, date>2026-10-01; сохранённая точка не сдвигается. |

| Опция | Что делает |
|---|---|
| `--new` | what arrived since the last check, each message once — for scheduled runs. |
| `--limit <n>` | at most this many per chat, the newest. |
| `--all` | muted and archived chats too — left out unless they mention you or reply to you. |
| `--kind <kinds>` | only chats of these kinds, comma-separated: dialog, group, channel, saved. |
| `--transcribe` | turn voice messages not heard yet into text — by the messenger where it can, else by a model on this machine; can take minutes. |
| `--model <id>` | which downloaded speech model hears them, with --transcribe; `models audio list` shows them. |
| `--mark-read` | also mark each chat shown read, up to the newest message shown; the other side sees it. |
| `--no-mark-read` | do not, whatever the catch_up_marks_read setting says. |

## `max review`

every message, yours too, in chats that changed since a point — for reviewing who owes what

```sh
max review [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | где закончился прошлый обзор и какой чат: date>2h, chat:"Book club"; без даты — 3 дня назад. |

| Опция | Что делает |
|---|---|
| `--kind <kinds>` | only chats of these kinds, comma-separated: dialog, group, channel, saved. |
| `--unanswered [duration]` | only questions to you or a group's admins that nobody answered, asked at least this long ago — 4h, 1d; 24h if not given. |
| `--all` | muted and archived chats too — left out unless they mention you or reply to you. |
| `--transcribe` | turn voice messages not heard yet into text — by the messenger where it can, else by a model on this machine; can take minutes. |
| `--model <id>` | which downloaded speech model hears them, with --transcribe; `models audio list` shows them. |
| `--new` | what changed since the last `review --new`, a point per chat — for scheduled runs. |
| `--mark-read` | also mark each chat shown read, up to the newest message shown; the other side sees it. |
| `--no-mark-read` | do not, whatever the catch_up_marks_read setting says. |

## `max replies`

rules that answer messages for you, kept in a file of this profile

### `max replies add`

добавить правило с явно указанными значениями по умолчанию; выключено, пока вы не отредактируете и не включите его

**Меняет что-то только на этом компьютере.**

```sh
max replies add <id>
```

| Аргумент | | Что это |
|---|---|---|
| `id` | обязательный | строчные буквы, цифры и -; уникален в этом профиле. |

### `max replies on`

включить одно правило ответа; его шаблон должен быть готов

**Меняет что-то только на этом компьютере.**

```sh
max replies on <id>
```

| Аргумент | | Что это |
|---|---|---|
| `id` | обязательный | ID правила. |

### `max replies off`

отключить одно правило ответа

**Меняет что-то только на этом компьютере.**

```sh
max replies off <id>
```

| Аргумент | | Что это |
|---|---|---|
| `id` | обязательный | ID правила. |

### `max replies edit`

изменить только указанные поля правила ответа; списки заменяются целиком

**Меняет что-то только на этом компьютере.**

```sh
max replies edit <id> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `id` | обязательный | ID правила. |

| Опция | Что делает |
|---|---|
| `--do <actions>` | действия: reply, task или оба через запятую. |
| `--kinds <kinds>` | типы чатов: dialog, group; через запятую, пустое значение — любые. |
| `--allow-chats <ids>` | только эти идентификаторы чатов через запятую; пустое значение — любые. |
| `--deny-chats <ids>` | исключить эти идентификаторы чатов через запятую; пустое значение очищает список. |
| `--words <words>` | совпадение с любым из этих целых слов через запятую; пустое значение очищает список. |
| `--question` | совпадать только с вопросами. |
| `--no-question` | не требовать вопроса. |
| `--mentions-me` | требовать упоминания вас или ответа на ваше сообщение. |
| `--no-mentions-me` | не требовать упоминания вас или ответа на ваше сообщение. |
| `--allow-people <ids>` | только эти идентификаторы отправителей через запятую; пустое значение — любые. |
| `--deny-people <ids>` | исключить эти идентификаторы отправителей через запятую; пустое значение очищает список. |
| `--contacts-only` | совпадать только с контактами. |
| `--no-contacts-only` | не требовать, чтобы отправитель был контактом. |
| `--template <text>` | шаблон ответа. |
| `--model <mode>` | устаревший режим шаблона: fill-only или may-reword; вместо него используйте блоки ai. |
| `--as-reply` | отправить как ответ на совпавшее сообщение. |
| `--no-as-reply` | отправить без привязки к совпавшему сообщению. |
| `--per-chat <limit>` | не более указанного числа на чат, например 1/12h. |
| `--per-person <limit>` | не более указанного числа на человека, например 1/1d. |
| `--outside <hours>` | отвечать вне этого интервала в 24-часовом формате, например 09:00-19:00. |
| `--days <days>` | дни рабочего интервала, например mon-fri или sat,sun. |
| `--timezone <zone>` | часовой пояс IANA для рабочего интервала. |
| `--no-hours` | очистить рабочий интервал. |

### `max replies audience`

показать аудиторию автоответов — кому могут отвечать правила — или заменить указанные поля; новый файл разрешает ответы всем, кто подходит под правило

**Меняет что-то только на этом компьютере.**

```sh
max replies audience [options]
```

| Опция | Что делает |
|---|---|
| `--reply <mode>` | отвечать всем или только указанным отправителям и чатам: all, listed. |
| `--allow-people <ids>` | заменить разрешённые идентификаторы отправителей через запятую; пустое значение очищает список. |
| `--allow-chats <ids>` | заменить разрешённые идентификаторы чатов через запятую; пустое значение очищает список. |
| `--deny-people <ids>` | заменить запрещённые идентификаторы отправителей через запятую; пустое значение очищает список; запрет имеет приоритет. |
| `--deny-chats <ids>` | заменить запрещённые идентификаторы чатов через запятую; пустое значение очищает список; запрет имеет приоритет. |

### `max replies consents`

согласие на модели ответа один раз для каждого профиля и адреса API, с исключениями для чатов

#### `max replies consents show`

показать согласие на модель ответа и исключения чатов; никогда не вызывает модель

```sh
max replies consents show
```

#### `max replies consents grant`

разрешить передачу входящих данных сообщений настроенной модели ответа этого профиля; исключения чатов сохраняются

**Меняет что-то только на этом компьютере.**

```sh
max replies consents grant
```

#### `max replies consents revoke`

немедленно отозвать согласие профиля на модель ответа; исключения чатов сохраняются

**Меняет что-то только на этом компьютере.**

```sh
max replies consents revoke
```

#### `max replies consents deny`

не передавать входящие данные этого чата модели ответа

**Меняет что-то только на этом компьютере.**

```sh
max replies consents deny <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата в мессенджере, используется как указан; никогда не определяется через сеть. |

#### `max replies consents allow`

снять исключение этого чата из обработки моделью; не даёт согласия за профиль

**Меняет что-то только на этом компьютере.**

```sh
max replies consents allow <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата в мессенджере, используется как указан; никогда не определяется через сеть. |

### `max replies test`

what the rules would have answered in the stored messages, to whom and why — sends nothing, changes nothing, never connects

```sh
max replies test [rule] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `rule` | необязательный | only this rule, by its id; every rule in file order if not given. |

| Опция | Что делает |
|---|---|
| `--since-time <time>` | from this ISO 8601 time, or 2h / 1d ago; 7d ago if not given. |
| `--ai` | вызвать настроенную модель ответа с сохранёнными данными сообщений; требуется согласие на использование модели ответа, иначе применяется запасной вариант. |

### `max replies pause`

stop every reply rule of this profile at once, a running serve too; resume undoes it

**Меняет что-то только на этом компьютере.**

```sh
max replies pause
```

### `max replies resume`

let the reply rules answer again after pause

**Меняет что-то только на этом компьютере.**

```sh
max replies resume
```

### `max replies status`

whether the rules may send, which are on, and who they may answer

```sh
max replies status
```

## `max serve`

stay connected to MAX and stream new messages to `max watch`, until Ctrl-C

**Меняет что-то в MAX.**

```sh
max serve [options]
```

| Опция | Что делает |
|---|---|
| `--idle <duration>` | stop after this long with nobody using it — 15m, 1h is 60m. |
| `--max-subscriber-buffer-bytes <bytes>` | буфер на одного наблюдателя, после которого его отключают; 0 — без ограничения. |
| `--max-subscriber-total-buffer-bytes <bytes>` | общий бюджет буферов всех наблюдателей; 0 — без ограничения. |

## `max server`

`max serve` in the background: start, stop, restart, status, logs; install adds a systemd or launchd unit

### `max server start`

start serve in the background — through the unit if one is installed — and answer once it connects

**Меняет что-то только на этом компьютере.**

```sh
max server start [options]
```

| Опция | Что делает |
|---|---|
| `--idle <duration>` | остановиться, если им никто не пользуется столько времени — 15m, 1h. |

### `max server stop`

stop this profile's serve — through the unit if it runs under one

**Меняет что-то только на этом компьютере.**

```sh
max server stop
```

### `max server restart`

stop it and start it again

**Меняет что-то только на этом компьютере.**

```sh
max server restart [options]
```

| Опция | Что делает |
|---|---|
| `--idle <duration>` | остановиться, если им никто не пользуется столько времени — 15m, 1h. |

### `max server status`

whether serve runs for this profile, since when, who started it, and the unit if there is one

```sh
max server status
```

### `max server logs`

serve's latest log lines — from the journal under systemd, else its log file

```sh
max server logs [options]
```

| Опция | Что делает |
|---|---|
| `-n, --limit <n>` | how many lines. По умолчанию: `50`. |

### `max server install`

write a systemd user unit or a launchd agent for this profile; starts nothing

**Меняет что-то только на этом компьютере.**

```sh
max server install
```

### `max server uninstall`

remove this profile's unit; stop it first

**Меняет что-то только на этом компьютере.**

```sh
max server uninstall
```

## `max schedule`

запускать команду max или агента позже или по расписанию (systemd, launchd, Планировщик заданий); агент не может отправлять

### `max schedule command`

запускать max <args…> по таймеру — чтение сохраняет прочитанное, так история чата наполняет хранилище

**Меняет что-то только на этом компьютере.**

```sh
max schedule command <name> <args> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `name` | обязательный | строчные буквы, цифры и дефисы. |
| `args` | обязательный | команда max после имени расписания, например -- messages list <chat> --limit 50. |

| Опция | Что делает |
|---|---|
| `--every <duration>` | повторять: 30m, 2h, 1d. |
| `--at <HH:MM>` | каждый день в это местное время. |
| `--at-time <time>` | один запуск: через 30m, 2d или во время ISO; после него расписание удаляется само. |

### `max schedule agent`

запускать агента (claude или codex) с заданием по таймеру; он работает с MAX_READ_ONLY=1, поэтому читает и готовит черновики, но не может отправлять, — ответ сохраняется, и приходит уведомление

**Меняет что-то только на этом компьютере.**

```sh
max schedule agent <name> <harness> <prompt> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `name` | обязательный | строчные буквы, цифры и дефисы. |
| `harness` | обязательный | какого агента запустить. Одно из: `claude`, `codex`. |
| `prompt` | обязательный | что делать, например "run the daily follow-up review: max skill show follow-ups". |

| Опция | Что делает |
|---|---|
| `--max-cost <usd>` | только claude: остановить запуск, который стоит больше этого, в долларах США. |
| `--every <duration>` | повторять: 30m, 2h, 1d. |
| `--at <HH:MM>` | каждый день в это местное время. |
| `--at-time <time>` | один запуск: через 30m, 2d или во время ISO; после него расписание удаляется само. |

### `max schedule list`

расписания: когда они запускаются и как прошёл последний запуск

```sh
max schedule list
```

### `max schedule run`

выполнить расписание сейчас, как это сделал бы его таймер, и дождаться окончания

**Меняет что-то в MAX.**

```sh
max schedule run <name>
```

| Аргумент | | Что это |
|---|---|---|
| `name` | обязательный |  |

### `max schedule remove`

остановить расписание и удалить его таймер; прежние результаты остаются

**Меняет что-то только на этом компьютере.**

```sh
max schedule remove <name>
```

| Аргумент | | Что это |
|---|---|---|
| `name` | обязательный |  |

### `max schedule exec`

то, что запускает таймер по файлу расписания; чтобы запустить вручную, используйте run

**Меняет что-то в MAX.**

```sh
max schedule exec <file>
```

| Аргумент | | Что это |
|---|---|---|
| `file` | обязательный |  |

## `max watch`

print new messages as they arrive, from a running `max serve`

```sh
max watch [options]
```

| Опция | Что делает |
|---|---|
| `--events` | также выводить правки, удаления, реакции, прочтения и изменения чатов; каждая строка содержит вид события. |

## `max config`

the settings in force, and where each one came from

### `max config show`

the profile, the profiles that exist, and each setting with where it came from

```sh
max config show [options]
```

| Опция | Что делает |
|---|---|
| `--bot` | the settings a bot command on this profile gets, rather than the personal account's. |

### `max config set`

save a setting to the configuration file

**Меняет что-то только на этом компьютере.**

```sh
max config set <setting> <value> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `setting` | обязательный | одно из: limit, timeout_ms, color, record, keep_runs_for_days, permissions, sends_per_hour, requests_per_minute, embedding_provider, embedding_model, embedding_base_url, embedding_dims, analysis_provider, analysis_model, analysis_base_url, models, sender_colors, catch_up_marks_read, search_catch_up, serve, read_other_bots, update_check, skill_hint, transcribe_model, default_profile, search_stemmers.cyrillic, search_stemmers.latin, phone_countries, task_categories.<name>, task_agent_close, task_agent_close_min, task_first_pass_per_chat. |
| `value` | обязательный | число, true или false либо список вроде contacts,polls. |

| Опция | Что делает |
|---|---|
| `--defaults` | изменить значение для всех профилей, а не только для этого. |
| `--personal` | только для личных аккаунтов — раздел personal в файле. |
| `--bot` | только для ботов — раздел bot в файле. |

### `max config unset`

remove a setting from the configuration file

**Меняет что-то только на этом компьютере.**

```sh
max config unset <setting> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `setting` | обязательный | одно из: limit, timeout_ms, color, record, keep_runs_for_days, permissions, sends_per_hour, requests_per_minute, embedding_provider, embedding_model, embedding_base_url, embedding_dims, analysis_provider, analysis_model, analysis_base_url, models, sender_colors, catch_up_marks_read, search_catch_up, serve, read_other_bots, update_check, skill_hint, transcribe_model, default_profile, search_stemmers.cyrillic, search_stemmers.latin, phone_countries, task_categories.<name>, task_agent_close, task_agent_close_min, task_first_pass_per_chat. |

| Опция | Что делает |
|---|---|
| `--defaults` | изменить значение для всех профилей, а не только для этого. |
| `--personal` | только для личных аккаунтов — раздел personal в файле. |
| `--bot` | только для ботов — раздел bot в файле. |

## `max doctor`

the state this installation is in, without contacting MAX unless --online

```sh
max doctor [options]
```

| Опция | Что делает |
|---|---|
| `--online` | also log in once, read one chat and start the MCP server; sends nothing. |

### `max doctor report`

what a problem report holds and where it goes; writes nothing

#### `max doctor report create`

write a problem report to a file, and print how to send it

**Меняет что-то только на этом компьютере.**

```sh
max doctor report create [options]
```

| Опция | Что делает |
|---|---|
| `--run <id>` | the run the report is about; the newest failed one if not given. |
| `--output <file>` | where to write it; a new file in this directory if not given. |

## `max runs`

recorded runs — what this tool did, and when

### `max runs list`

recorded runs, newest first

```sh
max runs list [options]
```

| Опция | Что делает |
|---|---|
| `--limit <n>` | how many to show. По умолчанию: `20`. |
| `--page <n>` | какая страница, начиная с 1. По умолчанию: `1`. |

### `max runs show`

один запуск: что это было, чем закончилось и все записанные события

```sh
max runs show <run-id> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `run-id` | обязательный | ID из `max runs list`. |

| Опция | Что делает |
|---|---|
| `--problems` | только неудачные ответы, предупреждения и сбои. |

### `max runs search`

search recorded diagnostic metadata and events; no message contents

```sh
max runs search [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | case-insensitive literal diagnostic text. |

| Опция | Что делает |
|---|---|
| `--status <status>` | run outcome. Одно из: `success`, `failed`, `partial`, `running`. |
| `--error-code <code>` | one stable error code. |
| `--operation <name>` | one operation, such as messages.download. |
| `--profile <name>` | one recorded profile. |
| `--since-time <time>` | runs starting on or after an ISO time or 2h / 1d ago. |
| `--limit <n>` | matches per page, at most 100. По умолчанию: `20`. |
| `--page <n>` | result page. По умолчанию: `1`. |

### `max runs path`

the directory holding one run

```sh
max runs path <run-id>
```

| Аргумент | | Что это |
|---|---|---|
| `run-id` | обязательный | ID из `max runs list`. |

## `max skill`

the instructions an agent is given for this tool

### `max skill show`

print SKILL.md — `max skill install` puts it where Claude Code, Codex and Gemini CLI look for it

```sh
max skill show [name]
```

| Аргумент | | Что это |
|---|---|---|
| `name` | необязательный | один из навыков для задачи, которые идут в комплекте: follow-ups, link-conversations. |

### `max skill install`

write SKILL.md to \~/.claude/skills/max-cli/ (Claude Code) and \~/.agents/skills/max-cli/ (Codex, Gemini CLI)

**Меняет что-то только на этом компьютере.**

```sh
max skill install [options]
```

| Опция | Что делает |
|---|---|
| `--for <agents>` | which agents to install for. Одно из: `claude`, `agents`, `all`. По умолчанию: `all`. |

## `max commands`

commands, options and exit codes as JSON — inspect one command path per call

### `max commands schema`

argv и схемы результатов одной команды, эффекты, разрешения и указания по повторным попыткам

```sh
max commands schema <path>
```

| Аргумент | | Что это |
|---|---|---|
| `path` | обязательный | один путь команды, например: stats messages show. |

## `max upgrade`

upgrade max with the package manager that installed it; --check only looks

**Меняет что-то только на этом компьютере.**

```sh
max upgrade [options]
```

| Опция | Что делает |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |

## `max complete`

shell completion: `max complete zsh` prints the script to source

```sh
max complete [words]
```

| Аргумент | | Что это |
|---|---|---|
| `words` | необязательный |  |

## `max mcp`

serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add max -- max mcp`

**Меняет что-то в MAX.**

```sh
max mcp [options]
```

| Опция | Что делает |
|---|---|
| `--permission <key=level>` | ужесточить разрешение только для этого сервера, например messages.send=deny; права профиля никогда не ослабляет; повторите для нескольких ключей. |
| `--http` | предоставлять HTTP-сервер на 127.0.0.1 для ChatGPT и Claude в браузере через ваш туннель; действуют права профиля. |
| `--port <port>` | the local port for --http (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net. |
| `--revoke` | forget every login given to a browser app; each must log in again. |

### `max mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
max mcp config [options]
```

| Опция | Что делает |
|---|---|
| `--permission <key=level>` | ужесточить разрешение только для этого сервера, например messages.send=deny; права профиля никогда не ослабляет; повторите для нескольких ключей. |

### `max mcp setup`

add this profile's local MCP server to Codex or Claude Code

**Меняет что-то только на этом компьютере.**

```sh
max mcp setup <client> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `client` | обязательный | codex or claude-code. |

| Опция | Что делает |
|---|---|
| `--allow-writes` | acknowledge that this profile offers writing tools. |
| `--permission <key=level>` | ужесточить разрешение только для этого сервера, например messages.send=deny; права профиля никогда не ослабляет; повторите для нескольких ключей. |

### `max mcp doctor`

check this profile's local MCP handshake and tool list

```sh
max mcp doctor [options]
```

| Опция | Что делает |
|---|---|
| `--permission <key=level>` | ужесточить разрешение только для этого сервера, например messages.send=deny; права профиля никогда не ослабляет; повторите для нескольких ключей. |

## `max bot`

a MAX bot, through the official Bot API and a bot token — not your personal account

### `max bot auth`

the bot token this profile uses

#### `max bot auth set`

check a bot token with MAX, then keep it — typed at a hidden prompt or piped on stdin

**Меняет что-то только на этом компьютере.**

```sh
max bot auth set
```

#### `max bot auth show`

where this profile's bot token comes from, and which bot it is

```sh
max bot auth show
```

#### `max bot auth remove`

forget this profile's bot token

**Меняет что-то только на этом компьютере.**

```sh
max bot auth remove
```

### `max bot list`

every name on this machine that has a bot token; --check asks MAX which bot each is

```sh
max bot list [options]
```

| Опция | Что делает |
|---|---|
| `--check` | ask the messenger who each bot is, with its token. |

### `max bot chats`

the chats this bot is in — MAX gives a bot no list of them, so `list` shows the ones it has seen

#### `max bot chats list`

chats this bot has seen on this machine — not a complete list from MAX

```sh
max bot chats list
```

#### `max bot chats show`

one chat from MAX, and remember it

```sh
max bot chats show <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата, user:<id> для человека или название чата, который видел этот бот. |

#### `max bot chats leave`

take the bot out of a chat; only an admin of the chat can bring it back

**Меняет что-то в MAX.**

```sh
max bot chats leave <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата или название чата, который видел этот бот. |

#### `max bot chats action`

show what the bot is doing in a chat — typing, sending a photo — for a few seconds

**Меняет что-то в MAX.**

```sh
max bot chats action <chat> <action>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата, user:<id> для человека или название чата, который видел этот бот. |
| `action` | обязательный | what the chat sees. Одно из: `typing`, `photo`, `video`, `voice`, `file`. |

#### `max bot chats admins`

the admins of a chat the bot is an admin in

#### `max bot chats admins list`

the chat's admins and what each may do

```sh
max bot chats admins list <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата или название чата, который видел этот бот. |

#### `max bot chats admins add`

make a member an admin with these rights

**Меняет что-то в MAX.**

```sh
max bot chats admins add <chat> <person> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата или название чата, который видел этот бот. |
| `person` | обязательный | ID пользователя. |

| Опция | Что делает |
|---|---|
| `--can <rights>` | what they may do, comma-separated: read, members, admins, info, pin, link, edit, delete. |
| `--title <title>` | the title shown beside their name. |

#### `max bot chats admins remove`

take an admin's rights back; they stay a member

**Меняет что-то в MAX.**

```sh
max bot chats admins remove <chat> <person>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата или название чата, который видел этот бот. |
| `person` | обязательный | ID пользователя. |

#### `max bot chats members`

the people in a chat the bot is an admin in

#### `max bot chats members remove`

take a person out of a chat; their messages stay

**Меняет что-то в MAX.**

```sh
max bot chats members remove <chat> <person> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата или название чата, который видел этот бот. |
| `person` | обязательный | ID пользователя. |

| Опция | Что делает |
|---|---|
| `--block` | also keep them from coming back by the chat's link. |

#### `max bot chats members list`

участники чата, по странице за раз — --cursor берёт `page.next_cursor`, который вернула прошлая страница

```sh
max bot chats members list <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный |  |

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько, до 100. |
| `--cursor <cursor>` | продолжить отсюда. |

#### `max bot chats members add`

добавить людей в чат по ID пользователя, не больше 100; бот должен быть администратором с правом добавлять участников

**Меняет что-то в MAX.**

```sh
max bot chats members add <chat> <users>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный |  |
| `users` | обязательный |  |

#### `max bot chats rules`

a chat's moderation rules for this bot, kept on this machine

#### `max bot chats rules show`

the chat's rules; the defaults, marked not saved, if it has none yet

```sh
max bot chats rules show <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID группы или название группы, которую видел этот бот. |

#### `max bot chats rules set`

change one rule — trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove

**Меняет что-то только на этом компьютере.**

```sh
max bot chats rules set <chat> <key> <value>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID группы или название группы, которую видел этот бот. |
| `key` | обязательный | правило. |
| `value` | обязательный | its new value. |

#### `max bot chats rules unset`

put one rule back to its default

**Меняет что-то только на этом компьютере.**

```sh
max bot chats rules unset <chat> <key>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID группы или название группы, которую видел этот бот. |
| `key` | обязательный | правило. |

#### `max bot chats moderate`

judge a group's new messages and joins by its rules, and act as they allow — as the bot

**Меняет что-то в MAX.**

```sh
max bot chats moderate <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID группы или название группы, которую видел этот бот. |

| Опция | Что делает |
|---|---|
| `--since-time <time>` | judge what came after this ISO 8601 time, or 2h / 1d ago; the saved point stays. |
| `--dry-run` | оценить и составить план; ничего не делать. |
| `--allow-dangerous` | yes to every action whose level in the group's rules is ask. |
| `--no-block` | remove without banning; by default a removed person cannot come back by the link. |
| `--max-actions <n>` | не больше стольких действий за один запуск; если не указано — 10. |

### `max bot messages`

the messages in the chats this bot is in

#### `max bot messages send`

send a message as the bot; without [text], the text is read from stdin

**Меняет что-то в MAX.**

```sh
max bot messages send <chat> [text] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата, user:<id> для человека или название чата, который видел этот бот. |
| `text` | необязательный | сообщение. |

| Опция | Что делает |
|---|---|
| `--reply-to <message>` | answer this message, by its id in the same chat. |
| `--silent` | доставить без уведомления. |
| `--md` | читать текст как Markdown этого мессенджера; поддерживаемый синтаксис — в его руководстве по форматированию. |
| `--html` | the text is HTML: <b>, <i>, <a href>, <code>. |
| `--file <file>` | attach a file; the text becomes its caption. |
| `--photo <file>` | attach a .jpg, .png or .webp as a photo; the text becomes its caption. |
| `--as-file` | send the --file as a file to download, a video included. |
| `--voice <file>` | send an Ogg Opus file as a voice message, alone, with no text. |
| `--allow-any-file` | отправить файл даже из папки с учётными данными или собственной папки CLI. |

#### `max bot messages list`

the latest messages in a chat; where MAX gives a bot no history, and with --offline, the ones this bot has seen on this machine

```sh
max bot messages list <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата, user:<id> для человека или название чата, который видел этот бот. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | how many, the newest. |

#### `max bot messages show`

one message by its id in a chat

```sh
max bot messages show <chat> <message>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата, user:<id> для человека или название чата, который видел этот бот. |
| `message` | обязательный | ID сообщения. |

#### `max bot messages edit`

replace the text of a message the bot sent

**Меняет что-то в MAX.**

```sh
max bot messages edit <chat> <message> <text> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата, user:<id> для человека или название чата, который видел этот бот. |
| `message` | обязательный | ID сообщения. |
| `text` | обязательный | the new text. |

| Опция | Что делает |
|---|---|
| `--md` | читать текст как Markdown этого мессенджера; поддерживаемый синтаксис — в его руководстве по форматированию. |
| `--html` | the text is HTML: <b>, <i>, <a href>, <code>. |

#### `max bot messages delete`

delete messages in a chat the bot can delete in; it cannot be undone

**Меняет что-то в MAX.**

```sh
max bot messages delete <chat> <messages> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата, user:<id> для человека или название чата, который видел этот бот. |
| `messages` | обязательный | message ids. |

| Опция | Что делает |
|---|---|
| `--allow-dangerous` | delete without asking. |

#### `max bot messages pin`

pin a message in a chat; quietly unless --notify

**Меняет что-то в MAX.**

```sh
max bot messages pin <chat> <message> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата, user:<id> для человека или название чата, который видел этот бот. |
| `message` | обязательный | ID сообщения. |

| Опция | Что делает |
|---|---|
| `--notify` | tell the chat's members. |

#### `max bot messages unpin`

unpin a message in a chat

**Меняет что-то в MAX.**

```sh
max bot messages unpin <chat> <message>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата, user:<id> для человека или название чата, который видел этот бот. |
| `message` | обязательный | ID сообщения. |

#### `max bot messages between`

what two or more people wrote in the chats they have all written in — from the local copy, grouped by chat, oldest first; --limit counts per chat. Common chats are the ones this copy saw each of them write in, not a member list from MAX

```sh
max bot messages between <people> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `people` | обязательный | two or more people — an id, @username or part of a name each. |

| Опция | Что делает |
|---|---|
| `--all-bots` | также читать копии всех других ботов на этом компьютере, которые разрешает read_other_bots. |
| `--bots <profiles>` | также читать копии этих ботов, через запятую — каждый должен быть разрешён в read_other_bots. |
| `--limit <n>` | how many of the latest messages from each chat. |

### `max bot search`

поиск по тексту в локальной копии этого бота

#### `max bot search messages`

искать сообщения, которые этот бот прочитал, отправил или получил на этом компьютере, — только локальная копия, лучшие совпадения первыми; запрос Lucene: каждое слово должно встретиться; "фраза", -слово, a OR b, from: chat: date: has:; по тексту, по --from или по обоим

```sh
max bot search messages [query] [options]
```

| Аргумент | | Что это |
|---|---|---|
| `query` | необязательный | the words to find. |

| Опция | Что делает |
|---|---|
| `--all-bots` | также читать копии всех других ботов на этом компьютере, которые разрешает read_other_bots. |
| `--bots <profiles>` | также читать копии этих ботов, через запятую — каждый должен быть разрешён в read_other_bots. |
| `--limit <n>` | сколько результатов. |
| `--page <n>` | какая страница, начиная с 1. |
| `--newest` | сначала новые, а не лучшие совпадения. |
| `--from <who>` | only what this person wrote — an id, @username or part of a name; repeat it for any of several. |

### `max bot recipients`

the chats this bot may write to; with no list, every chat — `clear` removes the list

#### `max bot recipients list`

the chats on the list, or nothing when there is no list

```sh
max bot recipients list
```

#### `max bot recipients add`

allow a chat: its id, `user:<id>`, or the title of a chat this bot has seen

**Меняет что-то только на этом компьютере.**

```sh
max bot recipients add <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный |  |

#### `max bot recipients remove`

take a chat off the list

**Меняет что-то только на этом компьютере.**

```sh
max bot recipients remove <chat>
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный |  |

#### `max bot recipients clear`

remove the list: the bot may write to any chat again

**Меняет что-то только на этом компьютере.**

```sh
max bot recipients clear
```

### `max bot sends`

what this bot sent, edited and deleted from this machine — ids and outcomes, never text

#### `max bot sends list`



```sh
max bot sends list
```

### `max bot watch`

print new messages as they arrive and keep them, until Ctrl-C or --timeout (either ends it normally)

**Меняет что-то в MAX.**

```sh
max bot watch [options]
```

| Опция | Что делает |
|---|---|
| `--events` | also edits, deletions, buttons pressed and people coming and going; every line names its event. |
| `--types <types>` | only these update types, comma-separated, in the messenger's words. |

### `max bot callbacks`

answers to the buttons people press under the bot's messages

#### `max bot callbacks answer`

answer a pressed button by its callback id: --notification shows the person a one-time note, --text replaces the message the button was on

**Меняет что-то в MAX.**

```sh
max bot callbacks answer <callback> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `callback` | обязательный | the callback id `bot watch` printed. |

| Опция | Что делает |
|---|---|
| `--text <text>` | the message's new text. |
| `--notification <text>` | a note only the person who pressed sees. |

### `max bot commands`

the bot's command menu — what people see after /

#### `max bot commands list`

the commands in the menu now

```sh
max bot commands list
```

#### `max bot commands set`

replace the whole menu: each command as name=description, e.g. start=Begin

**Меняет что-то в MAX.**

```sh
max bot commands set <commands>
```

| Аргумент | | Что это |
|---|---|---|
| `commands` | обязательный | name=description, one per command. |

#### `max bot commands clear`

empty the menu

**Меняет что-то в MAX.**

```sh
max bot commands clear
```

### `max bot webhooks`

where the messenger pushes this bot's updates — while one is set, `bot watch` gets nothing

#### `max bot webhooks list`

the webhooks this bot has

```sh
max bot webhooks list
```

#### `max bot webhooks set`

send this bot's updates to an HTTPS address; refused while another is set

**Меняет что-то в MAX.**

```sh
max bot webhooks set <url> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `url` | обязательный | the HTTPS address. |

| Опция | Что делает |
|---|---|
| `--types <types>` | only these update types, comma-separated, in the messenger's words. |
| `--secret-stdin` | a secret the messenger sends back with each update — asked for, or read from a pipe. |
| `--add` | keep the webhooks already set and add this one beside them. |

#### `max bot webhooks delete`

stop sending updates to this address; with none left, `bot watch` works again

**Меняет что-то в MAX.**

```sh
max bot webhooks delete <url>
```

| Аргумент | | Что это |
|---|---|---|
| `url` | обязательный | the address. |

### `max bot contacts`

people this bot has seen write — from the local copy on this machine, never asking MAX unless told to

#### `max bot contacts show`

one person: the chats they wrote in (with their last message there) and the latest messages of their private chat with the bot

```sh
max bot contacts show <who> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `who` | обязательный | an id, @username or part of a name. |

| Опция | Что делает |
|---|---|
| `--all-bots` | также читать копии всех других ботов на этом компьютере, которые разрешает read_other_bots. |
| `--bots <profiles>` | также читать копии этих ботов, через запятую — каждый должен быть разрешён в read_other_bots. |
| `--limit <n>` | how many messages from the private chat. |
| `--sync-first` | read the private chat with them again from the messenger first — one request. |

### `max bot store`

the bot's local copy on this machine

#### `max bot store fetch`

fetch a chat's history into the bot's local copy, newest first; run it again to continue

**Меняет что-то только на этом компьютере.**

```sh
max bot store fetch <chat> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `chat` | обязательный | ID чата или название чата, который видел этот бот. |

| Опция | Что делает |
|---|---|
| `--limit <n>` | at most this many messages in this run; 1000 if not given. |
| `--page-size <n>` | how many messages one request asks for; 100 if not given. |
| `--pause <duration>` | pause between pages, to stay under the messenger's limits. По умолчанию: `1s`. |
| `--since-time <time>` | stop once it reaches messages older than this: ISO 8601, or 2h / 1d ago. |
| `--last <n>` | stop once the newest n messages are held. |

### `max bot mcp`

предоставить бота агенту по MCP через stdin и stdout — `claude mcp add sales-bot -- max sales bot mcp`

#### `max bot mcp config`

показать запись mcpServers для Claude Desktop, Cursor и других с полными путями; ничего не записывает

```sh
max bot mcp config
```

### `max bot me`

the bot this profile's token belongs to: name, id, description, commands

```sh
max bot me
```

### `max bot comments`

comments under a channel post — each command takes the post's message id (mid.…) first

#### `max bot comments list`

the comments under a post, newest last

```sh
max bot comments list <message> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `message` | обязательный |  |

| Опция | Что делает |
|---|---|
| `--limit <n>` | сколько, до 100. |

#### `max bot comments get`

one comment under a post

```sh
max bot comments get <message> <comment>
```

| Аргумент | | Что это |
|---|---|---|
| `message` | обязательный |  |
| `comment` | обязательный |  |

#### `max bot comments send`

comment under a post as the bot; - reads stdin

**Меняет что-то в MAX.**

```sh
max bot comments send <message> <text> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `message` | обязательный |  |
| `text` | обязательный |  |

| Опция | Что делает |
|---|---|
| `--format <format>` | how the text is marked up. Одно из: `markdown`, `html`. |

#### `max bot comments edit`

replace the text of a comment the bot wrote; - reads stdin

**Меняет что-то в MAX.**

```sh
max bot comments edit <message> <comment> <text> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `message` | обязательный |  |
| `comment` | обязательный |  |
| `text` | обязательный |  |

| Опция | Что делает |
|---|---|
| `--format <format>` | how the text is marked up. Одно из: `markdown`, `html`. |

#### `max bot comments delete`

delete a comment under a post

**Меняет что-то в MAX.**

```sh
max bot comments delete <message> <comment> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `message` | обязательный |  |
| `comment` | обязательный |  |

| Опция | Что делает |
|---|---|
| `--allow-dangerous` | не спрашивать подтверждение для bot.messages.delete на уровне ask. |

### `max bot uploads`

files uploaded to MAX, to attach to a message

#### `max bot uploads put`

upload a file from disk and print the attachment to put in a message's `attachments` — `messages send --file` does both steps at once

**Меняет что-то в MAX.**

```sh
max bot uploads put <file> [options]
```

| Аргумент | | Что это |
|---|---|---|
| `file` | обязательный |  |

| Опция | Что делает |
|---|---|
| `--type <type>` | upload as this kind instead of guessing by extension. Одно из: `image`, `video`, `audio`, `file`. |
| `--allow-any-file` | upload a file even from credential folders or WireCat apps' folders. |

### `max bot api`

every operation of the official Bot API, generated from its schema — docs/dev/bot-api-coverage.md

```sh
max bot api [options]
```

| Опция | Что делает |
|---|---|
| `--store-token <profile>` | keep a returned authentication token only in this bot profile's OS keyring; never print it. |

#### `max bot api get-my-info`

Get current bot info — read (GET /me)

```sh
max bot api get-my-info
```

#### `max bot api edit-my-commands`

Edit current bot commands — write (PATCH /me/commands)

**Меняет что-то в MAX.**

```sh
max bot api edit-my-commands [options]
```

| Опция | Что делает |
|---|---|
| `--body <json>` | тело запроса в JSON; - читает его из stdin. |
| `--body-file <path>` | тело запроса из файла JSON; - означает stdin. |

#### `max bot api get-chat`

Get chat — read (GET /chats/{chatId})

```sh
max bot api get-chat [options]
```

| Опция | Что делает |
|---|---|
| `--chat-id <value>` | Requested chat or channel identifier. |

#### `max bot api edit-chat`

Edit chat or channel info — write (PATCH /chats/{chatId})

**Меняет что-то в MAX.**

```sh
max bot api edit-chat [options]
```

| Опция | Что делает |
|---|---|
| `--chat-id <value>` | ID чата или канала. |
| `--body <json>` | тело запроса в JSON; - читает его из stdin. |
| `--body-file <path>` | тело запроса из файла JSON; - означает stdin. |

#### `max bot api send-action`

Send action — write (POST /chats/{chatId}/actions)

**Меняет что-то в MAX.**

```sh
max bot api send-action [options]
```

| Опция | Что делает |
|---|---|
| `--chat-id <value>` | ID чата. |
| `--body <json>` | тело запроса в JSON; - читает его из stdin. |
| `--body-file <path>` | тело запроса из файла JSON; - означает stdin. |

#### `max bot api get-pinned-message`

Get pinned message — read (GET /chats/{chatId}/pin)

```sh
max bot api get-pinned-message [options]
```

| Опция | Что делает |
|---|---|
| `--chat-id <value>` | Chat identifier to get its pinned message. |

#### `max bot api pin-message`

Pin message — write (PUT /chats/{chatId}/pin)

**Меняет что-то в MAX.**

```sh
max bot api pin-message [options]
```

| Опция | Что делает |
|---|---|
| `--chat-id <value>` | Chat identifier where message should be pinned. |
| `--body <json>` | тело запроса в JSON; - читает его из stdin. |
| `--body-file <path>` | тело запроса из файла JSON; - означает stdin. |

#### `max bot api unpin-message`

Unpin message — write (DELETE /chats/{chatId}/pin)

**Меняет что-то в MAX.**

```sh
max bot api unpin-message [options]
```

| Опция | Что делает |
|---|---|
| `--chat-id <value>` | Chat identifier to remove pinned message. |

#### `max bot api get-membership`

Get chat or channel membership — read (GET /chats/{chatId}/members/me)

```sh
max bot api get-membership [options]
```

| Опция | Что делает |
|---|---|
| `--chat-id <value>` | ID чата или канала. |

#### `max bot api leave-chat`

Leave chat — destructive (DELETE /chats/{chatId}/members/me)

**Меняет что-то в MAX.**

```sh
max bot api leave-chat [options]
```

| Опция | Что делает |
|---|---|
| `--chat-id <value>` | ID чата или канала. |

#### `max bot api get-admins`

Get chat or channel admins — read (GET /chats/{chatId}/members/admins)

```sh
max bot api get-admins [options]
```

| Опция | Что делает |
|---|---|
| `--chat-id <value>` | ID чата или канала. |

#### `max bot api post-admins`

Set chat or channel admins — write (POST /chats/{chatId}/members/admins)

**Меняет что-то в MAX.**

```sh
max bot api post-admins [options]
```

| Опция | Что делает |
|---|---|
| `--chat-id <value>` | ID чата или канала. |
| `--body <json>` | тело запроса в JSON; - читает его из stdin. |
| `--body-file <path>` | тело запроса из файла JSON; - означает stdin. |

#### `max bot api delete-admins`

Revoke admin rights — write (DELETE /chats/{chatId}/members/admins/{userId})

**Меняет что-то в MAX.**

```sh
max bot api delete-admins [options]
```

| Опция | Что делает |
|---|---|
| `--chat-id <value>` | ID чата или канала. |
| `--user-id <value>` | User identifier. |

#### `max bot api get-members`

Get members — read (GET /chats/{chatId}/members)

```sh
max bot api get-members [options]
```

| Опция | Что делает |
|---|---|
| `--chat-id <value>` | ID чата или канала. |
| `--user-ids <value>` | Comma-separated list of users identifiers to get their membership. When this parameter is passed, both `count` and `marker` are ignored. |
| `--marker <value>` | Marker. |
| `--count <value>` | Count. |

#### `max bot api add-members`

Add members — write (POST /chats/{chatId}/members)

**Меняет что-то в MAX.**

```sh
max bot api add-members [options]
```

| Опция | Что делает |
|---|---|
| `--chat-id <value>` | ID чата. |
| `--body <json>` | тело запроса в JSON; - читает его из stdin. |
| `--body-file <path>` | тело запроса из файла JSON; - означает stdin. |

#### `max bot api remove-member`

Remove member — write (DELETE /chats/{chatId}/members)

**Меняет что-то в MAX.**

```sh
max bot api remove-member [options]
```

| Опция | Что делает |
|---|---|
| `--chat-id <value>` | ID чата или канала. |
| `--user-id <value>` | User id to remove from chat or channel. |
| `--block <value>` | Set to `true` if user should be blocked in chat. |

#### `max bot api get-subscriptions`

Get subscriptions — read (GET /subscriptions)

```sh
max bot api get-subscriptions
```

#### `max bot api subscribe`

Subscribe — write (POST /subscriptions)

**Меняет что-то в MAX.**

```sh
max bot api subscribe [options]
```

| Опция | Что делает |
|---|---|
| `--body <json>` | тело запроса в JSON; - читает его из stdin. |
| `--body-file <path>` | тело запроса из файла JSON; - означает stdin. |

#### `max bot api unsubscribe`

Unsubscribe — write (DELETE /subscriptions)

**Меняет что-то в MAX.**

```sh
max bot api unsubscribe [options]
```

| Опция | Что делает |
|---|---|
| `--url <value>` | URL to remove from WebHook subscriptions. |

#### `max bot api get-upload-url`

Get upload URL — write (POST /uploads)

**Меняет что-то в MAX.**

```sh
max bot api get-upload-url [options]
```

| Опция | Что делает |
|---|---|
| `--type <value>` | Uploaded file type: image, audio, video, file. |

#### `max bot api get-messages`

Get messages — read (GET /messages)

```sh
max bot api get-messages [options]
```

| Опция | Что делает |
|---|---|
| `--chat-id <value>` | Chat or channel identifier to get messages in chat or channel. |
| `--message-ids <value>` | Comma-separated list of message ids to get. |
| `--from <value>` | Start time for requested messages - use after instead. |
| `--to <value>` | End time for requested messages  - use before instead. |
| `--before <value>` | Messages before timestamp. |
| `--after <value>` | Messages after timestamp. |
| `--count <value>` | Maximum amount of messages in response. |

#### `max bot api send-message`

Send message — write (POST /messages)

**Меняет что-то в MAX.**

```sh
max bot api send-message [options]
```

| Опция | Что делает |
|---|---|
| `--user-id <value>` | Fill this parameter if you want to send message to user. |
| `--chat-id <value>` | Fill this if you send message to chat or channel. |
| `--disable-link-preview <value>` | If `false`, server will not generate media preview for links in text. |
| `--body <json>` | тело запроса в JSON; - читает его из stdin. |
| `--body-file <path>` | тело запроса из файла JSON; - означает stdin. |

#### `max bot api edit-message`

Edit message — write (PUT /messages)

**Меняет что-то в MAX.**

```sh
max bot api edit-message [options]
```

| Опция | Что делает |
|---|---|
| `--message-id <value>` | Editing message identifier. |
| `--body <json>` | тело запроса в JSON; - читает его из stdin. |
| `--body-file <path>` | тело запроса из файла JSON; - означает stdin. |

#### `max bot api delete-message`

Delete message — destructive (DELETE /messages)

**Меняет что-то в MAX.**

```sh
max bot api delete-message [options]
```

| Опция | Что делает |
|---|---|
| `--message-id <value>` | Deleting message identifier. |
| `--allow-dangerous` | не спрашивать подтверждение для bot.messages.delete на уровне ask. |

#### `max bot api get-message-by-id`

Get message — read (GET /messages/{messageId})

```sh
max bot api get-message-by-id [options]
```

| Опция | Что делает |
|---|---|
| `--message-id <value>` | Message identifier (`mid`) to get single message in chat or channel. |

#### `max bot api get-comments`

Get comments — read (GET /messages/{messageId}/comments)

```sh
max bot api get-comments [options]
```

| Опция | Что делает |
|---|---|
| `--message-id <value>` | ID (`mid`) комментируемого сообщения. |
| `--comment-ids <value>` | Comma-separated list of comment ids to get. |
| `--before <value>` | Comments before timestamp. |
| `--after <value>` | Comments after timestamp. |
| `--count <value>` | Maximum amount of comments in response. |

#### `max bot api send-comment`

Send comment — write (POST /messages/{messageId}/comments)

**Меняет что-то в MAX.**

```sh
max bot api send-comment [options]
```

| Опция | Что делает |
|---|---|
| `--message-id <value>` | ID (`mid`) комментируемого сообщения. |
| `--disable-link-preview <value>` | If `false`, server will not generate media preview for links in text. |
| `--body <json>` | тело запроса в JSON; - читает его из stdin. |
| `--body-file <path>` | тело запроса из файла JSON; - означает stdin. |

#### `max bot api edit-comment`

Edit comment — write (PUT /messages/{messageId}/comments)

**Меняет что-то в MAX.**

```sh
max bot api edit-comment [options]
```

| Опция | Что делает |
|---|---|
| `--message-id <value>` | ID (`mid`) комментируемого сообщения. |
| `--comment-id <value>` | Editing comment identifier. |
| `--body <json>` | тело запроса в JSON; - читает его из stdin. |
| `--body-file <path>` | тело запроса из файла JSON; - означает stdin. |

#### `max bot api delete-comment`

Delete comment — destructive (DELETE /messages/{messageId}/comments)

**Меняет что-то в MAX.**

```sh
max bot api delete-comment [options]
```

| Опция | Что делает |
|---|---|
| `--message-id <value>` | ID (`mid`) комментируемого сообщения. |
| `--comment-id <value>` | Deleting comment identifier. |
| `--allow-dangerous` | не спрашивать подтверждение для bot.messages.delete на уровне ask. |

#### `max bot api get-comment-by-id`

Get comment — read (GET /messages/{messageId}/comments/{commentId})

```sh
max bot api get-comment-by-id [options]
```

| Опция | Что делает |
|---|---|
| `--message-id <value>` | ID (`mid`) комментируемого сообщения. |
| `--comment-id <value>` | Comment identifier (`mid`) to get single comment in channel. |

#### `max bot api get-video-attachment-details`

Get video details — read (GET /videos/{videoToken})

```sh
max bot api get-video-attachment-details [options]
```

| Опция | Что делает |
|---|---|
| `--video-token <value>` | Video attachment token. |

#### `max bot api answer-on-callback`

Answer on callback — write (POST /answers)

**Меняет что-то в MAX.**

```sh
max bot api answer-on-callback [options]
```

| Опция | Что делает |
|---|---|
| `--callback-id <value>` | Identifies a button clicked by user. Bot receives this identifier after user pressed button as part of `MessageCallbackUpdate`. |
| `--disable-link-preview <value>` | If `true`, server will not generate media preview for links in updated message text. |
| `--body <json>` | тело запроса в JSON; - читает его из stdin. |
| `--body-file <path>` | тело запроса из файла JSON; - означает stdin. |

#### `max bot api get-updates`

Get updates — write (GET /updates)

**Меняет что-то в MAX.**

```sh
max bot api get-updates [options]
```

| Опция | Что делает |
|---|---|
| `--limit <value>` | Maximum number of updates to be retrieved. |
| `--poll-timeout <value>` | Timeout in seconds for long polling. |
| `--marker <value>` | Pass `null` to get updates you didn't get yet. |
| `--types <value>` | Comma separated list of update types your bot want to receive. |

## Коды возврата

Скрипт ветвится по коду, а не по тексту: текст меняется, код — нет.

| Код | Когда |
|---|---|
| `0` | получилось |
| `2` | `validation_error` |
| `3` | `configuration_error` |
| `4` | `authentication_error` |
| `5` | `permission_error` |
| `6` | `not_found` |
| `7` | `confirmation_required` |
| `8` | `rate_limited` |
| `9` | `timeout` |
| `10` | `network_error` |
| `11` | `provider_error` |
| `12` | `provider_unavailable` |
| `13` | `invalid_response` |
| `14` | `outcome_unknown` |
| `130` | `cancelled` |
| `1` | всё остальное |

`0` и только `0` означает, что операция выполнена. `14` — `outcome_unknown` — означает, что
сообщение **могло** уйти: не отправлено и не провалено, и повторять его можно только с тем же
`--operation-id`.
