---
title: "Servidor MCP"
---

`max mcp` expone un perfil al agente mediante [MCP](https://modelcontextprotocol.io), por stdin/stdout de forma predeterminada. `--http --public-url` expone herramientas en un puerto local detrás de tu túnel HTTPS. El servidor se instala con `max`; no requiere instalación adicional.

**Cuándo lo necesitas.** Claude Code, Codex y otros agentes con terminal pueden usar `max` directamente con las [instrucciones para agentes](https://github.com/leemour/max-cli/blob/v0.35.0/README.md#для-скриптов-и-агентов). MCP sirve para clientes sin terminal, como Claude Desktop y el chat de Cursor, y para quienes quieren que el cliente aplique los permisos del perfil a cada operación. ChatGPT y Claude en el navegador se conectan mediante `--http`; consulta [remote.md](./remote.md).

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
max work mcp config
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

MCP respeta los `permissions` efectivos del perfil. `deny` prohíbe el comando, `readonly` prohíbe la escritura, y `ask` y `allow` permiten una operación de escritura solicitada sin formulario de confirmación. En la CLI, `ask` sigue requiriendo una respuesta o una opción explícita. `--permission ключ=уровень` sustituye el nivel solo para el proceso del servidor. Puedes bloquear el perfil con `MAX_PROFILE_LOCK`. Las opciones antiguas `--confirm-send`, `--allow-send`, `--allow-delete` y `--http-confirmation` ya no determinan el acceso; se aceptan con un aviso para que las configuraciones guardadas puedan seguir iniciándose.

## Herramientas

El servidor de cuentas personales ofrece tres herramientas:

| Herramienta | Función |
|---|---|
| `max_tools_search` | Encontrar un comando para una tarea y obtener sus argumentos y si realiza escrituras |
| `max_read` | Ejecutar un comando de lectura encontrado |
| `max_write` | Ejecutar un comando de escritura encontrado; no aparece si el perfil no permite ninguna escritura |

Una llamada de lectura tiene esta forma: `{ "command": "messages list", "arguments": { "chat": "<id>", "limit": 5 } }`. La búsqueda `{"query":"stats messages show"}` describe el recuento de mensajes; `stats chats show` describe la actividad del chat. `status` lee el estado del perfil sin conectarse. Los comandos no disponibles no aparecen en la búsqueda ni se ejecutan. Las respuestas de comandos conservan sus campos y límites; el texto son datos, no instrucciones para el agente. El esquema del resultado común es abierto: se permiten campos adicionales del proveedor, sin prometer una validación completa de las reglas de negocio.

Las herramientas antiguas como `max_messages_list` y `max_status` ya no existen. Los bots utilizan el mismo enfoque: `max_bot_tools_search`, `max_bot_read` y `max_bot_write`. Escribe el comando dentro de la llamada sin `bot`, por ejemplo `messages send`.

Consulta las rutas de comandos, los límites y las reglas de reintento en el [contrato de CLI](./cli-contract.md).

## Prompts y chats mediante `@`

El servidor ofrece seis prompts preparados, disponibles como comandos `/` en Claude Code:

| Prompt | Argumento | Qué hace el agente |
|---|---|---|
| `catch-up` | `kind`, `mode`: opcionales | Llama a `max_read` (`command: "inbox"`); `mode` es `unread` (predeterminado), `new` o un momento; `kind` elige el tipo de chat; marcar como leído requiere confirmación independiente |
| `reply` | `chat` | lee, prepara borrador y solo envía tras aprobar ese texto |
| `link-conversations` | ninguno | primero volumen y consentimiento del propietario, después lotes, enlaces y reconstrucción del grafo |
| `review` | `since`, `groups`: opcionales | Llama una vez a `max_read` (`command: "review"`) y clasifica los elementos en «me corresponde», «espero a otros» y «necesita aclaración», con ID de mensajes; antes de marcar algo como atrasado, busca en los grupos si ya se ha completado; los recordatorios siguen siendo borradores hasta que des tu consentimiento; termina con `since` para la siguiente revisión |
| `open-tasks` | `chat`: opcional | Llama a review para actualizar las tareas, muestra las abiertas y propone borradores; cierra una tarea solo con el consentimiento del propietario |
| `find` | `text` | busca persona o palabras y muestra contexto; no envía |

El envío en `reply` utiliza `max_write` (`command: "messages send"`), por lo que, si la escritura está prohibida, el agente solo muestra un borrador.

Los chats son recursos `max://chat/<id>`, mencionables con `@` en Claude Code. Devuelven chat y mensajes recientes. La lista procede de `messages.db` bajo la cuenta del perfil, sin conectarse a MAX; si no hay copia local, está vacía. Solo leer un chat se conecta.

`max://skill` contiene la skill de `max`, igual que `max skill show`. Está disponible en `max mcp` y `max bot mcp`, sin conectarse a MAX.

## Cómo mantiene la conexión

La primera llamada que necesita MAX abre la conexión; las siguientes llamadas de red la reutilizan. La búsqueda local, las estadísticas, las pruebas y la lectura de datos guardados no requieren iniciar sesión. La conexión se cierra tras 2 minutos sin llamadas y siempre a los 5 minutos, porque la lista de chats procede del inicio de sesión y podría quedar obsoleta. La siguiente llamada vuelve a conectar. Las llamadas se ejecutan una a una aunque lleguen simultáneamente.

Los temas de Telegram no existen en MAX, así que no hay herramientas `max_topics_*`. El reconocimiento directo puede devolver la transcripción guardada del mismo modelo; la foto usa la vista previa de MAX, se elige con `index` y está limitada a 512 KB. Los modelos nunca se descargan automáticamente. Antes del reconocimiento local, el servidor libera la conexión; el modelo de búsqueda se cierra al terminar el servidor.

En el modo stdin/stdout, el servidor termina al cerrar stdin el cliente y cierra la conexión con MAX. HTTP funciona hasta Ctrl-C.

`max mcp --http --public-url https://<имя>.ts.net` está disponible mediante un túnel HTTPS, con inicio de sesión por un código del terminal. Los permisos se aplican igual por HTTP y stdin/stdout; no hay formularios de confirmación del servidor. `max mcp --revoke` termina los accesos de aplicaciones y conserva la sesión de MAX. Consulta la [conexión desde el navegador](./remote.md).

Mediante MCP, el agente obtiene las instrucciones `link-conversations`, estima el trabajo con `max_read` (`command: "conversations batches status"`) y espera el consentimiento del propietario para ese chat. Después lee `max_read` (`command: "conversations batches next"`), guarda las respuestas mediante `max_write` (`command: "conversations links add"`) y reconstruye el grafo mediante `max_write` (`command: "conversations build"`). `max_write` (`command: "conversations links clear"`) elimina las respuestas del agente; después también debes reconstruir el grafo. Las operaciones de escritura requieren `conversations.links`. La configuración de vectores externos también se aplica a la búsqueda MCP: la pregunta se envía al servicio elegido.

`max_read` (`command: "attachments list"`) muestra las rutas y el estado del texto; `max_write` (`command: "attachments text set"`) guarda el texto escrito por el agente para `content:`. La extracción utiliza la CLI. `max_read` con `command: "messages context"` y `arguments: { offline: true }` solo lee el archivo.

## Gráficos de estadísticas

`max_read` (`command: "stats charts"`) lee estadísticas del almacenamiento local y devuelve `chart` en JSON. Para obtener una imagen, indica `format: "png"`: la respuesta incluye un PNG con tema oscuro y JSON con los datos originales de `chart` y el tamaño de `image`. Sin `format`, la respuesta sigue siendo JSON. La herramienta no se conecta a MAX ni escribe archivos; requiere acceso `messages`. Las entradas y salidas (`membership`) no están disponibles en este modo.
