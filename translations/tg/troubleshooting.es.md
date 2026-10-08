---
title: "Solución de problemas"
---

Busca el síntoma que ves en pantalla y sigue los pasos. Con `--json`, cada error es una línea por stderr, `{"error":{"code":"…","message":"…"}}`, y el código de salida corresponde a `code`. Consulta los números en [códigos de salida](./commands.md#exit-codes).

## Según el código de salida

| Código | Nombre | Qué suele significar | Dónde |
|---|---|---|---|
| `1` | `generic_failure` | error en el nombre del comando o fallo de `tg` | [comando desconocido](#error-unknown-command-), [informar del problema](#report-a-problem) |
| `2` | `validation_error` | un valor o una combinación de opciones que `tg` no acepta; un nombre que coincide con varios chats | [valores](#--limit-takes-a-whole-number-from-1-upwards), [varios chats](#-matches-3-chats--name-one-by-its-id) |
| `3` | `configuration_error` | `config.json` incorrecto, el proxy rechazó la conexión o no responde, o archivo local más reciente que este `tg` | [configuración](#-is-not-a-valid-config), [proxy](#the-proxy--cannot-be-reached-or--refused), [archivo local](#the-message-store-was-written-by-a-newer-version-) |
| `4` | `authentication_error` | sin sesión, sesión finalizada o almacén de claves inaccesible | [sin sesión](#no-session-for-profile-default--run-tg-setup) |
| `5` | `permission_error` | rechazado por `permissions` o por Telegram | [no permitido](#profile--does-not-let--write-or-profile--denies-), [rechazo de Telegram](#telegram-refused-), [PEER_FLOOD](#telegram-limited-this-accounts-messages-as-spam-peer_flood) |
| `6` | `not_found` | chat, mensaje o persona inexistentes; archivo local vacío | [sin chat](#no-chat-matches-), [sin datos guardados](#nothing-recorded-for-profile--yet--run-the-command-once-without---offline) |
| `7` | `confirmation_required` | chat fuera de destinatarios permitidos o cambio que requiere aprobación sin nadie que responda | [destinatarios](#chat--is-not-on-the-recipient-list-of-profile-), [confirmación](#-asks-before-it-acts) |
| `8` | `rate_limited` | límite por hora o espera exigida por Telegram | [límite por hora](#profile--has-sent-n-messages-in-the-hour-), [FLOOD_WAIT](#telegram-asks-to-wait-n-s-before-the-next-request) |
| `9` | `timeout` | Telegram no respondió a tiempo o terminó `--timeout` | [comando bloqueado](#a-command-hangs) |
| `10` | `network_error` | no se puede acceder a Telegram | [conexión](#cannot-reach-telegram-) |
| `11` | `provider_error` | Telegram rechazó la petición | [rechazo de Telegram](#telegram-refused-) |
| `12` | `provider_unavailable` | fallo en Telegram | [fallo de Telegram](#telegram-failed-) |
| `13` | `invalid_response` | respuesta que `tg` no entiende; hasta ahora, solo de my.telegram.org | [my.telegram.org](#mytelegramorg-says-the-app-was-created-but-its-page-shows-none) |
| `14` | `outcome_unknown` | conexión interrumpida después de una escritura; puede haberse realizado | [resultado desconocido](#outcome_unknown-after-a-send) |
| `130` | `cancelled` | Ctrl-C o respuesta negativa a una pregunta | [Ctrl-C](#ctrl-c) |

## Primero: `tg doctor`

```sh
tg doctor
```

No se conecta y muestra las dependencias de los comandos: versión, entorno, configuración, sesión y credenciales, si `TG_*_DIR` cambió su ubicación, archivo local, registro de envíos y ejecuciones. **Responde incluso cuando todo lo demás falla:** úsalo en ese caso. Un perfil sin sesión aparece como información, no como error; el código sigue siendo `0`. Nunca imprime la sesión ni el hash, solo si existen.

```sh
tg doctor --online
```

`--online` también se conecta una vez y lee la cuenta. No envía nada ni marca mensajes como leídos. Sin esta opción, el inicio de sesión aparece como `not checked`: solo `--online` indica si Telegram sigue aceptando la sesión. `--online` también avisa si el reloj de este equipo va mal y si Telegram congeló o cerró la cuenta ([diagnóstico](./diagnostics.md#check-the-installation-tg-doctor)).

## No se encuentra `tg` después de instalar

La carpeta donde npm instala los comandos no está en `PATH`.

- **Linux y macOS:** es `$(npm prefix -g)/bin`. Añádela a `PATH` en `~/.zshrc` o `~/.bashrc`: `export PATH="$(npm prefix -g)/bin:$PATH"`.
- **Windows:** npm instala comandos en la carpeta indicada por `npm prefix -g`, normalmente `%APPDATA%\npm`. Comprueba que esté en `$env:Path`. Una terminal abierta antes de instalar Node no ve el nuevo `PATH`: abre otra.
- **PowerShell indica "running scripts is disabled on this system".** npm instala `tg.ps1` junto a `tg.cmd` y PowerShell bloquea scripts por defecto. Ejecuta `tg.cmd`, que siempre funciona, o permite scripts para tu usuario: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- **Otra `tg` aparece primero.** Otro programa también puede llamarse `tg`. `which -a tg` (o
  `Get-Command tg -All` en PowerShell) los enumera todos; ejecuta el nuestro por su ruta completa o coloca su carpeta
  primero.

También funciona sin instalar: `npx @leemour/tg-cli doctor`.

## "error: unknown command '…'"

Código de salida `1`; muestra ayuda por stderr, no JSON. La primera palabra es el perfil si no es un comando, por lo que una errata en el comando se interpreta como perfil:

```text
tg chat list
error: unknown command 'list'
```

Aquí `chat` se interpretó como perfil y `list` no es un comando. El correcto es `chats`, en plural. `tg --help` muestra todos.

## "no session for profile "default" — run `tg setup`"

Código `4`. El perfil nunca inició sesión en este equipo o la cerró. Comprueba qué perfil querías usar: primera palabra o `TG_PROFILE` ([perfiles](./sessions.md#profiles)).

```sh
tg setup                    # guided first run
tg work chats list          # or name the profile you logged in to
```

Si sabes que iniciaste sesión, comprueba si `TG_CONFIG_DIR`, `TG_STATE_DIR` o `TG_CACHE_DIR` está ahora definida y antes no, o viceversa, por ejemplo en otra terminal. Cambian dónde se busca la sesión. `tg config show` avisa si hay alguna; `env | grep TG_` las muestra todas.

Si es el primer uso y no hay claves de aplicación, el error indica `tg setup` (o `tg work setup` para el perfil work). Lee `tg setup --help` para las opciones de acceso. Los agentes pueden leer `tg skill show` antes de iniciar sesión. Una sesión interrumpida o caducada sigue necesitando `tg session start` y después otra comprobación con setup.

## "no Telegram app credentials found … although it has logged in on this machine"

Código `4`. La sesión existe, pero no se puede acceder al almacén de claves. Ocurre con cron, ssh, servicios y clientes MCP que inician `tg` con un entorno reducido.

**No vuelvas a iniciar sesión:** añadirías otro dispositivo sin arreglarlo. En Linux, define `XDG_RUNTIME_DIR` (normalmente `/run/user/` seguido del número de `id -u`):

```sh
XDG_RUNTIME_DIR=/run/user/$(id -u) tg chats list
```

Para cron, consulta [tareas programadas](./recipes.md#running-on-a-schedule). El almacén también puede permanecer bloqueado hasta que inicies sesión en el equipo.

## "not logged in, or the session was ended — run `tg session start`"

Código `4`. Telegram ya no acepta la sesión: se cerró desde otro dispositivo (Ajustes → Dispositivos) o mediante `tg session end`. Inicia sesión con `tg session start`.

## "`tg session start` asks questions — run it in a terminal"

Código `2`. El inicio necesita una persona que escanee o introduzca un código. Ejecútalo en una terminal. Para un agente, `--qr-file login.png` guarda el QR en un archivo ([sesiones](./sessions.md#when-an-agent-runs-the-login)).

## "my.telegram.org says the app was created, but its page shows none"

Código `13` durante `tg session start --app auto`. El sitio no tiene API y `tg` usa el formulario web; este cambió o respondió inesperadamente. Los demás errores del sitio tienen código `11` e incluyen su mensaje. Usa la vía predeterminada: `tg session start` abre el navegador para que pegues el identificador y hash ([sesiones](./sessions.md#the-app-from-mytelegramorg)).

## La respuesta procede de otro perfil

`tg config show` indica el perfil y su origen. `TG_PROFILE` selecciona uno y `TG_PROFILE_LOCK` rechaza los demás. Una errata en el comando se interpreta como perfil ([arriba](#error-unknown-command-)).

## "… is not a valid config"

Código de salida `3`. `config.json` contiene un ajuste que `tg` no conoce o un valor de tipo incorrecto. El error
indica el ajuste y el perfil al que pertenece. Se rechaza deliberadamente: un ajuste ignorado en silencio
puede costarte medio día. Corrígelo a mano o elimínalo con `tg config unset <setting>`
([configuration.md](./configuration-reference.md#a-typo-is-an-error-not-a-default)).

## "--limit takes a whole number from 1 upwards"

Código `2`. Lo mismo se aplica a `--page`. Sin esa comprobación, un valor no numérico podría vaciar silenciosamente la lista.

## "--after-time takes an ISO 8601 time or 30m, 2h, 1d ago"

Código `2`. `--since-time` exige el mismo formato. Aceptan fechas ISO 8601 (`2026-09-20T09:00`) o intervalos anteriores (`30m`, `2h`, `1d`). Para identificadores de mensaje, usa `--after-id` o `--before-id`.

## "--at-time takes a time like 2026-09-25T09:00 or a delay like 30m, 2h, 1d"

Código `2`. `--at-time` acepta hora local o un intervalo desde ahora en minutos, horas o días; no segundos. Debe estar entre un minuto y un año en el futuro.

## "--timeout takes a duration with a unit — 500ms, 30s, 2m, 4h or 1d"

Código `2`. `--timeout` y `TG_TIMEOUT` aceptan un número con `ms`, `s`, `m`, `h` o `d`; un número sin unidad se rechaza.

## "--all and --page ask for different things; use one or the other"

Código `2`. `--all` pide todas las filas y `--page` una sola página. El programa rechaza la combinación en lugar de elegir silenciosamente y devolver una respuesta incorrecta.

## "… matches 3 chats — name one by its id"

Código `2`. El título coincide con varios chats. El error los enumera con identificadores y el JSON los incluye como `candidates`. Repite usando el identificador. `tg` nunca adivina: enviar al chat equivocado no se puede deshacer.

## "no chat matches …"

Código `6`. Ningún título contiene lo introducido. Prueba `tg chats list --search <part of it>`, el identificador, `@username` o `me` para Mensajes guardados. El título de un chat individual es el nombre de la otra persona tal como Telegram te lo muestra.

## "Telegram does not know that (…)"

Código `6`. Telegram indica que el chat, usuario, nombre o mensaje no existe para esa cuenta: `PEER_ID_INVALID`, `USERNAME_NOT_OCCUPIED`, `MSG_ID_INVALID`, etc. El mensaje puede haberse eliminado o pertenecer el identificador a otro chat. `contacts lookup` responde "nobody
Telegram lets you find has this number" si la persona oculta su teléfono o no tiene cuenta.

## "Telegram asks to wait N s before the next request"

Código `8`. Es el límite propio de Telegram (FLOOD_WAIT). Espera ese tiempo; el JSON incluye `retryAfterMs`. Suele aparecer tras muchas peticiones seguidas, como `chats list --all` después de otros comandos o una descarga larga con `store fetch`. Para `store fetch` y `messages download --all`, aumentar `--pause` ayuda.

Un comando espera una petición de hasta 10 segundos, dos veces como máximo, y lo indica en stderr: "Telegram asks to wait 3 s before … — waiting, then going on". `serve` y `watch` esperan hasta 2 minutos. Una espera más larga termina el comando con este error. `tg` también recuerda la espera: hasta que acaba, el mismo comando falla al instante sin volver a preguntar a Telegram, y `tg doctor` y `tg server status` la muestran en `flood`.

Cómo encajan el ritmo, las esperas y los comandos paralelos: [limits.md](./limits.md).

## "Telegram limited this account's messages as spam (PEER_FLOOD)"

Código `5`. Telegram limita una cuenta que ha escrito a demasiadas personas que no son sus contactos. Puede seguir leyendo. Escribe a @SpamBot desde una aplicación de Telegram: te dice hasta cuándo dura. Volver a enviar lo empeora, así que `tg` retiene todos los envíos durante una hora y lo indica; cada nuevo rechazo reinicia la hora. `tg doctor` muestra la retención en `flood.sendBlock`. Cuando @SpamBot diga que el límite ha terminado, `tg flood clear` la levanta, junto con cualquier espera que `tg` recuerde. El rechazo a una cuenta congelada retiene los envíos del mismo modo, hasta la fecha que indica Telegram; `tg doctor --online` activa y levanta esa retención.

## "profile … has sent N messages in the hour …"

Código `8`. Límite por hora del perfil (`sendsPerHour`, 30 por defecto). El error indica cuándo podrá enviar de nuevo. Auméntalo solo si pretendías enviar esa cantidad: `tg config set sendsPerHour <n>`.

## "chat … is not on the recipient list of profile …"

Código `7`. La lista de destinatarios está activa y el chat no figura en ella. Añádelo tú si quieres autorizarlo: `tg recipients add <chat>`. El agente debe detenerse y preguntarte.

## "profile … does not let … write" or "profile … denies …"

Código de salida `5`, antes de enviar nada a Telegram. Los `permissions` del perfil rechazaron la acción: `deny`
bloquea también la lectura y `readonly` bloquea un cambio. El error indica la clave, dónde se configuró y el
comando que permite la acción ([configuration.md](./configuration-reference.md#what-a-profile-may-do)). El agente debe
detenerse y preguntarte, no cambiar el ajuste.

## "… asks before it acts"

Código `7`. El nivel del comando es `ask` y nadie podía responder: falta terminal o se usó `--json` o `--jsonl`. El error indica la opción para aprobar: `--allow-dangerous` para eliminar, `--yes` para otros cambios. Añádela solo si es lo que quieres. El agente debe detenerse y preguntarte.

## "Telegram refused: …"

Telegram rechazó la petición e indicó por qué. Código `5` si la cuenta no tiene permiso; `11` en los demás casos. El nombre después de "refused" es el de Telegram y el JSON lo incluye como `providerError`; nunca se repite lo introducido. Algunos tienen mensajes específicos:

- **"Telegram transcribes only for Premium accounts…"**: código `5`. Usa un modelo local: `tg models audio download parakeet-v3` y después `tg messages transcribe <chat> <id> --local`.
- **"that message is not a voice or video note"**: código `2`; el identificador corresponde a otro tipo de mensaje.
- **"Telegram could not transcribe this voice message"**: código `11`; prueba `--local`.

## "Telegram failed: …"

Código `12`. Fallo de Telegram. `tg` no cambió nada; reintenta pasado un minuto. Si era un envío, comprueba el chat antes de repetirlo.

## "cannot reach Telegram (…)"

Código de salida `10`. No se pudo establecer la conexión o se interrumpió: falta de red, un cortafuegos, un proxy o DNS.
El código entre paréntesis indica la causa (`ECONNREFUSED`, `ENOTFOUND`, `ETIMEDOUT`). Los comandos que responden desde
el almacenamiento funcionan sin red: `tg --offline chats list`. Si Telegram está bloqueado, configura un
proxy ([configuration.md](./configuration-reference.md#through-a-proxy)).

## "the proxy … cannot be reached" or "… refused"

Código `3`. El fallo está en el proxy, no en Telegram: nada llegó a Telegram, así que ni siquiera un envío salió. `tg` se detiene en la primera conexión fallida en lugar de esperar al límite de tiempo.

- **cannot be reached (`ECONNREFUSED`, `ENOTFOUND`, `ETIMEDOUT`)**: el proxy no funciona o su host o puerto son incorrectos.
- **refused: … auth …** o **refused the tunnel (HTTP 407)**: usuario o contraseña incorrectos. Vuelve a configurarlo con `tg config set proxy -`.
- **refused the tunnel (HTTP 403 or 502)**: el proxy no quiere o no puede llegar a Telegram.

`tg doctor` muestra el proxy en uso, de dónde viene (`TG_PROXY` o la configuración) y si la Bot API pasa por él. Para probar sin él, `tg config unset proxy`. Un MTProxy con un secreto incorrecto suele parecer un bloqueo más que un rechazo: limítalo con `--timeout 30s`.

## `outcome_unknown` después de enviar

Código `14`. La conexión se interrumpió después de salir el mensaje, que puede haber llegado. No es éxito ni fracaso. **No lo vuelvas a enviar tal cual.** Repite con el `--send-id` del error; Telegram elimina la segunda copia:

```sh
tg messages send <chat> "<the same text>" --send-id <id from the error>
```

Después de `--at-time`, consulta `tg messages scheduled <chat>`: los envíos programados nunca se repiten.

Fijar, desfijar, reaccionar, marcar como leído, borrar, votar, cerrar encuestas y cambiar carpetas o contactos terminan igual cuando Telegram no responde. El mensaje indica si es seguro repetir. Al crear una carpeta no lo es: mira primero en `tg chats folders list` o puedes acabar con una segunda carpeta.

## Un comando se queda bloqueado

Todos los comandos puntuales cierran la conexión y terminan. Si Telegram no responde, terminan con código `9` y `timeout`. Para establecer tu propio límite y ver dónde se detiene:

```sh
tg --timeout 30s --trace chats list
```

`--timeout` cubre todo el comando, incluido el inicio de sesión, y termina con código `9` después de cerrar la conexión. En `--trace`, una línea `→` sin `←` posterior es una petición sin respuesta: problema de red o Telegram, no de `tg` ([diagnóstico](./diagnostics.md)).

Si imprime la respuesta pero no termina, es un fallo. Cinco segundos después de terminar la tarea, `tg` identifica lo que sigue abierto (`tg: finished, but … stayed open`) y sale; informa del problema incluyendo esa línea. `watch`, `serve` y `mcp` sí están pensados para seguir activos hasta detenerlos.

## Ctrl-C

Código `130`. El comando se detiene y cierra la conexión. Si lo pulsaste durante un envío, el mensaje puede haber llegado: comprueba el chat (`tg messages list <chat> --limit 3`) antes de repetirlo. Un `store fetch` en segundo plano continúa; detenlo con `tg store jobs cancel <job>`.

Una respuesta distinta de `y` a una confirmación termina igual: no se hizo nada.

## "the message store was written by a newer version …"

Código `3`. Otro CLI o un `tg` más reciente actualizó el archivo de forma incompatible con esta versión. Ejecuta `tg upgrade`. No se pierde nada ([archivo local](./archive.md#the-store-and-other-versions)).

## "nothing recorded for profile … yet — run the command once without --offline"

Código `6`. `--offline`, `messages search`, `store status` y `store export` solo consultan el archivo local y este perfil todavía no ha guardado nada. Ejecuta primero un comando en línea, como `tg chats list`.

## `messages search` no encuentra nada

Solo busca lo guardado en este equipo, nunca en Telegram. Vacío significa «no guardado», no «nunca se dijo». Lee el chat (`tg messages list <chat>`) o descarga el historial con `tg store fetch` y busca de nuevo ([archivo local](./archive.md#search)). `tg store check` identifica chats desactualizados.

## Un chat figura como descargado entero, pero faltan mensajes antiguos

Ejecuta de nuevo `tg store fetch <chat>`. Lee por debajo del mensaje más antiguo del archivo local, tanto si el chat se contó como completo como si no, y sigue hasta el primer mensaje del chat; da más margen a `--limit` en un chat largo. Mantén `--page-size` en 100 o menos: Telegram devuelve hasta 100 mensajes por petición.

## "tg serve is already running for profile …"

Código `2`. Solo se admite un `serve` por perfil. `tg server status` indica proceso y hora de inicio; `tg server stop` detiene los iniciados por `server start` o por la unidad.

## `serve` se detuvo por sí solo

`tg server logs` indica por qué. Si Telegram cerró la sesión mientras `serve` funcionaba, termina con código `4` en unos 15 minutos y no se reinicia: ejecuta `tg session start` y después `tg server start`. Si las actualizaciones de Telegram dejaron de llegar por otro motivo, termina con código `12` y systemd lo vuelve a iniciar.

## El servidor en segundo plano no se inicia

`tg server status --json` incluye `stopped` y `unit.exitCode` cuando la última salida normal fue una tras la que la unidad no se reinicia. Con la salida 4, renueva la sesión con `tg session start` y después `tg server start`. `tg server logs` indica por qué. En un servicio, suele deberse al almacén de claves: se inicia antes de que se desbloquee o sin `XDG_RUNTIME_DIR`. Si cambias la ubicación de Node o `tg`, ejecuta `tg server install` de nuevo: la unidad utiliza las rutas de instalación ([archivo local](./archive.md#as-a-service)).

## `npx @leemour/tg-cli` ejecuta una versión anterior

npx conserva lo descargado. Solicita la última: `npx @leemour/tg-cli@latest`.

## Informar de un problema

```sh
tg doctor report           # what a report holds, and what it never holds; writes nothing
tg doctor report create    # write it to a file, and say where to send it
tg doctor report create --run <id>    # about another run; ids from tg runs list
```

`create` escribe `tg-report-<time>.json` en la carpeta actual (o `--output`), legible solo por ti. Contiene versión, entorno, sistema, respuesta de `tg doctor`, última ejecución fallida —operación, duración y código de error de cada petición— y los últimos 20 intentos de envío, solo resultado y longitud. Cada identificador de chat, mensaje o cuenta se sustituye por una etiqueta que no tiene significado fuera del archivo. No contiene texto, títulos, nombres, teléfonos, sesión ni credenciales. Los fallos se guardan automáticamente aunque no uses `--record` ([diagnóstico](./diagnostics.md#a-problem-report)).

Envíalo como nueva incidencia en [GitHub](https://github.com/leemour/tg-cli/issues/new): explica qué hiciste y qué ocurrió y adjunta el archivo. Tanto la incidencia como el archivo son públicos: revísalo antes.

⚠ Nunca adjuntes el directorio de estado, la sesión ni `~/.local/share/cli-messaging/`: contienen tu acceso y tus mensajes.

## Esperas recordadas

El SDK recuerda plazos por operación y chat; un reintento antes de que venzan falla con el código 8 sin hacer otra petición. Los rechazos por cuenta congelada o limitada por spam pueden retener los envíos. `tg flood clear` es mantenimiento del propietario una vez terminada la restricción: borra las esperas y retenciones locales y no cambia nada en Telegram. No tiene herramienta MCP; los agentes no deben levantar una retención solo para reintentar. `doctor --online` comprueba la sesión, el estado de la cuenta y el reloj; sin conexión, doctor no demuestra que la sesión siga activa.
