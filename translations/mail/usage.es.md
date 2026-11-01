---
title: "Uso"
---

Esta página explica cómo se construye un comando y cómo usa la herramienta un agente. Léela antes de tu primer comando.

## El perfil va primero

Un perfil es un nombre que eliges para una cuenta. Es la primera palabra de todo comando que usa una cuenta:

```sh
mail ya folders list
```

`MAIL_PROFILE=ya` hace lo mismo para una sesión de la terminal. Nunca se da un perfil por supuesto, ni siquiera el único: un
comando sin perfil se detiene con el código de salida 2 y muestra los perfiles de este ordenador.

## Conectar un buzón

Primero prepara el buzón: activa IMAP y crea una contraseña de aplicación. [Preparar el buzón](./providers.md) tiene los pasos
de cada proveedor, y `session start` también los imprime.

```sh
mail ya session start --address me@example.com # new profile: finds the server, shows the steps, asks for the app password
mail ya session start                 # an existing profile: asks for the app password again (checked, kept in the keyring)
mail ya account check                 # logs in and lists what the server supports
mail ya folders list                  # folders with role and counts
mail ya sync --since-time 2026-10-01  # reads new mail into the shared store; stored mail is skipped
```

`session start` en un perfil nuevo debe encontrar el servidor de correo. Primero mira en una tabla integrada (Yandex, Gmail,
iCloud, Mail.ru, Fastmail, Outlook). Después mira el registro MX del dominio. Después consulta la lista de servidores de correo de
Thunderbird y el archivo de ajustes del propio dominio. Si ninguno conoce el servidor, fíjalo tú con `--host`, `--port` y
`--security`, o nombra un proveedor de la tabla: `--provider yandex`.

En una terminal, `session start` pregunta lo que falta: el proveedor y la dirección. Sin terminal no pregunta nada. Entonces la
falta de `--address` o de la contraseña es un error, y lee la contraseña de `MAIL_PASSWORD`. El perfil se guarda solo después
de que el servidor acepte la contraseña de aplicación. Outlook solo acepta OAuth para IMAP, así que `session start` lo rechaza
por ahora. Para cambiar el servidor de un perfil existente, usa `config set` o un nombre de perfil nuevo.

`session start` toma la contraseña de la terminal o de `MAIL_PASSWORD`. Nunca la toma de una opción ni de una dirección. Cuando
el servidor la acepta, `mail` la guarda en el llavero del sistema operativo. Si el llavero falla, `mail` la guarda en un archivo
privado y lo avisa una vez por stderr. `--credential-storage file` elige el archivo; no lo recomendamos. Si `mail` no tiene
contraseña, lee la que dejó Himalaya (`secret-tool`, servicio `himalaya`, cuenta el nombre del perfil). Así una configuración
existente de Himalaya no necesita una contraseña nueva.

`sync` lee INBOX y la carpeta Sent; en Gmail lee All Mail, porque el correo archivado sale de INBOX. `--folder` o el
ajuste `folders` del perfil indican otras carpetas. Lee primero el correo más nuevo. `--limit` limita el correo nuevo de
una ejecución. `--rescan` lista de nuevo toda la ventana. Guarda el texto y las cabeceras, y el texto de cada adjunto que
puede leer, no los archivos. Las reglas de la cuenta (`mail <profile> rules`, la misma tabla que lee memo) también valen
aquí: el correo que nombra una regla de omisión no se lee, y una regla de sobre conserva solo su remitente, su fecha y su
tamaño.

Un buzón grande no cabe en una sola ejecución. `sync` tiene un presupuesto de peticiones al servidor, fijado por su plazo: 15
minutos en una terminal, 45 segundos por MCP. `--timeout` cambia el plazo. `--max-pages` reduce el presupuesto. La ejecución
guarda lo que leyó, responde `state: partial` y da el mismo comando en `next`. Ejecútalo otra vez para continuar.
`mail <profile> status` muestra cuánto lleva la sincronización.

Para mantener un perfil al día, pon su sync en un temporizador (systemd, launchd o el Programador de tareas):
`mail ya schedule command mail-ya --every 5m -- sync`. `mail ya schedule list` muestra cada programación y cómo fue su
última ejecución, y `doctor` avisa cuando una ejecución falla una y otra vez.

Yandex no da identificador de mensaje. Con un servidor así, `sync` lista solo el número, los indicadores, la fecha y el tamaño de
cada mensaje, y descarga cada mensaje nuevo una vez. Omite el correo guardado por ese número, así que una nueva ejecución no lee
nada dos veces. No detecta el correo borrado en el servidor ni los indicadores cambiados en el correo que omite. `--rescan` hace
ambas cosas. También mueve una respuesta guardada por mail 0.1 al hilo del primer correo al que responde: ejecuta una vez
`mail <profile> sync --rescan --since-time <date>`, con una fecha tan antigua como el correo guardado, y `rethreaded` dice
cuántas movió.

A veces el servidor no puede responder por un mensaje (Yandex responde `NO [UNAVAILABLE]` a algunos). `sync` lo pide otra vez al
final de la ejecución. Si sigue fallando, `sync` lo cuenta en `unreadable` y lo deja para la siguiente ejecución.

A veces el servidor cierra la conexión. `sync` espera 1, luego 3, luego 10 segundos, con una pequeña variación aleatoria para que
muchas ejecuciones no reintenten a la vez. Después se reconecta. Comprueba que el servidor sigue numerando el correo de la
carpeta igual, y continúa desde la petición fallida mientras lo permitan el presupuesto y el plazo. Si sigue fallando, la
respuesta conserva el código propio del error de red como `cause_code`, y `mail runs show` lo muestra.

## Salida para scripts

Todo comando salvo `mcp serve` en stdin y stdout acepta `--json`, e imprime un único valor JSON en stdout. Los errores son JSON en stderr, con un código por el que
bifurcar. La [referencia de comandos](./commands.md) lista los códigos.

## Agentes

`mail skill install` coloca la skill de la herramienta donde la buscan Claude Code, Codex, Gemini CLI y OpenClaw.
`mail skill install --for hermes` añade además esa carpeta a los ajustes propios de Hermes Agent, así que un `skill install` sin más
deja fuera a Hermes. `mail personal mcp serve` sirve los comandos del perfil por MCP, en stdin y stdout:

```sh
claude mcp add mail -- mail personal mcp serve
```

El servidor ofrece todos los comandos. `sync` escribe solo en el almacén local; las escrituras de `messages` y `folders`
cambian el buzón. Los permisos del perfil deciden qué se ejecuta; consulta [los ajustes](./configuration.md#permissions).

Para ChatGPT y Claude en el navegador,
`mail personal mcp serve --http --public-url https://laptop.example.ts.net` sirve en `127.0.0.1` (puerto 8765, o
`--port`) tras tu propio túnel. Una aplicación de navegador inicia sesión con un código de un solo uso que imprime el comando;
`mail personal mcp revoke` termina todos los inicios de sesión. `mail personal mcp server start` ejecuta el mismo
servidor en segundo plano, `mcp server status` muestra su puerto, el código de inicio de sesión y las aplicaciones conectadas,
y `mcp server stop` lo termina.

## Buscar en tu correo

`mail` busca y lee el correo que sincronizó su perfil, en el almacén local, y pregunta al servidor de correo por lo que
`sync` aún no ha leído (`--backend archive` se queda en el almacén):

```sh
mail ya search messages invoice                                  # best match first, any form of the word
mail ya search messages 'from:ann@example.com has:attachment date>30d'
mail ya search messages 'list:github.com is:unread' --newest     # a mailing list, newest first
mail ya messages show '<ref from a search>'                      # the whole email and its attachments' text
mail ya conversations list emails_count>1                        # threads, newest first
mail ya conversations show '<chat:email/… ref>'                  # one thread, oldest first
```

El lenguaje de consulta es el que usan todas las CLI de WireCat ([guía de búsqueda](https://github.com/WireCatLabs/cli-core/blob/main/docs/search/query-language.md)):
`from:`, `to:`, `cc:`, `subject:`, `mailbox:` o `label:`, `list:` (un List-Id o su dominio), `is:unread`,
`has:attachment`, `filename:`, `content:` (el texto de los adjuntos), `size>` y `date:`. Cada comando lee solo el buzón
de su perfil; [memo](https://github.com/WireCatLabs/cli-memo) busca en todos los buzones junto con tus mensajes y notas
(`memo search mail`, `memo search all`). El almacén guarda texto, no el mensaje original, así que no hay código fuente
en bruto que mostrar.

`search messages` también pregunta al servidor de correo, así que se encuentra además el correo que sync aún no ha leído:
en Gmail con su propia búsqueda sobre All Mail, en otros servidores con IMAP SEARCH en INBOX, Sent y Archive (o las
`folders` del perfil). Lo que encuentra el servidor se guarda y decide la misma consulta, así que cada resultado dice
`found_in`: `archive`, `server` (nuevo del servidor) o `both`. `--backend archive` se queda en el almacén, `--backend server` responde solo lo que encontró el servidor, y `--server-time 20s` espera más que los 5 segundos por defecto. El
servidor lee palabras, `from:`, `to:`, `cc:`, `subject:`, `body:`, `is:` y `date:`; el resto de la consulta se aplica a lo que
devuelve. IMAP SEARCH encuentra partes de palabras y ninguna otra forma de una palabra, así que un servidor puede perder un
resultado que el almacén, con todas las formas, encuentra tras sync. `permissions.messages.server-search=deny` en el perfil
desactiva la búsqueda en el servidor.

El correo de un remitente cuyo correo parece spam o estafa va después del resto de una página; `--plain-order` mantiene el
orden que dan las palabras. `messages show` da los primeros 4000 caracteres del texto de cada adjunto; `--full` da todo
y el cuerpo HTML. `--before-n` y `--after-n` añaden los correos de alrededor en su hilo.

## Exportar el correo

El almacén guarda texto, no el mensaje original, así que `messages export` vuelve a leer los originales del servidor.
Selecciona con la misma consulta que `search messages` y escribe una carpeta privada (modo 700, archivos 600):

```sh
mail ya messages export 'from:ann@example.com' --output ~/mail-backup     # one mbox file per folder
mail ya messages export --folder INBOX --format maildir --output ~/Maildir # Maildir++, for mu and notmuch
mail ya messages export 'date>30d' --limit 500 --output ~/mail-backup --resume
mail ya stats messages top --by list --limit 10                          # which lists send the most
```

- **Qué se escribe.** Cada mensaje tal como lo guarda el servidor, byte a byte, en cada carpeta en que está archivado
  (Gmail archiva un mensaje en All Mail e INBOX a la vez: pasa `--folder` para exportar una). Los archivos mbox son
  mboxrd: una línea del cuerpo que empieza por la palabra From recibe un `>` delante. Los nombres de archivo de Maildir
  llevan el estado de leído (`S`) y destacado (`F`).
- **Nunca sobre lo que hay.** Se rechaza una carpeta que ya tiene algo. `--resume` continúa una exportación empezada allí
  (un archivo de diario, `.mail-export.jsonl`, lista lo que está hecho y la longitud de cada archivo mbox después);
  `--replace` escribe en cualquier carpeta sobre archivos del mismo nombre y no borra nada.
- **Por partes.** Una ejecución se detiene en `--limit`, `--max-pages` o antes de su plazo y dice `state: "partial"`;
  ejecútala otra vez con `--resume`. El correo para el que el almacén no tiene UID (haz sync otra vez) o que el servidor
  ya no tiene se cuenta, no se escribe.

## Ordenar el buzón

Cada cambio va primero al servidor y luego al almacén, así que `search messages` lo muestra al instante. Los mensajes se
nombran con el `ref` que da una búsqueda, o se eligen con `--filter` con la misma consulta:

```sh
mail ya messages mark-read '<ref>'                               # also mark-unread, star, unstar
mail ya messages update '<ref>' --flag answered --unflag '$Junk'  # flags and keywords; --replace sets the whole set
mail ya messages move '<ref>' --folder archive                   # a folder by path, name or role
mail ya messages copy --filter 'list:github.com' --folder Lists --yes
mail ya messages delete --filter 'from:shop@example.com date<2025-01-01'   # a preview: nothing moves
mail ya messages delete --filter 'from:shop@example.com date<2025-01-01' --yes
mail ya messages restore --run '<run id the change answered with>' --yes
mail ya folders create Receipts                                  # also folders rename, folders delete
```

- **Primero una vista previa.** Un borrado, un cambio elegido con `--filter` y un cambio de más de 20 mensajes responden
  con lo que cambiaría y el mismo comando con `--yes` en `next`; nada cambia hasta entonces. `--dry-run` siempre solo
  muestra la vista previa. La marca o el movimiento de un solo mensaje sigue adelante de inmediato.
- **Deshacer.** Cada cambio responde con un id de `run`. Antes de preguntar al servidor, la ejecución registra el lugar,
  las marcas y las etiquetas de Gmail de cada mensaje; `messages restore --run <id>` devuelve lo que sigue donde la
  ejecución lo dejó: de la papelera a su carpeta, un movimiento deshecho, una copia eliminada, las marcas como estaban.
  Las ejecuciones del antiguo `mail delete` de memo también se restauran aquí. El correo con texto vuelve a la búsqueda
  con el siguiente `sync`; un sobre, al instante.
- **Gmail.** Todo el correo está en All Mail y una carpeta es una etiqueta: `move --folder Work` añade la etiqueta `Work`
  y quita `Inbox`, `copy` solo la añade, `--folder archive` solo quita `Inbox`, y `delete` mueve el correo de All Mail a
  la papelera con sus etiquetas guardadas en la ejecución, así que una restauración las devuelve.
- **Papelera.** `delete` nunca elimina definitivamente. Necesita una carpeta de papelera: la que el servidor marca
  `\Trash`, o si no los nombres propios del proveedor (Yandex: «Удалённые»). Un mensaje que ya está en la papelera se
  cuenta como `in_trash` y se deja.
- **Reglas.** `rules add --domain shop.example --do envelope` conserva solo el sobre de ese correo; `rules apply --yes`
  recorta el correo ya guardado. `messages delete --rules` mueve entonces el correo de sobre a la papelera, decidiendo de
  nuevo cada correo: se queda cuando coincide una regla de protección o de conservación, respondiste al remitente, está
  destacado, es importante, enviado o un borrador, lleva una etiqueta tuya o tiene menos de 30 días; las etiquetas y
  estrellas de Gmail se leen de nuevo justo antes del movimiento. Se niega hasta que la copia de seguridad del almacén
  tenga menos de 8 días, y una primera ejecución mueve como máximo 100.
- **Carpetas.** `folders delete` es una vista previa hasta `--yes`, y rechaza una carpeta que aún contiene correo, o cuyo
  recuento el servidor no da; `--allow-dangerous` la borra con su correo, para siempre (fuera de Gmail, el correo se
  pierde). Solo tú pasas `--allow-dangerous`, en una terminal: un agente por MCP nunca lo recibe. La bandeja de entrada
  y las carpetas especiales conservan su nombre.

## Borradores

Un borrador va a la carpeta Borradores del propio buzón, así que aparece en cualquier aplicación de correo. Lo escribe un
agente; tú lo lees y lo envías desde tu aplicación de correo, o con `drafts send`.

```sh
mail ya drafts create --to anna@example.com --subject 'Monday' 'Shall we meet at ten?'
mail ya drafts create --reply-to '<ref>' --reply-all 'Thanks, agreed.'   # in the thread, to everyone but you
mail ya drafts create --to anna@example.com --subject Notes - < notes.txt # - reads the text from stdin
mail ya drafts list                                                       # newest first, read from the server
mail ya drafts update '<id>' 'New text'                                   # only what you give changes
mail ya drafts delete '<id>' --yes                                        # gone for good; a preview without --yes
```

- **El id** es el Message-ID del borrador, tal como lo muestra `drafts list`, con o sin `<>`. No cambia cuando cambia el
  borrador.
- **Una respuesta** lee el mensaje del servidor: va a su Reply-To o remitente (con `--reply-all` también a todos los demás
  a quienes fue, nunca a ti), con `Re:` y los `In-Reply-To` y `References` que lo mantienen en el hilo.
- **Un cambio** guarda primero la versión nueva y luego mueve la anterior a la papelera, así que un fallo en medio deja
  dos borradores, nunca ninguno, y el texto antiguo aún se puede encontrar. El texto, `--to`, `--cc`, `--bcc` y
  `--subject` que des sustituyen a los anteriores; lo demás, el hilo y los adjuntos se quedan. Necesita una carpeta de
  papelera.
- **Borrar** es para siempre: `drafts delete` y `drafts send` eliminan el borrador con UID EXPUNGE, que necesita UIDPLUS
  en el servidor.
- **La carpeta** es la que el servidor marca `\Drafts`, o si no el nombre propio del proveedor (Gmail «[Gmail]/Drafts»,
  Yandex «Черновики»).
- Un borrador lleva las marcas `\Draft` y `\Seen`. `drafts.delete` pregunta antes; `drafts.create` y `drafts.update`
  siguen adelante, y `MAIL_READ_ONLY=1` rechaza los tres.

## Tus propias etiquetas

Las etiquetas propias van en el correo guardado y se quedan en este ordenador: el servidor nunca las ve. Son las mismas
etiquetas que lee memo, y una búsqueda las encuentra.

```sh
mail ya tags add invoices --message '<ref>'     # one email; --chat '<conversation ref>' tags a whole conversation
mail ya search messages 'tag:invoices date>30d'
mail ya tags list tag:invoices                  # what is tagged; type:message or type:chat
mail ya tags remove invoices --message '<ref>'
```

Una etiqueta tiene de 1 a 32 letras a–z, dígitos y guiones; las mayúsculas se pasan a minúsculas. Lo que guarda el
servidor son las palabras clave (`messages update --flag '$Work'`) y, en Gmail, las etiquetas (`messages move|copy --folder Work`).

## Enviar, responder y reenviar

`mail` envía por el servidor SMTP del proveedor con la contraseña de aplicación del perfil; el servidor sale de la
[lista de proveedores](./providers.md), o de `smtp_host`, `smtp_port` y `smtp_security` en el perfil.

```sh
mail ya messages send --to ann@example.com --subject Lunch "See you at noon."
echo "The report." | mail ya messages send --to ann@example.com --subject Report --file ./report.pdf
mail ya messages send --reply-to '<ref>' "Paid today."                # Re:, In-Reply-To, References, the quote
mail ya messages send --reply-to '<ref>' --reply-all "Thanks, all."   # also to the original's To and Cc, not you
mail ya messages forward '<ref>' --to bob@example.com "FYI"           # the original attached whole
mail ya messages send --to ann@example.com --subject Hi "Hello" --dry-run   # build it, send nothing
mail ya drafts send '<draft id>'                                     # send a saved draft, then remove it
```

- **La pregunta.** El correo para cualquiera que no seas tú pregunta antes, y muestra remitente, to, cc, bcc, asunto, cada
  adjunto y las primeras líneas del texto; `--yes` la responde. Sin terminal responde `confirmation_required`.
  `config set permissions.messages.send.others allow` desactiva la pregunta. El correo solo para ti nunca pregunta.
- **Agentes.** Por MCP un agente puede escribir, responder, reenviar y enviar borradores solo a ti; el correo para
  cualquier otra persona responde `permission_error` hasta que fijes `messages.send.others` en la configuración.
- **Archivos.** `--file` toma una ruta tal como la nombras; `mail` nunca expande un patrón. Las carpetas de credenciales
  (`.ssh`, llaveros, perfiles de navegador) y las de WireCat se rechazan salvo con `--allow-any-file`, que solo tú pasas en
  una terminal: un agente por MCP nunca lo recibe. Un texto que dice «adjunto» sin archivo provoca una advertencia.
- **Enviados.** Gmail archiva en Sent el correo enviado por SMTP. En otros proveedores `mail` añade su copia, con la
  línea Bcc, salvo que Sent ya tenga ese Message-ID. Luego el mensaje se lee en el almacén, así que `search messages` lo
  encuentra al instante.
- **Una respuesta perdida.** Si la conexión se corta después de que el mensaje salió, la respuesta es `outcome_unknown`
  con un `operation_id`. Ejecuta el mismo comando con `--operation-id <id>`: cuando Sent tiene el mensaje, no se envía
  nada otra vez. En un proveedor que no archiva por sí mismo el correo enviado, el primer intento puede haber salido;
  mira en el correo del destinatario antes de reintentar.
- **Adjuntos.** `attachments list '<ref>'` numera los archivos de un correo; `attachments download '<ref>'
  --output-dir ./folder` los guarda, legibles solo por ti, con sus nombres sencillos; `attachments download '<ref>' 2
  --output-dir ./folder` guarda solo el segundo. Los bytes vienen del
  servidor y nunca van al almacén. Un archivo existente se queda salvo con `--replace`.
