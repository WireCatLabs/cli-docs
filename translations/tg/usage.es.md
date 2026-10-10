---
title: "Cómo usar tg"
---

<a id="para-scripts-y-agentes" />
<a id="perfil-de-una-persona" />
<a id="es-un-bot-esta-cuenta" />
<a id="contexto-local-de-una-persona" />
<a id="a-persons-profile" />
<a id="is-this-account-a-bot" />
<a id="local-person-context" />

tg le permite a usted, o a su agente de IA, leer y escribir su propia cuenta de Telegram desde la terminal. Esta página es el recorrido: desde el primer inicio de sesión hasta la lectura, envío y ejecución de grupos, en el orden en que lo necesitará. Ábrelo cuando empieces con tg, o cuando quieras saber qué es posible antes de preguntarle a tu agente.

Después de leerlo, sabrás cómo nombrar un chat, cómo leer y buscar sin que nadie vea que miraste, cómo enviar de forma segura y cómo obtener respuestas que un script puede usar. Cada comando y opción se encuentra en la [referencia de comando](./commands.md); esta página explica cómo encajan.

Términos utilizados en esta página:

- **Perfil**: una cuenta de Telegram configurada en esta computadora, con su propio inicio de sesión y configuración. La primera palabra de un comando la selecciona ([perfiles](#profiles-the-first-word)).
- **Chat**: cualquier conversación: un chat individual, un grupo, un canal o Mensajes guardados.
- **Almacén local**: la base de datos de esta computadora donde tg guarda cada mensaje que lee ([el almacén local](./archive.md)).
- **Control de envío**: comprueba cada envío aprobado: un perfil de solo lectura, la lista de destinatarios permitidos y un límite por hora ([el control de envío](./security.md#the-send-guard)).

Cada comando realiza una tarea, imprime la respuesta y termina. Solo `tg watch`, `tg serve` y `tg mcp` permanecen activos, y cada uno lo indica.

```sh
tg [profile] [options] <resource> <action> [arguments]
```

## Qué puedes hacer

| Área | Qué puedes hacer | Empezar con |
|---|---|---|
| Leer | chats, mensajes, un mensaje y sus vecinos, temas del foro | `tg chats list`, `tg messages list <chat>` |
| Ponerse al día | mensajes no leídos de otras personas; lo que prometiste y lo que está abierto | `tg inbox`, `tg review` |
| Voz | convierte mensajes de voz en texto, en esta computadora | `tg messages transcribe` |
| Archivos | descargar los archivos de un mensaje o de un chat completo | `tg messages download` |
| Personas | contactos, el perfil de una persona, un bot check | `tg contacts list`, `tg contacts profile` |
| Buscar | mensajes, archivos, fechas, personas; discusiones por significado | `tg search messages`, `tg search conversations` |
| Enviar | texto, archivos, voz, respuestas, mensajes programados | `tg messages send` |
| Cambiar | editar, reenviar, anclar, eliminar, reaccionar, votar, marcar como leído | `tg messages edit`, `tg reactions add` |
| Organizar | carpetas | `tg chats folders list` |
| Grupos | miembros, enlaces de invitación, solicitudes de participación, temas, administradores | `tg chats members list`, `tg chats link create` |
| Seguir | nuevos mensajes a medida que llegan; mantener actualizado el archivo local | `tg watch`, `tg server start` |
| Consultar | lo que hizo un comando; qué puede hacer un perfil | `tg runs list`, `tg config show` |

## Lee un chat con tu agente

Con la cuenta conectada, pide un resumen breve. Esta tarea lee mensajes y no envía nada.

**Tu petición:**

> Usa tg CLI. Resume los cinco últimos mensajes de Book club. Muestra decisiones y preguntas pendientes. No envíes nada.

**Comando:**

```sh
tg messages list "Book club" --limit 5 --json
```

**Ejemplo de respuesta del agente:**

> **Decisión:** la próxima reunión será el jueves a las 18:00.
>
> **Pendiente:** dónde reunirse.
>
> Puedo mostrar los mensajes que sustentan el resumen. No se ha enviado nada.

El resumen anterior es ficticio. Pídale al agente que abra los mensajes fuente antes de confiar en su interpretación. La configuración, las acciones de mensajes y los permisos se explican en las secciones siguientes.

## Primeros pasos

```sh
npm install -g @leemour/tg-cli
```

```sh
tg setup                  # guided app registration, login and agent skill
```

```sh
tg chats list --limit 5   # your newest chats
```

```sh
tg messages list me       # Saved Messages, the latest 20
```

Espere unos cinco minutos para la configuración. Las descargas del historial son independientes: elige un chat y una cantidad de mensajes antes de `tg store fetch <chat> --last 100`. Un agente puede leer `tg skill show` sin iniciar sesión; `tg setup --agent codex` selecciona explícitamente la skill para un agente. `tg setup --help` explica las banderas. No hace falta nada más para leer.

Para consultar los argumentos de una tarea, usa `tg commands search messages --json` para
un comando o `tg commands messages --json` para un grupo. Ambos incluyen las opciones globales
y los códigos de salida. Consulta cada ruta de comando en una llamada separada;
`tg commands --json` devuelve todo el árbol.

## Iniciar sesión

`tg setup` es el comando para el primer uso. Por defecto registra la aplicación automáticamente y usa un QR; `--app browser` y `--method phone` eligen los otros métodos. Para iniciar sesión sin los demás pasos, o terminar un acceso interrumpido o caducado:

```sh
tg session start                        # QR code: Settings → Devices → Link Desktop Device
```

```sh
tg session start phone                  # phone number, the code Telegram sends, your 2FA password
```

```sh
tg session start phone --sms            # the same, asking for the code by SMS instead of in the app
```

```sh
tg session start --qr-file login.png    # the QR code as a picture, for an agent to show you
```

El primer inicio de sesión también solicita su propia aplicación Telegram desde my.telegram.org; `--app auto` completa el sitio por usted. Ambos pasos, y qué se guarda dónde: [login, sesiones y perfiles](./sessions.md).

**Los secretos nunca se introducen como argumentos.** El hash de la aplicación y la contraseña 2FA se solicitan sin mostrarlos; el código y el teléfono se solicitan o se leen por stdin. Los argumentos son visibles para todos los procesos mediante `ps` y quedan en el historial de la terminal.

Para CI, `TG_API_ID` y `TG_API_HASH` proporcionan la aplicación sin usar el llavero y tienen prioridad sobre él.

```sh
tg account show                # who this profile is logged in as; the phone as its last four digits
```

```sh
tg account show --show-phone   # the whole phone number
```

```sh
tg account list                # every profile on this computer and the account each is logged in as
```

```sh
tg account sessions list       # every device and app logged in to the account; ends nothing
```

```sh
tg session end                 # log out on Telegram's side, and delete the session here
```

`session end` también cierra la sesión en Telegram: el dispositivo desaparece de la lista de la aplicación. Para cerrarla desde otro dispositivo, usa Ajustes → Dispositivos.

## Perfiles: la primera palabra

Puedes utilizar varias cuentas. El perfil es la primera palabra, no una opción:

```sh
tg chats list             # profile "default"
```

```sh
tg work chats list        # profile "work"
export TG_PROFILE=work    # or for a whole shell session
```

**La primera palabra es el perfil si no es un comando.** Por eso un perfil no puede llamarse `chats`: el nombre se rechaza con una explicación. Los nombres admiten letras, cifras, puntos, guiones y guiones bajos.

Cada perfil tiene su propia sesión, su propia aplicación, su propia configuración y su propia lista de destinatarios permitidos. `TG_PROFILE_LOCK` fija un proceso a un perfil, por lo que un agente no puede elegir uno con menos límites ([perfiles](./profiles.md)).

## Cómo indicar un chat

Cuando un comando acepta `<chat>`, puedes usar:

- Un título completo o parcial: `"Book club"`, `book`.
- Un identificador: `-1001234567890`.
- Un nombre de usuario: `@example_channel`.
- `me` para Mensajes guardados.

Si el título coincide con varios chats, el error muestra los candidatos y sus identificadores. `tg` nunca adivina: un mensaje enviado a la conversación equivocada no se puede deshacer. Repite con el identificador. Este no cambia, así que úsalo una vez que lo tengas.

`messages show` y `messages context` también aceptan un localizador `msg:` en lugar del chat e identificador, como el que devuelve `search messages --json` en cada resultado.

Una persona (`<person>` en `contacts show`) puede indicarse por identificador, `@username` o parte de su nombre.

## Leer

**Leer no marca como leído.** Ningún comando siguiente muestra a otros que has mirado. Solo lo hacen `tg chats mark-read` y `tg messages list --mark-read` ([más abajo](#marking-a-chat-read)).

### Chats

```sh
tg chats list                              # newest first, archived chats included
```

```sh
tg chats list --unread --kind group        # only groups with unread messages
```

```sh
tg chats list --search book                # titles containing "book"; at least 3 characters
```

```sh
tg chats show "Book club"                  # kind, unread count, last message, who is in it
```

`--kind` acepta `dialog` (individual), `group`, `channel` o `saved`. Los filtros se aplican a todos los chats devueltos. Los grupos y canales tienen [su propia sección](#groups-and-channels).

### Mensajes

```sh
tg messages list "Book club"                    # the latest 20, oldest first
```

```sh
tg messages list "Book club" --limit 50
```

```sh
tg messages list "Hiking" --topic 12            # one forum topic; topics list shows the ids
```

```sh
tg messages show "Book club" 4242               # one message
```

```sh
tg messages context "Book club" 4242            # it, and 5 messages either side
```

```sh
tg messages context "Book club" 4242 --before-n 2 --after-n 10
```

En `context`, el mensaje consultado se marca con `◀` en la terminal y `"anchor": true` en JSON.

`--topic` lee hacia atrás desde el mensaje más reciente del tema o desde `--before-id`. Se rechaza el tema General (`1`): Telegram no asigna un ID de tema a sus mensajes, así que lee el chat completo. Con `--offline`, `--topic` selecciona los mensajes guardados de ese tema.

### Enlaces a mensajes

`tg messages link <chat> <message>` o `tg messages link <msg:locator>` devuelve `{ locator, url, access, reason }`. Los enlaces permanentes de canales y supergrupos pueden ser públicos o restringidos; un enlace no otorga membresía. Los diálogos, grupos básicos y mensajes guardados devuelven un localizador. Sin conexión valida el objetivo almacenado y no devuelve ningún enlace permanente. Se rechaza un localizador para otra cuenta. Este comando singular difiere de `messages links`, que explica las relaciones de conversación ([búsqueda de tema](./topic-search.md)).

### Qué necesita respuesta

```sh
tg inbox                     # other people's unread messages, in every chat
```

```sh
tg inbox --since-time 2h     # everything that came in during the last two hours
```

```sh
tg inbox --new               # what arrived since the last --new — for scheduled runs
```

```sh
tg inbox --new --jsonl       # the same for a script: one message per line
```

`inbox` muestra mensajes de otras personas, nunca los tuyos, indicando su chat. Omite chats silenciados y archivados salvo que te mencionen o respondan; `--all` los incluye. Por stderr indica cuántos omitió.

**`inbox --new` mueve un punto guardado.** El siguiente `--new` empieza donde terminó este, de modo que cada mensaje se muestra una vez. El primer `--new` mira 24 horas atrás. `inbox` sin `--new` e `inbox --since-time` no mueven el punto. `inbox` normal devuelve lo mismo hasta que los mensajes se lean en la aplicación, ya que no marca nada como leído.

Cada ejecución lee como máximo 20 chats. Los demás aparecen por stderr y en `skipped`, con el comando para consultar uno. Si un chat tiene más de `--limit` pendientes, muestra los más recientes e indica por stderr cómo leer el resto.

### Compromisos pendientes: `review`

```sh
tg review                                  # the last 3 days
```

```sh
tg review --since-time 2026-09-23T09:00    # from where the last review ended
```

```sh
tg review --chat "Book club" --json
```

Muestra todos los mensajes —tuyos y ajenos— en los chats con actividad desde `--since-time`. Sirve para revisar qué prometiste, qué esperas de otros y qué falta aclarar; clasificarlos corresponde a ti o al agente. No marca como leído.

Al terminar indica por stderr desde cuándo y hasta cuándo leyó. **Empieza la siguiente revisión desde ese `--since-time`** para no dejar huecos. Si la revisión está incompleta —demasiados chats o un chat limitado a los 300 mensajes más recientes— lo avisa; conviene no adelantar el punto de inicio. Lee como máximo 20 chats por ejecución.

#### Preguntas sin respuesta

```sh
tg review --unanswered                     # questions nobody answered in 24 hours
```

```sh
tg review --chat "Neighbours" --unanswered 4h
```

`--unanswered [hours]` conserva solo las preguntas pendientes de ti o de los administradores de un grupo. Una pregunta es un mensaje con `?` (no cuenta el `?` de un enlace) o una respuesta a ti o a un administrador. Se considera respondida cuando tú o un administrador respondéis a ella o sois los siguientes en hablar tras quien preguntó. Se excluyen las preguntas de menos horas que las indicadas (24 por defecto): aún no ha habido tiempo para responder. Si no se conocen los administradores del grupo, el comando lo indica y solo cuentan tus respuestas.

Las transcripciones de voz guardadas también cuentan en este filtro. Agregue `--transcribe` para transcribir mensajes de voz que no tengan una transcripción guardada antes de seleccionar las preguntas. Un mensaje de voz que no se pudo transcribir mantiene la revisión incompleta: un resultado vacío no prueba que no haya preguntas sin respuesta. Mantenga el límite anterior hasta que `complete` sea verdadero.

### Mensajes de voz

```sh
tg messages transcribe "Book club" 4242          # by Telegram where it can, else a model here
```

```sh
tg messages transcribe "Book club" 4242 --local  # only the model on this machine
```

```sh
tg messages list "Book club" --transcribe        # every voice message shown that has no text yet
```

```sh
tg inbox --transcribe
```

```sh
tg review --transcribe
```

```sh
tg messages list "Book club" --transcribe --model gigaam-v3
```

Telegram transcribe para cuentas Premium y algunos mensajes semanales con su prueba gratuita. Si no está disponible, lo hace un modelo local y la grabación no sale del equipo. El modelo se descarga una vez, solo cuando lo pides:

```sh
tg models audio list                   # the models, which is downloaded, which is the default
```

```sh
tg models audio download parakeet-v3   # once, checked against the sha256 this version expects
```

| Modelo | Idiomas | Tamaño |
|---|---|---|
| `parakeet-v3`: predeterminado | 25: búlgaro, checo, danés, alemán, griego, inglés, español, estonio, finés, francés, croata, húngaro, italiano, lituano, letón, maltés, neerlandés, polaco, portugués, rumano, ruso, eslovaco, esloveno, sueco y ucraniano | 670 MB |
| `gigaam-v3` | ruso; el mejor de los tres para ruso | 232 MB |
| `gigaam-v3-ctc` | ruso; algo más rápido, con peor uso de mayúsculas | 225 MB |

`--model` elige otro modelo para un comando, al lado de `--transcribe` o en `messages transcribe`; `transcribeWith` y `speechModel` en la configuración eligen los valores predeterminados ([configuración](./configuration.md)). Una transcripción se guarda en el archivo local y se reutiliza en listas de mensajes, bandejas de entrada y revisiones. Llamar nuevamente a `messages transcribe` puede solicitar una nueva transcripción o ejecutar el reconocimiento nuevamente. `--transcribe` puede tardar unos minutos.

### Archivos

```sh
tg messages download "Book club" 4242 --output-dir ~/Downloads   # one message's files
```

```sh
tg messages download "Book club" --all --output-dir ~/tg-files   # every file of the chat, newest first
```

Se guardan fotos, archivos, vídeos y notas de voz; la carpeta se crea si falta. Un archivo mantiene su propio nombre; uno sin nombre recibe la identificación del mensaje. **Una descarga nunca sobrescribe un archivo.** Con `--all`, un nombre ya tomado recibe la identificación del mensaje al frente. `--all` recuerda dónde se detuvo en un pequeño archivo al lado de las descargas y el mismo comando continúa desde allí. Sólo usted puede leer los archivos guardados. Envío de archivos, formatos y texto de búsqueda: [archivos adjuntos](./attachments.md).

### Personas

```sh
tg contacts list                       # people you have a one-to-one chat with, newest first
```

```sh
tg contacts list --order name --search ann
```

```sh
tg contacts show @example_user         # their bio and the chats you share
```

```sh
tg contacts lookup                     # who has a phone number — asks for it, or reads it from stdin
```

```sh
tg contacts sync                       # your whole Telegram contact list into the local store
```

```sh
tg contacts profile @example_user      # flags, last seen, registered, messages per shared chat
```

```sh
tg contacts context @example_user --chat "Book club"   # their latest messages there
```

```sh
tg contacts check @example_user        # does the account look like a bot or a spammer
```

`contacts list` son las personas con las que tienes una conversación individual. `contacts sync` también incluye el resto de tu lista de contactos de Telegram. `contacts lookup` nunca toma el número como argumento: introdúzcalo o escríbalo cuando se le solicite. El perfil de una persona, sus mensajes recientes, el bot check y lo que envía a dónde: [personas](./people.md).

Para cambiar contactos y tu perfil:

```sh
tg contacts add @example_user          # under the name they show
```

```sh
tg contacts rename @example_user Ann "from work"   # a name only you see
```

```sh
tg contacts remove @example_user       # the chat stays
```

```sh
tg contacts block @example_user        # they need not be a contact
```

```sh
tg contacts unblock @example_user
```

```sh
tg contacts import people.txt          # one "number, name" per line; never numbers as arguments
```

```sh
tg account update --first-name Ann --description "about me" --photo me.jpg
```

```sh
tg account sessions end --others       # logs out every other device, your phone too; asks first
```

`contacts import` indica cuántos envió y a quién reconoció Telegram, nunca teléfonos. `account sessions
end` pregunta antes de actuar; `--yes` aprueba en un script.

### Páginas

Las listas muestran `limit` filas (20 por defecto). `chats list`, `contacts list`, `chats members list` y `topics` aceptan `--page` y `--all`:

```sh
tg contacts list --limit 5             # five a page
```

```sh
tg contacts list --limit 5 --page 2    # the sixth to the tenth
```

```sh
tg contacts list --all                 # every row, no paging
```

⚠ **La paginación de una lista activa puede repetir u omitir filas.** Los más recientes van primero; un mensaje entre la primera y segunda página puede cambiar quién aparece en cada una.

**Los mensajes no usan números de página: usan `--before-id`, `--after-id` y `--after-time`**, que permiten continuar con precisión:

```sh
tg messages list "Book club" --before-id 4242   # older than message 4242
```

```sh
tg messages list "Book club" --after-id 4242    # newer than 4242, oldest first
```

```sh
tg messages list "Book club" --after-time 2h    # what came in during the last two hours
```

```sh
tg messages list "Book club" --after-time 2026-09-20T09:00
```

```sh
tg messages list "Book club" --before-time 1d   # what came before this time yesterday
```

En la terminal, las indicaciones para la página siguiente van por stderr. `--before-id` y `--after-id` aceptan identificadores. `--after-time` acepta ISO 8601 o un intervalo anterior: `30m`, `2h`, `1d`. En `messages context`, `--before-n` y `--after-n` son cantidades de mensajes, porque el punto de referencia ya es el mensaje.

### Encontrar un chat antes de escribir

```sh
tg chats list --search book --kind group     # groups with "book" in the title
```

```sh
tg contacts list --search ann                # people by name or @username
```

```sh
tg search all "contract"                     # messages, mail and notes this machine has kept
```

```sh
tg search messages "contract"                # the text of every message this machine has kept
```

```sh
tg search messages "contract" --chat "Book club"
```

```sh
tg search messages "invoice.*(march|april)" --regex
```

Las búsquedas de chat y contactos necesitan **al menos tres caracteres**. `search messages` utiliza el [lenguaje de consulta de búsqueda](./query-language.md): `invoice` también encuentra otras formas de la palabra, `invoic*` busca comienzos y `exact:invoice` solo esa forma. Lee lo que `serve` obtuvo o guardó y también solicita la búsqueda propia de Telegram (`--backend archive` solo para el archivo local). En su lugar, `--regex` trata las palabras como una expresión regular de JavaScript. Más: [búsqueda de mensajes](./search.md). Una vez que tengas el chat, usa su id.

## Enviar

**No se envía nada a menos que hayas escrito un comando que envíe**, y no pide confirmación: el chat y el texto ya están en la línea que escribiste. Cada envío pasa por el control de envío: un perfil de solo lectura, la lista `allow` del perfil, la lista de destinatarios permitidos y el límite por hora ([el control de envío](./security.md#the-send-guard)). Se registra cada intento, nunca su texto: `tg sends list`.

```sh
tg messages send me "a note to myself"
```

```sh
tg messages send "Book club" "See you at 7" --silent       # no notification
```

```sh
tg messages send "Book club" "a link, no card" --no-preview
```

```sh
tg messages send "Book club" "**Bold** and _italic_" --md  # Telegram Markdown
```

```sh
tg messages send "Book club" "<b>Bold</b> and <i>italic</i>" --html
```

`--md` utiliza el formateador de Telegram: `**bold**` o `*bold*`, `_italic_`, `__underline__`, `~~struck~~` o `~struck~`, `||spoiler||`, código en línea, código delimitado con un idioma, `[label](https://example.com)` y líneas de cita que comienzan con `> `. Los estilos pueden anidar; code/pre no puede anidarse con otras entidades, los enlaces no pueden anidarse y las comillas no pueden anidarse. Sin la bandera, el texto permanece como se escribió. La barra invertida escapa de una marca; Los `_` y `*` internos de palabra permanecen literales. Las marcas en línea abiertas permanecen literales; Se rechaza una valla abierta. Los enlaces admiten URL absolutas http, https y mailto. `messages edit` y los subtítulos multimedia utilizan el mismo formateador. Telegram `__text__` está subrayado; MAX `__text__` está en negrita. Un solo `*text*` está en negrita en Telegram.

`--html` interpreta el texto como HTML de Telegram, el mismo que el de Bot API: `<b>`, `<i>`, `<u>`, `<s>`, `<a href>`, `<code>`, `<pre language="…">`, `<blockquote>` y `<tg-spoiler>`. Los saltos de línea y los espacios se mantienen tal como los escribes. Se rechaza un enlace de mención (`tg://user?id=`) o un emoji personalizado. `--md` y `--html` no se pueden combinar. `messages edit` también acepta `--html`.

### Texto desde stdin

Si omites el texto, se lee por stdin. Es la única forma de enviar varias líneas y evita que aparezca en `ps` y en el historial:

```sh
printf 'first line\n\nthird line' | tg messages send me
tg messages send "Book club" < note.txt
```

### Programar un envío

```sh
tg messages send "Book club" "Tomorrow" --at-time 2026-10-01T09:00   # local time
```

```sh
tg messages send "Book club" "In two hours" --at-time 2h        # or 30m, 1d from now
```

```sh
tg messages scheduled "Book club"                               # what waits to be sent there
```

`--at-time` entrega el mensaje a Telegram, que lo enviará incluso con el equipo apagado. La hora se redondea hacia abajo al minuto. Rechaza plazos inferiores a un minuto o superiores a un año. El mensaje cuenta para el límite en la hora en que Telegram lo envía. **Cancélalo o modifícalo en la aplicación de Telegram**; `tg` no lo hace.

### Archivos, fotos y voz

```sh
tg messages send "Book club" "The agenda" --file agenda.pdf   # byte for byte; the text is the caption
```

```sh
tg messages send "Book club" --photo picture.jpg              # recompressed by Telegram
```

```sh
tg messages send "Book club" --file trip.mp4                  # a video plays in the chat
```

```sh
tg messages send "Book club" --file trip.mp4 --as-file        # the same video as a file to download
```

```sh
tg messages send "Book club" --voice note.ogg                 # a voice message, alone, with no text
```

```sh
tg messages send "Book club" --file 3f9a.pdf --filename "Report Q3.pdf"   # the name others see
```

`--photo` acepta `.jpg`, `.png` o `.webp`. Un `.mp4` o `.mov` pasado con `--file` se envía como vídeo salvo que añadas `--as-file`. `--voice` acepta un archivo Ogg Opus (`.ogg`, `.oga`, `.opus`) y se envía solo: sin texto ni otro archivo. Se rechazan los archivos y carpetas ocultos, `~/.ssh`, las carpetas de `tg` y el almacén local salvo que añadas `--allow-any-file`: ahí se guardan claves y tokens.

`--spoiler` difumina una foto o un vídeo hasta que se toca; un documento o un mensaje de voz no pueden aceptarlo. `--caption-above` muestra el texto encima de la foto o archivo. Solo los bots pueden proteger un mensaje para impedir que se reenvíe; Para proteger el contenido, active la configuración propia del chat en Telegram. Formatos, descargas y búsqueda de texto dentro de archivos: [archivos adjuntos](./attachments.md).

### Responder a un mensaje

```sh
tg messages send "Book club" "Agreed" --reply-to 4242
```

Una respuesta es un envío: admite todas sus opciones.

### Reacciones y encuestas

```sh
tg reactions add "Book club" 4242 👍       # replaces the reaction you had
```

```sh
tg reactions remove "Book club" 4242
```

```sh
tg polls show "Book club" 4250             # the poll and its answer ids
```

```sh
tg polls voters "Book club" 4250 --answer <answer id>   # who chose it; not in an anonymous poll
```

```sh
tg polls vote "Book club" 4250 <answer id>
```

```sh
tg polls vote "Book club" 4250 --retract
```

```sh
tg polls create "Book club" "Which day?" Monday Tuesday --anonymous
```

```sh
tg polls create "Book club" "Pizza now?" yes no --close-time 5m   # closes by itself; 5s to 10m
```

```sh
tg polls close "Book club" 4250            # your own poll; it cannot be reopened
```

```sh
tg polls create "Book club" "2+2?" 3 4 5 --quiz --correct 2 --solution "Four."   # a quiz; a vote is final
```

Al leer un chat, las reacciones aparecen bajo el mensaje: `👍 3  🔥 1  (you: 🔥)`. Votar en una encuesta pública muestra tu nombre a todos en el chat. Vota con los ID que imprime `polls show`, nunca por la posición de una respuesta. `--multiple` permite elegir varias respuestas. Solo se puede cambiar el voto en una encuesta creada con `--revote`. Se rechazan antes de enviar nada: votar en una encuesta cerrada, elegir dos respuestas en una de respuesta única, cambiar o retirar un voto definitivo y usar `--retract` sin haber votado; también se rechaza cerrar una encuesta ajena.

### Editar, reenviar, fijar y eliminar

```sh
tg messages edit "Book club" 4242 "the corrected text"      # your own message; --md or --html as in a send
```

```sh
tg messages forward "Book club" 4242 --to me                # checked against the chat it goes to
```

```sh
tg messages forward "Book club" 4242 --to "Hiking" --topic 12   # into one topic of a forum
```

```sh
tg messages pin "Book club" 4242                            # quiet unless --notify
```

```sh
tg messages unpin "Book club" 4242
```

```sh
tg messages delete me 4242 4243 --allow-dangerous           # at most 10, for you only
```

```sh
tg messages delete me 4242 --allow-dangerous --for-everyone
```

Una edición llega a personas que quizá ya leyeron el texto anterior. Un reenvío es un mensaje nuevo y pasa por la misma protección aplicada al chat de destino. Las eliminaciones no se pueden deshacer: por eso preguntan primero. Responde `y` o añade `--allow-dangerous`. En supergrupos y canales Telegram solo elimina para todos; allí solo funciona `--for-everyone`.

**Qué cuenta para el límite por hora:** un mensaje, un reenvío, una edición, una fijación con notificación, una nueva encuesta, el cierre de una encuesta y cada mensaje eliminado. No cuentan una reacción, un voto ni una fijación silenciosa.

### Si no se conoce el resultado

El código `14` significa que la conexión se interrumpió después de salir el mensaje: **puede haber llegado**. El error incluye `--send-id`. Repite con ese identificador para que Telegram descarte la segunda copia:

```sh
tg messages send "Book club" "See you at 7" --send-id <id from the error>
```

```sh
tg messages forward "Book club" 4242 --to me --send-id <id from the error>
```

Los reenvíos y encuestas también incluyen ese identificador. Repetir sin él envía otro mensaje. Un archivo se sube antes de enviar el mensaje: tg reintenta tres veces una subida interrumpida y, si aun así falla, el error dice que no se envió nada; ese comando puedes simplemente repetirlo. Las demás escrituras (fijar, reaccionar, marcar como leído, borrar, votar, carpetas, contactos) terminan igual con el código de salida `14` cuando Telegram no responde; el mensaje indica si es seguro repetir. Crear una carpeta no lo es: mira primero en `tg chats folders list` o puedes acabar con dos. Un envío con `--at-time` nunca se repite: consulta `tg messages scheduled <chat>`.

### Marcar un chat como leído

```sh
tg chats mark-read "Book club"               # up to the newest message
```

```sh
tg chats mark-read "Book club" --until 4242  # only up to this one
```

```sh
tg chats mark-read "Hiking" --topic 12       # only this forum topic
```

```sh
tg messages list "Book club" --mark-read     # read it, and mark it read up to the newest shown
```

La otra persona lo ve. Pasa por los controles como acción `read` y no cuenta para el límite por hora.

### Carpetas

```sh
tg chats folders list                              # your folders, in the order the app shows them
```

```sh
tg chats folders show "Trips"                      # one folder, with the names of its chats
```

```sh
tg chats folders create "Trips" --chat "Hiking" --chat @kate
```

```sh
tg chats folders update "Trips" --title "Travel" --add "Climbing" --remove @kate
```

```sh
tg chats folders delete "Travel"                   # the chats stay
```

```sh
tg chats folders order "Travel" "Work"             # these first; the rest keep their order after them
```

```sh
tg chats folders join https://t.me/addlist/AbCdEf  # a folder someone shared: joins every chat in it
```

```sh
tg chats folders create "Inbox" --include contacts,groups --skip muted,archived --emoji 📥
```

```sh
tg chats folders update "Inbox" --exclude-chat "Noisy group" --pin @kate
```

```sh
tg chats folders update "Inbox" --include none     # no kinds any more; only the chats named in it
```

Una carpeta se indica por su ID o su título exacto. Solo tú ves tus carpetas; cada cambio pasa igualmente por las comprobaciones como un cambio de `account`. `join` es distinto: las personas de esos chats ven que te has unido, como con `tg chats join`. «Todos los chats» mantiene su posición con `order`.

Una carpeta puede incluir automáticamente contacts, `non-contacts`, `groups`, `channels`, `bots` con `--include`; `--skip` excluye `muted`, read, `archived`. `--exclude-chat` excluye un chat concreto y `--pin` lo fija arriba. Al `update`, include/skip sustituyen las reglas anteriores y `--remove` quita el chat de todas las listas. Una carpeta compartida por enlace no admite reglas. `--emoji` debe ser un icono de carpeta de Telegram: los demás se descartan sin error y la respuesta muestra lo realmente guardado.

### Comentarios de un canal

```sh
tg messages comments "Rozetked" 27644              # the comments under post 27644, oldest first
```

```sh
tg messages comments "Rozetked" 27644 --before-id 3732413
```

```sh
tg messages send "My channel" "Thanks!" --comment-to 120
```

Los comentarios están en el grupo de discusión del canal: la respuesta lo identifica como `discussion`, y el comentario es una respuesta allí, por lo que la lista de destinatarios y el límite por hora lo contabilizan para ese grupo. Una publicación cuyo canal no tenga grupo de discusión o esté cerrada a comentarios termina con el código `6`.

### Publicar como un canal

En un grupo donde puedas publicar como uno de tus canales, consulta primero los remitentes disponibles y elige uno:

```sh
tg chats send-as "Book club"
```

```sh
tg messages send "Book club" "Meeting moved to 8" --send-as <id from the list>
```

La lista siempre te incluye, y `default` señala la opción guardada del grupo; leerla no cambia nada. Se rechaza un ID que no esté en la lista. `--send-as` también funciona con archivos, `tg messages forward` y `tg polls create`; para un reenvío, la lista corresponde al chat de `--to`. Para repetir una operación con resultado desconocido, pasa el mismo `--send-as` junto con `--send-id`.

Un grupo puede tener un canal guardado como remitente por defecto; Telegram lo hace para el grupo de discusión de tu canal. Allí, un envío, reenvío o encuesta **sin** `--send-as` se rechaza (código `2`) para evitar publicarlo como el canal: el error indica `--send-as <your id>` para publicar como tú y `--send-as <channel id>` para publicar como el canal.

### Funciones aún no disponibles

Varias fotos en un solo mensaje siguen en [próximas mejoras](./roadmap.md).

## Grupos y canales

Todo lo relacionado con un grupo que ejecuta (reglas de moderación, comprobaciones, la lista completa de configuraciones) está en [grupos que ejecuta](./groups.md).

```sh
tg chats inspect https://t.me/+AbCdEf              # where an invite or public link leads; does not join
```

```sh
tg chats members list "Hiking" --all               # everyone, with their role and when last seen
```

```sh
tg chats events "Hiking"                           # who joined, left, was added or removed — 7 days
```

```sh
tg chats events "Hiking" --type join,leave --since-time 2026-09-01T00:00
```

```sh
tg topics list "Hiking"                            # a forum group's topics, newest activity first
```

```sh
tg search topics "Hiking" "gear"
```

```sh
tg topics show "Hiking" 12                         # one topic: title, closed or pinned, last activity
```

```sh
tg review --chat "Hiking" --unanswered             # questions nobody answered
```

Todos estos sólo leen. `events` lee los mensajes de servicio del chat: quién hizo qué y a quién. Los nombres son `join`, `leave`, `add`, `remove`, `create`, `title` y `pin`.

Estos cambian algo y las personas en el chat lo ven.

Para un foro, utilice `tg topics enable <chat>` y `tg topics create <chat> <title>`. Un grupo básico requiere `--upgrade --yes`; mantenga la nueva identificación de chat devuelta por la actualización. Lea `topics list` después de un resultado de creación desconocido en lugar de repetir la creación. Enviar a su id con `tg messages send <chat> <text> --topic <id>` o `tg polls create <chat> <question> <answers> --topic <id>`. `tg topics edit <chat> <id> --title <new>` cambia el nombre de un tema, `--closed on`/`--closed off` lo cierra a nuevos mensajes o lo vuelve a abrir, `--pinned on`/`--pinned off` lo fija en la parte superior o lo desancla, y en el tema General (id 1) `--hidden on`/`--hidden off` lo oculta de la lista de temas o lo muestra nuevamente. `tg topics order <chat> <id...>` coloca los temas fijados en ese orden; no fija ni desancla nada. Repetir cualquiera de estos es seguro. `tg topics delete <chat> <id>` elimina un tema y todos los mensajes que contiene, para todos; no se puede deshacer, por lo que pregunta primero de forma predeterminada; un `topics.delete: allow` o `--allow-dangerous` explícito omite la pregunta. El tema general no se puede eliminar.

```sh
tg chats create "Hiking 2027" @olga 12345          # a supergroup; the people added are told
```

```sh
tg chats create "Trail news" --channel             # a channel; people join it by its link
```

```sh
tg chats join https://t.me/+AbCdEf                 # by an invite link, or a public one
```

```sh
tg chats leave "Hiking 2027"
```

```sh
tg chats update "Hiking 2027" --title "Hiking 2028" --description "routes and dates"
```

```sh
tg chats update "Hiking 2027" --all-can-pin off --only-admins-add on
```

```sh
tg chats link show "Hiking 2027"                   # the invite link, if you may see it
```

```sh
tg chats link reset "Hiking 2027"                  # a new one; the old one stops working
```

```sh
tg chats link create "Hiking 2027" --approval --expire-time 7d   # another link; who joins asks first
```

```sh
tg chats link create "Hiking 2027" --max-uses 20   # at most 20 people join by it
```

```sh
tg chats update "Hiking 2027" --join-approval on   # everyone asks first, by any link
```

```sh
tg chats requests list "Hiking 2027"               # who asked to join, newest first
```

```sh
tg chats requests list "Hiking 2027" --search Ana  # by name; or --link <link>, never both
```

```sh
tg chats requests accept "Hiking 2027" 67890       # let them in; decline turns them away
```

```sh
tg chats requests decline "Hiking 2027" --all      # every pending request at once; --link narrows it
```

```sh
tg chats link list "Hiking 2027"                   # your links, with how many joined and how many wait
```

```sh
tg chats link revoke "Hiking 2027" https://t.me/+AbCd   # stop one link
```

```sh
tg chats link update "Hiking 2027" https://t.me/+AbCd --no-approval --max-uses 50   # change only these
```

```sh
tg chats members add "Hiking 2027" @kate 67890     # they are told
```

```sh
tg chats members remove "Hiking 2027" @kate        # their messages stay
```

```sh
tg chats admins add "Hiking 2027" @kate --can pin,delete
```

```sh
tg chats admins remove "Hiking 2027" @kate
```

Un grupo nuevo es siempre un supergrupo. Alguien cuya configuración de privacidad impide que se agreguen se menciona en la respuesta en `providerMetadata.notAdded`; el grupo está hecho de todos modos. `chats join` a un grupo cuyos administradores aprueban quién se une, responde `requested: true` y sale de `0`: la solicitud se envía y usted ingresa una vez que un administrador la acepta. Cada uno pasa por la guardia como un cambio `chat` y cada persona agregada cuenta para el límite por hora.

`chats link create` crea otro enlace de invitación y no se lo dice a nadie: `--approval` hace que quien se una pregunte primero, `--expire-time` lo detiene a la vez (`2026-12-01T09:00`, o `30m`, `2h`, `7d` a partir de ahora), y `--max-uses` deja entrar como máximo esa cantidad de personas. `chats link update` cambia los mismos tres en uno de sus enlaces, el del grupo también (`--no-approval` desactiva la aprobación, `--expire-time never` elimina la caducidad); lo que dejas afuera se queda. Un enlace que pregunta primero no tiene límite de uso, por lo que `--approval` con `--max-uses` es rechazado. `chats update --join-approval on` hace que todos pregunten primero, sea cual sea el enlace que utilicen.

En un grupo cuyos administradores aprueban quién se une, `chats requests list` muestra las solicitudes pendientes, con la nota que envió una persona; sólo los administradores los ven y la lectura no se lo dice a nadie. `--search` busca personas por nombre o @nombre de usuario, `--link` mantiene a quienes preguntaron a través de un enlace de invitación; Telegram no puede hacer ambas cosas a la vez. `accept` y `decline` responden uno, por el id de la lista. Una solicitud aceptada cuenta para el límite de horas, una rechazada no; la lista de destinatarios comprueba sólo el grupo. Alguien que ya es miembro recibe respuesta con `already: true` y una solicitud que desaparece termina en la salida `6`. `--all` responde a todas las solicitudes pendientes, o con `--link` las que llegaron por un enlace; se cuentan primero y una aceptación que supere el límite de horas se rechaza antes de que se permita la entrada a nadie. `chats link list` muestra sólo sus propios enlaces; Revocar el enlace del propio grupo hace que Telegram emita uno nuevo, como muestra la respuesta.

`chats update` cambia el título, la descripción y las dos configuraciones que tiene Telegram, de una sola vez; la respuesta es el grupo tal como está y `chats show` muestra la misma configuración. Las reglas de moderación, `chats rules` y `chats moderate`, se encuentran en [reglas de moderación](./groups.md#rules).

<a id="for-scripts-and-agents"></a>

## Salida: tablas, JSON y códigos de salida

**En una terminal `tg` imprime una tabla; en una tubería, o con `--json`, imprime un valor JSON en la salida estándar y nada más**: sin control giratorio, sin tic, sin advertencia. Las notas, advertencias y errores van a stderr en todos los modos. Esto es lo que permite que un script, o su agente, confíen en la respuesta.

```sh
tg chats list --json | jq -r '.items[].id'
```

```sh
tg messages list me --jsonl | jq -r .text     # one message per line
```

- `--json`: un valor JSON. **Cada lista es un objeto**, siempre la misma forma: `{ "items": [...], "page": 1, "limit": 20, "hasMore": true }`. `--all` y `--offline` responden con el mismo objeto.
- Los mensajes de un chat no tienen número de página: `{ "items": [...], "limit": 20, "hasMore": true }`.
- `--jsonl`: un objeto por línea, sin contenedor; si hay más se dice solo en stderr.
- Hay un error `{ "error": { "code": "...", "message": "..." } }` en stderr y la salida estándar está vacía, por lo que nunca se puede considerar un rechazo como un resultado vacío.
- **Bifurcación en el código de salida, no en el texto.** El texto cambia; el código no. `0` funcionó, `2` entrada incorrecta, `4` no inició sesión, `5` el perfil puede no hacer esto, `6` no encontrado, `7` no está en la lista de destinatarios permitidos, `8` un límite (el límite por hora o el propio Telegram), `9` Telegram no respondió a tiempo, `14` se desconoce si llegó algún mensaje. La tabla completa está en [códigos de salida](./commands.md#exit-codes).
- **Los identificadores son cadenas.** Nunca conviertas uno en un número.
- `--quiet` desactiva las notas; todavía se dice un fracaso. `-v` y `-vv` agregan detalles a la vista de tabla.
- `--timeout 30s` acota todo el comando (`500ms`, `30s` o `2m`).
- `tg commands --json` es el árbol de comandos completo, con `mutates: true` en cada comando que cambia algo en Telegram.

```sh
if ! tg messages send "Book club" "See you at 7" --json > /dev/null; then
  case $? in
    14) echo "it may have gone — repeat only with the same --send-id" ;;
    4)  echo "run tg session start" ;;
  esac
fi
```

## Conecte su agente de IA

Un agente de IA que ejecuta comandos en una terminal (por ejemplo, Claude Code, Codex o Gemini CLI) lee el archivo de skills de tg: las reglas y trampas que `--help` no puede explicar. `tg setup` lo instala, al igual que `tg skill install` (`--for claude`, `agents` o `all`, el valor predeterminado). Para instalarlo a mano:

```sh
mkdir -p ~/.claude/skills/tg-cli && tg skill show > ~/.claude/skills/tg-cli/SKILL.md   # Claude Code
mkdir -p ~/.agents/skills/tg-cli && tg skill show > ~/.agents/skills/tg-cli/SKILL.md   # Codex, Gemini CLI
```

Un agente sin terminal (por ejemplo Claude Desktop o Cursor) se conecta a través de MCP: [el servidor MCP](./mcp.md).

## Cómo se muestra una conversación

`tg messages list` y `tg search messages` imprimen una transcripción en la terminal:

```text
10:05:12  Anna
          Shall we call on Thursday?

10:09:03  Boris
          ↳ Anna: Shall we call on Thursday?
          Thursday works.
          📎 photo
          edited 10:09:30
```

Las horas son locales y una línea marca cada día nuevo. `↳` señala a qué responde el mensaje; `↪`, de quién se reenvió; `📎`, un adjunto. Los caracteres de control en mensajes y nombres se muestran como texto, sin ejecutarse. `-v` añade identificadores de mensaje, remitente y chat; `-vv`, todos los datos conocidos del mensaje.

## Recibir nuevos mensajes

```sh
tg watch                           # new messages, until Ctrl-C or --timeout
```

```sh
tg watch --jsonl                   # one message per line, as messages list --jsonl
```

```sh
tg watch --jsonl | ./on-message.sh
```

```sh
tg watch --events --jsonl          # edits, deletions and reactions too
```

```sh
tg watch --jsonl --timeout 2m      # a timeout ends it normally, with exit code 0
```

Con `--events`, cada línea incluye el tipo: `message`, `edit`, `delete` o `reaction`. Sin él, solo contiene el mensaje. Telegram no indica en qué chat se eliminó un mensaje de una conversación privada o grupo pequeño, por lo que esa línea no incluye chat.

**`watch` comienza a partir de ahora.** No se muestra lo que llegó mientras no había nada escuchando. Para mantener actualizado el archivo local, incluido lo que entró mientras esta máquina estaba apagada, use `serve`, en segundo plano o como servicio del sistema ([mantener el archivo local actualizado](./archive.md#keeping-it-current-serve)):

```sh
tg server start           # serve in the background; answers once it is connected
```

```sh
tg server status
```

```sh
tg server install         # a systemd user unit or a launchd agent; starts nothing
```

## Qué hizo un comando

```sh
tg --trace chats list          # show each request on stderr, keep nothing
```

```sh
tg --record chats list         # keep it, show nothing
```

```sh
tg runs list                   # what was kept, newest first
```

Siempre se conserva una ejecución fallida. Un registro contiene operaciones, identificadores, recuentos y duraciones; nunca un mensaje, un nombre, un título de chat, un número de teléfono o una clave. Completo: [diagnóstico](./diagnostics.md).

## Archivo local

Todo lo que lee `tg` se guarda en este equipo para poder responder sin red:

```sh
tg chats list --offline                           # only from the store, never connect
```

```sh
tg store fetch "Project Alpha" --estimate         # how much a fetch would take
```

```sh
tg store fetch "Project Alpha" --background       # a chat's history, as a job
```

```sh
tg store export "Project Alpha" --format markdown --output alpha.md
```

```sh
tg store backup ~/tg-store.db                     # a copy of the store, while it is in use
```

Un comando ordinario todavía consulta Telegram. `--offline` es para cuando no hay red, o cuando no se desea conectarse; Se rechaza un envío con `--offline`. Obtención, exportación, búsqueda, copia de seguridad y servicio: [el archivo local](./archive.md).

## Configuración y permisos del perfil

Los ajustes están en un `config.json` opcional. El orden de prioridad es: **opción → variable de entorno → perfil en el archivo → valores predeterminados del archivo → programa**.

```sh
tg config show                                 # every setting, and where it came from
```

```sh
tg config set limit 50
```

```sh
tg work config set permissions.messages readonly   # profile "work" changes no messages
```

```sh
tg config set permissions.messages.send ask        # a yes or no before each send
```

```sh
tg config set sendsPerHour 10
```

`permissions` dice lo que puede hacer un perfil, por comando: `deny`, `readonly`, `ask` o `allow`. Por defecto se permite todo, salvo algunos cambios irreversibles: eliminar mensajes y cerrar sesiones piden confirmación antes de actuar. Un rechazo es el código de salida `5` y el error nombra el comando que lo permite. **El archivo no tiene ningún campo para un secreto.** Cada configuración y variable: [configuración](./configuration.md).

## Una persona

`tg contacts profile <person>` muestra lo que dice Telegram sobre una persona y qué tan activa es en los chats que compartes. `tg contacts check <person>` los califica como posible bot, falso o spammer, con todos los motivos. `tg contacts context <person>` lee lo que el archivo local tiene sobre ellos: sin `--chat`, en todas las cuentas vinculadas a ellos con `contacts link`; con `--chat`, sus mensajes más nuevos en cada chat que nombre. Lo que cada uno pide a Telegram o a una lista pública de spam, y lo que envía a dónde: [personas](./people.md).

Algunos límites que debe conocer: una fecha de registro estimada se adivina a partir de la identificación de la cuenta con una tabla comunitaria, y no hay una estimación posterior a diciembre de 2024. La verificación del bot lee hasta 1000 mensajes almacenados. `contacts context` devuelve cuerpos de mensajes, por lo que sigue los permisos `messages`; vincular y desvincular identidades está controlado por `contacts` y nunca cambia la libreta de direcciones de Telegram.

## Siguiente paso

- [El archivo local](./archive.md): buscar, recuperar el historial de un chat, exportar, realizar copias de seguridad.
- [Configuración](./configuration.md): configuración y qué puede hacer un perfil.
- [Seguridad](./security.md): lo que llega al disco, y el control de envío.
- [Recetas](./recipes.md): trabajo habitual para tu agente de IA.
