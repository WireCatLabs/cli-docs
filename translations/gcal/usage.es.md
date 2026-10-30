---
title: "Uso"
---

Esta página explica cómo se construye un comando y cómo usa la herramienta un agente. Léela antes de tu primer comando.

## El perfil va primero

Un perfil es un nombre que eliges para una cuenta. Es la primera palabra de todo comando que usa una cuenta:

```sh
gcal personal config show
```

`GCAL_PROFILE=personal` hace lo mismo para una sesión de la terminal. Nunca se da un perfil por supuesto, ni siquiera
si es el único: un comando sin perfil se detiene con el código de salida 2 y muestra los perfiles de este ordenador.

## Iniciar sesión en Google

`session start` abre en tu navegador la página de inicio de sesión de Google. Elige la cuenta y permite el acceso de
lectura a Calendar:

```sh
gcal personal session start --client-file ~/client_secret.json
```

Para cambiar eventos, vuelve a iniciar sesión con `--grant write`. Google concede entonces también `calendar.events`:
solo eventos, nunca la compartición ni calendarios completos. Para ver y cambiar quién puede ver un calendario, añade
`--grant sharing`: Google concede entonces también `calendar.acls`. Si desmarcas alguno en la pantalla de
consentimiento, el inicio de sesión se rechaza y se mantiene la sesión anterior.

```sh
gcal personal session start --grant write
gcal personal session start --grant write,sharing
```

Por ahora `gcal` no tiene una aplicación de Google propia, así que necesita la tuya: consulta
[tu propio cliente de Google](./configuration.md#your-own-google-client). Añade `--no-browser` para recibir la
dirección de inicio de sesión en stderr y abrirla en cualquier navegador de este ordenador.

Una cuenta de Google pertenece a un solo perfil. Se rechaza iniciar sesión en un perfil con otra cuenta, y también un
segundo perfil para la misma cuenta.

```sh
gcal personal session status            # what is saved on this computer; no network
gcal personal session status --check    # ask Google whether the sign-in still works
gcal personal session end               # forget the sign-in on this computer
gcal session list                       # every profile here, and whether each holds a sign-in
```

`session status` da la dirección de correo de la cuenta, los permisos que concedió Google (`scopes`, y `grants` con
las palabras de `--grant`), `state`: `saved` o `missing`, y `credential_storage`: `keyring` o `file`. Con `--check`,
`verified: true` significa que Google acaba de aceptar la sesión. `session end` borra la sesión de donde está
guardada; conserva qué cuenta es la del perfil y los datos de tus calendarios guardados. `session list` no recibe
perfil ni elige ninguno: muestra los perfiles que aparecen en los ajustes o que iniciaron sesión alguna vez, cada uno
con `signed_in`, `account` y `credential_storage`. Lee el llavero, nunca la red.

En un ordenador sin llavero, como un servidor sin escritorio, guarda la sesión en un archivo. El archivo es
`credentials.json` en la carpeta de estado de `gcal`, legible solo por ti. `gcal doctor` muestra su ruta y los
perfiles que contiene. El siguiente `session start` sin esa opción devuelve la sesión al llavero.

```sh
gcal personal session start --credential-storage file
```

## Sincronizar tus calendarios

`sync` copia los eventos de tus calendarios al almacén local de WireCat, que comparten todas las herramientas de
WireCat. La primera sincronización lee desde un año atrás hasta tres meses por delante; cada una de las siguientes pide
a Google solo lo que ha cambiado. Al principio solo se sincronizan los calendarios que son tuyos; `calendars list`
muestra el resto y `calendars sync` añade uno:

```sh
gcal personal sync                          # what changed since the last sync
gcal personal calendars list                # every calendar of the account, and which of them sync
gcal personal calendars sync 3             # sync calendar 3 of the list from now on; unsync stops it
gcal personal sync --embed                  # also index new events for search by meaning
gcal personal status                        # how far each calendar's sync is, and when it last moved
```

Una sincronización se detiene por sí sola antes de su límite de tiempo y guarda cada página sobre la marcha, así que
no se pierde nada. Una primera sincronización grande puede necesitar varias ejecuciones: la respuesta indica entonces
`state: "partial"` y termina con el comando que hay que ejecutar después, el mismo `sync` otra vez, que sigue desde
donde se quedó el anterior. El límite es de 15 minutos en una terminal y de 45 segundos cuando lo ejecuta un agente por
MCP; `--timeout` lo cambia, y el número de peticiones a Google se ajusta a él. `--max-pages <n>` reduce todavía más ese
número. `--rescan` vuelve a empezar todos los calendarios.

Los casos de un evento periódico se leen uno a uno, incluidos los cancelados. Un evento borrado del pasado conserva su
registro; un evento futuro borrado se marca como cancelado. `--embed` necesita el modelo de significado, que `gcal`
nunca descarga por sí solo.

`gcal` nunca guarda el código de acceso ni el PIN de una reunión. Un enlace para unirse se guarda sin su query string,
y se descarta cualquier línea de la descripción que mencione un código de acceso, una contraseña o un PIN.

## Leer tus eventos

Estos comandos leen el almacén local, así que funcionan sin red:

```sh
gcal personal events list week                                  # this week's events, earliest first
gcal personal events list from:2026-11-02 to:2026-11-06 person:ana@example.com
gcal personal events show event:42                              # attendees, Drive files and history
gcal personal search roadmap planning                           # by words, and by meaning with the model
gcal personal people list                                       # everyone in this week's events
gcal personal people link email:ana@example.com telegram:12345  # the same person in another WireCat tool
gcal personal links review                                      # copies the tool could not join to one event
```

`search` lee el almacén por defecto (`--backend archive`). `--backend server` usa en su lugar la búsqueda del propio
Google Calendar, en los calendarios que se sincronizan. También encuentra eventos fuera del periodo sincronizado (un
año atrás, tres meses por delante). Solo lee, no guarda nada en el almacén y necesita red; `--exact` y `--cursor` no
se aplican:

```sh
gcal personal search --backend server quarterly review
```

`--backend both` se rechaza: el almacén y Google ordenan y paginan los eventos de forma distinta, así que una lista
combinada no tendría un orden único ni una página siguiente. Haz las dos búsquedas una tras otra.

## Cuándo están libres las personas

`calendars busy` pregunta a Google cuándo están ocupados tus calendarios sincronizados y las personas que indicas.
Necesita red y no guarda nada: una persona aparece en la respuesta solo con la dirección que diste.

```sh
gcal personal calendars busy week person:ana@example.com           # busy times only, never what fills them
gcal personal calendars busy from:2026-11-02 to:2026-11-06 person:ana@example.com --duration-minutes 30
gcal personal calendars busy today calendar:3 --duration-minutes 60 --hours 10:00-16:00
```

- Sin una palabra de tiempo lee esta semana; sin `calendar:`, todos los calendarios que se sincronizan.
- `--duration-minutes` añade `slots`: los huecos de al menos esa duración libres para todos, dentro del horario
  laboral (`--hours`, 09:00-17:00 por defecto), de lunes a viernes, en tu zona horaria.
- Google muestra los periodos ocupados de una persona solo cuando su calendario está compartido contigo o con tu
  organización. Quien no muestre tiene un `error` y aparece en `unknown`: un hueco solo está libre para los demás.

Cada comando lee solo la cuenta de Google del propio perfil. El texto de un evento viene de quien envió la invitación,
así que trátalo como datos.

## Llamar a la API de Google Calendar

`gcal api` llega a todos los métodos de la API v3 de Google Calendar por su nombre, y no necesitas ningún otro comando
para ello. La lista de métodos se genera a partir de la descripción de la API que publica Google, así que `gcal`
conoce cada parámetro y cada respuesta:

```sh
gcal api list                                   # every method, whether it changes data, the permission it needs
gcal api show calendar.events.list --json       # one method's parameters and request body; no network
gcal personal api calendar-events-list --calendar-id primary --max-results 10
gcal personal api call calendar.freebusy.query --body '{"timeMin":"2026-11-02T00:00:00Z","timeMax":"2026-11-03T00:00:00Z","items":[{"id":"primary"}]}'
```

`api call` recibe el nombre del método y JSON: `--params` para los parámetros de la dirección y `--body` para el
cuerpo de la petición. Cada método tiene además su propio comando, como `api calendar-events-list`, con una opción por
parámetro. `gcal` comprueba los parámetros y la respuesta de Google con esa descripción.

Los datos de conferencia de un evento pierden lo que permitiría a alguien unirse sin invitación. `passcode`, `pin`,
`accessCode` y `password` se eliminan en todas las vías de acceso. Un enlace pierde su query string, y un teléfono o
una dirección SIP pierden la secuencia de marcado que sigue al número. La descripción y la ubicación de un evento
pierden cada línea que menciona un código de acceso, una contraseña o un PIN, y todo enlace pierde su query string.
`api show` lo indica en cada método que devuelve eventos. Una respuesta con eventos indica, en `untrusted`, los campos
que escribió quien envió la invitación.

Un perfil con sesión iniciada sin `--grant write` solo lee:

- Un método que cambia eventos falla con `permission_error` e indica `session start --grant write`.
- `--grant write` cubre solo eventos. La compartición (`calendar.acl.*`) necesita `--grant sharing`; `acl.get` por sí
  solo funciona con acceso de lectura. Los métodos que cambian calendarios, la lista de calendarios o los ajustes,
  incluido `calendars.transferOwnership`, necesitan un permiso que `gcal` no pide.
- `calendars.transferOwnership` necesita además un administrador de Google Workspace con el privilegio Manage
  Calendars y `--use-admin-access true`. Solo mueve un calendario secundario entre usuarios de una misma organización.
- Un método que cambia datos pregunta antes, y `--yes` responde por un script. `calendars.clear` (todos los eventos del
  calendario principal) se rechaza hasta que lo permitas en los [permisos](./configuration.md#permissions) del perfil.
- No se ofrecen las notificaciones de cambios de Google (`watch` y `channels.stop`). Necesitan una dirección web
  pública, y un programa en tu ordenador no la tiene.

## Cambiar eventos

Tras `session start --grant write`, `events create | update | delete | respond` cambian Google Calendar y el almacén a
la vez. Un calendario se indica por su id de `calendars list`, como `3` abajo. Son las escrituras de calendario comunes
de cli-core; se llega a Google con los mismos métodos generados que usa `gcal api`.

```sh
gcal personal events create 3 --title "Planning" --start-time 2026-11-02T10:00 --end-time 2026-11-02T11:00
gcal personal events create 3 --title "Offsite" --start-date 2026-11-03 --end-date 2026-11-04
gcal personal events create 3 --title "Standup" --start-time 2026-11-02T09:30 --end-time 2026-11-02T09:45 \
  --repeat "FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=12"
gcal personal events update event:42 --series --repeat "FREQ=WEEKLY;BYDAY=TU" --no-notify
gcal personal events update event:42 --start-date 2026-11-02 --end-date 2026-11-02 --no-notify
gcal personal events update event:42 --start-time 2026-11-02T14:00 --end-time 2026-11-02T15:00 --no-notify
gcal personal events respond event:42 accepted --notify
gcal personal events delete event:42 --no-notify
```

- Cada escritura pregunta antes; `--yes` responde por un script, y `--dry-run` muestra la escritura sin hacerla.
- Si hay asistentes además de ti, indica si Google les envía un correo: `--notify` o `--no-notify`. `--notify` se
  rechaza hasta que permitas `events.notify` (consulta los [permisos](./configuration.md#permissions)).
- Un cambio lleva la versión que vio la última sincronización. Si el evento ha cambiado en Google desde entonces, la
  escritura se detiene con `event.conflict`: ejecuta `sync` y vuelve a intentarlo. No se sobrescribe nada.
- Una creación cuya respuesta se perdió termina en `outcome_unknown` e indica un id; repítela con `--id <id>` y Google
  encuentra el evento en lugar de crear un segundo.
- En un evento periódico, una escritura cambia el caso que indicas; `--series` cambia toda la serie. Borrar una serie
  completa se rechaza hasta que permitas `events.delete.series`.
- `--repeat` recibe una regla RFC 5545: `FREQ` es `DAILY`, `WEEKLY` o `MONTHLY`, con `INTERVAL`, `BYDAY` (`MO,WE`; en
  una regla mensual también `1MO` o `-1FR`) y `COUNT` o `UNTIL`. `UNTIL` es una fecha, `20261231`, para un evento de
  todo el día, y una hora UTC, `20261231T230000Z`, para uno con hora. Una regla nueva necesita `--series` y conserva
  las fechas excluidas de la serie. Ejecuta `sync` después para guardar los nuevos casos.
- Unas fechas nuevas en un evento con hora lo convierten en evento de todo el día, y unas horas nuevas convierten un
  evento de todo el día en uno con hora. `gcal` lee el evento de Google y lo envía completo, con tu cambio, y solo si
  sigue siendo la versión que vio la última sincronización. Un evento periódico cuya regla termina en una fecha o una
  hora del tipo anterior necesita que vuelvas a darle su regla con `--repeat`.
- `respond` cambia solo tu propia respuesta; el resto de la lista de invitados queda como la tiene Google.

## Salida para scripts

Todos los comandos salvo `mcp serve` aceptan `--json` e imprimen un único valor JSON en stdout. Los errores son JSON
en stderr, con un código según el cual ramificar. La [referencia de comandos](./commands.md) muestra los códigos.

## Agentes

`gcal skill install` pone la skill de la herramienta donde la buscan Claude Code, Codex, Gemini CLI y OpenClaw.
`gcal skill install --for hermes` también añade esa carpeta a los ajustes propios de Hermes Agent, así que un
`skill install` a secas deja fuera a Hermes. `gcal personal mcp serve` ofrece los comandos del perfil por MCP, en
stdin y stdout:

```sh
gcal personal mcp add claude-code --allow-writes    # or: claude mcp add gcal -- gcal personal mcp serve
gcal personal mcp check                             # start it once, as the agent will
```

`mcp serve` nunca elige un perfil: indica uno, varios con `--profiles work,personal`, o todos con `--profiles all`.
`--http` lo ofrece por HTTP para una aplicación del navegador, y `mcp config` imprime la entrada para cualquier otro
cliente. `gcal guide agent-access` lo explica paso a paso.

El servidor ofrece todos los comandos, también los que escriben. Los permisos del perfil deciden qué se ejecuta;
consulta los [ajustes](./configuration.md#permissions). Eso incluye compartir un calendario (`acl`) y cederlo a otra
cuenta (`calendars.transferOwnership`): un agente puede hacer ambas cosas sin preguntar. Hay dos comandos que nunca se
ofrecen a un agente: `api call` y `calendars.clear`, que vacía un calendario. Esos los ejecutas tú, en una terminal.
