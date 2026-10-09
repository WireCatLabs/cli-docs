---
title: "Referencia de comandos"
---

<!-- Generado desde el árbol de comandos por scripts/commands.ts. No editar el original; `pnpm generate`. -->


Referencia de todas las órdenes, opciones y códigos de salida. La página se **genera desde el
propio programa**, por lo que no puede describir una versión que no existe.

`chats send-as` y `--send-as` aún no están disponibles para MAX: el comando rechaza la operación antes de enviar.

Estructura del comando:

```sh
max [профиль] [опции] <команда> <действие> [аргументы]
```

**La primera palabra es el perfil** si no coincide con un comando: `max personal chats list`
consulta los chats de `personal`, y `max chats list` los del perfil predeterminado. También puedes usar
la variable `MAX_PROFILE`; sin ella el perfil se llama `default`.

Las descripciones se han traducido para esta guía. La salida literal de `max --help` sigue en inglés;
los nombres de los comandos, opciones y códigos de salida no cambian.

## Opciones generales

Se aplican a todos los comandos.

| Opción | Para qué sirve |
|---|---|
| `-V, --version` | output the version number. |
| `-v, --verbose` | more detail in what is shown: -v ids, -vv everything we know. Por defecto: `0`. |
| `--json` | machine-readable output: one JSON value on stdout, nothing else. |
| `--jsonl` | machine-readable output: one JSON object per line, for streaming and jq. |
| `--quiet` | diagnostics off. |
| `--trace` | one line per request on stderr: ids and timings, never message content. |
| `--timeout <duration>` | give up on the whole command after this — 30s, 2m, 500ms. |
| `--offline` | answer from what was recorded and never connect; fails if nothing was. |
| `--no-input` | no pedir entrada ni abrir un inicio de sesión interactivo; la entrada mediante una tubería sigue disponible. |
| `--max-input-bytes <bytes>` | máximo de bytes de entrada almacenados en búfer (predeterminado: 16777216). |
| `--max-output-bytes <bytes>` | máximo de bytes de salida para máquinas (predeterminado: 4194304; 0 desactiva el límite). |
| `--fields <paths>` | campos de elementos o del objeto separados por comas: id,text; conservar la paginación y los identificadores de operaciones. |
| `--dry-run` | previsualizar los argumentos analizados y los permisos antes de ejecutar la acción. |
| `--yes` | go ahead without the question an ask level puts before a write. |
| `--record` | keep this run under `max runs` — ids and timings, never message content. |
| `--no-record` | do not keep it, whatever the configuration says. |
| `--serve` | start `max serve` in the background if it is not running (the default). |
| `--no-serve` | do not start it; log in on this command's own connection unless one is running. |

## `max session`

the stored MAX session for this profile

### `max session start`

log this profile in to MAX

```sh
max session start [method]
```

| Argumento | | Qué es |
|---|---|---|
| `method` | opcional | token (pasted or piped), qr, qr-chrome or sms. Uno de: `token`, `qr`, `qr-chrome`, `sms`. Por defecto: `token`. |

### `max session end`

cerrar la sesión de este perfil en MAX y eliminar la sesión guardada aquí

**Cambia algo en MAX.**

```sh
max session end
```

## `max setup`

set up your personal MAX account and connect your agent

**Cambia algo en MAX.**

```sh
max setup [options]
```

| Opción | Para qué sirve |
|---|---|
| `--agent <agent>` | install the skill for this agent; asks at a terminal, otherwise none. Uno de: `none`, `codex`, `cursor`, `claude`, `gemini`, `all`. |
| `--method <method>` | how to log in when there is no session. Uno de: `token`, `qr`, `qr-chrome`, `sms`. Por defecto: `qr`. |

## `max account`

the logged-in account

### `max account list`

todos los perfiles de este ordenador y sus cuentas; no consulta el mensajero

```sh
max account list
```


### `max account show`

who this profile is logged in as; the phone number shows its last four digits

```sh
max account show [options]
```

| Opción | Para qué sirve |
|---|---|
| `--show-phone` | print the whole phone number. |

### `max account update`

change the name, the description or the photo everyone sees on your profile

**Cambia algo en MAX.**

```sh
max account update [options]
```

| Opción | Para qué sirve |
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
max account sessions list
```

#### `max account sessions end`

log out every other device, your phone included; this one stays

**Cambia algo en MAX.**

```sh
max account sessions end [options]
```

| Opción | Para qué sirve |
|---|---|
| `--others` | every session but this one. |

### `max account privacy`

quién puede encontrar la cuenta, llamar o añadirla

#### `max account privacy show`

ajustes de privacidad de la cuenta; leerlos no cambia nada

```sh
max account privacy show
```

#### `max account privacy set`

cambiar quién puede encontrar la cuenta, llamar o añadirla; los demás ajustes se conservan

**Cambia algo en MAX.**

```sh
max account privacy set [options]
```

| Opción | Para qué sirve |
|---|---|
| `--find-by-phone <who>` | quién encuentra la cuenta por su número: everyone, contacts o nobody; MAX admite everyone y contacts. |
| `--phone-number <who>` | quién ve el número: everyone, contacts o nobody. |
| `--calls <who>` | quién puede llamar: everyone, contacts o nobody. |
| `--chat-invites <who>` | quién puede añadir la cuenta a grupos y canales: everyone, contacts o nobody. |
| `--hide-online <on\|off>` | ocultar el estado en línea y la última conexión. |

## `max calls`

llamadas de la cuenta

### `max calls list`

llamadas realizadas y recibidas, las más recientes primero; leerlas no cambia nada

```sh
max calls list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | how many to show. |

## `max stickers`

stickers añadidos a la cuenta

### `max stickers list`

paquetes de stickers; con --set, los stickers de uno; leerlos no cambia nada

```sh
max stickers list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--set <id>` | los stickers de este paquete. |

## `max chats`

the chats this account is in

### `max chats list`

chats, newest first, archived ones included

```sh
max chats list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |
| `--search <text>` | only chats whose name contains this; at least 3 characters. |
| `--kind <kind>` | only chats of this kind: dialog, group, channel, saved. |
| `--unread` | only chats with unread messages. |

### `max chats show`

one chat: its kind, unread count, last message time and who is in it

```sh
max chats show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

### `max chats events`

who joined, left, was added or removed, and by whom — from the chat's service messages

```sh
max chats events <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--since-time <time>` | ISO 8601, or 2h / 1d ago; 7 days ago if not given. |
| `--type <names>` | only these, comma-separated: join, leave, add, remove, create, title, pin. |

### `max chats inspect`

what an invite or public link leads to, without joining it

```sh
max chats inspect <link>
```

| Argumento | | Qué es |
|---|---|---|
| `link` | obligatorio | an invite link or a public one. |

### `max chats join`

join a group or channel by its link; the others in it see that you joined

**Cambia algo en MAX.**

```sh
max chats join <link>
```

| Argumento | | Qué es |
|---|---|---|
| `link` | obligatorio | an invite link, or a public one. |

### `max chats mark-read`

mark a chat read; the other side sees that you read it

**Cambia algo en MAX.**

```sh
max chats mark-read <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--until <message>` | only up to this message id; the newest by default. |
| `--topic <id>` | mark only this forum topic read; unsupported by messengers without topics. |

### `max chats leave`

leave a group or channel; the others in it see that you left

**Cambia algo en MAX.**

```sh
max chats leave <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

### `max chats create`

create a group or a channel; the people added are told

**Cambia algo en MAX.**

```sh
max chats create <title> [person] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `title` | obligatorio | the group's name. |
| `person` | opcional | people to add: an id, or part of a name. |

| Opción | Para qué sirve |
|---|---|
| `--channel` | a private channel instead of a group; people join it by its link. |

### `max chats members`

who is in a group

#### `max chats members list`

everyone in a group, a page at a time, with their role and when they were last seen

```sh
max chats members list <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

#### `max chats members audit`

members that look like bots, each with its reasons — read from the member list and the local store; never one request per person, and it removes nobody

```sh
max chats members audit <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--budget <pages>` | at most this many pages of 200 members, a pause between them (default: 10). |
| `--min-score <n>` | only members scoring at least this; 1 lists everyone with a reason (default: 2). |
| `--deep <n>` | comprueba también a las primeras n personas en detalle — perfil, fotos y todo lo que escribieron — a una persona por segundo; las listas públicas de bloqueos solo cubren Telegram, por lo que no se envía nada. |

#### `max chats members history`

who joined, who left and whose profile changed, oldest first — what chats members fetch recorded in the local store; never asks the messenger

```sh
max chats members history <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--since-time <time>` | ISO 8601, or 2h / 1d ago; everything recorded if not given. |

#### `max chats members fetch`

read a group's whole member list into the local store's member history: who joined, who left, daily counts and profile changes; someone is recorded as gone only when every member was read

```sh
max chats members fetch <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--track` | descargarla también a diario mientras se ejecuta serve; chats tracking enumera y modifica esos chats. |
| `--budget <pages>` | at most this many pages of 200 members, a pause between them (default: 10). |

#### `max chats members add`

add people; they are told

**Cambia algo en MAX.**

```sh
max chats members add <chat> <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `person` | obligatorio | an id, or part of a name. |

| Opción | Para qué sirve |
|---|---|
| `--history` | the people added also see the messages from before they came. |

#### `max chats members remove`

remove people; their messages stay

**Cambia algo en MAX.**

```sh
max chats members remove <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `person` | obligatorio | an id, or part of a name. |

### `max chats tracking`

los chats cuyas listas de miembros descarga serve a diario al almacenamiento local — chats members fetch --track añade uno

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

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

#### `max chats tracking add`

descargar a diario la lista de miembros de este chat mientras se ejecuta serve, a partir de su siguiente ejecución

```sh
max chats tracking add <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

#### `max chats tracking remove`

dejar de descargarla a diario; se conserva el historial ya guardado

```sh
max chats tracking remove <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

### `max chats admins`

give or take back a member's admin rights

#### `max chats admins add`

make a member an admin with these rights

**Cambia algo en MAX.**

```sh
max chats admins add <chat> <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `person` | obligatorio | an id, or part of a name. |

| Opción | Para qué sirve |
|---|---|
| `--can <rights>` | what they may do, comma-separated: read, members, admins, info, pin, link, post, edit, delete. |

#### `max chats admins remove`

take an admin's rights back; they stay a member

**Cambia algo en MAX.**

```sh
max chats admins remove <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `person` | obligatorio | an id, or part of a name. |

### `max chats update`

rename a group or channel, change its description, or turn one of its settings on or off

**Cambia algo en MAX.**

```sh
max chats update <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--title <title>` | the new name. |
| `--description <text>` | the new description. |
| `--photo <file>` | una nueva foto: un archivo de imagen. |
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

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

#### `max chats link reset`

replace the invite link; the old one stops working

**Cambia algo en MAX.**

```sh
max chats link reset <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

### `max chats requests`

solicitudes de entrada con aprobación administrativa

#### `max chats requests list`

quién solicitó entrar, lo reciente primero; solo administradores, sin notificaciones

```sh
max chats requests list <chat> [options]
```

| Argumento | | Significado |
|---|---|---|
| `chat` | obligatorio | Chat: nombre, ID o @username. |

| Opción | Función |
|---|---|
| `--limit <n>` | Número de resultados. |
| `--search <text>` | Buscar por nombre o @username. |
| `--link <link>` | Filtro por enlace de invitación; MAX no lo admite. |

#### `max chats requests accept`

aceptar; el grupo ve la entrada

**Cambia algo en MAX.**

```sh
max chats requests accept <chat> [person] [options]
```

| Argumento | | Significado |
|---|---|---|
| `chat` | obligatorio | Chat: nombre, ID o @username. |
| `person` | opcional | ID de `chats requests list`; en MAX elige una persona concreta. |

| Opción | Función |
|---|---|
| `--all` | Todas las solicitudes; MAX no lo admite. |
| `--link <link>` | Filtro por enlace de invitación; MAX no lo admite. |

#### `max chats requests decline`

rechazar la solicitud

**Cambia algo en MAX.**

```sh
max chats requests decline <chat> [person] [options]
```

| Argumento | | Significado |
|---|---|---|
| `chat` | obligatorio | Chat: nombre, ID o @username. |
| `person` | opcional | ID de `chats requests list`; en MAX elige una persona concreta. |

| Opción | Función |
|---|---|
| `--all` | Todas las solicitudes; MAX no lo admite. |
| `--link <link>` | Filtro por enlace de invitación; MAX no lo admite. |

### `max chats folders`

your chat folders

#### `max chats folders list`

your chat folders, in the order the app shows them

```sh
max chats folders list
```

#### `max chats folders show`

una carpeta con los nombres de sus chats

```sh
max chats folders show <folder>
```

| Argumento | | Qué es |
|---|---|---|
| `folder` | obligatorio | ID de la carpeta o título exacto. |


#### `max chats folders create`

create a chat folder

**Cambia algo en MAX.**

```sh
max chats folders create <title> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `title` | obligatorio | the folder's name; the app may refuse a long one. |

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | a chat to put in it, by id or name; repeat it for more. |

#### `max chats folders update`

rename a folder, or change which chats are in it

**Cambia algo en MAX.**

```sh
max chats folders update <folder> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `folder` | obligatorio | folder id, or its title exactly. |

| Opción | Para qué sirve |
|---|---|
| `--title <title>` | a new name. |
| `--add <chat>` | put a chat in it; repeat it for more. |
| `--remove <chat>` | quitar el chat de la carpeta y de las listas de excluidos y fijados; repetir para varios. |

#### `max chats folders delete`

delete a folder; the chats in it stay

**Cambia algo en MAX.**

```sh
max chats folders delete <folder>
```

| Argumento | | Qué es |
|---|---|---|
| `folder` | obligatorio | folder id, or its title exactly. |

#### `max chats folders order`

colocar las carpetas en este orden; las que no se nombran conservan su orden después de ellas

**Cambia algo en MAX.**

```sh
max chats folders order <folders>
```

| Argumento | | Qué es |
|---|---|---|
| `folders` | obligatorio | ID de las carpetas o sus títulos exactos, en el orden deseado. |

### `max chats rules`

what `chats moderate` judges a group by, kept in a file of this profile

#### `max chats rules show`

the group's rules; the defaults, marked not saved, if it has none yet

```sh
max chats rules show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

#### `max chats rules set`

change one rule; the group's first change writes every rule with its default

**Cambia algo solo en este ordenador.**

```sh
max chats rules set <chat> <key> <value>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `key` | obligatorio | one of: trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove. |
| `value` | obligatorio | the new value; a list is comma-separated. |

#### `max chats rules unset`

put one rule back to its default

**Cambia algo solo en este ordenador.**

```sh
max chats rules unset <chat> <key>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `key` | obligatorio | one of: trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove. |

### `max chats moderate`

judge a group's new messages and members by its rules, and act as they allow

**Cambia algo en MAX.**

```sh
max chats moderate <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--since-time <time>` | judge what came after this ISO 8601 time, or 2h / 1d ago; the saved point stays. |
| `--dry-run` | judge and plan; do nothing. |
| `--allow-dangerous` | yes to every action whose level in the group's rules is ask. |
| `--max-actions <n>` | at most this many actions in one run; 10 if not given. |

### `max chats media`

fotos, vídeos, archivos, audio y enlaces del chat desde el servidor; leerlos no marca nada

```sh
max chats media <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--type <names>` | solo estos tipos, separados por comas: photo, video, file, audio, link. |
| `--limit <n>` | how many to show. |
| `--before-id <id>` | leer lo anterior a este id de mensaje. |

### `max chats mute`

silenciar el chat para siempre o hasta una fecha; no se avisa a sus miembros

**Cambia algo en MAX.**

```sh
max chats mute <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--until <time>` | solo hasta entonces: 2026-09-25T09:00 (hora local), o dentro de 30m, 2h, 7d. |

### `max chats unmute`

volver a activar las notificaciones del chat

**Cambia algo en MAX.**

```sh
max chats unmute <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

### `max chats delete`

eliminar el chat para esta cuenta; los demás conservan el chat y sus mensajes

**Cambia algo en MAX.**

```sh
max chats delete <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--allow-dangerous` | go ahead without the question an ask level puts before a deletion. |

### `max chats clear`

eliminar todos los mensajes del chat para esta cuenta; los demás conservan los suyos

**Cambia algo en MAX.**

```sh
max chats clear <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--allow-dangerous` | go ahead without the question an ask level puts before a deletion. |

### `max chats start`

iniciar un bot como su botón Inicio; el bot ve que lo iniciaste

**Cambia algo en MAX.**

```sh
max chats start <bot> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `bot` | obligatorio | chat con el bot — ID o nombre — o enlace al bot, incluso si nunca lo abriste. |

| Opción | Para qué sirve |
|---|---|
| `--payload <text>` | parámetro de inicio que lee el bot; usa ?start= del enlace si se omite. |


### `max chats app`

dirección de la miniaplicación del bot con tu sesión; mantenla privada

**Cambia algo en MAX.**

```sh
max chats app <bot> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `bot` | obligatorio | chat con el bot: ID o nombre. |

| Opción | Para qué sirve |
|---|---|
| `--start <param>` | parámetro de inicio que lee la aplicación. |


## `max contacts`

people you have a one-to-one chat with

### `max contacts list`

people you have a one-to-one chat with

```sh
max contacts list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |
| `--order <recent\|name>` | newest conversation first, or alphabetical. Por defecto: `recent`. |
| `--search <text>` | solo personas cuyo nombre, alias local o @username contiene este texto. |
| `--search-notes <text>` | solo personas cuyas notas privadas contienen este texto. |

### `max contacts show`

one person and the chats you share with them

```sh
max contacts show <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | their id, @username, or part of their name. |

| Opción | Para qué sirve |
|---|---|
| `--with-notes` | incluir tus notas privadas, sujeto al permiso contacts.notes.list. |

### `max contacts profile`

todo lo que el servicio de mensajería informa sobre una persona —identificadores, indicadores, última conexión y cuándo se registró— y cuántos de sus mensajes guarda el almacenamiento en cada chat que compartís, el primero y el último, y los nombres y nombres de usuario anteriores que registró el almacenamiento

```sh
max contacts profile <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | their id, @username, or part of their name. |

| Opción | Para qué sirve |
|---|---|
| `--show-phone` | print the whole phone number. |

### `max contacts alias`

un nombre visible local y privado en la cuenta seleccionada

#### `max contacts alias set`



**Cambia algo solo en este ordenador.**

```sh
max contacts alias set <person> <alias>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio |  |
| `alias` | obligatorio |  |

#### `max contacts alias rm`



**Cambia algo solo en este ordenador.**

```sh
max contacts alias rm <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio |  |

### `max contacts notes`

notas privadas del contacto, compartidas por las cuentas que lo ven

#### `max contacts notes list`



```sh
max contacts notes list <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio |  |

#### `max contacts notes show`



```sh
max contacts notes show <person> <id>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio |  |
| `id` | obligatorio |  |

#### `max contacts notes add`



**Cambia algo solo en este ordenador.**

```sh
max contacts notes add <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio |  |

| Opción | Para qué sirve |
|---|---|
| `--file <path>` | leer el texto de la nota desde un archivo; si se omite o se indica -, leer stdin. |

#### `max contacts notes edit`



**Cambia algo solo en este ordenador.**

```sh
max contacts notes edit <person> <id> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio |  |
| `id` | obligatorio |  |

| Opción | Para qué sirve |
|---|---|
| `--file <path>` | leer el texto de la nota desde un archivo; si se omite o se indica -, leer stdin. |
| `--revision <number>` | la revisión que leíste antes de editar. |

#### `max contacts notes remove`



**Cambia algo solo en este ordenador.**

```sh
max contacts notes remove <person> <id>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio |  |
| `id` | obligatorio |  |

### `max contacts sync`

forget where the last sync left off and take the whole list again

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

**Cambia algo en MAX.**

```sh
max contacts add <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | person id — `contacts lookup` finds one — or part of a known name. |

### `max contacts remove`

remove a person from your contacts; the chat stays, a name you gave them may not

**Cambia algo en MAX.**

```sh
max contacts remove <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | person id — `contacts lookup` finds one — or part of a known name. |

### `max contacts block`

stop a person from writing to you — they need not be a contact

**Cambia algo en MAX.**

```sh
max contacts block <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | person id — `contacts lookup` finds one — or part of a known name. |

### `max contacts unblock`

let a blocked person write to you again

**Cambia algo en MAX.**

```sh
max contacts unblock <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | person id — `contacts lookup` finds one — or part of a known name. |

### `max contacts rename`

renombrar el contacto en la libreta de direcciones del servicio de mensajería; usa contacts alias para un nombre local privado

**Cambia algo en MAX.**

```sh
max contacts rename <person> <first-name> [last-name]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | person id — `contacts lookup` finds one — or part of a known name. |
| `first-name` | obligatorio | the name you want to see for them. |
| `last-name` | opcional |  |

### `max contacts import`

upload phone numbers and add the people the messenger has under them

**Cambia algo en MAX.**

```sh
max contacts import <file>
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio | one person per line: number, then a comma, a tab or a semicolon, then the name. |

### `max contacts context`

what the store holds about one person, in every messenger linked to them: shared chats, the last messages each way, their recent messages, where others mentioned them — never connects

```sh
max contacts context <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | their id, @username, or part of their name. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | at most this many messages in each list; 10 if not given. |
| `--since-time <time>` | nothing older than this ISO 8601 time, or 2h / 1d ago. |
| `--chat <chat>` | a chat, by id or name; repeat it for more — then their newest messages in each, 20 unless --limit, short unless -v. |
| `--refresh` | with --chat, read their newest messages in each from the messenger first. |

### `max contacts check`

comprueba si una persona parece un bot, una cuenta falsa o un spammer a partir de su perfil y sus mensajes en el almacén: es una pista, nunca un veredicto; las listas públicas de bloqueos solo cubren Telegram, por lo que no se envía nada

```sh
max contacts check <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | their id, @username, or part of their name. |

| Opción | Para qué sirve |
|---|---|
| `--no-registries` | do not ask the public ban lists; nothing about them leaves this machine. |

### `max contacts link`

record that two people in the store are one person — the same name is never enough

```sh
max contacts link <person> <other>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | their id, @username, or part of their name. |
| `other` | obligatorio | the same in another messenger of the store, as <messenger>:<person> — max:Ana. |

### `max contacts unlink`

undo contacts link for one identity: it is a person of its own again

```sh
max contacts unlink <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | their id, @username, or part of their name; <messenger>:<person> for another messenger. |

## `max messages`

read and send messages in a chat

### `max messages list`

a chat's messages, oldest to newest

```sh
max messages list <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | how many. |
| `--before-id <id>` | only messages older than this message id. |
| `--before-time <time>` | only messages older than this ISO 8601 time, or 2h / 1d ago. |
| `--after-id <id>` | only messages newer than this message id. |
| `--after-time <time>` | only messages newer than this ISO 8601 time, or 2h / 1d ago. |
| `--transcribe` | turn voice messages not heard yet into text — by the messenger, or a model on this machine; can take minutes. |
| `--model <id>` | which downloaded speech model hears them, with --transcribe; `models audio list` shows them. |
| `--mark-read` | also mark the chat read up to the newest message shown; the other person sees it. |

### `max messages search`

buscar en el almacenamiento local y en el servidor del servicio de mensajería (--backend); opcionalmente descargar mensajes nuevos con --sync-first

```sh
max messages search [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | strict Lucene query: words, "phrases", AND/OR/NOT, field groups and date ranges; --language legacy keeps discovery; with --saved, more words AND-ed to it. |

| Opción | Para qué sirve |
|---|---|
| `--sync-first` | first fetch new messages within the chat, time and message bounds. |
| `--max-chats <n>` | refresh at most this many chats (default: 5). |
| `--sync-time <duration>` | stop fetching after this long (default: 30s). |
| `--max-messages <n>` | fetch at most this many messages total (default: 500). |
| `--thread` | the stored reply chain and replies instead of time neighbours; falls back when no graph exists. |
| `--thread-hops <n>` | at most this many links from the hit (default: 8). |
| `--thread-messages <n>` | at most this many messages in each thread context (default: 50). |
| `--thread-bytes <n>` | at most this many bytes of whole messages and links in each context (default: 65536). |
| `--thread-within <duration>` | messages within this long either side of the hit (default: 1d). |
| `--backend <archive\|server\|both>` | dónde buscar: el archivo local, el servidor del servicio de mensajería o ambos (predeterminado: both). |
| `--server-time <duration>` | dejar de esperar al servidor tras este tiempo (predeterminado: 5s). |
| `--chat <chat>` | only this chat — the same as chat: in the query; a chat: its id, or part of its title. |
| `--source <messenger>` | every account of this messenger held in the store; personal, bots or all — the same as in: in the query. |
| `--limit <n>` | how many. |
| `--newest` | newest first instead of best first. |
| `--exact` | las palabras sin campo y las frases entre comillas coinciden solo en su forma exacta, como exact:word; text: sigue admitiendo todas las formas. |
| `--context <n>` | messages before and after each hit; 2 in the terminal, 0 otherwise. |
| `--language <lucene\|legacy>` | the query language: strict Lucene or legacy discovery. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--regex` | the words are one regular expression, case-insensitive, tested against every stored text. |
| `--saved <name\|id>` | run a saved search or an earlier run; options typed here replace its own. |

### `max messages show`

one message, by its chat and id or by its msg: locator

```sh
max messages show <chat> [message]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title; or a msg: locator, with no message id after it. |
| `message` | opcional | the message id. |

### `max messages context`

a message and what came either side of it, oldest first

```sh
max messages context <chat> [message] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title; or a msg: locator, with no message id after it. |
| `message` | opcional | the message id. |

| Opción | Para qué sirve |
|---|---|
| `--thread` | the stored reply chain and replies instead of time neighbours; falls back when no graph exists. |
| `--thread-hops <n>` | at most this many links from the hit (default: 8). |
| `--thread-messages <n>` | at most this many messages in each thread context (default: 50). |
| `--thread-bytes <n>` | at most this many bytes of whole messages and links in each context (default: 65536). |
| `--thread-within <duration>` | messages within this long either side of the hit (default: 1d). |
| `--before-n <n>` | how many before it. Por defecto: `5`. |
| `--after-n <n>` | how many after it. Por defecto: `5`. |

### `max messages links`

why a message is in its conversation: each link it has, and the chain of answers back to the start

```sh
max messages links <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `message` | obligatorio | the message id. |

### `max messages link`

a message permalink when supported, and its account-scoped locator

```sh
max messages link <chat> [message]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title; or a msg: locator, with no message id after it. |
| `message` | opcional | the message id. |

### `max messages download`

save a message's photos, files, videos and voice notes to a folder — or a whole chat's with --all

```sh
max messages download <chat> [message] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `message` | opcional | the message id; left out with --all. |

| Opción | Para qué sirve |
|---|---|
| `--output-dir <dir>` | where to save them; created if missing. Por defecto: `.`. |
| `--all` | every file of the chat, newest first; run it again to continue where it stopped. |
| `--pause <duration>` | with --all, a pause between pages, to stay under the provider's limits. Por defecto: `5s`. |
| `--extract` | leer las capas de texto de los archivos que esta descarga vincula al índice de contenido local. |
| `--output <dir>` | compatibility alias for --output-dir. |

### `max messages evidence`

a bounded evidence packet from stored messages, newest first

```sh
max messages evidence <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | how many, 1–100. |
| `--before-id <id>` | only messages older than this message id. |

### `max messages transcribe`

turn a voice message into text, on this machine — the recording goes nowhere

```sh
max messages transcribe <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat id, or part of a chat name. |
| `message` | obligatorio | id of a voice message. |

| Opción | Para qué sirve |
|---|---|
| `--model <id>` | which downloaded speech model to use; `max models audio list` shows them. |

### `max messages send`

send a text message; without [text], the text is read from stdin

**Cambia algo en MAX.**

```sh
max messages send <chat> [text] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `text` | opcional | the message. |

| Opción | Para qué sirve |
|---|---|
| `--topic <id>` | send to this forum topic; unsupported by messengers without topics. |
| `--reply-to <message>` | answer this message, by its id in the same chat. |
| `--send-as <id>` | publicar como una de las identidades que enumera `chats send-as`; obligatorio cuando el chat publica como otra identidad de forma predeterminada. |
| `--send-id <id>` | repeat a send whose outcome was unknown, without risking a second copy. |
| `--silent` | deliver without a notification. |
| `--no-preview` | no preview card for a link in the text. |
| `--md` | read this messenger's Markdown; see its formatting guide for supported syntax. |
| `--file <file>` | attach a file; the text becomes its caption. |
| `--photo <file>` | attach a .jpg, .png or .webp as a photo; the text becomes its caption. |
| `--as-file` | send the --file as a file to download, a video included. |
| `--voice <file>` | send an Ogg Opus file as a voice message, alone, with no text. |
| `--allow-any-file` | send a file even from a hidden folder, \~/.ssh or this CLI's own folders. |
| `--at-time <time>` | let the messenger send it later, even with this machine off: 2026-09-25T09:00 (local time), or 30m, 2h, 1d from now. |
| `--sticker <id>` | enviar solo este sticker; `stickers list` muestra su id. |

### `max messages scheduled`

messages waiting to be sent later in a chat, soonest first; cancel one in the app

```sh
max messages scheduled <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

### `max messages edit`

change the text of your own message; the other side may have read it already

**Cambia algo en MAX.**

```sh
max messages edit <chat> <message> [text] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `message` | obligatorio | the id of your own message. |
| `text` | opcional | the new text; without it, read from stdin. |

| Opción | Para qué sirve |
|---|---|
| `--md` | read this messenger's Markdown; see its formatting guide for supported syntax. |

### `max messages delete`

delete messages for you only; with --for-everyone, for everyone in the chat

**Cambia algo en MAX.**

```sh
max messages delete <chat> <messages> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `messages` | obligatorio | the message ids, at most 10. |

| Opción | Para qué sirve |
|---|---|
| `--for-everyone` | delete for everyone in the chat, not only for you — they cannot get it back. |
| `--allow-dangerous` | go ahead without the question an ask level puts before a deletion. |

### `max messages forward`

forward one message to another chat

**Cambia algo en MAX.**

```sh
max messages forward <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | the chat the message is in: a chat: its id, or part of its title. |
| `message` | obligatorio | the message id. |

| Opción | Para qué sirve |
|---|---|
| `--to <chat>` | where it goes: a chat: its id, or part of its title. |
| `--silent` | deliver it without a notification. |
| `--send-as <id>` | publicar como una de las identidades que enumera `chats send-as` para el chat --to; obligatorio cuando el chat publica como otra identidad de forma predeterminada. |
| `--send-id <id>` | repeat a forward whose outcome was unknown, without risking a second copy. |

### `max messages pin`

pin a message in a chat, quietly unless --notify

**Cambia algo en MAX.**

```sh
max messages pin <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `message` | obligatorio | the message id. |

| Opción | Para qué sirve |
|---|---|
| `--notify` | tell the chat's members about the pin. |

### `max messages unpin`

unpin a message in a chat

**Cambia algo en MAX.**

```sh
max messages unpin <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `message` | obligatorio | the message id. |

### `max messages press`

pulsar un botón del bot bajo un mensaje; el bot ve la pulsación

**Cambia algo en MAX.**

```sh
max messages press <chat> <message> <button>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat: ID o parte de su título. |
| `message` | obligatorio | ID del mensaje con botones. |
| `button` | obligatorio | número mostrado por `messages show` o texto exacto. |


## `max store`

the local store of messages

### `max store status`

per chat: messages stored, the oldest and newest, and the stretches held completely

```sh
max store status [chat]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | opcional | a chat: its id, or part of its title. |

### `max store fetch`

descargar el historial de un chat al almacenamiento local, primero los mensajes más recientes; ejecutar de nuevo para continuar; --all descarga todos los chats

```sh
max store fetch [chat] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | opcional | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--all` | todos los chats, primero los activos más recientemente — lo que necesita la búsqueda; los últimos 90d salvo que se indique --since-time o --last. |
| `--limit <n>` | como máximo este número de mensajes por ejecución, por chat con --all; 1200 si se omite. |
| `--page-size <n>` | how many messages one request asks for; 30 if not given. |
| `--pause <duration>` | the least pause between pages, to stay under the provider's limits; each is up to twice that. Por defecto: `5s`. |
| `--since-time <time>` | stop once it reaches messages older than this: ISO 8601, or 2h / 1d ago. |
| `--last <n>` | stop once the newest n messages are held. |
| `--catch-up` | preparar la búsqueda local después de descargar; anula searchCatchUp. |
| `--no-catch-up` | omitir la preparación local después de esta descarga. |
| `--catch-up-chunks <n>` | como máximo este número de fragmentos de vectores locales. |
| `--catch-up-messages <n>` | omitir una reconstrucción del grafo con más mensajes que este número. |
| `--catch-up-time <duration>` | tiempo disponible para la preparación local, 30s de forma predeterminada. |
| `--background` | run as a job that outlives this command; `store jobs show` follows it. |
| `--estimate` | only estimate how many messages, requests and minutes a full fetch would still take — from the store, no request. |

### `max store gaps`

inspeccionar las lagunas internas de cobertura registradas y descargar explícitamente los datos que faltan

#### `max store gaps plan`

plan de cobertura local; los identificadores de mensajes ausentes no implican por sí solos que falte historial

```sh
max store gaps plan <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

#### `max store gaps repair`

descargar datos de lagunas internas con límites y volver a comprobar la cobertura; nunca eliminar los mensajes no encontrados

```sh
max store gaps repair <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | total de mensajes en esta reparación, 500 de forma predeterminada. |
| `--max-gaps <n>` | como máximo este número de lagunas, 5 de forma predeterminada. |
| `--repair-time <duration>` | tiempo disponible para la reparación, 30s por defecto. Por defecto: `30s`. |
| `--page-size <n>` | mensajes por página del proveedor. |
| `--pause <duration>` | pausa entre las páginas del proveedor. Por defecto: `5s`. |
| `--fingerprint <hash>` | rechazar si este plan de cobertura previamente revisado ha cambiado. |
| `--catch-up` | preparar la búsqueda local después de reparar; anula searchCatchUp. |
| `--no-catch-up` | omitir la preparación de la búsqueda local después de reparar. |
| `--catch-up-chunks <n>` | máximo de fragmentos locales que se preparan. |
| `--catch-up-messages <n>` | máximo de mensajes almacenados que se leen para la preparación. |
| `--catch-up-time <duration>` | tiempo de preparación dentro del tiempo restante de la reparación. |
| `--background` | reparar mediante el mecanismo existente de trabajos del almacenamiento; consultar store jobs show. |

### `max store jobs`

background fetch jobs

#### `max store jobs list`

background fetch jobs, newest first

```sh
max store jobs list [options]
```

| Opción | Función |
|---|---|
| `--state <state>` | Solo tareas `running`, `done`, `failed`, `cancelled` o `died`. |

#### `max store jobs show`

one background job — the newest when none is named — and what the store now holds of its chat

```sh
max store jobs show [job]
```

| Argumento | | Qué es |
|---|---|---|
| `job` | opcional | the job id `store fetch --background` printed. |

#### `max store jobs cancel`

stop a running background job after its current page; a later fetch resumes where it stopped

```sh
max store jobs cancel <job>
```

| Argumento | | Qué es |
|---|---|---|
| `job` | obligatorio | the job id. |

#### `max store jobs retry`

reiniciar un trabajo fallido o interrumpido como uno nuevo; la descarga continúa desde donde se guardó

```sh
max store jobs retry [job] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `job` | opcional | ID del trabajo. |

| Opción | Para qué sirve |
|---|---|
| `--failed` | todos los chats cuyo último trabajo falló o se interrumpió. |


#### `max store jobs clear`

olvidar trabajos terminados y borrar sus registros; se conservan los trabajos en curso

**Cambia algo solo en este ordenador.**

```sh
max store jobs clear
```


### `max store export`

a chat's stored messages as JSON lines, oldest first; never asks the messenger

```sh
max store export [chats] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chats` | opcional | a chat: its id, or part of its title; several with --to. |

| Opción | Para qué sirve |
|---|---|
| `--format <format>` | jsonl (the default): one message per line; markdown: a transcript with a heading per day, replies and forwards quoted. |
| `--since-time <time>` | only from this ISO 8601 time, or 30m / 2h / 1d ago, on. |
| `--output <file>` | write JSON lines, or the transcript, to this new file, readable only by you. |
| `--to <dir>` | write into this folder, a file per chat and a manifest; run again on it for only what changed since. |
| `--kind <kinds>` | with --to: every stored chat of these kinds, comma-separated: dialog, group, channel, saved. |
| `--all` | with --to: every stored chat of this account. |
| `--encrypt` | compress and encrypt with a password, typed at a hidden prompt or piped on stdin; it is never kept — lose it and the file cannot be opened. |

### `max store clear`

delete from the store the chats this account has left, with their messages

```sh
max store clear [options]
```

| Opción | Para qué sirve |
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

actualizar el esquema y normalizar e indexar mensajes y notas, incluidas sus raíces

```sh
max store migrate
```

### `max store reindex`

reconstruir índices de palabras, erratas, raíces, archivos y notas sin perder datos

```sh
max store reindex
```

### `max store backup`

copy the store into a new file, while it is in use; never overwrites a file

```sh
max store backup <file> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio | the new file. |

| Opción | Para qué sirve |
|---|---|
| `--encrypt` | compress and encrypt with a password, typed at a hidden prompt or piped on stdin; it is never kept — lose it and the file cannot be opened. |

### `max store restore`

put a backup in place of the store; the store it replaces is kept beside it, never deleted

```sh
max store restore <file>
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio | a file `store backup` wrote; one written with --encrypt asks for its password. |

### `max store decrypt`

open a file written with --encrypt into a new file; asks for its password

```sh
max store decrypt <file> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio | a file `store backup --encrypt` or `store export --encrypt` wrote. |

| Opción | Para qué sirve |
|---|---|
| `--output <file>` | the new file, readable only by you. |

### `max store repair`

bring every table to this build's shape, deleting nothing: a table of the wrong shape is kept as a copy beside a new one

```sh
max store repair [options]
```

| Opción | Para qué sirve |
|---|---|
| `--dry-run` | say what it would do, and change nothing. |

### `max store copies`

the tables `store repair` kept as copies

#### `max store copies delete`

delete one copy `store repair` kept, named exactly; refuses any other table

```sh
max store copies delete <name>
```

| Argumento | | Qué es |
|---|---|---|
| `name` | obligatorio | the copy's name, as `store repair` printed it. |

## `max stats`

estadísticas sobre mensajes, chats y sus autores

### `max stats messages`

estadísticas de mensajes del almacenamiento local

#### `max stats messages show`

how many stored messages match, by chat, sender, day or hour — the local store only; optionally fetches new messages with --sync-first

```sh
max stats messages show [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | a strict Lucene query, as for messages search; none counts every stored message; with --saved, more words AND-ed to it. |

| Opción | Para qué sirve |
|---|---|
| `--sync-first` | first fetch new messages within the chat, time and message bounds. |
| `--max-chats <n>` | refresh at most this many chats (default: 5). |
| `--sync-time <duration>` | stop fetching after this long (default: 30s). |
| `--max-messages <n>` | fetch at most this many messages total (default: 500). |
| `--by <chat\|sender\|day\|hour>` | what to count by (default: chat). |
| `--chat <chat>` | only this chat — the same as chat: in the query; a chat: its id, or part of its title. |
| `--source <messenger>` | every account of this messenger held in the store; personal, bots or all — the same as in: in the query. |
| `--limit <n>` | how many rows. |
| `--timezone <zone>` | the IANA timezone for calendar days and hours. |
| `--exact` | las palabras sin campo y las frases entre comillas coinciden solo en su forma exacta, como exact:word; text: sigue admitiendo todas las formas. |
| `--saved <name\|id>` | count what a saved search or an earlier run matches; options typed here replace its own. |

#### `max stats messages counters`

observaciones por contador y actualización remota limitada


#### `max stats messages counters show`

mostrar valores de contadores guardados y frescura de sus observaciones

```sh
max stats messages counters show [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | consulta Lucene estricta sobre mensajes guardados. |

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | solo este chat; indica su ID o parte de su título. |
| `--source <messenger>` | cuentas conectadas de este mensajero; la actualización usa la activa. |
| `--exact` | las palabras sin operadores coinciden por forma exacta. |
| `--timezone <zone>` | zona horaria IANA para fechas de consulta. |
| `--selection <json>` | selección fija de objetivos de counters show; incompatible con consulta y ámbito. |
| `--counters <names>` | campos distintos views,reactions,comments; los tres por defecto. |
| `--limit <n>` | mensajes, 1–100; 20 por defecto. |
| `--max-age <duration>` | edad máxima de una observación reciente; 24h por defecto. |


#### `max stats messages counters refresh`

leer contadores autorizados de un número limitado de mensajes y actualizar sus observaciones locales

**Cambia algo solo en este ordenador.**

```sh
max stats messages counters refresh [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | consulta Lucene estricta sobre mensajes guardados. |

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | solo este chat; indica su ID o parte de su título. |
| `--source <messenger>` | cuentas conectadas de este mensajero; la actualización usa la activa. |
| `--exact` | las palabras sin operadores coinciden por forma exacta. |
| `--timezone <zone>` | zona horaria IANA para fechas de consulta. |
| `--selection <json>` | selección fija de objetivos de counters show; incompatible con consulta y ámbito. |
| `--counters <names>` | campos distintos views,reactions,comments; los tres por defecto. |
| `--limit <n>` | mensajes, 1–100; 20 por defecto. |
| `--max-messages <n>` | máximo de mensajes que actualizar, 1–100. |
| `--sync-time <duration>` | tiempo de actualización remota; 30s por defecto, máximo 5m. |
| `--dry-run` | mostrar objetivos guardados exactos y contadores admitidos sin conectar. |


#### `max stats messages unanswered`

preguntas detectadas más antiguas sin una respuesta directa válida observada

```sh
max stats messages unanswered [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | consulta Lucene estricta; si se omite, selecciona todos los mensajes almacenados. |

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | solo este chat; indica su ID o parte de su título. |
| `--source <messenger>` | todas las cuentas disponibles de este servicio de mensajería; personal, bots o all. |
| `--exact` | las palabras sin campo coinciden en su forma exacta en lugar de por su raíz. |
| `--saved <name\|id>` | ejecutar un informe guardado de este tipo; las opciones indicadas sustituyen las guardadas. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--limit <n>` | filas del informe, 1–100; 20 por defecto. |
| `--answerer <id>` | persona del ámbito elegido cuya respuesta directa cuenta; repetir para varias. |
| `--older-than <duration>` | edad mínima de una pregunta sin respuesta válida observada. |

#### `max stats messages discussion`

publicaciones vistas con poca conversación guardada

```sh
max stats messages discussion [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | consulta Lucene estricta; si se omite, selecciona todos los mensajes almacenados. |

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | solo este chat; indica su ID o parte de su título. |
| `--source <messenger>` | todas las cuentas disponibles de este servicio de mensajería; personal, bots o all. |
| `--exact` | las palabras sin campo coinciden en su forma exacta en lugar de por su raíz. |
| `--saved <name\|id>` | ejecutar un informe guardado de este tipo; las opciones indicadas sustituyen las guardadas. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--limit <n>` | filas del informe, 1–100; 20 por defecto. |
| `--min-views <n>` | mínimo de vistas acumuladas conocidas. |
| `--max-replies <n>` | máximo de respuestas observadas en la conversación. |

#### `max stats messages top`

clasificar mensajes guardados por métrica o puntuación explicable; cada contador indica la frescura de su observación

```sh
max stats messages top [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | consulta Lucene estricta; si se omite, selecciona todos los mensajes almacenados. |

| Opción | Para qué sirve |
|---|---|
| `--sync-first` | first fetch new messages within the chat, time and message bounds. |
| `--max-chats <n>` | refresh at most this many chats (default: 5). |
| `--sync-time <duration>` | stop fetching after this long (default: 30s). |
| `--max-messages <n>` | fetch at most this many messages total (default: 500). |
| `--measure <name>` | métrica de clasificación; no se combina con score ni weights. Uno de: `views`, `reactions`, `forwards`, `comments`, `replies`, `thread-size`. |
| `--score <preset>` | helpful/active para autores; engaging para ambos tipos de objetos. Uno de: `helpful`, `active`, `engaging`. |
| `--weights <json>` | el conjunto completo de pesos de los componentes; sustituye los pesos predefinidos. |
| `--message-kind <kind>` | antes de clasificar, selecciona todos los mensajes, publicaciones o comentarios con tipo confirmado. Uno de: `all`, `posts`, `comments`. |
| `--chat <chat>` | solo este chat; indica su ID o parte de su título. |
| `--source <messenger>` | todas las cuentas disponibles de este servicio de mensajería; personal, bots o all. |
| `--timezone <zone>` | zona horaria IANA para fechas y días activos. |
| `--exact` | las palabras sin campo coinciden en su forma exacta en lugar de por su raíz. |
| `--limit <n>` | filas clasificadas, 1–100. |
| `--saved <name\|id>` | ejecutar una consulta guardada o una ejecución de clasificación; las opciones introducidas sustituyen las almacenadas. |

#### `max stats messages evidence`

página limitada de mensajes, pares de respuestas o miembros de una cohorte desde una selección drilldown exacta

```sh
max stats messages evidence <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `message` | obligatorio | ubicación canónica del mensaje o referencia de cohorte de retención desde drilldown. |

| Opción | Para qué sirve |
|---|---|
| `--selection <json>` | la selección de clasificación resuelta que devuelve drilldown. |
| `--component <name>` | el componente de clasificación expuesto. |
| `--limit <n>` | filas de evidencia, 1–100; 20 si no se indica. |
| `--cursor <cursor>` | continuar con el mismo componente y la misma huella de las evidencias almacenadas. |

### `max stats contacts`

estadísticas sobre los autores humanos

#### `max stats contacts responses`

número de respuestas y mediana/p90 del tiempo de respuesta de las personas elegidas

```sh
max stats contacts responses [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | consulta Lucene estricta; si se omite, selecciona todos los mensajes almacenados. |

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | solo este chat; indica su ID o parte de su título. |
| `--source <messenger>` | todas las cuentas disponibles de este servicio de mensajería; personal, bots o all. |
| `--exact` | las palabras sin campo coinciden en su forma exacta en lugar de por su raíz. |
| `--saved <name\|id>` | ejecutar un informe guardado de este tipo; las opciones indicadas sustituyen las guardadas. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--limit <n>` | filas del informe, 1–100; 20 por defecto. |
| `--answerer <id>` | persona del ámbito elegido cuya respuesta directa cuenta; repetir para varias. |

#### `max stats contacts top`

clasificar autores humanos de mensajes guardados por métrica o puntuación explicable; cada contador indica la frescura de su observación

```sh
max stats contacts top [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | consulta Lucene estricta; si se omite, selecciona todos los mensajes almacenados. |

| Opción | Para qué sirve |
|---|---|
| `--sync-first` | first fetch new messages within the chat, time and message bounds. |
| `--max-chats <n>` | refresh at most this many chats (default: 5). |
| `--sync-time <duration>` | stop fetching after this long (default: 30s). |
| `--max-messages <n>` | fetch at most this many messages total (default: 500). |
| `--measure <name>` | métrica de clasificación; no se combina con score ni weights. Uno de: `messages`, `words`, `reactions`, `replies`, `answers`, `answer-time`, `threads`, `active-days`. |
| `--score <preset>` | helpful/active para autores; engaging para ambos tipos de objetos. Uno de: `helpful`, `active`, `engaging`. |
| `--weights <json>` | el conjunto completo de pesos de los componentes; sustituye los pesos predefinidos. |
| `--message-kind <kind>` | antes de clasificar, selecciona todos los mensajes, publicaciones o comentarios con tipo confirmado. Uno de: `all`, `posts`, `comments`. |
| `--chat <chat>` | solo este chat; indica su ID o parte de su título. |
| `--source <messenger>` | todas las cuentas disponibles de este servicio de mensajería; personal, bots o all. |
| `--timezone <zone>` | zona horaria IANA para fechas y días activos. |
| `--exact` | las palabras sin campo coinciden en su forma exacta en lugar de por su raíz. |
| `--limit <n>` | filas clasificadas, 1–100. |
| `--saved <name\|id>` | ejecutar una consulta guardada o una ejecución de clasificación; las opciones introducidas sustituyen las almacenadas. |
| `--min-messages <n>` | mínimo de mensajes seleccionados por autor; 1 o 5 para engaging. |

#### `max stats contacts evidence`

página limitada de mensajes, pares de respuestas o miembros de una cohorte desde una selección drilldown exacta

```sh
max stats contacts evidence <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | ID exacto de la persona en el servicio, de la fila de clasificación. |

| Opción | Para qué sirve |
|---|---|
| `--selection <json>` | la selección de clasificación resuelta que devuelve drilldown. |
| `--component <name>` | el componente de clasificación expuesto. |
| `--limit <n>` | filas de evidencia, 1–100; 20 si no se indica. |
| `--cursor <cursor>` | continuar con el mismo componente y la misma huella de las evidencias almacenadas. |

### `max stats chats`

estadísticas sobre un chat

#### `max stats chats show`

a group's or channel's numbers for a period: messages, active members, replies, reactions, questions answered, joins and leaves — counted from the local store; joins and leaves are asked of the messenger

```sh
max stats chats show <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--since-time <time>` | ISO 8601, or 2h / 1d ago; 7 days ago if not given. |
| `--by <day\|week>` | also one row per calendar day or week (weeks start on Monday). |
| `--timezone <zone>` | the IANA timezone for calendar days. |

#### `max stats chats newcomers`

miembros con fecha de entrada conocida y ayuda durante el plazo posterior

```sh
max stats chats newcomers <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--since-time <time>` | desde esta fecha ISO 8601 o hace 2h / 1d; hace 30d por defecto. |
| `--until-time <time>` | hasta esta fecha ISO 8601 o hace 2h / 1d, inclusive. |
| `--within <duration>` | plazo de ayuda tras la entrada conocida de una persona nueva. |
| `--saved <name\|id>` | ejecutar un informe guardado de este tipo; las opciones indicadas sustituyen las guardadas. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--limit <n>` | filas del informe, 1–100; 20 por defecto. |
| `--answerer <id>` | persona del ámbito elegido cuya respuesta directa cuenta; repetir para varias. |

#### `max stats chats retention`

cohortes de incorporación y pertenencia observada en fechas de control a partir de listas guardadas

```sh
max stats chats retention <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--since-time <time>` | inicio del período de incorporación en ISO 8601 o tiempo relativo; últimos 90 días por defecto. |
| `--until-time <time>` | fin del período de incorporación; ahora por defecto. |
| `--checkpoints <durations>` | hasta 10 edades crecientes desde la incorporación, separadas por comas; 1d,7d,30d por defecto. |
| `--within <duration>` | ventana de actividad y salida temprana tras incorporarse; 7d por defecto. |
| `--by <day\|week>` | agrupar fechas de incorporación por día o semana desde el lunes. Uno de: `day`, `week`. |
| `--timezone <zone>` | zona horaria IANA para cohortes de incorporación. |
| `--limit <n>` | cohortes y pruebas de miembros, 1–100. |


### `max stats tasks`

estadísticas de las tareas

#### `max stats tasks show`

por chat: cuántas tareas están abiertas, la más antigua y la mediana del tiempo hasta el cierre

```sh
max stats tasks show [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | solo este chat; indica su ID o parte de su título. |
| `--type <name>` | solo este tipo: question, request, mention o promise. |

### `max stats charts`

los datos de un gráfico de las estadísticas de un chat y, opcionalmente, una imagen SVG o PNG de tema oscuro

```sh
max stats charts <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |

| Opción | Para qué sirve |
|---|---|
| `--chart-kind <messages\|active\|membership>` | what to draw: messages, active authors, or joins and leaves. Por defecto: `messages`. |
| `--by <day\|week>` | one point per calendar day or week (weeks start on Monday). Por defecto: `day`. |
| `--since-time <time>` | ISO 8601, or 2h / 1d ago; 7 days ago if not given. |
| `--timezone <zone>` | the IANA timezone for calendar days. |
| `--output <file>` | guardar una imagen de tema oscuro en un nuevo archivo .svg o .png. |

## `max tasks`

lo que requiere tu atención —preguntas sin respuesta, menciones, peticiones y promesas— guardado en el almacenamiento local; review y serve lo añaden

### `max tasks list`

tareas, primero las más antiguas, con el mensaje al que apunta cada una

```sh
max tasks list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--state <state>` | solo tareas en este estado: open, done o dismissed. |
| `--chat <chat>` | solo las tareas de este chat; indica su ID o parte de su título. |
| `--type <names>` | solo estos tipos, separados por comas: question, request, mention, promise. |
| `--before-time <time>` | solo tareas abiertas antes de esta fecha ISO 8601 o de hace 2h / 1d. |
| `--limit <n>` | how many. |

### `max tasks add`

añadir una tarea para un mensaje que las reglas no detectan — una promesa o una petición

```sh
max tasks add <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `message` | obligatorio | localizador de mensaje msg:<provider>/<account>/<chat>/<message>, como muestra review --json. |

| Opción | Para qué sirve |
|---|---|
| `--type <name>` | tipo de tarea: question, request, mention o promise. |

### `max tasks close`

cerrar una tarea: done o dismissed si no necesita respuesta; una tarea cerrada permanece cerrada

```sh
max tasks close <task> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `task` | obligatorio | ID de la tarea, como aparece en tasks list. |

| Opción | Para qué sirve |
|---|---|
| `--as <state>` | cómo se cierra: done o dismissed — no necesita respuesta. |
| `--reason <text>` | el motivo, guardado con la tarea — no-reply-needed, por ejemplo. |

## `max conversations`

the conversations inside a chat, found in the stored messages by replies, mentions and who wrote next

### `max conversations build`

find a chat's conversations in what the store holds, replacing the last build; without --chat, every chat that changed since its build and every group never built; never asks the messenger

```sh
max conversations build [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | a chat: its id, or part of its title. |
| `--analyze` | link batches using the configured analysis provider; requires --chat and remembers consent for this chat/provider. |
| `--provider <provider>` | analysis: agent, openai or anthropic. |
| `--model <model>` | analysis model; overrides analysisModel. |
| `--base-url <url>` | analysis API endpoint; overrides analysisBaseUrl. |
| `--size <n>` | analysis answer messages per batch, 10–200; default 50. |
| `--max-tokens <n>` | analysis input/output reservation cap per run; default 100000. |
| `--max-chats <n>` | at most this many chats in one run; 20 if not given. |

### `max conversations list`

a chat's conversations, the newest first: when, how many messages, how many people

```sh
max conversations list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | a chat: its id, or part of its title. |
| `--since-time <time>` | only those that started at this ISO 8601 time, or 30m / 2h / 1d ago, or later. |
| `--limit <n>` | how many. |

### `max conversations show`

one conversation's messages, oldest first — by its id, or the one a message is in

```sh
max conversations show <conversation> [message]
```

| Argumento | | Qué es |
|---|---|---|
| `conversation` | obligatorio | a conversation id from `conversations list`; or a chat: its id, or part of its title, with a message. |
| `message` | opcional | a message id in that chat: show the conversation it is in. |

### `max conversations related`

the conversations nearest in meaning to the one a message is in, in every built chat, best first — from the vectors `conversations embed` stored; runs no model

```sh
max conversations related <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `message` | obligatorio | a message id in that chat. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | how many. |
| `--model <model>` | local: a model id from `models text list` (default: e5-small); remote: the provider's model. |
| `--provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |

### `max conversations status`

how fresh each built chat's conversations and vectors are: messages the build has not seen, chunks with a current, stale or missing vector

```sh
max conversations status [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | only this chat: a chat: its id, or part of its title. |
| `--model <model>` | local: a model id from `models text list` (default: e5-small); remote: the provider's model. |
| `--provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |

### `max conversations search`

the conversations nearest to a query in meaning and in words, best first, in one chat or every one — meaning after `conversations embed`; runs on this machine

```sh
max conversations search <query> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | obligatorio | what to look for, in your own words, in any language the model reads. |

| Opción | Para qué sirve |
|---|---|
| `--model <model>` | local: a model id from `models text list` (default: e5-small); remote: the provider's model. |
| `--provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |
| `--max-chats <n>` | at most this many chats; 5 with --sync-first, 20 with --refresh if not given. |
| `--max-chunks <n>` | at most this many chunks embedded in one run; 2000 if not given. |
| `--sync-first` | first fetch new messages within the chat, time and message bounds. |
| `--sync-time <duration>` | stop fetching after this long (default: 30s). |
| `--max-messages <n>` | fetch at most this many messages total (default: 500). |
| `--chat <chat>` | only this chat: a chat: its id, or part of its title. |
| `--since-time <time>` | only those still going at this ISO 8601 time, or 30m / 2h / 1d ago, or later. |
| `--filter <query>` | strict Lucene filter: any message in a conversation must match; does not change the meaning query. |
| `--source <source>` | accounts to search: personal, bots, all, or a provider; defaults to the active account. |
| `--timezone <zone>` | IANA timezone for filter dates; system timezone by default. |
| `--limit <n>` | how many. |
| `--refresh` | first build and embed, on this machine, the chats in scope that changed or were never built — within --max-chats and --max-chunks. |

### `max conversations batches`

windows of a chat for your own AI agent to link: which earlier message each one answers

#### `max conversations batches status`

how many messages still wait for an answer, in how many batches, and how much text

```sh
max conversations batches status [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | a chat: its id, or part of its title. |
| `--size <n>` | messages to answer per batch, 10–200; 50 by default. |

#### `max conversations batches next`

the next window to answer, with the messages before it; message text goes to stdout only

```sh
max conversations batches next [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | a chat: its id, or part of its title. |
| `--size <n>` | messages to answer per batch, 10–200; 50 by default. |

### `max conversations links`

your agent's answers: which earlier message each message of a batch answers

#### `max conversations links add`

store your agent's answer to a batch, read as JSON from stdin: { "model", "answers": [{ "message", "parent", "confidence" }] }; all or nothing

```sh
max conversations links add [options]
```

| Opción | Para qué sirve |
|---|---|
| `--batch <id>` | the batch id `conversations batches next` printed. |

#### `max conversations links clear`

drop your agent's answers for a chat, or only one model's; messages are never touched

```sh
max conversations links clear [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | a chat: its id, or part of its title. |
| `--model <model>` | only the answers this model gave. |

### `max conversations consents`

remembered analysis permissions for this account's chats and provider endpoints

#### `max conversations consents list`



```sh
max conversations consents list
```

#### `max conversations consents revoke`



```sh
max conversations consents revoke [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | revoke only this chat's consents; defaults to every chat. |
| `--provider <identity>` | exact provider identity from consents list; defaults to every provider. |

### `max conversations embed`

compute a vector for each chunk of a chat's conversations for search by meaning — on this machine, or with --provider through a service and your key; resumes where it stopped; without --chat, every built chat with chunks left, on this machine only

```sh
max conversations embed [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | a chat: its id, or part of its title. |
| `--model <model>` | local: a model id from `models text list` (default: e5-small); remote: the provider's model. |
| `--provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |
| `--workers <n>` | local: sessions in parallel, each with its own copy of the model (\~0.7 GB each). |
| `--threads <n>` | local: threads in all (default: min(8, cores)). |
| `--concurrency <n>` | remote: requests at once (default: 4). |
| `--max-tokens <n>` | remote: stop before a run that could send more tokens than this. |
| `--max-chats <n>` | at most this many chats in one run; 20 if not given. |
| `--max-chunks <n>` | at most this many chunks embedded in one run; 2000 if not given, and no limit with --chat. |

#### `max conversations embed status`

how many chunks of a chat have a vector of the model, how many are left, and what is left costs

```sh
max conversations embed status [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | a chat: its id, or part of its title. |
| `--model <model>` | local: a model id from `models text list` (default: e5-small); remote: the provider's model. |
| `--provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |

#### `max conversations embed clear`

drop a chat's vectors, or only one model's; messages and conversations are never touched

```sh
max conversations embed clear [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | a chat: its id, or part of its title. |
| `--model <model>` | local: a model id from `models text list` (default: e5-small); remote: the provider's model. |
| `--provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |

## `max attachments`

the files of stored messages: their text in the local store, for content: in a search

### `max attachments extract`

guardar el texto de archivos descargados — texto, capas de texto PDF/DOCX, ODT/ODS/XLSX/PPTX/EPUB — en el almacén local para buscar con content:

```sh
max attachments extract [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | only this chat's files; a chat: its id, or part of its title. |
| `--from-dir <dir>` | asociar archivos de este directorio sin recorrer subdirectorios; requiere --chat. |
| `--cursor <cursor>` | continuar desde el cursor devuelto por una extracción con límites. |
| `--download` | first save the files no download saved yet, from the messenger, into --output-dir. |
| `--output-dir <dir>` | with --download, where to save them; created if missing. |
| `--limit <n>` | read at most this many files; run it again to continue. |
| `--ocr` | llamar explícitamente a models.ocr para extraer texto en lotes de imágenes y PDF escaneados. |
| `--concurrency <n>` | remote: requests at once (default: 4). |

### `max attachments list`

files of stored messages, where each was saved and whether its text is held — never the text

```sh
max attachments list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | only this chat's files; a chat: its id, or part of its title. |
| `--needs-text` | only files saved here whose text nobody has yet: what an agent reads and writes back. |
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

### `max attachments show`

leer una porción limitada de un adjunto conservado; JSON incluye bytes en base64

```sh
max attachments show <chat> [message] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat: ID o parte de su título; o solo una ubicación msg:. |
| `message` | opcional | the message id. |

| Opción | Para qué sirve |
|---|---|
| `--attachment <n>` | posición del archivo desde 1; obligatoria si hay varios archivos. |
| `--offset-bytes <n>` | desplazamiento en bytes desde 0. |
| `--chunk-bytes <n>` | bytes que devolver, 1–1048576 (por defecto524288). |
| `--if-sha256 <hash>` | exigir el SHA-256 del archivo completo de la porción anterior. |


### `max attachments text`

the text of one file, as an agent read it

#### `max attachments text set`

keep the text an agent read from a file — a scan, a photo — so content: finds it; nothing is sent

```sh
max attachments text set <chat> [message] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title; or a msg: locator, with no message id after it. |
| `message` | opcional | the message id. |

| Opción | Para qué sirve |
|---|---|
| `--attachment <n>` | which file of the message, from 1; needed when it has more than one. |
| `--text-file <path>` | read the text from this file; - or none reads stdin. |

## `max tags`

your own labels on chats, people and messages, kept in the local store and never sent; tag: in a search finds them

### `max tags auto`

generar etiquetas locales de grupos y canales a partir de metadatos en caché mediante reglas de palabras clave

**Cambia algo solo en este ordenador.**

```sh
max tags auto [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | grupo o canal almacenado; repite la opción para seleccionar varios. Por defecto: ``. |
| `--limit <number>` | procesa como máximo el número indicado de chats (1–500). Por defecto: `50`. |
| `--refresh-metadata` | leer las descripciones actuales del servicio de mensajería antes de clasificar. |
| `--dry-run` | previsualizar la clasificación a partir de la caché sin modificar el almacenamiento. |

### `max tags add`

put tags on one chat, person or message

**Cambia algo solo en este ordenador.**

```sh
max tags add <tag> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `tag` | obligatorio | one or more tags: 1–32 letters a–z, digits and hyphens; upper case is lowered. |

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | the chat to tag, or the chat of --message; a chat: its id, or part of its title. |
| `--contact <person>` | the person to tag: their id, @username or name, as the local store knows them. |
| `--message <message>` | the message to tag: its id in --chat, or a msg: locator alone. |

### `max tags remove`

take tags off one chat, person or message

**Cambia algo solo en este ordenador.**

```sh
max tags remove <tag> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `tag` | obligatorio | one or more tags: 1–32 letters a–z, digits and hyphens; upper case is lowered. |

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | the chat to untag, or the chat of --message; a chat: its id, or part of its title. |
| `--contact <person>` | the person to untag: their id, @username or name, as the local store knows them. |
| `--message <message>` | the message to untag: its id in --chat, or a msg: locator alone. |
| `--source <manual\|auto>` | eliminar solo la atribución a este origen. |

### `max tags list`

what is tagged: this account's chats and messages, and the people of its messenger

```sh
max tags list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--tag <tag>` | only this tag. |
| `--source <manual\|auto>` | solo etiquetas atribuidas a este origen. |
| `--type <names>` | only what is tagged of this type: chat, contact or message. |

## `max metadata`

descripciones de grupos y canales en caché para las etiquetas automáticas locales

### `max metadata get`



```sh
max metadata get [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | un chat almacenado. |

### `max metadata refresh`



**Cambia algo solo en este ordenador.**

```sh
max metadata refresh [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | grupo o canal almacenado; repite la opción para varios. Por defecto: ``. |
| `--only-missing` | solo chats sin metadatos; sin --chat, todos los grupos/canales guardados. |
| `--limit <number>` | procesa como máximo el número indicado de chats (1–500). Por defecto: `50`. |

## `max searches`

búsquedas guardadas e historial de messages search y stats messages show en el almacenamiento local; --saved ejecuta una

### `max searches create`

save a search under a name without running it; messages search --saved <name> runs it

```sh
max searches create <name> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `name` | obligatorio | up to 64 letters a–z, digits and hyphens, not only digits. |
| `query` | opcional | the query, as for messages search; none matches every stored message. |

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | only this chat — the same as chat: in the query; a chat: its id, or part of its title. |
| `--source <messenger>` | every account of this messenger held in the store; personal, bots or all — the same as in: in the query. |
| `--limit <n>` | how many. |
| `--newest` | newest first instead of best first. |
| `--exact` | las palabras sin campo y las frases entre comillas coinciden solo en su forma exacta, como exact:word; text: sigue admitiendo todas las formas. |
| `--context <n>` | messages before and after each hit. |
| `--language <lucene\|legacy>` | the query language: strict Lucene or legacy discovery. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--regex` | the words are one regular expression, case-insensitive, tested against every stored text. |
| `--by <chat\|sender\|day\|hour>` | por qué criterio agrupa el recuento stats messages show --saved. |
| `--selection <json>` | guardar la consulta de clasificación principal resuelta y sus opciones a partir de una vista detallada. |
| `--replace` | overwrite a saved search of the same name. |

### `max searches show`

one saved search or earlier run: its query, options and how often it ran

```sh
max searches show <name|id>
```

| Argumento | | Qué es |
|---|---|---|
| `name\|id` | obligatorio | a saved search's name, or the id of any row of searches history. |

### `max searches list`

the saved searches, by name

```sh
max searches list
```

### `max searches history`

the searches and counts that ran, newest first — saved ones included; never their results

```sh
max searches history [options]
```

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | how many. |

### `max searches delete`

delete a saved search, or one run from the history

```sh
max searches delete <name|id>
```

| Argumento | | Qué es |
|---|---|---|
| `name\|id` | obligatorio | a saved search's name, or the id of any row of searches history. |

### `max searches clear`

empty the history; saved searches stay

```sh
max searches clear
```

## `max flood`

the waits MAX asked this profile to keep, and a hold on its writes

### `max flood clear`

olvidarlos y levantar la pausa y el límite de ritmo del perfil cuando MAX ya no limite la cuenta; no cambia nada en MAX

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
max models audio list
```

#### `max models audio download`

download a speech model once, checked against the sha256 this version expects

```sh
max models audio download <model>
```

| Argumento | | Qué es |
|---|---|---|
| `model` | obligatorio | a model id from `models audio list`. |

### `max models text`

embedding models for searching conversations by meaning

#### `max models text list`

the embedding models, most suitable first, which are downloaded, and which one is the default

```sh
max models text list
```

#### `max models text download`

download an embedding model once, checked against the sha256 this version expects

```sh
max models text download <model> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `model` | obligatorio | a model id from `models text list`. |

| Opción | Para qué sirve |
|---|---|
| `--accept-terms` | accept the model's licence terms, for a model that has its own. |

#### `max models text key`

API keys for embedding and analysis providers

#### `max models text key set`

store a key, typed at a hidden prompt or piped on stdin — never as an argument

```sh
max models text key set <provider>
```

| Argumento | | Qué es |
|---|---|---|
| `provider` | obligatorio | openai, anthropic, or the host of a --base-url server that wants a key. |

#### `max models text key remove`

forget a stored key

```sh
max models text key remove <provider>
```

| Argumento | | Qué es |
|---|---|---|
| `provider` | obligatorio | openai, anthropic, or a server's host. |

## `max polls`

read a poll, vote in it, close your own, create one

### `max polls show`

a poll and its answer ids, as the message carries it now

```sh
max polls show <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `message` | obligatorio | the id of the message that carries the poll. |

### `max polls vote`

vote in a poll, or take your vote back; the others see it unless the poll is anonymous

**Cambia algo en MAX.**

```sh
max polls vote <chat> <message> [answers] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `message` | obligatorio | the id of the message that carries the poll. |
| `answers` | opcional | answer ids, as `polls show` prints them. |

| Opción | Para qué sirve |
|---|---|
| `--retract` | take your vote back. |

### `max polls close`

close your own poll; nobody can vote after that, and it cannot be reopened

**Cambia algo en MAX.**

```sh
max polls close <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `message` | obligatorio | the id of your own message that carries the poll. |

### `max polls create`

send a poll to a chat, as a message of its own; public unless --anonymous

**Cambia algo en MAX.**

```sh
max polls create <chat> <question> <answers> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `question` | obligatorio | the question. |
| `answers` | obligatorio | two answers or more. |

| Opción | Para qué sirve |
|---|---|
| `--topic <id>` | send to this forum topic; unsupported by messengers without topics. |
| `--multiple` | people may pick several answers. |
| `--anonymous` | nobody sees who voted for what. |
| `--revote` | people may change their vote. |
| `--silent` | send without a notification. |
| `--send-as <id>` | publicar como una de las identidades que enumera `chats send-as`; obligatorio cuando el chat publica como otra identidad de forma predeterminada. |
| `--send-id <id>` | repeat a create whose outcome was unknown, without risking a second poll. |

## `max reactions`

react to messages

### `max reactions add`

put your reaction on a message; it replaces the one you had

**Cambia algo en MAX.**

```sh
max reactions add <chat> <message> <emoji>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `message` | obligatorio | the message id. |
| `emoji` | obligatorio | one emoji, for example 👍. |

### `max reactions remove`

take your reaction off a message

**Cambia algo en MAX.**

```sh
max reactions remove <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat: its id, or part of its title. |
| `message` | obligatorio | the message id. |

## `max recipients`

the chats this profile may send to, when the list is on

### `max recipients list`

the chats on the list; empty and off until the first add

```sh
max recipients list
```

### `max recipients add`

allow sending to this chat; the first add turns the list on

**Cambia algo solo en este ordenador.**

```sh
max recipients add <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat id, or part of a chat name. |

### `max recipients remove`

stop allowing this chat; the list stays on

**Cambia algo solo en este ordenador.**

```sh
max recipients remove <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat id, or the title as the list shows it. |

### `max recipients clear`

empty the list and turn it off: this profile may send to any chat again

**Cambia algo solo en este ordenador.**

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

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | how many to show. |

## `max inbox`

other people's unread messages in every chat; --new for what arrived since the last check

```sh
max inbox [options]
```

| Opción | Para qué sirve |
|---|---|
| `--new` | what arrived since the last check, each message once — for scheduled runs. |
| `--since-time <time>` | what arrived after this ISO 8601 time, or 2h / 1d ago; the saved point stays put. |
| `--limit <n>` | at most this many per chat, the newest. |
| `--all` | muted and archived chats too — left out unless they mention you or reply to you. |
| `--kind <kinds>` | only chats of these kinds, comma-separated: dialog, group, channel, saved. |
| `--transcribe` | turn voice messages not heard yet into text — by the messenger, or a model on this machine; can take minutes. |
| `--model <id>` | which downloaded speech model hears them, with --transcribe; `models audio list` shows them. |
| `--mark-read` | also mark each chat shown read, up to the newest message shown; the other side sees it. |
| `--no-mark-read` | do not, whatever the catchUpMarksRead setting says. |

## `max review`

every message, yours too, in chats that changed since a point — for reviewing who owes what

```sh
max review [options]
```

| Opción | Para qué sirve |
|---|---|
| `--since-time <time>` | where the last review ended — ISO 8601, or 2h / 1d ago; 3 days ago if not given. |
| `--chat <chat>` | only this chat: a chat: its id, or part of its title. |
| `--kind <kinds>` | only chats of these kinds, comma-separated: dialog, group, channel, saved. |
| `--unanswered [duration]` | only questions to you or a group's admins that nobody answered, asked at least this long ago — 4h, 1d; 24h if not given. |
| `--all` | muted and archived chats too — left out unless they mention you or reply to you. |
| `--transcribe` | turn voice messages not heard yet into text — by the messenger, or a model on this machine; can take minutes. |
| `--model <id>` | which downloaded speech model hears them, with --transcribe; `models audio list` shows them. |
| `--new` | what changed since the last `review --new`, a point per chat — for scheduled runs. |
| `--mark-read` | also mark each chat shown read, up to the newest message shown; the other side sees it. |
| `--no-mark-read` | do not, whatever the catchUpMarksRead setting says. |

## `max replies`

rules that answer messages for you, kept in a file of this profile

### `max replies add`

añadir una regla con todos los valores predeterminados explícitos, desactivada hasta que la edites y actives

**Cambia algo solo en este ordenador.**

```sh
max replies add <id>
```

| Argumento | | Qué es |
|---|---|---|
| `id` | obligatorio | letras minúsculas, dígitos y -; debe ser único en este perfil. |

### `max replies on`

activar una regla de respuesta; su plantilla debe estar lista

**Cambia algo solo en este ordenador.**

```sh
max replies on <id>
```

| Argumento | | Qué es |
|---|---|---|
| `id` | obligatorio | ID de la regla. |

### `max replies off`

desactivar una regla de respuesta

**Cambia algo solo en este ordenador.**

```sh
max replies off <id>
```

| Argumento | | Qué es |
|---|---|---|
| `id` | obligatorio | ID de la regla. |

### `max replies edit`

cambiar solo los campos indicados de una regla de respuesta; las listas se sustituyen completas

**Cambia algo solo en este ordenador.**

```sh
max replies edit <id> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `id` | obligatorio | ID de la regla. |

| Opción | Para qué sirve |
|---|---|
| `--do <actions>` | acciones: reply, task o ambas, separadas por comas. |
| `--kinds <kinds>` | tipos de chat: dialog, group; separados por comas, vacío para cualquiera. |
| `--chats <ids>` | solo estos identificadores de chat, separados por comas; vacío para cualquiera. |
| `--not-chats <ids>` | excluir estos identificadores de chat, separados por comas; vacío borra la lista. |
| `--words <words>` | coincidir con cualquiera de estas palabras completas, separadas por comas; vacío borra la lista. |
| `--question` | coincidir solo con preguntas. |
| `--no-question` | no exigir una pregunta. |
| `--mentions-me` | exigir que te mencionen o que respondan a tu mensaje. |
| `--no-mentions-me` | no exigir que te mencionen ni que respondan a tu mensaje. |
| `--people <ids>` | solo estos identificadores de remitentes, separados por comas; vacío para cualquiera. |
| `--not-people <ids>` | excluir estos identificadores de remitentes, separados por comas; vacío borra la lista. |
| `--contacts-only` | coincidir solo con contactos. |
| `--no-contacts-only` | no exigir que el remitente sea un contacto. |
| `--template <text>` | la plantilla de respuesta. |
| `--model <mode>` | modo de plantilla antiguo: fill-only o may-reword; usa bloques ai en su lugar. |
| `--as-reply` | enviar como respuesta al mensaje coincidente. |
| `--no-as-reply` | enviar sin vincular al mensaje coincidente. |
| `--per-chat <limit>` | como máximo esta cantidad por chat, como 1/12h. |
| `--per-person <limit>` | como máximo esta cantidad por persona, como 1/1d. |
| `--outside <hours>` | responder fuera de este intervalo en formato de 24 horas, como 09:00-19:00. |
| `--days <days>` | días del intervalo de trabajo, como mon-fri o sat,sun. |
| `--timezone <zone>` | zona horaria IANA del intervalo de trabajo. |
| `--no-hours` | borrar el intervalo de trabajo. |

### `max replies audience`

mostrar la audiencia de respuestas del perfil o sustituir los campos indicados; los probadores siguen limitando las respuestas

**Cambia algo solo en este ordenador.**

```sh
max replies audience [options]
```

| Opción | Para qué sirve |
|---|---|
| `--reply <mode>` | responder a todos o solo a los remitentes y chats de la lista: all, listed. |
| `--allow-people <ids>` | sustituir los identificadores de remitentes permitidos, separados por comas; vacío borra la lista. |
| `--allow-chats <ids>` | sustituir los identificadores de chats permitidos, separados por comas; vacío borra la lista. |
| `--deny-people <ids>` | sustituir los identificadores de remitentes prohibidos, separados por comas; vacío borra la lista; la prohibición tiene prioridad. |
| `--deny-chats <ids>` | sustituir los identificadores de chats prohibidos, separados por comas; vacío borra la lista; la prohibición tiene prioridad. |

### `max replies consents`

consentimiento para los modelos de respuesta una vez por perfil y endpoint, con exclusiones por chat

#### `max replies consents show`

mostrar el consentimiento para el modelo de respuesta y las exclusiones de chats; nunca llama a un modelo

```sh
max replies consents show
```

#### `max replies consents grant`

permitir que los datos de mensajes entrantes se envíen al modelo de respuesta configurado para este perfil; se conservan las exclusiones de chats

**Cambia algo solo en este ordenador.**

```sh
max replies consents grant
```

#### `max replies consents revoke`

revocar de inmediato el consentimiento del perfil para el modelo de respuesta; se conservan las exclusiones de chats

**Cambia algo solo en este ordenador.**

```sh
max replies consents revoke
```

#### `max replies consents deny`

evitar que los datos entrantes de este chat se envíen al modelo de respuesta

**Cambia algo solo en este ordenador.**

```sh
max replies consents deny <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID del chat en el servicio, utilizado tal como se indica; nunca se resuelve a través de la red. |

#### `max replies consents allow`

eliminar la exclusión de este chat del modelo; no concede consentimiento al perfil

**Cambia algo solo en este ordenador.**

```sh
max replies consents allow <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID del chat en el servicio, utilizado tal como se indica; nunca se resuelve a través de la red. |

### `max replies test`

what the rules would have answered in the stored messages, to whom and why — sends nothing, changes nothing, never connects

```sh
max replies test [rule] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `rule` | opcional | only this rule, by its id; every rule in file order if not given. |

| Opción | Para qué sirve |
|---|---|
| `--since-time <time>` | from this ISO 8601 time, or 2h / 1d ago; 7d ago if not given. |
| `--ai` | llamar al modelo de respuesta configurado con datos de mensajes almacenados; requiere consentimiento para el modelo de respuesta, de lo contrario usa la alternativa. |

### `max replies pause`

stop every reply rule of this profile at once, a running serve too; resume undoes it

```sh
max replies pause
```

### `max replies resume`

let the reply rules answer again after pause

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

```sh
max serve [options]
```

| Opción | Para qué sirve |
|---|---|
| `--idle <duration>` | stop after this long with nobody using it — 15m, 1h is 60m. |

## `max server`

`max serve` in the background: start, stop, restart, status, logs; install adds a systemd or launchd unit

### `max server start`

start serve in the background — through the unit if one is installed — and answer once it connects

```sh
max server start [options]
```

| Opción | Para qué sirve |
|---|---|
| `--idle <duration>` | stop after this long with nobody using it — 15m, 1h. |

### `max server stop`

stop this profile's serve — through the unit if it runs under one

```sh
max server stop
```

### `max server restart`

stop it and start it again

```sh
max server restart [options]
```

| Opción | Para qué sirve |
|---|---|
| `--idle <duration>` | stop after this long with nobody using it — 15m, 1h. |

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

| Opción | Para qué sirve |
|---|---|
| `-n, --lines <n>` | how many lines. Por defecto: `50`. |

### `max server install`

write a systemd user unit or a launchd agent for this profile; starts nothing

```sh
max server install
```

### `max server uninstall`

remove this profile's unit; stop it first

```sh
max server uninstall
```

## `max watch`

print new messages as they arrive, from a running `max serve`

```sh
max watch [options]
```

| Opción | Para qué sirve |
|---|---|
| `--events` | mostrar también ediciones, eliminaciones, reacciones, lecturas y cambios de chats; cada línea indica su evento. |

## `max config`

the settings in force, and where each one came from

### `max config show`

the profile, the profiles that exist, and each setting with where it came from

```sh
max config show [options]
```

| Opción | Para qué sirve |
|---|---|
| `--bot` | the settings a `max bot` command on this profile gets, rather than the personal account's. |

### `max config migrate`

replace legacy access settings with permissions, preserving effective levels

**Cambia algo solo en este ordenador.**

```sh
max config migrate [options]
```

| Opción | Para qué sirve |
|---|---|
| `--dry-run` | show the migration without writing the file. |

### `max config set`

save a setting to the configuration file

**Cambia algo solo en este ordenador.**

```sh
max config set <setting> <value> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `setting` | obligatorio | uno de: limit, timeoutMs, color, record, keepRunsForDays, readOnly, allow, permissions, sendsPerHour, requestsPerMinute, embeddingProvider, embeddingModel, embeddingBaseUrl, embeddingDims, analysisProvider, analysisModel, analysisBaseUrl, models, senderColors, catchUpMarksRead, searchCatchUp, serve, mcpTools, readOtherBots, updateCheck, skillHint, transcribeModel, defaultProfile, searchStemmers.cyrillic, searchStemmers.latin. |
| `value` | obligatorio | a number, true or false, or for allow a list like send,reaction. |

| Opción | Para qué sirve |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |
| `--personal` | only for personal accounts — the personal section of the file. |
| `--bot` | only for bots — the bot section of the file. |

### `max config unset`

remove a setting from the configuration file

**Cambia algo solo en este ordenador.**

```sh
max config unset <setting> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `setting` | obligatorio | uno de: limit, timeoutMs, color, record, keepRunsForDays, readOnly, allow, permissions, sendsPerHour, requestsPerMinute, embeddingProvider, embeddingModel, embeddingBaseUrl, embeddingDims, analysisProvider, analysisModel, analysisBaseUrl, models, senderColors, catchUpMarksRead, searchCatchUp, serve, mcpTools, readOtherBots, updateCheck, skillHint, transcribeModel, defaultProfile, searchStemmers.cyrillic, searchStemmers.latin. |

| Opción | Para qué sirve |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |
| `--personal` | only for personal accounts — the personal section of the file. |
| `--bot` | only for bots — the bot section of the file. |

## `max doctor`

the state this installation is in, without contacting MAX unless --online

```sh
max doctor [options]
```

| Opción | Para qué sirve |
|---|---|
| `--online` | also log in once, read one chat and start the MCP server; sends nothing. |

### `max doctor report`

what a problem report holds and where it goes; writes nothing

#### `max doctor report create`

write a problem report to a file, and print how to send it

```sh
max doctor report create [options]
```

| Opción | Para qué sirve |
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

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | how many to show. Por defecto: `20`. |

### `max runs show`

one run: what it was, and one line per operation

```sh
max runs show <run-id>
```

| Argumento | | Qué es |
|---|---|---|
| `run-id` | obligatorio | an id from `max runs list`. |

### `max runs path`

the directory holding one run

```sh
max runs path <run-id>
```

| Argumento | | Qué es |
|---|---|---|
| `run-id` | obligatorio | an id from `max runs list`. |

## `max skill`

the instructions an agent is given for this tool

### `max skill show`

print SKILL.md — `max skill install` puts it where Claude Code, Codex and Gemini CLI look for it

```sh
max skill show [name]
```

| Argumento | | Qué es |
|---|---|---|
| `name` | opcional | one of the skills shipped for a task: link-conversations. |

### `max skill install`

write SKILL.md to \~/.claude/skills/max-cli/ (Claude Code) and \~/.agents/skills/max-cli/ (Codex, Gemini CLI)

```sh
max skill install [options]
```

| Opción | Para qué sirve |
|---|---|
| `--for <agents>` | which agents to install for. Uno de: `claude`, `agents`, `all`. Por defecto: `all`. |

## `max commands`

commands, options and exit codes as JSON — inspect one command path per call

### `max commands schema`

argv y esquemas de resultados de un comando, efectos, permisos y orientación sobre reintentos

```sh
max commands schema <path>
```

| Argumento | | Qué es |
|---|---|---|
| `path` | obligatorio | una ruta de comando, por ejemplo: stats messages show. |

## `max upgrade`

upgrade max with the package manager that installed it; --check only looks

```sh
max upgrade [options]
```

| Opción | Para qué sirve |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |

## `max complete`

shell completion: `max complete zsh` prints the script to source

```sh
max complete [words]
```

| Argumento | | Qué es |
|---|---|---|
| `words` | opcional |  |

## `max mcp`

serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add max -- max mcp`

```sh
max mcp [options]
```

| Opción | Para qué sirve |
|---|---|
| `--permission <key=level>` | sobrescribir un permiso solo para este servidor; repetir para más claves. |
| `--allow-dangerous` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-send` | deprecated: use permissions.messages.send in config; does not grant access. |
| `--confirm-send` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-mark-read` | deprecated: use permissions.chats.mark-read in config; does not grant access. |
| `--allow-delete` | deprecated: use permissions.messages.delete in config; does not grant access. |
| `--allow-moderate` | deprecated: use permissions.chats.moderate and group rules; does not grant access. |
| `--http` | ofrece el servidor HTTP en 127.0.0.1 para ChatGPT y Claude en el navegador a través de tu túnel; se aplican los permisos del perfil. |
| `--http-confirmation <mode>` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--port <port>` | the local port for --http (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net. |
| `--revoke` | forget every login given to a browser app; each must log in again. |

### `max mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
max mcp config [options]
```

| Opción | Para qué sirve |
|---|---|
| `--permission <key=level>` | sobrescribir un permiso solo para este servidor; repetir para más claves. |
| `--allow-dangerous` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-send` | deprecated: use permissions.messages.send in config; does not grant access. |
| `--confirm-send` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-mark-read` | deprecated: use permissions.chats.mark-read in config; does not grant access. |
| `--allow-delete` | deprecated: use permissions.messages.delete in config; does not grant access. |
| `--allow-moderate` | deprecated: use permissions.chats.moderate and group rules; does not grant access. |

### `max mcp setup`

add this profile's local MCP server to Codex or Claude Code

**Cambia algo solo en este ordenador.**

```sh
max mcp setup <client> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `client` | obligatorio | codex or claude-code. |

| Opción | Para qué sirve |
|---|---|
| `--allow-writes` | acknowledge that this profile offers writing tools. |
| `--permission <key=level>` | sobrescribir un permiso solo para este servidor; repetir para más claves. |
| `--allow-dangerous` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-send` | deprecated: use permissions.messages.send in config; does not grant access. |
| `--confirm-send` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-mark-read` | deprecated: use permissions.chats.mark-read in config; does not grant access. |
| `--allow-delete` | deprecated: use permissions.messages.delete in config; does not grant access. |
| `--allow-moderate` | deprecated: use permissions.chats.moderate and group rules; does not grant access. |

### `max mcp doctor`

check this profile's local MCP handshake and tool list

```sh
max mcp doctor [options]
```

| Opción | Para qué sirve |
|---|---|
| `--permission <key=level>` | sobrescribir un permiso solo para este servidor; repetir para más claves. |
| `--allow-dangerous` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-send` | deprecated: use permissions.messages.send in config; does not grant access. |
| `--confirm-send` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-mark-read` | deprecated: use permissions.chats.mark-read in config; does not grant access. |
| `--allow-delete` | deprecated: use permissions.messages.delete in config; does not grant access. |
| `--allow-moderate` | deprecated: use permissions.chats.moderate and group rules; does not grant access. |

## `max bot`

a MAX bot, through the official Bot API and a bot token — not your personal account

### `max bot auth`

the bot token this profile uses

#### `max bot auth set`

check a bot token with MAX, then keep it — typed at a hidden prompt or piped on stdin

**Cambia algo solo en este ordenador.**

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

**Cambia algo solo en este ordenador.**

```sh
max bot auth remove
```

### `max bot list`

every name on this machine that has a bot token; --check asks MAX which bot each is

```sh
max bot list [options]
```

| Opción | Para qué sirve |
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

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |

#### `max bot chats leave`

take the bot out of a chat; only an admin of the chat can bring it back

**Cambia algo en MAX.**

```sh
max bot chats leave <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat id, or the title of a chat this bot has seen. |

#### `max bot chats action`

show what the bot is doing in a chat — typing, sending a photo — for a few seconds

**Cambia algo en MAX.**

```sh
max bot chats action <chat> <action>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `action` | obligatorio | what the chat sees. Uno de: `typing`, `photo`, `video`, `voice`, `file`. |

#### `max bot chats admins`

the admins of a chat the bot is an admin in

#### `max bot chats admins list`

the chat's admins and what each may do

```sh
max bot chats admins list <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat id, or the title of a chat this bot has seen. |

#### `max bot chats admins add`

make a member an admin with these rights

**Cambia algo en MAX.**

```sh
max bot chats admins add <chat> <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat id, or the title of a chat this bot has seen. |
| `person` | obligatorio | the person's user id. |

| Opción | Para qué sirve |
|---|---|
| `--can <rights>` | what they may do, comma-separated: read, members, admins, info, pin, link, edit, delete. |
| `--title <title>` | the title shown beside their name. |

#### `max bot chats admins remove`

take an admin's rights back; they stay a member

**Cambia algo en MAX.**

```sh
max bot chats admins remove <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat id, or the title of a chat this bot has seen. |
| `person` | obligatorio | the person's user id. |

#### `max bot chats members`

the people in a chat the bot is an admin in

#### `max bot chats members remove`

take a person out of a chat; their messages stay

**Cambia algo en MAX.**

```sh
max bot chats members remove <chat> <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat id, or the title of a chat this bot has seen. |
| `person` | obligatorio | the person's user id. |

| Opción | Para qué sirve |
|---|---|
| `--block` | also keep them from coming back by the chat's link. |

#### `max bot chats members list`

members of a chat, a page at a time — --marker takes the `marker` the last page gave

```sh
max bot chats members list <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio |  |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | how many, up to 100. |
| `--marker <marker>` | continue from here. |

#### `max bot chats members add`

add people to a chat by user id; the bot must be an admin that may add members

**Cambia algo en MAX.**

```sh
max bot chats members add <chat> <users>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio |  |
| `users` | obligatorio |  |

#### `max bot chats rules`

a chat's moderation rules for this bot, kept on this machine

#### `max bot chats rules show`

the chat's rules; the defaults, marked not saved, if it has none yet

```sh
max bot chats rules show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a group's id, or the title of a group this bot has seen. |

#### `max bot chats rules set`

change one rule — trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove

**Cambia algo solo en este ordenador.**

```sh
max bot chats rules set <chat> <key> <value>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a group's id, or the title of a group this bot has seen. |
| `key` | obligatorio | the rule. |
| `value` | obligatorio | its new value. |

#### `max bot chats rules unset`

put one rule back to its default

**Cambia algo solo en este ordenador.**

```sh
max bot chats rules unset <chat> <key>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a group's id, or the title of a group this bot has seen. |
| `key` | obligatorio | the rule. |

#### `max bot chats moderate`

judge a group's new messages and joins by its rules, and act as they allow — as the bot

**Cambia algo en MAX.**

```sh
max bot chats moderate <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a group's id, or the title of a group this bot has seen. |

| Opción | Para qué sirve |
|---|---|
| `--since-time <time>` | judge what came after this ISO 8601 time, or 2h / 1d ago; the saved point stays. |
| `--dry-run` | judge and plan; do nothing. |
| `--allow-dangerous` | yes to every action whose level in the group's rules is ask. |
| `--no-ban` | remove without banning; by default a removed person cannot come back by the link. |
| `--max-actions <n>` | at most this many actions in one run; 10 if not given. |

### `max bot messages`

the messages in the chats this bot is in

#### `max bot messages send`

send a message as the bot; without [text], the text is read from stdin

**Cambia algo en MAX.**

```sh
max bot messages send <chat> [text] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `text` | opcional | the message. |

| Opción | Para qué sirve |
|---|---|
| `--reply-to <message>` | answer this message, by its id in the same chat. |
| `--silent` | deliver without a notification. |
| `--md` | read this messenger's Markdown; see its formatting guide for supported syntax. |
| `--html` | the text is HTML: <b>, <i>, <a href>, <code>. |
| `--file <file>` | attach a file; the text becomes its caption. |
| `--photo <file>` | attach a .jpg, .png or .webp as a photo; the text becomes its caption. |
| `--as-file` | send the --file as a file to download, a video included. |
| `--voice <file>` | send an Ogg Opus file as a voice message, alone, with no text. |
| `--allow-any-file` | send a file even from a hidden folder, \~/.ssh or this CLI's own folders. |

#### `max bot messages list`

the latest messages in a chat; where MAX gives a bot no history, and with --offline, the ones this bot has seen on this machine

```sh
max bot messages list <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | how many, the newest. |

#### `max bot messages show`

one message by its id in a chat

```sh
max bot messages show <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `message` | obligatorio | message id. |

#### `max bot messages edit`

replace the text of a message the bot sent

**Cambia algo en MAX.**

```sh
max bot messages edit <chat> <message> <text> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `message` | obligatorio | message id. |
| `text` | obligatorio | the new text. |

| Opción | Para qué sirve |
|---|---|
| `--md` | read this messenger's Markdown; see its formatting guide for supported syntax. |
| `--html` | the text is HTML: <b>, <i>, <a href>, <code>. |

#### `max bot messages delete`

delete messages in a chat the bot can delete in; it cannot be undone

**Cambia algo en MAX.**

```sh
max bot messages delete <chat> <messages> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `messages` | obligatorio | message ids. |

| Opción | Para qué sirve |
|---|---|
| `--allow-dangerous` | delete without asking. |

#### `max bot messages pin`

pin a message in a chat; quietly unless --notify

**Cambia algo en MAX.**

```sh
max bot messages pin <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `message` | obligatorio | message id. |

| Opción | Para qué sirve |
|---|---|
| `--notify` | tell the chat's members. |

#### `max bot messages unpin`

unpin a message in a chat

**Cambia algo en MAX.**

```sh
max bot messages unpin <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `message` | obligatorio | message id. |

#### `max bot messages search`

search the messages this bot has read, sent or received on this machine — the local copy only, best match first; every word must appear; "a phrase", -word, a OR b, from: chat: after: before: has:; by text, by --from, or both

```sh
max bot messages search [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | the words to find. |

| Opción | Para qué sirve |
|---|---|
| `--all-bots` | also read every other bot's copy on this machine that readOtherBots allows. |
| `--bots <profiles>` | also read these bots' copies, comma separated — each allowed by readOtherBots. |
| `--limit <n>` | how many. |
| `--newest` | newest first instead of best first. |
| `--from <who>` | only what this person wrote — an id, @username or part of a name; repeat it for any of several. |

#### `max bot messages between`

what two or more people wrote in the chats they have all written in — from the local copy, grouped by chat, oldest first; --limit counts per chat. Common chats are the ones this copy saw each of them write in, not a member list from MAX

```sh
max bot messages between <people> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `people` | obligatorio | two or more people — an id, @username or part of a name each. |

| Opción | Para qué sirve |
|---|---|
| `--all-bots` | also read every other bot's copy on this machine that readOtherBots allows. |
| `--bots <profiles>` | also read these bots' copies, comma separated — each allowed by readOtherBots. |
| `--limit <n>` | how many of the latest messages from each chat. |

### `max bot recipients`

the chats this bot may write to; with no list, every chat — `clear` removes the list

#### `max bot recipients list`

the chats on the list, or nothing when there is no list

```sh
max bot recipients list
```

#### `max bot recipients add`

allow a chat: its id, `user:<id>`, or the title of a chat this bot has seen

**Cambia algo solo en este ordenador.**

```sh
max bot recipients add <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio |  |

#### `max bot recipients remove`

take a chat off the list

**Cambia algo solo en este ordenador.**

```sh
max bot recipients remove <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio |  |

#### `max bot recipients clear`

remove the list: the bot may write to any chat again

**Cambia algo solo en este ordenador.**

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

```sh
max bot watch [options]
```

| Opción | Para qué sirve |
|---|---|
| `--events` | also edits, deletions, buttons pressed and people coming and going; every line names its event. |
| `--types <types>` | only these update types, comma-separated, in the messenger's words. |

### `max bot callbacks`

answers to the buttons people press under the bot's messages

#### `max bot callbacks answer`

answer a pressed button by its callback id: --notification shows the person a one-time note, --text replaces the message the button was on

**Cambia algo en MAX.**

```sh
max bot callbacks answer <callback> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `callback` | obligatorio | the callback id `bot watch` printed. |

| Opción | Para qué sirve |
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

**Cambia algo en MAX.**

```sh
max bot commands set <commands>
```

| Argumento | | Qué es |
|---|---|---|
| `commands` | obligatorio | name=description, one per command. |

#### `max bot commands clear`

empty the menu

**Cambia algo en MAX.**

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

**Cambia algo en MAX.**

```sh
max bot webhooks set <url> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `url` | obligatorio | the HTTPS address. |

| Opción | Para qué sirve |
|---|---|
| `--types <types>` | only these update types, comma-separated, in the messenger's words. |
| `--secret-stdin` | a secret the messenger sends back with each update — asked for, or read from a pipe. |
| `--add` | keep the webhooks already set and add this one beside them. |

#### `max bot webhooks delete`

stop sending updates to this address; with none left, `bot watch` works again

**Cambia algo en MAX.**

```sh
max bot webhooks delete <url>
```

| Argumento | | Qué es |
|---|---|---|
| `url` | obligatorio | the address. |

### `max bot contacts`

people this bot has seen write — from the local copy on this machine, never asking MAX unless told to

#### `max bot contacts show`

one person: the chats they wrote in (with their last message there) and the latest messages of their private chat with the bot

```sh
max bot contacts show <who> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `who` | obligatorio | an id, @username or part of a name. |

| Opción | Para qué sirve |
|---|---|
| `--all-bots` | also read every other bot's copy on this machine that readOtherBots allows. |
| `--bots <profiles>` | also read these bots' copies, comma separated — each allowed by readOtherBots. |
| `--limit <n>` | how many messages from the private chat. |
| `--refresh` | read the private chat with them again from the messenger first — one request. |

### `max bot store`

the bot's local copy on this machine

#### `max bot store fetch`

fetch a chat's history into the bot's local copy, newest first; run it again to continue

```sh
max bot store fetch <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | a chat id, or the title of a chat this bot has seen. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | at most this many messages in this run; 1000 if not given. |
| `--page-size <n>` | how many messages one request asks for; 100 if not given. |
| `--pause <duration>` | pause between pages, to stay under the messenger's limits. Por defecto: `1s`. |
| `--since-time <time>` | stop once it reaches messages older than this: ISO 8601, or 2h / 1d ago. |
| `--last <n>` | stop once the newest n messages are held. |

### `max bot mcp`

serve this bot to an agent over MCP, on stdin and stdout — `claude mcp add sales-bot -- max sales bot mcp`

```sh
max bot mcp [options]
```

| Opción | Para qué sirve |
|---|---|
| `--confirm-send` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-dangerous` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-send` | no longer used — the profile's permissions decide; kept so an old setup still starts. |
| `--allow-delete` | no longer used — the profile's permissions decide. |
| `--allow-moderate` | no longer used — the profile's permissions decide. |

#### `max bot mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
max bot mcp config [options]
```

| Opción | Para qué sirve |
|---|---|
| `--confirm-send` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-dangerous` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-send` | no longer used — the profile's permissions decide; kept so an old setup still starts. |
| `--allow-delete` | no longer used — the profile's permissions decide. |
| `--allow-moderate` | no longer used — the profile's permissions decide. |

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

| Argumento | | Qué es |
|---|---|---|
| `message` | obligatorio |  |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | how many, up to 100. |

#### `max bot comments get`

one comment under a post

```sh
max bot comments get <message> <comment>
```

| Argumento | | Qué es |
|---|---|---|
| `message` | obligatorio |  |
| `comment` | obligatorio |  |

#### `max bot comments send`

comment under a post as the bot; - reads stdin

**Cambia algo en MAX.**

```sh
max bot comments send <message> <text> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `message` | obligatorio |  |
| `text` | obligatorio |  |

| Opción | Para qué sirve |
|---|---|
| `--format <format>` | how the text is marked up. Uno de: `markdown`, `html`. |

#### `max bot comments edit`

replace the text of a comment the bot wrote; - reads stdin

**Cambia algo en MAX.**

```sh
max bot comments edit <message> <comment> <text> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `message` | obligatorio |  |
| `comment` | obligatorio |  |
| `text` | obligatorio |  |

| Opción | Para qué sirve |
|---|---|
| `--format <format>` | how the text is marked up. Uno de: `markdown`, `html`. |

#### `max bot comments delete`

delete a comment under a post

**Cambia algo en MAX.**

```sh
max bot comments delete <message> <comment> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `message` | obligatorio |  |
| `comment` | obligatorio |  |

| Opción | Para qué sirve |
|---|---|
| `--allow-dangerous` | skip confirmation for bot.messages.delete at level ask. |

### `max bot uploads`

files uploaded to MAX, to attach to a message

#### `max bot uploads put`

upload a file from disk and print the attachment to put in a message's `attachments` — `messages send --file` does both steps at once

**Cambia algo en MAX.**

```sh
max bot uploads put <file> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio |  |

| Opción | Para qué sirve |
|---|---|
| `--type <type>` | upload as this kind instead of guessing by extension. Uno de: `image`, `video`, `audio`, `file`. |

### `max bot api`

every operation of the official Bot API, generated from its schema — docs/dev/bot-api-coverage.md

```sh
max bot api [options]
```

| Opción | Para qué sirve |
|---|---|
| `--store-token <profile>` | keep a returned authentication token only in this bot profile's OS keyring; never print it. |

#### `max bot api get-my-info`

Get current bot info — read (GET /me)

```sh
max bot api get-my-info
```

#### `max bot api edit-my-commands`

Edit current bot commands — write (PATCH /me/commands)

**Cambia algo en MAX.**

```sh
max bot api edit-my-commands [options]
```

| Opción | Para qué sirve |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `max bot api get-chat`

Get chat — read (GET /chats/{chatId})

```sh
max bot api get-chat [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | Requested chat or channel identifier. |

#### `max bot api edit-chat`

Edit chat or channel info — write (PATCH /chats/{chatId})

**Cambia algo en MAX.**

```sh
max bot api edit-chat [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | Chat or channel identifier. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `max bot api send-action`

Send action — write (POST /chats/{chatId}/actions)

**Cambia algo en MAX.**

```sh
max bot api send-action [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | Chat identifier. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `max bot api get-pinned-message`

Get pinned message — read (GET /chats/{chatId}/pin)

```sh
max bot api get-pinned-message [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | Chat identifier to get its pinned message. |

#### `max bot api pin-message`

Pin message — write (PUT /chats/{chatId}/pin)

**Cambia algo en MAX.**

```sh
max bot api pin-message [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | Chat identifier where message should be pinned. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `max bot api unpin-message`

Unpin message — write (DELETE /chats/{chatId}/pin)

**Cambia algo en MAX.**

```sh
max bot api unpin-message [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | Chat identifier to remove pinned message. |

#### `max bot api get-membership`

Get chat or channel membership — read (GET /chats/{chatId}/members/me)

```sh
max bot api get-membership [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | Chat or channel identifier. |

#### `max bot api leave-chat`

Leave chat — destructive (DELETE /chats/{chatId}/members/me)

**Cambia algo en MAX.**

```sh
max bot api leave-chat [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | Chat or channel identifier. |

#### `max bot api get-admins`

Get chat or channel admins — read (GET /chats/{chatId}/members/admins)

```sh
max bot api get-admins [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | Chat or channel identifier. |

#### `max bot api post-admins`

Set chat or channel admins — write (POST /chats/{chatId}/members/admins)

**Cambia algo en MAX.**

```sh
max bot api post-admins [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | Chat or channel identifier. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `max bot api delete-admins`

Revoke admin rights — write (DELETE /chats/{chatId}/members/admins/{userId})

**Cambia algo en MAX.**

```sh
max bot api delete-admins [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | Chat or channel identifier. |
| `--user-id <value>` | User identifier. |

#### `max bot api get-members`

Get members — read (GET /chats/{chatId}/members)

```sh
max bot api get-members [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | Chat or channel identifier. |
| `--user-ids <value>` | Comma-separated list of users identifiers to get their membership. When this parameter is passed, both `count` and `marker` are ignored. |
| `--marker <value>` | Marker. |
| `--count <value>` | Count. |

#### `max bot api add-members`

Add members — write (POST /chats/{chatId}/members)

**Cambia algo en MAX.**

```sh
max bot api add-members [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | Chat identifier. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `max bot api remove-member`

Remove member — write (DELETE /chats/{chatId}/members)

**Cambia algo en MAX.**

```sh
max bot api remove-member [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | Chat or channel identifier. |
| `--user-id <value>` | User id to remove from chat or channel. |
| `--block <value>` | Set to `true` if user should be blocked in chat. |

#### `max bot api get-subscriptions`

Get subscriptions — read (GET /subscriptions)

```sh
max bot api get-subscriptions
```

#### `max bot api subscribe`

Subscribe — write (POST /subscriptions)

**Cambia algo en MAX.**

```sh
max bot api subscribe [options]
```

| Opción | Para qué sirve |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `max bot api unsubscribe`

Unsubscribe — write (DELETE /subscriptions)

**Cambia algo en MAX.**

```sh
max bot api unsubscribe [options]
```

| Opción | Para qué sirve |
|---|---|
| `--url <value>` | URL to remove from WebHook subscriptions. |

#### `max bot api get-upload-url`

Get upload URL — write (POST /uploads)

**Cambia algo en MAX.**

```sh
max bot api get-upload-url [options]
```

| Opción | Para qué sirve |
|---|---|
| `--type <value>` | Uploaded file type: image, audio, video, file. |

#### `max bot api get-messages`

Get messages — read (GET /messages)

```sh
max bot api get-messages [options]
```

| Opción | Para qué sirve |
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

**Cambia algo en MAX.**

```sh
max bot api send-message [options]
```

| Opción | Para qué sirve |
|---|---|
| `--user-id <value>` | Fill this parameter if you want to send message to user. |
| `--chat-id <value>` | Fill this if you send message to chat or channel. |
| `--disable-link-preview <value>` | If `false`, server will not generate media preview for links in text. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `max bot api edit-message`

Edit message — write (PUT /messages)

**Cambia algo en MAX.**

```sh
max bot api edit-message [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` | Editing message identifier. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `max bot api delete-message`

Delete message — destructive (DELETE /messages)

**Cambia algo en MAX.**

```sh
max bot api delete-message [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` | Deleting message identifier. |
| `--allow-dangerous` | skip confirmation for bot.messages.delete at level ask. |

#### `max bot api get-message-by-id`

Get message — read (GET /messages/{messageId})

```sh
max bot api get-message-by-id [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` | Message identifier (`mid`) to get single message in chat or channel. |

#### `max bot api get-comments`

Get comments — read (GET /messages/{messageId}/comments)

```sh
max bot api get-comments [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` | Message identifier (`mid`) of the commented message. |
| `--comment-ids <value>` | Comma-separated list of comment ids to get. |
| `--before <value>` | Comments before timestamp. |
| `--after <value>` | Comments after timestamp. |
| `--count <value>` | Maximum amount of comments in response. |

#### `max bot api send-comment`

Send comment — write (POST /messages/{messageId}/comments)

**Cambia algo en MAX.**

```sh
max bot api send-comment [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` | Message identifier (`mid`) of the commented message. |
| `--disable-link-preview <value>` | If `false`, server will not generate media preview for links in text. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `max bot api edit-comment`

Edit comment — write (PUT /messages/{messageId}/comments)

**Cambia algo en MAX.**

```sh
max bot api edit-comment [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` | Message identifier (`mid`) of the commented message. |
| `--comment-id <value>` | Editing comment identifier. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `max bot api delete-comment`

Delete comment — destructive (DELETE /messages/{messageId}/comments)

**Cambia algo en MAX.**

```sh
max bot api delete-comment [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` | Message identifier (`mid`) of the commented message. |
| `--comment-id <value>` | Deleting comment identifier. |
| `--allow-dangerous` | skip confirmation for bot.messages.delete at level ask. |

#### `max bot api get-comment-by-id`

Get comment — read (GET /messages/{messageId}/comments/{commentId})

```sh
max bot api get-comment-by-id [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` | Message identifier (`mid`) of the commented message. |
| `--comment-id <value>` | Comment identifier (`mid`) to get single comment in channel. |

#### `max bot api get-video-attachment-details`

Get video details — read (GET /videos/{videoToken})

```sh
max bot api get-video-attachment-details [options]
```

| Opción | Para qué sirve |
|---|---|
| `--video-token <value>` | Video attachment token. |

#### `max bot api answer-on-callback`

Answer on callback — write (POST /answers)

**Cambia algo en MAX.**

```sh
max bot api answer-on-callback [options]
```

| Opción | Para qué sirve |
|---|---|
| `--callback-id <value>` | Identifies a button clicked by user. Bot receives this identifier after user pressed button as part of `MessageCallbackUpdate`. |
| `--disable-link-preview <value>` | If `true`, server will not generate media preview for links in updated message text. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `max bot api get-updates`

Get updates — write (GET /updates)

**Cambia algo en MAX.**

```sh
max bot api get-updates [options]
```

| Opción | Para qué sirve |
|---|---|
| `--limit <value>` | Maximum number of updates to be retrieved. |
| `--poll-timeout <value>` | Timeout in seconds for long polling. |
| `--marker <value>` | Pass `null` to get updates you didn't get yet. |
| `--types <value>` | Comma separated list of update types your bot want to receive. |

## Códigos de salida

Los scripts deciden según el código de salida, no según el texto: el texto puede cambiar; el código no.

| Código | Cuándo |
|---|---|
| `0` | Operación completada |
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
| `1` | Cualquier otro caso |

`0`, y solo `0`, significa que la operación se completó. `14`, `outcome_unknown`, significa que
el mensaje **podría** haberse enviado: no se confirma éxito ni fallo. Solo puedes repetirlo con el mismo
`--send-id`.
