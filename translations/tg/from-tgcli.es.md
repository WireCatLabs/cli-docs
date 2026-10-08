---
title: "Migración desde tgcli"
---

[tgcli](https://github.com/dapi/tgcli) es otro cliente de línea de comandos para una cuenta personal de Telegram.
Esta página enumera cada comando de tgcli y su equivalente en `tg`. Cuando `tg` no tiene un equivalente,
la fila lo indica y explica el motivo.

En `tg`, el chat se indica como argumento, no con `--chat` ni `--to`: `tg messages send "Book club" "hi"`.
Todos los comandos aceptan `--json` ([cli-contract.md](./cli-contract.md)).

## Inicio de sesión, perfiles y servicio en segundo plano

| tgcli | tg |
|---|---|
| `auth`, `auth --qr` | `tg session start` (QR por defecto), `tg session start phone` |
| `auth --force-sms` | `tg session start phone --sms` |
| `auth status` | `tg account show`, `tg doctor --online` |
| `auth logout` | `tg session end` |
| `accounts add`, `--account <id>` | un perfil: `tg work chats list` o `TG_PROFILE=work` ([profiles.md](./profiles.md)) |
| `config get/set/unset` | `tg config show/set/unset` ([configuration.md](./configuration.md)) |
| ajuste `proxy`, `TELEGRAM_PROXY` | ajuste `proxy`, `TG_PROXY` ([configuration-reference.md](./configuration-reference.md#through-a-proxy)) |
| `server`, `service install/start/stop/status/logs` | `tg serve`, `tg server start/stop/status/logs/install` |
| MCP mediante HTTP (`mcp.enabled`) | `tg mcp --http` ([mcp.md](./mcp.md), [remote.md](./remote.md)) |
| `sync --once`, `sync --follow` | `tg store fetch`, `tg serve` ([archive.md](./archive.md)) |
| `sync jobs list/add/retry/cancel` | `tg store fetch --background`, `tg store jobs list/show/retry/cancel/clear` |
| `owner request <id>` | `tg sends list` y `--send-id` para repetir un envío de resultado desconocido |
| `doctor` | `tg doctor` |

## Lectura y búsqueda

| tgcli | tg |
|---|---|
| `channels list`, `groups list` | `tg chats list --kind channel`, `--kind group` |
| `channels show`, `groups info`, `metadata get` | `tg chats show <chat>` |
| `topics list/search` | `tg topics list/search <chat>` |
| `messages list --chat … --topic …` | `tg messages list <chat> --topic <id>` |
| `messages list --after/--before` | `--after-time`, `--before-time`, `--after-id`, `--before-id` |
| `messages show`, `messages context` | `tg messages show`, `tg messages context` |
| `messages search --after --before --tag --topic --regex` | consulta: `date:7d tag:work topic:12`, `--regex` ([query-language.md](./query-language.md)) |
| `messages search --source live/both` | `tg messages search --backend server/both` ([search.md](./search.md)) |
| `media download` | `tg messages download <chat> <id>`, o un chat completo con `--all` |
| `contacts search`, `contacts show` | `tg contacts list --search`, `tg contacts show`, `tg contacts profile` |

## Enviar

| tgcli | tg |
|---|---|
| `send text`, `send photo`, `send file` | `tg messages send <chat> [text]`, con `--photo` o `--file` |
| `--parse-mode markdown` | `--md` ([usage.md](./usage.md#sending)) |
| `--parse-mode html` | `--html` |
| `--reply-to`, `--topic`, `--silent`, `--no-preview` | las mismas opciones |
| `--schedule <iso>` | `--at-time <time>` |
| `--spoiler`, `--caption-above` | las mismas opciones |
| `--force-document` | `--as-file` |
| `--filename` | `--filename` |
| `--retries`, `--retry-backoff` | no hacen falta: una carga interrumpida se reintenta automáticamente y nunca se envía dos veces |
| `--no-forwards` | no es posible: Telegram solo permite a los bots proteger un mensaje individual. Activa la protección de contenido propia del chat en Telegram. |

## Grupos y carpetas

| tgcli | tg |
|---|---|
| `groups rename` | `tg chats update <chat> --title` |
| `groups members add/remove` | `tg chats members add/remove` |
| `groups invite get`, `groups invite revoke` | `tg chats link show`, `tg chats link reset` |
| `groups invite edit --request-needed` | `tg chats link create <chat> --approval`, o `tg chats update <chat> --join-approval on` |
| `groups requests list/approve/decline` | `tg chats requests list`, `tg chats requests accept/decline <chat> <person>` |
| `groups requests list --query`, `--link` | `tg chats requests list --search`, `--link` |
| `groups join`, `groups leave` | `tg chats join <link>`, `tg chats leave <chat>` |
| `folders list/create/edit/delete` | `tg chats folders list/create/update/delete` |
| `folders show` | `tg chats folders show <folder>` |
| `folders create/edit --include-contacts … --include-bots` | `--include contacts,non-contacts,groups,channels,bots` |
| `folders create/edit --exclude-muted`, `--exclude-read`, `--exclude-archived` | `--skip muted,read,archived` |
| `folders create/edit --exclude-chat`, `--pin-chat`, `--emoji` | `--exclude-chat`, `--pin`, `--emoji` |
| `folders reorder` | `tg chats folders order` |
| `folders chats add/remove` | `tg chats folders update --add/--remove` |
| `folders chats join` (un enlace de carpeta compartida) | `tg chats folders join <link>` |

## Tus propias notas sobre chats y personas

| tgcli | tg |
|---|---|
| `tags set/list/search` en un canal | `tg tags add/remove/list --chat`, y `tag:` en una búsqueda |
| `contacts tags add/rm` | `tg tags add/remove --contact` |
| `contacts alias set/rm` | `tg contacts alias set/rm`: un nombre privado solo en este ordenador; `tg contacts rename` cambia tus contactos de Telegram |
| `contacts notes set` | `tg contacts notes add/edit/remove`, varias notas por persona, en este ordenador solamente |
| `metadata refresh --only-missing` | `tg metadata refresh --only-missing` |
| `tags auto`, `metadata refresh` | `tg tags auto`, `tg metadata refresh` |




