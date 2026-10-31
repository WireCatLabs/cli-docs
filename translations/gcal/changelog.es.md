---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/gcal-cli`. Una sección por versión, de la más reciente a la más antigua.

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
