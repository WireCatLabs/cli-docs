---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/mail-cli`. Una sección por versión, de la más reciente a la más antigua.

## 0.32.0 — 14.11.2026

### Cambiado — puede romper a quien llama

- **Un nivel `readonly` ya no detiene `mail sync`** (cli-core 0.662.0, antes 0.661.0). Un comando que solo trae
  correo al almacén local funciona en `readonly`; `deny` lo sigue rechazando. Los comandos que escriben archivos del
  propietario o llaman a otro servicio siguen bloqueados por `readonly`. Si un perfil usaba `readonly` para detener la
  sincronización, pon esa clave en `deny`.

## 0.31.0 — 14.11.2026

### Corregido

- **`rules import --format gmail` acepta `--yes` por MCP.** Un agente solo podía previsualizar las reglas que
  sugieren los filtros de Gmail: la herramienta ofrecía solo las opciones propias del comando, y `--yes` era del
  programa.
- **`rules export` responde por MCP.** La llamada fallaba con «el comando imprimió su respuesta en lugar de
  entregarla». Ahora el agente recibe el archivo de reglas como respuesta; en una terminal y en una tubería sigue
  imprimiendo el archivo, así que `rules export > rules.json` se vuelve a importar.
- **`rules apply` ya no ofrece repetir con el mismo límite de tiempo una ejecución que no leyó nada.** Por MCP el paso
  decía que se pasara un `--timeout` más largo, algo que un agente no puede hacer, y estaba marcado como seguro de
  ejecutar sin preguntar, así que una ejecución reanudada podía repetirse sin avanzar. Por MCP ahora pide al
  propietario que dé al servidor un `MAIL_TIMEOUT` más largo o que lo ejecute en una terminal; en una terminal el paso
  añade `--timeout 30m` y espera al propietario.
- **`messages delete --rules` conserva el correo de un remitente al que el propietario escribió.** Juzgaba a los
  remitentes por el correo guardado, donde el correo propio del propietario de una carpeta Enviados por IMAP parecía
  recibido. Así, un sobre de alguien a quien el propietario respondió podía proponerse para la Papelera, y una regla
  predefinida aún podía atrapar a ese remitente. Ahora cli-core marca como enviado el correo guardado del propietario,
  y los motivos «respondido» y «enviado» de la limpieza valen también para los buzones IMAP.

## 0.30.0 — 14.11.2026

### Cambiado — puede romper a quien llama

- **Construido sobre cli-core 0.659.0** (antes 0.657.0). Consulta el
  [historial de cambios de cli-core](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).

### Corregido

- **Una configuración compartida con un pequeño desliz se repara al leerla.** En `~/.config/WireCat/config.json`, una
  marca de orden de bytes, un comentario, una coma final o una coma que falta entre dos líneas se corrigen en el sitio,
  y el archivo anterior se guarda al lado como `config.json.bak-<time>`. Para otros daños se indica la línea, la
  columna y la corrección probable.

## 0.29.0 — 14.11.2026

### Añadido

- **`rules apply --cursor` continúa desde donde terminó una ejecución detenida.** Una ejecución que llega a su límite
  de tiempo responde `state: partial` con el cursor y el paso que continúa. La ejecución que termina la ventana
  informa los recuentos de toda ella.
- **`rules apply` acepta `--yes` por MCP.** Un agente solo podía previsualizarlo: la herramienta no ofrecía `--yes`.

### Corregido

- **`rules apply` termina en un buzón grande, y por MCP responde a tiempo.** Fallaba a los 27 segundos en un buzón de
  17 000 correos, cuya lista tarda unos 4 minutos en leerse. Ahora funciona hasta 15 minutos por defecto (45 segundos
  por MCP, donde los clientes se rinden tras un minuto más o menos; `--timeout` sigue fijándolo). Lee los encabezados
  del más nuevo al más antiguo y guarda su trabajo lote a lote, así que una ejecución que se detiene conserva lo hecho.
  `score:` y `--kind` juzgan a un remitente por su correo en el almacén, así que el punto donde se detiene una
  ejecución nunca cambia lo que deciden.
- **`rules apply` dice cuándo se queda sin límite de tiempo.** El error decía que el servidor de correo no respondió a
  tiempo. Ahora dice que el comando llegó a su límite de tiempo y que se ejecute de nuevo con un `--timeout` más largo.

## 0.28.0 — 13.11.2026

### Corregido

- **Las notas de reunión de Telemost con el formato antiguo de Yandex reciben su resumen** (cli-core 0.657.0). La
  mayoría de los correos de notas no tienen el encabezado «Итоги»: el resumen es ahora el texto antes del primer
  encabezado, y el pie de Yandex ya no se guarda.

## 0.27.0 — 13.11.2026

### Cambiado — puede romper a quien llama

- **Construido sobre cli-core 0.656.0** (antes 0.653.0). Consulta el
  [historial de cambios de cli-core](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).

### Corregido

- **La sincronización funciona en una instalación nueva.** Una configuración compartida de WireCat
  (`~/.config/WireCat/config.json`) que no se podía leer (una marca de orden de bytes, un JSON roto, una carpeta en su
  lugar, una forma antigua de `setup`) dejaba cada herramienta de WireCat en solo lectura y rechazaba `sync`. Ahora solo
  tu propia respuesta «solo lectura» limita una herramienta, e incluso entonces la sincronización funciona: solo lee el
  servicio hacia el almacén local (cli-core 0.656.0).

## 0.26.0 — 13.11.2026

### Añadido

- **`rules add --do meeting-notes:<provider>` guarda las notas de reunión como reuniones.** Cada correo que coincide
  con la regla se guarda entero, protegido, y al sincronizar también como una reunión de ese proveedor, unida al evento
  del calendario en la misma sala ese día. Sin condición, coincide con el remitente del proveedor:
  `--do meeting-notes:telemost` es `keeper@telemost.yandex.ru`. `rules apply --yes` guarda las notas almacenadas antes
  de la regla; su simulación las cuenta. `rules list`, `export` e `import` llevan la marca.

### Cambiado — puede romper a quien llama

- **Construido sobre cli-core 0.651.0** (antes 0.648.0). Un inicio de sesión OAuth que falta tiene ahora el motivo
  `session.missing` (antes `oauth.missing`), `ai.address-refused` es ahora `model.address-refused`, y una huella de
  proyecto de reuniones caducada sale como `conflict` en lugar de `configuration_error`. La primera pantalla muestra
  `pbx`, la herramienta de Asterisk. Lo que cambió entre medias está en el
  [historial de cambios de cli-core](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).
- **Construido sobre cli-core 0.648.0** (antes 0.647.0). Un nombre de perfil que no tiene ningún perfil sale ahora con
  el código 6. `store reset` ya no se ofrece por MCP. Lo que cambió entre medias está en el
  [historial de cambios de cli-core](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).

### Corregido

- **Dos inicios de sesión que terminan a la vez conservan ambos registros.** `sign-ins.json`, que lee `doctor`, se
  cambia bajo un bloqueo, así que el registro de un perfil ya no sobrescribe el de otro.

### Seguridad

- **`contracts/wirecat.json` enumera los hosts a los que cli-core llega para el correo**: npm para `upgrade`, y
  Hugging Face y GitHub para descargar modelos y los hosts a los que redirigen. WireCat Desktop los muestra antes de
  instalar mail.
- **mail solo llega a los hosts que declara.** El inicio de sesión, la comprobación de la cuenta de Google, el
  descubrimiento del servidor y las consultas al registro para la puntuación del remitente pasan por `hostFetch`, que
  rechaza cualquier otro host antes de que salga un byte y comprueba cada salto a otra dirección. Un archivo de descubrimiento o un
  registro que redirige a otro host ya no se sigue: el descubrimiento prueba la siguiente fuente, y la consulta al
  registro cuenta como fallida y se repite en una ejecución posterior. El paquete incluye `contracts/wirecat.json`, así
  que WireCat Desktop muestra estos hosts antes de instalar mail.

## 0.25.0 — 13.11.2026

### Cambiado — puede romper a quien llama

- **Construido sobre cli-core 0.647.0** (antes 0.630.0). El almacén pasa a una versión más nueva al abrirse por primera
  vez (solo añade). Las listas leídas de cli-core son `ListResult`, `doctor reports show` y `doctor reports create`
  escriben un informe de problema para enviar, y se ofrece el ajuste `crm.<provider>:<account>.activities`. Lo que
  cambió entre medias está en el [historial de cambios de cli-core](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).
- **Las llamadas a modelos se quedan en este ordenador cuando lo pides.** Con el interruptor de solo local activado
  (`memo models local-only set on`), cada llamada a un modelo que cli-core hace para mail, incluidas las incrustaciones
  remotas, rechaza una dirección que no sea este ordenador antes de enviar nada. El `http://` simple se acepta ahora
  solo hacia este ordenador, para que los registros nunca crucen la red sin cifrar; usa https o ejecuta el modelo
  localmente.

## 0.24.0 — 10.11.2026

### Cambiado — puede romper a quien llama

- **Construido sobre cli-core 0.630.0** (antes 0.618.0). El almacén pasa a la versión 63 al abrirse por primera vez.
  Un buzón que conectas a nombre de otra persona ya no se une a ti: te espera como propuesta. Lo que cambió entre
  medias está en el [historial de cambios de cli-core](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).
- **`schedule pause <name>` y `schedule resume <name>`** quitan una programación de su temporizador y la conservan.
  `schedule run` sigue ejecutándola. `--at` se repite: `--at 08:30 --at 18:00` la ejecuta dos veces al día.

## 0.23.1 — 08.11.2026

### Añadido

- **`MAIL_READ_ONLY` deja pasar `rules add`, de forma acotada**, para que la revisión programada del correo en memo
  pueda archivar a un remitente como sobres: solo `--sender` o `--list-id` con `--do envelope`, solo donde no existe
  una regla con esas condiciones, y queda registrado con `source: agent`. `--domain`, `--filter`, `--kind`, cualquier
  otra acción o una etiqueta, una regla reemplazada, `rules remove|import|apply` y todo cambio en el servidor de correo
  siguen rechazados.

### Corregido

- **Un `sync --rescan` que se detiene en su límite de peticiones ahora lo dice y explica cómo seguir.** `--timeout`
  fija el límite (unas 85 peticiones por defecto) y `--max-pages` solo puede bajarlo, así que un `--max-pages` alto
  parecía ignorado. Repetir el mismo `--rescan` empieza otra vez por el correo más nuevo y nunca llega al más antiguo.
  La pista y el siguiente paso ahora nombran el límite y piden ejecutar `sync` sin `--rescan`, que sigue desde donde
  se detuvo la ejecución.
- **cli-core 0.618.0 (antes 0.614.0).** Tras `store recover run` (desde memo, tg, max o wa), el almacén recuperado
  hace que cada carpeta de correo olvide los UID que listó después de su último correo guardado, desde un día antes de
  la última comprobación profunda que pasó. Así el siguiente `mail sync` normal vuelve a leer ese correo, y ya no hace
  falta `--rescan` para ello.

## 0.22.0 — 08.11.2026

### Añadido

- **`session start --method oauth` conecta un perfil nuevo de Gmail con la aplicación de Google de WireCat.** No hace
  falta un cliente propio de Google Cloud, y `--client-file` sigue indicando el tuyo. Google puede mostrar una pantalla
  de "aplicación no verificada" hasta que termine su revisión. `--method app-password` pide la contraseña de
  aplicación, la opción por defecto en Gmail. `--method` fija solo el modo de un perfil nuevo. Uno existente se cambia
  con `config set auth`.
- **`mail <profile> account remove --keep-data|--delete-data`** quita un perfil de este ordenador: cierra la sesión
  (un inicio de sesión de Gmail con OAuth también se revoca en Google, lo que puede cerrar otras sesiones de la misma
  aplicación de Google, como hace `session end --revoke`), borra la contraseña de aplicación o el inicio de sesión del
  llavero, olvida el perfil en los ajustes y su registro de inicio de sesión y, con `--delete-data`, borra su correo
  guardado y sus registros de cambios. `--keep-data` deja el correo disponible para buscar. La antigua entrada de
  Himalaya en el llavero no se toca, y los demás perfiles quedan como están.

### Corregido

- **`account remove` ya no revoca un acceso de Gmail que usa otro perfil.** Google termina un acceso para toda la
  cuenta de Google y la aplicación, así que cuando otro perfil entra en la misma dirección (con cualquier mayúscula o
  minúscula) con Google OAuth, la revocación se omite: la respuesta da `revoked: false` y dice "Google access kept:
  profile <name> uses the same address".
- **Las pistas de Gmail llevan a la página de contraseñas de aplicación y dicen que la contraseña tiene 16 letras.**
  `session start` ahora enlaza <https://myaccount.google.com/apppasswords> en lugar del artículo de ayuda (que queda
  en "Sources") y dice "16-letter password", porque las contraseñas de aplicación de Gmail son letras.

## 0.21.0 — 08.11.2026

### Añadido

- **`messages send --html` envía un mensaje en HTML.** El texto (argumento o stdin) es HTML. La alternativa en texto
  plano se crea a partir de él, y el correo sale como `multipart/alternative`. La respuesta da `html_chars`. Una
  respuesta a un correo sigue en texto plano: `--html` con `--reply-to` se rechaza.

## 0.20.0 — 08.11.2026

### Cambiado — puede romper a quien llama

- **mail funciona sobre cli-core 0.608.0, y el almacén compartido pasa a la versión 57.** Una herramienta de WireCat
  con un cli-core anterior a 0.606.0 rechaza entonces el almacén y pide actualizarse, así que actualiza todos los CLI
  de WireCat a la vez. Las personas de los tratos y los leads de un CRM se guardan como informadas, no confirmadas por
  el dueño, y `config set` acepta `crm.<provider>:<account>.links` y `crm.<provider>:<account>.company-types`.

## 0.19.0 — 08.11.2026

### Añadido

- **`session start --json --answer-stdin` inicia sesión desde la ventana de WireCat Desktop.** Cada pregunta es una
  línea `needs` en stderr y su respuesta una línea en stdin: la dirección (salvo que la dé `--address`), los
  servidores IMAP y SMTP solo cuando la detección no encuentra ninguno, y la contraseña de aplicación como secreto,
  con una pista que nombra la página del proveedor para crearla. Las líneas `progress` dicen cuándo se busca el
  servidor y se comprueba el acceso. Outlook, Microsoft 365 y Gmail con OAuth envían una línea `open_url`. Una
  comprobación rechazada o fallida lleva un motivo: `mail.login-refused`, `mail.app-password-required` y
  `mail.imap-disabled` (ambos según las propias palabras de Gmail), `mail.host-unreachable`. En una terminal no cambia
  nada.

### Corregido

- cli-core actualizado a 0.604.0.

## 0.18.0 — 07.11.2026

### Corregido

- **La documentación de deshacer nombra el campo real.** Un cambio responde con `run_id`, y el ejemplo de
  `messages restore --write` muestra un id de operación real.
- **mail funciona sobre cli-core 0.600.0.** `status` abre el almacén en solo lectura incluso cuando una herramienta de
  WireCat más antigua lo dejó en un esquema anterior: ahora cli-core lo pone al día primero, así que mail ya no lo
  hace por su cuenta. El almacén compartido pasa a la versión 54 (embudos de CRM separados por cuenta, definiciones
  de campos de CRM), y una herramienta de WireCat más antigua sigue leyéndolo. `schedule list` da el ajuste `notify`
  de cada programación.
- **`schedule agent` y `schedule command` envían el resultado de una ejecución con `--deliver-to <route>`**
  (`telegram-bot:<profile>/<chat>` o `email:<profile>/<address>`, se puede repetir), y `schedule list` muestra las
  rutas como `deliver_to`. `--to` mantiene un solo significado en mail: la dirección a la que va un mensaje.

## 0.17.0 — 06.11.2026

### Añadido

- **mail funciona sobre cli-core 0.587.0 y cli-base 0.80.0.** `messages reset --holder <name> --since-time <time> | --last
  <n>` permite al propietario mover hacia atrás la marca de un agente, así que su siguiente `review --holder` le da ese
  correo otra vez (`--dry-run` cuenta primero). `review --holder` da la clave de hallazgos y deja fuera los boletines en
  lugar de todo el correo masivo. `schedule list` da los límites de coste de cada programación de agente. El almacén
  compartido pasa a la versión 52 (acuerdos) la primera vez que mail lo abre, y una herramienta de WireCat más antigua lo
  sigue leyendo.
- **`messages restore --write <id>` deshace una escritura de una ejecución y deja las demás.** El id es un
  `operation_id` que la respuesta de la ejecución listó en `writes`. Una restauración posterior de toda la ejecución
  deshace el resto. Una ejecución registrada antes de que las escrituras tuvieran id, o un id que no contiene, se rechaza
  como `not_found` (`mail.write-unknown`).
- **`drafts send` lista en `writes` la retirada del borrador de Drafts** (`op: "delete"`), con su propio
  `operation_id` junto al del envío. **Una restauración de Gmail desde la papelera lista la devolución de las
  etiquetas** como una escritura `label` que nombra la escritura que deshace, y el registro de cambios la guarda. Las dos
  escrituras ya se hacían antes, pero no respondían con id.
- **Cada escritura responde con su propio `operation_id`, y el registro de cambios lo guarda.**
  Los cambios de `messages`, `messages
  delete` y `messages restore` listan `writes`: una entrada por cada escritura en el servidor, con
  su `operation_id`, lo que hizo (`op`), la carpeta, `to` en un movimiento y cuántos mensajes. La escritura de una
  restauración también nombra la escritura que deshace (`undoes`). `folders create|rename|delete` y
  `drafts create|update|delete` dan el `operation_id` de su escritura. Los mismos ids están en el diario de envíos.
- **`account inspect` y `messages import` dicen en qué zona horaria leen `--since-time`.** La respuesta da
  `meta.timezone` y la ventana en UTC (`meta.window.since`), como hace `sync`. `messages import` también da
  `timezone` junto a `since`, y `account inspect` añade una línea a su tabla.

### Cambiado — puede romper a quien llama

- **La ejecución que hizo un cambio de `messages` es `run_id` en su respuesta, como en las demás herramientas de
  WireCat.** `messages mark-read|mark-unread|star|unstar|update|move|copy|delete` la respondían como `run`.
  `messages restore` responde `run_id` para la ejecución que hizo ella misma (antes `restore_run`, `null` en una vista
  previa) y `restored_run_id` para la ejecución que deshizo (antes `run`). La opción `--run` mantiene su nombre: es la
  opción del vocabulario compartido para «la ejecución de la que se trata».
- **`sync`, `messages import` y `messages export` limitan una ejecución con `--max-messages`, y `messages export`
  escribe en `--output-dir`.** `--limit` limitaba ahí el trabajo de una ejecución, no las filas de la respuesta, y ahora
  es el límite de trabajo por mensajes del vocabulario compartido. `--output` recibía una carpeta, y `--output` es en el
  vocabulario la opción para un solo archivo. Los `args` del siguiente paso siguen el cambio: `max_messages` y
  `output_dir`. Las opciones antiguas ya no existen. `--limit` se queda donde cuenta lo que muestra la respuesta:
  `account inspect`, `stats`, `drafts list`, `tags list` y, en los cambios de `messages`, la selección `--filter`.
- **`attachments download` recibe `[attachment...]` en lugar de `[number...]`.** El argumento nombra lo que recibe,
  como los demás argumentos de WireCat. Un agente pasa los números en `attachment` en lugar de `number`, y un rechazo
  nombra `param: "attachment"`. Los valores siguen siendo los números que muestra `attachments list`.

### Corregido

- **`status` responde sobre un almacén que una herramienta de WireCat más antigua dejó en un esquema anterior.** Abre
  el almacén solo para lectura, así que responde mientras corre una sincronización, y una apertura solo para lectura
  rechaza un esquema más antiguo que el suyo. Tras una actualización, `status` fallaba (`configuration_error`, "needs
  schema … maintenance") hasta que otro comando actualizaba el almacén. Ahora lo actualiza una vez él mismo.
- **Una señal de parada deja que `messages import` termine la lectura en curso y guarde lo leído, como `sync`.** Antes,
  Ctrl-C o una cancelación por MCP cortaba la importación al instante, mientras aún leía. Ahora se detiene antes de la
  siguiente lectura y responde `stopped: "cancelled"`. También recibe el plazo de una sincronización reanudable: 15
  minutos en una terminal, 45 segundos por MCP, en lugar de 30 segundos.
- **Los pasos de iCloud explican con palabras sencillas cómo iniciar sesión con el usuario corto.** Ya no citan una
  línea de comando con sus opciones, y `session start --help` sigue listando `--login`.
- **Cada pantalla muestra a una persona sus horas en la zona horaria local:** `status`, `sync`, `messages restore` y,
  con cli-core 0.587.0, `search messages`, `messages show`, `conversations list|show`, `review` y `runs list|show`. Una
  tabla mostraba `2025-12-31T14:00:00.000Z`, y ahora muestra `2026-01-01 00:00`, sin desfase, y una línea
  `times in <zone>` nombra la zona (el `TZ` del ordenador o la zona fijada). Las respuestas JSON y JSONL siguen en UTC.
- **Los comandos que hablan con el servidor de correo responden solo después de cerrar la conexión y el almacén.** `account
  check`, `account inspect`, `folders`, `sync`, `messages export`, los cambios de `messages`, `drafts` y los
  envíos imprimían antes su respuesta. Un cierre que falla termina ahora en error en lugar de después de un éxito. Las
  respuestas JSON no cambian.
- **Un envío cuyo almacén no logra cerrarse después lo dice y nombra su `operation_id`.** `messages send|forward` y
  `drafts send` terminan entonces en `outcome_unknown`: el mensaje probablemente salió, y el mismo comando con
  `--operation-id <id>` lo encuentra en Sent en lugar de enviarlo dos veces. Antes, el error no tenía `operation_id`.
- **Once rechazos más llevan un motivo registrado**, así que `commands info` los lista y un script puede distinguirlos:
  `mail.flag-deleted`, `mail.no-selection`, `mail.refs-and-filter`, `mail.move-to-trash`, `mail.original-gone`,
  `mail.others-for-agent`, `mail.no-submission`, `mail.config-unreadable`, `mail.profile-exists`,
  `mail.server-unknown` y `mail.export-other`. Sus mensajes no cambian. Una escritura de resultado desconocido dice
  ahora "check the mailbox before running it again", sin nombrar `sync`.
- **Las páginas para el usuario dan valores de ejemplo en lugar de marcadores y dicen cada dato una sola vez.** Los
  comandos de la guía de uso, las páginas de Outlook y la vista general usan referencias e ids de ejemplo
  (`msg:email/me%40example.com/…`) donde tenían `<ref>` o `<id>`. La lista de proveedores está solo en la página para
  preparar el buzón, y la vista general enlaza la guía de búsqueda en lugar de repetirla. La guía de uso ya no habla de
  mail 0.1, y la página de la aplicación de Microsoft ya no describe cómo los responsables publican un client id. No
  cambia ningún comportamiento.
- **Los archivos que `mail` vuelve a leer se comprueban campo por campo en lugar de darse por buenos.** Un archivo de
  reglas cuya condición tiene el tipo equivocado se rechaza con el número de la regla. Una cabecera dañada del diario de
  exportación, un registro de inicio de sesión, una respuesta RDAP o una caché de antigüedad de dominio se tratan como
  ausentes en lugar de romper el comando.
- **El README y `SECURITY.md` dicen qué envía `sync` fuera para puntuar a remitentes nuevos:** el dominio del
  remitente, nunca una dirección, a la lista de registros de IANA y al registro propio de ese dominio. Antes solo lo
  decía la página de seguridad. No cambia ningún comportamiento.

### Eliminado

- **El paquete ya no incluye `dist/index.js`.** Reexportaba `run`, `createProgram`, `definition` e `IDENTITY`, pero
  `package.json` nunca lo nombraba y ninguna herramienta de WireCat lo importaba. `mail` es un comando, no una
  biblioteca.

## 0.16.3 — 05.11.2026

### Corregido

- **Las notas de inicio de sesión de Microsoft ya no describen la verificación del editor.** Dicen que hacer pública
  una aplicación compartida de Microsoft es complejo, y apuntan a tu propia aplicación de Microsoft. No cambia ningún
  comportamiento.

## 0.16.2 — 05.11.2026

### Corregido

- **La página «Preparar el buzón» lista primero a los proveedores internacionales**: Gmail, Outlook, Microsoft 365,
  iCloud, Fastmail y después Yandex. Mail.ru ya no está en la página en inglés; sigue siendo un proveedor integrado y
  sus pasos están en la traducción al ruso. El comportamiento no cambia.
- **Las notas de inicio de sesión de Google y Microsoft ya no describen el estado de revisión o verificación de
  WireCat.** Dicen que hacer pública una aplicación de Google compartida para el correo es complejo, así que Google puede
  rechazar la aplicación de WireCat, y señalan el camino: tu propia aplicación de Google o una contraseña de aplicación. El
  comportamiento no cambia.
- **La ayuda de `session end` dice qué hace `--revoke` en tu cuenta.** Con Gmail por OAuth pide a Google que revoque el
  inicio de sesión, lo que cierra la sesión de todas las herramientas que usan el mismo proyecto de Google. La
  descripción y los ejemplos del comando ahora lo dicen. El comportamiento no cambia.

## 0.16.1 — 05.11.2026

### Corregido

- **Las pruebas de los permisos privados de archivos omiten la comprobación de permisos en Windows**, donde los archivos
  no tienen permisos de Unix.
- **La documentación, los ejemplos de la ayuda y la skill llaman `personal` al perfil de ejemplo, no `ya`**, como en tg.
  Un segundo buzón en un ejemplo se llama `work`. El comportamiento no cambia.
- **`docs/configuration.md` dice qué flag responde a `ask`**: `--allow-dangerous` para `drafts delete`, `--yes` para
  cualquier otro cambio y `confirmation_required` sin terminal y sin flag.
- **La caché de las edades de dominio de remitentes y la carpeta de los registros de inicio de sesión son solo tuyas.**
  `domain-ages.json` se escribe con permisos 600 y la carpeta que contiene `sign-ins.json` con 700, como todo otro
  archivo privado de mail.
- **Cada error y cada motivo de incidencia que mail genera está en su registro**, así que `mail commands info` los lista
  y un agente puede ramificar según ellos: `mail.smtp-login-refused`, `mail.no-drafts`, `mail.draft-unknown`,
  `mail.gmail-objectid`, `mail.export-destination-exists`, `download.exists`, `mail.unreadable`,
  `mail.deletions-skipped`, `mail.rules-unreadable` y `mail.export-unreadable`. Una prueba mantiene la lista completa.
- **El análisis de secretos conoce los tokens de acceso, los tokens de renovación y los secretos de cliente de Google
  OAuth.**
- **`mail commands info` dice con qué responden `rules remove`, `rules apply` y `rules import`**, como cualquier otro
  comando: `mail_rule_change`, `mail_rules_apply` y `mail_rule_import`. Las respuestas no cambian.
- **`rules apply` cierra su conexión con el servidor de correo antes de responder**, y los comandos de etiquetas entregan
  el almacén a la ejecución, así que un tiempo de espera o una señal también lo cierran.

## 0.16.0 — 05.11.2026

### Cambiado — puede romper a quien llama

- **mail funciona sobre cli-core 0.569.0: una programación de agente usa Sonnet, arranca ligera y se detiene por hoy al
  llegar a un tope de coste.** `mail <profile> schedule agent` admite `--model <model>` y `--max-cost-per-day <usd>`. Sin
  ellos, una programación de claude usa `sonnet` y una de codex el modelo por defecto de codex, una programación nueva de
  claude arranca sin tus servidores MCP, skills, ajustes ni CLAUDE.md, y no arranca ninguna ejecución el resto del día
  cuando las ejecuciones del día cuestan 5 dólares estadounidenses. `schedule_model_claude`, `schedule_model_codex`,
  `schedule_lean_start` y `schedule_max_cost_per_day` en `defaults` del archivo de configuración lo cambian para cada
  programación nueva; `mail config show` los lista.

## 0.15.0 — 05.11.2026

### Cambiado — puede romper a quien llama

- **El perfil fija si `sync` lee adjuntos y hasta qué tamaño, y una ejecución puede anularlo.** Lo fijan
  `read_attachments` del perfil (por defecto `true`) y `max_attachment_mb` (por defecto 10); `--no-attachments`,
  `--attachments` y `--max-attachment-mb <n>` lo anulan para una ejecución. Un archivo sin leer se guarda con su nombre y
  su tamaño, y su extracción queda en `not-read` o `too-large`. En ningún caso se conserva el archivo.
- **`messages show` vuelve a leer un correo cuando uno de sus adjuntos quedó sin leer**, cada adjunto sea cual sea su
  tamaño, así que el comando ahora llega al servidor de correo para ese correo. `--offline` o una lectura fallida
  muestra el correo guardado con `meta.complete: false` y el problema `mail.attachments-unread`. `attachments download`
  conserva un archivo.
- **Gmail por OAuth inicia sesión con la app de Google de WireCat cuando no nombras ninguna.** Antes necesitaba
  `--client-file` o `MAIL_GOOGLE_CLIENT_ID` y fallaba con `mail.oauth-no-client` sin ellos. El orden es `--client-file`,
  luego `MAIL_GOOGLE_CLIENT_ID` (con `MAIL_GOOGLE_CLIENT_SECRET`), luego el nuevo `google_client_id` del perfil y por
  último la app de WireCat. Google aún no ha revisado la app de WireCat para correo: si Google la rechaza, usa la tuya
  ([pasos](./oauth-google.md)). Elegir OAuth para un perfil de Gmail no cambia.
- **`MAIL_MICROSOFT_CLIENT_ID` elige la app de Microsoft para una ejecución**, antes que `microsoft_client_id` del perfil
  y que la app de WireCat, que ahora viene de `constants.json` de cli-core. `mail.oauth-no-client` desaparece: siempre
  hay una app.
- **Las filas `oauth` de `doctor` dicen qué app usa cada perfil como `oauth_client: { client, source }`**, en lugar de
  `client`: `source` es `flag`, `env`, `config` o `constants` (la de WireCat). La fila de un perfil informa de la app con
  la que inició sesión cuando su inicio de sesión la registró. `session start` responde `source` junto a `client`.
- **mail funciona sobre cli-base 0.77.1 y cli-core 0.566.0.**

### Añadido

- **`stats messages show` cuenta el correo guardado del perfil por día, semana o remitente**, recibido y enviado, sobre
  la misma consulta que `search messages`: `{ by, received, sent, rows: [{ key, name, received, sent }] }`, una clave de
  día o semana `YYYY-MM-DD` en `--timezone` (una semana por su lunes), un remitente con su dirección como clave y `sent`
  0. Solo recuentos, sin búsqueda registrada. Para el correo por día de WireCat Desktop (`mailStats` de cli-core,
  0.564.0).
- **`account inspect` agrupa el correo del buzón por remitente y lista antes de sincronizarlo**: correos, MB, partes sin
  leer y enviadas a muchos, años, si respondiste, una sugerencia `skip` y una puntuación de spam o estafa, más los tipos
  de regla que casaría el correo. Solo cabeceras, no guarda nada. `--domain-age` pregunta al registro (RDAP) de cada
  dominio de remitente cuándo se registró. Pasó de `memo mail inspect`.
- **`messages import <file.mbox>` añade un archivo de Google Takeout al correo guardado de un perfil de Gmail**, unido a
  lo que guarda `sync` por los ids de Gmail; solo añade, deja fuera Spam y Trash y sigue las reglas del perfil. Pasó de
  las cuentas de correo de memo con `mode: "mbox"`.
- **`sync` puntúa a los remitentes del correo guardado, como mucho una vez al día**, y pregunta a los registros por los
  dominios de remitente nuevos hasta su plazo; la búsqueda pone más abajo el correo de remitentes con señales de fraude.
  El `senders` de la respuesta dice cuántos. Antes lo hacía `memo sync`; ya no lee correo.

### Corregido

- **El servidor MCP dice a un agente que el texto de los adjuntos son datos, no instrucciones**, junto a asuntos,
  cuerpos y nombres de archivo. `sync` indexa el texto de los adjuntos y `messages show` lo devuelve.
- **`session start` escribe cada ajuste en su valor por defecto al guardar un perfil nuevo**, como hace `config set`. El
  primer archivo que creaba un inicio de sesión solo contenía el perfil, así que el dueño no veía los demás ajustes
  hasta un `config set` o `config migrate` posterior.

## 0.14.0 — 05.11.2026

### Añadido

- **`config migrate` escribe cada ajuste que falta en tu archivo de configuración, en su valor por defecto**, y conserva
  tus valores, su orden y las claves que no conoce; no crea ninguna sección y ejecutarlo otra vez no añade nada. Una
  primera ejecución ahora escribe en el archivo cada ajuste compartido, y `config set` y `config unset` rellenan los que
  faltan. `config show` da a cada ajuste su valor por defecto y su descripción, y ya no crea un archivo que falta. Desde
  cli-core 0.563.0.

### Cambiado — puede romper a quien llama

- **La sincronización de correo lee adjuntos de hasta 10 MB por archivo por defecto**, y puede omitirlos. Desde cli-core
  0.563.0.
- **`review --holder` deja fuera también el correo de remitentes sospechosos**, junto al enviado a muchos, los sobres,
  los borradores y el correo parcial. Desde cli-core 0.560.0.
- **Una respuesta por encima del tope de salida nombra qué ejecutar en su lugar** (WC-OUT-22). Desde cli-core 0.563.0.
- **El almacén pasa a la versión 48** (facturas y pagos, importaciones por un solo sobre, la limpieza de filas de prueba
  que se colaron en un almacén real). La primera ejecución de esta versión lo migra. Desde cli-core 0.557.0–0.560.0.

## 0.13.0 — 02.11.2026

### Añadido

- **`review`: qué hay de nuevo, qué debes y qué espera respuesta**, con las palabras de tg: `review "date>2h"`, `--new`
  (un punto por buzón y lector), `--unanswered [duration]` (el último correo te llegó en To o Cc, sin respuesta),
  `--waiting [duration]` (escribiste tú al final) y `bulk:false` para dejar fuera el correo enviado a muchos. Cada
  correo lleva `bulk`, `list_id` y `rule_id`. Solo lee el almacén; por MCP es la herramienta de lectura `review`. De
  cli-core.
- **Una marca de proceso por agente**: `review --holder <name>` lee lo guardado después de la marca de ese titular, por
  el orden del almacén, así que el correo sincronizado tarde no se salta;
  `messages acknowledge --holder <name> --cursor <cursor>` la mueve hacia delante. El correo enviado a muchos, los sobres y los borradores se saltan y se
  cuentan, el correo parcial se retiene. `status` lista cada titular: hasta dónde llegó, cuánto retuvo, leyó y saltó
  por cada motivo. De cli-core 0.556.0.
- **`config repair`** arregla un archivo de ajustes cuyo JSON solo tiene roto la sintaxis, con una copia de seguridad;
  `--dry-run` muestra lo que haría. De cli-core.

### Corregido

- **La página de inicio de sesión en el navegador de `mail mcp serve --http` dice que la aplicación pide acceso a tu
  correo** y nombra `mail mcp serve --http`. Antes decía «tus mensajes» y `mail mcp --http`. De cli-core 0.551.0.

## 0.12.0 — 02.11.2026

### Añadido

- **Cuentas de trabajo o de centro educativo: qué hacer cuando Microsoft pide la aprobación de un administrador**
  ([docs/outlook.md](./outlook.md)): por qué aparece `AADSTS90094`, el enlace de consentimiento de administrador para la
  aplicación de WireCat con la forma de revocarlo, y cómo una organización registra su propia aplicación.

## 0.11.0 — 02.11.2026

### Añadido

- **Una guía para conectar Outlook.com o Microsoft 365** ([docs/outlook.md](./outlook.md)): activar IMAP, iniciar
  sesión en el navegador, sincronizar y enviar, y qué hacer cuando se rechaza el token o un administrador debe permitir
  la aplicación.

## 0.10.0 — 02.11.2026

### Cambiado — puede romper a quien llama

- **`search messages` responde `search.server-partial`, no `search.server-too-large`.** Descarga los primeros 256 KiB de
  cada mensaje que encuentra el servidor y guarda uno más grande con su texto y sin sus adjuntos; el siguiente `sync` lo
  lee entero. Antes, un candidato de más de 5 MB se quedaba en el servidor y uno menor se descargaba con todos sus
  adjuntos. Un script que comparaba con `search.server-too-large` ahora recibe `search.server-partial`.
- **Tras `messages send`, `stored` es verdadero solo si este mensaje está en el almacén**, no si lo está cualquier otro
  correo de los últimos 10 minutos. Quien leía `stored: true` como "se sincronizó algún correo" ahora lo lee como "este
  mensaje está guardado".
- **`mail.search-refused` es ahora el motivo de cli-core** (cli-core 0.550.0); el motivo, su código y su mensaje son los
  mismos.

### Añadido

- **`--compact` responde una línea por elemento** (cli-base 0.74.0). mail ahora necesita `@wirecat/cli-core` 0.550.0 y
  `@wirecat/cli-base` 0.74.0.
- **`sync` informa de qué pasó con los correos que una búsqueda guardó primero como texto**: `partial_emails` con
  `completed` (leídos enteros en esta ejecución), `left` (esperan a una ejecución posterior) y `stuck` (se desistió de
  ellos: el servidor ya no los da donde se guardaron). Falta cuando no hay ninguno.

### Corregido

- **Un inicio de sesión de Microsoft cuyo nuevo token rechaza el servidor de correo explica cómo activar IMAP.** En
  Outlook.com IMAP está desactivado por defecto; el error ahora nombra el interruptor (Configuración, "Correo",
  "Reenvío e IMAP", "Permitir que dispositivos y aplicaciones usen IMAP") y ya no afirma que se intentó una renovación. La
  respuesta lleva el código de respuesta del servidor como `cause_code`, nunca su texto.
- **Un servidor que rechaza SEARCH ya no parece una carpeta vacía.** `sync` deja esa carpeta sin leer y lee el resto: la
  respuesta es parcial, la nombra en `refused_folders` con una incidencia `mail.search-refused`, y nada de ella se marca
  como eliminado. `messages move`, `copy`, `delete`, `restore` y `drafts` se detienen con `mail.search-refused` en lugar
  de actuar sobre nada (cli-core).
- **En Gmail, un correo que una búsqueda guardó primero como texto lo lee entero el siguiente `sync`.** Allí nunca se
  completaba: mail calculaba su id a partir del Message-ID, y el correo de Gmail se guarda bajo su X-GM-MSGID, así que
  cada sync descargaba de nuevo el mensaje entero y lo descartaba. Ahora `fetchRaw` lee los ids de Gmail junto a los
  bytes.
- **Un correo que una búsqueda guardó primero como texto ya no se descarga entero en cada sync cuando el servidor ya no
  lo da.** Se lee bajo el UIDVALIDITY con el que se guardó, y se desiste de él tras tres intentos fallidos, o de inmediato
  cuando su lugar lo ocupa otro mensaje; ya no retrasa a los más nuevos (cli-core).
- **Una búsqueda ya no guarda una copia "primero texto" sobre un correo que un sync de otro proceso guardó entero entre
  tanto**, lo que perdía sus adjuntos (cli-core).
- **El lector de tu propio `--client-file` de Google y el abridor del navegador vienen de `@wirecat/cli-core` 0.546.0**,
  no de copias en mail. Los formatos de archivo, la comprobación de `chmod 600` y los errores no cambian.

## 0.9.0 — 02.11.2026

### Añadido

- **El inicio de sesión de Microsoft funciona sin configuración**: la aplicación de WireCat para Microsoft está integrada.
  El inicio de sesión envía `http://localhost:<port>/callback`, la dirección registrada para ello
  (docs/oauth-microsoft.md). Google mantiene `127.0.0.1`.

## 0.8.0 — 02.11.2026

### Añadido

- **La `meta` de cada respuesta incluye `now` y `now_local`**, el momento en que se hizo (cli-core 0.541.0, cli-base
  0.72.0).

### Corregido

- **`search messages` espera 20 segundos a un servidor de Yandex por defecto, no 5**: un IMAP SEARCH de un INBOX grande de
  Yandex tarda de 5 a 7 segundos, así que el valor anterior siempre se agotaba. `--server-time` sigue fijándolo; el
  registro de proveedores guarda el valor.
- **Un sync programado ya no falla a los 30 segundos mientras sigue en ejecución.** `schedule exec` esperaba al sync con
  el plazo de 30 s de un comando de una sola vez, respondía `timeout` (código de salida 9) y dejaba al sync escribiendo
  hasta 15 minutos. Ahora espera lo que permite el plazo propio del sync, y detener la ejecución también detiene el sync
  (cli-core).
- **Un sync de Gmail usa unos 200 MB, no de 1 a 1,7 GB.** Cada ronda preguntaba al almacén por todos los correos guardados
  de la cuenta; en un buzón de 260 000 correos, un sync de 30 días ahora tarda segundos en lugar de minutos (cli-core).
- **`search messages --backend` se mantiene dentro de su límite de tiempo**: leer lo encontrado y sus adjuntos cuenta para
  `--server-time`, el límite termina antes del plazo del comando, no se escribe nada después de detener el comando, y un
  hallazgo de más de 5 MB se deja en el servidor (`search.server-too-large`) (cli-core).

## 0.7.0 — 01.11.2026

### Cambiado — puede romper a quien llama

- **`drafts delete` toma `--allow-dangerous`, no `--yes`**, porque un borrador eliminado así no vuelve (WC-PERM-9). Solo
  lo pasa el propietario; un agente por MCP recibe una vista previa.

### Añadido

- **`messages export --output` rechaza las carpetas de credenciales** y las carpetas de las aplicaciones de WireCat, como
  hace `attachments download`.
- **Outlook.com y Microsoft 365 inician sesión con OAuth.** `mail <profile> session start --address <you>@outlook.com`
  muestra lo que va a pedir, abre la página de Microsoft en el navegador, inicia sesión en IMAP con el nuevo token y solo
  entonces guarda el perfil y los tokens (entrada del llavero `oauth:microsoft:<profile>`). Sync y `messages send` usan
  el token por IMAP y SMTP (XOAUTH2), renovándolo cuando hace falta; un token que el servidor rechaza se renueva una vez,
  y después el error `mail.oauth-refused` pide un nuevo inicio de sesión. `session status` muestra la aplicación, los
  permisos y la caducidad, nunca un token; `session end` olvida el inicio de sesión e indica dónde Microsoft lista la
  aplicación. `--no-browser` solo imprime el enlace.
- **`microsoft_client_id`**: la aplicación de Microsoft con la que iniciar sesión, que fijas una vez
  (`config set --defaults`); un agente por MCP no puede cambiarla. La aplicación propia de WireCat aún no está
  registrada, así que por ahora es obligatorio; [register a Microsoft app](./oauth-microsoft.md) da los pasos.
- **Gmail con OAuth y tu propia aplicación de Google**: `session start --client-file <Desktop client JSON>`
  (o, en un perfil cambiado con `config set auth oauth`, `MAIL_GOOGLE_CLIENT_ID` y `MAIL_GOOGLE_CLIENT_SECRET`), para una
  cuenta que no puede crear una contraseña de aplicación. La dirección con la que se inicia sesión debe coincidir con la
  del perfil. Los perfiles de Gmail mantienen las contraseñas de aplicación mientras no se cambien.
  [Gmail with your own Google app](./oauth-google.md) da los pasos: un proyecto de Google solo para el correo, publicado
  sin verificación. `session end --revoke` pide a Google que lo revoque, lo que termina todos los inicios de sesión de ese
  proyecto.
- **`mail doctor` lista cada perfil OAuth** con su aplicación y su último inicio de sesión, solo desde el disco, y avisa
  desde el día 6 de que una aplicación de Google que sigue en Testing termina sus inicios de sesión el día 7.
- `session status` y `session list` también responden `auth`.

### Corregido

- **Un agente por MCP puede adjuntar varios archivos**: `--file` de `messages send` y `messages forward` es allí una
  lista.
- **Enviar un mensaje ya no acorta la cobertura del archivo** a los últimos 10 minutos, que memo informaba hasta el
  siguiente sync completo.
- **`attachments list` y `download` muestran todos los adjuntos**, no los primeros 50, y `drafts update` los conserva
  todos.
- **Los adjuntos se guardan mediante la escritura atómica de cli-core**, que además sincroniza con el disco el archivo y
  la carpeta.
- El comando `memo mail delete` se nombra como se llama ahora, en la documentación y en la ayuda de
  `messages delete --rules`.
- **Microsoft 365 es un proveedor propio**, que se detecta por su registro MX, y envía por `smtp.office365.com:587`
  ([Microsoft](https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365));
  Outlook.com mantiene `smtp-mail.outlook.com`.

## 0.6.0 — 01.11.2026

### Añadido

- **`mail <profile> messages export [query] --output <folder>`** escribe los mensajes originales del correo guardado que
  coinciden con una consulta en archivos mbox (uno por carpeta, mboxrd) o en un árbol Maildir++ (`--format maildir`), para
  copia de seguridad o para mu y notmuch. El almacén guarda solo texto, así que cada mensaje se vuelve a leer del
  servidor. La carpeta es privada (modo 700, archivos 600); se rechaza una carpeta que ya tiene algo, salvo que `--resume`
  continúe una exportación o `--replace` escriba sobre archivos del mismo nombre. `--limit` y `--max-pages` acotan una
  ejecución, que además se detiene antes de su plazo; `--resume` omite lo que ya hay en la carpeta y recorta un mensaje
  escrito a medias.
- **`mail <profile> stats messages top --by sender|list|domain`** ordena el correo guardado por remitente, lista de
  correo o dominio del remitente, con recuento de no leídos y tamaño.
- **`mail <profile> messages mark-read|mark-unread|star|unstar <ref…>`** y **`messages update <ref…> --flag <flag>
  --unflag <flag> [--replace]`** cambian marcas y palabras clave en el servidor (leído, destacado, respondido, borrador,
  `$Junk`, palabras propias); una carpeta que no guarda palabras clave responde `provider_unavailable`.
- **`messages move|copy <ref…> --folder <folder|role>`** archiva el correo por carpeta; en Gmail un movimiento añade una
  etiqueta y quita `Inbox`, una copia añade una etiqueta, `--folder archive` solo quita `Inbox`.
- **`messages delete <ref…>`** mueve el correo a la papelera, nunca lo elimina definitivamente; `--rules` es la limpieza
  de sobres de memo, movida aquí: el correo de sobre que las reglas dejan ir, decidido de nuevo cada vez, con las
  etiquetas y estrellas de Gmail leídas otra vez justo antes del movimiento, una copia de seguridad reciente del almacén
  obligatoria y una primera ejecución de 100 como máximo; se niega a ejecutarse desde una programación.
- **`messages restore --run <id>`** deshace una ejecución de cambios, del último paso al primero: de la papelera a donde
  estaba el correo (en Gmail con sus etiquetas), movimientos deshechos, copias eliminadas, marcas como estaban. Los id de
  ejecución de `mail delete` de memo también se restauran aquí. Fuera de Gmail una copia se elimina para siempre por el UID
  que dio el servidor, nunca por una búsqueda de Message-ID que pudiera encontrar el original.
- **`folders create|rename|delete`**; `delete` es una vista previa hasta `--yes`, y rechaza una carpeta que contiene
  correo, o cuyo recuento el servidor no da, salvo `--allow-dangerous`, que solo el propietario pasa en una terminal.
- **`rules list|add|remove|apply|export|import`**, movidas desde memo con las mismas opciones: el perfil es el buzón, así
  que no hay argumento de cuenta; el formato de importación por defecto es `mail`, el archivo que escribe la exportación
  de memo.
- Toda escritura sobre mensajes toma los mensajes por `ref` o por `--filter '<query>'` (`--limit`, el más reciente
  primero). Un borrado, un cambio con `--filter` y un cambio de más de 20 mensajes responden con una vista previa y el
  comando con `--yes` en `next`; `--dry-run` solo muestra la vista previa. El almacén sigue cada cambio del servidor al
  instante: marcas, carpeta y UID, etiquetas de Gmail, borrado.
- **Permisos:** `messages.delete`, `folders.delete` y `messages.bulk` (cualquier cambio de muchos) preguntan; el resto de
  los cambios siguen adelante. `MAIL_READ_ONLY=1` los rechaza todos. Cada intento va al diario de envíos (cli-core 0.522.0).
- Los motivos de error (`mail.no-trash`, `mail.run-unknown`, `mail.archive-unverified`, …) llegan ahora al error JSON.
- **`mail <profile> drafts list|create|update|delete`** guarda borradores en la carpeta Borradores del propio buzón, así
  que un agente escribe uno y el propietario lo revisa y lo envía desde cualquier aplicación de correo. `create` acepta
  `--to`, `--cc`, `--bcc`, `--subject` y el texto (`-` lee stdin); `--reply-to <ref> [--reply-all]` responde a un mensaje
  guardado en su hilo. Un borrador se nombra por su Message-ID; `update` sustituye solo lo que se da y conserva el resto,
  el hilo y los adjuntos, y mueve la versión anterior a la papelera; `delete` lo elimina para siempre y pregunta antes
  (`drafts.delete`).
- **`mail <profile> tags add|remove <tag…> --message <ref> | --chat <ref>`** y **`tags list`** ponen etiquetas propias en
  el correo guardado y en las conversaciones. Se quedan en el almacén local, en las mismas tablas con que etiqueta memo, y
  nunca llegan al servidor; `search messages tag:<tag>` las encuentra. Las palabras clave del proveedor siguen siendo
  `messages update --flag`, las etiquetas de Gmail
  `messages move|copy --folder`.
- **`mail doctor`** avisa cuando una ejecución de cambios se detuvo a medias, y cuando el correo que una ejecución movió a
  la papelera de Gmail está a menos de cinco días de que Gmail la vacíe, con el comando `messages restore` para cada
  caso. El doctor de memo lo decía hasta que la limpieza se movió aquí; las ejecuciones de limpieza de memo también
  cuentan. Necesita cli-core 0.524.0 (la comprobación `local` de `appDoctorCommand`).
- **`search messages` pregunta también al servidor de correo** por el correo que sync aún no ha leído:
  `--backend archive|server|both` (por defecto `both`) y `--server-time` (por defecto 5s), como los tiene
  `tg search messages`. Gmail se busca una vez en All Mail con su propia sintaxis (X-GM-RAW); otros servidores con IMAP
  `UID SEARCH` en INBOX, Sent y Archive, o las `folders` del perfil. El servidor recibe las palabras, `from:`, `to:`,
  `cc:`, `subject:`, `body:`, `is:` y `date:`; lo que encuentra se guarda, y la misma consulta se ejecuta luego sobre el
  almacén, así que la respuesta significa lo mismo en ambos backends y cada resultado dice `found_in`. El buzón se abre
  solo para lectura. `permissions.messages.server-search=deny` lo desactiva; `--offline` y `MAIL_READ_ONLY` se quedan en
  el almacén (cli-core 0.525.0).
- **`mail <profile> messages send --to … --subject … [text]`** envía por el servidor SMTP del proveedor con la misma
  contraseña de aplicación; el texto sale de stdin cuando se omite. `--cc`, `--bcc`, `--file <path>` (repetible; una ruta
  nombrada, nunca un patrón; las carpetas de credenciales y de WireCat se rechazan sin `--allow-any-file`, que un agente
  por MCP nunca recibe). `--reply-to <ref> [--reply-all]`
  responde a un correo guardado: `In-Reply-To`, `References`, `Re:`, el original citado, `\Answered` puesto en él.
- **`messages forward <ref> --to … [text]`** envía el original adjunto entero (`message/rfc822`), `Fwd:` antes de su
  asunto, y le pone `$Forwarded`.
- **Enviados y el almacén tras un envío.** Gmail archiva en Sent el correo SMTP por sí mismo; en otros proveedores la
  copia (con su línea Bcc) se añade a Sent salvo que Sent ya tenga ese Message-ID. Luego el mensaje se lee en el almacén
  como lo lee `sync`, así que tiene el id del servidor y nunca una segunda fila.
- **Seguridad de los envíos.** El correo para cualquiera que no sea el propietario pregunta antes: nueva clave
  `messages.send.others`, por defecto `ask`, que el propietario puede poner en `allow`. La pregunta muestra remitente,
  to, cc, bcc, asunto, cada adjunto y las primeras líneas. `MAIL_READ_ONLY=1`, `readonly` y `deny` rechazan; cada intento
  va al diario de envíos sin direcciones, asunto ni texto; cada destinatario cuenta para `sends_per_hour`; los envíos se
  espacian con el ritmo de peticiones compartido (cli-core 0.523.0). Una respuesta perdida después de que el mensaje
  salió es `outcome_unknown`; `--operation-id` lo reintenta y no envía nada si Sent ya lo tiene. `--dry-run` construye el
  mensaje y no envía nada. Un texto que dice «adjunto» sin archivo avisa.
- **`drafts send <id>`** envía un borrador guardado por el mismo camino que `messages send` (sus claves y su pregunta, el
  límite por hora, el diario, la copia en Sent), y luego lo elimina de Borradores.
- **`attachments list <ref>`** y **`attachments download <ref> [number…] --output-dir <dir> [--replace]`**: los archivos de
  un correo, leídos del servidor y numerados como los numera el almacén, guardados legibles solo por ti con sus nombres
  sencillos; un archivo existente se conserva salvo con `--replace`.
- **Las claves de perfil `smtp_host`, `smtp_port`, `smtp_security`** nombran el servidor de envío para un proveedor que
  la lista integrada no conoce. Los servidores integrados se comprobaron con la página de ayuda de cada proveedor; el de
  Yandex es ahora `smtp.yandex.ru:465`.

### Cambiado — puede romper a quien llama

- **Un agente por MCP escribe solo al propietario.** `messages send`, `messages forward` y `drafts send` para cualquier
  otra persona responden `permission_error` por MCP hasta que el propietario fije `permissions.messages.send.others` en la
  configuración (`ask` o `allow`); un `mcp serve --permission` no puede abrirla. En una terminal sigue preguntando.
- `mail` ya no es de solo lectura: un cliente MCP con `--allow-writes` puede cambiar el buzón mediante la herramienta
  `write`, dentro de los permisos del perfil.
- **En un servidor con OBJECTID (Fastmail, Cyrus) el id de un correo es el hash de su Message-ID, como lo hace memo**, no
  el EMAILID del servidor, y su hilo sale de References. Los id salen de `mailIds` de cli-core, que memo usa también, así
  que las dos herramientas nunca guardan un correo dos veces. Gmail conserva sus propios id; los de Yandex y Mail.ru no
  cambian.
- **Un agente no puede cambiar adónde va la contraseña de aplicación ni a quién puede escribir.** Por MCP, `config set` y
  `config unset` rechazan `address`, `login`, `imap_host`, `imap_port`, `imap_security`, `smtp_host`, `smtp_port`,
  `smtp_security`, `auth` y `permissions.messages.send.others` incluso con `mcp.authority`; el propietario los cambia en
  una terminal (cli-core 0.530.0).

### Corregido

- **Construido sobre cli-core 0.530.0 y cli-base 0.71.0.** El lint de comandos ahora conoce `drafts`, `--cc`, `--bcc` y
  `--reply-all`, y acepta `--to <address>` y `--subject <text>` junto a los `<chat>` y `<ref>` de los mensajeros, así que
  desaparecen trece excepciones de lint y el presupuesto es 11. La auditoría compara mail en el grupo `mail-shared` de
  cli-base y se ejecuta sin `--complete`. cli-core también deja de ocultar un almacén bloqueado al puntuar remitentes.
- **Las etiquetas de Gmail se decodifican una vez.** imapflow ya las decodifica, y mail decodificaba `R&D-team` otra vez
  como `Rteam`.
- **`sync` avisa cuando deja fuera reglas guardadas**: `rules_unread` y `rules_unread_why` (como `condition label`) en la
  respuesta y una incidencia `mail.rules-unreadable`, cuando las reglas tienen una condición que este mail no conoce.
- **`sync --rescan` falla con un almacén bloqueado o roto** en lugar de dar por hecho el reencadenado.
- **El nombre de archivo de un adjunto se limpia como lo hacen las descargas de cli-core**: se van los caracteres de
  dirección y de ancho cero que disfrazan una extensión, y en Windows un nombre reservado (CON, NUL, …) pasa a
  `attachment-<n>`.

## 0.5.0 — 01.11.2026

### Corregido

- **Una sincronización programada se ejecuta desde su temporizador.** El temporizador inicia `mail schedule exec <file>`
  sin perfil, y mail lo rechazaba con "name a profile" antes de leer la programación, así que ninguna ejecución con
  temporizador funcionó en 0.3.0 y 0.4.0. `schedule exec` ya no necesita perfil; el entorno de la propia programación lo
  nombra (cli-core 0.521.0).

## 0.4.0 — 01.11.2026

### Añadido

- **`mail <profile> search messages '<query>'`** busca sin conexión en el correo guardado del perfil, con el lenguaje de
  consulta de todas las CLI de WireCat y el orden de memo: cualquier forma de una palabra, `from:`, `to:`, `subject:`,
  `label:`, `is:unread`, `has:attachment`, `content:`, `date>7d`, y `list:` para una lista de correo por su List-Id o su
  dominio. El correo de un remitente sospechoso va después del resto (`--plain-order` mantiene el orden de las palabras);
  `--newest`, `--exact`, `--page`.
- **`mail <profile> messages show <ref>`** da un correo entero, con los primeros 4000 caracteres del texto de cada
  adjunto (`--full`: todo y el cuerpo HTML), y `--before-n`/`--after-n` correos de su hilo, en el JSON que da
  `memo messages show`.
- **`mail <profile> conversations list [query]` y `conversations show <thread>`**: los hilos, el más reciente primero,
  filtrados por `subject:`, `emails_count>1` o `last_email_at>7d`, y los correos de un hilo, el más antiguo primero.
- Cada uno lee solo el buzón del propio perfil; se rechaza la referencia de otro buzón. Por MCP son comandos `read`.

## 0.3.0 — 01.11.2026

### Añadido

- **`mail <profile> schedule`** ejecuta un comando de mail con un temporizador mediante systemd, launchd o el Programador
  de tareas, como hace `tg`: `mail ya schedule command mail-ya --every 5m -- sync`. `doctor` avisa cuando una ejecución
  programada falla una y otra vez.

## 0.2.0 — 01.11.2026

### Añadido

- **La skill en ClawHub nombra su programa y su paquete npm**, así que a un usuario de OpenClaw se le dice que instale
  `@wirecat/mail-cli` antes de que la skill funcione, como con las otras skills de WireCat.
- **El servidor MCP de mail figura en el MCP Registry oficial** como `dev.wirecat/mail-cli`.
- **`session start` imprime el servidor que encontró antes de enviar la contraseña**: host, puerto, seguridad e inicio de
  sesión, para ver una suposición errónea del descubrimiento antes de que la contraseña vaya allí.
- **Un perfil nuevo guarda cómo inicia sesión (`auth`).** Un perfil guardado antes sigue funcionando con sus ajustes
  `imap_*` e inicia sesión con una contraseña de aplicación, sin nada que migrar.

### Cambiado — puede romper a quien llama

- **`sync` lee All Mail en Gmail cuando el perfil no nombra carpetas.** El correo archivado de Gmail sale de INBOX, así
  que una sincronización solo de INBOX lo daba por borrado. All Mail se encuentra por su función, así que una cuenta de
  Gmail en otro idioma también funciona.
- **Las cabeceras se leen como las lee memo.** El `List-Id` de una lista de correo se guarda sin sus corchetes angulares
  y en minúsculas, y Reply-To, los veredictos SPF, DKIM y DMARC de Gmail y la pista de adjunto se leen al listar, para que
  las reglas del propietario vean los mismos campos en ambas herramientas.

### Corregido

- **`sync` aplica las reglas de correo guardadas de la cuenta, como memo.** Una regla de omisión o de sobre decidida en
  memo vale ahora también para `mail sync`, y ambas herramientas guardan la misma posición, que contiene una huella de
  las reglas. Un perfil de Gmail se sincroniza en modo Gmail, como en memo.
- **Las etiquetas de Gmail se nombran como las nombra memo** (`Inbox`, `Sent`, `Starred`, nombres decodificados), así que
  los buzones `label:Inbox` guardados siguen coincidiendo y nada se guarda como `label:\Inbox`.
- **`sync --rescan` mueve a su hilo las respuestas guardadas por 0.1** en un servidor sin id de hilo, como Yandex. La
  respuesta dice cuántas en `rethreaded`. Los hilos de Gmail no se tocan.
- **Una respuesta se guarda en su conversación en servidores sin id de hilo, como Yandex y Mail.ru.** El hilo es el primer
  correo nombrado en References, o si no en In-Reply-To. El correo guardado antes se mueve con `sync --rescan` (arriba).
  Gmail conserva sus propios id.
- **Todo comando que pregunta al servidor queda sujeto al plazo de la ejecución y a Ctrl-C.** `session start` y
  `session status --check` abrían el buzón por su cuenta, sin el plazo ni la interrupción que tenían los otros comandos,
  y una fuente podía reconectarse después de cerrarse.
- **`sync` pide como máximo 20 MB de cuerpos de mensaje en una petición**, además de como máximo 15 mensajes, para que un
  lote de adjuntos grandes no mantenga una conexión durante minutos ni llene la memoria.
- **Los esquemas de `account check` y `session status` nombran `file` como origen de contraseña.** Una contraseña guardada
  en el archivo privado se respondía como `file` mientras el esquema publicado permitía solo `environment`, `keyring` y
  `himalaya`, así que un cliente que comprueba las respuestas contra el esquema la rechazaba.
- **Un `sync` que `--limit` detuvo lo dice.** Responde `stopped: "limit"` y cuántos correos nuevos dejó en `remaining`, y
  su siguiente paso dice que la ejecución guardó los correos que permite `--limit`, en lugar de decir que se detuvo para
  responder a tiempo.

## 0.1.1 — 01.11.2026

### Corregido

- **La documentación lleva de `sync` al primer correo encontrado y dice cómo se guarda de verdad la contraseña.** La instalación, el uso y
  el índice de la documentación terminan con `memo search mail`, porque `mail` llena el almacén común y memo busca en él. La
  contraseña se guarda en el llavero, pasa a un archivo privado cuando el llavero falla y puede venir de `MAIL_PASSWORD`; nunca se lee de
  stdin. `rate_limited` nombra las dos causas: el servidor limita la cuenta y `sync` agotó su propio presupuesto de peticiones.
  La documentación también dice que `memo mail delete` mueve el correo de Gmail a la papelera.

## 0.1.0 — 31.10.2026

### Añadido

- **`mail` lee un buzón por IMAP en el almacén compartido de WireCat y nunca modifica el buzón.** `memo` y las demás
  herramientas de WireCat buscan y leen después ese correo en tu ordenador. `mail` no envía correo.
- **`session start` inicia sesión de un perfil con una contraseña de aplicación.** Un perfil nuevo necesita `--address`,
  o lo pide en una terminal. Encuentra el servidor mediante una tabla incorporada (Yandex, Gmail, iCloud, Mail.ru,
  Fastmail), el registro MX, el ISPDB de Thunderbird y el archivo autoconfig del dominio; `--provider`, o `--host` con
  `--port` y `--security`, lo fija a mano y se salta esas búsquedas. Muestra los pasos para preparar el buzón, pide la
  contraseña de aplicación sin eco (o lee `MAIL_PASSWORD`), la comprueba en el servidor y solo entonces guarda el perfil
  y deja la contraseña en el llavero del sistema. Sin terminal no pregunta nunca y nombra la opción o la variable que
  falta. Una contraseña de aplicación que Himalaya ya guarda en el llavero se usa cuando `mail` no tiene ninguna. Los
  pasos de cada proveedor están en
  [Preparar el buzón](https://github.com/WireCatLabs/mail-cli/blob/main/docs/providers.md). Outlook y Microsoft 365 solo
  aceptan OAuth, así que `session start` los rechaza por ahora.
- **`session status`, `session end` y `session list` gestionan el inicio de sesión.** `session status --check` entra en
  el servidor para comprobar que la contraseña sigue funcionando; `session end` olvida la contraseña y conserva el correo
  sincronizado; `session list` no necesita perfil y muestra los perfiles de este ordenador.
- **`account check` y `folders list`** inician sesión y muestran lo que admite el servidor, y las carpetas con su función
  y su número de mensajes.
- **`sync` lee el correo nuevo en el almacén compartido y omite lo que ya está.** Lee INBOX y Sent, salvo que `--folder`
  o el perfil nombren otras carpetas, empezando por lo más reciente, desde `--since-time` (por defecto, los últimos
  30 días). Una fecha sola empieza a medianoche local, y la respuesta indica la zona horaria y la ventana en UTC.
  `--limit` limita los mensajes nuevos de una ejecución y `--rescan` vuelve a listar toda la ventana. Guarda el texto y
  las cabeceras, no los adjuntos.
- **Un buzón grande se sincroniza en varias ejecuciones.** `sync` gasta un presupuesto de peticiones calculado según su
  plazo (15 minutos en una terminal, 45 segundos por MCP; `--timeout` y `--max-pages` lo cambian), guarda tras cada parte
  y responde `state: partial` con el comando para continuar. `mail <profile> status` muestra cuánto lleva, también
  mientras se sincroniza. Si quedaron mensajes sin leer o no se comprobaron las eliminaciones, la respuesta lo indica en
  `meta.issues`.
- **`sync` resiste un servidor inestable.** Una conexión caída se reabre tras una breve espera y la ejecución continúa;
  un mensaje al que el servidor no puede responder ahora se pide de nuevo al final de la ejecución y se deja para la
  siguiente. En un servidor sin identificadores de mensaje, como Yandex, cada mensaje nuevo se descarga una vez y el
  correo ya guardado no se vuelve a leer.
- **Los agentes de IA usan `mail` mediante MCP y una skill.** `mail <profile> mcp serve` ofrece al agente los comandos
  del perfil por stdio, o por HTTP tras tu propio túnel con `--http`; los permisos del perfil deciden qué se ejecuta y
  `--permission` solo los restringe más. `mail skill install` instala las instrucciones de la herramienta para Claude
  Code, Codex, Gemini CLI y OpenClaw, y para Hermes con `--for hermes`.
- **La contraseña de aplicación pasa a un archivo privado cuando falla el llavero, y nunca se pregunta por ello.**
  `session start` guarda la contraseña en `credentials.json` (modo 600) en la carpeta de configuración, lo avisa una vez
  por stderr y responde `credential_storage`. `--credential-storage file` elige el archivo directamente, no recomendado.
  `session status` puede responder `password_from: "file"`.
- **Una ejecución con carpetas movidas nunca elimina del llavero del sistema la contraseña de aplicación del
  propietario.** Esa ejecución lee la contraseña del propietario pero nunca la sustituye ni la elimina, y guarda una
  nueva en una entrada temporal. `session end` sobre la contraseña del propietario no elimina nada y responde
  `kept: "owners-sign-in"`.
- **`wcat mail` ejecuta la herramienta, y `wcat --help` la lista.** El paquete instala `wcat-mail` junto a `mail`, y
  `wcat-mail --wcat-describe` imprime para `wcat` el nombre, la versión y la descripción de la herramienta.
- **`doctor --online` indica si hay publicada una versión más reciente.** No hace ninguna llamada al servidor de correo.
- **Los comandos que comparten todas las herramientas de WireCat:** `doctor`, `commands`, `config`, `skill`, `runs` y
  `upgrade`.
