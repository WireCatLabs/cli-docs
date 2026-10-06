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

## `tg setup`

configura Telegram y conecta tu agente

**Hace cambios en Telegram.**

```sh
tg setup [options]
```

| Opción | Qué hace |
|---|---|
| `--agent <agent>` | instala la skill para este agente; pregunta en una terminal, de lo contrario no instala ninguna. Valores: `none`, `codex`, `cursor`, `claude`, `gemini`, `all`. |
| `--app <how>` | cómo obtener las credenciales de aplicación Telegram la primera vez. Valores: `auto`, `browser`. Por defecto: `auto`. |
| `--method <method>` | cómo iniciar sesión si no existe una. Valores: `qr`, `phone`. Por defecto: `qr`. |
| `--qr-file <png>` | guarda una imagen QR temporal para el acceso del agente; sin terminal requiere credenciales de aplicación guardadas. |

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
| `query` | obligatorio | consulta estricta de Lucene: palabras, "frases", AND/OR/NOT, grupos de campos e intervalos de fechas; --language legacy conserva la búsqueda aproximada. |

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | solo este chat, igual que chat: en la consulta; título completo o parcial, identificador, @username o `me` para Mensajes guardados. |
| `--source <messenger>` | todas las cuentas de este servicio guardadas, personal, bots o all; igual que in: en la consulta. |
| `--limit <n>` | cuántos. |
| `--newest` | recientes primero en lugar de mejores coincidencias. |
| `--context <n>` | mensajes anteriores y posteriores a cada resultado; 2 en terminal, 0 en otros casos. |
| `--language <lucene\|legacy>` | lenguaje de consulta: Lucene estricto o búsqueda aproximada heredada. |
| `--timezone <zone>` | zona horaria IANA para los límites de fechas del calendario. |
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
| `--topic <id>` | envía a este tema de foro; no disponible en mensajeros sin temas. |
| `--reply-to <message>` | responde al mensaje indicado por su identificador dentro del mismo chat. |
| `--send-id <id>` | reintenta un envío de resultado desconocido sin arriesgar una segunda copia. |
| `--silent` | entrega sin notificación. |
| `--no-preview` | no muestra vista previa de enlaces. |
| `--md` | interpreta el Markdown de este mensajero; consulta la guía de formato para la sintaxis admitida. |
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
| `--md` | interpreta el Markdown de este mensajero; consulta la guía de formato para la sintaxis admitida. |

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

### `tg messages link`

un permalink cuando se admite y el locator asociado a la cuenta

```sh
tg messages link <chat> [message]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados; también localizador msg: sin identificador posterior. |
| `message` | opcional | identificador del mensaje. |

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
| `--topic <id>` | envía a este tema de foro; no disponible en mensajeros sin temas. |
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

### `tg topics enable`

activa temas de foro; solo el propietario, con conversión explícita para un grupo básico

**Hace cambios en Telegram.**

```sh
tg topics enable <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat por título completo o parcial, identificador, @username o `me` para Mensajes guardados. |

| Opción | Qué hace |
|---|---|
| `--upgrade` | convierte primero un grupo básico en supergrupo; cambia el identificador del chat. |

### `tg topics create`

crea un tema con nombre en un foro existente; nunca activa ni convierte un grupo implícitamente

**Hace cambios en Telegram.**

```sh
tg topics create <chat> <title> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: título o parte de él, identificador, @username o `me` para Mensajes guardados. |
| `title` | obligatorio | el título del tema, hasta 128 bytes UTF-8. |

| Opción | Qué hace |
|---|---|
| `--send-id <id>` | identifica este intento de creación; rechaza un identificador ya enviado o de resultado desconocido. |

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

### `tg config migrate`

sustituir los ajustes de acceso antiguos por permisos, conservando los niveles efectivos de este archivo

**Solo hace cambios en este equipo.**

```sh
tg config migrate [options]
```

| Opción | Qué hace |
|---|---|
| `--dry-run` | mostrar la migración sin escribir el archivo. |

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

comandos, opciones y códigos de salida en JSON; consulta una ruta de comando por llamada

```sh
tg commands [path]
```

| Argumento | | Qué es |
|---|---|---|
| `path` | opcional | una ruta de comando, por ejemplo: messages search; consulta los demás grupos en llamadas separadas. |

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

### `tg mcp setup`

añade el servidor MCP local de este perfil a Codex o Claude Code

**Solo hace cambios en este equipo.**

```sh
tg mcp setup <client> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `client` | obligatorio | codex o claude-code. |

| Opción | Qué hace |
|---|---|
| `--allow-writes` | confirma que este perfil ofrece herramientas de escritura. |
| `--confirm-send` | muestra al propietario un formulario del servidor antes de cada escritura. |
| `--allow-dangerous` | omite el formulario antes de eliminar con nivel de permiso ask. |
| `--allow-send` | ya no se usa: los permisos del perfil deciden; se conserva para que las configuraciones anteriores arranquen. |
| `--allow-mark-read` | ya no se usa: los permisos del perfil deciden. |
| `--allow-delete` | ya no se usa: los permisos del perfil deciden. |

### `tg mcp doctor`

comprueba la conexión inicial MCP local y la lista de herramientas de este perfil

```sh
tg mcp doctor [options]
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
| `--md` | interpreta el Markdown de este mensajero; consulta la guía de formato para la sintaxis admitida. |
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
| `--md` | interpreta el Markdown de este mensajero; consulta la guía de formato para la sintaxis admitida. |
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

### `tg bot me`

el bot al que pertenece el token de este perfil: identificador, nombre y nombre de usuario

```sh
tg bot me
```

### `tg bot store`

la copia local del bot en este equipo

#### `tg bot store fetch`

descarga el historial del chat a la copia local del bot, recientes primero; repite para continuar

```sh
tg bot store fetch <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | identificador o título de un chat visto por el bot. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | máximo de mensajes en esta ejecución; 1000 si se omite. |
| `--page-size <n>` | mensajes por petición; 100 si se omite. |
| `--pause <duration>` | espera entre páginas para respetar los límites del mensajero. Por defecto: `1s`. |
| `--since-time <time>` | se detiene al llegar a mensajes anteriores al momento indicado: ISO 8601 o 2h / 1d atrás. |
| `--last <n>` | se detiene cuando tiene guardados los n mensajes más recientes. |
| `--from <link>` | empieza en este enlace de mensaje, incluido; de lo contrario usa el mensaje más reciente conocido. |

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

### `tg bot api`

every operation of the official Bot API, generated from its schema

```sh
tg bot api [options]
```

| Option | What it does |
|---|---|
| `--store-token <profile>` | keep a returned authentication token only in this bot profile's OS keyring; never print it. |

#### `tg bot api get-updates`

Use this method to receive incoming updates using long polling (wiki). Returns an Array of Update objects. — destructive (getUpdates)

**Changes something in Telegram.**

```sh
tg bot api get-updates [options]
```

| Option | What it does |
|---|---|
| `--offset <value>` | Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its update_id. The negative offset can be specified to retrieve updates starting from -offset update from the end of the updates queue. All previous updates will be forgotten. |
| `--limit <value>` | Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100. |
| `--poll-timeout <value>` | Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only. |
| `--allowed-updates <value>` | A JSON-serialized list of the update types you want your bot to receive. For example, specify ["message", "edited_channel_post", "callback_query"] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member, message_reaction, and message_reaction_count (default). If not specified, the previous setting will be used. Please note that this parameter doesn't affect updates created before the call to getUpdates, so unwanted updates may be received for a short period of time. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-webhook`

Use this method to specify a URL and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified URL, containing a JSON-serialized Update. In case of an unsuccessful request (a request with response HTTP status code different from 2XY), we will repeat the request and give up after a reasonable amount of attempts. Returns True on success. — write (setWebhook)

**Changes something in Telegram.**

```sh
tg bot api set-webhook [options]
```

| Option | What it does |
|---|---|
| `--url <value>` | HTTPS URL to send updates to. Use an empty string to remove webhook integration. |
| `--certificate <value>` | Upload your public key certificate so that the root certificate in use can be checked. See our self-signed guide for details. |
| `--ip-address <value>` | The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS. |
| `--max-connections <value>` | The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40. Use lower values to limit the load on your bot's server, and higher values to increase your bot's throughput. |
| `--allowed-updates <value>` | A JSON-serialized list of the update types you want your bot to receive. For example, specify ["message", "edited_channel_post", "callback_query"] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member, message_reaction, and message_reaction_count (default). If not specified, the previous setting will be used. Please note that this parameter doesn't affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time. |
| `--drop-pending-updates <value>` | Pass True to drop all pending updates. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api delete-webhook`

Use this method to remove webhook integration if you decide to switch back to getUpdates. Returns True on success. — destructive (deleteWebhook)

**Changes something in Telegram.**

```sh
tg bot api delete-webhook [options]
```

| Option | What it does |
|---|---|
| `--drop-pending-updates <value>` | Pass True to drop all pending updates. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-webhook-info`

Use this method to get current webhook status. Requires no parameters. On success, returns a WebhookInfo object. If the bot is using getUpdates, will return an object with the url field empty. — read (getWebhookInfo)

```sh
tg bot api get-webhook-info
```

#### `tg bot api get-me`

A simple method for testing your bot's authentication token. Requires no parameters. Returns basic information about the bot in form of a User object. — read (getMe)

```sh
tg bot api get-me
```

#### `tg bot api log-out`

Use this method to log out from the cloud Bot API server before launching the bot locally. You must log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns True on success. Requires no parameters. — destructive (logOut)

**Changes something in Telegram.**

```sh
tg bot api log-out
```

#### `tg bot api close`

Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn't launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns True on success. Requires no parameters. — destructive (close)

**Changes something in Telegram.**

```sh
tg bot api close
```

#### `tg bot api send-message`

Use this method to send text messages. On success, the sent Message is returned. — write (sendMessage)

**Changes something in Telegram.**

```sh
tg bot api send-message [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--ephemeral-message-parameters <value>` | A JSON-serialized object containing the parameters of the ephemeral message to send. |
| `--text <value>` | Text of the message to be sent, 1-4096 characters after entities parsing. |
| `--parse-mode <value>` | Mode for parsing entities in the message text. See formatting options for more details. |
| `--entities <value>` | A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode. |
| `--link-preview-options <value>` | Link preview generation options for the message. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api forward-message`

Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent Message is returned. — write (forwardMessage)

**Changes something in Telegram.**

```sh
tg bot api forward-message [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be forwarded; required if the message is forwarded to a direct messages chat. |
| `--from-chat-id <value>` | Unique identifier for the chat where the original message was sent (or username of the target bot, supergroup or channel in the format @username). |
| `--video-start-timestamp <value>` | New start timestamp for the forwarded video in the message. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the forwarded message from forwarding and saving. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; only available when forwarding to private chats. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. |
| `--message-id <value>` | Message identifier in the chat specified in from_chat_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api forward-messages`

Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an Array of MessageId of the sent messages is returned. — write (forwardMessages)

**Changes something in Telegram.**

```sh
tg bot api forward-messages [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the messages will be forwarded; required if the messages are forwarded to a direct messages chat. |
| `--from-chat-id <value>` | Unique identifier for the chat where the original messages were sent (or username of the target bot, supergroup or channel in the format @username). |
| `--message-ids <value>` | A JSON-serialized list of 1-100 identifiers of messages in the chat from_chat_id to forward. The identifiers must be specified in a strictly increasing order. |
| `--disable-notification <value>` | Sends the messages silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the forwarded messages from forwarding and saving. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api copy-message`

Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_ids is known to the bot. The method is analogous to the method forwardMessage, but the copied message doesn't have a link to the original message. Returns the MessageId of the sent message on success. — write (copyMessage)

**Changes something in Telegram.**

```sh
tg bot api copy-message [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--from-chat-id <value>` | Unique identifier for the chat where the original message was sent (or username of the target bot, supergroup or channel in the format @username). |
| `--message-id <value>` | Message identifier in the chat specified in from_chat_id. |
| `--video-start-timestamp <value>` | New start timestamp for the copied video in the message. |
| `--caption <value>` | New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept. |
| `--parse-mode <value>` | Mode for parsing entities in the new caption. See formatting options for more details. |
| `--caption-entities <value>` | A JSON-serialized list of special entities that appear in the new caption, which can be specified instead of parse_mode. |
| `--show-caption-above-media <value>` | Pass True if the caption must be shown above the message media. Ignored if a new caption isn't specified. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; only available when copying to private chats. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api copy-messages`

Use this method to copy messages of any kind. If some of the specified messages can't be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_ids is known to the bot. The method is analogous to the method forwardMessages, but the copied messages don't have a link to the original message. Album grouping is kept for copied messages. On success, an Array of MessageId of the sent messages is returned. — write (copyMessages)

**Changes something in Telegram.**

```sh
tg bot api copy-messages [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat. |
| `--from-chat-id <value>` | Unique identifier for the chat where the original messages were sent (or username of the target bot, supergroup or channel in the format @username). |
| `--message-ids <value>` | A JSON-serialized list of 1-100 identifiers of messages in the chat from_chat_id to copy. The identifiers must be specified in a strictly increasing order. |
| `--disable-notification <value>` | Sends the messages silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent messages from forwarding and saving. |
| `--remove-caption <value>` | Pass True to copy the messages without their captions. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-photo`

Use this method to send photos. On success, the sent Message is returned. — write (sendPhoto)

**Changes something in Telegram.**

```sh
tg bot api send-photo [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--ephemeral-message-parameters <value>` | A JSON-serialized object containing the parameters of the ephemeral message to send. |
| `--photo <value>` | Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. |
| `--caption <value>` | Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing. |
| `--parse-mode <value>` | Mode for parsing entities in the photo caption. See formatting options for more details. |
| `--caption-entities <value>` | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode. |
| `--show-caption-above-media <value>` | Pass True if the caption must be shown above the message media. |
| `--has-spoiler <value>` | Pass True if the photo needs to be covered with a spoiler animation. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-live-photo`

Use this method to send live photos. On success, the sent Message is returned. — write (sendLivePhoto)

**Changes something in Telegram.**

```sh
tg bot api send-live-photo [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel (in the format @channelusername). |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--ephemeral-message-parameters <value>` | A JSON-serialized object containing the parameters of the ephemeral message to send. |
| `--live-photo <value>` | Live photo video to send. The video must be no longer than 10 seconds and must not exceed 10 MB in size. Pass a file_id as String to send a video that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending live photos by a URL is currently unsupported. |
| `--photo <value>` | The static photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending live photos by a URL is currently unsupported. |
| `--caption <value>` | Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing. |
| `--parse-mode <value>` | Mode for parsing entities in the video caption. See formatting options for more details. |
| `--caption-entities <value>` | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode. |
| `--show-caption-above-media <value>` | Pass True if the caption must be shown above the message media. |
| `--has-spoiler <value>` | Pass True if the video needs to be covered with a spoiler animation. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-audio`

Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future. — write (sendAudio)

**Changes something in Telegram.**

```sh
tg bot api send-audio [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--ephemeral-message-parameters <value>` | A JSON-serialized object containing the parameters of the ephemeral message to send. |
| `--audio <value>` | Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. |
| `--caption <value>` | Audio caption, 0-1024 characters after entities parsing. |
| `--parse-mode <value>` | Mode for parsing entities in the audio caption. See formatting options for more details. |
| `--caption-entities <value>` | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode. |
| `--duration <value>` | Duration of the audio in seconds. |
| `--performer <value>` | Performer. |
| `--title <value>` | Track name. |
| `--thumbnail <value>` | Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-document`

Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future. — write (sendDocument)

**Changes something in Telegram.**

```sh
tg bot api send-document [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--ephemeral-message-parameters <value>` | A JSON-serialized object containing the parameters of the ephemeral message to send. |
| `--document <value>` | File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. |
| `--thumbnail <value>` | Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. |
| `--caption <value>` | Document caption (may also be used when resending documents by file_id), 0-1024 characters after entities parsing. |
| `--parse-mode <value>` | Mode for parsing entities in the document caption. See formatting options for more details. |
| `--caption-entities <value>` | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode. |
| `--disable-content-type-detection <value>` | Disables automatic server-side content type detection for files uploaded using multipart/form-data. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-video`

Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future. — write (sendVideo)

**Changes something in Telegram.**

```sh
tg bot api send-video [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--ephemeral-message-parameters <value>` | A JSON-serialized object containing the parameters of the ephemeral message to send. |
| `--video <value>` | Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. |
| `--duration <value>` | Duration of sent video in seconds. |
| `--width <value>` | Video width. |
| `--height <value>` | Video height. |
| `--thumbnail <value>` | Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. |
| `--cover <value>` | Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. |
| `--start-timestamp <value>` | Start timestamp for the video in the message. |
| `--caption <value>` | Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing. |
| `--parse-mode <value>` | Mode for parsing entities in the video caption. See formatting options for more details. |
| `--caption-entities <value>` | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode. |
| `--show-caption-above-media <value>` | Pass True if the caption must be shown above the message media. |
| `--has-spoiler <value>` | Pass True if the video needs to be covered with a spoiler animation. |
| `--supports-streaming <value>` | Pass True if the uploaded video is suitable for streaming. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-animation`

Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future. — write (sendAnimation)

**Changes something in Telegram.**

```sh
tg bot api send-animation [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--ephemeral-message-parameters <value>` | A JSON-serialized object containing the parameters of the ephemeral message to send. |
| `--animation <value>` | Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. |
| `--duration <value>` | Duration of sent animation in seconds. |
| `--width <value>` | Animation width. |
| `--height <value>` | Animation height. |
| `--thumbnail <value>` | Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. |
| `--caption <value>` | Animation caption (may also be used when resending animation by file_id), 0-1024 characters after entities parsing. |
| `--parse-mode <value>` | Mode for parsing entities in the animation caption. See formatting options for more details. |
| `--caption-entities <value>` | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode. |
| `--show-caption-above-media <value>` | Pass True if the caption must be shown above the message media. |
| `--has-spoiler <value>` | Pass True if the animation needs to be covered with a spoiler animation. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-voice`

Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS, or in .MP3 format, or in .M4A format (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future. — write (sendVoice)

**Changes something in Telegram.**

```sh
tg bot api send-voice [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--ephemeral-message-parameters <value>` | A JSON-serialized object containing the parameters of the ephemeral message to send. |
| `--voice <value>` | Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. |
| `--caption <value>` | Voice message caption, 0-1024 characters after entities parsing. |
| `--parse-mode <value>` | Mode for parsing entities in the voice message caption. See formatting options for more details. |
| `--caption-entities <value>` | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode. |
| `--duration <value>` | Duration of the voice message in seconds. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-video-note`

Use this method to send a rounded square MPEG4 video of up to 1 minute long. On success, the sent Message is returned. — write (sendVideoNote)

**Changes something in Telegram.**

```sh
tg bot api send-video-note [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--ephemeral-message-parameters <value>` | A JSON-serialized object containing the parameters of the ephemeral message to send. |
| `--video-note <value>` | Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending video notes by a URL is currently unsupported. |
| `--duration <value>` | Duration of sent video in seconds. |
| `--length <value>` | Video width and height, i.e. diameter of the video message. |
| `--thumbnail <value>` | Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-paid-media`

Use this method to send paid media. On success, the sent Message is returned. — write (sendPaidMedia)

**Changes something in Telegram.**

```sh
tg bot api send-paid-media [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. If the chat is a channel, all Telegram Star proceeds from this media will be credited to the chat's balance. Otherwise, they will be credited to the bot's balance. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--star-count <value>` | The number of Telegram Stars that must be paid to buy access to the media; 1-25000. |
| `--media <value>` | A JSON-serialized Array describing the media to be sent; up to 10 items. |
| `--payload <value>` | Bot-defined paid media payload, 0-128 bytes. This will not be displayed to the user, use it for your internal processes. |
| `--caption <value>` | Media caption, 0-1024 characters after entities parsing. |
| `--parse-mode <value>` | Mode for parsing entities in the media caption. See formatting options for more details. |
| `--caption-entities <value>` | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode. |
| `--show-caption-above-media <value>` | Pass True if the caption must be shown above the message media. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-media-group`

Use this method to send a group of photos, live photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an Array of Message objects that were sent is returned. — write (sendMediaGroup)

**Changes something in Telegram.**

```sh
tg bot api send-media-group [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat. |
| `--media <value>` | A JSON-serialized Array describing messages to be sent, must include 2-10 items. |
| `--disable-notification <value>` | Sends messages silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent messages from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-location`

Use this method to send point on the map. On success, the sent Message is returned. — write (sendLocation)

**Changes something in Telegram.**

```sh
tg bot api send-location [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--ephemeral-message-parameters <value>` | A JSON-serialized object containing the parameters of the ephemeral message to send. |
| `--latitude <value>` | Latitude of the location. |
| `--longitude <value>` | Longitude of the location. |
| `--horizontal-accuracy <value>` | The radius of uncertainty for the location, measured in meters; 0-1500. |
| `--live-period <value>` | Period in seconds during which the location will be updated (see Live Locations), must be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely. Must be 0 for ephemeral messages. |
| `--heading <value>` | For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. |
| `--proximity-alert-radius <value>` | For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-venue`

Use this method to send information about a venue. On success, the sent Message is returned. — write (sendVenue)

**Changes something in Telegram.**

```sh
tg bot api send-venue [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--ephemeral-message-parameters <value>` | A JSON-serialized object containing the parameters of the ephemeral message to send. |
| `--latitude <value>` | Latitude of the venue. |
| `--longitude <value>` | Longitude of the venue. |
| `--title <value>` | Name of the venue. |
| `--address <value>` | Address of the venue. |
| `--foursquare-id <value>` | Foursquare identifier of the venue. |
| `--foursquare-type <value>` | Foursquare type of the venue, if known. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".). |
| `--google-place-id <value>` | Google Places identifier of the venue. |
| `--google-place-type <value>` | Google Places type of the venue. (See supported types.). |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-contact`

Use this method to send phone contacts. On success, the sent Message is returned. — write (sendContact)

**Changes something in Telegram.**

```sh
tg bot api send-contact [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--ephemeral-message-parameters <value>` | A JSON-serialized object containing the parameters of the ephemeral message to send. |
| `--phone-number <value>` | Contact's phone number. |
| `--first-name <value>` | Contact's first name. |
| `--last-name <value>` | Contact's last name. |
| `--vcard <value>` | Additional data about the contact in the form of a vCard, 0-2048 bytes. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-poll`

Use this method to send a native poll. On success, the sent Message is returned. — write (sendPoll)

**Changes something in Telegram.**

```sh
tg bot api send-poll [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. Polls can't be sent to channel direct messages chats. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--question <value>` | Poll question, 1-300 characters. |
| `--question-parse-mode <value>` | Mode for parsing entities in the question. See formatting options for more details. Currently, only custom emoji entities are allowed. |
| `--question-entities <value>` | A JSON-serialized list of special entities that appear in the poll question. It can be specified instead of question_parse_mode. |
| `--options <value>` | A JSON-serialized list of 1-12 answer options. |
| `--is-anonymous <value>` | True, if the poll needs to be anonymous, defaults to True. |
| `--type <value>` | Poll type, "quiz" or "regular", defaults to "regular". |
| `--allows-multiple-answers <value>` | Pass True if the poll allows multiple answers, defaults to False. |
| `--allows-revoting <value>` | Pass True if the poll allows to change chosen answer options, defaults to False for quizzes and to True for regular polls. |
| `--shuffle-options <value>` | Pass True if the poll options must be shown in random order. |
| `--allow-adding-options <value>` | Pass True if answer options can be added to the poll after creation; not supported for anonymous polls and quizzes. |
| `--hide-results-until-closes <value>` | Pass True if poll results must be shown only after the poll closes. |
| `--members-only <value>` | Pass True if voting is limited to users who have been members of the chat where the poll is being sent for more than 24 hours; for channel chats only. |
| `--country-codes <value>` | A JSON-serialized list of 0-12 two-letter ISO 3166-1 alpha-2 country codes indicating the countries from which users can vote in the poll; for channel chats only. Use "FT" as a country code to allow users with anonymous numbers to vote. If omitted or empty, then users from any country can participate in the poll. |
| `--correct-option-ids <value>` | A JSON-serialized list of monotonically increasing 0-based identifiers of the correct answer options, required for polls in quiz mode. |
| `--explanation <value>` | Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing. |
| `--explanation-parse-mode <value>` | Mode for parsing entities in the explanation. See formatting options for more details. |
| `--explanation-entities <value>` | A JSON-serialized list of special entities that appear in the poll explanation. It can be specified instead of explanation_parse_mode. |
| `--explanation-media <value>` | Media added to the quiz explanation. |
| `--open-period <value>` | Amount of time in seconds the poll will be active after creation, 5-2628000. Can't be used together with close_date. |
| `--close-date <value>` | Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 2628000 seconds in the future. Can't be used together with open_period. |
| `--is-closed <value>` | Pass True if the poll needs to be immediately closed. This can be useful for poll preview. |
| `--description <value>` | Description of the poll to be sent, 0-1024 characters after entities parsing. |
| `--description-parse-mode <value>` | Mode for parsing entities in the poll description. See formatting options for more details. |
| `--description-entities <value>` | A JSON-serialized list of special entities that appear in the poll description, which can be specified instead of description_parse_mode. |
| `--media <value>` | Media added to the poll description. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-checklist`

Use this method to send a checklist on behalf of a connected business account. On success, the sent Message is returned. — write (sendChecklist)

**Changes something in Telegram.**

```sh
tg bot api send-checklist [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot in the format @username. |
| `--checklist <value>` | A JSON-serialized object for the checklist to send. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message. |
| `--reply-parameters <value>` | A JSON-serialized object for description of the message to reply to. |
| `--reply-markup <value>` | A JSON-serialized object for an inline keyboard. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-dice`

Use this method to send an animated emoji that will display a random value. On success, the sent Message is returned. — write (sendDice)

**Changes something in Telegram.**

```sh
tg bot api send-dice [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--emoji <value>` | Emoji on which the dice throw animation is based. Currently, must be one of "🎲", "🎯", "🏀", "⚽", "🎳", or "🎰". Dice can have values 1-6 for "🎲", "🎯" and "🎳", values 1-5 for "🏀" and "⚽", and values 1-64 for "🎰". Defaults to "🎲". |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-message-draft`

Use this method to stream a partial message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you must call sendMessage with the complete message to persist it in the user's chat. Returns True on success. — write (sendMessageDraft)

**Changes something in Telegram.**

```sh
tg bot api send-message-draft [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target private chat. |
| `--message-thread-id <value>` | Unique identifier for the target message thread. |
| `--draft-id <value>` | Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated. Otherwise, the draft is replaced without animation. |
| `--text <value>` | Text of the message to be sent, 0-4096 characters after entities parsing. Pass an empty text to show a "Thinking..." placeholder. |
| `--parse-mode <value>` | Mode for parsing entities in the message text. See formatting options for more details. |
| `--entities <value>` | A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode. |
| `--can-stop <value>` | Pass True to show the user a button to stop further drafts. The bot will receive an Update "stopped_message_generation" if the user presses the button. |
| `--keep-on-stop <value>` | Pass True to keep the draft in the chat when the button is pressed. The draft will still disappear after a short time or if the bot sends a message. To fully preserve the partial draft, the bot should send it as a new message. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-chat-action`

Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns True on success. — write (sendChatAction)

**Changes something in Telegram.**

```sh
tg bot api send-chat-action [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the action will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot or supergroup in the format @username. Channel chats and channel direct messages chats aren't supported. |
| `--message-thread-id <value>` | Unique identifier for the target message thread or topic of a forum; for supergroups and private chats of bots with forum topic mode enabled only. |
| `--action <value>` | Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_voice or upload_voice for voice notes, upload_document for general files, choose_sticker for stickers, find_location for location data, record_video_note or upload_video_note for video notes. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-message-reaction`

Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns True on success. — write (setMessageReaction)

**Changes something in Telegram.**

```sh
tg bot api set-message-reaction [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-id <value>` | Identifier of the target message. If the message belongs to a media group, the reaction is set to the first non-deleted message in the group instead. |
| `--reaction <value>` | A JSON-serialized list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators. Paid reactions can't be used by bots. |
| `--is-big <value>` | Pass True to set the reaction with a big animation. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-user-profile-photos`

Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object. — read (getUserProfilePhotos)

```sh
tg bot api get-user-profile-photos [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | Unique identifier of the target user. |
| `--offset <value>` | Sequential number of the first photo to be returned. By default, all photos are returned. |
| `--limit <value>` | Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-user-profile-audios`

Use this method to get a list of profile audios for a user. Returns a UserProfileAudios object. — read (getUserProfileAudios)

```sh
tg bot api get-user-profile-audios [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | Unique identifier of the target user. |
| `--offset <value>` | Sequential number of the first audio to be returned. By default, all audios are returned. |
| `--limit <value>` | Limits the number of audios to be retrieved. Values between 1-100 are accepted. Defaults to 100. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-user-emoji-status`

Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method requestEmojiStatusAccess. Returns True on success. — write (setUserEmojiStatus)

**Changes something in Telegram.**

```sh
tg bot api set-user-emoji-status [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | Unique identifier of the target user. |
| `--emoji-status-custom-emoji-id <value>` | Custom emoji identifier of the emoji status to set. Pass an empty string to remove the status. |
| `--emoji-status-expiration-date <value>` | Expiration date of the emoji status, if any. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-file`

Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>, where <file_path> is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again. — read (getFile)

```sh
tg bot api get-file [options]
```

| Option | What it does |
|---|---|
| `--file-id <value>` | File identifier to get information about. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api ban-chat-member`

Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success. — destructive (banChatMember)

**Changes something in Telegram.**

```sh
tg bot api ban-chat-member [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target group or username of the target supergroup or channel in the format @username. |
| `--user-id <value>` | Unique identifier of the target user. |
| `--until-date <value>` | Date when the user will be unbanned; Unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only. |
| `--revoke-messages <value>` | Pass True to delete all messages from the chat for the user that is being removed. If False, the user will be able to see messages in the group that were sent before the user was removed. Always True for supergroups and channels. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api unban-chat-member`

Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don't want this, use the parameter only_if_banned. Returns True on success. — destructive (unbanChatMember)

**Changes something in Telegram.**

```sh
tg bot api unban-chat-member [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target group or username of the target supergroup or channel in the format @username. |
| `--user-id <value>` | Unique identifier of the target user. |
| `--only-if-banned <value>` | Do nothing if the user is not banned. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api restrict-chat-member`

Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass True for all permissions to lift restrictions from a user. Returns True on success. — write (restrictChatMember)

**Changes something in Telegram.**

```sh
tg bot api restrict-chat-member [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--user-id <value>` | Unique identifier of the target user. |
| `--permissions <value>` | A JSON-serialized object for new user permissions. |
| `--use-independent-chat-permissions <value>` | Pass True if chat permissions are set independently. Otherwise, the can_send_other_messages and can_add_web_page_previews permissions will imply the can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, and can_send_voice_notes permissions; the can_send_polls permission will imply the can_send_messages permission. |
| `--until-date <value>` | Date when restrictions will be lifted for the user; Unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api promote-chat-member`

Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass False for all boolean parameters to demote a user. Returns True on success. — write (promoteChatMember)

**Changes something in Telegram.**

```sh
tg bot api promote-chat-member [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel in the format @username. |
| `--user-id <value>` | Unique identifier of the target user. |
| `--is-anonymous <value>` | Pass True if the administrator's presence in the chat is hidden. |
| `--can-manage-chat <value>` | Pass True if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege. |
| `--can-delete-messages <value>` | Pass True if the administrator can delete messages of other users. |
| `--can-manage-video-chats <value>` | Pass True if the administrator can manage video chats. |
| `--can-restrict-members <value>` | Pass True if the administrator can restrict, ban or unban chat members, or access supergroup statistics. For backward compatibility, defaults to True for promotions of channel administrators. |
| `--can-promote-members <value>` | Pass True if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by him). |
| `--can-change-info <value>` | Pass True if the administrator can change chat title, photo and other settings. |
| `--can-invite-users <value>` | Pass True if the administrator can invite new users to the chat. |
| `--can-post-stories <value>` | Pass True if the administrator can post stories to the chat. |
| `--can-edit-stories <value>` | Pass True if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive. |
| `--can-delete-stories <value>` | Pass True if the administrator can delete stories posted by other users. |
| `--can-post-messages <value>` | Pass True if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only. |
| `--can-edit-messages <value>` | Pass True if the administrator can edit messages of other users and can pin messages; for channels only. |
| `--can-pin-messages <value>` | Pass True if the administrator can pin messages; for supergroups only. |
| `--can-manage-topics <value>` | Pass True if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only. |
| `--can-manage-direct-messages <value>` | Pass True if the administrator can manage direct messages within the channel and decline suggested posts; for channels only. |
| `--can-manage-tags <value>` | Pass True if the administrator can edit the tags of regular members; for groups and supergroups only. |
| `--can-send-welcome-messages <value>` | Pass True if the administrator can manage chat welcome messages or directly send them in the case of bots. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-chat-administrator-custom-title`

Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns True on success. — write (setChatAdministratorCustomTitle)

**Changes something in Telegram.**

```sh
tg bot api set-chat-administrator-custom-title [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--user-id <value>` | Unique identifier of the target user. |
| `--custom-title <value>` | New custom title for the administrator; 0-16 characters, emoji are not allowed. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-chat-member-tag`

Use this method to set a tag for a regular member in a group or a supergroup. The bot must be an administrator in the chat for this to work and must have the can_manage_tags administrator right. Returns True on success. — write (setChatMemberTag)

**Changes something in Telegram.**

```sh
tg bot api set-chat-member-tag [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--user-id <value>` | Unique identifier of the target user. |
| `--tag <value>` | New tag for the member; 0-16 characters, emoji are not allowed. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api ban-chat-sender-chat`

Use this method to ban a channel chat in a supergroup or a channel. Until the chat is unbanned, the owner of the banned chat won't be able to send messages on behalf of any of their channels. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns True on success. — destructive (banChatSenderChat)

**Changes something in Telegram.**

```sh
tg bot api ban-chat-sender-chat [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel in the format @username. |
| `--sender-chat-id <value>` | Unique identifier of the target sender chat. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api unban-chat-sender-chat`

Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns True on success. — write (unbanChatSenderChat)

**Changes something in Telegram.**

```sh
tg bot api unban-chat-sender-chat [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel in the format @username. |
| `--sender-chat-id <value>` | Unique identifier of the target sender chat. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-chat-permissions`

Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members administrator rights. Returns True on success. — write (setChatPermissions)

**Changes something in Telegram.**

```sh
tg bot api set-chat-permissions [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--permissions <value>` | A JSON-serialized object for new default chat permissions. |
| `--use-independent-chat-permissions <value>` | Pass True if chat permissions are set independently. Otherwise, the can_send_other_messages and can_add_web_page_previews permissions will imply the can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, and can_send_voice_notes permissions; the can_send_polls permission will imply the can_send_messages permission. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api export-chat-invite-link`

Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as String on success. — destructive (exportChatInviteLink)

**Changes something in Telegram.**

```sh
tg bot api export-chat-invite-link [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel in the format @username. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api create-chat-invite-link`

Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method revokeChatInviteLink. Returns the new invite link as ChatInviteLink object. — write (createChatInviteLink)

**Changes something in Telegram.**

```sh
tg bot api create-chat-invite-link [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel in the format @username. |
| `--name <value>` | Invite link name; 0-32 characters. |
| `--expire-date <value>` | Point in time (Unix timestamp) when the link will expire. |
| `--member-limit <value>` | The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999. |
| `--creates-join-request <value>` | True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api edit-chat-invite-link`

Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a ChatInviteLink object. — write (editChatInviteLink)

**Changes something in Telegram.**

```sh
tg bot api edit-chat-invite-link [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel in the format @username. |
| `--invite-link <value>` | The invite link to edit. |
| `--name <value>` | Invite link name; 0-32 characters. |
| `--expire-date <value>` | Point in time (Unix timestamp) when the link will expire. |
| `--member-limit <value>` | The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999. |
| `--creates-join-request <value>` | True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api create-chat-subscription-invite-link`

Use this method to create a subscription invite link for a channel chat. The bot must have the can_invite_users administrator rights. The link can be edited using the method editChatSubscriptionInviteLink or revoked using the method revokeChatInviteLink. Returns the new invite link as a ChatInviteLink object. — write (createChatSubscriptionInviteLink)

**Changes something in Telegram.**

```sh
tg bot api create-chat-subscription-invite-link [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target channel chat or username of the target channel in the format @username. |
| `--name <value>` | Invite link name; 0-32 characters. |
| `--subscription-period <value>` | The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days). |
| `--subscription-price <value>` | The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-10000. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api edit-chat-subscription-invite-link`

Use this method to edit a subscription invite link created by the bot. The bot must have the can_invite_users administrator rights. Returns the edited invite link as a ChatInviteLink object. — write (editChatSubscriptionInviteLink)

**Changes something in Telegram.**

```sh
tg bot api edit-chat-subscription-invite-link [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel in the format @username. |
| `--invite-link <value>` | The invite link to edit. |
| `--name <value>` | Invite link name; 0-32 characters. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api revoke-chat-invite-link`

Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as ChatInviteLink object. — destructive (revokeChatInviteLink)

**Changes something in Telegram.**

```sh
tg bot api revoke-chat-invite-link [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier of the target chat or username of the target channel in the format @username. |
| `--invite-link <value>` | The invite link to revoke. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api approve-chat-join-request`

Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success. — write (approveChatJoinRequest)

**Changes something in Telegram.**

```sh
tg bot api approve-chat-join-request [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel in the format @username. |
| `--user-id <value>` | Unique identifier of the target user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api decline-chat-join-request`

Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success. — destructive (declineChatJoinRequest)

**Changes something in Telegram.**

```sh
tg bot api decline-chat-join-request [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel in the format @username. |
| `--user-id <value>` | Unique identifier of the target user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api answer-chat-join-request-query`

Use this method to process a received chat join request query. Returns True on success. — write (answerChatJoinRequestQuery)

**Changes something in Telegram.**

```sh
tg bot api answer-chat-join-request-query [options]
```

| Option | What it does |
|---|---|
| `--chat-join-request-query-id <value>` | Unique identifier of the join request query. |
| `--result <value>` | Result of the query. Must be either "approve" to allow the user to join the chat, "decline" to disallow the user to join the chat, or "queue" to leave the decision to other administrators. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-chat-join-request-web-app`

Use this method to process a received chat join request query by showing a Mini App to the user before deciding the outcome. Call answerChatJoinRequestQuery to resolve the join request query based on the user interaction with the Mini App. Returns True on success. — write (sendChatJoinRequestWebApp)

**Changes something in Telegram.**

```sh
tg bot api send-chat-join-request-web-app [options]
```

| Option | What it does |
|---|---|
| `--chat-join-request-query-id <value>` | Unique identifier of the join request query. |
| `--web-app-url <value>` | An HTTPS URL of a Web App to be opened with additional data as specified in Initializing Web Apps. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-chat-photo`

Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success. — write (setChatPhoto)

**Changes something in Telegram.**

```sh
tg bot api set-chat-photo [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel in the format @username. |
| `--photo <value>` | New chat photo, uploaded using multipart/form-data. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api delete-chat-photo`

Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success. — destructive (deleteChatPhoto)

**Changes something in Telegram.**

```sh
tg bot api delete-chat-photo [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel in the format @username. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-chat-title`

Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success. — write (setChatTitle)

**Changes something in Telegram.**

```sh
tg bot api set-chat-title [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel in the format @username. |
| `--title <value>` | New chat title, 1-128 characters. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-chat-description`

Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success. — write (setChatDescription)

**Changes something in Telegram.**

```sh
tg bot api set-chat-description [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel in the format @username. |
| `--description <value>` | New chat description, 0-255 characters. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api pin-chat-message`

Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to pin messages in groups and channels respectively. Returns True on success. — write (pinChatMessage)

**Changes something in Telegram.**

```sh
tg bot api pin-chat-message [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be pinned. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel in the format @username. |
| `--message-id <value>` | Identifier of a message to pin. |
| `--disable-notification <value>` | Pass True if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api unpin-chat-message`

Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin messages in groups and channels respectively. Returns True on success. — write (unpinChatMessage)

**Changes something in Telegram.**

```sh
tg bot api unpin-chat-message [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be unpinned. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel in the format @username. |
| `--message-id <value>` | Identifier of the message to unpin. Required if business_connection_id is specified. If not specified, the most recent pinned message (by sending date) will be unpinned. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api unpin-all-chat-messages`

Use this method to clear the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin all pinned messages in groups and channels respectively. Returns True on success. — destructive (unpinAllChatMessages)

**Changes something in Telegram.**

```sh
tg bot api unpin-all-chat-messages [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel in the format @username. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api leave-chat`

Use this method for your bot to leave a group, supergroup or channel. Returns True on success. — destructive (leaveChat)

**Changes something in Telegram.**

```sh
tg bot api leave-chat [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup or channel in the format @username. Channel direct messages chats aren't supported; leave the corresponding channel instead. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-chat`

Use this method to get up-to-date information about the chat. Returns a ChatFullInfo object on success. — read (getChat)

```sh
tg bot api get-chat [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup or channel in the format @username. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-chat-administrators`

Use this method to get a list of administrators in a chat. Returns an Array of ChatMember objects. — read (getChatAdministrators)

```sh
tg bot api get-chat-administrators [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup or channel in the format @username. |
| `--return-bots <value>` | Pass True to additionally receive all bots that are administrators of the chat. By default, bots other than the current bot are omitted. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-chat-member-count`

Use this method to get the number of members in a chat. Returns Integer on success. — read (getChatMemberCount)

```sh
tg bot api get-chat-member-count [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup or channel in the format @username. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-chat-member`

Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a ChatMember object on success. — read (getChatMember)

```sh
tg bot api get-chat-member [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup or channel in the format @username. |
| `--user-id <value>` | Unique identifier of the target user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-user-personal-chat-messages`

Use this method to get the last messages from the personal chat (i.e., the chat currently added to their profile) of a given user. On success, an Array of Message objects is returned. — read (getUserPersonalChatMessages)

```sh
tg bot api get-user-personal-chat-messages [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | Unique identifier for the target user. |
| `--limit <value>` | The maximum number of messages to return; 1-20. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-chat-sticker-set`

Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success. — write (setChatStickerSet)

**Changes something in Telegram.**

```sh
tg bot api set-chat-sticker-set [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--sticker-set-name <value>` | Name of the sticker set to be set as the group sticker set. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api delete-chat-sticker-set`

Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success. — destructive (deleteChatStickerSet)

**Changes something in Telegram.**

```sh
tg bot api delete-chat-sticker-set [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-forum-topic-icon-stickers`

Use this method to get custom emoji stickers, which can be used as a forum topic icon by any user. Requires no parameters. Returns an Array of Sticker objects. — read (getForumTopicIconStickers)

```sh
tg bot api get-forum-topic-icon-stickers
```

#### `tg bot api create-forum-topic`

Use this method to create a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator right. Returns information about the created topic as a ForumTopic object. — write (createForumTopic)

**Changes something in Telegram.**

```sh
tg bot api create-forum-topic [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--name <value>` | Topic name, 1-128 characters. |
| `--icon-color <value>` | Color of the topic icon in RGB format. Currently, must be one of 7322096 (0x6FB9F0), 16766590 (0xFFD67E), 13338331 (0xCB86DB), 9367192 (0x8EEE98), 16749490 (0xFF93B2), or 16478047 (0xFB6F5F). |
| `--icon-custom-emoji-id <value>` | Unique identifier of the custom emoji shown as the topic icon. Use getForumTopicIconStickers to get all allowed custom emoji identifiers. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api edit-forum-topic`

Use this method to edit name and icon of a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success. — write (editForumTopic)

**Changes something in Telegram.**

```sh
tg bot api edit-forum-topic [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread of the forum topic. |
| `--name <value>` | New topic name, 0-128 characters. If not specified or empty, the current name of the topic will be kept. |
| `--icon-custom-emoji-id <value>` | New unique identifier of the custom emoji shown as the topic icon. Use getForumTopicIconStickers to get all allowed custom emoji identifiers. Pass an empty string to remove the icon. If not specified, the current icon will be kept. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api close-forum-topic`

Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success. — write (closeForumTopic)

**Changes something in Telegram.**

```sh
tg bot api close-forum-topic [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread of the forum topic. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api reopen-forum-topic`

Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success. — write (reopenForumTopic)

**Changes something in Telegram.**

```sh
tg bot api reopen-forum-topic [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread of the forum topic. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api delete-forum-topic`

Use this method to delete a forum topic along with all its messages in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_delete_messages administrator rights. Returns True on success. — destructive (deleteForumTopic)

**Changes something in Telegram.**

```sh
tg bot api delete-forum-topic [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread of the forum topic. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api unpin-all-forum-topic-messages`

Use this method to clear the list of pinned messages in a forum topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success. — destructive (unpinAllForumTopicMessages)

**Changes something in Telegram.**

```sh
tg bot api unpin-all-forum-topic-messages [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread of the forum topic. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api edit-general-forum-topic`

Use this method to edit the name of the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success. — write (editGeneralForumTopic)

**Changes something in Telegram.**

```sh
tg bot api edit-general-forum-topic [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--name <value>` | New topic name, 1-128 characters. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api close-general-forum-topic`

Use this method to close an open 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success. — write (closeGeneralForumTopic)

**Changes something in Telegram.**

```sh
tg bot api close-general-forum-topic [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api reopen-general-forum-topic`

Use this method to reopen a closed 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically unhidden if it was hidden. Returns True on success. — write (reopenGeneralForumTopic)

**Changes something in Telegram.**

```sh
tg bot api reopen-general-forum-topic [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api hide-general-forum-topic`

Use this method to hide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically closed if it was open. Returns True on success. — write (hideGeneralForumTopic)

**Changes something in Telegram.**

```sh
tg bot api hide-general-forum-topic [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api unhide-general-forum-topic`

Use this method to unhide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success. — write (unhideGeneralForumTopic)

**Changes something in Telegram.**

```sh
tg bot api unhide-general-forum-topic [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api unpin-all-general-forum-topic-messages`

Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success. — destructive (unpinAllGeneralForumTopicMessages)

**Changes something in Telegram.**

```sh
tg bot api unpin-all-general-forum-topic-messages [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api answer-callback-query`

Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned. — write (answerCallbackQuery)

**Changes something in Telegram.**

```sh
tg bot api answer-callback-query [options]
```

| Option | What it does |
|---|---|
| `--callback-query-id <value>` | Unique identifier for the query to be answered. |
| `--text <value>` | Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters. |
| `--show-alert <value>` | If True, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to False. |
| `--url <value>` | URL that will be opened by the user's client. If you have created a Game and accepted the conditions via @BotFather, specify the URL that opens your game - note that this will only work if the query comes from a callback_game button. Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter. |
| `--cache-time <value>` | The maximum amount of time in seconds that the result of the callback query may be cached client-side. Defaults to 0. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api answer-guest-query`

Use this method to reply to a received guest message. On success, a SentGuestMessage object is returned. — write (answerGuestQuery)

**Changes something in Telegram.**

```sh
tg bot api answer-guest-query [options]
```

| Option | What it does |
|---|---|
| `--guest-query-id <value>` | Unique identifier for the query to be answered. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-user-chat-boosts`

Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a UserChatBoosts object. — read (getUserChatBoosts)

```sh
tg bot api get-user-chat-boosts [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the chat or username of the channel in the format @username. |
| `--user-id <value>` | Unique identifier of the target user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-business-connection`

Use this method to get information about the connection of the bot with a business account. Returns a BusinessConnection object on success. — read (getBusinessConnection)

```sh
tg bot api get-business-connection [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-managed-bot-token`

Use this method to get the token of a managed bot. Returns the token as String on success. — read (getManagedBotToken)

```sh
tg bot api get-managed-bot-token [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | User identifier of the managed bot whose token will be returned. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api replace-managed-bot-token`

Use this method to revoke the current token of a managed bot and generate a new one. Returns the new token as String on success. — destructive (replaceManagedBotToken)

**Changes something in Telegram.**

```sh
tg bot api replace-managed-bot-token [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | User identifier of the managed bot whose token will be replaced. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-managed-bot-access-settings`

Use this method to get the access settings of a managed bot. Returns a BotAccessSettings object on success. — read (getManagedBotAccessSettings)

```sh
tg bot api get-managed-bot-access-settings [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | User identifier of the managed bot whose access settings will be returned. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-managed-bot-access-settings`

Use this method to change the access settings of a managed bot. Returns True on success. — write (setManagedBotAccessSettings)

**Changes something in Telegram.**

```sh
tg bot api set-managed-bot-access-settings [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | User identifier of the managed bot whose access settings will be changed. |
| `--is-access-restricted <value>` | Pass True if only selected users can access the bot. The bot's owner can always access it. |
| `--added-user-ids <value>` | A JSON-serialized list of up to 10 identifiers of users who will have access to the bot in addition to its owner. Ignored if is_access_restricted is False. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-my-commands`

Use this method to change the list of the bot's commands. See this manual for more details about bot commands. Returns True on success. — write (setMyCommands)

**Changes something in Telegram.**

```sh
tg bot api set-my-commands [options]
```

| Option | What it does |
|---|---|
| `--commands <value>` | A JSON-serialized list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified. |
| `--scope <value>` | A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault. |
| `--language-code <value>` | A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api delete-my-commands`

Use this method to delete the list of the bot's commands for the given scope and user language. After deletion, higher level commands will be shown to affected users. Returns True on success. — destructive (deleteMyCommands)

**Changes something in Telegram.**

```sh
tg bot api delete-my-commands [options]
```

| Option | What it does |
|---|---|
| `--scope <value>` | A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault. |
| `--language-code <value>` | A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-my-commands`

Use this method to get the current list of the bot's commands for the given scope and user language. Returns an Array of BotCommand objects. If commands aren't set, an empty list is returned. — read (getMyCommands)

```sh
tg bot api get-my-commands [options]
```

| Option | What it does |
|---|---|
| `--scope <value>` | A JSON-serialized object, describing scope of users. Defaults to BotCommandScopeDefault. |
| `--language-code <value>` | A two-letter ISO 639-1 language code or an empty string. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-my-name`

Use this method to change the bot's name. Returns True on success. — write (setMyName)

**Changes something in Telegram.**

```sh
tg bot api set-my-name [options]
```

| Option | What it does |
|---|---|
| `--name <value>` | New bot name; 0-64 characters. Pass an empty string to remove the dedicated name for the given language. |
| `--language-code <value>` | A two-letter ISO 639-1 language code. If empty, the name will be shown to all users for whose language there is no dedicated name. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-my-name`

Use this method to get the current bot name for the given user language. Returns BotName on success. — read (getMyName)

```sh
tg bot api get-my-name [options]
```

| Option | What it does |
|---|---|
| `--language-code <value>` | A two-letter ISO 639-1 language code or an empty string. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-my-description`

Use this method to change the bot's description, which is shown in the chat with the bot if the chat is empty. Returns True on success. — write (setMyDescription)

**Changes something in Telegram.**

```sh
tg bot api set-my-description [options]
```

| Option | What it does |
|---|---|
| `--description <value>` | New bot description; 0-512 characters. Pass an empty string to remove the dedicated description for the given language. |
| `--language-code <value>` | A two-letter ISO 639-1 language code. If empty, the description will be applied to all users for whose language there is no dedicated description. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-my-description`

Use this method to get the current bot description for the given user language. Returns BotDescription on success. — read (getMyDescription)

```sh
tg bot api get-my-description [options]
```

| Option | What it does |
|---|---|
| `--language-code <value>` | A two-letter ISO 639-1 language code or an empty string. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-my-short-description`

Use this method to change the bot's short description, which is shown on the bot's profile page and is sent together with the link when users share the bot. Returns True on success. — write (setMyShortDescription)

**Changes something in Telegram.**

```sh
tg bot api set-my-short-description [options]
```

| Option | What it does |
|---|---|
| `--short-description <value>` | New short description for the bot; 0-120 characters. Pass an empty string to remove the dedicated short description for the given language. |
| `--language-code <value>` | A two-letter ISO 639-1 language code. If empty, the short description will be applied to all users for whose language there is no dedicated short description. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-my-short-description`

Use this method to get the current bot short description for the given user language. Returns BotShortDescription on success. — read (getMyShortDescription)

```sh
tg bot api get-my-short-description [options]
```

| Option | What it does |
|---|---|
| `--language-code <value>` | A two-letter ISO 639-1 language code or an empty string. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-my-profile-photo`

Changes the profile photo of the bot. Returns True on success. — write (setMyProfilePhoto)

**Changes something in Telegram.**

```sh
tg bot api set-my-profile-photo [options]
```

| Option | What it does |
|---|---|
| `--photo <value>` | The new profile photo to set. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api remove-my-profile-photo`

Removes the profile photo of the bot. Requires no parameters. Returns True on success. — destructive (removeMyProfilePhoto)

**Changes something in Telegram.**

```sh
tg bot api remove-my-profile-photo
```

#### `tg bot api set-chat-menu-button`

Use this method to change the bot's menu button in a private chat, or the default menu button. Returns True on success. — write (setChatMenuButton)

**Changes something in Telegram.**

```sh
tg bot api set-chat-menu-button [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target private chat. If not specified, the bot's default menu button will be changed. |
| `--menu-button <value>` | A JSON-serialized object for the bot's new menu button. Defaults to MenuButtonDefault. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-chat-menu-button`

Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. Returns MenuButton on success. — read (getChatMenuButton)

```sh
tg bot api get-chat-menu-button [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target private chat. If not specified, the bot's default menu button will be returned. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-my-default-administrator-rights`

Use this method to change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are free to modify the list before adding the bot. Returns True on success. — write (setMyDefaultAdministratorRights)

**Changes something in Telegram.**

```sh
tg bot api set-my-default-administrator-rights [options]
```

| Option | What it does |
|---|---|
| `--rights <value>` | A JSON-serialized object describing new default administrator rights. If not specified, the default administrator rights will be cleared. |
| `--for-channels <value>` | Pass True to change the default administrator rights of the bot in channels. Otherwise, the default administrator rights of the bot for groups and supergroups will be changed. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-my-default-administrator-rights`

Use this method to get the current default administrator rights of the bot. Returns ChatAdministratorRights on success. — read (getMyDefaultAdministratorRights)

```sh
tg bot api get-my-default-administrator-rights [options]
```

| Option | What it does |
|---|---|
| `--for-channels <value>` | Pass True to get default administrator rights of the bot in channels. Otherwise, default administrator rights of the bot for groups and supergroups will be returned. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-available-gifts`

Returns the list of gifts that can be sent by the bot to users and channel chats. Requires no parameters. Returns a Gifts object. — read (getAvailableGifts)

```sh
tg bot api get-available-gifts
```

#### `tg bot api send-gift`

Sends a gift to the given user or channel chat. The gift can't be converted to Telegram Stars by the receiver. Returns True on success. — destructive (sendGift)

**Changes something in Telegram.**

```sh
tg bot api send-gift [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | Required if chat_id is not specified. Unique identifier of the target user who will receive the gift. |
| `--chat-id <value>` | Required if user_id is not specified. Unique identifier for the chat or username of the channel (in the format @username) that will receive the gift. |
| `--gift-id <value>` | Identifier of the gift; limited gifts can't be sent to channel chats. |
| `--pay-for-upgrade <value>` | Pass True to pay for the gift upgrade from the bot's balance, thereby making the upgrade free for the receiver. |
| `--text <value>` | Text that will be shown along with the gift; 0-128 characters. |
| `--text-parse-mode <value>` | Mode for parsing entities in the text. See formatting options for more details. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored. |
| `--text-entities <value>` | A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of text_parse_mode. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api gift-premium-subscription`

Gifts a Telegram Premium subscription to the given user. Returns True on success. — destructive (giftPremiumSubscription)

**Changes something in Telegram.**

```sh
tg bot api gift-premium-subscription [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | Unique identifier of the target user who will receive a Telegram Premium subscription. |
| `--month-count <value>` | Number of months the Telegram Premium subscription will be active for the user; must be one of 3, 6, or 12. |
| `--star-count <value>` | Number of Telegram Stars to pay for the Telegram Premium subscription; must be 1000 for 3 months, 1500 for 6 months, and 2500 for 12 months. |
| `--text <value>` | Text that will be shown along with the service message about the subscription; 0-128 characters. |
| `--text-parse-mode <value>` | Mode for parsing entities in the text. See formatting options for more details. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored. |
| `--text-entities <value>` | A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of text_parse_mode. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api verify-user`

Verifies a user on behalf of the organization which is represented by the bot. Returns True on success. — write (verifyUser)

**Changes something in Telegram.**

```sh
tg bot api verify-user [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | Unique identifier of the target user. |
| `--custom-description <value>` | Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api verify-chat`

Verifies a chat on behalf of the organization which is represented by the bot. Returns True on success. — write (verifyChat)

**Changes something in Telegram.**

```sh
tg bot api verify-chat [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. Channel direct messages chats can't be verified. |
| `--custom-description <value>` | Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api remove-user-verification`

Removes verification from a user who is currently verified on behalf of the organization represented by the bot. Returns True on success. — destructive (removeUserVerification)

**Changes something in Telegram.**

```sh
tg bot api remove-user-verification [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | Unique identifier of the target user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api remove-chat-verification`

Removes verification from a chat that is currently verified on behalf of the organization represented by the bot. Returns True on success. — destructive (removeChatVerification)

**Changes something in Telegram.**

```sh
tg bot api remove-chat-verification [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot or channel in the format @username. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api read-business-message`

Marks incoming message as read on behalf of a business account. Requires the can_read_messages business bot right. Returns True on success. — write (readBusinessMessage)

**Changes something in Telegram.**

```sh
tg bot api read-business-message [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which to read the message. |
| `--chat-id <value>` | Unique identifier of the chat in which the message was received. The chat must have been active in the last 24 hours. |
| `--message-id <value>` | Unique identifier of the message to mark as read. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api delete-business-messages`

Delete messages on behalf of a business account. Requires the can_delete_sent_messages business bot right to delete messages sent by the bot itself, or the can_delete_all_messages business bot right to delete any message. Returns True on success. — destructive (deleteBusinessMessages)

**Changes something in Telegram.**

```sh
tg bot api delete-business-messages [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which to delete the messages. |
| `--message-ids <value>` | A JSON-serialized list of 1-100 identifiers of messages to delete. All messages must be from the same chat. See deleteMessage for limitations on which messages can be deleted. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-business-account-name`

Changes the first and last name of a managed business account. Requires the can_change_name business bot right. Returns True on success. — write (setBusinessAccountName)

**Changes something in Telegram.**

```sh
tg bot api set-business-account-name [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection. |
| `--first-name <value>` | The new value of the first name for the business account; 1-64 characters. |
| `--last-name <value>` | The new value of the last name for the business account; 0-64 characters. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-business-account-username`

Changes the username of a managed business account. Requires the can_change_username business bot right. Returns True on success. — write (setBusinessAccountUsername)

**Changes something in Telegram.**

```sh
tg bot api set-business-account-username [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection. |
| `--username <value>` | The new value of the username for the business account; 0-32 characters. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-business-account-bio`

Changes the bio of a managed business account. Requires the can_change_bio business bot right. Returns True on success. — write (setBusinessAccountBio)

**Changes something in Telegram.**

```sh
tg bot api set-business-account-bio [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection. |
| `--bio <value>` | The new value of the bio for the business account; 0-140 characters. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-business-account-profile-photo`

Changes the profile photo of a managed business account. Requires the can_edit_profile_photo business bot right. Returns True on success. — write (setBusinessAccountProfilePhoto)

**Changes something in Telegram.**

```sh
tg bot api set-business-account-profile-photo [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection. |
| `--photo <value>` | The new profile photo to set. |
| `--is-public <value>` | Pass True to set the public photo, which will be visible even if the main photo is hidden by the business account's privacy settings. An account can have only one public photo. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api remove-business-account-profile-photo`

Removes the current profile photo of a managed business account. Requires the can_edit_profile_photo business bot right. Returns True on success. — destructive (removeBusinessAccountProfilePhoto)

**Changes something in Telegram.**

```sh
tg bot api remove-business-account-profile-photo [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection. |
| `--is-public <value>` | Pass True to remove the public photo, which is visible even if the main photo is hidden by the business account's privacy settings. After the main photo is removed, the previous profile photo (if present) becomes the main photo. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-business-account-gift-settings`

Changes the privacy settings pertaining to incoming gifts in a managed business account. Requires the can_change_gift_settings business bot right. Returns True on success. — write (setBusinessAccountGiftSettings)

**Changes something in Telegram.**

```sh
tg bot api set-business-account-gift-settings [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection. |
| `--show-gift-button <value>` | Pass True if a button for sending a gift to the user or by the business account must always be shown in the input field. |
| `--accepted-gift-types <value>` | Types of gifts accepted by the business account. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-business-account-star-balance`

Returns the amount of Telegram Stars owned by a managed business account. Requires the can_view_gifts_and_stars business bot right. Returns StarAmount on success. — read (getBusinessAccountStarBalance)

```sh
tg bot api get-business-account-star-balance [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api transfer-business-account-stars`

Transfers Telegram Stars from the business account balance to the bot's balance. Requires the can_transfer_stars business bot right. Returns True on success. — destructive (transferBusinessAccountStars)

**Changes something in Telegram.**

```sh
tg bot api transfer-business-account-stars [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection. |
| `--star-count <value>` | Number of Telegram Stars to transfer; 1-10000. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-business-account-gifts`

Returns the gifts received and owned by a managed business account. Requires the can_view_gifts_and_stars business bot right. Returns OwnedGifts on success. — read (getBusinessAccountGifts)

```sh
tg bot api get-business-account-gifts [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection. |
| `--exclude-unsaved <value>` | Pass True to exclude gifts that aren't saved to the account's profile page. |
| `--exclude-saved <value>` | Pass True to exclude gifts that are saved to the account's profile page. |
| `--exclude-unlimited <value>` | Pass True to exclude gifts that can be purchased an unlimited number of times. |
| `--exclude-limited-upgradable <value>` | Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique. |
| `--exclude-limited-non-upgradable <value>` | Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique. |
| `--exclude-unique <value>` | Pass True to exclude unique gifts. |
| `--exclude-from-blockchain <value>` | Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram. |
| `--sort-by-price <value>` | Pass True to sort results by gift price instead of send date. Sorting is applied before pagination. |
| `--offset <value>` | Offset of the first entry to return as received from the previous request; use empty string to get the first chunk of results. |
| `--limit <value>` | The maximum number of gifts to be returned; 1-100. Defaults to 100. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-user-gifts`

Returns the gifts owned and hosted by a user. Returns OwnedGifts on success. — read (getUserGifts)

```sh
tg bot api get-user-gifts [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | Unique identifier of the user. |
| `--exclude-unlimited <value>` | Pass True to exclude gifts that can be purchased an unlimited number of times. |
| `--exclude-limited-upgradable <value>` | Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique. |
| `--exclude-limited-non-upgradable <value>` | Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique. |
| `--exclude-from-blockchain <value>` | Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram. |
| `--exclude-unique <value>` | Pass True to exclude unique gifts. |
| `--sort-by-price <value>` | Pass True to sort results by gift price instead of send date. Sorting is applied before pagination. |
| `--offset <value>` | Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results. |
| `--limit <value>` | The maximum number of gifts to be returned; 1-100. Defaults to 100. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-chat-gifts`

Returns the gifts owned by a chat. Returns OwnedGifts on success. — read (getChatGifts)

```sh
tg bot api get-chat-gifts [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target channel in the format @username. |
| `--exclude-unsaved <value>` | Pass True to exclude gifts that aren't saved to the chat's profile page. Always True, unless the bot has the can_post_messages administrator right in the channel. |
| `--exclude-saved <value>` | Pass True to exclude gifts that are saved to the chat's profile page. Always False, unless the bot has the can_post_messages administrator right in the channel. |
| `--exclude-unlimited <value>` | Pass True to exclude gifts that can be purchased an unlimited number of times. |
| `--exclude-limited-upgradable <value>` | Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique. |
| `--exclude-limited-non-upgradable <value>` | Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique. |
| `--exclude-from-blockchain <value>` | Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram. |
| `--exclude-unique <value>` | Pass True to exclude unique gifts. |
| `--sort-by-price <value>` | Pass True to sort results by gift price instead of send date. Sorting is applied before pagination. |
| `--offset <value>` | Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results. |
| `--limit <value>` | The maximum number of gifts to be returned; 1-100. Defaults to 100. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api convert-gift-to-stars`

Converts a given regular gift to Telegram Stars. Requires the can_convert_gifts_to_stars business bot right. Returns True on success. — destructive (convertGiftToStars)

**Changes something in Telegram.**

```sh
tg bot api convert-gift-to-stars [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection. |
| `--owned-gift-id <value>` | Unique identifier of the regular gift that should be converted to Telegram Stars. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api upgrade-gift`

Upgrades a given regular gift to a unique gift. Requires the can_transfer_and_upgrade_gifts business bot right. Additionally requires the can_transfer_stars business bot right if the upgrade is paid. Returns True on success. — destructive (upgradeGift)

**Changes something in Telegram.**

```sh
tg bot api upgrade-gift [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection. |
| `--owned-gift-id <value>` | Unique identifier of the regular gift that should be upgraded to a unique one. |
| `--keep-original-details <value>` | Pass True to keep the original gift text, sender and receiver in the upgraded gift. |
| `--star-count <value>` | The amount of Telegram Stars that will be paid for the upgrade from the business account balance. If gift.prepaid_upgrade_star_count > 0, then pass 0, otherwise, the can_transfer_stars business bot right is required and gift.upgrade_star_count must be passed. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api transfer-gift`

Transfers an owned unique gift to another user. Requires the can_transfer_and_upgrade_gifts business bot right. Requires can_transfer_stars business bot right if the transfer is paid. Returns True on success. — destructive (transferGift)

**Changes something in Telegram.**

```sh
tg bot api transfer-gift [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection. |
| `--owned-gift-id <value>` | Unique identifier of the regular gift that should be transferred. |
| `--new-owner-chat-id <value>` | Unique identifier of the chat which will own the gift. The chat must be active in the last 24 hours. |
| `--star-count <value>` | The amount of Telegram Stars that will be paid for the transfer from the business account balance. If positive, then the can_transfer_stars business bot right is required. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api post-story`

Posts a story on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns Story on success. — write (postStory)

**Changes something in Telegram.**

```sh
tg bot api post-story [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection. |
| `--content <value>` | Content of the story. |
| `--active-period <value>` | Period after which the story is moved to the archive, in seconds; must be one of 6 * 3600, 12 * 3600, 86400, or 2 * 86400. |
| `--caption <value>` | Caption of the story, 0-2048 characters after entities parsing. |
| `--parse-mode <value>` | Mode for parsing entities in the story caption. See formatting options for more details. |
| `--caption-entities <value>` | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode. |
| `--areas <value>` | A JSON-serialized list of clickable areas to be shown on the story. |
| `--post-to-chat-page <value>` | Pass True to keep the story accessible after it expires. |
| `--protect-content <value>` | Pass True if the content of the story must be protected from forwarding and screenshotting. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api repost-story`

Reposts a story on behalf of a business account from another business account. Both business accounts must be managed by the same bot, and the story on the source account must have been posted (or reposted) by the bot. Requires the can_manage_stories business bot right for both business accounts. Returns Story on success. — write (repostStory)

**Changes something in Telegram.**

```sh
tg bot api repost-story [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection. |
| `--from-chat-id <value>` | Unique identifier of the chat which posted the story that should be reposted. |
| `--from-story-id <value>` | Unique identifier of the story that should be reposted. |
| `--active-period <value>` | Period after which the story is moved to the archive, in seconds; must be one of 6 * 3600, 12 * 3600, 86400, or 2 * 86400. |
| `--post-to-chat-page <value>` | Pass True to keep the story accessible after it expires. |
| `--protect-content <value>` | Pass True if the content of the story must be protected from forwarding and screenshotting. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api edit-story`

Edits a story previously posted by the bot on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns Story on success. — write (editStory)

**Changes something in Telegram.**

```sh
tg bot api edit-story [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection. |
| `--story-id <value>` | Unique identifier of the story to edit. |
| `--content <value>` | Content of the story. |
| `--caption <value>` | Caption of the story, 0-2048 characters after entities parsing. |
| `--parse-mode <value>` | Mode for parsing entities in the story caption. See formatting options for more details. |
| `--caption-entities <value>` | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode. |
| `--areas <value>` | A JSON-serialized list of clickable areas to be shown on the story. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api delete-story`

Deletes a story previously posted by the bot on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns True on success. — destructive (deleteStory)

**Changes something in Telegram.**

```sh
tg bot api delete-story [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection. |
| `--story-id <value>` | Unique identifier of the story to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api answer-web-app-query`

Use this method to set the result of an interaction with a Web App and send a corresponding message on behalf of the user to the chat from which the query originated. On success, a SentWebAppMessage object is returned. — write (answerWebAppQuery)

**Changes something in Telegram.**

```sh
tg bot api answer-web-app-query [options]
```

| Option | What it does |
|---|---|
| `--web-app-query-id <value>` | Unique identifier for the query to be answered. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api save-prepared-inline-message`

Stores a message that can be sent by a user of a Mini App. Returns a PreparedInlineMessage object. — write (savePreparedInlineMessage)

**Changes something in Telegram.**

```sh
tg bot api save-prepared-inline-message [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | Unique identifier of the target user that can use the prepared message. |
| `--allow-user-chats <value>` | Pass True if the message can be sent to private chats with users. |
| `--allow-bot-chats <value>` | Pass True if the message can be sent to private chats with bots. |
| `--allow-group-chats <value>` | Pass True if the message can be sent to group and supergroup chats. |
| `--allow-channel-chats <value>` | Pass True if the message can be sent to channel chats. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api save-prepared-keyboard-button`

Stores a keyboard button that can be used by a user within a Mini App. Returns a PreparedKeyboardButton object. — write (savePreparedKeyboardButton)

**Changes something in Telegram.**

```sh
tg bot api save-prepared-keyboard-button [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | Unique identifier of the target user that can use the button. |
| `--button <value>` | A JSON-serialized object describing the button to be saved. The button must be of the type request_users, request_chat, or request_managed_bot. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api edit-message-text`

Use this method to edit text, rich and game messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent. — write (editMessageText)

**Changes something in Telegram.**

```sh
tg bot api edit-message-text [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message to be edited was sent. |
| `--chat-id <value>` | Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-id <value>` | Required if inline_message_id is not specified. Identifier of the message to edit. |
| `--inline-message-id <value>` | Required if chat_id and message_id are not specified. Identifier of the inline message. |
| `--text <value>` | New text of the message, 1-4096 characters after entity parsing; required if rich_message isn't specified. |
| `--parse-mode <value>` | Mode for parsing entities in the message text. See formatting options for more details. |
| `--entities <value>` | A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode. |
| `--link-preview-options <value>` | Link preview generation options for the message. |
| `--rich-message <value>` | New rich content of the message; required if text isn't specified. Direct upload of new files and explicit upload of files by a URL isn't supported when an inline message is edited. |
| `--reply-markup <value>` | A JSON-serialized object for an inline keyboard. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api edit-message-caption`

Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent. — write (editMessageCaption)

**Changes something in Telegram.**

```sh
tg bot api edit-message-caption [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message to be edited was sent. |
| `--chat-id <value>` | Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-id <value>` | Required if inline_message_id is not specified. Identifier of the message to edit. |
| `--inline-message-id <value>` | Required if chat_id and message_id are not specified. Identifier of the inline message. |
| `--caption <value>` | New caption of the message, 0-1024 characters after entities parsing. |
| `--parse-mode <value>` | Mode for parsing entities in the message caption. See formatting options for more details. |
| `--caption-entities <value>` | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode. |
| `--show-caption-above-media <value>` | Pass True if the caption must be shown above the message media. Supported only for animation, photo and video messages. |
| `--reply-markup <value>` | A JSON-serialized object for an inline keyboard. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api edit-message-media`

Use this method to edit animation, audio, document, live photo, photo, or video messages, or to replace a text or a rich message with a media. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo, a live photo, or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent. — write (editMessageMedia)

**Changes something in Telegram.**

```sh
tg bot api edit-message-media [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message to be edited was sent. |
| `--chat-id <value>` | Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-id <value>` | Required if inline_message_id is not specified. Identifier of the message to edit. |
| `--inline-message-id <value>` | Required if chat_id and message_id are not specified. Identifier of the inline message. |
| `--media <value>` | A JSON-serialized object for the new media content of the message. |
| `--reply-markup <value>` | A JSON-serialized object for a new inline keyboard. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api edit-message-live-location`

Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to stopMessageLiveLocation. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. — write (editMessageLiveLocation)

**Changes something in Telegram.**

```sh
tg bot api edit-message-live-location [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message to be edited was sent. |
| `--chat-id <value>` | Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-id <value>` | Required if inline_message_id is not specified. Identifier of the message to edit. |
| `--inline-message-id <value>` | Required if chat_id and message_id are not specified. Identifier of the inline message. |
| `--latitude <value>` | Latitude of new location. |
| `--longitude <value>` | Longitude of new location. |
| `--live-period <value>` | New period in seconds during which the location can be updated, starting from the message send date. If 0x7FFFFFFF is specified, then the location can be updated forever. Otherwise, the new value must not exceed the current live_period by more than a day, and the live location expiration date must remain within the next 90 days. If not specified, then live_period remains unchanged. |
| `--horizontal-accuracy <value>` | The radius of uncertainty for the location, measured in meters; 0-1500. |
| `--heading <value>` | Direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. |
| `--proximity-alert-radius <value>` | The maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. |
| `--reply-markup <value>` | A JSON-serialized object for a new inline keyboard. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api stop-message-live-location`

Use this method to stop updating a live location message before live_period expires. On success, if the message is not an inline message, the edited Message is returned, otherwise True is returned. — write (stopMessageLiveLocation)

**Changes something in Telegram.**

```sh
tg bot api stop-message-live-location [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message to be edited was sent. |
| `--chat-id <value>` | Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-id <value>` | Required if inline_message_id is not specified. Identifier of the message with live location to stop. |
| `--inline-message-id <value>` | Required if chat_id and message_id are not specified. Identifier of the inline message. |
| `--reply-markup <value>` | A JSON-serialized object for a new inline keyboard. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api edit-message-checklist`

Use this method to edit a checklist on behalf of a connected business account. On success, the edited Message is returned. — write (editMessageChecklist)

**Changes something in Telegram.**

```sh
tg bot api edit-message-checklist [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot in the format @username. |
| `--message-id <value>` | Unique identifier for the target message. |
| `--checklist <value>` | A JSON-serialized object for the new checklist. |
| `--reply-markup <value>` | A JSON-serialized object for the new inline keyboard for the message. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api edit-message-reply-markup`

Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent. — write (editMessageReplyMarkup)

**Changes something in Telegram.**

```sh
tg bot api edit-message-reply-markup [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message to be edited was sent. |
| `--chat-id <value>` | Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-id <value>` | Required if inline_message_id is not specified. Identifier of the message to edit. |
| `--inline-message-id <value>` | Required if chat_id and message_id are not specified. Identifier of the inline message. |
| `--reply-markup <value>` | A JSON-serialized object for an inline keyboard. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api stop-poll`

Use this method to stop a poll which was sent by the bot. On success, the stopped Poll is returned. — write (stopPoll)

**Changes something in Telegram.**

```sh
tg bot api stop-poll [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message to be edited was sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-id <value>` | Identifier of the original message with the poll. |
| `--reply-markup <value>` | A JSON-serialized object for a new message inline keyboard. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api edit-ephemeral-message-text`

Use this method to edit an ephemeral text or rich message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned. — write (editEphemeralMessageText)

**Changes something in Telegram.**

```sh
tg bot api edit-ephemeral-message-text [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--receiver-user-id <value>` | Identifier of the user who received the message. |
| `--ephemeral-message-id <value>` | Identifier of the ephemeral message to edit. |
| `--text <value>` | New text of the message, 1-4096 characters after entity parsing; required if rich_message isn't specified. |
| `--parse-mode <value>` | Mode for parsing entities in the message text. See formatting options for more details. |
| `--entities <value>` | A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode. |
| `--rich-message <value>` | New rich content of the message; required if text isn't specified. |
| `--link-preview-options <value>` | Link preview generation options for the message. |
| `--reply-markup <value>` | A JSON-serialized object for an inline keyboard. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api edit-ephemeral-message-media`

Use this method to edit the media of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned. — write (editEphemeralMessageMedia)

**Changes something in Telegram.**

```sh
tg bot api edit-ephemeral-message-media [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--receiver-user-id <value>` | Identifier of the user who received the message. |
| `--ephemeral-message-id <value>` | Identifier of the ephemeral message to edit. |
| `--media <value>` | A JSON-serialized object for the new media content of the message. |
| `--reply-markup <value>` | A JSON-serialized object for an inline keyboard. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api edit-ephemeral-message-caption`

Use this method to edit the caption of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned. — write (editEphemeralMessageCaption)

**Changes something in Telegram.**

```sh
tg bot api edit-ephemeral-message-caption [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--receiver-user-id <value>` | Identifier of the user who received the message. |
| `--ephemeral-message-id <value>` | Identifier of the ephemeral message to edit. |
| `--caption <value>` | New caption of the message, 0-1024 characters after entities parsing. |
| `--parse-mode <value>` | Mode for parsing entities in the message caption. See formatting options for more details. |
| `--caption-entities <value>` | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode. |
| `--show-caption-above-media <value>` | Pass True if the caption must be shown above the message media. Supported only for animation, photo and video messages. |
| `--reply-markup <value>` | A JSON-serialized object for an inline keyboard. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api edit-ephemeral-message-reply-markup`

Use this method to edit only the reply markup of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned. — write (editEphemeralMessageReplyMarkup)

**Changes something in Telegram.**

```sh
tg bot api edit-ephemeral-message-reply-markup [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--receiver-user-id <value>` | Identifier of the user who received the message. |
| `--ephemeral-message-id <value>` | Identifier of the ephemeral message to edit. |
| `--reply-markup <value>` | A JSON-serialized object for an inline keyboard. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api approve-suggested-post`

Use this method to approve a suggested post in a direct messages chat. The bot must have the 'can_post_messages' administrator right in the corresponding channel chat. Returns True on success. — destructive (approveSuggestedPost)

**Changes something in Telegram.**

```sh
tg bot api approve-suggested-post [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target direct messages chat. |
| `--message-id <value>` | Identifier of a suggested post message to approve. |
| `--send-date <value>` | Point in time (Unix timestamp) when the post is expected to be published; omit if the date has already been specified when the suggested post was created. If specified, then the date must be not more than 2678400 seconds (30 days) in the future. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api decline-suggested-post`

Use this method to decline a suggested post in a direct messages chat. The bot must have the 'can_manage_direct_messages' administrator right in the corresponding channel chat. Returns True on success. — destructive (declineSuggestedPost)

**Changes something in Telegram.**

```sh
tg bot api decline-suggested-post [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target direct messages chat. |
| `--message-id <value>` | Identifier of a suggested post message to decline. |
| `--comment <value>` | Comment for the creator of the suggested post; 0-128 characters. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api delete-message`

Use this method to delete a message, including service messages, with the following limitations: — destructive (deleteMessage)

**Changes something in Telegram.**

```sh
tg bot api delete-message [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-id <value>` | Identifier of the message to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api delete-messages`

Use this method to delete multiple messages simultaneously. If some of the specified messages can't be found, they are skipped. Returns True on success. — destructive (deleteMessages)

**Changes something in Telegram.**

```sh
tg bot api delete-messages [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-ids <value>` | A JSON-serialized list of 1-100 identifiers of messages to delete. See deleteMessage for limitations on which messages can be deleted. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api delete-ephemeral-message`

Use this method to delete an ephemeral message. Note that it is not guaranteed that the user will receive the message deletion event, especially if they are offline. Returns True on success. — destructive (deleteEphemeralMessage)

**Changes something in Telegram.**

```sh
tg bot api delete-ephemeral-message [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--receiver-user-id <value>` | Identifier of the user who received the message. |
| `--ephemeral-message-id <value>` | Identifier of the ephemeral message to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api delete-message-reaction`

Use this method to remove a reaction from a message in a group or a supergroup chat. The bot must have the 'can_delete_messages' administrator right in the chat. Returns True on success. — destructive (deleteMessageReaction)

**Changes something in Telegram.**

```sh
tg bot api delete-message-reaction [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--message-id <value>` | Identifier of the target message. |
| `--user-id <value>` | Identifier of the user whose reaction will be removed, if the reaction was added by a user. |
| `--actor-chat-id <value>` | Identifier of the chat whose reaction will be removed, if the reaction was added by a chat. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api delete-all-message-reactions`

Use this method to remove up to 10000 recent reactions in a group or a supergroup chat added by a given user or chat. The bot must have the 'can_delete_messages' administrator right in the chat. Returns True on success. — destructive (deleteAllMessageReactions)

**Changes something in Telegram.**

```sh
tg bot api delete-all-message-reactions [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target supergroup in the format @username. |
| `--user-id <value>` | Identifier of the user whose reactions will be removed, if the reactions were added by a user. |
| `--actor-chat-id <value>` | Identifier of the chat whose reactions will be removed, if the reactions were added by a chat. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-sticker`

Use this method to send static .WEBP, animated .TGS, or video .WEBM stickers. On success, the sent Message is returned. — write (sendSticker)

**Changes something in Telegram.**

```sh
tg bot api send-sticker [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--ephemeral-message-parameters <value>` | A JSON-serialized object containing the parameters of the ephemeral message to send. |
| `--sticker <value>` | Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Video and animated stickers can't be sent via an HTTP URL. |
| `--emoji <value>` | Emoji associated with the sticker; only for just uploaded stickers. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-sticker-set`

Use this method to get a sticker set. On success, a StickerSet object is returned. — read (getStickerSet)

```sh
tg bot api get-sticker-set [options]
```

| Option | What it does |
|---|---|
| `--name <value>` | Name of the sticker set. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-custom-emoji-stickers`

Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of Sticker objects. — read (getCustomEmojiStickers)

```sh
tg bot api get-custom-emoji-stickers [options]
```

| Option | What it does |
|---|---|
| `--custom-emoji-ids <value>` | A JSON-serialized list of custom emoji identifiers. At most 200 custom emoji identifiers can be specified. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api upload-sticker-file`

Use this method to upload a file with a sticker for later use in the createNewStickerSet, addStickerToSet, or replaceStickerInSet methods (the file can be used multiple times). Returns the uploaded File on success. — write (uploadStickerFile)

**Changes something in Telegram.**

```sh
tg bot api upload-sticker-file [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | User identifier of sticker file owner. |
| `--sticker <value>` | A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See https://core.telegram.org/stickers for technical requirements. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. |
| `--sticker-format <value>` | Format of the sticker, must be one of "static", "animated", "video". |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api create-new-sticker-set`

Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. Returns True on success. — write (createNewStickerSet)

**Changes something in Telegram.**

```sh
tg bot api create-new-sticker-set [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | User identifier of created sticker set owner. |
| `--name <value>` | Short name of sticker set, to be used in t.me/addstickers/ URLs (e.g., animals). Can contain only English letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in "_by_<bot_username>". <bot_username> is case insensitive. 1-64 characters. |
| `--title <value>` | Sticker set title, 1-64 characters. |
| `--stickers <value>` | A JSON-serialized list of 1-50 initial stickers to be added to the sticker set. |
| `--sticker-type <value>` | Type of stickers in the set, pass "regular", "mask", or "custom_emoji". By default, a regular sticker set is created. |
| `--needs-repainting <value>` | Pass True if stickers in the sticker set must be repainted to the color of text when used in messages, the accent color if used as emoji status, white on chat photos, or another appropriate color based on context; for custom emoji sticker sets only. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api add-sticker-to-set`

Use this method to add a new sticker to a set created by the bot. Emoji sticker sets can have up to 200 stickers. Other sticker sets can have up to 120 stickers. Returns True on success. — write (addStickerToSet)

**Changes something in Telegram.**

```sh
tg bot api add-sticker-to-set [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | User identifier of sticker set owner. |
| `--name <value>` | Sticker set name. |
| `--sticker <value>` | A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn't changed. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-sticker-position-in-set`

Use this method to move a sticker in a set created by the bot to a specific position. Returns True on success. — write (setStickerPositionInSet)

**Changes something in Telegram.**

```sh
tg bot api set-sticker-position-in-set [options]
```

| Option | What it does |
|---|---|
| `--sticker <value>` | File identifier of the sticker. |
| `--position <value>` | New sticker position in the set, zero-based. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api delete-sticker-from-set`

Use this method to delete a sticker from a set created by the bot. Returns True on success. — destructive (deleteStickerFromSet)

**Changes something in Telegram.**

```sh
tg bot api delete-sticker-from-set [options]
```

| Option | What it does |
|---|---|
| `--sticker <value>` | File identifier of the sticker. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api replace-sticker-in-set`

Use this method to replace an existing sticker in a sticker set with a new one. The method is equivalent to calling deleteStickerFromSet, then addStickerToSet, then setStickerPositionInSet. Returns True on success. — write (replaceStickerInSet)

**Changes something in Telegram.**

```sh
tg bot api replace-sticker-in-set [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | User identifier of the sticker set owner. |
| `--name <value>` | Sticker set name. |
| `--old-sticker <value>` | File identifier of the replaced sticker. |
| `--sticker <value>` | A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-sticker-emoji-list`

Use this method to change the list of emoji assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns True on success. — write (setStickerEmojiList)

**Changes something in Telegram.**

```sh
tg bot api set-sticker-emoji-list [options]
```

| Option | What it does |
|---|---|
| `--sticker <value>` | File identifier of the sticker. |
| `--emoji-list <value>` | A JSON-serialized list of 1-20 emoji associated with the sticker. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-sticker-keywords`

Use this method to change search keywords assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns True on success. — write (setStickerKeywords)

**Changes something in Telegram.**

```sh
tg bot api set-sticker-keywords [options]
```

| Option | What it does |
|---|---|
| `--sticker <value>` | File identifier of the sticker. |
| `--keywords <value>` | A JSON-serialized list of 0-20 search keywords for the sticker with total length of up to 64 characters. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-sticker-mask-position`

Use this method to change the mask position of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns True on success. — write (setStickerMaskPosition)

**Changes something in Telegram.**

```sh
tg bot api set-sticker-mask-position [options]
```

| Option | What it does |
|---|---|
| `--sticker <value>` | File identifier of the sticker. |
| `--mask-position <value>` | A JSON-serialized object with the position where the mask should be placed on faces. Omit the parameter to remove the mask position. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-sticker-set-title`

Use this method to set the title of a created sticker set. Returns True on success. — write (setStickerSetTitle)

**Changes something in Telegram.**

```sh
tg bot api set-sticker-set-title [options]
```

| Option | What it does |
|---|---|
| `--name <value>` | Sticker set name. |
| `--title <value>` | Sticker set title, 1-64 characters. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-sticker-set-thumbnail`

Use this method to set the thumbnail of a regular or mask sticker set. The format of the thumbnail file must match the format of the stickers in the set. Returns True on success. — write (setStickerSetThumbnail)

**Changes something in Telegram.**

```sh
tg bot api set-sticker-set-thumbnail [options]
```

| Option | What it does |
|---|---|
| `--name <value>` | Sticker set name. |
| `--user-id <value>` | User identifier of the sticker set owner. |
| `--thumbnail <value>` | A .WEBP or .PNG image with the thumbnail, must be up to 128 kilobytes in size and have a width and height of exactly 100px, or a .TGS animation with a thumbnail up to 32 kilobytes in size (see https://core.telegram.org/stickers#animation-requirements for animated sticker technical requirements), or a .WEBM video with the thumbnail up to 32 kilobytes in size; see https://core.telegram.org/stickers#video-requirements for video sticker technical requirements. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Animated and video sticker set thumbnails can't be uploaded via HTTP URL. If omitted, then the thumbnail is dropped and the first sticker is used as the thumbnail. |
| `--format <value>` | Format of the thumbnail, must be one of "static" for a .WEBP or .PNG image, "animated" for a .TGS animation, or "video" for a .WEBM video. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-custom-emoji-sticker-set-thumbnail`

Use this method to set the thumbnail of a custom emoji sticker set. Returns True on success. — write (setCustomEmojiStickerSetThumbnail)

**Changes something in Telegram.**

```sh
tg bot api set-custom-emoji-sticker-set-thumbnail [options]
```

| Option | What it does |
|---|---|
| `--name <value>` | Sticker set name. |
| `--custom-emoji-id <value>` | Custom emoji identifier of a sticker from the sticker set; pass an empty string to drop the thumbnail and use the first sticker as the thumbnail. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api delete-sticker-set`

Use this method to delete a sticker set that was created by the bot. Returns True on success. — destructive (deleteStickerSet)

**Changes something in Telegram.**

```sh
tg bot api delete-sticker-set [options]
```

| Option | What it does |
|---|---|
| `--name <value>` | Sticker set name. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-rich-message`

Use this method to send rich messages. If the message contains a block with a media element, then the bot must have the right to send the media to the chat. On success, the sent Message is returned. — write (sendRichMessage)

**Changes something in Telegram.**

```sh
tg bot api send-rich-message [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. Bot can send rich messages on behalf of a business account only if the corresponding user can send rich messages. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--ephemeral-message-parameters <value>` | A JSON-serialized object containing the parameters of the ephemeral message to send. |
| `--rich-message <value>` | The message to be sent. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-rich-message-draft`

Use this method to stream a partial rich message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you must call sendRichMessage with the complete message to persist it in the user's chat. Returns True on success. — write (sendRichMessageDraft)

**Changes something in Telegram.**

```sh
tg bot api send-rich-message-draft [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target private chat. |
| `--message-thread-id <value>` | Unique identifier for the target message thread. |
| `--draft-id <value>` | Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated. Otherwise, the draft is replaced without animation. |
| `--rich-message <value>` | The partial message to be streamed. Direct upload of new files and explicit upload of files by a URL isn't supported. |
| `--can-stop <value>` | Pass True to show the user a button to stop further drafts. The bot will receive an Update "stopped_message_generation" if the user presses the button. |
| `--keep-on-stop <value>` | Pass True to keep the draft in the chat when the button is pressed. The draft will still disappear after a short time or if the bot sends a message. To fully preserve the partial draft, the bot should send it as a new message. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api answer-inline-query`

Use this method to send answers to an inline query. On success, True is returned. — write (answerInlineQuery)

**Changes something in Telegram.**

```sh
tg bot api answer-inline-query [options]
```

| Option | What it does |
|---|---|
| `--inline-query-id <value>` | Unique identifier for the answered query. |
| `--cache-time <value>` | The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300. |
| `--is-personal <value>` | Pass True if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query. |
| `--next-offset <value>` | Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don't support pagination. Offset length can't exceed 64 bytes. |
| `--button <value>` | A JSON-serialized object describing a button to be shown above inline query results. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-invoice`

Use this method to send invoices. On success, the sent Message is returned. — write (sendInvoice)

**Changes something in Telegram.**

```sh
tg bot api send-invoice [options]
```

| Option | What it does |
|---|---|
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--direct-messages-topic-id <value>` | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat. |
| `--title <value>` | Product name, 1-32 characters. |
| `--description <value>` | Product description, 1-255 characters. |
| `--payload <value>` | Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes. |
| `--currency <value>` | Three-letter ISO 4217 currency code, see more on currencies. Pass "XTR" for payments in Telegram Stars. |
| `--prices <value>` | Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in Telegram Stars. |
| `--max-tip-amount <value>` | The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in Telegram Stars. |
| `--suggested-tip-amounts <value>` | A JSON-serialized Array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount. |
| `--start-parameter <value>` | Unique deep-linking parameter. If left empty, forwarded copies of the sent message will have a Pay button, allowing multiple users to pay directly from the forwarded message, using the same invoice. If non-empty, forwarded copies of the sent message will have a URL button with a deep link to the bot (instead of a Pay button), with the value used as the start parameter. |
| `--provider-data <value>` | JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider. |
| `--photo-url <value>` | URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for. |
| `--photo-size <value>` | Photo size in bytes. |
| `--photo-width <value>` | Photo width. |
| `--photo-height <value>` | Photo height. |
| `--need-name <value>` | Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars. |
| `--need-phone-number <value>` | Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars. |
| `--need-email <value>` | Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars. |
| `--need-shipping-address <value>` | Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars. |
| `--send-phone-number-to-provider <value>` | Pass True if the user's phone number should be sent to the provider. Ignored for payments in Telegram Stars. |
| `--send-email-to-provider <value>` | Pass True if the user's email address should be sent to the provider. Ignored for payments in Telegram Stars. |
| `--is-flexible <value>` | Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--suggested-post-parameters <value>` | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | A JSON-serialized object for an inline keyboard. If empty, one 'Pay total price' button will be shown. If not empty, the first button must be a Pay button. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api create-invoice-link`

Use this method to create a link for an invoice. Returns the created invoice link as String on success. — write (createInvoiceLink)

**Changes something in Telegram.**

```sh
tg bot api create-invoice-link [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the link will be created. For payments in Telegram Stars only. |
| `--title <value>` | Product name, 1-32 characters. |
| `--description <value>` | Product description, 1-255 characters. |
| `--payload <value>` | Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes. |
| `--currency <value>` | Three-letter ISO 4217 currency code, see more on currencies. Pass "XTR" for payments in Telegram Stars. |
| `--prices <value>` | Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in Telegram Stars. |
| `--subscription-period <value>` | The number of seconds the subscription will be active for before the next payment. The currency must be set to "XTR" (Telegram Stars) if the parameter is used. Currently, it must always be 2592000 (30 days) if specified. Any number of subscriptions can be active for a given bot at the same time, including multiple concurrent subscriptions from the same user. Subscription price must no exceed 10000 Telegram Stars. |
| `--max-tip-amount <value>` | The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in Telegram Stars. |
| `--suggested-tip-amounts <value>` | A JSON-serialized Array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount. |
| `--provider-data <value>` | JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider. |
| `--photo-url <value>` | URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. |
| `--photo-size <value>` | Photo size in bytes. |
| `--photo-width <value>` | Photo width. |
| `--photo-height <value>` | Photo height. |
| `--need-name <value>` | Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars. |
| `--need-phone-number <value>` | Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars. |
| `--need-email <value>` | Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars. |
| `--need-shipping-address <value>` | Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars. |
| `--send-phone-number-to-provider <value>` | Pass True if the user's phone number should be sent to the provider. Ignored for payments in Telegram Stars. |
| `--send-email-to-provider <value>` | Pass True if the user's email address should be sent to the provider. Ignored for payments in Telegram Stars. |
| `--is-flexible <value>` | Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api answer-shipping-query`

If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the Bot API will send an Update with a shipping_query field to the bot. Use this method to reply to shipping queries. On success, True is returned. — write (answerShippingQuery)

**Changes something in Telegram.**

```sh
tg bot api answer-shipping-query [options]
```

| Option | What it does |
|---|---|
| `--shipping-query-id <value>` | Unique identifier for the query to be answered. |
| `--ok <value>` | Pass True if delivery to the specified address is possible and False if there are any problems (for example, if delivery to the specified address is not possible). |
| `--shipping-options <value>` | Required if ok is True. A JSON-serialized Array of available shipping options. |
| `--error-message <value>` | Required if ok is False. Error message in human readable form that explains why it is impossible to complete the order (e.g. "Sorry, delivery to your desired address is unavailable"). Telegram will display this message to the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api answer-pre-checkout-query`

Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query. Use this method to respond to such pre-checkout queries. On success, True is returned. Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent. — destructive (answerPreCheckoutQuery)

**Changes something in Telegram.**

```sh
tg bot api answer-pre-checkout-query [options]
```

| Option | What it does |
|---|---|
| `--pre-checkout-query-id <value>` | Unique identifier for the query to be answered. |
| `--ok <value>` | Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use False if there are any problems. |
| `--error-message <value>` | Required if ok is False. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. "Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!"). Telegram will display this message to the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-my-star-balance`

A method to get the current Telegram Stars balance of the bot. Requires no parameters. On success, returns a StarAmount object. — read (getMyStarBalance)

```sh
tg bot api get-my-star-balance
```

#### `tg bot api get-star-transactions`

Returns the bot's Telegram Star transactions in chronological order. On success, returns a StarTransactions object. — read (getStarTransactions)

```sh
tg bot api get-star-transactions [options]
```

| Option | What it does |
|---|---|
| `--offset <value>` | Number of transactions to skip in the response. |
| `--limit <value>` | The maximum number of transactions to be retrieved. Values between 1-100 are accepted. Defaults to 100. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api refund-star-payment`

Refunds a successful payment in Telegram Stars. Returns True on success. — destructive (refundStarPayment)

**Changes something in Telegram.**

```sh
tg bot api refund-star-payment [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | Identifier of the user whose payment will be refunded. |
| `--telegram-payment-charge-id <value>` | Telegram payment identifier. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api edit-user-star-subscription`

Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. Returns True on success. — destructive (editUserStarSubscription)

**Changes something in Telegram.**

```sh
tg bot api edit-user-star-subscription [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | Identifier of the user whose subscription will be edited. |
| `--telegram-payment-charge-id <value>` | Telegram payment identifier for the subscription. |
| `--is-canceled <value>` | Pass True to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass False to allow the user to re-enable a subscription that was previously canceled by the bot. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-passport-data-errors`

Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns True on success. — write (setPassportDataErrors)

**Changes something in Telegram.**

```sh
tg bot api set-passport-data-errors [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | User identifier. |
| `--errors <value>` | A JSON-serialized Array describing the errors. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api send-game`

Use this method to send a game. On success, the sent Message is returned. — write (sendGame)

**Changes something in Telegram.**

```sh
tg bot api send-game [options]
```

| Option | What it does |
|---|---|
| `--business-connection-id <value>` | Unique identifier of the business connection on behalf of which the message will be sent. |
| `--chat-id <value>` | Unique identifier for the target chat or username of the target bot in the format @username. Games can't be sent to channel direct messages chats and channel chats. |
| `--message-thread-id <value>` | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only. |
| `--game-short-name <value>` | Short name of the game, serves as the unique identifier for the game. Set up your games via @BotFather. |
| `--disable-notification <value>` | Sends the message silently. Users will receive a notification with no sound. |
| `--protect-content <value>` | Protects the contents of the sent message from forwarding and saving. |
| `--allow-paid-broadcast <value>` | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| `--message-effect-id <value>` | Unique identifier of the message effect to be added to the message; for private chats only. |
| `--reply-parameters <value>` | Description of the message to reply to. |
| `--reply-markup <value>` | A JSON-serialized object for an inline keyboard. If empty, one 'Play game_title' button will be shown. If not empty, the first button must launch the game. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api set-game-score`

Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the Message is returned, otherwise True is returned. Returns an error, if the new score is not greater than the user's current score in the chat and force is False. — write (setGameScore)

**Changes something in Telegram.**

```sh
tg bot api set-game-score [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | User identifier. |
| `--score <value>` | New score, must be non-negative. |
| `--force <value>` | Pass True if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters. |
| `--disable-edit-message <value>` | Pass True if the game message should not be automatically edited to include the current scoreboard. |
| `--chat-id <value>` | Required if inline_message_id is not specified. Unique identifier for the target chat. |
| `--message-id <value>` | Required if inline_message_id is not specified. Identifier of the sent message. |
| `--inline-message-id <value>` | Required if chat_id and message_id are not specified. Identifier of the inline message. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `tg bot api get-game-high-scores`

Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of GameHighScore objects. — read (getGameHighScores)

```sh
tg bot api get-game-high-scores [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | Target user id. |
| `--chat-id <value>` | Required if inline_message_id is not specified. Unique identifier for the target chat. |
| `--message-id <value>` | Required if inline_message_id is not specified. Identifier of the sent message. |
| `--inline-message-id <value>` | Required if chat_id and message_id are not specified. Identifier of the inline message. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

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
