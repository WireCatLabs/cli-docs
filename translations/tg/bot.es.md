---
title: "Bots de Telegram"
---

`tg bot` utiliza un bot con la [Bot API oficial de Telegram](https://core.telegram.org/bots/api) y su token. Es independiente de tu cuenta: el bot tiene nombre, chats y token propios. `tg …` sin `bot` sigue actuando como tú ([uso](./usage.md)).

Crea el bot con [@BotFather](https://t.me/BotFather) en Telegram para obtener el token.

Consulta todos los comandos y opciones en la [referencia](./commands.md).

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

**Telegram no da acceso al historial a los bots.** No pueden consultar mensajes del chat ni un mensaje concreto. `messages list` y `messages show` responden desde lo enviado y recibido mediante `bot watch` en este equipo, y lo indican:

```sh
tg sales bot messages list "Team"
tg sales bot messages show "Team" 512
```

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
tg sales bot messages search "price list"    # best match first; --newest for newest first
tg sales bot messages search --from @ann     # what one person wrote
tg sales bot messages between @ann Bob       # what both wrote, in the chats both wrote in
```

`--all-bots` y `--bots <names>` incluyen copias de otros bots cuando `readOtherBots` lo permite. Telegram no ofrece historial, por lo que `contacts show --refresh` se rechaza.

## Moderar mediante reglas

Un bot administrador puede revisar mensajes nuevos según reglas, como `tg chats moderate` en tu cuenta:

```sh
tg sales bot chats rules set -1001234567890 invites delete   # invite links to other chats: delete
tg sales bot chats moderate -1001234567890 --dry-run         # what breaks the rules, without acting
tg sales bot chats moderate -1001234567890                   # act as the rules allow
```

Al no tener acceso al historial, solo revisa lo guardado por `tg sales bot watch`, nada anterior a su inicio. No evalúa entradas de miembros. Las personas eliminadas no pueden regresar por enlace salvo con `--no-ban`. Las reglas se guardan en el mismo archivo que las de tu perfil personal del mismo nombre.

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

Se ofrecen herramientas según los permisos del perfil bajo `bot.`: chats vistos, mensajes, administradores, menú, registro y destinatarios. Salvo en solo lectura, permite enviar, editar, fijar, indicar «escribiendo», responder botones, eliminar y retirar miembros. `bot: readonly` conserva solo lectura. Eliminar muestra un formulario primero; `--allow-dangerous` lo omite y `--confirm-send` exige formulario en toda escritura. `tg_bot_status` indica perfil y herramientas de escritura activas.

Cada escritura ejecuta el mismo comando que usarías tú: se aplican destinatarios y registro del bot. Cambiar token, webhooks, menú y destinatarios sigue correspondiéndote a ti.
