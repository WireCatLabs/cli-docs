---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/tg-cli`, con una sección por versión, de la más reciente a la más antigua. Se utiliza [versionado semántico](https://semver.org); antes de `1.0.0`, la interfaz de comandos todavía puede cambiar.

## 0.106.0 — 29.10.2026

### Added

- **`contacts sync` guarda el teléfono de cada contacto** cuando Telegram lo muestra, así que `contacts show --offline`
  lo responde. Un `contacts show` en línea también guarda el teléfono que lee. Requiere cli-core 0.479.0 (versión del
  almacén 37).
- **Una tarjeta de contacto compartida muestra su nombre y el teléfono completo**, en línea y desde el almacén
  (`--offline`). `contacts show` incluye el perfil que daba `contacts info`, y `--hide-phone` omite el número en
  `account show`, `account update` y `contacts show`. Requiere cli-core 0.477.0.
- **`tg <profile> reactions list <chat> <message>` muestra quién reaccionó a un mensaje**, del más nuevo al más antiguo,
  con la reacción y cuándo. `reaction:<emoji>` deja un solo emoji, y `--limit` y `--cursor` lo paginan. Solo lee, así
  que pueden usarlo un perfil de solo lectura y MCP (clave de permiso `reactions.list`). Donde Telegram oculta la lista
  —un canal (`reactions.broadcast`) o un chat que la desactivó (`reactions.list-hidden`)— falla con ese motivo en lugar
  de dar una lista vacía. Requiere cli-core 0.477.0.

### Changed — may break callers

- **Los números de teléfono se muestran completos**, y `contacts info` pasa a ser `contacts show`. `--show-phone` ya no
  existe: un script que lo pasa falla con una opción desconocida, así que quítalo. La herramienta MCP `contacts info`
  también desaparece; `contacts show` ocupa su lugar, y un permiso guardado `contacts.info` se rechaza con el
  `config unset` que lo elimina.

### Fixed

- **Las respuestas de `inbox`, `review`, `search messages` y `search all` llevan `sender_is_me`**, como prometía 0.473.0,
  así que un script también puede distinguir en ellas los mensajes propios del dueño de los demás (cli-core 0.478.0).

## 0.105.0 — 29.10.2026

### Changed — may break callers

- **El skill del agente aparece en ClawHub como `wirecat-tg`.** Instálalo con
  `openclaw skills install @wirecat/wirecat-tg`. La entrada `tg-cli` ya no se actualiza.
  `tg skill install` sigue escribiendo `skills/tg-cli/`.

### Fixed

- **La ayuda y [la referencia de comandos](./commands.md) muestran `tg mcp serve --profiles work,personal`** sin un
  perfil delante. 0.104.0 mostraba `tg personal mcp serve --profiles work,personal`, que `tg` rechaza ("name one
  profile or --profiles, not both"); los ejemplos `--profiles all` de `mcp revoke` y `mcp config` tenían el mismo
  error. Después de `tg upgrade`, el aviso para reiniciar un servidor en segundo plano de varios perfiles conserva su
  `--profiles` (cli-core 0.474.0).

## 0.104.0 — 29.10.2026

### Changed — may break callers

- **Un servidor MCP atiende solo los perfiles que nombras.** `tg mcp serve` sin perfil ahora se niega (código 2) y muestra
  tus perfiles. Nombra uno (`tg work mcp serve`), una lista (`tg mcp serve --profiles work,personal`) o todos los perfiles
  (`tg mcp serve --profiles all`); la línea de stderr al arrancar nombra los perfiles atendidos. La misma elección vale para
  `--http`, `mcp revoke`, `mcp config` y `mcp server start|stop|status`. Una entrada de aplicación que ejecuta `tg mcp serve` sin
  perfil deja de funcionar: vuelve a imprimirla con `tg mcp config --profiles all`, o nombra un perfil. `tg upgrade` detiene un
  servidor en segundo plano de todos los perfiles iniciado por un `tg` anterior; vuelve a iniciarlo con
  `tg mcp server start --profiles all`. La entrada del MCP Registry ahora ejecuta `tg mcp serve --profiles all` (cli-core
  0.470.0).

### Added

- **Cada mensaje que imprime `tg` tiene `sender_is_me`**, verdadero para un mensaje que enviaste tú, en `messages list`, `show`,
  `context`, las ventanas de búsqueda e `inbox` (cli-core 0.473.0).
- **`tg runs show` conserva el código de error de red de una ejecución fallida** (`error.cause_code`, como `ETIMEDOUT`), nunca
  el texto del servidor (cli-core 0.473.0).

### Fixed

- **`--offline --transcribe` dice qué mensajes de voz no transcribió.** Están en `missing`, con el comando
  `tg <profile> messages transcribe <chat> <id>` que hay que ejecutar (cli-core 0.473.0).
- **Cada llamada a una herramienta MCP tiene su propio `run_id`** en su respuesta y en `tg runs` (cli-core 0.471.0).

## 0.103.0 — 27.10.2026

### Changed — may break callers

- **cli-core 0.469.0 y cli-base 0.65.0.** cli-core 0.469 solo acepta cli-base 0.65, así que ambas versiones se mueven juntas.
  cli-base 0.65 conoce los verbos `serve` y `revoke`, así que sus entradas en la base de lint desaparecen, y su `cli-dev bundle`
  encuentra un servidor iniciado con una opción antes de `mcp serve`. Desde cli-core 0.468, un servidor MCP ofrece por su
  herramienta de lectura un comando que solo descarga al almacén.

### Fixed

- **`tg --version` responde antes de cargar nada del paquete.** El paquete ahora lo genera el `cli-dev bundle` compartido de
  cli-base en lugar del `scripts/bundle.ts` propio de tg; los fragmentos y toda la salida son iguales. Un servidor iniciado
  con una opción antes de `mcp serve` (`tg work --read-only mcp serve`) ahora carga todos los fragmentos poco después de arrancar, como
  hace un `mcp serve` simple, para que una actualización en el sitio no le quite un fragmento.

## 0.102.0 — 27.10.2026

### Changed — may break callers

- **Ahora se conserva cada ejecución, también las que funcionaron.** Una ejecución que funcionó se conserva 7 días
  (`keep_successful_runs_for_days`), una fallida 30 (`keep_runs_for_days`), y la carpeta de ejecuciones se mantiene por debajo de 200 MB
  (`runs_size_limit_mb`). Con `record_input` activado, como por defecto, un `send` que funcionó ahora guarda lo que escribiste (el
  mensaje, un chat nombrado por su título) en una ejecución que solo tú puedes leer, en esta computadora, durante 7 días.
  `record_input failed` lo guarda solo en una ejecución fallida; `record false` conserva solo las ejecuciones fallidas; `--no-record`
  no conserva nada. `watch`, `serve` y `mcp serve` conservan una ejecución que funcionó solo con `--record`. Una ejecución ahora dice quién
  la pidió: la línea de comandos, una aplicación MCP (y su llamada a herramienta) o WireCat Desktop (cli-core 0.467.0).

### Added

- **`tg runs show` enumera cada solicitud que recibió Telegram, con su duración, reintentos y esperas.** La ejecución de un comando ahora tiene una
  línea por cada llamada a Telegram, para una cuenta y para un bot: el método (`messages.getHistory`, `sendMessage`),
  cuánto tardó y cómo terminó. Cuando Telegram pide esperar (`FLOOD_WAIT`, o un `429` de la Bot API) y `tg` espera
  y vuelve a intentarlo, la ejecución muestra la llamada rechazada y luego el reintento como intento 2, con el tiempo de espera. El texto de los mensajes,
  los nombres, los números de teléfono y el token del bot nunca se escriben.

## 0.101.0 — 27.10.2026

### Changed — may break callers

- **El servidor MCP es `tg <profile> mcp serve`; `tg <profile> mcp` solo imprime la ayuda.** Los inicios de sesión del navegador
  se olvidan con `tg <profile> mcp revoke` en lugar de `mcp --revoke`. El servidor de un bot es `tg <name> bot mcp serve`.
  Una entrada de aplicación que ejecuta `tg personal mcp` debe cambiar a `tg personal mcp serve`: vuelve a ejecutar `tg personal mcp add <app>`
  o `tg personal mcp config`. `mcp server start` y las entradas que imprime `mcp config` ya ejecutan el nuevo
  comando (cli-core 0.463.0).
- **`tg skill show|status|install --json` imprimen `{ item, meta }`.** Los campos del skill pasaron a `item`; el
  instalador de Windows los lee de ahí (cli-core 0.462.0).
- **Los resultados de búsqueda de todo tipo, y `tg topics show`, nombran los campos que un agente debe leer como datos** (`untrusted`, por
  ejemplo `["title"]` en un tema de foro). Quien los valide con una copia antigua y estricta del esquema
  rechaza el campo nuevo (cli-core 0.464.0).
- **`tg account list` dice si cada perfil tiene la sesión iniciada en esta computadora** (`signed_in`). Quien valide
  los elementos con una copia antigua y estricta del esquema rechaza el campo nuevo (cli-core 0.466.0).

### Added

- **`tg search all` también encuentra eventos de calendario en el almacén compartido**, marcados como texto no confiable para los agentes, y
  `contacts context|prepare` nombran un campo más (cli-core 0.453.0–0.461.0).
- **`tg upgrade` reinicia el servidor MCP del navegador que inició y nombra las sesiones de agente que siguen en la versión anterior.**
  Tras una instalación, cada `tg mcp serve --http` que lanzó `tg mcp server start` vuelve a arrancar en el mismo puerto,
  dirección y límites (`mcp_servers`, versión anterior → nueva); uno iniciado a mano sigue en marcha y se nombra. Las sesiones de agente
  por stdio que siguen en la versión anterior se enumeran (`stale_sessions`): reinícialas desde tu aplicación de agente. Esto
  funciona a partir de la próxima actualización (cli-core 0.464.0).

### Fixed

- **`tg mcp serve` sin perfil marca los perfiles que no tienen la sesión iniciada.** Enumeraba cada perfil con un
  archivo de cuenta, así que una aplicación podía elegir uno sin sesión y fallar. Cada perfil ahora lleva una etiqueta
  (`default — not signed in`) en el menú de la aplicación y en la descripción, y una llamada para uno sin sesión
  responde cómo iniciarla: `tg <profile> setup`, o desde WireCat Desktop. La entrada del MCP Registry y la
  imagen de Glama inician `tg mcp serve`.
- **La página de inicio de sesión del servidor MCP del navegador dice que cada código sirve para un solo inicio de sesión.** Después de que una aplicación inicia sesión, aparece un código nuevo
  en WireCat Desktop y en `tg mcp server status`; volver a escribir el anterior solo decía "Wrong code"
  (cli-core 0.466.0).

## 0.100.0 — 27.10.2026

### Fixed

- **Los comandos arrancan unos 0,2 s antes: el paquete se ejecuta desde un bundle.** Un comando cargaba unos 1.110 archivos de módulos
  antes de hacer nada; ahora carga unos 55 que contienen el mismo código. `tg messages list --help` pasó de 389 a
  192 ms, y de 534 a 272 ms en la primera ejecución tras una instalación o un reinicio. Un comando que se conecta sigue cargando
  la biblioteca cliente de Telegram como antes. La salida no cambia. El paquete es más grande: 3,0 MB de descarga en lugar de
  0,5 MB, 16 MB en disco en lugar de 4 MB. Un `tg serve`, `watch` o servidor MCP en marcha carga todo su código unos
  segundos después de arrancar, así que actualizar `tg` debajo de él no le deja sin encontrar un archivo que aún no había usado.
- **El skill de agente de tg vuelve a publicarse en ClawHub como `tg-cli`.** ClawHub guarda los nombres de skill por editor, así que
  `wirecat/tg-cli` es el nombre propio de tg aunque otro editor también tenga un `tg-cli`, y el skill de cada herramienta de WireCat
  ahora usa su nombre simple. `tg skill install` sigue escribiendo `skills/tg-cli/`.

## 0.99.0 — 27.10.2026

### Fixed

- **Sin sesión, el error y las instrucciones MCP también ofrecen WireCat Desktop.** `no session`, `not logged in`
  y la falta de claves de la aplicación ahora dicen: ejecuta el comando en una terminal, o inicia sesión desde WireCat Desktop (Tools → Telegram →
  Manage). Por MCP se indica al agente que nunca pida códigos ni contraseñas (cli-core 0.452.0).
- **El skill de agente de tg se publica en ClawHub como `wirecat-tg`.** El nombre `tg-cli` en ClawHub pertenece a otro editor,
  así que el skill de tg no podía aparecer con él. `tg skill install` sigue escribiendo `skills/tg-cli/`.

## 0.98.0 — 27.10.2026

### Fixed

- **La búsqueda por significado y `--discover` usan ONNX Runtime nativo también en Windows (cli-core 0.451.0).** Tras
  `tg <profile> models download`, los modelos de texto y el reordenador usan la biblioteca nativa en Windows x64 y arm64, como
  ya hacían en Linux y macOS: entre 2 y 3 veces más rápido que WebAssembly. La descarga toma `onnxruntime.dll` del
  paquete npm `onnxruntime-node` (113,5 MB, una vez, comprobado con sha256). Los modelos de imágenes (CLIP, SigLIP2) ahora también usan la
  biblioteca nativa, donde esté instalada. Los resultados son los mismos.

## 0.97.0 — 27.10.2026

### Added

- **`tg mcp` sin perfil atiende todos los perfiles, por stdio y con `--http` (cli-core 0.450.0).** Una aplicación de IA necesita un
  conector para Telegram, no uno por perfil. Cada herramienta (`tg_tools_search`, `tg_read`, `tg_write`) recibe un
  `profile` obligatorio (todos los perfiles de este equipo, sin valor por defecto) y se indica al agente que pregunte si no nombraste la cuenta. La llamada
  se ejecuta en el propio `tg <profile> mcp` de ese perfil, iniciado con el primer uso y cerrado tras 10 minutos sin actividad, así que los
  permisos, la sesión y el registro de auditoría de cada perfil se aplican como antes. `tg mcp --revoke`, `tg mcp config` y
  `tg mcp server start|stop|status` también funcionan sin perfil, con su propio inicio de sesión. `--public-url` admite una ruta,
  `https://<name>.ts.net/tg`, para que las herramientas compartan una dirección de túnel. La entrada del MCP Registry inicia `tg mcp`.
  `tg <profile> mcp` no cambia.

### Changed — may break callers

- **tg necesita cli-base 0.63.0 (cli-core 0.450.0).** No cambió nada de lo que tg usa en ella.

## 0.96.0 — 27.10.2026

### Fixed

- **Cada comando tarda menos en prepararse (cli-base 0.62.0, cli-core 0.449.0).** La comprobación de los comandos compartidos ahora
  describe cada comando una vez, no otra vez por cada grupo superior. Un `run(["--version"])` en caliente pasó de 49 a 29 ms.
  Detecta los mismos cambios que antes.
- **Los comandos fuera de `bot api` arrancan más rápido: sus 185 comandos generados de la Bot API se construyen solo cuando hacen falta.** `tg messages list`, `tg --help` y los demás comandos ya no cargan unos 1,5 MB de código generado. `bot api`, `bot --help`, `bot mcp`, `commands`, `complete`, `help`, `mcp`, `serve`, `config` y `doctor` siguen construyendo el grupo, igual que cualquier comando cuando la configuración guarda un permiso `bot.api`. La salida no cambia.
- **La búsqueda por significado y el reordenador de `search messages --discover` van entre 2 y 3 veces más rápido en Linux y en Mac con Apple silicon tras el siguiente `tg models download` (cli-core 0.448.0).** La descarga instala un ONNX Runtime nativo y los modelos se ejecutan en él; sin él funcionan como antes. El reordenador ahora lee solo el comienzo del mensaje al que responde un resultado (cli-core 0.447.0).

## 0.95.0 — 26.10.2026

### Added

- **`tg <profile> session start --json --answer-stdin` inicia sesión sin terminal, para WireCat Desktop (cli-core 0.443.0).** Cada pregunta es una línea `needs` en stderr (`{"event":"needs","field","secret","prompt","hint"}`: `api_id`, `api_hash`, `phone`, `code`, `password`) y su respuesta es una línea en stdin; my.telegram.org es una línea `open_url`. Sin `--answer-stdin`, una ejecución sin terminal sigue negándose, así que el shell de un agente nunca espera una pregunta. Las respuestas nunca se imprimen ni se guardan en un registro de ejecución.

- **`tg <profile> mcp server start|stop|status` ejecuta el servidor MCP HTTP en segundo plano (cli-core 0.445.0).** `start` admite `--public-url`, `--port` y `--permission` como `mcp --http` y vuelve cuando el servidor escucha; `status` da el puerto, la dirección, el código de inicio de sesión de un solo uso y las aplicaciones que iniciaron sesión; `stop` termina solo el servidor que inició. WireCat Desktop lo inicia y lo detiene desde el panel Manage de la herramienta.

### Changed — may break callers

- **Un registro de ejecución guarda la línea de comandos tal como se escribió (cli-core 0.439.0 a 0.447.0).** `runs show` y `run.json` llevan `argv`, las palabras después de `tg`, con los secretos como `[redacted]` (una opción con nombre de secreto, una contraseña en una URL, un formato de token conocido, una cadena que parece aleatoria) y sin guardar nunca un número de teléfono. `tg <profile> config set record_input false` pone `[redacted]` en lugar de cada valor escrito que pueda ser texto. Los eventos registrados siguen conteniendo identificadores, nunca el título de un chat ni el texto de un mensaje.

## 0.94.0 — 26.10.2026

### Added

- **`tg skill install --for hermes` da el skill a Hermes Agent, y `tg skill status` dice qué lee Hermes (cli-base 0.59.0).** Añade `~/.agents/skills` a `skills.external_dirs` de Hermes mediante `hermes config set`, conservando las carpetas ya listadas, o copia el archivo en la carpeta de Hermes si eso falla. Sin Hermes instalado falla con `not_found` y no escribe nada. Un `tg skill install` simple y `--for all` siguen escribiendo solo las copias de Claude Code y de `~/.agents/skills`. `skill status --json` añade `hermes` junto a `targets`.
- **Una ejecución iniciada por OpenClaw o Hermes Agent nombra a ese agente (cli-core 0.437.0).** `runs show` da `agent` como `openclaw` para un comando que ejecutó el agente de OpenClaw, con `from_chat: true` cuando lo inició un mensaje de chat; una ejecución de Hermes lleva su sesión, así que una reserva de tarea de Hermes se mantiene por sesión.
- **El skill `tg-cli` indica a OpenClaw y a ClawHub que necesita `tg` y cómo instalarlo** (`metadata.openclaw`: `requires.bins` y el paquete npm `@wirecat/tg-cli`). Si falta `tg` en el PATH, OpenClaw marca el skill como no listo y ofrece instalar el paquete. Claude Code y Codex ignoran ese bloque.

## 0.93.0 — 25.10.2026

### Added

- **`store reset --dry-run` enumera lo que vaciaría un reinicio y no borra nada** (cli-core 0.429.0): los archivos y bytes del almacén, cada tabla de datos con sus filas, si antes se hace una copia de seguridad y si un serve u otro proceso tiene el archivo abierto.
- **`search messages --discover` también encuentra mensajes cercanos en significado** una vez descargado e5-small y cuando `conversations rebuild` ha dado a los mensajes sus propios vectores (cli-core 0.432.0). El `discovery.found_by` de cada resultado dice qué búsqueda lo encontró. Hasta entonces el descubrimiento busca por palabras como antes y dice por qué. No se descarga nada y ningún texto sale de la computadora.
- **`search messages --discover` reordena sus 50 primeros resultados una vez descargado un reordenador (cli-core 0.435.0).** Un modelo local lee la pregunta con cada resultado, y su puntuación se mezcla con la del propio descubrimiento; los resultados después de los 50 primeros mantienen su orden. El predeterminado es mMARCO (136 MB, `tg models download mmarco`); el ajuste de perfil `search_reranker` elige `bge-reranker-v2-m3` (588 MB) u `off`. Cada resultado reordenado tiene `discovery.reranker_score`; `score` sigue siendo el del descubrimiento. Sin el modelo, el descubrimiento mantiene su orden y dice `not reranked: …` (en `--json` y MCP: `missing` y `next`). Una búsqueda nunca descarga un modelo ni envía texto a ninguna parte; `--exact`, `--newest` y las consultas estrictas no cambian.
- **`search all` también encuentra mensajes por significado, una vez descargado e5-small y cuando los mensajes tienen sus vectores (cli-core 0.435.0).** Los resultados por significado se combinan con los de palabras en una sola lista de mensajes; el `foundBy` de cada elemento dice qué búsqueda lo encontró. Una consulta con NOT, o con un filtro bajo OR o en un grupo, sigue siendo solo por palabras. Sin el modelo o los vectores, `search all` lee palabras como antes y dice por qué. `--exact` y `--backend server` siguen siendo solo por palabras.

### Changed — may break callers

- **Una orden `bot` fallida nombra en su ejecución la llamada a la Bot API que falló.** `runs show` y `runs list` dan a su `error.http` el `method` y el `endpoint_template` junto al estado — `{ "method": "POST", "endpoint_template": "/:token/sendMessage", "status": 400 }` — donde antes solo tenían el estado. El token siempre se escribe `:token`: Telegram lo pone en la dirección, y el real nunca llega a una ejecución ni a una traza. Las solicitudes del bot en `--trace` y en una ejecución registrada llevan los mismos dos campos, y una línea de traza legible los muestra tras el nombre del método (`← getMe  POST /:token/getMe  401 …`). Un script que analiza el texto de `--trace` ve esa columna extra.
- **tg necesita Node 22.19+ o 24+ (antes 22.16+).** La compatibilidad con proxy de la Bot API usa undici 8, que requiere Node 22.19. Bun no se ve afectado.
- **El almacén compartido pasa a la versión 34 (cli-core 0.434.0).** La búsqueda por significado ordena mediante un índice vectorial guardado en el almacén, creado en la primera apertura con esta versión. Una vez que esta versión abre el almacén, una CLI con cli-core 0.433.0 o anterior lo rechaza y pide actualizarse, así que actualiza a la vez todas las CLI de WireCat que comparten el almacén. Si falta la extensión SQLite del índice o no se carga, abrir el almacén falla con `store.vector-extension-missing` o `store.vector-extension-failed`: reinstala tg. `store check` informa de `vector_indexes` y falla cuando un índice está desfasado.
- **`tg upgrade --help` muestra solo `tg upgrade --check` como ejemplo (cli-core 0.433.0).** El ejemplo de `tg upgrade` simple desaparece: copiado y ejecutado, actualizaba.
- **El análisis con Anthropic envía la clave como `Authorization: Bearer` (cli-core 0.433.0).** Antes enviaba `X-Api-Key`. Una pasarela en un `models.<purpose>.base_url` propio que lea `X-Api-Key` debe leer `Authorization` en su lugar.

### Fixed

- **Hermes Agent instala el skill `tg-cli` sin advertencia de seguridad.** Su análisis de instalación dejaba el skill en "caution" porque una frase nombraba la carpeta SSH por su ruta, aunque la frase dice que tg se niega a enviarla. La frase ahora dice "SSH keys"; lo que tg rechaza no cambia.
- **La subida de un archivo de un bot a través de un proxy SOCKS5 o HTTP envía el archivo.** Antes, la solicitud por proxy llevaba el texto `[object FormData]` en lugar del formulario, así que Telegram rechazaba fotos, documentos y notas de voz enviados con `--proxy`.
- **Un `--version` simple responde antes de cargar el programa**: el ejecutable arranca mediante `@wirecat/cli-core/cli/start` (cli-core 0.429.0).
- **Un vector guardado desaparece cuando ningún texto del almacén lo usa (cli-core 0.435.0).** Una imagen cuya foto cambió y un chat purgado (`store clear --left`, un chat fusionado en otro) dejaban vectores atrás, y ya no lo hacen. `store rebuild` elimina los que dejaron versiones anteriores (`unused_vectors_dropped`), y `store check` los cuenta (`vectors.unused`).
- **`conversations embeddings clear --chat` también elimina los vectores de mensajes del chat (cli-core 0.435.0)**, no solo los de sus conversaciones.

## 0.92.0 — 25.10.2026

### Changed — may break callers

- **Los permisos se comprueban con la clave completa de cada comando (cli-core 0.421.0).** `messages sync` se comprueba como `messages.sync` y `bot messages sync` como `bot.messages.sync`; un nivel en `messages` o `bot.messages` sigue aplicándose a ellos. Una clave guardada se lee solo tal como está escrita, así que `chats.mute` ya no cubre `chats unmute`.
- **Una clave de permiso guardada que no nombra ningún comando se rechaza, también para los comandos del bot.** Con una clave bajo un recurso conocido, todos los comandos salvo `config show`, `set` y `unset` se detienen con un `configuration_error` que nombra la clave y el `config unset` que la elimina.
- **`tg <profile> search mail` es un comando desconocido.** El correo se busca con `memo search mail`.
- **`doctor --json` informa de los problemas del archivo de configuración en `config.issues` (cli-core 0.423.0).** `config.error` desaparece. Cada problema tiene un `kind` (`invalid_json`, `unknown_setting`, `unknown_permission`, `missing_setting` o `invalid_value`), el `file`, el `profile` y la `key` cuando corresponden, `line` y `column` para el JSON no válido, una frase que dice qué tiene que ser el valor (nunca el valor) y `fix`, el comando `config unset` que lo elimina. `doctor` enumera todos los problemas del archivo, sigue saliendo con 0 y sigue respondiendo cuando el JSON está roto. Un bloqueo de perfil, una opción o una variable de entorno que los ajustes rechazan se informa en `settings.error`.
- **`default_profile`, `analysis_provider`, `analysis_model` y `analysis_base_url` son ajustes desconocidos, y `TG_ANALYSIS_PROVIDER`, `TG_ANALYSIS_MODEL` y `TG_ANALYSIS_BASE_URL` no se leen.** Un archivo que tenga uno se rechaza como cualquier ajuste desconocido, con el `config unset` que lo elimina. El análisis se configura con `models.analysis.provider`, `models.analysis.model` y `models.analysis.base_url` (`TG_MODELS_ANALYSIS_*`); `--model` y `--base-url` de `conversations links rebuild` los sobrescriben.
- **Un comando rechazado por un problema en el archivo de configuración nombra el primer problema y el comando que lo elimina**, y dice cuántos más enumera `doctor`. `config show`, `set` y `unset` funcionan con ese archivo, y `config unset` elimina un ajuste que ningún esquema conoce. Una clave de permiso desconocida se rechaza en cualquier sección del archivo, no solo en las que lee el comando.
- **`config set` guarda `config.json` legible solo por ti (`0600`) (cli-core 0.428.0, cli-base 0.57.0).** Antes reescribía el archivo como `0644`. Lo que lea la configuración como otro usuario —un servicio de todo el sistema, un contenedor con otro uid— ya no podrá leerla tras el siguiente guardado; ejecútalo como el propietario o dale su propia configuración.
- **El registro de una ejecución dice cómo empezó y por qué falló (cli-core 0.425.0).** `run.json`, `runs list`, `runs show` y `search runs` añaden `cli_command` (el comando completo, `tg messages list`), `argv` con cada valor que puede ser contenido escrito como `[redacted]`, `agent` (el agente de programación y su sesión, cuando los da) y, para una ejecución fallida, `error`. Una ejecución sin perfil nombrado omite `profile` en lugar de registrar `default` (cli-core 0.424.0).
- **La primera pantalla dice que zm y drive se pueden «buscar junto con tus otros datos de WireCat»** (cli-core 0.426.0), y el ejemplo de `guide` nombra un escenario real en lugar de `<name>`.

### Added

- **`tg skill status` y `tg skill show --for claude|agents`** (cli-base 0.56.0, a través de cli-core 0.427.0). `skill status` dice, para Claude Code y para `~/.agents`, si el SKILL.md instalado coincide con esta versión; `skill show --for` imprime la copia instalada allí.
- **`tg store tables list` enumera todas las tablas del archivo local** con su tipo y sus filas; `--full` añade el tamaño de cada tabla (cli-core 0.427.0). `store info` también dice qué herramientas abrieron el almacén, su modo de diario, páginas, migraciones y última copia de seguridad, y cuenta por proveedor, tipo de chat, cuenta, año y tipo de adjunto.

### Security

- **`doctor` informa de un `config.json` o una carpeta de configuración que otros usuarios pueden leer, con el `chmod` que lo soluciona (cli-core 0.428.0).** `files.problems` enumera el archivo de configuración (necesita `0600`) y su carpeta (necesita `0700`), también cuando `TG_CONFIG_DIR` nombra la carpeta, y stderr imprime `to make it private: chmod 600 '<path>'`. `files` aparece en la respuesta también sin perfil nombrado y cuando se rechazan los ajustes. No se cambia nada en el disco; Windows no se comprueba.

### Fixed

- **Todos los comandos arrancan más rápido: la biblioteca cliente de Telegram se carga solo cuando un comando se conecta.** `tg --version`, `--help`, `config show` y `runs list` cargaban unos 1.900 archivos de módulos, 650 de ellos de mtcute; ahora unos 1.100.
- **Una denegación guardada en un comando de sincronización ahora lo detiene.** `permissions.messages.sync: deny` se puede guardar y se respeta, y `permissions.bot.messages.sync: deny` ya no se ignora. Un `bot.messages` denegado también detiene `bot messages list` y `bot messages sync` antes de conectarse.
- **Un fallo a mitad de un comando se informa como cualquier otro error.** Antes imprimía la traza de pila de Node; ahora imprime el error `internal_error` (`command.crashed`) —una línea en una terminal, el objeto de error JSON en otro caso— y sigue saliendo con 1. Una traza de pila no le dice a un script nada que pueda usar, y puede llevar texto que no debería llegar a la pantalla. Un script que leía la traza en stderr lee ahora el objeto de error.

## 0.91.0 — 25.10.2026

### Changed — may break callers

- **El almacén compartido pasa a la versión 33 (cli-core 0.420.0).** Una vez que esta versión abre el almacén, una CLI con un cli-core más antiguo lo rechaza y pide actualizarse, así que actualiza a la vez todas las CLI de WireCat que comparten el almacén.

## 0.90.0 — 25.10.2026

### Changed — may break callers

- **`tg <bot> bot store fetch` ahora es `tg <bot> bot messages sync`, y el grupo `bot store` desaparece.** Lee los mensajes antiguos de un canal o supergrupo en la copia local del bot, lo mismo que hace `messages sync` en la cuenta personal, así que lleva el mismo nombre; `store` es para la base de datos local. Las opciones no cambian. La ruta antigua responde con una indicación de la nueva. Un `permissions.bot.store.fetch` guardado se rechaza hasta que lo renombres a `permissions.bot.messages.sync`.

## 0.89.0 — 25.10.2026

### Changed — may break callers

- **Una cuenta de Telegram bloqueada devuelve `permission_error` (código de salida 5).** Un nuevo inicio de sesión no puede levantar el bloqueo; usa el mismo contrato de motivos y códigos que las demás CLI.

- **Los contratos compartidos de las CLI ahora exigen declarar explícitamente las diferencias del proveedor.** El descubrimiento de comandos exporta las definiciones heredadas, los esquemas, los motivos de error y las diferencias aceptadas exactas. La actividad de un contacto usa consultas `scope:` y `at:`; las búsquedas de ejecuciones de diagnóstico usan límites `started_at:` en lugar de opciones de tiempo. Las listas de miembros de chat desconocidas y las listas de tipos de webhook sin restricción se omiten en lugar de devolver `null`.

### Security

- **La resolución de dependencias excluye las versiones vulnerables de Zod y Vite.** Las auditorías locales y las de producción nuevas usan las versiones corregidas.

## 0.88.0 — 24.10.2026

### Added

- `messages send --draft` guarda texto en el chat para que lo revises y envíes desde Telegram. Admite formato, respuestas y temas de foro, usa el permiso independiente `drafts` y nunca envía un mensaje. Se rechazan borradores vacíos y opciones exclusivas del envío.

### Fixed

- `watch --events` y `serve` reciben instantáneas de reacciones entregadas como ediciones del mensaje, incluida la eliminación de reacciones. Los contadores se mantienen actualizados aunque Telegram no envíe una actualización de reacción independiente.

## 0.87.0 — 24.10.2026

### Fixed

- Las guías MCP describen las escrituras con claves de permiso y la autorización independiente para llamadas directas a Bot API.
- El escenario catch-up usa `chats mark-read` como comando separado. La guía de instalación explica cómo recuperarse si falta en PATH el directorio global de ejecutables de pnpm.
- Los comandos denegados siguen visibles en la ayuda de CLI y en MCP con disponibilidad actual, motivos y claves de permiso. La configuración del bot permanece limitada al bot y las llamadas siguen comprobando los permisos actuales.
- **`chats members check --help` vuelve a mostrar la descripción de tg**: qué lee `--deep` y que envía identificadores a listas públicas de bloqueos. Desde 0.86.0 aparecía el texto compartido, que omitía ambos detalles.

## 0.86.0 — 24.10.2026

### Added

- **Send up to ten attachments as one album** by repeating `messages send --photo` or `--file`.
  Photos and videos can share an album; documents form a separate group. The caption belongs to the first
  item, and JSON includes every sent message. Each item counts toward the hourly send limit. Retrying an
  unscheduled send with the same operation id repeats the same per-item Telegram ids.

### Changed — may break callers

- **Shared commands have one name each, and the old names are gone** (cli-core 0.406.0). `contacts profile` is
  `contacts info`, `contacts timeline` is `contacts events`, `contacts alias set|rm` is `contacts aliases set|remove`.
  `chats link …` is `chats links …` and `chats link revoke` is `chats links remove`; `chats members audit` is
  `chats members check`; `chats requests accept|decline` is `chats requests confirm|reject`. `metadata get|refresh` is
  `metadata show|sync`, `tasks plan` is `tasks update`, `tags auto` is `tags rebuild`, `attachments text set` is
  `attachments update`, `store reindex` is `store rebuild`, `store gaps plan` is `store gaps show` and
  `stats messages counters refresh` is `stats messages counters sync`. `conversations build` is
  `conversations links rebuild`, `conversations embed status|clear` is `conversations embeddings status|clear`,
  `conversations batches next` is `conversations batches show` and `conversations consents revoke` is
  `conversations consents remove`. `models audio list` and `models text list` are `models list kind:audio|kind:text`,
  `models audio|text download` is `models download`, `models text key` is `models keys`. `doctor report create` is
  `doctor reports create` and `doctor report` is `doctor reports show`. `mcp setup` is `mcp add`, `mcp doctor` is
  `mcp check` and `commands schema` is `commands info`. An old name stops with the new one in the message; CLI and MCP
  use the same paths.
- **The hidden old option spellings are removed.** Use `--analysis-provider`, `--embedding-provider` or
  `--consent-provider` for `--provider`, `--answer-model` on `conversations links clear`, `--template-mode` on reply
  rules, `--claim` on `tags remove`, `--text-file` on `contacts notes`, and `kind:` in the `inbox` and `review` query.
- **A saved permission key with an old path stops every command with `configuration_error`** and names the key to
  rename it to, for example `permissions.conversations.embed` to `permissions.conversations.embeddings`. `config set`
  and `config unset` stop too, so rename the key by hand in `config.json`
  ([where it is](./configuration-reference.md)).

## 0.85.0 — 24.10.2026

### Added

- **The first command at a terminal asks three questions once for every WireCat tool** (cli-core 0.404.0): which
  languages you write and speak, which other WireCat tools to install, and whether commands and agents may only read.
  Answered in any tool, they hold in all of them; "read only" caps every profile, over MCP too. `tg setup` asks them
  again. Agents, `--json`, `--no-input`, `CI` and `TG_READ_ONLY` are never asked.

## 0.84.0 — 24.10.2026

### Added

- **`permissions.mcp.authority` decides whether an MCP server offers the commands that change what a later run may
  do** (cli-core 0.400.0): `config set|unset`, `schedule command|agent|remove`, reply rules and consents, recipient lists,
  chat rules, `server install`, `skill install`, model keys, media archive timers and `flood clear`. It is `deny` by
  default, so an agent still cannot loosen its own limits until you run
  `tg <profile> config set permissions.mcp.authority allow` in a terminal (add `--bot` for a bot's server).
  [Permissions](./permissions.md#let-an-agent-change-its-own-limits) and
  [the MCP guide](./mcp.md#commands-that-change-what-a-later-run-may-do) explain it.

### Changed — may break callers

- **`tg mcp` offers the writes that had no permission key before, each `ask` by default** (cli-core 0.401.0): store
  backup, restore, migrate, repair, reset, clear, decrypt and copy deletion, server start/stop/restart, model downloads,
  `schedule run|exec`, `doctor report create` and `account sessions end`; the bot server offers `store fetch`. Over MCP
  `ask` goes ahead, so set a key to `readonly` or `deny` to hide a tool. `tasks duplicates` is `tasks duplicates list`.

- **`tg <profile> events list --json` writes times as ISO 8601 and ids as strings** (cli-core 0.401.0): `starts_at`,
  `ends_at`, `deleted_at`, `created_at` and `updated_at`, as every other answer does.
- **A bot's MCP server can offer `bot api`, behind `permissions.bot.api`** (cli-core 0.402.0). It is `deny` by default;
  `tg <profile> config set --bot permissions.bot.api allow` in a terminal turns it on.

- **`tg <profile> watch --jsonl` prints `{"type":"item","data":…}` lines and a final `{"type":"end","complete":true}`.**
  Read each message or event from `data`, and stop at the `end` line. Fields are snake_case. A timeout or a normal stop
  ends with `complete: true`; a failure ends with `complete: false` and its exit code.
- **`runs search` is now `search runs`.** Filters are terms in the query: `status:failed`, `error_code:timeout`,
  `operation:messages.download`, `profile:work`, next to plain words. Saved MCP requests use the new command path.
- **`stats` reports take their filters as query terms.** `--message-kind` is `message_kind:posts|comments|all`,
  `--min-messages 5` is `min_messages:5`, `--min-views` and `--max-replies` are `min_views:` and `max_replies:`,
  `--older-than 24h` is `older_than:24h`, and `--chat` is `chat:<chat>` on the rankings and reports; exact words use `exact:` in place of `--exact`. Update saved
  commands and MCP requests.

- **Options have one meaning each** (cli-core 0.399.0). Use `--analysis-provider` for analysis and `--embedding-provider`
  for vector search (`conversations build|embed|related|status`, `search conversations`), `--consent-provider` for
  `conversations consents revoke`, `--claim` for `tags remove`, `--answer-model` for `conversations links clear`,
  `--template-mode` for reply templates and `--text-file` for `contacts notes add|edit`. `inbox` and `review` take
  `kind:group,channel` in their query. The old spellings still work, hidden, for one release.

### Fixed

- **Voice-note search no longer finds a different real English or Spanish word for the one you typed** (cli-core
  0.402.0). A misheard spelling still turns up: "budget" finds "budjet", but "cost" no longer finds "cast".

- **Downloading media skips service events and keyboards** (cli-core 0.400.0). A chat with a group event or an inline
  keyboard no longer makes `attachments download` fail with `provider.invalid-response`.

## 0.83.0 — 23.10.2026

### Added

- **`tg <profile> messages press <chat> <message> <button>`, `chats start <bot>` and `chats app <bot>` work with bots.**
  `messages show` now numbers the inline buttons under a bot's message; `press` presses a callback button by its number
  or text. A button that asks for your 2FA password is refused, never pressed. `chats start` starts a bot as its Start
  button does (`--start <param>`, or a `t.me/<bot>?start=` link), and `chats app` prints the address of its mini app,
  which signs you in.
- **The skill tells an agent to search again in other words before saying something is not there.** A search
  finds the words it is given, and a paraphrase shares none with its answer.
- **`tg <profile> chats archive|unarchive|pin|unpin|mark-unread|mute|unmute <chat>`: your own chat list from the
  command line.** Telegram's archive, pinned chats, the unread dot and notifications, with `mute --until 2h` for a
  time and plain `mute` for good. They change only your list; nobody in the chat is told, and repeating one is safe.

- **Verified media backups.** `attachments download <dir>` archives available files across chats with size and
  SHA-256 manifests; `attachments check <dir>` verifies them offline. `attachments jobs` manages opt-in Linux
  daily timers. Completed copies survive interrupted runs and message-store deletion; interrupted files restart.
  `attachments move <dir> <archive-dir> --before-time <time>` moves older images into another verified archive,
  retaining relocation records so checks follow the copies and later downloads do not duplicate them.

- **`tg <profile> review --offline` reads the local store** (cli-core 0.398.0) instead of refusing. It shows only
  what was already synced and says so (`missing` in JSON, a warning on the terminal).
- **The MCP server offers more commands, each limited by the profile's permissions** (cli-core 0.398.0): `runs`,
  `store status|info|check|export|reindex`, `store jobs`, `attachments move`, `attachments jobs status`, `config show`,
  `commands schema`, `guide`, `skill show`, `doctor report`, the `models` lists, `replies status|test|consents show`,
  `schedule list`, `server status|logs`, and on the bot server `webhooks`, `commands set|clear`, `chats leave` and
  `chats admins`. [The MCP guide](./mcp.md#commands-the-server-leaves-out) lists the few it leaves out, and why.

- Saved voice-note transcripts match word forms and spellings that speech recognition may have garbled.
  `text:` searches written text only; `exact:` disables expansion for that word.

### Changed — may break callers

- **`tg <profile> setup --json`: the command map is `item.commands`, not `item.next`.** The envelope's `next` is
  reserved for structured continuation steps, so the map of follow-up commands (`instructions`, `inbox`, `chats`,
  `history`, `history_status`, and `skill`, `mcp` when no agent skill was installed) moved to `item.commands`; the
  values are unchanged. Login details stay under `item.session`. What to do: read `item.commands.<name>` where you
  read `item.next.<name>`.

- MCP message deletion takes `message`, chat export takes `chat`, and duplicate-task operations take `task`
  and, for a pair, `other_task`. Update saved MCP requests using `messages`, `chats` or `dup`.
  CLI positional arguments keep their order.
- Command discovery (`commands` and `commands schema`) rejects `--jsonl`; use `--json` for its single document.

### Fixed

- **The docs and the skill say `search all` also asks Telegram.** By default it sends the query's words to
  Telegram's own search too (`--backend both`); `--offline` or `--backend archive` keeps the query on your computer.
  README, usage, search and the skill said it read only this computer.
- **Installation explains npm's install-script warnings.** npm 11.17 also prints `not yet covered by allowScripts`
  for `@wirecat/tg-cli` and `better-sqlite3`; both are harmless, and the guide says why.
- **`contacts prepare` is in the people guide and the skill**, and the comparison page covers tlgr and
  mcp-telegram, links the maintained tgcli and marks tgcli's several accounts.

- **A pasted `--help` example runs** (cli-core 0.398.0): an account command's example names the profile
  (`tg personal messages list Team`) instead of failing with "name a profile".
- **`search all --help` says it asks Telegram's server by default** and names `--offline` and `--backend archive`
  to keep the query local (cli-core 0.398.0).
- Message-search commands no longer list or delete saved meeting searches.
- Command corrections preserve the chosen profile; help shows concise descriptions and concrete examples.

## 0.82.0 — 23.10.2026

### Added

- **`tg <profile> contacts prepare <person>`: what to know before talking to someone** (cli-core 0.394.0). What
  `contacts context` gives, plus the one-to-one chats where their message is the newest the store holds, open tasks
  assigned to them, accepted facts about them and their projects, your notes about them, and their recent meetings —
  each with its reference, under one size budget, with `prepare.coverage` saying what each section left out and why.
  Tasks of another Telegram account, and facts on a project bound to one, stay out. `contacts.notes.list: deny`
  leaves the notes out and says so; `messages: deny` refuses the command, as it does `contacts context`.
- **Message search reads `"a b"~N`: the words at most N words apart in one message** (cli-core 0.391.0).
- **`bot watch --public-url <url> [--port <n>]` receives a bot's updates by webhook** (cli-core 0.391.0).

### Changed — may break callers

- **Reads never mark chats read** (cli-core 0.391.0). `messages list`, `inbox` and `review` no longer take
  `--mark-read` or `--no-mark-read`, and the `catch_up_marks_read` setting is refused. Why: a command that only read
  sent the other person a read receipt. What to do: remove `catch_up_marks_read`; run `tg <profile> chats mark-read
  <chat>` when you mean to mark a chat read.
- **An unknown key under `permissions` refuses messenger commands with `configuration_error`** (cli-core 0.391.0),
  typos such as `messages.sedn` included. It was a warning, and the restriction did not hold. What to do: correct the
  key or remove it with `config unset`.

### Fixed

- **A local read with an unknown profile lists the profiles on this computer** (cli-core 0.391.0), instead of
  suggesting to link a new account.

## 0.81.0 — 22.10.2026

### Added

- **JSON answers of commands with a date filter say how they read the date** (cli-core 0.385.0): `meta.window` gives
  the bounds used, in UTC, and `meta.timezone` names the zone a date typed without one was read in. This covers
  `store export`, `messages sync`, `stats chats show`, `stats chats retention`, `contacts context`,
  `search conversations`, `replies test`, `runs search`, `stats messages unanswered`, `stats contacts responses`,
  `stats chats newcomers`, `stats messages discussion`, and a `time:` or `date:` term in `chats events`,
  `chats members history`, `inbox` and `review`.

## 0.80.0 — 22.10.2026

### Changed — may break callers

- **A time typed without a zone is read in your zone, and a date alone means local midnight** (cli-core 0.379.0).
  This covers `messages send --at-time`, `chats link create` and `chats link update --expire-time`,
  `chats mute --until` and date-only `time>=` queries, such as `chats events Valencia time>=2026-09-20`. Before,
  some of them read a date alone as midnight UTC. A time with `Z` or an offset is read as before, and JSON and MCP
  output still give every time in UTC with `Z`.

### Fixed

- **`stats chats retention` and `chats stats show` read `--since-time`/`--until-time` in their `--timezone`**, and a
  date alone in retention's `--until-time` covers that whole local day (cli-core 0.380.0). `stats charts`, `contacts
  timeline` and the MCP `stats` tool name the zone in `meta.timezone` and give the UTC window in `meta.window`.

- **The QR login line names the zone of its time:** "valid until 22:00:00 Asia/Vladivostok". Before, it gave the
  computer's local time without saying so.
- **A frozen account's deletion date says it is a UTC date:** "deletes it on 2026-10-03 (UTC)". The `until` field
  is unchanged.

## 0.79.0 — 21.10.2026

### Fixed

- **An action Telegram keeps for Premium accounts now says so** ("that needs Telegram Premium on this account").
  Before, every such refusal, for example a reaction from a free account, said that Telegram transcribes only for
  Premium. `messages transcribe` keeps its own message about Premium and the free trial.
- **A locked or unreachable Linux keyring now warns and falls back to the credentials file** (cli-base 0.47.5). The
  keyring is read through the Secret Service only; before, a failure could end in silent storage in kernel memory,
  which is gone after a logout or reboot.

## 0.78.0 — 21.10.2026

### Changed — may break callers

- **Markdown headings are refused when sending (cli-core parser).** Send text now goes through cli-core's shared
  Markdown parser, as `max` does. A line that starts with `#` used to go out as typed; it now fails with a
  validation error, because Telegram has no headings. Write the line in bold instead. Nothing else changes.
- **A message that sends you to another command names it with your profile:** after a send or an edit with no answer
  from Telegram, "check `tg personal chats list`" replaces "check `tg chats list`", so it can be pasted as it
  stands. The words now come from cli-core.
- **Telegram's account and login refusals, a stopped watch and an unanswered write carry their own error
  `reason`** instead of the generic one for their code: `login.revoked`, `login.duplicated`, `account.deactivated`,
  `account.banned`, `account.frozen`, `account.limited` (were `auth.failed` or `access.denied`), `updates.stopped`
  (was `provider.unavailable`) and `write.unanswered` (was `outcome.unknown`). Codes, exit codes and messages are
  unchanged. Under `--debug`, the record's `cause` now gives the failure behind it, not only its code.

### Fixed

- **Search queries keep an `@` that is followed by a letter inside a term.** E-mail addresses without a dot after the
  `@` and chat ids no longer need quotes: `email:ana@example.com` works as typed.

## 0.77.0 — 20.10.2026

### Novedades

- **El almacén guarda el historial de un chat (versión 25 del almacén, cli-core 0.366.0).** Un cambio de id, título,
  pertenencia o visibilidad en la búsqueda de un chat se guarda en `chat_revisions` con el valor anterior y el nuevo;
  una lectura por el id que tenía un chat antes del cambio encuentra el chat en que se convirtió. El almacén pasa a la
  versión 25 al abrirse por primera vez; no se envía nada.

### Correcciones

- **Un chat que abandonaste se encuentra por cualquiera de sus ids** (cli-core 0.368.0) en `store export`, `store status`, `messages
  thread`, en `--chat` y `chat:` de una búsqueda, en etiquetas, tareas y las demás lecturas de su historial guardado.
  `chats track` y `store gaps plan` lo rechazan: "you left chat <id>".
- **`tg guide` muestra el escenario de memo con el mismo título que memo y las demás herramientas:** "One person
  across every tool", con mayúscula. Con cli-core 0.370.0, la comprobación de escenarios en las pruebas también
  detecta caracteres de la shell fuera de comillas en un paso.

## 0.76.0 — 19.10.2026

### Cambios — pueden romper scripts

- **Sin terminal, el código QR de acceso se imprime como texto para que un agente lo pegue en el chat; `--qr-file`
  desaparece.** Un agente escribía un PNG y lo abría en un visor de imágenes, una ventana que se puede perder. Ahora
  `tg <profile> session
  start qr` y `setup` imprimen el código en stderr como texto plano (medios bloques, sin colores,
  dibujado para un tema de terminal oscuro) y luego indican al agente que lo pegue como bloque de código, tal como se
  imprimió, y que pegue el código renovado diciendo que el anterior caducó. Con `--json` cada código también es una
  línea en stderr, `{"event":"qr","qr":{"text","expires_at","scan"}}`. En una terminal el código se dibuja como antes.
  `--qr-file` se elimina de `session start` y `setup`. Sin terminal, el acceso sigue necesitando las claves de la
  aplicación guardadas y ninguna 2FA, y se rechaza antes de abrir un navegador; el acceso por teléfono necesita una
  terminal. El acceso sigue fuera de MCP: ejecuta el comando
  ([cuando un agente inicia la sesión](./sessions.md#when-an-agent-runs-the-login)).

### Novedades

- **`store clear --left` nombra los chats que elimina** (cli-core 0.353.0): el rechazo sin `--allow-dangerous`
  enumera los primeros 20, `--dry-run` los enumera todos y la respuesta incluye una lista `left` (`id`, `title`,
  `messages`).

### Correcciones

- **De cli-core 0.351.0–0.362.0:** `chats leave` y `chats join` actualizan el almacén, y `chats show` encuentra un
  chat que abandonaste; un mensaje enviado se guarda en el chat en el que respondió Telegram; un chat con clave nueva
  conserva la privacidad más estricta de sus dos mitades; un chat oculto de la búsqueda queda fuera de toda búsqueda
  que no lo nombre; el `last.json` de una ejecución programada fallida guarda un código de error, nunca el título de
  un chat; el primer `serve` tras una actualización cambia las claves de los chats en pasadas cortas en lugar de
  bloquear el almacén.
- **`messages forward` devuelve y guarda la copia reenviada en el chat al que fue.** Tomaba el primer mensaje nuevo
  de la respuesta de Telegram, que puede pertenecer a otro chat; ahora toma el que nombra su id de envío, en el chat
  de destino. Crear un tema de foro lee su primer mensaje de la misma forma.

## 0.75.0 — 19.10.2026

### Correcciones

- **El paso de inicio de sesión de `setup` se titula «Link this device»** y ya no pide escanear un código QR antes
  de dibujarlo. La línea bajo el código dice dónde escanearlo; una terminal estrecha muestra solo la sugerencia de
  ensancharla.
- **Una terminal demasiado estrecha para el código QR ya no pide escanearlo** (cli-core 0.350.0). `session start` y
  `setup` decían dónde escanear en Telegram antes del código; si el código no cabía, solo seguía la sugerencia de
  ensanchar la terminal o pasar `--qr-file`. Ahora la línea de escaneo va después del código dibujado o de la nota
  de `--qr-file`, y una terminal estrecha muestra solo la sugerencia.
- **`tg <profile> setup --help` vuelve a mostrar el bloque Global Options.** 0.74.0 lo perdió cuando la línea de
  uso ganó `<profile>`.
- **Las sugerencias de errores y notas nombran el perfil**: «the store is behind this build — `tg personal store migrate`»
  en lugar de `tg store migrate`, que al copiarlo fallaba con «name a profile».

### Novedades

- **Un siguiente paso en la salida `--json` y en un error lleva `line`, el comando completo con el perfil**
  (cli-core 0.348.0): `"line": "tg personal mcp config"` junto a `"command": "mcp config"`. Copiar solo `command`
  fallaba con «name a profile». `command` no cambia, y las respuestas MCP omiten `line`.

## 0.74.0 — 19.10.2026

### Novedades

- **`tg guide` enumera escenarios: los comandos para una tarea habitual, en orden, y el porqué de cada uno.** tg trae
  cuatro —`catch-up`, `find-what-was-said`, `searchable-files` y `agent-without-send`— y la lista remite a
  `person-brief` de memo para ver a una persona en todas las herramientas. `tg guide <name> --json` devuelve uno como
  datos. La CI comprueba que cada paso sea un comando de tg cuyas opciones y argumentos se analicen sin error.
- **El `--help` de cada comando termina con Returns, Next usually y Example** (cli-core 0.345.0), y
  `docs/commands.md` lleva las mismas líneas. La línea de uso muestra `tg <profile> …`.

### Cambios — pueden romper scripts

- **`npm install -g` instala la skill del agente solo cuando se pide.** Antes la escribía por defecto en
  `~/.claude/skills` y `~/.agents/skills`, y npm oculta la salida de los scripts del ciclo de vida, así que nadie se
  enteraba. Ahora `TG_INSTALL_AGENT=all` (o el nombre de un agente) la instala durante la instalación; si no,
  `tg <profile> setup` la ofrece, o `tg skill install --for all`. El instalador de Windows pasa `all` por sí mismo y no
  cambia.
- **`tg --help` y `tg` sin nada muestran una primera pantalla breve** (cli-core 0.344.0): para qué sirve tg, ocho cosas
  que hace y un cliente normal no, las demás herramientas de WireCat y adónde ir después. La ayuda completa de
  commander, con cada comando y opción, está en `tg --help-all`; solo las opciones, en `tg help options`. Un script que
  buscaba un comando o una opción global en `tg --help` debe leer `--help-all`.
- **`tg commands` sin `--json` imprime una lista de texto, por secciones, incluso con la salida redirigida**: una línea
  por comando, con el uso, qué hace y `(writes)` cuando cambia algo. Antes imprimía el documento JSON completo.
  `--json` y `--jsonl` imprimen el mismo documento que antes; un script que analizaba un `tg commands` sin opciones
  debe pasar `--json`.
- **El `provider_metadata` de un chat indica `null` para un indicador desactivado o un nombre de usuario que ya no
  existe**: antes `isBot`, `isForum`, `pinned` y `username` se omitían. El almacén de cli-core pronto conservará una
  clave omitida, así que un chat desfijado o un nombre de usuario abandonado seguirían en el almacén, y `@old` seguiría
  encontrando el chat. Todos los lectores de tg y cli-core tratan `null` como ausente, pero la salida JSON ahora
  muestra estas claves como `null`: un script que comprueba si la clave está presente la verá.

### Seguridad

- **El inicio de sesión por QR es `loginQr` de cli-core, como en max y wa.** `--qr-file` se escribe como un archivo
  temporal creado con modo `0600` y renombrado sobre la ruta, en lugar de escribirse y luego cambiarle los permisos, y
  se borra cuando el inicio de sesión se interrumpe con Ctrl+C, una cancelación o `--timeout`, no solo cuando termina
  por sí mismo. Una terminal demasiado estrecha para el código no dibuja nada y pide ensancharla o pasar
  `--qr-file`. Sin terminal, `session start` dice "shows a QR code to scan — run it in a terminal, or pass
  --qr-file <png>".
- **Con el bloqueo de solo lectura y en un perfil readonly, una escritura se rechaza antes de conectarse; los rechazos
  aparecen en `sends list`** (cli-core 0.343.0).

### Correcciones

- **`inbox` y `review` declaran su salida**, así que `tg commands schema inbox` da los campos del resumen de mensajes
  y `--json=<fields>` rechaza un nombre que no tienen en lugar de imprimir elementos vacíos (cli-core 0.345.0).

## 0.73.1 — 18.10.2026

### Correcciones

- **tg arranca un poco más rápido.** Compilado sobre cli-core 0.342.0 y cli-base 0.45.0: un comando ya no analiza las
  tablas de reglas que solo usan las comprobaciones de desarrollo, lo que ahorró unos 7–12 ms por arranque en la
  [medición](https://github.com/WireCatLabs/cli-testing/tree/main/performance/startup/standards-split-before/README.md).

## 0.73.0 — 18.10.2026

### Novedades

- **Los agentes reciben por `tg mcp` todos los comandos que permiten los niveles del perfil** (cli-core 0.341.0). El
  servidor ofrecía herramientas escritas a mano; ahora las construye a partir de los propios comandos y las ejecuta en
  este proceso, 188 comandos en total, entre los nuevos `messages sync`, `contacts sync`, `mentions confirm`,
  `conversations embed` e `images embed`. Lo que un agente no puede hacer lo deciden los niveles del perfil: pon el área
  en `readonly` o `deny`. La lista completa está fijada en `contracts/mcp-catalogue.json`.
- **`tg conversations rebuild`** vuelve a construir las conversaciones de los chats que cambiaron y las incrusta con el
  modelo de este equipo; nunca consulta a Telegram, no descarga ningún modelo y no envía texto a ninguna parte.
  Sustituye a la herramienta `conversations_refresh`, que solo tenía el agente.

### Cambios — pueden romper scripts

- **Los argumentos de las herramientas de `tg mcp` son las opciones del comando en snake_case**: `chat`, `limit`,
  `query`, `sync_first`, etc. Un agente que recordaba los nombres antiguos vuelve a consultar `tg_tools_search`.
- **`search messages` de un agente acepta la consulta solo como texto**; la entrada estructurada `ast` desaparece.
- **Un agente no puede marcar como leído ni actuar como el propietario**: no se le ofrecen `--mark-read` en
  `messages list`, `inbox` y `review` ni `--as-owner`, el ajuste `catch_up_marks_read` no se aplica a sus ejecuciones y
  sus puntos de control `--new` son propios.
- **Con `TG_READ_ONLY` se rechazan las escrituras locales que borran o sobrescriben lo que guardaste** (cli-core
  0.336.0, 0.337.0): `searches create`, `searches delete`, `searches clear`, `contacts alias set|rm`, `contacts notes
  add|edit|remove`, `contacts link|unlink`, `tags add|auto|remove`, `mentions confirm|reject`, `attachments text set`,
  `chats tracking add|remove`, `conversations links add|clear`, `conversations consents revoke` y `tasks reject`, y sus
  herramientas de agente, salen con 5. Lo que el archivo reconstruye por sí mismo, la sincronización, `serve` y el
  registro de tareas siguen funcionando.
- **Mientras Telegram retiene la cuenta, no sale ninguna escritura** (cli-core 0.334.0): también se rechazan
  reacciones, marcar como leído, fijados silenciosos y cambios de título y de perfil; la lectura funciona. Un bloqueo
  sin fin retiene las escrituras hasta que `tg flood clear` o `tg doctor --online` encuentre bien la cuenta
  (`until: null` en JSON).
- **Un envío bloqueado por el cerrojo de otro proceso sale con 9 (`timeout`), no con 1** (cli-core 0.338.0); no se envió
  nada, así que es seguro reintentarlo. También `flood clear`.
- **`tg upgrade --offline` sale con 2** (cli-core 0.338.0) en lugar de consultar npm de todos modos.
- **`conversations build`, `conversations embed` y `search conversations` avisan de que pueden enviar texto fuera**
  (cli-core 0.334.0, 0.336.0): con `--analyze`, `--provider` o un modelo de embeddings remoto. Con `TG_READ_ONLY` se
  niegan antes de enviar; un modelo local sigue funcionando. Nunca se ejecutan a través de `serve`.

### Correcciones

- **`tg mcp` responde a cada llamada recibida antes de que se cierre stdin** en lugar de salir con una todavía en curso.
  `tg bot mcp` aún no.
- **A un agente no se le ofrece `offline` en un comando que lo rechaza** (cli-core 0.335.0): `topics`, `chats events`,
  `chats inspect`, `chats members audit`, `chats members fetch` y los comandos `chats folders`.
- **Un cerrojo ocupado ya no detiene `tg serve`** (cli-core 0.340.0) hasta 5 segundos.
- **Dos cambios a la vez en la lista de destinatarios ya no se anulan entre sí** (cli-core 0.338.0).
- **`tg store gaps repair --background` ejecuta su tarea** en lugar de fallar al instante (cli-core 0.339.0).
- **Las pistas de `server` y de los comandos de mantenimiento del archivo nombran el perfil** (cli-core 0.339.0).
- **`tg upgrade --check` funciona con `TG_READ_ONLY`** (cli-core 0.338.0).
- **Las descargas de modelos nunca pasan por `tg serve`** (cli-core 0.336.0).
- **Un archivo que no se pudo abrir se cierra** (cli-core 0.332.0), así que su carpeta se puede borrar en Windows.

## 0.72.0 — 18.10.2026

### Novedades

- **`tg tasks agenda` muestra lo que otros te deben** (cli-core 0.328.0): las tareas abiertas que hace otra persona, de
  la más antigua a la más reciente, con sus responsables, en una sección «assigned» y en `assigned` en JSON.

### Cambios — pueden romper scripts

- **Una ruta de comando dada como un solo argumento falla** (cli-core 0.328.0): `tg 'chats list' --help` imprimía la
  ayuda general y salía con 0; ahora falla e indica la línea de comandos que hay que ejecutar.
- **Un comando interactivo sin terminal espera 5 minutos por defecto, no 30 segundos** (cli-core 0.328.0), para que el
  `tg session start --qr-file` de un agente no se corte antes de escanear el código. `--timeout` y `TG_TIMEOUT` siguen
  decidiendo cuando se indican.
- **Con `TG_READ_ONLY`, una escritura que pregunta primero se detiene con salida 5 antes de preguntar, no con salida 7**
  (cli-core 0.329.0): `messages delete`, `topics delete`, `account sessions end`, `chats delete` y `chats clear`
  decían «pregunta antes de actuar», como si `--allow-dangerous` los dejara pasar. Ahora dicen «este proceso es de solo
  lectura», como cualquier otra escritura. Sin el bloqueo preguntan como antes.

### Correcciones

- **Menos sugerencias falsas de duplicados por cadenas de respuestas** (cli-core 0.331.0): una respuesta que pide algo
  nuevo ya no marca dos tareas como posiblemente la misma.
- **`tg chats list --json | head` termina sin ruido** (cli-core 0.328.0), también a través de un `serve` en marcha, en
  lugar de imprimir una traza de pila cuando el lector se detiene.

### Seguridad

- **`tg session end` ya no cierra la sesión de un `tg serve` en marcha** (cli-core 0.328.0): con `serve` en marcha para
  el perfil, `session end` se le pasaba a `serve` para que lo ejecutara. Cerraba la conexión que usaba `serve` y
  borraba el archivo de sesión que `serve` aún tenía abierto. Ahora `session start`, `session end` y `setup` nunca se
  ejecutan a través de `serve`, y `session end` se detiene con salida 2 y pide ejecutar antes
  `tg <profile> server stop`. Con `TG_READ_ONLY` los tres siguen deteniéndose con salida 5, ahora con «no puede iniciar
  ni cerrar sesión».

## 0.71.0 — 17.10.2026

### Cambios — pueden romper scripts

- **En un grupo con la etiqueta `watch-tasks`, la respuesta de cualquier miembro cierra una pregunta** (cli-core
  0.325.0): una respuesta directa de alguien que no sea quien preguntó la resuelve; un mensaje posterior que no
  responde no cierra nada.
- **Las herramientas de `tg <bot> bot mcp` son los propios comandos del bot** (cli-core 0.325.0): los argumentos de un
  agente son los del comando, en snake_case: `messages send` y `messages edit` reciben `md` o `html` en lugar de
  `format`, `messages delete` recibe `messages` (una lista), `search messages` recibe `query`, `chats members remove`
  recibe `person`. Nuevo: `chats rules show`, y `offline` en cada lectura. Enviar archivos, `--allow-dangerous` y
  `chats moderate --max-actions` quedan para el propietario. El catálogo está fijado en `contracts/bot-catalogue.snap`.

## 0.70.0 — 17.10.2026

### Novedades

- **`tg <profile> contacts link <person> me`** (cli-core 0.323.0): indica que un contacto eres tú, para una cuenta tuya
  que el almacén no puede emparejar por sí solo, como `zoom:<id>`.

### Corregido

- **Las menciones encuentran menos nombres equivocados** (cli-core 0.323.0). Una palabra del nombre de un contacto
  cuenta por sí sola solo como nombre o apellido; un contacto con nombre de empresa («Smart Agents») se encuentra solo
  por el nombre completo, y los corteses «Ваш», «Вам», «Вас» nunca cuentan. El nombre de un santo en un lugar («Saint
  Michael's Bridge») y una ciudad tras «в»/«во» («во Владимире») tampoco son nombres.
- **Tus propias cuentas eres tú** (cli-core 0.323.0): la identidad propia de una cuenta se vincula contigo en su
  siguiente sincronización, así que tu nombre en tus mensajes ya no es el de otra persona.
- **Una dirección conserva su ciudad** (cli-core 0.323.0): la misma calle en dos ciudades son dos lugares; una
  dirección escrita sin ciudad sigue coincidiendo con su lugar en esa calle.

Después de actualizar, vuelve a leer los mensajes antiguos una vez: `tg <profile> mentions rebuild person-name place`.

### Seguridad

- **`TG_READ_ONLY` ahora impide iniciar y cerrar sesión, y los cambios en el almacén de mensajes**: `session start`,
  `session end` y `setup` se niegan con `permission_error` antes de conectarse, igual que `store reset`, `restore`,
  `clear`, `migrate`, `repair`, `copies delete` y `decrypt`. Antes, `session end` cerraba la sesión y la borraba
  bajo el bloqueo.

## 0.69.0 — 17.10.2026

### Cambios — pueden romper scripts

- **Un agente ya no puede eliminar para todos** (cli-core 0.321.0). El `messages delete` de MCP no acepta
  `for_everyone`, y pasarlo se rechaza como argumento desconocido; el propietario sigue teniendo
  `tg <profile> messages delete --for-everyone`.
- **`mcp --permission` solo endurece** (cli-core 0.321.0). Una anulación que aflojaría el nivel del perfil, como
  `messages.send=allow` en un perfil de solo lectura, se rechaza al iniciar indicando la clave; para permitir más,
  cambia los permisos del perfil. `--permission messages.send=deny` y otras anulaciones que restringen funcionan como
  antes.

### Corregido

- **La denegación de un agente en `chats send-as` y `chats members list` ahora se aplica** (cli-core 0.321.0). Mediante
  MCP estos comandos leían sus niveles de otras claves, así que `chats.send-as` y `chats.members.list` no les llegaban.

## 0.68.0 — 17.10.2026

### Cambios — pueden romper scripts

- **Las tareas se abren solo donde se te pide algo** (cli-core 0.318.0). En un chat individual cada pregunta que no
  respondiste abre una, como antes; en un grupo solo una pregunta en respuesta a tu mensaje y una mención tuya; en un
  canal o en Mensajes guardados, nada. En el almacén del propietario, 300 publicaciones de un canal habrían abierto 85.
- **`tasks apply` ahora es `tasks scan`** (cli-core 0.320.0); MCP `tasks_scan`, clave de permiso `tasks.scan`.
- **Ningún ajuste elige ya un perfil** (cli-core 0.319.0). Un comando nombra su perfil con la primera palabra o con
  `TG_PROFILE`. Un archivo de configuración que aún tiene `default_profile` detiene un comando que no nombra perfil,
  con el perfil que hay que escribir y `tg config unset default_profile`; `tg config set default_profile` se rechaza.
  Un perfil llamado `default` es un nombre normal: `tg default mcp config` llama a su servidor `tg-default`, no `tg`.

### Novedades

- **Las tareas tienen responsables** (cli-core 0.320.0): `tasks add` y `tasks plan` aceptan `--assignee sender` (quien
  envió el mensaje) o `--assignee person:<id>`; `none` lo quita. `tasks list "assignee:any state:open"` es lo que otros
  te deben.
- **`tg <profile> tags add --chat <group> watch-tasks`** registra cada pregunta de ese grupo como tarea, sea para quien
  sea.

### Corregido

- **La pista de `tg upgrade` sobre una versión retenida nombra el paquete y conserva la exención de antigüedad de pnpm**
  (cli-core 0.320.0).

## 0.67.0 — 17.10.2026

### Seguridad

- Las referencias internas de los adjuntos quedan fuera de JSON, JSON lines, MCP y la salida de eventos (Core0.315.0); las claves multimedia y credenciales del proveedor permanecen dentro del cliente.

- Los archivos de estado de WhatsApp no se pueden subir como adjuntos (Core 0.314.0), incluso con rutas de estado configuradas o mediante enlaces simbólicos. Los archivos normales contiguos siguen permitidos.

## 0.66.0 — 17.10.2026

### Cambios — pueden romper scripts

- **La primera sincronización no abre tareas del historial** (cli-core 0.309.0). Tras la primera sincronización de
  una cuenta, las reglas de tareas abren como mucho `task_first_pass_per_chat` tareas por chat, y por defecto son 0.
  En la respuesta de la sincronización, `tasks` cuenta lo que se dejó sin abrir (`held`, `held_chats`) y una nota
  indica `tasks apply`. Las sincronizaciones siguientes siguen abriendo tareas a partir de mensajes nuevos.
  `tg <profile> config set task_first_pass_per_chat 50` recupera el comportamiento anterior.

### Novedades

- **`tg <profile> tasks apply <chat...>`** (cli-core 0.309.0): las reglas de tareas sobre los mensajes guardados más
  recientes de un chat (`--last`, 50 por defecto), para un chat cuyo historial quieres convertir en tareas. Muestra
  lo que se abriría y no cambia nada sin `--yes`. Solo el almacén local. MCP: `tasks_apply`.

- **Las menciones encuentran direcciones postales y nombres de personas que el almacén aún no conoce** (cli-core
  0.308.0). `tg <profile> mentions places` muestra las direcciones confirmadas de todas las cuentas. El almacén pasa
  a la versión 18, con una tabla `places`, la primera vez que un comando lo abre.

### Correcciones

- **`tg upgrade` con pnpm instala la versión más reciente** (cli-base 0.40.2). pnpm 11 solo instala versiones con al
  menos un día, así que la actualización podía instalar un `tg` más antiguo que el que tenías. Ahora `@wirecat/*`
  queda fuera de esa espera; el resto de paquetes la mantiene.
- Los resúmenes de la ayuda de `mentions` caben en el límite común de 80 caracteres (cli-core 0.311.0).
- **La comprobación de duplicados compara las tareas por la fecha de envío de sus mensajes** (cli-core 0.310.0), no
  por cuándo se escribió la tarea. Las tareas escritas de una vez a partir del historial ya no parecen iguales.
- **Los mensajes antiguos descargados en un chat tranquilo no abren tareas** (cli-core 0.309.0): una pasada de
  sincronización se salta un chat en el que no se envió nada desde la anterior.
- **Sin líneas `[client] cannot reach Telegram` mientras tg no puede conectarse.** Desde 0.64.0, tg mostraba cada
  error en segundo plano de mtcute en una línea; sin red, eso es una línea por intento de conexión. Ahora solo se
  ven con `--verbose`. Una petición que falla sigue informando de su propio error.

## 0.65.0 — 17.10.2026

### Novedades

- **La ficha de una tarea cerrada muestra la tarea que le da seguimiento** (cli-core 0.305.0). `tasks show` imprime
  `task:<id> follow-up-of this task`, y `--json` y MCP devuelven `linked_from`. Antes, solo la tarea nueva nombraba
  la cerrada.

### Cambios — pueden romper scripts

- **El aviso diario de «hay una versión nueva» también calla con `--json=…`, `--timeout=…` y las demás opciones
  silenciosas escritas con `=`** (cli-core 0.307.0). Antes solo lo silenciaba la opción sin valor. tg toma ahora este
  aviso de cli-core, compartido con max y memo.

### Correcciones

- **`tg setup --app auto` lee las claves de la app en el my.telegram.org rediseñado.** El sitio muestra ahora el
  api_hash como puntos y guarda su valor en los botones de copiar y mostrar, así que 0.64.0 se detenía con «could not
  read its keys». Ahora las claves se leen de ahí (comprobado en la página real), la creación se da por hecha cuando
  el sitio responde OK y se muestra el texto de error del propio sitio en lugar de su JSON.

- **Un archivo de configuración roto se nombra en un error breve** (cli-core 0.304.0): la primera clave incorrecta,
  nunca su valor.

## 0.64.0 — 16.10.2026

### Novedades

- **Los documentos importados de Drive conservan su URL de Google y su fecha de edición en la búsqueda común**
  (cli-core 0.301.0). `--source drive:<profile>` elige un perfil de Drive registrado; las listas de documentos de un
  chat pueden mostrar el título importado después de que la sincronización de Drive enlace los mensajes guardados.

- **El servidor MCP solo se carga cuando se sirve MCP** (cli-core 0.300.0), así que los demás comandos arrancan
  cargando alrededor de una décima parte menos de archivos.

### Correcciones

- **`tg setup --app auto` ya no intenta crear una segunda app cuando la cuenta ya tiene una.** Leía las claves de la
  app solo con una disposición exacta de la página; cuando my.telegram.org mostraba la página de la app de otra
  forma, tomaba la cuenta por una sin app y pedía al sitio crear otra (Telegram permite una por número). Ahora las
  claves se leen del texto de la página, y una página de app cuyas claves no se pueden leer se detiene con «use
  `--app browser`». Un error del sitio ya no cita la página entera, que podía contener el `api_hash` de la app, sino
  solo su título. La pista tras un paso de app fallido nombra el comando que se ejecutó
  (`tg <profile> setup --app browser`), y demasiados intentos con el código del sitio dan `rate_limited`.

- **Un inicio de sesión con contraseña 2FA ya no imprime la traza de mtcute «unhandled error: ConnectionClosedError».**
  Cuando el inicio de sesión funciona, mtcute sustituye sus conexiones a propósito. La conexión antigua avisaba de que
  se había cerrado y, sin nadie escuchando, mtcute lo imprimía como una traza roja, con el id de la cuenta, justo
  después de pedir la contraseña oculta. Ahora tg escucha estos errores en segundo plano: el cierre esperado solo se
  ve con `--verbose`, y cualquier otro aparece en una línea con las palabras de tg.

- **`bin/release` se reinicia una vez cuando la versión trae un `bin/release` más nuevo**: plegar el historial de
  cambios y subir la versión avanzan `main`, y el intérprete seguía leyendo el script antiguo desde el byte al que
  había llegado, así que el resto de la ejecución mezclaba texto antiguo y nuevo. Ahora arranca el script nuevo
  desde el principio con los mismos argumentos; un segundo cambio durante esa ejecución lo detiene con
  `run it again`. El reinicio también funciona cuando `bin/release` se lanzó desde otra carpeta con una ruta
  relativa. Solo afecta a la publicación del propio repositorio; el paquete publicado no cambia.

## 0.63.0 — 16.10.2026

### Novedades

- **`messages delete` acepta los ids de los mensajes separados por comas, además de por espacios** (cli-core 0.299.0).
- **tg arranca alrededor de una quinta parte más rápido después de la primera vez.** Guarda el código compilado de
  Node en una caché, en la carpeta temporal del sistema (`NODE_COMPILE_CACHE` la cambia de sitio): `tg --help` pasó
  de unos 0.60 a 0.49 segundos.
- **La lista de categorías de tareas está en un archivo que comparten tg, MAX y memo** (cli-core 0.298.0):
  `~/.config/WireCat/config.json`, sección `task_categories`. Solo guarda tus cambios a la lista por defecto:
  `"garden": "plants | seedling, es:planta"` añade o sustituye una categoría, `"religion": null` quita una de la
  lista por defecto, y las categorías que añada una versión posterior siguen llegando. `tasks categories` (MCP
  `tasks_categories`) indica el archivo en `file`, y `config show` marca las categorías que vienen de él. Un archivo
  que no es JSON válido o que nombra una categoría incorrecta se rechaza indicando su ruta. Un almacén movido con
  `MESSAGING_STORE` lee el `config.json` que está a su lado; `WIRECAT_CONFIG_DIR` cambia el archivo de sitio.

### Cambios — pueden romper scripts

- **`config set task_categories.<name>` y `config unset task_categories.<name>` ahora escriben en
  `~/.config/WireCat/config.json` en lugar del almacén**, y conservan las otras secciones del archivo;
  `config unset task_categories` quita la sección. Una lista que una versión anterior de tg guardó en el almacén pasa
  al archivo con el siguiente `config set` o `unset` de una categoría; hasta entonces sigue valiendo la lista del
  almacén. Las versiones anteriores de tg no leen el archivo.

## 0.62.0 — 16.10.2026

### Novedades

- **El cierre de un agente puede esperarte** (cli-core 0.295.0): `tasks close` ejecutado por un agente de IA
  (con `AI_AGENT` o `CLAUDECODE` definida) indica su certeza con `--certainty <0..1>`. Por debajo del umbral del
  almacén (`config set task_agent_close_min`, 0.8 por defecto), o con `config set task_agent_close off`, la tarea
  sigue abierta con una sugerencia de cierre; `tasks list close:suggested` y `tasks agenda` la muestran. Confírmala
  con `tasks close <task>` o recházala con el nuevo `tasks reject <task>`. `--as-owner` cierra en tu nombre.
- **Una tarea nueva sobre una tarea cerrada en los últimos 14 días se abre como su seguimiento**, enlazada
  `follow-up-of` a la cerrada, en lugar de rechazarse como duplicado. Se sigue rechazando mientras una tarea
  abierta pueda ser el mismo trabajo.
- **`tasks categories` nombra las categorías que salieron de la lista** mientras las tareas aún las llevan, con
  el número de tareas abiertas y el total (`unlisted`); `tasks agenda` enumera las que llevan las tareas abiertas
  (`unlisted_categories`).

### Cambios — pueden romper scripts

- **El `tasks close` de un agente debe pasar `--certainty`** (MCP `tasks_close`: el `certainty` obligatorio), o
  falla con `task.certainty-required`. Por debajo del umbral, la respuesta tiene `state: open` y `close_suggestion`
  en lugar de una tarea cerrada. Un script que cierra tareas desde la terminal de un agente necesita `--certainty`,
  o `--as-owner` cuando el propietario pidió el cierre.
- **`tasks add` puede rechazar ahora una tarea cuyo mensaje comparte palabras con el mensaje de una tarea abierta**
  (código de salida 2, `task.duplicate-candidates`): la comprobación de duplicados también lee el mensaje de
  origen de una tarea y sus mensajes enlazados más recientes, así que una tarea de regla con el título vacío se
  compara por su mensaje. Repite con `--into <task>` o `--new`.
- **59 categorías de tareas por defecto en lugar de 7**, como `bills`, `health`, `travel`, `fitness` y
  `subscriptions`; `tasks categories` muestra cada una con su significado y sus palabras clave. Las siete antiguas
  conservan sus nombres, así que las tareas guardadas siguen siendo válidas, pero una regla elige ahora el nombre
  más concreto: una factura de suministros es `bills`, no `money`. Por eso un filtro como `category:personal`
  recoge menos tareas nuevas. Un almacén que guardó su propia lista la conserva; `config unset task_categories`
  toma la nueva lista por defecto. Una lista admite hasta 80 categorías.

### Corregido

- **El texto de las tareas en español se lee mejor**: la categoría de una regla coincide con otras formas de una
  palabra clave española (`pagues` coincide con `pagar`), y la comprobación de duplicados lee fechas límite en
  español como `mañana` o `el viernes`.

## 0.61.0 — 16.10.2026

### Cambios que pueden afectar a los scripts

- **`tg mcp` y `tg bot mcp` ya no aceptan las antiguas banderas de acceso** `--allow-send`, `--allow-mark-read`,
  `--allow-delete`, `--allow-moderate`, `--confirm-send`, `--allow-dangerous` y `--http-confirmation` (cli-core
  0.292.0). Una entrada de aplicación que aún pase una deja de arrancar con «unknown option»: quita la bandera;
  deciden los permisos del perfil, como ya hacían.

### Corregido

- **Los scripts de publicación muestran los procesos que tienen el bloqueo aparte de las etiquetas de
  publicaciones antiguas.** El diagnóstico compartido ya no atribuye un bloqueo vivo a una ejecución anterior;
  espera a que terminen y vuelve a intentarlo.

- **Un inicio de sesión que falla al abrirse ya no deja abierto el cliente de Telegram**: cuando falla la carga del
  usuario conectado, el adaptador cierra el cliente y el archivo de sesión antes de que el error llegue al comando.

## 0.60.0 — 15.10.2026

### Cambios que pueden afectar a los scripts

- **Tareas y servidor usan los nombres del vocabulario compartido**, sin alias (próximo cli-core, cli-base 0.33.0):
  `tasks similar` → `tasks related`; `tasks duplicates unsure` → `tasks duplicates defer` (permiso
  `tasks.duplicates.defer`; la decisión guardada sigue siendo `unsure`); `tasks add --attach` → `--into`;
  `tasks claim
--for` → `--lease`; `tasks agenda --due` → `--due-within`; `server logs --lines` → `--limit` (conserva `-n`).
  MCP usa `tasks_related`, `tasks_duplicates_defer`, `into`, `lease`, `due_within`.
- **`tasks agenda` y `tasks duplicates` filtran con campos de consulta, no opciones**:
  `tasks agenda --tag <name>` → `tag:<name>`, `--category <name>` → `category:<name>`, `--claimed` → `claimed:any`;
  `tasks duplicates --unsure` → `decision:unsure`. En MCP, `tasks_agenda` y `tasks_duplicates` aceptan `query`.

## 0.59.0 — 15.10.2026

### Cambios que pueden afectar a los scripts

- **Las opciones usan el vocabulario compartido**, sin alias (próximo cli-core):
  `chats members audit|fetch --budget` → `--max-pages`; `messages sync --estimate` → `--dry-run`;
  `contacts context --refresh`, `bot contacts show
--refresh` y `tags auto --refresh-metadata` → `--sync-first`;
  `search conversations --refresh` → `--catch-up`; `attachments show --if-sha256` → `--expected-fingerprint`;
  `replies edit --chats|--not-chats|--people|--not-people` → `--allow-chats|--deny-chats|--allow-people|--deny-people`;
  `schedule agent|command --once` → `--at-time`; `bot chats moderate --no-ban` → `--no-block`;
  `chats mark-read --until` → `--until-id`; `tasks add|plan --check` → `--remind-time`;
  `store export --to` → `--output-dir` y `--kind` → `--include`; `bot store fetch --from` → `--until-id`.
  Los argumentos MCP siguen estos nombres: `max_pages`, `until_id`, `expected_fingerprint`, `sync_first`, `remind_time`.

## 0.58.0 — 15.10.2026

### Novedades

- **Tareas que pueden ser un mismo trabajo** (cli-core 0.285.0): `tasks similar <task>` puntúa las tareas
  similares; `tasks duplicates [--unsure]` lista los pares encontrados por reglas;
  `tasks merge <task> --into <other>` los une y `tasks unmerge` lo deshace;
  `tasks duplicates reject|unsure` decide cada par. `tasks agenda` acepta `--category` y `--tag`;
  `config set task_categories.<name>` cambia las categorías de todo el almacén.
- **Menciones** (cli-core 0.285.0): `mentions domains` lista sitios enlazados; `mentions list --new` muestra
  lo encontrado tras la última revisión; `mentions confirm|reject <id> --all-in-chat` decide todas las
  apariciones del nombre en el chat; un enlace `t.me` identifica su chat o persona.
  `config set phone_countries es,ru` lee teléfonos sin `+`.
- **Almacén versión 16**: las reglas de menciones leen también texto de notas y documentos guardados;
  `mentions rebuild` procesa los anteriores. `mentions list` sigue mostrando solo menciones en mensajes.
  La actualización añade únicamente triggers, por lo que un tg anterior puede abrirlo.

### Cambios que pueden afectar a los scripts

- **`tasks add` rechaza posibles duplicados** de una tarea abierta o cerrada en los últimos 14 días
  (cli-core 0.285.0): código 2, razón `task.duplicate-candidates`, candidatos en `details.candidates`.
  Repite con `--attach <task>` para vincular el mensaje a esa tarea, o `--new` para crear otra de todos modos;
  también se aplica a `tasks add` en MCP.
- **`phone:` y `value:` también comparan el final del teléfono guardado con los dígitos nacionales escritos**
  (8 o más; cli-core 0.285.0). Un teléfono guardado antes de `phone_countries` se encuentra de ambas formas.
  Un fijo ruso por grupos, `(812) 000-00-01`, se guarda como `+78120000001`, no como dígitos sin prefijo.
- **tg ya no busca correo** (cli-core 0.285.0, cli-core#1121): desaparecen `tg search mail` y MCP `search_mail`;
  `search all` lee mensajes y notas, nunca correo; rechaza `--only mail`. `tg search mail …` responde
  ``mail is memo's: install @wirecat/cli-memo, then `memo search mail …` ``.
  Se conservan `search notes`, tareas, notas y etiquetas.

### Corregido

- Un título con mayúsculas cirílicas se encuentra con una consulta en minúsculas (cli-core 0.285.0).
- **Un adjunto HTML hostil ya no bloquea la lectura** (cli-core 0.285.0): una página con etiquetas o
  comentarios sin cerrar se procesa en tiempo lineal respecto a su tamaño.

## 0.57.0 — 15.10.2026

### Cambios que pueden afectar a los scripts

- **`bot api --allow-any-file` pertenece a `bot api`**, no a cada operación con archivos: indícalo una vez
  antes o después del método y todos sus campos `@path` podrán leer lugares protegidos. Sin él, se rechazan
  antes de conectar los archivos `@path` de credenciales, carpetas de `tg` y almacén local.
- **`tasks add` requiere `--category <name>`** (cli-core 0.282.0): money, documents, meeting, delivery, access,
  personal u other; `tasks categories` los lista. Las tareas reciben claves como `Q-15`;
  `tasks claim` / `tasks release` reservan una tarea para una sesión del agente.
- **`permissions` es el único ajuste de acceso** (cli-core 0.282.0): un archivo con `read_only` o `allow`
  se rechaza como ajuste desconocido y desaparece `config migrate`. Solo se leen nombres snake_case;
  `config set` ya no acepta camelCase.
- **Un lenguaje de búsqueda** (cli-core 0.281.0): desaparecen `--language` y `--regex` de `search messages`
  y `searches create`; usa Lucene, por ejemplo `body:/.*invoice.*/`. Desaparece `conversations embed --workers`.
  Una búsqueda guardada con el lenguaje anterior se rechaza: guárdala de nuevo.
- **No se trasladan carpetas al arrancar**: las anteriores de `~/Library` permanecen en su lugar.

### Novedades

- **`messages sync` abre tareas del contenido guardado** (cli-core 0.282.0): preguntas sin contestar y menciones
  al propietario; se cierran al responder.
- **Un título coincidente aparece primero en `search notes` y `search all`** (cli-core 0.281.0).

### Corregido

- **El aviso de actualización indica `tg upgrade` y solo se calla durante `upgrade`** (cli-base 0.29.0),
  por lo que `tasks update` ya no lo silencia.
- **Las rutas anidadas de campos `--json` atraviesan listas** (cli-base 0.31.1, cli-core 0.283.0).

## 0.56.0 — 14.10.2026

### Cambios que pueden afectar a los scripts

- **`store export` guarda archivos con la misma estructura que imprime** (cli-core 0.276.0): los archivos
  `--output` y las carpetas `--to` contienen las mismas entradas (`chat_id`, `sender_name`, `ref`…). Una carpeta
  de una versión anterior se rechaza con "export into a new folder".

- **`bot api` rechaza archivos `@path` de lugares protegidos**: credenciales conocidas, carpetas de `tg` y almacén local, antes de conectar, igual que `bot messages send --file`; `--allow-any-file` en una operación con archivos permite enviarlos. Un archivo de más de 256 MiB se rechaza sin cargarlo en memoria.

### Novedades

- **`config set` y `config unset` aceptan nombres de ajustes en camelCase** (cli-core 0.279.0): `tg <profile> config set senderColors false`
  se guarda como `sender_colors`, igual que la escritura snake_case.
- **Sincronizaciones reanudables** (cli-core 0.276.0): una sincronización interrumpida conserva lo guardado
  y la siguiente ejecución continúa desde ahí.

### Correcciones

- **Un envío rechazado por Telegram por flooding indica que se puede repetir**: cuando `messages send`, `messages forward` o
  `polls create` recibe FLOOD_WAIT antes de que Telegram acepte el mensaje, `retry.safe` es `true` e incluye
  `after_ms`. Si Telegram ya lo aceptó y el límite llega al consultar el resultado, `retry.safe` sigue siendo `false`.

## 0.55.0 — 14.10.2026

### Novedades

- **Los archivos se leen del disco a medida que se suben** (cli-core 0.272.0). `messages send --file`, `--photo`,
  `--voice`, la foto de perfil y `tg bot` ya no leen el archivo entero en memoria antes, y desaparece el rechazo de
  archivos de 2 GiB o más: se aplica el límite propio de Telegram.

### Cambios — pueden romper scripts

- **Un mensaje de voz sin escuchar aparece en `missing`** (cli-core 0.274.0): `review`, `inbox` y `messages list`
  añaden `{field: "transcript", step: "messages.transcribe"}` por cada mensaje de voz sin transcripción guardada, así
  que una respuesta cuyo único contenido es un mensaje de voz ya no parece completa.
- **`tasks link <task> task:<id>` registra una relación entre dos tareas** (cli-core 0.274.0), con
  `--kind
  blocked-by`, `follow-up-of` o `related-to`.
- **Un siguiente paso con un comando que solo cambia esta máquina nunca se ejecuta sin preguntar** (cli-core 0.273.0):
  los pasos `server restart` y `store reindex` llevan `safe_to_auto_execute: false`.
- **`mentions rebuild` recibe el tipo como argumento**: `tg <profile> mentions rebuild person-name`, no `--kind`
  (cli-core 0.272.0).

## 0.54.0 — 14.10.2026

### Novedades

- **`tg images embed`: busca imágenes por lo que muestran** (cli-core 0.268.0). Está desactivado hasta
  `tg <profile> config set picture_search true`; descarga el modelo una vez con
  `tg <profile> models image download clip-b32` (unos 155 MB) y luego ejecuta `tg <profile> images embed [--chat] [--limit]`.
  Después, `search messages` devuelve una lista `pictures` junto a sus resultados. Las consultas de imágenes deben estar
  en inglés.

- **`tg mentions`: teléfonos, correos electrónicos, enlaces y documentos de Google encontrados en los mensajes
  guardados** (cli-core 0.264.0, versión 7 del almacén). `mentions list kind:phone`, `mentions list domain:google.com`;
  una palabra suelta es un valor escrito de cualquier forma, así que `89001234567` encuentra `+79001234567`.
  `mentions show <id>` da el texto alrededor de una mención. Los mensajes guardados antes de esta versión necesitan una
  vez `tg <profile> mentions rebuild`; los nuevos se leen al guardarse.

- **Menciones en los archivos y notas de voz de un mensaje** (cli-core 0.269.0, versión 10 del almacén). El texto que
  leyó `attachments
  extract` y la transcripción de una nota de voz también producen menciones, con `field` `file_text`
  o `transcript`. Los adjuntos con texto de antes de la versión 10 necesitan una vez `tg <profile> mentions rebuild`,
  que ahora también cuenta `attachments`.
- **`tg mentions confirm <id> [person:<uid>|organization:<id>]` y `mentions reject <id>`** deciden a quién pertenece un
  teléfono o una dirección, o lo descartan para siempre. Una organización puede ser dueña de un teléfono o una dirección
  aparte de cualquier persona (versión 11 del almacén; las versiones anteriores siguen funcionando).
- **`phone:`, `email:`, `url:` y `domain:` en una búsqueda de mensajes** encuentran mensajes por lo que menciona su
  texto: `phone:"8 900 000-00-01"`, `email:"ana@example.com"`, `domain:docs.google.com`. El correo aún no tiene
  menciones.
- **Una programación que falla se avisa antes de cualquier otro comando** con una línea en stderr, hasta que la
  siguiente ejecución salga bien; `schedule list` muestra la racha.

### Cambios — pueden romper scripts

- **`contacts timeline` pagina como cualquier otra lista:** una lista cortada en `--limit` responde
  `page.has_more: true`, `page.cursor` y un paso `page.next` (`--cursor` continúa); `meta.truncated` se mantiene para
  los cambios que siguen en cola. La nota «cut at --limit» en stderr desaparece.
- **Basado en `@wirecat/cli-core` 0.269.0 y `@wirecat/cli-base` 0.27.2.**
- **Cada respuesta es un envoltorio con claves en snake_case.** Una lista es `{items, page: {limit, has_more, cursor?}, next?,
  missing?, meta}`, un solo elemento `{item, next?, missing?, meta}`; `meta.run_id` nombra la ejecución. Esto cubre
  todos los comandos: mensajes, chats, contactos, escrituras (`{item: {operation_id, send_id, message}}`), inbox,
  review, búsqueda, estadísticas, almacén, cuenta, doctor, config, runs, `upgrade`, `bot *`, y los propios
  `session start|end` y `setup` de tg (`app_keys`, `already_logged_in`, `chats.has_more`). Qué ejecutar después es un
  paso `next` en lugar de campos como `nextBeforeId`, `nextOffset`, `nextCursor` y `hasMore`. Las respuestas MCP son
  los mismos envoltorios, y las herramientas MCP rechazan argumentos que no aceptan.
- **Las listas reciben una consulta, no opciones de filtro.** `chats list kind:group unread_count>0`,
  `chats events "Hiking" time>=7d`, `messages list "Book club" id<4242`, `contacts list notes:<text>`,
  `attachments list chat:<id> is:needs_text`, `store jobs list state:failed`, `inbox date>2h`,
  `review date>3d chat:<id>`, `search messages 'chat:"Book club"
  lease'`.
  `--search`, `--kind`, `--unread`, `--type`, `--since-time`, `--before-id`, `--after-id`,
  `--before-time`, `--after-time`, `--topic`, `--search-notes`, `--min-score`, `--revoked`, `--link`, `--answer`,
  `--needs-text`, `--state`, el `--chat` de review y el `--chat` de search desaparecen de esos comandos.
  `messages
  evidence` y `chats media` continúan con `--cursor` desde `page.next`. `contacts list name:` necesita
  contactos guardados.
- **El bloque de Telegram de `doctor` está en snake_case:** `app_credentials`, `keyring_moved_by_environment`,
  `proxy.bot_api`.
- **Los detalles de error están en snake_case:** `provider_error` (antes `providerError`); un grupo que pasó a
  supergrupo indica `migrated_chat_id` en el rechazo de la Bot API, y una conversión a foro que puede haber ocurrido
  indica `previous_chat_id` y `chat_id`.
- **Los ajustes del archivo de configuración están en snake_case** (`keep_runs_for_days`, `sends_per_hour`,
  `read_only`, `default_profile`, …). Un archivo existente se migra solo en su primera lectura.
- **Los registros de ejecuciones están en snake_case** (`duration_ms`, `error_code`, `error_class`, `provider_error`);
  las ejecuciones escritas antes se siguen leyendo.
- **Los informes de estadísticas rechazan `--jsonl`**: un informe es un solo objeto. `stats chats show` nombra su chat
  como referencia `chat:`; `stats tasks show` responde un elemento con `open` y `rows`.
- **`--json=<fields>` sustituye a `--fields` y `--agent-json`, que desaparecen.** `--json=id,text` conserva esos
  campos de cada elemento. El JSON de la CLI mantiene el texto del mensaje tal como se escribió; las respuestas MCP
  siguen mostrando los caracteres invisibles.
- **`tags list`, `tasks list` y `conversations list` reciben una consulta en lugar de opciones de filtro.**
  `tags list tag:work type:chat`, `tags list sources:auto`; `tasks list state:open kind:promise chat:<id>`;
  `conversations list <chat> started_at>=7d`. `--tag`, `--type`, `--source`, `--state`, `--chat`, `--before-time`
  y `--since-time` desaparecen de estas listas. Los elementos son las entidades compartidas: una etiqueta nombra en qué
  está como `target`, y una conversación indica `messages_count`, `started_at`, `first_message`.
- **Los registros de ejecución solo guardan las claves de atributo listadas.** Un id de mensaje en `ids.message` se
  descarta por ahora, así que `runs search <message id>` no lo encuentra (comunicado a cli-core).

### Correcciones

- **Los prompts MCP solo nombran argumentos que aceptan las herramientas.** `review` pasa su ventana como `query`
  (`date>"…"`).
- **`tg <profile> bot messages delete` acepta más de 100 mensajes.** Enviaba todos los ids en una sola llamada, y
  Telegram acepta como máximo 100, así que una lista más larga fallaba. Ahora los envía de 100 en 100; si falla una
  llamada posterior, el error dice cuántos se habían borrado ya.

## 0.53.0 — 14.10.2026

### Cambios — pueden romper scripts

- **Basado en `@wirecat/cli-core` 0.262.0 y `@wirecat/cli-base` 0.26.0.** `@wirecat/cli-core` es el nuevo nombre de
  `@wirecat/cli-messaging`; su 0.262.0 sigue a la 0.261.0. El comando de paridad es `cli-core-parity`. Las claves de la
  salida para máquinas van en snake_case: `error.details` dice `operation_id`, `send_id`, `retry_after_ms`;
  `commands --json` dice `global_options`, `inherited_options`, `exit_codes`, `takes_value` y `contract: 1`. Un árbol
  de consulta en el argumento MCP `ast` tiene `lower_inclusive`, `upper_inclusive` y `must_not`.
- **Los archivos HTML se leen como su texto principal** (cli-core 0.262.0): se descartan menús, pies de página y
  banners, y se conservan encabezados, listas, tablas y enlaces. El texto de adjuntos HTML ya guardado se vuelve a
  leer en el siguiente `attachments extract`, y cambia. `title:`, `site:`, `lang:`, `author:` y `keyword:` buscan en
  notas y archivos.

### Correcciones

- **`tg config set defaultProfile <name>` y `config unset defaultProfile` funcionan sin indicar un perfil.** Antes
  pedían uno primero y fallaban cuando había varios (cli-core 0.262.0).
- **`tg default mcp config` y `mcp install` indican el perfil.** La entrada omitía un perfil llamado `default`, así que
  su servidor MCP se detenía en la primera llamada, ya que tg ya no supone ningún perfil (cli-messaging 0.260.0).

## 0.52.0 — 13.10.2026

### Novedades

- **Basado en cli-messaging 0.259.0 y cli-base 0.24.0.** `store fetch` ahora es `messages sync` (mismos argumentos,
  opciones y JSON). `store fetch` sigue funcionando como nombre oculto y obsoleto; la documentación y la skill usan
  `messages sync`. `bot store fetch` conserva su nombre.
- **`--debug`:** ante un fallo, el registro completo (causa y pila) sigue al error: después de la línea `✗` en una
  terminal, y como segunda línea JSON en los demás casos.
- **`runs list` y `runs search` leen un índice por día**, así que responden en milisegundos con miles de ejecuciones.

### Correcciones

- **La skill avisa de tres errores que cometió un agente durante las pruebas.** Comparó una palabra simple en una
  herramienta con `content:` en otra, leyó `ref` donde una búsqueda responde `locator` (o `items` donde las notas
  responden `hits`) e informó de un error ya corregido en una versión más nueva; un bucle de zsh sobre `$c` pasó la
  ruta de un comando como un solo argumento.

### Cambios — pueden romper scripts

- **El almacén local y los modelos de voz se trasladan una sola vez a la carpeta WireCat**, `~/.local/share/WireCat/`
  (Windows: `%LOCALAPPDATA%\WireCat\Data\`), en el primer arranque, desde `~/.local/share/cli-messaging/` y
  `~/.cache/cli-common/models/`. El traslado nunca sobrescribe: si ambos sitios contienen un almacén distinto, `tg` se
  detiene con el código de salida `3` y nombra los dos archivos. `WIRECAT_STATE_DIR` sustituye a
  `CLI_COMMON_CACHE_DIR` y traslada la carpeta completa. Actualiza `max` y `memo` junto con `tg`: una versión anterior
  crearía un almacén nuevo en el sitio antiguo. [Dónde guarda tg sus archivos](./installation.md).
- **Un único objeto de error:** `{"error":{"code","reason","message","details"}}`. Lo que antes estaba en el nivel
  superior de `error` (`candidates`, `sendId`, `operationId`, `permission`, `retryAfterMs`) ahora está en
  `error.details`. `reason` es un id con puntos (`output_limit` → `output.too-large`, `input_limit` →
  `input.too-large`); `retryable` aparece solo donde el fallo lo define, y `actions` solo en los elementos fallidos de
  un resultado parcial. El código de salida `1` es `internal_error` (antes `generic_failure`), y su mensaje ya no
  incluye el texto propio del fallo; `--debug` lo muestra.
- **`runs show` muestra solo lo que salió mal** (respuestas fallidas, avisos, el cierre inesperado) y añade
  `eventCount`; `-v` muestra todos los eventos, como antes.
- **`tg` nunca elige un perfil por ti.** Un comando que usa una cuenta y no nombra ningún perfil (sin primera palabra,
  sin `TG_PROFILE`, sin `defaultProfile` en el archivo de configuración) se detiene con el código de salida `2` en
  lugar de usar `default`, también cuando `default` es el único perfil. **Esto rompe todas las configuraciones
  existentes con un solo perfil**: `tg chats list` ahora falla. El error enumera los perfiles de este equipo, así que
  la solución está en el mensaje: `tg default chats list`, `export TG_PROFILE=default` o
  `"defaultProfile": "default"` en el archivo de configuración. En un equipo nuevo, el primer inicio de sesión es
  `tg personal setup` (cualquier nombre). `--help`, `--version`, `commands`, `skill show`, `account list` y
  `config show` siguen funcionando sin perfil. Los clientes MCP y las tareas programadas que inician `tg mcp` o
  `tg serve` sin perfil necesitan añadir uno. El `store fetch` de un bot usa solo las credenciales de aplicación y la
  sesión personal de su propio perfil, nunca las de `default`.

## 0.51.0 — 12.10.2026

### Novedades

- **`--brief` y `--full` en todos los comandos.** `--brief` conserva de un mensaje encontrado la referencia, el chat,
  la hora, el remitente, el extracto y la puntuación; `--full` lo conserva todo.
- **`tg search all` indica quién escribió cada resultado** y cómo se encontró (por palabras o por significado).

- **`tg schedule`: ejecuta un comando o un agente con un temporizador**, mediante systemd (Linux), launchd (macOS) o
  el Programador de tareas (Windows). `tg schedule command <name> --every 2h -- messages list <chat>` ejecuta un
  comando de tg; una lectura guarda lo que lee. `tg schedule agent <name> claude "<prompt>" --at 08:30` inicia un
  agente (claude o codex), como máximo una vez por hora. El agente se ejecuta con `TG_READ_ONLY=1` y no puede enviar;
  su respuesta se guarda como `latest.md` junto a la programación y una notificación de escritorio avisa de que está
  lista. `--once 2h` se ejecuta una vez y después elimina la programación. `tg schedule list`, `run` y `remove`.
- **`tg server install` sugiere el comando para una revisión diaria de pendientes**, y no activa nada.
- **`TG_READ_ONLY=1` rechaza cualquier escritura del proceso**, por encima del archivo de configuración y de
  `--permission`.

### Cambios — pueden romper scripts

- **`tg search messages` responde con un extracto, no con el texto completo.** Cada resultado lleva `excerpt`, unos
  240 caracteres alrededor de la primera palabra de la consulta, en lugar de `text`; `--full` o
  `tg messages show <ref>` dan el mensaje completo. Los `editedAt`, `replyTo`, `forwardedFrom` y `reactions` nulos se
  omiten de la salida para máquinas. Un script que leía `text` de los resultados de búsqueda debe leer `excerpt` o
  añadir `--full`.


## 0.50.0 — 11.10.2026

### Novedades

- **Las tareas tienen plan, vínculos y una agenda diaria** (almacén compartido 0.247.0, versión 4). `tg tasks add`
  acepta `--title`, `--description`, `--due` y `--check`; `tg tasks plan <task>` los cambia más tarde, y `none` borra
  una fecha. La próxima revisión es cuándo un agente debería volver a mirar la tarea, no un recordatorio: al
  propietario no le llega nada. `tg tasks link` vincula una tarea con mensajes, chats, personas, documentos y URL;
  `tg tasks show` imprime el plan con sus vínculos. `tg tasks agenda` enumera, sin el texto de ningún mensaje, las
  tareas vencidas o que vencen pronto, los chats que esperan una respuesta tuya (`owed`), los que esperan a otros
  (`waiting`) y aquellos cuyo mensaje más reciente no está guardado (`unsynced`). `tg skill show follow-ups` es la
  rutina diaria para un agente: solo borradores, nunca envía.

### Cambios — pueden romper scripts

- Almacén compartido 0.247.0: un contexto de reunión registra hechos con `fact.add`; `memory.add` ya no acepta el tipo `fact`.

### Correcciones

- Se fija el paquete compartido 0.248.0, que incluye las entradas de paridad del seguimiento de tareas. Las
  comprobaciones de la versión ahora reconocen los planes de tareas, los vínculos, las tarjetas, la agenda y sus
  opciones.

## 0.49.0 — 11.10.2026

### Novedades

- **La búsqueda acepta la forma con dos puntos de una comparación.** `date:>=2026-01-01` (y `:>`, `:<`, `:<=`) es lo
  mismo que `date>=2026-01-01`; antes fallaba con `invalid_syntax`. Un `after:` o `before:` rechazado ahora nombra su
  sustituto: `after:2026-09-01` indica que se use `date>=2026-09-01`.

### Cambios — pueden romper scripts

- El almacén compartido 0.246.0 compara las etiquetas nuevas con los nombres canónicos y los alias antes de crearlas.
  Los nombres parecidos requieren la revisión del propietario; reutiliza una etiqueta existente o su alias explícito.
  Las etiquetas y los datos existentes se mantienen, y las coincidencias automáticas por nombre canónico y por alias
  comparten una sola afirmación.

## 0.48.1 — 11.10.2026

### Novedades

- **Almacén compartido 0.242.0**: los id de proyectos y tareas existentes se mantienen; los proyectos nuevos reciben
  claves cortas, y el almacén puede comprobar qué tareas dependen de cuáles.

### Correcciones

- **npm vuelve a instalar los paquetes uno junto a otro.** Basado en `@wirecat/cli-messaging` 0.241.0, cuyo
  `@wirecat/cli-meetings` 0.4.2 acepta cli-core 0.20.0. Con 0.240.0, npm colocaba cli-messaging en una carpeta anidada
  con una segunda copia de cli-core.

## 0.48.0 — 11.10.2026

### Novedades

- **`--source` acepta una lista de cuentas y grupos** en `search messages`, `search mail` y `search conversations`:
  `--source group:work,tg:mila,email:me@work.example` busca exactamente en esos. Una entrada es un grupo,
  `app:account` (un perfil de cualquier aplicación —`max:default` funciona desde tg—, el id de la cuenta o su nombre)
  o una palabra simple de `--source`. `config set accountGroups.<name> <list>` guarda un grupo para todas las
  aplicaciones.
- **El almacén compartido se actualiza a la versión 2 la primera vez que tg lo abre.** Los hechos (lo que se dijo,
  preguntó, decidió o prometió) tienen su propia tabla junto a los recuerdos; los recuerdos guardados con el tipo
  `fact` se trasladan allí, y las asignaciones de tareas se copian a su propia tabla. Un tg, max o memo anterior sigue
  abriendo el almacén actualizado.

### Cambios — pueden romper scripts

- **En macOS, tg guarda sus archivos donde lo hace en Linux**: `~/.config/tg-cli`, `~/.local/share/tg-cli` y
  `~/.cache/tg-cli` en lugar de `~/Library/…`. La primera ejecución traslada allí las carpetas antiguas, junto con el
  almacén compartido y los modelos de voz, y apunta un agente `tg server` instalado a su nuevo registro. Mientras se
  está ejecutando un `tg serve` o un servidor MCP, muestra un aviso, sigue usando las carpetas antiguas durante esa
  ejecución y vuelve a intentarlo la próxima vez. Linux y Windows no cambian.
- **Purgar una cuenta también elimina a las personas que solo esa cuenta había visto.** Una persona se mantiene
  mientras otra cuenta, una etiqueta, una nota o cualquier otro registro apunte a ella.
- **El correo se busca por significado hilo a hilo.** La primera pasada de indexación tras la actualización vuelve a
  dividir cada hilo y genera de nuevo los embeddings del correo; la búsqueda por palabras no cambia.

### Correcciones

- **Purgar una cuenta que tenía reuniones ya no falla**, y una purga elimina los vectores que solo ella usaba.
- Sobre `@wirecat/cli-messaging` 0.238.0.

## 0.47.0 — 11.10.2026

### Novedades

- **`messages list --limit` devuelve tantos mensajes como se piden.** Telegram entrega como máximo 100 por
  solicitud, y `--limit 500` se detenía en 100 con `hasMore: true`; ahora sigue leyendo página a página
  (cli-messaging 0.235.0).
- **Una encuesta en `messages list` incluye su pregunta, sus respuestas y el total de votos** en
  `providerMetadata.poll`, así que las encuestas de un canal se leen sin un `polls show` por mensaje.

### Correcciones

- **`messages comments --limit 100` (o más) indica cuándo quedan comentarios más antiguos.** Para saberlo pedía a
  Telegram un comentario más que el límite, pero Telegram devuelve como máximo 100, así que un hilo de 1600
  comentarios respondía con 100 y `hasMore: false`. Ahora pide como máximo 100 y toma una página completa como señal
  de que hay más.
- **`polls show` da el total de votos de una encuesta antes de que votes.** Telegram envía el total de todos modos;
  solo el recuento de cada respuesta espera a tu voto. Antes el total también era `null`.
- Sobre `@wirecat/cli-messaging` 0.235.0.

## 0.46.3 — 11.10.2026

### Cambios — pueden romper scripts

- **Unirse a un chat e importar contactos cuentan para `sendsPerHour`.** Unirse cuenta como uno; importar, uno por
  número; `tg contacts import` envía 10 números por solicitud. Cuando el límite detiene una importación a medias, el
  error indica cuántos números se enviaron y que volver a importar es seguro.

### Novedades

- **`tg bot watch` imprime y guarda cada actualización una sola vez**, aunque Telegram la entregue de nuevo tras un
  reinicio: cada actualización se registra por su `update_id` y se omite una vez procesada. Con `--events --jsonl`,
  cada línea incluye `update: { id, kind }`.
- `tg search all --backend archive|server|both` y `--server-time`, como en `search messages`; se aplican solo a los
  mensajes, el correo y las notas siempre se buscan en local. El valor predeterminado es `both`.
- `tg search mail --account <address>` busca en un buzón; sin él, en todos. El correo también se busca por
  destinatario, carpeta y asunto (`to:`, `cc:`, `bcc:`, `mailbox:`, `subject:`), y los adjuntos por significado.

### Correcciones

- **`tg store fetch --all` espera un FLOOD_WAIT breve en la lista de chats** (hasta 5 minutos, como ya hacían las
  páginas de mensajes) en lugar de fallar enseguida con `rate_limited`; una espera de 21 s terminaba cada descarga de
  un almacén vacío. Incluido en 0.46.2, sin mencionarse allí.
- Recorrer los chats (`store fetch --all` los lista de 100 en 100) lee cada diálogo de Telegram una sola vez.
  Antes cada página volvía a recorrer todos los diálogos desde el principio, así que unos 1400 chats costaban más de
  100 solicitudes seguidas en lugar de unas 15.
- `chats members list --all` espera 1 s entre páginas de 200 miembros. Antes pedía hasta 50 páginas seguidas,
  aunque la página de límites decía que tenía un ritmo regulado.

### Seguridad

- **La búsqueda ya no responde con mensajes de otra cuenta.** `search messages --backend server` con `--source all`
  o `in:all` podía devolver un mensaje de otra cuenta con los mismos id de chat y de mensaje, y un id de chat sin su
  cuenta coincidía con ese chat en todas las cuentas; ambos casos están corregidos.
- Funciona con `@wirecat/cli-messaging` 0.233.0.

## 0.46.2 — 11.10.2026

### Correcciones

- La búsqueda en el archivo con `--discover` admite preguntas sobre permisos como «¿Pueden los contratistas acceder a producción?»
  sin tratar el signo de interrogación final como comodín. La búsqueda estricta y los filtros mantienen su comportamiento.
- La búsqueda de correo y el contexto de una persona vinculada también leen el almacenamiento de correo dedicado, junto con las importaciones anteriores.
  El correo admite filtros de remitente y de cadena; los resultados muestran cada referencia de correo una sola vez.
- Las descargas de historial en segundo plano ya no se detienen en el plazo predeterminado de 30 segundos; un
  `--timeout` explícito sigue aplicándose.

### Cambios — pueden romper scripts

- Un fallo permanente de la descarga de historial antes de la primera página guardada ahora termina con un error en lugar
  del código de salida `0` con un `issue`. El historial de bot sin mensaje inicial termina con el código `2`
  y solicita `--from`. Los fallos después de haber avanzado siguen devolviendo resultados parciales.

## 0.46.1 — 11.10.2026

### Correcciones

- Las referencias a paquetes, la documentación y los ejemplos usan el espacio de nombres WireCat.

### Cambios — pueden romper scripts

- El fallo de un archivo o una página de historial conserva el trabajo completado y devuelve `complete: false`, `batch` o `issue` con código de salida `0`. Los scripts deben comprobar la integridad; el JSONL de descarga parcial añade `batch_summary`. Los errores incluyen `actions` para recuperarse. Reanudar las descargas reintenta los ID fallidos del checkpoint.
- Después de diez intentos, el lote detiene las solicitudes nuevas si la tasa de errores supera el 50%; `MESSAGING_BATCH_MAX_ERROR_PERCENT` cambia el porcentaje y 100 desactiva esa parada porcentual. Los límites de frecuencia y los fallos de autenticación detienen antes; nunca se repiten automáticamente escrituras de resultado desconocido.

### Novedades

- Configura el tamaño para extracción y transferencia de archivos guardados mediante `MESSAGING_ATTACHMENT_MAX_MIB` (por defecto 50). Las vistas previas PDF permiten ahora 4000 píxeles por lado y 8 MiB por página; `MESSAGING_PDF_PREVIEW_MAX_PIXELS` y `MESSAGING_PDF_PREVIEW_MAX_MIB` ajustan esos valores. Aumentarlos requiere más memoria; el OCR externo y la descompresión mantienen límites independientes.
- `tg runs search`, también el comando `runs search` en MCP `tg_read`, busca registros seguros por texto, estado, código de error y tiempo sin conectar con Telegram.

## 0.46.0 — 11.10.2026

### Cambios — pueden romper scripts

- **El almacén limpia sus registros crecientes al abrirse**, como máximo una vez al día: elimina llamadas de herramientas del agente de más de 90 días y conserva las filas de actualizaciones de bot procesadas de más de 30 días, eliminando su contenido. Actualiza max-cli y cli-memo a la vez: comparten el almacén.

### Novedades

- `tg store reset` sirve para un almacén que esta compilación no puede migrar: crea una copia junto a él, lo elimina y empieza uno vacío. Pregunta primero; `--yes` omite la pregunta y `--no-backup` omite la copia.
- `tg search all --meetings [provider:account]` también busca transcripciones, chat y resúmenes de una cuenta de reuniones; `--max-meetings <n|all>` establece cuántas consultar (100 por defecto).

### Seguridad

- **Se elimina el antiguo `messages.db`** al abrir el almacén predeterminado: el archivo sin cifrar anterior a `wirecat.db`, junto con sus `-wal` y `-shm`. Una línea en stderr indica el archivo. Se conserva si está definido `MESSAGING_STORE` o mientras otro proceso lo tenga abierto. De `@wirecat/cli-messaging` 0.222.0.

## 0.45.0 — 10.10.2026

### Cambios — pueden romper scripts

- **El almacén local es un archivo nuevo, `wirecat.db`, y empieza vacío.** Está junto al antiguo `messages.db`, que `tg` deja intacto: no lo lee, convierte ni elimina. Ejecuta `tg store fetch --all` para recuperar mensajes de Telegram. Los datos que solo existen en este ordenador, como notas, alias, etiquetas, tareas y transcripciones, permanecen en `messages.db`. El inicio de sesión se conserva. Actualiza max-cli al mismo tiempo o verán archivos diferentes.

### Novedades

- `tg contacts timeline <person>`, también el comando `contacts timeline` en MCP `tg_read`, muestra la actividad de una persona en todos los mensajeros vinculados, de más reciente a más antigua, desde el almacén local. `--scope personal|work`, `--since-time`, `--until-time` y `--limit` acotan los resultados.

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

- **El paquete se llama `@wirecat/tg-cli` y el repositorio pertenece a WireCatLabs.** Usa este paquete para instalar y actualizar.
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
- **tg requiere Node 22.16 o posterior**, o Bun. Si Node en Linux usa SQLite del sistema demasiado antiguo, `tg` se reinicia con el SQLite de `@wirecat/cli-messaging-sqlite` antes de leer o enviar. Las versiones oficiales de Node y Bun no notan el cambio.

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
  actualizarse: `npm install -g @wirecat/max-cli@latest`. No cambia nada en los comandos propios de `tg`.

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
