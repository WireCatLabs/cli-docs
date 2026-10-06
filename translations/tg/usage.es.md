---
title: "Cómo usar tg"
---
Desde el primer inicio de sesión hasta enviar mensajes, en el orden en que lo necesitarás. La [referencia de comandos](./commands.md) contiene todos los comandos y opciones; esta guía explica cómo combinarlos.

Cada comando realiza una tarea, imprime la respuesta y termina. Solo `tg watch`, `tg serve` y `tg mcp` permanecen activos, y cada uno lo indica.

```sh
tg [profile] [options] <resource> <action> [arguments]
```

## Primeros pasos

```sh
npm install -g @leemour/tg-cli
tg setup                  # guided app registration, login and agent skill
tg chats list --limit 5   # your newest chats
tg messages list me       # Saved Messages, the latest 20
```

No necesitas nada más para leer mensajes.

Antes de continuar, reserva unos cinco minutos para la configuración. Descargar historial es una decisión aparte: elige el chat y la cantidad antes de `tg store fetch <chat> --last 100`. Un agente puede leer `tg skill show` antes de iniciar sesión; usa `tg setup --agent codex` para elegir su skill. `tg setup --help` explica las opciones.

Para consultar los argumentos de una tarea, usa `tg commands messages search --json` para
un comando o `tg commands messages --json` para un grupo. Ambos incluyen las opciones globales
y los códigos de salida. Consulta cada ruta de comando en una llamada separada;
`tg commands --json` devuelve todo el árbol.

## Iniciar sesión

`tg setup` es el comando para el primer uso. Por defecto registra la aplicación automáticamente y usa un QR; `--app browser` y `--method phone` eligen los otros métodos. Para iniciar sesión sin los demás pasos, o terminar un acceso interrumpido o caducado:

```sh
tg session start                        # QR code: Settings → Devices → Link Desktop Device
tg session start phone                  # phone number, the code Telegram sends, your 2FA password
tg session start --qr-file login.png    # the QR code as a picture, for an agent to show you
```

El primer inicio también solicita tu aplicación de Telegram de my.telegram.org; `--app auto` rellena el sitio por ti. Consulta ambos pasos y dónde se guarda cada dato en [sesiones](./sessions.md).

**Los secretos nunca se introducen como argumentos.** El hash de la aplicación y la contraseña 2FA se solicitan sin mostrarlos; el código y el teléfono se solicitan o se leen por stdin. Los argumentos son visibles para todos los procesos mediante `ps` y quedan en el historial de la terminal.

Para CI, `TG_API_ID` y `TG_API_HASH` proporcionan la aplicación sin usar el almacén de claves y tienen prioridad sobre él.

```sh
tg account show                # who this profile is logged in as; the phone as its last four digits
tg account show --show-phone   # the whole phone number
tg account sessions list       # every device and app logged in to the account; ends nothing
tg session end                 # log out on Telegram's side, and delete the session here
```

`session end` también cierra la sesión en Telegram: el dispositivo desaparece de la lista de la aplicación. Para cerrarla desde otro dispositivo, usa Ajustes → Dispositivos.

## Perfiles: la primera palabra

Puedes utilizar varias cuentas. El perfil es la primera palabra, no una opción:

```sh
tg chats list             # profile "default"
tg work chats list        # profile "work"
export TG_PROFILE=work    # or for a whole shell session
```

**La primera palabra es el perfil si no es un comando.** Por eso un perfil no puede llamarse `chats`: el nombre se rechaza con una explicación. Los nombres admiten letras, cifras, puntos, guiones y guiones bajos.

Cada perfil tiene su propia sesión, aplicación, configuración y lista de destinatarios. `TG_PROFILE_LOCK` limita un proceso a un perfil para impedir que el agente elija otro con menos restricciones ([perfiles](./sessions.md#profiles)).

## Cómo indicar un chat

Cuando un comando acepta `<chat>`, puedes usar:

- Un título completo o parcial: `"Book club"`, `book`.
- Un identificador: `-1001234567890`.
- Un nombre de usuario: `@example_channel`.
- `me` para Mensajes guardados.

Si el título coincide con varios chats, el error muestra los candidatos y sus identificadores. `tg` nunca adivina: un mensaje enviado a la conversación equivocada no se puede deshacer. Repite con el identificador. Este no cambia, así que úsalo una vez que lo tengas.

`messages show` y `messages context` también aceptan un localizador `msg:` en lugar del chat e identificador, como el que devuelve `messages search --json` en cada resultado.

Una persona (`<person>` en `contacts show`) puede indicarse por identificador, `@username` o parte de su nombre.

## Leer

**Leer no marca como leído.** Ningún comando siguiente muestra a otros que has mirado. Solo lo hacen `tg chats mark-read` y `tg messages list --mark-read` ([más abajo](#marking-a-chat-read)).

### Chats

```sh
tg chats list                              # newest first, archived chats included
tg chats list --unread --kind group        # only groups with unread messages
tg chats list --search book                # titles containing "book"; at least 3 characters
tg chats show "Book club"                  # kind, unread count, last message, who is in it
```

`--kind` acepta `dialog` (individual), `group`, `channel` o `saved`. Los filtros se aplican a todos los chats devueltos. Los grupos y canales tienen [su propia sección](#groups-and-channels).

### Enlaces a mensajes

`tg messages link <chat> <message>` o `tg messages link <msg:locator>` devuelve
`{ locator, url, access, reason }`. Los enlaces permanentes de canales y supergrupos pueden
ser públicos o restringidos; un enlace no añade miembros al chat. Los diálogos, grupos básicos
y Mensajes guardados devuelven un localizador. Sin conexión se valida el mensaje almacenado y no
se devuelve enlace permanente. Se rechaza un localizador de otra cuenta. Este comando singular
se distingue de `messages links`, que explica las relaciones entre conversaciones.

### Mensajes

```sh
tg messages list "Book club"                    # the latest 20, oldest first
tg messages list "Book club" --limit 50
tg messages show "Book club" 4242               # one message
tg messages context "Book club" 4242            # it, and 5 messages either side
tg messages context "Book club" 4242 --before-n 2 --after-n 10
```

En `context`, el mensaje consultado se marca con `◀` en la terminal y `"anchor": true` en JSON.

### Qué necesita respuesta

```sh
tg inbox                     # other people's unread messages, in every chat
tg inbox --since-time 2h     # everything that came in during the last two hours
tg inbox --new               # what arrived since the last --new — for scheduled runs
tg inbox --new --jsonl       # the same for a script: one message per line
```

`inbox` muestra mensajes de otras personas, nunca los tuyos, indicando su chat. Omite chats silenciados y archivados salvo que te mencionen o respondan; `--all` los incluye. Por stderr indica cuántos omitió.

**`inbox --new` actualiza un punto guardado.** El siguiente `--new` continúa donde terminó el anterior, mostrando cada mensaje una vez. El primero revisa las últimas 24 horas. `inbox` sin `--new` e `inbox --since-time` no cambian el punto. El `inbox` normal devuelve lo mismo hasta que leas los mensajes en la aplicación, porque no los marca como leídos.

Cada ejecución lee como máximo 20 chats. Los demás aparecen por stderr y en `skipped`, con el comando para consultar uno. Si un chat tiene más de `--limit` pendientes, muestra los más recientes e indica por stderr cómo leer el resto.

### Compromisos pendientes: `review`

```sh
tg review                                  # the last 3 days
tg review --since-time 2026-09-23T09:00    # from where the last review ended
tg review --chat "Book club" --json
```

Muestra todos los mensajes —tuyos y ajenos— en los chats con actividad desde `--since-time`. Sirve para revisar qué prometiste, qué esperas de otros y qué falta aclarar; clasificarlos corresponde a ti o al agente. No marca como leído.

Al terminar indica por stderr desde cuándo y hasta cuándo leyó. **Empieza la siguiente revisión desde ese `--since-time`** para no dejar huecos. Si la revisión está incompleta —demasiados chats o un chat limitado a los 300 mensajes más recientes— lo avisa; conviene no adelantar el punto de inicio. Lee como máximo 20 chats por ejecución.

#### Preguntas sin respuesta

```sh
tg review --unanswered                     # questions nobody answered in 24 hours
tg review --chat "Neighbours" --unanswered 4h
```

`--unanswered [hours]` conserva solo preguntas pendientes para ti o los administradores. Una pregunta contiene `?` (no cuenta dentro de enlaces) o responde a ti o a un administrador. Se considera contestada si tú o un administrador respondéis o sois los siguientes en hablar tras quien preguntó. Omite preguntas más recientes que el intervalo indicado (24 horas por defecto) para dar tiempo a responder. Si no se conocen los administradores, lo avisa y solo cuenta tus respuestas.

Las transcripciones guardadas también participan en este filtro. Añade `--transcribe` para
reconocer audios sin transcripción guardada antes de seleccionar preguntas sin respuesta.
Los audios sin reconocer dejan la revisión incompleta: un resultado vacío no demuestra que
no haya preguntas pendientes. Conserva el límite anterior hasta que `complete` sea true.

### Mensajes de voz

```sh
tg messages transcribe "Book club" 4242          # by Telegram where it can, else a model here
tg messages transcribe "Book club" 4242 --local  # only the model on this machine
tg messages list "Book club" --transcribe        # every voice message shown that has no text yet
tg inbox --transcribe
tg review --transcribe
tg messages list "Book club" --transcribe --model gigaam-v3
```

Telegram transcribe para cuentas Premium y algunos mensajes semanales con su prueba gratuita. Si no está disponible, lo hace un modelo local y la grabación no sale del equipo. El modelo se descarga una vez, solo cuando lo pides:

```sh
tg models audio list                   # the models, which is downloaded, which is the default
tg models audio download parakeet-v3   # once, checked against the sha256 this version expects
```

| Modelo | Idiomas | Tamaño |
|---|---|---|
| `parakeet-v3`: predeterminado | 25: búlgaro, checo, danés, alemán, griego, inglés, español, estonio, finés, francés, croata, húngaro, italiano, lituano, letón, maltés, neerlandés, polaco, portugués, rumano, ruso, eslovaco, esloveno, sueco y ucraniano | 670 MB |
| `gigaam-v3` | ruso; el mejor de los tres para ruso | 232 MB |
| `gigaam-v3-ctc` | ruso; algo más rápido, con peor uso de mayúsculas | 225 MB |

`--model` elige otro modelo para un comando, junto con `--transcribe` o en `messages transcribe`;
los ajustes `transcribeWith` y `speechModel` eligen los valores predeterminados
([configuration.md](./configuration.md)). La transcripción se guarda localmente y se reutiliza
al listar mensajes, consultar la bandeja de entrada y realizar revisiones. Otra llamada a
`messages transcribe` puede solicitar una nueva transcripción o ejecutar de nuevo el reconocimiento.
`--transcribe` puede tardar varios minutos.

### Archivos

```sh
tg messages download "Book club" 4242 --output-dir ~/Downloads   # one message's files
tg messages download "Book club" --all --output-dir ~/tg-files   # every file of the chat, newest first
```

Se guardan fotos, archivos, vídeos y notas de voz; la carpeta se crea si no existe. Los archivos conservan su nombre; si no tienen uno, reciben el identificador del mensaje. **Las descargas nunca sobrescriben archivos.** Con `--all`, los nombres repetidos reciben el identificador como prefijo. `--all` guarda el progreso en un pequeño archivo junto a las descargas y el mismo comando continúa desde allí. Solo tú puedes leer los archivos guardados.

### Personas

```sh
tg contacts list                       # people you have a one-to-one chat with, newest first
tg contacts list --order name --search ann
tg contacts show @example_user         # their bio and the chats you share
tg contacts lookup                     # who has a phone number — asks for it, or reads it from stdin
tg contacts sync                       # your whole Telegram contact list into the local store
```

`contacts list` muestra personas con un chat individual. `contacts sync` guarda también el resto de tus contactos de Telegram. `contacts lookup` nunca acepta el teléfono como argumento: pásalo por stdin o escríbelo cuando lo solicite.

Para cambiar contactos y tu perfil:

```sh
tg contacts add @example_user          # under the name they show
tg contacts rename @example_user Ann "from work"   # a name only you see
tg contacts remove @example_user       # the chat stays
tg contacts block @example_user        # they need not be a contact
tg contacts unblock @example_user
tg contacts import people.txt          # one "number, name" per line; never numbers as arguments
tg account update --first-name Ann --description "about me" --photo me.jpg
tg account sessions end --others       # logs out every other device, your phone too; asks first
```

`contacts import` indica cuántos envió y a quién reconoció Telegram, nunca teléfonos. `account sessions
end` pregunta antes de actuar; `--yes` aprueba en un script.

### Páginas

Las listas muestran `limit` filas (20 por defecto). `chats list`, `contacts list`, `chats members list` y `topics` aceptan `--page` y `--all`:

```sh
tg contacts list --limit 5             # five a page
tg contacts list --limit 5 --page 2    # the sixth to the tenth
tg contacts list --all                 # every row, no paging
```

⚠ **La paginación de una lista activa puede repetir u omitir filas.** Los más recientes van primero; un mensaje entre la primera y segunda página puede cambiar quién aparece en cada una.

**Los mensajes no usan números de página: usan `--before-id`, `--after-id` y `--after-time`**, que permiten continuar con precisión:

```sh
tg messages list "Book club" --before-id 4242   # older than message 4242
tg messages list "Book club" --after-id 4242    # newer than 4242, oldest first
tg messages list "Book club" --after-time 2h    # what came in during the last two hours
tg messages list "Book club" --after-time 2026-09-20T09:00
tg messages list "Book club" --before-time 1d   # what came before this time yesterday
```

En la terminal, las indicaciones para la página siguiente van por stderr. `--before-id` y `--after-id` aceptan identificadores. `--after-time` acepta ISO 8601 o un intervalo anterior: `30m`, `2h`, `1d`. En `messages context`, `--before-n` y `--after-n` son cantidades de mensajes, porque el punto de referencia ya es el mensaje.

### Encontrar un chat antes de escribir

```sh
tg chats list --search book --kind group     # groups with "book" in the title
tg contacts list --search ann                # people by name or @username
tg messages search "contract"                # the text of every message this machine has kept
tg messages search "contract" --chat "Book club"
tg messages search "invoice.*(march|april)" --regex
```

Las búsquedas de chats y contactos necesitan **al menos tres caracteres**. `messages search` consulta el archivo local con el [perfil estricto de Lucene](./search.md): `invoic*` busca prefijos; `invoic` es un término exacto. No se conecta a Telegram: consulta lo descargado o guardado por `serve`. Usa `--language legacy` para las coincidencias aproximadas anteriores. Cuando encuentres el chat, usa su identificador.

## Enviar

**Nada se envía si no ejecutas un comando de envío**, y por defecto no pide confirmación: el chat y texto ya están en el comando. Cada envío pasa por los controles de perfil de solo lectura, lista `allow`, destinatarios permitidos y límite por hora ([seguridad](./security.md#the-send-guard)). Se registra cada intento, nunca el texto: `tg sends list`.

```sh
tg messages send me "a note to myself"
tg messages send "Book club" "See you at 7" --silent       # no notification
tg messages send "Book club" "a link, no card" --no-preview
tg messages send "Book club" "**Bold** and _italic_" --md  # Telegram Markdown
```

`--md` usa el formato de Telegram: `**bold**` o `*bold*`, `_italic_`, `__underline__`, `~~struck~~` o `~struck~`, `||spoiler||`, código en línea, bloques de código con lenguaje, `[label](https://example.com)` y citas que empiezan por `> `. Se pueden combinar estilos; el código y los bloques pre no pueden combinarse con otras entidades, ni los enlaces o las citas anidarse dentro de otros enlaces o citas. Sin la opción, el texto se envía tal cual.
Una barra invertida escapa una marca; `_` y `*` dentro de una palabra quedan literales. Las marcas en línea sin cerrar quedan literales; un bloque de código sin cerrar se rechaza. Los enlaces admiten URL absolutas http, https y mailto. `messages edit` y los pies de archivos usan el mismo formato. En Telegram, `__text__` significa subrayado; en MAX, negrita. En Telegram, un solo `*text*` ahora significa negrita.

### Texto desde stdin

Si omites el texto, se lee por stdin. Es la única forma de enviar varias líneas y evita que aparezca en `ps` y en el historial:

```sh
printf 'first line\n\nthird line' | tg messages send me
tg messages send "Book club" < note.txt
```

### Programar un envío

```sh
tg messages send "Book club" "Tomorrow" --at-time 2026-10-01T09:00   # local time
tg messages send "Book club" "In two hours" --at-time 2h        # or 30m, 1d from now
tg messages scheduled "Book club"                               # what waits to be sent there
```

`--at-time` entrega el mensaje a Telegram, que lo enviará incluso con el equipo apagado. La hora se redondea hacia abajo al minuto. Rechaza plazos inferiores a un minuto o superiores a un año. El mensaje cuenta para el límite en la hora en que Telegram lo envía. **Cancélalo o modifícalo en la aplicación de Telegram**; `tg` no lo hace.

### Archivos, fotos y voz

```sh
tg messages send "Book club" "The agenda" --file agenda.pdf   # byte for byte; the text is the caption
tg messages send "Book club" --photo picture.jpg              # recompressed by Telegram
tg messages send "Book club" --file trip.mp4                  # a video plays in the chat
tg messages send "Book club" --file trip.mp4 --as-file        # the same video as a file to download
tg messages send "Book club" --voice note.ogg                 # a voice message, alone, with no text
```

`--photo` acepta `.jpg`, `.png` o `.webp`. Con `--file`, un `.mp4` o `.mov` se envía como vídeo salvo que añadas `--as-file`. `--voice` acepta Ogg Opus (`.ogg`, `.oga`, `.opus`) y se envía solo: sin texto ni otros archivos. Los archivos y carpetas ocultos, `~/.ssh`, las carpetas de `tg` y el archivo local se rechazan salvo con `--allow-any-file`, porque suelen contener claves y tokens.

### Responder a un mensaje

```sh
tg messages send "Book club" "Agreed" --reply-to 4242
```

Una respuesta es un envío: admite todas sus opciones.

### Si no se conoce el resultado

El código `14` significa que la conexión se interrumpió después de salir el mensaje: **puede haber llegado**. El error incluye `--send-id`. Repite con ese identificador para que Telegram descarte la segunda copia:

```sh
tg messages send "Book club" "See you at 7" --send-id <id from the error>
tg messages forward "Book club" 4242 --to me --send-id <id from the error>
```

Los reenvíos y encuestas también incluyen ese identificador. Repetir sin él envía otro mensaje. Un archivo se sube antes de enviar el mensaje: tg reintenta tres veces una subida interrumpida y, si aun así falla, el error dice que no se envió nada; ese comando puedes simplemente repetirlo. Las demás escrituras (fijar, reaccionar, marcar como leído, borrar, votar, carpetas, contactos) terminan igual con el código de salida `14` cuando Telegram no responde; el mensaje indica si es seguro repetir. Crear una carpeta no lo es: mira primero en `tg chats folders list` o puedes acabar con dos. Un envío con `--at-time` nunca se repite: consulta `tg messages scheduled <chat>`.

### Editar, reenviar, fijar y eliminar

```sh
tg messages edit "Book club" 4242 "the corrected text"      # your own message; --md as in a send
tg messages forward "Book club" 4242 --to me                # checked against the chat it goes to
tg messages pin "Book club" 4242                            # quiet unless --notify
tg messages unpin "Book club" 4242
tg messages delete me 4242 4243 --allow-dangerous           # at most 10, for you only
tg messages delete me 4242 --allow-dangerous --for-everyone
```

Una edición llega a personas que quizá ya leyeron el texto anterior. Un reenvío es un mensaje nuevo y pasa por la misma protección aplicada al chat de destino. Las eliminaciones no se pueden deshacer: por eso preguntan primero. Responde `y` o añade `--allow-dangerous`. En supergrupos y canales Telegram solo elimina para todos; allí solo funciona `--for-everyone`.

**Cuentan para el límite por hora:** mensajes, reenvíos, ediciones, mensajes fijados con aviso y cada mensaje eliminado. No cuentan reacciones ni fijados sin aviso.

### Reacciones y encuestas

```sh
tg reactions add "Book club" 4242 👍       # replaces the reaction you had
tg reactions remove "Book club" 4242
tg polls show "Book club" 4250             # the poll and its answer ids
tg polls vote "Book club" 4250 <answer id>
tg polls vote "Book club" 4250 --retract
tg polls create "Book club" "Which day?" Monday Tuesday --anonymous
tg polls close "Book club" 4250            # your own poll; it cannot be reopened
```

Al leer un chat, las reacciones aparecen bajo el mensaje: `👍 3  🔥 1  (you: 🔥)`. En encuestas públicas, tu voto muestra tu nombre a todos. Vota usando los identificadores de `polls show`, nunca la posición de la respuesta. `--multiple` permite varias respuestas. Solo se puede cambiar el voto si la encuesta se creó con `--revote`.

### Marcar un chat como leído

```sh
tg chats mark-read "Book club"               # up to the newest message
tg chats mark-read "Book club" --until 4242  # only up to this one
tg messages list "Book club" --mark-read     # read it, and mark it read up to the newest shown
```

La otra persona lo ve. Pasa por los controles como acción `read` y no cuenta para el límite por hora.

### Carpetas

```sh
tg chats folders list                              # your folders, in the order the app shows them
tg chats folders create "Trips" --chat "Hiking" --chat @kate
tg chats folders update "Trips" --title "Travel" --add "Climbing" --remove @kate
tg chats folders delete "Travel"                   # the chats stay
```

Las carpetas se indican por identificador o título exacto. Solo tú las ves; los cambios siguen pasando por los controles como cambios de `account`.

### Funciones aún no disponibles

Varias fotos en un solo mensaje siguen en [próximas mejoras](./roadmap.md).

## Grupos y canales

```sh
tg chats inspect https://t.me/+AbCdEf              # where an invite or public link leads; does not join
tg chats members list "Hiking" --all               # everyone, with their role and when last seen
tg chats events "Hiking"                           # who joined, left, was added or removed — 7 days
tg chats events "Hiking" --type join,leave --since-time 2026-09-01T00:00
tg topics list "Hiking"                            # a forum group's topics, newest activity first
tg topics search "Hiking" "gear"
tg review --chat "Hiking" --unanswered             # questions nobody answered
```

Estos comandos solo leen. `events` consulta mensajes de servicio: quién hizo qué y a quién. Los tipos son `join`, `leave`, `add`, `remove`, `create`, `title` y `pin`.

Los siguientes hacen cambios visibles para los miembros:

Para un foro, usa `tg topics enable <chat>` y `tg topics create <chat> <title>`. Un grupo básico requiere `--upgrade --yes`; conserva el nuevo identificador de chat devuelto. Si no sabes si se creó un tema, consulta `topics list` en vez de crearlo otra vez. Envía al tema con `tg messages send <chat> <text> --topic <id>` o `tg polls create <chat> <question> <answers> --topic <id>`.

```sh
tg chats create "Hiking 2027" @olga 12345          # a supergroup; the people added are told
tg chats create "Trail news" --channel             # a channel; people join it by its link
tg chats join https://t.me/+AbCdEf                 # by an invite link, or a public one
tg chats leave "Hiking 2027"
tg chats update "Hiking 2027" --title "Hiking 2028" --description "routes and dates"
tg chats update "Hiking 2027" --all-can-pin off --only-admins-add on
tg chats link show "Hiking 2027"                   # the invite link, if you may see it
tg chats link reset "Hiking 2027"                  # a new one; the old one stops working
tg chats members add "Hiking 2027" @kate 67890     # they are told
tg chats members remove "Hiking 2027" @kate        # their messages stay
tg chats admins add "Hiking 2027" @kate --can pin,delete
tg chats admins remove "Hiking 2027" @kate
```

Los grupos nuevos son siempre supergrupos. Si la privacidad de alguien impide añadirlo, aparece en `providerMetadata.notAdded`; el grupo se crea igualmente. Si requiere aprobación de administradores para entrar, indica que envió la solicitud. Cada operación pasa por los controles como cambio de `chat`; cada persona añadida cuenta para el límite por hora.

`chats update` cambia título, descripción y los dos ajustes disponibles de Telegram en una operación; devuelve el estado actualizado, igual que `chats show`. Las reglas de moderación —`chats rules` y `chats moderate`— se explican en [administrar grupos](./groups.md#rules), junto a las demás funciones de administración.

## Para scripts y agentes

**En una terminal, `tg` imprime una tabla; en una tubería o con `--json`, solo un valor JSON por stdout**, sin indicadores de progreso ni avisos. Notas, avisos y errores van siempre por stderr.

```sh
tg chats list --json | jq -r '.items[].id'
tg messages list me --jsonl | jq -r .text     # one message per line
```

- `--json`: un valor JSON. **Todas las listas son objetos** con la misma forma: `{ "items": [...], "page": 1, "limit": 20, "hasMore": true }`. `--all` y `--offline` mantienen esa estructura.
- Los mensajes de un chat no incluyen página: `{ "items": [...], "limit": 20, "hasMore": true }`.
- `--jsonl`: un objeto por línea, sin envoltorio; solo stderr indica si hay más.
- Los errores tienen forma `{ "error": { "code": "...", "message": "..." } }` por stderr, con stdout vacío, para no confundir un rechazo con una lista vacía.
- **Decide según el código de salida, no el texto.** El texto cambia; el código no. `0`: éxito; `2`: entrada incorrecta; `4`: sin sesión; `5`: el perfil no tiene permiso; `6`: no encontrado; `7`: fuera de destinatarios permitidos; `8`: límite del perfil o de Telegram; `9`: no respondió a tiempo; `14`: resultado del envío desconocido. Consulta la tabla completa en [códigos de salida](./commands.md#exit-codes).
- **Los identificadores son cadenas.** Nunca los conviertas en números.
- `--quiet` oculta notas, pero no fallos. `-v` y `-vv` añaden detalles a las tablas.
- `--timeout 30s` limita todo el comando (`500ms`, `30s` o `2m`).
- `tg commands --json` muestra todo el árbol de comandos, con `mutates: true` en los que cambian Telegram.

```sh
if ! tg messages send "Book club" "See you at 7" --json > /dev/null; then
  case $? in
    14) echo "it may have gone — repeat only with the same --send-id" ;;
    4)  echo "run tg session start" ;;
  esac
fi
```

Un agente con terminal consulta la skill para conocer detalles que la ayuda no explica:

```sh
mkdir -p ~/.claude/skills/tg-cli && tg skill show > ~/.claude/skills/tg-cli/SKILL.md   # Claude Code
mkdir -p ~/.agents/skills/tg-cli && tg skill show > ~/.agents/skills/tg-cli/SKILL.md   # Codex, Gemini CLI
```

Los agentes sin terminal (Claude Desktop, Cursor) se conectan mediante [MCP](./mcp.md).

## Cómo se muestra una conversación

`tg messages list` y `tg messages search` imprimen una transcripción en la terminal:

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
tg watch --jsonl                   # one message per line, as messages list --jsonl
tg watch --jsonl | ./on-message.sh
tg watch --events --jsonl          # edits, deletions and reactions too
tg watch --jsonl --timeout 2m      # a timeout ends it normally, with exit code 0
```

Con `--events`, cada línea incluye el tipo: `message`, `edit`, `delete` o `reaction`. Sin él, solo contiene el mensaje. Telegram no indica en qué chat se eliminó un mensaje de una conversación privada o grupo pequeño, por lo que esa línea no incluye chat.

**`watch` empieza desde ahora.** No muestra lo que llegó sin nadie escuchando. Para mantener el archivo actualizado y recuperar lo recibido con el equipo apagado, usa `serve` en segundo plano o como servicio ([archivo local](./archive.md#keeping-it-current-serve)):

```sh
tg server start           # serve in the background; answers once it is connected
tg server status
tg server install         # a systemd user unit or a launchd agent; starts nothing
```

## Qué hizo un comando

```sh
tg --trace chats list          # show each request on stderr, keep nothing
tg --record chats list         # keep it, show nothing
tg runs list                   # what was kept, newest first
```

Las ejecuciones fallidas siempre se guardan. El registro contiene operaciones, identificadores, cantidades y duraciones; nunca mensajes, nombres, títulos, teléfonos ni claves. Consulta [diagnóstico](./diagnostics.md).

## Archivo local

Todo lo que lee `tg` se guarda en este equipo para poder responder sin red:

```sh
tg chats list --offline                           # only from the store, never connect
tg store fetch "Project Alpha" --estimate      # how much a fetch would take
tg store fetch "Project Alpha" --background       # a chat's history, as a job
tg store export "Project Alpha" --format markdown --output alpha.md
tg store backup ~/tg-store.db                     # a copy of the store, while it is in use
```

Los comandos normales siguen consultando Telegram. `--offline` sirve cuando no hay red o prefieres no conectarte; rechaza envíos. Consulta descarga, exportación, búsqueda, copia y servicio en [archivo local](./archive.md).

## Configuración y permisos del perfil

Los ajustes están en un `config.json` opcional. El orden de prioridad es: **opción → variable de entorno → perfil en el archivo → valores predeterminados del archivo → programa**.

```sh
tg config show                                 # every setting, and where it came from
tg config set limit 50
tg work config set permissions.messages readonly   # profile "work" changes no messages
tg config set permissions.messages.send ask        # a yes or no before each send
tg config set sendsPerHour 10
```

`permissions` determina lo que puede hacer el perfil por comando: `deny`, `readonly`, `ask` o `allow`. Por defecto se permite todo; eliminar mensajes y cerrar sesiones requiere confirmación. Un rechazo devuelve código `5` y el error indica el comando para permitirlo. **El archivo no admite secretos.** Consulta todos los ajustes y variables en [configuración](./configuration.md).

## Siguientes pasos

- [Archivo local](./archive.md): buscar, descargar historiales, exportar y hacer copias.
- [Configuración](./configuration.md): ajustes y permisos.
- [Seguridad](./security.md): datos en disco y controles de envío.
- [Ejemplos prácticos](./recipes.md): tareas diarias para un agente.

## Contexto local de una persona

`tg contacts context <person>` lee los mensajes guardados y los chats compartidos de las identidades vinculadas, sin conectarse ni marcar nada como leído. `complete:false` y `notRead` muestran huecos en el archivo. `contacts link <person> max:<id>` y `contacts unlink` mantienen los vínculos locales entre identidades; no cambian la libreta de direcciones de Telegram.

`contacts context` devuelve el texto de los mensajes y por eso sigue los permisos de `messages`; la escritura de vínculos entre identidades sigue controlada por `contacts`.
