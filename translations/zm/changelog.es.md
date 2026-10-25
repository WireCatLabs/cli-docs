---
title: "Historial de cambios"
---

Las entradas nuevas están traducidas; el historial anterior conserva su inglés original. Los comandos y límites corresponden a las versiones indicadas.

## 0.48.0 — 25.10.2026

### Correcciones

- **`zm --version` sin nada más en la línea responde antes de cargar el programa**: unos 50 archivos de módulos en lugar de 1150
  (`cli/start` de cli-core). `--version` con cualquier otra cosa en la línea pasa por el programa como antes.

## 0.47.0 — 25.10.2026

### Añadido

- `zm store info --json` describe el almacén compartido: dónde está, su esquema frente al que lee zm (`schema.reason`
  y `schema.upgrade`, a qué lo lleva la próxima ejecución de zm) y qué herramientas lo usaron. Abre el almacén solo para
  lectura y no necesita perfil, así WireCat Desktop puede saber si zm puede leer el almacén.

### Cambiado — puede romper la compatibilidad

- **El registro de ejecuciones viene de cli-core 0.430.0** (`commandRuns`) en lugar de la copia propia de zm. Las
  ejecuciones se guardan como antes: un comando fallido siempre, uno correcto con `--record` o `record: true`, nada con
  `--no-record`; el `meta.run_id` de una respuesta sigue nombrando su ejecución. Dos pequeñas diferencias: una ejecución
  sin perfil omite `profile` en `runs list` y `runs show` en vez de `""`, y una respuesta de Zoom de 400 o más se
  registra con `error_code: provider_error`.

## 0.46.0 — 25.10.2026

### Añadido

- **`zm config unset <key>`** quita un ajuste, o cualquier parte del archivo en la que `doctor` informa un problema,
  por la clave que nombra su `fix`. `zm config show`, `set` y `unset` funcionan con un archivo con problemas: `show`
  muestra cada problema tras los ajustes que sí se cargan, y `set` y `unset` dejan el resto del archivo como estaba.
- **Una ejecución dice qué se escribió y, si falló, qué salió mal** (cli-core 0.425.0). `zm runs list` y `zm runs show`
  añaden `cli_command` (`zm config show`), `argv` con cada valor que puede ser contenido o un secreto escrito
  `[redacted]`, `agent` cuando lo ejecutó un agente de programación, y `error`: su clase, código, mensaje enmascarado y
  una pila corta.
- **`zm skill status`** dice, para Claude Code y para Codex y Gemini CLI, si el SKILL.md instalado coincide con esta
  versión, y **`zm skill show --for claude|agents`** muestra la copia instalada allí (cli-base 0.56.0).

### Cambiado — puede romper la compatibilidad

- **Si iniciaste sesión por última vez con zm 0.34 o anterior, vuelve a iniciarla: ejecuta `zm <profile> session start`.**
  zm ya no traslada a un perfil un acceso guardado solo con el Public Client ID; zm no encuentra acceso para ese perfil
  hasta que lo hagas.
- **`zm doctor --json` enumera todos los problemas del archivo de configuración en `config.issues`, en lugar de
  `config.error`** (cli-core 0.423.0). Cada problema es `{ kind, file, profile?, key?, line?, column?, what, fix? }`,
  con `kind` igual a `invalid_json`, `unknown_setting`, `unknown_permission` o `invalid_value`. `what` dice qué tiene
  que ser el valor y nunca muestra el valor guardado; `fix` es un comando `zm config unset` que funciona tal como está
  escrito, y falta en el JSON no válido, donde `line` y `column` dicen dónde se detuvo la lectura. Con un archivo con
  problemas, doctor termina con 0 sin `error` de nivel superior y sigue rellenando `profiles` y `authentication` con lo
  que se carga. `config.readable` y `config.source` desaparecen; `config.found` dice si el archivo existe.
- **Los nombres antiguos de ajustes ya no se leen.** `account_profile`, las claves camelCase (`clientId`, `filesFolder`,
  `filesTimezone`, `accountProfile`) y el selector `zoom.clientId` son desconocidos como cualquier otra clave, sin pista
  de en qué se convirtieron.
- **Una clave de permiso guardada que no nombra ningún comando detiene todos los comandos salvo `config` y `doctor`**,
  con el `config unset` que la quita. Incluye `recordings.sync`.
- Todos los comandos salvo `config` y `doctor` rechazan un archivo con problemas por el primero, con cómo quitarlo y
  cuántos más enumera `doctor`. `client_id`, `source` y `files_folder` pueden faltar en el archivo; `zm config set`
  escribe solo el ajuste que cambia.
- El comando oculto `zm serve` desaparece; `zm <profile> mcp` es el servidor MCP.
- **Una vista previa `--dry-run` dice `effects.service_contacted: false` y ya no tiene `effects.messenger_contacted`**,
  y su `permission.key` es la clave propia de zm para el comando, como ya era la disponibilidad en la ayuda: una vista
  previa de `watch` nombra `watch`, no `messages` (cli-core 0.426.0).
- **`zm config set` guarda `config.json` solo para el propietario (`0600`)** en lugar de `0644` (cli-base 0.57.0). Lo
  que lea el archivo como otro usuario ya no podrá leerlo tras el siguiente guardado.
- **Una parte rota de un ajuste se informa como el ajuste entero.** Una entrada incorrecta en `context_sources` es un
  problema `invalid_value` en `context.sources` con la corrección `zm config unset context.sources`, y el resto del
  archivo se sigue cargando. Un problema `invalid_json` siempre tiene `line` y `column` (cli-core 0.425.0).

### Seguridad

- **`zm doctor` informa de un `config.json` o una carpeta de configuración que otros usuarios pueden leer.**
  `files.problems` en su respuesta enumera cada uno como `{ path, mode, want, fix }` (`0600` para el archivo, `0700`
  para la carpeta), y stderr escribe `to make it private: chmod 600 '<path>'` para cada uno; no cambia nada en disco.
  Windows no se comprueba.

### Corregido

- **`zm doctor` responde cuando la ruta de configuración es una carpeta o no se puede leer**, con un único problema
  `invalid_value` para todo el archivo y sin corrección, en lugar de fallar. Los demás comandos rechazan ese archivo con
  las mismas palabras.
- **La ayuda muestra `config`, `doctor`, `models` y `runs` sin perfil**, porque no leen ninguno:
  `Usage: zm doctor [options]` y `zm doctor --json`, no `zm <profile> doctor` y `zm personal doctor --json`. Una
  palabra de perfil delante sigue funcionando.
- Las herramientas MCP de lectura y escritura dicen "names, titles, what people wrote" en lugar de "names, titles,
  messages", y su ejemplo es `runs list`, que funciona tal cual, en lugar del grupo `runs`. `zm --help` dice que drive
  es "searchable with your other WireCat data".
- MCP ya no ofrece un grupo de comandos que solo imprime su ayuda, como `config` o `meetings`; sus comandos se siguen
  ofreciendo uno a uno.

## 0.45.0 — 25.10.2026

### Añadido

- `zm runs list [query]`, `zm runs show <run-id>` y `zm runs path <run-id>` leen el registro de ejecuciones, sin
  perfil. Un comando fallido se guarda como ejecución, `--record` guarda también uno correcto y `--no-record` no guarda
  nada; los nuevos ajustes `record` y `keep_runs_for_days` cambian el comportamiento predeterminado y cuánto duran las
  ejecuciones. Cada petición a Zoom se registra solo con su método, ruta enmascarada, estado y duración, y el
  `meta.run_id` de una respuesta es ahora el id que acepta `runs show`.

### Cambiado — puede romper la compatibilidad

- Un cambio en Zoom que pregunta primero (permiso `ask`) ya no pregunta cuando la salida va a una tubería o a un
  archivo: se niega con `confirmation_required` y pide añadir `--yes`, como ya hacía sin terminal. En una terminal
  sigue preguntando.

### Corregido

- La ayuda, `commands`, las descripciones de herramientas MCP y la skill del agente describen zm, no un servicio de
  mensajería (cli-core 0.422.0, `messenger: false`): `--brief` y `--full` hablan de elementos encontrados, `--trace` y
  `--record` de contenido, `commands info` muestra `zm commands info commands`, y las herramientas MCP ya no sugieren
  "unread" ni "send message". Los ejemplos que llegarían a Zoom o cambiarían algo llevan ahora `--dry-run` u omiten
  `--yes`, así que cada uno funciona sin conexión tal como está escrito.
- `zm <profile> session start` abre el navegador en macOS y Windows; antes siempre probaba `xdg-open`. `--browser`
  sigue eligiendo el programa.

## 0.44.0 — 25.10.2026

### Cambiado — puede romper la compatibilidad

- **El almacén compartido pasa a la versión 33 (cli-core 0.420.0).** En cuanto esta versión abre el almacén, una CLI
  con un cli-core más antiguo lo rechaza y pide actualizarse, así que actualiza juntas todas las CLI de WireCat que
  comparten el almacén.
- Una fuente de documentos en `context.sources` nombra su carpeta de notas con el proveedor `local` u `obsidian`, como
  hace el almacén desde la versión 32; una guardada con el proveedor `folder` se sigue resolviendo. Antes, una carpeta
  que el almacén había renombrado hacía que la preparación rechazara la fuente.
- `mentions list` recibe la ventana de reuniones como el campo de consulta `started_at`, por ejemplo `started_at>=30d`
  o `started_at:[2026-10-01 TO 2026-10-31]`. Sus opciones `--since-time` y `--until-time` se eliminan, sin alias;
  `review` y los comandos de estadísticas las conservan.

### Añadido

- Las menciones en reuniones aceptan una consulta de URL derivada del esquema, seleccionada dentro del lector de enlaces
  compartido antes de los límites del resultado.

## 0.43.0 — 24.10.2026

### Cambiado — puede romper la compatibilidad

- **Los contratos de comandos compartidos y los comandos de modelos vienen de Core.** Las diferencias de fuente y
  transporte de cada proveedor son explícitas y descubribles; las ediciones silenciosas fallan antes de ejecutarse. Las
  etiquetas de tema guardadas de las reuniones usan `--topic-name`; `--topic` de los foros conserva su significado de id.

### Añadido

- **Los enlaces de reuniones aceptan consultas nativas.** `mentions list event_id:1`, `project:RES` y `topic:planning`
  seleccionan las reuniones antes de leer los enlaces. Los eventos guardados aceptan consultas nativas por id, origen y
  hora.

### Corregido

- Las guías describen el descubrimiento actual de permisos, la paginación de la búsqueda unificada y los flujos de
  reuniones ya publicados. Los nombres de comandos retirados se quitan de los ejemplos de solo lectura.

## 0.42.0 — 24.10.2026

### Cambiado — puede romper la compatibilidad

- `recordings download` acepta una reunión o un intervalo de fechas. `recordings sync` desaparece sin alias: usa `recordings download --since-time … --until-time …`. Los archivos, puntos de control y tareas programadas existentes siguen siendo compatibles.
- Revisa los permisos guardados `recordings.sync` y cámbialos por `recordings.download`. Las entradas antiguas detienen los comandos que comprueban permisos, en lugar de perder sus restricciones.

### Añadido

- Las descargas por intervalo admiten listas JSON acotadas de confirmaciones, también por MCP. `--jsonl` sigue emitiendo cada confirmación al completarse, para conservar resultados anteriores si falla una descarga posterior.

### Correcciones

- Los comandos denegados siguen apareciendo en las búsquedas MCP con su disponibilidad actual y un motivo. La ayuda CLI con perfil explícito muestra esa disponibilidad; las llamadas siguen rechazándose antes de ejecutarse.

## 0.41.0 — 24.10.2026

### Cambiado — puede romper la compatibilidad

- Las duraciones usan la sintaxis CLI común: un entero seguido de `ms`, `s`, `m`, `h` o `d`. Se rechazan los números sin unidad y las duraciones fraccionarias.
- Las respuestas tipadas usan ID como cadenas y fechas ISO de forma coherente, incluidos los recibos de archivo y cambios en reuniones.
- Los comandos usan el ciclo de vida, plazos, cancelación, descubrimiento y metadatos de solo lectura de Core. El SDK requiere `parseAsync`; se rechaza el análisis síncrono antes de ejecutar el comando.

### Añadido

- `meetings status` y `recordings status <directory>` muestran progreso persistente sin acceder a la red ni abrir la base.
- MCP expone inventario de reuniones programadas, examen de proyectos y actualización según los permisos del perfil; actualizar y cambiar temporizadores necesita autoridad.
- `bin/release --local` valida y publica un único paquete comprobado con un token npm exportado explícitamente.

### Correcciones

- Las descargas de modelos usan la verificación de checksum y reparación de Core.
- MCP comprueba la autoridad mediante anotaciones y permisos del catálogo compartido, también después de revocar un permiso.

## 0.40.0 — 24.10.2026

### Cambiado — puede romper la compatibilidad

- Los modelos de voz usan los nombres compartidos de cli-core 0.406.0: `models list` sustituye a `models audio list` y acepta `kind:audio`, `id:` y `downloaded:`; `models download <model>` sustituye a `models audio
  download`. No hay alias. La respuesta `model` usa `size_bytes` en lugar de `sizeBytes` y `default`, siempre `false`, porque `meetings transcribe` recibe `--model`.

### Correcciones

- Los ejemplos de ayuda y escenarios del paquete incluyen el perfil.
- La guía MCP describe escrituras y permisos; la instalación explica que cada usuario necesita su propia app de Zoom o una app de equipo autorizada.

### Añadido

- El catálogo MCP incluye lectura de ajustes, estado de sesión, lectura de la skill y vectores de reuniones. Los ajustes e instalación de skills necesitan `mcp.authority` explícito; el agente no puede cambiar permisos del perfil.
- `doctor` muestra `authentication.keyring` tras probar y eliminar una entrada temporal, sin leer accesos guardados.

## 0.39.0 — 24.10.2026

### Añadido

- El primer comando en una terminal pregunta una sola vez para todas las herramientas WireCat por tus idiomas, otras herramientas que instalar y si comandos y agentes solo pueden leer. Las respuestas se comparten; «solo lectura» impide los cambios de zm aunque el perfil permita más. `tg setup`, `max setup` o `wa setup` vuelve a preguntar. No pregunta a agentes, con `--json`, `--no-input`, `CI` ni `ZM_READ_ONLY`.

## 0.38.0 — 24.10.2026

### Cambiado — puede romper la compatibilidad

- `search all` devuelve una lista de coincidencias como tg, en vez de un único item con detalles internos. Cada coincidencia conserva `ref`, `title`, `timestamp`, `excerpt` (antes `text`), `offset_ms` (antes `start_ms`) y, para reuniones, `scope` e `id`. Las fuentes omitidas van a `meta.issues`, con el motivo por stderr; `missing` informa de un examen truncado. Continúa con `--page` o `--max-meetings all`; desaparece `--meeting-cursor`.
- `meetings evidence` y `meetings context` identifican cada línea con `ref` (antes `reference`), su inicio con `offset_ms` (antes `start_ms`) y los ID como cadenas, igual que `meetings prepare`.
- `events list` devuelve fechas ISO 8601 e ID como cadenas, antes milisegundos y números.

### Añadido

- Once comandos más declaran el tipo de respuesta: `review`, `mentions list`, `stats meetings show` y `top`, `meetings people`, `meetings passage`, `meetings task-proposal`, `meetings evidence`, `meetings
  context`, `events list` y `search all`. `commands --json` y MCP describen sus campos, y `--json=a,b` valida sus nombres.

### Correcciones

- `search all` pagina las coincidencias de reuniones: `--page 2` ya no repite la primera página y `has_more` se conserva mientras quedan resultados.
- `searches run` declara el tipo `meeting_hit`, como `search meetings`, en lugar de `hit`; `--json=scope` ya no se rechaza por ese esquema incorrecto.

## 0.37.0 — 23.10.2026

### Añadido

- `zm <profile> review` muestra las reuniones desde una fecha, con decisiones y tiempo de palabra: los últimos siete días por defecto, con resumen, próximos pasos, proyectos, tamaño de la transcripción y las tres personas que más hablaron. Informa de resúmenes ausentes y transcripciones casi vacías.
- La sincronización conserva el chat guardado por Zoom con una grabación en la nube, con `cloud_recording:read:list_recording_files`. `zm <profile> mentions list` enumera los enlaces más compartidos, quién los compartió y en qué reuniones.
- `zm <profile> searches create|run|list|show|delete` guarda una consulta y sus opciones bajo un nombre. Se interpretan en cada ejecución: `date>=7d` sigue siendo la última semana. `searches run` responde como `search meetings`.
- `search meetings` admite `date:`, `project:`, `tag:` y `topic:` en la consulta, igual que las opciones correspondientes: `zm personal search meetings "launch project:RES date>=30d"`.

### Correcciones

- Una transcripción que Zoom aún no ha terminado ya no se informa como una respuesta rota. Sync avisa de que todavía no está lista y puede obtenerla más tarde. Si no existe, fue borrada o Zoom no puede exportarla, la reunión se guarda sin transcripción y sin advertencia.

## 0.36.0 — 22.10.2026

### Cambiado — puede romper la compatibilidad

- **Una importación o sincronización que nombra un perfil desconocido se rechaza cuando ya existen otros perfiles.**
  Antes creaba el perfil y, en una terminal, lo avisaba; un error de escritura (`zm persnal meetings import …`)
  guardaba las reuniones bajo un nombre nuevo. Ahora falla con `validation_error` y `details.profiles`, antes de
  guardar nada. Un perfil nuevo empieza con `zm <name> session start`; en un ordenador sin ningún perfil, la primera
  importación todavía crea uno.

### Correcciones

- **`models audio download` dice cuánto va a descargar de verdad.** Mostraba el tamaño de todo el modelo cuando solo
  faltaba el archivo de detección de voz.

## 0.35.0 — 22.10.2026

### Añadido

- **`zm <profile> stats meetings show|top`: quién habla y cuánto** (cli-core 0.389.0). Tiempo de palabra, líneas y
  palabras por orador (la persona vinculada; si no, el participante; si no, el nombre de la transcripción) y reuniones
  y tiempo de palabra por semana, en una ventana de fechas, un proyecto, un tema o un evento. Solo números; no se
  lee texto de transcripciones.
- **Permisos por perfil** (WC-PERM-1..3, 9, 10): `zm <profile> config set permissions '{"recordings": "readonly"}'`.
  Una clave es una ruta de comando, con puntos; un nivel es `deny`, `readonly`, `ask` o `allow`, y gana la clave más
  específica. `--yes` responde a `ask` y nunca levanta `deny` ni `readonly`. Los ajustes, el acceso, la ayuda y el
  servidor MCP nunca se limitan.
- **`meetings transcribe` acepta las grabaciones de Zoom.** Un archivo que no es ya un WAV PCM16 de 16 o 48 kHz (MP4,
  M4A, otro audio y vídeo) lo decodifica antes el `ffmpeg` instalado en una carpeta temporal privada, bit a bit, así
  que transcribirlo de nuevo es una repetición. zm no instala ffmpeg.
- **`zm models audio list|download`.** Los modelos de voz que usa la transcripción, en la carpeta que comparten todas
  las CLI de WireCat. `download` comprueba el sha256 de cada archivo, también el del modelo de detección de voz, y
  vuelve a descargar lo que no coincide, así que repara un modelo dejado por otra versión.

### Correcciones

- **Un modelo de voz de otra versión ya no hace fallar la transcripción con "this is a bug".** El motor lanza un
  número suelto cuando no puede leer un archivo; zm ahora indica que ejecutes `zm models audio download <model>`,
  que lo repara.

### Cambiado — puede romper la compatibilidad

- **El perfil es la primera palabra: `zm personal meetings list`.** `ZM_PROFILE` lo nombra para una sesión de shell y
  `ZM_PROFILE_LOCK` fija un proceso a uno solo (otro perfil nombrado → `permission_error`). El ajuste
  `account.profile` ya no elige el perfil, y `zm config set account.profile` se rechaza. Un comando que usa una
  cuenta y no nombra perfil falla con `validation_error` y enumera los perfiles en `details.profiles` (antes era
  `configuration_error`, código 3). El inicio de sesión, la importación y la sincronización registran un perfil;
  `doctor` los enumera (`profiles`, antes `data_profile`).
- **Cada perfil tiene su propio acceso a Zoom**, en el llavero como `<client id>:<profile>`. El acceso guardado antes
  de esta versión pasa al perfil que nombraba `account.profile`, la primera vez que se usa ese perfil.
  `session status` nombra el `profile`; el usuario de Zoom verificado es ahora `zoom_user`.
- **`context.sources` pertenece al perfil nombrado en el comando**: `zm research config set context.sources …`.
- **El temporizador de una programación de grabaciones ejecuta `zm <profile> recordings schedule run`.** Un
  temporizador instalado por una versión anterior no nombra ningún perfil; crea la programación de nuevo.
- **Crear, modificar o cancelar una reunión de Zoom pregunta antes.** En una terminal zm pregunta y/N; sin terminal y
  sin `--yes` el comando falla con `confirmation_required` (código 7). Antes mostraba una vista previa y salía con 0;
  `--dry-run` sigue mostrando la vista previa. Un perfil con `"remote-meetings": "allow"` aplica sin `--yes`.
- **`zm <profile> mcp` sustituye a `zm serve --mcp`** (WC-MCP-1..10, WC-CMD-5). Un solo servidor ofrece los comandos
  de zm como las tres herramientas compartidas `zm_tools_search`, `zm_read`, `zm_write`, y ejecuta cada llamada como
  la línea de comandos. Las ocho herramientas fijas y las opciones de serve (`--meeting-context`,
  `--meeting-preparation`, `--semantic` y las demás) desaparecen; cada herramienta que añadían es un comando que el
  servidor ofrece. Los permisos del perfil deciden qué ofrece; por MCP un cambio de nivel `ask` se ejecuta sin
  preguntar, así que da al perfil de un agente `{"remote-meetings": "readonly"}` para que no cambie reuniones de
  Zoom. Las entradas MCP cambian `args` a `["<profile>", "mcp"]`; `zm serve` ahora lo indica. Se eliminan las
  exportaciones de la biblioteca `createMeetingMcpServer` y `serveMeetingMcp`.
- **`search meetings --model` ordena palabras y significado juntos** (cli-core 0.385.0 → 0.388.0). Buscaba solo por
  significado, ordenaba cada página por separado e ignoraba los filtros de reuniones. Ahora valen los filtros de
  fecha, reunión, serie, evento, persona, proyecto y etiqueta, una sola clasificación recorre las páginas, una línea
  hallada de ambas formas queda primera y se cita por su línea, y una pregunta ("what did we decide about
  pricing?") se busca por sus palabras de contenido, mientras que la búsqueda de palabras sola rechazaba el «?» y no
  hallaba nada sin él. La respuesta es una lista de resultados con `by`, `score` y `passage`; antes era un elemento
  con `items`. Un cursor de una versión anterior se rechaza.

## 0.34.0 — 22.10.2026

### Correcciones

- **Un almacén escrito por `cli-messaging` antes del cambio de nombre se rechaza de nuevo y no se toca** (cli-core
  0.385.0). Desde cli-core 0.382.0 un archivo así se abría y fallaba con `internal_error`; ahora falla con
  `configuration_error`.
- **`zm search meetings` nombra la zona en que leyó una fecha y da la ventana en UTC** (cli-core 0.384.0). Con
  `--since-time`/`--until-time`, la respuesta JSON incluye `meta.timezone` (la zona en que se leyó una fecha sin zona
  propia) y `meta.window` (`since`/`until` en UTC).

## 0.33.0 — 22.10.2026

### Cambiado — puede romper la compatibilidad

- **cli-core 0.380.0 → 0.382.0.** La copia de un archivo y la copia de la API de una misma reunión pasan a ser un
  solo registro al importar (el mismo ID de reunión de Zoom, con inicio a menos de 15 minutos); gana el registro de la
  API y el archivo solo completa una transcripción ausente. `from:"Name"` halla en todas las reuniones a un orador
  conocido solo por su nombre. La búsqueda también halla palabras que el reconocimiento de voz cortó («може» por
  «может») cuando no son palabras del diccionario. El almacén compartido pasa a la versión 28 al abrirse por primera
  vez (estado de los chats); las herramientas más antiguas siguen abriéndolo.

## 0.32.0 — 22.10.2026

### Añadido

- **`zm meetings import` lee las transcripciones `.txt` de zoom-searcher.** Se importan los archivos
  `YYYY-MM-DD_HHMM_topic.txt` con cabecera: el título y el inicio de la cabecera sustituyen a los del nombre del
  archivo, su ID de reunión de Zoom pasa a ser la clave de la serie (así la copia de la API de la misma reunión puede
  unirse cuando cli-core las fusione) y sus oradores pasan a ser participantes solo de esa reunión. Un `.txt` y un
  `.vtt` con el mismo nombre son una reunión; se lee el `.txt`. Un `.txt` que no se llama como una transcripción se
  omite. El resultado de la importación nombra la zona en que se leyeron las horas de los archivos (`timezone`), y
  `zm meetings import --help` muestra los nombres de archivo y esa zona.
- **La búsqueda de reuniones amplía palabras deformadas y lee el lenguaje de consulta** (cli-core 0.380.0): «риелтор»
  también halla «реелтора»; `OR`, `(groups)`, `-word`, `"phrases"`, `"a b"~N`, `exact:` y `from:"Name"`. Consulta
  [búsqueda](./search.md).

### Cambiado — puede romper la compatibilidad

- **Una consulta de búsqueda es ahora sintaxis, y una fecha sola es un día local** (cli-core 0.370.0 → 0.380.0,
  cli-base 0.49.0). `:`, `(`, `"`, `-` y `AND`/`OR`/`NOT` en `zm search meetings` significan sintaxis de consulta; una
  consulta solo de signos de puntuación es un error. `--since-time 2026-10-01` empieza a medianoche local, no a
  medianoche UTC; escribe una hora con `Z` para UTC. Los cursores de búsqueda de versiones anteriores se rechazan;
  busca de nuevo.
- **La hora del nombre de un archivo de transcripción se lee en la zona de este ordenador, salvo que se fije
  `files.timezone`.** Se leía en UTC, así que un archivo `2026-10-21_1000_…` de Madrid se guardaba dos horas tarde. Una
  configuración que nombra una zona la conserva; guardar otro ajuste ya no escribe `UTC` en `files_timezone`. El
  almacenamiento sigue en UTC.
- **Una hora de Zoom sin zona se lee en la zona de este ordenador, se marca y se nombra en un aviso.** Zoom documenta
  esa hora como local. Se leía en la zona que tuviera el proceso, sin avisar. Ahora se lee en la zona IANA del
  ordenador (UTC cuando el cambio de hora omite o repite esa hora), la reunión, el participante o el resumen recibe
  `metadata.issues: ["time_without_zone"]`, y el comando avisa una vez por stderr: "N Zoom times had no zone; read in
  <zone> and marked time_without_zone". Una hora mal formada se sigue rechazando. Las horas de las grabaciones no
  tienen metadatos, así que solo se cuentan en el aviso.
- **`zm recordings list` termina "hoy" en el día local, no en el día UTC.** Sin `--until-time` la lista terminaba en
  la fecha UTC, así que en Madrid entre medianoche y las 02:00 se detenía en ayer. Ahora toma el día de hoy en la zona
  del ordenador, o en la nueva `--timezone`, y `meta.timezone` la nombra.
- **La salida de texto que muestra una hora termina con `times in UTC`.** JSON, JSONL y MCP no cambian: UTC, con `Z`
  al final.

### Correcciones

- **La hora de una transcripción `.txt` se lee como el final de su grabación.** zoom-searcher nombraba los archivos y
  escribía `Дата:` con la hora de «creación» del portal de Zoom, que es cuando terminó la grabación. Ahora una reunión
  `.txt` empieza a esa hora menos el desplazamiento de su última línea y termina en ella, así que coincide con la copia
  de la API de la misma reunión.

## 0.31.0 — 20.10.2026

### Añadido

- **El almacén compartido pasa a la versión 25 al abrirse por primera vez** (cli-core 0.366.0): añade un historial de
  cambios de los chats para los mensajeros que lo comparten. No se envía nada.

### Correcciones

- **La comprobación de escenarios detecta un paso que la shell cambiaría** (cli-core 0.348.0 → 0.370.0): `>`, `|`,
  `;`, `$(` o un comodín fuera de comillas ahora hacen fallar las pruebas. Los pasos de zm ya estaban entre comillas.
  "Works with" toma el título del escenario de memo de cli-core, el mismo texto que muestran todas las herramientas.

## 0.30.0 — 19.10.2026

### Cambiado — puede romper la compatibilidad

- **`zm session start` funciona sin terminal, así que un agente puede pasar la URL de acceso.** Antes se negaba si stdin
  no era un terminal, y el acceso canalizado o con `--json` necesitaba `--interactive`. Ahora imprime
  `Open this URL to approve Zoom
  login:` y la URL en stderr, incluso con `--quiet`, y espera el retorno del navegador;
  solo la alternativa de pegar el retorno necesita un terminal. `--no-input` y CI siguen rechazándolo. `--interactive`
  se elimina: no hacía nada más.

## 0.29.0 — 19.10.2026

### Cambiado — puede romper la compatibilidad

- **`ZM_READ_ONLY` ahora funciona como `TG_READ_ONLY` en tg, max y wa: lee y copia, nunca cambia.** Las sincronizaciones
  que copian Zoom al almacén o a un archivo se ejecutan bajo él: `meetings sync`, `watch`, `recordings sync`,
  `recordings download` y `recordings schedule run`; antes el bloqueo las rechazaba. Los cambios en Zoom, el acceso,
  la configuración y lo que añadió el propietario (importaciones, vínculos, transcripciones, exportaciones, trabajos de archivo)
  siguen rechazándose con código 5, y el rechazo ahora indica de qué tipo era. La primera pantalla dice qué bloquea el candado.
- **`zm commands` sin `--json` imprime los comandos como texto, por sección** (Read, Write, Organise, Automate, Set
  up), una línea por comando con `(writes)` en los que cambian algo, en lugar de un array JSON.
  `zm commands --json` no cambia.
- **Adopta Core 0.348.0 y Base 0.47.0**, que se mueven juntos: un siguiente paso en la salida `--json` puede llevar `line`, el
  comando completo para escribir. Un consumidor del SDK que fije Core o Base junto a zoom se mueve con ellos.

### Seguridad

- **`ZM_READ_ONLY` rechaza `zm serve --mcp --semantic --base-url`**, cuyas consultas semánticas van a un servicio remoto
  de vectores; en 0.28.0 se ejecutaba bajo el bloqueo. El bloqueo de cli-core rechaza del mismo modo una consulta enviada a otro servicio.
  `meetings embeddings` se rechaza como creación de vectores, con ese motivo.

### Corregido

- **`zm meetings list --help` y `zm meetings projects evidence --help` imprimen su ayuda** en lugar de salir con código 2
  (cli-core 0.347.0). Ahora una prueba ejecuta `--help` en cada comando.
- **`zm guide --help` vuelve a través del manejo de salida propio de zm** en lugar de terminar el proceso por sí mismo.

## 0.28.0 — 18.10.2026

### Añadido

- **`zm guide [name]`: escenarios, los comandos de una tarea común en orden.** El paquete incluye cinco:
  `catch-up`, `find-quote`, `prepare-meeting`, `person-in-meetings` y `archive-recordings`; cada uno imprime su objetivo,
  cada paso como un comando con su porqué y qué mirar. `--json` da lo mismo como datos. En «Works with» la lista
  nombra `person-brief` de memo para una persona en todas las herramientas. La CI comprueba que el comando y las opciones de
  cada paso se analizan correctamente.
- **El `--help` de cada comando final termina con Returns, Next usually y Example**, y el documento de comandos lleva
  las mismas tres líneas bajo cada comando.
- `zm help options` imprime las opciones de todos los comandos; `zm help <command>` imprime la ayuda de ese comando.

### Cambiado — puede romper la compatibilidad

- **Adopta Core 0.345.0 y Base 0.46.0.** Un consumidor del SDK que fije Core o Base junto a zoom se mueve con ellos.
- **`zm --help` y `zm` sin argumentos muestran una primera pantalla corta** en lugar de la ayuda completa de commander: para qué
  sirve zm, qué puede hacer que un cliente de la API no haría, las otras herramientas de WireCat y adónde ir después (`commands`,
  `guide`, `help options`, `skill show`). Ya no enumera todos los comandos ni las opciones globales; `zm --help-all` imprime la
  ayuda anterior. Los códigos de salida no cambian.
- `meetings list` y `meetings projects evidence` rechazan una palabra que empieza por `--` como opción desconocida, con
  la sugerencia de commander, en lugar de leerla como texto de consulta; después de `--` cada palabra es consulta. Problema
  conocido: esto también rechaza su `--help` (código 2); `-h` y `zm help meetings list` muestran la ayuda.

### Seguridad

- **`ZM_READ_ONLY=1` hace que una ejecución no cambie nada.** Todo comando que escribe en Zoom, en el almacén de reuniones o en un
  archivo local —`meetings sync`, `import`, `export`, `link`, `update`, `transcribe`, `embeddings`, descargas de grabaciones y
  trabajos de archivo, `watch`, `config set`, `skill install`, `session start` y los cambios remotos de reuniones— se rechaza con
  código 5 antes de conectar con nada, vistas previas incluidas; también `search meetings --model`, que crea los vectores
  que faltan. Las lecturas, la búsqueda de palabras, `batch` y `serve --mcp` siguen funcionando.
  El bloqueo se decide por los efectos declarados de cada comando, así que un comando nuevo que escriba también se rechaza. Antes,
  la variable solo funcionaba en tg, max y wa.

### Corregido

- `skill install` y `skill show` informan de un error de uso, como `zm skill install --yes`, con el mismo error JSON
  y código 2 que cualquier otro comando, en lugar del texto plano de commander con código 1.
- `session start` con salida canalizada o JSON ya no dice «remove --no-input» cuando no se pasó esa opción. Ahora
  dice que añadas `--interactive`; sin terminal interactiva o en CI dice que ejecutes el acceso en una.
- Las guías de instalación y de sesiones comprueban `state: saved` en `session status`. Decían `logged_in: true`, que
  solo imprime `session start`.
- `meetings sync` sin `zoom.client_id` ahora dice que configures el ID de cliente, no que ejecutes antes `session start`.
- Un `--pause` incorrecto (como `0s`) ya no dice «timeout must be»; dice qué duración se espera.
- El origen del skill ya no lleva una `version` obsoleta; `skill install` estampa la versión del paquete.
- Las guías ahora dicen que `zm` no admite un argumento de perfil, cómo quitar el acceso del llavero, por qué varios usuarios
  de Zoom en un mismo equipo necesitan `ZM_CONFIG_DIR` separados y adónde van los archivos; los ejemplos de Memo en la guía de
  búsqueda coinciden con las opciones actuales de Memo; el número de herramientas MCP y las opciones opcionales están completos.

## 0.27.1 — 18.10.2026

### Corregido

- `meetings import` y `watch files` informan de una carpeta inexistente como `folder not found: <path>` (código de salida 6), de un archivo dado como carpeta como `not a folder` y de una carpeta ilegible como un error de permisos, en lugar de «esto es un bug».
- Un comando mal escrito, un argumento que falta o una opción desconocida ahora muestran qué falló (`unknown command 'lst'` con la sugerencia) en lugar de «command failed; use --help for usage». El código de salida sigue siendo 2.
- README: `search recordings <directory> <query>` sustituye a la eliminada `search meetings --archive`; el campo de paginación es `page.next_cursor`; el enlace a la hoja de ruta apunta a este repositorio.

## 0.27.0 — 18.10.2026

### Cambiado — puede romper la compatibilidad

- Adopta Core 0.342.0 y Base 0.45.0 publicados como una sola identidad de ejecución. Base movió sus tablas de lint, auditoría y
  vocabulario de `@wirecat/cli-base/standards` a `@wirecat/cli-base/standards/tables`; un consumidor del SDK que importe esas
  tablas, o que fije Core o Base junto a zoom, pasa a estas versiones a la vez. Los efectos y la salida de los comandos no cambian.

## 0.26.0 — 18.10.2026

### Añadido

- `meetings scheduled` lee una página acotada de posibles series Zoom con cobertura del calendario desconocida y fechas sin verificar. `serve --mcp --meeting-inventory` concede la herramienta separada de lectura `meeting_series_inventory`. El perfil elegido y la conexión de credenciales se fijan antes de leer al proveedor; ninguna ruta abre la base de reuniones ni infiere la próxima ocurrencia.

### Cambiado — puede romper la compatibilidad

- Adopta Core0.336.0/Base0.44.2 publicados con una única instancia de Base. El modo compartido de solo lectura rechaza más escrituras guardadas; conserva los metadatos de efectos y acceso sin conexión al leer el catálogo. Registrar el indicador no activa la herramienta sin que la aplicación la conecte. La nueva migración de Core exige el esquema actual para preparación de solo lectura; una lectura normal actualiza primero una base compatible anterior.

### Corregido

- La guía de gestión enlaza el descubrimiento de series con la verificación de ocurrencias al preparar; la guía de aplicación indica los permisos exactos para leer la agenda.
- La guía de proyectos indica la referencia principal en `meeting` del resultado de búsqueda; su propia `ref` de transcripción señala un pasaje y no sirve como entrada de esta revisión.

## 0.25.0 — 18.10.2026

### Añadido

- `meetings projects scan <ref>` propone proyectos existentes a partir de un fragmento acotado del título y la transcripción guardados. Conserva citas, ambigüedad y cobertura separada de evidencia y salida; abre la cuenta seleccionada en modo de solo lectura y no guarda vínculos. MCP expone `meeting_project_candidates` solo con `serve --mcp --meeting-project-candidates`.
- El SDK exporta `createZoomSeriesInventoryReader` para una página acotada de reuniones programadas, reutilizando el contrato de Core vinculado a la cuenta y la ventana temporal. Conserva fechas antiguas de series recurrentes como pistas, limita los bytes HTTP antes de analizarlos y descarta enlaces de acceso; elegir una serie exacta sigue requiriendo comprobar su próxima ocurrencia. La exposición del inventario por CLI/MCP queda para otro cambio.

### Cambiado — puede romper la compatibilidad

- Adopta Core 0.334.0 y Base 0.44.1 publicados con una única instancia compatible en ejecución. El catálogo de comandos puede incluir `runnable` para grupos y `offline: false` para comandos que requieren red; los clientes estrictos deben aceptar esos campos opcionales. Cada comando ejecutable declara sus efectos conforme a los estándares compartidos.

## 0.24.0 — 18.10.2026

### Añadido

- `meetings prepare` incluye coincidencias literales citadas de fuentes de mensajes, correo y documentos configuradas explícitamente. La selección pertenece al perfil local; MCP captura los ID al arrancar, las páginas son acotadas y la cobertura se conserva. La preparación abre el almacén existente en modo de solo lectura.

### Cambios — pueden afectar a los consumidores

- La preparación abre un almacén compartido existente compatible en modo de solo lectura y rechaza esquemas ausentes o antiguos. Actualiza el almacén mediante una lectura normal de reuniones guardadas antes de repetirla. Los conectores propios reciben la intención `preparation` y el contexto de fuentes capturado opcional; conserva el modo de solo lectura y cierra la conexión en todas las salidas.

### Corregido

- La publicación puede esperar el bloqueo compartido con `WIRECAT_RELEASE_WAIT_SECONDS`; por defecto sigue rechazando inmediatamente un bloqueo ocupado.
- La adopción de Core 0.332.0 y Base 0.43.2 publicados y compatibles incorpora contratos compartidos acotados de preparación, apertura del almacén de solo lectura y roles registrados para los indicadores de fuentes. Usa una sola instancia de Base. Los parámetros de correo compatibles de Core mantienen la preparación con fuentes seleccionadas en Node 22.16; Zoom habilita explícitamente la capacidad compartida de comunicaciones para CLI y MCP.

## 0.23.2 — 17.10.2026

### Corregido

- La capa compartida adopta Core 0.322.0 y Base 0.40.4 publicados; la validación y la salida usan una sola instancia de Base.
- La guía de arquitectura obtiene la versión del vocabulario compartido de la dependencia de ejecución en lugar de indicar una versión antigua de Base.
- La hoja de ruta enlaza el flujo ya disponible de revisión y registro de hallazgos de reuniones en Memo 0.58.0, en lugar de presentarlo como una función futura.

## 0.23.1 — 17.10.2026

### Corregido

- La adopción de Core 0.315.0 y Base 0.40.2 publicados incorpora el filtrado compartido de datos internos de adjuntos en las respuestas y la protección del modo de solo lectura de serve. Las instrucciones de actualización con pnpm eximen a los paquetes de la herramienta de la antigüedad mínima para poder instalar la versión actual.
- **Si falla la consulta de participantes, la sincronización conserva el número de participantes de la reunión.** Core 0.311.0 corrige `meetings sync` y `watch`: antes borraban el número guardado cuando no se podía leer la lista de participantes de Zoom.

## 0.23.0 — 17.10.2026

### Corregido

- Los bloqueos de los puntos de control conservan el protocolo publicado `.lock/owner.json`
  y la recuperación de bloqueos locales obsoletos, para impedir que escritores anteriores y nuevos
  posean el mismo punto de control a la vez. La escritura atómica compartida conserva las correcciones de
  limpieza y de carpetas accesibles mediante enlaces simbólicos.

### Añadido

- `meetings prepare --project <name-key-or-alias>` y el argumento MCP `project` añaden coincidencias
  citadas de palabras para un proyecto existente, incluidas reuniones sin vínculo del perfil y
  periodo elegidos. Hasta cuatro páginas acotadas de nombres conservan el estado sin confirmar,
  la cobertura del índice y la continuación; las coincidencias nunca asignan pertenencia al proyecto.

### Cambiado — puede afectar a los clientes

- Las aplicaciones que usan la biblioteca y actualizan desde 0.22.0 pasan los métodos de búsqueda
  de personas en `people` al llamar a `createMeetingContextCapabilities`. Sigue la adopción de áreas
  del almacén Core introducida en 0.22.1; no cambian los comandos ni las reglas de la cuenta elegida.

## 0.22.1 — 17.10.2026

### Corregido

- **Una configuración antigua camelCase indica qué clave renombrar.** Se adopta Core 0.307.0:
  zm responde `clientId is an unknown setting; rename it to client_id (and 3 more problems)`
  en lugar de `client_id is missing`, que no explicaba la corrección. Sigue mostrando una sola
  clave y nunca su valor.

## 0.22.0 — 17.10.2026

### Añadido

- La preparación incluye notas y anotaciones del dueño vinculadas directamente a las llamadas
  anteriores incluidas, mediante el servicio compartido de Core. Las notas de otras cuentas o
  reuniones no seleccionadas no se añaden solo por compartir proyecto.

### Cambiado — puede afectar a los clientes

- El almacén nativo devuelve la selección de notas `owner-written-meeting/person/project-notes`
  y una referencia `meeting` que puede ser null. Los almacenes personalizados anteriores conservan
  su selección y forma de respuesta.

## 0.21.3 — 16.10.2026

### Añadido

- Se adopta Core 0.304.0 publicado con Base 0.40.0. Los errores de configuración indican la
  primera clave incorrecta, un motivo fijo y cuántos problemas quedan, sin mostrar valores.
  Si falla una parte de una reunión, la sincronización conserva las partes disponibles y el cursor para reintentar.
- **zm arranca aproximadamente un quinto más rápido después de su primera ejecución.** Guarda
  el código compilado de Node en la carpeta temporal del sistema; `NODE_COMPILE_CACHE` cambia su
  ubicación. Es el mismo cambio de tg 0.62.0, memo 0.52.1 y drive 0.14.1.
- **Las solicitudes de token registran su resultado.** Cada inicio o actualización escribe en
  `<state dir>/runs/<date>/<run>/events.jsonl`: estado HTTP, si llegó un token de actualización
  nuevo, si se guardó en el llavero, tiempo agotado o cancelación e identificador del proceso.
  No registra el token, su hash ni una parte. Una orden que no pide tokens no crea una ejecución.

### Corregido

- Las descargas usan el adaptador compartido de Core para publicar archivos y recuperar
  interrupciones. Los formatos existentes de diarios y archivos Zoom siguen siendo compatibles;
  los archivos finales se verifican y sincronizan antes de guardar el manifiesto, y la recuperación
  conserva los archivos ajenos.
- **Una configuración inválida indica su archivo y primera clave incorrecta.** Antes todas las
  órdenes solo mostraban `zm config is invalid`. Ahora el mensaje indica archivo y clave, por
  ejemplo `client_id` en un archivo camelCase antiguo, nunca el valor. `doctor` sigue respondiendo
  con el problema en `config.error`; `config show` falla con el mismo mensaje.
- **`meetings sync` conserva las reuniones programadas.** Antes solo buscaba ocurrencias de
  reuniones recurrentes: guardaba la programada con el identificador de la lista y no encontraba
  participantes, transcripción ni resumen. Ahora resuelve cada reunión mediante las ocurrencias
  pasadas de Zoom y su inicio real. Si Zoom ya no devuelve ocurrencias, la omite y continúa.
  Añade una petición por reunión y requiere `meeting:read:list_past_instances` para todas.
- **`bin/release` se reinicia una vez cuando la publicación incorpora una versión nueva del propio
  script.** Unificar el historial adelanta `main`, y antes el intérprete mezclaba texto antiguo y
  nuevo. Ahora ejecuta la versión nueva; un segundo cambio lo detiene con `run it again`.
  Solo afecta a la publicación del repositorio, no al paquete publicado.

## 0.21.2 — 16.10.2026

### Añadido

- Se adoptan Core 0.299.0 y Base 0.40.0 con una única copia de Base. El catálogo de comandos
  declara watch/MCP como persistentes y el inicio de sesión como interactivo; los plazos usan
  esos metadatos compartidos. Se conservan los límites de comandos finitos y el plazo explícito.

### Corregido

- Los archivos parciales de grabaciones usan el adaptador nativo compartido de Core. Conservan
  nombres, formato de puntos de control, opciones de reanudación y errores de cancelación de Zoom.
  Una cancelación durante la última sincronización a disco no devuelve confirmación de finalización.
  Otros proveedores de reuniones pueden usar el mismo adaptador.
- Las instrucciones del agente describen correctamente la reanudación de un rango verificado
  y el reinicio seguro de la descarga.
- **El diagnóstico de publicación distingue los propietarios actuales del bloqueo de una etiqueta antigua.**
  Ya no atribuye un bloqueo activo a una ejecución anterior; espera a que terminen sus propietarios
  y vuelve a intentarlo.

## 0.21.1 — 16.10.2026

### Corregido

- El flujo de publicación comprueba el commit exacto enviado por `bin/release` antes de compilar:
  una fusión concurrente no puede sustituir silenciosamente el código elegido para publicar.
- El archivo de grabaciones usa los bloqueos de escritura nativos compartidos de Core, conservando
  los nombres de marcadores y los comandos de consulta/recuperación. Rechaza un marcador propio
  ausente o sustituido antes de descargar archivos; la liberación a cargo de la operación termina
  incluso tras la cancelación y conserva los registros sustituidos.

## 0.21.0 — 15.10.2026

### Añadido

- `batch <file>` ejecuta búsquedas por palabras y lecturas de pasajes en un lote limitado, con
  una conexión al almacén y una pasada limitada de indexación. JSON/JSONL conserva por separado
  los ID, respuestas, errores, cursores y cobertura; texto y Markdown usan pasajes compactos.
  El archivo y stdin se validan antes de abrir el almacén. Los presupuestos de lectura y salida
  conservan una entrada para cada petición, incluidas las que no llegaron a ejecutarse.

## 0.20.1 — 15.10.2026

### Corregido

- La preparación MCP mantiene el elemento dentro del límite de bytes tras hacer visibles los
  caracteres ocultos. Conserva las fuentes de reuniones antes que notas y hechos aceptados,
  indica omisiones y cuenta los bytes del texto que recibe el cliente. Rechaza los metadatos
  que no caben.

## 0.20.0 — 15.10.2026

### Añadido

- La preparación incluye notas y anotaciones del dueño sobre personas vinculadas explícitamente
  y proyectos globales confirmados mediante el servicio compartido de cli-core. Conserva referencias,
  revisiones y cobertura separada; las fuentes de reuniones y los hechos aceptados tienen prioridad.
  Los documentos importados, correo, mensajes y candidatos por alias del proyecto quedan fuera.

## 0.19.0 — 15.10.2026

### Cambios — pueden romper compatibilidad

- Los estándares compartidos usan cli-base 0.33.0 y cli-core 0.288.0. `meetings link --source <accounts>`
  sustituye a `--target-accounts` para cuentas numéricas adicionales explícitas del almacén al buscar
  una persona. Actualiza los scripts a `--source`: no hay alias del nombre anterior. La base de
  incidencias del control de comandos baja de 27 a 26 sin nuevas excepciones.

### Corregido

- La documentación refleja cli-core 0.286.0 y posteriores: abrir `wirecat.db` conserva los archivos
  antiguos `messages.db` y sus archivos auxiliares de SQLite. Su conservación se gestiona aparte.

## 0.18.0 — 15.10.2026

### Añadido

- La preparación incluye en `knowledge` hechos aceptados sobre personas vinculadas explícitamente
  y proyectos globales confirmados, incluidas decisiones registradas fuera de la reunión. Conserva
  referencias e indicadores de más filas y límites de salida; las fuentes de reuniones tienen prioridad
  de bytes. La evidencia no se revalida y no se consultan notas, correo ni mensajes. El SDK común Core
  implementa el comportamiento.

## 0.17.1 — 15.10.2026

### Corregido

- Las respuestas MCP muestran caracteres ocultos en transcripciones, títulos, nombres y notas,
  como tg y max: caracteres de etiquetas, controles de dirección, espacios de ancho cero, U+FEFF,
  C1 y otros controles se escapan en el texto y contenido estructurado de todas las herramientas,
  incluidos errores; ANSI escape se lee como `\x1b`. El límite cuenta la respuesta escapada. Cada
  descripción y las instrucciones del servidor indican que el texto ajeno es dato, no instrucción.
  Cirílico, emoji y banderas no cambian; el CLI `--json` conserva el original. Core 0.285.0 actualiza
  el almacén común a versión 16: las tablas y disparadores nuevos permiten usar herramientas anteriores.
- Las pruebas sin conexión eliminan sus carpetas temporales tras cerrar recursos. Las trazas actual
  y anterior permanecen en `coverage`, en lugar de acumular carpetas de copias temporales.

## 0.17.0 — 15.10.2026

### Añadido

- La preparación incluye reuniones guardadas citadas de otras series mediante vínculos existentes
  a personas o proyectos compartidos confirmados. El periodo de la cuenta, la cobertura independiente
  de filas relacionadas y el presupuesto JSON compartido acotan el informe. Las fuentes de la serie
  elegida tienen prioridad; nombres y palabras no crean asociaciones. CLI y MCP opcional comparten
  el servicio de Core.

## 0.16.0 — 15.10.2026

### Cambios — pueden afectar a quienes llaman al programa

- Los indicadores usan los nombres comunes de cli-base: `recordings download`, `recordings sync` y
  `recordings schedule create` aceptan `--output-dir <dir>` en vez de `--destination`, y `watch` usa
  `--pause` en vez de `--interval`. Se retiran los nombres antiguos. Los valores también comparten
  nombres: `--at <hh:mm>`, `--max-entries <n>`, `--models-dir <dir>`, `--start-time <time>`, `--title <title>`.

## 0.15.0 — 15.10.2026

### Cambios — pueden afectar a quienes llaman al programa

- Los selectores JSON anidados usan el proyector de Base. Las rutas con puntos recorren objetos y
  matrices conservando cobertura, paginación y metadatos de ejecución. Los resultados de reuniones
  incluyen título, fecha y referencia/enlace de origen para citar sin otras lecturas. La selección
  compacta de pasajes y las instrucciones incluidas siguen las mismas reglas.
- La configuración usa snake_case sin reescritura automática y el arranque ya no traslada carpetas.
  Antes de actualizar, renombra los campos antiguos y elige explícitamente las carpetas actuales.
  El alias de comando `zoom.clientId` sigue escribiendo `client_id`.

## 0.14.0 — 15.10.2026

### Cambios — pueden afectar a quienes llaman al programa

- `recordings download` y `recordings sync` necesitan un perfil elegido. El archivo pertenece a esa cuenta; sin `account.profile` devuelven `configuration_error`. El SDK exige `DownloadOptions.account`, y `syncRecordingArchive` recibe un servicio con `catalog`.
- El SDK retira `ZoomError`: los errores usan `CliError` de cli-base. Las capacidades de `StoreConnection` son obligatorias; se retiran `StoreConnectRequest.capability` y `StoreConnection.appendTranscripts`. `ProgramDeps` deja de aceptar sustituciones de capacidades; `createStoreConnector` recibe un almacén cli-core completo.
- El terminal imprime los elementos con el renderizador común de cli-core y los siguientes pasos en stderr. JSON y JSONL conservan su formato.
- `--json=id,title` sustituye a `--fields`: el estándar común `--json [fields]` se procesa con `liftJson`, como en tg, max, drive y memo. Los campos se eligen con `--json`, no con `--jsonl`; se rechazan los desconocidos mostrando los disponibles. Adopta Core 0.280.0.
- `zm search recordings <directory> <query>` sustituye a `zm search meetings <query> --archive <directory>`. La búsqueda del archivo devuelve las coincidencias de `search all`: `ref` (`recording:<file id>/<cue position>`), `title`, `timestamp`, `excerpt`, `sender_name`, `offset_ms`; `account` es la carpeta del archivo. Funciona `--json=ref,excerpt`. Se retiran `--archive`, `--uuid`, `--file-ids` y `--max-bytes` de `search meetings`; el comando nuevo acepta solo `--limit`. Para una ocurrencia, un archivo o una transcripción de más de 8 MiB usa `recordings archive transcript`.
- El archivo de ajustes usa snake_case: `client_id`, `files_folder`, `files_timezone` y `account_profile`. La orden documentada es `zm config set zoom.client_id`; todavía acepta `zm config set zoom.clientId`. Al leer un archivo antiguo lo reescribe en snake_case, conservando su modo de acceso. Rechaza valores contradictorios entre ambas grafías.

### Añadido

- `meetings prepare <series-id>` lee la prueba de la próxima cita de una serie elegida y su historial guardado acotado: transcripciones citadas, participantes observados, proyectos confirmados, hechos aceptados y tareas con fuentes directas. Conserva citas y cobertura juntas; no acepta hallazgos. `serve --mcp --meeting-preparation` habilita el `meeting_prepare` opcional.
- El SDK ofrece `createZoomUpcomingMeetingReader`: convierte detalles acotados de Zoom al lector compartido de prueba de ocurrencia; los calendarios ausentes y la recurrencia incompleta quedan sin verificar. Lo usa el flujo compartido de preparación.

### Corregido

- Los IDs remotos con saltos de línea finales se rechazan antes de autenticar.
- Una descarga recupera el bloqueo de un proceso terminado en este equipo sin `recordings archive recover --yes`. Los bloqueos activos, ajenos o desconocidos siguen rechazándose.
- Repetir la descarga no recalcula el hash de todos los archivos: tamaño y fecha de modificación sin cambios en `.zoom-verified.json` permiten usar la última verificación. Cualquier cambio vuelve a calcularlo; `recordings archive check` siempre comprueba todos.

## 0.13.0 — 14.10.2026

### Cambios — pueden afectar a quienes llaman al programa

- Adopta cli-base 0.28 y la política compartida de respuestas de Core 0.273. La lista de comandos
  usa el contrato 3 con efectos locales y remotos separados. Las listas JSON incluyen el modo de
  página y `next_cursor`; JSONL emite registros item y end, incluso para resultados vacíos. Los
  scripts que leían una respuesta completa por línea deben leer `data`, la página y la indicación final de si el resultado está completo.
- Las respuestas correctas de CLI/MCP incluyen metadatos completos. Las fuentes de búsqueda
  omitidas indican resultados parciales y problemas por fuente. Las políticas compartidas
  comprueban los siguientes pasos disponibles y si es seguro repetir la operación.

## 0.12.0 — 14.10.2026

### Añadido

- Evidencia del nombre, clave y alias de un proyecto existente mediante `meetings projects evidence` y MCP `meeting_project_evidence` compartidos. La lectura conserva fuentes, continuación ligada a la cuenta y fechas fijas, y cobertura desconocida explícita, sin actualizar índices ni aceptar pertenencia.

### Corregido

- Las guías de búsqueda/MCP sitúan la continuación de los informes dentro de `item` y omiten el campo de selección retirado de la búsqueda por palabras.

## 0.11.0 — 14.10.2026

### Cambios — pueden afectar a scripts

- Usa el SDK compartido `@wirecat/cli-core` 0.268.0. El descubrimiento declara el contrato 2. Las respuestas correctas de CLI/MCP usan sobres de elemento/lista snake_case con metadatos; JSONL conserva respuestas completas. Informes detallados y confirmaciones continuas están en `item`.
- Los detalles están en `item` y cuentan transcripciones actuales; las lecturas de transcripciones/resúmenes usan `items`. Las coincidencias incluyen `ref`, `meeting`, `excerpt` y `offset_ms`, con continuación estándar que conserva los filtros.

### Correcciones

- MCP rechaza argumentos desconocidos/incorrectos en el manejador, nombra el campo antes de abrir el almacén, declara esquemas estrictos de éxito/error y conserva motivos/detalles de errores compartidos.
- La guía de la app de Zoom comienza con enlaces para reutilizar una app o crear la propia.
- La instalación ofrece ayuda del agente, opciones de app existente/nueva, lanzadores de Windows y comprobación del primer pasaje con fuente. La portada se identifica como punto de inicio.

## 0.10.0 — 14.10.2026

### Cambios — pueden afectar a scripts

- Usa el SDK común de reuniones `@wirecat/cli-core` 0.267.0 y la base CLI `@wirecat/cli-base` 0.27.2.
- Las listas guardadas filtran mediante consultas de metadatos en lugar de los parámetros de lista `--since-time` y `--until-time`. La entidad común tiene IDs de texto y referencias de proveedor/cuenta, con `page` y pasos de continuación. JSONL conserva el sobre completo de la lista.
- La búsqueda de participantes devuelve observaciones acotadas snake_case con `identity_id`, ambigüedad de la página y cobertura explícita. JSONL conserva la continuación en vez de emitir solo observaciones. Sigue `page.next` o `page.cursor` incluso en una página vacía.

### Añadido

- `meetings people` y MCP `meeting_people` limitan coincidencias, observaciones examinadas y bytes leídos de nombres/correos mediante `--limit`, `--scan-limit`, `--max-read-bytes` y `--cursor` (argumentos MCP en snake_case). Los cursores retienen la cuenta y la consulta de nombre; no se deducen vínculos con personas.

### Corregido

- Los enlaces existentes a la primera sincronización, la búsqueda guardada y la preparación explícita de vectores siguen funcionando tras renombrar los comandos.

## 0.9.0 — 14.10.2026

### Cambiado — puede afectar a scripts

- **Usa `@wirecat/cli-core` 0.264.0** (nuevo nombre de cli-messaging) **y `@wirecat/cli-base` 0.27.1.**
- **Todas las claves que escribe zm usan snake_case**, tanto en stdout como en sus resultados MCP:
  `config show` (`account_profile`, `client_id`, `files_folder`, `files_timezone`), `doctor` y `session status`
  (`data_profile`, `expires_at`), `session start` (`logged_in`), grabaciones, archivos y trabajos
  (`manifest_path`, `timer_state`, `checkpoint_revision`, `job.capture.client_id`),
  `meetings update|link|transcribe|evidence|context`, `search meetings`, `search all` y `watch`
  (`has_more`, `next_cursor`, `meeting_id`, `transcript_rows`). `--fields` acepta estos nombres.
  `commands --json` incluye `global_options`, `inherited_options` y `exit_codes`; su `contract` es 1.
  Los comandos de cli-core (`meetings list|show|transcript|summary|export|people`) conservan sus claves
  hasta que cli-core las cambie.
- **`search all --meeting-cursor` y el argumento MCP `meeting_cursor` de `search_all` aceptan el cursor
  snake_case** que devuelve `meetings.next_cursor` (`account_id`, `query`, `meeting_offset`, `hit_offset`).
- **Un error ocupa una línea en el terminal** (`✗ message`); en una tubería o con `--json`/`--jsonl`,
  se devuelve el objeto JSON. Un fallo de inicio es `internal_error` con salida 1, no `configuration_error`.
- **El origen de `watch` es el primer argumento en lugar de `--source`:** `zm watch api` o
  `zm watch files [folder]`. Sin argumentos se aplica el ajuste `source`.
  Una carpeta sola (`zm watch ./downloads`) ahora da error; usa `zm watch files ./downloads`.

### Añadido

- `meetings passage <ref>` abre una coincidencia de transcripción y sus líneas cercanas con fuentes
  en texto, Markdown o JSON. `--before-n`, `--after-n`, los presupuestos de bytes y la cobertura limitan
  la respuesta; las revisiones guardadas y la comprobación opcional de huellas conservan su fuente.
  MCP ofrece el mismo `meeting_passage` ligado a la cuenta al activar `--meeting-context`.
- **`--debug`:** si falla, muestra el registro completo con causa y pila, después del objeto de error
  o en lugar de la línea corta.

### Corregido

- README distingue Public Client ID y Client Secret, explica permisos manuales y manifiesto opcional,
  y usa el comando de login y la dirección de documentación actuales. La cobertura distingue los
  datos guardados disponibles de las transcripciones archivadas por separado.
- La guía de seguridad explica indexación automática y generación de vectores ausentes, incluida
  la entrega de pasajes a un servicio remoto elegido explícitamente.
- La guía MCP enumera siete herramientas predeterminadas tras consolidar búsquedas; la de gestión
  aclara que el permiso de lista debe añadirse manualmente.
- La búsqueda distingue generación CLI de vectores ausentes y lectura MCP de vectores existentes;
  las guías usan `session start` para login y `--cursor` para continuar las fuentes.

- **`zm meetings import <folder>` y el origen de archivos leen una transcripción cada vez.** Antes abrían todos los `.vtt` a la vez. Se rechaza antes de leer un archivo de más de 10 MiB, el límite existente de descarga de transcripciones. Una carpeta con más de 10 000 transcripciones se rechaza pidiendo mover parte a otra carpeta.

## 0.8.0 — 13.10.2026

### Cambiado — puede afectar a scripts

- **Runs on `@wirecat/cli-messaging` 0.258.0 and `@wirecat/cli-base` 0.24.0.**
- **The shared store and models move to the WireCat folder** (`~/.local/share/WireCat/` on Linux and macOS,
  `%LOCALAPPDATA%\WireCat\Data\` on Windows) on the first start of zm, as tg, max and memo do. Nothing moves when
  `MESSAGING_STORE` or `WIRECAT_STATE_DIR` is set. Two different stores under the same name stop the command with
  an error naming both paths; nothing is changed.
- **Meeting ingestion moves under `meetings`.** The old names stop working:
  - `zm pull` → `zm meetings sync`, with `--since` → `--since-time`
  - `zm import <folder>` → `zm meetings import <folder>`
  - `meetings list --since`/`--until` → `--since-time`/`--until-time`
- **One error object:** `{ error: { code, reason, message, … } }` on stderr and in MCP results. A failure that is
  not a typed error is `internal_error` (exit 1) and replaces `generic_failure`, also in `commands --json`
  `exitCodes`.
- **`zm commands --json` prints the shared commands document**: `cli`, `version`, `contract`, `description`,
  `globalOptions` (was `options`), `commands` and `exitCodes`; a command path adds `scope` and `inheritedOptions`.
- `zm commands` without `--json` lists one row per command: usage, description and whether it writes.
- **Commands renamed to the shared command words.** The old names stop working:
  - `zm login` → `zm session start`
  - `meetings link-person` → `meetings link`; `meetings link-event` → `meetings update`
  - `recordings archive inspect` → `recordings archive show`; `recordings archive verify` → `recordings archive check`
- **Options renamed.** The old names stop working:
  - `recordings list|sync --from`/`--to` → `--since-time`/`--until-time`; `recordings sync --recheck-from` →
    `--recheck-since-time`; `recordings schedule create --from` → `--since-time`
  - `watch --since` and `meetings context --since` → `--since-time`
  - `meetings evidence --after` → `--cursor`
  - `meetings task-proposal --kind` → `--type`
  - `remote-meetings create|update --topic` → `--title`
- **One meeting search, `zm search meetings <query>`, that indexes on its own.** It replaces four commands, which
  stop working:
  - `meetings search` and `meetings search-page`: their filters all move over, including `--event-id` and
    `--series-id`; `--since`/`--until` are `--since-time`/`--until-time` and `--after` is `--cursor`.
  - `meetings search-index`: gone. The search indexes what was stored since the last search before it reads.
  - `meetings semantic`: `search meetings <query> --model <model>` (with `--base-url`, `--dims`,
    `--max-chunks`, `--max-rows`, `--max-text-bytes`; `--after-chunk-id` is `--cursor`). It first builds the
    vectors that are missing for that model.
  - `recordings archive search <directory> <query>`: `search meetings <query> --archive <directory>` (with
    `--uuid`, `--file-ids`, `--max-bytes`).
  - MCP: `meetings_search`, `meeting_search_page` and `meeting_semantic_search` are one tool,
    `search_meetings`. With `serve --semantic`, `by_meaning: true` ranks existing vectors; MCP never builds
    them.
- Value names in help now say what they hold: `--limit <n>`, `--model <model>`, `--max-read-bytes <bytes>`,
  `--max-text-bytes <bytes>`; every argument has a description and long summaries are shorter.

## 0.7.3 — 12.10.2026

### Añadido

- `meetings search-page` combina fechas con `--identity-id`, `--person-id`, `--project`, `--tag` o `--topic`. Los nombres, claves y alias explícitos de proyectos se resuelven mediante el vocabulario compartido; los proyectos requieren pertenencia confirmada y las etiquetas deben estar asociadas explícitamente a la reunión. Los filtros de participantes seleccionan reuniones y no atribuyen intervenciones.
- MCP de solo lectura `meeting_search_page` ofrece la misma búsqueda acotada en la cuenta elegida por el servidor.

### Corregido

- Zoom ya no duplica el registro y la validación comunes de búsqueda: cli-messaging los mantiene, junto con la selección canónica y el manejo MCP, para reutilizarlos en otros proveedores de reuniones.
- Vitest pasa directamente a Oxc la configuración publicada del compilador cli-base; TypeScript sigue comprobando la configuración completa del proyecto.

## 0.7.2 — 12.10.2026

### Corregido

- **Compilado con el framework compartido bajo su nuevo nombre, `@wirecat/cli-base` 0.21.0**, y `@wirecat/cli-messaging` 0.253.0. El framework antes se llamaba `@wirecat/cli-core`; la instalación contiene una sola copia. No cambian los comandos `zm`.
- Instrucciones completas para configurar o reutilizar una app, recuperar el retorno del navegador y comprobar el primer resultado; corregidas las afirmaciones sobre permisos del manifiesto inicial y aclarados los límites de cuenta y datos.
- Los ejemplos de notas y hechos de reuniones usan comandos admitidos de Memo, incluida la creación de notas en una cuenta concreta. La hoja de ruta distingue los flujos disponibles de la futura incorporación de reuniones y preparación. La configuración Zoom usa un único ejemplo reemplazable de ID de cliente.

## 0.7.1 — 11.10.2026

### Corregido

- Reuse shared native file-safety and bounded WAV helpers from `cli-messaging` instead of
  maintaining provider-local copies. Archive verification and local transcription keep their
  existing limits and preview behavior.

## 0.7.0 — 11.10.2026

### Cambios que pueden afectar a consumidores

- **Built on `@wirecat/cli-messaging` 0.246.0, which now contains the meetings code.** zm imports
  `@wirecat/cli-messaging/meetings` and no longer depends on `@wirecat/cli-meetings`; commands and data are
  unchanged. A script that imported `@wirecat/cli-meetings` from zm's install folder imports
  `@wirecat/cli-messaging/meetings` instead.

### Añadido

- **A front-page README** introduces `zm` as Zoom context for AI agents: quick start, scenarios and
  an honest list of what is not ready come first, then a reference by task with links to new `docs/`
  pages for installation, sessions, usage, the archive, search, topic search, MCP, remote meetings,
  configuration, troubleshooting and security, listed in `docs/meta.json`.

## 0.6.0 — 11.10.2026

### Cambios que pueden afectar a consumidores

- **On macOS zm keeps its files where it does on Linux**: `~/.config/zm`, `~/.local/share/zm` and `~/.cache/zm`
  instead of `~/Library/…`. The first run moves the old folders there and copies the saved login to the keyring
  name of the new config folder, so no new `zm login` is needed. If the move cannot happen it prints one warning
  and uses the old folders for that run. Linux and Windows are unchanged. Built on `@wirecat/cli-messaging` 0.241.0 and
  `@wirecat/cli-meetings` 0.4.2, which npm installs side by side with cli-core 0.20.0.

## 0.5.1 — 11.10.2026

### Corregido

- **Shared facts compatibility** pins the published producer 0.237.0, supplies its required facts
  port to meeting context services, and retains scoped event/person links after the facts migration.
  The update includes the producer's meeting-account purge and attachment-piece fixes.

## 0.5.0 — 11.10.2026

### Añadido

- **Explicit meeting links** preview or apply event and participant/person associations in the
  shared store. Writes check live account ownership and optional prior values, keep manual identity
  audit and involvement records current, and support deliberate target-account selection.
- **Bounded word search and indexing** page hits inside a large meeting and match literal prefixes
  or configured English/Spanish/Russian word forms. Explicit indexing processes small local batches;
  read coverage reports pending work and unknown completeness.
- **Local WAV transcription** previews media without recognition and uses an already installed
  shared speech model only with explicit `--yes`. PCM16 mono/stereo WAV at 16 or 48 kHz is processed
  in bounded windows, with coarse timestamps and separate media/model provenance. Provider
  transcripts remain intact; reruns retain local history. No model download or large dependency is added.
- **Exact archive import receipts** report transactional created, inserted, replayed and superseded
  counts on the current shared store. Committed receipts survive late cancellation; malformed
  acknowledgements preserve uncertain outcomes and never trigger a second write.
- **Memo integration guidance** uses the existing meeting notes, tags and memory commands and shared
  records, without adding duplicate Zoom knowledge commands.

## 0.4.0 — 11.10.2026

### Añadido

- **Profile-bound recording resume** retains independently verified partial bytes and resumes only
  with matching strong validators and response ranges. Owned promotion journals recover the gap
  between final publication and manifest commitment without adopting unrelated files.
- **Durable archive progress** saves lease-protected checkpoints, retains unavailable assets for
  retry and supports recent discovery rechecks plus bounded pages/entries. Prior acknowledgements
  do not certify current disk integrity or complete provider availability.
- **Daily archive jobs** preview captured profile/client/destination/runtime settings and install
  Linux systemd user timers only with explicit `--yes`. Jobs use durable sync and recent rechecks;
  changed profile/client configuration fails before credentials. Other platforms support planning
  and manual runs. Disabling preserves job definitions and archived files.
- **Provider-neutral SDK reuse** moves management validation, transfer rules, catalog sync and
  schedule planning into cli-meetings 0.3.0. Public Zoom adapters expose optional shared capabilities;
  authentication, URL trust and native storage remain in this package.

### Cambios que pueden afectar a consumidores

- Configured local profiles enable persistent resume by default. Explicit `--resume` requires a
  profile; `--no-resume` and legacy unscoped calls retain ephemeral transfer behavior.

## 0.3.2 — 11.10.2026

### Corregido

- Explicit shared mail search finds email stored in dedicated mail tables alongside older imports,
  without duplicate email locators. Mail reads include stored email accounts; message reads use
  the selected local account.

## 0.3.1 — 11.10.2026

### Corregido

- Package references, documentation and fixtures use the WireCat namespace throughout.

## 0.3.0 — 11.10.2026

### Cambios que pueden afectar a consumidores

- **Shared store security policy** deletes legacy unencrypted `messages.db` and its SQLite sidecars
  on default-path store open, without migration. Explicit paths and `MESSAGING_STORE` preserve the
  files; an active legacy lock defers deletion until a later default-path open.

### Corregido

- **Offline remote-model checks** refuse remote semantic requests before store or model work.
- **MCP profile selection** stays fixed after its first tool read, including across config edits.
- **Acknowledged embedding receipts** survive late cancellation within a bounded output grace period.
- **Archive file replacement checks** verify the opened object and path before reading bytes,
  including on Windows where no-follow file-open flags are unavailable.

### Añadido

- **Archive transcript import** verifies every selected VTT before opening the store, then appends
  atomically by occurrence UUID. It retains corrections and unrelated meeting data, preserves the
  pull cursor, and emits per-occurrence acknowledgements without inventing replay counts.
- **Bounded evidence, person context and task proposals** use public producer services, selected
  account ownership and durable revision/cue references. Proposals never create tasks.
- **Shared resource search** defaults to meetings, with explicit broader resource selection,
  bounded candidate scans and reports that preserve skips, coverage and continuation cursors.
- **Explicit meeting vectors** preview generation by default; `--yes` rebuilds and embeds one
  bounded current-revision batch. Installed local models or explicit remote endpoints are required.
  Read-only semantic queries rank scanned existing candidates and expose their coverage limits.
- **Optional read-only MCP tools** add context, meetings-only unified search and fixed-model
  semantic queries. Embedding generation and task creation remain outside MCP.
- **Generated command reference and measured test matrix** reuse cli-core's generators. Release
  and manual validation install the checked tarball on Linux and Windows with Node 22.16 and 24.

## 0.2.2 — 10.10.2026

### Corregido

- **One shared meeting model** aligns cli-messaging 0.219.0 with cli-meetings 0.2.4, so the Zoom
  commands and native meeting adapter resolve the same package version.

### Cambios que pueden afectar a consumidores

- **Shared store baseline** adopts automatic log pruning, checked at most daily on store open or
  log writes: agent audit records older than 90 days are removed, and handled bot-update payloads
  older than 30 days are cleared while their delivery rows remain.

## 0.2.1 — 10.10.2026

### Añadido

- **Offline archive transcript reads and search** verify manifest size and SHA-256 before parsing
  WebVTT. Select occurrences or files, bound per-file reads and results, and search literal cue text
  without login or a meeting database. Successful finite output is withheld if verification fails.
- **API foreground watching** repeatedly pulls the configured source with an optional late-part
  lookback. File watching retains its positional folder form. Configuration is captured before the
  first cycle; cycles serialize ingestion and close each store connection before emitting a receipt.

## 0.2.0 — 10.10.2026

### Añadido

- **Persistent meeting data** connects the published shared SQLite adapter lazily. Imports and pulls
  register the selected local profile; reads resolve it without registration. Summary/history reads,
  Markdown/VTT exports, folder watching and MCP now use real persistence in the executable.
- **Recording history synchronization** splits explicit date ranges into monthly requests and emits
  serial occurrence receipts with verified skipping. Folder watching rescans corrected transcripts
  and closes each ingestion connection before its receipt; headless streams require JSONL.
- **Read-only MCP serving and packaged agent instructions** reuse the shared meeting tools and
  cli-core skill installation. MCP reads use the selected account and close before responding;
  discovery opens no database. Native reads require a selected profile with stored meeting data.
- **Cloud recording archives** discover assets and stream available video, audio, VTT and chat files
  into a local archive with checksummed manifests, verified skipping, bounded transfers and explicit
  stale lock recovery. Archive inspection and verification do not need Zoom or a meeting database.
- **Simple remote meeting commands** list, show and retrieve invitations, and preview creation,
  updates and cancellation. `--yes` applies once; `--dry-run` always previews. Dispatched writes with
  an uncertain result are reported separately and never automatically retried.
- **Command discovery and local diagnostics** expose command metadata/examples, shell completion,
  local runtime/config checks and saved OAuth session status without opening the meeting database.
  Session status distinguishes OAuth login from the selected local data profile.

### Cambios que pueden afectar a consumidores

- **Native store runtime prerequisites** add the published cli-messaging 0.218.0 dependency.
  Node now requires 22.16 or newer within 22.x, or version 24 or newer, matching its SQLite runtime.
- **Shared CLI output and errors** use cli-core rendering and exit codes. Piped output is JSON;
  terminal output uses human-readable rendering. `--quiet` suppresses non-error diagnostics.
- **Unattended login fails promptly.** CI and terminals without interactive input cannot launch a browser;
  Piped or JSON login with an input terminal requires `--interactive`.

### Corregido

- **Cancellation and output cleanup** close file handles when cancellation arrives during open,
  wait for submitted writes and drain, and preserve completed stream receipts with a bounded grace.
  Failed close or file output never emits a successful result; existing exports are never overwritten.
- **OAuth grants remain bound to their client.** Configuration changes cannot save tokens under a
  different client key. Successful malformed or interrupted grants report an uncertain outcome and
  require login before retrying.

### Seguridad

- Fast secret checks remain on PRs; source, production dependency and workflow security checks run before publication. Automatic Socket checks are disabled.

## 0.1.1 — 10.10.2026

### Añadido

- **Local account profiles and lazy connections** let library callers select a stored account, open
  only for store commands and close after success or failure. The standalone SQLite binding remains
  pending the shared store release.
- **Bounded late-transcript recovery** exposes `pull --lookback-days` from zero through 31 days.
  Zoom uses the shared cli-meetings 0.2.3 package.

## 0.1.0 — 10.10.2026

### Añadido

- **`zm login`** uses public-client PKCE through the browser callback, validates state, accepts
  pasted callback parameters, and saves tokens in the system keyring. Refresh uses the client id
  without a secret; actual token scopes are retained.
- **The API source** reads occurrences, participants, transcripts and summaries. Rejoin sessions
  are grouped by stable participant identity; missing scopes are named without exposing response
  values in errors.
- **The files source and commands** import legacy WebVTT filenames and expose shared meeting reads.
  Import and pull use the memory store in tests; real ingestion awaits the shared SQLite adapter.
- **Installed-package acceptance checks** exercise the real bin with isolated config and guards
  against network, browser and keyring access. A CI release workflow builds and packs before a
  separate trusted-publishing job; tagging follows registry verification.

### Corregido

- **File occurrence ids** use the original filename date, clock and topic, so correcting the
  configured timezone updates the existing meeting instead of creating a duplicate.
- **OAuth and CLI recovery** fail promptly when a browser cannot launch without paste input;
  help and version work with malformed config. Token transport and malformed-response errors are
  classified without exposing arbitrary response text. CLI version follows package metadata.
- **Source fidelity** validates every transcript redirect and bounds downloads, deduplicates stable
  participant sessions, preserves empty unified summaries and rejects invalid timezones and
  conflicting normalized filenames. Import preflights the whole input before saving; identical
  filename aliases import once.

### Cambios que pueden afectar a consumidores

- **The project is now licensed under Apache License 2.0.** See `LICENSE` for the terms.
