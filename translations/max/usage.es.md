---
title: "Cómo usar tu cuenta personal"
---

Esta página explica tu cuenta personal. Para bots que utilizan la Bot API oficial, consulta [bots](./bot.md).

Cada comando realiza una tarea, imprime el resultado y termina. Solo [`max serve`](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch) mantiene conexión: lo inicia en segundo plano el primer comando que necesita MAX y se detiene tras 15 minutos sin actividad.

```sh
max [профиль] [опции] <ресурс> <действие> [аргументы]
```

La [referencia](./commands.md) contiene todos los comandos y opciones y se genera desde el programa.

## Lee un chat con tu agente

Con la cuenta conectada, pide un resumen breve. Esta tarea lee mensajes y no envía nada.

**Tu petición:**

> Resume los cinco últimos mensajes de Книжный клуб. Muestra decisiones y preguntas pendientes. No envíes nada.

**Comando:**

```sh
max messages list "Книжный клуб" --limit 5 --json
```

**Ejemplo de respuesta del agente:**

> **Decisión:** la próxima reunión será el jueves a las 18:00.
>
> **Pendiente:** dónde reunirse.
>
> Puedo mostrar los mensajes que sustentan el resumen. No se ha enviado nada.

El resumen siguiente es ficticio. Pide abrir los mensajes originales antes de confiar en la interpretación del agente. Las secciones siguientes explican la configuración, las acciones con mensajes y los permisos.

## Inicio

```sh
max setup --agent codex  # QR-вход и навык агента
```

```sh
max chats list           # ваши чаты
```

La configuración puede tardar unos cinco minutos. El comando comprueba hasta cinco chats sin iniciar un servicio en segundo plano. El historial se descarga por separado después de elegir el chat y la cantidad. Antes de iniciar sesión, el agente lee `max skill show`, disponible sin sesión. `max skill show link-conversations` muestra el skill compartido para vincular conversaciones del archivo; no requiere otro inicio de sesión.

## Iniciar sesión

Para empezar, usa `max setup`. Para volver a iniciar sesión explícitamente, ejecuta `max session start qr`: escanea el QR del terminal con MAX y el token se guarda en el llavero. Consulta todos los métodos en [sesiones](./sessions.md). Sin método, `max session start` **importa un token** obtenido en el cliente oficial y lo guarda en el llavero del sistema.

```sh
max session start
MAX token: ▏               # ввод не отображается
```

**El token no se pasa como argumento:** sería visible en `ps` para todos los procesos y quedaría en el historial. Se solicita sin mostrarse o se lee por stdin:

```sh
pass show max/token | max session start
```

Para CI y ejecuciones puntuales, `MAX_TOKEN` tiene prioridad sobre el almacén:

```sh
MAX_TOKEN="$(cat /path/to/token)" max chats list
```

Comprueba tu identidad:

```sh
max account show                # номер телефона — только последние 4 цифры
```

```sh
max account show --show-phone   # номер целиком
```

Cerrar sesión en MAX y olvidar la sesión en este ordenador:

```sh
max session end
```

`session end` termina la sesión en el servidor de MAX (`revokedOnServer: true`). Si copiaste el token de una pestaña de web.max.ru, también se cierra la sesión de esa pestaña.

## El perfil es la primera palabra

Puedes usar varias cuentas. El perfil se indica como primera palabra, no como opción:

```sh
max chats list              # профиль default
```

```sh
max personal chats list     # профиль personal
```

**La primera palabra es el perfil si no coincide con un comando.** Por eso no puedes llamar `chats` a un perfil; se rechaza explicando la causa.

Para toda la sesión de terminal:

```sh
export MAX_PROFILE=personal
max chats list
```

Cada perfil tiene su token y estado propios. La copia local de mensajes es compartida; sus datos se separan por cuenta.

`max account list` muestra cada perfil de este ordenador y su cuenta sin consultar MAX.

## Leer

```sh
max chats list                      # все чаты
```

```sh
max chats list --limit 5            # первые пять
```

```sh
max chats list --unread             # только чаты с непрочитанным
```

```sh
max chats show "Иван Петров"        # один чат: вид, непрочитанное, последнее сообщение, участники
```

```sh
max contacts list                   # люди, с кем есть личный чат
```

```sh
max contacts show @ivan             # один человек и общие с ним чаты
```

```sh
max messages list 0                 # сообщения чата по id
```

```sh
max messages list "Иван Петров"     # или по имени чата
```

```sh
max messages list 0 --limit 50
```

Identifica el chat por **su ID o parte del título**. Si el fragmento coincide con dos chats, el comando no adivina y muestra los candidatos: enviar al chat equivocado es irreversible.

`contacts show` acepta **identificador, `@username` o nombre parcial**, sin elegir entre dos coincidencias. Encuentra a cualquier persona conocida por la copia local, incluidos miembros de grupos que no son contactos. Devuelve nombre, `@username` y chats compartidos, recientes primero. Solo lee; encontrar a alguien no le envía mensajes.

`chats show` devuelve los campos de `chats list` y `members`, con los participantes salvo tú. En canales, `members` es `null`: MAX solo envía cuatro suscriptores entre miles y no serían una lista completa.

Los mensajes no leídos de todos los chats y los recibidos desde la última comprobación:

```sh
max inbox                               # непрочитанное — по счётчику MAX, у каждого сообщения чат
```

```sh
max inbox --new                         # что пришло с прошлой проверки, каждое сообщение один раз
```

```sh
max inbox --new --jsonl                 # то же для скрипта: одно сообщение на строку
```

```sh
max inbox --since-time 2026-09-24T09:00 # разовый взгляд с этого времени
```

```sh
max inbox --all                         # и чаты без звука, и архив
```

**`max inbox` no marca nada como leído**, por lo que devuelve lo mismo hasta que leas los mensajes en la aplicación. Para ejecutarlo de forma programada, usa `--new`: la posición se guarda en el perfil y solo avanza cuando se imprime la salida. El primer `--new` revisa las últimas 24 horas. `--since-time` no cambia esa posición. No se muestran tus propios mensajes. Si hay más de `--limit` mensajes en un chat (20 de forma predeterminada), se muestran los más recientes y stderr indica un comando para leer el resto. Cada ejecución lee como máximo 20 chats; los restantes aparecen en stderr y en `skipped`.

Omite silenciados y archivados salvo menciones o respuestas a ti; indica cuántos por stderr. `--all` los incluye.

Un mensaje y su contexto: el chat y el ID del mensaje son obligatorios (los ID son ficticios):

```sh
max messages show -1000 100000000000000001
```

```sh
max messages context -1000 100000000000000001 --before-n 3 --after-n 3
```

El mensaje consultado se marca con `◀` o `"anchor": true` en JSON. Si no existe, por eliminación o chat incorrecto, devuelve no encontrado, no otro mensaje. `--before-id` de `messages list` funciona con cualquier identificador porque contiene la hora. También puedes usar un localizador `msg:…` de `search messages`, sin identificador posterior.

Los adjuntos del mensaje —fotos, archivos, vídeos y audio— se guardan en una carpeta (la actual de forma predeterminada):

```sh
max messages download -1000 100000000000000001 --output-dir ~/Downloads
```

`--output` sigue siendo un alias compatible de `--output-dir`; no pases directorios distintos a ambos. Se crea el directorio si falta. El JSON de un mensaje contiene `{items}`; JSONL emite un registro de archivo por línea.

Para el chat completo: `max messages download -1000 --all --output-dir ~/Downloads --pause 5s`. Al repetir, continúa desde el progreso guardado y mantiene los archivos ya descargados.

`max messages evidence -1000 --limit 20 --json` devuelve un paquete limitado del archivo local, con locators e información de integridad, sin conectar con MAX. Selecciona mensajes anteriores con `--before-id`. El paquete no confirma que el historial esté completo.

Los archivos conservan el nombre; los demás adjuntos usan `<id сообщения>-<номер>.<расширение>`. **No sobrescribe archivos existentes**: se detiene con un error que los identifica. El vídeo se guarda como el MP4 más grande; llamadas, enlaces y stickers no se descargan y generan un aviso en stderr. Los archivos son legibles solo por el propietario (permisos 600). Los audios tienen `kind: voice` en JSON; los adjuntos sin nombre reciben la extensión según el MIME HTTP.

### Enlace al mensaje

`max messages link <chat> <message>` o `max messages link <msg:locator>` devuelve `{ locator, url, access, reason }`. MAX personal valida primero el mensaje en el archivo local y devuelve un locator; el formato de enlace nativo aún no está verificado. `--offline` no conecta. Rechaza locators de otra cuenta. `messages links` sigue siendo el comando de relaciones entre conversaciones.

### Voz a texto

Consulta la selección de modelos, los comandos y los límites en la [guía de reconocimiento de voz](./audio-recognition.md).

Los mensajes de voz se transcriben **en tu ordenador**: las grabaciones no se envían a ningún sitio. Descarga el modelo de reconocimiento una vez con un comando independiente:

```sh
max models audio list                # какие модели есть, какие скачаны, какая по умолчанию (*)
```

```sh
max models audio download gigaam-v3  # 233 МБ, один раз
```

```sh
max messages transcribe "Иван Петров" 100000000000000001
```

Los modelos se guardan en un directorio compartido por MAX y Telegram; `CLI_COMMON_CACHE_DIR` cambia su ubicación. `models audio list --json` devuelve una página `items/page/limit/hasMore` y la ruta `directory`. Los archivos descargados se reutilizan. `gigaam-v3` sigue primero, y `config set --defaults transcribeModel <модель>` selecciona el modelo.

| Modelo | Idiomas | Tamaño | 5 minutos de voz |
|---|---|---|---|
| `gigaam-v3`: predeterminado | ruso; el mejor para ruso | 233 MB | ~40 s |
| `gigaam-v3-ctc` | ruso; algo más rápido, peor uso de mayúsculas | 226 MB | ~36 s |
| `parakeet-v3` | 25: búlgaro, croata, checo, danés, neerlandés, inglés, estonio, finés, francés, alemán, griego, húngaro, italiano, letón, lituano, maltés, polaco, portugués, rumano, eslovaco, esloveno, español, sueco, ruso y ucraniano | 671 MB | ~60 s |

Tiempos en un portátil Ryzen AI 9 HX 470 con un hilo. Elige otro modelo para un comando con `--model parakeet-v3` o como predeterminado con `"transcribeModel": "parakeet-v3"` en `defaults`. Cada descarga se comprueba contra la suma incluida en `max`; si no coincide, no se instala.

El texto se guarda bajo tu cuenta en la base compartida `messages.db`, usada por `messages list`, `messages transcribe`, `inbox`, `review` y MCP. Repetir con el id del chat y el mismo modelo responde de inmediato, sin red ni reconocimiento. Las transcripciones del antiguo caché de perfil no se migran; `--transcribe` las genera de nuevo. La grabación se descarga mediante la conexión de lectura y esta se cierra antes del reconocimiento local. No hace falta un segundo acceso. Se necesitan unos 700 MB de memoria (`parakeet-v3`, 1,3 GB).

Transcribir los mensajes de voz de los resultados del chat o de la bandeja de entrada en una ejecución:

```sh
max messages list "Иван Петров" --transcribe
```

```sh
max inbox --transcribe
```

`--transcribe` procesa solo los mensajes de voz mostrados que todavía no tienen texto; `--model` elige el modelo para una ejecución. Primero `max` descarga todas las grabaciones necesarias y después cierra la conexión antes de ejecutar el modelo. El texto aparece bajo el mensaje de voz con el icono 🎤, o en `transcript` con `--json`. Las transcripciones fallidas se enumeran en `unheard`, con el motivo en stderr; los mensajes se muestran igualmente. Si el modelo no está descargado, el comando indica cómo descargarlo, pero no lo hace automáticamente. Los modelos se guardan en `~/.cache/cli-common/models/audio`, una copia compartida por `max` y `tg`.

Las transcripciones guardadas se muestran sin opción. Con `--offline` no se transcriben nuevas notas porque no se pueden descargar.

**Leer no marca nada como leído.** El protocolo separa la obtención del historial de la marca de lectura. La segunda operación no se envía salvo que la pidas, y una prueba lo verifica. Puedes marcar explícitamente un chat como leído; la otra persona lo verá:

```sh
max chats mark-read "Иван Петров"                  # до последнего сообщения
```

```sh
max chats mark-read "Иван Петров" --until 100000000000000001   # до этого сообщения включительно
```

```sh
max messages list "Иван Петров" --mark-read        # прочитать и отметить показанное
```

Pasa por los controles de envío: solo lectura y destinatarios pueden impedirlo; no cuenta para el límite por hora. Se rechaza con `--offline`.

### Revisar compromisos

```sh
max review                                   # всё за последние 3 дня
```

```sh
max review --since-time 2026-09-23T09:00     # с конца прошлого обзора
```

```sh
max review --since-time 2026-09-23T09:00 --transcribe --json
```

Lee mensajes propios y ajenos en chats activos desde `--since-time` para revisar promesas, pendientes y dudas. Clasificarlos corresponde a ti o al agente. No marca como leído. Hasta 300 mensajes por chat; si hay más, marca la revisión incompleta. Omite silenciados y archivados salvo menciones o respuestas, como `inbox`; `--all` los incluye.

Al terminar indica el intervalo por stderr. Empieza la siguiente revisión desde ese `--since-time` para no dejar huecos. Si está incompleta por chats, mensajes o voz sin transcribir, lo avisa; conviene no mover ese límite.

`--transcribe` procesa la voz pendiente, hasta un minuto por cinco de grabación y solo con modelo descargado ([voz a texto](#голосовые-в-текст)). Sin opción muestra textos ya guardados y enumera el resto en `unheard`.

#### Preguntas pendientes

```sh
max review --unanswered                      # вопросы, на которые сутки никто не ответил
```

```sh
max review --chat "Соседи" --unanswered 4h    # в одной группе, без ответа 4 часа
```

`--unanswered [длительность]` conserva preguntas pendientes para ti o los administradores. Una pregunta contiene «?» en el texto o transcripción, o responde a un mensaje tuyo o de un administrador. Siempre considera las transcripciones guardadas; `--transcribe` reconoce nuevas grabaciones antes de filtrar. Una grabación sin reconocer deja la revisión incompleta. Se considera respondida si tú o un administrador contestasteis o hablasteis justo después del autor. Omite preguntas más recientes que el plazo, como `4h` o `1d` (por defecto `24h`), porque aún no ha habido tiempo de contestar.

MAX identifica administradores al entrar, solo en chats con actividad reciente. Si no están disponibles, lo avisa y solo cuentan tus respuestas. No ve respuestas posteriores al final de la revisión. `--chat` limita a un chat, con o sin `--unanswered`.

### Páginas

`chats list`, `contacts list` y `chats members list` tienen tres opciones de paginación; `messages list`, `inbox`, `sends list` y `runs list`, solo `--limit`. `chats events` lee eventos desde una fecha sin páginas:

```sh
max contacts list --limit 5             # по пять в странице
```

```sh
max contacts list --limit 5 --page 2    # шестой по десятый
```

```sh
max contacts list --all                 # всё, без страниц
```

```sh
max contacts list --order name          # по алфавиту вместо «кто писал последним»
```

Rechaza combinar `--all` y `--page`. Puedes guardar `--limit` en configuración, pero no `--page` ni `--all`: un número de página solo sirve para esa consulta.

⚠ **Las páginas de una lista activa pueden repetir u omitir filas.** Un mensaje nuevo entre páginas cambia el orden de los más recientes.

**Los mensajes usan `--before-id`**, no páginas, para retroceder con precisión según su tiempo:

```sh
max messages list 0 --limit 20
```

```sh
max messages list 0 --before-id 116762160362694583        # id самой старой строки, которую вы видите
```

```sh
max messages list 0 --before-time 2026-09-20T01:00:00Z    # работает и когда того сообщения уже нет
```

```sh
max messages list 0 --after-id 116762160362694583         # что пришло после этого сообщения
```

```sh
max messages list 0 --after-time 2026-09-20T01:00:00Z     # или после этого времени
```

`--after-id` y `--after-time` avanzan, mostrando `--limit` mensajes **posteriores**, antiguos primero. stderr indica cómo continuar: `--after-id <id последней
строки>`. Usa solo una de las cuatro opciones: son puntos de inicio distintos, no extremos de un intervalo.

El mensaje de referencia no aparece con `--before-id` ni `--after-id`, aunque MAX lo devuelva, para no repetirlo entre páginas. Con `--offline`, solo funciona `--before-id` con un mensaje guardado.

Las fechas admiten ISO 8601 o intervalos anteriores como `30m`, `2h`, `1d`; `--after-time 7d` consulta la última semana. Si el identificador no está guardado, por ejemplo por eliminación, se indica otro método.

### Encontrar un chat antes de escribir

```sh
max chats list --search иван             # чаты, в названии которых есть «иван»
```

```sh
max chats list --search work --kind group # только группы
```

```sh
max chats list --unread --kind dialog    # личные чаты, где есть непрочитанное
```

```sh
max contacts list --search петров        # люди по имени или @username
```

```sh
max search messages "договор"            # по тексту сообщений, которые уже прочитаны
```

```sh
max search messages "договор" --chat 42  # в одном чате
```

El texto de búsqueda debe tener **al menos tres caracteres**: dos letras coinciden con demasiados elementos para resultar útiles. `chats list` con `--search`, `--kind` o `--unread` revisa todos los chats que MAX proporcionó al iniciar sesión e indica `partial` si MAX no los proporcionó todos. Con `--offline`, revisa todos los chats guardados.

Cuando encuentres el chat, utiliza su **ID** de la salida; no cambia:

```sh
max messages list 42 --limit 20
```

```sh
max messages send 42 "текст"
```

También se acepta parte del título, incluso en `max search messages --chat`. Los nombres se buscan entre los chats guardados y la búsqueda en un chat también consulta al servidor de MAX (`--backend archive` usa solo el archivo). La búsqueda utiliza Lucene estricto de forma predeterminada: una palabra encuentra otras formas, un prefijo requiere un patrón explícito como `квартир*` y `exact:квартира` busca solo la forma exacta. La búsqueda antigua con correcciones está disponible mediante `--language legacy`; `--regex` es un modo independiente de expresiones regulares que no distingue mayúsculas. Consulta [búsqueda](./search.md).

### Cuántos mensajes coinciden

`max stats messages show` cuenta mensajes del archivo local sin conectarse a MAX. Sin consulta, cuenta todos los mensajes guardados de la cuenta actual; con consulta, cuenta las coincidencias de Lucene estricto como `search messages`. Cada mensaje se cuenta una sola vez.

```sh
max stats messages show "договор" --by chat --json
```

```sh
max stats messages show --by sender --chat "Работа" --limit 10 --json
```

```sh
max stats messages show --by day --timezone Europe/Madrid --json
```

```sh
max stats messages show --by hour --timezone UTC --jsonl
```

`--by` agrupa por chat, remitente, día natural u hora. `--limit` limita las filas, y `total` es el número de todos los mensajes que coinciden. En un archivo incompleto, las cifras son un límite inferior: revisa `coverage` y `completeness` antes de tomar la ausencia de coincidencias como prueba. Para incluir todas las cuentas de MAX guardadas, añade `--source max` explícitamente; sin él, los demás perfiles no entran en el resultado. El JSON contiene `by`, `items`, `total`, `page`, `limit`, `hasMore`, `query`, `coverage` y `completeness`; JSONL imprime las filas de `items`.

### Quién se considera contacto

`max contacts list` muestra **personas con chat individual**, conversación reciente primero. Otros miembros de grupos se guardan con nombre y chats compartidos, pero no aparecen como contactos.

MAX no ofrece una operación para recuperar la agenda completa; solo se conocen personas de tus chats. Se actualizan con cada inicio de sesión, pidiendo **solo cambios** desde el anterior.

```sh
max contacts sync     # забыть, где остановились, и забрать список заново
```

Es una reparación para una copia desincronizada o reiniciada tras cambio de esquema, no una operación habitual. Devuelve cantidades, sin nombres, teléfonos ni descripciones.

### Tus nombres y notas sobre personas

```sh
max contacts alias set "Борис Тестов" Боря          # своё имя для человека, только на этом компьютере
```

```sh
max contacts alias rm "Борис Тестов"
```

```sh
max contacts notes add "Борис Тестов" --file note.txt   # или текст из stdin
```

```sh
max contacts notes list "Борис Тестов"
```

```sh
max contacts notes edit "Борис Тестов" <id> --revision 1 --file note.txt
```

```sh
max contacts notes remove "Борис Тестов" <id>
```

```sh
max contacts show "Борис Тестов" --with-notes
```

```sh
max contacts list --search-notes квартира           # люди, в чьих заметках есть это слово
```

Los nombres personalizados y las notas permanecen en la copia local de esta cuenta y no se envían a MAX. `contacts rename` cambia un nombre en la agenda de MAX; es una operación distinta. Los comandos pueden encontrar a una persona por tu nombre personalizado salvo que coincida con el de otra; en ese caso, usa un ID. `--revision` protege frente a la edición de una nota desactualizada.

## Enviar

```sh
max messages send 0 "текст"
```

```sh
max messages send "Иван Петров" "текст"
```

`--topic` corresponde a foros de Telegram. MAX la rechaza en `messages send` y `polls create` antes de enviar; no la uses en chats normales.

No pide confirmación: destinatario y texto ya están en el comando.

### Texto desde stdin

Omite el último argumento para leer el cuerpo desde stdin:

```sh
echo "текст" | max messages send 0
max messages send 0 <<'EOF'
первая строка

третья
EOF
cat письмо.txt | max messages send 0
```

Así puedes enviar **varias líneas** y evitar texto en `ps` o historial, como con tokens. Conserva todos los saltos salvo uno al final, normalmente añadido por `echo`, para no acabar cada mensaje con línea vacía.

⚠ **Si stdin es una terminal, rechaza en lugar de esperar.** `max messages send 0` sin texto se trata como argumento olvidado.

Sin respuesta devuelve `outcome_unknown`, código `14`: el mensaje puede haber llegado. El error incluye `--send-id` para repetir sin duplicar:

```sh
max messages send 0 "текст" --send-id 1789784741828
```

MAX no crea otra copia si el reintento utiliza el mismo `cid`.

### Enviar más tarde

```sh
max messages send 0 "напоминание" --at-time 2026-09-25T09:00   # местное время
```

```sh
max messages send 0 "напоминание" --at-time 2h                # или через 30m, 2h, 1d
```

```sh
max messages scheduled 0                                       # что ждёт отправки в этом чате
```

El mensaje espera **en MAX** y se envía con el equipo apagado. Se redondea hacia abajo al minuto. Rechaza menos de un minuto o más de un año.

- Devuelve `{sendId, operationId, message, scheduledFor}` con mensaje y hora. **Al enviarse tendrá otro identificador.**
- Rechaza `--silent`: MAX notifica siempre los programados.
- Los controles de solo lectura, destinatarios y límite por hora se aplican ahora, al añadirlo a la cola.
- Sin respuesta no reintenta: `outcome_unknown` indica revisar la cola y rechaza `--send-id` con `--at-time`. No se ha comprobado si MAX evita duplicados programados.
- **Cancela o edita en la aplicación MAX.** `max` no envía la eliminación.

### Respuestas y reacciones

```sh
max messages send 0 "да" --reply-to 100000000000000001   # ответ на сообщение в том же чате
```

```sh
max reactions add 0 100000000000000001 👍                 # реакция; прежняя ваша заменяется
```

Son visibles para la otra persona. Retira tu reacción con `max reactions remove 0 100000000000000001`.

Aparecen bajo el mensaje como `👍 3  🔥 1  (you: 🔥)`; en JSON, `reactions`: `{counts: [{reaction, count}], mine, total}`. `null` significa que no se consultó, con `--offline` o sin respuesta de MAX; stderr explica la causa.

### Editar, reenviar y fijar

```sh
max messages edit 0 100000000000000001 "новый текст"          # только своё; вложения остаются
```

```sh
max messages forward 0 100000000000000001 --to "Коллеги"      # переслать одно сообщение в другой чат
```

```sh
max messages pin 0 100000000000000001                         # закрепить, без уведомления участникам
```

```sh
max messages pin 0 100000000000000001 --notify                # закрепить и уведомить
```

```sh
max messages unpin 0 100000000000000001                       # открепить; в чате MAX закреплено одно сообщение
```

La otra persona ve la edición y puede haber leído el texto anterior. MAX permite editar durante 7 días, pero no mensajes reenviados. El reenvío pasa por los controles y cuenta para `sendsPerHour`, igual que editar y fijar con `--notify`. Fijar sin aviso pasa controles pero no cuenta. Ante `outcome_unknown` en reenvíos, repite solo con `--send-id` para mantener una copia; sin él duplica.

Solo se fija en grupos o canales, no chats individuales ni Favoritos; se rechazan antes de conectar.

### Eliminar

```sh
max messages delete 0 100000000000000001 --allow-dangerous                   # только у вас
```

```sh
max messages delete 0 100000000000000001 100000000000000002 --allow-dangerous # несколько, до 10
```

```sh
max messages delete 0 100000000000000001 --for-everyone --allow-dangerous    # у всех в чате
```

Eliminar no se puede deshacer; `messages.delete` tiene nivel `ask` por defecto. Confirma en la terminal o pasa `--allow-dangerous` en JSON. Un `allow` explícito para `permissions.messages.delete` permite borrar sin preguntar; `readonly` y `deny` lo impiden independientemente de la opción. Por defecto el mensaje desaparece solo para ti. Con `--for-everyone` desaparece para todos y la otra persona no puede restaurarlo.

Aplica los controles de envío. **Cada mensaje eliminado cuenta para `sendsPerHour`**; máximo 10 por ejecución porque muchas eliminaciones parecen automatización y pueden provocar bloqueo. También desaparecen de caché y búsqueda.

### Encuestas

```sh
max polls create 0 "Обед?" "Да" "Нет" --multiple     # опрос отдельным сообщением
```

```sh
max polls show 0 100000000000000001                  # варианты с id и сколько за каждый
```

```sh
max polls vote 0 100000000000000001 1                # голос за вариант с id 1
```

```sh
max polls vote 0 100000000000000001 --retract        # снять голос, если опрос это разрешает
```

```sh
max polls close 0 100000000000000001                 # закрыть свой опрос; открыть снова нельзя
```

Se muestran pregunta, respuestas con identificador en `[скобках]`, votos y ✓ en tu opción. `polls vote` usa ese identificador. En JSON, el adjunto contiene `poll`: `{id, question, answers: [{id, text, votes, mine}], total, multiple, anonymous, revote, closed,
quiz}`. Versiones desconocidas se muestran sin respuestas. `polls show` y `polls vote|close` utilizan el formato compartido con tg: `{chatId, messageId, question, answers: [{id, text, voters,
chosen}], closed, multiple, anonymous, voters}`. En `vote` y `close`, está bajo `poll` junto a `operationId`. `--revote` en `polls create` permite cambiar el voto.

web.max.ru no muestra encuestas: indica «Actualiza MAX…». Solo pueden verse en aplicaciones móviles o de escritorio.

Otros miembros pueden ver tu voto si la encuesta no es anónima. El comando rechaza localmente los votos no válidos como el cliente web: encuesta cerrada, varias opciones donde solo se permite una, segundo voto donde no se puede cambiar el voto o ID de opción inexistente. Votar, cerrar y crear encuestas pasan las mismas comprobaciones que enviar: un voto se trata como una reacción, cerrar como editar y una encuesta nueva como un mensaje. Las encuestas nuevas y los cierres cuentan para `sendsPerHour`; los votos, como las reacciones, no. Los votos no se repiten automáticamente. Para agentes, `max_write` (`command: "polls vote"`) y `max_write` (`command: "polls create"`) en `max mcp` requieren `permissions`; `max_write` (`command: "polls close"`) requiere el permiso de escritura `polls.close` ([mcp.md](./mcp.md)).

### Botones de bots

```sh
max messages show <бот> 100000000000000001            # кнопки под сообщением: [1 Да] [2 Нет]
```

```sh
max messages press <бот> 100000000000000001 2         # нажать вторую кнопку
```

```sh
max messages press <бот> 100000000000000001 "Да"      # или по её тексту
```

El bot ve quién pulsó. Solo se pulsan botones de callback normales. Para otros tipos, el comando explica la siguiente acción: la dirección de un enlace aparece bajo el mensaje; usa `messages send` para un botón de texto y `chats app` para una miniaplicación.

```sh
max chats start <бот>                                 # запустить бота, как кнопка «Начать»
```

```sh
max chats start <бот> --payload ref1                  # с параметром, как ссылка max.ru/<бот>?start=ref1
```

```sh
max chats start https://max.ru/<бот>?start=ref1       # по ссылке — и бота, которому вы ещё не писали
```

```sh
max chats app <бот>                                   # адрес мини-приложения бота
```

`chats start` acepta un chat de bot o su enlace, incluso si aún no está en tu lista; aparecerá su chat. Se rechazan enlaces a personas. Iniciar es un mensaje tuyo y pasa las mismas comprobaciones de envío. `chats app` imprime una dirección que inicia sesión como tú: mantenla privada. Quien la abra entra como tú. `max` no la escribe en registros ni archivos.

Si se pierde la respuesta al inicio o pulsación, `outcome_unknown` (salida 14) indica que el bot ya pudo actuar. Comprueba su respuesta antes de repetir; no hay reintento automático. Nunca se pulsan botones de compartir teléfono o ubicación. Las pulsaciones pasan comprobaciones de reacción y no cuentan en `sendsPerHour`. Los botones se ven en mensajes leídos de MAX y no están en la copia local.

### Contactos, perfil y carpetas

```sh
max contacts lookup                         # спросит номер; или: echo "+7…" | max contacts lookup
```

```sh
max contacts add 20000002                   # id из lookup, или часть известного имени
```

```sh
max contacts remove 20000002
```

```sh
max contacts rename 20000002 "Соседка" "Анна" # своё имя для человека; он его не видит
```

```sh
max contacts block 20000002                 # больше не сможет вам писать
```

```sh
max contacts unblock 20000002
```

```sh
max contacts profile 20000002               # профиль, дата создания, его сообщения по общим чатам
```

```sh
max contacts check 20000002                 # похож ли на бота; подробнее — people.md
```

```sh
max contacts import книжка.csv              # строка: номер, запятая, табуляция или точка с запятой, имя
```

```sh
max account update --description "о себе"   # имя остаётся прежним
```

```sh
max account update --photo портрет.png      # новое фото профиля
```

```sh
max account sessions list                   # где ещё выполнен вход
```

```sh
max account privacy show                    # кто находит по номеру, звонит, добавляет в чаты
```

```sh
max stickers list                           # наборы стикеров; --set <id> — стикеры набора с их id
```

```sh
max messages send 0 --sticker 51            # стикер, один, без текста
```

```sh
max account privacy set --calls contacts    # звонить могут только контакты; остальное не меняется
```

```sh
max account privacy set --hide-online on    # скрыть «в сети» и «был недавно»
```

```sh
max chats mute "Поход"                      # без уведомлений из чата, насовсем
```

```sh
max chats mute "Поход" --until 8h           # на 8 часов; или до даты: --until 2026-10-09T09:00
```

```sh
max chats unmute "Поход"
```

```sh
max chats clear "Поход" --allow-dangerous   # удалить все сообщения у себя; у остальных останутся
```

```sh
max chats delete "Поход" --allow-dangerous  # удалить чат у себя; у остальных он останется
```

```sh
max calls list                              # звонки, новые сверху
```

```sh
max account sessions end --others --yes     # выйти везде, кроме этого сеанса — и на телефоне
```

```sh
max chats folders list
```

```sh
max chats folders create "Работа" --chat -1000 --chat "Проект"
```

```sh
max chats folders update "Работа" --title "Офис" --add -2000 --remove -1000
```

```sh
max chats folders delete "Офис"             # чаты остаются
```

```sh
max chats folders order "Офис" "Семья"      # после «Все чаты»: эти две, затем остальные
```

No introduzcas teléfonos en argumentos, visibles en `ps` e historial. Contactos sin chat no aparecen en `contacts list`, pero sí en `contacts show <id>`. Se puede bloquear a alguien que no es contacto. MAX no permite nombre corto (`@имя`) en cuentas personales: devuelve «This name is unavailable». Las carpetas tienen máximo 20 caracteres; `max` rechaza nombres más largos sin enviar. `import` entrega a MAX teléfonos ajenos.

Los cambios de contactos devuelven `operationId` en JSON: `add` y `rename` también incluyen `person` con `id`, `name`, `username`; `remove`, `block` y `unblock`, `personId`. `import` incluye `sent` y `recognised`: el primero cuenta las filas, incluidos duplicados; el segundo contiene las fichas de personas devueltas por MAX. Si MAX devuelve solo números, `recognised` queda vacío; los teléfonos no aparecen en la respuesta.

`chats folders create` y `update` devuelven `{operationId, folder}` en JSON; `delete`, `{operationId, folderId}`. `list` devuelve una página de carpetas. `update` necesita al menos un cambio: `--title`, `--add` o `--remove`. Usa el ID o nombre exacto de la carpeta; si hay nombres repetidos, elige el ID de `list`.

`account update` devuelve `{operationId, account}` en JSON: la ficha contiene `id`, `name`, `username` (`null` en MAX) y `phone` oculto parcialmente. Lee la descripción con `account show`. La foto admite JPG, JPEG, PNG y WebP. `account sessions end --others --yes` devuelve `{operationId, sessions}` con las sesiones restantes. Si las sesiones se cerraron pero falla guardar el token nuevo o leer las restantes, la orden da error y el registro conserva la acción ya realizada.

### Medios del chat

```sh
max chats media "Поход"                           # фото, видео, файлы, аудио и ссылки, как галерея в MAX
```

```sh
max chats media "Поход" --type photo,video        # только фото и видео
```

```sh
max chats media "Поход" --before-id <id>          # то, что старше этого сообщения
```

La lista viene del servidor MAX e incluye medios que aún no se han descargado aquí. Leerla no marca nada como leído.

### Fotos, vídeos, archivos y voz

```sh
max messages send 0 "отчёт" --file отчёт.pdf
```

```sh
max messages send 0 "с дачи" --file ролик.mp4          # видео, которое смотрят прямо в чате
```

```sh
max messages send 0 --file ролик.mp4 --as-file       # то же видео файлом для скачивания
```

```sh
max messages send 0 --photo снимок.png                # фото
```

```sh
max messages send 0 --voice заметка.ogg              # голосовое сообщение
```

Con `--file`, `.jpg .jpeg .png .webp .gif` se envían como fotos, `.mp4 .mov .webm .mkv` como vídeos y el resto como archivos. Con `--as-file`, el adjunto de `--file` se envía como archivo, también si es un vídeo. `--photo` solo admite `.jpg .png .webp`. Un mensaje puede contener un adjunto de `--file` y otro de `--photo`; **los vídeos y archivos deben enviarse solos**, y el comando rechaza las combinaciones no válidas antes de subirlos. El texto es opcional. Si la subida falla, no se envía nada. Actualmente `max` no envía varios archivos en un mensaje. `--no-preview` no está disponible en MAX: su propio cliente no lo permite y el comando lo rechaza.

`--voice` envía una nota con duración y forma de onda, sin texto ni otros archivos. Requiere Ogg Opus, como MAX; convierte otro audio primero:

```sh
ffmpeg -i запись.m4a -ac 1 -ar 48000 -c:a libopus -b:a 32k заметка.ogg
```

Rechaza archivos ocultos, carpetas ocultas como `~/.ssh` y carpetas de `max`, que suelen contener claves. Si necesitas enviarlos, usa `--allow-any-file`.

Con `--md`, MAX usa su propio conversor: `**жирный**` o `__жирный__`, `_курсив_` o `*курсив*`, `~~зачёркнутый~~`, `++подчёркнутый++`, `[ссылка](https://example.com)` y código monoespaciado entre comillas invertidas o en bloque. Los estilos pueden anidarse; las posiciones se calculan en UTF-16. Los saltos de línea en código de una línea se convierten en espacios; MAX no conserva el lenguaje de un bloque. Sin la opción, el texto se envía literalmente. `_` y `*` dentro de palabras siguen siendo literales; la barra inversa escapa un signo. Los enlaces admiten http, https y mailto; se rechaza un bloque de código sin cerrar.

El conversor MAX Bot API también admite `^^выделение^^`, encabezados con `#` y citas con `>`; convierte el resultado de forma segura a HTML. El protocolo personal rechaza estas tres formas antes de enviar o cargar un archivo. `||spoiler||` permanece como texto literal en MAX. Telegram tiene otra sintaxis: `__текст__` significa subrayado allí, pero negrita en MAX.

```sh
max messages send 0 "встреча **в 15:00**, не _в 14_" --md
```

### Grupos y canales

Consulta escenarios, reglas y límites en [administrar grupos](./groups.md).

**Solicitudes para canales.** La aprobación corresponde a canales, no a grupos privados. `chats join` devuelve `requested: true`; el canal aparece cuando acepta un administrador. `requests list` muestra a las personas pendientes sin fechas (`requestedAt: null`). No admite acciones masivas ni filtros `--link`. `requests accept` consume una unidad del límite horario por persona; rechazar no lo consume. Consulta la guía de administración anterior para conocer los límites de solicitudes para canales.

```sh
max chats inspect https://max.ru/join/…          # что за ссылкой; не вступает
```

```sh
max chats join https://max.ru/join/…             # вступить; канал с одобрением ответит requested: true
```

```sh
max chats leave "Семья"                          # выйти
```

```sh
max chats create "Поход" "Аня" 20000002          # создать группу с людьми (имя или id)
```

```sh
max chats create "Новости" --channel            # закрытый канал; люди входят по ссылке-приглашению
```

```sh
max chats members list "Поход" --all             # все участники: когда заведён аккаунт, когда был в сети
```

```sh
max chats members add "Поход" "Боря"             # без старых сообщений; с ними — --history
```

```sh
max chats members remove "Поход" "Боря"
```

```sh
max chats admins add "Поход" "Аня" --can members,pin
```

```sh
max chats admins remove "Поход" "Аня"              # снять права; участником остаётся
```

```sh
max chats update "Поход" --title "Поход-2026" --description "в июле"
```

```sh
max chats update "Поход" --photo обложка.jpg    # новое фото группы
```

```sh
max chats show "Поход"                           # настройки группы — в поле settings
```

```sh
max chats update "Поход" --all-can-pin off       # поменять одну
```

```sh
max chats link show "Поход"                      # ссылка-приглашение, если вам её видно
```

```sh
max chats link reset "Поход"                     # новая ссылка; старая перестаёт работать
```

```sh
max chats requests list "Канал"                  # кто просится в канал с одобрением; видят только админы
```

```sh
max chats requests accept "Канал" 20000002        # впустить; decline — отказать
```

```sh
max chats events "Поход"                         # кто вступил, вышел, кого добавили и удалили — за 7 дней
```

```sh
max chats events "Поход" --type add,remove --since-time 2026-09-01T00:00
```

**Son cambios visibles para otros:** entrar, salir, añadir personas o renombrar. Solo leen `inspect`, `link show`, `events` y `members list`. Pasan por los mismos controles que los envíos: solo lectura rechaza cambios y la lista de destinatarios restringe chats. El registro conserva la acción sin nombres ni enlaces. `create` y `members add` cuentan una vez por persona en el límite horario: reciben un mensaje. Con la lista activa solo puedes invitar a personas cuyo chat individual esté permitido. No se reintenta tras un fallo; repetir `create` crea otro grupo.

Los cambios de grupos devuelven `operationId` en JSON. `create`, `join`, `update` y `link reset` incluyen la ficha en `chat`; `leave` devuelve `chatId`. Añadir miembros devuelve `{operationId, chatId, added, notAdded}`; eliminarlos, `{operationId, chatId, removed}`. Tras una respuesta correcta de MAX, `notAdded` está vacío: MAX no proporciona una lista de fallos parciales; rechazar una incorporación devuelve un error. `admins` devuelve `personId`; `admins add` también incluye `rights` sin duplicados. `link show` conserva `{chatId, title, link}`.

Cambiar título o descripción y ajustes en un mismo `update` requiere solicitudes separadas. Si el primer cambio termina pero el segundo no, la orden devuelve `outcome_unknown`: puede haberse aplicado parcialmente. Consulta `chats show` antes de repetir; no se reintenta automáticamente.

`events` lee mensajes de servicio: quién hizo qué y a quién. Eventos: `create`, creación; `add`, añadido; `remove`, eliminado; `pin`, fijado. Otros nombres se muestran tal cual. Lee hasta 2000 mensajes, antiguos primero; si hay más, indica cómo continuar.

`members list` consulta MAX, también en canales y grupos grandes; `chats
show` solo muestra personas vistas localmente. Incluye función (`owner`, `admin`, `member`, salvo que MAX no identifique administradores), creación (`registeredAt`, útil para revisar cuentas nuevas) y última conexión (`lastSeenAt`, vacía si está oculta). Muestra la página solicitada; `--all` lee todos los disponibles, hasta 5000. Si MAX recorta la lista o repite el marcador, avisa. `hasMore` indica que se leyeron filas posteriores, sin garantizar acceso a toda la lista. JSON contiene `items`, `page`, `limit`, `hasMore`; sin `role`, MAX no informó del rol. `chats inspect` muestra el destino del enlace sin entrar: `id`, `kind`, `title`, `username`, `participantsCount`, `description`, `member`. Si MAX no informa de `member` o `username`, son `null`.

Puedes eliminar miembros, no todos sus mensajes ni el chat completo. Permisos `--can`: `read`, `members`, `admins`, `info`, `pin`, `link`, `post`, `edit`, `delete`. `read` permite leer todos los mensajes como «Read messages» en la aplicación; sin él, el bot no ve ninguno. `link` permite cambiar invitaciones.

#### Reglas de moderación

```sh
max chats rules show "Поход"                          # правила группы; без них — значения по умолчанию
```

```sh
max chats rules set "Поход" invites delete            # приглашения в чужие чаты — удалять
```

```sh
max chats rules set "Поход" newAccount.days 3         # аккаунт моложе трёх дней — отметить
```

```sh
max chats rules set "Поход" trusted 30000003,30000004 # этих людей правила не трогают
```

```sh
max chats rules set "Поход" consent.delete ask        # перед удалением — спрашивать
```

```sh
max chats rules unset "Поход" consent.delete          # вернуть значение по умолчанию
```

Se guardan localmente junto a la configuración; la respuesta indica el archivo. El primer `set` guarda todas las reglas predeterminadas. Puedes editarlo manualmente; `rules show` avisa si hay errores.

De forma predeterminada, ninguna regla actúa; solo informa (`report`). Una regla también puede hacer lo siguiente: `delete` elimina un mensaje y `remove` elimina a una persona. El nivel de permiso se establece por separado para cada acción (`consent.delete`, `consent.remove`): `deny`, nunca; `readonly`, solo informar; `ask`, preguntar (predeterminado); `allow`, sin preguntar. `--allow-dangerous` permite acciones de nivel `ask` durante esa ejecución. Los antiguos `forbid`, `flag` y `confirm` de los archivos se leen como `deny`, `ask` y `ask`.

#### Revisar el grupo

```sh
max chats moderate "Поход"                       # что нового нарушает правила; делает то, что разрешено
```

```sh
max chats moderate "Поход" --dry-run             # только показать
```

```sh
max chats moderate "Поход" --allow-dangerous     # сделать и то, что стоит на уровне ask
```

```sh
max chats moderate "Поход" --since-time 2026-09-20T00:00
```

Revisa lo nuevo desde el último control, o las últimas 24 horas la primera vez: mensajes y entradas. Detecta autores bloqueados, invitaciones, enlaces, reenvíos y exceso de mensajes; en entradas, listas y edad de cuenta. No actúa sobre ti, administradores ni `trusted`.

Las reglas y consentimiento deciden qué hacer. Por defecto solo informa. Cada fila indica hallazgo, persona, regla, acción y resultado: `reported`, informado; `done`, ejecutado; `planned`, pendiente de opción o aprobación con comando manual; `forbidden`, prohibido por reglas; `declined`, rechazado por ti; `refused`, bloqueado por perfil o límite; `skipped`, no procesado.

En JSON, la respuesta es `{ chatId, rows }`. Cada comprobación lee hasta 1000 mensajes. La posición guardada está en el archivo de reglas; una posición antigua de la sesión se migra automáticamente. `--since-time` y `--dry-run` no la avanzan. MCP de cuentas personales usa la misma posición al guardar `max_write` (`command: "chats check"`).

Máximo 10 acciones (`--max-actions`). Las eliminaciones cuentan por hora; al alcanzar el límite se pospone el resto. Si queda algo pendiente, continúa desde el primero la próxima vez. Una persona eliminada puede volver por enlace; esta cuenta no permite bloquear su regreso.

MAX no tiene solicitudes de entrada: los grupos son abiertos o usan invitaciones.

## Scripts y agentes

```sh
max chats list --json
```

`--json` imprime **un único valor JSON por stdout**, sin indicadores ni avisos. Lo hace automáticamente si stdout no es terminal, como tuberías y CI.

**Todas las listas son un objeto**, también las de bots. Sin paginación, `page` vale 1, `limit` la cantidad recibida y `hasMore`, `false`:

```json
{ "items": [ … ], "page": 1, "limit": 20, "hasMore": true }
```

`--all` y `--offline` usan **el mismo** objeto; `--all` incluye `page: 1` y `hasMore: false`. La forma no indica el origen: eso corresponde a códigos y diagnóstico.

`hasMore` indica si puede haber otra página, no el total. Es exacto para chats y contactos contados localmente; si MAX no proporcionó todos los chats, la última página indica `hasMore: true`. ⚠ **En mensajes describe nuestra copia, no todo el chat**: MAX no informa de si existen mensajes anteriores. Una página completa se toma como indicio de que hay más; tras una página corta, `max` solicita un mensaje anterior, porque una página corta también puede aparecer en medio de una conversación.

En terminal muestra tablas y la indicación de la página siguiente va por **stderr**: stdout siempre contiene datos.

**`--jsonl` imprime un objeto por línea**, sin envoltorio, útil para flujos y `jq`. Solo stderr avisa si hay más páginas.

```sh
max messages list -1000 --jsonl | jq 'select(.senderId == "111")'
```

## Cómo se muestra una conversación

`max messages list` y `max search messages` muestran una transcripción en la terminal:

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

Horas locales y separadores por día. `вы` son tus mensajes; si falta nombre, aparece el identificador. `↳` muestra a qué responde; `↪`, quién escribió el reenviado; `📎`, adjunto. Con color, es un enlace; sin color, aparece la dirección.

`-v` añade identificadores y direcciones de adjuntos; `-vv`, todos los datos. Versión: `max -V`.

Los errores van por **stderr**, dejando stdout vacío para no confundirlos con resultados:

```json
{"error":{"code":"authentication_error","message":"no session for profile \"default\" — run `max setup` in a local terminal; agents: read `max skill show`"}}
```

Decide por código de salida, no por texto. Tabla completa en [referencia](./commands.md); habituales: `4`, sin sesión; `6`, no encontrado; `9`, tiempo agotado; `14`, resultado desconocido.

```sh
if ! max messages send 0 "текст" --json > /dev/null; then
  case $? in
    14) echo "могло уйти, повторять только с тем же --send-id" ;;
    4)  echo "нужен max setup" ;;
  esac
fi
```

## Archivo local y nuevos mensajes

Consulta qué guarda `max`, cómo actualizar (`max serve`, `max watch`), descargar historiales y exportarlos en [archivo local](./archive.md).

## Qué hizo el comando

Por defecto solo se registran fallos ([diagnóstico](./diagnostics.md)). Dos opciones independientes permiten diagnosticar:

```sh
max chats list --trace      # показать, ничего не сохраняя
```

```sh
max chats list --record       # сохранить, ничего не показывая
```

`--trace` imprime una línea por petición en stderr, sin romper `--json`:

```text
→ session.login     op 19  seq 2  871 B
← session.login     op 19  seq 2  213ms  48.0 kB  25 chats  6 contacts
```

`--record` guarda lo mismo durante 30 días:

```sh
max runs list                 # что делалось, новое сверху
```

```sh
max runs show <id>            # один запуск: чем кончился и куда ходил
```

```sh
max runs path <id>            # каталог, для jq и grep
```

**No guarda contenido.** Operación, opcode, secuencia, identificadores, bytes y duración, sí. Títulos, nombres, textos, teléfonos y tokens, nunca; tampoco abreviados ni como hash.

## Configuración

Archivo opcional `~/.config/max-cli/config.json`:

```json
{
  "defaultProfile": "personal",
  "profiles": {
    "personal": { "limit": 50, "timeoutMs": 20000, "color": true, "record": false, "keepRunsForDays": 30 }
  }
}
```

Los ajustes se resuelven en este orden: **opción → variable de entorno → archivo → valor incorporado**. En el archivo, el perfil tiene prioridad sobre `defaults`; `personal` y `bot` definen valores separados para cuentas personales y bots (`max config set --personal …`, `--bot …`). Todos los campos, incluidos `defaultProfile` y `permissions`, están en [configuration.md](./configuration.md). Un nombre mal escrito provoca un error que lo identifica, no un valor predeterminado silencioso.

**No admite secretos:** el esquema no tiene campos para ellos.

### Permisos del perfil

```sh
max config set permissions.messages readonly
```

```sh
max work config set permissions.messages.delete allow
```

```sh
max config set --defaults permissions.contacts readonly
```

Los niveles `deny`, `readonly`, `ask` y `allow` se aplican en CLI y MCP. La clave más específica tiene prioridad: permitir eliminar no permite enviar. Con `ask`, la terminal pregunta y JSON exige una opción explícita de confirmación. `allow` no pregunta. El ejemplo no cambia otros recursos ni límites. Convierte `readOnly`, `allow` y `mcpTools` mediante `config migrate`; previsualiza con `config migrate --dry-run`. Consulta [configuration.md](./configuration.md).

## Siguiente paso

- [Referencia de comandos](./commands.md): generada desde el programa.
- [Configuración](./configuration.md): todos los ajustes.
- [Instalación](./installation.md): instalar, actualizar y encontrar archivos.

`sends list` usa el `limit` configurado si se omite `--limit`. JSON incluye `items`, `page`, `limit`, `hasMore`; `limit` es el límite seleccionado, no el número de filas. JSONL imprime un registro de intento de envío por línea.

`account show --json` conserva los campos MAX `id`, `name`, `phone` y `description`, añadiendo `username: null` para el formato compartido. El teléfono sigue oculto; `--show-phone` lo revela explícitamente completo.

## Personas

`contacts profile`, `contacts context`, `contacts check` y `contacts link` muestran lo que MAX y la copia local saben sobre una persona, sus mensajes recientes por chat y si parece un bot: [people.md](./people.md).

## Gráficos de estadísticas

`max stats charts` devuelve una descripción del gráfico en JSON. `--output activity.svg` también guarda un SVG con tema oscuro; `--output activity.png` guarda un PNG. Pasa como argumento del comando un chat encontrado con `max chats list`. `--chart-kind messages` muestra mensajes, `active` autores activos y `membership` entradas y salidas. `--by day` o `week` establece el periodo; las semanas empiezan el lunes. `--timezone` se aplica a las fechas del calendario.

El nombre de chat `synthetic-group` de este ejemplo es ficticio:

```sh
max stats charts synthetic-group --chart-kind messages --by day --timezone Europe/Madrid --output activity.svg --json
```

JSON contiene `chart`; al guardar una imagen, también contiene `chartFile` con la ruta y el tamaño. Las imágenes solo se escriben en archivos nuevos, sin sobrescribir. Las fechas ausentes quedan como huecos y los datos incompletos se indican en la descripción y la imagen. `membership` requiere eventos del chat en línea y no está disponible con `--offline`. MCP `max_read` (`command: "stats charts"`) devuelve JSON del almacenamiento local sin conectarse ni escribir archivos; `format: "png"` añade una imagen PNG y JSON con `chart` y el tamaño de `image`. Allí no están disponibles las entradas y salidas. La lectura respeta el permiso `messages`. No se admiten `--jsonl` ni imágenes en stdout.

![Gráfico con datos ficticios](https://raw.githubusercontent.com/leemour/max-cli/823c82da0cdf4e07924dfe016ddc4602754daa03/docs/images/stats-charts.png)

Clasificaciones de mensajes y autores: [métricas, puntuaciones y evidence](./rankings.md).
