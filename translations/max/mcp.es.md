---
title: "Servidor MCP"
---

<a id="los-permisos-del-perfil-controlan-las-herramientas" />
<a id="права-профиля-управляют-инструментами" />

Esta página te ayuda a conectar una aplicación de IA sin terminal, como Claude Desktop o Cursor Chat, a tu cuenta MAX. Aprenderás a conectarla, elegir los permisos del agente y usar peticiones preparadas y referencias a chats.

Primero algunos términos:

- **MCP** ([Model Context Protocol](https://modelcontextprotocol.io)): estándar para que una aplicación de IA use herramientas externas. La aplicación es el **cliente MCP**; `max mcp`, el **servidor MCP**.
- **Herramienta**: acción ofrecida al agente, como leer o escribir.
- **Petición preparada** (prompt): tarea que la aplicación muestra como comando, como revisar mensajes no leídos.
- **Recurso**: datos que la aplicación puede adjuntar al chat con el agente.
- **Perfil**: ajustes y sesión de `max`; consulta [perfiles](./profiles.md).

El servidor se instala junto con `max`; no es necesario instalar nada por separado. De forma predeterminada, se comunica con la aplicación mediante stdin y stdout. En cambio, `max mcp --http --public-url` sirve las herramientas en un puerto local detrás de su túnel HTTPS.

## ¿Lo necesitas?

Un agente de IA que puede ejecutar comandos en la terminal (por ejemplo, Claude Code, Codex, Cursor Agent o Gemini CLI) no necesita MCP. Llama directamente a `max` y aprende cómo hacerlo gracias a la habilidad que imprime `max skill show`. MCP necesario:

- aplicaciones sin terminal - Claude Desktop, Cursor chat;
- aquellos que desean que la aplicación aplique derechos de perfil a cada operación.

ChatGPT y Claude **en el navegador** se conectan a través de `max mcp --http` - consulte [conexión desde el navegador o teléfono](./remote.md).

## Lo que da el servidor

|Qué|Para qué|
|---|---|
|[Tres herramientas](#инструменты)|Busque el comando y ejecútelo como lectura o escritura.|
|[Seis consultas listas para usar](#команды-и-чаты-по-)|No leídos, responder, buscar, revisar, problemas abiertos, enlaces de conversación|
|[Chats en `@`](#команды-и-чаты-по-)|Adjunte el chat y sus últimos mensajes a la conversación.|
|Habilidad, `max://skill`|El mismo texto que imprime `max skill show`|
|[Gráficos](#графики-статистики)|Estadísticas de chat en imagen JSON o PNG|
|[Derechos](#что-может-агент)|El perfil decide qué comandos ve el agente.|

## Conexión

Primero ejecute `max setup --agent none` en su terminal local. Este es el inicio de sesión de su cuenta MAX; No es posible iniciar sesión a través de MCP. Luego, `max mcp setup` conecta la aplicación por separado. El agente puede leer `max skill show` antes de ingresar: allí se explican ambos pasos.

**Codex o Claude Code en este comando:**

```sh
max mcp doctor                 # проверяет запуск MCP и список инструментов
max mcp setup codex           # добавляет сервер в Codex
max mcp setup claude-code     # или в Claude Code
```

Para otro perfil, primero ponga su nombre: `max work mcp setup codex`. El comando de instalación utiliza la aplicación en sí y no toca sus otros servidores. Si ya existe una entrada con el mismo nombre, elimínela en la aplicación antes de instalarla nuevamente. Si el perfil ofrece herramientas de grabación, primero verifique sus permisos y luego vuelva a emitir el comando con `--allow-writes`. Esta bandera solo confirma la instalación: no cambia los derechos del perfil ni marca `--allow-send` y otros.

`mcp doctor` no lee mensajes ni se conecta a MAX. Una comprobación correcta demuestra que MCP inicia y enumera herramientas, no que la sesión sea válida. `potentialWrites` cuenta herramientas que no son de solo lectura. El navegador y el móvil requieren [conexión remota](./remote.md).

**Claude Code manualmente:**

```sh
claude mcp add max -- max mcp
```

Con un perfil, su nombre va primero:

```sh
claude mcp add max-work -- max work mcp
```

**Claude Desktop, Cursor y otras aplicaciones**: la entrada finalizada para su archivo de configuración la imprime el propio `max`:

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

Verifique los permisos de su perfil antes de conectar a un agente. Luego inserte una entrada en el archivo de configuración de la aplicación `mcpServers`. Claude Desktop tiene `%APPDATA%\Claude\claude_desktop_config.json` en Windows y `~/Library/Application Support/Claude/claude_desktop_config.json` en macOS, Cursor tiene `~/.cursor/mcp.json`. El comando en sí no registra nada.

Las rutas en las entradas están completas, porque una aplicación que no se inicia desde el terminal no ve el terminal `PATH`. En Windows, `max` es el archivo `max.cmd`, que una aplicación sin shell no puede ejecutar. Las banderas `--allow-send` y otras se transfieren al registro. Las variables `MAX_CONFIG_DIR`, `MAX_STATE_DIR`, `MAX_CACHE_DIR`, `MESSAGING_STORE` y `XDG_RUNTIME_DIR` se incluyen en él sólo si se especifican; ficha - nunca. `MAX_CACHE_DIR` se refiere únicamente al caché antiguo y el archivo local compartida de los mensajes se especifica mediante `MESSAGING_STORE`. El comando transfiere la ruta a esta copia y el directorio para comunicarse con el llavero para que una aplicación iniciada desde el escritorio utilice la misma entrada y mensajes guardados que el terminal.

Si Node se entrega a través de nvm, fnm o Volta, la ruta hacia él se refiere a una versión de Node. Después de cambiar la versión, ejecute `max mcp config` nuevamente. Desde `npx` el comando se niega a funcionar: `npx` borra su caché y la ruta dejará de existir.

⚠ **Las variables `MAX_CONFIG_DIR`, `MAX_STATE_DIR`, `MAX_CACHE_DIR` cambian dónde buscar la entrada.** Si están configuradas en el terminal, pero no para la aplicación MCP (o viceversa), el servidor responderá "sin sesión", aunque `max` funcione en el terminal. Pregúntales lo mismo o no les preguntes en ningún lado.

El bot tiene su propio servidor, `max <имя> bot mcp`; consulte [bot para agente](./bot.md#бот-для-агента-mcp). Su acceso está determinado por `permissions` del perfil del bot. Sus flags `--allow-send`, `--allow-delete` y `--allow-moderate` se aceptan con una advertencia y no incluyen nada.

## Qué puede hacer un agente

El acceso está determinado por el perfil `permissions` ([derechos de acceso en el directorio de configuración](./configuration-reference.md#права-доступа)). `deny` niega el comando, `readonly` permite solo lectura y `ask` y `allow` permiten la escritura que solicitó el agente. No hay formularios de confirmación en el servidor: la aprobación se configura en la aplicación del agente. En la terminal, el comando en el nivel `ask` aún requiere una respuesta o un indicador explícito. `--permission ключ=уровень` cambia el nivel solo para el proceso del servidor. El perfil se puede proteger mediante `MAX_PROFILE_LOCK`.

Las antiguas banderas `--confirm-send`, `--allow-send`, `--allow-delete` y `--http-confirmation` ya no definen lo que puede hacer el agente. Se aceptan con una advertencia para que las grabaciones guardadas sigan ejecutándose; eliminarlos de los registros de la solicitud.

## Herramientas

| Herramienta | Para qué |
|---|---|
| `max_tools_search` | Encontrar un comando, sus argumentos y si escribe |
| `max_read` | Ejecutar el comando de lectura encontrado |
| `max_write` | Ejecutar el comando de escritura encontrado; no aparece si el perfil no permite ninguno |

Ambas herramientas de ejecución aceptan `{command, arguments}`. Tome la ruta del comando de la respuesta de búsqueda:

```json
{ "command": "messages list", "arguments": { "chat": "<id>", "limit": 5 } }
```

La búsqueda `{"query":"stats messages show"}` describe el recuento de mensajes, `stats chats show` describe la actividad del chat. `status` lee el estado del perfil sin conexión. La búsqueda muestra sólo lo que permiten los permisos del perfil y lo que MAX puede hacer; Los comandos no disponibles no se ejecutan. Las herramientas anteriores del tipo `max_messages_list` y `max_status` ya no están disponibles. El mismo enfoque se aplica a los bots: `max_bot_tools_search`, `max_bot_read`, `max_bot_write`; el comando dentro de la llamada está escrito sin `bot`, por ejemplo `messages send`.

Las respuestas conservan los campos y restricciones de sus comandos. El diseño del resultado general es abierto: se permiten campos de Messenger adicionales y esto no es una promesa de verificar todos los campos. El texto de los mensajes son datos, no instrucciones para el agente. Los esquemas, límites y reglas de repetición se encuentran en [descripción del comportamiento de max en scripts](./cli-contract.md).

## Prompts y chats mediante `@`

El servidor ofrece seis prompts preparados, disponibles como comandos `/` en Claude Code:

|Pedido|Argumento|¿Qué hace un agente?|
|---|---|---|
| `catch-up` |`kind`, `mode` - opcional|llama a `max_read` (`command: "inbox"`); `mode` - `unread` (predeterminado), `new` o momento; `kind` selecciona el tipo de chat; Marcar como leído requiere confirmación por separado|
| `reply` | `chat` |lee el chat, escribe un borrador y lo envía solo después de tu "sí" a este texto|
| `find` | `text` |busca una persona o palabras y muestra mensajes sobre lo encontrado; no envía nada|
| `link-conversations` |No|primero el volumen y su consentimiento, luego packs, conexiones y reestructuración ([below](#связи-разговоров))|
| `review` |`since`, `groups` - opcional|llama a `max_read` (`command: "review"`) una vez y se descompone en "debo", "espero de los demás", "necesito aclarar" con identificadores de mensaje; antes de “vencido” se mira si esto se ha hecho en grupo; recordatorios: solo borradores hasta su "sí"; al final - `since` para la próxima revisión|
| `open-tasks` |`chat` - opcional|llama a revisión para actualizar tareas, muestra tareas abiertas y sugiere borradores; cierra la tarea sólo después de su consentimiento|

El envío en `reply` utiliza `max_write` (`command: "messages send"`), por lo que, si la escritura está prohibida, el agente solo muestra un borrador.

Los chats están disponibles como recursos `max://chat/<id>`; en Claude Code se pueden mencionar a través de `@`. El recurso proporciona el chat y sus mensajes más recientes. La lista de recursos se toma de una archivo local compartida de `messages.db` en la cuenta del perfil y no va a MAX; Si bien no hay una archivo local, está vacía. MAX sólo incluye la lectura de un chat.

`max://skill` contiene la skill de `max`, igual que `max skill show`. Está disponible en `max mcp` y `max bot mcp`, sin conectarse a MAX.

## Gráficos de estadísticas

`max_read` (`command: "stats charts"`) lee estadísticas del archivo local y devuelve `chart` en JSON. Para una imagen, usa `format: "png"`: devuelve un PNG oscuro y JSON con datos `chart` y tamaño `image`. Sin `format`, sigue en JSON. No conecta a MAX ni escribe archivos; requiere acceso `messages`. Aquí no están disponibles las entradas y salidas (`membership`).

## Conexiones de conversación

La solicitud preparada `link-conversations` permite al agente vincular respuestas en conversaciones. Primero, el agente estima el volumen a través de `max_read` (`command: "conversations batches status"`) y espera su consentimiento para este chat. Luego lee los paquetes mediante `max_read` (`command: "conversations batches next"`), guarda las respuestas mediante `max_write` (`command: "conversations links add"`) y reconstruye el gráfico mediante `max_write` (`command: "conversations build"`). `max_write` (`command: "conversations links clear"`) elimina las respuestas del agente; después, el gráfico también debe reconstruirse. La entrada requiere el permiso `conversations.links`. Si ha configurado un servicio externo para vectores de búsqueda, la búsqueda MCP también le envía el texto de la pregunta.

## Archivos y mensajes guardados

`max_read` (`command: "attachments list"`) muestra las rutas de los archivos guardados y el estado de su texto; `max_write` (`command: "attachments text set"`) almacena el texto que el agente lee del archivo para buscar por `content:`. Extracción de texto: solo en la terminal. `max_read` con `command: "messages context"` y `arguments: { offline: true }` solo lee el archivo local.

No hay temas de Telegram en MAX, por lo que no hay herramientas `max_topics_*`. El reconocimiento directo puede devolver una transcripción almacenada del mismo modelo. La foto utiliza la vista previa MAX, seleccionada mediante `index` y limitada a 512 KB. Los modelos nunca se descargan solos. Antes del reconocimiento local, el servidor libera la conexión; El modelo de búsqueda se cierra cuando se apaga el servidor.

## Cómo mantiene la conexión

La primera llamada que necesita MAX abre la conexión; las siguientes la reutilizan. La búsqueda local, las estadísticas, la evidencia y la lectura de datos de sesión guardados no la necesitan. Se cierra tras 2 minutos sin llamadas y, en todo caso, 5 minutos después de iniciar sesión: la lista de chats procede de esa respuesta y podría quedar desactualizada. La siguiente llamada inicia sesión de nuevo. Las llamadas se ejecutan en serie aunque la aplicación las envíe a la vez.

A través de stdin y stdout, el servidor sale cuando la aplicación cierra stdin y cierra la conexión a MAX. A través de HTTP funciona hasta Ctrl-C. Se puede acceder a `max mcp --http --public-url https://<имя>.ts.net` a través de un túnel HTTPS con inicio de sesión mediante un código del terminal. Los permisos son los mismos a través de HTTP y a través de stdin y stdout. `max mcp --revoke` finaliza los inicios de sesión de la aplicación y guarda la sesión MAX. Consulte [conectarse desde el navegador o el teléfono](./remote.md).
