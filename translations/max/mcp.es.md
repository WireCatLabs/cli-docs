---
title: "Servidor MCP"
---

`max mcp` expone un perfil al agente mediante [MCP](https://modelcontextprotocol.io), por stdin/stdout de forma predeterminada. `--http --public-url` expone herramientas en un puerto local detrás de tu túnel HTTPS. El servidor se instala con `max`; no requiere instalación adicional.

**Cuándo hace falta.** Claude Code, Codex y otros agentes con terminal pueden usar `max` directamente con las [instrucciones del agente](https://github.com/leemour/max-cli/blob/v0.29.0/README.md#для-скриптов-и-агентов). MCP sirve para clientes sin terminal, como Claude Desktop o el chat de Cursor, y para quienes quieren pedir permiso antes de cada envío. ChatGPT y Claude en el navegador se conectan mediante `--http`: consulta [remote.md](./remote.md).

## Conexión

Los bots tienen su propio servidor, `max <имя> bot mcp` ([bot.md](./bot.md#бот-для-агента-mcp)). El acceso depende de `permissions` del perfil del bot. Sus opciones `--allow-send`, `--allow-delete` y `--allow-moderate` se aceptan con aviso, pero no activan nada. Abajo se explican los permisos personales y las opciones de confirmación; las antiguas opciones de acceso no otorgan permisos.

Primero ejecuta `max setup --agent none` en el terminal local: MCP no inicia sesión. Eso conecta la cuenta de MAX; `max mcp setup`, más abajo, configura aparte el cliente MCP. El agente puede leer `max skill show` antes de iniciar sesión.

**Codex o Claude Code en este equipo:**

```sh
max mcp doctor                 # проверяет запуск MCP и список инструментов
max mcp setup codex           # добавляет сервер в Codex
max mcp setup claude-code     # или в Claude Code
```

Para otro perfil, escribe primero su nombre: `max work mcp setup codex`. La instalación utiliza el propio cliente y no modifica otros servidores. Si ya hay una entrada con ese nombre, elimínala en el cliente antes de repetir. Si el perfil ofrece herramientas de escritura, revisa primero los permisos y repite con `--allow-writes`. Esta opción solo confirma la instalación; no cambia los permisos ni opciones como `--allow-send`.

`mcp doctor` no lee mensajes ni inicia sesión en MAX: confirma que MCP arranca, no que la sesión sea válida. `potentialWrites` cuenta herramientas sin declaración de solo lectura. El navegador y el móvil necesitan [conexión remota](./remote.md).

**Claude Code:**

```sh
claude mcp add max -- max mcp
```

Con un perfil, su nombre va primero:

```sh
claude mcp add max-work -- max work mcp
```

**Claude Desktop, Cursor y otros:** `max` imprime la entrada para su configuración:

```sh
max mcp config                  # права текущего профиля
max work mcp config --confirm-send
```

```json
{
  "mcpServers": {
    "max": {
      "type": "stdio",
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": ["C:\\Users\\you\\AppData\\Roaming\\npm\\node_modules\\@leemour\\max-cli\\dist\\bin\\max.js", "mcp"]
    }
  }
}
```

Pega la entrada en `mcpServers` del cliente: para Claude Desktop, `%APPDATA%\Claude\claude_desktop_config.json` en Windows o `~/Library/Application Support/Claude/claude_desktop_config.json` en macOS; para Cursor, `~/.cursor/mcp.json`. El comando no escribe archivos.

Las rutas de la entrada son absolutas: un cliente iniciado fuera de la terminal no ve su `PATH` y, en Windows, `max` es un archivo `max.cmd` que un cliente sin shell no puede ejecutar. Se copian `--allow-send` y otras opciones a la entrada. `MAX_CONFIG_DIR`, `MAX_STATE_DIR` y `MAX_CACHE_DIR` se incluyen solo si están definidos; nunca se incluye el token. `MAX_CACHE_DIR` corresponde al caché antiguo; `MESSAGING_STORE` selecciona el archivo compartido. Si la terminal define `MESSAGING_STORE`, añade el mismo valor manualmente a `env` de MCP: `max mcp config` no lo copia. De lo contrario, un cliente abierto desde el escritorio podría abrir otro archivo y la búsqueda local o un locator no encontrarían los datos guardados.

Con Node instalado mediante nvm, fnm o Volta, la ruta pertenece a una versión: vuelve a ejecutar `max mcp config` tras cambiarla. Desde `npx` se rechaza, porque la caché de `npx` puede borrarse y desaparecer la ruta.

⚠ **`MAX_CONFIG_DIR`, `MAX_STATE_DIR` y `MAX_CACHE_DIR` cambian dónde se busca la sesión.** Si están definidas en la terminal y no en MCP, o viceversa, el servidor responderá que no hay sesión aunque `max` funcione en la terminal. Utiliza los mismos valores en ambos o no las definas.

## Los permisos del perfil controlan las herramientas

CLI y MCP comparten `permissions`. `deny` oculta la herramienta; `readonly` muestra solo las de lectura. Con `ask`, las escrituras exigen formulario; con `allow`, se ejecutan sin preguntar. La mayoría de escrituras están permitidas por defecto, incluidos envíos y cambios de contactos, grupos y perfil. Eliminar mensajes exige confirmación por defecto.

En el modo stdin/stdout, este ejemplo permite leer y eliminar sin formulario, y prohíbe enviar y editar. Por HTTP, eliminar también exige formulario:

```sh
max work config set permissions.messages readonly
max work config set permissions.messages.delete allow
```

Los demás recursos conservan sus permisos. La lista de destinatarios y `sendsPerHour` se aplican en todos los niveles. La herramienta compartida de eliminación solo borra para el propietario; el agente no puede cerrar otras sesiones ni acceder a secretos de acceso.

### Formulario de confirmación del servidor

```sh
claude mcp add max -- max mcp --confirm-send
```

`--confirm-send` muestra un formulario antes de cada escritura, incluso con permiso `allow`. Sin él, el modo stdin/stdout solo necesita formulario para `ask`. `--yes` confirma las demás acciones `ask`; `--allow-dangerous` confirma el borrado de mensajes y las acciones de moderación que lo exigen. Estas opciones no evitan `deny`, `readonly`, la lista de destinatarios ni el límite. Los cambios locales de conversaciones, etiquetas y consultas guardadas con `ask` o `--confirm-send` se rechazan antes de escribir: los ejecuta el propietario mediante el CLI.

El formulario queda ligado a la herramienta, el chat y los parámetros mostrados. La respuesta vale una vez y durante cinco minutos; sustituir parámetros después se rechaza. Una negativa del propietario o un cliente sin formularios no escriben nada. La moderación también aplica los niveles de sus reglas: `readonly` solo informa del resultado y `ask` exige formulario.

Los antiguos `--allow-send`, `--allow-mark-read`, `--allow-delete` y `--allow-moderate` se siguen aceptando con aviso, pero no dan permisos. `mcpTools` ya no limita las herramientas. Convierte un archivo antiguo con `max config migrate --dry-run` y después `max config migrate`.

## Herramientas

| Herramienta | Comando | Qué hace |
|---|---|---|
| `max_inbox` | `max inbox`, `--since-time` | mensajes sin leer o posteriores a un momento, en una llamada; `transcribe` transcribe voz; no marca nada; `new` guarda puntos propios de MCP, separados de `max inbox --new`; incompatible con `since_time`; `kinds` elige tipos de chat; omite silenciados y archivados sin avisar al propietario; `all: true` los incluye |
| `max_review` | `max review` | todos los mensajes, incluidos propios, en chats activos desde `since_time` (3 días por defecto) para revisar compromisos; `transcribe` transcribe voz; `chat` filtra uno; `unanswered` filtra preguntas que ni tú ni los administradores habéis respondido en esas horas; omite silenciados y archivados sin avisar al propietario; `all: true` los incluye; no marca como leído; `kinds` elige tipos de chat, `new` guarda puntos propios y es incompatible con `since_time` y `unanswered` |
| `max_account_show` | `max account show` | identidad de la sesión |
| `max_status` | `max doctor` | perfil, existencia de token y sesión y herramientas de escritura activas; no se conecta a MAX |
| `max_chats_list` | `max chats list` | chats con filtros de nombre, tipo y no leídos |
| `max_chats_members_audit` | `max chats members audit` | miembros con señales de cuentas sospechosas; no elimina a nadie, las señales desconocidas se indican en `unknown` |
| `max_chats_stats` | solo MCP | estadísticas de un grupo o canal en un periodo, desde el archivo local; no consulta los miembros y no incluye `members`; con `complete: false` las cifras son un límite inferior |
| `max_chats_show` | `max chats show` | un chat, miembros y configuración |
| `max_chats_events` | `max chats events` | entradas, salidas, añadidos y eliminados según mensajes de servicio; últimos 7 días sin `since_time` |
| `max_chats_members` | `max chats members list` | todos los miembros del grupo o canal según MAX, con creación de cuenta y última conexión |
| `max_chats_rules_show`, `max_chats_moderate` | `max chats rules show`, `max chats moderate` | reglas canónicas y moderación; una acción de nivel `ask` solo se planifica para el propietario |
| `max_chats_rules` | `max chats rules show` | reglas de moderación; solo tú puedes cambiarlas mediante comando |
| `max_contacts_list` | `max contacts list` | personas con chat individual |
| `max_contacts_show` | `max contacts show` | persona y chats compartidos |
| `max_contacts_profile` | `max contacts profile` | lo que MAX indica de una persona y sus mensajes en cada chat común; solo muestra las cuatro últimas cifras del teléfono |
| `max_account_sessions` | `max account sessions list` | lista de dispositivos sin secretos de acceso |
| `max_contacts_lookup` | `max contacts lookup` | busca por teléfono sin añadir el contacto; no devuelve el teléfono |
| `max_chats_members_list`, `max_chats_members_show` | `max chats members …` | miembros con paginación y un miembro concreto |
| `max_chats_link`, `max_chats_link_revoke` | `max chats link …` | invitación y su revocación según los permisos del perfil |
| `max_chats_folders_*` | `max chats folders …` | listar, crear, cambiar y eliminar carpetas |
| `max_chats_update`, `max_chats_settings` | `max chats update`, `settings` | nombre y configuración del grupo |
| `max_polls_show` | `max polls show` | encuesta y opciones de respuesta |
| `max_messages_evidence` | `max messages evidence` | paquete de mensajes del archivo de la cuenta actual, sin conectarse |
| `max_messages_stats` | `max messages stats` | recuento de coincidencias en el archivo local; `saved` ejecuta una consulta guardada o una ejecución anterior |
| `max_conversations_batches_status`, `max_conversations_batches_next` | `max conversations batches …` | volumen y lotes limitados para el agente; lectura tras el consentimiento del propietario |
| `max_conversations_links_add`, `max_conversations_links_clear`, `max_conversations_build` | `max conversations links …`, `build` | guardar o quitar enlaces del agente, reconstruir el grafo; `conversations.links` |
| `max_attachments_list`, `max_attachments_text_set` | `max attachments list`, `text set` | rutas y estado del texto; guardar el texto del agente para `content:` |
| `max_conversations_status`, `max_conversations_refresh` | `max conversations status`, `search --refresh` | estado del índice y actualización local; escribe según `conversations.embed` |
| `max_conversations_related` | `max conversations related` | conversaciones similares según los vectores guardados, sin ejecutar el modelo |
| `max_conversations_list`, `max_conversations_show`, `max_conversations_search` | `max conversations …` | conversaciones del archivo local ya construido; búsqueda por palabras y por el modelo instalado |
| `max_messages_list` | `max messages list` | mensajes; `transcribe` transcribe voz; no marca como leído |
| `max_messages_search` | `max messages search` | buscar mensajes ya leídos en este ordenador; `saved` ejecuta una consulta guardada o una ejecución anterior |
| `max_contacts_context` | `max contacts context` | lo que el archivo sabe de una persona en los mensajeros vinculados; mismos permisos que al leer mensajes |
| `max_tags_list`, `max_tags_add`, `max_tags_remove` | `max tags …` | tus etiquetas de chats, personas y mensajes; solo se guardan en este ordenador |
| `max_searches_list`, `max_searches_history`, `max_searches_create`, `max_searches_delete`, `max_searches_clear` | `max searches …` | consultas guardadas e historial de búsqueda; no se guardan resultados |
| `max_messages_link` | `max messages link` | locator de un mensaje archivado, sin conectar ni devolver texto |
| `max_messages_context` | `max messages show`, `context` | mensaje y contexto |
| `max_messages_photo` | `max messages download` | foto como imagen hasta 512 KB; rechaza archivos, vídeo, voz y fotos mayores indicando cómo guardarlos; no entrega enlaces de foto |
| `max_messages_scheduled` | `max messages scheduled` | mensajes pendientes con `scheduledFor` |
| `max_messages_transcribe` | `max messages transcribe` | transcripción local de voz |
| `max_messages_send` | `max messages send` | enviar según los permisos del perfil; `at_time` programa, como `--at-time`; `reply_to` responde a un mensaje y `md` activa formato; `file` o `photo` adjunta un archivo con el texto como pie |
| `max_messages_edit` | `max messages edit` | editar tu mensaje según los permisos del perfil |
| `max_messages_forward` | `max messages forward` | reenviar a otro chat según los permisos; `silent` evita la notificación |
| `max_messages_pin` | `max messages pin` | fijar en un grupo o canal según los permisos; sin notificación salvo que pases `notify` |
| `max_messages_unpin` | `max messages unpin` | desfijar; exige `message`, pero MAX desfija el único mensaje fijado independientemente del número; aplica los permisos del perfil |
| `max_reactions_add` | `max reactions add` | añadir una reacción según los permisos `reactions` |
| `max_reactions_remove` | `max reactions remove` | retira tu reacción con los mismos requisitos |
| `max_polls_vote` | `max polls vote` | votar o retirar el voto según los permisos del perfil |
| `max_polls_create` | `max polls create` | crear una encuesta según los permisos del perfil |
| `max_chats_mark_read` | `max chats mark-read` | marcar un chat como leído según `chats.mark-read` |
| `max_messages_delete` | `max messages delete` | eliminar para el propietario según `messages.delete` |
| `max_chats_check` | `max chats moderate` | comprobar las reglas y ejecutar lo permitido según `chats.moderate` y el nivel de cada acción |
| `max_contacts_*`, `max_polls_close`, `max_chats_join` y otros | `max contacts …`, `max polls close`, `max chats …`, `max account update` | según los permisos del recurso correspondiente |

`max_review` considera las transcripciones guardadas y nuevas antes de filtrar preguntas. Una grabación sin reconocer deja la revisión incompleta; el `text` original no cambia.

Las listas usan `{ items, page, limit, hasMore }`; los ids son cadenas. Los argumentos de las herramientas comunes coinciden con Telegram: `since_time`, `before_n`/`after_n`, `at_time`, `md`; `send_id` es una cadena decimal. Un argumento desconocido se rechaza antes de ejecutar, así que el antiguo `at` no enviará el mensaje de inmediato. `max_chats_check` y `max_chats_rules` siguen como nombres compatibles; los nombres principales son `max_chats_moderate` y `max_chats_rules_show`.

Los errores son `{ error: { code, message, … } }`, con los mismos códigos del CLI. Un nombre ambiguo devuelve `candidates` y no envía nada.

`at_time` de `max_messages_send` sigue `--at-time`: fecha local `2026-09-25T09:00` o `30m`, `2h`, `1d`, entre un minuto y un año, redondeando hacia abajo al minuto. Rechaza `silent` y `send_id`. Cuenta en la hora del envío. El formulario de `--confirm-send` muestra la hora. Sin respuesta no reintenta; consulta `max_messages_scheduled`.

## Prompts y chats mediante `@`

El servidor ofrece cinco instrucciones preparadas: comandos con `/` en Claude Code:

| Prompt | Argumento | Qué hace el agente |
|---|---|---|
| `catch-up` | `kind`, `mode`: opcionales | llama a `max_inbox`; `mode` es `unread` (por defecto), `new` o un momento; `kind` elige el tipo de chat; marcar como leído exige una confirmación aparte |
| `reply` | `chat` | lee, prepara borrador y solo envía tras aprobar ese texto |
| `link-conversations` | ninguno | primero volumen y consentimiento del propietario, después lotes, enlaces y reconstrucción del grafo |
| `review` | `since`, `groups`: opcionales | llama a `max_review`, clasifica tus compromisos, lo esperado y dudas con identificadores; antes de marcar vencido busca si se cumplió en grupos; recordatorios en borrador hasta aprobar; indica `since` para continuar |
| `find` | `text` | busca persona o palabras y muestra contexto; no envía |

La respuesta `reply` se envía mediante `max_messages_send`; si no se permite escribir, el agente solo muestra el borrador.

Los chats son recursos `max://chat/<id>`, mencionables con `@` en Claude Code. Devuelven chat y mensajes recientes. La lista procede de `messages.db` bajo la cuenta del perfil, sin conectarse a MAX; si no hay copia local, está vacía. Solo leer un chat se conecta.

`max://skill` contiene la skill de `max`, igual que `max skill show`. Está disponible en `max mcp` y `max bot mcp`, sin conectarse a MAX.

## Cómo mantiene la conexión

La primera llamada que necesita MAX abre la conexión; las siguientes llamadas de red la reutilizan. La búsqueda local, las estadísticas, las pruebas y la lectura de datos guardados no requieren iniciar sesión. La conexión se cierra tras 2 minutos sin llamadas y siempre a los 5 minutos, porque la lista de chats procede del inicio de sesión y podría quedar obsoleta. La siguiente llamada vuelve a conectar. Las llamadas se ejecutan una a una aunque lleguen simultáneamente.

Los temas de Telegram no existen en MAX, así que no hay herramientas `max_topics_*`. El reconocimiento directo puede devolver la transcripción guardada del mismo modelo; la foto usa la vista previa de MAX, se elige con `index` y está limitada a 512 KB. Los modelos nunca se descargan automáticamente. Antes del reconocimiento local, el servidor libera la conexión; el modelo de búsqueda se cierra al terminar el servidor.

En el modo stdin/stdout, el servidor termina al cerrar stdin el cliente y cierra la conexión con MAX. HTTP funciona hasta Ctrl-C.

`max mcp --http --public-url https://<имя>.ts.net` está disponible a través de tu túnel HTTPS, con acceso mediante un código del terminal. Por HTTP, cada escritura exige formulario, sea cual sea `allow`, `--yes` o `--allow-dangerous`. `max mcp --revoke` cierra los accesos de las aplicaciones y conserva la sesión de MAX. Consulta la [conexión desde el navegador](./remote.md).

Las escrituras locales de tags/searches y las actualizaciones de conversaciones con ask se rechazan sin formulario. Con --confirm-send o HTTP devuelven confirmation_required si el formulario no puede vincularse a la acción; nada cambia. Los datos pueden leerse con readonly.

Mediante MCP, el agente recibe la instrucción `link-conversations`, estima el volumen con `max_conversations_batches_status` y espera el consentimiento del propietario para ese chat. Después lee `max_conversations_batches_next`, guarda las respuestas con `max_conversations_links_add` y reconstruye el grafo con `max_conversations_build`. `max_conversations_links_clear` borra las respuestas del agente; después también hay que reconstruir el grafo. La escritura requiere `conversations.links`. Los ajustes de vectores externos también se aplican a la búsqueda MCP: la pregunta se envía al proveedor elegido.

`max_attachments_list` muestra rutas y estado del texto; `max_attachments_text_set` guarda el texto del agente para `content:`. La extracción se realiza con el CLI. `messages_context` admite `offline: true` para leer solo el archivo.
