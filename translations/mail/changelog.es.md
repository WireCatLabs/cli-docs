---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/mail-cli`. Una sección por versión, de la más reciente a la más antigua.

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
