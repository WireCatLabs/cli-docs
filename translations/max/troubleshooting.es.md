---
title: "Solución de problemas"
---

<a id="comprobación-con-acceso-a-max" />
<a id="no-encuentra-max-tras-instalar" />
<a id="responde-pero-con-otro-perfil" />
<a id="un-comando-se-queda-esperando" />
<a id="lista-vacía-de-chats" />
<a id="npx-leemourmax-cli-instala-otra-versión" />
<a id="límite-recordado" />
<a id="проверка-со-входом-в-max" />

Esta página es necesaria cuando `max` mostró un error o no hizo lo que esperaba. Busque el mensaje que ve, o su código de retorno, y la página le dirá qué significa y qué hacer a continuación. La mayoría de las veces, un comando es suficiente.

Palabras que aparecen aquí:

- **Código de retorno** - el número con el que termina el comando: `0` - funcionó, cualquier otro número indica el tipo de falla. Lo leen scripts y agentes de IA; La siguiente tabla conduce de cada código a la sección.
- **`max doctor`** comprueba la instalación sin conectarse a MAX. Ejecútelo primero.
- **`--trace`** muestra cada solicitud a MAX mientras se ejecuta, sin texto de mensaje ([diagnóstico](./diagnostics.md)).

En la salida de `--json`, cada error es una línea en stderr, `{"error":{"code":"…","message":"…"}}`, y el código de retorno dice lo mismo que `code`. Todos los códigos también se encuentran en [directorio de códigos de retorno](./commands.md#коды-возврата).

## Por código de salida

|Código|Nombre|¿Qué suele significar?|Dónde|
|---|---|---|---|
| `1` | `generic_failure` |un error tipográfico en el nombre del comando o un fallo en el propio `max`|[perfil incorrecto](#команда-отвечает-но-профиль-не-тот), [informe](#как-сообщить-о-проблеме)|
| `2` | `validation_error` |un valor o combinación de opciones que `max` no acepta; el nombre se adapta a varios chats|[valores](#--limit-takes-a-whole-number-from-1-upwards-not-abc), [varios chats](#matches-n-chats)|
| `3` | `configuration_error` |error en `config.json`, o una versión más reciente registró el archivo local|[configuración](#is-not-a-valid-config), [archivo local](#the-message-store-was-written-by-a-newer-version-)|
| `4` | `authentication_error` |no hay inicio de sesión, la sesión finalizó o el llavero no está disponible|[sin sesión](#no-session-for-profile-default), [token ilegible](#no-token-found-for-profile-default-although-it-has-logged-in-on-this-machine)|
| `5` | `permission_error` |Acción prohibida del perfil `permissions`|[no permitido](#profile--does-not-let--write-или-profile--denies-)|
| `6` | `not_found` |no existe tal chat, mensaje o persona; el archivo local todavía está vacía|[sin chat](#no-chat-matches), [nada guardado](#nothing-recorded-for-profile--yet--run-the-command-once-without---offline)|
| `7` | `confirmation_required` |el chat no está en la lista de destinatarios, o la acción está esperando confirmación y no hay nadie para responder|[lista de destinatarios](#chat--is-not-on-the-recipient-list-of-profile-), [pregunta](#-asks-before-it-acts)|
| `8` | `rate_limited` |límite de perfil por hora, o MAX pide esperar|[límite de horas](#profile--has-sent-n-messages-in-the-hour-), [demasiadas entradas](#max-refused-this-profiles-last-login-for-too-many-attempts)|
| `9` | `timeout` |MAX no respondió a tiempo o `--timeout` detuvo el comando|[el comando se bloquea](#команда-висит)|
| `10` | `network_error` |MAX no está disponible desde aquí|[el comando se bloquea](#команда-висит)|
| `11` | `provider_error` |MAX rechazó la solicitud|[informe](#как-сообщить-о-проблеме)|
| `12` | `provider_unavailable` |fallo en el lado MAX|[informe](#как-сообщить-о-проблеме)|
| `13` | `invalid_response` |respuesta que `max` no pudo leer|[respuesta inesperada](#max-answered-with-something-we-did-not-expect)|
| `14` | `outcome_unknown` |la conexión se perdió después del envío, o la puerta de enlace `max bot` respondió con 502, 503 o 504 al cambio: el mensaje pudo haber sido enviado|[resultado desconocido](#outcome_unknown-после-отправки)|
| `130` | `cancelled` |presionó Ctrl-C o respondió “no” a una pregunta| [Ctrl-C](#ctrl-c) |

## Primero, `max doctor`

```sh
max doctor
```

No se conecta a ningún lado y muestra de qué depende cada comando: versión y entorno, archivo de configuración, token y entrada en el llavero (y si las variables `MAX_*_DIR` lo han movido), almacenamiento compartido, directorio de inicio y pausa de inicio de sesión, si corresponde. **Él responde incluso cuando todo lo demás está roto**; ahí es cuando lo lanzan. Un perfil sin sesión no es un error, sino una línea en la respuesta; el código de retorno sigue siendo `0`. El token nunca se imprime, sólo "es" y "de".

```sh
max doctor --online
```

`--online` también inicia sesión en MAX una vez, lee un chat e inicia el servidor MCP. No envía nada y no marca nada como leído. La entrada cuenta para el límite MAX de las entradas, por lo que si hay un error, no se repite ([como se muestra en `max doctor`](./diagnostics.md#проверить-установку-max-doctor)).

## Instalación

### `max` no se encuentra después de la instalación

La instalación terminó, pero el terminal dice que no existe el comando `max`. Puedes averiguar el motivo sin utilizarlo:

```sh
npx @wirecat/max-cli doctor
```

`max on PATH` indica si la encuentra; debajo aparece la solución.

**Windows.** npm instala en `%APPDATA%\npm`. Si falta en `PATH`, `max doctor` muestra dos órdenes PowerShell para la ventana actual y futuras. Comprueba:

```powershell
npm prefix -g
$env:Path -split ';'
```

El primer comando muestra la carpeta y el segundo lo que hay actualmente en `PATH`. Si la carpeta está en la lista pero `max` sigue sin encontrarse, cierra y vuelve a abrir el terminal: una ventana abierta antes de instalar Node no ve el nuevo `PATH`.

**PowerShell: «running scripts is disabled on this system».** npm crea `max.ps1` y `npx.ps1`, bloqueados por defecto. Usa `max.cmd`, `npx.cmd` (`npx.cmd @wirecat/max-cli doctor`) o permite scripts para tu usuario:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**Linux y macOS.** La carpeta de comandos de npm es `$(npm prefix -g)/bin`. `max doctor` muestra una línea `export PATH=…`; añádela a `~/.zshrc` o `~/.bashrc`.

**Hay otro `max` en `PATH`.** Si otro programa con el mismo nombre aparece antes en `PATH`, `max doctor` muestra su ruta. Ejecuta nuestra herramienta con la ruta completa o coloca su carpeta antes.

<a id="npx-leemourmax-cli-instala-la-versión-incorrecta" />

### `npx @wirecat/max-cli` instala la versión incorrecta

`npx` conserva caché. Usa una versión explícita:

```sh
npx @wirecat/max-cli@latest --version
```

## Inicio de sesión y perfiles

### «no session for profile "default"»

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

### «profile "shop" is a bot»

```json
{"error":{"code":"authentication_error","message":"profile \"shop\" is a bot — its commands are `max shop bot …`; `max shop session start` would add a personal account to it"}}
```

Usaste una orden personal sobre un bot. Sus órdenes contienen `bot`:

```sh
max shop bot chats list
max shop bot messages list -100
```

No hace falta `max shop session start`, salvo que también quieras una cuenta personal con ese nombre. `max shop doctor` indica qué existe.

### «no token found for profile "default", although it has logged in on this machine»

Código de retorno `4`. Ya se ha iniciado sesión en el perfil de esta computadora, pero el token no se puede leer. Casi siempre se trata de un almacenamiento de contraseña al que `max` no ha llegado: el comando se lanzó desde cron, vía ssh o desde otro entorno sin `XDG_RUNTIME_DIR`. **No vuelvas a iniciar sesión**: esto agregará otro dispositivo a tu cuenta y la próxima vez desde el mismo entorno, el token no se volverá a leer. `max doctor` mostrará si ve el token; cómo configurar cron - en la sección [ejecutar según lo programado](./recipes.md#как-запускать-по-расписанию).

### «MAX refused this profile's last login for too many attempts»

Código `8`: demasiados accesos. `max` recuerda la negativa y espera, tanto comandos como `max session start` y servidor. Las negativas consecutivas aumentan el plazo: 1 minuto, 5, 30, una hora, 6 horas, un día. Un acceso correcto lo reinicia.

**Espera.** Reintentar antes cuenta y puede prolongar restricciones. Reduce frecuencia programada; `max doctor` muestra el final de la pausa.

Cómo se estructura el ritmo de las solicitudes, esperas y comandos paralelos - en [límites y esperas](./limits.md).

`max serve` y `max server start` se detienen ante rechazos de autenticación, aunque sí reconectan por fallos de red.

### El comando responde, pero el perfil está mal

Una primera palabra desconocida se interpreta como perfil; una errata puede cambiarlo:

```text
"chat" is not a command, so it was read as a profile name — and no command followed it.
```

Es `chats`, plural. Consulta `max --help`.

## Configuraciones y valores de opciones

### «is not a valid config»

```json
{"error":{"code":"configuration_error","message":"…/config.json is not a valid config:\n  profiles.default.limitt: unknown setting — the known ones are limit, timeoutMs, color, record, keepRunsForDays, readOnly, allow, sendsPerHour, senderColors, serve, mcpTools"}}
```

Código `3`. En un archivo de configuración, un campo que no está en el esquema casi siempre es un error tipográfico y el mensaje indica su ruta. Rechazado a propósito: un campo silenciosamente ignorado vale medio día de desconcierto. Todos los campos están en [referencia de configuración](./configuration-reference.md).

### «--limit takes a whole number from 1 upwards, not "abc"»

Código `2`; igual para `--page`. Sin validación, un valor no numérico vaciaría la lista silenciosamente.

### «--before-time takes an ISO 8601 time or 30m, 2h, 1d ago»

Código `2`: valor incorrecto de `--before-time` o `--after-time`. Usa ISO 8601 o tiempo relativo:

```sh
max messages list 0 --before-time 2026-09-20T01:00:00Z
max messages list 0 --before-time 2h
```

Para ID utiliza `--before-id`: contiene el tiempo sin necesitar lectura previa.

### «--at-time takes a time like 2026-09-25T09:00 or a delay like 30m, 2h, 1d»

Código `2`: `--at-time` acepta hora local o retraso en minutos, horas o días, no segundos. Entre un minuto y un año.

### «--timeout takes a duration with a unit — 30s, 2m or 500ms»

Código `2`: `--timeout`, `MAX_TIMEOUT` aceptan `ms`, `s`, `m`. Dos horas se expresan como `120m`.

### «--all and --page ask for different things; use one or the other»

Código `2`: ambas opciones juntas. Rechaza en vez de elegir y mostrar un resultado engañoso.

## Búsqueda de chat

### «matches N chats»

```text
"Иван" matches 2 chats — name one by its id:
  123  Иван Петров
  456  Иван и друзья
```

Código `2`: varios chats coinciden. No adivina porque enviar al equivocado no se deshace. Concreta o usa ID.

### «no chat matches»

Código `6`: no existe ese nombre. Un chat personal usa el nombre de la persona; sin contacto conocido puede no tener título. Usa ID de `max chats list`.

## Límites y derechos

### «profile … has sent N messages in the hour …»

Código `8`: límite `sendsPerHour`, por defecto 30. El error indica cuándo repetir. Súbelo solo intencionadamente con `max config set sendsPerHour <n>`.

### «chat … is not on the recipient list of profile …»

Código `7`. El perfil tiene habilitada una lista de destinatarios, pero este chat no está en él. Si es posible chatear, agréguelo usted mismo: `max <профиль> recipients add <чат>`. El agente aquí debería detenerse y preguntarle ([protección contra misdirect](./security.md#защита-от-отправки-не-туда)).

### «profile … does not let … write» o «profile … denies …»

Código `5`, antes de que nada pasara a MAX. El perfil `permissions` fue rechazado: `deny` prohíbe la lectura, `readonly` prohíbe la modificación. El error dice cuál es la clave, dónde se especifica y qué comando la resolverá ([permissions](./configuration-reference.md#права-доступа)). El agente debería detenerse y preguntarle, no cambiar la configuración.

### «… asks before it acts»

Código `7`. El nivel de comando es `ask`, pero no hay nadie que responda: no hay terminal, o el comando se lanzó desde `--json` o `--jsonl`. El error nombra una bandera que responde "sí": `--allow-dangerous` para eliminación, `--yes` para cualquier otro cambio. Añádelo sólo si realmente lo deseas. El agente debería detenerse y preguntarle.

### Límite guardado

Si el servicio de mensajería indica cuánto debes esperar, `max` recuerda ese tiempo para la operación y el chat. Un reintento antes de que termine devuelve inmediatamente el código `8` sin contactar con el servicio de mensajería. Actualmente MAX no indica esos tiempos, por lo que no se registra un bloqueo para una cuenta personal de MAX ni se retienen los envíos. Una pausa de inicio de sesión de `max` protege frente a los inicios frecuentes; `max doctor` muestra su duración.

Las esperas recordadas y las retenciones de envíos aparecen en `max server status` (`flood`). `max flood
clear` las olvida sin cambiar nada en MAX. Ejecútalo solo cuando MAX ya no limite la cuenta. MCP no ofrece este comando: el agente no debe quitar un límite para reintentar.

## MAX y red

### «MAX answered with something we did not expect»

Aviso en stderr mientras **sigue funcionando**. MAX cambió una respuesta del protocolo no oficial.

Si aparecen campos vacíos, puede ser la causa. Envía la línea completa con ruta y tipo esperado, sin contenido.

### El comando se bloquea

Conecta pero no recibe respuesta. Al agotar espera devuelve `9`, `timeout`.

```sh
max chats list --trace
```

Si la línea `→` sin el par `←` es visible, la solicitud se fue y no regresó: esta es una red o MAX, no un programa ([cómo leer `--trace`](./diagnostics.md#показать---trace)).

Hay dos límites distintos:

```sh
max chats list --timeout 30s     # на команду целиком, включая вход
```

`timeoutMs` de [Configuración](./configuration.md) limita **una respuesta**; varias solicitudes multiplican el tiempo. `--timeout` limita todo y devuelve `9`, cerrando la conexión.

Si no hay líneas y no termina, informa del defecto con `--trace`. Imprimir un resultado sin terminar también es un fallo.

## Después de enviar

### `outcome_unknown` después de enviar

Código `14`: **pudo enviarse**. La solicitud salió y no llegó respuesta; no es éxito ni fallo confirmado.

Repite **solo con el mismo `--send-id`** del error; MAX elimina duplicados:

```sh
max messages send 0 "текст" --send-id 1789784741828
```

Sin `--send-id` sería otro mensaje.

`max bot` no tiene `--send-id`: antes de repetir el envío, comprueba en el chat si el mensaje se envió.

### Ctrl-C

Código `130`: se detiene y cierra conexión. Durante un envío pudo salir el mensaje; comprueba `max messages list <чат> --limit 3` antes de repetir.

Rechazar confirmación termina igual, sin cambios.

## Copia y búsqueda local

### «the message store was written by a newer version …»

Código `3`: `tg` o un `max` más reciente actualizó el almacén común. Ejecuta `max upgrade`; no se pierden datos.

### «nothing recorded for profile … yet — run the command once without --offline»

Código `6`. `--offline` utiliza solo el archivo local y este perfil todavía no ha guardado nada en ella. Ejecuta primero un comando con conexión, por ejemplo `max chats list`.

### `search messages` no encuentra nada

Buscar todos los chats lee el archivo local; La búsqueda de palabras en un chat con nombre también solicita al servidor MAX. Una respuesta vacía no prueba que no haya mensaje. Consulte `coverage.next` en la respuesta de `--json`: ejecute el comando solicitado o solicite permiso, luego busque nuevamente. `max store fetch --all --background` comienza a descargar todos los chats; `max store fetch <чат>` - uno ([historial de descargas](./archive.md#скачать-историю), [preparar archivo para buscar](./search.md#сначала-подготовьте-архив)).

### Lista de chat vacía

Comprueba si solo estás consultando la copia:

```sh
max chats list --trace     # видны ли запросы к MAX
max contacts sync         # заново получить полный список контактов
```

Si primero hubo chats y después ninguno, es un defecto: informa de él. El siguiente acceso puede recibir solo contactos modificados; el resto se obtiene de el archivo local compartida.

## Servidor en segundo plano

### «max serve is already running for profile …»

Código `2`: solo un `serve` por perfil. `max server status` muestra proceso/fecha; `max server stop` detiene el iniciado por `server start` o servicio.

### El servidor no se inicia en segundo plano.

El motivo lo mostrará `max server logs`. El motivo habitual del servicio es el llavero: el servicio comienza antes de que se abra el llavero, o sin `XDG_RUNTIME_DIR`. Si transfirió Node o `max`, ejecute `max server install` nuevamente: el servicio ejecuta las rutas con las que se instaló ([servidor en segundo plano](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch)).

## Informar de un problema

```sh
max doctor report          # что попадёт в отчёт и чего в нём не будет
max doctor report create   # записать отчёт в файл и показать, как его отправить
```

`create` escribe el archivo `max-report-<время>.json` en el directorio actual (derechos `0600`). Contiene la versión, entorno y sistema, lo mismo que muestra `max doctor`, la última ejecución que terminó en error y las últimas 20 acciones de registro. No contiene mensajes de texto, nombres de chat, nombres, números de teléfono ni tokens. Los números de chat y mensaje se reemplazan con etiquetas: dentro de un informe, la etiqueta de un chat es la misma, pero en el siguiente informe es diferente. Un inicio que finaliza con un error se guarda solo, incluso sin `--record` ([ejecución fallido](./diagnostics.md#неудачный-запуск-сохраняется-всегда)). Sobre otro ejecución: `--run <id>`, los números mostrados por `max runs list`.

Después, el comando imprime un enlace para abrir una incidencia en [github.com/WireCatLabs/max-cli/issues](https://github.com/WireCatLabs/max-cli/issues), con el título y un borrador del texto ya rellenados. Necesitas una cuenta de GitHub. Arrastral archivo del informe al campo de texto, describe qué hiciste y qué ocurrió y pulsa «Submit new issue».

Las incidencias de GitHub y los archivos adjuntos son públicos.

⚠ No adjuntes `~/.cache/max-cli/` ni `~/.local/share/cli-messaging/`: contienen mensajes.
