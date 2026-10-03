---
title: "Solución de problemas"
---

Busca tu síntoma: cada apartado explica lo que aparece y qué hacer.

Si no aparece, empieza por `--trace`, que muestra si la solicitud llegó a MAX y su respuesta sin contenido privado ([Diagnóstico](./diagnostics.md)).

## Por código de salida

| Código | Nombre | Significado habitual |
|---|---|---|
| `1` | `generic_failure` | Comando mal escrito o fallo de `max` |
| `2` | `validation_error` | Valor/combinación inválida o nombre ambiguo |
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
| `13` | `invalid_response` | Respuesta no interpretable |
| `14` | `outcome_unknown` | Conexión perdida tras enviar o escritura del bot con 502/503/504; pudo ejecutarse |
| `130` | `cancelled` | Ctrl-C o confirmación rechazada |

## Primero, `max doctor`

```sh
max doctor
```

En `--json`, `store` muestra ruta, esquema y cantidades de chats/mensajes del almacén común. No lo crea ni actualiza. `legacyCache` indica si existe el archivo antiguo; `doctor` muestra su ruta para borrarlo manualmente.

**No conecta con MAX**, salvo `--online`. Informa de token y origen, entrada del llavero y variables que la cambian, número/fecha de accesos, todos los perfiles personales/bots, esquema y cantidades del almacén, directorio de ejecuciones y versión web MAX emulada con fecha de revisión. Pasados 60 días avisa: MAX podría rechazarla y actualizar `max` puede ayudar.

**Funciona aunque todo lo demás falle.** Una sesión ausente es un dato, no error; devuelve `0`.

Nunca imprime el token, solo presencia y origen.

En bots, `max <имя> doctor` muestra token, chats vistos y rutas de estado, caché, ejecuciones, bots, registro y almacén común.

También muestra Node/Bun y ruta, gestor de instalación, qué `max` encuentra un terminal nuevo, carga del llavero/SQLite y modelo de voz. Si falta el directorio en `PATH`, imprime soluciones exactas PowerShell o `export`.

### Comprobación con acceso a MAX

```sh
max doctor --online
```

Un acceso, un chat y el inicio MCP como lo haría el cliente, con lista de herramientas. No envía ni marca leído. Cuenta como acceso, así que no repite ante errores. Un fallo devuelve distinto de `0`.

Con token de bot consulta propietario, nombre e ID. Sin token personal no inicia acceso personal.

## No encuentra `max` tras instalar

Puedes diagnosticar sin tener la orden accesible:

```sh
npx @leemour/max-cli doctor
```

`max on PATH` indica si la encuentra; debajo aparece la solución.

**Windows.** npm instala en `%APPDATA%\npm`. Si falta en `PATH`, `max doctor` muestra dos órdenes PowerShell para la ventana actual y futuras. Comprueba:

```powershell
npm prefix -g
$env:Path -split ';'
```

La primera muestra directorio; la segunda `PATH`. Si está pero no encuentra `max`, reabre el terminal: una ventana anterior a instalar Node no conoce el nuevo entorno.

**PowerShell: «running scripts is disabled on this system».** npm crea `max.ps1` y `npx.ps1`, bloqueados por defecto. Usa `max.cmd`, `npx.cmd` (`npx.cmd @leemour/max-cli doctor`) o permite scripts para tu usuario:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**Linux y macOS.** El directorio es `$(npm prefix -g)/bin`. Añade el `export PATH=…` de doctor a `~/.zshrc` o `~/.bashrc`.

**Otro `max` en `PATH`.** Doctor muestra su ruta. Usa la completa del nuestro o adelanta su directorio.

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

Código `4`: el perfil entró antes, pero no puede leer el token, normalmente por llavero inaccesible desde cron/SSH sin `XDG_RUNTIME_DIR`. **No vuelvas a entrar**: añade otro dispositivo sin solucionar el entorno. Comprueba con `max doctor`; configura cron según [Recetas](./recipes.md).

## «MAX refused this profile's last login for too many attempts»

Código `8`: demasiados accesos. `max` recuerda la negativa y espera, tanto comandos como `max session start` y servidor. Las negativas consecutivas aumentan el plazo: 1 minuto, 5, 30, una hora, 6 horas, un día. Un acceso correcto lo reinicia.

**Espera.** Reintentar antes cuenta y puede prolongar restricciones. Reduce frecuencia programada; `max doctor` muestra el final de la pausa.

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

`max bot` no dispone de esa opción; comprueba el chat antes de repetir.

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

Código `6`: `--offline` y `messages search` solo consultan datos locales aún vacíos. Ejecuta primero `max chats list` con conexión.

## `messages search` no encuentra nada

Vacío significa «no guardado», no «nunca escrito». Lee con `max messages list <чат>` o descarga `max store fetch <чат>` y repite ([Copia local](./archive.md)).

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

`create` escribe `max-report-<время>.json` en el directorio actual, permisos `0600`: versión, entorno/sistema, datos de doctor, último fallo y últimas 20 escrituras. No contiene texto, títulos, nombres, teléfonos ni token. Los IDs se sustituyen por etiquetas estables dentro del informe, distintas en el siguiente. Fallos se guardan sin `--record` ([Diagnóstico](./diagnostics.md)). Elige otra ejecución con `--run <id>`; IDs en `max runs list`.

La orden imprime enlace para una [incidencia de GitHub](https://github.com/leemour/max-cli/issues), con título y texto preparados. Necesitas cuenta GitHub. Arrastra el informe al texto, explica lo ocurrido y pulsa «Submit new issue».

Incidencias y adjuntos son públicos.

⚠ No adjuntes `~/.cache/max-cli/` ni `~/.local/share/cli-messaging/`: contienen mensajes.
