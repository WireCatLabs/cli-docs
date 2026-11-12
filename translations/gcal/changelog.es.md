---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/gcal-cli`. Una sección por versión, de la más reciente a la más antigua.

## 0.23.0 — 08.11.2026

### Añadido

- **`gcal <profile> account remove --keep-data|--delete-data`** quita un perfil de este ordenador: revoca el inicio
  de sesión en Google desde Google, borra el inicio de sesión guardado y los feeds de calendario guardados, olvida el
  perfil y sus puntos de sincronización y, con `--delete-data`, borra del almacén los calendarios y eventos de la
  cuenta. `--keep-data` los deja disponibles para buscar. Los demás perfiles quedan como estaban, y un `events remind`
  en marcha detiene la eliminación.
- **`gcal models set` y `gcal models add`** de cli-core 0.609.0: eligen el modelo local de embeddings que usa cada CLI
  de WireCat y añaden uno propio desde Hugging Face. Una pregunta con una hora (`HH:MM`, `10:30`) vuelve a buscarse
  por sus palabras.
- **gcal incluye `contracts/wirecat.json`, que dice con qué hosts se comunica.** WireCat Desktop lo lee para mostrarte,
  antes de instalar, a qué accede gcal: `accounts.google.com`, `oauth2.googleapis.com`,
  `openidconnect.googleapis.com` y `www.googleapis.com`, además de las direcciones de feeds de calendario (ICS) que
  añadas.

### Cambios — pueden romper scripts

- **gcal escribe ahora el almacén compartido en la versión 59, y un CLI de WireCat más antiguo lo rechaza hasta que
  se actualice.** Ejecuta `<cli> upgrade` en cada CLI de WireCat que use el mismo almacén. De cli-core 0.615.0, que
  guarda en el almacén sus plantillas de mensajes.

### Seguridad

- **Las peticiones de gcal a Google solo llegan a los hosts que declara.** El inicio de sesión, la renovación del
  token, la comprobación de la cuenta y cada llamada a Calendar API pasan por `hostFetch` de cli-base. Rechaza
  cualquier otro host antes de enviar un byte, comprueba cada redirección, quita la cabecera `Authorization` en una
  redirección a otro sitio y se rinde a los 30 segundos. Los feeds de calendario (ICS) los sigue leyendo cli-core,
  desde la dirección que añadiste. De cli-base 0.87.0 (antes 0.80.8) y cli-core 0.615.0 (antes 0.614.0).

## 0.22.0 — 08.11.2026

### Cambios — pueden romper scripts

- **gcal escribe ahora el almacén compartido en la versión 57, y un CLI de WireCat más antiguo lo rechaza hasta que
  se actualice.** Ejecuta `<cli> upgrade` en cada CLI de WireCat que use el mismo almacén. Importa más el caso
  contrario: un memo ya en la nueva versión del almacén impedía que este gcal lo abriera, y esta versión vuelve a
  leerlo. De cli-core 0.608.0 (antes 0.600.0).
- **`upgrade --offline` y `calendars busy --offline` responden `permission_error` con el motivo `offline.refused`
  (código de salida 5)**, como ya hacían los comandos propios de gcal que necesitan Google. Antes respondían
  `validation_error` (código de salida 2) y `busy.offline`.
- **`events prepare` lee solo las cuentas del ámbito de la cuenta pedida**: una cuenta de trabajo ya no trae el
  correo ni los mensajes de una persona vinculada desde cuentas personales, ni al revés.
- **La búsqueda trata un `?` al final de una palabra como signo de interrogación, y un `word:` que no es un campo de
  búsqueda como palabras.** `budget?` encuentra «budget», y `meeting at 10:30` encuentra lo que lo contiene en lugar
  de una respuesta vacía.

### Corregido

- **`ё` y `е` coinciden en los nombres**, así que una persona o un calendario escrito con `е` encuentra el que se
  escribe con `ё`.
- **Las notas de 0.21.0 decían que las guías avisan de una página de «aplicación no verificada» y de un límite de 100
  usuarios para la aplicación de Google de WireCat.** No es así: las guías dicen que Google puede rechazar un inicio
  de sesión con la aplicación de WireCat, y que tu propia aplicación siempre tiene prioridad y es la salida. La página
  de aplicación no verificada y el límite de 100 usuarios se describen solo para tu propia aplicación.

## 0.21.0 — 07.11.2026

### Añadido

- **`schedule command` y `schedule agent` aceptan `--notify-on always|failures|never` y `--deliver-to <route>`**, y
  `schedule agent` acepta `--model` y `--max-cost-per-day`. `schedule list` muestra el `notify` y el `deliver_to` de
  cada programación. De cli-core 0.600.0 (antes 0.566.0) y cli-base 0.80.8 (antes 0.77.1).
- **`session start --client-id <id>` y el ajuste `google_client_id` eligen tu propia aplicación de Google**:
  `--client-file` o `--client-id`, luego `GCAL_GOOGLE_CLIENT_ID`, luego el `google_client_id` del perfil o de los
  valores por defecto, y luego la aplicación de WireCat. El secreto sale de `GCAL_GOOGLE_CLIENT_SECRET`, nunca del
  archivo de ajustes, y `session start` avisa antes de abrir el navegador cuando tu aplicación no lo tiene. `doctor`
  indica `"source": "config"` para el ajuste de los valores por defecto. `config set` le niega `google_client_id` a un
  agente.

### Cambios — pueden romper scripts

- **Una escritura cortada con Ctrl-C termina como `outcome_unknown` (código de salida 14), nunca como `cancelled`
  (código de salida 130).** Puede que Google la haya hecho, y quien llama, si oye «cancelado», podría hacer el cambio
  dos veces. Cubre una parada mientras la petición estaba en camino y una parada mientras gcal leía la respuesta. Una
  lectura sigue terminando como `cancelled`.

### Seguridad

- **Los comandos `api` ahora también responden al permiso del comando `events` que hace el mismo trabajo.** Una llamada
  con `gcal api` solo comprobaba su propia clave `api.*`, así que aún podía hacer lo que un comando `events` denegado no
  podía. Cada método de eventos, lecturas incluidas, comprueba ahora también la clave de ese comando, en todos los
  caminos: `--dry-run`, `api show` y MCP. Una importación de eventos con `api` ahora pregunta, como `events import`.

### Corregido

- **Una llamada a Google ya no retiene en memoria el comando terminado durante 30 segundos.** Su límite de tiempo era
  un temporizador que seguía hasta el final aunque Google ya hubiera respondido, como descubrió tg-cli. `gcal mcp serve`
  y `gcal schedule`, que hacen muchas llamadas en un mismo proceso, crecían con cada llamada.
- **`mcp serve --permission api.<method>=deny` ahora detiene las escrituras de eventos que llaman a ese método.**
  `events create`, `update`, `delete`, `respond`, `move` e `import` comprobaban sus claves `api.calendar.events.*`, y
  las claves compartidas del calendario como `events.notify`, con los niveles guardados del perfil e ignoraban los que
  fijaba la entrada del servidor del agente, así que un agente aún podía escribir. Ahora usan los niveles de la
  ejecución.
- **Las notas sobre el inicio de sesión con Google ya no describen el estado de revisión de WireCat.** Dicen que hacer
  pública para Calendar una aplicación de Google compartida es complejo, así que Google puede rechazar el inicio de
  sesión, y remiten a tu propia aplicación de Google. El comportamiento no cambia.
- **Las notas de 0.20.0 nombraban dos motivos de error con sus nombres antiguos.** Un perfil mal escrito responde con
  el motivo `oauth.missing`, no `profile.not-signed-in`, y el límite de uso de Calendar de Google es
  `provider.usage-limit`, no `google.usage-limit`. 0.20.0 ya respondía con estos nombres. Solo sus notas estaban mal.
- **Las guías dicen que todos los paquetes incluyen la aplicación de Google de WireCat.** La instalación, la solución
  de problemas, la hoja de ruta y `session start --help` decían que las versiones podían no incluirla. Ahora dicen que
  Google aún no la ha verificado: Google puede mostrar una página «unverified app», y la aplicación admite 100 usuarios
  en total, compartidos con drive. Tu propia aplicación siempre gana y es la salida cuando se alcanza ese límite.

## 0.20.0 — 05.11.2026

### Cambios — pueden romper scripts

- **Los motivos de error usan los nombres que comparten cli-core y drive.** `sign-in.expired` es ahora
  `oauth.expired`. `sign-in.scope-missing` y `api.scope-missing` son ambos `oauth.scope-missing`.
  `profile.not-signed-in` es `oauth.missing`, `google.denied` es `access.denied`, `google.not-found` es
  `item.not-found` y `google.usage-limit` es `provider.usage-limit`. `file.*`, `offline.refused`, `api.unknown-method`
  y `api.disabled` mantienen sus nombres y ahora vienen de cli-core.
- **`calendars busy` recibe y responde `starts_at` y `ends_at`**, como toda respuesta de evento, en lugar de `start` y
  `end`: `gcal personal calendars busy starts_at>=2026-11-02 ends_at<=2026-11-06`.
- **Una sincronización en la que falla un calendario responde con los demás.** Antes no imprimía nada y fallaba con
  `sync.partial`. Ahora guarda e imprime lo que trajeron los calendarios sanos, con `meta.complete: false` y un aviso
  `sync.partial` por cada calendario que falló. El código de salida es 0.
- **cli-core 0.566.0 y cli-base 0.77.1.** Un fallo ahora puede ser `conflict` (código de salida 15). `doctor` no se
  conecta a nada por defecto. `doctor --online` se conecta una vez y lee la cuenta, sin enviar nada.
- **gcal inicia sesión con la aplicación de Google de WireCat sin archivo de cliente y sin variables de entorno.** 0.19.0
  esperaba un `google-client.json` que el flujo de publicación escribía desde un secreto que faltaba, así que no podía
  iniciar sesión sin `--client-file`. La aplicación de WireCat viene ahora del `constants.json` de cli-core. El orden no
  cambia: `--client-file`, luego `GCAL_GOOGLE_CLIENT_ID` (con `GCAL_GOOGLE_CLIENT_SECRET`) y luego la aplicación de
  WireCat.
- **`GCAL_GOOGLE_CLIENT_SECRET` sin `GCAL_GOOGLE_CLIENT_ID` falla con el motivo `sign-in.secret-without-id`** (antes
  `sign-in.no-client`). `sign-in.no-client` y `sign-in.bundled-client-invalid` ya no existen: siempre hay una
  aplicación.
- **El `oauth_client` de `doctor` dice de dónde viene la aplicación:** `{ "client": "wirecat", "source": "constants" }`,
  o `"own"` con `"flag"` o `"env"`.

### Seguridad

- **El paquete publicado es el que pasó las comprobaciones.** La publicación ya no añade un archivo al paquete
  comprobado, y el paso de publicación vuelve a comprobar su hash antes de `npm publish`.
- **La prueba en seco de ClawHub en la publicación no recibe de GitHub ningún token de inicio de sesión.** Ejecuta el
  código del propio ClawHub, así que ahora ejecuta la CLI de ClawHub directamente, como hace el paso real de ClawHub,
  sin `id-token: write`.
- **Las pruebas de `bin/gcal-live-check` y `bin/gcal-write-check` no pueden llegar al llavero del sistema.** Iniciaban
  los scripts con la dirección D-Bus del propietario. Ahora pasan `DBUS_SESSION_BUS_ADDRESS=disabled:`.
- **`events export --output` escribe el archivo entero y privado.** Antes escribía sobre el mismo archivo, así que una
  ejecución interrumpida dejaba medio archivo, y un archivo existente conservaba su modo anterior, como 0644, de modo
  que otros usuarios del equipo podían leer tus reuniones. Ahora escribe un archivo nuevo con modo 0600 y lo mueve sobre
  el antiguo.

### Añadido

- **`gcal config migrate` escribe en `defaults` cada ajuste que le falta al archivo, con su valor por defecto**, y
  conserva tus valores, su orden y las claves que gcal no conoce. Una segunda ejecución no cambia nada (cli-core
  0.563.0).
- **`gcal config repair`** corrige la sintaxis JSON rota del archivo de ajustes y deja una copia de seguridad al lado.
  Viene de cli-core.
- **`gcal doctor --online`** también mira en npm si hay un gcal más nuevo. `doctor` es ahora el compartido de cli-core,
  con el `credential_file` de gcal, y sigue respondiendo `meta.now` y la zona horaria.

### Corregido

- **`events create --text` se puede repetir sin riesgo tras perder la respuesta.** Indica un `operation_id`: ejecuta
  la misma línea otra vez con `--operation-id <that id>` y gcal busca el evento que creó ese intento antes de añadir
  otro.
- **`session start` no abre el navegador con `--json`, `--no-input` o `CI`.** En su lugar imprime la dirección que hay
  que abrir.
- **Un `--dry-run` de una escritura de evento muestra la clave de Google que comprueba**, `api.calendar.events.insert`
  para una creación, en `permission.also`, y se niega donde se negaría la ejecución real.
- **Los comandos de calendario conservan todos los datos que cli-core pone en `meta`.** gcal descartaba uno que no
  encajaba en su propia copia del esquema. Ahora cli-core imprime las respuestas por sí mismo, y el adaptador de gcal ya
  no existe.
- **gcal funciona sobre cli-base 0.75.2.** Su propia comprobación de una prueba que llega al llavero del sistema pasó a
  cli-base, así que la copia de gcal ya no existe. La comprobación es la misma. `cli-dev lint` ya no avisa del comando
  corto `gcal`: la decisión de mantenerlo junto a `wcat-gcal` es ahora una excepción con su motivo.
- **Un perfil mal escrito muestra los perfiles que tienes.** `gcal persona events list` decía solo "profile persona has
  no Google account yet; run gcal persona session start", lo que invitaba a iniciar sesión con la errata. Cuando existen
  otros perfiles, ahora dice `no profile named "persona" — profiles here: personal, work` antes de la indicación de
  inicio de sesión, y `details.profiles` los enumera. El código y el motivo siguen siendo `authentication_error` y
  `profile.not-signed-in`.
- **El límite de uso de Google Calendar ya no se llama límite de frecuencia breve.** El `quotaExceeded` de Google decía
  "retry the command" y se marcaba como seguro de repetir. La guía de Google remite a los límites de uso, no a repetir.
  Ahora es `google.usage-limit`, no se repite, y enlaza la [guía de errores de
  Google](https://developers.google.com/workspace/calendar/api/guides/errors).
- **Un cambio que solo puede hacer el organizador lo dice.** El `forbiddenForNonOrganizer` de Google era "Google
  denied this operation; check access to the calendar". Ahora es `event.organizer-only`: solo el organizador puede
  cambiar esto, así que cambia solo los campos de tu propia copia.
- **La comprobación de actualización lee un almacén que escribió 0.19.0.** Empezaba en 0.6.0, así que ninguna
  comprobación cubría lo que escribieron las versiones de 0.7.0 a 0.19.0.
- **Los comandos de lectura ya no escriben en el almacén compartido.** `events list`, `events show`, `store status`, `people
  list` y las demás lecturas abren el almacén en solo lectura una vez guardado el perfil, así que las lecturas
  que corren a la vez por MCP no toman el bloqueo de escritura. El primer comando de un perfil, `sync`, las búsquedas y
  cada escritura lo siguen abriendo para escribir, y guardan las filas de la cuenta y del perfil como antes.
- **Una lista de calendarios o los huecos de una serie que Google pagina sin fin se detienen con un error.** Un token de
  página repetido, o más de 1000 páginas, termina ahora la lectura con `invalid_response` en lugar de dar vueltas hasta
  el límite de tiempo.
- **El programa recibe la señal de parada de cli-core y los motivos de error de gcal desde la entrada, como drive.**
  Un fallo nombra ahora los motivos propios de gcal.
- **Los comandos de la guía remota ya no llevan el marcador `<device>.<network>`.** [Uso remoto](./remote.md) escribe
  una dirección de ejemplo con su etiqueta, igual en cada shell, que sustituyes por la de tu túnel.
- **`links review` con `GCAL_PROFILE_LOCK` muestra solo las opciones de enlace del perfil fijado**, y muestra un evento
  candidato del que el perfil no tiene copia solo por su referencia, así que no se ven los títulos de eventos de otra
  cuenta. Sin el bloqueo sigue mostrando las de todas las cuentas, y ahora las nombra en `meta.accounts`. Viene de
  cli-core 0.562.0.
- **En una terminal, las horas de los eventos se muestran en la zona horaria de tu ordenador, y la última línea la
  nombra** (`times in
  Europe/Madrid`). `--json` y `--jsonl` mantienen las horas en UTC. Viene de cli-core 0.562.0.
- **`calendars busy` dice cuándo Google no respondió para un calendario o una persona.** `meta.complete` es false con un
  aviso por cada uno, así que las horas libres ya no se muestran como seguras, y `meta` nombra `now` y la zona horaria.
  Viene de cli-core 0.562.0.
- **El primer ejemplo de la ayuda de `events list` funciona:** `gcal personal events list 'starts_at:[2026-11-02 TO 2026-11-07}'`.
- **Las escrituras de `gcal api` usan la protección de permisos de cli-core** (`keyedGuard`) en lugar de una copia, así
  que un arreglo allí les llega también.

## 0.19.0 — 02.11.2026

### Añadido

- **`wcat gcal` ejecuta la herramienta, y `wcat --help` la muestra en la lista.** El paquete instala `wcat-gcal` junto a
  `gcal`, y `wcat-gcal --wcat-describe` imprime el nombre, la versión y la descripción de la herramienta para `wcat`.
  `gcal` sigue funcionando.

## 0.18.0 — 02.11.2026

### Añadido

- **Una guía para usar `gcal` desde ChatGPT o Claude en el navegador o en el móvil**, `docs/remote.md`: un túnel de
  Tailscale Funnel o de Cloudflare, `mcp serve --http --public-url`, el código de acceso de un solo uso, los permisos
  que rigen por MCP (`ask` deja pasar el comando, así que para este servidor hay `--permission api=readonly` o
  `api.calendar.acl=deny`), cómo dejarlo en segundo plano con `mcp server start`, y cómo detenerlo y cerrar la sesión
  de todas las aplicaciones con `mcp revoke`. El README, la introducción, la página de uso y la skill enlazan a ella.

### Corregido

- **Se leen los eventos de un feed de Outlook o Exchange.** Esos feeds nombran las zonas horarias al modo de
  Windows (`TZID:W. Europe Standard Time`), y `calendars add` y `sync` se saltaban todos sus eventos con hora. Ahora se
  leen en la zona IANA correspondiente (`Europe/Berlin`). Desde cli-core 0.551.0.
- **`--help` ya no ofrece `OR` donde la consulta lo rechaza.** Una lista que filtra Google acepta términos
  `field:value` unidos por AND, y su línea `Syntax:` ahora solo dice eso (`@wirecat/cli-base` 0.75.0).
- **La página de inicio de sesión de `mcp serve --http` habla de tu calendario.** Decía que una aplicación pedía llegar
  a «tus mensajes» mediante `gcal mcp --http`; ahora dice «tu Google Calendar» y `gcal mcp serve --http`.
- **El apartado «Qué funciona hoy» de la hoja de ruta nombra lo que añadieron 0.11.0–0.17.0**: todas las cuentas en
  una lista, solapamientos, preparar una reunión, añadido rápido, archivos `.ics`, feeds, `search all` y `schedule`.

## 0.17.0 — 02.11.2026

### Añadido

- **Una búsqueda en reuniones, chats y notas: `gcal <profile> search all <query>`**, como la tienen `tg` y `max`.
  Lee el almacén que comparten todas las herramientas de WireCat, así que tus reuniones vuelven junto a los mensajes
  que `tg`, `max` o `wa` guardaron y tus notas, la mejor coincidencia primero, cada una con su `kind` y su `ref`. La
  respuesta nombra cada cuenta que leyó en `meta.accounts` y, en una terminal, en una línea `searched:`. `--only`,
  `--source`, `--limit`, `--page`, `--exact` y `--timezone` funcionan como en las demás herramientas. Las
  transcripciones de reuniones solo se leen cuando `--source` nombra una cuenta de reuniones, y el correo se queda con
  `memo search mail`. Lee solo el almacén local, nunca Google. Los agentes la tienen por MCP como lectura, y
  `permissions.search.all` puede denegarla. Con `@wirecat/cli-core` 0.548.0 → 0.549.0 y `@wirecat/cli-base`
  0.73.0 → 0.74.0.
- **`sync` pregunta a un feed si cambió** (`ETag` / `Last-Modified`), y conserva los eventos guardados cuando el
  servidor dice que nada cambió; el `feeds` de la respuesta dice entonces `unchanged: true`. El primer `sync` del día, y
  `sync --rescan`, leen cada feed completo.
- **`calendars add` avisa una vez en stderr ante una dirección `http://`**: el feed y cualquier token de su dirección
  viajan sin cifrar. Sigue funcionando.
- [Mantener los feeds al día](./usage.md#keep-feeds-fresh) da el temporizador que ejecuta `sync` cada hora junto al de
  los avisos: `gcal personal schedule command feeds --every 1h -- sync`.

### Cambios — pueden romper scripts

- **`calendars remove` borra los eventos del feed** en vez de dejarlos en `events list` como cancelados: el calendario
  del feed y cada evento guardado de él desaparecen, también de la búsqueda, y el `events` de la respuesta los cuenta.
  Un evento que también está en uno de tus calendarios de Google se queda. `calendars remove` acepta solo un feed;
  `calendars unsync` sigue dejando de sincronizar un calendario de Google y conserva sus eventos. Con
  `@wirecat/cli-core` 0.546.0 → 0.548.0.

## 0.16.0 — 02.11.2026

### Añadido

- **Seguir un feed iCalendar: `gcal <profile> calendars add <url>`**, como un calendario público de festivos, el
  calendario de una liga deportiva o la dirección `.ics` que publica un colega, como calendario de solo lectura junto a
  tus calendarios de Google. `sync` lo vuelve a leer cada vez, y sus eventos aparecen en `events list`,
  `search events`, `overlapping:true` y `events remind`. Los eventos que se repiten se expanden en su propia zona
  horaria. Una escritura en un evento del feed se rechaza antes de enviar nada, y `calendars busy` deja fuera los feeds.
  La dirección se guarda en el llavero como el inicio de sesión y nunca se imprime. `calendars remove` deja de seguirlo.
  La API de Google no documenta ninguna forma de añadir un calendario desde una URL, así que `gcal` lee el feed por sí
  mismo. Consulta [Seguir un feed de calendario](./usage.md#follow-a-calendar-feed).

### Corregido

- Una escritura en un calendario que solo puedes leer, como uno compartido contigo como `reader`, ahora se rechaza con
  `calendar.read-only` antes de preguntar o enviar nada; antes la rechazaba Google.
- El lector de tu propio `--client-file` viene de `@wirecat/cli-core`, no de una copia en gcal. Los formatos del
  archivo, la comprobación de `chmod 600` y los errores no cambian.

## 0.15.0 — 02.11.2026

### Añadido

- **Una orden instala el temporizador de avisos de reuniones: `gcal <profile> schedule`**, como la tienen `tg` y
  `mail`. `gcal personal schedule command reminders --every 5m -- events remind --due-within 10m -- /home/me/bin/remind`
  instala un temporizador de usuario de systemd en Linux, un agente de launchd en macOS o una tarea del Programador de
  tareas en Windows; `schedule
  list`, `run` y `remove` se ocupan de él. Instalarlo no permite tu programa: mientras
  `events.remind.hook` no esté en `allow`, la orden lo dice y da la línea `config set`. También avisa cuando `--every`
  es más largo que `--due-within`, o cuando la ruta del programa es relativa. `GCAL_READ_ONLY` rechaza
  `schedule command` y `remove`, y ninguna herramienta MCP ofrece `schedule`. Las líneas de cron y los temporizadores
  escritos a mano siguen en [Recibir un aviso antes de una reunión](./usage.md#run-it-on-a-timer) para una máquina sin
  sesión de usuario de systemd.

## 0.14.0 — 02.11.2026

### Añadido

- **Avisos de reuniones: `gcal <profile> events remind`, para cron o un temporizador cada pocos minutos**, como el
  `remind` de gcalcli. Cada ejecución sincroniza y luego avisa una vez de cada evento que empieza dentro de
  `--due-within` (`10m` si no se indica): los imprime o, después de `--`, ejecuta tu propio programa una vez por evento,
  con el evento como JSON en su entrada estándar y `GCAL_EVENT` en su entorno. No lo ejecuta ninguna shell, y el texto
  del evento nunca llega a su línea de órdenes. La forma con programa está en `deny` hasta que la permitas con
  `config set permissions.events.remind.hook allow`, y ninguna herramienta MCP ofrece la orden.
  [Recibir un aviso antes de una reunión](./usage.md#get-reminded-before-a-meeting) muestra una notificación de
  escritorio, un mensaje de Telegram y las líneas para cron, systemd, launchd y el Programador de tareas.

## 0.13.0 — 02.11.2026

### Añadido

- **Las respuestas dan la hora y la zona horaria.** `events list`, `events prepare`, `doctor` y `session status` llevan
  `meta.now`, `meta.now_local` y `meta.timezone`, así que un agente planifica «mañana» desde la fecha real y tu zona, no
  desde una suposición (WC-TIME-7).
- **Por MCP, el `query` de una lista nombra sus campos.** Decía «los campos están abajo», y abajo no había nada. Ahora
  enumera cada campo con sus valores y dice que `-event_type:<kind>` (o `NOT event_type:<kind>`) deja fuera un tipo.

### Corregido

- **`events export` ya no necesita la herramienta de escritura.** Sin `--output` solo responde el texto `.ics`, así que
  pasa por `gcal_read`, y un perfil de solo lectura (`GCAL_READ_ONLY`) puede exportar. `--output` sigue sin ofrecerse
  por MCP, y el bloqueo de solo lectura sigue rechazándolo en la línea de órdenes.

## 0.12.0 — 01.11.2026

### Añadido

- **Preparar una reunión: `gcal <profile> events prepare [event:<id>]`.** Da lo que el almacén local guarda sobre una
  reunión, la próxima si no nombras ninguna: el evento con las respuestas de los asistentes y sus archivos de Drive, y
  para cada otro asistente vuestros últimos mensajes y correos uno a uno, sus mensajes en grupos, los eventos pasados
  y las reuniones grabadas con él, de todas las herramientas de WireCat de este ordenador. Solo lee el almacén y no
  escribe ningún resumen. `meta.accounts` nombra cada cuenta leída, `meta.complete: false` dice lo que falta y
  `untrusted` marca todo lo que escribieron otras personas. Los detalles están en
  [Preparar una reunión](./usage.md#prepare-for-a-meeting).
- **El skill y `gcal guide` enseñan a un agente a escribir un informe de reunión y un resumen diario o semanal**
  (`gcal guide prepare-meeting`, `gcal guide digest`): el objetivo, los participantes, las decisiones pendientes, las
  preguntas abiertas y una lista de comprobación, a partir de `events prepare` y `events list`, sin seguir nunca
  instrucciones que aparezcan en el texto de un evento.
- **Añadir una reunión con una sola línea.** `gcal <profile> events create Work --text "Lunch with Ana tomorrow 1pm"`
  pasa la línea a la adición rápida de Google, que lee el día, la hora y el lugar. Sus claves son `events.create` y
  `api.calendar.events.quickAdd`; no se envía correo a nadie sin `--notify`. Google elige el id, así que
  `--operation-id` no se aplica.
- **Exportar e importar iCalendar.** `events export <query> --output week.ics` escribe como archivo `.ics` los eventos
  que listaría `events list` (`id:<id>` para uno); `events import <calendar> <file.ics>` añade los eventos de un
  archivo mediante `events.import` de Google, cada uno con su UID, y no envía correo a nadie. La importación pregunta
  antes (`events.import`).
- **Dejar fuera cumpleaños, tiempo de concentración y otro ruido.** `events list -event_type:birthday -event_type:focus`
  deja fuera esos tipos, y `event_type:default` conserva solo los eventos normales. `events list id:<id>` encuentra un
  evento.
- **Calendarios por nombre.** `calendar:Team`, `events create Team`, `--calendar` y `--to-calendar` aceptan el nombre
  de un calendario además de su id. Un nombre que comparten dos calendarios se rechaza con sus ids.
- gcal funciona sobre cli-core 0.539.0 y cli-base 0.71.0.

## 0.11.0 — 01.11.2026

### Añadido

- **`session start` puede usar una aplicación de Google de WireCat incluida en el paquete**, cuando una versión la
  trae; `gcal doctor` muestra entonces `oauth_client.client: wirecat`. Esta versión no trae ninguna, así que sigues
  creando tu propia aplicación y la pasas con `--client-file`, o con `GCAL_GOOGLE_CLIENT_ID` y
  `GCAL_GOOGLE_CLIENT_SECRET`, que también tienen prioridad sobre una aplicación incluida.
- **Todas tus cuentas en una lista.** `gcal <profile> events list --source all` muestra en una sola lista los eventos
  de todas las cuentas de Google que gcal ha guardado; `--source gcal:personal,gcal:work` nombra perfiles. La respuesta
  nombra las cuentas en `meta.accounts` y dice `meta.complete: false`, con un problema por cada cuenta cuya
  sincronización falta o no ha terminado. Una reunión que tienen dos cuentas aparece una vez. Con `GCAL_PROFILE_LOCK`,
  `--source` solo lee la cuenta del perfil bloqueado. Un perfil con sesión iniciada pero nunca sincronizado también
  aparece, como una cuenta sin calendario sincronizado.
- **Reuniones que se solapan.** `events list overlapping:true` muestra las reuniones cuyo horario se solapa con el de
  otra, cada una con `overlaps`; con `--source` compara entre cuentas. Cuenta las reuniones con hora que no están
  canceladas, rechazadas, marcadas como libre ni son un bloque de lugar de trabajo; los eventos de todo el día y las
  reuniones seguidas nunca se solapan.
- **Una guía paso a paso para crear tu propia aplicación de Google.**
  [Crea tu propia aplicación de Google](./installation.md#make-your-own-google-app) recorre Google Cloud Console: el
  proyecto, la Google Calendar API, Branding, Audience, Data Access con los permisos que pide `gcal`, y un cliente
  Desktop app. Explica cuándo dejar la aplicación en Testing, donde un inicio de sesión termina a los 7 días, y cuándo
  publicarla. [Problemas al iniciar sesión](./troubleshooting.md#sign-in-problems) recoge lo que muestran Google y
  `gcal` cuando faltó un paso. Las versiones actuales no traen ninguna aplicación de Google de WireCat, así que cada
  usuario crea la suya.
- gcal funciona sobre cli-core 0.527.0.
- **El servidor MCP de gcal aparece en el MCP Registry oficial** como `dev.wirecat/gcal-cli`, a partir de la próxima
  versión: `server.json`, `mcpName` y las tareas del registro de cli-template 0.12.0.

### Corregido

- **La sección de la guía de uso sobre llamadas directas a `api` coincide ahora con la 0.7.0**: una escritura fácil de
  deshacer se ejecuta sin preguntar; borrar y compartir preguntan; vaciar, borrar o ceder un calendario se rechaza
  hasta que lo permitas.

## 0.10.0 — 01.11.2026

- gcal funciona ahora sobre cli-core 0.512.0. Nada cambia en los comandos de gcal ni en su servidor MCP: cli-core
  0.512.0 renombró `id` a `operation_id` en sus propias herramientas MCP de calendario, que gcal no ofrece. Los
  agentes de gcal escriben con `gcal_write`, donde `events create` y `events update` ya aceptan `operation_id` desde la
  0.9.0, y paginan `events list` con `gcal_read` y `page`.

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
