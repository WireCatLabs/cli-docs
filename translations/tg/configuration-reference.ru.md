---
title: "Справочник конфигурации"
---

<a id="преобразование-прежних-настроек-доступа" />

Используйте эту страницу, если вам нужно точное имя, тип, значение по умолчанию или область действия параметра или имя переменной среды. В нем перечислены все настройки, которые читает `tg`, все способы их переопределить и какое значение имеет приоритет. Для повседневных изменений и примера файла начните с [руководства по настройке](./configuration.md). Поведение команд, формат вывода и коды выхода, описано в [контракте CLI](./cli-contract.md).

Слова, которые используются на этой странице:

- **Раздел**: часть файла настроек. `defaults` применяется к каждому профилю, `profiles.<name>` — к одному профилю, `personal.*` — только к командам личного аккаунта, а `bot.*` — только к командам бота.
- **Область**: разделы, в которых разрешена настройка. Настройка вне его области действия является ошибкой.
- **Источник**: источник действующего значения: параметр, переменная среды, раздел файла или встроенное значение по умолчанию.

Ни одна настройка не может хранить секрет: в файле нет поля для сессии, хеша приложения, номера телефона или идентификатора чата.

Краткий пример файла и полный файл с описанием каждого раздела и каждой части находятся в [руководстве по настройке](./configuration.md#an-example-settings-file).

## Приоритет значений

Для каждой настройки используется первое заданное значение в этом списке:

1. параметр команды (`--limit 50`, `--record`, `--timeout 30s`)
2. переменная окружения (`TG_PROFILE`, `TG_TIMEOUT`)
3. настройки конкретного профиля в файле
4. общие для всех профилей `defaults` в файле
5. встроенное значение по умолчанию

```sh
tg chats list --limit 5     # 5: the option
# "limit": 50 in the profile's entry — when there is no option
# "limit": 30 in "defaults" — when the profile has none either
# 20 — when nothing is set
```

Внутри файла имеет приоритет над наиболее конкретный раздел. Для команды личного аккаунта по профилю `work`: `personal.profiles.work`, затем `profiles.work`, затем `personal.defaults`, затем `defaults`. Для `tg work bot …` то же самое, с `bot` вместо `personal`.

Не в каждой настройке есть все пять способов. В [таблице настроек](#the-file) написано, какие из них существуют.

## Текущие значения

```sh
tg config show
tg work config show
tg shop config show --bot
```

В нем перечислены профиль, откуда взялось имя профиля, профили, имена файлов, путь к файлу и его существование, а также каждый параметр с его значением и **откуда это значение**: `flag`, переменная среды, `config file`, `config defaults` или `default`. `--bot` показывает настройки, которые получает команда бота этого профиля. `--json` дает то же самое, что и один объект для скрипта.

Список заканчивается `commandTimeoutMs`: ограничение на всю команду, от `--timeout` или `TG_TIMEOUT`. Это не настройка файла; `timeoutMs` ограничивает один запрос.

Когда установлены `TG_CONFIG_DIR`, `TG_STATE_DIR` или `TG_CACHE_DIR`, об этом говорится в stderr, поскольку это также меняет, какой логин находится ([где хранятся части логина](./sessions.md#where-the-parts-are-kept)).

⚠ **Это не проверка работоспособности.** Если она отсутствует, создается стартовая конфигурация, а затем считывается файлы. Он не открывает архив, не спрашивает системное хранилище ключей и не подключается. Работает ли сессия по-прежнему - это вопрос для `tg doctor --online` ([устранение неполадок с помощью tg Doctor](./troubleshooting.md#first-tg-doctor)).

## Файл настроек

`config.json` в каталоге настроек (`~/.config/tg-cli/config.json` в Linux; другие системы указаны в [куда идут файлы](./installation.md#where-files-go)). Первая команда, считывающая настройки, создает их с `limit`, `keepRunsForDays`, `sendsPerHour`, `updateCheck` и `skillHint` под `defaults`; существующий файл никогда не заменяется.

```json
{
  "defaultProfile": "default",
  "defaults": {
    "sendsPerHour": 10,
    "updateCheck": false
  },
  "profiles": {
    "default": { "limit": 50 },
    "work": { "permissions": { "messages": "readonly", "messages.send": "allow" }, "record": true }
  },
  "personal": { "defaults": { "catchUpMarksRead": true } },
  "bot": { "profiles": { "shop": { "sendsPerHour": 200 } } }
}
```

- `defaults`: каждый профиль, личные аккаунты и боты.
- `profiles.<name>`: один профиль, независимо от способа его использования.
- `personal.defaults`, `personal.profiles.<name>`: только команды личного аккаунта.
- `bot.defaults`, `bot.profiles.<name>`: только команды `tg <name> bot …`.

`defaultProfile` вверху называет используемый профиль, если ни первое слово, ни `TG_PROFILE` не называют его. Первое слово (`tg work …`) и `TG_PROFILE` переопределяют его. Без него профиль `default`.

| Настройка | По умолчанию | Что делает | Переопределение на один запуск |
|---|---|---|---|
| `limit` | `20` | строк на странице списка | `--limit` |
| `timeoutMs` | нет | как долго может ждать **один** запрос к Telegram, в миллисекундах. Команда делает несколько запросов, поэтому для ограничения всей команды используйте `--timeout` | нет (`--timeout` — это другое) |
| `color` | из терминала | цвет в виде таблицы | нет; без настроек `NO_COLOR` отключает его |
| `senderColors` | `false` | цвет для каждого отправителя в таблице сообщений | нет |
| `catchUpMarksRead` | `false` | `inbox` и `review` отмечают каждый чат, который они показывают, прочитанным, вплоть до самого нового отображаемого сообщения. Другая сторона это видит | `--mark-read`, `--no-mark-read` |
| `searchCatchUp` | `false` | `store fetch` и `store gaps repair` также подготавливают полученный чат для локального поиска: его граф обсуждений и, если он установлен, его векторы. Никогда не загружает модели и не вызывает внешних провайдеров | `--catch-up`, `--no-catch-up` |
| `record` | `false` | сохранять каждый запуск ([диагностика](./diagnostics.md)) | `--record`, `--no-record` |
| `keepRunsForDays` | `30` | записи запусков старше этого удаляются при сохранении следующего | нет |
| `permissions` | разрешено все, кроме: спрашивают удаление, завершение сессий и некоторые другие изменения; автоответы не могут отправляться | что профиль может делать по команде ([ниже](#what-a-profile-may-do)) | нет; `--yes` и `--allow-dangerous` отвечают только на `ask`, они никогда не отменяют `deny` |
| `sendsPerHour` | `30`; у бота его нет, пока он не установлен в разделе `bot` | наибольшее количество отправок за час ([защита отправки](./security.md#the-send-guard)) | нет |
| `requestsPerMinute` | `60` | запросов в минуту после краткого всплеска до 20, общие для всех процессов профиля; `0` отключает ([ограничивает и ждет](./limits.md)) | `TG_REQUESTS_PER_MINUTE` |
| `transcribeWith` | `auto` | кто превращает голос в текст: `auto` (Telegram, иначе локальная модель), `messenger` или `local` | `--local` или `--model`, что подразумевает |
| `speechModel` | нет | какую скачанную модель использует `--local` (`tg models audio list`) | `--model` |
| `proxy` | нет | сервер SOCKS5, HTTP `CONNECT` или MTProxy для доступа к Telegram через ([ниже](#through-a-proxy)) | `TG_PROXY` |
| `readOtherBots` | `false` | только бот: может ли `tg bot` читать то, что хранят другие боты на этой машине — `true` или список имен профилей ([bots](./bot.md)) | нет; `--all-bots` и `--bots` спрашивают, настройка позволяет |
| `updateCheck` | `true` | ежедневная строка «Существует более новая версия»; только под `defaults` | нет; `TG_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER` или `CI` выключить |
| `skillHint` | `true` | линия не чаще одного раза в день для агента, у которого копия навыка tg отсутствует или старше tg; только под `defaults` | нет |
| `embeddingProvider` | `local` | локальная модель или `openai` | `--provider` |
| `embeddingModel` | провайдер по умолчанию | модель векторизации | `--model` |
| `embeddingBaseUrl` | провайдер по умолчанию | адрес API для векторизации | `--base-url` |
| `embeddingDims` | модель по умолчанию | целое число 1–65 536 | `--dims` |
| `analysisProvider` | `agent` | `agent`, `openai` или `anthropic` | `build --provider` |
| `analysisModel` | нет; требуется для `--analyze` | модель анализа | `build --model` |
| `analysisBaseUrl` | провайдер по умолчанию | конечная точка API анализа | `build --base-url` |
| `models` | нет | внешние модели по назначению ([ниже](#models-by-purpose)) | `TG_MODELS_*` переменные |
| `searchStemmers.cyrillic`, `searchStemmers.latin` | `russian`, `english,spanish` | языки-основы слов для поиска по всему архиву ([ниже](#search-languages)) | нет |

При первом создании файл создаётся с правами `0600`, а `config set` пишет его с правами `0644`. Секретов в нём нет.

## Разрешения профиля

`permissions` — объект, в котором каждый ключ задаёт путь команды, а значение — уровень разрешения.

```json
{ "profiles": { "work": { "permissions": { "messages": "readonly", "messages.send": "allow" } } } }
```

| Уровень | Поведение |
|---|---|
| `deny` | запрещено всё, включая чтение; отказ с кодом завершения `5` до подключения |
| `readonly` | чтение разрешено; изменения отклоняются с кодом `5` |
| `ask` | подтверждение y/N в терминале; по умолчанию нет ([ниже](#a-question-before-a-change)) |
| `allow` | действие выполняется без подтверждения |

**Ключ — это путь к команде**: `messages`, `messages.delete`, `messages.send`, `reactions`, `polls.vote`, `chats.mark-read`, `chats.members.remove`, `contacts`, `account.sessions.end`. Начинается с ресурса — `messages`, `reactions`, `polls`, `topics`, `chats`, `contacts`, `account`, `bot`, `conversations`, `tags`, `search`, `searches`, `tasks`, `replies`, `attachments`, `stats`, `store` или `metadata` — и должны называть известную команду, иначе запись отклоняется. Неизвестные командные ключи отклоняются `config set` с кодом завершения 2, включая ключи внутри всего объекта `permissions`. `config unset` может удалить старый неизвестный ключ. При чтении существующего файла с неизвестным ключом выводится предупреждение в stderr, и работа продолжается.

**Выигрывает наиболее конкретный ключ, который вы установили**: в приведенном выше примере разрешен `messages.send`, а все остальные изменения в сообщениях запрещены. Подстановочный знак отсутствует: `messages: readonly` не касается `reactions`, `polls` или `chats`.

Ключи из разных разделов файла складываются, но **сначала решает ближайший раздел, затем самый длинный ключ**. Ключ, заданный профилем, скрывает такой же ключ и все вложенные в него ключи в `personal.defaults`, `bot.defaults` и `defaults`. Здесь профиль `agent` не может удалять: его `messages` скрывает `messages.delete` из `defaults`.

```json
{
  "defaults": { "permissions": { "messages.delete": "allow" } },
  "profiles": { "agent": { "permissions": { "messages": "readonly" } } }
}
```

Это работает и в обратную сторону: `messages: allow` профиля тоже скрывает `messages.delete: deny` из `defaults`, и удаление снова требует подтверждения, как по умолчанию. Старые `readOnly` и `allow` действуют в том разделе, где они записаны.

`inbox`, `review`, `watch`, `serve` и `store fetch`, `export`, `search` показывают сообщения и относятся к `messages`: `messages: deny` блокирует и их. `config`, `session`, `doctor`, `recipients`, `mcp` и обслуживание самой базы не ограничиваются.

**Значения по умолчанию позволяют все, кроме нескольких изменений, которые трудно отменить.** Они задают вопросы: `messages.delete`, `bot.messages.delete`, `chats.delete`, `chats.clear`, `topics.enable`, `topics.delete` и `account.sessions.end`. Правила ответа не могут отправлять сообщения, пока вы не разрешите это: `replies.send` — `deny`. Встроенное значение по умолчанию только усиливает ограничения: `messages: readonly` по-прежнему отказывается от удаления, а `messages: allow` сохраняет вопрос перед удалением, пока вы не установите сам `messages.delete`.

```sh
tg config set permissions.messages.delete allow     # delete without the question
tg config set permissions.messages.send ask         # ask before every send
tg config unset permissions.messages.delete         # back to the default
```

Чтобы отказаться от каждого изменения в Telegram из профиля — здесь профиль `agent` — установите каждый ресурс:

```sh
for key in messages reactions polls topics chats contacts account conversations tags searches replies attachments bot; do
  tg agent config set permissions.$key readonly
done
```

Изменения, хранящиеся только на этом компьютере — `tasks`, `store` и `metadata` — имеют свои ключи.

### Подтверждение перед изменением

На уровне `ask` `tg` показывает, что изменится, и спрашивает `go ahead? [y/N]`. Ответ, отличный от `y`, ничего не делает и заканчивается кодом завершения `130`. Флаг отвечает «да» для вас: `--allow-dangerous` для удаления, которое невозможно отменить (сообщения, чат, его история или тема), глобальный `--yes` для любого другого изменения. Без терминала или под `--json` или `--jsonl` никто не может ответить: изменение отклонено с кодами выхода `7`, `confirmation_required`, и ошибка называет флаг.

### Через MCP

У MCP нет серверных форм подтверждения. `deny` и `readonly` запрещают запись; `ask` и `allow`
разрешают запрошенную запись. Повторяйте `--permission key=level` для временных разрешений сервера
([настройка в браузере](./remote.md)). Подтверждение в CLI при `ask` по-прежнему требуется.

`replies.send` по умолчанию равен `deny`; включение только правила ответа не позволяет отправлять сообщения. `tg replies audience` может ограничить ответы выбранным людям или исключить некоторых из них.

### Совместимость со старыми настройками

`readOnly: true` задаёт `readonly` для всех ресурсов. Список в `allow` (`send`, `forward`, `reaction`, `edit`, `pin`, `read`, `delete`, `groups`, `contacts`, `profile`, `folders`, `sessions`) задаёт этим действиям `allow`, а остальным — `readonly`; удаление всё равно требует подтверждения. Ключ в `permissions` того же раздела имеет приоритет над обоими вариантами.

### Перенос устаревших настроек доступа

`tg config migrate --dry-run --json` показывает предварительную замену `readOnly` и `allow` на `permissions`, сохраняя уровни, указанные в файле для личных профилей и профилей ботов. Он не записывает файл и не подключается к Telegram. `tg config migrate --json` применяет эту миграцию; процесс, привязанный к одному профилю, не может применить изменение, влияющее на все профили. Остальные настройки сохраняются. Файл, который уже использует только `permissions`, не требует миграции. Как только `permissions` присутствует, `config set` отклоняет изменения в `readOnly` и `allow`; измените соответствующие ключи разрешения.

## Изменение через команду

```sh
tg config set limit 50                        # this profile
tg work config set permissions.contacts readonly   # profile "work"; one key at a time
tg config set sendsPerHour 10 --defaults      # every profile
tg config set limit 30 --personal --defaults  # every personal account
tg shop config set sendsPerHour 200 --bot     # only the bot "shop"
tg config set updateCheck false --defaults    # a setting that exists only under defaults
tg config unset sendsPerHour                  # back to the default
```

`config set` проверяет значения по тем же правилам, что и чтение настроек, и не записывает файл, который другая команда затем отклонит.

### Языки поиска

`searchStemmers.cyrillic` (`russian` или `none`) и `searchStemmers.latin` (`english`, `spanish`, оба разделены запятыми — по умолчанию — или `none`) хранятся в общем локальном хранилище, а не в файле настроек: одно значение для каждого профиля и для обоих CLI. Поэтому `--defaults`, `--personal` и `--bot` с ними не принимаются, и процесс под `TG_PROFILE_LOCK` не может их изменить. `config unset` восстанавливает встроенное значение. После изменения перестройте индекс поиска ([обслуживание индекса](./archive.md#repair-and-index-maintenance)).

## Опечатки вызывают ошибку

Неизвестная настройка останавливает любую команду с кодом завершения `3`:

```text
config.json is not a valid config:
  profiles.default.limt: unknown setting — the known ones are limit, timeoutMs, …
```

Если бы ошибочные настройки игнорировались, команда незаметно использовала бы значение по умолчанию. Поэтому ошибкой также считается ключ `permissions`, не начинающийся с ресурса.

## Через прокси

Если Telegram заблокирован, `tg` может подключаться к нему через прокси: SOCKS5, HTTP-прокси с поддержкой `CONNECT` или MTProxy. Одна настройка `proxy` на профиль или для всех профилей с `--defaults`. Задайте её до `tg setup`: вход тоже идёт через прокси.

```sh
tg config set proxy socks5://proxy.example:1080       # no password: on the command line
tg config set proxy http://alice@proxy.example:3128   # a user without a password
tg config set proxy -                                 # with a password or an MTProxy secret
proxy URL, hidden as you type: tg://proxy?server=mt.example&port=443&secret=ee…
tg config unset proxy
```

| Формат | Вид |
|---|---|
| `socks5://[user:password@]host[:port]` | SOCKS5; без порта используется 1080; `socks5h://` читается так же |
| `http://[user:password@]host[:port]` | HTTP-прокси через `CONNECT`; `https://` подключается к самому прокси по TLS |
| `tg://proxy?server=…&port=…&secret=…` или `https://t.me/proxy?…` | MTProxy в том виде, в каком им делится Telegram; секреты FakeTLS (`ee…`) поддерживаются |
| `tg://socks?server=…&port=…&user=…&pass=…` | ссылка Telegram на прокси SOCKS5 |

**Пароль или секрет MTProxy никогда не попадает в файл настроек.** `config set proxy -` читает URL без отображения ввода или из канала, сохраняет секрет в хранилище ключей ОС — один на профиль и один для `--defaults`, который профиль использует только с прокси из defaults, — и записывает URL без него; `config show`, `doctor` и сообщения об ошибках показывают его так же. URL с секретом в командной строке отклоняется, поскольку его сохранили бы `ps` и история оболочки.

`TG_PROXY` принимает весь URL вместе с секретом и имеет приоритет над настройкой — для CI или для одной попытки. `config show` выводит настройку из файла; `tg doctor` — прокси, который фактически используется. `ALL_PROXY` и `HTTPS_PROXY` не читаются: их обычно задают для других программ, а прокси выбирают для этого аккаунта.

Bot API (`tg bot …`) и регистрация приложения в `session start --app auto` идут через тот же прокси SOCKS5 или HTTP. MTProxy передаёт только собственный протокол Telegram, поэтому с ним они подключаются напрямую; `tg doctor` сообщает, как именно. `--app browser` открывает my.telegram.org в вашем браузере, который использует собственные настройки прокси.

## Переменные окружения

| Переменная | Что делает |
|---|---|
| `TG_PROFILE` | профиль, когда первое слово не называет ни одного |
| `TG_PROFILE_LOCK` | закрепляет процесс в одном профиле; любому другому отказано ([profiles](./sessions.md#profiles)) |
| `TG_TIMEOUT` | то же, что и `--timeout`: `500ms`, `30s` или `2m` для всей команды |
| `TG_REQUESTS_PER_MINUTE` | то же, что `requestsPerMinute`, и имеет приоритет над его |
| `TG_API_ID`, `TG_API_HASH` | приложение вместо системного хранилища ключей — для CI; оба или ни один |
| `TG_PROXY` | URL-адрес прокси-сервера, пароль или секретный ключ; имеет приоритет над настройку `proxy` ([выше](#through-a-proxy)) |
| `TG_CONFIG_DIR`, `TG_STATE_DIR`, `TG_CACHE_DIR` | переместите три каталога — и запись связки ключей с ними |
| `MESSAGING_STORE` | путь к файлу локального хранилища |
| `CLI_COMMON_CACHE_DIR` | где хранятся речевые модели |
| `TG_NO_UPDATE_CHECK` | `1` отключает ежедневную строку «Существует более новая версия» |
| `NO_COLOR` | нет цвета в виде таблицы |
| `XDG_RUNTIME_DIR` | в Linux, как достигается связка ключей; cron и ssh часто оставляют это без внимания |
| `TG_EMBEDDING_*`, `TG_ANALYSIS_*`, `TG_MODELS_*` | настройки модели ([ниже](#model-environment-variables)) |

## Временные отдельные настройки

Укажите другое расположение для трёх каталогов, и `tg` получит там новую конфигурацию, вход и историю запусков. Он
не увидит ваш обычный вход, потому что запись в хранилище ключей меняется вместе с каталогами:

```sh
export TG_CONFIG_DIR=/tmp/tg-try/config TG_STATE_DIR=/tmp/tg-try/state TG_CACHE_DIR=/tmp/tg-try/cache
export MESSAGING_STORE=/tmp/tg-try/messages.db
tg setup
```

Без `MESSAGING_STORE` прочитанные этой сессией сообщения всё равно попадут в обычную локальную базу.

## Типы и области действия всех ключей

«Профиль» включает корневые `defaults`, `profiles.<name>`, `personal.defaults`, `personal.profiles.<name>`, `bot.defaults` и `bot.profiles.<name>`, если не указано иное. Неизвестные ключи и недопустимые типы являются ошибками. Значения по умолчанию и эффекты перечислены [выше](#the-file).

| Ключ | Принятый тип/значение | Область применения |
|---|---|---|
| `defaultProfile` | строка имени профиля | корень файла |
| `limit`, `timeoutMs`, `keepRunsForDays`, `sendsPerHour` | целое число ≥ 1 | профиль |
| `requestsPerMinute` | целое число ≥ 0 | профиль |
| `color`, `senderColors`, `catchUpMarksRead`, `searchCatchUp`, `record`, `readOnly` | логическое | профиль |
| `permissions` | объект путей команд и уровней `deny`, `readonly`, `ask`, `allow` | профиль |
| `allow` | массив разрешенных действий; устаревший формат | профиль |
| `readOtherBots` | логическое значение или массив имен профилей | только бот |
| `updateCheck`, `skillHint` | логическое | только корневые `defaults` |
| `transcribeWith` | `auto`, `messenger`, `local` | профиль |
| `speechModel` | загруженный идентификатор модели в виде строки | профиль |
| `proxy` | поддерживается URL-адрес прокси-сервера в виде строки | профиль |
| `embeddingProvider` | `local`, `openai` | профиль |
| `embeddingModel`, `analysisModel` | непустая строка, не более 200 символов | профиль |
| `embeddingBaseUrl`, `analysisBaseUrl` | URL-адрес HTTP(S) без учетных данных, запроса или фрагмента | профиль |
| `embeddingDims` | целое число 1–65 536 | профиль |
| `analysisProvider` | `agent`, `openai`, `anthropic` | профиль |
| `models` | объекты назначения, описанные ниже | профиль |
| `searchStemmers.cyrillic` | `russian`, `none` | общий архив через `config set` |
| `searchStemmers.latin` | `english`, `spanish`, оба через запятую, `none` | общий архив через `config set` |

### Модели по назначению

`models.<purpose>` принимает только `provider`, `model` и `baseUrl`. Названия назначений начинаются
со строчной буквы и содержат строчные буквы, цифры и дефисы.
`default` задаёт общие поля; `analysis` и `replies` переопределяют их по одному.
Другие допустимые названия назначений можно сохранить заранее; это не включает отсутствующую возможность.
Отсутствующий провайдер или `off` отключает вызовы внешних моделей.

| Поле | Допустимое значение | По умолчанию |
|---|---|---|
| `models.<purpose>.provider` | `off`, `openai`, `anthropic` | отсутствует; внешних вызовов нет |
| `models.<purpose>.model` | непустая строка, не более 200 символов | отсутствует; включённому провайдеру нужен явный идентификатор модели |
| `models.<purpose>.baseUrl` | URL HTTP(S) без учётных данных, строки запроса или фрагмента | адрес API провайдера |

Для каждого поля порядок приоритета: `TG_MODELS_<PURPOSE>_PROVIDER`, `_MODEL` или `_BASE_URL`,
затем ближайшее настроенное поле назначения, явно заданные прежние поля `analysis*` для `analysis`,
затем переменные окружения и поля конфигурации в `models.default`. Дефисы в названии назначения
становятся подчёркиваниями в имени переменной окружения. Учётные данные не входят в этот объект.

Настройки векторизации и анализа независимы и могут различаться в зависимости от профиля. Конечные точки должны быть HTTP/S без встроенных учетных данных, запросов или фрагментов. Удалённые вызовы векторизации также получают текст запроса поиска MCP. Ключи устанавливаются с помощью `models text key set openai|anthropic` и остаются за пределами `config.json`. Обычный `build` не запускает удаленный анализ: требуется явный `--analyze`.

### Переменные окружения для моделей

Устаревшие поля принимают `TG_EMBEDDING_PROVIDER`, `TG_EMBEDDING_MODEL`, `TG_EMBEDDING_BASE_URL`, `TG_EMBEDDING_DIMS`, `TG_ANALYSIS_PROVIDER`, `TG_ANALYSIS_MODEL` и `TG_ANALYSIS_BASE_URL` перед значениями файла; параметры команды имеют преимущество перед ними. `TG_MODELS_DEFAULT_PROVIDER`, `TG_MODELS_DEFAULT_MODEL` и `TG_MODELS_DEFAULT_BASE_URL` предоставляют общие поля в новом формате; замените `DEFAULT` на цель, например `ANALYSIS`. Пустая переменная не отменяет настройку. Неверные значения возвращают `configuration_error`.

## Дальше

- [Безопасность](./security.md): что защищает `permissions`, список получателей и `sendsPerHour`.
- [Диагностика](./diagnostics.md): что хранит `record` и как долго держит `keepRunsForDays`
