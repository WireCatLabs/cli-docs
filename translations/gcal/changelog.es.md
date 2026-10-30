---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/gcal-cli`. Una sección por versión, de la más reciente a la más antigua.

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
