---
title: "Bots de Telegram"
---

<a id="descargar-mensajes-anteriores" />
<a id="consultar-y-gestionar-un-chat" />
<a id="botones-menú-y-webhooks" />
<a id="para-scripts-y-agentes" />

Utilice esta página cuando tenga un bot de Telegram, o quiera uno, y lo necesite para publicar mensajes, responder personas, mirar un grupo o mantener el orden allí. Aprenderá cómo conectar un bot a `tg`, encontrar sus chats, enviar y leer mensajes como el bot, limitar dónde puede escribir y entregar el bot a su agente de IA.

Algunas palabras en esta página:

- **Un bot** es una cuenta de Telegram independiente que ejecuta un programa. `tg bot` funciona con él a través de la [API oficial de bots de Telegram](https://core.telegram.org/bots/api). No tiene nada que ver con tu propia cuenta: el bot tiene su propio nombre, sus propios chats y su propio token, y `tg …` sin la palabra `bot` sigues siendo tú (ver [usar tu propia cuenta](./usage.md)).
- **Un token** es la contraseña del bot. Creas un bot con [@BotFather](https://t.me/BotFather) en Telegram y te da el token.
- **El nombre de un bot** es la palabra que eliges para guardar el token de un bot, como `sales`. Es la primera palabra de cada comando de bot: `tg sales bot …`.
- **La copia local** es lo que el bot envió, recibió o importó y guardó en esta computadora. Telegram no le da al bot ningún historial de mensajes, por lo que para leer mensajes antiguos se utiliza esta copia.

## Qué puedes hacer

| Tarea | Comando |
| --- | --- |
| Conecta un bot y comprueba qué bot es | `tg <bot> bot auth set`, `tg <bot> bot me` |
| Enviar, editar, eliminar y anclar mensajes y archivos | `tg <bot> bot messages send\|edit\|delete\|pin` |
| Ver nuevos mensajes, presionar botones y unirse | `tg <bot> bot watch` |
| Lea y busque lo que vio el bot | `tg <bot> bot messages list`, `tg <bot> bot search messages` |
| Importar mensajes antiguos de un canal o supergrupo | `tg <bot> bot store fetch` |
| Administrar administradores y eliminar miembros | `tg <bot> bot chats admins`, `tg <bot> bot chats members remove` |
| Mantenga un grupo en orden según sus reglas | `tg <bot> bot chats moderate` |
| Botones de respuesta, configurar el menú de comandos y webhooks | `tg <bot> bot callbacks`, `commands`, `webhooks` |
| Limitar los chats en los que el bot puede escribir | `tg <bot> bot recipients` |
| Llame a cualquier método de API de Bot | `tg <bot> bot api <method>` |
| Dale el bot a tu agente de IA | `tg <bot> bot mcp` |

Cada comando y opción se encuentra en la [referencia de comando](./commands.md).

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

El token se guarda en el llavero como `bot:<name>`, separado de tu sesión. Sin almacén, se guarda en un archivo legible solo por ti.

```sh
tg sales bot auth show    # where the token comes from, and which bot it is
tg sales bot me           # the bot's id, name and username
tg sales bot auth remove  # forget it
```

`TG_BOT_TOKEN` tiene prioridad si está definido; así se usa en CI. `auth set` no guarda el token de esa variable.

Telegram incluye el token en cada dirección de petición. `tg` nunca imprime esa dirección en errores, con `--trace` ni en registros.

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

Si se interrumpe la conexión durante un envío, `tg` no reintenta: indica resultado desconocido (código 14). Comprueba el chat antes de repetir.

### Archivos

`--file` adjunta un archivo desde el disco y lo envía como archivo para descargar, sea cual sea su tipo. `--photo` envía una imagen `.jpg`, `.png` o `.webp` como foto, y `--voice` un archivo Ogg Opus como mensaje de voz, solo, sin texto. El texto se convierte en el título y puede omitirse:

```sh
tg sales bot messages send "Team" "Weekly report" --file report.pdf
tg sales bot messages send "Team" --photo screenshot.png
```

Los archivos de carpetas ocultas o propias de `tg` se rechazan salvo con `--allow-any-file`. El bot envía un archivo por mensaje: fotos hasta 10 MB y otros archivos hasta 50 MB ([límites de archivos](https://core.telegram.org/bots/api#sending-files)).

## Chats

Telegram no ofrece una lista de chats al bot; `chats list` muestra **los vistos en este equipo**. No es una lista completa.

```sh
tg sales bot chats list
tg sales bot chats show -1001234567890    # from Telegram; the bot remembers its title
tg sales bot chats action "Team" typing   # typing, photo, video, voice, file — a few seconds
tg sales bot chats leave "Team"           # only an admin can bring the bot back
```

<a id="a-chat"></a>

### Administradores y miembros

El bot debe ser administrador con permisos para añadir administradores o eliminar miembros. Las personas se indican por identificador de usuario.

```sh
tg sales bot chats admins list "Team"                                  # who runs it, and what each may do
tg sales bot chats admins add "Team" 4815162342 --can pin,delete --title Mod
tg sales bot chats admins remove "Team" 4815162342                     # they stay in the chat
tg sales bot chats members remove "Team" 4815162342                    # they may come back by the link
tg sales bot chats members remove "Team" 4815162342 --block            # they may not
```

`--can` acepta members, admins, info, pin, link, post, edit y delete. Telegram no tiene permiso de lectura: los administradores siempre leen. Solo se asciende en supergrupos y canales; el título solo funciona en supergrupos. La Bot API no permite enumerar miembros ni añadir personas.

## Consultar lo guardado por el bot

Todo lo que vio `tg sales bot watch` se guarda en esta computadora y estos comandos lo leen sin preguntar a Telegram. Una persona es un id, un `@username` o parte de un nombre.

```sh
tg sales bot messages list "Team"
tg sales bot messages show "Team" 512
tg sales bot contacts show @ann              # where Ann wrote, and her private chat with the bot
tg sales bot search messages "price list"    # best match first; --newest for newest first
tg sales bot search messages --from @ann     # what one person wrote
tg sales bot messages between @ann Bob       # what both wrote, in the chats both wrote in
```

**La Bot API de Telegram no ofrece historial de mensajes.** `messages list` y `messages show` responden a partir de lo que envió el bot, lo que recibió `bot watch` y lo que importó `bot store fetch` en esta computadora, y lo dicen. La búsqueda necesita cada palabra; `"a phrase"`, `-word`, `a OR b` y los filtros `from:`, `chat:`, `after:`, `before:` y `has:` funcionan y se corrige un error tipográfico. `contacts show --refresh` es rechazado: importe primero los mensajes más antiguos con `bot store fetch`.

`--all-bots` y `--bots <names>` también leen las copias de otros bots, cuando el `readOtherBots` del perfil lo permite.

### Recuperando mensajes antiguos

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

## Recibir actividad del bot

```sh
tg sales bot watch                       # new messages, until Ctrl-C or --timeout
tg sales bot watch --events --jsonl      # and the rest: edits, buttons pressed, people joining and leaving
tg sales bot watch --types message,callback_query
```

`watch` guarda antes de imprimir: mensajes en el historial local y botones para `callbacks answer`. La siguiente ejecución continúa después de la última actualización guardada. Telegram conserva actualizaciones durante 24 horas; revisarlas con menor frecuencia puede perder datos. Con `--events` se indica tipo: `message`, `edit`, `callback`, `joined`, `left`, `added`, `removed`, `other`. Telegram solo comunica entradas y salidas si el bot es administrador. `--types` usa los nombres de actualización de Telegram.

## Moderar mediante reglas

Un bot que sea administrador de un grupo puede juzgar las novedades del grupo según las reglas del grupo, como lo hace `tg chats moderate` con su cuenta (consulte [reglas para los grupos que ejecuta](./groups.md#rules)):

```sh
tg sales bot chats rules set -1001234567890 invites delete   # invite links to other chats: delete
tg sales bot chats moderate -1001234567890 --dry-run         # what breaks the rules, without acting
tg sales bot chats moderate -1001234567890                   # act as the rules allow
```

Solo revisa lo guardado por `tg sales bot watch` o importado con `bot store fetch` en este equipo. No evalúa entradas de miembros. Las personas eliminadas no pueden regresar por enlace salvo con `--no-ban`. Las reglas se guardan en el mismo archivo que las de tu perfil personal del mismo nombre.

<a id="buttons-the-menu-webhooks"></a>

## Botones

Cuando una persona presiona un botón debajo del mensaje del bot, el bot obtiene una identificación de devolución de llamada y responde:

```sh
tg sales bot callbacks answer <callback> --notification "Done"   # a note only the person who pressed sees
tg sales bot callbacks answer <callback> --text "Confirmed"      # replaces the message the button was on
```

`--text` reemplaza el mensaje de un botón `bot watch` que vio presionado.

## El menú de comandos

El menú es lo que la gente ve después de escribir `/` en un chat con el bot.

```sh
tg sales bot commands set start=Begin "report=Today's report"
tg sales bot commands list
tg sales bot commands clear
```

Un comando de Telegram necesita una descripción.

## Webhooks

Un webhook es una dirección donde Telegram envía todo lo que recibe el bot.

```sh
tg sales bot webhooks set https://bot.example.com/telegram --secret-stdin
tg sales bot webhooks list
tg sales bot webhooks delete https://bot.example.com/telegram
```

Un bot tiene un webhook; mientras está configurada, `bot watch` no obtiene nada y `webhooks set` rechaza una segunda dirección hasta que se elimine la primera.

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

La configuración de un bot, como un límite de envío por hora, se encuentra en la sección `bot` del archivo de configuración: `tg sales config set --bot sendsPerHour 200` (consulte [configuración](./configuration.md)).

## La API de bots completa

`tg <bot> bot api <method>` expone todos los métodos en el esquema de API de Telegram Bot anclado: los 185, incluidas las operaciones más allá de los convenientes comandos del bot anteriores. Los nombres de métodos y campos utilizan el caso kebab: `get-me`, `get-chat --chat-id <id>`. `tg bot api --help` enumera los métodos; La ayuda de cada método enumera sus campos. Los resultados conservan la estructura nativa de Telegram; Los números enteros fuera del rango seguro de JavaScript son cadenas.

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
El token recibido se guarda solo en el llavero del sistema y nunca se muestra.
El perfil de destino debe pertenecer al bot solicitado; su identidad se comprueba antes de renovar el token remoto.
Tras guardarlo, stdout contiene solo el perfil, el identificador del bot y `stored: "keyring"`.
Si el llavero no está disponible, la operación se rechaza sin guardar el token en un archivo.

<a id="for-scripts-and-agents"></a>

## Cuando el bot se niega o falla

Un comando rechazado o fallido indica el motivo en su mensaje de error y termina con un código:

| Código | ¿Qué pasó? Qué hacer |
|---|---|---|
| `4` | sin token de bot, o Telegram no lo aceptó | ejecute `bot auth set` nuevamente |
| `5` | los permisos del perfil no permiten que el bot haga esto | cambia el permiso solo si quieres permitirlo |
| `6` | no se encontró el chat: un título que el bot aún no ha visto, por ejemplo | use la identificación del chat o abra el chat con `bot chats show` |
| `7` | el chat no está en la lista de destinatarios del bot, o nadie respondió una pregunta en un nivel `ask` puesto | agrega el chat con `bot recipients add`, o ejecuta el comando donde podrás responder |
| `8` | el `sendsPerHour` del bot está agotado | esperar o aumentar el límite |
| `14` | no hubo respuesta: no se sabe si Telegram escribió | revisa el chat antes de repetirlo |

Cada código está en la [referencia de comando](./commands.md). `--trace` y `--record` también funcionan para un bot: cada solicitud de API de Bot es una línea en stderr, nunca con su dirección, ya que el token está en ella. Una ejecución fallida se mantiene y se muestra en `tg runs list` (consulte [diagnósticos](./diagnostics.md)).

## Conectar el bot al agente mediante MCP

`tg <name> bot mcp` entrega el bot a su agente de IA, del mismo modo que `tg mcp` sirve su cuenta:

```sh
claude mcp add sales-bot -- tg sales bot mcp
tg sales bot mcp config          # the entry for Claude Desktop, Cursor and other apps
```

El agente obtiene lo que permiten los permisos del perfil del bot, según `bot.`: los chats que el bot ha visto, los mensajes, los administradores, el menú de comandos, el diario y la lista de destinatarios y, a menos que el perfil sea de solo lectura, escribir como el bot: enviar, editar, anclar, "escribir", botones de respuesta, eliminar, eliminar miembros. `permissions.bot: readonly` bloquea las escrituras a menos que una regla más específica lo permita. Una eliminación en `ask` y `allow` permite una escritura MCP solicitada sin un formulario de servidor; `deny` y `readonly` lo bloquean. Los indicadores de confirmación antiguos no tienen ningún efecto. Aún se aplica el consentimiento de la regla de moderación separada: las acciones que requieren que devuelva un plan para que usted lo apruebe a través de la CLI. `tg_bot_read` (`command: "status"`) indica de qué perfil habla el servidor y en qué herramientas de escritura se encuentran.

Cada escritura ejecuta el mismo comando que usarías tú: se aplican destinatarios y registro del bot. Cambiar token, webhooks, menú y destinatarios sigue correspondiéndote a ti.

El `--md` del bot usa las mismas [reglas de formato de Telegram](./usage.md#sending) que los envíos personales. Las ediciones de texto y los pies de fotos y archivos usan el mismo formato.
