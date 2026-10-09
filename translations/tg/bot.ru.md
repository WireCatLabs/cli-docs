---
title: "Бот Telegram"
---

`tg bot` работает с ботом через официальный [Bot API](https://core.telegram.org/bots/api) Telegram и его токен. Бот отделён от вашего личного аккаунта: у него свои имя, чаты и токен. Команды `tg …` без слова `bot` по-прежнему выполняются от вашего имени ([Использование](./usage.md)).

Создайте бота через [@BotFather](https://t.me/BotFather) в Telegram и получите токен.

Все команды и параметры: [Справочник команд](./commands.md).

**Через cli доступны все методы Telegram Bot API:** 185 методов зафиксированной схемы
Bot API 10.3, включая операции, для которых нет отдельной удобной команды.
Используйте `tg <bot> bot api <method>` с флагами полей API или телом запроса в JSON; см.
[полное руководство по API](#the-complete-bot-api). Для повседневных задач MCP предлагает отдельные инструменты.

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
tg sales bot me           # the bot's id, name and username
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

**В Bot API Telegram нет команды чтения истории.** `messages list` и `messages show` отвечают по сообщениям, которые бот отправил, получил через `bot watch` или загрузил через `bot store fetch` на этом компьютере. Источник ответа указывается явно:

```sh
tg sales bot messages list "Team"
tg sales bot messages show "Team" 512
```

## Загрузка старых сообщений

`bot store fetch` загружает старые сообщения канала или супергруппы в локальную копию бота. Команда создаёт отдельную сессию MTProto API Telegram с существующим токеном бота и читает номера сообщений через [channels.getMessages](https://core.telegram.org/method/channels.getMessages). Отправка и `bot watch` продолжают работать через Bot API; получение обновлений в сессии истории отключено. Команда ничего не отправляет и не отмечает прочитанным.

В примерах используются вымышленные идентификатор чата и ссылка на сообщение:

```sh
tg sales bot store fetch -1001234567890 --from https://t.me/c/1234567890/512 --limit 20 --json
tg sales bot store fetch -1001234567890 --last 200 --pause 1s
```

`--from` начинает с указанного сообщения включительно; ссылка должна вести в тот же чат. Без параметра команда использует самое новое сохранённое сообщение бота в этом чате. Если его нет, берёт номер самого нового сообщения из существующей личной сессии `default`. Если номер неизвестен обоим источникам, команда просит указать `--from`. Используются ключи приложения Telegram (`api_id` и `api_hash`) профиля бота либо существующего профиля `default`; подходят и `TG_API_ID` с `TG_API_HASH`. Вход в личный аккаунт не выполняется.

- `--limit` ограничивает число сообщений за запуск (по умолчанию 1000).
- `--page-size` ограничивает число запрашиваемых номеров на страницу, максимум 100.
- `--pause` задаёт паузу между запросами (по умолчанию 1 секунда), в том числе при чтении пустых диапазонов.
- `--last` останавливает загрузку, когда сохранено указанное число последних сообщений.
- `--since-time` останавливается на более старых сообщениях; время в ISO 8601 либо `2h` / `1d` назад.
  Укажите `--last` или `--since-time`, но не оба.

Повторный запуск продолжает чтение назад. JSON содержит `chat`, `fetched`, `complete` и `ranges`. Загруженные сообщения доступны через `bot messages list --offline`, поиск и контакты. Сессия бота хранится отдельно в каталоге состояния, для каждого профиля и идентификатора бота; при завершении команды она закрывается.

**Ограничения:** личные чаты и обычные группы не поддерживаются: номера их сообщений идут в одной последовательности для всех чатов бота. Бот должен иметь доступ к каналу или супергруппе. Удалённые сообщения и служебные номера оставляют пробелы; чтение проходит через них вплоть до номера 1. Большие пробелы могут потребовать много запросов даже при небольшом `--limit`. Лимиты Telegram для ботов действуют: короткое ожидание выполняется, длительное завершает запуск, чтобы вы могли продолжить позже.

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
tg sales bot search messages "price list"    # best match first; --newest for newest first
tg sales bot search messages --from @ann     # what one person wrote
tg sales bot messages between @ann Bob       # what both wrote, in the chats both wrote in
```

`--all-bots` и `--bots <names>` читают копии других ботов, если это разрешено настройкой `readOtherBots` профиля. В Bot API нет чтения истории, поэтому `contacts show --refresh` запрещён; сначала загрузите старые сообщения через `bot store fetch`.

## Модерация группы по правилам

Бот-администратор проверяет новые сообщения по правилам группы, как `tg chats moderate` личного аккаунта:

```sh
tg sales bot chats rules set -1001234567890 invites delete   # invite links to other chats: delete
tg sales bot chats moderate -1001234567890 --dry-run         # what breaks the rules, without acting
tg sales bot chats moderate -1001234567890                   # act as the rules allow
```

Бот проверяет только то, что `tg sales bot watch` сохранил или `bot store fetch` загрузил на этом компьютере. Вступления не проверяются. Удалённый участник не сможет вернуться по ссылке, если не задан `--no-ban`. Правила лежат в том же файле, что и правила профиля личного аккаунта с таким же именем.

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

Агент получает то, что разрешает профиль бота в `bot.`: чаты, которые видел бот,
сообщения, администраторов, меню команд, журнал и список получателей, а если профиль не
ограничен чтением — запись от имени бота: отправку, редактирование, закрепление, «печатает», ответы на кнопки, удаление сообщений и участников.
`permissions.bot: readonly` запрещает запись, если более конкретное правило не разрешает её. Для удаления
`ask` и `allow` разрешают запрошенную запись MCP без серверной формы; `deny` и `readonly`
запрещают её. Старые флаги подтверждения не действуют. Отдельное согласие на правила модерации по-прежнему
требуется: действия, которым оно нужно, возвращают план для одобрения владельцем через CLI.
`tg_bot_read` (`command: "status"`) сообщает, от имени какого профиля
работает сервер и какие инструменты записи включены.

Изменение выполняется той же командой, что в терминале, с получателями и журналом бота. Токен, вебхуки, меню команд и получателей меняете только вы.

Бот использует для `--md` те же [правила форматирования Telegram](./usage.md#sending), что и личный аккаунт. Этот же форматтер применяется к правкам текста и подписям файлов и фотографий.

## Полный Bot API

`tg <bot> bot api <method>` предоставляет все методы зафиксированной схемы Telegram Bot API.
Имена методов и полей записываются через дефис: `get-me`, `get-chat --chat-id <id>`.
`tg bot api --help` перечисляет методы, а справка каждого метода — его поля. Результаты сохраняют
исходную структуру Telegram; целые числа за пределами безопасного диапазона JavaScript возвращаются строками.

Передавайте поля отдельными флагами или в JSON: `--body <json>`, `--body -` (stdin)
либо `--body-file <path>`. `--body-file -` также читает stdin. Одно поле нельзя передавать
одновременно флагом и в теле JSON. Параметр API `timeout` задаётся через `--poll-timeout`;
глобальный `--timeout` ограничивает время выполнения всей команды.

Значение `@path` означает загрузку локального файла только в полях, объявленных файловыми
в схеме, включая вложенные поля массива `media` в JSON. В обычном тексте символ `@` сохраняется.
Секретные поля, например `secret_token` и `provider_token`, передаются через stdin или JSON-файл,
доступный только владельцу; отдельных флагов для них нет.

Операции используют `permissions.bot.api.<method>`, список получателей бота и журнал отправок.
Разрушительные действия по умолчанию требуют подтверждения. `get-updates` тоже требует его:
параметр смещения может подтвердить получение обновлений или пропустить их. Операция записи
без ответа сервера никогда не повторяется автоматически. Этот интерфейс требует соединения
с мессенджером и отказывается работать с `--offline`.

`get-managed-bot-token` и `replace-managed-bot-token` требуют `--store-token <profile>`.
Полученный токен сохраняется только в системном хранилище ключей и никогда не выводится.
Профиль назначения должен принадлежать указанному боту; это проверяется до смены токена на сервере.
После сохранения stdout содержит только профиль, идентификатор бота и `stored: "keyring"`.
Если хранилище ключей недоступно, операция завершается отказом, не сохраняя токен в файл.
