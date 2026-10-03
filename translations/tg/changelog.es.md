---
title: "Historial de cambios"
---

Cambios destacados de `@leemour/tg-cli`, con una sección por versión, de la más reciente a la más antigua. Se utiliza [versionado semántico](https://semver.org); antes de `1.0.0`, la interfaz de comandos todavía puede cambiar.

## 0.24.0 — 03.10.2026

### Cambios que pueden afectar a scripts

- `--md` usa el formato propio de Telegram para envíos, ediciones y pies de archivos, tanto personales como de bots. Admite estilos combinados, subrayado, spoilers, enlaces, bloques de código y citas. `__text__` significa subrayado; un solo `*text*` ahora significa negrita. MAX tiene otra sintaxis. Rechaza combinaciones no válidas y enlaces inseguros antes de escribir.

## 0.23.0 — 03.10.2026

### Cambios que pueden afectar a scripts

- **La búsqueda local usa por defecto un perfil estricto de Lucene:** grupos, campos tipados, intervalos de fechas, `--timezone`, comodines y expresiones regulares con límites, y cobertura incluso sin resultados. Escribe los prefijos explícitamente como `word*`; usa `--language legacy` para las coincidencias aproximadas anteriores. La guía de búsqueda y la skill explican la migración. El `--regex` de JavaScript se ejecuta de forma aislada, con límites de tamaño y tiempo.

- **`tg upgrade --json` siempre incluye `restarted`**, también en comprobaciones y actualizaciones sin cambios. Conserva los campos anteriores y la política de reinicio de servidores administrados. Los scripts que validan las claves exactas deben aceptar una lista vacía cuando no se reinicie ningún servidor.

### Novedades

- **`tg mcp` libera el modelo de búsqueda tras diez minutos sin búsquedas:** `conversations_search` ya no ocupa alrededor de 1 GB de memoria durante toda la sesión del agente. La siguiente búsqueda carga de nuevo el modelo en aproximadamente un segundo.
- **`tg <bot> bot me` y el MCP `tg_bot_me`** muestran identificador, nombre y nombre de usuario del bot. Usa el token, rechaza el modo sin conexión y no envía mensajes.

- La instalación global de npm instala la skill antes de iniciar sesión cuando se permite su script. En Windows guarda la carpeta de comandos de npm en el PATH del usuario y conserva el lanzador `.cmd` para políticas restrictivas de PowerShell. El instalador de Windows también actualiza la terminal actual, instala skills aunque se omitan scripts y comprueba `tg` sin acceder a la cuenta.

- **La configuración se encuentra nada más instalar:** la ayuda principal y los errores de primer uso indican `tg setup`; la ayuda de setup y sesiones incluye ejemplos, instrucciones para agentes y consejos para Windows. Las guías de inicio, instalación, MCP y seguridad explican el primer uso guiado. `tg skill show` funciona antes de iniciar sesión y setup lo indica al finalizar.

- **`tg topics enable` activa temas de foro y `tg topics create` crea un tema con nombre.** Los grupos básicos requieren `--upgrade --yes`; cambia su identificador y el resultado devuelve la nueva dirección. CLI y MCP comprueban permisos e informan de resultados parciales si la conversión funciona pero la activación falla. Crear temas usa `--send-id` para identificar el intento; rechaza reutilizarlo si ya se envió o el resultado es desconocido. Nunca repitas una creación de resultado desconocido. Los mensajes archivados conservan sus identificadores de chat originales.

- **`tg messages send --topic` y `tg polls create --topic` envían a un tema de foro.** Texto, pies de archivos, respuestas y mensajes programados conservan el tema. Rechaza temas inexistentes o cerrados y respuestas a otro tema antes de enviar. MCP acepta la misma dirección como `topic`.
- **`tg setup` guía el primer uso:** comprobaciones locales, registro de aplicación automático o en navegador, acceso por QR o teléfono, consulta de cinco chats y skill opcional. Reutiliza sesiones, explica los cinco minutos y deja las descargas de historial como decisión aparte. Windows incluye lanzadores `.cmd` y una alternativa npm exec si falta PATH.

- **`tg mcp setup codex|claude-code` y `tg mcp doctor`** añaden el servidor local al cliente y comprueban la conexión inicial y las herramientas. Setup requiere `--allow-writes` si el perfil ofrece escritura; doctor no comprueba el acceso a Telegram.
- **`tg <bot> bot store fetch <chat>` importa mensajes anteriores de canales y supergrupos** al archivo local del bot, sin enviar ni marcar como leído. Usa `--from <message link>` al empezar si no conoces un número de mensaje; las ejecuciones siguientes continúan hacia atrás. Rechaza chats privados y grupos básicos. Consulta [la guía de bots](./bot.md#fetching-older-messages).

### Correcciones

- **Una lista truncada de `tg runs list --limit` sugiere aumentar `--limit`**, en vez de usar la opción inexistente `--page`. El JSON conserva `hasMore`; leer ejecuciones guardadas no crea otro registro.
- Los fallos tempranos de comandos del bot usan sus ajustes de registro; un subcomando desconocido ya no atribuye el fallo a un perfil válido. El ejecutor compartido aplica estas reglas de forma consistente.

- Al completar el acceso se acortan correctamente las rutas personales de Windows. Las comprobaciones de documentación reconocen sus separadores de rutas. Los tests de permisos Unix solo se aplican en Unix; en Windows el acceso sigue ACL heredadas, como explica la guía de seguridad.

## 0.22.0 — 03.10.2026

### Novedades

- **`tg messages evidence <chat>` y `tg_messages_evidence` por MCP** preparan un paquete limitado de fuentes del archivo local para un resumen del agente, sin conectar ni marcar como leído. Incluyen localizadores, huellas, cobertura explícita y cursor para páginas anteriores. Los mensajes completos caben en 64 KiB de elementos JSON; `--limit` acepta 1–100.
- **`tg <name> bot contacts show --refresh`** tiene la misma ayuda que `max`, sin nombrar el servicio (cli-messaging 0.109.0).
- **La documentación de bots está completa** ([bots](./bot.md)): identificadores de chats, archivos y límites, y códigos de salida para scripts.
- **`tg <name> bot contacts show`, `bot messages search` y `bot messages between`** consultan lo guardado en este equipo. Consulta [archivo del bot](./bot.md#what-the-bot-kept).
- **`tg <name> bot chats moderate` y `bot chats rules`** revisan mensajes nuevos según reglas y actúan si estas lo permiten. Solo revisan lo guardado por `bot watch`, ya que Telegram no ofrece historial. Consulta [moderación de bots](./bot.md#moderating-a-group-by-its-rules).
- **`tg <name> bot mcp` conecta el bot al agente** mediante MCP, con herramientas según permisos. Eliminar muestra formulario primero. Consulta [MCP para bots](./bot.md#the-bot-for-an-agent-mcp).
- **`tg messages search` admite lenguaje de consulta:** `"a phrase"`, `-word`, `a OR b` y filtros `from:`, `chat:`, `after:`/`before:` y `has:`. Corrige erratas y lo avisa por stderr. `--context <n>` muestra contexto (2 en terminal). `in:max`, `in:all` y `--source` incluyen otras cuentas guardadas, también MAX. Consulta [búsqueda](./archive.md#search).
- **Búsqueda de conversaciones por significado:** `tg conversations embed --chat <chat>` calcula vectores locales y `tg conversations search "<question>"` encuentra conversaciones próximas en uno o todos los chats procesados. `tg models text list|download` descarga el modelo una vez en la carpeta compartida con voz. Con tu clave, `--provider openai` o `--base-url` para Ollama, LM Studio y similares usa un servicio después de explicar qué se enviará y cuánto puede costar. Consulta [búsqueda semántica](./archive.md#search-by-meaning).
- **`tg store fetch` ya no se ejecuta indefinidamente** si Telegram devuelve mensajes repetidos.
- **`tg bot watch`** recibe actividad y la guarda antes de imprimir; `--events` incluye ediciones, botones, entradas y salidas. **`tg bot callbacks answer`**, **`tg bot commands list|set|clear`** y **`tg bot webhooks
  list|set|delete`**, como `max bot`. Consulta [bots](./bot.md).
- **`tg bot chats admins list|add|remove`** y **`tg bot chats members remove [--block]`** consultan administradores, permisos y título; permiten ascender con `--can` y `--title`, retirar permisos y eliminar personas definitivamente con `--block`. Consulta [bots](./bot.md).
- **`tg bot messages send|list|show|edit|delete|pin|unpin`** y **`tg bot chats show|leave|action`** escriben por identificador, título o `user:<id>`, con `--md`, `--html`, archivo o foto. Sin historial de Telegram, `list` y `show` usan lo enviado y recibido en el equipo. Eliminar pregunta; `--allow-dangerous` aprueba.
- **Tu agente puede vincular conversaciones cuando se lo pidas:** `tg skill show
  link-conversations` es la guía. Explica cuánto leerá y espera aprobación; después procesa lotes (`tg conversations batches next`, `tg conversations links add`). `tg conversations links clear` elimina respuestas. tg no llama a modelos. Consulta [archivo local](./archive.md).
- **`tg mcp` ofrece la guía como recurso `tg://skill`** y la menciona al conectar; el agente puede leerla sin ejecutar `tg skill show`.

### Cambios que pueden afectar a scripts

- **`tg messages search` ordena por mejores coincidencias**, no por fecha; `--newest` restaura el orden anterior. Sin mensajes que contengan todas las palabras, busca cualquiera y después fragmentos. Mantiene `items`, `limit` y `hasMore`; añade `match` y `score` por resultado, `corrections`, `completeness` por chat y `wordsReady`. Acepta consultas de una o dos letras.
- **tg requiere Node 22.16 o posterior**, o Bun. Si Node en Linux usa SQLite del sistema demasiado antiguo, `tg` se reinicia con el SQLite de `@leemour/cli-messaging-sqlite` antes de leer o enviar. Las versiones oficiales de Node y Bun no notan el cambio.

### Correcciones

- **Los rechazos de escritura del bot indican un comando de configuración válido** con `--bot` y la clave de permiso (cli-messaging 0.111.0). Antes colocaban `config` dentro de `bot`, donde no existe.
- **Los comandos locales ya no dicen que cambian Telegram.** `config set` y `unset`, `chats rules set` y `unset`, `recipients add`, `remove` y `clear`, y `auth set`, `auth remove`, `recipients add`, `remove` y `clear` del bot solo modifican configuración, reglas, listas o almacén de claves. La [referencia](./commands.md) indica "Changes something on this computer only.". Siguen siendo escrituras en `tg commands`. `chats moderate` y `session end` siguen indicando cambios en Telegram.
- **`tg contacts show` incluye el chat individual** entre los compartidos, recientes primero. Antes solo mostraba grupos porque la lista de chats comunes de Telegram solo incluye grupos.

## 0.21.0 — 01.10.2026

### Novedades

- **`tg bot`**: bots de Telegram mediante la Bot API oficial y su token: `bot auth set|show|remove`, `bot list [--check]`, `bot chats list`, `bot recipients list|add|remove|clear` y `bot sends list`, como en `max bot`. Permite varios bots con nombres propios; el token se guarda como `bot:<name>` en el almacén de claves o en `TG_BOT_TOKEN`. Consulta [bots](./bot.md).
- **`tg conversations batches status|next --chat <chat> [--size <n>]`**: divide un grupo en lotes para que tu agente de IA vincule los mensajes en conversaciones. `status` indica los mensajes y lotes pendientes; `next` imprime el siguiente lote. tg no llama a ningún modelo.
- **`tg skill install [--for claude|agents|all]`** guarda la guía de tg donde la buscan Claude Code y otros agentes. Si un agente ejecuta tg sin tenerla instalada, se avisa una vez al día por stderr; `tg config set skillHint false --defaults` lo desactiva.
- **`tg store clear --left`** elimina del archivo local los chats abandonados y sus mensajes. Requiere `--allow-dangerous`; sin ella solo indica cuánto eliminaría.
- **`tg conversations build|list|show`** y **`tg messages links`**, con herramientas MCP `tg_conversations_list` y `tg_conversations_show`: identifica conversaciones de grupos en mensajes guardados por respuestas, menciones y turnos; sin peticiones a Telegram ni IA. No construye nada hasta ejecutar `build`. Consulta [archivo local](./archive.md#conversations-in-a-group).
- **Se conservan las menciones por nombre:** si alguien se menciona por nombre en lugar de @username, el mensaje guardado recuerda a quién se refiere para enlazar conversaciones.
- **`tg chats rules show|set|unset` y `tg chats moderate`**, con herramientas MCP `tg_chats_rules_show` y `tg_chats_moderate`: reglas para enlaces, invitaciones, reenvíos, mensajes repetidos y personas bloqueadas. Los niveles permiten denegar, solo informar, preguntar (predeterminado) o actuar. Nada se ejecuta en segundo plano. Consulta [grupos](./groups.md#rules).
- **`tg messages list --before-time`** retrocede desde una fecha ISO 8601 o intervalo anterior como `2h` / `1d`.
- **`tg contacts add|remove|block|unblock|rename|import`**, **`tg account update`** y **`tg account sessions end --others`**, con herramientas MCP `tg_contacts_add|remove|block|unblock|rename` y `tg_account_update`. `contacts import` lee líneas `number, name` y solo muestra cantidades y usuarios reconocidos. Cerrar otras sesiones también desconecta el móvil: pregunta primero y nunca se ofrece a un agente.
- **`tg chats folders list|create|update|delete`**, con herramientas MCP `tg_chats_folders_list|create|update|delete`. Cambiar los chats de una carpeta conserva los demás; no se muestra «Todos los chats» porque no se puede modificar.
- **`tg chats members add|remove`** y **`tg chats admins add|remove`**, con herramientas MCP `tg_chats_members_add|remove` y `tg_chats_admins_add|remove`. `--can` admite members, admins, info, pin, link, post, edit y delete; Telegram no tiene permiso independiente de lectura. Al añadir se indica quién no pudo añadirse; cada persona cuenta para el límite por hora.
- **`tg chats update <chat>`**, con `--title`, `--description`, `--all-can-pin on|off`, `--only-admins-add on|off`, y **`tg chats link show|reset`**, con herramientas MCP `tg_chats_update`, `tg_chats_link_show`, `tg_chats_link_reset`. `tg chats show` incluye descripción, enlace y ajustes del grupo.
- **`tg chats create <title> [person...]`, `tg chats join <link>`, `tg chats leave <chat>`**, con herramientas MCP `tg_chats_create`, `tg_chats_join`, `tg_chats_leave`. Un grupo nuevo siempre es un supergrupo (`--channel` crea canal); se enumeran las personas que no se pudieron añadir. Consulta [uso](./usage.md#groups-and-channels).
- **Permisos por comando, tanto para ti como para agentes.** `permissions` asigna niveles a rutas: `deny` (ni lectura), `readonly`, `ask` o `allow`. Gana la clave más específica: `tg config set permissions.messages.delete allow`. Por defecto todo se permite salvo eliminar mensajes y cerrar otras sesiones, que preguntan. `ask` pregunta y/N; `--allow-dangerous` para eliminar y la nueva `--yes` para otras escrituras aprueban en scripts. `readOnly` y `allow` siguen funcionando. Consulta [seguridad](./security.md).
- **`tg messages send --voice <file>`** envía Ogg Opus como nota de voz; `.mp4` y `.mov` con `--file` se reproducen como vídeo. `--as-file` conserva el archivo descargable.
- **`tg messages list --mark-read`** marca como leído hasta el mensaje más reciente mostrado. Ninguna otra lectura marca mensajes.
- **`--model` junto a `--transcribe`** en `tg messages list` y `tg inbox`, y **`tg review
  --transcribe`**: la revisión incluye texto de notas de voz.
- **`tg store fetch --last <n>`** detiene la descarga cuando conserva los n mensajes más recientes; repetir el mismo `--last` consulta una página y termina.
- **`tg polls create --revote`** permite cambiar el voto.
- **`tg store export --output <file> --since-time <time>`.** Exporta a un archivo nuevo legible solo por ti, sin sobrescribir, y permite empezar desde una fecha.
- **`tg account show` muestra las cuatro últimas cifras del teléfono** y el número completo con `--show-phone`. `tg_account_show` siempre muestra solo las cuatro últimas.
- **`tg messages forward --send-id`.** Reintenta un reenvío sin respuesta con el identificador del error; Telegram conserva una copia, igual que en envíos. `--json` incluye `sendId`; `tg_messages_forward` acepta `send_id`.
- **`tg messages edit --md`** formatea como `messages send --md`; `tg_messages_edit` acepta `markdown`.
- **Mantenimiento del archivo local: `tg store info`, `check`, `migrate`, `backup`, `restore`.** `info` indica ubicación de `messages.db`, tamaño, esquema y filas. `check` comprueba integridad, claves externas, índices y espacio libre; identifica chats cuyo historial termina antes del último mensaje y no repara nada. `migrate` actualiza y normaliza mensajes anteriores. `backup <file>` copia el archivo en uso con acceso solo para ti, sin sobrescribir. `restore <file>` restaura una copia y conserva al lado el archivo sustituido; rechaza si `tg serve` está activo o algún proceso tiene la base abierta. La base se comparte con max-cli: reinicia después los `serve` y `mcp` activos de ambos CLI.
- **Cada escritura tiene identificador propio, `operationId`.** Envios, ediciones, reenvíos, eliminaciones, mensajes fijados, reacciones, marcado como leído y votos lo incluyen en `--json` y MCP, registro de envíos y `--trace`, para seguir una operación desde respuesta a registro. En envíos, `operationId` equivale a `sendId`.
- **Unos 16 MB menos al instalar:** cli-messaging 0.60.0 incluye su capa de base de datos en lugar de depender de ella.

### Cambios que pueden afectar a scripts

- **`tg server status --json` usa los campos comunes a ambos CLI:** `since` pasa a `startedAt`, `listening` a `connected`, `listeningSince` a `connectedAt`; añade `cliVersion`, `log` y `stale` si un `serve` desaparecido dejó un bloqueo. `tg server start` devuelve `startedAt` y `connectedAt` igual; `tg server stop` indica quién lo inició (`by`). El texto dice "connected" en lugar de "listening".
- **`tg messages send --at` pasa a `--at-time`**, como las demás opciones de tiempo.
- **Los argumentos MCP usan el nombre de sus opciones:** `tg_messages_list` acepta `before_id`, `before_time`, `after_id`, `after_time`; `tg_messages_context`, `before_n`, `after_n`; `since` pasa a `since_time` en `tg_inbox`, `tg_review` y `tg_chats_events`; en esta última, `event` pasa a `type`. `tg_messages_send` acepta `md` y `at_time`.
- **Las opciones indican el tipo de valor.** Los nombres anteriores se rechazan como desconocidos, sin alias. Los argumentos MCP no cambian.
  - `tg messages list --before` pasa a `--before-id`; `--after` pasa a `--after-id` para identificadores y `--after-time` para fechas, evitando confundirlos.
  - `tg messages context --before` y `--after` pasan a `--before-n` y `--after-n`.
  - `--since` pasa a `--since-time` en `tg inbox`, `tg review`, `tg chats events` y `tg store fetch`.
  - `tg messages download --output` pasa a `--output-dir`.
  - `tg chats events --event` pasa a `--type`.
- **`tg review --unanswered` acepta una duración**, como `4h` o `1d`, no horas sin unidad; rechaza `--unanswered 4`. Sin valor siguen siendo 24 horas. `tg_review` en MCP sigue aceptando horas.
- **`tg chats events --json` imprime `{ items, page, limit, hasMore, chatId, since }`**: `events` pasa a `items` y `more` a `hasMore`. **`tg server logs --json`** cambia `lines` por `items`. `--jsonl` no cambia.
- **`.mp4` y `.mov` con `--file` se reproducen como vídeo**; antes llegaban como archivos. Añade `--as-file` para mantenerlos descargables.
- **`tg mcp` ofrece herramientas según permisos del perfil, no opciones.** Por defecto un agente puede enviar, editar, reenviar, reaccionar, votar y marcar como leído sin `--allow-send` ni formulario; eliminar muestra un formulario (`tg mcp --allow-dangerous` lo omite). Para solo lectura, usa un perfil con `readOnly`: consulta [MCP](./mcp.md). `--allow-send`, `--allow-mark-read` y `--allow-delete` ya no deciden nada y muestran avisos; `--confirm-send` sigue mostrando todas las escrituras.
- **`tg messages delete` pregunta** en terminal si falta `--allow-dangerous`, en lugar de rechazar; sin terminal sigue rechazando.
- **Desaparece `tg store fetch --max <n>`; `--limit <n>` limita la ejecución** a ese número de mensajes (1000 por defecto) y `--page-size <n>` indica mensajes por petición (100 por defecto), como max-cli. `--max` no se conserva como alias.
- **Las encuestas sin `--revote` ya no permiten cambiar el voto**, como max-cli; Telegram lo permitía por defecto. Añade `--revote` para mantener el comportamiento anterior.
- **`tg polls vote` y `tg polls close --json` imprimen `{ operationId, poll }`** en lugar de solo la encuesta; léela desde `.poll`. `tg_polls_vote` y `tg_polls_close` responden igual.
- **`tg runs list`, `tg sends list` y `tg recipients list --json` imprimen `{ items, page, limit, hasMore }`** en lugar de un array, igual que las demás listas. Lee `.items`. `--jsonl` no cambia.

### Correcciones

- **`tg chats list` ya no duplica chats fijados.** Al incluir archivados, las páginas de Telegram repetían fijados más adelante; en una cuenta se duplicaban 8 de 1361. El título también coincidía consigo mismo dos veces y podía rechazarse como ambiguo.
- **`tg server stop` y Ctrl-C terminan `serve` y `watch` correctamente.** serve se cerraba antes de limpiar el bloqueo y `tg server status` mostraba `stale` después de cada parada.
- **`tg server` en una copia de desarrollo no toca la unidad systemd instalada.** Un repositorio con `TG_STATE_DIR` o base de datos propia obtiene otro nombre de unidad; la instalación conserva `tg-serve-<profile>.service`.
- **Los chats abandonados ya no aparecen en `chats list --offline`.** Desaparecen cuando `tg chats list` consulta la lista completa; sus mensajes permanecen hasta `tg store clear --left` y vuelven si te unes de nuevo.
- **Dos rechazos explican qué hacer.** Si intentas volver a añadir a alguien que salió o fue eliminado y no sois contactos mutuos, indica enviarle el enlace (`tg chats link show <chat>`). Si nombras por identificador a alguien que la cuenta nunca vio, indica usar @username o leer primero un chat compartido.
- **Los argumentos rechazados por la biblioteca ya no repiten lo escrito.** Su error podía revelar títulos o enlaces. Ahora identifica el tipo de entrada incorrecta cuando puede —chat al que no perteneces, enlace de mensaje o invitación, teléfono, código o contraseña— o informa de que Telegram rechazó un argumento.
- **Las conversaciones se muestran en inglés.** Los mensajes propios aparecen como `you` y los días como `26 September 2026`; antes estaban en ruso.
- **Chats y mensajes no encontrados devuelven `not_found`** y chats de tipo inadecuado devuelven `validation_error`. Antes eran fallos desconocidos con código 1 y texto de la biblioteca que podía repetir títulos.
- **El error "not logged in" indica tu perfil:** `tg <profile> session start`, como las demás pistas de acceso.
- **Descargas y exportaciones vuelven a usar tus permisos habituales.** Desde la primera versión, abrir una sesión hacía que todos los archivos escritos después solo fueran legibles por ti. La sesión y sus archivos asociados siguen siendo privados.

## 0.20.0 — 30.09.2026

### Novedades

- **Se guarda @username del remitente en el archivo local**, para que `--from @name` y la futura vista de conversaciones relacionen menciones y personas. Desde cli-messaging 0.57.0; el historial previo lo incorpora al descargarse de nuevo.
- **`tg store fetch <chat> --since <time>`** detiene al llegar a mensajes anteriores a la fecha: `2026-09-01` o `2h` / `1d` atrás.

### Cambios que pueden afectar a scripts

Los comandos siguen un criterio: sustantivo y después verbo. Los nombres anteriores desaparecen sin alias; los scripts que los usan fallan con "unknown command" o "unknown option".

- **`tg export <chat>` pasa a `tg store export <chat>`**, **`tg sync status [chat]` a `tg store status [chat]`**, **`tg backfill <chat>` a `tg store fetch <chat>`** y **`tg backfill list|status|cancel` a `tg store jobs list|show|cancel`**. `store fetch` descarga por defecto; `--estimate` solo estima. `--pace` pasa a **`--pause`** aquí y en `tg messages download --all`. `--max` conserva su nombre: cuenta mensajes.
- **Desaparece `tg messages reply`:** `tg messages send <chat> [text] --reply-to <id>` responde y acepta todas las opciones de envío (`--file`, `--photo`, `--silent`, `--at`, …). `msg:telegram/…` no tiene sustituto: indica chat e identificador.
- **`tg chats read` pasa a `tg chats mark-read`**; `tg_chats_read` pasa a `tg_chats_mark_read`.
- **`tg recipients off` pasa a `tg recipients clear`.**
- **`tg update [--check]` pasa a `tg upgrade [--check]`**; el aviso diario indica `tg upgrade`.
- **`tg messages search <words…>` llama a su argumento `<text…>`**; la búsqueda no cambia.

## 0.19.0 — 30.09.2026

### Correcciones

- **tg termina al finalizar el comando.** Una descarga llegó a permanecer activa media hora después de imprimir, con o sin `--timeout`. Si algo sigue abierto cinco segundos después de finalizar, tg lo identifica por stderr y sale con el código del comando. Espera a que termine de escribirse la salida.

## 0.18.0 — 30.09.2026

### Correcciones

- **Supergrupos y canales vistos primero mediante un mensaje ya no pierden mensajes por eliminaciones en chats privados** (cli-messaging 0.54.0). En 0.16.0 el archivo no conocía aún su tipo; ahora basta el identificador `-100…`.
- **Los mensajes marcados por error como eliminados reaparecen** al volver a leer el chat (`messages list`, `messages context` o edición recibida en directo). Las eliminaciones posteriores a la lectura se conservan.

## 0.17.0 — 30.09.2026

### Novedades

- **`tg messages download <chat> --all`** guarda todos los archivos —fotos, documentos, vídeos, voz— en `--output`, recientes primero. Si se interrumpe por `--timeout` o Ctrl-C, reanuda y recoge mensajes nuevos; guarda el progreso en `.download-<chat>.json`. Espera hasta cinco minutos si Telegram exige "wait N seconds"; `--pace` (1 s) separa páginas. Los nombres repetidos reciben el identificador como prefijo; nunca sobrescribe. (cli-messaging 0.53.0)

## 0.16.0 — 30.09.2026

### Correcciones

- **Eliminar en chats privados o grupos básicos ya no marca mensajes de otros chats** (cli-messaging 0.52.0). Telegram no indica el chat en esas eliminaciones; antes se marcaban todos los mensajes con ese número, incluidos canales y supergrupos. Los ya marcados así permanecen marcados, pero conservan el texto.

## 0.15.0 — 30.09.2026

### Correcciones

- **Los modelos locales ya no omiten palabras dichas en voz baja.** Los tramos bajos se confundían con silencio; ahora Parakeet y GigaAM los transcriben. Los mensajes procesados anteriormente se vuelven a transcribir cuando los solicita `--transcribe`; las transcripciones de Telegram permanecen. (cli-messaging 0.51.0)

## 0.14.0 — 30.09.2026

### Novedades

Cambios visibles para otros que pasan por la protección como `messages send`: se rechazan en solo lectura, `allow` debe incluir el permiso, se aplican destinatarios y límites donde corresponda y `tg sends list` registra sin texto.

- **`tg messages edit <chat> <id> [text]`** cambia un mensaje propio; repetir la misma edición no cambia nada. `tg_messages_edit` con `mcp --allow-send`.
- **`tg messages forward <chat> <id> --to <chat> [--silent]`** comprueba el chat de destino. Si el resultado es desconocido, consulta el destino antes de repetir. `tg_messages_forward`.
- **`tg messages pin|unpin <chat> <id>`** sin aviso salvo `--notify`; en chats individuales fija solo de tu lado. `tg_messages_pin` y `tg_messages_unpin`.
- **`tg reactions add <chat> <id> <emoji>`** y **`tg reactions remove <chat> <id>`**; las reacciones no cuentan para el límite. `tg_reactions_add` y `tg_reactions_remove`.
- **`tg chats read <chat> [--until id]`** marca como leído y la otra persona lo ve. `tg_chats_read` solo aparece con la nueva **`tg mcp --allow-mark-read`**, no con `--allow-send`.
- **`tg messages delete <chat> <id…> --allow-dangerous [--for-everyone]`** elimina hasta 10, solo para ti salvo `--for-everyone`, y nada sin `--allow-dangerous`. En supergrupos y canales se requiere `--for-everyone`. La nueva **`tg mcp --allow-delete`** ofrece `tg_messages_delete`, que solo elimina tu copia.
- **`tg polls show|vote|close|create`** consulta identificadores, vota por identificador (nunca posición) o `--retract`, cierra tu encuesta o crea una pública salvo `--anonymous`, con `--send-id` para reintentos seguros. `tg_polls_show` lee; `tg_polls_vote`, `_close` y `_create` requieren `--allow-send`.

## 0.13.0 — 30.09.2026

### Cambios que pueden afectar a scripts

- **La base de datos compartida pasa al esquema 6** (cli-messaging 0.49.0). La primera ejecución actualiza `messages.db`; un `max` anterior al publicado ese día lo rechaza y pide actualizar: `npm install -g @leemour/max-cli@latest`. Los comandos propios de `tg` no cambian.

## 0.12.0 — 30.09.2026

### Novedades

- **`tg chats inspect <link>`** y `tg_chats_inspect` muestran título, miembros, descripción, si perteneces y si requiere aprobación, sin unirse.
- **`tg topics list <chat>` y `tg topics search <chat> <text>`**, con `tg_topics_list`: temas de foro paginados, con el identificador que cada mensaje lleva en `threadId`.

## 0.11.0 — 30.09.2026

### Novedades

- **Los mensajes de voz incluyen texto en `tg messages list` y `tg inbox`.** Las transcripciones se guardan por perfil en la caché y aparecen al leer de nuevo: `transcript` en `--json`, `🎤 …` para personas. `--transcribe` procesa el resto mediante Telegram o modelo local durante hasta dos minutos para toda la lista; pendientes en `unheard`. Igual con `transcribe` en `tg_messages_list` y `tg_inbox`.
- **`tg chats members list <chat>`** y `tg_chats_members` muestran miembros paginados, función y última conexión, hasta el límite propio de Telegram de 10 000.
- **`tg contacts lookup`** encuentra al usuario de un teléfono si su privacidad lo permite. Número por stdin o introducido al solicitarlo, nunca como argumento. También `tg_contacts_lookup`.
- **`tg contacts sync`** guarda contactos e indica cuántos eran nuevos o cambiaron.
- **`tg account sessions list`** y `tg_account_sessions` enumeran dispositivos y aplicaciones sin IP, sin cerrar nada.

## 0.10.0 — 29.09.2026

### Novedades

- **Transcripción local.** `tg models audio list` y `tg models audio download <id>` descargan una vez Parakeet v3 (25 idiomas, predeterminado), GigaAM v3 o GigaAM v3 CTC (ruso) en `~/.cache/cli-common/models/audio`, carpeta compartida. `tg messages transcribe` consulta Telegram y usa modelo local si falta Premium; `--local` y `--model <id>` omiten Telegram. `transcribeWith` (`auto`, `messenger`, `local`) y `speechModel` definen los valores. Nunca descarga automáticamente.
- **`tg messages send --photo <path>` o `--file <path>`**, con texto como leyenda, y `photo` y `file` en `tg_messages_send`. Rechaza ocultos, `~/.ssh`, carpetas propias y base local salvo `--allow-any-file`; por MCP no hay excepción. El registro guarda tipo y tamaño, no nombre. Reintentar con `--send-id` conserva una copia (comprobado con una foto).
- **`tg update` reinicia el servidor con el nuevo tg**, para no conservar código antiguo; si serve se inició manualmente, indica que debes reiniciarlo. **`tg server status` avisa si serve es anterior a tg**, igual que max-cli.
- **`tg chats events <chat> [--since] [--event]`** y `tg_chats_events` muestran entradas, salidas, añadidos, eliminados y responsables, creación y renombrado de chat o mensajes fijados; últimos siete días por defecto. Máximo diez páginas por ejecución; `more` indica datos adicionales.

## 0.9.0 — 29.09.2026

### Novedades

- **`tg session start` indica quién inició sesión, ubicación de la sesión, origen de claves y siguiente paso** en frases. `--json` añade `session` y `appKeys` (`environment`, `keyring` o `file`, nunca las claves).
- **`tg chats list --search <text> --kind <kind> --unread`**, igual en `tg_chats_list`. Los filtros combinados se aplican a los 200 recientes; `--search` exige tres caracteres.
- **`tg messages list --after <id-or-time>`** avanza desde identificador o fecha (`2h`, `1d`, ISO 8601), antiguos primero. `after` en `tg_messages_list`.
- **`tg messages send --silent --no-preview --md`** sin aviso, sin tarjeta de enlace y con formato de Telegram `**bold**`, `_italic_`, `~~struck~~` y `` `code` ``. MCP admite `silent`, `no_preview` y `markdown`. El registro solo guarda longitud.
- **`tg messages send --at <time>`** programa en Telegram para `2h`, `1d` o `2026-10-01T09:00` local. `tg messages scheduled <chat>` (MCP `tg_messages_scheduled`) enumera pendientes. Nunca se reintenta un programado: rechaza `--send-id`.

### Cambios que pueden afectar a scripts

- **`tg service …` pasa a `tg server …`**, con `start|stop|restart|status|logs|install|uninstall`, como max-cli. Desaparece `tg serve status`; usa `tg server status`. Sin unidad, `tg server start` inicia en segundo plano. Se encuentran unidades creadas por `tg service install`. Desde cli-messaging 0.40.0.

## 0.8.0 — 29.09.2026

### Novedades

- **`tg review`** lee todos los mensajes, incluidos tuyos, en chats activos desde `--since` (tres días por defecto), para clasificar compromisos. Indica desde dónde continuar. `--chat` consulta uno; `--unanswered [hours]` filtra preguntas sin contestar, contando respuestas de administradores; `--all` incluye silenciados y archivados. `tg_review` y el prompt `review` hacen lo mismo.

## 0.7.0 — 29.09.2026

### Novedades

- **`tg messages transcribe <chat> <id>`** y `tg_messages_transcribe` convierten notas de voz o vídeo con Telegram, para Premium o prueba semanal. Suele tardar segundos; tg consulta hasta un minuto y después devuelve `"pending": true`. Los rechazos explican si no es voz, es demasiado largo o falta Premium.
- **`tg_messages_photo`** entrega al agente una imagen hasta 512 KB. Fotos mayores, archivos, vídeos y voz se rechazan indicando `tg messages download` para guardarlos.

## 0.6.0 — 29.09.2026

### Novedades

- **`tg inbox` omite silenciados y archivados** salvo menciones o respuestas a ti; `--all` y `all` en `tg_inbox` los incluyen. En cuentas activas solían ocupar los 20 chats leídos por `inbox` en cada ejecución. `quiet` cuenta los omitidos.
- **Los chats incluyen `muted`, `archived` y `unreadMentions`** en `--json`. `archived` sale de `providerMetadata`; `muted` no aparece si sigue el valor predeterminado de la cuenta.

### Correcciones

- **`tg messages send --silent`, `--no-preview` y `--markdown` rechazan el envío** en lugar de ignorar las opciones: llegaron con cli-messaging 0.32, pero tg aún no las transmitía a Telegram.

## 0.5.0 — 29.09.2026

### Novedades

- **`tg service install|uninstall|start|stop|status|logs`** ejecuta `tg serve` como unidad systemd de usuario en Linux o agente launchd en macOS, por perfil. `install` solo escribe; no inicia hasta `tg service start`.
- **`tg backfill <chat> --background`** descarga como tarea persistente. `tg backfill list`, `status [job]` y `cancel <job>` la gestionan. Ctrl-C o `cancel` detienen tras guardar la página actual.
- **`tg backfill <chat> --estimate`** estima mensajes, peticiones y segundos restantes desde el archivo local, sin consultar Telegram.
- **`tg export <chat> --format markdown`** exporta una transcripción legible.
- **`tg messages search --regex '<pattern>'`** aplica expresiones regulares al texto guardado.
- **`tg doctor report create`** genera informe con versiones, rutas, fallo y últimos envíos, sin texto y con identificadores sustituidos por etiquetas.
- **`tg session start --qr-file login.png`** guarda el QR como PNG para mostrarlo mediante un agente y lo elimina después. Con la aplicación ya guardada no necesita terminal.
- **`tg messages download <chat> <id> [--output dir]`** guarda fotos, archivos, vídeos o voz en la carpeta actual o `--output`, e indica ruta y tamaño. El nombre del remitente no puede salir de la carpeta ni ocultar el archivo; nunca sobrescribe. Vuelve a consultar el mensaje cada vez para descargar también los antiguos.

### Correcciones

- **`tg messages list --jsonl` y `tg messages search --jsonl` imprimen un mensaje por línea**, como indica `--help`. Antes imprimían la página en una línea; los scripts que leían `.items` deben leer cada línea como mensaje.

## 0.4.0 — 29.09.2026

### Novedades

- **`tg inbox`** muestra mensajes ajenos sin leer; `--new` solo los recibidos desde la última revisión, una vez cada uno. MCP ofrece `tg_inbox` y prompt `catch-up`.
- **`tg skill show`** imprime las instrucciones para agentes.
- **Prompts MCP y recurso de chat:** `reply`, `find` y `tg://chat/{id}`.

## 0.3.0 — 28.09.2026

### Novedades

- **`tg mcp`** ofrece un perfil por MCP mediante stdin/stdout. En esta versión era solo lectura por defecto; `--allow-send` ofrecía envíos y `--confirm-send` los mostraba primero. `tg mcp config` imprimía la configuración del cliente.

### Cambios que pueden afectar a scripts

- **Los fallos previos al comando se guardan**, incluidos errores de uso o configuración que no carga. `tg runs list` los muestra; `--no-record` lo desactiva.

## 0.2.0 — 28.09.2026

### Novedades

- **`tg update`** actualiza con el gestor de paquetes original; `--check` solo comprueba.
- **Aviso diario por stderr si hay nueva versión en npm**, solo en terminal y después del comando. `TG_NO_UPDATE_CHECK=1` lo desactiva.

## 0.1.0 — 27.09.2026

Primera publicación en npm.

### Novedades

- **Inicio de sesión** por QR o teléfono (`tg session start`); credenciales de my.telegram.org obtenidas desde navegador o automáticamente (`--app auto`) y guardadas en el almacén de claves.
- **Lectura:** `account show`, `chats list|show`, `contacts list|show`, `messages list|show|context`.
- **Envíos** con `messages send` y `messages reply`, protegidos por destinatarios, perfiles de solo lectura, registro de intentos (`tg sends`) y `--send-id` para reintentar resultados desconocidos sin duplicar.
- **Archivo local:** guarda cada lectura en una base compartida; `--offline` la consulta, `messages search` busca, `backfill` la llena, `watch` y `serve` la actualizan, `sync status` y `export` la leen.
- **Registros de ejecución** (`tg runs`), `config`, `doctor`, `commands` y autocompletado (`complete`).
