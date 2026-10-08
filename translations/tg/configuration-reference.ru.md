---
title: "Справочник конфигурации"
---

Все ключи, их значения по умолчанию и области действия, а также переменные окружения. Для обычных изменений начните с
[руководства по конфигурации](./configuration.md). Вызов команд, вывод и поведение агента
описаны в [контракте CLI](./cli-contract.md). Учётные данные хранятся вне
файла настроек.

Все настройки, переменные окружения и порядок их приоритета. Секреты в файле настроек не хранятся: в нём нет полей для сессии, хеша приложения, номера телефона или идентификатора чата.

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

Не у каждой настройки есть все пять источников. Доступные варианты приведены ниже.

## Текущие значения

```sh
tg config show
tg work config show
```

Команда показывает профиль и источник его имени, профили из файла, путь к файлу и его наличие, а также каждую настройку и **источник её значения**: `flag`, переменную окружения, `config file`, `config defaults` или `default`. `--json` возвращает те же данные одним объектом для скриптов.

В конце списка находится `commandTimeoutMs`: ограничение времени всей команды из `--timeout` или `TG_TIMEOUT`. В файле такой настройки нет.

Если заданы `TG_CONFIG_DIR`, `TG_STATE_DIR` или `TG_CACHE_DIR`, это отмечается в stderr: они также влияют на поиск сессии ([Вход и сессии](./sessions.md#where-the-parts-are-kept)).

⚠ **Это не проверка работоспособности.** Команда создаёт начальную конфигурацию, если её нет, затем читает файлы. Она не открывает хранилище, не обращается к хранилищу ключей и не
подключается. Проверить, работает ли сессия, можно через `tg doctor --online`
([troubleshooting.md](./troubleshooting.md#first-tg-doctor)).

Вывод действующих настроек включает `commandTimeoutMs`, заданный через `--timeout` или `TG_TIMEOUT`.
Он ограничивает всю команду и не является ключом файла конфигурации; `timeoutMs` ограничивает один запрос.

## Файл настроек

`config.json` находится в каталоге настроек (`~/.config/tg-cli/config.json` в Linux; пути для остальных систем: [Установка](./installation.md#where-files-go)).

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
  }
}
```

| Настройка | По умолчанию | Назначение | Чем заменить на один запуск |
|---|---|---|---|
| `embeddingProvider` | `local` | локальная модель или `openai` | `--provider` |
| `embeddingModel` | по умолчанию провайдера | модель векторов | `--model` |
| `embeddingBaseUrl` | по умолчанию провайдера | адрес API для векторов | `--base-url` |
| `embeddingDims` | по умолчанию модели | целое число от 1 до 65 536 | `--dims` |
| `analysisProvider` | `agent` | `agent`, `openai` или `anthropic` | `build --provider` |
| `analysisModel` | не задано; обязательно для `--analyze` | модель анализа | `build --model` |
| `analysisBaseUrl` | по умолчанию провайдера | адрес API для анализа | `build --base-url` |
| `limit` | `20` | строк на странице списка | `--limit` |
| `timeoutMs` | не задано | время ожидания **одного** запроса к Telegram в миллисекундах. Команда может делать несколько запросов; для ограничения всей команды используйте `--timeout` | нет (`--timeout` — другое ограничение) |
| `color` | зависит от терминала | цвета в таблицах | нет; если настройка не задана, `NO_COLOR` отключает цвета |
| `senderColors` | `false` | отдельный цвет для каждого отправителя в таблице сообщений | нет |
| `searchCatchUp` | `false` | подготовить граф загруженного чата или чата с устранёнными пробелами и установленные локальные векторы в явных пределах; никогда не загружать модели и не обращаться к удалённым провайдерам | `--catch-up`, `--no-catch-up` |
| `catchUpMarksRead` | `false` | `inbox` и `review` отмечают каждый показанный чат прочитанным до последнего показанного сообщения. Собеседник это видит | `--mark-read`, `--no-mark-read` |
| `searchCatchUp` | `false` | `store fetch` и `store gaps repair` также подготавливают загруженный чат для локального поиска: его граф и, если установлены, векторы | `--catch-up`, `--no-catch-up` |
| `record` | `false` | сохранять каждый запуск ([Диагностика](./diagnostics.md)) | `--record`, `--no-record` |
| `keepRunsForDays` | `30` | записи старше этого числа дней удаляются при сохранении следующей | нет |
| `permissions` | всё разрешено, кроме отправки правилами ответов; удаление и завершение сессий требуют подтверждения | разрешения профиля для каждой команды ([ниже](#what-a-profile-may-do)) | нет; `--yes` и `--allow-dangerous` только отвечают на `ask` и никогда не снимают `deny` |
| `sendsPerHour` | `30` | максимум отправок за любой час ([Безопасность](./security.md#the-send-guard)) | нет |
| `requestsPerMinute` | `60` | запросов в минуту после пакета из 20, общий лимит для всех процессов профиля; `0` отключает его ([limits.md](./limits.md)) | `TG_REQUESTS_PER_MINUTE` |
| `transcribeWith` | `auto` | распознавание речи: `auto` (Telegram, иначе локальная модель), `messenger` или `local` | `--local` или `--model`, который его подразумевает |
| `speechModel` | не задано | скачанная модель для `--local` (`tg models audio list`) | `--model` |
| `updateCheck` | `true` | ежедневное уведомление о новой версии; только в `defaults` | нет; `TG_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER` или `CI` отключают его |
| `skillHint` | `true` | уведомление агенту об отсутствующем или устаревшем skill для tg, не чаще раза в день; только в `defaults` | нет |
| `readOtherBots` | `false` | только для бота: разрешено ли `tg bot` читать данные, сохранённые другими ботами на этом компьютере; `true` или список имён профилей ([Бот Telegram](./bot.md)) | нет; `--all-bots` и `--bots` запрашивают доступ, а настройка его разрешает |
| `proxy` | не задано | сервер SOCKS5, HTTP `CONNECT` или MTProxy для подключения к Telegram ([ниже](#through-a-proxy)) | `TG_PROXY` |
| `searchStemmers.cyrillic`, `searchStemmers.latin` | `russian`, `spanish` | языки основ слов для всей базы, обоих CLI и всех профилей: `russian` или `none`; `spanish`, `english` или `none` ([Локальная база](./archive.md#repair-and-index-maintenance)) | нет |

Поле `defaultProfile` верхнего уровня задаёт профиль, если он не указан первым словом команды или через `TG_PROFILE`. Первое слово (`tg work …`) и `TG_PROFILE` имеют приоритет над ним.

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

**Ключ — путь команды**: `messages`, `messages.delete`, `messages.send`, `reactions`, `polls.vote`, `chats.mark-read`, `chats.members.remove`, `contacts`, `account.sessions.end`. Он должен начинаться с ресурса — `messages`, `reactions`, `polls`, `topics`, `chats`, `contacts`, `account`, `conversations`, `tags`, `searches`, `replies`, `attachments` или `bot` — и называть известную команду или проверяемое изменение. Неизвестные ключи команд `config set` отклоняет с кодом 2, в том числе внутри целого объекта `permissions`. `config unset` может удалить старый неизвестный ключ. При чтении существующего файла с таким ключом выводится предупреждение в stderr, и работа продолжается. **Самый конкретный ключ имеет приоритет**: в примере выше `messages.send` разрешён, а остальные изменения сообщений запрещены. Подстановочных знаков нет: `messages: readonly` не влияет на `reactions`, `polls` или `chats`.

Ключи из разных разделов файла складываются, но **сначала решает ближайший раздел, затем самый длинный ключ**. Ключ, заданный профилем, скрывает такой же ключ и все вложенные в него ключи в `personal.defaults`, `bot.defaults` и `defaults`. Здесь профиль `agent` не может удалять: его `messages` скрывает `messages.delete` из `defaults`.

```json
{
  "defaults": { "permissions": { "messages.delete": "allow" } },
  "profiles": { "agent": { "permissions": { "messages": "readonly" } } }
}
```

Это работает и в обратную сторону: `messages: allow` профиля тоже скрывает `messages.delete: deny` из `defaults`, и удаление снова требует подтверждения, как по умолчанию. Старые `readOnly` и `allow` действуют в том разделе, где они записаны.

`inbox`, `review`, `watch`, `serve` и `store fetch`, `export`, `search` показывают сообщения и относятся к `messages`: `messages: deny` блокирует и их. `config`, `session`, `doctor`, `recipients`, `mcp` и обслуживание самой базы не ограничиваются.

**По умолчанию разрешено всё, кроме двух необратимых действий**: `messages.delete` и `account.sessions.end` имеют уровень `ask`. Правила ответов не могут отправлять, пока вы это не разрешите: `replies.send` имеет уровень `deny`. Встроенные ограничения могут только усиливаться: `messages: readonly` запрещает удаление, а `messages: allow` сохраняет запрос подтверждения, пока вы явно не настроите `messages.delete`.

```sh
tg config set permissions.messages.delete allow     # delete without the question
tg config set permissions.messages.send ask         # ask before every send
tg config unset permissions.messages.delete         # back to the default
```

Чтобы сделать профиль доступным только для чтения (здесь профиль `agent`), настройте каждый ресурс:

```sh
for key in messages reactions polls topics chats contacts account conversations tags searches replies attachments bot; do
  tg agent config set permissions.$key readonly
done
```

### Подтверждение перед изменением

При уровне `ask` команда `tg` показывает изменение и спрашивает `go ahead? [y/N]`. Любой ответ кроме `y` отменяет действие с кодом `130`. `--allow-dangerous` подтверждает удаление, глобальный `--yes` — остальные изменения. Без терминала, с `--json` или `--jsonl` ответить некому: действие отклоняется с кодом `7`, ошибкой `confirmation_required` и указанием нужного параметра.

### Совместимость со старыми настройками

`readOnly: true` задаёт `readonly` для всех ресурсов. Список в `allow` (`send`, `forward`, `reaction`, `edit`, `pin`, `read`, `delete`, `groups`, `contacts`, `profile`, `folders`, `sessions`) задаёт этим действиям `allow`, а остальным — `readonly`; удаление всё равно требует подтверждения. Ключ в `permissions` того же раздела имеет приоритет над обоими вариантами.

## Изменение через команду

```sh
tg config set limit 50                        # this profile
tg work config set permissions.contacts readonly   # profile "work"; one key at a time
tg config set sendsPerHour 10 --defaults      # every profile
tg config set updateCheck false --defaults    # a setting that exists only under defaults
tg config unset sendsPerHour                  # back to the default
```

`config set` проверяет значения по тем же правилам, что и чтение настроек, и не записывает файл, который другая команда затем отклонит.

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

| Переменная | Назначение |
|---|---|
| `TG_PROFILE` | профиль, если он не указан первым словом команды |
| `TG_PROFILE_LOCK` | фиксирует процесс на одном профиле; остальные запрещены ([Вход и сессии](./sessions.md#profiles)) |
| `TG_TIMEOUT` | как `--timeout`: `500ms`, `30s` или `2m` для всей команды |
| `TG_API_ID`, `TG_API_HASH` | данные приложения вместо хранилища ключей, например для CI; задавайте обе или ни одной |
| `TG_PROXY` | URL прокси, включая пароль или секрет; имеет приоритет над настройкой `proxy` ([выше](#through-a-proxy)) |
| `TG_CONFIG_DIR`, `TG_STATE_DIR`, `TG_CACHE_DIR` | переносят три каталога и связанную запись хранилища ключей |
| `MESSAGING_STORE` | путь к файлу локальной базы |
| `CLI_COMMON_CACHE_DIR` | каталог моделей распознавания речи |
| `TG_NO_UPDATE_CHECK` | `1` отключает ежедневное уведомление о новой версии |
| `NO_COLOR` | отключает цвета в таблицах |
| `XDG_RUNTIME_DIR` | доступ к хранилищу ключей в Linux; часто отсутствует в cron и ssh |

## Временные отдельные настройки

Укажите другое расположение для трёх каталогов, и `tg` получит там новую конфигурацию, вход и историю запусков. Он
не увидит ваш обычный вход, потому что запись в хранилище ключей меняется вместе с каталогами:

```sh
export TG_CONFIG_DIR=/tmp/tg-try/config TG_STATE_DIR=/tmp/tg-try/state TG_CACHE_DIR=/tmp/tg-try/cache
export MESSAGING_STORE=/tmp/tg-try/messages.db
tg setup
```

Без `MESSAGING_STORE` прочитанные этой сессией сообщения всё равно попадут в обычную локальную базу.

## Дальше

- [Безопасность](./security.md) — защита через `permissions`, список получателей и `sendsPerHour`
- [Диагностика](./diagnostics.md) — `record` и `keepRunsForDays`

## Преобразование прежних настроек доступа

`tg config migrate --dry-run --json` показывает замену `readOnly` и `allow` современными
`permissions`, сохраняя действующие уровни доступа личных профилей и ботов в этом файле.
Команда не записывает файл и не подключается к Telegram. `tg config migrate --json` явно
применяет преобразование; процесс, ограниченный одним профилем, не может менять все профили.
Остальные настройки сохраняются. Файлам с современными разрешениями преобразование не нужно.
Если `permissions` уже заданы, `config set` отказывается менять прежние `readOnly` и `allow`;
изменяйте соответствующие ключи разрешений.

У MCP нет серверных форм подтверждения. `deny` и `readonly` запрещают запись; `ask` и `allow`
разрешают запрошенную запись. Повторяйте `--permission key=level` для временных разрешений сервера
([настройка в браузере](./remote.md)). Подтверждение в CLI при `ask` по-прежнему требуется.

`replies.send` по умолчанию имеет уровень `deny`; включение правила само по себе не разрешает отправку. Список тестировщиков — отдельное обязательное условие.

Настройки векторов и анализа независимы и могут различаться по профилям. Переменные окружения
`TG_EMBEDDING_PROVIDER`, `TG_EMBEDDING_MODEL`, `TG_EMBEDDING_BASE_URL`, `TG_EMBEDDING_DIMS`,
`TG_ANALYSIS_PROVIDER`, `TG_ANALYSIS_MODEL`, `TG_ANALYSIS_BASE_URL` имеют приоритет над файлом настроек, а параметры команды — над итоговыми настройками. Адреса должны быть HTTP/S без встроенных учётных данных, параметров запроса и фрагмента. Удалённое построение векторов отправляет и текст поисковых запросов MCP. Ключи задаются через `models text key set openai|anthropic` и хранятся вне `config.json`.
Обычный `build` не запускает удалённый анализ: нужен явный `--analyze`.

## Типы и области действия всех ключей

«Профиль» включает корневые `defaults`, `profiles.<name>`, `personal.defaults`,
`personal.profiles.<name>`, `bot.defaults` и `bot.profiles.<name>`, если ниже не указано ограничение.
Неизвестные ключи и неверные типы — ошибки. Значения по умолчанию и эффекты перечислены выше.

| Ключ | Принятый тип/значение | Сфера применения |
|---|---|---|
| `defaultProfile` | строка с именем профиля | корень файла |
| `limit`, `timeoutMs`, `keepRunsForDays`, `sendsPerHour` | целое число ≥ 1 | профиль |
| `color`, `senderColors`, `catchUpMarksRead`, `searchCatchUp`, `record`, `readOnly` | логическое значение | профиль |
| `permissions` | объект с путями команд и уровнями `deny`, `readonly`, `ask`, `allow` | профиль |
| `allow` | массив разрешённых действий; устаревший формат | профиль |
| `readOtherBots` | логическое значение или массив имён профилей | только бот |
| `updateCheck`, `skillHint` | логическое значение | только корневые `defaults` |
| `transcribeWith` | `auto`, `messenger`, `local` | профиль |
| `speechModel` | идентификатор загруженной модели в виде строки | профиль |
| `proxy` | поддерживаемый URL прокси в виде строки | профиль |
| `embeddingProvider` | `local`, `openai` | профиль |
| `embeddingModel`, `analysisModel` | непустая строка, не более 200 символов | профиль |
| `embeddingBaseUrl`, `analysisBaseUrl` | URL HTTP(S) без учётных данных, строки запроса или фрагмента | профиль |
| `embeddingDims` | Целое число 1-65,536 | профиль |
| `analysisProvider` | `agent`, `openai`, `anthropic` | профиль |
| `models` | объекты назначений, описанные ниже | профиль |
| `searchStemmers.cyrillic` | `russian`, `none` | общее хранилище, через `config set` |
| `searchStemmers.latin` | `spanish`, `english`, `none` | общее хранилище, через `config set` |

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

### Переменные окружения для моделей

Прежние поля принимают `TG_EMBEDDING_PROVIDER`, `TG_EMBEDDING_MODEL`,
`TG_EMBEDDING_BASE_URL`, `TG_EMBEDDING_DIMS`, `TG_ANALYSIS_PROVIDER`,
`TG_ANALYSIS_MODEL` и `TG_ANALYSIS_BASE_URL` с приоритетом над значениями файла.
`TG_MODELS_DEFAULT_PROVIDER`, `TG_MODELS_DEFAULT_MODEL` и `TG_MODELS_DEFAULT_BASE_URL`
задают общие поля в новом формате; замените `DEFAULT` назначением, например `ANALYSIS`.
Пустая переменная не переопределяет настройку. Недопустимые значения возвращают configuration_error.
