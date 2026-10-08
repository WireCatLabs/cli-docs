---
title: "Переход с tgcli"
---

[tgcli](https://github.com/dapi/tgcli) — другой клиент командной строки для личного аккаунта Telegram.
Эта страница перечисляет команды tgcli и их аналоги в `tg`. Если аналога в `tg` нет,
строка сообщает об этом и объясняет причину.

В `tg` чат указывается аргументом, а не через `--chat` или `--to`: `tg messages send "Book club" "hi"`.
Все команды принимают `--json` ([cli-contract.md](./cli-contract.md)).

## Вход, профили и фоновая служба

| tgcli | tg |
|---|---|
| `auth`, `auth --qr` | `tg session start` (QR по умолчанию), `tg session start phone` |
| `auth status` | `tg account show`, `tg doctor --online` |
| `auth logout` | `tg session end` |
| `accounts add`, `--account <id>` | профиль: `tg work chats list` или `TG_PROFILE=work` ([profiles.md](./profiles.md)) |
| `config get/set/unset` | `tg config show/set/unset` ([configuration.md](./configuration.md)) |
| настройка `proxy`, `TELEGRAM_PROXY` | настройка `proxy`, `TG_PROXY` ([configuration-reference.md](./configuration-reference.md#through-a-proxy)) |
| `server`, `service install/start/stop/status/logs` | `tg serve`, `tg server start/stop/status/logs/install` |
| MCP через HTTP (`mcp.enabled`) | `tg mcp --http` ([mcp.md](./mcp.md), [remote.md](./remote.md)) |
| `sync --once`, `sync --follow` | `tg store fetch`, `tg serve` ([archive.md](./archive.md)) |
| `sync jobs list/add/retry/cancel` | `tg store fetch --background`, `tg store jobs list/show/cancel` |
| `owner request <id>` | `tg sends list` и `--send-id` для повторения отправки с неизвестным исходом |
| `doctor` | `tg doctor` |

## Чтение и поиск

| tgcli | tg |
|---|---|
| `channels list`, `groups list` | `tg chats list --kind channel`, `--kind group` |
| `channels show`, `groups info`, `metadata get` | `tg chats show <chat>` |
| `topics list/search` | `tg topics list/search <chat>` |
| `messages list --chat … --topic …` | `tg messages list <chat> --topic <id>` |
| `messages list --after/--before` | `--after-time`, `--before-time`, `--after-id`, `--before-id` |
| `messages show`, `messages context` | `tg messages show`, `tg messages context` |
| `messages search --after --before --tag --topic --regex` | запрос: `date:7d tag:work topic:12`, `--regex` ([query-language.md](./query-language.md)) |
| `messages search --source live/both` | `tg messages search --backend server/both` ([search.md](./search.md)) |
| `media download` | `tg messages download <chat> <id>`, или полный чат с `--all` |
| `contacts search`, `contacts show` | `tg contacts list --search`, `tg contacts show`, `tg contacts profile` |

## Отправка

| tgcli | tg |
|---|---|
| `send text`, `send photo`, `send file` | `tg messages send <chat> [text]`, с `--photo` или `--file` |
| `--parse-mode markdown` | `--md` ([usage.md](./usage.md#sending)) |
| `--parse-mode html` | `--html` |
| `--reply-to`, `--topic`, `--silent`, `--no-preview` | те же флаги |
| `--schedule <iso>` | `--at-time <time>` |
| `--spoiler`, `--caption-above` | те же флаги |
| `--force-document` | `--as-file` |
| `--filename` | `--filename` |
| `--retries`, `--retry-backoff` | не нужны: прерванная загрузка повторяется автоматически, без повторной отправки |
| `--no-forwards` | невозможно: Telegram позволяет защитить отдельное сообщение только ботам. Включите собственную защиту содержимого чата в Telegram. |

## Группы и папки

| tgcli | tg |
|---|---|
| `groups rename` | `tg chats update <chat> --title` |
| `groups members add/remove` | `tg chats members add/remove` |
| `groups invite get`, `groups invite revoke` | `tg chats link show`, `tg chats link reset` |
| `groups invite edit --request-needed` | `tg chats link create <chat> --approval`, или `tg chats update <chat> --join-approval on` |
| `groups requests list/approve/decline` | `tg chats requests list`, `tg chats requests accept/decline <chat> <person>` |
| `groups requests list --query`, `--link` | пока нет в tg: `requests list` показывает все ожидающие запросы |
| `groups join`, `groups leave` | `tg chats join <link>`, `tg chats leave <chat>` |
| `folders list/create/edit/delete` | `tg chats folders list/create/update/delete` |
| `folders create/edit --include-contacts`, `--exclude-muted` и другие правила | пока нет в tg: папка tg содержит указанные вами чаты |
| `folders create/edit --exclude-chat`, `--pin-chat`, `--emoji` | пока нет в tg |
| `folders reorder` | `tg chats folders order` |
| `folders chats add/remove` | `tg chats folders update --add/--remove` |
| `folders chats join` (ссылка на общую папку) | `tg chats folders join <link>` |

## Ваши заметки о чатах и людях

| tgcli | tg |
|---|---|
| `tags set/list/search` на канале | `tg tags add/remove/list --chat` и `tag:` в поиске |
| `contacts tags add/rm` | `tg tags add/remove --contact` |
| `contacts alias set/rm` | `tg contacts alias set/rm`: личное имя только на этом компьютере; `tg contacts rename` меняет ваши контакты Telegram |
| `contacts notes set` | `tg contacts notes add/edit/remove`, несколько заметок на человека, только на этом компьютере |
| `tags auto`, `metadata refresh` | `tg tags auto`, `tg metadata refresh` |
