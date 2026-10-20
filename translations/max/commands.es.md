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
consulta los chats del perfil `personal`. La variable `MAX_PROFILE` fija el perfil para toda la sesión
de la terminal.
**El perfil nunca se da por supuesto**: si no lo indicas, un comando que necesita una cuenta se detiene
y enumera los perfiles de este ordenador, aunque solo haya uno. El primer inicio de sesión también lleva
nombre: `max personal setup`. Sin perfil solo funcionan los comandos que no necesitan una cuenta:
`--help`, `--version`, `commands`, `skill show`, `account list`, `config show`.

Las descripciones se han traducido para esta guía. La salida literal de `max --help` sigue en inglés;
los nombres de los comandos, opciones y códigos de salida no cambian.

## Opciones generales

Se aplican a todos los comandos.

| Opción | Para qué sirve |
|---|---|
| `-V, --version` |generar el número de versión.|
| `-v, --verbose` |más detalle en lo que se muestra: -v ids, -vv todo lo que sabemos. Por defecto: `0`.|
| `--json` | salida legible por máquina: un único valor JSON en la salida estándar; --json=id,text conserva solo esos campos. |
| `--jsonl` |Salida legible por máquina: un objeto JSON por línea, para streaming y jq.|
| `--quiet` |diagnóstico desactivado.|
| `--trace` |una línea por solicitud en stderr: identificadores y tiempos, nunca contenido del mensaje.|
| `--debug` | si algo falla, su registro completo (causa y pila) en lugar de la línea breve. |
| `--timeout <duration>` |abandone todo el comando después de esto: 30 s, 2 m, 500 ms.|
| `--offline` |responder de lo grabado y nunca conectarse; falla si no fuera nada.|
| `--no-input` | no pedir entrada ni abrir un inicio de sesión interactivo; la entrada mediante una tubería sigue disponible. |
| `--max-input-bytes <bytes>` | máximo de bytes de entrada almacenados en búfer (predeterminado: 16777216). |
| `--max-output-bytes <bytes>` | máximo de bytes de salida para máquinas (predeterminado: 4194304; 0 desactiva el límite). |
| `--brief` | los mensajes encontrados solo con referencia, título, hora, remitente y fragmento. |
| `--full` | los mensajes encontrados con todo su texto y todos los campos del proveedor. |
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

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max session start [method]
```

| Argumento | | Qué es |
|---|---|---|
| `method` | opcional |token (pegado o por stdin), qr, qr-chrome o sms. Uno de: `token`, `qr`, `qr-chrome`, `sms`. Por defecto: `token`.|

**Returns:** log this profile in to MAX

**Example:** `max session start`

### `max session end`

cerrar la sesión de este perfil en MAX y eliminar la sesión guardada aquí

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max session end
```

**Returns:** log this profile out on MAX's side and forget the session here

**Example:** `max session end`

## `max setup`

configure su cuenta MAX personal y conecte a su agente

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max setup [options]
```

| Opción | Para qué sirve |
|---|---|
| `--agent <agent>` |instalar la habilidad para este agente; pregunta en una terminal, de lo contrario ninguno. Uno de: `none`, `codex`, `cursor`, `claude`, `gemini`, `all`.|
| `--method <method>` |cómo iniciar sesión cuando no hay sesión. Uno de: `token`, `qr`, `qr-chrome`, `sms`. Por defecto: `qr`.|

**Returns:** set up your personal MAX account and connect your agent

**Example:** `max setup`

## `max account`

la cuenta iniciada

### `max account list`

todos los perfiles de este ordenador y sus cuentas; no consulta el servicio de mensajería

```sh
max account list
```

**Returns:** every profile on this computer, and the account each is logged in as; asks the messenger…

**Example:** `max account list`

### `max account show`

con quién se ha iniciado sesión en este perfil; el número de teléfono muestra sus últimos cuatro dígitos

```sh
max account show [options]
```

| Opción | Para qué sirve |
|---|---|
| `--show-phone` | mostrar el número de teléfono completo. |

**Returns:** account — provider, id, name, username, phone, scope; every field: max commands schema account show

**Example:** `max account show`

### `max account update`

cambia el nombre, la descripción o la foto que todos ven en tu perfil

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max account update [options]
```

| Opción | Para qué sirve |
|---|---|
| `--first-name <name>` | your first name. |
| `--last-name <name>` | your last name. |
| `--description <text>` | about you. |
| `--photo <file>` |una nueva foto de perfil: un archivo de imagen.|

**Returns:** change the name, the description or the photo everyone sees on your profile

**Example:** `max account update`

### `max account sessions`

¿En qué otro lugar se inició sesión con esta cuenta? No en `max session`, que es el inicio de sesión propio de esta herramienta.

#### `max account sessions list`

cada dispositivo y aplicación que haya iniciado sesión en esta cuenta; nada ha terminado

```sh
max account sessions list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | condiciones campo:valor; esta lista aún no filtra por ninguno. |

**Returns:** account session — current, client, device, location, last_active_at, created_at; every field: max commands schema account sessions list

**Example:** `max account sessions list`

#### `max account sessions end`

cierre sesión en todos los demás dispositivos, incluido su teléfono; este se queda

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max account sessions end [options]
```

| Opción | Para qué sirve |
|---|---|
| `--others` |todas las sesiones excepto ésta.|

**Returns:** log out every other device, your phone included; this one stays

**Example:** `max account sessions end`

### `max account privacy`

quién puede encontrar la cuenta, llamar o añadirla

#### `max account privacy show`

ajustes de privacidad de la cuenta; leerlos no cambia nada

```sh
max account privacy show
```

**Returns:** the account's privacy settings; reading changes nothing

**Example:** `max account privacy show`, `max account privacy show --json`

#### `max account privacy set`

cambiar quién puede encontrar la cuenta, llamar o añadirla; los demás ajustes se conservan

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max account privacy set [options]
```

| Opción | Para qué sirve |
|---|---|
| `--find-by-phone <who>` |quién encuentra la cuenta por su número: everyone, contacts o nobody; MAX admite everyone y contacts.|
| `--phone-number <who>` |quién ve el número: everyone, contacts o nobody.|
| `--calls <who>` | de quién suenan las llamadas: everyone, contacts o nobody. |
| `--chat-invites <who>` |quién puede añadir la cuenta a grupos y canales: everyone, contacts o nobody.|
| `--hide-online <on\|off>` | ocultar el estado en línea y la última conexión. |

**Returns:** change who may find, call or add the account; the settings not named stay

**Example:** `max account privacy set --find-by-phone contacts`, `max account privacy set --hide-online on`

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

**Returns:** calls made and received, newest first; reading changes nothing

**Example:** `max calls list`

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

**Returns:** sticker sets, or with --set the stickers in one; reading changes nothing

**Example:** `max stickers list`

## `max chats`

los chats en los que está esta cuenta

### `max chats list`

chats, los más recientes primero, archivados incluidos; la consulta se responde desde el almacén local, así que en línea, donde el mensajero no filtra nada, necesita --offline

```sh
max chats list [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | condiciones campo:valor que acotan la lista; los campos están abajo. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | qué página, empezando por 1. |
| `--all` | todas las filas, sin paginar. |

**Returns:** chat — ref, id, title, kind, unread_count, last_message_at, participants_count, provider, and 12 more; every field: max commands schema chats list

**Next usually:** `max chats show <chat>`, `max chats events <chat> [query]`, `max chats media <chat>`

**Example:** `max chats list`

### `max chats show`

un chat: su tipo, recuento de no leídos, hora del último mensaje y quién está en él

```sh
max chats show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

**Returns:** chat — ref, id, title, kind, unread_count, last_message_at, participants_count, provider, and 12 more; every field: max commands schema chats show

**Next usually:** `max chats events <chat> [query]`, `max chats media <chat>`, `max chats documents list <chat>`

**Example:** `max chats show Team`

### `max chats documents`

los documentos de Google Docs y Drive enlazados en los mensajes guardados de un chat

#### `max chats documents list`

cada enlace a un documento del chat, del más reciente al más antiguo, e indica si está en el almacén

```sh
max chats documents list <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | qué página, empezando por 1. |

**Returns:** every document link in the chat, newest first, and whether the store has it

**Example:** `max personal chats documents list CHAT_ID --limit 20`

### `max chats events`

quién entró, salió, fue añadido o eliminado, y por quién — a partir de los mensajes de servicio del chat; los últimos 7 días, salvo que la consulta indique una fecha

```sh
max chats events <chat> [query]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `query` | opcional | condiciones campo:valor que acotan la lista; los campos están abajo. |

**Returns:** chat event — chat_id, time, type, people, message_id, by, title, before; every field: max commands schema chats events

**Example:** `max chats events Team`

### `max chats inspect`

a qué conduce una invitación o un enlace público, sin unirse a él

```sh
max chats inspect <link>
```

| Argumento | | Qué es |
|---|---|---|
| `link` | obligatorio |un enlace de invitación o uno público.|

**Returns:** what an invite or public link leads to, without joining it

**Example:** `max chats inspect https://example.com/join/abc`

### `max chats join`

unirse a un grupo o canal mediante su enlace; los demás en él ven que te uniste

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max chats join <link>
```

| Argumento | | Qué es |
|---|---|---|
| `link` | obligatorio |un enlace de invitación o uno público.|

**Returns:** join a group or channel by its link; the others in it see that you joined

**Example:** `max chats join https://example.com/join/abc`

### `max chats mark-read`

marcar un chat como leído; el otro lado ve que lo lees

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max chats mark-read <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--until-id <id>` |sólo hasta esta identificación de mensaje; el más nuevo por defecto.|

**Returns:** mark a chat read; the other side sees that you read it

**Example:** `max chats mark-read Team`

### `max chats leave`

abandonar un grupo o canal; los demás en él ven que te fuiste

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max chats leave <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

**Returns:** leave a group or channel; the others in it see that you left

**Example:** `max chats leave Team`

### `max chats create`

crear un grupo o un canal; a las personas agregadas se les dice

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** create a group or a channel; the people added are told

**Example:** `max chats create "Weekly sync" Anna`

### `max chats members`

quien esta en un grupo

#### `max chats members list`

todos en un grupo, una página a la vez, con su rol y cuándo fueron vistos por última vez

```sh
max chats members list <chat> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `query` | opcional | condiciones campo:valor; esta lista aún no filtra por ninguno. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | qué página, empezando por 1. |
| `--all` | todas las filas, sin paginar. |

**Returns:** member — id, name, username, role, last_seen_at, registered_at, joined_at, invited_by, and 7 more; every field: max commands schema chats members list

**Next usually:** `max contacts show <person>`, `max contacts profile <person>`, `max contacts notes list <person> [query]`

**Example:** `max chats members list Team`

#### `max chats members audit`

miembros que parecen robots, cada uno con sus motivos: leídos en la lista de miembros y en el archivo local; nunca una solicitud por persona, y no elimina a nadie

```sh
max chats members audit <chat> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `query` | opcional | condiciones campo:valor que acotan la lista; los campos están abajo. |

| Opción | Para qué sirve |
|---|---|
| `--max-pages <pages>` |como máximo esta cantidad de páginas de 200 miembros, una pausa entre ellas (predeterminado: 10).|
| `--deep <n>` | comprueba también a las primeras n personas en detalle — perfil, fotos y todo lo que escribieron — a una persona por segundo; las listas públicas de bloqueos solo cubren Telegram, por lo que no se envía nada. |

**Returns:** member — id, name, username, role, last_seen_at, registered_at, joined_at, invited_by, and 7 more; every field: max commands schema chats members audit

**Next usually:** `max contacts show <person>`, `max contacts profile <person>`, `max contacts notes list <person> [query]`

**Example:** `max chats members audit Team`

#### `max chats members history`

quién se unió, quién se fue y cuyo perfil cambió, el más antiguo primero: qué chats obtienen los miembros registrados en el archivo local; nunca le pregunta al servicio de mensajería

```sh
max chats members history <chat> [query]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `query` | opcional | condiciones campo:valor que acotan la lista; los campos están abajo. |

**Returns:** chat event — chat_id, time, type, people, message_id, by, title, before; every field: max commands schema chats members history

**Example:** `max chats members history Team`

#### `max chats members fetch`

leer la lista completa de miembros de un grupo en el historial de miembros de el archivo local: quién se unió, quién se fue, recuentos diarios y cambios de perfil; alguien se registra como desaparecido solo cuando se leyeron todos los miembros

**Cambia algo solo en este ordenador.**

```sh
max chats members fetch <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--track` |descargarla también a diario mientras se ejecuta serve; chats tracking enumera y modifica esos chats.|
| `--max-pages <pages>` |como máximo esta cantidad de páginas de 200 miembros, una pausa entre ellas (predeterminado: 10).|

**Returns:** read a group's whole member list into the local store's member history: who joined, who…

**Example:** `max chats members fetch Team`

#### `max chats members add`

agregar personas; se les dice

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** add people; they are told

**Example:** `max chats members add Team Anna`

#### `max chats members remove`

eliminar personas; sus mensajes permanecen

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max chats members remove <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `person` | obligatorio | un ID o parte de un nombre. |

**Returns:** remove people; their messages stay

**Example:** `max chats members remove Team Anna`

### `max chats tracking`

los chats cuyas listas de miembros descarga serve a diario al almacenamiento local — chats members fetch --track añade uno

#### `max chats tracking list`

cada chat rastreado: desde cuándo y su último recuento de miembros

```sh
max chats tracking list
```

**Returns:** every tracked chat: since when, and its last member count

**Example:** `max chats tracking list`

#### `max chats tracking show`

un chat: si se realiza un seguimiento y el recuento de miembros por día durante los últimos 30 días

```sh
max chats tracking show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

**Returns:** one chat: whether it is tracked, and its member count per day for the last 30 days

**Example:** `max chats tracking show Team`

#### `max chats tracking add`

descargar a diario la lista de miembros de este chat mientras se ejecuta serve, a partir de su siguiente ejecución

**Cambia algo solo en este ordenador.**

```sh
max chats tracking add <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

**Returns:** fetch this chat's member list daily while serve runs, from its next run

**Example:** `max chats tracking add Team`

#### `max chats tracking remove`

dejar de descargarla a diario; se conserva el historial ya guardado

**Cambia algo solo en este ordenador.**

```sh
max chats tracking remove <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

**Returns:** stop fetching it daily; the history already kept stays

**Example:** `max chats tracking remove Team`

### `max chats admins`

dar o recuperar los derechos de administrador de un miembro

#### `max chats admins add`

convertir a un miembro en administrador con estos derechos

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** make a member an admin with these rights

**Example:** `max chats admins add Team Anna --can <rights>`

#### `max chats admins remove`

retirar los permisos de un administrador; ellos siguen siendo miembros

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max chats admins remove <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `person` | obligatorio | un ID o parte de un nombre. |

**Returns:** take an admin's rights back; they stay a member

**Example:** `max chats admins remove Team Anna`

### `max chats update`

cambiar el nombre de un grupo o canal, cambiar su descripción o activar o desactivar una de sus configuraciones

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** rename a group or channel, change its description, or turn one of its settings on or off

**Example:** `max chats update Team`

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

**Returns:** the invite link, if you may see it

**Example:** `max chats link show Team`

#### `max chats link reset`

reemplace el enlace de invitación; el viejo deja de funcionar

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max chats link reset <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

**Returns:** replace the invite link; the old one stops working

**Example:** `max chats link reset Team`

### `max chats requests`

solicitudes de entrada a un canal de MAX que requiere aprobación

#### `max chats requests list`

solicitudes pendientes de entrada a un canal de MAX que requiere aprobación; solo administradores; requestedAt es null

```sh
max chats requests list <chat> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `query` | opcional | condiciones campo:valor que acotan la lista; los campos están abajo. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | qué página, empezando por 1. |

**Returns:** join request — person_id, name, username, requested_at, about; every field: max commands schema chats requests list

**Example:** `max chats requests list Team`

#### `max chats requests accept`

aceptar; el grupo ve la entrada

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max chats requests accept <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `person` | obligatorio | quién lo solicitó: un ID de `chats requests list`. |

**Returns:** let them in; the group sees them join

**Example:** `max chats requests accept Team Anna`

#### `max chats requests decline`

rechazar la solicitud

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max chats requests decline <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `person` | obligatorio | quién lo solicitó: un ID de `chats requests list`. |

**Returns:** turn the request away

**Example:** `max chats requests decline Team Anna`

### `max chats folders`

your chat folders

#### `max chats folders list`

tus carpetas de chat, en el orden en que las muestra la aplicación

```sh
max chats folders list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | condiciones campo:valor; esta lista aún no filtra por ninguno. |

**Returns:** folder — id, title, chat_ids, emoji, include, skip, excluded_chat_ids, pinned_chat_ids, and 3 more; every field: max commands schema chats folders list

**Next usually:** `max chats folders show <folder>`, `max chats folders update <folder>`, `max chats folders delete <folder>`

**Example:** `max chats folders list`

#### `max chats folders show`

una carpeta con los nombres de sus chats

```sh
max chats folders show <folder>
```

| Argumento | | Qué es |
|---|---|---|
| `folder` | obligatorio | ID de la carpeta o título exacto. |

**Returns:** folder — id, title, chat_ids, emoji, include, skip, excluded_chat_ids, pinned_chat_ids, and 3 more; every field: max commands schema chats folders show

**Next usually:** `max chats folders update <folder>`, `max chats folders delete <folder>`, `max chats folders order <folders>`

**Example:** `max chats folders show Work`

#### `max chats folders create`

crear una carpeta de chat

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max chats folders create <title> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `title` | obligatorio |el nombre de la carpeta; la aplicación puede rechazar una larga.|

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` |un chat para poner en él, por id o nombre; repítelo para más.|

**Returns:** create a chat folder

**Example:** `max chats folders create "Weekly sync"`

#### `max chats folders update`

cambiar el nombre de una carpeta o cambiar los chats que contiene

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** rename a folder, or change which chats are in it

**Example:** `max chats folders update Work`

#### `max chats folders delete`

eliminar una carpeta; los chats en el se quedan

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max chats folders delete <folder>
```

| Argumento | | Qué es |
|---|---|---|
| `folder` | obligatorio | ID de la carpeta o su título exacto. |

**Returns:** delete a folder; the chats in it stay

**Example:** `max chats folders delete Work`

#### `max chats folders order`

colocar las carpetas en este orden; las que no se nombran conservan su orden después de ellas

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max chats folders order <folders>
```

| Argumento | | Qué es |
|---|---|---|
| `folders` | obligatorio | ID de las carpetas o sus títulos exactos, en el orden deseado. |

**Returns:** put folders in this order; the ones not named keep theirs after them

**Example:** `max chats folders order <folders>`

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

**Returns:** the group's rules; the defaults, marked not saved, if it has none yet

**Example:** `max chats rules show Team`

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

**Returns:** change one rule; the group's first change writes every rule with its default

**Example:** `max chats rules set Team <key> <value>`

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

**Returns:** put one rule back to its default

**Example:** `max chats rules unset Team <key>`

### `max chats moderate`

Juzgar los nuevos mensajes y miembros de un grupo según sus reglas y actuar según lo permitan.

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** judge a group's new messages and members by its rules, and act as they allow

**Example:** `max chats moderate Team`

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
| `--cursor <cursor>` | continuar desde donde, según page.next, se detuvo la última página. |

**Returns:** a chat's photos, videos, files, audio and links, from the messenger's server; reading…

**Example:** `max chats media Team`

### `max chats mute`

silenciar el chat para siempre o hasta una fecha; no se avisa a sus miembros

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max chats mute <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--until <time>` | solo hasta entonces: 2026-09-25T09:00 (hora local), o dentro de 30m, 2h, 7d. |

**Returns:** stop notifications from a chat, for good or until a time; nobody in it is told

**Example:** `max chats mute "Book club"`, `max chats mute "Book club" --until 2h`

### `max chats unmute`

volver a activar las notificaciones del chat

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max chats unmute <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

**Returns:** hear a muted chat again

**Example:** `max chats unmute "Book club"`

### `max chats delete`

eliminar el chat para esta cuenta; los demás conservan el chat y sus mensajes

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max chats delete <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--allow-dangerous` | borrar sin la pregunta que el nivel ask hace antes de eliminar. |

**Returns:** delete a chat from this account; the others in it keep it and its messages

**Example:** `max chats delete Team`

### `max chats clear`

eliminar todos los mensajes del chat para esta cuenta; los demás conservan los suyos

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max chats clear <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--allow-dangerous` | borrar sin la pregunta que el nivel ask hace antes de eliminar. |

**Returns:** delete every message in a chat for this account; the others in it keep theirs

**Example:** `max chats clear Team`

### `max chats start`

iniciar un bot como su botón Inicio; el bot ve que lo iniciaste

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max chats start <bot> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `bot` | obligatorio | chat con el bot — ID o nombre — o enlace al bot, incluso si nunca lo abriste. |

| Opción | Para qué sirve |
|---|---|
| `--start <param>` |parámetro de inicio que lee el bot; usa ?start= del enlace si se omite.|

**Returns:** start a bot, as its Start button does; the bot sees that you started it

**Example:** `max chats start <bot>`

### `max chats app`

dirección de la miniaplicación del bot con tu sesión; mantenla privada

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max chats app <bot> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `bot` | obligatorio | chat con el bot: ID o nombre. |

| Opción | Para qué sirve |
|---|---|
| `--start <param>` | parámetro de inicio que lee la aplicación. |

**Returns:** the address that opens a bot's mini app, signed in as you — keep it to yourself

**Example:** `max chats app <bot>`

## `max contacts`

personas con las que tienes una conversación individual

### `max contacts list`

personas con las que tienes un chat individual; name: busca en el nombre, tu alias local o el @username; notes:, en tus notas privadas sobre ellas

```sh
max contacts list [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | condiciones campo:valor que acotan la lista; los campos están abajo. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | qué página, empezando por 1. |
| `--all` | todas las filas, sin paginar. |
| `--order <recent\|name>` |la conversación más reciente primero o alfabéticamente. Por defecto: `recent`.|

**Returns:** contact — ref, id, name, username, description, last_messaged_at, alias, display_name, and 2 more; every field: max commands schema contacts list

**Next usually:** `max contacts show <person>`, `max contacts profile <person>`, `max contacts context <person>`

**Example:** `max contacts list`

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

**Returns:** contact — ref, id, name, username, description, last_messaged_at, alias, display_name, and 2 more; every field: max commands schema contacts show

**Next usually:** `max contacts profile <person>`, `max contacts context <person>`, `max contacts timeline <person>`

**Example:** `max contacts show Anna`

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

**Returns:** everything the messenger says about one person — handles, flags, last seen, when they…

**Example:** `max contacts profile Anna`

### `max contacts alias`

un nombre visible local y privado en la cuenta seleccionada

#### `max contacts alias set`

your own name for a person in this account; kept on this machine, never sent

**Cambia algo solo en este ordenador.**

```sh
max contacts alias set <person> <alias>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio |  |
| `alias` | obligatorio |  |

**Returns:** your own name for a person in this account; kept on this machine, never sent

**Example:** `max contacts alias set Anna <alias>`

#### `max contacts alias rm`

drop your local name for a person; their own name shows again

**Cambia algo solo en este ordenador.**

```sh
max contacts alias rm <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio |  |

**Returns:** drop your local name for a person; their own name shows again

**Example:** `max contacts alias rm Anna`

### `max contacts notes`

notas privadas del contacto, compartidas por las cuentas que lo ven

#### `max contacts notes list`

every private note you keep on a person, oldest first

```sh
max contacts notes list <person> [query]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio |  |
| `query` | opcional | condiciones campo:valor; esta lista aún no filtra por ninguno. |

**Returns:** contact note — id, contact, text, revision, created_at, updated_at; every field: max commands schema contacts notes list

**Example:** `max contacts notes list Anna`

#### `max contacts notes show`

one private note on a person, with its revision for edit

```sh
max contacts notes show <person> <id>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio |  |
| `id` | obligatorio |  |

**Returns:** contact note — id, contact, text, revision, created_at, updated_at; every field: max commands schema contacts notes show

**Example:** `max contacts notes show Anna 1`

#### `max contacts notes add`

add a private note on a person from stdin or --file; never sent

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

**Returns:** contact note — id, contact, text, revision, created_at, updated_at; every field: max commands schema contacts notes add

**Example:** `max contacts notes add Anna`

#### `max contacts notes edit`

replace a note's text; --revision must match the one you read

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
| `--revision <n>` | la revisión que leíste antes de editar. |

**Returns:** contact note — id, contact, text, revision, created_at, updated_at; every field: max commands schema contacts notes edit

**Example:** `max contacts notes edit Anna 1 --revision <n>`

#### `max contacts notes remove`

delete one private note on a person

**Cambia algo solo en este ordenador.**

```sh
max contacts notes remove <person> <id>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio |  |
| `id` | obligatorio |  |

**Returns:** delete one private note on a person

**Example:** `max contacts notes remove Anna 1`

### `max contacts sync`

Olvida dónde quedó la última sincronización y vuelve a tomar la lista completa.

**Cambia algo solo en este ordenador.**

```sh
max contacts sync
```

**Returns:** forget where the last sync left off and take the whole list again

**Example:** `max contacts sync`

### `max contacts lookup`

quién tiene MAX bajo un número de teléfono: lo solicita o lo lee desde stdin

```sh
max contacts lookup
```

**Returns:** who MAX has under a phone number — asks for it, or reads it from stdin

**Example:** `max contacts lookup`

### `max contacts add`

agregue una persona a sus contactos: `contacts list` todavía muestra solo las personas con las que tiene un diálogo

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max contacts add <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | ID de la persona (lo encuentra `contacts lookup`) o parte de un nombre conocido. |

**Returns:** add a person to your contacts — `contacts list` still shows only people you have a dialog…

**Example:** `max contacts add Anna`

### `max contacts remove`

eliminar a una persona de tus contactos; el chat permanece, un nombre que les diste puede no

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max contacts remove <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | ID de la persona (lo encuentra `contacts lookup`) o parte de un nombre conocido. |

**Returns:** remove a person from your contacts; the chat stays, a name you gave them may not

**Example:** `max contacts remove Anna`

### `max contacts block`

evitar que una persona le escriba; no es necesario que sea un contacto

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max contacts block <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | ID de la persona (lo encuentra `contacts lookup`) o parte de un nombre conocido. |

**Returns:** stop a person from writing to you — they need not be a contact

**Example:** `max contacts block Anna`

### `max contacts unblock`

deja que una persona bloqueada te vuelva a escribir

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max contacts unblock <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | ID de la persona (lo encuentra `contacts lookup`) o parte de un nombre conocido. |

**Returns:** let a blocked person write to you again

**Example:** `max contacts unblock Anna`

### `max contacts rename`

renombrar el contacto en la libreta de direcciones del servicio de mensajería; usa contacts alias para un nombre local privado

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max contacts rename <person> <first-name> [last-name]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | ID de la persona (lo encuentra `contacts lookup`) o parte de un nombre conocido. |
| `first-name` | obligatorio |el nombre que quieres ver para ellos.|
| `last-name` | opcional |  |

**Returns:** rename the contact in the messenger address book; use contacts alias for a private local…

**Example:** `max contacts rename Anna <first-name>`

### `max contacts import`

cargue números de teléfono y agregue las personas que el servicio de mensajería tiene debajo de ellos

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max contacts import <file>
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio |una persona por línea: número, luego una coma, una tabulación o un punto y coma, luego el nombre.|

**Returns:** upload phone numbers and add the people the messenger has under them

**Example:** `max contacts import ./report.pdf`

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
| `--sync-first` |Con --chat, lee primero los mensajes más recientes del Messenger en cada uno.|

**Returns:** what the store holds about one person, in every messenger linked to them: shared chats,…

**Example:** `max contacts context Anna`

### `max contacts timeline`

everything one person took part in, in every messenger linked to them — messages they wrote or were mentioned in, chats, mail, meetings, tasks — newest first, from the store; never connects

```sh
max contacts timeline <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | su ID, @username o parte de su nombre. |

| Opción | Qué hace |
|---|---|
| `--scope <scope>` | solo lo que pertenece a cuentas personales o de trabajo: personal o work. |
| `--since-time <time>` |nada más antiguo que este tiempo ISO 8601, o hace 2 h / 1 d.|
| `--until-time <time>` | through this ISO 8601 time, or 2h / 1d ago. |
| `--limit <n>` | at most this many; 50 if not given. |
| `--cursor <cursor>` | continuar desde donde se detuvo la última página; lo da page.next, con los mismos filtros. |

**Returns:** everything one person took part in, in every messenger linked to them — messages they…

**Example:** `max contacts timeline Anna`

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

**Returns:** whether one person looks like a bot, a fake or a spammer: their profile and what they…

**Example:** `max contacts check Anna`

### `max contacts link`

registre que dos personas en el archivo son una sola persona; el mismo nombre nunca es suficiente

**Cambia algo solo en este ordenador.**

```sh
max contacts link <person> <other>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio | su ID, @username o parte de su nombre. |
| `other` | obligatorio |lo mismo en otro messenger de el archivo, como <messenger>:<person> — max:Ana; me: eres tú, como zoom:<id> me.|

**Returns:** record that two people in the store are one person — the same name is never enough

**Example:** `max contacts link Anna <other>`

### `max contacts unlink`

Deshacer enlace de contactos para una identidad: vuelve a ser una persona propia

**Cambia algo solo en este ordenador.**

```sh
max contacts unlink <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | obligatorio |su id, @nombredeusuario o parte de su nombre; <messenger>:<person> para otro servicio de mensajería.|

**Returns:** undo contacts link for one identity: it is a person of its own again

**Example:** `max contacts unlink Anna`

## `max messages`

leer y enviar mensajes en un chat

### `max messages list`

Los mensajes de un chat, del más antiguo al más nuevo.

```sh
max messages list <chat> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `query` | opcional | por dónde empezar: id<42, date>2026-10-01. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos resultados. |
| `--cursor <cursor>` | continuar desde donde se detuvo la última página; lo da page.next. |
| `--transcribe` |convertir los mensajes de voz que aún no se han escuchado en texto, por el servicio de mensajería cuando puede o, si no, por un modelo de esta máquina; puede tardar unos minutos.|
| `--model <id>` |qué modelo de voz descargado los escucha, con --transcribe; `models audio list` se los muestra.|
| `--mark-read` |también marque el chat leído hasta el mensaje más reciente mostrado; la otra persona lo ve.|

**Returns:** message — ref, id, chat_id, sender_id, sender_name, timestamp, edited_at, text, and 26 more; every field: max commands schema messages list

**Next usually:** `max messages links <chat> <message>`, `max messages transcribe <chat> <message>`, `max stats messages evidence <message>`

**Example:** `max messages list Team`

### `max messages show`

un mensaje, por su chat e id o por su mensaje: localizador

```sh
max messages show <chat> [message]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título; o un localizador msg: sin ID de mensaje al final. |
| `message` | opcional | el ID del mensaje. |

**Returns:** one message, by its chat and id or by its msg: locator

**Example:** `max messages show Team 1234`

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

**Returns:** a message and what came either side of it, oldest first

**Example:** `max messages context Team 1234`

### `max messages links`

Por qué un mensaje está en su conversación: cada eslabón que tiene y la cadena de respuestas hasta el inicio.

```sh
max messages links <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `message` | obligatorio | el ID del mensaje. |

**Returns:** why a message is in its conversation: each link it has, and the chain of answers back to…

**Example:** `max messages links Team 1234`

### `max messages link`

un enlace permanente de mensaje cuando sea compatible y su localizador de ámbito de cuenta

```sh
max messages link <chat> [message]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título; o un localizador msg: sin ID de mensaje al final. |
| `message` | opcional | el ID del mensaje. |

**Returns:** message link — ref, url, access, reason; every field: max commands schema messages link

**Next usually:** `max messages links <chat> <message>`, `max messages transcribe <chat> <message>`, `max stats messages evidence <message>`

**Example:** `max messages link Team 1234`

### `max messages download`

guarde las fotos, archivos, videos y notas de voz de un mensaje en una carpeta, o en un chat completo con --all

**Cambia algo solo en este ordenador.**

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

**Returns:** save a message's photos, files, videos and voice notes to a folder — or a whole chat's…

**Example:** `max messages download Team 1234`

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
| `--cursor <cursor>` | continuar desde donde, según page.next, se detuvo el último paquete. |

**Returns:** a bounded evidence packet from stored messages, newest first

**Example:** `max messages evidence Team`

### `max messages sync`

poner al día el historial de un chat en el almacén local, de lo más reciente a lo más antiguo; vuelve a ejecutarlo para continuar; --all sincroniza todos los chats

**Cambia algo solo en este ordenador.**

```sh
max messages sync [chat] [options]
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
| `--catch-up` | preparar la búsqueda local después de esta ejecución; tiene prioridad sobre search_catch_up. |
| `--no-catch-up` | omitir la preparación local después de esta ejecución. |
| `--catch-up-chunks <n>` | como máximo este número de fragmentos de vectores locales. |
| `--catch-up-messages <n>` | omitir una reconstrucción del grafo con más mensajes que este número. |
| `--catch-up-time <duration>` | tiempo disponible para la preparación local, 30s de forma predeterminada. |
| `--background` |ejecutar como un trabajo que sobrevive a este comando; `store jobs show` lo sigue.|
| `--dry-run` |Solo calcule cuántos mensajes, solicitudes y minutos aún tomaría una recuperación completa: desde el archivo, sin solicitud.|

**Returns:** bring a chat's history in the local store up to date, newest first; run it again to…

**Example:** `max messages sync Team`

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

**Returns:** turn a voice message into text, on this machine — the recording goes nowhere

**Example:** `max messages transcribe Team 1234`

### `max messages send`

enviar un mensaje de texto; sin [texto], el texto se lee desde stdin

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max messages send <chat> [text] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `text` | opcional | el mensaje. |

| Opción | Para qué sirve |
|---|---|
| `--reply-to <message>` |Responde este mensaje, por su id en el mismo chat.|
| `--send-as <id>` | publicar como una de las identidades que enumera `chats send-as`; obligatorio cuando el chat publica como otra identidad de forma predeterminada. |
| `--operation-id <id>` |repetir un envío cuyo resultado se desconocía, sin arriesgarse a una segunda copia.|
| `--silent` | entregar sin notificación. |
| `--no-preview` |no hay tarjeta de vista previa para un enlace en el texto.|
| `--md` | interpretar el Markdown de este servicio de mensajería; la sintaxis admitida está en su guía de formato. |
| `--file <file>` |adjuntar un archivo; el texto se convierte en su título.|
| `--photo <file>` |adjunte un .jpg, .png o .webp como foto; el texto se convierte en su título.|
| `--as-file` |envíe el --file como un archivo para descargar, un video incluido.|
| `--voice <file>` |envía un archivo Ogg Opus como mensaje de voz, solo, sin texto.|
| `--allow-any-file` | enviar un archivo incluso desde carpetas de credenciales o de la propia CLI. |
| `--at-time <time>` |deja que el servicio de mensajería lo envíe más tarde, incluso con esta máquina apagada: 2026-09-25T09:00 (hora local), o dentro de 30m, 2h, 1d.|
| `--sticker <id>` | enviar solo este sticker; `stickers list` muestra su id. |

**Returns:** send a text message; without [text], the text is read from stdin

**Example:** `max messages send Team "on my way"`

### `max messages scheduled`

mensajes que esperan ser enviados más tarde en un chat, los más prontos primero; cancelar uno en la aplicación

```sh
max messages scheduled <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

**Returns:** message — ref, id, chat_id, sender_id, sender_name, timestamp, edited_at, text, and 26 more; every field: max commands schema messages scheduled

**Next usually:** `max messages links <chat> <message>`, `max messages transcribe <chat> <message>`, `max stats messages evidence <message>`

**Example:** `max messages scheduled Team`

### `max messages edit`

cambiar el texto de su propio mensaje; Es posible que el otro lado ya lo haya leído.

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** change the text of your own message; the other side may have read it already

**Example:** `max messages edit Team 1234 "on my way"`

### `max messages delete`

eliminar mensajes solo para usted; con --for-everyone, para todos en el chat

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max messages delete <chat> <messages> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `messages` | obligatorio | los ID de los mensajes, separados por espacios o comas, como máximo 10. |

| Opción | Para qué sirve |
|---|---|
| `--for-everyone` |eliminar para todos en el chat, no solo para ti: no pueden recuperarlo.|
| `--allow-dangerous` | borrar sin la pregunta que el nivel ask hace antes de eliminar. |

**Returns:** delete messages for you only; with --for-everyone, for everyone in the chat

**Example:** `max messages delete Team <messages>`

### `max messages forward`

reenviar un mensaje a otro chat

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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
| `--operation-id <id>` |repetir un reenvío cuyo resultado se desconocía, sin arriesgarse a una segunda copia.|

**Returns:** forward one message to another chat

**Example:** `max messages forward Team 1234 --to Team`

### `max messages pin`

fijar un mensaje en un chat, en silencio a menos que --notify

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** pin a message in a chat, quietly unless --notify

**Example:** `max messages pin <chat> <message>`, `max messages pin <chat> <message> --notify`

### `max messages unpin`

desanclar un mensaje en un chat

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max messages unpin <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `message` | obligatorio | el ID del mensaje. |

**Returns:** unpin a message in a chat

**Example:** `max messages unpin <chat> <message>`

### `max messages press`

pulsar un botón del bot bajo un mensaje; el bot ve la pulsación

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max messages press <chat> <message> <button>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | chat: ID o parte de su título. |
| `message` | obligatorio | ID del mensaje con botones. |
| `button` | obligatorio | número mostrado por `messages show` o texto exacto. |

**Returns:** press a bot's button under a message; the bot sees that you pressed it

**Example:** `max messages press Team 1234 <button>`

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

**Returns:** per chat: messages stored, the oldest and newest, and the stretches held completely

**Example:** `max store status Team`

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

**Returns:** local coverage plan; missing message ids alone do not imply missing history

**Example:** `max store gaps plan Team`

#### `max store gaps repair`

descargar datos de lagunas internas con límites y volver a comprobar la cobertura; nunca eliminar los mensajes no encontrados

**Cambia algo solo en este ordenador.**

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
| `--catch-up` | preparar la búsqueda local después de reparar; anula search_catch_up. |
| `--no-catch-up` | omitir la preparación de la búsqueda local después de reparar. |
| `--catch-up-chunks <n>` | máximo de fragmentos locales que se preparan. |
| `--catch-up-messages <n>` | máximo de mensajes almacenados que se leen para la preparación. |
| `--catch-up-time <duration>` | tiempo de preparación dentro del tiempo restante de la reparación. |
| `--background` |reparar mediante el mecanismo existente de trabajos del almacenamiento; consultar store jobs show.|

**Returns:** fetch bounded interior gaps and recheck coverage; never delete unseen messages

**Example:** `max store gaps repair Team`

### `max store jobs`

tareas de sincronización en segundo plano

#### `max store jobs list`

tareas de sincronización en segundo plano, las más recientes primero

```sh
max store jobs list [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | condiciones campo:valor que acotan la lista; los campos están abajo. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | qué página, empezando por 1. |
| `--all` | todas las filas, sin paginar. |

**Returns:** job — id, chat, state, pid, started_at, fetched, finished_at, message_limit, and 5 more; every field: max commands schema store jobs list

**Example:** `max store jobs list`

#### `max store jobs show`

un trabajo en segundo plano (el más nuevo cuando no se nombra ninguno) y lo que el archivo tiene ahora de su chat

```sh
max store jobs show [job]
```

| Argumento | | Qué es |
|---|---|---|
| `job` | opcional | el ID de la tarea que imprimió `messages sync --background`. |

**Returns:** one background job — the newest when none is named — and what the store now holds of its…

**Example:** `max store jobs show`

#### `max store jobs cancel`

detener una tarea en segundo plano en curso tras su página actual; una sincronización posterior continúa donde se detuvo

**Cambia algo solo en este ordenador.**

```sh
max store jobs cancel <job>
```

| Argumento | | Qué es |
|---|---|---|
| `job` | obligatorio |la identificación del trabajo.|

**Returns:** stop a running background job after its current page; a later sync resumes where it…

**Example:** `max store jobs cancel <job>`

#### `max store jobs retry`

volver a iniciar una tarea parcial, fallida o muerta como tarea nueva; la sincronización continúa donde se detuvo el almacén

**Cambia algo solo en este ordenador.**

```sh
max store jobs retry [job] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `job` | opcional | ID del trabajo. |

| Opción | Para qué sirve |
|---|---|
| `--failed` |todos los chats cuyo último trabajo falló o se interrumpió.|

**Returns:** start a partial, failed or died job again, as a new job; the sync resumes where the store…

**Example:** `max store jobs retry`

#### `max store jobs clear`

olvidar trabajos terminados y borrar sus registros; se conservan los trabajos en curso

**Cambia algo solo en este ordenador.**

```sh
max store jobs clear
```

**Returns:** forget finished jobs and remove their logs; a running job is kept

**Example:** `max store jobs clear`

### `max store export`

los mensajes guardados de un chat, del más antiguo al más reciente: --jsonl, un mensaje por línea; --json, la lista de mensajes en su envoltorio común; nunca consulta al mensajero

**Cambia algo solo en este ordenador.**

```sh
max store export [chats] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chats` | opcional |un chat: su id, o parte de su título; varios con --output-dir.|

| Opción | Para qué sirve |
|---|---|
| `--format <format>` | jsonl: un mensaje por línea, el valor predeterminado con --output; markdown: una transcripción con un encabezado por día, respuestas y reenvíos citados. |
| `--since-time <time>` |solo a partir de esta hora ISO 8601, o hace 30 m/2 h/1 d en adelante.|
| `--output <file>` |escriba líneas JSON, o la transcripción, en este nuevo archivo, que solo usted podrá leer.|
| `--output-dir <dir>` |escribe en esta carpeta, un archivo por chat y un manifiesto; ejecútelo nuevamente para ver solo lo que cambió desde entonces.|
| `--include <kinds>` |con --output-dir: cada chat almacenado de este tipo, separado por comas: diálogo, grupo, canal, guardado.|
| `--all` |con --output-dir: cada chat almacenado de esta cuenta.|
| `--encrypt` |comprimir y cifrar con una contraseña, escrita en un mensaje oculto o canalizada en stdin; nunca se conserva; si se pierde, el archivo no se podrá abrir.|

**Returns:** a chat's stored messages, oldest first: --jsonl one message per line, --json the list…

**Example:** `max store export`

### `max store clear`

eliminar de el archivo los chats que ha dejado esta cuenta, con sus mensajes

**Cambia algo solo en este ordenador.**

```sh
max store clear [options]
```

| Opción | Para qué sirve |
|---|---|
| `--left` |los chats que ha dejado esta cuenta: lo único que esto borra.|
| `--allow-dangerous` |sí, eliminar: no se puede deshacer y un chat que abandonaste no se puede recuperar de nuevo.|
| `--dry-run` |enumera los chats que eliminaría, sin eliminar nada.|

**Returns:** delete from the store the chats this account has left, with their messages

**Example:** `max store clear`

### `max store info`

el archivo de almacenamiento: dónde está, su tamaño, su esquema y cuántas filas contiene; no cambia nada

```sh
max store info
```

**Returns:** the store file: where it is, its size, its schema and how many rows it holds; changes…

**Example:** `max store info`

### `max store check`

si el archivo está en buen estado: integridad, índices de búsqueda, disco y qué chats están detrás

```sh
max store check
```

**Returns:** whether the store is healthy — integrity, search indexes, disk, and which chats are behind

**Example:** `max store check`

### `max store migrate`

actualizar el esquema y normalizar e indexar mensajes y notas, incluidas sus raíces

**Cambia algo solo en este ordenador.**

```sh
max store migrate
```

**Returns:** bring the store up to this build's schema, then normalize, index and stem the messages…

**Example:** `max store migrate`

### `max store reindex`

reconstruir índices de palabras, erratas, raíces, archivos y notas sin perder datos

**Cambia algo solo en este ordenador.**

```sh
max store reindex
```

**Returns:** rebuild the word index, its typo vocabulary, the stems, the files' word index, the notes'…

**Example:** `max store reindex`

### `max store backup`

copie el archivo en un archivo nuevo, mientras esté en uso; nunca sobrescribe un archivo

**Cambia algo solo en este ordenador.**

```sh
max store backup <file> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio |el nuevo archivo.|

| Opción | Para qué sirve |
|---|---|
| `--encrypt` |comprimir y cifrar con una contraseña, escrita en un mensaje oculto o canalizada en stdin; nunca se conserva; si se pierde, el archivo no se podrá abrir.|

**Returns:** copy the store into a new file, while it is in use; never overwrites a file

**Example:** `max store backup ./report.pdf`

### `max store restore`

poner una copia de seguridad en lugar de el archivo; el archivo a la que reemplaza se mantiene a su lado, nunca se elimina

**Cambia algo solo en este ordenador.**

```sh
max store restore <file>
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio |un archivo que escribió `store backup`; uno escrito con --encrypt solicita su contraseña.|

**Returns:** put a backup in place of the store; the store it replaces is kept beside it, never deleted

**Example:** `max store restore ./report.pdf`

### `max store decrypt`

abra un archivo escrito con --encrypt en un archivo nuevo; pide su contraseña

**Cambia algo solo en este ordenador.**

```sh
max store decrypt <file> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio |un archivo que escribió `store backup --encrypt` o `store export --encrypt`.|

| Opción | Para qué sirve |
|---|---|
| `--output <file>` |el nuevo archivo, legible sólo por usted.|

**Returns:** open a file written with --encrypt into a new file; asks for its password

**Example:** `max store decrypt ./report.pdf --output ./report.pdf`

### `max store repair`

traer cada tabla a la forma de esta construcción, sin eliminar nada: una tabla con la forma incorrecta se guarda como una copia junto a una nueva

**Cambia algo solo en este ordenador.**

```sh
max store repair [options]
```

| Opción | Para qué sirve |
|---|---|
| `--dry-run` |diga lo que haría y no cambiará nada.|

**Returns:** bring every table to this build's shape, deleting nothing: a table of the wrong shape is…

**Example:** `max store repair`

### `max store reset`

back the store up beside itself, then delete it and start an empty one at this build's schema; asks first, or --yes

**Cambia algo solo en este ordenador.**

```sh
max store reset [options]
```

| Opción | Qué hace |
|---|---|
| `--no-backup` | delete the store without backing it up first. |

**Returns:** back the store up beside itself, then delete it and start an empty one at this build's…

**Example:** `max store reset`

### `max store copies`

las tablas `store repair` se conservan como copias

#### `max store copies delete`

eliminar una copia guardada de `store repair`, con el nombre exacto; rechaza cualquier otra mesa

**Cambia algo solo en este ordenador.**

```sh
max store copies delete <name>
```

| Argumento | | Qué es |
|---|---|---|
| `name` | obligatorio |el nombre de la copia, tal como lo imprimió `store repair`.|

**Returns:** delete one copy `store repair` kept, named exactly; refuses any other table

**Example:** `max store copies delete daily`

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
| `--source <accounts>` | cada cuenta de este servicio de mensajería guardada en el almacén; personal, bots o all, igual que in: en la consulta. |
| `--limit <n>` | how many rows. |
| `--timezone <zone>` |la zona horaria de la IANA para los días y horas calendario.|
| `--exact` |las palabras sin campo y las frases entre comillas coinciden solo en su forma exacta, como exact:word; text: sigue admitiendo todas las formas.|
| `--saved <name\|id>` |contar lo que coincide con una búsqueda guardada o una ejecución anterior; Las opciones escritas aquí reemplazan las suyas.|

**Returns:** message counts — by, total, rows; every field: max commands schema stats messages show

**Example:** `max stats messages show "invoice"`

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
| `--source <accounts>` | cuentas guardadas de este servicio de mensajería; la actualización usa la cuenta activa. |
| `--exact` | las palabras sin operadores coinciden por forma exacta. |
| `--timezone <zone>` | zona horaria IANA para fechas de consulta. |
| `--selection <json>` |selección fija de objetivos de counters show; incompatible con consulta y ámbito.|
| `--counters <names>` | campos distintos views,reactions,comments; los tres por defecto. |
| `--limit <n>` | mensajes, 1–100; 20 por defecto. |
| `--max-age <duration>` | edad máxima de una observación reciente; 24h por defecto. |

**Returns:** counters — cutoff, max_age_ms, selection, rows; every field: max commands schema stats messages counters show

**Example:** `max stats messages counters show "invoice"`

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
| `--source <accounts>` | cuentas guardadas de este servicio de mensajería; la actualización usa la cuenta activa. |
| `--exact` | las palabras sin operadores coinciden por forma exacta. |
| `--timezone <zone>` | zona horaria IANA para fechas de consulta. |
| `--selection <json>` |selección fija de objetivos de counters show; incompatible con consulta y ámbito.|
| `--counters <names>` | campos distintos views,reactions,comments; los tres por defecto. |
| `--limit <n>` | mensajes, 1–100; 20 por defecto. |
| `--max-messages <n>` | máximo de mensajes que actualizar, 1–100. |
| `--sync-time <duration>` | tiempo de actualización remota; 30s por defecto, máximo 5m. |
| `--dry-run` | mostrar objetivos guardados exactos y contadores admitidos sin conectar. |

**Returns:** counter refresh — dry_run, targets, counters, supported, unsupported, max_messages, time_ms, results, and 2 more; every field: max commands schema stats messages counters refresh

**Example:** `max stats messages counters refresh "invoice"`

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
| `--source <accounts>` | cada cuenta guardada de este servicio de mensajería; personal, bots o all. |
| `--exact` | las palabras sin campo coinciden en su forma exacta en lugar de por su raíz. |
| `--saved <name\|id>` | ejecutar un informe guardado de este tipo; las opciones indicadas sustituyen las guardadas. |
| `--timezone <zone>` | la zona horaria IANA para los límites de las fechas del calendario. |
| `--limit <n>` | filas del informe, 1–100; 20 por defecto. |
| `--answerer <person>` | nombre guardado, alias, @username, ID o person:provider/account/id; los nombres ambiguos requieren elegir; repetir para varias. |
| `--older-than <duration>` | edad mínima de una pregunta sin respuesta válida observada. |

**Returns:** admin report — report, cutoff, total, summary, quality, rows; every field: max commands schema stats messages unanswered

**Example:** `max stats messages unanswered "invoice"`

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
| `--source <accounts>` | cada cuenta guardada de este servicio de mensajería; personal, bots o all. |
| `--exact` | las palabras sin campo coinciden en su forma exacta en lugar de por su raíz. |
| `--saved <name\|id>` | ejecutar un informe guardado de este tipo; las opciones indicadas sustituyen las guardadas. |
| `--timezone <zone>` | la zona horaria IANA para los límites de las fechas del calendario. |
| `--limit <n>` | filas del informe, 1–100; 20 por defecto. |
| `--min-views <n>` | mínimo de vistas acumuladas conocidas. |
| `--max-replies <n>` | máximo de respuestas observadas en la conversación. |

**Returns:** admin report — report, cutoff, total, summary, quality, rows; every field: max commands schema stats messages discussion

**Example:** `max stats messages discussion "invoice"`

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
| `--source <accounts>` | cada cuenta guardada de este servicio de mensajería; personal, bots o all. |
| `--timezone <zone>` | zona horaria IANA para fechas y días activos. |
| `--exact` | las palabras sin campo coinciden en su forma exacta en lugar de por su raíz. |
| `--limit <n>` | filas clasificadas, 1–100. |
| `--saved <name\|id>` | ejecutar una consulta guardada o una ejecución de clasificación; las opciones introducidas sustituyen las almacenadas. |

**Returns:** ranking — target, measure, order, preset, weights, min_messages, message_kind, total, and 7 more; every field: max commands schema stats messages top

**Example:** `max stats messages top "invoice"`

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

**Returns:** evidence — ; every field: max commands schema stats messages evidence

**Example:** `max stats messages evidence 1234 --selection <json> --component daily`

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
| `--source <accounts>` | cada cuenta guardada de este servicio de mensajería; personal, bots o all. |
| `--exact` | las palabras sin campo coinciden en su forma exacta en lugar de por su raíz. |
| `--saved <name\|id>` | ejecutar un informe guardado de este tipo; las opciones indicadas sustituyen las guardadas. |
| `--timezone <zone>` | la zona horaria IANA para los límites de las fechas del calendario. |
| `--limit <n>` | filas del informe, 1–100; 20 por defecto. |
| `--answerer <person>` | nombre guardado, alias, @username, ID o person:provider/account/id; los nombres ambiguos requieren elegir; repetir para varias. |

**Returns:** admin report — report, cutoff, total, summary, quality, rows; every field: max commands schema stats contacts responses

**Example:** `max stats contacts responses "invoice"`

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
| `--source <accounts>` | cada cuenta guardada de este servicio de mensajería; personal, bots o all. |
| `--timezone <zone>` | zona horaria IANA para fechas y días activos. |
| `--exact` | las palabras sin campo coinciden en su forma exacta en lugar de por su raíz. |
| `--limit <n>` | filas clasificadas, 1–100. |
| `--saved <name\|id>` | ejecutar una consulta guardada o una ejecución de clasificación; las opciones introducidas sustituyen las almacenadas. |
| `--min-messages <n>` | mínimo de mensajes seleccionados por autor; 1 o 5 para engaging. |

**Returns:** ranking — target, measure, order, preset, weights, min_messages, message_kind, total, and 7 more; every field: max commands schema stats contacts top

**Example:** `max stats contacts top "invoice"`

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

**Returns:** evidence — ; every field: max commands schema stats contacts evidence

**Example:** `max stats contacts evidence Anna --selection <json> --component daily`

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

**Returns:** chat stats — chat, since, until, complete, completeness, messages, senders, replies, and 10 more; every field: max commands schema stats chats show

**Example:** `max stats chats show Team`

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

**Returns:** admin report — report, cutoff, total, summary, quality, rows; every field: max commands schema stats chats newcomers

**Example:** `max stats chats newcomers Team`

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

**Returns:** retention — chat_ref, cutoff, since, until, checkpoints_ms, within_ms, by, timezone, and 5 more; every field: max commands schema stats chats retention

**Example:** `max stats chats retention Team`

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
| `--type <type>` |sólo este tipo: pregunta, petición, mención o promesa.|

**Returns:** task stats — open, rows; every field: max commands schema stats tasks show

**Example:** `max stats tasks show`

### `max stats charts`

los datos de un gráfico de las estadísticas de un chat y, opcionalmente, una imagen SVG o PNG de tema oscuro

**Cambia algo solo en este ordenador.**

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

**Returns:** chart — version, kind, title, x, series, unit, timezone, partial, and 2 more; every field: max commands schema stats charts

**Example:** `max stats charts Team`

## `max tasks`

lo que requiere tu atención —preguntas sin respuesta, menciones, peticiones y promesas— guardado en el almacenamiento local; lo añaden review, inbox y messages sync, y serve solo las peticiones de las reglas de respuesta automática

### `max tasks list`

tareas, primero las más antiguas, con su mensaje o nota de origen

```sh
max tasks list [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | condiciones campo:valor que acotan la lista; los campos están abajo. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos resultados. |

**Returns:** task — ref, id, title, kind, state, created_at, key, description, and 15 more; every field: max commands schema tasks list

**Next usually:** `max tasks show <task>`, `max tasks related <task>`, `max tasks plan <task>`

**Example:** `max tasks list`

### `max tasks add`

añadir una tarea para un mensaje o una nota guardados — una promesa o una petición

**Cambia algo solo en este ordenador.**

```sh
max tasks add <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `message` | obligatorio |localizador de mensaje msg:<provider>/<account>/<chat>/<message>, o note:<id>.|

| Opción | Para qué sirve |
|---|---|
| `--type <type>` |Tipo de tarea: pregunta, petición, mención o promesa.|
| `--category <name>` | de qué trata, de la lista que imprime tasks categories: money, documents, meeting, …. |
| `--into <id>` | cuando tasks add mostró tareas que pueden ser el mismo trabajo: vincular el mensaje a esta en lugar de abrir una tarea. |
| `--new` | cuando tasks add mostró tareas que pueden ser el mismo trabajo: abrir la tarea de todos modos. |
| `--title <title>` | una línea: la acción y su objeto, p. ej. send Alex the API token. |
| `--description <text>` | el detalle, en Markdown: quién debe qué a quién, cuándo se da por hecha, siguiente paso, palabras clave. |
| `--due <time>` | cuándo debe estar hecha: una hora ISO 8601 o 2h, 3d desde ahora; none la borra. |
| `--remind-time <time>` | cuándo volver a revisarla: una hora ISO 8601 o 2h, 3d desde ahora; none la borra. |
| `--assignee <person...>` | quién la hace: sender (quien envió el mensaje de la tarea) o person:<id>; none lo borra. Si no estás seguro, omítelo: más vale una tarea sin responsable que ninguna. |

**Returns:** add a task for a stored message or note — a promise, a request

**Example:** `max tasks add 1234 --type <type> --category daily`

### `max tasks plan`

establecer el título, la descripción, la fecha límite, la próxima revisión, la categoría y el responsable de una tarea; nada llega al servicio de mensajería

**Cambia algo solo en este ordenador.**

```sh
max tasks plan <task> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `task` | obligatorio | el ID o la clave de la tarea, tal como lo muestra tasks list. |

| Opción | Para qué sirve |
|---|---|
| `--category <name>` | de qué trata, de la lista que imprime tasks categories: money, documents, meeting, …; el cambio queda en el historial de la tarea. |
| `--title <title>` | una línea: la acción y su objeto, p. ej. send Alex the API token. |
| `--description <text>` | el detalle, en Markdown: quién debe qué a quién, cuándo se da por hecha, siguiente paso, palabras clave. |
| `--due <time>` | cuándo debe estar hecha: una hora ISO 8601 o 2h, 3d desde ahora; none la borra. |
| `--remind-time <time>` | cuándo volver a revisarla: una hora ISO 8601 o 2h, 3d desde ahora; none la borra. |
| `--assignee <person...>` | quién la hace: sender (quien envió el mensaje de la tarea) o person:<id>; none lo borra. Si no estás seguro, omítelo: más vale una tarea sin responsable que ninguna. |

**Returns:** set a task's title, description, due date, next check, category and assignee

**Example:** `max tasks plan 12`

### `max tasks link`

vincular una tarea con mensajes, chats, personas o URL, o con otra tarea: task:<id>

**Cambia algo solo en este ordenador.**

```sh
max tasks link <task> [targets] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `task` | obligatorio | el ID o la clave de la tarea, tal como lo muestra tasks list. |
| `targets` | opcional | localizadores msg:, person:<id>, document:<id>, note:<id>, una URL; o task:<id>, que vincula dos tareas de proyecto. |

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | un chat al que se refiere, se puede repetir; un chat: su ID o parte de su título. |
| `--kind <kind>` | related-to (por defecto), evidence —muestra que la tarea es real— o created-from; para task:<id>, related-to, blocked-by, follow-up-of, duplicate-of o discovered-from. |

**Returns:** link a task to messages, chats, people or URLs — or to another task: task:<id>

**Example:** `max tasks link 12`

### `max tasks show`

una tarea: su plan y todo lo vinculado a ella

```sh
max tasks show <task>
```

| Argumento | | Qué es |
|---|---|---|
| `task` | obligatorio | el ID o la clave de la tarea, tal como lo muestra tasks list. |

**Returns:** one task: its plan and everything linked to it

**Example:** `max tasks show 12`

### `max tasks related`

tareas que pueden ser el mismo trabajo que esta, las mejores primero, cada una con un nivel —likely, maybe, different— y los motivos; no fusiona nada

```sh
max tasks related <task> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `task` | obligatorio | el id o la clave de la tarea, como la muestra tasks list. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos, como máximo 40 (por defecto 10). |

**Returns:** tasks that may be the same job as this one, best first; merges nothing

**Example:** `max tasks related PR-12`

### `max tasks duplicates`

pares de tareas que abrió una regla y que pueden ser un solo trabajo, las más recientes primero, con puntuación y motivos: fusiona, rechaza o aplaza cada par; decision:unsure lista los aplazados para el propietario

```sh
max tasks duplicates [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | condiciones campo:valor que acotan la lista; los campos están abajo. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos. |

#### `max tasks duplicates reject`

dos tareas no son el mismo trabajo: el par sale de la lista y no se vuelve a ofrecer

**Cambia algo solo en este ordenador.**

```sh
max tasks duplicates reject <dup> <task>
```

| Argumento | | Qué es |
|---|---|---|
| `dup` | obligatorio | la tarea listada como duplicado, por su id o clave. |
| `task` | obligatorio | la tarea con la que se emparejó. |

**Returns:** two tasks are not the same job: the pair is never offered again

**Example:** `max tasks duplicates reject PR-14 PR-12`

#### `max tasks duplicates defer`

ni los campos ni el texto lo aclaran: dejar el par al propietario, que lo lista con decision:unsure

**Cambia algo solo en este ordenador.**

```sh
max tasks duplicates defer <dup> <task>
```

| Argumento | | Qué es |
|---|---|---|
| `dup` | obligatorio | la tarea listada como duplicado, por su id o clave. |
| `task` | obligatorio | la tarea con la que se emparejó. |

**Returns:** the fields and the text cannot tell: leave the pair to the owner

**Example:** `max tasks duplicates defer PR-14 PR-12`

### `max tasks merge`

un trabajo visto dos veces: vincular cada mensaje del duplicado a la tarea y cerrar el duplicado como dismissed, duplicate-of la tarea; no se borra nada y tasks unmerge lo deshace

**Cambia algo solo en este ordenador.**

```sh
max tasks merge <dup> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `dup` | obligatorio | el duplicado, por su id o clave; debe estar abierto. |

| Opción | Para qué sirve |
|---|---|
| `--into <id>` | la tarea que se queda, por su id o clave. |

**Returns:** one job seen twice: fold the duplicate into the task that stays

**Example:** `max tasks merge PR-14 --into PR-12`

### `max tasks unmerge`

deshacer una fusión: reabrir la tarea y quitar su vínculo duplicate-of; los mensajes que vinculó la fusión siguen vinculados

**Cambia algo solo en este ordenador.**

```sh
max tasks unmerge <dup>
```

| Argumento | | Qué es |
|---|---|---|
| `dup` | obligatorio | la tarea fusionada, por su id o clave. |

**Returns:** undo a merge: reopen the task and remove its duplicate-of relation

**Example:** `max tasks unmerge PR-14`

### `max tasks agenda`

lo que hay que revisar hoy, desde el almacén local y sin texto de mensajes: tareas vencidas, por vencer o por revisar, chats donde debes una respuesta, chats donde esperas una y tareas abiertas que hace otra persona

```sh
max tasks agenda [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | condiciones campo:valor que acotan la lista; los campos están abajo. |

| Opción | Para qué sirve |
|---|---|
| `--due-within <duration>` | listar las tareas que vencen dentro de este plazo: 30m, 2h, 1d (por defecto 1d). |
| `--unanswered <duration>` | listar los chats donde otra persona escribió lo último hace al menos este tiempo (por defecto 1d). |
| `--waiting <duration>` | listar los chats donde tú escribiste lo último hace al menos este tiempo (por defecto 7d). |
| `--within <duration>` | omitir los chats sin actividad durante más tiempo: ya terminaron (por defecto 30d). |
| `--holder <name>` | quién eres para las reservas: un id de sesión o un id de chat; por defecto WIRECAT_HOLDER, si no la sesión de Claude Code, si no el nombre del agente. |

**Returns:** agenda — at, account, stored_at, stale, tasks, owed, waiting, unsynced, and 2 more; every field: max commands schema tasks agenda

**Example:** `max tasks agenda`

### `max tasks categories`

las categorías que puede tener una tarea, con lo que significa cada una y las palabras por las que una regla la elige

```sh
max tasks categories
```

**Returns:** the categories a task takes, with what each means

**Example:** `max tasks categories`

### `max tasks scan`

aplica las reglas de tareas a los mensajes guardados más recientes de un chat: en un chat uno a uno, una pregunta que no respondiste, y en un grupo, solo una pregunta en respuesta a ti y una mención tuya, abren una tarea, y tu respuesta la cierra; un canal no abre ninguna, para un chat que la primera sincronización dejó sin procesar (ajuste task_first_pass_per_chat). Muestra lo que abriría y no cambia nada sin --yes; con --yes comprueba duplicados como en una sincronización. Solo lee el almacén local

**Cambia algo solo en este ordenador.**

```sh
max tasks scan <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |

| Opción | Para qué sirve |
|---|---|
| `--last <n>` | lee los n mensajes guardados más recientes de cada chat (50 por defecto, como máximo 1000). |

**Returns:** build tasks from a chat's stored history: unanswered questions and mentions

**Example:** `max tasks scan <chat>`, `max tasks scan <chat> --last 300 --yes`

### `max tasks claim`

tomar una tarea abierta para que ningún otro agente trabaje en ella a la vez; la reserva caduca sola

**Cambia algo solo en este ordenador.**

```sh
max tasks claim <task> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `task` | obligatorio | el id o la clave de la tarea, como la muestra tasks list. |

| Opción | Para qué sirve |
|---|---|
| `--lease <duration>` | cuánto dura la reserva: 30m, 2h (por defecto 30m); si la tomas otra vez, se alarga. |
| `--holder <name>` | quién eres para las reservas: un id de sesión o un id de chat; por defecto WIRECAT_HOLDER, si no la sesión de Claude Code, si no el nombre del agente. |

**Returns:** take an open task so no other agent works it at once; the claim lapses by itself

**Example:** `max tasks claim PR-12 --lease 2h`

### `max tasks release`

devolver una tarea que reservaste, antes de que caduque la reserva; el propietario puede liberar cualquiera

**Cambia algo solo en este ordenador.**

```sh
max tasks release <task> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `task` | obligatorio | el id o la clave de la tarea, como la muestra tasks list. |

| Opción | Para qué sirve |
|---|---|
| `--holder <name>` | quién eres para las reservas: un id de sesión o un id de chat; por defecto WIRECAT_HOLDER, si no la sesión de Claude Code, si no el nombre del agente. |

**Returns:** give back a task you claimed, before the claim lapses; the owner may release any

**Example:** `max tasks release PR-12`

### `max tasks close`

cerrar una tarea: done o dismissed si no necesita respuesta. Un agente (AI_AGENT o CLAUDECODE definidos) indica --certainty; por debajo de task_agent_close_min, o con task_agent_close off, la tarea queda abierta hasta que el propietario confirme con tasks close o rechace con tasks reject. Una tarea cerrada permanece cerrada, salvo que tasks unmerge reabra una fusionada

**Cambia algo solo en este ordenador.**

```sh
max tasks close <task> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `task` | obligatorio | el id o la clave de la tarea, como la muestra tasks list. |

| Opción | Para qué sirve |
|---|---|
| `--as <state>` | cómo se cierra: done o dismissed — no necesita respuesta; el propietario puede omitir el estado para confirmar el cierre del agente. |
| `--reason <text>` | el motivo, guardado con la tarea — no-reply-needed, por ejemplo. |
| `--certainty <n>` | confianza del agente, de 0 a 1, en que la tarea no necesita nada más. |
| `--as-owner` | cerrar como propietario aunque se ejecute desde la terminal del agente (AI_AGENT o CLAUDECODE definidos). |

**Returns:** close a task: done, or dismissed when it needs no answer; an agent's unsure close waits…

**Example:** `max tasks close Q-15 --as done --certainty 0.9 --reason answered-in-chat`, `max tasks close Q-15`

### `max tasks reject`

rechazar el cierre sugerido por un agente: la tarea queda abierta y sale de close:suggested; el agente puede volver a proponer su cierre

**Cambia algo solo en este ordenador.**

```sh
max tasks reject <task> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `task` | obligatorio | el id o la clave de la tarea, como la muestra tasks list. |

| Opción | Para qué sirve |
|---|---|
| `--as-owner` | rechazar como propietario aunque se ejecute desde la terminal del agente (AI_AGENT o CLAUDECODE definidos). |

**Returns:** refuse an agent's close of a task: it stays open and the suggestion goes

**Example:** `max tasks reject Q-15`

## `max conversations`

las conversaciones dentro de un chat, que se encuentran en los mensajes almacenados por respuestas, menciones y quién escribió a continuación

### `max conversations build`

encontrar conversaciones de chat en lo que tiene el archivo, reemplazando la última compilación; sin --chat, cada chat que cambió desde su creación y cada grupo que nunca se creó; nunca le pregunta al servicio de mensajería

**Envía texto a un servicio externo.**

```sh
max conversations build [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | un chat: su ID o parte de su título. |
| `--analyze` |vincular lotes utilizando el proveedor de análisis configurado; requiere --chat y recuerda el consentimiento para este chat/proveedor.|
| `--provider <provider>` |análisis: agent, openai o anthropic.|
| `--model <model>` | analysis model; overrides analysis_model. |
| `--base-url <url>` | analysis API endpoint; overrides analysis_base_url. |
| `--size <n>` |mensajes de respuesta de análisis por lote, 10 a 200; predeterminado 50.|
| `--max-tokens <n>` |límite de reserva de entrada/salida de análisis por ejecución; predeterminado 100000.|
| `--max-chats <n>` |como máximo este número de chats por ejecución; 20 si no se indica.|

**Returns:** find a chat's conversations in what the store holds, replacing the last build; without…

**Example:** `max conversations build`

### `max conversations list`

Las conversaciones de un chat, las más nuevas primero: cuándo, cuántos mensajes, cuántas personas.

```sh
max conversations list <chat> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `query` | opcional | condiciones campo:valor que acotan la lista; los campos están abajo. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos resultados. |

**Returns:** conversation — id, chat, first_message, started_at, ended_at, messages_count, senders_count, built_at, and 1 more; every field: max commands schema conversations list

**Example:** `max conversations list Team`

### `max conversations show`

los mensajes de una conversación, los más antiguos primero, por su ID o en el que se encuentra el mensaje

```sh
max conversations show <conversation> [message]
```

| Argumento | | Qué es |
|---|---|---|
| `conversation` | obligatorio |una identificación de conversación de `conversations list`; o un chat: su id, o parte de su título, con un mensaje.|
| `message` | opcional |un id de mensaje en ese chat: muestra la conversación en la que se encuentra.|

**Returns:** one conversation's messages, oldest first — by its id, or the one a message is in

**Example:** `max conversations show <conversation> 1234`

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

**Returns:** the conversations nearest in meaning to the one a message is in, in every built chat,…

**Example:** `max conversations related Team 1234`

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

**Returns:** how fresh each built chat's conversations and vectors are: messages the build has not…

**Example:** `max conversations status`

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

**Returns:** how many messages still wait for an answer, in how many batches, and how much text

**Example:** `max conversations batches status --chat Team`

#### `max conversations batches next`

la siguiente ventana para responder, con los mensajes anteriores; El texto del mensaje va solo a la salida estándar.

```sh
max conversations batches next [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | un chat: su ID o parte de su título. |
| `--size <n>` |mensajes para responder por lote, 10 a 200; 50 por defecto.|

**Returns:** the next window to answer, with the messages before it; message text goes to stdout only

**Example:** `max conversations batches next --chat Team`

### `max conversations links`

las respuestas de su agente: qué mensaje anterior responde cada mensaje de un lote

#### `max conversations links add`

almacene la respuesta de su agente en un lote, lea como JSON desde la entrada estándar: { "modelo", "respuestas": [{ "mensaje", "padre", "confianza" }] }; todo o nada

**Cambia algo solo en este ordenador.**

```sh
max conversations links add [options]
```

| Opción | Para qué sirve |
|---|---|
| `--batch <id>` |se imprime el ID de lote `conversations batches next`.|

**Returns:** store your agent's answer to a batch, read as JSON from stdin: { "model", "answers": [{…

**Example:** `max conversations links add --batch 1`

#### `max conversations links clear`

deja las respuestas de tu agente para un chat, o solo las de un modelo; los mensajes nunca se tocan

**Cambia algo solo en este ordenador.**

```sh
max conversations links clear [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | un chat: su ID o parte de su título. |
| `--model <model>` |sólo las respuestas que dio este modelo.|

**Returns:** drop your agent's answers for a chat, or only one model's; messages are never touched

**Example:** `max conversations links clear --chat Team`

### `max conversations rebuild`

construye y después vectoriza con el modelo de este equipo los chats que cambiaron desde su análisis y los grupos nunca analizados, o solo --chat; cada ejecución tiene un límite, así que vuelve a ejecutarlo para el resto; nunca consulta el servicio, no descarga modelos y no envía texto a ninguna parte

**Cambia algo solo en este ordenador.**

```sh
max conversations rebuild [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | un chat: su ID o parte de su título. |
| `--max-chats <n>` | como máximo este número de chats por ejecución; 20 por defecto. |
| `--max-chunks <n>` | como máximo este número de fragmentos vectorizados por ejecución; 2000 por defecto. |

**Returns:** build and embed the chats that changed, on this machine only

**Example:** `max conversations rebuild --max-chats 5`

### `max conversations consents`

Permisos de análisis recordados para los chats de esta cuenta y los puntos finales del proveedor.

#### `max conversations consents list`

which chats and provider endpoints you allowed to analyse, and when

```sh
max conversations consents list
```

**Returns:** which chats and provider endpoints you allowed to analyse, and when

**Example:** `max conversations consents list`

#### `max conversations consents revoke`

forget analysis permissions so the next analysis asks again

**Cambia algo solo en este ordenador.**

```sh
max conversations consents revoke [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` |revocar únicamente los consentimientos de este chat; predeterminado para cada chat.|
| `--provider <identity>` |identidad exacta del proveedor de la lista de consentimientos; por defecto para cada proveedor.|

**Returns:** forget analysis permissions so the next analysis asks again

**Example:** `max conversations consents revoke`

### `max conversations embed`

calcular un vector para cada parte de las conversaciones de un chat para buscar por significado, en esta máquina o con el proveedor a través de un servicio y su clave; continúa donde se detuvo; sin --chat, a cada chat creado le quedan fragmentos, solo en esta máquina

**Envía texto a un servicio externo.**

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

**Returns:** how many chunks of a chat have a vector of the model, how many are left, and what is left…

**Example:** `max conversations embed status`

#### `max conversations embed clear`

soltar los vectores de un chat, o solo los de un modelo; Los mensajes y conversaciones nunca se tocan.

**Cambia algo solo en este ordenador.**

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

**Returns:** drop a chat's vectors, or only one model's; messages and conversations are never touched

**Example:** `max conversations embed clear`

## `max attachments`

los archivos de los mensajes guardados: su texto en el almacén local, donde la búsqueda lo encuentra

### `max attachments extract`

leer el texto de los archivos descargados (texto, capas de texto de PDF/DOCX, ODT/ODS/XLSX/PPTX/EPUB) al almacén local, donde la búsqueda los encuentra

**Cambia algo solo en este ordenador.**

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

**Returns:** read the text of downloaded files — text, PDF/DOCX text layers, ODT/ODS/XLSX/PPTX/EPUB —…

**Example:** `max attachments extract`

### `max attachments list`

archivos de los mensajes guardados, los más recientes primero: dónde se guardó cada uno y si se tiene su texto — nunca el texto

```sh
max attachments list [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | condiciones campo:valor que acotan la lista; los campos están abajo. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | qué página, empezando por 1. |
| `--all` | todas las filas, sin paginar. |

**Returns:** attachment — kind, message, position, url, name, title, mime, size, and 7 more; every field: max commands schema attachments list

**Example:** `max attachments list`

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
| `--expected-fingerprint <hash>` | exigir el SHA-256 del archivo completo de la porción anterior. |

**Returns:** read a bounded chunk of one retained attachment; JSON includes base64 bytes

**Example:** `max attachments show Team 1234`

### `max attachments text`

el texto de un archivo, mientras un agente lo lee

#### `max attachments text set`

guardar el texto que un agente leyó de un archivo (un escaneo, una foto) para que la búsqueda lo encuentre; no se envía nada

**Cambia algo solo en este ordenador.**

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

**Returns:** keep the text an agent read from a file — a scan, a photo — so search finds it; nothing…

**Example:** `max attachments text set Team 1234`

## `max tags`

tus propias etiquetas en chats, personas, mensajes y tareas, guardadas en el almacén local y nunca enviadas; tag: en una búsqueda las encuentra

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
| `--sync-first` | Leer descripciones actuales del servicio antes de clasificar. |
| `--dry-run` | Previsualizar la clasificación guardada sin modificar el archivo. |

**Returns:** derive local group/channel tags from cached metadata using keyword rules

**Example:** `max tags auto`

### `max tags add`

poner etiquetas en un chat, persona, mensaje o tarea

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
| `--task <id>` | la tarea que se etiqueta: su id o clave, como la muestra tasks list. |

**Returns:** put tags on one chat, person, message or task

**Example:** `max tags add <tag>`

### `max tags remove`

quitar etiquetas de un chat, persona, mensaje o tarea

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
| `--task <id>` | la tarea a la que se quitan etiquetas: su id o clave, como la muestra tasks list. |
| `--source <manual\|auto>` | eliminar solo la atribución a este origen. |

**Returns:** take tags off one chat, person, message or task

**Example:** `max tags remove <tag>`

### `max tags list`

qué está etiquetado: los chats, mensajes y tareas de esta cuenta, y las personas de su servicio de mensajería

```sh
max tags list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | condiciones campo:valor que acotan la lista; los campos están abajo. |

**Returns:** tagging — tag, type, target, name, sources, created_at; every field: max commands schema tags list

**Example:** `max tags list`

## `max mentions`

teléfonos, correos, enlaces, documentos, nombres y direcciones en los mensajes guardados

### `max mentions list`

las menciones de esta cuenta que coinciden con la consulta, las más recientes primero; --new para las halladas desde la última revisión

```sh
max mentions list [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | los campos de abajo; una palabra sola es un valor, así que un teléfono escrito con 8 lo encuentra también escrito con +7. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | qué página, empezando por 1. |
| `--new` | menciones sin decidir halladas desde la última ejecución de --new que las mostró todas; la primera ejecución muestra todas. |

**Returns:** this account's mentions matching the query, newest first

**Example:** `max mentions list kind:phone`, `max mentions list domain:google.com`, `max mentions list --new`

### `max mentions domains`

los sitios a los que apuntan los enlaces de esta cuenta, los más enlazados primero, con los chats y la primera y la última vez

```sh
max mentions domains [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | acota los enlaces que se cuentan: los campos están abajo; los enlaces descartados nunca se cuentan. |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | qué página, empezando por 1. |

**Returns:** the sites this account's links point to, most linked first

**Example:** `max mentions domains`, `max mentions domains status:found`

### `max mentions places`

direcciones confirmadas en todas las cuentas, primero las más mencionadas; `mentions confirm <id>` añade una

```sh
max mentions places [options]
```

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | qué página, empezando por 1. |

**Returns:** confirmed street addresses, most mentioned first

**Example:** `max mentions places`

### `max mentions show`

una mención, el texto que la rodea y en cuántos otros sitios aparece su valor

```sh
max mentions show <id>
```

| Argumento | | Qué es |
|---|---|---|
| `id` | obligatorio | el ID de la mención, de mentions list. |

**Returns:** one mention, the text around it, and how many other places hold its value

**Example:** `max mentions show 12`

### `max mentions confirm`

indica qué representa una mención: el propietario de un teléfono donde aparezca, el documento guardado, a quién corresponde un nombre o una dirección como lugar

**Cambia algo solo en este ordenador.**

```sh
max mentions confirm <id> [person] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `id` | obligatorio | el ID de la mención, de mentions list. |
| `person` | opcional | person:<uid> u organization:<id> a quien pertenece el teléfono o correo; person:<uid> a quien corresponde un nombre; un documento o una dirección postal no lo necesita. |

| Opción | Para qué sirve |
|---|---|
| `--all-in-chat` | un nombre: también cada lugar sin decidir con el mismo nombre en su chat. |
| `--as-owner` | registrarlo como tuyo aunque la herramienta se ejecute en el terminal de un agente (AI_AGENT o CLAUDECODE definidas). |

**Returns:** say what a mention is, everywhere its value is written

**Example:** `max mentions confirm 12 person:7`, `max mentions confirm 15`, `max mentions confirm 31 person:7 --all-in-chat`

### `max mentions reject`

no es una mención real: descartar su valor en todas partes y en las sincronizaciones siguientes; un nombre, solo donde aparece

**Cambia algo solo en este ordenador.**

```sh
max mentions reject <id> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `id` | obligatorio | el ID de la mención, de mentions list. |

| Opción | Para qué sirve |
|---|---|
| `--all-in-chat` | un nombre: también cada lugar sin decidir con el mismo nombre en su chat. |
| `--as-owner` | registrarlo como tuyo aunque la herramienta se ejecute en el terminal de un agente (AI_AGENT o CLAUDECODE definidas). |

**Returns:** dismiss a mention's value everywhere, and on later syncs

**Example:** `max mentions reject 12`

### `max mentions rebuild`

volver a buscar las menciones en todos los mensajes guardados; las decisiones se conservan

**Cambia algo solo en este ordenador.**

```sh
max mentions rebuild [kind]
```

| Argumento | | Qué es |
|---|---|---|
| `kind` | opcional | solo este tipo: person-name después de añadir o renombrar personas. Uno de: `phone`, `email`, `url`, `document`, `person-name`, `place`. |

**Returns:** find the mentions of every stored message again; decisions are kept

**Example:** `max mentions rebuild`, `max mentions rebuild person-name`

## `max images`

buscar imágenes por lo que muestran, con un modelo en esta máquina

### `max images embed`

calcular un vector para cada imagen que el almacén conoce y aún no tiene vector: la descarga a través del mensajero y guarda solo el vector; necesita `picture_search` activado en el perfil y `images models download clip-b32`; continúa donde se detuvo

**Cambia algo solo en este ordenador.**

```sh
max images embed [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | solo este chat; un chat: su ID o parte de su título. |
| `--limit <n>` | como máximo esta cantidad de imágenes por ejecución; 100 si no se indica. |

**Returns:** compute a vector for each stored picture that has none; resumes where it stopped

**Example:** `max images embed`, `max images embed --limit 500`

### `max images models`

modelos que leen imágenes, para `images embed` y la búsqueda de imágenes

#### `max images models list`

los modelos de imágenes, cuáles están descargados y cuál es el predeterminado

```sh
max images models list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | términos campo:valor; esta lista todavía no filtra por ninguno. |

**Returns:** model — id, kind, title, languages, size_bytes, downloaded, default, path, and 1 more; every field: max commands schema images models list

**Next usually:** `max models audio download <model>`, `max models text download <model>`, `max images models download <model>`

**Example:** `max images models list`

#### `max images models download`

descargar un modelo de imágenes una vez, comprobado contra el sha256 que espera esta versión

**Lee de un servicio externo.**

```sh
max images models download <model>
```

| Argumento | | Qué es |
|---|---|---|
| `model` | obligatorio | un ID de modelo de `images models list`. |

**Returns:** model — id, kind, title, languages, size_bytes, downloaded, default, path, and 1 more; every field: max commands schema images models download

**Next usually:** `max models audio download <model>`, `max models text download <model>`

**Example:** `max images models download clip-b32`

## `max metadata`

descripciones de grupos y canales en caché para las etiquetas automáticas locales

### `max metadata get`

la descripción en caché de un chat almacenado, tal como la leen las etiquetas automáticas

```sh
max metadata get [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat <chat>` | un chat almacenado. |

**Returns:** a stored chat's cached description, as automatic tags read it

**Example:** `max metadata get --chat 7`

### `max metadata refresh`

vuelve a obtener las descripciones de grupos y canales y las guarda en caché

**Cambia algo solo en este ordenador.**

```sh
max metadata refresh [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | Grupo/canal guardado; repite para elegir varios. Por defecto: ``. |
| `--only-missing` |Solo chats sin metadatos; sin --chat, todos los grupos/canales guardados.|
| `--limit <number>` |Procesar 1–500 chats como máximo. Por defecto: `50`.|

**Returns:** fetch group and channel descriptions again and cache them

**Example:** `max metadata refresh --chat 7 --chat 8`, `max metadata refresh --only-missing --limit 20`

## `max search`

buscar por texto: un recurso si lo conoces (messages, notes), o search all en mensajes y notas; para el correo, la CLI aparte memo: memo search mail

### `max search all`

buscar mensajes del servicio de mensajería y notas en el almacén local, y mensajes en el servidor del servicio (--backend; las notas solo son locales), y transcripciones de una cuenta de reuniones cuando --source la nombra; primero la mejor coincidencia; no correo (lo busca la CLI aparte memo: memo search mail), tareas, personas, recuerdos ni proyectos. Úsalo cuando no sepas dónde se escribió algo; search messages o notes lee un solo tipo con todos sus campos

```sh
max search all <query> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | obligatorio | consulta Lucene estricta: palabras, "frases", AND/OR/NOT, grupos de campos y rangos de fechas. |

| Opción | Para qué sirve |
|---|---|
| `--only <resources>` | solo estos recursos, separados por comas: messages, notes; meetings cuando --source nombra una cuenta de reuniones. |
| `--source <accounts>` | solo estas cuentas, separadas por comas: provider:account tal como lo muestra un resultado, un proveedor, un tipo o group:<name>; cada recurso lee las de su tipo, y las reuniones solo cuando se nombra una. |
| `--max-meetings <n>` | cuántas reuniones de la cuenta de reuniones revisar, de la más reciente a la más antigua, o all para todas (por defecto 100). |
| `--limit <n>` | cuántos resultados. |
| `--page <n>` | qué página, empezando por 1. |
| `--exact` |las palabras sin campo y las frases entre comillas coinciden solo en su forma exacta, como exact:word.|
| `--timezone <zone>` | la zona horaria IANA para los límites de las fechas del calendario. |
| `--backend <archive\|server\|both>` | dónde buscar: el archivo local, el servidor del servicio de mensajería o ambos (predeterminado: both). Discovery usa solo el archivo. |
| `--server-time <duration>` | dejar de esperar al servidor tras este tiempo (predeterminado: 5s). |

**Returns:** hit — kind, ref, provider, account, title, timestamp, excerpt, url, and 4 more; every field: max commands schema search all

**Example:** `max search all "invoice"`

### `max search messages`

buscar mensajes del servicio de mensajería en el almacenamiento local y en el servidor del servicio (--backend); opcionalmente descargar mensajes nuevos con --sync-first; --discover busca solo en el archivo

```sh
max search messages [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | consulta estricta de Lucene: palabras, "frases", AND/OR/NOT, grupos de campos y rangos de fechas; con --saved, más palabras unidas a ella con AND. |

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
| `--backend <archive\|server\|both>` | dónde buscar: el archivo local, el servidor del servicio de mensajería o ambos (predeterminado: both). Discovery usa solo el archivo. |
| `--server-time <duration>` | dejar de esperar al servidor tras este tiempo (predeterminado: 5s). |
| `--source <accounts>` | cada cuenta de este servicio de mensajería guardada en el almacén; personal, bots o all, igual que in: en la consulta; o una lista: group:work,telegram:Alice. |
| `--limit <n>` | cuántos resultados. |
| `--page <n>` | qué página, empezando por 1. |
| `--newest` | primero los más recientes en lugar de los mejores. |
| `--exact` |las palabras sin campo y las frases entre comillas coinciden solo en su forma exacta, como exact:word; text: sigue admitiendo todas las formas.|
| `--context <n>` |mensajes antes y después de cada resultado; 2 en la terminal, 0 en caso contrario.|
| `--discover` | encuentra coincidencias parciales y respuestas directas válidas en el archivo local; son evidencia, no respuestas confirmadas. |
| `--timezone <zone>` | la zona horaria IANA para los límites de las fechas del calendario. |
| `--saved <name\|id>` |ejecutar una búsqueda guardada o una ejecución anterior; Las opciones escritas aquí reemplazan las suyas.|

**Returns:** message hit — ref, timestamp, sender_name, chat_title, excerpt, matched_in, score, found_in, and 3 more; every field: max commands schema search messages

**Next usually:** `max messages links <chat> <message>`, `max messages transcribe <chat> <message>`, `max stats messages evidence <message>`

**Example:** `max search messages "invoice"`

### `max search notes`

buscar en las notas —escritas en memo o importadas de una carpeta de notas— por palabras y, con el modelo de texto local, por significado; cada resultado indica cómo se encontró y a qué enlaza

```sh
max search notes <query> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | obligatorio | consulta Lucene estricta: palabras, "frases", AND/OR/NOT, tag:, source:internal (escritas en memo) o source:file (desde una carpeta de notas) y rangos de fechas. |

| Opción | Para qué sirve |
|---|---|
| `--source <accounts>` | solo estas cuentas de notas, separadas por comas: notes:internal para las notas escritas en memo, notes:<folder id> tal como lo muestra un resultado, notes, documents o group:<name>. |
| `--filter <query>` | una consulta que también debe cumplir cada resultado; no cambia la búsqueda por significado. |
| `--limit <n>` | cuántos resultados. |
| `--page <n>` | qué página, empezando por 1. |
| `--exact` | solo las palabras tal como se escriben; no se busca por significado. |
| `--timezone <zone>` | la zona horaria IANA para los límites de las fechas del calendario. |

**Returns:** note hit — ref, source, folder_id, path, title, updated_at, kind, provider, and 5 more; every field: max commands schema search notes

**Example:** `max search notes "invoice"`

### `max search conversations`

las conversaciones más cercanas a una consulta por significado y por palabras, las mejores primero, en un chat o en todos — por significado tras `conversations embed`; se ejecuta en este comando

**Lee de un servicio externo.**

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
| `--max-chats <n>` |como máximo esta cantidad de chats; 5 con --sync-first, 20 con --catch-up si no se proporciona.|
| `--max-chunks <n>` |como máximo esta cantidad de fragmentos incrustados en una sola ejecución; 2000 si no se da.|
| `--sync-first` | primero descargar mensajes nuevos dentro de los límites de chat, tiempo y mensajes. |
| `--sync-time <duration>` | dejar de descargar tras este tiempo (predeterminado: 30s). |
| `--max-messages <n>` | descargar como máximo este número de mensajes en total (predeterminado: 500). |
| `--chat <chat>` | solo este chat: su ID o parte de su título. |
| `--since-time <time>` |solo aquellos que todavía funcionan en este momento ISO 8601, o hace 30 m/2 h/1 d, o más tarde.|
| `--filter <query>` |filtro estricto de Lucene: cualquier mensaje de una conversación debe coincidir; no cambia la consulta de significado.|
| `--source <accounts>` | cuentas en las que buscar: personal, bots, all, un proveedor o una lista como group:work,telegram:Alice,email:me@example.com; por defecto, la cuenta activa. |
| `--timezone <zone>` |Zona horaria de IANA para fechas de filtrado; zona horaria del sistema de forma predeterminada.|
| `--limit <n>` | cuántos resultados. |
| `--catch-up` |Primero construya e incruste, en esta máquina, los chats en el alcance que cambiaron o que nunca se crearon, dentro de --max-chats y --max-chunks.|

**Returns:** the conversations nearest to a query in meaning and in words, best first, in one chat or…

**Example:** `max search conversations "invoice"`

## `max searches`

búsquedas guardadas e historial de search messages y stats messages show en el almacenamiento local; --saved ejecuta una

### `max searches create`

guardar una búsqueda con un nombre sin ejecutarla; buscar mensajes --guardado <name> lo ejecuta

**Cambia algo solo en este ordenador.**

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
| `--source <accounts>` | cada cuenta de este servicio de mensajería guardada en el almacén; personal, bots o all, igual que in: en la consulta; o una lista: group:work,telegram:Alice,email:me@example.com. |
| `--limit <n>` | cuántos resultados. |
| `--newest` | primero los más recientes en lugar de los mejores. |
| `--exact` |las palabras sin campo y las frases entre comillas coinciden solo en su forma exacta, como exact:word; text: sigue admitiendo todas las formas.|
| `--context <n>` |mensajes antes y después de cada resultado.|
| `--timezone <zone>` | la zona horaria IANA para los límites de las fechas del calendario. |
| `--by <chat\|sender\|day\|hour>` |por qué criterio agrupa el recuento stats messages show --saved.|
| `--selection <json>` | guardar la consulta de clasificación principal resuelta y sus opciones a partir de una vista detallada. |
| `--replace` |sobrescribir una búsqueda guardada con el mismo nombre.|

**Returns:** saved search — id, name, command, params, language, version, fields_version, created_at, and 2 more; every field: max commands schema searches create

**Example:** `max searches create daily "invoice"`

### `max searches show`

una búsqueda guardada o ejecución anterior: su consulta, opciones y con qué frecuencia se ejecutó

```sh
max searches show <name|id>
```

| Argumento | | Qué es |
|---|---|---|
| `name\|id` | obligatorio | el nombre de una búsqueda guardada o el ID de cualquier fila del historial de searches. |

**Returns:** saved search — id, name, command, params, language, version, fields_version, created_at, and 2 more; every field: max commands schema searches show

**Example:** `max searches show <name|id>`

### `max searches list`

las búsquedas guardadas, por nombre

```sh
max searches list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | condiciones campo:valor; esta lista aún no filtra por ninguno. |

**Returns:** saved search — id, name, command, params, language, version, fields_version, created_at, and 2 more; every field: max commands schema searches list

**Example:** `max searches list`

### `max searches history`

las búsquedas y recuentos que se realizaron, los más nuevos primero, incluidos los guardados; nunca sus resultados

```sh
max searches history [options]
```

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos mostrar. |
| `--page <n>` | qué página, empezando por 1. |
| `--all` | todas las filas, sin paginar. |

**Returns:** saved search — id, name, command, params, language, version, fields_version, created_at, and 2 more; every field: max commands schema searches history

**Example:** `max searches history`

### `max searches delete`

eliminar una búsqueda guardada o una ejecución del historial

**Cambia algo solo en este ordenador.**

```sh
max searches delete <name|id>
```

| Argumento | | Qué es |
|---|---|---|
| `name\|id` | obligatorio | el nombre de una búsqueda guardada o el ID de cualquier fila del historial de searches. |

**Returns:** saved search — id, name, command, params, language, version, fields_version, created_at, and 2 more; every field: max commands schema searches delete

**Example:** `max searches delete <name|id>`

### `max searches clear`

vaciar la historia; las búsquedas guardadas permanecen

**Cambia algo solo en este ordenador.**

```sh
max searches clear
```

**Returns:** empty the history; saved searches stay

**Example:** `max searches clear`

## `max flood`

las esperas MAX solicitaron que este perfil se mantuviera y se retuvieran sus escrituras

### `max flood clear`

olvidarlos y levantar la pausa y el límite de ritmo del perfil cuando MAX ya no limite la cuenta; no cambia nada en MAX

**Cambia algo solo en este ordenador.**

```sh
max flood clear
```

**Returns:** forget them, lift the hold and the profile's pace, once MAX no longer limits the account;…

**Example:** `max flood clear`

## `max models`

Modelos que se ejecutan en esta máquina.

### `max models audio`

modelos de voz para transcribir mensajes de voz

#### `max models audio list`

los modelos de voz, el más adecuado primero, cuáles se descargan y cuál es el predeterminado

```sh
max models audio list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | condiciones campo:valor; esta lista aún no filtra por ninguno. |

**Returns:** model — id, kind, title, languages, size_bytes, downloaded, default, path, and 1 more; every field: max commands schema models audio list

**Next usually:** `max models audio download <model>`, `max models text download <model>`, `max images models download <model>`

**Example:** `max models audio list`

#### `max models audio download`

descargue un modelo de voz una vez, comparado con el sha256 que espera esta versión

**Lee de un servicio externo.**

```sh
max models audio download <model>
```

| Argumento | | Qué es |
|---|---|---|
| `model` | obligatorio |una identificación de modelo de `models audio list`.|

**Returns:** model — id, kind, title, languages, size_bytes, downloaded, default, path, and 1 more; every field: max commands schema models audio download

**Next usually:** `max models text download <model>`, `max images models download <model>`

**Example:** `max models audio download default`

### `max models text`

modelos de búsqueda por significado

#### `max models text list`

los modelos de incrustación, el más adecuado primero, cuáles se descargan y cuál es el predeterminado

```sh
max models text list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | condiciones campo:valor; esta lista aún no filtra por ninguno. |

**Returns:** model — id, kind, title, languages, size_bytes, downloaded, default, path, and 1 more; every field: max commands schema models text list

**Next usually:** `max models text download <model>`, `max models audio download <model>`, `max images models download <model>`

**Example:** `max models text list`

#### `max models text download`

descargue un modelo de incrustación una vez, comparado con el sha256 que espera esta versión

**Lee de un servicio externo.**

```sh
max models text download <model> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `model` | obligatorio |una identificación de modelo de `models text list`.|

| Opción | Para qué sirve |
|---|---|
| `--accept-terms` |aceptar los términos de licencia del modelo, para un modelo que tiene los suyos propios.|

**Returns:** model — id, kind, title, languages, size_bytes, downloaded, default, path, and 1 more; every field: max commands schema models text download

**Next usually:** `max models audio download <model>`, `max images models download <model>`

**Example:** `max models text download default`

#### `max models text key`

Claves API para proveedores de incrustación y análisis

#### `max models text key set`

guardar una clave mediante entrada oculta o stdin; nunca como argumento

**Cambia algo solo en este ordenador.**

```sh
max models text key set <provider>
```

| Argumento | | Qué es |
|---|---|---|
| `provider` | obligatorio |openai, anthropic o el host de un servidor --base-url que quiere una clave.|

**Returns:** store a key, typed at a hidden prompt or piped on stdin — never as an argument

**Example:** `max models text key set <provider>`

#### `max models text key remove`

olvidar una clave almacenada

**Cambia algo solo en este ordenador.**

```sh
max models text key remove <provider>
```

| Argumento | | Qué es |
|---|---|---|
| `provider` | obligatorio |openai, anthropic o el host de un servidor.|

**Returns:** forget a stored key

**Example:** `max models text key remove <provider>`

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

**Returns:** a poll and its answer ids, as the message carries it now

**Example:** `max polls show Team 1234`

### `max polls vote`

votar en una encuesta o retirar su voto; los demás lo ven a menos que la encuesta sea anónima

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** vote in a poll, or take your vote back; the others see it unless the poll is anonymous

**Example:** `max polls vote Team 1234`

### `max polls close`

cierra tu propia encuesta; nadie puede votar después de eso y no se puede reabrir

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max polls close <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `message` | obligatorio |la identificación de su propio mensaje que lleva la encuesta.|

**Returns:** close your own poll; nobody can vote after that, and it cannot be reopened

**Example:** `max polls close Team 1234`

### `max polls create`

enviar una encuesta a un chat, como mensaje propio; público a menos que --anónimo

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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
| `--multiple` | people may pick several answers. |
| `--anonymous` |nadie ve qué opción eligió cada persona.|
| `--revote` | people may change their vote. |
| `--silent` |enviar sin notificación.|
| `--send-as <id>` | publicar como una de las identidades que enumera `chats send-as`; obligatorio cuando el chat publica como otra identidad de forma predeterminada. |
| `--operation-id <id>` |repetir una creación cuyo resultado se desconocía, sin arriesgarse a una segunda encuesta.|

**Returns:** send a poll to a chat, as a message of its own; public unless --anonymous

**Example:** `max polls create Team <question> <answers>`

## `max reactions`

reaccionar a los mensajes

### `max reactions add`

pon tu reacción en un mensaje; reemplaza el que tenias

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max reactions add <chat> <message> <emoji>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `message` | obligatorio | el ID del mensaje. |
| `emoji` | obligatorio |un emoji, por ejemplo 👍.|

**Returns:** put your reaction on a message; it replaces the one you had

**Example:** `max reactions add Team 1234 <emoji>`

### `max reactions remove`

quita tu reacción de un mensaje

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max reactions remove <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | un chat: su ID o parte de su título. |
| `message` | obligatorio | el ID del mensaje. |

**Returns:** take your reaction off a message

**Example:** `max reactions remove Team 1234`

## `max recipients`

los chats a los que este perfil puede enviar, cuando la lista está activada

### `max recipients list`

los chats de la lista; vacío y apagado hasta el primer agregado

```sh
max recipients list
```

**Returns:** the chats on the list; empty and off until the first add

**Example:** `max recipients list`

### `max recipients add`

permitir el envío a este chat; el primer agregado enciende la lista

**Cambia algo solo en este ordenador.**

```sh
max recipients add <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID del chat o parte de su nombre. |

**Returns:** allow sending to this chat; the first add turns the list on

**Example:** `max recipients add Team`

### `max recipients remove`

deja de permitir este chat; la lista sigue encendida

**Cambia algo solo en este ordenador.**

```sh
max recipients remove <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio |ID de chat o el título como lo muestra la lista.|

**Returns:** stop allowing this chat; the list stays on

**Example:** `max recipients remove Team`

### `max recipients clear`

vacíe la lista y apáguela: este perfil puede enviar a cualquier chat nuevamente

**Cambia algo solo en este ordenador.**

```sh
max recipients clear
```

**Returns:** empty the list and turn it off: this profile may send to any chat again

**Example:** `max recipients clear`

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
| `--page <n>` | qué página, empezando por 1. |
| `--all` | todas las filas, sin paginar. |

**Returns:** attempts to send, newest first: sent, refused, failed, or not known

**Example:** `max sends list`

## `max inbox`

los mensajes no leídos de otras personas en cada chat; --nuevo por lo que llegó desde el último cheque

```sh
max inbox [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | desde cuándo: date>2h, date>2026-10-01; el punto guardado no se mueve. |

| Opción | Para qué sirve |
|---|---|
| `--new` |lo que llegó desde la última verificación, cada mensaje una vez, para ejecuciones programadas.|
| `--limit <n>` |como máximo estos tantos por chat, los más nuevos.|
| `--all` |Chats silenciados y archivados también: excluidos a menos que te mencionen o te respondan.|
| `--kind <kinds>` |solo chats de este tipo, separados por comas: diálogo, grupo, canal, guardados.|
| `--transcribe` |convertir los mensajes de voz que aún no se han escuchado en texto, por el servicio de mensajería cuando puede o, si no, por un modelo de esta máquina; puede tardar unos minutos.|
| `--model <id>` |qué modelo de voz descargado los escucha, con --transcribe; `models audio list` se los muestra.|
| `--mark-read` |también marque cada chat mostrado como leído, hasta el mensaje más reciente mostrado; el otro lado lo ve.|
| `--no-mark-read` | no lo hagas, independientemente de lo que diga la configuración catch_up_marks_read. |

**Returns:** message summary — ref, chat_id, timestamp, sender_name, outgoing, text, attachments, chat_title, and 1 more; every field: max commands schema inbox

**Next usually:** `max messages links <chat> <message>`, `max messages transcribe <chat> <message>`, `max stats messages evidence <message>`

**Example:** `max inbox`

## `max review`

cada mensaje, el tuyo también, en chats que cambiaron desde un momento, para revisar quién debe qué

```sh
max review [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | dónde terminó la última revisión y qué chat: date>2h, chat:"Book club"; hace 3 días si no hay fecha. |

| Opción | Para qué sirve |
|---|---|
| `--kind <kinds>` |solo chats de este tipo, separados por comas: diálogo, grupo, canal, guardados.|
| `--unanswered [duration]` |sólo preguntas para usted o los administradores de un grupo que nadie respondió, formuladas al menos hace tanto tiempo: 4 h, 1 d; 24h si no se da.|
| `--all` |Chats silenciados y archivados también: excluidos a menos que te mencionen o te respondan.|
| `--transcribe` |convertir los mensajes de voz que aún no se han escuchado en texto, por el servicio de mensajería cuando puede o, si no, por un modelo de esta máquina; puede tardar unos minutos.|
| `--model <id>` |qué modelo de voz descargado los escucha, con --transcribe; `models audio list` se los muestra.|
| `--new` |Lo que cambió desde el último `review --new`, un punto por chat, para ejecuciones programadas.|
| `--mark-read` |también marque cada chat mostrado como leído, hasta el mensaje más reciente mostrado; el otro lado lo ve.|
| `--no-mark-read` | no lo hagas, independientemente de lo que diga la configuración catch_up_marks_read. |

**Returns:** message summary — ref, chat_id, timestamp, sender_name, outgoing, text, attachments, chat_title, and 1 more; every field: max commands schema review

**Next usually:** `max messages links <chat> <message>`, `max messages transcribe <chat> <message>`, `max stats messages evidence <message>`

**Example:** `max review`

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

**Returns:** add a rule with every default written out, off until you edit and enable it

**Example:** `max replies add 1`

### `max replies on`

activar una regla de respuesta; su plantilla debe estar lista

**Cambia algo solo en este ordenador.**

```sh
max replies on <id>
```

| Argumento | | Qué es |
|---|---|---|
| `id` | obligatorio | ID de la regla. |

**Returns:** enable one reply rule; its template must be ready

**Example:** `max replies on 1`

### `max replies off`

desactivar una regla de respuesta

**Cambia algo solo en este ordenador.**

```sh
max replies off <id>
```

| Argumento | | Qué es |
|---|---|---|
| `id` | obligatorio | ID de la regla. |

**Returns:** disable one reply rule

**Example:** `max replies off 1`

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
| `--allow-chats <ids>` | solo estos identificadores de chat, separados por comas; vacío para cualquiera. |
| `--deny-chats <ids>` | excluir estos identificadores de chat, separados por comas; vacío borra la lista. |
| `--words <words>` | coincidir con cualquiera de estas palabras completas, separadas por comas; vacío borra la lista. |
| `--question` | coincidir solo con preguntas. |
| `--no-question` | no exigir una pregunta. |
| `--mentions-me` | exigir que te mencionen o que respondan a tu mensaje. |
| `--no-mentions-me` | no exigir que te mencionen ni que respondan a tu mensaje. |
| `--allow-people <ids>` | solo estos identificadores de remitentes, separados por comas; vacío para cualquiera. |
| `--deny-people <ids>` | excluir estos identificadores de remitentes, separados por comas; vacío borra la lista. |
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

**Returns:** change only the named fields of a reply rule; lists replace the whole list

**Example:** `max replies edit 1`

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

**Returns:** show the reply audience, who the rules may answer, or replace its named fields; a new…

**Example:** `max replies audience`

### `max replies consents`

consentimiento para los modelos de respuesta una vez por perfil y endpoint, con exclusiones por chat

#### `max replies consents show`

mostrar el consentimiento para el modelo de respuesta y las exclusiones de chats; nunca llama a un modelo

```sh
max replies consents show
```

**Returns:** show the reply model consent and chat opt-outs; never calls a model

**Example:** `max replies consents show`

#### `max replies consents grant`

permitir que los datos de mensajes entrantes se envíen al modelo de respuesta configurado para este perfil; se conservan las exclusiones de chats

**Cambia algo solo en este ordenador.**

```sh
max replies consents grant
```

**Returns:** allow incoming message data to go to the configured reply model for this profile; chat…

**Example:** `max replies consents grant`

#### `max replies consents revoke`

revocar de inmediato el consentimiento del perfil para el modelo de respuesta; se conservan las exclusiones de chats

**Cambia algo solo en este ordenador.**

```sh
max replies consents revoke
```

**Returns:** revoke the profile's reply model consent immediately; chat opt-outs remain

**Example:** `max replies consents revoke`

#### `max replies consents deny`

evitar que los datos entrantes de este chat se envíen al modelo de respuesta

**Cambia algo solo en este ordenador.**

```sh
max replies consents deny <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID del chat en el servicio, utilizado tal como se indica; nunca se resuelve a través de la red. |

**Returns:** keep this chat's incoming data away from the reply model

**Example:** `max replies consents deny Team`

#### `max replies consents allow`

eliminar la exclusión de este chat del modelo; no concede consentimiento al perfil

**Cambia algo solo en este ordenador.**

```sh
max replies consents allow <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID del chat en el servicio, utilizado tal como se indica; nunca se resuelve a través de la red. |

**Returns:** remove this chat's model opt-out; does not grant profile consent

**Example:** `max replies consents allow Team`

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

**Returns:** what the rules would have answered in the stored messages, to whom and why — sends…

**Example:** `max replies test`

### `max replies pause`

detener todas las reglas de respuesta de este perfil a la vez, también un servicio en ejecución; reanudar lo deshace

**Cambia algo solo en este ordenador.**

```sh
max replies pause
```

**Returns:** stop every reply rule of this profile at once, a running serve too; resume undoes it

**Example:** `max replies pause`

### `max replies resume`

dejar que las reglas de respuesta respondan nuevamente después de una pausa

**Cambia algo solo en este ordenador.**

```sh
max replies resume
```

**Returns:** let the reply rules answer again after pause

**Example:** `max replies resume`

### `max replies status`

si las reglas pueden enviar, cuáles están vigentes y a quién pueden responder

```sh
max replies status
```

**Returns:** whether the rules may send, which are on, and who they may answer

**Example:** `max replies status`

## `max serve`

manténgase conectado a MAX y transmita nuevos mensajes a `max watch`, hasta Ctrl-C

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max serve [options]
```

| Opción | Para qué sirve |
|---|---|
| `--idle <duration>` |deténgase después de tanto tiempo sin que nadie lo use: 15 m, 1 h son 60 m.|
| `--max-subscriber-buffer-bytes <bytes>` | búfer por observador antes de desconectarlo; 0 es sin límite. |
| `--max-subscriber-total-buffer-bytes <bytes>` | presupuesto conjunto de búfer de todos los observadores; 0 es sin límite. |

**Returns:** stay connected to MAX and stream new messages to `max watch`, until Ctrl-C

**Example:** `max serve`

## `max server`

`max serve` en segundo plano: inicio, parada, reinicio, estado, registros; instalar agrega una unidad systemd o launchd

### `max server start`

comience a servir en segundo plano (a través de la unidad si hay una instalada) y responda una vez que se conecte

**Cambia algo solo en este ordenador.**

```sh
max server start [options]
```

| Opción | Para qué sirve |
|---|---|
| `--idle <duration>` | detenerse tras este tiempo sin uso — 15m, 1h. |

**Returns:** start serve in the background — through the unit if one is installed — and answer once it…

**Example:** `max server start`

### `max server stop`

detener el servicio de este perfil: a través de la unidad si se ejecuta bajo uno

**Cambia algo solo en este ordenador.**

```sh
max server stop
```

**Returns:** stop this profile's serve — through the unit if it runs under one

**Example:** `max server stop`

### `max server restart`

detenerlo y empezar de nuevo

**Cambia algo solo en este ordenador.**

```sh
max server restart [options]
```

| Opción | Para qué sirve |
|---|---|
| `--idle <duration>` | detenerse tras este tiempo sin uso — 15m, 1h. |

**Returns:** stop it and start it again

**Example:** `max server restart`

### `max server status`

si el servicio se ejecuta para este perfil, desde cuándo, quién lo inició y la unidad, si la hay

```sh
max server status
```

**Returns:** whether serve runs for this profile, since when, who started it, and the unit if there is…

**Example:** `max server status`

### `max server logs`

Las últimas líneas de registro del servidor: del diario en systemd; de lo contrario, su archivo de registro.

```sh
max server logs [options]
```

| Opción | Para qué sirve |
|---|---|
| `-n, --limit <n>` | how many lines. Por defecto: `50`. |

**Returns:** serve's latest log lines — from the journal under systemd, else its log file

**Example:** `max server logs`

### `max server install`

escriba una unidad de usuario systemd o un agente de lanzamiento para este perfil; no empieza nada

**Cambia algo solo en este ordenador.**

```sh
max server install
```

**Returns:** write a systemd user unit or a launchd agent for this profile; starts nothing

**Example:** `max server install`

### `max server uninstall`

eliminar la unidad de este perfil; detenlo primero

**Cambia algo solo en este ordenador.**

```sh
max server uninstall
```

**Returns:** remove this profile's unit; stop it first

**Example:** `max server uninstall`

## `max schedule`

ejecutar un comando de max o un agente más tarde o de forma programada (systemd, launchd, Programador de tareas); un agente no puede enviar

### `max schedule command`

ejecutar max <args…> de forma programada; las lecturas guardan lo leído, así se llena el almacén con el historial de un chat

**Cambia algo solo en este ordenador.**

```sh
max schedule command <name> <args> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `name` | obligatorio | letras minúsculas, dígitos y guiones. |
| `args` | obligatorio | el comando de max después de su nombre, p. ej. -- messages list <chat> --limit 50. |

| Opción | Para qué sirve |
|---|---|
| `--every <duration>` | repetir: 30m, 2h, 1d. |
| `--at <HH:MM>` | cada día a esta hora local. |
| `--at-time <time>` | una sola ejecución: dentro de 30m, 2d o a una hora ISO; después la programación se elimina sola. |

**Returns:** run max <args…> on a timer — reads save what they read, so this is how a chat's history…

**Example:** `max schedule command daily <args>`

### `max schedule agent`

iniciar un agente (claude o codex) con una petición de forma programada; se ejecuta con MAX_READ_ONLY=1, así que lee y redacta borradores pero no puede enviar; su respuesta se guarda y recibes un aviso

**Cambia algo solo en este ordenador.**

```sh
max schedule agent <name> <harness> <prompt> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `name` | obligatorio | letras minúsculas, dígitos y guiones. |
| `harness` | obligatorio | el agente que se inicia. Uno de: `claude`, `codex`. |
| `prompt` | obligatorio | qué hacer, p. ej. "run the daily follow-up review: max skill show follow-ups". |

| Opción | Para qué sirve |
|---|---|
| `--max-cost <usd>` | solo claude: detener una ejecución que cueste más que esto, en dólares estadounidenses. |
| `--every <duration>` | repetir: 30m, 2h, 1d. |
| `--at <HH:MM>` | cada día a esta hora local. |
| `--at-time <time>` | una sola ejecución: dentro de 30m, 2d o a una hora ISO; después la programación se elimina sola. |

**Returns:** start an agent (claude or codex) with a prompt on a timer; it runs with MAX_READ_ONLY=1,…

**Example:** `max schedule agent daily claude <prompt>`

### `max schedule list`

las programaciones, cuándo se ejecutan y cómo fue su última ejecución

```sh
max schedule list
```

**Returns:** the schedules, when they run and how their last run went

**Example:** `max schedule list`

### `max schedule run`

ejecutar una programación ahora, como lo haría su temporizador, y esperar a que termine

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max schedule run <name>
```

| Argumento | | Qué es |
|---|---|---|
| `name` | obligatorio |  |

**Returns:** run a schedule now, as its timer would, and wait for it

**Example:** `max schedule run daily`

### `max schedule remove`

detener una programación y eliminar su temporizador; sus resultados anteriores se conservan

**Cambia algo solo en este ordenador.**

```sh
max schedule remove <name>
```

| Argumento | | Qué es |
|---|---|---|
| `name` | obligatorio |  |

**Returns:** stop a schedule and remove its timer; its past output stays

**Example:** `max schedule remove daily`

### `max schedule exec`

lo que ejecuta un temporizador, a partir del archivo de la programación; para ejecutarla a mano, usa run

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max schedule exec <file>
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio |  |

**Returns:** what a timer runs, given the schedule's file; to run one by hand, use run

**Example:** `max schedule exec ./report.pdf`

## `max watch`

imprimir nuevos mensajes a medida que llegan, desde un `max serve` en ejecución

```sh
max watch [options]
```

| Opción | Para qué sirve |
|---|---|
| `--events` |mostrar también ediciones, eliminaciones, reacciones, lecturas y cambios de chats; cada línea indica su evento.|

**Returns:** print new messages as they arrive, from a running `max serve`

**Example:** `max watch`

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

**Returns:** the profile, the profiles that exist, and each setting with where it came from

**Example:** `max config show`

### `max config set`

guardar una configuración en el archivo de configuración

**Cambia algo solo en este ordenador.**

```sh
max config set <setting> <value> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `setting` | obligatorio | uno de: limit, timeout_ms, color, record, keep_runs_for_days, permissions, sends_per_hour, requests_per_minute, embedding_provider, embedding_model, embedding_base_url, embedding_dims, analysis_provider, analysis_model, analysis_base_url, models, sender_colors, catch_up_marks_read, search_catch_up, serve, read_other_bots, update_check, skill_hint, transcribe_model, default_profile, search_stemmers.cyrillic, search_stemmers.latin, phone_countries, task_categories.<name>, task_agent_close, task_agent_close_min, task_first_pass_per_chat. |
| `value` | obligatorio | un número, true o false, o una lista como contacts,polls. |

| Opción | Para qué sirve |
|---|---|
| `--defaults` | cambiar lo que reciben todos los perfiles, no solo este. |
| `--personal` | solo para cuentas personales — la sección personal del archivo. |
| `--bot` | solo para bots — la sección bot del archivo. |

**Returns:** save a setting to the configuration file

**Example:** `max config set <setting> <value>`

### `max config unset`

eliminar una configuración del archivo de configuración

**Cambia algo solo en este ordenador.**

```sh
max config unset <setting> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `setting` | obligatorio | uno de: limit, timeout_ms, color, record, keep_runs_for_days, permissions, sends_per_hour, requests_per_minute, embedding_provider, embedding_model, embedding_base_url, embedding_dims, analysis_provider, analysis_model, analysis_base_url, models, sender_colors, catch_up_marks_read, search_catch_up, serve, read_other_bots, update_check, skill_hint, transcribe_model, default_profile, search_stemmers.cyrillic, search_stemmers.latin, phone_countries, task_categories.<name>, task_agent_close, task_agent_close_min, task_first_pass_per_chat. |

| Opción | Para qué sirve |
|---|---|
| `--defaults` | cambiar lo que reciben todos los perfiles, no solo este. |
| `--personal` | solo para cuentas personales — la sección personal del archivo. |
| `--bot` | solo para bots — la sección bot del archivo. |

**Returns:** remove a setting from the configuration file

**Example:** `max config unset <setting>`

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

**Cambia algo solo en este ordenador.**

```sh
max doctor report create [options]
```

| Opción | Para qué sirve |
|---|---|
| `--run <id>` |la ejecución sobre la que trata el informe; el más nuevo falló si no se proporciona.|
| `--output <file>` |dónde escribirlo; un nuevo archivo en este directorio si no se proporciona.|

**Returns:** write a problem report to a file, and print how to send it

**Example:** `max doctor report create`

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
| `--page <n>` | qué página, empezando por 1. Por defecto: `1`. |

**Returns:** recorded runs, newest first

**Example:** `max runs list`

### `max runs show`

una ejecución: qué fue, cómo terminó y todos los eventos que registró

```sh
max runs show <run-id> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `run-id` | obligatorio | un ID de `max runs list`. |

| Opción | Para qué sirve |
|---|---|
| `--problems` | solo respuestas fallidas, avisos y caídas. |

**Returns:** one run: what it was, how it ended, and every event it logged

**Example:** `max runs show <run-id>`

### `max runs search`

search recorded diagnostic metadata and events; no message contents

```sh
max runs search [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional | case-insensitive literal diagnostic text. |

| Opción | Qué hace |
|---|---|
| `--status <status>` | run outcome. Uno de: `success`, `failed`, `partial`, `running`. |
| `--error-code <code>` | one stable error code. |
| `--operation <name>` | one operation, such as messages.download. |
| `--profile <name>` | one recorded profile. |
| `--since-time <time>` | runs starting on or after an ISO time or 2h / 1d ago. |
| `--limit <n>` | matches per page, at most 100. Por defecto: `20`. |
| `--page <n>` | result page. Por defecto: `1`. |

**Returns:** search recorded diagnostic metadata and events; no message contents

**Example:** `max runs search "invoice"`

### `max runs path`

el directorio que contiene una ejecución

```sh
max runs path <run-id>
```

| Argumento | | Qué es |
|---|---|---|
| `run-id` | obligatorio | un ID de `max runs list`. |

**Returns:** the directory holding one run

**Example:** `max runs path <run-id>`

## `max skill`

las instrucciones que recibe un agente para esta herramienta

### `max skill show`

print SKILL.md: `max skill install` lo coloca donde lo buscan Claude Code, Codex y Gemini CLI

```sh
max skill show [name]
```

| Argumento | | Qué es |
|---|---|---|
| `name` | opcional | una de las habilidades incluidas para una tarea: follow-ups, link-conversations. |

**Returns:** print SKILL.md — `max skill install` puts it where Claude Code, Codex and Gemini CLI look…

**Example:** `max skill show daily`

### `max skill install`

escriba SKILL.md en \~/.claude/skills/max-cli/ (Claude Code) y \~/.agents/skills/max-cli/ (Codex, Gemini CLI)

**Cambia algo solo en este ordenador.**

```sh
max skill install [options]
```

| Opción | Para qué sirve |
|---|---|
| `--for <agents>` |which agents to install for. Uno de: `claude`, `agents`, `all`. Por defecto: `all`.|

**Returns:** write SKILL.md to ~/.claude/skills/max-cli/ (Claude Code) and ~/.agents/skills/max-cli/…

**Example:** `max skill install`

## `max commands`

todos los comandos por secciones, una línea cada uno; --json: el contrato, una ruta por llamada

### `max commands schema`

argv y esquemas de resultados de un comando, efectos, permisos y orientación sobre reintentos

```sh
max commands schema <path>
```

| Argumento | | Qué es |
|---|---|---|
| `path` | obligatorio |una ruta de comando, por ejemplo: stats messages show.|

**Returns:** one command's argv and result schemas, effects, permissions and retry guidance

**Example:** `max commands schema <path>`

## `max upgrade`

actualice max con el administrador de paquetes que lo instaló; --comprobar sólo miradas

**Cambia algo solo en este ordenador.**

```sh
max upgrade [options]
```

| Opción | Para qué sirve |
|---|---|
| `--check` |diga si existe una versión más nueva y no instale nada.|

**Returns:** upgrade max with the package manager that installed it; --check only looks

**Example:** `max upgrade --check`, `max upgrade`

## `max complete`

finalización del shell: `max complete zsh` imprime el script en el código fuente

```sh
max complete [words]
```

| Argumento | | Qué es |
|---|---|---|
| `words` | opcional |  |

**Returns:** shell completion: `max complete zsh` prints the script to source

**Example:** `max complete`

## `max mcp`

servir este perfil a un agente a través de MCP, en stdin y stdout - `claude mcp add max -- max <profile> mcp`

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max mcp [options]
```

| Opción | Para qué sirve |
|---|---|
| `--permission <key=level>` | hacer un permiso más estricto solo para este servidor, como messages.send=deny; nunca afloja el perfil; repetir para más claves. |
| `--http` | ofrece el servidor HTTP en 127.0.0.1 para ChatGPT y Claude en el navegador a través de tu túnel; se aplican los permisos del perfil. |
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
| `--permission <key=level>` | hacer un permiso más estricto solo para este servidor, como messages.send=deny; nunca afloja el perfil; repetir para más claves. |

**Returns:** print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes…

**Example:** `max mcp config`

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
| `--permission <key=level>` | hacer un permiso más estricto solo para este servidor, como messages.send=deny; nunca afloja el perfil; repetir para más claves. |

**Returns:** add this profile's local MCP server to Codex or Claude Code

**Example:** `max mcp setup <client>`

### `max mcp doctor`

consulte la lista de herramientas y protocolo de enlace MCP local de este perfil

```sh
max mcp doctor [options]
```

| Opción | Para qué sirve |
|---|---|
| `--permission <key=level>` | hacer un permiso más estricto solo para este servidor, como messages.send=deny; nunca afloja el perfil; repetir para más claves. |

**Returns:** check this profile's local MCP handshake and tool list

**Example:** `max mcp doctor`

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

**Returns:** check a bot token with MAX, then keep it — typed at a hidden prompt or piped on stdin

**Example:** `max bot auth set`

#### `max bot auth show`

de dónde proviene el token de bot de este perfil y qué bot es

```sh
max bot auth show
```

**Returns:** where this profile's bot token comes from, and which bot it is

**Example:** `max bot auth show`

#### `max bot auth remove`

olvidar el token de bot de este perfil

**Cambia algo solo en este ordenador.**

```sh
max bot auth remove
```

**Returns:** forget this profile's bot token

**Example:** `max bot auth remove`

### `max bot list`

cada nombre en esta máquina que tenga un token de bot; --check le pregunta a MAX qué bot es cada uno

```sh
max bot list [options]
```

| Opción | Para qué sirve |
|---|---|
| `--check` |Pregúntale al servicio de mensajería quién es cada bot, con su token.|

**Returns:** every name on this machine that has a bot token; --check asks MAX which bot each is

**Example:** `max bot list`

### `max bot chats`

los chats en los que se encuentra este bot: MAX no le da al bot una lista de ellos, por lo que `list` muestra los que ha visto

#### `max bot chats list`

chats que este robot ha visto en esta máquina; no es una lista completa de MAX

```sh
max bot chats list
```

**Returns:** chats this bot has seen on this machine — not a complete list from MAX

**Example:** `max bot chats list`

#### `max bot chats show`

un chat de MAX, y recuérdalo

```sh
max bot chats show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat, user:<id> para una persona o el título de un chat que este bot ha visto. |

**Returns:** one chat from MAX, and remember it

**Example:** `max bot chats show Team`

#### `max bot chats leave`

sacar al bot de un chat; sólo un administrador del chat puede recuperarlo

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot chats leave <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat o el título de un chat que este bot ha visto. |

**Returns:** take the bot out of a chat; only an admin of the chat can bring it back

**Example:** `max bot chats leave Team`

#### `max bot chats action`

muestra lo que el bot está haciendo en un chat (escribiendo, enviando una foto) durante unos segundos

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot chats action <chat> <action>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat, user:<id> para una persona o el título de un chat que este bot ha visto. |
| `action` | obligatorio |lo que ve el chat. Uno de: `typing`, `photo`, `video`, `voice`, `file`.|

**Returns:** show what the bot is doing in a chat — typing, sending a photo — for a few seconds

**Example:** `max bot chats action Team typing`

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

**Returns:** the chat's admins and what each may do

**Example:** `max bot chats admins list Team`

#### `max bot chats admins add`

convertir a un miembro en administrador con estos derechos

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** make a member an admin with these rights

**Example:** `max bot chats admins add Team Anna --can <rights>`

#### `max bot chats admins remove`

retirar los permisos de un administrador; ellos siguen siendo miembros

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot chats admins remove <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat o el título de un chat que este bot ha visto. |
| `person` | obligatorio | el ID de usuario de la persona. |

**Returns:** take an admin's rights back; they stay a member

**Example:** `max bot chats admins remove Team Anna`

#### `max bot chats members`

las personas en un chat en el que el bot es administrador

#### `max bot chats members remove`

sacar a una persona de un chat; sus mensajes permanecen

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** take a person out of a chat; their messages stay

**Example:** `max bot chats members remove Team Anna`

#### `max bot chats members list`

miembros de un chat, una página a la vez — --cursor toma el `page.next_cursor` que proporcionó la última página

```sh
max bot chats members list <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio |  |

| Opción | Para qué sirve |
|---|---|
| `--limit <n>` | cuántos, hasta 100. |
| `--cursor <cursor>` |continúa desde aquí.|

**Returns:** members of a chat, a page at a time — --cursor takes the `page.next_cursor` the last page…

**Example:** `max bot chats members list Team`

#### `max bot chats members add`

añadir personas a un chat por ID de usuario, 100 como máximo; el bot debe ser un administrador con permiso para añadir miembros

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot chats members add <chat> <users>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio |  |
| `users` | obligatorio |  |

**Returns:** add people to a chat by user id, at most 100; the bot must be an admin that may add…

**Example:** `max bot chats members add Team <users>`

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

**Returns:** the chat's rules; the defaults, marked not saved, if it has none yet

**Example:** `max bot chats rules show Team`

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

**Returns:** change one rule — trusted, blocked, blockedNames, links, invites, forwards,…

**Example:** `max bot chats rules set Team <key> <value>`

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

**Returns:** put one rule back to its default

**Example:** `max bot chats rules unset Team <key>`

#### `max bot chats moderate`

Juzga los nuevos mensajes de un grupo y las uniones según sus reglas, y actúa según lo permitan, como el bot.

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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
| `--no-block` |eliminar sin prohibir; De forma predeterminada, una persona eliminada no puede regresar mediante el enlace.|
| `--max-actions <n>` | como máximo este número de acciones por ejecución; 10 si no se indica. |

**Returns:** judge a group's new messages and joins by its rules, and act as they allow — as the bot

**Example:** `max bot chats moderate Team`

### `max bot messages`

los mensajes en los chats en los que se encuentra este bot

#### `max bot messages send`

enviar un mensaje como bot; sin [texto], el texto se lee desde stdin

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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
| `--allow-any-file` | enviar un archivo incluso desde carpetas de credenciales o de la propia CLI. |

**Returns:** send a message as the bot; without [text], the text is read from stdin

**Example:** `max bot messages send Team "on my way"`

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

**Returns:** the latest messages in a chat; where MAX gives a bot no history, and with --offline, the…

**Example:** `max bot messages list Team`

#### `max bot messages show`

un mensaje por su id en un chat

```sh
max bot messages show <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat, user:<id> para una persona o el título de un chat que este bot ha visto. |
| `message` | obligatorio | ID del mensaje. |

**Returns:** one message by its id in a chat

**Example:** `max bot messages show Team 1234`

#### `max bot messages edit`

reemplazar el texto de un mensaje que envió el bot

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** replace the text of a message the bot sent

**Example:** `max bot messages edit Team 1234 "on my way"`

#### `max bot messages delete`

eliminar mensajes en un chat en el que el bot puede eliminar; no se puede deshacer

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** delete messages in a chat the bot can delete in; it cannot be undone

**Example:** `max bot messages delete Team <messages>`

#### `max bot messages pin`

fijar un mensaje en un chat; silenciosamente a menos que --notifique

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** pin a message in a chat; quietly unless --notify

**Example:** `max bot messages pin Team 1234`

#### `max bot messages unpin`

desanclar un mensaje en un chat

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot messages unpin <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio | ID de chat, user:<id> para una persona o el título de un chat que este bot ha visto. |
| `message` | obligatorio | ID del mensaje. |

**Returns:** unpin a message in a chat

**Example:** `max bot messages unpin Team 1234`

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
| `--all-bots` | leer también la copia de cualquier otro bot en este ordenador que permita read_other_bots. |
| `--bots <profiles>` | leer también las copias de estos bots, separados por comas — cada uno permitido por read_other_bots. |
| `--limit <n>` |cuántos de los últimos mensajes de cada chat.|

**Returns:** what two or more people wrote in the chats they have all written in — from the local…

**Example:** `max bot messages between Anna`

### `max bot search`

encontrar por texto lo que guarda el archivo local de este bot

#### `max bot search messages`

buscar los mensajes que este robot ha leído, enviado o recibido en esta máquina: solo la copia local, la mejor coincidencia primero; una consulta Lucene: cada palabra debe aparecer; "una frase", -palabra, a OR b, from: chat: date: has:; por texto, por --from o ambos

```sh
max bot search messages [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | opcional |las palabras para encontrar.|

| Opción | Para qué sirve |
|---|---|
| `--all-bots` | leer también la copia de cualquier otro bot en este ordenador que permita read_other_bots. |
| `--bots <profiles>` | leer también las copias de estos bots, separados por comas — cada uno permitido por read_other_bots. |
| `--limit <n>` | cuántos resultados. |
| `--page <n>` | qué página, empezando por 1. |
| `--newest` | primero los más recientes en lugar de los mejores. |
| `--from <who>` |sólo lo que escribió esta persona: una identificación, @nombre de usuario o parte de un nombre; repítalo para cualquiera de varios.|

**Returns:** search the messages this bot has read, sent or received on this machine — the local copy…

**Example:** `max bot search messages "invoice"`

### `max bot recipients`

los chats en los que este bot puede escribir; sin lista, todos los chats: `clear` elimina la lista

#### `max bot recipients list`

los chats en la lista, o nada cuando no hay lista

```sh
max bot recipients list
```

**Returns:** the chats on the list, or nothing when there is no list

**Example:** `max bot recipients list`

#### `max bot recipients add`

permitir un chat: su id, `user:<id>`, o el título de un chat que este bot ha visto

**Cambia algo solo en este ordenador.**

```sh
max bot recipients add <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio |  |

**Returns:** allow a chat: its id, `user:<id>`, or the title of a chat this bot has seen

**Example:** `max bot recipients add Team`

#### `max bot recipients remove`

eliminar un chat de la lista

**Cambia algo solo en este ordenador.**

```sh
max bot recipients remove <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | obligatorio |  |

**Returns:** take a chat off the list

**Example:** `max bot recipients remove Team`

#### `max bot recipients clear`

eliminar la lista: el bot puede volver a escribir en cualquier chat

**Cambia algo solo en este ordenador.**

```sh
max bot recipients clear
```

**Returns:** remove the list: the bot may write to any chat again

**Example:** `max bot recipients clear`

### `max bot sends`

Lo que este robot envió, editó y eliminó de esta máquina: identificadores y resultados, nunca mensajes de texto.

#### `max bot sends list`

every send, edit and delete this bot made from this machine, with its outcome

```sh
max bot sends list
```

**Returns:** every send, edit and delete this bot made from this machine, with its outcome

**Example:** `max bot sends list`

### `max bot watch`

imprima mensajes nuevos a medida que lleguen y guárdelos, hasta Ctrl-C o --timeout (cualquiera de los dos finaliza normalmente)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot watch [options]
```

| Opción | Para qué sirve |
|---|---|
| `--events` |también ediciones, eliminaciones, botones presionados y personas yendo y viniendo; cada línea nombra su evento.|
| `--types <types>` |sólo estos tipos de actualización, separados por comas, en palabras del servicio de mensajería.|

**Returns:** print new messages as they arrive and keep them, until Ctrl-C or --timeout (either ends…

**Example:** `max bot watch`

### `max bot callbacks`

respuestas a los botones que la gente presiona debajo de los mensajes del bot

#### `max bot callbacks answer`

responder a un botón presionado por su ID de devolución de llamada: --la notificación muestra a la persona una nota única, --el texto reemplaza el mensaje en el que estaba el botón

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** answer a pressed button by its callback id: --notification shows the person a one-time…

**Example:** `max bot callbacks answer <callback>`

### `max bot commands`

el menú de comandos del bot: lo que la gente ve después /

#### `max bot commands list`

los comandos en el menú ahora

```sh
max bot commands list
```

**Returns:** the commands in the menu now

**Example:** `max bot commands list`

#### `max bot commands set`

reemplace todo el menú: cada comando como nombre = descripción, p. inicio=comenzar

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot commands set <commands>
```

| Argumento | | Qué es |
|---|---|---|
| `commands` | obligatorio |nombre=descripción, uno por comando.|

**Returns:** replace the whole menu: each command as name=description, e.g. start=Begin

**Example:** `max bot commands set <commands>`

#### `max bot commands clear`

vaciar el menú

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot commands clear
```

**Returns:** empty the menu

**Example:** `max bot commands clear`

### `max bot webhooks`

donde el servicio de mensajería envía las actualizaciones de este bot: mientras una está configurada, `bot watch` no recibe nada

#### `max bot webhooks list`

los webhooks que tiene este bot

```sh
max bot webhooks list
```

**Returns:** the webhooks this bot has

**Example:** `max bot webhooks list`

#### `max bot webhooks set`

enviar las actualizaciones de este bot a una dirección HTTPS; rechazado mientras se establece otro

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** send this bot's updates to an HTTPS address; refused while another is set

**Example:** `max bot webhooks set https://example.com`

#### `max bot webhooks delete`

dejar de enviar actualizaciones a esta dirección; sin nada restante, `bot watch` vuelve a funcionar

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot webhooks delete <url>
```

| Argumento | | Qué es |
|---|---|---|
| `url` | obligatorio |la dirección.|

**Returns:** stop sending updates to this address; with none left, `bot watch` works again

**Example:** `max bot webhooks delete https://example.com`

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
| `--all-bots` | leer también la copia de cualquier otro bot en este ordenador que permita read_other_bots. |
| `--bots <profiles>` | leer también las copias de estos bots, separados por comas — cada uno permitido por read_other_bots. |
| `--limit <n>` |cuantos mensajes del chat privado.|
| `--sync-first` |Primero lea el chat privado con ellos nuevamente desde el Messenger: una solicitud.|

**Returns:** one person: the chats they wrote in (with their last message there) and the latest…

**Example:** `max bot contacts show <who>`

### `max bot store`

la copia local del bot en esta máquina

#### `max bot store fetch`

buscar el historial de un chat en la copia local del bot, el más nuevo primero; ejecútelo nuevamente para continuar

**Cambia algo solo en este ordenador.**

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

**Returns:** fetch a chat's history into the bot's local copy, newest first; run it again to continue

**Example:** `max bot store fetch Team`

### `max bot mcp`

ofrecer este bot a un agente mediante MCP por entrada y salida estándar — `claude mcp add sales-bot -- max sales bot mcp`

#### `max bot mcp config`

mostrar la entrada mcpServers para Claude Desktop, Cursor y otros, con rutas completas; no escribe nada

```sh
max bot mcp config
```

**Returns:** print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes…

**Example:** `max bot mcp config`

### `max bot me`

El bot al que pertenece el token de este perfil: nombre, identificación, descripción, comandos.

```sh
max bot me
```

**Returns:** the bot this profile's token belongs to: name, id, description, commands

**Example:** `max bot me`

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

**Returns:** the comments under a post, newest last

**Example:** `max bot comments list 1234`

#### `max bot comments get`

un comentario debajo de una publicación

```sh
max bot comments get <message> <comment>
```

| Argumento | | Qué es |
|---|---|---|
| `message` | obligatorio |  |
| `comment` | obligatorio |  |

**Returns:** one comment under a post

**Example:** `max bot comments get 1234 <comment>`

#### `max bot comments send`

comentar debajo de una publicación como el bot; - lee la entrada estándar

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** comment under a post as the bot; - reads stdin

**Example:** `max bot comments send 1234 "on my way"`

#### `max bot comments edit`

reemplazar el texto de un comentario que escribió el bot; - lee la entrada estándar

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** replace the text of a comment the bot wrote; - reads stdin

**Example:** `max bot comments edit 1234 <comment> "on my way"`

#### `max bot comments delete`

eliminar un comentario debajo de una publicación

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** delete a comment under a post

**Example:** `max bot comments delete 1234 <comment>`

### `max bot uploads`

archivos subidos a MAX, para adjuntar a un mensaje

#### `max bot uploads put`

cargue un archivo desde el disco e imprimal archivo adjunto para colocar el `attachments` de un mensaje: `messages send --file` realiza ambos pasos a la vez

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot uploads put <file> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `file` | obligatorio |  |

| Opción | Para qué sirve |
|---|---|
| `--type <type>` |subirlo como este tipo en lugar de adivinar por extensión. Uno de: `image`, `video`, `audio`, `file`.|
| `--allow-any-file` | subir un archivo incluso desde carpetas de credenciales o de aplicaciones WireCat. |

**Returns:** upload a file from disk and print the attachment to put in a message's `attachments` —…

**Example:** `max bot uploads put ./report.pdf`

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

**Returns:** Get current bot info — read (GET /me)

**Example:** `max bot api get-my-info`

#### `max bot api edit-my-commands`

Editar comandos de bot actuales: escribir (PATCH /me/commands)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api edit-my-commands [options]
```

| Opción | Para qué sirve |
|---|---|
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

**Returns:** Edit current bot commands — write (PATCH /me/commands)

**Example:** `max bot api edit-my-commands`

#### `max bot api get-chat`

Obtener chat - leer (GET /chats/{chatId})

```sh
max bot api get-chat [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` |Chat solicitado o identificador de canal.|

**Returns:** Get chat — read (GET /chats/{chatId})

**Example:** `max bot api get-chat --chat-id <value>`

#### `max bot api edit-chat`

Editar información del chat o del canal: escribir (PATCH /chats/{chatId})

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api edit-chat [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat o canal. |
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

**Returns:** Edit chat or channel info — write (PATCH /chats/{chatId})

**Example:** `max bot api edit-chat --chat-id <value>`

#### `max bot api send-action`

Enviar acción – escribir (POST /chats/{chatId}/actions)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api send-action [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat. |
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

**Returns:** Send action — write (POST /chats/{chatId}/actions)

**Example:** `max bot api send-action --chat-id <value>`

#### `max bot api get-pinned-message`

Obtener mensaje fijado: leer (GET /chats/{chatId}/pin)

```sh
max bot api get-pinned-message [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` |Identificador de chat para obtener su mensaje fijado.|

**Returns:** Get pinned message — read (GET /chats/{chatId}/pin)

**Example:** `max bot api get-pinned-message --chat-id <value>`

#### `max bot api pin-message`

Fijar mensaje: escribir (PUT /chats/{chatId}/pin)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api pin-message [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` |Identificador de chat donde se debe fijar el mensaje.|
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

**Returns:** Pin message — write (PUT /chats/{chatId}/pin)

**Example:** `max bot api pin-message --chat-id <value>`

#### `max bot api unpin-message`

Desanclar mensaje: escribir (BORRAR /chats/{chatId}/pin)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api unpin-message [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` |Identificador de chat para eliminar mensajes fijados.|

**Returns:** Unpin message — write (DELETE /chats/{chatId}/pin)

**Example:** `max bot api unpin-message --chat-id <value>`

#### `max bot api get-membership`

Obtenga membresía de chat o canal: lea (GET /chats/{chatId}/members/me)

```sh
max bot api get-membership [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat o canal. |

**Returns:** Get chat or channel membership — read (GET /chats/{chatId}/members/me)

**Example:** `max bot api get-membership --chat-id <value>`

#### `max bot api leave-chat`

Abandonar el chat: destructivo (BORRAR /chats/{chatId}/members/me)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api leave-chat [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat o canal. |

**Returns:** Leave chat — destructive (DELETE /chats/{chatId}/members/me)

**Example:** `max bot api leave-chat --chat-id <value>`

#### `max bot api get-admins`

Obtenga administradores de chat o canal: lea (GET /chats/{chatId}/members/admins)

```sh
max bot api get-admins [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat o canal. |

**Returns:** Get chat or channel admins — read (GET /chats/{chatId}/members/admins)

**Example:** `max bot api get-admins --chat-id <value>`

#### `max bot api post-admins`

Establecer administradores de chat o canal: escriba (POST /chats/{chatId}/members/admins)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api post-admins [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat o canal. |
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

**Returns:** Set chat or channel admins — write (POST /chats/{chatId}/members/admins)

**Example:** `max bot api post-admins --chat-id <value>`

#### `max bot api delete-admins`

Revocar derechos de administrador: escriba (BORRAR /chats/{chatId}/members/admins/{userId})

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api delete-admins [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat o canal. |
| `--user-id <value>` | User identifier. |

**Returns:** Revoke admin rights — write (DELETE /chats/{chatId}/members/admins/{userId})

**Example:** `max bot api delete-admins --chat-id <value> --user-id <value>`

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

**Returns:** Get members — read (GET /chats/{chatId}/members)

**Example:** `max bot api get-members --chat-id <value>`

#### `max bot api add-members`

Agregar miembros: escriba (POST /chats/{chatId}/members)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api add-members [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat. |
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

**Returns:** Add members — write (POST /chats/{chatId}/members)

**Example:** `max bot api add-members --chat-id <value>`

#### `max bot api remove-member`

Eliminar miembro: escriba (BORRAR /chats/{chatId}/members)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api remove-member [options]
```

| Opción | Para qué sirve |
|---|---|
| `--chat-id <value>` | ID del chat o canal. |
| `--user-id <value>` |ID de usuario para eliminar del chat o canal.|
| `--block <value>` |Establezca en `true` si el usuario debe ser bloqueado en el chat.|

**Returns:** Remove member — write (DELETE /chats/{chatId}/members)

**Example:** `max bot api remove-member --chat-id <value> --user-id <value>`

#### `max bot api get-subscriptions`

Obtener suscripciones: leer (OBTENER /suscripciones)

```sh
max bot api get-subscriptions
```

**Returns:** Get subscriptions — read (GET /subscriptions)

**Example:** `max bot api get-subscriptions`

#### `max bot api subscribe`

Suscribirse — escritura (POST /subscriptions)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api subscribe [options]
```

| Opción | Para qué sirve |
|---|---|
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

**Returns:** Subscribe — write (POST /subscriptions)

**Example:** `max bot api subscribe`

#### `max bot api unsubscribe`

Cancelar suscripción — escritura (DELETE /subscriptions)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api unsubscribe [options]
```

| Opción | Para qué sirve |
|---|---|
| `--url <value>` |URL para eliminar de las suscripciones a WebHook.|

**Returns:** Unsubscribe — write (DELETE /subscriptions)

**Example:** `max bot api unsubscribe --url <value>`

#### `max bot api get-upload-url`

Obtener URL de carga: escribir (POST /uploads)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api get-upload-url [options]
```

| Opción | Para qué sirve |
|---|---|
| `--type <value>` |Tipo de archivo subido: image, audio, video, file.|

**Returns:** Get upload URL — write (POST /uploads)

**Example:** `max bot api get-upload-url --type <value>`

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

**Returns:** Get messages — read (GET /messages)

**Example:** `max bot api get-messages`

#### `max bot api send-message`

Enviar mensaje - escribir (POST /mensajes)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

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

**Returns:** Send message — write (POST /messages)

**Example:** `max bot api send-message`

#### `max bot api edit-message`

Editar mensaje - escribir (PUT /mensajes)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api edit-message [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` |Editar identificador de mensaje.|
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

**Returns:** Edit message — write (PUT /messages)

**Example:** `max bot api edit-message --message-id <value>`

#### `max bot api delete-message`

Eliminar mensaje: destructivo (BORRAR /mensajes)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api delete-message [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` |Eliminando identificador de mensaje.|
| `--allow-dangerous` |omitir la confirmación de bot.messages.delete en el nivel ask.|

**Returns:** Delete message — destructive (DELETE /messages)

**Example:** `max bot api delete-message --message-id <value>`

#### `max bot api get-message-by-id`

Obtener mensaje: leer (GET /messages/{messageId})

```sh
max bot api get-message-by-id [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` |Identificador de mensaje (`mid`) para recibir un solo mensaje en el chat o canal.|

**Returns:** Get message — read (GET /messages/{messageId})

**Example:** `max bot api get-message-by-id --message-id <value>`

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

**Returns:** Get comments — read (GET /messages/{messageId}/comments)

**Example:** `max bot api get-comments --message-id <value>`

#### `max bot api send-comment`

Enviar comentario - escribir (POST /messages/{messageId}/comments)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api send-comment [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` | ID (`mid`) del mensaje comentado. |
| `--disable-link-preview <value>` |Si es `false`, el servidor no generará una vista previa de medios para enlaces en texto.|
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

**Returns:** Send comment — write (POST /messages/{messageId}/comments)

**Example:** `max bot api send-comment --message-id <value>`

#### `max bot api edit-comment`

Editar comentario: escribir (PUT /messages/{messageId}/comments)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api edit-comment [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` | ID (`mid`) del mensaje comentado. |
| `--comment-id <value>` | Editing comment identifier. |
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

**Returns:** Edit comment — write (PUT /messages/{messageId}/comments)

**Example:** `max bot api edit-comment --message-id <value> --comment-id <value>`

#### `max bot api delete-comment`

Eliminar comentario: destructivo (BORRAR /messages/{messageId}/comments)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api delete-comment [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` | ID (`mid`) del mensaje comentado. |
| `--comment-id <value>` | Deleting comment identifier. |
| `--allow-dangerous` |omitir la confirmación de bot.messages.delete en el nivel ask.|

**Returns:** Delete comment — destructive (DELETE /messages/{messageId}/comments)

**Example:** `max bot api delete-comment --message-id <value> --comment-id <value>`

#### `max bot api get-comment-by-id`

Obtener comentario: leer (GET /messages/{messageId}/comments/{commentId})

```sh
max bot api get-comment-by-id [options]
```

| Opción | Para qué sirve |
|---|---|
| `--message-id <value>` | ID (`mid`) del mensaje comentado. |
| `--comment-id <value>` |Identificador de comentario (`mid`) para obtener un comentario único en el canal.|

**Returns:** Get comment — read (GET /messages/{messageId}/comments/{commentId})

**Example:** `max bot api get-comment-by-id --message-id <value> --comment-id <value>`

#### `max bot api get-video-attachment-details`

Obtenga detalles del video: lea (GET /videos/{videoToken})

```sh
max bot api get-video-attachment-details [options]
```

| Opción | Para qué sirve |
|---|---|
| `--video-token <value>` | Video attachment token. |

**Returns:** Get video details — read (GET /videos/{videoToken})

**Example:** `max bot api get-video-attachment-details --video-token <value>`

#### `max bot api answer-on-callback`

Responder a un callback — escritura (POST /answers)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api answer-on-callback [options]
```

| Opción | Para qué sirve |
|---|---|
| `--callback-id <value>` |Identifica un botón en el que hizo clic el usuario. El bot recibe este identificador después de que el usuario presiona el botón como parte de `MessageCallbackUpdate`.|
| `--disable-link-preview <value>` |Si es `true`, el servidor no generará una vista previa de medios para los enlaces en el texto del mensaje actualizado.|
| `--body <json>` | el cuerpo de la solicitud en JSON; - lo lee de stdin. |
| `--body-file <path>` | el cuerpo de la solicitud desde un archivo JSON; - es stdin. |

**Returns:** Answer on callback — write (POST /answers)

**Example:** `max bot api answer-on-callback --callback-id <value>`

#### `max bot api get-updates`

Obtener actualizaciones — escritura (GET /updates)

**Cambia algo fuera de este ordenador: en MAX o en un servicio externo.**

```sh
max bot api get-updates [options]
```

| Opción | Para qué sirve |
|---|---|
| `--limit <value>` |Número máximo de actualizaciones que se recuperarán.|
| `--poll-timeout <value>` |Tiempo de espera en segundos para long polling.|
| `--marker <value>` |Pase `null` para obtener actualizaciones que aún no recibió.|
| `--types <value>` |Lista separada por comas de los tipos de actualizaciones que su bot desea recibir.|

**Returns:** Get updates — write (GET /updates)

**Example:** `max bot api get-updates`

## `max guide`

scenarios: the commands for a common task, in order, and why each

```sh
max guide [name]
```

| Argumento | | Qué es |
|---|---|---|
| `name` | opcional | one scenario; without it, the list. |

**Returns:** scenarios: the commands for a common task, in order, and why each

**Example:** `max guide`, `max guide <name> --json`

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
`--operation-id`.
