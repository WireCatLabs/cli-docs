---
title: "Historial de cambios"
---

Cambios destacados de `@leemour/max-cli`, con una sección por versión, recientes primero. Se utiliza [versionado semántico](https://semver.org/lang/ru/); antes de `1.0.0`, la interfaz de comandos todavía puede cambiar.

## 0.37.0 — 08.10.2026

### Novedades

- **Botones de bots:** `messages list` y `messages show` muestran botones numerados: `[1 Да] [2 Нет]`. `max messages press <чат> <сообщение> <кнопка>` selecciona por número o texto exacto; el bot ve quién pulsó. Solo pulsa callbacks normales. Nunca comparte teléfono o ubicación; otros tipos explican el siguiente paso. Los botones aparecen al leer de MAX y no están en la copia local ([uso](./usage.md)).
- **Iniciar un bot:** `max chats start <бот> [--payload]` actúa como su botón Inicio. Acepta `https://max.ru/<бот>?start=…`, incluso si nunca le escribiste; aparece su chat. Rechaza enlaces a personas. Iniciar es un mensaje tuyo y pasa los controles de envío.
- **Miniaplicaciones:** `max chats app <бот> [--start]` imprime una dirección con tu sesión. Mantenla privada; `max` no la guarda.
- **`max account list`** muestra perfiles locales y cuentas sin consultar MAX.
- **`max bot messages list`** también muestra teclados en mensajes del propio bot.
- **`max watch --events`** muestra lecturas y cambios de chats (incluidos en 0.36.0 sin mencionarse): `read` puede ser tu otro dispositivo; `chat` refleja nombre, miembros o salida. Marcar no leído no es un evento de lectura.

### Cambios que pueden romper scripts

- **`contacts profile`: `flags` contiene `bot`**, true para bots, false para personas; antes estaba vacío.
- **`watch --events`: `chat` aparece solo si el chat cambia** — nombre, descripción, miembros, estado, foto o propietario. Antes podía aparecer con cada envío mediante `max serve`.

### Correcciones

- Una respuesta perdida tras iniciar un bot o pulsar un botón da resultado desconocido (`outcome_unknown`, salida 14), no un fallo seguro para reintentar. No se repite automáticamente; comprueba la respuesta del bot antes de repetir. El registro conserva el resultado desconocido.
- Consultar un grupo por enlace mediante `max serve` no añade a tu lista un grupo al que no perteneces (corregido en 0.36.0 sin mencionarse).
- `max` y grupos como `max chats` sin subcomando muestran ayuda en un terminal en lugar de `✗ (outputHelp)`. Scripts y `--json` reciben un error con `max --help`.

## 0.36.0 — 08.10.2026

### Novedades

- **Archivos para agentes remotos:** `attachments show` transfiere bytes guardados por porciones limitadas con SHA256. MCP devuelve imágenes completas o recursos binarios, con alternativa JSON/base64. No llama a un modelo ni cambia el índice; el agente lee y guarda el texto ([adjuntos](./attachments.md)).
- **La biblioteca compartida** añade lectura de carpetas con nombres de chats, `metadata refresh --only-missing`, reintento/limpieza de trabajos, cohortes de retención observadas y contadores con frescura explícita; los valores desconocidos no se sustituyen por cero.

### Cambios que pueden romper scripts

- **`max contacts profile` rellena `seen`** con la última hora de presencia o `online` si MAX informa de presencia. Un campo antes vacío puede contener un valor ([personas](./people.md)).
- JSON de rankings y pruebas incluye observaciones de contadores y frescura; las pruebas admiten selecciones de cohortes de retención. Comprueba campos y tipo de selección antes de interpretar; un valor desconocido o un archivo incompleto no significa cero.

## 0.35.0 — 08.10.2026

### Novedades

- **`max chats delete` y `max chats clear` borran el chat o sus mensajes solo para esta cuenta.**
  Los demás los conservan. Sin `--allow-dangerous`, pregunta; sin terminal, rechaza.
- **Texto local de adjuntos:** ODT, ODS, XLSX, PPTX, EPUB, UTF-16 con BOM y codificaciones antiguas
  detectadas con confianza. Sin modelo; no calcula fórmulas y las imágenes quedan para el agente.
  Estos formatos no necesitan paquetes adicionales; PDF/DOCX conservan motores opcionales ([adjuntos](./attachments.md)).
- **Informes de administración del archivo:** preguntas sin respuesta observada, tiempo de respuesta de
  personas elegidas, ayuda tras una entrada conocida y publicaciones vistas con poca conversación.
  Las selecciones/pruebas muestran los mensajes; lo desconocido no demuestra ausencia de respuesta ([clasificaciones](./rankings.md)).
- **Stickers: `max stickers list` y `max messages send --sticker <id>`.** Lista paquetes añadidos;
  `--set <id>` muestra sus stickers e ids. Envía un sticker sin texto ni archivos.
- **`max chats mute` y `max chats unmute`** cambian solo tus notificaciones, para siempre o con `--until 8h`.
- **`max account privacy set`** cambia `--find-by-phone`, `--phone-number`, `--calls`,
  `--chat-invites` (everyone, contacts, nobody) y `--hide-online on|off`; mantiene los demás ajustes.
  MAX solo admite everyone/contacts para encontrar por teléfono; rechaza `nobody`.
- **`max chats media`** lee fotos, vídeos, archivos, audio y enlaces del servidor con `--type` y
  `--before-id` ([uso](./usage.md#медиа-чата)).
- **`max calls list`** muestra llamadas entrantes, salientes, perdidas y duración, las nuevas primero.
- **`max account privacy show`** muestra quién encuentra, ve el número, llama o añade la cuenta y
  si se oculta el estado; usa la respuesta de acceso sin otra petición.


## 0.34.0 — 08.10.2026

### Novedades

- **`max chats update --photo` establece la foto de un grupo o canal** ([grupos](./groups.md)).
- **`max chats folders order` cambia el orden de las carpetas.** Primero va la carpeta obligatoria «Todos los chats», después las carpetas indicadas y luego las restantes en su orden anterior ([uso](./usage.md)).
- **Tus propios nombres y notas sobre personas: `max contacts alias` y `max contacts notes`.** Se guardan solo en este ordenador y no se envían a MAX; `contacts show --with-notes` los muestra y `contacts list --search-notes` los busca ([uso](./usage.md#свои-имена-и-заметки-о-людях)).
- **Etiquetas automáticas de grupos y canales: `max metadata refresh` y `max tags auto`** — a partir del nombre y la descripción, sin leer mensajes; tus etiquetas no se modifican ([búsqueda](./search.md#метки)).
- **`max store fetch --all` descarga todos los chats** — los últimos 90 días de cada uno; `--background` lo ejecuta en segundo plano. La búsqueda indica cuántos mensajes y chats ha revisado y cuántos chats no se han descargado o están desactualizados; `coverage.next` en JSON indica al agente qué comando ejecutar antes de concluir que un mensaje no existe.
- **Las métricas de respuestas y debates utilizan los vínculos de respuesta de MAX guardados.** Si los datos son incompletos, el vínculo queda como desconocido en lugar de suponerse.
- La [guía de clasificaciones](./rankings.md) explica las métricas, puntuaciones, cobertura, selecciones guardadas y pruebas.
- Las nuevas guías explican los [adjuntos](./attachments.md), el [reconocimiento de voz](./audio-recognition.md) y la [configuración de modelos externos](./external-models.md).

### Cambios que pueden romper scripts

- **`max session end` cierra la sesión en MAX, en lugar de limitarse a olvidar el token aquí** — como `tg session end`. `revokedOnServer` ahora es `true`. Si el token se copió de una pestaña de web.max.ru, esa pestaña también cerrará la sesión ([sesiones](./sessions.md)).

- **`max messages search` en un solo chat también consulta el servidor de MAX.** Con `--chat` o `chat:` y palabras, busca por defecto en el archivo y el servidor (`--backend both`), y encuentra mensajes aún no descargados. Los resultados del servidor se comprueban con la misma consulta; cada mensaje tiene un campo `source`. `--backend archive` busca solo en el archivo; `--server-time` indica cuánto esperar al servidor (5 segundos). Sin un chat, se busca solo en el archivo ([búsqueda](./search.md)).
  Ten en cuenta: buscar en un chat ahora puede conectarse a MAX; `--backend archive` mantiene la búsqueda local.

### Correcciones

- **Las solicitudes MCP preparadas utilizan los disponibles `max_read` y `max_write`**, en lugar de los antiguos nombres de herramientas individuales. Sus búsquedas comprueban `coverage.next` antes de concluir que un mensaje no existe.

- **Las selecciones guardadas conservan los límites de fecha exclusivos al ejecutarse de nuevo**, por lo que los mensajes justo en el límite quedan excluidos. MCP ya no ofrece al agente operaciones de carpetas no disponibles.

- **`max serve --timeout` cierra el servidor.** Al agotarse el tiempo, se cierran la conexión, el inicio de sesión pendiente y las tareas en segundo plano; el proceso termina con el código de tiempo de espera agotado.

## 0.33.0 — 07.10.2026

### Novedades

- **`max stats messages top` y `max stats contacts top` clasifican los mensajes guardados y sus autores**, y el campo `evidence` de cada entrada muestra qué mensajes explican su posición. Todo se calcula con la copia local; no se envía nada a MAX. `searches create --selection` guarda esa clasificación como una búsqueda.

### Cambios que pueden romper scripts

- **Cada perfil comparte ahora un único ritmo de solicitudes a MAX entre todos los procesos `max`.** Antes, los comandos simultáneos, `store fetch` en segundo plano, `mcp` y `serve` hacían sus pausas por separado y, juntos, contactaban con MAX más a menudo. Ahora comparten un cupo: 10 solicitudes seguidas y después 20 por minuto.
  Por qué: MAX bloquea las cuentas por un exceso de solicitudes, y las tareas en paralelo las multiplicaban.
  Ten en cuenta: las descargas masivas en paralelo tardan más; un comando que tendría que esperar más de 5 minutos termina de inmediato con el código `8`. Cambia el ritmo con `requestsPerMinute` o `MAX_REQUESTS_PER_MINUTE`; `0` lo desactiva. Consulta los límites en [limits.md](./limits.md).
- **`max messages send` ya no tiene la opción `--comment-to`.** Apareció en 0.32.0 con el código compartido de Telegram, pero en MAX solo rechazaba la operación con el código 2.
  Ten en cuenta: un script que pase `--comment-to` sigue recibiendo el código 2, ahora con un mensaje de opción desconocida.

## 0.32.0 — 07.10.2026

### Novedades

- **Las fotos y los escaneos de adjuntos se pueden reconocer por lotes con el modelo elegido.** Por defecto, el agente sigue leyéndolos por sí mismo y guarda el texto con `attachments text set`. Para procesarlos por lotes, usa `attachments extract --ocr` con el modelo de `models.ocr` y `--concurrency`; el texto reconocido entra en la búsqueda existente con `content:`.
  Ten en cuenta: `--ocr` envía archivos al proveedor del modelo elegido, por lo que debe activarse de forma explícita. La caché tiene en cuenta el archivo y el modelo; un fallo de la API no sobrescribe el texto del agente ni el índice anterior.

### Cambios que pueden romper scripts

- **`max contacts profile` muestra los nombres anteriores de una persona en el nuevo campo `aliases`.** Antes, la copia local recordaba solo el nombre actual: un nombre nuevo de un mensaje o de la sincronización de contactos sobrescribía el anterior.
  Por qué: es más fácil reconocer por un nombre anterior a alguien que ha cambiado de nombre.
  Ten en cuenta: la respuesta `--json` incluye ahora `aliases`, una lista de `{ name, firstSeenAt, lastSeenAt, source }` de más antiguo a más reciente. `source: messages` indica un nombre de los mensajes guardados y es aproximado. La lista queda vacía hasta que la copia haya observado un cambio de nombre. `from:` busca solo por el nombre actual. [Personas](./people.md).
- **`max messages send` añadió `--comment-to`, pero no funciona en MAX: el comando rechaza la operación con el código 2 y no envía nada.** La opción se comparte con Telegram, donde publica un comentario bajo una publicación de canal.
  Ten en cuenta: MAX no admite comentarios bajo publicaciones de canales; no uses esta opción en scripts.

## 0.31.0 — 07.10.2026

### Novedades

- **Preparación de la búsqueda y reparación del archivo.** Extracción de texto mediante MCP, `attachments extract --from-dir` y `messages download --extract`; comprobación de archivos modificados por hash. `store fetch --catch-up` prepara el grafo y los vectores locales instalados dentro de los límites indicados; está desactivado por defecto. `store gaps plan/repair` y MCP muestran los huecos internos registrados y los descargan de forma explícita con límites y tareas. Los extremos desconocidos y las páginas ambiguas no se consideran un archivo completo.

- **Las listas de miembros de los grupos en seguimiento se actualizan a diario mientras funciona MAX server.** Está disponible `chats members fetch --track`; el seguimiento no amplía el tiempo de espera por inactividad del servidor.

- **`max setup` es más fácil de leer.** Cada paso tiene un encabezado como `[1/4] This computer`, con lo ocurrido debajo y con sangría; las preguntas y el código QR aparecen bajo su paso, con líneas en blanco alrededor del código. El resultado es una tabla alineada cuya primera fila indica el comando con el que empezar. La salida `--json` y sus claves no cambian; `--quiet` sigue ocultando los pasos.

- **Las plantillas de respuestas automáticas utilizan Liquid y bloques `ai` separados.** `models.replies` elige el proveedor; `replies consents` concede consentimiento para un perfil y un endpoint, con exclusiones para chats concretos. `replies test` normal no llama al modelo; `--ai` pasa explícitamente los datos guardados. Las plantillas antiguas conservan un texto alternativo con una advertencia. El envío sigue limitado por `testers` y `replies.send`; consulta la [guía](./replies.md).
- **`max serve` abre tareas a partir de las reglas de respuesta automática.** Consúltalas con `max tasks list` o el prompt MCP `open-tasks`; crear una tarea no envía nada.
- **La conexión desde el navegador está documentada para Windows, macOS y Linux.** La guía distingue Tailscale del servidor, proporciona comandos de PowerShell y explica los permisos temporales de envío, la conexión de Codex web, cómo ejecutar dos mensajeros y cómo detener túneles individuales. [Conexión](./remote.md).

- **Los ajustes, permisos y perfiles se explican por separado.** Las guías empiezan con tareas habituales, la ubicación del archivo y ejemplos; la referencia completa sigue disponible.

### Cambios que pueden romper scripts

- Contrato del SDK 0.161.0: modo sin interacción, límites de entrada, salida y tiempo, esquemas de comandos, selección de campos, vistas previas y reglas para reintentar escrituras. Las estadísticas utilizan `stats <ресурс> <вид>` sin los antiguos alias.
- MCP utiliza tres herramientas de búsqueda, lectura y escritura en lugar de una herramienta por comando; no hay formularios de confirmación del servidor. Se mantienen los permisos del perfil y las reglas de moderación independientes.
- Los ajustes se dividen en una guía breve y una referencia completa; se añaden una página para usuarios sobre el contrato de la CLI y una comprobación de la habilidad del agente en CI.

- **Las estadísticas se consultan con `stats messages show`, `stats chats show` y `stats tasks show`.** Se eliminan las antiguas rutas `messages stats`, `chats stats`, `tasks stats`; actualiza los comandos y los permisos exactos a `stats.messages.show`, `stats.chats.show`, `stats.tasks.show`. Las herramientas MCP se llaman ahora `max_stats_messages_show`, `max_stats_chats_show`, `max_stats_tasks_show`.
- **Los errores de sintaxis devuelven el código 2 y un error JSON estructurado.** Los scripts que esperaban el antiguo código 1 o texto normal deben actualizar su tratamiento de errores.

- **La primera carga de ajustes crea config.json.** No se sobrescribe un archivo existente; las variables de entorno y las opciones del comando no se guardan en él. config show ahora puede crear el archivo, y los valores habituales muestran el archivo defaults como origen.
- **La búsqueda de palabras y frases encuentra formas de las palabras.** Las consultas de los scripts pueden devolver más mensajes. Para la coincidencia exacta anterior, usa exact: o --exact; text: explícito sigue buscando formas de las palabras. Los ajustes de idioma del archivo determinan las coincidencias.

### Correcciones

- **La preparación de la búsqueda respeta la prohibición de escribir vínculos.** `conversations.links: readonly` o `deny` detiene la preparación tras la descarga y durante la reparación de huecos, antes de conectarse o iniciar una tarea. `--no-catch-up` explícito sigue permitiendo leer el historial normalmente según las reglas del perfil.

- El contexto de una persona encuentra conversaciones privadas sin una lista de miembros registrada cuando el ID del diálogo coincide con el ID de la persona; vuelven a estar disponibles los mensajes recientes en ambas direcciones.
- La documentación de MCP utiliza las rutas de comandos y los permisos actuales, sin los formularios de confirmación eliminados.

- Al interrumpirse una escritura, se conservan los valores originales `outcome_unknown`, `operationId` y los datos de reintento devueltos por el comando: la biblioteca compartida se actualiza a 0.161.0.

- **Un tiempo de espera agotado durante una escritura de Bot API conserva un resultado desconocido.** La operación puede haberse completado; comprueba el estado antes de reintentar.

- **MCP de MAX no ofrece herramientas de foros no compatibles.** La búsqueda de comandos ya no ofrece modificar ni ordenar topics de Telegram.

## 0.30.0 — 06.10.2026

### Novedades

- **`max stats charts --output activity.png` guarda un gráfico PNG con tema oscuro.** SVG sigue disponible; las imágenes solo se escriben en archivos nuevos. MCP `max_stats_charts` con `format: "png"` devuelve una imagen junto con JSON, sin conectarse a MAX ni escribir archivos. Sin `format`, MCP sigue devolviendo JSON.
- **Las reglas de respuesta automática se pueden editar con `max replies add|edit|on|off` y `audience`.** Una regla nueva está desactivada hasta que se activa explícitamente; los cambios se guardan solo localmente, sin enviar mensajes. Las respuestas automáticas siguen limitadas a cuentas de prueba; la lista `testers` se sigue definiendo en el archivo. [Respuestas automáticas](./replies.md).
- **`max tasks` muestra qué espera tu respuesta.** `max review` mantiene en la copia local una tarea para una pregunta sin responder o un mensaje que te menciona, y la cierra cuando respondes; ahora estas tareas son visibles. `max tasks list` las muestra con un enlace al mensaje; `max tasks add <сообщение> --type promise` añade lo que las reglas no detectan; `max tasks close <задача> --as done|dismissed` cierra una tarea para siempre; `max tasks stats` las cuenta por chat. MCP `max_tasks_list`, `max_tasks_add`, `max_tasks_close`, `max_tasks_stats` ofrece lo mismo al agente. Todo queda en este ordenador; no se envía nada a MAX. Las escrituras requieren los permisos `tasks.add` y `tasks.close`.
  Ten en cuenta: MCP incorpora cuatro herramientas más; `max serve` aún no abre tareas en MAX. [Qué espera tu respuesta](./groups.md#что-ждёт-вашего-ответа).
- **La búsqueda semántica abarca los mensajes largos completos.** Antes de crear el embedding, los mensajes de más de unos 1200 caracteres se dividen en fragmentos superpuestos, de modo que se lee todo el mensaje y no solo el principio. Los chats preparados antes se consideran desactualizados: se reconstruyen con `conversations build` o `search --refresh` (cli-messaging 0.153.0; el almacén pasa a la versión 21, en la que las compilaciones antiguas pueden seguir escribiendo).
- **MCP realiza escrituras permitidas desde clientes web sin formularios del servidor.** `--http-confirmation permissions` respeta los niveles de permiso: `allow` no exige formulario del servidor y `ask` sí. Por defecto, cada escritura sigue exigiendo un formulario. La opción repetible `--permission ключ=уровень` modifica los permisos solo mientras funciona el servidor, sin cambiar los ajustes. La confirmación de la aplicación es independiente y el servidor no la comprueba.
  Ten en cuenta: en este modo, el agente del navegador realiza sin formulario todo lo que el perfil permita con `allow`, incluido el envío de mensajes; revisa los permisos antes de activarlo. [Conexión](./remote.md).

### Correcciones

- **Las descripciones de las herramientas MCP de seguimiento de miembros tienen en cuenta la recogida manual en MAX.** Ya no prometen lecturas diarias mediante `serve` ni ofrecen el no disponible `fetch --track`. La lista de grupos y las instantáneas guardadas se siguen leyendo del almacén local.

## 0.29.0 — 06.10.2026

### Novedades

- **`max chats tracking list|show|add|remove` gestiona los grupos cuyo número de miembros se sigue.** Consulta las instantáneas guardadas del número de miembros, añade un grupo sin leerlo inmediatamente o quítalo conservando su historial. Para registrar los miembros, utiliza `max chats members fetch`. En MAX, `serve` todavía no lee los miembros diariamente: repite la recogida manualmente o con tu propia programación.
- **Perfil de una persona.** `max contacts profile <человек>` muestra lo que MAX informa sobre una persona: nombre, enlace, descripción, fecha de creación de la cuenta (`registered`, según MAX) y si tiene foto propia. Para cada chat compartido muestra cuántos mensajes tiene guardados, el primero y el último. Si MAX proporciona un teléfono, aparecen sus cuatro últimos dígitos; `--show-phone` lo muestra completo. Una petición adicional a MAX respecto a `contacts show`. MCP: `max_contacts_profile`.
- **Respuestas por reglas, solo a cuentas de prueba.** `max serve` responde a mensajes entrantes con las reglas de `<профиль>.replies.json`, solo a personas incluidas en `testers` y únicamente con `permissions.replies.send allow`. Comandos: `max replies test`, `pause`, `resume`, `status`. Véase [docs/replies.md](./replies.md).
- `max contacts context <человек> --chat <чат>` (repetible) devuelve los mensajes recientes de esa persona en cada chat, con fecha y texto para que el agente los resuma. `-v` añade identificadores y enlaces; `--limit` se aplica por chat; `--refresh` consulta primero la última página del chat en MAX.
- Utiliza cli-messaging 0.152.0.
- **`max contacts check <человек>` comprueba si una persona parece un bot.** Valora el perfil y los mensajes guardados (ningún mensaje, un enlace como primer mensaje, el mismo texto en varios chats), con una fuente para cada motivo. Las listas públicas de remitentes de spam cubren solo Telegram, así que no se consultan para MAX. `max chats members audit
  --deep <n>` comprueba los primeros n miembros de la misma forma, uno por segundo.

- **`max chats members fetch` guarda instantáneas de miembros; `history` muestra los cambios.** El historial se consulta sin conexión, con `--since-time`. `--budget` limita la instantánea; las salidas solo se registran tras una lectura completa. El seguimiento diario espera soporte del servicio en segundo plano de MAX. [Trabajo con miembros](./groups.md#снимки-участников).

- **`max stats charts` dibuja estadísticas del chat.** Devuelve una descripción neutra en JSON; `--output` guarda un SVG oscuro de mensajes, autores activos, entradas y salidas por día o semana. Las fechas ausentes quedan como huecos y los datos incompletos se indican. No sobrescribe archivos existentes. MCP `max_stats_charts` devuelve la descripción del archivo local; PNG llegará por separado. La biblioteca nueva añade unos 61,6 MiB descomprimidos antes de la deduplicación y se carga en el proceso solo al pedir una imagen. [Uso](./usage.md#графики-статистики).

- **`max store fetch` también conserva las reacciones a publicaciones de canales.** MAX incluye el número de reacciones en el historial del canal; `max` ahora lo conserva, por lo que `max chats stats` puede ordenar publicaciones por reacciones sin otra petición.

- **`max chats stats <чат>` muestra cifras de un grupo o canal durante un periodo.** Mensajes, autores activos, respuestas, reacciones, publicaciones destacadas, preguntas y tiempos de respuesta, entradas y salidas. Calcula con el archivo local y consulta las entradas y salidas a MAX. Con historial incompleto, las cifras son mínimos y el comando sugiere un `store fetch` para completarlo.

- **La búsqueda lee el texto de archivos.** `attachments extract` guarda texto TXT, DOCX y de PDF con capa de texto; `content:` lo busca. DOCX/PDF requieren los paquetes opcionales `mammoth`/`unpdf`; el agente lee fotos y documentos escaneados y guarda el resultado con `attachments text set`. Por defecto solo lee archivos descargados; `--download --output-dir` los descarga primero de forma explícita.
- **Actualizar antes de buscar y seguir las respuestas.** `--sync-first` limita la descarga a cinco chats, 500 mensajes y 30 segundos; una actualización incompleta no oculta los resultados locales. `--thread` añade un grafo acotado de respuestas con la procedencia de los enlaces; sin grafo utiliza el contexto cronológico.
- **La búsqueda de conversaciones acepta filtros estrictos y un alcance explícito de cuentas.** `--filter` limita las conversaciones antes de ordenarlas; al menos un mensaje debe cumplir todo el filtro. `--source` amplía el alcance explícitamente. Un agente puede enlazar mensajes íntegramente mediante MCP: instrucciones `link-conversations`, lotes, almacenamiento de enlaces y reconstrucción del grafo.
- **Los modelos de vectores y análisis se configuran por separado para cada perfil.** Los vectores locales y tu agente siguen siendo los valores predeterminados. Un servicio externo recibe texto solo al seleccionarlo explícitamente; `build --analyze --chat` pide consentimiento y lo recuerda para la cuenta, el chat y el servicio hasta revocarlo.

- **Etiquetas propias: `max tags add`, `remove` y `list`.** Etiqueta un chat (`--chat`), persona (`--contact`) o mensaje (`--message`); `tag:<метка>` encuentra lo etiquetado. Las etiquetas se guardan en el archivo local y nunca se envían a MAX. Una etiqueta contiene de 1 a 32 letras latinas, cifras o guiones. El agente dispone de las mismas acciones mediante MCP. Véase [Búsqueda de mensajes](./search.md).
- **Consultas guardadas: `max searches` y `--saved`.** `max searches create <имя> [запрос]` guarda una consulta con sus opciones; `max messages search --saved <имя>` y `max messages stats --saved <имя>` la ejecutan. Las palabras añadidas a `--saved` restringen la consulta; las opciones de la línea de comandos sustituyen las guardadas. `searches list`, `show`, `history`, `delete` y `clear` muestran y limpian las consultas y el historial. La consulta de `messages search` ahora es opcional si se indica `--saved`.
- **`max contacts context <человек>` muestra lo que el archivo sabe sobre una persona.** Chats compartidos, últimos mensajes en ambas direcciones, mensajes recientes y menciones. Lee el archivo sin marcar mensajes como leídos. `max contacts link` registra que una cuenta de MAX y otra de Telegram pertenecen a la misma persona, para que `context` incluya ambas; `max contacts unlink` deshace el enlace. Como `context` devuelve texto de mensajes, `permissions.messages: deny` también lo bloquea.
- **`max store repair` repara la estructura del archivo sin borrar datos.** Conserva una tabla con estructura distinta como copia junto a la nueva y la nombra en el resultado. `--dry-run` muestra los cambios sin aplicarlos. `max store copies delete <имя>` borra una copia conservada. Véase [Archivo](./archive.md).
- **La búsqueda puede usar raíces de palabras al activarlas.** `max config set searchStemmers.cyrillic russian` y `searchStemmers.latin spanish` (o `english`) configuran todo el archivo, todos los perfiles y ambos mensajeros. Después hay que ejecutar `max store reindex`.
- **`max flood clear` olvida las esperas recordadas y levanta las retenciones de envío.** Aparecen en `max server status`, en el nuevo campo `flood`. MAX todavía no informa de cuánto hay que esperar, así que estará vacío para una cuenta personal de MAX. La pausa de inicio de sesión que muestra `max doctor` sigue evitando accesos demasiado frecuentes. No hay herramienta MCP deliberadamente: el agente no debe levantar una restricción.
- **Tres guías de búsqueda.** [Búsqueda de mensajes](./search.md) cubre búsquedas cotidianas por palabras, personas, fechas, archivos, enlaces y etiquetas; [búsqueda por temas](./topic-search.md), conversaciones, vectores y texto enviado a modelos externos; [lenguaje de consultas](./query-language.md) es la referencia.

### Cambios que pueden romper scripts

- **La búsqueda semántica con e5-small local descarta coincidencias débiles antes de combinarlas con las de palabras.** La similitud coseno debe superar 0,80; las coincidencias de palabras se mantienen. Puede haber menos resultados, y un resultado encontrado por ambos métodos puede quedar solo como coincidencia de palabras.
- **El archivo incorpora tablas de texto de adjuntos y de consentimiento de análisis.** Es una migración local al abrirlo por primera vez; se conservan los mensajes anteriores. Haz una copia de seguridad de un archivo grande antes de actualizar.

- **El archivo ahora conserva todas las consultas correctas de `messages search` y `messages stats`, tanto de CLI como de MCP.** Guarda la consulta y sus opciones, nunca los mensajes encontrados, y conserva las últimas 1000 ejecuciones. Sirve para `searches history` y `--saved`. Si no deben quedar consultas en disco, utiliza `--no-record` o `max config set record false`; `max searches clear` vacía el historial sin borrar consultas guardadas.
- **El archivo migra al nuevo esquema al primer uso.** Incorpora tablas de etiquetas, consultas guardadas y raíces de palabras; `max store migrate` completa el índice de raíces para mensajes existentes. En archivos grandes, `store migrate` y `store reindex` tardan más. El archivo es compartido con `tg`; las versiones anteriores de `max` y `tg` todavía pueden abrirlo.
- **`max inbox`, `inbox --new`, `review` y `chats list --unread` (también con `--search` y `--kind`) revisan todos los chats que MAX devuelve al iniciar sesión, en vez de los 200 más recientes.** Antes se omitían silenciosamente chats con mensajes no leídos situados más abajo. Cada ejecución sigue procesando como máximo 20 chats y nombra los demás en `skipped N chats`. Ahora `partial: true` solo significa que MAX no devolvió todos los chats al iniciar sesión.
- **`max chats list` indica `hasMore: true` en la última página no vacía si MAX devolvió una lista incompleta.** Antes parecía completa. Los scripts que paginan hasta `hasMore: false` se detienen en la página vacía.
- **`max messages list` y `max store fetch` ya no consideran una página corta como el inicio del chat.** MAX no indica si hay mensajes anteriores, y una página puede tener menos mensajes que `--limit` incluso en medio de una conversación. Tras una página corta, `max` pide ahora un mensaje más antiguo: si existe, `hasMore: true`; si no, es el inicio del chat. Ten en cuenta: esto añade una solicitud a MAX por cada página corta, y `hasMore` será `true` más a menudo.
- **`max config set` y `config unset` aceptan `searchStemmers.cyrillic` y `searchStemmers.latin`; `config show --json` los muestra en el nuevo campo `storeSettings`.** Se guardan en el archivo, no en el fichero de configuración, por lo que rechazan `--defaults`, `--personal` y `--bot`; no se pueden modificar bajo `MAX_PROFILE_LOCK`.

### Correcciones

- Los errores del fichero de reglas de respuestas ya no imprimen fragmentos de ese fichero en el registro del servicio.

- **`max mcp --http`: Claude y ChatGPT ya pueden completar el inicio de sesión.** La página de acceso hacía que el navegador enviara el formulario sin origen y `max` respondía «Origin not allowed». Ahora funciona (cli-messaging 0.152.0).

- **Un localizador de mensaje de otra cuenta ya no abre un mensaje con el mismo número en la cuenta actual.** `messages show/context` lo rechaza; MCP acepta `offline: true` para el contexto local ordinario.

- **La búsqueda estricta `text:/…/` encuentra palabras igual que la búsqueda por palabras.** Antes `text:/Квартир.*/` y `text:/счёт/` no encontraban palabras guardadas por las mayúsculas y la letra ё. `body:` sigue distinguiendo mayúsculas.
- **Los errores de búsqueda estricta indican qué hacer.** `~` sugiere `--language legacy` y `слово*`; un prefijo corto como `к*` indica el límite de 10 000 palabras y pide uno más largo; `index_not_ready` muestra el progreso del índice y el comando exacto `max store migrate`.
- **MCP no guarda el historial de consultas cuando se desactiva el registro.** Antes `record: false` solo desactivaba el historial en la línea de comandos.
## 0.28.0 — 04.10.2026

### Novedades

- MCP `max_chats_stats` calcula la actividad de un grupo o canal a partir del archivo local; no consulta las entradas ni las salidas. `max chats members audit` muestra señales de miembros sospechosos, sin eliminar a nadie.
- MCP `max_inbox` y `max_review` aceptan `kinds` y `new`, con marcas por chat separadas de las de la CLI.

- **`max messages stats` cuenta mensajes del archivo local por chat, remitente, día u hora.** La consulta usa Lucene estricto; sin ella, se cuentan todos los mensajes guardados de la cuenta actual. No usa la red; `--source max` incluye explícitamente los demás perfiles. En un archivo incompleto, el resultado es un límite inferior; revisa `coverage` y `completeness`.
- **`max mcp --http --public-url https://<имя>.ts.net` abre `max` a ChatGPT y Claude en el navegador.** Las herramientas MCP se ofrecen en `127.0.0.1` detrás de tu propio túnel, con acceso propio: la aplicación necesita un código de un solo uso que `max` muestra en el terminal. Cada cambio pregunta antes mediante un formulario en la aplicación. El acceso dura 30 días; `max mcp --revoke` los cierra todos. [docs/remote.md](./remote.md) sustituye el montaje con un proxy de terceros.

- El MCP personal usa el mismo conjunto de esquemas que Telegram: dispositivos, búsqueda de contactos por teléfono, carpetas, miembros, invitaciones, configuración del grupo, encuestas, pruebas locales y conversaciones. Los temas de Telegram no existen en MAX. Se conservan los nombres antiguos de comprobación y reglas del grupo.
- Un envío programado confirmado usa la hora del formulario, aunque la respuesta llegue más tarde.

### Cambios que pueden romper scripts

- `coverage.inventoryComplete` indica ahora que se ha recibido la lista completa de chats, y `lastSyncedAt`, la carga más antigua dentro de la cobertura; las entradas de `completeness` incluyen `fetchedAt`. Un archivo existente obtiene estos datos tras la siguiente lista completa y la descarga del historial. `/catch-up` acepta `kind` y `mode` en lugar de `since`.
- `config set permissions` rechaza órdenes desconocidas, incluidas erratas dentro de un objeto completo, con el código 2. `config unset` permite eliminarlas; al leer un archivo existente se avisa y se continúa.

- Los argumentos de MCP usan los nombres comunes: `at_time`, `md`, `since_time`, `before_n`, `after_n`, `unanswered`; `send_id` es ahora una cadena. Los argumentos desconocidos se rechazan antes de ejecutar. Actualiza las llamadas según el esquema de `tools/list`. En `max_inbox` y `max_review`, el parámetro `all: true` incluye los chats silenciados y archivados; sin él, solo quedan las menciones al propietario.

### Correcciones

- La búsqueda y las estadísticas muestran la cobertura real del archivo local y la hora de la última carga. `wordsReady` ya no promete un índice de palabras listo para búsquedas solo con filtros o regex. `store fetch` ignora la marca de inicio del historial si aparecen mensajes más antiguos en el archivo.
- `server status` informa del código de cierre normal del servicio y del motivo de la parada sin volver a iniciarlo.

## 0.27.0 — 04.10.2026

### Novedades

- **La instalación global con npm configura el PATH de Windows y el skill del agente.** Conserva las entradas existentes y permite ejecutar `max` en terminales nuevas. Un agente que ya está abierto debe actualizar su entorno. El skill se instala antes de iniciar sesión; `MAX_INSTALL_AGENT=none` lo desactiva. La instalación local y npx no cambian el entorno del usuario.

- **`max commands messages search --json` describe un comando; `max commands messages --json`, un grupo.** El agente ya no necesita leer el árbol completo antes de cada tarea. Se conservan las opciones globales y los códigos de salida. Las palabras tras `commands` indican una ruta; consulta otros grupos en llamadas separadas. Sin ruta, sigue devolviendo el árbol completo.

- **`max messages link` y MCP `max_messages_link` devuelven un locator del mensaje del archivo local.** El destino se valida con la cuenta actual; se rechazan locators de otra cuenta. MAX personal aún no tiene un formato de permalink verificado: `url` es `null` y la respuesta indica el motivo. `--offline` no conecta con MAX. Consulta [mensajes](./usage.md).

### Cambios que pueden romper scripts

- **CLI y MCP usan `permissions` con los niveles `deny`, `readonly`, `ask` y `allow`.** Comandos y agentes comparten permisos. La mayoría de escrituras por MCP están ahora disponibles por defecto; eliminar mensajes y cerrar otras sesiones requiere confirmación salvo que exista un `allow` explícito. Por ejemplo, `messages: readonly` junto con `messages.delete: allow` permite leer y eliminar sin preguntar, pero prohíbe las demás escrituras en mensajes; no limita otros recursos. Antes de actualizar, revisa los permisos del agente y asigna `readonly` o `deny` a los recursos que quieras restringir. `--confirm-send` exige un formulario antes de cada escritura; en JSON, `ask` necesita una opción explícita.

- **`config migrate` convierte los ajustes antiguos de acceso y los niveles de moderación.** `--dry-run` muestra cambios sin escribir. Conserva los permisos efectivos, los ajustes MAX y las posiciones guardadas de comprobación de grupos. Cuando existe `permissions`, no se pueden cambiar `readOnly`, `allow` ni `mcpTools`. Los antiguos `--allow-send`, `--allow-mark-read`, `--allow-delete` y `--allow-moderate` se aceptan con aviso, pero no otorgan permisos. Siguen vigentes la lista de destinatarios y el límite por hora. Consulta [configuración](./configuration.md) y [MCP](./mcp.md).

### Correcciones

- **La apertura simultánea del archivo local espera un bloqueo breve de SQLite al arrancar.** Antes, la configuración del journal podía encontrar una base ocupada antes de activar la espera y fallar de inmediato. Un bloqueo prolongado sigue causando un error. Este cambio no inicia la descarga del historial.

## 0.26.0 — 03.10.2026

### Novedades

- **`max skill show link-conversations` imprime el skill compartido para relacionar conversaciones.** Funciona sin sesión; sin nombre, sigue mostrando el skill principal de MAX.

- **`max messages evidence` devuelve un paquete limitado del archivo local**, con locator, información de integridad y continuación mediante `--before-id`. No conecta con MAX.

### Cambios que pueden romper scripts

- **Las fotos descargadas reciben su extensión según el MIME HTTP**, por ejemplo `.webp` para WebP, en lugar de JPEG según el tipo de adjunto. Se conservan los nombres originales; no hay consultas preliminares adicionales.

- **`max account show` usa el formato de cuenta compartido con Telegram.** JSON añade `username: null`; mantiene los campos MAX, el teléfono oculto y `--show-phone`.

- **`max sends list` respeta el `limit` configurado, como Telegram.** Antes seleccionaba siempre 20 intentos sin opción explícita. El campo JSON `limit` muestra el límite elegido; mantiene `items`, `page` y `hasMore`. `--limit` tiene prioridad sobre el ajuste.

- **`max messages download` admite `--all`, `--output-dir` y `--pause`, como Telegram.** Crea el directorio y, al repetir la descarga del chat completo, continúa desde el progreso guardado. `--output` sigue siendo un nombre compatible para el directorio. El JSON de un mensaje contiene ahora `{items}`, sin `page`, `limit` ni `hasMore` artificiales; los scripts deben leer `items`. Los audios tienen ahora `kind` = `voice`, como Telegram, en vez de `audio`. Los archivos se descargan en streaming con las mismas comprobaciones de dirección y tamaño; los audios conservan el límite de 32 MiB.

### Seguridad

- **`max contacts lookup` no repite un teléfono pasado por error como argumento.** Rechaza el uso antes de pedir el número o conectar; introduce el teléfono cuando se solicite o mediante stdin.

### Correcciones

- **`messages list`, `inbox` y `review` con `--transcribe` descargan la grabación por la conexión de lectura.** Antes se abría un segundo acceso a MAX. La grabación se descarga antes de cerrar la conexión, y el reconocimiento local empieza después del cierre. Sin un `--mark-read` explícito, no se marca nada como leído.
- **`review --unanswered` tiene en cuenta las transcripciones guardadas y nuevas de preguntas de voz.** Antes, una pregunta con texto vacío se descartaba antes de transcribirla. La misma corrección se aplica en MCP; el texto original del mensaje no cambia, y las grabaciones sin reconocer dejan la revisión incompleta.

- **`max chats show` explica correctamente las diferencias en el número de miembros.** La lista puede excluir tu cuenta o estar incompleta. El comando muestra ambas cifras sin afirmar que falló la descarga. Se conservan JSON y la lista original.

- **El rechazo `poll.already.voted` explica cómo cambiar el voto.** Si la encuesta lo permite, ejecuta primero `polls vote <chat> <message> --retract` en el mismo perfil y elige después otra respuesta.

- **`max messages download --timeout` también cierra el flujo HTTP del adjunto.** Antes podía seguir descargando tras vencer el tiempo del comando, hasta otro límite de inactividad. Ahora el cierre del adaptador cancela sus flujos y elimina el archivo incompleto.

## 0.25.0 — 03.10.2026

### Novedades

- `bot api` usa el mismo constructor de comandos y validación de entrada que Telegram. Los generadores permanecen en cli-core; se conservan los parámetros, respuestas nativas y permisos efectivos de MAX. La opción compartida `--store-token <profile>` sirve para operaciones que devuelven credenciales; las demás la rechazan.

### Correcciones

- **`messages list`, `inbox` y `review` con `--transcribe` descargan la grabación por la conexión de lectura.** Antes se abría un segundo acceso a MAX. La grabación se descarga antes de cerrar la conexión, y el reconocimiento local empieza después del cierre. Sin un `--mark-read` explícito, no se marca nada como leído.
- **`review --unanswered` tiene en cuenta las transcripciones guardadas y nuevas de preguntas de voz.** Antes, una pregunta con texto vacío se descartaba antes de transcribirla. La misma corrección se aplica en MCP; el texto original del mensaje no cambia, y las grabaciones sin reconocer dejan la revisión incompleta.

### Cambios que pueden romper scripts

- **`max models audio list --json` añade `directory`:** el directorio de modelos compartido por MAX y Telegram. Los comandos, la selección del directorio y la verificación de descargas son ahora comunes; se conservan los archivos, el orden y `transcribeModel`. No hace falta descargar de nuevo. JSONL sigue devolviendo un modelo por línea.

- **`--md` usa el formateador propio de MAX** para send/edit y pies de archivo: estilos anidados, `__жирный__`, `++подчёркнутый++`, enlaces y código. Los bots admiten énfasis, títulos y citas mediante HTML seguro; el protocolo personal rechaza tipos no verificados. Telegram tiene otra sintaxis. Ya no se envían silenciosamente tipos wire desconocidos.

## 0.24.0 — 03.10.2026

### Novedades

- **`max setup` guía el primer inicio de una cuenta personal:** comprueba directorios, ofrece acceso por QR, comprueba la cuenta y hasta cinco chats e instala el skill del agente elegido. Reutiliza la sesión existente al repetirse. El historial se descarga aparte; setup no inicia el servicio en segundo plano. La ayuda, instalación e instrucciones del agente explican los siguientes pasos y cómo ejecutar en Windows sin PATH. `max skill show` funciona antes de iniciar sesión.

### Cambios que pueden romper scripts

- **`max chats check` pasa a ser `max chats moderate`:** reglas y moderación compartidas con Telegram. `--since-time` acepta fecha o `30m`/`2h`/`1d`, en lugar de `--since` con un ID de mensaje; JSON devuelve `{ chatId, rows }`. Lee hasta 1000 mensajes por ejecución. Los niveles son `deny|readonly|ask|allow`; los antiguos `forbid` y `flag|confirm` se interpretan como `deny` y `ask`. El punto guardado se migra de la sesión al archivo de reglas, por lo que la primera ejecución continúa desde él. CLI y MCP personal comparten ese punto; nombres y opciones MCP se conservan. La incorporación por enlace en `chats events` se llama `join`.

- **`max upgrade --json` siempre incluye `restarted`.** En MAX es un array vacío: la política de inicio de servidores no cambia. Comprobar versiones y no encontrar actualizaciones devuelve el mismo formato que instalar, conservando los campos anteriores. Los scripts que comprueban las claves exactas deben admitir este campo.

- **La búsqueda local usa un perfil Lucene estricto:** paréntesis, campos, rangos de fechas, `--timezone`, patrones y regex limitados. Los prefijos deben indicarse como `слово*`; la búsqueda anterior con correcciones está en `--language legacy`. JSON informa de la cobertura incluso sin resultados. La guía y el skill explican la migración; JS `--regex` se ejecuta en un worker separado con límites de tamaño y tiempo.

- **`max commands --json` incluye la versión del contrato JSON en `contract`.** El valor `0` coincide con Telegram CLI; conserva los campos anteriores. Los scripts que comparan todo el JSON con una cadena guardada deben admitirlo; leer campos concretos no necesita cambios.

- **Las lecturas de grupos comparten opciones y formatos.** `chats events` usa `--since-time` en lugar de `--since` y `--type` en lugar de `--event`; el límite es temporal, no un ID. La creación se llama `create`, antes `new`. `chats members list` muestra páginas con `--limit`, `--page` y `--all`; añade `--all` para obtener la cantidad anterior. JSON ya no incluye `chatId` ni `rolesKnown`; roles, creación y última conexión permanecen en las filas. `chats inspect` devuelve `id`, `kind`, `title`, `username`, `participantsCount`, `description` y `member`, en lugar de acceso, enlace y ajustes. `member` y `username` son `null` si MAX no los informa. Actualiza scripts y filtros. Se conservan los avisos sobre listas incompletas y roles desconocidos; leer no marca mensajes como leídos. Consulta [grupos](./usage.md#группы-и-каналы).

- **La gestión de grupos devuelve JSON común con `operationId`.** `chats create`, `join`, `update` y `link reset` guardan la ficha en `chat`; `leave` devuelve `chatId`. `members add` incluye `added` y `notAdded`; `members remove`, `removed`; `admins`, `personId` y, al añadir, `rights`. Es el formato compartido con Telegram; actualiza el análisis de resultados. `link show` no cambia. Título y ajustes siguen usando dos solicitudes: si cambia título o descripción pero falla la segunda solicitud, informa de `outcome_unknown` y registra el resultado parcial. Consulta `chats show` antes de repetir. Más en [gestión de grupos](./usage.md#группы-и-каналы).

- **`max account update` y `max account sessions end` devuelven el formato común con `operationId`.** Cambiar perfil devuelve `{operationId, account}` con `id`, `name`, `username`, `phone`; cerrar sesiones, `{operationId, sessions}` en lugar de un array. Lee los datos desde `account` o `sessions`. Tras cambiar el perfil, consulta su descripción con `account show`. El teléfono sigue oculto parcialmente; `sessions end` aún requiere `--others --yes`. La foto admite JPG, JPEG, PNG y WebP; convierte los GIF a uno de esos formatos. Consulta [perfil y sesiones](./usage.md#контакты-профиль-папки).

- **`max chats folders create|update|delete` incluye `operationId`.** Crear o modificar devuelve `{operationId, folder}`; eliminar, `{operationId, folderId}`, en lugar de la ficha directamente. Los scripts deben leer desde `folder` y usar `folderId` al eliminar. `update` sin `--title`, `--add` ni `--remove` ahora rechaza la operación en lugar de reescribir lo mismo. Listar no cambia. Consulta [carpetas](./usage.md#контакты-профиль-папки).

- **`max contacts add|remove|block|unblock|rename|import` devuelve el formato común con `operationId`.** Añadir y renombrar devuelve `{operationId, person}`; eliminar y bloquear, `{operationId, personId}`; importar, `{operationId, sent, recognised}`. `recognised` contiene fichas (`id`, `name`, `username`) devueltas por MAX en lugar de teléfonos; sin fichas queda vacío. `sent` cuenta filas del archivo, incluidos números repetidos. Actualiza el análisis de respuestas. Un teléfono rechazado por MAX ya no indica la fila; los errores de estructura todavía la indican. Consulta [contactos](./usage.md#контакты-профиль-папки).

- **Se elimina `max cache clear`.** Lecturas y nombres usan la copia compartida; `max store clear --left --allow-dangerous` elimina datos de chats abandonados. No ofrece borrar toda la copia. El archivo antiguo no se migra ni se abre; `max doctor` muestra su ruta y puedes descargar otra vez el historial con `max store fetch`.

### Correcciones

- **`max conversations embed status` calcula mejor el tiempo para e5-small.** Usa una medición de 31 fragmentos/s, antes 15; en el portátil medido, la estimación anterior era el doble. El tiempo real depende del ordenador y la longitud del texto. Tres workers dieron 1,04–1,1× con más uso de memoria; la distribución de workers no cambió.

- **`max_messages_search` por MCP conserva la cobertura del archivo y usa los parámetros de CLI.** Admite `language`, `timezone`, `ast` versionado, nombre de chat y filtros `source`, `newest`, `context`. El perfil estándar admite consultas de un carácter. Antes faltaban parámetros y se perdían `query`, `coverage` y `completeness`; una respuesta vacía no explicaba el alcance de la copia. Los campos anteriores y el nombre de herramienta se conservan.

- **`max runs list --limit` sugiere ampliar el límite si faltan registros.** Ya no sugiere la opción inexistente `--page`. Leer la lista o un registro no crea otra ejecución; JSON conserva `hasMore`.

- **`chats show` muestra un grupo guardado aunque no llegue en la última actualización de acceso.** Antes podía fallar con «sin chat». Los ajustes y enlaces desconocidos quedan vacíos; leer no modifica el grupo.

- **`max messages transcribe` encuentra una transcripción guardada por nombre de chat, aunque no esté descargado el modelo.** Antes buscaba por nombre en lugar de ID y proponía descargar otra vez el modelo. Un nombre completo o fragmento único devuelve ahora el texto guardado sin descargar el audio ni reconocerlo de nuevo. Consulta [mensajes de voz](./usage.md).

- En Windows, el generador usa Node en lugar de ejecutar `.cmd` directamente; las comprobaciones de documentación reconocen rutas Windows. Los tests de permisos Unix no los exigen en Windows, donde se usa ACL.

- **Los errores de `max bot` antes de iniciar una acción respetan los ajustes de registro del perfil bot, incluso con `--timeout` delante.** Antes, una opción global anterior a `bot` podía aplicar ajustes de la cuenta personal. Si el bot tiene desactivado el registro, un error al interpretar la orden ya no crea un registro contra esa preferencia.

## 0.23.0 — 03.10.2026

### Novedades

- **`max serve` y los comandos de gestión de chats guardan nombres y chats en la base compartida.** Ya no abren la caché antigua. Una lista completa marca chats abandonados; una respuesta vacía conserva la lista anterior.

- **Los comandos de contactos y lectura guardan datos en la base compartida.** Buscar personas por nombre y `contacts sync` ya no requieren la caché antigua. La sincronización sigue devolviendo solo cantidades. Eliminar el archivo anterior no reinicia su progreso; para obtener todos los contactos, ejecuta `max contacts sync`.

- **`max mcp` libera el modelo tras 10 minutos sin búsquedas.** `conversations_search` ya no mantiene aproximadamente 1 GB durante toda la sesión del agente. La siguiente búsqueda vuelve a cargarlo en alrededor de un segundo (cli-messaging 0.110.0).
- **El autocompletado consulta la base compartida de la cuenta elegida.** No necesita la caché anterior. Tab sigue sin conectarse a MAX; los bots ofrecen chats de su lista local.
- **`max mcp setup codex|claude-code` y `max mcp doctor`** añaden MCP local al cliente y comprueban inicio y herramientas. Si el perfil ofrece escritura, requiere `--allow-writes`; esa aprobación no cambia permisos ni verifica el acceso a MAX.
- **`max <бот> bot store fetch <чат>`** descarga historial en la copia del bot, recientes primero, y puede reanudarse. `--last`, `--since-time`, `--limit`, `--page-size` y `--pause` funcionan como `max store fetch`.
- **`--yes` para cualquier comando** aprueba la pregunta del nivel `ask` antes de escribir; `max account sessions end --others --yes` funciona igual.

### Cambios que pueden romper scripts

- **`messages send --topic` y `polls create --topic` rechazan claramente destinos MAX.** La opción compartida corresponde a temas de foros de Telegram, que MAX no admite. No envía mensaje ni encuesta; sin `--topic`, nada cambia.

- **`max doctor --json` describe la base compartida en `store` y el archivo anterior en `legacyCache`.** Ya no abre ni comprueba el esquema de la caché antigua. Cambia `cache` por `store` en scripts. Puedes borrar el archivo anterior y recuperar historial mediante `max store fetch`.
- **MCP consulta la base compartida.** Búsquedas, contactos, recursos y transcripciones usan `messages.db` bajo la cuenta del perfil, sin abrir la caché anterior. Leer historial guarda mensajes para búsqueda. La voz lleva `kind: "voice"`. Los nombres y parámetros de herramientas no cambian.
- **`inbox` y `review` usan formatos compartidos.** Sustituye `--since` por `--since-time`. `review --unanswered` acepta `4h`, `1d`, no horas sin unidad. Los adjuntos de voz usan `kind: "voice"` en lugar de `"audio"`. `--all` incluye silenciados y archivados. La primera ejecución migra el punto anterior de `inbox --new`. La revisión retrocede por páginas hasta 300 mensajes por chat e indica si está incompleta. Actualiza comandos y comprobaciones JSON.
- **Las transcripciones personales se guardan en la base compartida.** `messages transcribe`, `inbox`, `review` y MCP usan el mismo texto que `messages list` bajo la misma cuenta. No se migran transcripciones antiguas; se regeneran al solicitarlas con `--transcribe`, con modelo descargado.
- **`max <бот> bot people show` pasa a `max <бот> bot contacts show`**, herramienta MCP `max_bot_contacts_show`. Junto con `bot messages search|between`, son comandos compartidos con `tg`; opciones y resultados no cambian.
- **`max <бот> bot chats check` ahora es `max <бот> bot chats moderate`** — comparte el nombre y el comando con `tg`. `--since` pasa a ser `--since-time` (sigue aceptando `2h`, `1d`); la respuesta `--json` es `{ chatId, rows }` en lugar de una lista; la herramienta MCP es `max_bot_chats_moderate`. Las reglas y la posición de la última comprobación quedan en los mismos archivos. El nivel de consentimiento `flag` significa ahora lo mismo que `confirm`: preguntarte o actuar con `--allow-dangerous`.
- **`max <бот> bot mcp` utiliza permisos del perfil, no opciones.** Sin opciones puede escribir salvo restricciones por `readOnly: true` o `allow`. Eliminar muestra formulario; `--allow-dangerous` lo omite. `--allow-send`, `--allow-delete` y `--allow-moderate` se aceptan con avisos, sin habilitar nada. Usa `readOnly: true` para solo lectura. El servidor se comparte con `tg`.
- **`max bot messages search` busca palabras, mejores coincidencias primero**, en lugar de fragmentos por fecha. `--newest` restaura el orden anterior. Requiere todas las palabras; admite `"фраза"`, `-слово`, `а OR б` y `from:`, `chat:`, `after:`, `before:`, `has:`. Corrige erratas y lo avisa por stderr. Puedes escribir palabras sin comillas; `--from` sigue siendo repetible. No admite `in:`: solo busca en su copia y las autorizadas por `readOtherBots`.

### Correcciones

- **Los rechazos del bot indican un comando válido con `--bot`.** Para solo lectura propone desactivar `readOnly`; si falta un permiso en `allow`, propone añadirlo conservando los existentes. Antes indicaba el inexistente `bot config`.

## 0.22.0 — 02.10.2026

La mayoría de comandos personales se comparten con tg: opciones, resultados `--json` y base local comunes. Hay muchos cambios de nombres, indicados abajo. No se migra la caché anterior; tras actualizar, ejecuta sin `--offline` y descarga historiales con `max store fetch`.

### Novedades

- **`max conversations search "<запрос>"`** encuentra conversaciones por significado en uno o todos los chats. Descarga una vez `max models text download e5-small` (135 MB, compartido con `tg`) y calcula vectores con `max conversations embed --chat <чат>`. `embed status` indica pendientes; `embed clear` elimina vectores. Con `--provider openai` y tu clave (`max models text key set
  openai`) usa un servicio externo; `embed` indica tokens y precio y solicita aprobación.
- **`chats list --json` incluye `providerMetadata.partnerId` en chats individuales**, identificando a la otra persona. Permite resolverla porque MAX diferencia identificadores de chat y persona.
- **`max messages search` incluye otras cuentas de la base:** `in:max`, `in:personal`, `in:bots`, `in:all` o `--source`. Sin esas opciones sigue buscando en la cuenta activa.
- **`max conversations build|list|show` y `max messages links`** identifican conversaciones por respuestas, menciones y turnos, localmente sin consultar MAX. **`conversations
  batches status|next` y `conversations links add|clear`** proporcionan lotes al agente y reciben sus respuestas.
- **`max server logs`, `max server install`, `max server uninstall`**, como tg. `install` escribe un servicio systemd en Linux o launchd en macOS, sin iniciarlo; `max server start` y `stop` lo usan después. Si MAX rechaza el acceso, no lo reinicia, evitando nuevos accesos repetidos. Se conservan `max server start --idle` y `restart --idle`.
- **`max store status`** indica cantidades y tramos completos por chat. **`store fetch --background`** y **`store jobs list|show|cancel`** gestionan descargas en segundo plano. **`store info|check|migrate|backup|restore|reindex`** mantienen la base. **`store clear --left
  --allow-dangerous`** elimina chats abandonados y mensajes.
- **`max bot auth`, `max bot list`, `max bot chats list`, `max bot recipients` y `max bot sends list` se comparten con tg**, con iguales respuestas y ayuda. Token, destinatarios y registro conservan ubicación.
- **`max cache clear --left`** elimina solo chats abandonados y mensajes de la caché del perfil, sin tocar el resto.
- **`max messages search --regex`** — una expresión regular sobre todo el texto guardado. **`messages show|context msg:…`** — un mensaje mediante el enlace de `search`, sin un ID aparte.
- **`max polls show <чат> <сообщение>`** consulta encuesta, identificadores y votos sin cambiar nada.
- **`max polls create --send-id`** reintenta crear una encuesta sin duplicarla tras una respuesta perdida.
- **`max messages send --photo <путь>`** — envía `.jpg .png .webp` como foto, igual que en tg. `--no-preview` también está en `send`, pero MAX no lo admite y el comando rechaza la operación.
- **`max skill install`** instala la habilidad para agentes con un comando: en `~/.claude/skills/max-cli/` para Claude Code y en `~/.agents/skills/max-cli/` para Codex y Gemini CLI, con el número de versión de `max`. `--for claude` o `--for agents` instala solo en una carpeta. `max skill show` imprime lo mismo que antes.
- **El agente descubre la habilidad automáticamente.** Si está definida `AI_AGENT` o `CLAUDECODE` y la habilidad falta o es más antigua que `max`, aparece en stderr una línea sobre `max skill install` una vez al día. No se añade nada a stdout. Desactívalo con `max config set skillHint false --defaults`.
- **`max mcp` y `max bot mcp` ofrecen `max://skill`** y lo mencionan en instrucciones al agente.
- **`max messages delete` devuelve `operationId`**, también en `max sends list`. Igual con `max_messages_delete`; opciones sin cambios.
- **Cada registro tiene `operationId`**, común a filas de un envío, edición, eliminación o cambio de chat, para ver su resultado. En envíos equivale a `sendId`.
- **La instalación ocupa unos 16 MB menos**: la capa de base de datos ahora está incluida en el paquete, en lugar de instalarse por separado. Los comandos de `max` no cambian.

### Cambios que pueden romper scripts

- **`max messages search` busca palabras, mejores resultados primero.** `--newest` recupera orden reciente. Admite `"фраза"`, `-слово`, `OR`, `from:`, `chat:`, `after:`/`before:` y `has:`. Corrige erratas y lo avisa. `--context <n>` muestra contexto. JSON añade `match` y `score`.
- **`max bot updates watch` ahora es `max bot watch`**, como en tg y el `max watch` personal. Sin `--events`, solo se imprimen mensajes nuevos; con `--events`, se imprime todo y cada línea identifica su evento (`{ "event": "message" | "edit" | "delete" | "callback" | "joined" | … }`) en lugar del evento sin procesar de MAX. `--timeout` lo termina normalmente con el código `0`. Los perfiles de bot de solo lectura ahora pueden usar `watch`: recibir eventos es leer. Se mantiene el marcador desde el que continuar.
- **`bot webhooks list` devuelve `{ url, types }`**, no campos propios de MAX. `bot callbacks answer --text` deja de leer stdin mediante `-`. `bot commands`, `bot callbacks` y `bot webhooks` se comparten con tg; `webhooks set --secret-stdin` solo pregunta tras comprobar permisos.
- **Node 22.16 o posterior**, o Bun. Si Node en Linux usa SQLite del sistema antiguo, `max` reinicia con `@leemour/cli-messaging-sqlite` antes de leer o enviar. Node oficial y Bun no requieren cambios.
- **`max store` se comparte con tg.** `store fetch` guarda en la base común y pagina MAX como antes: 30 mensajes, pausas de 5–10 segundos y hasta 40 páginas por ejecución. Así `messages`, `conversations` y `store` leen lo mismo. No se migra la caché; vuelve a descargar. Además:
  - Rechaza `store fetch --estimate`: los identificadores de MAX no permiten contar lo pendiente.
  - `store fetch|export --since` pasa a `--since-time`, solo fechas, no identificadores.
  - `store fetch --max-pages <n>` pasa a `--limit <сообщений>`, predeterminado 1200, cuarenta páginas de 30. Tamaño mediante `--page-size`.
  - `store export --format md` pasa a `--format markdown`; `jsonl` no cambia. Los huecos se consultan en `store status`, no en stderr de exportación. No sobrescribe archivos.
  - `store fetch` deja de imprimir el comando de exportación.
  - si dos mensajes se enviaron en el mismo milisegundo y el límite de página quedó entre ellos, `store fetch` puede omitir el más antiguo. Es poco frecuente.
- **`max messages list|show|context|search` son comandos compartidos por tg y max.** `--offline` y `search` leen la copia local compartida, la misma que usa tg.
  Por qué: las mismas opciones y respuestas que tg, y una copia para leer.
  Ten en cuenta: las herramientas de lectura de mensajes y chats de `max mcp` aún leen la antigua copia de max, de modo que un agente mediante MCP y un comando del terminal con `--offline` pueden responder de forma distinta. La copia empieza a llenarse con la primera ejecución sin `--offline` tras actualizar; la antigua copia de max no se migra, ni tampoco las transcripciones de mensajes de voz escuchados antes de actualizar. Además:
  - Voz como `"kind": "voice"`, no `"audio"`; `inbox` y `review` aún usan `"audio"` en esta versión.
  - `messages list --before` y `--after` se dividen en `--before-id`, `--before-time`, `--after-id`, `--after-time`; `messages context`, `--before-n`, `--after-n`. Nombres antiguos producen errores.
  - `messages list --before-id` excluye ese mismo mensaje; con `--offline`, solo sirve `--before-id`, y únicamente con el ID de un mensaje de la copia local;
  - `messages list --transcribe --json` ya no devuelve el campo `transcribeProblem`: el motivo aparece en stderr; con `--offline`, `unheard` está vacío. El mensaje de voz se descarga en una conexión independiente; con `--no-serve`, supone un segundo inicio de sesión en MAX;
  - `max` busca los modelos de voz en `~/.cache/cli-common/models/audio`, la misma carpeta que tg; los descargados en `~/.cache/max-cli/models/audio` deben descargarse de nuevo o trasladarse;
  - `messages search` busca palabras y prefijos (`квартир` encuentra «квартира»), no tres letras cualesquiera. `--chat` acepta títulos guardados.
- **`max chats list|show` y `max contacts list|show` son comandos compartidos por tg y max.** Su `--offline` lee la copia local compartida, la misma que usa tg.
  Por qué: las mismas opciones y respuestas que tg.
  Ten en cuenta: la copia empieza a llenarse con la primera ejecución sin `--offline` tras actualizar; la antigua copia de max no se migra y, hasta entonces, `--offline` devuelve `not_found`. Además:
  - `chats list --search|--kind|--unread` sin `--offline` busca en los 200 chats más recientes y avisa en stderr si había chats anteriores; con `--offline`, busca en todos los guardados;
  - `chats show --offline` no incluye `description`, `access` ni `settings`, conocidos solo por MAX.
  - `--kind` incorrecto devuelve `--kind is one of dialog, group, channel, saved`.
  - `cache clear` también elimina esta cuenta de la base compartida; `contacts sync` recupera todo allí.
- **`max messages send|edit|forward` son comandos compartidos por tg y max.** Respuestas `--json`: `send` devuelve `{sendId, operationId, message}` (con `scheduledFor` si se usa `--at-time`); `forward` también devuelve `{sendId, operationId, message}`; `edit` devuelve `{operationId, message}`, en lugar del mensaje sin envoltorio. Las herramientas MCP `max_messages_send`, `max_messages_edit` y `max_messages_forward` responden igual; `max_messages_edit` ya no tiene `markdown`, y `max_messages_forward` ya no tiene `send_id`.
  Por qué: las mismas opciones y respuestas que tg, con un ID de acción como en el registro de envíos.
  Ten en cuenta: un script que leía el mensaje de la raíz de la respuesta ahora debe leer `message`. `send` ya no permite varios `--file` en un mensaje: un adjunto de `--file` y uno de `--photo`. Si un envío con `--at-time` no recibe respuesta, el error recomienda `messages scheduled` sin nombrar el chat.
- **`max polls` se comparte con tg.** `polls vote|close --json` devuelve `{operationId, poll}`, donde `poll` contiene `{chatId, messageId, question, answers: [{id, text, voters, chosen}], closed, multiple,
  anonymous, voters}`; `polls create`, `{sendId, operationId, message}`. Igual con `max_polls_vote`, `max_polls_close`, `max_polls_create`. `max_polls_create` cambia `revote` por `silent`.
- **Las respuestas `--json` de reacciones, fijación y marcado como leído se comparten con tg**, y cada una incluye `operationId`, el ID de esa acción como en el registro de envíos:
  - `reactions add|remove`: `{operationId, chatId, messageId, reaction}`, reacción propia o `null`, sin cantidades (están en `messages list`).
  - `messages pin|unpin`: `{operationId, chatId, messageId, pinned}`, con `pinned` como `true` o `false`.
  - `chats mark-read`: `{operationId, chatId, until}`, con `null` para el más reciente.

  Igual en `max_reactions_add`, `max_reactions_remove`, `max_messages_pin`, `max_messages_unpin`, `max_chats_mark_read`.
- **`max messages unpin <чат> <сообщение>`** ahora exige un número de mensaje, como `pin` y tg. MAX tiene un mensaje fijado por chat, y se desfija ese mensaje sea cual sea el número indicado. La herramienta MCP `max_messages_unpin` también exige `message`.
  Ten en cuenta: `messages unpin <чат>` sin número da error; añade cualquier número de mensaje de ese chat.
- **Desaparecen `max serve --detach` y `max serve --stop`:** utiliza `max server start` y `max server stop`. `serve` trabaja en primer plano; `max server` gestiona el segundo. Actualiza scripts y servicios manuales.
- **`max server status --json` usa el formato tg:** `byHand` pasa a `by`: `hand`, manual; `command`, iniciado por comando; `server`, por `max server start`; `unit`, servicio. Añade `log`, `unit` y `stale` si quedó una marca de un servidor caído. `max server start`, `stop` y `restart` devuelven `{ started, by, pid, startedAt, log }` y `{ stopped, by, pid }`, sin `socket`.
- **`max messages send --at` pasa a `--at-time`**; el nombre anterior `--at` produce error; reemplázalo por `--at-time`. `at` de `max_messages_send` en MCP no cambia.
- **Se elimina `--markdown`; usa `--md`** en `messages send`, `messages edit` y donde se lea formato. Ese es el nombre en todos los comandos tg y max; un script con `--markdown` da un error de «opción desconocida»: sustitúyelo por `--md`.
- **`max sends list --json` cambia `cid` por `sendId`, cadena en lugar de número**, como `outcome_unknown` y `--send-id`. También muestra así registros antiguos.
- **Los registros de ejecuciones (`--trace`, `--record`, `max runs show`) usan un formato compartido por tg y max.** El ID de envío de un evento se llama `send`, en lugar de `cid`; el campo de error de MAX es `providerError`, en lugar de `maxError`, en los eventos, `run.json` y `details` de los errores `--json`.
- **`max bot` devuelve `outcome_unknown`, código `14`, en escrituras con respuestas 502, 503 o 504**, antes `provider_unavailable`, código `12`. El intermediario no demuestra si MAX ejecutó la petición. Reintentar `12` podía duplicar; con `14`, comprueba primero. Las lecturas siguen reintentándose y devuelven `provider_unavailable`.
- **Los comandos de bot adoptan nombres tg sin alias.** `max bot messages get <сообщение>` pasa a `messages show <чат> <сообщение>`; `messages edit|delete` también reciben chat primero. `bot chats get` pasa a `chats show`; `bot chats pin|unpin`, a `messages pin|unpin <чат> <сообщение>`. `--format markdown|html` pasa a `--md` o `--html`; desaparece `--type`: usa `--photo`, `--voice` o `--as-file` para vídeos como archivo. `chats action` acepta `typing`, `photo`, `video`, `voice`, `file`. Enviar y editar devuelve `{ operationId, message }`. Eliminar pregunta; `--allow-dangerous` aprueba. MCP: `max_bot_chats_show`, `max_bot_messages_show`, `max_bot_messages_pin`, `max_bot_messages_unpin`.
- **`max bot members` y `max bot admins` ahora son `max bot chats members` y `max bot chats admins`**, como en tg. `admins add` acepta `--can` con los valores de `max chats admins add` (`read`, `members`, `admins`, `info`, `pin`, `link`, `edit`, `delete`) en lugar de `--permissions`, y `--title` en lugar de `--alias`. `--can` no incluye permisos de «llamadas» ni «estadísticas». `admins list` devuelve `{ id, name, username, role,
  rights, title }`. Herramientas MCP: `max_bot_chats_members_list|add|remove`, `max_bot_chats_admins_list`.
- **Los cambios locales se clasifican como escrituras.** `config set` y `unset`, `chats rules set` y `unset`, `recipients add`, `remove`, `clear`, y `auth set`, `remove`, `chats rules set`, `unset`, `recipients add`, `remove`, `clear` del bot modifican configuración, reglas, destinatarios o almacén, no MAX. La [referencia](./commands.md) indica que solo cambia el equipo; `max commands` lo muestra en `writes`. Los filtros de solo lectura mediante `max commands --json` ahora los excluyen.

### Correcciones

- **`max store fetch` por fecha ya no omite mensajes en límites de página** y se detiene si MAX repite páginas.
- **`max messages list --before-time` excluye mensajes del mismo milisegundo:** «antes» es estrictamente anterior.
- **`max messages list --after-id` (0.21.0: `--after <id>`) indica si hay página siguiente**, en lugar de negar siempre al avanzar.
- **`max messages send --voice` funciona mediante `max serve`.** Antes perdía la forma de onda y MAX rechazaba con `proto.payload`, código `11`. Con `--no-serve` ya funcionaba.
- **`max chats list` y `max chats show` eliminan chats abandonados** al recibir una lista completa en el siguiente acceso. Antes permanecían con cantidades obsoletas. Sus mensajes quedan hasta `max cache clear --left`; `max serve` detecta la salida en el siguiente acceso completo.
- **`max serve` no confunde respuestas tras uso prolongado.** Los números de dos bytes reinician tras 65 536 peticiones; ahora se omiten los que aún esperan respuesta.

## 0.21.0 — 30.09.2026

### Cambios que pueden romper scripts

Los comandos siguen una misma regla: primero el objeto y después la acción. Los nombres antiguos ya no funcionan: `max` devuelve «unknown command» o «unknown option» con el código `1` y no hace nada.

- **`max backup messages` pasa a `max store fetch`.** Descarga inmediatamente; `--estimate` solo calcula (antes requería `--run`). Conserva máximo `--max-pages` de 40 páginas y pausas. `--pause` exige duración (`5s`, `500ms`), no número sin unidad. `--since` y `--last` son opcionales; sucesivas ejecuciones llegan al inicio, reanudando.
- **`max export messages` → `max store export`.**
- **`--cid` pasa a `--send-id`** en `messages send` y `messages forward`. `outcome_unknown` usa `sendId`; `max_messages_send` y `max_messages_forward` cambian `cid` por `send_id`.
- **`max chats read` pasa a `max chats mark-read`**; `max_chats_read`, a `max_chats_mark_read`.
- **Se elimina `max chats settings`.** `max chats show` muestra los ajustes del grupo (campos `settings`, `description`, `access`; el enlace de invitación sigue en `max chats link show`), y `max chats update <чат> --all-can-pin on|off` y las demás opciones de ajustes los modifican.
- **`max update` → `max upgrade`**, y el aviso de nueva versión indica `max upgrade`.
- **`max recipients off` pasa a `max recipients clear`**, respuesta `off` a `cleared`; **`max bot recipients off`, a `max bot recipients clear`**.
- **`max account sessions end-others` pasa a `max account sessions end --others`**; sin `--others` rechaza.

### Novedades

- **`max complete` aparece en `max --help`**, para encontrar cómo activar Tab.
- **[Acceso desde navegador](./remote.md): ChatGPT o Claude**, con proxy de contraseña y dirección pública Tailscale sin dominio propio. Basado en documentación, sin prueba completa.

## 0.20.0 — 30.09.2026

### Cambios que pueden romper scripts

- **El almacén compartido de mensajes pasa a la versión 6** (cli-messaging 0.49.0). La primera ejecución de `max` actualiza `messages.db`; después, las versiones de `tg` anteriores a la publicada ese día rechazan abrir el archivo y piden actualizar: `npm install -g @leemour/tg-cli@latest`. Los comandos de `max` no cambian.
- **`--all-bots` necesita autorización para leer otros bots.** Define `readOtherBots` en `bot`: `max <имя> config set --bot readOtherBots true` o lista de perfiles. Sin ella, código `5` y comando para permitirlo.
- **Cuando un nombre coincide con varias personas, los candidatos se ordenan por nombre**, con las personas sin nombre primero; antes seguían el orden de la caché. El texto del error no cambia.

### Novedades

- **`--bots news,support`** en `bot messages search`, `bot people show`, `bot messages between` consulta solo esos perfiles autorizados por `readOtherBots`. `bot messages search` también admite `--all-bots`.
- **`bot mcp` ofrece `all_bots` y `bots`** en esas tres herramientas solo si se autorizan lecturas entre bots.
- **Cada bot conserva sus personas.** Las vistas por uno no aparecen en otro sin `--all-bots` o `--bots`.
- **La búsqueda del bot encuentra fragmentos de tres letras** (`вартир` encuentra «квартиру»), igual que la búsqueda personal en esta versión.

## 0.19.0 — 28.09.2026

### Cambios que pueden romper scripts

- **Un agente mediante `max mcp` cierra una encuesta solo si el perfil permite `edit`.** Antes bastaba con `reaction`.
  Por qué: cerrar modifica el mensaje de la encuesta, y `max polls close` siempre exigía `edit`; el agente y una persona tenían permisos distintos para la misma acción.
  Ten en cuenta: si `allow` del perfil incluye `reaction` pero no `edit`, el agente ya no ve `max_polls_close`; añade `edit` para que pueda cerrar encuestas. Si no se define `allow`, no cambia nada. Consulta [docs/mcp.md](./mcp.md).

### Correcciones

- **`max mcp --confirm-send` arranca cuando los cambios de cuenta se habilitan solo con `mcpTools`.** Antes, la opción exigía también una de las opciones `--allow-*`; de lo contrario, el servidor no arrancaba.
  Por qué importa: por este motivo, un servidor con solo `mcpTools` funcionaba sin formulario de confirmación; el agente podía añadir y eliminar contactos, crear grupos y cambiar el perfil sin preguntarte.
  Ten en cuenta: sin `--confirm-send`, todo sigue igual. Añade la opción al comando de inicio del servidor para ver un formulario antes de cada cambio.
- **`max <бот> bot messages search --limit N` indica más resultados.** Antes siempre devolvía `hasMore: false` y `limit` de configuración en lugar de `N`, deteniendo scripts y agentes que comprueban `hasMore` antes de tiempo. Ahora devuelve `hasMore: true` si supera `N`.

## 0.18.1 — 28.09.2026

### Correcciones

- **`max contacts rename` se refleja inmediatamente** en `contacts show` y título del chat. Antes esperaba hasta que `max serve` iniciara sesión porque no aplicaba el contacto devuelto. Si sigue obsoleto, el primer comando 0.18.1 sustituye el servidor anterior.

## 0.18.0 — 28.09.2026

### Novedades

- **Herramientas de cuenta en `max mcp`:** añadir, eliminar, renombrar y bloquear contactos; cerrar tu encuesta; entrar, salir y crear grupos; gestionar administradores; cambiar nombre y descripción. Antes solo leía y enviaba mensajes. Solo tú las habilitas mediante `mcpTools`, por ejemplo `max config set mcpTools contacts,polls`; no mediante opciones del agente. Todas pasan por `readOnly`, `allow` y registro. Consulta [MCP](./mcp.md).
- **Las subidas del bot aparecen en `--trace` y registros.** `bot messages send --file` y `bot uploads put` muestran tipo, tamaño, estado HTTP y duración en dos líneas. Nunca muestran ni guardan dirección o nombre del archivo.

### Correcciones

- **`max contacts rename` ahora cambia el nombre.** Antes, MAX indicaba éxito, pero el nombre seguía igual.
  Por qué: sin el campo `lastName`, MAX no modifica nada y no avisa. Ahora siempre se envía `lastName` (`null` si no hay apellido), igual que en el cliente web.
  Ten en cuenta: los nombres «cambiados» con 0.17.x en realidad no cambiaron; vuelve a renombrarlos.

## 0.17.1 — 28.09.2026

### Correcciones

- **Los errores de `--limit`, `--last` y `--max-pages` repiten el valor introducido.** Afecta a `messages list`, `inbox`, `backup`, `sends list` y comandos del bot. Antes, `--limit abc` aparecía como `NaN`; en 0.17.0 solo se corrigieron las listas paginadas.
- **`runs list` y `sends list` truncadas por `--limit` indican `hasMore: true`.** Antes devolvían `hasMore: false` y un `limit` distinto al solicitado. Los scripts que seguían `hasMore` podían detenerse en la primera página.
- **Los contactos renombrados usan el nombre que les has dado**, como MAX. Antes `max` mostraba el nombre propio aunque lo cambiaras mediante `contacts
  rename` o en la aplicación.

## 0.17.0 — 28.09.2026

### Cambios que pueden romper scripts

- **Todas las listas con `--json` son objetos `{items, page, limit, hasMore}`, no arrays.** Incluye `account sessions list`, `chats members list`, `chats folders list`, `messages scheduled`, `messages download`, `messages context`, `models audio list`, `recipients list`, `sends list`, `runs list`, `chats check`, `chats events` y listas del bot. Antes algunas eran arrays y `chats events` devolvía `{events, more}`.
  Motivo: había tres formatos distintos que los scripts y agentes debían recordar.
  Ten en cuenta: lee `.items` en vez del array. Sin paginación, `page` es 1 y `limit` el número de filas. `bot members list` y `bot admins list` añaden `marker`; `user_id` es una cadena. `bot messages get` devuelve el mensaje, no un array de uno. `--jsonl` y las tablas no cambian. MCP usa el mismo formato.

### Novedades

- **`max doctor` y `max config show` reconocen los bots.** La lista incluye todos los perfiles de este ordenador, marcados como cuenta personal, bot o ambos. Antes no aparecían los perfiles de bot. `doctor` muestra el origen del token del bot (sin el token), cuántos chats ha visto el bot y dónde están los archivos del perfil; `doctor --online` pregunta a Bot API a quién pertenece el token.
  Ten en cuenta: para perfiles de bot, `doctor` y los comandos personales ya no recomiendan `session start`; indican el comando adecuado `max <имя> bot …`.
- **Herramientas MCP `max_status` y `max_bot_status`.** Indican el perfil, la existencia de token y herramientas de escritura activas. No envían nada; `max_status` ni inicia sesión.
- **El autocompletado con Tab reconoce los bots.** Para los comandos de bot, sugiere los chats que ha visto el bot en lugar de los de la cuenta personal; para la primera palabra, sugiere todos los perfiles, incluidos los de bot.
- **Los comandos del bot tienen registros como los personales.** `max <имя> bot … --trace` muestra peticiones Bot API en stderr: operación, chat/mensaje, estado HTTP y duración. `--record` guarda ejecuciones; los fallos se guardan solos con sus peticiones. Consulta `max runs list`, `max runs show`. Las cargas `--file` aún no se registraban; se añadieron en 0.18.0.
- **Ajustes separados para cuentas y bots.** Secciones `personal` y `bot`, con `defaults` y `profiles` propias. `max config set --personal|--bot` escribe la sección; `max config show --bot` indica la clave de origen, como `config file: bot.profiles.test`. Motivo: necesitan reglas diferentes. Prioridad: perfil de sección, perfil general, sección, `defaults` generales. Los archivos antiguos siguen funcionando. Consulta [Configuración](./configuration.md).
- **Límite por hora para bots.** `max <имя> config set --bot sendsPerHour 200` lo define. Por defecto sigue sin límite.
- **`max config set defaultProfile <имя>`** selecciona el perfil cuando la primera palabra no lo indica; antes siempre `default`.
- **Foto, nombres propios y bloqueo.** `max account update --photo <файл>` cambia la foto. `max contacts rename <кто> <имя> [фамилия]` cambia el nombre solo para ti. `max contacts block <кто>` y `unblock` bloquean incluso a quien no está en contactos. Aplican los controles de `account update` y `contacts add`. `contacts rename` aún no cambiaba realmente el nombre; corregido en 0.18.0.
- **Canales.** `max chats create <название> --channel` crea un canal privado. Invita mediante `max chats link show`: MAX puede rechazar añadir personas directamente.
- **Permisos de lectura y enlace.** `max chats admins add <чат> <кто> --can read,link` permite leer la historia y cambiar la invitación. Un bot administrador sin `read` no ve mensajes del grupo.
- **Tiempos relativos.** `--since`, `--before`, `--after` admiten `30m`, `2h`, `1d`: `max review --since 1d`. Antes exigían tiempos exactos.

### Correcciones

- **Los cambios propios de chats se ven inmediatamente.** Tras `max chats update`, `chats settings`, `chats link
  reset`, `chats show` y `chats list` mostraban el nombre antiguo durante minutos. MAX no devuelve el cambio como evento; ahora `max serve` aplica el chat de la respuesta, como los mensajes enviados.
- **`max export messages` ya no avisa de un hueco hasta 1970-01-01 tras un `backup` completo.** Antes seguía indicando que faltaba el inicio.
- **Los errores de `--limit` y `--page` repiten lo que escribiste.** Antes, un error para `--limit abc` identificaba el valor introducido como `NaN`.
- **Una invitación revocada en `chats inspect` o `chats join` da `not_found`, código 6**, en vez de un rechazo MAX con número de operación. Los scripts deben esperar 6.
- **`max config show` y `max doctor` no inventan `<имя>.moderation` como perfil.** Antes confundían el archivo de reglas con uno.
- **Errores de subcomando nombran la palabra desconocida, no el perfil.** `max work bot auth status` culpaba a `work` en lugar de `status`.
- **`max config show` incluye `transcribeModel`**, antes ausente.

### Eliminaciones

- **Solicitudes de ingreso: `max chats requests list|accept|decline`, regla `requests`, niveles `consent.accept` y `consent.decline`.** MAX permite grupos abiertos o mediante invitación, sin aprobación de solicitudes; los comandos prometían algo inexistente. Los archivos antiguos siguen leyéndose y pierden esas claves al escribirse. Los scripts con `chats requests` reciben «comando inexistente».

## 0.16.0 — 27.09.2026

### Novedades

- **Personas e historial del bot.** `max <имя> bot people show <кто>` muestra dónde escribió y su chat privado. `bot messages search --from <кто>` encuentra uno o varios autores; `bot messages between <кто> <кто>` muestra sus mensajes en chats comunes. Solo usa lo visto en el equipo; `--all-bots` incluye todas las copias.
- **Moderación del bot por reglas.** `max <имя> bot chats check <чат>` comprueba lo nuevo según `bot chats rules show|set|unset`, borrando mensajes o expulsando personas. Ingresos mediante `bot updates watch`. Sin `--no-ban`, quien es expulsado no vuelve por enlace; Bot API no puede deshacerlo. Tampoco conoce la antigüedad de cuentas.
- **Encuestas.** `max messages list` muestra la encuesta en texto: pregunta, opciones con ID en `[скобках]`, votos y ✓ junto a tu opción. `max polls vote <чат> <сообщение> <вариант>…` vota, `--retract` retira el voto, `max polls close` cierra tu propia encuesta y `max polls create` crea una. MCP ofrece `max_polls_vote` y `max_polls_create`, solo con `--allow-send`.
  Ten en cuenta: `max` rechaza lo que rechazaría el cliente web — encuestas cerradas, opciones de más o un segundo voto sin derecho a cambiarlo — sin enviar nada. web.max.ru no muestra encuestas y `polls create` lo recuerda.
- **`max <имя> bot mcp` para agentes.** Solo lectura por defecto; escritura con `--allow-send`, `--allow-delete`, `--allow-moderate`, `--confirm-send`. Ejecuta los mismos comandos con destinatarios y registro. Acciones que requieren consentimiento se muestran en un formulario. Consulta [MCP del bot](./bot.md#бот-для-агента-mcp).

### Cambios que pueden romper scripts

- **El parámetro `timeout` de `max bot api get-updates` ahora se indica con `--poll-timeout`.** Antes, `--timeout` de esta operación no llegaba a MAX: `--timeout` es el plazo total del comando.
  Ten en cuenta: los scripts que pasaban `--timeout` para consultas de larga espera deben usar `--poll-timeout`.

### Correcciones

- **La primera orden de una versión nueva sustituye al `max serve` antiguo.** Antes seguía rechazando operaciones nuevas, como votos, hasta `max server stop`.
- **También se sustituye una compilación distinta con igual versión.** Un servidor iniciado a mano rechaza operaciones desconocidas sugiriendo `max server stop`.
- **`max bot api get-updates --limit …` funciona.** Antes, `--limit` de la operación se confundía con un ajuste de `max` y el comando rechazaba la operación.

## 0.15.0 — 27.09.2026

### Novedades

- **`max chats check <чат>` modera por reglas.** Lee mensajes y participantes nuevos desde la última revisión, aplica `max chats rules` y avisa, borra o expulsa. Por defecto solo informa; `--dry-run` planifica; máximo 10 acciones. Los cambios pasan los controles habituales. Las solicitudes solo estaban previstas aquí y se eliminaron en 0.17.0 porque MAX no las tiene. Consulta [Grupos](./groups.md).
- **Moderación mediante agente.** `max mcp --allow-moderate` ofrece `max_chats_check`; siempre se ofrecen los lectores `max_chats_events`, `max_chats_members`, `max_chats_rules`. Sin el indicador no hay herramienta de actuación. Los cambios pendientes de consentimiento se muestran juntos en un formulario.
- **Roles e invitaciones.** `max chats members list` indica `owner`, `admin`, `member`. `max chats link show <чат>` muestra la invitación.
- **Vídeos y voz personales.** `max messages send <чат> --file ролик.mp4` reproduce vídeo en el chat (`.mp4 .mov .webm .mkv`); `max messages send <чат> --voice
  заметка.ogg` envía voz con onda y duración. Antes el vídeo era archivo; `--as-file` conserva ese comportamiento. Voz solo Ogg Opus; otro audio sugiere `ffmpeg`. Consulta [Uso](./usage.md).
- **Los mensajes de voz aparecen como texto en la lista.** `max messages list <чат> --transcribe` y `max inbox
  --transcribe` transcriben los mensajes de voz mostrados en este ordenador; el texto aparece bajo el mensaje con el icono 🎤 y, en `--json`, en `transcript`. MCP utiliza `transcribe: true` en `max_messages_list` y `max_inbox`.
  Ten en cuenta: los mensajes ya transcritos muestran el texto incluso sin la opción. La transcripción requiere un modelo descargado.
- **Más comandos de bot.** `max <имя> bot messages send --file <путь>` adjunta imagen/vídeo/audio/archivo; `bot uploads put` solo carga. `bot members list|add|remove`, `bot admins list|add|remove`, `bot comments list|get|send|edit|delete`, `bot callbacks answer`, `bot commands
  list|set|clear`, `bot webhooks list|set|delete`. Consulta [Bots](./bot.md). `webhooks set` rechaza otro destino porque MAX mantendría ambos, en lugar de sustituirlo.
- **Copia local del bot.** Lo leído/enviado/recibido se conserva. `max <имя> bot messages list <чат> --offline`, `messages get --offline` leen sin red; `bot messages search <текст>` busca. El borrado propio u observado por `updates watch` retira el mensaje; la copia contiene texto.
- **`max <имя> bot updates watch`** muestra eventos hasta Ctrl-C, guarda mensajes y reanuda desde la posición anterior. No funciona con webhook; consume los eventos de otros lectores: ejecútalo solo si nadie más necesita el bot.
- **Personas en la copia.** `max <имя> bot people show <кто>` muestra chats y últimos mensajes privados; `--refresh` relee desde MAX. `bot messages
  search --from <кто>` filtra autor; `bot messages between <кто> <кто> …` compara autores en chats comunes. `--all-bots` incluye todas las copias. Persona: número, `@username` o parte del nombre.

### Cambios que pueden romper scripts

- **`max bot messages list` ordena de antiguos a nuevos**, como `max messages list`. Los envíos del bot se marcan propios. Los scripts que tomaban la primera fila como la más reciente deben adaptarse.

### Correcciones

- **`max review --transcribe` cierra MAX antes de reconocer.** Primero descarga grabaciones, cierra y ejecuta el modelo.
- **`max bot api edit-my-commands`, `subscribe`, `unsubscribe`, `get-upload-url` funcionan.** Antes fallaban con «an account change without a known action» sin enviar nada.
- **Un destinatario positivo sin `user:` se identifica como probable persona** y sugiere `user:<номер>`.
- **Los ejemplos de [Bots](./bot.md) usan identificadores reales**, explicando cómo obtenerlos.

## 0.14.0 — 27.09.2026

### Novedades

- **`max bot` usa el Bot API oficial.** `max bot auth set` valida y guarda el token separado de la cuenta personal. Perfil primero: `max рабочий bot me`. `max bot me` muestra el bot; `max bot api <операция>` ejecuta las 33 operaciones con parámetros y cuerpo JSON, generadas desde la [especificación oficial](https://github.com/leemour/max-cli/blob/v0.37.0/docs/dev/bot-api-coverage.md). IDs mayores que 2^53 son cadenas para conservar dígitos; los scripts deben tratarlos así.
- **Comandos prácticos para bots.** `max <имя> bot messages send <чат> <текст>` envía a un chat por número, a una persona como `user:<номер>` o por el título de un chat que el bot ya ha visto; también hay `edit`, `delete`, `list` y `get`. `max <имя> bot chats list` muestra los chats que ha visto el bot; también están `chats get|pin|unpin|leave|action`. `max bot list` muestra todos los nombres con un token de bot.
  Por qué «que ha visto»: MAX no ofrece una lista de chats del bot, por lo que `max` los recuerda por su cuenta.
- **Destinatarios y registro del bot.** `max <имя> bot recipients add|list|remove|off`, `max <имя> bot sends list`. Se comprueban todas las escrituras, incluidas `bot api`. Aún no hay límite por hora; llega en 0.17.0. Consulta [Bots](./bot.md).
- **Actividad de grupos.** `max review --unanswered [часы]` encuentra preguntas sin respuesta tuya ni de administradores; `max review --chat <чат>` revisa un chat. `max chats events <чат>` muestra ingresos, salidas, altas y expulsiones. `max chats members list
  <чат>` lista miembros con registro y última actividad. `max chats
  rules show|set|unset <чат>` guarda reglas juntas, como `config set`.

### Correcciones

- **Cuando MAX cierra la conexión, el error indica código y motivo.**

## 0.13.0 — 26.09.2026

### Novedades

- **`max review` revisa obligaciones.** Todos los mensajes, también tuyos, desde la última revisión (tres días sin `--since`). `--transcribe` reconoce voz. Termina indicando dónde iniciar la siguiente revisión. Si falta lectura, señala resultado incompleto: no lo consideres completo ([Uso](./usage.md#обзор-кто-кому-что-должен)).
- **`max_review` y `/review` en MCP.** El agente separa mis obligaciones, esperas y dudas; revisa grupos antes de declarar retrasos y prepara recordatorios. Solo envía con tu aprobación ([MCP](./mcp.md#команды-и-чаты-по-)).
- **`max mcp config` imprime configuración para Claude Desktop, Cursor y otros.** Rutas absolutas para Windows y clientes sin `PATH` del terminal ([Conexión](./mcp.md#подключение)).
- **`max doctor` comprueba la instalación:** qué ejecuta `max`, dónde está instalado, si un terminal nuevo lo encontrará, si se cargan el llavero y SQLite y si hay un modelo de voz descargado.
  Ten en cuenta: si la carpeta del comando no está en `PATH`, `doctor` imprime un comando para corregirlo: para PowerShell en Windows y `export` en Linux y macOS. Si no se encuentra el propio `max`, ejecuta `npx @leemour/max-cli doctor` ([troubleshooting.md](./troubleshooting.md#max-не-находится-после-установки)).
- **`max doctor --online`** realiza un inicio, lee un chat y arranca MCP sin enviar.
- **`max models audio download` prueba el modelo descargado.** Si falta, indica idioma y alternativas con tamaños.

### Cambios que pueden romper scripts

- **`max_messages_attachment` pasa a `max_messages_photo`.** Renueva permisos guardados del cliente MCP.
- **No se admite el perfil `review`**, ahora una orden; renombra perfiles existentes.

### Seguridad

- **Los informes Windows ocultan el directorio personal con cualquier escritura.** Antes el nombre del usuario seguía visible en ciertas rutas.

## 0.12.0 — 26.09.2026

### Novedades

- **Más MCP:** `max_inbox` reúne lo nuevo; respuestas y formato, reacciones, fotos como imagen visible al agente ([Herramientas](./mcp.md#инструменты)).
- **`/catch-up`, `/reply`, `/find` y chats mediante `@` en Claude Code** ([Comandos](./mcp.md#команды-и-чаты-по-)).

### Correcciones

- **`max serve` funciona en Windows** mediante canal con nombre, no archivo.
- **Sockets demasiado largos en macOS/Linux dan un error claro**, no `EINVAL`; pueden alargarse por perfil o `MAX_STATE_DIR`.

## 0.11.0 — 26.09.2026

### Novedades

- **`max watch --events` muestra ediciones, borrados y reacciones** con campo `event`; sin indicador conserva formato ([Eventos](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch)).
- **Informes mediante incidencias GitHub, no correo.** `max doctor report create` imprime enlace con título y plantilla; se adjunta el informe. Incidencia y archivo son públicos ([Problemas](./troubleshooting.md#как-сообщить-о-проблеме)).
- **Todos los errores guardan una ejecución**, incluso indicadores inválidos, comprobaciones previas y órdenes sin MAX (`models`, `server`, `watch`). Antes solo los que alcanzaban MAX. Solo se guardan palabras de comando, no argumentos ni mensajes ([Diagnóstico](./diagnostics.md)).
- **`max backup messages --run` indica ubicación y siguiente paso.** Conserva en copia local; `max export messages` crea archivo. La orden aparece al final y en `export`.
- **`max serve` comprueba permisos y registra envíos:** lectura, acciones, destinatarios y límite. `config set` se aplica sin reiniciar. No se inicia con `MAX_TOKEN`.
- **Tras iniciar sesión, `max serve` solicita lo mismo que una pestaña de web.max.ru:** carpetas, banners, historial de llamadas, conjuntos de stickers y reacciones. **También vuelve a iniciar sesión del mismo modo:** pasa a MAX la hora del inicio anterior y pide solo los chats modificados, en lugar de toda la lista.
  Por qué: cuanto menos difiere `max` del cliente web, menos motivos tiene MAX para detectarlo.
  Ten en cuenta: todo esto es solo lectura; las respuestas no se muestran ni se guardan. Los comandos puntuales no lo hacen ([security.md](./security.md#что-уходит-в-сеть)).
- **El servidor en segundo plano tolera un mensaje entrante de MAX malformado:** lo omite, escribe una línea sobre ello y sigue funcionando. Antes, ese mensaje podía detener el servidor.

### Cambios que pueden romper scripts

- **Más protección para agentes.**
  - `max mcp --confirm-send` confirma cualquier escritura —edición, reenvío, fijado, lectura y borrado—; aprobación única durante cinco minutos.
  - `sendsPerHour` incluye ediciones, fijados con aviso y cada persona añadida. Los programados cuentan a la hora de salida. Dos envíos simultáneos ya no superan juntos el límite.
  - Con destinatarios activos, crear grupo o añadir personas exige que el chat privado de cada una esté autorizado.
  - `chats members add` no muestra historia sin `--history`; se elimina `--hide-history`.
  - `MAX_PROFILE_LOCK` fija el proceso en un perfil.
  - `--file` rechaza archivos ocultos y propios de `max` sin `--allow-any-file`.

  Ten en cuenta: el límite se consume antes. Retira `--hide-history` de scripts; añade `--allow-any-file` si debes enviar archivos ocultos.

### Correcciones

- **`max watch` no confunde ediciones/borrados con mensajes nuevos**, aunque MAX los envíe con el mismo formato marcado.
- **Un nombre exacto no gana en silencio.** Si también forma parte de otro chat, enumera ambos y exige ID: un envío al destinatario equivocado no puede deshacerse.

### Seguridad

- **El token de `MAX_TOKEN` se queda solo ahí.** Si MAX emite un token de sesión nuevo, `max` no lo escribe ni en el llavero ni en un archivo, y avisa en stderr. `max doctor` indica el archivo `credentials.json` si el token se guarda allí en lugar de en el llavero.
- **`max session start` oculta el teléfono**, como `max account show`. Ctrl-C al pedir token termina con `130`.
- **El servidor en segundo plano no entrega el token** a los comandos que le consultan sobre el inicio de sesión: no lo necesitan y consultan el llavero.
- **Límites de red.** Tramas MAX descomprimidas hasta 32 MiB; conexión y descargas no esperan indefinidamente. `max messages download` solo HTTPS, sin equipo local ni red privada, incluso tras redirecciones; máximo 4 GiB, voz para transcripción 32 MiB. Los enlaces provienen de terceros y pueden apuntar a cualquier lugar.
- **Permisos locales.** Base y `-wal`, `-shm` con `0600`, directorio `0700`; se corrigen los existentes al abrir. Los informes sustituyen IDs por etiquetas.
- **Texto ajeno en una línea y controles visibles** en conversaciones, tablas, candidatos, Markdown y rutas de `messages download`. Se limpian caracteres de control/dirección en nombres. Solo `http`, `https` se convierten en enlaces Markdown.
- **Autocompletado inserta solo números** de chat/persona, mostrando nombre aparte: títulos y `@имя` pertenecen a terceros y no deben ejecutarse en la shell.
- **`max cache clear` sin perfil limpia el predeterminado y respeta `MAX_PROFILE`.**
- **Los lanzamientos son más estrictos.** Las versiones de dependencias se fijan exactamente; el paquete se compila desde cero antes de cada empaquetado, sin utilidades de prueba; publica un paso independiente que no instala ni ejecuta dependencias.

## 0.10.0 — 25.09.2026

### Novedades

- **`max doctor report`, `max doctor report create` preparan informes.** La primera explica contenido; la segunda crea archivo sin texto y pasos de envío. Aquí por correo; desde 0.11.0 por GitHub ([Problemas](./troubleshooting.md#как-сообщить-о-проблеме)).
- **`max backup messages <чат> --since <дата> | --last <n>` descarga más historial del chat a la copia local.**
  Ten en cuenta: sin `--run`, el comando solo muestra una estimación y no envía nada. Con `--run`, recorre el historial hacia atrás en páginas de 30 mensajes con pausas, hasta 40 páginas por ejecución, y continúa desde donde quedó al repetirlo ([usage.md](./archive.md#скачать-историю)).
- **`max doctor` indica la versión web que representa `max`**, avisando si tiene más de 60 días: MAX puede rechazar clientes antiguos ([Problemas](./troubleshooting.md)).
- **`max server start|stop|status|restart` gestiona el servidor en segundo plano como un componente independiente**, como `max session`. `status` muestra si funciona, desde cuándo, su versión y si está conectado a MAX; sugiere `restart` si la versión del servidor es anterior a la de `max`. `max serve --detach` y `--stop` siguen funcionando ([usage.md](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch)).
- **La lectura del historial envía los mismos cinco campos que el cliente web**, y el inicio de sesión pide a MAX 15 chats, como una pestaña de web.max.ru, y después obtiene el resto en una solicitud. Antes, `max` añadía un campo que el cliente web no envía y pedía 40 chats de una vez.
  Por qué: cuanto menos difiere `max` del cliente web, menos motivos tiene MAX para detectarlo.
  Ten en cuenta: la lista de chats es la misma. Se comprobó en un canal con mensajes sin leer: la lectura sigue sin marcar nada como leído.
- **La descripción del dispositivo se obtiene de tu ordenador:** la zona horaria, el idioma del sistema y el sistema operativo son propios de cada instalación, como en el navegador. Antes, todas las instalaciones de `max` se identificaban como el mismo Chrome en Linux con la zona horaria de Madrid.
- **`max serve` envía un evento de servicio como una pestaña oculta:** lista de chats mostrada, 20 segundos después de entrar. Solo número de cuenta y hora, sin títulos/textos. Las órdenes puntuales no lo envían ([Seguridad](./security.md#что-уходит-в-сеть)).
- **`max` rechaza por sí mismo los títulos de carpeta demasiado largos**: como máximo 20 caracteres, el límite que acepta MAX. Antes, la solicitud llegaba a MAX y este la rechazaba.

### Cambios que pueden romper scripts

- **Un rechazo por demasiados inicios no provoca nuevos intentos.** Código `8` y pausas de 1 minuto, 5, 30, una hora, 6 horas, un día. El servidor se detiene ante cualquier rechazo; antes repetía cada minuto indefinidamente. Scripts reciben `8` hasta acabar la pausa: respeta el plazo del error ([Problemas](./troubleshooting.md)).

### Correcciones

- **Un almacén inaccesible no se confunde con falta de sesión.** Si ya hubo entrada pero falta token, por ejemplo en cron, `max` y `max doctor` señalan las claves, no recomiendan otra sesión que añadiría otro dispositivo ([Recetas](./recipes.md)).
- **Fallos guardados sin `--record`.** Incluyen clave MAX (p. ej. `login.token`), códigos de aviso, punto del fallo, entorno y SO; sin textos. Servidor: JSON con hora ([Diagnóstico](./diagnostics.md)).
- **`max chats read --until` solo marca hasta el mensaje indicado**, no hasta ahora ni mensajes más nuevos. Igual para `messages list --mark-read`. Antes podían aparecer leídos mensajes no vistos.

## 0.9.0 — 25.09.2026

### Novedades

- **`max` se comunica con MAX como el cliente web:** la misma dirección, tramas binarias y compresión que web.max.ru, y la misma descripción de dispositivo con versiones actualizadas de la aplicación y del navegador. Antes, `max` enviaba tramas de texto en un formato antiguo.
  Por qué: el formato antiguo era la forma más fácil de distinguir `max` del cliente web. Además, los mensajes de voz y los vídeos circulares necesitan un campo de bytes que el formato anterior no podía transmitir.
  Ten en cuenta: los comandos y su salida no cambian. El envío de mensajes de voz queda para versiones posteriores. Por ahora, MAX envía toda la lista de chats en cada inicio de sesión, en lugar de solo los cambios: funciona, pero añade tráfico.
- **Un `max serve` en segundo plano iniciado por un comando se reinicia automáticamente tras actualizar `max`.**
  Ten en cuenta: un servidor iniciado manualmente sigue funcionando como antes hasta que lo detengas con `max serve --stop` y lo vuelvas a iniciar.

## 0.8.0 — 25.09.2026

### Novedades

- **`max messages transcribe <чат> <id>` reconoce voz localmente.** La grabación no sale. `max models audio list` muestra idiomas; `max models audio download <id>` descarga y verifica. MCP: `max_messages_transcribe` ([Voz](./usage.md#голосовые-в-текст)). Descarga única a petición; texto en la copia, sin necesidad de repetir red o modelo.
- **Una conexión por perfil.** Comandos, `max mcp`, `max watch` comparten `max serve`, reduciendo inicios con un token y cierres por MAX. `max session start` detiene, entra y reinicia ([Servidor](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch)).
- **`max serve --detach` inicia en segundo plano** y responde tras conectar; **`max serve
  --stop` detiene**. Uno iniciado a mano solo se detiene con Ctrl-C/`--stop`; `max
  session end` no lo toca.
- **`allow` limita acciones.** `max work config set allow send,reaction` permite enviar y reaccionar. Doce nombres de `send` a `sessions`. Sin lista todo permitido. Lo prohibido falla con `5` antes de conectar, indicando cómo permitirlo. `max mcp` oculta herramientas prohibidas ([Permisos](./usage.md#что-профилю-можно)).
- **`max messages send … --at <время>` programa.** MAX envía aunque el equipo esté apagado; `2026-09-25T09:00` local, `30m`, `2h`, `1d`. `max messages scheduled <чат>` lista espera; MCP `at` de `max_messages_send`, `max_messages_scheduled`. Cancelación solo en MAX ([Programar](./usage.md#отправить-позже)).
- **`max chats read <чат>`, `max messages list … --mark-read` marcan explícitamente.** MCP: `max mcp --allow-mark-read`. El otro ve la marca; lectura ordinaria no la cambia ([Lectura](./usage.md#чтение)).
- **`max export messages <чат> --format jsonl|md` exporta localmente**, con `--since`, `--output`, sin MAX. Lo ausente se avisa en stderr; `--output` crea archivo privado ([Exportación](./archive.md#выгрузить-в-файл)).
- **`max messages delete <чат> <id…> --allow-dangerous` borra hasta 10**, solo para ti salvo `--for-everyone`; MCP `max mcp --allow-delete`, solo personal. Sin `--allow-dangerous` falla; cada mensaje consume `sendsPerHour` ([Borrar](./usage.md#удаление)).

### Correcciones

- **Actualizar `max` conserva la historia.** Antes un cambio de estructura borraba todo; ahora migra mensajes. Este lanzamiento también cambia la estructura y conserva historia; chats/personas se renuevan al entrar.
- **Tras rechazo del servidor, los comandos esperan 10 minutos sin crear otro.** Antes cada orden reiniciaba intentos rechazados. `max session
  start` elimina la espera.
- **`max watch` ve los envíos propios de `max`.** MAX no los devuelve a la conexión emisora; antes se perdían.
- **Los comandos `max` simultáneos ya no pierden los datos de inicio de sesión en la copia local.** Antes, dos de cada tres comandos simultáneos indicaban «the local record did not take this login» y no guardaban chats, miembros ni el marcador de sincronización. Ahora el segundo espera a que el primero termine de escribir.

### Seguridad

- **Los errores no controlan el terminal.** Tras mensajes, nombres y tablas en 0.7.0, los errores muestran `\x1b` visible. Pueden repetir entrada del usuario o respuestas MAX.

## 0.7.0 — 24.09.2026

### Novedades

- **`max reactions remove <чат> <id>` retira tu reacción.**
- **Grupos y canales bajo `max chats`:** inspeccionar invitación, entrar, salir, crear, añadir/expulsar, administrar, renombrar, ajustes y renovar enlace. Las solicitudes se retiraron en 0.17.0 porque MAX no las tiene. Los cambios son visibles y pasan los controles de envío ([Grupos](./usage.md#группы-и-каналы)).
- **`max update` actualiza `max` con el gestor de paquetes con el que se instaló;** `--check` solo indica si existe una versión más reciente.
  Ten en cuenta: una persona en el terminal ve el aviso de nueva versión una vez al día; los agentes y scripts nunca lo ven. Desactívalo con `updateCheck: false` en `defaults` ([installation.md](./installation.md#обновление-и-удаление)).
- **Tab en zsh/bash/fish/PowerShell:** `source <(max complete zsh)`, órdenes, indicadores, valores, chats/personas locales sin MAX ([Autocompletar](./commands.md#max-complete)).
- **`max mcp` conecta el perfil por MCP** para clientes sin terminal, como Claude Desktop, o mediante MCP en Cursor ([MCP](./mcp.md)). Solo lectura sin `--allow-send`; envío con controles de `max messages send`.
- **`max mcp --allow-send --confirm-send` muestra un formulario antes de cada envío:** a qué chat (título e ID) y qué se enviará.
  Ten en cuenta: sin tu «sí», no se envía nada; un cliente que no pueda mostrar formularios recibe un error ([docs/mcp.md](./mcp.md#права-профиля-управляют-инструментами)).
- **`max messages send … --file <путь>` envía fotos/archivos**, varias fotos en un mensaje.

### Seguridad

- **El texto ajeno no controla el terminal.** Mensajes, nombres, títulos, archivos o reacciones podían borrar líneas y sobrescribir salida de `max`. Ahora controles como `\x1b` se muestran visibles en conversaciones, tablas, errores y Tab. JSON no cambia: ya los escapaba.

## 0.6.0 — 24.09.2026

### Novedades

- **`max commands --json` describe órdenes, argumentos, indicadores y códigos en una respuesta**, cambios MAX con `mutates: true`. Evita pedir `--help` por comando. Funciona sin sesión incluso con ajustes rotos.
- **`max messages send … --reply-to <id>` responde.**
- **`max messages send … --markdown` o `--md` da formato:** `**жирный**`, `_курсив_`, `~~зачёркнутый~~`, `` `код` ``. Sin indicador, literal.
- **`max reactions add <чат> <id> <эмодзи>` sustituye tu reacción.**
- **Reacciones en lectura:** `messages list`, `show`, `context` muestran `👍 3  🔥 1  (you: 🔥)`, JSON `reactions`. Una petición adicional por página, solo lectura. `--offline` no tiene reacciones (`null`) porque no se guardan.
- **Registro y destinatarios.** Cada intento sin texto en `max sends list`. Lista opcional `max recipients add|remove|list|off`; destinatario no autorizado código `7`, perfil `readOnly` código `5`. Alcance: [Seguridad](./security.md).
- **`max session start qr | qr-chrome | sms | token` permite entrar sin copiar token.** `qr` dibuja en terminal o abre navegador si es estrecho. `qr-chrome`, `sms` abren web.max.ru en ventana aparte de Chrome/Chromium/Edge/Brave. Sin método sigue token manual o stdin.

### Cambios que pueden romper scripts

- **El envío tiene un límite por hora: 30 mensajes por defecto (`sendsPerHour`).** Por encima del límite, `max messages send` rechaza la operación con el código `8`. Antes no había límite.
  Ten en cuenta: un script que envíe más debe aumentar `sendsPerHour` en los ajustes.

## 0.5.0 — 24.09.2026

### Novedades

- **`max messages download <чат> <id> [--output <каталог>]` guarda foto, archivos, vídeo/audio** sin sobrescribir.
- **`max config set <настройка> <значение>`, `max config unset <настройка>` editan ajustes**, `--defaults` para todos; nueva sección `defaults` para perfiles sin valor propio.
- **`max chats list --unread` filtra no leídos.**
- **`max messages list <чат> --after <id|время>` lee hacia delante**, después de mensaje/tiempo; próxima página con `--after <id самого нового>`.
- **`max chats show <чат>` y `max contacts show <человек>`** muestran chat con miembros o persona por ID/@username/nombre y chats comunes. Nombres ambiguos enumeran candidatos, no se adivinan.
- Todo lo nuevo aquí solo lee, sin enviar ni marcar.

### Correcciones

- **`--offline` funciona.** Antes, la opción no llegaba a ningún comando: la lectura seguía contactando con MAX, y `max --offline messages send` **enviaba un mensaje**. Ahora la lectura utiliza los datos guardados, mientras que el envío y la descarga se rechazan con `--offline`.
  Ten en cuenta: si ejecutaste `--offline messages send` en 0.4.0 o antes, el mensaje se envió.
- **Los errores del archivo de ajustes se explican con claridad:** qué ajuste es desconocido, cuáles existen y qué valores se aceptan. Antes eran mensajes de la biblioteca de validación.
- **Un fallo de `--record` no derriba la orden.** Aviso stderr, respuesta/código sin cambios; visible incluso con `--quiet`.

### Seguridad

- **Publicación desde GitHub Actions con procedencia npm**, para verificar el repositorio de compilación.

## 0.4.0 — 23.09.2026

### Novedades

- **`max messages show <чат> <id>` muestra uno; `max messages context <чат> <id>` con `--before`, `--after` muestra contexto.** Marcado `◀` y `"anchor": true`. Si falta, «no encontrado», no el vecino.
- **`max skill show` imprime instrucciones incluidas:** `max skill show > ~/.claude/skills/max-cli/SKILL.md`.
- **`max config show` explica perfil/origen**, archivo/existencia, todos los perfiles incluso solo de estado, ajustes y fuente (indicador, variable, archivo, integrado). `MAX_CONFIG_DIR` y similares avisan de entrada de claves distinta.
- **Texto mediante pipe:** `echo "текст" | max messages send <чат>`, sin argumento lee stdin. Evita `ps`/historial y permite saltos de línea.
- **`--timeout <срок>` limita toda la ejecución**, conexión, entrada y solicitud, no una respuesta.
- **`max doctor` revisa dependencias sin MAX:** fuente del token sin revelarlo, número/último inicio, perfiles, estructura de base y entrada de claves. Funciona con todo roto; falta de sesión es dato, no error.

### Cambios que pueden romper scripts

- **La opción `--query` de las listas pasa a llamarse `--search`.** El cambio ya se incluyó en 0.3.0, pero faltaba en sus notas.
  Ten en cuenta: un script con `--query` da error; sustitúyelo por `--search`.

### Correcciones

- **`messages list --before <id>` no requiere lectura previa**, obtiene tiempo del ID.
- **Miembros con nombres, no números.** Antes solo contactos tenían nombre; ahora una petición obtiene y guarda todos, incluidos autores de respuestas/reenvíos.
- **La publicación no se detiene antes de crear el tag.** Ocurrió dos veces; ahora verifica npm sin caché y espera hasta tres minutos.

## 0.3.0 — 22.09.2026

### Novedades

- **Conversaciones como transcripción:** divisores diarios, `время  автор`, texto alineado y ajustado al terminal. `вы` eres tú; sin nombre aparece ID. `↳` responde, `↪` reenvía; MAX entrega originales completos y se guardan.
- **`-v`, `-vv` añaden detalle:** IDs de mensaje/autor/chat y URLs; después todo lo conocido.
- **`--jsonl` da objeto JSON por línea**, para streaming y `jq`.
- **Adjuntos como enlaces:** `📎 photo`, `📎 photo ×3 1 2 3`, `📎 файл.pdf · 24 MB`; JSON `url`, `width`, `height`, `title`. El enlace de foto no requiere sesión: quien lo recibe puede verla.
- **`senderColors: true` da color por autor**, desactivado por defecto.

### Cambios que pueden romper scripts

- **`-v` ahora indica el detalle de la salida; la versión se consulta con `max -V`.** **`--trace`** activa las líneas de solicitudes en stderr; antes se llamaba `--verbose`.
  Ten en cuenta: los scripts que usaban `max -v` para la versión o `--verbose` para las trazas deben pasar a `-V` y `--trace`.
- **`--query` pasa a `--search`**, inicialmente no anotado.
- **La copia local pasa al esquema 4 y se reconstruye en la primera ejecución.**
  Ten en cuenta: en esta versión no se conserva el historial leído; tendrás que leerlo de nuevo.

### Correcciones

- **Nombres ambiguos enumeran candidatos con ID**, JSON `candidates`.
- **El aviso local indica estructura y solución**, antes solo `Error`.
- **Continuación de `messages list` sugiere `--before <id>`**, no el inexistente `--page`.

## 0.2.0 — 22.09.2026

### Novedades

- **`max messages send --silent` envía sin aviso.** Aún no se comprobó el comportamiento real porque exigiría escribir a una persona.
- **Intercambio del token al primer inicio.** MAX devuelve su token; `max` lo guarda en claves en lugar del pegado. Solo una vez.

### Correcciones

- **`max session start` no destruye el token válido.** Antes guardaba antes de validar y una errata lo sustituía; ahora valida y luego guarda.
- **Perfil vinculado al mismo usuario.** Token de otra cuenta se rechaza explicando por qué: evita actuar como otra persona.
- **La sugerencia tras envío incierto usa una orden real**, no `max send`.
- **No se descartan mensajes de la respuesta de entrada** por estructura mal descrita.

## 0.1.0 — 21.09.2026

Primera versión que se puede compartir.

### Novedades

- **Siete órdenes sobre MAX real:** `session start|end`, `account show`, `chats list`, `contacts list`, `messages list`, `messages send`.
- **Perfil primero:** `max personal chats list`. Cuentas independientes con token, estado y copia propios; también `MAX_PROFILE`.
- **Token en el almacén del sistema**, no archivo ni argumento. Aún sin entrada por teléfono: `max session start` obtiene el del cliente oficial.
- **Modo máquina:** `--json` da un valor en stdout, también automáticamente sin terminal. Error stderr, stdout vacío. Decide por código de salida: [Referencia `docs/commands.md`](./commands.md).
- **Diagnóstico sin contenido:** `--verbose` petición por línea; `--record` conserva 30 días; `max runs list|show|path` lee. Por defecto nada registrado.
- **Copia local:** lecturas guardadas; `--offline` sin conexión; `max cache clear` elimina.
- **`~/.config/max-cli/config.json`**, prioridad indicador → variable → archivo → integrado. Erratas son errores explícitos.
- **Node 22+ y Bun 1.3+**, ambos comprobados en CI.
- **Leer no marca leído.** Obtener historia y marcar son operaciones distintas; la segunda nunca se envía, verificado con prueba.
- **Resultado de envío honesto:** sin respuesta `outcome_unknown` (`14`), sin afirmar fallo/éxito. Repite solo con el mismo `--cid` para evitar doble envío.
- **Protocolo MAX no oficial por ingeniería inversa**, separado de Bot API. Puede cambiar sin aviso; se informa con una línea stderr, no falla en silencio.
- **Aún sin** teléfono, adjuntos, reacciones, ediciones, grupos, historias ni llamadas: solo texto. No habrá envíos masivos con la cuenta personal.
