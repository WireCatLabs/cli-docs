---
title: "Seguridad y datos guardados"
---

<a id="si-el-equipo-cae-en-otras-manos" />

Lea esta página antes de darle acceso a un agente o script de IA a su cuenta MAX a través de `max`, o cuando quiera saber qué almacena `max` en su computadora. Ella explica dónde se almacena la entrada, qué escribe `max` en el disco, con qué servidores contacta, qué detiene el envío no deseado y qué hacer si se filtra el token. Después de leerlo, podrás evaluar lo que puede hacer alguien con acceso a esta computadora, o un agente con acceso a `max`.

Palabras que aparecen en la página:

- **Token** es una cadena que te mantiene en tu cuenta MAX. Quien la tiene usa la cuenta.
- **Archivo local compartida**: una base de datos en su computadora donde `max` y `tg` almacenan los mensajes leídos. Es común a ambas herramientas y no está cifrado.
- **Protección contra envío**: verifica que cada cambio se realice antes de ingresar a MAX: derechos, lista de destinatarios permitidos y límite de envío por hora.

Lo común a `max` y `tg` (el archivo local de las conversaciones, la protección de envíos, los permisos del agente, el texto ajeno en pantalla, lo que ven otros en el comando y cómo informar de una vulnerabilidad) se describe en la [página común de seguridad](https://wirecat.dev/ru/docs/security). Aquí está lo que afecta solo a MAX.

## Resumen: qué protege

Lo que protege cualquier herramienta de WireCat está en la [página común](https://wirecat.dev/ru/docs/security). Particularidades de MAX:

- **El servidor en segundo plano también aplica los límites del perfil.** Los permisos, los destinatarios y el límite por hora se comprueban en el comando y en `max serve`, incluso para programas que conectan directamente a su socket ([abajo](#защита-от-отправки-не-туда)).
- **Token.** `max` no guarda un token de `MAX_TOKEN` ni lo pasa al servidor. El servidor no entrega tokens a los clientes del socket ([abajo](#где-живёт-токен)).
- **Red.** Solo se descargan archivos por HTTPS, nunca desde esta máquina o la red local, y dentro del tamaño configurado. Los frames MAX y los datos descomprimidos tienen límites; las conexiones tienen tiempos de espera ([abajo](#что-уходит-в-сеть)).
- **Cuenta.** `max` no es una aplicación oficial, y las condiciones de MAX no permiten este tipo de programas sin consentimiento de la empresa ([abajo](#правила-max-и-ваш-аккаунт)).

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
| copia compartida de mensajes de cuenta personal, bot y `tg`, con textos, transcripciones, rutas de adjuntos descargados y su texto extraído | `~/.local/share/cli-messaging/messages.db` | carpeta `0700`, archivo `0600` |
| socket y registro de `max serve` | `~/.local/share/max-cli/profiles/<профиль>.sock`, `.serve.log` | `0600` |
| copia anterior del perfil; ya no se abre | `~/.cache/max-cli/<профиль>.db` y sus `-wal`, `-shm` | carpeta `0700`, archivos `0600` |
| exportación, **solo `max store export --output`** | destino indicado | `0600` |
| archivos descargados, `max messages download` o `max attachments extract --download --output-dir` | carpeta actual o `--output` | `0600` |
| informe, **solo `max doctor report create`** | carpeta actual o `--output` | `0600` |
| modelos de voz, **solo tras `max models audio download`** | `~/.cache/cli-common/models/audio/…` | carpeta `0700`, archivos `0600` |

⚠ **La copia compartida contiene texto de mensajes y transcripciones de voz:** sirve para responder sin red. `max session end` no la elimina. `max store clear --left --allow-dangerous` solo borra datos de chats abandonados; no hay una orden que elimine toda la copia compartida.

Los archivos antiguos de caché del perfil ya no se abren. Si quedan, `max doctor` muestra su ruta; puedes borrarlos aparte sin afectar a la copia compartida.

También hay contenido de conversaciones en la copia del bot, exportaciones y descargas; la lista de chats del bot contiene títulos. El resto no contiene conversaciones.

### Si el comando cae en otras manos

Frente a quien extrae el disco solo protege el cifrado completo del disco: consulta la [página común](https://wirecat.dev/ru/docs/security). En Windows, el acceso a los archivos depende de los permisos del directorio del usuario y de los directorios `MAX_*_DIR` elegidos; los permisos numéricos de la tabla corresponden a Unix.

## Protección de envíos

Por qué hace falta la protección de envíos y cómo funciona se explica en la [página común](https://wirecat.dev/ru/docs/security). Antes de cada escritura (mensajes, reacciones, ediciones, reenvíos, eliminaciones), `max` comprueba cuatro cosas y después escribe una línea en el registro:

| Comprobación | Cómo activar | Denegación |
|---|---|---|
| prohibir escrituras en mensajes salvo autorizaciones más específicas | `max agent config set permissions.messages readonly`; limita otros recursos por separado | código `5`, sin conexión |
| permitir envíos y prohibir otras escrituras en mensajes | primero `max agent config set permissions.messages readonly` y después `max agent config set permissions.messages.send allow`; conserva otros recursos y reglas más específicas | código `5` para acciones prohibidas, sin conexión |
| destinatarios permitidos | `max <профиль> recipients add <чат>`; desactivar con `recipients clear` | código `7` |
| máximo por hora: mensajes, reenvíos, ediciones, fijados con aviso, eliminados y personas añadidas; no reacciones | `sendsPerHour`, predeterminado `30` | código `8`, indica cuándo reintentar |
| registro de cada intento, sin texto | siempre; `max sends list` | — |

**Los bots tienen claves propias `bot.*`, como `bot.messages.send`.** Usan los mismos niveles. Los ajustes comunes y las capas `bot.defaults`/`bot.profiles` se resuelven en el mismo orden; `config show --bot` muestra los permisos efectivos. Los antiguos `readOnly` y `allow` siguen siendo compatibles antes de migrar.

Cada bot tiene destinatarios (`max <имя> bot recipients add <чат>`) y registro (`max <имя> bot sends list`) propios. **Toda** escritura pasa por ellos, incluidos `messages send`, `messages pin` y `bot api`, para evitar eludir controles con API genérica. Edición y eliminación reciben primero el chat; `max` consulta el mensaje y rechaza si pertenece a otro. No hace esa comprobación para `user:<id>`. Registra chat, tipo, resultado y longitud, nunca texto. No hay límite por hora de bots hasta definirlo en `bot`: `max <имя> config set --bot sendsPerHour 200`.

**El servidor en segundo plano `max serve` realiza las mismas comprobaciones** para todo lo que pasa por él, incluidas las solicitudes de programas conectados directamente a su socket en lugar de mediante `max`. Solo acepta solicitudes que conoce `max`, con la forma en que las envía `max`; por ejemplo, rechaza eliminar un chat completo. Los cambios mediante `config set` se aplican de inmediato sin reiniciar el servidor.

Contactos, perfil, carpetas y sesiones también respetan solo lectura. No usan destinatarios ni límite por hora porque no envían a chats. Se registran como `account` y acción, sin nombres, teléfonos ni títulos.

La lista es opcional: sin destinatarios añadidos, cualquier chat; activa pero vacía significa ninguno. Si está activa, `chats create <название> <люди…>` y `chats members add` solo admiten personas cuyo chat individual esté permitido. Un nuevo miembro no ve mensajes anteriores salvo con `--history`. Un mensaje programado cuenta en la hora del envío. Dos comandos simultáneos no superan juntos el límite: se reserva desde la comprobación hasta la respuesta. Eliminar datos de chats abandonados no modifica el registro de envíos.

⚠ **Limitaciones de los controles.** Están dentro de `max`: un agente con shell puede quitarlos por sí mismo. Qué límite poner desde fuera se explica en la [página común](https://wirecat.dev/ru/docs/security). Para `max`: `MAX_PROFILE_LOCK` fija el perfil, `MAX_PROFILE` no; `--file` rechaza archivos ocultos, `~/.ssh` y los directorios de `max` mientras no se indique `--allow-any-file`.

## Qué no hace la herramienta

- **No marca como leído sin preguntar.** “Obtener historial” y “marcar como leído” son operaciones de protocolo diferentes. El segundo lo envían únicamente `max chats mark-read` y `messages list --mark-read`; leerlo no lo envía.
- **No envía nada que no haya sido solicitado.** Sólo `messages send|edit|delete|forward|pin|unpin|press`, `reactions add|remove`, `polls vote|close|create`, `contacts add|remove|import|rename|block|unblock`, `account update`, `account sessions end`, `session end`, `chats join|leave|create|update|start|app`, `chats members|admins …`, `chats requests accept|decline`, `chats link reset`, cambia algo `chats folders create|update|delete|order`, `chats moderate` (solo lo que gobierna el grupo). permitir), `chats mark-read` y `messages list --mark-read`, y cada uno hace sólo lo que está escrito en la línea escrita. `max commands --json` los marca como `mutates`.
- **La eliminación por defecto requiere confirmación.** El nivel `ask` para `messages.delete` requiere una respuesta en el terminal o `--allow-dangerous`; explícito `allow` realiza la eliminación sin lugar a dudas. Para eliminar a todos también necesitas `--for-everyone`; La herramienta MCP general no lo permite.
- **No toma el número de teléfono de la línea de comando.** `contacts lookup` lo solicita o lo lee desde la tubería, `contacts import` - desde el archivo: la línea de comando es vista por `ps` y el historial del shell. No hay ningún número en los errores, el registro de envío y los registros de inicio, y `max session start` y `max account show` lo muestran oculto.
- **No escribe mensajes en el registro.** Ni en forma recortada ni en hash - consulte [diagnóstico](./diagnostics.md).
- **No pasa por intermediarios.** Donde se conecta exactamente el `max` es en el apartado [“Qué entra a la red”](#что-уходит-в-сеть). `max` no tiene telemetría propia; `max serve` envía MAX un evento de servicio, como una pestaña oculta de la versión web; consulte en el mismo lugar.
- **Mantiene la conexión sólo en `max serve`.** Se inicia en segundo plano con el primer comando que necesita MAX; se detiene solo después de 15 minutos sin nada que hacer. No ejecutar - `max config set serve false`.

## Texto ajeno en pantalla

Los nombres, títulos y textos de otras personas no controlan la terminal: los caracteres de control e invisibles aparecen como texto, los nombres se imprimen en una línea y el autocompletado solo introduce números. Más detalles en la [página común](https://wirecat.dev/ru/docs/security).

## Qué ven otros procesos

El token no se pasa como argumento, pero el texto de un mensaje sí, y se ve en `ps` y en el historial de la shell ([página común](https://wirecat.dev/ru/docs/security)). Los archivos de estado y el socket del servidor en segundo plano están protegidos con permisos `0600` y carpetas `0700`. Otros archivos pueden tener permisos distintos, como `0644` en la configuración. Al mover archivos o redirigir la salida, comprueba los permisos por separado.

## Qué sale por la red

| Destino | Cuándo |
|---|---|
| `wss://api.oneme.ru/websocket`, cabecera `Origin`: `https://web.max.ru` | comandos que necesitan MAX |
| servidores de archivos de MAX, dirección indicada por MAX | `messages send --file`, `messages download` |
| `https://web.max.ru` en perfil Chromium temporal | `session start qr-chrome`, `session start sms`, `setup --method qr-chrome|sms` |
| Hugging Face y GitHub para modelos de voz | solo `max models audio download`; la voz se procesa localmente |
| Hugging Face, archivos del modelo de texto | Solo `max models text download`; el modelo local no envía mensajes |
| Servicio externo de vectores configurado | `conversations embed` envía texto de conversaciones tras el consentimiento; `search conversations`, incluido MCP, envía la pregunta al seleccionar un servicio externo |
| Servicio compatible con OpenAI o Anthropic configurado | `conversations build --analyze --chat` envía lotes limitados tras el consentimiento para la cuenta, el chat y el servicio |
| `https://platform-api2.max.ru`, Bot API oficial, token en `Authorization` | solo `max bot` |
| registro npm para comprobar versiones | `max upgrade` y una vez al día desde terminal; se desactiva con `updateCheck: false` |

`max messages download` usa https y rechaza direcciones del propio comando o red local, también tras redirecciones. Límite de archivos: 4 GiB; voz para transcripción: 32 MiB.

Las solicitudes de `max bot` se identifican como `max-cli/<версия>`: MAX ya conoce al bot por su token. El certificado de `platform-api2.max.ru` está firmado por un certificado raíz del Ministerio de Desarrollo Digital que no está incluido en Node; `max` lo añade solo a sus propias solicitudes a la Bot API y no cambia nada en el sistema.

Para las cuentas personales, las solicitudes de red no contienen el nombre de esta herramienta ni un user-agent propio: el user-agent y la descripción del dispositivo proceden del cliente web de MAX. Las tramas también usan la dirección, el formato binario y la compresión del cliente web. `max serve` reproduce la telemetría del cliente web tal como la envía una pestaña oculta: un evento «lista de chats mostrada» 20 segundos después de iniciar sesión, y nada más. Solo contiene el número de tu cuenta y la hora, sin mensajes ni nombres de chats. Los comandos de una sola ejecución no envían telemetría. Después de iniciar sesión, `max serve` solicita los mismos datos que una pestaña: carpetas, banners, historial de llamadas, conjuntos de stickers y reacciones. Son solicitudes de solo lectura; las respuestas no se muestran ni se guardan. Los comandos de una sola ejecución no hacen estas solicitudes. Siguen existiendo diferencias: la pestaña también solicita contactos, historias y suscripciones a notificaciones push, mientras que `max` no lo hace. Por tanto, MAX puede distinguir `max` de su cliente web.

## Condiciones de MAX y tu cuenta

`max` no es una aplicación oficial de MAX. El [acuerdo de usuario de MAX](https://legal.max.ru/ps) (versión del 09/09/2026, apartado 4.3.7) no permite programas automatizados sin el consentimiento de la empresa. Por tanto, una cuenta usada con `max` puede sufrir restricciones, y esa cuenta también puede estar vinculada a servicios públicos y a la comunicación con tus seres queridos.

Prácticas recomendadas:

- **Usa MAX como siempre, en el navegador o en el teléfono, junto con `max`.** Una cuenta que solo responde a solicitudes de `max` tiene un comportamiento distinto del de una cuenta usada por una persona.
- **No conviertas `max` en un flujo continuo de peticiones.** Lee cuando lo necesites, no cada minuto por programación.

Se avisa una vez por stderr al iniciar sesión por primera vez con `max setup` o `max session start`.

## Inicio de sesión con navegador

`session start qr-chrome` y `sms` abren un **perfil temporal**, separado de tus contraseñas y cookies. Contiene una sesión de web.max.ru y se elimina al terminar, cerrar ventana, alcanzar `--timeout` o pulsar Ctrl-C. El token se lee por canal de depuración entre proceso y navegador (`--remote-debugging-pipe`), sin puerto de red ni acceso de otros usuarios.

`session start qr` dibuja el QR en terminal; queda en el historial visual pero caduca en minutos. Si la terminal es estrecha, lo muestra en una página `127.0.0.1` con dirección aleatoria; no guarda el enlace en archivo ni texto. La página desaparece al terminar.

Cada acceso añade un dispositivo en la lista de sesiones de MAX; puedes cerrarlo allí.

## Protocolo no oficial

MAX no publica una API para cuentas de usuario. Todo lo que se sabe sobre el protocolo aquí se midió en una conexión en vivo o se leyó en la ingeniería inversa de otra persona, y para cada operación se anota exactamente de dónde vino ([descripción del protocolo](https://github.com/leemour/max-cli/blob/main/docs/dev/protocol.md), columna "De dónde vino").

**Puede dejar de funcionar sin aviso.** En ese caso el comando indica el problema por stderr, en lugar de devolver una lista vacía como si todo funcionase.

## Uso personal

La herramienta guarda en tu comando conversaciones y contactos de otras personas, incluidos los textos de los mensajes. El acceso a la base local permite acceder a esos datos. Entregar una exportación (`max store export`) a otra persona también entrega el contenido de la conversación; sus enlaces a fotos pueden abrirse sin iniciar sesión. Antes de compartir, revisa el contenido y los destinatarios. Esta página describe el funcionamiento de la herramienta y no certifica el cumplimiento legal de tu caso de uso.

Los informes (`max doctor report create`) se adjuntan a incidencias **públicas** de GitHub. No contienen texto, nombres ni teléfonos; los identificadores se sustituyen por etiquetas. Revísalos antes de enviarlos.

## Si se filtra el token

```sh
max session end        # выйти из MAX и забыть локально
```

`session end` termina esta sesión en el servidor de MAX, por lo que un token filtrado deja de funcionar. Si MAX no responde, el comando lo indica y conserva el token; repite el comando.

`max account sessions end --others --yes` cierra **todas las demás** sesiones, también el móvil, donde tendrás que iniciar sesión otra vez. No permite cerrar una concreta: MAX no les da identificador. Si MAX renueva el token actual, `max` lo guarda antes de confirmar.

## Siguiente paso

- [Página de seguridad general](https://wirecat.dev/ru/docs/security): Qué es lo mismo en `max` y `tg` y cómo informar una vulnerabilidad
- [Diagnóstico](./diagnostics.md): qué se registra exactamente y qué nunca se registra
- [Inicio de sesión, sesiones y perfiles](./sessions.md): llaveros, `MAX_TOKEN`, qué hace `session end`
- [MCP](./mcp.md): qué puede hacer el agente a través del servidor MCP y qué activa cada flag
- [Permisos](./permissions.md): cómo configurar `permissions` y `sendsPerHour`
