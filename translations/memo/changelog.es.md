---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/cli-memo`, con una sección por versión, de la más reciente a la más
antigua. Se utiliza [versionado semántico](https://semver.org/); antes de `1.0.0`, una versión menor puede cambiar
la API.

## 0.21.0 — 11.10.2026

### Correcciones

- La indicación tras una búsqueda sin el modelo de búsqueda por significado nombra el comando que lo descarga,
  `tg models text download e5-small`; antes nombraba un comando `memo models` que no existe.
- `memo projects context` encuentra un proyecto por su clave (`HRB`) o por `project:<id>`, además de por su id;
  con la clave la respuesta salía vacía.

### Cambios — pueden romper scripts

- **`memo search mail` y `memo search messages` muestran cada resultado como una referencia, luego quién y
  cuándo, y luego un extracto.** En un correo, la segunda línea nombra To, Cc y sus etiquetas de Gmail, y la
  tercera su asunto; el cuerpo completo vuelve con `--full`. `--json` da a cada correo `email` (from, to, cc, bcc
  y reply-to con sus referencias `person:`, etiquetas, cadena, leído y destacado) y un `excerpt` en lugar del
  `text` completo; `--brief` deja solo referencia, título, hora, remitente, extracto y puntuación. La búsqueda de
  correo ya no devuelve `coverage`. Basado en la biblioteca compartida 0.251.0.

### Correcciones

- **La importación de correo ya no archiva las direcciones Cc en To.** El correo importado antes las conserva en
  ambos campos; la búsqueda las muestra solo en Cc.

## 0.20.0 — 11.10.2026

### Novedades

- Las guías de `docs/` siguen la estructura de herramientas de wirecat.dev: una introducción, el uso diario, cómo
  funciona memo, recetas, solución de problemas, recuerdos y una referencia de comandos generada (`pnpm generate`),
  escritas para lectores que no usan un terminal a diario.
- `memo commands [path] --json` enumera el árbol de comandos y sus opciones, como hacen tg, max y drive, para que
  la documentación y los agentes puedan comprobar un comando antes de ejecutarlo.
- Todos los comandos tienen una descripción en `--help`, incluidos organizaciones, proyectos, relaciones,
  recordatorios y el listado de tareas.

## 0.19.0 — 11.10.2026

### Novedades

- `memo mcp` indica al agente que se conecta cuándo guardar: lo que pasó es un hecho (`facts_add`), lo que
  concluyó es un recuerdo (`memories_add`), lo que hay que hacer es `actions_propose`, cada uno con su evidencia,
  y solo lo que importará más adelante. `memo search …` y `memo notes show` terminan su `--help` con la misma
  indicación para `memo facts add` y `memo memories add`.

### Cambios

- **La búsqueda por significado en el correo encuentra el correo que contiene la respuesta.** El correo vuelve a
  dividirse en partes correo a correo; el texto citado de nuevo, los saludos y las firmas se siguen descartando.
  Antes, una parte abarcaba varios correos de una cadena y el resultado nombraba el más reciente. La primera
  indexación tras la actualización vuelve a dividir una vez el correo guardado y lo vectoriza de nuevo. Basado en
  la biblioteca compartida 0.249.0.

### Correcciones

- La preparación de una versión se detiene si otra sesión hace avanzar main mientras se ejecutan su PR de versión
  o las comprobaciones locales. Revisa el nuevo main antes de reintentarlo; una preparación obsoleta no puede
  fusionar un encabezado de versión redundante ni lanzar una fuente no verificada.

## 0.18.0 — 11.10.2026

### Correcciones

- El historial de cambios de origen tiene un solo encabezado 0.17.0 después de que la preparación de la versión
  coincidiera con la fusión de su funcionalidad. Los comandos de vocabulario y la versión fijada del almacén
  compartido siguen igual que en 0.17.0.

## 0.17.0 — 11.10.2026

### Novedades

- **Creación de etiquetas revisada por el propietario:** `memo vocabulary create` exige la huella de creación
  actual de la comprobación previa. Las etiquetas parecidas se comprueban en el almacén compartido, incluido el
  etiquetado implícito; las aprobaciones obsoletas fallan. Los alias exactos siguen reutilizando su etiqueta
  canónica. `vocabulary audit` descubre sinónimos léxicos existentes con presupuestos explícitos de trabajo y de
  salida e informa de los análisis incompletos; nunca los acepta ni los fusiona.

- **La búsqueda de correo filtra por estado de leído y destacado, y admite `label:`.** `memo search mail` admite
  `is:unread`, `is:read`, `is:starred` y `label:` (igual que `mailbox:`), y `date:>=2026-01-01` además de
  `date>=2026-01-01`. Funciona con la biblioteca compartida 0.246.0.

## 0.16.0 — 11.10.2026

### Novedades

- **Reuniones de proyecto y dependencias entre tareas.** `projects meetings list|link` exige el proveedor y la
  cuenta exactos de la reunión y admite una clave de proyecto canónica o un alias explícito. `tasks link|unlink`
  gestiona relaciones revisadas de tipo bloqueada-por/continuación-de/relacionada-con; `relations`, `readiness` y
  `ready` exponen el grafo de tareas compartido. Descubrir tareas listas no reclama ninguna. Las herramientas MCP
  `task_relations`, `task_readiness` y `tasks_ready` son de solo lectura. Funciona con la biblioteca compartida
  0.242.0 realmente publicada; las nuevas claves de proyecto usan 3–4 caracteres y las existentes siguen siendo
  válidas.

- **Descubrimiento del vocabulario canónico y alias revisados.** `vocabulary list|resolve|preflight` muestra los
  ID estables de proyectos, etiquetas y temas, los alias explícitos y las etiquetas probablemente duplicadas por
  su forma. `vocabulary aliases add|remove`, reservado al propietario, exige la huella actual de la vista previa.
  Las herramientas MCP de solo lectura `vocabulary_list`, `vocabulary_resolve` y `vocabulary_preflight` permiten
  a un agente reutilizar el catálogo; no pueden aceptar ni cambiar alias. `facts_add` puede asociar su hecho
  propuesto a un proyecto canónico.



## 0.15.0 — 11.10.2026

### Cambios — pueden romper scripts

- **`memo mail <account> import` sustituye a `memo mail import --account <name>`; la forma antigua ya no existe.**
  `<account>` es el nombre en `mail.accounts` y es obligatorio aunque solo haya una cuenta configurada: memo ya no
  recurre a la primera. Un nombre ausente o desconocido es un error que enumera los configurados. Una importación
  de correo toma ahora el bloqueo que toman `memo import` y el temporizador, así que nunca se ejecutan a la vez.
  `memo import` sigue importando todas las cuentas.
- **`bin/mail-password <account>` exige la cuenta**; sin ella, el script imprime su uso y los nombres
  configurados en lugar de suponer `gmail`.

### Novedades

- **`memo search mail --account <address>`** busca en una cuenta de correo; sin él, en todas. Una dirección que
  el almacén no tiene da `not_found` y enumera las que sí tiene.

## 0.14.1 — 11.10.2026

### Correcciones

- **npm vuelve a instalar los paquetes uno al lado del otro.** Funciona con `@wirecat/cli-messaging` 0.241.0,
  cuyo `@wirecat/cli-meetings` 0.4.2 acepta cli-core 0.20.0. Con 0.240.0, npm ponía cli-messaging en una carpeta
  anidada con una segunda copia de cli-core.

## 0.14.0 — 11.10.2026

### Cambios — pueden romper scripts

- **En macOS, memo guarda sus archivos donde lo hace en Linux**: `~/.config/cli-memo`, `~/.local/share/cli-memo` y
  `~/.cache/cli-memo` en lugar de `~/Library/…`. La primera ejecución mueve allí las carpetas antiguas, junto con
  el almacén compartido. Si se está ejecutando un `serve` de un mensajero o un servidor MCP, imprime un aviso,
  sigue usando las carpetas antiguas en esa ejecución y lo vuelve a intentar la próxima vez. Linux y Windows no
  cambian. Funciona con `@wirecat/cli-messaging` 0.240.0.

## 0.13.0 — 11.10.2026

### Novedades

- **`mail.maxBodyChars` y `mail.maxAttachmentChars`** en la configuración fijan cuánto guarda `memo mail import`
  del cuerpo de un correo (por defecto 1.000.000 de caracteres) y del texto de un adjunto (por defecto 200.000).
- **`memo facts add|list|show|accept|reverse`: lo que ocurrió, con su evidencia.** Un hecho es un hecho, una
  afirmación, una pregunta, una decisión o una promesa. Los tuyos se aceptan al momento; los de un agente esperan
  como propuestos. Una decisión con `--supersedes` termina la que sustituye cuando se acepta; `reverse` termina
  una decisión aceptada. `memo mcp` ofrece `facts_add`, `facts_list` y `facts_show`.
- **Tareas propias en un proyecto.** `memo tasks add --project <key> --title <title> --type bug|feature|chore`
  crea una sin fuente. `--priority`, `--parent`, `--description` y `--assignee` funcionan en cualquier tarea;
  `memo tasks update <id>` los cambia, `memo tasks list --project <key>` enumera las tareas de un proyecto y
  `memo tasks close` cierra una.

### Cambios — pueden romper scripts

- **memo funciona con `@wirecat/cli-messaging` 0.238.0**, versión 2 del almacén: al actualizar un almacén, sus
  recuerdos de tipo hecho pasan a ser hechos y se copian las asignaciones de tareas; las versiones anteriores de
  memo aún lo abren.
- **El correo se busca por significado cadena a cadena**, sin el texto citado de nuevo: la primera
  `memo mail import` tras la actualización vuelve a dividir cada cadena y vectoriza el correo otra vez. La
  búsqueda por palabras no cambia.
- **El tipo `fact` de los recuerdos desaparece**: lo que ocurrió ahora es un hecho (`memo facts`). El almacén
  ha movido los recuerdos existentes de tipo hecho a hechos, con sus evidencias y enlaces.
- **`memo tasks assign` admite `--role` (assignee, reviewer o watcher) y ya no `--provider`/`--account`.**
  Escribe los responsables de la tarea, que lee `memo context`, en lugar de una relación `assigned-to`.

## 0.12.0 — 11.10.2026

### Novedades

- **`memo notes add --meeting <id> --provider <provider> --account <account>` escribe una nota sobre una
  reunión.** Toma el id de la reunión en el almacén, como hace `memo tags add --meeting`, y añade el mismo sujeto
  `meeting:<account id>/<meeting id>` junto a cualquier `--about`. Una reunión que la cuenta no tiene da
  `not_found`.

### Cambios — pueden romper scripts

- **memo funciona con `@wirecat/cli-messaging` 0.235.0.**
- **Leído y destacado se mantienen al día.** `memo mail import` actualiza leído y destacado en el correo que
  guardó antes, tal como los muestra ahora el buzón, sin volver a leer el correo.
- **Las cuentas IMAP genéricas reciben marcas.** Sus mensajes registran leído y marcado, y uno marcado lleva la
  etiqueta `Starred`, como un mensaje destacado de Gmail, así que `search mail mailbox:starred` encuentra ambos.
- **Los correos largos se guardan enteros.** El cuerpo se cortaba a los 20.000 caracteres; ahora se guarda hasta
  1.000.000, y el almacén lo divide en fragmentos para la búsqueda.

## 0.11.0 — 11.10.2026

### Cambios — pueden romper scripts

- **memo funciona con `@wirecat/cli-messaging` 0.233.0.** Los adjuntos de un correo importado ahora también se
  encuentran por significado: su texto se divide en fragmentos y se vectoriza tras la importación, y
  `search conversations` de tg/max responde a una coincidencia en un adjunto con su correo.

## 0.10.0 — 11.10.2026

### Novedades

- **Las etiquetas y los destacados de Gmail llegan al almacén.** `memo mail import` lee las etiquetas
  (`X-GM-LABELS`) y las marcas de cada mensaje: cada etiqueta, incluidas Inbox, Important y Sent, se convierte en
  un buzón de etiqueta con un nombre sencillo, un mensaje destacado recibe además `Starred`, y el correo nuevo
  registra leído y destacado. `search mail mailbox:important` los encuentra. Las etiquetas se sustituyen en cada
  ejecución, porque la lista de Gmail es completa; las carpetas mantienen la regla por análisis, y solo las
  carpetas deciden si un correo que falta se ha borrado. Una línea de etiquetas que la importación no puede leer
  deja las etiquetas de ese mensaje como estaban.

## 0.9.0 — 11.10.2026

### Novedades

- **Una reunión se puede etiquetar y se puede escribir sobre ella.** `memo tags add|remove --meeting <id>` con
  `--provider` y `--account` etiqueta una reunión guardada, `memo tags list --type meeting` las enumera y `memo notes add --about
  meeting:<account id>/<meeting id>` escribe una nota sobre una.
- **`memo memories`**: `add`, `list`, `show`, `search`, `confirm` y `stale` para lo que tú y los agentes
  habéis concluido, cada uno con su evidencia y un ámbito `personal` o `work`. Los tuyos se confirman al momento;
  los de un agente esperan como propuestos.
- **`memo actions`**: `propose`, `list`, `show`, `approve` y `reject`. Aprobar convierte la acción en una tarea
  en la cuenta que actuaría; no se envía nada.
- **`memo agents log`**: lo que hicieron los agentes a través de los servidores MCP, por herramienta y agente,
  nunca los argumentos.
- **`memo mcp`**: un servidor MCP por stdio con `memories_add|list|show|search`, `actions_propose|list|show` y
  `agents_log`. Lo que escribe un agente tiene como autor `memo-mcp` y te espera; cada llamada se registra.

### Cambios — pueden romper scripts

- **memo funciona con `@wirecat/cli-messaging` 0.232.0.** `search mail` admite `to:`, `cc:`, `bcc:` (una
  persona, como `from:`), `subject:` (solo palabras del asunto) y `mailbox:` (una carpeta o una etiqueta de Gmail).
- **La ayuda de `search` y `search all` indica lo que `search all` no lee** —personas, recuerdos, proyectos,
  organizaciones y decisiones— y remite cada tipo conocido a su propia búsqueda.
## 0.8.0 — 11.10.2026

### Cambios — pueden romper scripts

- **El correo va a las tablas de correo del almacén.** `memo mail import` guarda cada correo mediante
  `store.mail` de cli-messaging (0.231.0): cadenas, correos, To/CC/BCC, carpetas como buzones y el texto de los
  adjuntos en su correo. Los id no cambian, así que una referencia `msg:email/…`, una etiqueta o una nota creadas
  antes siguen resolviéndose. El correo guardado como mensajes por importaciones anteriores sigue pudiendo
  buscarse y mantiene su antigua regla de borrado; se vuelve a leer en las tablas de correo a medida que la
  ventana lo cubre. Mientras existen ambos, `deleted` cuenta filas guardadas: un correo borrado en el origen
  cuenta su correo, su mensaje antiguo y cualquier entrada antigua de adjunto. Un adjunto ya no es una entrada
  propia: el informe de importación elimina `attachments[].locatorId`, y una nota sobre una entrada de adjunto se
  queda en esa entrada antigua.
- **Las etiquetas, las tareas y el contexto de una persona leen las tablas de correo.** `tags list` mantiene una
  etiqueta en un correo, `tasks add` admite como fuente el `msg:email/…` de un correo, y las tareas y el contexto
  de una persona incluyen su correo.
- **El correo se vectoriza desde las tablas de correo.** Tras guardar, `memo mail import` vectoriza los
  fragmentos del correo nuevo (`embedMail` de cli-messaging), así que `search conversations` de tg y max sigue
  encontrando el correo por significado. `--no-embed` y la falta del modelo se comportan como antes.

## 0.7.1 — 11.10.2026

### Correcciones

- La búsqueda de correo, los paquetes de evidencias y el contexto de una persona también leen el correo guardado
  en las tablas de correo dedicadas. Las importaciones de correo anteriores siguen siendo compatibles; los
  resultados de búsqueda muestran cada referencia de correo una sola vez.

## 0.7.0 — 11.10.2026

### Cambios

- **memo funciona con `@wirecat/cli-messaging` 0.226.0.** El almacén recorta sus registros crecientes al
  abrirse, como mucho una vez al día: se borran las llamadas a herramientas de agentes de más de 90 días, y una
  actualización de bot procesada de más de 30 días pierde su contenido. Actualiza primero tg-cli y max-cli,
  porque los tres comparten el almacén.
- **`organizations add --kind`, `projects add --type` y `--scope` toman sus valores permitidos del almacén** y
  rechazan cualquier otro valor antes de abrir el almacén, indicando los permitidos.

### Correcciones

- **`memo --version` imprime la versión del paquete.** Imprimía 0.4.0 desde 0.5.0: el número estaba en un
  archivo que la publicación no actualizaba. Ahora una prueba falla cuando ese archivo y `package.json` no
  coinciden.
- Las referencias a paquetes, la documentación y los datos de prueba usan el espacio de nombres WireCat en todas
  partes.

### Seguridad

- **Se borra el antiguo `messages.db`** cuando el almacén se abre en su ruta predeterminada: el archivo sin
  cifrar que se usaba antes de `wirecat.db`, con sus `-wal` y `-shm`. Una línea en stderr lo nombra. Se conserva
  cuando `MESSAGING_STORE` está definido y mientras otro proceso aún lo tenga abierto.

## 0.6.0 — 10.10.2026

### Cambios — pueden romper integraciones

- **memo funciona con `@wirecat/cli-messaging` 0.218.0 y `@wirecat/cli-core` 0.19.3**, con el almacén en
  `wirecat.db`. El antiguo `messages.db` se deja como está y no se lee: vuelve a importar las notas y el correo,
  y ejecuta `memo folders add <path>` para cada carpeta, ya que un id de carpeta del almacén antiguo no está en el
  nuevo.
- **`memo entities` se sustituye por `memo organizations` y `memo projects`** (`add`, `list`, `context`), ya
  que el almacén ahora los guarda por separado; `tags --entity` pasa a ser `--organization` o `--project`, y las
  referencias `entity:` no se encuentran. Una organización es una empresa, un equipo, una familia o una
  comunidad; un proyecto tiene una clave.
- **Un archivo de una carpeta de notas es `document:<id>`, y una nota escrita en memo, `note:<id>`.**
  `notes show`, `tags --note`, `tasks add` y `--about` admiten cualquiera de los dos; un id sin prefijo es de una
  nota escrita. La evidencia y los enlaces de la búsqueda nombran la nota de un archivo con `document:`.

### Seguridad

- Las comprobaciones rápidas de secretos siguen en las PR; las comprobaciones de seguridad del código fuente, de
  las dependencias de producción y de los flujos de trabajo se ejecutan antes de la publicación. Las
  comprobaciones automáticas de Socket están desactivadas.

## 0.5.1 — 10.10.2026

### Cambios

- **El proyecto tiene ahora licencia Apache License 2.0.** Consulta `LICENSE` para ver los términos.

## 0.5.0 — 10.10.2026

### Cambios — pueden romper integraciones

- **El paquete es `@wirecat/cli-memo` y su repositorio pertenece a WireCatLabs.** Usa este paquete para
  instalaciones y actualizaciones.


## 0.4.0 — 09.10.2026

### Cambios — pueden romper scripts

- El almacén compartido elimina las copias que guardaba para versiones anteriores (versión 28 del almacén,
  cli-messaging 0.212.0). Las notas, relaciones y entidades escritas antes de la reestructuración de las notas se
  copian una vez a sus nuevas tablas, durante la actualización. Después, una versión anterior de tg, max o memo
  rechaza el almacén con "upgrade this tool": actualiza los tres a la vez.

## 0.3.0 — 09.10.2026

### Cambios — pueden romper scripts

- Los comandos de búsqueda están ahora en `search all|messages|mail|notes`, con los servicios y la clasificación
  compartidos. `search all` devuelve resultados de fuentes con tipo y una lista `tasks` aparte con el trabajo
  abierto vinculado. Las antiguas rutas `memo search <query>` y `memo notes search` se eliminan sin alias. Usa
  `search notes --type` en lugar de `notes search --source`; `--all` y `--note-text` ya no hacen falta.

- Fija el SDK compartido 0.211.0 junto con Telegram/MAX. Las fuentes de tareas de notas copiadas antiguas pasan a
  ID de notas nativos sin cambiar los ID de las tareas, el ámbito de cuenta ni los estados de cerrada. Actualiza
  juntas las herramientas coordinadas antes de abrir el almacén compartido del propietario.

### Correcciones

- `search all` encuentra mensajes en un almacén que aún no ha registrado la cuenta con la que se ejecuta, y
  consulta al servidor del mensajero como hace `search messages`. `search mail` sin correo importado responde con
  un resultado vacío y una nota. Las notas encontradas por significado deben ser tan parecidas como ya tenían que
  serlo las conversaciones, así que una palabra poco frecuente ya no devuelve todas las notas.

### Novedades

- `tasks add note:<id> --provider <provider> --account <account>` crea tareas a partir de notas de archivo
  nativas o internas. Los listados resuelven la vista previa actual de la nota; las notas borradas dejan las
  tareas intactas. Los enlaces confirmados de nota sobre una persona y las asignaciones explícitas se suman al
  contexto de la persona. La búsqueda unificada incluye las tareas cuya nota coincide. Crear de nuevo la misma
  tarea reutiliza la tarea existente del mismo tipo, incluidas las cerradas.

## 0.2.1 — 08.10.2026

- Fija cli-messaging 0.205.0 para coincidir con la versión coordinada de Telegram/MAX. Las notas nativas, los
  enlaces y las referencias de fuente mantienen el mismo esquema y comportamiento.

## 0.2.0 — 08.10.2026

Las notas son registros propios en el almacén compartido (cli-messaging 0.202.0, versiones 25–27 del almacén), y
ya no mensajes de un proveedor `notes`.

- `memo folders add|attach|list`: una carpeta de notas recibe su id del almacén, y la configuración de cada
  ordenador la vincula a la ruta y el formato de ese ordenador (`obsidian` o `markdown`). `list` muestra las
  carpetas que el almacén tiene de otro ordenador. Una carpeta importada antes de la versión 25 del almacén mueve
  su ruta a la configuración en la primera ejecución. La importación rechaza una carpeta sin id en lugar de
  inventarse uno.
- La importación escribe las notas, sus enlaces y sus etiquetas de archivo. Un enlace a una nota que la carpeta
  tiene una sola vez se guarda por el id de la nota; un nombre que ninguna nota tiene se queda tal como está
  escrito y se resuelve a una persona en cuanto existe una con ese nombre, alias o nombre de usuario. Un archivo
  movido conserva su id, sus enlaces y sus etiquetas. Una etiqueta que añadiste se mantiene cuando el archivo deja
  de indicarla. Lo último que vio un ordenador de cada archivo se guarda en la carpeta de estado de memo, y solo
  se abre un archivo cambiado, también para buscar `memo-id`, que marca un archivo que memo exportó y lo deja
  fuera de la importación.
- `memo notes add|edit|remove|list|show|export` para notas escritas aquí sobre mensajes, chats, contactos,
  personas, entidades, tareas y otras notas; `--export [dir]` y `notes.export` las escriben como archivos que
  llevan `memo-id` y nunca se sobrescriben una vez editados.
- `memo notes about`, `memo context` y `memo note` leen los enlaces guardados: notas sobre una persona, notas
  que la enlazan y notas que enlazan una nota sobre ella. Un nombre completo encontrado en el texto plano de una
  nota ya no se muestra como suposición. El antiguo `people-notes.json` pasa al almacén como enlaces `about`, una
  sola vez.
- `memo notes search` funciona sobre el índice de notas compartido: palabras y raíces, el lenguaje de consulta
  de los mensajes, `--exact`, `--source`, `--folder` por ruta o id, y por significado cuando e5-small está
  descargado (`memo
  import` y `memo notes import` vectorizan las notas; `--no-embed`, `notes.embed: false`). Cada resultado indica
  qué lo encontró (`foundBy`), y se nombra a la persona que enlaza una nota encontrada. `memo search --all` cubre
  las notas; `--note-text` también recupera el texto de las notas escritas.
- Las entidades y las relaciones son del propietario: `entities` y `relationships add|list|remove|confirm`
  ya no admiten `--provider`/`--account`. `memo tags add --note <id>` etiqueta una nota; `--person`,
  `--entity` y `--task` no necesitan cuenta. `--folder <id> [--path <subfolder>]` etiqueta todas las notas de una
  carpeta o subcarpeta y sustituye a `--chat` con `--provider notes`. `tags list` indica si la etiqueta de una
  nota procede de su archivo.
- Las notas se leen a través de un formato: `obsidian` añade `#tags` en línea y lee enlaces `[label](path.md)`
  además de `[[wiki links]]`; `markdown` lee enlaces Markdown simples. Los enlaces a referencias `person:`,
  `msg:`, `note:`, `entity:`, `task:`, `chat:` y `contact:` se reconocen en ambos.

- Tareas abiertas y asignaciones explícitas de tareas de documentos en el contexto de una persona; tasks
  add/list/close reutilizan el servicio de tareas compartido. Si coinciden varias cuentas, hay que elegir una
  explícitamente.
- Ingesta de CSV/TSV, PDF, DOCX, XLSX, ODT/ODS, PPTX y EPUB mediante la extracción compartida, con informe de
  motores opcionales y formatos no compatibles, límites de archivo y de texto, hashes de contenido y procedencia
  por página, fila y celda.
- Cobertura configurable de carpetas de Gmail/IMAP, identidades estables por Message-ID, fuentes de texto de los
  adjuntos e indexación de correo limitada y reanudable. Los listados parciales nunca demuestran un borrado;
  cuando cambia el alcance de las carpetas, se omite el borrado.
- Etiquetas de persona, tarea y entidad canónicas, relaciones manuales de organización, familia y proyecto,
  recuperación unificada de las fuentes seleccionadas, y paquetes de evidencias con citas y propuestas del modelo
  con consentimiento remoto explícito.
- Recordatorios de tareas locales y duraderos con recibos de concesión, confirmación de recepción, comprobación de
  ediciones obsoletas, posponer/cancelar y cancelación automática cuando se cierra una tarea. Sin envíos al
  exterior ni cambios en el sistema de origen.

- `memo tags add|remove|list`: etiquetas locales en notas, correos, mensajes y carpetas/cadenas importados,
  identificados por ID de nota o de carpeta, localizadores de mensaje o un proveedor/cuenta/chat exacto. Las
  etiquetas no distinguen mayúsculas de minúsculas, se comparten con tg/MAX y conservan los archivos y buzones de
  origen; las fuentes borradas no aparecen en el listado.
- `memo notes search --tag <tag>` filtra los resultados por palabras y semánticos con la elegibilidad de
  etiquetas compartida, incluidas las etiquetas de la carpeta de la nota.

## 0.1.2 — 07.10.2026

- cli-messaging 0.166.0, a juego con las versiones fijadas definitivas de tg y max, incluida la preparación
  protegida de conversaciones durante la búsqueda y la descarga del historial.

## 0.1.1 — 07.10.2026

- cli-messaging 0.164.0, a juego con el código de tg y max: el contexto de una persona ahora encuentra los
  diálogos privados sin miembros registrados y recupera el último mensaje en cada sentido y los mensajes directos
  en los almacenes de Telegram existentes.

- El flujo de publicación puede hacer una prueba en seco de una versión que ya está en npm, para comprobar el
  empaquetado entre versiones. La publicación sigue rechazando una versión existente.

## 0.1.0 — 06.10.2026

- El comando `memo`, con `--version` y `--help`.
- `memo notes about <name>` (antes `memo notes <name>`): notas sobre una persona, notas que la enlazan y
  menciones débiles de su nombre en texto plano, de las carpetas Markdown indicadas con `--folder` o
  `notes.folders` en la configuración.
- `memo mail import`: todo el correo (All Mail) de una cuenta de Gmail al almacén de mensajes compartido mediante
  Himalaya, en solo lectura; con los id de cadena y de mensaje de Gmail, reanudable con `--max`, y los borrados en
  el origen eliminan el texto guardado.
- `memo note`: la nota sobre una persona, guardada por cada persona del almacén compartido. Vincular identidades
  se hace con `tg|max contacts link`, no con un comando de memo.
- `memo notes import`: notas Markdown y de texto al almacén compartido como proveedor `notes`; las ediciones se
  guardan como revisiones y las notas borradas pierden su texto. `memo notes search <text>`: notas por sus
  palabras, con las personas que enlazan y las personas conocidas cuyo nombre completo mencionan (una suposición).
- `notes.ignore` en la configuración y `--ignore`: archivos, carpetas o patrones glob que nunca se leen ni se
  guardan.
- `memo import`: notas y correo en una sola ejecución, de forma incremental. Las notas guardan en el almacén un
  manifiesto de tamaño, hora de modificación y hash del contenido, así que los archivos sin cambios no se leen y
  los idénticos no se guardan. Un bloqueo impide dos ejecuciones a la vez; una fuente que falla no detiene las
  demás.
- `memo auto on [--every 5m] | off | status`: un temporizador de usuario de systemd para `memo import`. El
  `auto: { enabled, every }` de la configuración es la referencia; el temporizador sigue una edición manual en su
  siguiente ejecución.
- `memo context <messenger>:<person>`: una sola respuesta sobre una persona: el contexto de persona de
  cli-messaging en todas las identidades vinculadas (incluido el correo), la nota sobre ella y las notas que la
  nombran, con lo que no se leyó y por qué. Necesita cli-messaging 0.150.0, que fijan tg y max.
- Las notas se vectorizan para la búsqueda por significado: `memo import` y `memo notes import` procesan cada
  carpeta cambiada y vectorizan los fragmentos nuevos con el modelo local e5-small, como máximo 600 por ejecución,
  y continúan en la siguiente; `--no-embed` y `notes.embed: false` lo omiten. `memo notes search` ordena por
  significado y por palabras a la vez (`by` en cada resultado) y recurre a las palabras cuando falta el modelo.
- cli-messaging 0.153.0, como fijan tg y max: una nota o un correo largos se vectorizan enteros, en fragmentos
  que se solapan.
