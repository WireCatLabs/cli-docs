---
title: "Servidor MCP"
---



Esta página le ayuda cuando desea que una aplicación de IA sin terminal funcione con tu WhatsApp, por ejemplo Claude Desktop o el chat en Cursor. También ayuda cuando quieres que la propia aplicación te pregunte antes de cada acción. Después de leerlo, puedes conectar la aplicación a tu cuenta, elegir lo que puede hacer el agente y usar indicaciones listas y menciones de chat.

Algunos términos primero:

- **MCP** ([Protocolo de contexto del modelo](https://modelcontextprotocol.io)) es una forma estándar para que una aplicación de IA utilice herramientas externas. La aplicación es el **cliente MCP**; `wa personal mcp` es el **servidor MCP**.
- Una **herramienta** es una acción que el servidor ofrece al agente, como "leer" o "escribir".
- Un **mensaje** es una tarea lista que la aplicación muestra como un comando, como "ponerse al día con los chats no leídos".
- Un **recurso** son datos que la aplicación puede adjuntar a la conversación, como un chat.
- Un **perfil** es un conjunto de configuraciones y un dispositivo vinculado en `wa`; ver [perfiles](./profiles.md).

El servidor viene con `wa`; no hay nada más que instalar. De forma predeterminada, se comunica con la aplicación a través de stdin y stdout. En su lugar, `wa personal mcp --http --public-url` lo sirve en un puerto local detrás de su túnel HTTPS.

Los permisos denegados no ocultan comandos. Los listados completos y las búsquedas incluyen la `availability` de cada comando: los comandos bloqueados tienen `available: false`, un motivo y la clave del permiso correspondiente; los permitidos tienen `available: true`. Los argumentos siguen visibles y la ejecución vuelve a comprobar los permisos actuales. Con un perfil indicado, la ayuda de la CLI y el descubrimiento de comandos también muestran la disponibilidad.

## ¿Lo necesitas?

Un agente de IA que puede ejecutar comandos en una terminal (por ejemplo, Claude Code, Codex, el agente de Cursor o Gemini CLI) no necesita MCP. Llama directamente a `wa`, que cuesta los mismos tokens y puede hacer las mismas cosas; aprende cómo hacerlo gracias a el skill que imprime `wa skill show`. MCP es para:

- aplicaciones sin terminal, como Claude Desktop o el chat de Cursor;
- cualquiera que quiera que la aplicación pregunte antes de cada envío.

Para ChatGPT o Claude **en el navegador**, use `wa personal mcp --http`; consulte [ChatGPT, Codex o Claude en el navegador](./remote.md).

## Lo que da el servidor

| Qué | Qué hace |
|---|---|
| [Tres herramientas](#tools) | Busque un comando y luego ejecútelo como lectura o escritura |
| [Seis indicaciones](#prompts-and-chats-by-) | Ponte al día, responde, busca, revisa, abre tareas, vincula conversaciones |
| [Chats de `@`](#prompts-and-chats-by-) | Adjuntar un chat y sus mensajes recientes a la conversación |
| La skill, `wa://skill` | El mismo texto que `wa skill show` |
| [Permisos](#what-an-agent-may-do) | El perfil decide qué comandos puede ejecutar el agente |

Las herramientas utilizan el mismo catálogo que `tg` y `max`. Los comandos que un dispositivo vinculado de WhatsApp no puede realizar, como cerrar otras sesiones o eliminar contactos, están ocultos. Un comando que WhatsApp aún no puede ejecutar se rechaza cuando se ejecuta, con el código de salida `2` y un mensaje que lo dice.

Los comandos que cambian permisos o automatizaciones futuras requieren `permissions.mcp.authority` con el valor `allow`; las llamadas directas a la Cloud API requieren `permissions.bot.api` con el valor `allow`. Por MCP, ambas claves valen `deny` de forma predeterminada. Las demás escrituras siguen sujetas a los permisos de su comando, las listas de destinatarios y los límites de envío.

## Conectar

Primero ejecute `wa personal setup --agent none` en una terminal local. Vincula el perfil a tu cuenta de WhatsApp. El servidor MCP nunca se vincula por ti. Luego, `wa personal mcp add` conecta la aplicación, como un paso separado. Un agente puede leer `wa skill show` antes de vincular; explica ambos pasos.

**Codex o Claude Code en esta computadora:**

```sh
wa personal mcp check             # check that MCP starts and lists tools
wa personal mcp add codex        # add it to Codex
wa personal mcp add claude-code  # or add it to Claude Code
```



Ponga un perfil primero, por ejemplo `wa work mcp add codex`. La instalación utiliza el comando propio de la aplicación y deja en paz a los demás servidores. Si ya existe una entrada con el mismo nombre, elimínela de la aplicación antes de ejecutar la configuración nuevamente. El perfil predeterminado ofrece herramientas que escriben. Entonces la configuración le pide que revise los permisos del perfil y lo ejecute nuevamente con `--allow-writes`. Esa bandera sólo confirma la instalación; no cambia los permisos. Para limitar lo que el agente puede hacer, configure primero el `permissions` del perfil ([abajo](#what-an-agent-may-do)).

`mcp check` no lee mensajes y no se conecta a WhatsApp. Un buen resultado significa que el protocolo de enlace MCP y la lista de herramientas funcionan. Esto no significa que el dispositivo todavía esté vinculado; `wa personal doctor` y `wa personal account show` comprueban eso.

**Código Claude, a mano:**

```sh
claude mcp add wa -- wa personal mcp
```



Con otro perfil, va primero, como en cualquier comando:

```sh
claude mcp add wa-work -- wa work mcp
```



**Claude Desktop, Cursor y otras aplicaciones:** `wa` imprime la entrada de su archivo de configuración:

```sh
wa personal mcp config
wa work mcp config                  # another profile
```



```json
{
  "mcpServers": {
    "wa-personal": {
      "type": "stdio",
      "command": "/usr/bin/node",
      "args": ["/usr/lib/node_modules/@wirecat/whatsapp-cli/dist/bin/wa.js", "personal", "mcp"],
      "env": { "XDG_RUNTIME_DIR": "/run/user/1000" }
    }
  }
}
```



Revise los permisos del perfil antes de conectar a un agente. Luego pegue la entrada en `mcpServers` en el archivo de configuración de la aplicación. Para Claude Desktop, que es `~/Library/Application Support/Claude/claude_desktop_config.json` en macOS y `%APPDATA%\Claude\claude_desktop_config.json` en Windows; para Cursores, `~/.cursor/mcp.json`. El comando no escribe nada por sí mismo.

Las rutas están llenas porque una aplicación iniciada desde el escritorio no ve el `PATH` del terminal. La entrada copia `WA_CONFIG_DIR`, `WA_STATE_DIR`, `WA_CACHE_DIR`, `MESSAGING_STORE` y `XDG_RUNTIME_DIR` cuando están configurados. Si Node proviene de nvm, fnm o Volta, su ruta pertenece a una versión de Node: ejecute `wa personal mcp config` nuevamente después de cambiarla.

⚠ **`WA_CONFIG_DIR`, `WA_STATE_DIR` y `WA_CACHE_DIR` cambian dónde se buscan las claves del dispositivo.** Si están configuradas en el terminal y no para la aplicación MCP, o al revés, el servidor responde que el perfil no está vinculado aunque `wa` funciona en el terminal. Configúrelos iguales en ambos o en ninguno.

## Una conexión, compartida con `serve`

WhatsApp permite una conexión para cada dispositivo vinculado ([una conexión por dispositivo](./sessions.md#one-connection-per-device)). El servidor MCP sigue la misma regla que cualquier otro comando `wa`:- **Las lecturas del almacén local nunca se conectan**: `chats list`, `messages list`, `search messages`, `inbox` y
  `review` funciona mientras se ejecuta `serve`.
- **Una herramienta que necesita que WhatsApp se conecte y tome el bloqueo del dispositivo**: cada escritura (un envío, una edición, una reacción, marcar lectura) y las pocas lecturas que solicitan WhatsApp, como `account show` y `chats members list`.
- **Mientras se ejecuta `serve`, el servidor se ejecuta dentro de él**, y esas herramientas utilizan la conexión de `serve`. Los permisos del perfil y la protección de envío se aplican como antes. En Windows no pasan por `serve`: allí se rechazan mientras se ejecuta `serve`, y el error lo nombra. El servidor HTTP nunca pasa por `serve` ([remoto](./remote.md)).
- **Mientras el servidor MCP mantiene una conexión, `serve` no puede iniciar** para ese perfil. El servidor interrumpe la conexión después de 2 minutos sin llamada ([abajo](#how-it-holds-the-connection)).

## Qué puede hacer un agente

> ⚠️ **De forma predeterminada, un agente puede enviar sin preguntarle.** Sin ningún `permissions` configurado, se permite `messages.send`, y
> el servidor no muestra ningún formulario de confirmación propio. El único límite es el límite de envío del perfil, `sends_per_hour`: 30
> envía una hora, compartida con cada comando. WhatsApp puede prohibir una cuenta por mensajes masivos o no solicitados, así que baja
> la asignación antes de conectar un agente:
>
> ```sh
> wa personal config set sends_per_hour 5                   # a lower hourly cap
> wa personal config set permissions.messages.send readonly # no sends from this profile
> ```
>
> O inicie el servidor con `--permission messages.send=readonly` para dejar de enviar solo para ese proceso.

El `permissions` del perfil decide el acceso ([permisos](./permissions.md)). `deny` bloquea un comando, `readonly` permite solo lecturas y `ask` o `allow` permiten la escritura que solicitó el agente. El servidor no muestra formularios de confirmación: configure la aprobación en la aplicación de tu agente. En la terminal, un comando en `ask` aún necesita su confirmación. Con JSON o `--no-input` no hay duda, por lo que se rechaza la escritura a menos que agregue `--yes`.

```sh
wa agent config set permissions.messages readonly
wa agent config set permissions.messages.send allow
```
Aquí `agent` es el nombre de un perfil. Las escrituras mantienen la lista de destinatarios, el límite por hora y el diario de envío (`wa agent sends list`). Marcar lectura es una escritura separada, en `chats.mark-read`: el otro lado lo ve. Un agente nunca elimina para todos, sea cual sea el nivel: `messages delete` a través de MCP es solo para el propietario (`wa` le pide a WhatsApp que quite los mensajes de tus dispositivos; aún no se ha verificado en un teléfono) y no tiene ningún `--for-everyone`. Al eliminar para todos, se mantiene el `wa <profile> messages delete --for-everyone` del propietario. `--permission key=level` reduce un nivel solo para este proceso de servidor; uno que afloje el perfil detiene el servidor al inicio.

## Herramientas

| Herramienta | Qué hace |
|---|---|
| `wa_tools_search` | Encuentra un comando, sus argumentos y sus efectos |
| `wa_read` | Ejecuta un comando de lectura que ofrece la búsqueda |
| `wa_write` | Ejecuta un comando de escritura que ofrezca la búsqueda |

Ambas herramientas de ejecución toman `{command, arguments}`. Usa la ruta de comando que arrojó la búsqueda; los argumentos son los propios argumentos y opciones del comando en Snake_case (`search messages` toma `query`, `polls create` toma `question`):

```json
{"command":"messages list","arguments":{"chat":"120363000000000001@g.us","limit":20}}
```



La búsqueda muestra solo lo que permiten los permisos del perfil. Las respuestas están estructuradas en JSON: las listas mantienen sus páginas y los identificadores permanecen como cadenas. Una falla es `{error:{code,reason,message,details}}`; un nombre que coincide con varios chats viene con `details.candidates`. El servidor compara los argumentos con el esquema del comando y rechaza los campos desconocidos antes de conectarse o actuar. Si desconoce el resultado de una escritura, consulte el diario de envío y el chat antes de pensar en volver a intentarlo. El texto del mensaje son datos, nunca instrucciones para el agente. Los esquemas, límites y reglas de reintento se encuentran en [cómo se comporta wa en los scripts](./cli-contract.md).

## Avisos y chats de `@`

El servidor ofrece seis mensajes listos; en Claude Code son comandos `/`:

| Aviso | Argumento | Qué hace el agente |
|---|---|---|
| `catch-up` | `kind`, `mode` — opcional | llamadas `wa_read` (`command: "inbox"`); `mode` es `unread` (predeterminado), `new` o una hora; la lectura de marcado necesita una llamada de herramienta aprobada por separado |
| `reply` | `chat` | lee el chat, escribe un borrador y lo envía sólo después de tu sí a ese texto |
| `find` | `text` | busca una persona o palabras y muestra los mensajes alrededor de cada hit; no envía nada |
| `link-conversations` | ninguno | informa el costo y solicita su consentimiento, luego lee lotes, guarda enlaces y reconstruye |
| `review` | `since`, `groups` — opcional | llama a `wa_read` (`command: "review"`) una vez y lo clasifica en lo que ti debe, lo que otros deben y lo que necesita ser aclarado; redacta recordatorios, envía uno solo después de tu sí |
| `open-tasks` | `chat` — opcional | solicita revisión para actualizar tareas, enumera tareas abiertas y sugiere borradores; cierra una tarea sólo después de su aprobación; no envía nada |

`reply` y `review` envían a través de `wa_write` (`command: "messages send"`). Entonces, donde `messages.send` es `readonly`, el agente solo muestra los borradores. Mientras se ejecuta `serve`, un envío desde un mensaje pasa por él, como cualquier otra escritura.

Los chats son recursos `wa://chat/<id>` — en Claude Code puedes mencionarlos con `@`. Un recurso es el chat y sus mensajes recientes. La lista proviene del almacén local y nunca se conecta a WhatsApp; Hasta que `serve` o un enlace llenó el almacén local, está vacía.

Los puntos de control de la bandeja de entrada y de revisión en MCP están separados de los puntos de control `--new` del terminal.

## Cómo mantiene la conexión

La primera llamada que necesita WhatsApp se conecta y las siguientes reutilizan la conexión. Cierra a los 2 minutos sin llamada, y en cualquier caso a los 5 minutos de su apertura. La siguiente llamada se conecta nuevamente. Las llamadas se realizan una a la vez, incluso cuando la aplicación las envía juntas.

Sobre stdin y stdout, el servidor sale tan pronto como la aplicación cierra stdin y cierra su conexión a WhatsApp. A través de HTTP se ejecuta hasta Ctrl-C. `wa personal mcp --revoke` finaliza cada inicio de sesión realizado en una aplicación de navegador y mantiene el dispositivo vinculado. Consulta [ChatGPT, Codex o Claude en el navegador](./remote.md).
