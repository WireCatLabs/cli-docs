---
title: "Servidor MCP"
---

`tg mcp` permite que un agente utilice un perfil mediante [MCP](https://modelcontextprotocol.io), por stdin y stdout de forma predeterminada; `--http --public-url` lo sirve en un puerto local detrás de tu túnel HTTPS. El servidor viene incluido en `tg`; no tienes que instalar nada más.

**Cuándo lo necesitas.** En Claude Code, Codex y otros agentes con terminal basta con `tg`: consume los mismos tokens y ofrece las mismas funciones. MCP sirve para clientes sin terminal, como Claude Desktop o el chat de Cursor, y para quienes quieren aprobar cada envío desde el cliente. Para ChatGPT o Claude **en el navegador**, usa `tg mcp --http`: consulta [acceso desde el navegador](./remote.md).

Las herramientas personales usan el catálogo de mensajería compartido. Telegram además admite temas.

## Conexión

Ejecuta primero `tg setup --agent none` en una terminal local. Configura la cuenta de Telegram; `tg mcp setup` conecta el cliente por separado. `tg skill show` explica ambas vías antes de iniciar sesión. El servidor MCP nunca inicia sesión por ti.

**Codex o Claude Code en este equipo:**

```sh
tg mcp doctor                # check that MCP starts and lists tools
tg mcp setup codex          # add it to Codex
tg mcp setup claude-code    # or add it to Claude Code
```

Pon el perfil primero, por ejemplo `tg work mcp setup codex`. Setup usa el comando del propio cliente y conserva los demás servidores. Si ya existe una entrada con el mismo nombre, elimínala en el cliente antes de repetir. El perfil predeterminado ofrece herramientas de escritura; setup pide revisar los permisos y repetir con `--allow-writes`. Esta opción confirma la instalación, sin cambiar permisos. Para limitar al agente, configura primero los `permissions` del perfil ([más abajo](#what-an-agent-may-do)).

`mcp doctor` no lee mensajes ni inicia sesión en Telegram. Un resultado correcto significa que la conexión inicial MCP y la lista de herramientas funcionan, no que la sesión de la cuenta sea válida. `potentialWrites` cuenta herramientas sin declaración de solo lectura. Si el servidor no se inicia, el error muestra las últimas líneas que escribió en stderr, con tu carpeta personal, los números largos y los tokens ocultos. Los chats en navegador y móvil necesitan una conexión remota aparte ([acceso remoto](./remote.md)).

**Claude Code:**

```sh
claude mcp add tg -- tg mcp
```

Con un perfil, pon su nombre primero, como en cualquier comando:

```sh
claude mcp add tg-work -- tg work mcp
```

**Claude Desktop, Cursor y otros:** `tg` imprime la entrada que debes añadir a su configuración:

```sh
tg mcp config
tg work mcp config                  # another profile
```

Revisa los permisos del perfil antes de conectar un agente.


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

Pega la entrada dentro de `mcpServers` en el archivo de configuración del cliente: para Claude Desktop, `~/Library/Application Support/Claude/claude_desktop_config.json` en macOS o `%APPDATA%\Claude\claude_desktop_config.json` en Windows; para Cursor, `~/.cursor/mcp.json`. El comando no modifica ningún archivo.

Las rutas son completas porque un cliente iniciado desde el escritorio no ve el `PATH` de tu terminal; en Windows, `tg` es un archivo `tg.cmd` que un cliente sin shell no puede iniciar directamente. La entrada copia `TG_CONFIG_DIR`, `TG_STATE_DIR`, `TG_CACHE_DIR`, `MESSAGING_STORE` y `XDG_RUNTIME_DIR` si están definidas; nunca copia `TG_API_ID`, `TG_API_HASH` ni la sesión.

Si instalaste Node con nvm, fnm o Volta, su ruta corresponde a una versión concreta. Vuelve a ejecutar `tg mcp config` si cambias de versión. Si se ejecuta desde `npx`, el comando lo rechaza: la caché de npx puede borrarse y la ruta dejaría de existir.

⚠ **`TG_CONFIG_DIR`, `TG_STATE_DIR` y `TG_CACHE_DIR` cambian dónde se busca la sesión.** Si están definidas en la terminal y no en el cliente MCP, o viceversa, el servidor responde "no session" aunque `tg` funcione en la terminal. Defínelas igual en ambos sitios o en ninguno.

⚠ **En Linux, las credenciales de la aplicación están en el almacén de claves, al que se accede mediante `XDG_RUNTIME_DIR`.** Si el cliente inicia servidores con un entorno reducido y omite esa variable, todas las herramientas indican que probablemente no pueden acceder al almacén. La entrada de `tg mcp config` la incluye.

## Qué puede hacer el agente

Los `permissions` del perfil controlan el acceso ([referencia](./configuration-reference.md#what-a-profile-may-do)). `deny` bloquea un comando, `readonly` permite lecturas y `ask` o `allow` permite la escritura solicitada por MCP. El servidor no tiene formularios de confirmación. Configura la aprobación en la aplicación de tu agente. Los comandos CLI con `ask` siguen requiriendo confirmación; JSON y `--no-input` suprimen las preguntas.


```sh
tg agent config set permissions.messages readonly
tg agent config set permissions.messages.send allow
```

Las escrituras mantienen las restricciones de destinatarios, los límites horarios y el registro de envíos (`tg sends list`). Marcar como leído es una escritura aparte bajo `chats.mark-read`. El borrado por MCP afecta solo a la vista del propietario y a un máximo de diez mensajes; se rechaza en canales y supergrupos que no admiten esa operación. Las opciones antiguas `--confirm-send`, `--allow-send`, `--allow-mark-read`, `--allow-delete`, `--allow-dangerous` y `--http-confirmation` se aceptan con un aviso y no cambian la política MCP. Elimínalas de las entradas guardadas del cliente. Siguen disponibles las anulaciones temporales `--permission key=level`.


## Herramientas

| Herramienta | Función |
|---|---|
| `tg_tools_search` | Encontrar un comando, su esquema de argumentos y sus efectos |
| `tg_read` | Ejecutar un comando de lectura disponible |
| `tg_write` | Ejecutar un comando de escritura disponible |

Ambas herramientas de ejecución reciben `{command, arguments}`. Usa la ruta del comando devuelta por la búsqueda:


```json
{"command":"stats chats show","arguments":{"chat":"123"}}
```

Las herramientas antiguas por comando, como `tg_messages_list` y `tg_status`, se han eliminado. Lee `status` mediante `tg_read`. Los servidores de bots usan `tg_bot_tools_search`, `tg_bot_read`, `tg_bot_write`; sus rutas de comandos omiten `bot`. Los resultados de búsqueda reflejan los permisos del perfil y la compatibilidad del proveedor.


Las respuestas contienen JSON estructurado: las listas conservan la paginación y los identificadores siguen siendo cadenas. Los fallos incluyen `{error:{code,message,retryable,...}}`; los destinos ambiguos incluyen candidatos. Tras una escritura de resultado desconocido, consulta el registro de envíos y el estado del proveedor antes de plantearte un reintento. Consulta el [contrato de la CLI](./cli-contract.md) para esquemas, límites y reglas de reintento.


## Prompts y chats mediante `@`

El servidor ofrece seis prompts preparados; en Claude Code son comandos `/`:


| Prompt | Argumento | Qué hace el agente |
|---|---|---|
| `catch-up` | `kind`, `mode` — opcionales | llama a `tg_read` (`command: "inbox"`); `mode` es `unread` (predeterminado), `new` o una hora; `kind` elige tipos de chat; marcar como leído requiere una llamada aparte aprobada |
| `reply` | `chat` | lee el chat, prepara un borrador y solo lo envía tras tu aprobación de ese texto |
| `find` | `text` | busca personas o palabras y muestra el contexto de cada resultado; no envía nada |
| `link-conversations` | ninguno | informa del coste y pide consentimiento; después lee lotes, guarda vínculos y reconstruye |
| `review` | `since`, `groups` — opcionales | llama una vez a `tg_read` (`command: "review"`) y separa lo que debes, lo que te deben y lo que necesita aclaración; prepara recordatorios y solo envía uno tras tu aprobación |
| `open-tasks` | `chat` — opcional | llama a review para actualizar tareas, enumera las pendientes y propone borradores; solo cierra una tarea tras aprobación del propietario; no envía nada |

`reply` y `review` envían mediante `tg_write` (`command: "messages send"`), por lo que, si `messages.send` tiene nivel `readonly`, el agente solo muestra los borradores.


Los chats son recursos `tg://chat/<id>`; en Claude Code puedes mencionarlos con `@`. Cada recurso contiene el chat y sus mensajes recientes. La lista procede del archivo local y nunca se conecta a Telegram; está vacía hasta que se lea algo. Solo la lectura de un chat abre una conexión.

## Cómo se mantiene la conexión

La primera llamada se conecta a Telegram y las siguientes reutilizan la conexión. Se cierra tras 2 minutos sin llamadas y, en cualquier caso, 5 minutos después de abrirse, para que una sesión larga del agente no consulte datos desactualizados. La siguiente llamada vuelve a conectarse. Las llamadas se ejecutan de una en una, incluso si el cliente las envía juntas.

El servidor termina cuando el cliente cierra stdin y cierra su conexión con Telegram.

`tg_read` (`command: "messages link"`) devuelve `{ locator, url, access, reason }` sin el contenido del mensaje. Comparte la validación de cuenta y los límites de audiencia de `messages link`; un enlace privado no concede acceso como miembro.


El MCP personal valida argumentos con el esquema descubierto del comando y rechaza campos desconocidos antes de conectar o actuar. Usa `at_time` para programar. Comprueba un resultado desconocido antes de reintentar. Los puntos de progreso de inbox/review en MCP son independientes de los de CLI `--new`.


El enlace de conversaciones usa el prompt `link-conversations`. Indica el coste del lote y obtén consentimiento del propietario antes de leer lotes; guardar enlaces requiere `conversations.links` y después reconstruir. Los ajustes de embeddings remotos pueden enviar el texto de consulta al servicio configurado. Los comandos de adjuntos muestran rutas guardadas y estado del texto; la extracción de texto solo está disponible en la CLI.
