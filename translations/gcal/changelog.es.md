---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/gcal-cli`. Una sección por versión, de la más reciente a la más antigua.

## 0.9.0 — 31.10.2026

### Cambios — pueden romper scripts

- **`events create --id` y `events update --following --id` ahora son `--operation-id`**, el nombre que usa toda
  escritura de WireCat para reintentar tras `outcome_unknown` (WC-CMD-10, WC-OUT-10). El valor es el mismo: el
  `operation_id` que indica el error de la escritura perdida. `--id` se rechaza como opción desconocida; cambia los
  scripts y las instrucciones de agentes que lo pasan.
- **El registro de lo que hicieron los agentes por `gcal mcp` nombra al agente que llamó, no al servidor**
  (cli-core 0.509.0): el nombre propio del cliente, como `claude-code`, donde siempre ponía `gcal-mcp`. Un filtro por
  `gcal-mcp` ya no encuentra filas nuevas. gcal funciona ahora con cli-core 0.510.0 y cli-base 0.68.1.

### Añadido

- **`events list --page <n>`**: la página siguiente de eventos guardados. Una lista con más eventos que `--limit` (100)
  indica `page.next_page`, y su paso `next` ejecuta la misma consulta una página más allá; antes decía `has_more` sin
  forma de seguir leyendo.
- **`search events --backend both`** consulta el almacén y la búsqueda del propio Google Calendar a la vez. Primero van
  los resultados del almacén en su orden, y cada uno que Google también encontró lleva `server` en `found_by`; después
  los eventos que solo encontró Google, del más temprano al más tardío. Una sola página sin cursor: rechaza `--cursor`
  y `--newest`, y necesita red. Antes `both` se ofrecía y siempre se rechazaba.

### Corregido

- **La ayuda de `search events --cursor`** ya no nombra `next_offset`, una clave que la respuesta no tiene; el valor
  sale de `page.next_cursor`.

## 0.8.0 — 31.10.2026

### Corregido

- **El archivo de respaldo del llavero ahora viene de cli-base 0.68.0 y cli-core 0.507.0**, sin un rodeo propio de
  gcal. cli-base corrigió el fallo que gcal rodeaba: quitar la copia del llavero tras `--credential-storage file`
  vaciaba también el archivo. Un inicio de sesión guardado en el archivo privado se lee de ahí y sus renovaciones se
  quedan ahí; el siguiente `session start` que llega al llavero lo devuelve allí y quita la copia del archivo. Las
  respuestas son como en 0.7.0, y el aviso del llavero sigue saliendo una vez por ejecución.

## 0.7.0 — 31.10.2026

### Cambios — pueden romper scripts

- **Una escritura directa por `api` que es fácil de deshacer ya no pregunta.** `api calendar-events-insert`, `-patch`,
  `-move`, `-quickAdd`, `calendar-calendars-insert` y los demás métodos que cambian Calendar sin borrar están en
  `allow`, como ya lo estaban `events create` y `events update`. Un método que borra (`calendar.events.delete`,
  `calendar.calendarList.delete`, `calendar.acl.delete`) y compartir un calendario siguen en `ask`; vaciar, borrar o
  ceder un calendario sigue en `deny`, y `events.notify`, `events.delete.series` y `sharing.notify` siguen valiendo en
  cada escritura por `api`. Para mantener la pregunta, define `permissions.api ask`.

### Corregido

- **`session start --help` deja cada opción en una sola línea corta.** Qué permiten `--grant write` y
  `--grant sharing`, y cuándo elegir `--credential-storage file`, ahora se explica debajo de las opciones.

## 0.6.0 — 31.10.2026

### Añadido

- **`events list` encuentra eventos por su inicio más temprano: `starts_at>=<date>`.** `starts_at` ahora admite
  cualquiera de los dos lados y un intervalo: `starts_at>=2026-11-02`, `starts_at:[2026-11-02 TO 2026-11-07}` y
  `starts_at:2026-11-02` para los eventos de un día. Un evento que empieza justo en ese momento se mantiene; un evento
  de todo el día se compara por su fecha en tu zona horaria. En 0.5.0 `starts_at>=…` se rechazaba. `ends_at` no
  cambia: solo un final más temprano, estrictamente después.

### Cambios — pueden romper scripts

- **`session start` recurre a un archivo privado cuando el llavero falla, y nunca pregunta.** Antes se detenía con
  `oauth.not-saved` y te pedía pasar `--credential-storage file`. Ahora inicia sesión, avisa una vez en stderr de que
  usó `credentials.json` en la carpeta de estado y responde `credential_storage: "file"`. La opción sigue eligiendo
  el archivo directamente; el llavero sigue siendo el predeterminado y la opción más segura. `session status` y
  `session end` ya no responden `keyring: "unreachable"`: el fallo del llavero es el aviso en stderr.
- Una ejecución con carpetas movidas nombra su entrada temporal del llavero según su carpeta de estado, cuando antes
  la nombraba según su carpeta de configuración; una entrada temporal que dejó una ejecución anterior ya no se lee.
  `bin/keyring-dedupe` la elimina.
- **`calendars busy` acepta la consulta estándar por campos, y ninguna palabra propia.** `today`, `week`, `from:` y
  `to:` se rechazan. La ventana son los propios `start` y `end` de la respuesta: `from:2026-11-02 to:2026-11-06` es
  `start>=2026-11-02 end<=2026-11-06`, y `today` es `start>=today end<=today`. Sin `start` la ventana empieza hoy,
  sin `end` dura siete días, así que un `calendars busy` sin más sigue siendo esta semana. `calendar:` y `person:` se
  mantienen y se pueden seguir repitiendo. Por MCP la entrada es `query`, ya no `words`. La primera pantalla muestra
  `calendars busy --duration-minutes 30`.
- **gcal necesita `@wirecat/cli-base` 0.67 y `@wirecat/cli-core` 0.502**, que ahora construyen ellos mismos
  `store status`, `search events <query>` y las consultas por campos; los comandos, sus respuestas y las claves de
  permisos son los mismos que en 0.5.0.

## 0.5.0 — 31.10.2026

### Añadido

- **`calendars list` acepta una consulta**: `synced:`, `primary:` y `access_role:` acotan la lista, como en
  `gcal personal calendars list synced:true`.
- **`commands info` describe con qué responde cada comando de calendario**, y `--fields` puede elegir de ahí.

### Cambios — pueden romper scripts

- **`gcal search <words>` ahora es `gcal search events <query>`, y `gcal status` ahora es `gcal store status`**, la
  forma que usan las demás herramientas de WireCat (max: `search messages <query>`, `store status`). Las rutas antiguas
  ya no existen, sin alias. Por MCP el comando es `search events`, y su entrada es `query` (antes `words`); el paso a
  la página siguiente de una búsqueda en el almacén también nombra `query`. La pista de una sincronización parcial
  apunta a `store status`. Las claves de permisos se mueven con ellos: `permissions.store.status` y
  `permissions.search.events`; `permissions.search` sigue cubriendo la búsqueda. Una configuración que aún define
  `permissions.status` se rechaza con `config.invalid`, que nombra
  `gcal <profile> config unset permissions.status`.
- **`events list` acepta solo la consulta estándar por campos, y ninguna palabra propia.** `today`, `week`, `from:`,
  `to:`, `changed:` y `overlapping` se rechazan. Escribe el intervalo como campos: `from:2026-11-02 to:2026-11-06` es
  `ends_at>=2026-11-02 starts_at<=2026-11-06`, y `changed:2026-10-25` es `changed_at>=2026-10-25`; `calendar:` y
  `person:` se mantienen. Por MCP la entrada es `query` (`"ends_at>=2026-11-02"`), ya no `words`. Lo que pierden los
  scripts:
  - `today` y `week`: escribe las fechas. El lenguaje de consulta tiene `today`, pero ninguna palabra para un día más
    adelante, así que el final de un intervalo es una fecha ISO.
  - `overlapping` y el campo `overlaps`: ningún término estándar pide los eventos que se solapan, así que la lista ya
    no los encuentra. Compara en su lugar `starts_at` y `ends_at` de los eventos listados.
  - `starts_at>=…` se rechaza e indica el término `ends_at>=…` que hay que escribir en su lugar: el almacén encuentra
    los eventos por los momentos que abarcan, así que solo puede acotar el inicio más tardío y el final más temprano.
    Un evento que termina justo en el momento de `ends_at` queda fuera.
  - Sin un término de tiempo, la lista sigue empezando al inicio de hoy.
- **Borrar un calendario de Google entero y cederlo a otra cuenta están en `deny` por defecto**, como vaciarlo.
  `api.calendar.calendars.delete` y `api.calendar.calendars.transferOwnership` estaban en `ask`, que por MCP se ejecuta
  sin preguntar. Pon cualquiera de las dos claves en `ask` o `allow` para dejar que se ejecute.
- **`session status` y `session end` responden donde no se puede acceder a ningún llavero y no se guarda ningún
  archivo de sesión.** Antes fallaban con `oauth.not-saved`. Ahora `session status` dice `state: missing` con
  `keyring: unreachable`, y `session end` dice `ended: false` con `keyring: unreachable`: esta ejecución no puede usar
  ninguna sesión, así que no hay nada que mostrar ni que cerrar. Una sesión guardada con `--credential-storage file` se
  lee como antes. `session start` y los comandos que llaman a Google siguen fallando con `oauth.not-saved`, que se
  explica en [Cuando algo falla](./troubleshooting.md). Un script que interpretaba ese fallo como «llavero fuera de
  alcance» lee ahora `keyring` en la respuesta.
- **`people list` acepta un evento como `event:<id>`.** `gcal personal people list 42` se rechaza como una palabra sin
  campo; escribe `people list event:42`. Por MCP la entrada es `query` (`"event:42"`), ya no `event`.
- **`search --backend server` responde como la búsqueda compartida.** El `found_by` de cada evento es `["server"]`
  (antes `["google"]`). Los rechazos tienen motivos nuevos: ningún calendario sincronizado es `search.no-calendars`
  (antes `calendars.none-synced`), `--offline` es `search.offline` (antes `offline.refused`), `--exact`, `--cursor` o
  `--newest` es `search.server-options`, y `--backend both` es `search.one-backend` (antes `search.backend-both`).
- **La ayuda de los comandos de calendario ya no muestra `--json` y `--jsonl` en cada comando**, y sus herramientas MCP
  ya no aceptan las entradas `json` o `jsonl`. Las opciones globales `--json` y `--jsonl` funcionan como antes; a un
  agente que enviaba `jsonl: true` se le rechazaba.
- **`config show --bot` y `config set|unset --personal|--bot` quedan ocultos.** gcal no tiene bots, así que no había
  nada detrás. Se siguen aceptando, así que un script que pase uno sigue funcionando.

### Corregido

- **Las llamadas que un agente envía a la vez a `gcal mcp serve` reciben cada una su propia respuesta.** Dos lecturas
  de calendario enviadas juntas podían responder a una de ellas vacía (`{"item":{"value":null}}`) o hacerla fallar con
  `command.crashed`, porque las llamadas compartían qué comando se estaba ejecutando y el almacén que había abierto.
  Ahora cada llamada tiene los suyos
  ([WC-ARCH-22](https://github.com/WireCatLabs/cli-base/blob/v0.65.5/docs/standards/architecture.md#wc-arch-22--build-the-command-tree-once-keep-each-calls-state-out-of-it)).
- **Un evento de todo el día sin zona horaria propia ni de su calendario empieza a medianoche en la zona horaria de tu
  ordenador.** gcal lo leía como medianoche UTC: en un ordenador en Madrid empezaba una hora tarde, y en Nueva York la
  tarde anterior. El `timezone` de ese evento nombra ahora la zona en la que se leyó, donde antes era `null`. Un evento
  o calendario que nombra su zona se lee en esa zona, como antes. Un evento ya guardado conserva su inicio antiguo
  hasta que Google lo envíe de nuevo, después de que cambie
  ([WC-TIME-3](https://github.com/WireCatLabs/cli-base/blob/v0.65.5/docs/standards/time.md#wc-time-3--read-a-time-that-has-no-zone-in-the-zone-in-use-and-say-which-zone-that-was)).

## 0.4.0 — 31.10.2026

### Corregido

- **gcal mantiene el almacén local compartido en la misma versión que las demás herramientas de WireCat (versión 40 del
  almacén).** El almacén gana el índice de trigramas que usa la búsqueda en notas y documentos; gcal no tiene notas
  propias, pero un gcal antiguo ya no deja un almacén escrito por una herramienta más nueva sin las entradas de índice
  que debería escribir.

## 0.3.0 — 31.10.2026

### Añadido

- **`gcal models list` y `gcal models download <model>` descargan el modelo que usa la búsqueda por significado.** La
  pista de la búsqueda nombraba `gcal models download e5-small`, que no existía. El modelo va a la carpeta que comparten
  todas las herramientas de WireCat, así que uno ya descargado por otra herramienta de WireCat se usa tal cual.
- **`events move <event> --to-calendar <id>` mueve un evento, con su id, a otro calendario de la misma cuenta.**
  Rechaza un calendario en el que no puedes escribir, el mismo calendario, un evento que Google no mueve (tiempo de
  concentración, fuera de la oficina, lugar de trabajo, cumpleaños) y un caso sin `--series`. Por MCP es el comando
  `events move`.
- **`events update --following` y `events delete --following` cambian o borran «este y todos los siguientes»
  casos.** Un cambio termina la serie justo antes del caso y empieza ahí una serie nueva con el cambio, conservando a
  los asistentes; un borrado solo termina la serie. Una serie que termina tras un número de veces necesita `--repeat`
  para la parte nueva.
- **`events list changed:<date>` muestra lo que cambió desde una fecha**, a partir del almacén: cada evento indica
  `change` (`new`, `moved` o `cancelled`) y `changed_at`, y uno movido dónde estaba en `was`.
- **`events list overlapping` muestra las reuniones que se solapan**, cada una con `overlaps`, los demás eventos. Solo
  cuentan los eventos que ocupan tu tiempo: no cancelados, no de todo el día, no rechazados ni marcados como libres.

### Cambios — pueden romper scripts

- **Crear, cambiar, mover y responder eventos se hace sin preguntar por defecto.** `events.create`, `events.update`,
  `events.respond` y el nuevo `events.move` están en `allow` (estaban en `ask`); un script ya no necesita `--yes` para
  ellos. `events.delete` sigue en `ask`, incluido `--following`. Para que vuelva a preguntar, pon una clave en `ask`,
  como `gcal personal config set permissions.events.create ask`. Las claves `api.calendar.events.*` detienen las
  escrituras de eventos en cuanto las fijas; su `ask` predeterminado vale solo para los comandos `api`.
- **Un cambio de serie cuya nueva regla la termina antes también necesita `events.delete.series`**, que está en `deny`
  por defecto. Un `COUNT` nuevo, un `UNTIL` anterior o un límite en una serie que no lo tenía borraban los casos
  posteriores solo con `events.update`.
- **Un `sync` en el que falla un calendario no imprime nada en stdout y termina con `sync.partial`.** Su mensaje nombra
  cada calendario que falló y su error, `details.calendars` contiene el resultado de cada calendario (`error` en los que
  fallaron), y el error dice que reintentar es seguro. Los calendarios que se sincronizaron quedan guardados. Una
  sincronización detenida por su límite de tiempo o de peticiones sigue respondiendo `state: "partial"` y termina bien.
- **`search` responde con una lista: los eventos en `items`, con `page` en modo cursor, como cualquier otra lista.**
  Respondía con un `item` que contenía `hits`, `has_more` y `untrusted` (WC-OUT-4). Un script lee `items` en lugar de
  `item.hits`, y `page.next_cursor` es el valor para `--cursor`. Cada evento indica sus propios campos `untrusted`, y
  por qué no se buscó por significado está en `missing`. `query` y `by` desaparecen; cada evento sigue indicando
  `found_by`.
- **`links review` responde con sus revisiones en `items`, sin `accounts: "all"`.** Respondía con un `item` que
  contenía la lista. Las elecciones de vínculos se siguen guardando por almacén, así que se listan las revisiones de
  todas las cuentas.
- **`search --backend server` rechaza `--newest`.** Google devuelve sus resultados sin un orden indicado y gcal lee solo
  la primera página de cada calendario, así que en una respuesta «los más recientes primero» podía faltar el evento más
  reciente. Sus resultados se listan del más temprano al más tardío, y el `found_by` de cada evento es `["google"]`,
  como lo escribe una búsqueda en el almacén.

### Corregido

- **`gcal --help` ya no ofrece una opción `--read-only`, que no existe.** `GCAL_READ_ONLY=1` es la forma de que una
  ejecución rechace cualquier cambio.
- **`events delete` de un evento ya borrado en Google termina bien y quita la copia guardada.** Google responde a ese
  borrado con 410, y con 404 cuando ya no muestra el evento; gcal fallaba en ambos casos y mantenía el evento en el
  almacén hasta la siguiente sincronización.
- **La sincronización completa diaria ya no marca como borrados los eventos fuera de su ventana.** Los eventos sueltos
  más antiguos y posteriores, los casos movidos y las series terminadas se marcaban como borrados y sus eventos como
  cancelados. Un almacén dañado así se repara en su siguiente sincronización.
- **Un evento periódico movido a otra hora ya no conserva sus casos a la hora antigua** tras una sincronización
  incremental.
- **Un `sync --rescan` detenido por su límite ya no deja en rondas incrementales los calendarios a los que no llegó.**
- **Una creación que Google hizo pero el almacén no pudo guardar indica el id del evento**, así que repetirla con
  `--id` lo encuentra.
- **`sync` escribe en el almacén con muchas menos transacciones, y la ronda completa diaria pide sus casos solo a las
  series que cambiaron.** `events list` por hora y `people list` leen el almacén más rápido.
- **Un rechazo de Google por un elemento que falta o está prohibido indica un motivo**: `google.not-found` o
  `google.denied`, para que un script decida según él y no según el mensaje.
- **Un inicio de sesión interrumpido por un tiempo de espera o Ctrl-C sigue cerrando el almacén que abrió.**
- **`gcal api call --help` ya no muestra `Default: [object Object]` para `--params`.** Si se omite, sigue sin enviar
  parámetros.
- **`gcal` arranca en más o menos la mitad de tiempo** (`gcal --help`: 0,40 s antes, 0,19 s ahora, en un portátil con
  Node 24). El paquete trae un único programa empaquetado en lugar de cientos de módulos. Una sincronización también
  procesa cada evento más rápido.

### Seguridad

- **`search --backend server` marca los campos correctos como escritos por otros.** Su lista `untrusted` nombraba
  `title` y `location`, mientras que la respuesta los tenía en `hits`, así que un agente que sigue la lista no los
  trataba como datos. Ahora cada evento nombra `title` y `location` por sí mismo.
- **`gcal api` rechaza un id vacío, `.` o `..` en la dirección de una petición** (`api.bad-path-id`). Un id así hacía
  que la dirección apuntara a otro método de Google, `calendars/primary/events/..` al propio calendario; ahora no se
  envía nada.
- **`session end` en una ejecución con carpetas movidas conserva el inicio de sesión del propietario en el llavero del
  sistema, y lo dice.** Una ejecución con `GCAL_CONFIG_DIR`, `GCAL_STATE_DIR` o un `HOME` movido usa la entrada del
  llavero que comparten todas las ejecuciones de gcal; terminar la sesión ahí habría cerrado la sesión del propietario
  en todas partes. Ahora responde `kept: "keyring"` y dice que la ejecución sigue con la sesión iniciada; `ended` es
  `true` solo cuando la ejecución tenía un inicio de sesión propio que borrar. Una ejecución en las carpetas normales
  termina la sesión como antes.
- **Un inicio de sesión en una ejecución con carpetas movidas ya no sustituye el del propietario en el llavero del
  sistema.** Va a la entrada propia de la ejecución, `gcal-cli:<config folder>`, que la ejecución lee primero y que su
  `session end` borra; por lo demás, la ejecución lee la entrada del propietario y nunca la cambia. Así, un inicio de
  sesión de prueba con otra cuenta de Google ya no puede cambiar el perfil del propietario.

## 0.2.0 — 30.10.2026

### Añadido

- **La skill `gcal-cli` se publica en ClawHub como `wirecat-gcal` después de cada versión, y le dice a OpenClaw que
  necesita `gcal` y cómo instalarlo** (`metadata.openclaw`: `requires.bins` y el paquete npm `@wirecat/gcal-cli`). Si
  `gcal` no está en el PATH, OpenClaw marca la skill como no lista y ofrece instalar el paquete. Claude Code y Codex
  ignoran ese bloque.

## 0.1.1 — 29.10.2026

### Corregido

- **La cabecera de la guía para agentes (`skills/gcal-cli/SKILL.md`) vuelve a ser YAML válido.** Su `description`
  contenía `Calendar: sync`, que un analizador de YAML interpreta como un mapa anidado, así que los cargadores de
  skills estrictos y el índice de skills del sitio de WireCat rechazaban el archivo. El texto no cambia, salvo un
  guion en lugar de esos dos puntos.

## 0.1.0 — 29.10.2026

### Añadido

- **`gcal <profile> session start | status | end` inicia sesión en Google en el navegador, con acceso de solo
  lectura a Calendar.** Por ahora usa tu propio cliente de OAuth de Google (`--client-file`, o
  `GCAL_GOOGLE_CLIENT_ID` y `GCAL_GOOGLE_CLIENT_SECRET`); los [ajustes](./configuration.md#your-own-google-client)
  explican cómo crear uno. La sesión se guarda en el llavero del sistema o, con `--credential-storage file`, en un
  archivo privado (modo 600) donde no funcione ningún llavero. `session status --check` pregunta a Google si la sesión
  sigue funcionando. `--grant write` pide además `calendar.events`, que necesitan las escrituras de eventos, y
  `--grant sharing` pide `calendar.acls`, que necesita la compartición. `gcal session list` muestra los perfiles de
  este ordenador, cada uno con `signed_in`, `account` y `credential_storage`; ningún comando elige un perfil por ti.
- **`gcal <profile> sync` copia tus calendarios al almacén local de WireCat, y los comandos de lectura funcionan sin
  conexión.** `calendars list | sync | unsync`, `events list | show`, `search`, `people list | link` y
  `links review | resolve` son los comandos de calendario comunes de WireCat, así que las demás herramientas de
  WireCat ven los mismos eventos y personas. La primera sincronización lee los calendarios que son tuyos desde un año
  atrás hasta tres meses por delante; cada una de las siguientes pide a Google solo lo que ha cambiado. Los casos de
  un evento periódico se guardan uno a uno, incluidos los cancelados. `sync --embed` también indexa los eventos para
  la búsqueda por significado. Cada respuesta indica, en `untrusted`, los campos que escribió quien envió una
  invitación, para que un agente los lea como datos.
- **Una sincronización grande continúa a lo largo de varias ejecuciones.** `sync` se detiene por sí solo antes de su
  límite de tiempo (15 minutos en una terminal, 45 segundos por MCP; `--timeout` lo cambia y `--max-pages <n>` reduce
  todavía más las peticiones a Google) y guarda tras cada página. Una respuesta parcial indica `state: "partial"`, hasta
  dónde llegó y el comando que hay que ejecutar después. `--rescan` vuelve a empezar todos los calendarios.
  `gcal <profile> status` muestra el progreso de cada calendario sincronizado, `partial` o `complete`, y cuánto tiempo
  hace que avanzó por última vez.
- **`gcal <profile> calendars busy` muestra cuándo están ocupados calendarios y personas**, a partir de la respuesta
  de disponibilidad de Google, que dice cuándo y nunca qué. `--duration-minutes` muestra los huecos libres para todos
  dentro de `--hours` (09:00-17:00 por defecto), de lunes a viernes; quien Google no muestre aparece en `unknown`. No
  se guarda nada.
- **`gcal <profile> search --backend server <words>` usa la búsqueda del propio Google Calendar** en los calendarios
  sincronizados. Solo lee, no guarda nada y también encuentra eventos fuera del periodo sincronizado.
  `--backend archive`, el almacén local, es la opción por defecto.
- **`gcal <profile> events create | update | delete | respond` cambian Google Calendar tras
  `session start --grant write`.** Sin ese permiso, una escritura falla con `permission_error` e indica la opción. Un
  cambio envía la versión sincronizada, así que un evento cambiado en Google desde entonces da `event.conflict` y nunca
  se sobrescribe. Una creación cuya respuesta se perdió termina en `outcome_unknown` con un id; si la repites con ese
  id, encuentra el evento. `events create --repeat <rule>` crea un evento periódico, y
  `events update --series --repeat <rule>` cambia su regla. Unas fechas nuevas en un evento con hora lo convierten en
  evento de todo el día, y unas horas nuevas convierten un evento de todo el día en uno con hora, conservando su enlace
  de Meet y sus archivos de Drive. `respond` cambia solo tu propia respuesta. Las escrituras también son herramientas
  MCP, con las mismas opciones que en la línea de comandos.
- **`gcal api list | show | call`, y un comando `gcal <profile> api <method>` por método, llegan a todos los métodos
  de la API v3 de Google Calendar** que gcal puede ofrecer. Se generan a partir de la descripción de la API que publica
  Google, y cada respuesta se comprueba con ella. No se ofrecen las notificaciones de cambios de Google (`watch`,
  `channels.stop`): necesitan una dirección web pública.
- **Cada comando y cada método de Google Calendar tiene una clave de permiso**, como `events.create` o
  `api.calendar.events.insert`. Un cambio pregunta antes (`--yes` en un script), incluidos compartir un calendario y
  cederlo a otra cuenta; por MCP nadie responde, así que `ask` deja que un agente lo ejecute. Tres claves están en
  `deny` hasta que las permitas: `events.notify` (Google envía un correo a los asistentes), `events.delete.series`
  (borrar todos los casos de un evento periódico) y `sharing.notify` (Google envía un correo a la persona con quien se
  comparte un calendario). Los comandos `api` comprueban las mismas claves que las escrituras de eventos, y una
  escritura de eventos también comprueba la clave de su método de Google, así que `permissions.api readonly` detiene
  ambas. Vaciar un calendario (`calendars.clear`) está denegado y nunca se ofrece por MCP, igual que `api call`.
  `--dry-run` muestra todas las claves que comprueba una llamada, con su nivel. Una clave que no corresponde a ningún
  método se rechaza, y `gcal doctor` muestra las que haya guardadas en el archivo.
- **El código de acceso, el PIN y la contraseña de una reunión nunca salen de Google.** Nunca se guardan: un enlace
  para unirse se guarda sin su query string, y se descarta cualquier línea de la descripción o la ubicación de un
  evento que mencione un código de acceso, una contraseña o un PIN. Los comandos `api` también los eliminan, de toda
  respuesta que contenga un evento, en la terminal y por MCP.
- **`gcal <profile> mcp serve` ofrece los comandos del perfil a un agente**, y `mcp add claude-code | codex`,
  `mcp config`, `mcp check`, `mcp revoke` y `mcp server start | stop | status` lo configuran.
  `--profiles <names|all>` ofrece varios perfiles; nunca se elige un perfil, así que `gcal mcp serve` a secas los
  muestra y se detiene. El servidor indica al agente qué texto escribieron otras personas, y los caracteres de control
  de una respuesta se muestran de forma visible, así que el texto de una invitación no puede ocultarle nada al agente.
- **`gcal --help` muestra lo que puede hacer gcal y por dónde empezar, y `gcal guide` da escenarios paso a paso**:
  configurarlo, dar acceso a un agente, encontrar un hueco. `gcal skill install` añade la skill de la herramienta para
  Claude Code, Codex, Gemini CLI, OpenClaw y Hermes Agent.
- **`gcal doctor` muestra lo que está configurado, sin red y sin llavero**: la versión, las rutas, el almacén, el
  cliente de OAuth, el bloqueo del perfil y los archivos de sesión.
- **`gcal <profile> runs list | show` muestra las ejecuciones que guardó gcal**, incluidos los inicios y cierres de
  sesión: las correctas durante 7 días y las fallidas durante 30. Los secretos se ocultan;
  `config set record_input false` no guarda ninguna de las palabras que escribes.
