---
title: "Historial de cambios"
---

Cambios destacados de `@leemour/max-cli`, con una sección por versión, recientes primero. Se utiliza [versionado semántico](https://semver.org/lang/ru/); antes de `1.0.0`, la interfaz de comandos todavía puede cambiar.

## 0.25.0 — 03.10.2026

### Novedades

- **`max skill show link-conversations` imprime el skill compartido para vincular conversaciones.** Disponible sin sesión; sin nombre sigue mostrando el skill principal de MAX.

- `bot api` comparte la construcción de comandos y validación de entradas con Telegram. Los generadores siguen en cli-core; se conservan los parámetros, respuestas nativas y permisos actuales de MAX. La opción compartida `--store-token <profile>` está destinada a operaciones que devuelven credenciales; las demás la rechazan.

### Cambios que pueden romper scripts

- **`max sends list` respeta el `limit` configurado, como Telegram.** Antes, sin opción siempre seleccionaba 20 intentos. El campo JSON `limit` contiene el límite elegido; se conservan `items`, `page` y `hasMore`. `--limit` tiene prioridad sobre la configuración.

- **`max models audio list --json` añade `directory`:** el directorio de modelos compartido por MAX y Telegram. Los comandos de modelos, directorio y verificación de descargas ahora se comparten; se conservan archivos existentes, orden de modelos y configuración `transcribeModel`. No hace falta descargarlos otra vez. JSONL sigue devolviendo un modelo por línea.

- **`--md` usa el conversor propio de MAX** para send/edit y leyendas: estilos anidados, `__жирный__`, `++подчёркнутый++`, enlaces y código. Los bots admiten resaltado, encabezados y citas mediante HTML seguro; el protocolo personal rechaza explícitamente tipos sin confirmar. Telegram tiene otra sintaxis. Los tipos wire desconocidos ya no se envían silenciosamente.

## 0.24.0 — 03.10.2026

### Novedades

- **`max setup` guía el primer inicio de una cuenta personal:** comprueba directorios, ofrece acceso por QR, comprueba la cuenta y hasta cinco chats e instala el skill del agente elegido. Reutiliza la sesión existente al repetirse. El historial se descarga aparte; setup no inicia el servicio en segundo plano. La ayuda, instalación e instrucciones del agente explican los siguientes pasos y cómo ejecutar en Windows sin PATH. `max skill show` funciona antes de iniciar sesión.

### Cambios que pueden afectar a scripts

- **`max chats check` pasa a ser `max chats moderate`:** reglas y moderación compartidas con Telegram. `--since-time` acepta fecha o `30m`/`2h`/`1d`, en lugar de `--since` con un ID de mensaje; JSON devuelve `{ chatId, rows }`. Lee hasta 1000 mensajes por ejecución. Los niveles son `deny|readonly|ask|allow`; los antiguos `forbid` y `flag|confirm` se interpretan como `deny` y `ask`. El punto guardado se migra de la sesión al archivo de reglas, por lo que la primera ejecución continúa desde él. CLI y MCP personal comparten ese punto; nombres y opciones MCP se conservan. La incorporación por enlace en `chats events` se llama `join`.

- **`max upgrade --json` siempre incluye `restarted`.** En MAX es un array vacío: la política de inicio de servidores no cambia. Comprobar versiones y no encontrar actualizaciones devuelve el mismo formato que instalar, conservando los campos anteriores. Los scripts que comprueban las claves exactas deben admitir este campo.

- **La búsqueda local usa un perfil Lucene estricto:** paréntesis, campos, rangos de fechas, `--timezone`, patrones y regex limitados. Los prefijos deben indicarse como `слово*`; la búsqueda anterior con correcciones está en `--language legacy`. JSON informa de la cobertura incluso sin resultados. La guía y el skill explican la migración; JS `--regex` se ejecuta en un worker separado con límites de tamaño y tiempo.

- **`max commands --json` incluye la versión del contrato JSON en `contract`.** El valor `0` coincide con Telegram CLI; conserva los campos anteriores. Los scripts que comparan todo el JSON con una cadena guardada deben admitirlo; leer campos concretos no necesita cambios.

- **Las lecturas de grupos comparten opciones y formatos.** `chats events` usa `--since-time` en lugar de `--since` y `--type` en lugar de `--event`; el límite es temporal, no un ID. La creación se llama `create`, antes `new`. `chats members list` muestra páginas con `--limit`, `--page` y `--all`; añade `--all` para obtener la cantidad anterior. JSON ya no incluye `chatId` ni `rolesKnown`; roles, creación y última conexión permanecen en las filas. `chats inspect` devuelve `id`, `kind`, `title`, `username`, `participantsCount`, `description` y `member`, en lugar de acceso, enlace y ajustes. `member` y `username` son `null` si MAX no los informa. Actualiza scripts y filtros. Se conservan los avisos sobre listas incompletas y roles desconocidos; leer no marca mensajes como leídos. Consulta [grupos](./usage.md#группы-и-каналы).

- **La gestión de grupos devuelve JSON común con `operationId`.** `chats create`, `join`, `update` y `link reset` guardan la ficha en `chat`; `leave` devuelve `chatId`. `members add` incluye `added` y `notAdded`; `members remove`, `removed`; `admins`, `personId` y, al añadir, `rights`. Es el formato compartido con Telegram; actualiza el análisis de resultados. `link show` no cambia. Título y ajustes siguen usando dos solicitudes: si cambia título o descripción pero falla la segunda solicitud, informa de `outcome_unknown` y registra el resultado parcial. Consulta `chats show` antes de repetir. Más en [gestión de grupos](./usage.md#группы-и-каналы).

- **`max account update` y `max account sessions end` devuelven el formato común con `operationId`.** Cambiar perfil devuelve `{operationId, account}` con `id`, `name`, `username`, `phone`; cerrar sesiones, `{operationId, sessions}` en lugar de un array. Lee los datos desde `account` o `sessions`. Tras cambiar el perfil, consulta su descripción con `account show`. El teléfono sigue oculto parcialmente; `sessions end` aún requiere `--others --yes`. La foto admite JPG, JPEG, PNG y WebP; convierte los GIF a uno de esos formatos. Consulta [perfil y sesiones](./usage.md#контакты-профиль-папки).

- **`max chats folders create|update|delete` incluye `operationId`.** Crear o modificar devuelve `{operationId, folder}`; eliminar, `{operationId, folderId}`, en lugar de la ficha directamente. Los scripts deben leer desde `folder` y usar `folderId` al eliminar. `update` sin `--title`, `--add` ni `--remove` ahora rechaza la operación en lugar de reescribir lo mismo. Listar no cambia. Consulta [carpetas](./usage.md#контакты-профиль-папки).

- **`max contacts add|remove|block|unblock|rename|import` devuelve el formato común con `operationId`.** Añadir y renombrar devuelve `{operationId, person}`; eliminar y bloquear, `{operationId, personId}`; importar, `{operationId, sent, recognised}`. `recognised` contiene fichas (`id`, `name`, `username`) devueltas por MAX en lugar de teléfonos; sin fichas queda vacío. `sent` cuenta filas del archivo, incluidos números repetidos. Actualiza el análisis de respuestas. Un teléfono rechazado por MAX ya no indica la fila; los errores de estructura todavía la indican. Consulta [contactos](./usage.md#контакты-профиль-папки).

- **Se elimina `max cache clear`.** Lecturas y nombres usan la copia compartida; `max store clear --left --allow-dangerous` elimina datos de chats abandonados. No ofrece borrar toda la copia. El archivo antiguo no se migra ni se abre; `max doctor` muestra su ruta y puedes descargar otra vez el historial con `max store fetch`.

### Correcciones

- **`max conversations embed status` calcula mejor el tiempo para e5-small.** Usa una medición de 31 fragmentos/s, antes 15; en el portátil medido, la estimación anterior era el doble. El tiempo real depende del ordenador y la longitud del texto. Tres workers dieron 1,04–1,1× con más uso de memoria; la distribución de workers no cambió.

- **`max_messages_search` por MCP conserva la cobertura del archivo y usa los parámetros de CLI.** Admite `language`, `timezone`, `ast` versionado, nombre de chat y filtros `source`, `newest`, `context`. El perfil estándar admite consultas de un carácter. Antes faltaban parámetros y se perdían `query`, `coverage` y `completeness`; una respuesta vacía no explicaba el alcance de la copia. Los campos anteriores y el nombre de herramienta se conservan.

- **`max runs list --limit` sugiere ampliar el límite si faltan registros.** Ya no sugiere la opción inexistente `--page`. Leer la lista o un registro no crea otra ejecución; JSON conserva `hasMore`.

- **`chats show` muestra un grupo guardado aunque no llegue en la última actualización de acceso.** Antes podía fallar con «sin chat». Los ajustes y enlaces desconocidos quedan vacíos; leer no modifica el grupo.

- **`max messages transcribe` encuentra una transcripción guardada por nombre de chat, aunque no esté descargado el modelo.** Antes buscaba por nombre en lugar de ID y proponía descargar otra vez el modelo. Un nombre completo o fragmento único devuelve ahora el texto guardado sin descargar el audio ni reconocerlo de nuevo. Consulta [mensajes de voz](./usage.md).

- En Windows, el generador usa Node en lugar de ejecutar `.cmd` directamente; las comprobaciones de documentación reconocen rutas Windows. Los tests de permisos Unix no los exigen en Windows, donde se usa ACL.

- **Los errores de `max bot` antes de iniciar una acción respetan los ajustes de registro del perfil bot, incluso con `--timeout` delante.** Antes, una opción global anterior a `bot` podía aplicar ajustes de la cuenta personal. Si el bot tiene desactivado el registro, un error al interpretar la orden ya no crea un registro contra esa preferencia.

## 0.23.0 — 03.10.2026

### Novedades

- **`max serve` y los comandos de gestión de chats guardan nombres y chats en la base compartida.** Ya no abren la caché antigua. Una lista completa marca chats abandonados; una respuesta vacía conserva la lista anterior.
- **Los comandos de contactos y lectura guardan datos en la base compartida.** Buscar personas por nombre y `contacts sync` ya no requieren la caché antigua. La sincronización sigue devolviendo solo cantidades. Eliminar el archivo anterior no reinicia su progreso; para obtener todos los contactos, ejecuta `max contacts sync`.
- **`max mcp` libera el modelo tras 10 minutos sin búsquedas.** `conversations_search` ya no mantiene aproximadamente 1 GB durante toda la sesión del agente. La siguiente búsqueda vuelve a cargarlo en alrededor de un segundo (cli-messaging 0.110.0).
- **El autocompletado consulta la base compartida de la cuenta elegida.** No necesita la caché anterior. Tab sigue sin conectarse a MAX; los bots ofrecen chats de su lista local.
- **`max mcp setup codex|claude-code` y `max mcp doctor`** añaden MCP local al cliente y comprueban inicio y herramientas. Si el perfil ofrece escritura, requiere `--allow-writes`; esa aprobación no cambia permisos ni verifica el acceso a MAX.
- **`max <бот> bot store fetch <чат>`** descarga historial en la copia del bot, recientes primero, y puede reanudarse. `--last`, `--since-time`, `--limit`, `--page-size` y `--pause` funcionan como `max store fetch`.
- **`--yes` para cualquier comando** aprueba la pregunta del nivel `ask` antes de escribir; `max account sessions end --others --yes` funciona igual.

### Cambios que pueden afectar a scripts

- **`messages send --topic` y `polls create --topic` rechazan claramente destinos MAX.** La opción compartida corresponde a temas de foros de Telegram, que MAX no admite. No envía mensaje ni encuesta; sin `--topic`, nada cambia.
- **`max doctor --json` describe la base compartida en `store` y el archivo anterior en `legacyCache`.** Ya no abre ni comprueba el esquema de la caché antigua. Cambia `cache` por `store` en scripts. Puedes borrar el archivo anterior y recuperar historial mediante `max store fetch`.
- **MCP consulta la base compartida.** Búsquedas, contactos, recursos y transcripciones usan `messages.db` bajo la cuenta del perfil, sin abrir la caché anterior. Leer historial guarda mensajes para búsqueda. La voz lleva `kind: "voice"`. Los nombres y parámetros de herramientas no cambian.
- **`inbox` y `review` usan formatos compartidos.** Sustituye `--since` por `--since-time`. `review --unanswered` acepta `4h`, `1d`, no horas sin unidad. Los adjuntos de voz usan `kind: "voice"` en lugar de `"audio"`. `--all` incluye silenciados y archivados. La primera ejecución migra el punto anterior de `inbox --new`. La revisión retrocede por páginas hasta 300 mensajes por chat e indica si está incompleta. Actualiza comandos y comprobaciones JSON.
- **Las transcripciones personales se guardan en la base compartida.** `messages transcribe`, `inbox`, `review` y MCP usan el mismo texto que `messages list` bajo la misma cuenta. No se migran transcripciones antiguas; se regeneran al solicitarlas con `--transcribe`, con modelo descargado.
- **`max <бот> bot people show` pasa a `max <бот> bot contacts show`**, herramienta MCP `max_bot_contacts_show`. Junto con `bot messages search|between`, son comandos compartidos con `tg`; opciones y resultados no cambian.
- **`max <бот> bot chats check` pasa a `max <бот> bot chats moderate`**, como `tg`. `--since` pasa a `--since-time`, con `2h`, `1d`. JSON cambia de lista a `{ chatId, rows }`; MCP usa `max_bot_chats_moderate`. Reglas y progreso mantienen ubicación. `flag` equivale a `confirm`: pregunta o ejecuta con `--allow-dangerous`.
- **`max <бот> bot mcp` utiliza permisos del perfil, no opciones.** Sin opciones puede escribir salvo restricciones por `readOnly: true` o `allow`. Eliminar muestra formulario; `--allow-dangerous` lo omite. `--allow-send`, `--allow-delete` y `--allow-moderate` se aceptan con avisos, sin habilitar nada. Usa `readOnly: true` para solo lectura. El servidor se comparte con `tg`.
- **`max bot messages search` busca palabras, mejores coincidencias primero**, en lugar de fragmentos por fecha. `--newest` restaura el orden anterior. Requiere todas las palabras; admite `"фраза"`, `-слово`, `а OR б` y `from:`, `chat:`, `after:`, `before:`, `has:`. Corrige erratas y lo avisa por stderr. Puedes escribir palabras sin comillas; `--from` sigue siendo repetible. No admite `in:`: solo busca en su copia y las autorizadas por `readOtherBots`.

### Correcciones

- **Los rechazos del bot indican un comando válido con `--bot`.** Para solo lectura propone desactivar `readOnly`; si falta un permiso en `allow`, propone añadirlo conservando los existentes. Antes indicaba el inexistente `bot config`.

## 0.22.0 — 02.10.2026

La mayoría de comandos personales se comparten con tg: opciones, resultados `--json` y base local comunes. Hay muchos cambios de nombres, indicados abajo. No se migra la caché anterior; tras actualizar, ejecuta sin `--offline` y descarga historiales con `max store fetch`.

### Novedades

- **`max conversations search "<запрос>"`** encuentra conversaciones por significado en uno o todos los chats. Descarga una vez `max models text download e5-small` (135 MB, compartido con `tg`) y calcula vectores con `max conversations embed --chat <чат>`. `embed status` indica pendientes; `embed clear` elimina vectores. Con `--provider openai` y tu clave (`max models text key set
  openai`) usa un servicio externo; `embed` indica tokens y precio y solicita aprobación.
- **`chats list --json` incluye `providerMetadata.partnerId` en chats individuales**, identificando a la otra persona. Permite resolverla porque MAX diferencia identificadores de chat y persona.
- **`max messages search` incluye otras cuentas de la base:** `in:max`, `in:personal`, `in:bots`, `in:all` o `--source`. Sin esas opciones sigue buscando en la cuenta activa.
- **`max conversations build|list|show` y `max messages links`** identifican conversaciones por respuestas, menciones y turnos, localmente sin consultar MAX. **`conversations
  batches status|next` y `conversations links add|clear`** proporcionan lotes al agente y reciben sus respuestas.
- **`max server logs`, `max server install`, `max server uninstall`**, como tg. `install` escribe un servicio systemd en Linux o launchd en macOS, sin iniciarlo; `max server start` y `stop` lo usan después. Si MAX rechaza el acceso, no lo reinicia, evitando nuevos accesos repetidos. Se conservan `max server start --idle` y `restart --idle`.
- **`max store status`** indica cantidades y tramos completos por chat. **`store fetch --background`** y **`store jobs list|show|cancel`** gestionan descargas en segundo plano. **`store info|check|migrate|backup|restore|reindex`** mantienen la base. **`store clear --left
  --allow-dangerous`** elimina chats abandonados y mensajes.
- **`max bot auth`, `max bot list`, `max bot chats list`, `max bot recipients` y `max bot sends list` se comparten con tg**, con iguales respuestas y ayuda. Token, destinatarios y registro conservan ubicación.
- **`max cache clear --left`** elimina solo chats abandonados y mensajes de la caché del perfil, sin tocar el resto.
- **`max messages search --regex`** aplica una expresión regular al texto. **`messages show|context msg:…`** acepta localizadores sin identificador separado.
- **`max polls show <чат> <сообщение>`** consulta encuesta, identificadores y votos sin cambiar nada.
- **`max polls create --send-id`** reintenta crear una encuesta sin duplicarla tras una respuesta perdida.
- **`max messages send --photo <путь>`** envía `.jpg .png .webp` como foto, igual que tg. `send` expone `--no-preview`, pero lo rechaza porque MAX no lo admite.
- **`max skill install`** instala una skill con versión en `~/.claude/skills/max-cli/` para Claude Code y `~/.agents/skills/max-cli/` para Codex y Gemini CLI. `--for claude` o `--for agents` eligen un destino. `max skill show` no cambia.
- **El agente recibe un aviso sobre la skill.** Con `AI_AGENT` o `CLAUDECODE`, si falta o es antigua, avisa una vez al día por stderr sobre `max skill install`, sin cambiar stdout. Desactiva con `max config set skillHint false --defaults`.
- **`max mcp` y `max bot mcp` ofrecen `max://skill`** y lo mencionan en instrucciones al agente.
- **`max messages delete` devuelve `operationId`**, también en `max sends list`. Igual con `max_messages_delete`; opciones sin cambios.
- **Cada registro tiene `operationId`**, común a filas de un envío, edición, eliminación o cambio de chat, para ver su resultado. En envíos equivale a `sendId`.
- **Unos 16 MB menos al instalar:** la capa de base de datos viene incluida. Los comandos no cambian.

### Cambios que pueden afectar a scripts

- **`max messages search` busca palabras, mejores resultados primero.** `--newest` recupera orden reciente. Admite `"фраза"`, `-слово`, `OR`, `from:`, `chat:`, `after:`/`before:` y `has:`. Corrige erratas y lo avisa. `--context <n>` muestra contexto. JSON añade `match` y `score`.
- **`max bot updates watch` pasa a `max bot watch`**, como tg y `max watch`. Sin `--events` muestra mensajes; con ella, cada línea indica evento (`{ "event": "message" | "edit" | "delete" | "callback" | "joined" | … }`), no eventos MAX sin procesar. `--timeout` termina normalmente con `0`. Los bots de solo lectura pueden usar `watch` para recibir actualizaciones. El punto guardado no cambia.
- **`bot webhooks list` devuelve `{ url, types }`**, no campos propios de MAX. `bot callbacks answer --text` deja de leer stdin mediante `-`. `bot commands`, `bot callbacks` y `bot webhooks` se comparten con tg; `webhooks set --secret-stdin` solo pregunta tras comprobar permisos.
- **Node 22.16 o posterior**, o Bun. Si Node en Linux usa SQLite del sistema antiguo, `max` reinicia con `@leemour/cli-messaging-sqlite` antes de leer o enviar. Node oficial y Bun no requieren cambios.
- **`max store` se comparte con tg.** `store fetch` guarda en la base común y pagina MAX como antes: 30 mensajes, pausas de 5–10 segundos y hasta 40 páginas por ejecución. Así `messages`, `conversations` y `store` leen lo mismo. No se migra la caché; vuelve a descargar. Además:
  - Rechaza `store fetch --estimate`: los identificadores de MAX no permiten contar lo pendiente.
  - `store fetch|export --since` pasa a `--since-time`, solo fechas, no identificadores.
  - `store fetch --max-pages <n>` pasa a `--limit <сообщений>`, predeterminado 1200, cuarenta páginas de 30. Tamaño mediante `--page-size`.
  - `store export --format md` pasa a `--format markdown`; `jsonl` no cambia. Los huecos se consultan en `store status`, no en stderr de exportación. No sobrescribe archivos.
  - `store fetch` deja de imprimir el comando de exportación.
  - Si dos mensajes comparten milisegundo y la página los separa, rara vez puede omitirse el anterior.
- **`max messages list|show|context|search` se comparten con tg.** `--offline` y `search` consultan la base común con las mismas opciones y respuestas. En esta versión, MCP aún leía la caché anterior y podía diferir. La base se llena tras leer en línea; datos y transcripciones anteriores no se migran. Además:
  - Voz como `"kind": "voice"`, no `"audio"`; `inbox` y `review` aún usan `"audio"` en esta versión.
  - `messages list --before` y `--after` se dividen en `--before-id`, `--before-time`, `--after-id`, `--after-time`; `messages context`, `--before-n`, `--after-n`. Nombres antiguos producen errores.
  - `messages list --before-id` omite el mensaje de referencia; sin conexión necesita un identificador guardado.
  - `messages list --transcribe --json` elimina `transcribeProblem`; stderr explica fallos. Sin conexión, `unheard` está vacío. Voz se descarga por conexión separada; `--no-serve` provoca un segundo acceso.
  - Busca modelos en `~/.cache/cli-common/models/audio`, compartida con tg; mueve o descarga los de `~/.cache/max-cli/models/audio`.
  - `messages search` busca palabras y prefijos (`квартир` encuentra «квартира»), no tres letras cualesquiera. `--chat` acepta títulos guardados.
- **`max chats list|show` y `max contacts list|show` se comparten con tg.** `--offline` utiliza la base compartida, con igual formato. Se llena tras la primera lectura en línea; antes devuelve `not_found`. No migra datos anteriores. Además:
  - `chats list --search|--kind|--unread` examina 200 chats recientes en línea, avisando de anteriores; sin conexión, todos los guardados.
  - `chats show --offline` no incluye `description`, `access` ni `settings`, conocidos solo por MAX.
  - `--kind` incorrecto devuelve `--kind is one of dialog, group, channel, saved`.
  - `cache clear` también elimina esta cuenta de la base compartida; `contacts sync` recupera todo allí.
- **`max messages send|edit|forward` se comparten con tg.** `send` devuelve `{sendId, operationId, message}`, con `scheduledFor` si usa `--at-time`; `forward`, `{sendId, operationId, message}`; `edit`, `{operationId, message}`, en lugar del mensaje sin envolver. Igual en `max_messages_send`, `max_messages_edit`, `max_messages_forward`. `max_messages_edit` elimina `markdown`; `max_messages_forward`, `send_id`. Lee `message` en lugar de la raíz. `send` admite un `--file` y un `--photo`, no varios archivos. Los programados de resultado desconocido indican `messages scheduled` sin nombre de chat.
- **`max polls` se comparte con tg.** `polls vote|close --json` devuelve `{operationId, poll}`, donde `poll` contiene `{chatId, messageId, question, answers: [{id, text, voters, chosen}], closed, multiple,
  anonymous, voters}`; `polls create`, `{sendId, operationId, message}`. Igual con `max_polls_vote`, `max_polls_close`, `max_polls_create`. `max_polls_create` cambia `revote` por `silent`.
- **Reacciones, fijados y lectura usan el JSON de tg**, con `operationId`:
  - `reactions add|remove`: `{operationId, chatId, messageId, reaction}`, reacción propia o `null`, sin cantidades (están en `messages list`).
  - `messages pin|unpin`: `{operationId, chatId, messageId, pinned}`, con `pinned` como `true` o `false`.
  - `chats mark-read`: `{operationId, chatId, until}`, con `null` para el más reciente.

  Igual en `max_reactions_add`, `max_reactions_remove`, `max_messages_pin`, `max_messages_unpin`, `max_chats_mark_read`.
- **`max messages unpin <чат> <сообщение>`** requiere identificador, como tg y pin. MAX conserva un único fijado y lo retira con cualquier identificador. `max_messages_unpin` requiere `message`. Añade un identificador a `messages unpin <чат>`.
- **Desaparecen `max serve --detach` y `max serve --stop`:** utiliza `max server start` y `max server stop`. `serve` trabaja en primer plano; `max server` gestiona el segundo. Actualiza scripts y servicios manuales.
- **`max server status --json` usa el formato tg:** `byHand` pasa a `by`: `hand`, manual; `command`, iniciado por comando; `server`, por `max server start`; `unit`, servicio. Añade `log`, `unit` y `stale` si quedó una marca de un servidor caído. `max server start`, `stop` y `restart` devuelven `{ started, by, pid, startedAt, log }` y `{ stopped, by, pid }`, sin `socket`.
- **`max messages send --at` pasa a `--at-time`**; el nombre anterior `--at` produce error; reemplázalo por `--at-time`. `at` de `max_messages_send` en MCP no cambia.
- **Solo `--md`, desaparece `--markdown`** en envío, `messages edit` y demás formato. Cambia los scripts antiguos.
- **`max sends list --json` cambia `cid` por `sendId`, cadena en lugar de número**, como `outcome_unknown` y `--send-id`. También muestra así registros antiguos.
- **Los registros (`--trace`, `--record`, `max runs show`) usan formato común.** El envío se llama `send`, no `cid`; errores MAX, `providerError`, no `maxError`, en eventos, `run.json` y `details`.
- **`max bot` devuelve `outcome_unknown`, código `14`, en escrituras con respuestas 502, 503 o 504**, antes `provider_unavailable`, código `12`. El intermediario no demuestra si MAX ejecutó la petición. Reintentar `12` podía duplicar; con `14`, comprueba primero. Las lecturas siguen reintentándose y devuelven `provider_unavailable`.
- **Los comandos de bot adoptan nombres tg sin alias.** `max bot messages get <сообщение>` pasa a `messages show <чат> <сообщение>`; `messages edit|delete` también reciben chat primero. `bot chats get` pasa a `chats show`; `bot chats pin|unpin`, a `messages pin|unpin <чат> <сообщение>`. `--format markdown|html` pasa a `--md` o `--html`; desaparece `--type`: usa `--photo`, `--voice` o `--as-file` para vídeos como archivo. `chats action` acepta `typing`, `photo`, `video`, `voice`, `file`. Enviar y editar devuelve `{ operationId, message }`. Eliminar pregunta; `--allow-dangerous` aprueba. MCP: `max_bot_chats_show`, `max_bot_messages_show`, `max_bot_messages_pin`, `max_bot_messages_unpin`.
- **`max bot members` y `max bot admins` pasan a `max bot chats members` y `max bot chats admins`.** `admins add` utiliza `--can` en lugar de `--permissions`, con `max chats admins add`: `read`, `members`, `admins`, `info`, `pin`, `link`, `edit`, `delete`; `--title` sustituye `--alias`. No hay permisos de llamadas ni estadísticas. `admins list` devuelve `{ id, name, username, role,
  rights, title }`. MCP: `max_bot_chats_members_list|add|remove`, `max_bot_chats_admins_list`.
- **Los cambios locales se clasifican como escrituras.** `config set` y `unset`, `chats rules set` y `unset`, `recipients add`, `remove`, `clear`, y `auth set`, `remove`, `chats rules set`, `unset`, `recipients add`, `remove`, `clear` del bot modifican configuración, reglas, destinatarios o almacén, no MAX. La [referencia](./commands.md) indica que solo cambia el equipo; `max commands` lo muestra en `writes`. Los filtros de solo lectura mediante `max commands --json` ahora los excluyen.

### Correcciones

- **`max store fetch` por fecha ya no omite mensajes en límites de página** y se detiene si MAX repite páginas.
- **`max messages list --before-time` excluye mensajes del mismo milisegundo:** «antes» es estrictamente anterior.
- **`max messages list --after-id` (0.21.0: `--after <id>`) indica si hay página siguiente**, en lugar de negar siempre al avanzar.
- **`max messages send --voice` funciona mediante `max serve`.** Antes perdía la forma de onda y MAX rechazaba con `proto.payload`, código `11`. Con `--no-serve` ya funcionaba.
- **`max chats list` y `max chats show` eliminan chats abandonados** al recibir una lista completa en el siguiente acceso. Antes permanecían con cantidades obsoletas. Sus mensajes quedan hasta `max cache clear --left`; `max serve` detecta la salida en el siguiente acceso completo.
- **`max serve` no confunde respuestas tras uso prolongado.** Los números de dos bytes reinician tras 65 536 peticiones; ahora se omiten los que aún esperan respuesta.

## 0.21.0 — 30.09.2026

### Cambios que pueden afectar a scripts

Los comandos siguen sustantivo y acción. Los nombres anteriores devuelven «unknown command» o «unknown option», código `1`, sin actuar.

- **`max backup messages` pasa a `max store fetch`.** Descarga inmediatamente; `--estimate` solo calcula (antes requería `--run`). Conserva máximo `--max-pages` de 40 páginas y pausas. `--pause` exige duración (`5s`, `500ms`), no número sin unidad. `--since` y `--last` son opcionales; sucesivas ejecuciones llegan al inicio, reanudando.
- **`max export messages` pasa a `max store export`.**
- **`--cid` pasa a `--send-id`** en `messages send` y `messages forward`. `outcome_unknown` usa `sendId`; `max_messages_send` y `max_messages_forward` cambian `cid` por `send_id`.
- **`max chats read` pasa a `max chats mark-read`**; `max_chats_read`, a `max_chats_mark_read`.
- **Desaparece `max chats settings`.** Consulta `settings`, `description`, `access` mediante `max chats show` e invitaciones con `max chats link show`; cambia ajustes con `max chats update <чат> --all-can-pin on|off` y demás opciones.
- **`max update` pasa a `max upgrade`**, también en avisos.
- **`max recipients off` pasa a `max recipients clear`**, respuesta `off` a `cleared`; **`max bot recipients off`, a `max bot recipients clear`**.
- **`max account sessions end-others` pasa a `max account sessions end --others`**; sin `--others` rechaza.

### Novedades

- **`max complete` aparece en `max --help`**, para encontrar cómo activar Tab.
- **[Acceso desde navegador](./remote.md): ChatGPT o Claude**, con proxy de contraseña y dirección pública Tailscale sin dominio propio. Basado en documentación, sin prueba completa.

## 0.20.0 — 30.09.2026

### Cambios que pueden afectar a scripts

- **La base compartida pasa al esquema 6** (cli-messaging 0.49.0). El primer `max` actualiza `messages.db`; tg anterior al publicado ese día rechaza el archivo y pide `npm install -g @leemour/tg-cli@latest`. Los comandos MAX no cambian.
- **`--all-bots` necesita autorización para leer otros bots.** Define `readOtherBots` en `bot`: `max <имя> config set --bot readOtherBots true` o lista de perfiles. Sin ella, código `5` y comando para permitirlo.
- **Las personas ambiguas se ordenan por nombre**, primero quienes no tienen nombre, en lugar del orden de caché. El texto del error no cambia.

### Novedades

- **`--bots news,support`** en `bot messages search`, `bot people show`, `bot messages between` consulta solo esos perfiles autorizados por `readOtherBots`. `bot messages search` también admite `--all-bots`.
- **`bot mcp` ofrece `all_bots` y `bots`** en esas tres herramientas solo si se autorizan lecturas entre bots.
- **Cada bot conserva sus personas.** Las vistas por uno no aparecen en otro sin `--all-bots` o `--bots`.
- **La búsqueda del bot encuentra fragmentos de tres letras** (`вартир` encuentra «квартиру»), igual que la búsqueda personal en esta versión.

## 0.19.0 — 28.09.2026

### Cambios que pueden afectar a scripts

- **Cerrar encuestas mediante `max mcp` requiere `edit`**, antes `reaction`. Cerrar edita el mensaje y `max polls close` ya lo exigía. Si `allow` restringe acciones, añade `edit` para ofrecer `max_polls_close`. Sin lista nada cambia. Consulta [MCP](./mcp.md).

### Correcciones

- **`max mcp --confirm-send` inicia si solo `mcpTools` habilita escrituras.** Antes exigía `--allow-*`, por lo que contactos, grupos y perfil podían cambiarse sin formulario. Sin `--confirm-send` nada cambia; añádela para aprobar cada acción.
- **`max <бот> bot messages search --limit N` indica más resultados.** Antes siempre devolvía `hasMore: false` y `limit` de configuración en lugar de `N`, deteniendo scripts y agentes que comprueban `hasMore` antes de tiempo. Ahora devuelve `hasMore: true` si supera `N`.

## 0.18.1 — 28.09.2026

### Correcciones

- **`max contacts rename` se refleja inmediatamente** en `contacts show` y título del chat. Antes esperaba hasta que `max serve` iniciara sesión porque no aplicaba el contacto devuelto. Si sigue obsoleto, el primer comando 0.18.1 sustituye el servidor anterior.

## 0.18.0 — 28.09.2026

### Novedades

- **Herramientas de cuenta en `max mcp`:** añadir, eliminar, renombrar y bloquear contactos; cerrar tu encuesta; entrar, salir y crear grupos; gestionar administradores; cambiar nombre y descripción. Antes solo leía y enviaba mensajes. Solo tú las habilitas mediante `mcpTools`, por ejemplo `max config set mcpTools contacts,polls`; no mediante opciones del agente. Todas pasan por `readOnly`, `allow` y registro. Consulta [MCP](./mcp.md).
- **Las subidas del bot aparecen en `--trace` y registros.** `bot messages send --file` y `bot uploads put` muestran tipo, tamaño, estado HTTP y duración en dos líneas. Nunca muestran ni guardan dirección o nombre del archivo.

### Correcciones

- **`max contacts rename` cambia realmente el nombre.** Antes MAX indicaba éxito sin cambiarlo si faltaba `lastName`; ahora lo envía siempre, `null` si no hay apellido, como el cliente web. Repite los cambios hechos con el comando de renombrado en 0.17.x.

## 0.17.1 — 28.09.2026

### Correcciones

- **Los errores de `--limit`, `--last` y `--max-pages` repiten el valor introducido.** Afecta a `messages list`, `inbox`, `backup`, `sends list` y comandos del bot. Antes, `--limit abc` aparecía como `NaN`; en 0.17.0 solo se corrigieron las listas paginadas.
- **`runs list` y `sends list` truncadas por `--limit` indican `hasMore: true`.** Antes devolvían `hasMore: false` y un `limit` distinto al solicitado. Los scripts que seguían `hasMore` podían detenerse en la primera página.
- **Los contactos renombrados usan el nombre que les has dado**, como MAX. Antes `max` mostraba el nombre propio aunque lo cambiaras mediante `contacts
  rename` o en la aplicación.

## 0.17.0 — 28.09.2026

### Cambios que pueden afectar a scripts

- **Todas las listas con `--json` son objetos `{items, page, limit, hasMore}`, no arrays.** Incluye `account sessions list`, `chats members list`, `chats folders list`, `messages scheduled`, `messages download`, `messages context`, `models audio list`, `recipients list`, `sends list`, `runs list`, `chats check`, `chats events` y listas del bot. Antes algunas eran arrays y `chats events` devolvía `{events, more}`.
  Motivo: había tres formatos distintos que los scripts y agentes debían recordar.
  Ten en cuenta: lee `.items` en vez del array. Sin paginación, `page` es 1 y `limit` el número de filas. `bot members list` y `bot admins list` añaden `marker`; `user_id` es una cadena. `bot messages get` devuelve el mensaje, no un array de uno. `--jsonl` y las tablas no cambian. MCP usa el mismo formato.

### Novedades

- **`max doctor` y `max config show` incluyen bots.** Enumeran todos los perfiles del equipo indicando cuenta personal, bot o ambos. `doctor` muestra la procedencia del token sin revelarlo, chats vistos y rutas; `doctor --online` consulta a Bot API quién es el bot. Para perfiles de bot, ya no recomienda `session start`, sino `max <имя> bot …`.
- **Herramientas MCP `max_status` y `max_bot_status`.** Indican el perfil, la existencia de token y herramientas de escritura activas. No envían nada; `max_status` ni inicia sesión.
- **Tab conoce los bots.** Sus comandos completan chats vistos por el bot, no por la cuenta personal; la primera palabra ofrece todos los perfiles.
- **Los comandos del bot tienen registros como los personales.** `max <имя> bot … --trace` muestra peticiones Bot API en stderr: operación, chat/mensaje, estado HTTP y duración. `--record` guarda ejecuciones; los fallos se guardan solos con sus peticiones. Consulta `max runs list`, `max runs show`. Las cargas `--file` aún no se registraban; se añadieron en 0.18.0.
- **Ajustes separados para cuentas y bots.** Secciones `personal` y `bot`, con `defaults` y `profiles` propias. `max config set --personal|--bot` escribe la sección; `max config show --bot` indica la clave de origen, como `config file: bot.profiles.test`. Motivo: necesitan reglas diferentes. Prioridad: perfil de sección, perfil general, sección, `defaults` generales. Los archivos antiguos siguen funcionando. Consulta [Configuración](./configuration.md).
- **Límite por hora para bots.** `max <имя> config set --bot sendsPerHour 200` lo define. Por defecto sigue sin límite.
- **`max config set defaultProfile <имя>`** selecciona el perfil cuando la primera palabra no lo indica; antes siempre `default`.
- **Foto, nombres propios y bloqueo.** `max account update --photo <файл>` cambia la foto. `max contacts rename <кто> <имя> [фамилия]` cambia el nombre solo para ti. `max contacts block <кто>` y `unblock` bloquean incluso a quien no está en contactos. Aplican los controles de `account update` y `contacts add`. `contacts rename` aún no cambiaba realmente el nombre; corregido en 0.18.0.
- **Canales.** `max chats create <название> --channel` crea un canal privado. Invita mediante `max chats link show`: MAX puede rechazar añadir personas directamente.
- **Permisos de lectura y enlace.** `max chats admins add <чат> <кто> --can read,link` permite leer la historia y cambiar la invitación. Un bot administrador sin `read` no ve mensajes del grupo.
- **Tiempos relativos.** `--since`, `--before`, `--after` admiten `30m`, `2h`, `1d`: `max review --since 1d`. Antes exigían tiempos exactos.

### Correcciones

- **Los cambios propios de chats se ven inmediatamente.** Tras `max chats update`, `chats settings`, `chats link
  reset`, `chats show` y `chats list` mostraban el nombre antiguo durante minutos. MAX no devuelve el cambio como evento; ahora `max serve` aplica el chat de la respuesta, como los mensajes enviados.
- **`max export messages` ya no avisa de un hueco hasta 1970-01-01 tras un `backup` completo.** Antes seguía indicando que faltaba el inicio.
- **Errores de `--limit` y `--page` conservan el valor introducido**, en vez de llamar `NaN` a `--limit abc`.
- **Una invitación revocada en `chats inspect` o `chats join` da `not_found`, código 6**, en vez de un rechazo MAX con número de operación. Los scripts deben esperar 6.
- **`max config show` y `max doctor` no inventan `<имя>.moderation` como perfil.** Antes confundían el archivo de reglas con uno.
- **Errores de subcomando nombran la palabra desconocida, no el perfil.** `max work bot auth status` culpaba a `work` en lugar de `status`.
- **`max config show` incluye `transcribeModel`**, antes ausente.

### Eliminaciones

- **Solicitudes de ingreso: `max chats requests list|accept|decline`, regla `requests`, niveles `consent.accept` y `consent.decline`.** MAX permite grupos abiertos o mediante invitación, sin aprobación de solicitudes; los comandos prometían algo inexistente. Los archivos antiguos siguen leyéndose y pierden esas claves al escribirse. Los scripts con `chats requests` reciben «comando inexistente».

## 0.16.0 — 27.09.2026

### Novedades

- **Personas e historial del bot.** `max <имя> bot people show <кто>` muestra dónde escribió y su chat privado. `bot messages search --from <кто>` encuentra uno o varios autores; `bot messages between <кто> <кто>` muestra sus mensajes en chats comunes. Solo usa lo visto en el equipo; `--all-bots` incluye todas las copias.
- **Moderación del bot por reglas.** `max <имя> bot chats check <чат>` comprueba lo nuevo según `bot chats rules show|set|unset`, borrando mensajes o expulsando personas. Ingresos mediante `bot updates watch`. Sin `--no-ban`, quien es expulsado no vuelve por enlace; Bot API no puede deshacerlo. Tampoco conoce la antigüedad de cuentas.
- **Encuestas.** `max messages list` muestra pregunta, opciones con IDs en `[скобках]`, votos y ✓ en tu opción. `max polls vote <чат> <сообщение> <вариант>…` vota, `--retract` retira, `max polls close` cierra, `max polls create` crea. MCP: `max_polls_vote`, `max_polls_create` con `--allow-send`. Los estados inválidos se rechazan antes de enviar: encuesta cerrada, opciones sobrantes o segundo voto no permitido. web.max.ru no muestra encuestas y `polls create` lo recuerda.
- **`max <имя> bot mcp` para agentes.** Solo lectura por defecto; escritura con `--allow-send`, `--allow-delete`, `--allow-moderate`, `--confirm-send`. Ejecuta los mismos comandos con destinatarios y registro. Acciones que requieren consentimiento se muestran en un formulario. Consulta [MCP del bot](./bot.md#бот-для-агента-mcp).

### Cambios que pueden afectar a scripts

- **`timeout` de `max bot api get-updates` pasa a `--poll-timeout`.** Antes `--timeout` no llegaba a MAX porque limita toda la ejecución. Los scripts de long polling deben usar `--poll-timeout`.

### Correcciones

- **La primera orden de una versión nueva sustituye al `max serve` antiguo.** Antes seguía rechazando operaciones nuevas, como votos, hasta `max server stop`.
- **También se sustituye una compilación distinta con igual versión.** Un servidor iniciado a mano rechaza operaciones desconocidas sugiriendo `max server stop`.
- **`max bot api get-updates --limit …` funciona.** Antes `--limit` se interpretaba como configuración global y fallaba.

## 0.15.0 — 27.09.2026

### Novedades

- **`max chats check <чат>` modera por reglas.** Lee mensajes y participantes nuevos desde la última revisión, aplica `max chats rules` y avisa, borra o expulsa. Por defecto solo informa; `--dry-run` planifica; máximo 10 acciones. Los cambios pasan los controles habituales. Las solicitudes solo estaban previstas aquí y se eliminaron en 0.17.0 porque MAX no las tiene. Consulta [Grupos](./groups.md).
- **Moderación mediante agente.** `max mcp --allow-moderate` ofrece `max_chats_check`; siempre se ofrecen los lectores `max_chats_events`, `max_chats_members`, `max_chats_rules`. Sin el indicador no hay herramienta de actuación. Los cambios pendientes de consentimiento se muestran juntos en un formulario.
- **Roles e invitaciones.** `max chats members list` indica `owner`, `admin`, `member`. `max chats link show <чат>` muestra la invitación.
- **Vídeos y voz personales.** `max messages send <чат> --file ролик.mp4` reproduce vídeo en el chat (`.mp4 .mov .webm .mkv`); `max messages send <чат> --voice
  заметка.ogg` envía voz con onda y duración. Antes el vídeo era archivo; `--as-file` conserva ese comportamiento. Voz solo Ogg Opus; otro audio sugiere `ffmpeg`. Consulta [Uso](./usage.md).
- **Transcripciones en listas.** `max messages list <чат> --transcribe`, `max inbox
  --transcribe` reconocen localmente; 🎤 bajo el mensaje, `transcript` en `--json`. MCP: `transcribe: true` en `max_messages_list`, `max_inbox`. El texto ya reconocido aparece sin indicador; hace falta modelo descargado.
- **Más comandos de bot.** `max <имя> bot messages send --file <путь>` adjunta imagen/vídeo/audio/archivo; `bot uploads put` solo carga. `bot members list|add|remove`, `bot admins list|add|remove`, `bot comments list|get|send|edit|delete`, `bot callbacks answer`, `bot commands
  list|set|clear`, `bot webhooks list|set|delete`. Consulta [Bots](./bot.md). `webhooks set` rechaza otro destino porque MAX mantendría ambos, en lugar de sustituirlo.
- **Copia local del bot.** Lo leído/enviado/recibido se conserva. `max <имя> bot messages list <чат> --offline`, `messages get --offline` leen sin red; `bot messages search <текст>` busca. El borrado propio u observado por `updates watch` retira el mensaje; la copia contiene texto.
- **`max <имя> bot updates watch`** muestra eventos hasta Ctrl-C, guarda mensajes y reanuda desde la posición anterior. No funciona con webhook; consume los eventos de otros lectores: ejecútalo solo si nadie más necesita el bot.
- **Personas en la copia.** `max <имя> bot people show <кто>` muestra chats y últimos mensajes privados; `--refresh` relee desde MAX. `bot messages
  search --from <кто>` filtra autor; `bot messages between <кто> <кто> …` compara autores en chats comunes. `--all-bots` incluye todas las copias. Persona: número, `@username` o parte del nombre.

### Cambios que pueden afectar a scripts

- **`max bot messages list` ordena de antiguos a nuevos**, como `max messages list`. Los envíos del bot se marcan propios. Los scripts que tomaban la primera fila como la más reciente deben adaptarse.

### Correcciones

- **`max review --transcribe` cierra MAX antes de reconocer.** Primero descarga grabaciones, cierra y ejecuta el modelo.
- **`max bot api edit-my-commands`, `subscribe`, `unsubscribe`, `get-upload-url` funcionan.** Antes fallaban con «an account change without a known action» sin enviar nada.
- **Un destinatario positivo sin `user:` se identifica como probable persona** y sugiere `user:<номер>`.
- **Los ejemplos de [Bots](./bot.md) usan identificadores reales**, explicando cómo obtenerlos.

## 0.14.0 — 27.09.2026

### Novedades

- **`max bot` usa el Bot API oficial.** `max bot auth set` valida y guarda el token separado de la cuenta personal. Perfil primero: `max рабочий bot me`. `max bot me` muestra el bot; `max bot api <операция>` ejecuta las 33 operaciones con parámetros y cuerpo JSON, generadas desde la [especificación oficial](https://github.com/leemour/max-cli/blob/v0.25.0/docs/dev/bot-api-coverage.md). IDs mayores que 2^53 son cadenas para conservar dígitos; los scripts deben tratarlos así.
- **Comandos cómodos.** `max <имя> bot messages send <чат> <текст>` escribe a ID, `user:<номер>` o nombre visto. También `edit`, `delete`, `list`, `get`. `max <имя> bot chats list`, `chats get|pin|unpin|leave|action`, `max bot list`. MAX no lista chats del bot: el CLI recuerda los vistos.
- **Destinatarios y registro del bot.** `max <имя> bot recipients add|list|remove|off`, `max <имя> bot sends list`. Se comprueban todas las escrituras, incluidas `bot api`. Aún no hay límite por hora; llega en 0.17.0. Consulta [Bots](./bot.md).
- **Actividad de grupos.** `max review --unanswered [часы]` encuentra preguntas sin respuesta tuya ni de administradores; `max review --chat <чат>` revisa un chat. `max chats events <чат>` muestra ingresos, salidas, altas y expulsiones. `max chats members list
  <чат>` lista miembros con registro y última actividad. `max chats
  rules show|set|unset <чат>` guarda reglas juntas, como `config set`.

### Correcciones

- **Cuando MAX cierra la conexión, el error indica código y motivo.**

## 0.13.0 — 26.09.2026

### Novedades

- **`max review` revisa obligaciones.** Todos los mensajes, también tuyos, desde la última revisión (tres días sin `--since`). `--transcribe` reconoce voz. Termina indicando dónde iniciar la siguiente revisión. Si falta lectura, señala resultado incompleto: no lo consideres completo ([Uso](./usage.md#обзор-кто-кому-что-должен)).
- **`max_review` y `/review` en MCP.** El agente separa mis obligaciones, esperas y dudas; revisa grupos antes de declarar retrasos y prepara recordatorios. Solo envía con tu aprobación ([MCP](./mcp.md#команды-и-чаты-по-)).
- **`max mcp config` imprime configuración para Claude Desktop, Cursor y otros.** Rutas absolutas para Windows y clientes sin `PATH` del terminal ([Conexión](./mcp.md#подключение)).
- **`max doctor` comprueba la instalación:** entorno, ruta, disponibilidad en un terminal nuevo, almacén de claves, SQLite y modelo de voz. Si falta `PATH`, muestra la solución PowerShell o `export`. Si no encuentras `max`, ejecuta `npx @leemour/max-cli doctor` ([Problemas](./troubleshooting.md#max-не-находится-после-установки)).
- **`max doctor --online`** realiza un inicio, lee un chat y arranca MCP sin enviar.
- **`max models audio download` prueba el modelo descargado.** Si falta, indica idioma y alternativas con tamaños.

### Cambios que pueden afectar a scripts

- **`max_messages_attachment` pasa a `max_messages_photo`.** Renueva permisos guardados del cliente MCP.
- **No se admite el perfil `review`**, ahora una orden; renombra perfiles existentes.

### Seguridad

- **Los informes Windows ocultan el directorio personal con cualquier escritura.** Antes el nombre del usuario seguía visible en ciertas rutas.

## 0.12.0 — 26.09.2026

### Novedades

- **Más MCP:** `max_inbox` reúne lo nuevo; respuestas y formato, reacciones, fotos como imagen visible al agente ([Herramientas](./mcp.md#инструменты)).
- **`/catch-up`, `/reply`, `/find` y chats mediante `@` en Claude Code** ([Comandos](./mcp.md#команды-и-чаты-по-)).

### Correcciones

- **`max serve` funciona en Windows** mediante canal con nombre, no archivo.
- **Sockets demasiado largos en macOS/Linux dan un error claro**, no `EINVAL`; pueden alargarse por perfil o `MAX_STATE_DIR`.

## 0.11.0 — 26.09.2026

### Novedades

- **`max watch --events` muestra ediciones, borrados y reacciones** con campo `event`; sin indicador conserva formato ([Eventos](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch)).
- **Informes mediante incidencias GitHub, no correo.** `max doctor report create` imprime enlace con título y plantilla; se adjunta el informe. Incidencia y archivo son públicos ([Problemas](./troubleshooting.md#как-сообщить-о-проблеме)).
- **Todos los errores guardan una ejecución**, incluso indicadores inválidos, comprobaciones previas y órdenes sin MAX (`models`, `server`, `watch`). Antes solo los que alcanzaban MAX. Solo se guardan palabras de comando, no argumentos ni mensajes ([Diagnóstico](./diagnostics.md)).
- **`max backup messages --run` indica ubicación y siguiente paso.** Conserva en copia local; `max export messages` crea archivo. La orden aparece al final y en `export`.
- **`max serve` comprueba permisos y registra envíos:** lectura, acciones, destinatarios y límite. `config set` se aplica sin reiniciar. No se inicia con `MAX_TOKEN`.
- **`max serve` pide lo mismo que web.max.ru al entrar:** carpetas, banners, llamadas, stickers y reacciones. Al reconectar envía la hora anterior y pide solo chats cambiados. Motivo: reducir diferencias frente al cliente web. Solo lectura; no muestra ni guarda respuestas. Las órdenes puntuales no lo hacen ([Seguridad](./security.md#что-уходит-в-сеть)).
- **El servidor tolera un mensaje entrante malformado**, lo omite y registra una línea en vez de detenerse.

### Cambios que pueden afectar a scripts

- **Más protección para agentes.**
  - `max mcp --confirm-send` confirma cualquier escritura —edición, reenvío, fijado, lectura y borrado—; aprobación única durante cinco minutos.
  - `sendsPerHour` incluye ediciones, fijados con aviso y cada persona añadida. Los programados cuentan a la hora de salida. Dos envíos simultáneos ya no superan juntos el límite.
  - Con destinatarios activos, crear grupo o añadir personas exige que el chat privado de cada una esté autorizado.
  - `chats members add` no muestra historia sin `--history`; se elimina `--hide-history`.
  - `MAX_PROFILE_LOCK` fija el proceso en un perfil.
  - `--file` rechaza archivos ocultos y propios de `max` sin `--allow-any-file`.

  Ten en cuenta: el límite se consume antes. Retira `--hide-history` de scripts; añade `--allow-any-file` si debes enviar archivos ocultos.

### Correcciones

- **`max watch` no confunde ediciones/borrados con mensajes nuevos**, aunque MAX los envíe con el mismo formato marcado.
- **Un nombre exacto no gana en silencio.** Si también forma parte de otro chat, enumera ambos y exige ID: un envío al destinatario equivocado no puede deshacerse.

### Seguridad

- **`MAX_TOKEN` permanece solo en la variable.** Un token renovado no se escribe a claves/archivo; se avisa en stderr. `max doctor` indica `credentials.json` cuando es la fuente.
- **`max session start` oculta el teléfono**, como `max account show`. Ctrl-C al pedir token termina con `130`.
- **El servidor no entrega tokens** a comandos que consultan su sesión; verifican el almacén.
- **Límites de red.** Tramas MAX descomprimidas hasta 32 MiB; conexión y descargas no esperan indefinidamente. `max messages download` solo HTTPS, sin equipo local ni red privada, incluso tras redirecciones; máximo 4 GiB, voz para transcripción 32 MiB. Los enlaces provienen de terceros y pueden apuntar a cualquier lugar.
- **Permisos locales.** Base y `-wal`, `-shm` con `0600`, directorio `0700`; se corrigen los existentes al abrir. Los informes sustituyen IDs por etiquetas.
- **Texto ajeno en una línea y controles visibles** en conversaciones, tablas, candidatos, Markdown y rutas de `messages download`. Se limpian caracteres de control/dirección en nombres. Solo `http`, `https` se convierten en enlaces Markdown.
- **Autocompletado inserta solo números** de chat/persona, mostrando nombre aparte: títulos y `@имя` pertenecen a terceros y no deben ejecutarse en la shell.
- **`max cache clear` sin perfil limpia el predeterminado y respeta `MAX_PROFILE`.**
- **Publicación más estricta.** Dependencias exactas; compilación limpia sin auxiliares de pruebas; publicación separada sin instalar ni ejecutar dependencias.

## 0.10.0 — 25.09.2026

### Novedades

- **`max doctor report`, `max doctor report create` preparan informes.** La primera explica contenido; la segunda crea archivo sin texto y pasos de envío. Aquí por correo; desde 0.11.0 por GitHub ([Problemas](./troubleshooting.md#как-сообщить-о-проблеме)).
- **`max backup messages <чат> --since <дата> | --last <n>` completa historia local.** Sin `--run` solo estima. Con él, páginas de 30, pausas, máximo 40 páginas por ejecución; reanuda ([Archivo](./archive.md#скачать-историю)).
- **`max doctor` indica la versión web que representa `max`**, avisando si tiene más de 60 días: MAX puede rechazar clientes antiguos ([Problemas](./troubleshooting.md)).
- **`max server start|stop|status|restart` administra el servidor** como entidad separada, igual que `max session`. `status` muestra actividad, inicio, versión y conexión, sugiriendo `restart` si está atrasado. `max serve --detach`, `--stop` siguen funcionando ([Servidor](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch)).
- **Lectura con los cinco campos de la web** e inicio con 15 chats, resto en una petición; antes 40 y un campo extra. Reduce diferencias frente al navegador. El listado no cambia; comprobado en canal no leído: leer no marca leído.
- **Dispositivo según el equipo:** zona, idioma y SO propios como el navegador; antes todos eran Chrome/Linux/Madrid.
- **`max serve` envía un evento de servicio como una pestaña oculta:** lista de chats mostrada, 20 segundos después de entrar. Solo número de cuenta y hora, sin títulos/textos. Las órdenes puntuales no lo envían ([Seguridad](./security.md#что-уходит-в-сеть)).
- **Nombres de carpeta mayores de 20 caracteres se rechazan localmente**, antes llegaban a MAX y fallaban.

### Cambios que pueden afectar a scripts

- **Un rechazo por demasiados inicios no provoca nuevos intentos.** Código `8` y pausas de 1 minuto, 5, 30, una hora, 6 horas, un día. El servidor se detiene ante cualquier rechazo; antes repetía cada minuto indefinidamente. Scripts reciben `8` hasta acabar la pausa: respeta el plazo del error ([Problemas](./troubleshooting.md)).

### Correcciones

- **Un almacén inaccesible no se confunde con falta de sesión.** Si ya hubo entrada pero falta token, por ejemplo en cron, `max` y `max doctor` señalan las claves, no recomiendan otra sesión que añadiría otro dispositivo ([Recetas](./recipes.md)).
- **Fallos guardados sin `--record`.** Incluyen clave MAX (p. ej. `login.token`), códigos de aviso, punto del fallo, entorno y SO; sin textos. Servidor: JSON con hora ([Diagnóstico](./diagnostics.md)).
- **`max chats read --until` solo marca hasta el mensaje indicado**, no hasta ahora ni mensajes más nuevos. Igual para `messages list --mark-read`. Antes podían aparecer leídos mensajes no vistos.

## 0.9.0 — 25.09.2026

### Novedades

- **`max` habla como la web:** dirección, tramas binarias, compresión y dispositivo con versiones nuevas de app/navegador; antes texto en formato antiguo. Reduce diferencias; voz y videonotas requieren bytes que el formato antiguo no podía transmitir. Órdenes y resultados iguales. Voz aún futura. El inicio sigue recibiendo todos los chats, no solo cambios, con tráfico extra.
- **`max serve` iniciado por comando se reinicia tras actualizar.** El iniciado a mano conserva código antiguo hasta `max serve --stop` y nuevo inicio.

## 0.8.0 — 25.09.2026

### Novedades

- **`max messages transcribe <чат> <id>` reconoce voz localmente.** La grabación no sale. `max models audio list` muestra idiomas; `max models audio download <id>` descarga y verifica. MCP: `max_messages_transcribe` ([Voz](./usage.md#голосовые-в-текст)). Descarga única a petición; texto en la copia, sin necesidad de repetir red o modelo.
- **Una conexión por perfil.** Comandos, `max mcp`, `max watch` comparten `max serve`, reduciendo inicios con un token y cierres por MAX. `max session start` detiene, entra y reinicia ([Servidor](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch)).
- **`max serve --detach` inicia en segundo plano** y responde tras conectar; **`max serve
  --stop` detiene**. Uno iniciado a mano solo se detiene con Ctrl-C/`--stop`; `max
  session end` no lo toca.
- **`allow` limita acciones.** `max work config set allow send,reaction` permite enviar y reaccionar. Doce nombres de `send` a `sessions`. Sin lista todo permitido. Lo prohibido falla con `5` antes de conectar, indicando cómo permitirlo. `max mcp` oculta herramientas prohibidas ([Permisos](./usage.md#что-профилю-можно)).
- **`max messages send … --at <время>` programa.** MAX envía aunque el equipo esté apagado; `2026-09-25T09:00` local, `30m`, `2h`, `1d`. `max messages scheduled <чат>` lista espera; MCP `at` de `max_messages_send`, `max_messages_scheduled`. Cancelación solo en MAX ([Programar](./usage.md#отправить-позже)).
- **`max chats read <чат>`, `max messages list … --mark-read` marcan explícitamente.** MCP: `max mcp --allow-mark-read`. El otro ve la marca; lectura ordinaria no la cambia ([Lectura](./usage.md#чтение)).
- **`max export messages <чат> --format jsonl|md` exporta localmente**, con `--since`, `--output`, sin MAX. Lo ausente se avisa en stderr; `--output` crea archivo privado ([Exportación](./archive.md#выгрузить-в-файл)).
- **`max messages delete <чат> <id…> --allow-dangerous` borra hasta 10**, solo para ti salvo `--for-everyone`; MCP `max mcp --allow-delete`, solo personal. Sin `--allow-dangerous` falla; cada mensaje consume `sendsPerHour` ([Borrar](./usage.md#удаление)).

### Correcciones

- **Actualizar `max` conserva la historia.** Antes un cambio de estructura borraba todo; ahora migra mensajes. Este lanzamiento también cambia la estructura y conserva historia; chats/personas se renuevan al entrar.
- **Tras rechazo del servidor, los comandos esperan 10 minutos sin crear otro.** Antes cada orden reiniciaba intentos rechazados. `max session
  start` elimina la espera.
- **`max watch` ve los envíos propios de `max`.** MAX no los devuelve a la conexión emisora; antes se perdían.
- **Comandos concurrentes no pierden el registro de entrada.** Antes dos de tres mostraban «the local record did not take this login» sin guardar chats/personas/sincronización. Ahora esperan a la primera escritura.

### Seguridad

- **Los errores no controlan el terminal.** Tras mensajes, nombres y tablas en 0.7.0, los errores muestran `\x1b` visible. Pueden repetir entrada del usuario o respuestas MAX.

## 0.7.0 — 24.09.2026

### Novedades

- **`max reactions remove <чат> <id>` retira tu reacción.**
- **Grupos y canales bajo `max chats`:** inspeccionar invitación, entrar, salir, crear, añadir/expulsar, administrar, renombrar, ajustes y renovar enlace. Las solicitudes se retiraron en 0.17.0 porque MAX no las tiene. Los cambios son visibles y pasan los controles de envío ([Grupos](./usage.md#группы-и-каналы)).
- **`max update` actualiza con el gestor de instalación**, `--check` solo comprueba. Aviso diario solo para personas en terminal, nunca agentes/scripts. Desactiva con `updateCheck: false` en `defaults` ([Actualizar](./installation.md#обновление-и-удаление)).
- **Tab en zsh/bash/fish/PowerShell:** `source <(max complete zsh)`, órdenes, indicadores, valores, chats/personas locales sin MAX ([Autocompletar](./installation.md#автодополнение)).
- **`max mcp` conecta el perfil por MCP** para clientes sin terminal, como Claude Desktop, o mediante MCP en Cursor ([MCP](./mcp.md)). Solo lectura sin `--allow-send`; envío con controles de `max messages send`.
- **`max mcp --allow-send --confirm-send` muestra destino y texto** antes de enviar. Sin tu sí no envía; cliente sin formularios falla ([Confirmación](./mcp.md#подтверждение-формой-от-самого-сервера)).
- **`max messages send … --file <путь>` envía fotos/archivos**, varias fotos en un mensaje.

### Seguridad

- **El texto ajeno no controla el terminal.** Mensajes, nombres, títulos, archivos o reacciones podían borrar líneas y sobrescribir salida de `max`. Ahora controles como `\x1b` se muestran visibles en conversaciones, tablas, errores y Tab. JSON no cambia: ya los escapaba.

## 0.6.0 — 24.09.2026

### Novedades

- **`max commands --json` describe órdenes, argumentos, indicadores y códigos en una respuesta**, cambios MAX con `mutates: true`. Evita pedir `--help` por comando. Funciona sin sesión incluso con ajustes rotos.
- **`max messages send … --reply-to <id>` responde.**
- **`max messages send … --markdown` o `--md` da formato:** `**жирный**`, `_курсив_`, `~~зачёркнутый~~`, `` `код` ``. Sin indicador, literal.
- **`max reactions add <чат> <id> <эмодзи>` sustituye tu reacción.**
- **Reacciones en lectura:** `messages list`, `show`, `context` muestran `👍 3  🔥 1  (you: 🔥)`, JSON `reactions`. Una petición adicional por página, solo lectura. `--offline` no tiene reacciones (`null`) porque no se guardan.
- **Registro y destinatarios.** Cada intento sin texto en `max sends list`. Lista opcional `max recipients add|remove|list|off`; destinatario no autorizado código `7`, perfil `readOnly` código `5`. Alcance: [Seguridad](./security.md).
- **`max session start qr | qr-chrome | sms | token` permite entrar sin copiar token.** `qr` dibuja en terminal o abre navegador si es estrecho. `qr-chrome`, `sms` abren web.max.ru en ventana aparte de Chrome/Chromium/Edge/Brave. Sin método sigue token manual o stdin.

### Cambios que pueden afectar a scripts

- **Límite por hora: 30 mensajes por defecto (`sendsPerHour`).** `max messages send` falla con `8` al excederlo; antes no había límite. Aumenta el ajuste si un script necesita más.

## 0.5.0 — 24.09.2026

### Novedades

- **`max messages download <чат> <id> [--output <каталог>]` guarda foto, archivos, vídeo/audio** sin sobrescribir.
- **`max config set <настройка> <значение>`, `max config unset <настройка>` editan ajustes**, `--defaults` para todos; nueva sección `defaults` para perfiles sin valor propio.
- **`max chats list --unread` filtra no leídos.**
- **`max messages list <чат> --after <id|время>` lee hacia delante**, después de mensaje/tiempo; próxima página con `--after <id самого нового>`.
- **`max chats show <чат>` y `max contacts show <человек>`** muestran chat con miembros o persona por ID/@username/nombre y chats comunes. Nombres ambiguos enumeran candidatos, no se adivinan.
- Todo lo nuevo aquí solo lee, sin enviar ni marcar.

### Correcciones

- **`--offline` funciona.** Antes no llegaba a comandos y leían MAX; `max --offline messages send` **enviaba realmente**. Ahora lectura local; envío/descarga offline prohibidos. Si usaste `--offline messages send` en 0.4.0 o anterior, el mensaje se envió.
- **Errores de configuración claros:** ajuste desconocido, disponibles y valores admitidos, no mensajes de biblioteca.
- **Un fallo de `--record` no derriba la orden.** Aviso stderr, respuesta/código sin cambios; visible incluso con `--quiet`.

### Seguridad

- **Publicación desde GitHub Actions con procedencia npm**, para verificar el repositorio de compilación.

## 0.4.0 — 23.09.2026

### Novedades

- **`max messages show <чат> <id>` muestra uno; `max messages context <чат> <id>` con `--before`, `--after` muestra contexto.** Marcado `◀` y `"anchor": true`. Si falta, «no encontrado», no el vecino.
- **`max skill show` imprime instrucciones incluidas:** `max skill show > ~/.claude/skills/max-cli/SKILL.md`.
- **`max config show` explica perfil/origen**, archivo/existencia, todos los perfiles incluso solo de estado, ajustes y fuente (indicador, variable, archivo, integrado). `MAX_CONFIG_DIR` y similares avisan de entrada de claves distinta.
- **Texto mediante pipe:** `echo "текст" | max messages send <чат>`, sin argumento lee stdin. Evita `ps`/historial y permite saltos de línea.
- **`--timeout <срок>` limita toda la ejecución**, conexión, entrada y solicitud, no una respuesta.
- **`max doctor` revisa dependencias sin MAX:** fuente del token sin revelarlo, número/último inicio, perfiles, estructura de base y entrada de claves. Funciona con todo roto; falta de sesión es dato, no error.

### Cambios que pueden afectar a scripts

- **`--query` pasa a `--search`.** Ya cambió en 0.3.0 sin anotarlo. Los scripts deben sustituirlo.

### Correcciones

- **`messages list --before <id>` no requiere lectura previa**, obtiene tiempo del ID.
- **Miembros con nombres, no números.** Antes solo contactos tenían nombre; ahora una petición obtiene y guarda todos, incluidos autores de respuestas/reenvíos.
- **La publicación no se detiene antes de crear el tag.** Ocurrió dos veces; ahora verifica npm sin caché y espera hasta tres minutos.

## 0.3.0 — 22.09.2026

### Novedades

- **Conversaciones como transcripción:** divisores diarios, `время  автор`, texto alineado y ajustado al terminal. `вы` eres tú; sin nombre aparece ID. `↳` responde, `↪` reenvía; MAX entrega originales completos y se guardan.
- **`-v`, `-vv` añaden detalle:** IDs de mensaje/autor/chat y URLs; después todo lo conocido.
- **`--jsonl` da objeto JSON por línea**, para streaming y `jq`.
- **Adjuntos como enlaces:** `📎 photo`, `📎 photo ×3 1 2 3`, `📎 файл.pdf · 24 MB`; JSON `url`, `width`, `height`, `title`. El enlace de foto no requiere sesión: quien lo recibe puede verla.
- **`senderColors: true` da color por autor**, desactivado por defecto.

### Cambios que pueden afectar a scripts

- **`-v` significa detalle; versión con `max -V`.** **`--trace`**, antes `--verbose`, activa peticiones stderr. Los scripts que usaban `max -v` para la versión deben cambiar a `-V`; adapta también el antiguo `--verbose`.
- **`--query` pasa a `--search`**, inicialmente no anotado.
- **La copia local pasa a estructura 4 y se reconstruye.** Esta versión no conserva la historia leída: debe leerse de nuevo.

### Correcciones

- **Nombres ambiguos enumeran candidatos con ID**, JSON `candidates`.
- **El aviso local indica estructura y solución**, antes solo `Error`.
- **Continuación de `messages list` sugiere `--before <id>`**, no el inexistente `--page`.

## 0.2.0 — 22.09.2026

### Novedades

- **`max messages send --silent` envía sin aviso.** Aún no se comprobó el comportamiento real porque exigiría escribir a una persona.
- **Intercambio del token al primer inicio.** MAX devuelve su token; `max` lo guarda en claves en lugar del pegado. Solo una vez.

### Correcciones

- **`max session start` no destruye el token válido.** Antes guardaba antes de validar y una errata lo sustituía; ahora valida y luego guarda.
- **Perfil vinculado al mismo usuario.** Token de otra cuenta se rechaza explicando por qué: evita actuar como otra persona.
- **La sugerencia tras envío incierto usa una orden real**, no `max send`.
- **No se descartan mensajes de la respuesta de entrada** por estructura mal descrita.

## 0.1.0 — 21.09.2026

Primera versión que se puede compartir.

### Novedades

- **Siete órdenes sobre MAX real:** `session start|end`, `account show`, `chats list`, `contacts list`, `messages list`, `messages send`.
- **Perfil primero:** `max personal chats list`. Cuentas independientes con token, estado y copia propios; también `MAX_PROFILE`.
- **Token en el almacén del sistema**, no archivo ni argumento. Aún sin entrada por teléfono: `max session start` obtiene el del cliente oficial.
- **Modo máquina:** `--json` da un valor en stdout, también automáticamente sin terminal. Error stderr, stdout vacío. Decide por código de salida: [Referencia `docs/commands.md`](./commands.md).
- **Diagnóstico sin contenido:** `--verbose` petición por línea; `--record` conserva 30 días; `max runs list|show|path` lee. Por defecto nada registrado.
- **Copia local:** lecturas guardadas; `--offline` sin conexión; `max cache clear` elimina.
- **`~/.config/max-cli/config.json`**, prioridad indicador → variable → archivo → integrado. Erratas son errores explícitos.
- **Node 22+ y Bun 1.3+**, ambos comprobados en CI.
- **Leer no marca leído.** Obtener historia y marcar son operaciones distintas; la segunda nunca se envía, verificado con prueba.
- **Resultado de envío honesto:** sin respuesta `outcome_unknown` (`14`), sin afirmar fallo/éxito. Repite solo con el mismo `--cid` para evitar doble envío.
- **Protocolo MAX no oficial por ingeniería inversa**, separado de Bot API. Puede cambiar sin aviso; se informa con una línea stderr, no falla en silencio.
- **Aún sin** teléfono, adjuntos, reacciones, ediciones, grupos, historias ni llamadas: solo texto. No habrá envíos masivos con la cuenta personal.
