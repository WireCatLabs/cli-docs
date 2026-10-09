---
title: "Bots de Telegram"
---

`tg bot` utiliza un bot con la [Bot API oficial de Telegram](https://core.telegram.org/bots/api) y su token. Es independiente de tu cuenta: el bot tiene nombre, chats y token propios. `tg …` sin `bot` sigue actuando como tú ([uso](./usage.md)).

Crea el bot con [@BotFather](https://t.me/BotFather) en Telegram para obtener el token.

Consulta todos los comandos y opciones en la [referencia](./commands.md).

**La CLI ofrece toda la API de bots de Telegram:** los 185 métodos de la versión fijada del esquema
Bot API 10.3, incluidas operaciones sin un comando específico de uso frecuente.
Usa `tg <bot> bot api <method>` con opciones para los campos de la API o cuerpos JSON; consulta
[la guía de la API completa](#the-complete-bot-api). MCP ofrece herramientas separadas para las tareas habituales.

## Primer minuto

```sh
tg sales bot auth set     # the token, at a hidden prompt
tg sales bot auth show    # which bot it is
```

`auth set` comprueba a qué bot pertenece el token antes de guardarlo: una errata no sustituye un token válido.

## Obtener el identificador de un chat

Telegram no proporciona a los bots una lista de chats; sus identificadores se obtienen de lo que el bot hace o recibe.

- **Una persona:** escribe a `user:<id>`. El resultado del envío incluye el chat de destino como `chatId` en `--json`. La persona debe haber iniciado el bot: los bots no pueden [iniciar conversaciones](https://core.telegram.org/bots#how-are-bots-different-from-users) con alguien que nunca les escribió.
- **Un grupo o canal:** añade el bot, escribe algo y observa lo que recibe:

  ```sh
  tg sales bot watch --events --jsonl --timeout 1m
  ```

  Cada línea incluye el identificador en `chatId`. Un bot no administrador solo recibe comandos y respuestas a él, salvo que desactives su [modo de privacidad](https://core.telegram.org/bots/features#privacy-mode) en @BotFather.

Después de `tg sales bot chats show <id>`, conoce el título del chat y los comandos siguientes también lo aceptan. `chats list` muestra todos los chats vistos.

- El identificador de grupo o canal es **negativo**.
- Un identificador positivo corresponde a una persona.

## Varios bots

Cada bot se guarda con el nombre que elijas. Ese nombre es la **primera palabra**, como un perfil de cuenta personal:

```sh
tg sales bot auth set
tg support bot auth set
tg bot list --check       # every name with a bot token, and which bot each is
```

Sin nombre explícito se utiliza `defaultProfile` o, si falta, `default`. `TG_PROFILE` lo selecciona para la terminal.

## El token

El token se guarda en el almacén de claves como `bot:<name>`, separado de tu sesión. Sin almacén, se guarda en un archivo legible solo por ti.

```sh
tg sales bot auth show    # where the token comes from, and which bot it is
tg sales bot me           # the bot's id, name and username
tg sales bot auth remove  # forget it
```

`TG_BOT_TOKEN` tiene prioridad si está definido; así se usa en CI. `auth set` no guarda el token de esa variable.

Telegram incluye el token en cada dirección de petición. `tg` nunca imprime esa dirección en errores, con `--trace` ni en registros.

## Chats

Telegram no ofrece una lista de chats al bot; `chats list` muestra **los vistos en este equipo**. No es una lista completa.

```sh
tg sales bot chats list
```

## Mensajes

Indica el chat por identificador, `user:<id>` para personas o título de un chat visto. Los mensajes siempre se indican junto con el chat: Telegram los numera dentro de cada uno.

```sh
tg sales bot messages send "Team" "Build is ready"
tg sales bot messages send user:4815162342 "Hello"
tg sales bot messages send "Team" "**Weekly** report" --md       # or --html
tg sales bot messages send "Team" "Got it" --reply-to 511
echo "From a pipe" | tg sales bot messages send "Team"
tg sales bot messages edit "Team" 512 "Fixed text"
tg sales bot messages delete "Team" 512 513 --allow-dangerous
tg sales bot messages pin "Team" 512 --notify
tg sales bot messages unpin "Team" 512
```

`--silent` envía sin notificación. El límite es 4096 caracteres ([`sendMessage`](https://core.telegram.org/bots/api#sendmessage)). `--md` y `--html` son incompatibles. Eliminar pregunta primero; `--allow-dangerous` aprueba. Fijar no avisa salvo con `--notify`. El envío devuelve el mensaje y su `operationId`, correspondiente al registro del bot. Telegram solo elimina mensajes con menos de 48 horas.

### Archivos

`--file` adjunta desde disco. Fotos, vídeos y sonidos se reconocen por extensión; el resto se envía como archivo. `--photo` envía como foto, `--voice` como nota de voz Ogg Opus y `--as-file` conserva un vídeo como archivo. El texto es la leyenda y puede omitirse:

```sh
tg sales bot messages send "Team" "Weekly report" --file report.pdf
tg sales bot messages send "Team" --photo screenshot.png
```

Los archivos de carpetas ocultas o propias de `tg` se rechazan salvo con `--allow-any-file`. El bot envía un archivo por mensaje: fotos hasta 10 MB y otros archivos hasta 50 MB ([límites de archivos](https://core.telegram.org/bots/api#sending-files)).

Si se interrumpe la conexión durante un envío, `tg` no reintenta: indica resultado desconocido (código 14). Comprueba el chat antes de repetir.

**La Bot API de Telegram no tiene una llamada para consultar historial.** `messages list` y `messages show` responden desde lo enviado, recibido por `bot watch` e importado con `bot store fetch` en este equipo, y lo indican:

```sh
tg sales bot messages list "Team"
tg sales bot messages show "Team" 512
```

## Descargar mensajes anteriores

`bot store fetch` descarga mensajes anteriores de un canal o supergrupo al archivo local del bot. Inicia una sesión separada en la API MTProto de Telegram con el token existente. Consulta los números de mensaje con [channels.getMessages](https://core.telegram.org/method/channels.getMessages). Los envíos y `bot watch` siguen usando la Bot API; la sesión de historial no recibe actualizaciones. El comando no envía nada ni marca mensajes como leídos.

Estos ejemplos usan un identificador de chat y un enlace ficticios:

```sh
tg sales bot store fetch -1001234567890 --from https://t.me/c/1234567890/512 --limit 20 --json
tg sales bot store fetch -1001234567890 --last 200 --pause 1s
```

`--from` empieza en ese mensaje, incluido, y debe referirse al mismo chat. Sin él, usa el mensaje más reciente que el bot tenga guardado. Si no tiene ninguno, consulta el más reciente de la sesión personal `default` existente. Si ninguna conoce un número, solicita `--from`. Usa las credenciales de aplicación Telegram del perfil del bot (`api_id` y `api_hash`) o las del perfil `default` existente; también acepta `TG_API_ID` y `TG_API_HASH`. No inicia una sesión personal.

- `--limit` limita los mensajes descargados en esta ejecución (1000 por defecto).
- `--page-size` limita los números de mensaje consultados por página, hasta 100.
- `--pause` espera entre peticiones (1 segundo por defecto), también en tramos vacíos.
- `--last` se detiene cuando tiene guardada la cantidad solicitada de mensajes más recientes.
- `--since-time` se detiene al llegar a mensajes anteriores al intervalo indicado; acepta ISO 8601 o `2h` / `1d`. Usa `--last` o `--since-time`, no ambos.

Vuelve a ejecutarlo para seguir hacia atrás. El JSON informa de `chat`, `fetched`, `complete` y `ranges`. Los mensajes importados quedan disponibles para `bot messages list --offline`, búsquedas y contactos. La sesión del bot se guarda por separado bajo su directorio de estado, por perfil e identificador del bot; se cierra al terminar.

**Límites:** no admite chats privados ni grupos básicos, porque sus números de mensaje comparten una secuencia entre todos los chats del bot. El bot necesita acceso al canal o supergrupo. Los mensajes eliminados y los números de servicio dejan huecos; la lectura los recorre hasta llegar al número 1. Los huecos grandes pueden exigir muchas peticiones incluso con un `--limit` pequeño. Se aplican los límites de Telegram: respeta esperas cortas y termina ante una espera larga para continuar más tarde.

## Consultar y gestionar un chat

```sh
tg sales bot chats show -1001234567890    # from Telegram; the bot remembers its title
tg sales bot chats action "Team" typing   # typing, photo, video, voice, file — a few seconds
tg sales bot chats leave "Team"           # only an admin can bring the bot back
```

## Administradores y miembros

El bot debe ser administrador con permisos para añadir administradores o eliminar miembros. Las personas se indican por identificador de usuario.

```sh
tg sales bot chats admins list "Team"                                  # who runs it, and what each may do
tg sales bot chats admins add "Team" 4815162342 --can pin,delete --title Mod
tg sales bot chats admins remove "Team" 4815162342                     # they stay in the chat
tg sales bot chats members remove "Team" 4815162342                    # they may come back by the link
tg sales bot chats members remove "Team" 4815162342 --block            # they may not
```

`--can` acepta members, admins, info, pin, link, post, edit y delete. Telegram no tiene permiso de lectura: los administradores siempre leen. Solo se asciende en supergrupos y canales; el título solo funciona en supergrupos. La Bot API no permite enumerar miembros ni añadir personas.

## A quién puede escribir

Cada bot tiene su lista de destinatarios. Sin lista puede escribir a cualquier chat.

```sh
tg sales bot recipients add -1001234567890    # a chat id
tg sales bot recipients add user:4815162342   # a person
tg sales bot recipients list
tg sales bot recipients remove -1001234567890
tg sales bot recipients clear                 # any chat again
```

Cada escritura se registra con chat, tipo de acción y resultado, nunca texto:

```sh
tg sales bot sends list
```

## Recibir actividad del bot

```sh
tg sales bot watch                       # new messages, until Ctrl-C or --timeout
tg sales bot watch --events --jsonl      # and the rest: edits, buttons pressed, people joining and leaving
tg sales bot watch --types message,callback_query
```

`watch` guarda antes de imprimir: mensajes en el historial local y botones para `callbacks answer`. La siguiente ejecución continúa después de la última actualización guardada. Telegram conserva actualizaciones durante 24 horas; revisarlas con menor frecuencia puede perder datos. Con `--events` se indica tipo: `message`, `edit`, `callback`, `joined`, `left`, `added`, `removed`, `other`. Telegram solo comunica entradas y salidas si el bot es administrador. `--types` usa los nombres de actualización de Telegram.

## Botones, menú y webhooks

```sh
tg sales bot callbacks answer <callback> --notification "Done"   # a note only the person who pressed sees
tg sales bot callbacks answer <callback> --text "Confirmed"      # replaces the message the button was on
tg sales bot commands set start=Begin "report=Today's report"    # the menu people see after /
tg sales bot commands list
tg sales bot commands clear
tg sales bot webhooks set https://bot.example.com/telegram --secret-stdin
tg sales bot webhooks list
tg sales bot webhooks delete https://bot.example.com/telegram
```

`--text` sustituye el mensaje de un botón cuya pulsación vio `bot watch`. Cada comando de Telegram requiere descripción. Solo se permite un webhook; mientras esté activo, `bot watch` no recibe nada. `webhooks set` rechaza otra dirección hasta eliminar la anterior.

Los ajustes del bot están en la sección `bot` del archivo: `tg sales config set --bot sendsPerHour 200` ([configuración](./configuration.md)).

## Consultar lo guardado por el bot

Todo lo recibido por `tg sales bot watch` se guarda en este equipo. Estos comandos lo consultan sin pedir datos a Telegram:

```sh
tg sales bot contacts show @ann              # where Ann wrote, and her private chat with the bot
tg sales bot search messages "price list"    # best match first; --newest for newest first
tg sales bot search messages --from @ann     # what one person wrote
tg sales bot messages between @ann Bob       # what both wrote, in the chats both wrote in
```

`--all-bots` y `--bots <names>` incluyen copias de otros bots cuando `readOtherBots` lo permite. La Bot API no permite consultar historial, por lo que `contacts show --refresh` se rechaza; importa primero mensajes anteriores con `bot store fetch`.

## Moderar mediante reglas

Un bot administrador puede revisar mensajes nuevos según reglas, como `tg chats moderate` en tu cuenta:

```sh
tg sales bot chats rules set -1001234567890 invites delete   # invite links to other chats: delete
tg sales bot chats moderate -1001234567890 --dry-run         # what breaks the rules, without acting
tg sales bot chats moderate -1001234567890                   # act as the rules allow
```

Solo revisa lo guardado por `tg sales bot watch` o importado con `bot store fetch` en este equipo. No evalúa entradas de miembros. Las personas eliminadas no pueden regresar por enlace salvo con `--no-ban`. Las reglas se guardan en el mismo archivo que las de tu perfil personal del mismo nombre.

## Para scripts y agentes

Con `--json`, stdout solo contiene datos; los errores van por stderr con código de salida:

| Código | Qué ocurrió |
|---|---|
| `4` | falta token o Telegram lo rechazó |
| `5` | los permisos del perfil impiden la acción |
| `6` | chat no encontrado, por ejemplo un título aún no visto |
| `7` | chat fuera de destinatarios permitidos o confirmación `ask` sin respuesta |
| `8` | se alcanzó `sendsPerHour` |
| `14` | sin respuesta; no se sabe si Telegram hizo el cambio |

Todos los códigos están en la [referencia](./commands.md). Los mensajes usan la misma estructura que los de tu cuenta.

`--trace` y `--record` también funcionan: cada petición Bot API aparece por stderr, nunca su dirección porque contiene el token. Los fallos se guardan en `tg runs list` ([diagnóstico](./diagnostics.md)).

## Conectar el bot al agente mediante MCP

`tg <name> bot mcp` ofrece el bot al agente, como `tg mcp` con tu cuenta:

```sh
claude mcp add sales-bot -- tg sales bot mcp
tg sales bot mcp config          # the entry for Claude Desktop, Cursor and others
```

El agente obtiene lo que permiten los permisos del perfil del bot en `bot.`: los chats que el bot ha visto,
mensajes, administradores, el menú de comandos, el registro y la lista de destinatarios y, salvo que el perfil sea de
solo lectura, escritura como el bot: enviar, editar, fijar, «escribiendo», responder a botones, borrar y eliminar miembros.
`permissions.bot: readonly` bloquea las escrituras salvo que una regla más específica permita una. Para borrar,
`ask` y `allow` permiten una escritura MCP solicitada sin un formulario del servidor; `deny` y `readonly`
la bloquean. Las opciones antiguas de confirmación no tienen efecto. El consentimiento independiente para las reglas de moderación sigue
aplicándose: las acciones que lo requieren devuelven un plan para que el propietario lo apruebe mediante la CLI.
`tg_bot_read` (`command: "status"`) indica en nombre de qué perfil
actúa el servidor y qué herramientas de escritura están activadas.

Cada escritura ejecuta el mismo comando que usarías tú: se aplican destinatarios y registro del bot. Cambiar token, webhooks, menú y destinatarios sigue correspondiéndote a ti.

El `--md` del bot usa las mismas [reglas de formato de Telegram](./usage.md#sending) que los envíos personales. Las ediciones de texto y los pies de fotos y archivos usan el mismo formato.

## La API de bots completa

`tg <bot> bot api <method>` ofrece todos los métodos de la versión fijada del esquema Telegram Bot API.
Los nombres de métodos y campos usan guiones: `get-me`, `get-chat --chat-id <id>`.
`tg bot api --help` enumera los métodos; la ayuda de cada método enumera sus campos. Los resultados
mantienen la estructura original de Telegram; los enteros fuera del rango seguro de JavaScript son cadenas.

Pasa los campos como opciones separadas o como JSON con `--body <json>`, `--body -` (stdin)
o `--body-file <path>`. `--body-file -` también lee stdin. Un campo no puede aparecer a la vez
como opción y en el cuerpo JSON. El parámetro nativo `timeout` se pasa mediante `--poll-timeout`;
el parámetro global `--timeout` limita la duración de todo el comando.

Solo los campos de archivo declarados en el esquema interpretan `@path` como una carga local,
incluidos los campos anidados de un array JSON `media`. El carácter `@` en texto normal se conserva.
Los campos secretos, como `secret_token` y `provider_token`, se pasan por stdin o mediante un archivo
JSON legible solo por su propietario; no tienen opciones de línea de comandos separadas.

Las operaciones usan `permissions.bot.api.<method>`, la lista de destinatarios del bot y su registro de envíos.
Las acciones destructivas piden confirmación por defecto. `get-updates` también la pide: su desplazamiento
puede confirmar la recepción de actualizaciones u omitirlas. Una escritura sin respuesta nunca se reintenta
automáticamente. Esta interfaz necesita conexión al servicio y rechaza `--offline`.

`get-managed-bot-token` y `replace-managed-bot-token` requieren `--store-token <profile>`.
El token recibido se guarda solo en el almacén de claves del sistema y nunca se muestra.
El perfil de destino debe pertenecer al bot solicitado; su identidad se comprueba antes de renovar el token remoto.
Tras guardarlo, stdout contiene solo el perfil, el identificador del bot y `stored: "keyring"`.
Si el almacén de claves no está disponible, la operación se rechaza sin guardar el token en un archivo.
