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
| `-V, --version` |generar el número de versión.|
| `-v, --verbose` |más detalle en lo que se muestra: -v ids, -vv todo lo que sabemos. Por defecto: `0`.|
| `--json` |salida legible por máquina: un valor JSON en la salida estándar, nada más.|
| `--jsonl` |Salida legible por máquina: un objeto JSON por línea, para streaming y jq.|
| `--quiet` |diagnóstico desactivado.|
| `--trace` |una línea por solicitud en stderr: identificadores y tiempos, nunca contenido del mensaje.|
| `--timeout <duration>` |abandone todo el comando después de esto: 30 s, 2 m, 500 ms.|
| `--offline` |responder de lo grabado y nunca conectarse; falla si no fuera nada.|
| `--no-input` | no pedir entrada ni abrir un inicio de sesión interactivo; la entrada mediante una tubería sigue disponible. |
| `--max-input-bytes <bytes>` | máximo de bytes de entrada almacenados en búfer (predeterminado: 16777216). |
| `--max-output-bytes <bytes>` | máximo de bytes de salida para máquinas (predeterminado: 4194304; 0 desactiva el límite). |
| `--fields <paths>` | campos de elementos o del objeto separados por comas: id,text; conservar la paginación y los identificadores de operaciones. |
| `--dry-run` | previsualizar los argumentos analizados y los permisos antes de ejecutar la acción. |
| `--yes` |Continúe sin la pregunta que un nivel de pregunta pone antes de escribir.|
| `--record` |mantenga esto ejecutándose en `max runs`: identificadores y horarios, nunca contenido de mensajes.|
| `--no-record` |no lo guardes, diga lo que diga la configuración.|
| `--serve` |inicie `max serve` en segundo plano si no se está ejecutando (el valor predeterminado).|
| `--no-serve` |no lo inicies; inicie sesión en la propia conexión de este comando a menos que se esté ejecutando uno.|

## `max session`

la sesión MAX almacenada para este perfil

### `max session start`

inicie sesión en este perfil en MAX

```sh
max session start [method]
```

| Argumento | | Qué es |
|---|---|---|
| `method` | opcional |token (pegado o por stdin), qr, qr-chrome o sms. Uno de: `token`, `qr`, `qr-chrome`, `sms`. Por defecto: `token`.|

### `max session end`

cerrar la sesión de este perfil en MAX y eliminar la sesión guardada aquí

**Cambia algo en MAX.**

```sh
max session end
```

## `max setup`

configure su cuenta MAX personal y conecte a su agente

**Cambia algo en MAX.**

```sh
max setup [options]
```

| Opción | Para qué sirve |
|---|---|
| `--agent <agent>` |instalar la habilidad para este agente; pregunta en una terminal, de lo contrario ninguno. Uno de: `none`, `codex`, `cursor`, `claude`, `gemini`, `all`.|
| `--method <method>` |cómo iniciar sesión cuando no hay sesión. Uno de: `token`, `qr`, `qr-chrome`, `sms`. Por defecto: `qr`.|

## `max account`

la cuenta iniciada

### `max account list`

todos los perfiles de este ordenador y sus cuentas; no consulta el servicio de mensajería

```sh
max account list
```

### `max account show`

con quién se ha iniciado sesión en este perfil; el número de teléfono muestra sus últimos cuatro dígitos

```sh
max account show [options]
```

| Opción | Para qué sirve |
|---|---|
| `--show-phone` | mostrar el número de teléfono completo. |

### `max account update`

cambia el nombre, la descripción o la foto que todos ven en tu perfil

**Cambia algo en MAX.**

```sh
max account update [options]
```

| Opción | Para qué sirve |
|---|---|
| `--first-name <name>` | your first name. |
| `--last-name <name>` | your last name. |
| `--description <text>` | about you. |
| `--photo <file>` |una nueva foto de perfil: un archivo de imagen.|

### `max account sessions`

¿En qué otro lugar se inició sesión con esta cuenta? No en `max session`, que es el inicio de sesión propio de esta herramienta.

#### `max account sessions list`

cada dispositivo y aplicación que haya iniciado sesión en esta cuenta; nada ha terminado

```sh
max account sessions list
```

#### `max account sessions end`

cierre sesión en todos los demás dispositivos, incluido su teléfono; este se queda

**Cambia algo en MAX.**

```sh
max account sessions end [options]
```

| Opción | Para qué sirve |
|---|---|
| `--others` |todas las sesiones excepto ésta.|

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
| `--find-by-phone <who>` |quién encuentra la cuenta por su número: everyone, contacts o nobody; MAX admite everyone y contacts.|
| `--phone-number <who>` |quién ve el número: everyone, contacts o nobody.|
| `--calls <who>` |quién puede llamar: everyone, contacts o nobody.|
| `--chat-invites <who>` |quién puede añadir la cuenta a grupos y canales: everyone, contacts o nobody.|
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
| `--limit <n>` | cuántos mostrar. |

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

los chats en los que está esta cuenta

### `max chats list`

chats, los más nuevos primero, los archivados incluidos

```sh
max chats list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | qué página, empezando por 1. |
| `--all` | todas las filas, sin paginar. |
| `--search <text>` |sólo chats cuyo nombre contenga esto; al menos 3 caracteres.|
| `--kind <kind>` |solo chats de este tipo: diálogo, grupo, canal, guardados.|
| `--unread` |sólo chats con mensajes no leídos.|

### `max chats show`

un chat: su tipo, recuento de no leídos, hora del último mensaje y quién está en él

```sh
max chats show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

### `max chats events`

quién se unió, se fue, fue agregado o eliminado y por quién, de los mensajes de servicio del chat

```sh
max chats events <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--since-time <time>` | ISO 8601, o hace 2h / 1d; si no se indica, hace 7 días. |
| `--type <names>` |solo estos, separados por comas: unirse, salir, agregar, eliminar, crear, título, fijar.|

### `max chats inspect`

a qué conduce una invitación o un enlace público, sin unirse a él

```sh
max chats inspect <link>
```

| Argumento | | Qué es |
|---|---|---|
| `link` | obligatorio |un enlace de invitación o uno público.|

### `max chats join`

unirse a un grupo o canal mediante su enlace; los demás en él ven que te uniste

**Cambia algo en MAX.**

```sh
max chats join <link>
```

| Argumento | | Qué es |
|---|---|---|
| `link` | obligatorio |un enlace de invitación o uno público.|

### `max chats mark-read`

marcar un chat como leído; el otro lado ve que lo lees

**Cambia algo en MAX.**

```sh
max chats mark-read <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--until <message>` |sólo hasta esta identificación de mensaje; el más nuevo por defecto.|
| `--topic <id>` |marcar sólo este tema del foro como leído; no soportado por servicios de mensajería sin temas.|

### `max chats leave`

abandonar un grupo o canal; los demás en él ven que te fuiste

**Cambia algo en MAX.**

```sh
max chats leave <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

### `max chats create`

crear un grupo o un canal; a las personas agregadas se les dice

**Cambia algo en MAX.**

```sh
max chats create <title> [person] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `title` | obligatorio |el nombre del grupo.|
| `person` | opcional |personas para agregar: una identificación o parte de un nombre.|

| Opción | Para qué sirve |
|---|---|
| `--channel` |un canal privado en lugar de un grupo; la gente se une a través de su enlace.|

### `max chats members`

quien esta en un grupo

#### `max chats members list`

todos en un grupo, una página a la vez, con su rol y cuándo fueron vistos por última vez

```sh
max chats members list <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | qué página, empezando por 1. |
| `--all` | todas las filas, sin paginar. |

#### `max chats members audit`

miembros que parecen robots, cada uno con sus motivos: leídos en la lista de miembros y en el archivo local; nunca una solicitud por persona, y no elimina a nadie

```sh
max chats members audit <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--budget <pages>` |como máximo esta cantidad de páginas de 200 miembros, una pausa entre ellas (predeterminado: 10).|
| `--min-score <n>` |sólo los miembros que obtienen al menos esto; 1 enumera a todos con un motivo (predeterminado: 2).|
| `--deep <n>` | comprueba también a las primeras n personas en detalle — perfil, fotos y todo lo que escribieron — a una persona por segundo; las listas públicas de bloqueos solo cubren Telegram, por lo que no se envía nada. |

#### `max chats members history`

quién se unió, quién se fue y cuyo perfil cambió, el más antiguo primero: qué chats obtienen los miembros registrados en el archivo local; nunca le pregunta al servicio de mensajería

```sh
max chats members history <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--since-time <time>` |ISO 8601, o hace 2h/1d; todo registrado si no se da.|

#### `max chats members fetch`

leer la lista completa de miembros de un grupo en el historial de miembros de el archivo local: quién se unió, quién se fue, recuentos diarios y cambios de perfil; alguien se registra como desaparecido solo cuando se leyeron todos los miembros

```sh
max chats members fetch <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--track` |descargarla también a diario mientras se ejecuta serve; chats tracking enumera y modifica esos chats.|
| `--budget <pages>` |como máximo esta cantidad de páginas de 200 miembros, una pausa entre ellas (predeterminado: 10).|

#### `max chats members add`

agregar personas; se les dice

**Cambia algo en MAX.**

```sh
max chats members add <chat> <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `person` | obligatorio | un ID o parte de un nombre. |

| Opción | Para qué sirve |
|---|---|
| `--history` |las personas agregadas también ven los mensajes anteriores a su llegada.|

#### `max chats members remove`

eliminar personas; sus mensajes permanecen

**Cambia algo en MAX.**

```sh
max chats members remove <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `person` | obligatorio | un ID o parte de un nombre. |

### `max chats tracking`

los chats cuyas listas de miembros descarga serve a diario al almacenamiento local — chats members fetch --track añade uno

#### `max chats tracking list`

cada chat rastreado: desde cuándo y su último recuento de miembros

```sh
max chats tracking list
```

#### `max chats tracking show`

un chat: si se realiza un seguimiento y el recuento de miembros por día durante los últimos 30 días

```sh
max chats tracking show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

#### `max chats tracking add`

descargar a diario la lista de miembros de este chat mientras se ejecuta serve, a partir de su siguiente ejecución

```sh
max chats tracking add <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

#### `max chats tracking remove`

dejar de descargarla a diario; se conserva el historial ya guardado

```sh
max chats tracking remove <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

### `max chats admins`

dar o recuperar los derechos de administrador de un miembro

#### `max chats admins add`

convertir a un miembro en administrador con estos derechos

**Cambia algo en MAX.**

```sh
max chats admins add <chat> <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `person` | obligatorio | un ID o parte de un nombre. |

| Opción | Para qué sirve |
|---|---|
| `--can <rights>` |qué pueden hacer, separados por comas: leer, miembros, administradores, información, fijar, vincular, publicar, editar, eliminar.|

#### `max chats admins remove`

retirar los permisos de un administrador; ellos siguen siendo miembros

**Cambia algo en MAX.**

```sh
max chats admins remove <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `person` | obligatorio | un ID o parte de un nombre. |

### `max chats update`

cambiar el nombre de un grupo o canal, cambiar su descripción o activar o desactivar una de sus configuraciones

**Cambia algo en MAX.**

```sh
max chats update <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--title <title>` |el nuevo nombre.|
| `--description <text>` |la nueva descripción.|
| `--photo <file>` | una nueva foto: un archivo de imagen. |
|`--all-can-pin <on\|off>` |cada miembro puede fijar mensajes.|
|`--only-admins-add <on\|off>` |sólo los administradores pueden agregar miembros.|
|`--only-admins-call <on\|off>` |Sólo los administradores pueden iniciar una llamada.|
|`--only-owner-edits-info <on\|off>` |Sólo el propietario podrá cambiar el nombre y la foto.|
| `--members-see-link <on\|off>` |los miembros pueden ver el enlace de invitación.|

### `max chats link`

enlace de invitación de un grupo

#### `max chats link show`

el enlace de invitación, si puedes verlo

```sh
max chats link show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

#### `max chats link reset`

reemplace el enlace de invitación; el viejo deja de funcionar

**Cambia algo en MAX.**

```sh
max chats link reset <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

### `max chats requests`

solicitudes de entrada a un canal de MAX que requiere aprobación

#### `max chats requests list`

solicitudes pendientes de entrada a un canal de MAX que requiere aprobación; solo administradores; requestedAt es null

```sh
max chats requests list <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos resultados. |
| `--search <text>` | solo personas cuyo nombre o @username contiene este texto. |
| `--link <link>` | MAX no lo admite; busca por nombre en su lugar. |

#### `max chats requests accept`

aceptar; el grupo ve la entrada

**Cambia algo en MAX.**

```sh
max chats requests accept <chat> [person] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `person` | opcional | quién lo solicitó: un ID de `chats requests list`. |

| Opción | Para qué sirve |
|---|---|
| `--all` |MAX no lo admite; elige una persona de chats requests list.|
| `--link <link>` |MAX no lo admite; elige una persona de chats requests list.|

#### `max chats requests decline`

rechazar la solicitud

**Cambia algo en MAX.**

```sh
max chats requests decline <chat> [person] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `person` | opcional | quién lo solicitó: un ID de `chats requests list`. |

| Opción | Para qué sirve |
|---|---|
| `--all` |MAX no lo admite; elige una persona de chats requests list.|
| `--link <link>` |MAX no lo admite; elige una persona de chats requests list.|

### `max chats folders`

your chat folders

#### `max chats folders list`

tus carpetas de chat, en el orden en que las muestra la aplicación

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

crear una carpeta de chat

**Cambia algo en MAX.**

```sh
max chats folders create <title> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `title` | obligatorio |el nombre de la carpeta; la aplicación puede rechazar una larga.|

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` |un chat para poner en él, por id o nombre; repítelo para más.|

#### `max chats folders update`

cambiar el nombre de una carpeta o cambiar los chats que contiene

**Cambia algo en MAX.**

```sh
max chats folders update <folder> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `folder` | obligatorio | ID de la carpeta o su título exacto. |

| Opción | Para qué sirve |
|---|---|
| `--title <title>` | un nombre nuevo. |
| `--add <chat>` |ponle un chat; repítelo para más.|
| `--remove <chat>` | quitar el chat de la carpeta y de las listas de excluidos y fijados; repetir para varios. |

#### `max chats folders delete`

eliminar una carpeta; los chats en el se quedan

**Cambia algo en MAX.**

```sh
max chats folders delete <folder>
```

| Argumento | | Qué es |
|---|---|---|
| `folder` | obligatorio | ID de la carpeta o su título exacto. |

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

por qué `chats moderate` juzga a un grupo, guardado en un archivo de este perfil

#### `max chats rules show`

las reglas del grupo; los valores predeterminados, marcados como no guardados, si aún no los tiene

```sh
max chats rules show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

#### `max chats rules set`

cambiar una regla; El primer cambio del grupo escribe cada regla con su valor predeterminado.

**Cambia algo solo en este ordenador.**

```sh
max chats rules set <chat> <key> <value>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `key` | obligatorio |uno de: confiable, bloqueado, nombres bloqueados, enlaces, invitaciones, reenvíos, personas bloqueadas, mensajes de inundación, minutos de inundación, acción de inundación, días de cuenta nueva, acción de cuenta nueva, consentimiento.eliminar, consentimiento.eliminar.|
| `value` | obligatorio |el nuevo valor; una lista está separada por comas.|

#### `max chats rules unset`

devolver una regla a su valor predeterminado

**Cambia algo solo en este ordenador.**

```sh
max chats rules unset <chat> <key>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `key` | obligatorio |uno de: confiable, bloqueado, nombres bloqueados, enlaces, invitaciones, reenvíos, personas bloqueadas, mensajes de inundación, minutos de inundación, acción de inundación, días de cuenta nueva, acción de cuenta nueva, consentimiento.eliminar, consentimiento.eliminar.|

### `max chats moderate`

Juzgar los nuevos mensajes y miembros de un grupo según sus reglas y actuar según lo permitan.

**Cambia algo en MAX.**

```sh
max chats moderate <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--since-time <time>` |juzgue lo que vino después de este tiempo ISO 8601, o hace 2 h / 1 d; el punto guardado permanece.|
| `--dry-run` | evaluar y planificar; no hacer nada. |
| `--allow-dangerous` |sí a toda acción cuyo nivel en las reglas del grupo sea preguntar.|
| `--max-actions <n>` | como máximo este número de acciones por ejecución; 10 si no se indica. |

### `max chats media`

fotos, vídeos, archivos, audio y enlaces del chat desde el servidor; leerlos no marca nada

```sh
max chats media <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--type <names>` | solo estos tipos, separados por comas: photo, video, file, audio, link. |
| `--limit <n>` | cuántos mostrar. |
| `--before-id <id>` | leer lo anterior a este id de mensaje. |

### `max chats mute`

silenciar el chat para siempre o hasta una fecha; no se avisa a sus miembros

**Cambia algo en MAX.**

```sh
max chats mute <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

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
| `chat` | obligatorio | un chat: su ID o parte de su título. |

### `max chats delete`

eliminar el chat para esta cuenta; los demás conservan el chat y sus mensajes

**Cambia algo en MAX.**

```sh
max chats delete <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--allow-dangerous` | borrar sin la pregunta que el nivel ask hace antes de eliminar. |

### `max chats clear`

eliminar todos los mensajes del chat para esta cuenta; los demás conservan los suyos

**Cambia algo en MAX.**

```sh
max chats clear <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--allow-dangerous` | borrar sin la pregunta que el nivel ask hace antes de eliminar. |

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
| `--payload <text>` |parámetro de inicio que lee el bot; usa ?start= del enlace si se omite.|

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

personas con las que tienes una conversación individual

### `max contacts list`

personas con las que tienes una conversación individual

```sh
max contacts list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | qué página, empezando por 1. |
| `--all` | todas las filas, sin paginar. |
| `--order <recent\|name>` |la conversación más reciente primero o alfabéticamente. Por defecto: `recent`.|
| `--search <text>` | solo personas cuyo nombre, alias local o @username contiene este texto. |
| `--search-notes <text>` | solo personas cuyas notas privadas contienen este texto. |

### `max contacts show`

una persona y los chats que compartes con ella

```sh
max contacts show <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | su ID, @username o parte de su nombre. |

| Opción | Para qué sirve |
|---|---|
| `--with-notes` |incluir tus notas privadas, sujeto al permiso contacts.notes.list.|

### `max contacts profile`

todo lo que el servicio de mensajería informa sobre una persona —identificadores, indicadores, última conexión y cuándo se registró— y cuántos de sus mensajes guarda el almacenamiento en cada chat que compartís, el primero y el último, y los nombres y nombres de usuario anteriores que registró el almacenamiento

```sh
max contacts profile <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | su ID, @username o parte de su nombre. |

| Opción | Para qué sirve |
|---|---|
| `--show-phone` | mostrar el número de teléfono completo. |

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

Olvida dónde quedó la última sincronización y vuelve a tomar la lista completa.

```sh
max contacts sync
```

### `max contacts lookup`

quién tiene MAX bajo un número de teléfono: lo solicita o lo lee desde stdin

```sh
max contacts lookup
```

### `max contacts add`

agregue una persona a sus contactos: `contacts list` todavía muestra solo las personas con las que tiene un diálogo

**Cambia algo en MAX.**

```sh
max contacts add <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | ID de la persona (lo encuentra `contacts lookup`) o parte de un nombre conocido. |

### `max contacts remove`

eliminar a una persona de tus contactos; el chat permanece, un nombre que les diste puede no

**Cambia algo en MAX.**

```sh
max contacts remove <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | ID de la persona (lo encuentra `contacts lookup`) o parte de un nombre conocido. |

### `max contacts block`

evitar que una persona le escriba; no es necesario que sea un contacto

**Cambia algo en MAX.**

```sh
max contacts block <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | ID de la persona (lo encuentra `contacts lookup`) o parte de un nombre conocido. |

### `max contacts unblock`

deja que una persona bloqueada te vuelva a escribir

**Cambia algo en MAX.**

```sh
max contacts unblock <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | ID de la persona (lo encuentra `contacts lookup`) o parte de un nombre conocido. |

### `max contacts rename`

renombrar el contacto en la libreta de direcciones del servicio de mensajería; usa contacts alias para un nombre local privado

**Cambia algo en MAX.**

```sh
max contacts rename <person> <first-name> [last-name]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | ID de la persona (lo encuentra `contacts lookup`) o parte de un nombre conocido. |
| `first-name` | obligatorio |el nombre que quieres ver para ellos.|
| `last-name` | opcional |  |

### `max contacts import`

cargue números de teléfono y agregue las personas que el servicio de mensajería tiene debajo de ellos

**Cambia algo en MAX.**

```sh
max contacts import <file>
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio |una persona por línea: número, luego una coma, una tabulación o un punto y coma, luego el nombre.|

### `max contacts context`

lo que el archivo tiene sobre una persona, en cada servicio de mensajería vinculado a ella: chats compartidos, los últimos mensajes en cada sentido, sus mensajes recientes, dónde los mencionaron otros, nunca se conecta

```sh
max contacts context <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | su ID, @username o parte de su nombre. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` |como máximo esta cantidad de mensajes en cada lista; 10 si no se da.|
| `--since-time <time>` |nada más antiguo que este tiempo ISO 8601, o hace 2 h / 1 d.|
| `--chat <chat>` |un chat, por id o nombre; repítalo para más, luego sus mensajes más nuevos en cada uno, 20 a menos que --limit, breve a menos que -v.|
| `--refresh` |Con --chat, lee primero los mensajes más recientes del Messenger en cada uno.|

### `max contacts check`

comprueba si una persona parece un bot, una cuenta falsa o un spammer a partir de su perfil y sus mensajes en el almacén: es una pista, nunca un veredicto; las listas públicas de bloqueos solo cubren Telegram, por lo que no se envía nada

```sh
max contacts check <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | su ID, @username o parte de su nombre. |

| Opción | Para qué sirve |
|---|---|
| `--no-registries` |no preguntes a las listas de prohibiciones públicas; nada de ellos sale de esta máquina.|

### `max contacts link`

registre que dos personas en el archivo son una sola persona; el mismo nombre nunca es suficiente

```sh
max contacts link <person> <other>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | su ID, @username o parte de su nombre. |
| `other` | obligatorio |lo mismo en otro messenger de el archivo, como <messenger>:<person> — max:Ana.|

### `max contacts unlink`

Deshacer enlace de contactos para una identidad: vuelve a ser una persona propia

```sh
max contacts unlink <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio |su id, @nombredeusuario o parte de su nombre; <messenger>:<person> para otro servicio de mensajería.|

## `max messages`

leer y enviar mensajes en un chat

### `max messages list`

Los mensajes de un chat, del más antiguo al más nuevo.

```sh
max messages list <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos resultados. |
| `--before-id <id>` | solo mensajes anteriores a este ID de mensaje. |
| `--before-time <time>` |solo mensajes anteriores a esta hora ISO 8601, o hace 2 h/1 d.|
| `--after-id <id>` |sólo mensajes más recientes que esta identificación de mensaje.|
| `--after-time <time>` |solo mensajes más recientes que esta hora ISO 8601, o hace 2 h/1 d.|
| `--transcribe` |convertir los mensajes de voz que aún no se han escuchado en texto, ya sea por el servicio de mensajería o por un modelo de esta máquina; puede tardar unos minutos.|
| `--model <id>` |qué modelo de voz descargado los escucha, con --transcribe; `models audio list` se los muestra.|
| `--mark-read` |también marque el chat leído hasta el mensaje más reciente mostrado; la otra persona lo ve.|

### `max messages show`

un mensaje, por su chat e id o por su mensaje: localizador

```sh
max messages show <chat> [message]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título; o un localizador msg: sin ID de mensaje al final. |
| `message` | opcional | el ID del mensaje. |

### `max messages context`

un mensaje y lo que viene a ambos lados, el más antiguo primero

```sh
max messages context <chat> [message] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título; o un localizador msg: sin ID de mensaje al final. |
| `message` | opcional | el ID del mensaje. |

| Opción | Para qué sirve |
|---|---|
| `--thread` | la cadena de respuestas guardada en lugar de los mensajes cercanos en el tiempo; sin grafo se usa el comportamiento anterior. |
| `--thread-hops <n>` | como máximo este número de enlaces desde la coincidencia (predeterminado: 8). |
| `--thread-messages <n>` | como máximo este número de mensajes en el contexto de cada hilo (predeterminado: 50). |
| `--thread-bytes <n>` | como máximo este número de bytes de mensajes completos y enlaces en cada contexto (predeterminado: 65536). |
| `--thread-within <duration>` | mensajes dentro de este tiempo antes y después de la coincidencia (predeterminado: 1d). |
| `--before-n <n>` |cuantos antes. Por defecto: `5`.|
| `--after-n <n>` |how many after it. Por defecto: `5`.|

### `max messages links`

Por qué un mensaje está en su conversación: cada eslabón que tiene y la cadena de respuestas hasta el inicio.

```sh
max messages links <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `message` | obligatorio | el ID del mensaje. |

### `max messages link`

un enlace permanente de mensaje cuando sea compatible y su localizador de ámbito de cuenta

```sh
max messages link <chat> [message]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título; o un localizador msg: sin ID de mensaje al final. |
| `message` | opcional | el ID del mensaje. |

### `max messages download`

guarde las fotos, archivos, videos y notas de voz de un mensaje en una carpeta, o en un chat completo con --all

```sh
max messages download <chat> [message] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `message` | opcional |la identificación del mensaje; excluido con --todos.|

| Opción | Para qué sirve |
|---|---|
| `--output-dir <dir>` |dónde guardarlos; creado si falta. Por defecto: `.`.|
| `--all` |cada archivo del chat, el más nuevo primero; ejecútelo nuevamente para continuar donde se detuvo.|
| `--pause <duration>` |con --all, una pausa entre páginas, para permanecer por debajo de los límites del proveedor. Por defecto: `5s`.|
| `--extract` | leer las capas de texto de los archivos que esta descarga vincula al índice de contenido local. |
| `--output <dir>` |alias de compatibilidad para --output-dir.|

### `max messages evidence`

un paquete de evidencia limitado de los mensajes almacenados, el más nuevo primero

```sh
max messages evidence <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | how many, 1–100. |
| `--before-id <id>` | solo mensajes anteriores a este ID de mensaje. |

### `max messages transcribe`

convierta un mensaje de voz en texto en esta máquina: la grabación no va a ninguna parte

```sh
max messages transcribe <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID del chat o parte de su nombre. |
| `message` | obligatorio |ID de un mensaje de voz.|

| Opción | Para qué sirve |
|---|---|
| `--model <id>` |qué modelo de voz descargado usar; `max models audio list` se los muestra.|

### `max messages send`

enviar un mensaje de texto; sin [texto], el texto se lee desde stdin

**Cambia algo en MAX.**

```sh
max messages send <chat> [text] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `text` | opcional | el mensaje. |

| Opción | Para qué sirve |
|---|---|
| `--topic <id>` |enviar a este tema del foro; no soportado por servicios de mensajería sin temas.|
| `--reply-to <message>` |Responde este mensaje, por su id en el mismo chat.|
| `--send-as <id>` | publicar como una de las identidades que enumera `chats send-as`; obligatorio cuando el chat publica como otra identidad de forma predeterminada. |
| `--send-id <id>` |repetir un envío cuyo resultado se desconocía, sin arriesgarse a una segunda copia.|
| `--silent` | entregar sin notificación. |
| `--no-preview` |no hay tarjeta de vista previa para un enlace en el texto.|
| `--md` | interpretar el Markdown de este servicio de mensajería; la sintaxis admitida está en su guía de formato. |
| `--file <file>` |adjuntar un archivo; el texto se convierte en su título.|
| `--photo <file>` |adjunte un .jpg, .png o .webp como foto; el texto se convierte en su título.|
| `--as-file` |envíe el --file como un archivo para descargar, un video incluido.|
| `--voice <file>` |envía un archivo Ogg Opus como mensaje de voz, solo, sin texto.|
| `--allow-any-file` |envíe un archivo incluso desde una carpeta oculta, \~/.ssh o las propias carpetas de esta CLI.|
| `--at-time <time>` |deja que el servicio de mensajería lo envíe más tarde, incluso con esta máquina apagada: 2026-09-25T09:00 (hora local), o dentro de 30m, 2h, 1d.|
| `--sticker <id>` | enviar solo este sticker; `stickers list` muestra su id. |

### `max messages scheduled`

mensajes que esperan ser enviados más tarde en un chat, los más prontos primero; cancelar uno en la aplicación

```sh
max messages scheduled <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

### `max messages edit`

cambiar el texto de su propio mensaje; Es posible que el otro lado ya lo haya leído.

**Cambia algo en MAX.**

```sh
max messages edit <chat> <message> [text] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `message` | obligatorio |la identificación de su propio mensaje.|
| `text` | opcional |el nuevo texto; sin él, lea desde stdin.|

| Opción | Para qué sirve |
|---|---|
| `--md` | interpretar el Markdown de este servicio de mensajería; la sintaxis admitida está en su guía de formato. |

### `max messages delete`

eliminar mensajes solo para usted; con --for-everyone, para todos en el chat

**Cambia algo en MAX.**

```sh
max messages delete <chat> <messages> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `messages` | obligatorio |los ID de los mensajes, como máximo 10.|

| Opción | Para qué sirve |
|---|---|
| `--for-everyone` |eliminar para todos en el chat, no solo para ti: no pueden recuperarlo.|
| `--allow-dangerous` | borrar sin la pregunta que el nivel ask hace antes de eliminar. |

### `max messages forward`

reenviar un mensaje a otro chat

**Cambia algo en MAX.**

```sh
max messages forward <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio |el chat en el que se encuentra el mensaje: un chat: su id, o parte de su título.|
| `message` | obligatorio | el ID del mensaje. |

| Opción | Para qué sirve |
|---|---|
| `--to <chat>` |adónde va: un chat: su id, o parte de su título.|
| `--silent` |entregarlo sin previo aviso.|
| `--send-as <id>` |publicar como una de las identidades que enumera `chats send-as` para el chat --to; obligatorio cuando el chat publica como otra identidad de forma predeterminada.|
| `--send-id <id>` |repetir un delantero cuyo desenlace se desconocía, sin arriesgar una segunda copia.|

### `max messages pin`

fijar un mensaje en un chat, en silencio a menos que --notify

**Cambia algo en MAX.**

```sh
max messages pin <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `message` | obligatorio | el ID del mensaje. |

| Opción | Para qué sirve |
|---|---|
| `--notify` |informar a los miembros del chat sobre el PIN.|

### `max messages unpin`

desanclar un mensaje en un chat

**Cambia algo en MAX.**

```sh
max messages unpin <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `message` | obligatorio | el ID del mensaje. |

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

el almacén local de mensajes

### `max store status`

por chat: mensajes almacenados, los más antiguos y más nuevos, y los tramos retenidos por completo

```sh
max store status [chat]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | opcional | un chat: su ID o parte de su título. |

### `max store fetch`

descargar el historial de un chat al almacenamiento local, primero los mensajes más recientes; ejecutar de nuevo para continuar; --all descarga todos los chats

```sh
max store fetch [chat] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | opcional | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--all` |todos los chats, primero los activos más recientemente — lo que necesita la búsqueda; los últimos 90d salvo que se indique --since-time o --last.|
| `--limit <n>` |como máximo este número de mensajes por ejecución, por chat con --all; 1200 si se omite.|
| `--page-size <n>` |cuántos mensajes solicita una solicitud; 30 si no se da.|
| `--pause <duration>` |la menor pausa entre páginas, para mantenerse dentro de los límites del proveedor; cada uno es hasta el doble. Por defecto: `5s`.|
| `--since-time <time>` |deténgase una vez que llegue a mensajes anteriores a este: ISO 8601, o hace 2 h/1 d.|
| `--last <n>` |se detiene una vez que se retienen los n mensajes más nuevos.|
| `--catch-up` | preparar la búsqueda local después de descargar; anula searchCatchUp. |
| `--no-catch-up` | omitir la preparación local después de esta descarga. |
| `--catch-up-chunks <n>` | como máximo este número de fragmentos de vectores locales. |
| `--catch-up-messages <n>` | omitir una reconstrucción del grafo con más mensajes que este número. |
| `--catch-up-time <duration>` | tiempo disponible para la preparación local, 30s de forma predeterminada. |
| `--background` |ejecutar como un trabajo que sobrevive a este comando; `store jobs show` lo sigue.|
| `--estimate` |Solo calcule cuántos mensajes, solicitudes y minutos aún tomaría una recuperación completa: desde el archivo, sin solicitud.|

### `max store gaps`

inspeccionar las lagunas internas de cobertura registradas y descargar explícitamente los datos que faltan

#### `max store gaps plan`

plan de cobertura local; los identificadores de mensajes ausentes no implican por sí solos que falte historial

```sh
max store gaps plan <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

#### `max store gaps repair`

descargar datos de lagunas internas con límites y volver a comprobar la cobertura; nunca eliminar los mensajes no encontrados

```sh
max store gaps repair <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

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
| `--background` |reparar mediante el mecanismo existente de trabajos del almacenamiento; consultar store jobs show.|

### `max store jobs`

background fetch jobs

#### `max store jobs list`

descargas en segundo plano, las más recientes primero

```sh
max store jobs list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--state <state>` | Solo tareas `running`, `done`, `failed`, `cancelled` o `died`. |

#### `max store jobs show`

un trabajo en segundo plano (el más nuevo cuando no se nombra ninguno) y lo que el archivo tiene ahora de su chat

```sh
max store jobs show [job]
```

| Argumento | | Qué es |
|---|---|---|
| `job` | opcional |se imprime la identificación del trabajo `store fetch --background`.|

#### `max store jobs cancel`

detener un trabajo en segundo plano en ejecución después de su página actual; una búsqueda posterior se reanuda donde se detuvo

```sh
max store jobs cancel <job>
```

| Argumento | | Qué es |
|---|---|---|
| `job` | obligatorio |la identificación del trabajo.|

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
| `--failed` |todos los chats cuyo último trabajo falló o se interrumpió.|

#### `max store jobs clear`

olvidar trabajos terminados y borrar sus registros; se conservan los trabajos en curso

**Cambia algo solo en este ordenador.**

```sh
max store jobs clear
```

### `max store export`

los mensajes almacenados de un chat como líneas JSON, los más antiguos primero; nunca le pregunta al servicio de mensajería

```sh
max store export [chats] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chats` | opcional |un chat: su id, o parte de su título; varios con --to.|

| Opción | Para qué sirve |
|---|---|
| `--format <format>` |jsonl (el valor predeterminado): un mensaje por línea; Markdown: una transcripción con un encabezado por día, respuestas y reenvíos citados.|
| `--since-time <time>` |solo a partir de esta hora ISO 8601, o hace 30 m/2 h/1 d en adelante.|
| `--output <file>` |escriba líneas JSON, o la transcripción, en este nuevo archivo, que solo usted podrá leer.|
| `--to <dir>` |escribe en esta carpeta, un archivo por chat y un manifiesto; ejecútelo nuevamente para ver solo lo que cambió desde entonces.|
| `--kind <kinds>` |con --to: cada chat almacenado de este tipo, separado por comas: diálogo, grupo, canal, guardado.|
| `--all` |con --to: cada chat almacenado de esta cuenta.|
| `--encrypt` |comprimir y cifrar con una contraseña, escrita en un mensaje oculto o canalizada en stdin; nunca se conserva; si se pierde, el archivo no se podrá abrir.|

### `max store clear`

eliminar de el archivo los chats que ha dejado esta cuenta, con sus mensajes

```sh
max store clear [options]
```

| Opción | Para qué sirve |
|---|---|
| `--left` |los chats que ha dejado esta cuenta: lo único que esto borra.|
| `--allow-dangerous` |sí, eliminar: no se puede deshacer y un chat que abandonaste no se puede recuperar de nuevo.|

### `max store info`

el archivo de almacenamiento: dónde está, su tamaño, su esquema y cuántas filas contiene; no cambia nada

```sh
max store info
```

### `max store check`

si el archivo está en buen estado: integridad, índices de búsqueda, disco y qué chats están detrás

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

copie el archivo en un archivo nuevo, mientras esté en uso; nunca sobrescribe un archivo

```sh
max store backup <file> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio |el nuevo archivo.|

| Opción | Para qué sirve |
|---|---|
| `--encrypt` |comprimir y cifrar con una contraseña, escrita en un mensaje oculto o canalizada en stdin; nunca se conserva; si se pierde, el archivo no se podrá abrir.|

### `max store restore`

poner una copia de seguridad en lugar de el archivo; el archivo a la que reemplaza se mantiene a su lado, nunca se elimina

```sh
max store restore <file>
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio |un archivo que escribió `store backup`; uno escrito con --encrypt solicita su contraseña.|

### `max store decrypt`

abra un archivo escrito con --encrypt en un archivo nuevo; pide su contraseña

```sh
max store decrypt <file> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio |un archivo que escribió `store backup --encrypt` o `store export --encrypt`.|

| Opción | Para qué sirve |
|---|---|
| `--output <file>` |el nuevo archivo, legible sólo por usted.|

### `max store repair`

traer cada tabla a la forma de esta construcción, sin eliminar nada: una tabla con la forma incorrecta se guarda como una copia junto a una nueva

```sh
max store repair [options]
```

| Opción | Para qué sirve |
|---|---|
| `--dry-run` |diga lo que haría y no cambiará nada.|

### `max store copies`

las tablas `store repair` se conservan como copias

#### `max store copies delete`

eliminar una copia guardada de `store repair`, con el nombre exacto; rechaza cualquier otra mesa

```sh
max store copies delete <name>
```

| Argumento | | Qué es |
|---|---|---|
| `name` | obligatorio |el nombre de la copia, tal como lo imprimió `store repair`.|

## `max stats`

estadísticas sobre mensajes, chats y sus autores

### `max stats messages`

estadísticas de mensajes del almacenamiento local

#### `max stats messages show`

cuántos mensajes almacenados coinciden, por chat, remitente, día u hora (solo el archivo local); opcionalmente recupera mensajes nuevos con --sync-first

```sh
max stats messages show [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional |una consulta estricta de Lucene, como para mensajes de búsqueda; ninguno cuenta todos los mensajes almacenados; con --saved, más palabras AND-ed.|

| Opción | Para qué sirve |
|---|---|
| `--sync-first` | primero descargar mensajes nuevos dentro de los límites de chat, tiempo y mensajes. |
| `--max-chats <n>` |actualizar como máximo este número de chats (predeterminado: 5).|
| `--sync-time <duration>` | dejar de descargar tras este tiempo (predeterminado: 30s). |
| `--max-messages <n>` | descargar como máximo este número de mensajes en total (predeterminado: 500). |
| `--by <chat\|sender\|day\|hour>` |dimensión del recuento (por defecto: chat).|
| `--chat <chat>` | solo este chat — lo mismo que chat: en la consulta; un chat: su ID o parte de su título. |
| `--source <messenger>` |todas las cuentas de este servicio de mensajería en el almacenamiento; personal, bots o all — lo mismo que in: en la consulta.|
| `--limit <n>` | how many rows. |
| `--timezone <zone>` |la zona horaria de la IANA para los días y horas calendario.|
| `--exact` |las palabras sin campo y las frases entre comillas coinciden solo en su forma exacta, como exact:word; text: sigue admitiendo todas las formas.|
| `--saved <name\|id>` |contar lo que coincide con una búsqueda guardada o una ejecución anterior; Las opciones escritas aquí reemplazan las suyas.|

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
| `--source <messenger>` | cuentas conectadas de este servicio de mensajería; la actualización usa la activa. |
| `--exact` | las palabras sin operadores coinciden por forma exacta. |
| `--timezone <zone>` | zona horaria IANA para fechas de consulta. |
| `--selection <json>` |selección fija de objetivos de counters show; incompatible con consulta y ámbito.|
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
| `--source <messenger>` | cuentas conectadas de este servicio de mensajería; la actualización usa la activa. |
| `--exact` | las palabras sin operadores coinciden por forma exacta. |
| `--timezone <zone>` | zona horaria IANA para fechas de consulta. |
| `--selection <json>` |selección fija de objetivos de counters show; incompatible con consulta y ámbito.|
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
| `--source <messenger>` |todas las cuentas disponibles de este servicio de mensajería; personal, bots o all.|
| `--exact` | las palabras sin campo coinciden en su forma exacta en lugar de por su raíz. |
| `--saved <name\|id>` | ejecutar un informe guardado de este tipo; las opciones indicadas sustituyen las guardadas. |
| `--timezone <zone>` | la zona horaria IANA para los límites de las fechas del calendario. |
| `--limit <n>` | filas del informe, 1–100; 20 por defecto. |
| `--answerer <person>` | nombre guardado, alias, @username, ID o person:provider/account/id; los nombres ambiguos requieren elegir; repetir para varias. |
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
| `--source <messenger>` |todas las cuentas disponibles de este servicio de mensajería; personal, bots o all.|
| `--exact` | las palabras sin campo coinciden en su forma exacta en lugar de por su raíz. |
| `--saved <name\|id>` | ejecutar un informe guardado de este tipo; las opciones indicadas sustituyen las guardadas. |
| `--timezone <zone>` | la zona horaria IANA para los límites de las fechas del calendario. |
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
| `--sync-first` | primero descargar mensajes nuevos dentro de los límites de chat, tiempo y mensajes. |
| `--max-chats <n>` |actualizar como máximo este número de chats (predeterminado: 5).|
| `--sync-time <duration>` | dejar de descargar tras este tiempo (predeterminado: 30s). |
| `--max-messages <n>` | descargar como máximo este número de mensajes en total (predeterminado: 500). |
| `--measure <name>` | métrica de clasificación; no se combina con score ni weights. Uno de: `views`, `reactions`, `forwards`, `comments`, `replies`, `thread-size`. |
| `--score <preset>` | helpful/active para autores; engaging para ambos tipos de objetos. Uno de: `helpful`, `active`, `engaging`. |
| `--weights <json>` | el conjunto completo de pesos de los componentes; sustituye los pesos predefinidos. |
| `--message-kind <kind>` | antes de clasificar, selecciona todos los mensajes, publicaciones o comentarios con tipo confirmado. Uno de: `all`, `posts`, `comments`. |
| `--chat <chat>` | solo este chat; indica su ID o parte de su título. |
| `--source <messenger>` |todas las cuentas disponibles de este servicio de mensajería; personal, bots o all.|
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
| `--source <messenger>` |todas las cuentas disponibles de este servicio de mensajería; personal, bots o all.|
| `--exact` | las palabras sin campo coinciden en su forma exacta en lugar de por su raíz. |
| `--saved <name\|id>` | ejecutar un informe guardado de este tipo; las opciones indicadas sustituyen las guardadas. |
| `--timezone <zone>` | la zona horaria IANA para los límites de las fechas del calendario. |
| `--limit <n>` | filas del informe, 1–100; 20 por defecto. |
| `--answerer <person>` | nombre guardado, alias, @username, ID o person:provider/account/id; los nombres ambiguos requieren elegir; repetir para varias. |

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
| `--sync-first` | primero descargar mensajes nuevos dentro de los límites de chat, tiempo y mensajes. |
| `--max-chats <n>` |actualizar como máximo este número de chats (predeterminado: 5).|
| `--sync-time <duration>` | dejar de descargar tras este tiempo (predeterminado: 30s). |
| `--max-messages <n>` | descargar como máximo este número de mensajes en total (predeterminado: 500). |
| `--measure <name>` | métrica de clasificación; no se combina con score ni weights. Uno de: `messages`, `words`, `reactions`, `replies`, `answers`, `answer-time`, `threads`, `active-days`. |
| `--score <preset>` | helpful/active para autores; engaging para ambos tipos de objetos. Uno de: `helpful`, `active`, `engaging`. |
| `--weights <json>` | el conjunto completo de pesos de los componentes; sustituye los pesos predefinidos. |
| `--message-kind <kind>` | antes de clasificar, selecciona todos los mensajes, publicaciones o comentarios con tipo confirmado. Uno de: `all`, `posts`, `comments`. |
| `--chat <chat>` | solo este chat; indica su ID o parte de su título. |
| `--source <messenger>` |todas las cuentas disponibles de este servicio de mensajería; personal, bots o all.|
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

los números de un grupo o canal durante un período: mensajes, miembros activos, respuestas, reacciones, preguntas respondidas, entradas y salidas, contados desde el archivo local; se une y sale se le pide al servicio de mensajería

```sh
max stats chats show <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--since-time <time>` | ISO 8601, o hace 2h / 1d; si no se indica, hace 7 días. |
| `--by <day\|week>` |también una fila por día calendario o semana (las semanas comienzan el lunes).|
| `--timezone <zone>` | la zona horaria IANA para los días del calendario. |

#### `max stats chats newcomers`

miembros con fecha de entrada conocida y ayuda durante el plazo posterior

```sh
max stats chats newcomers <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--since-time <time>` | desde esta fecha ISO 8601 o hace 2h / 1d; hace 30d por defecto. |
| `--until-time <time>` | hasta esta fecha ISO 8601 o hace 2h / 1d, inclusive. |
| `--within <duration>` | plazo de ayuda tras la entrada conocida de una persona nueva. |
| `--saved <name\|id>` | ejecutar un informe guardado de este tipo; las opciones indicadas sustituyen las guardadas. |
| `--timezone <zone>` | la zona horaria IANA para los límites de las fechas del calendario. |
| `--limit <n>` | filas del informe, 1–100; 20 por defecto. |
| `--answerer <person>` | nombre guardado, alias, @username, ID o person:provider/account/id; los nombres ambiguos requieren elegir; repetir para varias. |

#### `max stats chats retention`

cohortes de incorporación y pertenencia observada en fechas de control a partir de listas guardadas

```sh
max stats chats retention <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

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
| `--type <name>` |sólo este tipo: pregunta, petición, mención o promesa.|

### `max stats charts`

los datos de un gráfico de las estadísticas de un chat y, opcionalmente, una imagen SVG o PNG de tema oscuro

```sh
max stats charts <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
|`--chart-kind <messages\|active\|membership>` |qué dibujar: mensajes, autores activos o unirse y salir. Por defecto: `messages`.|
| `--by <day\|week>` |un punto por día calendario o semana (las semanas comienzan el lunes). Por defecto: `day`.|
| `--since-time <time>` | ISO 8601, o hace 2h / 1d; si no se indica, hace 7 días. |
| `--timezone <zone>` | la zona horaria IANA para los días del calendario. |
| `--output <file>` | guardar una imagen de tema oscuro en un nuevo archivo .svg o .png. |

## `max tasks`

lo que requiere tu atención —preguntas sin respuesta, menciones, peticiones y promesas— guardado en el almacenamiento local; review y serve lo añaden

### `max tasks list`

tareas, primero las más antiguas, con su mensaje o nota de origen

```sh
max tasks list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--state <state>` |solo tareas en este estado: open, done o dismissed.|
| `--chat <chat>` | solo las tareas de este chat; indica su ID o parte de su título. |
| `--type <names>` |solo estos tipos, separados por comas: question, request, mention, promise.|
| `--before-time <time>` | solo tareas abiertas antes de esta fecha ISO 8601 o de hace 2h / 1d. |
| `--limit <n>` | cuántos resultados. |

### `max tasks add`

añadir una tarea para un mensaje o una nota guardados — una promesa o una petición

```sh
max tasks add <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `message` | obligatorio |localizador de mensaje msg:<provider>/<account>/<chat>/<message>, o note:<id>.|

| Opción | Para qué sirve |
|---|---|
| `--type <name>` |Tipo de tarea: pregunta, petición, mención o promesa.|

### `max tasks close`

cerrar una tarea: done o dismissed si no necesita respuesta; una tarea cerrada permanece cerrada

```sh
max tasks close <task> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `task` | obligatorio |ID de la tarea, como aparece en tasks list.|

| Opción | Para qué sirve |
|---|---|
| `--as <state>` | cómo se cierra: done o dismissed — no necesita respuesta. |
| `--reason <text>` | el motivo, guardado con la tarea — no-reply-needed, por ejemplo. |

## `max conversations`

las conversaciones dentro de un chat, que se encuentran en los mensajes almacenados por respuestas, menciones y quién escribió a continuación

### `max conversations build`

encontrar conversaciones de chat en lo que tiene el archivo, reemplazando la última compilación; sin --chat, cada chat que cambió desde su creación y cada grupo que nunca se creó; nunca le pregunta al servicio de mensajería

```sh
max conversations build [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | un chat: su ID o parte de su título. |
| `--analyze` |vincular lotes utilizando el proveedor de análisis configurado; requiere --chat y recuerda el consentimiento para este chat/proveedor.|
| `--provider <provider>` |análisis: agent, openai o anthropic.|
| `--model <model>` | analysis model; overrides analysisModel. |
| `--base-url <url>` | analysis API endpoint; overrides analysisBaseUrl. |
| `--size <n>` |mensajes de respuesta de análisis por lote, 10 a 200; predeterminado 50.|
| `--max-tokens <n>` |límite de reserva de entrada/salida de análisis por ejecución; predeterminado 100000.|
| `--max-chats <n>` |como máximo este número de chats por ejecución; 20 si no se indica.|

### `max conversations list`

Las conversaciones de un chat, las más nuevas primero: cuándo, cuántos mensajes, cuántas personas.

```sh
max conversations list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | un chat: su ID o parte de su título. |
| `--since-time <time>` |solo aquellos que comenzaron a esta hora ISO 8601, o hace 30m/2h/1d, o más tarde.|
| `--limit <n>` | cuántos resultados. |

### `max conversations show`

los mensajes de una conversación, los más antiguos primero, por su ID o en el que se encuentra el mensaje

```sh
max conversations show <conversation> [message]
```

| Argumento | | Qué es |
|---|---|---|
| `conversation` | obligatorio |una identificación de conversación de `conversations list`; o un chat: su id, o parte de su título, con un mensaje.|
| `message` | opcional |un id de mensaje en ese chat: muestra la conversación en la que se encuentra.|

### `max conversations related`

las conversaciones más cercanas en significado a aquella en la que se encuentra el mensaje, en cada chat creado, mejor primero, a partir de los vectores `conversations embed` almacenados; no ejecuta ningún modelo

```sh
max conversations related <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `message` | obligatorio |una identificación de mensaje en ese chat.|

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos resultados. |
| `--model <model>` | local: un ID de modelo de `models text list` (predeterminado: e5-small); remoto: el modelo del proveedor. |
| `--provider <provider>` | proveedor de vectores: local u openai; las opciones prevalecen sobre los ajustes del perfil. |
| `--base-url <url>` | un servidor con /v1/embeddings de OpenAI: Gemini, Jina, u Ollama y LM Studio en este comando. |
| `--dims <n>` | remoto: el tamaño del vector — necesario con --base-url; acorta el de un modelo de OpenAI. |

### `max conversations status`

qué tan actualizadas son las conversaciones y los vectores de cada chat creado: mensajes que la compilación no ha visto, fragmentos con un vector actual, obsoleto o faltante

```sh
max conversations status [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | solo este chat: su ID o parte de su título. |
| `--model <model>` | local: un ID de modelo de `models text list` (predeterminado: e5-small); remoto: el modelo del proveedor. |
| `--provider <provider>` | proveedor de vectores: local u openai; las opciones prevalecen sobre los ajustes del perfil. |
| `--base-url <url>` | un servidor con /v1/embeddings de OpenAI: Gemini, Jina, u Ollama y LM Studio en este comando. |
| `--dims <n>` | remoto: el tamaño del vector — necesario con --base-url; acorta el de un modelo de OpenAI. |

### `max conversations batches`

ventanas de un chat para que su propio agente de IA las vincule: qué mensaje anterior responde cada uno

#### `max conversations batches status`

cuántos mensajes aún esperan respuesta, en cuántos lotes y cuánto texto

```sh
max conversations batches status [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | un chat: su ID o parte de su título. |
| `--size <n>` |mensajes para responder por lote, 10 a 200; 50 por defecto.|

#### `max conversations batches next`

la siguiente ventana para responder, con los mensajes anteriores; El texto del mensaje va solo a la salida estándar.

```sh
max conversations batches next [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | un chat: su ID o parte de su título. |
| `--size <n>` |mensajes para responder por lote, 10 a 200; 50 por defecto.|

### `max conversations links`

las respuestas de su agente: qué mensaje anterior responde cada mensaje de un lote

#### `max conversations links add`

almacene la respuesta de su agente en un lote, lea como JSON desde la entrada estándar: { "modelo", "respuestas": [{ "mensaje", "padre", "confianza" }] }; todo o nada

```sh
max conversations links add [options]
```

| Opción | Para qué sirve |
|---|---|
| `--batch <id>` |se imprime el ID de lote `conversations batches next`.|

#### `max conversations links clear`

deja las respuestas de tu agente para un chat, o solo las de un modelo; los mensajes nunca se tocan

```sh
max conversations links clear [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | un chat: su ID o parte de su título. |
| `--model <model>` |sólo las respuestas que dio este modelo.|

### `max conversations consents`

Permisos de análisis recordados para los chats de esta cuenta y los puntos finales del proveedor.

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
| `--chat <chat>` |revocar únicamente los consentimientos de este chat; predeterminado para cada chat.|
| `--provider <identity>` |identidad exacta del proveedor de la lista de consentimientos; por defecto para cada proveedor.|

### `max conversations embed`

calcular un vector para cada parte de las conversaciones de un chat para buscar por significado, en esta máquina o con el proveedor a través de un servicio y su clave; continúa donde se detuvo; sin --chat, a cada chat creado le quedan fragmentos, solo en esta máquina

```sh
max conversations embed [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | un chat: su ID o parte de su título. |
| `--model <model>` | local: un ID de modelo de `models text list` (predeterminado: e5-small); remoto: el modelo del proveedor. |
| `--provider <provider>` | proveedor de vectores: local u openai; las opciones prevalecen sobre los ajustes del perfil. |
| `--base-url <url>` | un servidor con /v1/embeddings de OpenAI: Gemini, Jina, u Ollama y LM Studio en este comando. |
| `--dims <n>` | remoto: el tamaño del vector — necesario con --base-url; acorta el de un modelo de OpenAI. |
| `--workers <n>` |local: sesiones en paralelo, cada una con su propia copia del modelo (\~0,7 GB cada una).|
| `--threads <n>` |local: subprocesos en total (predeterminado: min(8, núcleos)).|
| `--concurrency <n>` | remoto: solicitudes a la vez (predeterminado: 4). |
| `--max-tokens <n>` |remoto: deténgase antes de una ejecución que podría enviar más tokens que este.|
| `--max-chats <n>` |como máximo este número de chats por ejecución; 20 si no se indica.|
| `--max-chunks <n>` |como máximo esta cantidad de fragmentos incrustados en una sola ejecución; 2000 si no se proporciona y sin límite con --chat.|

#### `max conversations embed status`

cuántos fragmentos de un chat tienen un vector del modelo, cuántos quedan y lo que queda cuesta

```sh
max conversations embed status [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | un chat: su ID o parte de su título. |
| `--model <model>` | local: un ID de modelo de `models text list` (predeterminado: e5-small); remoto: el modelo del proveedor. |
| `--provider <provider>` | proveedor de vectores: local u openai; las opciones prevalecen sobre los ajustes del perfil. |
| `--base-url <url>` | un servidor con /v1/embeddings de OpenAI: Gemini, Jina, u Ollama y LM Studio en este comando. |
| `--dims <n>` | remoto: el tamaño del vector — necesario con --base-url; acorta el de un modelo de OpenAI. |

#### `max conversations embed clear`

soltar los vectores de un chat, o solo los de un modelo; Los mensajes y conversaciones nunca se tocan.

```sh
max conversations embed clear [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | un chat: su ID o parte de su título. |
| `--model <model>` | local: un ID de modelo de `models text list` (predeterminado: e5-small); remoto: el modelo del proveedor. |
| `--provider <provider>` | proveedor de vectores: local u openai; las opciones prevalecen sobre los ajustes del perfil. |
| `--base-url <url>` | un servidor con /v1/embeddings de OpenAI: Gemini, Jina, u Ollama y LM Studio en este comando. |
| `--dims <n>` | remoto: el tamaño del vector — necesario con --base-url; acorta el de un modelo de OpenAI. |

## `max attachments`

los archivos de mensajes almacenados: su texto en el archivo local, para el contenido: en una búsqueda

### `max attachments extract`

guardar el texto de archivos descargados — texto, capas de texto PDF/DOCX, ODT/ODS/XLSX/PPTX/EPUB — en el almacén local para buscar con content:

```sh
max attachments extract [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` |sólo los archivos de este chat; un chat: su id, o parte de su título.|
| `--from-dir <dir>` | asociar archivos de este directorio sin recorrer subdirectorios; requiere --chat. |
| `--cursor <cursor>` | continuar desde el cursor devuelto por una extracción con límites. |
| `--download` |Primero guarde los archivos que aún no se han descargado, desde Messenger, en --output-dir.|
| `--output-dir <dir>` |con --download, dónde guardarlos; creado si falta.|
| `--limit <n>` |leer como máximo esta cantidad de archivos; ejecútelo nuevamente para continuar.|
| `--ocr` | llamar explícitamente a models.ocr para extraer texto en lotes de imágenes y PDF escaneados. |
| `--concurrency <n>` | remoto: solicitudes a la vez (predeterminado: 4). |

### `max attachments list`

archivos de mensajes almacenados, dónde se guardó cada uno y si se conserva su texto, nunca el texto

```sh
max attachments list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` |sólo los archivos de este chat; un chat: su id, o parte de su título.|
| `--needs-text` |sólo archivos guardados aquí cuyo texto nadie tiene todavía: lo que un agente lee y escribe.|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | qué página, empezando por 1. |
| `--all` | todas las filas, sin paginar. |

### `max attachments show`

leer una porción limitada de un adjunto conservado; JSON incluye bytes en base64

```sh
max attachments show <chat> [message] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat: ID o parte de su título; o solo una ubicación msg:. |
| `message` | opcional | el ID del mensaje. |

| Opción | Para qué sirve |
|---|---|
| `--attachment <n>` | posición del archivo desde 1; obligatoria si hay varios archivos. |
| `--page <n>` | representar una página del PDF como PNG, desde 1; unpdf/canvas opcionales, sin OCR. |
| `--offset-bytes <n>` | desplazamiento en bytes desde 0. |
| `--chunk-bytes <n>` | bytes que devolver, 1–1048576 (por defecto524288). |
| `--if-sha256 <hash>` | exigir el SHA-256 del archivo completo de la porción anterior. |

### `max attachments text`

el texto de un archivo, mientras un agente lo lee

#### `max attachments text set`

mantenga el texto que un agente lee de un archivo (un escaneo, una foto) para que el contenido: lo encuentre; no se envía nada

```sh
max attachments text set <chat> [message] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título; o un localizador msg: sin ID de mensaje al final. |
| `message` | opcional | el ID del mensaje. |

| Opción | Para qué sirve |
|---|---|
| `--attachment <n>` |qué archivo del mensaje, de 1; necesario cuando tiene más de uno.|
| `--text-file <path>` |leer el texto de este archivo; - o ninguno lee la entrada estándar.|

## `max tags`

tus propias etiquetas en chats, personas y mensajes, guardadas en el archivo local y nunca enviadas; etiqueta: en una búsqueda los encuentra

### `max tags auto`

generar etiquetas locales de grupos y canales a partir de metadatos en caché mediante reglas de palabras clave

**Cambia algo solo en este ordenador.**

```sh
max tags auto [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | Grupo/canal guardado; repite para elegir varios. Por defecto: ``. |
| `--limit <number>` |Procesar 1–500 chats como máximo. Por defecto: `50`.|
| `--refresh-metadata` | Leer descripciones actuales del servicio antes de clasificar. |
| `--dry-run` | Previsualizar la clasificación guardada sin modificar el archivo. |

### `max tags add`

poner etiquetas en un chat, persona o mensaje

**Cambia algo solo en este ordenador.**

```sh
max tags add <tag> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `tag` | obligatorio |una o más etiquetas: de 1 a 32 letras de la a a la z, dígitos y guiones; Las mayúsculas se reducen.|

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` |el chat para etiquetar, o el chat de --message; un chat: su id, o parte de su título.|
| `--contact <person>` |la persona a etiquetar: su id, @nombredeusuario o nombre, como lo conoce el archivo local.|
| `--message <message>` |el mensaje a etiquetar: su id en --chat, o un localizador msg: solo.|

### `max tags remove`

quitar etiquetas de un chat, persona o mensaje

**Cambia algo solo en este ordenador.**

```sh
max tags remove <tag> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `tag` | obligatorio |una o más etiquetas: de 1 a 32 letras de la a a la z, dígitos y guiones; Las mayúsculas se reducen.|

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` |el chat para desetiquetar, o el chat de --message; un chat: su id, o parte de su título.|
| `--contact <person>` |la persona a desetiquetar: su id, @nombredeusuario o nombre, como lo conoce el archivo local.|
| `--message <message>` |el mensaje a desetiquetar: su id en --chat, o un mensaje: localizador solo.|
| `--source <manual\|auto>` | eliminar solo la atribución a este origen. |

### `max tags list`

qué está etiquetado: los chats y mensajes de esta cuenta, y las personas de su messenger

```sh
max tags list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--tag <tag>` |sólo esta etiqueta.|
| `--source <manual\|auto>` | solo etiquetas atribuidas a este origen. |
| `--type <names>` |sólo lo que esté etiquetado de este tipo: chat, contacto o mensaje.|

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

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | Grupo/canal guardado; repite para elegir varios. Por defecto: ``. |
| `--only-missing` |Solo chats sin metadatos; sin --chat, todos los grupos/canales guardados.|
| `--limit <number>` |Procesar 1–500 chats como máximo. Por defecto: `50`.|

## `max search`

buscar por texto: search all en todo lo que guarda el almacenamiento local, o en un solo recurso

### `max search all`

buscar en todo lo que guarda el almacenamiento local —mensajes del servicio de mensajería, correo y notas—, la mejor coincidencia primero; empieza aquí cuando no sepas dónde se escribió algo

```sh
max search all <query> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | obligatorio | consulta Lucene estricta: palabras, "frases", AND/OR/NOT, grupos de campos y rangos de fechas. |

| Opción | Para qué sirve |
|---|---|
| `--only <resources>` |solo estos, separados por comas: messages, mail, notes.|
| `--limit <n>` | cuántos resultados. |
| `--exact` |las palabras sin campo y las frases entre comillas coinciden solo en su forma exacta, como exact:word.|
| `--timezone <zone>` | la zona horaria IANA para los límites de las fechas del calendario. |

### `max search messages`

buscar mensajes del servicio de mensajería en el almacenamiento local y en el servidor del servicio (--backend); opcionalmente descargar mensajes nuevos con --sync-first

```sh
max search messages [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional |consulta estricta de Lucene: palabras, "frases", Y/O/NO, grupos de campos y rangos de fechas; --el legado del lenguaje mantiene el descubrimiento; con --saved, más palabras AND-ed.|

| Opción | Para qué sirve |
|---|---|
| `--sync-first` | primero descargar mensajes nuevos dentro de los límites de chat, tiempo y mensajes. |
| `--max-chats <n>` |actualizar como máximo este número de chats (predeterminado: 5).|
| `--sync-time <duration>` | dejar de descargar tras este tiempo (predeterminado: 30s). |
| `--max-messages <n>` | descargar como máximo este número de mensajes en total (predeterminado: 500). |
| `--thread` | la cadena de respuestas guardada en lugar de los mensajes cercanos en el tiempo; sin grafo se usa el comportamiento anterior. |
| `--thread-hops <n>` | como máximo este número de enlaces desde la coincidencia (predeterminado: 8). |
| `--thread-messages <n>` | como máximo este número de mensajes en el contexto de cada hilo (predeterminado: 50). |
| `--thread-bytes <n>` | como máximo este número de bytes de mensajes completos y enlaces en cada contexto (predeterminado: 65536). |
| `--thread-within <duration>` | mensajes dentro de este tiempo antes y después de la coincidencia (predeterminado: 1d). |
| `--backend <archive\|server\|both>` | dónde buscar: el archivo local, el servidor del servicio de mensajería o ambos (predeterminado: both). |
| `--server-time <duration>` | dejar de esperar al servidor tras este tiempo (predeterminado: 5s). |
| `--chat <chat>` | solo este chat — lo mismo que chat: en la consulta; un chat: su ID o parte de su título. |
| `--source <messenger>` |todas las cuentas de este servicio de mensajería en el almacenamiento; personal, bots o all — lo mismo que in: en la consulta.|
| `--type <text\|voice\|file>` | solo mensajes de este tipo: solo texto, mensaje de voz o archivo. |
| `--limit <n>` | cuántos resultados. |
| `--newest` | primero los más recientes en lugar de los mejores. |
| `--exact` |las palabras sin campo y las frases entre comillas coinciden solo en su forma exacta, como exact:word; text: sigue admitiendo todas las formas.|
| `--context <n>` |mensajes antes y después de cada resultado; 2 en la terminal, 0 en caso contrario.|
| `--language <lucene\|legacy>` | el lenguaje de consulta: Lucene estricto o la búsqueda anterior legacy. |
| `--timezone <zone>` | la zona horaria IANA para los límites de las fechas del calendario. |
| `--regex` | las palabras forman una expresión regular, sin distinguir mayúsculas, que se prueba con todo el texto guardado. |
| `--saved <name\|id>` |ejecutar una búsqueda guardada o una ejecución anterior; Las opciones escritas aquí reemplazan las suyas.|

### `max search mail`

buscar en el correo importado al almacenamiento local — lo trae memo mail import

```sh
max search mail [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | consulta Lucene estricta: palabras, "frases", AND/OR/NOT, grupos de campos y rangos de fechas. |

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | solo este hilo de correo, por ID o asunto. |
| `--limit <n>` | cuántos resultados. |
| `--newest` | primero los más recientes en lugar de los mejores. |
| `--exact` |las palabras sin campo y las frases entre comillas coinciden solo en su forma exacta, como exact:word; text: sigue admitiendo todas las formas.|
| `--context <n>` |mensajes antes y después de cada resultado; 2 en la terminal, 0 en caso contrario.|
| `--timezone <zone>` | la zona horaria IANA para los límites de las fechas del calendario. |

### `max search notes`

buscar en las notas —escritas en memo o importadas de una carpeta de notas— por palabras y, con el modelo de texto local, por significado; cada resultado indica cómo se encontró y a qué enlaza

```sh
max search notes <query> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | obligatorio | consulta Lucene estricta: palabras, "frases", AND/OR/NOT, tag: y rangos de fechas. |

| Opción | Para qué sirve |
|---|---|
| `--type <internal\|file>` | solo notas escritas en memo, o solo notas de una carpeta. |
| `--folder <id>` | solo esta carpeta de notas, por su ID; repite la opción para varias. |
| `--tag <tag>` | solo notas con esta etiqueta. |
| `--filter <query>` | una consulta que también debe cumplir cada resultado; no cambia la búsqueda por significado. |
| `--limit <n>` | cuántos resultados. |
| `--offset <n>` | omitir este número de resultados, para la página siguiente. |
| `--exact` | solo las palabras tal como se escriben; no se busca por significado. |
| `--timezone <zone>` | la zona horaria IANA para los límites de las fechas del calendario. |

### `max search conversations`

las conversaciones más cercanas a una consulta por significado y por palabras, las mejores primero, en un chat o en todos — por significado tras `conversations embed`; se ejecuta en este comando

```sh
max search conversations <query> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | obligatorio |qué buscar, en sus propias palabras, en cualquier idioma que lea el modelo.|

| Opción | Para qué sirve |
|---|---|
| `--model <model>` | local: un ID de modelo de `models text list` (predeterminado: e5-small); remoto: el modelo del proveedor. |
| `--provider <provider>` | proveedor de vectores: local u openai; las opciones prevalecen sobre los ajustes del perfil. |
| `--base-url <url>` | un servidor con /v1/embeddings de OpenAI: Gemini, Jina, u Ollama y LM Studio en este comando. |
| `--dims <n>` | remoto: el tamaño del vector — necesario con --base-url; acorta el de un modelo de OpenAI. |
| `--max-chats <n>` |como máximo esta cantidad de chats; 5 con --sync-first, 20 con --refresh si no se proporciona.|
| `--max-chunks <n>` |como máximo esta cantidad de fragmentos incrustados en una sola ejecución; 2000 si no se da.|
| `--sync-first` | primero descargar mensajes nuevos dentro de los límites de chat, tiempo y mensajes. |
| `--sync-time <duration>` | dejar de descargar tras este tiempo (predeterminado: 30s). |
| `--max-messages <n>` | descargar como máximo este número de mensajes en total (predeterminado: 500). |
| `--chat <chat>` | solo este chat: su ID o parte de su título. |
| `--since-time <time>` |solo aquellos que todavía funcionan en este momento ISO 8601, o hace 30 m/2 h/1 d, o más tarde.|
| `--filter <query>` |filtro estricto de Lucene: cualquier mensaje de una conversación debe coincidir; no cambia la consulta de significado.|
| `--source <source>` |cuentas para buscar: personales, bots, todas o un proveedor; El valor predeterminado es la cuenta activa.|
| `--timezone <zone>` |Zona horaria de IANA para fechas de filtrado; zona horaria del sistema de forma predeterminada.|
| `--limit <n>` | cuántos resultados. |
| `--refresh` |Primero construya e incruste, en esta máquina, los chats en el alcance que cambiaron o que nunca se crearon, dentro de --max-chats y --max-chunks.|

## `max searches`

búsquedas guardadas e historial de search messages y stats messages show en el almacenamiento local; --saved ejecuta una

### `max searches create`

guardar una búsqueda con un nombre sin ejecutarla; buscar mensajes --guardado <name> lo ejecuta

```sh
max searches create <name> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `name` | obligatorio |hasta 64 letras a–z, dígitos y guiones, no solo dígitos.|
| `query` | opcional |la consulta, como para los mensajes de búsqueda; ninguno coincide con todos los mensajes almacenados.|

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | solo este chat — lo mismo que chat: en la consulta; un chat: su ID o parte de su título. |
| `--source <messenger>` |todas las cuentas de este servicio de mensajería en el almacenamiento; personal, bots o all — lo mismo que in: en la consulta.|
| `--limit <n>` | cuántos resultados. |
| `--newest` | primero los más recientes en lugar de los mejores. |
| `--exact` |las palabras sin campo y las frases entre comillas coinciden solo en su forma exacta, como exact:word; text: sigue admitiendo todas las formas.|
| `--context <n>` |mensajes antes y después de cada resultado.|
| `--language <lucene\|legacy>` | el lenguaje de consulta: Lucene estricto o la búsqueda anterior legacy. |
| `--timezone <zone>` | la zona horaria IANA para los límites de las fechas del calendario. |
| `--regex` | las palabras forman una expresión regular, sin distinguir mayúsculas, que se prueba con todo el texto guardado. |
| `--by <chat\|sender\|day\|hour>` |por qué criterio agrupa el recuento stats messages show --saved.|
| `--selection <json>` | guardar la consulta de clasificación principal resuelta y sus opciones a partir de una vista detallada. |
| `--replace` |sobrescribir una búsqueda guardada con el mismo nombre.|

### `max searches show`

una búsqueda guardada o ejecución anterior: su consulta, opciones y con qué frecuencia se ejecutó

```sh
max searches show <name|id>
```

| Argumento | | Qué es |
|---|---|---|
| `name\|id` | obligatorio | el nombre de una búsqueda guardada o el ID de cualquier fila del historial de searches. |

### `max searches list`

las búsquedas guardadas, por nombre

```sh
max searches list
```

### `max searches history`

las búsquedas y recuentos que se realizaron, los más nuevos primero, incluidos los guardados; nunca sus resultados

```sh
max searches history [options]
```

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos resultados. |

### `max searches delete`

eliminar una búsqueda guardada o una ejecución del historial

```sh
max searches delete <name|id>
```

| Argumento | | Qué es |
|---|---|---|
| `name\|id` | obligatorio | el nombre de una búsqueda guardada o el ID de cualquier fila del historial de searches. |

### `max searches clear`

vaciar la historia; las búsquedas guardadas permanecen

```sh
max searches clear
```

## `max flood`

las esperas MAX solicitaron que este perfil se mantuviera y se retuvieran sus escrituras

### `max flood clear`

olvidarlos y levantar la pausa y el límite de ritmo del perfil cuando MAX ya no limite la cuenta; no cambia nada en MAX

```sh
max flood clear
```

## `max models`

Modelos que se ejecutan en esta máquina.

### `max models audio`

modelos de voz para transcribir mensajes de voz

#### `max models audio list`

los modelos de voz, el más adecuado primero, cuáles se descargan y cuál es el predeterminado

```sh
max models audio list
```

#### `max models audio download`

descargue un modelo de voz una vez, comparado con el sha256 que espera esta versión

```sh
max models audio download <model>
```

| Argumento | | Qué es |
|---|---|---|
| `model` | obligatorio |una identificación de modelo de `models audio list`.|

### `max models text`

modelos de búsqueda por significado

#### `max models text list`

los modelos de incrustación, el más adecuado primero, cuáles se descargan y cuál es el predeterminado

```sh
max models text list
```

#### `max models text download`

descargue un modelo de incrustación una vez, comparado con el sha256 que espera esta versión

```sh
max models text download <model> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `model` | obligatorio |una identificación de modelo de `models text list`.|

| Opción | Para qué sirve |
|---|---|
| `--accept-terms` |aceptar los términos de licencia del modelo, para un modelo que tiene los suyos propios.|

#### `max models text key`

Claves API para proveedores de incrustación y análisis

#### `max models text key set`

guardar una clave mediante entrada oculta o stdin; nunca como argumento

```sh
max models text key set <provider>
```

| Argumento | | Qué es |
|---|---|---|
| `provider` | obligatorio |openai, anthropic o el host de un servidor --base-url que quiere una clave.|

#### `max models text key remove`

olvidar una clave almacenada

```sh
max models text key remove <provider>
```

| Argumento | | Qué es |
|---|---|---|
| `provider` | obligatorio |openai, anthropic o el host de un servidor.|

## `max polls`

lee una encuesta, vota en ella, cierra la tuya, crea una

### `max polls show`

una encuesta y sus identificadores de respuesta, tal como lo lleva el mensaje ahora

```sh
max polls show <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `message` | obligatorio | el ID del mensaje que contiene la encuesta. |

### `max polls vote`

votar en una encuesta o retirar su voto; los demás lo ven a menos que la encuesta sea anónima

**Cambia algo en MAX.**

```sh
max polls vote <chat> <message> [answers] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `message` | obligatorio | el ID del mensaje que contiene la encuesta. |
| `answers` | opcional | answer ids, as `polls show` prints them. |

| Opción | Para qué sirve |
|---|---|
| `--retract` |retira tu voto.|

### `max polls close`

cierra tu propia encuesta; nadie puede votar después de eso y no se puede reabrir

**Cambia algo en MAX.**

```sh
max polls close <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `message` | obligatorio |la identificación de su propio mensaje que lleva la encuesta.|

### `max polls create`

enviar una encuesta a un chat, como mensaje propio; público a menos que --anónimo

**Cambia algo en MAX.**

```sh
max polls create <chat> <question> <answers> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `question` | obligatorio |la pregunta.|
| `answers` | obligatorio |dos respuestas o más.|

| Opción | Para qué sirve |
|---|---|
| `--topic <id>` |enviar a este tema del foro; no soportado por servicios de mensajería sin temas.|
| `--multiple` | people may pick several answers. |
| `--anonymous` |nadie ve qué opción eligió cada persona.|
| `--revote` | people may change their vote. |
| `--silent` |enviar sin notificación.|
| `--send-as <id>` | publicar como una de las identidades que enumera `chats send-as`; obligatorio cuando el chat publica como otra identidad de forma predeterminada. |
| `--send-id <id>` |repetir un proyecto cuyo resultado se desconocía, sin arriesgarse a una segunda encuesta.|

## `max reactions`

reaccionar a los mensajes

### `max reactions add`

pon tu reacción en un mensaje; reemplaza el que tenias

**Cambia algo en MAX.**

```sh
max reactions add <chat> <message> <emoji>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `message` | obligatorio | el ID del mensaje. |
| `emoji` | obligatorio |un emoji, por ejemplo 👍.|

### `max reactions remove`

quita tu reacción de un mensaje

**Cambia algo en MAX.**

```sh
max reactions remove <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `message` | obligatorio | el ID del mensaje. |

## `max recipients`

los chats a los que este perfil puede enviar, cuando la lista está activada

### `max recipients list`

los chats de la lista; vacío y apagado hasta el primer agregado

```sh
max recipients list
```

### `max recipients add`

permitir el envío a este chat; el primer agregado enciende la lista

**Cambia algo solo en este ordenador.**

```sh
max recipients add <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID del chat o parte de su nombre. |

### `max recipients remove`

deja de permitir este chat; la lista sigue encendida

**Cambia algo solo en este ordenador.**

```sh
max recipients remove <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio |ID de chat o el título como lo muestra la lista.|

### `max recipients clear`

vacíe la lista y apáguela: este perfil puede enviar a cualquier chat nuevamente

**Cambia algo solo en este ordenador.**

```sh
max recipients clear
```

## `max sends`

cada intento de envío desde este perfil, nunca el texto

### `max sends list`

intentos de envío, el más nuevo primero: enviado, rechazado, fallido o desconocido

```sh
max sends list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos mostrar. |

## `max inbox`

los mensajes no leídos de otras personas en cada chat; --nuevo por lo que llegó desde el último cheque

```sh
max inbox [options]
```

| Opción | Para qué sirve |
|---|---|
| `--new` |lo que llegó desde la última verificación, cada mensaje una vez, para ejecuciones programadas.|
| `--since-time <time>` |lo que llegó después de este tiempo ISO 8601, o hace 2h/1d; el punto guardado permanece igual.|
| `--limit <n>` |como máximo estos tantos por chat, los más nuevos.|
| `--all` |Chats silenciados y archivados también: excluidos a menos que te mencionen o te respondan.|
| `--kind <kinds>` |solo chats de este tipo, separados por comas: diálogo, grupo, canal, guardados.|
| `--transcribe` |convertir los mensajes de voz que aún no se han escuchado en texto, ya sea por el servicio de mensajería o por un modelo de esta máquina; puede tardar unos minutos.|
| `--model <id>` |qué modelo de voz descargado los escucha, con --transcribe; `models audio list` se los muestra.|
| `--mark-read` |también marque cada chat mostrado como leído, hasta el mensaje más reciente mostrado; el otro lado lo ve.|
| `--no-mark-read` |no lo hagas, independientemente de lo que diga la configuración catchUpMarksRead.|

## `max review`

cada mensaje, el tuyo también, en chats que cambiaron desde un momento, para revisar quién debe qué

```sh
max review [options]
```

| Opción | Para qué sirve |
|---|---|
| `--since-time <time>` |donde terminó la última revisión: ISO 8601, o hace 2 h/1 d; Hace 3 días si no se da.|
| `--chat <chat>` | solo este chat: su ID o parte de su título. |
| `--kind <kinds>` |solo chats de este tipo, separados por comas: diálogo, grupo, canal, guardados.|
| `--unanswered [duration]` |sólo preguntas para usted o los administradores de un grupo que nadie respondió, formuladas al menos hace tanto tiempo: 4 h, 1 d; 24h si no se da.|
| `--all` |Chats silenciados y archivados también: excluidos a menos que te mencionen o te respondan.|
| `--transcribe` |convertir los mensajes de voz que aún no se han escuchado en texto, ya sea por el servicio de mensajería o por un modelo de esta máquina; puede tardar unos minutos.|
| `--model <id>` |qué modelo de voz descargado los escucha, con --transcribe; `models audio list` se los muestra.|
| `--new` |Lo que cambió desde el último `review --new`, un punto por chat, para ejecuciones programadas.|
| `--mark-read` |también marque cada chat mostrado como leído, hasta el mensaje más reciente mostrado; el otro lado lo ve.|
| `--no-mark-read` |no lo hagas, independientemente de lo que diga la configuración catchUpMarksRead.|

## `max replies`

reglas que responden mensajes por usted, guardadas en un archivo de este perfil

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
| `--model <mode>` |modo de plantilla antiguo: fill-only o may-reword; usa bloques ai en su lugar.|
| `--as-reply` | enviar como respuesta al mensaje coincidente. |
| `--no-as-reply` | enviar sin vincular al mensaje coincidente. |
| `--per-chat <limit>` | como máximo esta cantidad por chat, como 1/12h. |
| `--per-person <limit>` | como máximo esta cantidad por persona, como 1/1d. |
| `--outside <hours>` | responder fuera de este intervalo en formato de 24 horas, como 09:00-19:00. |
| `--days <days>` | días del intervalo de trabajo, como mon-fri o sat,sun. |
| `--timezone <zone>` | zona horaria IANA del intervalo de trabajo. |
| `--no-hours` | borrar el intervalo de trabajo. |

### `max replies audience`

mostrar la audiencia de las respuestas, a quién pueden responder las reglas, o sustituir los campos indicados; un archivo nuevo responde a todos los destinatarios que coinciden con una regla

**Cambia algo solo en este ordenador.**

```sh
max replies audience [options]
```

| Opción | Para qué sirve |
|---|---|
| `--reply <mode>` |responder a todos o solo a los remitentes y chats de la lista: all, listed.|
| `--allow-people <ids>` | sustituir los identificadores de remitentes permitidos, separados por comas; vacío borra la lista. |
| `--allow-chats <ids>` |sustituir los identificadores de chats permitidos, separados por comas; vacío borra la lista.|
| `--deny-people <ids>` | sustituir los identificadores de remitentes prohibidos, separados por comas; vacío borra la lista; la prohibición tiene prioridad. |
| `--deny-chats <ids>` |sustituir los identificadores de chats prohibidos, separados por comas; vacío borra la lista; la prohibición tiene prioridad.|

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

qué habrían respondido las reglas en los mensajes almacenados, a quién y por qué: no envía nada, no cambia nada, nunca se conecta

```sh
max replies test [rule] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `rule` | opcional |sólo esta regla, por su ello; cada regla en el orden del archivo si no se proporciona.|

| Opción | Para qué sirve |
|---|---|
| `--since-time <time>` |desde esta hora ISO 8601, o hace 2h/1d; Hace 7 días si no se da.|
| `--ai` | llamar al modelo de respuesta configurado con datos de mensajes almacenados; requiere consentimiento para el modelo de respuesta, de lo contrario usa la alternativa. |

### `max replies pause`

detener todas las reglas de respuesta de este perfil a la vez, también un servicio en ejecución; reanudar lo deshace

```sh
max replies pause
```

### `max replies resume`

dejar que las reglas de respuesta respondan nuevamente después de una pausa

```sh
max replies resume
```

### `max replies status`

si las reglas pueden enviar, cuáles están vigentes y a quién pueden responder

```sh
max replies status
```

## `max serve`

manténgase conectado a MAX y transmita nuevos mensajes a `max watch`, hasta Ctrl-C

```sh
max serve [options]
```

| Opción | Para qué sirve |
|---|---|
| `--idle <duration>` |deténgase después de tanto tiempo sin que nadie lo use: 15 m, 1 h son 60 m.|

## `max server`

`max serve` en segundo plano: inicio, parada, reinicio, estado, registros; instalar agrega una unidad systemd o launchd

### `max server start`

comience a servir en segundo plano (a través de la unidad si hay una instalada) y responda una vez que se conecte

```sh
max server start [options]
```

| Opción | Para qué sirve |
|---|---|
| `--idle <duration>` | detenerse tras este tiempo sin uso — 15m, 1h. |

### `max server stop`

detener el servicio de este perfil: a través de la unidad si se ejecuta bajo uno

```sh
max server stop
```

### `max server restart`

detenerlo y empezar de nuevo

```sh
max server restart [options]
```

| Opción | Para qué sirve |
|---|---|
| `--idle <duration>` | detenerse tras este tiempo sin uso — 15m, 1h. |

### `max server status`

si el servicio se ejecuta para este perfil, desde cuándo, quién lo inició y la unidad, si la hay

```sh
max server status
```

### `max server logs`

Las últimas líneas de registro del servidor: del diario en systemd; de lo contrario, su archivo de registro.

```sh
max server logs [options]
```

| Opción | Para qué sirve |
|---|---|
| `-n, --lines <n>` | how many lines. Por defecto: `50`. |

### `max server install`

escriba una unidad de usuario systemd o un agente de lanzamiento para este perfil; no empieza nada

```sh
max server install
```

### `max server uninstall`

eliminar la unidad de este perfil; detenlo primero

```sh
max server uninstall
```

## `max watch`

imprimir nuevos mensajes a medida que llegan, desde un `max serve` en ejecución

```sh
max watch [options]
```

| Opción | Para qué sirve |
|---|---|
| `--events` |mostrar también ediciones, eliminaciones, reacciones, lecturas y cambios de chats; cada línea indica su evento.|

## `max config`

las configuraciones vigentes, y de dónde vino cada una

### `max config show`

el perfil, los perfiles que existen y cada configuración con su origen

```sh
max config show [options]
```

| Opción | Para qué sirve |
|---|---|
| `--bot` |la configuración que obtiene un comando `max bot` en este perfil, en lugar de la de la cuenta personal.|

### `max config migrate`

reemplazar la configuración de acceso heredada con permisos, preservando los niveles efectivos

**Cambia algo solo en este ordenador.**

```sh
max config migrate [options]
```

| Opción | Para qué sirve |
|---|---|
| `--dry-run` |muestra la migración sin escribir el archivo.|

### `max config set`

guardar una configuración en el archivo de configuración

**Cambia algo solo en este ordenador.**

```sh
max config set <setting> <value> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `setting` | obligatorio |uno de: límite, timeoutMs, color, registro, keepRunsForDays, readOnly, permitir, permisos, sendsPerHour, requestPerMinute, embeddingProvider, embeddingModel, embeddingBaseUrl, embeddingDims, análisisProvider, análisisModel, análisisBaseUrl, modelos, senderColors, catchUpMarksRead, searchCatchUp, servir, mcpTools, readOtherBots, updateCheck, SkillHint, transcribeModel, defaultProfile, searchStemmers.cyrillic, searchStemmers.latin.|
| `value` | obligatorio |un número, verdadero o falso, o para permitir una lista como enviar, reacción.|

| Opción | Para qué sirve |
|---|---|
| `--defaults` | cambiar lo que reciben todos los perfiles, no solo este. |
| `--personal` | solo para cuentas personales — la sección personal del archivo. |
| `--bot` | solo para bots — la sección bot del archivo. |

### `max config unset`

eliminar una configuración del archivo de configuración

**Cambia algo solo en este ordenador.**

```sh
max config unset <setting> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `setting` | obligatorio |uno de: límite, timeoutMs, color, registro, keepRunsForDays, readOnly, permitir, permisos, sendsPerHour, requestPerMinute, embeddingProvider, embeddingModel, embeddingBaseUrl, embeddingDims, análisisProvider, análisisModel, análisisBaseUrl, modelos, senderColors, catchUpMarksRead, searchCatchUp, servir, mcpTools, readOtherBots, updateCheck, SkillHint, transcribeModel, defaultProfile, searchStemmers.cyrillic, searchStemmers.latin.|

| Opción | Para qué sirve |
|---|---|
| `--defaults` | cambiar lo que reciben todos los perfiles, no solo este. |
| `--personal` | solo para cuentas personales — la sección personal del archivo. |
| `--bot` | solo para bots — la sección bot del archivo. |

## `max doctor`

el estado en que se encuentra esta instalación, sin contactar a MAX a menos que --online

```sh
max doctor [options]
```

| Opción | Para qué sirve |
|---|---|
| `--online` |también inicie sesión una vez, lea un chat e inicie el servidor MCP; no envía nada.|

### `max doctor report`

qué contiene un informe de problema y hacia dónde va; no escribe nada

#### `max doctor report create`

escribir un informe de problema en un archivo e imprimir cómo enviarlo

```sh
max doctor report create [options]
```

| Opción | Para qué sirve |
|---|---|
| `--run <id>` |la ejecución sobre la que trata el informe; el más nuevo falló si no se proporciona.|
| `--output <file>` |dónde escribirlo; un nuevo archivo en este directorio si no se proporciona.|

## `max runs`

ejecuciones registradas: qué hizo esta herramienta y cuándo

### `max runs list`

ejecuciones registradas, las más recientes primero

```sh
max runs list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` |how many to show. Por defecto: `20`.|

### `max runs show`

una ejecución: qué era y una línea por operación

```sh
max runs show <run-id>
```

| Argumento | | Qué es |
|---|---|---|
| `run-id` | obligatorio | un ID de `max runs list`. |

### `max runs path`

el directorio que contiene una ejecución

```sh
max runs path <run-id>
```

| Argumento | | Qué es |
|---|---|---|
| `run-id` | obligatorio | un ID de `max runs list`. |

## `max skill`

las instrucciones que recibe un agente para esta herramienta

### `max skill show`

print SKILL.md: `max skill install` lo coloca donde lo buscan Claude Code, Codex y Gemini CLI

```sh
max skill show [name]
```

| Argumento | | Qué es |
|---|---|---|
| `name` | opcional |una de las habilidades enviadas para una tarea: conversaciones de enlace.|

### `max skill install`

escriba SKILL.md en \~/.claude/skills/max-cli/ (Claude Code) y \~/.agents/skills/max-cli/ (Codex, Gemini CLI)

```sh
max skill install [options]
```

| Opción | Para qué sirve |
|---|---|
| `--for <agents>` |which agents to install for. Uno de: `claude`, `agents`, `all`. Por defecto: `all`.|

## `max commands`

Comandos, opciones y códigos de salida como JSON: inspecciona una ruta de comando por llamada.

### `max commands schema`

argv y esquemas de resultados de un comando, efectos, permisos y orientación sobre reintentos

```sh
max commands schema <path>
```

| Argumento | | Qué es |
|---|---|---|
| `path` | obligatorio |una ruta de comando, por ejemplo: stats messages show.|

## `max upgrade`

actualice max con el administrador de paquetes que lo instaló; --comprobar sólo miradas

```sh
max upgrade [options]
```

| Opción | Para qué sirve |
|---|---|
| `--check` |diga si existe una versión más nueva y no instale nada.|

## `max complete`

finalización del shell: `max complete zsh` imprime el script en el código fuente

```sh
max complete [words]
```

| Argumento | | Qué es |
|---|---|---|
| `words` | opcional |  |

## `max mcp`

servir este perfil a un agente a través de MCP, en stdin y stdout - `claude mcp add max -- max mcp`

```sh
max mcp [options]
```

| Opción | Para qué sirve |
|---|---|
| `--permission <key=level>` | sobrescribir un permiso solo para este servidor; repetir para más claves. |
| `--allow-dangerous` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-send` |obsoleto: usa permissions.messages.send en la configuración; no concede acceso.|
| `--confirm-send` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-mark-read` |obsoleto: usa permissions.chats.mark-read en la configuración; no concede acceso.|
| `--allow-delete` |obsoleto: usa permissions.messages.delete en la configuración; no concede acceso.|
| `--allow-moderate` |obsoleto: usa permissions.chats.moderate y las reglas del grupo; no concede acceso.|
| `--http` | ofrece el servidor HTTP en 127.0.0.1 para ChatGPT y Claude en el navegador a través de tu túnel; se aplican los permisos del perfil. |
| `--http-confirmation <mode>` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--port <port>` |el puerto local para --http (predeterminado 8765).|
| `--public-url <url>` |la dirección https del túnel que utilizan las aplicaciones del navegador, p. https://<name>.ts.net.|
| `--revoke` |olvide cada inicio de sesión proporcionado a una aplicación de navegador; cada uno debe iniciar sesión nuevamente.|

### `max mcp config`

imprima la entrada mcpServers para Claude Desktop, Cursor y otros, con las rutas completas; no escribe nada

```sh
max mcp config [options]
```

| Opción | Para qué sirve |
|---|---|
| `--permission <key=level>` | sobrescribir un permiso solo para este servidor; repetir para más claves. |
| `--allow-dangerous` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-send` |obsoleto: usa permissions.messages.send en la configuración; no concede acceso.|
| `--confirm-send` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-mark-read` |obsoleto: usa permissions.chats.mark-read en la configuración; no concede acceso.|
| `--allow-delete` |obsoleto: usa permissions.messages.delete en la configuración; no concede acceso.|
| `--allow-moderate` |obsoleto: usa permissions.chats.moderate y las reglas del grupo; no concede acceso.|

### `max mcp setup`

agregue el servidor MCP local de este perfil a Codex o Claude Code

**Cambia algo solo en este ordenador.**

```sh
max mcp setup <client> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `client` | obligatorio |codex o claude-code.|

| Opción | Para qué sirve |
|---|---|
| `--allow-writes` |Reconocer que este perfil ofrece herramientas de escritura.|
| `--permission <key=level>` | sobrescribir un permiso solo para este servidor; repetir para más claves. |
| `--allow-dangerous` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-send` |obsoleto: usa permissions.messages.send en la configuración; no concede acceso.|
| `--confirm-send` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-mark-read` |obsoleto: usa permissions.chats.mark-read en la configuración; no concede acceso.|
| `--allow-delete` |obsoleto: usa permissions.messages.delete en la configuración; no concede acceso.|
| `--allow-moderate` |obsoleto: usa permissions.chats.moderate y las reglas del grupo; no concede acceso.|

### `max mcp doctor`

consulte la lista de herramientas y protocolo de enlace MCP local de este perfil

```sh
max mcp doctor [options]
```

| Opción | Para qué sirve |
|---|---|
| `--permission <key=level>` | sobrescribir un permiso solo para este servidor; repetir para más claves. |
| `--allow-dangerous` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-send` |obsoleto: usa permissions.messages.send en la configuración; no concede acceso.|
| `--confirm-send` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-mark-read` |obsoleto: usa permissions.chats.mark-read en la configuración; no concede acceso.|
| `--allow-delete` |obsoleto: usa permissions.messages.delete en la configuración; no concede acceso.|
| `--allow-moderate` |obsoleto: usa permissions.chats.moderate y las reglas del grupo; no concede acceso.|

## `max bot`

un bot MAX, a través de la API de bot oficial y un token de bot, no su cuenta personal

### `max bot auth`

el token de bot que usa este perfil

#### `max bot auth set`

verifique un token de bot con MAX y luego guárdelo, escrito en un mensaje oculto o canalizado en stdin

**Cambia algo solo en este ordenador.**

```sh
max bot auth set
```

#### `max bot auth show`

de dónde proviene el token de bot de este perfil y qué bot es

```sh
max bot auth show
```

#### `max bot auth remove`

olvidar el token de bot de este perfil

**Cambia algo solo en este ordenador.**

```sh
max bot auth remove
```

### `max bot list`

cada nombre en esta máquina que tenga un token de bot; --check le pregunta a MAX qué bot es cada uno

```sh
max bot list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--check` |Pregúntale al servicio de mensajería quién es cada bot, con su token.|

### `max bot chats`

los chats en los que se encuentra este bot: MAX no le da al bot una lista de ellos, por lo que `list` muestra los que ha visto

#### `max bot chats list`

chats que este robot ha visto en esta máquina; no es una lista completa de MAX

```sh
max bot chats list
```

#### `max bot chats show`

un chat de MAX, y recuérdalo

```sh
max bot chats show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat, user:<id> para una persona o el título de un chat que este bot ha visto. |

#### `max bot chats leave`

sacar al bot de un chat; sólo un administrador del chat puede recuperarlo

**Cambia algo en MAX.**

```sh
max bot chats leave <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat o el título de un chat que este bot ha visto. |

#### `max bot chats action`

muestra lo que el bot está haciendo en un chat (escribiendo, enviando una foto) durante unos segundos

**Cambia algo en MAX.**

```sh
max bot chats action <chat> <action>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat, user:<id> para una persona o el título de un chat que este bot ha visto. |
| `action` | obligatorio |lo que ve el chat. Uno de: `typing`, `photo`, `video`, `voice`, `file`.|

#### `max bot chats admins`

los administradores de un chat en el que el bot es administrador

#### `max bot chats admins list`

Los administradores del chat y lo que cada uno puede hacer.

```sh
max bot chats admins list <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat o el título de un chat que este bot ha visto. |

#### `max bot chats admins add`

convertir a un miembro en administrador con estos derechos

**Cambia algo en MAX.**

```sh
max bot chats admins add <chat> <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat o el título de un chat que este bot ha visto. |
| `person` | obligatorio | el ID de usuario de la persona. |

| Opción | Para qué sirve |
|---|---|
| `--can <rights>` |qué pueden hacer, separados por comas: leer, miembros, administradores, información, fijar, vincular, editar, eliminar.|
| `--title <title>` |el título que se muestra al lado de su nombre.|

#### `max bot chats admins remove`

retirar los permisos de un administrador; ellos siguen siendo miembros

**Cambia algo en MAX.**

```sh
max bot chats admins remove <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat o el título de un chat que este bot ha visto. |
| `person` | obligatorio | el ID de usuario de la persona. |

#### `max bot chats members`

las personas en un chat en el que el bot es administrador

#### `max bot chats members remove`

sacar a una persona de un chat; sus mensajes permanecen

**Cambia algo en MAX.**

```sh
max bot chats members remove <chat> <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat o el título de un chat que este bot ha visto. |
| `person` | obligatorio | el ID de usuario de la persona. |

| Opción | Para qué sirve |
|---|---|
| `--block` |También evitar que regresen por el enlace del chat.|

#### `max bot chats members list`

miembros de un chat, una página a la vez — --marker toma el `marker` que proporcionó la última página

```sh
max bot chats members list <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio |  |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos, hasta 100. |
| `--marker <marker>` |continúa desde aquí.|

#### `max bot chats members add`

agregar personas a un chat por identificación de usuario; el bot debe ser un administrador que pueda agregar miembros

**Cambia algo en MAX.**

```sh
max bot chats members add <chat> <users>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio |  |
| `users` | obligatorio |  |

#### `max bot chats rules`

las reglas de moderación de un chat para este bot, mantenidas en esta máquina

#### `max bot chats rules show`

las reglas del chat; los valores predeterminados, marcados como no guardados, si aún no los tiene

```sh
max bot chats rules show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID del grupo o el título de un grupo que este bot ha visto. |

#### `max bot chats rules set`

cambie una regla: confiable, bloqueado, nombres bloqueados, enlaces, invitaciones, reenvíos, personas bloqueadas, mensajes de inundación, minutos de inundación, acción de inundación, días de cuenta nueva, acción de cuenta nueva, consentimiento.eliminar, consentimiento.eliminar

**Cambia algo solo en este ordenador.**

```sh
max bot chats rules set <chat> <key> <value>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID del grupo o el título de un grupo que este bot ha visto. |
| `key` | obligatorio | la regla. |
| `value` | obligatorio | its new value. |

#### `max bot chats rules unset`

devolver una regla a su valor predeterminado

**Cambia algo solo en este ordenador.**

```sh
max bot chats rules unset <chat> <key>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID del grupo o el título de un grupo que este bot ha visto. |
| `key` | obligatorio | la regla. |

#### `max bot chats moderate`

Juzga los nuevos mensajes de un grupo y las uniones según sus reglas, y actúa según lo permitan, como el bot.

**Cambia algo en MAX.**

```sh
max bot chats moderate <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID del grupo o el título de un grupo que este bot ha visto. |

| Opción | Para qué sirve |
|---|---|
| `--since-time <time>` |juzgue lo que vino después de este tiempo ISO 8601, o hace 2 h / 1 d; el punto guardado permanece.|
| `--dry-run` | evaluar y planificar; no hacer nada. |
| `--allow-dangerous` |sí a toda acción cuyo nivel en las reglas del grupo sea preguntar.|
| `--no-ban` |eliminar sin prohibir; De forma predeterminada, una persona eliminada no puede regresar mediante el enlace.|
| `--max-actions <n>` | como máximo este número de acciones por ejecución; 10 si no se indica. |

### `max bot messages`

los mensajes en los chats en los que se encuentra este bot

#### `max bot messages send`

enviar un mensaje como bot; sin [texto], el texto se lee desde stdin

**Cambia algo en MAX.**

```sh
max bot messages send <chat> [text] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat, user:<id> para una persona o el título de un chat que este bot ha visto. |
| `text` | opcional | el mensaje. |

| Opción | Para qué sirve |
|---|---|
| `--reply-to <message>` |Responde este mensaje, por su id en el mismo chat.|
| `--silent` | entregar sin notificación. |
| `--md` | interpretar el Markdown de este servicio de mensajería; la sintaxis admitida está en su guía de formato. |
| `--html` |el texto es HTML: <b>, <i>, <a href>, <code>.|
| `--file <file>` |adjuntar un archivo; el texto se convierte en su título.|
| `--photo <file>` |adjunte un .jpg, .png o .webp como foto; el texto se convierte en su título.|
| `--as-file` |envíe el --file como un archivo para descargar, un video incluido.|
| `--voice <file>` |envía un archivo Ogg Opus como mensaje de voz, solo, sin texto.|
| `--allow-any-file` |envíe un archivo incluso desde una carpeta oculta, \~/.ssh o las propias carpetas de esta CLI.|

#### `max bot messages list`

los últimos mensajes en un chat; donde MAX no le da historial al bot y con --offline, los que este bot ha visto en esta máquina

```sh
max bot messages list <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat, user:<id> para una persona o el título de un chat que este bot ha visto. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` |Cuantos, los más nuevos.|

#### `max bot messages show`

un mensaje por su id en un chat

```sh
max bot messages show <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat, user:<id> para una persona o el título de un chat que este bot ha visto. |
| `message` | obligatorio | ID del mensaje. |

#### `max bot messages edit`

reemplazar el texto de un mensaje que envió el bot

**Cambia algo en MAX.**

```sh
max bot messages edit <chat> <message> <text> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat, user:<id> para una persona o el título de un chat que este bot ha visto. |
| `message` | obligatorio | ID del mensaje. |
| `text` | obligatorio |el nuevo texto.|

| Opción | Para qué sirve |
|---|---|
| `--md` | interpretar el Markdown de este servicio de mensajería; la sintaxis admitida está en su guía de formato. |
| `--html` |el texto es HTML: <b>, <i>, <a href>, <code>.|

#### `max bot messages delete`

eliminar mensajes en un chat en el que el bot puede eliminar; no se puede deshacer

**Cambia algo en MAX.**

```sh
max bot messages delete <chat> <messages> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat, user:<id> para una persona o el título de un chat que este bot ha visto. |
| `messages` | obligatorio |identificadores de mensajes.|

| Opción | Para qué sirve |
|---|---|
| `--allow-dangerous` |eliminar sin preguntar.|

#### `max bot messages pin`

fijar un mensaje en un chat; silenciosamente a menos que --notifique

**Cambia algo en MAX.**

```sh
max bot messages pin <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat, user:<id> para una persona o el título de un chat que este bot ha visto. |
| `message` | obligatorio | ID del mensaje. |

| Opción | Para qué sirve |
|---|---|
| `--notify` |decirle a los miembros del chat.|

#### `max bot messages unpin`

desanclar un mensaje en un chat

**Cambia algo en MAX.**

```sh
max bot messages unpin <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat, user:<id> para una persona o el título de un chat que este bot ha visto. |
| `message` | obligatorio | ID del mensaje. |

#### `max bot messages between`

lo que dos o más personas escribieron en los chats en los que todos escribieron: desde la copia local, agrupados por chat, los más antiguos primero; --limitar recuentos por chat. Los chats comunes son en los que esta copia vio a cada uno de ellos escribir, no una lista de miembros de MAX.

```sh
max bot messages between <people> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `people` | obligatorio |dos o más personas: una identificación, @nombre de usuario o parte de un nombre cada uno.|

| Opción | Para qué sirve |
|---|---|
| `--all-bots` | leer también la copia de cualquier otro bot en este comando que permita readOtherBots. |
| `--bots <profiles>` | leer también las copias de estos bots, separados por comas — cada uno permitido por readOtherBots. |
| `--limit <n>` |cuántos de los últimos mensajes de cada chat.|

### `max bot search`

encontrar por texto lo que guarda el archivo local de este bot

#### `max bot search messages`

buscar los mensajes que este robot ha leído, enviado o recibido en esta máquina: solo la copia local, la mejor coincidencia primero; cada palabra debe aparecer; "una frase", -palabra, a OR b, de: chat: después: antes: tiene:; por texto, por --from o ambos

```sh
max bot search messages [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional |las palabras para encontrar.|

| Opción | Para qué sirve |
|---|---|
| `--all-bots` | leer también la copia de cualquier otro bot en este comando que permita readOtherBots. |
| `--bots <profiles>` | leer también las copias de estos bots, separados por comas — cada uno permitido por readOtherBots. |
| `--limit <n>` | cuántos resultados. |
| `--newest` | primero los más recientes en lugar de los mejores. |
| `--from <who>` |sólo lo que escribió esta persona: una identificación, @nombre de usuario o parte de un nombre; repítalo para cualquiera de varios.|

### `max bot recipients`

los chats en los que este bot puede escribir; sin lista, todos los chats: `clear` elimina la lista

#### `max bot recipients list`

los chats en la lista, o nada cuando no hay lista

```sh
max bot recipients list
```

#### `max bot recipients add`

permitir un chat: su id, `user:<id>`, o el título de un chat que este bot ha visto

**Cambia algo solo en este ordenador.**

```sh
max bot recipients add <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio |  |

#### `max bot recipients remove`

eliminar un chat de la lista

**Cambia algo solo en este ordenador.**

```sh
max bot recipients remove <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio |  |

#### `max bot recipients clear`

eliminar la lista: el bot puede volver a escribir en cualquier chat

**Cambia algo solo en este ordenador.**

```sh
max bot recipients clear
```

### `max bot sends`

Lo que este robot envió, editó y eliminó de esta máquina: identificadores y resultados, nunca mensajes de texto.

#### `max bot sends list`

```sh
max bot sends list
```

### `max bot watch`

imprima mensajes nuevos a medida que lleguen y guárdelos, hasta Ctrl-C o --timeout (cualquiera de los dos finaliza normalmente)

```sh
max bot watch [options]
```

| Opción | Para qué sirve |
|---|---|
| `--events` |también ediciones, eliminaciones, botones presionados y personas yendo y viniendo; cada línea nombra su evento.|
| `--types <types>` |sólo estos tipos de actualización, separados por comas, en palabras del servicio de mensajería.|

### `max bot callbacks`

respuestas a los botones que la gente presiona debajo de los mensajes del bot

#### `max bot callbacks answer`

responder a un botón presionado por su ID de devolución de llamada: --la notificación muestra a la persona una nota única, --el texto reemplaza el mensaje en el que estaba el botón

**Cambia algo en MAX.**

```sh
max bot callbacks answer <callback> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `callback` | obligatorio |se imprime el ID de devolución de llamada `bot watch`.|

| Opción | Para qué sirve |
|---|---|
| `--text <text>` |el nuevo texto del mensaje.|
| `--notification <text>` |una nota que sólo ve la persona que presionó.|

### `max bot commands`

el menú de comandos del bot: lo que la gente ve después /

#### `max bot commands list`

los comandos en el menú ahora

```sh
max bot commands list
```

#### `max bot commands set`

reemplace todo el menú: cada comando como nombre = descripción, p. inicio=comenzar

**Cambia algo en MAX.**

```sh
max bot commands set <commands>
```

| Argumento | | Qué es |
|---|---|---|
| `commands` | obligatorio |nombre=descripción, uno por comando.|

#### `max bot commands clear`

vaciar el menú

**Cambia algo en MAX.**

```sh
max bot commands clear
```

### `max bot webhooks`

donde el servicio de mensajería envía las actualizaciones de este bot: mientras una está configurada, `bot watch` no recibe nada

#### `max bot webhooks list`

los webhooks que tiene este bot

```sh
max bot webhooks list
```

#### `max bot webhooks set`

enviar las actualizaciones de este bot a una dirección HTTPS; rechazado mientras se establece otro

**Cambia algo en MAX.**

```sh
max bot webhooks set <url> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `url` | obligatorio |la dirección HTTPS.|

| Opción | Para qué sirve |
|---|---|
| `--types <types>` |sólo estos tipos de actualización, separados por comas, en palabras del servicio de mensajería.|
| `--secret-stdin` |un secreto que el servicio de mensajería envía con cada actualización, solicitado o leído desde una tubería.|
| `--add` |mantenga los webhooks ya configurados y agregue este junto a ellos.|

#### `max bot webhooks delete`

dejar de enviar actualizaciones a esta dirección; sin nada restante, `bot watch` vuelve a funcionar

**Cambia algo en MAX.**

```sh
max bot webhooks delete <url>
```

| Argumento | | Qué es |
|---|---|---|
| `url` | obligatorio |la dirección.|

### `max bot contacts`

personas que este robot ha visto escribir, desde la copia local en esta máquina, nunca preguntando a MAX a menos que se le indique

#### `max bot contacts show`

una persona: los chats en los que escribió (con su último mensaje allí) y los últimos mensajes de su chat privado con el bot

```sh
max bot contacts show <who> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `who` | obligatorio |una identificación, @nombre de usuario o parte de un nombre.|

| Opción | Para qué sirve |
|---|---|
| `--all-bots` | leer también la copia de cualquier otro bot en este comando que permita readOtherBots. |
| `--bots <profiles>` | leer también las copias de estos bots, separados por comas — cada uno permitido por readOtherBots. |
| `--limit <n>` |cuantos mensajes del chat privado.|
| `--refresh` |Primero lea el chat privado con ellos nuevamente desde el Messenger: una solicitud.|

### `max bot store`

la copia local del bot en esta máquina

#### `max bot store fetch`

buscar el historial de un chat en la copia local del bot, el más nuevo primero; ejecútelo nuevamente para continuar

```sh
max bot store fetch <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat o el título de un chat que este bot ha visto. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` |como máximo esta cantidad de mensajes en esta ejecución; 1000 si no se da.|
| `--page-size <n>` |cuántos mensajes solicita una solicitud; 100 si no se da.|
| `--pause <duration>` |pausa entre páginas, para permanecer por debajo de los límites del servicio de mensajería. Por defecto: `1s`.|
| `--since-time <time>` |deténgase una vez que llegue a mensajes anteriores a este: ISO 8601, o hace 2 h/1 d.|
| `--last <n>` |se detiene una vez que se retienen los n mensajes más nuevos.|

### `max bot mcp`

servir este bot a un agente a través de MCP, en stdin y stdout - `claude mcp add sales-bot -- max sales bot mcp`

```sh
max bot mcp [options]
```

| Opción | Para qué sirve |
|---|---|
| `--confirm-send` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-dangerous` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-send` | ya no se usa — deciden los permisos del perfil; se mantiene para que una configuración antigua siga arrancando. |
| `--allow-delete` | ya no se usa — deciden los permisos del perfil. |
| `--allow-moderate` | ya no se usa — deciden los permisos del perfil. |

#### `max bot mcp config`

imprima la entrada mcpServers para Claude Desktop, Cursor y otros, con las rutas completas; no escribe nada

```sh
max bot mcp config [options]
```

| Opción | Para qué sirve |
|---|---|
| `--confirm-send` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-dangerous` | ya no se usa — las operaciones de escritura no muestran un formulario; deciden los permisos del perfil. |
| `--allow-send` | ya no se usa — deciden los permisos del perfil; se mantiene para que una configuración antigua siga arrancando. |
| `--allow-delete` | ya no se usa — deciden los permisos del perfil. |
| `--allow-moderate` | ya no se usa — deciden los permisos del perfil. |

### `max bot me`

El bot al que pertenece el token de este perfil: nombre, identificación, descripción, comandos.

```sh
max bot me
```

### `max bot comments`

comentarios debajo de una publicación de canal: cada comando toma primero la identificación del mensaje de la publicación (mediados...)

#### `max bot comments list`

los comentarios debajo de una publicación, los más nuevos últimos

```sh
max bot comments list <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `message` | obligatorio |  |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos, hasta 100. |

#### `max bot comments get`

un comentario debajo de una publicación

```sh
max bot comments get <message> <comment>
```

| Argumento | | Qué es |
|---|---|---|
| `message` | obligatorio |  |
| `comment` | obligatorio |  |

#### `max bot comments send`

comentar debajo de una publicación como el bot; - lee la entrada estándar

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
| `--format <format>` |cómo se marca el texto. Uno de: `markdown`, `html`.|

#### `max bot comments edit`

reemplazar el texto de un comentario que escribió el bot; - lee la entrada estándar

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
| `--format <format>` |cómo se marca el texto. Uno de: `markdown`, `html`.|

#### `max bot comments delete`

eliminar un comentario debajo de una publicación

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
| `--allow-dangerous` |omitir la confirmación de bot.messages.delete en el nivel ask.|

### `max bot uploads`

archivos subidos a MAX, para adjuntar a un mensaje

#### `max bot uploads put`

cargue un archivo desde el disco e imprimal archivo adjunto para colocar el `attachments` de un mensaje: `messages send --file` realiza ambos pasos a la vez

**Cambia algo en MAX.**

```sh
max bot uploads put <file> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio |  |

| Opción | Para qué sirve |
|---|---|
| `--type <type>` |subirlo como este tipo en lugar de adivinar por extensión. Uno de: `image`, `video`, `audio`, `file`.|

### `max bot api`

cada operación de la API de Bot oficial, generada a partir de su esquema: docs/dev/bot-api-coverage.md

```sh
max bot api [options]
```

| Opción | Para qué sirve |
|---|---|
| `--store-token <profile>` |mantener un token de autenticación devuelto solo en el conjunto de claves del sistema operativo de este perfil de bot; nunca lo imprimas.|

#### `max bot api get-my-info`

Obtenga información actual del bot: lea (GET /me)

```sh
max bot api get-my-info
```

#### `max bot api edit-my-commands`

Editar comandos de bot actuales: escribir (PATCH /me/commands)

**Cambia algo en MAX.**

```sh
max bot api edit-my-commands [options]
```

| Opción | Para qué sirve |
|---|---|
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

#### `max bot api get-chat`

Obtener chat - leer (GET /chats/{chatId})

```sh
max bot api get-chat [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` |Chat solicitado o identificador de canal.|

#### `max bot api edit-chat`

Editar información del chat o del canal: escribir (PATCH /chats/{chatId})

**Cambia algo en MAX.**

```sh
max bot api edit-chat [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat o canal. |
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

#### `max bot api send-action`

Enviar acción – escribir (POST /chats/{chatId}/actions)

**Cambia algo en MAX.**

```sh
max bot api send-action [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat. |
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

#### `max bot api get-pinned-message`

Obtener mensaje fijado: leer (GET /chats/{chatId}/pin)

```sh
max bot api get-pinned-message [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` |Identificador de chat para obtener su mensaje fijado.|

#### `max bot api pin-message`

Fijar mensaje: escribir (PUT /chats/{chatId}/pin)

**Cambia algo en MAX.**

```sh
max bot api pin-message [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` |Identificador de chat donde se debe fijar el mensaje.|
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

#### `max bot api unpin-message`

Desanclar mensaje: escribir (BORRAR /chats/{chatId}/pin)

**Cambia algo en MAX.**

```sh
max bot api unpin-message [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` |Identificador de chat para eliminar mensajes fijados.|

#### `max bot api get-membership`

Obtenga membresía de chat o canal: lea (GET /chats/{chatId}/members/me)

```sh
max bot api get-membership [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat o canal. |

#### `max bot api leave-chat`

Abandonar el chat: destructivo (BORRAR /chats/{chatId}/members/me)

**Cambia algo en MAX.**

```sh
max bot api leave-chat [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat o canal. |

#### `max bot api get-admins`

Obtenga administradores de chat o canal: lea (GET /chats/{chatId}/members/admins)

```sh
max bot api get-admins [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat o canal. |

#### `max bot api post-admins`

Establecer administradores de chat o canal: escriba (POST /chats/{chatId}/members/admins)

**Cambia algo en MAX.**

```sh
max bot api post-admins [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat o canal. |
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

#### `max bot api delete-admins`

Revocar derechos de administrador: escriba (BORRAR /chats/{chatId}/members/admins/{userId})

**Cambia algo en MAX.**

```sh
max bot api delete-admins [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat o canal. |
| `--user-id <value>` | User identifier. |

#### `max bot api get-members`

Obtener miembros: lea (GET /chats/{chatId}/members)

```sh
max bot api get-members [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat o canal. |
| `--user-ids <value>` |Lista separada por comas de identificadores de usuarios para obtener su membresía. Cuando se pasa este parámetro, se ignoran tanto `count` como `marker`.|
| `--marker <value>` | Marker. |
| `--count <value>` | Count. |

#### `max bot api add-members`

Agregar miembros: escriba (POST /chats/{chatId}/members)

**Cambia algo en MAX.**

```sh
max bot api add-members [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat. |
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

#### `max bot api remove-member`

Eliminar miembro: escriba (BORRAR /chats/{chatId}/members)

**Cambia algo en MAX.**

```sh
max bot api remove-member [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat o canal. |
| `--user-id <value>` |ID de usuario para eliminar del chat o canal.|
| `--block <value>` |Establezca en `true` si el usuario debe ser bloqueado en el chat.|

#### `max bot api get-subscriptions`

Obtener suscripciones: leer (OBTENER /suscripciones)

```sh
max bot api get-subscriptions
```

#### `max bot api subscribe`

Suscribirse — escritura (POST /subscriptions)

**Cambia algo en MAX.**

```sh
max bot api subscribe [options]
```

| Opción | Para qué sirve |
|---|---|
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

#### `max bot api unsubscribe`

Cancelar suscripción — escritura (DELETE /subscriptions)

**Cambia algo en MAX.**

```sh
max bot api unsubscribe [options]
```

| Opción | Para qué sirve |
|---|---|
| `--url <value>` |URL para eliminar de las suscripciones a WebHook.|

#### `max bot api get-upload-url`

Obtener URL de carga: escribir (POST /uploads)

**Cambia algo en MAX.**

```sh
max bot api get-upload-url [options]
```

| Opción | Para qué sirve |
|---|---|
| `--type <value>` |Tipo de archivo subido: image, audio, video, file.|

#### `max bot api get-messages`

Recibir mensajes: leer (GET /messages)

```sh
max bot api get-messages [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` |Identificador de chat o canal para recibir mensajes en el chat o canal.|
| `--message-ids <value>` |Lista separada por comas de identificadores de mensajes que se deben obtener.|
| `--from <value>` |Hora de inicio de los mensajes solicitados: utilícela después.|
| `--to <value>` |Hora de finalización de los mensajes solicitados: utilice antes en su lugar.|
| `--before <value>` |Mensajes antes de la marca de tiempo.|
| `--after <value>` |Mensajes después de la marca de tiempo.|
| `--count <value>` |Cantidad máxima de mensajes en respuesta.|

#### `max bot api send-message`

Enviar mensaje - escribir (POST /mensajes)

**Cambia algo en MAX.**

```sh
max bot api send-message [options]
```

| Opción | Para qué sirve |
|---|---|
| `--user-id <value>` |Complete este parámetro si desea enviar un mensaje al usuario.|
| `--chat-id <value>` |Complete esto si envía mensaje al chat o canal.|
| `--disable-link-preview <value>` |Si es `false`, el servidor no generará una vista previa de medios para enlaces en texto.|
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

#### `max bot api edit-message`

Editar mensaje - escribir (PUT /mensajes)

**Cambia algo en MAX.**

```sh
max bot api edit-message [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` |Editar identificador de mensaje.|
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

#### `max bot api delete-message`

Eliminar mensaje: destructivo (BORRAR /mensajes)

**Cambia algo en MAX.**

```sh
max bot api delete-message [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` |Eliminando identificador de mensaje.|
| `--allow-dangerous` |omitir la confirmación de bot.messages.delete en el nivel ask.|

#### `max bot api get-message-by-id`

Obtener mensaje: leer (GET /messages/{messageId})

```sh
max bot api get-message-by-id [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` |Identificador de mensaje (`mid`) para recibir un solo mensaje en el chat o canal.|

#### `max bot api get-comments`

Obtener comentarios: leer (GET /messages/{messageId}/comments)

```sh
max bot api get-comments [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` | ID (`mid`) del mensaje comentado. |
| `--comment-ids <value>` |Lista separada por comas de identificadores de comentarios que se deben obtener.|
| `--before <value>` |Comentarios antes de la marca de tiempo.|
| `--after <value>` |Comentarios después de la marca de tiempo.|
| `--count <value>` |Cantidad máxima de comentarios en respuesta.|

#### `max bot api send-comment`

Enviar comentario - escribir (POST /messages/{messageId}/comments)

**Cambia algo en MAX.**

```sh
max bot api send-comment [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` | ID (`mid`) del mensaje comentado. |
| `--disable-link-preview <value>` |Si es `false`, el servidor no generará una vista previa de medios para enlaces en texto.|
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

#### `max bot api edit-comment`

Editar comentario: escribir (PUT /messages/{messageId}/comments)

**Cambia algo en MAX.**

```sh
max bot api edit-comment [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` | ID (`mid`) del mensaje comentado. |
| `--comment-id <value>` | Editing comment identifier. |
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

#### `max bot api delete-comment`

Eliminar comentario: destructivo (BORRAR /messages/{messageId}/comments)

**Cambia algo en MAX.**

```sh
max bot api delete-comment [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` | ID (`mid`) del mensaje comentado. |
| `--comment-id <value>` | Deleting comment identifier. |
| `--allow-dangerous` |omitir la confirmación de bot.messages.delete en el nivel ask.|

#### `max bot api get-comment-by-id`

Obtener comentario: leer (GET /messages/{messageId}/comments/{commentId})

```sh
max bot api get-comment-by-id [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` | ID (`mid`) del mensaje comentado. |
| `--comment-id <value>` |Identificador de comentario (`mid`) para obtener un comentario único en el canal.|

#### `max bot api get-video-attachment-details`

Obtenga detalles del video: lea (GET /videos/{videoToken})

```sh
max bot api get-video-attachment-details [options]
```

| Opción | Para qué sirve |
|---|---|
| `--video-token <value>` | Video attachment token. |

#### `max bot api answer-on-callback`

Responder a un callback — escritura (POST /answers)

**Cambia algo en MAX.**

```sh
max bot api answer-on-callback [options]
```

| Opción | Para qué sirve |
|---|---|
| `--callback-id <value>` |Identifica un botón en el que hizo clic el usuario. El bot recibe este identificador después de que el usuario presiona el botón como parte de `MessageCallbackUpdate`.|
| `--disable-link-preview <value>` |Si es `true`, el servidor no generará una vista previa de medios para los enlaces en el texto del mensaje actualizado.|
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

#### `max bot api get-updates`

Obtener actualizaciones — escritura (GET /updates)

**Cambia algo en MAX.**

```sh
max bot api get-updates [options]
```

| Opción | Para qué sirve |
|---|---|
| `--limit <value>` |Número máximo de actualizaciones que se recuperarán.|
| `--poll-timeout <value>` |Tiempo de espera en segundos para long polling.|
| `--marker <value>` |Pase `null` para obtener actualizaciones que aún no recibió.|
| `--types <value>` |Lista separada por comas de los tipos de actualizaciones que su bot desea recibir.|

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
