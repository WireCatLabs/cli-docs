---
title: "Servidor MCP"
---

Esta página le ayuda cuando desea que una aplicación de IA sin terminal funcione con su Telegram, por ejemplo Claude Desktop o el chat en Cursor. También ayuda cuando quieres que la propia aplicación te pregunte antes de cada acción. Después de leerlo, puede conectar la aplicación a su cuenta, elegir lo que puede hacer el agente y usar indicaciones listas y menciones de chat.

Algunos términos primero:

- **MCP** ([Model Context Protocol](https://modelcontextprotocol.io)) es una forma estándar para que una aplicación de IA utilice herramientas externas. La aplicación es el **cliente MCP**; `tg mcp` es el **servidor MCP**.
- Una **herramienta** es una acción que el servidor ofrece al agente, como "leer" o "escribir".
- Una **petición preparada** (prompt) es una tarea lista que la aplicación muestra como un comando, como "ponerse al día con los chats no leídos".
- Un **recurso** son datos que la aplicación puede adjuntar a la conversación, como un chat.
- Un **perfil** es un conjunto de configuraciones y un inicio de sesión en `tg`; ver [perfiles](./profiles.md).

El servidor viene con `tg`; no hay nada más que instalar. De forma predeterminada, se comunica con la aplicación a través de stdin y stdout. En su lugar, `tg mcp --http --public-url` lo sirve en un puerto local detrás de su túnel HTTPS.

## ¿Lo necesitas?

Un agente de IA que puede ejecutar comandos en una terminal (por ejemplo, Claude Code, Codex, Cursor Agent o Gemini CLI) no necesita MCP. Llama directamente a `tg`, que cuesta los mismos tokens y puede hacer las mismas cosas; aprende cómo hacerlo gracias a la skill que imprime `tg skill show`. MCP es para:

- aplicaciones sin terminal, como Claude Desktop o Cursor Chat;
- cualquiera que quiera que la aplicación pregunte antes de cada envío.

Para ChatGPT o Claude **en el navegador**, use `tg mcp --http`; consulte [conectar un navegador o una aplicación de teléfono](./remote.md).

## Lo que da el servidor

| Qué | Qué hace |
|---|---|
| [Tres herramientas](#tools) | Busque un comando y luego ejecútelo como lectura o escritura |
| [Seis indicaciones](#prompts-and-chats-by-) | Ponte al día, responde, busca, revisa, abre tareas, vincula conversaciones |
| [Chats de `@`](#prompts-and-chats-by-) | Adjuntar un chat y sus mensajes recientes a la conversación |
| La skill, `tg://skill` | El mismo texto que `tg skill show` |
| [Gráficos](#statistics-charts) | Estadísticas de un chat como imagen JSON o PNG |
| [Permisos](#what-an-agent-may-do) | El perfil decide qué comandos ve el agente |

Las herramientas personales utilizan el mismo catálogo que `max`. Telegram también tiene temas.

## Conexión

Primero ejecute `tg setup --agent none` en una terminal local. Inicia sesión en su cuenta de Telegram. El servidor MCP nunca inicia sesión por usted. Luego, `tg mcp setup` conecta la aplicación, como un paso separado. Un agente puede leer `tg skill show` antes de iniciar sesión; explica ambos pasos.

**Codex o Claude Code en este equipo:**

```sh
tg mcp doctor                # check that MCP starts and lists tools
tg mcp setup codex          # add it to Codex
tg mcp setup claude-code    # or add it to Claude Code
```

Ponga un perfil primero, por ejemplo `tg work mcp setup codex`. La instalación utiliza el comando propio de la aplicación y deja en paz a los demás servidores. Si ya existe una entrada con el mismo nombre, elimínela de la aplicación antes de ejecutar la configuración nuevamente. El perfil predeterminado ofrece herramientas que escriben. Entonces la configuración le pide que revise los permisos del perfil y lo ejecute nuevamente con `--allow-writes`. Esa bandera sólo confirma la instalación; no cambia los permisos. Para limitar lo que el agente puede hacer, configure primero el `permissions` del perfil ([abajo](#what-an-agent-may-do)).

`mcp doctor` no lee mensajes y no inicia sesión en Telegram. Un buen resultado significa que el protocolo de enlace MCP y la lista de herramientas funcionan. No significa que la sesión de la cuenta sea válida. `potentialWrites` cuenta las herramientas que no están marcadas como de solo lectura. Cuando el servidor no se inicia, el error muestra las últimas líneas que escribió en stderr, con su carpeta de inicio, números largos y tokens ocultos. Las aplicaciones del navegador y del teléfono necesitan una conexión remota separada ([conectar una aplicación del navegador o del teléfono](./remote.md)).

**Claude Code, manualmente:**

```sh
claude mcp add tg -- tg mcp
```

Con un perfil, pon su nombre primero, como en cualquier comando:

```sh
claude mcp add tg-work -- tg work mcp
```

**Claude Desktop, Cursor y otras aplicaciones:** `tg` imprime la entrada de su archivo de configuración:

```sh
tg mcp config
tg work mcp config                  # another profile
```

```json
{
  "mcpServers": {
    "tg": {
      "type": "stdio",
      "command": "/usr/bin/node",
      "args": ["/usr/lib/node_modules/@leemour/tg-cli/dist/bin/tg.js", "mcp"],
      "env": { "XDG_RUNTIME_DIR": "/run/user/1000" }
    }
  }
}
```

Revise los permisos del perfil antes de conectar a un agente. Luego pegue la entrada en `mcpServers` en el archivo de configuración de la aplicación. Para Claude Desktop, que es `~/Library/Application Support/Claude/claude_desktop_config.json` en macOS y `%APPDATA%\Claude\claude_desktop_config.json` en Windows; para Cursor, `~/.cursor/mcp.json`. El comando no escribe nada por sí mismo.

Las rutas son absolutas porque una aplicación iniciada desde el escritorio no ve el `PATH` del terminal. En Windows, `tg` es un archivo `tg.cmd`, que una aplicación sin shell no puede iniciar. La entrada copia `TG_CONFIG_DIR`, `TG_STATE_DIR`, `TG_CACHE_DIR`, `MESSAGING_STORE` y `XDG_RUNTIME_DIR` cuando están configurados; nunca `TG_API_ID`, `TG_API_HASH` o la sesión.

Si Node proviene de nvm, fnm o Volta, su ruta pertenece a una versión de Node. Ejecute `tg mcp config` nuevamente después de cambiarlo. Ejecutado desde `npx`, el comando se niega: npx borra su caché y la ruta dejaría de existir.

⚠ **`TG_CONFIG_DIR`, `TG_STATE_DIR` y `TG_CACHE_DIR` cambian dónde se busca el inicio de sesión.** Si están configurados en el terminal y no para la aplicación MCP, o al revés, el servidor responde "sin sesión" aunque `tg` funciona en el terminal. Configúrelos iguales en ambos o en ninguno.

⚠ **En Linux, las credenciales de la aplicación están en el llavero, al que se accede a través de `XDG_RUNTIME_DIR`.** Una aplicación que inicia servidores con un entorno recortado la omite y cada herramienta responde que el llavero probablemente esté fuera de su alcance. La entrada de `tg mcp config` lo incluye.

Un bot tiene su propio servidor, `tg <name> bot mcp`; consulte [el bot para un agente](./bot.md#the-bot-for-an-agent-mcp).

## Qué puede hacer el agente

El `permissions` del perfil decide el acceso ([qué puede hacer un perfil](./configuration-reference.md#what-a-profile-may-do)). `deny` bloquea un comando, `readonly` permite solo lecturas y `ask` o `allow` permiten la escritura que solicitó el agente. El servidor no muestra formularios de confirmación: configure la aprobación en la aplicación de su agente. En la terminal, un comando en `ask` aún necesita su confirmación. Con JSON o `--no-input` no hay pregunta interactiva, por lo que se rechaza la escritura a menos que agregue `--yes`.

```sh
tg agent config set permissions.messages readonly
tg agent config set permissions.messages.send allow
```

Aquí `agent` es el nombre de un perfil. Las escrituras mantienen los límites de destinatarios, los límites por hora y el diario de envío (`tg sends list`). Marcar lectura es una escritura separada, en `chats.mark-read`. Al eliminar a través de MCP, se eliminan los mensajes solo para usted, como máximo diez a la vez; Se rechazan los canales y supergrupos que no lo permiten. `--permission key=level` cambia un nivel solo para este proceso de servidor.

Las banderas antiguas `--confirm-send`, `--allow-send`, `--allow-mark-read`, `--allow-delete`, `--allow-dangerous` y `--http-confirmation` se aceptan con una advertencia y no cambian lo que puede hacer el agente. Elimínelos de las entradas guardadas de la aplicación.

## Herramientas

| Herramienta | Qué hace |
|---|---|
| `tg_tools_search` | Encuentra un comando, sus argumentos y sus efectos |
| `tg_read` | Ejecute un comando de lectura que ofrece la búsqueda |
| `tg_write` | Ejecute un comando de escritura que ofrezca la búsqueda |

Ambas herramientas de ejecución toman `{command, arguments}`. Utilice la ruta de comando que arrojó la búsqueda:

```json
{"command":"stats chats show","arguments":{"chat":"123"}}
```

`status` lee el estado del perfil a través de `tg_read`. La búsqueda muestra solo lo que permiten los permisos del perfil y Telegram. Los nombres anteriores de una herramienta por comando, como `tg_messages_list` y `tg_status`, ya no existen. Los servidores bot utilizan `tg_bot_tools_search`, `tg_bot_read` y `tg_bot_write`; sus rutas de comando omiten `bot`.

Las respuestas están estructuradas en JSON: las listas mantienen sus páginas y los identificadores permanecen como cadenas. Una falla es `{error:{code,message,retryable,...}}`; un objetivo que coincide con varios chats viene con candidatos. El servidor compara los argumentos con el esquema del comando y rechaza los campos desconocidos antes de conectarse o actuar. Utilice `at_time` para programar. Si se desconoce el resultado de una escritura, consulte el diario de envío y Telegram antes de pensar en volver a intentarlo. El texto del mensaje son datos, nunca instrucciones para el agente. Los esquemas, límites y reglas de reintento se encuentran en [cómo se comporta tg en los scripts](./cli-contract.md).

## Prompts y chats mediante `@`

El servidor ofrece seis prompts preparados; en Claude Code son comandos `/`:

| Aviso | Argumento | Qué hace el agente |
|---|---|---|
| `catch-up` | `kind`, `mode` — opcional | llama a `tg_read` (`command: "inbox"`); `mode` es `unread` (predeterminado), `new` o una hora; `kind` selecciona tipos de chat; la lectura de marcado necesita una llamada de herramienta aprobada por separado |
| `reply` | `chat` | lee el chat, escribe un borrador y lo envía sólo después de tu sí a ese texto |
| `find` | `text` | busca una persona o palabras y muestra los mensajes alrededor de cada hit; no envía nada |
| `link-conversations` | ninguno | informa el costo y solicita su consentimiento, luego lee lotes, guarda enlaces y reconstruye ([abajo](#linking-conversations)) |
| `review` | `since`, `groups` — opcional | llama a `tg_read` (`command: "review"`) una vez y lo clasifica en lo que usted debe, lo que otros deben y lo que necesita ser aclarado; redacta recordatorios, envía uno solo después de tu sí |
| `open-tasks` | `chat` — opcional | solicita revisión para actualizar tareas, enumera tareas abiertas y sugiere borradores; cierra una tarea sólo después de su aprobación; no envía nada |

`reply` y `review` envían a través de `tg_write` (`command: "messages send"`). Entonces, donde `messages.send` es `readonly`, el agente solo muestra los borradores.

Los chats son recursos `tg://chat/<id>` — en Claude Code puedes mencionarlos con `@`. Un recurso es el chat y sus mensajes recientes. La lista proviene de la copia local de tus mensajes y nunca se conecta a Telegram; hasta que se leyó algo, está vacío. Solo se conecta leyendo un chat.

`tg_read` (`command: "messages link"`) devuelve `{ locator, url, access, reason }` sin el texto del mensaje. Verifica la cuenta y la audiencia de la misma manera que `messages link`; un enlace privado no convierte a nadie en miembro. Los puntos de control de la bandeja de entrada y de revisión en MCP están separados de los puntos de control `--new` del terminal.

## Gráficos de estadísticas

`tg_read` (`command: "stats charts"`) lee las estadísticas de un chat de la copia local y devuelve un `chart` en JSON. Para una imagen, agregue `format: "png"`: la respuesta es un PNG oscuro más JSON con los datos `chart` y el tamaño `image`. Sin `format`, la respuesta sigue siendo JSON. La herramienta no se conecta a Telegram y no escribe archivos; necesita el permiso `messages`. Las uniones y salidas (`membership`) no están disponibles aquí.

## Vincular conversaciones

La petición preparada `link-conversations` permite al agente vincular las respuestas a las conversaciones. El agente primero informa el tamaño del trabajo con `tg_read` (`command: "conversations batches status"`) y espera su consentimiento. Luego lee lotes con `tg_read` (`command: "conversations batches next"`), guarda sus respuestas con `tg_write` (`command: "conversations links add"`) y reconstruye con `tg_write` (`command: "conversations build"`). `tg_write` (`command: "conversations links clear"`) elimina las respuestas del agente; reconstruir después de eso también. Para guardar se necesita el permiso `conversations.links`. Si configura un servicio externo para vectores de búsqueda, la búsqueda MCP también envía el texto de la consulta a ese servicio.

## Archivos y mensajes guardados

`tg_read` (`command: "attachments list"`) muestra las rutas de los archivos guardados y si se extrajo su texto. `tg_write` (`command: "attachments text set"`) guarda el texto que el agente leyó de un archivo. La extracción de texto se realiza únicamente en la terminal. `tg_read` con `command: "messages context"` y `arguments: { offline: true }` lee solo la copia local.

## Cómo se mantiene la conexión

La primera llamada que necesita Telegram se conecta y las siguientes reutilizan la conexión. Se cierra después de 2 minutos sin una llamada y, en cualquier caso, 5 minutos después de su apertura, por lo que una sesión larga de agente nunca lee una instantánea obsoleta. La siguiente llamada se conecta nuevamente. Las llamadas se realizan una a la vez, incluso cuando la aplicación las envía juntas.

A través de stdin y stdout, el servidor se cierra tan pronto como la aplicación cierra stdin y cierra su conexión a Telegram. A través de HTTP se ejecuta hasta Ctrl-C. `tg mcp --revoke` finaliza cada inicio de sesión realizado en una aplicación de navegador y mantiene su sesión de Telegram. Consulte [conectar un navegador o una aplicación de teléfono](./remote.md).
