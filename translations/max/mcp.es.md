---
title: "Servidor MCP"
---

`max mcp` ofrece un perfil al agente mediante [MCP](https://modelcontextprotocol.io), por stdin y stdout, sin red. Viene incluido en `max`; no tienes que instalarlo por separado.

**Cuándo lo necesitas.** Claude Code, Codex y otros agentes con terminal pueden usar directamente `max` y las [instrucciones para agentes](https://github.com/leemour/max-cli/blob/v0.24.0/README.md#для-скриптов-и-агентов): no hay diferencia en tokens ni funciones. MCP sirve para clientes sin terminal, como Claude Desktop o el chat de Cursor, y para aprobar cada envío desde el cliente. ChatGPT y Claude en el navegador necesitan [acceso remoto](./remote.md).

## Conexión

Los bots tienen su propio servidor, `max <имя> bot mcp` ([bots](./bot.md#бот-для-агента-mcp)). Sus permisos dependen de `readOnly` y `allow` del perfil del bot. `--allow-send`, `--allow-delete` y `--allow-moderate` se aceptan con avisos y no habilitan nada. Las opciones de `max mcp` descritas abajo corresponden a la cuenta personal y habilitan sus herramientas de escritura.

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
max mcp config                  # только чтение
max work mcp config --allow-send
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

Las rutas son completas porque los clientes iniciados fuera de la terminal no ven su `PATH`; en Windows, `max` es `max.cmd` y no puede iniciarse desde un cliente sin shell. La entrada incluye `--allow-send` y las demás opciones. Solo copia `MAX_CONFIG_DIR`, `MAX_STATE_DIR` y `MAX_CACHE_DIR` si están definidas; nunca el token. `MAX_CACHE_DIR` corresponde ahora solo a la caché antigua; `MESSAGING_STORE` indica la copia compartida.

Con Node instalado mediante nvm, fnm o Volta, la ruta pertenece a una versión: vuelve a ejecutar `max mcp config` tras cambiarla. Desde `npx` se rechaza, porque la caché de `npx` puede borrarse y desaparecer la ruta.

⚠ **`MAX_CONFIG_DIR`, `MAX_STATE_DIR` y `MAX_CACHE_DIR` cambian dónde se busca la sesión.** Si están definidas en la terminal y no en MCP, o viceversa, el servidor responderá que no hay sesión aunque `max` funcione en la terminal. Utiliza los mismos valores en ambos o no las definas.

## El envío está desactivado hasta habilitarlo

Sin opciones ni `mcpTools` en la configuración, el servidor es **de solo lectura**: no ofrece herramientas de escritura. Para habilitar envíos:

```sh
claude mcp add max -- max mcp --allow-send
```

Los envíos por MCP pasan por los mismos controles que `max messages send`: perfil de solo lectura, destinatarios permitidos, límite por hora y registro ([seguridad](./security.md)). La herramienta también se marca como peligrosa: VS Code y Cursor preguntan antes de cada llamada; según su documentación, Claude Code muestra confirmación aunque lo demás estuviera aprobado.

### Formulario de confirmación del servidor

```sh
claude mcp add max -- max mcp --allow-send --confirm-send
```

Con `--confirm-send`, el servidor muestra un formulario antes de toda acción visible para otros: enviar, editar, reenviar, fijar, reaccionar, votar, marcar como leído, eliminar y utilizar `mcpTools`. Muestra **el chat real**, título e identificador resueltos a partir del nombre, los demás argumentos y **el texto completo**. Solo actúa al pulsar Accept; no hay campos, solo un botón. El cliente muestra los argumentos del modelo (`chat: "Team"`); el formulario muestra qué autorizas («Team Alpha (111)»).

- Decline o cerrar el formulario no envía nada; el agente recibe `confirmation_required` y no debe reintentar.
- Los clientes sin formularios reciben un error: **no se envía nada**. Claude Code sí los muestra.
- La aprobación queda ligada al chat, texto y herramienta mostrados; cambiarlos después no ejecuta nada.
- Vale una sola vez durante 5 minutos; repetir la respuesta no envía nada.
- Sin `--allow-send`, `--allow-mark-read`, `--allow-delete`, `--allow-moderate` ni `mcpTools`, la opción provoca error de inicio: no hay nada que confirmar.

`--allow-mark-read` ofrece `max_chats_mark_read`. La otra persona ve la lectura, por eso es independiente y `--allow-send` no la activa. Pasa por los controles de envío.

`--allow-delete` ofrece `max_messages_delete`: elimina hasta 10 mensajes **solo para ti**, dejando la copia del destinatario. Es irreversible, por lo que es independiente de `--allow-send`. No puede eliminar para todos: usa `max messages delete --for-everyone` o la revisión del grupo por reglas descrita abajo. Pasa por los controles y cada mensaje cuenta para `sendsPerHour`.

`--allow-moderate` ofrece `max_chats_check`, equivalente a `max chats moderate`: revisa las reglas y ejecuta lo permitido. La opción aporta el consentimiento requerido por `flag`: elimina mensajes y miembros si la regla es `flag` o `allow`. Para `confirm`, muestra primero un único formulario con todas esas acciones; tras aprobar ejecuta exactamente esas acciones. Si aparece algo nuevo durante la espera, rechaza y hay que repetir la revisión. Nunca ejecuta `forbid`. Con `dry_run`, solo muestra el plan. El perfil necesita permisos `delete` y `groups`.

Las opciones habilitan herramientas, pero `allow` determina cuáles ve el agente: hacen falta ambos. `max mcp --allow-send --allow-delete` con `allow` = `send` ofrece envíos, pero no edición, reenvío, fijado ni eliminación. Las lecturas siempre están disponibles.

### Cambios de cuenta solo mediante configuración

Las opciones no activan contactos, cierre de encuestas, entrada y salida de grupos, creación, administradores ni perfil. Solo se habilitan mediante `mcpTools`, por grupos:

```sh
max config set mcpTools contacts,polls      # профилю по умолчанию
max work config set mcpTools groups         # профилю work
```

| Grupo | Herramientas | Permiso de `allow` |
|---|---|---|
| `contacts` | `max_contacts_add`, `_remove`, `_rename`, `_block`, `_unblock` | `contacts` |
| `polls` | `max_polls_close` | `edit` |
| `groups` | `max_chats_join`, `_leave`, `_create`, `max_chats_admins_add`, `_remove` | `groups` |
| `profile` | `max_account_update`: nombre y descripción, sin foto | `profile` |

Así el agente no puede activarlas añadiendo una opción a su comando de inicio. Cada acción pasa por `readOnly`, `allow` y registro, como el comando; `--confirm-send` también muestra formulario. La sección `bot` no admite `mcpTools`.

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
| `max_messages_context` | `max messages show`, `context` | mensaje y contexto |
| `max_messages_photo` | `max messages download` | foto como imagen hasta 512 KB; rechaza archivos, vídeo, voz y fotos mayores indicando cómo guardarlos; no entrega enlaces de foto |
| `max_messages_scheduled` | `max messages scheduled` | mensajes pendientes con `scheduledFor` |
| `max_messages_transcribe` | `max messages transcribe` | transcripción local de voz |
| `max_messages_send` | `max messages send` | envío solo con `--allow-send`; `at` programa como `--at-time`, `reply_to` responde y `markdown` formatea |
| `max_messages_edit` | `max messages edit` | edición propia con `--allow-send` |
| `max_messages_forward` | `max messages forward` | reenvío con `--allow-send`; `silent` omite aviso |
| `max_messages_pin` | `max messages pin` | fija en grupo o canal con `--allow-send`, sin aviso salvo `notify` |
| `max_messages_unpin` | `max messages unpin` | requiere `message`, pero MAX quita el único fijado independientemente del identificador; con `--allow-send` |
| `max_reactions_add` | `max reactions add` | reacción con `--allow-send` y permiso `reaction` |
| `max_reactions_remove` | `max reactions remove` | retira tu reacción con los mismos requisitos |
| `max_polls_vote` | `max polls vote` | vota o retira el voto con `--allow-send` |
| `max_polls_create` | `max polls create` | crea encuesta con `--allow-send` |
| `max_chats_mark_read` | `max chats mark-read` | marca como leído con `--allow-mark-read` |
| `max_messages_delete` | `max messages delete` | elimina solo para ti con `--allow-delete` |
| `max_chats_check` | `max chats moderate` | revisa reglas y ejecuta lo permitido con `--allow-moderate` |
| `max_contacts_*`, `max_polls_close`, `max_chats_join` y otras | `max contacts …`, `max polls close`, `max chats …`, `max account update` | solo si el grupo está en `mcpTools` |

Las listas usan `{ items, page, limit, hasMore }` e identificadores como cadenas. MCP y CLI pueden tener formatos distintos: `max_chats_events` conserva `since` (también un ID de mensaje) y los campos `chatId`/`since`; `max_chats_members_list` conserva `chatId`/`rolesKnown` sin opciones de paginación. Consulta los nuevos parámetros y formatos de CLI en [grupos](./groups.md). Errores `{ error: { code, message, … } }` con códigos CLI; los chats ambiguos devuelven `candidates` y no envían nada.

`at` de `max_messages_send` sigue `--at-time`: fecha local `2026-09-25T09:00` o `30m`, `2h`, `1d`, entre un minuto y un año, redondeando hacia abajo al minuto. Rechaza `silent` y `send_id`. Cuenta en la hora del envío. El formulario de `--confirm-send` muestra la hora. Sin respuesta no reintenta; consulta `max_messages_scheduled`.

## Prompts y chats mediante `@`

Ofrece cuatro prompts preparados; en Claude Code son comandos `/`:

| Prompt | Argumento | Qué hace el agente |
|---|---|---|
| `catch-up` | `since`: opcional | llama una vez a `max_inbox` y resume por chat; no envía |
| `reply` | `chat` | lee, prepara borrador y solo envía tras aprobar ese texto |
| `review` | `since`, `groups`: opcionales | llama a `max_review`, clasifica tus compromisos, lo esperado y dudas con identificadores; antes de marcar vencido busca si se cumplió en grupos; recordatorios en borrador hasta aprobar; indica `since` para continuar |
| `find` | `text` | busca persona o palabras y muestra contexto; no envía |

`reply` utiliza `max_messages_send`; sin `--allow-send`, solo muestra el borrador.

Los chats son recursos `max://chat/<id>`, mencionables con `@` en Claude Code. Devuelven chat y mensajes recientes. La lista procede de `messages.db` bajo la cuenta del perfil, sin conectarse a MAX; si no hay copia local, está vacía. Solo leer un chat se conecta.

`max://skill` contiene la skill de `max`, igual que `max skill show`. Está disponible en `max mcp` y `max bot mcp`, sin conectarse a MAX.

## Cómo mantiene la conexión

La primera llamada se conecta a MAX y las siguientes reutilizan la conexión. Se cierra tras 2 minutos sin llamadas y siempre a los 5 minutos, porque la lista de chats procede del inicio de sesión y podría quedar obsoleta. La siguiente llamada vuelve a conectar. Las llamadas se ejecutan una a una aunque lleguen simultáneamente.

El servidor termina al cerrar stdin el cliente y cierra la conexión con MAX.
