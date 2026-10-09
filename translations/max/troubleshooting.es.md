---
title: "Solución de problemas"
---

Busca tu síntoma: cada apartado explica lo que aparece y qué hacer.

Si no aparece, empieza por `--trace`, que muestra si la solicitud llegó a MAX y su respuesta sin contenido privado ([Diagnóstico](./diagnostics.md)).

## Por código de salida

| Código | Nombre | Significado habitual |
|---|---|---|
| `1` | `generic_failure` | Comando mal escrito o fallo de `max` |
| `2` | `validation_error` | Un valor o una combinación de opciones que `max` no acepta; un nombre coincide con varios chats |
| `3` | `configuration_error` | `config.json` inválido o almacén actualizado por una versión posterior |
| `4` | `authentication_error` | Sin sesión, revocada o llavero inaccesible |
| `5` | `permission_error` | Solo lectura o acción fuera de `allow` |
| `6` | `not_found` | Chat, mensaje o persona desconocida; copia vacía |
| `7` | `confirmation_required` | Destino fuera de lista o confirmación sin persona disponible |
| `8` | `rate_limited` | Límite horario o espera solicitada por MAX |
| `9` | `timeout` | MAX no respondió o terminó `--timeout` |
| `10` | `network_error` | MAX inaccesible desde aquí |
| `11` | `provider_error` | Rechazo de MAX |
| `12` | `provider_unavailable` | Fallo del servicio MAX |
| `13` | `invalid_response` | Una respuesta que `max` no pudo interpretar |
| `14` | `outcome_unknown` | La conexión se interrumpió después de enviar, o la pasarela de `max bot` devolvió 502, 503 o 504 ante un cambio: el mensaje puede haberse enviado |
| `130` | `cancelled` | Ctrl-C o confirmación rechazada |

## Primero, `max doctor`

```sh
max doctor
```

En `--json`, `store` muestra ruta, esquema y cantidades de chats/mensajes del almacén común. No lo crea ni actualiza. `legacyCache` indica si existe el archivo antiguo; `doctor` muestra su ruta para borrarlo manualmente.

Muestra los requisitos de cualquier comando **sin conectarse a MAX** (salvo que indiques `--online`): si hay un token y de dónde procede; la entrada en el almacén de claves y si las variables de entorno la sustituyen; el número de inicios de sesión y el último; todos los perfiles del ordenador, personales, de bot o ambos; el esquema del almacenamiento compartido; el número de chats y mensajes guardados; la carpeta de ejecuciones; y la versión del cliente web de MAX con la que se identifica `max`, junto con la fecha en que se revisó. Si esa fecha tiene más de 60 días, `max doctor` avisa de que MAX podría dejar de aceptar la versión antigua; actualizar `max` puede ayudar.

**Funciona aunque todo lo demás falle.** Una sesión ausente es un dato, no error; devuelve `0`.

Nunca se imprime el token, solo si existe y de dónde procede.

En bots, `max <имя> doctor` muestra token, chats vistos y rutas de estado, caché, ejecuciones, bots, registro y almacén común.

También muestra el entorno de ejecución de `max` (Node o Bun y su ubicación), el gestor de paquetes usado para instalar, qué comando `max` encontrará un terminal nuevo, si se cargan el almacén de claves y SQLite y si hay un modelo de voz descargado. Si la carpeta del comando `max` no está en `PATH`, `max doctor` imprime los comandos exactos para añadirla: comandos de PowerShell en Windows o una línea `export` en Linux y macOS.

### Comprobación con acceso a MAX

```sh
max doctor --online
```

Un acceso, un chat y el inicio MCP como lo haría el cliente, con lista de herramientas. No envía ni marca leído. Cuenta como acceso, así que no repite ante errores. Un fallo devuelve distinto de `0`.

Si el perfil tiene un token de bot, `--online` también consulta a la Bot API a quién pertenece el token y muestra el nombre y el ID del bot. Si no hay un token personal, no se inicia sesión en MAX.

## No encuentra `max` tras instalar

La instalación terminó, pero el terminal dice que no existe el comando `max`. Puedes averiguar el motivo sin utilizarlo:

```sh
npx @leemour/max-cli doctor
```

`max on PATH` indica si la encuentra; debajo aparece la solución.

**Windows.** npm instala en `%APPDATA%\npm`. Si falta en `PATH`, `max doctor` muestra dos órdenes PowerShell para la ventana actual y futuras. Comprueba:

```powershell
npm prefix -g
$env:Path -split ';'
```

El primer comando muestra la carpeta y el segundo lo que hay actualmente en `PATH`. Si la carpeta está en la lista pero `max` sigue sin encontrarse, cierra y vuelve a abrir el terminal: una ventana abierta antes de instalar Node no ve el nuevo `PATH`.

**PowerShell: «running scripts is disabled on this system».** npm crea `max.ps1` y `npx.ps1`, bloqueados por defecto. Usa `max.cmd`, `npx.cmd` (`npx.cmd @leemour/max-cli doctor`) o permite scripts para tu usuario:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**Linux y macOS.** La carpeta de comandos de npm es `$(npm prefix -g)/bin`. `max doctor` muestra una línea `export PATH=…`; añádela a `~/.zshrc` o `~/.bashrc`.

**Hay otro `max` en `PATH`.** Si otro programa con el mismo nombre aparece antes en `PATH`, `max doctor` muestra su ruta. Ejecuta nuestra herramienta con la ruta completa o coloca su carpeta antes.

## «no session for profile "default"»

```json
{"error":{"code":"authentication_error","message":"no session for profile \"default\" — run `max setup` in a local terminal; agents: read `max skill show`"}}
```

Código `4`: no hay token. No has entrado, usaste **otro perfil** o variables de directorios distintas.

```sh
max setup                  # первый запуск
max personal chats list    # или назвать профиль, в который входили
```

Si el primer inicio se interrumpe, repite `max setup`. Un token caducado requiere volver a iniciar sesión explícitamente: `max session start qr`. El agente debe leer primero `max skill show`.

⚠ Una causa habitual es `MAX_CONFIG_DIR` en una ventana y no otra. Cambia también el llavero. Comprueba `env | grep MAX_`.

## «profile "shop" is a bot»

```json
{"error":{"code":"authentication_error","message":"profile \"shop\" is a bot — its commands are `max shop bot …`; `max shop session start` would add a personal account to it"}}
```

Usaste una orden personal sobre un bot. Sus órdenes contienen `bot`:

```sh
max shop bot chats list
max shop bot messages list -100
```

No hace falta `max shop session start`, salvo que también quieras una cuenta personal con ese nombre. `max shop doctor` indica qué existe.

## «no token found for profile "default", although it has logged in on this machine»

Código de salida `4`. El perfil ya inició sesión en este ordenador, pero no se puede leer el token. Normalmente `max` no puede acceder al almacén de contraseñas: el comando se ejecuta desde cron, por SSH o en otro entorno sin `XDG_RUNTIME_DIR`. **No vuelvas a iniciar sesión**: añadirías otro dispositivo a tu cuenta y el mismo entorno seguiría sin poder leer el token la próxima vez. `max doctor` indica si puede ver el token; consulta la configuración de cron en [recipes.md](./recipes.md).

## «MAX refused this profile's last login for too many attempts»

Código `8`: demasiados accesos. `max` recuerda la negativa y espera, tanto comandos como `max session start` y servidor. Las negativas consecutivas aumentan el plazo: 1 minuto, 5, 30, una hora, 6 horas, un día. Un acceso correcto lo reinicia.

**Espera.** Reintentar antes cuenta y puede prolongar restricciones. Reduce frecuencia programada; `max doctor` muestra el final de la pausa.

Consulta el ritmo de solicitudes, las esperas y los comandos simultáneos en [limits.md](./limits.md).

`max serve` y `max server start` se detienen ante rechazos de autenticación, aunque sí reconectan por fallos de red.

## Responde, pero con otro perfil

Una primera palabra desconocida se interpreta como perfil; una errata puede cambiarlo:

```text
"chat" is not a command, so it was read as a profile name — and no command followed it.
```

Es `chats`, plural. Consulta `max --help`.

## «is not a valid config»

```json
{"error":{"code":"configuration_error","message":"…/config.json is not a valid config:\n  profiles.default.limitt: unknown setting — the known ones are limit, timeoutMs, color, record, keepRunsForDays, readOnly, allow, sendsPerHour, senderColors, serve, mcpTools"}}
```

Código `3`: campo desconocido, normalmente errata. El error muestra ruta en lugar de ignorarlo. Campos válidos en [Configuración](./configuration.md).

## «--limit takes a whole number from 1 upwards, not "abc"»

Código `2`; igual para `--page`. Sin validación, un valor no numérico vaciaría la lista silenciosamente.

## «--all and --page ask for different things; use one or the other»

Código `2`: ambas opciones juntas. Rechaza en vez de elegir y mostrar un resultado engañoso.

## «--before-time takes an ISO 8601 time or 30m, 2h, 1d ago»

Código `2`: valor incorrecto de `--before-time` o `--after-time`. Usa ISO 8601 o tiempo relativo:

```sh
max messages list 0 --before-time 2026-09-20T01:00:00Z
max messages list 0 --before-time 2h
```

Para ID utiliza `--before-id`: contiene el tiempo sin necesitar lectura previa.

## «--at-time takes a time like 2026-09-25T09:00 or a delay like 30m, 2h, 1d»

Código `2`: `--at-time` acepta hora local o retraso en minutos, horas o días, no segundos. Entre un minuto y un año.

## «--timeout takes a duration with a unit — 30s, 2m or 500ms»

Código `2`: `--timeout`, `MAX_TIMEOUT` aceptan `ms`, `s`, `m`. Dos horas se expresan como `120m`.

## Un comando se queda esperando

Conecta pero no recibe respuesta. Al agotar espera devuelve `9`, `timeout`.

```sh
max chats list --trace
```

Una `→` sin `←` indica solicitud enviada sin respuesta: red o MAX.

Hay dos límites distintos:

```sh
max chats list --timeout 30s     # на команду целиком, включая вход
```

`timeoutMs` de [Configuración](./configuration.md) limita **una respuesta**; varias solicitudes multiplican el tiempo. `--timeout` limita todo y devuelve `9`, cerrando la conexión.

Si no hay líneas y no termina, informa del defecto con `--trace`. Imprimir un resultado sin terminar también es un fallo.

## «matches N chats»

```text
"Иван" matches 2 chats — name one by its id:
  123  Иван Петров
  456  Иван и друзья
```

Código `2`: varios chats coinciden. No adivina porque enviar al equivocado no se deshace. Concreta o usa ID.

## «no chat matches»

Código `6`: no existe ese nombre. Un chat personal usa el nombre de la persona; sin contacto conocido puede no tener título. Usa ID de `max chats list`.

## «profile … has sent N messages in the hour …»

Código `8`: límite `sendsPerHour`, por defecto 30. El error indica cuándo repetir. Súbelo solo intencionadamente con `max config set sendsPerHour <n>`.

## «chat … is not on the recipient list of profile …»

Código `7`: destino fuera de la lista. Si procede, añádelo tú con `max <профиль> recipients add <чат>`. El agente debe detenerse y preguntar ([Seguridad](./security.md)).

## `outcome_unknown` después de enviar

Código `14`: **pudo enviarse**. La solicitud salió y no llegó respuesta; no es éxito ni fallo confirmado.

Repite **solo con el mismo `--send-id`** del error; MAX elimina duplicados:

```sh
max messages send 0 "текст" --send-id 1789784741828
```

Sin `--send-id` sería otro mensaje.

`max bot` no tiene `--send-id`: antes de repetir el envío, comprueba en el chat si el mensaje se envió.

## «MAX answered with something we did not expect»

Aviso en stderr mientras **sigue funcionando**. MAX cambió una respuesta del protocolo no oficial.

Si aparecen campos vacíos, puede ser la causa. Envía la línea completa con ruta y tipo esperado, sin contenido.

## Lista vacía de chats

Comprueba si solo estás consultando la copia:

```sh
max chats list --trace     # видны ли запросы к MAX
max contacts sync         # заново получить полный список контактов
```

Si primero hubo chats y después ninguno, es un defecto: informa de él. El siguiente acceso puede recibir solo contactos modificados; el resto se obtiene de la copia local compartida.

## Ctrl-C

Código `130`: se detiene y cierra conexión. Durante un envío pudo salir el mensaje; comprueba `max messages list <чат> --limit 3` antes de repetir.

Rechazar confirmación termina igual, sin cambios.

## «the message store was written by a newer version …»

Código `3`: `tg` o un `max` más reciente actualizó el almacén común. Ejecuta `max upgrade`; no se pierden datos.

## «nothing recorded for profile … yet — run the command once without --offline»

Código `6`. `--offline` utiliza solo la copia local y este perfil todavía no ha guardado nada en ella. Ejecuta primero un comando con conexión, por ejemplo `max chats list`.

## `search messages` no encuentra nada

La búsqueda en todos los chats lee el archivo local; la búsqueda de palabras en un chat concreto también consulta al servidor de MAX. Un resultado vacío no demuestra que el mensaje no exista. Comprueba `coverage.next` en la respuesta de `--json`: ejecuta el comando sugerido o pide permiso y vuelve a buscar. `max store fetch --all --background` inicia la descarga de todos los chats; `max store fetch <чат>` descarga uno ([archive.md](./archive.md), [search.md](./search.md)).

## «max serve is already running for profile …»

Código `2`: solo un `serve` por perfil. `max server status` muestra proceso/fecha; `max server stop` detiene el iniciado por `server start` o servicio.

## El servidor no se inicia en segundo plano

Consulta `max server logs`. En servicios suele ser el llavero cerrado o falta de `XDG_RUNTIME_DIR`. Si moviste Node o `max`, repite `max server install` para actualizar rutas ([Servidor](./archive.md)).

## `npx @leemour/max-cli` instala otra versión

`npx` conserva caché. Usa una versión explícita:

```sh
npx @leemour/max-cli@latest --version
```

## Informar de un problema

```sh
max doctor report          # что попадёт в отчёт и чего в нём не будет
max doctor report create   # записать отчёт в файл и показать, как его отправить
```

`create` escribe `max-report-<время>.json` en la carpeta actual (permisos `0600`). Contiene la versión, el entorno y el sistema, la misma información que `max doctor`, la última ejecución fallida y las últimas 20 operaciones de escritura. No contiene textos de mensajes, nombres de chats o personas, números de teléfono ni el token. Los ID de chats y mensajes se sustituyen por etiquetas: un chat tiene la misma etiqueta dentro de un informe y otra distinta en el siguiente. Las ejecuciones fallidas se guardan automáticamente, incluso sin `--record` ([diagnostics.md](./diagnostics.md)). Para usar otra ejecución, pasa `--run <id>`; `max runs list` muestra los ID.

Después, el comando imprime un enlace para abrir una incidencia en [github.com/leemour/max-cli/issues](https://github.com/leemour/max-cli/issues), con el título y un borrador del texto ya rellenados. Necesitas una cuenta de GitHub. Arrastra el archivo del informe al campo de texto, describe qué hiciste y qué ocurrió y pulsa «Submit new issue».

Las incidencias de GitHub y los archivos adjuntos son públicos.

⚠ No adjuntes `~/.cache/max-cli/` ni `~/.local/share/cli-messaging/`: contienen mensajes.

## Límite recordado

Si el mensajero indica cuánto debes esperar, `max` recuerda ese tiempo para la operación y el chat. Un reintento antes de que termine devuelve inmediatamente el código `8` sin contactar con el mensajero. Actualmente MAX no indica esos tiempos, por lo que no se registra un bloqueo para una cuenta personal de MAX ni se retienen los envíos. Una pausa de inicio de sesión de `max` protege frente a los inicios frecuentes; `max doctor` muestra su duración.

Las esperas recordadas y las retenciones de envíos aparecen en `max server status` (`flood`). `max flood
clear` las olvida sin cambiar nada en MAX. Ejecútalo solo cuando MAX ya no limite la cuenta. MCP no ofrece este comando: el agente no debe quitar un límite para reintentar.
