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
tg work mcp config --confirm-send     # the entry with a form before every change
```

`--confirm-send`, `--allow-dangerous` y `--yes` se incluyen en la entrada tal como los indiques ([más abajo](#what-an-agent-may-do)).

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

Los `permissions` del perfil deciden qué herramientas se ofrecen, con los mismos niveles que los comandos ([configuración](./configuration.md#what-a-profile-may-do)):

| Nivel | Comportamiento en MCP |
|---|---|
| `deny` | no ofrece la herramienta; `messages: deny` también oculta prompts y recursos de chats |
| `readonly` | ofrece herramientas de lectura, no de escritura |
| `ask` | antes de actuar, el servidor muestra un formulario ([más abajo](#a-confirmation-form-from-the-server-itself)) |
| `allow` | actúa sin preguntar |

**Con los ajustes predeterminados, el agente puede enviar, editar, reaccionar, reenviar, fijar, votar y marcar chats como leídos** sin opciones adicionales ni preguntas. Solo `tg_messages_delete` tiene nivel `ask`: muestra un formulario antes de eliminar. Un agente nunca elimina para todos ni cierra tus otras sesiones, sea cual sea el nivel.

Para que el agente solo lea, dale un perfil propio: `tg agent session start` inicia otra sesión de la misma cuenta, como otro dispositivo. Después configura cada recurso:

```sh
for key in messages reactions polls topics chats contacts account; do
  tg agent config set permissions.$key readonly
done
claude mcp add tg -- tg agent mcp
```

El ajuste anterior `readOnly: true` en ese perfil tiene el mismo efecto. Para pedir aprobación antes de cada envío, configura `messages.send` como `ask`:

```sh
tg agent config set permissions.messages.send ask
```

Estos niveles también se aplican a ti: en ese perfil, `tg agent messages send` también pregunta. Dos opciones omiten el formulario cuando el nivel es `ask` por stdin/stdout. Por HTTP siempre se requiere un formulario:

- `tg mcp --allow-dangerous`: sin formulario antes de eliminar.
- `tg mcp --yes`: sin formulario antes de cualquier otro cambio.

Un envío, edición o reenvío por MCP pasa por las mismas comprobaciones que el comando: `permissions`, destinatarios permitidos, límite por hora y registro de envíos (`tg sends list`). Además, todas las herramientas de escritura se marcan como peligrosas: VS Code y Cursor preguntan antes de cada llamada; según su documentación, Claude Code muestra un diálogo de aprobación incluso si todo lo demás se había autorizado previamente.

**Marcar un chat como leído** corresponde a `chats.mark-read`: la otra persona lo ve. Configúralo como `readonly` si el agente debe leer sin revelar esa actividad. `tg_chats_mark_read` nunca cuenta para el límite por hora.

**Eliminar mensajes** corresponde a `messages.delete`. `tg_messages_delete` elimina hasta 10 mensajes solo de **tu** vista; eliminar para todos se deja al comando que ejecutes tú. En supergrupos y canales Telegram no permite «solo para mí», por lo que allí se rechaza esta herramienta.

`--allow-send`, `--allow-mark-read` y `--allow-delete` ya no deciden permisos: se aceptan con un aviso para que las configuraciones antiguas sigan iniciándose. Elimínalas de la configuración del cliente.

### Formulario de confirmación del propio servidor

```sh
claude mcp add tg -- tg mcp --confirm-send
```

Los cambios en el mensajero con nivel `ask`, y todos los cambios en el mensajero con `--confirm-send`, requieren un formulario. Las etiquetas locales, las búsquedas guardadas y las actualizaciones de conversaciones con nivel `ask`, con `--confirm-send` o por HTTP se rechazan con `confirmation_required` antes de escribir; ejecútalas desde el CLI. Readonly mantiene las herramientas de lectura. En un envío, el formulario muestra **el chat real**, con el título e identificador que resolvió a partir del nombre del agente, y **el texto completo**. Solo ejecuta el cambio al pulsar Accept; el formulario no tiene campos, solo ese botón. La ventana del cliente muestra los argumentos tal como los escribió el modelo (`chat: "Anna"`); el formulario muestra qué estás autorizando realmente ("Anna Petrova (123456)").

- Si pulsas Decline o cierras el formulario, no cambia nada; el agente recibe `confirmation_required` y no debe reintentarlo.
- Si el cliente no admite formularios, recibe un error: **no cambia nada**. Claude Code sí los muestra.
- La aprobación está vinculada a lo mostrado: si el agente cambia el chat, texto o herramienta después, no cambia nada.
- La aprobación sirve una sola vez durante 5 minutos. Reutilizar la misma respuesta no produce cambios.

## Herramientas

| Herramienta | Comando | Qué hace |
|---|---|---|
| `tg_status` | `tg doctor` | perfil del servidor, última cuenta conocida y herramientas de escritura habilitadas; nunca se conecta |
| `tg_review` | `tg review`, `--since-time`, `--chat`, `--unanswered`, `--all` | todos los mensajes, incluidos los del propietario, en cada chat que cambió desde un momento dado (tres días si no se indica); `unanswered` también considera transcripciones guardadas; `transcribe` reconoce nuevos audios antes de filtrar y `model` elige el modelo; los audios sin reconocer dejan `complete` en false, por lo que se conserva el límite anterior hasta completar la revisión |
| `tg_inbox` | `tg inbox`, `--since-time`, `--all` | mensajes sin leer o todos los posteriores a un momento, en una llamada; incluye chats silenciados y archivados solo si te mencionan o con `all`; no marca como leído ni cambia el punto de `tg inbox --new`; `transcribe` transcribe voz y `model` elige el modelo |
| `tg_account_show` | `tg account show` | cuenta conectada; solo muestra las cuatro últimas cifras del teléfono |
| `tg_account_sessions` | `tg account sessions list` | todos los dispositivos y aplicaciones con sesión; solo lectura |
| `tg_chats_list` | `tg chats list`, `--search`, `--kind`, `--unread` | chats recientes primero; filtra sobre todos los chats devueltos; indica `partial` cuando el mensajero no puede proporcionar la lista completa |
| `tg_chats_members_audit` | `tg chats members audit` | miembros con señales propias de un bot; no elimina a nadie, y `more` y `unknown` indican datos incompletos |
| `tg_chats_stats` | `tg chats stats --offline` | actividad guardada de un grupo o canal; no se piden los cambios de miembros, por lo que se omite `members`; las cifras incompletas son un mínimo |
| `tg_chats_events` | `tg chats events`, `--since-time`, `--type` | quién se unió, salió, fue añadido o eliminado y quién actuó, según los mensajes de servicio; últimos siete días si no hay `since_time` |
| `tg_chats_members` | `tg chats members list` | miembros del grupo por páginas, con función y última conexión |
| `tg_chats_inspect` | `tg chats inspect` | destino de enlaces públicos o invitaciones, sin unirse |
| `tg_topics_enable` | `tg topics enable` | activa un foro según `groups`; solo el propietario puede activar temas; convertir un grupo básico requiere una opción explícita y devuelve un nuevo identificador de chat |
| `tg_topics_create` | `tg topics create` | crea un tema según `groups`; tras un resultado desconocido consulta `tg_topics_list` en vez de repetir, incluso con el mismo `send_id` |
| `tg_topics_list` | `tg topics list`, `tg topics search` | temas de un foro con sus identificadores; `search` busca en títulos |
| `tg_chats_show` | `tg chats show` | un chat y sus miembros |
| `tg_contacts_list` | `tg contacts list` | personas con las que existe un chat individual |
| `tg_contacts_show` | `tg contacts show` | una persona y los chats compartidos |
| `tg_contacts_lookup` | `tg contacts lookup` | persona asociada a un teléfono, si su privacidad lo permite; no añade contactos |
| `tg_contacts_context` | `tg contacts context` | lo que el almacén guarda sobre una persona en cada mensajero vinculado a ella: chats compartidos, últimos mensajes en cada sentido, mensajes recientes y menciones; nunca se conecta; cuenta como lectura de mensajes, así que `messages: deny` la oculta |
| `tg_messages_evidence` | `tg messages evidence`, `--limit`, `--before-id` | paquete local de fuentes de un chat, recientes primero, con localizadores, huellas, cobertura y `nextBeforeId`; usa el cursor como `before_id`; mensajes completos hasta 64 KiB de elementos JSON, cabecera adicional; cobertura histórica desconocida; si el primer mensaje excede el límite, devuelve un paquete vacío truncado por bytes y sin cursor; no se conecta ni marca como leído; permiso `messages.evidence` |
| `tg_messages_list` | `tg messages list`, `--before-id`, `--before-time`, `--after-id`, `--after-time` | mensajes de un chat; `before_id` o `before_time` retroceden y `after_id` o `after_time` avanzan: como máximo una opción; no marca como leído, eso lo hace `tg_chats_mark_read` con su propio permiso; la voz ya transcrita incluye `transcript`, `transcribe` procesa el resto y `model` elige el modelo |
| `tg_messages_context` | `tg messages show`, `context`, `--before-n`, `--after-n` | mensaje y contexto a ambos lados; `before_n` y `after_n` indican cuántos |
| `tg_messages_scheduled` | `tg messages scheduled` | mensajes pendientes de envío, del más próximo al más lejano, con `scheduledFor` |
| `tg_messages_photo` | `tg messages download` | foto de un mensaje como imagen para visualizar, hasta 512 KB; `index` elige un adjunto; rechaza otros tipos e indica el comando `tg messages download` para guardarlos |
| `tg_messages_transcribe` | `tg messages transcribe` | voz a texto mediante Telegram (Premium o prueba semanal), o un modelo local; `local: true` omite Telegram; `model` elige el modelo de voz descargado; `pending: true` significa que no terminó en un minuto; si falta el modelo, indica `tg models audio download` sin descargarlo automáticamente |
| `tg_messages_search` | `tg messages search` | busca en lo guardado en este equipo; local por defecto; la opción `sync_first` descarga los mensajes nuevos si `messages.sync-first: allow` |
| `tg_messages_link` | `tg messages link` | enlace permanente cuando se admite y localizador vinculado a la cuenta; solo lectura; el enlace no añade miembros al chat |
| `tg_messages_send` | `tg messages send`, `--reply-to`, `--topic` | enviar con `messages.send`; `reply_to` responde a un mensaje del tema elegido; `send_id` repite un envío de resultado desconocido en el mismo chat y tema; `silent`, `no_preview` y `md` equivalen a `--silent`, `--no-preview` y `--md`; `topic` elige un tema del foro; `at_time` programa el envío, sin reintentos, y el formulario de confirmación muestra la hora; `file` o `photo` adjunta un archivo local y usa el texto como leyenda (`as_file` mantiene un vídeo como archivo), `voice` envía Ogg Opus como mensaje de voz; se rechazan archivos ocultos, `~/.ssh`, las carpetas de tg y su almacén de mensajes, sin posibilidad de eludirlo mediante MCP |
| `tg_messages_edit` | `tg messages edit` | cambia el texto de un mensaje propio según `messages.edit`; `md` equivale a `--md`; repetir no produce nuevos cambios |
| `tg_chats_mark_read` | `tg chats mark-read` | marca como leído hasta el mensaje más reciente o `until`, según `chats.mark-read`; la otra persona lo ve |
| `tg_messages_delete` | `tg messages delete` | elimina hasta 10 mensajes de tu vista según `messages.delete`, con formulario por defecto; nunca para todos; cada mensaje cuenta para el límite por hora |
| `tg_reactions_add`, `tg_reactions_remove` | `tg reactions add`, `remove` | tu reacción a un mensaje, según `reactions`; el formulario muestra el emoji |
| `tg_polls_show` | `tg polls show` | encuesta e identificadores de respuestas; solo lectura |
| `tg_polls_vote`, `tg_polls_close`, `tg_polls_create` | `tg polls vote`, `close`, `create` | votar por identificador de respuesta (`polls.vote`), cerrar una encuesta propia (`polls.close`), crearla (`polls.create`, con `send_id` para reintentar en el mismo chat y tema, `revote` para permitir cambiar el voto y `topic` para elegir un tema abierto del foro) |
| `tg_messages_forward` | `tg messages forward` | reenvía un mensaje a otro chat (`to`) según `messages.forward`; `send_id` reintenta un reenvío de resultado desconocido |
| `tg_messages_pin`, `tg_messages_unpin` | `tg messages pin`, `unpin` | fija un mensaje sin aviso salvo `notify`, según `messages.pin` y `messages.unpin` |
| `tg_chats_create`, `tg_chats_join`, `tg_chats_leave` | `tg chats create`, `join`, `leave` | crea grupo o canal con las personas indicadas, se une mediante enlace o sale; todos los cambios son visibles |
| `tg_chats_update` | `tg chats update` | cambia nombre, descripción o ajustes del grupo o canal; sus miembros ven el cambio |
| `tg_chats_link_show`, `tg_chats_link_reset` | `tg chats link show`, `reset` | consulta el enlace de invitación o crea otro que invalida el anterior |
| `tg_chats_members_add`, `tg_chats_members_remove` | `tg chats members add`, `remove` | añade miembros (se notifica a cada uno) o los elimina; sus mensajes permanecen |
| `tg_chats_admins_add`, `tg_chats_admins_remove` | `tg chats admins add`, `remove` | otorga o retira los permisos indicados de administrador |
| `tg_chats_folders_list`, `_create`, `_update`, `_delete` | `tg chats folders …` | carpetas de chats: crear, renombrar, cambiar chats o eliminar carpeta; los chats permanecen |
| `tg_chats_rules_show`, `tg_chats_moderate` | `tg chats rules show`, `tg chats moderate` | consulta reglas y revisa nuevos mensajes y miembros; actúa si los niveles de las reglas lo permiten ([grupos](./groups.md)) |
| `tg_account_update` | `tg account update` | nombre o descripción visibles de tu perfil |
| `tg_contacts_rename` | `tg contacts rename` | nombre de una persona que solo tú ves |
| `tg_messages_stats` | `tg messages stats` | cuenta los resultados de una consulta local por chat, remitente, día u hora |
| `tg_conversations_batches_status`, `tg_conversations_batches_next` | `tg conversations batches …` | volumen de lotes y mensajes acotados; se leen tras el consentimiento del propietario |
| `tg_conversations_links_add`, `tg_conversations_links_clear`, `tg_conversations_build` | `tg conversations links …`, `build` | guarda o borra los vínculos del agente y reconstruye; `conversations.links` |
| `tg_attachments_list`, `tg_attachments_text_set` | `tg attachments list`, `text set` | rutas conservadas y estado del texto; guarda el texto del agente para `content:` |
| `tg_tags_list`, `tg_tags_add`, `tg_tags_remove` | `tg tags list`, `add`, `remove` | etiquetas propias del propietario en un chat, una persona o un mensaje, guardadas en el almacén local y nunca enviadas; las escrituras según `tags.add` y `tags.remove`, rechazadas con `ask` porque no hay nada que preguntar |
| `tg_searches_list`, `tg_searches_history` | `tg searches list`, `history` | búsquedas guardadas por nombre, y las búsquedas y recuentos ejecutados; `saved` en `tg_messages_search` y `tg_messages_stats` ejecuta una |
| `tg_searches_create`, `tg_searches_delete`, `tg_searches_clear` | `tg searches create`, `delete`, `clear` | guarda una búsqueda sin ejecutarla, elimina una búsqueda guardada o una fila del historial, vacía el historial; solo el almacén local |
| `tg_conversations_status`, `tg_conversations_related` | `tg conversations status`, `related` | estado del archivo y conversaciones similares a partir de los vectores conservados |
| `tg_conversations_refresh` | `tg conversations search --refresh` | reconstrucción local acotada e indexación semántica; escribe según `conversations.embed`; nunca descarga un modelo |
| `tg_conversations_list`, `tg_conversations_show` | `tg conversations list`, `show` | conversaciones de un grupo identificadas en mensajes guardados y mensajes de una conversación |

Las respuestas son lo que imprime el comando con `--json`: una lista es `{ items, page, limit, hasMore }`, los mensajes de un chat son `{ items, limit, hasMore }` y los identificadores son cadenas. Los errores tienen forma `{ error: { code, message, … } }` con los códigos del CLI; los nombres de chat ambiguos devuelven `candidates`.

Las lecturas de Telegram se guardan en el archivo local, igual que con los comandos; las consultas de fuentes utilizan ese archivo. Cada llamada puede registrarse como ejecución (`tg runs list`), con nombres como `mcp chats list`.

## Prompts y chats mediante `@`

El servidor ofrece cinco prompts preparados; en Claude Code aparecen como comandos `/`:

| Prompt | Argumento | Qué hace el agente |
|---|---|---|
| `catch-up` | `kind`, `mode`: opcionales | llama a `tg_inbox`; `mode` es `unread` (predeterminado), `new` o un momento; `kind` elige los tipos de chat; marcar como leído requiere otra llamada a una herramienta aprobada |
| `reply` | `chat` | lee el chat, prepara un borrador y solo lo envía tras tu aprobación de ese texto |
| `find` | `text` | busca personas o palabras y muestra el contexto de cada resultado; no envía nada |
| `link-conversations` | ninguno | informa del coste y pide consentimiento; después lee lotes, guarda vínculos y reconstruye |
| `review` | `since`, `groups`: opcionales | llama una vez a `tg_review`, separa tus compromisos, los de otros y dudas; redacta recordatorios y solo los envía si los apruebas |

`reply` y `review` envían mediante `tg_messages_send`, así que si `messages.send` es `readonly`, el agente solo muestra borradores.

Los chats son recursos `tg://chat/<id>`; en Claude Code puedes mencionarlos con `@`. Cada recurso contiene el chat y sus mensajes recientes. La lista procede del archivo local y nunca se conecta a Telegram; está vacía hasta que se lea algo. Solo la lectura de un chat abre una conexión.

## Cómo se mantiene la conexión

La primera llamada se conecta a Telegram y las siguientes reutilizan la conexión. Se cierra tras 2 minutos sin llamadas y, en cualquier caso, 5 minutos después de abrirse, para que una sesión larga del agente no consulte datos desactualizados. La siguiente llamada vuelve a conectarse. Las llamadas se ejecutan de una en una, incluso si el cliente las envía juntas.

El servidor termina cuando el cliente cierra stdin y cierra su conexión con Telegram.

`tg_messages_link` devuelve `{ locator, url, access, reason }` sin el contenido del mensaje.
Comparte la validación de cuenta y las restricciones de acceso de `messages link`;
un enlace privado no añade miembros al chat.

El MCP personal valida los argumentos con el esquema anunciado y rechaza los campos desconocidos antes de conectarse o actuar. Usa `at_time` para programar; un momento relativo aprobado se ejecuta en la hora absoluta que muestra el formulario, aunque la respuesta llegue con retraso.

La actualización local de conversaciones se rechaza antes de escribir con nivel `ask` o con `--confirm-send`; ejecuta el comando del CLI con la aprobación del propietario.

En MCP, `tg_inbox` y `tg_review` aceptan `kinds` y `new`. MCP guarda sus propios puntos de control por chat, separados de `--new` del CLI. `new` no se puede combinar con `since_time`, ni con `unanswered` en review. Las escrituras por HTTP siempre requieren un formulario, sea cual sea el nivel de permiso o las opciones de confirmación.

MCP ofrece `tg_conversations_batches_status`, `tg_conversations_batches_next`, `tg_conversations_links_add`, `tg_conversations_links_clear` y `tg_conversations_build`, además del prompt `link-conversations`. Informa del coste de los lotes y obtén el consentimiento del propietario antes de leerlos. Los vínculos guardados requieren `conversations.links`; reconstruye después, también tras borrar vínculos. Los ajustes de indexación semántica remota también afectan a las búsquedas por MCP y pueden enviar el texto de la consulta.

`tg_attachments_list` muestra las rutas conservadas y el estado del texto; `tg_attachments_text_set` guarda el texto del agente para `content:`. La extracción solo está disponible en el CLI. `messages_context` acepta `offline: true` para los mensajes guardados.
