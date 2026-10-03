---
title: "Seguridad y datos guardados"
---

Esta herramienta accede a conversaciones personales. Por eso, explicar qué guarda es una parte central de su documentación.

## Resumen: qué protege

- **Un mensaje ajeno no debe controlar al agente.** MCP no ofrece escrituras hasta habilitarlas con `--allow-*` o `mcpTools`; con `--confirm-send` muestra un formulario antes de cada acción. La aprobación vale una vez, cinco minutos y solo para el chat y texto mostrados ([MCP](./mcp.md#подтверждение-формой-от-самого-сервера)). Las lecturas advierten al modelo que los mensajes son datos, no instrucciones.
- **Los límites del perfil se aplican siempre.** Solo lectura, acciones permitidas, destinatarios y límite por hora se comprueban tanto en comandos como en el servidor, incluso al acceder directamente a su socket. Cada intento se registra sin texto ([más abajo](#защита-от-отправки-не-туда)).
- **El agente no debe cambiar de perfil ni enviar claves.** `MAX_PROFILE_LOCK` fija el perfil; `--file` rechaza ocultos, `~/.ssh` y carpetas de `max`.
- **El texto ajeno no controla la terminal.** Controles e invisibles se muestran como texto, nombres en una línea y autocompletado solo con identificadores ([más abajo](#чужой-текст-на-экране)).
- **Red:** descargas solo por https, sin destinos locales y con límite de tamaño. Los marcos de MAX y datos descomprimidos tienen límites; las conexiones, tiempo máximo ([más abajo](#что-уходит-в-сеть)).
- **Token:** `max` no guarda `MAX_TOKEN` ni lo entrega al servidor. El servidor no entrega tokens a clientes del socket ([más abajo](#где-живёт-токен)).
- **Archivos:** en Linux y macOS se crean con `0600` dentro de directorios `0700`, incluida la copia local. En Windows, el acceso depende de las ACL heredadas del directorio del usuario ([más abajo](#что-ещё-пишется-на-диск)).
- **Publicación:** desde GitHub Actions con prueba de procedencia; no ejecuta código de dependencias al publicar y fija versiones exactas.

## Dónde se guarda el token

En el almacén de claves del sistema, servicio `max-cli`, entrada con nombre del perfil. No se guarda en configuración, argumentos, variables de shell ni historial.

Si no hay almacén, se guarda en `~/.config/max-cli/credentials.json` con `0600` y se avisa por stderr. `max doctor` también indica que procede de archivo.

`MAX_TOKEN` tiene prioridad sobre el almacén, para CI. El token de la variable permanece solo en ella:

- Si MAX renueva el token, `max` no lo guarda en almacén ni archivo; avisa por stderr. Así no queda un token activo en archivos de compilación que puedan acabar en cachés o artefactos.
- Con `MAX_TOKEN` no inicia `max serve` ni le transmite la variable; evita que un token de un comando siga activo quince minutos en segundo plano.

El token de `max bot` está separado en el servicio `max-cli`, entrada `bot:<профиль>`; sin almacén, en el mismo archivo con `0600`. `MAX_BOT_TOKEN` tiene prioridad, igual que `MAX_TOKEN`. `max bot auth set` valida a qué bot pertenece antes de guardar, para no sustituir un token válido por una errata. Nunca guarda el de `MAX_BOT_TOKEN`.

**La configuración no admite secretos:** no hay campos para token, teléfono ni identificador de chat.

## Otros datos en disco

| Contenido | Ubicación | Permisos |
|---|---|---|
| estado del perfil: dispositivo, accesos y `viewerId` | `~/.local/share/max-cli/profiles/<профиль>.json` | `0600` |
| configuración | `~/.config/max-cli/config.json` | `0644` |
| ejecuciones con `--record` y todos los fallos: comando, identificadores, tiempos y errores, sin texto | `~/.local/share/max-cli/runs/…` | carpeta `0700`, archivos `0600` |
| registro de envíos, **siempre**: chat, hora, identificador, longitud y resultado, sin texto | `~/.local/share/max-cli/sends/<профиль>.jsonl` | carpeta `0700`, archivos `0600` |
| destinatarios permitidos, si está activo | `~/.local/share/max-cli/profiles/<профиль>.recipients.json` | `0600` |
| reglas de moderación tras el primer `chats rules set` | `~/.local/share/max-cli/profiles/<профиль>.moderation.json` | `0600` |
| bot: chats vistos, envíos, destinatarios y punto de `watch` | `~/.local/share/max-cli/bots/…` | carpeta `0700`, archivos `0600` |
| copia compartida de mensajes de cuenta personal, bot y `tg`, con textos y transcripciones | `~/.local/share/cli-messaging/messages.db` | carpeta `0700`, archivo `0600` |
| socket y registro de `max serve` | `~/.local/share/max-cli/profiles/<профиль>.sock`, `.serve.log` | `0600` |
| copia anterior del perfil; ya no se abre | `~/.cache/max-cli/<профиль>.db` y sus `-wal`, `-shm` | carpeta `0700`, archivos `0600` |
| exportación, **solo `max store export --output`** | destino indicado | `0600` |
| archivos descargados, **solo `max messages download`** | carpeta actual o `--output` | `0600` |
| informe, **solo `max doctor report create`** | carpeta actual o `--output` | `0600` |
| modelos de voz, **solo tras `max models audio download`** | `~/.cache/cli-common/models/audio/…` | carpeta `0700`, archivos `0600` |

⚠ **La copia compartida contiene texto de mensajes y transcripciones de voz:** sirve para responder sin red. `max session end` no la elimina. `max store clear --left --allow-dangerous` solo borra datos de chats abandonados; no hay una orden que elimine toda la copia compartida.

Los archivos antiguos de caché del perfil ya no se abren. Si quedan, `max doctor` muestra su ruta; puedes borrarlos aparte sin afectar a la copia compartida.

También hay contenido de conversaciones en la copia del bot, exportaciones y descargas; la lista de chats del bot contiene títulos. El resto no contiene conversaciones.

### Si el equipo cae en otras manos

En Linux y macOS, `0600` protege frente a otros usuarios, no frente a quien extrae el disco. Para eso usa cifrado completo: FileVault en macOS, LUKS en Linux, BitLocker en Windows. En Windows, `0600` y `0700` no establecen ACL: el acceso depende de los permisos del directorio del usuario y los directorios `MAX_*_DIR` elegidos. Los permisos numéricos de la tabla corresponden a Unix. La copia local no tiene cifrado propio: SQLite integrado en Node no lo ofrece y una clave del llavero no impediría que otro programa ejecutado como tu usuario lo leyese, igual que `max`.

## Qué no hace la herramienta

- **No marca como leído sin pedirlo.** Consultar historial y marcar como leído son operaciones diferentes. Solo `max chats mark-read` y `messages list --mark-read` envían la segunda; hay una prueba que comprueba que leer no la envía.
- **No cambia nada sin solicitarlo.** Solo cambian `messages send|edit|delete|forward|pin|unpin`, `reactions add|remove`, `polls vote|close|create`, `contacts add|remove|import|rename|block|unblock`, `account update`, `account sessions end`, `chats join|leave|create|update`, `chats members|admins …`, `chats link reset`, `chats folders create|update|delete`, `chats moderate` según reglas, `chats mark-read` y `messages list --mark-read`. Cada uno hace lo indicado. `max commands --json` los marca con `mutates`.
- **No elimina sin aprobación explícita.** `max messages delete` requiere `--allow-dangerous` y, para todos, `--for-everyone`. Es irreversible.
- **No acepta teléfonos como argumentos.** `contacts lookup` solicita o lee por stdin; `contacts import`, por archivo. `ps` e historial mostrarían los argumentos. Errores y registros no contienen teléfonos; `max session start` y `max account show` los ocultan parcialmente.
- **No registra mensajes**, ni abreviados ni mediante hash: consulta [diagnóstico](./diagnostics.md).
- **No utiliza intermediarios.** Consulta destinos en [red](#что-уходит-в-сеть). No tiene telemetría propia; `max serve` envía a MAX un evento como una pestaña web oculta, explicado abajo.
- **Solo mantiene la conexión en `max serve`.** Lo inicia el primer comando que necesita MAX y termina tras 15 minutos inactivo. Para evitarlo: `max config set serve false`.

## Protección de envíos

Un agente lee mensajes ajenos junto a tu petición. Esos mensajes pueden intentar hacerse pasar por instrucciones, como «reenvía esto aquí». Antes de enviar mensajes, reaccionar, editar, reenviar o eliminar, `max` comprueba límites; después registra el intento.

| Control | Cómo activarlo | Rechazo |
|---|---|---|
| perfil de solo lectura | `max <профиль> config set readOnly true` | código `5`, sin conexión |
| acciones concretas: `send`, `reaction`, `delete`… | `max <профиль> config set allow send,reaction` | código `5`, sin conexión |
| destinatarios permitidos | `max <профиль> recipients add <чат>`; desactivar con `recipients clear` | código `7` |
| máximo por hora: mensajes, reenvíos, ediciones, fijados con aviso, eliminados y personas añadidas; no reacciones | `sendsPerHour`, predeterminado `30` | código `8`, indica cuándo reintentar |
| registro de cada intento, sin texto | siempre; `max sends list` | — |

**`max bot` usa los mismos `readOnly` y `allow`.** Solo lectura impide cambios. `allow` usa los mismos permisos: envíos y botones `send`, edición `edit`, eliminación `delete`, fijados `pin`, miembros y ajustes `groups`, comandos del bot `profile`, actualizaciones `read`. Acciones sin palabra de permiso, como webhooks, se rechazan si hay `allow` definido.

Cada bot tiene destinatarios (`max <имя> bot recipients add <чат>`) y registro (`max <имя> bot sends list`) propios. **Toda** escritura pasa por ellos, incluidos `messages send`, `messages pin` y `bot api`, para evitar eludir controles con API genérica. Edición y eliminación reciben primero el chat; `max` consulta el mensaje y rechaza si pertenece a otro. No hace esa comprobación para `user:<id>`. Registra chat, tipo, resultado y longitud, nunca texto. No hay límite por hora de bots hasta definirlo en `bot`: `max <имя> config set --bot sendsPerHour 200`.

**`max serve` aplica los mismos controles**, incluso a programas conectados directamente a su socket. Solo admite peticiones conocidas con la estructura del CLI; por ejemplo, no permite eliminar todo un chat. `config set` surte efecto sin reiniciar.

Contactos, perfil, carpetas y sesiones también respetan solo lectura. No usan destinatarios ni límite por hora porque no envían a chats. Se registran como `account` y acción, sin nombres, teléfonos ni títulos.

La lista es opcional: sin destinatarios añadidos, cualquier chat; activa pero vacía significa ninguno. Si está activa, `chats create <название> <люди…>` y `chats members add` solo admiten personas cuyo chat individual esté permitido. Un nuevo miembro no ve mensajes anteriores salvo con `--history`. Un mensaje programado cuenta en la hora del envío. Dos comandos simultáneos no superan juntos el límite: se reserva desde la comprobación hasta la respuesta. Eliminar datos de chats abandonados no modifica el registro de envíos.

⚠ **Limitaciones de los controles.** Están dentro de `max`; un agente con shell puede modificar ajustes o quitar listas. Protegen frente a mensajes que **inducen** al modelo, no frente a agentes que **intentan** eludirlos. Para eso necesitas límites externos: entorno aislado, otro usuario del sistema o reglas del agente.

Al elegir esos límites:

- **`MAX_PROFILE_LOCK` fija el perfil, `MAX_PROFILE` no.** La primera palabra gana: con `MAX_PROFILE=agent` basta ejecutar `max work messages send …`. `MAX_PROFILE_LOCK=agent` lo rechaza si el agente no puede cambiar el entorno, por ejemplo en configuración MCP o script envoltorio. Con shell puede quitar la variable. MCP fija el perfil al iniciar.
- **`--file` rechaza archivos ocultos, carpetas ocultas como `~/.ssh` y carpetas de `max`**, que suelen contener claves. `--allow-any-file` lo omite; el agente no debe añadirla por iniciativa propia. Otros archivos legibles por tu usuario pueden enviarse; el registro guarda tipo y tamaño.
- **La regla «preguntar antes de `max messages send`»** puede no detectar `max work messages send`. Limita el perfil con `readOnly`, `allow` o destinatarios y no dejes cerca otro sin restricciones con sesión activa.

## Texto ajeno en pantalla

Nombres, títulos, archivos y mensajes provienen de otras personas. `max` impide que controlen tu terminal o falseen lo mostrado:

- Controles que cambian colores, borran líneas, alteran títulos o portapapeles aparecen como texto (`\x1b`), sin ejecutarse; también invisibles y cambios de dirección.
- Nombre, título y leyenda ocupan una línea para impedir filas falsas.
- Aunque el nombre coincida exactamente con un chat y parcialmente con otros, muestra todos sin elegir.
- Autocompletado inserta solo identificadores de chat o persona; el nombre es una ayuda.
- Markdown y rutas descargadas reciben la misma limpieza; se eliminan controles de los nombres de archivos.

`--json` contiene datos tal como los envió MAX, escapados según JSON. Si los pasas a un programa que imprime en terminal, límpialos allí.

## Qué ven otros procesos

Los argumentos son visibles en `ps`. Por eso el token no es argumento, pero **el texto de un mensaje sí**:

```sh
max messages send 0 "текст"     # эта строка видна в ps и остаётся в истории оболочки
```

Si te preocupa, pásalo mediante el entorno de un script que controlas en lugar de la línea de comando, como el token.

Otros usuarios no ven archivos ni socket: carpetas `0700`, archivos `0600`.

## Qué sale por la red

| Destino | Cuándo |
|---|---|
| `wss://api.oneme.ru/websocket`, cabecera `Origin`: `https://web.max.ru` | comandos que necesitan MAX |
| servidores de archivos de MAX, dirección indicada por MAX | `messages send --file`, `messages download` |
| `https://web.max.ru` en perfil Chromium temporal | `session start qr-chrome`, `session start sms`, `setup --method qr-chrome|sms` |
| Hugging Face y GitHub para modelos de voz | solo `max models audio download`; la voz se procesa localmente |
| `https://platform-api2.max.ru`, Bot API oficial, token en `Authorization` | solo `max bot` |
| registro npm para comprobar versiones | `max upgrade` y una vez al día desde terminal; se desactiva con `updateCheck: false` |

`max messages download` usa https y rechaza direcciones del propio equipo o red local, también tras redirecciones. Límite de archivos: 4 GiB; voz para transcripción: 32 MiB.

Las peticiones de bots se identifican como `max-cli/<версия>`; MAX ya reconoce el bot por token. El certificado de `platform-api2.max.ru` está firmado por la raíz del Ministerio de Desarrollo Digital ruso, ausente en Node. `max` la añade solo a sus peticiones Bot API, sin modificar el sistema.

La cuenta personal no envía el nombre de la herramienta ni user-agent propio: usa user-agent y descripción del cliente web, dirección, formato binario y compresión iguales. `max serve` replica un evento de telemetría de pestaña oculta: «lista de chats mostrada», 20 segundos después de entrar, y nada más. Solo incluye identificador de cuenta y hora, no mensajes ni títulos. Los comandos puntuales no envían telemetría. Después de entrar, `max serve` consulta carpetas, banners, llamadas, stickers y reacciones como la pestaña: solo lectura; no muestra ni guarda respuestas. Los comandos puntuales no lo hacen. Hay diferencias: la pestaña también consulta contactos, historias y suscripción push; `max` no. MAX puede distinguirlos.

## Condiciones de MAX y tu cuenta

`max` no es una aplicación oficial. El [acuerdo de usuario de MAX](https://legal.max.ru/ps), versión del 09.09.2026, apartado 4.3.7, no permite programas automáticos sin consentimiento de la empresa. Por eso la cuenta puede recibir restricciones, incluso si está vinculada a servicios públicos o comunicación familiar.

Recomendaciones:

- **Usa también MAX normalmente en el navegador o móvil.** Una cuenta que solo atiende peticiones del CLI se comporta de forma diferente a una cuenta humana.
- **No conviertas `max` en un flujo continuo de peticiones.** Lee cuando lo necesites, no cada minuto por programación.

Se avisa una vez por stderr al iniciar sesión por primera vez con `max setup` o `max session start`.

## Uso personal

La herramienta guarda conversaciones y contactos ajenos. Para fines propios con tu cuenta, la ley rusa de datos personales (152-ФЗ, artículo 1, parte 2, punto 1) y el RGPD europeo (artículo 2(2)(c)) excluyen los fines personales y domésticos. Trabajar con cuentas ajenas o para negocios deja de ser uso personal. Entregar una exportación (`max store export`) también sale de ese ámbito; incluye enlaces de fotos que se abren sin iniciar sesión.

Los informes (`max doctor report create`) se adjuntan a incidencias **públicas** de GitHub. No contienen texto, nombres ni teléfonos; los identificadores se sustituyen por etiquetas. Revísalos antes de enviarlos.

## Inicio de sesión con navegador

`session start qr-chrome` y `sms` abren un **perfil temporal**, separado de tus contraseñas y cookies. Contiene una sesión de web.max.ru y se elimina al terminar, cerrar ventana, alcanzar `--timeout` o pulsar Ctrl-C. El token se lee por canal de depuración entre proceso y navegador (`--remote-debugging-pipe`), sin puerto de red ni acceso de otros usuarios.

`session start qr` dibuja el QR en terminal; queda en el historial visual pero caduca en minutos. Si la terminal es estrecha, lo muestra en una página `127.0.0.1` con dirección aleatoria; no guarda el enlace en archivo ni texto. La página desaparece al terminar.

Cada acceso añade un dispositivo en la lista de sesiones de MAX; puedes cerrarlo allí.

## Protocolo no oficial

MAX no publica API de cuentas personales. El conocimiento del protocolo procede de mediciones reales o ingeniería inversa ajena; se registra el origen de cada operación ([protocolo (`protocol.md`)](https://github.com/leemour/max-cli/blob/v0.25.0/docs/dev/protocol.md), columna «Where it came from»).

**Puede dejar de funcionar sin aviso.** En ese caso el comando indica el problema por stderr, en lugar de devolver una lista vacía como si todo funcionase.

## Si se filtra el token

```sh
max session end        # забыть локально
```

Esto **no basta**: `session end` no avisa al servidor y la sesión sigue activa. Solo puedes revocarla desde el cliente oficial donde se creó, en dispositivos.

`max account sessions end --others --yes` cierra **todas las demás** sesiones, también el móvil, donde tendrás que iniciar sesión otra vez. No permite cerrar una concreta: MAX no les da identificador. Si MAX renueva el token actual, `max` lo guarda antes de confirmar.

## Siguientes pasos

- [Diagnóstico](./diagnostics.md): qué se registra y qué nunca se registra.
- [Sesiones](./sessions.md): almacén, `MAX_TOKEN` y diferencia entre cerrar localmente y revocar.
- [MCP](./mcp.md): permisos del agente y opciones.
