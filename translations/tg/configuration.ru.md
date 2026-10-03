---
title: "Настройки"
---

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

⚠ **Это просмотр настроек, а не проверка работоспособности.** Команда только читает файлы: не открывает базу, не обращается к хранилищу ключей и не подключается к Telegram. Проверить сессию можно через `tg doctor --online` ([Решение проблем](./troubleshooting.md#first-tg-doctor)).

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

| Настройка | По умолчанию | Назначение |
|---|---|---|
| `limit` | `20` | строк на странице списка; параметр `--limit` имеет приоритет |
| `timeoutMs` | не задано | время ожидания **одного** запроса к Telegram в миллисекундах. Команда может делать несколько запросов; для ограничения всей команды используйте `--timeout` |
| `color` | зависит от терминала | цвета в таблицах; `NO_COLOR` также отключает их |
| `senderColors` | `false` | отдельный цвет для каждого отправителя в таблице сообщений |
| `record` | `false` | сохранять каждый запуск ([Диагностика](./diagnostics.md)); `--record` и `--no-record` имеют приоритет |
| `keepRunsForDays` | `30` | записи старше этого числа дней удаляются при сохранении следующей |
| `permissions` | всё разрешено; удаление и завершение сессий требуют подтверждения | разрешения профиля для каждой команды ([ниже](#what-a-profile-may-do)) |
| `sendsPerHour` | `30` | максимум отправок за любой час ([Безопасность](./security.md#the-send-guard)) |
| `transcribeWith` | `auto` | распознавание речи: `auto` (Telegram, иначе локальная модель), `messenger` или `local` |
| `speechModel` | не задано | скачанная модель для `--local` (`tg models audio list`) |
| `updateCheck` | `true` | ежедневное уведомление о новой версии; только в `defaults` |
| `skillHint` | `true` | уведомление агенту об отсутствующем или устаревшем skill для tg, не чаще раза в день; только в `defaults` |
| `readOtherBots` | `false` | только для бота: разрешено ли `tg bot` читать данные, сохранённые другими ботами на этом компьютере; `true` или список имён профилей ([Бот Telegram](./bot.md)) |

Поле `defaultProfile` верхнего уровня задаёт профиль, если он не указан первым словом команды или через `TG_PROFILE`.

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

**Ключ — путь команды**: `messages`, `messages.delete`, `messages.send`, `reactions`, `polls.vote`, `chats.mark-read`, `chats.members.remove`, `contacts`, `account.sessions.end`. Он должен начинаться с ресурса: `messages`, `reactions`, `polls`, `topics`, `chats`, `contacts`, `account` или `bot`. **Самый конкретный ключ имеет приоритет**: в примере выше `messages.send` разрешён, а остальные изменения сообщений запрещены. Подстановочных знаков нет: `messages: readonly` не влияет на `reactions`, `polls` или `chats`.

`inbox`, `review`, `watch`, `serve` и `store fetch`, `export`, `search` показывают сообщения и относятся к `messages`: `messages: deny` блокирует и их. `config`, `session`, `doctor`, `recipients`, `mcp` и обслуживание самой базы не ограничиваются.

**По умолчанию разрешено всё, кроме двух необратимых действий**: `messages.delete` и `account.sessions.end` имеют уровень `ask`. Встроенные ограничения могут только усиливаться: `messages: readonly` запрещает удаление, а `messages: allow` сохраняет запрос подтверждения, пока вы явно не настроите `messages.delete`.

```sh
tg config set permissions.messages.delete allow     # delete without the question
tg config set permissions.messages.send ask         # ask before every send
tg config unset permissions.messages.delete         # back to the default
```

Чтобы сделать профиль доступным только для чтения (здесь профиль `agent`), настройте каждый ресурс:

```sh
for key in messages reactions polls topics chats contacts account; do
  tg agent config set permissions.$key readonly
done
```

### Подтверждение перед изменением

При уровне `ask` команда `tg` показывает изменение и спрашивает `go ahead? [y/N]`. Любой ответ кроме `y` отменяет действие с кодом `130`. `--allow-dangerous` подтверждает удаление, глобальный `--yes` — остальные изменения. Без терминала, с `--json` или `--jsonl` ответить некому: действие отклоняется с кодом `7`, ошибкой `confirmation_required` и указанием нужного параметра.

### Совместимость со старыми настройками

`readOnly: true` задаёт `readonly` для всех ресурсов. Список в `allow` (`send`, `forward`, `reaction`, `edit`, `pin`, `read`, `delete`, `groups`, `contacts`, `profile`, `folders`, `sessions`) задаёт этим действиям `allow`, а остальным — `readonly`; удаление всё равно требует подтверждения. Ключ в `permissions` имеет приоритет над обоими вариантами.

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

## Переменные окружения

| Переменная | Назначение |
|---|---|
| `TG_PROFILE` | профиль, если он не указан первым словом команды |
| `TG_PROFILE_LOCK` | фиксирует процесс на одном профиле; остальные запрещены ([Вход и сессии](./sessions.md#profiles)) |
| `TG_TIMEOUT` | как `--timeout`: `500ms`, `30s` или `2m` для всей команды |
| `TG_API_ID`, `TG_API_HASH` | данные приложения вместо хранилища ключей, например для CI; задавайте обе или ни одной |
| `TG_CONFIG_DIR`, `TG_STATE_DIR`, `TG_CACHE_DIR` | переносят три каталога и связанную запись хранилища ключей |
| `MESSAGING_STORE` | путь к файлу локальной базы |
| `CLI_COMMON_CACHE_DIR` | каталог моделей распознавания речи |
| `TG_NO_UPDATE_CHECK` | `1` отключает ежедневное уведомление о новой версии |
| `NO_COLOR` | отключает цвета в таблицах |
| `XDG_RUNTIME_DIR` | доступ к хранилищу ключей в Linux; часто отсутствует в cron и ssh |

## Временные отдельные настройки

Укажите другие пути к трём каталогам, чтобы использовать отдельные настройки, сессию и записи запусков. Обычная сессия не будет видна: запись хранилища ключей тоже меняется.

```sh
export TG_CONFIG_DIR=/tmp/tg-try/config TG_STATE_DIR=/tmp/tg-try/state TG_CACHE_DIR=/tmp/tg-try/cache
export MESSAGING_STORE=/tmp/tg-try/messages.db
tg session start
```

Без `MESSAGING_STORE` прочитанные этой сессией сообщения всё равно попадут в обычную локальную базу.

## Дальше

- [Безопасность](./security.md) — защита через `permissions`, список получателей и `sendsPerHour`
- [Диагностика](./diagnostics.md) — `record` и `keepRunsForDays`
