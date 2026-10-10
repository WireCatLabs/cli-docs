---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/tg-cli` (`@leemour/tg-cli` hasta 0.42.0), con una sección por versión, de la más reciente a la más antigua. Se utiliza [versionado semántico](https://semver.org); antes de `1.0.0`, la interfaz de comandos todavía puede cambiar.

## 0.44.1 — 10.10.2026

### Correcciones

- La extracción local de texto PDF y la vista de páginas aceptan documentos de más de 20 páginas; la extracción sigue la cancelación del comando en lugar de un tiempo de espera separado de 30 segundos. Se mantienen los límites de tamaño del archivo y de la imagen.
- La transcripción local acepta grabaciones Ogg Opus completas, mono o estéreo, de más de diez minutos. Las grabaciones largas necesitan más memoria y tiempo de procesamiento.
- Se permiten adjuntos de carpetas de trabajo ocultas normales. Las credenciales conocidas, las carpetas de la CLI y el almacén de mensajes siguen protegidos.
- Las exportaciones Markdown conservan el formato de los mensajes. Los argumentos de escritura MCP conservan el Unicode original, mientras que el texto devuelto sigue mostrando los controles invisibles; los servicios de modelos configurados admiten redirecciones normales.
- La actualización y configuración de MCP en Windows admiten entradas PATH relativas normales y entornos personalizados del procesador de comandos. Esta versión mantiene el esquema existente del almacén de mensajes.
- La guía de búsqueda distingue las solicitudes discovery u offline que consultan solo el archivo local de la búsqueda normal de palabras mediante el servidor: un archivo local vacío no implica que se haya buscado en Telegram.

## 0.44.0 — 10.10.2026

### Novedades

- La búsqueda de mensajes con `--discover` o MCP `discover: true` encuentra coincidencias parciales y respuestas directas válidas en el archivo local sin descargar modelos. La búsqueda estricta sigue siendo predeterminada; los términos ausentes ayudan al agente a comprobar la evidencia.


## 0.43.1 — 10.10.2026

### Cambios que pueden romper scripts

- **El proyecto usa Apache License 2.0.** Consulta las condiciones en `LICENSE`.

## 0.43.0 — 10.10.2026

### Cambios que pueden romper scripts

- **El paquete se llama `@wirecat/tg-cli` y el repositorio es `WireCatLabs/tg-cli`.** Instala con `npm install -g @wirecat/tg-cli`; el comando sigue siendo `tg`. Desinstala primero `@leemour/tg-cli`: ambos paquetes proporcionan `tg`. No habrá nuevas versiones de `@leemour/tg-cli`.
- La transcripción local admite grabaciones Ogg Opus completas, mono o estéreo, de hasta 10 minutos. Divide las más largas. La extracción de texto PDF admite hasta 20 páginas y 30 segundos.
- MCP muestra controles invisibles en resultados de texto y argumentos de escritura, incluida la conversión de formato. Los emojis de banderas de subdivisiones territoriales se conservan; el JSON normal de la CLI mantiene las cadenas originales.

### Corregido

- Tras actualizar, el reinicio del servidor invoca Node directamente con argumentos separados y conserva el entorno elegido, incluidas rutas con espacios en Windows. Omite nombres de perfil inválidos en archivos de bloqueo.

### Seguridad

- La extracción desde carpetas y transferencia de adjuntos guardados rechazan rutas ocultas, carpetas de la CLI y el almacén de mensajes, incluidos enlaces simbólicos. Las descargas MCP tampoco escriben allí.
- DOCX usa el lector limitado de archivos de Office antes de cargar el contenido del documento.


## 0.42.0 — 09.10.2026

### Cambios que pueden afectar a scripts

- **Las respuestas automáticas responden a todas las personas que coinciden con sus reglas, a menos que limite la audiencia; la lista separada `testers` desapareció.** `tg replies audience --reply listed --allow-people <ids>` responde solo a personas seleccionadas;   `--deny-people` y `--deny-chats` dejan algunos fuera. No se envía nada hasta que `permissions.replies.send` sea `allow` y una nueva regla estará desactivada hasta que la active. Un archivo de reglas que todavía tiene `testers` sigue respondiendo exactamente a las mismas personas: se convierten en las personas permitidas (solo aquellas que la audiencia también permitió, si ya era `listed`). Los chats permitidos en dicho archivo se eliminan porque abrirían respuestas a todos los participantes en esos chats; Las listas de denegación permanecen. El archivo se reescribe sin `testers` en su próxima edición de `tg replies`.
- **`tg replies status --json` ya no tiene `testers`**; los recuentos `audience` dicen quién puede ser respondido. En `tg replies test` y `serve`, un remitente fuera de la audiencia se omite con "no en la lista de permitidos" en lugar de "no es una cuenta de prueba".

## 0.41.0 — 09.10.2026

### Cambios que pueden afectar a scripts

- **El almacén de mensajes elimina las copias guardadas para versiones anteriores** (versión del archivo local 28, cli-messaging 0.212.0).   Las notas, notas de contacto, relaciones y entidades escritas antes de la refactorización de notas se copian en sus nuevas tablas una vez, durante la actualización. Después, un tg, max o memo más antiguo rechazal archivo local con "actualizar esta herramienta": actualiza los tres juntos.

## 0.40.1 — 09.10.2026

### Corregido

- **`tg search all` no encontraba nada en un almacén nuevo.** Solo buscaba en las cuentas que ya estaban en el almacén, así que antes del primer guardado no buscaba en ninguna parte; ahora siempre incluye la cuenta de este perfil y consulta el servidor igual que `tg search messages`.
- **`tg search mail` sin correo importado devuelve un resultado vacío** con un aviso en stderr, en lugar de fallar.
- **Se descartan las notas encontradas solo por una coincidencia débil de significado**, así que una palabra rara ya no devuelve todas las notas.

## 0.40.0 — 09.10.2026

### Novedades

- **`tg topics show <chat> <topic>` muestra un tema de foro**: su título, si está cerrado o fijado, los mensajes sin leer y la última actividad.
- **`tg messages forward --topic <id>` reenvía a un tema de foro** del grupo de `--to`. Primero se comprueba el tema, como con `messages send --topic`; el tema 1 es General.
- **`tg attachments show --page 1` devuelve una página de un PDF guardado como PNG.** Los agentes remotos pueden leer

### Cambios que pueden afectar scripts

- **`--answerer` de las estadísticas acepta nombres guardados, alias y @usernames.**  La resolución sigue siendo local, en las cuentas del historial elegido; los nombres ambiguos devuelven candidatos de esas cuentas. Los nombres desconocidos ahora fallan en lugar de producir una identidad inventada con cero respuestas. Usa `person:provider/account/id` para elegir explícitamente un ID opaco no visto. Las filas de respuesta añaden `identityKnown`; un ID sin observaciones tiene `identityKnown: false` y `status: unknown`. Cero respuestas observadas no prueban inactividad ([estadísticas](./rankings.md)).

- **Todas las búsquedas pasan a `tg search`.** Los comandos antiguos desaparecen:

  | Antes | Ahora |
  |---|---|
  | `tg messages search` | `tg search messages` |
  | `tg messages search --source email` | `tg search mail` |
  | `tg conversations search` | `tg search conversations` |
  | `tg topics search <chat> <text>` | `tg search topics <chat> <text>` |
  | `tg bot messages search` | `tg bot search messages` |

  Para los agentes, las herramientas se movieron igual: `search messages`, `search conversations`, `search topics` y la nueva `search all` para empezar.
- **`tg search messages` nunca devuelve correo.** Una búsqueda guardada que indica `in:email` ahora pide usar `tg search mail`.
- **Los permisos con los nombres de las rutas antiguas** (`messages.search`, `conversations.search`, `topics.search`) bloquean `tg search` hasta que `tg config migrate` los renombra, conservando sus niveles.

## 0.39.1 — 08.10.2026

### Corregido

- La biblioteca compartida se fija en 0.205.0, igual que Memo y MAX, para instalación coordinada.

## 0.39.0 — 08.10.2026

### Novedades

- **`tg polls create --close-time 5m`** cierra automáticamente tras el tiempo indicado, de 5 segundos a 10 minutos.
- **`tg polls voters <chat> <message> [--answer <id>]`** muestra quién votó por qué en una encuesta no anónima. Cuando Telegram responde que primero debes votar, o que un canal oculta a sus votantes, el error lo indica.
- **`tg chats link update --expire-time never`** elimina la caducidad de un enlace. También se puede cambiar el enlace propio del grupo; la ayuda ya no dice lo contrario.
- **`tg store jobs list --state <state>`** filtra tareas running, done, failed, cancelled o died.

### Cambios que pueden afectar scripts

- **`tg chats link create` y `update` rechazan combinar `--approval` y `--max-uses`.** Telegram quitaba el límite de usos sin avisar al activar la aprobación; ahora debes elegir uno.
- **Las palabras latinas se buscan por sus raíces inglesas y españolas a la vez.** Antes solo por las españolas, así que las formas inglesas («budgets» → «budget») coincidían peor. Ten en cuenta: tras la actualización, el índice de raíces se reconstruye solo — un almacén pequeño al abrirlo, uno grande poco a poco: `tg serve` lo termina en segundo plano y `tg store migrate` de inmediato. Hasta que esté listo, la búsqueda solo encuentra formas exactas, lo indica en stderr y `query.stemming.applied` es `false` en JSON. El índice de raíces del texto latino ocupa aproximadamente el doble. Un `searchStemmers.latin` que hayas fijado tú se conserva, y `tg store reindex` lo sigue aplicando. Actualiza también `max`: una versión antigua, al abrir el almacén reconstruido, responde a una búsqueda por raíces pidiendo actualizar la herramienta ([archivo](./archive.md#repair-and-index-maintenance)).
- **Las notas sobre una persona (`tg contacts notes`) aparecen en todos los perfiles que la ven.** Antes, solo en el perfil donde se escribieron. Por qué: las notas son tuyas, no de una cuenta; el almacén compartido ahora las guarda aparte de los mensajes, junto con las notas de `memo`. Ten en cuenta: con varios perfiles de Telegram, las notas de una persona de todos ellos se muestran juntas. Los alias (`contacts alias`) siguen aplicándose solo en su propio perfil.

### Corregido

- **`tg polls voters --answer <id>`** identifica la respuesta elegida. Sin `--answer` no indica más votantes si ya se mostraron todos.

## 0.38.0 — 08.10.2026

### Novedades

- **`tg account list`** muestra todos los perfiles del ordenador, su cuenta y nombre. No consulta Telegram.

### Correcciones

- **`tg session start` indica «Already logged in»** si la sesión funciona y no se pidió nada; ofrece `session end` para iniciar de nuevo. Antes parecía un inicio sin código. `--json` añade `alreadyLoggedIn`.
- **`tg session start phone --sms` continúa el inicio** cuando Telegram no puede enviar SMS (`SEND_CODE_UNAVAILABLE`): lo indica y pide el código que ya envió a la aplicación.
- **`tg` y grupos sin subcomando (`tg account`, `tg chats`) vuelven a mostrar ayuda** en el terminal en lugar de `✗ (outputHelp)`. Scripts y `--json` reciben `validation_error` pidiendo un comando.

## 0.37.0 — 08.10.2026

### Novedades

- **El agente lee por nombre los chats de una carpeta mediante MCP**, como `tg chats folders show` (`tg_read`, command: `chats folders show`).
- **`tg chats link update <chat> <link> [--approval | --no-approval] [--expire-time] [--max-uses]` cambia uno de tus enlaces adicionales:** solo cambia lo indicado.
- **Archivos guardados para agentes remotos:** `attachments show` transfiere porciones limitadas con SHA256 del archivo completo. MCP devuelve imágenes completas o recursos binarios con alternativa JSON/base64. No realiza OCR ni indexa; el agente lee y guarda el texto ([adjuntos](./attachments.md)).
- La biblioteca compartida añade cohortes de retención observadas y observaciones de contadores con frescura por campo; lo desconocido queda explícito.

### Cambios que pueden romper scripts

- JSON de rankings y pruebas incluye observaciones de contadores y frescura; las pruebas admiten selecciones de cohortes de retención. Revisa cada campo y tipo de selección; valores desconocidos y archivos incompletos no significan cero.

## 0.36.0 — 08.10.2026

### Novedades

- **`tg polls create --quiz --correct <n> [--solution <text>]`** crea un cuestionario:
  una respuesta correcta por posición desde1; el voto es definitivo.
- **Informes de administración guardados** encuentran preguntas sin respuesta observada, tiempo de
  respuesta de personas elegidas, ayuda tras entradas conocidas y publicaciones vistas con poca conversación.
  Cobertura/pruebas muestran los límites; el historial guarda parámetros/selecciones.
- **`tg chats folders show <folder>`** muestra una carpeta y nombres de chats fijados/excluidos.
  Primero usa los nombres del archivo; consulta Telegram solo para los ausentes.
- **`tg metadata refresh --only-missing`** lee descripciones solo donde aún faltan;
  sin `--chat`, todos los grupos/canales guardados hasta `--limit`.
- **`tg store jobs retry <job>`** repite una tarea fallida/interrumpida con las mismas opciones;
  `--failed` cubre cada chat cuya última tarea falló. **`tg store jobs clear`** borra tareas terminadas y registros.
- **`tg session start phone --sms`** pide el código por SMS; Telegram decide y la CLI
  indica la entrega real.
- **`tg topics delete <chat> <topic>`** borra el tema y todos sus mensajes para todos.
  Pregunta por defecto; `--allow-dangerous` omite la pregunta.
- **Texto local de adjuntos:** ODT, ODS, XLSX, PPTX, EPUB, UTF-16 con BOM y codificaciones antiguas
  detectadas con confianza. Sin modelo; no calcula fórmulas, las imágenes quedan para el agente ([búsqueda](./search.md)).
- **Reglas de carpetas en `tg chats folders create|update`:** `--include` contacts, non-contacts,
  groups, channels, bots; `--skip` muted, read, archived; `--exclude-chat`, `--pin`, `--emoji`.
  `folders list` muestra las reglas.

### Cambios — pueden romper scripts

- `tg chats folders join` explica enlaces inválidos/caducados con código6;
  `folders order` devuelve solo id y nombre.
- `tg chats folders create|update` devuelven lo realmente guardado: Telegram descarta
  `--emoji` si no es un icono de carpeta suyo; antes la CLI decía que se había guardado.


## 0.35.0 — 08.10.2026

### Novedades

- **`tg chats requests list --search <name>` o `--link <link>` reduce las solicitudes** por nombre o a las
  que llegaron mediante un enlace; Telegram no permite ambas condiciones a la vez.
- **`tg polls show` indica si una encuesta es un cuestionario (`quiz`), si se puede cambiar el voto (`revote`) y si la
  creaste tú (`creator`)**; solo su creador puede cerrarla.
- **`tg polls vote` y `tg polls close` rechazan antes de enviar lo que Telegram rechazaría**: una encuesta cerrada, dos
  respuestas en una encuesta de una sola respuesta, cambiar o retirar un voto definitivo, `--retract` sin un voto previo y
  cerrar la encuesta de otra persona. Los rechazos de Telegram ahora indican qué hacer en lugar de «Telegram refused: X», y
  un tiempo de espera agotado al leer la encuesta ya no indica que el voto podría haberse enviado.
- **`tg chats requests accept|decline <chat> --all [--link <link>]` responde a todas las solicitudes pendientes a la vez, y
  `tg chats link list` / `tg chats link revoke` muestran y revocan tus enlaces de invitación.** Una aceptación con `--all` se contabiliza
  frente al límite por hora antes de permitir la entrada a nadie.
- **Las clasificaciones conservan los enlaces de respuesta de Telegram y las discusiones vinculadas de canales**, por lo que las medidas de conversación usan esos
  enlaces cuando están disponibles; los enlaces ambiguos de temas de foro siguen siendo desconocidos.
- [La guía de clasificaciones](./rankings.md) explica las medidas, puntuaciones, cobertura, selecciones guardadas y evidencias.
  Volver a ejecutar una selección guardada ahora conserva los límites de fecha exclusivos.
- **`tg store fetch --all` descarga todos los chats**: los últimos 90 días de cada uno, primero los activos más recientemente;
  `--background` lo ejecuta como un trabajo. La búsqueda lo necesita: [prepara tu archivo](./search.md#prepare-your-archive-first).
- **Tus propios nombres y notas sobre personas: `tg contacts alias` y `tg contacts notes`**, guardados solo en este
  ordenador; `contacts show --with-notes` y `contacts list --search-notes` los muestran y permiten buscarlos
  ([personas](./people.md#your-own-names-and-notes-contacts-alias-contacts-notes)).
- **Etiquetas automáticas para grupos y canales: `tg metadata refresh` y `tg tags auto`**, a partir del título y
  la descripción, sin modificar tus propias etiquetas ([búsqueda](./search.md#tags)).

### Cambios que pueden afectar a scripts

- **Cada búsqueda indica qué datos consultó.** Una línea del terminal muestra los mensajes y chats consultados, los chats nunca
  descargados o desactualizados y el comando para solucionarlo; `coverage.next` en JSON indica al agente qué ejecutar.

- **La búsqueda por palabras ahora consulta Telegram y el archivo local de forma predeterminada (`--backend both`).**
  Antes buscaba solo en el archivo salvo que se eligiera otro backend. Ahora la búsqueda puede conectarse a Telegram;
  usa `--backend archive` para buscar solo localmente. Los recuentos con `stats`, la búsqueda por temas y las consultas que el servidor
  no puede responder siguen leyendo solo el archivo.

- **`tg chats join` para un grupo cuyos administradores aprueban las entradas responde `requested: true` y termina con `0`**, en lugar
  del código `11`: la solicitud ya se enviaba antes. Un script que interpretaba la salida 11 como «solicitud enviada» ahora lee
  `requested`.

## 0.34.0 — 07.10.2026

### Novedades

- **`tg stats messages top` y `tg stats contacts top` clasifican los mensajes almacenados y sus autores**, y
  `evidence` bajo cada comando muestra los mensajes que sustentan un puesto en la clasificación. Solo leen el almacenamiento local y
  no consultan Telegram; `searches create --selection` guarda esa clasificación como una búsqueda.
- **Cada perfil tiene ahora un ritmo de solicitudes compartido por todos los procesos `tg` que lo usan.** Dos comandos simultáneos,
  trabajos `store fetch` en segundo plano, `mcp` y `serve` antes regulaban su ritmo por separado, por lo que ejecutar varios
  multiplicaba la frecuencia de solicitudes; ahora comparten un cupo: una ráfaga de 20 y después una solicitud por segundo. Una
  espera solicitada por Telegram bloquea todo el perfil, y una solicitud que tendría que esperar más de 5 minutos falla de
  inmediato con el código de salida `8`. Los trabajos masivos ejecutados en paralelo tardan más. `requestsPerMinute` o
  `TG_REQUESTS_PER_MINUTE` cambia el ritmo; [limits.md](./limits.md) explica todas las reglas.
- **`tg messages send --html` y `tg messages edit --html` leen el HTML de Telegram** — `<b>`, `<i>`, `<u>`, `<s>`,
  `<a href>`, `<code>`, `<pre>`, `<blockquote>`, `<tg-spoiler>` — conservando los saltos de línea tal como los escribiste
  ([uso](./usage.md#sending)).
- **`tg messages send --file … --filename <name>`** envíal archivo con el nombre que ven los demás.
- **`tg messages list <chat> --topic <id>` lee un tema del foro**, hacia atrás desde su mensaje más reciente o `--before-id`.
- **`tg chats folders order` coloca las carpetas en el orden que indiques**, y **`tg chats folders join <link>`** añade una
  carpeta compartida mediante un enlace `t.me/addlist/` y entra en todos sus chats.
- **`tg chats link create <chat>` crea otro enlace de invitación: `--approval` exige solicitar la entrada primero,
  `--expire-time` y `--max-uses` lo limitan; `tg chats update --join-approval on|off` exige que todos soliciten
  la entrada primero.** Ambas opciones funcionan tanto en grupos privados como públicos.
- **`tg chats requests list <chat>` muestra quién pidió entrar en un grupo que exige aprobación, y `tg chats requests
  accept|decline <chat> <person>` responde a una solicitud.** Solo los administradores ven las solicitudes; una aceptada cuenta para el
  límite por hora como un miembro añadido.

- **`tg messages search --backend both` consulta Telegram y el archivo.** Los resultados de Telegram se guardan
  y se comprueban con la misma consulta, por lo que `exact:`, `-word` y la clasificación conservan su significado; cada mensaje indica
  si procede del archivo, de Telegram o de ambos. `--backend server` muestra solo los resultados de Telegram;
  `--server-time` limita la espera (5 s). La opción predeterminada sigue siendo el archivo ([búsqueda](./search.md)).

- **`tg chats mark-read <chat> --topic <id>` marca un tema del foro como leído**, hasta `--until` o su mensaje más
  reciente, y deja el resto del chat como estaba.

- **`tg topics edit <chat> <topic>` renombra (`--title`), cierra o reabre (`--closed on|off`) y fija o desfija
  (`--pinned on|off`) un tema del foro, y oculta o muestra el tema General (`--hidden on|off`); `tg topics order
  <chat> <topic...>` ordena los temas fijados.** Repetir cualquiera de los dos comandos es seguro.

- **`tg messages send --spoiler` difumina una foto o un vídeo hasta que se pulse, y `--caption-above` coloca el texto
  encima.** Se rechaza un spoiler en un documento o mensaje de voz.

- **`tg chats send-as <chat>` enumera las identidades con las que puedes publicar en un grupo, y `--send-as <id>` publica como una de
  ellas** en `tg messages send` (incluidos archivos), `tg messages forward` y `tg polls create`. La lista siempre
  te incluye y marca la elección guardada del grupo; leerla no cambia nada. Se rechaza un identificador que no esté en la lista.

### Cambios que pueden afectar a scripts

- **Se rechaza un envío, reenvío o encuesta sin `--send-as` a un grupo que publica como un canal de forma predeterminada** (salida
  `2`), en lugar de enviarlo como ese canal. El error indica `--send-as <your id>` para publicar como tú y
  `--send-as <channel id>` para publicar como el canal.

## 0.33.0 — 07.10.2026

- **`tg contacts profile` y `tg contacts check` estiman la antigüedad de cuentas creadas hasta agosto de 2026.** La
  tabla que estima el mes de registro a partir del identificador de cuenta terminaba en noviembre de 2025, por lo que las cuentas más recientes no tenían
  estimación. Los identificadores de finales de 2025 ahora dan fechas hasta cuatro meses posteriores, más próximas a la creación real.
  Las estimaciones de 2026 tienen un margen de error de unos tres meses; `source: "estimate"` sigue marcando cada estimación.
- **OCR de adjuntos mediante la pasarela compartida.** Los agentes suelen leer las imágenes y documentos escaneados por su cuenta y
  guardar el texto mediante `attachments text set`. El procesamiento masivo explícito usa `attachments extract --ocr`,
  `models.ocr` y `--concurrency` con límites; el texto completo entra en el índice `content:` existente.
  La caché por hash y modelo evita llamadas repetidas, y los fallos conservan el texto del agente y el texto indexado anterior.

## 0.32.0 — 07.10.2026

### Novedades

- **`tg messages comments <channel> <post>` lee los comentarios de una publicación del canal, y `tg messages send
  --comment-to <post>` escribe uno.** Los comentarios están en el grupo de discusión del canal; una publicación sin él da la salida `6`.
- **`tg contacts profile` enumera nombres y nombres de usuario anteriores** en `aliases`, primero los más antiguos, con un enlace `t.me`
  para un nombre de usuario anterior. El almacenamiento local ahora conserva un nombre o nombre de usuario cuando cambia. Consulta
  [Personas](./people.md).

## 0.31.0 — 07.10.2026

### Novedades

- Extracción de archivos mediante MCP, directorios explícitos y `messages download --extract`; los archivos modificados
  se comprueban por el hash del contenido. La preparación local opcional con límites sigue a las descargas de historial y está desactivada
  de forma predeterminada. `store gaps plan` y `store gaps repair` inspeccionan las lagunas internas registradas y las
  reparan explícitamente con límites y trabajos reanudables; los extremos desconocidos y las páginas ambiguas quedan pendientes.

- **`tg stats chats official <chat>`**: estadísticas de Telegram para un supergrupo o canal que administras, tal como
  las muestran sus aplicaciones: totales comparados con el periodo anterior, autores destacados, administradores y personas que invitan (supergrupos), publicaciones
  recientes y proporción de notificaciones (canales), y cada gráfico como series JSON. Solo lectura. Funciona donde Telegram te muestra
  estadísticas; en otros casos falla con un error de permiso o validación. Consulta [Grupos que administras](./groups.md).
- cli-messaging 0.162.0 también incorpora `store gaps repair`, las opciones de preparación de `store fetch`,
  `messages download --extract` y `attachments extract --from-dir` / `--cursor`.

- **La configuración, los permisos y los perfiles tienen guías separadas.** La configuración empieza con las ubicaciones de archivos y las tareas habituales; la referencia completa de ajustes sigue disponible.

### Cambios que pueden afectar a scripts

- La configuración se divide en una guía breve y una referencia completa de claves, tipos, valores predeterminados, ámbitos y variables de entorno.
  El contrato público de la CLI describe la ejecución sin interacción, los esquemas, límites, vistas previas y reglas de reintento.
- Validación en CI de los metadatos portables de la skill, la versión instalada, las rutas de comandos y la cobertura de claves de configuración.
  El inicio de sesión nativo y las preguntas opcionales de configuración respetan la política compartida de ausencia de entrada interactiva.

- **La primera resolución de ajustes crea config.json.** Se conservan los archivos existentes; no se guardan las sustituciones del entorno ni de las opciones. config show ahora puede crear el archivo, y los valores habituales indican los valores predeterminados del archivo como su origen.
- **Las búsquedas de palabras y frases incluyen formas de palabras.** Las consultas en scripts pueden devolver más mensajes. Usa exact: o --exact para el comportamiento anterior de coincidencia exacta; text: explícito sigue admitiendo formas de palabras. Los ajustes de idioma del archivo afectan a las coincidencias.

### Correcciones

- La preparación de búsqueda respeta readonly o la denegación de `conversations.links` antes de descargar o poner
  la preparación en cola, incluida la reparación de lagunas. `--no-catch-up` explícito sigue permitiendo las lecturas de historial autorizadas.

- El contexto de una persona encuentra diálogos privados sin miembros registrados cuando el identificador del diálogo es el de la
  persona, recuperando los mensajes directos y el último mensaje en cada dirección en los almacenamientos de Telegram existentes.
- Las operaciones de escritura interrumpidas conservan su resultado desconocido, el identificador de operación y la información de reintento; comprueba
  el resultado antes de reintentar una escritura de la Bot API cuyo tiempo de espera se haya agotado.

## 0.30.0 — 07.10.2026

### Cambios que pueden afectar a scripts

- **`tg mcp` ofrece al agente tres herramientas en lugar de una por comando: `tg_tools_search`, `tg_read` y
  `tg_write`.** El agente encuentra un comando por palabras y lo ejecuta como
  `{ "command": "messages list", "arguments": { … } }`, con los mismos argumentos y la misma respuesta que
  su antigua herramienta. `tg bot mcp` funciona igual: `tg_bot_tools_search`, `tg_bot_read`, `tg_bot_write`.
  Motivo: el agente leía unas 80 descripciones de herramientas antes de su primera pregunta.
  Qué debes revisar: los nombres antiguos (`tg_messages_send`, `tg_status` y los demás) ya no funcionan, ni
  las reglas de cliente que los nombran; permite `tg_read` y, si quieres, `tg_write` en tu cliente
  ([MCP](./mcp.md)).

- **Las escrituras mediante MCP no muestran un formulario de confirmación: deciden solo los permisos del perfil.** El nivel
  `ask` actúa como `allow` mediante MCP, tanto por stdin/stdout como por `--http`.
  Motivo: los formularios fallaban en muchos clientes y entorpecían el trabajo.
  Qué debes revisar: con los permisos predeterminados, un agente ahora puede borrar tus propios mensajes; establece
  `tg config set permissions.messages.delete readonly` para impedirlo. Las acciones que las reglas de un grupo quieren
  confirmar quedan a tu cargo. `--confirm-send`, `--allow-dangerous` y `--http-confirmation` (de
  0.30.0) se aceptan con una advertencia y no cambian nada; `tg mcp config` ya no las escribe.

- **Las estadísticas usan `stats messages show`, `stats chats show` y `stats tasks show`.**
  Se eliminan las rutas antiguas `messages stats`, `chats stats` y `tasks stats`. Actualiza los comandos
  y los permisos exactos a `stats.messages.show`, `stats.chats.show`, `stats.tasks.show`.
  MCP: usa `tg_read` con la misma ruta de comando.
- **Los errores de análisis devuelven la salida 2 con un validation_error estructurado.** Los scripts que esperan
  texto libre o la salida 1 deben actualizar su gestión de errores.

### Novedades

- **`tg setup` es más fácil de seguir.** Cada paso es un encabezado, `[1/5] This computer`, y lo sucedido
  aparece debajo con sangría; las preguntas y el código QR están bajo su paso, con una línea en blanco alrededor del código.
  El resumen final alinea sus etiquetas y coloca arriba el comando que debes probar primero. La salida `--json` y sus claves
  no cambian; `--quiet` sigue ocultando los pasos.

- **Una lista de lo que requiere tu atención.** Desde 0.29.0, `review` y `serve` guardan una tarea en el almacenamiento local para una
  pregunta sin respuesta y un mensaje que te menciona por tu nombre, y la cierran cuando respondes; ahora
  puedes verlas. `tg tasks list` muestra cada una con el mensaje al que apunta; `tg tasks add <message> --type
  promise` añade lo que las reglas no detectan; `tg tasks close <task> --as done|dismissed` cierra una definitivamente;
  `tg stats tasks show` las cuenta por chat. Estos comandos no envían nada. MCP: usa `tg_read` o `tg_write` con la misma ruta de comando.

- **Las reglas de respuesta se pueden editar desde la CLI y usan plantillas Liquid con bloques ai opcionales.**
  `replies add|edit|on|off` cambia las reglas y `replies audience` cambia las listas de permitidos y prohibidos del perfil.
  `models.replies` selecciona el proveedor; `replies consents` concede consentimiento por perfil y endpoint con
  exclusiones por identificadores nativos de chats. `replies test` habitual muestra las instrucciones y la alternativa sin llamadas;
  `--ai` envía explícitamente datos almacenados. Las plantillas antiguas conservan su alternativa literal con advertencias.
  El envío sigue limitado a los probadores y replies.send; consulta [archivo](./archive.md#reply-rules).

- **Las escrituras MCP pueden ejecutarse desde clientes web sin formularios del servidor.** Los niveles de permisos del perfil
  se aplican por igual a HTTP y stdio; `ask` y `allow` permiten la escritura MCP solicitada. Repite
  `--permission key=level` para sobrescribir permisos de este proceso del servidor sin editar la configuración.
  La aprobación de la aplicación es independiente y el servidor no puede verificarla. [Configuración en el navegador](./remote.md).

- **Los gráficos se pueden guardar como PNG.** `tg stats charts <chat> --output activity.png` guarda un gráfico de tema oscuro
  en un archivo nuevo; SVG sigue disponible. En MCP, `tg_read` con `command: "stats charts"` y `format: "png"`
  devuelve una imagen y JSON sin conectarse a Telegram ni escribir un archivo.
- **El prompt MCP open-tasks enumera las tareas pendientes.** Llama a review para actualizarlas
  y después las enumera con un filtro `chat` opcional; solo cierra tareas tras la aprobación y no envía nada.
- **La configuración en el navegador cubre Windows, macOS y Linux.** La guía distingue los comandos de PowerShell y
  del terminal, los permisos temporales de envío, el inicio de sesión web de Codex, dos servidores simultáneos
  y cómo detener túneles individuales. [Configuración en el navegador](./remote.md).

### Correcciones

- **Las fechas de registro estimadas son más precisas para las cuentas creadas en 2022–2025.** Cuando Telegram no da el
  mes, `contacts profile` lo estima a partir del identificador; ahora la estimación se basa en 212 fechas de registro reales. Las cuentas
  de 2022 ya no parecen unos nueve meses más recientes de lo que son: el error típico de las estimaciones es de uno a dos meses.
  Los identificadores hasta noviembre de 2025 ahora reciben una estimación; los más nuevos siguen sin ella.

- **`tg serve` y `tg watch` terminan correctamente al detenerlos con SIGTERM o Ctrl-C.** Antes salían con 1 y
  `database is not open`, y se perdían las actualizaciones y contactos que seguían llegando: la biblioteca de Telegram
  cerrabal archivo de inicio de sesión al recibir la señal, antes de que el comando terminara de usarlo. Ahora el comando
  lo cierra una sola vez después de guardar lo recibido.

- `chats show` da el recuento real de miembros de un supergrupo, que la lista de chats de Telegram mostraba como ausente o
  desactualizado, y la tarjeta o el enlace de invitación de un grupo da el recuento de un grupo básico en lugar de 0. La lista de miembros
  también incluye ahora el recuento del grupo, por lo que `chats members fetch` podrá determinar quién salió de un supergrupo cuando
  tg pase a la siguiente biblioteca compartida.

## 0.29.0 — 06.10.2026

### Novedades

- **Los mensajes largos se buscan por significado en su totalidad.** Un mensaje de más de unos 1200 caracteres se divide
  en fragmentos solapados antes de generar sus vectores, por lo que `messages search` por significado lee todo el mensaje, no solo su
  comienzo. Los chats construidos antes se consideran desactualizados, y `conversations build` o `search --refresh` los reconstruye
  (cli-messaging 0.153.0; el almacenamiento pasa a la versión 21, en la que las versiones anteriores aún pueden escribir).

- **El perfil de una persona.** `tg contacts profile <person>` muestra lo que Telegram informa sobre alguien: cada
  nombre de usuario, biografía, cumpleaños, las marcas de Telegram (bot, verificado, premium, estafa, falso, restringido, eliminado),
  su última conexión (`recently`, `week` y `month` ya no se muestran como ocultos), si sois
  contactos mutuos, cuándo se creó la cuenta (el mes de Telegram o una estimación por identificador, siempre
  etiquetada), si tiene una foto propia y, para cada chat que compartís, cuántos de sus
  mensajes están almacenados, el primero y el último. El teléfono muestra sus cuatro últimas cifras salvo que se indique `--show-phone`.
  No consulta Telegram más que `contacts show`. MCP: `tg_contacts_profile`.
- **Registra la pertenencia a grupos a lo largo del tiempo.** `tg chats members fetch <chat>` guarda perfiles, cambios de miembros
  y un recuento diario; `--budget` limita las páginas y nadie se registra como ausente tras una lectura parcial.
  `--track` inicia descargas diarias mientras se ejecuta `tg serve`. `chats tracking list|show|add|remove` gestiona los
  grupos seguidos; detener el seguimiento conserva el historial registrado. `chats members history --since-time` lee
  entradas, salidas y cambios de perfil registrados sin contactar con Telegram. La primera instantánea registra
  una base inicial, no demuestra que todas las personas entraran ese día; los días omitidos no se reconstruyen.
  `chats members list --offline` lee la última lista completa guardada. Usa cli-messaging 0.152.0.
- `tg contacts context <person> --chat <chat>` (repítelo para más chats) devuelve sus mensajes más recientes en cada chat,
  solo con la hora y el texto, para que un agente los resuma; `-v` añade identificadores y enlaces, `--limit` se aplica por chat, y `--refresh`
  consulta primero Telegram con una búsqueda por remitente en cada chat.
- **¿Es esta cuenta un bot?** `tg contacts check <person>` puntúa a una persona a partir de las marcas de Telegram, su
  perfil y foto más antigua, lo que escribió y guarda el almacenamiento, y las listas públicas de spam Combot CAS y
  lols.bot, a las que se envía su identificador; `--no-registries` omite las listas. `tg chats members audit --deep <n>` ejecuta
  la misma comprobación para los primeros n miembros, uno por segundo. Cada motivo indica su origen; es una pista, nunca un
  veredicto.

### Correcciones

- **La ayuda explica qué leen las comprobaciones de miembros y dónde se conectan.** `--no-registries` omite las listas públicas de
  bloqueos, pero sigue solicitando a Telegram el perfil y las fotos de la persona; `--offline` es el modo solo
  local. Las comprobaciones detalladas inspeccionan como máximo 1,000 mensajes almacenados por persona y hacen solicitudes individuales para
  los miembros seleccionados. `contacts context --chat --refresh` se conecta explícitamente antes de leer el almacenamiento.
- **`contacts profile` ya no estima la fecha de registro de las cuentas más recientes.** La tabla de identificadores termina en
  diciembre de 2024 y no permite distinguir un identificador más nuevo de 2025 de uno de 2026; estos identificadores ahora no reciben estimación, en lugar
  de una fecha que podría ser años anterior a la real.
- **`tg mcp --http`: Claude y ChatGPT pueden completar el inicio de sesión.** La página de acceso hacía que el navegador enviara el formulario
  como si no tuviera origen, y `tg` lo rechazaba con «Origin not allowed». Ahora el inicio de sesión funciona (cli-messaging 0.152.0).
## 0.28.0 — 06.10.2026

### Novedades

- **Buscar el texto dentro de los archivos.** `attachments extract` indexa el texto plano conservado y las capas de texto de Word y PDF para las consultas `content:`. Word y PDF necesitan los paquetes opcionales `mammoth`, `unpdf` y `@napi-rs/canvas`; un agente lee los escaneos y las fotos y guarda su texto con `attachments text set`. `--download --output-dir` descarga expresamente los archivos que faltan.
- **Actualizar antes de buscar y seguir las respuestas.** `--sync-first` descarga dentro de unos límites predeterminados de cinco chats, 500 mensajes y 30 segundos; si la actualización queda incompleta, se conservan los resultados locales y se informa de que la cobertura está desactualizada. `--thread` sigue un grafo acotado de respuestas guardadas con el origen de cada vínculo y, si no existe, recurre al contexto temporal.
- **Filtrar conversaciones y elegir el alcance de cuentas.** `--filter` usa Lucene estricto y se aplica antes de ordenar; un mismo mensaje debe cumplir todo el filtro. `--source` amplía el alcance de forma explícita. MCP ofrece ahora lotes para que el agente vincule conversaciones, la escritura de vínculos, la reconstrucción y el prompt `link-conversations`.
- **Configurar por separado, por perfil, los vectores semánticos y el análisis.** Los vectores locales y el agente del propietario siguen siendo los valores predeterminados. Los proveedores remotos reciben texto solo si los eliges; `build --analyze --chat` pide y recuerda el consentimiento por cuenta, chat y proveedor hasta que se revoca. Un ajuste de vectores semánticos remotos también envía el texto de las consultas de búsqueda de MCP.

- **`tg` se conecta a través de un proxy: SOCKS5, HTTP `CONNECT` o MTProxy.** Se configura por perfil con `tg config set proxy <url>` (o `tg config set proxy -` para pegar uno con contraseña o secreto de MTProxy, que se guarda en el llavero del sistema y nunca en el archivo de configuración) o para una sola ejecución con `TG_PROXY`. Los comandos de la Bot API usan el mismo proxy SOCKS5 o HTTP; con un MTProxy se conectan directamente, y `tg doctor` lo indica. Un proxy que rechaza la conexión o no responde falla en el acto con `configuration_error` (código 3), así que nunca parece que Telegram esté caído.
- **`tg doctor` indica qué ha comprobado realmente.** El inicio de sesión aparece como `not checked` hasta que añades `--online`, y cada archivo o carpeta privados que otros usuarios pueden leer se nombra con el `chmod` que lo corrige; `doctor` nunca cambia los permisos por sí mismo. `tg doctor --online` también compara el reloj de este equipo con el de Telegram (aviso a partir de 10 segundos) e indica si la cuenta está activa, congelada (con sus fechas y el enlace de apelación), bloqueada, eliminada o con la sesión cerrada. `tg doctor` y `tg server status` muestran como `flood` las esperas que Telegram pidió respetar a este perfil y cualquier bloqueo de sus escrituras.
- **`tg flood clear`** olvida esas esperas y levanta el bloqueo de escrituras, cuando Telegram ya no limita la cuenta. Nunca se conecta. Los agentes no tienen herramienta MCP para ello, a propósito.
- **Etiquetas: tus propias marcas en un chat, una persona o un mensaje**, guardadas en el almacén local y nunca enviadas. `tg tags add <tag…> --chat <chat> | --contact <person> | --message <message>`, `tags remove` con el mismo destino y `tags list`. `tag:<tag>` en una búsqueda encuentra lo etiquetado. MCP: `tags_list`, `tags_add`, `tags_remove`.
- **Búsquedas guardadas e historial de búsquedas.** `tg searches create <name> [query]` guarda una búsqueda sin ejecutarla; `tg messages search --saved <name>` y `tg messages stats --saved <name>` la ejecutan: las palabras adicionales se añaden con AND, y las opciones que escribas sustituyen a las guardadas. `searches list`, `show`, `history`, `delete` y `clear` las gestionan. Cada búsqueda y recuento correctos se guardan en el historial: su consulta y opciones, nunca un mensaje ni un resultado, los 1000 más recientes. `--no-record` deja una ejecución fuera; en MCP, `tg mcp --no-record` o `record` con valor `false`. Las búsquedas guardadas y el historial se comparten con max-cli, que usa el mismo almacén.
- **`tg contacts context <person>`**: lo que el almacén guarda sobre una persona (chats compartidos, el último mensaje en cada sentido, sus mensajes recientes y dónde la mencionaron otros) en todos los mensajeros vinculados a ella. Nunca se conecta, y `permissions.messages: deny` lo bloquea como otras lecturas de mensajes. `tg contacts link <person>
  max:<person>` registra que una cuenta de Telegram y una de MAX son la misma persona; `contacts unlink` lo deshace.
- **Las reglas de respuesta pueden contestar a cuentas de prueba.** `tg serve` responde con las reglas de `config/<profile>.replies.json` solo a las cuentas de su lista `testers`, y solo cuando `permissions.replies.send` es `allow`: por defecto es `deny`, y una lista vacía no responde a nadie. `tg replies test` muestra qué habrían respondido las reglas a los mensajes guardados y no envía nada; `replies pause` detiene todas las reglas a la vez, también en un `serve` en marcha; `replies
  resume` lo deshace; `replies status` indica si las reglas pueden enviar y a quién.
- **`tg store repair [--dry-run]`** adapta cada tabla del almacén a la forma de esta versión, sin eliminar nada: una tabla con una forma incorrecta se conserva como copia junto a la nueva, y `tg store copies delete <name>` elimina una copia cuando la hayas revisado. Repara un almacén en el que leer un mensaje fallaba en `messages.mentions`.
- El almacén incorpora tablas para etiquetas, búsquedas guardadas, historial de miembros y raíces de palabras la primera vez que lo abre esta versión; las versiones anteriores de `tg` siguen abriendo el archivo. `tg store migrate` y `tg store reindex` también construyen el índice de raíces (en un almacén grande, ejecuta `tg store migrate` una vez), y `tg config set searchStemmers.cyrillic` (`russian` o `none`) y `searchStemmers.latin` (`spanish`, `english` o `none`) eligen los lematizadores de todo el almacén. Las búsquedas todavía no usan las raíces.
- **`chats members audit` evalúa con todo lo que incluye la lista de miembros de Telegram.** Cada miembro indica ahora cuándo se unió, quién lo invitó y si la cuenta es un bot, está eliminada, marcada como estafa o falsa, o no tiene foto; así se detectan oleadas de entradas, invitaciones masivas y cuentas marcadas, sin peticiones adicionales por persona.
- **`chats stats` cuenta los comentarios de las publicaciones de un canal**, junto a las visualizaciones y los reenvíos.
- **Si la subida de un archivo se interrumpe, se reintenta hasta tres veces antes de enviar nada.** Si sigue fallando, el error indica que no se envió nada, en lugar del código `14` «puede haberse enviado». El mensaje sigue enviándose una sola vez, con su identificador de envío.
- **La búsqueda tiene tres guías.** [Búsqueda de mensajes](./search.md) cubre la búsqueda diaria por palabras, personas, fechas, archivos, enlaces y etiquetas; [búsqueda por tema](./topic-search.md) explica las conversaciones, los vectores, la actualización y lo que envía un modelo remoto; [lenguaje de consulta](./query-language.md) es la referencia.
- `tg mcp doctor` muestra las últimas líneas de la salida de errores del servidor cuando no se inicia, con tu carpeta personal, los números largos y todo lo que parezca un token ocultos.

### Cambios que pueden afectar a scripts

- **Los resultados semánticos del modelo local e5-small requieren una similitud de coseno superior a 0,80 antes de combinarse con las palabras.** Las coincidencias exactas de palabras siguen siendo válidas. Los resultados pueden ser menos, y un resultado combinado puede pasar a ser solo por palabras.
- **El archivo compartido incorpora tablas para el texto de los adjuntos y el consentimiento de análisis.** Al abrirlo se migra el esquema local conservando los mensajes existentes; haz una copia de seguridad de un archivo grande antes de actualizar.

- **Se recuerda una espera que pidió Telegram.** Tras un `FLOOD_WAIT` (código 8, `rate_limited`, con `retryAfterMs`), la misma llamada (y, si indicaba un chat, la misma llamada en ese chat) falla en el acto con código 8 y `details.remembered: true` hasta que pasa la espera, sin consultar Telegram. Un script que reintentaba de inmediato tras el código 8 ahora vuelve a recibir el código 8, antes. `tg flood clear` olvida las esperas.
- **Se bloquean las escrituras de una cuenta congelada o limitada por spam.** Cuando Telegram rechaza una escritura porque la cuenta está congelada o limitada por spam (`PEER_FLOOD`), toda escritura de tipo envío falla con código 5 (`permission_error`) e indica hasta cuándo; leer, reaccionar y marcar como leído siguen funcionando. Un límite por spam dura una hora y cada nuevo rechazo lo renueva; una cuenta congelada, hasta la fecha final de Telegram o un día. `tg doctor --online` aplica el bloqueo por congelación y lo levanta cuando la cuenta vuelve a estar activa; nunca levanta un bloqueo por spam: eso lo hace `tg flood clear`, cuando sepas que el límite ha desaparecido.
- **`PEER_FLOOD` termina con código 5 (`permission_error`), no 11**, y remite a @SpamBot: reintentar lo empeora. El rechazo de una cuenta congelada también es un `permission_error` que remite a `tg doctor --online`, no un límite que haya que esperar. Una cuenta bloqueada o eliminada ya no te pide volver a iniciar sesión.
- **Un comando de una sola ejecución espera un FLOOD_WAIT de hasta 10 segundos como máximo dos veces, no cinco**, y lo indica por stderr; la siguiente lo termina con código 8 (`rate_limited`) y `retryAfterMs`. `serve` y `watch` esperan hasta 2 minutos, tres veces.
- **`tg serve` y `tg watch` terminan cuando Telegram cierra la sesión mientras escuchan**, con código 4, en unos 15 minutos; el servicio no se reinicia por ello. Si las actualizaciones se detienen por otro motivo, o Telegram no responde en 30 segundos cuando se le consulta, terminan con código 12, que systemd reinicia. Antes seguían activos sin recibir nada.
- **El `AUTH_KEY_DUPLICATED` de Telegram** (una sesión cerrada porque dos conexiones la usaron a la vez) ahora es `authentication_error`, código 4, no `provider_error`. El mensaje indica que hay que volver a iniciar sesión y señala como causa procesos `tg` simultáneos.
- **Fijar, desfijar, reaccionar, marcar como leído, eliminar, votar, cerrar encuestas y los cambios de carpetas y contactos terminan con código `14` (`outcome_unknown`) cuando Telegram no responde**, en lugar de un error de tiempo de espera o de red que el registro de envíos anotaba como fallido. El mensaje indica si repetir es seguro; para crear una carpeta no lo es: consulta primero `tg chats folders list`.
- **`tg inbox`, `inbox --new`, `review` y `chats list --unread` (también con `--search` y `--kind`) revisan todos los chats**, no solo los 100 o 200 más recientes, así que ya no se omite un chat sin leer más abajo en la lista. Cuesta una petición por cada 100 chats. `partial` ahora solo significa que Telegram no pudo listar todos los chats; los chats que superan el máximo de 20 por ejecución se nombran en una nota `skipped N chats`.
- **`tg messages list --after-id`, `--after-time` y `--before-time` ya no se detienen ante una página más corta que `--limit`.** Telegram omite los mensajes eliminados de una página, así que una página corta en medio de un chat respondía `hasMore: false` y no daba la indicación para la página siguiente. Ahora indican que hay más hasta que Telegram devuelve una página vacía, como ya hacía `messages list` sin opciones: la última página puede indicar que hay más, y seguir su indicación devuelve una página vacía.
- `tg messages search` acepta la consulta como opcional, porque `--saved` puede usarse solo; sin ninguno de los dos, sigue rechazándose.

### Correcciones

- **Los localizadores de contexto con cuenta rechazan otra cuenta antes de leer.** MCP también acepta `offline: true` para el contexto guardado normal.
- **Detener `tg serve` con Ctrl-C o una señal termina con código 0.** La base de datos de la sesión se cierra una sola vez, lo que evita el error anterior "database is not open" al apagarse.

- **`messages delete` comprueba primero que los identificadores pertenecen al chat.** En un chat privado o un grupo básico, Telegram numera los mensajes por cuenta y elimina solo por número, así que un identificador de otro chat (o el número del otro lado para el mismo mensaje) eliminaba un mensaje allí. Ahora cualquier identificador que no esté en el chat indicado detiene toda la eliminación con código 2, y no se elimina nada.
- `text:/…/` en una búsqueda estricta normaliza las letras igual que el índice de palabras, así que `text:/Квартир.*/` y `text:/счёт/` encuentran las palabras que antes no encontraban. Un error de búsqueda indica qué hacer en su lugar: `~` remite a `--language legacy`, un prefijo demasiado corto para expandirse propone uno más largo, y un índice todavía en construcción indica el `tg store migrate` exacto.
- Dos `tg serve` iniciados en el mismo instante para un perfil ya no pueden ejecutarse a la vez.
## 0.27.0 — 04.10.2026

### Novedades

- `tg mcp --http --public-url https://<name>.ts.net` sirve detrás de tu túnel HTTPS con su propio inicio de sesión OAuth mediante un código del propietario. Cada escritura por HTTP necesita un formulario; `tg mcp --revoke` olvida los inicios de sesión del navegador para el perfil.
- `tg chats stats <chat>` cuenta la actividad guardada de un grupo o canal y pide a Telegram las entradas y salidas. Los resultados sin conexión y de MCP omiten los miembros; las cifras incompletas son un mínimo.
- `tg chats members audit` enumera señales de miembros sospechosos sin eliminar a nadie; las señales no disponibles se indican en `unknown`. Las herramientas MCP de inbox y review aceptan `kinds` y `new`, con sus propios puntos de control.

- El MCP personal usa el catálogo compartido equivalente que adoptó MAX. Las vistas previas de fotos aceptan `index`, y la transcripción directa acepta `model`. El SDK también añade estadísticas del archivo, el estado de preparación de las conversaciones y una actualización local acotada; los modelos nunca se descargan automáticamente.

### Cambios que pueden afectar a scripts

- La cobertura de búsquedas y estadísticas usa el inventario real y las horas de descarga; cada entrada de completitud añade `fetchedAt`. Los almacenes antiguos obtienen estos datos tras la siguiente lista completa de chats y descarga de historial. El prompt `/catch-up` acepta `kind` y `mode` en lugar de `since`.
- `config set permissions` rechaza las claves de comandos desconocidos, también dentro de un objeto completo, con código 2. Los archivos existentes avisan y continúan; `config unset` puede eliminar una clave desconocida antigua.
- `store fetch --page-size` por encima de 100 se rechaza antes de conectarse. Vuelve a ejecutar `store fetch <chat>` para corregir una marca incorrecta de inicio del historial cuando existen mensajes anteriores.

- **`tg serve` termina con código 12 (`provider_unavailable`) cuando existe una sesión guardada pero las credenciales de la aplicación no están disponibles**, por ejemplo mientras el llavero del inicio de sesión está bloqueado. Systemd lo reintenta tras 30 segundos; en macOS hace falta `tg server start`. Los demás comandos y los perfiles sin sesión guardada siguen terminando con código 4.
- **`tg serve` y `tg watch` se niegan a iniciarse con código 4 (`authentication_error`) si la sesión ya estaba revocada.** Comprueban el inicio de sesión antes de indicar que están listos. Una sesión revocada después del inicio sigue necesitando una comprobación aparte.
- **El servicio en segundo plano ya no se reinicia con ese código.** En systemd, el código 4 impide el reinicio. En macOS, launchd no puede excluir un código de salida concreto, así que el agente ya no se reinicia tras ningún fallo. Ejecuta de nuevo `tg server install` para actualizar la unidad; después de `tg session start`, ejecuta `tg server start`.

- Los argumentos desconocidos del MCP personal ahora fallan antes de ejecutarse. Usa el esquema anunciado, incluido `at_time` para programar. Las programaciones aprobadas se ejecutan a la hora absoluta que muestra el formulario.

- **`tg messages list` puede responder `hasMore: true`, con la indicación `older messages: --before-id`, en una página más corta que `--limit`.** Telegram omite los mensajes eliminados de una página, así que una página corta no prueba que se haya llegado al primer mensaje del chat. Incluso la última página con mensajes puede indicar que hay más; seguir su indicación puede devolver una página vacía.

### Correcciones

- Las búsquedas heredadas, por expresión regular y solo con filtros indican el estado real del índice de palabras. `server status` indica la última salida normal de la unidad y una sugerencia de inicio de sesión detenido cuando la unidad permanece detenida a propósito.

- **`tg store fetch` ya no se detiene antes de tiempo ni da un chat por completo cuando una página llega corta.** Telegram omite los mensajes eliminados de una página, así que una página puede ser corta en medio de un chat; ahora la descarga continúa hasta que Telegram no tiene nada más antiguo. Para un chat que ya se dio por completo con mensajes antiguos ausentes, vuelve a ejecutar `tg store fetch <chat>`: lee por debajo de lo guardado.

## 0.26.0 — 04.10.2026

### Novedades

- **Las instrucciones incluidas para el agente explican cómo encontrar acuerdos, preparar reuniones y recomendar contactos.**
  Los agentes comprueban la cobertura del archivo, comparan chats de grupo y personales, distinguen
  personas con el mismo nombre y conservan un borrador cuando se rechaza el envío.

- **`tg messages link` y la herramienta MCP de lectura `tg_messages_link` devuelven un enlace permanente y un localizador del mensaje.**
  En canales y supergrupos se conserva el contexto del hilo; los enlaces privados requieren acceso
  y no añaden miembros al chat. Los diálogos, grupos básicos y Mensajes guardados devuelven un
  localizador. Sin conexión se valida el mensaje almacenado; se rechazan localizadores de otra cuenta.
  El comando singular `link` se distingue de `links`, que describe las relaciones entre conversaciones.

### Cambios que pueden afectar a scripts

- **Desfijar usa su propio permiso, `messages.unpin`, en la CLI y MCP.** Antes la comprobación
  compartida usaba `messages.pin`. Los perfiles con permisos canónicos explícitos deben revisar
  la regla para desfijar; el antiguo `allow: ["pin"]` sigue cubriendo ambas acciones.

- **`tg commands [path...] --json` puede describir un comando o grupo.** Por ejemplo,
  `tg commands messages search --json` incluye las opciones globales y los códigos de salida junto
  con ese comando. Sin ruta se devuelve el árbol completo; las respuestas limitadas a una ruta
  añaden `scope` e `inheritedOptions`. Consulta las distintas rutas en llamadas separadas.

### Correcciones

- **La revisión de preguntas sin respuesta tiene en cuenta las transcripciones guardadas y las nuevas solicitadas antes de filtrar.**
  Añade `--transcribe` para reconocer audios sin texto guardado. Los audios sin reconocer dejan
  `complete` en false: conserva el límite anterior de revisión en vez de interpretar un resultado
  vacío como prueba de que no hay nada que responder.

- Los comandos que abren el archivo local a la vez esperan brevemente a que se inicialice, en vez
  de fallar inmediatamente si otro proceso mantiene el bloqueo de escritura. Los bloqueos persistentes siguen dando error.

- La descarga de audios usa la conexión del historial y la cierra antes del reconocimiento local,
  evitando una segunda conexión para `messages list --transcribe`, `inbox` y `review`.

## 0.25.0 — 03.10.2026

### Correcciones

- `chats show` explica que una diferencia entre los miembros listados y el total de participantes
  puede deberse a la omisión del propio usuario o a una lista parcial, sin afirmar que la carga esté incompleta.
  Los datos JSON no cambian.

### Novedades

- El README y la guía de bots explicitan toda la API nativa: los 185 métodos de la versión fijada
  de Telegram Bot API 10.3, junto con los comandos habituales del bot y las herramientas MCP para tareas concretas.

- `config migrate --dry-run` muestra la conversión de los ajustes de acceso antiguos a permisos
  canónicos sin escribir ni conectarse; `config migrate` la aplica explícitamente conservando
  los niveles efectivos. Los demás ajustes no cambian.

- `tg <bot> bot api <method>` ofrece la versión fijada del esquema Telegram Bot API mediante
  generadores de cli-core y el constructor de comandos común de MAX/TG. Las opciones de campos
  nativos, cuerpos JSON/stdin y cargas multipart anidadas comparten validación y controles de escritura.
  Los métodos destructivos piden confirmación por defecto; las escrituras sin respuesta no se reintentan.
  Las credenciales de bots gestionados requieren un destino explícito `--store-token <profile>`
  y se guardan solo en el llavero del sistema; stdout contiene un recibo de almacenamiento.

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
- **Búsqueda de conversaciones por significado:** `tg conversations embed --chat <chat>` calcula vectores locales y `tg conversations search "<question>"` encuentra conversaciones próximas en uno o todos los chats procesados. `tg models text list|download` descarga el modelo una vez en la carpeta compartida con voz. Con tu clave, `--provider openai` o `--base-url` para Ollama, LM Studio y similares usa un servicio después de explicar qué se enviará y cuánto puede costar. Consulta [búsqueda por tema](./topic-search.md).
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

- **Los comandos locales ya no dicen que cambian Telegram.** `config set` y `unset`, `chats rules set` y `unset`, `recipients add`, `remove` y `clear`, y `auth set`, `auth remove`, `recipients add`, `remove` y `clear` del bot solo modifican configuración, reglas, listas o llavero. La [referencia](./commands.md) indica "Changes something on this computer only.". Siguen siendo escrituras en `tg commands`. `chats moderate` y `session end` siguen indicando cambios en Telegram.
- **`tg contacts show` incluye el chat individual** entre los compartidos, recientes primero. Antes solo mostraba grupos porque la lista de chats comunes de Telegram solo incluye grupos.

## 0.21.0 — 01.10.2026

### Novedades

- **`tg bot`**: bots de Telegram mediante la Bot API oficial y su token: `bot auth set|show|remove`, `bot list [--check]`, `bot chats list`, `bot recipients list|add|remove|clear` y `bot sends list`, como en `max bot`. Permite varios bots con nombres propios; el token se guarda como `bot:<name>` en el llavero o en `TG_BOT_TOKEN`. Consulta [bots](./bot.md).
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
- **Mantenimiento del archivo local: `tg store info`, `check`, `migrate`, `backup`, `restore`.** `info` indica ubicación de `messages.db`, tamaño, esquema y filas. `check` comprueba integridad, claves externas, índices y espacio libre; identifica chats cuyo historial termina antes del último mensaje y no repara nada. `migrate` actualiza y normaliza mensajes anteriores. `backup <file>` copial archivo en uso con acceso solo para ti, sin sobrescribir. `restore <file>` restaura una copia y conserva al lado el archivo sustituido; rechaza si `tg serve` está activo o algún proceso tiene la base abierta. La base se comparte con max-cli: reinicia después los `serve` y `mcp` activos de ambos CLI.
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

- **El almacenamiento compartido de mensajes pasa a la versión 6** (cli-messaging 0.49.0). La primera ejecución de `tg` actualiza
  `messages.db`; un `max` anterior al publicado el mismo día lo rechaza y pide
  actualizarse: `npm install -g @leemour/max-cli@latest`. No cambia nada en los comandos propios de `tg`.

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
- **`tg messages send --silent --no-preview --md`**: sin notificación ni tarjeta de vista previa del enlace,
  y con `**bold**`, `_italic_`, `~~struck~~` y `` `code` `` como formato de Telegram. La herramienta de envío MCP
  acepta `silent`, `no_preview` y `markdown`. El registro de envíos sigue guardando solo la longitud.
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

- **Inicio de sesión** por QR o teléfono (`tg session start`); credenciales de my.telegram.org obtenidas desde navegador o automáticamente (`--app auto`) y guardadas en el llavero.
- **Lectura:** `account show`, `chats list|show`, `contacts list|show`, `messages list|show|context`.
- **Envíos** con `messages send` y `messages reply`, protegidos por destinatarios, perfiles de solo lectura, registro de intentos (`tg sends`) y `--send-id` para reintentar resultados desconocidos sin duplicar.
- **Archivo local:** guarda cada lectura en una base compartida; `--offline` la consulta, `messages search` busca, `backfill` la llena, `watch` y `serve` la actualizan, `sync status` y `export` la leen.
- **Registros de ejecución** (`tg runs`), `config`, `doctor`, `commands` y autocompletado (`complete`).
