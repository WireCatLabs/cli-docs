---
title: "Referencia de comandos"
---

<!-- Generado desde el árbol de comandos por scripts/commands.ts. No editar el original; `pnpm generate`. -->

Referencia de todas las órdenes, opciones y códigos de salida. La página se **genera desde el
propio programa**, por lo que no puede describir una versión que no existe.

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

| Opción | Descripción |
|---|---|
| `-V, --version` | muestra el número de versión. |
| `-v, --verbose` | añade detalles: -v muestra identificadores, -vv todos los datos conocidos. Valor predeterminado: `0`. |
| `--json` | salida para programas: un único valor JSON por stdout, nada más. |
| `--jsonl` | salida para programas: un objeto JSON por línea, para flujos y jq. |
| `--quiet` | Desactiva los diagnósticos. |
| `--yes` | omite la confirmación que el nivel ask exige antes de escribir. |
| `--trace` | Una línea por petición en stderr: identificadores y tiempos, nunca el contenido de mensajes. |
| `--timeout <duration>` | detiene todo el comando después de este intervalo: 30s, 2m, 500ms. |
| `--offline` | responde desde lo guardado sin conectarse; falla si no hay datos. |
| `--record` | Guarda esta ejecución en `max runs`: identificadores y tiempos, nunca el contenido de los mensajes. |
| `--no-record` | no guarda la ejecución, independientemente de la configuración. |
| `--serve` | Inicia `max serve` en segundo plano si todavía no está ejecutándose; es el comportamiento predeterminado. |
| `--no-serve` | No inicia el servidor; usa la conexión del propio comando, salvo que ya haya uno ejecutándose. |

## `max session`

Sesión de MAX guardada para este perfil.

### `max session start`

Inicia sesión de este perfil en MAX.

```sh
max session start [method]
```

| Argumento || Descripción |
|---|---|---|
| `method` | opcional | token pegado o por tubería, qr, qr-chrome o sms. Valores: `token`, `qr`, `qr-chrome`, `sms`. Predeterminado: `token`. |

### `max session end`

Olvida la sesión guardada de este perfil.

```sh
max session end
```

## `max setup`

Configura tu cuenta personal de MAX y conecta el agente.

**Modifica datos en MAX.**

```sh
max setup [options]
```

| Opción | Descripción |
|---|---|
| `--agent <agent>` | Instala el skill de este agente; pregunta en el terminal, fuera de él no instala ninguno. Opciones: `none`, `codex`, `cursor`, `claude`, `gemini`, `all`. |
| `--method <method>` | Método de acceso si no hay sesión. Opciones: `token`, `qr`, `qr-chrome`, `sms`. Predeterminado: `qr`. |

## `max account`

La cuenta con la que ha iniciado sesión este perfil.

### `max account show`

cuenta con la que inició sesión el perfil; solo muestra las cuatro últimas cifras del teléfono

```sh
max account show [options]
```

| Opción | Descripción |
|---|---|
| `--show-phone` | muestra el número completo. |

### `max account update`

cambia nombre, descripción o foto visibles de tu perfil

**Modifica datos en MAX.**

```sh
max account update [options]
```

| Opción | Descripción |
|---|---|
| `--first-name <name>` | tu nombre. |
| `--last-name <name>` | tus apellidos. |
| `--description <text>` | información sobre ti. |
| `--photo <file>` | nueva foto de perfil: un archivo de imagen. |

### `max account sessions`

otras sesiones de la cuenta; no es `max session`, que gestiona la sesión de esta herramienta

#### `max account sessions list`

Todos los dispositivos y aplicaciones conectados a esta cuenta; no cierra ninguna sesión.

```sh
max account sessions list
```

#### `max account sessions end`

cierra todos los demás dispositivos, incluido el móvil; conserva este

**Modifica datos en MAX.**

```sh
max account sessions end [options]
```

| Opción | Descripción |
|---|---|
| `--others` | Todas las sesiones excepto esta. |

## `max chats`

Chats de esta cuenta.

### `max chats list`

chats recientes primero, incluidos los archivados

```sh
max chats list [options]
```

| Opción | Descripción |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | número de página, desde 1. |
| `--all` | todas las filas, sin paginar. |
| `--search <text>` | solo chats cuyo nombre contiene el texto; al menos 3 caracteres. |
| `--kind <kind>` | solo chats de este tipo: dialog, group, channel, saved. |
| `--unread` | solo chats con mensajes sin leer. |

### `max chats show`

un chat: tipo, pendientes, hora del último mensaje y participantes

```sh
max chats show <chat>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat: identificador o parte de su título. |

### `max chats events`

quién se unió, salió, fue añadido o eliminado y quién actuó, según mensajes de servicio

```sh
max chats events <chat> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |

| Opción | Descripción |
|---|---|
| `--since-time <time>` | Fecha ISO 8601 o hace 2h / 1d; últimos 7 días si se omite. |
| `--type <names>` | Solo estos eventos, separados por comas: join, leave, add, remove, create, title, pin. |

### `max chats inspect`

Consulta a dónde lleva un enlace, sin entrar al chat.

```sh
max chats inspect <link>
```

| Argumento || Descripción |
|---|---|---|
| `link` | obligatorio | Enlace de invitación o enlace público. |

### `max chats join`

se une a grupo o canal mediante enlace; los demás ven que entraste

**Modifica datos en MAX.**

```sh
max chats join <link>
```

| Argumento || Descripción |
|---|---|---|
| `link` | obligatorio | Enlace de invitación o enlace público. |

### `max chats mark-read`

marca el chat como leído; la otra persona lo ve

**Modifica datos en MAX.**

```sh
max chats mark-read <chat> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat: identificador o parte de su título. |

| Opción | Descripción |
|---|---|
| `--until <message>` | solo hasta este identificador de mensaje; hasta el más reciente por defecto. |

### `max chats leave`

sale de grupo o canal; los demás ven que saliste

**Modifica datos en MAX.**

```sh
max chats leave <chat>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |

### `max chats create`

crea grupo o canal; notifica a las personas añadidas

**Modifica datos en MAX.**

```sh
max chats create <title> [person] [options]
```

| Argumento || Descripción |
|---|---|---|
| `title` | obligatorio | nombre del grupo. |
| `person` | opcional | personas que añadir, por identificador o parte del nombre. |

| Opción | Descripción |
|---|---|
| `--channel` | canal privado en lugar de grupo; las personas entran mediante enlace. |

### `max chats members`

Participantes del grupo o canal; permite añadirlos o eliminarlos.

#### `max chats members list`

Miembros del grupo por páginas, con sus roles y última conexión.

```sh
max chats members list <chat> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |

| Opción | Descripción |
|---|---|
| `--limit <n>` | Cuántos mostrar. |
| `--page <n>` | Número de página, desde 1. |
| `--all` | Todas las filas, sin paginación. |

#### `max chats members add`

añade personas y les notifica

**Modifica datos en MAX.**

```sh
max chats members add <chat> <person> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |
| `person` | obligatorio | identificador o parte del nombre. |

| Opción | Descripción |
|---|---|
| `--history` | Los participantes añadidos también ven los mensajes anteriores a su incorporación. |

#### `max chats members remove`

elimina personas; conserva sus mensajes

**Modifica datos en MAX.**

```sh
max chats members remove <chat> <person>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |
| `person` | obligatorio | identificador o parte del nombre. |

### `max chats admins`

otorga o retira permisos de administrador a un miembro

#### `max chats admins add`

convierte a un miembro en administrador con estos permisos

**Modifica datos en MAX.**

```sh
max chats admins add <chat> <person> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |
| `person` | obligatorio | identificador o parte del nombre. |

| Opción | Descripción |
|---|---|
| `--can <rights>` | Permisos separados por comas: read, members, admins, info, pin, link, post, edit, delete. |

#### `max chats admins remove`

retira permisos de administrador; sigue siendo miembro

**Modifica datos en MAX.**

```sh
max chats admins remove <chat> <person>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |
| `person` | obligatorio | identificador o parte del nombre. |

### `max chats update`

cambia nombre, descripción o activa y desactiva ajustes del grupo o canal

**Modifica datos en MAX.**

```sh
max chats update <chat> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |

| Opción | Descripción |
|---|---|
| `--title <title>` | nombre nuevo. |
| `--description <text>` | descripción nueva. |
| `--all-can-pin <on\|off>` | permite fijar mensajes a todos los miembros. |
| `--only-admins-add <on\|off>` | solo administradores pueden añadir miembros. |
| `--only-admins-call <on\|off>` | Solo los administradores pueden iniciar llamadas. |
| `--only-owner-edits-info <on\|off>` | Solo el propietario puede cambiar el nombre y la foto. |
| `--members-see-link <on\|off>` | Los participantes pueden ver el enlace de invitación. |

### `max chats link`

enlace de invitación del grupo

#### `max chats link show`

enlace de invitación, si tienes permiso para verlo

```sh
max chats link show <chat>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |

#### `max chats link reset`

sustituye el enlace de invitación; el anterior deja de funcionar

**Modifica datos en MAX.**

```sh
max chats link reset <chat>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |

### `max chats folders`

tus carpetas de chats

#### `max chats folders list`

Carpetas de chats en el orden que muestra MAX.

```sh
max chats folders list
```

#### `max chats folders create`

crea una carpeta de chats

**Modifica datos en MAX.**

```sh
max chats folders create <title> [options]
```

| Argumento || Descripción |
|---|---|---|
| `title` | obligatorio | Nombre de la carpeta; la aplicación puede rechazar uno largo. |

| Opción | Descripción |
|---|---|
| `--chat <chat>` | chat que incluir, por identificador o nombre; repite la opción para añadir más. |

#### `max chats folders update`

renombra una carpeta o cambia los chats que contiene

**Modifica datos en MAX.**

```sh
max chats folders update <folder> [options]
```

| Argumento || Descripción |
|---|---|---|
| `folder` | obligatorio | identificador de carpeta o título exacto. |

| Opción | Descripción |
|---|---|
| `--title <title>` | nuevo nombre. |
| `--add <chat>` | añade un chat; repite la opción para incluir más. |
| `--remove <chat>` | quita un chat; repite la opción para quitar más. |

#### `max chats folders delete`

elimina la carpeta, conservando sus chats

**Modifica datos en MAX.**

```sh
max chats folders delete <folder>
```

| Argumento || Descripción |
|---|---|---|
| `folder` | obligatorio | identificador de carpeta o título exacto. |

### `max chats rules`

Reglas que utiliza `chats moderate` para revisar el grupo, guardadas en un archivo de este perfil.

#### `max chats rules show`

reglas del grupo; si no existen, muestra las predeterminadas como no guardadas

```sh
max chats rules show <chat>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |

#### `max chats rules set`

cambia una regla; el primer cambio guarda todas las reglas con sus valores predeterminados

**Solo modifica datos en este equipo.**

```sh
max chats rules set <chat> <key> <value>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |
| `key` | obligatorio | uno de: trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove. |
| `value` | obligatorio | Valor nuevo; las listas se separan con comas. |

#### `max chats rules unset`

restablece una regla a su valor predeterminado

**Solo modifica datos en este equipo.**

```sh
max chats rules unset <chat> <key>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |
| `key` | obligatorio | uno de: trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove. |

### `max chats moderate`

revisa mensajes y miembros nuevos según las reglas y ejecuta lo permitido

**Modifica datos en MAX.**

```sh
max chats moderate <chat> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |

| Opción | Descripción |
|---|---|
| `--since-time <time>` | Revisa lo posterior a esta fecha ISO 8601 o hace 2h / 1d; conserva el punto guardado. |
| `--dry-run` | Revisa y prepara un plan, sin actuar. |
| `--allow-dangerous` | Aprueba todas las acciones de nivel ask en las reglas del grupo. |
| `--max-actions <n>` | Máximo de acciones por ejecución; 10 si se omite. |

## `max contacts`

personas con las que tienes un chat individual

### `max contacts list`

personas con las que tienes un chat individual

```sh
max contacts list [options]
```

| Opción | Descripción |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | número de página, desde 1. |
| `--all` | todas las filas, sin paginar. |
| `--order <recent\|name>` | conversación más reciente primero o por orden alfabético. Predeterminado: `recent`. |
| `--search <text>` | solo personas cuyo nombre o @username contiene el texto. |

### `max contacts show`

una persona y los chats que compartís

```sh
max contacts show <person>
```

| Argumento || Descripción |
|---|---|---|
| `person` | obligatorio | identificador, @username o parte del nombre. |

### `max contacts sync`

Olvida el punto del último sincronizado y vuelve a obtener la lista completa.

```sh
max contacts sync
```

### `max contacts lookup`

Consulta a quién corresponde un teléfono en MAX; solicita el número o lo lee desde stdin.

```sh
max contacts lookup
```

### `max contacts add`

añade un contacto; `contacts list` sigue mostrando solo personas con un chat individual

**Modifica datos en MAX.**

```sh
max contacts add <person>
```

| Argumento || Descripción |
|---|---|---|
| `person` | obligatorio | identificador de persona, obtenido con `contacts lookup`, o parte de un nombre conocido. |

### `max contacts remove`

elimina un contacto; conserva el chat, pero puede perderse el nombre que le asignaste

**Modifica datos en MAX.**

```sh
max contacts remove <person>
```

| Argumento || Descripción |
|---|---|---|
| `person` | obligatorio | identificador de persona, obtenido con `contacts lookup`, o parte de un nombre conocido. |

### `max contacts block`

impide que una persona te escriba; no necesita ser contacto

**Modifica datos en MAX.**

```sh
max contacts block <person>
```

| Argumento || Descripción |
|---|---|---|
| `person` | obligatorio | identificador de persona, obtenido con `contacts lookup`, o parte de un nombre conocido. |

### `max contacts unblock`

permite que una persona bloqueada vuelva a escribirte

**Modifica datos en MAX.**

```sh
max contacts unblock <person>
```

| Argumento || Descripción |
|---|---|---|
| `person` | obligatorio | identificador de persona, obtenido con `contacts lookup`, o parte de un nombre conocido. |

### `max contacts rename`

asigna un nombre propio a una persona; solo tú lo ves

**Modifica datos en MAX.**

```sh
max contacts rename <person> <first-name> [last-name]
```

| Argumento || Descripción |
|---|---|---|
| `person` | obligatorio | identificador de persona, obtenido con `contacts lookup`, o parte de un nombre conocido. |
| `first-name` | obligatorio | el nombre con el que quieres verla. |
| `last-name` | opcional ||

### `max contacts import`

Sube números de teléfono a MAX y añade las personas correspondientes.

**Modifica datos en MAX.**

```sh
max contacts import <file>
```

| Argumento || Descripción |
|---|---|---|
| `file` | obligatorio | Una persona por línea: número, coma, tabulación o punto y coma, y nombre. |

## `max messages`

Lee y envía mensajes en un chat.

### `max messages list`

mensajes del chat, del más antiguo al más reciente

```sh
max messages list <chat> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat: identificador o parte de su título. |

| Opción | Descripción |
|---|---|
| `--limit <n>` | cuántos. |
| `--before-id <id>` | solo mensajes anteriores a este identificador. |
| `--before-time <time>` | solo mensajes anteriores a esta fecha ISO 8601 o intervalo anterior como 2h / 1d. |
| `--after-id <id>` | solo mensajes posteriores a este identificador. |
| `--after-time <time>` | solo mensajes posteriores a esta fecha ISO 8601 o intervalo anterior como 2h / 1d. |
| `--transcribe` | transcribe notas de voz pendientes mediante el servicio o un modelo local; puede tardar minutos. |
| `--model <id>` | modelo de voz descargado para --transcribe; `models audio list` muestra los disponibles. |
| `--mark-read` | también marca como leído hasta el mensaje más reciente mostrado; la otra persona lo ve. |

### `max messages search`

busca en lo leído, descargado o guardado por serve; nunca consulta el servicio

```sh
max messages search <query> [options]
```

| Argumento || Descripción |
|---|---|---|
| `query` | obligatorio | Consulta Lucene estricta: palabras, "frases", AND/OR/NOT, grupos de campos y rangos de fechas; --language legacy conserva la búsqueda anterior. |

| Opción | Descripción |
|---|---|
| `--chat <chat>` | Solo este chat, igual que chat: en la consulta; identificador o parte del título. |
| `--source <messenger>` | Todas las cuentas de este servicio guardadas, personal, bots o all; igual que in: en la consulta. |
| `--limit <n>` | Cuántos mostrar. |
| `--newest` | Más recientes primero en lugar de mejores coincidencias. |
| `--context <n>` | Mensajes anteriores y posteriores a cada resultado; 2 en terminal, 0 en otros casos. |
| `--language <lucene\|legacy>` | Lenguaje de consulta: Lucene estricto o búsqueda legacy. |
| `--timezone <zone>` | Zona horaria IANA para los límites de fechas del calendario. |
| `--regex` | Interpreta el texto como una expresión regular sin distinguir mayúsculas; comprueba todos los textos guardados. |

### `max messages show`

un mensaje por chat e identificador, o por localizador msg:

```sh
max messages show <chat> [message]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat por identificador o título parcial, o un localizador msg: sin identificador de mensaje después. |
| `message` | opcional | identificador del mensaje. |

### `max messages context`

un mensaje y su contexto anterior y posterior, antiguos primero

```sh
max messages context <chat> [message] [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat por identificador o título parcial, o un localizador msg: sin identificador de mensaje después. |
| `message` | opcional | identificador del mensaje. |

| Opción | Descripción |
|---|---|
| `--before-n <n>` | cuántos anteriores. Predeterminado: `5`. |
| `--after-n <n>` | cuántos posteriores. Predeterminado: `5`. |

### `max messages links`

enlaces que sitúan el mensaje en su conversación y cadena de respuestas hasta el inicio

```sh
max messages links <chat> <message>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat: identificador o parte de su título. |
| `message` | obligatorio | identificador del mensaje. |

### `max messages download`

Guarda fotos, archivos, vídeos y audios del mensaje en un directorio.

```sh
max messages download <chat> <message> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |
| `message` | obligatorio | identificador de mensaje. |

| Opción | Descripción |
|---|---|
| `--output <dir>` | Directorio donde guardarlos. Predeterminado: `.`. |

### `max messages transcribe`

Transcribe un mensaje de voz en este equipo: la grabación no se envía fuera.

```sh
max messages transcribe <chat> <message> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |
| `message` | obligatorio | Identificador de un mensaje de voz. |

| Opción | Descripción |
|---|---|
| `--model <id>` | Modelo de voz descargado que utilizar; `max models audio list` los muestra. |

### `max messages send`

envía texto; si omites [text], lo lee por stdin

**Modifica datos en MAX.**

```sh
max messages send <chat> [text] [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat: identificador o parte de su título. |
| `text` | opcional | el mensaje. |

| Opción | Descripción |
|---|---|
| `--topic <id>` | Envía a este tema del foro; no funciona en mensajeros que no admiten temas. |
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

### `max messages scheduled`

Mensajes programados del chat, desde el más próximo; cancélalos desde la aplicación MAX.

```sh
max messages scheduled <chat>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |

### `max messages edit`

cambia tu mensaje; puede que la otra persona ya haya leído el anterior

**Modifica datos en MAX.**

```sh
max messages edit <chat> <message> [text] [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat: identificador o parte de su título. |
| `message` | obligatorio | identificador de tu mensaje. |
| `text` | opcional | texto nuevo; si lo omites, se lee por stdin. |

| Opción | Descripción |
|---|---|
| `--md` | interpreta **negrita**, _cursiva_, \~\~tachado\~\~ y `code`; \ conserva una marca literal. |

### `max messages delete`

elimina mensajes solo para ti; con --for-everyone, para todos

**Modifica datos en MAX.**

```sh
max messages delete <chat> <messages> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat: identificador o parte de su título. |
| `messages` | obligatorio | identificadores de mensajes, máximo 10. |

| Opción | Descripción |
|---|---|
| `--for-everyone` | elimina para todos, no solo para ti; no se puede recuperar. |
| `--allow-dangerous` | omite la confirmación que el nivel ask exige antes de eliminar. |

### `max messages forward`

reenvía un mensaje a otro chat

**Modifica datos en MAX.**

```sh
max messages forward <chat> <message> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | El chat del mensaje: identificador o parte de su título. |
| `message` | obligatorio | identificador del mensaje. |

| Opción | Descripción |
|---|---|
| `--to <chat>` | Destino: un chat por identificador o parte de su título. |
| `--silent` | entrega sin notificar. |
| `--send-id <id>` | reintenta un reenvío de resultado desconocido sin arriesgar otra copia. |

### `max messages pin`

fija un mensaje sin aviso, salvo con --notify

**Modifica datos en MAX.**

```sh
max messages pin <chat> <message> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat: identificador o parte de su título. |
| `message` | obligatorio | identificador del mensaje. |

| Opción | Descripción |
|---|---|
| `--notify` | notifica a los miembros que se fijó el mensaje. |

### `max messages unpin`

deja de fijar un mensaje

**Modifica datos en MAX.**

```sh
max messages unpin <chat> <message>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat: identificador o parte de su título. |
| `message` | obligatorio | identificador del mensaje. |

## `max store`

archivo local de mensajes

### `max store status`

por chat: cantidad guardada, más antiguo y reciente, y tramos completos

```sh
max store status [chat]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | opcional | Un chat: identificador o parte de su título. |

### `max store fetch`

descarga el historial, recientes primero; repite para continuar

```sh
max store fetch <chat> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat: identificador o parte de su título. |

| Opción | Descripción |
|---|---|
| `--limit <n>` | Máximo de mensajes en esta ejecución; 1200 si se omite. |
| `--page-size <n>` | Mensajes por petición; 30 si se omite. |
| `--pause <duration>` | Pausa mínima entre páginas para respetar los límites del proveedor; cada pausa puede llegar al doble. Predeterminado: `5s`. |
| `--since-time <time>` | detiene al llegar a mensajes anteriores a esta fecha ISO 8601 o intervalo anterior como 2h / 1d. |
| `--last <n>` | detiene cuando ya contiene los n mensajes más recientes. |
| `--background` | ejecuta como tarea que continúa al finalizar el comando; consúltala con `store jobs show`. |
| `--estimate` | solo estima mensajes, peticiones y minutos pendientes usando el archivo local, sin peticiones. |

### `max store jobs`

descargas en segundo plano

#### `max store jobs list`

descargas en segundo plano, recientes primero

```sh
max store jobs list
```

#### `max store jobs show`

tarea indicada o la más reciente y datos de su chat ya guardados

```sh
max store jobs show [job]
```

| Argumento || Descripción |
|---|---|---|
| `job` | opcional | identificador que imprimió `store fetch --background`. |

#### `max store jobs cancel`

detiene la tarea tras la página actual; una descarga posterior reanuda desde ahí

```sh
max store jobs cancel <job>
```

| Argumento || Descripción |
|---|---|---|
| `job` | obligatorio | identificador de tarea. |

### `max store export`

mensajes guardados de un chat en líneas JSON, antiguos primero; nunca consulta el servicio

```sh
max store export <chat> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat: identificador o parte de su título. |

| Opción | Descripción |
|---|---|
| `--format <format>` | jsonl (predeterminado): mensaje por línea; markdown: transcripción por días con respuestas y reenvíos citados. |
| `--since-time <time>` | solo a partir de esta fecha ISO 8601 o intervalo anterior como 30m / 2h / 1d. |
| `--output <file>` | escribe líneas JSON o transcripción en un archivo nuevo, legible solo por ti. |

### `max store clear`

elimina del archivo los chats abandonados y sus mensajes

```sh
max store clear [options]
```

| Opción | Descripción |
|---|---|
| `--left` | chats que esta cuenta abandonó; es lo único que elimina. |
| `--allow-dangerous` | confirma la eliminación irreversible; no se pueden descargar de nuevo chats abandonados. |

### `max store info`

ruta, tamaño, esquema y filas del archivo local; no cambia nada

```sh
max store info
```

### `max store check`

comprueba integridad, índices de búsqueda, disco y chats desactualizados

```sh
max store check
```

### `max store migrate`

actualiza el esquema a esta versión y normaliza mensajes anteriores

```sh
max store migrate
```

### `max store reindex`

reconstruye índice de palabras y vocabulario de erratas sin perder mensajes

```sh
max store reindex
```

### `max store backup`

copia el archivo local mientras está en uso, sin sobrescribir

```sh
max store backup <file>
```

| Argumento || Descripción |
|---|---|---|
| `file` | obligatorio | archivo nuevo. |

### `max store restore`

restaura una copia; conserva al lado el archivo sustituido, sin eliminarlo

```sh
max store restore <file>
```

| Argumento || Descripción |
|---|---|---|
| `file` | obligatorio | archivo creado por `store backup`. |

## `max conversations`

conversaciones dentro de un chat, identificadas por respuestas, menciones y turnos de los mensajes guardados

### `max conversations build`

identifica conversaciones en el archivo local, sustituyendo el análisis anterior; nunca consulta el servicio

```sh
max conversations build [options]
```

| Opción | Descripción |
|---|---|
| `--chat <chat>` | Un chat: identificador o parte de su título. |

### `max conversations list`

conversaciones recientes primero: fecha, mensajes y participantes

```sh
max conversations list [options]
```

| Opción | Descripción |
|---|---|
| `--chat <chat>` | Un chat: identificador o parte de su título. |
| `--since-time <time>` | solo iniciadas a partir de esta fecha ISO 8601 o intervalo anterior como 30m / 2h / 1d. |
| `--limit <n>` | cuántos. |

### `max conversations show`

mensajes de una conversación, antiguos primero, por identificador o por un mensaje que contiene

```sh
max conversations show <conversation> [message]
```

| Argumento || Descripción |
|---|---|---|
| `conversation` | obligatorio | Un identificador de conversación de `conversations list`, o un chat por identificador o título parcial y un mensaje. |
| `message` | opcional | identificador de mensaje del chat; muestra la conversación que lo contiene. |

### `max conversations search`

conversaciones más próximas por significado y palabras, mejores primero, en uno o todos los chats; significado tras `conversations embed`, en este equipo

```sh
max conversations search <query> [options]
```

| Argumento || Descripción |
|---|---|---|
| `query` | obligatorio | qué buscar, con tus palabras, en un idioma que entienda el modelo. |

| Opción | Descripción |
|---|---|
| `--model <model>` | local: identificador de `models text list` (predeterminado: e5-small); remoto: modelo del proveedor. |
| `--provider <provider>` | calcula vectores mediante servicio con tu clave en lugar de localmente: openai. |
| `--base-url <url>` | servidor compatible con /v1/embeddings de OpenAI: Gemini, Jina, Ollama o LM Studio local. |
| `--dims <n>` | remoto: tamaño vectorial; necesario con --base-url y reduce el de modelos OpenAI. |
| `--chat <chat>` | Solo este chat, por identificador o título parcial. |
| `--since-time <time>` | solo conversaciones aún activas desde esta fecha ISO 8601 o intervalo anterior como 30m / 2h / 1d. |
| `--limit <n>` | cuántos. |

### `max conversations batches`

ventanas de mensajes para que tu agente identifique a qué mensaje anterior responde cada uno

#### `max conversations batches status`

mensajes pendientes de vincular, número de lotes y cantidad de texto

```sh
max conversations batches status [options]
```

| Opción | Descripción |
|---|---|
| `--chat <chat>` | Un chat: identificador o parte de su título. |
| `--size <n>` | mensajes que vincular por lote, 10–200; 50 por defecto. |

#### `max conversations batches next`

siguiente ventana con contexto previo; el texto solo se imprime por stdout

```sh
max conversations batches next [options]
```

| Opción | Descripción |
|---|---|
| `--chat <chat>` | Un chat: identificador o parte de su título. |
| `--size <n>` | mensajes que vincular por lote, 10–200; 50 por defecto. |

### `max conversations links`

respuestas de tu agente: a qué mensaje anterior responde cada mensaje del lote

#### `max conversations links add`

guarda la respuesta del agente desde JSON por stdin: { "model", "answers": [{ "message", "parent", "confidence" }] }; operación completa o nada

```sh
max conversations links add [options]
```

| Opción | Descripción |
|---|---|
| `--batch <id>` | identificador de lote que imprimió `conversations batches next`. |

#### `max conversations links clear`

elimina respuestas del agente de un chat o un modelo, sin tocar mensajes

```sh
max conversations links clear [options]
```

| Opción | Descripción |
|---|---|
| `--chat <chat>` | Un chat: identificador o parte de su título. |
| `--model <model>` | solo respuestas de este modelo. |

### `max conversations embed`

calcula vectores de cada fragmento de conversaciones para búsqueda semántica, localmente o con --provider y tu clave; puede reanudarse

```sh
max conversations embed [options]
```

| Opción | Descripción |
|---|---|
| `--chat <chat>` | Un chat: identificador o parte de su título. |
| `--model <model>` | local: identificador de `models text list` (predeterminado: e5-small); remoto: modelo del proveedor. |
| `--provider <provider>` | calcula vectores mediante servicio con tu clave en lugar de localmente: openai. |
| `--base-url <url>` | servidor compatible con /v1/embeddings de OpenAI: Gemini, Jina, Ollama o LM Studio local. |
| `--dims <n>` | remoto: tamaño vectorial; necesario con --base-url y reduce el de modelos OpenAI. |
| `--workers <n>` | local: sesiones paralelas, cada una con su copia del modelo (\~0,7 GB por copia). |
| `--threads <n>` | local: hilos totales (predeterminado: min(8, núcleos)). |
| `--concurrency <n>` | remoto: peticiones simultáneas (predeterminado: 4). |
| `--max-tokens <n>` | remoto: rechaza una ejecución que pueda enviar más tokens que este límite. |

#### `max conversations embed status`

fragmentos con vectores, pendientes y coste de los pendientes

```sh
max conversations embed status [options]
```

| Opción | Descripción |
|---|---|
| `--chat <chat>` | Un chat: identificador o parte de su título. |
| `--model <model>` | local: identificador de `models text list` (predeterminado: e5-small); remoto: modelo del proveedor. |
| `--provider <provider>` | calcula vectores mediante servicio con tu clave en lugar de localmente: openai. |
| `--base-url <url>` | servidor compatible con /v1/embeddings de OpenAI: Gemini, Jina, Ollama o LM Studio local. |
| `--dims <n>` | remoto: tamaño vectorial; necesario con --base-url y reduce el de modelos OpenAI. |

#### `max conversations embed clear`

elimina vectores de un chat o modelo, sin tocar mensajes ni conversaciones

```sh
max conversations embed clear [options]
```

| Opción | Descripción |
|---|---|
| `--chat <chat>` | Un chat: identificador o parte de su título. |
| `--model <model>` | local: identificador de `models text list` (predeterminado: e5-small); remoto: modelo del proveedor. |
| `--provider <provider>` | calcula vectores mediante servicio con tu clave en lugar de localmente: openai. |
| `--base-url <url>` | servidor compatible con /v1/embeddings de OpenAI: Gemini, Jina, Ollama o LM Studio local. |
| `--dims <n>` | remoto: tamaño vectorial; necesario con --base-url y reduce el de modelos OpenAI. |

## `max models`

modelos que se ejecutan en este equipo

### `max models audio`

modelos para transcribir voz

#### `max models audio list`

Modelos que puede usar max, cuáles están descargados y cuál es el predeterminado.

```sh
max models audio list
```

#### `max models audio download`

Descarga una vez un modelo de voz y verifica su sha256 esperado por esta versión de max.

```sh
max models audio download <model>
```

| Argumento || Descripción |
|---|---|---|
| `model` | obligatorio | Identificador de modelo de `max models audio list`. |

### `max models text`

modelos vectoriales para buscar conversaciones por significado

#### `max models text list`

modelos vectoriales, más adecuados primero, descargados y predeterminado

```sh
max models text list
```

#### `max models text download`

descarga un modelo vectorial y comprueba el sha256 esperado por la versión

```sh
max models text download <model> [options]
```

| Argumento || Descripción |
|---|---|---|
| `model` | obligatorio | identificador de `models text list`. |

| Opción | Descripción |
|---|---|
| `--accept-terms` | acepta las condiciones de licencia específicas del modelo. |

#### `max models text key`

clave API de un servicio vectorial para `conversations embed --provider`

#### `max models text key set`

guarda una clave introducida oculta o por stdin; nunca como argumento

```sh
max models text key set <provider>
```

| Argumento || Descripción |
|---|---|---|
| `provider` | obligatorio | openai o el servidor de --base-url que requiere una clave. |

#### `max models text key remove`

elimina una clave guardada

```sh
max models text key remove <provider>
```

| Argumento || Descripción |
|---|---|---|
| `provider` | obligatorio | openai o el nombre de host del servidor. |

## `max polls`

consulta, vota, cierra tus encuestas o crea una

### `max polls show`

encuesta e identificadores de respuestas según el mensaje actual

```sh
max polls show <chat> <message>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat: identificador o parte de su título. |
| `message` | obligatorio | identificador del mensaje de la encuesta. |

### `max polls vote`

vota o retira el voto; es visible salvo en encuestas anónimas

**Modifica datos en MAX.**

```sh
max polls vote <chat> <message> [answers] [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat: identificador o parte de su título. |
| `message` | obligatorio | identificador del mensaje de la encuesta. |
| `answers` | opcional | identificadores de respuestas tal como los muestra `polls show`. |

| Opción | Descripción |
|---|---|
| `--retract` | retira tu voto. |

### `max polls close`

cierra tu encuesta; no se puede votar ni reabrir

**Modifica datos en MAX.**

```sh
max polls close <chat> <message>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat: identificador o parte de su título. |
| `message` | obligatorio | identificador de tu mensaje con la encuesta. |

### `max polls create`

envía una encuesta como mensaje; pública salvo con --anonymous

**Modifica datos en MAX.**

```sh
max polls create <chat> <question> <answers> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat: identificador o parte de su título. |
| `question` | obligatorio | la pregunta. |
| `answers` | obligatorio | al menos dos respuestas. |

| Opción | Descripción |
|---|---|
| `--topic <id>` | Envía a este tema del foro; no funciona en mensajeros que no admiten temas. |
| `--multiple` | permite elegir varias respuestas. |
| `--anonymous` | oculta quién votó por cada opción. |
| `--revote` | permite cambiar el voto. |
| `--silent` | envía sin notificación. |
| `--send-id <id>` | reintenta crear una encuesta de resultado desconocido sin duplicarla. |

## `max reactions`

reacciones a mensajes

### `max reactions add`

añade tu reacción, sustituyendo la anterior

**Modifica datos en MAX.**

```sh
max reactions add <chat> <message> <emoji>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat: identificador o parte de su título. |
| `message` | obligatorio | identificador del mensaje. |
| `emoji` | obligatorio | un emoji, por ejemplo 👍. |

### `max reactions remove`

retira tu reacción

**Modifica datos en MAX.**

```sh
max reactions remove <chat> <message>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Un chat: identificador o parte de su título. |
| `message` | obligatorio | identificador del mensaje. |

## `max recipients`

chats permitidos para este perfil si la lista está activa

### `max recipients list`

chats de la lista; vacía e inactiva hasta añadir el primero

```sh
max recipients list
```

### `max recipients add`

permite enviar al chat; el primer añadido activa la lista

**Solo modifica datos en este equipo.**

```sh
max recipients add <chat>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | Identificador del chat o parte de su nombre. |

### `max recipients remove`

retira el permiso del chat; la lista sigue activa

**Solo modifica datos en este equipo.**

```sh
max recipients remove <chat>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador de chat o título tal como aparece en la lista. |

### `max recipients clear`

Vacía la lista y la desactiva: este perfil vuelve a poder enviar a cualquier chat.

**Solo modifica datos en este equipo.**

```sh
max recipients clear
```

## `max sends`

todos los intentos de envío del perfil, nunca el texto

### `max sends list`

intentos recientes primero: enviados, rechazados, fallidos o desconocidos

```sh
max sends list [options]
```

| Opción | Descripción |
|---|---|
| `--limit <n>` | cuántas mostrar. Predeterminado: `20`. |

## `max inbox`

mensajes ajenos sin leer en todos los chats; --new muestra los recibidos desde la última revisión

```sh
max inbox [options]
```

| Opción | Descripción |
|---|---|
| `--new` | lo recibido desde la revisión anterior, cada mensaje una vez; para tareas programadas. |
| `--since-time <time>` | lo recibido después de esta fecha ISO 8601 o intervalo anterior como 2h / 1d; conserva el punto guardado. |
| `--limit <n>` | máximo por chat, los más recientes. |
| `--all` | incluye silenciados y archivados; por defecto los omite salvo menciones o respuestas a ti. |
| `--transcribe` | transcribe notas de voz pendientes mediante el servicio o un modelo local; puede tardar minutos. |
| `--model <id>` | modelo de voz descargado para --transcribe; `models audio list` muestra los disponibles. |

## `max review`

mensajes, incluidos los tuyos, en chats con actividad desde un momento; para revisar compromisos

```sh
max review [options]
```

| Opción | Descripción |
|---|---|
| `--since-time <time>` | punto donde terminó la revisión anterior, en ISO 8601 o intervalo anterior como 2h / 1d; últimos 3 días por defecto. |
| `--chat <chat>` | Solo este chat, por identificador o título parcial. |
| `--unanswered [duration]` | solo preguntas para ti o administradores sin respuesta y anteriores a este intervalo: 4h, 1d; 24h por defecto. |
| `--all` | incluye silenciados y archivados; por defecto los omite salvo menciones o respuestas a ti. |
| `--transcribe` | transcribe notas de voz pendientes mediante el servicio o un modelo local; puede tardar minutos. |
| `--model <id>` | modelo de voz descargado para --transcribe; `models audio list` muestra los disponibles. |

## `max serve`

Mantiene la conexión con MAX y transmite mensajes nuevos a `max watch` hasta Ctrl-C.

```sh
max serve [options]
```

| Opción | Descripción |
|---|---|
| `--idle <duration>` | Se detiene tras este tiempo sin uso: 15m; 1h equivale a 60m. |

## `max server`

`max serve` en segundo plano: iniciar, detener, reiniciar, estado y registros; install añade una unidad systemd o launchd

### `max server start`

inicia serve en segundo plano mediante la unidad si existe y responde cuando se conecta

```sh
max server start [options]
```

| Opción | Descripción |
|---|---|
| `--idle <duration>` | Se detiene tras este tiempo sin uso: 15m, 1h. |

### `max server stop`

detiene serve de este perfil mediante su unidad, si la utiliza

```sh
max server stop
```

### `max server restart`

lo detiene y vuelve a iniciarlo

```sh
max server restart [options]
```

| Opción | Descripción |
|---|---|
| `--idle <duration>` | Se detiene tras este tiempo sin uso: 15m, 1h. |

### `max server status`

si serve está activo para el perfil, desde cuándo, quién lo inició y unidad si existe

```sh
max server status
```

### `max server logs`

últimos registros de serve, desde systemd o su archivo de registros

```sh
max server logs [options]
```

| Opción | Descripción |
|---|---|
| `-n, --lines <n>` | número de líneas. Predeterminado: `50`. |

### `max server install`

crea una unidad systemd o agente launchd para el perfil, sin iniciarlo

```sh
max server install
```

### `max server uninstall`

elimina la unidad del perfil; detenla primero

```sh
max server uninstall
```

## `max watch`

Muestra los mensajes nuevos conforme llegan, desde un `max serve` en ejecución.

```sh
max watch [options]
```

| Opción | Descripción |
|---|---|
| `--events` | También muestra ediciones, eliminaciones y reacciones; cada línea indica su evento. |

## `max config`

ajustes efectivos y origen de cada valor

### `max config show`

perfil, perfiles existentes y ajustes con su origen

```sh
max config show [options]
```

| Opción | Descripción |
|---|---|
| `--bot` | Configuración de los comandos `max bot` de este perfil, distinta de la cuenta personal. |

### `max config set`

guarda un ajuste en la configuración

**Solo modifica datos en este equipo.**

```sh
max config set <setting> <value> [options]
```

| Argumento || Descripción |
|---|---|---|
| `setting` | obligatorio | Uno de: limit, timeoutMs, color, record, keepRunsForDays, readOnly, allow, sendsPerHour, senderColors, serve, mcpTools, readOtherBots, updateCheck, skillHint, transcribeModel, defaultProfile. |
| `value` | obligatorio | número, true o false; para allow, lista como send,reaction. |

| Opción | Descripción |
|---|---|
| `--defaults` | cambia los valores de todos los perfiles en lugar de solo este. |
| `--personal` | solo cuentas personales, sección personal del archivo. |
| `--bot` | solo bots, sección bot del archivo. |

### `max config unset`

elimina un ajuste de la configuración

**Solo modifica datos en este equipo.**

```sh
max config unset <setting> [options]
```

| Argumento || Descripción |
|---|---|---|
| `setting` | obligatorio | Uno de: limit, timeoutMs, color, record, keepRunsForDays, readOnly, allow, sendsPerHour, senderColors, serve, mcpTools, readOtherBots, updateCheck, skillHint, transcribeModel, defaultProfile. |

| Opción | Descripción |
|---|---|
| `--defaults` | cambia los valores de todos los perfiles en lugar de solo este. |
| `--personal` | solo cuentas personales, sección personal del archivo. |
| `--bot` | solo bots, sección bot del archivo. |

## `max doctor`

Estado de esta instalación; no contacta con MAX salvo con --online.

```sh
max doctor [options]
```

| Opción | Descripción |
|---|---|
| `--online` | Inicia sesión una vez, lee un chat e inicia el servidor MCP; no envía nada. |

### `max doctor report`

Contenido y destino de un informe de problemas; no escribe nada.

#### `max doctor report create`

Escribe un informe de problemas en un archivo y explica cómo enviarlo.

```sh
max doctor report create [options]
```

| Opción | Descripción |
|---|---|
| `--run <id>` | ejecución que incluir; la última fallida por defecto. |
| `--output <file>` | destino; un archivo nuevo en la carpeta actual por defecto. |

## `max runs`

ejecuciones registradas: qué hizo la herramienta y cuándo

### `max runs list`

ejecuciones registradas, recientes primero

```sh
max runs list [options]
```

| Opción | Descripción |
|---|---|
| `--limit <n>` | cuántas mostrar. Predeterminado: `20`. |

### `max runs show`

Una ejecución: qué se hizo y una línea por operación.

```sh
max runs show <run-id>
```

| Argumento || Descripción |
|---|---|---|
| `run-id` | obligatorio | identificador de `max runs list`. |

### `max runs path`

directorio de una ejecución

```sh
max runs path <run-id>
```

| Argumento || Descripción |
|---|---|---|
| `run-id` | obligatorio | identificador de `max runs list`. |

## `max skill`

instrucciones para que un agente utilice la herramienta

### `max skill show`

imprime SKILL.md; `max skill install` lo coloca donde lo buscan Claude Code, Codex y Gemini CLI

```sh
max skill show
```

### `max skill install`

guarda SKILL.md en \~/.claude/skills/max-cli/ (Claude Code) y \~/.agents/skills/max-cli/ (Codex, Gemini CLI)

```sh
max skill install [options]
```

| Opción | Descripción |
|---|---|
| `--for <agents>` | agentes para los que instalar. Valores: `claude`, `agents`, `all`. Predeterminado: `all`. |

## `max commands`

comandos, opciones y códigos de salida en JSON, para agentes en lugar de --help

```sh
max commands
```

## `max upgrade`

actualiza max con su gestor de paquetes; --check solo comprueba

```sh
max upgrade [options]
```

| Opción | Descripción |
|---|---|
| `--check` | comprueba si hay nueva versión sin instalar nada. |

## `max complete`

autocompletado: `max complete zsh` imprime el script que debe cargarse

```sh
max complete [words]
```

| Argumento || Descripción |
|---|---|---|
| `words` | opcional ||

## `max mcp`

ofrece el perfil a un agente por MCP mediante stdin y stdout: `claude mcp add max -- max mcp`

```sh
max mcp [options]
```

| Opción | Descripción |
|---|---|
| `--allow-send` | Ofrece la herramienta de envío; sin ella el servidor solo permite leer. |
| `--confirm-send` | Muestra primero al propietario un formulario del servidor para cada escritura ofrecida: envíos, ediciones, reacciones y mcpTools. |
| `--allow-mark-read` | Ofrece la herramienta que marca un chat como leído; la otra persona lo ve. |
| `--allow-delete` | Ofrece la herramienta que elimina mensajes solo para ti; no se puede deshacer. |
| `--allow-moderate` | Permite que max_chats_check aplique las reglas del grupo, incluida la eliminación de mensajes ajenos o participantes cuando las reglas lo permiten. |

### `max mcp config`

imprime la entrada mcpServers para Claude Desktop, Cursor y otros con rutas completas, sin escribir

```sh
max mcp config [options]
```

| Opción | Descripción |
|---|---|
| `--allow-send` | Ofrece la herramienta de envío; sin ella el servidor solo permite leer. |
| `--confirm-send` | Muestra primero al propietario un formulario del servidor para cada escritura ofrecida: envíos, ediciones, reacciones y mcpTools. |
| `--allow-mark-read` | Ofrece la herramienta que marca un chat como leído; la otra persona lo ve. |
| `--allow-delete` | Ofrece la herramienta que elimina mensajes solo para ti; no se puede deshacer. |
| `--allow-moderate` | Permite que max_chats_check aplique las reglas del grupo, incluida la eliminación de mensajes ajenos o participantes cuando las reglas lo permiten. |

### `max mcp setup`

Añade el servidor MCP local de este perfil a Codex o Claude Code.

**Solo modifica datos en este equipo.**

```sh
max mcp setup <client> [options]
```

| Argumento || Descripción |
|---|---|---|
| `client` | obligatorio | codex o claude-code. |

| Opción | Descripción |
|---|---|
| `--allow-writes` | Reconoce que este perfil ofrece herramientas de escritura. |
| `--allow-send` | Ofrece la herramienta de envío; sin ella el servidor solo permite leer. |
| `--confirm-send` | Muestra primero al propietario un formulario del servidor para cada escritura ofrecida: envíos, ediciones, reacciones y mcpTools. |
| `--allow-mark-read` | Ofrece la herramienta que marca un chat como leído; la otra persona lo ve. |
| `--allow-delete` | Ofrece la herramienta que elimina mensajes solo para ti; no se puede deshacer. |
| `--allow-moderate` | Permite que max_chats_check aplique las reglas del grupo, incluida la eliminación de mensajes ajenos o participantes cuando las reglas lo permiten. |

### `max mcp doctor`

Comprueba la conexión MCP local de este perfil y su lista de herramientas.

```sh
max mcp doctor [options]
```

| Opción | Descripción |
|---|---|
| `--allow-send` | Ofrece la herramienta de envío; sin ella el servidor solo permite leer. |
| `--confirm-send` | Muestra primero al propietario un formulario del servidor para cada escritura ofrecida: envíos, ediciones, reacciones y mcpTools. |
| `--allow-mark-read` | Ofrece la herramienta que marca un chat como leído; la otra persona lo ve. |
| `--allow-delete` | Ofrece la herramienta que elimina mensajes solo para ti; no se puede deshacer. |
| `--allow-moderate` | Permite que max_chats_check aplique las reglas del grupo, incluida la eliminación de mensajes ajenos o participantes cuando las reglas lo permiten. |

## `max bot`

bot de MAX mediante la Bot API oficial y un token, independiente de tu cuenta personal

### `max bot auth`

token del bot de este perfil

#### `max bot auth set`

valida el token con MAX y lo guarda; se introduce oculto o por stdin

**Solo modifica datos en este equipo.**

```sh
max bot auth set
```

#### `max bot auth show`

origen del token del perfil y bot al que pertenece

```sh
max bot auth show
```

#### `max bot auth remove`

elimina el token de bot del perfil

**Solo modifica datos en este equipo.**

```sh
max bot auth remove
```

### `max bot list`

nombres del equipo con token de bot; --check consulta a MAX qué bot es cada uno

```sh
max bot list [options]
```

| Opción | Descripción |
|---|---|
| `--check` | consulta al servicio qué bot es cada uno mediante su token. |

### `max bot chats`

chats del bot; MAX no proporciona su lista, por lo que `list` muestra solo los vistos

#### `max bot chats list`

chats que el bot ha visto en este equipo, no una lista completa de MAX

```sh
max bot chats list
```

#### `max bot chats show`

consulta un chat de MAX y lo recuerda

```sh
max bot chats show <chat>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |

#### `max bot chats leave`

saca el bot del chat; solo un administrador puede volver a añadirlo

**Modifica datos en MAX.**

```sh
max bot chats leave <chat>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador o título de un chat visto por el bot. |

#### `max bot chats action`

muestra durante segundos la acción del bot, como escribir o enviar foto

**Modifica datos en MAX.**

```sh
max bot chats action <chat> <action>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |
| `action` | obligatorio | acción visible. Valores: `typing`, `photo`, `video`, `voice`, `file`. |

#### `max bot chats admins`

administradores de un chat donde el bot es administrador

#### `max bot chats admins list`

administradores y permisos de cada uno

```sh
max bot chats admins list <chat>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador o título de un chat visto por el bot. |

#### `max bot chats admins add`

convierte a un miembro en administrador con estos permisos

**Modifica datos en MAX.**

```sh
max bot chats admins add <chat> <person> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador o título de un chat visto por el bot. |
| `person` | obligatorio | identificador de usuario de la persona. |

| Opción | Descripción |
|---|---|
| `--can <rights>` | Permisos separados por comas: read, members, admins, info, pin, link, edit, delete. |
| `--title <title>` | título mostrado junto al nombre. |

#### `max bot chats admins remove`

retira permisos de administrador; sigue siendo miembro

**Modifica datos en MAX.**

```sh
max bot chats admins remove <chat> <person>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador o título de un chat visto por el bot. |
| `person` | obligatorio | identificador de usuario de la persona. |

#### `max bot chats members`

personas de un chat donde el bot es administrador

#### `max bot chats members remove`

elimina una persona del chat, conservando sus mensajes

**Modifica datos en MAX.**

```sh
max bot chats members remove <chat> <person> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador o título de un chat visto por el bot. |
| `person` | obligatorio | identificador de usuario de la persona. |

| Opción | Descripción |
|---|---|
| `--block` | también impide que vuelva mediante el enlace del chat. |

#### `max bot chats members list`

Participantes del chat por páginas; --marker recibe el `marker` devuelto por la página anterior.

```sh
max bot chats members list <chat> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio ||

| Opción | Descripción |
|---|---|
| `--limit <n>` | Cantidad, hasta 100. |
| `--marker <marker>` | Continúa desde este punto. |

#### `max bot chats members add`

Añade personas al chat por identificador; el bot debe ser administrador con permiso para añadir participantes.

**Modifica datos en MAX.**

```sh
max bot chats members add <chat> <users>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio ||
| `users` | obligatorio ||

#### `max bot chats rules`

reglas de moderación del bot, guardadas en este equipo

#### `max bot chats rules show`

reglas del chat; sin reglas guardadas, muestra las predeterminadas como no guardadas

```sh
max bot chats rules show <chat>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador de grupo o título de un grupo visto por el bot. |

#### `max bot chats rules set`

cambia una regla: trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove

**Solo modifica datos en este equipo.**

```sh
max bot chats rules set <chat> <key> <value>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador de grupo o título de un grupo visto por el bot. |
| `key` | obligatorio | la regla. |
| `value` | obligatorio | nuevo valor. |

#### `max bot chats rules unset`

restablece una regla a su valor predeterminado

**Solo modifica datos en este equipo.**

```sh
max bot chats rules unset <chat> <key>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador de grupo o título de un grupo visto por el bot. |
| `key` | obligatorio | la regla. |

#### `max bot chats moderate`

revisa como bot mensajes y entradas nuevos según las reglas y ejecuta lo permitido

**Modifica datos en MAX.**

```sh
max bot chats moderate <chat> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador de grupo o título de un grupo visto por el bot. |

| Opción | Descripción |
|---|---|
| `--since-time <time>` | revisa desde esta fecha ISO 8601 o intervalo anterior como 2h / 1d; no cambia el punto guardado. |
| `--dry-run` | revisa y prepara un plan, sin actuar. |
| `--allow-dangerous` | aprueba todas las acciones con nivel ask en las reglas del grupo. |
| `--no-ban` | elimina sin bloquear; por defecto la persona eliminada no puede volver por enlace. |
| `--max-actions <n>` | máximo de acciones por ejecución; 10 por defecto. |

### `max bot messages`

mensajes de los chats del bot

#### `max bot messages send`

envía como bot; sin [text], lee por stdin

**Modifica datos en MAX.**

```sh
max bot messages send <chat> [text] [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |
| `text` | opcional | el mensaje. |

| Opción | Descripción |
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

#### `max bot messages list`

mensajes recientes; si MAX no ofrece historial al bot o con --offline, solo los vistos en este equipo

```sh
max bot messages list <chat> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |

| Opción | Descripción |
|---|---|
| `--limit <n>` | cuántos, los más recientes. |

#### `max bot messages show`

mensaje por identificador dentro del chat

```sh
max bot messages show <chat> <message>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |
| `message` | obligatorio | identificador de mensaje. |

#### `max bot messages edit`

sustituye el texto de un mensaje del bot

**Modifica datos en MAX.**

```sh
max bot messages edit <chat> <message> <text> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |
| `message` | obligatorio | identificador de mensaje. |
| `text` | obligatorio | texto nuevo. |

| Opción | Descripción |
|---|---|
| `--md` | interpreta **negrita**, _cursiva_, \~\~tachado\~\~ y `code`; \ conserva una marca literal. |
| `--html` | texto HTML: <b>, <i>, <a href>, <code>. |

#### `max bot messages delete`

elimina mensajes donde el bot tiene permiso; irreversible

**Modifica datos en MAX.**

```sh
max bot messages delete <chat> <messages> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |
| `messages` | obligatorio | identificadores de mensajes. |

| Opción | Descripción |
|---|---|
| `--allow-dangerous` | elimina sin preguntar. |

#### `max bot messages pin`

fija sin aviso salvo con --notify

**Modifica datos en MAX.**

```sh
max bot messages pin <chat> <message> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |
| `message` | obligatorio | identificador de mensaje. |

| Opción | Descripción |
|---|---|
| `--notify` | avisa a los miembros. |

#### `max bot messages unpin`

deja de fijar un mensaje

**Modifica datos en MAX.**

```sh
max bot messages unpin <chat> <message>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador de chat, user:<id> para personas o título de un chat visto por el bot. |
| `message` | obligatorio | identificador de mensaje. |

#### `max bot messages search`

busca solo en la copia local del bot, mejores coincidencias primero; todas las palabras; admite "a phrase", -word, a OR b, from: chat: after: before: has:. Por texto, --from o ambos

```sh
max bot messages search [query] [options]
```

| Argumento || Descripción |
|---|---|---|
| `query` | opcional | palabras que buscar. |

| Opción | Descripción |
|---|---|
| `--all-bots` | también lee las copias de otros bots permitidas por readOtherBots. |
| `--bots <profiles>` | también lee estos bots, separados por comas; todos deben estar permitidos por readOtherBots. |
| `--limit <n>` | cuántos. |
| `--newest` | recientes primero en lugar de mejores coincidencias. |
| `--from <who>` | solo mensajes de esta persona, por identificador, @username o nombre parcial; repite para incluir varias. |

#### `max bot messages between`

mensajes de dos o más personas en chats donde todas han escrito, según copia local, agrupados por chat y antiguos primero; --limit cuenta por chat. Los chats comunes se deducen de lo guardado, no de listas de miembros de MAX

```sh
max bot messages between <people> [options]
```

| Argumento || Descripción |
|---|---|---|
| `people` | obligatorio | al menos dos personas, cada una por identificador, @username o nombre parcial. |

| Opción | Descripción |
|---|---|
| `--all-bots` | también lee las copias de otros bots permitidas por readOtherBots. |
| `--bots <profiles>` | también lee estos bots, separados por comas; todos deben estar permitidos por readOtherBots. |
| `--limit <n>` | cantidad de mensajes recientes por chat. |

### `max bot recipients`

chats permitidos para el bot; sin lista se permiten todos; `clear` elimina la lista

#### `max bot recipients list`

chats de la lista o nada si no existe

```sh
max bot recipients list
```

#### `max bot recipients add`

permite un chat por identificador, `user:<id>` o título de un chat visto por este bot

**Solo modifica datos en este equipo.**

```sh
max bot recipients add <chat>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio ||

#### `max bot recipients remove`

quita un chat de la lista

**Solo modifica datos en este equipo.**

```sh
max bot recipients remove <chat>
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio ||

#### `max bot recipients clear`

elimina la lista; el bot puede escribir de nuevo a cualquier chat

**Solo modifica datos en este equipo.**

```sh
max bot recipients clear
```

### `max bot sends`

envíos, ediciones y eliminaciones del bot desde este equipo; identificadores y resultados, nunca texto

#### `max bot sends list`

```sh
max bot sends list
```

### `max bot watch`

imprime y guarda mensajes nuevos hasta Ctrl-C o --timeout; ambos finalizan normalmente

```sh
max bot watch [options]
```

| Opción | Descripción |
|---|---|
| `--events` | incluye ediciones, eliminaciones, botones y entradas y salidas; cada línea indica el evento. |
| `--types <types>` | tipos de actualización separados por comas, con los nombres del servicio. |

### `max bot callbacks`

respuestas a botones bajo los mensajes del bot

#### `max bot callbacks answer`

responde por identificador callback; --notification muestra un aviso solo a la persona, --text cambia el mensaje del botón

**Modifica datos en MAX.**

```sh
max bot callbacks answer <callback> [options]
```

| Argumento || Descripción |
|---|---|---|
| `callback` | obligatorio | identificador callback de `bot watch`. |

| Opción | Descripción |
|---|---|
| `--text <text>` | texto nuevo del mensaje. |
| `--notification <text>` | aviso que solo ve quien pulsó. |

### `max bot commands`

menú de comandos del bot, visible después de /

#### `max bot commands list`

comandos actuales del menú

```sh
max bot commands list
```

#### `max bot commands set`

sustituye todo el menú; cada comando como name=description, por ejemplo start=Begin

**Modifica datos en MAX.**

```sh
max bot commands set <commands>
```

| Argumento || Descripción |
|---|---|---|
| `commands` | obligatorio | name=description, uno por comando. |

#### `max bot commands clear`

vacía el menú

**Modifica datos en MAX.**

```sh
max bot commands clear
```

### `max bot webhooks`

destino de actualizaciones del servicio; si está configurado, `bot watch` no recibe nada

#### `max bot webhooks list`

webhooks del bot

```sh
max bot webhooks list
```

#### `max bot webhooks set`

envía actualizaciones a HTTPS; rechaza si ya hay otro configurado

**Modifica datos en MAX.**

```sh
max bot webhooks set <url> [options]
```

| Argumento || Descripción |
|---|---|---|
| `url` | obligatorio | dirección HTTPS. |

| Opción | Descripción |
|---|---|
| `--types <types>` | tipos de actualización separados por comas, con los nombres del servicio. |
| `--secret-stdin` | secreto que el servicio devuelve con cada actualización; se solicita o lee por stdin. |
| `--add` | Conserva los webhooks existentes y añade este junto a ellos. |

#### `max bot webhooks delete`

deja de enviar a esa dirección; sin webhooks, `bot watch` funciona de nuevo

**Modifica datos en MAX.**

```sh
max bot webhooks delete <url>
```

| Argumento || Descripción |
|---|---|---|
| `url` | obligatorio | dirección. |

### `max bot contacts`

personas cuyos mensajes vio el bot, desde la copia local, sin consultar MAX salvo indicación

#### `max bot contacts show`

persona, chats donde escribió con su último mensaje y mensajes recientes de su chat privado con el bot

```sh
max bot contacts show <who> [options]
```

| Argumento || Descripción |
|---|---|---|
| `who` | obligatorio | identificador, @username o nombre parcial. |

| Opción | Descripción |
|---|---|
| `--all-bots` | también lee las copias de otros bots permitidas por readOtherBots. |
| `--bots <profiles>` | también lee estos bots, separados por comas; todos deben estar permitidos por readOtherBots. |
| `--limit <n>` | cantidad de mensajes del chat privado. |
| `--refresh` | vuelve a consultar primero el chat privado desde el servicio; una petición. |

### `max bot store`

Copia local del bot en este equipo.

#### `max bot store fetch`

Descarga el historial del chat a la copia local del bot, desde lo más reciente; repite el comando para continuar.

```sh
max bot store fetch <chat> [options]
```

| Argumento || Descripción |
|---|---|---|
| `chat` | obligatorio | identificador o título de un chat visto por el bot. |

| Opción | Descripción |
|---|---|
| `--limit <n>` | máximo de mensajes por ejecución; 1000 por defecto. |
| `--page-size <n>` | mensajes por petición; 100 por defecto. |
| `--pause <duration>` | Pausa entre páginas para respetar los límites del mensajero. Predeterminado: `1s`. |
| `--since-time <time>` | detiene al llegar a mensajes anteriores a esta fecha ISO 8601 o intervalo anterior como 2h / 1d. |
| `--last <n>` | detiene cuando ya contiene los n mensajes más recientes. |

### `max bot mcp`

ofrece el bot por MCP mediante stdin y stdout: `claude mcp add sales-bot -- max sales bot mcp`

```sh
max bot mcp [options]
```

| Opción | Descripción |
|---|---|
| `--confirm-send` | muestra al propietario un formulario antes de cada escritura. |
| `--allow-dangerous` | sin formulario antes de eliminar si el nivel es ask. |
| `--allow-send` | obsoleta: deciden los permisos del perfil; se conserva para compatibilidad. |
| `--allow-delete` | obsoleta: deciden los permisos del perfil. |
| `--allow-moderate` | obsoleta: deciden los permisos del perfil. |

#### `max bot mcp config`

imprime la entrada mcpServers para Claude Desktop, Cursor y otros con rutas completas, sin escribir

```sh
max bot mcp config [options]
```

| Opción | Descripción |
|---|---|
| `--confirm-send` | muestra al propietario un formulario antes de cada escritura. |
| `--allow-dangerous` | sin formulario antes de eliminar si el nivel es ask. |
| `--allow-send` | obsoleta: deciden los permisos del perfil; se conserva para compatibilidad. |
| `--allow-delete` | obsoleta: deciden los permisos del perfil. |
| `--allow-moderate` | obsoleta: deciden los permisos del perfil. |

### `max bot me`

El bot al que pertenece el token del perfil: nombre, identificador, descripción y comandos.

```sh
max bot me
```

### `max bot comments`

Comentarios de una publicación del canal: cada comando recibe primero el identificador de la publicación (mid.…).

#### `max bot comments list`

Comentarios de una publicación, los más recientes al final.

```sh
max bot comments list <message> [options]
```

| Argumento || Descripción |
|---|---|---|
| `message` | obligatorio ||

| Opción | Descripción |
|---|---|
| `--limit <n>` | Cantidad, hasta 100. |

#### `max bot comments get`

Un comentario de una publicación.

```sh
max bot comments get <message> <comment>
```

| Argumento || Descripción |
|---|---|---|
| `message` | obligatorio ||
| `comment` | obligatorio ||

#### `max bot comments send`

Comenta una publicación como bot; - lee stdin.

**Modifica datos en MAX.**

```sh
max bot comments send <message> <text> [options]
```

| Argumento || Descripción |
|---|---|---|
| `message` | obligatorio ||
| `text` | obligatorio ||

| Opción | Descripción |
|---|---|
| `--format <format>` | Formato del texto. Valores: `markdown`, `html`. |

#### `max bot comments edit`

Reemplaza el texto de un comentario del bot; - lee stdin.

**Modifica datos en MAX.**

```sh
max bot comments edit <message> <comment> <text> [options]
```

| Argumento || Descripción |
|---|---|---|
| `message` | obligatorio ||
| `comment` | obligatorio ||
| `text` | obligatorio ||

| Opción | Descripción |
|---|---|
| `--format <format>` | Formato del texto. Valores: `markdown`, `html`. |

#### `max bot comments delete`

Elimina un comentario de una publicación.

**Modifica datos en MAX.**

```sh
max bot comments delete <message> <comment>
```

| Argumento || Descripción |
|---|---|---|
| `message` | obligatorio ||
| `comment` | obligatorio ||

### `max bot uploads`

Archivos subidos a MAX para adjuntarlos a un mensaje.

#### `max bot uploads put`

Sube un archivo del disco y muestra el adjunto para `attachments`; `messages send --file` realiza ambos pasos.

**Modifica datos en MAX.**

```sh
max bot uploads put <file> [options]
```

| Argumento || Descripción |
|---|---|---|
| `file` | obligatorio ||

| Opción | Descripción |
|---|---|
| `--type <type>` | Usa este tipo en lugar de deducirlo por la extensión. Valores: `image`, `video`, `audio`, `file`. |

### `max bot api`

Todas las operaciones de la API oficial de bots, generadas desde su esquema: docs/dev/bot-api-coverage.md.

#### `max bot api get-my-info`

Consultar datos del bot actual — lectura (GET /me)

```sh
max bot api get-my-info
```

#### `max bot api edit-my-commands`

Editar comandos del bot actual — escritura (PATCH /me/commands)

**Modifica datos en MAX.**

```sh
max bot api edit-my-commands [options]
```

| Opción | Descripción |
|---|---|
| `--body <json>` | Cuerpo de la petición como JSON; - lo lee desde stdin. |
| `--body-file <path>` | Cuerpo de la petición desde un archivo JSON; - indica stdin. |

#### `max bot api get-chat`

Consultar chat — lectura (GET /chats/{chatId})

```sh
max bot api get-chat [options]
```

| Opción | Descripción |
|---|---|
| `--chat-id <value>` | Identificador del chat o canal solicitado. |

#### `max bot api edit-chat`

Editar datos del chat o canal — escritura (PATCH /chats/{chatId})

**Modifica datos en MAX.**

```sh
max bot api edit-chat [options]
```

| Opción | Descripción |
|---|---|
| `--chat-id <value>` | Identificador del chat o canal. |
| `--body <json>` | Cuerpo de la petición como JSON; - lo lee desde stdin. |
| `--body-file <path>` | Cuerpo de la petición desde un archivo JSON; - indica stdin. |

#### `max bot api send-action`

Enviar acción — escritura (POST /chats/{chatId}/actions)

**Modifica datos en MAX.**

```sh
max bot api send-action [options]
```

| Opción | Descripción |
|---|---|
| `--chat-id <value>` | Identificador del chat. |
| `--body <json>` | Cuerpo de la petición como JSON; - lo lee desde stdin. |
| `--body-file <path>` | Cuerpo de la petición desde un archivo JSON; - indica stdin. |

#### `max bot api get-pinned-message`

Consultar mensaje fijado — lectura (GET /chats/{chatId}/pin)

```sh
max bot api get-pinned-message [options]
```

| Opción | Descripción |
|---|---|
| `--chat-id <value>` | Identificador del chat cuyo mensaje fijado quieres consultar. |

#### `max bot api pin-message`

Fijar mensaje — escritura (PUT /chats/{chatId}/pin)

**Modifica datos en MAX.**

```sh
max bot api pin-message [options]
```

| Opción | Descripción |
|---|---|
| `--chat-id <value>` | Identificador del chat donde se fijará el mensaje. |
| `--body <json>` | Cuerpo de la petición como JSON; - lo lee desde stdin. |
| `--body-file <path>` | Cuerpo de la petición desde un archivo JSON; - indica stdin. |

#### `max bot api unpin-message`

Desfijar mensaje — escritura (DELETE /chats/{chatId}/pin)

**Modifica datos en MAX.**

```sh
max bot api unpin-message [options]
```

| Opción | Descripción |
|---|---|
| `--chat-id <value>` | Identificador del chat cuyo mensaje quieres desfijar. |

#### `max bot api get-membership`

Consultar la pertenencia del bot al chat o canal — lectura (GET /chats/{chatId}/members/me)

```sh
max bot api get-membership [options]
```

| Opción | Descripción |
|---|---|
| `--chat-id <value>` | Identificador del chat o canal. |

#### `max bot api leave-chat`

Salir del chat — destructivo (DELETE /chats/{chatId}/members/me)

**Modifica datos en MAX.**

```sh
max bot api leave-chat [options]
```

| Opción | Descripción |
|---|---|
| `--chat-id <value>` | Identificador del chat o canal. |

#### `max bot api get-admins`

Consultar administradores del chat o canal — lectura (GET /chats/{chatId}/members/admins)

```sh
max bot api get-admins [options]
```

| Opción | Descripción |
|---|---|
| `--chat-id <value>` | Identificador del chat o canal. |

#### `max bot api post-admins`

Asignar administradores del chat o canal — escritura (POST /chats/{chatId}/members/admins)

**Modifica datos en MAX.**

```sh
max bot api post-admins [options]
```

| Opción | Descripción |
|---|---|
| `--chat-id <value>` | Identificador del chat o canal. |
| `--body <json>` | Cuerpo de la petición como JSON; - lo lee desde stdin. |
| `--body-file <path>` | Cuerpo de la petición desde un archivo JSON; - indica stdin. |

#### `max bot api delete-admins`

Revocar permisos de administrador — escritura (DELETE /chats/{chatId}/members/admins/{userId})

**Modifica datos en MAX.**

```sh
max bot api delete-admins [options]
```

| Opción | Descripción |
|---|---|
| `--chat-id <value>` | Identificador del chat o canal. |
| `--user-id <value>` | Identificador del usuario. |

#### `max bot api get-members`

Consultar participantes — lectura (GET /chats/{chatId}/members)

```sh
max bot api get-members [options]
```

| Opción | Descripción |
|---|---|
| `--chat-id <value>` | Identificador del chat o canal. |
| `--user-ids <value>` | Identificadores de usuarios separados por comas para consultar su pertenencia al chat. Si se proporciona este parámetro, se ignoran `count` y `marker`. |
| `--marker <value>` | Marcador. |
| `--count <value>` | Cantidad. |

#### `max bot api add-members`

Añadir participantes — escritura (POST /chats/{chatId}/members)

**Modifica datos en MAX.**

```sh
max bot api add-members [options]
```

| Opción | Descripción |
|---|---|
| `--chat-id <value>` | Identificador del chat. |
| `--body <json>` | Cuerpo de la petición como JSON; - lo lee desde stdin. |
| `--body-file <path>` | Cuerpo de la petición desde un archivo JSON; - indica stdin. |

#### `max bot api remove-member`

Eliminar participante — escritura (DELETE /chats/{chatId}/members)

**Modifica datos en MAX.**

```sh
max bot api remove-member [options]
```

| Opción | Descripción |
|---|---|
| `--chat-id <value>` | Identificador del chat o canal. |
| `--user-id <value>` | Identificador del usuario que eliminar del chat o canal. |
| `--block <value>` | Pon `true` para bloquear al usuario en el chat. |

#### `max bot api get-subscriptions`

Consultar suscripciones — lectura (GET /subscriptions)

```sh
max bot api get-subscriptions
```

#### `max bot api subscribe`

Suscribirse — escritura (POST /subscriptions)

**Modifica datos en MAX.**

```sh
max bot api subscribe [options]
```

| Opción | Descripción |
|---|---|
| `--body <json>` | Cuerpo de la petición como JSON; - lo lee desde stdin. |
| `--body-file <path>` | Cuerpo de la petición desde un archivo JSON; - indica stdin. |

#### `max bot api unsubscribe`

Cancelar suscripción — escritura (DELETE /subscriptions)

**Modifica datos en MAX.**

```sh
max bot api unsubscribe [options]
```

| Opción | Descripción |
|---|---|
| `--url <value>` | URL que eliminar de las suscripciones WebHook. |

#### `max bot api get-upload-url`

Obtener URL de subida — escritura (POST /uploads)

**Modifica datos en MAX.**

```sh
max bot api get-upload-url [options]
```

| Opción | Descripción |
|---|---|
| `--type <value>` | Tipo de archivo subido: image, audio, video, file. |

#### `max bot api get-messages`

Consultar mensajes — lectura (GET /messages)

```sh
max bot api get-messages [options]
```

| Opción | Descripción |
|---|---|
| `--chat-id <value>` | Identificador del chat o canal del que obtener mensajes. |
| `--message-ids <value>` | Identificadores de mensajes que consultar, separados por comas. |
| `--from <value>` | Hora inicial de los mensajes solicitados; utiliza after en su lugar. |
| `--to <value>` | Hora final de los mensajes solicitados; utiliza before en su lugar. |
| `--before <value>` | Mensajes anteriores a esta marca de tiempo. |
| `--after <value>` | Mensajes posteriores a esta marca de tiempo. |
| `--count <value>` | Número máximo de mensajes en la respuesta. |

#### `max bot api send-message`

Enviar mensaje — escritura (POST /messages)

**Modifica datos en MAX.**

```sh
max bot api send-message [options]
```

| Opción | Descripción |
|---|---|
| `--user-id <value>` | Proporciónalo para enviar el mensaje a un usuario. |
| `--chat-id <value>` | Proporciónalo para enviar el mensaje a un chat o canal. |
| `--disable-link-preview <value>` | Si es `false`, el servidor no genera vistas previas para los enlaces del texto. |
| `--body <json>` | Cuerpo de la petición como JSON; - lo lee desde stdin. |
| `--body-file <path>` | Cuerpo de la petición desde un archivo JSON; - indica stdin. |

#### `max bot api edit-message`

Editar mensaje — escritura (PUT /messages)

**Modifica datos en MAX.**

```sh
max bot api edit-message [options]
```

| Opción | Descripción |
|---|---|
| `--message-id <value>` | Identificador del mensaje que editar. |
| `--body <json>` | Cuerpo de la petición como JSON; - lo lee desde stdin. |
| `--body-file <path>` | Cuerpo de la petición desde un archivo JSON; - indica stdin. |

#### `max bot api delete-message`

Eliminar mensaje — destructivo (DELETE /messages)

**Modifica datos en MAX.**

```sh
max bot api delete-message [options]
```

| Opción | Descripción |
|---|---|
| `--message-id <value>` | Identificador del mensaje que eliminar. |

#### `max bot api get-message-by-id`

Consultar mensaje — lectura (GET /messages/{messageId})

```sh
max bot api get-message-by-id [options]
```

| Opción | Descripción |
|---|---|
| `--message-id <value>` | Identificador (`mid`) del mensaje que consultar en el chat o canal. |

#### `max bot api get-comments`

Consultar comentarios — lectura (GET /messages/{messageId}/comments)

```sh
max bot api get-comments [options]
```

| Opción | Descripción |
|---|---|
| `--message-id <value>` | Identificador (`mid`) del mensaje comentado. |
| `--comment-ids <value>` | Identificadores de comentarios que consultar, separados por comas. |
| `--before <value>` | Comentarios anteriores a esta marca de tiempo. |
| `--after <value>` | Comentarios posteriores a esta marca de tiempo. |
| `--count <value>` | Número máximo de comentarios en la respuesta. |

#### `max bot api send-comment`

Enviar comentario — escritura (POST /messages/{messageId}/comments)

**Modifica datos en MAX.**

```sh
max bot api send-comment [options]
```

| Opción | Descripción |
|---|---|
| `--message-id <value>` | Identificador (`mid`) del mensaje comentado. |
| `--disable-link-preview <value>` | Si es `false`, el servidor no genera vistas previas para los enlaces del texto. |
| `--body <json>` | Cuerpo de la petición como JSON; - lo lee desde stdin. |
| `--body-file <path>` | Cuerpo de la petición desde un archivo JSON; - indica stdin. |

#### `max bot api edit-comment`

Editar comentario — escritura (PUT /messages/{messageId}/comments)

**Modifica datos en MAX.**

```sh
max bot api edit-comment [options]
```

| Opción | Descripción |
|---|---|
| `--message-id <value>` | Identificador (`mid`) del mensaje comentado. |
| `--comment-id <value>` | Identificador del comentario que editar. |
| `--body <json>` | Cuerpo de la petición como JSON; - lo lee desde stdin. |
| `--body-file <path>` | Cuerpo de la petición desde un archivo JSON; - indica stdin. |

#### `max bot api delete-comment`

Eliminar comentario — destructivo (DELETE /messages/{messageId}/comments)

**Modifica datos en MAX.**

```sh
max bot api delete-comment [options]
```

| Opción | Descripción |
|---|---|
| `--message-id <value>` | Identificador (`mid`) del mensaje comentado. |
| `--comment-id <value>` | Identificador del comentario que eliminar. |

#### `max bot api get-comment-by-id`

Consultar comentario — lectura (GET /messages/{messageId}/comments/{commentId})

```sh
max bot api get-comment-by-id [options]
```

| Opción | Descripción |
|---|---|
| `--message-id <value>` | Identificador (`mid`) del mensaje comentado. |
| `--comment-id <value>` | Identificador del comentario (`mid`) que consultar en el canal. |

#### `max bot api get-video-attachment-details`

Consultar detalles del vídeo — lectura (GET /videos/{videoToken})

```sh
max bot api get-video-attachment-details [options]
```

| Opción | Descripción |
|---|---|
| `--video-token <value>` | Token del vídeo adjunto. |

#### `max bot api answer-on-callback`

Responder a un callback — escritura (POST /answers)

**Modifica datos en MAX.**

```sh
max bot api answer-on-callback [options]
```

| Opción | Descripción |
|---|---|
| `--callback-id <value>` | Identifica el botón pulsado. El bot recibe este identificador dentro de `MessageCallbackUpdate` cuando el usuario pulsa el botón. |
| `--disable-link-preview <value>` | Si es `true`, el servidor no genera vistas previas para los enlaces del texto actualizado. |
| `--body <json>` | Cuerpo de la petición como JSON; - lo lee desde stdin. |
| `--body-file <path>` | Cuerpo de la petición desde un archivo JSON; - indica stdin. |

#### `max bot api get-updates`

Obtener actualizaciones — escritura (GET /updates)

**Modifica datos en MAX.**

```sh
max bot api get-updates [options]
```

| Opción | Descripción |
|---|---|
| `--limit <value>` | Número máximo de actualizaciones que obtener. |
| `--poll-timeout <value>` | Tiempo de espera en segundos para consultas prolongadas. |
| `--marker <value>` | Pasa `null` para obtener las actualizaciones que todavía no has recibido. |
| `--types <value>` | Tipos de actualizaciones que recibirá el bot, separados por comas. |

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
