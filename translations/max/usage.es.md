---
title: "Cómo usar tu cuenta personal"
---

<a id="quién-se-considera-contacto" />
<a id="texto-desde-stdin" />
<a id="respuestas-y-reacciones" />
<a id="editar-reenviar-y-fijar" />
<a id="eliminar" />
<a id="encuestas" />
<a id="botones-de-bots" />
<a id="contactos-perfil-y-carpetas" />
<a id="medios-del-chat" />
<a id="fotos-vídeos-archivos-y-voz" />
<a id="revisar-el-grupo" />
<a id="scripts-y-agentes" />
<a id="archivo-local-y-nuevos-mensajes" />
<a id="configuración" />
<a id="permisos-del-perfil" />
<a id="personas" />
<a id="gráficos-de-estadísticas" />
<a id="ответ-и-реакция" />
<a id="правка-пересылка-закрепление" />
<a id="опросы" />
<a id="локальная-копия-и-новые-сообщения" />
<a id="настройки" />
<a id="человек" />

`max` le permite a usted o a su agente de IA leer y escribir en su cuenta MAX personal desde la terminal. Esta página es una descripción general, desde el inicio de sesión hasta la lectura, el envío y los grupos, en el orden en que lo necesita. Ábrelo cuando empieces a trabajar con `max`, o cuando quieras saber qué es posible antes de solicitar un agente. El bot, que funciona a través de la API oficial de Bot, se describe en la página [bot](./bot.md).

Aprenderás a identificar chats, leer y buscar sin marcar mensajes como leídos, enviar de forma segura y obtener resultados para scripts. La [referencia de comandos](./commands.md) enumera todos los comandos y opciones desde el programa; esta página explica cómo usarlos juntos.

Términos de esta página:

- **Perfil**: ajustes y sesión de una cuenta MAX local; se elige con la primera palabra ([perfil](#профиль--первое-слово)).
- **Chat**: chat privado, grupo, canal o «Favoritos».
- **Archivo local**: base de datos donde `max` guarda lo leído ([archivo local](./archive.md)).
- **Comprobaciones de envío**: perfil de solo lectura, destinatarios permitidos y límite horario ([seguridad](./security.md)).
- **`max personal serve`**: proceso que mantiene una conexión para los comandos del perfil.

Cada comando realiza una tarea, imprime el resultado y termina. Solo [`max personal serve`](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch) mantiene conexión: lo inicia en segundo plano el primer comando que necesita MAX y se detiene tras 15 minutos sin actividad.

```sh
max [perfil] [opciones] <recurso> <acción> [argumentos]
```

## ¿Qué se puede hacer?

|Región|que es posible|Por donde empezar|
|---|---|---|
|Lectura|chats, mensajes, un mensaje y vecinos| `max personal chats list`, `max personal messages list <chat>` |
|¿Qué espera una respuesta?|no leído por otros; lo que prometiste y lo que se revela| `max personal inbox`, `max personal review` |
|Voz|convertir voz en texto en esta computadora| `max personal messages transcribe` |
|Archivos|descargar archivos adjuntos de mensajes o el chat completo; chat de medios| `max personal messages download`, `max personal chats media` |
|Gente|contactos, sus nombres y notas, perfil de persona, verificación de bots| `max personal contacts list`, `max personal contacts profile` |
|Buscar|mensajes, archivos, fechas, personas; discusiones sobre el significado| `max personal search messages`, `max personal search conversations` |
|Despacho|texto, archivos, voz, respuestas, mensajes retrasados| `max personal messages send` |
|Cambiar|editar, reenviar, fijar, eliminar, reacciones, encuestas, marcar como leído| `max personal messages edit`, `max personal reactions add` |
|bots|presione el botón del bot, inicie el bot, abra la miniaplicación| `max personal messages press`, `max personal chats start` |
|Orden|carpetas, sonido de chat, privacidad| `max personal chats folders list`, `max personal chats mute` |
|Grupos|participantes, enlaces de invitación, aplicaciones, administradores, reglas de moderación| `max personal chats members list`, `max personal chats rules show` |
|Seguimiento|nuevos mensajes a medida que llegan; archivo local nueva| `max personal watch`, `max personal serve` |
|Examen|lo que hizo el comando; que el perfil puede| `max personal runs list`, `max config show` |

## Lee un chat con tu agente

Con la cuenta conectada, pide un resumen breve. Esta tarea lee mensajes y no envía nada.

**Tu petición:**

> Usa max CLI. Resume los cinco últimos mensajes de Книжный клуб. Muestra decisiones y preguntas pendientes. No envíes nada.

**Comando:**

```sh
max personal messages list "Книжный клуб" --limit 5 --json
```

**Ejemplo de respuesta del agente:**

> **Decisión:** la próxima reunión será el jueves a las 18:00.
>
> **Pendiente:** dónde reunirse.
>
> Puedo mostrar los mensajes que sustentan el resumen. No se ha enviado nada.

El resultado anterior es ficticio. Pida ver los mensajes originales antes de confiar en la interpretación del agente. La configuración, las acciones de mensajes y los permisos se explican en las secciones siguientes.

## Inicio

```sh
max personal setup --agent codex  # inicio de sesión por QR y skill del agente
```

```sh
max personal chats list           # tus chats
```

La configuración puede tardar unos cinco minutos. El comando comprueba hasta cinco chats sin iniciar un servicio en segundo plano. El historial se descarga por separado después de elegir el chat y la cantidad. Antes de iniciar sesión, el agente lee `max skill show`, disponible sin sesión. `max skill show link-conversations` muestra el skill compartido para vincular conversaciones del archivo; no requiere otro inicio de sesión.

## Iniciar sesión

Primer ejecución: `max personal setup`. Para reingreso explícito - `max personal session start qr`: aparecerá un código QR en el terminal, lo escanearás con la aplicación MAX y el token irá al llavero. Todos los métodos de inicio de sesión: [inicio de sesión, sesiones y perfiles](./sessions.md). Sin método, `max personal session start` **importa el token** recibido en el cliente oficial y lo coloca en el llavero del sistema operativo.

```sh
max personal session start
MAX token: ▏               # la entrada no se muestra
```

**El token no se pasa como argumento**: el argumento es visible en `ps` para cualquier proceso en la máquina y permanece en el historial del shell. Por lo tanto, se solicita desde la terminal sin eco o se lee desde la tubería:

```sh
pass show max/token | max personal session start
```

Para CI y ejecuciones puntuales, `MAX_TOKEN` tiene prioridad sobre el almacén:

```sh
MAX_TOKEN="$(cat /path/to/token)" max personal chats list
```

Comprueba tu identidad:

```sh
max personal account show                # número de teléfono: solo las últimas 4 cifras
```

```sh
max personal account show --show-phone   # el número completo
```

```sh
max account list                # todos los perfiles de este ordenador y la cuenta de cada uno; no se conecta a MAX
```

```sh
max personal account sessions list       # dónde más has iniciado sesión
```

Cerrar sesión en MAX y olvidar la sesión en este ordenador:

```sh
max personal session end
```

`session end` termina la sesión en el servidor de MAX (`revoked_on_server: true`). Si copiaste el token de una pestaña de web.max.ru, también se cierra la sesión de esa pestaña.

`account show --json` contiene los campos MAX `id`, `name`, `phone`, `description` y `username: null` como formato de cuenta general. El número está enmascarado; `--show-phone` lo muestra claramente en su totalidad.

## El perfil es la primera palabra

Puedes usar varias cuentas. El perfil se indica como primera palabra, no como opción:

```sh
max personal chats list     # perfil personal
max work chats list         # perfil work
```

**La primera palabra es el perfil si no coincide con un comando.** Por eso no puedes llamar `chats` a un perfil; se rechaza explicando la causa.

`max` nunca elige un perfil por sí mismo, aunque solo haya uno: sin nombre, el comando se detiene y enumera los perfiles de este ordenador. El nombre lo da la primera palabra o `MAX_PROFILE`.

Para toda la sesión de terminal:

```sh
export MAX_PROFILE=personal
max chats list
```

Cada perfil tiene su propio token y su propio estado. Se comparte el archivo local de los mensajes; Los datos que contiene se dividen por cuenta. Más detalles - [perfiles](./profiles.md).

## Cómo nombrar el chat

El chat se dirige por **id o parte del nombre**. Si parte del nombre coincide con dos chats, el comando se negará a adivinar y se lo mostrará a los candidatos: enviar a la conversación equivocada es irreversible. Una vez que haya encontrado el chat deseado, comuníquese con él **por id**; está en la salida y no cambia.

A la persona en `contacts show` se le llama de la misma manera: **id, `@username` o parte del nombre**, y el comando tampoco adivina dos adecuados.

El mensaje también se puede llamar un enlace `msg:…` desde la salida `search messages`; luego, la identificación posterior no es necesaria.

## Leer

**Leer no marca nada como leído.** El protocolo separa "obtener historial" de "marcar leído" y la segunda operación no se envía a menos que se solicite. Solo puedes marcar un chat como leído explícitamente ([a continuación](#отметить-прочитанным)).

### Chats

```sh
max personal chats list                      # todos los chats
```

```sh
max personal chats list --limit 5            # los cinco primeros
```

```sh
max personal chats list 'unread_count>0' --offline # solo chats con mensajes sin leer
```

```sh
max personal chats show "Иван Петров"        # un chat: tipo, no leídos, último mensaje, miembros
```

`chats show` responde con un objeto: campos de cadena de `chats list` y `members`: quién está en el chat excepto usted. El canal `members` - `null`: MAX envía cuatro suscriptores entre miles, y hacerlos pasar como parte del canal sería mentir. Grupos y canales - en [su sección](#группы-и-каналы).

### Mensajes

```sh
max personal messages list 0                 # mensajes del chat por id
```

```sh
max personal messages list "Иван Петров"     # o por nombre del chat
```

```sh
max personal messages list 0 --limit 50
```

Un mensaje y su contexto: el chat y el ID del mensaje son obligatorios (los ID son ficticios):

```sh
max personal messages show -1000 100000000000000001
```

```sh
max personal messages context -1000 100000000000000001 --before-n 3 --after-n 3
```

En el feed, lo que busca está marcado como `◀`, en JSON - `"anchor": true`. Si no existe tal mensaje (se eliminó o el chat no es el mismo), se trata de un error de "no encontrado" y no del mensaje adyacente. `id<…` en la consulta de `messages list` funciona para cualquier identificación: la hora de envío está codificada en la identificación misma.

### Enlace al mensaje

`max personal messages link <chat> <message>` o `max personal messages link <msg:locator>` devuelve `{ locator, url, access, reason }`. Personal MAX primero verifica el mensaje en el archivo local y devuelve un localizador; El formato del enlace nativo aún no se ha confirmado. No hay conexión con `--offline`. Se rechaza el localizador de la otra cuenta. `messages links` es otro comando: explica las conexiones de las conversaciones ([buscar por temas](./topic-search.md)).

### ¿Qué espera la respuesta?

```sh
max personal inbox                               # sin leer, según el contador de MAX; cada mensaje lleva su chat
```

```sh
max personal inbox --new                         # lo recibido desde la última comprobación, cada mensaje una vez
```

```sh
max personal inbox --new --jsonl                 # lo mismo para un script: un mensaje por línea
```

```sh
max personal inbox 'date>"2026-09-24T09:00:00Z"' # una mirada puntual desde esa hora
```

```sh
max personal inbox --all                         # también chats silenciados y el archivo
```

**`max personal inbox` no marca nada como leído**, por lo que devuelve lo mismo hasta que leas los mensajes en la aplicación. Para ejecutarlo de forma programada, usa `--new`: la posición se guarda en el perfil y solo avanza cuando se imprime la salida. El primer `--new` revisa las últimas 24 horas. La consulta `date>…` no cambia esa posición. No se muestran tus propios mensajes. Si hay más de `--limit` mensajes en un chat (20 de forma predeterminada), se muestran los más recientes y `next` indica un comando para leer el resto. Cada ejecución lee como máximo 20 chats; los restantes aparecen en `missing`.

Omite silenciados y archivados salvo menciones o respuestas a ti; indica cuántos en `missing`. `--all` los incluye.

### Revisar compromisos

```sh
max personal review                                   # todo lo de los últimos 3 días
```

```sh
max personal review 'date>"2026-09-23T09:00:00Z"'   # desde el final de la revisión anterior
```

```sh
max personal review 'date>"2026-09-23T09:00:00Z"' --transcribe --json
```

Lee mensajes propios y ajenos en chats activos desde ese momento para revisar promesas, pendientes y dudas. Clasificarlos corresponde a ti o al agente. No marca como leído. Hasta 300 mensajes por chat; si hay más, marca la revisión incompleta. Omite silenciados y archivados salvo menciones o respuestas, como `inbox`; `--all` los incluye.

En la terminal, al terminar indica el intervalo por stderr. En JSON, el primer paso de `next` es `review.next`: empieza desde él la siguiente revisión para no dejar huecos. Si está incompleta por chats, mensajes o voz sin transcribir, aparece en `missing`, y `review.next` empieza desde el mismo límite.

`--transcribe` transcribe voces que aún no tienen texto: lentamente, hasta un minuto por cada cinco minutos de voz, y solo si el modelo ya se ha descargado ([voz a texto](#голосовые-в-текст)). Sin la bandera, la respuesta contendrá el texto de los ya descifrados. Con la bandera, lo que no se pudo transcribir aparece en `missing`.

#### Preguntas pendientes

```sh
max personal review --unanswered                      # preguntas sin respuesta desde hace un día
```

```sh
max personal review 'chat:"Соседи"' --unanswered 4h  # en un grupo, sin respuesta desde hace 4 horas
```

`--unanswered [duración]` selecciona preguntas pendientes de respuesta tuya o de administradores. Una pregunta tiene «?» en el texto o transcripción, o responde a un mensaje tuyo o de un administrador. Se tienen en cuenta las transcripciones guardadas; `--transcribe` procesa nuevas notas antes de seleccionar. Una nota no reconocida deja la revisión incompleta. Cuenta como respondida si tú o un administrador respondéis o sois los primeros en hablar tras quien preguntó. No muestra preguntas más recientes que el plazo (`4h`, `1d`; por defecto `24h`): todavía no ha pasado suficiente tiempo para responderlas.

MAX identifica administradores al entrar, solo en chats con actividad reciente. Si no están disponibles, lo avisa y solo cuentan tus respuestas. No ve respuestas posteriores al final de la revisión. `chat:` en la consulta limita a un chat, con o sin `--unanswered`.

### Voz a texto

Consulta la selección de modelos, los comandos y los límites en la [guía de reconocimiento de voz](./audio-recognition.md).

Los mensajes de voz se transcriben **en tu ordenador**: las grabaciones no se envían a ningún sitio. Descarga el modelo de reconocimiento una vez con un comando independiente:

```sh
max personal models audio list                # qué modelos hay, cuáles están descargados y cuál es el predeterminado (*)
```

```sh
max personal models audio download gigaam-v3  # 233 MB, una sola vez
```

```sh
max personal messages transcribe "Иван Петров" 100000000000000001
```

Los modelos se guardan en un directorio compartido por MAX y Telegram; `WIRECAT_STATE_DIR` cambia su ubicación. `models audio list --json` devuelve una lista `items` con `page`; cada modelo tiene su ruta `path`. Los archivos descargados se reutilizan. `gigaam-v3` sigue primero, y `config set --defaults transcribe_model <modelo>` selecciona el modelo.

| Modelo | Idiomas | Tamaño | 5 minutos de voz |
|---|---|---|---|
| `gigaam-v3`: predeterminado | ruso; el mejor para ruso | 233 MB | ~40 s |
| `gigaam-v3-ctc` | ruso; algo más rápido, peor uso de mayúsculas | 226 MB | ~36 s |
| `parakeet-v3` | 25: búlgaro, croata, checo, danés, neerlandés, inglés, estonio, finés, francés, alemán, griego, húngaro, italiano, letón, lituano, maltés, polaco, portugués, rumano, eslovaco, esloveno, español, sueco, ruso y ucraniano | 671 MB | ~60 s |

Tiempos en un portátil Ryzen AI 9 HX 470 con un hilo. Elige otro modelo para un comando con `--model parakeet-v3` o como predeterminado con `"transcribe_model": "parakeet-v3"` en `defaults`. Cada descarga se comprueba contra la suma incluida en `max`; si no coincide, no se instala.

El texto se guarda bajo tu cuenta en la base compartida `wirecat.db`, usada por `messages list`, `messages transcribe`, `inbox`, `review` y MCP. Repetir con el id del chat y el mismo modelo responde de inmediato, sin red ni reconocimiento. Las transcripciones del antiguo caché de perfil no se migran; `--transcribe` las genera de nuevo. La grabación se descarga mediante la conexión de lectura y esta se cierra antes del reconocimiento local. No hace falta un segundo acceso. Se necesitan unos 700 MB de memoria (`parakeet-v3`, 1,3 GB).

Transcribir los mensajes de voz de los resultados del chat o de la bandeja de entrada en una ejecución:

```sh
max personal messages list "Иван Петров" --transcribe
```

```sh
max personal inbox --transcribe
```

`--transcribe` procesa solo los mensajes de voz mostrados que todavía no tienen texto; `--model` elige el modelo para una ejecución. Primero `max` descarga todas las grabaciones necesarias y después cierra la conexión antes de ejecutar el modelo. El texto aparece bajo el mensaje de voz con el icono 🎤, o en `transcript` con `--json`. Las transcripciones fallidas y su motivo aparecen en `missing`; los mensajes se muestran igualmente. Si el modelo no está descargado, el comando indica cómo descargarlo, pero no lo hace automáticamente. Los modelos se guardan en `~/.local/share/WireCat/models/audio`, una copia compartida por `max` y `tg`.

Las transcripciones guardadas se muestran sin opción: el texto está en este ordenador. Las demás aparecen sin la opción en `missing` con la entrada `transcript`, así la respuesta no parece completa. Con `--offline` no se transcriben nuevas notas porque no se pueden descargar.

### Archivos

Los adjuntos del mensaje —fotos, archivos, vídeos y audio— se guardan en una carpeta (la actual de forma predeterminada):

```sh
max personal messages download -1000 100000000000000001 --output-dir ~/Downloads
```

```sh
max personal messages download -1000 --all --output-dir ~/Downloads --pause 5s   # todos los archivos del chat
```

`--output` sigue siendo un nombre compatible para `--output-dir`; No puede especificar diferentes directorios al mismo tiempo. El directorio se crea si no existe. El JSON de un mensaje contiene `{items}`; JSONL: una entrada de archivo por línea. Con `--all`, el reinicio continúa omitiendo el progreso guardado; Los archivos ya guardados permanecen en su lugar.

El archivo conserva su nombre, el resto: `<id del mensaje>-<número>.<extensión>`. **El archivo existente no se sobrescribe**: el fallo aparece en `batch` y continúan los archivos independientes. El vídeo se guarda como MP4 más grande; Las llamadas, enlaces y stickers no se descargan, y habrá una línea sobre esto en stderr. Solo el propietario puede acceder a los archivos guardados (permiso 600). Las voces tienen `kind: voice` en JSON; la extensión del archivo adjunto sin nombre se selecciona mediante HTTP MIME. Envío de archivos, formatos y búsqueda por texto dentro de archivos - [adjuntos](./attachments.md).

<a id="медиа-чата"></a>

Medios de chat, como una galería en la aplicación MAX:

```sh
max personal chats media "Поход"                           # fotos, vídeos, archivos, audio y enlaces, como la galería de MAX
```

```sh
max personal chats media "Поход" --type photo,video        # solo fotos y vídeos
```

```sh
max personal chats media "Поход" --cursor <cursor>         # página siguiente: el cursor viene de page.next
```

La lista se toma del servidor MAX, por lo que también contiene lo que aún no se ha descargado en esta computadora. La lectura no marca nada como leído.

### Gente

```sh
max personal contacts list                   # personas con las que tienes un chat privado
```

```sh
max personal contacts show @ivan             # una persona y los chats en común
```

Puede encontrar a cualquier persona que el archivo local conozca, incluido un miembro del grupo que no se considera un contacto. La respuesta contiene `contacts show`: el nombre, `@username` y los chats compartidos con él, recién llegados desde arriba. El comando sólo lee; Encontrar una persona no significa escribirle. El perfil de una persona, sus últimos mensajes de chat, buscar un bot y conectarse a una cuenta de Telegram - [people](./people.md).

#### Quién cuenta como contacto

`max personal contacts list` muestra **personas con chat individual**, conversación reciente primero. Otros miembros de grupos se guardan con nombre y chats compartidos, pero no aparecen como contactos.

MAX no ofrece una operación para recuperar la agenda completa; solo se conocen personas de tus chats. Se actualizan con cada inicio de sesión, pidiendo **solo cambios** desde el anterior.

```sh
max personal contacts sync     # olvidar dónde se quedó y traer la lista de nuevo
```

Es una reparación para una copia desincronizada o reiniciada tras cambio de esquema, no una operación habitual. Devuelve cantidades, sin nombres, teléfonos ni descripciones.

#### Tus nombres y notas sobre personas.

```sh
max personal contacts alias set "Борис Тестов" Боря          # tu propio nombre para una persona, solo en este ordenador
```

```sh
max personal contacts alias rm "Борис Тестов"
```

```sh
max personal contacts notes add "Борис Тестов" --file note.txt   # o texto desde stdin
```

```sh
max personal contacts notes list "Борис Тестов"
```

```sh
max personal contacts notes edit "Борис Тестов" <id> --revision 1 --file note.txt
```

```sh
max personal contacts notes remove "Борис Тестов" <id>
```

```sh
max personal contacts show "Борис Тестов" --with-notes
```

```sh
max personal contacts list notes:квартира                   # personas cuyas notas contienen esta palabra
```

Su nombre y notas se almacenan sólo en una archivo local y no van a MAX. Su nombre es válido en la cuenta seleccionada y una nota sobre la persona es visible en cada perfil donde esta persona es visible. `contacts rename` cambia el nombre en la libreta de direcciones MAX, eso es diferente. Una persona puede ser encontrada en comandos por su nombre si no coincide con el de otra persona; si hay una coincidencia, se necesita una identificación. `--revision` protege contra la edición de una nota desactualizada.

### Páginas

`chats list`, `contacts list`, `chats members list` y `sends list` tienen tres opciones de paginación; `runs list`, `--limit` y `--page`; `inbox`, solo `--limit`. `chats events` lee eventos desde una fecha sin páginas:

```sh
max personal contacts list --limit 5             # cinco por página
```

```sh
max personal contacts list --limit 5 --page 2    # del sexto al décimo
```

```sh
max personal contacts list --all                 # todo, sin páginas
```

```sh
max personal contacts list --order name          # alfabético en lugar de "quién escribió el último"
```

`--all` junto con `--page` es un fracaso, no una victoria silenciosa para uno de ellos. `--limit` se puede escribir en un archivo de configuración; `--page` y `--all` no son posibles, el número de página en el archivo se necesita exactamente una vez y luego se interpone. `sends list` sin `--limit` toma el `limit` sintonizado; su JSON incluye `items` y `page` con `limit` y `has_more`, donde `limit` es el límite de la lista seleccionada, no el número de filas; JSONL produce una entrada de intento por línea.

⚠ **El número de página en una lista activa puede repetirse u omitirse una línea.** La parte superior es la más reciente, por lo que un mensaje que llega entre la primera página y la segunda empuja a alguien a pasarse de la línea.

**Los mensajes no tienen números de página: el punto de inicio lo fija la consulta**, para retroceder con precisión según su tiempo:

```sh
max personal messages list 0 --limit 20
```

```sh
max personal messages list 0 'id<116762160362694583'          # anterior a la fila más antigua que ves
```

```sh
max personal messages list 0 'date<"2026-09-20T01:00:00Z"'    # funciona aunque ese mensaje ya no exista
```

```sh
max personal messages list 0 'id>116762160362694583'          # lo que llegó después de este mensaje
```

```sh
max personal messages list 0 'date>"2026-09-20T01:00:00Z"'    # o después de esta hora
```

`id>…` y `date>…` avanzan, mostrando `--limit` mensajes **posteriores**, antiguos primero. La página siguiente, en cualquier dirección, la indica el paso `page.next` en `next`: pasa su `--cursor`. La consulta admite un solo punto de inicio: dos a la vez se rechazan, porque son puntos de inicio distintos, no extremos de un intervalo.

El mensaje de referencia no aparece con `id<…` ni `id>…`, aunque MAX lo devuelva, para no repetirlo entre páginas. Con `--offline`, solo funciona `id<…` con un mensaje guardado.

Las fechas admiten ISO 8601, intervalos anteriores como `30m`, `2h`, `1d` (`date>7d` consulta la última semana) o una fecha como `2026-09-20`. La hora exacta va entre comillas dentro de la consulta, con segundos y desfase: `'date<"2026-09-20T01:00:00+02:00"'`. Si el identificador no está guardado, por ejemplo por eliminación, se indica otro método.

### Encontrar un chat antes de escribir

```sh
max personal chats list title:иван --offline      # chats cuyo título contiene "иван"
```

```sh
max personal chats list 'title:work kind:group' --offline # solo grupos
```

```sh
max personal chats list 'unread_count>0 kind:dialog' --offline # chats privados con mensajes sin leer
```

```sh
max personal contacts list name:петров            # personas por nombre, tu nombre para ellas o @username
```

```sh
max personal search all "договор"                 # mensajes y notas de este ordenador
```

```sh
max personal search messages "договор"            # en el texto de mensajes ya leídos
```

```sh
max personal search messages 'договор chat:42'    # en un chat
```

En `title:` hacen falta **al menos tres caracteres**: dos letras coinciden con demasiados elementos para resultar útiles. Una consulta de `chats list` solo responde desde el archivo local, por eso necesita `--offline`: MAX no filtra la lista de chats, y sin `--offline` un campo en la consulta se rechaza. `contacts list name:` también busca en el archivo local y se rechaza mientras no haya ningún contacto guardado.

Cuando encuentres el chat, utiliza su **ID** de la salida; no cambia:

```sh
max personal messages list 42 --limit 20
```

```sh
max personal messages send 42 "texto"
```

Parte del nombre también se acepta allí, y en `chat:` de `max personal search messages`: el nombre del chat se busca entre los guardados, y sin `--discover`, una búsqueda en un chat también solicita el servidor MAX (`--backend archive` - solo archivo). La búsqueda utiliza [lenguaje de consulta de búsqueda](./query-language.md): la palabra encuentra sus otras formas, el comienzo de la palabra es el patrón explícito `квартир*`, solo la forma exacta es `exact:квартира`, una expresión regular de Lucene es `text:/pass(port)?/`. Más detalles: [buscar](./search.md).

### Cuántos mensajes coinciden

`max personal stats messages show` cuenta mensajes del archivo local sin conectarse a MAX. Sin consulta, cuenta todos los mensajes guardados de la cuenta actual; con consulta, cuenta las coincidencias de Lucene estricto como `search messages`. Cada mensaje se cuenta una sola vez.

```sh
max personal stats messages show "договор" --by chat --json
```

```sh
max personal stats messages show --by sender --chat "Работа" --limit 10 --json
```

```sh
max personal stats messages show --by day --timezone Europe/Madrid --json
```

```sh
max personal stats messages show --by hour --timezone UTC --json
```

`--by` agrupa por chat, remitente, día natural u hora. `--limit` limita las filas, y `total` es el número de todos los mensajes que coinciden. En un archivo incompleto, las cifras son un límite inferior: revisa `missing` antes de tomar la ausencia de coincidencias como prueba. Para incluir todas las cuentas de MAX guardadas, añade `--source max` explícitamente; sin él, los demás perfiles no entran en el resultado. El JSON es un único informe `{item: {by, total, rows}}`, con `next` y `missing` al lado; `--jsonl` no admite el informe.

<a id="графики-статистики"></a>

Gráficos basados ​​en los mismos datos: `max personal stats charts`. El comando devuelve una descripción del gráfico en JSON; `--output activity.svg` también guarda SVG con un tema oscuro, `--output activity.png` guarda PNG. Especifique el chat encontrado a través de `max personal chats list` como argumento del comando. `--chart-kind messages` muestra mensajes, `active` muestra autores activos, `membership` muestra entradas y salidas. `--by day` o `week` especifica el período; la semana comienza el lunes. `--timezone` se aplica a fechas del calendario.

El nombre de chat `synthetic-group` de este ejemplo es ficticio:

```sh
max personal stats charts synthetic-group --chart-kind messages --by day --timezone Europe/Madrid --output activity.svg --json
```

El JSON es `{item}` con la descripción del gráfico y, al guardar la imagen, también `file` con ruta y tamaño. La imagen se escribe solo en un archivo nuevo, sin sobrescribirla. Una fecha que falta sigue siendo un vacío y se indican datos incompletos en la descripción y la imagen. `membership` requiere eventos de chat en línea y no está disponible con `--offline`. A través de MCP `max_read` (`command: "stats charts"`) devuelve JSON desde el almacenamiento local, sin conectarse ni escribir archivos; `format: "png"` agrega una imagen PNG y JSON con `chart` y tamaño `image`. Las entradas y salidas no están disponibles en el mismo. La lectura está sujeta al permiso `messages`. `--jsonl` y la imagen de salida estándar no están disponibles.

![Gráfico sobre datos ficticios](https://raw.githubusercontent.com/WireCatLabs/max-cli/v0.62.0/docs/images/stats-charts.png)

Clasificaciones de mensajes y autores: [métricas, puntuaciones y evidence](./rankings.md).

## Enviar

**No se envía nada si no escribes el comando de envío**, y el envío no pide confirmación: el destinatario y el texto ya están escritos en la línea que has escrito. Cada envío pasa por controles: perfil de solo lectura, lista de destinatarios y límite por hora ([seguridad](./security.md)).

```sh
max personal messages send 0 "texto"
```

```sh
max personal messages send "Иван Петров" "texto"
```

```sh
max personal messages send 0 "reunión **a las 15:00**, no _a las 14_" --md
```

Con `--md`, el conversor MAX admite `**negrita**` o `__negrita__`, `_cursiva_` o `*cursiva*`, `~~tachado~~`, `++subrayado++`, `[enlace](https://example.com)` y código entre comillas inversas o en bloques. Los estilos pueden anidarse y las posiciones usan UTF-16. Los saltos del código en línea se sustituyen por espacios; MAX no conserva el idioma del bloque. Sin la opción, envía el texto tal cual. `_` y `*` dentro de palabras son literales y la barra inversa escapa signos. Admite enlaces http, https y mailto; rechaza bloques de código sin cerrar.

El conversor de MAX Bot API también admite `^^resaltado^^`, títulos con `#` y citas con `>`; los convierte a HTML de forma segura. El protocolo personal rechaza esas tres formas antes del envío o la carga. `||spoiler||` sigue como texto literal. Telegram tiene otra sintaxis: `__texto__` significa subrayado allí y negrita en MAX.

La opción `--topic` se refiere a los temas del foro de Telegram. MAX claramente falla cuando se transmite a `messages send` o `polls create`, antes de enviar; No se agrega para el chat normal.

### Texto de la tubería

Omite el último argumento para leer el cuerpo desde la entrada estándar:

```sh
echo "texto" | max personal messages send 0
max personal messages send 0 <<'EOF'
primera línea

tercera línea
EOF
cat carta.txt | max personal messages send 0
```

Así es como se escribe un mensaje **multilínea**, que no se puede pasar como argumento en absoluto, por lo que el texto no termina ni en `ps` ni en el historial del shell: la misma regla según la cual el token no se acepta como argumento. Todos los saltos de línea se conservan excepto uno al final: `echo` lo agrega, y sin esto casi todos los mensajes terminarían con una línea vacía.

⚠ **Si la entrada es una terminal, el comando se rechazará en lugar de esperar.** `max personal messages send 0` sin texto es un argumento olvidado, no un mensaje para escribir; un comando que espera en silencio es indistinguible de uno congelado.

### Enviar más tarde

```sh
max personal messages send 0 "recordatorio" --at-time 2026-09-25T09:00   # hora local
```

```sh
max personal messages send 0 "recordatorio" --at-time 2h                # o dentro de 30m, 2h, 1d
```

```sh
max personal messages scheduled 0                                       # lo que espera a enviarse en este chat
```

El mensaje espera **en el servidor MAX** y se envía aunque el ordenador esté apagado. MAX descarta los segundos y envía al principio del minuto, redondeando hacia abajo. Rechaza tiempos inferiores a un minuto o superiores a un año.

- Respuesta - `{item: {operation_id, message, scheduled_for}}`: mensaje en cola y hora de envío; el paso `messages.scheduled` en `next` muestra la cola. **Cuando salga, tendrá una identificación diferente.**
- Con `--silent` - fallo: la aplicación MAX siempre envía una notificación retrasada.
- Las protecciones de envío (solo lectura, lista de destinatarios, límite por hora) cuentan el mensaje ahora, en el momento de hacer cola.
- Si no hay respuesta no habrá repetición: `outcome_unknown` aconseja consultar la cola, y no se acepta `--operation-id` con `--at-time`. No se ha probado si MAX colapsa la repetición diferida.
- **Cancelar o cambiar - en la aplicación MAX.** `max` no envía eliminación.

### Fotos, vídeos, archivos y voces.

```sh
max personal messages send 0 "informe" --file informe.pdf
```

```sh
max personal messages send 0 "desde la casa de campo" --file clip.mp4          # un vídeo que se reproduce en el propio chat
```

```sh
max personal messages send 0 --file clip.mp4 --as-file       # el mismo vídeo como archivo para descargar
```

```sh
max personal messages send 0 --photo captura.png                # una foto
```

```sh
max personal messages send 0 --voice nota.ogg              # un mensaje de voz
```

```sh
max personal stickers list                                    # sets de stickers; --set <id> lista los stickers de un set con sus id
```

```sh
max personal messages send 0 --sticker 51                     # un sticker, sin texto
```

Con `--file`, `.jpg .jpeg .png .webp .gif` se envían como fotos; `.mp4 .mov .webm .mkv`, como vídeos; el resto, como archivos. `--as-file` envía el adjunto de `--file` como archivo, incluidos vídeos. `--photo` solo acepta `.jpg .png .webp`. Un mensaje puede incluir un adjunto de `--file` y uno de `--photo`, pero **vídeos y archivos van solos**: una combinación incompatible falla antes de cargar. El texto es opcional. Si falla la carga, no se envía nada. `max` todavía no envía varios archivos por mensaje. MAX no admite `--no-preview` y el comando lo rechaza.

`--voice` envía una nota de voz con volumen y duración, como las grabadas en el móvil. Va sola, sin texto, archivos ni fotos. Requiere Ogg Opus, el formato de MAX; convierte antes otros audios:

```sh
ffmpeg -i grabacion.m4a -ac 1 -ar 48000 -c:a libopus -b:a 32k nota.ogg
```

Los archivos y carpetas conocidos de credenciales (como `~/.ssh`), los directorios de `max` y el almacén de mensajes están protegidos. Se permiten las carpetas de trabajo ocultas normales. La CLI ofrece `--allow-any-file` para un archivo protegido elegido expresamente.

### Respuesta

```sh
max personal messages send 0 "sí" --reply-to 100000000000000001   # respuesta a un mensaje del mismo chat
```

La respuesta es un envío, por lo que todas las opciones de envío funcionan con ella.

### Reacciones y encuestas

```sh
max personal reactions add 0 100000000000000001 👍                 # una reacción; la anterior tuya se sustituye
```

```sh
max personal reactions remove 0 100000000000000001
```

```sh
max personal polls create 0 "¿Comer?" "Sí" "No" --multiple     # una encuesta como mensaje aparte
```

```sh
max personal polls show 0 100000000000000001                  # las opciones con sus id y los votos de cada una
```

```sh
max personal polls vote 0 100000000000000001 1                # voto por la opción con id 1
```

```sh
max personal polls vote 0 100000000000000001 --retract        # retirar el voto, si la encuesta lo permite
```

```sh
max personal polls close 0 100000000000000001                 # cerrar tu encuesta; no se puede reabrir
```

El interlocutor ve la reacción y la respuesta. Al leer, las reacciones se imprimen debajo del mensaje - `👍 3  🔥 1  (you: 🔥)`; en JSON este campo es `reactions`: `{counts: [{reaction, count}], mine, total}`. `null` significa "no preguntaron": con `--offline` o si MAX no respondió, entonces hay una línea en stderr sobre el motivo.

Al leer, la encuesta se imprime debajo del mensaje: pregunta, opciones con id en `[corchetes]` - esto es lo que toma `polls vote`, - el número de votos y ✓ del suyo. En JSON, este es el campo `poll` para el archivo adjunto: `{id, question, answers: [{id, text, votes, mine}], total, multiple, anonymous, revote, closed,
quiz}`. Una encuesta para una versión más reciente que la conocida se imprime en una línea sin opciones. `polls show` y respuestas `polls vote|close` - común con vista tg: `{chat_id, message_id, question, answers: [{id, text, voters,
chosen}], closed, multiple, anonymous, voters}` en `item`; para `vote` y `close` está en el campo `poll` junto a `operation_id`. Puedes volver a votar desde `--revote` en una encuesta creada por `polls create`.

web.max.ru no muestra encuestas: en lugar de una encuesta, dice "Actualizar MAX...". Cualquiera que lea el chat en un navegador no verá su encuesta, solo en la aplicación de su teléfono o computadora.

Los demás ven tu voto si la encuesta no es anónima. El comando rechaza sin consultar MAX las encuestas cerradas, varias opciones donde solo se permite una, volver a votar si no está permitido y opciones desconocidas. Votar pasa las comprobaciones de una reacción; cerrar, las de una edición; crear, las de un mensaje. Crear y cerrar cuentan en `sends_per_hour`; votar y reaccionar no. No reintenta votos automáticamente. En `max personal mcp`, votar (`max_write`, `command: "polls vote"`) y crear (`command: "polls create"`) dependen de `permissions`; cerrar (`command: "polls close"`) requiere escritura en `polls.close` ([servidor MCP](./mcp.md)).

### Editar, reenviar, anclar, eliminar

```sh
max personal messages edit 0 100000000000000001 "texto nuevo"          # solo mensajes tuyos; los adjuntos se conservan
```

```sh
max personal messages forward 0 100000000000000001 --to "Коллеги"      # reenviar un mensaje a otro chat
```

```sh
max personal messages pin 0 100000000000000001                         # fijar, sin avisar a los miembros
```

```sh
max personal messages pin 0 100000000000000001 --notify                # fijar y avisar
```

```sh
max personal messages unpin 0 100000000000000001                       # desfijar; un chat de MAX tiene un solo mensaje fijado
```

```sh
max personal messages delete 0 100000000000000001 --allow-dangerous                   # solo para ti
```

```sh
max personal messages delete 0 100000000000000001 100000000000000002 --allow-dangerous # varios, hasta 10
```

```sh
max personal messages delete 0 100000000000000001 --for-everyone --allow-dangerous    # para todos en el chat
```

El destinatario ve la edición y puede haber leído el texto anterior. MAX permite editar mensajes propios durante 7 días; no los reenviados. Reenviar crea un mensaje: aplica las comprobaciones y cuenta en `sends_per_hour`. Editar y fijar con `--notify` también cuentan; fijar silenciosamente pasa las comprobaciones pero no consume el límite.

Solo puedes fijar en un grupo o canal; MAX no fija en un chat personal ni en "Favoritos" y el comando se niega de inmediato.

<a id="удаление"></a>

La eliminación no se puede cancelar, por lo que `messages.delete` tiene el nivel predeterminado `ask`: en el terminal debe confirmar la acción y en modo JSON debe transferir `--allow-dangerous`. `allow` explícito para `permissions.messages.delete` permite la eliminación sin esta pregunta; `readonly` y `deny` lo desactivan independientemente de la bandera. De forma predeterminada, el mensaje desaparece sólo para usted; queda en manos del interlocutor. Con `--for-everyone` desaparece para todos: el interlocutor no lo devolverá.

La eliminación pasa por los mismos controles que el envío. **Cada mensaje eliminado se cuenta en `sends_per_hour`** como un envío, y no se pueden eliminar más de 10 a la vez: muchas eliminaciones seguidas son similares a la automatización, en la que MAX bloquea una cuenta. El contenido eliminado desaparece tanto del caché local como de la búsqueda.

Los ID pueden pasarse como argumentos separados o separados por comas. Tras confirmar la petición de eliminación, la herramienta lee los mensajes del servidor. Si un mensaje sigue presente o falla la comprobación, devuelve `outcome_unknown` en lugar de `deleted`. Compruébalo con `messages show` antes de repetir; la eliminación no se reintenta automáticamente.

### Si se desconoce el resultado

Al enviar, si no llega respuesta, el comando devuelve `outcome_unknown` (código `14`), **ni «enviado» ni «error»**: el mensaje pudo enviarse. El error incluye `--operation-id`, identificador para reintentar sin crear una segunda copia:

```sh
max personal messages send 0 "texto" --operation-id 1789784741828
```

MAX no crea un segundo mensaje si vino una repetición con el mismo `cid`. Si la respuesta de reenvío fue `outcome_unknown`, repítala solo con `--operation-id` debido al error; MAX dejará una copia. Una repetición sin él será una segunda copia. El mensaje diferido no se repite: comprobar `max personal messages scheduled <chat>`.

### Marcar como leído

```sh
max personal chats mark-read "Иван Петров"                  # hasta el último mensaje
```

```sh
max personal chats mark-read "Иван Петров" --until-id 100000000000000001   # hasta este mensaje, incluido
```

```sh
max personal messages list "Иван Петров" --mark-read        # leer y marcar lo mostrado
```

El destinatario verá la marca de lectura. Pasa las comprobaciones de envío: un perfil de solo lectura o la lista de destinatarios pueden bloquearla. No cuenta en el límite horario. Se rechaza con `--offline`.

### Contactos, perfil, carpetas

```sh
max personal contacts lookup                         # pide el número; o: echo "+7…" | max personal contacts lookup
```

```sh
max personal contacts add 20000002                   # el id de lookup, o parte de un nombre conocido
```

```sh
max personal contacts remove 20000002
```

```sh
max personal contacts rename 20000002 "Соседка" "Анна" # tu propio nombre para una persona; ella no lo ve
```

```sh
max personal contacts block 20000002                 # ya no podrá escribirte
```

```sh
max personal contacts unblock 20000002
```

```sh
max personal contacts profile 20000002               # perfil, fecha de creación, sus mensajes en chats compartidos
```

```sh
max personal contacts check 20000002                 # si parece un bot
```

```sh
max personal contacts import agenda.csv              # una línea: número, coma, tabulador o punto y coma, nombre
```

```sh
max personal account update --description "sobre mí"   # el nombre no cambia
```

```sh
max personal account update --photo retrato.png      # una foto de perfil nueva
```

```sh
max personal account privacy show                    # quién puede encontrarte por número, llamarte o añadirte a chats
```

```sh
max personal account privacy set --calls contacts    # solo los contactos pueden llamar; lo demás no cambia
```

```sh
max personal account privacy set --hide-online on    # ocultar "en línea" y "visto recientemente"
```

```sh
max personal chats mute "Поход"                      # sin avisos del chat, para siempre
```

```sh
max personal chats mute "Поход" --until 8h           # durante 8 horas; o hasta una fecha: --until 2026-10-09T09:00
```

```sh
max personal chats unmute "Поход"
```

```sh
max personal chats clear "Поход" --allow-dangerous   # borrar todos los mensajes para ti; los demás los conservan
```

```sh
max personal chats delete "Поход" --allow-dangerous  # borrar el chat para ti; los demás lo conservan
```

```sh
max personal calls list                              # llamadas, las más recientes primero
```

```sh
max personal account sessions end --others --yes     # cerrar sesión en todas partes salvo esta, también en el teléfono
```

```sh
max personal chats folders list
```

```sh
max personal chats folders create "Работа" --chat -1000 --chat "Проект"
```

```sh
max personal chats folders update "Работа" --title "Офис" --add -2000 --remove -1000
```

```sh
max personal chats folders delete "Офис"             # los chats se conservan
```

```sh
max personal chats folders order "Офис" "Семья"      # tras "Todos los chats": estas dos, luego el resto
```

El número de teléfono no está escrito en la línea de comando; lo ve `ps` y el historial del shell. Una persona agregada con la que no hay diálogo no aparecerá en `contacts list` (solo están aquellas con las que hay correspondencia); se puede ver a través de `contacts show <id>`. También puedes bloquear a alguien que no esté en tus contactos. MAX no proporciona un nombre corto (`@nombre`) para una cuenta personal: cualquiera se rechaza porque "Este nombre no está disponible". El nombre de la carpeta no tiene más de 20 caracteres: MAX no acepta nada más largo que eso, y `max` lo rechazará sin enviar nada. `import` envía los números de otras personas a MAX. Perfil humano y verificación de bots en detalle - [people](./people.md).

Los cambios en los contactos en JSON devuelven `{item}` con `operation_id`: `add` y `rename` - también `person` con los campos `id`, `name`, `username`; `remove`, `block` y `unblock` - `person_id`. `import` tiene los campos `sent` y `recognised`: el primero cuenta las líneas del archivo (se incluyen las repeticiones), el segundo contiene tarjetas de personas que MAX devolvió. Si MAX respondió sólo con números sin tarjetas, `recognised` está vacío; Los números no están incluidos en la respuesta.

`chats folders create` y `update` en JSON corresponden a `{item: {operation_id, folder}}` y `delete` corresponden a `{item: {operation_id, folder_id}}`. `list` devuelve una página con carpetas. Para `update` debe especificar al menos una edición: `--title`, `--add` o `--remove`. La carpeta se puede llamar por su identificación o nombre exacto; si los nombres se repiten, use la identificación de `list`.

`account update` en JSON corresponde a `{item: {operation_id, account}}`: la tarjeta contiene `id`, `name`, `username` (para MAX - `null`) y un `phone` enmascarado. La descripción posterior al cambio se puede leer a través de `account show`. Se acepta foto de perfil en JPG, JPEG, PNG o WebP. `account sessions end --others --yes` devuelve `{item: {operation_id, sessions}}`: las sesiones que quedan. Si la finalización se realiza correctamente y no se puede guardar un nuevo token o leer las sesiones restantes, el comando informa un error, pero el registro indica que la acción ya se completó.

### Botones de bot

```sh
max personal messages show <bot> 100000000000000001            # botones bajo el mensaje: [1 Sí] [2 No]
```

```sh
max personal messages press <bot> 100000000000000001 2         # pulsar el segundo botón
```

```sh
max personal messages press <bot> 100000000000000001 "Да"      # o por su texto
```

El bot ve quién hizo clic. Sólo se presionan los botones de bot normales. El resto del comando no hace clic y dice qué hacer en su lugar:

- botón de enlace: su dirección está impresa debajo del mensaje;
- un botón que envía un texto - envíalo a través de `messages send`;
- botón de miniaplicación - `chats app`.

```sh
max personal chats start <bot>                                 # iniciar el bot, como el botón "Empezar"
```

```sh
max personal chats start <bot> --start ref1                    # con un parámetro, como el enlace max.ru/<bot>?start=ref1
```

```sh
max personal chats start https://max.ru/<bot>?start=ref1       # por enlace, incluso un bot al que nunca has escrito
```

```sh
max personal chats app <bot>                                   # la dirección de la mini-app del bot
```

`chats start` acepta un chat de bot o su enlace, incluso si aún no está en tu lista; aparecerá su chat. Se rechazan enlaces a personas. Iniciar es un mensaje tuyo y pasa las mismas comprobaciones de envío. `chats app` imprime una dirección que inicia sesión como tú: mantenla privada. Quien la abra entra como tú. `max` no la escribe en registros ni archivos.

Si MAX no respondió después de iniciar o hacer clic, el comando devuelve `outcome_unknown` (código 14): es posible que el bot ya haya realizado la acción. Verifique su respuesta antes de repetir; No hay repetición automática.

Los botones “compartir teléfono” y “compartir ubicación” nunca se presionan: le dan al bot tu número o tu ubicación. Hacer clic pasa por las mismas comprobaciones que reaccionar. En `sends_per_hour` no cuenta. Los botones son visibles cuando se lee un mensaje desde MAX. No están en el archivo local.

## Grupos y canales

Escenarios para el administrador del grupo, todas las reglas y restricciones: [grupos que usted administra](./groups.md).

```sh
max personal chats inspect https://max.ru/join/…          # qué hay tras el enlace; no se une
```

```sh
max personal chats join https://max.ru/join/…             # unirse; un canal con aprobación responde requested: true
```

```sh
max personal chats leave "Семья"                          # salir
```

```sh
max personal chats create "Поход" "Аня" 20000002          # crear un grupo con personas (nombre o id)
```

```sh
max personal chats create "Новости" --channel            # un canal privado; la gente entra por enlace de invitación
```

```sh
max personal chats members list "Поход" --all             # todos los miembros: fecha de creación de la cuenta, última conexión
```

```sh
max personal chats members add "Поход" "Боря"             # sin mensajes antiguos; con --history se incluyen
```

```sh
max personal chats members remove "Поход" "Боря"
```

```sh
max personal chats admins add "Поход" "Аня" --can members,pin
```

```sh
max personal chats admins remove "Поход" "Аня"              # quitar permisos; sigue como miembro
```

```sh
max personal chats update "Поход" --title "Поход-2026" --description "en julio"
```

```sh
max personal chats update "Поход" --photo portada.jpg    # una foto de grupo nueva
```

```sh
max personal chats show "Поход"                           # los ajustes del grupo están en el campo settings
```

```sh
max personal chats update "Поход" --all-can-pin off       # cambiar un solo ajuste
```

```sh
max personal chats link show "Поход"                      # el enlace de invitación, si puedes verlo
```

```sh
max personal chats link reset "Поход"                     # un enlace nuevo; el anterior deja de funcionar
```

```sh
max personal chats requests list "Канал"                  # quién pide unirse a un canal con aprobación; solo admins
```

```sh
max personal chats requests accept "Канал" 20000002        # admitir; decline rechaza
```

```sh
max personal chats events "Поход"                         # quién entró, salió, fue añadido o eliminado, en 7 días
```

```sh
max personal chats events "Поход" 'time>=2026-09-01'         # desde el 1 de septiembre
```

**Otras personas ven** entradas, salidas, miembros añadidos y cambios de nombre. `inspect`, `link show`, `events`, `members list` y `requests list` solo leen.

**Las solicitudes para unirse** están disponibles desde un canal donde la aprobación está habilitada; el grupo cerrado no los tiene. Entonces `chats join` solo envía la solicitud y `requested: true` responde, y el canal aparecerá en la lista cuando el administrador lo acepte. `requests list` muestra quién pregunta, pero no cuándo: MAX no informa esto (`requested_at: null`). No puede responder a todos a la vez (`--all`) y seleccionar aplicaciones usando el enlace (`--link`) en MAX; el comando se negará. Las acciones pasan por los mismos controles que el envío: se rechazará un perfil de solo lectura, una lista de destinatarios solo podrá ingresar a sus chats y una acción sin nombres ni enlaces se incluirá en el registro de envío. `create`, `members add` y `requests accept` cuentan para el límite de envíos por hora, uno por persona: reciben un mensaje. Rechazar una solicitud no consume este límite. Si la lista de destinatarios está habilitada, solo podrás llamar a personas si tienes un chat privado con todos los de la lista. En caso de fallo no se repite nada: repetir `create` - segundo grupo.

Los cambios de grupos devuelven `{item}` con `operation_id` en JSON. `create`, `join`, `update` y `link reset` incluyen la ficha en `chat`; `leave` devuelve `chat_id`. Añadir miembros devuelve `{operation_id, chat_id, added, not_added}`; eliminarlos, `{operation_id, chat_id, removed}`. Tras una respuesta correcta de MAX, `not_added` está vacío: MAX no proporciona una lista de fallos parciales; rechazar una incorporación devuelve un error. `admins` devuelve `person_id`; `admins add` también incluye `rights` sin duplicados. `link show` conserva `{chat_id, title, link}`.

Cambiar título o descripción y ajustes en un mismo `update` requiere solicitudes separadas. Si el primer cambio termina pero el segundo no, la orden devuelve `outcome_unknown`: puede haberse aplicado parcialmente. Consulta `chats show` antes de repetir; no se reintenta automáticamente.

`events` lee mensajes de servicio: quién hizo qué y a quién. Eventos: `create`, creación; `add`, añadido; `remove`, eliminado; `pin`, fijado. Otros nombres se muestran tal cual. Lee hasta 2000 mensajes, antiguos primero; si hay más, indica cómo continuar.

`members list` consulta MAX, también en canales y grupos grandes; `chats
show` solo muestra personas vistas localmente. Incluye función (`owner`, `admin`, `member`, salvo que MAX no identifique administradores), creación (`registered_at`, útil para revisar cuentas nuevas) y última conexión (`last_seen_at`, vacía si está oculta). Muestra la página solicitada; `--all` lee todos los disponibles, hasta 5000. Si MAX recorta la lista o repite el marcador, avisa. `page.has_more` indica que se leyeron filas posteriores, sin garantizar acceso a toda la lista. JSON contiene `items` y `page`; sin `role`, MAX no informó del rol. `chats inspect` muestra el destino del enlace sin entrar: `id`, `kind`, `title`, `username`, `participants_count`, `description`, `member`. Si MAX no informa de `member` o `username`, son `null`.

Puedes eliminar a un participante, pero no puedes eliminar sus mensajes. Eliminar todo el chat para todos, no. Derechos de administrador para `--can`: `read`, `members`, `admins`, `info`, `pin`, `link`, `post`, `edit`, `delete`. `read`: lee todos los mensajes del grupo, como el interruptor "Leer mensajes" en la aplicación; Sin él, el bot del grupo no ve ni un solo mensaje. `link`: cambia el enlace de invitación.

### Reglas de moderación

```sh
max personal chats rules show "Поход"                          # las reglas del grupo; sin reglas, los valores predeterminados
```

```sh
max personal chats rules set "Поход" invites delete            # invitaciones a otros chats: borrar
```

```sh
max personal chats rules set "Поход" newAccount.days 3         # una cuenta de menos de tres días: marcar
```

```sh
max personal chats rules set "Поход" trusted 30000003,30000004 # las reglas no afectan a estas personas
```

```sh
max personal chats rules set "Поход" consent.delete ask        # preguntar antes de borrar
```

```sh
max personal chats rules unset "Поход" consent.delete          # volver al valor predeterminado
```

Las reglas se guardan localmente junto a la configuración; la respuesta indica el archivo. El primer `set` guarda todas las reglas predeterminadas. Puedes editarlo manualmente; `rules show` avisa si hay errores.

De forma predeterminada, ninguna regla actúa; solo informa (`report`). Una regla también puede hacer lo siguiente: `delete` elimina un mensaje y `remove` elimina a una persona. El nivel de permiso se establece por separado para cada acción (`consent.delete`, `consent.remove`): `deny`, nunca; `readonly`, solo informar; `ask`, preguntar (predeterminado); `allow`, sin preguntar. `--allow-dangerous` permite acciones de nivel `ask` durante esa ejecución. Los antiguos `forbid`, `flag` y `confirm` de los archivos se leen como `deny`, `ask` y `ask`.

### Verificación grupal

```sh
max personal chats moderate "Поход"                       # qué rompe ahora las reglas; hace lo permitido
```

```sh
max personal chats moderate "Поход" --dry-run             # solo mostrar
```

```sh
max personal chats moderate "Поход" --allow-dangerous     # hacer también lo que está en ask
```

```sh
max personal chats moderate "Поход" --since-time 2026-09-20T00:00:00Z
```

Revisa lo nuevo desde el último control, o las últimas 24 horas la primera vez: mensajes y entradas. Detecta autores bloqueados, invitaciones, enlaces, reenvíos y exceso de mensajes; en entradas, listas y edad de cuenta. No actúa sobre ti, administradores ni `trusted`.

Las reglas y consentimiento deciden qué hacer. Por defecto solo informa. Cada fila indica hallazgo, persona, regla, acción y resultado: `reported`, informado; `done`, ejecutado; `planned`, pendiente de opción o aprobación con comando manual; `forbidden`, prohibido por reglas; `declined`, rechazado por ti; `refused`, bloqueado por perfil o límite; `skipped`, no procesado.

En JSON, la respuesta es `{ item: { chat_id, rows } }`. Cada comprobación lee hasta 1000 mensajes. La posición guardada está en el archivo de reglas. `--since-time` y `--dry-run` no la avanzan. MCP de cuentas personales usa la misma posición: `max_write` (`command: "chats moderate"`).

Máximo 10 acciones (`--max-actions`). Las eliminaciones cuentan por hora; al alcanzar el límite se pospone el resto. Si queda algo pendiente, continúa desde el primero la próxima vez. Una persona eliminada puede volver por enlace; esta cuenta no permite bloquear su regreso.

No hay solicitudes para unirse a un grupo en MAX: el grupo está abierto o se ingresa a través de un enlace de invitación.

<a id="для-скриптов-и-агентов"></a>

## Salida: tabla, JSON y códigos de retorno

En la terminal, `max` imprime una tabla o cinta. `--json` es **exactamente un valor JSON en la salida estándar y nada más**: sin control giratorio, sin marca de verificación, sin advertencia. Lo mismo sucede por sí solo cuando stdout no es una terminal, es decir, en una tubería y en CI. En esto se basan los guiones y su agente.

```sh
max personal chats list --json
```

**Todas las listas son un objeto**, también las de bots. Un solo elemento es `{"item": …}`. Sin paginación, `page.limit` es la cantidad recibida y `page.has_more`, `false`:

```json
{ "items": [ … ], "page": { "limit": 20, "has_more": true }, "meta": { … } }
```

Junto a ellas pueden aparecer `next`, los comandos que conviene ejecutar después (la página siguiente la indica el paso `page.next`), y `missing`, lo que falta en la respuesta y por qué. Las claves van en snake_case.

`--all` y `--offline` usan **el mismo** objeto; `--all` incluye `has_more: false`. La forma no indica el origen: eso corresponde a códigos y diagnóstico.

`has_more` indica si puede haber otra página, no el total. Es exacto para chats y contactos contados localmente; si MAX no proporcionó todos los chats, la última página indica `has_more: true`. ⚠ **En mensajes describe nuestra copia, no todo el chat**: MAX no informa de si existen mensajes anteriores. Una página completa se toma como indicio de que hay más; tras una página corta, `max` solicita un mensaje anterior, porque una página corta también puede aparecer en medio de una conversación.

En la terminal, la línea sobre la página siguiente va **a stderr**: stdout transporta datos en cualquier modo, pero la punta de la hoja no transporta datos.

**`--jsonl` imprime un objeto por línea**, sin envoltorio, útil para flujos y `jq`. Solo stderr avisa si hay más páginas.

```sh
max personal messages list -1000 --jsonl | jq 'select(.sender_id == "111")'
```

Los errores que terminan el comando van por **stderr**, dejando stdout vacío para no confundirlos con resultados:

```json
{"error":{"code":"authentication_error","message":"no session for profile \"personal\" — run `max personal setup` in a local terminal; agents: read `max skill show`"}}
```

Las lecturas o descargas parciales pueden devolver JSON con código de salida `0`: comprueba `missing` y `next`. El JSONL de descarga parcial añade `batch_summary`; el trabajo completado se conserva.

Debe realizar la bifurcación según el código de retorno y no según el texto: el texto cambia, el código no. La tabla completa está en [referencia de comandos](./commands.md), y la más común: `4` - sin sesión, `6` - no encontrada, `9` - tiempo de espera, `14` - resultado desconocido.

```sh
if ! max personal messages send 0 "texto" --json > /dev/null; then
  case $? in
    14) echo "pudo enviarse; repetir solo con el mismo --operation-id" ;;
    4)  echo "hace falta max personal setup" ;;
  esac
fi
```

## Conectar agente de IA

Un agente de IA que ejecuta comandos en una terminal (como Claude Code, Codex o Gemini CLI) lee la habilidad `max`: reglas y trampas que `--help` no explicará. Lo pone `max personal setup`, y también `max skill install` (`--for claude`, `agents` o `all`, por defecto): escribe SKILL.md en `~/.claude/skills/max-cli/` (Claude Code) y `~/.agents/skills/max-cli/` (Codex, Gemini CLI). `max skill show` imprime el mismo texto. Después de actualizar `max`, vuelve a ejecutar `max skill install`: si la habilidad falta o es más antigua que `max`, el agente verá una línea sobre ello en stderr una vez al día. El aviso se desactiva con `max config set skill_hint false --defaults`. Cómo encuentran los agentes las habilidades: [Codex](https://learn.chatgpt.com/docs/build-skills), [Gemini CLI](https://geminicli.com/docs/cli/skills/).

Un agente sin terminal (por ejemplo, Claude Desktop o Cursor) se conecta a través de MCP: [MCP-server](./mcp.md).

## Cómo se muestra una conversación

`max personal messages list` y `max personal search messages` muestran una transcripción en la terminal:

```text
── 3 января 2026 ──

10:05:12  Анна
          созвонимся в четверг?

10:09:03  вы
          ↳ Анна: созвонимся в четверг?
          Договорились.
          📎 photo
          edited 10:09:30
```

Las horas son locales y separadores por día. `вы` son tus mensajes; si falta nombre, aparece el identificador. `↳` muestra a qué responde; `↪`, quién escribió el reenviado; `📎`, adjunto. Con color, es un enlace; sin color, aparece la dirección.

`-v` añade identificadores y direcciones de adjuntos; `-vv`, todos los datos. Versión: `max -V`.

## Nuevos mensajes a medida que llegan

`max personal watch` imprime nuevos mensajes hasta que se detiene; `max personal serve` mantiene la conexión y guarda todo en una archivo local. Cómo trabajan juntos, qué hace un servidor en la red y cómo configurarlo como servicio - [mensajes nuevos inmediatamente](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch).

## Qué hizo el comando

De forma predeterminada, solo se registran los inicios que terminan con error ([diagnostic](./diagnostics.md)). Dos cosas distintas implican el diagnóstico:

```sh
max personal chats list --trace      # mostrar, sin guardar nada
```

```sh
max personal chats list --record       # guardar, sin mostrar nada
```

`--trace` imprime una línea por petición en stderr, sin romper `--json`:

```text
→ session.login     op 19  seq 2  871 B
← session.login     op 19  seq 2  213ms  48.0 kB  25 chats  6 contacts
```

`--record` guarda lo mismo durante 30 días:

```sh
max personal runs list                 # qué se hizo, lo más reciente primero
```

```sh
max personal runs show <id>            # una ejecución: cómo terminó y a dónde fue
```

```sh
max personal runs path <id>            # el directorio, para jq y grep
```

**El registro no guarda contenido.** Operación, opcode, secuencia, identificadores, bytes y duración, sí. Títulos, nombres, textos, teléfonos y tokens, nunca; tampoco abreviados ni como hash.

## Archivo local

Todo lo que lee `max` se almacena en esta computadora para poder responder sin red: `--offline`, buscar, subir a un archivo. Qué contiene, cómo descargar el historial de chat, cargarlo y mantener la copia actualizada - [archivo local](./archive.md).

## Configuración y qué puede hacer el perfil

Archivo opcional `~/.config/max-cli/config.json`:

```json
{
  "profiles": {
    "personal": { "limit": 50, "timeout_ms": 20000, "color": true, "record": false, "keep_runs_for_days": 30 }
  }
}
```

El orden en el que se resuelve cualquier configuración es: **bandera → variable de entorno → archivo → valor incorporado**. En el archivo, el perfil es más fuerte que el `defaults` general, y las secciones `personal` y `bot` establecen valores por separado para una cuenta personal y para bots (`max personal config set --personal …`, `--bot …`). Todos los campos, incluido `permissions`, son [ajustes](./configuration.md). Un error tipográfico en el nombre del campo es un error con el nombre del campo, no con el valor predeterminado silencioso.

**No admite secretos:** el esquema no tiene campos para ellos.

<a id="что-профилю-можно"></a>

```sh
max personal config set permissions.messages readonly
```

```sh
max work config set permissions.messages.delete allow
```

```sh
max config set --defaults permissions.contacts readonly
```

Los niveles `deny`, `readonly`, `ask`, `allow` se utilizan tanto en CLI como en MCP. La clave más precisa tiene prioridad: una eliminación permitida por separado no permite el envío. Cuando `ask` el terminal pregunta; JSON requiere un indicador de confirmación explícito. `allow` no pregunta. Este ejemplo no cambia otros recursos y límites. Más detalles - [ajustes](./configuration.md).

## Una persona

`max personal contacts profile <persona>` muestra lo que MAX y el archivo local saben sobre la persona. `max personal contacts check <persona>` evalúa si parece un bot. `max personal contacts context <persona>` lee sus últimos mensajes de chat a partir de una copia y `max personal contacts link` vincula su cuenta MAX con su cuenta de Telegram. Detalles - [personas](./people.md).

## Siguiente paso

- [Archivo local](./archive.md): búsqueda, historial de descargas, carga, copia de seguridad.
- [Settings](./configuration.md) - el archivo de configuración completo.
- [Security](./security.md): qué hay en el disco y qué deja de enviarse.
- [Recetas](./recipes.md): trabajo habitual para su agente de IA.
- [Instalación](./installation.md) - instalación, actualización, donde va todo.
