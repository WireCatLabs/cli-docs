---
title: "Servidor MCP"
---
`max mcp` ofrece un perfil al agente mediante [MCP](https://modelcontextprotocol.io), por stdin y stdout, sin red. Viene incluido en `max`; no tienes que instalarlo por separado.

**Cuándo lo necesitas.** Claude Code, Codex y otros agentes con terminal pueden usar directamente `max` y las [instrucciones para agentes](https://github.com/leemour/max-cli/blob/v0.27.0/README.md#для-скриптов-и-агентов): no hay diferencia en tokens ni funciones. MCP sirve para clientes sin terminal, como Claude Desktop o el chat de Cursor, y para aprobar cada envío desde el cliente. ChatGPT y Claude en el navegador necesitan [acceso remoto](./remote.md).

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

Para que el agente lea y elimine mensajes sin formulario, pero no envíe ni edite:

```sh
max work config set permissions.messages readonly
max work config set permissions.messages.delete allow
```

Los demás recursos conservan sus permisos. La lista de destinatarios y `sendsPerHour` se aplican en todos los niveles. La herramienta compartida de eliminación solo borra para el propietario; el agente no puede cerrar otras sesiones ni acceder a secretos de acceso.

### Formulario de confirmación del servidor

```sh
claude mcp add max -- max mcp --confirm-send
```

`--confirm-send` muestra un formulario antes de cada escritura, incluido `allow`. Sin esta opción, solo `ask` requiere formulario. Iniciar con `--yes` confirma las demás acciones `ask`; `--allow-dangerous` confirma la eliminación de mensajes y las acciones de moderación que lo requieren. Estas opciones no evitan `deny`, `readonly`, la lista de destinatarios ni el límite.

El formulario queda ligado a la herramienta, el chat y los parámetros mostrados. La respuesta vale una vez y durante cinco minutos; sustituir parámetros después se rechaza. Una negativa del propietario o un cliente sin formularios no escriben nada. La moderación también aplica los niveles de sus reglas: `readonly` solo informa del resultado y `ask` exige formulario.

Los antiguos `--allow-send`, `--allow-mark-read`, `--allow-delete` y `--allow-moderate` se siguen aceptando con aviso, pero no dan permisos. `mcpTools` ya no limita las herramientas. Convierte un archivo antiguo con `max config migrate --dry-run` y después `max config migrate`.

## Herramientas

| Herramienta | Comando | Qué hace |
|---|---|---|
| `max_inbox` | `max inbox`, `--since-time` | mensajes sin leer o posteriores a un momento, en una llamada; `transcribe` transcribe voz; no marca ni cambia el punto de `max inbox --new`; incluye silenciados y archivados como `max inbox --all` |
| `max_review` | `max review` | todos los mensajes, incluidos propios, en chats activos desde `since` (3 días por defecto) para revisar compromisos; `transcribe` transcribe voz; `chat` filtra uno; `unanswered_after_hours` filtra preguntas pendientes para ti o administradores; incluye silenciados y archivados como `max review --all`; no marca como leído |
| `max_account_show` | `max account show` | identidad de la sesión |
| `max_status` | `max doctor` | perfil, existencia de token y sesión y herramientas de escritura activas; no se conecta a MAX |
| `max_chats_list` | `max chats list` | chats con filtros de nombre, tipo y no leídos |
| `max_chats_show` | `max chats show` | un chat, miembros y configuración |
| `max_chats_events` | `max chats events` | entradas, salidas, añadidos y eliminados según mensajes de servicio; últimos 7 días sin `since` |
| `max_chats_members` | `max chats members list` | todos los miembros del grupo o canal según MAX, con creación de cuenta y última conexión |
| `max_chats_rules` | `max chats rules show` | reglas de moderación; solo tú puedes cambiarlas mediante comando |
| `max_contacts_list` | `max contacts list` | personas con chat individual |
| `max_contacts_show` | `max contacts show` | persona y chats compartidos |
| `max_messages_list` | `max messages list` | mensajes; `transcribe` transcribe voz; no marca como leído |
| `max_messages_search` | `max messages search` | busca lo leído en este equipo |
| `max_messages_link` | `max messages link` | locator de un mensaje archivado, sin conectar ni devolver texto |
| `max_messages_context` | `max messages show`, `context` | mensaje y contexto |
| `max_messages_photo` | `max messages download` | foto como imagen hasta 512 KB; rechaza archivos, vídeo, voz y fotos mayores indicando cómo guardarlos; no entrega enlaces de foto |
| `max_messages_scheduled` | `max messages scheduled` | mensajes pendientes con `scheduledFor` |
| `max_messages_transcribe` | `max messages transcribe` | transcripción local de voz |
| `max_messages_send` | `max messages send` | enviar según los permisos del perfil; `at` programa, como `--at-time`; `reply_to` responde a un mensaje y `markdown` activa formato |
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

Las listas usan `{ items, page, limit, hasMore }`; los ids son cadenas. MCP y CLI pueden tener formatos distintos: `max_chats_events` conserva `since` (incluidos ids de mensaje) y `chatId`/`since`; `max_chats_members` conserva `chatId`/`rolesKnown` y no acepta paginación. Los parámetros y formatos nuevos de los comandos CLI se explican en [grupos](./groups.md). Los errores son `{ error: { code, message, … } }`, con los mismos códigos del CLI. Un nombre ambiguo devuelve `candidates` y no envía nada.

`at` de `max_messages_send` sigue `--at-time`: fecha local `2026-09-25T09:00` o `30m`, `2h`, `1d`, entre un minuto y un año, redondeando hacia abajo al minuto. Rechaza `silent` y `send_id`. Cuenta en la hora del envío. El formulario de `--confirm-send` muestra la hora. Sin respuesta no reintenta; consulta `max_messages_scheduled`.

## Prompts y chats mediante `@`

Ofrece cuatro prompts preparados; en Claude Code son comandos `/`:

| Prompt | Argumento | Qué hace el agente |
|---|---|---|
| `catch-up` | `since`: opcional | llama una vez a `max_inbox` y resume por chat; no envía |
| `reply` | `chat` | lee, prepara borrador y solo envía tras aprobar ese texto |
| `review` | `since`, `groups`: opcionales | llama a `max_review`, clasifica tus compromisos, lo esperado y dudas con identificadores; antes de marcar vencido busca si se cumplió en grupos; recordatorios en borrador hasta aprobar; indica `since` para continuar |
| `find` | `text` | busca persona o palabras y muestra contexto; no envía |

La respuesta `reply` se envía mediante `max_messages_send`; si no se permite escribir, el agente solo muestra el borrador.

Los chats son recursos `max://chat/<id>`, mencionables con `@` en Claude Code. Devuelven chat y mensajes recientes. La lista procede de `messages.db` bajo la cuenta del perfil, sin conectarse a MAX; si no hay copia local, está vacía. Solo leer un chat se conecta.

`max://skill` contiene la skill de `max`, igual que `max skill show`. Está disponible en `max mcp` y `max bot mcp`, sin conectarse a MAX.

## Cómo mantiene la conexión

La primera llamada se conecta a MAX y las siguientes reutilizan la conexión. Se cierra tras 2 minutos sin llamadas y siempre a los 5 minutos, porque la lista de chats procede del inicio de sesión y podría quedar obsoleta. La siguiente llamada vuelve a conectar. Las llamadas se ejecutan una a una aunque lleguen simultáneamente.

El servidor termina al cerrar stdin el cliente y cierra la conexión con MAX.
