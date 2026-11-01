---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/cli-memo`, con una sección por versión, de la más reciente a la más
antigua. Se utiliza [versionado semántico](https://semver.org/); antes de `1.0.0`, una versión menor puede cambiar
la API.

Las notas técnicas exactas de las nuevas versiones se conservan en inglés; las instrucciones de uso están traducidas en sus guías.

## Unreleased

## 0.131.10 — 01.11.2026

### Fixed

- **Construido sobre cli-base 0.71.0**, que cli-core 0.529.0 necesita (su rango de peer es `>=0.71.0 <0.72.0`).

## 0.131.9 — 01.11.2026

### Added

- **`people add <name...>`** añade una persona por su nombre, para asignarle una tarea antes de que algún mensaje la
  nombre. `people list` lista a todos los que Memo conoce, primero el propietario y luego por cuántas tareas los
  nombran, con `--limit` (por defecto 500); antes listaba solo al propietario y a las personas con un rol en una tarea.
- **`tasks add --due <time> --status <state> --agent <name>`** los fija en una tarea de proyecto en una sola
  escritura. `tasks update --description none` borra la descripción. `--priority` acepta una puntuación de `0.0` a
  `1.0` con su punto decimal; un `0` … `4` sin más conserva la escala anterior.
- **`when:` en la consulta de tareas**: `when:overdue`, `when:today`, `when:upcoming` (los 7 días después de hoy),
  `when:later`, `when:none`. `tasks counts` las cuenta en `due` y cuenta `agent`, y cada recuento de `project` lleva
  `ref`; los elementos de la lista llevan `project_key` y `project_name`, así que la lista y los recuentos nombran un
  proyecto igual.
- **Hallazgos sobre cualquiera**: un hallazgo de hecho en `projects actions add` puede nombrar un `subject`
  (`person:`, `organization:`, `task:` o `project:`) y ningún proyecto, y citar una `note:`; un hallazgo de tarea sigue
  nombrando su proyecto. `notes show` da el `fingerprint` con el que citar una nota. `actions show` y `list` llevan
  `subject` y `subject_name` para un lote de hallazgos.
- **`actions confirm <id> [findings...] --fingerprint <hash>`** y **`actions reject <id> --fingerprint <hash>`**
  deciden un lote de hallazgos por su id, sin proyecto. Confirmar sin IDs de hallazgo crea todos. Un agente decide por
  el propietario solo con `--reason`, como en `projects actions`. Los hechos que el propietario conserva se aceptan al
  instante.

### Fixed

- **`tasks list overdue:true` ya no coincide con una tarea que vence más tarde hoy**: es trabajo abierto que vence
  antes de hoy.
- **`tasks history` da las fechas límite en ISO**, como `tasks list`, no en milisegundos de época.

## 0.131.8 — 01.11.2026

### Fixed

- **Los ids y los hilos del correo vienen de `mailIds` de cli-core, la función que usa mail**, así que memo y mail dan
  un solo id a un correo en cualquier servidor. Los ids ya guardados no cambian; una respuesta cuyo In-Reply-To lleva
  un nombre antes del `<id>` ahora se une al hilo de su padre, como en mail.
- **memo avisa cuando deja fuera reglas de correo guardadas**: una regla con una condición que este memo no conoce se
  nombra en stderr con lo que no conoce, en lugar de descartarse en silencio.
- **Las reglas las escribe `ruleInput` de cli-core**, el mismo con el que las escribe mail; la copia de memo ya no
  existe.
- Sobre cli-core 0.526.0, la versión que mail también fija.

## 0.131.7 — 01.11.2026

### Added

- **Un recuerdo puede pertenecer a un proyecto**: `memories add --project <key>`, `memories list project:<key>` y
  `memories update <ref> --project <key>` (`none` lo saca). Los recuerdos llevan `project` y `project_name`; los hechos
  llevan `project_name` junto a `project`.
- **`actions list` y `actions show` dicen qué haría cada acción**, en `summary` («Create 1 fact and 1 task in
  Synthetic Port», «Reply Synthetic Port: Friday works»), y nombran su proyecto en `project` y `project_name`.
- **Un lote de hallazgos en `actions list` y `actions show` lleva su `fingerprint`**, que necesitan `projects actions
  confirm` y `reject`, y cada fuente citada leída de vuelta en `sources` (`kind`, `title`, `sender`, `at`, un
  `excerpt` de como máximo 280 caracteres, `tool`, `missing`). `actions list --brief` omite las fuentes.

### Fixed

- **Un lote de hallazgos rechazado entero aparece como `rejected`** en `actions list` y `actions show`, no como
  `approved`, y `actions list status:rejected` lo encuentra.

## 0.131.6 — 01.11.2026

### Fixed

- **memo abre un almacén pasado al esquema 43** por mail 0.4.0 y otras CLI sobre cli-core 0.520.0; 0.131.5 lo
  rechazaba y pedía actualizar. `memo search mail` y `messages show` ahora usan el mismo código que la búsqueda propia
  de mail, con las mismas respuestas.

## 0.131.5 — 01.11.2026

### Added

- **`"import": false` en una entrada de `mail.accounts` pasa su importación a la CLI `mail`.** `memo sync` y el
  temporizador omiten la cuenta, `memo sync --source email:<name>` avisa de que la importación pasó a `mail`
  (`meta.handed_to_mail` en `--json`), y `memo mail inspect`, `rules`, `delete` y `restore` siguen funcionando con
  ella. Memo sigue reparando el texto HTML, puntuando remitentes e incrustando el correo en el almacén; solo se
  detiene el relleno de cabeceras de Himalaya.

## 0.131.4 — 01.11.2026

### Changed — may break callers

- **La `revision` de una tarea sube solo con un cambio que una persona podría sobrescribir** (cli-core 0.516.0,
  versión de almacén 42): título, descripción, estado, prioridad, asignados, agente, fecha límite, proyecto, padre o
  etiquetas. La reclamación de un agente, su renovación y devolución, y `--remind-time` la dejan como está, así que un
  tablero ya no dice «cambiada en otro sitio» mientras trabaja un agente.
- **`tasks move <id> --before|--after <other>` junto a una tarea de otra columna la mueve a esa columna.** Un
  `--status` que nombra otra columna que la del vecino se rechaza con el motivo `task.column`
  (`HRB-2 is in in_progress, not todo: pick a task in the todo column`).

### Fixed

- **`tasks update --priority none` borra la prioridad** en lugar de fallar con «a priority score is 0 to 1».

## 0.131.3 — 01.11.2026

### Added

- **`projects evidence --sync-profile <tool>=<profile>`** nombra el perfil de mensajería con el que `--sync-first`
  sincroniza cuando hay varios con sesión en la cuenta de un chat (`--sync-profile max=default`; repítelo para otra
  herramienta). El perfil debe tener la sesión iniciada en la cuenta de ese chat, o el chat no se sincroniza y la
  respuesta dice por qué.
- **`projects evidence --json` lleva el `sync_command` de cada chat vinculado**: la línea exacta de `tg`, `max` o `wa`
  que sincroniza un chat guardado en parte hasta `--since-time`, o `null` cuando no necesita sincronización o aquí no
  se puede elegir perfil; entonces una entrada de `missing` con el campo `sync_command` dice por qué.

### Fixed

- **`projects evidence` sale con 0 ante una respuesta parcial.** Un chat guardado en parte lo hacía salir con 1 sin
  nada en stderr; `meta.complete: false`, `missing` y `next` ahora dicen qué falta, como en las búsquedas.
- **`projects evidence --sync-first` avisa cuando hay varios perfiles con sesión en la cuenta de un chat**, y los
  nombra, en lugar de «no profile is signed in».
- **`--sync-first` ya no deja pasar las líneas de progreso JSON de la CLI de mensajería**; se conserva su frase para el
  mismo progreso.

### Removed

- **`memo mail status` se elimina.** Contaba solo la importación con Himalaya, mientras que `mail <profile> status`
  cuenta los buzones que sincroniza la CLI `mail`, así que dos comandos de estado daban dos números distintos. Usa
  `mail <profile> status` para un buzón sincronizado por `mail`; la importación con Himalaya no tiene comando de estado
  hasta que llegue uno mejor que cubra ambos. La herramienta MCP `mail status` desaparece con él.

## 0.131.2 — 01.11.2026

### Added

- **Las tareas de proyecto tienen cinco estados: `open`, `todo`, `in_progress`, `done`, `dismissed`** (página Tasks de WireCat Desktop, cli-core 0.513.0). `tasks update --status` mueve una tarea de proyecto a cualquiera de ellos, también de vuelta desde `done` o `dismissed`, y cada cambio queda en el historial de la tarea. `todo` e `in_progress` cuentan como trabajo abierto para la disponibilidad, las reservas y la lista por defecto.
- **`tasks list` con `project:` admite una consulta completa**: `project:*` para todos los proyectos, un proyecto por su nombre o alias, `assignee:`, `priority:` (etiquetas, `none`, rangos), `agent:`, `due:` y `closed:` con rangos, `overdue:`, OR dentro de un campo, NOT y palabras sueltas sobre el título y la descripción. `--sort` y `--desc` la ordenan, `--cursor` lee más allá de 500 y `page.total` indica cuántas coinciden. Cada tarea incluye `assignments`, `ready`, `blocked_by`, `agent`, `priority_label` y `revision`.
- **`tasks counts [query]`** cuenta las tareas de proyecto que coinciden por proyecto, responsable, prioridad y estado, cada una sin los términos propios de la consulta sobre ese campo, para un selector.
- **`tasks move <id> --before|--after <id> [--status s]`** coloca una tarea de proyecto junto a otra en su columna del tablero dándole una prioridad intermedia; la respuesta indica si cambió su etiqueta y qué tareas se separaron para hacer sitio.
- **`tasks history <id>`** muestra quién cambió una tarea, qué y cuándo; **`tasks assign --clear`** quita a una persona de una tarea; **`tasks update --agent`** nombra al agente que trabaja en ella, aparte de sus responsables; **`people list`** lista a usted y a todas las personas que nombran las tareas, para un selector de responsable.
- **`--revision`** en `tasks update`, `close`, `assign` y `move` rechaza una escritura hecha sobre una copia obsoleta: `configuration_error`, motivo `task.stale`, código de salida 3.

### Changed — may break callers

- **La prioridad de una tarea es una etiqueta sobre un número de 0 a 1, de mayor a menor.** `--priority` acepta `low`, `medium`, `high`, `critical` o `none`, y sigue leyendo 0 (urgente) … 4 (baja) como critical, high, medium, low, low. `--json` da `priority` como número (0.875 para lo que era 0) y `priority_label`. Las listas se ordenan por ella, de mayor a menor.
- **Un `tasks list` simple lee `state:` como trabajo abierto**: sin `state:`, lista `open`, `todo` e `in_progress`. Un `state:open` explícito significa ahora solo las tareas nuevas.

### Fixed

- **`tasks update --parent none`** convierte una subtarea en tarea de primer nivel; fallaba con «no task none».
- **`tasks add`, `close` y `assign` registran al agente** cuyo terminal ejecuta memo, como hacía `update`; antes siempre registraban al propietario.
- **La lista de un proyecto indica `has_more` en 500 tareas**; decía que no había más.
- **El README nombra `tasks links`**, no `relations`.

## 0.131.1 — 01.11.2026

### Fixed

- **La documentación dice que la CLI `mail` trae el correo y que la importación de Himalaya se eliminará en una versión posterior.** `mail <profile> session start` y `mail <profile> sync` llenan el almacén compartido; memo busca y muestra ese correo. La importación de Himalaya y `memo mail inspect`, `rules`, `delete`, `restore` y `status` siguen funcionando sin cambios. Solo cambian la documentación y el texto de ayuda: `memo mail status` ahora dice que cuenta solo la importación de Himalaya y remite a `mail <profile> status`. La documentación también dice que el correo sincronizado por `mail` no tiene texto de adjuntos, que `memo mail delete` mueve el correo de Gmail a la Papelera, y escribe `memo mail delete`, `memo mail restore` y `memo mail inspect` completos.

## 0.131.0 — 31.10.2026

### Fixed

- **El rellenado de cabeceras y la reparación del texto HTML ya no bloquean a otras CLI en el almacén.** Ambos guardaban un correo por transacción. Ahora guardan 50 por transacción mediante `MailStore.saveThreads` de cli-core (cli-core 0.506.0, ya en uso en 0.509.0), hacen una pausa de 100 ms entre lotes y guardan su progreso en la misma transacción: el rellenado guarda su cursor con cada lote y la reparación se marca como terminada con el último. Una ejecución que falla se reanuda tras el último lote guardado.

## 0.130.0 — 31.10.2026

### Changed — may break callers

- **cli-core 0.509.0** (desde 0.507.0) trae los dos cambios siguientes; 0.508.0 solo cambió comandos de calendario que memo no ofrece.
- **`agents list` nombra al agente que hizo una llamada MCP, no `memo-mcp`.** Una llamada a través de `memo mcp serve` se registra, y un hecho, recuerdo o acción que añade se firma, con el nombre que el cliente se dio a sí mismo (MCP `clientInfo.name`, como `claude-code`), si no con el agente de programación que inició el servidor, si no con `memo-mcp`. Un filtro por `agent:memo-mcp` ya no encuentra llamadas nuevas. El nombre es lo que el cliente afirma de sí mismo: se muestra, pero no se confía en él.
- **`facts add --supersedes` corrige un hecho de cualquier tipo**, no solo una decisión aceptada. El hecho anterior debe estar propuesto o aceptado; pasa a `superseded` cuando el nuevo se acepta, lo cual ocurre de inmediato si es del propietario (uno propuesto antes seguía propuesto). Un `--supersedes` de un agente sobre un hecho que el propietario aceptó se rechaza (código de salida 5); sobre uno propuesto espera, como antes, a que el propietario lo confirme.

## 0.129.0 — 31.10.2026

### Added

- **`memo doctor --online` indica si hay publicada una versión más nueva de memo.** La respuesta incorpora `online` con la forma de los demás doctor de WireCat: `ok`, `duration_ms` y `version: { current, latest, newer }` (`latest` es `null` cuando no se puede llegar a npm, lo cual no hace fallar el comando). Sin `--online`, el doctor de memo sigue sin conectarse a nada. Requiere cli-core 0.507.0 y cli-base 0.68.1.

## 0.128.0 — 31.10.2026

### Changed — may break callers

- **cli-core 0.506.0: `search messages --discover` también busca por significado cuando la consulta usa `-`, `NOT`, `OR`, grupos, frases o `exact:`**, donde antes ejecutaba solo la búsqueda estricta; cada resultado sigue coincidiendo con toda la consulta.

### Added

- **`projects evidence --sync-first` sincroniza los chats vinculados del proyecto antes de leer.** Desactivado por defecto y no disponible por MCP. Para cada chat vinculado que el almacén no tiene hasta `--since-time`, memo ejecuta la CLI de mensajería de ese chat como `<tg|max|wa> <profile> messages sync --since-time <start> -- <chat>`, un chat cada vez, dentro de `--sync-time` (3 minutos en total). El perfil es el que tiene la sesión iniciada en la cuenta del chat, según el propio registro del mensajero; ninguno o varios es un rechazo para ese chat que los lista, nunca una suposición. memo ejecuta `wcat-<tool>` cuando se describe como esa herramienta, o el nombre corto solo cuando es el paquete de WireCat. El stderr del proceso hijo se pasa como progreso. Un chat que el tiempo corta, o cuya sincronización falla (otra ejecución tiene la sesión, MAX necesita `serve`), queda parcial con el motivo, y sus `missing` y `next` permanecen.
- **El texto nombra el comando que sincroniza un chat vinculado parcial**, con su CLI y perfil: `tg work messages sync 9 --since-time 2026-09-01`.
- **`projects evidence` viene de cli-core** (`gatherStoredProject`, compartido con tg y max). El comando se declara fetch por `--sync-first`. Requiere cli-core 0.504.0.

### Fixed

- **El número de un recuerdo o hecho olvidado nunca se da a uno nuevo** (cli-core 0.506.0). Tras `memories remove` o `facts remove` del registro más reciente, el siguiente tomaba su número, de modo que un `memory:N` o `fact:N` leído antes de olvidar nombraba otro registro.
- **`memo doctor`, `memo mcp` y `memo mcp serve` usan los resúmenes que comparten todas las CLI de WireCat.** `memo doctor --help` ahora empieza con «the state this installation is in, without connecting unless --online» (memo sigue sin conectarse a nada y no tiene `--online`), `memo mcp` con «serve this profile's commands to an AI agent, and set that up» y `memo mcp serve` con «serve this profile's commands to an AI agent». Solo cambió el texto de ayuda.

## 0.127.0 — 31.10.2026

### Added

- **Corregir, rechazar y olvidar recuerdos y hechos.** `memories add --supersedes memory:<id>` corrige un recuerdo: el anterior queda como `superseded` (solo los suyos; el de un agente se rechaza con `permission_error`). `facts reject fact:<id>` rechaza un hecho propuesto (nuevo estado `rejected`). `memories remove` y `facts remove` borran el registro, sus vínculos con las fuentes y su entrada de búsqueda, y responden `{ ref, removed: true, links }`; una copia de seguridad del almacén hecha antes lo conserva. Ninguno de los tres se ofrece por MCP.
- **`subject_name` y `subject_is_owner`** en `memories list`, `memories show`, `facts list` y `facts show`: cómo se llama el sujeto, sin una segunda consulta.
- **`memories show --sources` y `facts show --sources`** leen cada prueba en una sola llamada: `ref`, `kind`, `title`, `sender`, `at`, `excerpt`, `tool` y `missing` para una fuente borrada después.

## 0.126.0 — 31.10.2026

### Added

- **`search notes`, `search messages` y `search mail` indican cuántos resultados coinciden en total.** `--json` añade `page.total: { value, relation }`, con la forma de `hits.total` de Elasticsearch: `eq` es el recuento exacto, `gte` un límite inferior (el recuento se detiene en 10 000). La vista de texto añade `showing 1–20 of 144` bajo los resultados. Las notas cuentan las que encuentran las palabras y las que se encuentran por significado, todas las páginas juntas (cli-core 0.501.0).

### Fixed

- **La búsqueda por significado dentro de un filtro encuentra las notas del propio filtro.** Con un filtro de como máximo 2000 notas, cada una se ordena por significado, en lugar de las 50 más cercanas en total recortadas al filtro (cli-core 0.501.0). memo requiere cli-base 0.67.0.

### Changed — may break callers

- **`projects evidence` indica lo que el almacén tiene de cada chat vinculado, y `search messages` y `search all` conservan en sus respuestas la laguna de cobertura** (cli-core 0.498.0). Cada fila de `linked_chats` incorpora `title`, `completeness` y `held`; un chat al que la ejecución no llegó es `state: "pending"` sin `items` ni `capped`, donde decía `in-scope` con `items: 0`. El `completeness` de la respuesta es `partial`, `unknown` o `complete`, y `meta.complete` es verdadero solo cuando las lecturas previstas terminaron y cada chat vinculado se tiene completo; `complete` conserva su significado, «las lecturas previstas terminaron». Un chat tenido en parte da `missing` (`field: "history"`) y una línea en el texto que lo nombra y da el comando de sincronización; el código de salida sigue siendo 0. memo no tiene `messages sync`, así que `next` (el paso `messages.sync` de cli-core) se elimina de las respuestas de memo: la CLI de mensajería sincroniza el chat. `search messages` y `search all` respondían `meta.complete:
  true` sin `missing` para un chat tenido en parte, porque los constructores de respuestas de memo descartaban lo que devolvía cli-core; ahora llevan ambos.

- **0.125.0 también traía las respuestas de cobertura de cli-core, que cambian la salida JSON** (cli-core 0.493.0, no indicado en esa versión). `memo search all --json` responde `meta.complete: false` con `missing` y `next` cuando un chat que buscó se tiene solo en parte o nunca se obtuvo, donde decía `true`; el código de salida sigue siendo 0. Las filas de `memo tasks agenda --json` incorporan `completeness` y `held`, y la respuesta puede llevar `meta.complete: false`, `missing` y `next`. Un llamador que leía `meta.complete` como «ninguna fuente falló» debe leer `missing` para saber el motivo.

## 0.125.0 — 31.10.2026

### Fixed

- **`search notes` y `search all` conservan los campos de la consulta para las notas encontradas por significado.** `date:today` o `tag:work` sin `--exact` devolvían unas 20 notas que no coincidían con ninguno de los dos; ahora cada campo y cada palabra excluida se cumplen para cada resultado, y una consulta solo de campos lista las notas coincidentes, las más recientes primero. Para un documento de Google Drive, `date:` lee su última edición en Drive, la hora que su resultado muestra como `updated_at`, donde antes leía cuándo se importó por última vez (cli-core 0.496.0, con cli-base 0.65.5).

## 0.124.0 — 31.10.2026

### Changed — may break callers

- **La búsqueda en notas, documentos, anotaciones y notas de contacto encuentra parte de una palabra, con cualquier combinación de mayúsculas y minúsculas.** Una palabra cirílica en mayúsculas y minúsculas mezcladas ya no se pierde, y el título se busca junto con el texto. Una búsqueda de uno o dos caracteres se rechaza con «search needs at least three characters», como la búsqueda de mensajes. El almacén pasa a la versión 40 la primera vez que esta versión lo abre; las notas guardadas antes reciben su índice de búsqueda por lotes mientras se ejecuta `search notes` o `store migrate`. Un memo más antiguo u otra CLI de WireCat debe actualizarse el mismo día, o dejará de indexar las notas nuevas. Este memo usa cli-core 0.491.0, que además termina de localizar una carpeta de correo grande a lo largo de varias sincronizaciones con presupuesto.

## 0.123.0 — 30.10.2026

### Fixed

- **`memo sync` ya no falla con «database is locked» mientras otra herramienta escribe en el almacén compartido.** El almacén espera el bloqueo de escritura intentándolo cada milisegundo, de modo que una herramienta que escribe sin pausa (`mail sync`) no puede retenerlo durante toda la espera de 5 segundos.
- **Los nombres coinciden sin distinguir mayúsculas en cualquier alfabeto, no solo en el latino.** `memo projects list 'name:*ТАРТ*'` ahora encuentra «Тартус». Lo mismo vale para títulos de chat, nombres de contacto, asuntos de correo y nombres de buzón y de etiqueta, en `tags list name:` y en la búsqueda de correo `mailbox:` y `label:`. El almacén pasa a la versión 38 la primera vez que esta versión lo abre, y rellena las copias en minúsculas con las que compara. Un memo más antiguo u otra CLI de WireCat sigue leyendo el almacén y avisa de que hay que actualizar.

### Added

- **Los resultados de `search all`, `search messages` y `search mail` llevan `sender_is_me`**, verdadero cuando el mensaje lo envió usted.

### Changed — may break callers

- **`--help` lista `gcal` en «Works with».** Un script o una prueba que fije la primera pantalla gana esa línea. Instale gcal con `@wirecat/gcal-cli`.

## 0.122.0 — 29.10.2026

### Changed — may break callers

- **La skill del agente está publicada en ClawHub como `wirecat-memo`.** Instálela con `openclaw skills install @wirecat/wirecat-memo`. La entrada `cli-memo` ya no se actualiza. `memo skill install` sigue escribiendo `skills/cli-memo/`.

### Added

- **`person:me` le nombra a usted** en `context`, `relationships add`, sujetos de `notes`, `tasks assign`, `mentions confirm` y `projects gather --contact`. Es la persona que el almacén marca como propietario; si no hay ninguna marcada, el error dice cómo marcarla (`tg <profile> contacts link <your id> me`).
- **`memo context person:<id>` lee a una persona cuya referencia ya tiene.** Antes pedía una cuenta de mensajería. La persona se lee de la única cuenta que la vio; cuando fueron varias, las lista y pide `--source provider:account`.

### Fixed

- **`memo messages show <email>` ya no imprime las versiones AMP y HTML del cuerpo** (unos 4000 caracteres de marcado) después del texto sin formato. `--full` las devuelve.
- **La skill enviaba a los agentes a `memo commands search <word>`, que parece una búsqueda por palabra clave y responde `not_found`.** `memo commands` toma una ruta de comando (`memo commands search notes --json`); ahora la skill lo dice, y una prueba comprueba que cada línea de comando `memo` que contiene nombra un comando que existe.

## 0.121.0 — 29.10.2026

### Changed — may break callers

- **cli-core 0.473.0.** `memo projects list` omite la bandeja de tareas que tiene cada cuenta de mensajería (un proyecto con nombre como `telegram:100`, su clave `IN` y ocho caracteres); `memo projects list kind:inbox` lista solo esas, y `name:` admite comodines `*`.

## 0.120.0 — 27.10.2026

### Changed — may break callers

- **cli-core 0.469.0 y cli-base 0.65.0.** cli-core 0.469 solo acepta cli-base 0.65, así que ambas versiones cambian juntas. cli-base 0.65 conoce los verbos `serve` y `revoke`, por lo que sus entradas en la línea base de lint desaparecen, y su `cli-dev bundle` encuentra un servidor iniciado con una opción antes de `mcp serve`. Desde cli-core 0.468, un servidor MCP ofrece, mediante su herramienta de lectura, un comando que solo obtiene datos hacia el almacén.
- **La sincronización de correo, las reglas y la puntuación se ejecutan desde cli-core 0.472.0.** El motor pasó a `@wirecat/cli-core/mail`; memo conserva sus fuentes Himalaya y mbox, la consulta de antigüedad del dominio y el embedding. La cuenta, los ids, el estado de sincronización y las respuestas son los mismos. `mail.source-failed` ahora lo declara cli-core, y `mcp serve` tiene la opción `--profiles` de cli-core 0.470 solo en el contrato compartido contra el que se comprueba, no en memo.
- **`skill show`, `skill status` y `skill install` responden a `--json` en el sobre de un solo elemento** ([WC-OUT-4](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/output.md#wc-out-4--answer-every-json-request-with-one-envelope-a-list-or-one-thing)), `{ item, meta }`, como cualquier otro comando de memo y el propio `skill` de cli-core; imprimían el objeto sin envoltorio. Un llamador lee los campos antiguos dentro de `item`, p. ej. `item.targets` de `skill status`.

### Fixed

- **`memo` arranca en aproximadamente la mitad de tiempo: el paquete se ejecuta desde un bundle.** Un comando cargaba unos mil archivos de módulos antes de hacer nada; ahora carga unas pocas decenas que contienen el mismo código, generadas por `cli-dev bundle` de cli-base. `memo search all --help` en caliente pasó de 420 a 186 ms, `memo --version` de 39 a 18 ms. La salida no cambia. Un `memo mcp serve` en ejecución carga todo su código poco después de arrancar, así que actualizar `memo` en el sitio no lo rompe. El paquete es mayor: 3,1 MB de descarga en lugar de 0,4 MB.
- **`memo mcp --json` rechaza la opción con un `validation_error` JSON (código de salida 2)**, como `memo notes --json` y `memo mail --json`; imprimía la ayuda del grupo y nada en JSON. `mcp revoke` y `mcp server
  start|stop|status` ahora aceptan `--json` ellos mismos, así que va después del comando: `memo mcp revoke --json`, ya no `memo mcp --json revoke`.

## 0.119.0 — 27.10.2026

### Changed — may break callers

- **cli-core 0.467.0 y cli-base 0.64.0.** cli-core solo acepta cli-base 0.64, así que ambas versiones cambian juntas.
- **Cada resultado de búsqueda marca el texto que escribió otra persona (cli-core 0.464.0).** Los resultados de mensajes y correo de `search all` llevan `untrusted: ["title", "excerpt", "sender_name"]`, los de documentos `["title", "excerpt"]`, como los resultados de eventos; `search messages` y `search mail` marcan el remitente, el título del chat y el texto. Una nota queda sin marcar: es suya. Un llamador que comprueba los resultados contra una copia antigua y estricta de su forma rechaza el campo nuevo.
- **Ahora se guarda cada ejecución, también las correctas (cli-core record-every-run).** Antes solo se guardaban las ejecuciones fallidas, salvo con `--record` o `record: true`. Una ejecución correcta se conserva 7 días (`keep_successful_runs_for_days`), una fallida 30 (`keep_runs_for_days`), y la carpeta de ejecuciones se mantiene por debajo de `runs_size_limit_mb` (200 MB; primero se van las correctas más antiguas). **Privacidad:** una ejecución guardada contiene el comando tal como se escribió (secretos y números de teléfono ocultos), así que un `memo search` o `notes add` correcto deja ahora sus palabras en un archivo local con permisos 0600 durante 7 días. `record_input: "failed"` las guarda solo en una ejecución fallida, `record_input: false` las oculta en todas partes; `record: false` ahora guarda las ejecuciones fallidas (antes: nada); `--no-record` no guarda nada. `memo mcp serve` guarda una ejecución correcta solo con `--record`.
- **Una ejecución indica quién la pidió (cli-core).** `run.json` incorpora `via` (`cli`, `mcp-stdio`, `mcp-http`, `desktop`), `mcp` (ids de herramienta, solicitud y conexión) y `agent.client` (nombre y versión de la aplicación de IA). Por HTTP el agente es la sesión MCP de la aplicación del navegador, ya no el agente que inició `mcp serve --http`. Un lector que comprueba una ejecución contra una copia antigua de su forma rechaza los campos nuevos.

### Added

- **`memo upgrade` reinicia el servidor MCP HTTP y nombra las sesiones MCP por stdio que siguen en la versión antigua** (cli-core). Tras una instalación reinicia cada `memo mcp serve --http` que lanzó `memo mcp server start`, con el mismo puerto, dirección y límites de `--permission`, y lista los procesos `memo mcp serve` por stdio de esta instalación como `stale_sessions` que hay que reiniciar desde su aplicación de IA. Funciona desde la próxima actualización.
- **Una lectura de correo que himalaya reintenta son dos líneas de solicitud en la ejecución**: la segunda tiene `attempt: 2` y los 15 s que esperó, y una cuenta limitada se nombra `mail.throttled`, nunca con lo que imprimió himalaya. Las líneas RDAP llevan `method`, la ruta con el dominio como `:id` y `transport: "http"`; un rechazo nombra el `errorCode` del registro (`rdap.429`), leído de un cuerpo de error de 4 KB como máximo, nunca su título ni su descripción.
- **`record_input: "failed"`, `keep_successful_runs_for_days` y `runs_size_limit_mb`** en `config.json`.

## 0.118.0 — 27.10.2026

### Added

- **Un resultado de evento de `search all` nombra su texto de invitación en `untrusted`** (`["title", "excerpt"]`), en cli-core 0.460.0. Por MCP un agente lo ve marcado en la propia respuesta, no solo en las instrucciones del servidor.
- **`memo search all` encuentra eventos de Google Calendar** que gcal guardó, de todos los calendarios, ordenados junto con mensajes, correo y notas (cli-core 0.459.0). Un resultado tiene `kind: "event"` y una referencia `event:<id>`, que abre `gcal <profile> events show`. `--only` acepta `events`; `meta.accounts` y la línea `searched:` nombran cada calendario leído. Cuando los eventos se buscaron solo por palabras, la respuesta dice por qué, como para notas y mensajes.
- **`memo context` lista los eventos de calendario de la persona** en `events`: `upcoming` y `recent`, una ocurrencia por serie, ninguna cancelada, de cada calendario al que está invitada cualquier identidad vinculada a ella; `events.accounts` nombra los calendarios leídos. La respuesta de texto los muestra bajo «Upcoming events» y «Recent events».
- **El texto de los eventos se marca como palabras de otras personas.** `memo context --json` lleva `untrusted`, los campos del evento que escribió el remitente de la invitación (`events.upcoming.title`, `events.upcoming.location` y lo mismo bajo `recent`), como los marcan las herramientas de calendario de cli-core. Las instrucciones MCP de memo dicen que el título, la descripción y el lugar de un evento son datos, nunca instrucciones.

### Changed — may break callers

- **`memo context --json` nombra un calendario ausente en `not_read`** (`source: "events"`, "no calendar in the store — gcal <profile> sync"), así que una respuesta que solía tener `not_read` vacío tiene ahora esa entrada hasta que gcal sincronice.
- **`@wirecat/cli-core` 0.451.0 → 0.463.0.** El almacén compartido pasa a la versión 35 (una ocurrencia nombra su serie en una columna); las compilaciones que hablan la versión 34 siguen abriéndolo.
- **El servidor MCP es `memo mcp serve`; `memo mcp` solo muestra sus comandos** (cli-core 0.463.0). `--http`, `--port`, `--public-url` y `--permission` pasan a `mcp serve`, y `memo mcp --revoke` es ahora `memo mcp revoke`. No hay alias: una aplicación cuya configuración MCP ejecuta `memo mcp` recibe la ayuda y el código de salida 2, así que cambie sus `args` a `["mcp", "serve"]`; configure Claude Code con `claude mcp add memo -- memo mcp serve`. `memo mcp server start` ejecuta `mcp serve --http` y sigue pasando `--permission`.

### Fixed

- **`memo sync` se detiene con Ctrl-C y SIGTERM**, donde antes ignoraba SIGTERM y llegaba hasta el final. Se detiene en el siguiente lote de correos, cuenta de correo o carpeta de notas, conserva el punto de reanudación, termina un himalaya en ejecución, libera el bloqueo de importación y falla con `cancelled` (código de salida 130). **`memo sync --timeout <duration>`** lo detiene del mismo modo al llegar a un plazo, con `timeout` (código de salida 9); sin ella una sincronización no tiene límite de tiempo, como antes.
- **La skill del agente de memo se publica de nuevo en ClawHub como `cli-memo`.** ClawHub guarda los nombres de skill por editor, así que `wirecat/cli-memo` es el nombre propio de memo, y la skill de cada herramienta de WireCat usa ahora su nombre simple. La próxima versión la publica como `cli-memo` 1.0.1. `memo skill install` sigue escribiendo `skills/cli-memo/`.

## 0.117.0 — 27.10.2026

### Added

- **La skill indica al agente que nunca pida en el chat una contraseña de correo ni una contraseña de aplicación**: el propietario añade una cuenta de correo por sí mismo, en Himalaya y luego con `memo mail add`.

## 0.116.0 — 27.10.2026

### Fixed

- **`memo search all` y la búsqueda por significado en notas y archivos responden en una fracción de segundo (cli-core 0.451.0).** Ordenar documentos y notas por significado ahora usa el índice vectorial en lugar de leer cada fragmento del almacén: en un archivo con 600 000 fragmentos, sobre todo correo, tardaba 7–18 s por consulta y ahora unos 0,05 s, con los mismos resultados. Sigue leyendo cada fragmento cuando el índice no está listo.
- **La búsqueda por significado se ejecuta también con ONNX Runtime nativo en Windows.** Tras `memo models download e5-small`, el modelo usa la biblioteca nativa en Windows x64 y arm64, como ya hacía en Linux y macOS: de 2 a 3 veces más rápido que WebAssembly. La descarga toma `onnxruntime.dll` del paquete npm `onnxruntime-node` (113,5 MB, una vez, comprobado por sha256).

## 0.115.0 — 27.10.2026

### Added

- **`memo mcp --http --public-url` admite una ruta (cli-core 0.450.0)**, `https://<name>.ts.net/memo`, de modo que memo comparte una dirección de túnel con las demás herramientas, una ruta cada una. El inicio de sesión y la dirección del conector (`…/memo/mcp`) llevan la ruta; el túnel también encamina `/.well-known/oauth-authorization-server/memo` y `/.well-known/oauth-protected-resource/memo` al servidor. WireCat Desktop lo configura con Tailscale Funnel.

### Fixed

- **La skill del agente de memo se publica en ClawHub como `wirecat-memo`.** ClawHub tiene un `cli-memo` 1.0.0 que no es público y rechaza cada nuevo 1.0.0 con ese nombre, así que ninguna versión pudo listar la skill. `memo skill install` sigue escribiendo `skills/cli-memo/`.

## 0.114.0 — 27.10.2026

### Fixed

- **`memo mail add` y `memo mail check` aceptan una cuenta de Himalaya que no define `email`.** Himalaya funciona sin él, así que muchas cuentas nombran su dirección solo como el inicio de sesión. Memo ahora toma la dirección del inicio de sesión IMAP y luego del SMTP, cuando es una dirección de correo. Cuando no lo es ninguno, el error nombra el archivo de configuración de Himalaya y la línea que hay que añadir: `email = "you@example.com"` bajo `[accounts.<name>]`.

- **Cada comando tarda menos en estar listo (cli-base 0.62.0, cli-core 0.449.0).** La comprobación de los comandos compartidos ahora describe cada comando una vez, no de nuevo por cada grupo superior. Era cerca del 60 % de la preparación de cada comando; en tg un `run(["--version"])` en caliente pasó de 49 a 29 ms. Detecta los mismos cambios que antes.

## 0.113.0 — 26.10.2026

### Fixed

- **La búsqueda por significado, y el carril de significado de `memo search all`, se ejecutan de 2 a 3 veces más rápido en Linux y en Mac con Apple silicon (cli-core 0.448.0)** tras el próximo `memo models download`: los modelos de texto se ejecutan entonces con ONNX Runtime nativo, y con WebAssembly donde no está instalado.

## 0.112.0 — 26.10.2026

### Security

- **Un registro de ejecución oculta un secreto por su aspecto, no solo por el nombre de la opción (cli-core 0.446.0).** Un token de formato conocido (GitHub, OpenAI, Anthropic, Slack, AWS, Google, Stripe, npm, Telegram, un JWT, una clave privada), una credencial `Bearer`, el valor tras `password=`, `pin 1234` u otro nombre de secreto, y una cadena de aspecto aleatorio quedan `[redacted]` dentro de la palabra, conservando las palabras de alrededor: `memo search notes "Kai password=tulip42"` conserva `Kai password=[redacted]`. Una configuración que no carga ahora oculta cada valor escrito, como `record_input: false`.

## 0.111.0 — 26.10.2026

### Added

- **`memo mcp server start|stop|status` ejecuta el servidor MCP HTTP en segundo plano (cli-core 0.445.0).** `start` acepta `--public-url`, `--port` (por defecto 8767) y `--permission` y responde cuando está escuchando; `status --json` da el puerto, la dirección del conector, el código de acceso actual con cuándo caduca y las aplicaciones con sesión iniciada, cada una con el nombre que se dio a sí misma; `stop` termina solo un servidor que inició `start`. `memo mcp --http` ahora mantiene un bloqueo junto a su archivo de token, así que se rechaza un segundo servidor, y su código de acceso se renueva cuando caduca. WireCat Desktop los usa.

### Changed — may break callers

- **Una ejecución conserva el comando tal como se escribió (cli-core 0.440.0).** `memo runs show` y `run.json` llevan ahora `argv`, las palabras tras `memo`, para que el propietario pueda leer lo que se ejecutó: una búsqueda, un nombre, el título de una nota. Un secreto sigue siendo `[redacted]` (una opción con nombre de token, contraseña o clave de API, una contraseña en una URL, una cadena opaca larga), igual que un número de teléfono. La nueva clave `record_input` en `config.json` con valor `false` escribe como `[redacted]` cada valor que pueda ser contenido. La ayuda de `--record` lo dice; decía «ids and timings, never note or mail content».

## 0.110.0 — 26.10.2026

### Added

- **`memo skill install --for hermes` da la skill a Hermes Agent, y `memo skill status` dice qué lee Hermes (cli-base 0.59.0).** Añade `~/.agents/skills` a `skills.external_dirs` de Hermes mediante `hermes config set`, conservando las carpetas ya listadas, o copia el archivo en la carpeta personal de Hermes cuando eso falla. Sin Hermes instalado falla con `not_found` y no escribe nada. Un `memo skill install` a secas y `--for all` siguen escribiendo solo las copias de Claude Code y de `~/.agents/skills`. `skill status --json` incorpora `hermes` junto a `targets`.
- **Una ejecución iniciada por OpenClaw o Hermes Agent nombra a ese agente (cli-core 0.437.0).** `runs show` da `agent` como `openclaw` para un comando que ejecutó el agente de OpenClaw, con `from_chat: true` cuando lo inició un mensaje de chat; una ejecución de Hermes lleva su sesión, así que una reserva de tarea desde Hermes se mantiene por sesión.
- **La skill `cli-memo` indica a OpenClaw y ClawHub que necesita `memo`, y cómo instalarlo** (`metadata.openclaw`: `requires.bins` y el paquete npm `@wirecat/cli-memo`). Si `memo` no está en el PATH, OpenClaw marca la skill como no lista y ofrece instalar el paquete. Claude Code y Codex ignoran el bloque.

## 0.109.0 — 26.10.2026

### Added

- **`memo search all` encuentra también mensajes por significado, en cuanto puede** (cli-core 0.435.0). Busca los 100 mensajes más cercanos en significado (e5-small sobre el vector propio de cada mensaje, todas las cuentas que lee) y los fusiona con los resultados por palabras en una sola lista de mensajes antes de mezclarla con correo y notas; el `found_by` de cada elemento dice qué búsqueda lo encontró. Sin el modelo o los vectores, los mensajes se leen por palabras como antes y la respuesta lo dice: una nota `Messages by words only: …` en el terminal y una entrada `found_by` en `missing` con `--json` y MCP, que nombra `memo models download e5-small` o el `conversations rebuild` del mensajero. `--exact`, y una consulta con NOT o con un filtro bajo OR o en un grupo, siguen solo por palabras. Una búsqueda nunca descarga un modelo ni envía texto a ningún sitio.

### Changed — may break callers

- **cli-core 0.435.0 pasa el almacén compartido a la versión 34**, que guarda un índice para la búsqueda por significado (sqlite-vec, incluido en `@wirecat/cli-core-sqlite` 1.1.0). Cuando memo, o cualquier CLI de WireCat en cli-core 0.434.0 o posterior, ha abierto el almacén, memo 0.108 y anteriores lo rechazan y piden actualizarse, así que actualice todas las CLI de WireCat a la vez.

## 0.108.0 — 25.10.2026

### Fixed

- El correo se analiza con postal-mime 4.1.4, que corrige cómo se leen algunos mensajes mal formados: un bloque de cabeceras termina en la primera línea que no es ni un campo ni su continuación, un mensaje adjunto en base64 o quoted-printable sigue siendo un adjunto, y solo se respetan las etiquetas de juego de caracteres UTF-16 reales. Al volver a importar un mensaje así, el texto guardado puede cambiar ligeramente.
- **`memo --version` sin nada más responde antes de cargar el programa**: unos 50 archivos de módulos en lugar de 1.050 (`cli/start` de cli-core). `--version` con cualquier otra cosa en la línea pasa por el programa como antes.

## 0.107.0 — 25.10.2026

### Security

- **`memo doctor` informa de los archivos y carpetas que otros usuarios pueden leer, con el `chmod` que corrige cada uno.** `files` en `memo doctor --json` es `{ checked, ok, problems }`, cada problema `{ path, mode, want }`, la forma que usa el doctor de cada herramienta de WireCat: el archivo de ajustes y el almacén con sus archivos `-wal` y `-shm` piden `0600`; la carpeta de ajustes, la carpeta de registros de ejecución y la carpeta del almacén (salvo que `MESSAGING_STORE` indique el almacén) piden `0700`. Con `--json` la corrección va a stderr como `to make it private: chmod 600 '<path>'`; la salida de texto la enumera con los demás problemas. No se cambia nada en el disco, y estos problemas no afectan al código de salida, igual que los problemas de ajustes. Windows no se revisa: `files` es `{ checked: false, reason }`.
- **Cada cambio que memo guarda en `config.json` lo deja solo para el propietario (`0600`)** (cli-base 0.57.0). Un archivo que otros usuarios podían leer, como lo dejaba `config set` en versiones anteriores, se vuelve privado en el siguiente guardado.

## 0.106.0 — 25.10.2026

### Changed — may break callers

- **El registro de ejecuciones viene de cli-core 0.430.0** (`recordRuns`) en lugar de la copia propia de memo. Las ejecuciones se guardan como antes —cada comando fallido, incluido un error de uso antes de cualquier comando; uno correcto con `--record` o `record: true`; ninguno con `--no-record`— y las llamadas a Himalaya y RDAP se registran como antes. Una ejecución ahora omite `profile` en `runs list` y `runs show` en vez de `""`, ya que memo no tiene perfiles.

## 0.105.0 — 25.10.2026

### Added

- **Una ejecución fallida dice qué salió mal** (cli-core 0.425.0): `memo runs list` y `memo runs show` añaden `error`, con su clase, código, motivo, mensaje enmascarado y una pila corta.
- `memo store info` describe el almacén compartido: dónde está, su esquema frente al que lee memo (`schema.reason`, y `schema.upgrade`: a qué lo llevará la próxima ejecución de memo) y qué herramientas lo usaron. Abre el almacén solo para lectura, así WireCat Desktop puede saber si memo puede leer el almacén.
- **`memo skill status` indica, para cada agente, si el SKILL.md instalado coincide con esta versión**, y `memo skill show --for claude|agents` imprime la copia instalada allí (cli-base 0.56). `memo skill show`, `skill install` y `skill status` aceptan `--json`, como los de tg: memo no tiene `--json` global, así que cada comando del skill tiene el suyo.

### Fixed

- **Las herramientas MCP describen los comandos propios de memo, no los de un servicio de mensajería.** `memo_tools_search` ofrece «list», «show», «change a setting» en lugar de «unread», «send message», «chat members»; `memo_write` dice «creates, edits, deletes» en lugar de «sends, edits, deletes, joins»; el comando de ejemplo de `memo_read` y `memo_write` es `notes list`, no `messages list`, que memo no tiene; y el texto de la respuesta es «names, titles, what people wrote» (cli-core 0.426.0).
- **La ayuda ya no dice «Availability: available for this profile»**, ya que memo no tiene perfiles; un comando que no puede ejecutarse sigue diciendo por qué. `memo --help` dice que zm y drive son «searchable with your other WireCat data».
- MCP ya no ofrece un grupo de comandos que solo imprime su ayuda, como `models`; sus comandos se siguen ofreciendo uno a uno.
- Los pasos de las guías person-brief y decision-trail para tg, max, zm y drive nombran el perfil, como esos comandos requieren: `tg personal contacts context Kai`.

## 0.104.0 — 25.10.2026

### Added

- **`memo doctor --json` enumera cada problema del archivo de ajustes como `config.issues`**, con la forma que usa el doctor de cada herramienta de WireCat: `{ kind, file, key?, line?, column?, what, fix? }`, con `kind` uno de `invalid_json`, `unknown_setting`, `unknown_permission`, `missing_setting` o `invalid_value`. `what` dice qué tiene que ser un valor y nunca cita el valor guardado; `fix` es un `memo config unset <key>` que funciona tal cual, y se omite para JSON no válido, donde `line` y `column` indican dónde se detuvo el análisis. Doctor sigue respondiendo con un archivo roto, diagnostica el resto a partir de lo que todavía carga del archivo, y los problemas de ajustes por sí solos dejan su código de salida en 0. La salida de texto los enumera con los demás problemas.
- **`memo config unset <key>` elimina un ajuste por su ruta con puntos** (`mail.accounts.0.colour`, `permissions.notes.edit`), incluso uno que memo no conoce y en un archivo con otros problemas, así que cada corrección que imprime doctor funciona. No se ofrece por MCP, donde podría eliminar un permiso guardado que el servidor aplica.
- **memo guarda registros de ejecución, como tg, max y wa.** Un comando que falla se guarda como ejecución: sus palabras (nunca sus argumentos), cómo terminó, su código de error y cada llamada a Himalaya (`himalaya.envelope.list`, estado de salida, duración) y consulta RDAP (`rdap.domain`, estado HTTP) que hizo; nunca una nota, una dirección, un asunto, una carpeta ni un dominio. `memo runs list [query] --limit --page --json`, `memo runs show <run-id> --json` y `memo runs path <run-id>` los leen; la página Logs de WireCat Desktop lee `memo runs list … --json`. `--record` guarda una ejecución correcta, `--no-record` no guarda ninguna; `record` y `keep_runs_for_days` (30 por defecto) en el archivo de ajustes fijan ambos para todos los comandos. Una llamada de herramienta de un agente se guarda como `mcp <command>`.

### Changed — may break callers

- **`config.exists` de `memo doctor --json` ahora es `config.found`**, junto al nuevo `config.issues`.
- **Un archivo de ajustes con problemas se rechaza con el primer problema, su corrección y cuántos más enumera `memo doctor`**: "<file>: setting default_profile is not a setting of memo — remove it with \`memo config unset default_profile\` (and 2 more problems — \`memo doctor\` lists them all)". Antes, el rechazo solo nombraba la primera clave y un motivo fijo.
- **Los nombres antiguos de comandos ya no se reconocen como claves de permisos.** Un permiso guardado o una clave de `--permission` de una ruta de comando retirada (`auto.start`, `mail.trash`, `note` y el resto) recibe la misma respuesta que cualquier clave que no nombra un comando: `memo mcp` se niega a arrancar y nombra el `memo config unset` que elimina una guardada, o `--permission <key> names no command`, sin indicar un reemplazo. Cualquier otra clave de permiso desconocida se rechaza igual; antes se ignoraba.
- **Se elimina `memo sync --account`.** Indica los buzones con `--source email:<account>`.
- **Usa cli-core 0.423.0.** Con él, `--source obsidian:<id>` y `--source local:<id>` nombran una carpeta de notas; antes no encontraban ninguna cuenta.

### Fixed

- **La ayuda de memo describe los comandos propios de memo.** La primera pantalla apunta a `answers create "…" --all` (no hay comando `ask`). Las instrucciones del servidor MCP abren un correo con `messages show`, no con un `mail show` que memo no tiene. `search messages` y `search mail` describen `--brief` y `--full` para un mensaje o un correo, y `--full` indica que JSON sigue dando el extracto. Los ejemplos de reuniones nombran una cuenta de reuniones real (`zoom:me@example.com`). Los ejemplos de `mail delete`, `mail restore` y `mail rules apply` son simulaciones, y `upgrade` muestra solo `--check`. memo le indica a cli-core que no es un servicio de mensajería (`AppIdentity.messenger: false`). El `minCompatible` del almacén no cambia.

### Removed

- **`search all` y `search notes` ya no aceptan `--brief` ni `--full`.** Ambas opciones se aceptaban y luego se ignoraban. Una llamada que pasa una ahora falla con una opción desconocida.
- Los anclajes de nombres de comandos retirados en `docs/commands.md` y la tabla de nombres retirados de herramientas MCP en `docs/mcp.md`.

## 0.103.0 — 25.10.2026

### Changed — may break callers

- **memo trabaja con el almacén compartido de cli-core 0.420.0, que lo lleva por las versiones 30 a 33.** Las carpetas de notas ahora son cuentas del proveedor `obsidian` o `local`: `--account obsidian:<id>` y `local:<id>` nombran una, y `folder:<id>` también. Los documentos de Google Drive están en la cuenta `google-drive` de drive en lugar de en una carpeta sustituta; `memo folders list` sigue marcándola «kept by drive», `memo folders update` sigue rechazándola, `search all` la nombra entre las cuentas que leyó y `notes:<id>` la nombra como fuente. `vocabulary inspect` ahora responde `coverage.apply_supported: true`, el valor de cli-core: cli-core puede aplicar la vista previa, memo no tiene ningún comando que lo haga. Cuando este memo ha migrado el almacén, un memo anterior, y cualquier CLI con un cli-core anterior, lo rechaza y pide actualizar.

## 0.102.0 — 25.10.2026

Solo cambió el número de versión respecto a 0.101.0.

## 0.101.0 — 25.10.2026

### Added

- **`memo projects evidence` lee por defecto a los miembros confirmados del proyecto.** De cada persona confirmada como miembro del proyecto (`memo relationships add person:<id> project:<id>`) ahora se lee lo que escribieron sus identidades guardadas, como hace `--contact person:<id>`, sin nombrarla; antes, un miembro que nunca escribió el nombre del proyecto faltaba en el resultado y en `people`. Los miembros sugeridos no se leen, y una persona pasada también con `--contact` se lee una vez. Los alias de los miembros no se buscan. Como máximo corren 16 líneas en total, así que los miembros que no caben aparecen como no leídos (`member`, `member-limit`) en un orden fijo, nunca se descartan en silencio. MCP `project_evidence` devuelve lo mismo.

## 0.100.0 — 25.10.2026

### Added

- **`memo projects evidence` dice quién participa.** El resultado tiene `people`: quién escribió los mensajes y correos de la ejecución, persona por persona a partir de tus contactos guardados, con cuántos elementos escribió cada una. Las cuentas vinculadas de una persona en varios servicios de mensajería y en el correo cuentan como una; tus propios mensajes quedan fuera; como máximo 20 personas, `people_omitted` cuenta el resto. Nunca adivina a partir de los nombres en el texto. La salida de texto añade una línea «people who wrote these». MCP `project_evidence` devuelve lo mismo. Usa cli-core 0.418.0, que también trae la corrección de 0.417.0: `--discover` trata un «?» al final de una pregunta como puntuación.

## 0.99.0 — 25.10.2026

### Added

- Cada vez que memo abre el almacén compartido para escribir, le dice a cli-core su nombre y su versión. Cuando otro CLI de WireCat (tg, max) actualiza el almacén de una forma que deja fuera a los CLI anteriores, ahora puede nombrar a memo y decir que se ejecute `memo upgrade`, en lugar de una línea genérica.

## 0.98.0 — 25.10.2026

### Fixed

- **`memo projects evidence --cursor` vacía un chat vinculado activo a toda velocidad cuando los demás chats han terminado.** La parte de los elementos de una ejecución que toca a un chat ahora cuenta solo los chats vinculados que todavía tienen algo que leer, así que en un proyecto con diez chats vinculados el último chat activo necesita unas 10 ejecuciones en lugar de unas 45. Usa cli-core 0.416.0 y cli-base 0.53.0.

## 0.97.0 — 25.10.2026

### Added

- `memo mcp --http --public-url <https-origin>` ofrece las mismas tres herramientas MCP a través del transporte HTTP autenticado de cli-core, en el puerto local 8767 por defecto. El inicio de sesión OAuth compartido con código de acceso, el hash de los tokens y `--revoke` funcionan con los mismos permisos por llamada y las restricciones más estrictas del servidor que stdio. `--port` elige otro puerto local; las opciones solo para HTTP sin `--http` se rechazan. La guía de conexión remota explica los túneles, el inicio de sesión de la app y la revocación.

### Fixed

- Crear una nota por MCP pasa el texto una sola vez a través del ejecutor generado de Core, en vez de pasarlo como argumento posicional y como `--text`. La corrección compartida se aplica a stdio y a HTTP.

## 0.96.0 — 25.10.2026

### Changed — may break callers

- `mail rules list <account> protected:true` sustituye a `--filter is:protected`. La opción eliminada no tiene alias.

### Added

- Las listas de organizaciones, proyectos, recordatorios, documentos clave, reglas de correo y ejecuciones de limpieza declaran consultas derivadas del esquema y seleccionan los registros en sus lectores nativos antes de los límites de la lista.
- **`memo search people <name>` encuentra a una persona en todas las cuentas.** Busca por el nombre, el usuario o tu
  alias, sin importar mayúsculas ni acentos, también en cirílico, y da el `person:<id>` que acepta
  `memo projects evidence --contact`, con cada identidad. `--source` limita las cuentas; la respuesta nombra
  las que leyó.
- **`memo projects evidence` lee solo una parte de cada chat vinculado por ejecución.** Un chat con mucha actividad ya no
  llena la ejecución: cada chat vinculado da como máximo su parte del límite de elementos (50 para un solo chat con el
  límite por defecto de 100, 20 de cada uno a partir de cuatro chats), la salida nombra los chats recortados y `--cursor`
  lee el resto. Las entradas JSON de `linked_chats` ganan `items` y `capped`. Requiere cli-core 0.413.0.

## 0.94.0 — 24.10.2026

### Changed — may break callers

- **Los contratos de comandos compartidos exigen sustituciones explícitas en el código fuente.** El descubrimiento incluye esquemas, motivos declarados y las diferencias exactas de antes y después. Las etiquetas de tema guardadas de las reuniones usan `--topic-name` en la CLI y `topic_name` en las continuaciones de MCP.

### Added

- **`memo context` muestra los archivos de Google Drive de la persona.** Los archivos que posee o que editó por última vez aparecen en «Files, as Google reports», con el enlace de Google y la hora de edición que indica Google. Los vínculos que adivinó un programa siguen esperando tu revisión.
- **`models list` y las descargas verificadas usan el catálogo de Core.** La selección de modelos es una consulta nativa, y `models download --offline` se niega antes de cualquier trabajo de red. Las actualizaciones de tareas de proyecto conservan los campos de prioridad y tarea padre; las tareas de fuentes conservan su tratamiento explícito de cuenta y responsables.

### Security

- **La resolución de dependencias excluye las versiones vulnerables de Zod, Vite y postal-mime.** Las comprobaciones de publicación rechazan los fallos graves de producción en las resoluciones bloqueadas y en las nuevas.

## 0.93.0 — 24.10.2026

### Changed — may break callers

- **MCP uses cli-core's discovery/read/write tools.** Reconnect saved clients, find commands with
  `memo_tools_search`, and run CLI paths with `memo_read` or `memo_write`. Individual tool names are removed.
  Command input and execution come from the CLI, including snake_case options, permission rechecks and
  read locks. Discovery retains denied commands with their current availability and reason. Search inputs use `query`; `facts add` uses `statement`. The MCP guide maps saved calls to
  their replacements. Cited meeting/project proposals keep their inline JSON `input`; annotation checks
  take the existing snapshot and bindings file paths used by the CLI.
- **Account selection uses only canonical flags.** Reads use `--source`; account-scoped writes use explicit
  `--account provider:account`. Retired `--provider` and read-side `--account` flags are refused before the command runs.

- **Commands use the shared vocabulary without aliases.** Rename saved calls and permission keys:

  | Previous command | Current command |
  |---|---|
  | `agents log` | `agents list` |
  | `auto start/stop/status` | `jobs start/stop/status` |
  | `ask` | `answers create` |
  | `note <identity> [path]`, `note --clear` | `notes links show/add/clear` |
  | `folders attach` | `folders update` |
  | `mail trash` | `mail delete` |
  | `mail runs` | `mail runs list` |
  | `mail rules import-filters` | `mail rules import --format gmail` |
  | `memories stale` | `memories invalidate` |
  | `relationships suggest` | `relationships scan` |
  | `reminders poll`, `reminders ack` | `reminders claim`, `reminders acknowledge` |
  | `tasks relations` | `tasks links` |

  Moved permission keys stop with `configuration_error` naming the replacement, so saved denials cannot
  silently stop applying. Note links have separate read and write commands with standard JSON answers.
  Meeting searches select tags/topics with native `tag:` and `topic:` query terms; the old `--tag` and
  `--topic` flags are removed. Memo rules imports keep their existing default format and behavior.
- **Agent facts require cited evidence through both CLI and MCP.** The owner may still record an uncited
  fact; proposed agent facts cannot bypass the evidence requirement by using the command runner.

### Added

- **`projects annotations show` reads selected annotations without creating a file**, through the same
  snapshot service as export. It remains available under the read lock.

### Fixed

- **Supported commands remain discoverable with current availability and a reason**, including under the
  read lock. Calls enforce the current permissions. CLI help and discovery also show the read lock.
  Uses published cli-core 0.410.0 and cli-base 0.50.4.

## 0.92.0 — 24.10.2026

### Changed — may break callers

- **Commands use cli-core 0.406.0's canonical names, with no aliases.** `tasks plan` is now part of
  `tasks update`: one command sets the title and description of any task, `--due` and `--remind-time`, priority
  and parent for a project task, and category and assignee for a task from a source, which names its `--account`.
  `tasks update` is refused under `MEMO_READ_ONLY`, so a read-only agent no longer sets due dates or categories.
  `models text download` is `models download`. The MCP tools follow: `tasks_plan` and `models_text_download` are
  gone. Shared commands use cli-core's new names, and a saved permission key with an old path, such as
  `tasks.plan`, stops with `configuration_error` naming its replacement.

## 0.91.0 — 24.10.2026

### Added

- **The agent skill asks for two or three searches in other words before reporting no answer**, covering
  paraphrases and language changes without a separate query-expansion model.

- **Meeting search exposes every shared selector**, including meeting/person/identity/event/series ids,
  tags and topics. The guide explains Memo's explicit stored-account scope and why calendar verification
  and zm's extra semantic-search flags differ.

- **`memo mail add <account> <address>` checks the explicit Himalaya account and matching configured email**
  before saving it. `mail check <account>` repeats the local checks; neither command chooses a default account
  or opens the mailbox. Use `--kind imap` and repeated `--folder` for other IMAP providers.

- **`memo models text download <model>` downloads and checks the shared search model**, through cli-core's
  downloader. Sync, search and setup instructions now point to `memo models text download e5-small`.

- **MCP exposes the command tree, including writes**, with generated command names alongside all 37 existing
  tools. Open cited notes with `notes_show`, stored messages and emails with `messages_show`, and tags with `tags_list`.
  Source-folder and mail-rule changes need `mcp.authority` (denied by default). Meeting findings decisions
  and selected annotation restore each need their own explicit permission. `agent_decisions` still applies.
- **Saved dotted `permissions` and `mcp --permission key=level` limit tools.** Server overrides can only tighten
  saved levels; locks and permissions are checked before every call. `MEMO_READ_ONLY` removes writing tools.

### Fixed

- **The shared mail-import hint names `--only mail`**, included with cli-core 0.404.0.
- **cli-base is pinned at 0.50.3**, matching cli-core's required vocabulary. MCP server/client are pinned at 2.3.0.
- **Install instructions name npm 11.17's `allowScripts` warning and npm 12's blocked scripts**, explain the
  package-specific approval command, and keep `memo skill install --for all` explicit.
- **The introduction describes file writes accurately:** `notes edit` can change a source note, `notes export`
  writes files, and explicit Gmail Trash and restore commands need `--yes`.

## 0.90.0 — 24.10.2026

### Added

- **The first command at a terminal asks three questions once for every WireCat tool** (cli-core 0.404.0): which
  languages you write and speak, which other WireCat tools to install, and whether commands and agents may only read.
  Answered in any tool, they hold in all of them; "read only" stops every `memo` change, as `MEMO_READ_ONLY` does.
  `tg setup`, `max setup` or `wa setup` asks again. Agents, `--json`, `--no-input`, `CI` and `MEMO_READ_ONLY` are
  never asked.

### Fixed

- **The introduction shows the current notes-search output and names all six WireCat tools.** The example
  uses fictional notes and explains the diagnostic when the local meaning model is missing.

## 0.89.0 — 22.10.2026

### Added

- **`sync`, `mail inspect`, `mail trash`, `mail rules apply` and `projects evidence` name the zone they read a
  date in and give the window in UTC.** In `--json` (and over MCP for `project_evidence`), `meta.timezone` appears
  when `--since-time` was a date without a zone, and `meta.window.since` is the start it used.
  `projects evidence` also gives `meta.window.until`, its exclusive end.

### Fixed

- **An mbox email whose only date is a `Date:` header without a zone is refused**, instead of being read in this
  computer's zone without a word. A `From ` line date without a zone is still UTC, as the mbox format defines it.

## 0.88.0 — 22.10.2026

### Added

- **`search meetings --json` names the zone it read a date in and gives the window in UTC.** `meta.timezone` appears
  when `--since-time` or `--until-time` had no zone, and `meta.window` holds the `since`/`until` bounds it used. The
  MCP tool `search_meetings` gives only `meta.window`, since its times always carry a zone. cli-core 0.384.0 and
  cli-base 0.49.0.

### Fixed

- **A store the pre-rename `cli-messaging` wrote is refused again, and left untouched** (cli-core 0.385.0). Since
  cli-core 0.382.0 such a file was opened and failed with `internal_error`; it now fails with `configuration_error`.

## 0.87.0 — 21.10.2026

### Changed — may break callers

- **A date you type covers your whole local day, and a time without a zone is read in your computer's zone.**
  `mail inspect`, `mail trash`, `mail rules apply` and `sync` `--since-time`, and `projects gather --since-time`, read
  `2026-09-01` as midnight UTC and `2026-09-01T10:00` in whatever zone the process ran in. They now start at local
  midnight of the computer's zone (cli-core 0.379.0, cli-base `WC-TIME-3`/`WC-TIME-5`). What to watch for: a window
  given as a date alone now starts a few hours earlier or later than before, by your offset from UTC.
- **`reminders add --timezone` defaults to the computer's zone, not UTC.** The reminder's time is unchanged; only the
  zone kept with it is.
- **A mail rule's `decided_at` without a zone is read in the computer's zone** when rules are imported; a date alone
  was UTC midnight.
- **cli-core 0.379.0 and cli-base 0.48.0**; the shared CI runs the tests in `Asia/Vladivostok`.

## 0.86.0 — 21.10.2026

### Fixed

- **`memo projects evidence --contact person:<id>` found nothing for a person with a messenger display name.** It
  searched the stored name as words, and a name such as «Степа Stefan Grachev AVITO M A» is spelled out in no
  message. It now reads every message and mail the person's stored identities wrote in `--source`, labelled
  `sender` (`[sent by contact]` in text), and searches only the aliases you gave them; a person with neither is
  refused. A literal `--contact "<name>"` is searched as before.

## 0.85.0 — 21.10.2026

### Fixed

- **`memo projects evidence` no longer fails on a project with a confirmed meeting link.** Reading linked chats
  parsed every confirmed member-of link as a reference and stopped at `meeting:…` with `input.invalid`; it now skips
  links that are not chats. Broken in 0.84.0.

## 0.84.0 — 20.10.2026

### Added

- **`memo projects evidence` reads the project's linked chats** (MCP `project_evidence` too, on by default). Every
  message of a chat confirmed as the project's is read, at most 16 chats, oldest link first, when `--source` holds
  the chat's account. Those items have `context: "linked-chat"` (text output `[linked chat]`): they name nothing.
  A suggested link is not read. A linked chat outside `--source`, or past the 16th, is listed in `unread_sources`
  with `kind: "linked-chat"` and `reason` `out-of-scope` or `linked-chat-limit`. The result also carries
  `linked_chats` with each chat's state.
- **`memo relationships add chat:<provider>/<account>/<chat> project:<id>`** makes a chat a project's
  (`member-of` only). The reference names the chat's account, so no account is chosen for you. An agent's link
  waits for the owner's `memo relationships confirm`.

### Changed — may break callers

- Needs `@wirecat/cli-core` 0.377.0. A project evidence lane's `query` is `null` for a linked chat; its `chat`
  holds the chat reference.

### Fixed

- **A document hit's `around` is centred on the first paragraph that names a searched word**, in document order,
  not on the paragraph the first lane found. A document item also carries `moreMatches`: how many later paragraphs
  name a searched word too (`@wirecat/cli-core` 0.377.0).
- **`projects evidence` help no longer says "literal search".** Each name, alias, `--context-query` and
  `--contact` is a search where every word must appear in one text, in any order, as whole words; it is not a
  phrase search.

## 0.83.0 — 20.10.2026

### Added

- `memo projects evidence --contact person:<id>` (MCP `project_evidence` `contact`) searches the person's stored name and
  keeps the `person:<id>` reference on the lane; an unknown id is refused with `not_found` instead of searched as text,
  and a person with no stored name is refused with `validation_error` rather than searched under an identity's name.
- **`projects annotations export|check|restore`** retains selected project aliases, facts and generic
  links, with explicit external bindings and historical state. Export writes a new private file from
  read-only source access; preview checks an existing explicit target; owner-only restore requires its
  exact fingerprint and refuses populated/conflicting targets. Notes, meeting memberships, tasks,
  memories, labels and findings remain omitted, so this selected format is not a full project backup.
- **`project_annotations_snapshot` and `project_annotations_preview` MCP tools** read the same bounded
  selected graph and destination conflicts. Restore is not exposed through MCP. Calls keep the normal
  audit record, and schema, file reading, reference policy and transactions come from shared Core.

### Fixed

- MCP connection instructions distinguish direct proposed records, configurable project decisions and
  owner-only meeting findings and annotation restoration.
- Guides consistently distinguish proposed memories and direct facts from project proposals that an
  agent can decide with a recorded reason, and explain the owner decision setting and meeting boundary.
- **`sync --retry-attachments` help no longer says to install an extraction engine.** The PDF and Word
  readers ship with memo; the option is for attachments an older memo or a broken install left unread.

## 0.82.0 — 20.10.2026

### Fixed

- The MCP guide describes project-decision permissions and the accepted facts and numbered tasks that
  confirming a proposal can create, alongside the owner-only review of meeting findings.
- Key-document suggestions report `state: "untracked"` because no source fingerprint was saved with
  the suggestion. They no longer incorrectly report unchanged text; reread the document before deciding.
- **Project proposal review includes document paragraphs**, using the shared Core passage helper around
  the finding's words. `projects actions list`, its MCP counterpart and key-document review now show this
  context; `--brief` or zero before/after counts still omit it. The guides also explain oversized evidence
  and accepting unchanged findings from a partly stale batch.

## 0.81.0 — 20.10.2026

### Fixed

- **The `person-brief` and `decision-trail` scenario titles start with a capital**, like every other scenario:
  "One person across every tool", "What did we decide about X, across every source". tg, max, zm and drive list
  them under "Works with" from the same text in cli-core 0.370.0, and memo's tests hold its files to it.

## 0.80.0 — 20.10.2026

### Fixed

- **`memo projects evidence` reads a large document once**, not once per search that matches it: a 95 KB document
  matched by five searches charged about 476 KB of the read budget. Needs `@wirecat/cli-core` 0.369.0.

## 0.79.0 — 20.10.2026

### Added

- **`memo projects evidence` gives a document hit the paragraphs around it** and lists a document too large to
  read under `oversized` (text: "too large to read here"), with its reference to open by `memo notes show`.

### Fixed

- **`memo projects evidence` no longer stalls on large documents.** A large document no longer leaves its search
  read-limited, with every `--cursor` continuation retrying the same page and charging the read budget again. Needs `@wirecat/cli-core` 0.367.0.
- **`memo projects actions confirm` accepts the findings whose own cited text is unchanged**, even when another
  finding in the batch cites a changed text; before, the whole batch had to be staged again.
- Guides describe incomplete search results and local record/file export effects without promising
  complete retrieval or unchanged files.
- Guides explain gathering project evidence, reviewing proposed facts and follow-ups, and the
  `agent_decisions` setting, with the separate review path for meeting transcript findings.

## 0.78.0 — 19.10.2026

### Fixed

- **A proposed findings batch whose cited text changed can be rejected** with `memo projects actions reject`; before,
  it could be neither confirmed nor rejected and stayed in the list. Needs `@wirecat/cli-core` 0.365.0.

### Added

- **`memo projects actions` — an agent's proposals for a project, with the evidence to decide them.** `add` stages
  cited facts and follow-ups (references and fingerprints from `projects evidence`; a changed text refuses as
  stale). `list` pages through suggested key documents and findings batches, each cited text shown with whether it
  changed, the text and the messages around it (`--brief` drops them, `--before-n`/`--after-n`). `confirm` creates
  the named findings or confirms a key document, `reject` turns them down. An agent in your terminal, or over MCP
  (`project_actions_*`), decides for you only with `--reason`, kept with the decision; set `agent_decisions: false`
  in the config to keep every decision yours. `projects key-documents list` items carry their `id`. Needs
  `@wirecat/cli-core` 0.363.0.

## 0.77.0 — 19.10.2026

### Added

- **Repeat a project-evidence time window** with `--before-time` (MCP `before_time`), an ISO timestamp with a UTC
  offset used as the exclusive end. Days back are counted from that instant; explicit start dates also
  keep that end. Text output prints the exact cutoff. Reusing a cutoff does not freeze archive contents,
  registered aliases or account scope.

### Fixed

- **Project evidence documentation** distinguishes local search-index catch-up from creating facts,
  tasks or project links; it no longer claims that every evidence call writes nothing.

## 0.76.0 — 19.10.2026

### Added

- **Project evidence includes stored meeting transcripts** when `--source` selects a meeting account,
  its recorded profile or `all`. CLI and MCP return cited transcript cue references dated by the meeting
  start. Superseded/deleted transcripts stay out; missing or pending indexes remain visible. This reads
  existing indexed text and does not fetch recordings or confirm project membership.
- **Shared SDK update:** pins Core 0.358.0 for transcript context reads, retaining Base 0.47.1.
  The store schema and compatibility boundary are unchanged. Intervening messenger chat-membership
  contract changes require no Memo adapter changes; shared consumer compatibility remains checked.

### Fixed

- **A failed timer run no longer keeps its error text in `last.json`** (privacy). That text can name a folder, a
  sender or a subject, and it reached the file, the "scheduled sync failing" line and `memo auto status`. They now
  keep the error code, its reason id and the kind of source (`notes: configuration_error (folder.unbound)`); the
  full message stays on stderr and in the timer's journal, which `memo auto status` names (`log`).
- **A failing source in `memo sync --json` names its reason id** (`failed[].reason_id`, additive), the fixed id
  that `last.json` and `memo auto status` now show beside the error code, as a run that stopped already did.

## 0.75.0 — 19.10.2026

### Added

- **`memo projects evidence` names the other projects, tags and topics its texts mention** (`mentions`, and an
  "also names" line in the text): words found in the excerpts and their context, each cited, never membership. A
  mail hit now shows the emails before and after it in its thread as context.

## 0.74.0 — 19.10.2026

### Added

- **`memo projects evidence` indexes new mail and imported documents for search before it reads**, so a store
  just synced no longer misses them; `--no-catch-up` (MCP `catch_up: false`) reads the index as it is. The
  project's key is searched too, and `--alias` (MCP `alias`) adds more names. The text output says when the index
  could not be brought up to date. `--since-time` also takes a start date (`2026-09-01`); a continued run keeps its end. Each message hit shows the messages next to it in its
  chat as context (`--before-n`, `--after-n`, default 2, MCP `before_n`/`after_n`), never as more hits.

## 0.73.0 — 19.10.2026

### Changed — may break callers

- **`npm install -g` installs the agent skill only when asked.** It wrote the skill into `~/.claude/skills` and
  `~/.agents/skills` by default, and npm hides a lifecycle script's output, so nobody was told. Now
  `MEMO_INSTALL_AGENT=all` (or an agent's name) installs it at install time; otherwise run
  `memo skill install --for all`.
- **`memo commands` without `--json` prints the commands as text, by section** (Read, Write, Organise, Automate,
  Set up), one line each with `(writes)` on a command that changes something, instead of the JSON document. A
  path lists one group: `memo commands mail rules`. `memo commands --json` is unchanged, contract 4.
- **A bare `memo`, or a group without its command (`memo tags`), exits 2 instead of 1**, as the other WireCat tools
  do: it prints the first screen or the group's help, and a missing command is a usage mistake.
- **Adopt Core 0.348.0 and Base 0.47.0**, which move together: a next step in `--json` output may carry `line`, the
  whole command to type. Core 0.348.0 changes no store schema from the 0.347.0 tg and max pin. An SDK consumer that
  pins Core or Base beside memo moves with them.

### Added

- **`memo projects evidence <project> --source <accounts|all>` and MCP `project_evidence`: cited references about a
  project** from stored messages, mail and imported notes folders. An existing project brings its name and aliases;
  each name, `--context-query` and `--contact` is its own literal search, and the hits are joined, each with the
  searches that found it. `--since-time` takes days back (default `60d`). An item found only through a person's
  name is marked `person-only`. A source that failed or has no reader yet (your own notes, meetings) is listed,
  never read as empty, and so is one whose new text still waits for the search index. `--limit` and `--max-pages`
  bound a run, and `--cursor` continues a stopped one with the same window. Nothing is written.

### Fixed

- **`--help` works on the 13 commands that take a query**: `notes list`, `folders list`, `tags list`, `tasks list`,
  `tasks agenda`, `projects meetings list`, `relationships list`, `vocabulary list`, `memories list`, `facts list`,
  `meetings actions list`, `actions list` and `agents log` exited 2 on `--help` as an unknown option (Core 0.347.0). A test now runs `--help`
  on every command.
- **A search that skips meaning for a missing model names the tools that download it** (tg, max or wa), from Core
  itself; memo no longer rewrites a `tg models text download` hint it was handed.
- **`memo commands | head` no longer crashes** with an unhandled `EPIPE` when the reader stops early; memo ignores
  the closed pipe, as the tools built on Core do.

## 0.72.0 — 18.10.2026

### Changed — may break callers

- **`memo --help` and a bare `memo` show a short first screen instead of every command**: what memo is for, eight
  things it does, the other WireCat tools, and where to go next (`memo commands`, `memo guide`, `memo help options`,
  `memo skill show`). A script that read a command or an option from the root help reads `memo --help-all`, which
  prints the old help, or `memo help options`.
- **A command's `--help` ends with Returns, Next usually and Example** in place of its Examples block, worked out
  from the command's definition. `docs/commands.md` shows the same lines.
- **A list command refuses an unknown `--option` before it reads anything**, with commander's message
  (`unknown option '--project'`). `memo tasks list --project HRB` used to answer with a pointer to `project:HRB`.

### Added

- **`memo guide [name]`: scenarios, the commands for a common task in order and why each**, with `--json` for agents.
  `person-brief` gathers one person across tg, MAX, mail, notes, meetings and Drive before a call;
  `decision-trail` finds what was decided about a topic across every source; `start-the-day`, `prepare-meeting` and
  `set-up` stay within memo. Every memo step is checked against the command tree in CI.

### Security

- **`MEMO_READ_ONLY=1` refuses every change with `permission_error` (exit 5)** before the command runs: writes to
  the store and your files, mail trash and restore, the timer, the skill files, `upgrade` and `ask --allow-remote`.
  Reads and `memo sync` still run, and so do `tasks plan` and `tasks link`, which cli-core marks as safe for a
  scheduled agent. `memo mcp` leaves its writing tools out under the lock.

## 0.71.0 — 18.10.2026

### Added

- MCP tools `meeting_actions_add`, `meeting_actions_show` and `meeting_actions_list` stage and inspect
  cited meeting follow-ups for owner review. Exact retries reuse their batch; no confirmation tool is exposed.
- `memo projects context` and MCP `project_context` bring pending key documents, relationships, facts and
  meeting findings together, alongside open numbered tasks. Bounded previews report continuation and source scope.

## 0.70.0 — 18.10.2026

### Changed — may break callers

- **`memo sync --ignore` leaves a file or folder alone for that run.** Notes already imported from it stay in Memo;
  before, the run removed them and the next run imported them again. `notes.ignore` in the config still removes them.

### Fixed

- Project context, key-document commands and search key-document ordering accept an exact project name or alias,
  as meeting searches do. Ambiguous names list candidates; numeric IDs, `project:<id>` and keys still work.
- **`memo sync` reports the files it could not read on every run, also in the text report.** Each folder line counts
  them (`1 not read`) and a line names each file and why, such as a file over 50 MiB or an `.xls`. Before, only the
  first run's `--json` listed them, and the count of notes included them.
- **A notes folder that is gone is a normal error**, `not_found` with the way to fix it, not "this is a bug (ENOENT)".
  `memo doctor` names the same fix in place of a bare `memo folders`.
- `memo notes show` names a link that leads nowhere by its text, in place of an empty entry after a comma.
- The hint for search by meaning gives a command that works without installing tg:
  `npx -y @wirecat/tg-cli local models text download e5-small`.
- The docs: `.doc` files are read and need nothing extra (PDF and Word readers come with Memo); install leads with
  `memo skill install --for all` and explains npm 12's "install scripts blocked"; Himalaya 2.x and its config file;
  the cache folder and `MEMO_AUTO`; plain `memo tasks list` leaves out project tasks; tg and max commands show a
  profile; the README example is real output.

## 0.69.0 — 18.10.2026

### Added

- Prepare a cited packet of stored series history with `memo meetings prepare` or the MCP tool `meeting_prepare`.
  It includes linked people and projects, accepted facts, owner notes and source tasks. You can explicitly add
  a stored messenger profile or mailbox and a literal word query. Memo reports missing history, bounded output
  and continuation cursors; it does not contact a provider or verify the next meeting time.

### Changed — may break callers

- **Commands with no text view of their own print plain lines in place of JSON when `--json` is not given:** one line
  per record for a list (`organizations list`, `projects list`, `reminders list`, `tasks list`…) and `field: value`
  lines for one record (`projects add`, `tasks add`…). A script that read that JSON gets the same data, in the shared
  envelope, with `--json`.

### Fixed

- **A failed mail login no longer holds `memo sync` for a minute.** A read that fails is tried again after 15 s, and
  a refused login or keyring was too, twice per account; with two accounts that took 60 s. It now fails at once.
  A missing himalaya says it is not installed or not on PATH, not `failed (ENOENT): no error text`.
- The README and the installation page give the sizes: the search model is about 135 MB and the install about
  250 MB. The Windows steps say Windows is not tested yet.

## 0.68.0 — 18.10.2026

### Fixed

- **Tasks and reminders work in a store that holds only notes.** A notes folder is an account: `--account` and
  `--source` take it as `notes:<number>` (the `folder_id` search gives) or as the `folder:<id>` Memo's own errors
  show, and `--source notes` names your folder when you have one. Every spelling was refused before, so a task
  could not be made from a note and a reminder needed a mail account. `memo tasks add document:<id>` takes the
  file's folder as its account without `--account`.
- `memo tasks list` and `memo reminders list` without `--source` read every stored account and name them in
  `meta.accounts`, as a search does; they refused before. `memo tasks agenda` still reads one account; the README
  said it covered every account.
- A reminder for a task in a project is refused with the reason: such a task belongs to no account. The message
  said the task was not open. A read given `--account provider:account` is told to use `--source` with that value.

## 0.67.0 — 18.10.2026

### Fixed

- **A store with notes only gets a plain answer from `tasks` and `reminders`.** `tasks list`, `tasks agenda`,
  `reminders list` and `reminders poll` offered a `folder:<id>` value that then failed, and `notes:1` failed with
  "the account is not in the local store". They now list only the accounts that can hold tasks, and with none say
  that a task from a message, email or note, and a reminder, need a tg, max or mail account, and that a project's
  tasks need none.
- `memo search notes` labels a note found by its title as a plain hit, not "(by meaning)".
- `memo tasks list --project SYNT` says to write `memo tasks list project:SYNT`; it failed with a bare syntax error.
- `memo tasks add --project` with an unknown project names `memo projects add`; it pointed to a `vocabulary
  resolve` command that does not exist.
- The README names `vocabulary show` and `vocabulary check`, and the MCP tool `vocabulary_check`; it named
  `resolve` and `preflight`, which do not exist. It links memo's own pages on wirecat.dev, says that search by
  meaning needs tg-cli or max-cli to download the model, and that macOS and Windows are not tested yet.

### Added

- `search meetings` and `meetings passage`, with MCP `search_meetings` and `meeting_passage`, read
  archived meeting evidence through shared Core readers. Explicit source selection, project/label
  aliases, dates and scoped cursors keep searches bounded; MCP also has label, participant, event and
  series selectors. Passages
  include fingerprints for reviewed findings; unknown speakers and archive coverage stay explicit.
  `search all` continues to combine messages, mail and notes.

## 0.66.0 — 18.10.2026

### Added

- `vocabulary inspect <source> <survivor>` and MCP `vocabulary_inspect` preview two explicit tag IDs
  before consolidation. They report assignments, overlaps, aliases, automatic claims and links,
  with bounded samples and a fingerprint of the inspected state. A current unfiltered vocabulary
  fingerprint is required. They merge nothing; coverage names the four inspected dependency tables.

### Fixed

- The README, the MCP page and `memo mcp --help` say what an MCP app can read: your stored messages, mail and notes,
  and a person's context. They said search and context were not served over MCP. Only `memories_add`, `facts_add`
  and `actions_add` write, and what they add waits for you.
- The security page says mail sync looks up sender domain ages by itself, at most once a day, and that Memo asks npm
  once a day for a newer version. It said only `memo mail inspect --domain-age` asked domain registries.

## 0.65.2 — 18.10.2026

### Changed — may break scripts

- **memo's MCP tools name accounts as the CLI does.** `actions_add` takes `account` as `provider:account`
  (`telegram:1`) in place of `provider` and a bare `account`; `search_mail` takes `source` (`email:work`, several
  separated by commas) in place of `account`; `person_context` takes `source` (`telegram:1`) in place of `account`.
  An old argument is refused, as any argument a tool does not take.

## 0.65.1 — 18.10.2026

### Documentation

- The command reference lists `--plain-order` on `memo search mail` and `memo search all`; 0.65.0 shipped it
  without, as the reference had not been generated again.
- The command reference's opening says reads take `--source` and writes take `--account provider:account`; it
  still named `--provider` and `--account`.

## 0.65.0 — 18.10.2026

### Fixed

- **A sync step that fails unexpectedly says why.** The timer's log showed only "the command failed; this is a bug";
  it now adds the error's first line, such as `TypeError: fetch failed`, so a dropped network can be told from a
  real fault. `--debug` still shows the whole message.
- **`memo search mail` fills a page past mail it moves down.** It reads 20 more results than asked, so mail from
  senders with signs of fraud gives its place to the next best result instead of only moving to the end.

## 0.64.0 — 18.10.2026

### Changed — may change search results

- **Mail from senders with signs of fraud comes after the rest of the page** in `memo search mail` and
  `memo search all`: a sender whose fraud signals add up to 3 or more, such as a brand name from another domain or a
  domain under 180 days old. Your own are never moved: a domain you wrote to anyone at, your mailbox's domain, a
  sender a protect rule keeps. `--plain-order` keeps the plain order, to find such mail. The sync log says how many
  senders are ranked lower.

### Changed

- **A read names its accounts with `--source`**, as `memo mentions` and `memo search mail` already do:
  `provider:account` (`telegram:1`, `email:personal`), a provider, a kind or `group:<name>`. `memo tasks list`,
  `memo reminders list`, `memo tags list` and `memo ask` read every account named and say which in
  `meta.accounts`. A read bound to one account (`tasks agenda|show`, `stats tasks show`, `relationships suggest`,
  `context`, `meetings actions list|show`, `projects meetings list`) takes a `--source` that names exactly one.
  `memo sync --source email:work,email:personal` names mailboxes.
- **A write names the one account it acts as with `--account provider:account`**: `memo tasks add|close|plan|link`,
  `memo reminders add|poll|ack|cancel|update`, `memo tags add|remove`, `memo notes add --meeting`,
  `memo actions add`, `memo meetings actions add|confirm|reject`, `memo projects meetings link`. A bare
  `--account 1` without `--provider` is refused. No account, or one that names several, is an error listing the
  choices.

### Deprecated

- `--provider` with a bare `--account` keeps working for one release and prints the new spelling on stderr:
  `--source telegram:1` on a read, `--account telegram:1` on a write. Giving both spellings is an error.
  `memo context --account 1` is `--source telegram:1`; `memo sync --account work` is `--source email:work`.

### Changed — may break scripts

- The `search all` step that lists a hit's tasks carries `args.source` (`telegram:1`) instead of `args.provider`
  and `args.account`; `meetings actions list` and `projects meetings list` name `source` in their page args too.
- `memo ask` takes `--source notes` where it took `--provider notes`.

## 0.63.0 — 17.10.2026

### Changed — may change scores and rules

- **A new domain counts most, and a failed DMARC check only beside another sign of fraud.** `young_domain` adds 5
  (was 3); `dmarc_fail` counts only with `brand_spoof`, `young_domain` or `disposable_domain`, since alone it
  more often marks a real sender's broken setup or a forwarded mail; `reply_to_elsewhere` adds 1 (was 2), as many
  companies answer from a help-desk domain. A `score:` rule can match other senders than before. Every sender is
  scored again on the next sync.
- **Each sync's sender scoring looks up the domain ages it lacks**, for senders you never wrote to and heard from in
  the last two years, so `young_domain` works without running `memo mail inspect --domain-age`. Each lookup tells
  that domain's registry its name.

### Fixed

- **A domain registered again after an email came no longer makes that email's sender young.** The registry gives
  the newest registration, so an old sender whose domain lapsed and was taken by someone else looked new.

## 0.62.0 — 17.10.2026

### Changed

- **cli-core 0.323.0.** An address keeps its city in its value, so the same street in two cities is two places; a
  word of a contact's name counts alone only as a first name or a surname, so a contact named like a company no
  longer turns ordinary words into names; the owner's own accounts belong to the owner. After the upgrade,
  `tg <profile> mentions rebuild person-name place` reads the old texts again.
- memo reads `--source` lists and mention queries through cli-core instead of its own copies.

## 0.61.0 — 17.10.2026

The same code as 0.60.0, published again under a new number. Nothing changed for callers.

## 0.60.0 — 17.10.2026

### Fixed

- **The sync timer no longer stops when a sync takes longer than its interval.** The interval counted from when a
  sync started, so a 6-minute sync on a 5-minute timer left no next run. It now counts from when a sync ends.
  The first sync after updating rewrites the timer.
- **`memo tasks show HRB-12` shows a project's task without `--provider` and `--account`** (cli-core 0.320.0),
  with its evidence links — a task made from reviewed meeting findings, for example. A task of a messenger account
  still needs its account; a bare number is never taken for a project task.
- **memo's MCP tools refuse an argument they do not take**, as every other CLI's tools do: all 22 answer
  `validation_error` (reason `input.invalid`, `param` naming the argument) instead of dropping it, so a misspelled
  filter no longer runs unfiltered. Their advertised input schemas now say `additionalProperties: false`.
- **`memo mcp` is listed as `lifetime: "persistent"`** in `memo commands --json`, like `tg mcp` and `max mcp`: it
  serves until stdin closes. No other command's entry changes.

### Documentation

- **How to read a sender score** in the mail guide: which signals point at a forged sender and which bills share
  with newsletters, and why a platform passing on other names is not a spoof.

### Changed — may break scripts

- **cli-core 0.320.0, the version tg and max pin.** `tasks plan --assignee` names who does a task. Tasks open
  only for questions asked of the owner: every unanswered one in a one-to-one chat, in a group only a reply to the
  owner or a mention.
- **`memo mentions` names what it reads with `--source`, as every WireCat tool does.** `memo mentions list kind:phone
  --source email:personal,email:work`; `--source mail` reads every mailbox and the answer lists them in
  `meta.accounts`; `notes`, `documents` and `group:<name>` work too. The kind argument (`email`, `note`, `document`)
  and `--account` are gone: `memo mentions list email --account personal` is now `--source email:personal`.
  `show`, `confirm` and `reject` take `--source email:<account>` for a mail mention.

### Deprecated

- **`memo search mail --account <account>` is now `--source email:<account>`**, which also takes several mailboxes
  and groups. `--account` still works in this version and prints the new spelling.

## 0.59.0 — 17.10.2026

### Added

- **Mail stored before memo kept Reply-To and Gmail's SPF, DKIM and DMARC verdicts gets them.** Each sync reads
  the header lines of up to 2,000 such emails from Gmail, newest first, until none is left; the text is not read
  again. The sender score then sees these signals on all mail, not only on mail stored since memo began keeping them.

## 0.58.0 — 17.10.2026

### Added

- `memo meetings actions` stages cited meeting facts and project tasks for owner review. Confirmation creates selected records atomically, keeps review receipts and prevents exact retries from duplicating accepted work. Missing dates and assignees stay unknown; stale evidence is refused.
- **Every sender gets its spam score in the store, and search shows it.** Each sync scores the account's senders
  from the stored mail, at most once a day, as `memo mail inspect` scores a group; a hit from a scored sender
  carries `sender_score` (score and signals) in `--json`. Results are not reordered by it. cli-core 0.311.0 (store version 19).
- **`memo mentions list|show|confirm|reject`: phones, e-mail addresses, links, documents, names and street addresses in
  documents, notes and mail.** `memo mentions list note kind:phone`; mail is read only from the accounts named by
  `--account` (repeatable), never every mailbox by default. `show` names the senders of received mail that may own a
  phone or an address (`candidates`), offered and never linked.

## 0.57.0 — 17.10.2026

### Fixed

- **The sender score counts a failed DMARC check only on mail from 2022 on.** Before that, senders often published a
  policy their own mail did not meet yet, so an early failure is no sign of fraud.
- **A broken config file is reported in one line** (cli-core 0.304.0, 0.307.0): the first bad key, a fixed reason
  and a count of the rest, never a value — `config.json: updateCheck is an unknown setting; rename it to
  update_check (and 1 more problem)`. An old camelCase key is named with its new name first.
- **`memo mail status` finishes on a large mailbox** (cli-core 0.307.0): the per-folder count read every email
  again for each one, minutes on a few hundred thousand emails; now seconds.

### Changed — may break scripts

- **The daily "a newer memo exists" line now comes from cli-core, shared with tg and max, and is quieter.** It
  needs stdout to be a terminal as well as stderr: `memo … | less` no longer shows it. Any quiet option written
  with `=` silences it (`--help=…`, `--quiet=…`), not only `--json=…`. `MEMO_AUTO` with any value silences it, not
  only `1`. `--json`, `--jsonl` and `--quiet` silence it anywhere in the command, also after `--`. `--jsonl` is new
  among them.
- cli-core 0.307.0.

## 0.56.0 — 17.10.2026

### Fixed

- **The sender score in `memo mail inspect` no longer flags LinkedIn, Coursera, Quora or Dropbox Sign as brand
  spoofs, nor senders whose DMARC failed only because they signed for another domain.** "Google via LinkedIn" from
  LinkedIn's own domain is LinkedIn passing a page on; Coursera and Quora name courses and spaces after companies;
  hellosign, dropboxmail, onedrive and microsoftadvertising are the brands' own domains. A DMARC failure counts only
  without a valid DKIM signature, and not for a sender that passes DMARC on other mail.

### Documentation

- Distinguish read-only imports from explicit Gmail cleanup and restore throughout the guides and README.

## 0.55.0 — 17.10.2026

### Fixed

- **Import, `memo mail inspect` and `memo mail rules apply` find Gmail's All Mail by its role**, as cleanup already
  did: Gmail names it in the account's language (`[Gmail]/Todos` in Spanish), so an account not in English failed
  with a missing folder. A `folders` list in the config still wins.

## 0.54.0 — 16.10.2026

### Changed — may break scripts

- **`memo search notes` takes the note's source in the query: `'budget source:internal'`, not `--type internal`.**
  `source:file` keeps the notes from folders. `--type` is gone, with no alias. The field is named `source:` as in
  `memo notes list` and the note's `source` in `--json`. It works under OR and NOT and in `--filter` too. The
  `--source notes:<folder id>` option still chooses which folders are read. 0.53.0 on npm still has `--type`: it was
  published before this change.
- cli-core 0.303.0.

### Fixed

- **`bin/release` restarts itself once when the release brings a newer `bin/release`**: folding the changelog and
  raising the version both fast-forward `main`, and the shell went on reading the old script from the byte it had
  reached, so the rest of the run was a mix of old and new text. It now starts the new script over with the same
  arguments; a second change during that run stops it with `run it again`. The restart also works when
  `bin/release` was started from another folder by a relative path. Only the repository's own release is affected;
  the published package does not change.

## 0.53.0 — 16.10.2026

### Changed — may break scripts

- **`memo search notes` takes the note type in the query: `'budget type:internal'`, not `--type internal`.**
  `type:file` keeps the notes from folders. `--type` is gone, with no alias. The field works under OR and NOT and
  in `--filter` too.
- cli-core 0.302.0.

### Fixed

- **`memo mail restore` counts the mail it brings back in the store again.** It left the mail marked deleted, so the
  next `memo mail trash` could not see it and picked other mail, and a new protect rule did not apply to it. Restore
  now also counts again a run's mail found back in All Mail, so a run restored by an older memo or by hand in Gmail
  is set right by running restore once more.
- cli-core 0.301.0.

## 0.52.1 — 16.10.2026

### Changed

- **memo starts about a fifth faster after its first run.** It keeps Node's compiled code in a cache, in the
  system's temporary folder (`NODE_COMPILE_CACHE` moves it): `memo --help` went from about 0.70 to 0.54 seconds.
- cli-core 0.299.0.

## 0.52.0 — 16.10.2026

### Added

- **`memo mail trash --since-time <time>` leaves older mail in Gmail, whatever its rule says.** For keeping old
  years while newer junk is cleaned up; such mail is counted as kept `before_since`, and JSON adds `since`.

## 0.51.0 — 16.10.2026

### Fixed

- **`memo mail trash` and `restore` find Gmail's Trash by its role, not its English name.** Gmail names folders in
  the account's language, so in UK English Trash is `[Gmail]/Bin`; every move to `[Gmail]/Trash` failed and nothing
  moved. memo now asks Gmail which folders are All Mail and Trash (RFC 6154 `\All`, `\Trash`).
- **A missing folder is reported as missing, not as Gmail throttling.** Gmail adds `[THROTTLED]` to answers that
  fail for other reasons (`NO [NONEXISTENT] Unknown Mailbox … [THROTTLED]`), so memo said "try again in an hour"
  for a folder that does not exist.

## 0.50.0 — 16.10.2026

### Fixed

- **`memo mail trash` decides from the store and asks Gmail only about the emails it moves.** It re-read every
  header in All Mail first (about 260k emails), which took minutes and twice ran the account into Gmail's IMAP
  throttle before one email moved. Rules and replied-to senders now come from the store (cli-core
  `mail.emailFacts`); the picked emails' labels and stars are read again just before the move, and a batch is
  checked with one `UID SEARCH` instead of one lookup per email.
- **`memo mail restore` brings back a batch Gmail moved without confirming it.** It restored only batches whose
  move was answered OK; a move Gmail made but answered with a throttle could not be undone by memo.

## 0.49.0 — 16.10.2026

### Added

- **`memo messages show` gives each attachment's extracted text**, next to the name the email lists, so a bill's
  amount reads in one call. Each text is cut at the first 4,000 characters; `--full` gives the whole of it. JSON
  adds `text`, `text_chars` and `text_cut` to each attachment, or `extraction` (why there is no text: a scan
  `needs-agent`, `unsupported`, …).

### Fixed

- **`memo search mail` with `mailbox:` or `NOT mailbox:bulk` answers in under a second**: on a 257k-email store
  `London NOT mailbox:bulk` took 67 s and failed with `query.too-large` (cli-core 0.295.0).
- **An email address works unquoted**: `from:alice@example.com`, `to:` and `cc:` failed with
  `query.unsupported-operator`; cli-base 0.40.0 reads `user@host.tld` as one word.

## 0.48.0 — 16.10.2026

### Added

- **`memo mail trash <account>` moves envelope mail to Gmail's Trash**, after deciding each email again with today's
  rules and labels. It keeps mail a protected or keep rule matches, mail from senders you replied to, starred,
  important, sent and labelled mail, and mail under 30 days old. A preview unless `--yes`; a first run moves at most
  100, later runs 5,000; `--yes` needs a store backup under 8 days old (`backups/last.json` beside the store). Every
  moved email's labels go to a restore log first. **`memo mail restore <account> --run <id>`** moves a run back
  within Gmail's 30 days, and **`memo mail runs <account>`** lists runs. `memo doctor` shows the backup, whether a
  Takeout mbox is imported, and runs that stopped or are close to their 30 days.

### Fixed

- **Release scripts report observed lock holders separately from stale release labels.** Shared
  diagnostics no longer attribute a live lock to a previous run; wait for the holders to finish, then
  retry.

## 0.47.0 — 16.10.2026

### Added

- **`memo search mail` finds a letter by its whole link and by a part of a link**, also a tracking link that mail
  keeps only as its site: `url:"https://news.example.com/click?id=1"`, `link:"/click?id=1"`. Quote both: `?`, `/`
  and `=` mean something else in a query. cli-core 0.294.0.

## 0.46.0 — 16.10.2026

### Changed

- **`memo mail probe` is now `memo mail inspect`.** Same command and output; `inspect` is the shared word for
  looking at a source before taking anything from it, as `tg chats inspect` looks at a link before joining.
- **`memo search notes` names folders with `--source`, as `tg search notes` does.** `--source notes:<folder id>`
  (the id a hit shows), `notes:internal` for notes written in Memo, comma-separated for more. `--folder` is gone,
  and a folder path is no longer accepted: use its id from `memo folders list`. An entry naming no notes account
  is reported on stderr and the rest is still searched.
- **`memo search memories` narrows by scope in the query: `memo search memories friday scope:work`.** `--scope` is
  gone. The query is words and at most one `scope:`, joined by AND; `OR`, `NOT` and other fields are refused
  rather than filtered after the search. The MCP `search memories` tool lost its `scope` argument the same way.

### Fixed

- **A failed mail listing says why.** himalaya 2.2 prints its error on stdout, so memo reported "no error text"; the
  failed line now carries himalaya's `Error:` report, and a `[THROTTLED]` in it is `mail.throttled`.
- **A read that fails once is tried again** after 15 s (`MEMO_HIMALAYA_RETRY_MS`); IMAP commands that write are never
  repeated.

## 0.45.0 — 16.10.2026

### Corregido

- **The `memo auto` timer follows only a global install of memo.** A memo run from another tool's own
  `node_modules` (a docs build, a test tool) used to point the timer at that folder, and once the folder was
  deleted every timer run failed with `MODULE_NOT_FOUND`. A checkout and `npx` were already ignored.

## 0.44.0 — 15.10.2026

### Corregido

- **`memo sync --retry-attachments` reads again only the emails it has to.** It finds the stored emails whose
  attachment a missing reader left unread (`engine-missing`), looks them up by Gmail id and reads those, up to
  `--limit`. Before, it listed the whole window and re-read its newest `--limit` emails, so older unread
  attachments were never reached. `--json` reports `retried: {emails, extracted, still_failed, missing}`. Mail
  read from an mbox file or plain IMAP has no Gmail id, so the flag refuses there.
- cli-core 0.293.0 and cli-base 0.35.0.

## 0.43.0 — 15.10.2026

### Cambiado

- **`--json=<field>` is checked on memo's own lists too.** `tags list`, `vocabulary list`, `actions list`,
  `agents log`, `projects meetings list` and `folders list` refuse a field their rows lack
  (`output.unknown-field`, with the fields they have) instead of printing empty rows; known fields project as
  before.
- cli-core 0.292.0.

## 0.42.0 — 15.10.2026

### Documentación

- Correct the Takeout resume guidance: completed, unchanged snapshots are skipped; incomplete imports scan again. Replace the retired `tasks.id` search projection example with supported compact hit fields.

### Añadido

- **Mail rules match more than the sender.** `memo mail rules add|remove --filter <query>` takes `subject:<word>`
  (or bare words), `older:<n>d`, `larger:<size>`, `has:attachment`, `label:<name>`, `is:unread`, `is:bulk` and
  `score:<n>`; `--kind social|newsletters|developer|shopping|alerts` matches a built-in kind of mail. Every
  condition given must hold. `memo mail probe` ends with how much mail each kind would match.
- **`--do protect`** keeps mail whole and out of every cleanup, whatever else matches; `memo mail rules list
  --filter is:protected` lists those rules, and protected rules list first as `PROTECTED`. `rules apply` reports
  `protected_kept`.
- **`--do <action>,tag:<name>`** tags the mail a rule matches; a sync tags what it stores, `rules apply` tags what
  is stored (`tagged`).
- **`memo mail rules import-filters <account> <Filters.json>`** proposes rules from a Takeout export's Gmail
  filters; `--yes` adds them. It reads Takeout's `{"filter": [{query, labelsToAdd, labelsToRemove}]}`: each
  `from:` or `to:` term becomes its own rule, and words become subject words.
- **`--filter` takes `from:<address|domain|word>` and `to:<address>`**: `from:sample` matches a sender whose
  address or display name contains the word.
- **Two more spam signals in the sender score:** `never_opened` (+2, you opened none of a sender's mail) and
  `dkim_not_passed` (+2, Gmail's DKIM check did not pass on most of it)
  ([cli-testing](https://github.com/WireCatLabs/cli-testing/tree/main/performance/mail/spam-scoring)).

### Cambios que pueden afectar a scripts

- `memo mail rules add --do` takes a comma list: one of `skip`, `envelope`, `keep`, `protect`, plus any
  `tag:<name>`. A rules file may hold the new conditions; `rules remove` drops the rule with exactly the
  conditions given.
- **Mail sent to many is marked**: import puts mail with a List-Id, List-Unsubscribe or `Precedence: bulk`
  header in the mailbox `memo:bulk` (accounts with rules), so `memo search mail '… NOT mailbox:bulk'`
  leaves newsletters out. Search keeps them by default: bills and bookings carry the same headers.

### Corregido

- **A rule's tag never fails the mail sync.** A Gmail label the store refused as too similar to an existing label
  stopped the whole account's sync ("similar labels exist"). memo now puts the mail under the label the store
  points to and rewrites the rule to it (`tags_reused`), or skips a tag with nothing to reuse (`tags_skipped`,
  also shown by `memo mail rules list`). `memo mail rules import-filters` maps Gmail labels to existing memo labels
  before proposing, and lists the mapping. Labels stored with capitals or a slash need cli-core's matching fix.

- **An HTML page sent as the text part is read as text.** Some senders (airline itineraries among them) put HTML
  in text/plain, and memo stored the markup. The next `memo sync` converts mail already stored, once per account.
- HTML comments no longer leave their text and a stray `-->` in an email's text.
- `memo search mail --account` takes the account's name, as the rules and `memo mail status` do, or its address.

## 0.41.0 — 15.10.2026

### Cambios que pueden afectar a scripts

- **cli-core 0.288.0 and cli-base 0.33.0**, with no old names kept. Shared commands take the new names:
  `tasks agenda --due` → `--due-within`; `tasks agenda --tag`, `--category` and `--claimed` are gone — write the
  query fields `tag:`, `category:` and `claimed:` instead.
- `memo tasks add --attach <task>` → `--into <id>`, the name cli-core's `tasks add` and `tasks merge` use.
- `memo tags add|remove --chat` shows its value as `<chat>`, as every other `--chat` does; it still takes the
  chat's exact id.

## 0.40.0 — 15.10.2026

### Cambios que pueden afectar a scripts

- **cli-core 0.287.0 and cli-base 0.32.0**, with no old names kept. Shared commands take the new option names:
  `tasks plan --check` → `--remind-time`; `tasks agenda --within` takes a `<duration>`. Every `--json` answer is an
  envelope (`item`, or `items` and `page`).
- **memo's own option names follow cli-base 0.32.0's vocabulary**: `mail rules add|remove --from` → `--sender`;
  `mail rules add --skip|--envelope|--keep` → one `--do <actions>` (`skip`, `envelope` or `keep`; more than one is
  refused); `tags add|remove --path` → `--subfolder`; `facts add --occurred` → `--occurred-time`.
- The MCP tool `facts_add` takes `occurred_time` instead of `occurredAt`.

## 0.39.0 — 15.10.2026

### Cambios que pueden afectar a scripts

- `memo tasks list` answers each task as cli-core's `task` entity, as tg and max do: `kind`, `state`, `key`,
  `title`, `source_message`, `chat`, `account`, `due_at`, `created_at`, `updated_at` and the rest. A task no longer
  carries its message or note preview (`message`, `note`), its `source`, `source_kind` or `group`; `memo tasks show`
  has the card. A project's tasks answer the same fields, not their store row.
- `--json=<fields>` is checked against the declared answer of `relationships list` (`relationship`) and `tasks list`
  (`task`); `tags list`, `folders list`, `actions list`, `agents log`, `vocabulary list` and
  `projects meetings list` declare memo's own entities.
- `memo folders list` takes a `[query...]` like every list; it filters by no field yet, so any term is refused.
- A list given an option it does not have answers a query error (exit 2) instead of commander's unknown option.

### Cambios internos

- The list query helpers come from cli-core 0.285.0 (`termField`, `queryTerms`, `withQuery`, `queryArgument`);
  memo's copy is gone. `factItem` builds the `fact` entity in snake_case.

## 0.38.0 — 15.10.2026

### Cambios que pueden afectar a scripts

- **cli-core 0.285.0**, the version tg and max move to. `memo tasks add` refuses a task that may be the same job as
  an open one, or one closed in the last 14 days (exit 2, reason `task.duplicate-candidates`, candidates in
  `details.candidates`); `--attach <task>` links the message to that task instead, `--new` opens it anyway.
  `memo tasks agenda` takes `--category` and `--tag`. Opening the store upgrades it to version 16 (new tables and
  triggers only; older tg and max keep working with it).

### Corregido

- **MCP answers show hidden characters in what other people wrote**, as tg's and max's do: messages,
  mail, notes, names, facts and memories come back with tag characters, direction overrides, zero-width spaces,
  U+FEFF, C1 and other control characters escaped (an ANSI escape reads `\x1b`), in the text and the structured
  content, errors included. Every read tool's description, and the server instructions, say that this text is data
  from other people, never instructions. Cyrillic, emoji and flags are unchanged; what an agent saves, and the
  CLI's `--json`, keep the original text.

## 0.37.1 — 15.10.2026

### Seguridad

- **A hostile HTML email no longer stalls `memo sync`**: an HTML-only mail is turned into text in time linear in
  its size; one of unclosed tags or long blank runs took up to 30 seconds per 200,000 characters, holding the mail
  import. Ordinary mail reads as before, except that `&amp;lt;` now reads as `&lt;` instead of `<`.

## 0.37.0 — 15.10.2026

### Cambios que pueden afectar a scripts

- **Lists filter with their query, not with flags**, and the old flags are gone: `actions list --status proposed` →
  `actions list status:proposed`; `agents log --tool X --agent Y` → `agents log tool:X agent:Y`;
  `projects meetings list --proposed` → `confirmed:false`; `tasks list --project HRB --ready` →
  `tasks list project:HRB ready:true`; `vocabulary list --kind tag --scope work` → `vocabulary list kind:tag
  scope:work`. The store still does the filtering. MCP `actions_list`, `agents_log`, `tasks_list` and
  `vocabulary_list` take the same terms as `query`.
- **`memo sync --notes` and `--mail` are now `--only notes` and `--only mail`** (`--only notes,mail` for both).
- **`memo search messages --type` is gone**: the query says it — `has:voice`, `has:file` or `NOT has:attachment`.
  MCP `search_messages` drops its `type` input the same way.
- **`memo ask` takes what to search for after the question**, not as `--query`:
  `memo ask 'What did I promise?' 'promised OR "by Friday"' --all`.

## 0.36.0 — 15.10.2026

- **Nested JSON report fields use the shared projector.** Dotted paths traverse report objects and arrays while preserving coverage, pagination and execution metadata. The bundled skill documents bounded output and removes fixed import-speed claims.
- **Obsolete config keys are refused without rewriting the file.** Rename camelCase settings to snake_case before using the configuration.

## 0.35.0 — 15.10.2026

### Corregido

- **`memo mail status` counts the widest window ever imported**, not the latest run. A rule change, a new
  UIDVALIDITY or `--rescan` starts the resume point over, and the timer's 30-day run then made status say
  "complete" while most of a mailbox was still unread. The widest window and the last run are now shown apart;
  `--json` gains `folders[].since` and `folders[].last`.

## 0.34.0 — 15.10.2026

### Cambios que pueden afectar a scripts

- **Option names follow the shared vocabulary of cli-base 0.31.1**, with no old names kept:
  `notes add --about` → `--subject`; `notes add|edit --file` → `--text-file`; `notes export --to` → `--output-dir`;
  `ask --model` → `--analyze`; `mail probe --limit-groups` → `--limit`; `vocabulary create`, `vocabulary aliases
  add|remove` and `projects meetings link --expected` → `--fingerprint`; `projects meetings link --provenance` →
  `--reason`.
- **The config file is read only in snake_case**: a camelCase setting such as `mail.maxBodyChars` or a rule's
  `decidedAt` is refused, and old folders are no longer moved at start (cli-core 0.283.0).
- `@wirecat/cli-base` 0.31.1, `@wirecat/cli-core` 0.283.0.

## 0.33.0 — 15.10.2026

### Cambios que pueden afectar a scripts

- **`facts list` and `memories list` take a query, not filter flags**: `memo facts list kind:decision
  status:proposed project:HRB`, `memo memories list scope:work subject:"person:42"`. The store filters by the
  terms, joined by AND; `--type`, `--status`, `--kind`, `--scope`, `--project` and `--subject` are unknown options
  there now. MCP `facts_list` and `memories_list` take one `query` string instead of those arguments.
- **Facts and memories answer cli-core's `fact` and `memory` entities**: a fact's `type`, `statement` and `source`
  are `kind`, `text` and `origin`; a memory's `body` is `text`. `facts add` takes `--kind` instead of `--type`,
  and MCP `facts_add` takes `kind` and `text` instead of `type` and `statement`. `--json=<field>` on facts and
  memories refuses a field the entity lacks.
- **`tags list` and `relationships list` take a query**: `memo tags list tag:follow-up type:note`, `memo
  relationships list 'about:"project:1"'` instead of `--tag`, `--type` and `--reference`. `--provider` and
  `--account` stay on `tags list`: they pick the accounts, they do not filter rows.
- **`tasks list` and `notes list` take a query**: `memo tasks list state:done`, `memo tasks list kind:bug --project
  HRB`, `memo notes list source:internal text:budget`, `memo notes list 'about:"telegram:Kai Sample"'` instead of
  `--state`, `--about`, `--source` and `--search`. `about:` stands alone: the notes it finds through links are no
  longer narrowed further. `--project` and `--ready` stay on `tasks list`: they pick which tasks are read. A next
  page of `notes list` carries the query.
- **`notes show`, `notes add` and `notes edit` answer cli-core's `note` entity**: `labels` and `provenance` are
  gone from `notes show` (`tags` keeps the tag names); each of `links` is `{to, target_text, kind, anchor}` and each
  of `backlinks` is `{from, target_text, kind, anchor}`. `--json=<field>` refuses a field a note lacks.
- **`search all` answers cli-core's `hit` items**: `key` is gone (key documents still come first with
  `--project`), and a result's open `tasks` moved into `next`: a `tasks list source:"<ref>"` step for the account
  holding them. The `missing: tasks` entry is gone.
- **`search` over several accounts no longer runs as the first one**: it runs as memo and reads exactly the
  accounts selected. An account error lists the accounts to choose from.
- **cli-core 0.281.0**: a note whose title matches the query ranks first in `search notes` and `search all`, and
  lists `title` in `found_by`.
- **`memo tasks link` is cli-core's, the one tg and max have:** a `task:<id>` target links two project tasks as
  before (`--kind blocked-by`, `follow-up-of` or `related-to`, now `related-to` when not given); a message, chat,
  person or URL target links a messenger account's task to it, with `--provider` and `--account`. The old form
  keeps working: `memo tasks link HRB-2 HRB-1 --kind blocked-by` (a bare id with `blocked-by` or `follow-up-of` is a
  task; with `related-to`, when that task exists — otherwise it is refused with "write task:<id>"). `--json`
  answers `{ item: { relations } }`, the task's relations after the link, where it printed `{ relation, changed }`.
  `tasks unlink` and `tasks relations` are unchanged.

### Añadido

- **`tasks list source:"<ref>"`** keeps an account's tasks from one message, note or document.

### Añadido

- **`memo tasks agenda`, `tasks plan`, `tasks show` and `memo stats tasks show`**, the same commands tg and max
  have: cli-core's builders, mounted with `--provider --account`, so memo's agenda reads any messenger account the
  store holds. Without them a command fails and lists the accounts.

## 0.32.0 — 15.10.2026

### Cambiado

- **Mail rules live in the store**, beside the mail they decide, instead of `config.json`. `memo mail rules list`
  counts every rule's emails in one query (it took minutes with hundreds of rules), and each envelope email
  remembers the rule that recorded it. The first command that reads rules moves them from the config, checks
  they all arrived, then drops them from it; the old config stays as `config.json.<time>.before-rules-in-store`
  (mode 600) and stderr says so once. A keep rule whose reason says "never remove" becomes protected.

### Añadido

- **`memo mail rules export <account>`** prints the rules as JSON; **`memo mail rules import <account> <file>`**
  adds them, replacing a rule with the same match.

### Cambios que pueden afectar a scripts

- **Every `--json` answer, and every MCP answer, is the standard envelope.** One thing comes in `item`, a list in
  `items` with `page` (`mode`, `limit`, `has_more`, and `next_page` where the command takes `--page`), and each
  answer carries `meta` with its `run_id`. Before, most commands printed the bare record. `commands --json` reports
  contract 4.
- **`--offset` is now `--page`** in `notes list`, `search notes` and `projects meetings list`; MCP `search_notes`
  takes `page`. A list that only grows with `--limit` says `has_more` and names no next page.
- **`search notes`** lists its notes in `items`, not `hits`; why meaning was not searched is in `missing`. Its
  `linked` summary is no longer in JSON or MCP (the text view keeps it): ask `memo context <person>` instead.
- **`search all`** carries the open tasks that point at a hit on that hit, as `tasks`; the accounts read are
  `meta.accounts`, and a resource it could not read is a `meta.issues` entry.
- **`folders list`** puts the folders known only from another computer in the same list, with `path: null`;
  **`tags list`** puts labels on notes, people, projects and folders in the same list as source labels, one row
  per label with its `origin`, instead of a separate `knowledge` list.
- **`search all`, `search messages`, `search mail` and `search notes` answer cli-core's entities**, as tg and max
  do: `search all` items are `hit`s (`excerpt`, `sender_name`, `sender_ref`, no `text` or `from`), `search messages`
  and `search mail` items are the `message.hit` view (`ref`, not `locator`; no whole `text` — `messages show` has
  it). `--json=<field>` refuses a field the entity lacks, and a bare `--json` at a terminal asks which fields.
- **`search notes --tag` is gone**: `tag:work` goes in the query or in `--filter`; MCP `search_notes` takes
  `filter` instead of `tag`.
- **`notes add` and `notes edit`** answer the note itself as `item`, so `--json=id` works; with `--export` the
  file written is the note's `export_path`.
- **Search by meaning, when its model is missing,** says tg or max downloads it, not a `tg` command as memo's
  own.
- **`mail rules remove`** answers the rules left as `rules`; `relationships suggest` answers a list and no
  longer names its scope; `reminders list` and `reminders poll` answer lists.

## 0.31.0 — 14.10.2026

### Añadido

- **`memo doctor`** says where memo keeps its files and what needs attention, and connects to nothing: the settings
  file, the store and its schema, the notes folders and their ids, the mail accounts and Himalaya's version, the
  search model, the timer (including a program it runs that is gone, and its failing streak) and the agent skill's
  version. Each problem names the command that fixes it; the exit code is 1 while one is left. `--json` answers
  `{item, meta}`.
- **`memo upgrade`** updates memo with the package manager that installed it; `--check` only looks. Once a day memo
  asks npm for a newer version and says so in one stderr line, only to a person at a terminal — never with
  `--json`, in a pipe or on a timer run. `"update_check": false` or `MEMO_NO_UPDATE_CHECK=1` turns it off.
- **`memo mail probe` scores each sender group** for spam, scams and robots, with the signals behind it: Gmail's
  DMARC verdict, a brand in the display name sent from another domain, Reply-To on another domain, a
  throwaway-mail domain, bulk mail never replied to, Gmail's Spam, and replies from the owner (−5).
  `--domain-age` adds the sender domain's age from its registry (RDAP), asked once per domain and kept.
- **Gmail's SPF, DKIM and DMARC verdicts and Reply-To are kept** on new mail: in the headers of mail stored in
  full, and in the metadata of envelopes. Listing reads two more header fields, about 1 KB an email instead of
  300 bytes.

### Cambiado

- **Config settings are named in snake_case:** `mail.max_body_chars`, `mail.max_attachment_chars`, and `list_id`
  and `decided_at` in `mail.accounts[].rules[]`, which `memo mail rules` writes and prints that way. The camelCase
  names older versions wrote are still read, and the file is saved in snake_case; both spellings with different
  values are an error. Renaming inside `rules` needs the cli-core release carrying PR #1224.

### Corregido

- **A himalaya that exits before reading its input no longer crashes memo** with an unhandled `write EPIPE`; the
  failure is reported with how himalaya ended, as for any other himalaya error.
- **The timer follows the memo you run.** After a Node.js switch and an install under the new version, the next
  memo command points the `memo auto` unit at it, so removing the old Node.js no longer breaks the timer silently.
  A checkout or `npx` never moves it.
- **The timer keeps the places memo was started with.** `memo auto start` records `MEMO_CONFIG_DIR`,
  `MEMO_STATE_DIR`, `MEMO_CACHE_DIR`, `MESSAGING_STORE` and `WIRECAT_STATE_DIR` in `auto.places` and passes them to
  every timer run, which used the default places before.
- **A failed Himalaya call says why.** The message names the exit code or signal and Himalaya's last line, instead
  of repeating the command; `exit_code`, `signal` and the last five stderr lines, with passwords and tokens cut,
  are in the error's details. Gmail's `[THROTTLED]` is its own reason, `mail.throttled` (`rate_limited`), with the
  advice to wait an hour or more.

## 0.30.0 — 14.10.2026

### Añadido

- **A mail sync goes on where the last one stopped, without listing the mailbox again.** Each run keeps, in the
  store, the mailbox's UIDVALIDITY and the UIDs whose outcome is final (stored, recorded or skipped by a rule), so a
  rerun reads metadata only for mail not done: a large mailbox is no longer listed whole on every run. A whole listing — the only kind that marks deleted mail and refreshes labels and read state — still runs
  at least daily, whenever the rules change, when UIDVALIDITY changes, and with the new `memo sync --rescan`. A
  window under 5,000 emails, like the timer's 30 days, is listed whole every run. An mbox file read to the end is
  not read again until its size or time changes. `memo sync --json` adds `pass` (`full` or `resumed`) to each
  account.
- **`memo mail status <account>`** says how far an account's import is, from the store: stored in full, recorded
  as envelopes, and done of the mail in the widest window searched, as cli-core's progress line;
  `--json` answers the shared progress shape.
- **Mail stored in full keeps List-Id, List-Unsubscribe and Precedence** in its headers (`list-id`,
  `list-unsubscribe`, `precedence`), so a rule can later be matched from the store.

- **`--json=id,title` keeps only those fields** of an answer's item or items, read the way tg and max read it
  (cli-core 0.277.0's `liftJson` and `checkJson`). Adopts cli-core 0.277.0 and cli-base 0.28.2.

## 0.29.0 — 14.10.2026

### Añadido

- **A failing timer run is said on every command.** While the last `memo auto` run failed, every memo command
  writes one line to stderr — `memo: scheduled sync failing since 2026-10-14 00:58 (12 runs): notes … has no
  folder id — memo auto status` — until a timer run passes. `memo auto status` shows `failing` (`since`, `runs`,
  `reason`). Runs are kept in `<state>/auto/last.json` with cli-core's `recordRun`; the timer run itself and a sync
  started by hand do not print or count.
- **Mail stored in full keeps its size at the source** (RFC822.SIZE), as envelopes already did.

### Cambiado

- **On cli-core 0.274.0 and cli-base 0.28.1.** Every answer's `meta` has
  `complete`; `memo sync` answers `complete: false` with `issues` (`{ code, source }`) when a source failed, and
  each entry of its `failed` list carries `code`. Errors carry `retry: { safe, after_ms? }`.
- **Every command declares its effects** in `commands --json`, now contract 3: what it reads or writes on the mail
  server or a model, and on this machine. A failed read is marked safe to retry (`memo sync` while another sync
  runs, for one); before, nothing was, because a command with no effects counts as a write.

## 0.28.0 — 14.10.2026

### Añadido

- **`memo mail rules apply <account>`** cuts mail stored in full that an envelope rule matches down to its
  envelope: text, attachments and search entries go, sender, date, size, labels and the subject in metadata stay.
  A dry run by default that says per rule how many emails and how much text it would cut; `--yes` cuts them.
  Matching reads the headers from the mailbox, as `memo sync` does. Mail only a skip rule matches stays as
  stored. It takes the sync lock and refuses with `sync.running` while a sync runs.

## 0.27.0 — 14.10.2026

### Cambiado

- **Every JSON key memo prints is snake_case**, on the CLI and in MCP: `has_more`, `next_offset`, `key_documents`,
  `your_notes`, `not_read`, `from_them`, `proposed_by`, `creation_fingerprint`, `already_stored`,
  `deletions_skipped`, and the rest. A note's front matter, an email's headers and metadata keep their own keys.
  `memo commands --json` says contract 2.
- **`memo sync --json` prints the shared envelope:** `{"item": {"notes", "mail", "failed", …}, "meta": {"run_id",
  "duration_ms", "accounts"?}}`. What was the whole answer is now `item`.
- **Notes search uses cli-core's names:** a hit's line is `excerpt`, and `found_by`, `has_more`, `next_offset`,
  `meaning_skipped`, `links[].target_text`.
- **More registered reasons:** `folder.unbound` (with `path`), `folder.not-found`, `note.not-imported`,
  `mail.account-unknown` (with `account`), `mail.rule-not-found`, `mail.source-failed`, `mail.invalid-imap`,
  `project.not-found`, `person.not-found`, `identity.no-messenger`, `auto.systemctl-failed`.
- A missing embedding model is recognised by its reason, `model.not-downloaded`, not by its text.
- Moves to `@wirecat/cli-core` 0.268.0 and `@wirecat/cli-base` 0.27.2.

## 0.26.0 — 14.10.2026

### Cambiado

- **Errors are one object, the same on the CLI and in MCP:** `{"error": {"code", "reason", "message", "param"?,
  "details"?}}`. The CLI prints it as one JSON line on stderr in machine mode and `✗ message` at a terminal; MCP
  returns it as `structuredContent` with `isError`. A failure that is not memo's own is `internal_error` /
  `command.crashed` and its text is hidden. A bad option is `validation_error` with Commander's words, exit 2.
- **New global `--debug`** prints the whole error record after the object: the thrown text, cause and stack.
- **memo registers its own reasons** in `APP.errors`: `sync.running` (with `pid`) for a sync refused by the lock.
- A source that fails during `memo sync` shows its registered message; a crash's text shows only with `--debug`.

### Añadido

- **`memo mail rules add --envelope`** records matching mail without its text: sender, date, size, labels and
  the Gmail id, with the subject in metadata and out of search. `memo mail rules list` shows how many emails
  each envelope rule recorded and their size. A keep wins over an envelope, an envelope over a skip; removing
  an envelope rule or changing it to keep reads those emails in full on the next sync. `memo sync --json`
  reports `envelopes` beside `skipped`.

### Corregido

- **The `memo auto` timer no longer fails when a sync is still running.** A timer run that finds the lock held
  exits 0 and writes `memo sync skipped: …` to stderr (`skipped` in `--json`). A sync started by hand still
  refuses with `rate_limited` / `sync.running`.
- **The missing-model hint names the CLIs that download it** — memo has no `models` command: `tg or max
  downloads it: tg models text download e5-small`. MCP `search_notes` no longer suggests `memo models …`.

## 0.25.0 — 14.10.2026

### Añadido

- **`memo mail probe <account>`** groups an account's mail by sender and List-Id from headers only (about 300
  bytes an email): emails, size, unread and bulk shares, years, whether the owner ever wrote to the sender,
  and a `skip` suggestion for large, bulk, never-answered groups. `--json` for agents.
- **`memo mail rules list|add|remove <account>`** keep the owner's skip/keep decisions by sender, domain or
  List-Id in `mail.accounts[].rules`; a keep wins over a skip. `memo sync` never reads or stores an email a
  skip rule matches and reports it as `skipped`; mail stored before stays.
- **Google Takeout mbox accounts** (`"mode": "mbox", "path": "…"`, with the Gmail address) import old mail by
  Gmail's message and thread ids, so it joins the IMAP account's mail. The file is read in one streaming
  pass; it only adds mail, never marks any deleted, and syncs only when named with `--account`.

### Corregido

- **`memo sync` imports a mailbox of more than ~120,000 emails.** A long `--since-time` window failed with
  "Maximum call stack size exceeded" before saving anything.
- **`memo sync --mail` reads mail about ten times faster.** Emails are fetched raw, up to 50 (or 20 MB) per
  IMAP call instead of one himalaya call each, and parsed in-process with `postal-mime`. An email that cannot
  be read or parsed is listed under `unreadable` and tried again next run instead of failing the account.
- **Listing a mailbox of several hundred thousand emails no longer reads one huge answer.** All Mail is listed
  10,000 emails per himalaya call.
- **A whole-mailbox `memo sync` no longer loads every stored email's text.** The deletion check and the "already
  stored" check read only Message-IDs and mailboxes, in one query each, instead of every body and one lookup per
  listed email.
- **A mail marked deleted by mistake is saved again when IMAP lists it again.** It used to count as already
  stored and stayed without its text. An mbox archive still leaves mail that IMAP proved deleted alone.

### Cambiado

- **Depends on `@wirecat/cli-core` 0.265.0 and `@wirecat/cli-base` 0.27.1.** `@wirecat/cli-core` is the new name
  of `@wirecat/cli-messaging`; opening the store with it runs store migrations up to version 7. `memo commands
  <path> --json` says `inherited_options` instead of `inheritedOptions`, and its `contract` is 1.
- **`attachments[].part` and an attachment's `providerRef.part` count the email's attachments from 0** instead
  of being himalaya's MIME part index. Attachments stored earlier keep theirs.
- **Mail bodies are read from the raw message.** Text matches the old reader once whitespace is collapsed; blank
  lines, spaces at line ends and joined flowed lines may differ. HTML parts that the old reader filed as attachments are now the body, and attachments the old reader
  named `attachment-N` keep their real file names.
- **`memo sync --help` and the agent skill say how long a large first mail import takes**, and that Gmail caps
  IMAP downloads per day.

## 0.24.0 — 13.10.2026

### Añadido

- **An agent skill, as tg has.** `memo skill show` prints it and `memo skill install --for claude|agents|all`
  writes it where Claude Code, Codex and Gemini CLI look; a global npm install does that too, unless
  `MEMO_INSTALL_AGENT=none`. It starts with the traps agents fell into: choosing an account, `content:` and
  answer keys, starting project work with `memo projects context`, `--as-owner`, accepting their own proposals,
  writing message text to files, old versions and zsh word splitting.

- **Key documents of a project.** `memo projects key-documents add <project> <note:|document:|msg:> --reason
  <text>` marks what to read first about one project; `remove` and `list` go with it. `memo projects context`
  starts with them — title, path, why, who marked it — and keeps a mark whose source is gone as
  `available: false`. `memo search all` and `search notes` with `--project <project>` put the project's key
  documents first, labelled `key`, and leave nothing out. An agent's mark waits unconfirmed and names the agent.

- **Every command shows one to three examples** at the end of its `--help` and in `memo commands --json`
  (`examples`). A test runs each through memo's own parser, so an example never names a command, option or value
  memo does not take.

### Cambios que pueden afectar a scripts

- **The local store and the search models move to one WireCat folder** (cli-messaging 0.258.0):
  `~/.local/share/WireCat/` on Linux and macOS, `%LOCALAPPDATA%\WireCat\Data\` on Windows. The first start of
  memo, tg or max after the update moves `wirecat.db` and the models there, once; the old folders stay.
  `WIRECAT_STATE_DIR` moves the whole folder and replaces `CLI_COMMON_CACHE_DIR`.
- **An MCP tool failure that is not a memo error is `internal_error`**, the shared name; it was `generic_failure`.
- **`memo notes about` is gone; `memo notes list --about <subject>` returns what it did.** The list now holds the
  notes about the subject and the notes linking it, a note about it, or a name two people share, each with `via`
  (`about`, `link`, `through`, `name`), the headings it links under (`anchors`) and, for `name`, the name as written
  (`linkText`). It still pages and combines with `--source` and `--search`. A person's
  notes include those about any of their messenger identities.

- `memo context` tells you to run `messages sync <chat>` for chats not read in full; the hint said `store fetch <chat>`, which cli-messaging 0.256.0 renamed. Text read from a CSV attachment or note now comes as rows (`name: Bravo; value: 200`), not raw comma separated lines.
- **`memo commands --json` prints cli-base's commands document**, the shape tg and max print: `cli`, `version`,
  `contract`, `description`, `globalOptions`, `commands`, `exitCodes`. `items` is gone; `memo commands <path> --json`
  puts the one command under `commands` with `scope` and `inheritedOptions`.
- `memo import` is now `memo sync` (owner, 2026-10-12; WireCat glossary in cli-messaging). `memo import` stops working. `memo auto start` writes `memo sync` into the unit; a timer installed before runs `memo import` and fails until `memo auto start` is run.
- **A write from an agent's terminal is the agent's.** `memo facts add`, `memories add`, `relationships add`
  and `actions add` run with `AI_AGENT` or `CLAUDECODE` set record the agent as author (`claude-code`, the
  name before the version in `AI_AGENT`), as the MCP server does: the fact or memory waits as `proposed`, the
  relationship unconfirmed with `provenance: agent:<name>`. They were recorded as the owner's and accepted.
  `--as-owner` keeps a write yours inside an agent's terminal.

- **One meaning per flag (WireCat command standard).** A flag that takes several values is given once per value:
  `memo notes add --about a --about b`, `sync` and `search notes` `--folder a --folder b`.
  `reminders add` and `update` take `--at-time` instead of `--at`. `relationships add` takes `--reason <text>`
  instead of `--evidence`, which in `facts` and `memories` names references. `--project` takes a key or
  `project:<id>` in `facts add`, `facts list` and `tags add|remove`, as it does in `tasks`; `tags --folder` takes a
  folder's path as well as its id; `projects add --organization` takes a bare id as well as `organization:<id>`.

- **One way to bring notes and mail in: `memo sync` (WireCat command standard, no two commands overlap).**
  `memo notes import` and `memo mail <account> import` are gone. `memo sync --notes` and `--mail` take one side;
  `--folder` and `--ignore` narrow the notes, `--account <name>`, `--since-time <time>` (a date, ISO 8601 or
  `30d` ago), `--limit <n>` and `--retry-attachments` narrow the mail. Without `--account` it reads every account
  and names each. `memo mail <account> show <reference>` is `memo messages show <reference>`.
- **Verbs from the shared list.** `facts accept` and `actions approve` are `confirm`; `actions propose` is
  `actions add`; `tasks readiness` is `tasks status`; `tasks ready` is `tasks list --ready --project <project>`;
  `auto on` / `off` are `auto start` / `stop`; `reminders schedule` / `snooze` are `reminders add` / `update`;
  `vocabulary resolve` is `vocabulary show`; `vocabulary preflight <name>` and `vocabulary audit` are one
  `vocabulary check [name]`; `memories search` is `search memories`. The old names stop working.
- **MCP tools follow their commands:** `actions_add`, `search_memories`, `tasks_relations`, `tasks_status`,
  `tasks_list` (with `ready`), `vocabulary_check` (with or without `name`) and `vocabulary_show` replace
  `actions_propose`, `memories_search`, `task_relations`, `task_readiness`, `tasks_ready`, `vocabulary_audit`,
  `vocabulary_preflight` and `vocabulary_resolve`.

### Corregido

- **Mail hints name `memo sync --mail`.** `memo search mail` and its MCP tool named `memo mail <account> import`,
  which is gone.
- **`memo sync` keeps `mail.maxBodyChars` and `mail.maxAttachmentChars`.** Only `memo mail <account> import`
  read them; the timer stored mail with the defaults.
- **Every argument and option of memo is described in its help**, and every summary is lower case, at most 80
  characters.
- **A command path given as one argument is refused with the words to type.** `memo "projects add" --help` — what
  a zsh loop over `"$c"` passes — printed the root help; it now says `"projects add" was given as one argument;
  run: memo projects add`.
- **Search help says where file text and references are.** `search messages`, `search mail` and `search all` say
  `content:`, `transcript:` and `filename:` narrow a search to the text of files, voice transcripts or file names, and each search's `--help` and MCP
  tool names the list (`items` or `hits`) and the reference (`locator` or `ref`) of its `--json` answer. The usage and
  troubleshooting guides say the same, and to compare `memo --version` with npm before reporting a bug.
- **The search guide names `content:` for messages.** It narrows a search to the text of files, in
  `memo search messages` and `memo search all` as in tg; the guide listed it for mail only.
- **`memo projects context` and `memo organizations context` refuse what the store does not hold** with
  `not_found` instead of an empty answer, and `organizations context` takes `organization:<id>` as well as
  its id.
- **`memo folders attach` refuses drive-cli's `google-drive:` folder**, and `memo folders list` marks it "kept by
  drive" (`keptBy: "drive"` in JSON) instead of offering to attach it. Bound to a disk folder, the next import
  would have deleted the Drive documents missing from it.
- **`memo search all` no longer runs as the first stored account.** It searched every account before too, but
  picked one as its own; now it runs as memo's notes and its answer names every account it read, as `accounts`
  (`{ resource, provider, account }`) in JSON and a `searched:` line on stderr. `memo search messages` and
  `memo search mail` stop picking one as well.

## 0.23.0 — 12.10.2026

### Corregido

- **An MCP answer over 4 MiB is refused with `invalid_response`**, as cli-messaging's tools refuse one, instead of
  reaching the agent whole.
- **Memory, fact, action and agent-log lists say whether there are more** (`hasMore`, CLI and MCP), as the other
  lists do; asked for the whole 500, a full answer says it may have more. `tasks list` (of an account), `tasks
  ready` and `tasks_ready` give each task its `task:` reference.
- **Terminal answers name things by the references memo's commands take.** `notes list` and `context` printed a
  bare note id that `notes show` refuses; they print `note:`/`document:` references. `notes show` printed only the
  text; it starts with the reference, path or title, update time and tags, and ends with what it links and what
  links it. `context` names the person as `person:<id>` and each message by its `msg:` locator, and tasks as
  `task:<id>`. `tags list` names a chat as `chat:…`, a contact as `<messenger>:<id>` and every other label's
  target as `<type>:<id>`, not as JSON. `context --json` gives each of your notes its `ref`.

## 0.22.0 — 12.10.2026

### Cambiado

- **Built on `@wirecat/cli-base` 0.21.0, the framework's new name, and the shared library 0.254.0.** Nothing
  changes in memo's commands; `memo search` answers carry `nextOffset` where the shared search gives it, and
  `memo context person:<id>` takes the `person:` references search answers give.

### Añadido

- **`memo mail <account> show <reference>` opens one stored email whole**, by the `msg:email/…` reference search
  answers give: time, sender, To, Cc, labels, subject and the whole body; `--before-n`/`--after-n` add the emails
  of its thread either side, `--json` the same as data. The reference must be of the named account.
- **The MCP server searches every source.** `search_all`, `search_messages`, `search_mail`, `search_notes` and
  `person_context` read the same store as `memo search` and `memo context`. memo is where an agent searches across
  messengers, mail and notes; tg and max will search only their own messages
  ([which tool owns which command](https://github.com/WireCatLabs/cli-messaging/blob/main/docs/dev/TOOL-BOUNDARIES.md)).

### Corregido

- **`memo ask` gives coverage as counts per account, and its 64 KiB limit covers the whole answer.** Each
  messenger account had one row per chat, up to 500, which could fill most of an answer; now `chats` counts `checked`, `complete`, `partial`, `neverFetched`, `behind` and `withGaps`, and `more`
  says the 500-chat check was cut short. The size check measured the evidence only; it now measures what is printed.

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

## 0.6.1 — 11.10.2026

### Fixed

- Package references, documentation and fixtures use the WireCat namespace throughout.
- The printed Memo version matches the published package version.

### Changed

- **memo runs on `@wirecat/cli-messaging` 0.221.0.** The store prunes its growing logs on open, at most once a
  day: agent tool calls older than 90 days are deleted, and a handled bot update older than 30 days loses its
  payload. Upgrade tg-cli and max-cli first, as all three share the store.
- **`organizations add --kind`, `projects add --type` and `--scope` take their allowed values from the store**
  and refuse any other value before the store is opened, naming the allowed ones.

### Fixed

- **`memo --version` prints the package's version.** It printed 0.4.0 since 0.5.0: the number lived in a file the
  release did not update. A test now fails when that file and `package.json` disagree.

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
