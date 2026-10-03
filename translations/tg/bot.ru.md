---
title: "Бот Telegram"
---

`tg bot` работает с ботом через официальный [Bot API](https://core.telegram.org/bots/api) Telegram и его токен. Бот отделён от вашего личного аккаунта: у него свои имя, чаты и токен. Команды `tg …` без слова `bot` по-прежнему выполняются от вашего имени ([Использование](./usage.md)).

Создайте бота через [@BotFather](https://t.me/BotFather) в Telegram и получите токен.

Все команды и параметры: [Справочник команд](./commands.md).

## Первое подключение

```sh
tg sales bot auth set     # the token, at a hidden prompt
tg sales bot auth show    # which bot it is
```

Перед сохранением `auth set` проверяет в Telegram, какому боту принадлежит токен. Опечатка не заменит рабочий токен.

## Как найти идентификатор чата

Telegram не предоставляет боту список чатов. Идентификатор можно получить из действия бота или увиденного им события.

- **Человек.** Используйте `user:<id>`. Отправка возвращает чат в поле `chatId` с `--json`. Человек должен сначала запустить бота: бот Telegram не может [начать разговор](https://core.telegram.org/bots#how-are-bots-different-from-users) с тем, кто ему не писал.
- **Группа или канал.** Добавьте бота, напишите сообщение и посмотрите события:

  ```sh
  tg sales bot watch --events --jsonl --timeout 1m
  ```

  Каждая строка содержит `chatId`. Бот без прав администратора видит в группе только команды и ответы ему, если [режим приватности](https://core.telegram.org/bots/features#privacy-mode) не отключён через @BotFather.

После `tg sales bot chats show <id>` бот узнаёт название чата, и команды ниже принимают его. `chats list` показывает все увиденные чаты.

- Идентификатор группы или канала **отрицательный**.
- Положительный идентификатор относится к человеку.

## Несколько ботов

Для каждого бота выберите имя. Оно указывается **первым словом** команды, как имя профиля личного аккаунта:

```sh
tg sales bot auth set
tg support bot auth set
tg bot list --check       # every name with a bot token, and which bot each is
```

Без имени используется настройка `defaultProfile`, а если она не задана — `default`. `TG_PROFILE` задаёт имя для текущей оболочки.

## Хранение токена

Токен хранится в системном хранилище ключей под именем `bot:<name>`, отдельно от личной сессии. Если хранилища ключей нет, используется файл, доступный только вам.

```sh
tg sales bot auth show    # where the token comes from, and which bot it is
tg sales bot auth remove  # forget it
```

Заданная переменная `TG_BOT_TOKEN` имеет приоритет над хранилищем ключей; так токен передают в CI. `auth set` не сохраняет токен из переменной.

Telegram включает токен в адрес каждого запроса. `tg` никогда не выводит этот адрес: ни в ошибках, ни с `--trace`, ни в записи запуска.

## Чаты

Telegram не предоставляет боту полный список его чатов. Поэтому `chats list` показывает **только чаты, которые бот видел на этом компьютере**.

```sh
tg sales bot chats list
```

## Сообщения

Чат задаётся идентификатором, `user:<id>` для человека или названием увиденного чата. Сообщение всегда указывается вместе с чатом: Telegram нумерует сообщения внутри каждого чата.

```sh
tg sales bot messages send "Team" "Build is ready"
tg sales bot messages send user:4815162342 "Hello"
tg sales bot messages send "Team" "**Weekly** report" --md       # or --html
tg sales bot messages send "Team" "Got it" --reply-to 511
echo "From a pipe" | tg sales bot messages send "Team"
tg sales bot messages edit "Team" 512 "Fixed text"
tg sales bot messages delete "Team" 512 513 --allow-dangerous
tg sales bot messages pin "Team" 512 --notify
tg sales bot messages unpin "Team" 512
```

`--silent` отправляет без уведомления. Максимум 4096 символов ([`sendMessage`](https://core.telegram.org/bots/api#sendmessage)). `--md` и `--html` несовместимы. Удаление спрашивает подтверждение; `--allow-dangerous` подтверждает. Закрепление тихое без `--notify`. Отправка возвращает сообщение и `operationId` записи в журнале. Telegram разрешает удалять только сообщения моложе 48 часов.

### Файлы

`--file` прикладывает файл с диска. Фото, видео и звук определяются по расширению; остальные отправляются файлом. `--photo` отправляет фото, `--voice` — Ogg Opus как голосовое, `--as-file` — видео как файл. Необязательный текст становится подписью:

```sh
tg sales bot messages send "Team" "Weekly report" --file report.pdf
tg sales bot messages send "Team" --photo screenshot.png
```

Скрытые файлы и каталоги `tg` запрещены без `--allow-any-file`. Одно вложение на сообщение: фото до 10 МБ, остальные файлы до 50 МБ ([отправка файлов](https://core.telegram.org/bots/api#sending-files)).

Если соединение оборвалось при отправке, `tg` не повторяет её: результат неизвестен (код 14). Перед повтором проверьте чат.

**Telegram не предоставляет боту историю.** Нельзя запросить сообщения чата или отдельное сообщение. Поэтому `messages list` и `messages show` читают только отправленное ботом и полученное через `bot watch` на этом компьютере и предупреждают об этом:

```sh
tg sales bot messages list "Team"
tg sales bot messages show "Team" 512
```

## Действия в чате

```sh
tg sales bot chats show -1001234567890    # from Telegram; the bot remembers its title
tg sales bot chats action "Team" typing   # typing, photo, video, voice, file — a few seconds
tg sales bot chats leave "Team"           # only an admin can bring the bot back
```

## Администраторы и участники

Бот должен быть администратором с правом назначать администраторов или удалять участников. Человек задаётся идентификатором пользователя.

```sh
tg sales bot chats admins list "Team"                                  # who runs it, and what each may do
tg sales bot chats admins add "Team" 4815162342 --can pin,delete --title Mod
tg sales bot chats admins remove "Team" 4815162342                     # they stay in the chat
tg sales bot chats members remove "Team" 4815162342                    # they may come back by the link
tg sales bot chats members remove "Team" 4815162342 --block            # they may not
```

`--can` принимает members, admins, info, pin, link, post, edit, delete. Отдельного права чтения в Telegram нет: администратор всегда читает. Назначение работает в супергруппах и каналах, титул — только в супергруппах. Bot API не позволяет получить список участников или добавить людей.

## Разрешённые получатели

У каждого бота свой список чатов, в которые ему разрешено писать. Если список пуст, ограничений по получателям нет.

```sh
tg sales bot recipients add -1001234567890    # a chat id
tg sales bot recipients add user:4815162342   # a person
tg sales bot recipients list
tg sales bot recipients remove -1001234567890
tg sales bot recipients clear                 # any chat again
```

Каждое действие, изменяющее данные, попадает в журнал бота: чат, вид действия и результат. Текст сообщений не записывается:

```sh
tg sales bot sends list
```

## События в чатах бота

```sh
tg sales bot watch                       # new messages, until Ctrl-C or --timeout
tg sales bot watch --events --jsonl      # and the rest: edits, buttons pressed, people joining and leaving
tg sales bot watch --types message,callback_query
```

`watch` сначала сохраняет событие, затем выводит: сообщения — в локальную историю бота, нажатия кнопок — для `callbacks answer`. Следующий запуск продолжает после сохранённого обновления. Telegram хранит обновления 24 часа: более редкий запуск пропускает события. С `--events` строки имеют тип: `message`, `edit`, `callback`, `joined`, `left`, `added`, `removed`, `other`. Вступления и выходы доступны только боту-администратору. `--types` принимает имена обновлений Telegram.

## Кнопки, меню и вебхуки

```sh
tg sales bot callbacks answer <callback> --notification "Done"   # a note only the person who pressed sees
tg sales bot callbacks answer <callback> --text "Confirmed"      # replaces the message the button was on
tg sales bot commands set start=Begin "report=Today's report"    # the menu people see after /
tg sales bot commands list
tg sales bot commands clear
tg sales bot webhooks set https://bot.example.com/telegram --secret-stdin
tg sales bot webhooks list
tg sales bot webhooks delete https://bot.example.com/telegram
```

`--text` заменяет сообщение кнопки, нажатие которой увидел `bot watch`. Команде Telegram нужно описание. У бота один вебхук: пока он задан, `bot watch` не получает события; `webhooks set` не принимает второй адрес до удаления первого.

Настройки бота находятся в разделе `bot` файла конфигурации: `tg sales config set --bot sendsPerHour 200` ([Настройки](./configuration.md)).

## Сохранённые данные бота

Всё увиденное `tg sales bot watch` хранится на компьютере. Эти команды читают базу без запросов Telegram:

```sh
tg sales bot contacts show @ann              # where Ann wrote, and her private chat with the bot
tg sales bot messages search "price list"    # best match first; --newest for newest first
tg sales bot messages search --from @ann     # what one person wrote
tg sales bot messages between @ann Bob       # what both wrote, in the chats both wrote in
```

`--all-bots` и `--bots <names>` включают копии других ботов, если разрешает `readOtherBots`. Telegram не даёт историю, поэтому `contacts show --refresh` запрещён.

## Модерация группы по правилам

Бот-администратор проверяет новые сообщения по правилам группы, как `tg chats moderate` личного аккаунта:

```sh
tg sales bot chats rules set -1001234567890 invites delete   # invite links to other chats: delete
tg sales bot chats moderate -1001234567890 --dry-run         # what breaks the rules, without acting
tg sales bot chats moderate -1001234567890                   # act as the rules allow
```

Бот проверяет только сохранённое `tg sales bot watch`, без истории до запуска `watch`. Вступления не проверяются. Удалённый участник не сможет вернуться по ссылке без `--no-ban`. Правила общие с личным профилем того же имени.

## Для скриптов и агентов

С `--json` данные выводятся в stdout, ошибки — в stderr с кодом завершения:

| Код | Причина |
|---|---|
| `4` | нет токена или Telegram его отклонил |
| `5` | действие запрещено разрешениями профиля |
| `6` | чат не найден, например неизвестное боту название |
| `7` | чат не разрешён или некому подтвердить уровень `ask` |
| `8` | исчерпан `sendsPerHour` бота |
| `14` | ответ не получен; результат изменения неизвестен |

Полный список: [Справочник команд](./commands.md). Формат сообщений тот же, что у личного аккаунта.

`--trace` и `--record` работают и для бота. Каждый запрос Bot API выводится в stderr без адреса, содержащего токен. Неудачные запуски сохраняются в `tg runs list` ([Диагностика](./diagnostics.md)).

## Подключение бота к агенту (MCP)

`tg <name> bot mcp` предоставляет агенту бота, как `tg mcp` предоставляет личный аккаунт:

```sh
claude mcp add sales-bot -- tg sales bot mcp
tg sales bot mcp config          # the entry for Claude Desktop, Cursor and others
```

Инструменты зависят от разрешений профиля в `bot.`: увиденные чаты, сообщения, администраторы, меню команд, журнал и получатели. Если профиль не только для чтения, доступны отправка, правки, закрепления, «печатает», ответы на кнопки, удаления и удаление участников. `bot: readonly` оставляет чтение. Перед удалением показывается форма; `--allow-dangerous` пропускает её, `--confirm-send` показывает перед каждым изменением. `tg_bot_status` сообщает профиль и включённые инструменты изменения.

Изменение выполняется той же командой, что в терминале, с получателями и журналом бота. Токен, вебхуки, меню команд и получателей меняете только вы.
