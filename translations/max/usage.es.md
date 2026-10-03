---
title: "Cómo usar tu cuenta personal"
---

Esta página explica tu cuenta personal. Para bots que utilizan la Bot API oficial, consulta [bots](./bot.md).

Cada comando realiza una tarea, imprime el resultado y termina. Solo [`max serve`](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch) mantiene conexión: lo inicia en segundo plano el primer comando que necesita MAX y se detiene tras 15 minutos sin actividad.

```sh
max [профиль] [опции] <ресурс> <действие> [аргументы]
```

La [referencia](./commands.md) contiene todos los comandos y opciones y se genera desde el programa.

## Inicio

```sh
max setup --agent codex  # QR-вход и навык агента
max chats list           # ваши чаты
```

La configuración puede tardar unos cinco minutos. Comprueba hasta cinco chats sin iniciar un servicio en segundo plano. El historial se descarga aparte tras elegir el chat y la cantidad. Antes de iniciar sesión, el agente lee `max skill show`, disponible sin sesión.

`max skill show link-conversations` imprime el skill compartido para vincular conversaciones del archivo; no requiere otro inicio de sesión.

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
max account show --show-phone   # номер целиком
```

Para olvidar la sesión en este equipo:

```sh
max session end
```

`session end` elimina el token **localmente** sin avisar a MAX: la sesión creada en el navegador sigue activa. La respuesta lo indica: `revokedOnServer: false`.

## El perfil es la primera palabra

Puedes usar varias cuentas. El perfil se indica como primera palabra, no como opción:

```sh
max chats list              # профиль default
max personal chats list     # профиль personal
```

**La primera palabra es el perfil si no coincide con un comando.** Por eso no puedes llamar `chats` a un perfil; se rechaza explicando la causa.

Para toda la sesión de terminal:

```sh
export MAX_PROFILE=personal
max chats list
```

Cada perfil tiene su token y estado propios. La copia local de mensajes es compartida; sus datos se separan por cuenta.

## Leer

```sh
max chats list                      # все чаты
max chats list --limit 5            # первые пять
max chats list --unread             # только чаты с непрочитанным
max chats show "Иван Петров"        # один чат: вид, непрочитанное, последнее сообщение, участники
max contacts list                   # люди, с кем есть личный чат
max contacts show @ivan             # один человек и общие с ним чаты
max messages list 0                 # сообщения чата по id
max messages list "Иван Петров"     # или по имени чата
max messages list 0 --limit 50
```

Indica el chat por **identificador o parte del título**. Si coincide con dos chats, se muestran candidatos en lugar de adivinar: enviar al equivocado no se puede deshacer.

`contacts show` acepta **identificador, `@username` o nombre parcial**, sin elegir entre dos coincidencias. Encuentra a cualquier persona conocida por la copia local, incluidos miembros de grupos que no son contactos. Devuelve nombre, `@username` y chats compartidos, recientes primero. Solo lee; encontrar a alguien no le envía mensajes.

`chats show` devuelve los campos de `chats list` y `members`, con los participantes salvo tú. En canales, `members` es `null`: MAX solo envía cuatro suscriptores entre miles y no serían una lista completa.

Mensajes pendientes y lo recibido desde la última revisión:

```sh
max inbox                               # непрочитанное — по счётчику MAX, у каждого сообщения чат
max inbox --new                         # что пришло с прошлой проверки, каждое сообщение один раз
max inbox --new --jsonl                 # то же для скрипта: одно сообщение на строку
max inbox --since-time 2026-09-24T09:00 # разовый взгляд с этого времени
max inbox --all                         # и чаты без звука, и архив
```

**`max inbox` no marca como leído**, así que devuelve lo mismo hasta leer en la aplicación. Para tareas programadas utiliza `--new`: guarda el progreso del perfil y lo avanza solo después de imprimir. La primera revisión abarca 24 horas. `--since-time` no cambia ese punto. No muestra mensajes propios. Si un chat supera `--limit` (20 por defecto), muestra los recientes e indica por stderr cómo leer el resto. Cada ejecución lee hasta 20 chats; los demás aparecen por stderr y en `skipped`.

Omite silenciados y archivados salvo menciones o respuestas a ti; indica cuántos por stderr. `--all` los incluye.

Un mensaje y su contexto requieren chat e identificador (los siguientes son ficticios):

```sh
max messages show -1000 100000000000000001
max messages context -1000 100000000000000001 --before-n 3 --after-n 3
```

El mensaje consultado se marca con `◀` o `"anchor": true` en JSON. Si no existe, por eliminación o chat incorrecto, devuelve no encontrado, no otro mensaje. `--before-id` de `messages list` funciona con cualquier identificador porque contiene la hora. También puedes usar un localizador `msg:…` de `messages search`, sin identificador posterior.

Guarda fotos, archivos, vídeos y audio en una carpeta, la actual por defecto:

```sh
max messages download -1000 100000000000000001 --output ~/Downloads
```

Los archivos conservan nombre; otros adjuntos reciben `<id сообщения>-<номер>.<расширение>`. **No sobrescribe archivos:** se detiene y señala el conflicto. Descarga el MP4 de mayor tamaño; no llamadas, enlaces ni stickers, y lo avisa por stderr. Los archivos son legibles solo por ti (600).

### Voz a texto

Se transcribe **en tu equipo**, sin enviar la grabación. Descarga una vez el modelo mediante un comando separado:

```sh
max models audio list                # какие модели есть, какие скачаны, какая по умолчанию (*)
max models audio download gigaam-v3  # 233 МБ, один раз
max messages transcribe "Иван Петров" 100000000000000001
```

Los modelos se guardan en un directorio compartido por MAX y Telegram; `CLI_COMMON_CACHE_DIR` cambia su ubicación. `models audio list --json` devuelve una página `items/page/limit/hasMore` y la ruta `directory`. Los archivos descargados se reutilizan. `gigaam-v3` sigue primero, y `config set --defaults transcribeModel <модель>` selecciona el modelo.

| Modelo | Idiomas | Tamaño | 5 minutos de voz |
|---|---|---|---|
| `gigaam-v3`: predeterminado | ruso; el mejor para ruso | 233 MB | ~40 s |
| `gigaam-v3-ctc` | ruso; algo más rápido, peor uso de mayúsculas | 226 MB | ~36 s |
| `parakeet-v3` | 25: búlgaro, croata, checo, danés, neerlandés, inglés, estonio, finés, francés, alemán, griego, húngaro, italiano, letón, lituano, maltés, polaco, portugués, rumano, eslovaco, esloveno, español, sueco, ruso y ucraniano | 671 MB | ~60 s |

Tiempos en un portátil Ryzen AI 9 HX 470 con un hilo. Elige otro modelo para un comando con `--model parakeet-v3` o como predeterminado con `"transcribeModel": "parakeet-v3"` en `defaults`. Cada descarga se comprueba contra la suma incluida en `max`; si no coincide, no se instala.

El texto se guarda bajo tu cuenta en `messages.db`, utilizado por `messages list`, `messages transcribe`, `inbox`, `review` y MCP. Repetir la consulta por chat con el mismo modelo responde inmediatamente, sin red ni modelo. No se migran transcripciones de la antigua caché; se regeneran con `--transcribe`. La conexión se cierra antes de reconocer voz. La grabación se descarga con otra conexión; con `--no-serve`, implica otro inicio en MAX. Memoria aproximada: 700 MB o 1,3 GB para `parakeet-v3`.

Para transcribir la voz mostrada en un chat o la bandeja:

```sh
max messages list "Иван Петров" --transcribe
max inbox --transcribe
```

`--transcribe` solo procesa la voz mostrada sin texto; `--model` elige para esa ejecución. Primero descarga grabaciones, cierra la conexión y después inicia el modelo. El texto aparece con 🎤 o como `transcript` en `--json`. Los fallos aparecen en `unheard` con explicación por stderr; los mensajes se muestran igualmente. Si falta el modelo, indica cómo descargarlo sin hacerlo automáticamente. Se guardan en `~/.cache/cli-common/models/audio`, compartidos por `max` y `tg`.

Las transcripciones guardadas se muestran sin opción. Con `--offline` no se transcriben nuevas notas porque no se pueden descargar.

**Leer no marca como leído.** Son operaciones distintas y existe una prueba que lo verifica. Puedes hacerlo explícitamente y la otra persona lo verá:

```sh
max chats mark-read "Иван Петров"                  # до последнего сообщения
max chats mark-read "Иван Петров" --until 100000000000000001   # до этого сообщения включительно
max messages list "Иван Петров" --mark-read        # прочитать и отметить показанное
```

Pasa por los controles de envío: solo lectura y destinatarios pueden impedirlo; no cuenta para el límite por hora. Se rechaza con `--offline`.

### Revisar compromisos

```sh
max review                                   # всё за последние 3 дня
max review --since-time 2026-09-23T09:00     # с конца прошлого обзора
max review --since-time 2026-09-23T09:00 --transcribe --json
```

Lee mensajes propios y ajenos en chats activos desde `--since-time` para revisar promesas, pendientes y dudas. Clasificarlos corresponde a ti o al agente. No marca como leído. Hasta 300 mensajes por chat; si hay más, marca la revisión incompleta. Omite silenciados y archivados salvo menciones o respuestas, como `inbox`; `--all` los incluye.

Al terminar indica el intervalo por stderr. Empieza la siguiente revisión desde ese `--since-time` para no dejar huecos. Si está incompleta por chats, mensajes o voz sin transcribir, lo avisa; conviene no mover ese límite.

`--transcribe` procesa la voz pendiente, hasta un minuto por cinco de grabación y solo con modelo descargado ([voz a texto](#голосовые-в-текст)). Sin opción muestra textos ya guardados y enumera el resto en `unheard`.

#### Preguntas pendientes

```sh
max review --unanswered                      # вопросы, на которые сутки никто не ответил
max review --chat "Соседи" --unanswered 4h    # в одной группе, без ответа 4 часа
```

`--unanswered [длительность]` filtra preguntas pendientes para ti o administradores. Una pregunta contiene «?» o responde a ti o a un administrador. Cuenta como respuesta si contestáis directamente o sois los siguientes en hablar tras quien preguntó. Omite preguntas más recientes que `4h`, `1d` o `24h` por defecto, para dar tiempo a responder.

MAX identifica administradores al entrar, solo en chats con actividad reciente. Si no están disponibles, lo avisa y solo cuentan tus respuestas. No ve respuestas posteriores al final de la revisión. `--chat` limita a un chat, con o sin `--unanswered`.

### Páginas

`chats list`, `contacts list` y `chats members list` tienen tres opciones de paginación; `messages list`, `inbox`, `sends list` y `runs list`, solo `--limit`. `chats events` lee eventos desde una fecha sin páginas:

```sh
max contacts list --limit 5             # по пять в странице
max contacts list --limit 5 --page 2    # шестой по десятый
max contacts list --all                 # всё, без страниц
max contacts list --order name          # по алфавиту вместо «кто писал последним»
```

Rechaza combinar `--all` y `--page`. Puedes guardar `--limit` en configuración, pero no `--page` ni `--all`: un número de página solo sirve para esa consulta.

⚠ **Las páginas de una lista activa pueden repetir u omitir filas.** Un mensaje nuevo entre páginas cambia el orden de los más recientes.

**Los mensajes usan `--before-id`**, no páginas, para retroceder con precisión según su tiempo:

```sh
max messages list 0 --limit 20
max messages list 0 --before-id 116762160362694583        # id самой старой строки, которую вы видите
max messages list 0 --before-time 2026-09-20T01:00:00Z    # работает и когда того сообщения уже нет
max messages list 0 --after-id 116762160362694583         # что пришло после этого сообщения
max messages list 0 --after-time 2026-09-20T01:00:00Z     # или после этого времени
```

`--after-id` y `--after-time` avanzan, mostrando `--limit` mensajes **posteriores**, antiguos primero. stderr indica cómo continuar: `--after-id <id последней
строки>`. Usa solo una de las cuatro opciones: son puntos de inicio distintos, no extremos de un intervalo.

El mensaje de referencia no aparece con `--before-id` ni `--after-id`, aunque MAX lo devuelva, para no repetirlo entre páginas. Con `--offline`, solo funciona `--before-id` con un mensaje guardado.

Las fechas admiten ISO 8601 o intervalos anteriores como `30m`, `2h`, `1d`; `--after-time 7d` consulta la última semana. Si el identificador no está guardado, por ejemplo por eliminación, se indica otro método.

### Encontrar un chat antes de escribir

```sh
max chats list --search иван             # чаты, в названии которых есть «иван»
max chats list --search work --kind group # только группы
max chats list --unread --kind dialog    # личные чаты, где есть непрочитанное
max contacts list --search петров        # люди по имени или @username
max messages search "договор"            # по тексту сообщений, которые уже прочитаны
max messages search "договор" --chat 42  # в одном чате
```

La búsqueda requiere **tres caracteres como mínimo**. Con `--search`, `--kind` o `--unread`, `chats list` examina los 200 chats recientes y avisa si hay anteriores; con `--offline`, todos los guardados.

Utiliza después **el identificador**, que aparece en la salida y no cambia:

```sh
max messages list 42 --limit 20
max messages send 42 "текст"
```

También admite título parcial, incluido `max messages search --chat`: busca entre chats guardados sin conectarse. Por defecto usa Lucene estricto: palabras completas y un patrón explícito para prefijos, como `квартир*`. La búsqueda anterior con correcciones está disponible con `--language legacy`; `--regex` es un modo independiente sin distinguir mayúsculas. Consulta la [guía de búsqueda](./search.md).

### Quién se considera contacto

`max contacts list` muestra **personas con chat individual**, conversación reciente primero. Otros miembros de grupos se guardan con nombre y chats compartidos, pero no aparecen como contactos.

MAX no ofrece una operación para recuperar la agenda completa; solo se conocen personas de tus chats. Se actualizan con cada inicio de sesión, pidiendo **solo cambios** desde el anterior.

```sh
max contacts sync     # забыть, где остановились, и забрать список заново
```

Es una reparación para una copia desincronizada o reiniciada tras cambio de esquema, no una operación habitual. Devuelve cantidades, sin nombres, teléfonos ni descripciones.

## Enviar

```sh
max messages send 0 "текст"
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
max messages send 0 "напоминание" --at-time 2h                # или через 30m, 2h, 1d
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
max reactions add 0 100000000000000001 👍                 # реакция; прежняя ваша заменяется
```

Son visibles para la otra persona. Retira tu reacción con `max reactions remove 0 100000000000000001`.

Aparecen bajo el mensaje como `👍 3  🔥 1  (you: 🔥)`; en JSON, `reactions`: `{counts: [{reaction, count}], mine, total}`. `null` significa que no se consultó, con `--offline` o sin respuesta de MAX; stderr explica la causa.

### Editar, reenviar y fijar

```sh
max messages edit 0 100000000000000001 "новый текст"          # только своё; вложения остаются
max messages forward 0 100000000000000001 --to "Коллеги"      # переслать одно сообщение в другой чат
max messages pin 0 100000000000000001                         # закрепить, без уведомления участникам
max messages pin 0 100000000000000001 --notify                # закрепить и уведомить
max messages unpin 0 100000000000000001                       # открепить; в чате MAX закреплено одно сообщение
```

La otra persona ve la edición y puede haber leído el texto anterior. MAX permite editar durante 7 días, pero no mensajes reenviados. El reenvío pasa por los controles y cuenta para `sendsPerHour`, igual que editar y fijar con `--notify`. Fijar sin aviso pasa controles pero no cuenta. Ante `outcome_unknown` en reenvíos, repite solo con `--send-id` para mantener una copia; sin él duplica.

Solo se fija en grupos o canales, no chats individuales ni Favoritos; se rechazan antes de conectar.

### Eliminar

```sh
max messages delete 0 100000000000000001 --allow-dangerous                   # только у вас
max messages delete 0 100000000000000001 100000000000000002 --allow-dangerous # несколько, до 10
max messages delete 0 100000000000000001 --for-everyone --allow-dangerous    # у всех в чате
```

Es irreversible: sin `--allow-dangerous`, rechaza sin preguntar. Por defecto solo elimina tu copia; con `--for-everyone`, la de todos, sin posibilidad de recuperar.

Aplica los controles de envío. **Cada mensaje eliminado cuenta para `sendsPerHour`**; máximo 10 por ejecución porque muchas eliminaciones parecen automatización y pueden provocar bloqueo. También desaparecen de caché y búsqueda.

### Encuestas

```sh
max polls create 0 "Обед?" "Да" "Нет" --multiple     # опрос отдельным сообщением
max polls show 0 100000000000000001                  # варианты с id и сколько за каждый
max polls vote 0 100000000000000001 1                # голос за вариант с id 1
max polls vote 0 100000000000000001 --retract        # снять голос, если опрос это разрешает
max polls close 0 100000000000000001                 # закрыть свой опрос; открыть снова нельзя
```

Se muestran pregunta, respuestas con identificador en `[скобках]`, votos y ✓ en tu opción. `polls vote` usa ese identificador. En JSON, el adjunto contiene `poll`: `{id, question, answers: [{id, text, votes, mine}], total, multiple, anonymous, revote, closed,
quiz}`. Versiones desconocidas se muestran sin respuestas. `polls show` y `polls vote|close` utilizan el formato compartido con tg: `{chatId, messageId, question, answers: [{id, text, voters,
chosen}], closed, multiple, anonymous, voters}`. En `vote` y `close`, está bajo `poll` junto a `operationId`. `--revote` en `polls create` permite cambiar el voto.

web.max.ru no muestra encuestas: indica «Actualiza MAX…». Solo pueden verse en aplicaciones móviles o de escritorio.

Los votos son visibles salvo encuestas anónimas. Rechaza antes de consultar MAX si está cerrada, eliges varias opciones donde solo cabe una, cambias un voto no modificable o el identificador no existe. Votar pasa como reacción, cerrar como edición y crear como mensaje. Crear y cerrar cuentan para `sendsPerHour`; votar no. No reintenta votos automáticamente. `max_polls_vote` y `max_polls_create` en `max mcp` necesitan `--allow-send`; `max_polls_close`, `polls` en `mcpTools` ([MCP](./mcp.md)).

### Contactos, perfil y carpetas

```sh
max contacts lookup                         # спросит номер; или: echo "+7…" | max contacts lookup
max contacts add 20000002                   # id из lookup, или часть известного имени
max contacts remove 20000002
max contacts rename 20000002 "Соседка" "Анна" # своё имя для человека; он его не видит
max contacts block 20000002                 # больше не сможет вам писать
max contacts unblock 20000002
max contacts import книжка.csv              # строка: номер, запятая, табуляция или точка с запятой, имя
max account update --description "о себе"   # имя остаётся прежним
max account update --photo портрет.png      # новое фото профиля
max account sessions list                   # где ещё выполнен вход
max account sessions end --others --yes     # выйти везде, кроме этого сеанса — и на телефоне
max chats folders list
max chats folders create "Работа" --chat -1000 --chat "Проект"
max chats folders update "Работа" --title "Офис" --add -2000 --remove -1000
max chats folders delete "Офис"             # чаты остаются
```

No introduzcas teléfonos en argumentos, visibles en `ps` e historial. Contactos sin chat no aparecen en `contacts list`, pero sí en `contacts show <id>`. Se puede bloquear a alguien que no es contacto. MAX no permite nombre corto (`@имя`) en cuentas personales: devuelve «This name is unavailable». Las carpetas tienen máximo 20 caracteres; `max` rechaza nombres más largos sin enviar. `import` entrega a MAX teléfonos ajenos.

Los cambios de contactos devuelven `operationId` en JSON: `add` y `rename` también incluyen `person` con `id`, `name`, `username`; `remove`, `block` y `unblock`, `personId`. `import` incluye `sent` y `recognised`: el primero cuenta las filas, incluidos duplicados; el segundo contiene las fichas de personas devueltas por MAX. Si MAX devuelve solo números, `recognised` queda vacío; los teléfonos no aparecen en la respuesta.

`chats folders create` y `update` devuelven `{operationId, folder}` en JSON; `delete`, `{operationId, folderId}`. `list` devuelve una página de carpetas. `update` necesita al menos un cambio: `--title`, `--add` o `--remove`. Usa el ID o nombre exacto de la carpeta; si hay nombres repetidos, elige el ID de `list`.

`account update` devuelve `{operationId, account}` en JSON: la ficha contiene `id`, `name`, `username` (`null` en MAX) y `phone` oculto parcialmente. Lee la descripción con `account show`. La foto admite JPG, JPEG, PNG y WebP. `account sessions end --others --yes` devuelve `{operationId, sessions}` con las sesiones restantes. Si las sesiones se cerraron pero falla guardar el token nuevo o leer las restantes, la orden da error y el registro conserva la acción ya realizada.

### Fotos, vídeos, archivos y voz

```sh
max messages send 0 "отчёт" --file отчёт.pdf
max messages send 0 "с дачи" --file ролик.mp4          # видео, которое смотрят прямо в чате
max messages send 0 --file ролик.mp4 --as-file       # то же видео файлом для скачивания
max messages send 0 --photo снимок.png                # фото
max messages send 0 --voice заметка.ogg              # голосовое сообщение
```

Con `--file`, `.jpg .jpeg .png .webp .gif` se envían como foto; `.mp4 .mov .webm .mkv`, vídeo; el resto, archivo. `--as-file` conserva como archivo incluso vídeos. `--photo` acepta `.jpg .png .webp`. Se permite un adjunto `--file` y otro `--photo`, pero **vídeos y archivos deben ir solos**; se rechaza antes de subir. El texto es opcional. Si falla la subida, no se envía. No admite varios archivos por mensaje. Rechaza `--no-preview`: el cliente MAX tampoco lo admite.

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

```sh
max chats inspect https://max.ru/join/…          # что за ссылкой; не вступает
max chats join https://max.ru/join/…             # вступить в группу или канал
max chats leave "Семья"                          # выйти
max chats create "Поход" "Аня" 20000002          # создать группу с людьми (имя или id)
max chats create "Новости" --channel            # закрытый канал; люди входят по ссылке-приглашению
max chats members list "Поход" --all             # все участники: когда заведён аккаунт, когда был в сети
max chats members add "Поход" "Боря"             # без старых сообщений; с ними — --history
max chats members remove "Поход" "Боря"
max chats admins add "Поход" "Аня" --can members,pin
max chats admins remove "Поход" "Аня"              # снять права; участником остаётся
max chats update "Поход" --title "Поход-2026" --description "в июле"
max chats show "Поход"                           # настройки группы — в поле settings
max chats update "Поход" --all-can-pin off       # поменять одну
max chats link show "Поход"                      # ссылка-приглашение, если вам её видно
max chats link reset "Поход"                     # новая ссылка; старая перестаёт работать
max chats events "Поход"                         # кто вступил, вышел, кого добавили и удалили — за 7 дней
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
max chats rules set "Поход" invites delete            # приглашения в чужие чаты — удалять
max chats rules set "Поход" newAccount.days 3         # аккаунт моложе трёх дней — отметить
max chats rules set "Поход" trusted 30000003,30000004 # этих людей правила не трогают
max chats rules set "Поход" consent.delete ask        # перед удалением — спрашивать
max chats rules unset "Поход" consent.delete          # вернуть значение по умолчанию
```

Se guardan localmente junto a la configuración; la respuesta indica el archivo. El primer `set` guarda todas las reglas predeterminadas. Puedes editarlo manualmente; `rules show` avisa si hay errores.

Por defecto las reglas solo informan (`report`). También pueden eliminar mensajes (`delete`) o personas (`remove`). `consent.delete` y `consent.remove` controlan cada acción: `deny`, nunca; `readonly`, solo informar; `ask`, preguntar (predeterminado); `allow`, sin preguntas. `--allow-dangerous` permite acciones de nivel `ask` en esta ejecución. En archivos anteriores, `forbid` equivale a `deny`; `flag` y `confirm`, a `ask`.

#### Revisar el grupo

```sh
max chats moderate "Поход"                       # что нового нарушает правила; делает то, что разрешено
max chats moderate "Поход" --dry-run             # только показать
max chats moderate "Поход" --allow-dangerous     # сделать и то, что стоит на уровне ask
max chats moderate "Поход" --since-time 2026-09-20T00:00
```

Revisa lo nuevo desde el último control, o las últimas 24 horas la primera vez: mensajes y entradas. Detecta autores bloqueados, invitaciones, enlaces, reenvíos y exceso de mensajes; en entradas, listas y edad de cuenta. No actúa sobre ti, administradores ni `trusted`.

Las reglas y consentimiento deciden qué hacer. Por defecto solo informa. Cada fila indica hallazgo, persona, regla, acción y resultado: `reported`, informado; `done`, ejecutado; `planned`, pendiente de opción o aprobación con comando manual; `forbidden`, prohibido por reglas; `declined`, rechazado por ti; `refused`, bloqueado por perfil o límite; `skipped`, no procesado.

La respuesta JSON es `{ chatId, rows }`. Se leen hasta 1000 mensajes por comprobación. El punto guardado está en el archivo de reglas; el anterior, de la sesión, se migra automáticamente. `--since-time` y `--dry-run` no lo cambian. MCP personal comparte ese punto y conserva `max_chats_check`.

Máximo 10 acciones (`--max-actions`). Las eliminaciones cuentan por hora; al alcanzar el límite se pospone el resto. Si queda algo pendiente, continúa desde el primero la próxima vez. Una persona eliminada puede volver por enlace; esta cuenta no permite bloquear su regreso.

MAX no tiene solicitudes de entrada: los grupos son abiertos o usan invitaciones.

## Para scripts y agentes

```sh
max chats list --json
```

`--json` imprime **un único valor JSON por stdout**, sin indicadores ni avisos. Lo hace automáticamente si stdout no es terminal, como tuberías y CI.

**Todas las listas son un objeto**, también las de bots. Sin paginación, `page` vale 1, `limit` la cantidad recibida y `hasMore`, `false`:

```json
{ "items": [ … ], "page": 1, "limit": 20, "hasMore": true }
```

`--all` y `--offline` usan **el mismo** objeto; `--all` incluye `page: 1` y `hasMore: false`. La forma no indica el origen: eso corresponde a códigos y diagnóstico.

`hasMore` indica si hay otra página, no el total. Es exacto para chats y contactos, contados localmente. ⚠ **En mensajes describe nuestra copia, no todo el chat:** una página completa anterior solo prueba que hay más detrás.

En terminal muestra tablas y la indicación de la página siguiente va por **stderr**: stdout siempre contiene datos.

**`--jsonl` imprime un objeto por línea**, sin envoltorio, útil para flujos y `jq`. Solo stderr avisa si hay más páginas.

```sh
max messages list -1000 --jsonl | jq 'select(.senderId == "111")'
```

## Cómo se muestra una conversación

`max messages list` y `max messages search` muestran una transcripción en la terminal:

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
max runs show <id>            # один запуск: чем кончился и куда ходил
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

Prioridad: **opción → variable de entorno → archivo → programa**. En el archivo, perfil antes que `defaults`; `personal` y `bot` separan cuentas y bots (`max config set --personal …`, `--bot …`). Consulta todos los campos, incluidos `defaultProfile` y `mcpTools`, en [configuración](./configuration.md). Las erratas son errores explícitos, no valores predeterminados silenciosos.

**No admite secretos:** el esquema no tiene campos para ellos.

### Permisos del perfil

`allow` enumera acciones permitidas. Sin lista se permite todo.

```sh
max work config set allow send,reaction      # только писать и ставить реакции
max work config unset allow                  # снова всё
max config set --defaults allow send          # для всех профилей, у которых нет своего списка
```

Permisos: `send` para texto, archivos, respuestas y programados; `forward`, `reaction`, `edit`, `pin`, `read` para marcar como leído; `delete`, `groups` para grupos y canales; `contacts`, `profile`, `folders`, `sessions` para cerrar otras sesiones. No hay comodín: menciona `delete` o `sessions` expresamente.

La lista del perfil sustituye a `defaults`, no se suma. Vacía impide cambios como `readOnly`, que tiene prioridad sobre toda lista. Rechaza con código `5` antes de conectar, indicando cómo autorizar. Eliminar sigue requiriendo `--allow-dangerous`.

## Siguientes pasos

- [Referencia de comandos](./commands.md): generada desde el programa.
- [Configuración](./configuration.md): todos los ajustes.
- [Instalación](./installation.md): instalar, actualizar y encontrar archivos.

`sends list` usa el `limit` configurado si se omite `--limit`. JSON incluye `items`, `page`, `limit`, `hasMore`; `limit` es el límite seleccionado, no el número de filas. JSONL imprime un registro de intento de envío por línea.
