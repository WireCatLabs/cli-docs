---
title: "Historial de cambios"
---

Cambios notables de `@wirecat/slack-cli`. Una sección por versión, la más nueva primero.

## 0.2.0 — 25.11.2026

### Añadido

- **`inbox` cuenta la mención de un grupo de usuarios al que perteneces.** Un canal que no sigues ahora aparece cuando
  un mensaje posterior a tu última lectura nombra uno de tus grupos, por ejemplo `@devs`. La lista de grupos de Slack
  se pide una vez por ejecución y solo cuando un mensaje nombra un grupo. Si el espacio de trabajo la rechaza, se
  indica en `missing`.

### Corregido

- **`inbox` ya no se detiene en el mensaje directo con Slackbot.** Slack incluye ese chat en la lista, pero responde
  `channel_not_found` al preguntar por él. Ahora inbox lo omite y cuenta los demás chats.
- **`inbox` lee un canal que nunca has abierto.** Slack da a ese canal una marca de lectura a cero y luego no la
  acepta, así que inbox se detenía ahí. Ahora cuenta el canal desde su mensaje más nuevo.
- **La habilidad para agentes y el título de la documentación nombran `slk`.** La habilidad pedía a los agentes un
  programa `slack`, que el paquete no instala.

## 0.1.0 — 24.11.2026

### Añadido

- Creado a partir de `@wirecat/cli-template` 0.32.0.
- **`slk inbox` cubre los canales.** Nombra los canales en los que importa cada mensaje con
  `slk <profile> config set inbox_channels "#general, #dev"`, o cuéntalos todos con `inbox_all_channels true`.
  Cualquier otro canal aparece solo cuando un mensaje posterior a tu última lectura te menciona, o dice @here,
  @channel o @everyone. Slack no da a un canal un contador de no leídos, así que inbox lee lo que llegó después de tu
  última lectura, durante 15 segundos como mucho, y `missing` nombra a qué no llegó y por qué.
- **El historial y las lecturas de conversaciones van al ritmo de Slack, 50 por minuto.** `conversations.history`,
  `.info`, `.replies` y `users.conversations` tienen su propio ritmo, aparte de las 20 por minuto del resto de
  métodos, como permiten los [niveles de límite de Slack](https://docs.slack.dev/apis/web-api/rate-limits/).
- **`slk personal inbox`: los mensajes directos con mensajes sin leer, y los más nuevos.** Slack da contadores de no
  leídos solo para los mensajes directos, una llamada a `conversations.info` por cada uno, así que `inbox` pregunta a
  hasta 40 chats directos y grupales por ejecución, y `missing` dice cuántos contó y que los canales no se contaron.
  `chats list` sigue siendo una lista barata. `inbox --new` y `review` ven la hora del último mensaje de estos chats,
  así que ahora también encuentran mensajes directos nuevos.
- **Lee Slack con los comandos de mensajería.** `slk <profile> chats list|show|events`, `chats members list`,
  `contacts list|show`, `messages list|show|context|download` y `search` funcionan como en cada CLI de mensajería de
  WireCat. Un mensaje directo es un diálogo, y cada canal y chat grupal un grupo, con `slack_kind` y `slack_shared`
  (Slack Connect) al lado. El texto de un mensaje es plano, con nombres en lugar de `<@U…>` y `<#C…>`. Las menciones
  son ids de usuario, y las reacciones guardan quién reaccionó. Los mensajes de bots van marcados, y los mensajes de
  servicio (entradas, cambios de nombre, temas) son eventos del chat, no mensajes.
- **Hilos:** `slk <profile> messages list <chat> topic:<root ts>` lee un hilo, empezando por el mensaje raíz. Una
  respuesta enviada también al canal se guarda una vez.
- **`slk <profile> messages sync`** guarda el historial de un chat para la búsqueda, con las respuestas nuevas de
  los hilos que recorre y de los hilos de hasta `thread_window_days` (14 por defecto) días, a través de
  `threadReplies` de cli-core. Un mensaje que Slack deja de mostrar nunca se marca como borrado.
- **`slk <profile> setup`** inicia sesión paso a paso, con las mismas comprobaciones del token que `session start`.
- **Los archivos** se descargan solo de `files.slack.com`, con el token en la cabecera.
- **Escribe en Slack con los comandos de mensajería.** `messages send|edit|delete|pin|unpin|link`,
  `reactions add|remove` y `chats mark-read|join|leave`. El texto se envía tal como se escribe, y `--md` convierte
  Markdown en el mrkdwn de Slack. `--reply-to` responde en el hilo, y `--file` sube un archivo con la subida externa
  de Slack. Una escritura sin respuesta se informa como desconocida y nunca se envía dos veces. Repetirla con su
  `--operation-id` encuentra la copia que guardó Slack. Un mensaje a una persona sin chat directo abre uno. Los
  rechazos de Slack llevan un motivo propio, como `message.not-yours` y `chat.not-joined`, con el código de Slack en
  `details.slack_error`.
- **El grupo `api` responde según las claves de mensajería.** Un deny en `messages` detiene también
  `api conversations history`, `replies`, las búsquedas y las listas de archivos, fijados, destacados y reacciones, y
  estos toman el nivel de `messages list` en lugar de preguntar. Una escritura con `api` sigue preguntando. Un rechazo
  que Slack envía con HTTP 200 es el error de la ejecución. Un agente nunca ejecuta un borrado con `api`, y su
  `messages delete` se rechaza como permiso. Un perfil en el que nunca se inició sesión se nombra como desconocido
  junto con los perfiles de aquí, aunque no se pueda leer el llavero.
- **`reactions add` acepta el emoji en sí** (`👍`, `👍🏽`) además de su nombre en Slack (`thumbsup`,
  `thumbsup::skin-tone-4`).
- **`slk <profile> messages send --reply-to <ts> --also-to-channel`** muestra una respuesta del hilo también en el
  canal, como "Also send to #channel" de Slack.
- **`search messages` y `search all` preguntan también a la búsqueda propia de Slack.** Leen `search.messages` y la
  copia local a la vez, así que un mensaje se encuentra antes de cualquier sincronización, con el nombre de su chat.
  `--backend server` o `archive` pregunta solo a uno de ellos, y `chat:` acota la búsqueda con `in:` de Slack.
  Necesita el permiso `search:read`, que el manifiesto de la app ya pide.
- **`config show` muestra `thread_window_days`** con su valor por defecto, 14, y lo que hace.
- **`setup` y el README enlazan a la creación de la app de Slack con el manifiesto ya rellenado.** Un clic abre
  **Create New App** con los permisos de slk. Pegar `docs/slack-app-manifest.json` a mano sigue funcionando.
- **Inicia sesión con tu propia app de Slack: `slk <profile> session start`.** Crea una app en tu espacio de trabajo
  a partir del [manifiesto](https://github.com/WireCatLabs/slack-cli/blob/v0.2.0/docs/slack-app-manifest.json), instálala y pega su User OAuth Token (`xoxp-`) en la
  pregunta oculta o por stdin. slack lo comprueba con `auth.test` de Slack y lo guarda en el llavero del sistema, con
  el espacio de trabajo y la persona a la que pertenece. Un token de bot (`xoxb-`) y uno rotativo (`xoxe.`) se
  rechazan antes de enviar nada, porque slack lee como tú y no puede renovar un token que dura 12 horas.
  `session status --check`, `session list` y `session end` funcionan como en cada CLI de WireCat.
- **`slk doctor --online` pregunta a Slack de quién es cada token guardado,** cada perfil con sesión aquí con su
  propio nombre.
- **`slk <profile> api` llega a la Web API de Slack,** un comando por método, agrupados por la primera palabra de
  Slack: `slk <profile> api conversations history --channel <id>`, `slk <profile> api chat post-message --body …`.
  El token va solo en la cabecera `Authorization: Bearer`. Las escrituras van como JSON. `--all` lee todas las
  páginas de los métodos que Slack pagina por cursor, y de `files list` por página. Un método pide también la clave
  del comando de mensajería que hace lo mismo: `messages.delete` para `chat delete`, `messages.edit` para
  `chat update`, `messages.send` para `chat post-message`, `chats.leave` para `conversations leave`, `chats.archive`
  para `conversations archive`, `messages.unpin` para `pins remove`, `reactions.remove` para `reactions remove`.
  Cualquier otro borrado pide `slack.delete`. Once GET que envían, comparten o publican (`views publish`,
  `files remote-share` …) cuentan como escrituras: un perfil de solo lectura los rechaza, y nunca se envían dos veces.
  Los 15 métodos que solo aceptan un formulario y los cuatro que responden con un token o un enlace secreto quedan
  fuera, cada uno con su motivo en `slk api show` y en [cobertura de la API](https://github.com/WireCatLabs/slack-cli/blob/v0.2.0/docs/dev/API_COVERAGE.md).

### Cambios — pueden romper llamadas

- **Los comandos que Slack no puede hacer desaparecen de la ayuda, la página de comandos y MCP.**
  `chats links show|reset`, `chats requests`, `chats admins`, `chats folders`, `account sessions`,
  `contacts block|unblock` y `messages forward` se rechazaban al escribirlos. cli-core 0.730.0 ahora los oculta, junto
  con los grupos que quedan vacíos.
- **El comando es `slk`, con `wcat-slk` al lado**, no `slack`, porque el CLI de desarrollo de Slack se instala como
  `slack`. Las herramientas MCP son `slk_read`, `slk_write` y `slk_tools_search`.

### Corregido

- **`messages list --after` y `messages context` en un chat con mucho movimiento leen unas pocas páginas, no todos
  los mensajes desde ese punto.** La ventana posterior al punto se divide a la mitad mientras tenga demasiados
  mensajes, así que 50 000 mensajes en un día cuestan 10 llamadas, no 51.
- **Un permiso que falta lleva el motivo común `oauth.scope-missing`**, así que una búsqueda rechazada en el servidor
  dice qué añadir.
- **`slk session start` muestra sus pasos con títulos, y el enlace largo de la app como un enlace corto** en un
  terminal que muestra enlaces (GNOME Terminal, iTerm2, kitty, WezTerm, Windows Terminal, VS Code,
  `FORCE_HYPERLINK=1` para otro). En los demás muestra la dirección completa junto a las palabras.
- **Iniciar sesión ya no necesita ayuda.** `slk session start` muestra los pasos hasta el token antes de pedirlo: por
  qué una app propia, el enlace que la crea, dónde están **Install to Workspace** y el **User OAuth Token**
  (`xoxp-…`), y qué hacer cuando solo un administrador puede instalar apps. `slk <profile> setup`, WireCat Desktop y
  el README muestran los mismos pasos.
- **La petición de inicio de sesión nombra `slk`.** Antes hablaba del manifiesto que da "slack".
- **`slk inbox` responde dentro de los 30 segundos de un comando**: pregunta a los mensajes directos durante 20
  segundos como mucho y luego dice cuántos contó. Antes, 40 chats directos al ritmo de Slack tardaban dos minutos y el
  comando agotaba el tiempo sin nada.
- **Una búsqueda en el servidor se detiene cuando el límite de cli-core la termina.** Las llamadas a
  `search.messages` reciben la señal de parada de la propia búsqueda, así que una búsqueda lenta ya no gasta el ritmo
  de Slack después de dar su respuesta.
- **La skill del agente nombra `slk help`.** Antes decía `slack help`.
- **Un `messages sync` detenido conserva las respuestas de hilos que leyó.** Las respuestas llegan hilo a hilo, y
  cli-core 0.733.0 guarda cada hilo a medida que llega, así que una sincronización detenida en un chat con muchos
  hilos pierde como mucho el hilo que estaba leyendo.
