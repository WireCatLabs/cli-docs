---
title: "Referencia de comandos"
---

<!-- Generated from the command tree by scripts/commands.ts. Do not edit; run `pnpm generate`. -->


Todos los comandos, opciones y códigos de salida. Esta página se **genera a partir del propio programa**,
así que corresponde a una versión real. Para obtener la misma lista en JSON, ejecuta `tg commands --json`.

Estructura de un comando:

```sh
tg [profile] [options] <resource> <verb> [arguments]
```

**La primera palabra es el perfil** si no es un comando: `tg work chats list` muestra los chats del
perfil `work`, y `tg chats list` los del perfil predeterminado. `TG_PROFILE` lo selecciona para
toda la sesión de terminal; sin ninguna de las dos formas, el perfil es `default`.

## Opciones comunes a todos los comandos

| Opción | Qué hace |
|---|---|
| `-V, --version` | muestra el número de versión. |
| `-v, --verbose` | añade detalles: -v muestra identificadores, -vv todos los datos conocidos. Valor predeterminado: `0`. |
| `--json` | salida para programas: un único valor JSON por stdout, nada más. |
| `--jsonl` | salida para programas: un objeto JSON por línea, para flujos y jq. |
| `--quiet` | oculta los mensajes de diagnóstico, pero sigue mostrando fallos. |
| `--trace` | registros de la conexión por stderr; nunca el contenido de mensajes. |
| `--timeout <duration>` | detiene todo el comando después de este intervalo: 30s, 2m, 500ms. |
| `--offline` | responde desde lo guardado sin conectarse; falla si no hay datos. |
| `--yes` | omite la confirmación que el nivel ask exige antes de escribir. |
| `--record` | guarda esta ejecución: identificadores y tiempos, nunca contenido. |
| `--no-record` | no guarda la ejecución, independientemente de la configuración. |

## `tg session`

inicia o cierra la sesión de Telegram de este perfil

### `tg session start`

inicia sesión mediante QR (predeterminado) o teléfono, código y contraseña 2FA

```sh
tg session start [method] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `method` | opcional | método de acceso. Valores: `qr`, `phone`. Predeterminado: `qr`. |

| Opción | Qué hace |
|---|---|
| `--app <how>` | solo la primera vez: cómo obtener la aplicación de my.telegram.org para el perfil. Valores: `browser`, `auto`. Predeterminado: `browser`. |
| `--qr-file <png>` | guarda el QR en este PNG en lugar de dibujarlo, para que un agente pueda mostrártelo. |

### `tg session end`

cierra la sesión del perfil en Telegram y elimina su archivo local

**Hace cambios en Telegram.**

```sh
tg session end
```

## `tg account`

la cuenta conectada

### `tg account show`

cuenta con la que inició sesión el perfil; solo muestra las cuatro últimas cifras del teléfono

```sh
tg account show [options]
```

| Opción | Qué hace |
|---|---|
| `--show-phone` | muestra el número completo. |

### `tg account update`

cambia nombre, descripción o foto visibles de tu perfil

**Hace cambios en Telegram.**

```sh
tg account update [options]
```

| Opción | Qué hace |
|---|---|
| `--first-name <name>` | tu nombre. |
| `--last-name <name>` | tus apellidos. |
| `--description <text>` | información sobre ti. |
| `--photo <file>` | nueva foto de perfil: un archivo de imagen. |

### `tg account sessions`

otras sesiones de la cuenta; no es `tg session`, que gestiona la sesión de esta herramienta

#### `tg account sessions list`

todos los dispositivos y aplicaciones con sesión en esta cuenta, sin cerrar ninguno

```sh
tg account sessions list
```

#### `tg account sessions end`

cierra todos los demás dispositivos, incluido el móvil; conserva este

**Hace cambios en Telegram.**

```sh
tg account sessions end [options]
```

| Opción | Qué hace |
|---|---|
| `--others` | todas las sesiones salvo esta. |

## `tg chats`

chats de la cuenta

### `tg chats list`

chats recientes primero, incluidos los archivados

```sh
tg chats list [options]
```

| Opción | Qué hace |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | número de página, desde 1. |
| `--all` | todas las filas, sin paginar. |
| `--search <text>` | solo chats cuyo nombre contiene el texto; al menos 3 caracteres. |
| `--kind <kind>` | solo chats de este tipo: dialog, group, channel, saved. |
| `--unread` | solo chats con mensajes sin leer. |

### `tg chats events`

quién se unió, salió, fue añadido o eliminado y quién actuó, según mensajes de servicio

```sh
tg chats events <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

| Opción | Qué hace |
|---|---|
| `--since-time <time>` | ISO 8601 o intervalo anterior como 2h / 1d; últimos 7 días por defecto. |
| `--type <names>` | solo estos tipos, separados por comas: join, leave, add, remove, create, title, pin. |

### `tg chats inspect`

destino de un enlace público o invitación, sin unirse

```sh
tg chats inspect <link>
```

| Argumento | | Qué es |
|---|---|---|
| `link` | obligatorio | enlace público o de invitación. |

### `tg chats show`

un chat: tipo, pendientes, hora del último mensaje y participantes

```sh
tg chats show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

### `tg chats members`

miembros de un grupo

#### `tg chats members list`

todos los miembros por páginas, con función y última conexión

```sh
tg chats members list <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | número de página, desde 1. |
| `--all` | todas las filas, sin paginar. |

#### `tg chats members add`

añade personas y les notifica

**Hace cambios en Telegram.**

```sh
tg chats members add <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `person` | obligatorio | identificador o parte del nombre. |

#### `tg chats members remove`

elimina personas; conserva sus mensajes

**Hace cambios en Telegram.**

```sh
tg chats members remove <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `person` | obligatorio | identificador o parte del nombre. |

### `tg chats mark-read`

marca el chat como leído; la otra persona lo ve

**Hace cambios en Telegram.**

```sh
tg chats mark-read <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

| Opción | Qué hace |
|---|---|
| `--until <message>` | solo hasta este identificador de mensaje; hasta el más reciente por defecto. |

### `tg chats create`

crea grupo o canal; notifica a las personas añadidas

**Hace cambios en Telegram.**

```sh
tg chats create <title> [person] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `title` | obligatorio | nombre del grupo. |
| `person` | opcional | personas que añadir, por identificador o parte del nombre. |

| Opción | Qué hace |
|---|---|
| `--channel` | canal privado en lugar de grupo; las personas entran mediante enlace. |

### `tg chats join`

se une a grupo o canal mediante enlace; los demás ven que entraste

**Hace cambios en Telegram.**

```sh
tg chats join <link>
```

| Argumento | | Qué es |
|---|---|---|
| `link` | obligatorio | enlace de invitación o público. |

### `tg chats leave`

sale de grupo o canal; los demás ven que saliste

**Hace cambios en Telegram.**

```sh
tg chats leave <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

### `tg chats update`

cambia nombre, descripción o activa y desactiva ajustes del grupo o canal

**Hace cambios en Telegram.**

```sh
tg chats update <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

| Opción | Qué hace |
|---|---|
| `--title <title>` | nombre nuevo. |
| `--description <text>` | descripción nueva. |
| `--all-can-pin <on\|off>` | permite fijar mensajes a todos los miembros. |
| `--only-admins-add <on\|off>` | solo administradores pueden añadir miembros. |

### `tg chats link`

enlace de invitación del grupo

#### `tg chats link show`

enlace de invitación, si tienes permiso para verlo

```sh
tg chats link show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

#### `tg chats link reset`

sustituye el enlace de invitación; el anterior deja de funcionar

**Hace cambios en Telegram.**

```sh
tg chats link reset <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

### `tg chats admins`

otorga o retira permisos de administrador a un miembro

#### `tg chats admins add`

convierte a un miembro en administrador con estos permisos

**Hace cambios en Telegram.**

```sh
tg chats admins add <chat> <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `person` | obligatorio | identificador o parte del nombre. |

| Opción | Qué hace |
|---|---|
| `--can <rights>` | permisos separados por comas: members, admins, info, pin, link, post, edit, delete. |

#### `tg chats admins remove`

retira permisos de administrador; sigue siendo miembro

**Hace cambios en Telegram.**

```sh
tg chats admins remove <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `person` | obligatorio | identificador o parte del nombre. |

### `tg chats folders`

tus carpetas de chats

#### `tg chats folders list`

tus carpetas, en el orden de la aplicación

```sh
tg chats folders list
```

#### `tg chats folders create`

crea una carpeta de chats

**Hace cambios en Telegram.**

```sh
tg chats folders create <title> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `title` | obligatorio | nombre de carpeta; la aplicación puede rechazar nombres largos. |

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | chat que incluir, por identificador o nombre; repite la opción para añadir más. |

#### `tg chats folders update`

renombra una carpeta o cambia los chats que contiene

**Hace cambios en Telegram.**

```sh
tg chats folders update <folder> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `folder` | obligatorio | identificador de carpeta o título exacto. |

| Opción | Qué hace |
|---|---|
| `--title <title>` | nuevo nombre. |
| `--add <chat>` | añade un chat; repite la opción para incluir más. |
| `--remove <chat>` | quita un chat; repite la opción para quitar más. |

#### `tg chats folders delete`

elimina la carpeta, conservando sus chats

**Hace cambios en Telegram.**

```sh
tg chats folders delete <folder>
```

| Argumento | | Qué es |
|---|---|---|
| `folder` | obligatorio | identificador de carpeta o título exacto. |

### `tg chats rules`

reglas que utiliza `chats moderate`, guardadas en un archivo de este perfil

#### `tg chats rules show`

reglas del grupo; si no existen, muestra las predeterminadas como no guardadas

```sh
tg chats rules show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

#### `tg chats rules set`

cambia una regla; el primer cambio guarda todas las reglas con sus valores predeterminados

**Solo hace cambios en este equipo.**

```sh
tg chats rules set <chat> <key> <value>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `key` | obligatorio | uno de: trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove. |
| `value` | obligatorio | nuevo valor; las listas se separan con comas. |

#### `tg chats rules unset`

restablece una regla a su valor predeterminado

**Solo hace cambios en este equipo.**

```sh
tg chats rules unset <chat> <key>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `key` | obligatorio | uno de: trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove. |

### `tg chats moderate`

revisa mensajes y miembros nuevos según las reglas y ejecuta lo permitido

**Hace cambios en Telegram.**

```sh
tg chats moderate <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

| Opción | Qué hace |
|---|---|
| `--since-time <time>` | revisa desde esta fecha ISO 8601 o intervalo anterior como 2h / 1d; no cambia el punto guardado. |
| `--dry-run` | revisa y prepara un plan, sin actuar. |
| `--allow-dangerous` | aprueba todas las acciones con nivel ask en las reglas del grupo. |
| `--max-actions <n>` | máximo de acciones por ejecución; 10 por defecto. |

## `tg contacts`

personas con las que esta cuenta tiene un chat individual

### `tg contacts list`

personas con las que tienes un chat individual

```sh
tg contacts list [options]
```

| Opción | Qué hace |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | número de página, desde 1. |
| `--all` | todas las filas, sin paginar. |
| `--order <recent\|name>` | conversación más reciente primero o por orden alfabético. Predeterminado: `recent`. |
| `--search <text>` | solo personas cuyo nombre o @username contiene el texto. |

### `tg contacts show`

una persona y los chats que compartís

```sh
tg contacts show <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | identificador, @username o parte del nombre. |

### `tg contacts lookup`

quién tiene este teléfono; lo solicita o lee por stdin, nunca como argumento

```sh
tg contacts lookup
```

### `tg contacts sync`

guarda toda la lista de contactos del servicio en el archivo local

```sh
tg contacts sync
```

### `tg contacts add`

añade un contacto; `contacts list` sigue mostrando solo personas con un chat individual

**Hace cambios en Telegram.**

```sh
tg contacts add <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | identificador de persona, obtenido con `contacts lookup`, o parte de un nombre conocido. |

### `tg contacts remove`

elimina un contacto; conserva el chat, pero puede perderse el nombre que le asignaste

**Hace cambios en Telegram.**

```sh
tg contacts remove <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | identificador de persona, obtenido con `contacts lookup`, o parte de un nombre conocido. |

### `tg contacts block`

impide que una persona te escriba; no necesita ser contacto

**Hace cambios en Telegram.**

```sh
tg contacts block <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | identificador de persona, obtenido con `contacts lookup`, o parte de un nombre conocido. |

### `tg contacts unblock`

permite que una persona bloqueada vuelva a escribirte

**Hace cambios en Telegram.**

```sh
tg contacts unblock <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | identificador de persona, obtenido con `contacts lookup`, o parte de un nombre conocido. |

### `tg contacts rename`

asigna un nombre propio a una persona; solo tú lo ves

**Hace cambios en Telegram.**

```sh
tg contacts rename <person> <first-name> [last-name]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | identificador de persona, obtenido con `contacts lookup`, o parte de un nombre conocido. |
| `first-name` | obligatorio | el nombre con el que quieres verla. |
| `last-name` | opcional |  |

### `tg contacts import`

carga números y añade los usuarios que el servicio reconoce

**Hace cambios en Telegram.**

```sh
tg contacts import <file>
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio | una persona por línea: número, coma, tabulador o punto y coma, y nombre. |

## `tg messages`

lee y envía mensajes

### `tg messages evidence`

paquete limitado de fuentes de mensajes guardados, recientes primero

```sh
tg messages evidence <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | cuántos, entre 1 y 100. |
| `--before-id <id>` | solo mensajes anteriores a este identificador. |

### `tg messages list`

mensajes del chat, del más antiguo al más reciente

```sh
tg messages list <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | cuántos. |
| `--before-id <id>` | solo mensajes anteriores a este identificador. |
| `--before-time <time>` | solo mensajes anteriores a esta fecha ISO 8601 o intervalo anterior como 2h / 1d. |
| `--after-id <id>` | solo mensajes posteriores a este identificador. |
| `--after-time <time>` | solo mensajes posteriores a esta fecha ISO 8601 o intervalo anterior como 2h / 1d. |
| `--transcribe` | transcribe notas de voz pendientes mediante el servicio o un modelo local; puede tardar minutos. |
| `--model <id>` | modelo de voz descargado para --transcribe; `models audio list` muestra los disponibles. |
| `--mark-read` | también marca como leído hasta el mensaje más reciente mostrado; la otra persona lo ve. |

### `tg messages search`

busca en lo leído, descargado o guardado por serve; nunca consulta el servicio

```sh
tg messages search <query> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | obligatorio | busca todas las palabras, mejores coincidencias primero; admite "a phrase", -word, a OR b y filtros from: chat: after: before: has: in:. Corrige erratas; sin coincidencias completas, busca cualquiera de las palabras y después fragmentos. |

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | solo este chat, igual que chat: en la consulta; título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `--source <messenger>` | todas las cuentas de este servicio guardadas, personal, bots o all; igual que in: en la consulta. |
| `--limit <n>` | cuántos. |
| `--newest` | recientes primero en lugar de mejores coincidencias. |
| `--context <n>` | mensajes anteriores y posteriores a cada resultado; 2 en terminal, 0 en otros casos. |
| `--regex` | interpreta el texto como expresión regular sin distinguir mayúsculas; comprueba todos los textos guardados. |

### `tg messages send`

envía texto; si omites [text], lo lee por stdin

**Hace cambios en Telegram.**

```sh
tg messages send <chat> [text] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `text` | opcional | el mensaje. |

| Opción | Qué hace |
|---|---|
| `--reply-to <message>` | responde al mensaje indicado por su identificador dentro del mismo chat. |
| `--send-id <id>` | reintenta un envío de resultado desconocido sin arriesgar una segunda copia. |
| `--silent` | entrega sin notificación. |
| `--no-preview` | no muestra vista previa de enlaces. |
| `--md` | interpreta **negrita**, _cursiva_, \~\~tachado\~\~ y `code`; \ conserva una marca literal. |
| `--file <file>` | adjunta un archivo; el texto será su leyenda. |
| `--photo <file>` | adjunta .jpg, .png o .webp como foto; el texto será su leyenda. |
| `--as-file` | envía --file como archivo descargable, incluidos vídeos. |
| `--voice <file>` | envía Ogg Opus como nota de voz, sin texto ni otros adjuntos. |
| `--allow-any-file` | permite enviar archivos incluso de carpetas ocultas, \~/.ssh o carpetas del propio CLI. |
| `--at-time <time>` | programa el envío en el servicio, aunque el equipo esté apagado: 2026-09-25T09:00 (hora local) o dentro de 30m, 2h, 1d. |

### `tg messages show`

un mensaje por chat e identificador, o por localizador msg:

```sh
tg messages show <chat> [message]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados; también localizador msg: sin identificador posterior. |
| `message` | opcional | identificador del mensaje. |

### `tg messages context`

un mensaje y su contexto anterior y posterior, antiguos primero

```sh
tg messages context <chat> [message] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados; también localizador msg: sin identificador posterior. |
| `message` | opcional | identificador del mensaje. |

| Opción | Qué hace |
|---|---|
| `--before-n <n>` | cuántos anteriores. Predeterminado: `5`. |
| `--after-n <n>` | cuántos posteriores. Predeterminado: `5`. |

### `tg messages download`

guarda fotos, archivos, vídeos y voz en una carpeta; con --all, los de todo el chat

```sh
tg messages download <chat> [message] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `message` | opcional | identificador de mensaje; se omite con --all. |

| Opción | Qué hace |
|---|---|
| `--output-dir <dir>` | carpeta de destino; se crea si falta. Predeterminada: `.`. |
| `--all` | todos los archivos del chat, recientes primero; repite para continuar. |
| `--pause <duration>` | con --all, pausa entre páginas para respetar límites del servicio. Predeterminada: `1s`. |

### `tg messages transcribe`

voz a texto mediante Telegram si está disponible, o un modelo local

```sh
tg messages transcribe <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `message` | obligatorio | identificador de una nota de voz. |

| Opción | Qué hace |
|---|---|
| `--local` | usa el modelo local, nunca el servicio. |
| `--model <id>` | modelo descargado que utilizar; implica --local (`models audio list`). |

### `tg messages edit`

cambia tu mensaje; puede que la otra persona ya haya leído el anterior

**Hace cambios en Telegram.**

```sh
tg messages edit <chat> <message> [text] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `message` | obligatorio | identificador de tu mensaje. |
| `text` | opcional | texto nuevo; si lo omites, se lee por stdin. |

| Opción | Qué hace |
|---|---|
| `--md` | interpreta **negrita**, _cursiva_, \~\~tachado\~\~ y `code`; \ conserva una marca literal. |

### `tg messages delete`

elimina mensajes solo para ti; con --for-everyone, para todos

**Hace cambios en Telegram.**

```sh
tg messages delete <chat> <messages> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `messages` | obligatorio | identificadores de mensajes, máximo 10. |

| Opción | Qué hace |
|---|---|
| `--for-everyone` | elimina para todos, no solo para ti; no se puede recuperar. |
| `--allow-dangerous` | omite la confirmación que el nivel ask exige antes de eliminar. |

### `tg messages forward`

reenvía un mensaje a otro chat

**Hace cambios en Telegram.**

```sh
tg messages forward <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat de origen, por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `message` | obligatorio | identificador del mensaje. |

| Opción | Qué hace |
|---|---|
| `--to <chat>` | chat de destino, por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `--silent` | entrega sin notificar. |
| `--send-id <id>` | reintenta un reenvío de resultado desconocido sin arriesgar otra copia. |

### `tg messages pin`

fija un mensaje sin aviso, salvo con --notify

**Hace cambios en Telegram.**

```sh
tg messages pin <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `message` | obligatorio | identificador del mensaje. |

| Opción | Qué hace |
|---|---|
| `--notify` | notifica a los miembros que se fijó el mensaje. |

### `tg messages unpin`

deja de fijar un mensaje

**Hace cambios en Telegram.**

```sh
tg messages unpin <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `message` | obligatorio | identificador del mensaje. |

### `tg messages scheduled`

mensajes programados, próximos primero; se cancelan desde la aplicación

```sh
tg messages scheduled <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

### `tg messages links`

enlaces que sitúan el mensaje en su conversación y cadena de respuestas hasta el inicio

```sh
tg messages links <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `message` | obligatorio | identificador del mensaje. |

## `tg reactions`

reacciones a mensajes

### `tg reactions add`

añade tu reacción, sustituyendo la anterior

**Hace cambios en Telegram.**

```sh
tg reactions add <chat> <message> <emoji>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `message` | obligatorio | identificador del mensaje. |
| `emoji` | obligatorio | un emoji, por ejemplo 👍. |

### `tg reactions remove`

retira tu reacción

**Hace cambios en Telegram.**

```sh
tg reactions remove <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `message` | obligatorio | identificador del mensaje. |

## `tg polls`

consulta, vota, cierra tus encuestas o crea una

### `tg polls show`

encuesta e identificadores de respuestas según el mensaje actual

```sh
tg polls show <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `message` | obligatorio | identificador del mensaje de la encuesta. |

### `tg polls vote`

vota o retira el voto; es visible salvo en encuestas anónimas

**Hace cambios en Telegram.**

```sh
tg polls vote <chat> <message> [answers] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `message` | obligatorio | identificador del mensaje de la encuesta. |
| `answers` | opcional | identificadores de respuestas tal como los muestra `polls show`. |

| Opción | Qué hace |
|---|---|
| `--retract` | retira tu voto. |

### `tg polls close`

cierra tu encuesta; no se puede votar ni reabrir

**Hace cambios en Telegram.**

```sh
tg polls close <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `message` | obligatorio | identificador de tu mensaje con la encuesta. |

### `tg polls create`

envía una encuesta como mensaje; pública salvo con --anonymous

**Hace cambios en Telegram.**

```sh
tg polls create <chat> <question> <answers> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `question` | obligatorio | la pregunta. |
| `answers` | obligatorio | al menos dos respuestas. |

| Opción | Qué hace |
|---|---|
| `--multiple` | permite elegir varias respuestas. |
| `--anonymous` | oculta quién votó por cada opción. |
| `--revote` | permite cambiar el voto. |
| `--silent` | envía sin notificación. |
| `--send-id <id>` | reintenta crear una encuesta de resultado desconocido sin duplicarla. |

## `tg models`

modelos que se ejecutan en este equipo

### `tg models audio`

modelos para transcribir voz

#### `tg models audio list`

modelos de voz, más adecuados primero, cuáles están descargados y cuál es el predeterminado

```sh
tg models audio list
```

#### `tg models audio download`

descarga un modelo y verifica el sha256 esperado por esta versión

```sh
tg models audio download <model>
```

| Argumento | | Qué es |
|---|---|---|
| `model` | obligatorio | identificador de modelo de `models audio list`. |

### `tg models text`

modelos vectoriales para buscar conversaciones por significado

#### `tg models text list`

modelos vectoriales, más adecuados primero, descargados y predeterminado

```sh
tg models text list
```

#### `tg models text download`

descarga un modelo vectorial y comprueba el sha256 esperado por la versión

```sh
tg models text download <model> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `model` | obligatorio | identificador de `models text list`. |

| Opción | Qué hace |
|---|---|
| `--accept-terms` | acepta las condiciones de licencia específicas del modelo. |

#### `tg models text key`

clave API de un servicio vectorial para `conversations embed --provider`

#### `tg models text key set`

guarda una clave introducida oculta o por stdin; nunca como argumento

```sh
tg models text key set <provider>
```

| Argumento | | Qué es |
|---|---|---|
| `provider` | obligatorio | openai o el servidor de --base-url que requiere una clave. |

#### `tg models text key remove`

elimina una clave guardada

```sh
tg models text key remove <provider>
```

| Argumento | | Qué es |
|---|---|---|
| `provider` | obligatorio | openai o el nombre de host del servidor. |

## `tg inbox`

mensajes ajenos sin leer en todos los chats; --new muestra los recibidos desde la última revisión

```sh
tg inbox [options]
```

| Opción | Qué hace |
|---|---|
| `--new` | lo recibido desde la revisión anterior, cada mensaje una vez; para tareas programadas. |
| `--since-time <time>` | lo recibido después de esta fecha ISO 8601 o intervalo anterior como 2h / 1d; conserva el punto guardado. |
| `--limit <n>` | máximo por chat, los más recientes. |
| `--all` | incluye silenciados y archivados; por defecto los omite salvo menciones o respuestas a ti. |
| `--transcribe` | transcribe notas de voz pendientes mediante el servicio o un modelo local; puede tardar minutos. |
| `--model <id>` | modelo de voz descargado para --transcribe; `models audio list` muestra los disponibles. |

## `tg review`

mensajes, incluidos los tuyos, en chats con actividad desde un momento; para revisar compromisos

```sh
tg review [options]
```

| Opción | Qué hace |
|---|---|
| `--since-time <time>` | punto donde terminó la revisión anterior, en ISO 8601 o intervalo anterior como 2h / 1d; últimos 3 días por defecto. |
| `--chat <chat>` | solo este chat, por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `--unanswered [duration]` | solo preguntas para ti o administradores sin respuesta y anteriores a este intervalo: 4h, 1d; 24h por defecto. |
| `--all` | incluye silenciados y archivados; por defecto los omite salvo menciones o respuestas a ti. |
| `--transcribe` | transcribe notas de voz pendientes mediante el servicio o un modelo local; puede tardar minutos. |
| `--model <id>` | modelo de voz descargado para --transcribe; `models audio list` muestra los disponibles. |

## `tg topics`

temas de un grupo de foro

### `tg topics list`

temas del foro por actividad reciente

```sh
tg topics list <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | número de página, desde 1. |
| `--all` | todas las filas, sin paginar. |

### `tg topics search`

temas del foro cuyos títulos coinciden

```sh
tg topics search <chat> <text> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `text` | obligatorio | palabras del título del tema. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | número de página, desde 1. |
| `--all` | todas las filas, sin paginar. |

## `tg watch`

imprime mensajes nuevos hasta Ctrl-C o --timeout; ambos finalizan normalmente

```sh
tg watch [options]
```

| Opción | Qué hace |
|---|---|
| `--events` | incluye ediciones, eliminaciones y reacciones; cada línea indica su evento. |

## `tg serve`

mantiene actualizado el archivo local hasta detenerlo; lo ejecutan unidades systemd o launchd

```sh
tg serve
```

## `tg server`

`tg serve` en segundo plano: iniciar, detener, reiniciar, estado y registros; install añade una unidad systemd o launchd

### `tg server start`

inicia serve en segundo plano mediante la unidad si existe y responde cuando se conecta

```sh
tg server start
```

### `tg server stop`

detiene serve de este perfil mediante su unidad, si la utiliza

```sh
tg server stop
```

### `tg server restart`

lo detiene y vuelve a iniciarlo

```sh
tg server restart
```

### `tg server status`

si serve está activo para el perfil, desde cuándo, quién lo inició y unidad si existe

```sh
tg server status
```

### `tg server logs`

últimos registros de serve, desde systemd o su archivo de registros

```sh
tg server logs [options]
```

| Opción | Qué hace |
|---|---|
| `-n, --lines <n>` | número de líneas. Predeterminado: `50`. |

### `tg server install`

crea una unidad systemd o agente launchd para el perfil, sin iniciarlo

```sh
tg server install
```

### `tg server uninstall`

elimina la unidad del perfil; detenla primero

```sh
tg server uninstall
```

## `tg store`

archivo local de mensajes

### `tg store status`

por chat: cantidad guardada, más antiguo y reciente, y tramos completos

```sh
tg store status [chat]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | opcional | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

### `tg store fetch`

descarga el historial, recientes primero; repite para continuar

```sh
tg store fetch <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | máximo de mensajes por ejecución; 1000 por defecto. |
| `--page-size <n>` | mensajes por petición; 100 por defecto. |
| `--pause <duration>` | pausa entre páginas para respetar límites. Predeterminada: `1s`. |
| `--since-time <time>` | detiene al llegar a mensajes anteriores a esta fecha ISO 8601 o intervalo anterior como 2h / 1d. |
| `--last <n>` | detiene cuando ya contiene los n mensajes más recientes. |
| `--background` | ejecuta como tarea que continúa al finalizar el comando; consúltala con `store jobs show`. |
| `--estimate` | solo estima mensajes, peticiones y minutos pendientes usando el archivo local, sin peticiones. |

### `tg store jobs`

descargas en segundo plano

#### `tg store jobs list`

descargas en segundo plano, recientes primero

```sh
tg store jobs list
```

#### `tg store jobs show`

tarea indicada o la más reciente y datos de su chat ya guardados

```sh
tg store jobs show [job]
```

| Argumento | | Qué es |
|---|---|---|
| `job` | opcional | identificador que imprimió `store fetch --background`. |

#### `tg store jobs cancel`

detiene la tarea tras la página actual; una descarga posterior reanuda desde ahí

```sh
tg store jobs cancel <job>
```

| Argumento | | Qué es |
|---|---|---|
| `job` | obligatorio | identificador de tarea. |

### `tg store export`

mensajes guardados de un chat en líneas JSON, antiguos primero; nunca consulta el servicio

```sh
tg store export <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

| Opción | Qué hace |
|---|---|
| `--format <format>` | jsonl (predeterminado): mensaje por línea; markdown: transcripción por días con respuestas y reenvíos citados. |
| `--since-time <time>` | solo a partir de esta fecha ISO 8601 o intervalo anterior como 30m / 2h / 1d. |
| `--output <file>` | escribe líneas JSON o transcripción en un archivo nuevo, legible solo por ti. |

### `tg store clear`

elimina del archivo los chats abandonados y sus mensajes

```sh
tg store clear [options]
```

| Opción | Qué hace |
|---|---|
| `--left` | chats que esta cuenta abandonó; es lo único que elimina. |
| `--allow-dangerous` | confirma la eliminación irreversible; no se pueden descargar de nuevo chats abandonados. |

### `tg store info`

ruta, tamaño, esquema y filas del archivo local; no cambia nada

```sh
tg store info
```

### `tg store check`

comprueba integridad, índices de búsqueda, disco y chats desactualizados

```sh
tg store check
```

### `tg store migrate`

actualiza el esquema a esta versión y normaliza mensajes anteriores

```sh
tg store migrate
```

### `tg store reindex`

reconstruye índice de palabras y vocabulario de erratas sin perder mensajes

```sh
tg store reindex
```

### `tg store backup`

copia el archivo local mientras está en uso, sin sobrescribir

```sh
tg store backup <file>
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio | archivo nuevo. |

### `tg store restore`

restaura una copia; conserva al lado el archivo sustituido, sin eliminarlo

```sh
tg store restore <file>
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio | archivo creado por `store backup`. |

## `tg conversations`

conversaciones dentro de un chat, identificadas por respuestas, menciones y turnos de los mensajes guardados

### `tg conversations build`

identifica conversaciones en el archivo local, sustituyendo el análisis anterior; nunca consulta el servicio

```sh
tg conversations build [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

### `tg conversations list`

conversaciones recientes primero: fecha, mensajes y participantes

```sh
tg conversations list [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `--since-time <time>` | solo iniciadas a partir de esta fecha ISO 8601 o intervalo anterior como 30m / 2h / 1d. |
| `--limit <n>` | cuántos. |

### `tg conversations show`

mensajes de una conversación, antiguos primero, por identificador o por un mensaje que contiene

```sh
tg conversations show <conversation> [message]
```

| Argumento | | Qué es |
|---|---|---|
| `conversation` | obligatorio | identificador de `conversations list` o chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados, seguido de un mensaje. |
| `message` | opcional | identificador de mensaje del chat; muestra la conversación que lo contiene. |

### `tg conversations search`

conversaciones más próximas por significado y palabras, mejores primero, en uno o todos los chats; significado tras `conversations embed`, en este equipo

```sh
tg conversations search <query> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | obligatorio | qué buscar, con tus palabras, en un idioma que entienda el modelo. |

| Opción | Qué hace |
|---|---|
| `--model <model>` | local: identificador de `models text list` (predeterminado: e5-small); remoto: modelo del proveedor. |
| `--provider <provider>` | calcula vectores mediante servicio con tu clave en lugar de localmente: openai. |
| `--base-url <url>` | servidor compatible con /v1/embeddings de OpenAI: Gemini, Jina, Ollama o LM Studio local. |
| `--dims <n>` | remoto: tamaño vectorial; necesario con --base-url y reduce el de modelos OpenAI. |
| `--chat <chat>` | solo este chat, por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `--since-time <time>` | solo conversaciones aún activas desde esta fecha ISO 8601 o intervalo anterior como 30m / 2h / 1d. |
| `--limit <n>` | cuántos. |

### `tg conversations batches`

ventanas de mensajes para que tu agente identifique a qué mensaje anterior responde cada uno

#### `tg conversations batches status`

mensajes pendientes de vincular, número de lotes y cantidad de texto

```sh
tg conversations batches status [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `--size <n>` | mensajes que vincular por lote, 10–200; 50 por defecto. |

#### `tg conversations batches next`

siguiente ventana con contexto previo; el texto solo se imprime por stdout

```sh
tg conversations batches next [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `--size <n>` | mensajes que vincular por lote, 10–200; 50 por defecto. |

### `tg conversations links`

respuestas de tu agente: a qué mensaje anterior responde cada mensaje del lote

#### `tg conversations links add`

guarda la respuesta del agente desde JSON por stdin: { "model", "answers": [{ "message", "parent", "confidence" }] }; operación completa o nada

```sh
tg conversations links add [options]
```

| Opción | Qué hace |
|---|---|
| `--batch <id>` | identificador de lote que imprimió `conversations batches next`. |

#### `tg conversations links clear`

elimina respuestas del agente de un chat o un modelo, sin tocar mensajes

```sh
tg conversations links clear [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `--model <model>` | solo respuestas de este modelo. |

### `tg conversations embed`

calcula vectores de cada fragmento de conversaciones para búsqueda semántica, localmente o con --provider y tu clave; puede reanudarse

```sh
tg conversations embed [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `--model <model>` | local: identificador de `models text list` (predeterminado: e5-small); remoto: modelo del proveedor. |
| `--provider <provider>` | calcula vectores mediante servicio con tu clave en lugar de localmente: openai. |
| `--base-url <url>` | servidor compatible con /v1/embeddings de OpenAI: Gemini, Jina, Ollama o LM Studio local. |
| `--dims <n>` | remoto: tamaño vectorial; necesario con --base-url y reduce el de modelos OpenAI. |
| `--workers <n>` | local: sesiones paralelas, cada una con su copia del modelo (\~0,7 GB por copia). |
| `--threads <n>` | local: hilos totales (predeterminado: min(8, núcleos)). |
| `--concurrency <n>` | remoto: peticiones simultáneas (predeterminado: 4). |
| `--max-tokens <n>` | remoto: rechaza una ejecución que pueda enviar más tokens que este límite. |

#### `tg conversations embed status`

fragmentos con vectores, pendientes y coste de los pendientes

```sh
tg conversations embed status [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `--model <model>` | local: identificador de `models text list` (predeterminado: e5-small); remoto: modelo del proveedor. |
| `--provider <provider>` | calcula vectores mediante servicio con tu clave en lugar de localmente: openai. |
| `--base-url <url>` | servidor compatible con /v1/embeddings de OpenAI: Gemini, Jina, Ollama o LM Studio local. |
| `--dims <n>` | remoto: tamaño vectorial; necesario con --base-url y reduce el de modelos OpenAI. |

#### `tg conversations embed clear`

elimina vectores de un chat o modelo, sin tocar mensajes ni conversaciones

```sh
tg conversations embed clear [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `--model <model>` | local: identificador de `models text list` (predeterminado: e5-small); remoto: modelo del proveedor. |
| `--provider <provider>` | calcula vectores mediante servicio con tu clave en lugar de localmente: openai. |
| `--base-url <url>` | servidor compatible con /v1/embeddings de OpenAI: Gemini, Jina, Ollama o LM Studio local. |
| `--dims <n>` | remoto: tamaño vectorial; necesario con --base-url y reduce el de modelos OpenAI. |

## `tg recipients`

chats permitidos para este perfil si la lista está activa

### `tg recipients list`

chats de la lista; vacía e inactiva hasta añadir el primero

```sh
tg recipients list
```

### `tg recipients add`

permite enviar al chat; el primer añadido activa la lista

**Solo hace cambios en este equipo.**

```sh
tg recipients add <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

### `tg recipients remove`

retira el permiso del chat; la lista sigue activa

**Solo hace cambios en este equipo.**

```sh
tg recipients remove <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador de chat o título tal como aparece en la lista. |

### `tg recipients clear`

elimina y desactiva la lista; el perfil vuelve a poder enviar a cualquier chat

**Solo hace cambios en este equipo.**

```sh
tg recipients clear
```

## `tg sends`

todos los intentos de envío del perfil, nunca el texto

### `tg sends list`

intentos recientes primero: enviados, rechazados, fallidos o desconocidos

```sh
tg sends list [options]
```

| Opción | Qué hace |
|---|---|
| `--limit <n>` | cuántos mostrar. |

## `tg runs`

ejecuciones registradas: qué hizo la herramienta y cuándo

### `tg runs list`

ejecuciones registradas, recientes primero

```sh
tg runs list [options]
```

| Opción | Qué hace |
|---|---|
| `--limit <n>` | cuántas mostrar. Predeterminado: `20`. |

### `tg runs show`

una ejecución: información general y una línea por operación

```sh
tg runs show <run-id>
```

| Argumento | | Qué es |
|---|---|---|
| `run-id` | obligatorio | identificador de `tg runs list`. |

### `tg runs path`

directorio de una ejecución

```sh
tg runs path <run-id>
```

| Argumento | | Qué es |
|---|---|---|
| `run-id` | obligatorio | identificador de `tg runs list`. |

## `tg config`

ajustes efectivos y origen de cada valor

### `tg config show`

perfil, perfiles existentes y ajustes con su origen

```sh
tg config show [options]
```

| Opción | Qué hace |
|---|---|
| `--bot` | ajustes del bot del perfil en lugar de los de la cuenta personal. |

### `tg config set`

guarda un ajuste en la configuración

**Solo hace cambios en este equipo.**

```sh
tg config set <setting> <value> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `setting` | obligatorio | uno de: limit, timeoutMs, color, senderColors, record, keepRunsForDays, readOnly, allow, permissions, sendsPerHour, transcribeWith, speechModel, readOtherBots, updateCheck, skillHint. |
| `value` | obligatorio | número, true o false; para allow, lista como send,reaction. |

| Opción | Qué hace |
|---|---|
| `--defaults` | cambia los valores de todos los perfiles en lugar de solo este. |
| `--personal` | solo cuentas personales, sección personal del archivo. |
| `--bot` | solo bots, sección bot del archivo. |

### `tg config unset`

elimina un ajuste de la configuración

**Solo hace cambios en este equipo.**

```sh
tg config unset <setting> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `setting` | obligatorio | uno de: limit, timeoutMs, color, senderColors, record, keepRunsForDays, readOnly, allow, permissions, sendsPerHour, transcribeWith, speechModel, readOtherBots, updateCheck, skillHint. |

| Opción | Qué hace |
|---|---|
| `--defaults` | cambia los valores de todos los perfiles en lugar de solo este. |
| `--personal` | solo cuentas personales, sección personal del archivo. |
| `--bot` | solo bots, sección bot del archivo. |

## `tg doctor`

estado de la instalación, sin conectarse salvo con --online

```sh
tg doctor [options]
```

| Opción | Qué hace |
|---|---|
| `--online` | también se conecta una vez y lee la cuenta, sin enviar. |

### `tg doctor report`

contenido de un informe de problema; no escribe nada

#### `tg doctor report create`

guarda un informe en un archivo e indica dónde enviarlo

```sh
tg doctor report create [options]
```

| Opción | Qué hace |
|---|---|
| `--run <id>` | ejecución que incluir; la última fallida por defecto. |
| `--output <file>` | destino; un archivo nuevo en la carpeta actual por defecto. |

## `tg commands`

comandos, opciones y códigos de salida en JSON, para agentes en lugar de --help

```sh
tg commands
```

## `tg complete`

autocompletado: `tg complete zsh` imprime el script que debe cargarse

```sh
tg complete [words]
```

| Argumento | | Qué es |
|---|---|---|
| `words` | opcional |  |

## `tg upgrade`

actualiza tg con su gestor de paquetes; --check solo comprueba

```sh
tg upgrade [options]
```

| Opción | Qué hace |
|---|---|
| `--check` | comprueba si hay nueva versión sin instalar nada. |

## `tg mcp`

ofrece el perfil a un agente por MCP mediante stdin y stdout: `claude mcp add tg -- tg mcp`

```sh
tg mcp [options]
```

| Opción | Qué hace |
|---|---|
| `--confirm-send` | muestra al propietario un formulario antes de cada escritura. |
| `--allow-dangerous` | sin formulario antes de eliminar si el nivel es ask. |
| `--allow-send` | obsoleta: deciden los permisos del perfil; se conserva para compatibilidad. |
| `--allow-mark-read` | obsoleta: deciden los permisos del perfil. |
| `--allow-delete` | obsoleta: deciden los permisos del perfil. |

### `tg mcp config`

imprime la entrada mcpServers para Claude Desktop, Cursor y otros con rutas completas, sin escribir

```sh
tg mcp config [options]
```

| Opción | Qué hace |
|---|---|
| `--confirm-send` | muestra al propietario un formulario antes de cada escritura. |
| `--allow-dangerous` | sin formulario antes de eliminar si el nivel es ask. |
| `--allow-send` | obsoleta: deciden los permisos del perfil; se conserva para compatibilidad. |
| `--allow-mark-read` | obsoleta: deciden los permisos del perfil. |
| `--allow-delete` | obsoleta: deciden los permisos del perfil. |

## `tg bot`

bot de Telegram mediante la Bot API oficial y un token, independiente de tu cuenta personal

### `tg bot auth`

token del bot de este perfil

#### `tg bot auth set`

valida el token con Telegram y lo guarda; se introduce oculto o por stdin

**Solo hace cambios en este equipo.**

```sh
tg bot auth set
```

#### `tg bot auth show`

origen del token del perfil y bot al que pertenece

```sh
tg bot auth show
```

#### `tg bot auth remove`

elimina el token de bot del perfil

**Solo hace cambios en este equipo.**

```sh
tg bot auth remove
```

### `tg bot list`

nombres del equipo con token de bot; --check consulta a Telegram qué bot es cada uno

```sh
tg bot list [options]
```

| Opción | Qué hace |
|---|---|
| `--check` | consulta al servicio qué bot es cada uno mediante su token. |

### `tg bot chats`

chats del bot; Telegram no proporciona su lista, por lo que `list` muestra solo los vistos

#### `tg bot chats list`

chats que el bot ha visto en este equipo, no una lista completa de Telegram

```sh
tg bot chats list
```

#### `tg bot chats show`

consulta un chat de Telegram y lo recuerda

```sh
tg bot chats show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |

#### `tg bot chats leave`

saca el bot del chat; solo un administrador puede volver a añadirlo

**Hace cambios en Telegram.**

```sh
tg bot chats leave <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador o título de un chat visto por el bot. |

#### `tg bot chats action`

muestra durante segundos la acción del bot, como escribir o enviar foto

**Hace cambios en Telegram.**

```sh
tg bot chats action <chat> <action>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |
| `action` | obligatorio | acción visible. Valores: `typing`, `photo`, `video`, `voice`, `file`. |

#### `tg bot chats admins`

administradores de un chat donde el bot es administrador

#### `tg bot chats admins list`

administradores y permisos de cada uno

```sh
tg bot chats admins list <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador o título de un chat visto por el bot. |

#### `tg bot chats admins add`

convierte a un miembro en administrador con estos permisos

**Hace cambios en Telegram.**

```sh
tg bot chats admins add <chat> <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador o título de un chat visto por el bot. |
| `person` | obligatorio | identificador de usuario de la persona. |

| Opción | Qué hace |
|---|---|
| `--can <rights>` | permisos separados por comas: members, admins, info, pin, link, post, edit, delete. |
| `--title <title>` | título mostrado junto al nombre. |

#### `tg bot chats admins remove`

retira permisos de administrador; sigue siendo miembro

**Hace cambios en Telegram.**

```sh
tg bot chats admins remove <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador o título de un chat visto por el bot. |
| `person` | obligatorio | identificador de usuario de la persona. |

#### `tg bot chats members`

personas de un chat donde el bot es administrador

#### `tg bot chats members remove`

elimina una persona del chat, conservando sus mensajes

**Hace cambios en Telegram.**

```sh
tg bot chats members remove <chat> <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador o título de un chat visto por el bot. |
| `person` | obligatorio | identificador de usuario de la persona. |

| Opción | Qué hace |
|---|---|
| `--block` | también impide que vuelva mediante el enlace del chat. |

#### `tg bot chats rules`

reglas de moderación del bot, guardadas en este equipo

#### `tg bot chats rules show`

reglas del chat; sin reglas guardadas, muestra las predeterminadas como no guardadas

```sh
tg bot chats rules show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador de grupo o título de un grupo visto por el bot. |

#### `tg bot chats rules set`

cambia una regla: trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove

**Solo hace cambios en este equipo.**

```sh
tg bot chats rules set <chat> <key> <value>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador de grupo o título de un grupo visto por el bot. |
| `key` | obligatorio | la regla. |
| `value` | obligatorio | nuevo valor. |

#### `tg bot chats rules unset`

restablece una regla a su valor predeterminado

**Solo hace cambios en este equipo.**

```sh
tg bot chats rules unset <chat> <key>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador de grupo o título de un grupo visto por el bot. |
| `key` | obligatorio | la regla. |

#### `tg bot chats moderate`

revisa como bot mensajes y entradas nuevos según las reglas y ejecuta lo permitido

**Hace cambios en Telegram.**

```sh
tg bot chats moderate <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador de grupo o título de un grupo visto por el bot. |

| Opción | Qué hace |
|---|---|
| `--since-time <time>` | revisa desde esta fecha ISO 8601 o intervalo anterior como 2h / 1d; no cambia el punto guardado. |
| `--dry-run` | revisa y prepara un plan, sin actuar. |
| `--allow-dangerous` | aprueba todas las acciones con nivel ask en las reglas del grupo. |
| `--no-ban` | elimina sin bloquear; por defecto la persona eliminada no puede volver por enlace. |
| `--max-actions <n>` | máximo de acciones por ejecución; 10 por defecto. |

### `tg bot messages`

mensajes de los chats del bot

#### `tg bot messages send`

envía como bot; sin [text], lee por stdin

**Hace cambios en Telegram.**

```sh
tg bot messages send <chat> [text] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |
| `text` | opcional | el mensaje. |

| Opción | Qué hace |
|---|---|
| `--reply-to <message>` | responde al mensaje indicado por su identificador dentro del mismo chat. |
| `--silent` | entrega sin notificación. |
| `--md` | interpreta **negrita**, _cursiva_, \~\~tachado\~\~ y `code`; \ conserva una marca literal. |
| `--html` | texto HTML: <b>, <i>, <a href>, <code>. |
| `--file <file>` | adjunta un archivo; el texto será su leyenda. |
| `--photo <file>` | adjunta .jpg, .png o .webp como foto; el texto será su leyenda. |
| `--as-file` | envía --file como archivo descargable, incluidos vídeos. |
| `--voice <file>` | envía Ogg Opus como nota de voz, sin texto ni otros adjuntos. |
| `--allow-any-file` | permite enviar archivos incluso de carpetas ocultas, \~/.ssh o carpetas del propio CLI. |

#### `tg bot messages list`

mensajes recientes; si Telegram no ofrece historial al bot o con --offline, solo los vistos en este equipo

```sh
tg bot messages list <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | cuántos, los más recientes. |

#### `tg bot messages show`

mensaje por identificador dentro del chat

```sh
tg bot messages show <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |
| `message` | obligatorio | identificador de mensaje. |

#### `tg bot messages edit`

sustituye el texto de un mensaje del bot

**Hace cambios en Telegram.**

```sh
tg bot messages edit <chat> <message> <text> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |
| `message` | obligatorio | identificador de mensaje. |
| `text` | obligatorio | texto nuevo. |

| Opción | Qué hace |
|---|---|
| `--md` | interpreta **negrita**, _cursiva_, \~\~tachado\~\~ y `code`; \ conserva una marca literal. |
| `--html` | texto HTML: <b>, <i>, <a href>, <code>. |

#### `tg bot messages delete`

elimina mensajes donde el bot tiene permiso; irreversible

**Hace cambios en Telegram.**

```sh
tg bot messages delete <chat> <messages> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |
| `messages` | obligatorio | identificadores de mensajes. |

| Opción | Qué hace |
|---|---|
| `--allow-dangerous` | elimina sin preguntar. |

#### `tg bot messages pin`

fija sin aviso salvo con --notify

**Hace cambios en Telegram.**

```sh
tg bot messages pin <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |
| `message` | obligatorio | identificador de mensaje. |

| Opción | Qué hace |
|---|---|
| `--notify` | avisa a los miembros. |

#### `tg bot messages unpin`

deja de fijar un mensaje

**Hace cambios en Telegram.**

```sh
tg bot messages unpin <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |
| `message` | obligatorio | identificador de mensaje. |

#### `tg bot messages search`

busca solo en la copia local del bot, mejores coincidencias primero; todas las palabras; admite "a phrase", -word, a OR b, from: chat: after: before: has:. Por texto, --from o ambos

```sh
tg bot messages search [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | palabras que buscar. |

| Opción | Qué hace |
|---|---|
| `--all-bots` | también lee las copias de otros bots permitidas por readOtherBots. |
| `--bots <profiles>` | también lee estos bots, separados por comas; todos deben estar permitidos por readOtherBots. |
| `--limit <n>` | cuántos. |
| `--newest` | recientes primero en lugar de mejores coincidencias. |
| `--from <who>` | solo mensajes de esta persona, por identificador, @username o nombre parcial; repite para incluir varias. |

#### `tg bot messages between`

mensajes de dos o más personas en chats donde todas han escrito, según copia local, agrupados por chat y antiguos primero; --limit cuenta por chat. Los chats comunes se deducen de lo guardado, no de listas de miembros de Telegram

```sh
tg bot messages between <people> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `people` | obligatorio | al menos dos personas, cada una por identificador, @username o nombre parcial. |

| Opción | Qué hace |
|---|---|
| `--all-bots` | también lee las copias de otros bots permitidas por readOtherBots. |
| `--bots <profiles>` | también lee estos bots, separados por comas; todos deben estar permitidos por readOtherBots. |
| `--limit <n>` | cantidad de mensajes recientes por chat. |

### `tg bot recipients`

chats permitidos para el bot; sin lista se permiten todos; `clear` elimina la lista

#### `tg bot recipients list`

chats de la lista o nada si no existe

```sh
tg bot recipients list
```

#### `tg bot recipients add`

permite un chat por identificador, `user:<id>` o título de un chat visto por este bot

**Solo hace cambios en este equipo.**

```sh
tg bot recipients add <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio |  |

#### `tg bot recipients remove`

quita un chat de la lista

**Solo hace cambios en este equipo.**

```sh
tg bot recipients remove <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio |  |

#### `tg bot recipients clear`

elimina la lista; el bot puede escribir de nuevo a cualquier chat

**Solo hace cambios en este equipo.**

```sh
tg bot recipients clear
```

### `tg bot sends`

envíos, ediciones y eliminaciones del bot desde este equipo; identificadores y resultados, nunca texto

#### `tg bot sends list`



```sh
tg bot sends list
```

### `tg bot watch`

imprime y guarda mensajes nuevos hasta Ctrl-C o --timeout; ambos finalizan normalmente

```sh
tg bot watch [options]
```

| Opción | Qué hace |
|---|---|
| `--events` | incluye ediciones, eliminaciones, botones y entradas y salidas; cada línea indica el evento. |
| `--types <types>` | tipos de actualización separados por comas, con los nombres del servicio. |

### `tg bot callbacks`

respuestas a botones bajo los mensajes del bot

#### `tg bot callbacks answer`

responde por identificador callback; --notification muestra un aviso solo a la persona, --text cambia el mensaje del botón

**Hace cambios en Telegram.**

```sh
tg bot callbacks answer <callback> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `callback` | obligatorio | identificador callback de `bot watch`. |

| Opción | Qué hace |
|---|---|
| `--text <text>` | texto nuevo del mensaje. |
| `--notification <text>` | aviso que solo ve quien pulsó. |

### `tg bot commands`

menú de comandos del bot, visible después de /

#### `tg bot commands list`

comandos actuales del menú

```sh
tg bot commands list
```

#### `tg bot commands set`

sustituye todo el menú; cada comando como name=description, por ejemplo start=Begin

**Hace cambios en Telegram.**

```sh
tg bot commands set <commands>
```

| Argumento | | Qué es |
|---|---|---|
| `commands` | obligatorio | name=description, uno por comando. |

#### `tg bot commands clear`

vacía el menú

**Hace cambios en Telegram.**

```sh
tg bot commands clear
```

### `tg bot webhooks`

destino de actualizaciones del servicio; si está configurado, `bot watch` no recibe nada

#### `tg bot webhooks list`

webhooks del bot

```sh
tg bot webhooks list
```

#### `tg bot webhooks set`

envía actualizaciones a HTTPS; rechaza si ya hay otro configurado

**Hace cambios en Telegram.**

```sh
tg bot webhooks set <url> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `url` | obligatorio | dirección HTTPS. |

| Opción | Qué hace |
|---|---|
| `--types <types>` | tipos de actualización separados por comas, con los nombres del servicio. |
| `--secret-stdin` | secreto que el servicio devuelve con cada actualización; se solicita o lee por stdin. |

#### `tg bot webhooks delete`

deja de enviar a esa dirección; sin webhooks, `bot watch` funciona de nuevo

**Hace cambios en Telegram.**

```sh
tg bot webhooks delete <url>
```

| Argumento | | Qué es |
|---|---|---|
| `url` | obligatorio | dirección. |

### `tg bot contacts`

personas cuyos mensajes vio el bot, desde la copia local, sin consultar Telegram salvo indicación

#### `tg bot contacts show`

persona, chats donde escribió con su último mensaje y mensajes recientes de su chat privado con el bot

```sh
tg bot contacts show <who> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `who` | obligatorio | identificador, @username o nombre parcial. |

| Opción | Qué hace |
|---|---|
| `--all-bots` | también lee las copias de otros bots permitidas por readOtherBots. |
| `--bots <profiles>` | también lee estos bots, separados por comas; todos deben estar permitidos por readOtherBots. |
| `--limit <n>` | cantidad de mensajes del chat privado. |
| `--refresh` | vuelve a consultar primero el chat privado desde el servicio; una petición. |

### `tg bot mcp`

ofrece el bot por MCP mediante stdin y stdout: `claude mcp add sales-bot -- tg sales bot mcp`

```sh
tg bot mcp [options]
```

| Opción | Qué hace |
|---|---|
| `--confirm-send` | muestra al propietario un formulario antes de cada escritura. |
| `--allow-dangerous` | sin formulario antes de eliminar si el nivel es ask. |
| `--allow-send` | obsoleta: deciden los permisos del perfil; se conserva para compatibilidad. |
| `--allow-delete` | obsoleta: deciden los permisos del perfil. |
| `--allow-moderate` | obsoleta: deciden los permisos del perfil. |

#### `tg bot mcp config`

imprime la entrada mcpServers para Claude Desktop, Cursor y otros con rutas completas, sin escribir

```sh
tg bot mcp config [options]
```

| Opción | Qué hace |
|---|---|
| `--confirm-send` | muestra al propietario un formulario antes de cada escritura. |
| `--allow-dangerous` | sin formulario antes de eliminar si el nivel es ask. |
| `--allow-send` | obsoleta: deciden los permisos del perfil; se conserva para compatibilidad. |
| `--allow-delete` | obsoleta: deciden los permisos del perfil. |
| `--allow-moderate` | obsoleta: deciden los permisos del perfil. |

## `tg skill`

instrucciones para que un agente utilice la herramienta

### `tg skill show`

imprime SKILL.md; `tg skill install` lo coloca donde lo buscan Claude Code, Codex y Gemini CLI

```sh
tg skill show [name]
```

| Argumento | | Qué es |
|---|---|---|
| `name` | opcional | skill de tarea incluida: link-conversations. |

### `tg skill install`

guarda SKILL.md en \~/.claude/skills/tg-cli/ (Claude Code) y \~/.agents/skills/tg-cli/ (Codex, Gemini CLI)

```sh
tg skill install [options]
```

| Opción | Qué hace |
|---|---|
| `--for <agents>` | agentes para los que instalar. Valores: `claude`, `agents`, `all`. Predeterminado: `all`. |

## Códigos de salida

Decide según el código, no según el texto: el texto puede cambiar, el código no.

| Código | Cuándo |
|---|---|
| `0` | éxito |
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
| `1` | cualquier otro caso |

Solo `0` significa que se completó la operación. `14` (`outcome_unknown`) significa que un mensaje **puede**
haber llegado; repite solo con el mismo `--send-id` para que Telegram descarte una segunda copia.
